// Codepackr Astro — Traditional 10-Porutham (Dasakoota) Matching Engine
import { signIndex } from "../astronomy/coordinates";
import { nakshatraDetails } from "../calendar/nakshatra";
import { GANA_NAK, YONI_NAK, YONI_ENEMY, SIGN_LORD, NAT_FRIEND, NAT_ENEMY } from "../tables";

export type PoruthamItem = {
  id: string;
  nameTa: string;
  nameEn: string;
  status: "excellent" | "moderate" | "not_matching";
  statusTa: string;
  statusEn: string;
  points: number;
  maxPoints: number;
  ruleExplanationTa: string;
  ruleExplanationEn: string;
  essential: boolean; // Rajju and Dina are critical in Tamil tradition
};

export type DasakootaResult = {
  items: PoruthamItem[];
  totalScore: number;
  maxScore: number;
  overallSuitabilityTa: string;
  overallSuitabilityEn: string;
  rajjuPass: boolean;
  dinaPass: boolean;
  vitalSummaryTa: string;
  vitalSummaryEn: string;
};

// Rajju grouping of 27 Nakshatras (0 to 26) into 5 Rajjus:
// 0: Siro (Head), 1: Kanta (Neck), 2: Udar / Nabhi (Stomach), 3: Kati (Waist), 4: Pada (Feet)
export const RAJJU_GROUP = [
  4, 3, 2, 1, 0, // Ashwini(4), Bharani(3), Krittika(2), Rohini(1), Mrigashirsha(0)
  0, 1, 2, 3, 4, // Ardra(0), Punarvasu(1), Pushya(2), Ashlesha(3), Magha(4)
  4, 3, 2, 1, 0, // Purva Phalguni(4), Uttara Phalguni(3), Hasta(2), Chitra(0)...
  0, 1, 2, 3, 4,
  4, 3, 2, 1, 0,
  0, 1,
];

// Vedha pairs (mutually repulsive stars):
export const VEDHA_PAIRS: [number, number][] = [
  [0, 17], // Ashwini - Jyeshtha
  [1, 16], // Bharani - Anuradha
  [2, 15], // Krittika - Vishakha
  [3, 14], // Rohini - Swati
  [4, 13], // Mrigashirsha - Chitra
  [5, 21], // Ardra - Shravana
  [6, 20], // Punarvasu - Uttara Ashadha
  [7, 19], // Pushya - Purva Ashadha
  [8, 18], // Ashlesha - Mula
  [9, 26], // Magha - Revati
  [10, 25], // Purva Phalguni - Uttara Bhadrapada
  [11, 24], // Uttara Phalguni - Purva Bhadrapada
  [12, 23], // Hasta - Shatabhisha
];

// Vasya pairs (Rasi attraction):
export const VASYA_MAP: Record<number, number[]> = {
  0: [4, 7],      // Mesha: Simha, Vrischika
  1: [3, 6],      // Vrishabha: Karka, Tula
  2: [5],         // Mithuna: Kanya
  3: [7, 8],      // Karka: Vrischika, Dhanu
  4: [6],         // Simha: Tula
  5: [2, 11],     // Kanya: Mithuna, Meena
  6: [9],         // Tula: Makara
  7: [3],         // Vrischika: Karka
  8: [11],        // Dhanu: Meena
  9: [0, 10],     // Makara: Mesha, Kumbha
  10: [0],        // Kumbha: Mesha
  11: [9],        // Meena: Makara
};

/**
 * Evaluates the full traditional Tamil 10-Porutham (Dasakoota) between Bride and Groom.
 */
