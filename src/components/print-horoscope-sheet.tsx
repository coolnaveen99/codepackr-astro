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
  return (
    <div className="print-horoscope-report w-full max-w-[210mm] mx-auto text-ink font-sans p-4">
      <p className="text-sm text-muted">
        {lang === "ta"
          ? "அச்சிடும் ஜாதக அறிக்கை தற்காலிகமாக புதுப்பிக்கப்படுகிறது. முழு அறிக்கைக்கு திரையில் உள்ள ஜாதகத்தைப் பார்க்கவும்."
          : "The printable horoscope sheet is being restored. Please use the on-screen chart for the full report."}
      </p>
      <p className="mt-2 text-xs text-muted">{t(lang, "pdfDisclaimerShort")}</p>
    </div>
  );
}
