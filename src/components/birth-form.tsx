import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SCHOOLS, type School } from "@/lib/astro/constants";
import type { BirthInput, City } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { POPULAR_CITIES, SAMPLES } from "@/lib/astro/samples";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

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
  const [query, setQuery] = useState(value.place);
  const [cities, setCities] = useState<City[]>(POPULAR_CITIES);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((list: City[]) => {
        if (!cancelled && Array.isArray(list)) setCities(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setQuery(value.place);
  }, [value.place]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return POPULAR_CITIES.slice(0, 8);
    return cities.filter((c) => c.n.toLowerCase().includes(q)).slice(0, 12);
  }, [cities, query]);

  function set<K extends keyof BirthInput>(key: K, v: BirthInput[K]) {
    onChange({ ...value, [key]: v });
  }

  function pickCity(c: City) {
    setQuery(c.n);
    onChange({ ...value, place: c.n, lat: c.lat, lon: c.lon, tz: c.tz });
    setOpen(false);
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

      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              onChange({ ...s.input, school: value.school });
              setQuery(s.input.place);
            }}
            className={cn(
              "h-9 rounded-full px-3 text-xs font-medium shadow-card transition-transform duration-150 active:scale-[0.96]",
              value.name === s.input.name
                ? "bg-ink text-accent-fg"
                : "bg-surface text-muted hover:text-fg",
            )}
          >
            {lang === "ta" ? s.labelTa : s.labelEn}
          </button>
        ))}
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">{t(lang, "date")}</Label>
          <Input
            id="date"
            type="date"
            value={`${value.year}-${pad(value.month)}-${pad(value.day)}`}
            onChange={(e) => {
              const [y, m, d] = e.target.value.split("-").map(Number);
              if (y && m && d) onChange({ ...value, year: y, month: m, day: d });
            }}
          />
        </div>
        <div>
          <Label htmlFor="time">{t(lang, "time")}</Label>
          <Input
            id="time"
            type="time"
            value={`${pad(value.hour)}:${pad(value.minute)}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              if (Number.isFinite(h) && Number.isFinite(m)) onChange({ ...value, hour: h, minute: m });
            }}
          />
        </div>
      </div>

      <div ref={boxRef} className="relative">
        <Label htmlFor="place">{t(lang, "place")}</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-3 left-3 size-5 text-muted" />
          <Input
            id="place"
            className="pl-10"
            value={query}
            placeholder={t(lang, "searchPlace")}
            autoComplete="off"
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
          />
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="size-3.5" />
          {value.lat.toFixed(2)}°N {value.lon.toFixed(2)}°E · UTC{value.tz >= 0 ? "+" : ""}
          {value.tz}
        </p>
        {open ? (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-surface py-1 shadow-card">
            {matches.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted">{t(lang, "noPlace")}</div>
            ) : (
              matches.map((c) => (
                <button
                  key={c.n + c.lon}
                  type="button"
                  onClick={() => pickCity(c)}
                  className="flex w-full items-baseline justify-between px-3 py-2 text-left text-sm hover:bg-elevated"
                >
                  <span>{c.n}</span>
                  <span className="text-xs text-muted">{c.lat.toFixed(1)}° / {c.lon.toFixed(1)}°</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

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
