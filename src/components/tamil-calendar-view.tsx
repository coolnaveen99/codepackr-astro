// Codepackr Astro — Flagship Tamil Solar Calendar & Daily Panchangam Engine
// Complete Month Calendar + Daily Panchangam + Astronomical Day Details + Festivals/Observances + 60-Year Calendar
import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Star,
  Info,
  Layers,
  Search,
  Copy,
  Check,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import {
  calculateComprehensiveDayDetails,
  type ComprehensiveDayPanchang,
  type DayTithiDetail,
  type DayNakshatraDetail,
  type TimelineEvent,
} from "@/lib/astro/calendar/panchangam";
import {
  generate60YearCalendar,
  getTamilDate,
  TAMIL_MONTHS,
} from "@/lib/astro/calendar/tamil-calendar";
import { SAMVATSARA_60 } from "@/lib/astro/calendar/samvatsara";
import { POPULAR_CITIES } from "@/lib/astro/samples";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";

interface TamilCalendarViewProps {
  lang: Lang;
}

type TabMode = "day" | "month" | "cycle" | "converter";

interface CityOption {
  name: string;
  nameTa: string;
  lat: number;
  lon: number;
  tz: number;
}

const EXTENDED_CITIES: CityOption[] = [
  { name: "Chennai (Madras)", nameTa: "சென்னை", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: "Madurai", nameTa: "மதுரை", lat: 9.9252, lon: 78.1198, tz: 5.5 },
  { name: "Coimbatore", nameTa: "கோயம்புத்தூர்", lat: 11.0168, lon: 76.9558, tz: 5.5 },
  { name: "Tiruchirappalli", nameTa: "திருச்சிராப்பள்ளி", lat: 10.7905, lon: 78.7047, tz: 5.5 },
  { name: "Salem", nameTa: "சேலம்", lat: 11.6643, lon: 78.146, tz: 5.5 },
  { name: "Tirunelveli", nameTa: "திருநெல்வேலி", lat: 8.7139, lon: 77.7567, tz: 5.5 },
  { name: "Erode", nameTa: "ஈரோடு", lat: 11.341, lon: 77.7172, tz: 5.5 },
  { name: "Vellore", nameTa: "வேலூர்", lat: 12.9165, lon: 79.1325, tz: 5.5 },
  { name: "Thanjavur", nameTa: "தஞ்சாவூர்", lat: 10.787, lon: 79.1378, tz: 5.5 },
  { name: "Kanchipuram", nameTa: "காஞ்சிபுரம்", lat: 12.8342, lon: 79.7036, tz: 5.5 },
  { name: "Tiruvannamalai", nameTa: "திருவண்ணாமலை", lat: 12.2253, lon: 79.0747, tz: 5.5 },
  { name: "Nagercoil", nameTa: "நாகர்கோவில்", lat: 8.1833, lon: 77.4334, tz: 5.5 },
  { name: "Bengaluru", nameTa: "பெங்களூரு", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Tirupati", nameTa: "திருப்பதி", lat: 13.6288, lon: 79.4192, tz: 5.5 },
  { name: "Singapore", nameTa: "சிங்கப்பூர்", lat: 1.3521, lon: 103.8198, tz: 8.0 },
  { name: "Colombo", nameTa: "கொழும்பு", lat: 6.9271, lon: 79.8612, tz: 5.5 },
  { name: "Jaffna", nameTa: "யாழ்ப்பாணம்", lat: 9.6615, lon: 80.0255, tz: 5.5 },
  { name: "Kuala Lumpur", nameTa: "கோலாலம்பூர்", lat: 3.139, lon: 101.6869, tz: 8.0 },
  { name: "London", nameTa: "லண்டன்", lat: 51.5074, lon: -0.1278, tz: 0.0 },
  { name: "New York", nameTa: "நியூயார்க்", lat: 40.7128, lon: -74.006, tz: -5.0 },
];

export function TamilCalendarView({ lang }: TamilCalendarViewProps) {
  const isTa = lang === "ta";
  const { go } = useNav();

  // Active view tab
  const [activeTab, setActiveTab] = useState<TabMode>("day");

  // Selected Location
  const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0); // Chennai default
  const [customLocation, setCustomLocation] = useState(false);
  const [customName, setCustomName] = useState("Custom Place");
  const [customLat, setCustomLat] = useState(13.0827);
  const [customLon, setCustomLon] = useState(80.2707);
  const [customTz, setCustomTz] = useState(5.5);

  const activeCity = useMemo(() => {
    if (customLocation) {
      return {
        name: customName,
        nameTa: customName,
        lat: customLat,
        lon: customLon,
        tz: customTz,
      };
    }
    return EXTENDED_CITIES[selectedCityIdx] ?? EXTENDED_CITIES[0]!;
  }, [customLocation, selectedCityIdx, customName, customLat, customLon, customTz]);

  // Selected Date state (defaults to today)
  const now = new Date();
  const [selYear, setSelYear] = useState<number>(now.getFullYear());
  const [selMonth, setSelMonth] = useState<number>(now.getMonth() + 1);
  const [selDay, setSelDay] = useState<number>(now.getDate());

  // 60-Year cycle search
  const [cycleSearchQuery, setCycleSearchQuery] = useState("");
  const [copiedYear, setCopiedYear] = useState<number | null>(null);

  // Date stepper handlers
  const handlePrevDay = () => {
    const d = new Date(selYear, selMonth - 1, selDay - 1);
    setSelYear(d.getFullYear());
    setSelMonth(d.getMonth() + 1);
    setSelDay(d.getDate());
  };

  const handleNextDay = () => {
    const d = new Date(selYear, selMonth - 1, selDay + 1);
    setSelYear(d.getFullYear());
    setSelMonth(d.getMonth() + 1);
    setSelDay(d.getDate());
  };

  const handleToday = () => {
    const d = new Date();
    setSelYear(d.getFullYear());
    setSelMonth(d.getMonth() + 1);
    setSelDay(d.getDate());
  };

  // Compute Comprehensive Day Panchang
  const dayPanchang: ComprehensiveDayPanchang = useMemo(() => {
    return calculateComprehensiveDayDetails({
      year: selYear,
      month: selMonth,
      day: selDay,
      lat: activeCity.lat,
      lon: activeCity.lon,
      tz: activeCity.tz,
      placeName: isTa ? activeCity.nameTa : activeCity.name,
      ayanamsaType: "thirukanitham",
    });
  }, [selYear, selMonth, selDay, activeCity, isTa]);

  // 60-Year records
  const cycleRecords = useMemo(() => generate60YearCalendar(1987), []);
  const filteredCycleRecords = useMemo(() => {
    if (!cycleSearchQuery.trim()) return cycleRecords;
    const q = cycleSearchQuery.toLowerCase().trim();
    return cycleRecords.filter(
      (r) =>
        r.tamilYearNameTa.toLowerCase().includes(q) ||
        r.tamilYearNameEn.toLowerCase().includes(q) ||
        String(r.cycleNumber) === q ||
        String(r.gregorianStartYear).includes(q)
    );
  }, [cycleRecords, cycleSearchQuery]);

  // Month Calendar Days Grid generator
  const monthGridDays = useMemo(() => {
    const totalDays = new Date(selYear, selMonth, 0).getDate();
    const firstDayWeekday = new Date(selYear, selMonth - 1, 1).getDay(); // 0=Sun
    const days = [];

    // Empty lead slots for calendar alignment
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Days 1 through totalDays
    for (let d = 1; d <= totalDays; d++) {
      try {
        const details = calculateComprehensiveDayDetails({
          year: selYear,
          month: selMonth,
          day: d,
          lat: activeCity.lat,
          lon: activeCity.lon,
          tz: activeCity.tz,
          placeName: activeCity.name,
          ayanamsaType: "thirukanitham",
        });
        days.push(details);
      } catch {
        days.push(null);
      }
    }
    return days;
  }, [selYear, selMonth, activeCity]);

  return (
    <main className="tamil-calendar-view mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header Banner */}
      <section className="mb-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/70 px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
              <Sparkles className="h-4 w-4 text-amber-600" />
              {isTa ? "துல்லிய தமிழ் சூரிய நாட்காட்டி & தினசரி பஞ்சாங்கம்" : "Tamil Solar Calendar & Daily Panchangam"}
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {isTa ? "தமிழ் நாட்காட்டி & நாள் விபரம்" : "Tamil Solar Calendar & Daily Day Details"}
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              {isTa
                ? "மாதச் சங்கிராந்தி, திதி, நட்சத்திரப் பாதங்கள், விசேஷங்கள், சுப முகூர்த்தங்கள், மற்றும் இருப்பிடத்திற்கு ஏற்ற துல்லிய நேரங்கள்."
                : "Location-calculated event-based daily Panchangam, Nakshatra transitions, planetary positions, rule-based festivals, and 60-year Samvatsara cycle."}
            </p>
          </div>

          {/* Quick Date & Location Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs">
              <MapPin className="ml-1 h-4 w-4 text-rose-500 shrink-0" />
              <select
                value={customLocation ? "custom" : selectedCityIdx}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setCustomLocation(true);
                  } else {
                    setCustomLocation(false);
                    setSelectedCityIdx(Number(e.target.value));
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-2 cursor-pointer"
              >
                {EXTENDED_CITIES.map((c, i) => (
                  <option key={c.name} value={i}>
                    📍 {isTa ? c.nameTa : c.name}
                  </option>
                ))}
                <option value="custom">⚙️ {isTa ? "தனிப்பயன் இடம் (Custom)" : "Custom Location"}</option>
              </select>
            </div>

            {/* Today Button */}
            <button
              type="button"
              onClick={handleToday}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <CalendarDays className="h-4 w-4 text-blue-600" />
              {isTa ? "இன்று" : "Today"}
            </button>
          </div>
        </div>

        {/* Date Selector Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-amber-100/80 pt-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevDay}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 shadow-2xs"
              title={isTa ? "முந்தைய நாள்" : "Previous Day"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selDay}
                min={1}
                max={31}
                onChange={(e) => setSelDay(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
                className="w-14 rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-center text-xs font-black text-slate-900 shadow-2xs focus:border-blue-500 focus:outline-none"
              />
              <select
                value={selMonth}
                onChange={(e) => setSelMonth(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
              >
                {[
                  "ஜனவரி (Jan)", "பிப்ரவரி (Feb)", "மார்ச் (Mar)", "ஏப்ரல் (Apr)", "மே (May)", "ஜூன் (Jun)",
                  "ஜூலை (Jul)", "ஆகஸ்ட் (Aug)", "செப்டம்பர் (Sep)", "அக்டோபர் (Oct)", "நவம்பர் (Nov)", "டிசம்பர் (Dec)"
                ].map((mName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selYear}
                min={1900}
                max={2100}
                onChange={(e) => setSelYear(Number(e.target.value) || 2026)}
                className="w-20 rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-center text-xs font-black text-slate-900 shadow-2xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 shadow-2xs"
              title={isTa ? "அடுத்த நாள்" : "Next Day"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Summary Pill on selected date */}
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-600/10 border border-amber-300 px-3 py-1.5 text-xs font-black text-amber-900">
              🌺 {dayPanchang.tamilDate.monthNameTa} {dayPanchang.tamilDate.day} · {dayPanchang.tamilDate.yearNameTa}
            </span>
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {dayPanchang.weekdayNameTa} ({dayPanchang.date})
            </span>
          </div>
        </div>

        {/* Custom Location Modal if selected */}
        {customLocation && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold text-slate-900 mb-2">
              ⚙️ {isTa ? "தனிப்பயன் அட்சரேகை / தீர்க்கரேகை உள்ளீடு" : "Enter Custom Coordinates"}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold">Place Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat}
                  onChange={(e) => setCustomLat(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLon}
                  onChange={(e) => setCustomLon(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold">Timezone (UTC)</label>
                <input
                  type="number"
                  step="0.5"
                  value={customTz}
                  onChange={(e) => setCustomTz(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Tabs Navigation */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("day")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "day"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar className="mr-1.5 inline-block h-4 w-4" />
          {isTa ? "தினசரி பஞ்சாங்கம் & நாள் விவரங்கள்" : "Day Details & Panchangam"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("month")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "month"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CalendarDays className="mr-1.5 inline-block h-4 w-4" />
          {isTa ? "மாதக் காட்டி (Month Grid)" : "Month Calendar Grid"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cycle")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "cycle"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="mr-1.5 inline-block h-4 w-4" />
          {isTa ? "60 வருட சம்வத்ஸர அட்டவணை" : "60-Year Jovian Cycle"}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAY DETAILS & PANCHANGAM (FLAGSHIP VIEW) */}
      {/* ========================================================================= */}
      {activeTab === "day" && (
        <div className="space-y-6">
          {/* Section A: Basic Day Information Cards */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "தமிழ் தேதி" : "Tamil Date"}
              </span>
              <div className="mt-1 text-base font-black text-amber-700">
                {dayPanchang.tamilDate.monthNameTa} {dayPanchang.tamilDate.day}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {dayPanchang.tamilDate.yearNameTa} ({dayPanchang.tamilDate.samvatsaraNumber})
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "கிழமை & பக்ஷம்" : "Weekday & Paksha"}
              </span>
              <div className="mt-1 text-base font-black text-slate-900">
                {dayPanchang.weekdayNameTa}
              </div>
              <span className="text-[11px] text-indigo-600 font-bold">
                {dayPanchang.dayTithis[0]?.pakshaTa ?? "சுக்ல பக்ஷம்"}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "சூரியோதயம்" : "Sunrise"}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-base font-black text-amber-600">
                <Sun className="h-4 w-4" />
                <span>{dayPanchang.sunriseClock}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeCity.name.split(" ")[0]}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "அஸ்தமனம்" : "Sunset"}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-base font-black text-orange-600">
                <Sun className="h-4 w-4" />
                <span>{dayPanchang.sunsetClock}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isTa ? "மாலை வேளை" : "Evening twilight"}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "சந்திர உதயம்" : "Moonrise"}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-base font-black text-blue-600">
                <Moon className="h-4 w-4" />
                <span>{dayPanchang.moonriseClock}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {dayPanchang.moonPhase.illuminationPercent}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTa ? "சந்திர அஸ்தமனம்" : "Moonset"}
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-base font-black text-slate-700">
                <Moon className="h-4 w-4" />
                <span>{dayPanchang.moonsetClock}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {dayPanchang.moonPhase.phaseNameTa}
              </span>
            </div>
          </section>

          {/* Section B: Visual 24-Hour Day Timeline (00:00 to 23:59) */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  {isTa ? "24 மணி நேர காலக்கோடு (Day Timeline)" : "24-Hour Day Timeline (00:00 — 23:59)"}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {dayPanchang.location.name} (UTC+{dayPanchang.location.tz})
              </span>
            </div>

            {/* Visual Timeline Bar */}
            <div className="relative mt-6 mb-8 pt-4 pb-2">
              {/* 24-Hour Bar Track */}
              <div className="relative h-6 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                {/* Daytime Span */}
                {(() => {
                  const sRise = dayPanchang.timeline.find((t) => t.type === "sunrise")?.fractionOfDay ?? 0.25;
                  const sSet = dayPanchang.timeline.find((t) => t.type === "sunset")?.fractionOfDay ?? 0.75;
                  return (
                    <div
                      className="absolute top-0 bottom-0 bg-amber-100/80 border-l border-r border-amber-300"
                      style={{
                        left: `${sRise * 100}%`,
                        width: `${Math.max(5, (sSet - sRise) * 100)}%`,
                      }}
                      title="Daytime (Sunrise to Sunset)"
                    />
                  );
                })()}

                {/* Rahu Kalam Span */}
                {(() => {
                  const rStart = dayPanchang.timeline.find((t) => t.type === "rahu")?.fractionOfDay ?? 0.4;
                  return (
                    <div
                      className="absolute top-0 bottom-0 bg-rose-400/80"
                      style={{
                        left: `${rStart * 100}%`,
                        width: "6.25%", // ~1.5 hours out of 24
                      }}
                      title="Rahu Kalam"
                    />
                  );
                })()}

                {/* Yamagandam Span */}
                {(() => {
                  const yStart = dayPanchang.timeline.find((t) => t.type === "yama")?.fractionOfDay ?? 0.55;
                  return (
                    <div
                      className="absolute top-0 bottom-0 bg-orange-400/80"
                      style={{
                        left: `${yStart * 100}%`,
                        width: "6.25%",
                      }}
                      title="Yamagandam"
                    />
                  );
                })()}

                {/* Abhijit Muhurtham Span */}
                {(() => {
                  const aStart = dayPanchang.timeline.find((t) => t.type === "abhijit")?.fractionOfDay ?? 0.48;
                  return (
                    <div
                      className="absolute top-0 bottom-0 bg-emerald-400/90"
                      style={{
                        left: `${aStart * 100}%`,
                        width: "3.5%", // ~48 minutes
                      }}
                      title="Abhijit Muhurtham"
                    />
                  );
                })()}
              </div>

              {/* Hour Grid Markers */}
              <div className="relative mt-2 flex justify-between text-[10px] font-mono text-slate-400">
                <span>00:00</span>
                <span>03:00</span>
                <span>06:00</span>
                <span>09:00</span>
                <span>12:00</span>
                <span>15:00</span>
                <span>18:00</span>
                <span>21:00</span>
                <span>23:59</span>
              </div>
            </div>

            {/* Timeline Event Chips */}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {dayPanchang.timeline.map((ev, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                    ev.nature === "auspicious"
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                      : ev.nature === "inauspicious"
                      ? "border-rose-200 bg-rose-50/50 text-rose-950"
                      : "border-slate-200 bg-slate-50/50 text-slate-800"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      ev.nature === "auspicious"
                        ? "bg-emerald-600 text-white"
                        : ev.nature === "inauspicious"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {ev.timeClock.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {isTa ? ev.titleTa : ev.titleEn}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-600 shrink-0">
                        {ev.timeClock}
                      </span>
                    </div>
                    {ev.descTa && (
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                        {isTa ? ev.descTa : ev.descEn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Festivals & Observances (Calculated by Rule Engine) */}
          {dayPanchang.festivals.length > 0 && (
            <section className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-5 shadow-xs sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-amber-950 sm:text-lg">
                  {isTa ? "இன்றைய விசேஷங்கள் & விரதங்கள் (Festivals & Vrathams)" : "Today's Festivals & Observances"}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {dayPanchang.festivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="rounded-2xl border border-amber-200 bg-white p-4 shadow-2xs transition-shadow hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-amber-900">
                        🛕 {isTa ? fest.nameTa : fest.nameEn}
                      </h3>
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                        {fest.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {isTa ? fest.significanceTa : fest.significanceEn}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section D: Panchangam Core (Tithi, Nakshatra, Yoga, Karana, Rasi) */}
          <section className="grid gap-5 lg:grid-cols-2">
            {/* Tithi Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-600" />
                  {isTa ? "திதி (Tithi Details)" : "Tithi Details & Transitions"}
                </h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                  {dayPanchang.dayTithis.length} {isTa ? "திதிகள் இன்று" : "Tithis today"}
                </span>
              </div>

              <div className="space-y-3">
                {dayPanchang.dayTithis.map((t, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-3.5 ${
                      t.isSunriseTithi
                        ? "border-indigo-200 bg-indigo-50/40"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900">
                          {isTa ? t.nameTa : t.nameEn}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-indigo-600">
                          ({t.pakshaTa})
                        </span>
                      </div>
                      {t.isSunriseTithi && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          {isTa ? "உதய திதி" : "Sunrise Tithi"}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 font-mono">
                      <span>{t.startClock}</span>
                      <span className="text-slate-400">──────────▶</span>
                      <span>{t.endClock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nakshatra Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  {isTa ? "நட்சத்திரம் & பாதம் (Nakshatra Details)" : "Nakshatra & Pada Details"}
                </h3>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                  {dayPanchang.dayNakshatras.length} {isTa ? "நட்சத்திரங்கள்" : "Nakshatras"}
                </span>
              </div>

              <div className="space-y-3">
                {dayPanchang.dayNakshatras.map((n, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-3.5 ${
                      n.isSunriseNakshatra
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900">
                          {isTa ? n.nameTa : n.nameEn}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-amber-700">
                          {isTa ? `பாதம் ${n.pada}` : `Pada ${n.pada}`}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {isTa ? "அதிபதி:" : "Lord:"} <strong className="text-slate-800">{isTa ? n.lordTa : n.lord}</strong>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 font-mono">
                      <span>{n.startClock}</span>
                      <span className="text-slate-400">──────────▶</span>
                      <span>{n.endClock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yoga & Karana Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                {isTa ? "யோகம் & கரணம்" : "Yoga & Karana"}
              </h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isTa ? "யோகம் (Yoga)" : "Yoga"}
                  </span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      {isTa ? dayPanchang.dayYogas[0]?.nameTa : dayPanchang.dayYogas[0]?.nameEn}
                    </span>
                    <span className="font-mono text-xs text-slate-600">
                      {dayPanchang.dayYogas[0]?.startClock} – {dayPanchang.dayYogas[0]?.endClock}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isTa ? "கரணம் (Karana)" : "Karana"}
                  </span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      {isTa ? dayPanchang.dayKaranas[0]?.nameTa : dayPanchang.dayKaranas[0]?.nameEn}
                    </span>
                    <span className="font-mono text-xs text-slate-600">
                      {dayPanchang.dayKaranas[0]?.startClock} – {dayPanchang.dayKaranas[0]?.endClock}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rasi & Ingress Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-600" />
                {isTa ? "சந்திர & சூரிய ராசி சஞ்சாரம்" : "Moon & Sun Signs (Rasi)"}
              </h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      🌙 {isTa ? "சந்திர ராசி:" : "Moon Sign:"}
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      {isTa ? dayPanchang.moonRasi.currentSignNameTa : dayPanchang.moonRasi.currentSignNameEn} ({dayPanchang.moonRasi.formattedDMS})
                    </span>
                  </div>
                  {dayPanchang.moonRasi.hasIngressToday && (
                    <div className="mt-1.5 text-[11px] text-amber-700 font-semibold">
                      ⚡ {isTa ? "சஞ்சார நேரம்:" : "Ingress at:"} {dayPanchang.moonRasi.ingressClock} ({isTa ? dayPanchang.moonRasi.nextSignNameTa : dayPanchang.moonRasi.nextSignNameEn})
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      ☀️ {isTa ? "சூரிய ராசி:" : "Sun Sign:"}
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {isTa ? dayPanchang.sunRasi.currentSignNameTa : dayPanchang.sunRasi.currentSignNameEn} ({dayPanchang.sunRasi.formattedDMS})
                    </span>
                  </div>
                  {dayPanchang.sunRasi.hasIngressToday && (
                    <div className="mt-1.5 text-[11px] text-emerald-700 font-semibold">
                      ☀️ {isTa ? "மாதப் பிறப்பு சங்கிராந்தி நேரம்:" : "Solar ingress at:"} {dayPanchang.sunRasi.ingressClock}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section E: Important Timings (Rahu Kalam, Yamagandam, Gulikai, Muhurtham, Gowri) */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              {isTa ? "முக்கிய நல்ல நேரங்கள் & தவிர்க்க வேண்டிய காலங்கள்" : "Auspicious & Inauspicious Timings"}
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  {isTa ? "ராகு காலம்" : "Rahu Kalam"}
                </span>
                <div className="mt-1 font-mono text-sm font-black text-rose-950">
                  {dayPanchang.muhurtha.rahuKalam.startClock} – {dayPanchang.muhurtha.rahuKalam.endClock}
                </div>
                <span className="text-[10px] text-rose-600">{isTa ? "சுப காரியம் தவிர்க்க" : "Avoid auspicious acts"}</span>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                  {isTa ? "எமகண்டம்" : "Yamagandam"}
                </span>
                <div className="mt-1 font-mono text-sm font-black text-orange-950">
                  {dayPanchang.muhurtha.yamagandam.startClock} – {dayPanchang.muhurtha.yamagandam.endClock}
                </div>
                <span className="text-[10px] text-orange-600">{isTa ? "பிரயாணம் தவிர்க்க" : "Avoid journeys"}</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {isTa ? "குளிகை" : "Gulikai"}
                </span>
                <div className="mt-1 font-mono text-sm font-black text-emerald-950">
                  {dayPanchang.muhurtha.gulikai.startClock} – {dayPanchang.muhurtha.gulikai.endClock}
                </div>
                <span className="text-[10px] text-emerald-600">{isTa ? "சுப காரியங்களுக்கு நன்று" : "Good for lasting works"}</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {isTa ? "அபிஜித் முகூர்த்தம்" : "Abhijit Muhurtha"}
                </span>
                <div className="mt-1 font-mono text-sm font-black text-emerald-950">
                  {dayPanchang.muhurtha.abhijit.startClock} – {dayPanchang.muhurtha.abhijit.endClock}
                </div>
                <span className="text-[10px] text-emerald-600">{isTa ? "நண்பகல் மகா சுப நேரம்" : "Auspicious solar midday"}</span>
              </div>
            </div>

            {/* Durmuhurtham, Varjyam, Amrita Kalam */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500">{isTa ? "துர்முஹூர்த்தம்" : "Durmuhurtham"}</span>
                <div className="mt-1 font-mono text-xs font-bold text-slate-800">
                  {dayPanchang.muhurtha.durmuhurtham.map((d) => `${d.startClock} – ${d.endClock}`).join(", ")}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-500">{isTa ? "வர்ஜியம் (தியாக்யம்)" : "Varjyam"}</span>
                <div className="mt-1 font-mono text-xs font-bold text-slate-800">
                  {dayPanchang.muhurtha.varjyam.map((v) => `${v.startClock} – ${v.endClock}`).join(", ")}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <span className="text-[10px] font-bold uppercase text-emerald-700">{isTa ? "அமிர்த காலம்" : "Amrita Kalam"}</span>
                <div className="mt-1 font-mono text-xs font-bold text-emerald-900">
                  {dayPanchang.muhurtha.amritaKalam.map((a) => `${a.startClock} – ${a.endClock}`).join(", ")}
                </div>
              </div>
            </div>

            {/* Gowri Nalla Neram */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2">
                🪔 {isTa ? "கௌரி நல்ல நேரம் (Gowri Panchangam Spans)" : "Gowri Nalla Neram (Day Segments)"}
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                {dayPanchang.muhurtha.gowri.map((g, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-2 text-center text-xs ${
                      g.good
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <div>{g.name}</div>
                    <div className="font-mono text-[10px] mt-0.5">{g.start}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section F: Astronomical Information & 9-Graha Positions */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                {isTa ? "வானியல் கிரக நிலைகள் (நண்பகல் 12:00 நிருபணம்)" : "Astronomical Planetary Positions (Noon Ephemeris)"}
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {isTa ? "திருக்கணிதம்" : "Thirukanitham"} · DE440
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Graha</th>
                    <th className="py-2.5 px-3">Rasi</th>
                    <th className="py-2.5 px-3">Degree (DMS)</th>
                    <th className="py-2.5 px-3">Nakshatra & Pada</th>
                    <th className="py-2.5 px-3">Motion / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {dayPanchang.planets.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {isTa ? p.nameTa : p.nameEn}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                        {isTa ? p.signNameTa : p.signNameEn}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{p.formattedDMS}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">
                        {isTa ? p.nakshatraNameTa : p.nakshatraNameEn} ({isTa ? `பாதம் ${p.pada}` : `P${p.pada}`})
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {p.retrograde ? (
                          <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                            {isTa ? "வக்ரம் (R)" : "Retrograde"}
                          </span>
                        ) : p.combust ? (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            {isTa ? "அஸ்தமனம் (C)" : "Combust"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">{isTa ? "நேர்கதி" : "Direct"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTH CALENDAR GRID */}
      {/* ========================================================================= */}
      {activeTab === "month" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                📅 {isTa ? "மாதக் காலண்டர் கட்டம்" : "Monthly Calendar Grid"}
              </h2>
              <p className="text-xs text-slate-500">
                {isTa
                  ? "எந்த நாளையும் கிளிக் செய்து அன்றைய முழு பஞ்சாங்கம் மற்றும் விபரங்களைக் காணலாம்."
                  : "Click any date cell to view its complete daily Panchangam and timeline."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (selMonth === 1) {
                    setSelMonth(12);
                    setSelYear(selYear - 1);
                  } else {
                    setSelMonth(selMonth - 1);
                  }
                }}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold text-sm text-slate-800 px-2">
                {selMonth} / {selYear}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selMonth === 12) {
                    setSelMonth(1);
                    setSelYear(selYear + 1);
                  } else {
                    setSelMonth(selMonth + 1);
                  }
                }}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-500 mb-2">
            {["ஞாயிறு (Sun)", "திங்கள் (Mon)", "செவ்வாய் (Tue)", "புதன் (Wed)", "வியாழன் (Thu)", "வெள்ளி (Fri)", "சனி (Sat)"].map(
              (w, i) => (
                <div key={i} className="py-2 rounded-lg bg-slate-50 text-[11px]">
                  {w}
                </div>
              )
            )}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {monthGridDays.map((dObj, idx) => {
              if (!dObj) {
                return <div key={idx} className="h-24 rounded-xl bg-slate-50/30 border border-transparent" />;
              }
              const isSelected = dObj.date === dayPanchang.date;
              const hasFestival = dObj.festivals.length > 0;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const parts = dObj.date.split("-");
                    setSelDay(Number(parts[2]));
                    setActiveTab("day");
                  }}
                  className={`h-24 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all hover:border-amber-400 hover:shadow-2xs ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-black text-slate-900">
                      {dObj.date.split("-")[2]}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1 py-0.2 rounded">
                      {dObj.tamilDate.day}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate">
                    {dObj.dayNakshatras[0]?.nameTa}
                  </div>

                  {hasFestival ? (
                    <div className="truncate rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold text-amber-900">
                      🛕 {dObj.festivals[0]?.nameTa.split(" ")[0]}
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-400 truncate">
                      {dObj.dayTithis[0]?.nameTa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 60-YEAR JOVIAN SAMVATSARA TABLE */}
      {/* ========================================================================= */}
      {activeTab === "cycle" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                🪐 {isTa ? "60 தமிழ் வருட சம்வத்ஸர முழு அட்டவணை" : "60-Year Jovian Samvatsara Cycle"}
              </h2>
              <p className="text-xs text-slate-500">
                {isTa
                  ? "பிரபவ முதல் அட்சய வரையிலான 60 சம்வத்ஸர வருடங்களின் ஆங்கில வருட ஒப்பீடு மற்றும் சித்திரை 1 தேதிகள்."
                  : "Complete 60-year cycle anchored at Prabhava (1987 CE) with Chithirai 1 solar ingress dates."}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={cycleSearchQuery}
                onChange={(e) => setCycleSearchQuery(e.target.value)}
                placeholder={isTa ? "வருடத்தைத் தேடுக..." : "Search year or name..."}
                className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs"
              />
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCycleRecords.map((r) => (
              <div
                key={r.cycleNumber}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 transition-colors hover:bg-white hover:border-amber-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700">#{r.cycleNumber}</span>
                    <h3 className="text-sm font-bold text-slate-900">{r.tamilYearNameTa}</h3>
                    <span className="text-[11px] text-slate-500">{r.tamilYearNameEn}</span>
                  </div>
                  <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">
                    {r.gregorianStartYear}–{r.gregorianEndYear}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-100 pt-1.5 flex items-center justify-between">
                  <span>சித்திரை 1:</span>
                  <strong className="font-mono">{r.chithirai1}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
