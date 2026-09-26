// Codepackr Astro — Route Regression, Location Validation & Ephemeris Foundation Tests
import { describe, it, expect } from "vitest";
import { resolvePageFromUrl, PAGE_PATHS, PAGE_SET, getPageUrl } from "../src/lib/nav";
import { ASTRO_TOOLS, TOOL_CATEGORIES, filterTools } from "../src/lib/tools/astro-tools";
import { compute, type BirthInput } from "../src/lib/astro/engine";
import { calculateSunTimes } from "../src/lib/astro/astronomy/sunrise";
import { PRODUCTION_PROFILE } from "../src/lib/astro/provenance/profile";
import { ASTRO_EPHEMERIS_SOURCE } from "../src/lib/astro/provenance/version";
import { generateHorizonForecast } from "../src/lib/astro/prediction/horizons";
import { searchCities, mergeCityLists } from "../src/lib/astro/place-search";
import { POPULAR_CITIES } from "../src/lib/astro/samples";
import { parseReportModeFromUrl } from "../src/components/jathagam-dashboard";
import { resolveIanaTimezone, resolveHistoricalUtcOffset } from "../src/lib/astro/astronomy/timezone";
import { calculateComprehensiveDayDetails } from "../src/lib/astro/calendar/panchangam";
import { requirePanchangamLocation } from "../src/lib/astro/calendar/panchangam-location";

describe("Routing & Information Architecture (Sections 32, 33, 41, 50, 76)", () => {
  it("maps home to '/' and jathagam to '/jathagam'", () => {
    expect(PAGE_PATHS.home).toBe("/");
    expect(PAGE_PATHS.jathagam).toBe("/jathagam");
    expect(getPageUrl("home")).toBe("/");
    expect(getPageUrl("jathagam")).toBe("/jathagam");
  });

  it("contains all required routes in PAGE_SET", () => {
    const requiredRoutes = ["home","jathagam","tamil-calendar","panchangam","forecast","porutham","gochara","rasipalan","chandrashtama","nakshatra","babynames","numerology","prasna","nazhigai","biodata","calculation-method"];
    for (const r of requiredRoutes) expect(PAGE_SET.has(r)).toBe(true);
  });

  it("maps panchangam to canonical /tamil-calendar route", () => {
    expect(PAGE_PATHS["tamil-calendar"]).toBe("/tamil-calendar");
    expect(PAGE_PATHS.panchangam).toBe("/tamil-calendar");
    expect(getPageUrl("tamil-calendar")).toBe("/tamil-calendar");
    expect(getPageUrl("panchangam")).toBe("/tamil-calendar");
  });

  it("resolves home by default in SSR / root path", () => {
    expect(resolvePageFromUrl()).toBe("home");
  });

  it("resolves /panchangam directly to canonical tamil-calendar page", () => {
    const origWindow = globalThis.window;
    try {
      (globalThis as any).window = { location: { pathname: "/panchangam", search: "" } };
      expect(resolvePageFromUrl()).toBe("tamil-calendar");
    } finally {
      (globalThis as any).window = origWindow;
    }
  });

  it("safely migrates legacy root queries with birth params or print to jathagam (Section 78)", () => {
    const origWindow = globalThis.window;
    try {
      (globalThis as any).window = { location: { pathname: "/", search: "?d=20&m=5&y=1990&h=10&min=30&lat=13.08&lon=80.27&tz=5.5" } };
      expect(resolvePageFromUrl()).toBe("jathagam");
      (globalThis as any).window = { location: { pathname: "/", search: "?print=auto" } };
      expect(resolvePageFromUrl()).toBe("jathagam");
      (globalThis as any).window = { location: { pathname: "/", search: "" } };
      expect(resolvePageFromUrl()).toBe("home");
    } finally {
      (globalThis as any).window = origWindow;
    }
  });
});

