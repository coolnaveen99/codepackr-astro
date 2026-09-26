// Codepackr Astro — Structured Prediction Evidence Engine
import type { PredictionEvidence } from "../types";

/**
 * Builds structured, machine-readable evidence for any astrological domain prediction.
 * Combines natal dispositions, active Dasa periods, transit Gochara, and relevant divisional Vargas.
 */
export function buildPredictionEvidence(
  domain: string,
  periodStart: string,
  periodEnd: string,
  natalFactors: string[],
  dashaFactors: string[],
  transitFactors: string[],
  vargaFactors: string[],
  supportingRules: string[],
  conflictingRules: string[],
  ashtakavargaFactors: string[] = []
): PredictionEvidence {
  const positiveWeight =
    natalFactors.length * 1.5 +
    dashaFactors.length * 2.0 +
    transitFactors.length * 1.8 +
    vargaFactors.length * 1.0 +
    supportingRules.length * 2.0;

  const negativeWeight = conflictingRules.length * 2.2;

  let supportLevel: PredictionEvidence["supportLevel"] = "moderate";

  if (positiveWeight === 0 && negativeWeight === 0) {
    supportLevel = "insufficient_evidence";
  } else if (positiveWeight > 6 && negativeWeight === 0) {
    supportLevel = "strong";
  } else if (negativeWeight >= 4 && positiveWeight < 4) {
    supportLevel = "caution";
  } else if (negativeWeight > 0 && positiveWeight > 0) {
    supportLevel = "mixed";
  } else if (positiveWeight >= 3) {
    supportLevel = "moderate";
  }

  return {
    domain,
    periodStart,
    periodEnd,
    natalFactors,
    dashaFactors,
    transitFactors,
    vargaFactors,
    ashtakavargaFactors,
    supportingRules,
    conflictingRules,
    supportLevel,
  };
}
