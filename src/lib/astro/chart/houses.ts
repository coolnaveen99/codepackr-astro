// Codepackr Astro — Whole Sign House System Engine

/**
 * Computes 1-based house number for a zodiac sign from a reference sign (e.g. Lagna or Moon).
 * In the Whole Sign house system, the entire sign containing the reference point is House 1.
 */
export function houseFrom(targetSign: number, referenceSign: number): number {
  return ((targetSign - referenceSign + 12) % 12) + 1;
}

export type HouseDetails = {
  houseNumber: number; // 1 to 12
  signIndex: number; // 0 to 11
  signNameTa: string;
  signNameEn: string;
  signLord: string;
};

export const SIGN_NAMES_TA = [
  "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
  "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
];

export const SIGN_NAMES_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS = [
  "mars", "venus", "mercury", "moon", "sun", "mercury",
  "venus", "mars", "jupiter", "saturn", "saturn", "jupiter",
];

/**
 * Returns all 12 houses in Whole Sign format starting from the Lagna sign.
 */
export function getWholeSignHouses(lagnaSign: number): HouseDetails[] {
  const houses: HouseDetails[] = [];
  for (let h = 1; h <= 12; h++) {
    const s = (lagnaSign + h - 1) % 12;
    houses.push({
      houseNumber: h,
      signIndex: s,
      signNameTa: SIGN_NAMES_TA[s]!,
      signNameEn: SIGN_NAMES_EN[s]!,
      signLord: SIGN_LORDS[s]!,
    });
  }
  return houses;
}
