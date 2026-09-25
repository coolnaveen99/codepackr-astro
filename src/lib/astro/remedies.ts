// Codepackr Astro - Structured classical remedies
import type { Analysis } from "./analysis";
import type { Lang } from "./i18n";
import { planetName } from "./constants";
import { DUSTHANA } from "./tables";

export type Remedy = {
  id: string;
  triggers: string[];
  titleTa: string;
  titleEn: string;
  bodyTa: string;
  bodyEn: string;
  days?: string[];
};

export type RemedyView = {
  id: string;
  title: string;
  body: string;
  days?: string[];
};

const REMEDIES: Remedy[] = [
  {
    id: "chevvai",
    triggers: ["chevvai"],
    titleTa: "செவ்வாய் தோஷ பரிகாரம்",
    titleEn: "Chevvai (Manglik) remedies",
    bodyTa:
      "செவ்வாய்க் கிகமை விரதம் அல்லது சிவன்/வைரவன் வழிபாடு. செவ்வாய் மந்திரம் அல்லது அங்காரக ஸ்தோத்திரம். திருமணப் பொருத்தத்தில் இணைவரின் செவ்வாய் நிலையையும் ஒப்பிடவும். இது வழிகாட்டுதல் மட்டுமே.",
    bodyEn:
      "Tuesday vrata or Shiva/Bhairava worship. Mars mantra or Angaraka stotra. Compare Mars in the partner chart for marriage. Guidance only.",
    days: ["tuesday"],
  },
  {
    id: "sadesati",
    triggers: ["sadesati"],
    titleTa: "ஏழரைச் சனி பரிகாரம்",
    titleEn: "Sade Sati remedies",
    bodyTa:
      "சனிக்கிகமை எள் தீபம் அல்லது ஹனுமான் வழிபாடு. கருப்பு/அடர் நீல ஆடை தானம். பொறுமை, உடல் கவனிப்பு, கடன் ஒழுங்கு. அஷ்டம/கண்டக சனி இருந்தால் கூடுதல் கவனம்.",
    bodyEn:
      "Saturday sesame lamp or Hanuman worship. Charity of dark/blue cloth. Patience, health care, debt discipline. Extra care if Ashtama or Kantaka Sani runs.",
    days: ["saturday"],
  },
  {
    id: "kaalsarpa",
    triggers: ["kaalsarpa"],
    titleTa: "காலசர்ப தோஷ பரிகாரம்",
    titleEn: "Kaal Sarpa remedies",
    bodyTa:
      "நாக பஞ்சமி அல்லது ராகு-கேது வழிபாடு. கலச ஹோமம் / சர்ப தோஷ நிவாரண பூஜை பாரம்பரிய ஸ்தலத்தில். தினசரி குரு வழிபாடும் உதவும். பயம் வேண்டாம் — ஒழுக்கமும் தானமும் முக்கியம்.",
    bodyEn:
      "Naga Panchami or Rahu-Ketu worship. Kalasha homa / Sarpa dosha puja at a traditional place. Daily Guru worship helps. No fear — discipline and charity matter.",
  },
  {
    id: "combust",
    triggers: ["combust"],
    titleTa: "அஸ்தம் / மௌட்ய கிரக பரிகாரம்",
    titleEn: "Combust planet remedies",
    bodyTa:
      "சூரியனுக்கு அருகில் உள்ள கிரகத்தின் காரியம் தாமதமாகலாம். அந்த கிரக நாளன்று எளிய தானம் அல்லது மந்திரம். பொறுமையுடன் முடிவு எடுக்கவும்.",
    bodyEn:
      "A combust planet results may delay. Simple charity or mantra on that planet weekday. Decide with patience.",
  },
  {
    id: "dusthana",
    triggers: ["dusthana"],
    titleTa: "தூஸ்தான அதிபதி பரிகாரம்",
    titleEn: "Dusthana lord remedies",
    bodyTa:
      "6, 8, 12 இட அதிபதிகள் வலுவிழந்தால் அந்த பாவ விஷயத்தில் முயற்சி கூட்டவும். சனி/ராகு தொடர்பு இருந்தால் சனிக்கிகமை வழிபாடு. மருத்துவம் / சட்டம் தேவைப்பட்டால் நிபுணரை அணுகவும்.",
    bodyEn:
      "If lords of 6, 8, 12 are weak, increase effort in those house topics. Saturday worship if Saturn/Rahu links. Seek professionals for medical or legal needs.",
    days: ["saturday"],
  },
  {
    id: "general_guru",
    triggers: ["general"],
    titleTa: "பொதுவான குரு பரிகாரம்",
    titleEn: "General Guru remedies",
    bodyTa:
      "வியாழக்கிகமை மஞ்சள் ஆடை / பயறு தானம். குரு வழிபாடு ஜாதக நன்மையை ஆதரிக்கும். இது அனைவருக்கும் பொருந்தும் எளிய நியமம்.",
    bodyEn:
      "Thursday yellow cloth or pulse charity. Guru worship supports chart strength. A simple practice suitable for most charts.",
    days: ["thursday"],
  },
  {
    id: "general_lamp",
    triggers: ["general"],
    titleTa: "நியம தீபம்",
    titleEn: "Steady lamp practice",
    bodyTa:
      "மாலை நேரத்தில் விளக்கேற்றுவது மன அமைதிக்கு உதவும். குலதெய்வ வழிபாட்டைத் தொடரவும். ஜோதிடம் வழிகாட்டுதல் மட்டுமே — சுயமுயற்சி முக்கியம்.",
    bodyEn:
      "Lighting a lamp at dusk supports calm. Continue family-deity worship. Astrology is guidance only — self-effort matters.",
  },
  {
    id: "weak_moon",
    triggers: ["weak_moon"],
    titleTa: "சந்திரன் பலவீனம் — பரிகாரம்",
    titleEn: "Weak Moon remedies",
    bodyTa:
      "திங்கட்கிழமை வெண்மை / பால் தானம். சந்திர மந்திரம் அல்லது சோம வழிபாடு. உறக்கம், உணவு ஒழுங்கு மன அமைதிக்கு உதவும்.",
    bodyEn:
      "Monday white/milk charity. Chandra mantra or Soma worship. Sleep and food discipline support mental calm.",
    days: ["monday"],
  },
  {
    id: "weak_jupiter",
    triggers: ["weak_jupiter"],
    titleTa: "குரு பலவீனம் — பரிகாரம்",
    titleEn: "Weak Jupiter remedies",
    bodyTa:
      "வியாழக்கிழமை மஞ்சள் ஆடை / பயறு / புத்தக தானம். குரு வழிபாடு, கல்வி மற்றும் தானம் ஜாதகத்தை ஆதரிக்கும்.",
    bodyEn:
      "Thursday yellow cloth, pulses, or book charity. Guru worship, study, and giving support the chart.",
    days: ["thursday"],
  },
  {
    id: "weak_venus",
    triggers: ["weak_venus"],
    titleTa: "சுக்கிரன் பலவீனம் — பரிகாரம்",
    titleEn: "Weak Venus remedies",
    bodyTa:
      "வெள்ளிக்கிழமை வெண்மை / இனிப்பு தானம். லட்சுமி அல்லது சுக்கிர வழிபாடு. உறவுகளில் மரியாதையும் கலையும் உதவும்.",
    bodyEn:
      "Friday white/sweet charity. Lakshmi or Venus worship. Respect in relationships and arts support harmony.",
    days: ["friday"],
  },
  {
    id: "weak_saturn",
    triggers: ["weak_saturn"],
    titleTa: "சனி பலவீனம் — பரிகாரம்",
    titleEn: "Weak Saturn remedies",
    bodyTa:
      "சனிக்கிழமை எள் / கருப்பு உடை தானம். ஹனுமான் அல்லது சனி வழிபாடு. பொறுமை, நேரம், கடமை ஒழுங்கு முக்கியம்.",
    bodyEn:
      "Saturday sesame or dark-cloth charity. Hanuman or Saturn worship. Patience, time discipline, and duty matter.",
    days: ["saturday"],
  },
  {
    id: "weak_mars",
    triggers: ["weak_mars"],
    titleTa: "செவ்வாய் பலவீனம் / கோபம் — பரிகாரம்",
    titleEn: "Weak or afflicted Mars remedies",
    bodyTa:
      "செவ்வாய்க்கிழமை சிவன்/சுப்பிரமணியர் வழிபாடு. சிவப்பு பருப்பு தானம். கோபத்தை அடக்கி உடற்பயிற்சி நல்லது.",
    bodyEn:
      "Tuesday Shiva/Subrahmanya worship. Red lentil charity. Channel anger into exercise; avoid rash speech.",
    days: ["tuesday"],
  },
  {
    id: "rahu_ketu",
    triggers: ["rahu_ketu"],
    titleTa: "ராகு-கேது பரிகாரம்",
    titleEn: "Rahu–Ketu remedies",
    bodyTa:
      "நாக பஞ்சமி / ராகு-கேது ஸ்தோத்திரம். கலச ஹோமம் பாரம்பரிய ஸ்தலத்தில். திடீர் முடிவுகளைத் தவிர்த்து ஒழுக்கம் வைத்திருங்கள்.",
    bodyEn:
      "Naga Panchami or Rahu–Ketu stotra. Kalasha homa at a traditional place. Avoid impulsive choices; keep discipline.",
  },
];

