import { Printer } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  KARANA_EN,
  KARANA_TA,
  NAK_EN,
  NAK_TA,
  SIGNS_EN,
  SIGNS_TA,
  TAMIL_MONTH_EN,
  TAMIL_MONTH_TA,
  TITHI_EN,
  TITHI_TA,
  WEEK_EN,
  WEEK_TA,
  YOGA_EN,
  YOGA_TA,
  planetName,
} from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import {
  antardasas,
  bhuktis,
  formatClock,
  formatJD,
  nowJD,
  vargaSign,
  type BodyPos,
  type ChartResult,
} from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";
import { SouthChart } from "@/components/south-chart";
import {
  BavGrid,
  BhavaStrip,
  GocharaPane,
  GrahaTable,
  Panel,
  PhalanPane,
  YogaPane,
} from "@/components/analysis-panes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = "chart" | "phalan" | "yoga" | "pan" | "dasa" | "gochara" | "varga";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

function find(list: BodyPos[], id: string) {
  return list.find((p) => p.id === id)!;
}

export function ChartViews({ result, lang }: { result: ChartResult; lang: Lang }) {
  const [tab, setTab] = useState<Tab>("chart");
  const { go } = useNav();
  const analysis = useMemo(() => analyse(result), [result]);
  const moon = find(result.list, "moon");
  const lagna = find(result.list, "lagna");
  const tabs: { id: Tab; key: "tabChart" | "tabPhalan" | "tabYoga" | "tabPan" | "tabDasa" | "tabGochara" | "tabVarga" }[] = [
    { id: "chart", key: "tabChart" },
    { id: "phalan", key: "tabPhalan" },
    { id: "yoga", key: "tabYoga" },
    { id: "pan", key: "tabPan" },
    { id: "dasa", key: "tabDasa" },
    { id: "gochara", key: "tabGochara" },
    { id: "varga", key: "tabVarga" },
  ];

  const body = (
    <>
      {tab === "chart" && <ChartsPane result={result} analysis={analysis} lang={lang} />}
      {tab === "phalan" && <PhalanPane result={result} analysis={analysis} lang={lang} />}
      {tab === "yoga" && <YogaPane analysis={analysis} lang={lang} />}
      {tab === "pan" && <PanchangPane result={result} lang={lang} />}
      {tab === "dasa" && <DasaPane result={result} lang={lang} />}
      {tab === "gochara" && <GocharaPane analysis={analysis} lang={lang} />}
      {tab === "varga" && <VargaPane result={result} lang={lang} />}
    </>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-ink px-5 py-6 text-accent-fg shadow-card sm:px-8">
        <p className="text-xs tracking-widest text-accent-fg/60 uppercase">
          {result.input.name || t(lang, "brand")}
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Stat k={t(lang, "rasi")} v={signName(lang, moon.sign)} />
          <Stat
            k={t(lang, "nakshatra")}
            v={`${nakName(lang, moon.nak)} · ${t(lang, "pada")} ${moon.pada}`}
          />
          <Stat k={t(lang, "lagna")} v={`${signName(lang, lagna.sign)} ${lagna.dms}`} />
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-accent-fg/70">
          <span>
            {t(lang, "weekday")}: {lang === "ta" ? WEEK_TA[result.weekday] : WEEK_EN[result.weekday]}
          </span>
          <span>
            {t(lang, "ayanamsa")}: {result.aya.toFixed(4)}°
          </span>
          <span>
            {t(lang, "sunrise")}: {formatClock(result.sunriseJD, result.input.tz)}
          </span>
          <span>
            {t(lang, "sunset")}: {formatClock(result.sunsetJD, result.input.tz)}
          </span>
          <span>
            {t(lang, "naming")}: {lang === "ta" ? analysis.naming.ta : analysis.naming.en}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {analysis.dasaNow ? (
            <Chip>
              {t(lang, "current")}: {planetName(analysis.dasaNow.maha, lang)}–{planetName(analysis.dasaNow.bhukti, lang)}
            </Chip>
          ) : null}
          <Chip tone={analysis.chevvai.present ? "warn" : "ok"}>
            {t(lang, "chevvai")}: {analysis.chevvai.present ? t(lang, "present") : t(lang, "absent")}
          </Chip>
          <Chip tone={analysis.sadeSati.present ? "warn" : "ok"}>
            {t(lang, "sadesati")}: {analysis.sadeSati.present ? t(lang, "present") : t(lang, "absent")}
          </Chip>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden" data-print-hide>
        <div className="flex flex-wrap gap-1 rounded-lg bg-elevated p-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={cn(
                "h-9 rounded-md px-3 text-sm font-medium transition-[background-color,color] duration-150",
                tab === tb.id ? "bg-surface text-fg shadow-card" : "text-muted hover:text-fg",
              )}
            >
              {t(lang, tb.key)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="no-print" onClick={() => go("porutham")}>
            {t(lang, "openPorutham")}
          </Button>
          <Button variant="outline" size="sm" className="no-print" onClick={() => window.print()}>
            <Printer className="size-4" />
            {t(lang, "print")}
          </Button>
        </div>
      </div>

      <div className="print:hidden">{body}</div>
      <div className="hidden print:flex print:flex-col print:gap-8">
        <ChartsPane result={result} analysis={analysis} lang={lang} />
        <PhalanPane result={result} analysis={analysis} lang={lang} />
        <YogaPane analysis={analysis} lang={lang} />
        <PanchangPane result={result} lang={lang} />
        <DasaPane result={result} lang={lang} />
        <GocharaPane analysis={analysis} lang={lang} />
        <VargaPane result={result} lang={lang} />
      </div>
    </div>
  );
}

