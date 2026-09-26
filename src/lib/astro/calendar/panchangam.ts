// Codepackr Astro — Event-Based Daily Panchangam & Astronomical Day Details Engine
import { julianDay, formatJD, formatClock, timeFromJD } from "../astronomy/time";
import { calculateSunTimes, calculateMoonTimes } from "../astronomy/sunrise";
import { getTamilDate, getSunSiderealLongitude, type TamilDateResult } from "./tamil-calendar";
import {
  getTithiInterval,
  currentTithi,
  findTithiTransition,
  TITHI_NAMES_TA,
  TITHI_NAMES_EN,
} from "./tithi";
import {
  getNakshatraInterval,
  nakshatraDetails,
  getMoonSiderealLongitude,
  findNakshatraTransition,
  NAKSHATRA_NAMES_TA,
  NAKSHATRA_NAMES_EN,
} from "./nakshatra";
import { getYogaInterval, currentYoga, findYogaTransition, YOGA_NAMES_TA, YOGA_NAMES_EN } from "./yoga";
import {
  getKaranaInterval,
  currentKarana,
  findKaranaTransition,
  KARANA_NAMES_TA,
  KARANA_NAMES_EN,
} from "./karana";
import { calculateMuhurthaSpans, type MuhurthaEvaluation, type TimingInterval } from "./muhurtha";
import { computeTropicalPlanets } from "../astronomy/ephemeris";
import { getAyanamsa } from "../astronomy/sidereal";
import { normalize360, toDMS, signIndex } from "../astronomy/coordinates";
import { SIGNS_TA, SIGNS_EN } from "../constants";
import { evaluateFestivalsForDay, type FestivalRuleMatch, type DayFestivalContext } from "./festivals";
import { MoonPhase, Illumination, Body } from "astronomy-engine";
import type { AstroInterval } from "../types";

export type EventPanchangam = {
  date: string;
  weekday: number;
  weekdayNameTa: string;
  weekdayNameEn: string;
  tamilDate: TamilDateResult;
  sunriseClock: string;
  sunsetClock: string;
  moonriseClock: string;
  moonsetClock: string;
  sunriseJD: number;
  sunsetJD: number;
  tithi: AstroInterval;
  nakshatra: AstroInterval;
  yoga: AstroInterval;
  karana: AstroInterval;
  muhurtha: MuhurthaEvaluation;
};

export type DayTithiDetail = {
  index: number;
  nameTa: string;
  nameEn: string;
  paksha: "shukla" | "krishna";
  pakshaTa: string;
  startJD: number;
  endJD: number;
  startClock: string;
  endClock: string;
  isSunriseTithi: boolean;
};

export type DayNakshatraDetail = {
  index: number;
  nameTa: string;
  nameEn: string;
  pada: number;
  lord: string;
  lordTa: string;
  startJD: number;
  endJD: number;
  startClock: string;
  endClock: string;
  isSunriseNakshatra: boolean;
};

export type DayYogaDetail = {
  index: number;
  nameTa: string;
  nameEn: string;
  startJD: number;
  endJD: number;
  startClock: string;
  endClock: string;
};

export type DayKaranaDetail = {
  index: number;
  nameTa: string;
  nameEn: string;
  startJD: number;
  endJD: number;
  startClock: string;
  endClock: string;
};

export type DayRasiDetail = {
  body: "Moon" | "Sun";
  bodyTa: string;
  currentSignIndex: number;
  currentSignNameTa: string;
  currentSignNameEn: string;
  longitude: number;
  formattedDMS: string;
  hasIngressToday: boolean;
  nextSignIndex?: number;
  nextSignNameTa?: string;
  nextSignNameEn?: string;
  ingressClock?: string;
  ingressJD?: number;
};

export type PlanetaryDayPosition = {
  id: string;
  nameTa: string;
  nameEn: string;
  longitude: number;
  formattedDMS: string;
  signIndex: number;
  signNameTa: string;
  signNameEn: string;
  nakshatraIndex: number;
  nakshatraNameTa: string;
  nakshatraNameEn: string;
  pada: number;
  speed: number;
  retrograde: boolean;
  combust: boolean;
};

export type MoonPhaseInfo = {
  phaseDegrees: number;
  illuminationFraction: number;
  illuminationPercent: string;
  phaseNameTa: string;
  phaseNameEn: string;
  phaseCategory:
    | "new_moon"
    | "waxing_crescent"
    | "first_quarter"
    | "waxing_gibbous"
    | "full_moon"
    | "waning_gibbous"
    | "third_quarter"
    | "waning_crescent";
};

export type TimelineEvent = {
  timeClock: string;
  hour: number;
  minute: number;
  fractionOfDay: number; // 0.0 to 1.0 (for placement along 24h bar)
  titleTa: string;
  titleEn: string;
  descTa?: string;
  descEn?: string;
  type: "sunrise" | "sunset" | "moonrise" | "moonset" | "tithi" | "nakshatra" | "rahu" | "yama" | "abhijit" | "muhurtha" | "ingress";
  nature: "auspicious" | "inauspicious" | "neutral";
};

