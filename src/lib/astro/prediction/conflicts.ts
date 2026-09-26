// Codepackr Astro — Contradiction & Conflict Resolution Engine
import type { PredictionEvidence } from "../types";

export type ResolvedNarrative = {
  themeTa: string;
  themeEn: string;
  synthesisTa: string;
  synthesisEn: string;
  supportLevel: PredictionEvidence["supportLevel"];
};

/**
 * Synthesizes supporting and conflicting astrological factors into a responsible,
 * evidence-grounded traditional interpretation.
 */
export function resolveFactorConflicts(
  domainNameTa: string,
  domainNameEn: string,
  evidence: PredictionEvidence
): ResolvedNarrative {
  const hasSupport = evidence.supportingRules.length > 0 || evidence.dashaFactors.length > 0;
  const hasCaution = evidence.conflictingRules.length > 0;

  if (hasSupport && hasCaution) {
    return {
      themeTa: `${domainNameTa}: கலவையான வாய்ப்புகள் மற்றும் கூடுதல் கவனத்திற்கான காலம்`,
      themeEn: `${domainNameEn}: Mixed trends with opportunities accompanied by necessary caution`,
      synthesisTa:
        "பாரம்பரிய ஜோதிட விதிகளின்படி, வளர்ச்சிக்கு சாதகமான காரணிகள் காணப்பட்டாலும் சில தாமதங்கள் அல்லது கூடுதல் பொறுப்புகள் போன்ற நிதானக் காரணிகளும் இணைந்து காணப்படுகின்றன. எனவே விழிப்புணர்வுடன் முடிவெடுப்பது நலம் பயக்கும்.",
      synthesisEn:
        "According to traditional astrological principles, supportive factors for expansion exist alongside cautionary signals indicating delays or added responsibilities. Thoughtful, steady execution is traditionally recommended.",
      supportLevel: "mixed",
    };
  }

  if (hasCaution && !hasSupport) {
    return {
      themeTa: `${domainNameTa}: நிதானமும் பொறுமையும் தேவைப்படும் காலம்`,
      themeEn: `${domainNameEn}: Period calling for patience, prudence and consolidation`,
      synthesisTa:
        "இக்காலத்தில் அவசர முடிவுகளைத் தவிர்த்து, திட்டமிட்ட வழியில் பாதுகாப்பாகச் செயல்படுவது பாரம்பரிய ஜோதிட விளக்கத்தில் பரிந்துரைக்கப்படுகிறது.",
      synthesisEn:
        "During this phase, traditional guidelines suggest avoiding hasty ventures and focusing on consolidation and steady discipline.",
      supportLevel: "caution",
    };
  }

  if (evidence.supportLevel === "strong") {
    return {
      themeTa: `${domainNameTa}: குறிப்பிடத்தக்க சாதகமான பாரம்பரிய ஆதரவு`,
      themeEn: `${domainNameEn}: Strong traditional astrological support`,
      synthesisTa:
        "தசை மற்றும் கோச்சார கிரக நிலைகள் சாதகமான அமைப்பில் இணைந்துள்ளன. சுப முயற்சிகள் மற்றும் திட்டங்களை முன்னெடுக்க பாரம்பரிய விதிகளின்படி நல்ல ஆதரவு காணப்படுகிறது.",
      synthesisEn:
        "Dasa and transit configurations harmonize favorably. Traditional rules suggest strong supportive momentum for constructive endeavors.",
      supportLevel: "strong",
    };
  }

  return {
    themeTa: `${domainNameTa}: மிதமான சமநிலை காலம்`,
    themeEn: `${domainNameEn}: Moderate and balanced period`,
    synthesisTa:
      "வழக்கமான கடமைகளில் கவனம் செலுத்தி முன்னேற உகந்த சூழல் பாரம்பரிய ஜோதிடத்தில் சுட்டப்படுகிறது.",
    synthesisEn:
      "A steady phase favorable for continuing regular pursuits with standard diligence.",
    supportLevel: "moderate",
  };
}
