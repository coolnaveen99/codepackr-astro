// Codepackr Astro - Advanced SEO & Structured Metadata Engine
import { useEffect } from "react";
import type { Page } from "./nav";
import type { Lang } from "./astro/i18n";

export interface ToolSeoConfig {
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  keywordsTa: string;
  keywordsEn: string;
  category: string;
  featureListTa: string[];
  featureListEn: string[];
}

export const SEO_DATA: Partial<Record<Page, ToolSeoConfig>> & { home: ToolSeoConfig; jathagam: ToolSeoConfig } = {
  home: {
    titleTa: "CodePackr Astro — தமிழ் ஜோதிடம், ஜாதகம், பஞ்சாங்கம் மற்றும் இலவச கருவிகள்",
    titleEn: "CodePackr Astro — Tamil Horoscope, Panchangam & Precision Vedic Astrology Tools",
    descTa: "தமிழில் இலவச ஜோதிட மற்றும் காலண்டர் கருவிகள். ஜாதகம், பஞ்சாங்கம், தமிழ் காலண்டர், ராசிபலன், நட்சத்திரம், பொருத்தம் உள்ளிட்ட கருவிகள் ஒரே இடத்தில்.",
    descEn: "Complete suite of free Tamil Vedic astrology and ephemeris tools: Horoscope creator, daily Panchangam, Tamil solar calendar, marriage compatibility, and forecasts.",
    keywordsTa: "tamil astrology, jathagam, panchangam, tamil calendar, porutham, rasipalan, ஜோதிடம், ஜாதகம், பஞ்சாங்கம்",
    keywordsEn: "tamil astrology, vedic horoscope, daily panchangam, tamil calendar, marriage compatibility, rasi palan",
    category: "AstrologyApplication",
    featureListTa: ["ஜாதகம்", "பஞ்சாங்கம்", "தமிழ் காலண்டர்", "பொருத்தம்", "ராசிபலன்"],
    featureListEn: ["Jathagam Creation", "Daily Panchangam", "Tamil Calendar", "Porutham", "Forecasts"]
  },
  jathagam: {
    titleTa: "இலவச தமிழ் ஜாதகம் உருவாக்கி — CodePackr Astro",
    titleEn: "Free Tamil Horoscope (Jathagam) Generator | CodePackr Astro",
    descTa: "பிறந்த தேதி, நேரம் மற்றும் இடம் கொண்டு துல்லியமான லக்னம், ராசி, நவாம்சம், 16 வர்க்க கட்டங்கள், தசா-புத்தி மற்றும் யோகங்களுடன் கூடிய தமிழ் ஜாதகத்தை உடனே உருவாக்குங்கள்.",
    descEn: "Generate free, printable Tamil Vedic birth chart with Lagna, Rasi, Navamsa, 16 harmonic Vargas, Vimshottari Dasa balance, and planetary positions.",
    keywordsTa: "tamil jathagam, birth chart, kundli, navamsa, rasi chart, தமிழ் ஜாதகம், ஜாதகம் கணித்தல்",
    keywordsEn: "tamil jathagam, birth chart calculator, vedic horoscope, navamsa, rasi, lagna calculator",
    category: "AstrologyApplication",
    featureListTa: ["1-Page Summary", "6-Page Report", "30-Page Book", "PDF Export"],
    featureListEn: ["1-Page Summary", "6-Page Report", "30-Page Book", "PDF Export"]
  },
  "tamil-calendar": {
    titleTa: "தமிழ் காலண்டர் & தினசரி பஞ்சாங்கம் — CodePackr Astro",
    titleEn: "Tamil Calendar & Daily Panchangam Engine | CodePackr Astro",
    descTa: "துல்லியமான தமிழ் சூரிய நாட்காட்டி, மாத சங்கிராந்தி, 60 வருட சம்வத்ஸர சுழற்சி மற்றும் கிரிகோரியன் - தமிழ் தேதி மாற்றி.",
    descEn: "Accurate event-based Tamil solar calendar, month solar ingress, 60-year Samvatsara cycle, and bidirectional date converter.",
    keywordsTa: "tamil calendar, samvatsara, tamil months, sankranti, chithirai",
    keywordsEn: "tamil calendar, samvatsara cycle, tamil solar months, solar ingress converter",
    category: "CalendarApplication",
    featureListTa: ["Tamil Calendar", "Samvatsara Cycle", "Date Converter"],
    featureListEn: ["Tamil Calendar", "Samvatsara Cycle", "Date Converter"]
  },
  forecast: {
    titleTa: "பல வருட ஜாதக பலன்கள் & முன்னறிவு (1-60 ஆண்டுகள்) | Codepackr Astro",
    titleEn: "Multi-Year Horoscope Forecast (1-60 Years) | Codepackr Astro",
    descTa: "விம்சோத்தரி தசா, புக்தி மற்றும் கோசார அடிப்படையிலான 16 வாழ்க்கை துறைகளுக்கான பல வருட பலன்கள் மற்றும் சான்றுகள்.",
    descEn: "Multi-year horoscope forecast across 16 life domains based on Vimshottari Dasa, Bhukti, Gochara transits with classical rule evidence.",
    keywordsTa: "horoscope forecast, multi year jathagam, dasa bhukti prediction, tamil astrology forecast",
    keywordsEn: "horoscope forecast, multi-year predictions, vimshottari dasa, tamil astrology predictions",
    category: "AstrologyApplication",
    featureListTa: ["Multi-Year Forecast", "Life Domains", "Evidence Traceability"],
    featureListEn: ["Multi-Year Forecast", "Life Domains", "Evidence Traceability"]
  },
  "calculation-method": {
    titleTa: "வானியல் கணித முறை & வெளிப்படைத்தன்மை | Codepackr Astro",
    titleEn: "Astronomical Calculation Method & Transparency | Codepackr Astro",
    descTa: "சித்திரபக்ஷ லஹிரி அயனாம்சம், நாசா JPL DE440 எஃபிமெரிஸ், முழு ராசி பாவ முறை மற்றும் விம்சோத்தரி தசா கணித விளக்கம்.",
    descEn: "Detailed technical specification of Lahiri Ayanamsa, NASA JPL DE440 ephemeris, Whole Sign houses, and Vimshottari Dasa calculation methods.",
    keywordsTa: "calculation method, lahiri ayanamsa, de440 ephemeris, whole sign houses, thirukanitham",
    keywordsEn: "calculation method, lahiri ayanamsa, de440 ephemeris, whole sign houses, thirukanitham",
    category: "TechnicalDocumentation",
    featureListTa: ["Ayanamsa", "Ephemeris", "Vedic Mathematics"],
    featureListEn: ["Ayanamsa", "Ephemeris", "Vedic Mathematics"]
  },
  "astro-validation": {
    titleTa: "வானியல் துல்லிய சரிபார்ப்பு & நாசா JPL ஒப்பீடு | Codepackr Astro",
    titleEn: "Astro Accuracy & Ephemeris Validation Suite | Codepackr Astro",
    descTa: "நாசா JPL DE440 எஃபிமெரிஸ் ஒப்பீடு, 50+ கோல்டன் ஜாதகங்கள் மற்றும் எல்லை மாறிலிகளின் நேரடி சரிபார்ப்பு.",
    descEn: "Real-time regression and accuracy test suite verifying JPL DE440 benchmarks, boundary invariants, and 50+ golden charts.",
    keywordsTa: "astro validation, jpl de440 benchmark, golden charts, ephemeris accuracy",
    keywordsEn: "astro validation, jpl de440 benchmark, golden charts, ephemeris accuracy",
    category: "DeveloperTools",
    featureListTa: ["Ephemeris Benchmarks", "Boundary Tests", "Golden Charts"],
    featureListEn: ["Ephemeris Benchmarks", "Boundary Tests", "Golden Charts"]
  }
};

