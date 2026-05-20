import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe, TIERS } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { tier } = body as { tier: "stealth_author" | "incognito_agency" };

    if (!tier || !TIERS[tier] || !TIERS[tier].priceId) {
      return NextResponse.json(
        { error: "Invalid tier selected" },
        { status: 400 }
      );
    }

    const subscription = await getUserSubscription(userId);

    let stripeCustomerId = subscription.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || undefined,
        metadata: {
          clerkUserId: userId,
        },
      });

      stripeCustomerId = customer.id;

      await (await import("@/lib/db")).updateUserSubscription(userId, {
        stripeCustomerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: TIERS[tier].priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        clerkUserId: userId,
        tier,
      },
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          clerkUserId: userId,
          tier,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
