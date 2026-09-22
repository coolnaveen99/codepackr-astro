// Codepackr Astro - Daily / weekly Rasi Palan (no birth data required)
import { SIGNS_EN, SIGNS_TA, NAK_EN, NAK_TA, WEEK_EN, WEEK_TA } from "./constants";
import type { Lang } from "./i18n";
import type { School } from "./constants";
import { computeDailyPanchang, nowJD } from "./engine";

export type RasiPalanRow = {
  sign: number;
  title: string;
  body: string;
  tone: "good" | "mixed" | "caution";
};

export type DailyPalanBundle = {
  dateLabel: string;
  weekday: string;
  moonSign: number;
  moonNak: string;
  tithiHint: string;
  rows: RasiPalanRow[];
};

const BASE_TA = [
  "செயல் வேகம் உயரும். புதிய முயற்சிக்கு நல்ல நாள் — அவசரப் பேச்சைத் தவிர்க்கவும்.",
  "பொருள் / உணவு விஷயத்தில் நிலை. குடும்ப உரையாடல் பயன் தரும்.",
  "குறு பயணம் அல்லது கைத்திறன் வேலைக்கு ஆதரவு. சகோதரர் தொடர்பு நல்லது.",
  "வீடு / வாகனம் / தாய் தொடர்பு முக்கியம். மன அமைதிக்கு ஓய்வு தேவை.",
  "கல்வி, மந்திரம், முதலீடு சிந்தனைக்கு நல்லது. குழந்தைகள் விஷயத்தில் பொறுமை.",
  "வேலைப் போட்டி / கடன் ஒழுங்கு. உடல் கவனிப்பு மறக்காதீர்கள்.",
  "கூட்டாண்மை / ஒப்பந்தம் பேச்சுக்கு நாள். நடுநிலை வைத்திருங்கள்.",
  "ஆராய்ச்சி / மரபு விவகாரம். ரகசியத்தைப் பகிராதீர்கள்.",
  "குரு / தந்தை / தீர்த்த சிந்தனை. தானம் சிறிய அளவில் உதவும்.",
  "தொழில் முகப்பு நல்லது. அதிகார உரையாடலில் மரியாதை காட்டுங்கள்.",
  "லாபம் / நண்பர் வட்டம் ஆதரவு. ஆசைகளை முன்னுரிமைப்படுத்துங்கள்.",
  "செலவு கண்காணிப்பு. வெளிநாடு / தூக்க ஒழுங்கு முக்கியம்.",
];

const BASE_EN = [
  "Action energy is high. Good day for a new start — avoid sharp speech.",
  "Steady on money and food. Family talk helps.",
  "Short travel or craft work is supported. Sibling contact is useful.",
  "Home, vehicle, mother themes. Rest for peace of mind.",
  "Study, mantra, light investment thoughts. Patience with children.",
  "Work rivalry or debt discipline. Do not skip health care.",
  "Partnership or contract talk. Stay balanced.",
  "Research or inheritance matters. Do not share secrets lightly.",
  "Guru, father, pilgrimage mood. Small charity helps.",
  "Career face is strong. Show respect in authority talks.",
  "Gains and friends support. Prioritise desires wisely.",
  "Watch expenses. Foreign links or sleep routine matter.",
];

function relationTone(transitMoonSign: number, rasi: number): "good" | "mixed" | "caution" {
  const d = ((transitMoonSign - rasi + 12) % 12) + 1;
  if (d === 1 || d === 5 || d === 9) return "good";
  if (d === 6 || d === 8 || d === 12) return "caution";
  return "mixed";
}

function toneNote(tone: "good" | "mixed" | "caution", lang: Lang): string {
  if (lang === "ta") {
    if (tone === "good") return "சந்திர கோசாரம் ஆதரவு.";
    if (tone === "caution") return "சந்திர கோசாரத்தில் கவனம்.";
    return "சராசரி கோசாரம் — முயற்சி முக்கியம்.";
  }
  if (tone === "good") return "Moon transit supports.";
  if (tone === "caution") return "Moon transit asks caution.";
  return "Average transit — effort leads.";
}

export function buildDailyRasiPalan(opts?: {
  lang?: Lang;
  school?: School;
  place?: { lat: number; lon: number; tz: number };
  jd?: number;
}): DailyPalanBundle {
  const lang = opts?.lang ?? "ta";
  const school = opts?.school ?? "thirukanitham";
  const place = opts?.place ?? { lat: 13.08, lon: 80.27, tz: 5.5 };
  const jd = opts?.jd ?? nowJD();

  const unix = (jd - 2440587.5) * 86400 * 1000;
  const d = new Date(unix);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  const pan = computeDailyPanchang({
    year: y,
    month: m,
    day,
    lat: place.lat,
    lon: place.lon,
    tz: place.tz,
    place: "Chennai",
    school,
  });

  const moonSign = Math.floor(pan.moonLon / 30) % 12;
  const weekday = lang === "ta" ? WEEK_TA[pan.weekday] : WEEK_EN[pan.weekday];
  const moonNak = lang === "ta" ? NAK_TA[pan.moonNak.idx] : NAK_EN[pan.moonNak.idx];
  const dateLabel = `${day}/${m}/${y}`;

  const rows: RasiPalanRow[] = Array.from({ length: 12 }, (_, sign) => {
    const tone = relationTone(moonSign, sign);
    const base = lang === "ta" ? BASE_TA[sign] : BASE_EN[sign];
    const title = lang === "ta" ? SIGNS_TA[sign] : SIGNS_EN[sign];
    const body = `${base} ${toneNote(tone, lang)}`;
    return { sign, title, body, tone };
  });

  return {
    dateLabel,
    weekday,
    moonSign,
    moonNak: `${moonNak} · ${lang === "ta" ? "பாதம்" : "Pada"} ${pan.moonNak.pada}`,
    tithiHint: lang === "ta" ? "இன்றைய சந்திர ராசி அடிப்படையில்" : "Based on today’s Moon sign",
    rows,
  };
}
