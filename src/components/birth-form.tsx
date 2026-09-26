// Codepackr Astro - Birth Details Form Input
import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { SCHOOLS, type School } from "@/lib/astro/constants";
import type { BirthInput } from "@/lib/astro/engine";
import type { BirthTimeQuality } from "@/lib/astro/types";
import { t, type Lang } from "@/lib/astro/i18n";
import { DateTimeFields, PlaceSearch } from "@/components/birth-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const BIRTH_TIME_QUALITIES: { id: BirthTimeQuality; ta: string; en: string }[] = [
  { id: "exact", ta: "துல்லியமானது", en: "Exact" },
  { id: "approximate", ta: "தோராயமானது", en: "Approximate" },
  { id: "rounded", ta: "சுமார் / Rounded", en: "Rounded" },
  { id: "unknown", ta: "தெரியவில்லை", en: "Unknown" },
];

export function BirthForm({
  lang,
  value,
  onChange,
  onSubmit,
}: {
  lang: Lang;
  value: BirthInput;
  onChange: (next: BirthInput) => void;
  onSubmit: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  function set<K extends keyof BirthInput>(key: K, v: BirthInput[K]) {
    onChange({ ...value, [key]: v });
  }

  const isTa = lang === "ta";

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <h2 className="font-display text-xl text-fg">{t(lang, "birth")}</h2>
        <p className="mt-1 text-sm text-muted">{t(lang, "rasiNote")}</p>
      </div>

      <div>
        <Label htmlFor="name">{t(lang, "name")}</Label>
        <Input id="name" value={value.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div>
        <Label>{t(lang, "sex")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("sex", s)}
              className={cn(
                "h-11 rounded-md text-sm font-medium shadow-card transition-transform duration-150 active:scale-[0.96]",
                value.sex === s ? "bg-accent text-accent-fg font-semibold" : "bg-surface text-fg border border-border/70",
              )}
            >
              {s === "M" ? t(lang, "male") : t(lang, "female")}
            </button>
          ))}
        </div>
      </div>

      <DateTimeFields lang={lang} value={value} onChange={onChange} />
      <PlaceSearch lang={lang} value={value} onChange={onChange} id="place" />

      {/* Progressive Disclosure: Advanced Options (Sections 23, 82) */}
      <div className="border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between py-2 text-xs font-semibold text-slate-700 hover:text-accent transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-accent" />
            <span>{isTa ? "மேம்பட்ட விருப்பங்கள் (நேர துல்லியம் & முறை)" : "Advanced Options (Accuracy & Profile)"}</span>
          </span>
          {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-2 space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-xs">
            {/* Birth Time Quality */}
            <div>
              <Label className="text-xs font-bold text-slate-700">
                {isTa ? "பிறந்த நேரத்தின் துல்லியம்" : "Birth Time Accuracy"}
              </Label>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {BIRTH_TIME_QUALITIES.map((q) => {
                  const selected = (value.birthTimeQuality || "exact") === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => set("birthTimeQuality", q.id)}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-left text-xs transition-all",
                        selected
                          ? "bg-accent text-white font-semibold shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      )}
                    >
                      {isTa ? q.ta : q.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* School / Calculation Profile */}
            <div>
              <Label className="text-xs font-bold text-slate-700">{t(lang, "school")}</Label>
              <div className="mt-1.5 grid gap-1.5">
                {SCHOOLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("school", s.id as School)}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-left shadow-2xs transition-all",
                      value.school === s.id
                        ? "bg-accent text-white font-semibold"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <span className="block text-xs font-bold">{lang === "ta" ? s.ta : s.en}</span>
                    <span
                      className={cn(
                        "block text-[10px]",
                        value.school === s.id ? "text-white/80" : "text-slate-500"
                      )}
                    >
                      {lang === "ta" ? s.hintTa : s.hintEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full">
        {t(lang, "compute")}
      </Button>
    </form>
  );
}
