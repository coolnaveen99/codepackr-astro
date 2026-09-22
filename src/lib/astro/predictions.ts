// Codepackr Astro - Themed life-area predictions (free full phalan)
import { planetName, SIGNS_EN, SIGNS_TA } from "./constants";
import type { Analysis, BhavaReport, Dignity } from "./analysis";
import type { Lang } from "./i18n";
import { DUSTHANA, KENDRA } from "./tables";

export type LifeAreaId =
  | "marriage"
  | "spouseD9"
  | "children"
  | "career"
  | "health"
  | "wealth"
  | "education"
  | "longevity"
  | "foreign"
  | "spirituality";

export type LifeAreaReading = {
  id: LifeAreaId;
  title: string;
  paragraphs: string[];
  tone: "strong" | "mixed" | "needs_effort";
};

const STRONG_DIG: Dignity[] = ["exalt", "moola", "own", "friend"];
const WEAK_DIG: Dignity[] = ["enemy", "debil"];

function bhava(a: Analysis, n: number): BhavaReport {
  return a.bhavas[n - 1];
}

function graha(a: Analysis, id: string) {
  return a.grahas.find((g) => g.id === id);
}

function lordStrength(a: Analysis, house: number): "strong" | "mixed" | "weak" {
  const b = bhava(a, house);
  const g = graha(a, b.lord);
  if (!g) return "mixed";
  const inDust = DUSTHANA.includes(g.house);
  const inKend = KENDRA.includes(g.house);
  if (STRONG_DIG.includes(g.dignity) && !inDust) return "strong";
  if (WEAK_DIG.includes(g.dignity) || (inDust && !inKend)) return "weak";
  return "mixed";
}

function savNote(b: BhavaReport, lang: Lang): string {
  if (lang === "ta") {
    if (b.sav >= 30) return `Sarvashtakavarga ${b.sav} — strong (ta).`.replace("strong (ta).", `சர்வாஷ்டவர்க்கம் ${b.sav} — வலுவான பாவம்.`);
    if (b.sav >= 25) return `சர்வாஷ்டவர்க்கம் ${b.sav} — நடுத்தரம்.`;
    return `சர்வாஷ்டவர்க்கம் ${b.sav} — முயற்சி தேவை.`;
  }
  if (b.sav >= 30) return `Sarvashtakavarga ${b.sav} — strong house.`;
  if (b.sav >= 25) return `Sarvashtakavarga ${b.sav} — average.`;
  return `Sarvashtakavarga ${b.sav} — needs effort.`;
}

function dasaHint(a: Analysis, lang: Lang, relevant: string[]): string {
  if (!a.dasaNow) return "";
  const m = a.dasaNow.maha;
  const hit = relevant.includes(m);
  if (lang === "ta") {
    return hit
      ? `தற்போதைய ${planetName(m, "ta")} மகாதசை இந்த பகுதிக்கு முக்கியம் — காலத்தைப் பயன்படுத்துங்கள்.`
      : `தற்போதைய தசை ${planetName(m, "ta")}–${planetName(a.dasaNow.bhukti, "ta")}; இந்த பகுதியின் அதிபதி தசையில் முடிவுகள் விரைவு பெறும்.`;
  }
  return hit
    ? `Current ${planetName(m, "en")} mahadasa is key for this area — use the period wisely.`
    : `Current dasa is ${planetName(m, "en")}–${planetName(a.dasaNow.bhukti, "en")}; results for this area quicken when its lord runs.`;
}

function signOf(b: BhavaReport, lang: Lang) {
  return lang === "ta" ? SIGNS_TA[b.sign] : SIGNS_EN[b.sign];
}