function Chip({ children, tone }: { children: ReactNode; tone?: "ok" | "warn" }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        tone === "warn" ? "bg-accent/30 text-accent-fg" : "bg-elevated/15 text-accent-fg/85",
      )}
    >
      {children}
    </span>
  );
}

function Stat({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-accent-fg/55 uppercase">{k}</p>
      <p className="font-display mt-1 text-2xl leading-tight text-accent-fg">{v}</p>
      {note ? <p className="mt-1 text-xs text-accent-fg/50">{note}</p> : null}
    </div>
  );
}

function ChartsPane({
  result,
  analysis,
  lang,
}: {
  result: ChartResult;
  analysis: ReturnType<typeof analyse>;
  lang: Lang;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <figure className="rounded-lg bg-surface p-3 shadow-card sm:p-4">
          <figcaption className="mb-2 font-display text-lg">{t(lang, "d1")}</figcaption>
          <SouthChart positions={result.list} lang={lang} caption={result.input.name} />
        </figure>
        <figure className="rounded-lg bg-surface p-3 shadow-card sm:p-4">
          <figcaption className="mb-2 font-display text-lg">{t(lang, "d9")}</figcaption>
          <SouthChart positions={result.list} lang={lang} mode="navamsa" caption="D9" />
        </figure>
      </div>
      <BhavaStrip analysis={analysis} lang={lang} />
      <GrahaTable result={result} analysis={analysis} lang={lang} />
    </div>
  );
}

