// Codepackr Astro — Modern Astro Tools Landing & Directory Home Page
import { useState, useMemo } from "react";
import {
  Compass,
  ScrollText,
  CalendarDays,
  TrendingUp,
  HeartHandshake,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Orbit,
  Clock,
  Printer,
  FileText,
  BookMarked,
  Hourglass,
  Moon,
  UserCheck,
  Sparkle,
  Baby,
  Binary,
  HelpCircle,
} from "lucide-react";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { AstroHero } from "@/components/AstroHero";
import {
  ASTRO_TOOLS,
  TOOL_CATEGORIES,
  filterTools,
  type ToolCategory,
  type AstroTool,
} from "@/lib/tools/astro-tools";

const ICON_MAP: Record<string, typeof Compass> = {
  ScrollText,
  FileText,
  BookOpen,
  BookMarked,
  CalendarDays,
  Clock,
  Hourglass,
  TrendingUp,
  Sparkles,
  Orbit,
  Moon,
  HeartHandshake,
  UserCheck,
  Sparkle,
  Baby,
  Binary,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
};

const MAJOR_POPULAR_CONFIG: Record<
  string,
  {
    badgeTa: string;
    badgeEn: string;
    badgeColor: string;
    iconBg: string;
    ctaTa: string;
    ctaEn: string;
  }
> = {
  porutham: {
    badgeTa: "10 பொருத்தங்கள்",
    badgeEn: "10 Poruthams",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
    iconBg: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    ctaTa: "பொருத்தம் பார்க்க",
    ctaEn: "Check Match",
  },
  biodata: {
    badgeTa: "HD PDF அச்சு",
    badgeEn: "HD PDF Export",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/90",
    iconBg: "bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white",
    ctaTa: "பயோடேட்டா செய்ய",
    ctaEn: "Create Biodata",
  },
  jathagam: {
    badgeTa: "1 · 6 · 30 பக்கங்கள்",
    badgeEn: "1 · 6 · 30 Pages",
    badgeColor: "bg-orange-50 text-orange-800 border-orange-200/90",
    iconBg: "bg-orange-100 text-orange-800 group-hover:bg-accent group-hover:text-white",
    ctaTa: "ஜாதகம் உருவாக்க",
    ctaEn: "Create Jathagam",
  },
  "tamil-calendar": {
    badgeTa: "தினசரி பஞ்சாங்கம்",
    badgeEn: "Daily Panchangam",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/90",
    iconBg: "bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white",
    ctaTa: "காலண்டர் திறக்க",
    ctaEn: "Open Calendar",
  },
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
    const el = document.getElementById("all-tools-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <AstroHero lang={lang} />

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/60 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
              <ScrollText className="size-4" />
              <span>{isTa ? "முதன்மை சேவை" : "Flagship Feature"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isTa ? "முழுமையான ஜாதகக் கணிப்பு (1 · 6 · 30 பக்கங்கள்)" : "Comprehensive Tamil Horoscope Generation"}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isTa
                ? "உங்கள் பிறந்த தேதி, நேரம் மற்றும் இடத்தை உள்ளிட்டு துல்லியமான லக்னம், ராசி, நவாம்சம், 16 வர்க்க கட்டங்கள், விம்சோத்தரி தசா-புத்தி, யோகங்கள் மற்றும் கோச்சார பலன்களை உடனடியாக உருவாக்குங்கள்."
                : "Enter birth details with validated location coordinates to generate detailed Rasi, Navamsa, 16 harmonic Vargas, Vimshottari Dasa balance, and planetary strengths in printable format."}
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => go("jathagam")}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-white shadow-sm hover:bg-accent/90 active:scale-95 transition-all text-sm sm:text-base"
            >
              <span>{isTa ? "ஜாதகம் உருவாக்க →" : "Create Horoscope →"}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isTa ? "பிரபலமான கருவிகள்" : "Most Popular Astro Tools"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isTa ? "பயனர்கள் அதிகம் நாடும் முதன்மை சேவைகள்" : "Quick access to frequently used calculators"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => {
            const config = MAJOR_POPULAR_CONFIG[tool.id];
            const Icon = ICON_MAP[tool.icon] || Compass;
            const badge = isTa ? config?.badgeTa : config?.badgeEn;
            const cta = isTa ? config?.ctaTa : config?.ctaEn;

            return (
              <div
                key={tool.id}
                onClick={() => go(tool.id as any)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl transition-all duration-200 ${
                        config?.iconBg ||
                        "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                      }`}
                    >
                      <Icon className="size-5.5" />
                    </span>
                    {badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          config?.badgeColor || "bg-accent/10 text-accent border-accent/20"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-accent transition-colors mb-1.5 leading-snug">
                    {isTa ? tool.titleTa : tool.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {isTa ? tool.descriptionTa : tool.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-accent group-hover:text-accent/90">
                  <span>{cta || (isTa ? "திறக்க" : "Open")}</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="all-tools-section" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
              <Compass className="size-4" />
              <span>{isTa ? "அனைத்து கருவிகள் பட்டியல்" : "Complete Astro Tools Directory"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isTa ? "ஜோதிடக் கருவிகள் களஞ்சியம்" : "Explore All Vedic Astrology Tools"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isTa
                ? `${filteredTools.length} கருவிகள் கிடைக்கின்றன`
                : `${filteredTools.length} tools available`}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isTa
                  ? "கருவியை தேடுங்கள்... (திதி, பொருத்தம், D10)"
                  : "Search tool... (tithi, marriage, D10)"
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs sm:text-sm text-slate-900 shadow-2xs focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
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
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  active
                    ? "bg-accent text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-accent/40 hover:bg-slate-50"
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
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-sm font-bold text-accent hover:underline"
            >
              {isTa ? "வடிகட்டிகளை அழி" : "Clear filters"}
            </button>
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
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-accent/40 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-accent transition-colors text-sm">
                        {isTa ? tool.titleTa : tool.titleEn}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {isTa ? tool.descriptionTa : tool.descriptionEn}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-accent">
                    <span>{isTa ? "திறக்க" : "Open"}</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
            <ShieldCheck className="size-4" />
            <span>{isTa ? "தனியுரிமை உத்தரவாதம்" : "Privacy Guarantee"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isTa ? "உங்கள் ஜாதகத் தரவு உங்களுடன் மட்டுமே" : "Your birth data never leaves your device"}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isTa
              ? "அனைத்து கணிப்புகளும் உங்கள் உலாவியில் மட்டுமே இயங்குகின்றன. சர்வருக்கு எந்தத் தரவும் அனுப்பப்படுவதில்லை."
              : "All calculations run 100% client-side in your browser. No birth data is transmitted to any server."}
          </p>
        </div>
      </section>
    </div>
  );
}
