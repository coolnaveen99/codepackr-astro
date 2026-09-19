import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { BirthInput, City } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { POPULAR_CITIES } from "@/lib/astro/samples";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const MONTHS_TA = [
  "ஜனவரி",
  "பிப்ரவரி",
  "மார்ச்",
  "ஏப்ரல்",
  "மே",
  "ஜூன்",
  "ஜூலை",
  "ஆகஸ்ட்",
  "செப்டம்பர்",
  "அக்டோபர்",
  "நவம்பர்",
  "டிசம்பர்",
];
export const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 136 }, (_, i) => 1900 + i);
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function to12(hour24: number) {
  const ampm = hour24 < 12 ? "AM" : "PM";
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { h, ampm: ampm as "AM" | "PM" };
}

export function to24(h12: number, ampm: "AM" | "PM") {
  if (ampm === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

export function FieldSelect({
  id,
  value,
  onChange,
  children,
  className,
}: {
  id?: string;
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-11 w-full rounded-md bg-surface px-2 text-sm text-fg shadow-card",
        "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function DateTimeFields({
  lang,
  value,
  onChange,
}: {
  lang: Lang;
  value: BirthInput;
  onChange: (next: BirthInput) => void;
}) {
  const clock = to12(value.hour);
  const dim = daysInMonth(value.year || 1990, value.month || 1);
  const months = lang === "ta" ? MONTHS_TA : MONTHS_EN;

  function setDate(patch: Partial<Pick<BirthInput, "year" | "month" | "day">>) {
    const year = patch.year ?? value.year;
    const month = patch.month ?? value.month;
    const max = daysInMonth(year, month);
    const day = Math.min(patch.day ?? value.day, max);
    onChange({ ...value, year, month, day });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>{t(lang, "date")}</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "year")}</span>
            <FieldSelect value={value.year} onChange={(v) => setDate({ year: Number(v) })}>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "calMonth")}</span>
            <FieldSelect value={value.month} onChange={(v) => setDate({ month: Number(v) })}>
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "day")}</span>
            <FieldSelect value={value.day} onChange={(v) => setDate({ day: Number(v) })}>
              {Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </FieldSelect>
          </div>
        </div>
      </div>
      <div>
        <Label>{t(lang, "time")}</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "hour")}</span>
            <FieldSelect
              value={clock.h}
              onChange={(v) => onChange({ ...value, hour: to24(Number(v), clock.ampm) })}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "minute")}</span>
            <FieldSelect
              value={value.minute}
              onChange={(v) => onChange({ ...value, minute: Number(v) })}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">AM / PM</span>
            <FieldSelect
              value={clock.ampm}
              onChange={(v) => onChange({ ...value, hour: to24(clock.h, v as "AM" | "PM") })}
            >
              <option value="AM">{t(lang, "am")}</option>
              <option value="PM">{t(lang, "pm")}</option>
            </FieldSelect>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaceSearch({
  lang,
  value,
  onChange,
  id,
}: {
  lang: Lang;
  value: BirthInput;
  onChange: (next: BirthInput) => void;
  id?: string;
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

  function pickCity(c: City) {
    setQuery(c.n);
    onChange({ ...value, place: c.n, lat: c.lat, lon: c.lon, tz: c.tz });
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <Label htmlFor={id}>{t(lang, "place")}</Label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 left-3 size-5 text-muted" />
        <Input
          id={id}
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
                <span className="text-xs text-muted">
                  {c.lat.toFixed(1)}° / {c.lon.toFixed(1)}°
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