describe("Authoritative Tools Registry (Section 40, 75)", () => {
  it("registers at least 20 tools across all categories", () => {
    expect(ASTRO_TOOLS.length).toBeGreaterThanOrEqual(20);
    expect(TOOL_CATEGORIES.length).toBe(7);
  });

  it("ensures every tool has valid paths, categories, and bilingual metadata", () => {
    for (const tool of ASTRO_TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.titleTa).toBeTruthy();
      expect(tool.titleEn).toBeTruthy();
      expect(tool.descriptionTa).toBeTruthy();
      expect(tool.descriptionEn).toBeTruthy();
      expect(tool.path.startsWith("/")).toBe(true);
      expect(tool.keywords.length).toBeGreaterThan(0);
      expect(["available", "beta", "coming-soon"]).toContain(tool.status);
    }
  });

  it("maintains single canonical Tamil Calendar & Panchangam tool with alias support", () => {
    const canonicalTool = ASTRO_TOOLS.find((t) => t.id === "tamil-calendar");
    expect(canonicalTool).toBeDefined();
    expect(canonicalTool?.path).toBe("/tamil-calendar");
    const panchangamAlias = ASTRO_TOOLS.find((t) => t.id === "panchangam-alias");
    if (panchangamAlias) expect(panchangamAlias.path).toBe("/tamil-calendar");
    expect(ASTRO_TOOLS.find((t) => t.id === "panchangam-tool" && t.path === "/panchangam")).toBeUndefined();
    expect(filterTools(ASTRO_TOOLS, "all", "பொருத்தம்").some((t) => t.id === "porutham")).toBe(true);
  });
});

describe("Jathagam Report Mode Query Driving (Section 6)", () => {
  it("parses mode parameter accurately from URL and defaults safely to 'one'", () => {
    const origWindow = globalThis.window;
    try {
      (globalThis as any).window = { location: { pathname: "/jathagam", search: "?mode=six" } };
      expect(parseReportModeFromUrl()).toBe("six");
      (globalThis as any).window = { location: { pathname: "/jathagam", search: "?mode=thirty" } };
      expect(parseReportModeFromUrl()).toBe("thirty");
      (globalThis as any).window = { location: { pathname: "/jathagam", search: "?mode=one" } };
      expect(parseReportModeFromUrl()).toBe("one");
      (globalThis as any).window = { location: { pathname: "/jathagam", search: "?mode=unknown-mode" } };
      expect(parseReportModeFromUrl()).toBe("one");
      (globalThis as any).window = { location: { pathname: "/jathagam", search: "" } };
      expect(parseReportModeFromUrl()).toBe("one");
    } finally {
      (globalThis as any).window = origWindow;
    }
  });
});

