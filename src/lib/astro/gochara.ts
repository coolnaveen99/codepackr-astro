// Codepackr Astro - Gochara (கோசார) Transit Engine
// Section 1B of docs/codepackr-astro-tamil-astrology-roadmap.md
import {
  julianDay,
  siderealGrahas,
  nakshatra,
  signIndex,
  dmsText,
  norm360,
  houseFrom,
} from "./engine";
import {
  PLANETS,
  SIGNS_TA,
  SIGNS_EN,
  NAK_TA,
  NAK_EN,
  type PlanetId,
  type School,
} from "./constants";

export interface PlanetTransitInfo {
  id: PlanetId;
  nameTa: string;
  nameEn: string;
  glyph: string;
  lon: number;
  signIdx: number;
  signTa: string;
  signEn: string;
  dms: string;
  nakIdx: number;
  nakTa: string;
  nakEn: string;
  pada: number;
  retrograde: boolean;
  /** House number from Janma Rasi (1 - 12) */
  houseFromJanma: number;
  /** Classical auspiciousness status */
  isFavorable: boolean;
  statusLabelTa: string;
  statusLabelEn: string;
  effectSummaryTa: string;
  effectSummaryEn: string;
  classicalRuleTa: string;
  classicalRuleEn: string;
}

export interface SpecialTransitReport {
  // Saturn (சனி)
  isSadeSati: boolean;
  sadeSatiPhaseTa: string | null;
  sadeSatiPhaseEn: string | null;
  isAshtamaSani: boolean;
  isKandakaSani: boolean;
  saturnVerdictTa: string;
  saturnVerdictEn: string;

  // Jupiter (குரு)
  hasGuruBalam: boolean;
  guruHouse: number;
  guruVerdictTa: string;
  guruVerdictEn: string;

  // Rahu - Ketu
  rahuHouse: number;
  ketuHouse: number;
  rahuKetuVerdictTa: string;
  rahuKetuVerdictEn: string;

  // Chandrashtama
  isChandrashtama: boolean;
  moonHouse: number;
}

export interface GocharaResult {
  janmaRasiIdx: number;
  janmaRasiTa: string;
  janmaRasiEn: string;
  transitDateStr: string;
  school: School;
  planets: PlanetTransitInfo[];
  special: SpecialTransitReport;
  summaryTa: string;
  summaryEn: string;
}

/**
 * Classical Gochara favorable houses from Moon sign (Phaladeepika & Brihat Jataka):
 * Sun: 3, 6, 10, 11
 * Moon: 1, 3, 6, 7, 10, 11
 * Mars: 3, 6
 * Mercury: 2, 4, 6, 8, 10, 11
 * Jupiter: 2, 5, 7, 9, 11
 * Venus: 1, 2, 3, 4, 5, 8, 9, 11, 12
 * Saturn: 3, 6, 11
 * Rahu: 3, 6, 11
 * Ketu: 3, 6, 11
 */
const GOCHARA_FAVORABLE_HOUSES: Record<string, number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mars: [3, 6],
  mercury: [2, 4, 6, 8, 10, 11],
  jupiter: [2, 5, 7, 9, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  saturn: [3, 6, 11],
  rahu: [3, 6, 11],
  ketu: [3, 6, 11],
};

