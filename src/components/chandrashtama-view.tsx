// Codepackr Astro - Chandrashtama (சந்திராஷ்டம) Calculator View
import { useState, useMemo } from "react";
import {
  calculateChandrashtama,
  type ChandrashtamaResult,
} from "@/lib/astro/chandrashtama";
import { SIGNS_TA, SIGNS_EN, SCHOOLS, type School } from "@/lib/astro/constants";
import { type Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Compass,
  Sparkles,
  ShieldAlert,
  Info,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";

export function ChandrashtamaView({ lang }: { lang: Lang }) {
  const [selectedRasi, setSelectedRasi] = useState<number>(0); // Default: Aries (மேஷம்)
  const [school, setSchool] = useState<School>("thirukanitham");

  const today = useMemo(() => {
    const d = new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
    };
  }, []);

  const [dateInput, setDateInput] = useState(
    `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`
  );

  const parsedDate = useMemo(() => {
    const parts = dateInput.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return {
        year: parts[0],
        month: parts[1],
        day: parts[2],
        hour: 12,
        minute: 0,
      };
    }
    return today;
  }, [dateInput, today]);

  const result: ChandrashtamaResult = useMemo(() => {
    return calculateChandrashtama(selectedRasi, parsedDate, 5.5, school);
  }, [selectedRasi, parsedDate, school]);

  const isCurrentActive = result.currentTransit.isChandrashtamaNow;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          <Compass className="size-4" />
          <span>{lang === "ta" ? "கோசார சந்திர கணிப்பு" : "Lunar Transit Astrology"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
          {lang === "ta" ? "சந்திராஷ்டம காலக் கணிப்பான்" : "Chandrashtama Calculator"}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
          {lang === "ta"
            ? "உங்கள் ராசிக்கு சந்திரன் 8-ஆம் இடத்தில் சஞ்சரிக்கும் துல்லியமான தொடக்க மற்றும் முடிவு நேரங்கள், முன்னெச்சரிக்கைகள் & பரிகாரங்கள்."
            : "Precise start and end transit timestamps when the Moon traverses the 8th house from your Janma Rasi, with traditional guidance."}
        </p>
      </div>

      {/* Rasi Selector Grid */}
      <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
          {lang === "ta" ? "1. உங்கள் பிறந்த ராசியைத் தேர்ந்தெடுக்கவும் (ஜன்ம ராசி)" : "1. Select Your Birth Moon Sign (Janma Rasi)"}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {SIGNS_TA.map((nameTa, idx) => {
            const isSelected = selectedRasi === idx;
            const nameEn = SIGNS_EN[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedRasi(idx)}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer",
                  isSelected
                    ? "border-accent bg-accent text-accent-fg shadow-xs scale-[1.02] font-semibold"
                    : "border-border/70 bg-elevated/40 hover:bg-elevated text-fg"
                )}
              >
                <span className="text-xs sm:text-sm font-bold leading-tight">
                  {lang === "ta" ? nameTa : nameEn}
                </span>
                <span className={cn("text-[10px] mt-0.5", isSelected ? "text-accent-fg/80" : "text-muted")}>
                  {lang === "ta" ? nameEn : nameTa}
                </span>
              </button>
            );
          })}
        </div>

        {/* Date & School Controls */}
        <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              {lang === "ta" ? "கணிப்புத் தேதி" : "Calculation Date"}
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              {lang === "ta" ? "ஜோதிட முறை (Ephemeris)" : "Astrological School"}
            </label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value as School)}
              className="w-full rounded-lg border border-border/80 bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
            >
              {SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === "ta" ? s.ta : s.en} — {s.id === "thirukanitham" ? "Drik Ganitha" : s.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div
        className={cn(
          "rounded-2xl border p-5 sm:p-7 shadow-sm transition-all",
          isCurrentActive
            ? "border-amber-400/80 bg-amber-500/10 text-amber-950 dark:text-amber-100"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "size-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                isCurrentActive
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
              )}
            >
              {isCurrentActive ? (
                <AlertTriangle className="size-6" />
              ) : (
                <CheckCircle2 className="size-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface/80 border border-border/50">
                  {lang === "ta" ? result.janmaRasiTa : result.janmaRasiEn} ராசி
                </span>
                <span className="text-xs text-muted">
                  8-ஆம் இடம்: {lang === "ta" ? result.chandrashtamaRasiTa : result.chandrashtamaRasiEn}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                {isCurrentActive
                  ? (lang === "ta"
                      ? "தற்போது சந்திராஷ்டமம் நடப்பில் உள்ளது!"
                      : "Chandrashtamam is Currently Active!")
                  : (lang === "ta"
                      ? "தற்போது சந்திராஷ்டமம் இல்லை — சுப காலம்"
                      : "Chandrashtamam is NOT Active — Clear")}
              </h2>
            </div>
          </div>

          <div className="rounded-xl bg-surface/90 border border-border/60 p-3 text-xs w-full sm:w-auto text-left sm:text-right">
            <p className="text-muted">{lang === "ta" ? "இன்றைய சந்திரன் நிலை" : "Current Moon Transit"}</p>
            <p className="font-bold text-sm text-ink mt-0.5">
              {lang === "ta" ? result.currentTransit.moonRasiTa : result.currentTransit.moonRasiEn} ராசி ·{" "}
              {lang === "ta" ? result.currentTransit.moonNakTa : result.currentTransit.moonNakEn} பாதம் {result.currentTransit.moonNakPada}
            </p>
          </div>
        </div>

        {/* Active Time Window if Active */}
        {result.currentPeriod && (
          <div className="mt-5 rounded-xl bg-surface border border-amber-300/60 p-4">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {lang === "ta" ? "நடப்பு சந்திராஷ்டம கால அளவு:" : "Active Period Window:"}
            </p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-semibold text-ink">
              <div>
                <span className="text-xs text-muted block">{lang === "ta" ? "தொடக்கம்:" : "Starts:"}</span>
                {result.currentPeriod.startTimeStr}
              </div>
              <div>
                <span className="text-xs text-muted block">{lang === "ta" ? "முடிவு:" : "Ends:"}</span>
                {result.currentPeriod.endTimeStr}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              {lang === "ta"
                ? `மொத்த கால அளவு: சுமார் ${result.currentPeriod.durationHours} மணி நேரம் (சந்திரன் ${result.chandrashtamaRasiTa} ராசியைக் கடக்கும் வரை).`
                : `Total duration: ~${result.currentPeriod.durationHours} hours until Moon exits ${result.chandrashtamaRasiEn}.`}
            </p>
          </div>
        )}

        {/* Global Zodiac Indicator */}
        <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted flex items-center justify-between">
          <span>
            {lang === "ta" ? "இன்றைய நிலவரப்படி சந்திராஷ்டமம் உள்ள ராசி:" : "Zodiac sign under Chandrashtama today:"}{" "}
            <strong className="text-ink">
              {lang === "ta"
                ? result.currentTransit.activeChandrashtamaForRasiTa
                : result.currentTransit.activeChandrashtamaForRasiEn}
            </strong>
          </span>
          <span className="hidden sm:inline text-[11px]">
            {lang === "ta" ? "துல்லிய வானியல் முறை" : "High-precision Ephemeris"}
          </span>
        </div>
      </div>

      {/* Upcoming Chandrashtama Dates (Next 60 Days) */}
      <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Calendar className="size-4 text-accent" />
            {lang === "ta"
              ? `${result.janmaRasiTa} ராசிக்கான அடுத்தடுத்த சந்திராஷ்டம தேதிகள் (60 நாட்கள்)`
              : `Upcoming Chandrashtama Dates for ${result.janmaRasiEn} (Next 60 Days)`}
          </h3>
          <span className="text-xs text-muted">
            {result.upcomingPeriods.length} {lang === "ta" ? "சுற்றுகள்" : "Occurrences"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/70 text-muted uppercase text-[11px] font-semibold tracking-wider bg-elevated/40">
                <th className="p-3">{lang === "ta" ? "வரிசை" : "#"}</th>
                <th className="p-3">{lang === "ta" ? "சந்திராஷ்டம தொடக்கம்" : "Starts"}</th>
                <th className="p-3">{lang === "ta" ? "சந்திராஷ்டம முடிவு" : "Ends"}</th>
                <th className="p-3">{lang === "ta" ? "சந்திரன் ராசி" : "Transit Sign"}</th>
                <th className="p-3 text-right">{lang === "ta" ? "கால அளவு" : "Duration"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {result.upcomingPeriods.slice(0, 5).map((p, idx) => (
                <tr key={idx} className="hover:bg-elevated/40 transition-colors">
                  <td className="p-3 font-semibold text-muted">{idx + 1}</td>
                  <td className="p-3 font-medium text-ink flex items-center gap-1.5">
                    <Clock className="size-3.5 text-accent" />
                    <span>{p.startTimeStr}</span>
                  </td>
                  <td className="p-3 font-medium text-ink">{p.endTimeStr}</td>
                  <td className="p-3">
                    <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent border border-accent/20">
                      {lang === "ta" ? p.chandrashtamaRasiTa : p.chandrashtamaRasiEn}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium text-muted">
                    {p.durationHours} {lang === "ta" ? "மணி நேரம்" : "hrs"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidelines and Pariharams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Do's and Don'ts */}
        <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs">
          <h3 className="font-display text-base font-bold text-ink flex items-center gap-2 mb-3">
            <ShieldAlert className="size-4 text-amber-600" />
            {lang === "ta" ? "சந்திராஷ்டம நாளில் என்ன செய்ய வேண்டும் / கூடாது?" : "Traditional Guidelines & Mindfulness"}
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
            {(lang === "ta" ? result.guidelinesTa : result.guidelinesEn).map((g, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pariharams & Deities */}
        <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs">
          <h3 className="font-display text-base font-bold text-ink flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-accent" />
            {lang === "ta" ? "சாந்திக்கான பரிகாரங்கள் & இறை வழிபாடு" : "Pariharams & Divine Worship"}
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
            {(lang === "ta" ? result.remediesTa : result.remediesEn).map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Educational Clarification / Standards Section 0.4 */}
      <div className="rounded-xl border border-border/60 bg-elevated/30 p-4 text-xs text-muted flex items-start gap-3">
        <Info className="size-4 text-accent mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          {lang === "ta"
            ? "ஜோதிட அறிவியல் விளக்கம்: சந்திராஷ்டமம் என்பது மனோகாரகனான சந்திரன் நமது ஜென்ம ராசியிலிருந்து 8-ஆம் வீடான ஆயுள் மற்றும் மறைவு ஸ்தானத்தைக் கடக்கும் நிலையாகும். இது எந்தவிதமான சாபமும் அல்ல; மனதை அமைதியாகவும், உணர்ச்சிகளைக் கட்டுப்படுத்தவும், கவனமுடன் செயல்படவும் பாரம்பரிய ஜோதிடம் வழங்கும் விழிப்புணர்வுக் காலமே ஆகும்."
            : "Astrological explanation: Chandrashtama occurs when the transit Moon crosses the 8th house from your natal Moon sign. It is a traditional period advised for mental mindfulness and calm decision-making, not a total paralysis of normal life activities."}
        </p>
      </div>
    </main>
  );
}
