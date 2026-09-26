// Codepackr Astro — Canonical 60-Year Tamil Samvatsara Cycle Data & Logic
import type { TamilYearRecord } from "../types";

export type SamvatsaraInfo = {
  cycleIndex: number; // 1 to 60
  nameTa: string;
  nameEn: string;
  transliterations: string[];
  deityTa: string;
  deityEn: string;
  natureTa: string;
  natureEn: string;
};

/**
 * The canonical 60 Samvatsara names in exact classical order.
 * Verified against Tamil tradition and Government Rashtriya Panchanga.
 */
export const SAMVATSARA_60: readonly SamvatsaraInfo[] = [
  { cycleIndex: 1, nameTa: "பிரபவ", nameEn: "Prabhava", transliterations: ["Prabhava", "Pirabhava"], deityTa: "பிரம்மா", deityEn: "Brahma", natureTa: "மங்களகரமான ஆரம்பம்", natureEn: "Auspicious beginning" },
  { cycleIndex: 2, nameTa: "விபவ", nameEn: "Vibhava", transliterations: ["Vibhava", "Vibhava"], deityTa: "விஷ்ணு", deityEn: "Vishnu", natureTa: "செல்வ வளம்", natureEn: "Prosperity and wealth" },
  { cycleIndex: 3, nameTa: "சுக்ல", nameEn: "Shukla", transliterations: ["Shukla", "Sukla"], deityTa: "சிவன்", deityEn: "Shiva", natureTa: "தூய்மை மற்றும் ஒளி", natureEn: "Purity and radiance" },
  { cycleIndex: 4, nameTa: "பிரமோதூத", nameEn: "Pramoduta", transliterations: ["Pramoduta", "Pramodhootha"], deityTa: "இந்திரன்", deityEn: "Indra", natureTa: "மகிழ்ச்சி", natureEn: "Joy and contentment" },
  { cycleIndex: 5, nameTa: "பிரஜோற்பத்தி", nameEn: "Prajotpatti", transliterations: ["Prajotpatti", "Prajothpathi"], deityTa: "பிரஜாபதி", deityEn: "Prajapati", natureTa: "மக்கள் பெருக்கம்", natureEn: "Growth of progeny and creative power" },
  { cycleIndex: 6, nameTa: "ஆங்கீரச", nameEn: "Angirasa", transliterations: ["Angirasa", "Aangeerasa"], deityTa: "அங்கீரஸ்", deityEn: "Angiras", natureTa: "ஞான விருத்தி", natureEn: "Wisdom and intellectual pursuit" },
  { cycleIndex: 7, nameTa: "ஸ்ரீமுக", nameEn: "Srimukha", transliterations: ["Srimukha", "Sreemukha"], deityTa: "லட்சுமி", deityEn: "Lakshmi", natureTa: "புகழ் மற்றும் மங்களம்", natureEn: "Grace and renown" },
  { cycleIndex: 8, nameTa: "பவ", nameEn: "Bhava", transliterations: ["Bhava"], deityTa: "ருத்ரன்", deityEn: "Rudra", natureTa: "செயல் திறன்", natureEn: "Dynamic progression" },
  { cycleIndex: 9, nameTa: "யுவ", nameEn: "Yuva", transliterations: ["Yuva"], deityTa: "முருகன்", deityEn: "Murugan", natureTa: "இளமை வீரியம்", natureEn: "Youthful vigor and energy" },
  { cycleIndex: 10, nameTa: "தாது", nameEn: "Dhata", transliterations: ["Dhata", "Dhatu"], deityTa: "தாதா", deityEn: "Dhata", natureTa: "உறுதி மற்றும் நலம்", natureEn: "Strength and sustenance" },
  { cycleIndex: 11, nameTa: "ஈஸ்வர", nameEn: "Ishvara", transliterations: ["Ishvara", "Easwara"], deityTa: "மகேஸ்வரன்", deityEn: "Maheshwara", natureTa: "தலைமைப் பண்பு", natureEn: "Leadership and spiritual power" },
  { cycleIndex: 12, nameTa: "வெகுதானிய", nameEn: "Bahudhanya", transliterations: ["Bahudhanya", "Vegudhanya"], deityTa: "வருணன்", deityEn: "Varuna", natureTa: "தானிய வளம் / செழிப்பு", natureEn: "Agricultural abundance" },
  { cycleIndex: 13, nameTa: "பிரமாதி", nameEn: "Pramathi", transliterations: ["Pramathi", "Piramadhi"], deityTa: "யமன்", deityEn: "Yama", natureTa: "விடாமுயற்சி", natureEn: "Perseverance under challenge" },
  { cycleIndex: 14, nameTa: "விக்ரம", nameEn: "Vikrama", transliterations: ["Vikrama"], deityTa: "வீரபத்திரர்", deityEn: "Veerabhadra", natureTa: "வெற்றி மற்றும் வீரம்", natureEn: "Valor and conquest" },
  { cycleIndex: 15, nameTa: "விஷு", nameEn: "Vishu", transliterations: ["Vishu", "Visu"], deityTa: "சூரியன்", deityEn: "Surya", natureTa: "சமநிலை மற்றும் நீதி", natureEn: "Equilibrium and harmony" },
  { cycleIndex: 16, nameTa: "சித்திரபானு", nameEn: "Chitrabhanu", transliterations: ["Chitrabhanu"], deityTa: "அக்னி", deityEn: "Agni", natureTa: "கலை மற்றும் ஒளி", natureEn: "Artistic brilliance" },
  { cycleIndex: 17, nameTa: "சுபானு", nameEn: "Subhanu", transliterations: ["Subhanu"], deityTa: "சந்திரன்", deityEn: "Chandra", natureTa: "மங்கள ஒளி", natureEn: "Benevolent illumination" },
  { cycleIndex: 18, nameTa: "தாரண", nameEn: "Tharana", transliterations: ["Tharana", "Dharana"], deityTa: "பூமிதேவி", deityEn: "Bhudevi", natureTa: "பொறுமை மற்றும் காப்பு", natureEn: "Endurance and protection" },
  { cycleIndex: 19, nameTa: "பார்த்திப", nameEn: "Parthiva", transliterations: ["Parthiva", "Paarthiba"], deityTa: "குபேரன்", deityEn: "Kubera", natureTa: "அரசு மரியாதை", natureEn: "Regal honor and stability" },
  { cycleIndex: 20, nameTa: "விய", nameEn: "Vyaya", transliterations: ["Vyaya"], deityTa: "வாயு", deityEn: "Vayu", natureTa: "மாற்றங்கள் மற்றும் செலவுகள்", natureEn: "Transformation and mobility" },
  { cycleIndex: 21, nameTa: "சர்வஜித்", nameEn: "Sarvajit", transliterations: ["Sarvajit", "Sarvajith"], deityTa: "துர்க்கை", deityEn: "Durga", natureTa: "சகல வெற்றி", natureEn: "Universal triumph" },
  { cycleIndex: 22, nameTa: "சர்வதாரி", nameEn: "Sarvadhari", transliterations: ["Sarvadhari"], deityTa: "விஷ்ணு", deityEn: "Vishnu", natureTa: "தாங்கும் ஆற்றல்", natureEn: "Sustaining power" },
  { cycleIndex: 23, nameTa: "விரோதி", nameEn: "Virodhi", transliterations: ["Virodhi"], deityTa: "பைரவர்", deityEn: "Bhairava", natureTa: "தடைகளை வெல்லுதல்", natureEn: "Overcoming adversity" },
  { cycleIndex: 24, nameTa: "விக்ருதி", nameEn: "Vikruti", transliterations: ["Vikruti", "Vikruthi"], deityTa: "நரசிம்மர்", deityEn: "Narasimha", natureTa: "தைரியம்", natureEn: "Courage and adaptability" },
  { cycleIndex: 25, nameTa: "கர", nameEn: "Khara", transliterations: ["Khara", "Kara"], deityTa: "சனீஸ்வரன்", deityEn: "Shani", natureTa: "கடுமுயற்சி", natureEn: "Rigorous discipline" },
  { cycleIndex: 26, nameTa: "நந்தன", nameEn: "Nandana", transliterations: ["Nandana"], deityTa: "கிருஷ்ணர்", deityEn: "Krishna", natureTa: "குடும்ப மகிழ்ச்சி", natureEn: "Delight and family bliss" },
  { cycleIndex: 27, nameTa: "விஜய", nameEn: "Vijaya", transliterations: ["Vijaya"], deityTa: "அர்ஜுனன்", deityEn: "Arjuna", natureTa: "மகத்தான வெற்றி", natureEn: "Decisive success" },
  { cycleIndex: 28, nameTa: "ஜய", nameEn: "Jaya", transliterations: ["Jaya"], deityTa: "ஆஞ்சநேயர்", deityEn: "Anjaneya", natureTa: "தொடர் வெற்றி", natureEn: "Steadfast accomplishment" },
  { cycleIndex: 29, nameTa: "மன்மத", nameEn: "Manmatha", transliterations: ["Manmatha"], deityTa: "காமதேவன்", deityEn: "Kamadeva", natureTa: "அன்பு மற்றும் கலை", natureEn: "Affection and beauty" },
  { cycleIndex: 30, nameTa: "துர்முகி", nameEn: "Durmukhi", transliterations: ["Durmukhi"], deityTa: "காளி", deityEn: "Kali", natureTa: "விழிப்புணர்வு", natureEn: "Vigilance and resilience" },
  { cycleIndex: 31, nameTa: "ஹேவிளம்பி", nameEn: "Hevilambi", transliterations: ["Hevilambi", "Hevalambi"], deityTa: "சரஸ்வதி", deityEn: "Saraswati", natureTa: "கல்வி மற்றும் அமைதி", natureEn: "Learning and serenity" },
  { cycleIndex: 32, nameTa: "விளம்பி", nameEn: "Vilambi", transliterations: ["Vilambi"], deityTa: "தட்சிணாமூர்த்தி", deityEn: "Dakshinamurthy", natureTa: "ஆழ்ந்த சிந்தனை", natureEn: "Contemplation and steady progress" },
  { cycleIndex: 33, nameTa: "விகாரி", nameEn: "Vikari", transliterations: ["Vikari"], deityTa: "சுப்பிரமணியர்", deityEn: "Subrahmanya", natureTa: "உருமாற்றம்", natureEn: "Metamorphosis and evolution" },
  { cycleIndex: 34, nameTa: "சார்வரி", nameEn: "Sharvari", transliterations: ["Sharvari", "Sarvari"], deityTa: "சந்திரமௌலீஸ்வரர்", deityEn: "Chandramouleeshwara", natureTa: "இருள் நீங்கி ஒளி பெறுதல்", natureEn: "Emerging through perseverance" },
  { cycleIndex: 35, nameTa: "பிலவ", nameEn: "Plava", transliterations: ["Plava", "Pilava"], deityTa: "கங்கை", deityEn: "Ganga", natureTa: "பிரச்சினைகளைக் கடத்தல்", natureEn: "Crossing over difficulties smoothly" },
  { cycleIndex: 36, nameTa: "சுபகிருது", nameEn: "Shubhakrit", transliterations: ["Shubhakrit", "Subhakrithu"], deityTa: "கணபதி", deityEn: "Ganapati", natureTa: "நற்செயல்கள்", natureEn: "Good deeds and virtue" },
  { cycleIndex: 37, nameTa: "சோபகிருது", nameEn: "Shobhakrit", transliterations: ["Shobhakrit", "Sobhakrithu"], deityTa: "மகாலட்சுமி", deityEn: "Mahalakshmi", natureTa: "பிரகாசம் மற்றும் நலம்", natureEn: "Elegance and welfare" },
  { cycleIndex: 38, nameTa: "குரோதி", nameEn: "Krodhi", transliterations: ["Krodhi"], deityTa: "வராஹி", deityEn: "Varahi", natureTa: "எதிர்ப்புகளை அடக்குதல்", natureEn: "Overcoming hostility" },
  { cycleIndex: 39, nameTa: "விசுவாவசு", nameEn: "Vishvavasu", transliterations: ["Vishvavasu", "Visvavasu"], deityTa: "விஸ்வேதேவர்", deityEn: "Visvedevas", natureTa: "உலகளாவிய நன்மை", natureEn: "Universal benevolence and harmony" },
  { cycleIndex: 40, nameTa: "பராபவ", nameEn: "Parabhava", transliterations: ["Parabhava"], deityTa: "பரமேஸ்வரன்", deityEn: "Parameshwara", natureTa: "மறுமலர்ச்சி", natureEn: "Renewal and spiritual strength" },
  { cycleIndex: 41, nameTa: "பிலவங்க", nameEn: "Plavanga", transliterations: ["Plavanga"], deityTa: "கருடன்", deityEn: "Garuda", natureTa: "விரைவு மற்றும் சுறுசுறுப்பு", natureEn: "Swiftness and dynamism" },
  { cycleIndex: 42, nameTa: "கீலக", nameEn: "Keelaka", transliterations: ["Keelaka"], deityTa: "முருகப்பெருமான்", deityEn: "Muruga", natureTa: "நிலையான பிணைப்பு", natureEn: "Firm anchoring and resolve" },
  { cycleIndex: 43, nameTa: "சௌம்ய", nameEn: "Saumya", transliterations: ["Saumya", "Sowmya"], deityTa: "புதன்", deityEn: "Budha", natureTa: "சாந்தம் மற்றும் நற்பண்பு", natureEn: "Gentleness and intellectual grace" },
  { cycleIndex: 44, nameTa: "சாதாரண", nameEn: "Sadharana", transliterations: ["Sadharana"], deityTa: "தர்மராஜன்", deityEn: "Dharmaraja", natureTa: "நடுநிலை", natureEn: "Balance and standard duties" },
  { cycleIndex: 45, nameTa: "விரோதிகிருது", nameEn: "Virodhikrit", transliterations: ["Virodhikrit"], deityTa: "சரபேஸ்வரர்", deityEn: "Sarabheswara", natureTa: "சூழ்ச்சிகளை முறியடித்தல்", natureEn: "Neutralizing obstacles" },
  { cycleIndex: 46, nameTa: "பரிதாபி", nameEn: "Paridhavi", transliterations: ["Paridhavi"], deityTa: "சூரிய நாராயணர்", deityEn: "Surya Narayana", natureTa: "கனிவு மற்றும் இரக்கம்", natureEn: "Compassion and goodwill" },
  { cycleIndex: 47, nameTa: "பிரமாதீச", nameEn: "Pramadeesa", transliterations: ["Pramadeesa", "Pramadheesa"], deityTa: "ஈசானன்", deityEn: "Ishana", natureTa: "ஆளுமைத் திறன்", natureEn: "Authority and administrative clarity" },
  { cycleIndex: 48, nameTa: "ஆனந்த", nameEn: "Ananda", transliterations: ["Ananda"], deityTa: "நடராஜர்", deityEn: "Nataraja", natureTa: "பேரின்பம்", natureEn: "Bliss and creative fruition" },
  { cycleIndex: 49, nameTa: "ராட்சச", nameEn: "Rakshasa", transliterations: ["Rakshasa"], deityTa: "சுதர்சனர்", deityEn: "Sudarshana", natureTa: "காவல் மற்றும் பாதுகாப்பு", natureEn: "Protection through strength" },
  { cycleIndex: 50, nameTa: "நள", nameEn: "Nala", transliterations: ["Nala"], deityTa: "அஸ்வினி குமாரர்கள்", deityEn: "Ashvins", natureTa: "ஆரோக்கிய விருத்தி", natureEn: "Health and restorative vigor" },
  { cycleIndex: 51, nameTa: "பிங்கள", nameEn: "Pingala", transliterations: ["Pingala"], deityTa: "சுப்பிரமணியர்", deityEn: "Subrahmanya", natureTa: "ஒளி வீசும் ஆற்றல்", natureEn: "Golden brilliance and focus" },
  { cycleIndex: 52, nameTa: "காலயுக்தி", nameEn: "Kaalayukthi", transliterations: ["Kaalayukthi", "Kalayukti"], deityTa: "காலபைரவர்", deityEn: "Kala Bhairava", natureTa: "காலத்தை வெல்லுதல்", natureEn: "Strategic mastery of time" },
  { cycleIndex: 53, nameTa: "சித்தார்த்தி", nameEn: "Siddharthi", transliterations: ["Siddharthi"], deityTa: "மகாவிஷ்ணு", deityEn: "Mahavishnu", natureTa: "காரிய சித்தி", natureEn: "Accomplishment of goals" },
  { cycleIndex: 54, nameTa: "ரௌத்ரி", nameEn: "Raudra", transliterations: ["Raudra", "Routhri"], deityTa: "வீரபத்திரர்", deityEn: "Veerabhadra", natureTa: "வீரியம்", natureEn: "Formidable resolve" },
  { cycleIndex: 55, nameTa: "துர்மதி", nameEn: "Durmathi", transliterations: ["Durmathi"], deityTa: "ஹயக்ரீவர்", deityEn: "Hayagriva", natureTa: "மதியால் வெல்லுதல்", natureEn: "Wisdom overcoming confusion" },
  { cycleIndex: 56, nameTa: "துந்துபி", nameEn: "Dundubhi", transliterations: ["Dundubhi"], deityTa: "இந்திரன்", deityEn: "Indra", natureTa: "மங்கள முழக்கம்", natureEn: "Celebration and herald of joy" },
  { cycleIndex: 57, nameTa: "ருதிரோத்காரி", nameEn: "Rudhirodgari", transliterations: ["Rudhirodgari", "Rudhiraathkaari"], deityTa: "ருத்ரன்", deityEn: "Rudra", natureTa: "சக்தி பெருக்கம்", natureEn: "Potent transformational energy" },
  { cycleIndex: 58, nameTa: "ரக்தாட்சி", nameEn: "Raktakshi", transliterations: ["Raktakshi"], deityTa: "துர்க்கை", deityEn: "Durga", natureTa: "தற்காப்பு உறுதி", natureEn: "Fierce vigilance and protection" },
  { cycleIndex: 59, nameTa: "குரோதன", nameEn: "Krodhana", transliterations: ["Krodhana"], deityTa: "நரசிம்மர்", deityEn: "Narasimha", natureTa: "துணிவு", natureEn: "Valiant determination" },
  { cycleIndex: 60, nameTa: "அட்சய", nameEn: "Akshaya", transliterations: ["Akshaya"], deityTa: "மகாவிஷ்ணு & லட்சுமி", deityEn: "Vishnu & Lakshmi", natureTa: "அழியாத நிறைவு / முடிவு மற்றும் மீளெழுச்சி", natureEn: "Inexhaustible abundance and completion" },
];

