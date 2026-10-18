// tests/year.test.ts
import { describe, it, expect } from "vitest";
import {
  TROPICAL_YEAR_DAYS,
  SIDEREAL_YEAR_DAYS,
  ANOMALISTIC_YEAR_DAYS,
  siderealYearsBetween,
  tropicalYearsBetween,
  addSiderealYears,
  addTropicalYears,
  siderealYearsSinceJ2000,
  tropicalYearsSinceJ2000,
  siderealTropicalDifferenceDays,
  impliedPrecessionArcsecPerYear,
  JD_J2000,
} from "../src/lib/astro/astronomy/year";

describe("Sidereal & Tropical Year", () => {
  it("exposes standard mean lengths", () => {
    expect(TROPICAL_YEAR_DAYS).toBeCloseTo(365.24219, 4);
    expect(SIDEREAL_YEAR_DAYS).toBeCloseTo(365.25636, 4);
    expect(ANOMALISTIC_YEAR_DAYS).toBeGreaterThan(SIDEREAL_YEAR_DAYS);
  });

  it("sidereal year is longer than tropical year", () => {
    expect(SIDEREAL_YEAR_DAYS).toBeGreaterThan(TROPICAL_YEAR_DAYS);
    expect(siderealTropicalDifferenceDays()).toBeCloseTo(0.01417, 4);
  });

  it("computes years between two JDs", () => {
    const jd1 = JD_J2000;
    const jd2 = JD_J2000 + SIDEREAL_YEAR_DAYS;
    expect(siderealYearsBetween(jd1, jd2)).toBeCloseTo(1, 6);
    expect(tropicalYearsBetween(jd1, jd2)).toBeGreaterThan(1);
  });

  it("adds sidereal and tropical years", () => {
    const base = JD_J2000;
    expect(addSiderealYears(base, 1)).toBeCloseTo(base + SIDEREAL_YEAR_DAYS, 6);
    expect(addTropicalYears(base, 1)).toBeCloseTo(base + TROPICAL_YEAR_DAYS, 6);
  });

  it("computes years since J2000", () => {
    expect(siderealYearsSinceJ2000(JD_J2000)).toBeCloseTo(0, 6);
    expect(tropicalYearsSinceJ2000(JD_J2000)).toBeCloseTo(0, 6);

    const jd26 = JD_J2000 + 26 * TROPICAL_YEAR_DAYS;
    expect(tropicalYearsSinceJ2000(jd26)).toBeCloseTo(26, 4);
  });

  it("implied precession is near the classical ~50.3″/yr", () => {
    const arcsec = impliedPrecessionArcsecPerYear();
    expect(arcsec).toBeGreaterThan(49);
    expect(arcsec).toBeLessThan(52);
  });
});
