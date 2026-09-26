// Codepackr Astro - Nazhigai (நாழிகை - மணி) Classical Tamil Time Converter
// Section 1E of docs/codepackr-astro-tamil-astrology-roadmap.md
import { sunTimes } from "./engine";

export interface ModernTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TamilTime {
  nazhigai: number;
  vinadi: number;
  tharparai: number;
}

export interface SunriseRelativeResult {
  sunriseTimeStr: string;
  sunsetTimeStr: string;
  targetTimeStr: string;
  isDaytime: boolean;
  /** Nazhigai and Vinadi elapsed from true local sunrise */
  elapsedFromSunrise: TamilTime;
  /** Decimal Nazhigai */
  decimalNazhigai: number;
  /** Total elapsed hours from sunrise */
  elapsedHours: number;
  /** In which Yaamam / Saamam does this fall? (1-4 for Day, 1-4 for Night) */
  yaamamNumber: number;
  yaamamLabelTa: string;
  yaamamLabelEn: string;
  traditionalDescriptionTa: string;
  traditionalDescriptionEn: string;
}

/**
 * Standard conversions:
 * 1 Day (நாள்) = 24 Hours = 1440 Minutes = 86400 Seconds = 60 Nazhigai
 * 1 Nazhigai (நாழிகை) = 24 Minutes = 1440 Seconds = 60 Vinadi
 * 1 Vinadi (விநாடி / விநாழிகை) = 24 Seconds = 60 Tharparai
 * 1 Tharparai (தற்பரை) = 0.4 Seconds
 */

export const SECONDS_PER_NAZHIGAI = 1440; // 24 * 60
export const SECONDS_PER_VINADI = 24;
export const SECONDS_PER_THARPARAI = 0.4;

/**
 * Converts modern elapsed time (hours, minutes, seconds) to Nazhigai, Vinadi, Tharparai
 */
export function timeToNazhigai(hours: number, minutes: number = 0, seconds: number = 0): TamilTime {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const nazhigai = Math.floor(totalSeconds / SECONDS_PER_NAZHIGAI);
  const rem1 = totalSeconds % SECONDS_PER_NAZHIGAI;
  const vinadi = Math.floor(rem1 / SECONDS_PER_VINADI);
  const rem2 = rem1 % SECONDS_PER_VINADI;
  const tharparai = Math.round(rem2 / SECONDS_PER_THARPARAI);

  return { nazhigai, vinadi, tharparai };
}

/**
 * Converts Tamil Nazhigai, Vinadi, Tharparai to modern time (Hours, Minutes, Seconds)
 */
export function nazhigaiToTime(nazhigai: number, vinadi: number = 0, tharparai: number = 0): ModernTime {
  const totalSeconds = nazhigai * SECONDS_PER_NAZHIGAI + vinadi * SECONDS_PER_VINADI + tharparai * SECONDS_PER_THARPARAI;
  const hours = Math.floor(totalSeconds / 3600);
  const rem1 = totalSeconds % 3600;
  const minutes = Math.floor(rem1 / 60);
  const seconds = Math.round(rem1 % 60);

  return { hours, minutes, seconds };
}

/**
 * Calculates traditional Nazhigai elapsed since Sunrise for a given date, time, and location.
 */
export function computeSunriseRelativeNazhigai(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number = 13.0827,
  lon: number = 80.2707,
  tz: number = 5.5
): SunriseRelativeResult {
  const ss = sunTimes(year, month, day, lat, lon, tz);
  if (ss.sunriseJD === null || ss.sunsetJD === null) {
    throw new Error("Astronomical sunrise cannot be calculated for the given date and coordinates (e.g. polar regions).");
  }

  // Convert sunrise JD to fractional hours in local time
  const sunriseHoursLocal = ((ss.sunriseJD + tz / 24 + 0.5) % 1) * 24;
  const sunsetHoursLocal = ((ss.sunsetJD + tz / 24 + 0.5) % 1) * 24;

  const targetHours = hour + minute / 60;

  let elapsedHours = targetHours - sunriseHoursLocal;
  if (elapsedHours < 0) {
    // Before sunrise -> belongs to previous night (from yesterday's sunrise)
    elapsedHours += 24;
  }

  const isDaytime = targetHours >= sunriseHoursLocal && targetHours <= sunsetHoursLocal;

  const elapsedSeconds = elapsedHours * 3600;
  const decimalNazhigai = Math.round((elapsedHours / 0.4) * 100) / 100; // 1 hr = 2.5 nazhigai, 1 nazhigai = 0.4 hr

  const nazhigai = Math.floor(elapsedSeconds / SECONDS_PER_NAZHIGAI);
  const rem1 = elapsedSeconds % SECONDS_PER_NAZHIGAI;
  const vinadi = Math.floor(rem1 / SECONDS_PER_VINADI);
  const rem2 = rem1 % SECONDS_PER_VINADI;
  const tharparai = Math.round(rem2 / SECONDS_PER_THARPARAI);

  // Yaamam calculation (1 Yaamam = 7.5 Nazhigai = 3 hours)
  const yaamamIndex = Math.min(8, Math.floor(nazhigai / 7.5) + 1);
  const isNightYaamam = !isDaytime;
  const yaamamNumber = isNightYaamam ? ((yaamamIndex - 5 + 4) % 4) + 1 : yaamamIndex;

  const yaamamLabelTa = isDaytime
    ? `பகல் ${yaamamNumber}-ஆம் சாமம் (ஜாமம்)`
    : `இரவு ${yaamamNumber}-ஆம் சாமம் (ஜாமம்)`;

  const yaamamLabelEn = isDaytime
    ? `Daytime Saamam ${yaamamNumber} (Yaamam)`
    : `Nighttime Saamam ${yaamamNumber} (Yaamam)`;

  const formatClock = (hrs: number) => {
    const h = Math.floor(hrs) % 24;
    const m = Math.floor((hrs - Math.floor(hrs)) * 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const dh = h % 12 === 0 ? 12 : h % 12;
    return `${pad(dh)}:${pad(m)} ${ampm}`;
  };

  const traditionalDescriptionTa = `சூரியோதயம் முதல் ${nazhigai} நாழிகை ${vinadi} விநாடி (${isDaytime ? "பகல் பிறப்பு" : "இரவுப் பிறப்பு"}).`;
  const traditionalDescriptionEn = `${nazhigai} Nazhigai and ${vinadi} Vinadi elapsed from local sunrise (${isDaytime ? "Day birth" : "Night birth"}).`;

  return {
    sunriseTimeStr: formatClock(sunriseHoursLocal),
    sunsetTimeStr: formatClock(sunsetHoursLocal),
    targetTimeStr: formatClock(targetHours),
    isDaytime,
    elapsedFromSunrise: { nazhigai, vinadi, tharparai },
    decimalNazhigai,
    elapsedHours: Math.round(elapsedHours * 100) / 100,
    yaamamNumber,
    yaamamLabelTa,
    yaamamLabelEn,
    traditionalDescriptionTa,
    traditionalDescriptionEn,
  };
}
