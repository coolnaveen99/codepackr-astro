// Codepackr Astro — Core Types & Provenance Interfaces
import type { PlanetId, School } from "./constants";

export type BirthTimeQuality = "exact" | "approximate" | "rounded" | "unknown";

export type ProductionCalculationProfile = {
  zodiac: "sidereal" | "tropical";
  ayanamsa: "lahiri" | "raman" | "kp" | "thirukanitham" | "custom";
  nodeMode: "mean" | "true";
  houseSystem: "whole-sign" | "equal" | "sripati" | "placidus";
  panchangaMethod: "thirukanitham-oriented" | "astronomical";
  dashaSystem: "vimshottari";
  ephemeris: "swiss-ephemeris" | "astronomy-engine";
  timezoneSource: "iana-tzdb";
};

export type CalculationMetadata = {
  engineVersion: string;
  algorithmVersion: string;
  ephemerisSource: string;
  ephemerisVersion: string;
  zodiac: "sidereal" | "tropical";
  ayanamsa: string;
  ayanamsaValue: number;
  houseSystem: string;
  nodeMode: "mean" | "true";
  timezone: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  generatedAt: string;
  reportCalculationHash: string;
};

export type VerifiedLocation = {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timezone: string;
  utcOffsetAtInstant: number;
  source: "user" | "geocoder" | "database";
  confidence: "high" | "medium" | "low";
};

export type AstroInterval = {
  name: string;
  nameTa?: string;
  startsAt: string;
  endsAt: string;
  startJD: number;
  endJD: number;
  source: "calculated";
  profileId: string;
  index?: number;
  pada?: number;
  lord?: string;
};

export type BirthTimeSensitivity = {
  quality: BirthTimeQuality;
  overallRating: "stable" | "moderately_sensitive" | "highly_sensitive";
  summaryTa: string;
  summaryEn: string;
  lagnaStable: boolean;
  navamsaStable: boolean;
  d60Stable: boolean;
  dasaBalanceShiftDays: number;
  lagnaAtMinus5: string;
  lagnaAtCurrent: string;
  lagnaAtPlus5: string;
  navamsaAtMinus5: string;
  navamsaAtCurrent: string;
  navamsaAtPlus5: string;
  d60AtMinus5: string;
  d60AtCurrent: string;
  d60AtPlus5: string;
};

export type CalculationReceipt = {
  inputVerified: boolean;
  locationVerified: boolean;
  historicalTimezoneResolved: boolean;
  ephemerisLoaded: boolean;
  ayanamsaApplied: boolean;
  chartGenerated: boolean;
  dasaGenerated: boolean;
  vargasGenerated: boolean;
  transitsGenerated: boolean;
  ruleSetApplied: boolean;
  reportGenerated: boolean;
  timestamp: string;
  hash: string;
  calculationId?: string;
  place?: string;
  latitude?: number;
  longitude?: number;
  ianaTimezone?: string;
  timezoneSource?: string;
  utcOffset?: string;
  offsetAtBirth?: string;
  zodiac?: string;
  ayanamsa?: string;
  nodeMode?: string;
  houseSystem?: string;
  panchangaSchool?: string;
  dashaSystem?: string;
  astronomyEngine?: string;
  ephemerisVersion?: string;
  ruleSetVersion?: string;
  appVersion?: string;
};

export type PredictionEvidence = {
  domain: string;
  periodStart: string;
  periodEnd: string;
  natalFactors: string[];
  dashaFactors: string[];
  transitFactors: string[];
  vargaFactors: string[];
  ashtakavargaFactors?: string[];
  supportingRules: string[];
  conflictingRules: string[];
  supportLevel: "strong" | "moderate" | "mixed" | "caution" | "insufficient_evidence";
};

export type DomainForecast = {
  id: string;
  titleTa: string;
  titleEn: string;
  theme: string;
  themeTa: string;
  period: string;
  supportLevel: "strong" | "moderate" | "mixed" | "caution" | "insufficient_evidence";
  support: string[];
  caution: string[];
  traditionalInterpretation: string;
  evidence: PredictionEvidence;
  medicalDisclaimer?: boolean;
};

export type ForecastPeriod = {
  start: string;
  end: string;
  labelTa: string;
  labelEn: string;
  tamilYear?: string;
  tamilMonth?: string;
  mahaDasa?: string;
  bhukti?: string;
  majorTransits: string[];
  supportingFactors: string[];
  cautionFactors: string[];
  supportLevel: "strong" | "moderate" | "mixed" | "caution" | "insufficient_evidence";
  domains: Record<string, DomainForecast>;
};

export type MultiYearForecast = {
  horizon: "1yr" | "3yr" | "5yr" | "10yr" | "20yr" | "60yr";
  titleTa: string;
  titleEn: string;
  overviewTa: string;
  overviewEn: string;
  evidenceSummary: {
    strongCount: number;
    moderateCount: number;
    mixedCount: number;
    cautionCount: number;
  };
  periods: ForecastPeriod[];
  receipt: CalculationReceipt;
  metadata: CalculationMetadata;
};

export type TamilYearRecord = {
  cycleNumber: number;
  tamilYearNameTa: string;
  tamilYearNameEn: string;
  gregorianStartYear: number;
  gregorianEndYear: number;
  startInstant: string;
  endInstant: string;
  chithirai1: string;
  deity?: string;
  natureTa?: string;
  natureEn?: string;
};

export type TamilMonthInfo = {
  index: number; // 0 = Chithirai ... 11 = Panguni
  nameTa: string;
  nameEn: string;
  rasiIndex: number;
  rasiNameTa: string;
  rasiNameEn: string;
  ingressInstant: string;
  ingressJD: number;
  localDate: string;
  dayCount: number;
};

export type { TamilDateResult } from "./calendar/tamil-calendar";
