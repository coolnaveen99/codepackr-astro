export type SupportedLocale = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface RegionalPreset {
  locale: SupportedLocale;
  nativeName: string;
  englishName: string;
  defaultChartStyle: 'SOUTH' | 'NORTH';
  defaultMatchSystem: 'DASAKOOTA_10' | 'ASHTAKOOTA_36';
  defaultCalendarMode: 'SOLAR_TAMIL' | 'SOLAR_MALAYALAM' | 'AMANTA_LUNAR' | 'PURNIMANTA_LUNAR';
}

export const REGIONAL_PRESETS: Record<SupportedLocale, RegionalPreset> = {
  en: {
    locale: 'en',
    nativeName: 'English',
    englishName: 'English',
    defaultChartStyle: 'SOUTH',
    defaultMatchSystem: 'DASAKOOTA_10',
    defaultCalendarMode: 'SOLAR_TAMIL',
  },
  ta: {
    locale: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    defaultChartStyle: 'SOUTH',
    defaultMatchSystem: 'DASAKOOTA_10',
    defaultCalendarMode: 'SOLAR_TAMIL',
  },
  hi: {
    locale: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi (North)',
    defaultChartStyle: 'NORTH',
    defaultMatchSystem: 'ASHTAKOOTA_36',
    defaultCalendarMode: 'PURNIMANTA_LUNAR',
  },
  te: {
    locale: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    defaultChartStyle: 'SOUTH',
    defaultMatchSystem: 'ASHTAKOOTA_36',
    defaultCalendarMode: 'AMANTA_LUNAR',
  },
  kn: {
    locale: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    defaultChartStyle: 'SOUTH',
    defaultMatchSystem: 'ASHTAKOOTA_36',
    defaultCalendarMode: 'AMANTA_LUNAR',
  },
  ml: {
    locale: 'ml',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    defaultChartStyle: 'SOUTH',
    defaultMatchSystem: 'DASAKOOTA_10',
    defaultCalendarMode: 'SOLAR_MALAYALAM',
  },
};

export interface AstroLocaleStrings {
  appTitle: string;
  horoscope: string;
  matchmaking: string;
  panchangam: string;
  lagna: string;
  rasiChart: string;
  navamsaChart: string;
  kpSubLords: string;
  ashtakootaGuna: string;
  dasakootaPorutham: string;
  planets: {
    Sun: string;
    Moon: string;
    Mars: string;
    Mercury: string;
    Jupiter: string;
    Venus: string;
    Saturn: string;
    Rahu: string;
    Ketu: string;
  };
  rasis: string[];
}

