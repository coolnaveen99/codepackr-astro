// Codepackr Astro — Astronomical Coordinates & Circular Math

/**
 * Normalizes an angle into the [0, 360) range.
 * Properly handles negative numbers and arbitrarily large numbers.
 * Examples: -1 -> 359, 360 -> 0, 361 -> 1.
 */
export function normalize360(x: number): number {
  const mod = x % 360;
  return mod < 0 ? mod + 360 : mod === -0 ? 0 : mod;
}

/**
 * Returns the shortest angular distance between two angles in degrees (0 to 180).
 * Examples: angularDistance(359, 1) -> 2, angularDistance(10, 350) -> 20.
 */
export function angularDistance(a: number, b: number): number {
  const diff = Math.abs(normalize360(a) - normalize360(b));
  return diff > 180 ? 360 - diff : diff;
}

/** Degree trigonometric functions */
export function sind(deg: number): number {
  return Math.sin((deg * Math.PI) / 180);
}

export function cosd(deg: number): number {
  return Math.cos((deg * Math.PI) / 180);
}

export function tand(deg: number): number {
  return Math.tan((deg * Math.PI) / 180);
}

export function asind(val: number): number {
  return (Math.asin(Math.max(-1, Math.min(1, val))) * 180) / Math.PI;
}

export function acosd(val: number): number {
  return (Math.acos(Math.max(-1, Math.min(1, val))) * 180) / Math.PI;
}

export function atan2d(y: number, x: number): number {
  return normalize360((Math.atan2(y, x) * 180) / Math.PI);
}

/** Returns the 0-11 zodiac sign index for a given longitude */
export function signIndex(lon: number): number {
  return Math.floor(normalize360(lon) / 30);
}

/** Formats longitude into standard degrees, minutes, seconds string */
export function dmsText(lon: number): string {
  const norm = normalize360(lon);
  const d = Math.floor(norm);
  const mf = (norm - d) * 60;
  const m = Math.floor(mf);
  const s = Math.floor((mf - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
}

export const toDMS = dmsText;

/** Returns sign index and degree within sign formatted as DMS */
export function signDms(lon: number): { sign: number; text: string; degreeInSign: number } {
  const s = signIndex(lon);
  const within = normalize360(lon) - s * 30;
  return { sign: s, text: dmsText(within), degreeInSign: within };
}
