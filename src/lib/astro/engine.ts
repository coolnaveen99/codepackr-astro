// Codepackr Astro - Planetary Ephemeris & Calculation Engine
import {
  Body,
  GeoVector,
  MakeTime,
  Observer,
  RotateVector,
  Rotation_EQJ_ECT,
  SearchRiseSet,
  SiderealTime,
  SphereFromVector,
  e_tilt,
  type AstroTime,
} from "astronomy-engine";
import {
  DASA_ORDER,
  DASA_YEARS,
  KARANA_EN,
  NAK_LORD,
  PLANETS,
  type PlanetId,
  type School,
} from "./constants";
import { BAV, BAV_FROM, BAV_PLANETS, type BavPlanet } from "./tables";

export type City = { n: string; tz: number; lon: number; lat: number };

export type BirthInput = {
  name: string;
  sex: "M" | "F";
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  tz: number;
  lat: number;
  lon: number;
  place: string;
  school: School;
};

export type BodyPos = {
  id: PlanetId;
  lon: number;
  sign: number;
  dms: string;
  nak: number;
  pada: number;
  navamsa: number;
  house: number;
  retrograde: boolean;
};

export type DasaPeriod = {
  lord: (typeof DASA_ORDER)[number];
  years: number;
  startJD: number;
  endJD: number;
  balance: boolean;
};

export type ChartResult = {
  input: BirthInput;
  jd: number;
  aya: number;
  school: School;
  weekday: number;
  isDay: boolean;
  sunriseJD: number;
  sunsetJD: number;
  list: BodyPos[];
  bodies: Record<PlanetId, number>;
  pan: {
    tithiNum: number;
    tithiIdx: number;
    paksha: "shukla" | "krishna";
    yogaNum: number;
    karanaIdx: number;
    tamilMonth: number;
  };
  muh: {
    rahu: { start: number; end: number };
    yamaganda: { start: number; end: number };
    gulikaKalam: { start: number; end: number };
    abhijit: { start: number; end: number };
    choghadiya: { name: string; nature: string; start: number; end: number }[];
    gowri: { name: string; good: boolean; start: number; end: number }[];
  };
  dasa: { nak: number; pada: number; lord: string; periods: DasaPeriod[] };
  sav: number[];
  bav: Record<BavPlanet, number[]>;
};

export function norm360(x: number) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function sind(x: number) {
  return Math.sin((x * Math.PI) / 180);
}
function cosd(x: number) {
  return Math.cos((x * Math.PI) / 180);
}
function tand(x: number) {
  return Math.tan((x * Math.PI) / 180);
}

export function julianDay(y: number, m: number, d: number, hourUT: number) {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    hourUT / 24 +
    B -
    1524.5
  );
}

/**
 * High-accuracy Lahiri (Chitrapaksha) Ayanamsa.
 * Based on the official Indian Astronomical Ephemeris polynomial
 * (more terms than the previous linear approximation).
 */
export function ayanamsaLahiri(jd: number) {
  // T is centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;
  // Official-style expansion used by many professional Indian engines
  // Base at J2000 ≈ 23.85° and precession rate ≈ 50.29\"/year
  const ayan =
    23.852294 +
    T * (1.3979426 - T * (0.0000930862 + T * 0.000000018));
  return ayan;
}

/**
 * Thirukanitham / traditional South-Indian linear model.
 * Kept for compatibility with older Tamil panchangams.
 */
export function ayanamsaThirukanitham(jd: number) {
  // Epoch around 1900 (JD 2415020) with classical rate ~50.016\"/year
  const years = (jd - 2415020.0) / 365.2421988;
  return 22.460 + (50.016 / 3600) * years;
}

/** Raman Ayanamsa (used by some South-Indian schools). */
export function ayanamsaRaman(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  return 22.460148 + T * 1.396042;
}

/** KP (Krishnamurti) Ayanamsa – Newcomb based. */
export function ayanamsaKP(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.67890 + T * 1.395833;
}

export function houseFrom(sign: number, fromSign: number) {
  return ((sign - fromSign + 12) % 12) + 1;
}

export function angDist(a: number, b: number) {
  return Math.abs(norm360(a - b + 180) - 180);
}

