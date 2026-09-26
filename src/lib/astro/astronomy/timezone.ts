// Codepackr Astro — IANA timezone resolution & historical UTC offset
// Zone *identity* is resolved from place name, country, and geographic regions.
// Zone *offset at a civil instant* always comes from Intl (IANA tzdb).
// longitude/15 is never treated as an authoritative IANA zone.

export type TimezoneSource =
  | "IANA tzdb"
  | "place-name"
  | "geographic-region"
  | "longitude-estimate";

export type ResolvedTimezone = {
  iana: string;
  source: TimezoneSource;
};

const COUNTRY_TO_IANA: Record<string, string> = {
  india: "Asia/Kolkata",
  "sri lanka": "Asia/Colombo",
  srilanka: "Asia/Colombo",
  singapore: "Asia/Singapore",
  malaysia: "Asia/Kuala_Lumpur",
  "united arab emirates": "Asia/Dubai",
  uae: "Asia/Dubai",
  dubai: "Asia/Dubai",
  qatar: "Asia/Qatar",
  "saudi arabia": "Asia/Riyadh",
  kuwait: "Asia/Kuwait",
  oman: "Asia/Muscat",
  bahrain: "Asia/Bahrain",
  pakistan: "Asia/Karachi",
  bangladesh: "Asia/Dhaka",
  nepal: "Asia/Kathmandu",
  bhutan: "Asia/Thimphu",
  myanmar: "Asia/Yangon",
  thailand: "Asia/Bangkok",
  indonesia: "Asia/Jakarta",
  philippines: "Asia/Manila",
  vietnam: "Asia/Ho_Chi_Minh",
  cambodia: "Asia/Phnom_Penh",
  laos: "Asia/Vientiane",
  china: "Asia/Shanghai",
  "hong kong": "Asia/Hong_Kong",
  taiwan: "Asia/Taipei",
  japan: "Asia/Tokyo",
  "south korea": "Asia/Seoul",
  korea: "Asia/Seoul",
  australia: "Australia/Sydney",
  "new zealand": "Pacific/Auckland",
  "united kingdom": "Europe/London",
  uk: "Europe/London",
  england: "Europe/London",
  scotland: "Europe/London",
  wales: "Europe/London",
  ireland: "Europe/Dublin",
  france: "Europe/Paris",
  germany: "Europe/Berlin",
  italy: "Europe/Rome",
  spain: "Europe/Madrid",
  portugal: "Europe/Lisbon",
  netherlands: "Europe/Amsterdam",
  belgium: "Europe/Brussels",
  switzerland: "Europe/Zurich",
  austria: "Europe/Vienna",
  poland: "Europe/Warsaw",
  sweden: "Europe/Stockholm",
  norway: "Europe/Oslo",
  denmark: "Europe/Copenhagen",
  finland: "Europe/Helsinki",
  greece: "Europe/Athens",
  turkey: "Europe/Istanbul",
  russia: "Europe/Moscow",
  ukraine: "Europe/Kyiv",
  "south africa": "Africa/Johannesburg",
  egypt: "Africa/Cairo",
  kenya: "Africa/Nairobi",
  nigeria: "Africa/Lagos",
  morocco: "Africa/Casablanca",
  ethiopia: "Africa/Addis_Ababa",
  canada: "America/Toronto",
  mexico: "America/Mexico_City",
  brazil: "America/Sao_Paulo",
  argentina: "America/Argentina/Buenos_Aires",
  chile: "America/Santiago",
  colombia: "America/Bogota",
  peru: "America/Lima",
  "united states": "America/New_York",
  usa: "America/New_York",
  us: "America/New_York",
};

