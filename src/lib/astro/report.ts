// Codepackr Astro - Comprehensive Full Jathagam Report Assembler
// Assembles all calculations, charts, strengths, 12 bhavas, life areas, dasa, yogas, BAV, transits, and remedies
import type { ChartResult, BodyPos } from "./engine";
import type { Analysis } from "./analysis";
import { computeShadbala, type ShadbalaBala, type BhavaBalaRow } from "./strength";
import { allLifeAreas, type LifeAreaReading } from "./predictions";
import { getRemediesFor, dasaNarrative, type RemedyView } from "./remedies";
import type { Lang } from "./i18n";

export interface ReportData {
  result: ChartResult;
  analysis: Analysis;
  shadbala: { rows: ShadbalaBala[]; bhavaBalas: BhavaBalaRow[] };
  lifeAreas: LifeAreaReading[];
  remedies: RemedyView[];
  dasaNarrativeText: string;
  moon: BodyPos;
  lagna: BodyPos;
  dobStr: string;
  tobStr: string;
  nativeName: string;
  schoolName: string;
}

export function buildReportData(result: ChartResult, analysis: Analysis, lang: Lang): ReportData {
  const moon = result.list.find((p) => p.id === "moon") || result.list[0];
  const lagna = result.list.find((p) => p.id === "lagna") || result.list[0];
  const shadbala = computeShadbala(result, analysis);
  const lifeAreas = allLifeAreas(analysis, lang);
  const remedies = getRemediesFor(analysis, lang);
  const currentDasaPlanet = analysis.dasaNow ? analysis.dasaNow.maha : result.dasa.periods[0]?.lord || "sun";
  const dasaNarrativeText = dasaNarrative(currentDasaPlanet, lang);

  const dobStr = `${String(result.input.day).padStart(2, "0")}-${String(result.input.month).padStart(2, "0")}-${result.input.year}`;
  const tobStr = `${String(result.input.hour).padStart(2, "0")}:${String(result.input.minute).padStart(2, "0")}`;
  const nativeName = result.input.name || (lang === "ta" ? "ஜாதகர்" : "Native");
  const schoolName =
    result.input.school === "vakya"
      ? lang === "ta" ? "வாக்கிய பஞ்சாங்கம்" : "Vakya Panchangam"
      : result.input.school === "lahiri"
      ? lang === "ta" ? "லாஹிரி (NCSS)" : "Lahiri (NCSS)"
      : lang === "ta" ? "திருக்கணித பஞ்சாங்கம்" : "Thirukanitham Panchangam";

  return {
    result,
    analysis,
    shadbala,
    lifeAreas,
    remedies,
    dasaNarrativeText,
    moon,
    lagna,
    dobStr,
    tobStr,
    nativeName,
    schoolName,
  };
}
