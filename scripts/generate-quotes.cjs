// Script to generate 520+ authentic Tamil and English Vedic astrology quotes for CodePackr Astro
const fs = require("fs");
const path = require("path");

const quotes = [];

function addQuote(ta, en, category = "பொது ஜோதிடம்", author = "— CodePackr Astro") {
  quotes.push({
    id: quotes.length + 1,
    ta: ta.trim(),
    en: en.trim(),
    author: author.trim(),
    category
  });
}

// 1. Core CodePackr Astro Principles (35 quotes)
const corePrinciples = [
  ["பாரம்பரிய ஜோதிடம் · நவீன துல்லியம் · முழு தனியுரிமை", "Classical Jyotish · modern precision · full privacy"],
  ["கோள்களின் வழிகாட்டல் உங்கள் விதியை வெல்லும் தன்னம்பிக்கையைத் தருகிறது", "Planetary guidance grants the confidence to master your destiny"],
  ["ஜாதகம் என்பது விதியின் வரைபடம்; முயற்சியே உங்கள் பயணம்", "A horoscope is the map of destiny; conscious effort is your journey"],
  ["தெளிவான கணக்கீடு, பாரம்பரிய ஞானம் — உங்கள் வாழ்வின் நல்வழி காட்டி", "Precise calculations, ancient wisdom — your guide to a purposeful life"],
  ["வானியல் அறிவியலும் வேத ஜோதிடமும் இணையும் துல்லிய தளம்", "Where astronomical science and Vedic astrology unite in precision"],
  ["விதி என்பது ஆரம்பப் புள்ளி; மதி என்பது நீங்கள் அடையும் உயரம்", "Destiny sets the starting point; intellect decides the heights you reach"],
  ["கிரகங்களின் கதிர்வீச்சு நம் எண்ணங்களை வழிநடத்துகிறது", "Cosmic planetary rays subtly illuminate and guide human thoughts"],
  ["சரியான நேரத்தில் எடுக்கப்படும் முடிவே மாபெரும் வெற்றியைத் தரும்", "Decisions taken at the auspicious time yield extraordinary triumphs"],
  ["ஜோதிடம் பயமுறுத்துவதற்கல்ல; விழிப்புணர்வு தந்து வாழ்வை மேம்படுத்த", "Astrology is not to frighten, but to enlighten and elevate life"],
  ["பிறந்த நேரத்தின் நுட்பமே ஜாதகத்தின் ஆணிவேர்", "The exactness of the birth moment is the very foundation of a horoscope"],
  ["தவறான நேரம் திசை மாற்றும்; துல்லிய நேரம் வாழ்வை உயர்த்தும்", "An approximate time misguides; precise timing elevates your life"],
  ["கர்மாவின் பலன்களை உணர்ந்து தர்ம வழியில் நடப்பதே விவேகம்", "Recognizing the fruits of karma and walking the path of dharma is true wisdom"],
  ["கிரக நிலைகள் காலம் காட்டும் மணிக்கூண்டு போன்றவை", "Planetary positions are the cosmic timepiece of human existence"],
  ["நம்பிக்கை கொண்ட இதயத்திற்கு நட்சத்திரங்களும் வழிகாட்டும்", "To a hopeful and disciplined heart, even distant stars become guides"],
  ["காலம் எதையும் மாற்றும்; சரியான ஜோதிடம் காலத்தை உணர்த்தும்", "Time transforms everything; true astrology teaches you to harmonize with time"],
  ["அறிவியல்பூர்வ வானியல் கணக்கீடுகளுடன் கூடிய மெய்யான கணிப்புகள்", "Authentic Vedic readings powered by precise astronomical ephemeris"],
  ["எந்தக் கோளும் பகை அல்ல; அவை ஒவ்வொன்றும் ஒரு வாழ்க்கை பாடம்", "No planet is an adversary; each is a divine teacher of life's lessons"],
  ["உள்ளுணர்வும் வானியல் உண்மைகளும் கைகோர்க்கும் ஜோதிட தளம்", "Where intuitive insight meets mathematical astronomy with absolute clarity"],
  ["சுய முயற்சியோடு கிரகங்களின் அருளும் இணையும் போது வெற்றி நிச்சயம்", "When sincere perseverance aligns with planetary grace, success is certain"],
  ["பிறப்பு என்பது ஒரு விதை; ஜாதகம் அதன் வளரும் சூழலை விளக்குகிறது", "Birth is a seed; your horoscope describes the cosmic soil in which it blooms"],
  ["இறை நம்பிக்கையும் கோள் வழிகாட்டலும் இணைந்தால் இருள் விலகும்", "Faith combined with astrological foresight dispels every shadow of doubt"],
  ["உங்கள் ஜாதகத்தை ஆழமாகப் புரிந்து கொள்வது உங்களை நீங்களே அறிவதாகும்", "Understanding your birth chart deeply is the supreme art of self-discovery"],
  ["வாழ்க்கையின் திருப்புமுனைகளை முன்கூட்டியே உணர்த்தும் ஜோதிட ஒளி", "The illuminating beacon that reveals life's turning points well in advance"],
  ["நவகிரகங்களின் ஆசி உங்கள் இல்லத்திலும் உள்ளத்திலும் நிறையட்டும்", "May the benevolent blessings of the nine planets fill your home and heart"],
  ["நேரம் தவறாத பிரபஞ்சம்; பிழையில்லாத ஜோதிடக் கணக்கீடு", "An orderly cosmos reflected through flawless mathematical calculations"],
  ["நல்லெண்ணமும் நற்செயலும் எந்தக் கிரக தோஷத்தையும் தணிக்கும்", "Pure intentions and compassionate deeds soften even the fiercest afflictions"],
  ["சூரியன் தரும் ஆன்ம பலமும் சந்திரன் தரும் மன அமைதியும் என்றும் நிலைக்கட்டும்", "May the soul-strength of the Sun and the serene peace of the Moon guide you"],
  ["பிறந்த கணம் பிரபஞ்சத்துடன் நீங்கள் செய்த புனித ஒப்பந்தம்", "Your birth moment was a sacred cosmic compact with the universe"],
  ["ஜாதகத்தில் உள்ள தடைகள் நீங்கள் தாண்ட வேண்டிய படிக்கட்டுகளே", "The hurdles indicated in a horoscope are merely stepping stones to greatness"],
  ["தர்மத்தின் வழியில் நடப்பவருக்கு கிரகங்கள் எப்போதும் துணை நிற்கும்", "The planets perpetually stand in support of those who uphold righteousness"],
  ["விவேகமுள்ள முடிவுக்கு விண்மீன்களின் வழிகாட்டல் என்றும் உதவும்", "The guidance of the stars will always aid a discerning and humble mind"],
  ["நேரமும் காலமும் பிரபஞ்சத்தின் மகா சக்திகள்", "Time and cosmic seasons are the supreme moving forces of creation"],
  ["உங்கள் விதியை நீங்கள் வடிவமைக்க ஜோதிடம் ஒரு திறவுகோல்", "Astrology is the master key with which you consciously shape your fate"],
  ["நவீன தொழில்நுட்பத்தில் பாரம்பரிய ஜோதிடத்தின் தெய்வீக தூய்மை", "Divine sanctity of classical astrology delivered through modern technology"],
  ["அமைதியான மனமும் தெளிவான ஜாதகப் பார்வையும் வாழ்க்கையை அழகாக்கும்", "A tranquil mind and a clear astrological perspective make life beautiful"]
];

corePrinciples.forEach(([ta, en]) => addQuote(ta, en, "கோட்ப்பேக்ர தத்துவம்"));

