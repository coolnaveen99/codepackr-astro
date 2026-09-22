import { useState, type ReactNode } from "react";
import { ArrowRight, BarChart3, BookOpen, CalendarDays, Check, FileText, Info, Moon, Palette, Printer, ShieldCheck, Sparkles, UserRound, UsersRound } from "lucide-react";
import type { BirthInput, ChartResult } from "@/lib/astro/engine";
import { formatClock } from "@/lib/astro/engine";
import { SIGNS_EN, SIGNS_TA, NAK_EN, NAK_TA, TITHI_EN, TITHI_TA, YOGA_EN, YOGA_TA, KARANA_EN, KARANA_TA, WEEK_EN, WEEK_TA, planetName } from "@/lib/astro/constants";
import type { Lang } from "@/lib/astro/i18n";
import { t } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { BirthForm } from "@/components/birth-form";
import { SouthChart } from "@/components/south-chart";
import { cn } from "@/lib/utils";

type ReportMode = "traditional" | "biodata" | "full";

export function JathagamDashboard({lang,draft,onChange,onSubmit,result}:{lang:Lang;draft:BirthInput;onChange:(v:BirthInput)=>void;onSubmit:()=>void;result:ChartResult|null}) {
  const [mode,setMode]=useState<ReportMode>("traditional");
  const {go}=useNav();
  const generate=()=>mode==="biodata"?go("biodata"):onSubmit();

  return <main className="astro-dashboard mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
    <section className="astro-hero mb-5 flex flex-col justify-between gap-5 rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700"><Sparkles className="size-3.5"/>{lang==="ta"?"இப்போது 3 விதமான ஜாதக அறிக்கைகள்":"3 horoscope report formats"}</div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{lang==="ta"?"ஜாதக அறிக்கை":"Horoscope Report"}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{lang==="ta"?"உங்கள் பிறப்பு விவரங்களை உள்ளிட்டு, பாரம்பரிய ஜாதகம் முதல் விரிவான ஜாதக புத்தகம் வரை உருவாக்குங்கள்.":"Enter birth details and generate a traditional chart, biodata-ready horoscope, or comprehensive report."}</p>
      </div>
      <div className="hidden max-w-sm rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4 text-right lg:block"><div className="text-2xl font-serif text-blue-600">“</div><p className="text-sm font-semibold leading-6 text-slate-600">{lang==="ta"?"கிரகங்கள் காட்டும் பாதை, நம்பிக்கையான வாழ்க்கை வழிகாட்டி":"A clear view of the chart, with practical guidance."}</p><span className="mt-1 block text-xs font-bold text-blue-600">— CodePackr Astro</span></div>
    </section>

    <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="astro-panel min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-24 xl:self-start">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"><UserRound className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{t(lang,"birth")}</h2><p className="text-xs text-slate-500">{lang==="ta"?"சரியான பிறப்பு நேரம் முக்கியம்":"Accurate birth time matters"}</p></div></div><span className="text-blue-600" title="Local browser calculation"><Info className="size-4"/></span></div>
        <BirthForm lang={lang} value={draft} onChange={onChange} onSubmit={generate}/>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-[11px] leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 size-4 shrink-0"/><span>{lang==="ta"?"100% தனியுரிமை — பிறப்பு விவரங்கள் உங்கள் உலாவியிலேயே கணக்கிடப்படுகின்றன.":"Privacy-first — birth details are calculated locally in your browser."}</span></div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="astro-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileText className="size-5"/></span><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"அறிக்கை வகையை தேர்வு செய்யுங்கள்":"Choose a report format"}</h2><p className="text-xs text-slate-500">{lang==="ta"?"ஒரே பிறப்பு தரவிலிருந்து தேவையான வடிவத்தை தேர்வு செய்யலாம்.":"Choose the output format that matches your purpose."}</p></div></div>
          <div className="grid gap-3 lg:grid-cols-3">
            <ReportCard mode="traditional" selected={mode==="traditional"} onSelect={setMode} lang={lang} icon={<FileText className="size-8"/>} titleTa="பாரம்பரிய ஜாதகம்" titleEn="Traditional Jathagam" descTa="1–2 பக்கங்கள்\nபஞ்சாங்கம், கிரக நிலைகள், ராசி & நவாம்சம்" descEn="1–2 pages\nPanchangam, planets, Rasi & Navamsa"/>
            <ReportCard mode="biodata" selected={mode==="biodata"} onSelect={setMode} lang={lang} icon={<UsersRound className="size-8"/>} titleTa="ஜாதகம் + பயோடேட்டா" titleEn="Jathagam + Biodata" descTa="ஜாதகம் + தனிப்பட்ட விவரங்கள்\nதிருமண / குடும்ப பயன்பாட்டிற்கு" descEn="Horoscope + personal details\nFor marriage & family sharing"/>
            <ReportCard mode="full" selected={mode==="full"} onSelect={setMode} lang={lang} icon={<BookOpen className="size-8"/>} titleTa="முழு ஜாதகம்" titleEn="Full Jathagam" descTa="25–30+ பக்கங்கள்\nவிரிவான ஆய்விற்கான ஜாதக புத்தகம்" descEn="25–30+ pages\nComprehensive horoscope book"/>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs text-blue-800"><Check className="size-4 shrink-0"/><span>{mode==="traditional"?(lang==="ta"?"பயோடேட்டா இல்லாமல் சுத்தமான பாரம்பரிய ஜாதகத் தாள்.":"A clean traditional horoscope sheet without biodata."):mode==="biodata"?(lang==="ta"?"பயோடேட்டா வடிவத்திற்கு தனிப்பட்ட விவரங்களை அடுத்த கட்டத்தில் நிரப்பலாம்.":"Continue to the dedicated biodata builder for personal details."):lang==="ta"?"விரிவான கணக்கீடுகள் மற்றும் விளக்கங்களுக்கான ஜாதக புத்தகம்.":"A comprehensive horoscope book for detailed calculations and interpretation."}</span></div>
        </div>

        <PreviewPanel lang={lang} mode={mode} result={result} onGenerate={generate}/>
        {result&&mode!=="biodata"?<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-extrabold text-slate-900">{lang==="ta"?"கணிக்கப்பட்ட ஜாதகம்":"Calculated Horoscope"}</h2><p className="text-xs text-slate-500">{result.input.name||"CodePackr Astro"} · {result.input.date} · {result.input.time}</p></div><button type="button" onClick={()=>window.print()} className="astro-action astro-action-primary" onClick={()=>document.getElementById("astro-analysis")?.scrollIntoView({behavior:"smooth"})}><BarChart3 className="size-4"/>{lang==="ta"?"விரிவான ஆய்வு":"Open detailed analysis"}</button></div>
          <TraditionalPreview result={result} lang={lang}/>
        </div>:null}
      </section>
    </div>
  </main>;
}

