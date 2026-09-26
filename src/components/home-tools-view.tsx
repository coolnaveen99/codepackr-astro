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
import {
  ASTRO_TOOLS,
  TOOL_CATEGORIES,
  filterTools,
  type ToolCategory,
  type AstroTool,
} from "@/lib/tools/astro-tools";

// Icon mapping helper
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
    return ASTRO_TOOLS.filter((t) => t.popular);
  }, []);

  const scrollToTools = () => {
    const el = document.getElementById("all-tools-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-amber-50/70 via-white to-amber-100/40 p-6 sm:p-10 lg:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-accent">
            <Sparkles className="size-3.5" />
            <span>
              {isTa
                ? "✦ இலவச தமிழ் ஜோதிடம் & துல்லிய வானியல் கணக்கீடுகள்"
                : "✦ Free Tamil Astrology & Precision Ephemeris Tools"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {isTa ? (
              <>
                கோட்பேக்ர் ஆஸ்ட்ரோ
                <span className="block text-accent text-2xl sm:text-4xl lg:text-5xl mt-2 font-bold">
                  ஜாதகம், பஞ்சாங்கம் & ஜோதிடக் கருவிகள்
                </span>
              </>
            ) : (
              <>
                CodePackr Astro
                <span className="block text-accent text-2xl sm:text-4xl lg:text-5xl mt-2 font-bold">
                  Tamil Horoscope & Precision Vedic Tools
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
            {isTa
              ? "தமிழில் முழுமையான ஜாதகம் கணித்தல், திருக்கணித பஞ்சாங்கம், திருமணப் பொருத்தம், கோச்சாரம் மற்றும் பலன்கள். உண்மையான வானியல் மாதிரிகள் (VSOP87 / JPL DE440) அடிப்படையில் உருவாக்கப்பட்ட 20+ இலவச கருவிகள்."
              : "Complete Tamil birth chart calculations, daily event-based Panchangam, 10-factor Porutham, transits, and multi-horizon forecasts. 20+ free tools built on analytical planetary theories."}
          </p>

          {/* Value Props Strip */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "தமிழ் முதன்மை இடைமுகம்" : "Tamil-First Interface"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "இடம் சார்ந்த உண்மை உதயங்கள்" : "Location-Specific Sunrise"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "வெளிப்படையான கணித முறை" : "Transparent Methodology"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/80 border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "அச்சு & PDF ஆதரவு" : "Print & PDF Ready"}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => go("jathagam")}
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-accent/90 hover:shadow-lg active:scale-95"
            >
              <ScrollText className="size-5" />
              <span>{isTa ? "ஜாதகம் உருவாக்க" : "Generate Jathagam"}</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              type="button"
              onClick={scrollToTools}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm sm:text-base font-bold text-slate-800 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95"
            >
              <span>{isTa ? "அனைத்து கருவிகளையும் பார்க்க" : "Explore All Tools"}</span>
              <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-extrabold">20+</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* 2. Featured Jathagam Highlight Card */}
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

      {/* 3. Popular Quick Strip */}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularTools.slice(0, 6).map((tool) => {
            const Icon = ICON_MAP[tool.icon] || Compass;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => go(tool.id as any)}
                className="group flex flex-col items-center text-center p-4 rounded-xl border border-slate-200 bg-white hover:border-accent/40 hover:shadow-md transition-all active:scale-95"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors mb-2.5">
                  <Icon className="size-5.5" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-accent transition-colors">
                  {isTa ? tool.titleTa : tool.titleEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Complete All Tools Directory */}
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

          {/* Search Box */}
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

        {/* Category Filters */}
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

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <HelpCircle className="size-10 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-700">
              {isTa ? "கருவிகள் எதுவும் பொருந்தவில்லை" : "No matching tools found"}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTa
                ? "வேறு சொற்களைப் பயன்படுத்தி தேடவும் அல்லது வடிகட்டியை 'அனைத்தும்' என மாற்றவும்."
                : "Try a different search keyword or reset the category filter to All."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-bold text-accent hover:underline"
            >
              {isTa ? "வடிகட்டியை மீட்டமைக்கவும்" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || Compass;
              return (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-accent/50 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                        <Icon className="size-5.5" />
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {tool.status === "beta"
                          ? isTa ? "ஆய்வகம்" : "Beta"
                          : tool.status === "coming-soon"
                          ? isTa ? "விரைவில்" : "Coming Soon"
                          : isTa ? "இலவசம்" : "Free"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-1">
                        {isTa ? tool.titleTa : tool.titleEn}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {isTa ? tool.descriptionTa : tool.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => go(tool.id as any)}
                      className="inline-flex w-full items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-accent hover:text-white transition-colors"
                    >
                      <span>{isTa ? "திறக்க" : "Open Tool"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Why CodePackr Astro? Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
            <ShieldCheck className="size-4" />
            <span>{isTa ? "நம்பகத்தன்மை & நெறிமுறைகள்" : "Integrity & Methodology"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isTa ? "ஏன் கோட்பேக்ர் ஆஸ்ட்ரோ?" : "Why CodePackr Astro?"}
          </h2>
          <p className="text-sm text-slate-600">
            {isTa
              ? "விளம்பரங்கள் மற்றும் மிகைப்படுத்தப்பட்ட போலி கணிப்புகள் இன்றி, பாரம்பரிய ஜோதிட நூல்களையும் உயர்நிலை வானியல் கணிதத்தையும் இணைக்கும் நம்பகமான தளம்."
              : "A transparent astrology platform combining traditional classical texts with analytical orbital ephemeris models."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "தமிழ் மொழிக்கு முதலிடம்" : "Tamil-First Interface"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "தென்னிந்திய பாரம்பரிய தமிழ் ஜோதிட பாணி கட்டங்கள், நட்சத்திர பாதங்கள் மற்றும் நாழிகை கணக்கீடுகள் தாய்மொழியில்."
                : "Native Tamil layout with South Indian square charts, traditional Tamil months, Samvatsara years, and Nazhigai units."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "இடம் சார்ந்த உண்மை உதயங்கள்" : "Location-Specific Events"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "தோராயமான 6:00 AM போலி கணக்கீடுகள் இன்றி, உங்கள் பிறந்த ஊரின் அட்சரேகை மற்றும் தீர்க்கரேகைக்குரிய சூரியோதயம்."
                : "Real geographic sunrise and sunset calculation factoring atmospheric refraction, without hard-coded 6:00 AM approximations."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "கணக்கீட்டு முறை வெளிப்படைத்தன்மை" : "Method Transparency"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "சித்திரபக்ஷ லஹிரி அயனாம்சம், VSOP87 வானியல் மாதிரிகள் மற்றும் பாவ கணித சூத்திரங்கள் முழுமையாக வெளிப்படுத்தப்பட்டுள்ளன."
                : "Chitrapaksha Lahiri Ayanamsa, VSOP87 analytical ephemeris, and Whole Sign rules documented openly in our Method section."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "விதி சார்ந்த பஞ்சாங்க நிகழ்வுகள்" : "Rule-Driven Panchangam"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "திதி, நட்சத்திரம், விரதங்கள் மற்றும் பண்டிகைகள் நிலையான அட்டவணையில் இருந்து நகலெடுக்கப்படாமல் வானியல் விதிகளால் கணக்கிடப்படுகின்றன."
                : "Tithi, Nakshatra, Ekadashi, and festivals evaluated dynamically via astronomical rules rather than static hardcoded date lists."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "அச்சு மற்றும் PDF ஆதரவு" : "High-Resolution Print & PDF"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "1 பக்கம், 6 பக்கங்கள் அல்லது 30 பக்க ஜாதக அறிக்கைகளை உடனடியாக உலாவி மூலமாகவே சுத்தமான PDF ஆக பதிவிறக்கலாம்."
                : "Clean, print-optimized formatting for 1-page, 6-page, and 30-page horoscope reports exportable to PDF."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{isTa ? "கணிதமும் பலனும் தனித்தனி" : "Separation of Math & Interpretation"}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa
                ? "வானியல் கணிதத் துல்லியம் மற்றும் பாரம்பரிய ஜோதிட பலன் விளக்கங்கள் ஆகிய இரண்டும் தெளிவாக பிரித்து காட்டப்படுகின்றன."
                : "Astronomical calculation accuracy and traditional astrological interpretations are treated as distinct concepts."}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Calculation Transparency Teaser */}
      <section className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <ShieldCheck className="size-4" />
            <span>{isTa ? "வெளிப்படையான வானியல் தரம்" : "Audited Calculation Standards"}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold">
            {isTa
              ? "எங்கள் வானியல் கணக்கீட்டு முறையை விரிவாக அறியுங்கள்"
              : "Inspect Our Ephemeris & Astronomical Calculation Methods"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {isTa
              ? "நிரயன ராசி மண்டலம், நாசா JPL DE440 பெஞ்ச்மார்க் மற்றும் 16 வர்க்க கட்டங்களின் கணித அடிப்படைகளை ஆவணப் பக்கத்தில் வாசிக்கலாம்."
              : "Read the technical methodology behind our Sidereal zodiac, IAU 2000 precession polynomial, Chitrapaksha Lahiri, and Whole Sign houses."}
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => go("calculation-method")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
          >
            <span>{isTa ? "கணக்கீட்டு முறை படிக்க →" : "View Calculation Methods →"}</span>
          </button>
        </div>
      </section>

      {/* 7. SEO Descriptive Text Block */}
      <section className="text-xs text-slate-400 leading-relaxed border-t border-slate-200 pt-6">
        <h4 className="font-bold text-slate-500 mb-1">
          {isTa ? "கோட்பேக்ர் ஆஸ்ட்ரோ பற்றி" : "About CodePackr Astro"}
        </h4>
        <p>
          {isTa
            ? "தமிழில் இலவச ஜோதிட மற்றும் காலண்டர் கருவிகள். ஜாதகம், தினசரி பஞ்சாங்கம், தமிழ் காலண்டர், ராசிபலன், நட்சத்திரம், 10 திருமணப் பொருத்தங்கள், சந்திராஷ்டமம், கோச்சாரம் மற்றும் நாழிகை உள்ளிட்ட பல்வேறு பாரம்பரிய கணக்கீட்டு கருவிகளை ஒரே இடத்தில் பயன்படுத்தலாம். எவ்வித மிகைப்படுத்தப்பட்ட எதிர்கால உத்தரவாதங்களும் இன்றி, செவ்வியல் நூல்களின் வழிகாட்டுதலோடு துல்லிய வானியல் கணக்கீடுகளை பொதுமக்களுக்கு இலவசமாக வழங்குவதே இதன் நோக்கம்."
            : "Free Tamil astrology and astronomical calendar platform. Compute horoscopes, daily event-based Panchangam, Tamil solar calendars, Rasi Palan, Nakshatra details, 10-factor marriage compatibility, Chandrashtama dates, Gochara transits, and Nazhigai. Designed for precision, cultural preservation, and accessibility without fabricated claims."}
        </p>
      </section>
    </div>
  );
}
