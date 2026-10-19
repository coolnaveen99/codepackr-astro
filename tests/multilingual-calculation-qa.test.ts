import { describe, expect, it } from "vitest";
import { ASTRO_LOCALES, REGIONAL_PRESETS, type SupportedLocale } from "../src/lib/astro/locales/multi-lang";
import { getUI, ui as basicUI } from "../src/lib/astro/experimental/ui-strings";
import { calculateAyanamsa, getKpSubLordDetails } from "../src/lib/astro/astronomy/ayanamsa-models";
import { normalize360 } from "../src/lib/astro/astronomy/coordinates";
import { calculateNavamsa, calculateVargaSign, VARGA_DEFINITIONS } from "../src/lib/astro/chart/varga";
import { currentTithi } from "../src/lib/astro/calendar/tithi";
import { julianDay } from "../src/lib/astro/astronomy/time";
import { evaluateDasakoota } from "../src/lib/astro/porutham/dasakoota";
import { calculateAshtakoota } from "../src/lib/astro/porutham/ashtakoota";
import { compute, type BirthInput } from "../src/lib/astro/engine";

const NON_TAMIL_ENGLISH: SupportedLocale[] = ["hi", "te", "kn", "ml"];
const ALL_LOCALES: SupportedLocale[] = ["ta", "en", ...NON_TAMIL_ENGLISH];

describe("Non-Tamil / non-English locale completeness (hi, te, kn, ml)", () => {
  it.each(NON_TAMIL_ENGLISH)("provides native core labels and correct region defaults for %s", (locale) => {
    expect(ASTRO_LOCALES[locale].appTitle.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].horoscope.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].matchmaking.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].panchangam.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].planets.Sun.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].planets.Moon.trim()).not.toBe("");
    expect(ASTRO_LOCALES[locale].rasis).toHaveLength(12);
    expect(REGIONAL_PRESETS[locale].locale).toBe(locale);
    expect(["NORTH", "SOUTH"]).toContain(REGIONAL_PRESETS[locale].defaultChartStyle);
    expect(["ASHTAKOOTA_36", "DASAKOOTA_10"]).toContain(REGIONAL_PRESETS[locale].defaultMatchSystem);
  });

  it.each(NON_TAMIL_ENGLISH)("renders non-Tamil basic UI using the selected locale: %s", (locale) => {
    const labels = getUI(locale);
    expect(labels.tools).not.toBe(basicUI.ta.tools);
    expect(labels.jathagam).not.toBe(basicUI.ta.jathagam);
    expect(labels.panchangam).not.toBe(basicUI.ta.panchangam);
    expect(labels.search).not.toBe(basicUI.ta.search);
  });

  it("normalizes locale tags and safely falls back to English for unknown locales", () => {
    expect(getUI("te-IN").panchangam).toBe(basicUI.te.panchangam);
    expect(getUI("kn_IN").tools).toBe(basicUI.kn.tools);
    expect(getUI("xx").search).toBe(basicUI.en.search);
  });

  it("has matching locale and regional preset keys", () => {
    expect(Object.keys(ASTRO_LOCALES).sort()).toEqual([...ALL_LOCALES].sort());
    expect(Object.keys(REGIONAL_PRESETS).sort()).toEqual([...ALL_LOCALES].sort());
  });
});