export function marriagePhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h7 = bhava(a, 7);
  const h2 = bhava(a, 2);
  const h5 = bhava(a, 5);
  const s7 = lordStrength(a, 7);
  const tone = s7 === "strong" ? "strong" : s7 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`7-ஆம் பாவம் ${signOf(h7, "ta")} இல்; அதிபதி ${planetName(h7.lord, "ta")} ${h7.lordHouse}-ஆம் இடத்தில். ${savNote(h7, "ta")}`);
    if (s7 === "strong") paragraphs.push("திருமணம் / கூட்டாண்மைக்கு ஆதரவு உண்டு. இணக்கமும் பொறுப்பும் வளர வாய்ப்பு.");
    else if (s7 === "weak") paragraphs.push("திருமண விஷயத்தில் பொறுமையும் தெளிவும் தேவை. செவ்வாய் தோஷம் இருந்தால் பொருத்தத்தில் ஒப்பிடவும்.");
    else paragraphs.push("திருமண வாழ்க்கை முயற்சியால் மேம்படும். குடும்ப ஆதரவும் உரையாடலும் முக்கியம்.");
    if (a.chevvai.present && !a.chevvai.cancelled) paragraphs.push("செவ்வாய் தோஷம் குறிப்பு: இணைவரின் ஜாதகத்துடன் ஒப்பிட்டு பரிகாரம் பாருங்கள்.");
    paragraphs.push(`2 & 5 பாவங்கள் குடும்ப ஒற்றுமை / புத்திர பாக்கியத்தைக் காட்டுகின்றன (${planetName(h2.lord, "ta")}, ${planetName(h5.lord, "ta")}).`);
    const d = dasaHint(a, "ta", ["venus", "jupiter", "moon", h7.lord]);
    if (d) paragraphs.push(d);
  } else {
    paragraphs.push(`7th house in ${signOf(h7, "en")}; lord ${planetName(h7.lord, "en")} in house ${h7.lordHouse}. ${savNote(h7, "en")}`);
    if (s7 === "strong") paragraphs.push("Marriage and partnership are supported. Harmony and responsibility can grow.");
    else if (s7 === "weak") paragraphs.push("Partnership needs patience and clarity. If Chevvai is present, compare with the partner chart.");
    else paragraphs.push("Married life improves with effort. Family support and honest talk matter.");
    if (a.chevvai.present && !a.chevvai.cancelled) paragraphs.push("Chevvai note: compare with the partner and consider traditional remedies.");
    paragraphs.push(`Houses 2 & 5 speak to family cohesion and children (lords ${planetName(h2.lord, "en")}, ${planetName(h5.lord, "en")}).`);
    const d = dasaHint(a, "en", ["venus", "jupiter", "moon", h7.lord]);
    if (d) paragraphs.push(d);
  }
  return { id: "marriage", title: lang === "ta" ? "திருமணம் & கூட்டாண்மை" : "Marriage & partnership", paragraphs, tone };
}

export function careerPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h10 = bhava(a, 10);
  const h6 = bhava(a, 6);
  const s10 = lordStrength(a, 10);
  const tone = s10 === "strong" ? "strong" : s10 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`10-ஆம் பாவம் ${signOf(h10, "ta")}; அதிபதி ${planetName(h10.lord, "ta")} ${h10.lordHouse}-இல். ${savNote(h10, "ta")}`);
    if (s10 === "strong") paragraphs.push("தொழில் / கீர்த்திக்கு நல்ல ஆதரவு. பொறுப்புள்ள பதவி அல்லது சுயதொழில் வாய்ப்பு.");
    else if (s10 === "weak") paragraphs.push("தொழில் பாதையில் மாற்றம் அல்லது கூடுதல் முயற்சி தேவை. திறன் வளர்ப்பு உதவும்.");
    else paragraphs.push("தொழில் நிலை முயற்சியால் உயரும். அரசு / பெரிய நிறுவனம் / சுயதொழில் ஆகியவற்றைச் சூழலுக்கு ஏற்ப தேர்ந்தெடுக்கவும்.");
    paragraphs.push(`6-ஆம் பாவம் சேவை / போட்டியைக் காட்டுகிறது (அதிபதி ${planetName(h6.lord, "ta")}).`);
    const d = dasaHint(a, "ta", ["sun", "saturn", "mercury", "jupiter", h10.lord]);
    if (d) paragraphs.push(d);
  } else {
    paragraphs.push(`10th house in ${signOf(h10, "en")}; lord ${planetName(h10.lord, "en")} in house ${h10.lordHouse}. ${savNote(h10, "en")}`);
    if (s10 === "strong") paragraphs.push("Career and reputation are supported. Responsible roles or self-employment can work.");
    else if (s10 === "weak") paragraphs.push("Career path may need change or extra effort. Skill-building helps.");
    else paragraphs.push("Professional standing rises with effort. Choose government, corporate, or self-work to suit the chart.");
    paragraphs.push(`6th house shows service and competition (lord ${planetName(h6.lord, "en")}).`);
    const d = dasaHint(a, "en", ["sun", "saturn", "mercury", "jupiter", h10.lord]);
    if (d) paragraphs.push(d);
  }
  return { id: "career", title: lang === "ta" ? "தொழில் & கீர்த்தி" : "Career & reputation", paragraphs, tone };
}

