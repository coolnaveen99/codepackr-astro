// src/i18n/ui.ts — Basic UI chrome strings
export const ui = {
  ta: {
    siteTitle: "CodePackr Astro",
    description: "தமிழில் இலவச ஜோதிட மற்றும் காலண்டர் கருவிகள்",
    tools: "கருவிகள்",
    jathagam: "ஜாதகம்",
    panchangam: "பஞ்சாங்கம்",
    search: "தேடுக...",
  },
  en: {
    siteTitle: "CodePackr Astro",
    description: "Free Vedic astrology and calendar tools",
    tools: "Tools",
    jathagam: "Birth Chart",
    panchangam: "Panchangam",
    search: "Search...",
  },
  hi: {
    siteTitle: "CodePackr Astro",
    description: "निःशुल्क वैदिक ज्योतिष और कैलेंडर उपकरण",
    tools: "उपकरण",
    jathagam: "जन्म कुंडली",
    panchangam: "पंचांग",
    search: "खोजें...",
  },
  // te, ml, kn can be added similarly
} as const;

export function getUI(locale: string) {
  return ui[locale as keyof typeof ui] || ui.ta;
}
