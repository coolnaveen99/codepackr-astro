// Temporary minimal stub - full file restore pending
import type { Lang } from "@/lib/astro/i18n";

export function BiodataMaker({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-center">
      <h2 className="font-display text-2xl">
        {lang === "ta" ? "திருமண விவரம்" : "Marriage Biodata"}
      </h2>
      <p className="mt-4 text-muted">
        {lang === "ta"
          ? "தற்காலிக பராமரிப்பு — விரைவில் மீண்டும் கிடைக்கும்."
          : "Temporarily under maintenance — will be restored shortly."}
      </p>
    </div>
  );
}
