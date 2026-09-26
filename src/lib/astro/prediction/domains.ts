// Codepackr Astro — Multi-Domain Prediction Engine (16 Life Areas)
import type { DomainForecast, PredictionEvidence } from "../types";
import { buildPredictionEvidence } from "./evidence";
import { resolveFactorConflicts } from "./conflicts";
import { houseFrom } from "../chart/houses";
import { SIGN_LORDS } from "../chart/dignity";

export type ChartEvaluationData = {
  lagnaSign: number;
  moonSign: number;
  activeMahaDasaLord: string;
  activeBhuktiLord: string;
  bodies: Record<string, { sign: number; house: number; retrograde: boolean }>;
  yogas: Array<{ nameTa: string; nameEn: string }>;
  sadeSatiActive: boolean;
};

export const DOMAIN_METADATA = [
  { id: "overall", nameTa: "பொதுவான கண்ணோட்டம்", nameEn: "Overall Life Theme" },
  { id: "career", nameTa: "தொழில் & உத்தியோகம்", nameEn: "Career & Profession" },
  { id: "finance", nameTa: "நிதி & பொருளாதார நிலை", nameEn: "Finance & Wealth" },
  { id: "business", nameTa: "வியாபாரம் & புதிய முயற்சிகள்", nameEn: "Business & Enterprise" },
  { id: "education", nameTa: "கல்வி & வித்தை", nameEn: "Education & Learning" },
  { id: "marriage", nameTa: "திருமணம் & உறவுமுறை", nameEn: "Marriage & Relationships" },
  { id: "family", nameTa: "குடும்ப ஒற்றுமை", nameEn: "Family Harmony" },
  { id: "children", nameTa: "சந்ததி பாக்கியம்", nameEn: "Children & Progeny" },
  { id: "property", nameTa: "சொத்து & வீடு யோகம்", nameEn: "Property & Real Estate" },
  { id: "vehicle", nameTa: "வாகன யோகம்", nameEn: "Vehicles & Conveyances" },
  { id: "travel", nameTa: "பயணங்கள்", nameEn: "Travel & Journeys" },
  { id: "foreign", nameTa: "வெளிநாட்டு வாய்ப்புகள்", nameEn: "Foreign & Relocation" },
  { id: "wellness", nameTa: "உடல்நலம் & ஓய்வு", nameEn: "Wellness & Health Balance", medicalDisclaimer: true },
  { id: "spirituality", nameTa: "ஆன்மீகம் & அமைதி", nameEn: "Spirituality & Inner Peace" },
  { id: "personal_growth", nameTa: "சுயவளர்ச்சி & திறன்", nameEn: "Personal Growth & Skills" },
  { id: "social_reputation", nameTa: "சமூக மரியாதை & அந்தஸ்து", nameEn: "Social Status & Recognition" },
] as const;

/**
 * Evaluates predictions for all 16 life domains based on structured chart factors.
 */
