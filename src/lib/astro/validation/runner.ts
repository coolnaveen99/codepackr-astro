// Codepackr Astro — Master Validation Test Runner
import { runEphemerisBenchmarks, type BenchmarkResult } from "../astronomy/validation";
import { runBoundaryTests, type BoundaryCheckResult } from "./boundaries";
import { evaluateAllGoldenCases, type GoldenTestEvaluation } from "./golden-cases";

export type MasterValidationReport = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  status: "ALL_PASS" | "FAILURES_PRESENT";
  ephemerisBenchmarks: BenchmarkResult[];
  boundaryTests: BoundaryCheckResult[];
  goldenCases: GoldenTestEvaluation[];
  summary: {
    astronomyPassCount: number;
    boundaryPassCount: number;
    goldenPassCount: number;
  };
};

/**
 * Runs the complete regression and validation suite across astronomy, boundaries, and golden charts.
 */
export function runMasterValidationSuite(): MasterValidationReport {
  const ephemeris = runEphemerisBenchmarks();
  const boundaries = runBoundaryTests();
  const golden = evaluateAllGoldenCases();

  const ephemerisPass = ephemeris.filter((e) => e.pass).length;
  const boundaryPass = boundaries.filter((b) => b.pass).length;
  const goldenPass = golden.filter((g) => g.pass).length;

  const total = ephemeris.length + boundaries.length + golden.length;
  const passed = ephemerisPass + boundaryPass + goldenPass;
  const failed = total - passed;

  return {
    totalTests: total,
    passedTests: passed,
    failedTests: failed,
    status: failed === 0 ? "ALL_PASS" : "FAILURES_PRESENT",
    ephemerisBenchmarks: ephemeris,
    boundaryTests: boundaries,
    goldenCases: golden,
    summary: {
      astronomyPassCount: ephemerisPass,
      boundaryPassCount: boundaryPass,
      goldenPassCount: goldenPass,
    },
  };
}
