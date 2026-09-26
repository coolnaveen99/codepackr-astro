// Codepackr Astro — Event-Based Tamil Solar Calendar Engine
import { Body } from "astronomy-engine";
import { normalize360, signIndex } from "../astronomy/coordinates";
import { tropicalLongitude } from "../astronomy/ephemeris";
import { getAyanamsa } from "../astronomy/sidereal";
import { julianDay, jdToCalendar, formatJD, timeFromJD } from "../astronomy/time";
import { calculateSunTimes } from "../astronomy/sunrise";
import {
  SAMVATSARA_60,
  getSamvatsaraByIndex,
  samvatsaraIndexFromYear,
  type SamvatsaraInfo,
} from "./samvatsara";
import type { TamilMonthInfo, TamilYearRecord } from "../types";

export const TAMIL_MONTHS = [
  { index: 0, nameTa: "சித்திரை", nameEn: "Chithirai", rasiIndex: 0, rasiNameTa: "மேஷம்", rasiNameEn: "Mesha" },
  { index: 1, nameTa: "வைகாசி", nameEn: "Vaikasi", rasiIndex: 1, rasiNameTa: "ரிஷபம்", rasiNameEn: "Vrishabha" },
  { index: 2, nameTa: "ஆனி", nameEn: "Aani", rasiIndex: 2, rasiNameTa: "மிதுனம்", rasiNameEn: "Mithuna" },
  { index: 3, nameTa: "ஆடி", nameEn: "Aadi", rasiIndex: 3, rasiNameTa: "கடகம்", rasiNameEn: "Karka" },
  { index: 4, nameTa: "ஆவணி", nameEn: "Avani", rasiIndex: 4, rasiNameTa: "சிம்மம்", rasiNameEn: "Simha" },
  { index: 5, nameTa: "புரட்டாசி", nameEn: "Purattasi", rasiIndex: 5, rasiNameTa: "கன்னி", rasiNameEn: "Kanya" },
  { index: 6, nameTa: "ஐப்பசி", nameEn: "Aippasi", rasiIndex: 6, rasiNameTa: "துலாம்", rasiNameEn: "Tula" },
  { index: 7, nameTa: "கார்த்திகை", nameEn: "Karthigai", rasiIndex: 7, rasiNameTa: "விருச்சிகம்", rasiNameEn: "Vrischika" },
  { index: 8, nameTa: "மார்கழி", nameEn: "Margazhi", rasiIndex: 8, rasiNameTa: "தனுசு", rasiNameEn: "Dhanu" },
  { index: 9, nameTa: "தை", nameEn: "Thai", rasiIndex: 9, rasiNameTa: "மகரம்", rasiNameEn: "Makara" },
  { index: 10, nameTa: "மாசி", nameEn: "Maasi", rasiIndex: 10, rasiNameTa: "கும்பம்", rasiNameEn: "Kumbha" },
  { index: 11, nameTa: "பங்குனி", nameEn: "Panguni", rasiIndex: 11, rasiNameTa: "மீனம்", rasiNameEn: "Meena" },
] as const;

/**
 * Calculates Sun's apparent sidereal longitude for a given Julian Day and Ayanamsa.
 */
export function getSunSiderealLongitude(jd: number, ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"): number {
  const t = timeFromJD(jd);
  const trop = tropicalLongitude(Body.Sun, t);
  const aya = getAyanamsa(jd, ayanamsaType);
  return normalize360(trop - aya);
}

/**
 * Finds the exact Julian Day when the Sun enters a target sidereal sign (0 to 11).
 * Uses high-precision binary root-finding bracketing the transition.
 */
export function findSolarIngress(
  targetRasi: number,
  approxJD: number,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): number {
  const targetDegree = targetRasi * 30;
  let tLow = approxJD - 25;
  let tHigh = approxJD + 25;

  const evalDiff = (jd: number) => {
    const lon = getSunSiderealLongitude(jd, ayanamsaType);
    let diff = lon - targetDegree;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  };

  // Binary search root-finding to within 1 second (~0.00001 days)
  for (let iter = 0; iter < 45; iter++) {
    const tMid = (tLow + tHigh) / 2;
    const diff = evalDiff(tMid);
    if (Math.abs(diff) < 0.000005) {
      return tMid;
    }
    if (diff < 0) {
      tLow = tMid;
    } else {
      tHigh = tMid;
    }
  }
  return (tLow + tHigh) / 2;
}

export type TamilDateResult = {
  tamilYear: SamvatsaraInfo;
  tamilMonth: (typeof TAMIL_MONTHS)[number];
  tamilDay: number;
  thiruvalluvarYear: number;
  sakaYear: number;
  kaliYear: number;
  monthIngressInstant: string;
  monthIngressJD: number;
  nextIngressJD: number;
  gregorianDate: string;
};

/**
 * Converts a Gregorian date and observer location to the exact Tamil calendar date.
 * Event-based calculation determined by the Sun's sidereal transit into the 12 signs.
 */
