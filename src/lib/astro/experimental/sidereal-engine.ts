// src/lib/ephemeris/sidereal-engine.ts
import * as Astronomy from "astronomy-engine";

export type AyanamsaSystem =
  | "lahiri"
  | "kp"
  | "raman"
  | "true_chitrapaksha"
  | "pushya_paksha"
  | "fagan_bradley";

// J2000.0 baseline values in decimal degrees (approximate)
const AYANAMSA_J2000_BASE: Record<AyanamsaSystem, number> = {
  lahiri: 23.8571,            // 23°51'25.5" on 1 Jan 2000
  true_chitrapaksha: 23.906,
  kp: 23.764,                 // ~5'49" smaller than Lahiri
  raman: 22.364,              // ~1.45° smaller than Lahiri
  pushya_paksha: 22.722,
  fagan_bradley: 24.736,
};

// Annual precession rate: ~50.29 arc-seconds per year
const PRECESSION_DEG_PER_YEAR = 50.29 / 3600;

// BPHS Combustion (Asta) Orbs in degrees from Sun
const COMBUSTION_ORBS: Record<string, number> = {
  Moon: 12,
  Mars: 15,
  Mercury: 14,
  Jupiter: 11,
  Venus: 10,
  Saturn: 15,
};

export interface PlanetPosition {
  body: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  rashiIndex: number;         // 0 (Mesha/Aries) to 11 (Meena/Pisces)
  navamsaRashiIndex: number;  // D9 sign index (0 to 11)
  degreeInRashi: number;
  nakshatraIndex: number;     // 0 to 26 (each 13°20')
  pada: number;               // 1 to 4 (each 3°20')
  isVargottama: boolean;
  isGandanta: boolean;
  isCombust: boolean;
}

export function calculateAyanamsa(date: Date, system: AyanamsaSystem = "lahiri"): number {
  const j2000Ms = Date.UTC(2000, 0, 1, 12, 0, 0);
  const yearsSince2000 = (date.getTime() - j2000Ms) / (365.25 * 86400 * 1000);
  return AYANAMSA_J2000_BASE[system] + PRECESSION_DEG_PER_YEAR * yearsSince2000;
}

/**
 * Simplified Navamsa (D9) calculation.
 * NOTE: This is an approximation. Full accuracy requires:
 * - Odd Rashis start Navamsa from the same sign
 * - Even Rashis start from the 9th sign
 * - Proper pada-to-navamsa mapping
 * Production version should use a validated library or refined formula.
 */
function getNavamsaRashiIndex(siderealLongitude: number): number {
  const padaSpan = 360 / 108; // 3°20'
  const padaIndex = Math.floor(siderealLongitude / padaSpan);
  return padaIndex % 12;
}

// Placeholder for Rahu / Ketu (mean node approximation)
// True node requires more advanced calculation; mean node is often used in Vedic practice
export function getMeanRahuKetu(siderealMoonLongitude: number): { rahu: number; ketu: number } {
  // Very rough placeholder — replace with proper node calculation
  const rahu = (siderealMoonLongitude + 180) % 360;
  return { rahu, ketu: (rahu + 180) % 360 };
}

export function computeSiderealChart(
  date: Date,
  system: AyanamsaSystem = "lahiri"
): { ayanamsa: number; planets: PlanetPosition[] } {
  const astroTime = Astronomy.MakeTime(date);
  const ayanamsa = calculateAyanamsa(date, system);

  const bodies: Astronomy.Body[] = [
    Astronomy.Body.Sun,
    Astronomy.Body.Moon,
    Astronomy.Body.Mars,
    Astronomy.Body.Mercury,
    Astronomy.Body.Jupiter,
    Astronomy.Body.Venus,
    Astronomy.Body.Saturn,
  ];

  // Calculate Sun tropical longitude first for combustion checks
  const sunEcliptic = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, true));
  const sunSidereal = ((sunEcliptic.elon - ayanamsa) % 360 + 360) % 360;

  const planets: PlanetPosition[] = bodies.map((body) => {
    const vec = Astronomy.GeoVector(body, astroTime, true);
    const ecl = Astronomy.Ecliptic(vec);
    const tropicalLongitude = ecl.elon;
    const siderealLongitude = ((tropicalLongitude - ayanamsa) % 360 + 360) % 360;

    const rashiIndex = Math.floor(siderealLongitude / 30);
    const degreeInRashi = siderealLongitude % 30;

    // Each Nakshatra spans 13°20' (13.3333°); each Pada spans 3°20' (3.3333°)
    const nakshatraSpan = 360 / 27;
    const padaSpan = 360 / 108;
    const nakshatraIndex = Math.floor(siderealLongitude / nakshatraSpan);
    const pada = (Math.floor(siderealLongitude / padaSpan) % 4) + 1;
    const navamsaRashiIndex = getNavamsaRashiIndex(siderealLongitude);

    // Vargottama: identical sign in D1 (Rashi) and D9 (Navamsha)
    const isVargottama = rashiIndex === navamsaRashiIndex;

    // Gandanta: within 3°20' of water-fire junctions (120°, 240°, 360°/0°)
    const gandantaWidth = 10 / 3;
    const isGandanta =
      (siderealLongitude >= 120 - gandantaWidth && siderealLongitude <= 120 + gandantaWidth) ||
      (siderealLongitude >= 240 - gandantaWidth && siderealLongitude <= 240 + gandantaWidth) ||
      siderealLongitude >= 360 - gandantaWidth ||
      siderealLongitude <= gandantaWidth;

    // BPHS Combustion check
    const orbLimit = COMBUSTION_ORBS[Astronomy.Body[body]] || COMBUSTION_ORBS[String(body)];
    let angularDiff = Math.abs(siderealLongitude - sunSidereal);
    if (angularDiff > 180) angularDiff = 360 - angularDiff;
    const isCombust = orbLimit ? angularDiff < orbLimit : false;

    return {
      body: String(body),
      tropicalLongitude,
      siderealLongitude,
      rashiIndex,
      navamsaRashiIndex,
      degreeInRashi,
      nakshatraIndex,
      pada,
      isVargottama,
      isGandanta,
      isCombust,
    };
  });

  return { ayanamsa, planets };
}
