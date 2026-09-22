// Codepackr Astro - Astrological Analysis & Computations
import {
  DASA_ORDER,
  PLANETS,
  type PlanetId,
} from "./constants";
import {
  angDist,
  antardasas,
  bhuktis,
  houseFrom,
  nakshatra,
  nowJD,
  siderealGrahas,
  signIndex,
  type ChartResult,
  type DasaPeriod,
} from "./engine";
import {
  ASPECTS,
  BENEFICS,
  COMBUST_ORB,
  DUSTHANA,
  EXALT,
  GANA_NAK,
  GOCHARA_GOOD,
  KAAL_SARPA_EN,
  KAAL_SARPA_TA,
  KENDRA,
  LUCKY_BY_RASI,
  MOOLA,
  NAT_ENEMY,
  NAT_FRIEND,
  OWN_SIGNS,
  PADA_EN,
  PADA_TA,
  RAJJU_EN,
  RAJJU_NAK,
  RAJJU_TA,
  SIGN_LORD,
  VASYA,
  VEDHA_PAIRS,
  YONI_EN,
  YONI_ENEMY,
  YONI_NAK,
  YONI_TA,
} from "./tables";

export type Dignity = "exalt" | "moola" | "own" | "friend" | "neutral" | "enemy" | "debil";

const CLASSICAL: PlanetId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];

export type GrahaReport = {
  id: PlanetId;
  house: number;
  sign: number;
  dignity: Dignity;
  combust: boolean;
  retrograde: boolean;
  vargottama: boolean;
  aspectsHouses: number[];
  conjunct: PlanetId[];
};

export type BhavaReport = {
  house: number;
  sign: number;
  lord: PlanetId;
  lordHouse: number;
  lordSign: number;
  occupants: PlanetId[];
  aspectedBy: PlanetId[];
  sav: number;
};

export type YogaHit = {
  id: string;
  nameTa: string;
  nameEn: string;
  present: boolean;
  kind: "yoga" | "dosha";
  detailTa: string;
  detailEn: string;
};

export type GocharaRow = {
  id: PlanetId;
  sign: number;
  fromRasi: number;
  fromLagna: number;
  favourable: boolean;
};

export type PoruthamItem = {
  id: string;
  ta: string;
  en: string;
  grade: "uthamam" | "madhyamam" | "adhamam";
  pts: number;
  max: number;
  noteTa: string;
  noteEn: string;
};

export type DasaNow = {
  maha: (typeof DASA_ORDER)[number];
  bhukti: (typeof DASA_ORDER)[number];
  antara: (typeof DASA_ORDER)[number];
  mahaStart: number;
  mahaEnd: number;
  bhuktiStart: number;
  bhuktiEnd: number;
  antaraEnd: number;
};

export type Analysis = {
  grahas: GrahaReport[];
  bhavas: BhavaReport[];
  yogas: YogaHit[];
  chevvai: {
    fromLagna: boolean;
    fromMoon: boolean;
    fromVenus: boolean;
    cancelled: boolean;
    present: boolean;
  };
  kaalSarpa: { present: boolean; type: number | null };
  sadeSati: {
    present: boolean;
    phase: "rising" | "peak" | "setting" | "none";
    ashtama: boolean;
    kantaka: boolean;
    saturnSign: number;
  };
  gochara: GocharaRow[];
  naming: { ta: string; en: string; allTa: string[]; allEn: string[] };
  lucky: { numbers: number[]; colorTa: string; colorEn: string; day: number };
  dasaNow: DasaNow | null;
};

function find(result: ChartResult, id: PlanetId) {
  return result.list.find((p) => p.id === id)!;
}

export function dignityOf(id: PlanetId, lon: number): Dignity {
  const sign = signIndex(lon);
  const deg = lon - sign * 30;
  const exalt = EXALT[id];
  if (exalt && sign === (exalt.sign + 6) % 12) return "debil";
  if (exalt && sign === exalt.sign) return "exalt";
  const moola = MOOLA[id];
  if (moola && sign === moola.sign && deg >= moola.from && deg < moola.to) return "moola";
  const own = OWN_SIGNS[id];
  if (own?.includes(sign)) return "own";
  const lord = SIGN_LORD[sign];
  if (id === lord) return "own";
  if ((NAT_FRIEND[id] || []).includes(lord)) return "friend";
  if ((NAT_ENEMY[id] || []).includes(lord)) return "enemy";
  return "neutral";
}

function isCombust(id: PlanetId, lon: number, sunLon: number, retro: boolean) {
  const orb = COMBUST_ORB[id];
  if (!orb) return false;
  return angDist(lon, sunLon) < (retro ? orb.ret : orb.dir);
}

function aspectHouses(id: PlanetId, house: number) {
  const spans = ASPECTS[id] ?? [7];
  return spans.map((a) => ((house + a - 2) % 12) + 1);
}

function houseOf(result: ChartResult, id: PlanetId) {
  return find(result, id).house;
}

function planetsInHouse(result: ChartResult, house: number) {
  return result.list
    .filter((p) => p.id !== "lagna" && p.id !== "gulika" && p.house === house)
    .map((p) => p.id);
}

function kendraFrom(houseA: number, houseB: number) {
  const h = ((houseA - houseB + 12) % 12) + 1;
  return KENDRA.includes(h);
}

