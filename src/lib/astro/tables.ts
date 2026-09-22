// Codepackr Astro - Astrological Tables & Dignities
import type { PlanetId } from "./constants";

export const SIGN_LORD: PlanetId[] = [
  "mars",
  "venus",
  "mercury",
  "moon",
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "saturn",
  "jupiter",
];

export const OWN_SIGNS: Partial<Record<PlanetId, number[]>> = {
  sun: [4],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
};

/** Sign of exaltation and the classical degree. */
export const EXALT: Partial<Record<PlanetId, { sign: number; deg: number }>> = {
  sun: { sign: 0, deg: 10 },
  moon: { sign: 1, deg: 3 },
  mars: { sign: 9, deg: 28 },
  mercury: { sign: 5, deg: 15 },
  jupiter: { sign: 3, deg: 5 },
  venus: { sign: 11, deg: 27 },
  saturn: { sign: 6, deg: 20 },
};

export const MOOLA: Partial<Record<PlanetId, { sign: number; from: number; to: number }>> = {
  sun: { sign: 4, from: 0, to: 20 },
  moon: { sign: 1, from: 3, to: 30 },
  mars: { sign: 0, from: 0, to: 12 },
  mercury: { sign: 5, from: 15, to: 20 },
  jupiter: { sign: 8, from: 0, to: 10 },
  venus: { sign: 6, from: 0, to: 15 },
  saturn: { sign: 10, from: 0, to: 20 },
};

export const NAT_FRIEND: Partial<Record<PlanetId, PlanetId[]>> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
};

export const NAT_ENEMY: Partial<Record<PlanetId, PlanetId[]>> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
};

/** Full aspect houses counted from the planet's own house (1-based). */
export const ASPECTS: Partial<Record<PlanetId, number[]>> = {
  sun: [7],
  moon: [7],
  mars: [4, 7, 8],
  mercury: [7],
  jupiter: [5, 7, 9],
  venus: [7],
  saturn: [3, 7, 10],
  rahu: [5, 7, 9],
  ketu: [5, 7, 9],
};

/** Combust orbs in degrees (direct / retrograde). */
export const COMBUST_ORB: Partial<Record<PlanetId, { dir: number; ret: number }>> = {
  moon: { dir: 12, ret: 12 },
  mars: { dir: 17, ret: 17 },
  mercury: { dir: 14, ret: 12 },
  jupiter: { dir: 11, ret: 11 },
  venus: { dir: 10, ret: 8 },
  saturn: { dir: 15, ret: 15 },
};

export const KENDRA = [1, 4, 7, 10];
export const TRIKONA = [1, 5, 9];
export const DUSTHANA = [6, 8, 12];
export const UPACHAYA = [3, 6, 10, 11];
export const MARAKA = [2, 7];

export const BENEFICS: PlanetId[] = ["jupiter", "venus", "mercury", "moon"];
export const MALEFICS: PlanetId[] = ["sun", "mars", "saturn", "rahu", "ketu"];

/** Gochara: houses from natal Moon that are considered favourable. */
export const GOCHARA_GOOD: Record<string, number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mars: [3, 6, 11],
  mercury: [2, 4, 6, 8, 10, 11],
  jupiter: [2, 5, 7, 9, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  saturn: [3, 6, 11],
  rahu: [3, 6, 10, 11],
  ketu: [3, 6, 10, 11],
};

export const BHAVA_TA = [
  "லக்னம் · தன்மை",
  "தனம் · குடும்பம்",
  "சகோதரம் · வீரம்",
  "சுகம் · வீடு · தாய்",
  "புத்தி · புத்திரன்",
  "ரிணம் · ரோகம் · சத்துரு",
  "களத்திரம் · ஜாயா",
  "ஆயுள் · மரணம்",
  "பாக்கியம் · தர்மம் · தந்தை",
  "தொழில் · கீர்த்தி",
  "லாபம் · நிறைவேற்றம்",
  "வியயம் · மோக்ஷம்",
];

export const BHAVA_EN = [
  "Lagna · Self",
  "Wealth · Family",
  "Siblings · Courage",
  "Home · Mother · Happiness",
  "Children · Intelligence",
  "Debt · Disease · Enemies",
  "Spouse · Partnership",
  "Longevity · Transformation",
  "Fortune · Dharma · Father",
  "Career · Status",
  "Gains · Fulfilment",
  "Loss · Moksha",
];

export const DIGNITY_TA: Record<string, string> = {
  exalt: "உச்சம்",
  moola: "மூலத்திரிகோணம்",
  own: "சொந்த ராசி",
  friend: "மித்திர ராசி",
  neutral: "சமம்",
  enemy: "சத்துரு ராசி",
  debil: "நீசம்",
};

export const DIGNITY_EN: Record<string, string> = {
  exalt: "Exalted",
  moola: "Moolatrikona",
  own: "Own sign",
  friend: "Friendly",
  neutral: "Neutral",
  enemy: "Enemy sign",
  debil: "Debilitated",
};

/** 0 = Deva, 1 = Manushya, 2 = Rakshasa — Parashara. */
export const GANA_NAK = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0,
] as const;

