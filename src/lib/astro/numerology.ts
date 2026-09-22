// Codepackr Astro - Tamil / Chaldean-style name & birth numerology (client-side)
import type { Lang } from "./i18n";

/** Pythagorean letter values (A=1 … I=9, J=1 …) — widely used in Tamil apps. */
const PYTH: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

/** Tamil uyir-mei simplified map (first letter sound → 1–9). */
const TA_MAP: Record<string, number> = {
  "அ": 1, "ஆ": 1, "இ": 1, "ஈ": 1, "உ": 3, "ஊ": 3, "எ": 5, "ஏ": 5, "ஐ": 1, "ஒ": 6, "ஓ": 6, "ஔ": 6,
  "க": 2, "ங": 5, "ச": 3, "ஞ": 5, "ட": 4, "ண": 5, "த": 4, "ந": 5, "ப": 8, "ம": 4,
  "ய": 1, "ர": 2, "ல": 3, "வ": 6, "ழ": 7, "ள": 3, "ற": 2, "ன": 5,
  "ஜ": 1, "ஷ": 6, "ஸ": 1, "ஹ": 5, "க்ஷ": 2,
};

export function digitSum(n: number): number {
  n = Math.abs(Math.floor(n));
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function charValue(ch: string): number {
  const lower = ch.toLowerCase();
  if (PYTH[lower] != null) return PYTH[lower];
  if (TA_MAP[ch] != null) return TA_MAP[ch];
  const base = ch.normalize("NFD")[0] ?? ch;
  if (TA_MAP[base] != null) return TA_MAP[base];
  return 0;
}

export function nameNumber(name: string): number {
  let sum = 0;
  for (const ch of name.replace(/\s+/g, "")) {
    sum += charValue(ch);
  }
  return digitSum(sum || 0);
}

export function lifePathNumber(day: number, month: number, year: number): number {
  const raw = digitSum(day) + digitSum(month) + digitSum(year);
  return digitSum(raw);
}

export function birthDayNumber(day: number): number {
  return digitSum(day);
}

export type NumeroProfile = {
  name: string;
  nameNum: number;
  lifePath: number;
  birthDay: number;
  rulingPlanet: { ta: string; en: string };
  qualities: { ta: string; en: string };
  advice: { ta: string; en: string };
};

const MEANINGS: Record<
  number,
  { planet: { ta: string; en: string }; qualities: { ta: string; en: string }; advice: { ta: string; en: string } }
> = {
  1: {
    planet: { ta: "சூரியன்", en: "Sun" },
    qualities: { ta: "தலைமை, தன்னம்பிக்கை, புதுமை", en: "Leadership, confidence, initiative" },
    advice: { ta: "சுய முயற்சியை வளர்க்கவும்; அகங்காரத்தைக் கட்டுப்படுத்தவும்.", en: "Cultivate self-drive; temper ego." },
  },
  2: {
    planet: { ta: "சந்திரன்", en: "Moon" },
    qualities: { ta: "இணக்கம், உணர்வு, கூட்டாண்மை", en: "Harmony, sensitivity, partnership" },
    advice: { ta: "மற்றவர்களுடன் இணைந்து செயல்படுங்கள்; உணர்ச்சி சமநிலை காக்கவும்.", en: "Collaborate; guard emotional balance." },
  },
  3: {
    planet: { ta: "குரு", en: "Jupiter" },
    qualities: { ta: "ஆக்கம், பேச்சு, மகிழ்ச்சி", en: "Creativity, expression, joy" },
    advice: { ta: "கலை/கல்வியில் முன்னேறுங்கள்; சிதறலைத் தவிர்க்கவும்.", en: "Grow in arts or learning; avoid scatter." },
  },
  4: {
    planet: { ta: "ராகு", en: "Rahu" },
    qualities: { ta: "ஒழுங்கு, உழைப்பு, அமைப்பு", en: "Order, hard work, structure" },
    advice: { ta: "திட்டமிட்டு உழைக்கவும்; மாற்றத்தை ஏற்றுக்கொள்ள பழகவும்.", en: "Plan and work steadily; practise flexibility." },
  },
  5: {
    planet: { ta: "புதன்", en: "Mercury" },
    qualities: { ta: "சுதந்திரம், பயணம், அறிவு", en: "Freedom, travel, intellect" },
    advice: { ta: "புதிய அனுபவங்களைத் தேடுங்கள்; நிலைத்தன்மையும் தேவை.", en: "Seek new experiences; also build consistency." },
  },
  6: {
    planet: { ta: "சுக்கிரன்", en: "Venus" },
    qualities: { ta: "பொறுப்பு, அன்பு, குடும்பம்", en: "Responsibility, love, family" },
    advice: { ta: "குடும்பம் மற்றும் சேவையில் சமநிலை காக்கவும்.", en: "Balance care for others with self-care." },
  },
  7: {
    planet: { ta: "கேது", en: "Ketu" },
    qualities: { ta: "ஆன்மீகம், ஆராய்ச்சி, தனிமை", en: "Spirituality, research, solitude" },
    advice: { ta: "உள்நோக்கிய வளர்ச்சிக்கு நேரம் ஒதுக்குங்கள்.", en: "Make space for inner growth and study." },
  },
  8: {
    planet: { ta: "சனி", en: "Saturn" },
    qualities: { ta: "அதிகாரம், பொறுமை, கர்மா", en: "Authority, patience, karma" },
    advice: { ta: "நீண்டகால இலக்குகளில் உறுதியாக இருங்கள்.", en: "Stay steady on long-term goals." },
  },
  9: {
    planet: { ta: "செவ்வாய்", en: "Mars" },
    qualities: { ta: "தாரம், சேவை, முடிவு", en: "Compassion, service, completion" },
    advice: { ta: "மற்றவருக்கு உதவும் பாதையில் ஆற்றலைச் செலுத்துங்கள்.", en: "Channel energy into service and finishing well." },
  },
  11: {
    planet: { ta: "சந்திரன் (உயர்)", en: "Moon (master)" },
    qualities: { ta: "உள்ளுணர்வு, ஊக்கம்", en: "Intuition, inspiration" },
    advice: { ta: "உள்ளுணர்வை நம்புங்கள்; நடைமுறையும் தேவை.", en: "Trust intuition; stay grounded in practice." },
  },
  22: {
    planet: { ta: "ராகு (உயர்)", en: "Rahu (master)" },
    qualities: { ta: "பெரிய கனவுகள், கட்டுமானம்", en: "Grand vision, building" },
    advice: { ta: "பெரிய திட்டங்களை படிப்படியாக நிறைவேற்றுங்கள்.", en: "Build large aims step by step." },
  },
  33: {
    planet: { ta: "குரு (உயர்)", en: "Jupiter (master)" },
    qualities: { ta: "கருணை, போதனை", en: "Compassion, teaching" },
    advice: { ta: "அறிவைப் பகிர்வதில் மகிழ்ச்சியைக் காணுங்கள்.", en: "Find joy in sharing knowledge." },
  },
};

function meaningOf(n: number) {
  return MEANINGS[n] ?? MEANINGS[digitSum(n)] ?? MEANINGS[1]!;
}

export function buildNumeroProfile(
  name: string,
  day: number,
  month: number,
  year: number,
): NumeroProfile {
  const nameNum = nameNumber(name || "A");
  const lifePath = lifePathNumber(day, month, year);
  const birthDay = birthDayNumber(day);
  const focus = lifePath;
  const m = meaningOf(focus);
  return {
    name: name.trim() || "—",
    nameNum,
    lifePath,
    birthDay,
    rulingPlanet: m.planet,
    qualities: m.qualities,
    advice: m.advice,
  };
}

export function numeroText(profile: NumeroProfile, lang: Lang) {
  return {
    nameNum: profile.nameNum,
    lifePath: profile.lifePath,
    birthDay: profile.birthDay,
    planet: lang === "ta" ? profile.rulingPlanet.ta : profile.rulingPlanet.en,
    qualities: lang === "ta" ? profile.qualities.ta : profile.qualities.en,
    advice: lang === "ta" ? profile.advice.ta : profile.advice.en,
  };
}