describe("New calculation-method regression coverage", () => {
  const jd = julianDay(2026, 1, 1, 12);
  it.each(["LAHIRI", "KP_NEW", "BV_RAMAN", "YUKTESHWAR", "TRUE_PUSHYA"] as const)("returns a finite, bounded ayanamsa result for %s", (mode) => {
    const value = calculateAyanamsa(jd, mode);
    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThan(20);
    expect(value).toBeLessThan(27);
  });

  it("preserves stable ordering of ayanamsa values where model offsets define it", () => {
    const lahiri = calculateAyanamsa(jd, "LAHIRI");
    expect(calculateAyanamsa(jd, "KP_NEW")).toBeLessThan(lahiri);
    expect(calculateAyanamsa(jd, "BV_RAMAN")).toBeLessThan(calculateAyanamsa(jd, "KP_NEW"));
    expect(calculateAyanamsa(jd, "TRUE_PUSHYA")).toBeGreaterThan(lahiri);
  });

  it("keeps KP position fields valid at zodiac boundaries", () => {
    for (const longitude of [-720, -0.00001, 0, 13.333333, 359.99999, 720]) {
      const detail = getKpSubLordDetails(longitude);
      expect(detail.longitude).toBeGreaterThanOrEqual(0);
      expect(detail.longitude).toBeLessThan(360);
      expect(detail.rasiIndex).toBeGreaterThanOrEqual(0);
      expect(detail.rasiIndex).toBeLessThan(12);
      expect(detail.nakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(detail.nakshatraIndex).toBeLessThan(27);
      expect(detail.pada).toBeGreaterThanOrEqual(1);
      expect(detail.pada).toBeLessThanOrEqual(4);
      expect(detail.signLord).toBeTruthy();
      expect(detail.starLord).toBeTruthy();
      expect(detail.subLord).toBeTruthy();
      expect(detail.subSubLord).toBeTruthy();
    }
  });

  it("calculates normalized longitude and supported divisional charts without invalid sign indices", () => {
    expect(normalize360(-1)).toBe(359);
    expect(normalize360(360)).toBe(0);
    for (const division of [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60]) {
      expect(VARGA_DEFINITIONS[division]).toBeDefined();
      for (const longitude of [0, 29.999999, 30, 179.999999, 359.999999]) {
        const sign = division === 9 ? calculateNavamsa(longitude) : calculateVargaSign(longitude, division);
        expect(sign).toBeGreaterThanOrEqual(0);
        expect(sign).toBeLessThan(12);
      }
    }
  });

  it("keeps tithi index and paksha valid for representative dates", () => {
    for (const date of [[2000, 1, 1, 12], [2024, 4, 14, 0], [2026, 10, 19, 12]] as const) {
      const tithi = currentTithi(julianDay(...date));
      expect(tithi.index).toBeGreaterThanOrEqual(0);
      expect(tithi.index).toBeLessThan(30);
      expect(["shukla", "krishna"]).toContain(tithi.paksha);
      expect(tithi.nameEn).toBeTruthy();
      expect(tithi.nameTa).toBeTruthy();
    }
  });

  it("evaluates compatibility results with structurally valid factor lists", () => {
    const dasa = evaluateDasakoota(45, 185);
    expect(dasa.items).toHaveLength(10);
    for (const item of dasa.items) {
      expect(item.id).toBeTruthy();
      expect(item.nameEn).toBeTruthy();
      expect(item.nameTa).toBeTruthy();
      expect(item.points).toBeGreaterThanOrEqual(0);
      expect(item.points).toBeLessThanOrEqual(item.maxPoints);
    }
    const ashta = calculateAshtakoota(45, 185);
    expect(ashta.kootas.length).toBe(8);
    expect(ashta.maxPoints).toBe(36);
    expect(ashta.totalPoints).toBeGreaterThanOrEqual(0);
    expect(ashta.totalPoints).toBeLessThanOrEqual(36);
    for (const item of ashta.kootas) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.obtainedPoints).toBeGreaterThanOrEqual(0);
      expect(item.obtainedPoints).toBeLessThanOrEqual(item.maxPoints);
    }
  });

  it("computes a chart with a supported non-default ayanamsa without non-finite longitudes", () => {
    const input: BirthInput = {
      name: "QA Sample", sex: "M", year: 1990, month: 5, day: 20,
      hour: 10, minute: 30, tz: 5.5, lat: 13.0827, lon: 80.2707,
      place: "Chennai", school: "lahiri", ayanamsaMode: "YUKTESHWAR",
    };
    const chart = compute(input);
    expect(chart).toBeTruthy();
    expect(chart.planets.length).toBeGreaterThanOrEqual(7);
    for (const planet of chart.planets) {
      expect(Number.isFinite(planet.lon)).toBe(true);
      expect(planet.lon).toBeGreaterThanOrEqual(0);
      expect(planet.lon).toBeLessThan(360);
    }
  });
});


describe("Locale edge cases and translation completeness", () => {
  it.each(NON_TAMIL_ENGLISH)("has non-empty native text across all core strings for %s", (locale) => {
    const strings = ASTRO_LOCALES[locale];
    for (const [key, value] of Object.entries(strings)) {
      if (key === "planets") {
        for (const planetName of Object.values(value as Record<string, string>)) {
          expect(planetName.trim(), `${locale}.planets value`).not.toBe("");
        }
      } else if (key === "rasis") {
        expect(value as string[]).toHaveLength(12);
        for (const rasi of value as string[]) expect(rasi.trim()).not.toBe("");
      } else {
        expect(typeof value).toBe("string");
        expect((value as string).trim(), `${locale}.${key}`).not.toBe("");
      }
    }
  });

  it("normalizes uppercase, regional, underscore, empty and unsupported locale input", () => {
    expect(getUI("HI").panchangam).toBe(basicUI.hi.panchangam);
    expect(getUI("te-IN").panchangam).toBe(basicUI.te.panchangam);
    expect(getUI("kn_IN").tools).toBe(basicUI.kn.tools);
    expect(getUI("").search).toBe(basicUI.en.search);
    expect(getUI("xx-YY").search).toBe(basicUI.en.search);
  });

  it("keeps documented model offsets distinct and stable", () => {
    const lahiri = calculateAyanamsa(jd, "LAHIRI");
    expect(calculateAyanamsa(jd, "KP_NEW")).toBeCloseTo(lahiri - 0.101389, 6);
    expect(calculateAyanamsa(jd, "BV_RAMAN")).toBeCloseTo(lahiri - 1.443889, 6);
    expect(calculateAyanamsa(jd, "YUKTESHWAR")).toBeCloseTo(lahiri - 1.382778, 6);
    expect(calculateAyanamsa(jd, "TRUE_PUSHYA")).toBeCloseTo(lahiri + 0.061111, 6);
  });

  it("returns finite, valid KP fields for every zodiac sign and nakshatra boundary", () => {
    const nakshatraSpan = 360 / 27;
    const boundaries = [
      ...Array.from({ length: 13 }, (_, i) => i * 30),
      ...Array.from({ length: 28 }, (_, i) => i * nakshatraSpan),
    ];
    for (const boundary of boundaries) {
      for (const longitude of [boundary - 1e-7, boundary, boundary + 1e-7]) {
        const detail = getKpSubLordDetails(longitude);
        expect(Number.isFinite(detail.longitude)).toBe(true);
        expect(detail.rasiIndex).toBe(Math.floor(detail.longitude / 30));
        expect(detail.nakshatraIndex).toBeGreaterThanOrEqual(0);
        expect(detail.nakshatraIndex).toBeLessThan(27);
        expect(detail.pada).toBeGreaterThanOrEqual(1);
        expect(detail.pada).toBeLessThanOrEqual(4);
        expect(detail.signLord).toBeTruthy();
        expect(detail.starLord).toBeTruthy();
        expect(detail.subLord).toBeTruthy();
        expect(detail.subSubLord).toBeTruthy();
      }
    }
  });
});
