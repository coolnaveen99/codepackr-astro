// Codepackr Astro - 10 Poruthams Marriage Matching
import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { NAK_EN, NAK_TA, SCHOOLS, SIGNS_EN, SIGNS_TA, type School } from "@/lib/astro/constants";
import { analyse, dasakoota } from "@/lib/astro/analysis";
import { compute, type BirthInput } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { gradeLabel, matchVerdict } from "@/lib/astro/phalan";
import { DEFAULT_INPUT } from "@/lib/astro/samples";
import { triggerPrint } from "@/lib/print-helper";
import { DateTimeFields, PlaceSearch } from "@/components/birth-fields";
import { SouthChart } from "@/components/south-chart";
import { PrintDialog } from "@/components/print-dialog";
import { Watermark } from "@/components/watermark";
import { useGanesh } from "@/lib/ganesh-context";
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
  const { ganeshSrc } = useGanesh();
  const [girl, setGirl] = useState<BirthInput>(() => blank("F"));
  const [boy, setBoy] = useState<BirthInput>(() => blank("M"));
  const [school, setSchool] = useState<School>("thirukanitham");
  const [done, setDone] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

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
                  school === s.id ? "bg-accent text-accent-fg font-semibold" : "bg-elevated text-fg border border-border/70",
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
        <div className="relative overflow-hidden mt-8 flex flex-col gap-6 print:m-0 print:gap-4">
          <div className="hidden print:block">
            <Watermark />
          </div>

          {/* Printable Header with Ganesha Image */}
          <div className="hidden print:flex flex-col items-center justify-center border-b border-border pb-3 text-center">
            <img src={ganeshSrc} alt="Lord Ganesha" className="h-14 w-auto object-contain" />
            <h2 className="font-display mt-1 text-2xl font-bold text-ink">
              {t(lang, "poruthamTitle")}
            </h2>
            <p className="text-xs text-muted">
              {girl.name ? `${t(lang, "girlBirth")}: ${girl.name}` : t(lang, "girlBirth")} &bull;{" "}
              {boy.name ? `${t(lang, "boyBirth")}: ${boy.name}` : t(lang, "boyBirth")} &bull;{" "}
              {lang === "ta" ? (school === "thirukanitham" ? "திருக்கணிதம்" : "வாக்கியம்") : school}
            </p>
          </div>

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
            <Button
              variant="outline"
              size="sm"
              className="no-print border-accent text-accent hover:bg-accent hover:text-accent-fg font-medium"
              onClick={() => {
                try {
                  window.print();
                } catch {
                  // ignore
                }
                setShowPrintModal(true);
              }}
            >
              <Printer className="size-4 mr-1" />
              {t(lang, "print")}
            </Button>
          </div>

          {(report.south.flags.rajju || report.south.flags.vedha || report.south.flags.ashtama) && (
            <ul className="rounded-lg bg-amber-50/95 border border-amber-300 px-4 py-3 text-sm text-amber-950 shadow-xs print:border print:border-ink print:bg-white print:text-ink">
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

          <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
            <PersonSummary
              lang={lang}
              title={girl.name ? `${girl.name} (${t(lang, "girlBirth")})` : t(lang, "girlBirth")}
              chart={report.gChart}
              chevvai={report.gA.chevvai.present}
            />
            <PersonSummary
              lang={lang}
              title={boy.name ? `${boy.name} (${t(lang, "boyBirth")})` : t(lang, "boyBirth")}
              chart={report.bChart}
              chevvai={report.bA.chevvai.present}
            />
          </div>

          <section className="rounded-lg bg-surface p-4 shadow-card sm:p-5 print:border print:border-border print:p-3 print:shadow-none">
            <h3 className="font-display mb-3 text-lg print:mb-2 print:text-base">{t(lang, "dasakoot")}</h3>
            <ul className="divide-y divide-border text-sm">
              {report.south.items.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-3 py-2 sm:py-3 print:py-1.5">
                  <div>
                    <p className="text-sm font-medium">{lang === "ta" ? it.ta : it.en}</p>
                    <p className="mt-0.5 text-xs text-muted">{lang === "ta" ? it.noteTa : it.noteEn}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-sm px-2 py-1 text-xs font-medium",
                      it.grade === "adhamam"
                        ? "bg-elevated text-muted print:border print:border-muted/30"
                        : "bg-accent text-accent-fg font-semibold print:border print:border-ink print:bg-ink/5 print:text-ink",
                    )}
                  >
                    {gradeLabel(it.grade, lang)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Printable Footer with Ganesha branding and astro.codepackr.com advertisement */}
          <footer className="mt-4 hidden border-t border-border pt-3 print:flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-2">
              <img src={ganeshSrc} alt="Ganesha" className="h-6 w-auto object-contain" />
              <div>
                <span className="font-semibold text-accent">astro.codepackr.com</span>
                <span className="mx-1.5 text-border">&bull;</span>
                <span className="text-ink font-medium">Contact: codepackr@gmail.com</span>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <p className="font-medium text-fg">Codepackr Astro &bull; Tamil Jathagam &amp; Porutham</p>
              <p className="text-muted">High Precision Thirukanitham &amp; Vakya Calculations &bull; https://astro.codepackr.com</p>
            </div>
          </footer>

          {/* Interactive Print / Save as PDF Dialog */}
          <PrintDialog
            open={showPrintModal}
            onClose={() => setShowPrintModal(false)}
            title={lang === "ta" ? "திருமணப் பொருத்த அச்சுப் பிரதி (A4)" : "Marriage Compatibility Report (A4 Print)"}
            lang={lang}
            newTabUrl="/?page=porutham&print=auto"
          >
            <div className="relative overflow-hidden w-full max-w-[210mm] mx-auto py-1">
              <Watermark />
              <div className="relative z-1">
                <div className="flex flex-col items-center justify-center border-b border-border pb-3 text-center">
                  <img src={ganeshSrc} alt="Lord Ganesha" className="h-14 w-auto object-contain" />
                  <h2 className="font-display mt-1 text-2xl font-bold text-ink">
                    {t(lang, "poruthamTitle")}
                  </h2>
                  <p className="text-xs text-muted">
                    {girl.name ? `${t(lang, "girlBirth")}: ${girl.name}` : t(lang, "girlBirth")} &bull;{" "}
                    {boy.name ? `${t(lang, "boyBirth")}: ${boy.name}` : t(lang, "boyBirth")} &bull;{" "}
                    {lang === "ta" ? (school === "thirukanitham" ? "திருக்கணிதம்" : "வாக்கியம்") : school}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl font-bold text-accent">
                      {report.south.matched} {t(lang, "of10porutham")} — {matchVerdict(report.south.verdict, lang)}
                    </p>
                    <p className="text-xs text-muted">
                      {t(lang, "uthamam")} {report.south.uthamam} · {t(lang, "madhyamam")} {report.south.matched - report.south.uthamam} · {t(lang, "adhamam")} {10 - report.south.matched}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-4">
                  <PersonSummary
                    lang={lang}
                    title={girl.name ? `${girl.name} (${t(lang, "girlBirth")})` : t(lang, "girlBirth")}
                    chart={report.gChart}
                    chevvai={report.gA.chevvai.present}
                    printMode={true}
                  />
                  <PersonSummary
                    lang={lang}
                    title={boy.name ? `${boy.name} (${t(lang, "boyBirth")})` : t(lang, "boyBirth")}
                    chart={report.bChart}
                    chevvai={report.bA.chevvai.present}
                    printMode={true}
                  />
                </div>

                <section className="mt-3 rounded-lg border border-border p-3">
                  <h3 className="font-display mb-2 text-sm font-semibold">{t(lang, "dasakoot")}</h3>
                  <ul className="divide-y divide-border text-xs">
                    {report.south.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between py-1.5">
                        <div>
                          <span className="font-medium">{lang === "ta" ? it.ta : it.en}</span>
                          <span className="ml-2 text-muted">{lang === "ta" ? it.noteTa : it.noteEn}</span>
                        </div>
                        <span className="font-semibold text-accent">{gradeLabel(it.grade, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <footer className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <img src={ganeshSrc} alt="Ganesha" className="h-6 w-auto object-contain" />
                    <div>
                      <span className="font-semibold text-accent">astro.codepackr.com</span>
                      <span className="mx-1.5 text-border">&bull;</span>
                      <span className="text-ink font-medium">Contact: codepackr@gmail.com</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="font-medium text-fg">Codepackr Astro &bull; Tamil Jathagam &amp; Porutham</p>
                    <p className="text-muted">High Precision Calculations &bull; https://astro.codepackr.com</p>
                  </div>
                </footer>
              </div>
            </div>
          </PrintDialog>
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
  printMode = false,
}: {
  lang: Lang;
  title: string;
  chart: ReturnType<typeof compute>;
  chevvai: boolean;
  printMode?: boolean;
}) {
  const moon = chart.list.find((p) => p.id === "moon")!;
  const lagna = chart.list.find((p) => p.id === "lagna")!;
  const [activeTab, setActiveTab] = useState<"both" | "rasi" | "navamsa">("both");

  return (
    <figure className="rounded-lg bg-surface p-3 shadow-card sm:p-4 print:p-2 print:shadow-none print:border print:border-border">
      <figcaption className="mb-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg font-bold text-ink">{title}</p>
          {!printMode && (
            <div className="flex gap-1 bg-elevated/80 p-0.5 rounded text-xs print:hidden">
              <button
                type="button"
                onClick={() => setActiveTab("both")}
                className={cn(
                  "px-2 py-0.5 rounded transition-all text-xs",
                  activeTab === "both" ? "bg-accent text-accent-fg font-semibold" : "text-muted hover:text-ink"
                )}
              >
                {lang === "ta" ? "இரண்டும்" : "Both"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rasi")}
                className={cn(
                  "px-2 py-0.5 rounded transition-all text-xs",
                  activeTab === "rasi" ? "bg-accent text-accent-fg font-semibold" : "text-muted hover:text-ink"
                )}
              >
                {lang === "ta" ? "ராசி" : "Rasi"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("navamsa")}
                className={cn(
                  "px-2 py-0.5 rounded transition-all text-xs",
                  activeTab === "navamsa" ? "bg-accent text-accent-fg font-semibold" : "text-muted hover:text-ink"
                )}
              >
                {lang === "ta" ? "நவாம்சம்" : "Navamsa"}
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted mt-1">
          {t(lang, "rasi")}: <strong className="font-semibold text-ink">{signName(lang, moon.sign)}</strong> · {nakName(lang, moon.nak)} ({t(lang, "pada")} {moon.pada}) ·{" "}
          {t(lang, "lagna")}: <strong className="font-semibold text-ink">{signName(lang, lagna.sign)}</strong>
        </p>
        <p className="text-xs text-muted">
          {t(lang, "chevvai")}: {chevvai ? <span className="text-accent font-semibold">{t(lang, "present")}</span> : t(lang, "absent")}
        </p>
      </figcaption>

      {/* Rasi & Navamsa Charts with explicit headings */}
      <div className={cn(
        "grid gap-3",
        activeTab === "both" || printMode ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      )}>
        {(activeTab === "both" || activeTab === "rasi" || printMode) && (
          <div>
            <div className="text-center text-[11px] font-semibold text-accent pb-1 border-b border-border/60 mb-1.5">
              {lang === "ta" ? "ராசி கட்டம் (D1 Rasi)" : "Rasi Chart (D1)"}
            </div>
            <SouthChart positions={chart.list} mode="sign" lang={lang} caption={`${title} - ${lang === "ta" ? "ராசி" : "Rasi"}`} theme="light" />
          </div>
        )}
        {(activeTab === "both" || activeTab === "navamsa" || printMode) && (
          <div>
            <div className="text-center text-[11px] font-semibold text-accent pb-1 border-b border-border/60 mb-1.5">
              {lang === "ta" ? "நவாம்ச கட்டம் (D9 Navamsa)" : "Navamsa Chart (D9)"}
            </div>
            <SouthChart positions={chart.list} mode="navamsa" lang={lang} caption={`${title} - ${lang === "ta" ? "நவாம்சம்" : "Navamsa"}`} theme="light" />
          </div>
        )}
      </div>
    </figure>
  );
}
