// Codepackr Astro - Nakshatra & Pada Calculator View
import { useState, useMemo } from "react";
import {
  getNakshatraDetail,
  computeNakshatraFromDate,
  NAKSHATRA_DATA,
  type NakshatraPadaDetail,
} from "@/lib/astro/nakshatra-tool";
import { type Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Compass,
  Calendar,
  Layers,
  Feather,
  TreePine,
  Shield,
  Heart,
  Flame,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export function NakshatraView({
  lang,
  onNavigateToBabyNames,
}: {
  lang: Lang;
  onNavigateToBabyNames?: (nakIdx: number, pada: number) => void;
}) {
  const [mode, setMode] = useState<"direct" | "birth">("direct");
  const [selectedNak, setSelectedNak] = useState<number>(0); // Default: Ashwini
  const [selectedPada, setSelectedPada] = useState<number>(1); // Default: Pada 1

  // Birth date/time state
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);

  const detail: NakshatraPadaDetail = useMemo(() => {
    if (mode === "direct") {
      return getNakshatraDetail(selectedNak, selectedPada);
    } else {
      return computeNakshatraFromDate({ year, month, day, hour, minute }, 5.5);
    }
  }, [mode, selectedNak, selectedPada, year, month, day, hour, minute]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          <Sparkles className="size-4" />
          <span>{lang === "ta" ? "27 நட்சத்திரங்கள் · 108 பாதங்கள்" : "27 Nakshatras · 108 Padas"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
          {lang === "ta" ? "நட்சத்திரம் மற்றும் பாதம் கணிப்பான்" : "Nakshatra & Pada Calculator"}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
          {lang === "ta"
            ? "அதிதேவதை, கணம், யோனி, நாடி, விருட்சம், பறவை, பூதம் மற்றும் நான்கு பாதங்களுக்கான பெயரிடும் எழுத்துக்களை விரிவாகக் கண்டறியுங்கள்."
            : "Complete astrological attributes: Deity, Gana, Yoni, Nadi, Sacred Tree, Bird, Element, and verified 4-Pada naming syllables."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 rounded-xl bg-elevated/60 p-1 border border-border/70 max-w-md">
        <button
          type="button"
          onClick={() => setMode("direct")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
            mode === "direct"
              ? "bg-surface text-ink shadow-xs"
              : "text-muted hover:text-fg"
          )}
        >
          {lang === "ta" ? "நட்சத்திரம் நேரடியாகத் தேர்வு" : "Select Nakshatra Directly"}
        </button>
        <button
          type="button"
          onClick={() => setMode("birth")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
            mode === "birth"
              ? "bg-surface text-ink shadow-xs"
              : "text-muted hover:text-fg"
          )}
        >
          {lang === "ta" ? "பிறந்த தேதியிலிருந்து கணிக்க" : "Calculate from Birth Details"}
        </button>
      </div>

      {/* Controls Container */}
      {mode === "direct" ? (
        <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
              {lang === "ta" ? "27 நட்சத்திரங்களில் ஒன்றைத் தேர்வு செய்க:" : "Select One of the 27 Nakshatras:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {NAKSHATRA_DATA.map((n) => {
                const isSelected = selectedNak === n.idx;
                return (
                  <button
                    key={n.idx}
                    type="button"
                    onClick={() => setSelectedNak(n.idx)}
                    className={cn(
                      "p-2 rounded-lg border text-center transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent text-accent-fg font-semibold shadow-xs"
                        : "border-border/70 bg-elevated/40 hover:bg-elevated text-fg"
                    )}
                  >
                    <div className="text-xs font-bold leading-tight">
                      {lang === "ta" ? n.ta : n.en}
                    </div>
                    <div className={cn("text-[9.5px] mt-0.5", isSelected ? "text-accent-fg/80" : "text-muted")}>
                      {lang === "ta" ? n.en : n.ta}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-border/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              {lang === "ta" ? "பாதம் (1 முதல் 4):" : "Pada (1 to 4):"}
            </label>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {[1, 2, 3, 4].map((p) => {
                const isSelected = selectedPada === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPada(p)}
                    className={cn(
                      "py-2 rounded-lg border text-center font-bold text-xs cursor-pointer transition-all",
                      isSelected
                        ? "border-accent bg-accent text-accent-fg shadow-xs"
                        : "border-border/70 bg-elevated/50 hover:bg-elevated text-fg"
                    )}
                  >
                    {lang === "ta" ? `பாதம் ${p}` : `Pada ${p}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
            {lang === "ta" ? "பிறந்த தேதி மற்றும் நேரத்தை உள்ளிடவும்:" : "Enter Birth Date & Time:"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <span className="text-[11px] text-muted block mb-1">{lang === "ta" ? "ஆண்டு" : "Year"}</span>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg"
              />
            </div>
            <div>
              <span className="text-[11px] text-muted block mb-1">{lang === "ta" ? "மாதம்" : "Month"}</span>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg"
              />
            </div>
            <div>
              <span className="text-[11px] text-muted block mb-1">{lang === "ta" ? "நாள்" : "Day"}</span>
              <input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg"
              />
            </div>
            <div>
              <span className="text-[11px] text-muted block mb-1">{lang === "ta" ? "மணி (0-23)" : "Hour"}</span>
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg"
              />
            </div>
            <div>
              <span className="text-[11px] text-muted block mb-1">{lang === "ta" ? "நிமிடம் (0-59)" : "Min"}</span>
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Nakshatra Spotlight */}
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent text-accent-fg">
                #{detail.nakIdx + 1} {lang === "ta" ? "நட்சத்திரம்" : "Nakshatra"}
              </span>
              <span className="text-xs font-semibold text-muted">
                {lang === "ta" ? `பாதம் ${detail.pada}` : `Pada ${detail.pada}`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-ink mt-2">
              {lang === "ta" ? detail.nakTa : detail.nakEn}
              <span className="text-muted font-normal text-xl ml-2">
                ({lang === "ta" ? detail.nakEn : detail.nakTa})
              </span>
            </h2>
            <p className="mt-1 text-sm text-fg font-medium">
              {lang === "ta" ? "இராசி:" : "Sign:"}{" "}
              <strong className="text-accent">{lang === "ta" ? detail.rasiTa : detail.rasiEn}</strong> ·{" "}
              {lang === "ta" ? "நட்சத்திர அதிபதி:" : "Star Lord:"}{" "}
              <strong className="text-ink">{lang === "ta" ? detail.lordTa : detail.lordEn}</strong>
            </p>
          </div>

          {/* Pada Syllables Box */}
          <div className="rounded-xl border border-border/80 bg-surface p-4 text-center min-w-[200px] shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-muted block">
              {lang === "ta" ? "பெயர் தொடக்க எழுத்து" : "Naming Syllable"}
            </span>
            <div className="mt-1 text-3xl font-display font-extrabold text-accent">
              {detail.syllableTa} / {detail.syllableEn}
            </div>
            <span className="text-[11px] text-muted block mt-0.5">
              {lang === "ta" ? `பாதம் ${detail.pada}-க்கான எழுத்து` : `Syllable for Pada ${detail.pada}`}
            </span>
          </div>
        </div>

        {/* 4 Padas Syllables Strip */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">
            {lang === "ta" ? "நான்கு பாதங்களுக்குரிய பெயரிடும் எழுத்துகள் (108 பாதக் கணக்கு):" : "Syllables for all 4 Padas of this Nakshatra:"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {detail.allPadaSyllablesTa.map((sTa, pIdx) => {
              const pNum = pIdx + 1;
              const isCurrent = detail.pada === pNum;
              const sEn = detail.allPadaSyllablesEn[pIdx];
              return (
                <div
                  key={pIdx}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all",
                    isCurrent
                      ? "border-accent bg-accent/15 text-ink font-bold shadow-2xs"
                      : "border-border/60 bg-surface/80 text-muted"
                  )}
                >
                  <div className="text-[11px] font-semibold text-muted">
                    {lang === "ta" ? `பாதம் ${pNum}` : `Pada ${pNum}`}
                  </div>
                  <div className="text-xl font-display font-bold text-ink mt-0.5">
                    {sTa} <span className="text-sm font-normal text-muted">({sEn})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attributes Grid (Deity, Gana, Yoni, Nadi, Tree, Bird, Element) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {/* Deity */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Shield className="size-4 text-accent" />
            <span>{lang === "ta" ? "அதிதேவதை" : "Deity"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.deityTa : detail.deityEn}
          </p>
        </div>

        {/* Gana */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Layers className="size-4 text-accent" />
            <span>{lang === "ta" ? "கணம்" : "Gana"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.ganaTa : detail.ganaEn}
          </p>
        </div>

        {/* Yoni */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Heart className="size-4 text-accent" />
            <span>{lang === "ta" ? "யோனி & விலங்கு" : "Yoni (Animal)"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.yoniTa : detail.yoniEn}
          </p>
        </div>

        {/* Nadi */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Flame className="size-4 text-accent" />
            <span>{lang === "ta" ? "நாடி" : "Nadi"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.nadiTa : detail.nadiEn}
          </p>
        </div>

        {/* Tree */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <TreePine className="size-4 text-accent" />
            <span>{lang === "ta" ? "விருட்சம் (மரம்)" : "Sacred Tree"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.vrikshamTa : detail.vrikshamEn}
          </p>
        </div>

        {/* Bird */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Feather className="size-4 text-accent" />
            <span>{lang === "ta" ? "பறவை" : "Bird"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.birdTa : detail.birdEn}
          </p>
        </div>

        {/* Element */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Compass className="size-4 text-accent" />
            <span>{lang === "ta" ? "பூதம்" : "Element"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.elementTa : detail.elementEn}
          </p>
        </div>

        {/* Direction */}
        <div className="rounded-xl border border-border/80 bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Compass className="size-4 text-accent" />
            <span>{lang === "ta" ? "சுப திசை" : "Auspicious Direction"}</span>
          </div>
          <p className="font-display text-base font-bold text-ink mt-1.5">
            {lang === "ta" ? detail.favorableDirectionsTa : detail.favorableDirectionsEn}
          </p>
        </div>
      </div>

      {/* Traits and Significance */}
      <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs space-y-3">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <BookOpen className="size-4 text-accent" />
          {lang === "ta"
            ? `${detail.nakTa} நட்சத்திரக் குணாதிசயங்கள் & பலன்கள்`
            : `${detail.nakEn} Personality Traits & Qualities`}
        </h3>
        <p className="text-sm text-fg leading-relaxed">
          {lang === "ta" ? detail.characteristicsTa : detail.characteristicsEn}
        </p>
      </div>

      {/* Direct link to Baby Names finder */}
      {onNavigateToBabyNames && (
        <div className="rounded-xl border border-border/80 bg-elevated/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-ink text-sm sm:text-base">
              {lang === "ta"
                ? `இந்த ${detail.nakTa} பாதம் ${detail.pada}-க்கான தமிழ்ப் பெயர்களைப் பார்க்க வேண்டுமா?`
                : `Looking for baby names matching ${detail.nakEn} Pada ${detail.pada}?`}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {lang === "ta"
                ? `தொடக்க எழுத்து '${detail.syllableTa}' கொண்ட தூய தமிழ் மற்றும் பாரம்பரியப் பெயர்கள்.`
                : `Authentic Tamil names starting with '${detail.syllableEn}'.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToBabyNames(detail.nakIdx, detail.pada)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-accent-fg shadow-xs hover:bg-accent/90 transition-all cursor-pointer"
          >
            <span>{lang === "ta" ? "குழந்தைப் பெயர்களைக் காண்க" : "Browse Baby Names"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </main>
  );
}
