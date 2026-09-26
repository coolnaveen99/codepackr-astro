// Codepackr Astro — Lagna (Ascendant) Calculation Engine
import { e_tilt, SiderealTime } from "astronomy-engine";
import { normalize360, cosd, sind, tand, signIndex, dmsText } from "../astronomy/coordinates";
import { timeFromJD } from "../astronomy/time";
import { getAyanamsa, type AyanamsaType } from "../astronomy/sidereal";
import { nakshatraDetails } from "../calendar/nakshatra";

export type LagnaResult = {
  tropicalDegrees: number;
  siderealDegrees: number;
  sign: number;
  degreeInSign: number;
  dms: string;
  nakshatra: number;
  pada: number;
  lord: string;
  ayanamsaUsed: number;
};

/**
 * Calculates apparent tropical ascendant using Right Ascension of Midheaven (RAMC),
 * local sidereal time (GAST), and observer geographic latitude/longitude.
 */
export function calculateTropicalAscendant(jd: number, lat: number, lonEast: number): number {
  const t = timeFromJD(jd);
  const gastHours = SiderealTime(t);
  const ramc = normalize360(gastHours * 15 + lonEast);
  const eps = e_tilt(t).tobl;
  const y = cosd(ramc);
  const x = -sind(ramc) * cosd(eps) - tand(lat) * sind(eps);
  return normalize360((Math.atan2(y, x) * 180) / Math.PI);
}

/**
 * Calculates complete sidereal Lagna details for a given Julian Day and observer coordinates.
 */
export function calculateLagna(
  jd: number,
  lat: number,
  lonEast: number,
  ayanamsaType: AyanamsaType = "lahiri"
): LagnaResult {
  const trop = calculateTropicalAscendant(jd, lat, lonEast);
  const aya = getAyanamsa(jd, ayanamsaType);
  const sidereal = normalize360(trop - aya);
  const s = signIndex(sidereal);
  const within = sidereal - s * 30;
  const nak = nakshatraDetails(sidereal);

  return {
    tropicalDegrees: trop,
    siderealDegrees: sidereal,
    sign: s,
    degreeInSign: within,
    dms: dmsText(within),
    nakshatra: nak.index,
    pada: nak.pada,
    lord: nak.lord,
    ayanamsaUsed: aya,
  };
}
