// Codepackr Astro — Tithi Calculation & Exact Transitions
import { Body } from "astronomy-engine";
import { normalize360 } from "../astronomy/coordinates";
import { tropicalLongitude } from "../astronomy/ephemeris";
import { timeFromJD, formatClock, formatJD } from "../astronomy/time";
import type { AstroInterval } from "../types";

export const TITHI_NAMES_TA = [
  "பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி",
  "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி",
  "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி", "பௌர்ணமி",
  "பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி",
  "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி",
  "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி", "அமாவாசை",
];

export const TITHI_NAMES_EN = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

/**
 * Returns lunar-solar elongation (Moon - Sun) in degrees [0, 360).
 */
export function getLunarElongation(jd: number): number {
  const t = timeFromJD(jd);
  const sun = tropicalLongitude(Body.Sun, t);
  const moon = tropicalLongitude(Body.Moon, t);
  return normalize360(moon - sun);
}

/**
 * Calculates current Tithi index (0 to 29) at a given Julian Day.
 */
export function currentTithi(jd: number): { index: number; paksha: "shukla" | "krishna"; nameTa: string; nameEn: string } {
  const sep = getLunarElongation(jd);
  const index = Math.floor(sep / 12) % 30;
  const paksha = index < 15 ? "shukla" : "krishna";
  return {
    index,
    paksha,
    nameTa: `${paksha === "shukla" ? "சுக்ல பட்ச " : "கிருஷ்ண பட்ச "}${TITHI_NAMES_TA[index]!}`,
    nameEn: `${paksha === "shukla" ? "Shukla " : "Krishna "}${TITHI_NAMES_EN[index]!}`,
  };
}

/**
 * Finds the exact Julian Day when the lunar elongation crosses a target degree (0, 12, 24, ... 360).
 * Binary search root-finding with high precision.
 */
export function findTithiTransition(targetDegree: number, approxJD: number): number {
  const normTarget = normalize360(targetDegree);
  let low = approxJD - 1.5;
  let high = approxJD + 1.5;

  const evalDiff = (jd: number) => {
    const el = getLunarElongation(jd);
    let diff = el - normTarget;
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
 * Computes exact Tithi interval active on a given date and subsequent transitions.
 */
export function getTithiInterval(jd: number, tz: number = 5.5): AstroInterval {
  const sep = getLunarElongation(jd);
  const idx = Math.floor(sep / 12) % 30;
  const startTarget = idx * 12;
  const endTarget = (idx + 1) * 12;

  const startJD = findTithiTransition(startTarget, jd - 0.5);
  const endJD = findTithiTransition(endTarget, jd + 0.5);

  const tithiInfo = currentTithi(jd);

  return {
    name: tithiInfo.nameEn,
    nameTa: tithiInfo.nameTa,
    startsAt: formatClock(startJD, tz),
    endsAt: formatClock(endJD, tz),
    startJD,
    endJD,
    source: "calculated",
    profileId: "thirukanitham-oriented",
    index: idx,
  };
}