function ReportCard({mode,selected,onSelect,lang,icon,titleTa,titleEn,descTa,descEn}:{mode:ReportMode;selected:boolean;onSelect:(m:ReportMode)=>void;lang:Lang;icon:ReactNode;titleTa:string;titleEn:string;descTa:string;descEn:string}) {
  return <button type="button" onClick={()=>onSelect(mode)} className={cn("astro-report-card group relative text-left",selected&&"is-selected")}>{selected?<span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white"><Check className="size-4"/></span>:null}<span className={cn("mb-3 flex size-12 items-center justify-center rounded-2xl",selected?"bg-blue-600 text-white":"bg-blue-50 text-blue-600 group-hover:bg-blue-100")}>{icon}</span><span className="block pr-7 font-display text-base font-extrabold text-slate-900">{lang==="ta"?titleTa:titleEn}</span><span className="mt-2 block whitespace-pre-line text-xs leading-5 text-slate-500">{lang==="ta"?descTa:descEn}</span></button>;
}

function PreviewPanel({lang,mode,result,onGenerate}:{lang:Lang;mode:ReportMode;result:ChartResult|null;onGenerate:()=>void}) {
  return <div className="astro-panel overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5"><div className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Moon className="size-4"/></span><h2 className="font-display text-base font-extrabold text-slate-900">{lang==="ta"?"முன்னோட்டம் (Sample)":"Preview (Sample)"}</h2></div><span className="hidden text-[11px] font-semibold text-slate-400 sm:block">{lang==="ta"?"கணக்கீட்டுக்குப் பிறகு முன்னோட்டம் புதுப்பிக்கப்படும்":"Preview updates after calculation"}</span></div>
    <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5"><PreviewTile tone="blue" title={lang==="ta"?"பாரம்பரிய ஜாதகம்":"Traditional Jathagam"} pages="1–2" active={mode==="traditional"}/><PreviewTile tone="green" title={lang==="ta"?"ஜாதகம் + பயோடேட்டா":"Jathagam + Biodata"} pages="2–4" active={mode==="biodata"}/><PreviewTile tone="violet" title={lang==="ta"?"முழு ஜாதகம்":"Full Jathagam"} pages="25–30+" active={mode==="full"}/></div>
    <div className="grid gap-3 border-t border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-4 sm:p-5"><Setting icon={<Palette/>} label={lang==="ta"?"வண்ணமைப்பு":"Theme"} value="CodePackr"/><Setting icon={<FileText/>} label={lang==="ta"?"பக்க அளவு":"Page size"} value="A4"/><Setting icon={<CalendarDays/>} label={lang==="ta"?"மொழி":"Language"} value={lang==="ta"?"தமிழ்":"English"}/><Setting icon={<BarChart3/>} label={lang==="ta"?"வெளியீடு":"Output"} value="PDF / Print"/></div>
    <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4 sm:p-5"><button type="button" onClick={onGenerate} className="astro-action astro-action-primary flex-1 justify-center"><BarChart3 className="size-4"/>{lang==="ta"?"ஜாதகம் உருவாக்கு":"Generate Horoscope"}<ArrowRight className="size-4"/></button>{result?<button type="button" onClick={()=>document.getElementById("astro-analysis")?.scrollIntoView({behavior:"smooth"})} className="astro-action justify-center"><BarChart3 className="size-4"/>{lang==="ta"?"விரிவான ஆய்வு":"Detailed analysis"}</button>:null}</div>
  </div>;
}

function PreviewTile({tone,title,pages,active}:{tone:"blue"|"green"|"violet";title:string;pages:string;active:boolean}) {
  return <div className={cn("astro-preview-tile",`tone-${tone}`,active&&"is-active")}><div className="astro-paper-preview"><div className="h-1.5 w-2/3 rounded-full bg-current opacity-30"/><div className="mt-2 grid grid-cols-2 gap-1"><span className="h-10 rounded border border-current/10"/><span className="h-10 rounded border border-current/10"/></div><div className="mt-1.5 h-1 rounded-full bg-current opacity-15"/><div className="mt-1 h-1 w-4/5 rounded-full bg-current opacity-15"/></div><div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs font-bold text-slate-800">{title}</span><span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-500">{pages}</span></div></div>;
}

function Setting({icon,label,value}:{icon:React.ReactNode;label:string;value:string}) { return <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5"><div className="flex items-center gap-2 text-slate-500"><span className="text-blue-600">{icon}</span><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></div><div className="mt-1 text-xs font-bold text-slate-800">{value}</div></div>; }

function TraditionalPreview({result,lang}:{result:ChartResult;lang:Lang}) {
  const moon=result.list.find(p=>p.id==="moon"); const lagna=result.list.find(p=>p.id==="lagna");
  const sign=(i:number)=>lang==="ta"?SIGNS_TA[i]:SIGNS_EN[i]; const nak=moon?(lang==="ta"?NAK_TA[moon.nak]:NAK_EN[moon.nak]):"—";
  const rows=result.list.filter(p=>p.id!=="lagna").slice(0,9);
  return <div className="astro-traditional-preview rounded-xl border border-slate-200 bg-white p-3 sm:p-5"><div className="grid gap-4 lg:grid-cols-[1fr_340px]">
    <div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[[lang==="ta"?"பெயர்":"Name",result.input.name||"—"],[lang==="ta"?"பிறந்த தேதி / நேரம்":"Birth date / time",`${result.input.date} · ${result.input.time}`],[lang==="ta"?"பிறந்த இடம்":"Birth place",result.input.place],[lang==="ta"?"லக்னம்":"Lagna",lagna?sign(lagna.sign):"—"],[lang==="ta"?"சந்திர ராசி":"Moon sign",moon?sign(moon.sign):"—"],[lang==="ta"?"நட்சத்திரம்":"Nakshatra",moon?`${nak} · ${moon.pada}`:"—"]].map(([k,v])=><InfoCell key={String(k)} label={String(k)} value={String(v)}/>)}</div>
      <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><InfoCell label={lang==="ta"?"திதி":"Tithi"} value={`${result.pan.paksha==="shukla"?(lang==="ta"?"வளர்பிறை":"Shukla"):(lang==="ta"?"தேய்பிறை":"Krishna")} · ${(lang==="ta"?TITHI_TA:TITHI_EN)[result.pan.tithiIdx]}`}/><InfoCell label={lang==="ta"?"யோகம்":"Yoga"} value={(lang==="ta"?YOGA_TA:YOGA_EN)[result.pan.yogaNum]}/><InfoCell label={lang==="ta"?"கரணம்":"Karana"} value={(lang==="ta"?KARANA_TA:KARANA_EN)[result.pan.karanaIdx]}/><InfoCell label={lang==="ta"?"கிழமை":"Weekday"} value={(lang==="ta"?WEEK_TA:WEEK_EN)[result.weekday]}/><InfoCell label={lang==="ta"?"சூரிய உதயம்":"Sunrise"} value={formatClock(result.sunriseJD,result.input.tz)}/><InfoCell label={lang==="ta"?"சூரிய அஸ்தமனம்":"Sunset"} value={formatClock(result.sunsetJD,result.input.tz)}/></div></div>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200"><div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700">{lang==="ta"?"கிரக நிலைகள்":"Planetary Positions"}</div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="bg-white text-[10px] uppercase text-slate-400"><tr><th className="px-3 py-2">{lang==="ta"?"கிரகம்":"Planet"}</th><th>{lang==="ta"?"ராசி":"Sign"}</th><th>{lang==="ta"?"பாகை":"Degree"}</th><th>{lang==="ta"?"நிலை":"Status"}</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(p=><tr key={p.id}><td className="px-3 py-2 font-bold text-slate-800">{planetName(p.id,lang)}</td><td>{sign(p.sign)}</td><td>{p.dms}</td><td className="text-slate-500">{p.retrograde?(lang==="ta"?"வக்கிரம்":"Retrograde"):"—"}</td></tr>)}</tbody></table></div></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3"><div className="mb-2 text-center text-xs font-extrabold text-blue-800">{lang==="ta"?"ராசி கட்டம்":"Rasi Chart"}</div><SouthChart positions={result.list} lang={lang}/></div><div className="rounded-xl border border-violet-100 bg-violet-50/30 p-3"><div className="mb-2 text-center text-xs font-extrabold text-violet-800">{lang==="ta"?"நவாம்சம் (D9)":"Navamsa (D9)"}</div><SouthChart positions={result.list} lang={lang} mode="navamsa"/></div></div>
  </div></div>;
}
function InfoCell({label,value}:{label:string;value:string}) { return <div><div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-0.5 text-xs font-bold leading-5 text-slate-800">{value}</div></div>; }