export function healthPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h1 = bhava(a, 1);
  const h6 = bhava(a, 6);
  const h8 = bhava(a, 8);
  const s1 = lordStrength(a, 1);
  const tone = s1 === "strong" ? "strong" : s1 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`லக்ன பாவம் ${signOf(h1, "ta")}; அதிபதி ${planetName(h1.lord, "ta")}. ${savNote(h1, "ta")}`);
    if (s1 === "strong") paragraphs.push("உடல் நலம் பொதுவாக ஆதரவு பெறும். ஒழுங்கான உணவு / உடற்பயிற்சி நிலைநிறுத்தும்.");
    else paragraphs.push("உடல் கவனிப்பு முக்கியம். 6 & 8 பாவங்களைக் கவனித்து மருத்துவ ஆலோசனையைத் தவிர்க்க வேண்டாம்.");
    paragraphs.push(`6-ஆம் (${planetName(h6.lord, "ta")}) நோய்/கடன்; 8-ஆம் (${planetName(h8.lord, "ta")}) ஆயுள்/மறைவு — பயம் அல்ல, கவனம்.`);
    if (a.sadeSati.present) paragraphs.push("ஏழரைச் சனி காலத்தில் உடல் / மன அழுத்தம் கூடலாம் — ஓய்வும் சனிக்கிழமை வழிபாடும் உதவும்.");
  } else {
    paragraphs.push(`Lagna house in ${signOf(h1, "en")}; lord ${planetName(h1.lord, "en")}. ${savNote(h1, "en")}`);
    if (s1 === "strong") paragraphs.push("Vitality is generally supported. Steady food and exercise help lock it in.");
    else paragraphs.push("Health care matters. Watch houses 6 & 8; do not skip medical advice when needed.");
    paragraphs.push(`6th (lord ${planetName(h6.lord, "en")}) shows illness/debt; 8th (lord ${planetName(h8.lord, "en")}) longevity/secrets — caution, not fear.`);
    if (a.sadeSati.present) paragraphs.push("During Sade Sati, stress may rise — rest and Saturday observance help.");
  }
  return { id: "health", title: lang === "ta" ? "உடல் நலம்" : "Health & vitality", paragraphs, tone };
}

export function wealthPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h2 = bhava(a, 2);
  const h11 = bhava(a, 11);
  const h9 = bhava(a, 9);
  const s2 = lordStrength(a, 2);
  const s11 = lordStrength(a, 11);
  const tone = s2 === "strong" || s11 === "strong" ? "strong" : s2 === "weak" && s11 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`2-ஆம் (சேமிப்பு) அதிபதி ${planetName(h2.lord, "ta")}; 11-ஆம் (லாபம்) அதிபதி ${planetName(h11.lord, "ta")}. ${savNote(h2, "ta")} ${savNote(h11, "ta")}`);
    if (tone === "strong") paragraphs.push("பொருள் வரவுக்கு ஆதரவு உண்டு. சேமிப்பும் முதலீடும் ஒழுங்காக வைத்தால் நிலைக்கும்.");
    else if (tone === "needs_effort") paragraphs.push("செலவு கட்டுப்பாடு தேவை. படிப்படியான சேமிப்பு திட்டம் உதவும்.");
    else paragraphs.push("வருமானம் முயற்சிக்கு ஏற்ப வளரும். 9-ஆம் பாவ பாக்கியம் (அதிபதி " + planetName(h9.lord, "ta") + ") ஆதரவு தரலாம்.");
    const d = dasaHint(a, "ta", ["jupiter", "venus", "mercury", h2.lord, h11.lord]);
    if (d) paragraphs.push(d);
  } else {
    paragraphs.push(`2nd (savings) lord ${planetName(h2.lord, "en")}; 11th (gains) lord ${planetName(h11.lord, "en")}. ${savNote(h2, "en")} ${savNote(h11, "en")}`);
    if (tone === "strong") paragraphs.push("Wealth inflow is supported. Steady saving and investment lock results.");
    else if (tone === "needs_effort") paragraphs.push("Spending discipline is needed. A gradual savings plan helps.");
    else paragraphs.push(`Income grows with effort. 9th-house fortune (lord ${planetName(h9.lord, "en")}) can support.`);
    const d = dasaHint(a, "en", ["jupiter", "venus", "mercury", h2.lord, h11.lord]);
    if (d) paragraphs.push(d);
  }
  return { id: "wealth", title: lang === "ta" ? "செல்வம் & வருமானம்" : "Wealth & income", paragraphs, tone };
}

