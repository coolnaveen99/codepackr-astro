// Codepackr Astro — Boundary Validation Test Suite
import { normalize360, angularDistance, signIndex } from "../astronomy/coordinates";
import { nakshatraDetails } from "../calendar/nakshatra";
import { calculateNavamsa, calculateVargaSign } from "../chart/varga";
import { samvatsaraIndexFromYear, getSamvatsaraByIndex } from "../calendar/samvatsara";

export type BoundaryCheckResult = {
  testId: string;
  name: string;
  input: string;
  expected: string;
  actual: string;
  diff: string;
  tolerance: string;
  pass: boolean;
};

/**
 * Executes comprehensive mathematical boundary tests across circular math,
 * Samvatsara cycle wrapping, Rasi, Nakshatra, Navamsa, and D60 divisional borders.
 */
export function runBoundaryTests(): BoundaryCheckResult[] {
  const results: BoundaryCheckResult[] = [];

  const check = (
    testId: string,
    name: string,
    input: string,
    expected: string,
    actual: string,
    pass: boolean,
    diff: string = "0",
    tolerance: string = "Exact"
  ) => {
    results.push({
      testId,
      name,
      input,
      expected,
      actual,
      diff,
      tolerance,
      pass,
    });
  };

  // 1. Angular normalization tests
  check("norm-neg-1", "Normalize -1°", "-1°", "359°", `${normalize360(-1)}°`, normalize360(-1) === 359);
  check("norm-360", "Normalize 360°", "360°", "0°", `${normalize360(360)}°`, normalize360(360) === 0);
  check("norm-361", "Normalize 361°", "361°", "1°", `${normalize360(361)}°`, normalize360(361) === 1);
  check("norm-large-neg", "Normalize -725°", "-725°", "355°", `${normalize360(-725)}°`, normalize360(-725) === 355);

  // 2. Circular distance across 0/360 boundary
  const dist359_1 = angularDistance(359, 1);
  check("dist-359-1", "Angular distance (359°, 1°)", "359°, 1°", "2°", `${dist359_1}°`, dist359_1 === 2);
  const dist10_350 = angularDistance(10, 350);
  check("dist-10-350", "Angular distance (10°, 350°)", "10°, 350°", "20°", `${dist10_350}°`, dist10_350 === 20);

  // 3. 60-Year cycle wrap tests
  const sam1987 = samvatsaraIndexFromYear(1987);
  check("sam-anchor-1987", "Samvatsara 1987 Anchor", "1987", "1 (Prabhava)", `${sam1987} (${getSamvatsaraByIndex(sam1987).nameEn})`, sam1987 === 1);

  const sam2024 = samvatsaraIndexFromYear(2024);
  check("sam-2024", "Samvatsara 2024 (Krodhi)", "2024", "38 (Krodhi)", `${sam2024} (${getSamvatsaraByIndex(sam2024).nameEn})`, sam2024 === 38);

  const sam2025 = samvatsaraIndexFromYear(2025);
  check("sam-2025", "Samvatsara 2025 (Vishvavasu)", "2025", "39 (Vishvavasu)", `${sam2025} (${getSamvatsaraByIndex(sam2025).nameEn})`, sam2025 === 39);

  const sam2026 = samvatsaraIndexFromYear(2026);
  check("sam-2026", "Samvatsara 2026 (Parabhava)", "2026", "40 (Parabhava)", `${sam2026} (${getSamvatsaraByIndex(sam2026).nameEn})`, sam2026 === 40);

  const sam2046 = samvatsaraIndexFromYear(2046);
  check("sam-2046", "Samvatsara 2046 (Akshaya 60)", "2046", "60 (Akshaya)", `${sam2046} (${getSamvatsaraByIndex(sam2046).nameEn})`, sam2046 === 60);

  const sam2047 = samvatsaraIndexFromYear(2047);
  check("sam-2047-wrap", "Samvatsara 2047 Wrap to Prabhava", "2047", "1 (Prabhava)", `${sam2047} (${getSamvatsaraByIndex(sam2047).nameEn})`, sam2047 === 1);

  // 4. Rasi sign boundary (29°59′59″ vs 30°00′01″)
  const signBelow = signIndex(29.9999);
  const signAbove = signIndex(30.0001);
  check("rasi-below-30", "Rasi below 30°", "29.9999°", "0 (Aries)", `${signBelow}`, signBelow === 0);
  check("rasi-above-30", "Rasi above 30°", "30.0001°", "1 (Taurus)", `${signAbove}`, signAbove === 1);

  // 5. Nakshatra boundary (13°19′59″ vs 13°20′01″)
  const nakBelow = nakshatraDetails(13.3330);
  const nakAbove = nakshatraDetails(13.3335);
  check("nak-ashwini-pada4", "Nakshatra Ashwini Pada 4", "13.3330°", "Ashwini Pada 4", `${nakBelow.nameEn} Pada ${nakBelow.pada}`, nakBelow.index === 0 && nakBelow.pada === 4);
  check("nak-bharani-pada1", "Nakshatra Bharani Pada 1", "13.3335°", "Bharani Pada 1", `${nakAbove.nameEn} Pada ${nakAbove.pada}`, nakAbove.index === 1 && nakAbove.pada === 1);

  // 6. Navamsa boundary (3°19′59″ vs 3°20′01″ in Aries)
  const d9Below = calculateNavamsa(3.3330);
  const d9Above = calculateNavamsa(3.3335);
  check("navamsa-boundary-1", "Navamsa 1st to 2nd pada border", "3.3330° vs 3.3335°", "0 (Aries) then 1 (Taurus)", `${d9Below} then ${d9Above}`, d9Below === 0 && d9Above === 1);

  // 7. D60 boundary (0°29′59″ vs 0°30′01″ in Aries)
  const d60Below = calculateVargaSign(0.4999, 60);
  const d60Above = calculateVargaSign(0.5001, 60);
  check("d60-boundary-1", "D60 0°30′ boundary", "0.4999° vs 0.5001°", "0 (Aries) then 1 (Taurus)", `${d60Below} then ${d60Above}`, d60Below === 0 && d60Above === 1);

  return results;
}
