"use client";

import { useState } from "react";
import {
  Check,
  Ghost,
  Shield,
  Building2,
  Loader2,
  ArrowRight,
  Zap,
  Crown,
  Layers,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number | null;
  period: string;
  description: string;
  wordLimit: string;
  badge?: string;
  badgeGradient?: string;
  features: PlanFeature[];
  cta: string;
  ctaStyle: "outline" | "primary" | "premium";
  tier: "free" | "stealth_author" | "incognito_agency";
  accentColor: string;
}

const PLANS: PricingPlan[] = [
  {
    id: "ghostwriter",
    name: "The Ghostwriter",
    icon: <Ghost className="w-6 h-6" />,
    price: null,
    period: "forever",
    description:
      "Dip your toes into the shadows. Perfect for students and casual users who need quick humanization.",
    wordLimit: "3,000",
    features: [
      { text: "3,000 words per month", included: true },
      { text: "Standard AI Engine", included: true },
      { text: "Casual tone only", included: true },
      { text: "Basic detector bypass", included: true },
      { text: "Copy to clipboard", included: true },
      { text: "Academic & Professional tones", included: false },
      { text: "Ultra Engine (Claude 4.5)", included: false },
      { text: "Priority processing speed", included: false },
      { text: "Bulk document uploads", included: false },
    ],
    cta: "Start Free",
    ctaStyle: "outline",
    tier: "free",
    accentColor: "dark",
  },
  {
    id: "stealth-author",
    name: "The Stealth Author",
    icon: <Shield className="w-6 h-6" />,
    price: 19,
    period: "month",
    description:
      "For serious writers who demand undetectable, publication-ready prose. The sweet spot of power and value.",
    wordLimit: "100,000",
    badge: "Most Popular",
    badgeGradient: "from-brand-500 to-brand-600",
    features: [
      { text: "100,000 words per month", included: true },
      { text: "Ultra Engine (Claude 4.5 Sonnet)", included: true },
      { text: "All tones: Casual, Academic, Professional", included: true },
      { text: "Advanced detector bypass", included: true },
      { text: "Priority processing speed", included: true },
      { text: "Perplexity & burstiness optimization", included: true },
      { text: "Standard Engine access", included: true },
      { text: "Multi-pass Ninja Mode", included: false },
      { text: "Bulk document uploads", included: false },
    ],
    cta: "Go Stealth",
    ctaStyle: "primary",
    tier: "stealth_author",
    accentColor: "brand",
  },
  {
    id: "incognito-agency",
    name: "The Incognito Agency",
    icon: <Building2 className="w-6 h-6" />,
    price: 49,
    period: "month",
    description:
      "Built for agencies, content mills, and power users. Maximum volume, maximum stealth, maximum control.",
    wordLimit: "500,000",
    badge: "Power User",
    badgeGradient: "from-amber-500 to-amber-600",
    features: [
      { text: "500,000 words per month", included: true },
      { text: "Ultra Engine (Claude 4.5 Sonnet)", included: true },
      { text: "All tones with custom presets", included: true },
      { text: "Multi-pass Ninja Mode refinement", included: true },
      { text: "Bulk document uploads (PDF, DOCX)", included: true },
      { text: "Maximum detector bypass strength", included: true },
      { text: "Priority processing speed", included: true },
      { text: "API access for integrations", included: true },
      { text: "Dedicated support channel", included: true },
    ],
    cta: "Go Incognito",
    ctaStyle: "premium",
    tier: "incognito_agency",
    accentColor: "amber",
  },
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: "stealth_author" | "incognito_agency") => {
    setLoadingTier(tier);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-40" />

      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-brand-600/6 rounded-full blur-[140px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-amber-600/4 rounded-full blur-[120px] animate-float-delay pointer-events-none" />

      <header className="relative border-b border-dark-800/40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Stealth<span className="text-gradient">Text</span>
            </span>
          </a>
          <nav className="flex items-center gap-2">
            <a
              href="/"
              className="px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-100 transition-colors"
            >
              Home
            </a>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-100 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/sign-in"
              className="ml-2 bg-gradient-brand hover:bg-gradient-brand-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-600/20"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/50 border border-dark-700/40 text-sm text-dark-300 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-brand-400 animate-pulse-glow" />
            Choose Your Level of Stealth
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Pricing That{" "}
            <span className="text-gradient">Disappears</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every plan includes our core humanization engine. Upgrade for more
            words, better AI models, and advanced features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative glass-card rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.id === "stealth-author"
                  ? "border-brand-500/30 glow-strong md:scale-[1.02] z-10"
                  : plan.id === "incognito-agency"
                    ? "border-amber-500/20 glow-amber"
                    : "border-dark-700/30 hover:border-dark-600/40"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span
                    className={`bg-gradient-to-r ${plan.badgeGradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 lg:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      plan.accentColor === "brand"
                        ? "bg-brand-600/15 text-brand-400"
                        : plan.accentColor === "amber"
                          ? "bg-amber-600/15 text-amber-400"
                          : "bg-dark-700/50 text-dark-400"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{plan.name}</h3>
                    <p className="text-xs text-dark-500">
                      {plan.wordLimit} words / month
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-dark-500 text-sm">
                        /{plan.period}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold">Free</span>
                  )}
                </div>

                <p className="text-dark-400 text-sm mt-3 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <button
                  onClick={() => {
                    if (plan.tier === "free") {
                      window.location.href = "/dashboard";
                    } else {
                      handleSubscribe(
                        plan.tier as "stealth_author" | "incognito_agency"
                      );
                    }
                  }}
                  disabled={loadingTier === plan.tier}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                    plan.ctaStyle === "outline"
                      ? "border border-dark-600/50 text-dark-200 hover:border-dark-500 hover:text-white glass-card"
                      : plan.ctaStyle === "primary"
                        ? "bg-gradient-brand hover:bg-gradient-brand-hover text-white glow hover:glow-strong border border-brand-500/20"
                        : "bg-gradient-premium hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold glow-amber hover:glow-amber-strong"
                  } ${loadingTier === plan.tier ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loadingTier === plan.tier ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-dark-700/30">
                  <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
                    What&apos;s included
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.included
                              ? plan.accentColor === "brand"
                                ? "bg-brand-600/15 text-brand-400"
                                : plan.accentColor === "amber"
                                  ? "bg-amber-600/15 text-amber-400"
                                  : "bg-dark-600/30 text-dark-400"
                              : "bg-dark-800/50 text-dark-700"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-dark-200"
                              : "text-dark-600"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-dark-500 text-sm">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure payments via Stripe
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Upgrade or downgrade freely
            </span>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-dark-800/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">StealthText AI</span>
          </div>
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} StealthText AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