const PLANET_GOCHARA_TEXTS: Record<string, Record<number, { ta: string; en: string }>> = {
  saturn: {
    1: { ta: "ஜென்மச் சனி: உடல் சோர்வு, அலைச்சல், அதிக உழைப்பு தேவைப்படும்.", en: "Janma Sani: Physical fatigue, hard work and patience required." },
    2: { ta: "பாதச் சனி: குடும்பச் செலவுகள், பேச்சில் நிதானம் தேவை.", en: "Padha Sani: Financial expenses, caution in family speech." },
    3: { ta: "3-ல் சனி: அதீத வெற்றி, தைரியம், புதிய முயற்சிகளில் ஆதாயம்.", en: "Saturn in 3rd: High courage, success in ventures, gain." },
    4: { ta: "அர்த்தாஷ்டமச் சனி: தாயார் உடல்நலம், வீடு வாகன பராமரிப்பு கவனம்.", en: "Ardhastama Sani: Care for mother's health, property maintenance." },
    5: { ta: "5-ல் சனி: பிள்ளைகள் நலம், சிந்தனையில் தெளிவு தேவை.", en: "Saturn in 5th: Attention to children, careful decision making." },
    6: { ta: "6-ல் சனி: எதிரிகள் வீழ்ச்சி, கடன் சுமை குறையும், நற்பலன்.", en: "Saturn in 6th: Victory over obstacles, relief from debts." },
    7: { ta: "கண்டகச் சனி: களத்திர ஸ்தானம், கூட்டாளிகள் உறவில் கவனம்.", en: "Kandaka Sani: Partnerships and marital affairs require harmony." },
    8: { ta: "அஷ்டமச் சனி: காரியத் தடை, வாகன ஓட்டுதலில் நிதானம்.", en: "Ashtama Sani: Delays in tasks, extreme caution while driving." },
    9: { ta: "பாக்கியச் சனி: தந்தையார் நலம், நீண்ட பயணங்களில் எச்சரிக்கை.", en: "Bhagya Sani: Health of elders, mindfulness in long journeys." },
    10: { ta: "கர்மச் சனி: வேலைப்பளு, தொழிலில் புதிய பொறுப்புகள்.", en: "Karma Sani: High work pressure, new occupational duties." },
    11: { ta: "11-ல் சனி (லாபச் சனி): பண வரவு, ஆசை நிறைவேறும், சிறந்த காலம்.", en: "Saturn in 11th: Financial gains, fulfillment of goals, excellent." },
    12: { ta: "விரயச் சனி: தேவையற்ற செலவுகள், வெளிநாட்டு அலைச்சல்.", en: "Viraya Sani: Unavoidable expenditures, sleep disturbances." },
  },
  jupiter: {
    1: { ta: "ஜென்ம குரு: இடப்பெயர்ச்சி, யோசித்து முடிவெடுக்க வேண்டும்.", en: "Janma Guru: Relocations, cautious life planning." },
    2: { ta: "2-ல் குரு (தன குரு): சிறந்த பண வரவு, வாக்கு பலிதம், குடும்ப மேன்மை.", en: "Guru in 2nd: Financial prosperity, sweet speech, family harmony." },
    3: { ta: "3-ல் குரு: சகோதர உதவி, கூடுதல் முயற்சிக்குப் பின் வெற்றி.", en: "Guru in 3rd: Effort-driven results, sibling interactions." },
    4: { ta: "4-ல் குரு: சுக ஸ்தானத்தில் கவனம், தாய் வழி நன்மை.", en: "Guru in 4th: Domestic comfort, modest progress." },
    5: { ta: "5-ல் குரு (பூர்வ புண்ணியம்): புத்திர பாக்கியம், அறிவுத்திறன் மிளிரும்.", en: "Guru in 5th: Blessings for children, high intellect & luck." },
    6: { ta: "6-ல் குரு: ஆரோக்கியத்தில் கவனம், கடன் வாங்காமல் இருப்பது நல்லது.", en: "Guru in 6th: Health discipline, avoid taking new loans." },
    7: { ta: "7-ல் குரு (களத்திர குரு): திருமண சுபகாரியம், கூட்டுத் தொழில் வெற்றி.", en: "Guru in 7th: Auspicious events, matrimonial bliss, partnership success." },
    8: { ta: "8-ல் குரு: எதிர்பாராத அலைச்சல், வழிபாடுகள் நலம் பயக்கும்.", en: "Guru in 8th: Unexpected journeys, divine remedies recommended." },
    9: { ta: "9-ல் குரு (பாக்கிய குரு): தர்ம காரியங்கள், தந்தையார் ஆதரவு, சகல சௌபாக்கியம்.", en: "Guru in 9th: Supreme fortune, mentor support, pilgrimage." },
    10: { ta: "10-ல் குரு: பதவி மாற்றம், உத்தியோகத்தில் கூடுதல் கவனம்.", en: "Guru in 10th: Career transitions, professional diligence required." },
    11: { ta: "11-ல் குரு (லாப குரு): பெரும் பொருள் வரவு, உயர் நட்பு, வெற்றிகள்.", en: "Guru in 11th: Wealth accumulation, noble alliances, high gains." },
    12: { ta: "12-ல் குரு: சுபச் செலவுகள், ஆன்மீக ஈடுபாடு.", en: "Guru in 12th: Auspicious spending, spiritual inclinations." },
  },
};

