"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Copy,
  Check,
  Loader2,
  Sparkles,
  FileText,
  ChevronDown,
  Zap,
  Crown,
  AlertCircle,
  ArrowUpRight,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { countWords, cn } from "@/lib/utils";
import type { Engine, Tone } from "@/lib/stripe";

interface SubscriptionData {
  tier: string;
  tierName: string;
  wordsUsed: number;
  wordsLimit: number;
  wordsRemaining: number;
  availableEngines: string[];
  availableTones: string[];
  subscriptionStatus: string;
}

const TONES: { value: Tone; label: string; description: string; icon: string }[] = [
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, conversational, friendly",
    icon: "☕",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Scholarly, precise, analytical",
    icon: "🎓",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Polished, authoritative, business-ready",
    icon: "💼",
  },
];

export default function DashboardPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [engine, setEngine] = useState<Engine>("standard");
  const [tone, setTone] = useState<Tone>("casual");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);

  const inputWordCount = countWords(inputText);
  const outputWordCount = countWords(outputText);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.tier) {
          setSubscription(data);
          if (!data.availableEngines.includes("ultra")) {
            setEngine("standard");
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (toneDropdownOpen) {
      const closeDropdown = () => setToneDropdownOpen(false);
      document.addEventListener("click", closeDropdown);
      return () => document.removeEventListener("click", closeDropdown);
    }
  }, [toneDropdownOpen]);

  const handleHumanize = useCallback(async () => {
    if (!inputText.trim() || inputWordCount < 10) {
      setError("Please enter at least 10 words to humanize.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutputText("");

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          engine,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.upgradeRequired) {
          setError(
            `Word limit reached. You have ${data.remainingWords?.toLocaleString()} words remaining. Upgrade your plan to continue.`
          );
        } else {
          setError(data.error || "An unexpected error occurred.");
        }
        return;
      }

      setOutputText(data.humanizedText);

      if (subscription) {
        setSubscription((prev) =>
          prev
            ? {
                ...prev,
                wordsRemaining: data.wordsRemaining,
                wordsUsed: prev.wordsUsed + data.inputWordCount,
              }
            : null
        );
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, engine, tone, inputWordCount, subscription]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
    setError(null);
  }, []);

  const usagePercentage = subscription
    ? (subscription.wordsUsed / subscription.wordsLimit) * 100
    : 0;

  const selectedTone = TONES.find((t) => t.value === tone) || TONES[0];

  const tierConfig: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
    free: { label: "Ghostwriter", icon: FileText, color: "text-dark-300", bg: "bg-dark-700/60" },
    stealth_author: { label: "Stealth Author", icon: Zap, color: "text-brand-400", bg: "bg-brand-600/15" },
    incognito_agency: { label: "Incognito Agency", icon: Crown, color: "text-amber-400", bg: "bg-amber-600/15" },
  };

  const currentTier = subscription ? tierConfig[subscription.tier] || tierConfig.free : tierConfig.free;
  const TierIcon = currentTier.icon;

  return (
    <div className="relative min-h-full">
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1.5">
              Humanize Your <span className="text-gradient">Text</span>
            </h1>
            <p className="text-dark-400 text-sm">
              Paste AI-generated content below and transform it into undetectable human-quality writing.
            </p>
          </div>

          {subscription && (
            <div className="glass-card rounded-xl px-5 py-3 border border-dark-700/30 flex items-center gap-4">
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold", currentTier.bg, currentTier.color)}>
                <TierIcon className="w-3.5 h-3.5" />
                {currentTier.label}
              </div>
              <div className="hidden sm:block w-px h-6 bg-dark-700/50" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-32">
                  <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        usagePercentage > 90
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : usagePercentage > 70
                            ? "bg-gradient-to-r from-amber-500 to-amber-400"
                            : "bg-gradient-to-r from-brand-600 to-brand-400"
                      )}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-dark-400 text-xs whitespace-nowrap">
                  <span className="text-dark-200 font-medium">{subscription.wordsRemaining.toLocaleString()}</span> left
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUT PANEL */}
          <div className="glass-card rounded-2xl border border-dark-700/30 p-1 glow">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-600/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Input</h2>
                    <p className="text-xs text-dark-500">Paste your AI text</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-dark-500 tabular-nums">
                    {inputWordCount.toLocaleString()} words
                  </span>
                  {inputText && (
                    <button
                      onClick={handleClear}
                      className="p-1.5 rounded-lg hover:bg-dark-700/50 text-dark-500 hover:text-dark-300 transition-all"
                      title="Clear"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here..."
              className="w-full h-64 bg-transparent px-5 py-3 text-dark-100 placeholder:text-dark-600 resize-none focus:outline-none text-sm leading-relaxed scrollbar-thin"
              spellCheck={false}
            />

            <div className="p-5 pt-0">
              <div className="flex flex-wrap gap-2.5 mb-4">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToneDropdownOpen(!toneDropdownOpen);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 bg-dark-800/50 border border-dark-700/40 rounded-lg text-sm text-dark-200 hover:border-dark-600/60 transition-all"
                  >
                    <span className="text-base">{selectedTone.icon}</span>
                    <span className="font-medium">{selectedTone.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-dark-500 transition-transform duration-200",
                        toneDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {toneDropdownOpen && (
                    <div
                      className="absolute bottom-full left-0 mb-2 w-64 glass-card border border-dark-700/40 rounded-xl shadow-2xl overflow-hidden z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        {TONES.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => {
                              setTone(t.value);
                              setToneDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                              tone === t.value ? "bg-brand-600/10" : "hover:bg-dark-700/40"
                            )}
                          >
                            <span className="text-lg">{t.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-dark-100">{t.label}</span>
                                {tone === t.value && (
                                  <Check className="w-3.5 h-3.5 text-brand-400" />
                                )}
                              </div>
                              <p className="text-xs text-dark-500">{t.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center bg-dark-800/50 border border-dark-700/40 rounded-lg p-1">
                  <button
                    onClick={() => setEngine("standard")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      engine === "standard"
                        ? "bg-dark-700/80 text-white shadow-sm"
                        : "text-dark-500 hover:text-dark-300"
                    )}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Standard
                  </button>
                  <button
                    onClick={() => setEngine("ultra")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      engine === "ultra"
                        ? "bg-brand-600/20 text-brand-400 shadow-sm"
                        : "text-dark-500 hover:text-dark-300"
                    )}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Ultra
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-500/8 border border-red-500/15 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <p className="text-sm text-red-400/90 leading-relaxed">{error}</p>
                </div>
              )}

              <button
                onClick={handleHumanize}
                disabled={loading || inputWordCount < 10}
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5",
                  loading || inputWordCount < 10
                    ? "bg-dark-800/50 text-dark-600 cursor-not-allowed border border-dark-700/30"
                    : "bg-gradient-brand hover:bg-gradient-brand-hover text-white glow hover:glow-strong border border-brand-500/20"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Humanizing your text...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Humanize Text
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* OUTPUT PANEL */}
          <div className="glass-card rounded-2xl border border-dark-700/30 p-1 glow">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">Humanized Output</h2>
                    <p className="text-xs text-dark-500">Your rewritten text</p>
                  </div>
                </div>
                {outputText && (
                  <span className="text-xs text-dark-500 tabular-nums">
                    {outputWordCount.toLocaleString()} words
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-64 px-5 py-3 overflow-y-auto text-sm leading-relaxed scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="relative mb-5">
                    <div className="w-14 h-14 border-2 border-brand-600/20 border-t-brand-500/80 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-14 h-14 border-2 border-transparent border-t-brand-400/40 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    <div className="absolute inset-2 w-10 h-10 border-2 border-transparent border-t-brand-300/30 rounded-full animate-spin" style={{ animationDuration: "2s" }} />
                  </div>
                  <p className="text-sm text-dark-300 font-medium animate-pulse">
                    Rewriting your text...
                  </p>
                  <p className="text-xs text-dark-600 mt-1.5">
                    {engine === "ultra" ? "Ultra Engine" : "Standard Engine"} &middot; {selectedTone.label} tone
                  </p>
                </div>
              ) : outputText ? (
                <div className="whitespace-pre-wrap text-dark-100">{outputText}</div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-dark-600">
                  <div className="w-12 h-12 rounded-xl bg-dark-800/40 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-dark-700" />
                  </div>
                  <p className="text-sm">Your humanized text will appear here</p>
                  <p className="text-xs text-dark-700 mt-1">Paste text and click Humanize to begin</p>
                </div>
              )}
            </div>

            <div className="p-5 pt-0">
              {outputText && !loading && (
                <div className="flex gap-2.5">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 border",
                      copied
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-dark-800/40 border-dark-700/30 text-dark-300 hover:border-dark-600/50 hover:text-white"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
