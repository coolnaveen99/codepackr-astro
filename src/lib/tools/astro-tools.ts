// Codepackr Astro — Authoritative Astro Tools Registry (Single Source of Truth)

export type ToolCategory =
  | "all"
  | "jathagam"
  | "panchangam"
  | "palangal"
  | "marriage"
  | "tools"
  | "info";

export type ToolStatus = "available" | "beta" | "coming-soon";

export interface AstroTool {
  id: string;
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  category: ToolCategory;
  path: string;
  icon: string;
  status: ToolStatus;
  featured?: boolean;
  popular?: boolean;
  keywords: string[];
}

export const TOOL_CATEGORIES: { id: ToolCategory; nameTa: string; nameEn: string }[] = [
  { id: "all", nameTa: "அனைத்தும்", nameEn: "All Tools" },
  { id: "jathagam", nameTa: "ஜாதகம்", nameEn: "Horoscope (Jathagam)" },
  { id: "panchangam", nameTa: "பஞ்சாங்கம் & காலண்டர்", nameEn: "Panchangam & Calendar" },
  { id: "palangal", nameTa: "பலன்கள் & கோச்சாரம்", nameEn: "Predictions & Transits" },
  { id: "marriage", nameTa: "திருமணம் & பொருத்தம்", nameEn: "Marriage & Compatibility" },
  { id: "tools", nameTa: "தனிப்பட்ட கருவிகள்", nameEn: "Personal Astro Tools" },
  { id: "info", nameTa: "தகவல் & வெளிப்படைத்தன்மை", nameEn: "Information & Methods" },
];

