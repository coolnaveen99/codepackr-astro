import { CheckCircle2, MapPin, Search, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BirthInput, City } from "@/lib/astro/engine";
import { resolveIanaTimezone } from "@/lib/astro/astronomy/timezone";
import { t, type Lang } from "@/lib/astro/i18n";
import { EXTRA_INDIA_TOWNS, searchCities } from "@/lib/astro/place-search";
import {
  INDIA_STATES,
  loadCountryPlaces,
  loadIndiaStatePlaces,
  type IndiaState,
  type RegionMode,
} from "@/lib/astro/place-india";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [region, setRegion] = useState<RegionMode>("IN");
  const [stateCode, setStateCode] = useState("tn");
  const [query, setQuery] = useState(value.place);
  const [pool, setPool] = useState<City[]>(EXTRA_INDIA_TOWNS);
  const [matches, setMatches] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const state = INDIA_STATES.find((s) => s.code === stateCode) ?? INDIA_STATES[0]!;

  useEffect(() => {
    let cancelled = false;
    const run = region === "OUT" ? loadCountryPlaces() : loadIndiaStatePlaces(state);
    run.then((rows) => {
      if (cancelled) return;
      const extra = region === "IN" && state.tag ? EXTRA_INDIA_TOWNS.filter((c) => c.n.includes(state.tag!)) : [];
      setPool([...extra, ...rows]);
    });
    return () => {
      cancelled = true;
    };
  }, [region, state.code]);

  useEffect(() => {
    setQuery(value.place);
  }, [value.place]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMatches(searchCities(pool, query, 16)), 60);
    return () => window.clearTimeout(timer);
  }, [pool, query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pickCity(c: City) {
    setQuery(c.n);
    const ianaTimezone = resolveIanaTimezone(c.lat, c.lon, c.n);
    onChange({
      ...value,
      place: c.n,
      lat: c.lat,
      lon: c.lon,
      tz: c.tz,
      locationVerified: true,
      ianaTimezone,
    });
    setOpen(false);
  }

  function pickState(next: IndiaState) {
    setStateCode(next.code);
    setQuery("");
    setOpen(false);
  }

  const isLocationVerified = Boolean(
    value.locationVerified === true && value.place && Number.isFinite(value.lat) && Number.isFinite(value.lon),
  );
  const placeHint =
    region === "OUT"
      ? lang === "ta"
        ? "நாட்டின் பெயரைத் தேடுங்கள்"
        : "Search a country name"
      : state.towns
        ? lang === "ta"
          ? "ஊர் / நகரம்"
          : "Town or city"
        : lang === "ta"
          ? "மாவட்டம் மட்டும்"
          : "District name only";

  return (
    <div ref={boxRef} className="relative flex flex-col gap-2">
      <Label htmlFor={id}>{t(lang, "place")}</Label>
      <div className="grid grid-cols-2 gap-2">
        <select
          className="h-11 w-full rounded-md bg-surface px-2 text-sm text-fg shadow-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value as RegionMode);
            setQuery("");
            setOpen(false);
          }}
        >
          <option value="IN">{lang === "ta" ? "இந்தியா" : "India"}</option>
          <option value="OUT">{lang === "ta" ? "வெளிநாடு" : "Outside India"}</option>
        </select>
        {region === "IN" ? (
          <select
            className="h-11 w-full rounded-md bg-surface px-2 text-sm text-fg shadow-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            value={stateCode}
            onChange={(e) => {
              const next = INDIA_STATES.find((s) => s.code === e.target.value);
              if (next) pickState(next);
            }}
          >
            {INDIA_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {lang === "ta" ? s.nameTa : s.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex h-11 items-center rounded-md bg-elevated px-2 text-xs text-muted">
            {lang === "ta" ? "நாடு மட்டும்" : "Country names only"}
          </div>
        )}
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 left-3 size-5 text-muted" />
        <Input
          id={id}
          className="pl-10"
          value={query}
          placeholder={placeHint}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
      </div>
      {isLocationVerified ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
            <span>{lang === "ta" ? "\u2713 \u0b87\u0b9f\u0bae\u0bcd \u0b9a\u0bb0\u0bbf\u0baa\u0bbe\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0ba4\u0bc1" : "\u2713 Location verified"}</span>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-xs text-rose-900 flex items-center gap-1.5 font-medium">
          <MapPin className="size-3.5 text-rose-600 shrink-0" />
          <span>{lang === "ta" ? "\u0b87\u0b9f\u0bae\u0bcd \u0ba4\u0bc7\u0bb0\u0bcd\u0bb5\u0bc1 \u0b9a\u0bc6\u0baf\u0bcd\u0baf\u0bb5\u0bc1\u0bae\u0bcd" : "Select a location"}</span>
        </div>
      )}
      {open ? (
        <div className="absolute z-20 top-full mt-1 max-h-56 w-full overflow-auto rounded-md bg-surface py-1 shadow-card">
          {matches.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted">{t(lang, "noPlace")}</div>
          ) : (
            matches.map((c) => (
              <button
                key={c.n + String(c.lon)}
                type="button"
                onClick={() => pickCity(c)}
                className="flex w-full items-baseline justify-between px-3 py-2 text-left text-sm hover:bg-elevated"
              >
                <span>{c.n}</span>
                <span className="text-xs text-muted">{c.lat.toFixed(1)}\u00b0 / {c.lon.toFixed(1)}\u00b0</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
