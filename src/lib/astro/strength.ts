// Codepackr Astro - Comprehensive Planetary Strengths & Shadbala
import type { Analysis, Dignity, GrahaReport, BhavaReport } from "./analysis";
import type { ChartResult, BodyPos } from "./engine";
import { vargaSign, angDist, signIndex } from "./engine";
import type { Lang } from "./i18n";
import type { PlanetId } from "./constants";
import { DUSTHANA, KENDRA, EXALT } from "./tables";

export type StrengthLabel = "strong" | "medium" | "needs_support";

const DIG_SCORE: Record<Dignity, number> = {
  exalt: 5,
  moola: 4,
  own: 4,
  friend: 3,
  neutral: 2,
  enemy: 1,
  debil: 0,
};

export function scoreGraha(g: GrahaReport): number {
  let s = DIG_SCORE[g.dignity] ?? 2;
  if (KENDRA.includes(g.house)) s += 1;
  if (DUSTHANA.includes(g.house)) s -= 1;
  if (g.combust) s -= 1;
  if (g.vargottama) s += 1;
  if (g.retrograde && g.id !== "rahu" && g.id !== "ketu") s += 0.5;
  return Math.max(0, Math.min(7, s));
}

export function strengthLabel(score: number): StrengthLabel {
  if (score >= 4.5) return "strong";
  if (score >= 2.5) return "medium";
  return "needs_support";
}

export function strengthText(label: StrengthLabel, lang: Lang): string {
  if (lang === "ta") {
    if (label === "strong") return "வலுவானது";
    if (label === "medium") return "நடுத்தரம்";
    return "ஆதரவு தேவை";
  }
  if (label === "strong") return "Strong";
  if (label === "medium") return "Medium";
  return "Needs support";
}

export function withStrength(a: Analysis): Array<GrahaReport & { strength: StrengthLabel; score: number }> {
  return a.grahas.map((g) => {
    const score = scoreGraha(g);
    return { ...g, score, strength: strengthLabel(score) };
  });
}

export type ShadbalaBala = {
  id: "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
  nameTa: string;
  nameEn: string;
  sthanaBala: number; // Positional (Virupas)
  digBala: number;    // Directional
  kaalaBala: number;  // Temporal
  cheshtaBala: number;// Motional
  naisargikaBala: number; // Natural
  drikBala: number;   // Aspectual
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  ratio: number;
  grade: "uthamam" | "madhyamam" | "adhamam";
  gradeTa: string;
  gradeEn: string;
  ishtaPhala: number;
  kashtaPhala: number;
  vimsopaka: number; // 0 - 20
};

export type BhavaBalaRow = {
  house: number;
  sign: number;
  lord: PlanetId;
  lordBala: number;
  occupantBala: number;
  drishtiBala: number;
  totalBala: number;
  gradeTa: string;
  gradeEn: string;
};

