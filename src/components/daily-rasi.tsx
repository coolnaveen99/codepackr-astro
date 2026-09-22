// Codepackr Astro - Daily Rasi Palan page (Phase 2)
import { useMemo, useState } from "react";
import { SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
import { buildDailyRasiPalan } from "@/lib/astro/rasi-palan";
import { t, type Lang } from "@/lib/astro/i18n";
import { Panel } from "@/components/analysis-panes";
import { cn } from "@/lib/utils";

export function DailyRasiView({ lang }: { lang: Lang }) {
  const [school, setSchool] = useState<"thirukanitham" | "vakya" | "lahiri">("thirukanitham");
  const bundle = useMemo(
    () => buildDailyRasiPalan({ lang, school }),
    [lang, school],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "navRasiPalan")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{t(lang, "rasiPalanLead")}</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="rounded-lg bg-surface px-4 py-3 shadow-card">
          <p className="text-xs text-muted uppercase tracking-wide">{t(lang, "date")}</p>
          <p className="font-display text-lg">
            {bundle.dateLabel} · {bundle.weekday}
          </p>
        </div>
        <div className="rounded-lg bg-surface px-4 py-3 shadow-card">
          <p className="text-xs text-muted uppercase tracking-wide">{t(lang, "moon")}</p>
          <p className="font-display text-lg">
            {lang === "ta" ? SIGNS_TA[bundle.moonSign] : SIGNS_EN[bundle.moonSign]} · {bundle.moonNak}
          </p>
        </div>
        <div className="flex rounded-lg bg-elevated p-1">
          {(
            [
              ["thirukanitham", lang === "ta" ? "திருக்கணிதம்" : "Thirukanitham"],
              ["vakya", lang === "ta" ? "வாக்கியம்" : "Vakya"],
              ["lahiri", "Lahiri"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSchool(id)}
              className={cn(
                "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                school === id ? "bg-accent text-accent-fg font-semibold" : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Panel title={t(lang, "navRasiPalan")}>
        <p className="mb-4 text-xs text-muted">{bundle.tithiHint}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.rows.map((row) => (
            <div
              key={row.sign}
              className={cn(
                "rounded-lg border px-3 py-3",
                row.tone === "good" && "border-emerald-300/80 bg-emerald-50/40",
                row.tone === "caution" && "border-amber-300/80 bg-amber-50/40",
                row.tone === "mixed" && "border-border bg-elevated/40",
              )}
            >
              <h3 className="font-display text-base font-semibold">{row.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{row.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">{t(lang, "disclaimer")}</p>
      </Panel>
    </main>
  );
}
