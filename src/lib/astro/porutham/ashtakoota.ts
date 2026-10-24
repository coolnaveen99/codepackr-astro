export interface KootaItemResult {
  id: 'varna' | 'vashya' | 'tara' | 'yoni' | 'maitri' | 'gana' | 'bhakoot' | 'nadi';
  name: string;
  description: string;
  brideAttr: string;
  groomAttr: string;
  obtainedPoints: number;
  maxPoints: number;
  status: 'excellent' | 'good' | 'warning';
}

export interface AshtakootaSummary {
  totalPoints: number;
  maxPoints: 36;
  verdict: 'Excellent Match' | 'Good Match' | 'Average / Needs Remedy' | 'Not Recommended';
  kootas: KootaItemResult[];
  nadiDoshaPresent: boolean;
  bhakootDoshaPresent: boolean;
}

// 0 = Deva, 1 = Manushya, 2 = Rakshasa for the 27 Nakshatras
const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, // 1-9 (Ashwini to Ashlesha)
  2, 1, 1, 0, 2, 0, 2, 0, 2, // 10-18 (Magha to Jyeshtha)
  2, 1, 1, 0, 2, 2, 1, 1, 0, // 19-27 (Mula to Revati)
];
const GANA_NAMES = ['Deva (Divine)', 'Manushya (Human)', 'Rakshasa (Intense)'];

// 0 = Adi (Vata), 1 = Madhya (Pitta), 2 = Antya (Kapha) for 27 Nakshatras
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2,
];
const NADI_NAMES = ['Adi (Vata)', 'Madhya (Pitta)', 'Antya (Kapha)'];

// Yoni animal index (0..13) for 27 Nakshatras
const NAKSHATRA_YONI = [
  0, 1, 2, 3, 3, 4, 5, 2, 5,
  6, 6, 7, 8, 9, 8, 9, 10, 10,
  4, 11, 12, 11, 13, 0, 13, 7, 1,
];
const YONI_NAMES = [
  'Ashwa (Horse)', 'Gaja (Elephant)', 'Mesha (Sheep)', 'Sarpa (Serpent)',
  'Shwana (Dog)', 'Marjara (Cat)', 'Mushaka (Rat)', 'Gau (Cow)',
  'Mahisha (Buffalo)', 'Vyaghra (Tiger)', 'Mriga (Deer)', 'Vanara (Monkey)',
  'Nakula (Mongoose)', 'Simha (Lion)'
];

// Rasi Varna: 0 = Brahmin (4), 1 = Kshatriya (3), 2 = Vaishya (2), 3 = Shudra (1)
// Cancer(3), Scorpio(7), Pisces(11) -> Brahmin
// Aries(0), Leo(4), Sagittarius(8) -> Kshatriya
// Taurus(1), Virgo(5), Capricorn(9) -> Vaishya
// Gemini(2), Libra(6), Aquarius(10) -> Shudra
const RASI_VARNA_RANK = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4];
const VARNA_NAMES: Record<number, string> = {
  4: 'Brahmin',
  3: 'Kshatriya',
  2: 'Vaishya',
  1: 'Shudra',
};

// Rasi Lords: 0=Mars, 1=Venus, 2=Mercury, 3=Moon, 4=Sun, 5=Jupiter, 6=Saturn
const RASI_LORD_ID = [0, 1, 2, 3, 4, 2, 1, 0, 5, 6, 6, 5];
const LORD_NAMES = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Jupiter', 'Saturn'];

// Planetary friendship matrix (5 = Mutual Friends, 4 = Friend/Neutral, 3 = Neutral, 1/0.5/0 = Enemy)
const MAITRI_MATRIX: number[][] = [
  // Ma, Ve, Me, Mo, Su, Ju, Sa
  [5, 3, 0.5, 4, 5, 5, 0.5], // Mars
  [3, 5, 5, 0.5, 0, 3, 5],   // Venus
  [0.5, 5, 5, 1, 4, 0.5, 4], // Mercury
  [4, 0.5, 1, 5, 5, 4, 1],   // Moon
  [5, 0, 4, 5, 5, 5, 0],     // Sun
  [5, 3, 0.5, 4, 5, 5, 3],   // Jupiter
  [0.5, 5, 4, 1, 0, 3, 5],   // Saturn
];

