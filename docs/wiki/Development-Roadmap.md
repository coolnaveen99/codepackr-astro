# Development Roadmap & Implementation Progress

This document tracks the implemented architectural milestones, production hardening achievements, and prospective future enhancements for CodePackr Astro.

---

## 1. Implemented Milestones (Production Release)

### Core Architectural Achievements
- [x] **Universal Client-Side Privacy:** All birth computations execute in browser memory; zero personal data saved to backend servers.
- [x] **Authoritative Calculation Profile:** Locked `DEFAULT_PRODUCTION_PROFILE` declaring Thirukanitham default, Chitrapaksha Lahiri & Vakya selectable, Whole Sign houses, Mean Nodes, and Astronomy Engine ephemeris.
- [x] **Unified Tamil Calendar & Panchangam:** Single canonical product at `/tamil-calendar` with `/panchangam` alias combining solar dates, 60-year Jovian cycles, 5-Anga transition intervals, and 24h timeline.
- [x] **Centralized Sunrise / Sunset Engine:** Observer-topocentric calculation in `src/lib/astro/astronomy/sunrise.ts`; zero fabricated 06:00/18:00 fallbacks; exact null handling for polar regions.
- [x] **Geographic Timezone Resolution:** Real boundary resolution via `tz-lookup` + two-pass historical UTC offset calculation via `Intl.DateTimeFormat` (IANA tzdb).
- [x] **Strict Location Safety:** Rejection of missing, NaN, or out-of-range coordinates; explicit receipt labeling for `verified` vs. `user-supplied` coordinates.
- [x] **URL-Driven Jathagam Modes:** `/jathagam?mode=one`, `/jathagam?mode=six`, and `/jathagam?mode=thirty` with seamless history push and auto-print triggers.
- [x] **30-Page Classical Horoscope Booklet:** Complete A4 booklet layout with vector South Indian charts, 16 Vargas, Shadbala, Bhava Bala, 54 Yogas, Dosha analysis, and client-side PDF export.
- [x] **Multi-Horizon Forecast Engine:** 1, 3, 5, 10, 20, and 60-year predictions across 16 life domains grounded in structured astrological evidence without numeric probability scores.
- [x] **16 Specialized Astrological Tools:** Full suite including Chandrashtama, Gochara transits, 27 Nakshatras, Baby Names, Nazhigai converter, Biodata maker, Numerology, Prasna Arudham, and Glossary.
- [x] **Comprehensive Automated Testing & CI:** 52+ unit and accuracy test suites running in GitHub Actions (`.github/workflows/ci.yml`) on every push.

---

## 2. Prospective Future Enhancements

### Phase 2: Enhanced Mobile & Offline Experience
- [ ] **Service Worker PWA Compliance:** Full offline caching of ephemeris data and place database for offline astrology generation on mobile devices.
- [ ] **Cross-Chart Transit Overlay (Gochara D1 Overlay):** Visual ring overlay showing current transiting planets positioned directly outside the natal Rasi D1 chart.
- [ ] **K.P. (Krishnamurti Padhdhati) Sub-Lord Tables:** Additive selectable sub-lord and sub-sub-lord breakdown tables for horary practitioners.

### Phase 3: Classical Literature Grounding
- [ ] **Sanskrit & Tamil Shloka Citations:** Adding original Brihat Parashara Hora Shastra, Jataka Parijata, and Saravali verse citations directly beneath major Yoga evaluations.
- [ ] **Expanded Tamil Regional Panchangam Profiles:** Granular comparison modes matching Srirangam Ranganathaswamy Temple Panchangam and Pambu Panchangam traditional tables.