export function analyse(result: ChartResult, atJD = nowJD()): Analysis {
  const sun = find(result, "sun");
  const moon = find(result, "moon");
  const lagna = find(result, "lagna");
  const mars = find(result, "mars");
  const venus = find(result, "venus");
  const jupiter = find(result, "jupiter");
  const saturn = find(result, "saturn");
  const mercury = find(result, "mercury");
  const rahu = find(result, "rahu");
  const ketu = find(result, "ketu");

  const grahas: GrahaReport[] = result.list
    .filter((p) => p.id !== "lagna")
    .map((p) => {
      const conjunct = result.list
        .filter((o) => o.id !== p.id && o.id !== "lagna" && o.sign === p.sign)
        .map((o) => o.id);
      return {
        id: p.id,
        house: p.house,
        sign: p.sign,
        dignity: dignityOf(p.id, p.lon),
        combust: isCombust(p.id, p.lon, sun.lon, p.retrograde),
        retrograde: p.retrograde,
        vargottama: p.sign === p.navamsa,
        aspectsHouses: aspectHouses(p.id, p.house),
        conjunct,
      };
    });

  const byId = Object.fromEntries(grahas.map((g) => [g.id, g])) as Record<PlanetId, GrahaReport>;

  const bhavas: BhavaReport[] = Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    const sign = (lagna.sign + i) % 12;
    const lord = SIGN_LORD[sign];
    const lordPos = find(result, lord);
    const occupants = planetsInHouse(result, house);
    const aspectedBy = grahas
      .filter((g) => g.id !== "gulika" && g.aspectsHouses.includes(house) && !occupants.includes(g.id))
      .map((g) => g.id);
    return {
      house,
      sign,
      lord,
      lordHouse: lordPos.house,
      lordSign: lordPos.sign,
      occupants,
      aspectedBy,
      sav: result.sav[sign] ?? 0,
    };
  });

  const yogas = detectYogas(result, byId, bhavas, grahas);

  const marsHouses = {
    fromLagna: [2, 4, 7, 8, 12].includes(mars.house),
    fromMoon: [2, 4, 7, 8, 12].includes(houseFrom(mars.sign, moon.sign)),
    fromVenus: [2, 4, 7, 8, 12].includes(houseFrom(mars.sign, venus.sign)),
  };
  const marsOwnOrExalt = mars.sign === 0 || mars.sign === 7 || mars.sign === 9;
  const jupAspectsMars =
    byId.jupiter.aspectsHouses.includes(mars.house) || byId.jupiter.conjunct.includes("mars");
  const chevvaiRaw = marsHouses.fromLagna || marsHouses.fromMoon || marsHouses.fromVenus;
  const cancelled = chevvaiRaw && (marsOwnOrExalt || jupAspectsMars);
  const chevvaiPresent = chevvaiRaw && !cancelled;

  const ks = kaalSarpa(result);
  const trans = siderealGrahas(atJD, result.school);
  const satSign = signIndex(trans.bodies.saturn);
  const moonSign = moon.sign;
  const satFromMoon = houseFrom(satSign, moonSign);
  const sadePhase: Analysis["sadeSati"]["phase"] =
    satFromMoon === 12 ? "rising" : satFromMoon === 1 ? "peak" : satFromMoon === 2 ? "setting" : "none";

  const gochara: GocharaRow[] = CLASSICAL.map((id) => {
    const lon = trans.bodies[id as Exclude<PlanetId, "lagna" | "gulika">];
    const sign = signIndex(lon);
    const fromRasi = houseFrom(sign, moonSign);
    const fromLagna = houseFrom(sign, lagna.sign);
    const good = (GOCHARA_GOOD[id] || []).includes(fromRasi);
    return { id, sign, fromRasi, fromLagna, favourable: good };
  });

  const pada = moon.pada;
  const naming = {
    ta: PADA_TA[moon.nak][pada - 1],
    en: PADA_EN[moon.nak][pada - 1],
    allTa: [...PADA_TA[moon.nak]],
    allEn: [...PADA_EN[moon.nak]],
  };

  return {
    grahas,
    bhavas,
    yogas,
    chevvai: {
      fromLagna: marsHouses.fromLagna,
      fromMoon: marsHouses.fromMoon,
      fromVenus: marsHouses.fromVenus,
      cancelled,
      present: chevvaiPresent,
    },
    kaalSarpa: ks,
    sadeSati: {
      present: sadePhase !== "none",
      phase: sadePhase,
      ashtama: satFromMoon === 8,
      kantaka: satFromMoon === 4 || satFromMoon === 7,
      saturnSign: satSign,
    },
    gochara,
    naming,
    lucky: LUCKY_BY_RASI[moonSign],
    dasaNow: currentDasa(result.dasa.periods, atJD),
  };
}

function kaalSarpa(result: ChartResult): { present: boolean; type: number | null } {
  const rahu = find(result, "rahu").lon;
  const seven: PlanetId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
  const fwd = seven.every((id) => {
    const d = (find(result, id).lon - rahu + 360) % 360;
    return d > 0.2 && d < 179.8;
  });
  const bak = seven.every((id) => {
    const d = (find(result, id).lon - rahu + 360) % 360;
    return d > 180.2 && d < 359.8;
  });
  if (!fwd && !bak) return { present: false, type: null };
  return { present: true, type: find(result, "rahu").house - 1 };
}

function currentDasa(periods: DasaPeriod[], jd: number): DasaNow | null {
  const maha = periods.find((p) => jd >= p.startJD && jd < p.endJD);
  if (!maha) return null;
  const bhuktiList = bhuktis(maha);
  const bhukti = bhuktiList.find((b) => jd >= b.startJD && jd < b.endJD) ?? bhuktiList[0];
  if (!bhukti) return null;
  const antaraList = antardasas(bhukti);
  const antara = antaraList.find((a) => jd >= a.startJD && jd < a.endJD) ?? antaraList[0];
  return {
    maha: maha.lord,
    bhukti: bhukti.lord,
    antara: antara.lord,
    mahaStart: maha.startJD,
    mahaEnd: maha.endJD,
    bhuktiStart: bhukti.startJD,
    bhuktiEnd: bhukti.endJD,
    antaraEnd: antara.endJD,
  };
}

