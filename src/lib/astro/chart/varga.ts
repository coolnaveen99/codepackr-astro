// Codepackr Astro — Divisional Charts (Vargas D1 to D60) Engine
import { normalize360, signIndex } from "../astronomy/coordinates";

export type VargaId =
  | 1   // D1 Rasi
  | 2   // D2 Hora
  | 3   // D3 Drekkana
  | 4   // D4 Chaturthamsa
  | 7   // D7 Saptamsa
  | 9   // D9 Navamsa
  | 10  // D10 Dasamsa
  | 12  // D12 Dwadasamsa
  | 16  // D16 Shodashamsa
  | 20  // D20 Vimsamsa
  | 24  // D24 Siddhamsa
  | 27  // D27 Saptavimsamsa
  | 30  // D30 Trimsamsa
  | 40  // D40 Khavedamsa
  | 45  // D45 Akshavedamsa
  | 60; // D60 Shashtiamsa

export const VARGA_DEFINITIONS: Record<number, { nameTa: string; nameEn: string; domainTa: string; domainEn: string }> = {
  1: { nameTa: "ராசி (D1)", nameEn: "Rasi (D1)", domainTa: "முழு வாழ்வு மற்றும் உடல் நலம்", domainEn: "General life and physical existence" },
  2: { nameTa: "ஹோரா (D2)", nameEn: "Hora (D2)", domainTa: "செல்வம் மற்றும் நிதி நிலை", domainEn: "Wealth and finances" },
  3: { nameTa: "திரேக்காணம் (D3)", nameEn: "Drekkana (D3)", domainTa: "உடன்பிறப்பு மற்றும் வீரம்", domainEn: "Siblings and courage" },
  4: { nameTa: "சதுர்த்தாம்சம் (D4)", nameEn: "Chaturthamsa (D4)", domainTa: "சொத்து, வீடு மற்றும் பாக்கியம்", domainEn: "Property and fixed assets" },
  7: { nameTa: "சப்தாம்சம் (D7)", nameEn: "Saptamsa (D7)", domainTa: "குழந்தைகள் மற்றும் சந்ததி", domainEn: "Children and progeny" },
  9: { nameTa: "நவாம்சம் (D9)", nameEn: "Navamsa (D9)", domainTa: "திருமணம் மற்றும் வாழ்க்கைத்துணை", domainEn: "Marriage and dharmic strength" },
  10: { nameTa: "தசாம்சம் (D10)", nameEn: "Dasamsa (D10)", domainTa: "தொழில், பதவி மற்றும் கீர்த்தி", domainEn: "Career, fame and professional status" },
  12: { nameTa: "துவாதசாம்சம் (D12)", nameEn: "Dwadasamsa (D12)", domainTa: "பெற்றோர் மற்றும் பூர்விகம்", domainEn: "Parents and ancestral heritage" },
  16: { nameTa: "சோடசாம்சம் (D16)", nameEn: "Shodashamsa (D16)", domainTa: "வாகனம் மற்றும் சுகபோகம்", domainEn: "Vehicles and worldly pleasures" },
  20: { nameTa: "விம்சாம்சம் (D20)", nameEn: "Vimsamsa (D20)", domainTa: "ஆன்மீகம் மற்றும் பக்தி", domainEn: "Spiritual practice and worship" },
  24: { nameTa: "சதுர்விம்சாம்சம் (D24)", nameEn: "Chaturvimsamsa (D24)", domainTa: "கல்வி, ஞானம் மற்றும் வித்தை", domainEn: "Higher learning and wisdom" },
  27: { nameTa: "சப்தவிம்சாம்சம் (D27)", nameEn: "Saptavimsamsa (D27)", domainTa: "உடல் பலம் மற்றும் நக்ஷத்திர பலம்", domainEn: "Physical stamina and strengths" },
  30: { nameTa: "திரிம்சாம்சம் (D30)", nameEn: "Trimsamsa (D30)", domainTa: "தோஷங்கள், இடர்கள் மற்றும் எச்சரிக்கை", domainEn: "Misfortunes and challenges" },
  40: { nameTa: "கவேதாம்சம் (D40)", nameEn: "Khavedamsa (D40)", domainTa: "சுப மற்றும் அசுப விளைவுகள்", domainEn: "Auspicious and inauspicious effects" },
  45: { nameTa: "அக்ஷவேதாம்சம் (D45)", nameEn: "Akshavedamsa (D45)", domainTa: "பொது வாழ்வின் அதிநுட்ப ஆய்வுகள்", domainEn: "General auspiciousness at micro level" },
  60: { nameTa: "சஷ்டியாம்சம் (D60)", nameEn: "Shashtiamsa (D60)", domainTa: "முற்பிறவி கர்மா மற்றும் அதிநுட்ப ஆய்வுகள்", domainEn: "Past-life karma and subtle effects" },
};

/**
 * Calculates Navamsa (D9) sign (0 to 11) for a given sidereal longitude.
 * Formula:
 * - Movable signs (Aries 0, Cancer 3, Libra 6, Capricorn 9) count from the sign itself.
 * - Fixed signs (Taurus 1, Leo 4, Scorpio 7, Aquarius 10) count from the 9th sign.
 * - Dual signs (Gemini 2, Virgo 5, Sagittarius 8, Pisces 11) count from the 5th sign.
 */
export function calculateNavamsa(lon: number): number {
  const s = signIndex(lon);
  const within = normalize360(lon) - s * 30;
  const part = Math.floor(within / (30 / 9));
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(s)) start = s;
  else if (fixed.includes(s)) start = (s + 8) % 12;
  else start = (s + 4) % 12;
  return (start + part) % 12;
}

