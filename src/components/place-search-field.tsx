import { CheckCircle2, MapPin, Search, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BirthInput, City } from "@/lib/astro/engine";
import { resolveIanaTimezone } from "@/lib/astro/astronomy/timezone";
import { t, type Lang } from "@/lib/astro/i18n";
import { POPULAR_CITIES } from "@/lib/astro/samples";
import { EXTRA_INDIA_TOWNS, mergeCityLists, searchCities } from "@/lib/astro/place-search";
import { prefetchPopularShards, searchPlacesFast } from "@/lib/astro/place-fast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOCAL = mergeCityLists(POPULAR_CITIES, EXTRA_INDIA_TOWNS);

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
  const [matches, setMatches] = useState<City[]>(() => searchCities(LOCAL, value.place, 16));
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  useEffect(() => {
    prefetchPopularShards();
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

  useEffect(() => {
    const idn = ++seq.current;
    const timer = window.setTimeout(() => {
      void searchPlacesFast(query, LOCAL, 16).then((hits) => {
        if (idn === seq.current) setMatches(hits);
      });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [query]);

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

  const isLocationVerified = Boolean(
    value.locationVerified === true && value.place && Number.isFinite(value.lat) && Number.isFinite(value.lon),
  );
  const isManualCoordinates = Boolean(
    !isLocationVerified && value.place && Number.isFinite(value.lat) && Number.isFinite(value.lon),
  );

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
      {isLocationVerified ? (
        <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
            <span>{lang === "ta" ? "✓ இடம் சரிபார்க்கப்பட்டது" : "✓ Location verified"}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800">
            {value.lat.toFixed(2)}°N {value.lon.toFixed(2)}°E · {value.ianaTimezone || `UTC${value.tz >= 0 ? "+" : ""}${value.tz}`}
          </span>
        </div>
      ) : isManualCoordinates ? (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="size-3.5 text-amber-600 shrink-0" />
            <span>{lang === "ta" ? "கைமுறை ஆயத்தொலைவுகள் (சரிபார்க்கப்படவில்லை)" : "Manual coordinates (Unverified)"}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-800">
            {value.lat.toFixed(2)}°N {value.lon.toFixed(2)}°E · UTC{value.tz >= 0 ? "+" : ""}{value.tz}
          </span>
        </div>
      ) : (
        <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="size-3.5 text-rose-600 shrink-0" />
            <span>{lang === "ta" ? "இடம் தேர்வு செய்யவும்" : "Select a location"}</span>
          </div>
        </div>
      )}
      {open ? (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-surface py-1 shadow-card">
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
                <span className="text-xs text-muted">{c.lat.toFixed(1)}° / {c.lon.toFixed(1)}°</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