// 2. Navagraha Wisdom (12 themes per planet = 108 quotes)
const planetsData = [
  {
    id: "surya",
    taName: "சூரியன்",
    enName: "The Sun (Surya)",
    themes: [
      ["சூரியன் ஆன்மாவின் ஒளி; தன்நம்பிக்கையும் தலைமைப் பண்பும் அதன் கொடை", "The Sun is the light of the soul, bestowing self-confidence and leadership"],
      ["சூரிய பகவானின் அருள் உள்ளவரை வாழ்க்கையில் இருளுக்கு இடமில்லை", "As long as the grace of Surya shines upon you, darkness has no dwelling"],
      ["தந்தையின் ஆசியும் சூரியனின் பலமும் ஒருவரை உயர்ந்த நிலைக்கு உயர்த்தும்", "A father's blessing and a strong Sun elevate a person to noble heights"],
      ["தினசரி சூரிய நமஸ்காரம் ஆன்ம பலத்தையும் ஆரோக்கியத்தையும் பெருக்கும்", "Daily reverence to the morning Sun multiplies vitality and inner fortitude"],
      ["சூரியனின் தெளிவான பார்வை அரச யோகத்தையும் சமூக மதிப்பையும் தரும்", "A dignified Sun in the chart brings executive authority and societal respect"],
      ["சூரியன் நமக்குக் கற்றுத் தரும் பாடம்: ஒழுக்கம், தவறாத கடமை, தன்னலமற்ற ஒளி", "The Sun's lesson to humanity: unwavering discipline and selfless radiance"],
      ["உங்கள் உள்ளத்தில் சூரியனைப் போல் அணையாத உறுதியை வளர்த்துக் கொள்ளுங்கள்", "Cultivate an unquenchable resolve within your heart, like the radiant Sun"],
      ["சூரியன் பலம் பெற்ற ஜாதகர் எத்தகைய சோதனையையும் வென்று காட்டுவார்", "One blessed with a potent Sun triumphs over every adversity with courage"],
      ["பொறுமையும் வெளிச்சமும் சூரியனின் இயல்பு; அதையே நாமும் பின்பற்றுவோம்", "Patience and boundless illumination are the Sun's nature; emulate them"],
      ["சூரியனின் ஆசி பெற்றவருக்கு நேர்மையும் தர்மமும் இயல்பான குணங்களாகும்", "Integrity and righteousness come naturally to those blessed by the Sun"],
      ["சூரிய பகவான் தரும் ஆரோக்கியம் வாழ்வின் மிகப்பெரிய செல்வம்", "The radiant health gifted by Lord Surya is life's most precious treasure"],
      ["விடியலின் முதல் கிரணம் புதிய வாய்ப்புகளின் திறவுகோல்", "The first ray of morning dawn is the cosmic key to boundless new beginnings"]
    ]
  },
  {
    id: "chandra",
    taName: "சந்திரன்",
    enName: "The Moon (Chandra)",
    themes: [
      ["சந்திரன் மனதின் அதிபதி; தெளிவான மனமே ஆனந்தமான வாழ்வின் ஊற்று", "The Moon governs the mind; a serene mind is the fountainhead of joyous living"],
      ["சந்திரனின் குளிர்ச்சி தாயின் அன்பையும் எல்லையற்ற கருணையையும் குறிக்கிறது", "The Moon's gentle coolness mirrors a mother's selfless love and boundless empathy"],
      ["வளர்பிறை நிலவு போல உங்கள் நற்குணங்களும் செல்வமும் வளரட்டும்", "May your virtues and prosperity wax continuously like the auspicious Moon"],
      ["மனம் அமைதியாக இருந்தால் எந்தக் கிரக சஞ்சாரமும் உங்களுக்கு சாதகமே", "When the mind remains tranquil, every planetary transit works in your favor"],
      ["சந்திரன் பலமடைந்தால் கற்பனை வளமும் கலைத்திறனும் புகழும் நிறையும்", "A well-placed Moon enriches creative imagination, artistic flair, and renown"],
      ["கடலின் அலைகளை இயக்கும் சந்திரன் நமது உணர்வுகளின் திசையையும் தீர்மானிக்கிறது", "The Moon that moves ocean tides equally governs the currents of human emotion"],
      ["தாயை மதித்து வணங்குபவருக்கு சந்திரனின் தோஷம் ஒருபோதும் அண்டாது", "Afflictions of the Moon never touch the one who deeply honors their mother"],
      ["சந்திரனின் ஒளி இருண்ட இரவிலும் நல்வழி காட்டும் அமைதியான வழிகாட்டி", "The lunar glow is a serene guide that softly illuminates even the darkest night"],
      ["மனதில் தூய்மை இருந்தால் சந்திர பகவானின் அருளால் ஆனந்தம் நிலைக்கும்", "Purity of thought attracts the enduring blessings of Lord Chandra"],
      ["சந்திரனின் கலைகள் நமக்குக் கற்றுத் தருவது: மாற்றங்கள் வாழ்வின் இயல்பு", "The phases of the Moon teach us that ebb and flow are the natural rhythms of life"],
      ["பூரண சந்திரன் போல உங்கள் இல்லத்தில் நிம்மதியும் மகிழ்ச்சியும் ஒளிரட்டும்", "May peace and serenity illuminate your home like the resplendent Full Moon"],
      ["சந்திர பலம் கொண்டவர் பிறர் துன்பத்தைப் போக்கும் இரக்க குணம் கொண்டவர்", "One with lunar strength possesses deep compassion that heals the sorrow of others"]
    ]
  },
  {
    id: "chevvai",
    taName: "செவ்வாய்",
    enName: "Mars (Chevvai / Mangal)",
    themes: [
      ["செவ்வாய் தைரியத்தின் அடையாளம்; பயமின்மையே வெற்றிக்கான முதல் படி", "Mars represents fearless courage; fearlessness is the very first step to triumph"],
      ["நிலமும் சகோதர உறவும் செவ்வாயின் நேர்மையான பலத்தால் சிறக்கும்", "Land, property, and fraternal bonds flourish through the noble strength of Mars"],
      ["ஆற்றலை சரியான இலக்கில் செலுத்துவதே செவ்வாய் பகவானின் உயரிய வழிகாட்டல்", "Channelling fiery energy toward righteous goals is the supreme counsel of Mars"],
      ["செவ்வாய் தரும் வீரம் அநீதியை எதிர்க்கவும் தர்மத்தைக் காக்கவும் பயன்பட வேண்டும்", "The valor bestowed by Mars must defend justice and protect righteous living"],
      ["சுறுசுறுப்பும் செயல் திறனும் செவ்வாயின் அருளால் உண்டாகும் வரங்கள்", "Energetic dynamism and executive vigor are the sublime gifts of Mars"],
      ["கோபத்தை அடக்கி ஆற்றலாக மாற்றுபவனே உண்மையான செவ்வாயின் வீரன்", "The true warrior of Mars transmutes anger into creative, disciplined strength"],
      ["முருகப்பெருமானின் ஆசி செவ்வாயின் உக்கிரத்தை மங்களகரமான யோகமாக மாற்றும்", "The grace of Lord Muruga transforms Martian intensity into auspicious yogas"],
      ["செவ்வாய் பலம் உள்ளவர் சவால்களைக் கண்டு அஞ்சாமல் முன்னேறிச் செல்வார்", "One with a strong Mars charges forward without trembling in the face of challenge"],
      ["உடற்பயிற்சியும் உறுதியான மனமும் செவ்வாயின் அருளை ஈர்க்கும் வழிகள்", "Physical discipline and unwavering willpower attract the favor of Mars"],
      ["வீரம் என்பது பிறரை அடக்குவதல்ல; தன் பலவீனங்களை வெல்வதே", "True valor is not conquering others, but conquering your own inner weaknesses"],
      ["செவ்வாய் தரும் தைரியம் இக்கட்டான சூழலிலும் சரியான முடிவெடுக்க உதவும்", "The courage of Mars empowers you to make decisive choices in challenging times"],
      ["பூமித்தாயின் மைந்தனான செவ்வாய் உழைப்பாளிகளுக்கு எப்போதும் துணை நிற்பான்", "Mars, son of Mother Earth, perpetually stands by the side of the diligent worker"]
    ]
  },
  {
    id: "budhan",
    taName: "புதன்",
    enName: "Mercury (Budhan)",
    themes: [
      ["புதன் அறிவின் காரகன்; சமயோசித புத்தியே உலகின் மிகப்பெரிய பலம்", "Mercury governs intelligence; timely wit is the greatest strength in the world"],
      ["இனிமையான சொல்லும் கூர்மையான சிந்தனையும் புதனின் அருளால் கிடைக்கிறது", "Pleasant speech and sharp analytical brilliance flow from the grace of Mercury"],
      ["வணிகத்திலும் கணிதத்திலும் புதன் பகவானின் பார்வை பெருவெற்றி தரும்", "The favorable glance of Budha brings immense victory in commerce and mathematics"],
      ["கல்வி என்பது அழியாத செல்வம்; புதனின் அருள் அதை மெருகேற்றும்", "Knowledge is an imperishable wealth; the blessings of Mercury polish it to perfection"],
      ["நல்ல நூல்களை வாசிப்பதும் விவேகமாகப் பேசுவதும் புதனை பலப்படுத்தும்", "Reading noble books and speaking with discernment strengthen Mercury's power"],
      ["புதன் அருளால் தெளிவடையும் அறிவு எந்தக் குழப்பத்தையும் தீர்க்கும்", "Intellect illuminated by Budha effortlessly unravels any complicated tangle"],
      ["நகைச்சுவை உணர்வும் சாதுரியமும் புதனின் நேர்மறை ஆற்றலின் அடையாளங்கள்", "A keen sense of humor and diplomatic tact are the hallmarks of Mercury's grace"],
      ["புதனின் பலம் ஒருவரை சிறந்த எழுத்தாளராகவும் பேச்சாளராகவும் உருவாக்கும்", "Strength of Mercury shapes one into an eloquent writer, orator, and thinker"],
      ["கற்ற கல்வி பிறருக்கு உதவும் போது புத பகவான் அளவற்ற மகிழ்ச்சி அடைவார்", "When acquired knowledge serves fellow beings, Lord Budha rejoices infinitely"],
      ["அறிவினால் எதையும் வெல்லலாம்; புதனின் அருள் அதற்கு முழு வழிகாட்டி", "Anything can be accomplished with sharp intellect; Budha is its supreme guide"],
      ["தொடர் கற்றலே வெற்றியாளரின் தாரக மந்திரம்", "Continuous learning is the unfailing sacred mantra of every true achiever"],
      ["சாதுரியமான சொல் ஆயிரம் வாள்களை விட வலிமையானது", "A tactful, well-chosen word is mightier than a thousand drawn swords"]
    ]
  },
  {
    id: "guru",
    taName: "குரு",
    enName: "Jupiter (Guru / Brihaspati)",
    themes: [
      ["குருவின் பார்வை கோடி நன்மை; தெய்வீக அருள் அனைத்தையும் மங்களமாக்கும்", "The glance of Guru brings ten million blessings, sanctifying all of life"],
      ["குரு பகவானின் அருள் உள்ளவரை வாழ்க்கையில் தோல்வி என்பது ஒருபோதும் இல்லை", "As long as Lord Guru's benevolence shields you, defeat can never prevail"],
      ["நல்லாசிரியரின் வழிகாட்டலும் குருவின் பார்வையும் மனிதனை தெய்வமாக்கும்", "The guidance of a noble preceptor and Guru's aspect elevate human life to divinity"],
      ["தர்ம சிந்தனையும் பெருந்தன்மையும் குரு பகவானின் தலையாய ஆசிகள்", "Righteous mindedness and magnanimous generosity are Guru's paramount gifts"],
      ["குருவின் அருள் பெற்ற இல்லத்தில் அமைதியும் செல்வமும் தலைமுறைக்கும் தங்கும்", "In a home graced by Guru, peace and abundance endure for generations"],
      ["ஆன்மீக நாட்டமும் ஞானமும் குருவின் பொன்னான ஒளியினால் மலர்கின்றன", "Spiritual devotion and supreme wisdom blossom in the golden light of Jupiter"],
      ["ஏழை எளியோருக்கு செய்யும் உதவியே குரு பகவானுக்கு உகந்த வழிபாடு", "Selfless service to the needy is the most pleasing worship to Lord Brihaspati"],
      ["குரு பலம் இருக்கும் போது எடுக்கப்படும் முயற்சிகள் தடையின்றி நிறைவேறும்", "Enterprises initiated when Guru is propitious fructify without obstacle"],
      ["அறிஞர்களையும் பெரியோர்களையும் மதிப்பது குரு தோஷத்தைப் போக்கும் எளிய வழி", "Honoring sages and elders is the simplest pathway to appease afflictions of Guru"],
      ["குரு தரும் அறிவு தற்பெருமையை நீக்கி எல்லையற்ற அடக்கத்தைக் கொடுக்கும்", "The wisdom bestowed by Guru dissolves ego, replacing it with boundless humility"],
      ["மஞ்சள் மலரும் சந்தனமும் போல குருவின் அருள் வாழ்வை மங்களகரமாக்கும்", "Like fresh turmeric and sandalwood, Guru's presence renders life auspicious"],
      ["நல்லவர்களின் நட்பும் ஞானிகளின் உபதேசமும் குரு தரும் பொக்கிஷங்கள்", "The companionship of the virtuous and the counsel of the wise are Guru's treasures"]
    ]
  },
  {
    id: "sukran",
    taName: "சுக்கிரன்",
    enName: "Venus (Sukran)",
    themes: [
      ["சுக்கிரன் அன்பின் பிறப்பிடம்; கலையும் அழகும் வாழ்வை வசந்தமாக்கும்", "Venus is the font of love; art, beauty, and grace turn life into eternal spring"],
      ["சுக்கிரனின் அருள் இல்லறத்தில் அமைதியையும் பரஸ்பர அன்பையும் வளர்க்கும்", "The grace of Sukra nurtures matrimonial harmony and unconditional devotion"],
      ["கலைகளில் தேர்ச்சியும் ரசனையும் சுக்கிர பகவான் தரும் இனிய வரங்கள்", "Mastery in fine arts and refined aesthetic taste are Venus's sweetest gifts"],
      ["சுத்தமும் நேர்த்தியும் இருக்கும் இடத்தில் சுக்கிர லட்சுமி மனமுவந்து வாசம் செய்வாள்", "Where cleanliness and elegance prevail, Sukra-Lakshmi resides with joy"],
      ["பிறரை நேசிப்பதும் அன்பைப் பகிர்வதும் சுக்கிரனின் பலத்தை அதிகரிக்கும்", "Loving others sincerely and sharing joy enhance the sublime power of Venus"],
      ["சுக்கிரன் பலம் பெற்ற ஜாதகர் வசீகரமும் அனைவரையும் ஈர்க்கும் பண்பும் பெறுவார்", "One blessed with a strong Venus possesses undeniable magnetism and charm"],
      ["மகிழ்ச்சியான குடும்ப வாழ்வே சுக்கிர பகவான் தரும் உன்னத செல்வம்", "A content and affectionate family life is the supreme wealth granted by Sukra"],
      ["சுய ஒழுக்கத்துடன் கூடிய கலை ரசனையே சுக்கிரனை திருப்திப்படுத்தும்", "Aesthetic enjoyment grounded in self-discipline brings the highest grace of Venus"],
      ["இனிமையான பேச்சும் மென்மையான மனமும் சுக்கிரனின் தெய்வீக குணங்கள்", "Melodious speech and a gentle heart reflect the divine qualities of Sukra"],
      ["வாழ்க்கையை நேசிப்பவருக்கு சுக்கிரனின் ஆசிகள் என்றும் குறைவதில்லை", "For the one who genuinely cherishes life, the blessings of Venus never dwindle"],
      ["அன்பே கடவுள் என்பதை உணர்த்துவதே சுக்கிரனின் ஆழமான பாடம்", "Teaching that pure love is divine is the profound spiritual lesson of Venus"],
      ["மனமகிழ்ச்சியும் நல்ல வாகன யோகமும் சுக்கிர பகவானின் விருப்ப வரங்கள்", "Inner serenity and comfortable conveyance are the delightful boons of Venus"]
    ]
  },
  {
    id: "sani",
    taName: "சனி",
    enName: "Saturn (Sani / Shani)",
    themes: [
      ["சனி பகவான் நீதியின் காரகன்; உழைப்பும் பொறுமையுமே அவரை மகிழ்விக்கும்", "Saturn is the lord of justice; earnest hard work and patience earn his grace"],
      ["சனி தரும் சோதனைகள் உங்களை தகர்த்துவிட அல்ல, வைரமாய் பட்டை தீட்டவே", "The trials sent by Saturn are not to break you, but to polish you into a diamond"],
      ["ஏழைகளுக்கு செய்யும் தொண்டும் எளியோரை மதிப்பதும் சனியின் அருளைப் பெற்றுத் தரும்", "Serving the underprivileged and respecting the humble win the compassion of Sani"],
      ["காலம் தாமதமானாலும் சனி பகவான் கொடுக்கும் வெற்றி என்றென்றும் நிலைத்து நிற்கும்", "Though delayed by time, the victory awarded by Lord Saturn endures forever"],
      ["பொறுமை, அடக்கம், கடின உழைப்பு — இவை மூன்றும் சனியின் சிறந்த பரிகாரங்கள்", "Patience, humility, and diligent toil — these three are the supreme remedies for Sani"],
      ["நீதி தவறாத வாழ்க்கைக்கு சனி பகவான் எப்போதும் அரணாக நிற்பார்", "Lord Saturn stands as an impregnable shield for a life founded upon truth and justice"],
      ["அகந்தையை அழித்து மெய்யான ஞானத்தை உணர வைப்பவரே சனி பகவான்", "Lord Saturn is the great teacher who shatters ego to unveil ultimate spiritual truth"],
      ["சனி தரும் காலதாமதம் உங்களுக்குள் இருக்கும் தகுதியை அதிகப்படுத்துவதற்கே", "The delays orchestrated by Saturn exist solely to ripen your inner competence"],
      ["உண்மையான உழைப்பாளிக்கு சனி பகவானை விட சிறந்த நண்பன் வேறு யாருமில்லை", "To the sincere and tireless laborer, there is no greater benefactor than Saturn"],
      ["முந்தைய கர்மாவை சமன் செய்து ஆன்மாவை தூய்மைப்படுத்துவதே சனியின் பணி", "Balancing past karma and purifying the soul is the sacred cosmic mission of Saturn"],
      ["பொறுமை உள்ள மனிதன் பிரபஞ்சத்தின் எந்தச் சவாலையும் வென்று காட்டுவான்", "A patient soul equipped with perseverance overcomes every challenge in creation"],
      ["விதி என்னும் கல்லை உழைப்பு என்னும் உளியால் செதுக்குபவன் மனிதன்", "Man sculpts the raw stone of destiny with the chisel of disciplined effort"]
    ]
  },
  {
    id: "rahu",
    taName: "ராகு",
    enName: "Rahu (North Node)",
    themes: [
      ["ராகு பெரும் கனவுகளையும் எல்லையற்ற லட்சியங்களையும் தூண்டும் சக்தி", "Rahu is the catalyst that ignites monumental dreams and limitless ambitions"],
      ["கவனமான விவேகத்துடன் செயல்பட்டால் ராகுவின் தசை உலகப் புகழைத் தரும்", "When handled with vigilant wisdom, Rahu's cycle can bestow worldwide acclaim"],
      ["புதிய தொழில்நுட்பங்களும் உலகளாவிய சாதனைகளும் ராகுவின் ஆதிக்கத்தில் அடங்கும்", "Novel technologies and global breakthroughs fall under the dynamic sway of Rahu"],
      ["மாயையை வென்று உண்மையை அறிவதே ராகு தரும் ஆழமான ஆன்மீகப் பாடம்", "Transcending illusion to perceive reality is the deep spiritual lesson of Rahu"],
      ["ராகுவின் பலம் சாமானியனையும் சரித்திர நாயகனாக மாற்றும் வல்லமை கொண்டது", "The potent energy of Rahu can transform an ordinary striver into a historic icon"],
      ["துர்கை அம்மன் வழிபாடு ராகுவின் தீவிரத்தை மங்களகரமான யோகமாக மாற்றும்", "Reverence to Goddess Durga converts Rahu's volatility into auspicious success"],
      ["விதிமுறைகளுக்கு அப்பாற்பட்டு சிந்திக்கும் ஆற்றல் ராகுவின் தனித்துவ கொடை", "The capacity to think beyond conventional boundaries is Rahu's unique gift"],
      ["எல்லைகளைக் கடந்து சாதனை படைக்கும் தைரியத்தை ராகு பகவான் ஊட்டுகிறார்", "Lord Rahu infuses the audacious courage needed to cross borders and make history"],
      ["திடீர் திருப்பங்களும் எதிர்பாராத உயர்வும் ராகுவின் விசித்திர திருவிளையாடல்கள்", "Sudden breakthroughs and unexpected elevations are the mystical play of Rahu"],
      ["ஆசைகளை தர்மத்தின் நெறிக்குள் கட்டுப்படுத்துபவன் ராகுவை வெல்கிறான்", "He who disciplines desire within the bounds of dharma masters the power of Rahu"],
      ["அறிவியல் கண்டுபிடிப்புகளும் தொலைதூர பயணங்களும் ராகுவின் ஆசிகள்", "Scientific discoveries and transformative overseas journeys are Rahu's blessings"],
      ["மாயையை விலக்கி தெளிவு பெறுபவனுக்கு ராகு ஞானத்தின் திறவுகோல்", "To the one who cuts through delusion, Rahu becomes the key to profound wisdom"]
    ]
  },
  {
    id: "ketu",
    taName: "கேது",
    enName: "Ketu (South Node)",
    themes: [
      ["கேது ஞானத்தின் காரகன்; பற்றற்ற மனமே நிலையான அமைதியின் ரகசியம்", "Ketu is the signifier of liberation; detachment is the secret to enduring peace"],
      ["உலக ஆசைகளைக் கடந்து ஆன்ம அமைதியை நாடுவோருக்கு கேதுவே உற்ற துணை", "To those seeking soul tranquility beyond worldly thirsts, Ketu is the truest companion"],
      ["விநாயகர் வழிபாடு கேதுவின் அருளை எளிதில் ஈர்க்கும் அற்புதமான வழி", "Worship of Lord Ganesha is the wondrous path to easily attract Ketu's benevolence"],
      ["உள்ளுணர்வின் ஆழமும் ஆன்மீக ஆராய்ச்சியும் கேது பகவானின் கொடைகள்", "Profound intuition and metaphysical inquiry are the sacred gifts of Lord Ketu"],
      ["இழப்புகள் கூட ஆன்ம வளர்ச்சிக்கான வாய்ப்புகளே என்பதை கேது உணர்த்துகிறார்", "Ketu reveals that even worldly losses are cosmic gateways to soul ascension"],
      ["மோட்ச காரகனான கேது மனிதனை சுயநலத்திலிருந்து விடுவித்து முக்தி தருகிறார்", "As the karaka of liberation, Ketu frees humanity from ego and guides toward moksha"],
      ["தியானமும் தியான நிலையும் கேதுவின் பலத்தால் மிக எளிதாக வசப்படும்", "Meditation and states of deep stillness are effortlessly attained through Ketu's grace"],
      ["பொருட்களின் மீது பற்று வைக்காமல் அனுபவிப்பவனே உண்மையான ஞானி", "He who enjoys worldly blessings without clinging attachment is a true sage"],
      ["அகக்கண்ணைத் திறந்து அகிலத்தின் உண்மைகளை அறிய வைப்பவரே கேது பகவான்", "Lord Ketu opens the inner eye to perceive the foundational truths of existence"],
      ["கடந்த கால கர்ம வினைகளை அறுத்து எறியும் சக்தி கேதுவின் ஆன்மீக வாளுக்கு உண்டு", "The spiritual sword of Ketu possesses the potency to sever ancient karmic bonds"],
      ["எளிமையும் துறவும் அமைதியான இதயத்திற்கு எப்போதும் வழிவகுக்கும்", "Simplicity and detachment eternally pave the way for a serene and fearless heart"],
      ["பிரபஞ்சத்தின் மௌனத்தில் இறைவனைக் காண்பதே கேதுவின் உன்னத தத்துவம்", "Beholding the Divine in the silence of the cosmos is Ketu's supreme philosophy"]
    ]
  }
];

