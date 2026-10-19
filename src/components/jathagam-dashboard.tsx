import { useState, type ReactNode } from "react";
import { BarChart3, BookOpen, Check, FileDown, FileText, Info, Printer, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { exportElementToPdf } from "@/lib/pdf-export";
import { Watermark } from "@/components/watermark";
import type { BirthInput, ChartResult } from "@/lib/astro/engine";
import { formatClock } from "@/lib/astro/engine";
import { SIGNS_EN, SIGNS_TA, NAK_EN, NAK_TA, TITHI_EN, TITHI_TA, YOGA_EN, YOGA_TA, KARANA_EN, KARANA_TA, WEEK_EN, WEEK_TA, planetName } from "@/lib/astro/constants";
import { signName as sharedSignName } from "@/lib/astro/constants";
import type { Lang } from "@/lib/astro/i18n";
import { t } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { BirthForm } from "@/components/birth-form";
import { SouthChart } from "@/components/south-chart";
import { PrintHoroscopeSheet } from "@/components/print-horoscope-sheet";
import { FullReport } from "@/components/full-report";
import { PrintDialog } from "@/components/print-dialog";
import { RotatingQuote } from "@/components/rotating-quote";
import { CalculationCard } from "@/components/calculation-card";
import { analyse } from "@/lib/astro/analysis";
import { cn } from "@/lib/utils";
import { useGanesh } from "@/lib/ganesh-context";
import { useLang } from "@/lib/lang";
import { AstroModelSwitcher } from "@/components/astro-model-switcher";
import { NorthChart } from "@/components/north-chart";
import { type AyanamsaMode, getKpSubLordDetails } from "@/lib/astro/astronomy/ayanamsa-models";
import { REGIONAL_PRESETS, type SupportedLocale } from "@/lib/astro/locales/multi-lang";

export type ReportMode = "one" | "six" | "thirty";

export function parseReportModeFromUrl(): ReportMode {
  if (typeof window === "undefined") return "one";
  const params = new URLSearchParams(window.location.search);
  const m = params.get("mode");
  if (m === "six" || m === "thirty" || m === "one") return m;
  return "one";
}

export function JathagamDashboard({lang,draft,onChange,onSubmit,result}:{lang:Lang;draft:BirthInput;onChange:(v:BirthInput)=>void;onSubmit:()=>void;result:ChartResult|null}) {
  const { setLang } = useLang();
  const [mode, setModeState] = useState<ReportMode>(parseReportModeFromUrl);
  const [chartStyle, setChartStyle] = useState<'SOUTH' | 'NORTH'>(() => REGIONAL_PRESETS[lang]?.defaultChartStyle || 'SOUTH');
  const [ayanamsaMode, setAyanamsaMode] = useState<AyanamsaMode>('LAHIRI');
  const [pdfBusy,setPdfBusy]=useState(false);
  const [pdfError,setPdfError]=useState("");
  const [showPrintModal,setShowPrintModal]=useState(false);
  const {go}=useNav();

  const handleAyanamsaChange = (newMode: AyanamsaMode) => {
    setAyanamsaMode(newMode);
    const schoolMap: Record<AyanamsaMode, typeof draft.school> = {
      LAHIRI: 'lahiri',
      KP_NEW: 'kp',
      BV_RAMAN: 'raman',
      YUKTESHWAR: 'lahiri',
      TRUE_PUSHYA: 'lahiri',
    };
    onChange({ ...draft, school: schoolMap[newMode] || 'lahiri', ayanamsaMode: newMode });
  };

  const setMode = (newMode: ReportMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("mode", newMode);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state, mode: newMode }, "", newUrl);
    }
  };
  const generate=()=>onSubmit();
  const printSelected=()=>{
    setPdfError("");
    setShowPrintModal(true);
    try {
      window.print();
    } catch (err) {
      console.warn("window.print deferred to modal:", err);
    }
  };
  const downloadPdf=async()=>{
    setPdfBusy(true);
    setPdfError("");
    try {
      await exportSelectedPdf(mode,result?.input.name);
    } catch (error) {
      console.error("Jathagam PDF export failed",error);
      setPdfError(lang==="ta"?"PDF உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.":"PDF export failed. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  const birthDate = result ? `${String(result.input.day).padStart(2,"0")}-${String(result.input.month).padStart(2,"0")}-${result.input.year}` : "";
  const birthTime = result ? `${String(result.input.hour).padStart(2,"0")}:${String(result.input.minute).padStart(2,"0")}` : "";

  return <main className="astro-dashboard mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
    {/* Breadcrumbs (Section 81) */}
    <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
      <button
        type="button"
        onClick={() => go("home")}
        className="hover:text-accent transition-colors flex items-center gap-1"
      >
        <span>{ui(lang, "home")}</span>
      </button>
      <span className="text-slate-300">/</span>
      <span className="text-slate-800">{ui(lang, "horoscope")}</span>
    </nav>

    <section className="astro-hero mb-5 flex flex-col justify-between gap-5 rounded-2xl border border-accent/20 bg-white/90 p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/15 to-accent/5 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-accent shadow-sm"><Sparkles className="size-3.5"/>{lang==="ta"?"✦ பிரீமியம் தமிழ் ஜாதக அறிக்கை":"✦ Premium Tamil Horoscope Report"}</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{lang==="ta"?"ஜாதகம் உருவாக்கவும் — முழு அறிக்கை":"Generate Tamil Horoscope — Complete Report"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">{lang==="ta"?"பிறந்த நேரத்திலிருந்து ராசி, நவாம்சம், தசை, யோகம் வரை — தெளிவான கணக்கீடு, அழகான அறிக்கை. 1 · 6 · 30 பக்கங்களில் உடனடியாக உருவாக்குங்கள்.":"From birth moment to rasi, navamsa, dasha and yogas — clear calculations, elegant reports. Generate instantly in 1, 6, or 30 pages."}</p>
      </div>
      <RotatingQuote lang={lang} className="w-full lg:max-w-md shrink-0 no-print" />
    </section>

    <div className="mb-5 no-print">
      <AstroModelSwitcher
        locale={lang}
        onChangeLocale={(loc) => setLang(loc)}
        chartStyle={chartStyle}
        onChangeChartStyle={setChartStyle}
        ayanamsa={ayanamsaMode}
        onChangeAyanamsa={handleAyanamsaChange}
      />
    </div>

    <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="astro-panel min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-24 xl:self-start">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-accent text-white"><UserRound className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{t(lang,"birth")}</h2><p className="text-xs text-slate-500">{lang==="ta"?"சரியான பிறப்பு நேரம் முக்கியம்":"Accurate birth time matters"}</p></div></div><span className="text-accent" title="Local browser calculation"><Info className="size-4"/></span></div>
        <BirthForm lang={lang} value={draft} onChange={onChange} onSubmit={generate}/>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-[11px] leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 size-4 shrink-0"/><span>{lang==="ta"?"100% தனியுரிமை — பிறப்பு விவரங்கள் உங்கள் உலாவியிலேயே கணக்கிடப்படுகின்றன.":"Privacy-first — birth details are calculated locally in your browser."}</span></div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="astro-panel no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent"><FileText className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"ஜாதக அறிக்கை வகையை தேர்வு செய்யுங்கள்":"Choose your horoscope report"}</h2><p className="text-xs text-slate-500">{lang==="ta"?"தேவைக்கேற்ப 1, 6 அல்லது 30 பக்க அறிக்கையை தேர்வு செய்யலாம்.":"Select the report length you need."}</p></div></div>
          <div className="grid gap-3 lg:grid-cols-3">
            <ReportCard mode="one" selected={mode==="one"} onSelect={setMode} lang={lang} icon={<FileText className="size-8"/>} titleTa="1 பக்க ஜாதகம்" titleEn="1-Page Jathagam" descTa="ஒரே பக்கத்தில் முக்கிய பிறப்பு விவரங்கள், பஞ்சாங்கம், கிரக நிலைகள், ராசி & நவாம்சம்." descEn="Key birth details, Panchangam, planetary positions, Rasi & Navamsa on one A4 page."/>
            <ReportCard mode="six" selected={mode==="six"} onSelect={setMode} lang={lang} icon={<BookOpen className="size-8"/>} titleTa="6 பக்க ஜாதகம்" titleEn="6-Page Jathagam" descTa="முக்கிய ஜாதகக் கணிப்புகள், பாவ பலன், யோகங்கள், தோஷங்கள், தசா மற்றும் பரிகாரங்கள்." descEn="Core chart, Bhava readings, Yogas, Doshas, Dasa and remedies."/>
            <ReportCard mode="thirty" selected={mode==="thirty"} onSelect={setMode} lang={lang} icon={<BookOpen className="size-8"/>} titleTa="30 பக்க ஜாதகம்" titleEn="30-Page Jathagam" descTa="விரிவான ஜாதகப் புத்தகம் — பாவம், யோகம், தசா, கோச்சாரம், வர்க்கங்கள், அஷ்டகவர்க்கம் மற்றும் பரிகாரங்கள்." descEn="Comprehensive horoscope book with Bhava, Yoga, Dasa, Gochara, Vargas, Ashtakavarga and remedies."/>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-xs text-accent"><Check className="size-4 shrink-0"/><span>{mode==="one"?(lang==="ta"?"சுருக்கமான 1 பக்க ஜாதகம் — விரைவாக அச்சிடவும் பகிரவும் ஏற்றது.":"A compact 1-page horoscope for quick printing and sharing."):mode==="six"?(lang==="ta"?"6 பக்க விரிவான ஜாதக அறிக்கை — ஒவ்வொரு முக்கிய பகுதியும் தனிப் பக்கமாக.":"A 6-page report with dedicated pages for major sections."):lang==="ta"?"30 பக்க விரிவான ஜாதகப் புத்தகம் — முழுமையான ஆய்விற்காக.":"A 30-page comprehensive horoscope book for detailed study."}</span></div>
        </div>

        <div className="astro-panel no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"ஜாதகம் உருவாக்கவும்":"Generate Jathagam"}</h2><p className="text-xs text-slate-500">{lang==="ta"?"மேலே தேர்வு செய்த பக்க வடிவில் ஜாதகம் உருவாக்கப்படும்.":"The selected report format will be generated from your birth details."}</p></div>
            <button type="button" onClick={generate} className="astro-action astro-action-primary justify-center"><BarChart3 className="size-4"/>{lang==="ta"?"ஜாதகம் உருவாக்கு":"Generate Jathagam"}<span aria-hidden>→</span></button>
          </div>
          {result?<div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-[10px] font-bold uppercase tracking-wide text-accent">{lang==="ta"?"தேர்ந்தெடுத்த அறிக்கை":"Selected report"}</div><div className="mt-0.5 text-sm font-extrabold text-slate-900">{reportTitle(mode,lang)}</div></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={printSelected} className="astro-action justify-center"><Printer className="size-4"/>{lang==="ta"?"அச்சிடு":"Print"}</button>
                <button type="button" onClick={()=>void downloadPdf()} disabled={pdfBusy} className="astro-action justify-center"><FileDown className="size-4"/>{pdfBusy ? (lang==="ta"?"தயாராகிறது...":"Generating...") : (lang==="ta"?"PDF ஏற்றுமதி":"Export PDF")}</button>
              </div>
            </div>
            {pdfError ? <p className="mt-2 text-xs font-semibold text-rose-600">{pdfError}</p> : null}
          </div>:null}
        </div>

        {result ? (
          <div className="no-print">
            <CalculationCard result={result} lang={lang} />
          </div>
        ) : null}

        {result?<div id="astro-calculated-card" className="astro-panel no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"கணிக்கப்பட்ட ஜாதகம்":"Calculated Horoscope"}</h2><p className="text-xs text-slate-500">{result.input.name||"CodePackr Astro"} · {birthDate} · {birthTime}</p></div></div>
          {mode==="one"?<div className="w-full flex justify-center items-start overflow-x-auto py-2"><TraditionalPreview result={result} lang={lang} chartStyle={chartStyle} ayanamsaMode={ayanamsaMode}/></div>:mode==="six"?<div className="rounded-xl border border-accent/20 bg-[#fffdfa] p-2"><PrintHoroscopeSheet result={result} analysis={analyse(result)} lang={lang}/></div>:<div className="rounded-xl border border-accent/20 bg-[#fffdfa] p-2"><FullReport result={result} analysis={analyse(result)} lang={lang}/></div>}
        </div>:null}

        {result?<div id="jathagam-export-root" className="astro-export-host" aria-hidden="true">
          {mode==="one"?<TraditionalPreview result={result} lang={lang} chartStyle={chartStyle} ayanamsaMode={ayanamsaMode}/>:mode==="six"?<PrintHoroscopeSheet result={result} analysis={analyse(result)} lang={lang}/>:<FullReport result={result} analysis={analyse(result)} lang={lang}/>}
        </div>:null}

        {showPrintModal && result ? (
          <PrintDialog
            open={showPrintModal}
            onClose={() => setShowPrintModal(false)}
            title={reportTitle(mode, lang)}
            lang={lang}
            newTabUrl={`/jathagam?print=auto&mode=${mode}&name=${encodeURIComponent(result.input.name || "")}&d=${result.input.day}&m=${result.input.month}&y=${result.input.year}&h=${result.input.hour}&min=${result.input.minute}&lat=${result.input.lat}&lon=${result.input.lon}&tz=${result.input.tz}&place=${encodeURIComponent(result.input.place)}`}
          >
            {mode === "one" ? (
              <div className="w-full flex justify-center items-start overflow-x-auto py-2">
                <TraditionalPreview result={result} lang={lang} chartStyle={chartStyle} ayanamsaMode={ayanamsaMode} />
              </div>
            ) : mode === "six" ? (
              <PrintHoroscopeSheet result={result} analysis={analyse(result)} lang={lang} />
            ) : (
              <FullReport result={result} analysis={analyse(result)} lang={lang} />
            )}
          </PrintDialog>
        ) : null}
      </section>
    </div>
  </main>;
}

// using shared signName
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

function reportTitle(mode:ReportMode,lang:Lang) {
  if(mode==="one") return lang==="ta"?"1 பக்க ஜாதகம்":"1-Page Jathagam";
  if(mode==="six") return lang==="ta"?"6 பக்க ஜாதகம்":"6-Page Jathagam";
  return lang==="ta"?"30 பக்க ஜாதகம்":"30-Page Jathagam";
}

async function exportSelectedPdf(mode:ReportMode,name?:string) {
  const root=document.getElementById("jathagam-export-root");
  if(!root) throw new Error("Jathagam export content is not ready.");
  const safeName=(name||"jathagam").trim().replace(/[^a-zA-Z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||"jathagam";
  await exportElementToPdf(root, {
    filename: `${safeName}-${mode}-jathagam(astro.codepackr.com).pdf`,
    title: `${safeName} - ${reportTitle(mode, "ta")}`,
  });
}

function ReportCard({mode,selected,onSelect,lang,icon,titleTa,titleEn,descTa,descEn}:{mode:ReportMode;selected:boolean;onSelect:(m:ReportMode)=>void;lang:Lang;icon:ReactNode;titleTa:string;titleEn:string;descTa:string;descEn:string}) {
  return <button type="button" onClick={()=>onSelect(mode)} className={cn("astro-report-card group relative text-left",selected&&"is-selected")}>{selected?<span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-accent text-white"><Check className="size-4"/></span>:null}<span className={cn("mb-3 flex size-12 items-center justify-center rounded-2xl",selected?"bg-accent text-white":"bg-accent/10 text-accent group-hover:bg-accent/20")}>{icon}</span><span className="block pr-7 font-display text-base font-extrabold text-slate-900">{lang==="ta"?titleTa:titleEn}</span><span className="mt-2 block whitespace-pre-line text-xs leading-5 text-slate-500">{lang==="ta"?descTa:descEn}</span></button>;
}

function TraditionalPreview({result,lang,chartStyle = 'SOUTH',ayanamsaMode}:{result:ChartResult;lang:Lang;chartStyle?: 'SOUTH' | 'NORTH';ayanamsaMode?: AyanamsaMode}) {
  const { ganeshSrc } = useGanesh();
  const birthDate = `${String(result.input.day).padStart(2,"0")}-${String(result.input.month).padStart(2,"0")}-${result.input.year}`;
  const birthTime = `${String(result.input.hour).padStart(2,"0")}:${String(result.input.minute).padStart(2,"0")}`;
  const moon = result.list.find((p) => p.id === "moon");
  const lagna = result.list.find((p) => p.id === "lagna");
  const sign = (i: number) => sharedSignName(lang, i);
  const nak = moon ? (lang === "ta" ? NAK_TA[moon.nak] : NAK_EN[moon.nak]) : "—";
  const rows = result.list;
  const firstDasa = result.dasa?.periods?.[0];
  const pakshaName = result.pan.paksha === "shukla" ? (lang === "ta" ? "வளர்பிறை" : "Shukla") : (lang === "ta" ? "தேய்பிறை" : "Krishna");
  const tithiName = (lang === "ta" ? TITHI_TA : TITHI_EN)[result.pan.tithiIdx] || "—";
  const yogaName = (lang === "ta" ? YOGA_TA : YOGA_EN)[result.pan.yogaNum] || "—";
  const karanaName = (lang === "ta" ? KARANA_TA : KARANA_EN)[result.pan.karanaIdx] || "—";
  const weekDayName = (lang === "ta" ? WEEK_TA : WEEK_EN)[result.weekday] || "—";
  const sunriseTime = formatClock(result.sunriseJD, result.input.tz);
  const sunsetTime = formatClock(result.sunsetJD, result.input.tz);

  const personalCol1: [string, string][] = [
    [lang === "ta" ? "ஜாதகர் பெயர்" : "Native Name", result.input.name?.trim() || "—"],
    [lang === "ta" ? "பிறந்த தேதி" : "Birth Date", birthDate],
    [lang === "ta" ? "பிறந்த நேரம்" : "Birth Time", birthTime],
    [lang === "ta" ? "பிறந்த இடம்" : "Birth Place", result.input.place || "—"],
    [lang === "ta" ? "லக்னம்" : "Lagna (Ascendant)", lagna ? `${sign(lagna.sign)} (${lagna.dms})` : "—"],
    [lang === "ta" ? "அயனாம்சம்" : "Ayanamsa", `${result.aya.toFixed(4)}° (${ayanamsaMode || result.input.school})`],
  ];

  const personalCol2: [string, string][] = [
    [lang === "ta" ? "சந்திர ராசி" : "Moon Sign (Rasi)", moon ? sign(moon.sign) : "—"],
    [lang === "ta" ? "நட்சத்திரம்" : "Nakshatra & Pada", moon ? `${nak} - பாதம் ${moon.pada}` : "—"],
    [lang === "ta" ? "திதி" : "Tithi", `${pakshaName} · ${tithiName}`],
    [lang === "ta" ? "யோகம் & கரணம்" : "Yoga & Karana", `${yogaName} · ${karanaName}`],
    [lang === "ta" ? "கிழமை" : "Weekday", weekDayName],
    [lang === "ta" ? "சூரிய உதயம் / அஸ்தமனம்" : "Sunrise / Sunset", `${sunriseTime} · ${sunsetTime}`],
  ];

  return (
    <div
      id="traditional-jathagam-sheet"
      className="biodata-sheet jathagam-sheet print-page astro-traditional-preview relative mx-auto w-full max-w-[210mm] min-h-[297mm] h-[297mm] bg-[#fffdfa] text-ink p-5 sm:p-6 shadow-card border border-[#dcd3c4] overflow-hidden flex flex-col justify-between print:shadow-none print:border-none print:p-[7mm_9mm] print:m-0 print:h-[297mm] print:min-h-[297mm]"
      style={{ boxSizing: "border-box" }}
    >
      {/* Decorative double border - identical to biodata */}
      <div className="pointer-events-none absolute inset-1.5 rounded border border-accent/40" />
      <div className="pointer-events-none absolute inset-2.5 rounded border border-accent/15" />
      
      <Watermark />

      <div className="relative z-1 flex flex-col justify-between h-full flex-1 space-y-2.5 sm:space-y-3">
        {/* Top Auspicious Header */}
        <header className="flex flex-col items-center text-center pb-2 border-b border-accent/30">
          <img
            src={ganeshSrc}
            alt="Lord Ganesha"
            className="h-8 sm:h-9 w-auto object-contain"
          />
          <p className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.2em] text-accent mt-0.5 uppercase">
            {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
          </p>
          <div className="mt-0.5 flex items-center justify-center gap-2">
            <h1 className="font-display text-base sm:text-lg font-bold text-accent">
              {lang === "ta" ? "முழுமையான ஜாதகக் கணிப்பு விவரம் (1 பக்கம்)" : "Complete Vedic Horoscope Summary (1 Page)"}
            </h1>
            <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/30">
              {chartStyle === "NORTH" ? (lang === "ta" ? "வடஇந்திய முறை" : "North Indian Style") : (lang === "ta" ? "தென்னிந்திய முறை" : "South Indian Style")}
            </span>
          </div>
          {result.input.name && (
            <p className="font-display text-base font-bold text-ink sm:text-lg mt-0.5 tracking-wide">
              {result.input.name}
            </p>
          )}
        </header>

        {/* Section 1: Astrological & Birth Details */}
        <section>
          <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1.5">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              {lang === "ta" ? "பிறப்பு விவரங்கள் & பஞ்சாங்கக் குறிப்புகள்" : "Birth Details & Panchangam"}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-5 text-[11px] leading-tight">
            <div className="space-y-1">
              {personalCol1.map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                  <span className="text-muted shrink-0 pr-1">{k}:</span>
                  <span className="font-medium text-right text-ink truncate">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {personalCol2.map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                  <span className="text-muted shrink-0 pr-1">{k}:</span>
                  <span className="font-medium text-right text-ink truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Horoscope Charts (Rasi & Navamsa) side-by-side matching Biodata */}
        <section>
          <div className="flex items-center justify-between border-b border-accent/30 pb-0.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                {lang === "ta" ? "ஜாதகக் கட்டங்கள்" : "Horoscope Charts"}
              </h2>
            </div>
            <span className="text-[10px] text-muted italic">
              {chartStyle === "NORTH"
                ? (lang === "ta" ? "வடஇந்திய வைரம் முறை (North Diamond)" : "North Diamond Style")
                : (lang === "ta" ? "ராசி மற்றும் நவாம்ச சக்கரங்கள்" : "Rasi & Navamsa Charts")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto w-full justify-items-center">
            <div className="flex flex-col items-center w-full max-w-[230px]">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {t(lang, "d1")} ({lang === "ta" ? "இராசி" : "Rasi"})
              </p>
              <div className="w-full aspect-square">
                {chartStyle === "NORTH" ? (
                  <NorthChart
                    title=""
                    lagnaRasiIndex={lagna ? lagna.sign : 0}
                    planets={result.list.map((p) => ({
                      id: p.id,
                      label: planetName(p.id, lang),
                      rasiIndex: p.sign,
                      isRetrograde: p.retrograde,
                      degreeText: p.dms,
                    }))}
                  />
                ) : (
                  <SouthChart
                    positions={result.list}
                    lang={lang}
                    mode="sign"
                    caption={t(lang, "d1")}
                    theme="light"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center w-full max-w-[230px]">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {t(lang, "d9")} ({lang === "ta" ? "நவாம்சம்" : "Navamsa"})
              </p>
              <div className="w-full aspect-square">
                {chartStyle === "NORTH" ? (
                  <NorthChart
                    title=""
                    lagnaRasiIndex={lagna ? ((lagna.sign * 9 + lagna.pada - 1) % 12) : 0}
                    planets={result.list.map((p) => ({
                      id: p.id,
                      label: planetName(p.id, lang),
                      rasiIndex: p.navamsa,
                      isRetrograde: p.retrograde,
                      degreeText: p.dms,
                    }))}
                  />
                ) : (
                  <SouthChart
                    positions={result.list}
                    lang={lang}
                    mode="navamsa"
                    caption={t(lang, "d9")}
                    theme="light"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Planetary Positions Table */}
        <section>
          <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              {lang === "ta" ? "கிரக நிலைகள் (ஸ்புடம்)" : "Planetary Positions (Sphutam)"}
            </h2>
          </div>
          <div className="overflow-hidden rounded border border-border/80 bg-white">
            <table className="w-full text-left text-[10px] leading-tight">
              <thead className="bg-elevated/60 text-muted text-[9px] uppercase font-semibold border-b border-border/70">
                <tr>
                  <th className="px-2.5 py-1 text-left">{lang === "ta" ? "கிரகம்" : "Planet"}</th>
                  <th className="px-2.5 py-1 text-left">{lang === "ta" ? "ராசி" : "Sign"}</th>
                  <th className="px-2.5 py-1 text-left font-mono">{lang === "ta" ? "பாகை (Degree)" : "Degree"}</th>
                  <th className="px-2.5 py-1 text-center">{lang === "ta" ? "பாவம்" : "House"}</th>
                  <th className="px-2.5 py-1 text-left">{ayanamsaMode === "KP_NEW" ? "Star / Sub-Lord" : (lang === "ta" ? "நட்சத்திரம்" : "Nakshatra")}</th>
                  <th className="px-2.5 py-1 text-left">{lang === "ta" ? "நிலை" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((p) => {
                  const kp = ayanamsaMode === "KP_NEW" ? getKpSubLordDetails(p.lon) : null;
                  return (
                    <tr key={p.id} className="hover:bg-elevated/20">
                      <td className="px-2.5 py-0.5 font-bold text-ink">
                        {planetName(p.id, lang)}
                        {p.retrograde ? <span className="text-amber-700 ml-1 font-semibold text-[9px]">({lang === "ta" ? "வ" : "R"})</span> : null}
                      </td>
                      <td className="px-2.5 py-0.5 font-medium">{sign(p.sign)}</td>
                      <td className="px-2.5 py-0.5 font-mono text-[9.5px]">{p.dms}</td>
                      <td className="px-2.5 py-0.5 text-center font-semibold text-accent">{p.house}</td>
                      <td className="px-2.5 py-0.5">
                        {kp ? (
                          <span className="font-mono text-[9.5px]">
                            {kp.starLord} &bull; <strong className="text-accent">{kp.subLord}</strong>
                          </span>
                        ) : (
                          `${nakName(lang, p.nak)} (${p.pada})`
                        )}
                      </td>
                      <td className="px-2.5 py-0.5 text-slate-600">
                        {p.retrograde ? (lang === "ta" ? "வக்கிரம்" : "Retrograde") : (lang === "ta" ? "நேர்கதி" : "Direct")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Dasa Information Strip */}
        {firstDasa ? (
          <section className="bg-accent/5 rounded-lg px-3 py-1.5 border border-accent/20 text-[10.5px] flex items-center justify-between">
            <div>
              <span className="text-muted block text-[9px] uppercase font-semibold">
                {lang === "ta" ? "பிறப்பு தசா இருப்பு" : "Birth Dasa Balance"}
              </span>
              <span className="font-bold text-ink">
                {planetName(firstDasa.lord, lang)} {lang === "ta" ? "தசா இருப்பு" : "Dasa Balance"}: {firstDasa.years.toFixed(2)} {lang === "ta" ? "வருடங்கள்" : "Years"} ({Math.floor(firstDasa.years)} {lang === "ta" ? "ஆண்டுகள்" : "y"}, {Math.floor((firstDasa.years % 1) * 12)} {lang === "ta" ? "மாதங்கள்" : "m"})
              </span>
            </div>
            <div className="text-right">
              <span className="text-muted block text-[9px] uppercase font-semibold">
                {lang === "ta" ? "கணிப்பு முறை" : "Engine"}
              </span>
              <span className="font-semibold text-accent">CodePackr Astro Engine</span>
            </div>
          </section>
        ) : null}

        {/* Bottom Footer - Anchored to bottom of A4 */}
        <footer className="mt-auto pt-2 border-t border-accent/25 flex items-center justify-between text-[9.5px] text-muted">
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
            <a href="mailto:codepackr@gmail.com" className="hover:underline text-accent">
              codepackr@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://astro.codepackr.com/?page=disclaimer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline font-medium"
            >
              {lang === "ta" ? "பொறுப்புத் துறப்பு" : "Disclaimer"}
            </a>
            <span>&bull;</span>
            <span className="font-medium text-ink">
              {lang === "ta" ? "1 பக்க ஜாதக அறிக்கை" : "1-Page Horoscope Report"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
