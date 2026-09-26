// Codepackr Astro — Dasa Timeline & Active Period Navigation
import { calculateBhuktis, calculatePratyantardasas, type MahaDasaPeriod, type SubPeriod } from "./vimshottari";
import { formatJD, nowJD } from "../astronomy/time";

export type ActiveDasaState = {
  mahaDasa: MahaDasaPeriod;
  bhukti: SubPeriod;
  pratyantar: SubPeriod;
  targetJD: number;
  daysRemainingInMaha: number;
  daysRemainingInBhukti: number;
  daysRemainingInPratyantar: number;
  mahaStartFormatted: string;
  mahaEndFormatted: string;
  bhuktiStartFormatted: string;
  bhuktiEndFormatted: string;
  pratyantarStartFormatted: string;
  pratyantarEndFormatted: string;
};

/**
 * Resolves the exact active Maha Dasa, Bhukti, and Pratyantardasa for any given target Julian Day.
 */
export function resolveActiveDasa(
  periods: MahaDasaPeriod[],
  targetJD: number = nowJD(),
  tz: number = 5.5
): ActiveDasaState | null {
  const maha = periods.find((p) => targetJD >= p.startJD && targetJD < p.endJD);
  if (!maha) return null;

  const bhuktis = calculateBhuktis(maha);
  const bhukti = bhuktis.find((b) => targetJD >= b.startJD && targetJD < b.endJD) ?? bhuktis[0]!;

  const pratyantars = calculatePratyantardasas(bhukti);
  const pratyantar = pratyantars.find((p) => targetJD >= p.startJD && targetJD < p.endJD) ?? pratyantars[0]!;

  return {
    mahaDasa: maha,
    bhukti,
    pratyantar,
    targetJD,
    daysRemainingInMaha: Math.max(0, Math.round(maha.endJD - targetJD)),
    daysRemainingInBhukti: Math.max(0, Math.round(bhukti.endJD - targetJD)),
    daysRemainingInPratyantar: Math.max(0, Math.round(pratyantar.endJD - targetJD)),
    mahaStartFormatted: formatJD(maha.startJD, tz),
    mahaEndFormatted: formatJD(maha.endJD, tz),
    bhuktiStartFormatted: formatJD(bhukti.startJD, tz),
    bhuktiEndFormatted: formatJD(bhukti.endJD, tz),
    pratyantarStartFormatted: formatJD(pratyantar.startJD, tz),
    pratyantarEndFormatted: formatJD(pratyantar.endJD, tz),
  };
}