describe("Location & Timezone Validation (Sections 4 & 5)", () => {
  const validInput: BirthInput = {
    name: "Valid User", sex: "M", year: 1995, month: 8, day: 15, hour: 8, minute: 30,
    tz: 5.5, lat: 13.0827, lon: 80.2707, place: "Chennai", school: "thirukanitham",
    locationVerified: true, ianaTimezone: "Asia/Kolkata",
  };

  it("successfully computes chart with verified location and populates full receipt", () => {
    const res = compute(validInput);
    expect(res.receipt?.locationVerified).toBe(true);
    expect(res.receipt?.ianaTimezone).toBe("Asia/Kolkata");
    expect(res.receipt?.timezoneSource).toBe("IANA tzdb");
    expect(res.receipt?.utcOffset).toBe("+05:30");
    expect(res.receipt?.offsetAtBirth).toBe("+05:30");
  });

  it("does not infer locationVerified: true when locationVerified is false or omitted", () => {
    expect(compute({ ...validInput, locationVerified: false }).receipt?.locationVerified).toBe(false);
  });

  it("resolves exact historical UTC offsets across DST transitions using real IANA tzdb", () => {
    const nySummer = resolveHistoricalUtcOffset("America/New_York", 1995, 8, 15, 8, 30);
    expect(nySummer.offsetHours).toBe(-4);
    expect(nySummer.timezoneSource).toBe("IANA tzdb");
    const nyWinter = resolveHistoricalUtcOffset("America/New_York", 1995, 1, 15, 8, 30);
    expect(nyWinter.offsetHours).toBe(-5);
    const londonSummer = resolveHistoricalUtcOffset("Europe/London", 2023, 7, 1, 12, 0);
    expect(londonSummer.offsetHours).toBe(1);
    const londonWinter = resolveHistoricalUtcOffset("Europe/London", 2023, 1, 1, 12, 0);
    expect(londonWinter.offsetHours).toBe(0);
  });

  it("resolves canonical IANA timezones from coordinates and place boundaries", () => {
    expect(resolveIanaTimezone(13.08, 80.27, "Chennai")).toBe("Asia/Kolkata");
    expect(resolveIanaTimezone(6.92, 79.86, "Colombo (Sl)")).toBe("Asia/Colombo");
    expect(resolveIanaTimezone(1.35, 103.82, "Singapore")).toBe("Asia/Singapore");
    expect(resolveIanaTimezone(40.71, -74.0, "New York")).toBe("America/New_York");
    expect(resolveIanaTimezone(51.5, -0.12, "London")).toBe("Europe/London");
    expect(resolveIanaTimezone(0, 0)).toBe("UTC");
    expect(resolveIanaTimezone(-50, 165)).toMatch(/^Etc\/GMT/);
  });

  it("handles birth-time quality parameters (Section 23)", () => {
    expect(compute({ ...validInput, birthTimeQuality: "exact" }).receipt?.inputVerified).toBe(true);
    expect(compute({ ...validInput, birthTimeQuality: "approximate" }).receipt?.inputVerified).toBe(true);
  });

  it("resolves Tamil place names and aliases in city search (Section 83)", () => {
    const allCities = mergeCityLists(POPULAR_CITIES);
    expect(searchCities(allCities, "சென்னை").some((c: any) => c.n.toLowerCase().includes("chennai") || c.n.toLowerCase().includes("madras"))).toBe(true);
    expect(searchCities(allCities, "பெங்களூரு").some((c: any) => c.n.toLowerCase().includes("bengaluru") || c.n.toLowerCase().includes("bangalore"))).toBe(true);
  });

  it("rejects invalid or missing coordinates without silent fallback", () => {
    expect(() => compute({ ...validInput, lat: NaN, lon: NaN } as any)).toThrowError(/Invalid or unverified birth coordinates/);
    expect(() => compute({ ...validInput, lat: 95.0, lon: 80.0 } as any)).toThrowError(/Latitude 95 is out of range/);
    expect(() => compute({ ...validInput, lat: -95.0, lon: 80.0 } as any)).toThrowError(/Latitude -95 is out of range/);
    expect(() => compute({ ...validInput, lat: 13.0, lon: 195.0 } as any)).toThrowError(/Longitude 195 is out of range/);
    expect(() => compute({ ...validInput, lat: 13.0, lon: -195.0 } as any)).toThrowError(/Longitude -195 is out of range/);
  });

  it("distinguishes verified locations from manual user-supplied coordinates in receipt", () => {
    const verifiedRes = compute({ ...validInput, locationVerified: true });
    expect(verifiedRes.receipt?.locationVerified).toBe(true);
    expect(verifiedRes.receipt?.locationStatus).toBe("verified");

    const manualRes = compute({ ...validInput, locationVerified: false });
    expect(manualRes.receipt?.locationVerified).toBe(false);
    expect(manualRes.receipt?.locationStatus).toBe("user-supplied");
  });

  it("does not assume Chennai when daily Panchangam location is missing or invalid", () => {
    expect(() => requirePanchangamLocation({})).toThrowError(/requires explicit latitude/);
    expect(() => requirePanchangamLocation({ lat: 95, lon: 80, tz: 5.5 })).toThrowError(/valid coordinates/);
    expect(() => requirePanchangamLocation({ lat: 13, lon: 200, tz: 5.5 })).toThrowError(/valid coordinates/);
  });
});

