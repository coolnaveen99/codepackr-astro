import { SIGNS_EN, SIGNS_TA, planetName } from "./constants";
import type { Lang } from "./i18n";
import type { Analysis, BhavaReport, Dignity, GrahaReport } from "./analysis";
import { BHAVA_EN, BHAVA_TA, DIGNITY_EN, DIGNITY_TA, DUSTHANA, KENDRA } from "./tables";

const HOUSE_BASE_TA = [
  "உடல், நடை, முகவரி, வாழ்க்கைப் பாதை. இங்குள்ள கிரகங்கள் ஆளும் தன்மையையும் முதல் பார்வையையும் காட்டுகின்றன.",
  "குடும்பச் சேமிப்பு, பேச்சு, உணவு, குடும்ப ஒற்றுமை. இரண்டாம் அதிபதி வலுவானால் பொருள் நிற்கும்.",
  "தம்பி/தங்கை, துணிவு, குறு பயணம், கைத்திறன். மூன்றாம் இட வலிமை முயற்சியைக் காட்டுகிறது.",
  "வீடு, வாகனம், தாய், மனநிம்மதி. நான்காம் இடச் சுபர்கள் சுகத்தைப் பெருக்குவர்.",
  "புத்தி, கல்வி, மந்திரம், புத்திர பாக்கியம், முதலீடு. ஐந்தாம் அதிபதி நல்ல இடத்தில் இருந்தால் அறிவு மிளிரும்.",
  "கடன், நோய், போட்டி, வேலைச் சேவை. ஆறாம் இட மங்களம் சத்துருக்களை வெல்ல உதவும்.",
  "திருமணம், கூட்டாண்மை, வெளி உலக ஒப்பந்தம். ஏழாம் இடச் சுத்தம் இணக்கத்தைத் தரும்.",
  "ஆயுள், மரபுச் சொத்து, மறைவு, ஆராய்ச்சி. எட்டாம் இடம் கவனத்துடன் பார்க்கப்பட வேண்டும்.",
  "தந்தை, குரு, தீர்த்த யாத்திரை, பாக்கியம். ஒன்பதாம் இடமே தமிழ் ஜாதகத்தில் அதிர்ஷ்டக் கிணறு.",
  "தொழில், அரசு, கீர்த்தி, கைங்கரியம். பத்தாம் இடக் கிரகமே உலகம் காணும் முகப்பு.",
  "வருமானம், நண்பர் வட்டம், ஆசை நிறைவேற்றம். பதினொன்றாம் இட வலிமை லாபத்தை நிலைநிறுத்தும்.",
  "செலவு, வெளிநாடு, தியாகம், படுக்கை இன்பம். பன்னிரண்டாம் இடச் சுபர் மோக்ஷ பாதையை மென்மையாக்குவர்.",
];

const HOUSE_BASE_EN = [
  "Body, gait, identity and the path of life. Planets here colour personality and first impression.",
  "Savings, speech, food and family cohesion. A strong 2nd lord steadies wealth.",
  "Siblings, courage, short travel and craft. A firm 3rd house shows initiative.",
  "Home, vehicles, mother and peace of mind. Benefics here deepen comfort.",
  "Intelligence, study, mantra, children and speculation. A well-placed 5th lord sharpens the mind.",
  "Debt, illness, rivalry and service. A martial 6th helps defeat opposition.",
  "Marriage, contracts and the other. A clean 7th supports partnership.",
  "Longevity, inheritance, secrets and research. The 8th asks for care, not fear.",
  "Father, teacher, pilgrimage and fortune. The 9th is the well of luck in a Tamil chart.",
  "Profession, government, honour and karma. The 10th is the face the world sees.",
  "Income, friends and fulfilment of desire. A strong 11th locks in gains.",
  "Expense, foreign lands, sleep and surrender. Benefics here soften the path of release.",
];