export function signIndex(lon: number) {
  return Math.floor(norm360(lon) / 30);
}

export function dmsText(lon: number) {
  lon = norm360(lon);
  const d = Math.floor(lon);
  const mf = (lon - d) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
}

export function signDms(lon: number) {
  const s = signIndex(lon);
  return { sign: s, text: dmsText(norm360(lon) - s * 30) };
}

export function nakshatra(lon: number) {
  const n = (norm360(lon) * 27) / 360;
  const idx = Math.floor(n) % 27;
  const pada = Math.floor((n - Math.floor(n)) * 4) + 1;
  return { idx, pada, lord: NAK_LORD[idx % 9] };
}

export function navamsa(lon: number) {
  const s = signIndex(lon);
  const within = norm360(lon) - s * 30;
  const part = Math.floor(within / (30 / 9));
  const movable = [0, 3, 6, 9];
  const fixed = [1, 4, 7, 10];
  let start: number;
  if (movable.includes(s)) start = s;
  else if (fixed.includes(s)) start = (s + 8) % 12;
  else start = (s + 4) % 12;
  return (start + part) % 12;
}

export function vargaSign(lon: number, n: number) {
  if (n === 1) return signIndex(lon);
  if (n === 9) return navamsa(lon);
  if (n === 3) {
    const s = signIndex(lon);
    const part = Math.floor((norm360(lon) % 30) / 10);
    return (s + part * 4) % 12;
  }
  if (n === 7) {
    const s = signIndex(lon);
    const part = Math.floor((norm360(lon) % 30) / (30 / 7));
    const start = s % 2 === 0 ? s : (s + 6) % 12;
    return (start + part) % 12;
  }
  if (n === 10) {
    const s = signIndex(lon);
    const part = Math.floor((norm360(lon) % 30) / 3);
    const odd = s % 2 === 0;
    const start = odd ? s : (s + 8) % 12;
    return (start + part) % 12;
  }
  if (n === 12) {
    const s = signIndex(lon);
    const part = Math.floor((norm360(lon) % 30) / 2.5);
    return (s + part) % 12;
  }
  return signIndex(lon);
}

function timeFromJD(jd: number): AstroTime {
  const unix = (jd - 2440587.5) * 86400000;
  return MakeTime(new Date(unix));
}

/** Apparent geocentric ecliptic-of-date longitude (tropical). */
function tropLon(body: Body, t: AstroTime) {
  const geo = GeoVector(body, t, true);
  const ect = RotateVector(Rotation_EQJ_ECT(t), geo);
  return SphereFromVector(ect).lon;
}

/**
 * Mean Lunar Node (Rahu) – improved Meeus-style formula
 * with higher-order terms for better long-term accuracy.
 */
function meanNode(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  const node =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 46729.0 -
    (T * T * T * T) / 606160.0;
  return norm360(node);
}

function tropicalAscendant(jd: number, lat: number, lonEast: number) {
  const t = timeFromJD(jd);
  const gastHours = SiderealTime(t);
  const ramc = norm360(gastHours * 15 + lonEast);
  const eps = e_tilt(t).tobl;
  const y = cosd(ramc);
  const x = -sind(ramc) * cosd(eps) - tand(lat) * sind(eps);
  return norm360((Math.atan2(y, x) * 180) / Math.PI);
}

function vakyaMean(jd: number) {
  const kali = jd - 588465.5;
  const mean = (rate: number, epoch = 0) => norm360(epoch + rate * kali);
  const manda = (m: number, amp: number) => norm360(m + amp * sind(m));
  return {
    sun: manda(mean(0.985602681), 2.14),
    moon: manda(mean(13.17639648, 90), 5.06),
    mercury: manda(mean(1.383333, 40), 3.5),
    venus: manda(mean(1.602333, 80), 0.8),
    mars: manda(mean(0.52402, 20), 11),
    jupiter: manda(mean(0.083129, 220), 5.2),
    saturn: manda(mean(0.033494, 100), 6.4),
    rahu: mean(-0.052954, 200),
  };
}