export function getTamilDate(
  year: number,
  month: number,
  day: number,
  lat: number = 13.0827,
  lon: number = 80.2707,
  tz: number = 5.5,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): TamilDateResult {
  // Approximate noon JD for the civil day
  const jdNoon = julianDay(year, month, day, 12 - tz);
  const sunSid = getSunSiderealLongitude(jdNoon, ayanamsaType);
  const currentRasi = signIndex(sunSid);
  const monthDef = TAMIL_MONTHS[currentRasi]!;

  // Approximate search epoch for current month ingress
  const monthApproxDays = (month - 1) * 30.4375 + day;
  const currentIngressJD = findSolarIngress(currentRasi, jdNoon - 15, ayanamsaType);
  const nextRasi = (currentRasi + 1) % 12;
  const nextIngressJD = findSolarIngress(nextRasi, jdNoon + 15, ayanamsaType);

  // Find Chithirai ingress for this Tamil year
  // If current month is Margazhi/Thai/Maasi/Panguni (Jan-Apr before Chithirai), Chithirai ingress was previous year
  let chithiraiYear = year;
  if (currentRasi >= 8 && month <= 4) {
    chithiraiYear = year - 1;
  } else if (currentRasi === 11 && month <= 4) {
    chithiraiYear = year - 1;
  }
  const approxChithiraiJD = julianDay(chithiraiYear, 4, 14, 0);
  const chithiraiIngressJD = findSolarIngress(0, approxChithiraiJD, ayanamsaType);

  // Determine Samvatsara cycle index
  const chithiraiCal = jdToCalendar(chithiraiIngressJD, tz);
  const samvatsaraIndex = samvatsaraIndexFromYear(chithiraiCal.year);
  const samvatsara = getSamvatsaraByIndex(samvatsaraIndex);

  // Tamil Day number: count of civil days / sunrises since month ingress
  // Tamil standard rule: If solar ingress occurs before sunset, that civil day is Month Day 1.
  // If ingress occurs after sunset, Month Day 1 begins on the following sunrise.
  const ingressSunTimes = calculateSunTimes(
    chithiraiCal.year,
    monthDef.index + 1,
    15,
    lat,
    lon,
    tz
  );
  
  // Calculate day difference from ingress
  const ingressDateCal = jdToCalendar(currentIngressJD, tz);
  const ingressCivilJD = julianDay(ingressDateCal.year, ingressDateCal.month, ingressDateCal.day, 0);
  const targetCivilJD = julianDay(year, month, day, 0);
  
  // Refine ingress boundary day 1
  let ingressDay1CivilJD = ingressCivilJD;
  // If ingress occurred after sunset (~18:00 local = 0.75 of day), day 1 is next day
  const ingressHourLocal = ingressDateCal.hour + ingressDateCal.minute / 60;
  if (ingressHourLocal > 18.0) {
    ingressDay1CivilJD += 1.0;
  }

  let tamilDay = Math.floor(targetCivilJD - ingressDay1CivilJD) + 1;
  if (tamilDay < 1) tamilDay = 1;

  // Era years:
  // Thiruvalluvar Year = Gregorian Year + 31 (for dates after Thai 1; +30 before)
  const isAfterThai1 = currentRasi >= 9 || (currentRasi < 8 && month > 1);
  const thiruvalluvarYear = chithiraiCal.year + 31 + (isAfterThai1 ? 0 : -1);
  const sakaYear = chithiraiCal.year - 78;
  const kaliYear = chithiraiCal.year + 3101;

  const pad = (n: number) => String(n).padStart(2, "0");
  const gregorianDate = `${year}-${pad(month)}-${pad(day)}`;

  return {
    tamilYear: samvatsara,
    tamilMonth: monthDef,
    tamilDay,
    thiruvalluvarYear,
    sakaYear,
    kaliYear,
    monthIngressInstant: formatJD(currentIngressJD, tz),
    monthIngressJD: currentIngressJD,
    nextIngressJD,
    gregorianDate,
  };
}

/**
 * Generates full Tamil 60-Year Table for calendar display.
 * Computes exact start and end instants, cycle numbers, and Gregorian ranges.
 */
export function generate60YearCalendar(startGregorianYear: number = 1987): TamilYearRecord[] {
  const records: TamilYearRecord[] = [];
  const baseYear = startGregorianYear;

  for (let i = 0; i < 60; i++) {
    const gy = baseYear + i;
    const cycleIdx = samvatsaraIndexFromYear(gy);
    const sam = getSamvatsaraByIndex(cycleIdx);

    const approxChithirai = julianDay(gy, 4, 14, 0);
    const startJD = findSolarIngress(0, approxChithirai);
    const nextApproxChithirai = julianDay(gy + 1, 4, 14, 0);
    const endJD = findSolarIngress(0, nextApproxChithirai);

    records.push({
      cycleNumber: cycleIdx,
      tamilYearNameTa: sam.nameTa,
      tamilYearNameEn: sam.nameEn,
      gregorianStartYear: gy,
      gregorianEndYear: gy + 1,
      startInstant: formatJD(startJD, 5.5),
      endInstant: formatJD(endJD, 5.5),
      chithirai1: formatJD(startJD, 5.5).split(" ")[0] ?? `${gy}-04-14`,
      deity: sam.deityTa,
      natureTa: sam.natureTa,
      natureEn: sam.natureEn,
    });
  }

  return records;
}
