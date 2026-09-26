import { ArrowRight, CalendarDays, HeartHandshake, ScrollText } from "lucide-react";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";

const SIGNS_TA = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
const SIGNS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const GRID: (number | null)[] = [
  11, 0, 1, 2,
  10, null, null, 3,
  9, null, null, 4,
  8, 7, 6, 5,
];

const SAMPLE: Record<number, string> = {
  0: "சூரி",
  1: "சந்",
  4: "லக்",
  6: "குரு",
  8: "சனி",
};

export function HomeHeroPreview({ lang }: { lang: Lang }) {
  const isTa = lang === "ta";
  const { go } = useNav();
  const names = isTa ? SIGNS_TA : SIGNS_EN;

  return (
    <div className="relative hidden lg:flex flex-col gap-3">
      <div className="rounded-2xl border border-accent/20 bg-surface p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <ScrollText className="size-4 text-accent" />
            {isTa ? "தென் இந்திய ராசி கட்டம்" : "South-Indian Rasi"}
          </div>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
            {isTa ? "மாதிரி" : "Sample"}
          </span>
        </div>
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-border bg-elevated">
          {GRID.map((sign, i) =>
            sign === null ? (
              <div
                key={`c-${i}`}
                className="flex min-h-[58px] items-center justify-center bg-surface text-[10px] font-semibold text-muted"
              >
                {i === 5 ? (isTa ? "கோட்பேக்ர்" : "Codepackr") : ""}
              </div>
            ) : (
              <div
                key={sign}
                className="min-h-[58px] border-border border-r border-b bg-surface p-1.5 last:border-r-0"
              >
                <div className="text-[9px] font-bold uppercase tracking-wide text-muted">
                  {names[sign]}
                </div>
                {SAMPLE[sign] ? (
                  <div className="mt-1 text-[11px] font-bold text-accent">{SAMPLE[sign]}</div>
                ) : null}
              </div>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => go("jathagam")}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          {isTa ? "உங்கள் ஜாதகம் பார்க்க" : "Open your chart"}
          <ArrowRight className="size-3" />
        </button>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-surface p-4 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <CalendarDays className="size-4 text-accent" />
            {isTa ? "இன்றைய பஞ்சாங்கம்" : "Today's Panchangam"}
          </div>
          <span className="text-[10px] font-bold text-gold">{isTa ? "நிகழ்வு அடிப்படையில்" : "Event-based"}</span>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-elevated px-2.5 py-2">
            <dt className="text-muted">{isTa ? "திதி" : "Tithi"}</dt>
            <dd className="font-bold text-ink">{isTa ? "கிருஷ்ண பக்ஷம்" : "Krishna paksha"}</dd>
          </div>
          <div className="rounded-lg bg-elevated px-2.5 py-2">
            <dt className="text-muted">{isTa ? "நட்சத்திரம்" : "Nakshatra"}</dt>
            <dd className="font-bold text-ink">{isTa ? "உங்கள் ஊருக்கு" : "For your place"}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => go("tamil-calendar")}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          {isTa ? "தமிழ் காலண்டர் திறக்க" : "Open Tamil calendar"}
          <ArrowRight className="size-3" />
        </button>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-surface px-4 py-3 shadow-card">
        <button
          type="button"
          onClick={() => go("porutham")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-ink">
            <HeartHandshake className="size-4 text-accent" />
            {isTa ? "10 பொருத்தம் — உத்தமம் / மத்தியமம் / அதமம்" : "10 Poruthams — Uthamam / Madhimam / Athamam"}
          </span>
          <ArrowRight className="size-4 text-accent" />
        </button>
      </div>
    </div>
  );
}
