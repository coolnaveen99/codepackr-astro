// Codepackr Astro - Daily Panchangam & Oorai (planetary horas)
import {
  julianDay,
  nakshatra,
  siderealGrahas,
  sunTimes,
  weekdayFromJD,
  panchanga,
  muhurta,
  type ChartResult,
  type School,
} from "./engine";

/** Planetary hora lords cycle starting from the weekday lord. */
const HORA_LORDS = ["sun", "venus", "mercury", "moon", "saturn", "jupiter", "mars"] as const;
const WEEKDAY_HORA_START = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as const;

export type HoraSlot = {
  lord: (typeof HORA_LORDS)[number];
  startJD: number;
  endJD: number;
  dayPart: "day" | "night";
};

export type DailyPanchang = {
  year: number;
  month: number;
  day: number;
  tz: number;
  lat: number;
  lon: number;
  place: string;
  school: School;
  jdNoon: number;
  weekday: number;
  aya: number;
  sunriseJD: number;
  sunsetJD: number;
  nextSunriseJD: number;
  pan: ChartResult["pan"];
  muh: ChartResult["muh"];
  horas: HoraSlot[];
  moonNak: { idx: number; pada: number; lon: number };
  sunLon: number;
  moonLon: number;
};

export function planetaryHoras(sunriseJD: number, nextSunriseJD: number, weekday: number): HoraSlot[] {
  const span = Math.max(0.5, nextSunriseJD - sunriseJD);
  const slot = span / 24;
  const startLord = WEEKDAY_HORA_START[weekday] ?? "sun";
  const startIdx = HORA_LORDS.indexOf(startLord as (typeof HORA_LORDS)[number]);
  const mid = sunriseJD + span / 2;
  const out: HoraSlot[] = [];
  for (let i = 0; i < 24; i++) {
    const lord = HORA_LORDS[(startIdx + i) % 7]!;
    const start = sunriseJD + i * slot;
    const end = sunriseJD + (i + 1) * slot;
    out.push({
      lord,
      startJD: start,
      endJD: end,
      dayPart: start < mid ? "day" : "night",
    });
  }
  return out;
}

export function computeDailyPanchang(input: {
  year: number;
  month: number;
  day: number;
  tz: number;
  lat: number;
  lon: number;
  place: string;
  school?: School;
}): DailyPanchang {
  const school = input.school ?? "thirukanitham";
  const jdNoon = julianDay(input.year, input.month, input.day, 12 - input.tz);
  const ss = sunTimes(input.year, input.month, input.day, input.lat, input.lon, input.tz);
  const wd = weekdayFromJD(ss.sunriseJD + input.tz / 24);
  const grahas = siderealGrahas(jdNoon, school);
  const pan = panchanga(grahas.bodies.sun, grahas.bodies.moon, wd);
  const muh = muhurta(ss.sunriseJD, ss.sunsetJD, wd);
  const horas = planetaryHoras(ss.sunriseJD, ss.nextSunriseJD, wd);
  const moonNak = nakshatra(grahas.bodies.moon);
  return {
    year: input.year,
    month: input.month,
    day: input.day,
    tz: input.tz,
    lat: input.lat,
    lon: input.lon,
    place: input.place,
    school,
    jdNoon,
    weekday: wd,
    aya: grahas.aya,
    sunriseJD: ss.sunriseJD,
    sunsetJD: ss.sunsetJD,
    nextSunriseJD: ss.nextSunriseJD,
    pan,
    muh,
    horas,
    moonNak: { idx: moonNak.idx, pada: moonNak.pada, lon: grahas.bodies.moon },
    sunLon: grahas.bodies.sun,
    moonLon: grahas.bodies.moon,
  };
}