export function evaluateDasakoota(boyMoonLon: number, girlMoonLon: number): DasakootaResult {
  const bs = signIndex(boyMoonLon);
  const gs = signIndex(girlMoonLon);
  const bn = nakshatraDetails(boyMoonLon).index;
  const gn = nakshatraDetails(girlMoonLon).index;

  const items: PoruthamItem[] = [];

  // 1. Dina Porutham (Count from Bride's star to Groom's star)
  const countToBoy = ((bn - gn + 27) % 27) + 1;
  const rem9 = countToBoy % 9;
  // Favorable Tara numbers: 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Parama Mitra)
  const dinaPass = [2, 4, 6, 8, 0].includes(rem9);
  items.push({
    id: "dina",
    nameTa: "தினப் பொருத்தம்",
    nameEn: "Dina Porutham",
    status: dinaPass ? "excellent" : "not_matching",
    statusTa: dinaPass ? "உத்தமம்" : "பொருந்தாது",
    statusEn: dinaPass ? "Favorable" : "Not Matching",
    points: dinaPass ? 3 : 0,
    maxPoints: 3,
    essential: true,
    ruleExplanationTa: dinaPass
      ? `பெண் நட்சத்திரத்திலிருந்து ${countToBoy}-ஆவது நட்சத்திரமாக அமைவது சுப தாரையாகும். உடல்நலம் மற்றும் ஆயுள் விருத்திக்கு நலம் பயக்கும்.`
      : `பெண் நட்சத்திரத்திலிருந்து ${countToBoy}-ஆவது நட்சத்திரமாக வருவது சாதகமான தாரையில் அமையவில்லை.`,
    ruleExplanationEn: dinaPass
      ? `Tara count of ${countToBoy} falls on an auspicious Tara disposition, supporting vitality and longevity.`
      : `Tara count of ${countToBoy} does not fall on an auspicious Tara disposition.`,
  });

  // 2. Gana Porutham (Temperament harmony: Deva 0, Manushya 1, Rakshasa 2)
  const g1 = GANA_NAK[gn] ?? 1; // Girl
  const g2 = GANA_NAK[bn] ?? 1; // Boy
  let ganaStatus: "excellent" | "moderate" | "not_matching" = "not_matching";
  let ganaPts = 0;
  if (g1 === g2) {
    ganaStatus = "excellent";
    ganaPts = 6;
  } else if ((g1 === 0 && g2 === 1) || (g1 === 1 && g2 === 0)) {
    ganaStatus = "moderate";
    ganaPts = 5;
  } else if (g1 === 0 && g2 === 2) {
    ganaStatus = "moderate";
    ganaPts = 2;
  }
  items.push({
    id: "gana",
    nameTa: "கணப் பொருத்தம்",
    nameEn: "Gana Porutham",
    status: ganaStatus,
    statusTa: ganaStatus === "excellent" ? "உத்தமம்" : ganaStatus === "moderate" ? "மத்திமம்" : "பொருந்தாது",
    statusEn: ganaStatus === "excellent" ? "Excellent" : ganaStatus === "moderate" ? "Moderate" : "Not Matching",
    points: ganaPts,
    maxPoints: 6,
    essential: false,
    ruleExplanationTa:
      ganaPts >= 5
        ? "தம்பதியரின் மன இயல்பு, அணுகுமுறை மற்றும் பழக்கவழக்கங்களில் பரஸ்பர இணக்கமும் ஒற்றுமையும் உண்டாகும்."
        : "கண வேறுபாடுகள் காணப்படுவதால் புரிந்துணர்வும் விட்டுக்கொடுக்கும் மனப்பான்மையும் அவசியம்.",
    ruleExplanationEn:
      ganaPts >= 5
        ? "Compatible temperaments supporting peaceful co-existence and mutual understanding."
        : "Differing innate temperaments; mutual adaptation and accommodation are advised.",
  });

  // 3. Mahendra Porutham (Progeny and family well-being: 4, 7, 10, 13, 16, 19, 22, 25)
  const mahendraList = [4, 7, 10, 13, 16, 19, 22, 25];
  const mahendraPass = mahendraList.includes(countToBoy);
  items.push({
    id: "mahendra",
    nameTa: "மகேந்திரப் பொருத்தம்",
    nameEn: "Mahendra Porutham",
    status: mahendraPass ? "excellent" : "not_matching",
    statusTa: mahendraPass ? "உத்தமம்" : "பொருந்தாது",
    statusEn: mahendraPass ? "Favorable" : "Not Present",
    points: mahendraPass ? 2 : 0,
    maxPoints: 2,
    essential: false,
    ruleExplanationTa: mahendraPass
      ? "சந்ததி விருத்தி, வம்ச வளர்ச்சி மற்றும் குடும்ப ஆசீர்வாதத்தைக் குறிக்கும் மகேந்திரப் பொருத்தம் அமைந்துள்ளது."
      : "மகேந்திரப் பொருத்தம் இல்லை; ஜாதகத்தில் 5-ஆம் வீட்டின் பலத்தை வைத்து சந்ததி விருத்தியை உறுதி செய்யலாம்.",
    ruleExplanationEn: mahendraPass
      ? "Auspicious configuration supporting lineage continuation, family welfare, and progeny."
      : "Mahendra factor absent; progeny potential evaluated through 5th house and Jupiter strength.",
  });

  // 4. Stree Deergha Porutham (Count > 13 from Girl to Boy)
  const streePass = countToBoy >= 13;
  items.push({
    id: "stree_deergha",
    nameTa: "ஸ்திரீ தீர்க்கப் பொருத்தம்",
    nameEn: "Stree Deergha Porutham",
    status: streePass ? "excellent" : countToBoy >= 7 ? "moderate" : "not_matching",
    statusTa: streePass ? "உத்தமம்" : countToBoy >= 7 ? "மத்திமம்" : "பொருந்தாது",
    statusEn: streePass ? "Excellent" : countToBoy >= 7 ? "Moderate" : "Close Distance",
    points: streePass ? 2 : countToBoy >= 7 ? 1 : 0,
    maxPoints: 2,
    essential: false,
    ruleExplanationTa: streePass
      ? `பெண் நட்சத்திரத்திலிருந்து ஆண் நட்சத்திரம் ${countToBoy} தொலைவில் இருப்பதால் நீண்ட மங்கள வாழ்வும் குடும்ப வளமும் சேரும்.`
      : "நட்சத்திர இடைவெளி குறைவான தூரத்தில் அமைந்துள்ளது.",
    ruleExplanationEn: streePass
      ? `Distance of ${countToBoy} stars satisfies traditional guidelines for long-term domestic prosperity.`
      : `Distance is less than the traditional ideal of 13 stars.`,
  });

  // 5. Yoni Porutham (Physical harmony & affection)
  const yoniGirl = YONI_NAK[gn] ?? 0;
  const yoniBoy = YONI_NAK[bn] ?? 0;
  const isSameYoni = yoniGirl === yoniBoy;
  const isEnemyYoni = YONI_ENEMY.some(
    ([a, b]) => (a === yoniGirl && b === yoniBoy) || (a === yoniBoy && b === yoniGirl)
  );
  const yoniStatus = isSameYoni ? "excellent" : isEnemyYoni ? "not_matching" : "moderate";
  const yoniPts = isSameYoni ? 4 : isEnemyYoni ? 0 : 2;
  items.push({
    id: "yoni",
    nameTa: "யோனிப் பொருத்தம்",
    nameEn: "Yoni Porutham",
    status: yoniStatus,
    statusTa: yoniStatus === "excellent" ? "உத்தமம்" : yoniStatus === "moderate" ? "மத்திமம்" : "பொருந்தாது",
    statusEn: yoniStatus === "excellent" ? "Excellent" : yoniStatus === "moderate" ? "Moderate" : "Inimical",
    points: yoniPts,
    maxPoints: 4,
    essential: false,
    ruleExplanationTa:
      yoniPts >= 2
        ? "தம்பதியரிடையே உடல்ரீதியான திருப்தி, பரஸ்பர ஈர்ப்பு மற்றும் நெருக்கமான அன்பிற்கு யோனிப் பொருத்தம் உகந்தது."
        : "பகை யோனிகள் என்பதால் தாம்பத்யத்தில் பரஸ்பர அனுசரிப்பு தேவைப்படுகிறது.",
    ruleExplanationEn:
      yoniPts >= 2
        ? "Harmonious animal instincts supporting mutual affection, intimacy, and biological compatibility."
        : "Inimical animal archetypes; traditional texts recommend extra understanding in marital life.",
  });

  // 6. Rasi Porutham (Count of signs from Girl Rasi to Boy Rasi)
  const rasiDiff = ((bs - gs + 12) % 12) + 1;
  const badRasi = [2, 6, 8, 12]; // Shashtashtaka (6/8), Dwirdwadasa (2/12)
  const rasiPass = !badRasi.includes(rasiDiff);
  items.push({
    id: "rasi",
    nameTa: "ராசிப் பொருத்தம்",
    nameEn: "Rasi Porutham",
    status: rasiPass ? "excellent" : "not_matching",
    statusTa: rasiPass ? "உத்தமம்" : "பொருந்தாது (சஷ்டாஷ்டகம் / 2-12)",
    statusEn: rasiPass ? "Favorable" : "Shashtashtaka / 2-12",
    points: rasiPass ? 7 : 0,
    maxPoints: 7,
    essential: true,
    ruleExplanationTa: rasiPass
      ? `பெண் ராசியிலிருந்து ஆண் ராசி ${rasiDiff}-ஆம் இடமாக அமைந்து பரஸ்பர உறவு வளம் சேர்க்கிறது.`
      : `பெண் ராசியிலிருந்து ${rasiDiff}-ஆம் இடமாக அமைவது (சஷ்டாஷ்டகம் அல்லது 2-12) அமைப்பாகும்; ராசியாதிபதி ஒற்றுமை உள்ளதா எனப் பார்க்க வேண்டும்.`,
    ruleExplanationEn: rasiPass
      ? `House distance of ${rasiDiff} avoids Shashtashtaka (6/8) or Dwirdwadasa (2/12) afflictions.`
      : `Signs form an unfavorable 6/8 or 2/12 relationship requiring planetary friendship cancellation.`,
  });

  // 7. Rasiyathipathi Porutham (Planetary friendship between sign lords)
  const lordBoy = SIGN_LORD[bs]!;
  const lordGirl = SIGN_LORD[gs]!;
  const isFriend = (a: string, b: string) =>
    a === b || (NAT_FRIEND as Record<string, string[]>)[a]?.includes(b);
  const isEnemy = (a: string, b: string) =>
    (NAT_ENEMY as Record<string, string[]>)[a]?.includes(b);

  let rasiLordPts = 2.5;
  if (lordBoy === lordGirl) rasiLordPts = 5;
  else if (isFriend(lordBoy, lordGirl) && isFriend(lordGirl, lordBoy)) rasiLordPts = 5;
  else if (isEnemy(lordBoy, lordGirl) && isEnemy(lordGirl, lordBoy)) rasiLordPts = 0;
  else if (isFriend(lordBoy, lordGirl) || isFriend(lordGirl, lordBoy)) rasiLordPts = 3.5;

  items.push({
    id: "rasiyathipathi",
    nameTa: "ராசியாதிபதிப் பொருத்தம்",
    nameEn: "Rasiyathipathi Porutham",
    status: rasiLordPts >= 3.5 ? "excellent" : rasiLordPts > 0 ? "moderate" : "not_matching",
    statusTa: rasiLordPts >= 3.5 ? "உத்தமம்" : rasiLordPts > 0 ? "மத்திமம்" : "பொருந்தாது",
    statusEn: rasiLordPts >= 3.5 ? "Friendly" : rasiLordPts > 0 ? "Neutral" : "Inimical",
    points: rasiLordPts,
    maxPoints: 5,
    essential: false,
    ruleExplanationTa:
      rasiLordPts >= 3.5
        ? `ராசி நாதர்களான ${lordGirl} மற்றும் ${lordBoy} இடையே நட்பு/சமநிலை காணப்படுவதால் அமைதியும் மனஒற்றுமையும் நிலவும்.`
        : `ராசி நாதர்களுக்குள் நட்பு குறைவாக உள்ளதால் குடும்ப நிர்வாகத்தில் கருத்து வேறுபாடுகளைத் தவிர்க்க வேண்டும்.`,
    ruleExplanationEn:
      rasiLordPts >= 3.5
        ? `Planetary rulers ${lordGirl} and ${lordBoy} share mutual friendship or identity, ensuring harmony.`
        : `Planetary rulers have differing natural dispositions.`,
  });

  // 8. Vasya Porutham (Magnetic attraction)
  const vasyaList = VASYA_MAP[gs] ?? [];
  const vasyaPass = vasyaList.includes(bs);
  items.push({
    id: "vasya",
    nameTa: "வசியப் பொருத்தம்",
    nameEn: "Vasya Porutham",
    status: vasyaPass ? "excellent" : "not_matching",
    statusTa: vasyaPass ? "உத்தமம்" : "பொருந்தாது",
    statusEn: vasyaPass ? "Attracted" : "Not Present",
    points: vasyaPass ? 2 : 0,
    maxPoints: 2,
    essential: false,
    ruleExplanationTa: vasyaPass
      ? "ராசிகளுக்கு இடையே இயல்பான வசியம் மற்றும் அன்பின் ஈர்ப்பு உண்டு."
      : "வசியப் பொருத்தம் அமையவில்லை; மற்ற பொருத்தங்களின் பலத்தால் நல்லிணக்கம் அமையும்.",
    ruleExplanationEn: vasyaPass
      ? "Mutual instinctive attraction and affection between the signs."
      : "Vasya factor not activated; other positive factors can bridge the dynamic.",
  });

  // 9. Rajju Porutham (MOST CRITICAL: Mangalya strength & longevity)
  const rajjuGirl = RAJJU_GROUP[gn] ?? 0;
  const rajjuBoy = RAJJU_GROUP[bn] ?? 0;
  const rajjuPass = rajjuGirl !== rajjuBoy;
  const rajjuNames = ["சிரோ (தலை)", "கண்ட (கழுத்து)", "உதர (வயிறு)", "கடி (இடை)", "பாத (கால்)"];

  items.push({
    id: "rajju",
    nameTa: "ரஜ்ஜுப் பொருத்தம் (மாங்கல்ய பலம்)",
    nameEn: "Rajju Porutham",
    status: rajjuPass ? "excellent" : "not_matching",
    statusTa: rajjuPass ? "உத்தமம் (ஏக ரஜ்ஜு இல்லை)" : "பொருந்தாது (ஒரே ரஜ்ஜு)",
    statusEn: rajjuPass ? "Excellent (Different Rajju)" : "Afflicted (Same Rajju)",
    points: rajjuPass ? 5 : 0,
    maxPoints: 5,
    essential: true,
    ruleExplanationTa: rajjuPass
      ? `இருவருக்கும் வெவ்வேறு ரஜ்ஜு அமைந்திருப்பது (பெண்: ${rajjuNames[rajjuGirl]}, ஆண்: ${rajjuNames[rajjuBoy]}) மாங்கல்ய பாக்கியத்தையும் தம்பதியர் நீண்ட ஆயுளையும் தரும்.`
      : `இருவருக்கும் ஒரே ரஜ்ஜு (${rajjuNames[rajjuGirl]}) அமைந்திருப்பது ஏக ரஜ்ஜு தோஷமாகும். பாரம்பரியத்தில் இது முக்கியமாக கவனிக்கப்பட வேண்டிய அமைப்பாகும்.`,
    ruleExplanationEn: rajjuPass
      ? `Bride and Groom belong to different Rajjus, protecting marital longevity and happiness.`
      : `Both share the same Rajju (${rajjuNames[rajjuGirl]}), indicating Eka Rajju Dosha in traditional astrology.`,
  });

  // 10. Vedha Porutham (Repulsion / affliction elimination)
  const isVedha = VEDHA_PAIRS.some(
    ([a, b]) => (a === gn && b === bn) || (a === bn && b === gn)
  );
  const vedhaPass = !isVedha;
  items.push({
    id: "vedha",
    nameTa: "வேதைப் பொருத்தம்",
    nameEn: "Vedha Porutham",
    status: vedhaPass ? "excellent" : "not_matching",
    statusTa: vedhaPass ? "உத்தமம் (வேதை இல்லை)" : "பொருந்தாது (வேதை உள்ளது)",
    statusEn: vedhaPass ? "No Affliction" : "Vedha Affliction",
    points: vedhaPass ? 2 : 0,
    maxPoints: 2,
    essential: true,
    ruleExplanationTa: vedhaPass
      ? "இருவரின் நட்சத்திரங்களுக்குள் பரஸ்பர வேதை (பகைத் தாக்குதல்) இல்லை. மன அமைதிக்கு நலம்."
      : "நட்சத்திரங்களுக்கு இடையே வேதை தோஷம் உள்ளது; துயரங்களைத் தவிர்க்க வேதை நட்சத்திரங்களைத் தவிர்ப்பது பாரம்பரியம்.",
    ruleExplanationEn: vedhaPass
      ? "Stars are free from mutual Vedha affliction, assuring peaceful co-existence."
      : "Stars form a classical Vedha (mutual repulsion) pair.",
  });

  const totalScore = items.reduce((sum, item) => sum + item.points, 0);
  const maxScore = items.reduce((sum, item) => sum + item.maxPoints, 0);

  let suitabilityTa = "மத்திமமான பொருத்தம்";
  let suitabilityEn = "Moderate match";

  if (rajjuPass && dinaPass && totalScore >= 20) {
    suitabilityTa = "மிகச் சிறந்த சுபப் பொருத்தம் (உத்தமம்)";
    suitabilityEn = "Excellent traditional match";
  } else if (!rajjuPass) {
    suitabilityTa = "ரஜ்ஜு தடையாக உள்ளது (ஆலோசனை தேவை)";
    suitabilityEn = "Eka Rajju affliction present; caution advised";
  } else if (totalScore < 15) {
    suitabilityTa = "குறைந்த பொருத்தம்";
    suitabilityEn = "Low overall traditional score";
  }

  return {
    items,
    totalScore,
    maxScore,
    overallSuitabilityTa: suitabilityTa,
    overallSuitabilityEn: suitabilityEn,
    rajjuPass,
    dinaPass,
    vitalSummaryTa: rajjuPass
      ? "ரஜ்ஜு மற்றும் முக்கிய பொருத்தங்கள் அமைந்துள்ளன."
      : "ரஜ்ஜு பொருத்தம் அமையாததால் பாரம்பரிய விதிகளின்படி ஆழமான ஜாதக ஆய்வு அவசியம்.",
    vitalSummaryEn: rajjuPass
      ? "Rajju and essential foundations are favorable."
      : "Rajju matches the same category; detailed whole-chart analysis is traditionally recommended.",
  };
}
