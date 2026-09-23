// Codepackr Astro - Advanced Daily Rasi Palan Engine
// Computes dynamic, authentic daily astrological forecasts for all 12 Rasis based on Moon Gochara,
// Transit House (கோச்சார பாவ பலன்), Weekday Lord, Tithi, Nakshatra, and Chandrashtamam detection.
import {
  SIGNS_EN,
  SIGNS_TA,
  NAK_EN,
  NAK_TA,
  WEEK_EN,
  WEEK_TA,
  TITHI_EN,
  TITHI_TA,
  YOGA_EN,
  YOGA_TA,
  KARANA_EN,
  KARANA_TA,
  TAMIL_MONTH_EN,
  TAMIL_MONTH_TA,
  type School,
} from "./constants";
import { computeDailyPanchang, formatClock, nowJD } from "./engine";
import type { Lang } from "./i18n";

export type RasiPredictionArea = {
  general: string;
  career: string;
  finance: string;
  family: string;
  health: string;
  education: string;
};

export type NakshatraPointer = {
  nakName: string;
  note: string;
};

export type RasiPalanRow = {
  sign: number; // 0..11
  title: string;
  tamilSign: string;
  englishSign: string;
  symbol: string;
  iconName: string;
  lord: string;
  lordTa: string;
  lordEn: string;
  element: string;
  elementTa: string;
  elementEn: string;
  nakshatrasTa: string;
  nakshatrasEn: string;
  house: number; // 1..12 (Gochara house of Moon relative to this sign)
  houseTitleTa: string;
  houseTitleEn: string;
  tone: "good" | "mixed" | "caution";
  score: number; // 1 to 5 stars
  percentage: number; // 0 to 100%
  isChandrashtamam: boolean;
  body: string; // Quick punchy summary
  details: RasiPredictionArea;
  luckyNumber: number;
  luckyColorTa: string;
  luckyColorEn: string;
  luckyDirectionTa: string;
  luckyDirectionEn: string;
  favorableTime: string;
  remedyTa: string;
  remedyEn: string;
  deityTa: string;
  deityEn: string;
  nakshatraPointers: NakshatraPointer[];
};

export type DailyPalanBundle = {
  date: {
    year: number;
    month: number;
    day: number;
  };
  place: {
    name: string;
    lat: number;
    lon: number;
    tz: number;
  };
  school: School;
  dateLabel: string;
  tamilDateLabel: string;
  weekday: string;
  weekdayIdx: number;
  dayLordTa: string;
  dayLordEn: string;
  moonSign: number;
  moonSignTa: string;
  moonSignEn: string;
  moonNak: string;
  moonNakIdx: number;
  moonNakPada: number;
  tithiLabel: string;
  tithiNum: number;
  pakshaTa: string;
  pakshaEn: string;
  yogaLabel: string;
  karanaLabel: string;
  tithiHint: string;
  chandrashtamamSign: number;
  chandrashtamamSignTa: string;
  chandrashtamamSignEn: string;
  chandrashtamamAdviceTa: string;
  chandrashtamamAdviceEn: string;
  subhaHoras: { planet: string; time: string }[];
  rahuKalam: string;
  yamagandam: string;
  gulikaKalam: string;
  sunrise: string;
  sunset: string;
  goodSignsCount: number;
  rows: RasiPalanRow[];
};