const BASE_URL = "https://astro.codepackr.com";

export function getToolCanonicalUrl(page: Page): string {
  if (page === "jathagam") return `${BASE_URL}/`;
  return `${BASE_URL}/${page}`;
}

export function updatePageMeta(page: Page, lang: Lang): void {
  if (typeof document === "undefined") return;
  const data = SEO_DATA[page] || SEO_DATA.jathagam;
  const isTa = lang === "ta";
  const title = isTa ? data.titleTa : data.titleEn;
  const desc = isTa ? data.descTa : data.descEn;
  const keywords = isTa ? data.keywordsTa : data.keywordsEn;
  const canonicalUrl = getToolCanonicalUrl(page);
  document.title = title;
  setMetaTag("name", "description", desc);
  setMetaTag("name", "keywords", keywords);
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", desc);
  setMetaTag("property", "og:url", canonicalUrl);
  setMetaTag("property", "og:type", "website");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", desc);
  updateJsonLd(page, lang, title, desc, canonicalUrl, data);
}

function setMetaTag(attrName: string, attrVal: string, content: string): void {
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function updateJsonLd(
  page: Page,
  lang: Lang,
  title: string,
  desc: string,
  canonicalUrl: string,
  data: ToolSeoConfig
): void {
  const scriptId = "codepackr-tool-jsonld";
  let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.id = scriptId;
    scriptTag.type = "application/ld+json";
    document.head.appendChild(scriptTag);
  }
  const features = lang === "ta" ? data.featureListTa : data.featureListEn;
  scriptTag.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: canonicalUrl,
    description: desc,
    featureList: features
  });
}

export function usePageSeo(page: Page, lang: Lang) {
  useEffect(() => {
    updatePageMeta(page, lang);
  }, [page, lang]);
}
