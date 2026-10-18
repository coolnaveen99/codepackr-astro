// src/i18n/jyotish-lexicon.ts — Zero-indexed domain entities
export const rashis = [
  { ta: "மேஷம்", en: "Aries (Mesha)", hi: "मेष", te: "మేషం" },
  { ta: "ரிஷபம்", en: "Taurus (Vrishabha)", hi: "वृषभ", te: "వృషభం" },
  { ta: "மிதுனம்", en: "Gemini (Mithuna)", hi: "मिथुन", te: "మిథునం" },
  { ta: "கடகம்", en: "Cancer (Karka)", hi: "कर्क", te: "కర్కాటకం" },
  { ta: "சிம்மம்", en: "Leo (Simha)", hi: "सिंह", te: "సింహం" },
  { ta: "கன்னி", en: "Virgo (Kanya)", hi: "कन्या", te: "కన్య" },
  { ta: "துலாம்", en: "Libra (Tula)", hi: "तुला", te: "తుల" },
  { ta: "விருச்சிகம்", en: "Scorpio (Vrischika)", hi: "वृश्चिक", te: "వృశ్చికం" },
  { ta: "தனுசு", en: "Sagittarius (Dhanu)", hi: "धनु", te: "ధనుస్సు" },
  { ta: "மகரம்", en: "Capricorn (Makara)", hi: "मकर", te: "మకరం" },
  { ta: "கும்பம்", en: "Aquarius (Kumbha)", hi: "कुंभ", te: "కుంభం" },
  { ta: "மீனம்", en: "Pisces (Meena)", hi: "मीन", te: "మీనం" },
];

export const nakshatras = [
  // 0-26: Ashwini to Revati — abbreviated for brevity; expand fully in production
  { ta: "அசுவினி", en: "Ashwini", hi: "अश्विनी" },
  // ... add remaining 26
];

export function getRashiName(index: number, locale: string): string {
  const r = rashis[index];
  if (!r) return "Unknown";
  return (r as any)[locale] || r.en || r.ta;
}
