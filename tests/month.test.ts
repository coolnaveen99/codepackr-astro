// tests/month.test.ts
import { describe, it, expect } from "vitest";
import {
  SIDEREAL_MONTH_DAYS,
  SYNODIC_MONTH_DAYS,
  TROPICAL_MONTH_DAYS,
  ANOMALISTIC_MONTH_DAYS,
  DRACONIC_MONTH_DAYS,
  siderealMonthsBetween,
  synodicMonthsBetween,
  tropicalMonthsBetween,
  addSiderealMonths,
  addSynodicMonths,
  siderealMonthsSinceJ2000,
  synodicMonthsSinceJ2000,
  synodicSiderealDifferenceDays,
  siderealMonthsPerSiderealYear,
} from "../src/lib/astro/astronomy/month";
import { JD_J2000 } from "../src/lib/astro/astronomy/year";

describe("Lunar Months", () => {
  it("exposes standard mean lengths", () => {
    expect(SIDEREAL_MONTH_DAYS).toBeCloseTo(27.32166, 4);
    expect(SYNODIC_MONTH_DAYS).toBeCloseTo(29.53059, 4);
    expect(TROPICAL_MONTH_DAYS).toBeCloseTo(27.32158, 4);
    expect(ANOMALISTIC_MONTH_DAYS).toBeGreaterThan(SIDEREAL_MONTH_DAYS);
    expect(DRACONIC_MONTH_DAYS).toBeLessThan(SIDEREAL_MONTH_DAYS);
  });

  it("synodic month is longer than sidereal month", () => {
    expect(SYNODIC_MONTH_DAYS).toBeGreaterThan(SIDEREAL_MONTH_DAYS);
    expect(synodicSiderealDifferenceDays()).toBeCloseTo(2.2089, 3);
  });

  it("computes months between two JDs", () => {
    const jd1 = JD_J2000;
    const jd2 = JD_J2000 + SIDEREAL_MONTH_DAYS;
    expect(siderealMonthsBetween(jd1, jd2)).toBeCloseTo(1, 6);

    const jd3 = JD_J2000 + SYNODIC_MONTH_DAYS;
    expect(synodicMonthsBetween(jd1, jd3)).toBeCloseTo(1, 6);
  });

  it("adds sidereal and synodic months", () => {
    const base = JD_J2000;
    expect(addSiderealMonths(base, 1)).toBeCloseTo(base + SIDEREAL_MONTH_DAYS, 6);
    expect(addSynodicMonths(base, 1)).toBeCloseTo(base + SYNODIC_MONTH_DAYS, 6);
  });

  it("computes months since J2000", () => {
    expect(siderealMonthsSinceJ2000(JD_J2000)).toBeCloseTo(0, 6);
    expect(synodicMonthsSinceJ2000(JD_J2000)).toBeCloseTo(0, 6);

    const jdOneSidereal = JD_J2000 + SIDEREAL_MONTH_DAYS;
    expect(siderealMonthsSinceJ2000(jdOneSidereal)).toBeCloseTo(1, 5);
  });

  it("tropical months between works", () => {
    const jd1 = JD_J2000;
    const jd2 = JD_J2000 + TROPICAL_MONTH_DAYS * 12;
    expect(tropicalMonthsBetween(jd1, jd2)).toBeCloseTo(12, 5);
  });

  it("sidereal months per sidereal year is ~13.37", () => {
    const count = siderealMonthsPerSiderealYear();
    expect(count).toBeGreaterThan(13.3);
    expect(count).toBeLessThan(13.4);
  });
});
