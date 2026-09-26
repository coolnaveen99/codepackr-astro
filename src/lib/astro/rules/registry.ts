// Codepackr Astro — Centralized Traditional Astrology Rule Registry

export type AstrologyRule = {
  ruleId: string;
  nameTa: string;
  nameEn: string;
  tradition: "Parashari" | "Jaimini" | "TamilTraditional";
  sourceReference: string;
  priority: "primary" | "secondary" | "supporting" | "contextual";
  evaluate: (context: RuleEvaluationContext) => RuleMatchResult | null;
};

export type RuleEvaluationContext = {
  bodies: Record<string, { sign: number; degreeInSign: number; house: number; retrograde: boolean; combust: boolean }>;
  lagnaSign: number;
  moonSign: number;
  sunSign: number;
  navamsaSigns: Record<string, number>;
};

export type RuleMatchResult = {
  ruleId: string;
  nameTa: string;
  nameEn: string;
  category: "yoga" | "dosha" | "dignity" | "combination";
  sourceReference: string;
  isPositive: boolean;
  evidenceFactors: string[];
  explanationTa: string;
  explanationEn: string;
  cancellationFactors?: string[];
  isCancelled?: boolean;
};