function ianaFromPlace(place?: string): string | null {
  const p = (place || "").toLowerCase();
  if (!p) return null;

  if (
    p.includes("india") ||
    p.includes("chennai") ||
    p.includes("madras") ||
    p.includes("madurai") ||
    p.includes("coimbatore") ||
    p.includes("bengaluru") ||
    p.includes("bangalore") ||
    p.includes("delhi") ||
    p.includes("mumbai") ||
    p.includes("bombay") ||
    p.includes("kolkata") ||
    p.includes("calcutta") ||
    p.includes("hyderabad") ||
    p.includes("chittoor") ||
    p.includes("tirupati") ||
    p.includes("palamaner") ||
    p.includes("(tn)") ||
    p.includes("(ap)") ||
    p.includes("(m.p)") ||
    p.includes("(kr)") ||
    p.includes("(raj)") ||
    p.includes("(up)") ||
    p.includes("(bihar)") ||
    p.includes("(guj)") ||
    p.includes("(w.b)") ||
    p.includes("(u.p)") ||
    p.includes("தமிழ்நாடு") ||
    p.includes("சென்னை")
  ) {
    return "Asia/Kolkata";
  }

  if (p.includes("sri lanka") || p.includes("colombo") || p.includes("jaffna") || p.includes("(sl)")) {
    return "Asia/Colombo";
  }
  if (p.includes("singapore") || p.includes("சிங்கப்பூர்")) return "Asia/Singapore";
  if (p.includes("kuala lumpur") || p.includes("malaysia")) return "Asia/Kuala_Lumpur";
  if (p.includes("london") || p.includes("england") || p.includes("scotland") || /\buk\b/.test(p)) {
    return "Europe/London";
  }
  if (p.includes("new york") || p.includes("boston") || p.includes("washington")) return "America/New_York";
  if (p.includes("chicago") || p.includes("illinois") || p.includes("dallas") || p.includes("houston")) {
    return "America/Chicago";
  }
  if (p.includes("denver") || p.includes("colorado")) return "America/Denver";
  if (p.includes("los angeles") || p.includes("california") || p.includes("san francisco") || p.includes("seattle")) {
    return "America/Los_Angeles";
  }
  if (p.includes("dubai") || p.includes("abu dhabi") || p.includes("uae") || p.includes("sharjah")) return "Asia/Dubai";
  if (p.includes("paris") || p.includes("france")) return "Europe/Paris";
  if (p.includes("berlin") || p.includes("germany") || p.includes("munich")) return "Europe/Berlin";
  if (p.includes("tokyo") || p.includes("japan")) return "Asia/Tokyo";
  if (p.includes("sydney") || p.includes("melbourne") || p.includes("australia")) return "Australia/Sydney";

  const paren = p.match(/\(([^)]+)\)/);
  if (paren) {
    const key = paren[1]!.trim();
    if (COUNTRY_TO_IANA[key]) return COUNTRY_TO_IANA[key];
  }
  for (const [country, zone] of Object.entries(COUNTRY_TO_IANA)) {
    if (p.includes(country)) return zone;
  }
  return null;
}

function ianaFromCoordinates(lat: number, lon: number): string | null {
  if (lat >= 6.0 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5) {
    if (lat <= 9.9 && lon >= 79.5 && lon <= 82.0) return "Asia/Colombo";
    return "Asia/Kolkata";
  }
  if (lat >= 5.5 && lat <= 10.0 && lon >= 79.3 && lon <= 82.2) return "Asia/Colombo";
  if (lat >= 1.15 && lat <= 1.5 && lon >= 103.6 && lon <= 104.1) return "Asia/Singapore";
  if (lat >= 1.0 && lat <= 7.5 && lon >= 99.5 && lon <= 119.5) return "Asia/Kuala_Lumpur";
  if (lat >= 22.0 && lat <= 26.5 && lon >= 51.0 && lon <= 56.5) return "Asia/Dubai";
  if (lat >= 24.0 && lat <= 46.0 && lon >= 122.0 && lon <= 146.0) return "Asia/Tokyo";
  if (lat >= 49.5 && lat <= 61.0 && lon >= -8.5 && lon <= 2.0) return "Europe/London";
  if (lat >= 41.0 && lat <= 51.5 && lon >= -5.5 && lon <= 9.8) return "Europe/Paris";
  if (lat >= 47.0 && lat <= 55.2 && lon >= 5.8 && lon <= 15.1) return "Europe/Berlin";
  if (lat >= 36.0 && lat <= 47.2 && lon >= 6.5 && lon <= 18.6) return "Europe/Rome";
  if (lat >= 35.9 && lat <= 43.9 && lon >= -9.6 && lon <= 3.4) return "Europe/Madrid";
  if (lat >= -44.0 && lat <= -10.0 && lon >= 112.0 && lon <= 154.0) return "Australia/Sydney";
  if (lat >= 24.0 && lat <= 49.5 && lon >= -85.0 && lon <= -66.0) return "America/New_York";
  if (lat >= 25.0 && lat <= 49.5 && lon >= -104.0 && lon < -85.0) return "America/Chicago";
  if (lat >= 31.0 && lat <= 49.5 && lon >= -110.0 && lon < -104.0) return "America/Denver";
  if (lat >= 32.0 && lat <= 49.5 && lon >= -125.0 && lon < -110.0) return "America/Los_Angeles";
  if (lat >= 41.5 && lat <= 83.0 && lon >= -141.0 && lon <= -52.0) return "America/Toronto";
  if (lat >= -35.0 && lat <= 5.5 && lon >= -74.0 && lon <= -34.0) return "America/Sao_Paulo";
  if (lat >= 22.0 && lat <= 31.6 && lon >= 24.5 && lon <= 37.0) return "Africa/Cairo";
  if (lat >= -35.0 && lat <= -22.0 && lon >= 16.0 && lon <= 33.0) return "Africa/Johannesburg";
  if (lat >= 18.0 && lat <= 54.0 && lon >= 73.0 && lon <= 135.0) return "Asia/Shanghai";
  return null;
}

