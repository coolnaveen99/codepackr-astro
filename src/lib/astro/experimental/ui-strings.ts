// Codepackr Astro — legacy UI chrome translations.
// Keep every supported locale explicit; callers must not silently fall back to Tamil.
import type { SupportedLocale } from "../locales/multi-lang";

export type BasicUIStrings = {
  siteTitle: string;
  description: string;
  tools: string;
  jathagam: string;
  panchangam: string;
  search: string;
};

export const ui: Record<SupportedLocale, BasicUIStrings> = {
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
  te: {
    siteTitle: "CodePackr Astro",
    description: "ఉచిత వేద జ్యోతిష్య మరియు క్యాలెండర్ సాధనాలు",
    tools: "సాధనాలు",
    jathagam: "జన్మ జాతకం",
    panchangam: "పంచాంగం",
    search: "వెతకండి...",
  },
  kn: {
    siteTitle: "CodePackr Astro",
    description: "ಉಚಿತ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ಕ್ಯಾಲೆಂಡರ್ ಸಾಧನಗಳು",
    tools: "ಸಾಧನಗಳು",
    jathagam: "ಜನ್ಮ ಜಾತಕ",
    panchangam: "ಪಂಚಾಂಗ",
    search: "ಹುಡುಕಿ...",
  },
  ml: {
    siteTitle: "CodePackr Astro",
    description: "സൗജന്യ വേദ ജ്യോതിഷ, കലണ്ടർ ഉപകരണങ്ങൾ",
    tools: "ഉപകരണങ്ങൾ",
    jathagam: "ജന്മ ജാതകം",
    panchangam: "പഞ്ചാംഗം",
    search: "തിരയുക...",
  },
};

export function getUI(locale: string): BasicUIStrings {
  const normalized = locale.toLowerCase().split(/[-_]/)[0] as SupportedLocale;
  return ui[normalized] ?? ui.en;
}