export const ASTRO_LOCALES: Record<SupportedLocale, AstroLocaleStrings> = {
  en: {
    appTitle: 'Codepackr Vedic Astrology',
    horoscope: 'Birth Horoscope (Jathagam)',
    matchmaking: 'Marriage Compatibility',
    panchangam: 'Daily Panchangam',
    lagna: 'Ascendant (Lagna)',
    rasiChart: 'Rasi Chart (D1)',
    navamsaChart: 'Navamsa Chart (D9)',
    kpSubLords: 'KP Cuspal & Planet Sub-Lords',
    ashtakootaGuna: 'Ashtakoota (36 Guna Milan)',
    dasakootaPorutham: 'Dasakoota (10 Porutham)',
    planets: {
      Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
      Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
    },
    rasis: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ],
  },
  ta: {
    appTitle: 'கோட்பேக்கர் தமிழ் ஜோதிடம்',
    horoscope: 'பிறப்பு ஜாதகம்',
    matchmaking: 'திருமணப் பொருத்தம்',
    panchangam: 'தினசரி பஞ்சாங்கம்',
    lagna: 'லக்னம்',
    rasiChart: 'ராசி சக்கரம் (D1)',
    navamsaChart: 'நவாம்சம் சக்கரம் (D9)',
    kpSubLords: 'கே.பி. உபநட்சத்திர அதிபதிகள்',
    ashtakootaGuna: 'அஷ்டகூட பொருத்தம் (36 குணங்கள்)',
    dasakootaPorutham: 'தசவித பொருத்தம் (10 பொருத்தம்)',
    planets: {
      Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
      Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
    },
    rasis: [
      'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
      'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்',
    ],
  },
  hi: {
    appTitle: 'कोडपैकर वैदिक ज्योतिष',
    horoscope: 'जन्म कुंडली',
    matchmaking: 'कुंडली मिलान (अष्टकूट)',
    panchangam: 'दैनिक पंचांग',
    lagna: 'लग्न',
    rasiChart: 'लग्न / राशि कुंडली (D1)',
    navamsaChart: 'नवांश कुंडली (D9)',
    kpSubLords: 'केपी सब-लॉर्ड (उप-नक्षत्र स्वामी)',
    ashtakootaGuna: 'अष्टकूट गुण मिलान (36 गुण)',
    dasakootaPorutham: 'दशकूट मिलान (दक्षिण भारतीय)',
    planets: {
      Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
      Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
    },
    rasis: [
      'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
      'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
    ],
  },
  te: {
    appTitle: 'కోడ్‌ప్యాకర్ వేద జ్యోతిష్యం',
    horoscope: 'జన్మ జాతకం',
    matchmaking: 'వివాహ పొంతన',
    panchangam: 'దినసరి పంచాంగం',
    lagna: 'లగ్నం',
    rasiChart: 'రాశి చక్రం (D1)',
    navamsaChart: 'నవాంశ చక్రం (D9)',
    kpSubLords: 'కె.పి. సబ్-లార్డ్ పట్టిక',
    ashtakootaGuna: 'అష్టకూట గుణ మిళనం (36 గుణాలు)',
    dasakootaPorutham: 'దశకూట పొంతన',
    planets: {
      Sun: 'సూర్యుడు', Moon: 'చంద్రుడు', Mars: 'కుజుడు', Mercury: 'బుధుడు',
      Jupiter: 'గురుడు', Venus: 'శుక్రుడు', Saturn: 'శని', Rahu: 'రాహువు', Ketu: 'కేతువు',
    },
    rasis: [
      'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
      'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
    ],
  },
  kn: {
    appTitle: 'ಕೋಡ್‌ಪ್ಯಾಕರ್ ವೇದ ಜ್ಯೋತಿಷ್ಯ',
    horoscope: 'ಜನ್ಮ ಜಾತಕ',
    matchmaking: 'ವಧು-ವರರ ಸಾಲಾವಳಿ',
    panchangam: 'ದೈನಂದಿನ ಪಂಚಾಂಗ',
    lagna: 'ಲಗ್ನ',
    rasiChart: 'ರಾಶಿ ಕುಂಡಲಿ (D1)',
    navamsaChart: 'ನವಾಂಶ ಕುಂಡಲಿ (D9)',
    kpSubLords: 'ಕೆ.ಪಿ. ಉಪ-ನಕ್ಷತ್ರಾಧಿಪತಿ',
    ashtakootaGuna: 'ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲನ (36 ಗುಣ)',
    dasakootaPorutham: 'ದಶಕೂಟ ಹೊಂದಾಣಿಕೆ',
    planets: {
      Sun: 'ಸೂರ್ಯ', Moon: 'ಚಂದ್ರ', Mars: 'ಕುಜ', Mercury: 'ಬುಧ',
      Jupiter: 'ಗುರು', Venus: 'ಶುಕ್ರ', Saturn: 'ಶನಿ', Rahu: 'ರಾಹು', Ketu: 'ಕೇತು',
    },
    rasis: [
      'ಮೇಷ', 'ವೃಷಭ', 'ಮಿಥುನ', 'ಕರ್ಕಾಟಕ', 'ಸಿಂಹ', 'ಕನ್ಯಾ',
      'ತುಲಾ', 'ವೃಶ್ಚಿಕ', 'ಧನು', 'ಮಕರ', 'ಕುಂಭ', 'ಮೀನ',
    ],
  },
  ml: {
    appTitle: 'കോഡ்பാക്കാർ വേദ ജ്യോതിഷം',
    horoscope: 'ജന്മ ജാതകം',
    matchmaking: 'വിവാഹ പൊരുത്തം',
    panchangam: 'ദൈനിക പഞ്ചാംഗം',
    lagna: 'ലഗ്നം',
    rasiChart: 'രാശി ചക്രം (D1)',
    navamsaChart: 'നവാംശകം (D9)',
    kpSubLords: 'കെ.പി. സബ്-ലോർഡ് പട്ടിക',
    ashtakootaGuna: 'അഷ്ടകൂട ഗുണ മിലൻ (36)',
    dasakootaPorutham: 'ദശകൂട പൊരുത്തം (10 പൊരുത്തം)',
    planets: {
      Sun: 'സൂര്യൻ', Moon: 'ചന്ദ്രൻ', Mars: 'ചൊവ്വ', Mercury: 'ബുധൻ',
      Jupiter: 'വ്യാഴം', Venus: 'ശുക്രൻ', Saturn: 'ശനി', Rahu: 'രാഹു', Ketu: 'കേതു',
    },
    rasis: [
      'മേടം', 'ഇടവം', 'മിഥുനം', 'കർക്കടകം', 'ചിങ്ങം', 'കന്നി',
      'തുലാം', 'വൃശ്ചികം', 'ധനു', 'മകരം', 'കുംഭം', 'മീനം',
    ],
  },
};
