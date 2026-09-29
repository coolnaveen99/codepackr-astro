// Codepackr Astro — restored homepage (pre unique-hero)
import { useState, useMemo } from "react";
import {
  Compass,
  ScrollText,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { HeroPreviewCards } from "@/components/hero-preview-cards";
import {
  ASTRO_TOOLS,
  TOOL_CATEGORIES,
  filterTools,
  type ToolCategory,
  type AstroTool,
} from "@/lib/tools/astro-tools";

const ICON_MAP: Record<string, typeof Compass> = {
  ScrollText,
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
};

interface HomeToolsViewProps {
  lang: Lang;
}

export function HomeToolsView({ lang }: HomeToolsViewProps) {
  const isTa = lang === "ta";
  const { go } = useNav();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return filterTools(ASTRO_TOOLS, selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const popularTools = useMemo(() => {
    const majorIds = ["porutham", "biodata", "jathagam", "tamil-calendar"] as const;
    return majorIds
      .map((id) => ASTRO_TOOLS.find((t) => t.id === id))
      .filter((t): t is AstroTool => !!t);
  }, []);

  const scrollToTools = () => {
    document.getElementById("all-tools-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-amber-50/80 via-surface to-orange-50/50 p-5 sm:p-7 lg:p-8 shadow-card">
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3.5 sm:space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold tracking-wide text-accent">
              <Sparkles className="size-3.5" />
              <span>
                {isTa
                  ? "⚡ Next-Gen தமிழ் வேத ஜோதிடம் · விண்வெளி அறிவியல் துல்லியம்"
                  : "⚡ Next-Gen Vedic Technology · Precision Planetary Ephemeris"}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-slate-900 leading-tight">
              {isTa ? (
                <>
                  கோட்பேக்ர் ஆஸ்ட்ரோ
                  <span className="block text-accent text-xl sm:text-3xl lg:text-[2.1rem] mt-1 font-bold">
                    நவீன தலைமுறை ஜாதகம், பஞ்சாங்கம் & ஜோதிடக் கருவிகள்
                  </span>
                </>
              ) : (
                <>
                  CodePackr Astro
                  <span className="block text-accent text-xl sm:text-3xl lg:text-[2.1rem] mt-1 font-bold">
                    Next-Gen Vedic Astrology & Ephemeris Tech
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {isTa
                ? "நாசா JPL DE440 & VSOP87 விண்வெளி கணிதங்கள். 100% இலவசம் · Zero Data Tracking."
                : "Powered by NASA JPL DE440 & VSOP87. 100% Free · Client-Side Private · Zero Data Leak."}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/85 border border-slate-200/90 px-2.5 py-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>{isTa ? "🚀 உடனடி HD Chart & PDF" : "🚀 Instant HD PDF & Chart"}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/85 border border-slate-200/90 px-2.5 py-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>{isTa ? "🔒 100% தனியுரிமை" : "🔒 100% Client-Side Privacy"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => go("jathagam")}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white shadow-md hover:bg-accent/90 active:scale-95 cursor-pointer"
              >
                <ScrollText className="size-4" />
                <span>{isTa ? "ஜாதகம் உருவாக்க (Free)" : "Generate Free Horoscope"}</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={scrollToTools}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <span>{isTa ? "அனைத்து கருவிகள்" : "Explore All Tools"}</span>
                <span className="text-[11px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-extrabold">20+</span>
              </button>
            </div>
          </div>
          <HeroPreviewCards lang={lang} className="lg:col-span-5" />
        </div>
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-gold/10 blur-3xl" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isTa ? "பிரபலமான கருவிகள்" : "Most Popular Astro Tools"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || Compass;
            return (
              <div
                key={tool.id}
                onClick={() => go(tool.id as any)}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-accent/40 hover:shadow-lg cursor-pointer"
              >
                <div>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white mb-3">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-accent">
                    {isTa ? tool.titleTa : tool.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {isTa ? tool.descriptionTa : tool.descriptionEn}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-accent">
                  <span>{isTa ? "திறக்க" : "Open"}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="all-tools-section" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isTa ? "ஜோதிடக் கருவிகள் களஞ்சியம்" : "Explore All Vedic Astrology Tools"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isTa ? `${filteredTools.length} கருவிகள்` : `${filteredTools.length} tools available`}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTa ? "கருவியை தேடுங்கள்..." : "Search tool..."}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs sm:text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TOOL_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                  active
                    ? "bg-accent text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-accent/40"
                }`}
              >
                {isTa ? cat.nameTa : cat.nameEn}
              </button>
            );
          })}
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <HelpCircle className="size-10 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-700">
              {isTa ? "கருவிகள் எதுவும் பொருந்தவில்லை" : "No tools match your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || Compass;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => go(tool.id as any)}
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-accent/40 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-accent text-sm">
                        {isTa ? tool.titleTa : tool.titleEn}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {isTa ? tool.descriptionTa : tool.descriptionEn}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent mb-2">
          <ShieldCheck className="size-4" />
          <span>{isTa ? "தனியுரிமை உத்தரவாதம்" : "Privacy Guarantee"}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isTa ? "உங்கள் ஜாதகத் தரவு உங்களுடன் மட்டுமே" : "Your birth data never leaves your device"}
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          {isTa
            ? "அனைத்து கணிப்புகளும் உங்கள் உலாவியில் மட்டுமே இயங்குகின்றன."
            : "All calculations run 100% client-side. No birth data is transmitted to any server."}
        </p>
      </section>
    </div>
  );
}