export function calculateGochara(
  janmaRasiIdx: number,
  targetDate: { year: number; month: number; day: number; hour?: number; minute?: number },
  tz: number = 5.5,
  school: School = "thirukanitham"
): GocharaResult {
  const hour = targetDate.hour ?? 12;
  const minute = targetDate.minute ?? 0;
  const jd = julianDay(targetDate.year, targetDate.month, targetDate.day, hour + minute / 60 - tz);

  const grahas = siderealGrahas(jd, school);

  const targetPlanets: PlanetId[] = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
    "rahu",
    "ketu",
  ];

  const planetInfos: PlanetTransitInfo[] = [];

  for (const id of targetPlanets) {
    const lon = grahas.bodies[id];
    const sIdx = signIndex(lon);
    const nak = nakshatra(lon);
    const house = houseFrom(sIdx, janmaRasiIdx);
    const isFav = (GOCHARA_FAVORABLE_HOUSES[id] ?? []).includes(house);

    const isRetro = (grahas.retro as Record<string, boolean>)[id] ?? false;

    // Get specific or general text
    const specificText = PLANET_GOCHARA_TEXTS[id]?.[house];
    const statusLabelTa = isFav ? "சுப கோசாரம் (நன்மை)" : "கவனம் தேவை";
    const statusLabelEn = isFav ? "Auspicious Transit" : "Caution / Neutral";

    const effectSummaryTa = specificText?.ta ??
      (isFav
        ? `${house}-ஆம் பாவ கோசாரம் சாதகமானது · பண வரவு மற்றும் முயற்சிகள் கைகூடும்.`
        : `${house}-ஆம் பாவ கோசாரம் · கூடுதல் கவனமும் விவேகமும் நலம் தரும்.`);

    const effectSummaryEn = specificText?.en ??
      (isFav
        ? `Favorable placement in house ${house} bringing positive flow.`
        : `House ${house} placement calls for moderation and patience.`);

    const classicalRuleTa = `விதி: ${house}-ஆம் வீட்டில் கோசார சஞ்சாரம் (${isFav ? "சுப ஸ்தானம்" : "அசுப ஸ்தானம்"}).`;
    const classicalRuleEn = `Classical rule: Transit through house ${house} (${isFav ? "Benefic" : "Challenging"}).`;

    const planetMeta = PLANETS.find((p) => p.id === id)!;

    planetInfos.push({
      id,
      nameTa: planetMeta.ta,
      nameEn: planetMeta.en,
      glyph: planetMeta.glyph,
      lon,
      signIdx: sIdx,
      signTa: SIGNS_TA[sIdx],
      signEn: SIGNS_EN[sIdx],
      dms: dmsText(lon),
      nakIdx: nak.idx,
      nakTa: NAK_TA[nak.idx],
      nakEn: NAK_EN[nak.idx],
      pada: nak.pada,
      retrograde: isRetro,
      houseFromJanma: house,
      isFavorable: isFav,
      statusLabelTa,
      statusLabelEn,
      effectSummaryTa,
      effectSummaryEn,
      classicalRuleTa,
      classicalRuleEn,
    });
  }

  // Analyze Special Transits
  const saturnInfo = planetInfos.find((p) => p.id === "saturn")!;
  const jupiterInfo = planetInfos.find((p) => p.id === "jupiter")!;
  const rahuInfo = planetInfos.find((p) => p.id === "rahu")!;
  const ketuInfo = planetInfos.find((p) => p.id === "ketu")!;
  const moonInfo = planetInfos.find((p) => p.id === "moon")!;

  // Sade Sati (12, 1, 2)
  const isSadeSati = [12, 1, 2].includes(saturnInfo.houseFromJanma);
  let sadeSatiPhaseTa: string | null = null;
  let sadeSatiPhaseEn: string | null = null;
  if (saturnInfo.houseFromJanma === 12) {
    sadeSatiPhaseTa = "விரயச் சனி (முதல் சுற்றுக் காலம்)";
    sadeSatiPhaseEn = "Viraya Sani (First Phase - 12th House)";
  } else if (saturnInfo.houseFromJanma === 1) {
    sadeSatiPhaseTa = "ஜென்மச் சனி (இரண்டாம் சுற்றுக் காலம்)";
    sadeSatiPhaseEn = "Janma Sani (Peak Phase - 1st House)";
  } else if (saturnInfo.houseFromJanma === 2) {
    sadeSatiPhaseTa = "பாதச் சனி (இறுதி சுற்றுக் காலம்)";
    sadeSatiPhaseEn = "Padha Sani (Final Phase - 2nd House)";
  }

  const isAshtamaSani = saturnInfo.houseFromJanma === 8;
  const isKandakaSani = [4, 7, 10].includes(saturnInfo.houseFromJanma);

  let saturnVerdictTa = "";
  let saturnVerdictEn = "";
  if (isSadeSati) {
    saturnVerdictTa = `ஏழரைச் சனி நடப்பில் உள்ளது (${sadeSatiPhaseTa}). விவேகமான உழைப்பும் தர்ம காரியங்களும் வெற்றியைத் தரும்.`;
    saturnVerdictEn = `Sade Sati is currently active (${sadeSatiPhaseEn}). Dedicated hard work and disciplined lifestyle will reward.`;
  } else if (isAshtamaSani) {
    saturnVerdictTa = "அஷ்டமச் சனி நடப்பில் உள்ளது. பெரிய முடிவுகளில் அவசரம் தவிர்த்து, நிதானமாகச் செயல்படவும்.";
    saturnVerdictEn = "Ashtama Sani active (8th house). Avoid hasty decisions and drive with caution.";
  } else if (isKandakaSani) {
    saturnVerdictTa = `கண்டகச் சனி (${saturnInfo.houseFromJanma}-ஆம் இடம்). உழைப்பும் பொறுமையும் அவசியம்.`;
    saturnVerdictEn = `Kandaka Sani (${saturnInfo.houseFromJanma}th house). Patience in professional and personal relationships required.`;
  } else if ([3, 6, 11].includes(saturnInfo.houseFromJanma)) {
    saturnVerdictTa = `சனி பகவான் சுப ஸ்தானத்தில் (${saturnInfo.houseFromJanma}-ஆம் இடம்). எதிர்ப்புகளை வெல்லும் காலம்.`;
    saturnVerdictEn = `Saturn in an auspicious upachaya house (${saturnInfo.houseFromJanma}th). Excellent for overcoming challenges.`;
  } else {
    saturnVerdictTa = `சனி பகவான் ${saturnInfo.houseFromJanma}-ஆம் இடத்தில் சஞ்சரிக்கிறார்.`;
    saturnVerdictEn = `Saturn is transiting house ${saturnInfo.houseFromJanma}.`;
  }

  // Guru Balam (2, 5, 7, 9, 11)
  const hasGuruBalam = [2, 5, 7, 9, 11].includes(jupiterInfo.houseFromJanma);
  const guruVerdictTa = hasGuruBalam
    ? `குரு பலம் உண்டு! குரு பகவான் ${jupiterInfo.houseFromJanma}-ஆம் இடத்தில் சுப பலன்களை அள்ளித் தரும் அமைப்பில் உள்ளார்.`
    : `குரு பகவான் ${jupiterInfo.houseFromJanma}-ஆம் இடத்தில் சஞ்சரிக்கிறார். குரு வழிபாடும் ஆன்மீக ஈடுபாடும் யோகத்தை அதிகரிக்கும்.`;
  const guruVerdictEn = hasGuruBalam
    ? `Guru Balam is Active! Jupiter in the ${jupiterInfo.houseFromJanma}th house showers auspicious support for ventures and marriage.`
    : `Jupiter transits house ${jupiterInfo.houseFromJanma}. Daily prayers and mindfulness enhance favorable outcomes.`;

  // Rahu / Ketu
  const rahuKetuVerdictTa = `ராகு ${rahuInfo.houseFromJanma}-ஆம் இடத்திலும், கேது ${ketuInfo.houseFromJanma}-ஆம் இடத்திலும் சஞ்சரிக்கின்றனர்.`;
  const rahuKetuVerdictEn = `Rahu transits house ${rahuInfo.houseFromJanma} and Ketu transits house ${ketuInfo.houseFromJanma}.`;

  // Chandrashtama
  const isChandrashtama = moonInfo.houseFromJanma === 8;

  const special: SpecialTransitReport = {
    isSadeSati,
    sadeSatiPhaseTa,
    sadeSatiPhaseEn,
    isAshtamaSani,
    isKandakaSani,
    saturnVerdictTa,
    saturnVerdictEn,
    hasGuruBalam,
    guruHouse: jupiterInfo.houseFromJanma,
    guruVerdictTa,
    guruVerdictEn,
    rahuHouse: rahuInfo.houseFromJanma,
    ketuHouse: ketuInfo.houseFromJanma,
    rahuKetuVerdictTa,
    rahuKetuVerdictEn,
    isChandrashtama,
    moonHouse: moonInfo.houseFromJanma,
  };

  const favorableCount = planetInfos.filter((p) => p.isFavorable).length;
  const summaryTa = `இன்றைய கோசாரத்தில் 9 கிரகங்களில் ${favorableCount} கிரகங்கள் உங்கள் ராசிக்கு சுப ஸ்தானங்களில் சஞ்சரிக்கின்றன. ${hasGuruBalam ? "குரு பலம் அருமையாக உள்ளது." : ""} ${isChandrashtama ? "இன்று சந்திராஷ்டமம் உள்ளதால் நிதானம் தேவை." : ""}`;
  const summaryEn = `Today, ${favorableCount} out of 9 celestial bodies are transiting favorable houses for your Janma Rasi. ${hasGuruBalam ? "Guru Balam is fully supportive." : ""} ${isChandrashtama ? "Today is Chandrashtamam, exercise mindful calm." : ""}`;

  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const transitDateStr = `${targetDate.day} ${monthsEn[targetDate.month - 1]} ${targetDate.year}`;

  return {
    janmaRasiIdx,
    janmaRasiTa: SIGNS_TA[janmaRasiIdx],
    janmaRasiEn: SIGNS_EN[janmaRasiIdx],
    transitDateStr,
    school,
    planets: planetInfos,
    special,
    summaryTa,
    summaryEn,
  };
}
