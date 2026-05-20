export const MASTER_SYSTEM_PROMPT = `You are an expert human editor, literary stylist, and anti-statistical text bypasser. Rewrite the provided AI-generated text so that it reads indistinguishably from a highly literate human author. Vary sentence lengths dramatically (perplexity & burstiness). Ban common AI filler words like 'delve, testament, tapestry, furthermore'. Maintain original formatting and facts. Output ONLY the rewritten text without conversational introductions.`;

export const TONE_INSTRUCTIONS: Record<string, string> = {
  casual:
    "Write in a relaxed, conversational tone. Use contractions naturally, occasional colloquialisms, and a friendly rhythm. Imagine explaining this to a smart friend over coffee.",
  academic:
    "Write with scholarly precision. Use measured, analytical language with appropriate terminology. Maintain intellectual rigor while avoiding robotic stiffness. Cite-worthy prose.",
  professional:
    "Write with polished business clarity. Confident, direct, and authoritative. Suitable for executive communication, reports, or client-facing materials.",
};

export const ENGINE_CONFIG = {
  standard: {
    model: "gpt-4o-mini",
    provider: "openai",
    temperature: 0.85,
    maxTokens: 4096,
  },
  ultra: {
    model: "claude-sonnet-4-20250514",
    provider: "anthropic",
    temperature: 0.9,
    maxTokens: 4096,
  },
} as const;