export const ASTRO_TOOLS: AstroTool[] = [
  // Category: Jathagam
  {
    id: "jathagam",
    titleTa: "ஜாதகம் கணித்தல்",
    titleEn: "Jathagam Creation",
    descriptionTa: "உங்கள் பிறந்த தேதி, நேரம், இடம் கொண்டு துல்லியமான லக்னம், ராசி, நவாம்சம் மற்றும் கிரக நிலைகளை உடனே உருவாக்குங்கள்.",
    descriptionEn: "Complete Vedic & Tamil horoscope with Lagna, Rasi, Navamsa, and 16 divisional charts (Vargas).",
    category: "jathagam",
    path: "/jathagam",
    icon: "ScrollText",
    status: "available",
    featured: true,
    popular: true,
    keywords: ["jathagam", "horoscope", "kundli", "birth chart", "chart", "ஜாதகம்", "லக்னம்", "ராசி"],
  },
  {
    id: "jathagam-1page",
    titleTa: "1 பக்க சுருக்க ஜாதகம்",
    titleEn: "1-Page Compact Jathagam",
    descriptionTa: "அத்தியாவசிய பிறப்பு விவரங்கள், பஞ்சாங்கம், ராசி மற்றும் நவாம்ச கட்டங்கள் ஒரே பக்கத்தில் அச்சிட உகந்தது.",
    descriptionEn: "Single-page summary report with vital birth details, Panchangam, Rasi and Navamsa charts.",
    category: "jathagam",
    path: "/jathagam?mode=one",
    icon: "FileText",
    status: "available",
    popular: true,
    keywords: ["1 page", "print", "sheet", "summary", "1 பக்கம்", "அச்சிடு"],
  },
  {
    id: "jathagam-6page",
    titleTa: "6 பக்க விரிவான ஜாதகம்",
    titleEn: "6-Page Detailed Horoscope",
    descriptionTa: "பாவ பலன்கள், முக்கிய யோகங்கள், தோஷங்கள், விம்சோத்தரி தசா மற்றும் பரிகாரங்களுடன் கூடிய முழு அறிக்கை.",
    descriptionEn: "Detailed 6-page astrological report covering Bhava readings, Yogas, Doshas, and Dasa periods.",
    category: "jathagam",
    path: "/jathagam?mode=six",
    icon: "BookOpen",
    status: "available",
    popular: true,
    keywords: ["6 page", "detailed", "report", "6 பக்கம்", "விரிவான"],
  },
  {
    id: "jathagam-30page",
    titleTa: "30 பக்க ஜாதக புத்தகம்",
    titleEn: "30-Page Comprehensive Book",
    descriptionTa: "D1 முதல் D60 வரையிலான 16 வர்க்கங்கள், அஷ்டகவர்க்கம், தசா-புத்தி மற்றும் வாழ்வியல் பகுப்பாய்வு அடங்கிய முழு நூல்.",
    descriptionEn: "Comprehensive horoscope book with 16 Vargas (D1-D60), Ashtakavarga, Dasa-Bhuktis, and deep analysis.",
    category: "jathagam",
    path: "/jathagam?mode=thirty",
    icon: "BookMarked",
    status: "available",
    keywords: ["30 page", "book", "vargas", "ashtakavarga", "30 பக்கம்", "புத்தகம்"],
  },

  // Category: Panchangam & Calendar
  {
    id: "tamil-calendar",
    titleTa: "தமிழ் காலண்டர் & தினசரி பஞ்சாங்கம்",
    titleEn: "Tamil Calendar & Daily Panchangam",
    descriptionTa: "இடம் சார்ந்த சூரிய உதயம்/அஸ்தமனம், திதி, நட்சத்திர பாதம், யோகம், கரணம், 24 மணி நேர காலவரிசை மற்றும் 60-ஆண்டு சுழற்சி.",
    descriptionEn: "Location-specific daily Panchangam, astronomical transitions, 24h timeline, muhurthams, and 60-year cycle.",
    category: "panchangam",
    path: "/tamil-calendar",
    icon: "CalendarDays",
    status: "available",
    featured: true,
    popular: true,
    keywords: ["tamil calendar", "calendar", "panchangam", "daily panchangam", "காலண்டர்", "பஞ்சாங்கம்", "திதி", "நட்சத்திரம்"],
  },
  {
    id: "panchangam-alias",
    titleTa: "பஞ்சாங்கம் (தமிழ் காலண்டர் வழிமாற்று)",
    titleEn: "Panchangam (Unified Tamil Calendar)",
    descriptionTa: "முழுமையான தினசரி பஞ்சாங்கம் மற்றும் முகூர்த்த நேரங்கள் தமிழ் காலண்டரில் ஒருங்கிணைக்கப்பட்டுள்ளன.",
    descriptionEn: "Complete daily Panchangam, astronomical transitions, and muhurthams are canonically unified in Tamil Calendar.",
    category: "panchangam",
    path: "/tamil-calendar",
    icon: "Clock",
    status: "available",
    popular: true,
    keywords: ["panchangam", "rahu kalam", "yamagandam", "gulikai", "முகூர்த்தம்", "ராகு காலம்", "பஞ்சாங்கம்"],
  },
  {
    id: "nazhigai",
    titleTa: "நாழிகை மாற்றி (கடிகாரம் ↔ நாழிகை)",
    titleEn: "Nazhigai Converter",
    descriptionTa: "சூரியோதய அடிப்படையில் ஆங்கில மணிகளைத் பாரம்பரிய தமிழ் நாழிகை மற்றும் விநாழிகையாக மாற்றும் கருவி.",
    descriptionEn: "Converts standard clock hours into traditional Tamil Nazhigai and Vinazhigai based on local sunrise.",
    category: "panchangam",
    path: "/nazhigai",
    icon: "Hourglass",
    status: "available",
    keywords: ["nazhigai", "vinazhigai", "ghati", "vighati", "time", "நாழிகை", "விநாழிகை"],
  },

  // Category: Palangal & Transits
  {
    id: "forecast",
    titleTa: "பலன் கணிப்பு (1 முதல் 60 ஆண்டுகள்)",
    titleEn: "Multi-Horizon Forecast (1 to 60 Years)",
    descriptionTa: "தசா, புத்தி மற்றும் கோச்சார கிரக சஞ்சாரங்களை ஆதாரமாகக் கொண்ட 16 வாழ்க்கைத் துறைகளுக்கான பலன்கள்.",
    descriptionEn: "Evidence-backed forecasts for 16 life domains across 1-year monthly, 3-year, 5-year, and long-term eras.",
    category: "palangal",
    path: "/forecast",
    icon: "TrendingUp",
    status: "available",
    featured: true,
    popular: true,
    keywords: ["forecast", "prediction", "future", "dasa", "பலன்கள்", "ஆண்டு பலன்", "எதிர்காலம்"],
  },
  {
    id: "rasipalan",
    titleTa: "தினசரி & வார ராசிபலன்",
    titleEn: "Daily & Weekly Rasi Palan",
    descriptionTa: "12 ராசிகளுக்குமான இன்றைய சந்திரன் நிலை, பொதுவான பலன்கள் மற்றும் அதிர்ஷ்டக் குறிப்புகள்.",
    descriptionEn: "Daily and weekly horoscope readings for all 12 zodiac signs based on Moon transit.",
    category: "palangal",
    path: "/rasipalan",
    icon: "Sparkles",
    status: "available",
    popular: true,
    keywords: ["rasi palan", "daily rasi", "horoscope", "ராசிபலன்", "தின பலன்"],
  },
  {
    id: "gochara",
    titleTa: "கோச்சாரம் & கிரகப் பெயர்ச்சி",
    titleEn: "Gochara Planetary Transits",
    descriptionTa: "குரு, சனி, ராகு-கேது பெயர்ச்சிகள் உங்கள் ஜென்ம ராசியில் ஏற்படுத்தும் சுப மற்றும் அசுப தாக்கங்கள்.",
    descriptionEn: "Planetary transit impacts of Jupiter, Saturn, Rahu, and Ketu from your natal Moon sign.",
    category: "palangal",
    path: "/gochara",
    icon: "Orbit",
    status: "available",
    popular: true,
    keywords: ["gochara", "transits", "saturn transit", "jupiter transit", "கோச்சாரம்", "பெயர்ச்சி"],
  },
  {
    id: "chandrashtama",
    titleTa: "சந்திராஷ்டம நாட்கள் கால்குலேட்டர்",
    titleEn: "Chandrashtama Calculator",
    descriptionTa: "உங்கள் ராசிக்கு 8-ஆம் இடத்தில் சந்திரன் சஞ்சரிக்கும் சந்திராஷ்டம நாட்களை முன்கூட்டியே அறிந்து எச்சரிக்கையுடன் இருங்கள்.",
    descriptionEn: "Calculate Chandrashtama dates for your Moon sign to plan important events and avoid stress.",
    category: "palangal",
    path: "/chandrashtama",
    icon: "Moon",
    status: "available",
    popular: true,
    keywords: ["chandrashtama", "moon", "caution", "சந்திராஷ்டமம்", "சந்திரன்"],
  },

  // Category: Marriage & Compatibility
  {
    id: "porutham",
    titleTa: "திருமணப் பொருத்தம் (10 பொருத்தங்கள்)",
    titleEn: "Marriage Compatibility (10 Poruthams)",
    descriptionTa: "தின, கண, மாகேந்திர, ஸ்திரீ தீர்க்க, யோனி, ராசி, ராசியாதிபதி, வசிய, ரஜ்ஜு, வேதை உள்ளிட்ட பாரம்பரிய 10 பொருத்தங்கள்.",
    descriptionEn: "Traditional South Indian 10-factor Porutham analysis with Rajju, Vedha, Yoni, and Gana factor breakdown.",
    category: "marriage",
    path: "/porutham",
    icon: "HeartHandshake",
    status: "available",
    featured: true,
    popular: true,
    keywords: ["porutham", "marriage", "compatibility", "rajju", "10 porutham", "பொருத்தம்", "திருமணம்"],
  },
  {
    id: "biodata",
    titleTa: "ஜோதிட வரன் பயோடேட்டா மேக்கர்",
    titleEn: "Matrimonial Astro Biodata Maker",
    descriptionTa: "ராசி மற்றும் நவாம்ச கட்டங்களுடன் கூடிய அழகான தமிழ் மேட்ரிமோனி பயோடேட்டாவை உருவாக்கி PDF ஆக பதிவிறக்குங்கள்.",
    descriptionEn: "Create elegant Tamil marriage biodatas complete with horoscope charts and export to high-res PDF.",
    category: "marriage",
    path: "/biodata",
    icon: "UserCheck",
    status: "available",
    popular: true,
    keywords: ["biodata", "matrimony", "marriage", "pdf", "பயோடேட்டா", "வரன்"],
  },

  // Category: Personal Astro Tools
  {
    id: "nakshatra",
    titleTa: "27 நட்சத்திரங்கள் & பாத விவரங்கள்",
    titleEn: "27 Nakshatras & Padas",
    descriptionTa: "27 நட்சத்திரங்களின் அதிபதி, தெய்வம், கணம், யோனி, விருட்சம், பறவை மற்றும் பாத வாரியான பண்புகள்.",
    descriptionEn: "In-depth guide to all 27 Vedic lunar mansions: Lords, deities, symbols, animal totems, and padas.",
    category: "tools",
    path: "/nakshatra",
    icon: "Sparkle",
    status: "available",
    keywords: ["nakshatra", "stars", "pada", "deity", "நட்சத்திரம்", "பாதம்"],
  },
  {
    id: "babynames",
    titleTa: "நட்சத்திர குழந்தை பெயர்கள்",
    titleEn: "Baby Names by Nakshatra",
    descriptionTa: "குழந்தையின் பிறப்பு நட்சத்திர பாதம் மற்றும் முதல் எழுத்தின் அடிப்படையில் பாரம்பரிய மற்றும் நவீன தமிழ்ப் பெயர்கள்.",
    descriptionEn: "Traditional and modern Tamil baby names curated by birth Nakshatra pada syllables.",
    category: "tools",
    path: "/babynames",
    icon: "Baby",
    status: "available",
    keywords: ["baby names", "names", "nakshatra names", "குழந்தை பெயர்", "பெயர்"],
  },
  {
    id: "numerology",
    titleTa: "எண் கணிதம் (நியூமராலஜி)",
    titleEn: "Chaldean Numerology",
    descriptionTa: "பெயர் எண், பிறந்த எண் (Driver) மற்றும் விதி எண் (Conductor) கொண்டு வாழ்க்கைப் பாதை மற்றும் அதிர்ஷ்ட எண்களை அறிதல்.",
    descriptionEn: "Chaldean numerology tool analyzing Life Path, Destiny, and Name numbers for luck and career.",
    category: "tools",
    path: "/numerology",
    icon: "Binary",
    status: "available",
    keywords: ["numerology", "numbers", "name number", "எண் கணிதம்", "நியூமராலஜி"],
  },
  {
    id: "prasna",
    titleTa: "சோழி பிரச்னம் (Prasna Arudham)",
    titleEn: "Prasna Arudham (Horary Astrology)",
    descriptionTa: "கேள்வி கேட்கப்படும் நேரத்தின் கிரக அமைப்பைக் கொண்டு உடனடி தீர்வு காணும் பாரம்பரிய சோழி பிரச்ன முறை.",
    descriptionEn: "Instant horary astrology consultation based on question time and traditional Arudha rules.",
    category: "tools",
    path: "/prasna",
    icon: "HelpCircle",
    status: "available",
    keywords: ["prasna", "horary", "arudham", "பிரச்னம்", "ஆருடம்"],
  },

  // Category: Information & Transparency
  {
    id: "calculation-method",
    titleTa: "வானியல் கணக்கீட்டு முறை வெளிப்படைத்தன்மை",
    titleEn: "Astronomical Calculation Methods",
    descriptionTa: "நாசா JPL DE440, VSOP87 வானியல் மாதிரிகள், சித்திரபக்ஷ லஹிரி அயனாம்சம் மற்றும் முழு பாவ கணித ஆவணங்கள்.",
    descriptionEn: "Complete technical disclosure: Astronomy Engine VSOP87/ELP2000, Chitrapaksha Lahiri, and Whole Sign rules.",
    category: "info",
    path: "/calculation-method",
    icon: "ShieldCheck",
    status: "available",
    popular: true,
    keywords: ["method", "astronomy", "ephemeris", "transparency", "கணக்கீட்டு முறை", "துல்லியம்"],
  },
  {
    id: "glossary",
    titleTa: "ஜோதிட சொற்களஞ்சியம்",
    titleEn: "Astrological Glossary",
    descriptionTa: "லக்னம், ராசி, திதி, யோகம், தசாவர்க்கம், தசா-புத்தி உள்ளிட்ட ஜோதிட கலைச்சொற்களுக்கான எளிய தமிழ் விளக்கங்கள்.",
    descriptionEn: "Explanatory glossary of classical Vedic and Tamil astrological concepts and technical terminology.",
    category: "info",
    path: "/glossary",
    icon: "BookMarked",
    status: "available",
    keywords: ["glossary", "dictionary", "terms", "சொற்களஞ்சியம்", "விளக்கம்"],
  },
  {
    id: "astro-validation",
    titleTa: "உள் ஆய்வக வானியல் சரிபார்ப்பு",
    titleEn: "Internal Astro Validation Suite",
    descriptionTa: "எஃபிமெரிஸ் கணித பெஞ்ச்மார்க், கோல்டன் கேஸ்கள் மற்றும் விளிம்பு நிலை சோதனைகளை இயக்கும் உள் கருவி.",
    descriptionEn: "Developer validation dashboard running 50+ ephemeris benchmarks, golden cases, and boundary tests.",
    category: "info",
    path: "/dev/astro-validation",
    icon: "CheckCircle2",
    status: "beta",
    keywords: ["validation", "benchmark", "tests", "சரிபார்ப்பு", "சோதனை"],
  },
];

export function filterTools(
  tools: AstroTool[],
  category: ToolCategory,
  searchQuery: string
): AstroTool[] {
  let list = tools;
  if (category !== "all") {
    list = list.filter((t) => t.category === category);
  }

  const query = searchQuery.trim().toLowerCase();
  if (!query) return list;

  return list.filter((t) => {
    return (
      t.titleTa.toLowerCase().includes(query) ||
      t.titleEn.toLowerCase().includes(query) ||
      t.descriptionTa.toLowerCase().includes(query) ||
      t.descriptionEn.toLowerCase().includes(query) ||
      t.keywords.some((k) => k.toLowerCase().includes(query))
    );
  });
}
