// src/lib/astro/astronomy/month.ts
/**
 * Lunar month constants and helpers.
 *
 * - Sidereal month: Moon returns to the same position relative to the fixed stars.
 * - Synodic month: Moon returns to the same phase (New Moon to New Moon).
 * - Tropical month: Moon returns to the same equinox-relative longitude.
 * - Anomalistic month: Moon returns to perigee.
 * - Draconic month: Moon returns to the same node.
 *
 * Values are mean lengths at J2000.0.
 */

import { JD_J2000 } from "./year";

/** Mean sidereal month in days. */
export const SIDEREAL_MONTH_DAYS = 27.321661547;

/** Mean synodic month in days. */
export const SYNODIC_MONTH_DAYS = 29.530588853;

/** Mean tropical month in days. */
export const TROPICAL_MONTH_DAYS = 27.321582241;

/** Mean anomalistic month in days. */
export const ANOMALISTIC_MONTH_DAYS = 27.554549878;

/** Mean draconic month in days. */
export const DRACONIC_MONTH_DAYS = 27.212220817;

/**
 * Number of sidereal months between two Julian Days.
 */
export function siderealMonthsBetween(jd1: number, jd2: number): number {
  return (jd2 - jd1) / SIDEREAL_MONTH_DAYS;
}

/**
 * Number of synodic months between two Julian Days.
 */
export function synodicMonthsBetween(jd1: number, jd2: number): number {
  return (jd2 - jd1) / SYNODIC_MONTH_DAYS;
}

/**
 * Number of tropical months between two Julian Days.
 */
export function tropicalMonthsBetween(jd1: number, jd2: number): number {
  return (jd2 - jd1) / TROPICAL_MONTH_DAYS;
}

/**
 * Add a fractional number of sidereal months to a Julian Day.
 */
export function addSiderealMonths(jd: number, months: number): number {
  return jd + months * SIDEREAL_MONTH_DAYS;
}

/**
 * Add a fractional number of synodic months to a Julian Day.
 */
export function addSynodicMonths(jd: number, months: number): number {
  return jd + months * SYNODIC_MONTH_DAYS;
}

/**
 * Sidereal months elapsed since J2000.0.
 */
export function siderealMonthsSinceJ2000(jd: number): number {
  return (jd - JD_J2000) / SIDEREAL_MONTH_DAYS;
}

/**
 * Synodic months elapsed since J2000.0.
 */
export function synodicMonthsSinceJ2000(jd: number): number {
  return (jd - JD_J2000) / SYNODIC_MONTH_DAYS;
}

/**
 * Difference between synodic and sidereal month lengths (days).
 * Positive value means the synodic month is longer.
 */
export function synodicSiderealDifferenceDays(): number {
  return SYNODIC_MONTH_DAYS - SIDEREAL_MONTH_DAYS;
}

/**
 * Approximate number of sidereal months in one sidereal year.
 * Useful for relating lunar and solar cycles.
 */
export function siderealMonthsPerSiderealYear(): number {
  // Imported lazily to avoid circular dependency at module load if needed
  const SIDEREAL_YEAR_DAYS = 365.256363004;
  return SIDEREAL_YEAR_DAYS / SIDEREAL_MONTH_DAYS;
}
