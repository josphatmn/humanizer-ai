import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe, TIERS } from "@/lib/stripe";
import { getUserSubscription, updateUserSubscription } from "@/lib/db";
import type { TierKey } from "@/lib/stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const TIER_MAP: Record<string, TierKey> = {
  [TIERS.stealth_author.priceId]: "stealth_author",
  [TIERS.incognito_agency.priceId]: "incognito_agency",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_ERROR] Invalid signature:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId =
          session.metadata?.clerkUserId || session.client_reference_id;

        if (!clerkUserId) {
          console.error(
            "[STRIPE_WEBHOOK] No clerkUserId found in session metadata"
          );
          break;
        }

        const tier = (session.metadata?.tier || "stealth_author") as TierKey;
        const tierConfig = TIERS[tier];

        await updateUserSubscription(clerkUserId, {
          tier,
          wordsLimit: tierConfig.wordLimit,
          subscriptionStatus: "active",
        });

        console.log(
          `[STRIPE_WEBHOOK] User ${clerkUserId} upgraded to ${tierConfig.name}`
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId || typeof subscriptionId !== "string") break;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const clerkUserId = subscription.metadata.clerkUserId;

        if (!clerkUserId) break;

        await updateUserSubscription(clerkUserId, {
          subscriptionStatus: "active",
          stripeSubscriptionId: subscriptionId,
        });

        console.log(
          `[STRIPE_WEBHOOK] Payment confirmed for user ${clerkUserId}`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId || typeof subscriptionId !== "string") break;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const clerkUserId = subscription.metadata.clerkUserId;

        if (!clerkUserId) break;

        await updateUserSubscription(clerkUserId, {
          subscriptionStatus: "past_due",
        });

        console.log(
          `[STRIPE_WEBHOOK] Payment failed for user ${clerkUserId}`
        );
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.cancelled": {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata.clerkUserId;

        if (!clerkUserId) break;

        await updateUserSubscription(clerkUserId, {
          tier: "free",
          wordsLimit: TIERS.free.wordLimit,
          subscriptionStatus: "canceled",
          stripeSubscriptionId: null,
        });

        console.log(
          `[STRIPE_WEBHOOK] Subscription cancelled for user ${clerkUserId}`
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata.clerkUserId;

        if (!clerkUserId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const newTier = TIER_MAP[priceId];

        if (newTier) {
          const tierConfig = TIERS[newTier];
          await updateUserSubscription(clerkUserId, {
            tier: newTier,
            wordsLimit: tierConfig.wordLimit,
            subscriptionStatus: subscription.status as
              | "active"
              | "canceled"
              | "past_due"
              | "trialing",
            stripeSubscriptionId: subscription.id,
          });

          console.log(
            `[STRIPE_WEBHOOK] Subscription updated for user ${clerkUserId} to ${tierConfig.name}`
          );
        }
        break;
      }

      default:
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
