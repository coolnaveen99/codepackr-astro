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
                  page === n.id ? "bg-ink text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {n.id === "contact" ? "Contact" : t(lang, n.label as "navChart" | "navPorutham" | "navBiodata")}
              </button>
            ))}
            <div className="ml-2 flex rounded-full bg-elevated p-1">
              {(["ta", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "h-8 rounded-full px-3 text-sm font-medium",
                    lang === l ? "bg-ink text-accent-fg" : "text-muted hover:text-fg",
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
      <footer className="no-print mx-auto max-w-6xl px-4 py-8 text-xs text-muted sm:px-6">
        {t(lang, "disclaimer")}
      </footer>
    </div>
  );
}