export function educationPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h4 = bhava(a, 4);
  const h5 = bhava(a, 5);
  const h9 = bhava(a, 9);
  const s5 = lordStrength(a, 5);
  const tone = s5 === "strong" ? "strong" : s5 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`5-ஆம் (புத்தி/கல்வி) அதிபதி ${planetName(h5.lord, "ta")}; 4 & 9 ஆதரவு (${planetName(h4.lord, "ta")}, ${planetName(h9.lord, "ta")}). ${savNote(h5, "ta")}`);
    if (s5 === "strong") paragraphs.push("கற்றல் / தேர்வு / ஆராய்ச்சிக்கு நல்ல ஆதரவு. மந்திரம் அல்லது உயர்கல்வி வாய்ப்பு.");
    else paragraphs.push("படிப்பில் நிலைத்த முயற்சி தேவை. குரு ஆசிர்வாதமும் ஒழுங்கான பயிற்சியும் உதவும்.");
  } else {
    paragraphs.push(`5th (intellect/study) lord ${planetName(h5.lord, "en")}; 4 & 9 support (${planetName(h4.lord, "en")}, ${planetName(h9.lord, "en")}). ${savNote(h5, "en")}`);
    if (s5 === "strong") paragraphs.push("Learning, exams, and research are supported. Mantra or higher study can flourish.");
    else paragraphs.push("Study needs steady effort. Teacher guidance and routine practice help.");
  }
  return { id: "education", title: lang === "ta" ? "கல்வி & புத்தி" : "Education & intellect", paragraphs, tone };
}

export function longevityPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h8 = bhava(a, 8);
  const h1 = bhava(a, 1);
  const tone = lordStrength(a, 8) === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`8-ஆம் பாவம் ஆயுள் / மரபு / ஆராய்ச்சி — அதிபதி ${planetName(h8.lord, "ta")} ${h8.lordHouse}-இல். ${savNote(h8, "ta")}`);
    paragraphs.push("இது பயம் அல்ல; கவனமும் ஆரோக்கிய ஒழுங்கும் போதும். லக்ன அதிபதி (" + planetName(h1.lord, "ta") + ") வலிமை உயிர்ச்சக்தியைக் காட்டும்.");
    paragraphs.push("நீண்டகால திட்டம், காப்பீடு, மரபுச் சொத்து ஆவணங்கள் ஒழுங்காக வைக்கவும்.");
  } else {
    paragraphs.push(`8th house rules longevity, inheritance, research — lord ${planetName(h8.lord, "en")} in house ${h8.lordHouse}. ${savNote(h8, "en")}`);
    paragraphs.push(`This asks care, not fear. Lagna lord (${planetName(h1.lord, "en")}) strength shows vitality.`);
    paragraphs.push("Keep long-term plans, insurance, and inheritance papers in order.");
  }
  return { id: "longevity", title: lang === "ta" ? "ஆயுள் & மரபு" : "Longevity & inheritance", paragraphs, tone };
}

