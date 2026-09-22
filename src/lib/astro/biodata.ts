// Codepackr Astro - Marriage Biodata Type Definitions
import type { BirthInput } from "./engine";
import { DEFAULT_INPUT } from "./samples";

export type IncomePeriod = "per_month" | "per_annum";

export type Complexion =
  | "fair"
  | "very_fair"
  | "wheatish"
  | "wheatish_medium"
  | "golden"
  | "dusky"
  | (string & {});

export interface ComplexionOption {
  id: string;
  ta: string;
  en: string;
  displayTa: string;
  displayEn: string;
}

export const COMPLEXIONS: ComplexionOption[] = [
  { id: "fair", ta: "சிகப்பு (Fair)", en: "Fair", displayTa: "சிகப்பு", displayEn: "Fair" },
  { id: "very_fair", ta: "நல்ல சிகப்பு (Very Fair)", en: "Very Fair", displayTa: "நல்ல சிகப்பு", displayEn: "Very Fair" },
  { id: "wheatish", ta: "மாநிறம் (Wheatish)", en: "Wheatish", displayTa: "மாநிறம்", displayEn: "Wheatish" },
  { id: "wheatish_medium", ta: "கோதுமை மாநிறம் (Wheatish Medium)", en: "Wheatish Medium", displayTa: "கோதுமை மாநிறம்", displayEn: "Wheatish Medium" },
  { id: "golden", ta: "பொன்னிறம் (Fair Glow)", en: "Fair Glow", displayTa: "பொன்னிறம்", displayEn: "Fair Glow" },
  { id: "dusky", ta: "மாநிறம் - நடுத்தரம் (Dusky / Natural)", en: "Dusky / Natural", displayTa: "மாநிறம் (நடுத்தரம்)", displayEn: "Dusky / Natural" },
];

export type Biodata = {
  birth: BirthInput;
  photo: string;
  height: string;
  complexion: Complexion;
  blood: string;
  marital: "unmarried" | "divorced" | "widowed";
  religion: string;
  caste: string;
  gotra: string;
  kulaDeivam: string;
  native: string;
  cityNow: string;
  education: string;
  college: string;
  work: string;
  company: string;
  income: string;
  incomePeriod: IncomePeriod;
  father: string;
  fatherJob: string;
  mother: string;
  motherJob: string;
  siblings: string;
  familyType: "joint" | "nuclear";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  expect: string;
};

export const DEFAULT_BIODATA: Biodata = {
  birth: { ...DEFAULT_INPUT, name: "", sex: "M" },
  photo: "",
  height: "5' 6\"",
  complexion: "wheatish",
  blood: "O+",
  marital: "unmarried",
  religion: "",
  caste: "",
  gotra: "",
  kulaDeivam: "",
  native: "",
  cityNow: "",
  education: "",
  college: "",
  work: "",
  company: "",
  income: "",
  incomePeriod: "per_month",
  father: "",
  fatherJob: "",
  mother: "",
  motherJob: "",
  siblings: "",
  familyType: "joint",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  expect: "",
};

export interface HeightOption {
  ft: string;
  cm: string;
  ftLabel: string;
  cmLabel: string;
}

export const HEIGHT_OPTIONS: HeightOption[] = Array.from({ length: 25 }, (_, i) => {
  const totalInches = 54 + i; // 4' 6" to 6' 6"
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  const ftStr = `${ft}' ${inch}"`;
  const cmVal = Math.round(totalInches * 2.54);
  const cmStr = `${cmVal} cm`;
  return {
    ft: ftStr,
    cm: cmStr,
    ftLabel: `${ftStr} (${cmStr})`,
    cmLabel: `${cmStr} (${ftStr})`,
  };
});

export const HEIGHTS = HEIGHT_OPTIONS.map((h) => h.ft);
export const HEIGHTS_CM = HEIGHT_OPTIONS.map((h) => h.cm);

export function parseHeightToInches(val: string): number | null {
  if (!val) return null;
  const ftMatch = val.match(/(\d+)\s*['’]\s*(\d+)?/);
  if (ftMatch) {
    const ft = parseInt(ftMatch[1], 10);
    const inch = ftMatch[2] ? parseInt(ftMatch[2], 10) : 0;
    return ft * 12 + inch;
  }
  const cmMatch = val.match(/(\d+)\s*(?:cm|செ\.மீ)?/i);
  if (cmMatch) {
    const cm = parseInt(cmMatch[1], 10);
    if (cm > 80 && cm < 250) {
      return Math.round(cm / 2.54);
    }
  }
  return null;
}

export function formatFtInch(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${ft}' ${rem}"`;
}

export function formatCm(inches: number): string {
  const cm = Math.round(inches * 2.54);
  return `${cm} cm`;
}

export const BLOODS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