function tropicalBodies(jd: number) {
  const t = timeFromJD(jd);
  const t2 = timeFromJD(jd + 0.5 / 24);
  const of = (b: Body) => tropLon(b, t);
  const later = (b: Body) => tropLon(b, t2);
  const retro = (b: Body) => norm360(later(b) - of(b) + 180) - 180 < 0;
  const node = meanNode(jd);
  return {
    sun: of(Body.Sun),
    moon: of(Body.Moon),
    mercury: of(Body.Mercury),
    venus: of(Body.Venus),
    mars: of(Body.Mars),
    jupiter: of(Body.Jupiter),
    saturn: of(Body.Saturn),
    rahu: node,
    ketu: norm360(node + 180),
    retro: {
      mercury: retro(Body.Mercury),
      venus: retro(Body.Venus),
      mars: retro(Body.Mars),
      jupiter: retro(Body.Jupiter),
      saturn: retro(Body.Saturn),
    },
  };
}

function sunTimes(year: number, month: number, day: number, lat: number, lon: number, tz: number) {
  const utc0 = Date.UTC(year, month - 1, day, 0, 0, 0) - tz * 3600000;
  const start = MakeTime(new Date(utc0));
  const observer = new Observer(lat, lon, 0);
  const rise = SearchRiseSet(Body.Sun, observer, +1, start, 1.2);
  const set = SearchRiseSet(Body.Sun, observer, -1, start, 1.2);
  const toJd = (tm: AstroTime | null, fallbackHour: number) => {
    if (!tm) return julianDay(year, month, day, fallbackHour - tz);
    return tm.ut + 2451545.0;
  };
  const sunriseJD = toJd(rise, 6);
  const sunsetJD = toJd(set, 18);
  return { sunriseJD, sunsetJD, nextSunriseJD: sunriseJD + 1 };
}

function weekdayFromJD(jd: number) {
  return Math.floor(jd + 1.5) % 7;
}

function panchanga(sunSid: number, moonSid: number, weekday: number) {
  const sep = norm360(moonSid - sunSid);
  const tithiNum = Math.floor(sep / 12);
  const paksha = tithiNum < 15 ? "shukla" : "krishna";
  const tithiIdx = tithiNum % 15;
  const yogaNum = Math.floor((norm360(sunSid + moonSid) * 27) / 360) % 27;
  const karanaNum = Math.floor(sep / 6);
  let karanaIdx: number;
  if (karanaNum === 0) karanaIdx = 10;
  else if (karanaNum === 57) karanaIdx = 7;
  else if (karanaNum === 58) karanaIdx = 8;
  else if (karanaNum === 59) karanaIdx = 9;
  else karanaIdx = (karanaNum - 1) % 7;
  return {
    tithiNum,
    tithiIdx,
    paksha: paksha as "shukla" | "krishna",
    yogaNum,
    karanaIdx,
    tamilMonth: signIndex(sunSid),
    weekday,
  };
}

