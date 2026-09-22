// Codepackr Astro - Detailed Astrological Analysis Panes
import { type ReactNode } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA, WEEK_EN, WEEK_TA, planetName } from "@/lib/astro/constants";
import { kaalSarpaName, type Analysis } from "@/lib/astro/analysis";
import type { ChartResult } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import {
  chevvaiText,
  dasaReading,
  dignityLabel,
  houseReading,
  planetReading,
  sadeSatiText,
} from "@/lib/astro/phalan";
import { allLifeAreas } from "@/lib/astro/predictions";
import { getRemediesFor, remedyDisclaimer } from "@/lib/astro/remedies";
import { strengthText, withStrength } from "@/lib/astro/strength";
import { BHAVA_EN, BHAVA_TA } from "@/lib/astro/tables";
import { cn } from "@/lib/utils";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}

export function PhalanPane({ result, analysis, lang }: { result: ChartResult; analysis: Analysis; lang: Lang }) {
  const moon = result.list.find((p) => p.id === "moon")!;
  const areas = allLifeAreas(analysis, lang);
  const toneClass = (tone: string) =>
    tone === "strong"
      ? "border-emerald-300/80 bg-emerald-50/50"
      : tone === "needs_effort"
        ? "border-amber-300/80 bg-amber-50/40"
        : "border-border bg-elevated/40";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title={t(lang, "naming")}>
          <p className="font-display text-3xl">{lang === "ta" ? analysis.naming.ta : analysis.naming.en}</p>
          <p className="mt-2 text-sm text-muted">
            {lang === "ta" ? NAK_TA[moon.nak] : NAK_EN[moon.nak]} · {t(lang, "pada")} {moon.pada}
          </p>
          <p className="mt-3 text-sm">
            {(lang === "ta" ? analysis.naming.allTa : analysis.naming.allEn).join(" · ")}
          </p>
        </Panel>
        <Panel title={t(lang, "lucky")}>
          <KeyTable
            rows={[
              [t(lang, "luckyNo"), analysis.lucky.numbers.join(", ")],
              [t(lang, "luckyColor"), lang === "ta" ? analysis.lucky.colorTa : analysis.lucky.colorEn],
              [t(lang, "luckyDay"), lang === "ta" ? WEEK_TA[analysis.lucky.day] : WEEK_EN[analysis.lucky.day]],
            ]}
          />
        </Panel>
      </div>

      {analysis.dasaNow ? (
        <Panel title={t(lang, "dasa")}>
          <p className="font-display text-xl">
            {planetName(analysis.dasaNow.maha, lang)} – {planetName(analysis.dasaNow.bhukti, lang)} –{" "}
            {planetName(analysis.dasaNow.antara, lang)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg">{dasaReading(analysis.dasaNow.maha, lang)}</p>
        </Panel>
      ) : null}

      <Panel title={t(lang, "lifeAreas")}>
        <p className="mb-4 text-xs text-muted">{t(lang, "lifeAreasHint")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {areas.map((area) => (
            <div key={area.id} className={cn("rounded-lg border px-3 py-3", toneClass(area.tone))}>
              <h4 className="font-display text-base font-semibold">{area.title}</h4>
              <div className="mt-2 space-y-2 text-sm leading-relaxed">
                {area.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={t(lang, "bhava")}>
        <ol className="flex flex-col gap-4">
          {analysis.bhavas.map((b) => {
            const r = houseReading(b, lang);
            return (
              <li key={b.house} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-medium">
                  {r.title} · {r.sign}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-fg/90">{r.body}</p>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title={t(lang, "planets")}>
        <ul className="flex flex-col gap-3">
          {analysis.grahas
            .filter((g) => g.id !== "gulika")
            .map((g) => {
              const r = planetReading(g, lang);
              return (
                <li key={g.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="font-medium">
                    {r.title} · {r.dignity}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{r.body}</p>
                </li>
              );
            })}
        </ul>
      </Panel>

      <Panel title={t(lang, "chevvai")}>
        <p className="text-sm leading-relaxed">{chevvaiText(analysis, lang)}</p>
        <p className="mt-3 text-sm leading-relaxed">{sadeSatiText(analysis, lang)}</p>
      </Panel>
    </div>
  );
}

export function RemediesPane({ analysis, lang }: { analysis: Analysis; lang: Lang }) {
  const items = getRemediesFor(analysis, lang);
  return (
    <div className="flex flex-col gap-5">
      <Panel title={t(lang, "tabRemedies")}>
        <p className="mb-4 text-sm text-muted">{remedyDisclaimer(lang)}</p>
        <ul className="flex flex-col gap-4">
          {items.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-elevated/30 px-4 py-3">
              <h4 className="font-display text-base font-semibold">{r.title}</h4>
              <p className="mt-2 text-sm leading-relaxed">{r.body}</p>
              {r.days?.length ? (
                <p className="mt-2 text-xs text-muted">
                  {lang === "ta" ? "நாள்: " : "Day: "}
                  {r.days.join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export function YogaPane({ analysis, lang }: { analysis: Analysis; lang: Lang }) {
  const yogas = analysis.yogas.filter((y) => y.kind === "yoga");
  const doshas = analysis.yogas.filter((y) => y.kind === "dosha");
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <Flag
          title={t(lang, "chevvai")}
          on={analysis.chevvai.present}
          lang={lang}
          body={chevvaiText(analysis, lang)}
        />
        <Flag
          title={t(lang, "kaalsarpa")}
          on={analysis.kaalSarpa.present}
          lang={lang}
          body={
            analysis.kaalSarpa.present
              ? `${kaalSarpaName(analysis.kaalSarpa.type, lang)} — ${
                  lang === "ta"
                    ? "ஏழு கிரகங்களும் ராகு-கேது அச்சுக்குள். பரிகாரம்: நாக தோஷ பூஜை."
                    : "All seven planets lie on one side of the Rahu–Ketu axis. Remedy: Naga puja."
                }`
              : lang === "ta"
                ? "ராகு-கேது அச்சுக்குள் ஏழு கிரகங்களும் அடங்கவில்லை."
                : "Planets are not boxed by the Rahu–Ketu axis."
          }
        />
        <Flag title={t(lang, "sadesati")} on={analysis.sadeSati.present} lang={lang} body={sadeSatiText(analysis, lang)} />
      </div>

      <Panel title={t(lang, "yogaTitle")}>
        <YogaList items={yogas} lang={lang} />
      </Panel>
      <Panel title={t(lang, "doshaTitle")}>
        <YogaList items={doshas} lang={lang} />
      </Panel>
    </div>
  );
}

function YogaList({ items, lang }: { items: Analysis["yogas"]; lang: Lang }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((y) => (
        <li key={y.id} className="py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium">{lang === "ta" ? y.nameTa : y.nameEn}</span>
            <span className={cn("text-xs", y.present ? "text-accent" : "text-muted")}>
              {y.present ? t(lang, "present") : t(lang, "absent")}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">{lang === "ta" ? y.detailTa : y.detailEn}</p>
        </li>
      ))}
    </ul>
  );
}

function Flag({ title, on, body, lang }: { title: string; on: boolean; body: string; lang: Lang }) {
  return (
    <section className={cn("rounded-lg p-4 shadow-card", on ? "bg-amber-50 border border-amber-300 text-amber-950" : "bg-surface border border-border/50 text-fg")}>
      <p className={cn("text-xs tracking-wide uppercase", on ? "text-amber-800 font-medium" : "text-muted")}>{title}</p>
      <p className={cn("font-display mt-1 text-xl font-semibold", on ? "text-accent" : "text-fg")}>{on ? t(lang, "present") : t(lang, "absent")}</p>
      <p className={cn("mt-2 text-sm leading-relaxed", on ? "text-amber-900" : "text-muted")}>{body}</p>
    </section>
  );
}

export function GocharaPane({ analysis, lang }: { analysis: Analysis; lang: Lang }) {
  const focus = analysis.gochara.filter((g) => ["saturn", "jupiter", "rahu", "ketu", "sun", "mars"].includes(g.id));
  return (
    <div className="flex flex-col gap-5">
      <Panel title={t(lang, "gocharaNow")}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3 py-3">{t(lang, "planet")}</th>
                <th className="px-3 py-3">{t(lang, "sign")}</th>
                <th className="px-3 py-3">{t(lang, "fromRasi")}</th>
                <th className="hidden px-3 py-3 sm:table-cell">{t(lang, "fromLagna")}</th>
                <th className="px-3 py-3">{t(lang, "favourable")}</th>
              </tr>
            </thead>
            <tbody>
              {analysis.gochara.map((g) => (
                <tr key={g.id} className="border-t border-border">
                  <td className="px-3 py-2.5 font-medium">{planetName(g.id, lang)}</td>
                  <td className="px-3 py-2.5">{signName(lang, g.sign)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{g.fromRasi}</td>
                  <td className="hidden px-3 py-2.5 tabular-nums sm:table-cell">{g.fromLagna}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-xs", g.favourable ? "text-accent" : "text-muted")}>
                      {g.favourable ? t(lang, "favourable") : t(lang, "unfavourable")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">{sadeSatiText(analysis, lang)}</p>
      </Panel>

      <Panel title={t(lang, "transitForecast")}>
        <p className="mb-3 text-xs text-muted">
          {lang === "ta"
            ? "சனி, குரு, ராகு, கேது முதலியவற்றின் இன்றைய கோசாரம் — ராசி / லக்னம் அடிப்படையில்."
            : "Today’s key slow transits relative to natal Moon (rasi) and lagna."}
        </p>
        <ul className="flex flex-col gap-3">
          {focus.map((g) => {
            const note =
              lang === "ta"
                ? g.favourable
                  ? `${planetName(g.id, "ta")} ராசியிலிருந்து ${g.fromRasi}-ஆம் இடத்தில் — ஆதரவுள்ள கோசாரம். முக்கிய முடிவுகளுக்கு இந்த காலத்தைப் பயன்படுத்தலாம்.`
                  : `${planetName(g.id, "ta")} ராசியிலிருந்து ${g.fromRasi}-ஆம் இடத்தில் — கவனம் தேவை. பொறுமையும் பரிகார நியமமும் உதவும்.`
                : g.favourable
                  ? `${planetName(g.id, "en")} is ${g.fromRasi} from rasi — supportive transit. Use the period for key steps.`
                  : `${planetName(g.id, "en")} is ${g.fromRasi} from rasi — caution. Patience and simple remedies help.`;
            return (
              <li key={g.id} className="rounded-lg border border-border bg-elevated/30 px-3 py-2">
                <p className="font-medium">
                  {planetName(g.id, lang)} · {signName(lang, g.sign)}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{note}</p>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

export function GrahaTable({ result, analysis, lang }: { result: ChartResult; analysis: Analysis; lang: Lang }) {
  const strengthened = withStrength(analysis);
  const byId = Object.fromEntries(strengthened.map((g) => [g.id, g]));
  return (
    <div className="overflow-x-auto rounded-lg bg-surface shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-3 py-3 sm:px-4">{t(lang, "planet")}</th>
            <th className="px-3 py-3 sm:px-4">{t(lang, "sign")}</th>
            <th className="px-3 py-3">{t(lang, "house")}</th>
            <th className="hidden px-4 py-3 sm:table-cell">{t(lang, "dignity")}</th>
            <th className="hidden px-4 py-3 md:table-cell">{t(lang, "strength")}</th>
            <th className="px-3 py-3 sm:px-4">{t(lang, "nakshatra")}</th>
            <th className="hidden px-4 py-3 md:table-cell">{t(lang, "navamsa")}</th>
          </tr>
        </thead>
        <tbody>
          {result.list.map((p) => {
            const g = byId[p.id as keyof typeof byId];
            return (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-2.5 font-medium sm:px-4">
                  {planetName(p.id, lang)}
                  {p.retrograde && p.id !== "lagna" ? (
                    <span className="ml-1 text-xs text-muted">{t(lang, "retro")}</span>
                  ) : null}
                  {g?.combust ? <span className="ml-1 text-xs text-muted">{t(lang, "combust")}</span> : null}
                </td>
                <td className="px-3 py-2.5 sm:px-4">
                  <span className="block">{signName(lang, p.sign)}</span>
                  <span className="block text-xs tabular-nums text-muted sm:hidden">{p.dms}</span>
                </td>
                <td className="px-3 py-2.5 tabular-nums">{p.house}</td>
                <td className="hidden px-4 py-2.5 sm:table-cell">
                  {g && p.id !== "lagna" ? dignityLabel(g.dignity, lang) : "—"}
                </td>
                <td className="hidden px-4 py-2.5 md:table-cell">
                  {g && p.id !== "lagna" && p.id !== "gulika" ? strengthText(g.strength, lang) : "—"}
                </td>
                <td className="px-3 py-2.5 sm:px-4">
                  {lang === "ta" ? NAK_TA[p.nak] : NAK_EN[p.nak]} {p.pada}
                </td>
                <td className="hidden px-4 py-2.5 md:table-cell">{signName(lang, p.navamsa)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BavGrid({ result, lang }: { result: ChartResult; lang: Lang }) {
  return (
    <Panel title={t(lang, "bhinna")}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-muted uppercase">
            <tr>
              <th className="px-2 py-2">{t(lang, "planet")}</th>
              {SIGNS_TA.map((_, i) => (
                <th key={i} className="px-1 py-2 text-center">
                  {lang === "ta" ? SIGNS_TA[i].slice(0, 2) : SIGNS_EN[i].slice(0, 2)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(result.bav) as (keyof typeof result.bav)[]).map((id) => (
              <tr key={id} className="border-t border-border">
                <td className="px-2 py-1.5 font-medium">{planetName(id, lang)}</td>
                {result.bav[id].map((n, i) => (
                  <td
                    key={i}
                    className={cn("px-1 py-1.5 text-center tabular-nums", n >= 5 ? "font-semibold" : "text-muted")}
                  >
                    {n}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="px-2 py-1.5 font-medium">{t(lang, "sav")}</td>
              {result.sav.map((n, i) => (
                <td key={i} className="px-1 py-1.5 text-center font-semibold tabular-nums">
                  {n}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function BhavaStrip({ analysis, lang }: { analysis: Analysis; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {analysis.bhavas.map((b) => (
        <div key={b.house} className="rounded-md bg-elevated px-3 py-2">
          <p className="text-xs text-muted">
            {b.house}. {lang === "ta" ? BHAVA_TA[b.house - 1].split(" · ")[0] : BHAVA_EN[b.house - 1].split(" · ")[0]}
          </p>
          <p className="mt-1 text-sm font-medium">
            {b.occupants.length ? b.occupants.map((id) => planetName(id, lang)).join(", ") : t(lang, "emptyHouse")}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg bg-surface p-4 shadow-card sm:p-5">
      <h3 className="font-display mb-3 text-lg">{title}</h3>
      {children}
    </section>
  );
}

export function KeyTable({ rows }: { rows: string[][] }) {
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
