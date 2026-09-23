// Codepackr Astro - Chandrashtama (சந்திராஷ்டம) Astronomical Engine
// Section 1A of docs/codepackr-astro-tamil-astrology-roadmap.md
import {
  julianDay,
  siderealGrahas,
  nakshatra,
  signIndex,
  sunTimes,
  norm360,
} from "./engine";
import {
  SIGNS_TA,
  SIGNS_EN,
  NAK_TA,
  NAK_EN,
  type School,
} from "./constants";

export interface ChandrashtamaPeriod {
  /** Moon entrance into the 8th rasi (Julian Day) */
  startJD: number;
  /** Moon departure from the 8th rasi (Julian Day) */
  endJD: number;
  /** Formatted start date & time (Local) */
  startTimeStr: string;
  /** Formatted end date & time (Local) */
  endTimeStr: string;
  /** The 8th rasi index (0-11) */
  chandrashtamaRasiIdx: number;
  chandrashtamaRasiTa: string;
  chandrashtamaRasiEn: string;
  /** Target sign under Chandrashtamam */
  janmaRasiIdx: number;
  janmaRasiTa: string;
  janmaRasiEn: string;
  /** Duration in hours */
  durationHours: number;
}

export interface CurrentMoonTransit {
  jd: number;
  moonLon: number;
  moonRasiIdx: number;
  moonRasiTa: string;
  moonRasiEn: string;
  moonNakIdx: number;
  moonNakPada: number;
  moonNakTa: string;
  moonNakEn: string;
  /** Is this transit currently causing Chandrashtamam for the given Janma Rasi? */
  isChandrashtamaNow: boolean;
  /** The Janma Rasi that currently experiences Chandrashtamam (Moon in 8th from it) */
  activeChandrashtamaForRasiIdx: number;
  activeChandrashtamaForRasiTa: string;
  activeChandrashtamaForRasiEn: string;
}

export interface ChandrashtamaResult {
  janmaRasiIdx: number;
  janmaRasiTa: string;
  janmaRasiEn: string;
  chandrashtamaRasiIdx: number;
  chandrashtamaRasiTa: string;
  chandrashtamaRasiEn: string;
  school: School;
  currentTransit: CurrentMoonTransit;
  /** Active period if currently experiencing Chandrashtamam, or null */
  currentPeriod: ChandrashtamaPeriod | null;
  /** Upcoming Chandrashtama periods within the next 60 days */
  upcomingPeriods: ChandrashtamaPeriod[];
  /** Pariharam / Traditional Advisory */
  remediesTa: string[];
  remediesEn: string[];
  guidelinesTa: string[];
  guidelinesEn: string[];
}