function hasCombust(a: Analysis): boolean {
  return a.grahas.some((g) => g.combust && g.id !== "sun" && g.id !== "rahu" && g.id !== "ketu");
}

function hasWeakDusthanaLord(a: Analysis): boolean {
  return a.bhavas.some((b) => {
    if (!DUSTHANA.includes(b.house)) return false;
    const g = a.grahas.find((x) => x.id === b.lord);
    return g && (g.dignity === "debil" || g.dignity === "enemy" || DUSTHANA.includes(g.house));
  });
}

function isWeakPlanet(a: Analysis, id: string): boolean {
  const g = a.grahas.find((x) => x.id === id);
  if (!g) return false;
  return g.dignity === "debil" || g.dignity === "enemy" || (g.combust && id !== "sun");
}

export function getRemediesFor(a: Analysis, lang: Lang): RemedyView[] {
  const triggers = new Set<string>(["general"]);
  if (a.chevvai.present && !a.chevvai.cancelled) triggers.add("chevvai");
  if (a.sadeSati.present || a.sadeSati.ashtama || a.sadeSati.kantaka) triggers.add("sadesati");
  if (a.kaalSarpa.present) triggers.add("kaalsarpa");
  if (hasCombust(a)) triggers.add("combust");
  if (hasWeakDusthanaLord(a)) triggers.add("dusthana");
  if (isWeakPlanet(a, "moon")) triggers.add("weak_moon");
  if (isWeakPlanet(a, "jupiter")) triggers.add("weak_jupiter");
  if (isWeakPlanet(a, "venus")) triggers.add("weak_venus");
  if (isWeakPlanet(a, "saturn")) triggers.add("weak_saturn");
  if (isWeakPlanet(a, "mars") || (a.chevvai.present && !a.chevvai.cancelled)) triggers.add("weak_mars");
  const rahu = a.grahas.find((g) => g.id === "rahu");
  const ketu = a.grahas.find((g) => g.id === "ketu");
  if (a.kaalSarpa.present || (rahu && DUSTHANA.includes(rahu.house)) || (ketu && DUSTHANA.includes(ketu.house))) {
    triggers.add("rahu_ketu");
  }

  const out: RemedyView[] = [];
  for (const r of REMEDIES) {
    if (!r.triggers.some((t) => triggers.has(t))) continue;
    out.push({
      id: r.id,
      title: lang === "ta" ? r.titleTa : r.titleEn,
      body: lang === "ta" ? r.bodyTa : r.bodyEn,
      days: r.days,
    });
  }
  return out;
}

