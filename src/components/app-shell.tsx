import type { ReactNode } from "react";
import { t } from "@/lib/astro/i18n";
import { useLang } from "@/lib/lang";
import { useNav, type Page } from "@/lib/nav";
import { cn } from "@/lib/utils";

const NAV: { id: Page; label: string }[] = [
  { id: "jathagam", label: "navChart" },
  { id: "porutham", label: "navPorutham" },
  { id: "biodata", label: "navBiodata" },
  { id: "contact", label: "Contact" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const { page, go } = useNav();
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="no-print border-b border-border/80 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-10 rounded-sm" />
            <div>
              <h1 className="font-display text-xl leading-tight sm:text-2xl">{t(lang, "brand")}</h1>
              <p className="text-xs text-muted sm:text-sm">{t(lang, "tagline")}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => go(n.id)}
                className={cn(
                  "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                  page === n.id ? "bg-accent text-accent-fg font-semibold shadow-xs" : "text-muted hover:text-fg hover:bg-elevated",
                )}
              >
                {n.id === "contact"
                  ? "Contact"
                  : t(lang, n.label as "navChart" | "navPorutham" | "navBiodata")}
              </button>
            ))}
            <div className="ml-2 flex rounded-full bg-elevated p-1">
              {(["ta", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "h-8 rounded-full px-3 text-sm font-medium transition-colors",
                    lang === l ? "bg-accent text-accent-fg font-semibold shadow-xs" : "text-muted hover:text-fg",
                  )}
                >
                  {l === "ta" ? "தமிழ்" : "EN"}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>
      {children}
      <footer className="no-print border-t border-border/80 bg-surface/60 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 items-center border-b border-border/60 pb-6">
            <div>
              <a
                href="https://astro.codepackr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg font-bold text-accent hover:underline"
              >
                astro.codepackr.com
              </a>
              <p className="text-xs text-muted mt-0.5">
                {lang === "ta"
                  ? "உயர்தர தமிழ் ஜாதகம் & திருமணப் பொருத்தம்"
                  : "High Precision Tamil Jathagam & Porutham"}
              </p>
            </div>
            <div className="text-xs text-muted leading-relaxed">
              <p className="font-medium text-fg mb-1">
                {lang === "ta" ? "நிறுவன விவரம் & சேவை:" : "Company Details & Services:"}
              </p>
              <p>
                {lang === "ta"
                  ? "திருக்கணிதம் மற்றும் வாக்கிய முறை கணிப்புகள், தசவித திருமணப் பொருத்தம் மற்றும் A4 திருமண விவரப் படிவம்."
                  : "Thirukanitham & Vakya planetary engine, 10 Poruthams matching, and A4 print-ready Marriage Biodata generator."}
              </p>
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
              <span className="text-muted">Codepackr Technologies</span>
            </div>
          </div>
          {/* Legal Disclaimer Link */}
          <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <p className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              <span>{t(lang, "computerGeneratedNotice")}</span>
              <span className="text-border">&bull;</span>
              <a
                href="https://astro.codepackr.com/?page=disclaimer"
                target="_blank"
                rel="noopener noreferrer"
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
