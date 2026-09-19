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

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const MIN_BIRTH_YEAR = 1900;

export function todayParts(now = new Date()) {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number) {
  const m = Math.min(Math.max(month | 0, 1), 12);
  if (m === 2) return isLeapYear(year) ? 29 : 28;
  return DIM[m - 1]!;
}

export function clampBirthDate(year: number, month: number, day: number, now = new Date()) {
  const today = todayParts(now);
  const yRaw = Math.trunc(Number(year));
  const y = Number.isFinite(yRaw)
    ? Math.min(Math.max(yRaw, MIN_BIRTH_YEAR), today.year)
    : Math.min(1990, today.year);
  let m = Math.min(Math.max(Math.trunc(Number(month)) || 1, 1), 12);
  if (y === today.year) m = Math.min(m, today.month);
  let maxD = daysInMonth(y, m);
  if (y === today.year && m === today.month) maxD = Math.min(maxD, today.day);
  const d = Math.min(Math.max(Math.trunc(Number(day)) || 1, 1), maxD);
  return { year: y, month: m, day: d };
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

function YearInput({
  year,
  min,
  max,
  onCommit,
}: {
  year: number;
  min: number;
  max: number;
  onCommit: (year: number) => void;
}) {
  const [text, setText] = useState(String(year));

  useEffect(() => {
    setText(String(year));
  }, [year]);

  function clamp(n: number) {
    return Math.min(Math.max(n, min), max);
  }

  function commitDigits(raw: string) {
    if (raw.length !== 4) {
      setText(String(year));
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      setText(String(year));
      return;
    }
    onCommit(clamp(n));
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="bday-year"
      spellCheck={false}
      maxLength={4}
      aria-label="Year"
      value={text}
      placeholder="1990"
      data-testid="birth-year"
      className={cn(
        "h-11 w-full rounded-md bg-surface px-2 text-center text-sm tabular-nums text-fg shadow-card",
        "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none",
      )}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        setText(digits);
        if (digits.length === 4) {
          const n = Number(digits);
          if (Number.isFinite(n)) onCommit(clamp(n));
        }
      }}
      onBlur={() => commitDigits(text)}
      onFocus={(e) => e.currentTarget.select()}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          onCommit(clamp(year + 1));
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          onCommit(clamp(year - 1));
        }
      }}
    />
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
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const today = now ? todayParts(now) : { year: 2099, month: 12, day: 31 };
  const safe = now
    ? clampBirthDate(value.year, value.month, value.day, now)
    : {
        year: Math.min(Math.max(value.year || 1990, MIN_BIRTH_YEAR), 2099),
        month: Math.min(Math.max(value.month || 1, 1), 12),
        day: Math.min(Math.max(value.day || 1, 1), daysInMonth(value.year || 1990, value.month || 1)),
      };
  const months = lang === "ta" ? MONTHS_TA : MONTHS_EN;
  const monthLimit = safe.year === today.year ? today.month : 12;
  const dayLimit =
    safe.year === today.year && safe.month === today.month
      ? Math.min(daysInMonth(safe.year, safe.month), today.day)
      : daysInMonth(safe.year, safe.month);
  const wantedDay = useRef(value.day);

  useEffect(() => {
    if (!now) return;
    if (safe.year !== value.year || safe.month !== value.month || safe.day !== value.day) {
      onChange({ ...value, year: safe.year, month: safe.month, day: safe.day });
    }
  }, [now, safe.year, safe.month, safe.day, value, onChange]);

  function setDate(patch: Partial<Pick<BirthInput, "year" | "month" | "day">>) {
    if (patch.day != null) wantedDay.current = patch.day;
    const next = clampBirthDate(
      patch.year ?? value.year,
      patch.month ?? value.month,
      patch.day ?? wantedDay.current,
    );
    if (next.year === value.year && next.month === value.month && next.day === value.day) return;
    onChange({ ...value, ...next });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>{t(lang, "date")}</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "day")}</span>
            <FieldSelect value={safe.day} onChange={(v) => setDate({ day: Number(v) })}>
              {Array.from({ length: dayLimit }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "calMonth")}</span>
            <FieldSelect value={safe.month} onChange={(v) => setDate({ month: Number(v) })}>
              {months.slice(0, monthLimit).map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted">{t(lang, "year")}</span>
            <YearInput
              year={safe.year}
              min={MIN_BIRTH_YEAR}
              max={today.year}
              onCommit={(year) => setDate({ year })}
            />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted">{t(lang, "dateHint")}</p>
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