function formatJD(jd: number, tz: number): string {
  // Convert Julian Day to Local Date/Time
  // JDN 0 = Jan 1, 4713 BC 12:00 UT
  const z = Math.floor(jd + 0.5 + tz / 24);
  const f = jd + 0.5 + tz / 24 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  const totalMinutes = Math.round(f * 24 * 60);
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${pad(day)} ${monthsEn[month - 1]} ${year}, ${pad(displayHour)}:${pad(minute)} ${ampm}`;
}

/**
 * Finds the exact transition Julian Day when the Moon crosses from sign (targetRasi)
 * using a binary search (bisection) with 1-minute precision.
 */
function findMoonIngress(
  startJD: number,
  endJD: number,
  targetRasi: number,
  school: School,
  findEntry: boolean // true = entering targetRasi, false = exiting targetRasi
): number {
  let low = startJD;
  let high = endJD;

  for (let iter = 0; iter < 24; iter++) {
    const mid = (low + high) / 2;
    const grahas = siderealGrahas(mid, school);
    const rasi = signIndex(grahas.bodies.moon);

    if (findEntry) {
      if (rasi === targetRasi) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (rasi === targetRasi) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }
  return (low + high) / 2;
}

/**
 * Calculates Chandrashtama for a given Janma Rasi (0-11) starting around targetDate.
 */
export function calculateChandrashtama(
  janmaRasiIdx: number,
  refDate: { year: number; month: number; day: number; hour?: number; minute?: number },
  tz: number = 5.5,
  school: School = "thirukanitham"
): ChandrashtamaResult {
  const chandraRasiIdx = (janmaRasiIdx + 7) % 12; // 8th house from Janma Rasi
  const hour = refDate.hour ?? 12;
  const minute = refDate.minute ?? 0;
  const currentJD = julianDay(refDate.year, refDate.month, refDate.day, hour + minute / 60 - tz);

  // Current Moon position
  const currentGrahas = siderealGrahas(currentJD, school);
  const curMoonLon = currentGrahas.bodies.moon;
  const curMoonRasi = signIndex(curMoonLon);
  const curMoonNak = nakshatra(curMoonLon);

  // Which sign has Chandrashtamam right now?
  // Moon in sign X is the 8th house for sign (X - 7 + 12) % 12
  const activeChandrashtamaForRasi = (curMoonRasi - 7 + 12) % 12;

  const isChandrashtamaNow = curMoonRasi === chandraRasiIdx;

  const currentTransit: CurrentMoonTransit = {
    jd: currentJD,
    moonLon: curMoonLon,
    moonRasiIdx: curMoonRasi,
    moonRasiTa: SIGNS_TA[curMoonRasi],
    moonRasiEn: SIGNS_EN[curMoonRasi],
    moonNakIdx: curMoonNak.idx,
    moonNakPada: curMoonNak.pada,
    moonNakTa: NAK_TA[curMoonNak.idx],
    moonNakEn: NAK_EN[curMoonNak.idx],
    isChandrashtamaNow,
    activeChandrashtamaForRasiIdx: activeChandrashtamaForRasi,
    activeChandrashtamaForRasiTa: SIGNS_TA[activeChandrashtamaForRasi],
    activeChandrashtamaForRasiEn: SIGNS_EN[activeChandrashtamaForRasi],
  };

  // Search for Chandrashtama periods in a window: 3 days before currentJD up to 60 days ahead
  const scanStartJD = currentJD - 3.0;
  const scanEndJD = currentJD + 60.0;
  const step = 0.25; // 6 hours step for initial detection

  const periods: ChandrashtamaPeriod[] = [];
  let inPeriod = false;
  let periodStart = 0;

  for (let t = scanStartJD; t <= scanEndJD; t += step) {
    const g = siderealGrahas(t, school);
    const rasi = signIndex(g.bodies.moon);

    if (rasi === chandraRasiIdx && !inPeriod) {
      // Transitioned INTO 8th house
      const exactStart = findMoonIngress(t - step, t, chandraRasiIdx, school, true);
      periodStart = exactStart;
      inPeriod = true;
    } else if (rasi !== chandraRasiIdx && inPeriod) {
      // Transitioned OUT OF 8th house
      const exactEnd = findMoonIngress(t - step, t, chandraRasiIdx, school, false);
      inPeriod = false;
      const durHours = Math.round((exactEnd - periodStart) * 24 * 10) / 10;
      periods.push({
        startJD: periodStart,
        endJD: exactEnd,
        startTimeStr: formatJD(periodStart, tz),
        endTimeStr: formatJD(exactEnd, tz),
        chandrashtamaRasiIdx: chandraRasiIdx,
        chandrashtamaRasiTa: SIGNS_TA[chandraRasiIdx],
        chandrashtamaRasiEn: SIGNS_EN[chandraRasiIdx],
        janmaRasiIdx,
        janmaRasiTa: SIGNS_TA[janmaRasiIdx],
        janmaRasiEn: SIGNS_EN[janmaRasiIdx],
        durationHours: durHours,
      });
    }
  }

  // Identify current period
  let currentPeriod: ChandrashtamaPeriod | null = null;
  const upcomingPeriods: ChandrashtamaPeriod[] = [];

  for (const p of periods) {
    if (currentJD >= p.startJD && currentJD <= p.endJD) {
      currentPeriod = p;
    } else if (p.endJD >= currentJD) {
      upcomingPeriods.push(p);
    }
  }

  const remediesTa = [
    "ஸ்ரீ விநாயகர் வழிபாடு: காரியத் தடைகள் நீங்க அருகம்புல் சாற்றி விநாயகரை வழிபடவும்.",
    "ஸ்ரீ சந்திரமௌலீஸ்வரர் வழிபாடு: திங்கட்கிழமை அல்லது சந்திராஷ்டம நாளில் சிவபெருமானுக்கு பால் அபிஷேகம் அல்லது வில்வ அர்ச்சனை நன்று.",
    "சந்திர காயத்ரி மந்திரம் ஜெபித்தல்: 'ஓம் பத்மத்வஜாய வித்மஹே ஹேமரூபாய தீமஹி தன்னோ சோமஃ ப்ரசோதயாத்'.",
    "மன அமைதிக்கான தியானம் மற்றும் மிதமான உணவை உட்கொள்ளுதல் நன்று.",
  ];

  const remediesEn = [
    "Lord Ganesha Worship: Offer Arugampul (Bermuda grass) and prayers to remove unforeseen hurdles.",
    "Lord Shiva / Chandramouleeshwara Worship: Milk abhishekam or Bilva archana brings mental calmness.",
    "Chandra Gayatri Mantra: Recite 'Om Padmadhwajaya Vidmahe Hemaroopaya Dheemahi Tanno Somah Prachodayat'.",
    "Meditation & Calm Routine: Maintain tranquility, avoid unnecessary emotional stress.",
  ];

  const guidelinesTa = [
    "புதிய பெரிய முதலீடுகள், சொத்து வாங்குதல் அல்லது ஒப்பந்தங்களில் கையெழுத்திடுவதைத் தவிர்க்கலாம்.",
    "நெடும் பயணங்களில் அதிக கவனம் மற்றும் வாகன ஓட்டுதலில் நிதானம் தேவை.",
    "குடும்பம் மற்றும் அலுவலகத்தில் வாக்குவாதங்கள், கோப உணர்வுகளைத் தவிர்ப்பது மன அமைதி தரும்.",
    "மருத்துவ பரிசோதனைகள் மற்றும் பொதுவான அன்றாட பணிகளை வழக்கம் போல் செய்யலாம் (முற்றிலும் முடங்க வேண்டியதில்லை).",
  ];

  const guidelinesEn = [
    "Postpone heavy financial speculations, major investments, or contract signings if possible.",
    "Exercise extra vigilance during long-distance travels and driving.",
    "Avoid confrontations, heated debates, and impulsive emotional reactions.",
    "Routine work, examinations, and medical procedures can proceed normally with mindfulness.",
  ];

  return {
    janmaRasiIdx,
    janmaRasiTa: SIGNS_TA[janmaRasiIdx],
    janmaRasiEn: SIGNS_EN[janmaRasiIdx],
    chandrashtamaRasiIdx: chandraRasiIdx,
    chandrashtamaRasiTa: SIGNS_TA[chandraRasiIdx],
    chandrashtamaRasiEn: SIGNS_EN[chandraRasiIdx],
    school,
    currentTransit,
    currentPeriod,
    upcomingPeriods,
    remediesTa,
    remediesEn,
    guidelinesTa,
    guidelinesEn,
  };
}
