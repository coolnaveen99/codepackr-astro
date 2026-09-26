// Codepackr Astro — Production Calculation Profile
import type { ProductionCalculationProfile } from "../types";

/**
 * Locked production defaults.
 * Chart school default is Thirukanitham (Drik + Thirukanitham ayanamsa).
 * Lahiri / Chitrapaksha is an explicit selectable school, not a silent alias.
 */
export const DEFAULT_PRODUCTION_PROFILE: ProductionCalculationProfile = {
  zodiac: "sidereal",
  ayanamsa: "thirukanitham",
  nodeMode: "mean",
  houseSystem: "whole-sign",
  panchangaMethod: "thirukanitham-oriented",
  dashaSystem: "vimshottari",
  ephemeris: "astronomy-engine",
  timezoneSource: "iana-tzdb",
};

export const PRODUCTION_PROFILE = DEFAULT_PRODUCTION_PROFILE;
