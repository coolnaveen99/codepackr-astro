// Codepackr Astro - Main Application Component
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BiodataMaker } from "@/components/biodata-maker";
import { BirthForm } from "@/components/birth-form";
import { ChartViews } from "@/components/chart-views";
import { ContactForm } from "@/components/contact-form";
import { DisclaimerPage } from "@/components/disclaimer-page";
import { PoruthamView } from "@/components/porutham-view";
import { PanchangamView } from "@/components/panchangam-view";
import { DailyRasiView } from "@/components/daily-rasi";
import { NumerologyView } from "@/components/numerology-view";
import { GlossaryView } from "@/components/glossary-view";
import { PrasnaView } from "@/components/prasna-view";
import { compute, type BirthInput } from "@/lib/astro/engine";
import { t } from "@/lib/astro/i18n";
import { LangProvider, useLang } from "@/lib/lang";
import { NavProvider, useNav } from "@/lib/nav";
import { GaneshProvider } from "@/lib/ganesh-context";
import { DEFAULT_INPUT, SAMPLE_CHARTS } from "@/lib/astro/samples";

export default function App() {
  return (
    <LangProvider>
      <NavProvider>
        <GaneshProvider>
          <Shell />
        </GaneshProvider>
      </NavProvider>
    </LangProvider>
  );
}

function Shell() {
  const { lang } = useLang();
  const { page } = useNav();
  const [draft, setDraft] = useState<BirthInput>(DEFAULT_INPUT);
  const [cast, setCast] = useState<BirthInput | null>(null);
  const result = useMemo(() => (cast ? compute(cast) : null), [cast]);

  return (
    <AppShell>
      {page === "porutham" ? (
        <PoruthamView lang={lang} />
      ) : page === "panchangam" ? (
        <PanchangamView lang={lang} />
      ) : page === "rasipalan" ? (
        <DailyRasiView lang={lang} />
      ) : page === "numerology" ? (
        <NumerologyView lang={lang} />
      ) : page === "glossary" ? (
        <GlossaryView lang={lang} />
      ) : page === "prasna" ? (
        <PrasnaView lang={lang} />
      ) : page === "biodata" ? (
        <BiodataMaker lang={lang} />
      ) : page === "contact" ? (
        <ContactForm />
      ) : page === "disclaimer" ? (
        <DisclaimerPage />
      ) : (
        <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:py-10">
          <aside className="no-print min-w-0 lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
            <div className="rounded-xl bg-surface p-4 shadow-card sm:p-5">
              <BirthForm lang={lang} value={draft} onChange={setDraft} onSubmit={() => setCast(draft)} />
              <div className="mt-4 border-t border-border/60 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {t(lang, "sampleCharts")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {SAMPLE_CHARTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="rounded-md bg-elevated px-3 py-2 text-left text-xs font-medium text-fg hover:bg-accent/15"
                      onClick={() => {
                        setDraft(s.input);
                        setCast(s.input);
                      }}
                    >
                      {lang === "ta" ? s.labelTa : s.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <section className="min-w-0 lg:col-span-2">
            {result ? (
              <ChartViews result={result} lang={lang} />
            ) : (
              <div className="flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-16 text-center shadow-card">
                <p className="font-display text-2xl text-fg">{t(lang, "emptyTitle")}</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{t(lang, "emptyBody")}</p>
              </div>
            )}
          </section>
        </main>
      )}
    </AppShell>
  );
}
