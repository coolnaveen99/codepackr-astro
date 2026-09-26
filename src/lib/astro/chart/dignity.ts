// Codepackr Astro — Canonical Planetary Dignity Engine

export type DignityLevel =
  | "exalted"
  | "debilitated"
  | "moolatrikona"
  | "own_sign"
  | "friend"
  | "neutral"
  | "enemy";

export type DignityInfo = {
  level: DignityLevel;
  labelTa: string;
  labelEn: string;
  score: number; // 0 to 10 scale
};

/**
 * Classical exaltation points (Sign index and deep degree):
 * - Sun: Aries (0) at 10°
 * - Moon: Taurus (1) at 3°
 * - Mars: Capricorn (9) at 28°
 * - Mercury: Virgo (5) at 15°
 * - Jupiter: Cancer (3) at 5°
 * - Venus: Pisces (11) at 27°
 * - Saturn: Libra (6) at 20°
 * - Rahu: Taurus (1) / Gemini (2)
 * - Ketu: Scorpio (7) / Sagittarius (8)
 */
export const EXALTATION: Record<string, { sign: number; deepDegree: number }> = {
  sun: { sign: 0, deepDegree: 10 },
  moon: { sign: 1, deepDegree: 3 },
  mars: { sign: 9, deepDegree: 28 },
  mercury: { sign: 5, deepDegree: 15 },
  jupiter: { sign: 3, deepDegree: 5 },
  venus: { sign: 11, deepDegree: 27 },
  saturn: { sign: 6, deepDegree: 20 },
  rahu: { sign: 1, deepDegree: 15 },
  ketu: { sign: 7, deepDegree: 15 },
};

/**
 * Debilitation points (exactly 7 signs / 180° opposite to exaltation):
 */
export const DEBILITATION: Record<string, { sign: number; deepDegree: number }> = {
  sun: { sign: 6, deepDegree: 10 },     // Libra
  moon: { sign: 7, deepDegree: 3 },     // Scorpio
  mars: { sign: 3, deepDegree: 28 },    // Cancer
  mercury: { sign: 11, deepDegree: 15 },// Pisces
  jupiter: { sign: 9, deepDegree: 5 },  // Capricorn
  venus: { sign: 5, deepDegree: 27 },   // Virgo
  saturn: { sign: 0, deepDegree: 20 },  // Aries
  rahu: { sign: 7, deepDegree: 15 },    // Scorpio
  ketu: { sign: 1, deepDegree: 15 },    // Taurus
};

export const OWN_SIGNS: Record<string, number[]> = {
  sun: [4],          // Leo
  moon: [3],         // Cancer
  mars: [0, 7],      // Aries, Scorpio
  mercury: [2, 5],   // Gemini, Virgo
  jupiter: [8, 11],  // Sagittarius, Pisces
  venus: [1, 6],     // Taurus, Libra
  saturn: [9, 10],   // Capricorn, Aquarius
  rahu: [10],        // Co-lord of Aquarius
  ketu: [7],         // Co-lord of Scorpio
};

export const MOOLATRIKONA: Record<string, { sign: number; startDeg: number; endDeg: number }> = {
  sun: { sign: 4, startDeg: 0, endDeg: 20 },       // Leo 0-20°
  moon: { sign: 1, startDeg: 3, endDeg: 30 },      // Taurus 3-30°
  mars: { sign: 0, startDeg: 0, endDeg: 12 },      // Aries 0-12°
  mercury: { sign: 5, startDeg: 15, endDeg: 20 },  // Virgo 15-20°
  jupiter: { sign: 8, startDeg: 0, endDeg: 10 },   // Sagittarius 0-10°
  venus: { sign: 6, startDeg: 0, endDeg: 15 },     // Libra 0-15°
  saturn: { sign: 10, startDeg: 0, endDeg: 20 },   // Aquarius 0-20°
};

export const NATURAL_FRIENDS: Record<string, string[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
  rahu: ["mercury", "venus", "saturn"],
  ketu: ["mars", "venus", "jupiter"],
};

export const NATURAL_ENEMIES: Record<string, string[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
  rahu: ["sun", "moon", "mars"],
  ketu: ["sun", "moon"],
};

export const SIGN_LORDS = [
  "mars", "venus", "mercury", "moon", "sun", "mercury",
  "venus", "mars", "jupiter", "saturn", "saturn", "jupiter",
];

/**
 * Evaluates the dignity of a planet at a specific sign and degree.
 */
export function evaluateDignity(planetId: string, sign: number, degreeInSign: number): DignityInfo {
  const p = planetId.toLowerCase();

  // Exaltation check
  const ucha = EXALTATION[p];
  if (ucha && ucha.sign === sign) {
    return { level: "exalted", labelTa: "உச்சம்", labelEn: "Exalted", score: 10 };
  }

  // Debilitation check
  const neecha = DEBILITATION[p];
  if (neecha && neecha.sign === sign) {
    return { level: "debilitated", labelTa: "நீசம்", labelEn: "Debilitated", score: 1 };
  }

  // Moolatrikona check
  const mt = MOOLATRIKONA[p];
  if (mt && mt.sign === sign && degreeInSign >= mt.startDeg && degreeInSign < mt.endDeg) {
    return { level: "moolatrikona", labelTa: "மூலத்திரிகோணம்", labelEn: "Moolatrikona", score: 9 };
  }

  // Own sign check
  const own = OWN_SIGNS[p];
  if (own && own.includes(sign)) {
    return { level: "own_sign", labelTa: "ஆட்சி", labelEn: "Own Sign", score: 8 };
  }

  // Sign lord relationship
  const dispositor = SIGN_LORDS[sign]!;
  const friends = NATURAL_FRIENDS[p] ?? [];
  const enemies = NATURAL_ENEMIES[p] ?? [];

  if (friends.includes(dispositor)) {
    return { level: "friend", labelTa: "நட்பு", labelEn: "Friend", score: 6 };
  }
  if (enemies.includes(dispositor)) {
    return { level: "enemy", labelTa: "பகை", labelEn: "Enemy", score: 3 };
  }

  return { level: "neutral", labelTa: "சமம்", labelEn: "Neutral", score: 5 };
}