planetsData.forEach(p => {
  p.themes.forEach(([ta, en]) => {
    addQuote(ta, en, `${p.taName} ஞானம்`);
  });
});

// 3. 27 Nakshatras Wisdom (27 nakshatras x 4 quotes each = 108 quotes)
const nakshatras = [
  { nameTa: "அசுவினி", nameEn: "Ashwini", descTa: "விரைவான செயல், மருத்துவ ஆற்றல் மற்றும் தொடக்கங்களின் நட்சத்திரம்", descEn: "Star of swift initiation, miraculous healing, and dynamic beginnings" },
  { nameTa: "பரணி", nameEn: "Bharani", descTa: "தாங்கும் சக்தி, ஒழுக்கம் மற்றும் மறுபிறப்பின் நட்சத்திரம்", descEn: "Star of endurance, self-restraint, and transformative rebirth" },
  { nameTa: "கிருத்திகை", nameEn: "Krittika", descTa: "தூய்மைப்படுத்தும் அக்னி, கூர்மை மற்றும் தலைமைப் பண்பின் நட்சத்திரம்", descEn: "Star of purifying sacred fire, acute sharpness, and heroic leadership" },
  { nameTa: "ரோகிணி", nameEn: "Rohini", descTa: "வளமை, கவர்ச்சி, கலை மற்றும் மனநிறைவின் நட்சத்திரம்", descEn: "Star of fertile abundance, alluring charm, arts, and emotional fulfillment" },
  { nameTa: "மிருகசீரிஷம்", nameEn: "Mrigashira", descTa: "தேடல், நுண்ணறிவு மற்றும் அமைதியை நாடும் நட்சத்திரம்", descEn: "Star of endless quest, inquisitive intellect, and serene pursuit of truth" },
  { nameTa: "திருவாதிரை", nameEn: "Ardra", descTa: "புயலுக்குப் பின் தெளிவு, புத்துணர்ச்சி மற்றும் சிவபக்தியின் நட்சத்திரம்", descEn: "Star of renewal through emotional storms and supreme devotion to Shiva" },
  { nameTa: "புனர்பூசம்", nameEn: "Punarvasu", descTa: "மீண்டும் எழும் நம்பிக்கை, கருணை மற்றும் குடும்ப நல்வாழ்வின் நட்சத்திரம்", descEn: "Star of triumphant return, radiant optimism, and maternal sanctuary" },
  { nameTa: "பூசம்", nameEn: "Pushya", descTa: "ஆன்மீக போஷணை, தர்மம் மற்றும் குருவருள் நிறைந்த நட்சத்திரம்", descEn: "The most auspicious star of spiritual nourishment, virtue, and Guru's grace" },
  { nameTa: "ஆயில்யம்", nameEn: "Ashlesha", descTa: "உள்ளுணர்வு, மறைஞானம் மற்றும் யோக சக்தியின் நட்சத்திரம்", descEn: "Star of profound mysticism, psychic intuition, and coiled kundalini power" },
  { nameTa: "மகம்", nameEn: "Magha", descTa: "முன்னோர் ஆசி, கம்பீரம் மற்றும் பாரம்பரிய பெருமையின் நட்சத்திரம்", descEn: "Star of ancestral benediction, royal dignity, and noble heritage" },
  { nameTa: "பூரம்", nameEn: "Purva Phalguni", descTa: "மகிழ்ச்சி, ஆக்கபூர்வ உழைப்பு மற்றும் குடும்ப அன்பின் நட்சத்திரம்", descEn: "Star of festive joy, fruitful creativity, and affectionate marital bliss" },
  { nameTa: "உத்திரம்", nameEn: "Uttara Phalguni", descTa: "கொடைத்தன்மை, நட்பு மற்றும் கடமை உணர்வின் நட்சத்திரம்", descEn: "Star of philanthropic nobility, steadfast friendship, and moral duty" },
  { nameTa: "ஹஸ்தம்", nameEn: "Hasta", descTa: "கைவினைத் திறன், சாதுரியம் மற்றும் வெற்றிகர உழைப்பின் நட்சத்திரம்", descEn: "Star of masterful dexterity, witty cleverness, and fruitful craftsmanship" },
  { nameTa: "சித்திரை", nameEn: "Chitra", descTa: "அழகு வடிவமைப்பு, புதுமை மற்றும் மின்னும் வைர நட்சத்திரம்", descEn: "Star of architectural brilliance, multifaceted design, and sparkling elegance" },
  { nameTa: "சுவாதி", nameEn: "Swati", descTa: "சுதந்திரம், மென்மை மற்றும் காற்று போல வளையும் சாதுரிய நட்சத்திரம்", descEn: "Star of sovereign independence, gentle flexibility, and commercial tact" },
  { nameTa: "விசாகம்", nameEn: "Vishakha", descTa: "ஒற்றை இலக்கு, வைராக்கியம் மற்றும் குறிக்கோள் வெற்றியின் நட்சத்திரம்", descEn: "Star of razor-sharp focus, unyielding determination, and triumphant goals" },
  { nameTa: "அனுஷம்", nameEn: "Anuradha", descTa: "நட்பு, பக்தி மற்றும் சோதனைகளை வெல்லும் பொறுமையின் நட்சத்திரம்", descEn: "Star of devoted fellowship, spiritual surrender, and enduring fortitude" },
  { nameTa: "கேட்டை", nameEn: "Jyeshtha", descTa: "மூத்த பெருமை, தலைமை மற்றும் விவேகப் பாதுகாப்பின் நட்சத்திரம்", descEn: "Star of senior eminence, courageous guardianship, and protective wisdom" },
  { nameTa: "மூலம்", nameEn: "Mula", descTa: "ஆணிவேர் வரை ஆராய்தல், ஆன்ம விடுதலை மற்றும் உண்மை தேடலின் நட்சத்திரம்", descEn: "Star of probing deep to the root, karmic unraveling, and core truth" },
  { nameTa: "பூராடம்", nameEn: "Purva Ashadha", descTa: "அழியாத நம்பிக்கை, வசீகர பேச்சு மற்றும் வெற்றி மங்கல நட்சத்திரம்", descEn: "Star of invincible confidence, persuasive speech, and enduring glory" },
  { nameTa: "உத்திராடம்", nameEn: "Uttara Ashadha", descTa: "நிலையான வெற்றி, விவேக அடக்கம் மற்றும் நேர்மையின் நட்சத்திரம்", descEn: "Star of permanent triumph, righteous modesty, and unassailable ethics" },
  { nameTa: "திருவோணம்", nameEn: "Shravana", descTa: "கேட்டறிதல், கல்வி, மகாவிஷ்ணுவின் அருள் மற்றும் அமைதியின் நட்சத்திரம்", descEn: "Star of attentive listening, sacred wisdom, peace, and Vishnu's protection" },
  { nameTa: "அவிட்டம்", nameEn: "Dhanishta", descTa: "இசை நாட்டம், செல்வாக்கு மற்றும் பிரபஞ்ச லயத்தின் நட்சத்திரம்", descEn: "Star of musical resonance, prosperous influence, and cosmic harmony" },
  { nameTa: "சதயம்", nameEn: "Shatabhisha", descTa: "நூறு மருத்துவர்களின் ஆற்றல், மர்மங்களை வெல்லும் நட்சத்திரம்", descEn: "Star of a hundred celestial healers, mystical depth, and miraculous remedy" },
  { nameTa: "பூரட்டாதி", nameEn: "Purva Bhadrapada", descTa: "தீவிர தவம், ஆன்மீக விழிப்புணர்வு மற்றும் உண்மையை உணரும் நட்சத்திரம்", descEn: "Star of intense spiritual penance, awakening fire, and transformative truth" },
  { nameTa: "உத்திரட்டாதி", nameEn: "Uttara Bhadrapada", descTa: "ஆழ்ந்த ஞானம், பொறுமை மற்றும் சமுத்திரம் போன்ற சாந்த நட்சத்திரம்", descEn: "Star of boundless ocean-like tranquility, contemplative depth, and patience" },
  { nameTa: "ரேவதி", nameEn: "Revati", descTa: "பயணங்களின் பாதுகாப்பு, கருணை மற்றும் முழுமை தரும் மோட்ச நட்சத்திரம்", descEn: "Star of graceful culmination, safe passage, unconditional love, and moksha" }
];

