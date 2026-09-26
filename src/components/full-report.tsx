// Codepackr Astro - Comprehensive 30-Page Printable Vedic Horoscope Booklet
// Every single page is an independent A4 sheet with Lord Ganesha deity header, watermark, structured classical data, and footer with hyperlinked disclaimer.
import { useMemo, type ReactNode } from "react";
import type { ChartResult, BodyPos } from "@/lib/astro/engine";
import { formatClock, formatJD } from "@/lib/astro/engine";
import type { Analysis, GrahaReport } from "@/lib/astro/analysis";
import { buildReportData, type ReportData } from "@/lib/astro/report";
import {
  SIGNS_TA,
  SIGNS_EN,
  NAK_TA,
  NAK_EN,
  TITHI_TA,
  TITHI_EN,
  YOGA_TA,
  YOGA_EN,
  KARANA_TA,
  KARANA_EN,
  WEEK_TA,
  WEEK_EN,
  planetName,
  type PlanetId,
} from "@/lib/astro/constants";
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

export function FullReport({
  result,
  analysis,
  lang,
}: {
  result: ChartResult;
  analysis: Analysis;
  lang: Lang;
}) {
  const { ganeshSrc } = useGanesh();
  const data = useMemo(() => buildReportData(result, analysis, lang), [result, analysis, lang]);

  const {
    shadbala,
    lifeAreas,
    remedies,
    dasaNarrativeText,
    moon,
    lagna,
    dobStr,
    tobStr,
    nativeName,
    schoolName,
  } = data;

  const totalPages = 30;

  // Render Auspicious Header with God Image on EVERY page
  const renderGodHeader = (pageNum: number, title: string) => (
    <div className="flex flex-col items-center text-center pb-1.5 border-b border-accent/30">
      <img
        src={ganeshSrc}
        alt="Lord Ganesha"
        className="h-8 sm:h-9 w-auto object-contain"
      />
      <p className="text-[9.5px] font-bold tracking-[0.2em] text-accent mt-0.5 uppercase">
        {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
      </p>
      <div className="mt-0.5 flex w-full flex-col items-center px-1 text-center">
        <span className="max-w-full break-words text-[10.5px] font-bold leading-tight text-ink">{nativeName?.trim() || (lang === "ta" ? "ஜாதகர்" : "Native")}</span>
        <span className="mt-0.5 max-w-full break-words font-display font-semibold text-accent text-xs leading-tight">{title}</span>
        <span className="mt-0.5 max-w-full break-words text-[9.5px] leading-tight font-medium text-ink">{signName(lang, moon.sign)} · {nakName(lang, moon.nak)} ({moon.pada}) · {t(lang, "lagna")}: {signName(lang, lagna.sign)}</span>
      </div>
    </div>
  );

  // Render Page Footer on EVERY page with hyperlinked disclaimer
  const renderPageFooter = (pageNum: number) => (
    <footer className="mt-1 pt-1 border-t border-accent/25 flex items-center justify-between text-[9.5px] text-muted">
      <div className="flex items-center gap-1.5">
        <img src={ganeshSrc} alt="" className="h-3 w-auto object-contain" />
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
      <div className="flex items-center gap-2">
        <a
          href="https://astro.codepackr.com/?page=disclaimer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline font-medium hover:text-accent/80"
        >
          {lang === "ta" ? "பொறுப்புத் துறப்பு" : "Disclaimer"}
        </a>
        <span>&bull;</span>
        <span className="font-semibold text-accent">
          {lang === "ta" ? `பக்கம் ${pageNum} / ${totalPages}` : `Page ${pageNum} of ${totalPages}`}
        </span>
      </div>
    </footer>
  );

  return (
    <div className="full-report-container w-full max-w-[210mm] mx-auto text-ink font-sans">
      {/* ========================================================================= */}
      {/* PAGE 1: ஜாதக முகப்பு & சுருக்கம் (Cover & Primary Astrological Summary) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(1, lang === "ta" ? "வேத ஜோதிட ஜாதக புத்தகம்" : "Vedic Horoscope Booklet")}

            <div className="mt-4 text-center">
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/25">
                {schoolName}
              </span>
              <h1 className="font-display text-2xl font-bold text-accent mt-2">
                {nativeName}
              </h1>
              <p className="text-xs text-muted mt-1">
                {lang === "ta" ? "முழுமையான வாழ்க்கை வழிகாட்டி ஜாதக அறிக்கை" : "Comprehensive Astrological Life Guidance Report"}
              </p>
            </div>

            {/* Birth Specifications Box */}
            <div className="mt-4 rounded-lg border border-accent/30 bg-elevated/30 p-3 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "பிறப்பு விவரங்கள் (Birth Specifications)" : "Birth Specifications"}
              </h2>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px]">
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "date")}:</span>
                  <span className="font-semibold text-ink">{dobStr}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "time")}:</span>
                  <span className="font-semibold text-ink">{tobStr}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "place")}:</span>
                  <span className="font-medium text-ink truncate">{result.input.place}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "weekday")}:</span>
                  <span className="font-medium text-ink">{lang === "ta" ? WEEK_TA[result.weekday] : WEEK_EN[result.weekday]}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "sunrise")}:</span>
                  <span className="font-medium text-ink">{formatClock(result.sunriseJD, result.input.tz)}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "sunset")}:</span>
                  <span className="font-medium text-ink">{formatClock(result.sunsetJD, result.input.tz)}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "ayanamsa")}:</span>
                  <span className="font-medium text-ink">{result.aya.toFixed(4)}° ({result.input.school})</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-0.5">
                  <span className="text-muted">{t(lang, "sex")}:</span>
                  <span className="font-medium text-ink">{result.input.sex === "M" ? (lang === "ta" ? "ஆண்" : "Male") : (lang === "ta" ? "பெண்" : "Female")}</span>
                </div>
              </div>
            </div>

            {/* Core Astrological Identity */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-surface p-3 text-xs shadow-2xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "அங்க அடையாள ஜோதிட அமைப்புகள்" : "Core Astrological Coordinates"}
              </h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-elevated/40 rounded p-2 border border-border/50">
                  <span className="text-[10px] text-muted block uppercase">{t(lang, "rasi")}</span>
                  <strong className="text-accent text-sm font-display block mt-0.5">{signName(lang, moon.sign)}</strong>
                  <span className="text-[10px] text-muted">{lang === "ta" ? "சந்திர ராசி" : "Moon Sign"}</span>
                </div>
                <div className="bg-elevated/40 rounded p-2 border border-border/50">
                  <span className="text-[10px] text-muted block uppercase">{t(lang, "nakshatra")}</span>
                  <strong className="text-accent text-sm font-display block mt-0.5">{nakName(lang, moon.nak)}</strong>
                  <span className="text-[10px] text-muted">{t(lang, "pada")} {moon.pada}</span>
                </div>
                <div className="bg-elevated/40 rounded p-2 border border-border/50">
                  <span className="text-[10px] text-muted block uppercase">{t(lang, "lagna")}</span>
                  <strong className="text-accent text-sm font-display block mt-0.5">{signName(lang, lagna.sign)}</strong>
                  <span className="text-[10px] text-muted">{lagna.dms}</span>
                </div>
              </div>
            </div>

            {/* Auspicious Naming & Lucky Attributes */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-3 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-1.5 border-b border-accent/20 pb-1">
                {lang === "ta" ? "பெயரின் தொடக்க எழுத்துக்கள் & அதிர்ஷ்ட குறிப்புகள்" : "Auspicious Naming Syllables & Lucky Factors"}
              </h2>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted block text-[10px] uppercase">{lang === "ta" ? "பெயர் தொடக்க எழுத்துக்கள்" : "Naming Syllables"}:</span>
                  <span className="font-bold text-accent text-xs">
                    {lang === "ta" ? analysis.naming.allTa.join(", ") : analysis.naming.allEn.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட எண்கள்" : "Lucky Numbers"}:</span>
                  <span className="font-semibold text-ink">{analysis.lucky.numbers.join(", ")}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட நிறம்" : "Lucky Color"}:</span>
                  <span className="font-medium text-ink">{lang === "ta" ? analysis.lucky.colorTa : analysis.lucky.colorEn}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">{lang === "ta" ? "அதிர்ஷ்ட வாரம்" : "Lucky Day"}:</span>
                  <span className="font-medium text-ink">{lang === "ta" ? WEEK_TA[analysis.lucky.day] : WEEK_EN[analysis.lucky.day]}</span>
                </div>
              </div>
            </div>
          </div>

          {renderPageFooter(1)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: பிறப்பு பஞ்சாங்க அங்கங்கள் (Panchanga Angas at Birth) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(2, lang === "ta" ? "பிறப்பு பஞ்சாங்க அங்கங்கள் & கால அளவுகள்" : "Birth Panchangam Attributes")}

            <div className="mt-3 rounded border border-border/70 bg-elevated/20 p-2.5 text-xs leading-relaxed text-muted">
              {lang === "ta"
                ? "ஒரு மனிதர் பிறக்கும் போது வானில் நிலவும் திதி, வாரம், நட்சத்திரம், யோகம், கரணம் ஆகிய ஐந்து அங்கங்கள் பஞ்சாங்கம் எனப்படும். இவை சுப அசுப அதிர்வுகளைத் தீர்மானிக்கின்றன."
                : "The five vital limbs of time at birth—Tithi, Vara, Nakshatra, Yoga, and Karana—determine the cosmic subtle energies shaping nature, temperament, and life flow."}
            </div>

            {/* 5 Panchanga Angas Cards */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/70 bg-surface p-2.5">
                <span className="text-muted text-[10px] uppercase block font-semibold">{t(lang, "tithi")}</span>
                <strong className="text-accent font-display text-sm block">
                  {lang === "ta" ? TITHI_TA[result.pan.tithiNum - 1] : TITHI_EN[result.pan.tithiNum - 1]}
                </strong>
                <p className="text-[10.5px] text-muted mt-1">
                  {lang === "ta" ? "திதி அதிபதி: சுக்கிரன்/சுப அதிபதி. செல்வம் மற்றும் மன அமைதியைக் குறிக்கிறது." : "Governs relationships, prosperity, and emotional harmony."}
                </p>
              </div>

              <div className="rounded border border-border/70 bg-surface p-2.5">
                <span className="text-muted text-[10px] uppercase block font-semibold">{t(lang, "nakshatra")}</span>
                <strong className="text-accent font-display text-sm block">
                  {nakName(lang, moon.nak)} ({t(lang, "pada")} {moon.pada})
                </strong>
                <p className="text-[10.5px] text-muted mt-1">
                  {lang === "ta" ? "ஜன்ம நட்சத்திரம் மன இயல்பு, ஆளுமை மற்றும் விம்சொத்தரி தசா தொடக்கத்தை நிர்ணயிக்கிறது." : "Defines fundamental psychological disposition and initiates Vimshottari Dasa."}
                </p>
              </div>

              <div className="rounded border border-border/70 bg-surface p-2.5">
                <span className="text-muted text-[10px] uppercase block font-semibold">{t(lang, "yoga")}</span>
                <strong className="text-accent font-display text-sm block">
                  {lang === "ta" ? YOGA_TA[Math.max(0, result.pan.yogaNum - 1)] : YOGA_EN[Math.max(0, result.pan.yogaNum - 1)]}
                </strong>
                <p className="text-[10.5px] text-muted mt-1">
                  {lang === "ta" ? "சூரிய சந்திர இணைவு யோகம் உடல் நலம் மற்றும் ஆயுள் ஆரோக்கியத்தைக் குறிக்கும்." : "Nitya Yoga indicates health, longevity, and vitality."}
                </p>
              </div>

              <div className="rounded border border-border/70 bg-surface p-2.5">
                <span className="text-muted text-[10px] uppercase block font-semibold">{t(lang, "karana")}</span>
                <strong className="text-accent font-display text-sm block">
                  {lang === "ta" ? KARANA_TA[result.pan.karanaIdx] : KARANA_EN[result.pan.karanaIdx]}
                </strong>
                <p className="text-[10.5px] text-muted mt-1">
                  {lang === "ta" ? "திதியின் அரைப் பகுதி கரணம். செயல்களின் வெற்றி மற்றும் தொழில் ஊக்கத்தைக் குறிக்கிறது." : "Half of a Tithi. Governs vocational efficacy and task completion."}
                </p>
              </div>
            </div>

            {/* Birth Dasa Balance */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-3 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-1.5 border-b border-accent/20 pb-1">
                {lang === "ta" ? "பிறப்பு இருப்பு தசா விவரம்" : "Vimshottari Dasa Balance at Birth"}
              </h2>
              {result.dasa.periods[0] && (
                <div className="text-[11px] space-y-1">
                  <p>
                    <span className="text-muted">{lang === "ta" ? "தொடக்க தசா நாதன்" : "Ruling Planet"}: </span>
                    <strong className="text-accent">{planetName(result.dasa.periods[0].lord, lang)}</strong>
                  </p>
                  <p>
                    <span className="text-muted">{lang === "ta" ? "பிறப்பில் நின்ற காலம்" : "Balance Period"}: </span>
                    <strong className="text-ink">
                      {result.dasa.periods[0].years.toFixed(2)} {lang === "ta" ? "ஆண்டுகள்" : "Years"} ({formatJD(result.dasa.periods[0].endJD, result.input.tz)})
                    </strong>
                  </p>
                  <p className="text-muted text-[10px] mt-1">
                    {lang === "ta"
                      ? "ஜன்ம நட்சத்திரப் பாதத்தின் அடிப்படையில் பிறப்பில் நிலுவையில் உள்ள தசா காலம் கணக்கிடப்பட்டுள்ளது."
                      : "Calculated from the precise traversed longitude of the Moon in the birth Nakshatra pada."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {renderPageFooter(2)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3: இராசி சக்கரம் & லக்ன பாவங்கள் (D1 Rasi Chart & House Overview) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(3, lang === "ta" ? "இராசி சக்கரம் (D1 Rasi Chart)" : "Rasi Chart (D1) & Ascendant")}

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center">
                <p className="font-display text-xs font-bold text-accent mb-1 text-center">
                  {lang === "ta" ? "தென்னிந்திய முறை இராசி சக்கரம்" : "South Indian Rasi Chart (D1)"}
                </p>
                <div className="w-56 sm:w-64 aspect-square">
                  <SouthChart positions={result.list} lang={lang} mode="sign" theme="light" />
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="rounded border border-accent/30 bg-elevated/30 p-2.5">
                  <h3 className="font-bold text-accent text-xs mb-1">
                    {lang === "ta" ? "லக்ன அமைப்பின் முக்கியத்துவம்" : "Lagna Signification"}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? `உங்கள் லக்னம் ${signName(lang, lagna.sign)} ஆகும். லக்னாதிபதி தன் வீட்டில் அல்லது கேந்திர/திரிகோணங்களில் நின்றால் ஆரோக்கியம், புகழ், நற்செயல்கள் அதிகரிக்கும்.`
                      : `The Ascendant (Lagna) is in ${signName(lang, lagna.sign)}. Lagna lord governs life vitality, self-expression, and physical stamina.`}
                  </p>
                </div>

                <div className="rounded border border-border/70 bg-surface p-2.5">
                  <h3 className="font-bold text-accent text-xs mb-1">
                    {lang === "ta" ? "சந்திர இராசியின் முக்கியத்துவம்" : "Moon Sign Signification"}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? `சந்திரன் ${signName(lang, moon.sign)} இராசியில் அமர்ந்துள்ளார். இது உங்கள் மனநிலை, கற்பனைத் திறன், தாய் மற்றும் அன்றாட உணர்வுகளை வழிநடத்துகிறது.`
                      : `Moon placed in ${signName(lang, moon.sign)} governs mental calmness, perceptual faculties, intuition, and maternal bonding.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 12 Bhavas Summary Strip */}
            <div className="mt-4 rounded-lg border border-border/70 bg-elevated/20 p-2.5 text-xs">
              <h3 className="font-bold text-accent text-xs mb-1.5 border-b border-border/40 pb-0.5">
                {lang === "ta" ? "12 பாவங்களின் அதிபதிகள் & சர்வாஷ்டவர்க்க புள்ளிகள் (SAV)" : "12 House Lords & SAV Bindus"}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 text-[10.5px]">
                {analysis.bhavas.map((bh) => (
                  <div key={bh.house} className="bg-surface rounded border border-border/50 p-1 text-center">
                    <span className="text-muted block text-[9.5px]">H{bh.house} ({signName(lang, bh.sign).slice(0, 4)})</span>
                    <strong className="text-ink font-semibold">{planetName(bh.lord, lang).slice(0, 4)}</strong>
                    <span className="text-[9.5px] text-accent block font-medium">SAV: {bh.sav}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {renderPageFooter(3)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: நவாம்ச சக்கரம் (D9 Navamsa Chart) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(4, lang === "ta" ? "நவாம்ச சக்கரம் & வர்கோத்தம நிலைகள்" : "Navamsa Chart (D9) & Vargottama")}

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center">
                <p className="font-display text-xs font-bold text-accent mb-1 text-center">
                  {lang === "ta" ? "தென்னிந்திய முறை நவாம்ச சக்கரம் (D9)" : "South Indian Navamsa Chart (D9)"}
                </p>
                <div className="w-56 sm:w-64 aspect-square">
                  <SouthChart positions={result.list} lang={lang} mode="navamsa" theme="light" />
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="rounded border border-accent/30 bg-elevated/30 p-2.5">
                  <h3 className="font-bold text-accent text-xs mb-1">
                    {lang === "ta" ? "நவாம்சத்தின் பயன்கள்" : "Purpose of Navamsa (D9)"}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {lang === "ta"
                      ? "நவாம்சம் என்பது தர்மம், திருமணம், வாழ்க்கைத்துணையின் குணம் மற்றும் ஒரு கிரகத்தின் உள்ளாற்றலை (Inner Strength) உறுதி செய்யும் மிக முக்கியமான வர்க்கமாகும்."
                      : "The Navamsa is the most crucial harmonic division, revealing the partner's disposition, marital destiny, and spiritual evolution."}
                  </p>
                </div>

                <div className="rounded border border-border/70 bg-surface p-2.5">
                  <h3 className="font-bold text-accent text-xs mb-1">
                    {lang === "ta" ? "வர்கோத்தம கிரகங்கள் (Vargottama Planets)" : "Vargottama Planets"}
                  </h3>
                  {analysis.grahas.filter((g) => g.vargottama).length > 0 ? (
                    <p className="text-ink font-medium leading-relaxed">
                      {lang === "ta" ? "வர்கோத்தமம் பெற்ற கிரகங்கள்: " : "Planets in Vargottama: "}
                      <strong className="text-accent">
                        {analysis.grahas
                          .filter((g) => g.vargottama)
                          .map((g) => planetName(g.id, lang))
                          .join(", ")}
                      </strong>
                      <span className="text-muted block text-[10px] mt-0.5">
                        {lang === "ta"
                          ? "இக்கிரகங்கள் இராசி மற்றும் நவாம்சத்தில் ஒரே இராசியில் இருப்பதால் இரட்டிப்பு சுப பலன் தரும்."
                          : "Possess fortified dignity by occupying identical signs in both D1 and D9."}
                      </span>
                    </p>
                  ) : (
                    <p className="text-muted">
                      {lang === "ta"
                        ? "நேரடி வர்கோத்தம கிரகங்கள் இல்லை; எனினும் பிற வர்க்க பலன்கள் இயல்பாகச் செயல்படுகின்றன."
                        : "No planets are strictly Vargottama; regular divisional dignities apply."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* D9 Graha Table */}
            <div className="mt-4 rounded-lg border border-border/70 bg-elevated/20 p-2.5 text-xs">
              <h3 className="font-bold text-accent text-xs mb-1.5 border-b border-border/40 pb-0.5">
                {lang === "ta" ? "நவாம்ச கிரக இருப்பு விவரங்கள்" : "Planetary Navamsa Placements"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10.5px]">
                {result.list.map((p) => {
                  const navSign = p.navamsa ?? 0;
                  return (
                    <div key={p.id} className="bg-surface rounded border border-border/50 p-1.5 text-center">
                      <span className="text-muted block text-[10px] font-semibold">{planetName(p.id, lang)}</span>
                      <span className="text-accent font-medium">{signName(lang, navSign)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {renderPageFooter(4)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 5: முழு கிரக நிலைகள் & தகுதிகள் அட்டவணை (Planetary Dignities Table) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(5, lang === "ta" ? "முழு கிரக நிலைகள், பாகைகள் & தகுதிகள்" : "Planetary Longitudes & Dignities")}

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="border-b-2 border-accent/40 bg-elevated/50 text-accent font-display">
                    <th className="py-1.5 px-2">{t(lang, "planet")}</th>
                    <th className="py-1.5 px-2">{t(lang, "rasi")}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "பாகை (DMS)" : "Longitude"}</th>
                    <th className="py-1.5 px-2">{t(lang, "nakshatra")}</th>
                    <th className="py-1.5 px-2">{t(lang, "pada")}</th>
                    <th className="py-1.5 px-2">{t(lang, "house")}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "நிலை" : "Dignity"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "வக்ரம்/அஸ்தமனம்" : "State"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {result.list.map((p) => {
                    const gr = analysis.grahas.find((g) => g.id === p.id);
                    return (
                      <tr key={p.id} className="hover:bg-elevated/20">
                        <td className="py-1.5 px-2 font-bold text-ink flex items-center gap-1">
                          <span>{planetName(p.id, lang)}</span>
                        </td>
                        <td className="py-1.5 px-2 text-muted">{signName(lang, p.sign)}</td>
                        <td className="py-1.5 px-2 font-mono text-ink text-[10px]">{p.dms}</td>
                        <td className="py-1.5 px-2 text-muted">{nakName(lang, p.nak)}</td>
                        <td className="py-1.5 px-2 text-center font-medium">{p.pada}</td>
                        <td className="py-1.5 px-2 text-center font-bold text-accent">{p.house}</td>
                        <td className="py-1.5 px-2">
                          <span className="rounded px-1.5 py-0.5 text-[9.5px] font-medium bg-elevated border border-border/60">
                            {gr ? gr.dignity : "—"}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-[10px] text-muted">
                          {p.retrograde && <span className="text-amber-700 font-semibold mr-1">R</span>}
                          {gr?.combust && <span className="text-red-700 font-semibold">C</span>}
                          {!p.retrograde && !gr?.combust && "Direct"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 rounded border border-border/60 bg-elevated/30 p-2.5 text-[10.5px] text-muted leading-relaxed">
              <span className="font-semibold text-ink">{lang === "ta" ? "குறிப்பு: " : "Note: "}</span>
              {lang === "ta"
                ? "R = வக்ரம் (Retrograde). C = அஸ்தமனம் (Combustion with Sun). ஆட்சி, உச்சம், நட்பு, பகை ஆகிய நிலைகள் பராசர விதிகளின்படி கணக்கிடப்பட்டுள்ளன."
                : "R denotes Retrograde motion; C denotes combustion with the Sun. Dignities follow classical Brihat Parasara Hora Sastra standards."}
            </div>
          </div>

          {renderPageFooter(5)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 6: உபகிரகங்கள் & சிறப்புக் லக்னங்கள் (Upagrahas & Special Lagnas) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(6, lang === "ta" ? "உபகிரகங்கள் & சிறப்புக் லக்னங்கள்" : "Upagrahas & Special Lagnas")}

            {/* Special Lagnas */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-3 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "சிறப்புக் லக்னங்கள் (Special Lagnas)" : "Special Lagnas"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.specialLagnas ? (
                  result.specialLagnas.map((sl) => (
                    <div key={sl.id} className="bg-surface rounded border border-border/60 p-2">
                      <span className="text-muted text-[10px] uppercase font-semibold block">{sl.nameEn}</span>
                      <strong className="text-accent font-display text-sm block mt-0.5">{signName(lang, sl.sign)}</strong>
                      <span className="text-[10px] font-mono text-muted">{sl.dms}</span>
                      <span className="text-[9.5px] text-muted block mt-1">
                        {lang === "ta" ? "பாவக மற்றும் கிரக ஆய்வு" : "Analysis Reference Point"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-xs">Calculated based on sunrise time.</p>
                )}
              </div>
            </div>

            {/* Upagrahas Table */}
            <div className="mt-4 rounded-lg border border-border/70 bg-surface p-3 text-xs shadow-2xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "உபகிரகங்களின் நிலைகள் (Placements of Upagrahas)" : "Upagrahas (Gulika, Mandi, Yamakantaka)"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10.5px]">
                  <thead>
                    <tr className="border-b border-accent/30 text-accent font-medium">
                      <th className="py-1 px-1.5">{lang === "ta" ? "உபகிரகம்" : "Upagraha"}</th>
                      <th className="py-1 px-1.5">{t(lang, "rasi")}</th>
                      <th className="py-1 px-1.5">{lang === "ta" ? "பாகை" : "Longitude"}</th>
                      <th className="py-1 px-1.5">{lang === "ta" ? "நட்சத்திர பாதம்" : "Nakshatra (Pada)"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {result.upagrahas ? (
                      result.upagrahas.slice(0, 7).map((up) => (
                        <tr key={up.id}>
                          <td className="py-1 px-1.5 font-semibold text-ink">{lang === "ta" ? up.nameTa : up.nameEn}</td>
                          <td className="py-1 px-1.5 text-muted">{signName(lang, up.sign)}</td>
                          <td className="py-1 px-1.5 font-mono text-[10px]">{up.dms}</td>
                          <td className="py-1 px-1.5 text-[10px] text-muted">{up.nak + 1} ({up.pada})</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="py-2 text-muted">No upagrahas recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {renderPageFooter(6)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 7: விரிவான ஷட்பல பலம் (Comprehensive Shadbala Strengths) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(7, lang === "ta" ? "கிரகங்களின் அறுவகை பலம் (Shadbala)" : "Planetary Six-Fold Strength (Shadbala)")}

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b-2 border-accent/40 bg-elevated/50 text-accent font-display">
                    <th className="py-1.5 px-1.5">{t(lang, "planet")}</th>
                    <th className="py-1.5 px-1.5">ஸ்தான பலம் (Sthana)</th>
                    <th className="py-1.5 px-1.5">திக் பலம் (Dig)</th>
                    <th className="py-1.5 px-1.5">கால பலம் (Kaala)</th>
                    <th className="py-1.5 px-1.5">சேஷ்டா பலம் (Cheshta)</th>
                    <th className="py-1.5 px-1.5">நைசர்கிகம் (Naisargika)</th>
                    <th className="py-1.5 px-1.5">த்ரிக் (Drik)</th>
                    <th className="py-1.5 px-1.5 font-bold">ரூபங்கள் (Rupas)</th>
                    <th className="py-1.5 px-1.5">தேவை (Req)</th>
                    <th className="py-1.5 px-1.5">{lang === "ta" ? "தரம்" : "Grade"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {shadbala.rows.map((r) => (
                    <tr key={r.id} className="hover:bg-elevated/20">
                      <td className="py-1.5 px-1.5 font-bold text-ink">{lang === "ta" ? r.nameTa : r.nameEn}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.sthanaBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.digBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.kaalaBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.cheshtaBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.naisargikaBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-mono">{r.drikBala.toFixed(0)}</td>
                      <td className="py-1.5 px-1.5 font-bold text-accent font-mono">{r.totalRupas.toFixed(2)}</td>
                      <td className="py-1.5 px-1.5 font-mono text-muted">{r.requiredRupas.toFixed(1)}</td>
                      <td className="py-1.5 px-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          r.grade === "uthamam" ? "bg-emerald-100 text-emerald-800" : r.grade === "madhyamam" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                        }`}>
                          {lang === "ta" ? r.gradeTa : r.gradeEn}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 rounded border border-border/70 bg-elevated/30 p-2.5 text-[10.5px] text-muted leading-relaxed">
              <p className="font-semibold text-ink mb-1">
                {lang === "ta" ? "ஷட்பல விளக்கக் குறிப்பு:" : "Shadbala Interpretation:"}
              </p>
              <p>
                {lang === "ta"
                  ? "ஒரு கிரகம் ஜாதகத்தில் தனது காரகத்துவங்களை முழுமையாக வெளிப்படுத்த குறைந்தபட்ச ரூபங்கள் தேவை. தேவையானதை விட அதிக பலம் பெற்ற கிரகங்கள் தம் தசா புத்திகளில் நன்மைகளை வாரி வழங்கும்."
                  : "Planets exceeding the required minimum Rupas manifest their positive significations effortlessly during their respective Mahadasa and Bhukti periods."}
              </p>
            </div>
          </div>

          {renderPageFooter(7)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 8: இஷ்ட-கஷ்ட பலம், விம்சொபகம் & பாவ பலம் (Ishta/Kashta & Bhava Bala) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(8, lang === "ta" ? "இஷ்ட-கஷ்ட பலம், விம்சொபகம் & பாவ பலம்" : "Ishta-Kashta, Vimsopaka & Bhava Bala")}

            {/* Ishta / Kashta Table */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-2.5 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-1.5 border-b border-accent/20 pb-1">
                {lang === "ta" ? "இஷ்ட பலம் & கஷ்ட பலம் (0 முதல் 60 வரை)" : "Ishta Phala & Kashta Phala (0 to 60 Scale)"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                {shadbala.rows.map((r) => (
                  <div key={r.id} className="bg-surface rounded border border-border/50 p-1.5 text-center">
                    <strong className="text-ink block">{lang === "ta" ? r.nameTa : r.nameEn}</strong>
                    <span className="text-emerald-700 block">இஷ்டம்: {r.ishtaPhala.toFixed(1)}</span>
                    <span className="text-amber-800 block">கஷ்டம்: {r.kashtaPhala.toFixed(1)}</span>
                    <span className="text-accent text-[9.5px] block">விம்சொபகம்: {r.vimsopaka.toFixed(1)}/20</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 12 Bhava Bala Table */}
            <div className="mt-3 rounded-lg border border-border/70 bg-surface p-2.5 text-xs shadow-2xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-1.5 border-b border-accent/20 pb-1">
                {lang === "ta" ? "12 பாவங்களின் முழு வலிமை அட்டவணை (Bhava Bala)" : "12 Bhava Strengths & Grades"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10.5px]">
                {shadbala.bhavaBalas.map((bh) => (
                  <div key={bh.house} className="bg-elevated/30 rounded border border-border/50 p-2">
                    <div className="flex justify-between font-bold text-accent">
                      <span>H{bh.house} ({signName(lang, bh.sign).slice(0, 5)})</span>
                      <span>{bh.totalBala} Rupas</span>
                    </div>
                    <div className="text-[10px] text-muted mt-1 space-y-0.5">
                      <div>அதிபதி: {planetName(bh.lord, lang)}</div>
                      <div>தரம்: <span className="text-ink font-medium">{lang === "ta" ? bh.gradeTa : bh.gradeEn}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {renderPageFooter(8)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGES 9-14: 12 பாவங்களின் முழு பலன்கள் (12 Bhavas Phalan: 2 houses/page) */}
      {/* ========================================================================= */}
      {[
        { pNum: 9, hA: 1, hB: 2, titleTa: "1 & 2 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "1st & 2nd House Comprehensive Analysis" },
        { pNum: 10, hA: 3, hB: 4, titleTa: "3 & 4 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "3rd & 4th House Comprehensive Analysis" },
        { pNum: 11, hA: 5, hB: 6, titleTa: "5 & 6 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "5th & 6th House Comprehensive Analysis" },
        { pNum: 12, hA: 7, hB: 8, titleTa: "7 & 8 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "7th & 8th House Comprehensive Analysis" },
        { pNum: 13, hA: 9, hB: 10, titleTa: "9 & 10 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "9th & 10th House Comprehensive Analysis" },
        { pNum: 14, hA: 11, hB: 12, titleTa: "11 & 12 ஆம் பாவங்களின் விரிவான பலன்கள்", titleEn: "11th & 12th House Comprehensive Analysis" },
      ].map((pair) => {
        const bA = analysis.bhavas[pair.hA - 1];
        const bB = analysis.bhavas[pair.hB - 1];
        return (
          <div key={pair.pNum} className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
            <Watermark />
            <div className="relative z-1 flex flex-col justify-between h-full">
              <div>
                {renderGodHeader(pair.pNum, lang === "ta" ? pair.titleTa : pair.titleEn)}

                {/* House A */}
                <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/20 p-3 text-xs">
                  <div className="flex items-center justify-between border-b border-accent/20 pb-1 mb-2">
                    <h2 className="font-display font-bold text-accent text-sm">
                      {pair.hA}-ஆம் பாவம்: {signName(lang, bA.sign)} ({lang === "ta" ? "அதிபதி: " : "Lord: "}{planetName(bA.lord, lang)})
                    </h2>
                    <span className="text-accent font-semibold text-xs">SAV: {bA.sav} {lang === "ta" ? "புள்ளிகள்" : "Bindus"}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed text-ink space-y-1.5">
                    <p>
                      <strong className="text-accent">{pair.hA}-ஆம் இடத்தின் காரகத்துவங்கள்: </strong>
                      {pair.hA === 1 && (lang === "ta" ? "உடலமைப்பு, குணம், ஆரோக்கியம், தோற்றம், வாழ்வின் தொடக்கம் மற்றும் ஆயுள்." : "Physical constitution, vitality, character, self-identity, and longevity.")}
                      {pair.hA === 3 && (lang === "ta" ? "தைரியம், இளைய சகோதரர், தகவல் தொடர்பு, குறுகிய பயணங்கள் மற்றும் எழுத்தாற்றல்." : "Courage, younger siblings, communication, short travels, and writing.")}
                      {pair.hA === 5 && (lang === "ta" ? "புத்தி கூர்மை, குழந்தைகள், பூர்வ புண்ணியம், ஆக்கப்பூர்வ சிந்தனை மற்றும் மந்திர சித்தி." : "Intellect, progeny, past merits, creativity, and speculative fortune.")}
                      {pair.hA === 7 && (lang === "ta" ? "திருமணம், வாழ்க்கைத்துணை, கூட்டுத் தொழில், சமூக உறவுகள் மற்றும் பொது மக்கள் தொடர்பு." : "Marriage, spouse, business partnerships, and interpersonal diplomacy.")}
                      {pair.hA === 9 && (lang === "ta" ? "பாக்கியம், தந்தை, ஆன்மிகம், உயர் கல்வி, தர்ம நெறி, குருவருள் மற்றும் நீண்ட தூரப் பயணங்கள்." : "Fortune, father, higher philosophy, preceptor grace, and foreign pilgrimages.")}
                      {pair.hA === 11 && (lang === "ta" ? "லாபம், வருமானம், மூத்த சகோதரர், ஆசைகள் நிறைவேறுதல் மற்றும் நல்வட்டாரங்கள்." : "Gains, liquid wealth, elder siblings, network alliances, and fruition of hopes.")}
                    </p>
                    <p>
                      {lang === "ta"
                        ? `அதிபதி ${planetName(bA.lord, lang)} ${bA.lordHouse}-ஆம் வீட்டில் உள்ளார். பாவாதிபதியின் நிலை மற்றும் ${bA.sav} அஷ்டவர்க்கப் புள்ளிகள் சுபமான வளர்ச்சிக்குத் தூண்டுகோலாக அமைகின்றன.`
                        : `Lord ${planetName(bA.lord, lang)} is placed in house ${bA.lordHouse}. Supported by ${bA.sav} SAV bindus, this house brings favorable development.`}
                    </p>
                  </div>
                </div>

                {/* House B */}
                <div className="mt-3 rounded-lg border border-accent/30 bg-surface p-3 text-xs shadow-2xs">
                  <div className="flex items-center justify-between border-b border-accent/20 pb-1 mb-2">
                    <h2 className="font-display font-bold text-accent text-sm">
                      {pair.hB}-ஆம் பாவம்: {signName(lang, bB.sign)} ({lang === "ta" ? "அதிபதி: " : "Lord: "}{planetName(bB.lord, lang)})
                    </h2>
                    <span className="text-accent font-semibold text-xs">SAV: {bB.sav} {lang === "ta" ? "புள்ளிகள்" : "Bindus"}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed text-ink space-y-1.5">
                    <p>
                      <strong className="text-accent">{pair.hB}-ஆம் இடத்தின் காரகத்துவங்கள்: </strong>
                      {pair.hB === 2 && (lang === "ta" ? "தனம், வாக்கு, குடும்பம், கண் பார்வை, தொடக்கக் கல்வி மற்றும் சேமிப்பு." : "Wealth, speech, family, eyesight, primary learning, and savings.")}
                      {pair.hB === 4 && (lang === "ta" ? "தாய், சுகம், பூமி, வீடு, வாகனம், கல்வி மற்றும் மன அமைதி." : "Mother, domestic bliss, fixed properties, vehicles, and peace of mind.")}
                      {pair.hB === 6 && (lang === "ta" ? "ருணம் (கடன்), ரோகம் (நோய்), சத்ரு (எதிரிகள்), அன்றாட உழைப்பு மற்றும் சவால்களை வெல்லுதல்." : "Debts, illnesses, competitive adversaries, and daily diligence.")}
                      {pair.hB === 8 && (lang === "ta" ? "ஆயுள், திடீர் மாற்றங்கள், பரம்பரைச் சொத்து, மறைபொருள் ஆராய்ச்சி மற்றும் மன உறுதி." : "Longevity, unearned windfalls, esoteric research, and resilience.")}
                      {pair.hB === 10 && (lang === "ta" ? "தொழில், ஜீவனம், கர்மம், தலைமைப் பொறுப்பு, சமூக அந்தஸ்து மற்றும் கௌரவம்." : "Career, vocation, public leadership, authority, and professional honor.")}
                      {pair.hB === 12 && (lang === "ta" ? "விரயம், செலவுகள், வெளிநாடு செல்லுதல், ஆன்மிக மோக்ஷம், தியானம் மற்றும் ஆசிரம வாழ்க்கை." : "Expenditures, foreign relocation, spiritual liberation, and solitude.")}
                    </p>
                    <p>
                      {lang === "ta"
                        ? `அதிபதி ${planetName(bB.lord, lang)} ${bB.lordHouse}-ஆம் வீட்டில் உள்ளார். இப்பாமானது ${bB.sav >= 28 ? "வலுவான சாதக நிலையைக்" : "சமநிலை உழைப்பைக்"} குறிக்கிறது.`
                        : `Lord ${planetName(bB.lord, lang)} sits in house ${bB.lordHouse}. The house shows ${bB.sav >= 28 ? "strong auspicious support" : "balanced constructive effort"}.`}
                    </p>
                  </div>
                </div>
              </div>

              {renderPageFooter(pair.pNum)}
            </div>
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* PAGES 15-22: சிறப்பு வாழ்க்கை அத்தியாயங்கள் (Special Life Area Chapters) */}
      {/* ========================================================================= */}
      {lifeAreas.slice(0, 8).map((area, idx) => {
        const pageNumber = 15 + idx;
        return (
          <div key={area.id} className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
            <Watermark />
            <div className="relative z-1 flex flex-col justify-between h-full">
              <div>
                {renderGodHeader(pageNumber, area.title)}

                <div className="mt-3 rounded-lg border border-accent/30 bg-surface p-3 text-xs shadow-2xs">
                  <div className="space-y-2.5 text-[11px] leading-relaxed text-ink">
                    {area.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="border-b border-border/30 pb-2 last:border-none">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded border border-accent/20 bg-elevated/30 p-2.5 text-[10.5px] text-muted">
                  <span className="font-semibold text-accent">{lang === "ta" ? "ஜோதிட ஆலோசனை: " : "Astrological Counsel: "}</span>
                  {lang === "ta"
                    ? "விதி என்பது நாம் முற்பிறவியில் செய்த கர்ம வினை; மதியால் அதைச் சீரமைத்து நல்ல முடிவுகளை எடுக்கவும் மன அமைதி பெறவும் இறைவன் அருள் துணையாகும்."
                    : "Planetary configurations reflect karmic predispositions; mindful conscious action and divine grace bring harmony."}
                </div>
              </div>

              {renderPageFooter(pageNumber)}
            </div>
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* PAGE 23: விம்சொத்தரி தசா-புக்தி 120 ஆண்டு காலவரிசை (120-Year Dasa Timeline) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(23, lang === "ta" ? "விம்சொத்தரி மகா தசா 120 ஆண்டு கால அட்டவணை" : "Vimshottari 120-Year Dasa Timeline")}

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="border-b-2 border-accent/40 bg-elevated/50 text-accent font-display">
                    <th className="py-1.5 px-2">{lang === "ta" ? "மகா தசா" : "Mahadasa"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "அதிபதி" : "Planet"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "ஆண்டுகள்" : "Span"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "தொடக்கத் தேதி" : "Start Date"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "முடிவுத் தேதி" : "End Date"}</th>
                    <th className="py-1.5 px-2">{lang === "ta" ? "நிலை" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {result.dasa.periods.map((p, idx) => {
                    const isCurrent = analysis.dasaNow?.maha === p.lord;
                    return (
                      <tr key={idx} className={isCurrent ? "bg-accent/10 font-bold" : "hover:bg-elevated/20"}>
                        <td className="py-1.5 px-2 text-ink flex items-center gap-1.5">
                          {isCurrent && <span className="size-1.5 rounded-full bg-accent animate-pulse" />}
                          <span>{planetName(p.lord, lang)} தசா</span>
                        </td>
                        <td className="py-1.5 px-2 text-muted">{planetName(p.lord, lang)}</td>
                        <td className="py-1.5 px-2 font-mono">{p.years.toFixed(1)} yrs</td>
                        <td className="py-1.5 px-2 font-mono text-[10px]">{formatJD(p.startJD, result.input.tz)}</td>
                        <td className="py-1.5 px-2 font-mono text-[10px]">{formatJD(p.endJD, result.input.tz)}</td>
                        <td className="py-1.5 px-2 text-[10px]">
                          {isCurrent ? (
                            <span className="text-accent font-bold">{lang === "ta" ? "தற்போது நடப்பது" : "Active Now"}</span>
                          ) : (
                            <span className="text-muted">{lang === "ta" ? "எதிர்காலம்" : "Period"}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 rounded border border-border/70 bg-elevated/20 p-2.5 text-[10.5px] text-muted">
              {lang === "ta"
                ? "மனித வாழ்வின் முழு ஆயுட் சுழற்சியான 120 ஆண்டுகளை 9 நவகிரகங்கள் முறையே ஆட்சி செய்கின்றன. ஒவ்வொரு தசாவிலும் உப-காலமான புக்திகள் சுழற்சி முறையில் இயங்கும்."
                : "Vimshottari Dasa assigns 120 years divided across the nine planetary rulers based on the precise lunar natal position."}
            </div>
          </div>

          {renderPageFooter(23)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 24: தற்போதைய தசா-புக்தி விரிவான பலன் (Current Dasa-Bhukti Forecast) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(24, lang === "ta" ? "தற்போதைய தசா-புக்தி வழிகாட்டுதல் பலன்கள்" : "Active Dasa-Bhukti Life Guidance")}

            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-3 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "தற்போதைய நடப்பு காலம்" : "Current Running Period"}
              </h2>
              {analysis.dasaNow ? (
                <div className="text-[11px] space-y-1">
                  <p>
                    <span className="text-muted">{lang === "ta" ? "மகா தசா நாதன்" : "Mahadasa Lord"}: </span>
                    <strong className="text-accent text-sm">{planetName(analysis.dasaNow.maha, lang)}</strong>
                  </p>
                  <p>
                    <span className="text-muted">{lang === "ta" ? "புக்தி நாதன்" : "Bhukti Lord"}: </span>
                    <strong className="text-ink">{planetName(analysis.dasaNow.bhukti, lang)}</strong>
                  </p>
                  <p>
                    <span className="text-muted">{lang === "ta" ? "புக்தி காலம்" : "Bhukti Duration"}: </span>
                    <span className="font-mono text-muted">
                      {formatJD(analysis.dasaNow.bhuktiStart, result.input.tz)} {lang === "ta" ? "முதல்" : "to"} {formatJD(analysis.dasaNow.bhuktiEnd, result.input.tz)}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            {/* Classical Dasa Narrative */}
            <div className="mt-3 rounded-lg border border-border/70 bg-surface p-3 text-xs shadow-2xs">
              <h3 className="font-bold text-accent text-xs mb-2">
                {lang === "ta" ? "பராசர முனிவர் வழி வந்த தசா பலன்" : "Classical Dasa Narrative Phalan"}
              </h3>
              <p className="text-[11px] leading-relaxed text-ink">
                {dasaNarrativeText}
              </p>
            </div>
          </div>

          {renderPageFooter(24)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 25: சுப யோகங்கள் விரிவான தொகுப்பு (Exhaustive Yogas Analysis) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(25, lang === "ta" ? "ஜாதகத்தில் அமைந்த சுப யோகங்கள்" : "Auspicious Planetary Yogas")}

            <div className="mt-3 space-y-2 text-xs">
              {analysis.yogas.filter((y) => y.kind === "yoga" && y.present).length > 0 ? (
                analysis.yogas
                  .filter((y) => y.kind === "yoga" && y.present)
                  .map((y) => (
                    <div key={y.id} className="rounded border border-accent/30 bg-surface p-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-accent font-display text-xs">{lang === "ta" ? y.nameTa : y.nameEn}</strong>
                        <span className="text-[10px] rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-semibold">
                          {lang === "ta" ? "அமைந்துள்ளது" : "Present"}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-muted mt-1 leading-relaxed">
                        {lang === "ta" ? y.detailTa : y.detailEn}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="rounded border border-border/60 bg-elevated/20 p-3 text-center text-muted">
                  {lang === "ta" ? "சிறப்பு முதன்மை யோகங்கள் இல்லை; பொதுவான சுப நிலைகள் செயல்படுகின்றன." : "Standard planetary alignments operate smoothly."}
                </div>
              )}
            </div>
          </div>

          {renderPageFooter(25)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 26: தோஷங்கள் & நிவர்த்திகள் (Doshas: Chevvai, Kaal Sarpa, Sade Sati) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(26, lang === "ta" ? "தோஷங்கள் & சாஸ்திர நிவர்த்திகள்" : "Doshas & Astrological Mitigations")}

            <div className="mt-3 space-y-2.5 text-xs">
              {/* Chevvai Dosha */}
              <div className="rounded border border-accent/30 bg-surface p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-accent text-xs">
                    {lang === "ta" ? "செவ்வாய் தோஷ நிலை (Chevvai / Manglik)" : "Chevvai (Manglik) Status"}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    analysis.chevvai.present ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {analysis.chevvai.present ? (lang === "ta" ? "தோஷம் உள்ளது" : "Present") : (lang === "ta" ? "தோஷம் இல்லை / நிவர்த்தி" : "No Dosha")}
                  </span>
                </div>
                <p className="text-[10.5px] text-muted mt-1.5 leading-relaxed">
                  {analysis.chevvai.present
                    ? (lang === "ta"
                        ? "லக்னம், சந்திரன் அல்லது சுக்கிரனுக்கு 2, 4, 7, 8, 12 இல் செவ்வாய் உள்ளார். சம தோஷமுள்ள ஜாதகங்களை இணைப்பது நன்று."
                        : "Mars occupies sensitive marital houses (2, 4, 7, 8, 12). Matching with a partner possessing similar balance is advised.")
                    : (lang === "ta"
                        ? "செவ்வாய் தோஷம் இல்லை அல்லது ஆட்சி/உச்ச/குரு பார்வை விதிகளால் முழுமையாக நிவர்த்தி அடைந்துள்ளது."
                        : "No affliction; Mars is well-disposed or neutralized by aspectual harmony.")}
                </p>
              </div>

              {/* Kaal Sarpa */}
              <div className="rounded border border-accent/30 bg-surface p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-accent text-xs">
                    {lang === "ta" ? "காலசர்ப்ப தோஷ நிலை" : "Kaal Sarpa Status"}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    analysis.kaalSarpa.present ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {analysis.kaalSarpa.present ? (lang === "ta" ? "தோஷம் உள்ளது" : "Present") : (lang === "ta" ? "தோஷம் இல்லை" : "Absent")}
                  </span>
                </div>
                <p className="text-[10.5px] text-muted mt-1.5 leading-relaxed">
                  {analysis.kaalSarpa.present
                    ? (lang === "ta"
                        ? "அனைத்து கிரகங்களும் ராகு-கேதுவின் பிடியில் உள்ளன. காளஹஸ்தி அல்லது திருநாகேஸ்வரம் வழிபாடு மன அமைதி தரும்."
                        : "Planets hemmed between nodal axis. Dedicated prayers at Rahu-Ketu sthalams mitigate fluctuations.")
                    : (lang === "ta"
                        ? "காலசர்ப்ப தோஷம் இல்லை; கிரகங்கள் சுதந்திரமாக இயங்குகின்றன."
                        : "No Kaal Sarpa yoga detected.")}
                </p>
              </div>

              {/* Sade Sati */}
              <div className="rounded border border-accent/30 bg-surface p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-accent text-xs">
                    {lang === "ta" ? "ஏழரைச் சனி / அஷ்டமச் சனி நிலை" : "Saturn Transit (Sade Sati / Ashtama)"}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    analysis.sadeSati.present ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {analysis.sadeSati.present ? (lang === "ta" ? "சனி தாக்கம் உள்ளது" : "Under Influence") : (lang === "ta" ? "தாக்கம் இல்லை" : "Free")}
                  </span>
                </div>
                <p className="text-[10.5px] text-muted mt-1.5 leading-relaxed">
                  {lang === "ta"
                    ? "சனீஸ்வர பகவான் நியாயத்தின் தெய்வம். சனிக்கிழமைகளில் எள் தீபம் மற்றும் விஷ்ணு/ஹனுமான் வழிபாடு நலம் பயக்கும்."
                    : "Saturn rewards discipline and patience. Regular charity and quiet persistence yield lasting rewards."}
                </p>
              </div>
            </div>
          </div>

          {renderPageFooter(26)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 27: அஷ்டகவர்க்க அட்டவணை (Ashtakavarga SAV & BAV Tables) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(27, lang === "ta" ? "அஷ்டகவர்க்க பரல்கள் & வலிமை (SAV & BAV)" : "Ashtakavarga System (SAV & BAV)")}

            {/* SAV Table */}
            <div className="mt-3 rounded-lg border border-accent/30 bg-elevated/30 p-2.5 text-xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-2 border-b border-accent/20 pb-1">
                {lang === "ta" ? "சர்வாஷ்டகவர்க்கம் (SAV) - 12 இராசிகளின் பரல்கள்" : "Sarvashtakavarga (SAV) Bindus"}
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 text-center text-[10.5px]">
                {result.sav.map((pts, signIdx) => (
                  <div key={signIdx} className={`p-1.5 rounded border ${pts >= 28 ? "bg-emerald-50 border-emerald-300" : "bg-surface border-border/50"}`}>
                    <span className="text-muted block text-[9.5px]">{signName(lang, signIdx).slice(0, 4)}</span>
                    <strong className={`text-xs ${pts >= 28 ? "text-emerald-800" : "text-ink"}`}>{pts} pts</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* BAV Table */}
            <div className="mt-3 rounded-lg border border-border/70 bg-surface p-2.5 text-xs shadow-2xs">
              <h2 className="font-display text-xs font-bold text-accent uppercase tracking-wider mb-1.5 border-b border-border/40 pb-1">
                {lang === "ta" ? "பின்னாஷ்டகவர்க்கம் (BAV) - 7 கிரகங்களின் பங்களிப்பு" : "Bhinnashtakavarga (BAV) Distribution"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse text-[9.5px]">
                  <thead>
                    <tr className="border-b border-accent/30 bg-elevated/40 text-accent font-medium">
                      <th className="py-1 px-1 text-left">{t(lang, "planet")}</th>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <th key={i} className="py-1 px-0.5">{signName(lang, i).slice(0, 2)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {(["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as const).map((pl) => {
                      const row = result.bav[pl] || [];
                      return (
                        <tr key={pl}>
                          <td className="py-1 px-1 text-left font-bold text-ink">{planetName(pl, lang)}</td>
                          {row.map((val, sIdx) => (
                            <td key={sIdx} className={`py-1 px-0.5 ${val >= 5 ? "font-bold text-emerald-800" : "text-muted"}`}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {renderPageFooter(27)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 28: கோச்சாரக் கணிப்பு (Gochara Planetary Transits) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(28, lang === "ta" ? "கோச்சாரக் கணிப்பு & 12-24 மாத கால வழிகாட்டல்" : "Gochara Planetary Transits Outlook")}

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded border border-border/70 bg-surface p-3 shadow-2xs">
                <h3 className="font-display font-bold text-accent text-xs mb-1.5">
                  {lang === "ta" ? "குரு பெயர்ச்சி தாக்கம் (Jupiter Transit)" : "Jupiter Transit"}
                </h3>
                <p className="text-[10.5px] text-muted leading-relaxed">
                  {lang === "ta"
                    ? "குரு பகவானின் சுபப் பார்வை படும் இடங்கள் வளமும் புண்ணியமும் பெறும். 2, 5, 7, 9, 11-ஆம் இடங்களில் குரு சஞ்சாரம் செய்யும் காலம் திருமண மற்றும் பொருளாதார மேன்மைக்கு உகந்தது."
                    : "Jupiter's benign transit across 2nd, 5th, 7th, 9th, and 11th from Moon initiates financial growth, social respect, and auspicious ceremonies."}
                </p>
              </div>

              <div className="rounded border border-border/70 bg-surface p-3 shadow-2xs">
                <h3 className="font-display font-bold text-accent text-xs mb-1.5">
                  {lang === "ta" ? "சனி பெயர்ச்சி தாக்கம் (Saturn Transit)" : "Saturn Transit"}
                </h3>
                <p className="text-[10.5px] text-muted leading-relaxed">
                  {lang === "ta"
                    ? "சனி பகவான் 3, 6, 11-ஆம் இடங்களில் சஞ்சரிக்கும் போது எதிரிகளை வெல்லுதல், பதவி உயர்வு மற்றும் அசையாச் சொத்துக்களை உருவாக்கும் வல்லமை தருகிறார்."
                    : "Favorable in houses 3, 6, and 11 from the natal Moon, bestowing endurance, career stabilization, and triumph over hurdles."}
                </p>
              </div>

              <div className="rounded border border-border/70 bg-surface p-3 shadow-2xs">
                <h3 className="font-display font-bold text-accent text-xs mb-1.5">
                  {lang === "ta" ? "ராகு-கேது பெயர்ச்சி தாக்கம் (Nodal Transits)" : "Rahu-Ketu Transit"}
                </h3>
                <p className="text-[10.5px] text-muted leading-relaxed">
                  {lang === "ta"
                    ? "ராகு 3, 6, 11 இல் நன்மைகளையும், கேது ஆன்மிக ஞானத்தையும் அருள்கிறார். தசா நாதனுடன் கோச்சார கிரகங்களை ஒப்பிட்டுப் பலன் காண வேண்டும்."
                    : "Rahu yields material elevation in 3, 6, 11, while Ketu deepens spiritual clarity and intuition."}
                </p>
              </div>
            </div>
          </div>

          {renderPageFooter(28)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 29: ஷோடசவர்க்க வர்க்க சக்கரங்கள் (Shodashavarga Divisional Charts) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(29, lang === "ta" ? "ஷோடசவர்க்க வர்க்க சக்கரங்கள் விளக்கம்" : "Shodashavarga Divisional Charts")}

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { v: "D1", name: lang === "ta" ? "இராசி" : "Rasi", desc: lang === "ta" ? "உடல் & முழு வாழ்க்கை" : "Physical Body & Life" },
                { v: "D2", name: lang === "ta" ? "ஹோர" : "Hora", desc: lang === "ta" ? "தனம் & செல்வம்" : "Wealth & Resources" },
                { v: "D3", name: lang === "ta" ? "திரேக்காணம்" : "Drekkana", desc: lang === "ta" ? "உடன்பிறப்பு & வீரம்" : "Siblings & Courage" },
                { v: "D4", name: lang === "ta" ? "சதுர்த்தாம்சம்" : "Chaturthamsa", desc: lang === "ta" ? "சொத்து & சுகம்" : "Properties & Fortune" },
                { v: "D7", name: lang === "ta" ? "சப்தாம்சம்" : "Saptamsa", desc: lang === "ta" ? "புத்திர பாக்கியம்" : "Children & Progeny" },
                { v: "D9", name: lang === "ta" ? "நவாம்சம்" : "Navamsa", desc: lang === "ta" ? "தர்மம் & துணைவர்" : "Dharma & Spouse" },
                { v: "D10", name: lang === "ta" ? "தசாம்சம்" : "Dasamsa", desc: lang === "ta" ? "தொழில் & அந்தஸ்து" : "Career & Public Status" },
                { v: "D12", name: lang === "ta" ? "துவாதசாம்சம்" : "Dwadasamsa", desc: lang === "ta" ? "பெற்றோர் & பரம்பரை" : "Parents & Heritage" },
                { v: "D16", name: lang === "ta" ? "ஷோடசாம்சம்" : "Shodasamsa", desc: lang === "ta" ? "வாகனம் & சுகபோகம்" : "Vehicles & Pleasures" },
                { v: "D20", name: lang === "ta" ? "விம்சாம்சம்" : "Vimsamsa", desc: lang === "ta" ? "உபாசனை & பக்தி" : "Spiritual Worship" },
                { v: "D24", name: lang === "ta" ? "சதுர்விம்சாம்சம்" : "Chaturvimsamsa", desc: lang === "ta" ? "கல்வி & வித்தை" : "Higher Learning & Arts" },
                { v: "D60", name: lang === "ta" ? "ஷஷ்டியாம்சம்" : "Shastiamsa", desc: lang === "ta" ? "முழு கர்ம வினை" : "Past Karmic Roots" },
              ].map((item) => (
                <div key={item.v} className="rounded border border-border/60 bg-surface p-2 text-center">
                  <strong className="text-accent text-xs block">{item.v} ({item.name})</strong>
                  <span className="text-[10px] text-muted block mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded border border-accent/20 bg-elevated/30 p-2.5 text-[10.5px] text-muted leading-relaxed">
              <p>
                {lang === "ta"
                  ? "ஒரு கிரகம் இராசி சக்கரத்தில் (D1) பலவீனமாக இருந்தாலும், தொடர்புடைய வர்க்க சக்கரத்தில் நன்னிலையில் இருந்தால் அதற்கேற்ப சுப பலன்களை வழங்கும்."
                  : "Divisional charts refine and validate predictions, uncovering subtleties obscured in the primary Rasi chart."}
              </p>
            </div>
          </div>

          {renderPageFooter(29)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 30: பரிகாரங்கள் & பொறுப்புத் துறப்பு (Remedies, Shanti & Disclaimer) */}
      {/* ========================================================================= */}
      <div className="print-page relative flex flex-col justify-between overflow-hidden bg-[#fffdfa] border border-[#dcd3c4] p-4 sm:p-5 mb-8 print:mb-0 print:border-none">
        <Watermark />
        <div className="relative z-1 flex flex-col justify-between h-full">
          <div>
            {renderGodHeader(30, lang === "ta" ? "சாஸ்திர பரிகாரங்கள் & உத்தியோகபூர்வ பொறுப்புத் துறப்பு" : "Remedies & Disclaimer")}

            {/* Traditional Remedies */}
            <div className="mt-3 space-y-2 text-xs">
              {remedies.map((rem) => (
                <div key={rem.id} className="rounded border border-accent/30 bg-surface p-2.5 shadow-2xs">
                  <h3 className="font-display font-bold text-accent text-xs mb-1">
                    {rem.title}
                  </h3>
                  <p className="text-[10.5px] text-muted leading-relaxed">
                    {rem.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Calculation Provenance & Receipt for Official Booklet */}
            <div className="mt-3 rounded border border-accent/20 bg-surface p-2 text-[10px] text-muted">
              <div className="flex items-center justify-between font-mono font-bold text-accent text-[10.5px] border-b border-border/60 pb-1 mb-1">
                <span>{lang === "ta" ? "வானியல் கணக்கீட்டுச் சான்றளிப்பு" : "Astronomical Calculation Receipt"}</span>
                {result.metadata?.reportCalculationHash && (
                  <span>#{result.metadata.reportCalculationHash}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                <div>
                  <span className="font-semibold text-ink">{lang === "ta" ? "அயனாம்சம்: " : "Ayanamsa: "}</span>
                  Chitrapaksha / Lahiri
                </div>
                <div>
                  <span className="font-semibold text-ink">{lang === "ta" ? "பாவ முறை: " : "Houses: "}</span>
                  Whole Sign (Rasi=Bhava)
                </div>
                <div>
                  <span className="font-semibold text-ink">{lang === "ta" ? "எஃபிமெரிஸ்: " : "Ephemeris: "}</span>
                  JPL DE440 Analytical (&lt;60")
                </div>
                <div>
                  <span className="font-semibold text-ink">{lang === "ta" ? "தசா முறை: " : "Dasa: "}</span>
                  Vimshottari (365.25d)
                </div>
              </div>
            </div>

            {/* Hyperlinked Official Disclaimer */}
            <div className="mt-4 rounded-lg border-2 border-accent/30 bg-elevated/30 p-3 text-xs">
              <h3 className="font-display font-bold text-accent text-xs mb-1.5">
                {lang === "ta" ? "பொறுப்புத் துறப்பு (Disclaimer & Terms)" : "Disclaimer & Terms"}
              </h3>
              <p className="text-[10px] text-muted leading-relaxed">
                {lang === "ta" ? (
                  <>
                    பொறுப்புத் துறப்பு: இவ்வறிக்கை பயனரால் உள்ளிடப்பட்ட பிறந்த விபரங்களின் அடிப்படையில் கணினி மூலம் தானாகக் கணிக்கப்பட்டதாகும். இது வழிகாட்டுதலுக்காக மட்டுமே வழங்கப்படுகிறது. திருமணம், தொழில், நிதி மற்றும் மருத்துவம் சார்ந்த முக்கிய முடிவுகளுக்கு அனுபவமிக்க பாரம்பரிய ஜோதிடரிடம் சரிபார்த்துக் கொள்ளவும். முழுமையான விதிமுறைகள் மற்றும் நிபந்தனைகளை எங்கள் இணையதளத்தில் பார்வையிடவும்:{" "}
                    <a
                      href="https://astro.codepackr.com/?page=disclaimer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent underline hover:opacity-80"
                    >
                      https://astro.codepackr.com/?page=disclaimer
                    </a>
                  </>
                ) : (
                  <>
                    Disclaimer: This 30-page astrological report is automatically computed by software based on user inputs. It is intended solely for personal study and spiritual guidance. Consult qualified professionals before making significant life, matrimonial, or financial decisions. Review the complete terms at:{" "}
                    <a
                      href="https://astro.codepackr.com/?page=disclaimer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent underline hover:opacity-80"
                    >
                      https://astro.codepackr.com/?page=disclaimer
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {renderPageFooter(30)}
        </div>
      </div>
    </div>
  );
}