export const GANA_TA = ["தேவ கணம்", "மனித கணம்", "அரக்க கணம்"] as const;
export const GANA_EN = ["Deva", "Manushya", "Rakshasa"] as const;

/** Yoni animal id per nakshatra. */
export const YONI_NAK = [
  0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1,
] as const;

export const YONI_TA = [
  "குதிரை",
  "யானை",
  "ஆடு",
  "பாம்பு",
  "நாய்",
  "பூனை",
  "எலி",
  "பசு",
  "எருமை",
  "புலி",
  "மான்",
  "குரங்கு",
  "கீரி",
  "சிங்கம்",
] as const;

export const YONI_EN = [
  "Horse",
  "Elephant",
  "Goat",
  "Serpent",
  "Dog",
  "Cat",
  "Rat",
  "Cow",
  "Buffalo",
  "Tiger",
  "Deer",
  "Monkey",
  "Mongoose",
  "Lion",
] as const;

/** Enemy yoni pairs (unordered). */
export const YONI_ENEMY: [number, number][] = [
  [0, 8],
  [1, 13],
  [2, 11],
  [3, 12],
  [4, 10],
  [5, 6],
  [7, 9],
];

/** Rajju: 0 pada, 1 ooru, 2 nabhi, 3 kanta, 4 siro */
export const RAJJU_NAK = [
  0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0,
] as const;

export const RAJJU_TA = ["பாத ரஜ்ஜு", "ஊரு ரஜ்ஜு", "நாபி ரஜ்ஜு", "கண்ட ரஜ்ஜு", "சிரோ ரஜ்ஜு"] as const;
export const RAJJU_EN = ["Foot", "Thigh", "Navel", "Neck", "Head"] as const;

/** Vedha pairs (0-indexed nakshatra). */
export const VEDHA_PAIRS: [number, number][] = [
  [0, 17],
  [1, 16],
  [2, 15],
  [3, 14],
  [4, 13],
  [4, 22],
  [5, 21],
  [6, 20],
  [7, 19],
  [8, 18],
  [9, 26],
  [10, 25],
  [11, 24],
  [12, 23],
  [13, 22],
];

/** Vasya rasis attracted by each rasi (0-indexed). */
export const VASYA: number[][] = [
  [4, 7],
  [3, 6],
  [5],
  [7, 8],
  [6],
  [2, 11],
  [5, 9],
  [3],
  [11],
  [0, 10],
  [0],
  [9],
];

export const PADA_TA: [string, string, string, string][] = [
  ["சூ", "சே", "சோ", "லா"],
  ["லீ", "லூ", "லே", "லோ"],
  ["அ", "இ", "உ", "எ"],
  ["ஓ", "வா", "வீ", "வு"],
  ["வே", "வோ", "கா", "கீ"],
  ["கு", "க", "ங", "ச"],
  ["கே", "கோ", "ஹா", "ஹி"],
  ["ஹு", "ஹே", "ஹோ", "ட"],
  ["டி", "டு", "டே", "டோ"],
  ["மா", "மி", "மு", "மே"],
  ["மோ", "டா", "டி", "டு"],
  ["டே", "டோ", "பா", "பி"],
  ["பூ", "ஷ", "ண", "ட"],
  ["பே", "போ", "ரா", "ரி"],
  ["ரு", "ரே", "ரோ", "தா"],
  ["தி", "து", "தே", "தோ"],
  ["நா", "நி", "நு", "நே"],
  ["நோ", "யா", "யி", "யு"],
  ["யே", "யோ", "பா", "பி"],
  ["பூ", "தா", "ப", "டா"],
  ["பே", "போ", "ஜா", "ஜி"],
  ["கி", "கு", "கே", "கோ"],
  ["கா", "கீ", "கு", "கே"],
  ["கோ", "சா", "சி", "சு"],
  ["சே", "சோ", "தா", "தி"],
  ["து", "ஜ", "ஞ", "த"],
  ["தே", "தோ", "சா", "சி"],
];

export const PADA_EN: [string, string, string, string][] = [
  ["Chu", "Che", "Cho", "La"],
  ["Li", "Lu", "Le", "Lo"],
  ["A", "I", "U", "E"],
  ["O", "Va", "Vi", "Vu"],
  ["Ve", "Vo", "Ka", "Ki"],
  ["Ku", "Gha", "Nga", "Cha"],
  ["Ke", "Ko", "Ha", "Hi"],
  ["Hu", "He", "Ho", "Da"],
  ["Di", "Du", "De", "Do"],
  ["Ma", "Mi", "Mu", "Me"],
  ["Mo", "Ta", "Ti", "Tu"],
  ["Te", "To", "Pa", "Pi"],
  ["Pu", "Sha", "Na", "Tha"],
  ["Pe", "Po", "Ra", "Ri"],
  ["Ru", "Re", "Ro", "Ta"],
  ["Ti", "Tu", "Te", "To"],
  ["Na", "Ni", "Nu", "Ne"],
  ["No", "Ya", "Yi", "Yu"],
  ["Ye", "Yo", "Bha", "Bhi"],
  ["Bhu", "Dha", "Pha", "Dha"],
  ["Bhe", "Bho", "Ja", "Ji"],
  ["Khi", "Khu", "Khe", "Kho"],
  ["Ga", "Gi", "Gu", "Ge"],
  ["Go", "Sa", "Si", "Su"],
  ["Se", "So", "Da", "Di"],
  ["Du", "Tha", "Jha", "Na"],
  ["De", "Do", "Cha", "Chi"],
];

