// Codepackr Astro — Birth-Time Sensitivity Engine
import { julianDay } from "../astronomy/time";
import { calculateLagna } from "../chart/lagna";
import { calculateNavamsa, calculateVargaSign } from "../chart/varga";
import { getMoonSiderealLongitude } from "../calendar/nakshatra";
import { calculateVimshottariDasa } from "./vimshottari";
import { SIGN_NAMES_TA } from "../chart/houses";
import type { BirthTimeQuality, BirthTimeSensitivity } from "../types";

/**
 * Analyzes the sensitivity of a horoscope to birth-time uncertainty.
 * Tests shifts of -5 minutes, current, and +5 minutes (and +/- 10 minutes) on:
 * - Lagna (Ascendant)
 * - Navamsa (D9)
 * - Dasamsa (D10)
 * - Shashtiamsa (D60)
 * - Vimshottari Dasa balance at birth
 */
export function analyzeBirthTimeSensitivity(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  tz: number;
  lat: number;
  lon: number;
  quality?: BirthTimeQuality;
}): BirthTimeSensitivity {
  const quality = input.quality ?? "exact";
  const hourUT = input.hour + input.minute / 60 - input.tz;
  const jdBase = julianDay(input.year, input.month, input.day, hourUT);

  const getSnapshot = (minuteOffset: number) => {
    const jdShift = jdBase + minuteOffset / 1440.0;
    const lagna = calculateLagna(jdShift, input.lat, input.lon, "lahiri");
    const moonLon = getMoonSiderealLongitude(jdShift, "lahiri");
    const d9 = calculateNavamsa(lagna.siderealDegrees);
    const d10 = calculateVargaSign(lagna.siderealDegrees, 10);
    const d60 = calculateVargaSign(lagna.siderealDegrees, 60);
    const dasa = calculateVimshottariDasa(moonLon, jdShift);
    return {
      lagnaSign: lagna.sign,
      d9Sign: d9,
      d10Sign: d10,
      d60Sign: d60,
      dasaBalanceYears: dasa.balanceYears,
    };
  };

  const current = getSnapshot(0);
  const minus5 = getSnapshot(-5);
  const plus5 = getSnapshot(5);

  const lagnaStable = current.lagnaSign === minus5.lagnaSign && current.lagnaSign === plus5.lagnaSign;
  const navamsaStable = current.d9Sign === minus5.d9Sign && current.d9Sign === plus5.d9Sign;
  const d60Stable = current.d60Sign === minus5.d60Sign && current.d60Sign === plus5.d60Sign;

  const dasaShiftDays = Math.round(
    Math.abs(minus5.dasaBalanceYears - plus5.dasaBalanceYears) * 365.25
  );

  let overallRating: "stable" | "moderately_sensitive" | "highly_sensitive" = "stable";
  if (!lagnaStable) {
    overallRating = "highly_sensitive";
  } else if (!navamsaStable) {
    overallRating = "moderately_sensitive";
  } else if (!d60Stable) {
    overallRating = quality === "approximate" ? "moderately_sensitive" : "stable";
  }

  let summaryTa = "பிறப்பு நேர வரம்பில் லக்னம் மற்றும் நவாம்சம் நிலையாக உள்ளன.";
  let summaryEn = "Lagna and Navamsa are stable within the ±5 minute birth time window.";

  if (!lagnaStable) {
    summaryTa = "எச்சரிக்கை: ±5 நிமிடங்களில் லக்னம் மாறக்கூடும். துல்லியமான பிறப்பு நேரம் தேவை.";
    summaryEn = "Warning: Lagna changes within ±5 minutes. Precise birth time is recommended.";
  } else if (!navamsaStable) {
    summaryTa = "கவனம்: ±5 நிமிடங்களில் நவாம்சம் (D9) மாறக்கூடும். திருமண பலன்களில் அவதானம் தேவை.";
    summaryEn = "Caution: Navamsa (D9) changes within ±5 minutes. Marriage interpretations require care.";
  } else if (!d60Stable && quality === "approximate") {
    summaryTa = "சஷ்டியாம்சம் (D60) மிக நுண்ணிய மாறுதலுக்குரியது; தோராயமான நேரத்தில் இதை முழுமையாக நம்பலாகாது.";
    summaryEn = "Shashtiamsa (D60) is highly sensitive; avoid deep karmic conclusions on approximate birth time.";
  }

  const signName = (s: number) => SIGN_NAMES_TA[s] ?? "ராசி";

  return {
    quality,
    overallRating,
    summaryTa,
    summaryEn,
    lagnaStable,
    navamsaStable,
    d60Stable,
    dasaBalanceShiftDays: dasaShiftDays,
    lagnaAtMinus5: signName(minus5.lagnaSign),
    lagnaAtCurrent: signName(current.lagnaSign),
    lagnaAtPlus5: signName(plus5.lagnaSign),
    navamsaAtMinus5: signName(minus5.d9Sign),
    navamsaAtCurrent: signName(current.d9Sign),
    navamsaAtPlus5: signName(plus5.d9Sign),
    d60AtMinus5: signName(minus5.d60Sign),
    d60AtCurrent: signName(current.d60Sign),
    d60AtPlus5: signName(plus5.d60Sign),
  };
}
