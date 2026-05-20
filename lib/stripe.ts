import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const TIERS = {
  free: {
    name: "Ghostwriter",
    wordLimit: 3000,
    engines: ["standard"] as const,
    tones: ["casual"] as const,
    priceId: null,
  },
  stealth_author: {
    name: "Stealth Author",
    wordLimit: 100000,
    engines: ["standard", "ultra"] as const,
    tones: ["casual", "academic", "professional"] as const,
    priceId: process.env.STRIPE_PRICE_STEALTH_AUTHOR!,
  },
  incognito_agency: {
    name: "Incognito Agency",
    wordLimit: 500000,
    engines: ["standard", "ultra"] as const,
    tones: ["casual", "academic", "professional"] as const,
    priceId: process.env.STRIPE_PRICE_INCognito_AGENCY!,
  },
} as const;

export type TierKey = keyof typeof TIERS;
export type Engine = "standard" | "ultra";
export type Tone = "casual" | "academic" | "professional";
