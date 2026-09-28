import { describe, expect, it } from "vitest";

function normalizeYearInput(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 4);
}

describe("manual birth year editing regression", () => {
  it("allows the year field to become empty while editing", () => {
    expect(normalizeYearInput("")).toBe("");
  });

  it("preserves partially typed years without restoring the default", () => {
    expect(normalizeYearInput("1")).toBe("1");
    expect(normalizeYearInput("19")).toBe("19");
    expect(normalizeYearInput("198")).toBe("198");
  });

  it("accepts a fully typed four-digit year", () => {
    expect(normalizeYearInput("1987")).toBe("1987");
    expect(Number(normalizeYearInput("1987"))).toBe(1987);
  });
});
