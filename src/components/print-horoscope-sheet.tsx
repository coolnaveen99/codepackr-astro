// Codepackr Astro - Comprehensive 6-Page Printable Vedic Horoscope Booklet
// Features separate dedicated pages for each major section, with Lord Ganesha deity image on EVERY page.
import {
  KARANA_EN,
  KARANA_TA,
  NAK_EN,
  NAK_TA,
  SIGNS_EN,
  SIGNS_TA,
  TITHI_EN,
  TITHI_TA,
  WEEK_EN,
  WEEK_TA,
  YOGA_EN,
  YOGA_TA,
  planetName,
} from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import {
  bhuktis,
  formatClock,
  formatJD,
  nowJD,
  type BodyPos,
  type ChartResult,
  type DasaPeriod,
} from "@/lib/astro/engine";
import { allLifeAreas } from "@/lib/astro/predictions";
import { dasaNarrative, getRemediesFor } from "@/lib/astro/remedies";
import { t, type Lang } from "@/lib/astro/i18n";
import { SouthChart } from "@/components/south-chart";
import { Watermark } from "@/components/watermark";
import { useGanesh } from "@/lib/ganesh-context";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}
function find(list: BodyPos[], id: string) {
  return list.find((p) => p.id === id) || list[0];
}

export function PrintHoroscopeSheet({
  result,
  analysis,
  lang,
}: {
  result: ChartResult;
  analysis: ReturnType<typeof analyse>;
  lang: Lang;
}) {
  const { ganeshSrc } = useGanesh();
  const moon = find(result.list, "moon");
  const lagna = find(result.list, "lagna");
  const dob = `${String(result.input.day).padStart(2, "0")}-${String(result.input.month).padStart(2, "0")}-${result.input.year}`;
  const tob = `${String(result.input.hour).padStart(2, "0")}:${String(result.input.minute).padStart(2, "0")}`;

  // Common Header Bar for each page with God Image
  const renderGodHeader = (pageNum: number, title: string) => (
    <div className="flex flex-col items-center text-center pb-2 border-b border-accent/30">
      <img
        src={ganeshSrc}
        alt="Lord Ganesha"
        className="h-9 sm:h-10 w-auto object-contain"
      />
      <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-accent mt-0.5 uppercase">
        {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
      </p>
      <div className="mt-1 flex items-center justify-between w-full px-1 text-[11px] text-muted">
        <span className="font-bold text-ink text-xs truncate max-w-[200px]">
          {result.input.name || (lang === "ta" ? "ஜாதகர்" : "Native")}
        </span>
        <span className="font-display font-semibold text-accent">
          {title}
        </span>
        <span className="font-medium text-ink">
          {signName(lang, moon.sign)} · {nakName(lang, moon.nak)} ({moon.pada}) · {t(lang, "lagna")}: {signName(lang, lagna.sign)}
        </span>
      </div>
    </div>
  );

  // Common Footer Bar for each page
  const renderPageFooter = (pageNum: number) => (
    <footer className="mt-2 pt-1 border-t border-accent/25 flex items-center justify-between text-[10px] text-muted">
      <div className="flex items-center gap-1.5">
        <img src={ganeshSrc} alt="" className="h-3.5 w-auto object-contain" />
        <a
          href="https://astro.codepackr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          astro.codepackr.com
        </a>
        <span>&bull;</span>
        <span>codepackr@gmail.com</span>
      </div>
      <span className="font-medium text-accent">
        {lang === "ta" ? `பக்கம் ${pageNum} / 6` : `Page ${pageNum} of 6`}
      </span>
    </footer>
  );

  const lifeAreas = allLifeAreas(analysis, lang);
  const remedies = getRemediesFor(analysis, lang);
  const runningDasa = analysis.dasaNow;
  const currentNarrative = runningDasa ? dasaNarrative(runningDasa.maha, lang) : "";
  const yogaIdx = Math.max(0, Math.min(26, result.pan.yogaNum - 1));

  // Current or initial dasa balance calculation
  const firstDasa = result.dasa.periods[0];

  return (
    <div className="print-horoscope-booklet w-full max-w-[210mm] mx-auto text-ink font-sans">
      {/* ========================================================================= */}
      {/* PAGE 1: முதன்மை ஜாதகக் கணிப்பு (Core Charts & Planetary Positions) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              1,
              lang === "ta" ? "முதன்மை ஜாதகக் கணிப்பு & கிரக நிலைகள்" : "Core Horoscope & Planetary Positions"
            )}

            {/* Native Birth Summary Strip */}
            <div className="mt-2.5 rounded border border-border/70 bg-elevated/30 p-2 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-muted block text-[9.5px] uppercase">{t(lang, "name")}</span>
                <strong className="text-ink text-xs">{result.input.name || "—"}</strong>
              </div>
              <div>
                <span className="text-muted block text-[9.5px] uppercase">{t(lang, "date")} & {t(lang, "time")}</span>
                <span className="font-medium text-ink">{dob} · {tob}</span>
              </div>
              <div>
                <span className="text-muted block text-[9.5px] uppercase">{t(lang, "place")}</span>
                <span className="font-medium text-ink truncate block">{result.input.place}</span>
              </div>
              <div>
                <span className="text-muted block text-[9.5px] uppercase">{t(lang, "ayanamsa")}</span>
                <span className="font-medium text-ink">{result.aya.toFixed(4)}° ({result.input.school})</span>
              </div>
            </div>

            {/* Rasi & Navamsa Charts side by side */}
            <div className="mt-2.5 grid grid-cols-2 gap-3 max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <p className="font-display mb-0.5 text-center text-[11px] font-bold text-accent">
                  {t(lang, "d1")} ({lang === "ta" ? "இராசி சக்கரம்" : "Rasi Chart"})
                </p>
                <div className="w-40 sm:w-44 aspect-square">
                  <SouthChart
                    positions={result.list}
                    lang={lang}
                    mode="sign"
                    caption={t(lang, "d1")}
                    theme="light"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display mb-0.5 text-center text-[11px] font-bold text-accent">
                  {t(lang, "d9")} ({lang === "ta" ? "நவாம்ச சக்கரம்" : "Navamsa Chart"})
                </p>
                <div className="w-40 sm:w-44 aspect-square">
                  <SouthChart
                    positions={result.list}
                    lang={lang}
                    mode="navamsa"
                    caption={t(lang, "d9")}
                    theme="light"
                  />
                </div>
              </div>
            </div>

            {/* Complete Planetary Sphutam Table */}
            <div className="mt-2.5 overflow-hidden rounded border border-border/80 bg-white">
              <table className="w-full text-left text-[10.5px]">
                <thead className="bg-elevated/60 text-muted text-[9.5px] uppercase font-semibold border-b border-border/70">
                  <tr>
                    <th className="px-2 py-1">{t(lang, "planet")}</th>
                    <th className="px-2 py-1">{lang === "ta" ? "பாகை (Degree)" : "Longitude"}</th>
                    <th className="px-2 py-1">{t(lang, "sign")}</th>
                    <th className="px-2 py-1">{t(lang, "house")}</th>
                    <th className="px-2 py-1">{t(lang, "nakshatra")}</th>
                    <th className="px-2 py-1">{lang === "ta" ? "நிலை / அதிபதி" : "Dignity"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {result.list.map((p) => {
                    const gRep = analysis.grahas.find((g) => g.id === p.id);
                    return (
                      <tr key={p.id} className="hover:bg-elevated/20">
                        <td className="px-2 py-0.5 font-bold text-ink">
                          {planetName(p.id, lang)}
                          {p.retrograde ? <span className="text-amber-700 ml-1 font-semibold text-[9px]">(வ)</span> : null}
                        </td>
                        <td className="px-2 py-0.5 font-mono text-[10px]">{p.dms}</td>
                        <td className="px-2 py-0.5 font-medium">{signName(lang, p.sign)}</td>
                        <td className="px-2 py-0.5 font-semibold text-accent">{p.house}</td>
                        <td className="px-2 py-0.5">{nakName(lang, p.nak)} ({p.pada})</td>
                        <td className="px-2 py-0.5 text-muted capitalize text-[10px]">
                          {gRep ? gRep.dignity : "—"}
                          {gRep?.combust ? <span className="text-red-600 ml-1 font-semibold text-[9px]">(அஸ்த)</span> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {renderPageFooter(1)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: ஜாதகப் பொதுப் பலன்கள் (General Predictions & Bhava Phalan) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              2,
              lang === "ta" ? "ஜாதகப் பொதுப் பலன்கள் & பாவ பலன்" : "General Horoscope Predictions & Bhava Readings"
            )}

            {/* Lagna & Rasi Overview */}
            <div className="mt-2.5 grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded border border-accent/30 bg-elevated/30 p-2.5">
                <h3 className="font-display font-bold text-accent text-xs mb-1 flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-accent" />
                  {t(lang, "lagna")}: {signName(lang, lagna.sign)} ({lagna.dms})
                </h3>
                <p className="text-muted leading-relaxed">
                  {lang === "ta"
                    ? `${signName(lang, lagna.sign)} லக்னத்தில் பிறந்த நீங்கள் இயல்பான உற்சாகமும், உழைக்கும் திறனும், கவர்ச்சிகரமான தோற்றமும் கொண்டவர்கள். லக்னாதிபதி வலுவாக அமைந்தால் வாழ்க்கையில் உயர்பதவி, தலைமைத்துவ பண்பு மற்றும் சமூக நற்பெயர் கிட்டும்.`
                    : `Born in ${signName(lang, lagna.sign)} Ascendant, you possess natural vitality, diligence, and strong presence. A dignified ascendant lord grants leadership, public prestige, and solid health.`}
                </p>
              </div>

              <div className="rounded border border-accent/30 bg-elevated/30 p-2.5">
                <h3 className="font-display font-bold text-accent text-xs mb-1 flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-accent" />
                  {t(lang, "rasi")}: {signName(lang, moon.sign)} · {nakName(lang, moon.nak)} ({moon.pada})
                </h3>
                <p className="text-muted leading-relaxed">
                  {lang === "ta"
                    ? `சந்திரன் ${signName(lang, moon.sign)} ராசியில் ${nakName(lang, moon.nak)} நட்சத்திரத்தில் நின்றதால், நுண்ணிய அறிவும், எதையும் திட்டமிட்டு செய்யும் சாதுரியமும் உண்டாகும். உங்கள் சிந்தனைகள் ஆக்கபூர்வமாகவும், மனிதநேயத்துடனும் விளங்கும்.`
                    : `Moon positioned in ${signName(lang, moon.sign)} and ${nakName(lang, moon.nak)} provides sharp intuition, methodical thinking, and emotional depth with creative potential.`}
                </p>
              </div>
            </div>

            {/* Life Areas Predictions Grid */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "முக்கிய வாழ்க்கை பாவங்களின் பலன்கள்" : "Key Life Area Forecasts"}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                {lifeAreas.slice(0, 6).map((area) => (
                  <div key={area.id} className="rounded border border-border/70 bg-white p-2">
                    <div className="flex items-center justify-between border-b border-border/40 pb-1 mb-1">
                      <span className="font-bold text-ink text-[11px]">{area.title}</span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded font-medium bg-elevated text-muted">
                        {area.tone === "strong" ? (lang === "ta" ? "வலுவானது" : "Favourable") : (lang === "ta" ? "நடுத்தரம்" : "Moderate")}
                      </span>
                    </div>
                    <p className="text-muted leading-tight line-clamp-3">
                      {area.paragraphs[0]}
                    </p>
                    {area.paragraphs[1] && (
                      <p className="text-muted/90 leading-tight mt-1 line-clamp-2">
                        {area.paragraphs[1]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {renderPageFooter(2)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3: யோகங்கள் & தோஷங்கள் (Auspicious Yogas & Dosha Analysis) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              3,
              lang === "ta" ? "யோகங்கள் மற்றும் தோஷங்கள் ஆய்வு" : "Auspicious Yogas & Planetary Doshas"
            )}

            {/* Auspicious Yogas Section */}
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "ஜாதகத்தில் அமைந்த சுப யோகங்கள்" : "Auspicious Yogas Present in Chart"}
                </h2>
              </div>

              <div className="space-y-1.5">
                {analysis.yogas.filter((y) => y.present && y.kind === "yoga").slice(0, 4).map((y) => (
                  <div key={y.id} className="rounded border border-emerald-200 bg-emerald-50/40 p-2 text-[10.5px]">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>{lang === "ta" ? y.nameTa : y.nameEn}</span>
                      <span className="text-[9.5px] px-1.5 rounded bg-emerald-100 text-emerald-800">சுப யோகம்</span>
                    </div>
                    <p className="text-emerald-950/80 mt-0.5 leading-snug">
                      {lang === "ta" ? y.detailTa : y.detailEn}
                    </p>
                  </div>
                ))}
                {analysis.yogas.filter((y) => y.present && y.kind === "yoga").length === 0 && (
                  <p className="text-muted italic text-[11px] p-2 bg-elevated/30 rounded">
                    {lang === "ta" ? "குறிப்பிடத்தக்க விசேஷ யோகங்கள் பொதுவான நிலையில் உள்ளன." : "Planets are positioned in standard functional dignity."}
                  </p>
                )}
              </div>
            </div>

            {/* Dosha Evaluations: Chevvai, Rahu-Ketu, Sade-Sati */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "தோஷங்கள் மற்றும் சனீஸ்வரர் தாக்கம்" : "Dosha & Saturn Impact Evaluation"}
                </h2>
              </div>

              <div className="space-y-2 text-[10.5px]">
                {/* Chevvai Dosham */}
                <div className="rounded border border-border/80 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink text-xs">
                      {lang === "ta" ? "செவ்வாய் தோஷ நிலை (Chevvai / Manglik Status)" : "Mars Affliction (Chevvai / Manglik)"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${analysis.chevvai.present ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                      {analysis.chevvai.present
                        ? (analysis.chevvai.cancelled ? (lang === "ta" ? "தோஷ நிவர்த்தி உண்டு" : "Exempted / Cancelled") : (lang === "ta" ? "தோஷம் உண்டு" : "Present"))
                        : (lang === "ta" ? "தோஷம் இல்லை" : "Absent")}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? (analysis.chevvai.present
                          ? (analysis.chevvai.cancelled
                              ? "லக்னம், சந்திரன் அல்லது சுக்கிரனுக்குரிய இடங்களில் செவ்வாய் நின்றாலும், சாஸ்திர விதிகளின்படி தோஷ நிவர்த்தி ஏற்பட்டுள்ளது."
                              : "லக்னம், சந்திரன் அல்லது சுக்கிரனிலிருந்து 2, 4, 7, 8, 12-ல் செவ்வாய் அமர்ந்துள்ளார். திருமணத்திற்கு செவ்வாய் தோஷ அமைப்பை ஒப்பிடுவது உத்தமம்.")
                          : "ஜாதகத்தில் செவ்வாய் தோஷ பாதிப்புகள் ஏதுமில்லை. திருமணப் பொருத்தத்திற்கு தாராளமாக பரிசீலிக்கலாம்.")
                      : (analysis.chevvai.present
                          ? (analysis.chevvai.cancelled ? "Mars is placed in critical house but cancellation rules apply." : "Mars placed in sensitive house from Lagna/Moon/Venus; match accordingly.")
                          : "No Chevvai (Manglik) dosha detected in birth chart.")}
                  </p>
                </div>

                {/* Rahu-Ketu Sarpa Dosham */}
                <div className="rounded border border-border/80 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink text-xs">
                      {lang === "ta" ? "ராகு - கேது காலசர்ப்ப / சர்ப்ப தோஷம்" : "Rahu-Ketu / Sarpa Dosha"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${analysis.kaalSarpa.present ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                      {analysis.kaalSarpa.present ? (lang === "ta" ? "உண்டு" : "Present") : (lang === "ta" ? "இல்லை" : "Absent")}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? (analysis.kaalSarpa.present
                          ? "அனைத்து ஏழு கிரகங்களும் ராகு மற்றும் கேதுவின் ஒரு பக்க சுழற்சியில் அடங்கியுள்ளன. குலதெய்வ வழிபாடு மற்றும் நாகர் வழிபாடு நலம் பயக்கும்."
                          : "ஜாதகத்தில் காலசர்ப்ப அல்லது கடுமையான சர்ப்ப தோஷ பாதிப்புகள் இல்லை. கிரகங்கள் சுதந்திரமாக சஞ்சரிக்கின்றன.")
                      : (analysis.kaalSarpa.present
                          ? "All planets hemmed between Rahu and Ketu axis. Deity worship and spiritual discipline provide relief."
                          : "No Kaal Sarpa dosha present; planets move freely across both hemispheres.")}
                  </p>
                </div>

                {/* Sade Sati */}
                <div className="rounded border border-border/80 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink text-xs">
                      {lang === "ta" ? "சனீஸ்வரர் பெயர்ச்சி தாக்கம் (ஏழரை / அஷ்டம சனி)" : "Saturn Transit Phase (Sade Sati)"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${analysis.sadeSati.present ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                      {analysis.sadeSati.present ? (lang === "ta" ? `சனி தாக்கம் (${analysis.sadeSati.phase})` : `Active (${analysis.sadeSati.phase})`) : (lang === "ta" ? "தாக்கம் இல்லை" : "Not Active")}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? (analysis.sadeSati.present
                          ? `ஜனம ராசிக்கு அருகில் சனி பகவான் சஞ்சரிப்பதால் ஏழரைச் சனியின் ${analysis.sadeSati.phase} பகுதி நடக்கிறது. கடமைகளில் நேர்மையும் பொறுமையும் காப்பது நன்மை தரும்.`
                          : "தற்போது ஏழரைச் சனி அல்லது அஷ்டமச் சனியின் நேரடிப் பாதிப்புகள் இல்லை. இயல்பான நற்பலன்கள் கிட்டும்.")
                      : (analysis.sadeSati.present
                          ? `Saturn is transiting adjacent to Janma Rasi (${analysis.sadeSati.phase} phase of Sade Sati). Diligence and discipline bring stability.`
                          : "No active Sade Sati or Ashtama Sani phase currently active.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {renderPageFooter(3)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: பிறப்புப் பஞ்சாங்கம் & அஷ்டகவர்க்கம் (Panchangam & Ashtakavarga) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              4,
              lang === "ta" ? "பிறப்புப் பஞ்சாங்கம் & அஷ்டகவர்க்க அட்டவணை" : "Birth Panchangam & Ashtakavarga Bindus"
            )}

            {/* Panchangam 5 Angams Table */}
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "பிறப்பு பஞ்சாங்க விவரங்கள் (Pancha-Angam)" : "Birth Panchangam Details"}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{t(lang, "tithi")}</span>
                  <span className="font-bold text-ink">
                    {lang === "ta" ? TITHI_TA[result.pan.tithiIdx] : TITHI_EN[result.pan.tithiIdx]}
                    <span className="text-[10px] text-muted ml-1">({result.pan.paksha === "shukla" ? "சுக்கில" : "கிருஷ்ண"})</span>
                  </span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{t(lang, "weekday")}</span>
                  <span className="font-bold text-ink">{lang === "ta" ? WEEK_TA[result.weekday] : WEEK_EN[result.weekday]}</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{t(lang, "nakshatra")}</span>
                  <span className="font-bold text-ink">{nakName(lang, moon.nak)} ({t(lang, "pada")} {moon.pada})</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{t(lang, "yoga")}</span>
                  <span className="font-bold text-ink">{lang === "ta" ? YOGA_TA[yogaIdx] : YOGA_EN[yogaIdx]}</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{t(lang, "karana")}</span>
                  <span className="font-bold text-ink">{lang === "ta" ? KARANA_TA[result.pan.karanaIdx] : KARANA_EN[result.pan.karanaIdx]}</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "சூரிய உதயம் / அஸ்தமனம்" : "Sunrise / Sunset"}</span>
                  <span className="font-bold text-ink">
                    {formatClock(result.sunriseJD, result.input.tz)} / {formatClock(result.sunsetJD, result.input.tz)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sarvashtakavarga 12 Signs Grid */}
            <div className="mt-3">
              <div className="flex items-center justify-between border-b border-accent/30 pb-0.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-accent" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                    {lang === "ta" ? "சர்வாஷ்டகவர்க்க பரல்கள் (Sarvashtakavarga Bindus)" : "Sarvashtakavarga Bindu Table"}
                  </h2>
                </div>
                <span className="text-[10px] text-muted">மொத்த பரல்கள்: 337</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-[11px]">
                {SIGNS_TA.map((sName, idx) => {
                  const savVal = result.sav[idx];
                  const isHigh = savVal >= 30;
                  const isLow = savVal < 25;
                  return (
                    <div
                      key={sName}
                      className={`rounded border p-1.5 ${isHigh ? "border-emerald-300 bg-emerald-50/50" : isLow ? "border-amber-300 bg-amber-50/50" : "border-border/70 bg-white"}`}
                    >
                      <span className="text-muted block text-[9.5px] truncate">
                        {lang === "ta" ? sName : SIGNS_EN[idx]}
                      </span>
                      <strong className={`text-sm ${isHigh ? "text-emerald-800" : isLow ? "text-amber-800" : "text-ink"}`}>
                        {savVal}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bhava Sphutam 12 Houses Table */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1.5">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "பாவ ஆரம்பம் மற்றும் மத்திய ஸ்புடம்" : "Bhava Sphutam (Houses Beginning & Cusp)"}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                {analysis.bhavas.map((b) => (
                  <div key={b.house} className="rounded border border-border/60 bg-white p-1.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-accent">{b.house}-ஆம் பாவம்: </span>
                      <span className="text-ink font-medium">{signName(lang, b.sign)}</span>
                    </div>
                    <div className="text-right text-muted">
                      <span>அதிபதி: {planetName(b.lord, lang)} ({b.sav} பரல்)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {renderPageFooter(4)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 5: விம்சோத்தரி தசா புக்தி (Dasa & Bhukti System) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              5,
              lang === "ta" ? "விம்சோத்தரி தசா புக்தி கால அட்டவணை" : "Vimshottari Dasa & Bhukti Periods"
            )}

            {/* Current Dasa & Balance Overview */}
            <div className="mt-2.5 rounded border border-accent/40 bg-accent/5 p-3 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "பிறப்பு தசா இருப்பு" : "Birth Dasa Balance"}</span>
                {firstDasa ? (
                  <p className="font-bold text-accent text-xs mt-0.5">
                    {planetName(firstDasa.lord, lang)} தசா இருப்பு: {firstDasa.years.toFixed(2)} {lang === "ta" ? "வருடங்கள்" : "Years"}
                  </p>
                ) : null}
                <p className="text-muted text-[10px] mt-0.5">
                  {lang === "ta" ? "பிறந்த நட்சத்திர அடிப்படையில் கணிக்கப்பட்டது." : "Computed from Moon's exact birth nakshatra longitude."}
                </p>
              </div>

              <div>
                <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "தற்போதைய தசா - புக்தி" : "Current Running Dasa - Bhukti"}</span>
                {runningDasa ? (
                  <p className="font-bold text-ink text-xs mt-0.5">
                    {planetName(runningDasa.maha, lang)} மகா தசை — {planetName(runningDasa.bhukti, lang)} புக்தி
                  </p>
                ) : (
                  <p className="text-muted text-xs">—</p>
                )}
                {currentNarrative && (
                  <p className="text-muted text-[10px] mt-0.5 line-clamp-2">
                    {currentNarrative}
                  </p>
                )}
              </div>
            </div>

            {/* 120-Year Mahadasa Timeline Table */}
            <div className="mt-3">
              <div className="flex items-center justify-between border-b border-accent/30 pb-0.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-accent" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                    {lang === "ta" ? "ஆயுள் தசா கால அட்டவணை (120 ஆண்டுகள்)" : "Lifetime Mahadasa Chronological Timeline"}
                  </h2>
                </div>
                <span className="text-[10px] text-muted">விம்சோத்தரி முறை</span>
              </div>

              <div className="overflow-hidden rounded border border-border/80 bg-white">
                <table className="w-full text-left text-[10.5px]">
                  <thead className="bg-elevated/60 text-muted text-[9.5px] uppercase font-semibold border-b border-border/70">
                    <tr>
                      <th className="px-2 py-1">{lang === "ta" ? "மகா தசை" : "Maha Dasa"}</th>
                      <th className="px-2 py-1">{lang === "ta" ? "கால அளவு" : "Total Span"}</th>
                      <th className="px-2 py-1">{lang === "ta" ? "ஆரம்ப தேதி" : "Start Date"}</th>
                      <th className="px-2 py-1">{lang === "ta" ? "முடிவு தேதி" : "End Date"}</th>
                      <th className="px-2 py-1">{lang === "ta" ? "நிலை" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {result.dasa.periods.map((d: DasaPeriod) => {
                      const now = nowJD();
                      const isPast = d.endJD < now;
                      const isCurrent = d.startJD <= now && d.endJD >= now;
                      return (
                        <tr key={d.lord} className={isCurrent ? "bg-accent/10 font-semibold" : "hover:bg-elevated/20"}>
                          <td className="px-2 py-1 text-ink font-bold">
                            {planetName(d.lord, lang)} தசை
                          </td>
                          <td className="px-2 py-1 text-muted">{d.years.toFixed(1)} {lang === "ta" ? "வருடம்" : "yrs"}</td>
                          <td className="px-2 py-1 font-mono text-[10px]">{formatJD(d.startJD, result.input.tz)}</td>
                          <td className="px-2 py-1 font-mono text-[10px]">{formatJD(d.endJD, result.input.tz)}</td>
                          <td className="px-2 py-1">
                            {isCurrent ? (
                              <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-accent-fg">
                                {lang === "ta" ? "நடைமுறை" : "Running"}
                              </span>
                            ) : isPast ? (
                              <span className="text-muted text-[10px]">{lang === "ta" ? "முடிந்தது" : "Past"}</span>
                            ) : (
                              <span className="text-muted/80 text-[10px]">{lang === "ta" ? "எதிர்காலம்" : "Future"}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-Periods (Bhuktis) of Current Running Dasa */}
            {runningDasa && (
              <div className="mt-3">
                <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1.5">
                  <span className="inline-block size-1.5 rounded-full bg-accent" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                    {planetName(runningDasa.maha, lang)} {lang === "ta" ? "மகா தசையின் புக்தி விவரங்கள்" : "Maha Dasa Sub-Periods (Bhuktis)"}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  {bhuktis(result.dasa.periods.find((d: DasaPeriod) => d.lord === runningDasa.maha) || result.dasa.periods[0]).map((b) => {
                    const now = nowJD();
                    const isCur = b.startJD <= now && b.endJD >= now;
                    return (
                      <div
                        key={b.lord}
                        className={`rounded border p-1.5 ${isCur ? "border-accent bg-accent/10 font-semibold" : "border-border/60 bg-white"}`}
                      >
                        <div className="flex justify-between">
                          <span className="text-ink">{planetName(b.lord, lang)} புக்தி</span>
                          {isCur && <span className="text-[9px] text-accent font-bold">●</span>}
                        </div>
                        <div className="text-[9px] text-muted font-mono mt-0.5">
                          {formatJD(b.startJD, result.input.tz)} - {formatJD(b.endJD, result.input.tz)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {renderPageFooter(5)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 6: கோச்சாரம், பரிகாரங்கள் & அதிர்ஷ்டக் குறிப்புகள் (Transits & Remedies) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(
              6,
              lang === "ta" ? "கோச்சாரம், பரிகாரங்கள் & அதிர்ஷ்டக் குறிப்புகள்" : "Transits, Remedies & Auspicious Guidance"
            )}

            {/* Current Gochara Transits Table */}
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "தற்போதைய முக்கிய கிரகப் பெயர்ச்சி நிலைகள் (கோச்சாரம்)" : "Current Major Planetary Transits (Gochara)"}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                {analysis.gochara.slice(0, 4).map((g) => (
                  <div key={g.id} className="rounded border border-border/70 bg-white p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{planetName(g.id, lang)}</span>
                      <span className={`text-[9.5px] px-1.5 rounded font-semibold ${g.favourable ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {g.fromRasi}-ஆம் இடம்
                      </span>
                    </div>
                    <span className="text-muted text-[10px] block mt-1">
                      {signName(lang, g.sign)} ராசியில் சஞ்சாரம்
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Astrological Remedies */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "ஜாதகத்திற்கான தெய்வீக வழிபாடுகள் & பரிகாரங்கள்" : "Recommended Divine Worship & Remedies"}
                </h2>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                {remedies.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded border border-accent/30 bg-elevated/20 p-2">
                    <span className="font-bold text-accent text-xs block mb-0.5">{r.title}</span>
                    <p className="text-muted leading-tight">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auspicious Lucky Elements Strip */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-2">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "அதிர்ஷ்ட விவரங்கள் (Lucky Indicators)" : "Lucky Indicators"}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட நிறம்" : "Lucky Color"}</span>
                  <span className="font-bold text-ink">{lang === "ta" ? analysis.lucky.colorTa : analysis.lucky.colorEn}</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட கிழமை" : "Lucky Day"}</span>
                  <span className="font-bold text-accent">{lang === "ta" ? WEEK_TA[analysis.lucky.day] : WEEK_EN[analysis.lucky.day]}</span>
                </div>
                <div className="rounded border border-border/70 bg-white p-2">
                  <span className="text-muted block text-[9.5px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட எண்கள்" : "Lucky Numbers"}</span>
                  <span className="font-bold text-ink">{analysis.lucky.numbers.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="mt-3 rounded border border-border/80 bg-elevated/40 p-2 text-[9px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">{t(lang, "legalDisclaimerTitle")}: </span>
              <span>
                {lang === "ta"
                  ? "இவ்வறிக்கை பயனரால் உள்ளிடப்பட்ட பிறந்த விபரங்களின் அடிப்படையில் கணினி மூலம் தானாகக் கணிக்கப்பட்டதாகும். இது வழிகாட்டுதலுக்காக மட்டுமே வழங்கப்படுகிறது. திருமணம், தொழில், நிதி மற்றும் மருத்துவம் சார்ந்த முக்கிய முடிவுகளுக்கு அனுபவமிக்க பாரம்பரிய ஜோதிடரிடம் சரிபார்த்துக் கொள்ளவும்."
                  : "This report is computer-generated based on user-provided birth details for guidance purposes only. Consult qualified astrologers, legal, and healthcare professionals for major life decisions."}
              </span>
            </div>
          </div>
          {renderPageFooter(6)}
        </div>
      </div>
    </div>
  );
}