nakshatras.forEach(n => {
  addQuote(
    `${n.nameTa} நட்சத்திரம்: ${n.descTa}`,
    `${n.nameEn} Nakshatra: ${n.descEn}`,
    "நட்சத்திர தத்துவம்"
  );
  addQuote(
    `${n.nameTa} நட்சத்திரத்தில் பிறந்தவருக்கு இயல்பாகவே ஆன்ம பலமும் நற்பண்புகளும் வாய்க்கும்`,
    `Those blessed with ${n.nameEn} nakshatra inherently possess inner fortitude and noble virtues`,
    "நட்சத்திர தத்துவம்"
  );
  addQuote(
    `${n.nameTa} நாளில் நற்செயல்களையும் வழிபாடுகளையும் தொடங்குவது சுப பலன்களைப் பெருக்கும்`,
    `Commencing auspicious deeds and prayers on ${n.nameEn} days multiplies blessed results`,
    "நட்சத்திர தத்துவம்"
  );
  addQuote(
    `${n.nameTa} விண்மீன் உங்கள் வாழ்க்கை பயணத்திற்கு நல்வழிகாட்டும் கலங்கரை விளக்கம்`,
    `The star of ${n.nameEn} shines as a constant luminous beacon over your life journey`,
    "நட்சத்திர தத்துவம்"
  );
});

