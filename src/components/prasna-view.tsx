// Codepackr Astro - Simple Prasna (question chart for "now")
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceSearch } from "@/components/birth-fields";
import { SouthChart } from "@/components/south-chart";
import { compute, type BirthInput } from "@/lib/astro/engine";
import { analyse } from "@/lib/astro/analysis";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA, planetName } from "@/lib/astro/constants";
import { t, type Lang } from "@/lib/astro/i18n";
import { DEFAULT_INPUT } from "@/lib/astro/samples";

function nowInput(place: BirthInput): BirthInput {
  const n = new Date();
  const utc = n.getTime() + n.getTimezoneOffset() * 60000;
  const local = new Date(utc + place.tz * 3600000);
  return {
    ...place,
    name: place.name || "Prasna",
    year: local.getFullYear(),
    month: local.getMonth() + 1,
    day: local.getDate(),
    hour: local.getHours(),
    minute: local.getMinutes(),
  };
}

export function PrasnaView({ lang }: { lang: Lang }) {
  const [question, setQuestion] = useState("");
  const [place, setPlace] = useState<BirthInput>({
    ...DEFAULT_INPUT,
    name: "",
    place: "Chennai (Madras)",
    lat: 13.0827,
    lon: 80.2707,
  });
  const [cast, setCast] = useState<BirthInput | null>(null);

  const result = useMemo(() => (cast ? compute(cast) : null), [cast]);
  const analysis = useMemo(() => (result ? analyse(result) : null), [result]);

  function castNow() {
    setCast(nowInput(place));
  }

  const moon = result?.list.find((p) => p.id === "moon");
  const lagna = result?.list.find((p) => p.id === "lagna");
  const signs = lang === "ta" ? SIGNS_TA : SIGNS_EN;
  const naks = lang === "ta" ? NAK_TA : NAK_EN;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "navPrasna")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t(lang, "prasnaLead")}</p>
      </div>

      <div className="rounded-xl bg-surface p-4 shadow-card sm:p-6 space-y-4">
        <div>
          <Label htmlFor="prasna-q">{t(lang, "prasnaQuestion")}</Label>
          <Input
            id="prasna-q"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={lang === "ta" ? "கேள்வியை எழுதுங்கள் (விருப்பம்)" : "Write your question (optional)"}
          />
        </div>
        <PlaceSearch lang={lang} value={place} onChange={setPlace} id="prasna-place" />
        <Button type="button" size="lg" onClick={castNow}>
          {t(lang, "castPrasna")}
        </Button>
        <p className="text-xs text-muted">{t(lang, "prasnaDisclaimer")}</p>
      </div>

      {result && moon && lagna && analysis ? (
        <div className="mt-8 space-y-6">
          {question.trim() ? (
            <p className="text-sm text-muted">
              <span className="font-medium text-fg">{t(lang, "prasnaQuestion")}: </span>
              {question.trim()}
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-3">
            <Info k={t(lang, "lagna")} v={signs[lagna.sign]} />
            <Info k={t(lang, "rasi")} v={signs[moon.sign]} />
            <Info
              k={t(lang, "nakshatra")}
              v={`${naks[moon.nak]} · ${t(lang, "pada")} ${moon.pada}`}
            />
          </div>
          {analysis.dasaNow ? (
            <p className="text-sm">
              {t(lang, "current")}:{" "}
              <strong>
                {planetName(analysis.dasaNow.maha, lang)}–{planetName(analysis.dasaNow.bhukti, lang)}
              </strong>
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="rounded-xl bg-surface p-4 shadow-card">
              <figcaption className="mb-2 font-display text-lg">{t(lang, "d1")}</figcaption>
              <SouthChart positions={result.list} lang={lang} caption={t(lang, "navPrasna")} />
            </figure>
            <figure className="rounded-xl bg-surface p-4 shadow-card">
              <figcaption className="mb-2 font-display text-lg">{t(lang, "d9")}</figcaption>
              <SouthChart positions={result.list} lang={lang} mode="navamsa" caption="D9" />
            </figure>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-3 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</p>
      <p className="font-display mt-1 text-xl text-accent">{v}</p>
    </div>
  );
}
