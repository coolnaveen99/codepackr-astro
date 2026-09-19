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
}: {
  positions: BodyPos[];
  lang: Lang;
  mode?: "sign" | "navamsa";
  caption?: string;
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
    <div className="south-chart relative overflow-hidden rounded-md">
      {SOUTH.map((sign, i) => {
        if (sign === null) {
          return <div key={i} className="bg-ink/90" />;
        }
        const isLagna = sign === lagnaSign;
        const isMoon = sign === moonSign;
        return (
          <div
            key={i}
            className={cn(
              "relative min-h-0 overflow-hidden border-r border-b border-elevated/20 p-1",
              isMoon && "bg-accent/20",
              isLagna && "ring-accent ring-inset ring-2",
            )}
          >
            <span className="absolute top-1 right-1 font-display text-xs tracking-wide text-accent-fg/70">
              {shorts[sign]}
            </span>
            {lagnaSign >= 0 ? (
              <span className="absolute bottom-1 left-1 text-xs tabular-nums text-accent-fg/45">
                {((sign - lagnaSign + 12) % 12) + 1}
              </span>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-0.5">
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
                      "rounded-xs px-1 py-px text-xs leading-4 font-medium",
                      isMoonP
                        ? "bg-accent-fg text-accent"
                        : isLagnaP
                          ? "bg-accent text-accent-fg"
                          : "bg-elevated/15 text-accent-fg",
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
        <div className="pointer-events-none absolute inset-[25%] flex items-center justify-center p-2 text-center">
          <span className="font-display text-xs leading-snug text-accent-fg/80">{caption}</span>
        </div>
      ) : null}
    </div>
  );
}

export function planetLabel(id: PlanetId, lang: Lang) {
  const p = PLANET_MAP[id];
  return lang === "ta" ? p.ta : p.en;
}