describe("Production Calculation Profile Authoritative Definition (Task A)", () => {
  it("proves default zodiac is sidereal", () => {
    expect(PRODUCTION_PROFILE.zodiac).toBe("sidereal");
  });

  it("proves default ayanamsa is Thirukanitham", () => {
    expect(PRODUCTION_PROFILE.ayanamsa).toBe("thirukanitham");
  });

  it("proves default nodes are mean", () => {
    expect(PRODUCTION_PROFILE.nodeMode).toBe("mean");
  });

  it("proves default house system is Whole Sign", () => {
    expect(PRODUCTION_PROFILE.houseSystem).toBe("whole-sign");
  });

  it("proves default Dasa system is Vimshottari", () => {
    expect(PRODUCTION_PROFILE.dashaSystem).toBe("vimshottari");
  });

  it("proves default ephemeris is Astronomy Engine", () => {
    expect(PRODUCTION_PROFILE.ephemeris).toBe("astronomy-engine");
  });

  it("proves default Panchangam profile is Thirukanitham-oriented", () => {
    expect(PRODUCTION_PROFILE.panchangaMethod).toBe("thirukanitham-oriented");
  });

  it("proves default timezone source is IANA tzdb", () => {
    expect(PRODUCTION_PROFILE.timezoneSource).toBe("iana-tzdb");
  });
});

describe("Astronomical Ephemeris & Fallback Truthfulness (Sections 3 & 7)", () => {
  it("honestly declares Astronomy Engine instead of Swiss Ephemeris", () => {
    expect(PRODUCTION_PROFILE.ephemeris).toBe("astronomy-engine");
    expect(ASTRO_EPHEMERIS_SOURCE).toContain("Astronomy Engine");
    expect(ASTRO_EPHEMERIS_SOURCE).not.toContain("Swiss Ephemeris");
  });

  it("does not fabricate 06:00/18:00 when sunrise/sunset cannot be computed", () => {
    const polarNight = calculateSunTimes(2026, 12, 21, 85.0, 0.0, 0);
    expect(polarNight.status).toBe("unavailable");
    expect(polarNight.sunriseJD).toBeNull();
    expect(polarNight.sunsetJD).toBeNull();
    expect(polarNight.nextSunriseJD).toBeNull();
  });
});

describe("Comprehensive Daily Panchangam & Transitions (Sections 10 & 11)", () => {
  it("calculates transition intervals and sorted chronological timeline for a complete calendar day", () => {
    const dayData = calculateComprehensiveDayDetails({
      year: 2026, month: 4, day: 14, placeName: "Chennai", lat: 13.0827, lon: 80.2707, tz: 5.5,
    });
    expect(dayData.dayTithis.length).toBeGreaterThan(0);
    expect(dayData.dayNakshatras.length).toBeGreaterThan(0);
    expect(dayData.dayYogas.length).toBeGreaterThan(0);
    expect(dayData.dayKaranas.length).toBeGreaterThan(0);
    expect(dayData.timeline.length).toBeGreaterThan(0);
    expect(dayData.timeline.some((e) => e.type === "sunrise")).toBe(true);
    expect(dayData.timeline.some((e) => e.type === "sunset")).toBe(true);
  });
});

describe("Forecast Horizon Engine & Non-Static Evidence (Sections 30 & 31)", () => {
  const mockChartData = {
    lagnaSign: 0, moonSign: 1, activeMahaDasaLord: "jupiter", activeBhuktiLord: "mercury",
    bodies: { sun: { sign: 4, house: 5, retrograde: false }, moon: { sign: 1, house: 2, retrograde: false } },
    yogas: [{ nameTa: "கஜகேசரி யோகம்", nameEn: "Gaja Kesari Yoga" }],
    sadeSatiActive: false,
  };
  it("generates 12 distinct monthly periods for 1-year horizon", () => {
    const fc = generateHorizonForecast(mockChartData, "1yr", 2026, 4);
    expect(fc.periods.length).toBe(12);
    expect(fc.periods[0]?.supportingFactors.some((f) => f.includes("JUPITER"))).toBe(true);
    expect(fc.periods[0]?.supportingFactors.some((f) => f.includes("கஜகேசரி"))).toBe(true);
  });
  it("generates 5 distinct yearly periods for 5-year horizon", () => {
    const fc = generateHorizonForecast(mockChartData, "5yr", 2026);
    expect(fc.periods.length).toBe(5);
    expect(fc.periods[0]?.tamilYear).toBeTruthy();
  });
});

