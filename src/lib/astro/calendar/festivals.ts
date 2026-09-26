// Codepackr Astro — Classical Rule-Driven Festival & Observance Engine
// Calculates Tamil festivals, Vrathams, and observances strictly from astronomical rules (no static date tables).

export interface FestivalRuleMatch {
  id: string;
  nameTa: string;
  nameEn: string;
  type: "major_festival" | "vratham" | "tithi_observance" | "sankranti";
  deity?: string;
  significanceTa: string;
  significanceEn: string;
}

export interface DayFestivalContext {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0=Sunday, 1=Monday... 6=Saturday
  tamilMonthIndex: number; // 0=Chithirai, 1=Vaikasi ... 11=Panguni
  tamilDay: number;
  tithiAtSunrise: number; // 0 to 29 (0=Shukla Prathama, 14=Pournami, 29=Amavasya)
  tithisDuringDay: number[]; // All tithis active between 00:00 and 24:00
  nakshatraAtSunrise: number; // 0 to 26
  nakshatrasDuringDay: number[];
  moonPhaseDegrees: number; // 0 to 360 (0=New Moon, 180=Full Moon)
  sunRasi: number; // 0=Mesha ... 11=Meena
  moonRasi: number; // 0=Mesha ... 11=Meena
  isMonthFirstDay: boolean; // Sun ingress occurs today
}

/**
 * Evaluates all classical festival and observance rules for the given astronomical context.
 */