export type ComprehensiveDayPanchang = Omit<EventPanchangam, "tamilDate"> & {
  tamilDate: TamilDateResult & {
    monthIndex: number;
    monthNameTa: string;
    monthNameEn: string;
    day: number;
    yearNameTa: string;
    yearNameEn: string;
    samvatsaraNumber: number;
  };
  dayTithis: DayTithiDetail[];
  dayNakshatras: DayNakshatraDetail[];
  dayYogas: DayYogaDetail[];
  dayKaranas: DayKaranaDetail[];
  moonRasi: DayRasiDetail;
  sunRasi: DayRasiDetail;
  moonPhase: MoonPhaseInfo;
  planets: PlanetaryDayPosition[];
  festivals: FestivalRuleMatch[];
  timeline: TimelineEvent[];
  location: {
    name: string;
    lat: number;
    lon: number;
    tz: number;
  };
};

const WEEKDAYS_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PLANET_LORDS_TA: Record<string, string> = {
  ketu: "கேது",
  venus: "சுக்கிரன்",
  sun: "சூரியன்",
  moon: "சந்திரன்",
  mars: "செவ்வாய்",
  rahu: "ராகு",
  jupiter: "குரு",
  saturn: "சனி",
  mercury: "புதன்",
};

/**
 * Parses time clock "HH:MM" into fractional day [0.0, 1.0]
 */
function clockToFraction(clock: string): { hour: number; minute: number; fraction: number } {
  const parts = clock.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  const fraction = Math.max(0, Math.min(1, (h * 60 + m) / 1440));
  return { hour: h, minute: m, fraction };
}

/**
 * Evaluates full astronomical and panchang day details for a specific date and location.
 */
