// Codepackr Astro - Biodata printable sheet (Rasi + Navamsa)
import { type Ref } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import {
  COMPLEXIONS,
  type Biodata,
} from "@/lib/astro/biodata";
import { compute } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { SouthChart } from "@/components/south-chart";
import { Watermark } from "@/components/watermark";
import { useGanesh } from "@/lib/ganesh-context";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

export function BiodataSheet({
  lang,
  bio,
  chart,
  analysis,
  sheetRef,
}: {
  lang: Lang;
  bio: Biodata;
  chart: ReturnType<typeof compute> | null;
  analysis: ReturnType<typeof analyse> | null;
  sheetRef?: Ref<HTMLDivElement> | null;
}) {
  const { ganeshSrc } = useGanesh();
  const moon = chart?.list.find((p) => p.id === "moon");
  const lagna = chart?.list.find((p) => p.id === "lagna");
  const dob = `${String(bio.birth.day).padStart(2, "0")}-${String(bio.birth.month).padStart(2, "0")}-${bio.birth.year}`;
  const clockH = bio.birth.hour % 12 === 0 ? 12 : bio.birth.hour % 12;
  const ampm = bio.birth.hour < 12 ? t(lang, "am") : t(lang, "pm");
  const tob = `${clockH}:${String(bio.birth.minute).padStart(2, "0")} ${ampm}`;
  const complexion =
    bio.complexion === "fair"
      ? t(lang, "fair")
      : bio.complexion === "wheatish"
        ? t(lang, "wheatish")
        : bio.complexion === "very_fair"
          ? t(lang, "very_fair")
          : bio.complexion === "golden"
            ? t(lang, "golden")
            : bio.complexion === "wheatish_brown"
              ? t(lang, "wheatish_brown")
              : bio.complexion === "dusky"
                ? t(lang, "dusky")
                : (COMPLEXIONS.find((c) => c.id === bio.complexion)?.[lang] || bio.complexion);
  const marital =
    bio.marital === "divorced" ? t(lang, "divorced") : bio.marital === "widowed" ? t(lang, "widowed") : t(lang, "unmarried");

  const isGroom = bio.birth.sex === "M";

  const personal: [string, string][] = [
    [
      isGroom
        ? (lang === "ta" ? "மணமகன் பெயர்" : "Groom's Name")
        : (lang === "ta" ? "மணமகள் பெயர்" : "Bride's Name"),
      bio.birth.name || "—",
    ],
    [
      lang === "ta" ? "வரன்" : "Profile",
      isGroom
        ? (lang === "ta" ? "மணமகன்" : "Groom")
        : (lang === "ta" ? "மணமகள்" : "Bride"),
    ],
    [t(lang, "date"), dob],
    [t(lang, "time"), tob],
    [t(lang, "place"), bio.birth.place || "—"],
    [t(lang, "rasi"), moon ? signName(lang, moon.sign) : "—"],
    [t(lang, "nakshatra"), moon ? `${nakName(lang, moon.nak)} · ${t(lang, "pada")} ${moon.pada}` : "—"],
    [t(lang, "lagna"), lagna ? signName(lang, lagna.sign) : "—"],
    [t(lang, "height"), bio.height],
    [t(lang, "complexion"), complexion],
    [t(lang, "blood"), bio.blood],
    [t(lang, "marital"), marital],
    [t(lang, "religion"), bio.religion || "—"],
    [t(lang, "caste"), bio.caste || "—"],
    [t(lang, "gotra"), bio.gotra || "—"],
    [t(lang, "native"), bio.native || "—"],
  ];

  const work: [string, string][] = [
    [t(lang, "education"), bio.education || "—"],
    [t(lang, "work"), bio.work || "—"],
    [t(lang, "company"), bio.company || "—"],
  ];

  const family: [string, string][] = [
    [t(lang, "father"), bio.father || "—"],
    [t(lang, "mother"), bio.mother || "—"],
    [t(lang, "siblings"), bio.siblings || "—"],
  ];

  const contact: [string, string][] = [
    [t(lang, "phone"), bio.phone || "—"],
    [t(lang, "email"), bio.email || "—"],
    [t(lang, "address"), bio.address || "—"],
  ];

  return (
    <div
      ref={sheetRef}
      id="biodata-sheet"
      className="biodata-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden bg-surface px-5 py-5 shadow-card sm:px-7 sm:py-6"
    >
      <div className="pointer-events-none absolute inset-3 rounded-sm border-2 border-accent/50" />
      <Watermark />
      <div className="relative z-1">
        <div className="flex flex-col items-center">
          <img
            src={ganeshSrc}
            alt=""
            className="h-16 w-auto object-contain print:h-14"
          />
          <h2 className="font-display mt-1 text-center text-xl font-bold text-accent sm:text-2xl">
            {isGroom
              ? (lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata")
              : (lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata")}
          </h2>
          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            {isGroom
              ? (lang === "ta" ? "மணமகன்" : "Groom")
              : (lang === "ta" ? "மணமகள்" : "Bride")}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="min-w-0 flex-1">
            <SheetBlock title={t(lang, "personalSec")} rows={personal} />
          </div>
          <div className="w-28 shrink-0 sm:w-36">
            {bio.photo ? (
              <img
                src={bio.photo}
                alt={bio.birth.name || (isGroom ? "Groom" : "Bride")}
                className="biodata-photo w-full rounded-sm object-cover shadow-card"
              />
            ) : (
              <div className="biodata-photo flex w-full flex-col items-center justify-center rounded-sm bg-elevated text-center p-2 text-xs text-muted">
                <span className="font-semibold text-fg">
                  {isGroom
                    ? (lang === "ta" ? "மணமகன் படம்" : "Groom Photo")
                    : (lang === "ta" ? "மணமகள் படம்" : "Bride Photo")}
                </span>
                <span className="text-[10px] text-muted mt-1">
                  {isGroom ? (lang === "ta" ? "மணமகன்" : "Groom") : (lang === "ta" ? "மணமகள்" : "Bride")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <SheetBlock title={t(lang, "workSec")} rows={work} />
          <SheetBlock title={t(lang, "familySec")} rows={family} />
        </div>
        <SheetBlock title={t(lang, "contactSec")} rows={contact} />

        {chart ? (
          <section className="mt-4 break-inside-avoid print:mt-3">
            <h3 className="font-display border-b border-accent/40 pb-0.5 text-xs sm:text-sm tracking-wide text-accent uppercase">
              {lang === "ta" ? "ஜாதகக் கட்டங்கள்" : "Horoscope Charts"}
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="font-display mb-1 text-center text-xs font-semibold text-accent">
                  {t(lang, "d1")}
                </p>
                <SouthChart
                  positions={chart.list}
                  lang={lang}
                  mode="sign"
                  caption={t(lang, "d1")}
                  theme="light"
                />
              </div>
              <div>
                <p className="font-display mb-1 text-center text-xs font-semibold text-accent">
                  {t(lang, "d9")}
                </p>
                <SouthChart
                  positions={chart.list}
                  lang={lang}
                  mode="navamsa"
                  caption={t(lang, "d9")}
                  theme="light"
                />
              </div>
            </div>
          </section>
        ) : null}

        <div className="mt-3 rounded border border-border/70 bg-elevated/40 p-2 text-left text-[9.5px] leading-relaxed text-muted print:mt-2 print:p-1.5 print:text-[9px]">
          <span className="font-semibold text-ink">{t(lang, "legalDisclaimerTitle")}: </span>
          <span>{t(lang, "biodataDisclaimer")}</span>
        </div>

        <footer className="mt-3 border-t border-accent/30 pt-2 flex items-center justify-between text-xs text-muted print:mt-2">
          <div className="flex items-center gap-2">
            <img src={ganeshSrc} alt="" className="h-5 w-auto object-contain" />
            <a
              href="https://astro.codepackr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              astro.codepackr.com
            </a>
            <span className="text-border">&bull;</span>
            <a href="mailto:codepackr@gmail.com" className="hover:underline text-[11px] text-accent font-medium">
              codepackr@gmail.com
            </a>
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted">
            {lang === "ta"
              ? (isGroom
                  ? "தமிழ் ஜாதகம் & மணமகன் விவரம் · கணினி கணிப்பு"
                  : "தமிழ் ஜாதகம் & மணமகள் விவரம் · கணினி கணிப்பு")
              : (isGroom
                  ? "Tamil Horoscope & Groom Biodata · Computer Generated"
                  : "Tamil Horoscope & Bride Biodata · Computer Generated")}
          </span>
        </footer>
      </div>
    </div>
  );
}

function SheetBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className="mt-3">
      <h3 className="font-display border-b border-accent/40 pb-0.5 text-xs sm:text-sm tracking-wide text-accent uppercase">
        {title}
      </h3>
      <table className="mt-1 w-full text-xs sm:text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="w-[38%] py-0.5 pr-2 align-top text-muted">{k}</td>
              <td className="py-0.5 font-medium">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
