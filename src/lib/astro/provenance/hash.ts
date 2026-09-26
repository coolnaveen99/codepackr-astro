// Codepackr Astro — Deterministic Calculation Hash Engine

/**
 * Creates a deterministic 32-bit FNV-1a based hex hash string from input calculation parameters.
 * Guarantees that identical inputs + profiles + version strings produce the exact same reportCalculationHash.
 */
export function generateCalculationHash(inputString: string): string {
  let hval = 0x811c9dc5;
  for (let i = 0; i < inputString.length; i++) {
    hval ^= inputString.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return "0x" + (hval >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

export function buildCalculationProvenanceHash(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  profileId: string,
  engineVersion: string,
  ruleSetVersion: string
): string {
  const payload = [
    birthDate,
    birthTime,
    latitude.toFixed(4),
    longitude.toFixed(4),
    timezone,
    profileId,
    engineVersion,
    ruleSetVersion,
  ].join("|");

  return generateCalculationHash(payload);
}
