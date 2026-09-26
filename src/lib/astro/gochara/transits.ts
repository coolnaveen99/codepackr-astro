// Codepackr Astro — Event-Based Planetary Transit (Gochara) Engine
import { Body } from "astronomy-engine";
import { normalize360, signIndex } from "../astronomy/coordinates";
import { tropicalLongitude, planetaryVelocity } from "../astronomy/ephemeris";
import { getAyanamsa } from "../astronomy/sidereal";
import { timeFromJD, formatJD, nowJD } from "../astronomy/time";
import { nakshatraDetails } from "../calendar/nakshatra";
import { houseFrom } from "../chart/houses";
import { evaluateDignity } from "../chart/dignity";

export type TransitEvent = {
  planetId: string;
  eventType: "sign_ingress" | "nakshatra_ingress" | "station_retrograde" | "station_direct";
  eventTimeJD: number;
  eventTimeFormatted: string;
  fromSign?: number;
  toSign?: number;
  toNakshatra?: number;
  descriptionTa: string;
  descriptionEn: string;
};

export type CurrentTransitPlanet = {
  id: string;
  siderealLongitude: number;
  sign: number;
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  retrograde: boolean;
  houseFromMoon: number;
  houseFromLagna: number;
  dignityLabelTa: string;
  dignityLabelEn: string;
};

const PLANET_BODIES: Record<string, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
};

/**
 * Returns sidereal longitude for any planet body at a given JD.
 */
export function getPlanetSiderealLon(
  planetId: string,
  jd: number,
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): number {
  const aya = getAyanamsa(jd, ayanamsaType);
  if (planetId === "rahu") {
    const T = (jd - 2451545.0) / 36525.0;
    const node = 125.0445479 - 1934.1362891 * T;
    return normalize360(normalize360(node) - aya);
  }
  if (planetId === "ketu") {
    const r = getPlanetSiderealLon("rahu", jd, ayanamsaType);
    return normalize360(r + 180);
  }
  const body = PLANET_BODIES[planetId];
  if (!body) return 0;
  const t = timeFromJD(jd);
  const trop = tropicalLongitude(body, t);
  return normalize360(trop - aya);
}

/**
 * Calculates current transit positions relative to natal Moon and Lagna.
 */
export function calculateCurrentTransits(
  natalMoonLon: number,
  natalLagnaLon: number,
  evalJD: number = nowJD(),
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): CurrentTransitPlanet[] {
  const natalMoonSign = signIndex(natalMoonLon);
  const natalLagnaSign = signIndex(natalLagnaLon);

  const planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
  const out: CurrentTransitPlanet[] = [];

  for (const p of planets) {
    const lon = getPlanetSiderealLon(p, evalJD, ayanamsaType);
    const s = signIndex(lon);
    const degInSign = lon - s * 30;
    const nak = nakshatraDetails(lon);

    let isRetro = false;
    if (p === "rahu" || p === "ketu") {
      isRetro = true;
    } else {
      const body = PLANET_BODIES[p];
      if (body) {
        const vel = planetaryVelocity(body, evalJD);
        isRetro = vel < 0;
      }
    }

    const dig = evaluateDignity(p, s, degInSign);

    out.push({
      id: p,
      siderealLongitude: lon,
      sign: s,
      degreeInSign: degInSign,
      nakshatra: nak.index,
      pada: nak.pada,
      retrograde: isRetro,
      houseFromMoon: houseFrom(s, natalMoonSign),
      houseFromLagna: houseFrom(s, natalLagnaSign),
      dignityLabelTa: dig.labelTa,
      dignityLabelEn: dig.labelEn,
    });
  }

  return out;
}
