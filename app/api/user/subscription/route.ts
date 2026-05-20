import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserSubscription } from "@/lib/db";
import { TIERS } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await getUserSubscription(userId);
    const tierConfig = TIERS[subscription.tier];

    return NextResponse.json({
      tier: subscription.tier,
      tierName: tierConfig.name,
      wordsUsed: subscription.wordsUsed,
      wordsLimit: subscription.wordsLimit,
      wordsRemaining: subscription.wordsLimit - subscription.wordsUsed,
      availableEngines: tierConfig.engines,
      availableTones: tierConfig.tones,
      subscriptionStatus: subscription.subscriptionStatus,
    });
  } catch (error) {
    console.error("[USER_SUBSCRIPTION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
