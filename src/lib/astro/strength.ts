// Codepackr Astro - Basic relative planetary strength (Phase 2)
import type { Analysis, Dignity, GrahaReport } from "./analysis";
import type { Lang } from "./i18n";
import { DUSTHANA, KENDRA } from "./tables";

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
