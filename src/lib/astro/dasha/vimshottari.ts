// Codepackr Astro — Vimshottari Dasa Calculation Engine
import { normalize360 } from "../astronomy/coordinates";
import { nakshatraDetails } from "../calendar/nakshatra";
import { DASA_ORDER, DASA_YEARS } from "../constants";

export type MahaDasaPeriod = {
  lord: (typeof DASA_ORDER)[number];
  years: number;
  startJD: number;
  endJD: number;
  balance: boolean;
};

export type SubPeriod = {
  lord: (typeof DASA_ORDER)[number];
  startJD: number;
  endJD: number;
};

/**
 * Calculates Vimshottari Maha Dasa sequence and birth balance from Moon's sidereal longitude and birth JD.
 * Solar year duration standard: 365.2425 days.
 */
export function calculateVimshottariDasa(moonLon: number, birthJD: number) {
  const nak = nakshatraDetails(moonLon);
  const lord = nak.lord as (typeof DASA_ORDER)[number];
  const startIdx = DASA_ORDER.indexOf(lord);
  const portionUsed = nak.portionUsed;
  const totalYears = DASA_YEARS[lord];
  const yearsLeft = totalYears * (1 - portionUsed);

  let currentJD = birthJD;
  const periods: MahaDasaPeriod[] = [];

  // Initial balance period at birth
  periods.push({
    lord,
    years: yearsLeft,
    startJD: birthJD,
    endJD: birthJD + yearsLeft * 365.2425,
    balance: true,
  });
  currentJD += yearsLeft * 365.2425;

  // Remaining 8 dasas of the 120-year cycle
  for (let i = 1; i < 9; i++) {
    const l = DASA_ORDER[(startIdx + i) % 9]!;
    const y = DASA_YEARS[l];
    periods.push({
      lord: l,
      years: y,
      startJD: currentJD,
      endJD: currentJD + y * 365.2425,
      balance: false,
    });
    currentJD += y * 365.2425;
  }

  return {
    nakshatraIndex: nak.index,
    pada: nak.pada,
    balanceLord: lord,
    balanceYears: yearsLeft,
    periods,
  };
}

/**
 * Computes all 9 Bhuktis (Antardasas) within a Maha Dasa period.
 */
export function calculateBhuktis(maha: MahaDasaPeriod): SubPeriod[] {
  const si = DASA_ORDER.indexOf(maha.lord);
  const fullSpanDays = DASA_YEARS[maha.lord] * 365.2425;
  let cursor = maha.balance ? maha.endJD - fullSpanDays : maha.startJD;
  const bhuktis: SubPeriod[] = [];

  for (let i = 0; i < 9; i++) {
    const bLord = DASA_ORDER[(si + i) % 9]!;
    const bDays = fullSpanDays * (DASA_YEARS[bLord] / 120);
    const bStart = cursor;
    const bEnd = cursor + bDays;
    cursor = bEnd;

    if (bEnd <= maha.startJD) continue;
    const s = Math.max(bStart, maha.startJD);
    const e = Math.min(bEnd, maha.endJD);
    if (e > s) {
      bhuktis.push({ lord: bLord, startJD: s, endJD: e });
    }
  }

  return bhuktis;
}

/**
 * Computes all 9 Pratyantardasas within a Bhukti period.
 */
export function calculatePratyantardasas(bhukti: SubPeriod): SubPeriod[] {
  const si = DASA_ORDER.indexOf(bhukti.lord);
  const span = bhukti.endJD - bhukti.startJD;
  let cursor = bhukti.startJD;
  const pratyantardasas: SubPeriod[] = [];

  for (let i = 0; i < 9; i++) {
    const pLord = DASA_ORDER[(si + i) % 9]!;
    const pDays = span * (DASA_YEARS[pLord] / 120);
    const s = cursor;
    const e = cursor + pDays;
    cursor = e;
    pratyantardasas.push({ lord: pLord, startJD: s, endJD: Math.min(e, bhukti.endJD) });
  }

  return pratyantardasas;
}