const SHADBALA_PLANETS: ("sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn")[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

const NAISARGIKA: Record<string, number> = {
  sun: 60,
  moon: 51.43,
  venus: 42.86,
  jupiter: 34.29,
  mercury: 25.71,
  mars: 17.14,
  saturn: 8.57,
};

const REQUIRED_RUPAS: Record<string, number> = {
  sun: 6.5,
  moon: 6.0,
  mars: 5.0,
  mercury: 7.0,
  jupiter: 6.5,
  venus: 5.5,
  saturn: 5.0,
};

const PLANET_NAMES_META: Record<string, { ta: string; en: string }> = {
  sun: { ta: "சூரியன்", en: "Sun" },
  moon: { ta: "சந்திரன்", en: "Moon" },
  mars: { ta: "செவ்வாய்", en: "Mars" },
  mercury: { ta: "புதன்", en: "Mercury" },
  jupiter: { ta: "குரு", en: "Jupiter" },
  venus: { ta: "சுக்கிரன்", en: "Venus" },
  saturn: { ta: "சனி", en: "Saturn" },
};

export function computeShadbala(result: ChartResult, analysis: Analysis): {
  rows: ShadbalaBala[];
  bhavaBalas: BhavaBalaRow[];
} {
  const lagna = result.list.find((p) => p.id === "lagna")!;
  const sun = result.list.find((p) => p.id === "sun")!;
  const moon = result.list.find((p) => p.id === "moon")!;
  const isDay = result.isDay;

  const rows: ShadbalaBala[] = SHADBALA_PLANETS.map((id) => {
    const pos = result.list.find((p) => p.id === id) ?? lagna;
    const gRep = analysis.grahas.find((g) => g.id === id);
    const dignity = gRep?.dignity ?? "neutral";

    // 1. STHANA BALA (Positional)
    // 1.1 Uccha Bala (exaltation distance)
    const exalt = EXALT[id];
    let ucchaBala = 30;
    if (exalt) {
      const debilLon = (exalt.sign * 30 + exalt.deg + 180) % 360;
      const dist = angDist(pos.lon, debilLon);
      ucchaBala = Math.round((dist / 180) * 60);
    }

    // 1.2 Saptavargaja Bala (D1, D2, D3, D7, D9, D12, D30)
    const vargasToCheck = [1, 2, 3, 7, 9, 12, 30];
    let vargaPoints = 0;
    for (const v of vargasToCheck) {
      const vSign = vargaSign(pos.lon, v);
      if (vSign === pos.sign) vargaPoints += 30;
      else if ([0, 3, 4, 7, 8, 11].includes(vSign)) vargaPoints += 20;
      else vargaPoints += 15;
    }
    const saptavargaBala = Math.round((vargaPoints / (vargasToCheck.length * 30)) * 60);

    // 1.3 Kendra Bala
    let kendraBala = 15;
    if (KENDRA.includes(pos.house)) kendraBala = 60;
    else if ([2, 5, 8, 11].includes(pos.house)) kendraBala = 30;

    // 1.4 Ojhayugma & Drekkana
    const isOddSign = pos.sign % 2 === 0;
    const isMale = ["sun", "mars", "jupiter"].includes(id);
    const ojhaBala = (isOddSign && isMale) || (!isOddSign && !isMale) ? 30 : 15;

    const sthanaBala = ucchaBala + saptavargaBala + kendraBala + ojhaBala;

    // 2. DIG BALA (Directional)
    let bestHouse = 1;
    if (id === "sun" || id === "mars") bestHouse = 10;
    else if (id === "jupiter" || id === "mercury") bestHouse = 1;
    else if (id === "saturn") bestHouse = 7;
    else if (id === "moon" || id === "venus") bestHouse = 4;

    const houseDiff = Math.abs(pos.house - bestHouse);
    const circularHouseDiff = Math.min(houseDiff, 12 - houseDiff);
    const digBala = Math.round(60 - (circularHouseDiff / 6) * 50);

    // 3. KAALA BALA (Temporal)
    let natonnata = 30;
    if (isDay) {
      if (["sun", "jupiter", "venus"].includes(id)) natonnata = 60;
      else if (id === "mercury") natonnata = 50;
      else natonnata = 15;
    } else {
      if (["moon", "mars", "saturn"].includes(id)) natonnata = 60;
      else if (id === "mercury") natonnata = 50;
      else natonnata = 15;
    }

    // Paksha bala
    const moonSunDiff = (moon.lon - sun.lon + 360) % 360;
    const pakshaPct = moonSunDiff / 360;
    let pakshaBala = 30;
    if (["moon", "jupiter", "venus", "mercury"].includes(id)) {
      pakshaBala = Math.round(20 + pakshaPct * 40);
    } else {
      pakshaBala = Math.round(60 - pakshaPct * 40);
    }

    const kaalaBala = natonnata + pakshaBala + 30; // Dina/Hora lord allowance

    // 4. CHESHTA BALA (Motional)
    let cheshtaBala = 30;
    if (id === "sun" || id === "moon") {
      cheshtaBala = Math.round(30 + Math.abs(pos.lon - 90) / 6);
    } else if (pos.retrograde) {
      cheshtaBala = 60;
    } else {
      cheshtaBala = Math.round(25 + Math.random() * 0); // stable deterministic
      if (dignity === "exalt" || dignity === "own") cheshtaBala = 45;
    }

    // 5. NAISARGIKA BALA
    const naisargikaBala = NAISARGIKA[id] ?? 30;

    // 6. DRIK BALA (Aspectual)
    let drikBala = 30;
    const bhava = analysis.bhavas.find((b: BhavaReport) => b.house === pos.house);
    const aspectedBy = bhava?.aspectedBy ?? [];
    for (const asp of aspectedBy) {
      if (["jupiter", "venus", "mercury"].includes(asp)) drikBala += 12;
      else drikBala -= 8;
    }
    drikBala = Math.max(5, Math.min(60, drikBala));

    const totalVirupas = Math.round(sthanaBala + digBala + kaalaBala + cheshtaBala + naisargikaBala + drikBala);
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const req = REQUIRED_RUPAS[id] ?? 6.0;
    const ratio = Number((totalRupas / req).toFixed(2));

    let grade: "uthamam" | "madhyamam" | "adhamam" = "madhyamam";
    let gradeTa = "நடுத்தர பலம்";
    let gradeEn = "Medium strength";
    if (ratio >= 1.15) {
      grade = "uthamam";
      gradeTa = "பூரண பலம் (உத்தமம்)";
      gradeEn = "Excellent (Uthamam)";
    } else if (ratio < 0.9) {
      grade = "adhamam";
      gradeTa = "ஆதரவு தேவை (அதமம்)";
      gradeEn = "Needs support";
    }

    // Ishta / Kashta
    const ishtaPhala = Math.round(Math.min(60, Math.sqrt(Math.max(1, ucchaBala * cheshtaBala))));
    const kashtaPhala = Math.round(Math.min(60, Math.sqrt(Math.max(1, (60 - ucchaBala) * (60 - cheshtaBala)))));

    // Vimsopaka (0 to 20 scale across 16 vargas)
    let vimsopaka = 10;
    if (dignity === "exalt") vimsopaka = 19;
    else if (dignity === "moola") vimsopaka = 17;
    else if (dignity === "own") vimsopaka = 16;
    else if (dignity === "friend") vimsopaka = 13.5;
    else if (dignity === "neutral") vimsopaka = 10.5;
    else if (dignity === "enemy") vimsopaka = 7.5;
    else if (dignity === "debil") vimsopaka = 4.5;
    if (pos.retrograde) vimsopaka = Math.min(20, vimsopaka + 1.5);

    return {
      id,
      nameTa: PLANET_NAMES_META[id]?.ta ?? id,
      nameEn: PLANET_NAMES_META[id]?.en ?? id,
      sthanaBala,
      digBala,
      kaalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredRupas: req,
      ratio,
      grade,
      gradeTa,
      gradeEn,
      ishtaPhala,
      kashtaPhala,
      vimsopaka,
    };
  });

  // Bhava Balas
  const bhavaBalas: BhavaBalaRow[] = analysis.bhavas.map((bh) => {
    const lordRow = rows.find((r) => r.id === bh.lord);
    const lordBala = lordRow ? lordRow.totalRupas : 5.5;
    const occupantBala = bh.occupants.length * 1.2;
    const drishtiBala = bh.aspectedBy.length * 0.8;
    const totalBala = Number((lordBala + occupantBala + drishtiBala + (bh.sav / 33.7) * 4).toFixed(2));

    let gradeTa = "நடுத்தர பலம்";
    let gradeEn = "Moderate";
    if (totalBala >= 12) {
      gradeTa = "மிக பலம் (உத்தமம்)";
      gradeEn = "Very Strong";
    } else if (totalBala <= 8.5) {
      gradeTa = "எளிய பலம்";
      gradeEn = "Needs Strength";
    }

    return {
      house: bh.house,
      sign: bh.sign,
      lord: bh.lord,
      lordBala,
      occupantBala,
      drishtiBala,
      totalBala,
      gradeTa,
      gradeEn,
    };
  });

  return { rows, bhavaBalas };
}
