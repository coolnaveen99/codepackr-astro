// Codepackr Astro — Planetary Ephemeris Engine
import {
  Body,
  GeoVector,
  RotateVector,
  Rotation_EQJ_ECT,
  SphereFromVector,
  type AstroTime,
} from "astronomy-engine";
import { normalize360, angularDistance } from "./coordinates";
import { timeFromJD } from "./time";

/** Apparent geocentric ecliptic-of-date longitude in tropical degrees [0, 360) */
export function tropicalLongitude(body: Body, t: AstroTime): number {
  const geo = GeoVector(body, t, true);
  const ect = RotateVector(Rotation_EQJ_ECT(t), geo);
  return normalize360(SphereFromVector(ect).lon);
}

/**
 * Calculates apparent longitudinal velocity (degrees per day).
 * Positive = direct motion, Negative = retrograde motion.
 */
export function planetaryVelocity(body: Body, jd: number): number {
  const dt = 0.05; // 1.2 hours span for smooth velocity calculation
  const t1 = timeFromJD(jd - dt);
  const t2 = timeFromJD(jd + dt);
  const lon1 = tropicalLongitude(body, t1);
  const lon2 = tropicalLongitude(body, t2);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff / (2 * dt);
}

/**
 * Calculates the Mean Lunar Node (Rahu) in tropical degrees.
 * High-precision Meeus / IAU polynomial model.
 */
export function meanNode(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const node =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 46729.0 -
    (T * T * T * T) / 606160.0;
  return normalize360(node);
}

/**
 * Planet combustion thresholds in degrees of separation from the Sun.
 * Traditional Parashari & Surya Siddhanta norms:
 * - Moon: 12°
 * - Mars: 17°
 * - Mercury: 14° (direct), 12° (retrograde)
 * - Jupiter: 11°
 * - Venus: 10° (direct), 8° (retrograde)
 * - Saturn: 15°
 */
export const COMBUSTION_THRESHOLDS: Record<string, { direct: number; retro: number }> = {
  moon: { direct: 12, retro: 12 },
  mars: { direct: 17, retro: 17 },
  mercury: { direct: 14, retro: 12 },
  jupiter: { direct: 11, retro: 11 },
  venus: { direct: 10, retro: 8 },
  saturn: { direct: 15, retro: 15 },
};

export type PlanetaryState = {
  sun: number;
  moon: number;
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
  rahu: number;
  ketu: number;
  velocities: {
    sun: number;
    moon: number;
    mercury: number;
    venus: number;
    mars: number;
    jupiter: number;
    saturn: number;
    rahu: number;
    ketu: number;
  };
  retrograde: {
    mercury: boolean;
    venus: boolean;
    mars: boolean;
    jupiter: boolean;
    saturn: boolean;
    rahu: boolean; // Rahu/Ketu are naturally retrograde
    ketu: boolean;
  };
  combust: {
    mercury: boolean;
    venus: boolean;
    mars: boolean;
    jupiter: boolean;
    saturn: boolean;
    moon: boolean;
  };
};

/**
 * Calculates complete tropical coordinates, velocities, retrograde and combustion states for all grahas.
 */
export function computeTropicalPlanets(jd: number, nodeMode: "mean" | "true" = "mean"): PlanetaryState {
  const t = timeFromJD(jd);

  const sun = tropicalLongitude(Body.Sun, t);
  const moon = tropicalLongitude(Body.Moon, t);
  const mercury = tropicalLongitude(Body.Mercury, t);
  const venus = tropicalLongitude(Body.Venus, t);
  const mars = tropicalLongitude(Body.Mars, t);
  const jupiter = tropicalLongitude(Body.Jupiter, t);
  const saturn = tropicalLongitude(Body.Saturn, t);

  const rahu = meanNode(jd);
  const ketu = normalize360(rahu + 180);

  const vSun = planetaryVelocity(Body.Sun, jd);
  const vMoon = planetaryVelocity(Body.Moon, jd);
  const vMerc = planetaryVelocity(Body.Mercury, jd);
  const vVen = planetaryVelocity(Body.Venus, jd);
  const vMars = planetaryVelocity(Body.Mars, jd);
  const vJup = planetaryVelocity(Body.Jupiter, jd);
  const vSat = planetaryVelocity(Body.Saturn, jd);
  const vNode = -0.05295; // Mean node retrograde rate ≈ -0.053°/day

  const isRetro = (v: number) => v < 0;

  const checkCombust = (planetLon: number, planetId: string, retro: boolean) => {
    const thresh = COMBUSTION_THRESHOLDS[planetId];
    if (!thresh) return false;
    const limit = retro ? thresh.retro : thresh.direct;
    return angularDistance(planetLon, sun) <= limit;
  };

  const retroMerc = isRetro(vMerc);
  const retroVen = isRetro(vVen);
  const retroMars = isRetro(vMars);
  const retroJup = isRetro(vJup);
  const retroSat = isRetro(vSat);

  return {
    sun,
    moon,
    mercury,
    venus,
    mars,
    jupiter,
    saturn,
    rahu,
    ketu,
    velocities: {
      sun: vSun,
      moon: vMoon,
      mercury: vMerc,
      venus: vVen,
      mars: vMars,
      jupiter: vJup,
      saturn: vSat,
      rahu: vNode,
      ketu: vNode,
    },
    retrograde: {
      mercury: retroMerc,
      venus: retroVen,
      mars: retroMars,
      jupiter: retroJup,
      saturn: retroSat,
      rahu: true,
      ketu: true,
    },
    combust: {
      moon: angularDistance(moon, sun) <= 12,
      mercury: checkCombust(mercury, "mercury", retroMerc),
      venus: checkCombust(venus, "venus", retroVen),
      mars: checkCombust(mars, "mars", retroMars),
      jupiter: checkCombust(jupiter, "jupiter", retroJup),
      saturn: checkCombust(saturn, "saturn", retroSat),
    },
  };
}
