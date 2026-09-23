// Codepackr Astro - Premier Daily Rasi Palan (தினசரி ராசி பலன்) Page
// Features interactive date navigation, city & school selection, live dynamic astrological calculations,
// Chandrashtamam alerts, 12 Rasi comprehensive life aspect predictions, lucky highlights, and print/share.
import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Copy,
  Printer,
  Search,
  Star,
  Compass,
  Clock,
  Briefcase,
  Coins,
  Home,
  Activity,
  GraduationCap,
  Flame,
  Droplets,
  Wind,
  Mountain,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  buildDailyRasiPalan,
  type DailyPalanBundle,
  type RasiPalanRow,
} from "@/lib/astro/rasi-palan";
import { t, type Lang } from "@/lib/astro/i18n";
import { RotatingQuote } from "@/components/rotating-quote";
import { cn } from "@/lib/utils";

const MAJOR_CITIES = [
  { name: "Chennai", labelTa: "சென்னை", labelEn: "Chennai", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: "Madurai", labelTa: "மதுரை", labelEn: "Madurai", lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { name: "Coimbatore", labelTa: "கோயம்புத்தூர்", labelEn: "Coimbatore", lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: "Tiruchirappalli", labelTa: "திருச்சிராப்பள்ளி", labelEn: "Trichy", lat: 10.7905, lon: 78.7047, tz: 5.5 },
  { name: "Salem", labelTa: "சேலம்", labelEn: "Salem", lat: 11.6643, lon: 78.146, tz: 5.5 },
  { name: "Tirunelveli", labelTa: "திருநெல்வேலி", labelEn: "Tirunelveli", lat: 8.7139, lon: 77.7567, tz: 5.5 },
  { name: "Thanjavur", labelTa: "தஞ்சாவூர்", labelEn: "Thanjavur", lat: 10.787, lon: 79.1378, tz: 5.5 },
  { name: "Vellore", labelTa: "வேலூர்", labelEn: "Vellore", lat: 12.9165, lon: 79.1325, tz: 5.5 },
  { name: "Bengaluru", labelTa: "பெங்களூரு", labelEn: "Bangalore", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Singapore", labelTa: "சிங்கப்பூர்", labelEn: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8.0 },
  { name: "Kuala Lumpur", labelTa: "கோலாலம்பூர்", labelEn: "Kuala Lumpur", lat: 3.139, lon: 101.6869, tz: 8.0 },
  { name: "London", labelTa: "லண்டன்", labelEn: "London", lat: 51.5074, lon: -0.1278, tz: 1.0 },
  { name: "Dubai", labelTa: "துபாய்", labelEn: "Dubai", lat: 25.2048, lon: 55.2708, tz: 4.0 },
];

function formatDateForInput(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function DailyRasiView({ lang }: { lang: Lang }) {
  // Current date initialization
  const today = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }, []);

  const [dateState, setDateState] = useState(today);
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [school, setSchool] = useState<"thirukanitham" | "vakya" | "lahiri">("thirukanitham");
  const [selectedSignFilter, setSelectedSignFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [spotlightRow, setSpotlightRow] = useState<RasiPalanRow | null>(null);
  const [copiedSign, setCopiedSign] = useState<number | null>(null);

  const activeCity = MAJOR_CITIES[selectedCityIndex] ?? MAJOR_CITIES[0];

  // Calculate Rasi Palan for selected parameters
  const bundle: DailyPalanBundle = useMemo(() => {
    return buildDailyRasiPalan({
      year: dateState.year,
      month: dateState.month,
      day: dateState.day,
      lang,
      school,
      place: {
        name: activeCity.name,
        lat: activeCity.lat,
        lon: activeCity.lon,
        tz: activeCity.tz,
      },
    });
  }, [dateState, lang, school, activeCity]);

  // Quick Date Handlers
  const handleSetToday = useCallback(() => {
    setDateState(today);
  }, [today]);

  const handleSetTomorrow = useCallback(() => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    setDateState({
      year: next.getFullYear(),
      month: next.getMonth() + 1,
      day: next.getDate(),
    });
  }, []);

  const handleSetYesterday = useCallback(() => {
    const prev = new Date();
    prev.setDate(prev.getDate() - 1);
    setDateState({
      year: prev.getFullYear(),
      month: prev.getMonth() + 1,
      day: prev.getDate(),
    });
  }, []);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    if (y && m && d) {
      setDateState({ year: y, month: m, day: d });
    }
  };

  const handlePrevDay = () => {
    const cur = new Date(dateState.year, dateState.month - 1, dateState.day);
    cur.setDate(cur.getDate() - 1);
    setDateState({ year: cur.getFullYear(), month: cur.getMonth() + 1, day: cur.getDate() });
  };

  const handleNextDay = () => {
    const cur = new Date(dateState.year, dateState.month - 1, dateState.day);
    cur.setDate(cur.getDate() + 1);
    setDateState({ year: cur.getFullYear(), month: cur.getMonth() + 1, day: cur.getDate() });
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    let rows = bundle.rows;
    if (selectedSignFilter !== "all") {
      rows = rows.filter((r) => r.sign === selectedSignFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.tamilSign.toLowerCase().includes(q) ||
          r.englishSign.toLowerCase().includes(q) ||
          r.nakshatrasTa.toLowerCase().includes(q) ||
          r.nakshatrasEn.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [bundle.rows, selectedSignFilter, searchQuery]);

  // Copy shareable summary to clipboard
  const handleCopySign = (row: RasiPalanRow) => {
    const text = `🌟 CodePackr Astro - ${row.title} (${bundle.dateLabel})\n${row.houseTitleTa}\n\n✨ பொதுப்பலன்: ${row.details.general}\n💼 தொழில்: ${row.details.career}\n💰 நிதி: ${row.details.finance}\n🏠 குடும்பம்: ${row.details.family}\n🌿 ஆரோக்கியம்: ${row.details.health}\n\n🎯 அதிர்ஷ்ட எண்: ${row.luckyNumber} | நிறம்: ${row.luckyColorTa} | திசை: ${row.luckyDirectionTa}\n🪔 வழிபாடு: ${row.deityTa}\n\nஜாதகம் & தினசரி பலன்கள்: https://astro.codepackr.com/rasipalan`;
    navigator.clipboard.writeText(text);
    setCopiedSign(row.sign);
    setTimeout(() => setCopiedSign(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isTodayActive =
    dateState.year === today.year &&
    dateState.month === today.month &&
    dateState.day === today.day;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Header section with title and rotating quote */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
            <Sparkles className="size-3.5" />
            <span>{lang === "ta" ? "தினசரி கோச்சார ராசி பலன்" : "Daily Planetary Gochara Forecast"}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {lang === "ta" ? "இன்றைய ராசி பலன்" : "Daily Rasi Palan"}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            {lang === "ta"
              ? "சந்திரனின் கோச்சாரம், திதி, யோகம் மற்றும் திருக்கணித வானியல் கணக்கீடுகளின் அடிப்படையில் 12 ராசிகளுக்குமான துல்லிய கணிப்புகள்."
              : "Precise Vedic astrological predictions for all 12 zodiac signs based on lunar transit, tithi, and astronomical ephemeris."}
          </p>
        </div>
        <RotatingQuote lang={lang} className="w-full lg:max-w-md shrink-0 no-print" />
      </div>

      {/* Interactive Generator & Control Bar */}
      <section className="no-print mb-6 rounded-2xl border border-border/80 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* Quick Date Toggles + Stepper */}
          <div className="flex flex-wrap items-center gap-1.5 lg:col-span-5">
            <button
              type="button"
              onClick={handlePrevDay}
              title={lang === "ta" ? "முந்தைய நாள்" : "Previous Day"}
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleSetYesterday}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {lang === "ta" ? "நேற்று" : "Yesterday"}
            </button>
            <button
              type="button"
              onClick={handleSetToday}
              className={cn(
                "h-9 rounded-lg px-3.5 text-xs font-bold transition-all shadow-xs",
                isTodayActive
                  ? "bg-accent text-white ring-2 ring-accent/30"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              {lang === "ta" ? "இன்று (Today)" : "Today"}
            </button>
            <button
              type="button"
              onClick={handleSetTomorrow}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {lang === "ta" ? "நாளை" : "Tomorrow"}
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              title={lang === "ta" ? "அடுத்த நாள்" : "Next Day"}
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Custom Date Input */}
            <div className="relative flex items-center">
              <input
                type="date"
                value={formatDateForInput(dateState.year, dateState.month, dateState.day)}
                onChange={handleDateInputChange}
                className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs font-semibold text-slate-800 focus:border-accent focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* City Selection */}
          <div className="flex items-center gap-2 lg:col-span-4">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <select
              value={selectedCityIndex}
              onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 focus:border-accent focus:bg-white focus:outline-hidden"
            >
              {MAJOR_CITIES.map((c, i) => (
                <option key={c.name} value={i}>
                  {lang === "ta" ? `${c.labelTa} (${c.name})` : `${c.labelEn}, India/Intl`}
                </option>
              ))}
            </select>
          </div>

          {/* School Selector + Print Button */}
          <div className="flex items-center justify-end gap-2 lg:col-span-3">
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value as any)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs font-semibold text-slate-800 focus:border-accent focus:outline-hidden"
            >
              <option value="thirukanitham">{lang === "ta" ? "திருக்கணிதம்" : "Thirukanitham"}</option>
              <option value="vakya">{lang === "ta" ? "வாக்கியம்" : "Vakya"}</option>
              <option value="lahiri">Lahiri (Chitrapaksha)</option>
            </select>
            <button
              type="button"
              onClick={handlePrint}
              title={lang === "ta" ? "ராசி பலனை அச்சிட" : "Print Rasi Palan"}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">{lang === "ta" ? "அச்சிடு" : "Print"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cosmic Day Summary Banner */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-white to-amber-50/30 p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-center">
          {/* Date & Weekday */}
          <div className="border-b border-accent/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "தேதி & கிழமை" : "Date & Day"}
            </span>
            <p className="mt-0.5 text-base font-extrabold text-slate-900">{bundle.dateLabel}</p>
            <p className="text-xs font-bold text-accent">
              {bundle.weekday} · {lang === "ta" ? bundle.dayLordTa : bundle.dayLordEn}
            </p>
          </div>

          {/* Tamil Date */}
          <div className="border-b border-accent/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "தமிழ் மாதம் & தேதி" : "Tamil Calendar"}
            </span>
            <p className="mt-0.5 text-base font-extrabold text-slate-900">{bundle.tamilDateLabel}</p>
            <p className="text-xs font-medium text-slate-600">
              {lang === "ta" ? "சூரிய சஞ்சார கணக்கு" : "Solar Nirayana Month"}
            </p>
          </div>

          {/* Moon Transit */}
          <div className="border-b border-accent/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "சந்திர சஞ்சாரம்" : "Moon Transit"}
            </span>
            <p className="mt-0.5 text-base font-extrabold text-slate-900">
              {lang === "ta" ? bundle.moonSignTa : bundle.moonSignEn}
            </p>
            <p className="text-xs font-semibold text-slate-600">
              {bundle.moonNak} · {lang === "ta" ? `பாதம் ${bundle.moonNakPada}` : `Pada ${bundle.moonNakPada}`}
            </p>
          </div>

          {/* Tithi & Yoga */}
          <div className="border-b border-accent/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "திதி & யோகம்" : "Tithi & Yoga"}
            </span>
            <p className="mt-0.5 text-xs font-bold text-slate-900 line-clamp-1">{bundle.tithiLabel}</p>
            <p className="text-xs font-medium text-slate-600">
              {bundle.yogaLabel} · {bundle.karanaLabel}
            </p>
          </div>

          {/* Sunrise & Sunset */}
          <div className="border-b border-accent/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "சூரிய உதயம் / அஸ்தமனம்" : "Sunrise / Sunset"}
            </span>
            <p className="mt-0.5 text-xs font-bold text-slate-900">
              {bundle.sunrise} / {bundle.sunset}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {lang === "ta" ? activeCity.labelTa : activeCity.labelEn}
            </p>
          </div>

          {/* Rahu Kalam & Muhurtham */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "ta" ? "இராகு காலம் & சுப நேரம்" : "Rahu Kalam & Good Hour"}
            </span>
            <p className="mt-0.5 text-xs font-bold text-red-600">
              {lang === "ta" ? "இராகு:" : "Rahu:"} {bundle.rahuKalam}
            </p>
            <p className="text-[11px] font-semibold text-emerald-700">
              {lang === "ta" ? "சுப ஹோரை:" : "Auspicious:"} {bundle.subhaHoras[0]?.time || "காலை 9:00 – 10:30"}
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Chandrashtamam Alert Banner */}
      <section className="mb-6 rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-200/80 px-2 py-0.5 text-[11px] font-extrabold text-amber-900">
                  {lang === "ta" ? "சந்திராஷ்டம எச்சரிக்கை" : "Chandrashtamam Advisory"}
                </span>
                <span className="font-display text-base font-extrabold text-slate-900">
                  {lang === "ta"
                    ? `இன்று ${bundle.chandrashtamamSignTa} ராசிக்கு சந்திராஷ்டமம்!`
                    : `Today Chandrashtamam is active for ${bundle.chandrashtamamSignEn}!`}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-amber-950 sm:text-sm">
                {lang === "ta" ? bundle.chandrashtamamAdviceTa : bundle.chandrashtamamAdviceEn}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedSignFilter(bundle.chandrashtamamSign)}
            className="shrink-0 self-start sm:self-center rounded-xl border border-amber-400 bg-white px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            {lang === "ta"
              ? `${bundle.chandrashtamamSignTa} பலனை மட்டும் பார்`
              : `View ${bundle.chandrashtamamSignEn} Details`}
          </button>
        </div>
      </section>

      {/* Sign Selector Filter Pills + Search */}
      <section className="no-print mb-6 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "ta" ? "ராசி தேர்வு:" : "Select Sign:"}
            </span>
            <button
              type="button"
              onClick={() => setSelectedSignFilter("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                selectedSignFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              {lang === "ta" ? "அனைத்து 12 ராசிகளும்" : "All 12 Signs"}
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === "ta" ? "ராசி அல்லது நட்சத்திரம் தேடுக..." : "Search sign or nakshatra..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-accent focus:outline-hidden"
            />
          </div>
        </div>

        {/* 12 Rasi Quick Jump Pills */}
        <div className="flex flex-wrap gap-1.5">
          {bundle.rows.map((row) => {
            const isSelected = selectedSignFilter === row.sign;
            return (
              <button
                key={row.sign}
                type="button"
                onClick={() => setSelectedSignFilter(isSelected ? "all" : row.sign)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-2xs",
                  isSelected
                    ? "border-accent bg-accent text-white shadow-sm ring-2 ring-accent/30"
                    : row.isChandrashtamam
                    ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : row.tone === "good"
                    ? "border-emerald-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                )}
              >
                <span className="text-sm">{row.symbol}</span>
                <span>{lang === "ta" ? row.tamilSign : row.englishSign}</span>
                {row.isChandrashtamam && (
                  <span className="size-2 rounded-full bg-amber-500" title="சந்திராஷ்டமம்" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of 12 Rasi Palan Cards */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRows.map((row) => (
          <RasiCard
            key={row.sign}
            row={row}
            lang={lang}
            isCopied={copiedSign === row.sign}
            onCopy={() => handleCopySign(row)}
            onOpenSpotlight={() => setSpotlightRow(row)}
          />
        ))}
      </section>

      {/* No results empty state */}
      {filteredRows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-bold text-slate-700">
            {lang === "ta" ? "பொருத்தமான ராசிகள் எதுவும் கிடைக்கவில்லை" : "No matching zodiac signs found"}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSignFilter("all");
              setSearchQuery("");
            }}
            className="mt-3 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            {lang === "ta" ? "அனைத்து ராசிகளையும் காட்டு" : "Show All Signs"}
          </button>
        </div>
      )}

      {/* Single Sign Spotlight Modal */}
      {spotlightRow && (
        <SpotlightModal
          row={spotlightRow}
          bundle={bundle}
          lang={lang}
          onClose={() => setSpotlightRow(null)}
          onCopy={() => handleCopySign(spotlightRow)}
          isCopied={copiedSign === spotlightRow.sign}
        />
      )}

      {/* Astrological Disclaimer note */}
      <footer className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-center text-xs leading-relaxed text-slate-500">
        <p>
          {lang === "ta"
            ? "குறிப்பு: தினசரி ராசி பலன் என்பது பொதுவான சந்திர கோசாரத்தின் அடிப்படையில் கணிக்கப்படுவதாகும். உங்கள் தனிப்பட்ட ஜன்ம லக்னம், தசா புக்தி மற்றும் தனி ஜாதக கிரக நிலைகளுக்கேற்ப இதில் மாற்றங்கள் இருக்கும்."
            : "Note: Daily Rasi Palan provides general guidance based on universal planetary transits. For tailored precision, refer to your personalized birth chart and current Dasha-Bhukti periods."}
        </p>
      </footer>
    </main>
  );
}

// Subcomponent: Individual Rasi Card
function RasiCard({
  row,
  lang,
  isCopied,
  onCopy,
  onOpenSpotlight,
}: {
  row: RasiPalanRow;
  lang: Lang;
  isCopied: boolean;
  onCopy: () => void;
  onOpenSpotlight: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "career" | "finance" | "family" | "health">("general");

  const ElementIcon =
    row.elementTa === "நெருப்பு" ? Flame :
    row.elementTa === "நீர்" ? Droplets :
    row.elementTa === "காற்று" ? Wind : Mountain;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-md",
        row.isChandrashtamam
          ? "border-amber-300 ring-1 ring-amber-300/40 bg-gradient-to-b from-amber-50/40 via-white to-white"
          : row.tone === "good"
          ? "border-emerald-200/90 hover:border-emerald-400/80"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-bold shadow-xs",
                row.isChandrashtamam
                  ? "bg-amber-500 text-white"
                  : row.tone === "good"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-white"
              )}
            >
              {row.symbol}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-extrabold text-slate-900">
                  {lang === "ta" ? row.tamilSign : row.englishSign}
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  ({lang === "ta" ? row.englishSign : row.tamilSign})
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{lang === "ta" ? `அதிபதி: ${row.lordTa}` : `Lord: ${row.lordEn}`}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <ElementIcon className="size-3 text-slate-400" />
                  {row.element}
                </span>
              </div>
            </div>
          </div>

          {/* Rating stars & score */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.floor(row.score)
                      ? "fill-amber-400 text-amber-400"
                      : i < row.score
                      ? "fill-amber-400/50 text-amber-400"
                      : "text-slate-200"
                  )}
                />
              ))}
            </div>
            <span className="mt-1 text-[11px] font-bold text-slate-600">
              {row.score} / 5 ({row.percentage}%)
            </span>
          </div>
        </div>

        {/* Gochara House Badge */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-bold",
              row.isChandrashtamam
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : row.tone === "good"
                ? "bg-emerald-100/80 text-emerald-900 border border-emerald-200"
                : "bg-slate-100 text-slate-800 border border-slate-200"
            )}
          >
            {lang === "ta" ? row.houseTitleTa : row.houseTitleEn}
          </span>
          {row.isChandrashtamam && (
            <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-extrabold text-red-700">
              {lang === "ta" ? "சந்திராஷ்டமம்" : "Caution"}
            </span>
          )}
        </div>

        {/* Punchy Quick Summary */}
        <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-700 sm:text-sm">
          “{row.body}”
        </p>

        {/* Life Aspect Tabs */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-50 p-1 text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex-1 rounded-lg py-1 transition-colors",
                activeTab === "general" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "hover:text-slate-900"
              )}
            >
              {lang === "ta" ? "பொது" : "General"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("career")}
              className={cn(
                "flex-1 rounded-lg py-1 transition-colors",
                activeTab === "career" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "hover:text-slate-900"
              )}
            >
              {lang === "ta" ? "தொழில்" : "Career"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("finance")}
              className={cn(
                "flex-1 rounded-lg py-1 transition-colors",
                activeTab === "finance" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "hover:text-slate-900"
              )}
            >
              {lang === "ta" ? "நிதி" : "Finance"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("family")}
              className={cn(
                "flex-1 rounded-lg py-1 transition-colors",
                activeTab === "family" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "hover:text-slate-900"
              )}
            >
              {lang === "ta" ? "குடும்பம்" : "Family"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("health")}
              className={cn(
                "flex-1 rounded-lg py-1 transition-colors",
                activeTab === "health" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "hover:text-slate-900"
              )}
            >
              {lang === "ta" ? "நலம்" : "Health"}
            </button>
          </div>

          <div className="mt-2.5 min-h-[58px] text-xs leading-relaxed text-slate-600">
            {activeTab === "general" && <p>{row.details.general}</p>}
            {activeTab === "career" && <p>{row.details.career}</p>}
            {activeTab === "finance" && <p>{row.details.finance}</p>}
            {activeTab === "family" && <p>{row.details.family}</p>}
            {activeTab === "health" && <p>{row.details.health}</p>}
          </div>
        </div>

        {/* Lucky Highlights Mini Strip */}
        <div className="mt-3.5 grid grid-cols-4 gap-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2 text-center text-[10px]">
          <div>
            <span className="block text-slate-400">{lang === "ta" ? "எண்" : "Number"}</span>
            <span className="font-extrabold text-slate-900">{row.luckyNumber}</span>
          </div>
          <div>
            <span className="block text-slate-400">{lang === "ta" ? "நிறம்" : "Color"}</span>
            <span className="font-extrabold text-slate-900 truncate block">
              {lang === "ta" ? row.luckyColorTa : row.luckyColorEn}
            </span>
          </div>
          <div>
            <span className="block text-slate-400">{lang === "ta" ? "திசை" : "Direction"}</span>
            <span className="font-extrabold text-slate-900">
              {lang === "ta" ? row.luckyDirectionTa : row.luckyDirectionEn}
            </span>
          </div>
          <div>
            <span className="block text-slate-400">{lang === "ta" ? "நேரம்" : "Auspicious"}</span>
            <span className="font-extrabold text-slate-900 truncate block">
              {row.favorableTime.split("–")[0]}
            </span>
          </div>
        </div>

        {/* Deity & Remedy Box */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-accent/10 px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-accent" />
            <span className="font-bold text-accent">
              {lang === "ta" ? `வழிபாடு: ${row.deityTa}` : `Deity: ${row.deityEn}`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom Actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onOpenSpotlight}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-accent transition-colors"
        >
          <Eye className="size-3.5" />
          <span>{lang === "ta" ? "முழு விபரம்" : "Full Details"}</span>
        </button>

        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all",
            isCopied
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {isCopied ? (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>{lang === "ta" ? "நகலெடுக்கப்பட்டது" : "Copied"}</span>
            </>
          ) : (
            <>
              <Share2 className="size-3.5" />
              <span>{lang === "ta" ? "பகிர்" : "Share"}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

// Subcomponent: Spotlight Modal for Deep-Dive Sign Prediction
function SpotlightModal({
  row,
  bundle,
  lang,
  onClose,
  onCopy,
  isCopied,
}: {
  row: RasiPalanRow;
  bundle: DailyPalanBundle;
  lang: Lang;
  onClose: () => void;
  onCopy: () => void;
  isCopied: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-3xl font-extrabold text-white shadow-sm",
              row.isChandrashtamam
                ? "bg-amber-500"
                : row.tone === "good"
                ? "bg-emerald-600"
                : "bg-slate-800"
            )}
          >
            {row.symbol}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                {lang === "ta" ? row.tamilSign : row.englishSign}
              </h2>
              <span className="text-sm font-semibold text-slate-400">
                ({lang === "ta" ? row.englishSign : row.tamilSign})
              </span>
              <span className="rounded-lg bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                {bundle.dateLabel}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {lang === "ta"
                ? `நட்சத்திரங்கள்: ${row.nakshatrasTa} | அதிபதி: ${row.lordTa}`
                : `Stars: ${row.nakshatrasEn} | Lord: ${row.lordEn}`}
            </p>
          </div>
        </div>

        {/* Status & House */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-xl px-3 py-1 text-xs font-bold",
              row.isChandrashtamam
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-emerald-100 text-emerald-900"
            )}
          >
            {lang === "ta" ? row.houseTitleTa : row.houseTitleEn}
          </span>
          <span className="text-xs font-bold text-slate-600">
            {lang === "ta" ? `மதிப்பீடு: ${row.score} / 5 நட்சத்திரங்கள்` : `Score: ${row.score} / 5 Stars`}
          </span>
        </div>

        {/* Punch Line */}
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-3.5">
          <p className="text-sm font-semibold leading-relaxed text-slate-800">
            “{row.body}”
          </p>
        </div>

        {/* Detailed Areas */}
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sparkles className="size-4 text-accent" />
              <span>{lang === "ta" ? "பொதுப்பலன் & மனநிலை" : "General Overview"}</span>
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.general}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Briefcase className="size-4 text-blue-600" />
                <span>{lang === "ta" ? "தொழில் & வேலை" : "Career & Work"}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.career}</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Coins className="size-4 text-emerald-600" />
                <span>{lang === "ta" ? "பொருளாதாரம் & வரவு" : "Finance & Wealth"}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.finance}</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Home className="size-4 text-amber-600" />
                <span>{lang === "ta" ? "குடும்பம் & இல்லறம்" : "Family & Home"}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.family}</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Activity className="size-4 text-rose-600" />
                <span>{lang === "ta" ? "உடல்நலம் & உணவு" : "Health & Diet"}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.health}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <GraduationCap className="size-4 text-indigo-600" />
              <span>{lang === "ta" ? "மாணவர்கள் & கல்வி" : "Education & Students"}</span>
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{row.details.education}</p>
          </div>
        </div>

        {/* Nakshatra Pointers */}
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {lang === "ta" ? "நட்சத்திர வாரியான குறிப்புகள்" : "Star-Specific Notes"}
          </h3>
          <div className="mt-2.5 divide-y divide-slate-100 text-xs">
            {row.nakshatraPointers.map((p, i) => (
              <div key={i} className="py-2 first:pt-0 last:pb-0">
                <span className="font-bold text-accent">{p.nakName}: </span>
                <span className="text-slate-700">{p.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lucky Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl border border-accent/20 bg-accent/10 p-3.5 text-center text-xs">
          <div>
            <span className="block text-slate-500 text-[11px]">{lang === "ta" ? "அதிர்ஷ்ட எண்" : "Lucky No"}</span>
            <span className="font-extrabold text-slate-900 text-sm">{row.luckyNumber}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px]">{lang === "ta" ? "அதிர்ஷ்ட நிறம்" : "Lucky Color"}</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {lang === "ta" ? row.luckyColorTa : row.luckyColorEn}
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px]">{lang === "ta" ? "அதிர்ஷ்ட திசை" : "Direction"}</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {lang === "ta" ? row.luckyDirectionTa : row.luckyDirectionEn}
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px]">{lang === "ta" ? "சாதக நேரம்" : "Lucky Hour"}</span>
            <span className="font-extrabold text-slate-900 text-xs">{row.favorableTime}</span>
          </div>
        </div>

        {/* Daily Pariharam & Deity */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950">
          <p className="font-bold">
            🪔 {lang === "ta" ? `இன்றைய வழிபாடு: ${row.deityTa}` : `Deity to worship: ${row.deityEn}`}
          </p>
          <p className="mt-1 text-slate-700 leading-relaxed">
            {lang === "ta" ? row.remedyTa : row.remedyEn}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {lang === "ta" ? "மூடு" : "Close"}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-accent/90 transition-colors"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="size-4" />
                <span>{lang === "ta" ? "நகலெடுக்கப்பட்டது!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Share2 className="size-4" />
                <span>{lang === "ta" ? "வாட்ஸ்அப்பில் பகிர்" : "Share on WhatsApp"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