function muhurta(sunriseJD: number, sunsetJD: number, weekday: number) {
  const day = Math.max(0.2, sunsetJD - sunriseJD);
  const part = day / 8;
  const rahuIdx = [7, 1, 6, 4, 5, 3, 2][weekday] ?? 2;
  const yamaIdx = [4, 3, 2, 1, 0, 6, 5][weekday] ?? 0;
  const gulikaIdx = [6, 5, 4, 3, 2, 1, 0][weekday] ?? 0;
  const span = (i: number) => ({ start: sunriseJD + i * part, end: sunriseJD + (i + 1) * part });
  const choghDayNames = [
    ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
    ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"],
    ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"],
    ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"],
    ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"],
    ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"],
  ];
  const nature: Record<string, string> = {
    Udveg: "bad",
    Char: "good",
    Labh: "good",
    Amrit: "best",
    Kaal: "bad",
    Shubh: "good",
    Rog: "bad",
  };
  const seq = choghDayNames[weekday] ?? choghDayNames[0];
  const choghadiya = seq.map((name, i) => ({
    name,
    nature: nature[name] ?? "good",
    start: sunriseJD + i * part,
    end: sunriseJD + (i + 1) * part,
  }));
  const gowriDay = [
    ["Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi"],
    ["Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi"],
    ["Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam"],
    ["Laabam", "Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam"],
    ["Dhanam", "Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam"],
    ["Sugam", "Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam"],
    ["Soram", "Uthi", "Ahi", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram"],
  ];
  const gowriGood: Record<string, number> = { Laabam: 1, Dhanam: 1, Sugam: 1, Uthi: 1 };
  const gseq = gowriDay[weekday] ?? gowriDay[0];
  const gowri = gseq.map((name, i) => ({
    name,
    good: !!gowriGood[name],
    start: sunriseJD + i * part,
    end: sunriseJD + (i + 1) * part,
  }));
  return {
    rahu: span(rahuIdx),
    yamaganda: span(yamaIdx),
    gulikaKalam: span(gulikaIdx),
    abhijit: { start: sunriseJD + day * 0.5 - day / 15, end: sunriseJD + day * 0.5 + day / 15 },
    choghadiya,
    gowri,
  };
}

function vimshottari(moonLon: number, birthJD: number) {
  const nak = nakshatra(moonLon);
  const lord = nak.lord;
  const startIdx = DASA_ORDER.indexOf(lord);
  const portionUsed = (norm360(moonLon) % (360 / 27)) / (360 / 27);
  const yearsLeft = DASA_YEARS[lord] * (1 - portionUsed);
  let jd = birthJD;
  const periods: DasaPeriod[] = [];
  periods.push({
    lord,
    years: yearsLeft,
    startJD: birthJD,
    endJD: birthJD + yearsLeft * 365.2425,
    balance: true,
  });
  jd += yearsLeft * 365.2425;
  for (let i = 1; i < 9; i++) {
    const L = DASA_ORDER[(startIdx + i) % 9];
    const y = DASA_YEARS[L];
    periods.push({ lord: L, years: y, startJD: jd, endJD: jd + y * 365.2425, balance: false });
    jd += y * 365.2425;
  }
  return { nak: nak.idx, pada: nak.pada, lord, periods };
}

export function bhuktis(maha: DasaPeriod) {
  const si = DASA_ORDER.indexOf(maha.lord);
  const fullDays = DASA_YEARS[maha.lord] * 365.2425;
  let cursor = maha.balance ? maha.endJD - fullDays : maha.startJD;
  const out: { lord: (typeof DASA_ORDER)[number]; startJD: number; endJD: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const b = DASA_ORDER[(si + i) % 9];
    const bdays = fullDays * (DASA_YEARS[b] / 120);
    const bstart = cursor;
    const bend = cursor + bdays;
    cursor = bend;
    if (bend <= maha.startJD) continue;
    const st = Math.max(bstart, maha.startJD);
    const en = Math.min(bend, maha.endJD);
    if (en > st) out.push({ lord: b, startJD: st, endJD: en });
  }
  return out;
}

export function antardasas(bhukti: { lord: (typeof DASA_ORDER)[number]; startJD: number; endJD: number }) {
  const si = DASA_ORDER.indexOf(bhukti.lord);
  const span = bhukti.endJD - bhukti.startJD;
  let cursor = bhukti.startJD;
  const out: { lord: (typeof DASA_ORDER)[number]; startJD: number; endJD: number }[] = [];
  for (let i = 0; i < 9; i++) {
    const a = DASA_ORDER[(si + i) % 9];
    const days = span * (DASA_YEARS[a] / 120);
    const st = cursor;
    const en = cursor + days;
    cursor = en;
    out.push({ lord: a, startJD: st, endJD: Math.min(en, bhukti.endJD) });
  }
  return out;
}

function ashtakavarga(bodies: Record<string, number>) {
  const bav = {} as Record<BavPlanet, number[]>;
  const sav = Array(12).fill(0);
  for (const planet of BAV_PLANETS) {
    const signs = Array(12).fill(0);
    const table = BAV[planet];
    for (const from of BAV_FROM) {
      const fromSign = signIndex(bodies[from] ?? 0);
      for (const h of table[from]) {
        signs[(fromSign + h - 1) % 12] += 1;
      }
    }
    bav[planet] = signs;
    for (let i = 0; i < 12; i++) sav[i] += signs[i];
  }
  return { sav, bav };
}

const VARNA_SIGN_STD = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3];
const VASHYA_SIGN = [0, 1, 2, 3, 0, 1, 4, 3, 0, 1, 4, 2];
const GANA_NAK = [0, 1, 2, 1, 2, 1, 0, 2, 2, 0, 1, 1, 0, 2, 2, 1, 2, 0, 0, 1, 1, 0, 2, 2, 1, 1, 2];
const NADI_NAK = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
const YONI_NAK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 4, 13, 2, 8, 14, 15, 1, 16, 13, 7, 5, 14, 16, 3];
const SIGN_LORD = [4, 3, 2, 1, 0, 2, 3, 4, 5, 6, 6, 5];
const FRIEND: Record<number, number[]> = {
  0: [0, 4, 3],
  1: [1, 3, 6],
  2: [2, 5, 0],
  3: [3, 1, 5],
  4: [4, 0, 2],
  5: [5, 1, 3],
  6: [6, 2, 5],
};

