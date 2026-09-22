// Codepackr Astro - Elevated App Shell & Auspicious Header Navigation
import { useState, type ReactNode } from "react";
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
} from "lucide-react";
import { t } from "@/lib/astro/i18n";
import { useLang } from "@/lib/lang";
import { useNav, type Page } from "@/lib/nav";
import { cn } from "@/lib/utils";

const NAV: { id: Page; label: string; icon: typeof Compass }[] = [
  { id: "jathagam", label: "navChart", icon: Compass },
  { id: "porutham", label: "navPorutham", icon: HeartHandshake },
  { id: "panchangam", label: "navPanchang", icon: CalendarDays },
  { id: "rasipalan", label: "navRasiPalan", icon: Sparkles },
  { id: "numerology", label: "navNumerology", icon: Hash },
  { id: "prasna", label: "navPrasna", icon: HelpCircle },
  { id: "biodata", label: "navBiodata", icon: FileText },
  { id: "glossary", label: "navGlossary", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const { page, go, getUrl } = useNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between">
      <header className="no-print sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur-md transition-shadow">
        {/* Top Info Banner */}
        <div className="border-b border-border/50 bg-elevated/40 px-4 py-1 text-center text-[11px] text-muted flex items-center justify-between sm:px-6">
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <span className="inline-block size-1.5 rounded-full bg-accent animate-pulse" />
            <span>{lang === "ta" ? "100% இலவசம் · தனிநபர் ரகசியம் காக்கப்படும்" : "100% Free · Client-Side Private · Accurate Vedic Engine"}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="mailto:codepackr@gmail.com" className="hover:text-accent text-[10.5px]">
              codepackr@gmail.com
            </a>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          {/* Logo & Brand */}
          <a
            href={getUrl("jathagam")}
            onClick={(e) => {
              e.preventDefault();
              go("jathagam");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left rounded-md transition-transform active:scale-[0.98] focus-visible:outline-none"
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

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id;
              const url = getUrl(n.id);
              const label =
                n.id === "contact"
                  ? (lang === "ta" ? "தொடர்புக்கு" : "Contact")
                  : t(lang, n.label as "navChart" | "navPorutham" | "navPanchang" | "navRasiPalan" | "navNumerology" | "navPrasna" | "navGlossary" | "navBiodata");
              return (
                <a
                  key={n.id}
                  href={url}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.id);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 h-8.5 rounded-lg px-2.5 text-xs font-medium transition-all whitespace-nowrap",
                    active
                      ? "bg-accent text-accent-fg font-semibold shadow-2xs"
                      : "text-muted hover:text-fg hover:bg-elevated/70"
                  )}
                >
                  <Icon className={cn("size-3.5", active ? "text-accent-fg" : "text-muted")} />
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>

          {/* Language Switch & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-elevated p-0.5 border border-border/60">
              {(["ta", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "h-7 rounded-full px-2.5 text-xs font-semibold transition-all",
                    lang === l
                      ? "bg-accent text-accent-fg shadow-2xs"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {l === "ta" ? "தமிழ்" : "EN"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden flex size-8.5 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-fg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Responsive Secondary Horizontal Nav for Medium Screens */}
        <nav className="hidden md:flex lg:hidden border-t border-border/40 px-4 py-1.5 overflow-x-auto gap-1 bg-surface/80" aria-label="Tablet Navigation">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = page === n.id;
            const url = getUrl(n.id);
            const label =
              n.id === "contact"
                ? (lang === "ta" ? "தொடர்புக்கு" : "Contact")
                : t(lang, n.label as "navChart" | "navPorutham" | "navPanchang" | "navRasiPalan" | "navNumerology" | "navPrasna" | "navGlossary" | "navBiodata");
            return (
              <a
                key={n.id}
                href={url}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
                className={cn(
                  "flex items-center gap-1 h-7 rounded-md px-2 text-[11.5px] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-accent text-accent-fg font-semibold"
                    : "text-muted hover:text-fg hover:bg-elevated"
                )}
              >
                <Icon className="size-3" />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border/80 bg-surface px-4 py-3 shadow-lg" aria-label="Mobile Navigation">
            <div className="grid grid-cols-2 gap-1.5">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = page === n.id;
                const url = getUrl(n.id);
                const label =
                  n.id === "contact"
                    ? (lang === "ta" ? "தொடர்புக்கு" : "Contact")
                    : t(lang, n.label as "navChart" | "navPorutham" | "navPanchang" | "navRasiPalan" | "navNumerology" | "navPrasna" | "navGlossary" | "navBiodata");
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
                      "flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium text-left transition-colors",
                      active
                        ? "bg-accent text-accent-fg font-semibold shadow-2xs"
                        : "bg-elevated/40 text-fg hover:bg-elevated"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-border/80 bg-surface/70 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 items-center border-b border-border/60 pb-6">
            <div>
              <a
                href={getUrl("jathagam")}
                onClick={(e) => {
                  e.preventDefault();
                  go("jathagam");
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

          {/* SEO Astrological Tools Directory */}
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
              {NAV.map((n) => {
                const isCurrent = page === n.id;
                const url = getUrl(n.id);
                const label =
                  n.id === "contact"
                    ? (lang === "ta" ? "தொடர்புக்கு" : "Contact")
                    : t(lang, n.label as "navChart" | "navPorutham" | "navPanchang" | "navRasiPalan" | "navNumerology" | "navPrasna" | "navGlossary" | "navBiodata");
                return (
                  <a
                    key={n.id}
                    href={url}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                    className={cn(
                      "group block rounded-lg border p-2 transition-all text-left",
                      isCurrent
                        ? "border-accent bg-accent/10 shadow-2xs font-semibold"
                        : "border-border/60 bg-surface/80 hover:border-accent/40 hover:bg-elevated/60"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-ink group-hover:text-accent">
                      <n.icon className={cn("size-3.5 shrink-0", isCurrent ? "text-accent" : "text-muted group-hover:text-accent")} />
                      <span className="truncate">{label}</span>
                    </div>
                    <span className="text-[10px] text-muted mt-1 block font-mono truncate">
                      {url}
                    </span>
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