function detectYogas(
  result: ChartResult,
  byId: Record<PlanetId, GrahaReport>,
  bhavas: BhavaReport[],
  grahas: GrahaReport[],
): YogaHit[] {
  const moon = find(result, "moon");
  const lagna = find(result, "lagna");
  const hits: YogaHit[] = [];

  const push = (hit: YogaHit) => hits.push(hit);

  const juFromMoon = houseFrom(find(result, "jupiter").sign, moon.sign);
  const gaja = KENDRA.includes(juFromMoon);
  push({
    id: "gaja-kesari",
    nameTa: "கஜகேசரி யோகம்",
    nameEn: "Gaja Kesari yoga",
    present: gaja,
    kind: "yoga",
    detailTa: gaja
      ? `குரு சந்திரனிலிருந்து ${juFromMoon}-ஆம் இடத்தில் — கீர்த்தி, அறிவு, ஆதரவு.`
      : "குரு சந்திரனின் கேந்திரத்தில் இல்லை.",
    detailEn: gaja
      ? `Jupiter is in the ${juFromMoon}th from the Moon — fame, counsel, grace.`
      : "Jupiter is not in a kendra from the Moon.",
  });

  const budhaAditya = find(result, "sun").sign === find(result, "mercury").sign;
  push({
    id: "budha-aditya",
    nameTa: "புதாதித்ய யோகம்",
    nameEn: "Budha-Aditya yoga",
    present: budhaAditya,
    kind: "yoga",
    detailTa: budhaAditya ? "சூரியனும் புதனும் ஒரே ராசியில் — அறிவு, பேச்சு, கணக்கு." : "சூரியன்-புதன் இணைவில்லை.",
    detailEn: budhaAditya ? "Sun and Mercury share a sign — intellect and speech." : "Sun and Mercury are apart.",
  });

  const chandraMangala = moon.sign === find(result, "mars").sign;
  push({
    id: "chandra-mangala",
    nameTa: "சந்திர மங்கள யோகம்",
    nameEn: "Chandra-Mangala yoga",
    present: chandraMangala,
    kind: "yoga",
    detailTa: chandraMangala ? "சந்திரன்-செவ்வாய் இணைவு — உழைப்பு, நிலம், வியாபார உந்துதல்." : "சந்திரன்-செவ்வாய் இணைவில்லை.",
    detailEn: chandraMangala ? "Moon with Mars — drive, property, enterprise." : "Moon and Mars are apart.",
  });

  const mahaNames: { id: PlanetId; ta: string; en: string }[] = [
    { id: "mars", ta: "ருசக யோகம்", en: "Ruchaka yoga" },
    { id: "mercury", ta: "பத்ர யோகம்", en: "Bhadra yoga" },
    { id: "jupiter", ta: "ஹம்ச யோகம்", en: "Hamsa yoga" },
    { id: "venus", ta: "மாலவ்ய யோகம்", en: "Malavya yoga" },
    { id: "saturn", ta: "சச யோகம்", en: "Sasa yoga" },
  ];
  for (const m of mahaNames) {
    const g = byId[m.id];
    const strong = g.dignity === "own" || g.dignity === "exalt" || g.dignity === "moola";
    const present = strong && KENDRA.includes(g.house);
    push({
      id: `maha-${m.id}`,
      nameTa: m.ta,
      nameEn: m.en,
      present,
      kind: "yoga",
      detailTa: present
        ? `${PLANETS.find((p) => p.id === m.id)?.ta} கேந்திரத்தில் சொந்த/உச்ச ராசியில் — பஞ்ச மகாபுருஷம்.`
        : "இந்த மகாபுருஷ யோகம் உருவாகவில்லை.",
      detailEn: present
        ? `${m.en} — the planet is strong in a kendra (Pancha Mahapurusha).`
        : "This Mahapurusha yoga is not formed.",
    });
  }

  const fromMoon = (id: PlanetId) => houseFrom(find(result, id).sign, moon.sign);
  const adhiCount = (["mercury", "jupiter", "venus"] as PlanetId[]).filter((id) =>
    [6, 7, 8].includes(fromMoon(id)),
  ).length;
  push({
    id: "adhi",
    nameTa: "ஆதி யோகம்",
    nameEn: "Adhi yoga",
    present: adhiCount >= 2,
    kind: "yoga",
    detailTa:
      adhiCount >= 2
        ? `சந்திரனிலிருந்து 6-7-8 இடங்களில் ${adhiCount} சுபக்கிரகங்கள் — தலைமை, ஆடம்பரம்.`
        : "சந்திரனின் 6-7-8 இடங்களில் சுபர்கள் போதாது.",
    detailEn:
      adhiCount >= 2
        ? `${adhiCount} benefics occupy 6/7/8 from the Moon — rank and comfort.`
        : "Not enough benefics in 6/7/8 from the Moon.",
  });

  const withMoon = result.list.some((p) => p.id !== "moon" && p.id !== "lagna" && p.id !== "gulika" && p.sign === moon.sign);
  const second = planetsInHouse(result, houseFrom((moon.sign + 1) % 12, lagna.sign));
  const twelfth = planetsInHouse(result, houseFrom((moon.sign + 11) % 12, lagna.sign));
  const moon2 = result.list.filter(
    (p) => p.id !== "moon" && p.id !== "lagna" && p.id !== "gulika" && houseFrom(p.sign, moon.sign) === 2,
  );
  const moon12 = result.list.filter(
    (p) => p.id !== "moon" && p.id !== "lagna" && p.id !== "gulika" && houseFrom(p.sign, moon.sign) === 12,
  );
  const kendraSupport = CLASSICAL.some((id) => id !== "moon" && kendraFrom(find(result, id).house, moon.house));
  const kemadruma = !withMoon && moon2.length === 0 && moon12.length === 0 && !kendraSupport;
  push({
    id: "kemadruma",
    nameTa: "கேமத்ரும தோஷம்",
    nameEn: "Kemadruma dosha",
    present: kemadruma,
    kind: "dosha",
    detailTa: kemadruma
      ? "சந்திரனுக்கு 2, 12 இடங்களில் கிரகம் இல்லை; கேந்திர ஆதரவும் இல்லை — தனிமை, ஏற்ற இறக்கம்."
      : "கேமத்ருமம் இல்லை அல்லது கேந்திர/இணைவால் பரிகாரம்.",
    detailEn: kemadruma
      ? "No planet in 2nd/12th from Moon and no kendra support — isolation, swings."
      : "Kemadruma is absent or cancelled.",
  });
  void second;
  void twelfth;

  const dustLords = [6, 8, 12].map((h) => bhavas[h - 1].lord);
  const vipareeta = dustLords.every((lord) => DUSTHANA.includes(byId[lord]?.house ?? 0));
  push({
    id: "vipareeta",
    nameTa: "விபரீத ராஜயோகம்",
    nameEn: "Vipareeta raja yoga",
    present: vipareeta,
    kind: "yoga",
    detailTa: vipareeta
      ? "6, 8, 12 ஆதிபதிகள் தூஸ்தானங்களிலேயே — தடைகளை வென்று உயர்வு."
      : "விபரீத ராஜயோக அமைப்பு முழுமையில்லை.",
    detailEn: vipareeta
      ? "Lords of 6, 8 and 12 sit in dusthanas — rise through reversal."
      : "Full Vipareeta raja yoga is not formed.",
  });

  const amala =
    bhavas[9].occupants.some((id) => BENEFICS.includes(id)) ||
    result.list.some((p) => BENEFICS.includes(p.id) && houseFrom(p.sign, moon.sign) === 10);
  push({
    id: "amala",
    nameTa: "அமல யோகம்",
    nameEn: "Amala yoga",
    present: amala,
    kind: "yoga",
    detailTa: amala ? "10-ஆம் இடத்தில் சுபக்கிரகம் — தூய கீர்த்தி, நல்ல பெயர்." : "10-ஆம் இடத்தில் சுபர் இல்லை.",
    detailEn: amala ? "A benefic occupies the 10th — unsullied reputation." : "No benefic in the 10th from lagna or Moon.",
  });

  const sakata = [6, 8].includes(juFromMoon);
  push({
    id: "sakata",
    nameTa: "சகட யோகம்",
    nameEn: "Sakata yoga",
    present: sakata,
    kind: "dosha",
    detailTa: sakata ? "குரு சந்திரனிலிருந்து 6 அல்லது 8 — ஏற்ற இறக்க வாழ்க்கை." : "சகட யோகம் இல்லை.",
    detailEn: sakata ? "Jupiter in 6th or 8th from the Moon — fluctuating fortune." : "Sakata yoga is not present.",
  });

  const vargottamaList = grahas.filter((g) => g.vargottama && g.id !== "gulika").map((g) => g.id);
  push({
    id: "vargottama",
    nameTa: "வர்கோத்தமம்",
    nameEn: "Vargottama",
    present: vargottamaList.length > 0,
    kind: "yoga",
    detailTa:
      vargottamaList.length > 0
        ? `வர்கோத்தம கிரகங்கள்: ${vargottamaList.map((id) => PLANETS.find((p) => p.id === id)?.ta).join(", ")} — ராசியும் நவாம்சமும் ஒன்று.`
        : "வர்கோத்தம கிரகம் இல்லை.",
    detailEn:
      vargottamaList.length > 0
        ? `Vargottama: ${vargottamaList.join(", ")} — same sign in D1 and D9.`
        : "No vargottama planet.",
  });

  const neecha = grahas.filter((g) => g.dignity === "debil" && CLASSICAL.includes(g.id));
  const neechaBhanga = neecha.filter((g) => {
    const exaltSign = EXALT[g.id]?.sign;
    if (exaltSign === undefined) return false;
    const debilSign = (exaltSign + 6) % 12;
    const debilLord = SIGN_LORD[debilSign];
    const exaltLord = SIGN_LORD[exaltSign];
    return KENDRA.includes(byId[debilLord]?.house ?? 99) || KENDRA.includes(byId[exaltLord]?.house ?? 99);
  });
  push({
    id: "neecha-bhanga",
    nameTa: "நீசபங்க ராஜயோகம்",
    nameEn: "Neecha-bhanga raja yoga",
    present: neechaBhanga.length > 0,
    kind: "yoga",
    detailTa:
      neechaBhanga.length > 0
        ? `நீசம் நீங்கிய கிரகங்கள்: ${neechaBhanga.map((g) => PLANETS.find((p) => p.id === g.id)?.ta).join(", ")}.`
        : neecha.length
          ? "நீசக் கிரகம் உண்டு; பங்கம் உறுதியாகவில்லை."
          : "நீசக் கிரகம் இல்லை.",
    detailEn:
      neechaBhanga.length > 0
        ? `Cancellation of debility for ${neechaBhanga.map((g) => g.id).join(", ")}.`
        : neecha.length
          ? "A planet is debilitated without clear cancellation."
          : "No debilitated planet.",
  });

  const exchanges: string[] = [];
  const seen = new Set<string>();
  for (const a of CLASSICAL.slice(0, 7)) {
    const aSign = find(result, a).sign;
    const b = SIGN_LORD[aSign];
    if (b === a || b === "moon" && a === "moon") continue;
    const bSign = find(result, b).sign;
    if (SIGN_LORD[bSign] === a) {
      const key = [a, b].sort().join("-");
      if (!seen.has(key)) {
        seen.add(key);
        exchanges.push(`${PLANETS.find((p) => p.id === a)?.ta} ↔ ${PLANETS.find((p) => p.id === b)?.ta}`);
      }
    }
  }
  push({
    id: "parivartana",
    nameTa: "பரிவர்த்தன யோகம்",
    nameEn: "Parivartana yoga",
    present: exchanges.length > 0,
    kind: "yoga",
    detailTa: exchanges.length ? `ராசி பரிமாற்றம்: ${exchanges.join(", ")}.` : "கிரக பரிவர்த்தனை இல்லை.",
    detailEn: exchanges.length ? `Sign exchange: ${exchanges.join(", ")}.` : "No planetary exchange.",
  });

  const lagnaLord = SIGN_LORD[lagna.sign];
  const ninthLord = bhavas[8].lord;
  const ll = byId[lagnaLord];
  const nl = byId[ninthLord];
  const raja =
    (KENDRA.includes(ll.house) && [1, 5, 9].includes(nl.house) && (nl.dignity === "own" || nl.dignity === "exalt" || nl.dignity === "moola")) ||
    (KENDRA.includes(nl.house) && [1, 5, 9].includes(ll.house));
  push({
    id: "raja",
    nameTa: "ராஜயோகம் (லக்ன-9)",
    nameEn: "Raja yoga (lagna–9th)",
    present: raja,
    kind: "yoga",
    detailTa: raja ? "லக்னாதிபதியும் 9-ஆம் அதிபதியும் கேந்திர/திரிகோணத்தில் — அதிகாரம், பாக்கியம்." : "லக்ன-9 ராஜயோகம் இல்லை.",
    detailEn: raja ? "Lagna and 9th lords occupy kendra/trikona — authority and fortune." : "Classic lagna–9th raja yoga is not formed.",
  });

  const vasumati = BENEFICS.filter((id) => [3, 6, 10, 11].includes(byId[id]?.house ?? 0)).length >= 2;
  push({
    id: "vasumati",
    nameTa: "வசுமதி யோகம்",
    nameEn: "Vasumati yoga",
    present: vasumati,
    kind: "yoga",
    detailTa: vasumati ? "உபசய இடங்களில் சுபக்கிரகங்கள் — செல்வ ஓட்டம்." : "வசுமதி அமைப்பு இல்லை.",
    detailEn: vasumati ? "Benefics in upachaya houses — wealth flow." : "Vasumati yoga is not formed.",
  });

  // Dharma-Karmadhipati Raja Yoga (9th + 10th lords)
  const tenthLord = bhavas[9].lord;
  const dharmaKarma =
    (nl.house === byId[tenthLord]?.house) ||
    (nl.aspectsHouses.includes(byId[tenthLord]?.house ?? 0) && byId[tenthLord]?.aspectsHouses.includes(nl.house));
  push({
    id: "dharma-karmadhipati",
    nameTa: "தர்ம-கர்மாதிபதி ராஜயோகம்",
    nameEn: "Dharma-Karmadhipati raja yoga",
    present: dharmaKarma,
    kind: "yoga",
    detailTa: dharmaKarma
      ? "9-ஆம் அதிபதி (தர்மம்) மற்றும் 10-ஆம் அதிபதி (கர்மம்) இணைவு அல்லது பரிவர்த்தனை — மிக உயர்ந்த கௌரவம், ஆட்சி அதிகாரம்."
      : "தர்ம-கர்மாதிபதி யோக அமைப்பு இல்லை.",
    detailEn: dharmaKarma
      ? "9th lord (Dharma) and 10th lord (Karma) conjoined or aspecting — top-tier status, authority, and noble legacy."
      : "Dharma-Karmadhipati combination is not formed.",
  });

  // Dhana Yoga (Wealth Yoga: Lords of 1, 2, 5, 9, 11 sambandha)
  const secondLord = bhavas[1].lord;
  const fifthLord = bhavas[4].lord;
  const eleventhLord = bhavas[10].lord;
  const dhanaHits = [
    byId[secondLord]?.house === byId[eleventhLord]?.house,
    byId[fifthLord]?.house === byId[ninthLord]?.house,
    [1, 2, 5, 9, 11].includes(byId[secondLord]?.house ?? 0) && [1, 2, 5, 9, 11].includes(byId[eleventhLord]?.house ?? 0),
  ];
  const dhanaYoga = dhanaHits.some(Boolean);
  push({
    id: "dhana-yoga",
    nameTa: "தன யோகம் (Dhana Yoga)",
    nameEn: "Dhana yoga (Wealth)",
    present: dhanaYoga,
    kind: "yoga",
    detailTa: dhanaYoga
      ? "2, 5, 9, 11-ஆம் தன பாவ அதிபதிகள் சுப இணைவு அல்லது கேந்திர திரிகோணத்தில் — நிரந்தர சொத்துக்கள் மற்றும் வருமானம்."
      : "பிரத்யேக தனயோக கிரக இணைவில்லை; சுய உழைப்பால் செல்வம் உயரும்.",
    detailEn: dhanaYoga
      ? "Lords of 2nd, 5th, 9th, and 11th houses in auspicious relation — strong capacity for capital accumulation."
      : "No direct dhana yoga combination; wealth grows steadily through sustained effort.",
  });

  // Budhaditya Yoga (Sun + Mercury)
  const sun = find(result, "sun");
  const merc = find(result, "mercury");
  const budhaditya = sun.sign === merc.sign && !byId.mercury?.combust;
  push({
    id: "budhaditya",
    nameTa: "புதாதித்ய யோகம்",
    nameEn: "Budhaditya yoga",
    present: budhaditya,
    kind: "yoga",
    detailTa: budhaditya
      ? "சூரியன் மற்றும் புதன் ஒரே ராசியில் அஸ்தங்கமின்றி இணைவு — கூரிய அறிவுத்திறன், கல்விச் சிறப்பு, நிர்வாக மேன்மை."
      : sun.sign === merc.sign
        ? "சூரியன்-புதன் இணைவு உள்ளது; புதன் நெருக்க அஸ்தங்கம் காரணமாக பலன் மிதமானது."
        : "சூரியன்-புதன் வெவ்வேறு ராசிகளில் உள்ளனர்.",
    detailEn: budhaditya
      ? "Sun and Mercury conjunct without combustion — sharp intellect, eloquence, and administrative skill."
      : sun.sign === merc.sign
        ? "Sun and Mercury conjunct, but deep combustion softens its full expression."
        : "Sun and Mercury are placed in separate signs.",
  });

  // Lunar Yogas: Sunapha, Anapha, Durudhara
  const planetsFromMoon2 = result.list.filter((p) => p.id !== "moon" && p.id !== "lagna" && p.id !== "gulika" && p.id !== "rahu" && p.id !== "ketu" && houseFrom(p.sign, moon.sign) === 2);
  const planetsFromMoon12 = result.list.filter((p) => p.id !== "moon" && p.id !== "lagna" && p.id !== "gulika" && p.id !== "rahu" && p.id !== "ketu" && houseFrom(p.sign, moon.sign) === 12);
  if (planetsFromMoon2.length > 0 && planetsFromMoon12.length > 0) {
    push({
      id: "durudhara",
      nameTa: "துருதுரா யோகம்",
      nameEn: "Durudhara yoga",
      present: true,
      kind: "yoga",
      detailTa: "சந்திரனுக்கு 2 மற்றும் 12 ஆகிய இரு புறங்களிலும் கிரகங்கள் — சர்வ சௌபாக்கியம், நிலையான செல்வாக்கு.",
      detailEn: "Planets flanking both 2nd and 12th from Moon — balanced comforts, generous nature, and material security.",
    });
  } else if (planetsFromMoon2.length > 0) {
    push({
      id: "sunapha",
      nameTa: "சுனபா யோகம்",
      nameEn: "Sunapha yoga",
      present: true,
      kind: "yoga",
      detailTa: "சந்திரனுக்கு 2-ஆம் இடத்தில் கிரகம் — சுயமுயற்சியால் செல்வம், புத்தி கூர்மை, குடும்ப ஆதரவு.",
      detailEn: "Planet in 2nd from Moon — self-made wealth, refined taste, and practical intelligence.",
    });
  } else if (planetsFromMoon12.length > 0) {
    push({
      id: "anapha",
      nameTa: "அனபா யோகம்",
      nameEn: "Anapha yoga",
      present: true,
      kind: "yoga",
      detailTa: "சந்திரனுக்கு 12-ஆம் இடத்தில் கிரகம் — தர்ம குணம், புலனடக்கம், அமைதியான மனநிலை.",
      detailEn: "Planet in 12th from Moon — charitable mindset, spiritual inclination, and peace of mind.",
    });
  }

  // Solar Yogas: Vesi, Vosi, Ubhayachari
  const planetsFromSun2 = result.list.filter((p) => p.id !== "sun" && p.id !== "lagna" && p.id !== "gulika" && p.id !== "rahu" && p.id !== "ketu" && houseFrom(p.sign, sun.sign) === 2);
  const planetsFromSun12 = result.list.filter((p) => p.id !== "sun" && p.id !== "lagna" && p.id !== "gulika" && p.id !== "rahu" && p.id !== "ketu" && houseFrom(p.sign, sun.sign) === 12);
  if (planetsFromSun2.length > 0 && planetsFromSun12.length > 0) {
    push({
      id: "ubhayachari",
      nameTa: "உபயசாரி யோகம்",
      nameEn: "Ubhayachari yoga",
      present: true,
      kind: "yoga",
      detailTa: "சூரியனின் இருபுறமும் (2 மற்றும் 12) கிரகங்கள் — அரசாங்க ஆதரவு, வசீகரப் பேச்சு, சமூக அந்தஸ்து.",
      detailEn: "Planets in both 2nd and 12th from Sun — magnetic personality, recognition, and well-rounded fortune.",
    });
  } else if (planetsFromSun2.length > 0) {
    push({
      id: "vesi",
      nameTa: "வேசி யோகம்",
      nameEn: "Vesi yoga",
      present: true,
      kind: "yoga",
      detailTa: "சூரியனுக்கு 2-ஆம் இடத்தில் கிரகம் — உறுதிமிக்க சொல், சத்திய குணம், நல்ல நடத்தை.",
      detailEn: "Planet in 2nd from Sun — upright character, eloquence, and reliable reputation.",
    });
  } else if (planetsFromSun12.length > 0) {
    push({
      id: "vosi",
      nameTa: "வோசி யோகம்",
      nameEn: "Vosi yoga",
      present: true,
      kind: "yoga",
      detailTa: "சூரியனுக்கு 12-ஆம் இடத்தில் கிரகம் — புகழ், பொறுமை, சிறந்த சிந்தனை.",
      detailEn: "Planet in 12th from Sun — good memory, endurance, and quiet authority.",
    });
  }

  // Pitru Dosha check (Sun with Rahu/Ketu or Saturn in 9th)
  const ninthHouseOccupants = bhavas[8].occupants;
  const sunRahuConjunct = sun.sign === find(result, "rahu").sign || sun.sign === find(result, "ketu").sign;
  const pitruDosha = (ninthHouseOccupants.includes("rahu") || ninthHouseOccupants.includes("ketu") || (sunRahuConjunct && [1, 5, 9].includes(sun.house)));
  push({
    id: "pitru-dosha",
    nameTa: "பித்ரு தோஷம் (Pitru Dosha)",
    nameEn: "Pitru dosha",
    present: pitruDosha,
    kind: "dosha",
    detailTa: pitruDosha
      ? "சூரியன் அல்லது 9-ஆம் பாவகத்தில் ராகு/கேது சம்பந்தம் — முன்னோர் ஆசி பெற தான தர்மங்கள் மற்றும் அமாவாசை தர்ப்பணம் நன்று."
      : "பித்ரு தோஷம் ஜாதகத்தில் அமையவில்லை; முன்னோர்களின் நல் ஆசி உள்ளது.",
    detailEn: pitruDosha
      ? "Nodal affliction to Sun or 9th house — ancestor prayers, Amavasya charity, and family harmony rituals are recommended."
      : "Pitru dosha is absent; blessings of ancestors support life progress.",
  });

  return hits;
}

