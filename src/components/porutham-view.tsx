import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { NAK_EN, NAK_TA, SCHOOLS, SIGNS_EN, SIGNS_TA, type School } from "@/lib/astro/constants";
import { analyse, dasakoota } from "@/lib/astro/analysis";
import { compute, type BirthInput } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { gradeLabel, matchVerdict } from "@/lib/astro/phalan";
import { DEFAULT_INPUT } from "@/lib/astro/samples";
import { DateTimeFields, PlaceSearch } from "@/components/birth-fields";
import { SouthChart } from "@/components/south-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function blank(sex: "M" | "F"): BirthInput {
  return { ...DEFAULT_INPUT, name: "", sex, place: "Madras" };
}

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

export function PoruthamView({ lang }: { lang: Lang }) {
  const [girl, setGirl] = useState<BirthInput>(() => blank("F"));
  const [boy, setBoy] = useState<BirthInput>(() => blank("M"));
  const [school, setSchool] = useState<School>("thirukanitham");
  const [done, setDone] = useState(false);

  const report = useMemo(() => {
    if (!done) return null;
    const gIn = { ...girl, sex: "F" as const, school };
    const bIn = { ...boy, sex: "M" as const, school };
    const gChart = compute(gIn);
    const bChart = compute(bIn);
    const gA = analyse(gChart);
    const bA = analyse(bChart);
    const south = dasakoota(bChart.bodies.moon, gChart.bodies.moon);
    return { gChart, bChart, gA, bA, south };
  }, [done, girl, boy, school]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="no-print mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "poruthamTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t(lang, "poruthamLead")}</p>
      </div>

      <form
        className="no-print rounded-xl bg-surface p-4 shadow-card sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <PersonCard
            lang={lang}
            title={t(lang, "girlBirth")}
            nameLabel={t(lang, "girlName")}
            value={girl}
            onChange={setGirl}
            prefix="girl"
          />
          <PersonCard
            lang={lang}
            title={t(lang, "boyBirth")}
            nameLabel={t(lang, "boyName")}
            value={boy}
            onChange={setBoy}
            prefix="boy"
          />
        </div>
        <div className="mt-5">
          <Label>{t(lang, "school")}</Label>
          <div className="mt-1 grid gap-2 sm:grid-cols-3">
            {SCHOOLS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSchool(s.id)}
                className={cn(
                  "rounded-md px-3 py-2 text-left text-sm shadow-card",
                  school === s.id ? "bg-ink text-accent-fg" : "bg-elevated text-fg",
                )}
              >
                {lang === "ta" ? s.ta : s.en}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
          {t(lang, "checkPorutham")}
        </Button>
      </form>

      {report ? (
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-wide text-muted uppercase">{t(lang, "matchedOf")}</p>
              <p className="font-display text-4xl tabular-nums">
                {report.south.matched}
                <span className="text-xl text-muted">{t(lang, "of10porutham")}</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {matchVerdict(report.south.verdict, lang)} · {t(lang, "uthamam")} {report.south.uthamam} ·{" "}
                {t(lang, "madhyamam")} {report.south.matched - report.south.uthamam} · {t(lang, "adhamam")}{" "}
                {10 - report.south.matched}
              </p>
            </div>
            <Button variant="outline" size="sm" className="no-print" onClick={() => window.print()}>
              <Printer className="size-4" />
              {t(lang, "print")}
            </Button>
          </div>

          {(report.south.flags.rajju || report.south.flags.vedha || report.south.flags.ashtama) && (
            <ul className="rounded-lg bg-ink px-4 py-3 text-sm text-accent-fg">
              {report.south.flags.rajju ? <li>{t(lang, "rajjuWarn")}</li> : null}
              {report.south.flags.vedha ? <li>{t(lang, "vedhaWarn")}</li> : null}
              {report.south.flags.ashtama ? <li>{t(lang, "ashtamaWarn")}</li> : null}
            </ul>
          )}

          <p className="text-sm text-muted">
            {report.gA.chevvai.present && report.bA.chevvai.present
              ? t(lang, "chevvaiBoth")
              : report.gA.chevvai.present || report.bA.chevvai.present
                ? t(lang, "chevvaiOne")
                : t(lang, "chevvaiNone")}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <PersonSummary
              lang={lang}
              title={girl.name || t(lang, "girlBirth")}
              chart={report.gChart}
              chevvai={report.gA.chevvai.present}
            />
            <PersonSummary
              lang={lang}
              title={boy.name || t(lang, "boyBirth")}
              chart={report.bChart}
              chevvai={report.bA.chevvai.present}
            />
          </div>

          <section className="rounded-lg bg-surface p-4 shadow-card sm:p-5">
            <h3 className="font-display mb-3 text-lg">{t(lang, "dasakoot")}</h3>
            <ul className="divide-y divide-border">
              {report.south.items.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{lang === "ta" ? it.ta : it.en}</p>
                    <p className="mt-0.5 text-xs text-muted">{lang === "ta" ? it.noteTa : it.noteEn}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-sm px-2 py-1 text-xs font-medium",
                      it.grade === "adhamam" ? "bg-elevated text-muted" : "bg-ink text-accent-fg",
                    )}
                  >
                    {gradeLabel(it.grade, lang)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function PersonCard({
  lang,
  title,
  nameLabel,
  value,
  onChange,
  prefix,
}: {
  lang: Lang;
  title: string;
  nameLabel: string;
  value: BirthInput;
  onChange: (next: BirthInput) => void;
  prefix: string;
}) {
  return (
    <div>
      <h3 className="font-display mb-3 text-lg">{title}</h3>
      <div className="flex flex-col gap-3">
        <div>
          <Label htmlFor={prefix + "-name"}>{nameLabel}</Label>
          <Input
            id={prefix + "-name"}
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <PlaceSearch lang={lang} value={value} onChange={onChange} id={prefix + "-place"} />
        <DateTimeFields lang={lang} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function PersonSummary({
  lang,
  title,
  chart,
  chevvai,
}: {
  lang: Lang;
  title: string;
  chart: ReturnType<typeof compute>;
  chevvai: boolean;
}) {
  const moon = chart.list.find((p) => p.id === "moon")!;
  const lagna = chart.list.find((p) => p.id === "lagna")!;
  return (
    <figure className="rounded-lg bg-surface p-3 shadow-card sm:p-4">
      <figcaption className="mb-2">
        <p className="font-display text-lg">{title}</p>
        <p className="text-sm text-muted">
          {t(lang, "rasi")} {signName(lang, moon.sign)} · {nakName(lang, moon.nak)} {t(lang, "pada")} {moon.pada} ·{" "}
          {t(lang, "lagna")} {signName(lang, lagna.sign)}
        </p>
        <p className="mt-1 text-xs text-muted">
          {t(lang, "chevvai")}: {chevvai ? t(lang, "present") : t(lang, "absent")}
        </p>
      </figcaption>
      <SouthChart positions={chart.list} lang={lang} caption={title} />
    </figure>
  );
}
