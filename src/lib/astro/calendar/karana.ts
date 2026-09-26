// Codepackr Astro — Karana Transition Engine
import { getLunarElongation, findTithiTransition } from "./tithi";
import { formatClock } from "../astronomy/time";
import type { AstroInterval } from "../types";

export const findKaranaTransition = findTithiTransition;

export const KARANA_NAMES_TA = [
  "பவ", "பாலவ", "கௌலவ", "தைதுலை", "கரசை", "வனசை", "பத்திரை (விஷ்டி)",
  "சகுனி", "சதுஷ்பாதம்", "நாகவம்", "கிம்ஸ்துக்னம்",
];

export const KARANA_NAMES_EN = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)",
  "Shakuni", "Chatushpada", "Naga", "Kimstughna",
];

/**
 * Maps lunar elongation 6° slot index (0 to 59) to Karana name index.
 * Slots 0 to 59 correspond to the 60 half-tithis of a synodic month.
 */
export function getKaranaIndexFromSlot(slot: number): number {
  if (slot === 0) return 10; // Kimstughna (1st half of Shukla Pratipada)
  if (slot >= 57) {
    if (slot === 57) return 7; // Shakuni
    if (slot === 58) return 8; // Chatushpada
    return 9; // Naga (slot 59)
  }
  // Repeating 7 karanas for slots 1 through 56
  return (slot - 1) % 7;
}

/**
 * Calculates current Karana at a given Julian Day.
 */
export function currentKarana(jd: number): {
  slot: number;
  karanaIndex: number;
  nameTa: string;
  nameEn: string;
  isBhadra: boolean;
} {
  const el = getLunarElongation(jd);
  const slot = Math.floor(el / 6) % 60;
  const idx = getKaranaIndexFromSlot(slot);
  return {
    slot,
    karanaIndex: idx,
    nameTa: KARANA_NAMES_TA[idx]!,
    nameEn: KARANA_NAMES_EN[idx]!,
    isBhadra: idx === 6, // Vishti / Bhadra
  };
}

/**
 * Returns exact active Karana interval at a given Julian Day.
 */
export function getKaranaInterval(jd: number, tz: number = 5.5): AstroInterval {
  const el = getLunarElongation(jd);
  const slot = Math.floor(el / 6) % 60;
  const startTarget = slot * 6;
  const endTarget = (slot + 1) * 6;

  const startJD = findTithiTransition(startTarget, jd - 0.25);
  const endJD = findTithiTransition(endTarget, jd + 0.25);
  const info = currentKarana(jd);

  return {
    name: info.nameEn,
    nameTa: info.nameTa,
    startsAt: formatClock(startJD, tz),
    endsAt: formatClock(endJD, tz),
    startJD,
    endJD,
    source: "calculated",
    profileId: "thirukanitham-oriented",
    index: info.karanaIndex,
  };
}
