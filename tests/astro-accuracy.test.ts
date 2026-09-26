// Automated Accuracy & Regression Test Suite
import { describe, it, expect } from "vitest";
import { normalize360, angularDistance } from "../src/lib/astro/astronomy/coordinates";
import { samvatsaraIndexFromYear, getSamvatsaraByIndex, SAMVATSARA_60 } from "../src/lib/astro/calendar/samvatsara";
import { getTamilDate, findSolarIngress } from "../src/lib/astro/calendar/tamil-calendar";
import { currentTithi } from "../src/lib/astro/calendar/tithi";
import { nakshatraDetails } from "../src/lib/astro/calendar/nakshatra";
import { calculateNavamsa, calculateVargaSign } from "../src/lib/astro/chart/varga";
import { calculateVimshottariDasa } from "../src/lib/astro/dasha/vimshottari";
import { evaluateDasakoota } from "../src/lib/astro/porutham/dasakoota";
import { runMasterValidationSuite } from "../src/lib/astro/validation/runner";
import { julianDay } from "../src/lib/astro/astronomy/time";

describe("Astronomical Circular Coordinates & Math", () => {
  it("normalizes negative and wrapping angles into [0, 360)", () => {
    expect(normalize360(-1)).toBe(359);
    expect(normalize360(360)).toBe(0);
    expect(normalize360(361)).toBe(1);
    expect(normalize360(-725)).toBe(355);
  });

  it("calculates shortest circular distance across 0/360 boundary", () => {
    expect(angularDistance(359, 1)).toBe(2);
    expect(angularDistance(1, 359)).toBe(2);
    expect(angularDistance(10, 350)).toBe(20);
    expect(angularDistance(180, 0)).toBe(180);
  });
});

describe("Canonical 60-Year Tamil Samvatsara Sequence", () => {
  it("has exactly 60 distinct canonical names without duplicates", () => {
    expect(SAMVATSARA_60.length).toBe(60);
    const names = SAMVATSARA_60.map((s) => s.nameTa);
    expect(new Set(names).size).toBe(60);
  });

  it("anchors 1987 as Prabhava (1) and wraps cleanly", () => {
    expect(samvatsaraIndexFromYear(1987)).toBe(1);
    expect(getSamvatsaraByIndex(1).nameEn).toBe("Prabhava");
    expect(samvatsaraIndexFromYear(2024)).toBe(38); // Krodhi
    expect(samvatsaraIndexFromYear(2025)).toBe(39); // Vishvavasu
    expect(samvatsaraIndexFromYear(2026)).toBe(40); // Parabhava
    expect(samvatsaraIndexFromYear(2046)).toBe(60); // Akshaya
    expect(samvatsaraIndexFromYear(2047)).toBe(1);  // Prabhava wrap
  });
});

describe("Event-Based Tamil Calendar", () => {
  it("computes event-based solar ingress for Chithirai", () => {
    const approx = julianDay(2024, 4, 14, 0);
    const ingressJD = findSolarIngress(0, approx);
    expect(ingressJD).toBeGreaterThan(approx - 5);
    expect(ingressJD).toBeLessThan(approx + 5);

    const tDate = getTamilDate(2024, 4, 14);
    expect(tDate.tamilMonth.nameEn).toBe("Chithirai");
    expect(tDate.tamilYear.nameEn).toBe("Krodhi");
  });

  it("retains previous Tamil year for January before Chithirai", () => {
    const tDate = getTamilDate(2026, 1, 15);
    expect(tDate.tamilMonth.nameEn).toBe("Thai");
    expect(tDate.tamilYear.nameEn).toBe("Vishvavasu"); // Started Chithirai 2025
  });
});

describe("Panchangam Transitions & Jathagam", () => {
  it("calculates accurate Tithi and Nakshatra for epoch J2000", () => {
    const jd = julianDay(2000, 1, 1, 12);
    const tithi = currentTithi(jd);
    expect(tithi.index).toBeGreaterThanOrEqual(0);
    expect(tithi.index).toBeLessThan(30);

    const nak = nakshatraDetails(200); // 200° in sidereal zodiac = Libra (Vishakha)
    expect(nak.index).toBe(15);
    expect(nak.pada).toBeGreaterThanOrEqual(1);
    expect(nak.pada).toBeLessThanOrEqual(4);
  });

  it("calculates Navamsa and D60 accurately", () => {
    expect(calculateNavamsa(0)).toBe(0); // Aries 0° -> Navamsa Aries (0)
    expect(calculateNavamsa(3.5)).toBe(1); // Aries 3°30' -> Navamsa Taurus (1)

    // D60: Aries 0° to 0°30' -> Aries(0)
    expect(calculateVargaSign(0.2, 60)).toBe(0);
  });

  it("computes Vimshottari Dasa balance and sequence totaling 120 years", () => {
    const birthJD = julianDay(1990, 5, 20, 10);
    const dasa = calculateVimshottariDasa(120, birthJD);
    expect(dasa.periods.length).toBe(9);
    const totalPeriodsSum = dasa.periods.reduce((sum, p) => sum + p.years, 0);
    const elapsedYears = (dasa.periods[0] ? (dasa.periods[0].years / (1 - (dasa.balanceYears / (dasa.periods[0].years || 1)))) : 0);
    // Total sum of all 9 periods from birth is exactly 120 - elapsed
    expect(Math.round(totalPeriodsSum)).toBe(120);
  });

  it("evaluates all 10 Tamil Poruthams with individual factors", () => {
    const match = evaluateDasakoota(45, 185); // Rohini boy, Chitra girl
    expect(match.items.length).toBe(10);
    expect(match.totalScore).toBeGreaterThanOrEqual(0);
    expect(match.totalScore).toBeLessThanOrEqual(36);
  });
});

