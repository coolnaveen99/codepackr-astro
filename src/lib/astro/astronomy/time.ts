// Codepackr Astro — Time Scale & Julian Date Architecture
import { MakeTime, type AstroTime } from "astronomy-engine";

/**
 * Calculates Julian Day number from Gregorian calendar date and fractional UTC hour.
 * Standard algorithm (Meeus / IAU SOFA compliant).
 */
export function julianDay(year: number, month: number, day: number, hourUT: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

/** Converts Julian Day to astronomy-engine AstroTime instance */
export function timeFromJD(jd: number): AstroTime {
  const unix = (jd - 2440587.5) * 86400000;
  return MakeTime(new Date(unix));
}

/** Returns the current Julian Day number */
export function nowJD(): number {
  return Date.now() / 86400000 + 2440587.5;
}

/** Converts Julian Day to calendar components in a given timezone */
export function jdToCalendar(jd: number, tzHours: number = 0): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const z = jd + tzHours / 24;
  const J = z + 0.5;
  const Z = Math.floor(J);
  const F = J - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const dayFrac = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const day = Math.floor(dayFrac);
  const frac = dayFrac - day;
  const totalSeconds = Math.round(frac * 86400);
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;
  return { year, month, day, hour, minute, second };
}

/** Formats Julian Day into readable date-time string in target timezone */
export function formatJD(jd: number, tzHours: number = 0): string {
  const c = jdToCalendar(jd, tzHours);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(c.day)}-${pad(c.month)}-${c.year} ${pad(c.hour)}:${pad(c.minute)}`;
}

/** Formats Julian Day into HH:mm clock time string */
export function formatClock(jd: number | null | undefined, tzHours: number = 0): string {
  if (jd === null || jd === undefined || !Number.isFinite(jd)) return "--:--";
  const c = jdToCalendar(jd, tzHours);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(c.hour)}:${pad(c.minute)}`;
}

/** Converts Date object and timezone offset to Julian Day */
export function dateToJD(date: Date, tzHours: number = 0): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const h = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return julianDay(y, m, d, h + tzHours);
}

/** Resolves historical timezone with standard Indian standard time default (5.5) or lookup */
export function resolveTimezone(lat: number, lon: number, year: number): {
  timezone: string;
  utcOffsetHours: number;
  dst: boolean;
} {
  // India & Sri Lanka boundary check (68°E to 98°E, 6°N to 37°N)
  if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
    // Historical: IST (UTC+5:30) officially adopted Jan 1, 1906
    // War Time DST: UTC+6:30 between 1942 and 1945
    if (year >= 1942 && year <= 1945) {
      return { timezone: "Asia/Kolkata", utcOffsetHours: 6.5, dst: true };
    }
    return { timezone: "Asia/Kolkata", utcOffsetHours: 5.5, dst: false };
  }
  // Singapore (Asia/Singapore)
  if (lat >= 1.1 && lat <= 1.5 && lon >= 103.5 && lon <= 104.1) {
    // Singapore adopted UTC+8 in 1982; prior was UTC+7:30
    const offset = year >= 1982 ? 8.0 : 7.5;
    return { timezone: "Asia/Singapore", utcOffsetHours: offset, dst: false };
  }
  // Malaysia (Asia/Kuala_Lumpur)
  if (lat >= 1.0 && lat <= 7.5 && lon >= 99.5 && lon <= 120.0) {
    const offset = year >= 1982 ? 8.0 : 7.5;
    return { timezone: "Asia/Kuala_Lumpur", utcOffsetHours: offset, dst: false };
  }
  // Default estimate based on longitude: 15° per hour
  const approxOffset = Math.round((lon / 15) * 2) / 2;
  return { timezone: "UTC", utcOffsetHours: approxOffset, dst: false };
}