export const RASI_METADATA = [
  {
    ta: "மேஷம்",
    en: "Aries",
    symbol: "♈",
    icon: "Ram",
    lordTa: "செவ்வாய்",
    lordEn: "Mars",
    elemTa: "நெருப்பு",
    elemEn: "Fire",
    nakTa: "அசுவினி, பரணி, கார்த்திகை 1-ம் பாதம்",
    nakEn: "Ashwini, Bharani, Krittika 1st pada",
    luckyNums: [9, 1, 3],
    colorsTa: ["சிவப்பு", "மஞ்சள்"],
    colorsEn: ["Crimson Red", "Golden Yellow"],
    dirsTa: "கிழக்கு",
    dirsEn: "East",
    deityTa: "முருகப்பெருமான்",
    deityEn: "Lord Murugan",
    nakshatras: [
      { ta: "அசுவினி", en: "Ashwini" },
      { ta: "பரணி", en: "Bharani" },
      { ta: "கார்த்திகை", en: "Krittika" },
    ],
  },
  {
    ta: "ரிஷபம்",
    en: "Taurus",
    symbol: "♉",
    icon: "Bull",
    lordTa: "சுக்கிரன்",
    lordEn: "Venus",
    elemTa: "நிலம்",
    elemEn: "Earth",
    nakTa: "கார்த்திகை 2, 3, 4, ரோகிணி, மிருகசீரிடம் 1, 2",
    nakEn: "Krittika 2,3,4, Rohini, Mrigashirsha 1,2",
    luckyNums: [6, 5, 8],
    colorsTa: ["வெள்ளை", "இளநீலம்"],
    colorsEn: ["Pure White", "Pastel Blue"],
    dirsTa: "தென்கிழக்கு",
    dirsEn: "South-East",
    deityTa: "மகாலட்சுமி தாயார்",
    deityEn: "Goddess Mahalakshmi",
    nakshatras: [
      { ta: "கார்த்திகை", en: "Krittika" },
      { ta: "ரோகிணி", en: "Rohini" },
      { ta: "மிருகசீரிடம்", en: "Mrigashirsha" },
    ],
  },
  {
    ta: "மிதுனம்",
    en: "Gemini",
    symbol: "♊",
    icon: "Twins",
    lordTa: "புதன்",
    lordEn: "Mercury",
    elemTa: "காற்று",
    elemEn: "Air",
    nakTa: "மிருகசீரிடம் 3, 4, திருவாதிரை, புனர்பூசம் 1, 2, 3",
    nakEn: "Mrigashirsha 3,4, Ardra, Punarvasu 1,2,3",
    luckyNums: [5, 1, 6],
    colorsTa: ["பச்சை", "வெளிர் நீலம்"],
    colorsEn: ["Emerald Green", "Sky Blue"],
    dirsTa: "மேற்கு",
    dirsEn: "West",
    deityTa: "மகாவிஷ்ணு",
    deityEn: "Lord Mahavishnu",
    nakshatras: [
      { ta: "மிருகசீரிடம்", en: "Mrigashirsha" },
      { ta: "திருவாதிரை", en: "Ardra" },
      { ta: "புனர்பூசம்", en: "Punarvasu" },
    ],
  },
  {
    ta: "கடகம்",
    en: "Cancer",
    symbol: "♋",
    icon: "Crab",
    lordTa: "சந்திரன்",
    lordEn: "Moon",
    elemTa: "நீர்",
    elemEn: "Water",
    nakTa: "புனர்பூசம் 4, பூசம், ஆயில்யம்",
    nakEn: "Punarvasu 4, Pushya, Ashlesha",
    luckyNums: [2, 7, 9],
    colorsTa: ["முத்து வெள்ளை", "வெள்ளி நிறம்"],
    colorsEn: ["Pearl White", "Silver"],
    dirsTa: "வடக்கு",
    dirsEn: "North",
    deityTa: "அம்பாள் / பார்வதி தேவி",
    deityEn: "Goddess Parvati / Ambal",
    nakshatras: [
      { ta: "புனர்பூசம்", en: "Punarvasu" },
      { ta: "பூசம்", en: "Pushya" },
      { ta: "ஆயில்யம்", en: "Ashlesha" },
    ],
  },
  {
    ta: "சிம்மம்",
    en: "Leo",
    symbol: "♌",
    icon: "Lion",
    lordTa: "சூரியன்",
    lordEn: "Sun",
    elemTa: "நெருப்பு",
    elemEn: "Fire",
    nakTa: "மகம், பூரம், உத்திரம் 1-ம் பாதம்",
    nakEn: "Magha, Purva Phalguni, Uttara Phalguni 1",
    luckyNums: [1, 9, 5],
    colorsTa: ["பொன் மஞ்சள்", "ஆரஞ்சு"],
    colorsEn: ["Royal Gold", "Sun Orange"],
    dirsTa: "கிழக்கு",
    dirsEn: "East",
    deityTa: "சூரிய நாராயணர் / சிவபெருமான்",
    deityEn: "Lord Surya Narayana / Shiva",
    nakshatras: [
      { ta: "மகம்", en: "Magha" },
      { ta: "பூரம்", en: "Purva Phalguni" },
      { ta: "உத்திரம்", en: "Uttara Phalguni" },
    ],
  },
  {
    ta: "கன்னி",
    en: "Virgo",
    symbol: "♍",
    icon: "Maiden",
    lordTa: "புதன்",
    lordEn: "Mercury",
    elemTa: "நிலம்",
    elemEn: "Earth",
    nakTa: "உத்திரம் 2, 3, 4, ஹஸ்தம், சித்திரை 1, 2",
    nakEn: "Uttara Phalguni 2,3,4, Hasta, Chitra 1,2",
    luckyNums: [5, 3, 7],
    colorsTa: ["கிளிப்பச்சை", "சாம்பல்"],
    colorsEn: ["Parrot Green", "Gentle Grey"],
    dirsTa: "தெற்கு",
    dirsEn: "South",
    deityTa: "விநாயகப்பெருமான்",
    deityEn: "Lord Ganesha",
    nakshatras: [
      { ta: "உத்திரம்", en: "Uttara Phalguni" },
      { ta: "ஹஸ்தம்", en: "Hasta" },
      { ta: "சித்திரை", en: "Chitra" },
    ],
  },
  {
    ta: "துலாம்",
    en: "Libra",
    symbol: "♎",
    icon: "Scales",
    lordTa: "சுக்கிரன்",
    lordEn: "Venus",
    elemTa: "காற்று",
    elemEn: "Air",
    nakTa: "சித்திரை 3, 4, சுவாதி, விசாகம் 1, 2, 3",
    nakEn: "Chitra 3,4, Swati, Vishakha 1,2,3",
    luckyNums: [6, 2, 9],
    colorsTa: ["வெள்ளை", "ரோஸ் / ரோஜா"],
    colorsEn: ["Rose Pink", "Cream White"],
    dirsTa: "மேற்கு",
    dirsEn: "West",
    deityTa: "துர்க்கை அம்மன்",
    deityEn: "Goddess Durga",
    nakshatras: [
      { ta: "சித்திரை", en: "Chitra" },
      { ta: "சுவாதி", en: "Swati" },
      { ta: "விசாகம்", en: "Vishakha" },
    ],
  },
  {
    ta: "விருச்சிகம்",
    en: "Scorpio",
    symbol: "♏",
    icon: "Scorpion",
    lordTa: "செவ்வாய்",
    lordEn: "Mars",
    elemTa: "நீர்",
    elemEn: "Water",
    nakTa: "விசாகம் 4, அனுஷம், கேட்டை",
    nakEn: "Vishakha 4, Anuradha, Jyeshtha",
    luckyNums: [9, 1, 4],
    colorsTa: ["அடர் சிவப்பு", "மெரூன்"],
    colorsEn: ["Deep Red", "Maroon"],
    dirsTa: "வடக்கு",
    dirsEn: "North",
    deityTa: "முருகப்பெருமான் / வாராஹி அம்மன்",
    deityEn: "Lord Murugan / Goddess Varahi",
    nakshatras: [
      { ta: "விசாகம்", en: "Vishakha" },
      { ta: "அனுஷம்", en: "Anuradha" },
      { ta: "கேட்டை", en: "Jyeshtha" },
    ],
  },
  {
    ta: "தனுசு",
    en: "Sagittarius",
    symbol: "♐",
    icon: "Archer",
    lordTa: "குரு",
    lordEn: "Jupiter",
    elemTa: "நெருப்பு",
    elemEn: "Fire",
    nakTa: "மூலம், பூராடம், உத்திராடம் 1-ம் பாதம்",
    nakEn: "Mula, Purva Ashadha, Uttara Ashadha 1",
    luckyNums: [3, 9, 7],
    colorsTa: ["மஞ்சள்", "பொன்னிறம்"],
    colorsEn: ["Bright Yellow", "Saffron"],
    dirsTa: "வடகிழக்கு",
    dirsEn: "North-East",
    deityTa: "தட்சிணாமூர்த்தி / குரு பகவான்",
    deityEn: "Lord Dakshinamurthy",
    nakshatras: [
      { ta: "மூலம்", en: "Mula" },
      { ta: "பூராடம்", en: "Purva Ashadha" },
      { ta: "உத்திராடம்", en: "Uttara Ashadha" },
    ],
  },
  {
    ta: "மகரம்",
    en: "Capricorn",
    symbol: "♑",
    icon: "SeaGoat",
    lordTa: "சனி",
    lordEn: "Saturn",
    elemTa: "நிலம்",
    elemEn: "Earth",
    nakTa: "உத்திராடம் 2, 3, 4, திருவோணம், அவிட்டம் 1, 2",
    nakEn: "Uttara Ashadha 2,3,4, Shravana, Dhanishta 1,2",
    luckyNums: [8, 4, 6],
    colorsTa: ["நீலம்", "கரும்பச்சை"],
    colorsEn: ["Royal Blue", "Forest Green"],
    dirsTa: "தெற்கு",
    dirsEn: "South",
    deityTa: "ஆஞ்சநேயர் / சனீஸ்வரர்",
    deityEn: "Lord Hanuman / Shani Bhagavan",
    nakshatras: [
      { ta: "உத்திராடம்", en: "Uttara Ashadha" },
      { ta: "திருவோணம்", en: "Shravana" },
      { ta: "அவிட்டம்", en: "Dhanishta" },
    ],
  },
  {
    ta: "கும்பம்",
    en: "Aquarius",
    symbol: "♒",
    icon: "WaterBearer",
    lordTa: "சனி",
    lordEn: "Saturn",
    elemTa: "காற்று",
    elemEn: "Air",
    nakTa: "அவிட்டம் 3, 4, சதயம், பூரட்டாதி 1, 2, 3",
    nakEn: "Dhanishta 3,4, Shatabhisha, Purva Bhadrapada 1,2,3",
    luckyNums: [8, 7, 3],
    colorsTa: ["கருநீலம்", "வானீலம்"],
    colorsEn: ["Navy Blue", "Electric Blue"],
    dirsTa: "மேற்கு",
    dirsEn: "West",
    deityTa: "சிவபெருமான் / அனுமன்",
    deityEn: "Lord Shiva / Hanuman",
    nakshatras: [
      { ta: "அவிட்டம்", en: "Dhanishta" },
      { ta: "சதயம்", en: "Shatabhisha" },
      { ta: "பூரட்டாதி", en: "Purva Bhadrapada" },
    ],
  },
  {
    ta: "மீனம்",
    en: "Pisces",
    symbol: "♓",
    icon: "Fishes",
    lordTa: "குரு",
    lordEn: "Jupiter",
    elemTa: "நீர்",
    elemEn: "Water",
    nakTa: "பூரட்டாதி 4, உத்திரட்டாதி, ரேவதி",
    nakEn: "Purva Bhadrapada 4, Uttara Bhadrapada, Revati",
    luckyNums: [3, 9, 2],
    colorsTa: ["வெளிர் மஞ்சள்", "வெள்ளை"],
    colorsEn: ["Pale Yellow", "Silken White"],
    dirsTa: "வடகிழக்கு",
    dirsEn: "North-East",
    deityTa: "மகாவிஷ்ணு / ராகவேந்திரர்",
    deityEn: "Lord Vishnu / Sri Raghavendra",
    nakshatras: [
      { ta: "பூரட்டாதி", en: "Purva Bhadrapada" },
      { ta: "உத்திரட்டாதி", en: "Uttara Bhadrapada" },
      { ta: "ரேவதி", en: "Revati" },
    ],
  },
];

// Gochara house titles and comprehensive predictions
interface HouseData {
  titleTa: string;
  titleEn: string;
  tone: "good" | "mixed" | "caution";
  score: number;
  percentage: number;
  punchTa: string;
  punchEn: string;
  generalTa: string;
  generalEn: string;
  careerTa: string;
  careerEn: string;
  financeTa: string;
  financeEn: string;
  familyTa: string;
  familyEn: string;
  healthTa: string;
  healthEn: string;
  educationTa: string;
  educationEn: string;
  remedyTa: string;
  remedyEn: string;
}

