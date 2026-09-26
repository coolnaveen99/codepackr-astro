# Validation & Automated Testing Suite

CodePackr Astro operates under strict continuous verification. Calculation accuracy is verified through automated unit tests, astronomical benchmarks against NASA JPL DE440, and deterministic golden regression fixtures.

---

## 1. Test Architecture

The test suite runs on **Vitest** and covers both mathematical astronomy and astrological logic:

```bash
# Run the complete test suite
npm test

# Typecheck and lint codebase
npm run lint

# Test production compilation & static SPA routes
npm run build
```

---

## 2. Test Suites Overview

| Test Suite | File Path | Focus & Assertions |
| :--- | :--- | :--- |
| **Route & Foundation** | `tests/route-and-foundation.test.ts` | • Canonical URL routing (`/`, `/jathagam`, `/tamil-calendar`, `/panchangam` alias, `/forecast`).<br>• Jathagam report mode query parameters (`mode=one`, `mode=six`, `mode=thirty`).<br>• Authoritative tools registry integrity (20+ tools).<br>• `DEFAULT_PRODUCTION_PROFILE` locked values (Thirukanitham default, mean nodes, whole sign).<br>• Coordinate boundary validation ($[-90, +90]$, $[-180, +180]$) and missing coord rejection.<br>• Verified vs. user-supplied location tracking.<br>• IANA timezone resolution (`tz-lookup`) and historical DST offsets.<br>• Golden regression fixtures (Chennai, New Delhi, London BST, NY historical DST, Polar winter). |
| **Astronomical Accuracy** | `tests/astro-accuracy.test.ts` | • Ecliptic angle normalization $[0, 360)$ and circular shortest distance.<br>• 60-year Jovian Samvatsara sequence (1987 Prabhava anchor to 2046 Akshaya).<br>• Solar ingress (Sankranti) determination and Tamil month transitions.<br>• Tithi, Nakshatra, Navamsa (D9), and D60 calculations.<br>• Vimshottari Dasa balance and 120-year sequence totals.<br>• Dasakoota 10-Porutham scoring and Rajju/Vedha dosha checks.<br>• 24h Panchangam timeline and astronomical festival rules. |
| **Location Guard** | `tests/panchangam-location.test.ts` | • Strict enforcement of explicit latitude, longitude, and timezone.<br>• Zero silent fallback to Chennai when input is missing or invalid. |

---

## 3. NASA JPL DE440 Ephemeris Benchmarking

The platform's ephemeris positions are verified against NASA JPL DE440 analytical standards:

- **Ephemeris Engine:** `astronomy-engine` (VSOP87 planetary theory, ELP2000 lunar theory).
- **Tolerance Limit:** Maximum permissible longitudinal variance is **< 60 arcseconds (< 0.0166°)**.
- **Evaluated Bodies:** Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.
- **In-Browser Benchmark:** The live benchmark suite is accessible to end users at `/dev/astro-validation` and executes 50+ benchmark test cases on device.

---

## 4. Golden Regression Fixtures

The test suite locks down known historical chart cases to prevent regressions:

1. **Golden Case 1 (Chennai, India):**
   - **Date & Time:** May 15, 1990, 10:30 IST
   - **Coordinates:** 13.0827°N, 80.2707°E (Timezone: `Asia/Kolkata`, UTC+05:30)
   - **Verified Placements:** Lagna in Cancer (3), Sun in Taurus (1), Moon in Sagittarius (8, Uttarashadha Pada 1), Thirukanitham ayanamsa.

2. **Golden Case 2 (New Delhi, India — J2000 Millennial Epoch):**
   - **Date & Time:** January 1, 2000, 12:00 IST
   - **Coordinates:** 28.6139°N, 77.2090°E (Timezone: `Asia/Kolkata`, UTC+05:30)
   - **Verified Placements:** Lagna in Pisces (11), Sun in Sagittarius (8), Moon in Libra (6).

3. **Golden Case 3 (London, UK — British Summer Time DST):**
   - **Date & Time:** July 1, 2023, 14:00 BST
   - **Coordinates:** 51.5074°N, 0.1278°W (Timezone: `Europe/London`, UTC+01:00)
   - **Verified Offset:** Exact DST detection (`+01:00`), Sun in Gemini (2).

4. **Golden Case 4 (New York, USA — Historical US Daylight Saving Time):**
   - **Date & Time:** August 15, 1995, 08:30 EDT
   - **Coordinates:** 40.7128°N, 74.0060°W (Timezone: `America/New_York`, UTC-04:00)
   - **Verified Offset:** Historical DST detection (`-04:00`), Sun in Cancer (3).

5. **Golden Case 5 (Polar Winter Solstice — 85°N, 0°E):**
   - **Date:** December 21, 2026
   - **Verified Behavior:** `sunriseJD: null`, `sunsetJD: null`, `status: "unavailable"`. Verifies zero fake 06:00/18:00 constants.

---

## 5. Continuous Integration (GitHub Actions)

Every pull request and push to `main` runs the CI pipeline defined in `.github/workflows/ci.yml`:

```yaml
steps:
  - name: Run Tests
    run: npm test

  - name: Typecheck
    run: npm run lint

  - name: Test Production Build
    run: npm run build
```

The build is blocked if any unit test fails, if TypeScript diagnostics are raised, or if the client SPA bundle fails to compile.
