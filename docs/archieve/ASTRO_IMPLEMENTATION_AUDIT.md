# CodePackr Astro — Granular Implementation Audit & Mismatch Analysis

**Date:** 26-Sep-2026  
**Auditor:** Antigravity Autonomous Agent  
**Repository:** `coolnaveen99/codepackr-astro`  
**Purpose:** Pre-implementation audit recording existing codebase state, specification targets, mismatches, severity, affected files, and required tests prior to code modifications.

---

## 1. Audit Summary Matrix

| ID | Domain | Current Implementation | Target Specification | Mismatch Severity | Proposed Correction | Files Affected | Required Tests |
|---|---|---|---|---|---|---|---|
| **AUD-01** | **Ephemeris Declaration** | `profile.ts` declares `ephemeris: "swiss-ephemeris"` & `version.ts` claims Swiss Ephemeris, but code imports `astronomy-engine` (VSOP87/ELP2000). | Option B: Honest declaration of `astronomy-engine` (VSOP87/ELP2000, JPL DE benchmarked). | **High (P0)** | Update `profile.ts`, `version.ts`, `receipt.ts`, `types.ts`, and `CalculationMethodView` to honestly declare Astronomy Engine with zero Swiss Ephemeris claims. | `src/lib/astro/provenance/profile.ts`, `version.ts`, `receipt.ts`, `types.ts`, `calculation-method-view.tsx` | Benchmark tests against JPL DE440; receipt profile validation. |
| **AUD-02** | **Location & Timezone Fallback** | `DEFAULT_INPUT` in `samples.ts` and `App.tsx` silently falls back to Chennai (`lat: 13.0667, lon: 80.25, tz: 5.5, place: "Madras"`). | No silent Chennai fallback. Require validated location, resolve coordinates, resolve IANA timezone & historical offset before customer calculation. | **High (P0)** | Introduce location validation gate in Jathagam form. Store `locationVerified`, `ianaTimezone`, coordinates, and prompt user if unvalidated. | `src/components/jathagam-dashboard.tsx`, `src/lib/astro/engine.ts`, `src/lib/astro/samples.ts` | Location validation gate test; historical timezone offset test. |
| **AUD-03** | **Sunrise/Sunset Fallbacks** | `sunrise.ts` falls back to arbitrary `06:00` sunrise / `18:00` sunset if `SearchRiseSet` returns null. | No fabricated event fallbacks. Mark `status: "unavailable"` and display localized explanatory message in UI. | **High (P0)** | Set `sunriseJD: null, sunsetJD: null, status: "unavailable"` in polar/uncomputable cases. Render Tamil notice. | `src/lib/astro/astronomy/sunrise.ts`, `src/components/tamil-calendar-view.tsx`, `panchangam-view.tsx` | Polar latitude fallback test; unavailable status UI rendering. |
| **AUD-04** | **Home Page Information Architecture** | Root path `/` directly hosts the full Jathagam birth input form and auto-calculates sample horoscope. | `/` must be the complete CodePackr Astro Tools Landing Page with Directory, Search, Categories, Hero, and Popular Tools. Jathagam moved to `/jathagam`. | **High (P1)** | Move Jathagam workflow to `/jathagam`. Create new Home page component rendering tools from registry. Add redirect for legacy `/?d=...` query params. | `src/App.tsx`, `src/lib/nav.tsx`, `src/components/home-tools-view.tsx`, `src/lib/tools/astro-tools.ts` | Route resolution tests; legacy query redirection test. |
| **AUD-05** | **Tool Directory Registry** | Tool links scattered across ad-hoc navbar and footer items without a unified metadata source. | Single source of truth: `src/lib/tools/astro-tools.ts` with categories, bilingual titles, descriptions, paths, icons, and status flags. | **Medium (P1)** | Implement `astro-tools.ts` metadata registry covering all 20+ Astro tools. | `src/lib/tools/astro-tools.ts`, `src/components/home-tools-view.tsx`, `src/components/app-shell.tsx` | Registry completeness test; category filter tests. |
| **AUD-06** | **Forecast Horizon Refinement** | Forecasts currently output static strings ("முயற்சிகளுக்கு பலன்") and lack structured multi-horizon granularity. | 1Y (monthly), 3Y (quarterly/yearly), 5Y (yearly), 10Y/20Y/60Y (broad lifecycle). Evidence levels (Strong/Moderate/Mixed/Limited). Structured factors. | **Medium (P1)** | Connect prediction generator to calculated Dasha, Gochara transits, and rule matches with explicit evidence levels. | `src/lib/astro/prediction/forecast.ts`, `src/components/forecast-view.tsx` | Multi-horizon period count test; user-specific factor variation test. |
| **AUD-07** | **Tamil Calendar & Ingress** | Tamil calendar currently uses astronomical ingress (`findSolarIngress`), but month boundary rule needs explicit tradition documentation and edge-case handling. | Verify solar ingress without hardcoded April 14; handle day boundary rules (ingress before/after sunrise); full diurnal Panchang transitions. | **Medium (P0)** | Enhance ingress boundary solver with explicit Sankranti muhurtha and sunrise rule. Document convention in calculation receipt. | `src/lib/astro/calendar/tamil-calendar.ts`, `src/lib/astro/calendar/panchangam.ts` | Golden cases for Puthandu, Thai Pongal, and midnight boundary transitions. |
| **AUD-08** | **Combustion & Retrograde Stations** | Combustion uses a single fixed threshold; retrograde uses instantaneous velocity sign without station detection. | Document combustion threshold tradition in rule profile; classify station direct, station retrograde, direct, and retrograde. | **Low (P2)** | Add station detection interval refinement in `ephemeris.ts`; expose combustion angular separation and rule in report. | `src/lib/astro/astronomy/ephemeris.ts`, `src/lib/astro/chart/` | Retrograde station timing test. |

---

## 2. Duplicate Engine Audit

- **Astronomical Calculation:** Only one astronomical engine is permitted: `src/lib/astro/astronomy/` utilizing `astronomy-engine` for VSOP87/ELP2000 planetary and lunar positions.
- **Panchangam Engine:** All views (`/tamil-calendar`, `/panchangam`, `/jathagam`) must draw from `src/lib/astro/calendar/` and `src/lib/astro/astronomy/` rather than re-computing longitudes or tithis locally.
- **Varga & Chart Engine:** `src/lib/astro/chart/varga.ts` is the single authoritative source for D1 through D60.
- **Dasa Engine:** `src/lib/astro/dasha/vimshottari.ts` is the single authoritative source for 120-year Vimshottari Mahadasha, Antardasha, and Pratyantardasha.

---

## 3. Execution Plan

1. **Gate 1:** Ephemeris profile truthfulness (`profile.ts`, `version.ts`, `receipt.ts`, `CalculationMethodView`).
2. **Gate 2:** Location validation & timezone handling (no silent Chennai fallback, IANA tz).
3. **Gate 3:** Astronomical fallback cleanup (`sunrise.ts` status handling).
4. **Gate 4:** Calendar & Panchangam boundary checks.
5. **Gate 5:** Chart, Vargas & Vimshottari integrity.
6. **Gate 6:** Rule registry & Porutham factor transparency.
7. **Gate 7:** Forecast multi-horizon generator with evidence classification.
8. **Gate 8:** Tool registry (`src/lib/tools/astro-tools.ts`), Home page redesign (`/`), Jathagam migration (`/jathagam`), navigation update, and legacy URL redirect.
9. **Gate 9:** Route regression tests, build verification, and final QA report (`docs/ASTRO_FINAL_QA_REPORT.md`).