const HOUSE_DATA: Record<number, HouseData> = {
  1: {
    titleTa: "1-ம் இடம் (ஜன்ம ராசி சஞ்சாரம்)",
    titleEn: "1st House (Janma Rasi Transit)",
    tone: "mixed",
    score: 3.5,
    percentage: 70,
    punchTa: "உடல் சோர்வு நீங்கி உற்சாகம் பிறக்கும்; அவசர முடிவுகளைத் தவிர்த்து நிதானமாக செயல்படுவது நன்மை தரும்.",
    punchEn: "Energy returns with fresh clarity; avoid impulsive decisions and maintain a steady pace for optimal results.",
    generalTa: "மனதில் புதிய திட்டங்கள் உதயமாகும் நாள். சுறுசுறுப்புடன் செயல்பட்டு நிலுவைப் பணிகளை முடிப்பீர்கள். பிறர் பேச்சைக் கேட்டு மனம் கலங்காமல் சுய புத்தியுடன் முடிவெடுக்கவும்.",
    generalEn: "A day of fresh ideas and inner resolve. Focus on completing pending tasks with diligence. Trust your own judgment rather than external gossip.",
    careerTa: "அலுவலகத்தில் கூடுதல் பொறுப்புகள் வந்து சேரும். உயர் அதிகாரிகள் உங்கள் திறமையை கவனிப்பார்கள். சக ஊழியர்களிடம் கனிவான அணுகுமுறை வெற்றி தரும்.",
    careerEn: "Additional duties may arise at the workplace. Superiors will recognize your sincerity. Maintain polite collaboration with colleagues.",
    financeTa: "வரவும் செலவும் சமமாக இருக்கும். எதிர்பாராத சிறு செலவுகள் ஏற்பட்டாலும் சமாளித்து விடுவீர்கள். பெரிய அளவிலான கடன் கொடுப்பதையோ வாங்குவதையோ தவிர்க்கவும்.",
    financeEn: "Income and expenditure remain balanced. Manage small unexpected expenses calmly. Defer lending or borrowing large sums today.",
    familyTa: "குடும்ப உறுப்பினர்களின் ஆலோசனைகள் முக்கிய முடிவுகளுக்கு வழிகாட்டும். வாழ்க்கைத் துணையுடன் சிறு மனஸ்தாபம் தோன்றினாலும் மாலையில் சமரசம் ஏற்படும்.",
    familyEn: "Family counsel proves invaluable. Minor disagreements with your spouse will melt away by evening with open communication.",
    healthTa: "உடல் சூடு, கண் எரிச்சல் அல்லது தலைவலிக்கு வாய்ப்புண்டு. போதுமான அளவு நீர் அருந்தி உடலை குளிர்ச்சியாக வைத்துக் கொள்ளுங்கள்.",
    healthEn: "Stay hydrated to counter fatigue or mild heat strain. Take scheduled breaks to rest your eyes and mind.",
    educationTa: "மாணவர்கள் கவனச்சிதறலைத் தவிர்த்து திட்டமிட்டு படிப்பது அவசியம். ஆசிரியர்களின் வழிகாட்டல் உங்கள் மதிப்பெண்களை உயர்த்தும்.",
    educationEn: "Students must maintain sharp focus and avoid distractions. Following teachers' advice guarantees academic growth.",
    remedyTa: "காலையில் சூரிய நமஸ்காரம் செய்து, சிவபெருமானுக்கு வில்வ இலை சாற்றி வழிபடவும்.",
    remedyEn: "Offer morning salutations to the Sun and chant Shiva mantras for peace and mental clarity.",
  },
  2: {
    titleTa: "2-ம் இடம் (தன / குடும்ப ஸ்தானம்)",
    titleEn: "2nd House (Wealth & Speech Bhava)",
    tone: "good",
    score: 4.5,
    percentage: 88,
    punchTa: "தன வரவு திருப்தி தரும்; இனிமையான பேச்சால் பல காரியங்களை சுலபமாக சாதிப்பீர்கள்.",
    punchEn: "Pleasing financial gains and sweet, persuasive speech unlock effortless progress across all matters.",
    generalTa: "சொன்ன சொல்லைக் காப்பாற்றும் அற்புதமான நாள். சமூகத்திலும் குடும்பத்திலும் உங்கள் பேச்சுக்கு தனி மரியாதை உண்டாகும். உறவினர்களின் வரவு இல்லத்தில் கலகலப்பை ஏற்படுத்தும்.",
    generalEn: "An auspicious day to fulfill commitments. Your words carry weight and earn sincere respect. Welcoming visitors brightens the domestic aura.",
    careerTa: "தொழில் மற்றும் வியாபாரத்தில் புதிய வாடிக்கையாளர்கள் இணைவார்கள். பேச்சுவார்த்தைகள் சுமுகமாக முடிந்து புதிய ஒப்பந்தங்கள் கையெழுத்தாகும் சாதகமான சூழல் உண்டு.",
    careerEn: "Business negotiations proceed smoothly, yielding valuable clients. Professional communications are remarkably productive.",
    financeTa: "பணப்புழக்கம் தாராளமாக இருக்கும். நீண்ட நாட்களாக வர வேண்டிய பழைய பாக்கிகள் வசூலாகும் வாய்ப்புண்டு. சேமிப்பு உயரும் நன்னாள்.",
    financeEn: "Liquidity improves noticeably. Overdue receivables may reach your hands. An excellent day to boost your savings portfolio.",
    familyTa: "குடும்பத்தில் மகிழ்ச்சியும் நிம்மதியும் நிலவும். சுப நிகழ்ச்சிகள் பற்றிய பேச்சுவார்த்தை முன்னேற்றம் அடையும். பிள்ளைகளின் நற்பண்புகள் பெருமை சேர்க்கும்.",
    familyEn: "Domestic bliss and harmony prevail. Productive discussions regarding auspicious celebrations or family upgrades take shape.",
    healthTa: "தொண்டை, பல் அல்லது முக ஆரோக்கியத்தில் அக்கறை தேவை. சத்தான உணவுகளை உட்கொண்டு நலம் பெறுங்கள்.",
    healthEn: "General health remains vibrant; take mild precautions regarding throat or dental comfort.",
    educationTa: "கல்வியில் நினைவாற்றல் பிரகாசிக்கும். தேர்வுகளில் சிறந்த முறையில் விடையளித்து ஆசிரியர்களின் பாராட்டைப் பெறுவீர்கள்.",
    educationEn: "Retention power and eloquence peak today. Scholastic presentations and exams yield commendable praise.",
    remedyTa: "மகாலட்சுமி தாயாருக்கு நெய்தீபம் ஏற்றி, தாமரை மலர் அல்லது மல்லிகை சாற்றி வழிபடவும்.",
    remedyEn: "Light a ghee lamp for Goddess Mahalakshmi and chant Sri Suktam for enduring prosperity.",
  },
  3: {
    titleTa: "3-ம் இடம் (தைரிய / வெற்றி ஸ்தானம் — மிக நன்று!)",
    titleEn: "3rd House (Courage & Triumph Bhava — Highly Auspicious!)",
    tone: "good",
    score: 5.0,
    percentage: 96,
    punchTa: "சந்திர கோசாரம் உச்ச பலன் தருகிறது! எடுத்த காரியங்களில் மாபெரும் வெற்றி; எதிர்ப்புகள் தூள்தூளாகும்.",
    punchEn: "Peak lunar transit blessings! Monumental breakthroughs in all endeavors; obstacles vanish into thin air.",
    generalTa: "மனதில் அசாத்திய தைரியமும் தன்னம்பிக்கையும் குடியேறும் பொன்னான நாள். தொட்டதெல்லாம் பொன்னாகும் யோகம் உண்டு. புதிய முயற்சிகளை தயக்கமின்றி தொடங்கலாம்.",
    generalEn: "A golden day infused with invincible courage and supreme optimism. Every venture initiated today meets with resounding triumph.",
    careerTa: "உத்தியோகத்தில் உங்கள் ஆதிக்கமும் செல்வாக்கும் உயரும். சக ஊழியர்கள் உங்களுக்கு ஆதரவாகச் செயல்படுவார்கள். பதவி உயர்வு அல்லது பாராட்டு கடிதம் கிடைக்கும் சூழல் உண்டு.",
    careerEn: "Your leadership standing surges. Teammates rally behind your vision. Outstanding appraisals or career milestones are favored.",
    financeTa: "புதிய முதலீடுகள் நல்ல லாபத்தை ஈட்டித் தரும். கைநிறைய வருமானம் வந்து சேரும். கடன் சுமை குறையத் தொடங்கும் நன்னாள்.",
    financeEn: "Lucrative avenues open up; investments yield strong returns. Outstanding obligations begin to lighten effortlessly.",
    familyTa: "சகோதர, சகோதரிகள் வழியில் முழு ஆதரவு கிடைக்கும். குடும்பத்தில் சுபகாரிய பேச்சுக்கள் வெற்றிகரமாக முடியும். சுற்றுலா அல்லது குறுகிய பயண யோகம் உண்டு.",
    familyEn: "Joyful solidarity from siblings and close kin. Delightful short travels and celebratory gatherings unfold.",
    healthTa: "உடல் ஆரோக்கியம் மிகவும் வலிமையாகவும் புத்துணர்ச்சியுடனும் திகழும். நோயற்ற உற்சாகமான மனநிலை நீடிக்கும்.",
    healthEn: "High physical stamina and dynamic vitality radiate throughout the day.",
    educationTa: "போட்டித் தேர்வுகள், விளையாட்டு மற்றும் தொழில்நுட்பப் பிரிவுகளில் மாணவர்கள் முதலிடம் பிடிப்பார்கள்.",
    educationEn: "Competitive exams, sports, and technical disciplines witness stellar performances by students.",
    remedyTa: "முருகப்பெருமானுக்கு கந்த சஷ்டி கவசம் பாடி, செவ்வரளி மலர் சாற்றி வணங்கவும்.",
    remedyEn: "Chant Kanda Sashti Kavasam or honor Lord Murugan with red flowers for total victory.",
  },
  4: {
    titleTa: "4-ம் இடம் (சுக / மாத்ரு ஸ்தானம்)",
    titleEn: "4th House (Domestic Comfort & Mother Bhava)",
    tone: "caution",
    score: 2.5,
    percentage: 55,
    punchTa: "அலைச்சல் இருந்தாலும் அமைதி காப்பது முக்கியம்; தாய் வழி உறவுகளையும் வாகனப் பராமரிப்பையும் கவனிக்கவும்.",
    punchEn: "Mindful patience dissolves mental clutter; attend gently to domestic matters and vehicle upkeep.",
    generalTa: "வேலைப்பளு காரணமாக அலைச்சல் அதிகரிக்கலாம். தேவையில்லாத கவலைகளைத் தவிர்த்து தியானம் செய்வது மன நிம்மதியைத் தரும். வீட்டுப் பராமரிப்புச் செலவுகள் ஏற்படலாம்.",
    generalEn: "A busy schedule might induce slight restlessness. Ground yourself in quiet contemplation and avoid unnecessary overthinking.",
    careerTa: "பணியிடத்தில் அவசர முடிவுகள் வேண்டாம். மேலதிகாரிகளிடம் பொறுமையுடன் கருத்துக்களை எடுத்துரைக்கவும். சக ஊழியர்களிடம் வாக்குவாதங்களைத் தவிர்க்கவும்.",
    careerEn: "Maintain patience in discussions with leaders. Handle tasks methodically rather than rushing under pressure.",
    financeTa: "வீடு, வாகனம் அல்லது சொத்து பராமரிப்புக்காக செலவுகள் ஏற்படலாம். பட்ஜெட் போட்டு செலவு செய்வது நிதி நிலைமையை சீராக வைத்திருக்கும்.",
    financeEn: "Planned domestic or vehicular expenses may emerge. Prudent budgetary discipline preserves financial stability.",
    familyTa: "தாயாரின் உடல்நலத்தில் தனிக் கவனம் தேவை. குடும்பத்தில் அமைதியான சூழ்நிலையை உருவாக்க உங்கள் விட்டுக்கொடுக்கும் மனப்பான்மை உதவும்.",
    familyEn: "Cherish and care for motherly figures. A tolerant, accommodating posture fosters peaceful domestic warmth.",
    healthTa: "நெஞ்சு சளி, செரிமானக் கோளாறு அல்லது தூக்கமின்மை ஏற்படலாம். எளிதில் செரிக்கும் உணவுகளை உட்கொள்ளவும்.",
    healthEn: "Opt for light, warm meals and ensure restorative sleep to maintain physical equilibrium.",
    educationTa: "மாணவர்கள் பாடங்களை மீண்டும் மீண்டும் எழுதிப் பார்ப்பது நினைவாற்றலை மேம்படுத்தும்.",
    educationEn: "Repetition and structured study schedules will anchor complex concepts firmly for students.",
    remedyTa: "ஸ்ரீ காயத்ரி மந்திரம் ஜெபித்து, பசு மாட்டிற்கு அகத்திக்கீரை அல்லது வெல்லம் கலந்த உணவு கொடுக்கவும்.",
    remedyEn: "Recite the Gayatri Mantra and offer green fodder or fruits to cows for soothing cosmic relief.",
  },
  5: {
    titleTa: "5-ம் இடம் (பூர்வ புண்ணிய / புத்திர ஸ்தானம்)",
    titleEn: "5th House (Intellect & Good Fortune Bhava)",
    tone: "good",
    score: 4.2,
    percentage: 85,
    punchTa: "அறிவுக்கூர்மையும் படைப்பாற்றலும் மிளிரும் நாள்; பிள்ளைகளால் பெருமையும் சுபச்செய்திகளும் வந்து சேரும்.",
    punchEn: "Intellect and artistic intuition shine bright; joyful tidings and accomplishments from children.",
    generalTa: "பூர்வ புண்ணியத்தின் பலனால் தடைகள் விலகி நற்பலன்கள் கிட்டும். கலை, இலக்கியம் மற்றும் ஆன்மீகத்தில் நாட்டம் அதிகரிக்கும். மனதிற்குப் பிடித்தவர்களை சந்தித்து மகிழ்வீர்கள்.",
    generalEn: "Ancestral blessings unlock smooth pathways. Creative pursuits, spiritual inquiries, and joyful reunions enrich your soul.",
    careerTa: "புதுமையான திட்டங்களால் மேலதிகாரிகளின் கவனத்தை ஈர்ப்பீர்கள். ஆராய்ச்சி மற்றும் ஆலோசனைத் துறையில் இருப்பவர்களுக்கு அமோக வெற்றி கிடைக்கும்.",
    careerEn: "Innovative problem-solving earns enthusiastic accolades. Strategic advisors and consultants achieve remarkable milestones.",
    financeTa: "பங்குச் சந்தை, ஊக வணிகம் அல்லது முதலீடுகளில் நல்ல யோக பலன்கள் உண்டு. எதிர்பாராத வழிகளில் பண வரவு ஏற்படும்.",
    financeEn: "Calculated investments and financial planning yield positive fruits. Opportunities for lucrative gains present themselves.",
    familyTa: "பிள்ளைகளின் கல்வி மற்றும் வேலைவாய்ப்பில் நல்ல முன்னேற்றம் கண்டு பூரிப்படைவீர்கள். காதல் உறவில் புரிதலும் பாசமும் மேலோங்கும்.",
    familyEn: "Children bring pride and heartwarming milestones. Romantic and marital bonds deepen with sincere affection.",
    healthTa: "மனம் அமைதியாகவும் உற்சாகமாகவும் இருக்கும். ஆன்ம பலம் உடலுக்கு அளவற்ற சக்தியைத் தரும்.",
    healthEn: "High emotional serenity supports physical health, keeping vitality buoyant.",
    educationTa: "மாணவர்கள் புதிய நுட்பங்களை எளிதில் கற்றுக் கொள்வார்கள். கலை மற்றும் அறிவுசார் போட்டிகளில் வெற்றிகள் குவியும்.",
    educationEn: "Students absorb new knowledge with razor-sharp speed, excelling in quizzes and creative contests.",
    remedyTa: "குலதெய்வத்தை மனதார வணங்கி, தட்சிணாமூர்த்திக்கு மஞ்சள் வஸ்திரம் அல்லது கொண்டைக்கடலை மாலை சாற்றவும்.",
    remedyEn: "Offer humble prayers to your Kuladevata and honor Lord Dakshinamurthy with yellow chickpeas.",
  },
  6: {
    titleTa: "6-ம் இடம் (சத்ரு ஜெய / ரோக நிவாரண ஸ்தானம் — அதிர்ஷ்ட நாள்!)",
    titleEn: "6th House (Triumph Over Adversaries & Debt Relief — Fortunate Day!)",
    tone: "good",
    score: 5.0,
    percentage: 95,
    punchTa: "சந்திரனின் அருளால் சவால்கள் அனைத்தும் சாதனைகளாக மாறும்; வழக்குகள் மற்றும் போட்டிகளில் மகத்தான வெற்றி.",
    punchEn: "Lunar rays grant complete victory over rivals and obstacles; long-standing disputes resolve in your favor.",
    generalTa: "எதிர்ப்புகளை சுக்குநூறாக்கும் வல்லமை பிறக்கும் நன்னாள். மறைமுக எதிரிகள் காணாமல் போவார்கள். நீண்ட நாள் பிரச்சனைகளுக்கு இன்று சட்டென்று நல்ல தீர்வு பிறக்கும்.",
    generalEn: "Hidden adversaries retreat as your inner authority shines forth. Complex entanglements unravel with astonishing ease.",
    careerTa: "பணியிடத்தில் நிலவிய போட்டி பொறாமைகள் விலகும். கடுமையான இலக்குகளைக் கூட குறித்த நேரத்திற்குள் முடித்துக் காட்டி நற்பெயர் பெறுவீர்கள்.",
    careerEn: "Workplace politics dissolve as your competence speaks for itself. Demanding deadlines are conquered with distinction.",
    financeTa: "நீண்ட நாட்களாக தீர்க்க முடியாத பழைய கடன்களை அடைக்கும் வழி பிறக்கும். வங்கிக் கடன் அல்லது நிதி உதவி சுலபமாக கிடைக்கும்.",
    financeEn: "Promising paths to eliminate debt open up. Loans or financial sanction requests receive speedy approvals.",
    familyTa: "உறவினர்களிடையே இருந்த பழைய மனஸ்தாபங்கள் மறைந்து ஒற்றுமை கூடும். தாய் மாமன் வழி ஆதரவு பலன் தரும்.",
    familyEn: "Past misunderstandings dissolve into mutual warmth. Support from maternal relatives strengthens bonds.",
    healthTa: "நீண்ட நாட்களாக வாட்டி வதைத்த உடல் உபாதைகளில் இருந்து விடுபட்டு முழு குணம் பெறுவீர்கள்.",
    healthEn: "Noticeable recovery from lingering ailments. Vital energy rebounds strongly.",
    educationTa: "போட்டித் தேர்வுகளில் கடின உழைப்புக்கான முழு பலனைப் பெற்று முதல் தரத்தில் வெற்றி பெறுவீர்கள்.",
    educationEn: "Hard work in competitive assessments bears glorious fruit, securing top percentiles.",
    remedyTa: "ஸ்ரீ சுதர்சன சக்கரத்தாழ்வாரை அல்லது வீர ஆஞ்சநேயரை வணங்கி எலுமிச்சை மாலை சாற்றவும்.",
    remedyEn: "Revere Lord Sudarshana or Lord Hanuman for invincible protection and eradication of negativity.",
  },
  7: {
    titleTa: "7-ம் இடம் (களத்திர / நட்பு ஸ்தானம்)",
    titleEn: "7th House (Partnership & Matrimonial Harmony)",
    tone: "good",
    score: 4.2,
    percentage: 84,
    punchTa: "கூட்டாண்மை தொழிலில் நல்ல லாபம்; வாழ்க்கைத் துணையின் அளவற்ற அன்பும் ஆதரவும் உள்ளத்தை நெகிழ வைக்கும்.",
    punchEn: "Fruitful commercial alliances and heartwarming devotion from your life partner brighten the day.",
    generalTa: "பொதுமக்கள் தொடர்பு மற்றும் சமூக அந்தஸ்து உயரும் நாள். இனிய மனிதர்களின் அறிமுகம் கிடைத்து புதிய நட்புகள் மலரும். பயணங்கள் மகிழ்ச்சிகரமாக அமையும்.",
    generalEn: "Social charisma reaches a peak. Delightful encounters and networking blossom into supportive friendships.",
    careerTa: "வியாபாரக் கூட்டாளிகளுடன் புதிய திட்டங்களை விரிவுபடுத்துவீர்கள். வாடிக்கையாளர் எண்ணிக்கை அதிகரித்து விற்பனை சூடுபிடிக்கும்.",
    careerEn: "Partnership ventures thrive with renewed synergy. Client acquisition and customer goodwill witness an upswing.",
    financeTa: "வியாபாரம் மற்றும் ஒப்பந்தங்கள் மூலம் நல்ல லாபம் வந்து குவியும். கூட்டுத் தொழிலில் எதிர்பாராத உபரி வருமானம் உண்டு.",
    financeEn: "Substantial earnings flow through trade partnerships and client agreements.",
    familyTa: "தம்பதியரிடையே அன்யோன்யமும் பரஸ்பர பாசமும் அதிகரிக்கும். வரன் தேடுவோருக்கு நல்ல இடத்தில் வரன் அமைய வாய்ப்புண்டு.",
    familyEn: "Sweet matrimonial harmony deepens. Marriage proposals and matrimonial inquiries advance promisingly.",
    healthTa: "ஆரோக்கியம் சீராக இருக்கும். பயணங்களின் போது உணவு மற்றும் குடிநீர் தூய்மையில் கவனம் செலுத்தவும்.",
    healthEn: "Stamina remains balanced; maintain hygiene during travels and stay hydrated.",
    educationTa: "குழுவாக அமர்ந்து பயில்வது கடினமான பாடங்களை எளிதில் புரிந்துகொள்ள உதவும்.",
    educationEn: "Peer group study and collaborative projects bring rapid comprehension and academic joy.",
    remedyTa: "ஸ்ரீ லட்சுமி நாராயணர் அல்லது ராதா கிருஷ்ணரை வழிபட்டு மல்லிகைப் பூ சாற்றவும்.",
    remedyEn: "Worship Sri Lakshmi Narayana or Radha Krishna with sweet fragrant flowers for relational bliss.",
  },
  8: {
    titleTa: "8-ம் இடம் (சந்திராஷ்டமம்! எச்சரிக்கை தேவை)",
    titleEn: "8th House (Chandrashtamam! Caution & Prudence Needed)",
    tone: "caution",
    score: 1.5,
    percentage: 35,
    punchTa: "இன்று உங்களுக்கு சந்திராஷ்டமம் — புதிய முயற்சிகளையும், முக்கிய ஒப்பந்தங்களையும் தள்ளிப்போடவும்; நிதானமே பாதுகாப்பு.",
    punchEn: "Chandrashtamam active today — postpone new agreements and high-stakes ventures; serene patience is your shield.",
    generalTa: "மனதில் இனம் புரியாத கலக்கம், பதற்றம் அல்லது சலிப்பு ஏற்படலாம். மற்றவர்களின் வீண் விவாதங்களில் தலையிடாமல் மௌனம் காப்பது உத்தமம். வாகனப் பயணங்களில் வேகம் தவிர்க்கவும்.",
    generalEn: "A day calling for mindful introspection and stillness. Avoid controversial arguments and maintain serene silence. Practice defensive driving.",
    careerTa: "பணியிடத்தில் உயர் அதிகாரிகளிடம் தர்க்கம் செய்யாதீர்கள். உங்கள் பணிகளை மட்டும் அமைதியாக செய்து முடித்துவிட்டு திரும்புங்கள்.",
    careerEn: "Avoid clashes of ego with leadership. Complete routine duties diligently without seeking immediate validation.",
    financeTa: "பணம் கொடுக்கல் வாங்கலில் மிகுந்த எச்சரிக்கை தேவை. தெரியாத நபர்களை நம்பி ஆன்லைன் பணப் பரிவர்த்தனைகள் செய்ய வேண்டாம். தேவையற்ற விரயங்கள் வரலாம்.",
    financeEn: "Guard against financial fraud or impulsive spending. Defer major speculative investments until Chandrashtamam passes.",
    familyTa: "குடும்பத்தில் சிறு வார்த்தைகளும் விவாதமாக மாறக்கூடும். விட்டுக் கொடுத்துச் செல்வது உறவுகளைக் காக்கும் சிறந்த பரிகாரமாகும்.",
    familyEn: "Choose compassion over being right in domestic conversations. Silent tolerance prevents misunderstandings.",
    healthTa: "வயிற்று வலி, ஒற்றைத் தலைவலி அல்லது எலும்பு மூட்டு வலிகள் தலைதூக்கலாம். ஓய்வெடுத்து அமைதியான சூழலில் இருங்கள்.",
    healthEn: "Guard against mental stress, digestive sensitivity, or minor body aches with rest and light meals.",
    educationTa: "மாணவர்கள் படிப்பில் கூடுதல் கவனமும் கவனக் குவிப்பும் செலுத்த வேண்டும். எக்காரணத்தைக் கொண்டும் தேர்வுகளை அலட்சியப்படுத்தாதீர்கள்.",
    educationEn: "Double-check exam preparations and academic submissions calmly to avoid careless slips.",
    remedyTa: "ஸ்ரீ விநாயகருக்கு அருகம்புல் சாற்றி, விநாயகர் அகவல் அல்லது அனுமன் சாலிசா பாராயணம் செய்யவும். ஏழைகளுக்கு உணவு வழங்கவும்.",
    remedyEn: "Offer sacred Arugampul grass to Lord Ganesha, chant the Hanuman Chalisa, and feed the needy for total peace.",
  },
  9: {
    titleTa: "9-ம் இடம் (பாக்கிய / தர்ம ஸ்தானம் — மங்களகரமான நாள்!)",
    titleEn: "9th House (Bhagya & Divine Grace Bhava — Auspicious Day!)",
    tone: "good",
    score: 4.8,
    percentage: 92,
    punchTa: "தந்தை மற்றும் பெரியோர்களின் பரிபூரண ஆசி கிட்டும்; தெய்வ நம்பிக்கையால் கடினமான காரியங்களும் சுலபமாக முடியும்.",
    punchEn: "Benediction of elders and divine fortune pave the way; noble undertakings succeed effortlessly.",
    generalTa: "பாக்கிய ஸ்தானத்து சந்திரன் சகல நன்மைகளையும் வாரி வழங்கும் நன்னாள். ஆன்மீக தலங்களுக்குச் செல்லும் யோகம், பெரியோர்களின் வழிகாட்டல் உங்கள் வாழ்வை உயர்த்தும்.",
    generalEn: "A sublime day of spiritual elevation and good fortune. Pilgrimages, mentoring from sages, and noble thoughts bring supreme fulfillment.",
    careerTa: "தொழில் விஷயமாக மேற்கொள்ளும் நீண்ட தூர பயணங்கள் மாபெரும் வெற்றியைத் தரும். வெளிநாட்டு வேலைவாய்ப்புகள் அல்லது உயர்கல்வி வாய்ப்புகள் கைகூடும்.",
    careerEn: "Long-distance ventures and cross-border communications bring grand success. International avenues unfold auspiciously.",
    financeTa: "பரம்பரை சொத்துக்கள், நிலம் அல்லது முதலீடுகள் மூலம் எதிர்பாராத உபரி பண வரவு உண்டு. தர்ம காரியங்களுக்கு செலவு செய்து புண்ணியம் சேர்ப்பீர்கள்.",
    financeEn: "Unexpected inheritance gains, ancestral wealth, or lucrative real estate yields manifest. Charitable acts bring blessings.",
    familyTa: "தந்தையின் ஆரோக்கியம் மேம்படும். குடும்பத்தில் ஆன்மீக விழாக்கள், குலதெய்வ வழிபாடுகள் ஏற்பாடாகும். வீட்டில் மங்கள ஓசை கேட்கும்.",
    familyEn: "Father's well-being brightens. Auspicious rituals and family prayers create a sanctified, joyous home atmosphere.",
    healthTa: "உடல் ஆரோக்கியம் முழு திருப்தி தரும். மன அமைதியும் ஆன்மீக ஒளியும் முகத்தில் பிரகாசிக்கும்.",
    healthEn: "Radiant well-being, calm nerves, and spiritual tranquility permeate mind and body.",
    educationTa: "உயர்கல்வி, ஆராய்ச்சி மற்றும் சட்டப் படிப்புகளில் பயிலும் மாணவர்களுக்கு மிகச் சிறந்த அங்கீகாரம் கிடைக்கும்.",
    educationEn: "Scholars in higher education, research, and legal studies achieve stellar milestones and honors.",
    remedyTa: "ஸ்ரீ தட்சிணாமூர்த்திக்கு நெய்தீபம் ஏற்றி, குருபகவானுக்கு கொண்டைக்கடலை சுண்டல் சமர்ப்பித்து வணங்கவும்.",
    remedyEn: "Light a ghee lamp for Lord Dakshinamurthy and seek the blessings of spiritual mentors and teachers.",
  },
  10: {
    titleTa: "10-ம் இடம் (தொழில் / கர்ம / கீர்த்தி ஸ்தானம்)",
    titleEn: "10th House (Career Prestige & Karma Bhava)",
    tone: "good",
    score: 4.6,
    percentage: 90,
    punchTa: "பணியிடத்தில் மதிப்பும் மரியாதையும் உயரும்; புதிய தொழில் வாய்ப்புகளும் அரசு வழி சலுகைகளும் கிடைக்கும்.",
    punchEn: "Professional renown and executive respect soar; rewarding career offers and civic favors arrive.",
    generalTa: "சமூகத்தில் உங்கள் புகழ் பரவும் அற்புதமான நாள். பலரும் உங்களை முன்னுதாரணமாகப் பார்ப்பார்கள். அரசு சார்ந்த வேலைகள் தடையின்றி முடியும்.",
    generalEn: "A commanding day for professional standing and civic repute. Civic and bureaucratic affairs proceed smoothly.",
    careerTa: "உத்தியோகத்தில் புதிய பொறுப்புகள் மற்றும் பதவி உயர்வுக்கான வாய்ப்புகள் பிரகாசமாகும். தொழிலதிபர்களுக்கு புதிய அரசு ஒப்பந்தங்கள் கிடைக்கும்.",
    careerEn: "Promotions, leadership appointments, or prestigious project acquisitions materialize with royal dignity.",
    financeTa: "தொழில் மூலதனம் பலமடங்கு பெருகும். பணப்புழக்கம் சரளமாக இருக்கும். சொத்துக்கள் வாங்கும் எண்ணம் ஈடேறும்.",
    financeEn: "Solid professional cash flows empower wealth accumulation and asset creation.",
    familyTa: "குடும்பத்தினர் உங்கள் சாதனைகளைக் கண்டு பெருமிதம் கொள்வார்கள். சமூக விழாக்களில் குடும்பத்துடன் சென்று கௌரவிக்கப்படுவீர்கள்.",
    familyEn: "Family members beam with pride at your achievements. Social functions bring public honor to your household.",
    healthTa: "வேலைப்பளு இருந்தாலும் உற்சாகம் குறையாது. தகுந்த நேரத்தில் உணவருந்துவது நலம்.",
    healthEn: "High drive keeps fatigue away; maintain timely meals to keep metabolism balanced.",
    educationTa: "நிர்வாகவியல், மேலாண்மை மற்றும் அரசுப் பணி தேர்வுகளுக்கு தயாராகும் மாணவர்களுக்கு சிறப்பான நாள்.",
    educationEn: "A phenomenal day for aspirants of administrative and leadership roles, yielding high marks.",
    remedyTa: "சூரிய பகவானுக்கு செம்புப் பாத்திரத்தில் நீர் சமர்ப்பித்து ஆதித்ய ஹிருதய ஸ்தோத்திரம் வாசிக்கவும்.",
    remedyEn: "Offer water in a copper vessel to the rising Sun while reciting Aditya Hridaya Stotram.",
  },
  11: {
    titleTa: "11-ம் இடம் (லாப / ஆசை நிறைவேறும் ஸ்தானம் — சிகர பலன்!)",
    titleEn: "11th House (Profits & Wish Fulfillment Bhava — Peak Blessings!)",
    tone: "good",
    score: 5.0,
    percentage: 98,
    punchTa: "சந்திரனின் பூரண அனுக்கிரகம்! நினைத்த காரியங்கள் அனைத்தும் கைமேல் பலன் தரும்; பணமழை பொழியும் நன்னாள்.",
    punchEn: "Supreme Gochara blessings! Every heartfelt ambition bears immediate fruit; abundant gains and joyous fulfillment.",
    generalTa: "தொட்டதெல்லாம் வெற்றியாகும் பேரதிர்ஷ்ட நாள். பல நாட்களாக தள்ளிப்போன காரியங்கள் இன்று மின்னல் வேகத்தில் நிறைவேறும். நண்பர்களின் ஆதரவு எல்லையற்ற மகிழ்ச்சியைத் தரும்.",
    generalEn: "A magnificent day where cherished hopes turn into reality. Long-awaited aspirations fructify with lightning speed.",
    careerTa: "வியாபாரத்தில் இதுவரை கண்டிராத உச்ச லாபம் கிடைக்கும். புதிய வாடிக்கையாளர்கள் தானாகத் தேடி வருவார்கள். நிறுவனத்தில் உங்களின் ஆதிக்கம் உறுதிப்படும்.",
    careerEn: "Exceptional windfalls in trade and enterprise. Influential networks and mentors open doors of exponential expansion.",
    financeTa: "அனைத்து வழிகளிலும் தன வரவு பெருகும். வங்கி இருப்பு பல மடங்கு உயரும். புதிய சொத்து அல்லது ஆபரணங்கள் வாங்கும் யோகம் உண்டு.",
    financeEn: "Multi-stream revenues flow seamlessly. Financial abundance allows investments in valuable assets and jewellery.",
    familyTa: "இல்லத்தில் ஆனந்தக் கொண்டாட்டங்கள் நடைபெறும். மூத்த சகோதரர் வழியில் எதிர்பாராத பெரிய உதவிகள் கிடைக்கும்.",
    familyEn: "Celebrations and festive cheer fill the household. Elder siblings and cherished mentors offer staunch support.",
    healthTa: "உடல் மற்றும் உள்ளம் இரண்டும் பேரானந்தத்திலும் உச்ச ஆரோக்கியத்திலும் திளைக்கும்.",
    healthEn: "Peak vitality, luminous skin, and an exuberant mindset guarantee radiant well-being.",
    educationTa: "மாணவர்கள் அனைத்துத் துறைகளிலும் முதலிடம் பிடித்து சான்றிதழ்களையும் பதக்கங்களையும் வெல்வார்கள்.",
    educationEn: "Scholars achieve championship trophies and top honors across academics and co-curriculars.",
    remedyTa: "ஸ்ரீ வெங்கடாசலபதி பெருமாளுக்கு துளசி மாலை சாற்றி, 'ஓம் நமோ நாராயணாய' ஜெபிக்கவும்.",
    remedyEn: "Offer Tulsi garlands to Lord Venkateshwara and chant 'Om Namo Narayanaya' for eternal prosperity.",
  },
  12: {
    titleTa: "12-ம் இடம் (விரய / மோட்ச ஸ்தானம்)",
    titleEn: "12th House (Expenditure & Spiritual Detachment Bhava)",
    tone: "caution",
    score: 2.8,
    percentage: 60,
    punchTa: "சுபச் செலவுகள் அதிகரிக்கும் நாள்; ஆடம்பர செலவுகளைக் குறைத்து, இறை வழிபாட்டில் கவனம் செலுத்துவது மன அமைதி தரும்.",
    punchEn: "Subha-vraya (auspicious expenses) emerge; curb extravagance and anchor your soul in sacred devotion.",
    generalTa: "தேவையற்ற அலைச்சல்களும் எதிர்பாராத பணச்செலவுகளும் உண்டாகலாம். எனினும் அவை சுப காரியங்களுக்காகவும் தர்ம காரியங்களுக்காகவும் மாறுவது ஆறுதல் தரும். வெளிநாட்டு தொடர்பு பயன் தரும்.",
    generalEn: "A day calling for conscious spending and serene detachment. Direct expenditures toward worthy causes and spiritual pursuits.",
    careerTa: "பணியிடத்தில் ரகசியங்களைப் பேணவும். வெளிநாடு அல்லது தொலைதூர அலுவலகங்களுடன் தொடர்புடைய பணிகள் சாதகமாக முடியும்.",
    careerEn: "Maintain confidentiality on sensitive business intelligence. Remote collaborations and cross-border projects progress well.",
    financeTa: "மருத்துவம், பயணம் அல்லது சுப நிகழ்ச்சிகளுக்காக செலவுகள் வரலாம். பட்ஜெட்டை மீறாமல் பார்த்துக்கொள்வது அவசியம்.",
    financeEn: "Expenditure on wellness, pilgrimage, or household upgrades may arise. Budget strictly to prevent leaks.",
    familyTa: "குடும்பத்தில் சிறு கருத்து வேறுபாடுகள் வந்தாலும் விட்டுக்கொடுப்பது நல்லது. உறவினர்களின் வீட்டு சுப நிகழ்ச்சிகளில் கலந்து கொள்வீர்கள்.",
    familyEn: "Practice patient empathy in family matters. Attendance at wedding ceremonies or cultural festivals brings joy.",
    healthTa: "கண் எரிச்சல், தூக்கமின்மை அல்லது கால் வலிக்கு வாய்ப்புண்டு. இரவில் சீக்கிரம் உறங்கச் செல்லவும்.",
    healthEn: "Prioritize sleep hygiene to soothe tired eyes and fatigued feet. Avoid late-night screen time.",
    educationTa: "மாணவர்கள் வெளிநாடு சென்று படிக்கும் கனவு அல்லது தொலைதூரப் படிப்பு முயற்சிகளுக்கு சாதகமான நாள்.",
    educationEn: "Auspicious day for students applying for international universities or distance learning credentials.",
    remedyTa: "காலபைரவர் அல்லது நரசிம்ம மூர்த்தியை வழிபட்டு, மாலையில் நெய்தீபம் ஏற்றி வழிபடவும்.",
    remedyEn: "Offer worship to Lord Kala Bhairava or Lord Narasimha and light a sesame oil lamp in the evening.",
  },
};