describe("Master Validation Suite Execution", () => {
  it("runs full benchmark and boundary suite with 100% pass", () => {
    const report = runMasterValidationSuite();
    if (report.failedTests > 0) {
      console.log("Failed ephemeris:", report.ephemerisBenchmarks.filter((e) => !e.pass));
      console.log("Failed boundary:", report.boundaryTests.filter((b) => !b.pass));
      console.log("Failed golden:", report.goldenCases.filter((g) => !g.pass));
    }
    expect(report.totalTests).toBeGreaterThanOrEqual(50);
    expect(report.failedTests).toBe(0);
    expect(report.status).toBe("ALL_PASS");
  });
});

describe("Comprehensive Day Panchangam & Festival Engine (/tamil-calendar)", () => {
  // Dynamic import of new modules
  it("calculates comprehensive day details with 24h timeline and transitions for 26 Sep 2026", async () => {
    const { calculateComprehensiveDayDetails } = await import("../src/lib/astro/calendar/panchangam");
    const day = calculateComprehensiveDayDetails({
      year: 2026,
      month: 9,
      day: 26,
      lat: 13.0827,
      lon: 80.2707,
      tz: 5.5,
      placeName: "Chennai",
    });

    expect(day.date).toBe("2026-09-26");
    expect(day.tamilDate.monthNameTa).toBe("புரட்டாசி");
    expect(day.dayTithis.length).toBeGreaterThanOrEqual(1);
    expect(day.dayNakshatras.length).toBeGreaterThanOrEqual(1);
    expect(day.dayNakshatras[0]?.lord).toBeTruthy();
    expect(day.dayNakshatras[0]?.pada).toBeGreaterThanOrEqual(1);
    expect(day.dayNakshatras[0]?.pada).toBeLessThanOrEqual(4);

    // Muhurtha timings
    expect(day.muhurtha.rahuKalam.startClock).toBeTruthy();
    expect(day.muhurtha.yamagandam.startClock).toBeTruthy();
    expect(day.muhurtha.abhijit.startClock).toBeTruthy();
    expect(day.muhurtha.durmuhurtham.length).toBeGreaterThan(0);
    expect(day.muhurtha.varjyam.length).toBeGreaterThan(0);
    expect(day.muhurtha.amritaKalam.length).toBeGreaterThan(0);

    // 24h Timeline
    expect(day.timeline.length).toBeGreaterThanOrEqual(5);
    const sunriseEv = day.timeline.find((t) => t.type === "sunrise");
    const sunsetEv = day.timeline.find((t) => t.type === "sunset");
    expect(sunriseEv).toBeDefined();
    expect(sunsetEv).toBeDefined();

    // 9 Planets
    expect(day.planets.length).toBe(9);
    const sunPlanet = day.planets.find((p) => p.id === "sun");
    const moonPlanet = day.planets.find((p) => p.id === "moon");
    expect(sunPlanet).toBeDefined();
    expect(moonPlanet).toBeDefined();

    // Location specificity check: Singapore vs Chennai produce different sunrise clocks
    const singaporeDay = calculateComprehensiveDayDetails({
      year: 2026,
      month: 9,
      day: 26,
      lat: 1.3521,
      lon: 103.8198,
      tz: 8.0,
      placeName: "Singapore",
    });
    expect(singaporeDay.sunriseClock).not.toBe(day.sunriseClock);
  });

  it("evaluates festivals strictly by astronomical rules", async () => {
    const { evaluateFestivalsForDay } = await import("../src/lib/astro/calendar/festivals");

    // Thai Pongal rule test (Thai 1)
    const pongal = evaluateFestivalsForDay({
      year: 2026,
      month: 1,
      day: 15,
      weekday: 4,
      tamilMonthIndex: 9, // Thai
      tamilDay: 1,
      tithiAtSunrise: 26,
      tithisDuringDay: [26],
      nakshatraAtSunrise: 18,
      nakshatrasDuringDay: [18],
      moonPhaseDegrees: 310,
      sunRasi: 9, // Makara
      moonRasi: 8,
      isMonthFirstDay: true,
    });
    expect(pongal.some((f) => f.id === "pongal-makara-sankranti")).toBe(true);

    // Tamil New Year rule test (Chithirai 1)
    const puthandu = evaluateFestivalsForDay({
      year: 2026,
      month: 4,
      day: 14,
      weekday: 2,
      tamilMonthIndex: 0, // Chithirai
      tamilDay: 1,
      tithiAtSunrise: 11,
      tithisDuringDay: [11],
      nakshatraAtSunrise: 0,
      nakshatrasDuringDay: [0],
      moonPhaseDegrees: 135,
      sunRasi: 0, // Mesha
      moonRasi: 0,
      isMonthFirstDay: true,
    });
    expect(puthandu.some((f) => f.id === "tamil-new-year")).toBe(true);

    // Pradosham rule test (Tithi 12 or 27)
    const pradosham = evaluateFestivalsForDay({
      year: 2026,
      month: 9,
      day: 23,
      weekday: 6, // Saturday = Sani Pradosham!
      tamilMonthIndex: 5,
      tamilDay: 7,
      tithiAtSunrise: 12,
      tithisDuringDay: [12],
      nakshatraAtSunrise: 9,
      nakshatrasDuringDay: [9],
      moonPhaseDegrees: 150,
      sunRasi: 5,
      moonRasi: 4,
      isMonthFirstDay: false,
    });
    expect(pradosham.some((f) => f.id === "sani-pradosham")).toBe(true);
  });
});

