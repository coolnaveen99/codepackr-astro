# Welcome to the CodePackr Astro Wiki

**CodePackr Astro** (`codepackr-astro`) is an open, client-side, production-grade Tamil astrology and calendar calculation platform built for global Tamil communities. It pairs modern high-precision orbital astronomy (VSOP87/ELP2000 analytical planetary theories benchmarked against NASA JPL DE440) with classical Tamil Parashari astrology and South Indian chart conventions.

- **Live Application:** [https://astro.codepackr.com](https://astro.codepackr.com)
- **Source Repository:** [https://github.com/coolnaveen99/codepackr-astro](https://github.com/coolnaveen99/codepackr-astro)
- **Primary Language:** Tamil (தமிழ்) with complete English technical terminology toggle.

---

## Wiki Contents

| Document | Description |
| :--- | :--- |
| **[Calculation Methodology](Calculation-Methodology)** | Ephemeris standards, Tamil Thirukanitham linear ayanamsa, Chitrapaksha Lahiri, Vakya comparison, Whole Sign houses, IANA timezone resolution, and cryptographic receipt architecture. |
| **[Tamil Calendar & Panchangam](Tamil-Calendar-and-Panchangam)** | Canonical unification of solar calendar (Chithirai–Panguni), 60-year Samvatsara cycle, 5-Anga interval calculations (Tithi, Nakshatra, Yoga, Karana, Vara), and rule-driven festivals. |
| **[Jathagam Report Design](Jathagam-Report-Design)** | Comprehensive layout standards for 1-Page Summary, 6-Page Executive, and 30-Page Classical Horoscope Booklets with vector South Indian charts and PDF export. |
| **[Tools Directory & Features](Tools-Directory-and-Features)** | Comprehensive reference for all 16 platform modules, canonical routes, URL parameter modes, and usage instructions. |
| **[Forecast & Rule Engine](Forecast-and-Rule-Engine)** | Multi-horizon forecast engine (1 to 60 years) evaluating 16 distinct life domains using structured astronomical evidence without fabricated probabilities. |
| **[Tamil Astrology Terminology](Tamil-Astrology-Terminology)** | Bilingual glossary of standard Tamil Nadu Jyotish terminology: 12 Rasis, 9 Grahas, 27 Nakshatras, 16 Vargas, Bhavas, Shadbala, and Yogas. |
| **[Validation & Testing Suite](Validation-and-Testing-Suite)** | Automated test framework (Vitest 50+ suites), NASA JPL DE440 ephemeris tolerances (<60 arcsec), golden fixtures, and CI automation. |
| **[Development Roadmap](Development-Roadmap)** | Implemented production milestones, hardening phases, and future architectural enhancements. |

---

## Architectural Principles

1. **Strict Client-Side Privacy:**
   - Birth dates, exact times, geographic coordinates, and derived astrological charts remain strictly within the user's browser.
   - Zero telemetry, zero server-side database storage of birth particulars, and zero third-party trackers.

2. **Locked & Transparent Calculation Profile:**
   - The production profile has one immutable definition (`DEFAULT_PRODUCTION_PROFILE` in `src/lib/astro/provenance/profile.ts`).
   - Default ayanamsa is **Tamil Thirukanitham** (Drik linear ayanamsa).
   - **Chitrapaksha / Lahiri** and **Vakya Karana** are explicit, selectable options rather than silent aliases.
   - Every calculation produces a verifiable cryptographic receipt hash.

3. **Separation of Astronomy from Interpretation:**
   - Mathematical calculations (planetary longitudes, solar ingress, house cusps, tithi intervals) are calculated deterministically via Astronomy Engine.
   - Traditional astrological rules evaluate structured astronomical data.
   - No AI model or statistical LLM is ever allowed to calculate celestial coordinates or predict fortunes.

4. **Zero-Fabrication Astronomical Discipline:**
   - Polar day/night conditions where the Sun does not cross the horizon return exact `null` values with `"unavailable"` status; the engine never substitutes fake 06:00 or 18:00 constants.
   - Missing or invalid geographic coordinates are rejected explicitly; the engine never silently assumes Chennai/Madras.

5. **Traditional South Indian Chart Conventions:**
   - Fixed 12-sign counter-clockwise zodiac square layout (Aries top-middle-left, Pisces top-left).
   - Retrograde, combust, debilitated, exalted, and own-sign planetary statuses rendered clearly according to Tamil typographic traditions.
