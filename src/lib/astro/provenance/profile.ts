// Codepackr Astro — Production Calculation Profile (Final Decision 2)
import type { ProductionCalculationProfile } from "../types";

export const DEFAULT_PRODUCTION_PROFILE: ProductionCalculationProfile = {
  zodiac: "sidereal",
  ayanamsa: "lahiri",
  nodeMode: "mean",
  houseSystem: "whole-sign",
  panchangaMethod: "thirukanitham-oriented",
  dashaSystem: "vimshottari",
  ephemeris: "swiss-ephemeris",
  timezoneSource: "iana-tzdb",
};

export const PRODUCTION_PROFILE = DEFAULT_PRODUCTION_PROFILE;
