// Codepackr Astro - Classical terms glossary
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { GLOSSARY, searchGlossary } from "@/lib/astro/glossary";
import { t, type Lang } from "@/lib/astro/i18n";

export function GlossaryView({ lang }: { lang: Lang }) {
  const [q, setQ] = useState("");
  const items = useMemo(() => searchGlossary(q, lang), [q, lang]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "navGlossary")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t(lang, "glossaryLead")}</p>
      </div>

      <div className="mb-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "ta" ? "தேடுக… (ராசி, தசை, ரஜ்ஜு…)" : "Search… (rasi, dasa, rajju…)"}
        />
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((g) => (
          <li key={g.id} className="rounded-xl bg-surface p-4 shadow-card sm:p-5">
            <h3 className="font-display text-lg text-accent">
              {lang === "ta" ? g.termTa : g.termEn}
              <span className="ml-2 text-sm font-normal text-muted">
                {lang === "ta" ? g.termEn : g.termTa}
              </span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg">
              {lang === "ta" ? g.bodyTa : g.bodyEn}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-card">
            {lang === "ta" ? "பொருத்தம் இல்லை" : "No matching terms"}
          </li>
        ) : null}
      </ul>
      <p className="mt-4 text-xs text-muted">
        {GLOSSARY.length} {lang === "ta" ? "விளக்கங்கள்" : "entries"} · {t(lang, "privacyNote")}
      </p>
    </main>
  );
}
