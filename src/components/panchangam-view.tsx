// Codepackr Astro - Daily Panchangam & Oorai (planetary hora) calculator
import { useMemo, useState } from "react";
import {
  DateTimeFields,
  PlaceSearch,
  FieldSelect,
  clampBirthDate,
  todayParts,
} from "@/components/birth-fields";
import { Button } from "@/components/ui/button";
import {
  computeDailyPanchang,
  formatClock,
  type BirthInput,
  type DailyPanchang,
} from "@/lib/astro/engine";
import {
  KARANA_TA,
  KARANA_EN,
  NAK_TA,
  NAK_EN,
  PLANET_BY_ID,
  SIGNS_TA,
  SIGNS_EN,
  TITHI_TA,
  TITHI_EN,
  WEEK_TA,
  WEEK_EN,
  YOGA_TA,
  YOGA_EN,
  TAMIL_MONTH_TA,
  TAMIL_MONTH_EN,
  type PlanetId,
} from "@/lib/astro/constants";
import { t, type Lang } from "@/lib/astro/i18n";
import { DEFAULT_INPUT } from "@/lib/astro/samples";
import { cn } from "@/lib/utils";

function todayInput(): BirthInput {
  const n = new Date();
  const p = todayParts(n);
  return {
    ...DEFAULT_INPUT,
    name: "",
    year: p.year,
    month: p.month,
    day: p.day,
    hour: 12,
    minute: 0,
  };
}

function tithiLabel(pan: DailyPanchang["pan"], lang: Lang) {
  const names = lang === "ta" ? TITHI_TA : TITHI_EN;
  const base = names[pan.tithiIdx] ?? String(pan.tithiIdx + 1);
  if (pan.tithiNum === 14) return lang === "ta" ? "பௌர்ணமி" : "Purnima";
  if (pan.tithiNum === 29) return lang === "ta" ? "அமாவாசை" : "Amavasya";
  return base;
}

function SlotRow({
  label,
  start,
  end,
  tz,
  bad,
}: {
  label: string;
  start: number;
  end: number;
  tz: number;
  bad?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
        bad ? "bg-red-500/10 text-red-700 dark:text-red-300" : "bg-elevated",
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="tabular-nums text-muted">
        {formatClock(start, tz)} – {formatClock(end, tz)}
      </span>
    </div>
  );
}