function longitudeEstimateZone(lon: number): string {
  const tzHour = Math.round(lon / 15);
  if (tzHour === 0) return "UTC";
  const etcSign = tzHour > 0 ? "-" : "+";
  return `Etc/GMT${etcSign}${Math.abs(tzHour)}`;
}

export function resolveIanaTimezoneAssignment(lat: number, lon: number, place?: string): ResolvedTimezone {
  const fromPlace = ianaFromPlace(place);
  if (fromPlace) return { iana: fromPlace, source: "place-name" };

  const fromGeo = ianaFromCoordinates(lat, lon);
  if (fromGeo) return { iana: fromGeo, source: "geographic-region" };

  return { iana: longitudeEstimateZone(lon), source: "longitude-estimate" };
}

export function resolveIanaTimezone(lat: number, lon: number, place?: string): string {
  return resolveIanaTimezoneAssignment(lat, lon, place).iana;
}

export function resolveHistoricalUtcOffset(
  ianaTimezone: string,
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  zoneSource?: TimezoneSource
): { offsetHours: number; offsetString: string; timezoneSource: string } {
  const getOffsetAtInstant = (dateObj: Date): { offsetHours: number; offsetString: string } => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaTimezone,
        timeZoneName: "longOffset",
        hourCycle: "h23",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      const parts = formatter.formatToParts(dateObj);
      const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT";
      const match = tzPart.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
      if (!match) return { offsetHours: 0, offsetString: "+00:00" };

      const sign = match[1] === "-" ? -1 : 1;
      const h = parseInt(match[2]!, 10);
      const m = match[3] ? parseInt(match[3], 10) : 0;
      const offsetHours = sign * (h + m / 60);
      const offsetString = `${match[1]}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      return { offsetHours, offsetString };
    } catch {
      return { offsetHours: 0, offsetString: "+00:00" };
    }
  };

  const initialTime = Date.UTC(year, month - 1, day, hour, minute);
  const firstPass = getOffsetAtInstant(new Date(initialTime));
  const refinedTime = initialTime - firstPass.offsetHours * 3600000;
  const secondPass = getOffsetAtInstant(new Date(refinedTime));

  const estimated = ianaTimezone.startsWith("Etc/GMT") || ianaTimezone === "UTC";
  return {
    offsetHours: secondPass.offsetHours,
    offsetString: secondPass.offsetString,
    timezoneSource: estimated ? "longitude-estimate" : zoneSource === "longitude-estimate" ? "longitude-estimate" : "IANA tzdb",
  };
}

export function isLocationVerified(locationVerified?: boolean): boolean {
  return locationVerified === true;
}