/**
 * Returns Samvatsara info for a 1-based cycle index (1 to 60).
 * Handles cycle wrapping automatically.
 */
export function getSamvatsaraByIndex(index: number): SamvatsaraInfo {
  const norm = ((index - 1) % 60 + 60) % 60;
  return SAMVATSARA_60[norm]!;
}

/**
 * Computes the 1-based Samvatsara cycle index from the Gregorian year in which
 * the Tamil year began (i.e. at Chithirai 1).
 * Anchor: 1987-1988 = Prabhava (index 1).
 *
 * Examples:
 * - 1987 -> 1 (Prabhava)
 * - 2024 -> 38 (Krodhi)
 * - 2025 -> 39 (Vishvavasu)
 * - 2026 -> 40 (Parabhava)
 * - 2046 -> 60 (Akshaya)
 * - 2047 -> 1 (Prabhava, wrap to next 60-year cycle)
 */
export function samvatsaraIndexFromYear(tamilYearStartGregorianYear: number): number {
  return (((tamilYearStartGregorianYear - 1987) % 60 + 60) % 60) + 1;
}

/**
 * Finds Samvatsara info by search query (Tamil name, English name, or alias).
 */
export function searchSamvatsara(query: string): SamvatsaraInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...SAMVATSARA_60];
  return SAMVATSARA_60.filter(
    (s) =>
      s.nameTa.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.transliterations.some((t) => t.toLowerCase().includes(q)) ||
      String(s.cycleIndex) === q
  );
}
