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

export const SEO_DATA: Record<Page, ToolSeoConfig> = {
  jathagam: {
    titleTa: "இலவச தமிழ் ஜாதகம் & 30 பக்க முழு ஜாதக புத்தகம் கணிப்பான் | Codepackr Astro",
    titleEn: "Free Tamil Jathagam & 30-Page Vedic Horoscope Report | Codepackr Astro",
    descTa: "வாக்கியம் மற்றும் திருக்கணித முறையில் துல்லியமான இலவச தமிழ் ஜாதகம், 30 பக்க அச்சுப் பிரதி புத்தகம், 12 பாவ பலன்கள், ஷட்பலம் மற்றும் விம்சொத்தரி தசா புக்தி கணிப்பு.",
    descEn: "Generate authentic 30-page printable Tamil Vedic Horoscope (Thirukanitham & Vakya), 12 Bhava phalan, Shadbala, and 120-year Vimshottari Dasa-Bhukti online for free.",
    keywordsTa: "தமிழ் ஜாதகம், 30 பக்க ஜாதகம், இலவச ஜாதகம், திருக்கணிதம், வாக்கிய பஞ்சாங்கம், ராசி நவாம்சம், தசா புக்தி, ஷட்பலம், அஷ்டகவர்க்கம், வேத ஜோதிடம்",
    keywordsEn: "Tamil jathagam, 30 page horoscope, free horoscope Tamil, Thirukanitham jathagam, Vakya jathagam, Vedic birth chart, Shadbala calculation, Vimshottari dasa",
    category: "AstrologyApplication",
    featureListTa: [
      "30 பக்க முழு வேத ஜாதக புத்தகம் (A4 PDF)",
      "வாக்கியம் மற்றும் திருக்கணித அயனாம்சம்",
      "12 பாவ பலன்கள் மற்றும் விம்சொத்தரி தசா அட்டவணை",
      "ஷட்பலம், பாவ பலம் மற்றும் அஷ்டகவர்க்க பரல்கள்"
    ],
    featureListEn: [
      "Full 30-Page Vedic Horoscope Booklet (A4 PDF)",
      "Vakya and Thirukanitham Ayanamsa computation",
      "12 Bhava Phalan & 120-Year Vimshottari Dasa",
      "Shadbala planetary strength & Sarvashtakavarga"
    ]
  },
  porutham: {
    titleTa: "10 திருமணப் பொருத்தம் பார்க்க | தசவித பொருத்தம் கணிப்பான் | Codepackr Astro",
    titleEn: "10 Porutham Marriage Compatibility Matching Online | Codepackr Astro",
    descTa: "ஆண்-பெண் நட்சத்திரம், ராசி அடிப்படையில் தினப் பொருத்தம், கணப் பொருத்தம், மாங்கல்யம், யோனி, ராசி, ராசி அதிபதி, வசியம், ரஜ்ஜு, வேதை, நாடி என 10 திருமணப் பொருத்தங்கள் துல்லியமாக பார்க்க.",
    descEn: "Check 10 Porutham marriage matching (Dasakoota) online for bride and groom based on Nakshatra and Rasi with Rajju, Vedha, Nadi, and Maangalya compatibility.",
    keywordsTa: "திருமணப் பொருத்தம், 10 பொருத்தம், தசவித பொருத்தம், ரஜ்ஜு பொருத்தம், வேதை, தினப் பொருத்தம், ஜாதகப் பொருத்தம், பெண் ஆண் நட்சத்திர பொருத்தம்",
    keywordsEn: "10 porutham, marriage matching Tamil, dasakoota porutham, rajju porutham, vedha porutham, jathaga porutham, horoscope matching for marriage",
    category: "MatchmakingApplication",
    featureListTa: [
      "10 தசவித திருமணப் பொருத்தங்கள் முழு ஆய்வு",
      "ரஜ்ஜு, வேதை, நாடி தோஷ எச்சரிக்கைகள்",
      "உடனடி திருமண பொருத்தம் முடிவு மற்றும் வழிகாட்டல்",
      "A4 அச்சுப் பிரதி மற்றும் பகிர்வு வசதி"
    ],
    featureListEn: [
      "Complete 10-Porutham Dasakoota matching",
      "Rajju, Vedha, and Nadi dosha verifications",
      "Instant overall verdict and astrological guidance",
      "Printable summary sheet and scorecards"
    ]
  },
  biodata: {
    titleTa: "திருமண ஜாதக பயோடேட்டா தயாரிப்பாளர் (1-பக்க A4 PDF) | Codepackr Astro",
    titleEn: "Marriage Jathaga Biodata Maker (1-Page A4 PDF) | Codepackr Astro",
    descTa: "ராசி மற்றும் நவாம்ச கட்டங்களுடன் கூடிய அழகான, தரமான தமிழ் திருமண பயோடேட்டா மற்றும் வரன் விவரக்குறிப்பு படிவம் தயாரித்து இலவசமாக PDF பதிவிறக்கம் செய்யுங்கள்.",
    descEn: "Create beautiful 1-page A4 marriage biodata with Rasi & Navamsa astrological charts, family background, and education details. Free high-resolution PDF download.",
    keywordsTa: "ஜாதக பயோடேட்டா, திருமண பயோடேட்டா, வரன் விவரம், matrimony biodata Tamil, horoscope biodata maker, marriage biodata PDF",
    keywordsEn: "marriage biodata maker, horoscope biodata, matrimony biodata PDF, Tamil marriage profile, biodata with rasi navamsa chart",
    category: "DocumentCreationApplication",
    featureListTa: [
      "சரியான 1-பக்க A4 திருமண பயோடேட்டா PDF",
      "ராசி மற்றும் நவாம்ச கட்டங்கள் ஒருங்கிணைப்பு",
      "குடும்ப விவரங்கள் மற்றும் கல்வித் தகுதி கட்டமைப்பு",
      "100% பாதுகாப்பானது - தனிநபர் தரவுகள் வெளியேறாது"
    ],
    featureListEn: [
      "Strict single-page A4 printable PDF format",
      "Embedded Rasi and Navamsa astrological grids",
      "Structured family, education, and career fields",
      "100% Client-side privacy - no data saved on server"
    ]
  },
  panchangam: {
    titleTa: "இன்றைய தமிழ் பஞ்சாங்கம், நல்ல நேரம் & ராகு காலம் | Codepackr Astro",
    titleEn: "Today Tamil Panchangam, Gowri Nalla Neram & Rahu Kalam | Codepackr Astro",
    descTa: "இன்றைய திதி, வாரம், நட்சத்திரம், யோகம், கரணம், கௌரி நல்ல நேரம், ராகு காலம், எமகண்டம், குளிகை, சந்திராஷ்டமம் மற்றும் கிரக நிலைகள் துல்லிய பஞ்சாங்கம்.",
    descEn: "Accurate daily Tamil Panchangam: Tithi, Nakshatra, Yoga, Karana, Gowri Nalla Neram, Rahu Kalam, Yamagandam, Kuligai, Chandrashtamam, and planetary positions.",
    keywordsTa: "தமிழ் பஞ்சாங்கம், இன்றைய பஞ்சாங்கம், நல்ல நேரம், ராகு காலம், எமகண்டம், கௌரி நல்ல நேரம், சந்திராஷ்டமம், சுப முகூர்த்தம்",
    keywordsEn: "Tamil panchangam, daily panchangam, nalla neram today, rahu kalam, gowri nalla neram, chandrashtamam, subha muhurtham dates",
    category: "CalendarApplication",
    featureListTa: [
      "இன்றைய பஞ்சாங்கத்தின் 5 அங்கங்கள் (திதி, வாரம், நட்சத்திரம், யோகம், கரணம்)",
      "பகல் மற்றும் இரவு கௌரி நல்ல நேரம்",
      "ராகு காலம், எமகண்டம், குளிகை துல்லிய காலக் கணிப்பு",
      "சந்திராஷ்டம நட்சத்திரங்கள் மற்றும் கிரக சஞ்சாரம்"
    ],
    featureListEn: [
      "5 limbs of Vedic Panchangam (Tithi, Vara, Nakshatra, Yoga, Karana)",
      "Day and Night Gowri Nalla Neram intervals",
      "Accurate Rahu Kalam, Yamagandam, and Kuligai timers",
      "Chandrashtama alert and real-time planetary transits"
    ]
  },
  rasipalan: {
    titleTa: "இன்றைய ராசிபலன் (12 ராசிகளுக்கும்) | Daily Rasi Palan | Codepackr Astro",
    titleEn: "Today Daily Rasi Palan (All 12 Zodiac Signs) | Codepackr Astro",
    descTa: "மேஷம் முதல் மீனம் வரை 12 ராசிகளுக்கான இன்றைய பலன்கள், அதிர்ஷ்ட எண், நிறம், திசை மற்றும் கவனிக்க வேண்டிய பரிகாரங்கள்.",
    descEn: "Daily astrological predictions and horoscope for all 12 Rasis: Mesham to Meenam, lucky numbers, lucky colors, favorable directions, and remedies.",
    keywordsTa: "இன்றைய ராசிபலன், தினசரி ராசிபலன், மேஷம் முதல் மீனம் வரை, அதிர்ஷ்ட எண், இன்றைய ஜோதிட பலன்கள்",
    keywordsEn: "daily rasi palan, today horoscope Tamil, rasi palan today, zodiac predictions Tamil, lucky color and number today",
    category: "HoroscopeApplication",
    featureListTa: [
      "12 ராசிகளுக்குமான விரிவான தினசரி பலன்கள்",
      "அதிர்ஷ்ட எண், நிறம் மற்றும் திசை",
      "சந்திர சஞ்சார அடிப்படையிலான ஆருட பலன்கள்"
    ],
    featureListEn: [
      "Detailed daily readings for all 12 Moon signs",
      "Lucky number, color, and favorable direction",
      "Lunar transit-based practical life insights"
    ]
  },
  numerology: {
    titleTa: "எண் கணிதம் & பெயர் எண் பலன்கள் | Numerology Calculator | Codepackr Astro",
    titleEn: "Tamil Numerology Calculator & Name Number Analysis | Codepackr Astro",
    descTa: "சாலடியன் மற்றும் பித்தகோரியன் முறையில் பிறந்த தேதி மற்றும் பெயர் அடிப்படையில் விதி எண், உடல் எண், அதிர்ஷ்ட எண்கள், நிறங்கள் மற்றும் வாழ்க்கை வழிகாட்டல்.",
    descEn: "Chaldean & Pythagorean numerology calculator: calculate destiny number, psychic number, lucky gemstones, favorable dates, and name resonance.",
    keywordsTa: "எண் கணிதம், நியூமராலஜி, பெயர் எண் கணிதம், சாலடியன் எண் கணிதம், விதி எண், உடல் எண், அதிர்ஷ்ட எண்கள்",
    keywordsEn: "Tamil numerology calculator, Chaldean numerology, name numerology Tamil, psychic number, destiny number, lucky numbers",
    category: "NumerologyApplication",
    featureListTa: [
      "சாலடியன் & பித்தகோரியன் இரு முறை ஒப்பீடு",
      "விதி எண் (Destiny) & உடல் எண் (Psychic/Root) கணிப்பு",
      "அதிர்ஷ்டக் கற்கள், வண்ணங்கள் மற்றும் உகந்த தேதிகள்"
    ],
    featureListEn: [
      "Chaldean and Pythagorean numerology comparison",
      "Destiny number, Psychic/Root number calculation",
      "Lucky gems, favorable colors, and compatible dates"
    ]
  },
  prasna: {
    titleTa: "சோழி பிரசன்னம் & ஆருட பலன்கள் | Chozhi Prasnam Online | Codepackr Astro",
    titleEn: "Chozhi Prasnam & Arudha Query Horoscope | Codepackr Astro",
    descTa: "பாரம்பரிய சோழி பிரசன்ன முறை மூலம் தொழில், திருமணம், ஆரோக்கியம், பணவரவு பற்றிய உடனடி ஆருட விடை மற்றும் வழிகாட்டல்.",
    descEn: "Traditional Kerala & Tamil Chozhi Prasnam casting for immediate astrological insight into questions regarding career, marriage, health, and travel.",
    keywordsTa: "சோழி பிரசன்னம், ஆருடம், உடனடி ஜோதிட விடை, கவடி பிரசன்னம், சோழி ஆருடம்",
    keywordsEn: "chozhi prasnam, arudha prasnam, cowrie shell divination Tamil, instant astrology question, prasna shastra",
    category: "DivinationApplication",
    featureListTa: [
      "108 சோழி ஆருட கணித முறை",
      "உடனடி கேள்வி பதில்கள் மற்றும் பலன் விளக்கம்",
      "பரிகாரங்கள் மற்றும் தெய்வ வழிபாட்டு முறைகள்"
    ],
    featureListEn: [
      "108 Cowrie shell arudha casting calculation",
      "Instant query resolution with astrological interpretation",
      "Remedies and deity prayer suggestions"
    ]
  },
  glossary: {
    titleTa: "ஜோதிட கலைச்சொற்கள் அகராதி | Vedic Astrology Glossary | Codepackr Astro",
    titleEn: "Vedic Astrology Dictionary & Glossary | Codepackr Astro",
    descTa: "ராசி, நவாம்சம், பாவகம், கிரக காரகங்கள், தசா-புக்தி, அஷ்டகவர்க்கம், ஷட்பலம் உள்ளிட்ட அனைத்து வேத ஜோதிட கலைச்சொற்களுக்கான எளிய தமிழ் விளக்கம்.",
    descEn: "Comprehensive dictionary of Vedic astrological terminology: Bhavas, Vargas, Ashtakavarga, Shadbala, Dasa-Bhukti, Yogas, and Sanskrit technical terms.",
    keywordsTa: "ஜோதிட கலைச்சொற்கள், ஜோதிட அகராதி, வேத ஜோதிட விளக்கம், பாவகம், கிரக காரகம்",
    keywordsEn: "astrology glossary Tamil, vedic astrology terms, astrology dictionary, bhava karakas, vargas explained",
    category: "EducationalApplication",
    featureListTa: [
      "அனைத்து வேத ஜோதிட கலைச்சொற்களுக்கான தேடுதல் வசதி",
      "தமிழ் மற்றும் ஆங்கில விளக்கக் குறிப்புகள்",
      "தொடக்க நிலை மற்றும் உயர்நிலை ஜோதிடக் குறிப்புகள்"
    ],
    featureListEn: [
      "Searchable Vedic astrological vocabulary database",
      "Dual Tamil and English definitions",
      "Foundational to advanced technical terminology"
    ]
  },
  contact: {
    titleTa: "தொடர்புக்கு & ஜோதிட ஆலோசனை | Contact Codepackr Astro",
    titleEn: "Contact Us & Astrological Support | Codepackr Astro",
    descTa: "Codepackr Astro ஜோதிட தளம் குறித்த ஆலோசனைகள், பிழை அறிக்கைகள் அல்லது கேள்விகளுக்கு எங்களை உடனடியாக தொடர்பு கொள்ளுங்கள்.",
    descEn: "Get in touch with Codepackr Astro for inquiries, feedback, astrological feature requests, or technical support.",
    keywordsTa: "தொடர்புக்கு, Codepackr Astro, ஜோதிட உதவி, ஜோதிட தளம்",
    keywordsEn: "contact Codepackr Astro, astrology support, feedback, astrological software support",
    category: "ContactApplication",
    featureListTa: [
      "நேரடி மின்னஞ்சல் தொடர்பு",
      "கருத்துகள் மற்றும் புதிய அம்ச கோரிக்கைகள்",
      "தொழில்நுட்ப உதவி"
    ],
    featureListEn: [
      "Direct email communication",
      "Feedback and new feature requests",
      "Prompt technical assistance"
    ]
  },
  disclaimer: {
    titleTa: "பொறுப்புத் துறப்பு & பயன்பாட்டு விதிமுறைகள் | Codepackr Astro",
    titleEn: "Astrology Disclaimer & Terms of Use | Codepackr Astro",
    descTa: "Codepackr Astro இணையதளத்தின் பொறுப்புத் துறப்பு, தனியுரிமை மற்றும் கணிப்பொறி கணித முடிவுகள் பயன்பாட்டு விதிமுறைகள்.",
    descEn: "Legal disclaimer, algorithmic calculation methodology, and privacy terms for Codepackr Astro.",
    keywordsTa: "பொறுப்புத் துறப்பு, விதிமுறைகள், தனியுரிமை, disclaimer Codepackr Astro",
    keywordsEn: "astrology disclaimer, terms of service, privacy policy, Codepackr Astro legal notice",
    category: "LegalApplication",
    featureListTa: [
      "கணிப்பொறி கணித தெளிவுரை",
      "தனியுரிமை மற்றும் பாதுகாப்பு உறுதிமொழி",
      "வழிகாட்டல் பயன்பாட்டு நெறிமுறைகள்"
    ],
    featureListEn: [
      "Computational algorithm transparency",
      "Strict client-side privacy commitments",
      "Decision-making guidance notices"
    ]
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

  // 1. Title
  document.title = title;

  // 2. Standard Meta Tags
  setMetaTag("name", "description", desc);
  setMetaTag("name", "keywords", keywords);

  // 3. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;

  // 4. OpenGraph Tags
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", desc);
  setMetaTag("property", "og:url", canonicalUrl);
  setMetaTag("property", "og:type", "website");

  // 5. Twitter Card Tags
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", desc);

  // 6. Schema.org JSON-LD Structured Data
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

  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#app`,
        name: title,
        url: canonicalUrl,
        applicationCategory: data.category,
        operatingSystem: "Any",
        description: desc,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR"
        },
        inLanguage: ["ta", "en"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        featureList: features
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "ta" ? "முகப்பு (ஜாதகம்)" : "Home (Jathagam)",
            item: `${BASE_URL}/`
          },
          ...(page !== "jathagam"
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: title,
                  item: canonicalUrl
                }
              ]
            : [])
        ]
      }
    ]
  };

  scriptTag.textContent = JSON.stringify(schemaObj, null, 2);
}

/**
 * React Hook to automatically synchronize SEO metadata when page or language changes
 */
export function usePageSeo(page: Page, lang: Lang) {
  useEffect(() => {
    updatePageMeta(page, lang);
  }, [page, lang]);
}
