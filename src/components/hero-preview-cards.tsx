// Codepackr Astro — Floating Staggered Hero Preview Cards with Auto-Rotation
import React, { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import {
  ScrollText,
  HeartHandshake,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Moon,
  Orbit,
  UserCheck,
  Sparkle,
  Hourglass,
  Baby,
  Binary,
  HelpCircle,
  ArrowRight,
  Compass,
  CheckCircle2,
} from "lucide-react";
import type { Lang } from "@/lib/astro/i18n";
import { useNav, type Page } from "@/lib/nav";

// 1. Data Pool Schema
export interface HeroPreviewCard {
  id: string;
  title: string;
  badge: string;
  badgeTone: "brand" | "teal" | "purple" | "blue" | "amber" | "emerald";
  icon: React.ComponentType<{ className?: string }>;
  body: React.ReactNode;
  footerLeft: string;
  cta: string;
  targetId?: string; // tool ID, slug, or route
}

// 2. Reusable Mini Graphical Helpers
export function MiniProgressRing({
  percent,
  size = 38,
  strokeWidth = 3.5,
  color = "#9a3412",
  label,
  sublabel,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700/60"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          {Math.round(percent)}%
        </span>
      </div>
      {label && (
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
            {label}
          </span>
          {sublabel && (
            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface SegmentItem {
  label: string;
  value: number;
  color: string;
}

export function MiniSegmentedBar({
  segments,
  total,
}: {
  segments: SegmentItem[];
  total?: number;
}) {
  const sum = total || segments.reduce((acc, s) => acc + s.value, 0) || 1;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 gap-0.5 p-0.5">
        {segments.map((seg, i) => {
          const pct = Math.max(6, (seg.value / sum) * 100);
          return (
            <div
              key={i}
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${seg.value}`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 dark:text-slate-300">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-500 dark:text-slate-400">{seg.label}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniSparkline({
  data,
  color = "#9a3412",
  label,
  badgeText,
  width = 110,
  height = 28,
}: {
  data: number[];
  color?: string;
  label?: string;
  badgeText?: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;
  const usableHeight = height - padding * 2;
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - padding - ((d - min) / range) * usableHeight;
    return { x, y };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    linePath += ` Q ${curr.x} ${curr.y}, ${midX} ${(curr.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  linePath += ` T ${last.x} ${last.y}`;

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${Math.round(data[0] || 0)}`;

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex flex-col min-w-0">
        {label && (
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
            {label}
          </span>
        )}
        {badgeText && (
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {badgeText}
          </span>
        )}
      </div>
      <div className="relative shrink-0 overflow-hidden" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} className="animate-fade-chart-area" />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />
        </svg>
      </div>
    </div>
  );
}

export function MiniComparisonPills({
  items,
}: {
  items: { label: string; highlight?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 w-full">
      {items.map((item, idx) => (
        <span
          key={idx}
          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors ${
            item.highlight
              ? "bg-amber-100/90 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200"
              : "bg-white/80 border-slate-200 text-slate-700 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300"
          }`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

// Tone styling presets
const BADGE_TONE_STYLES: Record<
  HeroPreviewCard["badgeTone"],
  { badge: string; iconBg: string; iconColor: string }
> = {
  brand: {
    badge:
      "bg-orange-50 text-orange-800 border-orange-200/90 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60",
    iconBg: "bg-orange-100 dark:bg-orange-950/60",
    iconColor: "text-orange-700 dark:text-orange-400",
  },
  emerald: {
    badge:
      "bg-emerald-50 text-emerald-800 border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
    iconColor: "text-emerald-700 dark:text-emerald-400",
  },
  teal: {
    badge:
      "bg-teal-50 text-teal-800 border-teal-200/90 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
    iconBg: "bg-teal-100 dark:bg-teal-950/60",
    iconColor: "text-teal-700 dark:text-teal-400",
  },
  purple: {
    badge:
      "bg-purple-50 text-purple-800 border-purple-200/90 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-700 dark:text-purple-400",
  },
  blue: {
    badge:
      "bg-blue-50 text-blue-800 border-blue-200/90 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-700 dark:text-blue-400",
  },
  amber: {
    badge:
      "bg-amber-50 text-amber-800 border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconColor: "text-amber-700 dark:text-amber-400",
  },
};

// 3. Rotating Pool of 16 Authentic Cards Tailored to the Astro Domain
export function getHeroPreviewCards(isTa: boolean): HeroPreviewCard[] {
  return [
    {
      id: "jathagam",
      title: isTa ? "தென் இந்திய ராசி & நவாம்சம்" : "Thirukanitham Lagna & Rasi",
      badge: isTa ? "உடனடி HD" : "Instant HD",
      badgeTone: "brand",
      icon: ScrollText,
      body: (
        <MiniProgressRing
          percent={98}
          color="#9a3412"
          label={isTa ? "நாசா JPL கணிதப் பொருத்தம்" : "Ephemeris Match Rate"}
          sublabel={isTa ? "DE440 • 0.001° துல்லியம்" : "NASA DE440 • 0.001° Accuracy"}
        />
      ),
      footerLeft: isTa ? "100% தனிநபர் பாதுகாப்பு • உடனடி கணிப்பு" : "100% private • Instant calculation",
      cta: isTa ? "ஜாதகம் கணிக்க" : "Generate Chart",
      targetId: "jathagam",
    },
    {
      id: "porutham",
      title: isTa ? "10 திருமணப் பொருத்தங்கள்" : "10-Factor Porutham Analysis",
      badge: isTa ? "8.5 / 10 உத்தமம்" : "8.5 / 10 Match",
      badgeTone: "emerald",
      icon: HeartHandshake,
      body: (
        <MiniSegmentedBar
          segments={[
            { label: isTa ? "உத்தமம்" : "Uthamam", value: 7, color: "#10b981" },
            { label: isTa ? "மத்திமம்" : "Madhimam", value: 2, color: "#f59e0b" },
            { label: isTa ? "அதமம்" : "Athamam", value: 1, color: "#ef4444" },
          ]}
        />
      ),
      footerLeft: isTa ? "ரஜ்ஜு & வேதை சரிபார்ப்பு • பாரம்பரியம்" : "Rajju & Vedha verified • Vedic rules",
      cta: isTa ? "பொருத்தம் பார்க்க" : "Check Match",
      targetId: "porutham",
    },
    {
      id: "panchangam",
      title: isTa ? "நேரலை தமிழ் பஞ்சாங்கம்" : "Live Vedic Panchangam",
      badge: isTa ? "இன்று" : "Today",
      badgeTone: "amber",
      icon: CalendarDays,
      body: (
        <MiniComparisonPills
          items={[
            { label: isTa ? "கிருஷ்ண பக்ஷம்" : "Krishna Paksha", highlight: true },
            { label: isTa ? "ரோகிணி பாதம் 2" : "Rohini Pada 2" },
            { label: isTa ? "சோபன யோகம்" : "Shobhana Yoga" },
          ]}
        />
      ),
      footerLeft: isTa ? "சூரியோதய அடிப்படையில் • நிகழ்வு நேரம்" : "Local solar sunrise • Microsecond sync",
      cta: isTa ? "காலண்டர் திறக்க" : "Open Calendar",
      targetId: "tamil-calendar",
    },
    {
      id: "forecast",
      title: isTa ? "60 ஆண்டு தசா-புத்தி காலவரிசை" : "60-Year Dasa Trajectory",
      badge: isTa ? "குரு தசை" : "Jupiter Era",
      badgeTone: "purple",
      icon: TrendingUp,
      body: (
        <MiniSparkline
          data={[28, 42, 55, 68, 85, 78, 92]}
          color="#8b5cf6"
          label={isTa ? "தசா பலம் & சுப சஞ்சாரம்" : "Vimshottari Strength"}
          badgeText={isTa ? "+32% யோக காலம்" : "+32% Auspicious"}
        />
      ),
      footerLeft: isTa ? "16 வாழ்க்கைத் துறைகள் • கோச்சார பலன்" : "16 Life domains • Planetary transitions",
      cta: isTa ? "பலன்கள் அறிய" : "Explore Forecast",
      targetId: "forecast",
    },
    {
      id: "ephemeris",
      title: isTa ? "நாசா JPL DE440 இயற்பியல் மாதிரி" : "NASA JPL DE440 Orbitals",
      badge: isTa ? "0.001வி துல்லியம்" : "0.001s Accuracy",
      badgeTone: "blue",
      icon: ShieldCheck,
      body: (
        <MiniProgressRing
          percent={99.9}
          color="#2563eb"
          label={isTa ? "VSOP87 கோள் சுழற்சி மாதிரி" : "VSOP87 Planetary Engine"}
          sublabel={isTa ? "0.00° விலகல் இல்லாத துல்லியம்" : "0.00° Zero Calculation Drift"}
        />
      ),
      footerLeft: isTa ? "AI இல்லாத வெளிப்படைத்தன்மை • உண்மை அறிவியல்" : "Client-side Astronomy • Pure Science",
      cta: isTa ? "கணித முறை பார்க்க" : "View Methods",
      targetId: "calculation-method",
    },
    {
      id: "rasipalan",
      title: isTa ? "சந்திர சஞ்சார தினசரி ராசிபலன்" : "Moon Transit Rasi Palan",
      badge: isTa ? "12 ராசிகள்" : "12 Signs",
      badgeTone: "teal",
      icon: Sparkles,
      body: (
        <MiniSparkline
          data={[45, 60, 52, 74, 88, 70, 82]}
          color="#0d9488"
          label={isTa ? "சந்திர பலம் & யோக நிலை" : "Chandra Balam Index"}
          badgeText={isTa ? "உயர் அதிர்ஷ்டம்" : "High Favorable"}
        />
      ),
      footerLeft: isTa ? "தினசரி புதுப்பிப்பு • கிரகப் பார்வை" : "Updated daily • Planetary aspects",
      cta: isTa ? "ராசிபலன் படிக்க" : "Read Forecast",
      targetId: "rasipalan",
    },
    {
      id: "chandrashtama",
      title: isTa ? "சந்திராஷ்டம நாட்கள் கால்குலேட்டர்" : "Chandrashtama Warning Days",
      badge: isTa ? "பாதுகாப்பான நாட்கள்" : "Safe Window",
      badgeTone: "emerald",
      icon: Moon,
      body: (
        <MiniComparisonPills
          items={[
            { label: isTa ? "8-ஆம் இட சந்திரன்" : "8th House Moon", highlight: true },
            { label: isTa ? "2.25 நாட்கள் சஞ்சாரம்" : "2.25 Days Cycle" },
            { label: isTa ? "எச்சரிக்கை காலம்" : "Caution Period" },
          ]}
        />
      ),
      footerLeft: isTa ? "பயணம் மற்றும் முக்கிய ஒப்பந்த எச்சரிக்கை" : "Plan journeys & vital agreements",
      cta: isTa ? "தேதிகள் பார்க்க" : "Check Dates",
      targetId: "chandrashtama",
    },
    {
      id: "gochara",
      title: isTa ? "குரு & சனி கோச்சாரப் பெயர்ச்சி" : "Jupiter & Saturn Gochara",
      badge: isTa ? "நேரலை பெயர்ச்சி" : "Active Transit",
      badgeTone: "amber",
      icon: Orbit,
      body: (
        <MiniSegmentedBar
          segments={[
            { label: isTa ? "சுபம்" : "Benefic", value: 65, color: "#10b981" },
            { label: isTa ? "சமம்" : "Neutral", value: 20, color: "#3b82f6" },
            { label: isTa ? "அசுபம்" : "Malefic", value: 15, color: "#f59e0b" },
          ]}
        />
      ),
      footerLeft: isTa ? "குரு பெயர்ச்சி • சனி பெயர்ச்சி பலன்கள்" : "Guru & Sani Peyarchi impacts",
      cta: isTa ? "கோச்சாரம் கணிக்க" : "Analyze Transit",
      targetId: "gochara",
    },
    {
      id: "biodata",
      title: isTa ? "ஜாதக வரன் குறிப்பு (Astro Biodata)" : "Matrimonial Astro Biodata",
      badge: isTa ? "HD PDF அச்சு" : "Export PDF",
      badgeTone: "brand",
      icon: UserCheck,
      body: (
        <MiniProgressRing
          percent={100}
          color="#ea580c"
          label={isTa ? "ராசி & நவாம்ச கட்டங்களுடன்" : "Full Charts Embedded"}
          sublabel={isTa ? "300 DPI பிரிண்ட் தரம்" : "300 DPI Print Quality"}
        />
      ),
      footerLeft: isTa ? "நேர்த்தியான தமிழ் வடிவமைப்பு • Instant PDF" : "Professional layout • Instant export",
      cta: isTa ? "பயோடேட்டா செய்ய" : "Build Biodata",
      targetId: "biodata",
    },
    {
      id: "nakshatra",
      title: isTa ? "27 நட்சத்திரங்கள் & பாத விவரங்கள்" : "27 Nakshatras & Pada Guide",
      badge: isTa ? "வேத விண்மீன்கள்" : "Vedic Stars",
      badgeTone: "purple",
      icon: Sparkle,
      body: (
        <MiniComparisonPills
          items={[
            { label: isTa ? "அதிபதி & தெய்வம்" : "Lords & Deities", highlight: true },
            { label: isTa ? "கணம் & யோனி" : "Gana & Yoni" },
            { label: isTa ? "விருட்சம் & பறவை" : "Tree & Animal" },
          ]}
        />
      ),
      footerLeft: isTa ? "பாத வாரியான குணாதிசயங்கள் & எழுத்துக்கள்" : "In-depth syllable & spiritual traits",
      cta: isTa ? "நட்சத்திரம் அறிய" : "Browse Stars",
      targetId: "nakshatra",
    },
    {
      id: "nazhigai",
      title: isTa ? "நாழிகை மாற்றி (கடிகாரம் ↔ நாழிகை)" : "Traditional Nazhigai Clock",
      badge: isTa ? "60 நாழிகைகள்" : "60 Nazhigai",
      badgeTone: "blue",
      icon: Hourglass,
      body: (
        <MiniProgressRing
          percent={75}
          color="#0284c7"
          label={isTa ? "1 நாழிகை = 24 நிமிடங்கள்" : "1 Nazhigai = 24 Mins"}
          sublabel={isTa ? "உள்ளூர் சூரிய உதயம் அடிப்படையில்" : "Local Sunrise Synchronization"}
        />
      ),
      footerLeft: isTa ? "பாரம்பரிய தமிழ் காலக்கணிப்பு" : "Classical Tamil solar clock converter",
      cta: isTa ? "நேரம் மாற்ற" : "Convert Time",
      targetId: "nazhigai",
    },
    {
      id: "babynames",
      title: isTa ? "நட்சத்திர குழந்தை பெயர்கள்" : "Astro Baby Name Generator",
      badge: isTa ? "பாத எழுத்துக்கள்" : "Pada Syllables",
      badgeTone: "teal",
      icon: Baby,
      body: (
        <MiniComparisonPills
          items={[
            { label: isTa ? "சு, சே, சோ, லா..." : "Chu, Che, Cho, La", highlight: true },
            { label: isTa ? "பாரம்பரியம்" : "Traditional" },
            { label: isTa ? "நவீன தமிழ்ப் பெயர்கள்" : "Modern Tamil" },
          ]}
        />
      ),
      footerLeft: isTa ? "பிறப்பு நட்சத்திர பாதம் சார்ந்த பெயர்கள்" : "Curated Vedic phonetics & pure meanings",
      cta: isTa ? "பெயர்கள் தேட" : "Find Names",
      targetId: "babynames",
    },
    {
      id: "numerology",
      title: isTa ? "சால்டியன் எண் கணிதம் (நியூமராலஜி)" : "Chaldean Numerology",
      badge: isTa ? "விதி எண்" : "Life Path",
      badgeTone: "brand",
      icon: Binary,
      body: (
        <MiniSegmentedBar
          segments={[
            { label: isTa ? "பிறவி எண் 7" : "Driver 7", value: 45, color: "#9a3412" },
            { label: isTa ? "விதி எண் 3" : "Conductor 3", value: 35, color: "#d97706" },
            { label: isTa ? "பெயர் எண் 1" : "Name 1", value: 20, color: "#10b981" },
          ]}
        />
      ),
      footerLeft: isTa ? "வணிகம் மற்றும் பெயர்ப் பொருத்தம்" : "Lucky numbers & destiny alignment",
      cta: isTa ? "எண் கணிக்க" : "Calculate Score",
      targetId: "numerology",
    },
    {
      id: "prasna",
      title: isTa ? "சோழி பிரச்னம் (Prasna Arudham)" : "Prasna Horary Astrology",
      badge: isTa ? "உடனடி ஆருடம்" : "Instant Arudha",
      badgeTone: "amber",
      icon: HelpCircle,
      body: (
        <MiniSparkline
          data={[50, 65, 80, 75, 90, 85, 95]}
          color="#d97706"
          label={isTa ? "பிரச்ன ஆருட தெளிவு" : "Question Alignment"}
          badgeText={isTa ? "சுப லக்னம்" : "Auspicious"}
        />
      ),
      footerLeft: isTa ? "கேள்வி கேட்கும் நேரத்தின் நேரலை கிரக நிலை" : "Instantaneous astrological consultation",
      cta: isTa ? "ஆருடம் பார்க்க" : "Consult Arudha",
      targetId: "prasna",
    },
    {
      id: "navamsha",
      title: isTa ? "நவாம்சம் (D9) ஹார்மோனிக் கட்டம்" : "Navamsha D9 Harmonic Chart",
      badge: isTa ? "வர்க்க D9" : "Harmonic D9",
      badgeTone: "purple",
      icon: ScrollText,
      body: (
        <MiniProgressRing
          percent={94}
          color="#9333ea"
          label={isTa ? "வர்க்கோத்தம கிரக பலம்" : "Vargottama Planets"}
          sublabel={isTa ? "தர்மம் & திருமண வாழ்க்கை பலன்" : "Dharma & Marital Destiny Fruit"}
        />
      ),
      footerLeft: isTa ? "16 வர்க்க கட்டங்கள் • ஆழமான ஆய்வு" : "Divisional charts • Spiritual core",
      cta: isTa ? "நவாம்சம் பார்க்க" : "View Navamsha",
      targetId: "jathagam",
    },
    {
      id: "astro-validation",
      title: isTa ? "வானியல் ஆய்வக பெஞ்ச்மார்க்" : "Celestial Benchmarks",
      badge: isTa ? "50+ சோதனைகள்" : "50+ Tests Pass",
      badgeTone: "emerald",
      icon: ShieldCheck,
      body: (
        <MiniSegmentedBar
          segments={[
            { label: "VSOP87", value: 30, color: "#10b981" },
            { label: "ELP2000", value: 30, color: "#059669" },
            { label: "JPL DE440", value: 40, color: "#047857" },
          ]}
        />
      ),
      footerLeft: isTa ? "ஸ்விஸ் எஃபிமெரிஸ் ஒப்பீடு • Zero Drift" : "Zero drift against Swiss Ephemeris",
      cta: isTa ? "சோதனை பார்க்க" : "Run Benchmarks",
      targetId: "astro-validation",
    },
  ];
}

// Staggered margin and organic floating animation configurations for the 3 slots
const SLOT_CONFIGS = [
  { marginClass: "ml-4", floatClass: "animate-float-card-1" },
  { marginClass: "mr-2", floatClass: "animate-float-card-2" },
  { marginClass: "ml-6", floatClass: "animate-float-card-3" },
];

export interface HeroPreviewCardsProps {
  lang?: Lang;
  className?: string;
  onSelect?: (card: HeroPreviewCard) => void;
}

export function HeroPreviewCards({
  lang = "en",
  className = "",
  onSelect,
}: HeroPreviewCardsProps) {
  const isTa = lang === "ta";
  const { go } = useNav();
  const cardPool = useMemo(() => getHeroPreviewCards(isTa), [isTa]);

  // 3 independent slots initialized to distinct cards
  const [slotIndices, setSlotIndices] = useState<number[]>([0, 1, 2]);
  const [fadingSlots, setFadingSlots] = useState<Record<number, boolean>>({});
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // References for safe access inside timer callbacks
  const slotIndicesRef = useRef(slotIndices);
  slotIndicesRef.current = slotIndices;

  const hoveredSlotRef = useRef<number | null>(null);
  hoveredSlotRef.current = hoveredSlot;

  const cardPoolRef = useRef(cardPool);
  cardPoolRef.current = cardPool;

  const isReducedMotionRef = useRef(false);

  // Track reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = media.matches;

    const listener = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Auto-Rotation Engine:
  // Each slot rotates independently with a staggered initial offset and base interval ~6.0s
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Slot 0 starts at T=0, Slot 1 at T+1.9s, Slot 2 at T+3.8s
    const offsets = [0, 1900, 3800];
    const baseInterval = 6000;
    const timers: ReturnType<typeof setTimeout>[] = [];

    [0, 1, 2].forEach((slotIdx) => {
      const initialDelay = offsets[slotIdx] + baseInterval;

      const scheduleRotation = (delay: number) => {
        const timerId = setTimeout(() => {
          // Pause guards: reduced motion, tab backgrounded, or slot hovered
          if (
            isReducedMotionRef.current ||
            document.visibilityState !== "visible" ||
            hoveredSlotRef.current === slotIdx ||
            hoveredSlotRef.current !== null
          ) {
            // Re-check after 1s if paused
            scheduleRotation(1000);
            return;
          }

          // 1. Smooth cross-fade: 180ms fade-out
          setFadingSlots((prev) => ({ ...prev, [slotIdx]: true }));

          setTimeout(() => {
            // 2. Update card index with Collision Avoidance
            setSlotIndices((prevSlots) => {
              const currentCardIdx = prevSlots[slotIdx];
              const pool = cardPoolRef.current;
              // IDs currently visible in the OTHER two active slots
              const activeOtherIds = new Set(
                prevSlots
                  .filter((_, idx) => idx !== slotIdx)
                  .map((idx) => pool[idx]?.id)
              );

              let nextCandidate = (currentCardIdx + 1) % pool.length;
              let attempts = 0;
              while (
                activeOtherIds.has(pool[nextCandidate]?.id) &&
                attempts < pool.length
              ) {
                nextCandidate = (nextCandidate + 1) % pool.length;
                attempts++;
              }

              const newSlots = [...prevSlots];
              newSlots[slotIdx] = nextCandidate;
              return newSlots;
            });

            // 3. 40ms later, fade-in
            setTimeout(() => {
              setFadingSlots((prev) => ({ ...prev, [slotIdx]: false }));
            }, 40);
          }, 180);

          // Schedule next iteration for this slot
          scheduleRotation(baseInterval);
        }, delay);

        timers.push(timerId);
      };

      scheduleRotation(initialDelay);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleCardClick = (card: HeroPreviewCard) => {
    if (onSelect) {
      onSelect(card);
    } else if (card.targetId) {
      go(card.targetId as Page);
    }
  };

  return (
    <div
      className={`hero-floating-cards relative hidden lg:flex flex-col gap-3.5 w-full select-none ${className}`}
    >
      {/* Ambient glowing radial gradient blur behind cards */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-800/15 via-amber-500/10 to-orange-700/15 rounded-3xl blur-2xl pointer-events-none opacity-80" />

      {/* 3 Stacked Floating Cards with Staggered Margins */}
      {[0, 1, 2].map((slotIdx) => {
        const cardIndex = slotIndices[slotIdx] ?? slotIdx;
        const card = cardPool[cardIndex] || cardPool[0];
        const isFading = !!fadingSlots[slotIdx];
        const config = SLOT_CONFIGS[slotIdx];
        const toneStyle = BADGE_TONE_STYLES[card.badgeTone] || BADGE_TONE_STYLES.brand;
        const IconComponent = card.icon;

        return (
          <div
            key={`slot-${slotIdx}`}
            onMouseEnter={() => setHoveredSlot(slotIdx)}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => handleCardClick(card)}
            className={`relative z-10 ${config.marginClass} ${config.floatClass}`}
          >
            <div
              className={`p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-800/25 dark:border-amber-600/30 shadow-xl hover:shadow-2xl hover:scale-[1.035] hover:border-amber-800 dark:hover:border-amber-500 transition-all min-h-[148px] cursor-pointer group flex flex-col justify-between ${
                isFading
                  ? "opacity-0 scale-[0.99] translate-y-1 duration-180"
                  : "opacity-100 scale-100 translate-y-0 duration-300"
              } ease-out`}
            >
              {/* Card Header: Icon, Title, Badge */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${toneStyle.iconBg} ${toneStyle.iconColor} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComponent className="size-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
                    {card.title}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shrink-0 ${toneStyle.badge}`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Card Body: Elevated block with micro-visual component */}
              <div className="my-2 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 px-3 py-2 border border-slate-100/90 dark:border-slate-800/80 flex items-center min-h-[46px] shadow-2xs">
                {card.body}
              </div>

              {/* Card Footer: Left Context Note + Right CTA Arrow */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[65%]">
                  {card.footerLeft}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors shrink-0">
                  <span>{card.cta}</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