export function ashtakoot(boyMoon: number, girlMoon: number) {
  const bs = signIndex(boyMoon);
  const gs = signIndex(girlMoon);
  const bn = nakshatra(boyMoon).idx;
  const gn = nakshatra(girlMoon).idx;
  const varna = VARNA_SIGN_STD[gs] >= VARNA_SIGN_STD[bs] ? 1 : 0;
  const vashya = bs === gs ? 2 : VASHYA_SIGN[bs] === VASHYA_SIGN[gs] ? 1 : 0.5;
  const taraCount = ((gn - bn + 27) % 27) + 1;
  const taraPts = [3, 1.5, 3, 1.5, 3, 1.5, 3, 1.5, 3][(taraCount % 9 || 9) - 1];
  const yoni = YONI_NAK[bn] === YONI_NAK[gn] ? 4 : 2;
  const bl = SIGN_LORD[bs];
  const gl = SIGN_LORD[gs];
  let gm = 0.5;
  if (bl === gl) gm = 5;
  else if ((FRIEND[bl] || []).includes(gl)) gm = 4;
  else gm = 1;
  const gana = GANA_NAK[bn] === GANA_NAK[gn] ? 6 : GANA_NAK[bn] + GANA_NAK[gn] === 1 ? 3 : 1;
  const houses = ((gs - bs + 12) % 12) + 1;
  const bhakoot = [2, 12, 5, 9, 6, 8].includes(houses) ? 0 : 7;
  const nadi = NADI_NAK[bn] === NADI_NAK[gn] ? 0 : 8;
  const items = [
    { id: "varna", en: "Varna", ta: "வர்ணம்", max: 1, pts: varna },
    { id: "vashya", en: "Vashya", ta: "வசியம்", max: 2, pts: vashya },
    { id: "tara", en: "Tara", ta: "தாரா", max: 3, pts: taraPts },
    { id: "yoni", en: "Yoni", ta: "யோனி", max: 4, pts: yoni },
    { id: "graha", en: "Graha Maitri", ta: "கிரக மைத்திரி", max: 5, pts: gm },
    { id: "gana", en: "Gana", ta: "கணம்", max: 6, pts: gana },
    { id: "bhakoot", en: "Bhakoot", ta: "ராசி / பகூடம்", max: 7, pts: bhakoot },
    { id: "nadi", en: "Nadi", ta: "நாடி", max: 8, pts: nadi },
  ];
  return { items, total: items.reduce((s, x) => s + x.pts, 0), max: 36 };
}

