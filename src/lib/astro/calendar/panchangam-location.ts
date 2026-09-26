// Guard used by daily Panchangam so missing coords never become Chennai.
export function requirePanchangamLocation(input: {
  lat?: number;
  lon?: number;
  tz?: number;
  placeName?: string;
}): { lat: number; lon: number; tz: number; placeName: string } {
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lon) || !Number.isFinite(input.tz)) {
    throw new Error("Daily Panchangam requires explicit latitude, longitude, and timezone. No city is assumed.");
  }
  return {
    lat: input.lat as number,
    lon: input.lon as number,
    tz: input.tz as number,
    placeName: input.placeName?.trim() || "Unspecified location",
  };
}
