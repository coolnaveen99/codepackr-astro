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

describe("Routing & Information Architecture (Sections 32, 33, 41, 50, 76)", () => {
  it("maps home to '/' and jathagam to '/jathagam'", () => {
    expect(PAGE_PATHS.home).toBe("/");
    expect(PAGE_PATHS.jathagam).toBe("/jathagam");
    expect(getPageUrl("home")).toBe("/");
    expect(getPageUrl("jathagam")).toBe("/jathagam");
  });

  it("contains all required routes in PAGE_SET", () => {
    const requiredRoutes = [
      "home",
      "jathagam",
      "tamil-calendar",
      "panchangam",
      "forecast",
      "porutham",
      "gochara",
      "rasipalan",
      "chandrashtama",
      "nakshatra",
      "babynames",
      "numerology",
      "prasna",
      "nazhigai",
      "biodata",
      "calculation-method",
    ];

    for (const r of requiredRoutes) {
      expect(PAGE_SET.has(r)).toBe(true);
    }
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
      (globalThis as any).window = {
        location: {
          pathname: "/panchangam",
          search: "",
        },
      };
      expect(resolvePageFromUrl()).toBe("tamil-calendar");
    } finally {
      (globalThis as any).window = origWindow;
    }
  });

  it("safely migrates legacy root queries with birth params or print to jathagam (Section 78)", () => {
    const origWindow = globalThis.window;
    try {
      (globalThis as any).window = {
        location: {
          pathname: "/",
          search: "?d=20&m=5&y=1990&h=10&min=30&lat=13.08&lon=80.27&tz=5.5",
        },
      };
      expect(resolvePageFromUrl()).toBe("jathagam");

      (globalThis as any).window = {
        location: {
          pathname: "/",
          search: "?print=auto",
        },
      };
      expect(resolvePageFromUrl()).toBe("jathagam");

      (globalThis as any).window = {
        location: {
          pathname: "/",
          search: "",
        },
      };
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
    if (panchangamAlias) {
      expect(panchangamAlias.path).toBe("/tamil-calendar");
    }
    const duplicateTool = ASTRO_TOOLS.find((t) => t.id === "panchangam-tool" && t.path === "/panchangam");
    expect(duplicateTool).toBeUndefined();
    const searchResults = filterTools(ASTRO_TOOLS, "all", "பொருத்தம்");
    expect(searchResults.some((t) => t.id === "porutham")).toBe(true);
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
    name: "Valid User",
    sex: "M",
    year: 1995,
    month: 8,
    day: 15,
    hour: 8,
    minute: 30,
    tz: 5.5,
    lat: 13.0827,
    lon: 80.2707,
    place: "Chennai",
    school: "thirukanitham",
    locationVerified: true,
    ianaTimezone: "Asia/Kolkata",
  };

  it("successfully computes chart with verified location and populates full receipt", () => {
    const res = compute(validInput);
    expect(res).toBeDefined();
    expect(res.receipt?.locationVerified).toBe(true);
    expect(res.receipt?.ianaTimezone).toBe("Asia/Kolkata");
    expect(res.receipt?.timezoneSource).toBe("IANA tzdb");
    expect(res.receipt?.utcOffset).toBe("+05:30");
    expect(res.receipt?.offsetAtBirth).toBe("+05:30");
  });

  it("does not infer locationVerified: true when locationVerified is false or omitted", () => {
    const unverifiedInput: BirthInput = { ...validInput, locationVerified: false };
    const res = compute(unverifiedInput);
    expect(res.receipt?.locationVerified).toBe(false);
  });

  it("resolves exact historical UTC offsets across DST transitions using real IANA tzdb", () => {
    const nySummer = resolveHistoricalUtcOffset("America/New_York", 1995, 8, 15, 8, 30);
    expect(nySummer.offsetHours).toBe(-4);
    expect(nySummer.offsetString).toBe("-04:00");
    expect(nySummer.timezoneSource).toBe("IANA tzdb");
    const nyWinter = resolveHistoricalUtcOffset("America/New_York", 1995, 1, 15, 8, 30);
    expect(nyWinter.offsetHours).toBe(-5);
    expect(nyWinter.offsetString).toBe("-05:00");
    const londonSummer = resolveHistoricalUtcOffset("Europe/London", 2023, 7, 1, 12, 0);
    expect(londonSummer.offsetHours).toBe(1);
    expect(londonSummer.offsetString).toBe("+01:00");
    const londonWinter = resolveHistoricalUtcOffset("Europe/London", 2023, 1, 1, 12, 0);
    expect(londonWinter.offsetHours).toBe(0);
    expect(londonWinter.offsetString).toBe("+00:00");
  });

  it("resolves canonical IANA timezones from coordinates and place boundaries", () => {
    expect(resolveIanaTimezone(13.08, 80.27, "Chennai")).toBe("Asia/Kolkata");
    expect(resolveIanaTimezone(6.92, 79.86, "Colombo (Sl)")).toBe("Asia/Colombo");
    expect(resolveIanaTimezone(1.35, 103.82, "Singapore")).toBe("Asia/Singapore");
    expect(resolveIanaTimezone(40.71, -74.0, "New York")).toBe("America/New_York");
    expect(resolveIanaTimezone(51.5, -0.12, "London")).toBe("Europe/London");
    expect(resolveIanaTimezone(0, -150)).toMatch(/^Etc\/GMT/);
  });

  it("handles birth-time quality parameters (Section 23)", () => {
    const resExact = compute({ ...validInput, birthTimeQuality: "exact" });
    expect(resExact.receipt?.inputVerified).toBe(true);
    const resApprox = compute({ ...validInput, birthTimeQuality: "approximate" });
    expect(resApprox.receipt?.inputVerified).toBe(true);
  });

  it("resolves Tamil place names and aliases in city search (Section 83)", () => {
    const allCities = mergeCityLists(POPULAR_CITIES);
    const chennaiMatches = searchCities(allCities, "சென்னை");
    expect(chennaiMatches.length).toBeGreaterThan(0);
    expect(chennaiMatches.some((c: any) => c.n.toLowerCase().includes("chennai") || c.n.toLowerCase().includes("madras"))).toBe(true);
    const blrMatches = searchCities(allCities, "பெங்களூரு");
    expect(blrMatches.length).toBeGreaterThan(0);
    expect(blrMatches.some((c: any) => c.n.toLowerCase().includes("bengaluru") || c.n.toLowerCase().includes("bangalore"))).toBe(true);
  });

  it("rejects invalid or missing coordinates without silent fallback", () => {
    const invalidInput = { ...validInput, lat: NaN, lon: NaN };
    expect(() => compute(invalidInput as any)).toThrowError(/Invalid or unverified birth coordinates/);
  });

  it("does not assume Chennai when daily Panchangam location is missing", () => {
    expect(() =>
      calculateComprehensiveDayDetails({
        year: 2026,
        month: 9,
        day: 26,
      } as any)
    ).toThrowError(/requires explicit latitude/);
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
      year: 2026,
      month: 4,
      day: 14,
      placeName: "Chennai",
      lat: 13.0827,
      lon: 80.2707,
      tz: 5.5,
    });
    expect(dayData).toBeDefined();
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
    lagnaSign: 0,
    moonSign: 1,
    activeMahaDasaLord: "jupiter",
    activeBhuktiLord: "mercury",
    bodies: {
      sun: { sign: 4, house: 5, retrograde: false },
      moon: { sign: 1, house: 2, retrograde: false },
    },
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
