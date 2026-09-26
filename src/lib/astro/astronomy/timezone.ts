// Codepackr Astro — Real IANA Timezone Resolution & Historical UTC Offset Engine
// Complies with Sections 4 & 5 of Implementation Specification

/**
 * Resolves the canonical IANA timezone identifier for a given geographic coordinate and optional place name.
 * Does not use simple longitude / 15 as authoritative identifier.
 */
export function resolveIanaTimezone(lat: number, lon: number, place?: string): string {
  const p = (place || "").toLowerCase();

  // 1. Explicit place name / country hints
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

  if (p.includes("singapore") || p.includes("சிங்கப்பூர்")) {
    return "Asia/Singapore";
  }

  if (p.includes("kuala lumpur") || p.includes("malaysia")) {
    return "Asia/Kuala_Lumpur";
  }

  if (p.includes("london") || p.includes("uk") || p.includes("england") || p.includes("scotland")) {
    return "Europe/London";
  }

  if (p.includes("new york") || p.includes("ny") || p.includes("boston") || p.includes("washington")) {
    return "America/New_York";
  }

  if (p.includes("chicago") || p.includes("illinois") || p.includes("texas") || p.includes("dallas")) {
    return "America/Chicago";
  }

  if (p.includes("los angeles") || p.includes("california") || p.includes("san francisco")) {
    return "America/Los_Angeles";
  }

  if (p.includes("dubai") || p.includes("abu dhabi") || p.includes("uae") || p.includes("sharjah")) {
    return "Asia/Dubai";
  }

  if (p.includes("paris") || p.includes("france")) {
    return "Europe/Paris";
  }

  if (p.includes("berlin") || p.includes("germany") || p.includes("munich")) {
    return "Europe/Berlin";
  }

  if (p.includes("tokyo") || p.includes("japan")) {
    return "Asia/Tokyo";
  }

  if (p.includes("sydney") || p.includes("melbourne") || p.includes("australia")) {
    return "Australia/Sydney";
  }

  // 2. Geographic bounding boxes
  // India (mainland + islands)
  if (lat >= 6.0 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5) {
    // Check if within Sri Lanka
    if (lat <= 9.9 && lon >= 79.5 && lon <= 82.0) {
      return "Asia/Colombo";
    }
    return "Asia/Kolkata";
  }

  // Sri Lanka
  if (lat >= 5.5 && lat <= 10.0 && lon >= 79.3 && lon <= 82.2) {
    return "Asia/Colombo";
  }

  // Singapore
  if (lat >= 1.15 && lat <= 1.5 && lon >= 103.6 && lon <= 104.1) {
    return "Asia/Singapore";
  }

  // Malaysia
  if (lat >= 1.0 && lat <= 7.5 && lon >= 99.5 && lon <= 119.5) {
    return "Asia/Kuala_Lumpur";
  }

  // UK
  if (lat >= 49.5 && lat <= 61.0 && lon >= -8.5 && lon <= 2.0) {
    return "Europe/London";
  }

  // UAE
  if (lat >= 22.0 && lat <= 26.5 && lon >= 51.0 && lon <= 56.5) {
    return "Asia/Dubai";
  }

  // Japan
  if (lat >= 24.0 && lat <= 46.0 && lon >= 122.0 && lon <= 146.0) {
    return "Asia/Tokyo";
  }

  // North America
  if (lat >= 24.0 && lat <= 50.0) {
    if (lon >= -85.0 && lon <= -65.0) return "America/New_York";
    if (lon >= -105.0 && lon < -85.0) return "America/Chicago";
    if (lon >= -115.0 && lon < -105.0) return "America/Denver";
    if (lon >= -130.0 && lon < -115.0) return "America/Los_Angeles";
  }

  // Europe
  if (lat >= 35.0 && lat <= 70.0 && lon >= -10.0 && lon <= 30.0) {
    return "Europe/Paris";
  }

  // Global anchor fallback using timezone hours
  const tzHour = Math.round(lon / 15);
  if (tzHour === 0) return "UTC";
  // Format valid Etc/GMT identifier with POSIX inverted sign
  const etcSign = tzHour > 0 ? "-" : "+";
  return `Etc/GMT${etcSign}${Math.abs(tzHour)}`;
}

/**
 * Resolves the exact historical UTC offset for any IANA timezone and local calendar date/time.
 * Uses standard Intl.DateTimeFormat (backed by the authoritative IANA tzdb).
 * Performs a 2-pass instant calculation to accurately detect historical daylight saving boundaries.
 */
export function resolveHistoricalUtcOffset(
  ianaTimezone: string,
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0
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
      if (!match) {
        return { offsetHours: 0, offsetString: "+00:00" };
      }

      const sign = match[1] === "-" ? -1 : 1;
      const h = parseInt(match[2]!, 10);
      const m = match[3] ? parseInt(match[3], 10) : 0;
      const offsetHours = sign * (h + m / 60);
      const offsetString = `${match[1]}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      return { offsetHours, offsetString };
    } catch {
      // Fallback if environment lacks specified IANA zone
      return { offsetHours: 0, offsetString: "+00:00" };
    }
  };

  // Pass 1: Initial estimate assuming target wall clock as UTC
  const initialTime = Date.UTC(year, month - 1, day, hour, minute);
  const firstPass = getOffsetAtInstant(new Date(initialTime));

  // Pass 2: Refine instant by adjusting for the first-pass offset
  const refinedTime = initialTime - firstPass.offsetHours * 3600000;
  const secondPass = getOffsetAtInstant(new Date(refinedTime));

  return {
    offsetHours: secondPass.offsetHours,
    offsetString: secondPass.offsetString,
    timezoneSource: "IANA tzdb",
  };
}

/**
 * Validates whether location is authentically verified.
 * Strictly requires explicit user selection / verification flag;
 * never infers verification merely from finite numbers and a non-empty string.
 */
export function isLocationVerified(locationVerified?: boolean): boolean {
  return locationVerified === true;
}
