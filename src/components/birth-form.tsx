import { SCHOOLS, type School } from "@/lib/astro/constants";
import type { BirthInput } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { DateTimeFields, PlaceSearch } from "@/components/birth-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  function set<K extends keyof BirthInput>(key: K, v: BirthInput[K]) {
    onChange({ ...value, [key]: v });
  }

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
                value.sex === s ? "bg-ink text-accent-fg" : "bg-surface text-fg",
              )}
            >
              {s === "M" ? t(lang, "male") : t(lang, "female")}
            </button>
          ))}
        </div>
      </div>

      <DateTimeFields lang={lang} value={value} onChange={onChange} />
      <PlaceSearch lang={lang} value={value} onChange={onChange} id="place" />

      <div>
        <Label>{t(lang, "school")}</Label>
        <div className="grid gap-2">
          {SCHOOLS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => set("school", s.id as School)}
              className={cn(
                "rounded-md px-3 py-2.5 text-left shadow-card transition-[box-shadow,transform] duration-150 active:scale-[0.96]",
                value.school === s.id ? "bg-ink text-accent-fg" : "bg-surface text-fg",
              )}
            >
              <span className="block text-sm font-medium">{lang === "ta" ? s.ta : s.en}</span>
              <span className={cn("block text-xs", value.school === s.id ? "text-accent-fg/70" : "text-muted")}>
                {lang === "ta" ? s.hintTa : s.hintEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        {t(lang, "compute")}
      </Button>
    </form>
  );
}
