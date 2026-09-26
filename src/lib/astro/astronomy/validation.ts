// Codepackr Astro — Ephemeris Benchmark & Astronomy Validation Suite
import { computeTropicalPlanets } from "./ephemeris";
import { julianDay } from "./time";
import { angularDistance } from "./coordinates";

export type BenchmarkResult = {
  date: string;
  body: string;
  calculatedTropicalLon: number;
  referenceTropicalLon: number;
  diffDegrees: number;
  diffArcsec: number;
  toleranceArcsec: number;
  pass: boolean;
};

/**
 * Benchmark reference longitudes derived from JPL Horizons (DE440/DE441 standard).
 * High-accuracy reference snapshots for apparent geocentric ecliptic longitudes.
 */
export const ASTRONOMY_BENCHMARKS = [
  {
    date: "2000-01-01T12:00:00Z",
    year: 2000,
    month: 1,
    day: 1,
    hourUT: 12,
    references: {
      sun: 280.3687,
      moon: 223.3239,
      mercury: 271.8889,
      venus: 241.5652,
      mars: 327.9639,
      jupiter: 25.2542,
      saturn: 40.3961,
      rahu: 125.0445,
    },
  },
  {
    date: "2024-04-14T00:00:00Z",
    year: 2024,
    month: 4,
    day: 14,
    hourUT: 0,
    references: {
      sun: 24.5388,
      moon: 93.4146,
      mercury: 21.0019,
      venus: 10.9107,
      mars: 347.1191,
      jupiter: 50.2142,
      saturn: 345.0068,
      rahu: 15.3712,
    },
  },
  {
    date: "2026-04-14T00:00:00Z",
    year: 2026,
    month: 4,
    day: 14,
    hourUT: 0,
    references: {
      sun: 24.0608,
      moon: 338.2924,
      mercury: 358.4173,
      venus: 47.5959,
      mars: 3.2536,
      jupiter: 106.8618,
      saturn: 7.1467,
      rahu: 336.7150,
    },
  },
];

/**
 * Runs validation comparing current Astronomy Engine outputs against benchmark references.
 */
export function runEphemerisBenchmarks(): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];
  const toleranceArcsec = 60; // 1 arcminute general tolerance across centuries

  for (const b of ASTRONOMY_BENCHMARKS) {
    const jd = julianDay(b.year, b.month, b.day, b.hourUT);
    const planets = computeTropicalPlanets(jd);

    const check = (name: string, calc: number, ref: number) => {
      const diffDeg = angularDistance(calc, ref);
      const diffArcsec = Math.round(diffDeg * 3600);
      results.push({
        date: b.date,
        body: name,
        calculatedTropicalLon: calc,
        referenceTropicalLon: ref,
        diffDegrees: diffDeg,
        diffArcsec,
        toleranceArcsec,
        pass: diffArcsec <= toleranceArcsec,
      });
    };

    check("sun", planets.sun, b.references.sun);
    check("moon", planets.moon, b.references.moon);
    check("mercury", planets.mercury, b.references.mercury);
    check("venus", planets.venus, b.references.venus);
    check("mars", planets.mars, b.references.mars);
    check("jupiter", planets.jupiter, b.references.jupiter);
    check("saturn", planets.saturn, b.references.saturn);
    check("rahu", planets.rahu, b.references.rahu);
  }

  return results;
}
