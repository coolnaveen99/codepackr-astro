// Codepackr Astro — Muhurtha & Auspicious Timings Engine
import { formatClock } from "../astronomy/time";

export type TimingInterval = {
  name: string;
  nameTa: string;
  startJD: number;
  endJD: number;
  startClock: string;
  endClock: string;
  auspicious: boolean;
};

export type MuhurthaEvaluation = {
  rahuKalam: TimingInterval;
  yamagandam: TimingInterval;
  gulikai: TimingInterval;
  abhijit: TimingInterval;
  durmuhurtham: TimingInterval[];
  varjyam: TimingInterval[];
  amritaKalam: TimingInterval[];
  choghadiya: Array<{ name: string; nature: string; start: string; end: string; good: boolean }>;
  gowri: Array<{ name: string; good: boolean; start: string; end: string }>;
};

// Starting ghati of Varjyam (Tyajyam) for the 27 Nakshatras (Ashwini to Revati)
export const VARJYAM_START_GHATIS = [
  50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14, 56, 24, 20, 10, 10, 18, 16, 24, 30,
];

/**
 * Calculates Rahu Kalam, Yamagandam, Gulikai, Abhijit, Durmuhurtham, Varjyam, and Amrita Kalam.
 * Weekdays: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday.
 */
export function calculateMuhurthaSpans(
  sunriseJD: number | null,
  sunsetJD: number | null,
  weekday: number,
  tz: number = 5.5,
  activeNakshatra?: { index: number; startJD: number; endJD: number }
): MuhurthaEvaluation {
  if (sunriseJD === null || sunsetJD === null) {
    const emptySpan: TimingInterval = {
      name: "Unavailable",
      nameTa: "கிடைக்கவில்லை",
      startJD: 0,
      endJD: 0,
      startClock: "--:--",
      endClock: "--:--",
      auspicious: false,
    };
    return {
      rahuKalam: emptySpan,
      yamagandam: emptySpan,
      gulikai: emptySpan,
      abhijit: emptySpan,
      durmuhurtham: [],
      varjyam: [],
      amritaKalam: [],
      choghadiya: [],
      gowri: [],
    };
  }
  const daySpan = Math.max(0.2, sunsetJD - sunriseJD);
  const part = daySpan / 8;

  // 1-based part index (0 to 7) for 8 parts of the day
  // Rahu Kalam: Sun=8th(7), Mon=2nd(1), Tue=7th(6), Wed=5th(4), Thu=6th(5), Fri=4th(3), Sat=3rd(2)
  const rahuIdx = [7, 1, 6, 4, 5, 3, 2][weekday] ?? 2;
  // Yamagandam: Sun=5th(4), Mon=4th(3), Tue=3rd(2), Wed=2nd(1), Thu=1st(0), Fri=7th(6), Sat=6th(5)
  const yamaIdx = [4, 3, 2, 1, 0, 6, 5][weekday] ?? 0;
  // Gulikai: Sun=7th(6), Mon=6th(5), Tue=5th(4), Wed=4th(3), Thu=3rd(2), Fri=2nd(1), Sat=1st(0)
  const gulikaIdx = [6, 5, 4, 3, 2, 1, 0][weekday] ?? 0;

  const makeSpan = (i: number, name: string, nameTa: string, auspicious: boolean): TimingInterval => {
    const startJD = sunriseJD + i * part;
    const endJD = sunriseJD + (i + 1) * part;
    return {
      name,
      nameTa,
      startJD,
      endJD,
      startClock: formatClock(startJD, tz),
      endClock: formatClock(endJD, tz),
      auspicious,
    };
  };

  const rahu = makeSpan(rahuIdx, "Rahu Kalam", "ராகு காலம்", false);
  const yamagandam = makeSpan(yamaIdx, "Yamagandam", "எமகண்டம்", false);
  const gulikai = makeSpan(gulikaIdx, "Gulikai", "குளிகை", true);

  // Abhijit Muhurtha: spans around local solar noon
  const midNoon = sunriseJD + daySpan * 0.5;
  const abhijitHalf = daySpan / 30; // 24 minutes approx
  const abhijitStart = midNoon - abhijitHalf;
  const abhijitEnd = midNoon + abhijitHalf;
  const abhijit: TimingInterval = {
    name: "Abhijit Muhurtha",
    nameTa: "அபிஜித் முகூர்த்தம்",
    startJD: abhijitStart,
    endJD: abhijitEnd,
    startClock: formatClock(abhijitStart, tz),
    endClock: formatClock(abhijitEnd, tz),
    auspicious: true,
  };

  // Choghadiya sequences
  const choghDayNames = [
    ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
    ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"],
    ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"],
    ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"],
    ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"],
    ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"],
  ];
  const goodChogh = new Set(["Amrit", "Shubh", "Labh", "Char"]);
  const cSeq = choghDayNames[weekday] ?? choghDayNames[0]!;
  const choghadiya = cSeq.map((name, i) => {
    const s = sunriseJD + i * part;
    const e = sunriseJD + (i + 1) * part;
    return {
      name,
      nature: goodChogh.has(name) ? "good" : "inauspicious",
      start: formatClock(s, tz),
      end: formatClock(e, tz),
      good: goodChogh.has(name),
    };
  });

  // Gowri Panchangam sequences
  const gowriDay = [
    ["Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi"],
    ["Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi"],
    ["Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam"],
    ["Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam"],
    ["Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam"],
    ["Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam"],
    ["Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram"],
  ];
  const gowriGood = new Set(["Laabam", "Dhanam", "Sugam", "Uthi"]);
  const gSeq = gowriDay[weekday] ?? gowriDay[0]!;
  const gowri = gSeq.map((name, i) => {
    const s = sunriseJD + i * part;
    const e = sunriseJD + (i + 1) * part;
    return {
      name,
      good: gowriGood.has(name),
      start: formatClock(s, tz),
      end: formatClock(e, tz),
    };
  });

  // Durmuhurtham: 15 Muhurthas of the day (each = daySpan / 15)
  const muhurthaSpan = daySpan / 15;
  // Durmuhurtha 0-based index pairs by weekday (0=Sun to 6=Sat)
  const durIndicesByWeekday: number[][] = [
    [13],          // Sunday: 14th
    [7, 11],       // Monday: 8th and 12th
    [3, 10],       // Tuesday: 4th and 11th
    [7],           // Wednesday: 8th
    [5, 11],       // Thursday: 6th and 12th
    [3, 8],        // Friday: 4th and 9th
    [0, 1],        // Saturday: 1st and 2nd
  ];
  const durIndices = durIndicesByWeekday[weekday] ?? [13];
  const durmuhurtham: TimingInterval[] = durIndices.map((idx, i) => {
    const s = sunriseJD + idx * muhurthaSpan;
    const e = sunriseJD + (idx + 1) * muhurthaSpan;
    return {
      name: durIndices.length > 1 ? `Durmuhurtham ${i + 1}` : "Durmuhurtham",
      nameTa: durIndices.length > 1 ? `துர்முஹூர்த்தம் ${i + 1}` : "துர்முஹூர்த்தம்",
      startJD: s,
      endJD: e,
      startClock: formatClock(s, tz),
      endClock: formatClock(e, tz),
      auspicious: false,
    };
  });

  // Varjyam (Tyajyam) & Amrita Kalam
  const varjyamList: TimingInterval[] = [];
  const amritaList: TimingInterval[] = [];
  if (activeNakshatra && activeNakshatra.endJD > activeNakshatra.startJD) {
    const nakSpan = activeNakshatra.endJD - activeNakshatra.startJD;
    const ghatiSpan = nakSpan / 60; // 1 ghati = 1/60th of nakshatra duration
    const startGhati = VARJYAM_START_GHATIS[activeNakshatra.index % 27] ?? 30;
    const vStartJD = activeNakshatra.startJD + startGhati * ghatiSpan;
    const vEndJD = vStartJD + 4 * ghatiSpan; // 4 ghatis duration

    varjyamList.push({
      name: "Varjyam",
      nameTa: "வர்ஜியம்",
      startJD: vStartJD,
      endJD: vEndJD,
      startClock: formatClock(vStartJD, tz),
      endClock: formatClock(vEndJD, tz),
      auspicious: false,
    });

    const aStartJD = vStartJD + 14 * ghatiSpan; // 14 ghatis after Varjyam start
    const aEndJD = aStartJD + 4 * ghatiSpan;
    amritaList.push({
      name: "Amrita Kalam",
      nameTa: "அமிர்த காலம்",
      startJD: aStartJD,
      endJD: aEndJD,
      startClock: formatClock(aStartJD, tz),
      endClock: formatClock(aEndJD, tz),
      auspicious: true,
    });
  } else {
    // Fallback based on sunrise if nakshatra span not provided
    const vStart = sunriseJD + 0.35 * daySpan;
    const vEnd = vStart + 0.06 * daySpan;
    varjyamList.push({
      name: "Varjyam",
      nameTa: "வர்ஜியம்",
      startJD: vStart,
      endJD: vEnd,
      startClock: formatClock(vStart, tz),
      endClock: formatClock(vEnd, tz),
      auspicious: false,
    });

    const aStart = sunriseJD + 0.65 * daySpan;
    const aEnd = aStart + 0.06 * daySpan;
    amritaList.push({
      name: "Amrita Kalam",
      nameTa: "அமிர்த காலம்",
      startJD: aStart,
      endJD: aEnd,
      startClock: formatClock(aStart, tz),
      endClock: formatClock(aEnd, tz),
      auspicious: true,
    });
  }

  return {
    rahuKalam: rahu,
    yamagandam,
    gulikai,
    abhijit,
    durmuhurtham,
    varjyam: varjyamList,
    amritaKalam: amritaList,
    choghadiya,
    gowri,
  };
}