/**
 * Computes the zodiac sign (0 to 11) for any supported Varga division number.
 * Comprehensive implementation adhering strictly to Parashari principles.
 */
export function calculateVargaSign(lon: number, vargaNumber: number): number {
  const s = signIndex(lon);
  const within = normalize360(lon) % 30;

  if (vargaNumber === 1) return s;
  if (vargaNumber === 9) return calculateNavamsa(lon);

  if (vargaNumber === 2) {
    // D2 Hora:
    // Odd signs: 0-15° Sun (Leo 4), 15-30° Moon (Cancer 3)
    // Even signs: 0-15° Moon (Cancer 3), 15-30° Sun (Leo 4)
    const isOdd = s % 2 === 0; // Aries(0), Gemini(2), Leo(4)... are odd in traditional counting
    const firstHalf = within < 15;
    return isOdd ? (firstHalf ? 4 : 3) : firstHalf ? 3 : 4;
  }

  if (vargaNumber === 3) {
    // D3 Drekkana: 1st 10° is same sign, 2nd 10° is 5th, 3rd 10° is 9th
    const part = Math.floor(within / 10);
    return (s + part * 4) % 12;
  }

  if (vargaNumber === 4) {
    // D4 Chaturthamsa: 1st 7.5° same sign, 2nd 7.5° 4th, 3rd 7.5° 7th, 4th 7.5° 10th
    const part = Math.floor(within / 7.5);
    return (s + part * 3) % 12;
  }

  if (vargaNumber === 7) {
    // D7 Saptamsa: odd signs from sign itself, even signs from 7th sign
    const part = Math.floor(within / (30 / 7));
    const start = s % 2 === 0 ? s : (s + 6) % 12;
    return (start + part) % 12;
  }

  if (vargaNumber === 10) {
    // D10 Dasamsa: odd signs from sign itself, even signs from 9th sign
    const part = Math.floor(within / 3);
    const start = s % 2 === 0 ? s : (s + 8) % 12;
    return (start + part) % 12;
  }

  if (vargaNumber === 12) {
    // D12 Dwadasamsa: count from the sign itself in 2.5° steps
    const part = Math.floor(within / 2.5);
    return (s + part) % 12;
  }

  if (vargaNumber === 16) {
    // D16 Shodashamsa: movable from Aries(0), fixed from Leo(4), dual from Sagittarius(8)
    const part = Math.floor(within / (30 / 16));
    const start = s % 3 === 0 ? 0 : s % 3 === 1 ? 4 : 8;
    return (start + part) % 12;
  }

  if (vargaNumber === 20) {
    // D20 Vimsamsa: movable from Aries(0), fixed from Sagittarius(8), dual from Leo(4)
    const part = Math.floor(within / 1.5);
    const start = s % 3 === 0 ? 0 : s % 3 === 1 ? 8 : 4;
    return (start + part) % 12;
  }

  if (vargaNumber === 24) {
    // D24 Siddhamsa: odd signs from Leo(4), even signs from Cancer(3)
    const part = Math.floor(within / 1.25);
    const start = s % 2 === 0 ? 4 : 3;
    return (start + part) % 12;
  }

  if (vargaNumber === 27) {
    // D27 Saptavimsamsa: count from fiery(0), earthy(3), airy(6), watery(9)
    const part = Math.floor(within / (30 / 27));
    const start = (s % 4) * 3;
    return (start + part) % 12;
  }

  if (vargaNumber === 30) {
    // D30 Trimsamsa:
    // Odd signs: 0-5° Mars (Aries 0), 5-10° Saturn (Aquarius 10), 10-18° Jupiter (Sagittarius 8),
    // 18-25° Mercury (Gemini 2), 25-30° Venus (Libra 6)
    // Even signs: 0-5° Venus (Taurus 1), 5-12° Mercury (Virgo 5), 12-20° Jupiter (Pisces 11),
    // 20-25° Saturn (Capricorn 9), 25-30° Mars (Scorpio 7)
    const isOdd = s % 2 === 0;
    if (isOdd) {
      if (within < 5) return 0;
      if (within < 10) return 10;
      if (within < 18) return 8;
      if (within < 25) return 2;
      return 6;
    } else {
      if (within < 5) return 1;
      if (within < 12) return 5;
      if (within < 20) return 11;
      if (within < 25) return 9;
      return 7;
    }
  }

  if (vargaNumber === 40) {
    // D40 Khavedamsa: odd signs from Aries(0), even signs from Libra(6)
    const part = Math.floor(within / 0.75);
    const start = s % 2 === 0 ? 0 : 6;
    return (start + part) % 12;
  }

  if (vargaNumber === 45) {
    // D45 Akshavedamsa: movable from Aries(0), fixed from Leo(4), dual from Sagittarius(8)
    const part = Math.floor(within / (30 / 45));
    const start = s % 3 === 0 ? 0 : s % 3 === 1 ? 4 : 8;
    return (start + part) % 12;
  }

  if (vargaNumber === 60) {
    // D60 Shashtiamsa: 60 x 0°30′ divisions.
    // Count from the sign itself for odd signs; from the 7th for even signs
    const part = Math.floor(within / 0.5);
    const start = s % 2 === 0 ? s : (s + 6) % 12;
    return (start + part) % 12;
  }

  return s;
}

/**
 * Checks whether a given position is within 1 arcminute of a division boundary for a given Varga.
 */
export function isNearVargaBoundary(lon: number, vargaNumber: number): boolean {
  const span = 30 / vargaNumber;
  const within = normalize360(lon) % 30;
  const rem = within % span;
  const boundaryOrb = 1 / 60; // 1 arcminute
  return rem <= boundaryOrb || span - rem <= boundaryOrb;
}
