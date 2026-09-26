// Codepackr Astro - Main Application Component
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BiodataMaker } from "@/components/biodata-maker";
import { JathagamDashboard } from "@/components/jathagam-dashboard";
import { ChartViews } from "@/components/chart-views";
import { ContactForm } from "@/components/contact-form";
import { DisclaimerPage } from "@/components/disclaimer-page";
import { LegalTrustPage } from "@/components/legal-trust-page";
import { PoruthamView } from "@/components/porutham-view";
import { DailyRasiView } from "@/components/daily-rasi";
import { NumerologyView } from "@/components/numerology-view";
import { GlossaryView } from "@/components/glossary-view";
import { PrasnaView } from "@/components/prasna-view";
import { ChandrashtamaView } from "@/components/chandrashtama-view";
import { GocharaView } from "@/components/gochara-view";
import { NakshatraView } from "@/components/nakshatra-view";
import { BabyNamesView } from "@/components/baby-names-view";
import { NazhigaiView } from "@/components/nazhigai-view";
import { TamilCalendarView } from "@/components/tamil-calendar-view";
import { ForecastView } from "@/components/forecast-view";
import { CalculationMethodView } from "@/components/calculation-method-view";
import { AstroValidationView } from "@/components/astro-validation-view";
import { HomeToolsView } from "@/components/home-tools-view";
import { compute, type BirthInput } from "@/lib/astro/engine";
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
  const { page, go } = useNav();
  usePageSeo(page, lang);
  const [draft, setDraft] = useState<BirthInput>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("d") && p.get("m") && p.get("y")) {
        return {
          ...DEFAULT_INPUT,
          name: p.get("name") || "",
          sex: (p.get("sex") === "F" ? "F" : "M") as "M" | "F",
          day: Number(p.get("d")),
          month: Number(p.get("m")),
          year: Number(p.get("y")),
          hour: Number(p.get("h") || 6),
          minute: Number(p.get("min") || 0),
          lat: Number(p.get("lat") || 13.0667),
          lon: Number(p.get("lon") || p.get("lng") || 80.25),
          tz: Number(p.get("tz") || 5.5),
          place: p.get("place") || "Madras",
        };
      }
    }
    return DEFAULT_INPUT;
  });
  const [cast, setCast] = useState<BirthInput | null>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("print") === "auto") {
        if (p.get("d") && p.get("m") && p.get("y")) {
          return {
            ...DEFAULT_INPUT,
            name: p.get("name") || "",
            sex: (p.get("sex") === "F" ? "F" : "M") as "M" | "F",
            day: Number(p.get("d")),
            month: Number(p.get("m")),
            year: Number(p.get("y")),
            hour: Number(p.get("h") || 6),
            minute: Number(p.get("min") || 0),
            lat: Number(p.get("lat") || 13.0667),
            lon: Number(p.get("lon") || p.get("lng") || 80.25),
            tz: Number(p.get("tz") || 5.5),
            place: p.get("place") || "Madras",
          };
        }
        return DEFAULT_INPUT;
      }
    }
    return null;
  });
  const result = useMemo(() => (cast ? compute(cast) : null), [cast]);

  return (
    <AppShell>
      {page === "porutham" ? (
        <PoruthamView lang={lang} />
      ) : page === "panchangam" || page === "tamil-calendar" ? (
        <TamilCalendarView lang={lang} />
      ) : page === "rasipalan" ? (
        <DailyRasiView lang={lang} />
      ) : page === "chandrashtama" ? (
        <ChandrashtamaView lang={lang} />
      ) : page === "gochara" ? (
        <GocharaView lang={lang} />
      ) : page === "nakshatra" ? (
        <NakshatraView lang={lang} onNavigateToBabyNames={() => go("babynames")} />
      ) : page === "babynames" ? (
        <BabyNamesView lang={lang} />
      ) : page === "nazhigai" ? (
        <NazhigaiView lang={lang} />
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
      ) : page === "privacy" ? (
        <LegalTrustPage page="privacy" />
      ) : page === "about" ? (
        <LegalTrustPage page="about" />

      ) : page === "forecast" ? (
        <ForecastView lang={lang} result={result} />
      ) : page === "calculation-method" ? (
        <CalculationMethodView lang={lang} />
      ) : page === "astro-validation" ? (
        <AstroValidationView lang={lang} />
      ) : page === "jathagam" ? (
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
        </>
      ) : (
        <HomeToolsView lang={lang} />
      )}
    </AppShell>
  );
}