// 4. 12 Rasis Wisdom (12 rasis x 6 quotes each = 72 quotes)
const rasis = [
  { nameTa: "மேஷம்", nameEn: "Aries (Mesha)", elementTa: "நெருப்பு", elementEn: "Fire", traitTa: "துணிச்சல், புதிய முயற்சிகளின் ஆர்வம் மற்றும் தலைமைப்பண்பு", traitEn: "Pioneering initiative, boldness, and charismatic leadership" },
  { nameTa: "ரிஷபம்", nameEn: "Taurus (Rishabha)", elementTa: "நிலம்", elementEn: "Earth", traitTa: "நிலையான உழைப்பு, பொறுமை மற்றும் நேர்த்தியான ரசனை", traitEn: "Steadfast patience, loyalty, practical wisdom, and refined taste" },
  { nameTa: "மிதுனம்", nameEn: "Gemini (Mithuna)", elementTa: "காற்று", elementEn: "Air", traitTa: "சுறுசுறுப்பான புத்தி, தகவல் தொடர்பு மற்றும் பன்முகத் திறன்", traitEn: "Versatile intellect, expressive communication, and adaptive wit" },
  { nameTa: "கடகம்", nameEn: "Cancer (Kataka)", elementTa: "நீர்", elementEn: "Water", traitTa: "ஆழ்ந்த பாசம், தாய்மை குணம் மற்றும் எல்லையற்ற உள்ளுணர்வு", traitEn: "Nurturing empathy, maternal devotion, and profound emotional intuition" },
  { nameTa: "சிம்மம்", nameEn: "Leo (Simha)", elementTa: "நெருப்பு", elementEn: "Fire", traitTa: "கம்பீரம், தாராள குணம் மற்றும் சூரியனைப் போன்ற பிரகாசம்", traitEn: "Regal presence, magnanimous generosity, and radiant solar dignity" },
  { nameTa: "கன்னி", nameEn: "Virgo (Kanya)", elementTa: "நிலம்", elementEn: "Earth", traitTa: "நுணுக்கமான பார்வை, சேவை மனப்பான்மை மற்றும் விவேகம்", traitEn: "Analytical precision, selfless devotion to service, and thoughtful order" },
  { nameTa: "துலாம்", nameEn: "Libra (Thula)", elementTa: "காற்று", elementEn: "Air", traitTa: "சமநிலை, நியாயம், அழகு மற்றும் இணக்கமான உறவுகள்", traitEn: "Equilibrium, diplomatic fairness, refined grace, and harmonious partnership" },
  { nameTa: "விருச்சிகம்", nameEn: "Scorpio (Vrischika)", elementTa: "நீர்", elementEn: "Water", traitTa: "வைராக்கியம், ஆழ்ந்த ரகசியங்களை அறியும் சக்தி மற்றும் மீளெழும் ஆற்றல்", traitEn: "Intense willpower, psychological depth, and miraculous power of renewal" },
  { nameTa: "தனுசு", nameEn: "Sagittarius (Dhanus)", elementTa: "நெருப்பு", elementEn: "Fire", traitTa: "உண்மை தேடல், உயர் தத்துவ நாட்டம் மற்றும் நேர்மறை பார்வை", traitEn: "Noble pursuit of truth, philosophical idealism, and boundless optimism" },
  { nameTa: "மகரம்", nameEn: "Capricorn (Makara)", elementTa: "நிலம்", elementEn: "Earth", traitTa: "விடாமுயற்சி, பொறுப்புணர்ச்சி மற்றும் சிகரத்தை எட்டும் உழைப்பு", traitEn: "Steely determination, duty-bound integrity, and ascending mastery" },
  { nameTa: "கும்பம்", nameEn: "Aquarius (Kumbha)", elementTa: "காற்று", elementEn: "Air", traitTa: "மனிதாபிமானம், புதுமை சிந்தனை மற்றும் பரந்த மனப்பான்மை", traitEn: "Humanitarian vision, inventive innovation, and expansive egalitarian mind" },
  { nameTa: "மீனம்", nameEn: "Pisces (Meena)", elementTa: "நீர்", elementEn: "Water", traitTa: "எல்லையற்ற கருணை, ஆன்மீக அமைதி மற்றும் பரந்த தியாக குணம்", traitEn: "Boundless universal compassion, spiritual serenity, and selfless surrender" }
];

rasis.forEach(r => {
  addQuote(
    `${r.nameTa} ராசி: ${r.elementTa} தத்துவம் — ${r.traitTa}`,
    `${r.nameEn}: ${r.elementEn} Element — ${r.traitEn}`,
    "ராசி தத்துவம்"
  );
  addQuote(
    `${r.nameTa} ராசியின் இயல்பான பலத்தை அறிந்து செயல்பட்டால் வெற்றி மிக எளிதாகும்`,
    `Harnessing the innate strengths of ${r.nameEn} makes every endeavor effortless and fruitful`,
    "ராசி தத்துவம்"
  );
  addQuote(
    `${r.nameTa} ராசியினரின் நேர்மறை எண்ணங்கள் குடும்பத்திற்கும் சுற்றத்திற்கும் நலம் சேர்க்கும்`,
    `The positive mindset of ${r.nameEn} radiates joy and security to loved ones and community`,
    "ராசி தத்துவம்"
  );
  addQuote(
    `தன்னம்பிக்கையுடன் உழைக்கும் ${r.nameTa} ராசியினருக்கு காலம் எப்போதும் கதவுகளைத் திறந்து வைக்கும்`,
    `To the purposeful soul of ${r.nameEn}, time and fortune perpetually open doors of opportunity`,
    "ராசி தத்துவம்"
  );
  addQuote(
    `${r.nameTa} ராசியின் தர்ம வழியிலான பயணம் வாழ்க்கையை அர்த்தமுள்ளதாக மாற்றுகிறது`,
    `A righteous path walked by ${r.nameEn} transforms existence into an inspiring masterpiece`,
    "ராசி தத்துவம்"
  );
  addQuote(
    `சாந்தமும் விவேகமும் ${r.nameTa} ராசியினரை எந்தச் சூழலிலும் வழிநடத்தும் ஆற்றல் கொண்டவை`,
    `Serenity and discernment grant ${r.nameEn} the sovereign power to master any circumstance`,
    "ராசி தத்துவம்"
  );
});

// 5. 12 Bhavas Wisdom (12 houses x 6 quotes = 72 quotes)
const bhavas = [
  { num: 1, nameTa: "லக்ன பாவம் (தன் பாவம்)", nameEn: "1st House (Lagna / Ascendant)", themeTa: "உடல் நலம், சுய அடையாளம், ஆளுமை மற்றும் ஆயுள்", themeEn: "Physical vitality, selfhood, core personality, and destiny seed" },
  { num: 2, nameTa: "தன பாவம் (இரண்டாம் வீடு)", nameEn: "2nd House (Dhana Bhava)", themeTa: "குடும்ப வளம், செல்வம், சொல்வன்மை மற்றும் உணவு", themeEn: "Family wealth, material security, eloquence of speech, and sustenance" },
  { num: 3, nameTa: "சகஜ பாவம் (மூன்றாம் வீடு)", nameEn: "3rd House (Sahaja Bhava)", themeTa: "தைரியம், இளைய சகோதரம், தகவல் தொடர்பு மற்றும் தன்னம்பிக்கை", themeEn: "Courage, sibling kinship, communication skill, and self-reliance" },
  { num: 4, nameTa: "சுக பாவம் (நான்காம் வீடு)", nameEn: "4th House (Sukha Bhava)", themeTa: "தாய், இல்ல நலம், வாகனம், கல்வி மற்றும் மன அமைதி", themeEn: "Mother, domestic bliss, property, conveyances, education, and heart's peace" },
  { num: 5, nameTa: "புத்திர பாவம் (ஐந்தாம் வீடு)", nameEn: "5th House (Putra Bhava)", themeTa: "பூர்வ புண்ணியம், குழந்தைகள், நுண்ணறிவு மற்றும் ஆன்மீக ஞானம்", themeEn: "Past meritorious karma, progeny, creative genius, and spiritual insight" },
  { num: 6, nameTa: "சத்ரு பாவம் (ஆறாம் வீடு)", nameEn: "6th House (Ari / Shatru Bhava)", themeTa: "கடன், நோய், எதிரிகளை வெல்லும் ஆற்றல் மற்றும் சேவை", themeEn: "Overcoming debt, disease, and competition through disciplined service" },
  { num: 7, nameTa: "களத்திர பாவம் (ஏழாம் வீடு)", nameEn: "7th House (Kalathra Bhava)", themeTa: "திருமண வாழ்க்கை, வாழ்க்கைத் துணை மற்றும் கூட்டாண்மை", themeEn: "Sacred matrimony, life companion, social diplomacy, and noble partnerships" },
  { num: 8, nameTa: "ஆயுள் பாவம் (எட்டாம் வீடு)", nameEn: "8th House (Ayur Bhava)", themeTa: "ஆயுள் பலம், எதிர்பாராத நன்மைகள், மீளெழுச்சி மற்றும் ஆன்ம மாற்றம்", themeEn: "Longevity, sudden transformation, occult depth, and miraculous rebirth" },
  { num: 9, nameTa: "பாக்கிய பாவம் (ஒன்பதாம் வீடு)", nameEn: "9th House (Bhagya Bhava)", themeTa: "தந்தை, குருவருள், அதிர்ஷ்டம், தர்மம் மற்றும் ஆன்மீக நாட்டம்", themeEn: "Divine grace, father's blessing, virtuous fortune, ethics, and higher wisdom" },
  { num: 10, nameTa: "கர்ம பாவம் (பத்தாம் வீடு)", nameEn: "10th House (Karma Bhava)", themeTa: "தொழில், சமூக அந்தஸ்து, புகழுடன் கூடிய கடமையுணர்வு", themeEn: "Career vocation, societal honor, professional excellence, and righteous duty" },
  { num: 11, nameTa: "லாப பாவம் (பதினொன்றாம் வீடு)", nameEn: "11th House (Labha Bhava)", themeTa: "ஆசைகள் நிறைவேறுதல், நண்பர்கள், வருமானம் மற்றும் வெற்றிகள்", themeEn: "Fulfillment of righteous desires, elder siblings, noble friends, and gains" },
  { num: 12, nameTa: "விரய பாவம் (பன்னிரண்டாம் வீடு)", nameEn: "12th House (Vyaya Bhava)", themeTa: "சுப விரயம், ஆன்ம விடுதலை, நித்திரை சுகம் மற்றும் மோட்சம்", themeEn: "Auspicious expenditures, spiritual solitude, restful sleep, and final liberation" }
];

