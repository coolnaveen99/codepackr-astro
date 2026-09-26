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

  it("resolves home by default in SSR / root path", () => {
    expect(resolvePageFromUrl()).toBe("home");
  });

  it("safely migrates legacy root queries with birth params or print to jathagam (Section 78)", () => {
    const origWindow = globalThis.window;
    try {
      // Simulate /?d=20&m=5&y=1990
      (globalThis as any).window = {
        location: {
          pathname: "/",
          search: "?d=20&m=5&y=1990&h=10&min=30&lat=13.08&lon=80.27&tz=5.5",
        },
      };
      expect(resolvePageFromUrl()).toBe("jathagam");

      // Simulate /?print=auto
      (globalThis as any).window = {
        location: {
          pathname: "/",
          search: "?print=auto",
        },
      };
      expect(resolvePageFromUrl()).toBe("jathagam");

      // Simulate clean home page / with no params
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

  it("filters tools correctly by category and search keyword", () => {
    const panchangamTools = filterTools(ASTRO_TOOLS, "panchangam", "");
    expect(panchangamTools.length).toBeGreaterThanOrEqual(2);
    expect(panchangamTools.some((t) => t.id === "tamil-calendar")).toBe(true);

    const searchResults = filterTools(ASTRO_TOOLS, "all", "பொருத்தம்");
    expect(searchResults.some((t) => t.id === "porutham")).toBe(true);
  });
});

describe("Location & Timezone Validation (Sections 5 & 6)", () => {
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

  it("successfully computes chart with verified location", () => {
    const res = compute(validInput);
    expect(res).toBeDefined();
    expect(res.receipt?.locationVerified).toBe(true);
    expect(res.metadata?.timezone).toBe("Asia/Kolkata");
  });

  it("handles birth-time quality parameters (Section 23)", () => {
    const resExact = compute({ ...validInput, birthTimeQuality: "exact" });
    expect(resExact.receipt?.inputVerified).toBe(true);

    const resApprox = compute({ ...validInput, birthTimeQuality: "approximate" });
    expect(resApprox.receipt?.inputVerified).toBe(true);
  });

  it("resolves Tamil place names and aliases in city search (Section 83)", () => {
    const allCities = mergeCityLists(POPULAR_CITIES);

    // Searching 'சென்னை' must match Chennai / Madras
    const chennaiMatches = searchCities(allCities, "சென்னை");
    expect(chennaiMatches.length).toBeGreaterThan(0);
    expect(chennaiMatches.some((c: any) => c.n.toLowerCase().includes("chennai") || c.n.toLowerCase().includes("madras"))).toBe(true);

    // Searching 'பெங்களூரு' must match Bengaluru / Bangalore
    const blrMatches = searchCities(allCities, "பெங்களூரு");
    expect(blrMatches.length).toBeGreaterThan(0);
    expect(blrMatches.some((c: any) => c.n.toLowerCase().includes("bengaluru") || c.n.toLowerCase().includes("bangalore"))).toBe(true);
  });

  it("rejects invalid or missing coordinates without silent fallback", () => {
    const invalidInput = { ...validInput, lat: NaN, lon: NaN };
    expect(() => compute(invalidInput as any)).toThrowError(/Invalid or unverified birth coordinates/);
  });
});

describe("Astronomical Ephemeris & Fallback Truthfulness (Sections 3 & 7)", () => {
  it("honestly declares Astronomy Engine instead of Swiss Ephemeris", () => {
    expect(PRODUCTION_PROFILE.ephemeris).toBe("astronomy-engine");
    expect(ASTRO_EPHEMERIS_SOURCE).toContain("Astronomy Engine");
    expect(ASTRO_EPHEMERIS_SOURCE).not.toContain("Swiss Ephemeris");
  });

  it("does not fabricate 06:00/18:00 when sunrise/sunset cannot be computed", () => {
    // Extreme polar latitude (85° North in winter, polar night)
    const polarNight = calculateSunTimes(2026, 12, 21, 85.0, 0.0, 0);
    expect(polarNight.status).toBe("unavailable");
    expect(polarNight.sunriseJD).toBeNull();
    expect(polarNight.sunsetJD).toBeNull();
  });
});

describe("Forecast Horizon Engine & Non-Static Evidence (Sections 30 & 31)", () => {
  const mockChartData = {
    lagnaSign: 0, // Aries
    moonSign: 1,  // Taurus
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
    // Supporting factors must reflect actual active Dasa lord (Jupiter) and Yoga
    expect(fc.periods[0]?.supportingFactors.some((f) => f.includes("JUPITER"))).toBe(true);
    expect(fc.periods[0]?.supportingFactors.some((f) => f.includes("கஜகேசரி"))).toBe(true);
  });

  it("generates 5 distinct yearly periods for 5-year horizon", () => {
    const fc = generateHorizonForecast(mockChartData, "5yr", 2026);
    expect(fc.periods.length).toBe(5);
    expect(fc.periods[0]?.tamilYear).toBeTruthy();
  });
});
