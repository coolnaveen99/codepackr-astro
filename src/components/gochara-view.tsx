// Codepackr Astro - Gochara (கோசார பலன்) Transit Calculator View
import { useState, useMemo } from "react";
import {
  calculateGochara,
  type GocharaResult,
} from "@/lib/astro/gochara";
import { SIGNS_TA, SIGNS_EN, SCHOOLS, type School } from "@/lib/astro/constants";
import { type Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";
import {
  Orbit,
  Sparkles,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Zap,
} from "lucide-react";

export function GocharaView({ lang }: { lang: Lang }) {
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

  const result: GocharaResult = useMemo(() => {
    return calculateGochara(selectedRasi, parsedDate, 5.5, school);
  }, [selectedRasi, parsedDate, school]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          <Orbit className="size-4" />
          <span>{lang === "ta" ? "நவக்கிரக கோசார ஆய்வு" : "Planetary Transit System"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
          {lang === "ta" ? "கோசார பலன் கணிப்பான்" : "Gochara Transit Calculator"}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
          {lang === "ta"
            ? "இன்றைய வானியல் கிரக சஞ்சாரங்களை உங்கள் பிறந்த ராசியுடன் ஒப்பிட்டு ஏழரைச் சனி, குரு பலம், ராகு-கேது மாற்றங்கள் மற்றும் 9 கிரகங்களின் கோசார நிலைகளைக் கணக்கிடுகிறது."
            : "Live astronomical transits of all 9 planets calculated against your Janma Rasi, covering Sade Sati, Guru Balam, Rahu-Ketu axis, and house placements."}
        </p>
      </div>

      {/* Rasi Selector Grid */}
      <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
          {lang === "ta" ? "1. உங்கள் பிறந்த ராசியைத் தேர்ந்தெடுக்கவும்" : "1. Select Your Natal Moon Sign (Janma Rasi)"}
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
              {lang === "ta" ? "கோசாரத் தேதி" : "Transit Date"}
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
              {lang === "ta" ? "கணித முறை (Ayanamsa)" : "Calculation School"}
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

      {/* Summary Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guru Balam Card */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {lang === "ta" ? "குரு கோசாரம்" : "Jupiter Transit"}
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-bold border",
                result.special.hasGuruBalam
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-border bg-elevated text-muted"
              )}
            >
              {result.special.hasGuruBalam
                ? (lang === "ta" ? "குரு பலம் உண்டு" : "Guru Balam Active")
                : (lang === "ta" ? "குரு பார்வை" : "Regular")}
            </span>
          </div>
          <p className="font-display text-lg font-bold text-ink mt-2">
            {lang === "ta" ? `${result.special.guruHouse}-ஆம் இடம்` : `House ${result.special.guruHouse}`}
          </p>
          <p className="mt-1.5 text-xs text-muted leading-relaxed">
            {lang === "ta" ? result.special.guruVerdictTa : result.special.guruVerdictEn}
          </p>
        </div>

        {/* Saturn Transit Card */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {lang === "ta" ? "சனி கோசாரம்" : "Saturn Transit"}
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-bold border",
                result.special.isSadeSati || result.special.isAshtamaSani
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              )}
            >
              {result.special.isSadeSati
                ? (lang === "ta" ? "ஏழரைச் சனி" : "Sade Sati")
                : result.special.isAshtamaSani
                ? (lang === "ta" ? "அஷ்டமச் சனி" : "Ashtama Sani")
                : (lang === "ta" ? "சாதக நிலை" : "Favorable")}
            </span>
          </div>
          <p className="font-display text-lg font-bold text-ink mt-2">
            {result.special.sadeSatiPhaseTa
              ? (lang === "ta" ? result.special.sadeSatiPhaseTa : result.special.sadeSatiPhaseEn)
              : (lang === "ta" ? "சனி பெயர்ச்சி பலன்" : "Saturn Period")}
          </p>
          <p className="mt-1.5 text-xs text-muted leading-relaxed">
            {lang === "ta" ? result.special.saturnVerdictTa : result.special.saturnVerdictEn}
          </p>
        </div>

        {/* Rahu-Ketu Axis */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {lang === "ta" ? "ராகு - கேது சஞ்சாரம்" : "Rahu - Ketu Axis"}
            </span>
            <span className="rounded-md border border-border bg-elevated px-2 py-0.5 text-[11px] font-bold text-muted">
              180° சம சப்தமம்
            </span>
          </div>
          <p className="font-display text-lg font-bold text-ink mt-2">
            {result.special.rahuHouse} & {result.special.ketuHouse} {lang === "ta" ? "-ஆம் பாவகங்கள்" : "Houses"}
          </p>
          <p className="mt-1.5 text-xs text-muted leading-relaxed">
            {lang === "ta" ? result.special.rahuKetuVerdictTa : result.special.rahuKetuVerdictEn}
          </p>
        </div>
      </div>

      {/* Complete Planetary Transits Table */}
      <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            {lang === "ta"
              ? `${result.janmaRasiTa} ராசிக்கான 9 கிரகங்களின் கோசார நிலைகள் (${result.transitDateStr})`
              : `9 Planets Gochara Status for ${result.janmaRasiEn} (${result.transitDateStr})`}
          </h3>
          <span className="text-xs text-muted">
            {lang === "ta" ? "பாரம்பரிய பலதீபிகை முறை" : "Phaladeepika Standards"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/70 text-muted uppercase text-[11px] font-semibold tracking-wider bg-elevated/40">
                <th className="p-3">{lang === "ta" ? "கிரகம்" : "Planet"}</th>
                <th className="p-3">{lang === "ta" ? "தற்போதைய ராசி" : "Transit Sign"}</th>
                <th className="p-3">{lang === "ta" ? "பாகை" : "DMS"}</th>
                <th className="p-3">{lang === "ta" ? "நட்சத்திரம் & பாதம்" : "Star & Pada"}</th>
                <th className="p-3 text-center">{lang === "ta" ? "ராசியிலிருந்து பாவம்" : "House from Moon"}</th>
                <th className="p-3">{lang === "ta" ? "கோசார நிலை" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {result.planets.map((p) => (
                <tr key={p.id} className="hover:bg-elevated/40 transition-colors">
                  <td className="p-3 font-semibold text-ink flex items-center gap-2">
                    <span className="size-6 rounded-md bg-elevated flex items-center justify-center font-bold text-xs text-accent">
                      {p.glyph}
                    </span>
                    <div>
                      <span>{lang === "ta" ? p.nameTa : p.nameEn}</span>
                      {p.retrograde && (
                        <span className="ml-1.5 rounded bg-amber-500/10 px-1 py-0.2 text-[9.5px] font-bold text-amber-700 border border-amber-500/20">
                          {lang === "ta" ? "வக்ரம்" : "R"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-ink">
                    {lang === "ta" ? p.signTa : p.signEn}
                  </td>
                  <td className="p-3 font-mono text-xs text-muted">
                    {p.dms}
                  </td>
                  <td className="p-3 text-ink">
                    {lang === "ta" ? p.nakTa : p.nakEn} ({p.pada})
                  </td>
                  <td className="p-3 text-center">
                    <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 font-bold text-xs text-ink">
                      {p.houseFromJanma}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-semibold border inline-flex items-center gap-1",
                        p.isFavorable
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-border bg-elevated/60 text-muted"
                      )}
                    >
                      {p.isFavorable ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <AlertCircle className="size-3" />
                      )}
                      <span>{lang === "ta" ? p.statusLabelTa : p.statusLabelEn}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transit Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.planets.map((p) => (
          <div key={p.id} className="rounded-xl border border-border/70 bg-surface p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="font-bold text-sm text-ink flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" />
                {lang === "ta" ? p.nameTa : p.nameEn} — {lang === "ta" ? p.signTa : p.signEn} ({p.houseFromJanma}-ஆம் பாவம்)
              </span>
              <span className="text-[11px] text-muted font-mono">{p.dms}</span>
            </div>
            <p className="text-xs text-fg mt-2 leading-relaxed">
              {lang === "ta" ? p.effectSummaryTa : p.effectSummaryEn}
            </p>
            <p className="text-[10.5px] text-muted mt-1.5">
              {lang === "ta" ? p.classicalRuleTa : p.classicalRuleEn}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
