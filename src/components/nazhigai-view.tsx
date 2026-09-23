// Codepackr Astro - Nazhigai (நாழிகை - மணி) Classical Tamil Time Converter View
import { useState, useMemo } from "react";
import {
  timeToNazhigai,
  nazhigaiToTime,
  computeSunriseRelativeNazhigai,
  type SunriseRelativeResult,
} from "@/lib/astro/nazhigai";
import { POPULAR_CITIES } from "@/lib/astro/samples";
import { type Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";
import {
  Clock,
  Sun,
  Moon,
  Compass,
  ArrowRightLeft,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

export function NazhigaiView({ lang }: { lang: Lang }) {
  // Mode: 'sunrise' (astrological standard) | 'duration' (direct unit conversion)
  const [tab, setTab] = useState<"sunrise" | "duration">("sunrise");

  // Sunrise Relative state
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [hour, setHour] = useState<number>(today.getHours());
  const [minute, setMinute] = useState<number>(today.getMinutes());
  const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0); // Chennai default

  const city = POPULAR_CITIES[selectedCityIdx] ?? POPULAR_CITIES[0];

  const sunriseResult: SunriseRelativeResult = useMemo(() => {
    return computeSunriseRelativeNazhigai(
      year,
      month,
      day,
      hour,
      minute,
      city.lat,
      city.lon,
      city.tz
    );
  }, [year, month, day, hour, minute, city]);

  // Direct unit conversion state
  const [inputHours, setInputHours] = useState<number>(5);
  const [inputMinutes, setInputMinutes] = useState<number>(30);
  const convertedTamil = useMemo(() => {
    return timeToNazhigai(inputHours, inputMinutes, 0);
  }, [inputHours, inputMinutes]);

  const [inputNazhigai, setInputNazhigai] = useState<number>(13);
  const [inputVinadi, setInputVinadi] = useState<number>(45);
  const convertedModern = useMemo(() => {
    return nazhigaiToTime(inputNazhigai, inputVinadi, 0);
  }, [inputNazhigai, inputVinadi]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          <Clock className="size-4" />
          <span>{lang === "ta" ? "பாரம்பரிய தமிழ் காலக்கணிதம்" : "Classical Tamil Horology"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
          {lang === "ta" ? "நாழிகை - மணி நேர மாற்றி" : "Nazhigai to Clock Time Converter"}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
          {lang === "ta"
            ? "சூரிய உதயம் அடிப்படையிலான பாரம்பரிய நாழிகை மற்றும் விநாடிக் கணக்கீடு. 1 நாள் = 60 நாழிகை, 1 நாழிகை = 24 நிமிடங்கள், 1 விநாடி = 24 வினாடிகள்."
            : "Convert modern hours and minutes to ancient Tamil Nazhigai & Vinadi, calculated with precision from local astronomical sunrise."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 rounded-xl bg-elevated/60 p-1 border border-border/70 max-w-lg">
        <button
          type="button"
          onClick={() => setTab("sunrise")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
            tab === "sunrise"
              ? "bg-surface text-ink shadow-xs"
              : "text-muted hover:text-fg"
          )}
        >
          {lang === "ta" ? "சூரிய உதயம் முதல் நாழிகை (ஜாதகம்)" : "Sunrise-Relative (Astrological)"}
        </button>
        <button
          type="button"
          onClick={() => setTab("duration")}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
            tab === "duration"
              ? "bg-surface text-ink shadow-xs"
              : "text-muted hover:text-fg"
          )}
        >
          {lang === "ta" ? "நேரடி கால அளவு மாற்றி" : "Direct Units Conversion"}
        </button>
      </div>

      {tab === "sunrise" ? (
        <div className="space-y-6">
          {/* Controls: Date, Time, City */}
          <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  {lang === "ta" ? "பிறந்த / விரும்பிய தேதி" : "Date"}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-fg"
                  />
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-fg"
                  />
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-fg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  {lang === "ta" ? "நேரம் (மணி : நிமிடம்)" : "Time (24h)"}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-fg"
                  />
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-fg"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted mb-1">
                  {lang === "ta" ? "பிறந்த ஊர் (உதய நேரம் கணிக்க)" : "Place (for True Sunrise)"}
                </label>
                <select
                  value={selectedCityIdx}
                  onChange={(e) => setSelectedCityIdx(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-xs text-fg focus:border-accent focus:outline-none"
                >
                  {POPULAR_CITIES.map((c, i) => (
                    <option key={i} value={i}>
                      {c.n} (அட்சரேகை: {c.lat.toFixed(2)}°, தீர்க்கரேகை: {c.lon.toFixed(2)}°)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Astronomical Hero Card */}
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent text-accent-fg">
                    {sunriseResult.isDaytime
                      ? (lang === "ta" ? "பகல் பிறப்பு" : "Daytime Birth")
                      : (lang === "ta" ? "இரவுப் பிறப்பு" : "Nighttime Birth")}
                  </span>
                  <span className="text-xs text-muted font-medium">
                    {lang === "ta" ? sunriseResult.yaamamLabelTa : sunriseResult.yaamamLabelEn}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-ink mt-2">
                  {sunriseResult.elapsedFromSunrise.nazhigai} {lang === "ta" ? "நாழிகை" : "Nazhigai"}{" "}
                  {sunriseResult.elapsedFromSunrise.vinadi} {lang === "ta" ? "விநாடி" : "Vinadi"}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted">
                  {lang === "ta" ? sunriseResult.traditionalDescriptionTa : sunriseResult.traditionalDescriptionEn}
                </p>
              </div>

              {/* Sun Times Mini Box */}
              <div className="rounded-xl border border-border/80 bg-surface p-4 text-xs space-y-1.5 min-w-[210px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1">
                    <Sun className="size-3.5 text-amber-500" />
                    {lang === "ta" ? "சூரியோதயம்:" : "Sunrise:"}
                  </span>
                  <strong className="text-ink">{sunriseResult.sunriseTimeStr}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1">
                    <Moon className="size-3.5 text-indigo-400" />
                    {lang === "ta" ? "சூரியாஸ்தமனம்:" : "Sunset:"}
                  </span>
                  <strong className="text-ink">{sunriseResult.sunsetTimeStr}</strong>
                </div>
                <div className="pt-1.5 border-t border-border/50 flex items-center justify-between font-semibold">
                  <span className="text-muted">{lang === "ta" ? "உள்ளீட்டு நேரம்:" : "Input Time:"}</span>
                  <span className="text-accent">{sunriseResult.targetTimeStr}</span>
                </div>
              </div>
            </div>

            {/* Decimal Equivalent & Breakdown */}
            <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2 rounded-lg bg-surface/70 border border-border/50">
                <span className="text-[11px] text-muted block">{lang === "ta" ? "நாழிகை" : "Nazhigai"}</span>
                <span className="text-lg font-bold text-ink">{sunriseResult.elapsedFromSunrise.nazhigai}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface/70 border border-border/50">
                <span className="text-[11px] text-muted block">{lang === "ta" ? "விநாடி / விநாழிகை" : "Vinadi"}</span>
                <span className="text-lg font-bold text-ink">{sunriseResult.elapsedFromSunrise.vinadi}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface/70 border border-border/50">
                <span className="text-[11px] text-muted block">{lang === "ta" ? "தற்பரை" : "Tharparai"}</span>
                <span className="text-lg font-bold text-ink">{sunriseResult.elapsedFromSunrise.tharparai}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface/70 border border-border/50">
                <span className="text-[11px] text-muted block">{lang === "ta" ? "தசம நாழிகை" : "Decimal"}</span>
                <span className="text-lg font-bold text-accent">{sunriseResult.decimalNazhigai}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Unit Converter */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Hours/Minutes -> Nazhigai */}
          <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Clock className="size-4 text-accent" />
              {lang === "ta" ? "மணி & நிமிடம் ➔ நாழிகை & விநாடி" : "Modern Time ➔ Nazhigai & Vinadi"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">{lang === "ta" ? "மணி நேரம்" : "Hours"}</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={inputHours}
                  onChange={(e) => setInputHours(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">{lang === "ta" ? "நிமிடங்கள்" : "Minutes"}</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
              <span className="text-xs text-muted font-medium block">
                {lang === "ta" ? "கணக்கிடப்பட்ட நாழிகை அளவு:" : "Converted Traditional Time:"}
              </span>
              <p className="text-2xl font-bold font-display text-accent mt-1">
                {convertedTamil.nazhigai} {lang === "ta" ? "நாழிகை" : "Nazhigai"}{" "}
                {convertedTamil.vinadi} {lang === "ta" ? "விநாடி" : "Vinadi"}
              </p>
              <span className="text-[11px] text-muted block mt-0.5">
                ({convertedTamil.tharparai} {lang === "ta" ? "தற்பரை" : "Tharparai"})
              </span>
            </div>
          </div>

          {/* Nazhigai -> Hours/Minutes */}
          <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <ArrowRightLeft className="size-4 text-accent" />
              {lang === "ta" ? "நாழிகை & விநாடி ➔ மணி & நிமிடம்" : "Nazhigai & Vinadi ➔ Modern Time"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">{lang === "ta" ? "நாழிகை" : "Nazhigai"}</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={inputNazhigai}
                  onChange={(e) => setInputNazhigai(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">{lang === "ta" ? "விநாடி" : "Vinadi"}</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={inputVinadi}
                  onChange={(e) => setInputVinadi(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
              <span className="text-xs text-muted font-medium block">
                {lang === "ta" ? "கணக்கிடப்பட்ட கடிகார நேரம்:" : "Converted Clock Time:"}
              </span>
              <p className="text-2xl font-bold font-display text-accent mt-1">
                {convertedModern.hours} {lang === "ta" ? "மணி" : "Hrs"}{" "}
                {convertedModern.minutes} {lang === "ta" ? "நிமிடம்" : "Mins"}{" "}
                {convertedModern.seconds} {lang === "ta" ? "வினாடி" : "Secs"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Classical Time Reference Table */}
      <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-xs">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2 mb-3">
          <Layers className="size-4 text-accent" />
          {lang === "ta" ? "பண்டைய தமிழ் கால அளவீடு அட்டவணை" : "Classical Tamil Horological Units Scale"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/70 text-muted uppercase text-[11px] font-semibold bg-elevated/40">
                <th className="p-3">{lang === "ta" ? "பாரம்பரிய தமிழ் அலகு" : "Traditional Tamil Unit"}</th>
                <th className="p-3">{lang === "ta" ? "அளவீட்டு முறை" : "Sub-Units Ratio"}</th>
                <th className="p-3">{lang === "ta" ? "நவீன கால அளவு (ஆங்கிலம்)" : "Modern Clock Equivalent"}</th>
                <th className="p-3">{lang === "ta" ? "பயன்பாடு" : "Usage Context"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 நாள் (அஹோராத்ரம்)</td>
                <td className="p-3">60 நாழிகை</td>
                <td className="p-3 font-mono">24 மணி நேரம்</td>
                <td className="p-3 text-muted">ஒரு முழு சூரிய சுழற்சி</td>
              </tr>
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 சாமம் / ஜாமம் (யாமம்)</td>
                <td className="p-3">7.5 நாழிகை</td>
                <td className="p-3 font-mono">3 மணி நேரம்</td>
                <td className="p-3 text-muted">பகலில் 4 சாமம், இரவில் 4 சாமம்</td>
              </tr>
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 முகூர்த்தம்</td>
                <td className="p-3">2 நாழிகை</td>
                <td className="p-3 font-mono">48 நிமிடங்கள்</td>
                <td className="p-3 text-muted">சுப காரிய முகூர்த்த நேரம்</td>
              </tr>
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 நாழிகை (கடிகை)</td>
                <td className="p-3">60 விநாடி</td>
                <td className="p-3 font-mono">24 நிமிடங்கள் (1440 வினாடிகள்)</td>
                <td className="p-3 text-muted">ஜாதக கணிப்பின் அடிப்படை அலகு</td>
              </tr>
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 விநாடி (விநாழிகை)</td>
                <td className="p-3">60 தற்பரை</td>
                <td className="p-3 font-mono">24 வினாடிகள்</td>
                <td className="p-3 text-muted">நுண்ணிய கிரக நிலை கணக்கீடு</td>
              </tr>
              <tr className="hover:bg-elevated/30">
                <td className="p-3 font-semibold text-ink">1 தற்பரை</td>
                <td className="p-3">—</td>
                <td className="p-3 font-mono">0.4 வினாடி (2/5 வினாடி)</td>
                <td className="p-3 text-muted">லக்ன சந்தி துல்லியக் கணக்கு</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