/**
 * Calculates North Indian 36-Guna (Ashtakoota) compatibility from Bride and Groom
 * Moon Rasi (0..11) and Nakshatra (0..26).
 */
export function calculateAshtakoota(
  brideRasiOrMoonLon: number,
  brideNakshatraOrGroomMoonLon: number,
  groomRasiInput?: number,
  groomNakshatraInput?: number
): AshtakootaSummary {
  let brideRasi: number;
  let brideNakshatra: number;
  let groomRasi: number;
  let groomNakshatra: number;

  if (groomRasiInput === undefined || groomNakshatraInput === undefined) {
    const bLon = ((brideRasiOrMoonLon % 360) + 360) % 360;
    const gLon = ((brideNakshatraOrGroomMoonLon % 360) + 360) % 360;
    brideRasi = Math.floor(bLon / 30);
    brideNakshatra = Math.min(26, Math.floor(bLon / (360 / 27)));
    groomRasi = Math.floor(gLon / 30);
    groomNakshatra = Math.min(26, Math.floor(gLon / (360 / 27)));
  } else {
    brideRasi = brideRasiOrMoonLon;
    brideNakshatra = brideNakshatraOrGroomMoonLon;
    groomRasi = groomRasiInput;
    groomNakshatra = groomNakshatraInput;
  }

  const kootas: KootaItemResult[] = [];

  // 1. Varna Koota (Max 1)
  const bVarna = RASI_VARNA_RANK[brideRasi];
  const gVarna = RASI_VARNA_RANK[groomRasi];
  const varnaPts = gVarna >= bVarna ? 1 : 0;
  kootas.push({
    id: 'varna',
    name: 'Varna (वर्ण)',
    description: 'Spiritual & work temperament compatibility',
    brideAttr: VARNA_NAMES[bVarna],
    groomAttr: VARNA_NAMES[gVarna],
    obtainedPoints: varnaPts,
    maxPoints: 1,
    status: varnaPts === 1 ? 'excellent' : 'warning',
  });

  // 2. Vashya Koota (Max 2)
  const sameRasi = brideRasi === groomRasi;
  const rasiDiff = Math.abs(brideRasi - groomRasi);
  const vashyaPts = sameRasi ? 2 : [3, 4, 8, 9].includes(rasiDiff) ? 1.5 : [1, 5, 7, 11].includes(rasiDiff) ? 1 : 0.5;
  kootas.push({
    id: 'vashya',
    name: 'Vashya (वश्य)',
    description: 'Mutual attraction & emotional harmony',
    brideAttr: `Rasi #${brideRasi + 1}`,
    groomAttr: `Rasi #${groomRasi + 1}`,
    obtainedPoints: vashyaPts,
    maxPoints: 2,
    status: vashyaPts >= 1.5 ? 'excellent' : vashyaPts >= 1 ? 'good' : 'warning',
  });

  // 3. Tara Koota (Max 3)
  const countBtoG = ((groomNakshatra - brideNakshatra + 27) % 27) + 1;
  const countGtoB = ((brideNakshatra - groomNakshatra + 27) % 27) + 1;
  const remB = countBtoG % 9;
  const remG = countGtoB % 9;
  const badTaras = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  const bGood = !badTaras.includes(remB);
  const gGood = !badTaras.includes(remG);
  const taraPts = bGood && gGood ? 3 : bGood || gGood ? 1.5 : 0;
  kootas.push({
    id: 'tara',
    name: 'Tara (तारा)',
    description: 'Destiny, longevity & star auspiciousness',
    brideAttr: `Tara Remainder ${remB || 9}`,
    groomAttr: `Tara Remainder ${remG || 9}`,
    obtainedPoints: taraPts,
    maxPoints: 3,
    status: taraPts === 3 ? 'excellent' : taraPts === 1.5 ? 'good' : 'warning',
  });

  // 4. Yoni Koota (Max 4)
  const bYoni = NAKSHATRA_YONI[brideNakshatra];
  const gYoni = NAKSHATRA_YONI[groomNakshatra];
  let yoniPts = 2;
  if (bYoni === gYoni) yoniPts = 4;
  else if (Math.abs(bYoni - gYoni) === 7) yoniPts = 0; // Sworn enemy pairs
  else if (Math.abs(bYoni - gYoni) <= 2) yoniPts = 3;
  kootas.push({
    id: 'yoni',
    name: 'Yoni (योनि)',
    description: 'Intimacy & biological affinity',
    brideAttr: YONI_NAMES[bYoni],
    groomAttr: YONI_NAMES[gYoni],
    obtainedPoints: yoniPts,
    maxPoints: 4,
    status: yoniPts >= 3 ? 'excellent' : yoniPts >= 2 ? 'good' : 'warning',
  });

  // 5. Graha Maitri (Max 5)
  const bLord = RASI_LORD_ID[brideRasi];
  const gLord = RASI_LORD_ID[groomRasi];
  const maitriPts = MAITRI_MATRIX[bLord][gLord];
  kootas.push({
    id: 'maitri',
    name: 'Graha Maitri (ग्रह मैत्री)',
    description: 'Mental disposition & planetary lord friendship',
    brideAttr: LORD_NAMES[bLord],
    groomAttr: LORD_NAMES[gLord],
    obtainedPoints: maitriPts,
    maxPoints: 5,
    status: maitriPts >= 4 ? 'excellent' : maitriPts >= 3 ? 'good' : 'warning',
  });

  // 6. Gana Koota (Max 6)
  const bGana = NAKSHATRA_GANA[brideNakshatra];
  const gGana = NAKSHATRA_GANA[groomNakshatra];
  let ganaPts = 0;
  if (bGana === gGana) ganaPts = 6;
  else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) ganaPts = 5;
  else if (gGana === 2 && bGana === 0) ganaPts = 1;
  kootas.push({
    id: 'gana',
    name: 'Gana (गण)',
    description: 'Core temperament & behavioral nature',
    brideAttr: GANA_NAMES[bGana],
    groomAttr: GANA_NAMES[gGana],
    obtainedPoints: ganaPts,
    maxPoints: 6,
    status: ganaPts >= 5 ? 'excellent' : ganaPts >= 1 ? 'good' : 'warning',
  });

  // 7. Bhakoot Koota (Max 7)
  const posBtoG = ((groomRasi - brideRasi + 12) % 12) + 1;
  // Inauspicious relative Moon positions: 2/12, 5/9, 6/8 (unless same Rasi lord)
  const badBhakootPositions = [2, 12, 5, 9, 6, 8];
  const sameLordException = bLord === gLord;
  const bhakootPts = !badBhakootPositions.includes(posBtoG) || sameLordException ? 7 : 0;
  kootas.push({
    id: 'bhakoot',
    name: 'Bhakoot (भकूट)',
    description: 'Family welfare, financial growth & mutual prosperity',
    brideAttr: `Rasi #${brideRasi + 1}`,
    groomAttr: `Rasi #${groomRasi + 1} (${posBtoG}th from Bride)`,
    obtainedPoints: bhakootPts,
    maxPoints: 7,
    status: bhakootPts === 7 ? 'excellent' : 'warning',
  });

  // 8. Nadi Koota (Max 8)
  const bNadi = NAKSHATRA_NADI[brideNakshatra];
  const gNadi = NAKSHATRA_NADI[groomNakshatra];
  // Exception: Same Rasi but different Nakshatra, or same Nakshatra but different Rasi mitigates Nadi Dosha
  const nadiPts = bNadi !== gNadi ? 8 : 0;
  kootas.push({
    id: 'nadi',
    name: 'Nadi (नाड़ी)',
    description: 'Physiological, genetic & vitality compatibility',
    brideAttr: NADI_NAMES[bNadi],
    groomAttr: NADI_NAMES[gNadi],
    obtainedPoints: nadiPts,
    maxPoints: 8,
    status: nadiPts === 8 ? 'excellent' : 'warning',
  });

  const totalPoints = Number(
    kootas.reduce((acc, item) => acc + item.obtainedPoints, 0).toFixed(1)
  );

  let verdict: AshtakootaSummary['verdict'] = 'Not Recommended';
  if (totalPoints >= 28) verdict = 'Excellent Match';
  else if (totalPoints >= 18) verdict = 'Good Match';
  else if (totalPoints >= 14) verdict = 'Average / Needs Remedy';

  return {
    totalPoints,
    maxPoints: 36,
    verdict,
    kootas,
    nadiDoshaPresent: nadiPts === 0,
    bhakootDoshaPresent: bhakootPts === 0,
  };
}