export function foreignPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h12 = bhava(a, 12);
  const h9 = bhava(a, 9);
  const h3 = bhava(a, 3);
  const s12 = lordStrength(a, 12);
  const tone = s12 === "strong" ? "strong" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`12-ஆம் (வெளிநாடு/செலவு) அதிபதி ${planetName(h12.lord, "ta")}; 9-ஆம் தீர்த்த யாத்திரை (${planetName(h9.lord, "ta")}); 3-ஆம் குறு பயணம் (${planetName(h3.lord, "ta")}).`);
    if (s12 === "strong" || h12.occupants.length > 0) paragraphs.push("வெளிநாடு / தொலைதூர வாழ்க்கைக்கு வாய்ப்பு உண்டு. செலவு கண்காணிப்பு தேவை.");
    else paragraphs.push("வெளிநாட்டு வாழ்க்கை கட்டாயம் அல்ல; பயணம் / இறக்குமதி தொடர்பு வாய்ப்பு இருக்கலாம்.");
  } else {
    paragraphs.push(`12th (foreign/expense) lord ${planetName(h12.lord, "en")}; 9th pilgrimage/fortune (${planetName(h9.lord, "en")}); 3rd short travel (${planetName(h3.lord, "en")}).`);
    if (s12 === "strong" || h12.occupants.length > 0) paragraphs.push("Foreign stay or distant life is possible. Watch expenses.");
    else paragraphs.push("Foreign settlement is not fixed; travel or overseas links may still appear.");
  }
  return { id: "foreign", title: lang === "ta" ? "வெளிநாடு & பயணம்" : "Foreign & travel", paragraphs, tone };
}

export function spiritualityPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h9 = bhava(a, 9);
  const h12 = bhava(a, 12);
  const h5 = bhava(a, 5);
  const s9 = lordStrength(a, 9);
  const tone = s9 === "strong" ? "strong" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`9-ஆம் (தர்மம்/குரு) அதிபதி ${planetName(h9.lord, "ta")}; 5-ஆம் மந்திரம் (${planetName(h5.lord, "ta")}); 12-ஆம் மோக்ஷம் (${planetName(h12.lord, "ta")}). ${savNote(h9, "ta")}`);
    paragraphs.push(s9 === "strong" ? "குரு ஆசிர்வாதம் / தீர்த்த யாத்திரை / சாஸ்திர ஆர்வம் ஆதரவு பெறும்." : "ஆன்மீகப் பயிற்சி முயற்சியால் வளரும். நியமமான ஜபம் உதவும்.");
  } else {
    paragraphs.push(`9th (dharma/guru) lord ${planetName(h9.lord, "en")}; 5th mantra (${planetName(h5.lord, "en")}); 12th moksha (${planetName(h12.lord, "en")}). ${savNote(h9, "en")}`);
    paragraphs.push(s9 === "strong" ? "Guru grace, pilgrimage, and scriptural interest are supported." : "Spiritual practice grows with effort. Steady japa helps.");
  }
  return { id: "spirituality", title: lang === "ta" ? "ஆன்மீகம் & தர்மம்" : "Spirituality & dharma", paragraphs, tone };
}

