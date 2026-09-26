# CodePackr Astro — Accuracy Validation Document

**Document Version:** 1.0.0  
**Project:** `astro.codepackr.com`  
**Repository:** `coolnaveen99/codepackr-astro`  
**Date:** 26 September 2026  
**Status:** Validated  

---

## 1. Reference Sources & Benchmark Standards

The CodePackr Astro calculation engine is systematically validated against authoritative international and national reference standards:

1. **JPL Planetary Ephemerides (DE440 / DE441 / Horizons System):** Reference for apparent geocentric ecliptic longitudes of Sun, Moon, and planets.
2. **IAU SOFA (Standards of Fundamental Astronomy):** Reference for Earth orientation, Julian dates, precession/nutation, and Sidereal Time (RAMC).
3. **IMD / Positional Astronomy Centre (Rashtriya Panchanga):** Reference for Indian standard calendar and Panchangam definitions (Tithi, Nakshatra, Yoga, Karana, and solar ingresses).
4. **Classical Jyotish Literature:**
   - *Brihat Parashara Hora Shastra (BPHS)* — Lagna, Vargas D1–D60, Vimshottari Dasa, Shadbala, and Raja Yogas.
   - *Phaladeepika* by Mantreswara — Planetary dignity, Gochara, and Bhava evaluations.
   - *Jataka Parijata* by Vaidyanatha Dikshita — Yoga formations and planetary aspects.

---

## 2. Accuracy Tolerances

| Astronomical Quantity | Angular / Time Tolerance | Benchmark Reference | Status |
|---|---|---|---|
| **Sun Sidereal Longitude** | < 15 arcseconds (0.004°) | JPL Horizons / Lahiri | PASS |
| **Moon Sidereal Longitude** | < 30 arcseconds (0.008°) | JPL Horizons / Lahiri | PASS |
| **Major Planets (Mars, Jup, Sat)** | < 30 arcseconds (0.008°) | JPL Horizons / Lahiri | PASS |
| **Lunar Node (Rahu/Ketu Mean)** | < 20 arcseconds (0.005°) | Meeus / IAU Mean Node | PASS (180.000° separation) |
| **Lagna (Ascendant)** | < 1 arcminute (0.016°) | IAU RAMC + Observer Geo | PASS |
| **Sunrise / Sunset** | < 60 seconds | Astronomical Refraction Model | PASS |
| **Tithi Transition Instant** | < 90 seconds | Elongation 12° Root-finding | PASS |
| **Nakshatra Transition Instant**| < 90 seconds | Moon Longitude 13°20′ Interp | PASS |
| **Tamil Solar Ingress Instant**| < 120 seconds | Sun Sidereal Ingress (Mesha..) | PASS |
| **Vimshottari Dasa Balances** | < 1 day | 120-year astronomical cycle | PASS |

---

## 3. Golden Reference Benchmark Cases

### Case 1: Standard Modern Reference (Chennai, India)
- **Date/Time:** 2024-04-14 10:30:00 IST (UTC+05:30)
- **Location:** Chennai, India (13.0827° N, 80.2707° E)
- **Profile:** Sidereal Lahiri, Mean Node, Whole Sign
- **Expected:**
  - Sun Longitude: ~0°15′ Mesha (Chithirai 1)
  - Sun Rasi: Mesha (Aries)
  - Tamil Month: Chithirai
  - Samvatsara: Krodhi (Year 38)
- **Validation Result:** MATCH. Solar ingress occurs within expected window.

### Case 2: Historical Epoch Verification (J2000.0)
- **Date/Time:** 2000-01-01 12:00:00 UTC
- **Location:** Ujjain, India (23.1765° N, 75.7725° E)
- **Profile:** Sidereal Lahiri (Ayanamsa ≈ 23°51′11″)
- **Expected:**
  - Lahiri Ayanamsa: 23.8523°
  - Mean Rahu: ~125.04° (Tropical) -> ~101.19° (Sidereal Cancer)
  - Ketu: ~281.19° (Sidereal Capricorn, exactly 180° opposite)
- **Validation Result:** MATCH (< 10 arcseconds difference).

### Case 3: 60-Year Samvatsara Wrap & Ingress Transitions
- **1987-04-14:** Prabhava (Cycle 1, Anchor year) -> MATCH
- **2024-04-14:** Krodhi (Year 38) -> MATCH
- **2025-04-14:** Vishvavasu (Year 39) -> MATCH
- **2026-04-14:** Parabhava (Year 40) -> MATCH
- **2046-04-14:** Akshaya (Year 60) -> MATCH
- **2047-04-14:** Prabhava (Year 1, Complete wrap to next cycle) -> MATCH

### Case 4: Planetary Retrograde & Station Case
- **Body:** Saturn
- **Period:** 2024-06-29 Station Retrograde in Kumbha
- **Expected:** Longitudinal velocity crosses from positive to negative at station.
- **Validation Result:** MATCH. Station point correctly identified without jitter.

### Case 5: Circular Boundary Tests
- `normalize360(-1)` = 359° -> PASS
- `normalize360(360)` = 0° -> PASS
- `normalize360(361)` = 1° -> PASS
- `angularDistance(359, 1)` = 2° -> PASS
- `angularDistance(10, 350)` = 20° -> PASS

---

## 4. Known Differences & Traditions

| Topic | CodePackr Implementation | External Variation | Classification | Notes |
|---|---|---|---|---|
| **Ayanamsa** | Lahiri / Chitrapaksha | Raman, KP, Fagan-Bradley | PROFILE DIFFERENCE | Configurable in calculation profile; default is Lahiri |
| **Lunar Nodes**| Mean Node | True (Oscillating) Node | METHOD DIFFERENCE | Mean node default ensures Rahu/Ketu are strictly 180° apart |
| **Tamil Solar Day Boundary** | Sunrise after Ingress | Sunset / Midnight conventions | TRADITION DIFFERENCE | Thirukanitham Tamil convention uses sunrise following solar ingress |
| **Vakya System** | Deferred | Classical epicycles / tables | DEFERRED | Modern approximation is not called authentic Vakya per Spec |

---

## 5. Summary of Validation Dashboard (`/dev/astro-validation`)

The interactive validation dashboard exposes all unit, boundary, and golden test cases with live recalculation, difference calculation against references, and status badges (PASS / FAIL / TOLERANCE_OK).
