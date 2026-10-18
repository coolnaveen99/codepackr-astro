// src/lib/astro/astronomy/year.ts
/**
 * Sidereal and tropical year constants and helpers.
 *
 * Sidereal year: time for the Sun to return to the same position relative to the fixed stars.
 * Tropical year: time for the Sun to return to the same equinox (basis of the civil calendar).
 *
 * Values are mean lengths at J2000.0 (IAU / astronomical standards).
 */

/** Mean tropical year length in days (J2000.0). */
export const TROPICAL_YEAR_DAYS = 365.2421897;

/** Mean sidereal year length in days (J2000.0). */
export const SIDEREAL_YEAR_DAYS = 365.256363004;

/** Mean anomalistic year length in days (J2000.0). */
export const ANOMALISTIC_YEAR_DAYS = 365.259635864;

/** Julian century in days. */
export const JULIAN_CENTURY_DAYS = 36525.0;

/** J2000.0 epoch as Julian Day. */
export const JD_J2000 = 2451545.0;

/**
 * Number of sidereal years between two Julian Days.
 * Positive when jd2 > jd1.
 */
export function siderealYearsBetween(jd1: number, jd2: number): number {
  return (jd2 - jd1) / SIDEREAL_YEAR_DAYS;
}

/**
 * Number of tropical years between two Julian Days.
 */
export function tropicalYearsBetween(jd1: number, jd2: number): number {
  return (jd2 - jd1) / TROPICAL_YEAR_DAYS;
}

/**
 * Add a fractional number of sidereal years to a Julian Day.
 */
export function addSiderealYears(jd: number, years: number): number {
  return jd + years * SIDEREAL_YEAR_DAYS;
}

/**
 * Add a fractional number of tropical years to a Julian Day.
 */
export function addTropicalYears(jd: number, years: number): number {
  return jd + years * TROPICAL_YEAR_DAYS;
}

/**
 * Sidereal years elapsed since J2000.0.
 */
export function siderealYearsSinceJ2000(jd: number): number {
  return (jd - JD_J2000) / SIDEREAL_YEAR_DAYS;
}

/**
 * Tropical years elapsed since J2000.0.
 */
export function tropicalYearsSinceJ2000(jd: number): number {
  return (jd - JD_J2000) / TROPICAL_YEAR_DAYS;
}

/**
 * Difference between sidereal and tropical year lengths (days).
 * Positive value means the sidereal year is longer.
 */
export function siderealTropicalDifferenceDays(): number {
  return SIDEREAL_YEAR_DAYS - TROPICAL_YEAR_DAYS;
}

/**
 * Approximate precession rate implied by the year-length difference (arcseconds per year).
 * Derived from 360° / tropical_year − 360° / sidereal_year, converted to arcseconds.
 */
export function impliedPrecessionArcsecPerYear(): number {
  // Degrees the equinox moves per sidereal year, converted to arcseconds
  const tropicalDegPerDay = 360 / TROPICAL_YEAR_DAYS;
  const siderealDegPerDay = 360 / SIDEREAL_YEAR_DAYS;
  const degPerSiderealYear = (tropicalDegPerDay - siderealDegPerDay) * SIDEREAL_YEAR_DAYS;
  return degPerSiderealYear * 3600;
}
