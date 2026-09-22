// Codepackr Astro - Name & birth numerology (client-side only)
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildNumeroProfile, numeroText } from "@/lib/astro/numerology";
import { t, type Lang } from "@/lib/astro/i18n";

export function NumerologyView({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1990);
  const [done, setDone] = useState(false);

  const profile = useMemo(() => {
    if (!done) return null;
    return buildNumeroProfile(name, day, month, year);
  }, [done, name, day, month, year]);

  const view = profile ? numeroText(profile, lang) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "navNumerology")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t(lang, "numerologyLead")}</p>
      </div>

      <form
        className="rounded-xl bg-surface p-4 shadow-card sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="num-name">{t(lang, "name")}</Label>
            <Input
              id="num-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "ta" ? "பெயர்" : "Full name"}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>{t(lang, "day")}</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            <div>
              <Label>{t(lang, "calMonth")}</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            <div>
              <Label>{t(lang, "year")}</Label>
              <Input
                type="number"
                min={1900}
                max={2100}
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || 1990)}
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {t(lang, "computeNumero")}
          </Button>
        </div>
      </form>

      {view && profile ? (
        <div className="mt-8 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label={t(lang, "nameNumber")} value={String(view.nameNum)} />
            <Stat label={t(lang, "lifePath")} value={String(view.lifePath)} />
            <Stat label={t(lang, "birthDayNum")} value={String(view.birthDay)} />
          </div>
          <div className="rounded-xl bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t(lang, "rulingPlanet")}
            </p>
            <p className="font-display mt-1 text-2xl text-accent">{view.planet}</p>
            <p className="mt-3 text-sm text-fg">
              <span className="font-medium">{t(lang, "qualities")}: </span>
              {view.qualities}
            </p>
            <p className="mt-2 text-sm text-muted">{view.advice}</p>
            <p className="mt-4 text-xs text-muted">{t(lang, "numeroDisclaimer")}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-4 shadow-card text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display mt-1 text-3xl tabular-nums text-accent">{value}</p>
    </div>
  );
}