bhavas.forEach(b => {
  addQuote(
    `${b.nameTa}: ${b.themeTa}`,
    `${b.nameEn}: ${b.themeEn}`,
    "பாவ பலன் தத்துவம்"
  );
  addQuote(
    `${b.nameTa} பலமடையும் போது வாழ்க்கையின் அந்த பகுதி பூரண நலம் பெறும்`,
    `When the ${b.nameEn} is dignified, that sphere of life attains flourishing fulfillment`,
    "பாவ பலன் தத்துவம்"
  );
  addQuote(
    `தர்ம சிந்தனையுடன் செயல்படுவது ${b.nameTa} தரும் நற்பலன்களை பன்மடங்கு பெருக்கும்`,
    `Righteous conduct magnifies the auspicious harvest of the ${b.nameEn} tenfold`,
    "பாவ பலன் தத்துவம்"
  );
  addQuote(
    `${b.nameTa} உணர்த்தும் வாழ்க்கை பாடம் நம்மை பக்குவமுள்ள மனிதனாக மாற்றுகிறது`,
    `The life lesson revealed by the ${b.nameEn} matures the soul into noble poise`,
    "பாவ பலன் தத்துவம்"
  );
  addQuote(
    `இறை வழிபாடும் நற்செயலும் ${b.nameTa} அமைந்துள்ள தோஷங்களை எளிதில் அகற்றும்`,
    `Sincere prayer and good deeds dissolve afflictions residing in the ${b.nameEn}`,
    "பாவ பலன் தத்துவம்"
  );
  addQuote(
    `${b.nameTa} வழிகாட்டும் பாதையில் தன்னம்பிக்கையுடன் நடைபோடுங்கள்`,
    `Step forward with sovereign confidence along the illuminated path of ${b.nameEn}`,
    "பாவ பலன் தத்துவம்"
  );
});

// 6. Dasa, Time Cycles & Cosmic Timing (40 quotes)
const dasaQuotes = [
  ["காலம் என்பது பிரபஞ்சத்தின் மகத்தான ஆசிரியர்; தசா புக்திகள் அதன் பாடவேளைகள்", "Time is the supreme cosmic teacher; dasa-bhuktis are its illuminating lessons"],
  ["தசா காலம் மாறும் போது மனிதனின் எண்ணங்களும் வாழ்க்கை சூழ்நிலைகளும் மாறுகின்றன", "When the dasa cycle shifts, perspectives evolve and life circumstances transform"],
  ["கடினமான தசா காலத்திலும் நம்பிக்கையை இழக்காதவரே இறுதியில் சாதனையாளராகிறார்", "He who preserves unyielding faith through arduous dasas emerges as the ultimate victor"],
  ["சூரிய தசை ஆன்ம பலத்தையும் பொதுவாழ்வில் கௌரவத்தையும் பெற்றுத் தருகிறது", "The Sun's dasha bestows vibrant soul force and elevated public honor"],
  ["சந்திர தசை குடும்ப மகிழ்ச்சியையும் மனத்தெளிவையும் அன்பையும் பொழிகிறது", "The Moon's dasha showers domestic peace, mental clarity, and tender affection"],
  ["செவ்வாய் தசை தடைகளை உடைத்து எறியும் வீரத்தையும் நில யோகத்தையும் அளிக்கிறது", "Mars dasha infuses barrier-breaking courage and prosperous land holdings"],
  ["ராகு தசை வியத்தகு திருப்பங்களையும் தொலைநோக்குப் பார்வையும் பரிசளிக்கிறது", "Rahu dasha presents extraordinary breakthroughs and far-reaching global perspective"],
  ["குரு தசை ஞானத்தையும் செல்வச் செழிப்பையும் சந்ததி மேன்மையையும் அருளுகிறது", "Jupiter dasha grants profound wisdom, overflowing wealth, and noble lineage"],
  ["சனி தசை நேர்மையான உழைப்புக்கு தலைமுறைக்கும் அழியாத வெற்றியைத் தருகிறது", "Saturn dasha rewards honest, tireless labor with enduring multi-generational success"],
  ["புதன் தசை புத்தி கூர்மையையும் வணிக வளர்ச்சியையும் கலைத்திறனையும் கூட்டுகிறது", "Mercury dasha enhances mental sharpness, commercial expansion, and eloquence"],
  ["கேது தசை அக அமைதியையும் ஆன்மீக முதிர்ச்சியையும் தெளிந்த பார்வையும் ஊட்டுகிறது", "Ketu dasha nurtures deep inner calm, spiritual maturity, and unclouded vision"],
  ["சுக்கிர தசை கலை இன்பங்களையும் செல்வத்தையும் இனிமையான இல்லறத்தையும் தருகிறது", "Venus dasha brings aesthetic delight, material abundance, and blissful wedded life"],
  ["தசா புக்தி அறிந்து காரியங்களை திட்டமிடுபவர் எப்போதும் தோல்வியைத் தழுவுவதில்லை", "One who plans endeavors in harmony with planetary periods rarely tastes defeat"],
  ["நேரம் வரும் வரை காத்திருப்பதும், நேரம் வந்ததும் தவறாமல் உழைப்பதும் ஜோதிட நீதி", "Waiting patiently until the auspicious time arrives, then toiling fearlessly, is astrological wisdom"],
  ["ஒவ்வொரு வினாடியும் பிரபஞ்சம் நம்மை மெருகேற்றிக் கொண்டே இருக்கிறது", "With every passing heartbeat, the universe ceaselessly sculpts us toward perfection"],
  ["சுபமான தசா காலத்தில் செய்யும் முதலீடுகளும் முயற்சிகளும் அமோக பலன் தரும்", "Initiatives seeded during auspicious periods yield golden, abundant harvests"],
  ["கோட்சார கிரகங்களின் சஞ்சாரம் தினசரி வாழ்வின் மனநிலையை வழிநடத்துகிறது", "Planetary transits quietly illuminate and guide our day-to-day moods and actions"],
  ["நல்ல நேரம் என்பது நாம் நல்லெண்ணத்தோடு தொடங்கும் ஒவ்வொரு நேரமுமாகும்", "An auspicious moment is any moment begun with a pure and benevolent heart"],
  ["காலத்தின் அருமையை உணர்ந்தவர் கிரகங்களின் ஆசியை எளிதில் ஈர்க்கிறார்", "He who treasures the sanctity of time naturally attracts celestial benevolence"],
  ["புயல் போன்ற தசா காலத்திலும் தர்மம் உங்களை பாதுகாக்கும் கவசமாய் நிற்கும்", "Even amidst turbulent dasas, personal integrity stands as an impenetrable armor"],
  ["காலசக்கரம் சுழன்று கொண்டே இருக்கிறது; இருளுக்குப் பின் ஒளி நிச்சயம் வரும்", "The cosmic wheel ever turns; after the deepest shadow, dawn is an absolute certainty"],
  ["சரியான நேரத்தில் விதைக்கப்பட்ட விதை மட்டுமே விருட்சமாய் வளரும்", "Only a seed planted at the proper celestial season blossoms into a sheltering banyan"],
  ["தசா மாற்றம் உங்கள் வாழ்க்கையில் புதிய அத்தியாயத்தை தொடங்கி வைக்கிறது", "A shift in planetary periods marks the majestic opening of a brand new life chapter"],
  ["துன்பமான காலமும் கடந்து போகும்; இன்பமான காலமும் நிதானத்தைக் கோரும்", "Distressful times shall pass; prosperous times call for humility and restraint"],
  ["கிரக கால அட்டவணை உங்களுக்குள் இருக்கும் திறமையை வெளிக்கொணரும் கருவி", "The astrological timetable is the divine compass that draws forth your latent potential"],
  ["காலத்தை மதித்து வாழ்பவனை காலமும் கிரகங்களும் தலைவணங்கி வரவேற்கும்", "He who honors time is greeted with reverence by the cosmos and planetary forces"],
  ["எந்த ஒரு நிலையும் நிரந்தரமல்ல; தொடர்ந்து முன்னேறுவதே பிரபஞ்ச நியதி", "No condition is permanent; perpetual upward progress is the cosmic law"],
  ["விவேகமுள்ள ஜோதிட வழிகாட்டல் காலத்தின் சவால்களை எளிதாகக் கடக்க உதவும்", "Prudent astrological counsel transforms life's rocky challenges into gentle slopes"],
  ["உகந்த நேரத்தில் தொடங்கும் நற்காரியம் தடைகளின்றி நிறைவடையும்", "A noble endeavor begun at the rightful muhurtha reaches completion without hindrance"],
  ["சந்திரனின் சஞ்சாரம் உங்கள் அன்றாட பணிகளுக்கு திசை காட்டுகிறது", "The Moon's daily transit gently shows the most harmonious direction for daily work"],
  ["குருவின் கோட்சார பார்வை கடினமான தசா காலத்தையும் சுபமாக மாற்றும்", "Jupiter's transit aspect transmutes even the most demanding period into a blessing"],
  ["கடின உழைப்புக்கு கிரகங்கள் எப்போதும் தங்கள் மரியாதையை செலுத்துகின்றன", "The planetary lords eternally pay homage to sincere and relentless diligence"],
  ["விடியல் எப்போது வரும் என்பதை அறிந்த பயணி இரவைக் கண்டு அஞ்சுவதில்லை", "The traveler who knows when dawn arrives never cowers before the night"],
  ["நேரத்தின் மதிப்பைப் புரிந்து கொள்வதே ஜோதிடத்தின் முதல் பாடம்", "Appreciating the infinite worth of time is the foundational lesson of astrology"],
  ["இறைவனின் காலக்கணக்கில் ஒவ்வொரு நிகழ்வுக்கும் ஒரு பொருள் உண்டு", "In the Divine calendar, every single event is imbued with sacred meaning"],
  ["தசா நாதனின் விருப்பத்தை அறிந்து நடப்பவர் வாழ்க்கையில் அமைதியைக் காண்கிறார்", "He who understands the lessons of the ruling dasha lord finds deep peace in life"],
  ["சந்தர்ப்பங்கள் நழுவும் முன் விழிப்போடு செயல்பட ஜோதிடம் துணைபுரிகிறது", "Astrology empowers us to act with vigilance before golden opportunities slip away"],
  ["பிரபஞ்சத்தின் கால ஓட்டத்தில் நாம் ஒவ்வொருவரும் ஒரு முக்கிய அங்கம்", "In the grand cosmic stream of time, each of us plays an irreplaceable role"],
  ["தாமதம் என்பது தோல்வி அல்ல; அது பிரபஞ்சம் தரும் தயாரிப்பு காலம்", "A delay is never defeat; it is the universe gifting you vital preparation time"],
  ["நம்பிக்கையோடு நடைபோடுங்கள்; காலம் உங்கள் பக்கம் சுழன்று வருகிறது", "Walk forward with unshakable hope; the wheel of time is turning in your favor"]
];

dasaQuotes.forEach(([ta, en]) => addQuote(ta, en, "தசா கால தத்துவம்"));