const PLANET_VOICE_TA: Record<string, string> = {
  sun: "சூரியன் ஆன்மா, அதிகாரம், தந்தை. வலுவில் கீர்த்தி; நீசத்தில் அகங்காரம் அல்லது தந்தையுடன் இடைவெளி.",
  moon: "சந்திரன் மனம், தாய், மக்கள் தொடர்பு. சுப ராசியில் அமைதி; நீச/அஸ்தத்தில் உணர்ச்சி அலை.",
  mars: "செவ்வாய் வீரம், நிலம், சகோதரன், அறுவை. உச்சத்தில் துணிவு; தூஸ்தானத்தில் சினமும் காயமும்.",
  mercury: "புதன் அறிவு, வணிகம், பேச்சு. சுபர் அருகில் கல்வி; சூரியனோடு மூழ்கினால் தடுமாற்றம்.",
  jupiter: "குரு தர்மம், குழந்தை, குருநாதர், பொருள். கேந்திர/திரிகோணத்தில் பாக்கியம்; 6-8-12 இல் நம்பிக்கை சோதனை.",
  venus: "சுக்கிரன் கலை, இன்பம், மனைவி/கணவன், வாகனம். சொந்த/உச்சத்தில் சுகம்; நீசத்தில் உறவு இழுபறி.",
  saturn: "சனி பொறுமை, தொழில், தாமதம், தொழிலாளி. உபசயத்தில் நிலைத்த வளர்ச்சி; 1-8 இல் கனம்.",
  rahu: "ராகு வெளிநாடு, தொழில்நுட்பம், ஆசை, புகழ். கேந்திரத்தில் உயர்வு; 8-12 இல் குழப்பம்.",
  ketu: "கேது துறவு, ஆராய்ச்சி, மறை அறிவு. 12 இல் மோக்ஷம்; லக்னத்தில் விலகல்.",
  gulika: "குளிகன் காலம், நோய் நிழல். தூஸ்தானத்தில் கவனம்; சுபப் பார்வையில் தீவிரம் குறையும்.",
};

const PLANET_VOICE_EN: Record<string, string> = {
  sun: "Sun is soul, authority and father. Strong: honour. Weak: ego or distance from father.",
  moon: "Moon is mind, mother and the public. Comfortable signs soothe; combustion or fall stirs tides.",
  mars: "Mars is courage, land, siblings and surgery. Exaltation steels the will; dusthana inflames.",
  mercury: "Mercury is wit, trade and speech. Benefic company educates; combustion scatters focus.",
  jupiter: "Jupiter is dharma, children, teachers and true wealth. Kendra/trikona bless; 6-8-12 test faith.",
  venus: "Venus is art, pleasure, spouse and vehicles. Own/exalt ease life; fall strains bonds.",
  saturn: "Saturn is patience, labour and delay. Upachaya builds slowly; 1st or 8th weigh heavy.",
  rahu: "Rahu is foreign, tech, appetite and fame. In kendra it elevates; in 8/12 it confuses.",
  ketu: "Ketu is release, research and occult skill. In the 12th it frees; in lagna it detaches.",
  gulika: "Gulika shades health and timing. Dusthana needs care; benefic aspect cools it.",
};

const DASA_TA: Record<string, string> = {
  ketu: "கேது தசை — பழையதை விடுதல், ஆன்மீகம், வெளிப்பயணம், உடல் நுட்பம். அவசர முடிவைத் தவிர்க்க.",
  venus: "சுக்கிர தசை — கலை, உறவு, வாகனம், சுக வாழ்க்கை. செலவை அளந்து இன்பம் எடுங்கள்.",
  sun: "சூரிய தசை — அதிகாரம், அரசு, தந்தை, கீர்த்தி. நேர்மை உங்கள் கவசம்.",
  moon: "சந்திர தசை — மனம், வீடு, பொது தொடர்பு, இடப்பெயர்வு. உணர்ச்சியை நேரமாக்குங்கள்.",
  mars: "செவ்வாய் தசை — துணிவு, நிலம், சர்ச்சை, அறுவை/பொறியியல். சினத்தை வேலையாக்குங்கள்.",
  rahu: "ராகு தசை — வெளிநாடு, தொழில்நுட்பம், அரசியல், திடீர் உயர்வு. ஆவலைச் சட்டத்துக்குள் வையுங்கள்.",
  jupiter: "குரு தசை — கல்வி, மந்திரம், புத்திரர், ஆசாரிய ஆசி. தானமும் பாடமும் வளர்க்கும்.",
  saturn: "சனி தசை — பொறுப்பு, தாமதம், கட்டிடம், தொழில் நிலை. பொறுமையே லாபம்.",
  mercury: "புதன் தசை — எழுத்து, வியாபாரம், நண்பர், பயணம். ஒப்பந்தத்தை எழுத்தில் வையுங்கள்.",
};

