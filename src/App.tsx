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
import { usePageSeo } from "@/lib/seo";
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
  usePageSeo(page, lang);
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
              <div className="flex min-h-96 flex-col justify-center rounded-2xl bg-surface border border-border/80 p-6 sm:p-10 text-center shadow-card relative overflow-hidden">
                <div className="absolute -top-16 -right-16 size-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
                <div className="relative z-1 max-w-lg mx-auto">
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20 mb-3">
                    {lang === "ta" ? "முழுமையான இலவச ஜோதிட தளம்" : "100% Free Complete Astrological Platform"}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                    {t(lang, "emptyTitle")}
                  </h2>
                  <p className="mt-2.5 text-sm text-muted leading-relaxed">
                    {t(lang, "emptyBody")}
                  </p>

                  {/* Feature Highlights Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5 text-left text-xs">
                    <div className="rounded-xl border border-border/70 bg-elevated/40 p-3">
                      <strong className="text-accent block font-display text-sm">
                        {lang === "ta" ? "30 பக்க ஜாதக புத்தகம்" : "30-Page Horoscope"}
                      </strong>
                      <span className="text-muted text-[11px] mt-0.5 block">
                        {lang === "ta" ? "ஷட்பலம், 12 பாவ பலன்கள், விம்சொத்தரி தசா" : "Shadbala, 12 Bhavas, Vimshottari Dasa narrative"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-elevated/40 p-3">
                      <strong className="text-accent block font-display text-sm">
                        {lang === "ta" ? "1-பக்க திருமண பயோடேட்டா" : "1-Page Marriage Biodata"}
                      </strong>
                      <span className="text-muted text-[11px] mt-0.5 block">
                        {lang === "ta" ? "சரியான ஒற்றை A4 பக்க PDF பதிவிறக்கம்" : "Strict 1-Page A4 PDF download with charts"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-elevated/40 p-3">
                      <strong className="text-accent block font-display text-sm">
                        {lang === "ta" ? "10 திருமணப் பொருத்தம்" : "10-Porutham Matching"}
                      </strong>
                      <span className="text-muted text-[11px] mt-0.5 block">
                        {lang === "ta" ? "ரஜ்ஜு, வேதை, நாடி, தினப் பொருத்தம்" : "Rajju, Vedha, Nadi, Dina compatibility"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-elevated/40 p-3">
                      <strong className="text-accent block font-display text-sm">
                        {lang === "ta" ? "வாக்கியம் / திருக்கணிதம்" : "Vakya & Thirukanitham"}
                      </strong>
                      <span className="text-muted text-[11px] mt-0.5 block">
                        {lang === "ta" ? "பாரம்பரிய கணித முறைகள்" : "Authentic Tamil computational engines"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-fg shadow-md hover:opacity-95 transition-transform active:scale-95"
                      onClick={() => {
                        const sample = SAMPLE_CHARTS[0].input;
                        setDraft(sample);
                        setCast(sample);
                      }}
                    >
                      <span>{lang === "ta" ? "மாதிரி ஜாதகத்தை உடனே பார்க்கவும்" : "View Sample Horoscope Instantly"} &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </AppShell>
  );
}
