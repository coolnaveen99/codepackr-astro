// Codepackr Astro - Elevated App Shell & Auspicious Header Navigation
import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Compass,
  HeartHandshake,
  CalendarDays,
  Sparkles,
  Hash,
  HelpCircle,
  FileText,
  BookOpen,
  Mail,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Moon,
  Orbit,
  Baby,
  Clock,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { t } from "@/lib/astro/i18n";
import { useLang } from "@/lib/lang";
import { useNav, type Page } from "@/lib/nav";
import { RotatingQuote } from "@/components/rotating-quote";
import { cn } from "@/lib/utils";
import { CodepackrFamilyBar } from "@/components/CodepackrFamilyBar";

// Primary Navigation (Core Vedic Astrological Services)
const PRIMARY_NAV: { id: Page; labelKey: string; shortTa: string; shortEn: string; icon: typeof Compass }[] = [
  { id: "home", labelKey: "navHome", shortTa: "முகப்பு", shortEn: "Home", icon: Compass },
  { id: "jathagam", labelKey: "navChart", shortTa: "ஜாதகம்", shortEn: "Horoscope", icon: FileText },
  { id: "tamil-calendar", labelKey: "navCalendar", shortTa: "காலண்டர் & பஞ்சாங்கம்", shortEn: "Calendar & Panchangam", icon: CalendarDays },
  { id: "forecast", labelKey: "navForecast", shortTa: "பலன்கள்", shortEn: "Forecast", icon: TrendingUp },
  { id: "porutham", labelKey: "navPorutham", shortTa: "திருமணம்", shortEn: "Porutham", icon: HeartHandshake },
];

// Secondary / Additional Tools (Organized in "More" Dropdown)
const MORE_NAV: {
  id: Page;
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  icon: typeof Compass;
}[] = [
  {
    id: "biodata",
    titleTa: "ஜாதக வரன் குறிப்பு (Biodata)",
    titleEn: "Matrimonial Astro Biodata",
    descTa: "திருமண வரன் ஜாதக விவரம் & PDF தயாரிப்பு",
    descEn: "Matrimonial horoscope biodata maker with PDF export",
    icon: FileText,
  },
  {
    id: "rasipalan",
    titleTa: "ராசி பலன்",
    titleEn: "Daily Rasi Palan",
    descTa: "12 ராசிகளுக்கான தினசரி கிரக நிலை & பலன்கள்",
    descEn: "Daily transit horoscope for all 12 zodiac signs",
    icon: Sparkles,
  },
  {
    id: "chandrashtama",
    titleTa: "சந்திராஷ்டமம்",
    titleEn: "Chandrashtamam",
    descTa: "8-ஆம் இட சந்திரன் துல்லிய ஆரம்ப/முடிவு நேரம்",
    descEn: "Exact 8th Moon transit start/end times",
    icon: Moon,
  },
  {
    id: "gochara",
    titleTa: "கோசார பலன்",
    titleEn: "Gochara Transits",
    descTa: "ஏழரைச் சனி, குரு பலம் & 9 கிரக சஞ்சாரம்",
    descEn: "Sade Sati, Guru Balam & 9-planet transits",
    icon: Orbit,
  },
  {
    id: "nakshatra",
    titleTa: "நட்சத்திரம் & பாதம்",
    titleEn: "Nakshatra & Pada",
    descTa: "27 நட்சத்திரங்கள், யோனி, நாடி, அதிதேவதை",
    descEn: "27 Stars, Yoni, Nadi, Deities & 4 padas",
    icon: Sparkles,
  },
  {
    id: "babynames",
    titleTa: "குழந்தைப் பெயர் தேர்வு",
    titleEn: "Baby Name Finder",
    descTa: "நட்சத்திர பாதம் & தொடக்க எழுத்துப் பெயர்கள்",
    descEn: "Auspicious Tamil names by star syllables",
    icon: Baby,
  },
  {
    id: "nazhigai",
    titleTa: "நாழிகை மாற்றி",
    titleEn: "Nazhigai Converter",
    descTa: "சூரியோதயம் முதல் நாழிகை, விநாடி மாற்றி",
    descEn: "Sunrise-based Nazhigai & clock time converter",
    icon: Clock,
  },
  {
    id: "prasna",
    titleTa: "பிரஷ்னம் (சோழி ஆருடம்)",
    titleEn: "Prasna (Horary)",
    descTa: "1-108 சோழி ஆருட எண் கணிப்பு",
    descEn: "1-108 Horary question divination",
    icon: HelpCircle,
  },
  {
    id: "numerology",
    titleTa: "எண் கணிதம்",
    titleEn: "Numerology",
    descTa: "பிறந்த தேதி மற்றும் பெயர் பலன்கள்",
    descEn: "Birth date & name number analysis",
    icon: Hash,
  },
  {
    id: "glossary",
    titleTa: "சொற்பொருள் விளக்கம்",
    titleEn: "Astro Glossary",
    descTa: "ஜோதிடச் சொற்களின் எளிய விளக்கங்கள்",
    descEn: "Definitions of Tamil astrology terms",
    icon: BookOpen,
  },
  {
    id: "calculation-method",
    titleTa: "கணித முறை விளக்கம்",
    titleEn: "Calculation Method",
    descTa: "திருக்கணிதம் & லஹிரி அயனாம்சம், DE440 எஃபிமெரிஸ் & முறைமை",
    descEn: "Thirukanitham & Lahiri Ayanamsa, DE440 ephemeris & methodology",
    icon: BookOpen,
  },
  {
    id: "contact",
    titleTa: "தொடர்புக்கு",
    titleEn: "Contact & Support",
    descTa: "கருத்துக்கள் & உதவி",
    descEn: "Feedback & developer support",
    icon: Mail,
  },
];

