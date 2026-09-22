// Codepackr Astro - Matrimonial Biodata Printable Sheet (Strict Single A4 Page Fit)
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
    bio.marital === "divorced"
      ? t(lang, "divorced")
      : bio.marital === "widowed"
        ? t(lang, "widowed")
        : t(lang, "unmarried");

  const isGroom = bio.birth.sex === "M";

  // Left column 1 items
  const personalCol1: [string, string][] = [
    [t(lang, "date"), dob],
    [t(lang, "time"), tob],
    [t(lang, "place"), bio.birth.place || "—"],
    [t(lang, "rasi"), moon ? signName(lang, moon.sign) : "—"],
    [t(lang, "nakshatra"), moon ? `${nakName(lang, moon.nak)} (${t(lang, "pada")} ${moon.pada})` : "—"],
    [t(lang, "lagna"), lagna ? signName(lang, lagna.sign) : "—"],
    [t(lang, "height"), bio.height || "—"],
  ];

  // Left column 2 items
  const personalCol2: [string, string][] = [
    [t(lang, "complexion"), complexion || "—"],
    [t(lang, "blood"), bio.blood || "—"],
    [t(lang, "marital"), marital],
    [t(lang, "religion"), bio.religion || "—"],
    [t(lang, "caste"), bio.caste || "—"],
    [t(lang, "gotra"), bio.gotra || "—"],
    [t(lang, "native"), bio.native || "—"],
  ];

  const workRows: [string, string][] = [
    [t(lang, "education"), bio.education || "—"],
    [t(lang, "work"), bio.work || "—"],
    [t(lang, "company"), bio.company || "—"],
  ];

  const familyRows: [string, string][] = [
    [t(lang, "father"), bio.father || "—"],
    [t(lang, "mother"), bio.mother || "—"],
    [t(lang, "siblings"), bio.siblings || "—"],
  ];

  return (
    <div
      ref={sheetRef}
      id="biodata-sheet"
      className="biodata-sheet relative mx-auto w-full max-w-[210mm] bg-[#fffdfa] text-ink p-3.5 sm:p-4 shadow-card border border-[#dcd3c4] overflow-hidden"
      style={{ boxSizing: "border-box" }}
    >
      {/* Decorative double border */}
      <div className="pointer-events-none absolute inset-1.5 rounded border border-accent/40" />
      <div className="pointer-events-none absolute inset-2 rounded border border-accent/15" />
      
      <Watermark />

      <div className="relative z-1 flex flex-col justify-between h-full space-y-1.5">
        {/* Top Auspicious Header */}
        <header className="flex flex-col items-center text-center pb-1.5 border-b border-accent/30">
          <img
            src={ganeshSrc}
            alt="Lord Ganesha"
            className="h-9 sm:h-10 w-auto object-contain"
          />
          <p className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] text-accent mt-0.5 uppercase">
            {lang === "ta" ? "|| ஓம் ஸ்ரீ கணேசாய நமஹ ||" : "|| OM SRI GANESHAYA NAMAHA ||"}
          </p>
          <div className="mt-0.5 flex items-center justify-center gap-2">
            <h1 className="font-display text-base sm:text-lg font-bold text-accent">
              {isGroom
                ? (lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata")
                : (lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata")}
            </h1>
            <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/30">
              {isGroom ? (lang === "ta" ? "மணமகன்" : "Groom") : (lang === "ta" ? "மணமகள்" : "Bride")}
            </span>
          </div>
          {bio.birth.name && (
            <p className="font-display text-sm font-bold text-ink sm:text-base mt-0.5">
              {bio.birth.name}
            </p>
          )}
        </header>

        {/* Section 1: Astrological & Birth Details (Left 2 columns) + Photo (Right) */}
        <section className="mt-2.5">
          <div className="flex items-center gap-2 border-b border-accent/30 pb-0.5 mb-1.5">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              {t(lang, "personalSec")}
            </h2>
          </div>

          <div className="flex gap-3">
            {/* 2-column key-value table */}
            <div className="min-w-0 flex-1 grid grid-cols-2 gap-x-3 text-[11px] leading-tight">
              <div className="space-y-1">
                {personalCol1.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                    <span className="text-muted shrink-0 pr-1">{k}:</span>
                    <span className="font-medium text-right text-ink truncate">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {personalCol2.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                    <span className="text-muted shrink-0 pr-1">{k}:</span>
                    <span className="font-medium text-right text-ink truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Box */}
            <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center">
              {bio.photo ? (
                <img
                  src={bio.photo}
                  alt={bio.birth.name || (isGroom ? "Groom" : "Bride")}
                  className="biodata-photo w-full rounded border-2 border-accent/30 object-cover shadow-2xs"
                />
              ) : (
                <div className="biodata-photo flex w-full flex-col items-center justify-center rounded border border-dashed border-accent/40 bg-elevated/40 p-2 text-center text-xs">
                  <span className="text-[11px] font-semibold text-accent">
                    {isGroom ? (lang === "ta" ? "மணமகன் படம்" : "Groom Photo") : (lang === "ta" ? "மணமகள் படம்" : "Bride Photo")}
                  </span>
                  <span className="text-[9px] text-muted mt-1">3 × 4 cm</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Education, Profession & Family Details */}
        <section className="mt-2 grid grid-cols-2 gap-x-4 text-[11px] leading-tight">
          <div>
            <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                {t(lang, "workSec")}
              </h2>
            </div>
            <div className="space-y-1">
              {workRows.map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                  <span className="text-muted shrink-0 pr-1">{k}:</span>
                  <span className="font-medium text-right text-ink truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1">
              <span className="inline-block size-1.5 rounded-full bg-accent" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                {t(lang, "familySec")}
              </h2>
            </div>
            <div className="space-y-1">
              {familyRows.map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border/40">
                  <span className="text-muted shrink-0 pr-1">{k}:</span>
                  <span className="font-medium text-right text-ink truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Contact Details */}
        <section className="mt-2">
          <div className="flex items-center gap-1.5 border-b border-accent/30 pb-0.5 mb-1">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              {t(lang, "contactSec")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-elevated/30 rounded p-1.5 border border-border/60 text-[10.5px]">
            <div>
              <span className="text-muted block text-[9.5px] uppercase">{t(lang, "phone")}</span>
              <span className="font-semibold text-ink">{bio.phone || "—"}</span>
            </div>
            <div>
              <span className="text-muted block text-[9.5px] uppercase">{t(lang, "email")}</span>
              <span className="font-medium text-ink truncate block">{bio.email || "—"}</span>
            </div>
            <div>
              <span className="text-muted block text-[9.5px] uppercase">{t(lang, "address")}</span>
              <span className="font-medium text-ink truncate block">{bio.address || "—"}</span>
            </div>
          </div>
        </section>

        {/* Section 4: Horoscope Charts (Rasi & Navamsa) */}
        {chart ? (
          <section className="mt-2.5">
            <div className="flex items-center justify-between border-b border-accent/30 pb-0.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-block size-1.5 rounded-full bg-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
                  {lang === "ta" ? "ஜாதகக் கட்டங்கள்" : "Horoscope Charts"}
                </h2>
              </div>
              <span className="text-[10px] text-muted italic">
                {lang === "ta" ? "தென்னிந்திய முறை (South Indian Format)" : "South Indian Style"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <p className="font-display mb-0.5 text-center text-[10.5px] font-bold text-accent">
                  {t(lang, "d1")} ({lang === "ta" ? "இராசி" : "Rasi"})
                </p>
                <div className="w-32 sm:w-36 aspect-square">
                  <SouthChart
                    positions={chart.list}
                    lang={lang}
                    mode="sign"
                    caption={t(lang, "d1")}
                    theme="light"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display mb-0.5 text-center text-[10.5px] font-bold text-accent">
                  {t(lang, "d9")} ({lang === "ta" ? "நவாம்சம்" : "Navamsa"})
                </p>
                <div className="w-32 sm:w-36 aspect-square">
                  <SouthChart
                    positions={chart.list}
                    lang={lang}
                    mode="navamsa"
                    caption={t(lang, "d9")}
                    theme="light"
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Bottom Legal Disclaimer & Footer */}
        <div className="mt-1 pt-1 border-t border-accent/25">
          <p className="text-[8px] leading-tight text-muted text-center">
            <span className="font-semibold text-ink">{t(lang, "legalDisclaimerTitle")}: </span>
            {lang === "ta" ? (
              <>
                சுயவிவரம் மற்றும் ஜாதகத் தகவல்கள் வரன் வீட்டார் அளித்த உள்ளீட்டின்படி அச்சிடப்பட்டது. திருமணத்திற்கு முன் இருவீட்டாரும் விவரங்களையும் ஜாதகப் பொருத்தத்தையும் நேரில் சரிபார்த்துக் கொள்ளவும். விவரங்களுக்கு:{" "}
                <a
                  href="https://astro.codepackr.com/?page=disclaimer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline hover:opacity-80"
                >
                  astro.codepackr.com/?page=disclaimer
                </a>
              </>
            ) : (
              <>
                All matrimonial and astrological details are printed as entered by the user. Families are advised to independently verify all credentials and compatibility. Refer:{" "}
                <a
                  href="https://astro.codepackr.com/?page=disclaimer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline hover:opacity-80"
                >
                  astro.codepackr.com/?page=disclaimer
                </a>
              </>
            )}
          </p>
          <footer className="mt-0.5 flex items-center justify-between text-[9.5px] text-muted">
            <div className="flex items-center gap-1.5">
              <img src={ganeshSrc} alt="" className="h-3 w-auto object-contain" />
              <a
                href="https://astro.codepackr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                astro.codepackr.com
              </a>
              <span>&bull;</span>
              <a href="mailto:codepackr@gmail.com" className="hover:underline text-accent">
                codepackr@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://astro.codepackr.com/?page=disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-medium"
              >
                {lang === "ta" ? "பொறுப்புத் துறப்பு" : "Disclaimer"}
              </a>
              <span>&bull;</span>
              <span>
                {lang === "ta"
                  ? (isGroom ? "மணமகன் திருமண விவரம்" : "மணமகள் திருமண விவரம்")
                  : (isGroom ? "Groom Marriage Biodata" : "Bride Marriage Biodata")}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