const DASA_EN: Record<string, string> = {
  ketu: "Ketu dasa — release, spirit, foreign travel, the body as instrument. Avoid rash endings.",
  venus: "Venus dasa — art, union, vehicles, comfort. Enjoy, but meter the spend.",
  sun: "Sun dasa — office, father, honour. Integrity is the armour.",
  moon: "Moon dasa — mind, home, public, moves. Turn feeling into timing.",
  mars: "Mars dasa — drive, land, dispute, surgery/engineering. Put heat into work.",
  rahu: "Rahu dasa — abroad, tech, politics, sudden rise. Keep desire inside the law.",
  jupiter: "Jupiter dasa — study, mantra, children, the teacher’s blessing. Give and learn.",
  saturn: "Saturn dasa — duty, delay, masonry of a career. Patience is profit.",
  mercury: "Mercury dasa — writing, trade, friends, travel. Put contracts on paper.",
};

function lordNote(b: BhavaReport, lang: Lang) {
  const name = planetName(b.lord, lang);
  const place = lang === "ta" ? `${b.lordHouse}-ஆம் இடம்` : `house ${b.lordHouse}`;
  if (KENDRA.includes(b.lordHouse) || [1, 5, 9].includes(b.lordHouse)) {
    return lang === "ta"
      ? `${name} ${place} (கேந்திர/திரிகோணம்) — இந்த பாவத்துக்கு நல்ல ஆதரவு.`
      : `${name} in ${place} (kendra/trikona) supports this house.`;
  }
  if (DUSTHANA.includes(b.lordHouse)) {
    return lang === "ta"
      ? `${name} ${place} (தூஸ்தானம்) — இந்த பாவ விஷயத்தில் முயற்சியும் பரிகாரமும் வேண்டும்.`
      : `${name} in ${place} (dusthana) asks effort and remedies for this house.`;
  }
  return lang === "ta"
    ? `${name} ${place} இல் நிற்கிறார் — முடிவு கிரக தன்மையைப் பொறுத்தது.`
    : `${name} stands in ${place}; results follow that planet’s nature.`;
}

function occNote(b: BhavaReport, lang: Lang) {
  if (b.occupants.length === 0) {
    return lang === "ta" ? "இப்பாவம் காலியாக உள்ளது — அதிபதி நிலையே முக்கியம்." : "Empty house — the lord’s placement leads.";
  }
  const names = b.occupants.map((id) => planetName(id, lang)).join(", ");
  return lang === "ta" ? `இங்கு நிற்போர்: ${names}.` : `Occupants: ${names}.`;
}

export function houseReading(b: BhavaReport, lang: Lang) {
  const title = lang === "ta" ? `${b.house}. ${BHAVA_TA[b.house - 1]}` : `${b.house}. ${BHAVA_EN[b.house - 1]}`;
  const sign = lang === "ta" ? SIGNS_TA[b.sign] : SIGNS_EN[b.sign];
  const base = lang === "ta" ? HOUSE_BASE_TA[b.house - 1] : HOUSE_BASE_EN[b.house - 1];
  const sav =
    lang === "ta"
      ? `சர்வாஷ்டவர்க்கம் ${b.sav} புள்ளி${b.sav >= 30 ? " — வலுவான பாவம்." : b.sav >= 25 ? " — நடுத்தரம்." : " — முயற்சி தேவை."}`
      : `Sarvashtakavarga ${b.sav} bindus${b.sav >= 30 ? " — strong house." : b.sav >= 25 ? " — average." : " — needs effort."}`;
  return {
    title,
    sign,
    body: `${base} ${occNote(b, lang)} ${lordNote(b, lang)} ${sav}`,
  };
}

export function planetReading(g: GrahaReport, lang: Lang) {
  const name = planetName(g.id, lang);
  const sign = lang === "ta" ? SIGNS_TA[g.sign] : SIGNS_EN[g.sign];
  const dig = (lang === "ta" ? DIGNITY_TA : DIGNITY_EN)[g.dignity] ?? g.dignity;
  const voice = (lang === "ta" ? PLANET_VOICE_TA : PLANET_VOICE_EN)[g.id] ?? "";
  const flags: string[] = [];
  if (g.retrograde && g.id !== "rahu" && g.id !== "ketu") flags.push(lang === "ta" ? "வக்ரம்" : "retrograde");
  if (g.combust) flags.push(lang === "ta" ? "அஸ்தம் / மௌட்யம்" : "combust");
  if (g.vargottama) flags.push(lang === "ta" ? "வர்கோத்தமம்" : "vargottama");
  const flagText = flags.length ? ` (${flags.join(", ")})` : "";
  const house = lang === "ta" ? `${g.house}-ஆம் இடம்` : `house ${g.house}`;
  return {
    title: `${name} · ${sign} · ${house}`,
    dignity: dig,
    body: `${voice}${flagText}`,
  };
}

