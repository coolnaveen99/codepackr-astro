// Codepackr Astro — Calculation Method & Astronomical Transparency Documentation
import { useState } from "react";
import {
  ShieldCheck,
  Compass,
  Cpu,
  Orbit,
  CalendarDays,
  Clock,
  BookOpen,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  ExternalLink,
} from "lucide-react";
import { PRODUCTION_PROFILE } from "@/lib/astro/provenance/profile";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";

interface CalculationMethodViewProps {
  lang: Lang;
}

export function CalculationMethodView({ lang }: CalculationMethodViewProps) {
  const isTa = lang === "ta";
  const { go } = useNav();
  const [filterQuery, setFilterQuery] = useState("");

  const sections = [
    {
      id: "zodiac",
      titleTa: "1. நிரயன ராசி மண்டலம் & சித்திரபக்ஷ / லஹிரி அயனாம்சம்",
      titleEn: "1. Sidereal Zodiac (Nirayana) & Chitrapaksha / Lahiri Ayanamsa",
      icon: Compass,
      contentTa: `கோடேபேக்கர் அஸ்ட்ரோ (CodePackr Astro) பாரம்பரிய தமிழ் மற்றும் இந்திய வேத ஜோதிடத்தின் மிக அடிப்படையான 'நிரயன' (Sidereal) ராசி மண்டலத்தைப் பயன்படுத்துகிறது. 
மேற்கத்திய அயன ராசி மண்டலத்தைப் போல் அல்லாமல், விண்மீன்களின் உண்மையான பின்னணியில் கிரகங்களின் நிலை கணக்கிடப்படுகிறது.

• அயனாம்ச முறை: சித்திரபக்ஷ (லஹிரி) அயனாம்சம் (Chitrapaksha / Lahiri Ayanamsa).
• J2000.0 திட்ட அளவு: 23° 51' 11.2" (IAU 2000 precession polynomial அடிப்படையில் துல்லியமாக கணக்கிடப்படுகிறது).
• பிற முறைகளுடனான வேறுபாடு: பி.வி. ராமன் முறை (+1° 26' அதிகம்), கிருஷ்ணமூர்த்தி (KP) முறை (-0° 06' குறைவு). எங்கள் முறை இந்திய அரசு பஞ்சாங்கக் குழு (Calendar Reform Committee 1952) மற்றும் திருக்கணித மரபோடு முழுமையாக ஒத்திருக்கிறது.`,
      contentEn: `CodePackr Astro strictly adheres to the Sidereal (Nirayana) zodiac system, which aligns astronomical planetary longitudes directly against the fixed stellar backdrop.

• Ayanamsa Model: Chitrapaksha / Lahiri Ayanamsa.
• J2000.0 Epoch Value: 23° 51' 11.2" (continuously evaluated via IAU 2000 precession polynomial).
• Distinction from other systems: Raman (+1°26') and KP (-0°06'). Our model directly matches the Government of India Calendar Reform Committee (1952) and traditional Thirukanitham Panchangams.`,
    },
    {
      id: "ephemeris",
      titleTa: "2. நாசா JPL DE440 & VSOP87 வானியல் கணக்கீடு",
      titleEn: "2. NASA JPL DE440 & Analytical VSOP87 Ephemeris",
      icon: Orbit,
      contentTa: `கிரகங்களின் நிலைகள் தோராயமான சூத்திரங்களால் கணக்கிடப்படாமல், உயர் துல்லிய வானியல் கணித மாதிரிகள் மூலம் பெறப்படுகின்றன.

• சூரியன், சந்திரன் மற்றும் 8 கிரகங்களின் உண்மை தொலைவு, புவிமையத் தீர்க்கரேகை (Geocentric Ecliptic Longitude).
• ஒளி பயண நேரம் (Light-Time Correction), கிரக ஒளிவிலகல் (Planetary Aberration) மற்றும் சயன அசைவு (Nutation in Longitude).
• ஒப்பீட்டு துல்லியம்: நாசா JPL DE440 மற்றும் சுவிஸ் எஃபிமெரிஸ் (Swiss Ephemeris) ஒப்பீட்டில் 60 விநாடிகள் (arcseconds) உட்பட்ட பிழையின்றி இயங்குகிறது.`,
      contentEn: `Planetary positions are derived from high-precision analytical orbital ephemeris models verified against NASA JPL DE440 standards.

• Evaluates True Geometric and Apparent Geocentric Ecliptic Longitudes for the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.
• Accounts for light-time correction, planetary aberration, and nutation in longitude.
• Tolerance: Ephemeris positions match Swiss Ephemeris / JPL DE440 within an ultra-strict tolerance of under 60 arcseconds.`,
    },
    {
      id: "nodes",
      titleTa: "3. ராகு & கேது (சாயா கிரகங்கள்)",
      titleEn: "3. Lunar Nodes: Mean Rahu & Ketu",
      icon: Cpu,
      contentTa: `• ராகு மற்றும் கேது சராசரி கணக்கீட்டு முறைப்படி (Mean Node) கணக்கிடப்படுகிறது.
• சமச்சீர் விதி: கேது எப்போதும் ராகுவிற்கு நேர் எதிரில் 180° பாகையில் (Ketu = Rahu + 180°) துல்லியமாக நிலைநிறுத்தப்படுகிறது.
• தமிழ்ப் பாரம்பரிய மரபின்படி எப்போதும் பின்னோக்கிய (வக்ர) இயக்கத்தில் இயங்குகின்றன.`,
      contentEn: `• Rahu and Ketu are calculated using the astronomical Mean Node model.
• Symmetry Invariant: Ketu is mathematically locked exactly 180° opposite to Rahu (Ketu = (Rahu + 180°) % 360°).
• Consistent with classical South Indian astrology, the Mean nodes exhibit smooth retrograde movement across the zodiac.`,
    },
    {
      id: "houses",
      titleTa: "4. முழு ராசி பாவ முறை (Whole Sign House System)",
      titleEn: "4. Whole Sign House System (Rasi = Bhava)",
      icon: BookOpen,
      contentTa: `• தென்னிந்திய மற்றும் தமிழ் பாரம்பரியத்தில் லக்னம் விழுந்த ராசியே முதல் பாவம் (1st House) ஆகும்.
• லக்னப் புள்ளி (RAMC & Local Sidereal Time): பிறந்த நேர விநாடி, அட்சரேகை மற்றும் தீர்க்கரேகை கொண்டு துல்லிய லக்ன பாகை கணக்கிடப்படுகிறது.
• 12 பாவங்களும் முழு ராசிகளாக பிரிக்கப்பட்டு (Whole Sign), நவாம்சம் முதல் ஷஷ்டியாம்சம் (D60) வரையிலான 16 வர்க்க கட்டங்களிலும் சம பலத்துடன் சோதிக்கப்படுகிறது.`,
      contentEn: `• CodePackr Astro utilizes the Whole Sign house system where the sign containing the Ascendant degree constitutes the entire 1st house (Janma Lagna).
• Exact Lagna Longitude: Derived from Right Ascension of the Medium Coeli (RAMC), Local Sidereal Time (LST), and geographic coordinates.
• Clean divisional mapping: D1 through D60 divisional charts align with established Whole Sign and Parasari harmonic rules.`,
    },
    {
      id: "panchangam",
      titleTa: "5. நிகழ்வு சார்ந்த பஞ்சாங்கம் & சூரியோதய கணக்கீடு",
      titleEn: "5. Event-Based Panchangam & Sunrise Calculations",
      icon: CalendarDays,
      contentTa: `பொதுவான 6:00 AM போலி கணக்கீடுகள் இன்றி, அட்சரேகை மற்றும் வளிமண்டல ஒளிவிலகலை (-0.833° solar disc refraction) கருத்தில் கொண்டு துல்லிய சூரியோதயம் மற்றும் அஸ்தமனம் கணக்கிடப்படுகிறது.

• திதி: சந்திரன் - சூரியன் இடைவெளி ஒவ்வொரு 12° பாகையைக் கடக்கும் நிகழ்வு நேரம் (Transition instant).
• நட்சத்திரம்: சந்திரனின் 13° 20' விண்மீன் எல்லை மற்றும் 3° 20' பாதப் பிரிவுகள்.
• யோகம் & கரணம்: 27 யோகங்கள் மற்றும் 60 கரணங்களின் ஆரம்ப/முடிவு நேரங்கள்.
• ராகு காலம், எமகண்டம், குளிகை: சூரியோதயம் முதல் அஸ்தமனம் வரையிலான உண்மைப் பகல் பொழுதை சமமான 8 பகுதிகளாகப் பிரித்து நிமிடத் துல்லியத்துடன் கணக்கிடப்படுகிறது.`,
      contentEn: `Instead of simplistic 6:00 AM fallbacks, astronomical sunrise and sunset are computed using topocentric coordinates with atmospheric refraction (-0.833°).

• Tithi: Solved via root-finding for every 12° angular elongation increment between the Moon and Sun.
• Nakshatra: Exact entry and exit timestamps across 13°20' star boundaries and 3°20' padas.
• Yoga & Karana: Exact transition instants calculated across continuous time spans.
• Rahu Kalam, Yamagandam, Gulikai: Computed by partitioning the actual local daytime and nighttime into 8 proportional segments.`,
    },
    {
      id: "calendar",
      titleTa: "6. தமிழ் சூரிய நாட்காட்டி & 60 வருட சம்வத்ஸர சுழற்சி",
      titleEn: "6. Tamil Solar Calendar & 60-Year Samvatsara Cycle",
      icon: Clock,
      contentTa: `• மாதப் பிறப்பு (சங்கிராந்தி): சூரியன் நிரயன ராசிகளுக்குள் பிரவேசிக்கும் (Ingress) துல்லிய தருணத்தைக் கொண்டு தமிழ் மாதங்கள் (சித்திரை முதல் பங்குனி வரை) கணக்கிடப்படுகின்றன.
• பிரபவ முதல் அட்சய வரையிலான 60 தமிழ் வருட வரிசை 1987 (பிரபவ) ஆண்டை மையமாகக் கொண்டு சுழற்சி முறையில் இயங்குகிறது.
• கிரிகோரியன் - தமிழ் தேதி மாற்றி மூலம் 1920 முதல் 2080 வரையிலான எந்த தேதியையும் நொடியில் துல்லியமாக மாற்றலாம்.`,
      contentEn: `• Month Ingress (Sankranti): Tamil solar months (Chithirai through Panguni) are determined by the exact instant the Sun enters each of the 12 sidereal signs.
• 60-Year Jovian Cycle: Samvatsaras (Prabhava through Akshaya) are anchored to the 1987 CE epoch (Prabhava) with seamless wrapping.
• Bidirectional Gregorian <-> Tamil converter supporting years 1900 through 2100 with accurate day counts and Sankranti timings.`,
    },
    {
      id: "dasa",
      titleTa: "7. விம்சோத்தரி தசா இருப்பு & காலக்கணக்கு",
      titleEn: "7. Vimshottari Dasa & Balance Computation",
      icon: Sparkles,
      contentTa: `• 120 வருட விம்சோத்தரி தசா முறை: கேது (7), சுக்கிரன் (20), சூரியன் (6), சந்திரன் (10), செவ்வாய் (7), ராகு (18), குரு (16), சனி (19), புதன் (17).
• தசா இருப்பு: பிறப்பு நட்சத்திரத்தில் சந்திரன் கடக்க வேண்டிய எஞ்சிய பாகையின் விகிதத்தைக் கொண்டு பிறப்பு தசா இருப்பு துல்லியமாக கணக்கிடப்படுகிறது.
• வருட அளவு: சர்வதேச வானியல் தரநிலையான 365.2422 / 365.25 சூரிய நாட்கள் பின்பற்றப்படுகிறது.`,
      contentEn: `• 120-Year Vimshottari Cycle: Ketu (7y), Venus (20y), Sun (6y), Moon (10y), Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), Mercury (17y).
• Birth Dasa Balance: Derived strictly from the fractional portion of the Moon's birth Nakshatra remaining at the birth instant.
• Time Scale: Uses the astronomical tropical/solar year basis of 365.25 days per planetary year.`,
    },
    {
      id: "evidence",
      titleTa: "8. விதி அடிப்படையிலான பலன் கணிப்பு & சான்றுகள் ('இந்த முடிவு ஏன்?')",
      titleEn: "8. Rule-Driven Predictions & Evidence ('Why this result?')",
      icon: FileCheck,
      contentTa: `எங்கள் பலன் கணிப்பு இயந்திரம் தன்னிச்சையான அல்லது போலியான கூற்றுகளை உருவாக்குவதில்லை.

• சாஸ்திர மேற்கோள்கள்: பராசர ஹோரா சாஸ்திரம், பலதீபிகை, ஜாதக பாரிஜாதம் போன்ற மூல நூல்களின் விதிகள் மேற்கோள்களாக இணைக்கப்படுகின்றன.
• பல முரண்பாடு தீர்வு (Conflict Resolution): ஒரு பாவத்திற்கு சுப மற்றும் அசுப கிரக பார்வைகள் ஒரே நேரத்தில் இருக்கும் போது, அவற்றின் பலம் மதிப்பிடப்பட்டு நடுநிலையான முடிவு வழங்கப்படுகிறது.
• பிறப்பு நேர உணர்திறன் ஆய்வு (Sensitivity Analysis): பிறப்பு நேரம் ±5 நிமிடம் அல்லது ±10 நிமிடம் மாறினால் லக்னம், நவாம்சம் அல்லது தசா மாறுமா என்பதை முன்கூட்டியே எச்சரிக்கிறது.`,
      contentEn: `Predictions are generated through a deterministic classical rule registry rather than speculative black-box output.

• Classical Citations: Mapped directly to Brihat Parasara Hora Sastra, Phaladeepika, and Jataka Parijata.
• Evidence Traceability: Every prediction displays the planetary trigger, sign, house, and supporting textual shloka.
• Conflict Resolution: When benefic and malefic influences intersect on a single house or planet, weights are harmonized transparently.
• Sensitivity Analysis: Evaluates whether a ±5 min or ±10 min variance alters the Lagna, Navamsa, D60, or active Dasa balance.`,
    },
    {
      id: "ethics",
      titleTa: "9. நெறிமுறை மற்றும் பொறுப்புத் துறப்பு (Ethics & Traditional Framing)",
      titleEn: "9. Ethics & Traditional Astrological Framing",
      icon: AlertCircle,
      contentTa: `• அனைத்து பலன்களும் பாரம்பரிய இந்திய ஜோதிட விதிகளின் அடிப்படையிலான விளக்கங்கள் மட்டுமே ஆகும்.
• இவை அறிவியல் பூர்வமாக நிரூபிக்கப்பட்ட உண்மைகளோ, தவிர்க்க முடியாத எதிர்கால விதியோ அல்ல.
• மருத்துவம், சட்டம், முதலீடு மற்றும் திருமணம் தொடர்பான முக்கிய முடிவுகளுக்கு அந்தந்த தகுதிவாய்ந்த வல்லுநர்களை கலந்தாலோசிக்க வேண்டும். மனித முயற்சியும் (சுயதர்மம்) விவேகமுமே முதன்மையானவை.`,
      contentEn: `• All interpretations are presented strictly as traditional astrological perspectives rooted in classical jyotish literature.
• They do not constitute guaranteed outcomes or scientifically proven claims.
• Critical medical, legal, matrimonial, or financial life choices must always be guided by qualified, licensed human professionals. Free will and informed effort remain paramount.`,
    },
  ];

  const filtered = sections.filter(
    (s) =>
      s.titleTa.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.contentTa.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.contentEn.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="calculation-method-view mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <section className="mb-8 rounded-3xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/60 px-3.5 py-1 text-xs font-bold text-blue-800">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              {isTa ? "வெளிப்படையான வானியல் கணக்கீடு" : "Transparent Astronomical Methodology"}
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {isTa ? "கணித முறை விளக்கம் & சான்றளிப்பு" : "Calculation Method & Astronomical Transparency"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {isTa
                ? "கோடேபேக்கர் அஸ்ட்ரோவின் அனைத்து கணிப்புகளும் துல்லியமான வானியல் மாதிரிகள், சித்திரபக்ஷ அயனாம்சம் மற்றும் பராசர பாரம்பரிய விதிகளின்படி எவ்வாறு செயல்படுகின்றன என்பதை வெளிப்படையாக விளக்கும் ஆவணம்."
                : "A complete technical specification of our astronomical ephemeris, Lahiri Ayanamsa, Whole Sign houses, Vimshottari Dasa mathematics, and classical rule-driven prediction engine."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => go("astro-validation")}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-xs transition-colors hover:bg-blue-50"
            >
              <Cpu className="h-4 w-4 text-blue-600" />
              {isTa ? "நேரடி துல்லிய சரிபார்ப்பு" : "Live Accuracy Suite"}
            </button>
            <button
              type="button"
              onClick={() => go("jathagam")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              {isTa ? "ஜாதகம் கணிக்க" : "Cast Chart"}
            </button>
          </div>
        </div>

        {/* Quick Profile Summary Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-blue-100 pt-5 sm:grid-cols-4">
          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "ராசி மண்டலம்" : "Zodiac"}
            </span>
            <div className="mt-0.5 text-xs font-bold text-slate-800">
              {PRODUCTION_PROFILE.zodiac}
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "அயனாம்சம்" : "Ayanamsa"}
            </span>
            <div className="mt-0.5 text-xs font-bold text-slate-800">
              {PRODUCTION_PROFILE.ayanamsa}
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "வானியல் எஃபிமெரிஸ்" : "Ephemeris"}
            </span>
            <div className="mt-0.5 text-xs font-bold text-slate-800">
              {PRODUCTION_PROFILE.ephemeris}
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "பாவ முறை" : "Houses"}
            </span>
            <div className="mt-0.5 text-xs font-bold text-slate-800">
              {PRODUCTION_PROFILE.houseSystem}
            </div>
          </div>
        </div>
      </section>

      {/* Search Filter */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={
              isTa
                ? "விளக்கங்களைத் தேடுங்கள் (எ.கா: லஹிரி, நாசா, ராகு, சூரியோதயம், தசா)..."
                : "Search methodology (e.g., Lahiri, NASA, Rahu, Sunrise, Dasa)..."
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {filterQuery && (
          <button
            type="button"
            onClick={() => setFilterQuery("")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            {isTa ? "அழி" : "Clear"}
          </button>
        )}
      </div>

      {/* Methodology Detail Cards */}
      <div className="space-y-5">
        {filtered.map((sec) => {
          const Icon = sec.icon;
          return (
            <article
              key={sec.id}
              id={sec.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {isTa ? sec.titleTa : sec.titleEn}
                  </h2>
                  <div className="mt-3 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
                    {isTa ? sec.contentTa : sec.contentEn}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Customer Transparency Commitment */}
      <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-emerald-950 sm:p-7">
        <div className="flex items-start gap-3.5">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-emerald-900">
              {isTa ? "எங்களின் வெளிப்படைத்தன்மை உறுதிமொழி" : "Our Transparency & Reproducibility Commitment"}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-emerald-800">
              {isTa
                ? "கோடேபேக்கர் அஸ்ட்ரோவில் உருவாக்கப்படும் ஒவ்வொரு ஜாதகமும் தனித்துவமான கணித ரசீது (Receipt) மற்றும் SHA-256 ஹாஷ் (Hash) குறியீட்டைக் கொண்டுள்ளது. ஒரே உள்ளீட்டிற்கு எந்த நேரத்திலும் அதே துல்லியமான கிரக பாகைகள், தசா இருப்பு மற்றும் பலன்கள் கிடைக்கும் என்பதை நாங்கள் உறுதி செய்கிறோம்."
                : "Every chart calculated on CodePackr Astro includes a cryptographic SHA-256 calculation hash and audit receipt. The same birth inputs will deterministically yield the exact same planetary longitudes, Dasa balances, and rule-driven predictions across any device."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