export function dasakoota(boyMoonLon: number, girlMoonLon: number) {
  const bNak = nakshatra(boyMoonLon).idx;
  const gNak = nakshatra(girlMoonLon).idx;
  const bRasi = signIndex(boyMoonLon);
  const gRasi = signIndex(girlMoonLon);
  const countNak = ((bNak - gNak + 27) % 27) + 1;
  const countRasi = ((bRasi - gRasi + 12) % 12) + 1;

  const grade = (g: PoruthamItem["grade"]): Pick<PoruthamItem, "grade" | "pts"> =>
    g === "uthamam" ? { grade: g, pts: 1 } : g === "madhyamam" ? { grade: g, pts: 0.5 } : { grade: g, pts: 0 };

  const items: PoruthamItem[] = [];

  const tara = countNak % 9 || 9;
  const dinaG: PoruthamItem["grade"] = [2, 4, 6, 8, 9].includes(tara) ? "uthamam" : "adhamam";
  items.push({
    id: "dina",
    ta: "தினப் பொருத்தம்",
    en: "Dina",
    max: 1,
    ...grade(dinaG),
    noteTa: `மணமகளிலிருந்து ${countNak}-ஆம் நட்சத்திரம் (தாரா ${tara}).`,
    noteEn: `Count from Bride ${countNak} (tara ${tara}).`,
  });

  const bg = GANA_NAK[bNak];
  const gg = GANA_NAK[gNak];
  // 0: Deva, 1: Manushya, 2: Rakshasa
  let ganaG: PoruthamItem["grade"] = "adhamam";
  if (bg === gg) {
    ganaG = "uthamam";
  } else if (gg === 0 && bg === 1) {
    ganaG = "madhyamam"; // Bride Deva, Groom Manushya
  } else if (gg === 1 && bg === 0) {
    ganaG = "uthamam"; // Bride Manushya, Groom Deva
  } else if (gg === 2 && bg === 0) {
    ganaG = "madhyamam"; // Bride Rakshasa, Groom Deva
  } else {
    ganaG = "adhamam"; // Rakshasa with Manushya, etc.
  }
  items.push({
    id: "gana",
    ta: "கணப் பொருத்தம்",
    en: "Gana",
    max: 1,
    ...grade(ganaG),
    noteTa: `மணமகன்: ${GANA_NAK[bNak] === 0 ? "தேவ" : GANA_NAK[bNak] === 1 ? "மனுஷ்ய" : "ராட்சச"} · மணமகள்: ${GANA_NAK[gNak] === 0 ? "தேவ" : GANA_NAK[gNak] === 1 ? "மனுஷ்ய" : "ராட்சச"}`,
    noteEn: `Groom: ${["Deva", "Manushya", "Rakshasa"][bg]} · Bride: ${["Deva", "Manushya", "Rakshasa"][gg]}.`,
  });

  const mahG: PoruthamItem["grade"] = [4, 7, 10, 13, 16, 19, 22, 25].includes(countNak) ? "uthamam" : "adhamam";
  items.push({
    id: "mahendra",
    ta: "மகேந்திரப் பொருத்தம்",
    en: "Mahendra",
    max: 1,
    ...grade(mahG),
    noteTa: mahG === "uthamam" ? "சந்ததி, செல்வ வளர்ச்சிக்கு உகந்த எண்ணிக்கை." : "மகேந்திர எண்ணிக்கை பொருந்தவில்லை.",
    noteEn: mahG === "uthamam" ? "Favourable count for progeny and growth." : "Mahendra count is not matching.",
  });

  const sdG: PoruthamItem["grade"] = countNak >= 13 ? "uthamam" : countNak >= 7 ? "madhyamam" : "adhamam";
  items.push({
    id: "stree",
    ta: "ஸ்த்ரீ தீர்க்கம்",
    en: "Stree Deergha",
    max: 1,
    ...grade(sdG),
    noteTa: `மணமகளிலிருந்து மணமகன் நட்சத்திரம் ${countNak} இடம்.`,
    noteEn: `Groom’s star is ${countNak} places from Bride.`,
  });

  const by = YONI_NAK[bNak];
  const gy = YONI_NAK[gNak];
  const enemy = YONI_ENEMY.some(([a, b]) => (a === by && b === gy) || (a === gy && b === by));
  const yoniG: PoruthamItem["grade"] = by === gy ? "uthamam" : enemy ? "adhamam" : "madhyamam";
  items.push({
    id: "yoni",
    ta: "யோனிப் பொருத்தம்",
    en: "Yoni",
    max: 1,
    ...grade(yoniG),
    noteTa: `${YONI_TA[by]} · ${YONI_TA[gy]}`,
    noteEn: `${YONI_EN[by]} · ${YONI_EN[gy]}`,
  });

  const isSashtashtaka = countRasi === 6 || countRasi === 8;
  const rasiG: PoruthamItem["grade"] = [7, 3, 4, 10, 11].includes(countRasi)
    ? "uthamam"
    : isSashtashtaka
      ? "adhamam"
      : countRasi === 2 || countRasi === 12
        ? "madhyamam"
        : "madhyamam";
  items.push({
    id: "rasi",
    ta: "ராசிப் பொருத்தம்",
    en: "Rasi",
    max: 1,
    ...grade(rasiG),
    noteTa: `மணமகள் ராசியிலிருந்து மணமகன் ${countRasi}-ஆம் இடம்${isSashtashtaka ? " (சஷ்டாஷ்டகம்)" : ""}.`,
    noteEn: `Groom is ${countRasi} from Bride’s rasi${isSashtashtaka ? " (Sashtashtaka)" : ""}.`,
  });

  const bl = SIGN_LORD[bRasi];
  const gl = SIGN_LORD[gRasi];
  const adhiG: PoruthamItem["grade"] =
    bl === gl ? "uthamam" : (NAT_FRIEND[bl] || []).includes(gl) ? "uthamam" : (NAT_ENEMY[bl] || []).includes(gl) ? "adhamam" : "madhyamam";
  items.push({
    id: "adhipathi",
    ta: "ராசி அதிபதி",
    en: "Rasi Adhipathi",
    max: 1,
    ...grade(adhiG),
    noteTa: `${PLANETS.find((p) => p.id === bl)?.ta} · ${PLANETS.find((p) => p.id === gl)?.ta}`,
    noteEn: `Lords ${bl} · ${gl}`,
  });

  const vasyaOk = VASYA[gRasi].includes(bRasi) || VASYA[bRasi].includes(gRasi) || bRasi === gRasi;
  const vasG: PoruthamItem["grade"] = bRasi === gRasi ? "madhyamam" : vasyaOk ? "uthamam" : "adhamam";
  items.push({
    id: "vasya",
    ta: "வசியப் பொருத்தம்",
    en: "Vasya",
    max: 1,
    ...grade(vasG),
    noteTa: vasyaOk ? "பரஸ்பர ஈர்ப்பு உண்டு." : "வசியம் பொருந்தவில்லை.",
    noteEn: vasyaOk ? "Mutual attraction of rasis." : "Vasya does not match.",
  });

  const br = RAJJU_NAK[bNak];
  const gr = RAJJU_NAK[gNak];
  const rajG: PoruthamItem["grade"] = br === gr ? "adhamam" : "uthamam";
  items.push({
    id: "rajju",
    ta: "ரஜ்ஜுப் பொருத்தம்",
    en: "Rajju",
    max: 1,
    ...grade(rajG),
    noteTa: `${RAJJU_TA[br]} · ${RAJJU_TA[gr]}${br === gr ? " — ஒரே ரஜ்ஜு தோஷம்" : ""}`,
    noteEn: `${RAJJU_EN[br]} · ${RAJJU_EN[gr]}${br === gr ? " — same-rajju dosha" : ""}`,
  });

  const vedha = VEDHA_PAIRS.some(
    ([a, b]) => (a === bNak && b === gNak) || (a === gNak && b === bNak),
  );
  items.push({
    id: "vedha",
    ta: "வேதைப் பொருத்தம்",
    en: "Vedha",
    max: 1,
    ...grade(vedha ? "adhamam" : "uthamam"),
    noteTa: vedha ? "நட்சத்திர வேதை உண்டு — தடை." : "வேதை இல்லை.",
    noteEn: vedha ? "Nakshatras obstruct each other." : "No vedha obstruction.",
  });

  const total = items.reduce((s, x) => s + x.pts, 0);
  const matched = items.filter((x) => x.grade !== "adhamam").length;
  const uthamam = items.filter((x) => x.grade === "uthamam").length;
  const verdict: "excellent" | "good" | "average" | "low" =
    matched >= 9 ? "excellent" : matched >= 7 ? "good" : matched >= 6 ? "average" : "low";
  return {
    items,
    total,
    max: 10,
    matched,
    uthamam,
    verdict,
    flags: {
      rajju: br === gr,
      vedha,
      ashtama: countRasi === 6 || countRasi === 8,
    },
  };
}

export function kaalSarpaName(type: number | null, lang: "ta" | "en") {
  if (type === null) return "";
  return lang === "ta" ? KAAL_SARPA_TA[type] : KAAL_SARPA_EN[type];
}