export const LUCKY_BY_RASI: {
  numbers: number[];
  colorTa: string;
  colorEn: string;
  day: number;
}[] = [
  { numbers: [9, 1, 8], colorTa: "சிவப்பு", colorEn: "Red", day: 2 },
  { numbers: [6, 2, 7], colorTa: "வெள்ளை", colorEn: "White", day: 5 },
  { numbers: [5, 3], colorTa: "பச்சை", colorEn: "Green", day: 3 },
  { numbers: [2, 7], colorTa: "வெண்மை / முத்து", colorEn: "Pearl white", day: 1 },
  { numbers: [1, 9], colorTa: "ஆரஞ்சு / தங்கம்", colorEn: "Orange-gold", day: 0 },
  { numbers: [5, 6], colorTa: "பச்சை", colorEn: "Green", day: 3 },
  { numbers: [6, 5], colorTa: "இளஞ்சிவப்பு", colorEn: "Pink", day: 5 },
  { numbers: [9, 4], colorTa: "கருஞ்சிவப்பு", colorEn: "Deep red", day: 2 },
  { numbers: [3, 1], colorTa: "மஞ்சள்", colorEn: "Yellow", day: 4 },
  { numbers: [8, 4], colorTa: "கருப்பு / நீலம்", colorEn: "Black / blue", day: 6 },
  { numbers: [8, 4], colorTa: "நீலம்", colorEn: "Blue", day: 6 },
  { numbers: [3, 9], colorTa: "மஞ்சள் / கடல் பச்சை", colorEn: "Yellow-sea", day: 4 },
];

export const KAAL_SARPA_TA = [
  "அனந்தம்",
  "குலிகம்",
  "வாசுகி",
  "சங்கபாலம்",
  "பத்மம்",
  "மகாபத்மம்",
  "தட்சகன்",
  "கர்கோடகம்",
  "சங்கசூடம்",
  "கடகம்",
  "விஷதரம்",
  "சேஷநாகம்",
];

export const KAAL_SARPA_EN = [
  "Ananta",
  "Kulika",
  "Vasuki",
  "Shankhapala",
  "Padma",
  "Mahapadma",
  "Takshaka",
  "Karkotaka",
  "Shankhachuda",
  "Ghataka",
  "Vishadhara",
  "Sheshnag",
];

/** Bhinnashtakavarga: houses (1-based) that receive a bindu, from each contributor. */
export const BAV: Record<
  "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn",
  Record<"sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "lagna", number[]>
> = {
  sun: {
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [3, 5, 6, 9, 10, 11, 12],
    jupiter: [5, 6, 9, 11],
    venus: [6, 7, 12],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [3, 4, 6, 10, 11, 12],
  },
  moon: {
    sun: [3, 6, 7, 8, 10, 11],
    moon: [1, 3, 6, 7, 10, 11],
    mars: [2, 3, 5, 6, 9, 10, 11],
    mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    jupiter: [1, 2, 4, 7, 8, 10, 11],
    venus: [3, 4, 5, 7, 9, 10, 11],
    saturn: [3, 5, 6, 11],
    lagna: [3, 6, 10, 11],
  },
  mars: {
    sun: [3, 5, 6, 10, 11],
    moon: [3, 6, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [3, 5, 6, 11],
    jupiter: [6, 10, 11, 12],
    venus: [6, 8, 11, 12],
    saturn: [1, 4, 7, 8, 9, 10, 11],
    lagna: [1, 3, 6, 10, 11],
  },
  mercury: {
    sun: [5, 6, 9, 11, 12],
    moon: [2, 4, 6, 8, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    jupiter: [6, 8, 11, 12],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  jupiter: {
    sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    moon: [2, 5, 7, 9, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    venus: [2, 5, 6, 9, 10, 11],
    saturn: [3, 5, 6, 12],
    lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  venus: {
    sun: [8, 11, 12],
    moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    mars: [3, 4, 6, 9, 11, 12],
    mercury: [3, 5, 6, 9, 11],
    jupiter: [5, 8, 9, 10, 11],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [3, 4, 5, 8, 9, 10, 11],
    lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  saturn: {
    sun: [1, 2, 4, 7, 8, 10, 11],
    moon: [3, 6, 11],
    mars: [3, 5, 6, 10, 11, 12],
    mercury: [6, 8, 9, 10, 11, 12],
    jupiter: [5, 6, 11, 12],
    venus: [6, 11, 12],
    saturn: [3, 5, 6, 11],
    lagna: [1, 3, 4, 6, 10, 11],
  },
};

export type BavPlanet = keyof typeof BAV;
export const BAV_PLANETS: BavPlanet[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
export const BAV_FROM = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "lagna"] as const;
