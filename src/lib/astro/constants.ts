// Codepackr Astro - Astronomical Constants & Signs
export const SIGNS_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const SIGNS_TA = [
  "மேஷம்",
  "ரிஷபம்",
  "மிதுனம்",
  "கடகம்",
  "சிம்மம்",
  "கன்னி",
  "துலாம்",
  "விருச்சிகம்",
  "தனுசு",
  "மகரம்",
  "கும்பம்",
  "மீனம்",
] as const;

export const SIGNS_SHORT_EN = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
export const SIGNS_SHORT_TA = ["மே", "ரி", "மி", "கட", "சி", "கனி", "து", "வி", "தனு", "மக", "கும்", "மீ"];

export const NAK_EN = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashirsha",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAK_TA = [
  "அசுவினி",
  "பரணி",
  "கார்த்திகை",
  "ரோகிணி",
  "மிருகசீரிடம்",
  "திருவாதிரை",
  "புனர்பூசம்",
  "பூசம்",
  "ஆயில்யம்",
  "மகம்",
  "பூரம்",
  "உத்திரம்",
  "ஹஸ்தம்",
  "சித்திரை",
  "சுவாதி",
  "விசாகம்",
  "அனுஷம்",
  "கேட்டை",
  "மூலம்",
  "பூராடம்",
  "உத்திராடம்",
  "திருவோணம்",
  "அவிட்டம்",
  "சதயம்",
  "பூரட்டாதி",
  "உத்திரட்டாதி",
  "ரேவதி",
] as const;

export const NAK_LORD = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
] as const;

export const DASA_ORDER = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
] as const;

export const DASA_YEARS: Record<(typeof DASA_ORDER)[number], number> = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};

export const WEEK_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEK_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

export const TITHI_EN = [
  "Prathama",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima/Amavasya",
];

export const TITHI_TA = [
  "பிரதமை",
  "துவிதியை",
  "திருதியை",
  "சதுர்த்தி",
  "பஞ்சமி",
  "சஷ்டி",
  "சப்தமி",
  "அஷ்டமி",
  "நவமி",
  "தசமி",
  "ஏகாதசி",
  "துவாதசி",
  "திரயோதசி",
  "சதுர்த்தசி",
  "பௌர்ணமி/அமாவாசை",
];

export const YOGA_EN = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shula",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

export const YOGA_TA = [
  "விஷ்கம்பம்",
  "ப்ரீதி",
  "ஆயுஷ்மான்",
  "சௌபாக்கியம்",
  "சோபனம்",
  "அதிகண்டம்",
  "சுகர்மம்",
  "த்ருதி",
  "சூலம்",
  "கண்டம்",
  "விருத்தி",
  "த்ருவம்",
  "வியாகாதம்",
  "ஹர்ஷணம்",
  "வஜ்ரம்",
  "சித்தி",
  "வியதீபாதம்",
  "வரியன்",
  "பரிகம்",
  "சிவம்",
  "சித்தம்",
  "சாத்தியம்",
  "சுபம்",
  "சுக்லம்",
  "பிரஹ்மா",
  "இந்திரம்",
  "வைத்ருதி",
];

export const KARANA_EN = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garija",
  "Vanija",
  "Vishti",
  "Shakuni",
  "Chatushpada",
  "Naga",
  "Kimstughna",
];

export const KARANA_TA = [
  "பவம்",
  "பாலவம்",
  "கௌலவம்",
  "தைதிலம்",
  "கரிஜம்",
  "வணிஜம்",
  "விஷ்டி",
  "சகுனி",
  "சதுஷ்பாதம்",
  "நாகம்",
  "கிம்ஸ்துக்னம்",
];

export const TAMIL_MONTH_EN = [
  "Chithirai",
  "Vaikasi",
  "Aani",
  "Aadi",
  "Aavani",
  "Purattasi",
  "Aippasi",
  "Karthigai",
  "Margazhi",
  "Thai",
  "Maasi",
  "Panguni",
];

export const TAMIL_MONTH_TA = [
  "சித்திரை",
  "வைகாசி",
  "ஆனி",
  "ஆடி",
  "ஆவணி",
  "புரட்டாசி",
  "ஐப்பசி",
  "கார்த்திகை",
  "மார்கழி",
  "தை",
  "மாசி",
  "பங்குனி",
];

export type PlanetId =
  | "lagna"
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu"
  | "gulika";

export const PLANETS: {
  id: PlanetId;
  en: string;
  ta: string;
  glyph: string;
  shortTa: string;
}[] = [
  { id: "lagna", en: "Lagna", ta: "லக்னம்", glyph: "Lg", shortTa: "லக்" },
  { id: "sun", en: "Sun", ta: "சூரியன்", glyph: "Su", shortTa: "சூ" },
  { id: "moon", en: "Moon", ta: "சந்திரன்", glyph: "Mo", shortTa: "சந்" },
  { id: "mars", en: "Mars", ta: "செவ்வாய்", glyph: "Ma", shortTa: "செ" },
  { id: "mercury", en: "Mercury", ta: "புதன்", glyph: "Me", shortTa: "பு" },
  { id: "jupiter", en: "Jupiter", ta: "குரு", glyph: "Ju", shortTa: "கு" },
  { id: "venus", en: "Venus", ta: "சுக்கிரன்", glyph: "Ve", shortTa: "சு" },
  { id: "saturn", en: "Saturn", ta: "சனி", glyph: "Sa", shortTa: "சனி" },
  { id: "rahu", en: "Rahu", ta: "ராகு", glyph: "Ra", shortTa: "ரா" },
  { id: "ketu", en: "Ketu", ta: "கேது", glyph: "Ke", shortTa: "கே" },
  { id: "gulika", en: "Gulika", ta: "குளிகன்", glyph: "Gk", shortTa: "குளி" },
];

export const PLANET_BY_ID = Object.fromEntries(PLANETS.map((p) => [p.id, p])) as Record<
  PlanetId,
  (typeof PLANETS)[number]
>;

export function planetName(id: PlanetId, lang: "ta" | "en") {
  const p = PLANET_BY_ID[id];
  return lang === "ta" ? p.ta : p.en;
}

export type School = "thirukanitham" | "vakya" | "lahiri";

export const SCHOOLS: { id: School; en: string; ta: string; hintEn: string; hintTa: string }[] = [
  {
    id: "thirukanitham",
    en: "Thirukanitham",
    ta: "திருக்கணிதம்",
    hintEn: "Drik + Predict. ayanamsa (Tamilcube / Clickastro)",
    hintTa: "திரிக் கணிதம் · Predict. அயனாம்சம்",
  },
  {
    id: "vakya",
    en: "Vakya Karana",
    ta: "வாக்கியம்",
    hintEn: "Mean motions from Kali epoch — temple panchangam",
    hintTa: "காலி யுக சராசரி இயக்கம் · கோயில் பஞ்சாங்கம்",
  },
  {
    id: "lahiri",
    en: "Lahiri",
    ta: "லாஹிரி",
    hintEn: "Chitrapaksha — compare with North Indian sites",
    hintTa: "சித்திரபட்சம் · ஒப்பீட்டுக்கு",
  },
];
