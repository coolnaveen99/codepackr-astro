export type AyanamsaMode = 'LAHIRI' | 'KP_NEW' | 'BV_RAMAN' | 'YUKTESHWAR' | 'TRUE_PUSHYA';

export interface KpPositionDetail {
  longitude: number;
  rasiIndex: number; // 0 = Mesha (Aries) .. 11 = Meena (Pisces)
  nakshatraIndex: number; // 0 .. 26
  pada: number; // 1 .. 4
  signLord: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
}

const VIMSHOTTARI_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
] as const;

const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const RASI_LORDS = [
  'Mars',    // 1. Aries (Mesha)
  'Venus',   // 2. Taurus (Rishaba)
  'Mercury', // 3. Gemini (Mithuna)
  'Moon',    // 4. Cancer (Kataka)
  'Sun',     // 5. Leo (Simha)
  'Mercury', // 6. Virgo (Kanni)
  'Venus',   // 7. Libra (Thula)
  'Mars',    // 8. Scorpio (Vrischika)
  'Jupiter', // 9. Sagittarius (Dhanusu)
  'Saturn',  // 10. Capricorn (Makara)
  'Saturn',  // 11. Aquarius (Kumbha)
  'Jupiter', // 12. Pisces (Meena)
];

/**
 * Calculates exact Ayanamsa in degrees for a given Julian Day (JD) and selected model.
 */
export function calculateAyanamsa(jd: number, mode: AyanamsaMode = 'LAHIRI'): number {
  // Centuries from J2000.0 (JD 2451545.0)
  const T = (jd - 2451545.0) / 36525.0;

  // Base Lahiri (Chitrapaksha) at J2000.0 is 23° 51' 25.53" (23.857092 deg)
  // Mean annual precession ~ 50.290966" (0.01396971 deg/year = 1.396971 deg/century)
  const lahiriBase = 23.857092 + 1.396971 * T + 0.000308 * T * T;

  switch (mode) {
    case 'LAHIRI':
      return lahiriBase;
    case 'KP_NEW':
      // Krishnamurti (KP New) is ~ 0° 06' 05" less than Lahiri
      return lahiriBase - 0.101389;
    case 'BV_RAMAN':
      // B.V. Raman Ayanamsa is ~ 1° 26' 38" less than Lahiri
      return lahiriBase - 1.443889;
    case 'YUKTESHWAR':
      // Sri Yukteshwar is ~ 1° 22' 58" less than Lahiri
      return lahiriBase - 1.382778;
    case 'TRUE_PUSHYA':
      // Pushya Paksha is ~ 0° 03' 40" higher than Lahiri
      return lahiriBase + 0.061111;
    default:
      return lahiriBase;
  }
}

/**
 * Computes Rasi Lord, Nakshatra (Star) Lord, KP Sub-Lord, and KP Sub-Sub-Lord
 * for any sidereal longitude (0° to 360°).
 */
export function getKpSubLordDetails(siderealLongitude: number): KpPositionDetail {
  const normLon = ((siderealLongitude % 360) + 360) % 360;
  const rasiIndex = Math.floor(normLon / 30);
  const signLord = RASI_LORDS[rasiIndex];

  const nakshatraSpan = 360 / 27; // 13.333333333333334 degrees (13° 20')
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan);
  const offsetInNakshatra = normLon - nakshatraIndex * nakshatraSpan;
  const pada = Math.min(4, Math.floor(offsetInNakshatra / (nakshatraSpan / 4)) + 1);

  const starLordIndex = nakshatraIndex % 9;
  const starLord = VIMSHOTTARI_LORDS[starLordIndex];

  // Calculate Sub-Lord (9 divisions proportional to 120 Vimshottari years)
  let accumulatedSpan = 0;
  let subLord: string = starLord;
  let subLordIndex = starLordIndex;
  let offsetInSub = 0;
  let currentSubSpan = 0;

  for (let i = 0; i < 9; i++) {
    const idx = (starLordIndex + i) % 9;
    const lord = VIMSHOTTARI_LORDS[idx];
    const span = (VIMSHOTTARI_YEARS[lord] / 120) * nakshatraSpan;

    if (offsetInNakshatra <= accumulatedSpan + span || i === 8) {
      subLord = lord;
      subLordIndex = idx;
      offsetInSub = Math.max(0, offsetInNakshatra - accumulatedSpan);
      currentSubSpan = span;
      break;
    }
    accumulatedSpan += span;
  }

  // Calculate Sub-Sub-Lord (Pratyantar Sub)
  let accSubSubSpan = 0;
  let subSubLord: string = subLord;

  for (let j = 0; j < 9; j++) {
    const idx = (subLordIndex + j) % 9;
    const lord = VIMSHOTTARI_LORDS[idx];
    const span = (VIMSHOTTARI_YEARS[lord] / 120) * currentSubSpan;

    if (offsetInSub <= accSubSubSpan + span || j === 8) {
      subSubLord = lord;
      break;
    }
    accSubSubSpan += span;
  }

  return {
    longitude: normLon,
    rasiIndex,
    nakshatraIndex,
    pada,
    signLord,
    starLord,
    subLord,
    subSubLord,
  };
}
