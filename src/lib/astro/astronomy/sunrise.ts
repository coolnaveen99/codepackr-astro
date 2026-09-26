// Codepackr Astro — Sunrise, Sunset, Moonrise & Moonset Engine
import { Body, MakeTime, Observer, SearchRiseSet, type AstroTime } from "astronomy-engine";
import { julianDay, timeFromJD } from "./time";

export type SunTimesResult = {
  sunriseJD: number;
  sunsetJD: number;
  nextSunriseJD: number;
  daySpanFraction: number;
  nightSpanFraction: number;
  status: "exact" | "unavailable";
};

export type MoonTimesResult = {
  moonriseJD: number | null;
  moonsetJD: number | null;
  status: "exact" | "unavailable";
};

/**
 * Calculates exact astronomical sunrise and sunset for a given geographic observer.
 * Incorporates standard atmospheric refraction (34 arcminutes) and solar semi-diameter (16 arcminutes).
 */
export function calculateSunTimes(
  year: number,
  month: number,
  day: number,
  lat: number,
  lon: number,
  tz: number,
  elevationMeters: number = 0
): SunTimesResult {
  const utcMidnight = Date.UTC(year, month - 1, day, 0, 0, 0) - tz * 3600000;
  const start = MakeTime(new Date(utcMidnight));
  const observer = new Observer(lat, lon, elevationMeters);

  // Search forward for sunrise
  const rise = SearchRiseSet(Body.Sun, observer, +1, start, 1.2);

  // Search backwards/forwards around local solar midday for sunset
  const midday = MakeTime(new Date(utcMidnight + 12 * 3600000));
  const set = SearchRiseSet(Body.Sun, observer, -1, midday, 1.0);

  if (!rise || !set) {
    // Polar regions or extreme latitudes where sun may not rise/set
    const fallbackRise = julianDay(year, month, day, 6 - tz);
    const fallbackSet = julianDay(year, month, day, 18 - tz);
    return {
      sunriseJD: fallbackRise,
      sunsetJD: fallbackSet,
      nextSunriseJD: fallbackRise + 1,
      daySpanFraction: 0.5,
      nightSpanFraction: 0.5,
      status: "unavailable",
    };
  }

  const sunriseJD = rise.ut + 2451545.0;
  const sunsetJD = set.ut + 2451545.0;

  // Search for the subsequent sunrise to compute exact sunrise-to-sunrise span
  const nextSearchStart = timeFromJD(sunsetJD + 1 / 1440);
  const nextRise = SearchRiseSet(Body.Sun, observer, +1, nextSearchStart, 1.5);
  const nextSunriseJD = nextRise ? nextRise.ut + 2451545.0 : sunriseJD + 1.0;

  const daySpan = Math.max(0.1, sunsetJD - sunriseJD);
  const nightSpan = Math.max(0.1, nextSunriseJD - sunsetJD);

  return {
    sunriseJD,
    sunsetJD,
    nextSunriseJD,
    daySpanFraction: daySpan,
    nightSpanFraction: nightSpan,
    status: "exact",
  };
}

/**
 * Calculates Moonrise and Moonset for a given geographic observer on the target date.
 */
export function calculateMoonTimes(
  year: number,
  month: number,
  day: number,
  lat: number,
  lon: number,
  tz: number,
  elevationMeters: number = 0
): MoonTimesResult {
  const utcMidnight = Date.UTC(year, month - 1, day, 0, 0, 0) - tz * 3600000;
  const start = MakeTime(new Date(utcMidnight));
  const observer = new Observer(lat, lon, elevationMeters);

  const rise = SearchRiseSet(Body.Moon, observer, +1, start, 1.2);
  const set = SearchRiseSet(Body.Moon, observer, -1, start, 1.2);

  return {
    moonriseJD: rise ? rise.ut + 2451545.0 : null,
    moonsetJD: set ? set.ut + 2451545.0 : null,
    status: rise && set ? "exact" : "unavailable",
  };
}
