// Codepackr Astro — Dosha & Classical Exception/Cancellation Registry
import { houseFrom } from "../chart/houses";
import type { RuleEvaluationContext, RuleMatchResult } from "./registry";

export type DoshaStatus = "detected" | "not_detected" | "cancelled" | "conditional";

export type DoshaEvaluationResult = {
  id: string;
  nameTa: string;
  nameEn: string;
  status: DoshaStatus;
  statusLabelTa: string;
  statusLabelEn: string;
  houseFromLagna: number;
  houseFromMoon: number;
  evidenceFactors: string[];
  cancellationFactors: string[];
  explanationTa: string;
  explanationEn: string;
  guidanceTa: string;
  guidanceEn: string;
};

/**
 * Evaluates Chevvai (Mangal / Kuja) Dosha according to classical South Indian and Parashari rules,
 * incorporating classical cancellation/mitigation factors.
 */
export function evaluateChevvaiDosha(ctx: RuleEvaluationContext): DoshaEvaluationResult {
  const mars = ctx.bodies.mars;
  if (!mars) {
    return {
      id: "chevvai-dosha",
      nameTa: "செவ்வாய் தோஷம்",
      nameEn: "Chevvai / Mangal Dosha",
      status: "not_detected",
      statusLabelTa: "தோஷம் இல்லை",
      statusLabelEn: "Not Detected",
      houseFromLagna: 0,
      houseFromMoon: 0,
      evidenceFactors: [],
      cancellationFactors: [],
      explanationTa: "செவ்வாய் தோஷம் காணப்படவில்லை.",
      explanationEn: "No Chevvai Dosha detected.",
      guidanceTa: "பொதுவான திருமண பொருத்த ஆய்வு போதுமானது.",
      guidanceEn: "Standard compatibility rules apply.",
    };
  }

  const hLagna = houseFrom(mars.sign, ctx.lagnaSign);
  const hMoon = houseFrom(mars.sign, ctx.moonSign);

  const doshaHouses = [1, 2, 4, 7, 8, 12];
  const isPresentFromLagna = doshaHouses.includes(hLagna);
  const isPresentFromMoon = doshaHouses.includes(hMoon);

  if (!isPresentFromLagna && !isPresentFromMoon) {
    return {
      id: "chevvai-dosha",
      nameTa: "செவ்வாய் தோஷம்",
      nameEn: "Chevvai / Mangal Dosha",
      status: "not_detected",
      statusLabelTa: "தோஷம் இல்லை",
      statusLabelEn: "Not Detected",
      houseFromLagna: hLagna,
      houseFromMoon: hMoon,
      evidenceFactors: [`செவ்வாய் லக்னத்திலிருந்து ${hLagna}-ஆம் வீட்டிலும், சந்திரனிலிருந்து ${hMoon}-ஆம் வீட்டிலும் அமைந்துள்ளார்.`],
      cancellationFactors: [],
      explanationTa:
        "செவ்வாய் பகவான் லக்னம் மற்றும் சந்திரனுக்கு 1, 2, 4, 7, 8, 12 ஆகிய தோஷ ஸ்தானங்களில் அமையவில்லை. எனவே செவ்வாய் தோஷம் இல்லை.",
      explanationEn:
        "Mars does not occupy any of the traditional 1st, 2nd, 4th, 7th, 8th, or 12th houses from either Lagna or Moon.",
      guidanceTa: "செவ்வாய் தோஷக் கட்டுப்பாடுகள் ஏதுமின்றி வழக்கமான பொருத்தங்களை முன்னெடுக்கலாம்.",
      guidanceEn: "Normal horoscope compatibility matching can proceed without Kuja Dosha restrictions.",
    };
  }

  // Check classical cancellation/mitigation rules:
  const cancellations: string[] = [];

  // 1. Mars in own sign (Aries 0, Scorpio 7) or exalted (Capricorn 9)
  if ([0, 7].includes(mars.sign)) {
    cancellations.push("செவ்வாய் தனது சொந்த ஆட்சி ராசியில் (மேஷம்/விருச்சிகம்) அமைந்துள்ளார் (சுய க்ஷேத்திர விலக்கு).");
  }
  if (mars.sign === 9) {
    cancellations.push("செவ்வாய் தனது உச்ச ராசியான மகரத்தில் அமைந்துள்ளார் (உச்ச ஸ்தான விலக்கு).");
  }

  // 2. Mars conjunct Jupiter (Guru) or Moon
  const jup = ctx.bodies.jupiter;
  const moon = ctx.bodies.moon;
  if (jup && jup.sign === mars.sign) {
    cancellations.push("குரு பகவானுடன் செவ்வாய் இணைந்துள்ளதால் தோஷம் நிவர்த்தியாகிறது (குரு பார்வை/சேர்க்கை விலக்கு).");
  }
  if (moon && moon.sign === mars.sign) {
    cancellations.push("சந்திரனுடன் செவ்வாய் இணைந்து சந்திர-மங்கள சேர்க்கை பெற்றுள்ளதால் தோஷ வலிமை குறைகிறது.");
  }

  // 3. Mars aspected by Jupiter (Guru in 5th, 7th, 9th from Mars)
  if (jup) {
    const dist = houseFrom(jup.sign, mars.sign);
    if ([5, 7, 9].includes(dist)) {
      cancellations.push(`குருவின் சுப பார்வை (${dist}-ஆம் பார்வை) செவ்வாய் மீது விழுவதால் தோஷம் தணிகிறது.`);
    }
  }

  // 4. House and sign specific traditional Tamil rules
  if (hLagna === 2 && [2, 5].includes(mars.sign)) {
    cancellations.push("மிதுனம் அல்லது கன்னியில் 2-ஆம் வீட்டில் செவ்வாய் அமைந்தால் தோஷமில்லை.");
  }
  if (hLagna === 4 && [0, 7].includes(mars.sign)) {
    cancellations.push("மேஷம் அல்லது விருச்சிகத்தில் 4-ஆம் வீட்டில் செவ்வாய் அமைந்தால் தோஷமில்லை.");
  }
  if (hLagna === 7 && [3, 9].includes(mars.sign)) {
    cancellations.push("கடகம் அல்லது மகரத்தில் 7-ஆம் வீட்டில் செவ்வாய் அமைந்தால் தோஷமில்லை.");
  }
  if (hLagna === 8 && [8, 11].includes(mars.sign)) {
    cancellations.push("தனுசு அல்லது மீனத்தில் 8-ஆம் வீட்டில் செவ்வாய் அமைந்தால் தோஷமில்லை.");
  }
  if (hLagna === 12 && [1, 6].includes(mars.sign)) {
    cancellations.push("ரிஷபம் அல்லது துலாமில் 12-ஆம் வீட்டில் செவ்வாய் அமைந்தால் தோஷமில்லை.");
  }

  const isCancelled = cancellations.length > 0;
  const status: DoshaStatus = isCancelled ? "cancelled" : "detected";

  return {
    id: "chevvai-dosha",
    nameTa: "செவ்வாய் தோஷம்",
    nameEn: "Chevvai / Mangal Dosha",
    status,
    statusLabelTa: isCancelled ? "செவ்வாய் தோஷ விலக்கு / நிவர்த்தி" : "செவ்வாய் தோஷம் உள்ளது",
    statusLabelEn: isCancelled ? "Cancelled / Mitigated" : "Detected",
    houseFromLagna: hLagna,
    houseFromMoon: hMoon,
    evidenceFactors: [
      `செவ்வாய் லக்னத்திற்கு ${hLagna}-ஆம் இடத்திலும், சந்திரனுக்கு ${hMoon}-ஆம் இடத்திலும் அமர்ந்துள்ளார்.`,
      `Mars occupies the ${hLagna}th house from Lagna and ${hMoon}th house from Moon.`,
    ],
    cancellationFactors: cancellations,
    explanationTa: isCancelled
      ? "செவ்வாய் தோஷ ஸ்தானத்தில் அமைந்திருந்தாலும், பாரம்பரிய ஜோதிட விதிகளின்படி விலக்கு காரணிகள் பொருந்துவதால் தோஷத்தின் தீவிரம் வெகுவாகக் குறைந்து நிவர்த்தி பெறுகிறது."
      : "செவ்வாய் பகவான் தோஷ ஸ்தானத்தில் அமைந்திருப்பதால், திருமணப் பொருத்தத்தின் போது செவ்வாய் தோஷ அமைப்பைக் கொண்ட வரனுடன் இணைப்பது பாரம்பரியத்தில் பரிந்துரைக்கப்படுகிறது.",
    explanationEn: isCancelled
      ? "Although Mars is placed in a Kuja Dosha house, classical cancellation conditions apply, significantly mitigating the dosha."
      : "Mars is situated in a traditional Kuja Dosha house. In traditional Tamil astrology, matching with a chart of similar Kuja placement is recommended.",
    guidanceTa: isCancelled
      ? "தோஷ விலக்கு பெற்றுள்ளதால் அச்சம் கொள்ளத் தேவையில்லை; மனப்பொருத்தம் மற்றும் இதர அம்சங்களை முன்னிலைப்படுத்தலாம்."
      : "இதே போன்று செவ்வாய் தோஷம் உள்ள அல்லது விலக்கு பெற்ற வரனை இணைப்பது பாரம்பரிய வழக்கமாகும்.",
    guidanceEn: isCancelled
      ? "With classical cancellations active, marriage matching can proceed with standard astrological harmony."
      : "Traditionally matched with a prospective partner who also shares a corresponding Kuja Dosha placement.",
  };
}
