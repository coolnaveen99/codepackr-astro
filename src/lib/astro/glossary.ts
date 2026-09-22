// Codepackr Astro - Classical Tamil Jothidam glossary (client-side)
import type { Lang } from "./i18n";

export type GlossaryEntry = {
  id: string;
  termTa: string;
  termEn: string;
  bodyTa: string;
  bodyEn: string;
  tags?: string[];
};

/** Educational glossary — classical terms used across the app. */
export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "thirukanitham",
    termTa: "திருக்கணிதம்",
    termEn: "Thirukanitham",
    bodyTa:
      "தமிழ்நாட்டில் பரவலாகப் பயன்படும் கணித அடிப்படையிலான ஜாதக முறை. கிரக நிலைகளை நவீன வானியல் சூத்திரங்களால் கணக்கிட்டு, அயனாம்சத்தைப் பயன்படுத்தி சிரேய ராசிக்கு மாற்றுகிறது.",
    bodyEn:
      "A widely used Tamil mathematical school of horoscopy. Planetary positions are computed with modern astronomical formulae, then converted to the sidereal zodiac via an ayanamsa.",
    tags: ["school", "calculation"],
  },
  {
    id: "vakya",
    termTa: "வாக்கியம்",
    termEn: "Vakya",
    bodyTa:
      "பாரம்பரிய வாக்கியப் பஞ்சாங்க முறை. சராசரி கிரக இயக்கங்களை அட்டவணைகளால் கணக்கிடும் பழைய தமிழ் பாணி. திருக்கணிதத்துடன் ஒப்பிட்டுப் பார்க்க பயனுள்ளது.",
    bodyEn:
      "Traditional vakya-panchanga method using mean motions from classical tables. Useful to compare side-by-side with Thirukanitham results.",
    tags: ["school", "calculation"],
  },
  {
    id: "lahiri",
    termTa: "லாஹிரி அயனாம்சம்",
    termEn: "Lahiri ayanamsa",
    bodyTa:
      "இந்திய அரசு அங்கீகரித்த சித்தகாந்த அயனாம்சம். பல வட இந்திய மற்றும் மென்பொருள் ஜாதகங்களில் இயல்புநிலையாகப் பயன்படும்.",
    bodyEn:
      "The Chitrapaksha ayanamsa endorsed by the Government of India. Default in many North-Indian and software charts.",
    tags: ["ayanamsa"],
  },
  {
    id: "rasi",
    termTa: "ராசி",
    termEn: "Rasi (Moon sign)",
    bodyTa:
      "தமிழ் ஜோதிடத்தில் ராசி என்பது சந்திரன் நிற்கும் இராசி — லக்னம் அல்ல. பெயர், பொருத்தம், கோசாரம் பெரும்பாலும் ராசியை அடிப்படையாகக் கொள்ளும்.",
    bodyEn:
      "In Tamil usage, rasi is the Moon's sign — not the lagna. Naming, porutham and gochara are largely Moon-sign based.",
    tags: ["basics"],
  },
  {
    id: "lagna",
    termTa: "லக்னம்",
    termEn: "Lagna (ascendant)",
    bodyTa:
      "பிறந்த நேரத்தில் கிழக்கு அடிவானத்தில் எழும் இராசி. பாவ (வீட்டு) பலன் மற்றும் தனிப்பட்ட தன்மைக்கு முக்கியம்.",
    bodyEn:
      "The sign rising on the eastern horizon at birth. Central to house (bhava) readings and individual temperament.",
    tags: ["basics"],
  },
  {
    id: "nakshatra",
    termTa: "நட்சத்திரம்",
    termEn: "Nakshatra",
    bodyTa:
      "27 நட்சத்திரங்களில் ஒன்று. ஒவ்வொன்றும் நான்கு பாதங்களாகப் பிரிக்கப்படும். பெயர் எழுத்து, தசை தொடக்கம், பொருத்தம் ஆகியவற்றில் முக்கியம்.",
    bodyEn:
      "One of 27 lunar mansions, each divided into four padas. Key for name syllables, dasa start and matching.",
    tags: ["basics"],
  },
  {
    id: "pada",
    termTa: "பாதம்",
    termEn: "Pada",
    bodyTa: "ஒரு நட்சத்திரத்தின் நான்கு சம பாகங்களில் ஒன்று. ஒவ்வொரு பாதத்திற்கும் பெயர் எழுத்து உண்டு.",
    bodyEn: "One of four equal quarters of a nakshatra. Each pada has associated name syllables.",
    tags: ["basics"],
  },
  {
    id: "ayanamsa",
    termTa: "அயனாம்சம்",
    termEn: "Ayanamsa",
    bodyTa:
      "சாயன (வெப்பமண்டல) மற்றும் நிரயண ராசி வட்டங்களுக்கிடையேயான வித்தியாசமே அயனாம்சம். இதை சரியாகப் பயன்படுத்தாவிட்டால் ராசி மற்றும் நட்சத்திரக் கணக்கில் வேறுபாடு ஏற்படும்.",
    bodyEn:
      "The offset between the tropical and sidereal zodiacs. Without it, rasi and nakshatra would be wrong.",
    tags: ["calculation"],
  },
  {
    id: "vargottama",
    termTa: "வர்கோத்தமம்",
    termEn: "Vargottama",
    bodyTa:
      "ஒரு கிரகம் ராசி மற்றும் நவாம்சத்தில் ஒரே இராசியில் இருந்தால் வர்கோத்தமம். பலம் அதிகம் என்று கருதப்படும்.",
    bodyEn:
      "A planet occupies the same sign in both rasi and navamsa. Traditionally treated as a strength factor.",
    tags: ["strength"],
  },
  {
    id: "combust",
    termTa: "அஸ்தம்",
    termEn: "Combustion",
    bodyTa:
      "சூரியனுக்கு மிக அருகில் உள்ள கிரகம். அதன் வெளிப்பாடு குறைவதாகக் கருதப்படும் (சந்திரன், ராகு, கேது தவிர).",
    bodyEn:
      "A planet too close to the Sun; its expression is considered weakened (Moon, Rahu, Ketu excepted).",
    tags: ["strength"],
  },
  {
    id: "retro",
    termTa: "வக்ரம்",
    termEn: "Retrograde",
    bodyTa: "பூமியிலிருந்து பார்க்கும்போது பின்னோக்கிச் செல்வது போல் தோன்றும் கிரக இயக்கம். பலனில் தாக்கம் உண்டு.",
    bodyEn: "Apparent backward motion of a planet as seen from Earth. Affects how results are interpreted.",
    tags: ["basics"],
  },
  {
    id: "dasa",
    termTa: "விம்சோத்தரி தசை",
    termEn: "Vimshottari dasa",
    bodyTa:
      "120 ஆண்டு கால அமைப்பு. நட்சத்திர அதிபதியிலிருந்து தொடங்கி ஒன்பது கிரகங்களின் மகாதசை/புக்தி காலங்களைக் காட்டும்.",
    bodyEn:
      "120-year timing system starting from the Moon's nakshatra lord, giving mahadasa and bhukti periods for nine grahas.",
    tags: ["timing"],
  },
  {
    id: "bhukti",
    termTa: "புக்தி",
    termEn: "Bhukti (antardasa)",
    bodyTa: "மகாதசையின் உட்பிரிவு. நடப்பு காலத்தின் நுணுக்கமான பலனுக்குப் பயன்படும்.",
    bodyEn: "Sub-period within a mahadasa. Used for finer timing of results.",
    tags: ["timing"],
  },
  {
    id: "ashtakavarga",
    termTa: "அஷ்டவர்க்கம்",
    termEn: "Ashtakavarga",
    bodyTa:
      "எட்டு புள்ளி அட்டவணைகள் (பின்னாஷ்டவர்க்கம்) மற்றும் அவற்றின் கூட்டு (சர்வாஷ்டவர்க்கம்). பாவ பலத்தையும் கோசாரத்தையும் மதிப்பிட உதவும்.",
    bodyEn:
      "Eight-point bindus per planet (bhinnashtakavarga) and their sum (sarvashtakavarga). Helps judge house strength and transits.",
    tags: ["strength"],
  },
  {
    id: "dasakoota",
    termTa: "தசகூடம்",
    termEn: "Dasakoota",
    bodyTa:
      "தமிழ்நாட்டு திருமண மரபில் பயன்படுத்தப்படும் பத்து பொருத்தங்கள் — தினம், கணம், மகேந்திரம், ஸ்திரீ தீர்க்கம், யோனி, ராசி, ராசியதிபதி, வசியம், ரஜ்ஜு, வேதை. இவை உத்தமம், மத்தியமம், அதமம் எனப் பிரித்து விளக்கப்படுகின்றன.",
    bodyEn:
      "Tamil Nadu marriage matching — ten poruthams (dinam, ganam, yoni, rasi, rajju, vedha, etc.) graded Uthamam / Madhyamam / Adhamam.",
    tags: ["porutham"],
  },
  {
    id: "rajju",
    termTa: "ரஜ்ஜு",
    termEn: "Rajju",
    bodyTa:
      "நட்சத்திரங்களை ஐந்து குழுக்களாகப் பிரிக்கும் பொருத்தம். ஒரே ரஜ்ஜு இருந்தால் பாரம்பரியத்தில் தடை எனக் கருதப்படும்.",
    bodyEn:
      "Porutham that groups nakshatras into five cords. Same rajju is traditionally treated as a serious obstacle.",
    tags: ["porutham"],
  },
  {
    id: "vedha",
    termTa: "வேதை",
    termEn: "Vedha",
    bodyTa: "சில நட்சத்திரங்கள் ஒன்றையொன்று தடை செய்யும் உறவு. பொருத்தத்தில் கவனம் தேவை.",
    bodyEn: "Certain nakshatras obstruct each other. Requires caution in matching.",
    tags: ["porutham"],
  },
  {
    id: "chevvai",
    termTa: "செவ்வாய் தோஷம்",
    termEn: "Chevvai (Manglik)",
    bodyTa:
      "செவ்வாய் 1, 2, 4, 7, 8, 12 ஆம் பாவங்களில் இருப்பதாகக் கருதப்படும் திருமணத் தோஷம். இருவருக்கும் இருந்தால் சமம் எனப் பலர் கருதுவர்.",
    bodyEn:
      "Mars in houses 1, 2, 4, 7, 8 or 12 relative to lagna/Moon/Venus. Often considered balanced if both partners have it.",
    tags: ["dosha"],
  },
  {
    id: "kaalsarpa",
    termTa: "காலசர்ப்பம்",
    termEn: "Kaal Sarpa",
    bodyTa: "அனைத்து கிரகங்களும் ராகு–கேது அச்சிற்குள் அமைந்திருக்கும் யோகம். பல வகைகள் உண்டு; பயம் விளைவிக்காமல் சமநிலையுடன் பார்க்க வேண்டும்.",
    bodyEn:
      "All planets lie between Rahu and Ketu. Several variants exist; interpret with balance, not fear.",
    tags: ["yoga", "dosha"],
  },
  {
    id: "sadesati",
    termTa: "ஏழரைச் சனி",
    termEn: "Sade Sati",
    bodyTa:
      "சனி ராசிக்கு முன், ராசி, பின் ஆகிய மூன்று இராசிகளில் செல்லும் சுமார் 7½ ஆண்டு காலம். முதல், இரண்டாம், மூன்றாம் கட்டங்களாகப் பிரிக்கப்படும்.",
    bodyEn:
      "Saturn's transit over the signs before, of, and after the Moon sign — about 7½ years in three phases.",
    tags: ["transit"],
  },
  {
    id: "gochara",
    termTa: "கோசாரம்",
    termEn: "Gochara (transits)",
    bodyTa: "நடப்பு கிரக இயக்கங்கள். ராசி அல்லது லக்னத்திலிருந்து பாவ நிலையால் பலன் மதிப்பிடப்படும்.",
    bodyEn: "Current planetary transits. Results are judged from rasi or lagna house counts.",
    tags: ["transit"],
  },
  {
    id: "navamsa",
    termTa: "நவாம்சம் (D9)",
    termEn: "Navamsa (D9)",
    bodyTa: "ஒவ்வொரு ராசியையும் ஒன்பது பாகங்களாகப் பிரிக்கும் வர்க்கம். திருமணம், உள்ளார்ந்த பலம், தசை பலனுக்கு முக்கியம்.",
    bodyEn: "Each sign divided into nine parts. Central for marriage, inherent strength and dasa results.",
    tags: ["varga"],
  },
  {
    id: "panchangam",
    termTa: "பஞ்சாங்கம்",
    termEn: "Panchangam",
    bodyTa: "திதி, வாரம், நட்சத்திரம், யோகம், கரணம் ஆகிய ஐந்து அங்கங்கள். நல்ல நேரம் தேர்வுக்கு அடிப்படை.",
    bodyEn: "Five limbs: tithi, weekday, nakshatra, yoga, karana. Foundation for choosing auspicious times.",
    tags: ["muhurta"],
  },
  {
    id: "muhurta",
    termTa: "முகூர்த்தம்",
    termEn: "Muhurta",
    bodyTa:
      "சுப காலத் தேர்வு. ராகுகாலம், எமகண்டம், கௌரி நல்ல நேரம், அபிஜித், ஊரை (ஓரை) ஆகியவற்றைக் கருத்தில் கொள்ளும்.",
    bodyEn:
      "Electional timing. Considers Rahu kalam, Yamaganda, Gowri periods, Abhijit and planetary horas (oorai).",
    tags: ["muhurta"],
  },
  {
    id: "oorai",
    termTa: "ஊரை (ஓரை)",
    termEn: "Oorai (hora)",
    bodyTa: "சூரிய உதயம் முதல் அடுத்த உதயம் வரை 24 சம காலங்கள். ஒவ்வொன்றும் ஒரு கிரக அதிபதிக்கு உரியது.",
    bodyEn: "24 equal parts from sunrise to next sunrise, each ruled by a planetary lord.",
    tags: ["muhurta"],
  },
  {
    id: "prasna",
    termTa: "பிரஷ்னம்",
    termEn: "Prasna",
    bodyTa:
      "கேள்வி கேட்கும் நேரத்தின் ஜாதகம். பிறந்த விவரம் இல்லாதபோது, அந்த நேர லக்னம்/சந்திரன் அடிப்படையில் வழிகாட்டல்.",
    bodyEn:
      "Horary chart for the moment a question is asked. Guidance from that lagna/Moon when birth data is unavailable.",
    tags: ["technique"],
  },
  {
    id: "shadbala",
    termTa: "ஷட்பலம்",
    termEn: "Shadbala",
    bodyTa: "கிரகத்தின் ஆறுவகை பலம் (ஸ்தான, திக, கல, சேட்ட, நைசர்க்க, திக்பலம்). எளிய மென்பொருளில் அணுகுமுறை மட்டும் காட்டப்படலாம்.",
    bodyEn:
      "Sixfold planetary strength. Apps often show a simplified relative strength rather than full classical tables.",
    tags: ["strength"],
  },
];

export function searchGlossary(query: string, _lang: Lang): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter((g) => {
    const hay = [
      g.termTa,
      g.termEn,
      g.bodyTa,
      g.bodyEn,
      ...(g.tags ?? []),
      g.id,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || g.termTa.includes(query.trim());
  });
}
