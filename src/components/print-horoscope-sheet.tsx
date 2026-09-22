// Codepackr Astro - Printable Horoscope Sheet (A4 format)
import {
  NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA, planetName, type PlanetId,
} from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import { formatJD, type ChartResult } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { SouthChart } from "@/components/south-chart";
import { Watermark } from "@/components/watermark";

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
  const dob = `${String(result.input.day).padStart(2, "0")}-${String(result.input.month).padStart(2, "0")}-${result.input.year}`;
  const tob = `${String(result.input.hour).padStart(2, "0")}:${String(result.input.minute).padStart(2, "0")}`;

  return (
    <div className="print-horoscope-report w-full max-w-[210mm] mx-auto text-ink font-sans">
      <div className="print-page relative overflow-hidden mb-8 pb-4">
        <Watermark />
        <div className="relative z-1">
          <div className="flex flex-col items-center border-b border-border/80 pb-3 text-center">
            <p className="text-[11px] tracking-widest text-accent font-semibold mt-1">
              {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
            </p>
            <h1 className="font-display text-2xl font-bold text-ink">
              {lang === "ta" ? "தமிழ் முழு ஜாதகக் கணிப்பு" : "Complete Vedic Horoscope Report"}
            </h1>
            <p className="text-xs text-muted">
              {result.input.place} · {dob} · {tob}
            </p>
          </div>

          <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-muted block">{t(lang, "name")}</span>
              <strong>{result.input.name || "—"}</strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "lagna")}</span>
              <strong className="text-accent">{signName(lang, lagna.sign)}</strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "rasi")}</span>
              <strong className="text-accent">{signName(lang, moon.sign)}</strong>
            </div>
            <div>
              <span className="text-muted block">{t(lang, "nakshatra")}</span>
              <span>{nakName(lang, moon.nak)} ({t(lang, "pada")} {moon.pada})</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">{t(lang, "d1")}</p>
              <SouthChart positions={result.list} lang={lang} mode="sign" caption={t(lang, "d1")} theme="light" />
            </div>
            <div className="rounded-lg border border-border p-2 bg-surface">
              <p className="font-display mb-1 text-center text-xs font-bold text-accent">{t(lang, "d9")}</p>
              <SouthChart positions={result.list} lang={lang} mode="navamsa" caption={t(lang, "d9")} theme="light" />
            </div>
          </div>

          <div className="mt-3 overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 text-muted text-[10px] uppercase">
                <tr>
                  <th className="px-2 py-1.5">{t(lang, "planet")}</th>
                  <th className="px-2 py-1.5">{t(lang, "sign")}</th>
                  <th className="px-2 py-1.5">{t(lang, "house")}</th>
                  <th className="px-2 py-1.5">{t(lang, "nakshatra")}</th>
                </tr>
              </thead>
              <tbody>
                {result.list.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="px-2 py-1 font-semibold">{planetName(p.id, lang)}</td>
                    <td className="px-2 py-1">{signName(lang, p.sign)}</td>
                    <td className="px-2 py-1">{p.house}</td>
                    <td className="px-2 py-1">{nakName(lang, p.nak)} ({p.pada})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-3 border-t border-border pt-2 text-xs text-muted">
            <div className="flex justify-between">
              <span className="font-semibold text-accent">astro.codepackr.com</span>
              <span>codepackr@gmail.com</span>
            </div>
            <p className="mt-1 text-[9.5px] italic">* {t(lang, "pdfDisclaimerShort")}</p>
            <p className="mt-1 text-[9.5px]">{t(lang, "pdfDisclaimerReferWeb")}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