export function dasaReading(lord: string, lang: Lang) {
  return (lang === "ta" ? DASA_TA : DASA_EN)[lord] ?? "";
}

export function chevvaiText(a: Analysis, lang: Lang) {
  if (!a.chevvai.fromLagna && !a.chevvai.fromMoon && !a.chevvai.fromVenus) {
    return lang === "ta"
      ? "லக்னம், சந்திரன், சுக்கிரன் ஆகியவற்றிலிருந்து 2, 4, 7, 8, 12 இடங்களில் செவ்வாய் இல்லை — செவ்வாய் தோஷம் இல்லை."
      : "Mars is not in 2, 4, 7, 8 or 12 from lagna, Moon or Venus — no Chevvai dosham.";
  }
  const bits: string[] = [];
  if (a.chevvai.fromLagna) bits.push(lang === "ta" ? "லக்னத்திலிருந்து" : "from lagna");
  if (a.chevvai.fromMoon) bits.push(lang === "ta" ? "சந்திரனிலிருந்து" : "from Moon");
  if (a.chevvai.fromVenus) bits.push(lang === "ta" ? "சுக்கிரனிலிருந்து" : "from Venus");
  if (a.chevvai.cancelled) {
    return lang === "ta"
      ? `செவ்வாய் ${bits.join(", ")} தோஷ இடத்தில் உண்டு, ஆனால் சொந்த/உச்சம் அல்லது குரு பார்வையால் பரிகாரம்.`
      : `Mars sits in a dosha house ${bits.join(", ")}, but own/exaltation or Jupiter’s aspect cancels it.`;
  }
  return lang === "ta"
    ? `செவ்வாய் தோஷம் உண்டு (${bits.join(", ")}). திருமணப் பொருத்தத்தில் இணைவரின் தோஷத்தையும் ஒப்பிடவும். பரிகாரம்: செவ்வாய்க் கிழமை விரதம், வைரவன் வழிபாடு.`
    : `Chevvai dosham is present (${bits.join(", ")}). Compare with the partner’s Mars. Remedy: Tuesday vrata, Bhairava worship.`;
}

export function sadeSatiText(a: Analysis, lang: Lang) {
  const phaseTa = { rising: "ஏற்றம் (12-ஆம் இடம்)", peak: "உச்சம் (ராசியில்)", setting: "இறக்கம் (2-ஆம் இடம்)", none: "இல்லை" };
  const phaseEn = { rising: "rising (12th)", peak: "peak (over rasi)", setting: "setting (2nd)", none: "none" };
  if (!a.sadeSati.present) {
    const extra = [
      a.sadeSati.ashtama ? (lang === "ta" ? "அஷ்டம சனி நடப்பில் உண்டு." : "Ashtama Sani is running.") : "",
      a.sadeSati.kantaka ? (lang === "ta" ? "கண்டக சனி நடப்பில் உண்டு." : "Kantaka Sani is running.") : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      (lang === "ta" ? "ஏழரைச் சனி இப்போது இல்லை. " : "Sade Sati is not running now. ") + extra
    );
  }
  return lang === "ta"
    ? `ஏழரைச் சனி நடப்பில் — ${phaseTa[a.sadeSati.phase]}. பொறுமை, உடல் கவனிப்பு, சனிக்கிழமை தீபம் உதவும்.`
    : `Sade Sati is running — ${phaseEn[a.sadeSati.phase]}. Patience, health care, Saturday lamp.`;
}

export function gradeLabel(g: "uthamam" | "madhyamam" | "adhamam", lang: Lang) {
  if (g === "uthamam") return lang === "ta" ? "உத்தமம்" : "Uthamam";
  if (g === "madhyamam") return lang === "ta" ? "மத்தியமம்" : "Madhyamam";
  return lang === "ta" ? "அதமம்" : "Adhamam";
}

export function matchVerdict(v: "excellent" | "good" | "average" | "low", lang: Lang) {
  const ta = { excellent: "மிக உத்தமம்", good: "நல்ல பொருத்தம்", average: "மத்தியமம்", low: "குறைவு" };
  const en = { excellent: "Excellent", good: "Good match", average: "Average", low: "Low" };
  return lang === "ta" ? ta[v] : en[v];
}

export function dignityLabel(d: Dignity, lang: Lang) {
  return (lang === "ta" ? DIGNITY_TA : DIGNITY_EN)[d] ?? d;
}
