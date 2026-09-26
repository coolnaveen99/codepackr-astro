// Codepackr Astro — Graha (Planet) Calculation & State Assembly
import { normalize360, signIndex, dmsText } from "../astronomy/coordinates";
import { nakshatraDetails } from "../calendar/nakshatra";
import { calculateNavamsa } from "./varga";
import { houseFrom } from "./houses";
import { evaluateDignity, type DignityInfo } from "./dignity";

export type GrahaState = {
  id: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  sign: number;
  degreeInSign: number;
  dms: string;
  nakshatra: number;
  pada: number;
  nakshatraLord: string;
  navamsa: number;
  house: number;
  retrograde: boolean;
  combust: boolean;
  dignity: DignityInfo;
};

/**
 * Builds a comprehensive Graha state object combining astronomical coordinates,
 * house placement, motion velocity state, combustion, and traditional dignity.
 */
export function buildGrahaState(
  id: string,
  tropicalLon: number,
  siderealLon: number,
  lagnaSign: number,
  isRetrograde: boolean,
  isCombust: boolean
): GrahaState {
  const normSid = normalize360(siderealLon);
  const s = signIndex(normSid);
  const degInSign = normSid - s * 30;
  const nak = nakshatraDetails(normSid);
  const nav = calculateNavamsa(normSid);
  const h = houseFrom(s, lagnaSign);
  const dig = evaluateDignity(id, s, degInSign);

  return {
    id,
    tropicalLongitude: normalize360(tropicalLon),
    siderealLongitude: normSid,
    sign: s,
    degreeInSign: degInSign,
    dms: dmsText(degInSign),
    nakshatra: nak.index,
    pada: nak.pada,
    nakshatraLord: nak.lord,
    navamsa: nav,
    house: h,
    retrograde: isRetrograde,
    combust: isCombust,
    dignity: dig,
  };
}