// All Nav Items for Footer Directory
const ALL_NAV: { id: Page; labelKey: string; icon: typeof Compass }[] = [
  ...PRIMARY_NAV.map((p) => ({ id: p.id, labelKey: p.labelKey, icon: p.icon })),
  { id: "biodata", labelKey: "navBiodata", icon: FileText },
  { id: "rasipalan", labelKey: "navRasiPalan", icon: Sparkles },
  { id: "chandrashtama", labelKey: "navChandrashtama", icon: Moon },
  { id: "gochara", labelKey: "navGochara", icon: Orbit },
  { id: "nakshatra", labelKey: "navNakshatraPada", icon: Sparkles },
  { id: "babynames", labelKey: "navBabyNames", icon: Baby },
  { id: "nazhigai", labelKey: "navNazhigai", icon: Clock },
  { id: "prasna", labelKey: "navPrasna", icon: HelpCircle },
  { id: "numerology", labelKey: "navNumerology", icon: Hash },
  { id: "glossary", labelKey: "navGlossary", icon: BookOpen },
  { id: "calculation-method", labelKey: "navCalculationMethod", icon: BookOpen },
  { id: "contact", labelKey: "contactTitle", icon: Mail },
  { id: "disclaimer", labelKey: "navDisclaimer", icon: ShieldCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const { page, go, getUrl } = useNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const isMoreActive = MORE_NAV.some((m) => m.id === page);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between">
      <CodepackrFamilyBar language={lang} className="no-print" />
      <header className="no-print sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur-md transition-shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <button
            type="button"
            id="sidebar-toggle-btn"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="relative z-[110] flex size-9 sm:size-10 items-center justify-center rounded-xl border border-border bg-surface text-fg hover:bg-elevated cursor-pointer shrink-0 shadow-sm transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            title={lang === "ta" ? "பட்டி (மெனு)" : "Navigation Menu"}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <a
            href={getUrl("home")}
            onClick={(e) => {
              e.preventDefault();
              go("home");
              setMobileMenuOpen(false);
              setMoreMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left rounded-md transition-transform active:scale-[0.98] focus-visible:outline-none shrink-0"
            aria-label="Home"
          >
            <div className="relative flex size-9 sm:size-10 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-xs">
              <img src="/favicon.svg" alt="" className="size-7 sm:size-8 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink leading-tight">
                  {t(lang, "brand")}
                </span>
                <span className="hidden sm:inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                  Vedic
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted leading-none mt-0.5">
                {t(lang, "tagline")}
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {PRIMARY_NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              const url = getUrl(n.id);
              const label = lang === "ta" ? n.shortTa : n.shortEn;

              return (
                <a
                  key={n.id}
                  href={url}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.id);
                    setMoreMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 h-8.5 rounded-lg px-2.5 text-xs font-semibold transition-all whitespace-nowrap",
                    active
                      ? "bg-accent text-accent-fg shadow-2xs"
                      : "text-muted hover:text-fg hover:bg-elevated/70"
                  )}
                >
                  <Icon className={cn("size-3.5", active ? "text-accent-fg" : "text-muted")} />
                  <span>{label}</span>
                </a>
              );
            })}

            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((o) => !o)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1.5 h-8.5 rounded-lg px-2.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  isMoreActive
                    ? "bg-accent text-accent-fg shadow-2xs font-semibold"
                    : "text-muted hover:text-fg hover:bg-elevated/70"
                )}
              >
                <span>{lang === "ta" ? "மேலும்" : "More"}</span>
                <ChevronDown className={cn("size-3.5 transition-transform duration-200", moreMenuOpen && "rotate-180")} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border/80 bg-surface/98 p-1.5 shadow-xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border/50 mb-1">
                    {lang === "ta" ? "கூடுதல் சேவைகள்" : "More Astrological Tools"}
                  </div>
                  {MORE_NAV.map((m) => {
                    const Icon = m.icon;
                    const active = page === m.id;
                    const url = getUrl(m.id);
                    return (
                      <a
                        key={m.id}
                        href={url}
                        onClick={(e) => {
                          e.preventDefault();
                          go(m.id);
                          setMoreMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-start gap-2.5 rounded-lg p-2 text-xs transition-colors",
                          active
                            ? "bg-accent/15 text-accent font-semibold"
                            : "text-fg hover:bg-elevated/80"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-md mt-0.5", active ? "bg-accent text-accent-fg" : "bg-elevated text-muted")}>
                          <Icon className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-tight text-ink">
                            {lang === "ta" ? m.titleTa : m.titleEn}
                          </p>
                          <p className="text-[10px] text-muted leading-tight mt-0.5 truncate">
                            {lang === "ta" ? m.descTa : m.descEn}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-elevated p-0.5 border border-border/60">
              {(["ta", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "h-7 rounded-full px-2.5 text-xs font-semibold transition-all cursor-pointer",
                    lang === l
                      ? "bg-accent text-accent-fg shadow-2xs"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {l === "ta" ? "தமிழ்" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden />
          <nav
            id="mobile-nav-drawer"
            className="absolute left-0 top-0 bottom-0 z-[101] w-80 max-w-[85vw] border-r border-border/80 bg-surface px-4 py-3.5 shadow-2xl overflow-y-auto"
            aria-label="Navigation Drawer"
          >
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-2xs">
                  <img src="/favicon.svg" alt="" className="size-5 object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">{t(lang, "brand")}</p>
                  <p className="text-[10px] text-muted leading-none mt-0.5">{lang === "ta" ? "பட்டி (மெனு)" : "Navigation Menu"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-elevated/50 text-fg hover:bg-elevated cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-accent mb-2 px-1">
                {lang === "ta" ? "முக்கிய ஜோதிட சேவைகள்" : "Core Astrological Services"}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {PRIMARY_NAV.map((n) => {
                  const Icon = n.icon;
                  const active = page === n.id;
                  const url = getUrl(n.id);
                  const label = lang === "ta" ? n.shortTa : n.shortEn;
                  return (
                    <a
                      key={n.id}
                      href={url}
                      onClick={(e) => {
                        e.preventDefault();
                        go(n.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-start gap-2 rounded-lg p-2.5 text-xs font-medium text-left transition-colors min-w-0",
                        active
                          ? "bg-accent text-accent-fg font-semibold shadow-2xs"
                          : "bg-elevated/40 text-fg hover:bg-elevated"
                      )}
                    >
                      <Icon className="size-4 shrink-0 mt-0.5" />
                      <span className="min-w-0 flex-1 leading-tight break-words whitespace-normal">{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted mb-2 px-1">
                {lang === "ta" ? "கூடுதல் கருவிகள் & தகவல்" : "More Tools & Information"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {MORE_NAV.map((m) => {
                  const Icon = m.icon;
                  const active = page === m.id;
                  const url = getUrl(m.id);
                  return (
                    <a
                      key={m.id}
                      href={url}
                      onClick={(e) => {
                        e.preventDefault();
                        go(m.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg p-2.5 text-xs transition-colors",
                        active
                          ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                          : "bg-elevated/30 text-fg hover:bg-elevated/70"
                      )}
                    >
                      <div className={cn("p-1.5 rounded-md shrink-0", active ? "bg-accent text-accent-fg" : "bg-elevated text-muted")}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight text-ink">
                          {lang === "ta" ? m.titleTa : m.titleEn}
                        </p>
                        <p className="text-[10.5px] text-muted leading-tight mt-0.5 truncate">
                          {lang === "ta" ? m.descTa : m.descEn}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>

      <footer className="no-print border-t border-border/80 bg-surface/70 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <RotatingQuote lang={lang} variant="compact" className="mb-6 shadow-xs" />
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 items-center border-b border-border/60 pb-6">
            <div>
              <a
                href={getUrl("home")}
                onClick={(e) => {
                  e.preventDefault();
                  go("home");
                }}
                className="font-display text-lg font-bold text-accent hover:underline flex items-center gap-1.5"
              >
                <span>astro.codepackr.com</span>
              </a>
              <p className="text-xs text-muted mt-1 leading-relaxed max-w-md">
                {lang === "ta"
                  ? "உயர்தர தமிழ் ஜாதகம், தசா புக்தி, தசவித திருமணப் பொருத்தம் மற்றும் ஒரு பக்க A4 திருமண விவரப் படிவம் கணிப்பான்."
                  : "High Precision Tamil Horoscope, Dasa-Bhukti, 10-Poruthams matching, and 1-page A4 Marriage Biodata generator."}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                <ShieldCheck className="size-3.5 text-emerald-700" />
                <span>100% Client-side · Private · Free</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 text-xs">
              <span className="font-semibold text-fg">
                Web:{" "}
                <a href="https://astro.codepackr.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  astro.codepackr.com
                </a>
              </span>
              <span className="text-muted">
                Contact:{" "}
                <a href="mailto:codepackr@gmail.com" className="text-accent hover:underline">
                  codepackr@gmail.com
                </a>
              </span>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href={getUrl("disclaimer")}
                  onClick={(e) => {
                    e.preventDefault();
                    go("disclaimer");
                  }}
                  className="rounded border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                >
                  {lang === "ta" ? "பொறுப்புத் துறப்பு" : "Disclaimer"} &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-border/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xs sm:text-sm font-bold text-ink flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-accent" />
                {lang === "ta" ? "இலவச தமிழ் ஜோதிட சேவைகள் & கருவிகள்" : "Vedic Astrology Tools & Online Calculators"}
              </h3>
              <span className="text-[11px] text-muted hidden sm:inline">
                {lang === "ta" ? "அனைத்து கருவிகளுக்கும் தனி முகவரி (URL)" : "Independent Dedicated URLs & Instant Access"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {ALL_NAV.map((n) => {
                const isCurrent = page === n.id;
                const url = getUrl(n.id);
                const label =
                  n.id === "contact"
                    ? (lang === "ta" ? "தொடர்புக்கு" : "Contact")
                    : t(lang, n.labelKey as any);
                return (
                  <a
                    key={n.id}
                    href={url}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all text-left",
                      isCurrent
                        ? "border-accent bg-accent/10 shadow-2xs font-semibold"
                        : "border-border/60 bg-surface/80 hover:border-accent/40 hover:bg-elevated/60"
                    )}
                  >
                    <n.icon className={cn("size-4 shrink-0", isCurrent ? "text-accent" : "text-muted group-hover:text-accent")} />
                    <span className="truncate text-xs text-ink group-hover:text-accent font-medium">{label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <p className="flex items-center flex-wrap gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              <span>{t(lang, "computerGeneratedNotice")}</span>
              <span className="text-border">&bull;</span>
              <a
                href={getUrl("glossary")}
                onClick={(e) => {
                  e.preventDefault();
                  go("glossary");
                }}
                className="text-accent underline font-medium hover:text-accent/80"
              >
                {t(lang, "navGlossary")}
              </a>
              <span className="text-border">&bull;</span>
              <a
                href={getUrl("calculation-method")}
                onClick={(e) => {
                  e.preventDefault();
                  go("calculation-method");
                }}
                className="text-accent underline font-medium hover:text-accent/80"
              >
                {t(lang, "navCalculationMethod")}
              </a>
              <span className="text-border">&bull;</span>
              <a
                href={getUrl("disclaimer")}
                onClick={(e) => {
                  e.preventDefault();
                  go("disclaimer");
                }}
                className="text-accent underline font-medium hover:text-accent/80"
              >
                {t(lang, "navDisclaimer")}
              </a>
            </p>
            <p>&copy; {new Date().getFullYear()} astro.codepackr.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
