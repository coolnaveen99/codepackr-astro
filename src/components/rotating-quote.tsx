// Codepackr Astro - Rotating Wisdom Quotes Component
// Automatically cycles through 525+ curated quotes every 30 seconds with manual controls and smooth transitions.
import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { ASTRO_QUOTES, getQuoteByIndex, type AstroQuote } from "@/lib/astro/quotes";
import type { Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";

interface RotatingQuoteProps {
  lang: Lang;
  className?: string;
  variant?: "hero" | "banner" | "compact";
}

const INTERVAL_MS = 30000; // 30 seconds

export function RotatingQuote({ lang, className, variant = "hero" }: RotatingQuoteProps) {
  // Start with a deterministic or random initial index
  const [index, setIndex] = useState(() => Math.floor(Math.random() * ASTRO_QUOTES.length));
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentQuote: AstroQuote = getQuoteByIndex(index);

  const changeQuote = useCallback((nextIdx: number | ((prev: number) => number)) => {
    setIsFading(true);
    setTimeout(() => {
      setIndex(nextIdx);
      setIsFading(false);
      startTimeRef.current = Date.now();
      setProgress(0);
    }, 220);
  }, []);

  const nextQuote = useCallback(() => {
    changeQuote((prev) => (prev + 1) % ASTRO_QUOTES.length);
  }, [changeQuote]);

  const prevQuote = useCallback(() => {
    changeQuote((prev) => (prev - 1 + ASTRO_QUOTES.length) % ASTRO_QUOTES.length);
  }, [changeQuote]);

  const randomQuote = useCallback(() => {
    const r = Math.floor(Math.random() * ASTRO_QUOTES.length);
    changeQuote(r);
  }, [changeQuote]);

  // Set up 30-second interval
  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);

    // 30-second auto-change
    timerRef.current = window.setInterval(() => {
      nextQuote();
    }, INTERVAL_MS);

    // Progress bar update (every 250ms for smooth bar)
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / INTERVAL_MS) * 100));
      setProgress(pct);
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [nextQuote, index]);

  const quoteText = lang === "ta" ? currentQuote.ta : currentQuote.en;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white to-accent/5 p-3.5 shadow-xs transition-all duration-300",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-accent">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3" />
            {currentQuote.category}
          </span>
          <span className="font-mono text-slate-400">
            #{currentQuote.id} / {ASTRO_QUOTES.length} · 30s
          </span>
        </div>
        <div
          className={cn(
            "mt-1.5 transition-opacity duration-200",
            isFading ? "opacity-0" : "opacity-100"
          )}
        >
          <p className="text-xs font-semibold leading-relaxed text-slate-700">
            “{quoteText}”
          </p>
          <span className="mt-1 block text-[11px] font-bold text-accent">
            {currentQuote.author}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white to-accent/5 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-accent/35",
        className
      )}
      role="region"
      aria-label="Vedic Wisdom Quote"
    >
      {/* Top micro bar with category & counter */}
      <div className="flex items-center justify-between gap-2 border-b border-accent/15 pb-2 text-[10px] font-bold text-accent sm:text-[11px]">
        <span className="inline-flex items-center gap-1 tracking-wide">
          <Sparkles className="size-3 text-accent" />
          {currentQuote.category}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <span>
            #{currentQuote.id} / {ASTRO_QUOTES.length}
          </span>
          <span className="rounded bg-accent/15 px-1 py-0.5 text-[9px] font-semibold text-accent">
            30s
          </span>
        </div>
      </div>

      {/* Quote Body with smooth fade */}
      <div className="my-2.5 flex-1">
        <div className="text-2xl font-serif leading-none text-accent sm:text-3xl select-none">
          “
        </div>
        <div
          className={cn(
            "-mt-2 min-h-[58px] transition-all duration-200",
            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          )}
        >
          <p className="text-xs font-semibold leading-relaxed text-slate-700 sm:text-sm sm:leading-6">
            {quoteText}
          </p>
          <span className="mt-2 block text-xs font-extrabold tracking-wide text-accent">
            {currentQuote.author}
          </span>
        </div>
      </div>

      {/* Bottom controls & 30-second progress indicator */}
      <div className="mt-1 pt-2 border-t border-accent/10">
        <div className="flex items-center justify-between gap-2">
          {/* Subtle countdown progress line */}
          <div
            className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100"
            title={`${lang === "ta" ? "அடுத்த பொன்மொழி 30 வினாடிகளில் மாறும்" : "Changes every 30 seconds"}`}
          >
            <div
              className="h-full bg-accent/60 transition-all duration-250 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls: Prev, Random, Next */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={prevQuote}
              title={lang === "ta" ? "முந்தைய பொன்மொழி" : "Previous quote"}
              className="flex size-6 items-center justify-center rounded-md border border-accent/20 bg-white text-slate-600 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={randomQuote}
              title={lang === "ta" ? "வேறு பொன்மொழி" : "Random quote"}
              className="flex size-6 items-center justify-center rounded-md border border-accent/20 bg-white text-slate-600 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <RefreshCw className="size-3" />
            </button>
            <button
              type="button"
              onClick={nextQuote}
              title={lang === "ta" ? "அடுத்த பொன்மொழி" : "Next quote"}
              className="flex size-6 items-center justify-center rounded-md border border-accent/20 bg-white text-slate-600 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