export function remedyDisclaimer(lang: Lang): string {
  return lang === "ta"
    ? "இது வழிகாட்டுதல் மட்டுமே. முக்கியமான முடிவுகளுக்கு அனுபவமுள்ள ஜோதிடர் / மருத்துவர் / குடும்ப குருவை அணுகவும்."
    : "Guidance only. For important decisions consult an experienced jothidar, doctor, or family guide.";
}

/** Short dasa narrative for timeline UI */
export function dasaNarrative(lord: string, lang: Lang): string {
  const mapTa: Record<string, string> = {
    ketu: "கேது தசை — ஆன்மீகம், மாற்றம், பழையதை விட்டு முன்னேறும் காலம். அமைதியான முடிவுகள் நல்லது.",
    venus: "சுக்கிரன் தசை — கலை, சுகம், திருமணம், செலவ வாய்ப்பு. உறவுகளில் நடுநிலை வைத்திருங்கள்.",
    sun: "சூரியன் தசை — அதிகாரம், தந்தை/அரசு தொடர்பு, கீர்த்தி. அகங்காரம் தவிர்த்து பொறுப்பு ஏற்கவும்.",
    moon: "சந்திரன் தசை — மனம், மாற்று, பயணம், தாய்/வீடு. உணர்ச்சிகளை ஒழுங்குபடுத்துங்கள்.",
    mars: "செவ்வாய் தசை — துணிவு, நிலம், சகோதரர், போட்டி. அவசர முடிவுகளைத் தவிர்க்கவும்.",
    rahu: "ராகு தசை — வெளிநாடு, தொழில்நுட்பம், எதிர்பாராத வாய்ப்பு. ஒழுக்கத்தை விடாதீர்கள்.",
    jupiter: "குரு தசை — ஞானம், குழந்தை, செலவம், குரு ஆசிர்வாதம். கல்வி/தானம் ஆதரவு.",
    saturn: "சனி தசை — பொறுப்பு, கடின உழைப்பு, தாமதம் பின் நிலை. பொறுமையே வெற்றி.",
    mercury: "புதன் தசை — வணிகம், எழுத்து, நண்பர், பகுத்தறிவு. பேச்சு மற்றும் ஒப்பந்தத்தில் கவனம்.",
  };
  const mapEn: Record<string, string> = {
    ketu: "Ketu dasa — spirituality, change, letting go of the old. Calm decisions help.",
    venus: "Venus dasa — arts, comfort, marriage, wealth chances. Keep balance in relationships.",
    sun: "Sun dasa — authority, father/government links, reputation. Take responsibility without ego.",
    moon: "Moon dasa — mind, change, travel, mother/home. Steady the emotions.",
    mars: "Mars dasa — courage, land, siblings, competition. Avoid rash decisions.",
    rahu: "Rahu dasa — foreign, technology, unexpected openings. Keep discipline.",
    jupiter: "Jupiter dasa — wisdom, children, wealth, teacher grace. Study and charity support.",
    saturn: "Saturn dasa — duty, hard work, delay then stability. Patience wins.",
    mercury: "Mercury dasa — trade, writing, friends, analysis. Care with speech and contracts.",
  };
  if (lang === "ta") return mapTa[lord] ?? `${planetName(lord as never, "ta")} தசை — முயற்சிக்கேற்ப பலன்.`;
  return mapEn[lord] ?? `${planetName(lord as never, "en")} dasa — results follow effort.`;
}
