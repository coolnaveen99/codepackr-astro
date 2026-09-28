import { describe, expect, it } from "vitest";
import { daysInMonth, isLeapYear } from "../src/components/birth-fields";

function normalizeNumericInput(raw: string, maxLength: number) {
  return raw.replace(/\D/g, "").slice(0, maxLength);
}

describe("manual birth date input regression", () => {
  it("allows year editing only up to four digits", () => {
    expect(normalizeNumericInput("1987", 4)).toBe("1987");
    expect(normalizeNumericInput("198765", 4)).toBe("1987");
    expect(normalizeNumericInput("19a8", 4)).toBe("198");
  });

  it("allows month/day editing only up to two digits", () => {
    expect(normalizeNumericInput("12", 2)).toBe("12");
    expect(normalizeNumericInput("123", 2)).toBe("12");
    expect(normalizeNumericInput("31", 2)).toBe("31");
    expect(normalizeNumericInput("315", 2)).toBe("31");
  });

  it("calculates leap years correctly", () => {
    expect(isLeapYear(2004)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2001)).toBe(false);
  });

  it("uses 29 days for February in leap years and 28 otherwise", () => {
    expect(daysInMonth(2004, 2)).toBe(29);
    expect(daysInMonth(2001, 2)).toBe(28);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });

  it("supports automatic February correction when the year changes", () => {
    expect(Math.min(31, daysInMonth(2004, 2))).toBe(29);
    expect(Math.min(31, daysInMonth(2001, 2))).toBe(28);
  });
});
