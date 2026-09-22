import { useState, type ReactNode } from "react";
import { BarChart3, BookOpen, Check, FileDown, FileText, Info, Printer, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { BirthInput, ChartResult } from "@/lib/astro/engine";
import { formatClock } from "@/lib/astro/engine";
import { SIGNS_EN, SIGNS_TA, NAK_EN, NAK_TA, TITHI_EN, TITHI_TA, YOGA_EN, YOGA_TA, KARANA_EN, KARANA_TA, WEEK_EN, WEEK_TA, planetName } from "@/lib/astro/constants";
import type { Lang } from "@/lib/astro/i18n";
import { t } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { BirthForm } from "@/components/birth-form";
import { SouthChart } from "@/components/south-chart";
import { PrintHoroscopeSheet } from "@/components/print-horoscope-sheet";
import { FullReport } from "@/components/full-report";
import { analyse } from "@/lib/astro/analysis";
import { cn } from "@/lib/utils";

type ReportMode = "one" | "six" | "thirty";

export function JathagamDashboard({lang,draft,onChange,onSubmit,result}:{lang:Lang;draft:BirthInput;onChange:(v:BirthInput)=>void;onSubmit:()=>void;result:ChartResult|null}) {
  const [mode,setMode]=useState<ReportMode>("one");
  const [pdfBusy,setPdfBusy]=useState(false);
  const [pdfError,setPdfError]=useState("");
  const {go}=useNav();
  const generate=()=>onSubmit();
  const printSelected=()=>{ setPdfError(""); window.print(); };
  const downloadPdf=async()=>{ setPdfBusy(true); setPdfError(""); try { await exportSelectedPdf(mode,result?.input.name); } catch (error) { console.error("Jathagam PDF export failed",error); setPdfError(lang==="ta"?"PDF உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.":"PDF export failed. Please try again."); } finally { setPdfBusy(false); } };

  return <main className="astro-dashboard mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
    <section className="astro-hero mb-5 flex flex-col justify-between gap-5 rounded-2xl border border-accent/20 bg-white/90 p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:items-center">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-bold text-accent"><Sparkles className="size-3.5"/>{lang==="ta"?"ஜாதக அறிக்கை வடிவங்கள்":"Horoscope report formats"}</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{lang==="ta"?"ஜாதக அறிக்கை":"Horoscope Report"}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{lang==="ta"?"உங்கள் பிறப்பு விவரங்களை உள்ளிட்டு, தேவையான பக்க அளவிலான ஜாதக அறிக்கையை உருவாக்குங்கள்.":"Enter birth details and generate a 1-page, 6-page, or 30-page horoscope report."}</p>
      </div>
      <div className="hidden max-w-sm rounded-xl border border-accent/20 bg-accent/10 px-5 py-4 text-right lg:block"><div className="text-2xl font-serif text-accent">“</div><p className="text-sm font-semibold leading-6 text-slate-600">{lang==="ta"?"பிறப்பு விவரங்களிலிருந்து ஒழுங்கான ஜாதக அறிக்கை":"A structured horoscope report from your birth details."}</p><span className="mt-1 block text-xs font-bold text-accent">— CodePackr Astro</span></div>
    </section>

    <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="astro-panel min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-24 xl:self-start">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-accent text-white"><UserRound className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{t(lang,"birth")}</h2><p className="text-xs text-slate-500">{lang==="ta"?"சரியான பிறப்பு நேரம் முக்கியம்":"Accurate birth time matters"}</p></div></div><span className="text-accent" title="Local browser calculation"><Info className="size-4"/></span></div>
        <BirthForm lang={lang} value={draft} onChange={onChange} onSubmit={generate}/>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-[11px] leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 size-4 shrink-0"/><span>{lang==="ta"?"100% தனியுரிமை — பிறப்பு விவரங்கள் உங்கள் உலாவியிலேயே கணக்கிடப்படுகின்றன.":"Privacy-first — birth details are calculated locally in your browser."}</span></div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="astro-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent"><FileText className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"ஜாதக அறிக்கை வகையை தேர்வு செய்யுங்கள்":"Choose your horoscope report"}</h2><p className="text-xs text-slate-500">{lang==="ta"?"தேவைக்கேற்ப 1, 6 அல்லது 30 பக்க அறிக்கையை தேர்வு செய்யலாம்.":"Select the report length you need."}</p></div></div>
          <div className="grid gap-3 lg:grid-cols-3">
            <ReportCard mode="one" selected={mode==="one"} onSelect={setMode} lang={lang} icon={<FileText className="size-8"/>} titleTa="1 பக்க ஜாதகம்" titleEn="1-Page Jathagam" descTa="ஒரே பக்கத்தில் முக்கிய பிறப்பு விவரங்கள், பஞ்சாங்கம், கிரக நிலைகள், ராசி & நவாம்சம்." descEn="Key birth details, Panchangam, planetary positions, Rasi & Navamsa on one A4 page."/>
            <ReportCard mode="six" selected={mode==="six"} onSelect={setMode} lang={lang} icon={<BookOpen className="size-8"/>} titleTa="6 பக்க ஜாதகம்" titleEn="6-Page Jathagam" descTa="முக்கிய ஜாதகக் கணிப்புகள், பாவ பலன், யோகங்கள், தோஷங்கள், தசா மற்றும் பரிகாரங்கள்." descEn="Core chart, Bhava readings, Yogas, Doshas, Dasa and remedies."/>
            <ReportCard mode="thirty" selected={mode==="thirty"} onSelect={setMode} lang={lang} icon={<BookOpen className="size-8"/>} titleTa="30 பக்க ஜாதகம்" titleEn="30-Page Jathagam" descTa="விரிவான ஜாதகப் புத்தகம் — பாவம், யோகம், தசா, கோச்சாரம், வர்க்கங்கள், அஷ்டகவர்க்கம் மற்றும் பரிகாரங்கள்." descEn="Comprehensive horoscope book with Bhava, Yoga, Dasa, Gochara, Vargas, Ashtakavarga and remedies."/>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-xs text-accent"><Check className="size-4 shrink-0"/><span>{mode==="one"?(lang==="ta"?"சுருக்கமான 1 பக்க ஜாதகம் — விரைவாக அச்சிடவும் பகிரவும் ஏற்றது.":"A compact 1-page horoscope for quick printing and sharing."):mode==="six"?(lang==="ta"?"6 பக்க விரிவான ஜாதக அறிக்கை — ஒவ்வொரு முக்கிய பகுதியும் தனிப் பக்கமாக.":"A 6-page report with dedicated pages for major sections."):lang==="ta"?"30 பக்க விரிவான ஜாதகப் புத்தகம் — முழுமையான ஆய்விற்காக.":"A 30-page comprehensive horoscope book for detailed study."}</span></div>
        </div>

        <div className="astro-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"ஜாதகம் உருவாக்கவும்":"Generate Jathagam"}</h2><p className="text-xs text-slate-500">{lang==="ta"?"மேலே தேர்வு செய்த பக்க வடிவில் ஜாதகம் உருவாக்கப்படும்.":"The selected report format will be generated from your birth details."}</p></div>
            <button type="button" onClick={generate} className="astro-action astro-action-primary justify-center"><BarChart3 className="size-4"/>{lang==="ta"?"ஜாதகம் உருவாக்கு":"Generate Jathagam"}<span aria-hidden>→</span></button>
          </div>
          {result?<div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-[10px] font-bold uppercase tracking-wide text-accent">{lang==="ta"?"தேர்ந்தெடுத்த அறிக்கை":"Selected report"}</div><div className="mt-0.5 text-sm font-extrabold text-slate-900">{reportTitle(mode,lang)}</div></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={printSelected} className="astro-action justify-center"><Printer className="size-4"/>{lang==="ta"?"அச்சிடு":"Print"}</button>
                <button type="button" onClick={()=>void downloadPdf()} disabled={pdfBusy} className="astro-action justify-center"><FileDown className="size-4"/>{lang==="ta"?"PDF ஏற்றுமதி":"Export PDF"}</button>
              </div>
            </div>
          </div>:null}
        </div>

        {result?<div id="astro-analysis" className="astro-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"கணிக்கப்பட்ட ஜாதகம்":"Calculated Horoscope"}</h2><p className="text-xs text-slate-500">{result.input.name||"CodePackr Astro"} · {result.input.date} · {result.input.time}</p></div></div>
          {mode==="one"?<TraditionalPreview result={result} lang={lang}/>:mode==="six"?<div className="rounded-xl border border-accent/20 bg-[#fffdfa] p-2"><PrintHoroscopeSheet result={result} analysis={analyse(result)} lang={lang}/></div>:<div className="rounded-xl border border-accent/20 bg-[#fffdfa] p-2"><FullReport result={result} analysis={analyse(result)} lang={lang}/></div>}
        </div>:null}

        {result?<div id="jathagam-export-root" className="astro-export-host" aria-hidden="true">
          {mode==="one"?<div className="astro-export-one-page"><TraditionalPreview result={result} lang={lang}/></div>:mode==="six"?<PrintHoroscopeSheet result={result} analysis={analyse(result)} lang={lang}/>:<FullReport result={result} analysis={analyse(result)} lang={lang}/>}
        </div>:null}
      </section>
    </div>
  </main>;
}

function reportTitle(mode:ReportMode,lang:Lang) {
  if(mode==="one") return lang==="ta"?"1 பக்க ஜாதகம்":"1-Page Jathagam";
  if(mode==="six") return lang==="ta"?"6 பக்க ஜாதகம்":"6-Page Jathagam";
  return lang==="ta"?"30 பக்க ஜாதகம்":"30-Page Jathagam";
}

async function exportSelectedPdf(mode:ReportMode,name?:string) {
  const root=document.getElementById("jathagam-export-root");
  if(!root) throw new Error("Jathagam export content is not ready.");
  await document.fonts?.ready;
  const images=Array.from(root.querySelectorAll<HTMLImageElement>("img"));
  await Promise.all(images.map(img=>img.complete?Promise.resolve():new Promise<void>(resolve=>{img.onload=()=>resolve();img.onerror=()=>resolve();})));
  await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  const pages=(mode==="one"
    ? [root.querySelector<HTMLElement>(".astro-export-one-page")]
    : Array.from(root.querySelectorAll<HTMLElement>(".print-page"))).filter((p):p is HTMLElement=>Boolean(p));
  if(!pages.length) throw new Error("No report pages found.");
  const pdf=new jsPDF({unit:"mm",format:"a4",orientation:"portrait",compress:true});
  const margin=5,maxWidth=200,maxHeight=287;
  for(let i=0;i<pages.length;i++){
    const page=pages[i];
    const canvas=await html2canvas(page,{
      scale:2,useCORS:true,allowTaint:true,backgroundColor:"#ffffff",logging:false,windowWidth:page.scrollWidth,
      onclone:(doc)=>{
        const r=doc.getElementById("jathagam-export-root");
        if(r){r.style.position="static";r.style.left="0";r.style.top="0";r.style.width="210mm";r.style.maxWidth="210mm";r.style.zIndex="auto";r.style.pointerEvents="auto";}
        const p=doc.querySelector<HTMLElement>(mode==="one"?".astro-export-one-page":".print-page");
        if(p){p.style.position="relative";p.style.left="0";p.style.top="0";}
      }
    });
    if(i>0) pdf.addPage();
    const aspect=canvas.height/canvas.width;
    let width=maxWidth,height=width*aspect;
    if(height>maxHeight){height=maxHeight;width=height/aspect;}
    pdf.addImage(canvas.toDataURL("image/jpeg",0.94),"JPEG",(210-width)/2,margin,width,height,undefined,"FAST");
  }
  const safeName=(name||"jathagam").trim().replace(/[^a-zA-Z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||"jathagam";
  pdf.save(`${safeName}-${mode}-jathagam.pdf`);
}

function ReportCard({mode,selected,onSelect,lang,icon,titleTa,titleEn,descTa,descEn}:{mode:ReportMode;selected:boolean;onSelect:(m:ReportMode)=>void;lang:Lang;icon:ReactNode;titleTa:string;titleEn:string;descTa:string;descEn:string}) {
  return <button type="button" onClick={()=>onSelect(mode)} className={cn("astro-report-card group relative text-left",selected&&"is-selected")}>{selected?<span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-accent text-white"><Check className="size-4"/></span>:null}<span className={cn("mb-3 flex size-12 items-center justify-center rounded-2xl",selected?"bg-accent text-white":"bg-accent/10 text-accent group-hover:bg-accent/20")}>{icon}</span><span className="block pr-7 font-display text-base font-extrabold text-slate-900">{lang==="ta"?titleTa:titleEn}</span><span className="mt-2 block whitespace-pre-line text-xs leading-5 text-slate-500">{lang==="ta"?descTa:descEn}</span></button>;
}

function TraditionalPreview({result,lang}:{result:ChartResult;lang:Lang}) {
  const moon=result.list.find(p=>p.id==="moon"); const lagna=result.list.find(p=>p.id==="lagna");
  const sign=(i:number)=>lang==="ta"?SIGNS_TA[i]:SIGNS_EN[i]; const nak=moon?(lang==="ta"?NAK_TA[moon.nak]:NAK_EN[moon.nak]):"—";
  const rows=result.list.filter(p=>p.id!=="lagna").slice(0,9);
  return <div className="astro-traditional-preview rounded-xl border border-slate-200 bg-white p-3 sm:p-5"><div className="mb-4 border-b border-accent/20 pb-3 text-center"><div className="text-[10px] font-bold uppercase tracking-widest text-accent">{lang==="ta"?"ஜாதகர்":"Jathakar"}</div><div className="mt-1 break-words text-2xl font-extrabold leading-tight text-accent">{result.input.name?.trim()||"—"}</div><div className="mt-1 break-words text-xs text-slate-500">{result.input.date} · {result.input.time} · {result.input.place}</div></div><div className="grid gap-4 lg:grid-cols-[1fr_340px]">
    <div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[[lang==="ta"?"பெயர்":"Name",result.input.name||"—"],[lang==="ta"?"பிறந்த தேதி / நேரம்":"Birth date / time",`${result.input.date} · ${result.input.time}`],[lang==="ta"?"பிறந்த இடம்":"Birth place",result.input.place],[lang==="ta"?"லக்னம்":"Lagna",lagna?sign(lagna.sign):"—"],[lang==="ta"?"சந்திர ராசி":"Moon sign",moon?sign(moon.sign):"—"],[lang==="ta"?"நட்சத்திரம்":"Nakshatra",moon?`${nak} · ${moon.pada}`:"—"]].map(([k,v])=><InfoCell key={String(k)} label={String(k)} value={String(v)}/>)}</div>
      <div className="mt-3 rounded-xl border border-accent/20 bg-accent/10 p-3"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><InfoCell label={lang==="ta"?"திதி":"Tithi"} value={`${result.pan.paksha==="shukla"?(lang==="ta"?"வளர்பிறை":"Shukla"):(lang==="ta"?"தேய்பிறை":"Krishna")} · ${(lang==="ta"?TITHI_TA:TITHI_EN)[result.pan.tithiIdx]}`}/><InfoCell label={lang==="ta"?"யோகம்":"Yoga"} value={(lang==="ta"?YOGA_TA:YOGA_EN)[result.pan.yogaNum]}/><InfoCell label={lang==="ta"?"கரணம்":"Karana"} value={(lang==="ta"?KARANA_TA:KARANA_EN)[result.pan.karanaIdx]}/><InfoCell label={lang==="ta"?"கிழமை":"Weekday"} value={(lang==="ta"?WEEK_TA:WEEK_EN)[result.weekday]}/><InfoCell label={lang==="ta"?"சூரிய உதயம்":"Sunrise"} value={formatClock(result.sunriseJD,result.input.tz)}/><InfoCell label={lang==="ta"?"சூரிய அஸ்தமனம்":"Sunset"} value={formatClock(result.sunsetJD,result.input.tz)}/></div></div>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200"><div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700">{lang==="ta"?"கிரக நிலைகள்":"Planetary Positions"}</div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="bg-white text-[10px] uppercase text-slate-400"><tr><th className="px-3 py-2">{lang==="ta"?"கிரகம்":"Planet"}</th><th>{lang==="ta"?"ராசி":"Sign"}</th><th>{lang==="ta"?"பாகை":"Degree"}</th><th>{lang==="ta"?"நிலை":"Status"}</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(p=><tr key={p.id}><td className="px-3 py-2 font-bold text-slate-800">{planetName(p.id,lang)}</td><td>{sign(p.sign)}</td><td>{p.dms}</td><td className="text-slate-500">{p.retrograde?(lang==="ta"?"வக்கிரம்":"Retrograde"):"—"}</td></tr>)}</tbody></table></div></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><div className="rounded-xl border border-accent/20 bg-accent/10 p-3"><div className="mb-2 text-center text-xs font-extrabold text-accent">{lang==="ta"?"ராசி கட்டம்":"Rasi Chart"}</div><SouthChart positions={result.list} lang={lang}/></div><div className="rounded-xl border border-violet-100 bg-violet-50/30 p-3"><div className="mb-2 text-center text-xs font-extrabold text-violet-800">{lang==="ta"?"நவாம்சம் (D9)":"Navamsa (D9)"}</div><SouthChart positions={result.list} lang={lang} mode="navamsa"/></div></div>
  </div></div>;
}
function InfoCell({label,value}:{label:string;value:string}) { return <div><div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-0.5 text-xs font-bold leading-5 text-slate-800">{value}</div></div>; }
