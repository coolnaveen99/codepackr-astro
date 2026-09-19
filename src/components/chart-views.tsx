import { Printer } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  KARANA_EN,
  KARANA_TA,
  NAK_EN,
  NAK_TA,
  PLANETS,
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
} from "@/lib/astro/constants";
import {
  ashtakoot,
  bhuktis,
  formatClock,
  formatJD,
  type BodyPos,
  type ChartResult,
  vargaSign,
} from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { planetLabel, SouthChart } from "@/components/south-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tab = "chart" | "pan" | "dasa" | "varga" | "match";

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
  const moon = find(result.list, "moon");
  const lagna = find(result.list, "lagna");
  const tabs: { id: Tab; key: "tabChart" | "tabPan" | "tabDasa" | "tabVarga" | "tabMatch" }[] = [
    { id: "chart", key: "tabChart" },
    { id: "pan", key: "tabPan" },
    { id: "dasa", key: "tabDasa" },
    { id: "varga", key: "tabVarga" },
    { id: "match", key: "tabMatch" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-ink px-5 py-6 text-accent-fg shadow-card sm:px-8">
        <p className="text-xs tracking-widest text-accent-fg/60 uppercase">{result.input.name}</p>
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
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3" data-print-hide>
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
        <Button variant="outline" size="sm" className="no-print" onClick={() => window.print()}>
          <Printer className="size-4" />
          {t(lang, "print")}
        </Button>
      </div>

      {tab === "chart" && <ChartsPane result={result} lang={lang} />}
      {tab === "pan" && <PanchangPane result={result} lang={lang} />}
      {tab === "dasa" && <DasaPane result={result} lang={lang} />}
      {tab === "varga" && <VargaPane result={result} lang={lang} />}
      {tab === "match" && <MatchPane result={result} lang={lang} />}
    </div>
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

function ChartsPane({ result, lang }: { result: ChartResult; lang: Lang }) {
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
      <div className="overflow-x-auto rounded-lg bg-surface shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-3 py-3 sm:px-4">{t(lang, "planet")}</th>
              <th className="px-3 py-3 sm:px-4">{t(lang, "sign")}</th>
              <th className="hidden px-4 py-3 sm:table-cell">{t(lang, "longitude")}</th>
              <th className="px-3 py-3 sm:px-4">{t(lang, "nakshatra")}</th>
              <th className="hidden px-4 py-3 md:table-cell">{t(lang, "navamsa")}</th>
            </tr>
          </thead>
          <tbody>
            {result.list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-2.5 font-medium sm:px-4">
                  {planetLabel(p.id, lang)}
                  {p.retrograde && p.id !== "lagna" ? (
                    <span className="ml-1 text-xs text-muted">{t(lang, "retro")}</span>
                  ) : null}
                </td>
                <td className="px-3 py-2.5 sm:px-4">
                  <span className="block">{signName(lang, p.sign)}</span>
                  <span className="block text-xs tabular-nums text-muted sm:hidden">{p.dms}</span>
                </td>
                <td className="hidden px-4 py-2.5 tabular-nums sm:table-cell">{p.dms}</td>
                <td className="px-3 py-2.5 sm:px-4">
                  {nakName(lang, p.nak)} {p.pada}
                </td>
                <td className="hidden px-4 py-2.5 md:table-cell">{signName(lang, p.navamsa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function span(result: ChartResult, w: { start: number; end: number }) {
  return `${formatClock(w.start, result.input.tz)} – ${formatClock(w.end, result.input.tz)}`;
}

function DasaPane({ result, lang }: { result: ChartResult; lang: Lang }) {
  const nowJD = Date.now() / 86400000 + 2440587.5;
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Panel title={t(lang, "dasa")}>
      <p className="mb-4 text-sm text-muted">
        {nakName(lang, result.dasa.nak)} · {t(lang, "pada")} {result.dasa.pada}
      </p>
      <ul className="flex flex-col gap-2">
        {result.dasa.periods.map((p) => {
          const current = nowJD >= p.startJD && nowJD < p.endJD;
          const lord = PLANETS.find((x) => x.id === p.lord);
          const label = lord ? (lang === "ta" ? lord.ta : lord.en) : p.lord;
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
                    const bl = PLANETS.find((x) => x.id === b.lord);
                    const bn = bl ? (lang === "ta" ? bl.ta : bl.en) : b.lord;
                    const on = nowJD >= b.startJD && nowJD < b.endJD;
                    return (
                      <li key={b.lord + b.startJD} className="flex justify-between">
                        <span className={on ? "font-semibold" : ""}>
                          {t(lang, "bhukti")} {bn}
                        </span>
                        <span className={current ? "text-accent-fg/60" : "text-muted"}>
                          {formatJD(b.startJD, result.input.tz).slice(0, 10)}
                        </span>
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
  const d10 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 10) }));
  const d12 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 12) }));
  const maxSav = Math.max(...result.sav, 1);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <figure className="rounded-lg bg-surface p-3 shadow-card">
          <figcaption className="mb-2 font-display">{t(lang, "d3")}</figcaption>
          <SouthChart positions={d3} lang={lang} />
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
    </div>
  );
}

function MatchPane({ result, lang }: { result: ChartResult; lang: Lang }) {
  const [name, setName] = useState(lang === "ta" ? "இணையர்" : "Partner");
  const [nak, setNak] = useState(16);
  const [done, setDone] = useState(true);
  const score = useMemo(() => {
    const lon = (nak + 0.5) * (360 / 27);
    return ashtakoot(result.bodies.moon, lon);
  }, [nak, result.bodies.moon]);

  return (
    <Panel title={t(lang, "koot")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="pname">{t(lang, "partnerName")}</Label>
          <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pnak">{t(lang, "partner")}</Label>
          <select
            id="pnak"
            value={nak}
            onChange={(e) => setNak(Number(e.target.value))}
            className="h-11 w-full rounded-md bg-surface px-3 text-sm shadow-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            {(lang === "ta" ? NAK_TA : NAK_EN).map((n, i) => (
              <option key={n} value={i}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button className="mt-4" type="button" onClick={() => setDone(true)}>
        {t(lang, "seeMatch")}
      </Button>
      {done ? (
        <div className="mt-6">
          <p className="font-display text-3xl tabular-nums">
            {score.total}
            <span className="text-lg text-muted">{t(lang, "of36")}</span>
          </p>
          <ul className="mt-4 divide-y divide-border">
            {score.items.map((it) => (
              <li key={it.id} className="flex items-center justify-between py-2 text-sm">
                <span>{lang === "ta" ? it.ta : it.en}</span>
                <span className="tabular-nums">
                  {it.pts} / {it.max}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg bg-surface p-4 shadow-card sm:p-5">
      <h3 className="font-display mb-3 text-lg">{title}</h3>
      {children}
    </section>
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
