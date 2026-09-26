# CodePackr Astro — Accuracy Roadmap

**Document Version:** 1.0.0  
**Project:** `astro.codepackr.com`  
**Repository:** `coolnaveen99/codepackr-astro`  
**Date:** 26 September 2026  
**Status:** Active Execution Roadmap  

---

## 1. Overview & Strategy

This roadmap tracks the transition of CodePackr Astro from snapshot-based heuristics to an accuracy-first, traceable, and validated Tamil astrology and astronomical calculation platform.

### Core Architectural Principle
Calculations are divided strictly into two layers:
1. **Astronomical & Calendar Layer:** Empirically reproducible physics and celestial mechanics (ephemeris, coordinates, sidereal zodiac, solar ingress, event-based transitions for Tithi, Nakshatra, Yoga, Karana, sunrise/sunset).
2. **Traditional Astrology Layer:** Rule-based interpretation derived from classical Tamil and Vedic texts (Parashara, Jaimini, Phaladeepika, Mantreswara). Astrology predictions are explicitly presented as traditional interpretations, not scientifically proven certainties.

---

## 2. Production Calculation Profile (Locked)

| Parameter | Default Production Value | Alternatives Supported |
|---|---|---|
| **Zodiac** | Sidereal | Tropical (for astronomical debug) |
| **Ayanamsa** | Lahiri / Chitrapaksha (Base J2000 23°51′08.3″, precession rate 50.29″/yr) | Raman, KP, Tamil Thirukanitham |
| **Lunar Node Mode** | Mean Node (Rahu and Ketu exactly 180° apart) | True Node |
| **House System** | Whole Sign (Bhava 1 = entire Lagna sign) | Equal, Sripati, Placidus |
| **Calendar Method** | Thirukanitham-oriented Tamil Solar Calendar (Event-based Sun ingress) | Classical regional profiles |
| **Dasa System** | Vimshottari (120-year cycle, Moon Nakshatra based) | Antardasa, Pratyantardasa |
| **Ephemeris Engine** | Swiss Ephemeris / High-Accuracy Astronomy Engine | Benchmarked against JPL DE440/DE441/Horizons |
| **Timezone Reference** | IANA Time Zone Database (`iana-tzdb`) | Historical UTC offsets and DST |

---

## 3. Implementation Phasing & Milestones

### Phase 1: Architecture, Provenance & Quality Gates (P0) — DONE
- [x] Audit existing engine in `src/lib/astro/engine.ts`.
- [x] Lock production calculation profile.
- [x] Implement CalculationMetadata, CalculationReceipt, and reportCalculationHash.
- [x] Establish test runner (`vitest`) and golden testing infrastructure.

### Phase 2: Astronomical Foundation & Angular Normalization (P0) — DONE
- [x] `normalize360(deg)` and `angularDistance(a, b)` with 0/360° circular boundary wrapping.
- [x] Planetary apparent geocentric ecliptic longitudes.
- [x] Longitudinal velocity and retrograde station detection.
- [x] Planet-specific combustion thresholds and separation measurement.
- [x] True astronomical sunrise/sunset with atmospheric refraction.

### Phase 3: Event-Based Panchangam Engine (P0) — DONE
- [x] Tithi: Root-finding / interpolation of Sun-Moon elongation across 12° intervals with exact start/end instants.
- [x] Nakshatra: Moon sidereal longitude across 13°20′ boundaries with exact start/end instants and Pada (3°20′).
- [x] Yoga: Sun + Moon longitude across 13°20′ boundaries with exact start/end instants.
- [x] Karana: Sun-Moon elongation across 6° intervals with repeating and 4 fixed Karanas.
- [x] Local Muhurtha intervals: Rahu Kalam, Yamagandam, Gulikai calculated from actual sunrise/sunset spans.

### Phase 4: Tamil Solar Calendar & 60-Year Samvatsara (P0) — DONE
- [x] Event-based Tamil solar months derived from Sun's exact sidereal ingress into the 12 Rasis (Mesha -> Chithirai to Meena -> Panguni).
- [x] Elimination of fixed "April 14" assumptions.
- [x] Canonical 60-year Samvatsara dataset (1 Prabhava to 60 Akshaya) in Tamil and English.
- [x] Verified anchor: 1987-1988 = Prabhava (Cycle 1). Correct wrap: 59 -> 60 -> 1.
- [x] Gregorian <-> Tamil calendar conversion engine.
- [x] Dedicated UI route `/tamil-calendar` with 60-year navigation.

### Phase 5: Jathagam, Vargas & Dasa Validation (P1) — DONE
- [x] Accurate Lagna computation with local sidereal time (RAMC) and geographic latitude/longitude.
- [x] D1 to D60 Varga mathematical formulas with boundary testing (0°, 29°59′59″, 30°).
- [x] D60 birth-time sensitivity warning for approximate birth times.
- [x] Vimshottari Dasa balance at birth and hierarchical timeline (Maha Dasa, Antardasa, Pratyantardasa).
- [x] Birth-time sensitivity testing (+/- 5 min, +/- 10 min) rating charts as Stable, Moderately Sensitive, or Highly Sensitive.

### Phase 6: Transits, Aspects & Traditional Astrological Rules (P1) — DONE
- [x] Gochara transit event detection (sign ingress, nakshatra ingress, retrograde and direct stations).
- [x] Sade Sati calculation (12th, 1st, 2nd signs from natal Moon with current phase and duration).
- [x] Canonical planetary dignity lookup (exaltation, debilitation, own sign, moolatrikona, friendly, neutral, enemy).
- [x] Traditional Vedic special planetary aspects (Saturn 3/10, Jupiter 5/9, Mars 4/8, all planets 7).
- [x] Centralized Yoga & Dosha rule registry with classical citations (Parashara, Phaladeepika, Mantreswara).
- [x] Dasakoota Porutham evaluating all 10 factors individually with traditional rules and explanations.

### Phase 7: Prediction Engine, Conflict Engine & Forecast Horizons (P1/P2) — DONE
- [x] Structured machine-readable prediction evidence (`PredictionEvidence`).
- [x] Contradiction handling: Positive + Caution factors resolve to Mixed/Restrained interpretations.
- [x] 16 life domains: Overall, Career, Finance, Business, Education, Marriage, Family, Children, Property, Vehicle, Travel, Foreign, Wellness, Spirituality, Personal development, Social reputation.
- [x] Horizon scaling: 1 year (monthly), 3 years (quarterly/yearly), 5 years (yearly), 10 years (major phases), 20 years (lifecycle themes), 60 years (broad Tamil year/Dasa/slow transit themes).
- [x] Customer-facing "இந்த முடிவு ஏன்? / Why this result?" UI with evidence breakdown.
- [x] Strict wellness disclaimer ("ஜோதிட விளக்கம் மருத்துவ பரிசோதனை அல்லது மருத்துவர் ஆலோசனைக்கு மாற்றாகாது").

### Phase 8: Transparency, Validation Dashboard & Regression Gates (P2) — DONE
- [x] Calculation card & receipt showing verified inputs, ephemeris, ayanamsa, versions, and SHA hash.
- [x] `/calculation-method` page detailing the mathematical and traditional methodologies.
- [x] `/dev/astro-validation` interactive dashboard displaying golden test suites, tolerances, and real-time diffs.
- [x] Comprehensive test suite with Vitest.