// Planetary hours / auspicious Hora helper
function getSubhaHoras(sunriseJD: number, sunsetJD: number, weekday: number, tz: number) {
  // Approximate standard Subha Horas: Jupiter, Venus, Mercury, Moon
  const subhaGrahas = [
    { ta: "குரு ஹோரை", en: "Guru Hora (Jupiter)" },
    { ta: "சுக்கிர ஹோரை", en: "Sukra Hora (Venus)" },
    { ta: "புதன் ஹோரை", en: "Budha Hora (Mercury)" },
    { ta: "சந்திர ஹோரை", en: "Chandra Hora (Moon)" },
  ];
  const dayLength = (sunsetJD - sunriseJD) / 12;
  const list: { planet: string; time: string }[] = [];

  // Pick 3 auspicious slots during day
  const slots = [2, 5, 8];
  slots.forEach((s, idx) => {
    const st = sunriseJD + s * dayLength;
    const en = st + dayLength;
    const g = subhaGrahas[idx % subhaGrahas.length];
    list.push({
      planet: `${g.ta} (${g.en})`,
      time: `${formatClock(st, tz)} – ${formatClock(en, tz)}`,
    });
  });
  return list;
}

export function buildDailyRasiPalan(opts?: {
  year?: number;
  month?: number;
  day?: number;
  lang?: Lang;
  school?: School;
  place?: { name: string; lat: number; lon: number; tz: number };
  jd?: number;
}): DailyPalanBundle {
  const lang = opts?.lang ?? "ta";
  const school = opts?.school ?? "thirukanitham";
  const place = opts?.place ?? { name: "Chennai", lat: 13.08, lon: 80.27, tz: 5.5 };

  let y: number;
  let m: number;
  let d: number;

  if (opts?.year && opts?.month && opts?.day) {
    y = opts.year;
    m = opts.month;
    d = opts.day;
  } else if (opts?.jd) {
    const unix = (opts.jd - 2440587.5) * 86400 * 1000;
    const dt = new Date(unix);
    y = dt.getUTCFullYear();
    m = dt.getUTCMonth() + 1;
    d = dt.getUTCDate();
  } else {
    const now = new Date();
    y = now.getFullYear();
    m = now.getMonth() + 1;
    d = now.getDate();
  }

  const pan = computeDailyPanchang({
    year: y,
    month: m,
    day: d,
    lat: place.lat,
    lon: place.lon,
    tz: place.tz,
    place: place.name,
    school,
  });

  const moonSign = Math.floor(pan.moonLon / 30) % 12;
  const sunSign = Math.floor(pan.sunLon / 30) % 12;
  const tamilDay = Math.floor(pan.sunLon % 30) + 1;
  const tamilMonthTa = TAMIL_MONTH_TA[sunSign] ?? "சித்திரை";
  const tamilMonthEn = TAMIL_MONTH_EN[sunSign] ?? "Chithirai";
  const tamilDateLabel = `${tamilMonthTa} ${tamilDay} · ${tamilMonthEn} ${tamilDay}`;

  const weekday = lang === "ta" ? WEEK_TA[pan.weekday] : WEEK_EN[pan.weekday];
  const moonNak = lang === "ta" ? NAK_TA[pan.moonNak.idx] : NAK_EN[pan.moonNak.idx];
  const dateLabel = `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y}`;

  // Day Lord
  const DAY_LORDS = [
    { ta: "சூரியன்", en: "Sun" },
    { ta: "சந்திரன்", en: "Moon" },
    { ta: "செவ்வாய்", en: "Mars" },
    { ta: "புதன்", en: "Mercury" },
    { ta: "குரு", en: "Jupiter" },
    { ta: "வெள்ளி (சுக்கிரன்)", en: "Venus" },
    { ta: "சனி", en: "Saturn" },
  ];
  const dayLord = DAY_LORDS[pan.weekday] ?? DAY_LORDS[0];

  // Chandrashtamam Sign:
  // When transit Moon is in house 8 from sign `s`:
  // ((moonSign - s + 12) % 12) + 1 = 8  =>  (moonSign - s + 12) % 12 = 7  => s = (moonSign - 7 + 12) % 12
  const chandrashtamamSign = (moonSign - 7 + 12) % 12;
  const chandrashtamamSignTa = SIGNS_TA[chandrashtamamSign];
  const chandrashtamamSignEn = SIGNS_EN[chandrashtamamSign];

  const chandrashtamamAdviceTa = `இன்று ${chandrashtamamSignTa} ராசிக்காரர்களுக்கு சந்திராஷ்டமம் உள்ளது. புதிய முயற்சிகள், பயணங்கள், முக்கிய கையெழுத்துகள், பெரிய முதலீடுகளைத் தள்ளிப்போடவும். அமைதியும் விநாயகர் வழிபாடும் காக்கும்.`;
  const chandrashtamamAdviceEn = `Today, Chandrashtamam falls on ${chandrashtamamSignEn} sign. Defer critical contracts, major investments, and new beginnings. Practice calm patience and invoke Lord Ganesha.`;

  // Auspicious Horas
  const subhaHoras = getSubhaHoras(pan.sunriseJD, pan.sunsetJD, pan.weekday, pan.tz);

  // Build each sign's rows
  let goodSignsCount = 0;
  const rows: RasiPalanRow[] = Array.from({ length: 12 }, (_, sign) => {
    const meta = RASI_METADATA[sign];
    // Calculate Gochara house of Moon relative to this sign
    const house = ((moonSign - sign + 12) % 12) + 1;
    const isChandrashtamam = house === 8;
    const hData = HOUSE_DATA[house] ?? HOUSE_DATA[1];

    if (hData.tone === "good") goodSignsCount++;

    // Sub-pointers for nakshatras in this sign
    const nakshatraPointers: NakshatraPointer[] = meta.nakshatras.map((n, idx) => {
      let noteTa = "";
      let noteEn = "";
      if (isChandrashtamam) {
        noteTa = "விழிப்புணர்வும் பொறுமையும் தேவை; அவசர வார்த்தைகளைத் தவிர்க்கவும்.";
        noteEn = "High vigilance and calm diplomacy needed; avoid hasty words.";
      } else if (house === 3 || house === 6 || house === 11) {
        noteTa = "காரிய சித்தி, திடீர் பண வரவு மற்றும் மேலதிகாரிகளின் பாராட்டு உண்டு.";
        noteEn = "Grand accomplishment, sudden financial uplift, and career accolades.";
      } else if (house === 2 || house === 9 || house === 10) {
        noteTa = "பேச்சுக்கு மதிப்பு கூடும்; சுப காரிய பேச்சுக்கள் வெற்றியாகும்.";
        noteEn = "Words command respect; auspicious undertakings progress smoothly.";
      } else {
        noteTa = idx % 2 === 0 ? "நடைமுறை பணிகளில் முன்னேற்றம்." : "குடும்பத்தினரின் உதவி கிடைக்கும்.";
        noteEn = idx % 2 === 0 ? "Progress in routine duties." : "Supportive family cooperation.";
      }
      return {
        nakName: lang === "ta" ? n.ta : n.en,
        note: lang === "ta" ? noteTa : noteEn,
      };
    });

    const favorableSlot = subhaHoras[sign % subhaHoras.length]?.time || "10:30 AM – 12:00 PM";

    return {
      sign,
      title: lang === "ta" ? `${meta.ta} (${meta.en})` : `${meta.en} (${meta.ta})`,
      tamilSign: meta.ta,
      englishSign: meta.en,
      symbol: meta.symbol,
      iconName: meta.icon,
      lord: lang === "ta" ? meta.lordTa : meta.lordEn,
      lordTa: meta.lordTa,
      lordEn: meta.lordEn,
      element: lang === "ta" ? meta.elemTa : meta.elemEn,
      elementTa: meta.elemTa,
      elementEn: meta.elemEn,
      nakshatrasTa: meta.nakTa,
      nakshatrasEn: meta.nakEn,
      house,
      houseTitleTa: hData.titleTa,
      houseTitleEn: hData.titleEn,
      tone: hData.tone,
      score: hData.score,
      percentage: hData.percentage,
      isChandrashtamam,
      body: lang === "ta" ? hData.punchTa : hData.punchEn,
      details: {
        general: lang === "ta" ? hData.generalTa : hData.generalEn,
        career: lang === "ta" ? hData.careerTa : hData.careerEn,
        finance: lang === "ta" ? hData.financeTa : hData.financeEn,
        family: lang === "ta" ? hData.familyTa : hData.familyEn,
        health: lang === "ta" ? hData.healthTa : hData.healthEn,
        education: lang === "ta" ? hData.educationTa : hData.educationEn,
      },
      luckyNumber: meta.luckyNums[(pan.weekday + sign) % meta.luckyNums.length],
      luckyColorTa: meta.colorsTa[sign % meta.colorsTa.length],
      luckyColorEn: meta.colorsEn[sign % meta.colorsEn.length],
      luckyDirectionTa: meta.dirsTa,
      luckyDirectionEn: meta.dirsEn,
      favorableTime: favorableSlot,
      remedyTa: hData.remedyTa,
      remedyEn: hData.remedyEn,
      deityTa: meta.deityTa,
      deityEn: meta.deityEn,
      nakshatraPointers,
    };
  });

  return {
    date: { year: y, month: m, day: d },
    place,
    school,
    dateLabel,
    tamilDateLabel,
    weekday,
    weekdayIdx: pan.weekday,
    dayLordTa: dayLord.ta,
    dayLordEn: dayLord.en,
    moonSign,
    moonSignTa: SIGNS_TA[moonSign],
    moonSignEn: SIGNS_EN[moonSign],
    moonNak,
    moonNakIdx: pan.moonNak.idx,
    moonNakPada: pan.moonNak.pada,
    tithiLabel: `${pan.pan.paksha === "shukla" ? (lang === "ta" ? "வளர்பிறை" : "Shukla Paksha") : (lang === "ta" ? "தேய்பிறை" : "Krishna Paksha")} · ${(lang === "ta" ? TITHI_TA : TITHI_EN)[pan.pan.tithiIdx]}`,
    tithiNum: pan.pan.tithiNum,
    pakshaTa: pan.pan.paksha === "shukla" ? "வளர்பிறை" : "தேய்பிறை",
    pakshaEn: pan.pan.paksha === "shukla" ? "Shukla" : "Krishna",
    yogaLabel: (lang === "ta" ? YOGA_TA : YOGA_EN)[pan.pan.yogaNum],
    karanaLabel: (lang === "ta" ? KARANA_TA : KARANA_EN)[pan.pan.karanaIdx],
    tithiHint: lang === "ta" ? "சந்திர கோசாரம் மற்றும் திதி அடிப்படையிலான துல்லிய பலன்" : "Calculated from Lunar Gochara and Tithi",
    chandrashtamamSign,
    chandrashtamamSignTa,
    chandrashtamamSignEn,
    chandrashtamamAdviceTa,
    chandrashtamamAdviceEn,
    subhaHoras,
    rahuKalam: `${formatClock(pan.muh.rahu.start, pan.tz)} – ${formatClock(pan.muh.rahu.end, pan.tz)}`,
    yamagandam: `${formatClock(pan.muh.yamaganda.start, pan.tz)} – ${formatClock(pan.muh.yamaganda.end, pan.tz)}`,
    gulikaKalam: `${formatClock(pan.muh.gulikaKalam.start, pan.tz)} – ${formatClock(pan.muh.gulikaKalam.end, pan.tz)}`,
    sunrise: formatClock(pan.sunriseJD, pan.tz),
    sunset: formatClock(pan.sunsetJD, pan.tz),
    goodSignsCount,
    rows,
  };
}
