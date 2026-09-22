// Codepackr Astro - Main Application Component
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BiodataMaker } from "@/components/biodata-maker";
import { JathagamDashboard } from "@/components/jathagam-dashboard";
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
import { DEFAULT_INPUT } from "@/lib/astro/samples";

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
        <>
          <JathagamDashboard
            lang={lang}
            draft={draft}
            onChange={setDraft}
            onSubmit={() => setCast(draft)}
            result={result}
          />
          {result ? (
            <section id="astro-analysis" className="astro-analysis-shell mx-auto w-full max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {lang === "ta" ? "மேலும் விரிவான ஜாதக ஆய்வு" : "Detailed horoscope analysis"}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <ChartViews result={result} lang={lang} />
            </section>
          ) : null}
        </> </main>
      )}
    </AppShell>
  );
}
