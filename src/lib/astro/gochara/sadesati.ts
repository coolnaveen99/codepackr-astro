// Codepackr Astro — Sade Sati & Saturn Transit Engine
import { signIndex } from "../astronomy/coordinates";
import { getPlanetSiderealLon } from "./transits";
import { houseFrom } from "../chart/houses";
import { nowJD } from "../astronomy/time";

export type SadeSatiPhase =
  | "none"
  | "rising_12th"     // விரைய சனி
  | "peak_janma"      // ஜென்ம சனி
  | "setting_2nd"     // பாத சனி
  | "ashtama_8th"     // அஷ்டம சனி
  | "ardhashtama_4th"; // அர்த்தாஷ்டம சனி

export type SadeSatiResult = {
  activePhase: SadeSatiPhase;
  phaseNameTa: string;
  phaseNameEn: string;
  saturnSign: number;
  natalMoonSign: number;
  houseFromMoon: number;
  summaryTa: string;
  summaryEn: string;
  guidanceTa: string;
  guidanceEn: string;
};

/**
 * Calculates current Sade Sati status and phase relative to natal Moon sign.
 */
export function calculateSadeSati(
  natalMoonLon: number,
  evalJD: number = nowJD(),
  ayanamsaType: "lahiri" | "thirukanitham" = "lahiri"
): SadeSatiResult {
  const natalMoonSign = signIndex(natalMoonLon);
  const saturnLon = getPlanetSiderealLon("saturn", evalJD, ayanamsaType);
  const saturnSign = signIndex(saturnLon);

  const h = houseFrom(saturnSign, natalMoonSign);

  let phase: SadeSatiPhase = "none";
  let nameTa = "ஏழரைச் சனி இல்லை";
  let nameEn = "No Sade Sati active";
  let summaryTa = "தற்போது ஏழரைச் சனி காலக்கட்டம் இல்லை.";
  let summaryEn = "Currently not under the influence of Sade Sati.";
  let guidanceTa = "பொதுவான நற்பலன்கள் மற்றும் சுப முயற்சிகளைத் தொடரலாம்.";
  let guidanceEn = "Favorable for general pursuits and auspicious ventures.";

  if (h === 12) {
    phase = "rising_12th";
    nameTa = "விரைய சனி (முதல் சுற்று / ஆரம்பம்)";
    nameEn = "Sade Sati - Rising Phase (12th from Moon)";
    summaryTa = "சனி பகவான் சந்திரனுக்கு 12-ஆம் வீட்டில் சஞ்சரிக்கிறார் (விரைய சனி).";
    summaryEn = "Saturn is transiting the 12th house from natal Moon (Rising phase).";
    guidanceTa = "செலவுகளில் விழிப்புணர்வு, தூரப்பயணங்கள் மற்றும் ஆன்மீக நாட்டம் நலம் பயக்கும்.";
    guidanceEn = "Prudence in expenses, planned travel, and disciplined routine are advised.";
  } else if (h === 1) {
    phase = "peak_janma";
    nameTa = "ஜென்ம சனி (நடுப்பகுதி / உச்சம்)";
    nameEn = "Sade Sati - Peak Phase (Janma Sani)";
    summaryTa = "சனி பகவான் ஜென்ம ராசியிலேயே சஞ்சரிக்கிறார் (ஜென்ம சனி).";
    summaryEn = "Saturn is transiting the natal Moon sign itself (Core phase).";
    guidanceTa = "உடல்நலம், மன அமைதி மற்றும் கூடுதல் பொறுப்புகளில் பொறுமை காப்பது பாரம்பரிய ஜோதிடத்தில் பரிந்துரைக்கப்படுகிறது.";
    guidanceEn = "Patience with increased responsibilities and attention to health are traditionally advised.";
  } else if (h === 2) {
    phase = "setting_2nd";
    nameTa = "பாத சனி (இறுதிச் சுற்று)";
    nameEn = "Sade Sati - Setting Phase (2nd from Moon)";
    summaryTa = "சனி பகவான் சந்திரனுக்கு 2-ஆம் வீட்டில் சஞ்சரிக்கிறார் (பாத சனி).";
    summaryEn = "Saturn is transiting the 2nd house from natal Moon (Setting phase).";
    guidanceTa = "குடும்ப விவகாரங்களில் மென்மை, நிதி நிர்வாகத்தில் எச்சரிக்கை நலம் தரும்.";
    guidanceEn = "Careful financial management and gentle speech in family matters are recommended.";
  } else if (h === 8) {
    phase = "ashtama_8th";
    nameTa = "அஷ்டம சனி";
    nameEn = "Ashtama Sani (8th from Moon)";
    summaryTa = "சனி பகவான் சந்திரனுக்கு 8-ஆம் வீட்டில் சஞ்சரிக்கிறார்.";
    summaryEn = "Saturn is transiting the 8th house from natal Moon.";
    guidanceTa = "பணப்பரிவர்த்தனைகளில் அவசரம் தவிர்ப்பதும், வாகன இயக்கத்தில் கவனமும் அவசியம்.";
    guidanceEn = "Avoid haste in financial commitments; maintain vigilance during travel.";
  } else if (h === 4) {
    phase = "ardhashtama_4th";
    nameTa = "அர்த்தாஷ்டம சனி";
    nameEn = "Ardhashtama Sani (4th from Moon)";
    summaryTa = "சனி பகவான் சந்திரனுக்கு 4-ஆம் வீட்டில் சஞ்சரிக்கிறார்.";
    summaryEn = "Saturn is transiting the 4th house from natal Moon.";
    guidanceTa = "வீடு, குடும்ப அமைதி மற்றும் தாயாரின் உடல்நலத்தில் கவனம் தேவை.";
    guidanceEn = "Care in domestic matters, real estate documentation, and parental well-being.";
  }

  return {
    activePhase: phase,
    phaseNameTa: nameTa,
    phaseNameEn: nameEn,
    saturnSign,
    natalMoonSign,
    houseFromMoon: h,
    summaryTa,
    summaryEn,
    guidanceTa,
    guidanceEn,
  };
}