function PanchangPane({ result, lang }: { result: ChartResult; lang: Lang }) {
  const pan = result.pan;
  const moon = find(result.list, "moon");
  const tithiName = lang === "ta" ? TITHI_TA[pan.tithiIdx] : TITHI_EN[pan.tithiIdx];
  const pak = pan.paksha === "shukla" ? t(lang, "pakshaS") : t(lang, "pakshaK");
  const rows = [
    [t(lang, "tithi"), `${pak} — ${tithiName}`],
    [t(lang, "weekday"), lang === "ta" ? WEEK_TA[result.weekday] : WEEK_EN[result.weekday]],
    [t(lang, "nakshatra"), `${nakName(lang, moon.nak)} ${t(lang, "pada")} ${moon.pada}`],
    [t(lang, "yoga"), lang === "ta" ? YOGA_TA[pan.yogaNum] : YOGA_EN[pan.yogaNum]],
    [t(lang, "karana"), lang === "ta" ? KARANA_TA[pan.karanaIdx] : KARANA_EN[pan.karanaIdx]],
    [
      t(lang, "month"),
      lang === "ta" ? TAMIL_MONTH_TA[pan.tamilMonth] : TAMIL_MONTH_EN[pan.tamilMonth],
    ],
  ];
  const muhRows = [
    [t(lang, "rahuKalam"), span(result, result.muh.rahu)],
    [t(lang, "yamaganda"), span(result, result.muh.yamaganda)],
    [t(lang, "gulika"), span(result, result.muh.gulikaKalam)],
    [t(lang, "abhijit"), span(result, result.muh.abhijit)],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t(lang, "panchang")}>
        <KeyTable rows={rows.map(([k, v]) => [k, String(v)])} />
      </Panel>
      <Panel title={t(lang, "muhurta")}>
        <KeyTable rows={muhRows} />
      </Panel>
      <Panel title={t(lang, "choghadiya")}>
        <ul className="divide-y divide-border text-sm">
          {result.muh.choghadiya.map((c, i) => (
            <li key={i} className="flex items-center justify-between py-2">
              <span>
                {c.name}{" "}
                <span className="text-xs text-muted">
                  {c.nature === "best" ? t(lang, "best") : c.nature === "good" ? t(lang, "good") : t(lang, "bad")}
                </span>
              </span>
              <span className="tabular-nums text-muted">{span(result, c)}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title={t(lang, "gowri")}>
        <ul className="divide-y divide-border text-sm">
          {result.muh.gowri.map((c, i) => (
            <li key={i} className="flex items-center justify-between py-2">
              <span>
                {c.name} {c.good ? <span className="text-xs text-muted">{t(lang, "good")}</span> : null}
              </span>
              <span className="tabular-nums text-muted">{span(result, c)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function KeyTable({ rows }: { rows: string[][] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-border last:border-0">
            <td className="py-2 pr-3 text-muted">{k}</td>
            <td className="py-2 font-medium">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function span(result: ChartResult, w: { start: number; end: number }) {
  return `${formatClock(w.start, result.input.tz)} – ${formatClock(w.end, result.input.tz)}`;
}

function DasaPane({ result, lang }: { result: ChartResult; lang: Lang }) {
  const at = nowJD();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Panel title={t(lang, "dasa")}>
      <p className="mb-4 text-sm text-muted">
        {nakName(lang, result.dasa.nak)} · {t(lang, "pada")} {result.dasa.pada}
      </p>
      <ul className="flex flex-col gap-2">
        {result.dasa.periods.map((p) => {
          const current = at >= p.startJD && at < p.endJD;
          const label = planetName(p.lord, lang);
          const id = p.lord + p.startJD;
          const shown = open === id || current;
          const antars = shown ? bhuktis(p) : [];
          return (
            <li key={id} className={cn("rounded-md px-3 py-3", current ? "bg-ink text-accent-fg" : "bg-elevated")}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-3 text-left"
                onClick={() => setOpen(shown && !current ? null : id)}
              >
                <span className="font-medium">
                  {label}
                  {p.balance ? ` · ${t(lang, "balance")}` : ""}
                  {current ? ` · ${t(lang, "current")}` : ""}
                </span>
                <span className={cn("text-xs tabular-nums", current ? "text-accent-fg/70" : "text-muted")}>
                  {formatJD(p.startJD, result.input.tz).slice(0, 10)} — {formatJD(p.endJD, result.input.tz).slice(0, 10)}
                </span>
              </button>
              {shown ? (
                <ul className="mt-2 space-y-1 text-xs">
                  {antars.map((b) => {
                    const on = at >= b.startJD && at < b.endJD;
                    const thirds = on ? antardasas(b) : [];
                    return (
                      <li key={b.lord + b.startJD}>
                        <div className="flex justify-between">
                          <span className={on ? "font-semibold" : ""}>
                            {t(lang, "bhukti")} {planetName(b.lord, lang)}
                          </span>
                          <span className={current ? "text-accent-fg/60" : "text-muted"}>
                            {formatJD(b.startJD, result.input.tz).slice(0, 10)}
                          </span>
                        </div>
                        {on ? (
                          <ul className="mt-1 ml-3 space-y-0.5 opacity-80">
                            {thirds.map((a) => {
                              const aOn = at >= a.startJD && at < a.endJD;
                              return (
                                <li key={a.lord + a.startJD} className="flex justify-between">
                                  <span className={aOn ? "font-semibold" : ""}>
                                    {t(lang, "antara")} {planetName(a.lord, lang)}
                                  </span>
                                  <span>{formatJD(a.startJD, result.input.tz).slice(0, 10)}</span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function VargaPane({ result, lang }: { result: ChartResult; lang: Lang }) {
  const d3 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 3) }));
  const d7 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 7) }));
  const d10 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 10) }));
  const d12 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 12) }));
  const maxSav = Math.max(...result.sav, 1);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <figure className="rounded-lg bg-surface p-3 shadow-card">
          <figcaption className="mb-2 font-display">{t(lang, "d3")}</figcaption>
          <SouthChart positions={d3} lang={lang} />
        </figure>
        <figure className="rounded-lg bg-surface p-3 shadow-card">
          <figcaption className="mb-2 font-display">{t(lang, "d7")}</figcaption>
          <SouthChart positions={d7} lang={lang} />
        </figure>
        <figure className="rounded-lg bg-surface p-3 shadow-card">
          <figcaption className="mb-2 font-display">{t(lang, "d10")}</figcaption>
          <SouthChart positions={d10} lang={lang} />
        </figure>
        <figure className="rounded-lg bg-surface p-3 shadow-card">
          <figcaption className="mb-2 font-display">{t(lang, "d12")}</figcaption>
          <SouthChart positions={d12} lang={lang} />
        </figure>
      </div>
      <Panel title={t(lang, "sav")}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {result.sav.map((n, i) => (
            <div key={i} className="rounded-md bg-elevated px-3 py-2">
              <p className="text-xs text-muted">{signName(lang, i)}</p>
              <p className="font-display text-lg tabular-nums">{n}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-accent" style={{ width: `${(n / maxSav) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <BavGrid result={result} lang={lang} />
    </div>
  );
}