export function PanchangamView({ lang }: { lang: Lang }) {
  const [draft, setDraft] = useState<BirthInput>(() => todayInput());
  const [active, setActive] = useState<BirthInput | null>(null);

  const result = useMemo(() => {
    if (!active) return null;
    return computeDailyPanchang({
      year: active.year,
      month: active.month,
      day: active.day,
      tz: active.tz,
      lat: active.lat,
      lon: active.lon,
      place: active.place,
      school: active.school,
    });
  }, [active]);

  function submit() {
    const safe = clampBirthDate(draft.year, draft.month, draft.day);
    setActive({ ...draft, ...safe, hour: 12, minute: 0 });
  }

  const signs = lang === "ta" ? SIGNS_TA : SIGNS_EN;
  const naks = lang === "ta" ? NAK_TA : NAK_EN;
  const weeks = lang === "ta" ? WEEK_TA : WEEK_EN;
  const yogas = lang === "ta" ? YOGA_TA : YOGA_EN;
  const karanas = lang === "ta" ? KARANA_TA : KARANA_EN;
  const months = lang === "ta" ? TAMIL_MONTH_TA : TAMIL_MONTH_EN;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:py-10">
      <aside className="no-print min-w-0 lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
        <div className="rounded-xl bg-surface p-4 shadow-card sm:p-5">
          <h2 className="font-display text-lg text-fg">{t(lang, "navPanchang")}</h2>
          <p className="mt-1 text-xs text-muted">{t(lang, "panchangLead")}</p>
          <div className="mt-4 flex flex-col gap-4">
            <DateTimeFields
              lang={lang}
              value={draft}
              onChange={(next) => setDraft({ ...next, hour: 12, minute: 0 })}
              allowFuture
            />
            <PlaceSearch lang={lang} value={draft} onChange={setDraft} id="pan-place" />
            <div>
              <label className="mb-1 block text-sm font-medium text-fg">{t(lang, "school")}</label>
              <FieldSelect
                value={draft.school}
                onChange={(v) => setDraft({ ...draft, school: v as BirthInput["school"] })}
              >
                <option value="thirukanitham">{lang === "ta" ? "திருக்கணிதம்" : "Thirukanitham"}</option>
                <option value="lahiri">{lang === "ta" ? "லாஹிரி" : "Lahiri"}</option>
                <option value="vakya">{lang === "ta" ? "வாக்கியம்" : "Vakya"}</option>
              </FieldSelect>
            </div>
            <Button type="button" className="w-full" onClick={submit}>
              {t(lang, "showPanchang")}
            </Button>
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-6 lg:col-span-2">
        {!result ? (
          <div className="flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-16 text-center shadow-card">
            <p className="font-display text-2xl text-fg">{t(lang, "panchangEmptyTitle")}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{t(lang, "panchangEmptyBody")}</p>
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-surface p-5 shadow-card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl text-fg">
                  {result.day}/{result.month}/{result.year} · {weeks[result.weekday]}
                </h3>
                <p className="text-sm text-muted">{result.place}</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label={t(lang, "tithi")}
                  value={`${tithiLabel(result.pan, lang)} (${result.pan.paksha === "shukla" ? t(lang, "pakshaS") : t(lang, "pakshaK")})`}
                />
                <Info
                  label={t(lang, "nakshatra")}
                  value={`${naks[result.moonNak.idx]} · ${t(lang, "pada")} ${result.moonNak.pada}`}
                />
                <Info label={t(lang, "yoga")} value={yogas[result.pan.yogaNum] ?? "—"} />
                <Info label={t(lang, "karana")} value={karanas[result.pan.karanaIdx] ?? "—"} />
                <Info label={t(lang, "month")} value={months[result.pan.tamilMonth] ?? "—"} />
                <Info
                  label={t(lang, "rasi")}
                  value={signs[Math.floor(result.moonLon / 30) % 12] ?? "—"}
                />
                <Info label={t(lang, "sunrise")} value={formatClock(result.sunriseJD, result.tz)} />
                <Info label={t(lang, "sunset")} value={formatClock(result.sunsetJD, result.tz)} />
                <Info label={t(lang, "ayanamsa")} value={`${result.aya.toFixed(4)}°`} />
              </div>
            </div>

            <div className="rounded-xl bg-surface p-5 shadow-card">
              <h3 className="font-display text-lg text-fg">{t(lang, "muhurta")}</h3>
              <div className="mt-3 flex flex-col gap-2">
                <SlotRow label={t(lang, "rahuKalam")} start={result.muh.rahu.start} end={result.muh.rahu.end} tz={result.tz} bad />
                <SlotRow label={t(lang, "yamaganda")} start={result.muh.yamaganda.start} end={result.muh.yamaganda.end} tz={result.tz} bad />
                <SlotRow label={t(lang, "gulika")} start={result.muh.gulikaKalam.start} end={result.muh.gulikaKalam.end} tz={result.tz} bad />
                <SlotRow label={t(lang, "abhijit")} start={result.muh.abhijit.start} end={result.muh.abhijit.end} tz={result.tz} />
              </div>
            </div>

            <div className="rounded-xl bg-surface p-5 shadow-card">
              <h3 className="font-display text-lg text-fg">{t(lang, "ooraiTitle")}</h3>
              <p className="mt-1 text-xs text-muted">{t(lang, "ooraiLead")}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {result.horas.map((h, i) => {
                  const p = PLANET_BY_ID[h.lord as PlanetId];
                  const name = p ? (lang === "ta" ? p.ta : p.en) : h.lord;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                        h.dayPart === "day" ? "bg-amber-500/10" : "bg-indigo-500/10",
                      )}
                    >
                      <span className="font-medium">
                        {i + 1}. {name}
                        <span className="ml-1 text-xs text-muted">
                          ({h.dayPart === "day" ? (lang === "ta" ? "பகல்" : "Day") : lang === "ta" ? "இரவு" : "Night"})
                        </span>
                      </span>
                      <span className="tabular-nums text-muted">
                        {formatClock(h.startJD, result.tz)} – {formatClock(h.endJD, result.tz)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-surface p-5 shadow-card">
                <h3 className="font-display text-lg text-fg">{t(lang, "gowri")}</h3>
                <div className="mt-3 flex flex-col gap-1.5">
                  {result.muh.gowri.map((g, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between rounded-md px-3 py-1.5 text-sm",
                        g.good ? "bg-emerald-500/10" : "bg-elevated",
                      )}
                    >
                      <span>
                        {g.name}{" "}
                        <span className="text-xs text-muted">({g.good ? t(lang, "good") : t(lang, "bad")})</span>
                      </span>
                      <span className="tabular-nums text-muted">
                        {formatClock(g.start, result.tz)} – {formatClock(g.end, result.tz)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-surface p-5 shadow-card">
                <h3 className="font-display text-lg text-fg">{t(lang, "choghadiya")}</h3>
                <div className="mt-3 flex flex-col gap-1.5">
                  {result.muh.choghadiya.map((c, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between rounded-md px-3 py-1.5 text-sm",
                        c.nature === "best" || c.nature === "good" ? "bg-emerald-500/10" : "bg-elevated",
                      )}
                    >
                      <span>
                        {c.name}{" "}
                        <span className="text-xs text-muted">({c.nature})</span>
                      </span>
                      <span className="tabular-nums text-muted">
                        {formatClock(c.start, result.tz)} – {formatClock(c.end, result.tz)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-elevated px-3 py-2">
      <p className="text-xs tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-fg">{value}</p>
    </div>
  );
}
