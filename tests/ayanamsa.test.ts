// tests/ayanamsa.test.ts
import { describe, it, expect } from "vitest";
import {
  ayanamsaLahiri,
  ayanamsaThirukanitham,
  ayanamsaRaman,
  ayanamsaKP,
  getAyanamsa,
} from "../src/lib/astro/astronomy/sidereal";
import { ayanamsaFor } from "../src/lib/astro/engine";
import type { School } from "../src/lib/astro/constants";

// J2000.0 = JD 2451545.0 (2000-01-01 12:00 TT)
const JD_J2000 = 2451545.0;
// Approximate JD for 2026-01-01 12:00 UTC
const JD_2026 = 2461041.0;

describe("Ayanamsa Profiles", () => {
  describe("Lahiri (Chitrapaksha)", () => {
    it("returns ~23.852° at J2000.0", () => {
      const aya = ayanamsaLahiri(JD_J2000);
      expect(aya).toBeCloseTo(23.852294, 5);
    });

    it("increases over time (precession)", () => {
      const aya2000 = ayanamsaLahiri(JD_J2000);
      const aya2026 = ayanamsaLahiri(JD_2026);
      expect(aya2026).toBeGreaterThan(aya2000);
      expect(aya2026 - aya2000).toBeGreaterThan(0.3); // ~0.36° in 26 years
    });
  });

  describe("Thirukanitham (Tamil)", () => {
    it("returns ~22.46° near 1900 epoch", () => {
      // JD 2415020.0 ≈ 1900-01-01
      const aya = ayanamsaThirukanitham(2415020.0);
      expect(aya).toBeCloseTo(22.460, 3);
    });

    it("produces finite values across epochs", () => {
      for (const jd of [2415020.0, JD_J2000, JD_2026]) {
        const thiru = ayanamsaThirukanitham(jd);
        expect(Number.isFinite(thiru)).toBe(true);
        expect(thiru).toBeGreaterThan(20);
        expect(thiru).toBeLessThan(26);
      }
    });
  });

  describe("Raman & KP", () => {
    it("Raman is smaller than Lahiri", () => {
      const raman = ayanamsaRaman(JD_2026);
      const lahiri = ayanamsaLahiri(JD_2026);
      expect(raman).toBeLessThan(lahiri);
      expect(lahiri - raman).toBeGreaterThan(1.0); // ~1.4°
    });

    it("KP is smaller than Lahiri", () => {
      const kp = ayanamsaKP(JD_2026);
      const lahiri = ayanamsaLahiri(JD_2026);
      expect(kp).toBeLessThan(lahiri);
      expect(lahiri - kp).toBeGreaterThan(0.1); // ~0.17°
    });
  });

  describe("getAyanamsa dispatcher", () => {
    it("routes to correct implementation", () => {
      expect(getAyanamsa(JD_J2000, "lahiri")).toBeCloseTo(ayanamsaLahiri(JD_J2000), 6);
      expect(getAyanamsa(JD_2026, "raman")).toBeCloseTo(ayanamsaRaman(JD_2026), 6);
      expect(getAyanamsa(JD_2026, "kp")).toBeCloseTo(ayanamsaKP(JD_2026), 6);
      expect(getAyanamsa(JD_2026, "thirukanitham")).toBeCloseTo(ayanamsaThirukanitham(JD_2026), 6);
    });

    it("defaults to Lahiri", () => {
      expect(getAyanamsa(JD_J2000)).toBeCloseTo(ayanamsaLahiri(JD_J2000), 6);
    });
  });

  describe("ayanamsaFor (engine integration)", () => {
    const schools: School[] = ["lahiri", "thirukanitham", "vakya", "kp", "raman"];

    it("returns finite positive values for all schools", () => {
      for (const school of schools) {
        const aya = ayanamsaFor(JD_2026, school);
        expect(Number.isFinite(aya)).toBe(true);
        expect(aya).toBeGreaterThan(20);
        expect(aya).toBeLessThan(30);
      }
    });

    it("lahiri path matches ayanamsaLahiri", () => {
      expect(ayanamsaFor(JD_2026, "lahiri")).toBeCloseTo(ayanamsaLahiri(JD_2026), 5);
    });

    it("kp path matches ayanamsaKP", () => {
      expect(ayanamsaFor(JD_2026, "kp")).toBeCloseTo(ayanamsaKP(JD_2026), 5);
    });

    it("raman path matches ayanamsaRaman", () => {
      expect(ayanamsaFor(JD_2026, "raman")).toBeCloseTo(ayanamsaRaman(JD_2026), 5);
    });

    it("thirukanitham and vakya share the same ayanamsa", () => {
      expect(ayanamsaFor(JD_2026, "thirukanitham")).toBeCloseTo(
        ayanamsaFor(JD_2026, "vakya"),
        6
      );
    });
  });
});