export function evaluateFestivalsForDay(ctx: DayFestivalContext): FestivalRuleMatch[] {
  const matches: FestivalRuleMatch[] = [];
  const tithis = ctx.tithisDuringDay;
  const naks = ctx.nakshatrasDuringDay;

  const hasTithi = (t: number) => tithis.includes(t) || ctx.tithiAtSunrise === t;
  const hasNak = (n: number) => naks.includes(n) || ctx.nakshatraAtSunrise === n;

  // -------------------------------------------------------------
  // 1. TAMIL MONTH SANKRANTI / MASAPIRAPPU (மாதப் பிறப்பு)
  // -------------------------------------------------------------
  if (ctx.isMonthFirstDay || ctx.tamilDay === 1) {
    if (ctx.tamilMonthIndex === 0) {
      matches.push({
        id: "tamil-new-year",
        nameTa: "தமிழ்ப் புத்தாண்டு (சித்திரை 1)",
        nameEn: "Tamil New Year (Puthandu / Chithirai 1)",
        type: "major_festival",
        significanceTa: "சூரியன் மேஷ ராசியில் பிரவேசிக்கும் தமிழ் ஆண்டின் முதல் நாள்.",
        significanceEn: "Sun ingress into Aries (Mesha), marking the dawn of the Tamil Solar New Year.",
      });
    } else if (ctx.tamilMonthIndex === 3) {
      matches.push({
        id: "aadi-pirappu",
        nameTa: "ஆடிப் பிறப்பு (ஆடி 1)",
        nameEn: "Aadi Pirappu (Aadi 1)",
        type: "major_festival",
        significanceTa: "தட்சிணாயன புண்ணிய கால ஆரம்பம் மற்றும் மங்களகரமான ஆடி மாதப் பிறப்பு.",
        significanceEn: "Beginning of Dakshinayana solar half and auspicious month of Aadi.",
      });
    } else if (ctx.tamilMonthIndex === 9) {
      matches.push({
        id: "pongal-makara-sankranti",
        nameTa: "தைப்பொங்கல் / மகர சங்கராந்தி (தை 1)",
        nameEn: "Thai Pongal / Makara Sankranti (Thai 1)",
        type: "major_festival",
        deity: "Surya",
        significanceTa: "சூரியன் மகர ராசியில் பிரவேசிக்கும் உத்தராயண புண்ணிய கால அறுவடைத் திருநாள்.",
        significanceEn: "Sun ingress into Capricorn (Makara), marking Uttarayana and the Tamil Harvest Festival.",
      });
    } else {
      matches.push({
        id: `sankranti-month-${ctx.tamilMonthIndex}`,
        nameTa: "மாதப் பிறப்பு (மாத சங்கிராந்தி)",
        nameEn: "Tamil Month Ingress (Sankranti)",
        type: "sankranti",
        significanceTa: "சூரியன் புதிய ராசியில் பிரவேசிக்கும் மங்களகரமான மாத ஆரம்ப நாள்.",
        significanceEn: "Solar transit into a new sidereal zodiac sign.",
      });
    }
  }

  // Mattu Pongal & Kaanum Pongal
  if (ctx.tamilMonthIndex === 9 && ctx.tamilDay === 2) {
    matches.push({
      id: "mattu-pongal",
      nameTa: "மாட்டுப் பொங்கல்",
      nameEn: "Mattu Pongal",
      type: "major_festival",
      significanceTa: "உழவுக்கும் கால்நடைகளுக்கும் நன்றி செலுத்தும் பாரம்பரியத் திருநாள்.",
      significanceEn: "Traditional celebration thanking cattle and agricultural bulls.",
    });
  }
  if (ctx.tamilMonthIndex === 9 && ctx.tamilDay === 3) {
    matches.push({
      id: "kaanum-pongal",
      nameTa: "காணும் பொங்கல்",
      nameEn: "Kaanum Pongal",
      type: "major_festival",
      significanceTa: "உற்றார் உறவினர்களைக் கண்டு மகிழும் குடும்ப நாள்.",
      significanceEn: "Social festival of visiting family, elders, and reunions.",
    });
  }

  // Aadi 18 (Aadi Perukku)
  if (ctx.tamilMonthIndex === 3 && ctx.tamilDay === 18) {
    matches.push({
      id: "aadi-perukku",
      nameTa: "ஆடிப் பெருக்கு (ஆடி 18)",
      nameEn: "Aadi Perukku (Aadi 18)",
      type: "major_festival",
      significanceTa: "காவிரித் தாய் மற்றும் நதிவளத்தை போற்றும் மங்களகரமான திருநாள்.",
      significanceEn: "Celebration of River Cauvery, water prosperity, and fertility.",
    });
  }

  // -------------------------------------------------------------
  // 2. AMAVASAI (அமாவாசை - Tithi 29 / 30)
  // -------------------------------------------------------------
  if (hasTithi(29)) {
    if (ctx.tamilMonthIndex === 9) {
      matches.push({
        id: "thai-amavasai",
        nameTa: "தை அமாவாசை",
        nameEn: "Thai Amavasai",
        type: "major_festival",
        significanceTa: "முன்னோர்களுக்கு தர்ப்பணம் அளிக்க உன்னதமான உத்தராயண அமாவாசை.",
        significanceEn: "Highly sacred New Moon in Thai month for ancestral tarpanam.",
      });
    } else if (ctx.tamilMonthIndex === 3) {
      matches.push({
        id: "aadi-amavasai",
        nameTa: "ஆடி அமாவாசை",
        nameEn: "Aadi Amavasai",
        type: "major_festival",
        significanceTa: "தட்சிணாயனத்தில் பித்ருக்களுக்கு வழிபட மிகச் சிறந்த புனித அமாவாசை.",
        significanceEn: "Sacred New Moon in Aadi month dedicated to ancestral offerings.",
      });
    } else if (ctx.tamilMonthIndex === 5) {
      matches.push({
        id: "mahalaya-amavasai",
        nameTa: "மஹாளய அமாவாசை",
        nameEn: "Mahalaya Amavasai",
        type: "major_festival",
        significanceTa: "புரட்டாசி மாத மஹாளய பட்சத்தின் நிறைவு நாள், சகல பித்ருக்களின் ஆசி பெறும் நாள்.",
        significanceEn: "Culmination of Mahalaya Paksha in Purattasi month.",
      });
    } else {
      matches.push({
        id: "sarva-amavasai",
        nameTa: "அமாவாசை",
        nameEn: "Amavasai (New Moon)",
        type: "tithi_observance",
        significanceTa: "மாதாந்திர பித்ரு தர்ப்பணத்திற்கான அமாவாசை திதி.",
        significanceEn: "Monthly New Moon day observed with ancestral prayers.",
      });
    }
  }

  // -------------------------------------------------------------
  // 3. POURNAMI (பௌர்ணமி - Tithi 14 / 15)
  // -------------------------------------------------------------
  if (hasTithi(14)) {
    if (ctx.tamilMonthIndex === 0) {
      matches.push({
        id: "chitra-pournami",
        nameTa: "சித்ரா பௌர்ணமி",
        nameEn: "Chitra Pournami",
        type: "major_festival",
        deity: "Chitragupta",
        significanceTa: "சித்திரை மாத முழுநிலவு நாள்; சித்திரகுப்தர் மற்றும் கிரிவல வழிபாடு.",
        significanceEn: "Full Moon of Chithirai month observed with Girivalam and Chitragupta worship.",
      });
    } else if (ctx.tamilMonthIndex === 1) {
      matches.push({
        id: "vaikasi-visakam",
        nameTa: "வைகாசி விசாகம் / பௌர்ணமி",
        nameEn: "Vaikasi Visakam / Pournami",
        type: "major_festival",
        deity: "Lord Murugan",
        significanceTa: "எம்பெருமான் முருகப்பெருமானின் அவதாரத் திருநாள்.",
        significanceEn: "Incarnation day of Lord Muruga celebrated on Visakha / Pournami in Vaikasi.",
      });
    } else if (ctx.tamilMonthIndex === 2) {
      matches.push({
        id: "aani-pournami",
        nameTa: "ஆனிப் பௌர்ணமி",
        nameEn: "Aani Pournami",
        type: "tithi_observance",
        significanceTa: "ஆனி மாத முழுநிலவு நாள்.",
        significanceEn: "Auspicious Full Moon in Aani month.",
      });
    } else if (ctx.tamilMonthIndex === 4) {
      matches.push({
        id: "aavani-avittam",
        nameTa: "ஆவணி அவிட்டம் / பௌர்ணமி",
        nameEn: "Aavani Avittam / Pournami",
        type: "major_festival",
        significanceTa: "உபாகர்மா பூணூல் மாற்றுதல் மற்றும் காயத்ரி ஜப நாள்.",
        significanceEn: "Sacred Upakarma sacred thread renewal day and Full Moon of Aavani.",
      });
    } else if (ctx.tamilMonthIndex === 7) {
      matches.push({
        id: "karthigai-deepam",
        nameTa: "கார்த்திகை தீபம் / பௌர்ணமி",
        nameEn: "Karthigai Deepam / Pournami",
        type: "major_festival",
        deity: "Lord Shiva / Arunachala",
        significanceTa: "திருவண்ணாமலையில் மகா தீபம் ஏற்றப்படும் அக்னித் தத்துவத் திருநாள்.",
        significanceEn: "Grand beacon festival of divine light celebrating Lord Shiva as Arunachaleshwara.",
      });
    } else if (ctx.tamilMonthIndex === 8) {
      matches.push({
        id: "arudra-darisanam",
        nameTa: "மார்கழி திருவாதிரை / பௌர்ணமி",
        nameEn: "Arudra Darisanam / Margazhi Pournami",
        type: "major_festival",
        deity: "Lord Nataraja",
        significanceTa: "நடராஜப் பெருமானின் ஆனந்த தாண்டவ தரிசன திருநாள்.",
        significanceEn: "Cosmic dance of Lord Nataraja celebrated on Ardra Nakshatra / Pournami.",
      });
    } else if (ctx.tamilMonthIndex === 9) {
      matches.push({
        id: "thai-poosam",
        nameTa: "தைப்பூசம் / பௌர்ணமி",
        nameEn: "Thai Poosam / Pournami",
        type: "major_festival",
        deity: "Lord Murugan",
        significanceTa: "முருகப்பெருமானுக்கு உகந்த தைப்பூசத் திருநாள்.",
        significanceEn: "Sacred festival of Lord Murugan receiving the divine Vel from Goddess Parvati.",
      });
    } else if (ctx.tamilMonthIndex === 10) {
      matches.push({
        id: "masi-magam",
        nameTa: "மாசி மகம் / பௌர்ணமி",
        nameEn: "Masi Magam / Pournami",
        type: "major_festival",
        significanceTa: "தீர்த்தவாரி மற்றும் புனித நீராடலுக்கு உன்னதமான பௌர்ணமி நாள்.",
        significanceEn: "Holy dip festival when deities are taken to sacred water bodies and seas.",
      });
    } else if (ctx.tamilMonthIndex === 11) {
      matches.push({
        id: "panguni-uthiram",
        nameTa: "பங்குனி உத்திரம் / பௌர்ணமி",
        nameEn: "Panguni Uthiram / Pournami",
        type: "major_festival",
        deity: "Divine Couples",
        significanceTa: "தெய்வீகத் திருமணங்கள் நடைபெற்ற உன்னத பௌர்ணமித் திருநாள்.",
        significanceEn: "Celebration of celestial divine weddings on Uttara Phalguni / Pournami in Panguni.",
      });
    } else {
      matches.push({
        id: "sarva-pournami",
        nameTa: "பௌர்ணமி",
        nameEn: "Pournami (Full Moon)",
        type: "tithi_observance",
        significanceTa: "மங்களகரமான முழுநிலவு நாள்; அம்பிகை மற்றும் சத்தியநாராயண பூஜை.",
        significanceEn: "Auspicious Full Moon day observed for Goddess worship and Satyanarayana Puja.",
      });
    }
  }

  // -------------------------------------------------------------
  // 4. EKADASHI (ஏகாதசி விரதம் - Tithi 10 / 25)
  // -------------------------------------------------------------
  if (hasTithi(10) || hasTithi(25)) {
    const isShukla = hasTithi(10);
    if (ctx.tamilMonthIndex === 8 && isShukla) {
      matches.push({
        id: "vaikunta-ekadashi",
        nameTa: "வைகுண்ட ஏகாதசி (சொர்க்கவாசல் திறப்பு)",
        nameEn: "Vaikunta Ekadashi",
        type: "major_festival",
        deity: "Lord Maha Vishnu",
        significanceTa: "மார்கழி சுக்ல பட்ச ஏகாதசி; வைகுண்ட வாசல் திறக்கப்படும் மகா புண்ணிய நாள்.",
        significanceEn: "Grandest Vaishnava festival when the gates of Vaikunta are opened.",
      });
    } else {
      matches.push({
        id: isShukla ? "shukla-ekadashi" : "krishna-ekadashi",
        nameTa: isShukla ? "சுக்ல பட்ச ஏகாதசி" : "கிருஷ்ண பட்ச ஏகாதசி",
        nameEn: isShukla ? "Shukla Paksha Ekadashi" : "Krishna Paksha Ekadashi",
        type: "vratham",
        deity: "Lord Vishnu",
        significanceTa: "மகாவிஷ்ணுவின் திருவருள் பெற உபவாசம் இருக்கும் புண்ணிய ஏகாதசி விரதம்.",
        significanceEn: "Fasting and prayers observed dedicated to Lord Maha Vishnu.",
      });
    }
  }

  // -------------------------------------------------------------
  // 5. PRADOSHAM (பிரதோஷம் - Tithi 12 / 27)
  // -------------------------------------------------------------
  if (hasTithi(12) || hasTithi(27)) {
    if (ctx.weekday === 6) {
      matches.push({
        id: "sani-pradosham",
        nameTa: "மகா சனிப் பிரதோஷம்",
        nameEn: "Sani Pradosham",
        type: "major_festival",
        deity: "Lord Shiva & Nandi",
        significanceTa: "சனிக்கிழமையில் வரும் மிக சக்திவாய்ந்த பிரதோஷம்; சர்வ பாவ விமோசனம்.",
        significanceEn: "Extremely auspicious Saturday Pradosham offering relief from karmic afflictions.",
      });
    } else if (ctx.weekday === 1) {
      matches.push({
        id: "soma-pradosham",
        nameTa: "சோமப் பிரதோஷம்",
        nameEn: "Soma Pradosham",
        type: "vratham",
        deity: "Lord Shiva & Nandi",
        significanceTa: "திங்கட்கிழமையில் வரும் பிரதோஷ காலம்; மன அமைதியும் ஆரோக்கியமும் நல்கும்.",
        significanceEn: "Auspicious Monday Pradosham blessing peace of mind and well-being.",
      });
    } else {
      matches.push({
        id: "pradosham",
        nameTa: "பிரதோஷ விரதம்",
        nameEn: "Pradosham",
        type: "vratham",
        deity: "Lord Shiva & Nandi",
        significanceTa: "மாலை பிரதோஷ காலத்தில் சிவபெருமான் மற்றும் நந்தியம் பெருமான் வழிபாடு.",
        significanceEn: "Twilight worship of Lord Shiva and Nandi on the 13th lunar day.",
      });
    }
  }

  // -------------------------------------------------------------
  // 6. CHATURTHI (சதுர்த்தி)
  // -------------------------------------------------------------
  // Sankatahara Chaturthi: Krishna Paksha 4th Tithi (Tithi 18)
  if (hasTithi(18)) {
    matches.push({
      id: "sankatahara-chaturthi",
      nameTa: "சங்கடஹர சதுர்த்தி",
      nameEn: "Sankatahara Chaturthi",
      type: "vratham",
      deity: "Lord Ganesha",
      significanceTa: "சகல தடைகளையும் துன்பங்களையும் நீக்கும் கணபதி வழிபாடு மற்றும் விரதம்.",
      significanceEn: "Monthly observance dedicated to Lord Ganesha for overcoming hurdles and crises.",
    });
  }
  // Vinayagar Chaturthi: Shukla Chaturthi (Tithi 3) in Aavani month
  if (hasTithi(3) && ctx.tamilMonthIndex === 4) {
    matches.push({
      id: "vinayagar-chaturthi",
      nameTa: "விநாயகர் சதுர்த்தி",
      nameEn: "Vinayagar Chaturthi (Ganesh Chaturthi)",
      type: "major_festival",
      deity: "Lord Ganesha",
      significanceTa: "விநாயகப் பெருமானின் திருஅவதாரத் திருநாள் கொண்டாட்டம்.",
      significanceEn: "Birth anniversary of Lord Ganesha celebrated across Tamil Nadu and India.",
    });
  }

  // -------------------------------------------------------------
  // 7. SASHTI (சஷ்டி விரதம் - Tithi 5)
  // -------------------------------------------------------------
  if (hasTithi(5)) {
    if (ctx.tamilMonthIndex === 6) {
      matches.push({
        id: "skanda-sashti-soorasamharam",
        nameTa: "கந்த சஷ்டி (சூரசம்ஹாரம்)",
        nameEn: "Skanda Sashti / Soorasamharam",
        type: "major_festival",
        deity: "Lord Murugan",
        significanceTa: "முருகப்பெருமான் சூரபத்மனை வதம் செய்து தர்மத்தை நிலைநாட்டிய திருநாள்.",
        significanceEn: "Culmination of 6-day Skanda Sashti fast marking Lord Murugan's victory over darkness.",
      });
    } else {
      matches.push({
        id: "sashti-vratham",
        nameTa: "சஷ்டி விரதம்",
        nameEn: "Sashti Vratham",
        type: "vratham",
        deity: "Lord Murugan",
        significanceTa: "குழந்தைப் பேறும் வெற்றியும் தரும் முருகப்பெருமான் சஷ்டி விரதம்.",
        significanceEn: "Monthly 6th day waxing fast dedicated to Lord Muruga.",
      });
    }
  }

  // -------------------------------------------------------------
  // 8. KRITTIKAI / KARTHIGAI NAKSHATRA (கார்த்திகை விரதம் - Nak 2)
  // -------------------------------------------------------------
  if (hasNak(2)) {
    matches.push({
      id: "karthigai-nakshatra-vratham",
      nameTa: "கிருத்திகை விரதம்",
      nameEn: "Krittikai / Karthigai Vratham",
      type: "vratham",
      deity: "Lord Murugan",
      significanceTa: "மாதாந்திர கார்த்திகை நட்சத்திர விரதம்; முருகப்பெருமானின் திருவருள் கூடும் நாள்.",
      significanceEn: "Monthly Krittika star observance dedicated to Lord Murugan.",
    });
  }

  // -------------------------------------------------------------
  // 9. SHIVARATHRI (சிவராத்திரி - Krishna Chaturdashi Tithi 28)
  // -------------------------------------------------------------
  if (hasTithi(28)) {
    if (ctx.tamilMonthIndex === 10) {
      matches.push({
        id: "maha-shivarathri",
        nameTa: "மகா சிவராத்திரி",
        nameEn: "Maha Shivarathri",
        type: "major_festival",
        deity: "Lord Shiva",
        significanceTa: "மாசி மாத கிருஷ்ண சதுர்தசி; நான்கு கால சிவபூஜை மற்றும் இரவு விழிப்பு.",
        significanceEn: "Grandest night of Lord Shiva observed with all-night vigil and four-prahara pujas.",
      });
    } else {
      matches.push({
        id: "masa-shivarathri",
        nameTa: "மாத சிவராத்திரி",
        nameEn: "Masa Shivarathri",
        type: "vratham",
        deity: "Lord Shiva",
        significanceTa: "மாதாந்திர கிருஷ்ண பட்ச சதுர்தசி சிவராத்திரி விரதம்.",
        significanceEn: "Monthly 14th waning night fast observed for Lord Shiva.",
      });
    }
  }

  // -------------------------------------------------------------
  // 10. DEEPAVALI (தீபாவளி - Aippasi Krishna Chaturdashi Tithi 28 / Amavasya 29)
  // -------------------------------------------------------------
  if ((hasTithi(28) || hasTithi(29)) && ctx.tamilMonthIndex === 6) {
    matches.push({
      id: "deepavali",
      nameTa: "தீபாவளிப் பண்டிகை",
      nameEn: "Deepavali (Diwali)",
      type: "major_festival",
      significanceTa: "கங்கை ஸ்நானம், புத்தாடை மற்றும் தீப ஒளி ஏற்றி கொண்டாடும் மங்கலத் திருநாள்.",
      significanceEn: "Auspicious festival of lights, Ganges oil bath, and triumph of dharma.",
    });
  }

  // -------------------------------------------------------------
  // 11. NAVARATRI & VIJAYADASAMI (புரட்டாசி மாதம்)
  // -------------------------------------------------------------
  if (ctx.tamilMonthIndex === 5) {
    if (hasTithi(8)) {
      matches.push({
        id: "saraswati-pooja",
        nameTa: "சரஸ்வதி பூஜை / ஆயுத பூஜை",
        nameEn: "Saraswati Puja / Ayudha Puja",
        type: "major_festival",
        deity: "Goddess Saraswati",
        significanceTa: "கல்வி, கலை மற்றும் தொழிற்கருவிகளை பூஜிக்கும் மங்களகரமான நாள்.",
        significanceEn: "Worship of Goddess Saraswati, learning, scriptures, and work instruments.",
      });
    }
    if (hasTithi(9)) {
      matches.push({
        id: "vijayadasami",
        nameTa: "விஜயதசமி (வித்யாரம்பம்)",
        nameEn: "Vijayadasami (Vidyarambham)",
        type: "major_festival",
        deity: "Goddess Durga / Saraswati",
        significanceTa: "நவராத்திரியின் நிறைவு நாள்; புதிய கல்வி மற்றும் செயல்களைத் தொடங்க மகா சுப நாள்.",
        significanceEn: "Auspicious Tenth Day marking victory and initiating new learning / ventures.",
      });
    }
  }

  return matches;
}