describe("Golden Regression Fixtures (Task Q)", () => {
  it("Golden Case 1: Chennai 1990 — Thirukanitham chart deterministic benchmark", () => {
    const chart = compute({
      name: "Golden Chennai",
      sex: "M",
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
      tz: 5.5,
      lat: 13.0827,
      lon: 80.2707,
      place: "Chennai",
      school: "thirukanitham",
      locationVerified: true,
    });
    // Lagna in Cancer (3), Sun in Taurus (1), Moon in Sagittarius (8)
    expect(chart.list.find((b) => b.id === "lagna")?.sign).toBe(3); // Cancer
    expect(chart.list.find((b) => b.id === "sun")?.sign).toBe(1);   // Taurus
    expect(chart.list.find((b) => b.id === "moon")?.sign).toBe(8);  // Sagittarius (Uttarashadha Pada 1)
    expect(chart.school).toBe("thirukanitham");
    expect(chart.receipt?.locationStatus).toBe("verified");
  });

  it("Golden Case 2: New Delhi 2000 — Millennial J2000 fixture", () => {
    const chart = compute({
      name: "Golden Delhi",
      sex: "M",
      year: 2000,
      month: 1,
      day: 1,
      hour: 12,
      minute: 0,
      tz: 5.5,
      lat: 28.6139,
      lon: 77.2090,
      place: "New Delhi",
      school: "thirukanitham",
      locationVerified: true,
    });
    expect(chart.list.find((b) => b.id === "lagna")?.sign).toBe(11); // Pisces
    expect(chart.list.find((b) => b.id === "sun")?.sign).toBe(8);    // Sagittarius
    expect(chart.list.find((b) => b.id === "moon")?.sign).toBe(6);   // Libra
  });

  it("Golden Case 3: London 2023 — British Summer Time (BST) offset validation", () => {
    const chart = compute({
      name: "Golden London",
      sex: "F",
      year: 2023,
      month: 7,
      day: 1,
      hour: 14,
      minute: 0,
      tz: 1.0,
      lat: 51.5074,
      lon: -0.1278,
      place: "London",
      school: "thirukanitham",
      locationVerified: true,
      ianaTimezone: "Europe/London",
    });
    expect(chart.receipt?.ianaTimezone).toBe("Europe/London");
    expect(chart.receipt?.offsetAtBirth).toBe("+01:00");
    expect(chart.list.find((b) => b.id === "sun")?.sign).toBe(2); // Gemini
  });

  it("Golden Case 4: New York 1995 — Historical Daylight Saving Time validation", () => {
    const chart = compute({
      name: "Golden NY",
      sex: "F",
      year: 1995,
      month: 8,
      day: 15,
      hour: 8,
      minute: 30,
      tz: -4.0,
      lat: 40.7128,
      lon: -74.0060,
      place: "New York",
      school: "thirukanitham",
      locationVerified: true,
      ianaTimezone: "America/New_York",
    });
    expect(chart.receipt?.offsetAtBirth).toBe("-04:00");
    expect(chart.list.find((b) => b.id === "sun")?.sign).toBe(3); // Cancer
  });

  it("Golden Case 5: Polar extreme (85°N, 0°E) on Winter Solstice — Solar events unavailable", () => {
    const sunTimes = calculateSunTimes(2026, 12, 21, 85.0, 0.0, 0);
    expect(sunTimes.status).toBe("unavailable");
    expect(sunTimes.sunriseJD).toBeNull();
    expect(sunTimes.sunsetJD).toBeNull();
  });
});

