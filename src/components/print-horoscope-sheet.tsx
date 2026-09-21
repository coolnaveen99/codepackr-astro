// Codepackr Astro - Printable Horoscope Sheet (A4 format)
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
  type PlanetId,
} from "@/lib/astro/constants";
import { analyse, type Analysis } from "@/lib/astro/analysis";
import { bhuktis, formatJD, vargaSign, type ChartResult } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { chevvaiText, dasaReading, dignityLabel, houseReading, planetReading, sadeSatiText } from "@/lib/astro/phalan";
import { BHAVA_EN, BHAVA_TA, SIGN_LORD } from "@/lib/astro/tables";
import { SouthChart } from "@/components/south-chart";
import { Watermark } from "@/components/watermark";
import { cn } from "@/lib/utils";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}

function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

function find(list: ChartResult["list"], id: string) {
  return list.find((p) => p.id === id) || list[0];
}

export function PrintHoroscopeSheet({
  result,
  analysis,
  lang,
}: {
  result: ChartResult;
  analysis: ReturnType<typeof analyse>;
  lang: Lang;
}) {
  const moon = find(result.list, "moon");
  const lagna = find(result.list, "lagna");
  const sun = find(result.list, "sun");

  const dob = `${String(result.input.day).padStart(2, "0")}-${String(result.input.month).padStart(2, "0")}-${result.input.year}`;
  const tob = `${String(result.input.hour).padStart(2, "0")}:${String(result.input.minute).padStart(2, "0")}`;

  // Varga positions
  const d3 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 3) }));
  const d7 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 7) }));
  const d10 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 10) }));
  const d12 = result.list.map((p) => ({ ...p, sign: vargaSign(p.lon, 12) }));

  const maxSav = Math.max(...result.sav, 1);
  const byId = Object.fromEntries(analysis.grahas.map((g) => [g.id, g]));

  const yogas = analysis.yogas.filter((y) => y.kind === "yoga");
  const doshas = analysis.yogas.filter((y) => y.kind === "dosha");

  return (
    <div className="print-horoscope-report w-full max-w-[210mm] mx-auto text-ink font-sans">
      {/* =========================================================================
          PAGE 1: Janma Kundali & Graha Nilai
         ========================================================================= */}
      <div className="print-page print-page-break relative overflow-hidden mb-8 pb-4 border-b-2 border-dashed border-border/80">
        <Watermark />
        <div className="relative z-1">
        {/* Sacred Header */}
        <div className="flex flex-col items-center justify-center border-b border-border/80 pb-3 text-center">
          <p className="text-[11px] tracking-widest text-accent font-semibold mt-1">
            {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink">
            {lang === "ta" ? "தமிழ் முழு ஜாதகக் கணிப்பு" : "Complete Vedic Horoscope Report"}
          </h1>
          <p className="text-xs text-muted">
            {result.input.place} &bull; Lat: {result.input.lat.toFixed(2)}°, Lon: {result.input.lon.toFixed(2)}° &bull;{" "}
            {result.school === "thirukanitham"
              ? lang === "ta"
                ? "திருக்கணித முறை (Thirukanitham)"
                : "Thirukanitham System"
              : lang === "ta"
                ? "வாக்கிய முறை (Vakya)"
                : "Vakya System"}{" "}
            &bull; {lang === "ta" ? "லஹரி அயனாம்சம்" : "Lahiri Ayanamsa"}
          </p>
        </div>

        {/* Section 1: Janma Particulars & Panchangam Summary */}
        <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs shadow-xs">
          <h3 className="font-display font-semibold text-accent mb-2 pb-1 border-b border-border/60">
            {lang === "ta" ? "1. ஜாதக மூல விவரங்கள் & பஞ்சாங்கம்" : "1. Birth Particulars & Panchangam"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-muted block">{t(lang, "name")}:</span>
              <strong className="font-semibold text-ink">{result.input.name || "—"}</strong>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "பாலினம்" : "Gender"}:</span>
              <strong className="font-semibold text-ink">
                {result.input.sex === "M"
                  ? lang === "ta"
                    ? "மணமகன்"
                    : "Groom"
                  : result.input.sex === "F"
                    ? lang === "ta"
                      ? "மணமகள்"
                      : "Bride"
                    : "—"}
              </strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "date")}:</span>
              <span className="font-medium">{dob}</span>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "time")}:</span>
              <span className="font-medium">{tob} ({result.input.tz >= 0 ? `+${result.input.tz}` : result.input.tz} GMT)</span>
            </div>

            <div>
              <span className="text-muted block">{t(lang, "lagna")}:</span>
              <strong className="font-semibold text-accent">{signName(lang, lagna.sign)}</strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "rasi")}:</span>
              <strong className="font-semibold text-accent">{signName(lang, moon.sign)}</strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "nakshatra")}:</span>
              <span className="font-medium">
                {nakName(lang, moon.nak)} ({t(lang, "pada")} {moon.pada})
              </span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "நட்சத்திர அதிபதி" : "Star Lord"}:</span>
              <span className="font-medium">{planetName(result.dasa.lord as PlanetId, lang)}</span>
            </div>

            <div>
              <span className="text-muted block">{lang === "ta" ? "திதி" : "Tithi"}:</span>
              <span className="font-medium">
                {result.pan.paksha === "shukla" ? (lang === "ta" ? "சுக்ல பக்ஷம்" : "Shukla") : (lang === "ta" ? "கிருஷ்ண பக்ஷம்" : "Krishna")}{" "}
                {lang === "ta" ? TITHI_TA[result.pan.tithiIdx] : TITHI_EN[result.pan.tithiIdx]}
              </span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "நித்திய யோகம்" : "Yoga"}:</span>
              <span className="font-medium">{lang === "ta" ? YOGA_TA[result.pan.yogaNum] : YOGA_EN[result.pan.yogaNum]}</span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "கரணம்" : "Karana"}:</span>
              <span className="font-medium">{lang === "ta" ? KARANA_TA[result.pan.karanaIdx] : KARANA_EN[result.pan.karanaIdx]}</span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "கிழமை" : "Weekday"}:</span>
              <span className="font-medium">{lang === "ta" ? WEEK_TA[result.weekday] : WEEK_EN[result.weekday]}</span>
            </div>

            <div>
              <span className="text-muted block">{t(lang, "chevvai")}:</span>
              <span className={cn("font-medium", analysis.chevvai.present ? "text-accent" : "text-ink")}>
                {analysis.chevvai.present ? t(lang, "present") : t(lang, "absent")}
              </span>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "sadesati")}:</span>
              <span className="font-medium">
                {analysis.sadeSati.present ? t(lang, "present") : t(lang, "absent")}
              </span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "சூரிய உதயம்" : "Sunrise"}:</span>
              <span className="font-medium">{formatJD(result.sunriseJD, result.input.tz).slice(11, 16)}</span>
            </div>
            <div>
              <span className="text-muted block">{lang === "ta" ? "அதிர்ஷ்ட எழுத்துக்கள்" : "Naming Syllables"}:</span>
              <span className="font-medium text-accent">
                {(lang === "ta" ? analysis.naming.allTa : analysis.naming.allEn).slice(0, 4).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Main Rasi & Navamsa Charts */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta" ? "2. ராசி & நவாம்ச கட்டங்கள் (D1 & D9 Charts)" : "2. Rasi & Navamsa Charts (D1 & D9)"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "ராசி கட்டம் (D1 - Janma Rasi)" : "Rasi Chart (D1 - Birth Chart)"}
              </p>
              <SouthChart
                positions={result.list}
                lang={lang}
                mode="sign"
                caption={t(lang, "d1")}
                theme="light"
              />
            </div>
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "நவாம்ச கட்டம் (D9 - Navamsam)" : "Navamsa Chart (D9 - Dharma/Marriage)"}
              </p>
              <SouthChart
                positions={result.list}
                lang={lang}
                mode="navamsa"
                caption={t(lang, "d9")}
                theme="light"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Planetary Positions Table */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1">
            {lang === "ta" ? "3. கிரக நிலைகள் அட்டவணை (Planetary Positions & Dignity)" : "3. Planetary Positions & Dignities"}
          </h3>
          <div className="overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 text-muted uppercase text-[10px]">
                <tr>
                  <th className="px-2 py-1.5">{t(lang, "planet")}</th>
                  <th className="px-2 py-1.5">{t(lang, "sign")}</th>
                  <th className="px-2 py-1.5">{lang === "ta" ? "பாகை / கலை" : "Deg DMS"}</th>
                  <th className="px-2 py-1.5">{t(lang, "house")}</th>
                  <th className="px-2 py-1.5">{t(lang, "dignity")}</th>
                  <th className="px-2 py-1.5">{t(lang, "nakshatra")}</th>
                  <th className="px-2 py-1.5">{lang === "ta" ? "நவாம்சம்" : "Navamsa"}</th>
                  <th className="px-2 py-1.5">{lang === "ta" ? "குறிப்பு" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {result.list.map((p) => {
                  const g = byId[p.id];
                  return (
                    <tr key={p.id} className="border-t border-border/60 hover:bg-elevated/30">
                      <td className="px-2 py-1 font-semibold">
                        {planetName(p.id, lang)}
                      </td>
                      <td className="px-2 py-1">{signName(lang, p.sign)}</td>
                      <td className="px-2 py-1 tabular-nums font-mono text-[11px]">{p.dms}</td>
                      <td className="px-2 py-1 tabular-nums">{p.house}</td>
                      <td className="px-2 py-1">
                        {g && p.id !== "lagna" ? dignityLabel(g.dignity, lang) : "—"}
                      </td>
                      <td className="px-2 py-1">
                        {lang === "ta" ? NAK_TA[p.nak] : NAK_EN[p.nak]} ({p.pada})
                      </td>
                      <td className="px-2 py-1">{signName(lang, p.navamsa)}</td>
                      <td className="px-2 py-1 text-[11px] text-muted">
                        {p.retrograde && p.id !== "lagna" && (
                          <span className="text-amber-800 font-medium mr-1">{t(lang, "retro")}</span>
                        )}
                        {g?.combust && <span className="text-red-700 font-medium">{t(lang, "combust")}</span>}
                        {g?.vargottama && <span className="text-emerald-700 font-medium">{lang === "ta" ? "வர்கோத்தமம்" : "Vargottama"}</span>}
                        {!p.retrograde && !g?.combust && !g?.vargottama && "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dasa balance banner */}
        <div className="mt-2.5 rounded-md border border-border bg-elevated/40 px-3 py-1.5 text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-accent">{lang === "ta" ? "பிறப்பில் தசா இருப்பு" : "Dasa Balance at Birth"}: </span>
            <span className="font-medium">
              {planetName(result.dasa.lord as PlanetId, lang)} {t(lang, "tabDasa")} —{" "}
              {result.dasa.periods[0].years.toFixed(2)} {lang === "ta" ? "ஆண்டுகள்" : "years"}
            </span>
          </div>
          <span className="text-[11px] text-muted font-mono">120 Year Vimshottari Cycle</span>
        </div>

        {/* Page 1 Footer */}
        <footer className="mt-3 flex flex-col gap-1 border-t border-border pt-2 text-xs text-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-accent">astro.codepackr.com</span>
              <span className="mx-1 text-border">&bull;</span>
              <span className="text-ink font-medium">codepackr@gmail.com</span>
            </div>
            <p className="text-[11px] font-medium">{lang === "ta" ? "பக்கம் 1 / 4 • மூல ஜாதகக் கணிப்பு" : "Page 1 of 4 • Primary Horoscope"}</p>
          </div>
          <p className="text-[9.5px] text-muted italic">
            * {t(lang, "pdfDisclaimerShort")}
          </p>
        </footer>
        </div>
      </div>

      {/* =========================================================================
          PAGE 2: 12 Bhavas & Full Vimshottari Dasa-Bhukti Periods
         ========================================================================= */}
      <div className="print-page print-page-break relative overflow-hidden mb-8 pb-4 border-b-2 border-dashed border-border/80">
        <Watermark />
        <div className="relative z-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <p className="font-display text-sm font-bold text-ink">
              {result.input.name || "ஜாதகம்"} &bull; {lang === "ta" ? "பாவகம் & விம்சொத்தரி தசா-புக்தி" : "Bhavas & Dasa-Bhukti"}
            </p>
            <p className="text-[10px] text-muted">{dob} &bull; {result.input.place}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-accent">astro.codepackr.com</span>
            <p className="text-[10px] text-muted">codepackr@gmail.com</p>
          </div>
        </div>

        {/* Section 4: 12 Bhavas Detailed Analysis */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta" ? "4. பன்னிரு பாவங்கள் விவரம் (12 Bhavas / Houses Analysis)" : "4. Twelve Houses (Bhavas) Analysis"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {analysis.bhavas.map((b) => {
              const signIdx = (lagna.sign + b.house - 1) % 12;
              const lord = SIGN_LORD[signIdx];
              const bhavaName = lang === "ta" ? BHAVA_TA[b.house - 1] : BHAVA_EN[b.house - 1];
              return (
                <div key={b.house} className="rounded-md border border-border bg-surface p-2 text-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1 mb-1">
                    <span className="font-bold text-accent">
                      {b.house}. {bhavaName.split(" · ")[0]}
                    </span>
                    <span className="text-[10px] bg-elevated px-1 rounded text-muted">
                      SAV: {b.sav}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-snug">
                    <span className="font-medium text-ink">{signName(lang, signIdx)}</span> (
                    {lang === "ta" ? "அதிபதி" : "Lord"}: {planetName(lord, lang)})
                  </p>
                  <p className="text-[11px] mt-1">
                    <span className="text-muted">{lang === "ta" ? "கிரகங்கள்" : "Planets"}: </span>
                    <strong className="text-ink">
                      {b.occupants.length
                        ? b.occupants.map((id) => planetName(id, lang)).join(", ")
                        : lang === "ta"
                          ? "கிரகங்கள் இல்லை"
                          : "None"}
                    </strong>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Full Vimshottari Mahadasa & Bhukti Timeline */}
        <div className="mt-4">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta"
              ? "5. விம்சொத்தரி மகா தசா & புக்தி கால அட்டவணை (Vimshottari Dasa & Bhukti System)"
              : "5. Complete Vimshottari Mahadasa & Bhukti Periods"}
          </h3>

          {/* 9 Mahadasas Table */}
          <div className="rounded-md border border-border bg-surface overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 text-muted uppercase text-[10px]">
                <tr>
                  <th className="px-2.5 py-1.5">{lang === "ta" ? "மகா தசா நாதன்" : "Mahadasa Lord"}</th>
                  <th className="px-2.5 py-1.5">{lang === "ta" ? "ஆரம்ப தேதி" : "Start Date"}</th>
                  <th className="px-2.5 py-1.5">{lang === "ta" ? "முடிவு தேதி" : "End Date"}</th>
                  <th className="px-2.5 py-1.5">{lang === "ta" ? "கால அளவு" : "Duration"}</th>
                  <th className="px-2.5 py-1.5">{lang === "ta" ? "தற்போதைய நிலை" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {result.dasa.periods.map((p, idx) => {
                  const now = Date.now();
                  // Approximate JD conversion for status check
                  const startMs = (p.startJD - 2440587.5) * 86400000;
                  const endMs = (p.endJD - 2440587.5) * 86400000;
                  const isCurrent = now >= startMs && now < endMs;
                  const isPast = now >= endMs;

                  return (
                    <tr
                      key={p.lord + idx}
                      className={cn(
                        "border-t border-border/60",
                        isCurrent ? "bg-accent/10 font-semibold" : ""
                      )}
                    >
                      <td className="px-2.5 py-1">
                        {planetName(p.lord, lang)} {t(lang, "tabDasa")}
                      </td>
                      <td className="px-2.5 py-1 font-mono text-[11px]">
                        {formatJD(p.startJD, result.input.tz).slice(0, 10)}
                      </td>
                      <td className="px-2.5 py-1 font-mono text-[11px]">
                        {formatJD(p.endJD, result.input.tz).slice(0, 10)}
                      </td>
                      <td className="px-2.5 py-1 tabular-nums">
                        {p.years.toFixed(2)} {lang === "ta" ? "வருடம்" : "yrs"}
                      </td>
                      <td className="px-2.5 py-1">
                        {isCurrent ? (
                          <span className="text-accent font-bold">
                            {lang === "ta" ? "★ நடப்பு தசா" : "★ Running"}
                          </span>
                        ) : isPast ? (
                          <span className="text-muted">{lang === "ta" ? "முடிந்தது" : "Past"}</span>
                        ) : (
                          <span className="text-ink">{lang === "ta" ? "வருங்காலம்" : "Upcoming"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bhukti Breakdown for Current / Selected Dasa */}
          {result.dasa.periods.length > 0 && (
            <div className="mt-3 rounded-md border border-border bg-surface p-2.5">
              <h4 className="font-display text-xs font-semibold text-ink mb-1.5">
                {lang === "ta"
                  ? "நடப்பு / ஆரம்ப தசா புக்திகள் (Sub-period Bhuktis):"
                  : "Dasa Bhuktis (Sub-periods):"}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {bhuktis(result.dasa.periods[0]).map((b, bIdx) => (
                  <div
                    key={b.lord + bIdx}
                    className="rounded border border-border/60 bg-elevated/40 p-1.5 text-[11px]"
                  >
                    <p className="font-semibold text-accent">
                      {t(lang, "bhukti")} {planetName(b.lord, lang)}
                    </p>
                    <p className="text-[10px] text-muted font-mono mt-0.5">
                      {formatJD(b.startJD, result.input.tz).slice(0, 10)} → {formatJD(b.endJD, result.input.tz).slice(0, 10)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Page 2 Footer */}
        <footer className="mt-4 flex flex-col gap-1 border-t border-border pt-2 text-xs text-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-accent">astro.codepackr.com</span>
              <span className="mx-1 text-border">&bull;</span>
              <span className="text-ink font-medium">codepackr@gmail.com</span>
            </div>
            <p className="text-[11px] font-medium">{lang === "ta" ? "பக்கம் 2 / 4 • பாவகம் & தசா-புக்தி" : "Page 2 of 4 • Bhavas & Dasa Timeline"}</p>
          </div>
          <p className="text-[9.5px] text-muted italic">
            * {t(lang, "pdfDisclaimerShort")}
          </p>
        </footer>
        </div>
      </div>

      {/* =========================================================================
          PAGE 3: Yogas, Doshas, Phalan & Gocharam
         ========================================================================= */}
      <div className="print-page print-page-break relative overflow-hidden mb-8 pb-4 border-b-2 border-dashed border-border/80">
        <Watermark />
        <div className="relative z-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <p className="font-display text-sm font-bold text-ink">
              {result.input.name || "ஜாதகம்"} &bull; {lang === "ta" ? "யோகங்கள், பலன்கள் & கோச்சாரம்" : "Yogas, Phalan & Transits"}
            </p>
            <p className="text-[10px] text-muted">{dob} &bull; {result.input.place}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-accent">astro.codepackr.com</span>
            <p className="text-[10px] text-muted">codepackr@gmail.com</p>
          </div>
        </div>

        {/* Section 6: Auspicious Yogas & Doshas */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta" ? "6. யோகங்கள் & தோஷங்கள் விவரம் (Yogas & Doshas)" : "6. Astrological Yogas & Doshas"}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className={cn("rounded-md border p-2 text-xs", analysis.chevvai.present ? "border-amber-300 bg-amber-50" : "border-border bg-surface")}>
              <p className="font-bold text-ink">{t(lang, "chevvai")}</p>
              <p className="font-semibold text-accent mt-0.5">{analysis.chevvai.present ? t(lang, "present") : t(lang, "absent")}</p>
              <p className="text-[11px] text-muted mt-1 leading-snug">{chevvaiText(analysis, lang)}</p>
            </div>
            <div className={cn("rounded-md border p-2 text-xs", analysis.kaalSarpa.present ? "border-amber-300 bg-amber-50" : "border-border bg-surface")}>
              <p className="font-bold text-ink">{t(lang, "kaalsarpa")}</p>
              <p className="font-semibold text-accent mt-0.5">{analysis.kaalSarpa.present ? t(lang, "present") : t(lang, "absent")}</p>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                {analysis.kaalSarpa.present
                  ? lang === "ta" ? "ராகு-கேது அச்சுக்குள் கிரகங்கள் அடக்கம்." : "Planets bound in Rahu-Ketu axis."
                  : lang === "ta" ? "காலசர்ப்ப தோஷம் இல்லை." : "No Kaal Sarpa dosha."}
              </p>
            </div>
            <div className={cn("rounded-md border p-2 text-xs", analysis.sadeSati.present ? "border-amber-300 bg-amber-50" : "border-border bg-surface")}>
              <p className="font-bold text-ink">{t(lang, "sadesati")}</p>
              <p className="font-semibold text-accent mt-0.5">{analysis.sadeSati.present ? t(lang, "present") : t(lang, "absent")}</p>
              <p className="text-[11px] text-muted mt-1 leading-snug">{sadeSatiText(analysis, lang)}</p>
            </div>
          </div>

          {/* Identified Yogas List */}
          <div className="mt-2.5 rounded-md border border-border bg-surface p-2.5">
            <h4 className="font-display text-xs font-semibold text-accent mb-1">
              {lang === "ta" ? "அமைந்துள்ள விசேஷ யோகங்கள்:" : "Identified Major Yogas:"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {yogas.slice(0, 6).map((y) => (
                <div key={y.id} className="border-b border-border/40 pb-1.5 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{lang === "ta" ? y.nameTa : y.nameEn}</span>
                    <span className="text-[10px] text-accent font-semibold">{t(lang, "present")}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-tight mt-0.5">{lang === "ta" ? y.detailTa : y.detailEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 7: General Readings & Predictions */}
        <div className="mt-3.5">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta" ? "7. ஜாதக பொதுப் பலன்கள் & அதிர்ஷ்டக் குறிப்புகள்" : "7. General Horoscope Readings & Lucky Factors"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border bg-surface p-2.5 text-xs space-y-1.5">
              <div>
                <span className="font-semibold text-ink block">{lang === "ta" ? "லக்ன பலன்:" : "Lagna Reading:"}</span>
                <p className="text-[11px] text-muted leading-relaxed">
                  {lang === "ta"
                    ? `${signName(lang, lagna.sign)} லக்னத்தில் பிறந்தவர் கம்பீரமான தோற்றம், சுறுசுறுப்பான இயல்பு, தலைமைப் பண்பு மற்றும் சுயமுயற்சியால் வாழ்வில் முன்னேறும் ஆற்றல் கொண்டவர்.`
                    : `Born with ${signName(lang, lagna.sign)} Ascendant, giving strong constitution, leadership attributes, vitality and steady growth through self-effort.`}
                </p>
              </div>
              <div>
                <span className="font-semibold text-ink block">{lang === "ta" ? "ராசி & நட்சத்திர பலன்:" : "Moon & Star Reading:"}</span>
                <p className="text-[11px] text-muted leading-relaxed">
                  {lang === "ta"
                    ? `${signName(lang, moon.sign)} ராசி, ${nakName(lang, moon.nak)} நட்சத்திரத்தில் பிறந்தவர் கூர்மையான மதிநுட்பம், தர்ம சிந்தனை மற்றும் நற்கல்வி கொண்டவர்.`
                    : `Born in ${signName(lang, moon.sign)} Moon sign, ${nakName(lang, moon.nak)} star, bestowing sharp intelligence, righteous mind and steady achievements.`}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface p-2.5 text-xs">
              <span className="font-semibold text-ink block mb-1">{lang === "ta" ? "அதிர்ஷ்டக் கூறுகள்:" : "Lucky Attributes:"}</span>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-border/60">
                    <td className="py-1 text-muted">{t(lang, "luckyNo")}</td>
                    <td className="py-1 font-semibold text-right">{analysis.lucky.numbers.join(", ")}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-1 text-muted">{t(lang, "luckyColor")}</td>
                    <td className="py-1 font-semibold text-right">{lang === "ta" ? analysis.lucky.colorTa : analysis.lucky.colorEn}</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-1 text-muted">{t(lang, "luckyDay")}</td>
                    <td className="py-1 font-semibold text-right">{lang === "ta" ? WEEK_TA[analysis.lucky.day] : WEEK_EN[analysis.lucky.day]}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-muted">{lang === "ta" ? "பெயர் எழுத்துக்கள்" : "Naming Syllables"}</td>
                    <td className="py-1 font-semibold text-accent text-right">
                      {(lang === "ta" ? analysis.naming.allTa : analysis.naming.allEn).join(" · ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 8: Current Gochara Transits */}
        <div className="mt-3.5">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta" ? "8. தற்போதைய கோச்சாரம் (Current Planetary Transits)" : "8. Current Planetary Transits (Gochara)"}
          </h3>
          <div className="overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 text-muted uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-1.5">{t(lang, "planet")}</th>
                  <th className="px-3 py-1.5">{t(lang, "sign")}</th>
                  <th className="px-3 py-1.5">{t(lang, "fromRasi")}</th>
                  <th className="px-3 py-1.5">{t(lang, "fromLagna")}</th>
                  <th className="px-3 py-1.5">{t(lang, "favourable")}</th>
                </tr>
              </thead>
              <tbody>
                {analysis.gochara.map((g) => (
                  <tr key={g.id} className="border-t border-border/60">
                    <td className="px-3 py-1 font-semibold">{planetName(g.id, lang)}</td>
                    <td className="px-3 py-1">{signName(lang, g.sign)}</td>
                    <td className="px-3 py-1 tabular-nums">{g.fromRasi}</td>
                    <td className="px-3 py-1 tabular-nums">{g.fromLagna}</td>
                    <td className="px-3 py-1">
                      <span className={cn("text-xs font-medium", g.favourable ? "text-accent" : "text-muted")}>
                        {g.favourable ? t(lang, "favourable") : t(lang, "unfavourable")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page 3 Footer */}
        <footer className="mt-4 flex flex-col gap-1 border-t border-border pt-2 text-xs text-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-accent">astro.codepackr.com</span>
              <span className="mx-1 text-border">&bull;</span>
              <span className="text-ink font-medium">codepackr@gmail.com</span>
            </div>
            <p className="text-[11px] font-medium">{lang === "ta" ? "பக்கம் 3 / 4 • யோகங்கள் & கோச்சாரம்" : "Page 3 of 4 • Yogas & Transits"}</p>
          </div>
          <p className="text-[9.5px] text-muted italic">
            * {t(lang, "pdfDisclaimerShort")}
          </p>
        </footer>
        </div>
      </div>

      {/* =========================================================================
          PAGE 4: Complete Vargas (D3, D7, D10, D12) & Ashtakavarga (SAV & BAV)
         ========================================================================= */}
      <div className="print-page relative overflow-hidden mb-4 pb-2">
        <Watermark />
        <div className="relative z-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <p className="font-display text-sm font-bold text-ink">
              {result.input.name || "ஜாதகம்"} &bull; {lang === "ta" ? "வர்க்க சக்கரங்கள் & அஷ்டகவர்க்கம்" : "Shodasavarga & Ashtakavarga"}
            </p>
            <p className="text-[10px] text-muted">{dob} &bull; {result.input.place}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-accent">astro.codepackr.com</span>
            <p className="text-[10px] text-muted">codepackr@gmail.com</p>
          </div>
        </div>

        {/* Section 9: 4 Key Shodasavarga Charts */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta"
              ? "9. முக்கிய வர்க்க சக்கரங்கள் (Major Shodasavarga Charts: D3, D7, D10, D12)"
              : "9. Major Harmonic Vargas (D3, D7, D10, D12)"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "திரேக்காணம் (D3 Drekkana - சகோதரம்/வீரம்)" : "Drekkana (D3 - Siblings/Courage)"}
              </p>
              <SouthChart positions={d3} lang={lang} caption={t(lang, "d3")} theme="light" />
            </div>
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "சப்தாம்சம் (D7 Saptamsa - புத்திர பாக்கியம்)" : "Saptamsa (D7 - Progeny/Children)"}
              </p>
              <SouthChart positions={d7} lang={lang} caption={t(lang, "d7")} theme="light" />
            </div>
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "தசாம்சம் (D10 Dasamsa - தொழில் & கீர்த்தி)" : "Dasamsa (D10 - Career/Success)"}
              </p>
              <SouthChart positions={d10} lang={lang} caption={t(lang, "d10")} theme="light" />
            </div>
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">
                {lang === "ta" ? "துவாதசாம்சம் (D12 Dvadasamsa - பெற்றோர்)" : "Dvadasamsa (D12 - Parents/Heritage)"}
              </p>
              <SouthChart positions={d12} lang={lang} caption={t(lang, "d12")} theme="light" />
            </div>
          </div>
        </div>

        {/* Section 10: Ashtakavarga (SAV & BAV) */}
        <div className="mt-3">
          <h3 className="font-display text-xs font-semibold text-accent mb-1.5">
            {lang === "ta"
              ? "10. அஷ்டகவர்க்கம் (Sarvashtakavarga & Bhinnashtakavarga)"
              : "10. Ashtakavarga System (SAV & BAV)"}
          </h3>

          {/* SAV 12 Signs Score */}
          <div className="rounded-md border border-border bg-surface p-2">
            <p className="text-[11px] font-semibold text-accent mb-1">
              {lang === "ta" ? "சர்வ அஷ்டகவர்க்க பரல்கள் (SAV Points out of 337, Avg 28):" : "Sarvashtakavarga Points (Avg 28):"}
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center">
              {result.sav.map((n, i) => (
                <div key={i} className="rounded bg-elevated/60 p-1">
                  <p className="text-[9px] text-muted">{SIGNS_TA[i].slice(0, 2)}</p>
                  <p className={cn("text-xs font-bold tabular-nums", n >= 28 ? "text-accent" : "text-ink")}>{n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BAV Planetary Matrix */}
          <div className="mt-2 overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-elevated/70 text-muted uppercase text-[9px]">
                <tr>
                  <th className="px-2 py-1">{t(lang, "planet")}</th>
                  {SIGNS_TA.map((_, i) => (
                    <th key={i} className="px-1 py-1 text-center">
                      {lang === "ta" ? SIGNS_TA[i].slice(0, 2) : SIGNS_EN[i].slice(0, 2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(result.bav) as (keyof typeof result.bav)[]).map((id) => (
                  <tr key={id} className="border-t border-border/60">
                    <td className="px-2 py-0.5 font-medium">{planetName(id, lang)}</td>
                    {result.bav[id].map((n, i) => (
                      <td
                        key={i}
                        className={cn("px-1 py-0.5 text-center tabular-nums text-[10px]", n >= 5 ? "font-bold text-accent" : "text-muted")}
                      >
                        {n}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-elevated/40 font-bold">
                  <td className="px-2 py-1">{t(lang, "sav")}</td>
                  {result.sav.map((n, i) => (
                    <td key={i} className="px-1 py-1 text-center tabular-nums text-accent">
                      {n}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Closing Auspicious Footer */}
        <div className="mt-2.5 rounded-lg border border-border/80 bg-surface/70 p-2 text-center text-xs">
          <p className="font-display font-bold text-accent text-sm">
            {lang === "ta" ? "|| சுபம் நலம் பெருகுக ||" : "|| Subham & Divine Blessings ||"}
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {lang === "ta"
              ? "இவ்வறிக்கை திருக்கணிதம் / வாக்கிய ஜோதிட கணித விதிகளின்படி கணினி அல்காரிதம் மூலம் கணிக்கப்பட்டது."
              : "Calculated with high precision according to Vedic astrological principles via computer algorithms."}
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-2 rounded-lg border border-border/90 bg-elevated/50 p-2 text-left text-[9.5px] sm:text-[10px] leading-relaxed text-muted">
          <div className="flex items-center justify-between font-semibold text-fg">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-ink font-bold text-[10.5px]">{t(lang, "legalDisclaimerTitle")}</span>
              <span className="text-[9.5px] text-muted font-normal">({t(lang, "computerGeneratedNotice")})</span>
            </div>
            <span className="font-mono text-accent text-[10px]">https://astro.codepackr.com/?page=disclaimer</span>
          </div>
          <p className="mt-1">
            {lang === "ta"
              ? "இவ்வறிக்கை கணினி வழி தானாகக் கணிக்கப்பட்டதாகும். முழுமையான சட்டப்பூர்வ பொறுப்புத் துறப்பு மற்றும் விதிமுறைகளுக்கு எங்கள் இணையதளத்தைப் பார்க்கவும்: https://astro.codepackr.com/?page=disclaimer"
              : "This report is computer-generated for guidance only. For our complete legal disclaimer & terms of use, please visit: https://astro.codepackr.com/?page=disclaimer"}
          </p>
        </div>

        {/* Final Page Footer */}
        <footer className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div>
              <span className="font-semibold text-accent">astro.codepackr.com</span>
              <span className="mx-1.5 text-border">&bull;</span>
              <span className="text-ink font-medium">Contact: codepackr@gmail.com</span>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <p className="font-medium text-fg">Codepackr Astro &bull; Tamil Jathagam &bull; {t(lang, "computerGeneratedNotice")}</p>
            <p className="text-muted">https://astro.codepackr.com &bull; Contact: codepackr@gmail.com &bull; {lang === "ta" ? "பக்கம் 4 / 4 • நிறைவு" : "Page 4 of 4 • Complete"}</p>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}
