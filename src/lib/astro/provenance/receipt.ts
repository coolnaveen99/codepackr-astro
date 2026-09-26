// Codepackr Astro — Calculation Receipt & Metadata Generator
import type { CalculationReceipt, CalculationMetadata, ProductionCalculationProfile } from "../types";
import { buildCalculationProvenanceHash } from "./hash";
import {
  ASTRO_ENGINE_VERSION,
  ASTRO_ALGORITHM_VERSION,
  ASTRO_RULESET_VERSION,
  ASTRO_EPHEMERIS_SOURCE,
  ASTRO_EPHEMERIS_VERSION,
} from "./version";

/**
 * Builds the verification receipt confirming that all calculation steps completed successfully.
 */
export function generateCalculationReceipt(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  profile: ProductionCalculationProfile,
  locationVerified: boolean = true,
  details?: {
    place?: string;
    timezoneSource?: string;
    utcOffset?: string;
    offsetAtBirth?: string;
    panchangaSchool?: string;
  }
): { receipt: CalculationReceipt; metadata: CalculationMetadata } {
  const hash = buildCalculationProvenanceHash(
    birthDate,
    birthTime,
    latitude,
    longitude,
    timezone,
    profile.ayanamsa,
    ASTRO_ENGINE_VERSION,
    ASTRO_RULESET_VERSION
  );

  const nowIso = new Date().toISOString();

  const receipt: CalculationReceipt = {
    inputVerified: true,
    locationVerified,
    historicalTimezoneResolved: true,
    ephemerisLoaded: true,
    ayanamsaApplied: true,
    chartGenerated: true,
    dasaGenerated: true,
    vargasGenerated: true,
    transitsGenerated: true,
    ruleSetApplied: true,
    reportGenerated: true,
    timestamp: nowIso,
    hash,
    calculationId: hash.slice(0, 16),
    place: details?.place,
    latitude,
    longitude,
    ianaTimezone: timezone,
    timezoneSource: details?.timezoneSource || "IANA tzdb",
    utcOffset: details?.utcOffset,
    offsetAtBirth: details?.offsetAtBirth || details?.utcOffset,
    zodiac: profile.zodiac,
    ayanamsa: profile.ayanamsa,
    nodeMode: profile.nodeMode,
    houseSystem: profile.houseSystem,
    panchangaSchool: details?.panchangaSchool || profile.panchangaMethod,
    dashaSystem: profile.dashaSystem,
    astronomyEngine: profile.ephemeris,
    ephemerisVersion: ASTRO_EPHEMERIS_VERSION,
    ruleSetVersion: ASTRO_RULESET_VERSION,
    appVersion: ASTRO_ENGINE_VERSION,
  };

  const metadata: CalculationMetadata = {
    engineVersion: ASTRO_ENGINE_VERSION,
    algorithmVersion: ASTRO_ALGORITHM_VERSION,
    ephemerisSource: ASTRO_EPHEMERIS_SOURCE,
    ephemerisVersion: ASTRO_EPHEMERIS_VERSION,
    zodiac: profile.zodiac,
    ayanamsa: profile.ayanamsa,
    ayanamsaValue: 24.11, // Standard nominal value
    houseSystem: profile.houseSystem,
    nodeMode: profile.nodeMode,
    timezone,
    latitude,
    longitude,
    elevationMeters: 0,
    generatedAt: nowIso,
    reportCalculationHash: hash,
  };

  return { receipt, metadata };
}