export function calculateComprehensiveDayDetails(input: {
  year: number;
  month: number;
  day: number;
  lat?: number;
  lon?: number;
  tz?: number;
  placeName?: string;
  elevationMeters?: number;
  ayanamsaType?: "lahiri" | "thirukanitham";
}): ComprehensiveDayPanchang {
  const lat = input.lat ?? 13.0827; // Chennai reference default
  const lon = input.lon ?? 80.2707;
  const tz = input.tz ?? 5.5;
  const placeName = input.placeName ?? "Chennai (Madras)";
  const ayanamsaType = input.ayanamsaType ?? "lahiri";

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${input.year}-${pad(input.month)}-${pad(input.day)}`;

  const sunTimes = calculateSunTimes(input.year, input.month, input.day, lat, lon, tz, input.elevationMeters);
  const moonTimes = calculateMoonTimes(input.year, input.month, input.day, lat, lon, tz, input.elevationMeters);

  const weekday = Math.floor(sunTimes.sunriseJD + tz / 24 + 1.5) % 7;
  const rawTamilDate = getTamilDate(input.year, input.month, input.day, lat, lon, tz, ayanamsaType);
  const tamilDate = {
    ...rawTamilDate,
    monthIndex: rawTamilDate.tamilMonth.index,
    monthNameTa: rawTamilDate.tamilMonth.nameTa,
    monthNameEn: rawTamilDate.tamilMonth.nameEn,
    day: rawTamilDate.tamilDay,
    yearNameTa: rawTamilDate.tamilYear.nameTa,
    yearNameEn: rawTamilDate.tamilYear.nameEn,
    samvatsaraNumber: rawTamilDate.tamilYear.cycleIndex,
  };

  // Calendar Day Bounds [00:00, 24:00] local time
  const dayStartJD = julianDay(input.year, input.month, input.day, 0 - tz);
  const dayEndJD = julianDay(input.year, input.month, input.day, 24 - tz);
  const noonJD = julianDay(input.year, input.month, input.day, 12 - tz);

  // -------------------------------------------------------------
  // 1. TITHI TRANSITIONS DURING THE DAY
  // -------------------------------------------------------------
  const tithi0 = currentTithi(dayStartJD);
  const nextTithiDeg1 = (tithi0.index + 1) * 12;
  const t1 = findTithiTransition(nextTithiDeg1, dayStartJD + 0.5);

  const dayTithis: DayTithiDetail[] = [];
  if (t1 > dayStartJD && t1 < dayEndJD) {
    // Two tithis today
    const tithi1 = currentTithi(t1 + 0.005);
    const nextTithiDeg2 = (tithi1.index + 1) * 12;
    const t2 = findTithiTransition(nextTithiDeg2, t1 + 0.5);

    dayTithis.push({
      index: tithi0.index,
      nameTa: TITHI_NAMES_TA[tithi0.index] ?? "திதி",
      nameEn: TITHI_NAMES_EN[tithi0.index] ?? "Tithi",
      paksha: tithi0.paksha,
      pakshaTa: tithi0.paksha === "shukla" ? "வளர்பிறை" : "தேய்பிறை",
      startJD: dayStartJD,
      endJD: t1,
      startClock: "00:00",
      endClock: formatClock(t1, tz),
      isSunriseTithi: sunTimes.sunriseJD >= dayStartJD && sunTimes.sunriseJD <= t1,
    });

    dayTithis.push({
      index: tithi1.index,
      nameTa: TITHI_NAMES_TA[tithi1.index] ?? "திதி",
      nameEn: TITHI_NAMES_EN[tithi1.index] ?? "Tithi",
      paksha: tithi1.paksha,
      pakshaTa: tithi1.paksha === "shukla" ? "வளர்பிறை" : "தேய்பிறை",
      startJD: t1,
      endJD: t2 < dayEndJD ? t2 : dayEndJD,
      startClock: formatClock(t1, tz),
      endClock: t2 < dayEndJD ? formatClock(t2, tz) : "அடுத்த நாள் வரை",
      isSunriseTithi: sunTimes.sunriseJD > t1,
    });
  } else {
    // Single tithi spans entire day
    dayTithis.push({
      index: tithi0.index,
      nameTa: TITHI_NAMES_TA[tithi0.index] ?? "திதி",
      nameEn: TITHI_NAMES_EN[tithi0.index] ?? "Tithi",
      paksha: tithi0.paksha,
      pakshaTa: tithi0.paksha === "shukla" ? "வளர்பிறை" : "தேய்பிறை",
      startJD: dayStartJD,
      endJD: dayEndJD,
      startClock: "00:00",
      endClock: "அடுத்த நாள் வரை",
      isSunriseTithi: true,
    });
  }

  // -------------------------------------------------------------
  // 2. NAKSHATRA TRANSITIONS DURING THE DAY
  // -------------------------------------------------------------
  const moonLon0 = getMoonSiderealLongitude(dayStartJD, ayanamsaType);
  const nak0 = nakshatraDetails(moonLon0);
  const nextNakDeg1 = (nak0.index + 1) * (360 / 27);
  const n1 = findNakshatraTransition(nextNakDeg1, dayStartJD + 0.5, ayanamsaType);

  const dayNakshatras: DayNakshatraDetail[] = [];
  if (n1 > dayStartJD && n1 < dayEndJD) {
    const moonLon1 = getMoonSiderealLongitude(n1 + 0.005, ayanamsaType);
    const nak1 = nakshatraDetails(moonLon1);
    const nextNakDeg2 = (nak1.index + 1) * (360 / 27);
    const n2 = findNakshatraTransition(nextNakDeg2, n1 + 0.5, ayanamsaType);

    dayNakshatras.push({
      index: nak0.index,
      nameTa: nak0.nameTa,
      nameEn: nak0.nameEn,
      pada: nak0.pada,
      lord: nak0.lord,
      lordTa: PLANET_LORDS_TA[nak0.lord] ?? nak0.lord,
      startJD: dayStartJD,
      endJD: n1,
      startClock: "00:00",
      endClock: formatClock(n1, tz),
      isSunriseNakshatra: sunTimes.sunriseJD >= dayStartJD && sunTimes.sunriseJD <= n1,
    });

    dayNakshatras.push({
      index: nak1.index,
      nameTa: nak1.nameTa,
      nameEn: nak1.nameEn,
      pada: nak1.pada,
      lord: nak1.lord,
      lordTa: PLANET_LORDS_TA[nak1.lord] ?? nak1.lord,
      startJD: n1,
      endJD: n2 < dayEndJD ? n2 : dayEndJD,
      startClock: formatClock(n1, tz),
      endClock: n2 < dayEndJD ? formatClock(n2, tz) : "அடுத்த நாள் வரை",
      isSunriseNakshatra: sunTimes.sunriseJD > n1,
    });
  } else {
    dayNakshatras.push({
      index: nak0.index,
      nameTa: nak0.nameTa,
      nameEn: nak0.nameEn,
      pada: nak0.pada,
      lord: nak0.lord,
      lordTa: PLANET_LORDS_TA[nak0.lord] ?? nak0.lord,
      startJD: dayStartJD,
      endJD: dayEndJD,
      startClock: "00:00",
      endClock: "அடுத்த நாள் வரை",
      isSunriseNakshatra: true,
    });
  }

  // -------------------------------------------------------------
  // 3. YOGA & KARANA DETAILS
  // -------------------------------------------------------------
  const yoga0 = currentYoga(dayStartJD, ayanamsaType);
  const nextYogaDeg = (yoga0.index + 1) * (360 / 27);
  const y1 = findYogaTransition(nextYogaDeg, dayStartJD + 0.5, ayanamsaType);
  const dayYogas: DayYogaDetail[] = [];
  if (y1 > dayStartJD && y1 < dayEndJD) {
    const yoga1 = currentYoga(y1 + 0.005, ayanamsaType);
    dayYogas.push({
      index: yoga0.index,
      nameTa: yoga0.nameTa,
      nameEn: yoga0.nameEn,
      startJD: dayStartJD,
      endJD: y1,
      startClock: "00:00",
      endClock: formatClock(y1, tz),
    });
    dayYogas.push({
      index: yoga1.index,
      nameTa: yoga1.nameTa,
      nameEn: yoga1.nameEn,
      startJD: y1,
      endJD: dayEndJD,
      startClock: formatClock(y1, tz),
      endClock: "அடுத்த நாள் வரை",
    });
  } else {
    dayYogas.push({
      index: yoga0.index,
      nameTa: yoga0.nameTa,
      nameEn: yoga0.nameEn,
      startJD: dayStartJD,
      endJD: dayEndJD,
      startClock: "00:00",
      endClock: "அடுத்த நாள் வரை",
    });
  }

  const karana0 = currentKarana(dayStartJD);
  const nextKaranaDeg = (karana0.karanaIndex + 1) * 6;
  const k1 = findKaranaTransition(nextKaranaDeg, dayStartJD + 0.5);
  const dayKaranas: DayKaranaDetail[] = [];
  if (k1 > dayStartJD && k1 < dayEndJD) {
    const karana1 = currentKarana(k1 + 0.005);
    dayKaranas.push({
      index: karana0.karanaIndex,
      nameTa: karana0.nameTa,
      nameEn: karana0.nameEn,
      startJD: dayStartJD,
      endJD: k1,
      startClock: "00:00",
      endClock: formatClock(k1, tz),
    });
    dayKaranas.push({
      index: karana1.karanaIndex,
      nameTa: karana1.nameTa,
      nameEn: karana1.nameEn,
      startJD: k1,
      endJD: dayEndJD,
      startClock: formatClock(k1, tz),
      endClock: "அடுத்த நாள் வரை",
    });
  } else {
    dayKaranas.push({
      index: karana0.karanaIndex,
      nameTa: karana0.nameTa,
      nameEn: karana0.nameEn,
      startJD: dayStartJD,
      endJD: dayEndJD,
      startClock: "00:00",
      endClock: "அடுத்த நாள் வரை",
    });
  }

  // -------------------------------------------------------------
  // 4. MOON & SUN RASI AND INGRESS
  // -------------------------------------------------------------
  const mSignStart = signIndex(moonLon0);
  const moonLonEnd = getMoonSiderealLongitude(dayEndJD, ayanamsaType);
  const mSignEnd = signIndex(moonLonEnd);
  let moonIngressClock: string | undefined;
  let moonIngressJD: number | undefined;

  if (mSignStart !== mSignEnd) {
    // Moon transits to new sign today
    const targetSignDeg = mSignEnd * 30;
    // Bisection search
    let low = dayStartJD;
    let high = dayEndJD;
    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      const l = getMoonSiderealLongitude(mid, ayanamsaType);
      let diff = l - targetSignDeg;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (diff < 0) low = mid;
      else high = mid;
    }
    moonIngressJD = (low + high) / 2;
    moonIngressClock = formatClock(moonIngressJD, tz);
  }

  const sLonStart = getSunSiderealLongitude(dayStartJD, ayanamsaType);
  const sLonEnd = getSunSiderealLongitude(dayEndJD, ayanamsaType);
  const sSignStart = signIndex(sLonStart);
  const sSignEnd = signIndex(sLonEnd);
  let sunIngressClock: string | undefined;
  let sunIngressJD: number | undefined;

  if (sSignStart !== sSignEnd) {
    const targetSignDeg = sSignEnd * 30;
    let low = dayStartJD;
    let high = dayEndJD;
    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      const l = getSunSiderealLongitude(mid, ayanamsaType);
      let diff = l - targetSignDeg;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (diff < 0) low = mid;
      else high = mid;
    }
    sunIngressJD = (low + high) / 2;
    sunIngressClock = formatClock(sunIngressJD, tz);
  }

  const moonNoonLon = getMoonSiderealLongitude(noonJD, ayanamsaType);
  const sunNoonLon = getSunSiderealLongitude(noonJD, ayanamsaType);
  const mSignNoon = signIndex(moonNoonLon);
  const sSignNoon = signIndex(sunNoonLon);

  const moonRasi: DayRasiDetail = {
    body: "Moon",
    bodyTa: "சந்திரன்",
    currentSignIndex: mSignNoon,
    currentSignNameTa: SIGNS_TA[mSignNoon] ?? "ராசி",
    currentSignNameEn: SIGNS_EN[mSignNoon] ?? "Sign",
    longitude: moonNoonLon,
    formattedDMS: toDMS(moonNoonLon % 30),
    hasIngressToday: Boolean(moonIngressClock),
    nextSignIndex: moonIngressClock ? mSignEnd : undefined,
    nextSignNameTa: moonIngressClock ? SIGNS_TA[mSignEnd] : undefined,
    nextSignNameEn: moonIngressClock ? SIGNS_EN[mSignEnd] : undefined,
    ingressClock: moonIngressClock,
    ingressJD: moonIngressJD,
  };

  const sunRasi: DayRasiDetail = {
    body: "Sun",
    bodyTa: "சூரியன்",
    currentSignIndex: sSignNoon,
    currentSignNameTa: SIGNS_TA[sSignNoon] ?? "ராசி",
    currentSignNameEn: SIGNS_EN[sSignNoon] ?? "Sign",
    longitude: sunNoonLon,
    formattedDMS: toDMS(sunNoonLon % 30),
    hasIngressToday: Boolean(sunIngressClock),
    nextSignIndex: sunIngressClock ? sSignEnd : undefined,
    nextSignNameTa: sunIngressClock ? SIGNS_TA[sSignEnd] : undefined,
    nextSignNameEn: sunIngressClock ? SIGNS_EN[sSignEnd] : undefined,
    ingressClock: sunIngressClock,
    ingressJD: sunIngressJD,
  };

  // -------------------------------------------------------------
  // 5. MOON PHASE & ILLUMINATION
  // -------------------------------------------------------------
  const tNoon = timeFromJD(noonJD);
  const phaseDeg = MoonPhase(tNoon);
  const illum = Illumination(Body.Moon, tNoon);
  const illumPct = (illum.phase_fraction * 100).toFixed(1) + "%";

  let phaseNameTa = "வளர்பிறை";
  let phaseNameEn = "Waxing Crescent";
  let phaseCategory: MoonPhaseInfo["phaseCategory"] = "waxing_crescent";

  if (phaseDeg < 6 || phaseDeg > 354) {
    phaseNameTa = "அமாவாசை (புதிய நிலவு)";
    phaseNameEn = "New Moon (Amavasai)";
    phaseCategory = "new_moon";
  } else if (phaseDeg >= 6 && phaseDeg < 84) {
    phaseNameTa = "வளர்பிறை பிறை நிலவு";
    phaseNameEn = "Waxing Crescent";
    phaseCategory = "waxing_crescent";
  } else if (phaseDeg >= 84 && phaseDeg <= 96) {
    phaseNameTa = "வளர்பிறை அரை நிலவு (முதலாம் பாதம்)";
    phaseNameEn = "First Quarter";
    phaseCategory = "first_quarter";
  } else if (phaseDeg > 96 && phaseDeg < 174) {
    phaseNameTa = "வளர்பிறை முக்கால் நிலவு";
    phaseNameEn = "Waxing Gibbous";
    phaseCategory = "waxing_gibbous";
  } else if (phaseDeg >= 174 && phaseDeg <= 186) {
    phaseNameTa = "பௌர்ணமி (முழு நிலவு)";
    phaseNameEn = "Full Moon (Pournami)";
    phaseCategory = "full_moon";
  } else if (phaseDeg > 186 && phaseDeg < 264) {
    phaseNameTa = "தேய்பிறை முக்கால் நிலவு";
    phaseNameEn = "Waning Gibbous";
    phaseCategory = "waning_gibbous";
  } else if (phaseDeg >= 264 && phaseDeg <= 276) {
    phaseNameTa = "தேய்பிறை அரை நிலவு (மூன்றாம் பாதம்)";
    phaseNameEn = "Third Quarter";
    phaseCategory = "third_quarter";
  } else {
    phaseNameTa = "தேய்பிறை பிறை நிலவு";
    phaseNameEn = "Waning Crescent";
    phaseCategory = "waning_crescent";
  }

  const moonPhase: MoonPhaseInfo = {
    phaseDegrees: phaseDeg,
    illuminationFraction: illum.phase_fraction,
    illuminationPercent: illumPct,
    phaseNameTa,
    phaseNameEn,
    phaseCategory,
  };

  // -------------------------------------------------------------
  // 6. PLANETARY POSITIONS AT NOON
  // -------------------------------------------------------------
  const tropPlanets = computeTropicalPlanets(noonJD);
  const ayanamsaVal = getAyanamsa(noonJD, ayanamsaType);

  const bodiesList = [
    { id: "sun", nameTa: "சூரியன்", nameEn: "Sun", trop: tropPlanets.sun, speed: tropPlanets.velocities.sun, retro: false, combust: false },
    { id: "moon", nameTa: "சந்திரன்", nameEn: "Moon", trop: tropPlanets.moon, speed: tropPlanets.velocities.moon, retro: false, combust: tropPlanets.combust.moon },
    { id: "mars", nameTa: "செவ்வாய்", nameEn: "Mars", trop: tropPlanets.mars, speed: tropPlanets.velocities.mars, retro: tropPlanets.retrograde.mars, combust: tropPlanets.combust.mars },
    { id: "mercury", nameTa: "புதன்", nameEn: "Mercury", trop: tropPlanets.mercury, speed: tropPlanets.velocities.mercury, retro: tropPlanets.retrograde.mercury, combust: tropPlanets.combust.mercury },
    { id: "jupiter", nameTa: "குரு", nameEn: "Jupiter", trop: tropPlanets.jupiter, speed: tropPlanets.velocities.jupiter, retro: tropPlanets.retrograde.jupiter, combust: tropPlanets.combust.jupiter },
    { id: "venus", nameTa: "சுக்கிரன்", nameEn: "Venus", trop: tropPlanets.venus, speed: tropPlanets.velocities.venus, retro: tropPlanets.retrograde.venus, combust: tropPlanets.combust.venus },
    { id: "saturn", nameTa: "சனி", nameEn: "Saturn", trop: tropPlanets.saturn, speed: tropPlanets.velocities.saturn, retro: tropPlanets.retrograde.saturn, combust: tropPlanets.combust.saturn },
    { id: "rahu", nameTa: "ராகு", nameEn: "Rahu", trop: tropPlanets.rahu, speed: tropPlanets.velocities.rahu, retro: true, combust: false },
    { id: "ketu", nameTa: "கேது", nameEn: "Ketu", trop: tropPlanets.ketu, speed: tropPlanets.velocities.ketu, retro: true, combust: false },
  ];

  const planets: PlanetaryDayPosition[] = bodiesList.map((b) => {
    const siderealLon = normalize360(b.trop - ayanamsaVal);
    const sIdx = signIndex(siderealLon);
    const nak = nakshatraDetails(siderealLon);
    return {
      id: b.id,
      nameTa: b.nameTa,
      nameEn: b.nameEn,
      longitude: siderealLon,
      formattedDMS: toDMS(siderealLon % 30),
      signIndex: sIdx,
      signNameTa: SIGNS_TA[sIdx] ?? "ராசி",
      signNameEn: SIGNS_EN[sIdx] ?? "Sign",
      nakshatraIndex: nak.index,
      nakshatraNameTa: nak.nameTa,
      nakshatraNameEn: nak.nameEn,
      pada: nak.pada,
      speed: b.speed,
      retrograde: b.retro,
      combust: b.combust,
    };
  });

  // -------------------------------------------------------------
  // 7. MUHURTHA EVALUATION (WITH ACTIVE NAKSHATRA FOR VARJYAM)
  // -------------------------------------------------------------
  const activeNak = dayNakshatras[0] ?? { index: 0, startJD: dayStartJD, endJD: dayEndJD };
  const muhurtha = calculateMuhurthaSpans(
    sunTimes.sunriseJD,
    sunTimes.sunsetJD,
    weekday,
    tz,
    { index: activeNak.index, startJD: activeNak.startJD, endJD: activeNak.endJD }
  );

  // -------------------------------------------------------------
  // 8. FESTIVALS & OBSERVANCES (RULE-DRIVEN ENGINE)
  // -------------------------------------------------------------
  const sunriseTithiObj = dayTithis.find((t) => t.isSunriseTithi) ?? dayTithis[0]!;
  const sunriseNakObj = dayNakshatras.find((n) => n.isSunriseNakshatra) ?? dayNakshatras[0]!;

  const festivalCtx: DayFestivalContext = {
    year: input.year,
    month: input.month,
    day: input.day,
    weekday,
    tamilMonthIndex: tamilDate.monthIndex,
    tamilDay: tamilDate.day,
    tithiAtSunrise: sunriseTithiObj.index,
    tithisDuringDay: dayTithis.map((t) => t.index),
    nakshatraAtSunrise: sunriseNakObj.index,
    nakshatrasDuringDay: dayNakshatras.map((n) => n.index),
    moonPhaseDegrees: phaseDeg,
    sunRasi: sSignNoon,
    moonRasi: mSignNoon,
    isMonthFirstDay: Boolean(sunIngressClock) || tamilDate.day === 1,
  };

  const festivals = evaluateFestivalsForDay(festivalCtx);

  // -------------------------------------------------------------
  // 9. 24-HOUR VISUAL DAY TIMELINE EVENTS
  // -------------------------------------------------------------
  const rawTimeline: Array<TimelineEvent & { sortMinutes: number }> = [];

  // Sunrise
  const sRiseParsed = clockToFraction(formatClock(sunTimes.sunriseJD, tz));
  rawTimeline.push({
    timeClock: formatClock(sunTimes.sunriseJD, tz),
    hour: sRiseParsed.hour,
    minute: sRiseParsed.minute,
    fractionOfDay: sRiseParsed.fraction,
    titleTa: "சூரியோதயம்",
    titleEn: "Sunrise",
    descTa: "பகல்பொழுது ஆரம்பம் மற்றும் சூரிய உதய வேளை",
    descEn: "Astronomical sunrise with atmospheric refraction",
    type: "sunrise",
    nature: "auspicious",
    sortMinutes: sRiseParsed.hour * 60 + sRiseParsed.minute,
  });

  // Sunset
  const sSetParsed = clockToFraction(formatClock(sunTimes.sunsetJD, tz));
  rawTimeline.push({
    timeClock: formatClock(sunTimes.sunsetJD, tz),
    hour: sSetParsed.hour,
    minute: sSetParsed.minute,
    fractionOfDay: sSetParsed.fraction,
    titleTa: "சூரிய அஸ்தமனம்",
    titleEn: "Sunset",
    descTa: "சாயங்கால பிரதோஷ வேளை ஆரம்பம்",
    descEn: "Astronomical sunset and twilight",
    type: "sunset",
    nature: "neutral",
    sortMinutes: sSetParsed.hour * 60 + sSetParsed.minute,
  });

  // Moonrise if within today
  if (moonTimes.moonriseJD) {
    const mrClock = formatClock(moonTimes.moonriseJD, tz);
    const mrParsed = clockToFraction(mrClock);
    rawTimeline.push({
      timeClock: mrClock,
      hour: mrParsed.hour,
      minute: mrParsed.minute,
      fractionOfDay: mrParsed.fraction,
      titleTa: "சந்திர உதயம்",
      titleEn: "Moonrise",
      type: "moonrise",
      nature: "neutral",
      sortMinutes: mrParsed.hour * 60 + mrParsed.minute,
    });
  }

  // Moonset if within today
  if (moonTimes.moonsetJD) {
    const msClock = formatClock(moonTimes.moonsetJD, tz);
    const msParsed = clockToFraction(msClock);
    rawTimeline.push({
      timeClock: msClock,
      hour: msParsed.hour,
      minute: msParsed.minute,
      fractionOfDay: msParsed.fraction,
      titleTa: "சந்திர அஸ்தமனம்",
      titleEn: "Moonset",
      type: "moonset",
      nature: "neutral",
      sortMinutes: msParsed.hour * 60 + msParsed.minute,
    });
  }

  // Tithi transition
  if (dayTithis.length > 1 && dayTithis[1]) {
    const tTransClock = dayTithis[0]!.endClock;
    const p = clockToFraction(tTransClock);
    rawTimeline.push({
      timeClock: tTransClock,
      hour: p.hour,
      minute: p.minute,
      fractionOfDay: p.fraction,
      titleTa: `திதி மாற்றம்: ${dayTithis[0]!.nameTa} → ${dayTithis[1].nameTa}`,
      titleEn: `Tithi Change: ${dayTithis[0]!.nameEn} → ${dayTithis[1].nameEn}`,
      descTa: `திதி முடிவுற்று ${dayTithis[1].nameTa} ஆரம்பம்`,
      descEn: `Transition into ${dayTithis[1].nameEn}`,
      type: "tithi",
      nature: "neutral",
      sortMinutes: p.hour * 60 + p.minute,
    });
  }

  // Nakshatra transition
  if (dayNakshatras.length > 1 && dayNakshatras[1]) {
    const nTransClock = dayNakshatras[0]!.endClock;
    const p = clockToFraction(nTransClock);
    rawTimeline.push({
      timeClock: nTransClock,
      hour: p.hour,
      minute: p.minute,
      fractionOfDay: p.fraction,
      titleTa: `நட்சத்திர மாற்றம்: ${dayNakshatras[0]!.nameTa} → ${dayNakshatras[1].nameTa}`,
      titleEn: `Nakshatra Change: ${dayNakshatras[0]!.nameEn} → ${dayNakshatras[1].nameEn}`,
      descTa: `${dayNakshatras[0]!.nameTa} முடிந்து ${dayNakshatras[1].nameTa} பாதம் ${dayNakshatras[1].pada} ஆரம்பம்`,
      descEn: `Moon enters ${dayNakshatras[1].nameEn} (Pada ${dayNakshatras[1].pada})`,
      type: "nakshatra",
      nature: "neutral",
      sortMinutes: p.hour * 60 + p.minute,
    });
  }

  // Rahu Kalam
  const rStart = clockToFraction(muhurtha.rahuKalam.startClock);
  rawTimeline.push({
    timeClock: muhurtha.rahuKalam.startClock,
    hour: rStart.hour,
    minute: rStart.minute,
    fractionOfDay: rStart.fraction,
    titleTa: "ராகு காலம் ஆரம்பம்",
    titleEn: "Rahu Kalam Begins",
    descTa: `${muhurtha.rahuKalam.startClock} முதல் ${muhurtha.rahuKalam.endClock} வரை (சுப காரியங்களைத் தவிர்க்கவும்)`,
    descEn: `${muhurtha.rahuKalam.startClock} to ${muhurtha.rahuKalam.endClock} (Inauspicious window)`,
    type: "rahu",
    nature: "inauspicious",
    sortMinutes: rStart.hour * 60 + rStart.minute,
  });

  // Yamagandam
  const yStart = clockToFraction(muhurtha.yamagandam.startClock);
  rawTimeline.push({
    timeClock: muhurtha.yamagandam.startClock,
    hour: yStart.hour,
    minute: yStart.minute,
    fractionOfDay: yStart.fraction,
    titleTa: "எமகண்டம் ஆரம்பம்",
    titleEn: "Yamagandam Begins",
    descTa: `${muhurtha.yamagandam.startClock} முதல் ${muhurtha.yamagandam.endClock} வரை`,
    descEn: `${muhurtha.yamagandam.startClock} to ${muhurtha.yamagandam.endClock}`,
    type: "yama",
    nature: "inauspicious",
    sortMinutes: yStart.hour * 60 + yStart.minute,
  });

  // Abhijit Muhurtham
  const aStart = clockToFraction(muhurtha.abhijit.startClock);
  rawTimeline.push({
    timeClock: muhurtha.abhijit.startClock,
    hour: aStart.hour,
    minute: aStart.minute,
    fractionOfDay: aStart.fraction,
    titleTa: "அபிஜித் முகூர்த்தம்",
    titleEn: "Abhijit Muhurtham",
    descTa: `${muhurtha.abhijit.startClock} முதல் ${muhurtha.abhijit.endClock} வரை (சர்வ காரிய சித்தி)`,
    descEn: `${muhurtha.abhijit.startClock} to ${muhurtha.abhijit.endClock} (Highly auspicious midday span)`,
    type: "abhijit",
    nature: "auspicious",
    sortMinutes: aStart.hour * 60 + aStart.minute,
  });

  // Moon Ingress
  if (moonIngressClock) {
    const miParsed = clockToFraction(moonIngressClock);
    rawTimeline.push({
      timeClock: moonIngressClock,
      hour: miParsed.hour,
      minute: miParsed.minute,
      fractionOfDay: miParsed.fraction,
      titleTa: `சந்திர சஞ்சாரம்: ${moonRasi.nextSignNameTa} ராசி பிரவேசம்`,
      titleEn: `Moon Ingress into ${moonRasi.nextSignNameEn}`,
      descTa: `சந்திரன் ${moonRasi.nextSignNameTa} ராசிக்கு மாறுகிறார்`,
      descEn: `Moon transits into ${moonRasi.nextSignNameEn}`,
      type: "ingress",
      nature: "neutral",
      sortMinutes: miParsed.hour * 60 + miParsed.minute,
    });
  }

  // Sun Ingress
  if (sunIngressClock) {
    const siParsed = clockToFraction(sunIngressClock);
    rawTimeline.push({
      timeClock: sunIngressClock,
      hour: siParsed.hour,
      minute: siParsed.minute,
      fractionOfDay: siParsed.fraction,
      titleTa: `சூரிய சங்கிராந்தி: ${sunRasi.nextSignNameTa} மாதப் பிறப்பு`,
      titleEn: `Solar Ingress into ${sunRasi.nextSignNameEn} (Sankranti)`,
      descTa: `சூரியன் ${sunRasi.nextSignNameTa} ராசி பிரவேசம்`,
      descEn: `Sun enters sidereal sign ${sunRasi.nextSignNameEn}`,
      type: "ingress",
      nature: "auspicious",
      sortMinutes: siParsed.hour * 60 + siParsed.minute,
    });
  }

  rawTimeline.sort((a, b) => a.sortMinutes - b.sortMinutes);
  const timeline: TimelineEvent[] = rawTimeline.map(({ sortMinutes, ...rest }) => rest);

  // -------------------------------------------------------------
  // 10. COMPATIBLE EVENT PANCHANGAM AT SUNRISE
  // -------------------------------------------------------------
  const tithiInterval = getTithiInterval(sunTimes.sunriseJD, tz);
  const nakInterval = getNakshatraInterval(sunTimes.sunriseJD, tz, ayanamsaType);
  const yogaInterval = getYogaInterval(sunTimes.sunriseJD, tz, ayanamsaType);
  const karanaInterval = getKaranaInterval(sunTimes.sunriseJD, tz);

  return {
    date: dateStr,
    weekday,
    weekdayNameTa: WEEKDAYS_TA[weekday]!,
    weekdayNameEn: WEEKDAYS_EN[weekday]!,
    tamilDate,
    sunriseClock: formatClock(sunTimes.sunriseJD, tz),
    sunsetClock: formatClock(sunTimes.sunsetJD, tz),
    moonriseClock: moonTimes.moonriseJD ? formatClock(moonTimes.moonriseJD, tz) : "தெரியவில்லை",
    moonsetClock: moonTimes.moonsetJD ? formatClock(moonTimes.moonsetJD, tz) : "தெரியவில்லை",
    sunriseJD: sunTimes.sunriseJD,
    sunsetJD: sunTimes.sunsetJD,
    tithi: tithiInterval,
    nakshatra: nakInterval,
    yoga: yogaInterval,
    karana: karanaInterval,
    muhurtha,
    dayTithis,
    dayNakshatras,
    dayYogas,
    dayKaranas,
    moonRasi,
    sunRasi,
    moonPhase,
    planets,
    festivals,
    timeline,
    location: {
      name: placeName,
      lat,
      lon,
      tz,
    },
  };
}

/**
 * Calculates complete event-based Panchangam with transition intervals for any calendar date and place.
 * (Preserved for full backward compatibility)
 */
export function calculateEventPanchangam(input: {
  year: number;
  month: number;
  day: number;
  lat?: number;
  lon?: number;
  tz?: number;
  elevationMeters?: number;
  ayanamsaType?: "lahiri" | "thirukanitham";
}): EventPanchangam {
  return calculateComprehensiveDayDetails(input);
}
