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
  },
  chandrashtama: {
    titleTa: "சந்திராஷ்டம காலக் கணிப்பான் & அடுத்தடுத்த தேதிகள் அட்டவணை | Codepackr Astro",
    titleEn: "Chandrashtama Calculator & 60-Day Transit Schedule | Codepackr Astro",
    descTa: "உங்கள் பிறந்த ராசிக்கு சந்திரன் 8-ஆம் இடத்தில் சஞ்சரிக்கும் துல்லியமான சந்திராஷ்டம தொடக்க மற்றும் முடிவு நேரங்கள், முன்னெச்சரிக்கைகள், விநாயகர் வழிபாட்டுப் பரிகாரங்கள்.",
    descEn: "Calculate accurate start and end transit timestamps when Moon enters your 8th house from natal Janma Rasi. 60-day schedule, guidelines, and pariharams.",
    keywordsTa: "சந்திராஷ்டமம், சந்திராஷ்டம தேதிகள், சந்திராஷ்டம கணிப்பான், சந்திராஷ்டம பரிகாரம், chandrashtamam dates, chandrashtama calculator Tamil",
    keywordsEn: "chandrashtama calculator, chandrashtamam dates today, 8th moon transit, chandrashtama pariharam, lunar transit astrology",
    category: "AstrologyApplication",
    featureListTa: [
      "சந்திராஷ்டமம் தொடங்கும் மற்றும் முடியும் துல்லிய நேரம்",
      "அடுத்த 60 நாட்களுக்கான சந்திராஷ்டம அட்டவணை",
      "செய்ய வேண்டியவை & தவிர்க்க வேண்டிய முன்னெச்சரிக்கைகள்",
      "சந்திர காயத்ரி மற்றும் எளிய பரிகார வழிபாடுகள்"
    ],
    featureListEn: [
      "Exact start and end timestamps of 8th Moon transit",
      "Next 60 days upcoming Chandrashtama schedule",
      "Traditional mindfulness guidelines and precautions",
      "Vedic mantras and divine worship remedies"
    ]
  },
  gochara: {
    titleTa: "கோசார பலன் கணிப்பான் | ஏழரைச் சனி, குரு பலம் & 9 கிரக சஞ்சாரம் | Codepackr Astro",
    titleEn: "Gochara Transit Calculator | Sade Sati, Guru Balam & Transits | Codepackr Astro",
    descTa: "இன்றைய வானியல் கிரக நிலைகளை உங்கள் பிறந்த ராசியுடன் ஒப்பிட்டு ஏழரைச் சனி, அஷ்டமச் சனி, குரு பலம், ராகு-கேது மற்றும் 9 கிரகங்களின் கோசார பலன்களை உடனே கணிக்கவும்.",
    descEn: "Analyze live planetary transits against your Janma Rasi: Sade Sati, Ashtama Sani, Jupiter Guru Balam, Rahu-Ketu axis, and 9-planet house placements.",
    keywordsTa: "கோசார பலன், ஏழரைச் சனி, குரு பலம், ராகு கேது பெயர்ச்சி, சனி பெயர்ச்சி, குரு பெயர்ச்சி, gochara calculator Tamil",
    keywordsEn: "Gochara calculator, planetary transits Vedic, Sade Sati calculator, Guru Balam check, transit astrology Tamil",
    category: "AstrologyApplication",
    featureListTa: [
      "9 கிரகங்களின் நேரடி வானியல் பாகை நிலைகள்",
      "ஏழரைச் சனி மற்றும் அஷ்டமச் சனி நிலை ஆய்வு",
      "குரு பலம் மற்றும் குரு பார்வை சரிபார்ப்பு",
      "பலதீபிகை பாரம்பரிய விதிகள் அடிப்படையிலான பலன்கள்"
    ],
    featureListEn: [
      "Live astronomical DMS longitudes for all 9 planets",
      "Sade Sati and Ashtama Sani transit assessment",
      "Guru Balam & Jupiter aspect analysis",
      "Phaladeepika classical transit rules and effects"
    ]
  },
  nakshatra: {
    titleTa: "27 நட்சத்திரங்கள் & 108 பாதங்கள் விரிவான கணிப்பான் | Codepackr Astro",
    titleEn: "27 Nakshatras & 108 Padas Complete Astrological Tool | Codepackr Astro",
    descTa: "27 நட்சத்திரங்கள் மற்றும் 108 பாதங்களுக்கான அதிதேவதை, கணம், யோனி, நாடி, விருட்சம், பறவை, பூதம், சுப திசைகள் மற்றும் நான்கு பாதங்களுக்கான பெயரிடும் எழுத்துக்கள்.",
    descEn: "Comprehensive guide to all 27 Nakshatras and 108 Padas: Deities, Gana, Yoni animal, Nadi, Sacred Tree, Bird, Element, and all 4 Pada naming letters.",
    keywordsTa: "27 நட்சத்திரங்கள், 108 பாதங்கள், நட்சத்திர அதிபதி, விருட்சம், யோனி, கணம், நாடி, பெயரிடும் எழுத்துக்கள், nakshatra calculator Tamil",
    keywordsEn: "27 nakshatras, 108 padas, nakshatra pada syllables, nakshatra yoni gana nadi, birth star tree animal, Vedic nakshatra tool",
    category: "EducationalApplication",
    featureListTa: [
      "27 நட்சத்திரங்கள் மற்றும் 108 பாதங்களுக்கான பண்புகள்",
      "அதிதேவதை, விருட்சம் (மரம்), பறவை மற்றும் பூதம்",
      "4 பாதங்களுக்குரிய பாரம்பரிய பெயரிடும் எழுத்துக்கள்",
      "பிறந்த தேதியிலிருந்து நட்சத்திரம் அறியும் வசதி"
    ],
    featureListEn: [
      "Complete attributes for 27 stars and 108 padas",
      "Sacred deity, tree, bird, and elemental ruler",
      "Authentic naming syllables for all 4 padas",
      "Automatic calculation from birth date and time"
    ]
  },
  babynames: {
    titleTa: "நட்சத்திர பாதம் வாரியாக குழந்தைப் பெயர் தேர்வு | தூய தமிழ்ப் பெயர்கள் | Codepackr Astro",
    titleEn: "Tamil Baby Names by Nakshatra & Pada | Auspicious Name Finder | Codepackr Astro",
    descTa: "27 நட்சத்திரங்கள் மற்றும் 108 பாதங்களுக்குரிய அதிர்ஷ்ட தொடக்க எழுத்துக்களில் அமைந்த ஆயிரக்கணக்கான தூய தமிழ், பாரம்பரிய மற்றும் நவீன ஆண்/பெண் குழந்தைப் பெயர்கள்.",
    descEn: "Find thousands of meaningful Tamil baby names for boys and girls filtered by birth Nakshatra and Pada starting syllables. Pure Tamil, traditional, and modern names.",
    keywordsTa: "குழந்தைப் பெயர்கள், நட்சத்திர பெயர் எழுத்துக்கள், தூய தமிழ் குழந்தை பெயர்கள், ஆண் குழந்தை பெயர்கள், பெண் குழந்தை பெயர்கள், baby names by nakshatra Tamil",
    keywordsEn: "Tamil baby names by nakshatra pada, auspicious baby names, pure Tamil names, boy baby names Tamil, girl baby names Tamil",
    category: "SearchApplication",
    featureListTa: [
      "நட்சத்திர பாதம் மற்றும் தொடக்க எழுத்து தேர்வு",
      "ஆண், பெண், இருபாலர் மற்றும் தூய தமிழ் வடிகட்டல்",
      "நேரடி தமிழ் மற்றும் ஆங்கில பொருள் விளக்கம்",
      "எளிய பெயர் நகலெடுக்கும் வசதி"
    ],
    featureListEn: [
      "Filter by birth nakshatra, pada, and starting syllable",
      "Boy, Girl, Unisex, Pure Tamil, and Modern filters",
      "Verified meanings in Tamil and English",
      "One-click copy and sharing"
    ]
  },
  nazhigai: {
    titleTa: "நாழிகை - மணி நேர மாற்றி | சூரியோதயம் முதல் நாழிகைக் கணிப்பான் | Codepackr Astro",
    titleEn: "Nazhigai to Clock Time Converter | Sunrise Relative Horology | Codepackr Astro",
    descTa: "சூரிய உதயம் அடிப்படையிலான பாரம்பரிய நாழிகை மற்றும் விநாடிக் கணக்கீடு. 1 நாள் = 60 நாழிகை, 1 நாழிகை = 24 நிமிடங்கள், தற்பரை மற்றும் கடிகார நேர மாற்றி.",
    descEn: "Convert between ancient Tamil Nazhigai/Vinadi and modern hours/minutes, computed from exact local astronomical sunrise.",
    keywordsTa: "நாழிகை மாற்றி, நாழிகை கணக்கு, கடிகார நேரம் நாழிகை, சூரிய உதயம் முதல் நாழிகை, nazhigai to time converter Tamil, nazhigai calculator",
    keywordsEn: "Nazhigai converter, Tamil nazhigai to hours, vinadi to minutes, sunrise relative time, Vedic horology converter",
    category: "UtilityApplication",
    featureListTa: [
      "சூரியோதயம் அடிப்படையிலான துல்லிய நாழிகைக் கணிப்பு",
      "நாழிகை, விநாடி, தற்பரை முழுமையான மாற்றி",
      "பகல் பிறப்பு / இரவு பிறப்பு மற்றும் சாமம் சுட்டிக்காட்டி",
      "பண்டைய தமிழ் கால அளவீடு குறிப்பு அட்டவணை"
    ],
    featureListEn: [
      "Astronomical sunrise-relative Nazhigai calculation",
      "Two-way conversion: Modern time ↔ Nazhigai & Vinadi",
      "Day/Night birth classification & Yaamam tracker",
      "Classical Tamil horological scale reference"
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
