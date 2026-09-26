// Codepackr Astro — Yoga Calculation & Transition Engine
import { Body } from "astronomy-engine";
import { normalize360 } from "../astronomy/coordinates";
import { tropicalLongitude } from "../astronomy/ephemeris";
import { getAyanamsa } from "../astronomy/sidereal";
import { timeFromJD, formatClock } from "../astronomy/time";
import type { AstroInterval } from "../types";

export const YOGA_NAMES_TA = [
  "விஷ்கம்பம்", "ப்ரீதி", "ஆயுஷ்மான்", "சௌபாக்யம்", "சோபனம்",
  "அதிகண்டம்", "சுகர்மம்", "திருதி", "சூலம்", "கண்டம்",
  "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்",
  "சித்தி", "வியதிபாதம்", "வரியான்", "பரிகம்", "சிவம்",
  "சித்தம்", "சாத்தியம்", "சுபம்", "சுக்கிலம்", "பிராமியம்",
  "ஐந்திரம்", "வைத்ருதி",
];

export const YOGA_NAMES_EN = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
];

/**
 * Returns sum of Sun and Moon sidereal longitudes in degrees [0, 360).
 */
export function getYogaSum(jd: number, ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"): number {
  const t = timeFromJD(jd);
  const sunTrop = tropicalLongitude(Body.Sun, t);
  const moonTrop = tropicalLongitude(Body.Moon, t);
  const aya = getAyanamsa(jd, ayanamsaType);
  const sunSid = normalize360(sunTrop - aya);
  const moonSid = normalize360(moonTrop - aya);
  return normalize360(sunSid + moonSid);
}

/**
 * Calculates current Yoga details at a given Julian Day.
 */
export function currentYoga(jd: number, ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"): {
  index: number;
  nameTa: string;
  nameEn: string;
} {
  const sum = getYogaSum(jd, ayanamsaType);
  const span = 360 / 27;
  const index = Math.floor(sum / span) % 27;
  return {
    index,
    nameTa: YOGA_NAMES_TA[index] ?? "யோகம்",
    nameEn: YOGA_NAMES_EN[index] ?? "Yoga",
  };
}

/**
 * Finds exact Julian Day when the Sun+Moon sum crosses a target degree boundary.
 */
export function findYogaTransition(
  targetDegree: number,
  approxJD: number,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): number {
  const normTarget = normalize360(targetDegree);
  let low = approxJD - 1.5;
  let high = approxJD + 1.5;

  const evalDiff = (jd: number) => {
    const sum = getYogaSum(jd, ayanamsaType);
    let diff = sum - normTarget;
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
 * Returns exact active Yoga interval at a given Julian Day.
 */
export function getYogaInterval(
  jd: number,
  tz: number = 5.5,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): AstroInterval {
  const sum = getYogaSum(jd, ayanamsaType);
  const span = 360 / 27;
  const idx = Math.floor(sum / span) % 27;
  const startTarget = idx * span;
  const endTarget = (idx + 1) * span;

  const startJD = findYogaTransition(startTarget, jd - 0.5, ayanamsaType);
  const endJD = findYogaTransition(endTarget, jd + 0.5, ayanamsaType);
  const info = currentYoga(jd, ayanamsaType);

  return {
    name: info.nameEn,
    nameTa: info.nameTa,
    startsAt: formatClock(startJD, tz),
    endsAt: formatClock(endJD, tz),
    startJD,
    endJD,
    source: "calculated",
    profileId: ayanamsaType,
    index: idx,
  };
}
