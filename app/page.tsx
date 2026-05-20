import Link from "next/link";
import {
  Shield,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  FileText,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 noise-bg pointer-events-none opacity-50" />

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/8 rounded-full blur-[160px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-800/6 rounded-full blur-[140px] animate-float-delay pointer-events-none" />

      <header className="relative border-b border-dark-800/40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/30 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Stealth<span className="text-gradient">Text</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-100 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="ml-2 bg-gradient-brand hover:bg-gradient-brand-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-40 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/50 border border-dark-700/40 text-sm text-dark-300 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-brand-400 animate-pulse-glow" />
              Powered by Claude 4.5 & Advanced LLMs
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
              Make AI Text
              <br />
              <span className="text-gradient">Completely Undetectable</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              StealthText AI rewrites robotic AI output into natural,
              human-quality prose that bypasses every major AI detector.
              One click. Flawless results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group bg-gradient-brand hover:bg-gradient-brand-hover text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all flex items-center gap-2 glow hover:glow-strong"
              >
                Start Humanizing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3.5 rounded-xl text-base font-semibold border border-dark-700/60 hover:border-dark-600 text-dark-200 hover:text-white transition-all glass-card"
              >
                View Plans
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-dark-500 text-sm">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Enterprise-grade privacy
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Bypasses 50+ detectors
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                10M+ words humanized
              </span>
            </div>
          </div>
        </section>

        <section className="relative max-w-6xl mx-auto px-6 pb-28">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-700/50 to-transparent" />

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap className="w-6 h-6 text-brand-400" />,
                title: "Dual AI Engines",
                description:
                  "Choose between our fast Standard Engine or the ultra-premium Claude 4.5 Sonnet for maximum human-like quality.",
                gradient: "from-brand-600/10 to-brand-800/5",
              },
              {
                icon: <Shield className="w-6 h-6 text-emerald-400" />,
                title: "Detector Bypass",
                description:
                  "Engineered with perplexity and burstiness optimization to defeat Turnitin, GPTZero, Originality.ai, and more.",
                gradient: "from-emerald-600/10 to-emerald-800/5",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-amber-400" />,
                title: "Tone Matching",
                description:
                  "Casual, academic, or professional — match the exact voice your audience expects with precision control.",
                gradient: "from-amber-600/10 to-amber-800/5",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group glass-card rounded-2xl p-7 border border-dark-700/30 hover:border-dark-600/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 pb-28">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-700/50 to-transparent" />

          <div className="text-center mb-12 pt-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You Get on{" "}
              <span className="text-gradient">Every Plan</span>
            </h2>
            <p className="text-dark-400">
              Even our free tier includes powerful humanization capabilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Bypasses all major AI detectors",
              "Preserves original facts & formatting",
              "No conversational filler in output",
              "Real-time word counter",
              "One-click copy to clipboard",
              "Secure & private processing",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-4 glass-card rounded-xl border border-dark-700/20 hover:border-dark-600/30 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <span className="text-dark-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>
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