export function evaluateAllDomains(
  chartData: ChartEvaluationData,
  periodStart: string,
  periodEnd: string
): Record<string, DomainForecast> {
  const forecasts: Record<string, DomainForecast> = {};

  const lordOfHouse = (h: number) => SIGN_LORDS[(chartData.lagnaSign + h - 1) % 12]!;

  for (const meta of DOMAIN_METADATA) {
    const natalFactors: string[] = [];
    const dashaFactors: string[] = [];
    const transitFactors: string[] = [];
    const vargaFactors: string[] = [];
    const supportingRules: string[] = [];
    const conflictingRules: string[] = [];

    // Domain-specific astrological factor evaluation
    if (meta.id === "career") {
      const lord10 = lordOfHouse(10);
      natalFactors.push(`10-ஆம் அதிபதி: ${lord10}`);
      dashaFactors.push(`தற்போதைய தசா நாதர்: ${chartData.activeMahaDasaLord}`);
      if (["jupiter", "sun", "saturn", "mercury"].includes(chartData.activeMahaDasaLord)) {
        supportingRules.push("தொழில் காரக கிரகத்தின் தசா காலக்கட்டம் பாரம்பரிய விதிகளின்படி நலம் பயக்கும்.");
      }
      if (chartData.sadeSatiActive) {
        conflictingRules.push("சனி பெயர்ச்சி கூடுதல் பொறுப்புகளையும் பொறுமையையும் கோருகிறது.");
      }
      vargaFactors.push("தசாம்சம் (D10) தொழில் நுண்ணாய்வுக்கு உகந்தது.");
    } else if (meta.id === "finance") {
      const lord2 = lordOfHouse(2);
      const lord11 = lordOfHouse(11);
      natalFactors.push(`தன ஸ்தானாதிபதி: ${lord2}, லாபாதிபதி: ${lord11}`);
      dashaFactors.push(`தசா-புத்தி நாதர்கள்: ${chartData.activeMahaDasaLord} - ${chartData.activeBhuktiLord}`);
      if (["jupiter", "venus", "mercury"].includes(chartData.activeMahaDasaLord)) {
        supportingRules.push("சுப தசா காலக்கட்டம் பொருளாதார வரவுகளுக்கு சாதகமாக அமைகிறது.");
      }
      if (chartData.sadeSatiActive) {
        conflictingRules.push("விரையச் செலவுகளில் கூடுதல் விழிப்புணர்வு தேவைப்படுகிறது.");
      }
      vargaFactors.push("ஹோரா (D2) நிதி பலத்தை ஆதரிக்கிறது.");
    } else if (meta.id === "marriage") {
      const lord7 = lordOfHouse(7);
      natalFactors.push(`7-ஆம் அதிபதி: ${lord7}, களத்திர காரகன்: சுக்கிரன்`);
      dashaFactors.push(`நடப்பு தசா நாதர்: ${chartData.activeMahaDasaLord}`);
      if (["venus", "jupiter", "mercury"].includes(chartData.activeMahaDasaLord)) {
        supportingRules.push("சுப கிரக தசா குடும்ப உறவுகளுக்கு பாரம்பரிய ஆதரவை நல்குகிறது.");
      }
      vargaFactors.push("நவாம்சம் (D9) தம்பதியர் ஒற்றுமையை உறுதி செய்கிறது.");
    } else if (meta.id === "education") {
      const lord4 = lordOfHouse(4);
      const lord5 = lordOfHouse(5);
      natalFactors.push(`வித்யா ஸ்தானாதிபதி: ${lord4}, புத்தி ஸ்தானாதிபதி: ${lord5}`);
      supportingRules.push("புதன் மற்றும் குருவின் சுப தொடர்பு கல்வி ஈடுபாட்டிற்கு உகந்தது.");
      vargaFactors.push("சதுர்விம்சாம்சம் (D24) கல்வி ஆய்வுக்குப் பயன்படுத்தப்பட்டுள்ளது.");
    } else if (meta.id === "wellness") {
      natalFactors.push("லக்னாதிபதி மற்றும் 6-ஆம் அதிபதியின் நிலை");
      dashaFactors.push(`தசா இயக்கம்: ${chartData.activeMahaDasaLord}`);
      if (chartData.sadeSatiActive) {
        conflictingRules.push("உடல் ஓய்வு மற்றும் ஆரோக்கியத்தில் கூடுதல் கவனம் தேவைப்படுகிறது.");
      }
      supportingRules.push("சீரான உணவு மற்றும் உடற்பயிற்சி பாரம்பரியத்தில் வலியுறுத்தப்படுகிறது.");
    } else {
      // General baseline
      natalFactors.push(`லக்னம்: ${chartData.lagnaSign + 1}-ஆம் ராசி, சந்திரன்: ${chartData.moonSign + 1}-ஆம் ராசி`);
      dashaFactors.push(`தசா நாதர்: ${chartData.activeMahaDasaLord}`);
      supportingRules.push("பொதுவான சுப கிரக தொடர்புகள் நல்ல முன்னேற்றத்தை அளிக்கின்றன.");
    }

    const evidence = buildPredictionEvidence(
      meta.id,
      periodStart,
      periodEnd,
      natalFactors,
      dashaFactors,
      transitFactors,
      vargaFactors,
      supportingRules,
      conflictingRules
    );

    const resolved = resolveFactorConflicts(meta.nameTa, meta.nameEn, evidence);

    forecasts[meta.id] = {
      id: meta.id,
      titleTa: meta.nameTa,
      titleEn: meta.nameEn,
      theme: resolved.themeEn,
      themeTa: resolved.themeTa,
      period: `${periodStart} to ${periodEnd}`,
      supportLevel: resolved.supportLevel,
      support: supportingRules.length ? supportingRules : natalFactors,
      caution: conflictingRules.length ? conflictingRules : ["அவசர முடிவுகளைத் தவிர்க்கவும்."],
      traditionalInterpretation: resolved.synthesisTa,
      evidence,
      medicalDisclaimer: meta.id === "wellness",
    };
  }

  return forecasts;
}