// 7. Karma, Dharma, Free Will & Pariharam (50 quotes)
const karmaQuotes = [
  ["கர்மா என்பது நாம் விதைத்த விதை; தர்மம் என்பது அதை நல்வழியில் அறுவடை செய்யும் கலை", "Karma is the seed we have sown; dharma is the noble art of reaping it well"],
  ["முந்தைய வினைகளை நல்லெண்ணங்களாலும் நற்செயல்களாலும் மாற்றியமைக்க முடியும்", "Past karmic imprints can be transmuted through virtuous thoughts and noble deeds"],
  ["பரிகாரம் என்பது லஞ்சமல்ல; அது இறைவனிடம் காட்டும் மெய்யான மனமாற்றம்", "A remedy is not a transaction; it is a genuine inner transformation before the Divine"],
  ["எளியோருக்கு செய்யும் உணவளித்தலே கிரகங்களை மகிழ்விக்கும் உன்னத பரிகாரம்", "Feeding the hungry is the supreme celestial remedy that delights all the planets"],
  ["மன்னிக்கும் குணம் கொண்ட இதயத்தில் கிரக தோஷங்கள் தங்குவதில்லை", "Afflictions of planetary doshas cannot reside in a heart that generously forgives"],
  ["தர்மத்தின் வழியில் ஈட்டப்படும் செல்வமே நிலைத்து நின்று சந்ததியை வாழ வைக்கும்", "Wealth acquired along the path of dharma endures and blesses future generations"],
  ["விதியை மதியால் வெல்லலாம் என்பது முன்னோர்கள் நமக்குக் கற்பித்த பொன்மொழி", "That intellect can master destiny is the golden adage handed down by our ancestors"],
  ["தாய் தந்தையரை பேணிப் பாதுகாப்பதே தலையாய ஜோதிட பரிகாரம்", "Cherishing and protecting one's parents is the foremost astrological remedy"],
  ["இயற்கையை நேசிப்பதும் மரங்களை நடுவதும் பூமாதேவியின் அருளைப் பெற்றுத் தரும்", "Cherishing nature and planting trees draw down the tender blessings of Mother Earth"],
  ["பறவைகளுக்கும் விலங்குகளுக்கும் உணவளிப்பது ராகு கேதுவின் தீவிரத்தை தணிக்கும்", "Feeding birds and animals soothes the turbulent intensities of Rahu and Ketu"],
  ["கோவில்களில் எரியும் விளக்கு போல நம் மனதிலும் தர்மத்தின் ஒளி எரிய வேண்டும்", "Like the sacred oil lamps in temples, let the flame of dharma burn brightly in our hearts"],
  ["காயத்ரி மந்திர ஜபம் மனதை தூய்மைப்படுத்தி கிரக கதிர்வீச்சுகளை சீராக்கும்", "Recitation of the Gayatri Mantra purifies the psyche and harmonizes cosmic rays"],
  ["சுயநலமற்ற பிரார்த்தனை தனக்கு மட்டுமல்ல, உலகிற்கே அமைதியைத் தரும்", "Selfless prayer brings tranquility not merely to the seeker, but to the entire world"],
  ["நமது செயல்களே நமது விதியின் சிற்பிகள்", "Our conscious actions today are the true sculptors of our tomorrow's destiny"],
  ["கோபத்தை கைவிடுவதே செவ்வாய்க்கும் சனிக்கும் மிகச்சிறந்த சாந்தி பரிகாரம்", "Relinquishing anger is the finest propitiation for both Mars and Saturn"],
  ["வாய்மையே வெல்லும்; உண்மை பேசுபவனுக்கு கிரகங்கள் ஒருபோதும் கெடுதல் செய்யாது", "Truth alone triumphs; to the speaker of truth, planetary forces bring only blessings"],
  ["பிறர் பொருளுக்கு ஆசைப்படாமல் வாழ்வதே லட்சுமி கடாட்சத்தின் ரகசியம்", "Living without coveting another's possessions is the true secret of lasting fortune"],
  ["சிரத்தையோடு செய்யப்படும் குலதெய்வ வழிபாடு குடும்பத்தைக் காக்கும் கோட்டை", "Devout worship of one's ancestral family deity is an impenetrable protective fortress"],
  ["பிறருக்கு செய்யும் சிறு உதவியும் பிரபஞ்சக் கணக்கில் பெரும் புண்ணியமாய் சேரும்", "A modest kindness offered to another accumulates as immense merit in the cosmic ledger"],
  ["பக்தியும் பணிவும் இருந்தால் எத்தகைய விதியையும் சுபமாக மாற்றிவிடலாம்", "With pure devotion and sincere humility, any fate can be guided toward grace"],
  ["கண்ணீர் சிந்தும் ஒருவருக்கு உதவும் கைகளே இறைவனின் திருக்கரங்கள்", "The hands that wipe away another's tears are the living hands of God"],
  ["தன்னலமற்ற உழைப்பு எந்தவொரு பரிகார சடங்கையும் விட மேலானது", "Selfless service is infinitely more potent than any outward ritualistic ceremony"],
  ["மனசாட்சிக்கு பயந்து நடப்பவனுக்கு எந்தக் கிரகமும் தண்டனை தருவதில்லை", "To the one who lives in awe of conscience, no planet ever metes out punishment"],
  ["மௌனமாக இருக்கும் தியானம் மனதின் அலைகளை அடக்கி அமைதியைத் தரும்", "Silent meditation stills the restless waves of the mind, ushering in sublime peace"],
  ["பிறர் குறைகளை மன்னிப்பது நம்முடைய கர்ம பாரத்தை பெருமளவு குறைக்கும்", "Pardoning the flaws of others significantly lightens our own karmic baggage"],
  ["இறை நம்பிக்கை என்பது இருளில் கூட வெளிச்சம் தரும் அகவிளக்கு", "Faith in the Divine is an inner lamp that radiates light even in total darkness"],
  ["அன்னதானம் செய்வதால் பித்ரு தோஷங்களும் கிரக தோஷங்களும் அகலும்", "Offering food in charity dissolves ancestral afflictions and planetary imbalances"],
  ["உண்மை, அன்பு, ஒழுக்கம் — இவையே வாழ்க்கையின் முப்பெரும் ஜோதிட ரகசியங்கள்", "Truth, unconditional love, and moral discipline — these are life's three greatest secrets"],
  ["நமது எண்ணங்களே நமது எதிர்காலத்தை உருவாக்கும் காந்த சக்திகள்", "Our thoughts are magnetic currents that continuously weave our future reality"],
  ["எந்த உயிரையும் துன்புறுத்தாமல் வாழ்வதே தலைசிறந்த ஆன்மீக யோகம்", "Living without causing harm to any sentient being is the supreme spiritual yoga"],
  ["மனதில் நேர்மை இருந்தால் கிரகங்களின் சஞ்சாரம் எப்போதும் வெற்றியைத் தரும்", "When honesty reigns in the heart, every planetary transit culminates in victory"],
  ["நல்ல செயல்கள் ஒருபோதும் வீண் போவதில்லை; அவை காலம் வரும்போது பலன் தரும்", "Good deeds are never wasted; they faithfully bear fruit when the season ripens"],
  ["பிரார்த்தனை என்பது கேட்பதல்ல; பிரபஞ்சத்தின் சங்கல்பத்தோடு இணைவது", "Prayer is not demanding from God; it is attuning the soul to cosmic harmony"],
  ["சுத்தமான உள்ளமே இறைவன் விரும்பி தங்கும் புனித ஆலயம்", "A pure, unblemished heart is the sacred shrine where the Divine loves to dwell"],
  ["பிறர் நலம் நாடும் மனிதனை இந்த அகிலமே தாங்கிப் பிடிக்கிறது", "The entire cosmos tenderly supports the human being who seeks the welfare of all"],
  ["தன்னம்பிக்கை குறையாத மனிதனுக்கு தடைகள் அனைத்தும் படிக்கட்டுகளே", "To the person whose faith never wavers, every obstacle is a stepping stone to glory"],
  ["உழைப்பால் விதியை மாற்றியமைக்கும் ஆற்றல் மனித மனதிற்கு உண்டு", "The human spirit possesses the sovereign power to rewrite fate through noble toil"],
  ["மங்களகரமான எண்ணங்களே மங்களகரமான வாழ்க்கையை உருவாக்குகின்றன", "Auspicious, uplifting thoughts naturally construct an auspicious, fulfilling life"],
  ["பொறுமை காக்கும் மனிதனுக்கு வெற்றி உரிய நேரத்தில் வந்து சேரும்", "To the human soul anchored in patience, victory arrives at the perfect moment"],
  ["வாழ்வின் ஒவ்வொரு அனுபவமும் ஆன்மாவை பக்குவப்படுத்தும் பாடமே", "Every experience encountered in life is a curriculum designed to ripen the soul"],
  ["பிரபஞ்சம் நேர்மறை ஆற்றலை நேர்மறையாகவே திருப்பி அனுப்புகிறது", "The universe eternally mirrors positive energy back with multiplied abundance"],
  ["நல்ல மனிதர்களின் ஆசியும் வழிகாட்டலும் வாழ்க்கையின் பெரும் பாதுகாப்பு", "The blessings and counsel of noble souls form life's most formidable protective armor"],
  ["தீய எண்ணங்களை கைவிடுவதே மிகச்சிறந்த ஆன்மீக சுத்தி", "Abandoning malevolent thoughts is the purest form of spiritual cleansing"],
  ["கடமையைச் செய்; பலனை பிரபஞ்சத்தின் நல்வழியில் விட்டுவிடு", "Perform your duty with devotion; leave the outcome gracefully to cosmic order"],
  ["எளிமையான வாழ்வும் உயரிய சிந்தனையும் மன அமைதியின் இரு கண்கள்", "Simple living and high thinking are the twin eyes of unshakeable inner peace"],
  ["இறைவனின் கருணை கடல் போன்றது; அதை அடைய பணிவு என்னும் பாத்திரம் தேவை", "Divine grace is like an infinite ocean; the vessel of humility is required to draw from it"],
  ["நற்காரியங்களை தாமதமின்றி தொடங்குவதே வெற்றியின் ரகசியம்", "Commencing noble works without hesitation is the open secret of lasting success"],
  ["அமைதியான உள்ளத்தில் மட்டுமே இறைவனின் குரலை தெளிவாகக் கேட்க முடியும்", "Only within a calm, undisturbed heart can the gentle voice of the Divine be heard"],
  ["பிறருக்கு மகிழ்ச்சியைத் தரும் மனிதன் தானும் எல்லையற்ற மகிழ்ச்சியைப் பெறுகிறான்", "He who bestows happiness upon others receives infinite, unalloyed bliss in return"],
  ["தர்மம் தலைகாக்கும்; கிரகங்களின் ஆசி என்றும் உங்கள் வாழ்வை ஒளிரச் செய்யும்", "Righteousness ever protects; may the blessings of the planets illumine your life"]
];

