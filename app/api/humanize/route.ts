import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MASTER_SYSTEM_PROMPT, TONE_INSTRUCTIONS, ENGINE_CONFIG } from "@/lib/prompts";
import { getUserSubscription, incrementWordsUsed } from "@/lib/db";
import { countWords } from "@/lib/utils";
import { TIERS } from "@/lib/stripe";

const requestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters").max(25000, "Text exceeds maximum length"),
  engine: z.enum(["standard", "ultra"]).default("standard"),
  tone: z.enum(["casual", "academic", "professional"]).default("casual"),
});

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  config: { temperature: number; maxTokens: number }
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      top_p: 0.95,
      frequency_penalty: 0.6,
      presence_penalty: 0.5,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `OpenAI API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  config: { temperature: number; maxTokens: number }
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `Anthropic API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text, engine, tone } = validation.data;

    const subscription = await getUserSubscription(userId);
    const tierConfig = TIERS[subscription.tier];

    if (!tierConfig.engines.includes(engine as never)) {
      return NextResponse.json(
        {
          error: `The ${engine} engine requires the ${engine === "ultra" ? "Stealth Author" : "Incognito Agency"} plan or higher.`,
        },
        { status: 403 }
      );
    }

    if (!tierConfig.tones.includes(tone as never)) {
      return NextResponse.json(
        { error: `The ${tone} tone is not available on your current plan.` },
        { status: 403 }
      );
    }

    const inputWordCount = countWords(text);
    const remainingWords = subscription.wordsLimit - subscription.wordsUsed;

    if (inputWordCount > remainingWords) {
      return NextResponse.json(
        {
          error: `Word limit exceeded. You have ${remainingWords.toLocaleString()} words remaining this month. Upgrade your plan for more.`,
          remainingWords,
          upgradeRequired: true,
        },
        { status: 429 }
      );
    }

    const engineConfig = ENGINE_CONFIG[engine];
    const toneInstruction = TONE_INSTRUCTIONS[tone] || "";

    const fullSystemPrompt = `${MASTER_SYSTEM_PROMPT}\n\n${toneInstruction}`;
    const userPrompt = `Rewrite the following text with a ${tone} tone:\n\n${text}`;

    let humanizedText: string;

    if (engineConfig.provider === "anthropic") {
      humanizedText = await callAnthropic(
        fullSystemPrompt,
        userPrompt,
        engineConfig
      );
    } else {
      humanizedText = await callOpenAI(
        fullSystemPrompt,
        userPrompt,
        engineConfig
      );
    }

    if (!humanizedText || humanizedText.trim().length === 0) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    await incrementWordsUsed(userId, inputWordCount);

    const outputWordCount = countWords(humanizedText);

    return NextResponse.json({
      success: true,
      humanizedText: humanizedText.trim(),
      inputWordCount,
      outputWordCount,
      engine,
      tone,
      wordsRemaining: subscription.wordsLimit - subscription.wordsUsed - inputWordCount,
    });
  } catch (error) {
    console.error("[HUMANIZE_ERROR]", error);

    if (error instanceof Error && error.message.includes("API error")) {
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
