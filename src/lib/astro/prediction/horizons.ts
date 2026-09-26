// Codepackr Astro — Multi-Year Forecast Horizons (1 to 60 Years)
import type { MultiYearForecast, ForecastPeriod } from "../types";
import { evaluateAllDomains, type ChartEvaluationData } from "./domains";
import { generateCalculationReceipt } from "../provenance/receipt";
import { DEFAULT_PRODUCTION_PROFILE } from "../provenance/profile";
import { samvatsaraIndexFromYear, getSamvatsaraByIndex } from "../calendar/samvatsara";

export type HorizonType = "1yr" | "3yr" | "5yr" | "10yr" | "20yr" | "60yr";

/**
 * Generates an evidence-grounded multi-year forecast for the selected horizon.
 * Detail naturally scales with horizon: monthly for 1yr, yearly for 5yr, broad phases for 60yr.
 */
export function generateHorizonForecast(
  chartData: ChartEvaluationData,
  horizon: HorizonType,
  startYear: number = 2026,
  startMonth: number = 4
): MultiYearForecast {
  const periods: ForecastPeriod[] = [];

  let titleTa = "1 ஆண்டு பலன்கள் (மாதாந்திர விவரம்)";
  let titleEn = "1-Year Forecast (Monthly Breakdown)";
  let overviewTa = "அடுத்த 12 மாதங்களுக்கான கிரக சஞ்சாரங்கள் மற்றும் தசா-புத்தி அடிப்படையிலான பாரம்பரிய பலன்கள்.";
  let overviewEn = "Traditional month-by-month astrological trends based on planetary transits and Dasa periods.";

  if (horizon === "1yr") {
    // 12 Monthly periods
    for (let m = 0; m < 12; m++) {
      const curMonth = ((startMonth - 1 + m) % 12) + 1;
      const curYear = startYear + Math.floor((startMonth - 1 + m) / 12);
      const pad = (n: number) => String(n).padStart(2, "0");
      const pStart = `${curYear}-${pad(curMonth)}-01`;
      const pEnd = `${curYear}-${pad(curMonth)}-28`;

      const domains = evaluateAllDomains(chartData, pStart, pEnd);

      // Compute dynamic supporting & caution factors from actual chart inputs
      const suppFactors: string[] = [
        `தசா நாதர் (${chartData.activeMahaDasaLord.toUpperCase()}) அதிபதி பலம்`,
        chartData.yogas.length > 0
          ? `${chartData.yogas[0]?.nameTa || "யோகம்"} சாதக தாக்கம்`
          : "ராசிக்கு சுப கிரகப் பார்வை பலம்",
      ];
      const cautFactors: string[] = chartData.sadeSatiActive
        ? ["சனி கோச்சார நிலை - விழிப்புணர்வும் நிதானமும் தேவை", "விரையச் செலவுகளைக் கட்டுப்படுத்துதல்"]
        : ["புதிய முதலீடுகளில் நிதானமான திட்டமிடல்", "முக்கிய ஆவணங்களை இருமுறை சரிபார்த்தல்"];

      // Derive supportLevel from evaluated domains
      const domainList = Object.values(domains);
      const strongDomains = domainList.filter((d) => d.supportLevel === "strong").length;
      const cautionDomains = domainList.filter((d) => d.supportLevel === "caution").length;
      const periodLevel: ForecastPeriod["supportLevel"] =
        strongDomains >= 4 ? "strong" : cautionDomains >= 4 ? "caution" : strongDomains >= 2 ? "moderate" : "mixed";

      periods.push({
        start: pStart,
        end: pEnd,
        labelTa: `${curYear} ${pad(curMonth)}-ஆம் மாதம்`,
        labelEn: `Month ${m + 1} (${curYear}-${pad(curMonth)})`,
        mahaDasa: chartData.activeMahaDasaLord,
        bhukti: chartData.activeBhuktiLord,
        majorTransits: [
          `சந்திரன் மாத சுழற்சி (${curMonth} / 12)`,
          chartData.sadeSatiActive ? "சனி கோச்சாரம் (விழிப்புணர்வு)" : "குரு சுப பார்வை சுழற்சி",
        ],
        supportingFactors: suppFactors,
        cautionFactors: cautFactors,
        supportLevel: periodLevel,
        domains,
      });
    }
  } else if (horizon === "3yr" || horizon === "5yr") {
    const yearCount = horizon === "3yr" ? 3 : 5;
    titleTa = `${yearCount} ஆண்டுகள் பலன்கள் (ஆண்டுவாரியாக)`;
    titleEn = `${yearCount}-Year Forecast (Yearly Overview)`;
    overviewTa = `${yearCount} ஆண்டுகளுக்கான முக்கிய தசா மாற்றங்கள் மற்றும் பெரிய கிரகங்களின் சஞ்சார ஆய்வு.`;
    overviewEn = `Broad ${yearCount}-year directional trends highlighting major Dasa transitions and slow transits.`;

    for (let y = 0; y < yearCount; y++) {
      const curYear = startYear + y;
      const pStart = `${curYear}-04-14`;
      const pEnd = `${curYear + 1}-04-13`;

      const samIdx = samvatsaraIndexFromYear(curYear);
      const sam = getSamvatsaraByIndex(samIdx);

      const domains = evaluateAllDomains(chartData, pStart, pEnd);

      const suppFactors: string[] = [
        `தசா இயக்கம்: ${chartData.activeMahaDasaLord.toUpperCase()}`,
        `சம்வத்ஸர சுழற்சி (${sam.nameTa}) பாரம்பரிய பலம்`,
      ];
      const cautFactors: string[] = chartData.sadeSatiActive
        ? ["சனி பெயர்ச்சி தாக்கம் - கடமைகள் மற்றும் ஒழுக்கத்திற்கு முக்கியத்துவம்"]
        : ["நீண்ட கால முதலீடுகளில் விழிப்புணர்வு"];

      const domainList = Object.values(domains);
      const strongCount = domainList.filter((d) => d.supportLevel === "strong").length;
      const cautionCount = domainList.filter((d) => d.supportLevel === "caution").length;
      const periodLevel: ForecastPeriod["supportLevel"] =
        strongCount >= 4 ? "strong" : cautionCount >= 4 ? "caution" : "moderate";

      periods.push({
        start: pStart,
        end: pEnd,
        labelTa: `${sam.nameTa} ஆண்டு (${curYear} - ${curYear + 1})`,
        labelEn: `${sam.nameEn} Year (${curYear} - ${curYear + 1})`,
        tamilYear: sam.nameTa,
        mahaDasa: chartData.activeMahaDasaLord,
        bhukti: chartData.activeBhuktiLord,
        majorTransits: ["குரு மற்றும் சனி பெயர்ச்சி தாக்கம்"],
        supportingFactors: suppFactors,
        cautionFactors: cautFactors,
        supportLevel: periodLevel,
        domains,
      });
    }
  } else {
    // 10yr, 20yr, 60yr long horizons — Broad phase overviews per Final Decision 27
    const yearCount = horizon === "10yr" ? 10 : horizon === "20yr" ? 20 : 60;
    titleTa = `${yearCount} ஆண்டுகள் நீண்ட கால கண்ணோட்டம்`;
    titleEn = `${yearCount}-Year Life Cycle Overview`;
    overviewTa = "நீண்ட கால தசா சுழற்சிகள், சம்வத்ஸர மாற்றங்கள் மற்றும் முக்கிய வாழ்க்கை கட்டங்களின் பாரம்பரிய தொகுப்பு.";
    overviewEn = "Broad lifecycle phases and Samvatsara calendar eras without fabricated micro-predictions.";

    const step = horizon === "60yr" ? 5 : 2;
    for (let y = 0; y < yearCount; y += step) {
      const curYear = startYear + y;
      const endY = Math.min(startYear + yearCount, curYear + step);
      const pStart = `${curYear}-04-14`;
      const pEnd = `${endY}-04-13`;

      const samIdx = samvatsaraIndexFromYear(curYear);
      const sam = getSamvatsaraByIndex(samIdx);

      const domains = evaluateAllDomains(chartData, pStart, pEnd);

      periods.push({
        start: pStart,
        end: pEnd,
        labelTa: `${curYear} முதல் ${endY} வரை (${sam.nameTa} பருவம்)`,
        labelEn: `Phase ${curYear} to ${endY} (${sam.nameEn} Era)`,
        tamilYear: sam.nameTa,
        mahaDasa: chartData.activeMahaDasaLord,
        majorTransits: ["நீண்ட கால சஞ்சார சுழற்சி"],
        supportingFactors: [
          `தசா கட்டமைப்பு (${chartData.activeMahaDasaLord.toUpperCase()})`,
          `${sam.nameTa} கால சுழற்சி வளர்ச்சி`,
        ],
        cautionFactors: ["இயற்கை பருவ மாற்றங்களை ஏற்று கடமைகளில் நிலைத்திருத்தல்"],
        supportLevel: "moderate",
        domains,
      });
    }
  }

  // Provenance receipt & metadata
  const { receipt, metadata } = generateCalculationReceipt(
    `${startYear}-01-01`,
    "12:00",
    13.0827,
    80.2707,
    "Asia/Kolkata",
    DEFAULT_PRODUCTION_PROFILE
  );

  return {
    horizon,
    titleTa,
    titleEn,
    overviewTa,
    overviewEn,
    evidenceSummary: {
      strongCount: periods.filter((p) => p.supportLevel === "strong").length,
      moderateCount: periods.filter((p) => p.supportLevel === "moderate").length,
      mixedCount: periods.filter((p) => p.supportLevel === "mixed").length,
      cautionCount: periods.filter((p) => p.supportLevel === "caution").length,
    },
    periods,
    receipt,
    metadata,
  };
}