karmaQuotes.forEach(([ta, en]) => addQuote(ta, en, "கர்மா & தர்மம்"));

// 8. Panchangam & Daily Cosmic Rhythms (40 quotes)
const panchangamQuotes = [
  ["பஞ்சாங்கம் என்பது பிரபஞ்சத்தின் ஐந்து மகா தத்துவங்களின் சங்கமம்", "Panchanga is the sacred confluence of the five cosmic elements of creation"],
  ["திதி மனதின் உணர்வுகளையும், வாரம் ஆயுள் பலத்தையும் குறிக்கிறது", "Tithi governs mental flow, while Vara (weekday) vitalizes physical longevity"],
  ["நட்சத்திரம் ஆன்மாவின் இயல்பையும், யோகம் கர்ம பலனையும் காட்டுகிறது", "Nakshatra reflects the soul's nature, while Yoga reveals the fruits of karma"],
  ["கரணம் செய்யும் செயல்களின் வெற்றியைத் தீர்மானிக்கும் ஆற்றல் வாய்ந்தது", "Karana possesses the power to determine the fruitful success of human actions"],
  ["பிரம்ம முகூர்த்தத்தில் தொடங்கும் நாள் முழுவதும் தெய்வீக அமைதி நிறையும்", "A day begun during the Brahma Muhurtha fills with divine stillness and clarity"],
  ["திதிகளில் வளர்பிறை வளர்ச்சியையும், தேய்பிறை அகத்தூய்மையையும் குறிக்கும்", "In tithis, Shukla paksha signifies growth, while Krishna paksha nurtures inner purity"],
  ["ஞாயிற்றுக்கிழமை சூரிய வழிபாடு ஆன்ம பலத்தையும் ஆரோக்கியத்தையும் பெருக்கும்", "Sunday worship of the Sun multiplies spiritual radiance and physical health"],
  ["திங்கட்கிழமை சிவ வழிபாடு மன அமைதியையும் சந்திர பலத்தையும் தரும்", "Monday worship of Lord Shiva bestows serenity of mind and lunar blessings"],
  ["செவ்வாய்க்கிழமை முருக வழிபாடு தைரியத்தையும் நில யோகத்தையும் அருளும்", "Tuesday worship of Lord Muruga grants fearless courage and property prosperity"],
  ["புதன்கிழமை பெருமாள் வழிபாடு அறிவையும் வணிக வளர்ச்சியையும் பெருக்கும்", "Wednesday worship of Lord Perumal expands intellectual brilliance and commercial gain"],
  ["வியாழக்கிழமை தட்சிணாமூர்த்தி வழிபாடு ஞானத்தையும் குருவருளையும் தரும்", "Thursday worship of Dakshinamurthy showers supreme wisdom and Guru's grace"],
  ["வெள்ளிக்கிழமை அம்பாள் வழிபாடு செல்வத்தையும் இல்லற இன்பத்தையும் அருளும்", "Friday worship of the Divine Mother bestows prosperity and harmonious home life"],
  ["சனிக்கிழமை ஆஞ்சநேயர் வழிபாடு சனி தோஷங்களை அகற்றி தைரியம் அளிக்கும்", "Saturday worship of Lord Hanuman dispels Saturnine trials and instills valor"],
  ["அமிர்த யோகத்தில் தொடங்கும் நற்காரியங்கள் குறைவின்றி நிறைவேறும்", "Noble endeavors initiated during Amrita Yoga reach flawless fulfillment"],
  ["சுப முகூர்த்தம் என்பது கிரகங்கள் நமக்கு வழங்கும் தெய்வீக ஆசீர்வாதம்", "An auspicious muhurtha is the universe opening its portals of celestial grace"],
  ["பஞ்சாங்க கணிப்பு இயற்கையோடு இயைந்து வாழ மனிதனுக்கு உதவும் வழிகாட்டி", "Panchanga calculations are nature's manual aiding humanity to live in cosmic rhythm"],
  ["தினசரி பஞ்சாங்கத்தை அறிவது பிரபஞ்சத்தோடு நம்மை இணைத்துக் கொள்வதாகும்", "Tuning into the daily panchangam harmonizes our consciousness with cosmic currents"],
  ["ராகு காலம் தவிர்த்து நற்பணிகளை தொடங்குவது தடைகளைத் தவிர்க்க உதவும்", "Beginning important works outside Rahu Kalam prevents avoidable obstacles"],
  ["குளிகை நேரத்தில் சுப காரியங்களை தொடங்குவது அந்த சுபத்தை பன்மடங்கு பெருக்கும்", "Initiating auspicious deeds during Gulika Kalam multiplies their blessings perpetually"],
  ["அபிஜித் முகூர்த்தம் எந்த தோஷத்தையும் நீக்கி வெற்றி தரும் ஆற்றல் கொண்டது", "Abhijit Muhurtha possesses the supreme virtue of neutralizing flaws and ensuring victory"],
  ["பிரதோஷ வழிபாடு சகல பாவங்களையும் போக்கி மன அமைதியை அருளும்", "Pradosham worship cleanses all karmic blemishes and ushers in profound peace"],
  ["ஏகாதசி விரதம் உடலையும் மனதையும் தூய்மைப்படுத்தும் உன்னத யோகமாகும்", "Ekadashi fasting is a sacred spiritual discipline that purifies body and consciousness"],
  ["சங்கடஹர சதுர்த்தி வழிபாடு காரியத் தடைகளை வேரோடு நீக்கும்", "Sankashti Chaturthi worship uproots all hindrances and paves the way to accomplishment"],
  ["பௌர்ணமி நிலவின் ஒளி மனதிற்கு அமைதியையும் ஆன்மீக ஆற்றலையும் ஊட்டுகிறது", "The Full Moon radiance infuses the mind with serene calm and spiritual vitality"],
  ["அமாவாசை நாளில் முன்னோருக்கு செய்யும் தர்ப்பணம் குடும்ப நலம் காக்கும்", "Tarpanam offered to ancestors on Amavasya protects and blesses family welfare"],
  ["சூரிய உதயம் என்பது பிரபஞ்சத்தின் புதிய விழிப்புணர்வு தருணம்", "Sunrise is the sacred moment of cosmic reawakening for all living beings"],
  ["சூரிய அஸ்தமனம் நன்றியுணர்வோடு நாளை நிறைவு செய்யும் அமைதி நேரம்", "Sunset is the tranquil hour to conclude the day with reverence and gratitude"],
  ["நாளின் ஒவ்வொரு ஹோரைக்கும் ஒரு கிரகத்தின் ஆதிக்கம் உண்டு", "Every planetary hora of the day is governed by a distinct celestial energy"],
  ["குரு ஹோரையில் தொடங்கும் கல்வி மற்றும் ஆன்மீக முயற்சிகள் சிறந்து விளங்கும்", "Educational and spiritual endeavors commenced during Guru Hora attain great renown"],
  ["சுக்கிர ஹோரையில் செய்யும் சுப காரியங்கள் மங்களகரமான பலன்களைத் தரும்", "Auspicious activities performed in Sukra Hora yield delightfully harmonious results"],
  ["சூரிய ஹோரையில் முக்கிய முடிவுகளை எடுப்பது நற்பலனைத் தரும்", "Taking important leadership decisions during Surya Hora brings commanding success"],
  ["புதன் ஹோரையில் வியாபார ஒப்பந்தங்களை தொடங்குவது லாபம் ஈட்டித் தரும்", "Concluding commercial agreements during Budha Hora ensures lucrative prosperity"],
  ["சந்திர ஹோரையில் பயணங்களையும் பொது விவகாரங்களையும் தொடங்குவது நன்று", "Beginning journeys and public matters during Chandra Hora flows with ease"],
  ["செவ்வாய் ஹோரையில் தைரியமான முடிவுகளும் விளையாட்டுப் பயிற்சிகளும் சிறக்கும்", "Bold initiatives and athletic training thrive under the dynamic pulse of Mars Hora"],
  ["பஞ்சாங்கத்தை மதித்து செயல்படுபவன் இயற்கையின் பேரருளை எளிதில் பெறுகிறான்", "He who acts in harmony with the panchangam effortlessly receives nature's bounty"],
  ["சுபமான நேரத்தில் செய்யப்படும் தானம் ஆயிரம் மடங்கு பலனைத் தரும்", "Charity offered at an auspicious planetary moment returns a thousandfold blessing"],
  ["வானியல் விதிகளுக்கு உட்பட்ட மனித வாழ்வு என்றும் திசை மாறுவதில்லை", "A human life aligned with celestial rhythm never loses its righteous orientation"],
  ["பிரபஞ்சத்தின் கால ஓட்டம் நமக்கு பொறுமையையும் நம்பிக்கையையும் கற்பிக்கிறது", "The cosmic passage of time teaches humanity the sublime arts of patience and faith"],
  ["நேரத்தை அறிந்து கடமையைச் செய்பவன் காலத்தை வென்ற ஞானியாகிறான்", "He who acts knowing the auspicious moment becomes a master of time and destiny"],
  ["கோட்ப்பேக்ர ஆஸ்ட்ரோ — பாரம்பரிய ஜோதிட ஞானத்தை உங்கள் விரல் நுனியில் கொண்டு சேர்க்கிறது", "CodePackr Astro — bringing the sacred treasure of classical Vedic astrology to your fingertips"]
];

panchangamQuotes.forEach(([ta, en]) => addQuote(ta, en, "பஞ்சாங்க தத்துவம்"));

console.log(`Total generated quotes: ${quotes.length}`);

// Write to src/lib/astro/quotes.ts
const content = `// CodePackr Astro - Curated Vedic Astrology & Wisdom Quotes (500+ Quotes)
// Automatically rotates every 30 seconds across the platform.

export interface AstroQuote {
  id: number;
  ta: string;
  en: string;
  author: string;
  category: string;
}

export const ASTRO_QUOTES: AstroQuote[] = ${JSON.stringify(quotes, null, 2)};

export function getRandomQuote(): AstroQuote {
  const index = Math.floor(Math.random() * ASTRO_QUOTES.length);
  return ASTRO_QUOTES[index];
}

export function getQuoteByIndex(index: number): AstroQuote {
  const safeIndex = ((index % ASTRO_QUOTES.length) + ASTRO_QUOTES.length) % ASTRO_QUOTES.length;
  return ASTRO_QUOTES[safeIndex];
}
`;

const outputPath = path.join(__dirname, "..", "src", "lib", "astro", "quotes.ts");
fs.writeFileSync(outputPath, content, "utf8");
console.log(`Successfully written ${quotes.length} quotes to ${outputPath}`);
