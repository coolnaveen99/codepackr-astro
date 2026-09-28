// Codepackr Astro - shared editable date/time inputs
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BirthInput } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const MONTHS_TA = [
  "ஜனவரி","பிப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜூன்",
  "ஜூலை","ஆகஸ்ட்","செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்",
];
export const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const DIM = [31,28,31,30,31,30,31,31,30,31,30,31];
export const MIN_BIRTH_YEAR = 1900;

export function todayParts(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
export function daysInMonth(year: number, month: number) {
  const m = Math.min(Math.max(month | 0, 1), 12);
  return m === 2 ? (isLeapYear(year) ? 29 : 28) : DIM[m - 1]!;
}
export function clampBirthDate(
  year: number, month: number, day: number, now = new Date(), allowFuture = false,
) {
  const today = todayParts(now);
  const maxYear = allowFuture ? today.year + 2 : today.year;
  const yRaw = Math.trunc(Number(year));
  const y = Number.isFinite(yRaw)
    ? Math.min(Math.max(yRaw, MIN_BIRTH_YEAR), maxYear)
    : Math.min(1990, maxYear);
  let m = Math.min(Math.max(Math.trunc(Number(month)) || 1, 1), 12);
  if (!allowFuture && y === today.year) m = Math.min(m, today.month);
  let maxD = daysInMonth(y, m);
  if (!allowFuture && y === today.year && m === today.month) maxD = Math.min(maxD, today.day);
  const d = Math.min(Math.max(Math.trunc(Number(day)) || 1, 1), maxD);
  return { year: y, month: m, day: d };
}
export function to12(hour24: number) {
  const ampm = hour24 < 12 ? "AM" : "PM";
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { h, ampm: ampm as "AM" | "PM" };
}
export function to24(h12: number, ampm: "AM" | "PM") {
  return ampm === "AM" ? (h12 === 12 ? 0 : h12) : (h12 === 12 ? 12 : h12 + 12);
}

export function FieldSelect({
  id, value, onChange, children, className,
}: {
  id?: string; value: string | number; onChange: (v: string) => void; children: ReactNode; className?: string;
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
      className={cn("h-11 w-full rounded-md bg-surface px-2 text-sm text-fg shadow-card",
        "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none", className)}>
      {children}
    </select>
  );
}

function NumericDateInput({
  value,
  max,
  min = 1,
  maxLength = 2,
  ariaLabel,
  testId,
  onCommit,
}: {
  value: number;
  min?: number;
  max: number;
  maxLength?: number;
  ariaLabel: string;
  testId: string;
  onCommit: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => setText(String(value)), [value]);

  function commit() {
    if (!text) {
      setText(String(value));
      return;
    }
    const n = Number(text);
    if (!Number.isInteger(n) || n < min || n > max) {
      setText(String(value));
      return;
    }
    onCommit(n);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      spellCheck={false}
      maxLength={maxLength}
      aria-label={ariaLabel}
      value={text}
      data-testid={testId}
      className={cn(
        "h-11 w-full rounded-md bg-surface px-2 text-center text-sm tabular-nums text-fg shadow-card",
        "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none",
      )}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, maxLength);
        setText(digits);
      }}
      onBlur={commit}
      onFocus={(e) => e.currentTarget.select()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function YearInput({
  year, min, max, onCommit,
}: { year: number; min: number; max: number; onCommit: (year: number) => void }) {
  return (
    <NumericDateInput
      value={year}
      min={min}
      max={max}
      maxLength={4}
      ariaLabel="Year"
      testId="birth-year"
      onCommit={onCommit}
    />
  );
}

export function DateTimeFields({
  lang, value, onChange, allowFuture = false,
}: { lang: Lang; value: BirthInput; onChange: (next: BirthInput) => void; allowFuture?: boolean }) {
  const clock = to12(value.hour);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); }, []);
  const today = now ? todayParts(now) : { year: 2099, month: 12, day: 31 };
  const maxYear = allowFuture ? today.year + 2 : today.year;
  const safe = now
    ? allowFuture
      ? {
          year: Math.min(Math.max(value.year || 1990, MIN_BIRTH_YEAR), maxYear),
          month: Math.min(Math.max(value.month || 1, 1), 12),
          day: Math.min(Math.max(value.day || 1, 1), daysInMonth(value.year || 1990, value.month || 1)),
        }
      : clampBirthDate(value.year, value.month, value.day, now)
    : {
        year: Math.min(Math.max(value.year || 1990, MIN_BIRTH_YEAR), maxYear),
        month: Math.min(Math.max(value.month || 1, 1), 12),
        day: Math.min(Math.max(value.day || 1, 1), daysInMonth(value.year || 1990, value.month || 1)),
      };
  const months = lang === "ta" ? MONTHS_TA : MONTHS_EN;
  const monthLimit = !allowFuture && safe.year === today.year ? today.month : 12;
  const dayLimit = !allowFuture && safe.year === today.year && safe.month === today.month
    ? Math.min(daysInMonth(safe.year, safe.month), today.day)
    : daysInMonth(safe.year, safe.month);
  const wantedDay = useRef(value.day);

  useEffect(() => {
    if (!now) return;
    const maxD = daysInMonth(safe.year, safe.month);
    const nextDay = Math.min(safe.day, maxD);
    if (
      safe.year !== value.year ||
      safe.month !== value.month ||
      nextDay !== value.day
    ) {
      onChange({ ...value, year: safe.year, month: safe.month, day: nextDay });
    }
  }, [now, safe.year, safe.month, safe.day, value, onChange]);

  function setDate(patch: Partial<Pick<BirthInput, "year" | "month" | "day">>) {
    if (patch.day != null) wantedDay.current = patch.day;

    const next = clampBirthDate(
      patch.year ?? value.year,
      patch.month ?? value.month,
      patch.day ?? wantedDay.current,
      now ?? new Date(),
      allowFuture,
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
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "day")}</span>
            <NumericDateInput
              value={safe.day}
              min={1}
              max={dayLimit}
              maxLength={2}
              ariaLabel={lang === "ta" ? "நாள்" : "Day"}
              testId="birth-day"
              onCommit={(day) => setDate({ day })}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "calMonth")}</span>
            <NumericDateInput
              value={safe.month}
              min={1}
              max={monthLimit}
              maxLength={2}
              ariaLabel={lang === "ta" ? "மாதம்" : "Month"}
              testId="birth-month"
              onCommit={(month) => setDate({ month })}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "year")}</span>
            <YearInput year={safe.year} min={MIN_BIRTH_YEAR} max={maxYear} onCommit={(year) => setDate({ year })} />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted">{t(lang, "dateHint")}</p>
      </div>
      <div>
        <Label>{t(lang, "time")}</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "hour")}</span>
            <FieldSelect value={clock.h} onChange={(v) => onChange({ ...value, hour: to24(Number(v), clock.ampm) })}>
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "minute")}</span>
            <FieldSelect value={value.minute} onChange={(v) => onChange({ ...value, minute: Number(v) })}>
              {MINUTES.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
            </FieldSelect>
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate" title={lang === "ta" ? "முற்பகல் / பிற்பகல் (AM / PM)" : "AM / PM"}>AM / PM</span>
            <FieldSelect value={clock.ampm} onChange={(v) => onChange({ ...value, hour: to24(clock.h, v as "AM" | "PM") })}>
              <option value="AM">{t(lang, "am")}</option>
              <option value="PM">{t(lang, "pm")}</option>
            </FieldSelect>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PlaceSearch } from "./place-search-field";          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "day")}</span>
            <NumericDateInput
              value={safe.day}
              min={1}
              max={dayLimit}
              maxLength={2}
              ariaLabel={lang === "ta" ? "நாள்" : "Day"}
              testId="birth-day"
              onCommit={(day) => setDate({ day })}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "calMonth")}</span>
            <NumericDateInput
              value={safe.month}
              min={1}
              max={monthLimit}
              maxLength={2}
              ariaLabel={lang === "ta" ? "மாதம்" : "Month"}
              testId="birth-month"
              onCommit={(month) => setDate({ month })}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs tracking-wide text-muted whitespace-nowrap truncate">{t(lang, "year")}</span>
            <YearInput year={safe.year} min={MIN_BIRTH_YEAR} max={maxYear} onCommit={(year) => setDate({ year })} />
          </div>

