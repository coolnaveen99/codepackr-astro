import { useMemo, useState } from "react";
import { BirthForm } from "@/components/birth-form";
import { ChartViews } from "@/components/chart-views";
import { compute, type BirthInput } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { DEFAULT_INPUT } from "@/lib/astro/samples";
import { cn } from "@/lib/utils";

export default function App() {
  const [lang, setLang] = useState<Lang>("ta");
  const [draft, setDraft] = useState<BirthInput>(DEFAULT_INPUT);
  const [cast, setCast] = useState<BirthInput>(DEFAULT_INPUT);
  const result = useMemo(() => compute(cast), [cast]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border/80 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-10 rounded-sm" />
            <div>
              <h1 className="font-display text-xl leading-tight sm:text-2xl">{t(lang, "brand")}</h1>
              <p className="text-xs text-muted sm:text-sm">{t(lang, "tagline")}</p>
            </div>
          </div>
          <div className="flex rounded-full bg-elevated p-1">
            {(["ta", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  "h-9 rounded-full px-3 text-sm font-medium transition-[background-color,color] duration-150",
                  lang === l ? "bg-ink text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {l === "ta" ? "தமிழ்" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:py-10">
        <aside className="no-print min-w-0 lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
          <div className="rounded-xl bg-surface p-4 shadow-card sm:p-5">
            <BirthForm lang={lang} value={draft} onChange={setDraft} onSubmit={() => setCast(draft)} />
          </div>
        </aside>
        <section className="min-w-0 lg:col-span-2">
          <ChartViews result={result} lang={lang} />
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted sm:px-6">{t(lang, "disclaimer")}</footer>
    </div>
  );
}
