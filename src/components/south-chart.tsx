// Codepackr Astro - South Indian Rasi & Navamsa Chart Grid
import { PLANETS, SIGNS_SHORT_EN, SIGNS_SHORT_TA, type PlanetId } from "@/lib/astro/constants";
import type { BodyPos } from "@/lib/astro/engine";
import type { Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";

const SOUTH: (number | null)[] = [11, 0, 1, 2, 10, null, null, 3, 9, null, null, 4, 8, 7, 6, 5];

const PLANET_MAP = Object.fromEntries(PLANETS.map((p) => [p.id, p]));

export function SouthChart({
  positions,
  lang,
  mode = "sign",
  caption,
  theme = "light",
}: {
  positions: BodyPos[];
  lang: Lang;
  mode?: "sign" | "navamsa";
  caption?: string;
  theme?: "dark" | "light";
}) {
  const bySign: BodyPos[][] = Array.from({ length: 12 }, () => []);
  for (const p of positions) {
    const s = mode === "navamsa" ? p.navamsa : p.sign;
    bySign[s].push(p);
  }
  const lagna = positions.find((p) => p.id === "lagna");
  const moon = positions.find((p) => p.id === "moon");
  const lagnaSign = lagna ? (mode === "navamsa" ? lagna.navamsa : lagna.sign) : -1;
  const moonSign = moon ? (mode === "navamsa" ? moon.navamsa : moon.sign) : -1;
  const shorts = lang === "ta" ? SIGNS_SHORT_TA : SIGNS_SHORT_EN;

  return (
    <div
      className={cn(
        "south-chart relative overflow-hidden rounded-md border-2 border-accent/30 bg-surface text-fg shadow-xs print:border-ink print:bg-white print:text-ink",
      )}
    >
      {SOUTH.map((sign, i) => {
        if (sign === null) {
          return (
            <div
              key={i}
              className="bg-[#faf6ee] print:bg-white"
            />
          );
        }
        const isLagna = sign === lagnaSign;
        const isMoon = sign === moonSign;
        return (
          <div
            key={i}
            className={cn(
              "relative min-h-0 overflow-hidden border-r border-b border-accent/25 p-1 print:border-ink",
              isMoon && "bg-amber-50/80 print:bg-gray-100",
              isLagna && "bg-accent/5 ring-2 ring-accent/60 ring-inset print:ring-ink",
            )}
          >
            <span
              className="absolute top-0.5 right-1 font-display text-[10px] font-semibold text-muted tracking-wide sm:text-xs print:text-ink"
            >
              {shorts[sign]}
            </span>
            {lagnaSign >= 0 ? (
              <span
                className="absolute bottom-0.5 left-1 text-[10px] font-semibold text-accent/70 tabular-nums sm:text-xs print:text-ink/60"
              >
                {((sign - lagnaSign + 12) % 12) + 1}
              </span>
            ) : null}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap gap-0.5">
              {bySign[sign].map((p) => {
                const meta = PLANET_MAP[p.id];
                const label = lang === "ta" ? meta.shortTa : meta.glyph;
                const isMoonP = p.id === "moon";
                const isLagnaP = p.id === "lagna";
                return (
                  <span
                    key={p.id}
                    title={lang === "ta" ? meta.ta : meta.en}
                    className={cn(
                      "rounded px-1 py-px text-[11px] leading-3.5 font-medium sm:text-xs sm:leading-4",
                      isLagnaP
                        ? "bg-accent text-accent-fg font-bold shadow-xs print:border print:border-ink print:bg-transparent print:text-ink"
                        : isMoonP
                          ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold print:border print:border-ink print:bg-transparent print:text-ink"
                          : "bg-elevated/90 text-fg border border-border/80 print:border print:border-ink/40 print:bg-transparent print:text-ink",
                    )}
                  >
                    {label}
                    {p.retrograde && p.id !== "rahu" && p.id !== "ketu" && p.id !== "lagna" ? "*" : ""}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
      {caption ? (
        <div className="pointer-events-none absolute inset-[25%] flex items-center justify-center p-1 sm:p-2 text-center">
          <span
            className="font-display text-[11px] leading-snug font-bold text-accent sm:text-xs print:text-ink"
          >
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function planetLabel(id: PlanetId, lang: Lang) {
  const p = PLANET_MAP[id];
  return lang === "ta" ? p.ta : p.en;
}