export function childrenPhalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h5 = bhava(a, 5);
  const s5 = lordStrength(a, 5);
  const jup = graha(a, "jupiter");
  const tone = s5 === "strong" ? "strong" : s5 === "weak" ? "needs_effort" : "mixed";
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`5-ஆம் பாவம் புத்திரஸ்தானம் (${signOf(h5, "ta")}); அதிபதி ${planetName(h5.lord, "ta")} ${h5.lordHouse}-ஆம் இடத்தில். ${savNote(h5, "ta")}`);
    paragraphs.push(`புத்திரகாரகர் குரு பகவான் நிலை: ${jup ? planetName("jupiter", "ta") + " " + jup.house + "-ஆம் பாவகத்தில்" : "குரு சுப பார்வை நன்று"}.`);
    if (s5 === "strong") {
      paragraphs.push("குழந்தை பாக்கியம் நன்முறையில் அமையும். பிள்ளைகளின் அறிவு, கல்வி மற்றும் பண்பு குடும்பத்திற்கு பெருமை சேர்க்கும்.");
    } else if (s5 === "weak") {
      paragraphs.push("புத்திர பாக்கியம் தாமதப்படலாம் அல்லது கூடுதல் கவனம் தேவைப்படலாம். திருச்செந்தூர் முருகன் அல்லது குரு பகவான் வழிபாடு மன அமைதி தரும்.");
    } else {
      paragraphs.push("புத்திர வழி ஆதரவும் மகிழ்ச்சியும் உண்டு. பிள்ளைகளின் விருப்பங்களை மதித்து வழிகாட்டுவது சிறந்தது.");
    }
  } else {
    paragraphs.push(`5th house rules progeny, intelligence & merits (${signOf(h5, "en")}); lord ${planetName(h5.lord, "en")} in house ${h5.lordHouse}. ${savNote(h5, "en")}`);
    paragraphs.push(`Putrakaraka Jupiter status: ${jup ? planetName("jupiter", "en") + " in house " + jup.house : "Jupiter's grace supports children"}.`);
    if (s5 === "strong") {
      paragraphs.push("Blessings of progeny are well supported. Children bring joy, academic achievement, and upright moral character.");
    } else if (s5 === "weak") {
      paragraphs.push("Timing of children may require patience and medical or spiritual care. Lord Muruga and Guru prayers provide calm assurance.");
    } else {
      paragraphs.push("Children's welfare progresses positively with balanced guidance and supportive family atmosphere.");
    }
  }
  return { id: "children", title: lang === "ta" ? "புத்திர பாக்கியம் & குழந்தைகள்" : "Progeny & Children", paragraphs, tone };
}

export function spouseD9Phalan(a: Analysis, lang: Lang): LifeAreaReading {
  const h7 = bhava(a, 7);
  const ven = graha(a, "venus");
  const jup = graha(a, "jupiter");
  const paragraphs: string[] = [];
  if (lang === "ta") {
    paragraphs.push(`நவாம்ச (D9) மற்றும் 7-ஆம் பாவ ஆய்வு மூலம் அமையும் துணைவரின் குணம், குடும்பப் பின்னணி கணிக்கப்படுகிறது.`);
    paragraphs.push(`களத்திரகாரகர் சுக்கிரன் ${ven?.house ?? 7}-ஆம் பாவத்திலும், குரு ${jup?.house ?? 1}-ஆம் பாவத்திலும் அமர்ந்துள்ளனர்.`);
    paragraphs.push("துணைவர் பொறுப்புள்ள பண்பும், குடும்ப நலம் காக்கும் அக்கறையும் கொண்டவராக அமைவர். பரஸ்பர மரியாதை மற்றும் நேர்மையான உரையாடல் தாம்பத்ய ஒற்றுமையை உயர்த்தும்.");
    if (a.chevvai.present) {
      paragraphs.push("செவ்வாய் அமைப்பிற்கு ஏற்ப மனக்கசப்புகளை தவிர்த்து, அமைதியான கலந்தாலோசனையை கடைபிடிப்பது நலம்.");
    }
  } else {
    paragraphs.push("D9 Navamsa and 7th Bhava reveal the innate nature, temperament, and cultural background of the life partner.");
    paragraphs.push(`Kalathrakaraka Venus is in house ${ven?.house ?? 7}, while Jupiter is in house ${jup?.house ?? 1}.`);
    paragraphs.push("The partner is likely to value duty, dignity, and family well-being. Transparent mutual communication ensures lasting marital harmony.");
    if (a.chevvai.present) {
      paragraphs.push("With active Mars influence, practicing patient listening and calm consensus helps dissolve minor frictions.");
    }
  }
  return { id: "spouseD9", title: lang === "ta" ? "நவாம்ச துணைவர் குணம் & தாம்பத்யம்" : "Spouse Character & Navamsa", paragraphs, tone: "mixed" };
}

export function allLifeAreas(a: Analysis, lang: Lang): LifeAreaReading[] {
  return [
    marriagePhalan(a, lang),
    spouseD9Phalan(a, lang),
    childrenPhalan(a, lang),
    careerPhalan(a, lang),
    wealthPhalan(a, lang),
    healthPhalan(a, lang),
    educationPhalan(a, lang),
    longevityPhalan(a, lang),
    foreignPhalan(a, lang),
    spiritualityPhalan(a, lang),
  ];
}
