// Codepackr Astro — Nakshatra & Pada Transition Engine
import { Body } from "astronomy-engine";
import { normalize360 } from "../astronomy/coordinates";
import { tropicalLongitude } from "../astronomy/ephemeris";
import { getAyanamsa } from "../astronomy/sidereal";
import { timeFromJD, formatClock } from "../astronomy/time";
import { NAK_LORD } from "../constants";
import type { AstroInterval } from "../types";

export const NAKSHATRA_NAMES_TA = [
  "அஸ்வினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிஷம்",
  "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்",
  "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி",
  "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்",
  "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி",
  "உத்திரட்டாதி", "ரேவதி",
];

export const NAKSHATRA_NAMES_EN = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

/**
 * Returns Moon's sidereal longitude for a given Julian Day and Ayanamsa.
 */
export function getMoonSiderealLongitude(jd: number, ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"): number {
  const t = timeFromJD(jd);
  const trop = tropicalLongitude(Body.Moon, t);
  const aya = getAyanamsa(jd, ayanamsaType);
  return normalize360(trop - aya);
}

/**
 * Computes Nakshatra details (0 to 26), Pada (1 to 4), and Lord for an angular position.
 */
export function nakshatraDetails(lon: number): {
  index: number;
  pada: number;
  lord: string;
  nameTa: string;
  nameEn: string;
  portionUsed: number;
} {
  const norm = normalize360(lon);
  const n = (norm * 27) / 360; // 13°20′ = 13.333333°
  const index = Math.floor(n) % 27;
  const fraction = Math.max(0, Math.min(1, n - Math.floor(n)));
  const pada = Math.min(4, Math.floor(fraction * 4) + 1);
  const lord = NAK_LORD[index % 9]!;
  return {
    index,
    pada,
    lord,
    nameTa: NAKSHATRA_NAMES_TA[index]!,
    nameEn: NAKSHATRA_NAMES_EN[index]!,
    portionUsed: fraction,
  };
}

/**
 * Finds the exact Julian Day when the Moon enters a target nakshatra degree.
 */
export function findNakshatraTransition(
  targetDegree: number,
  approxJD: number,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): number {
  const normTarget = normalize360(targetDegree);
  let low = approxJD - 1.5;
  let high = approxJD + 1.5;

  const evalDiff = (jd: number) => {
    const lon = getMoonSiderealLongitude(jd, ayanamsaType);
    let diff = lon - normTarget;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  };

  for (let i = 0; i < 35; i++) {
    const mid = (low + high) / 2;
    const diff = evalDiff(mid);
    if (Math.abs(diff) < 0.0001) return mid;
    if (diff < 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

/**
 * Computes exact Nakshatra interval active at a given Julian Day.
 */
export function getNakshatraInterval(
  jd: number,
  tz: number = 5.5,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): AstroInterval {
  const moonLon = getMoonSiderealLongitude(jd, ayanamsaType);
  const span = 360 / 27;
  const idx = Math.floor(moonLon / span) % 27;
  const startTarget = idx * span;
  const endTarget = (idx + 1) * span;

  const startJD = findNakshatraTransition(startTarget, jd - 0.5, ayanamsaType);
  const endJD = findNakshatraTransition(endTarget, jd + 0.5, ayanamsaType);

  const details = nakshatraDetails(moonLon);

  return {
    name: details.nameEn,
    nameTa: details.nameTa,
    startsAt: formatClock(startJD, tz),
    endsAt: formatClock(endJD, tz),
    startJD,
    endJD,
    source: "calculated",
    profileId: ayanamsaType,
    index: idx,
    pada: details.pada,
    lord: details.lord,
  };
}
