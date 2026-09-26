import { describe, it, expect } from "vitest";
import { requirePanchangamLocation } from "../src/lib/astro/calendar/panchangam-location";

describe("Panchangam location guard", () => {
  it("rejects missing coordinates without assuming Chennai", () => {
    expect(() => requirePanchangamLocation({})).toThrowError(/requires explicit latitude/);
    expect(() => requirePanchangamLocation({ lat: NaN, lon: 80.27, tz: 5.5 })).toThrowError(/requires explicit latitude/);
  });

  it("accepts an explicit place", () => {
    const loc = requirePanchangamLocation({
      lat: 13.0827,
      lon: 80.2707,
      tz: 5.5,
      placeName: "Chennai",
    });
    expect(loc.placeName).toBe("Chennai");
    expect(loc.lat).toBe(13.0827);
  });
});