export function formatJD(jd: number, tz: number) {
  const z = jd + tz / 24;
  const J = z + 0.5;
  let Z = Math.floor(J);
  const F = J - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const d = Math.floor(day);
  const frac = day - d;
  const hh = frac * 24;
  const h = Math.floor(hh);
  const mm = Math.floor((hh - h) * 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d)}-${pad(month)}-${year} ${pad(h)}:${pad(mm)}`;
}

export function formatClock(jd: number, tz: number) {
  const s = formatJD(jd, tz);
  return s.split(" ")[1] ?? s;
}

export function nowJD() {
  return Date.now() / 86400000 + 2440587.5;
}

/**
 * Select Ayanamsa according to the chosen calculation school.
 * - lahiri / thirukanitham (Drik) → high-accuracy Lahiri
 * - vakya → traditional Thirukanitham linear model (used only as reference ayan)
 */
export function ayanamsaFor(jd: number, school: School) {
  if (school === "vakya") {
    return ayanamsaThirukanitham(jd);
  }
  // Both "lahiri" and "thirukanitham" (modern Drik) use the improved Lahiri polynomial
  return ayanamsaLahiri(jd);
}

export function siderealGrahas(jd: number, school: School) {
  const aya = ayanamsaFor(jd, school);
  const retro: Partial<Record<PlanetId, boolean>> = {};
  if (school === "vakya") {
    const v = vakyaMean(jd);
    return {
      aya,
      bodies: {
        sun: v.sun,
        moon: v.moon,
        mercury: v.mercury,
        venus: v.venus,
        mars: v.mars,
        jupiter: v.jupiter,
        saturn: v.saturn,
        rahu: v.rahu,
        ketu: norm360(v.rahu + 180),
      } as Record<Exclude<PlanetId, "lagna" | "gulika">, number>,
      retro,
    };
  }
  const trop = tropicalBodies(jd);
  const sid = (x: number) => norm360(x - aya);
  Object.assign(retro, trop.retro);
  return {
    aya,
    bodies: {
      sun: sid(trop.sun),
      moon: sid(trop.moon),
      mercury: sid(trop.mercury),
      venus: sid(trop.venus),
      mars: sid(trop.mars),
      jupiter: sid(trop.jupiter),
      saturn: sid(trop.saturn),
      rahu: sid(trop.rahu),
      ketu: sid(trop.ketu),
    } as Record<Exclude<PlanetId, "lagna" | "gulika">, number>,
    retro,
  };
}

export function compute(input: BirthInput): ChartResult {
  const localHours = input.hour + input.minute / 60;
  const jd = julianDay(input.year, input.month, input.day, localHours - input.tz);
  const school = input.school;
  const grahas = siderealGrahas(jd, school);
  const aya = grahas.aya;
  const tropAsc = tropicalAscendant(jd, input.lat, input.lon);
  const ss = sunTimes(input.year, input.month, input.day, input.lat, input.lon, input.tz);
  const isDay = jd >= ss.sunriseJD && jd < ss.sunsetJD;
  const wd = weekdayFromJD(jd + input.tz / 24);

  const dayLen = ss.sunsetJD - ss.sunriseJD;
  const nightLen = ss.nextSunriseJD - ss.sunsetJD;
  const baseLord = isDay ? wd : (wd + 4) % 7;
  const lords = Array.from({ length: 8 }, (_, i) => (baseLord + i) % 8);
  const satIdx = Math.max(lords.indexOf(6), 0);
  const gulikaJD =
    (isDay ? ss.sunriseJD : ss.sunsetJD) + (satIdx / 8) * (isDay ? dayLen : nightLen);
  const tropGulika = tropicalAscendant(gulikaJD, input.lat, input.lon);

  const bodies: Record<PlanetId, number> = {
    ...grahas.bodies,
    lagna: norm360(tropAsc - aya),
    gulika: norm360(tropGulika - aya),
  };
  const retro = grahas.retro;
  const lagnaSign = signIndex(bodies.lagna);

  const list: BodyPos[] = PLANETS.map((p) => {
    const lon = norm360(bodies[p.id]);
    const sd = signDms(lon);
    const nak = nakshatra(lon);
    return {
      id: p.id,
      lon,
      sign: sd.sign,
      dms: sd.text,
      nak: nak.idx,
      pada: nak.pada,
      navamsa: navamsa(lon),
      house: houseFrom(sd.sign, lagnaSign),
      retrograde: !!retro[p.id] || p.id === "rahu" || p.id === "ketu",
    };
  });

  const { sav, bav } = ashtakavarga(bodies);

  return {
    input,
    jd,
    aya,
    school,
    weekday: wd,
    isDay,
    sunriseJD: ss.sunriseJD,
    sunsetJD: ss.sunsetJD,
    list,
    bodies,
    pan: panchanga(bodies.sun, bodies.moon, wd),
    muh: muhurta(ss.sunriseJD, ss.sunsetJD, wd),
    dasa: vimshottari(bodies.moon, jd),
    sav,
    bav,
  };
}

export { KARANA_EN };
