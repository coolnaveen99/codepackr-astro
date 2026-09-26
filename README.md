# Codepackr Astro

Tamil Vedic astrology, daily event-based Panchangam, and astronomical calculation platform in the [Codepackr](https://www.codepackr.com) family.

**Live:** [astro.codepackr.com](https://astro.codepackr.com)  
**Repo:** [github.com/coolnaveen99/codepackr-astro](https://github.com/coolnaveen99/codepackr-astro)  
**License:** MIT

---

## 1. Information Architecture & URLs

CodePackr Astro operates with a dedicated URL structure where the root path acts as the complete Astro Tools Directory, and task-specific workflows reside on dedicated routes:

| URL | Function / Description |
|---|---|
| **`/`** | **Astro Home & Directory:** 20+ Vedic & Tamil tools, search, category filters, and features. |
| **`/jathagam`** | **Horoscope Creation & Analysis:** Complete birth form, location search, D1..D60 charts, Dasa, Yogas, and 1/6/30-page printable reports. |
| **`/tamil-calendar`** | **Tamil Calendar & Daily Panchangam:** Location-specific sunrise, Tithi/Nakshatra transitions, 24h timeline, 60-year Samvatsara cycle, and rule-driven festivals. |
| **`/panchangam`** | **Thirukanitham Panchangam:** Rahu Kalam, Yamagandam, Gulikai, Abhijit, and Gowri Nalla Neram. |
| **`/forecast`** | **Multi-Horizon Forecast:** Evidence-grounded life domain predictions for 1-year monthly, 3-year, 5-year, and long-term lifecycle eras. |
| **`/porutham`** | **10-Factor Marriage Compatibility:** Traditional Tamil Dasakoota with Rajju, Vedha, Yoni, and Gana factor breakdown. |
| **`/gochara`** | **Planetary Transits:** Gochara analysis for Jupiter, Saturn, Rahu, and Ketu from the natal Moon sign. |
| **`/rasipalan`** | **Daily & Weekly Rasi Palan:** Transit horoscope for all 12 zodiac signs. |
| **`/chandrashtama`** | **Chandrashtama Calculator:** 8th Moon transit dates and cautionary windows. |
| **`/nakshatra`** | **27 Nakshatras & Padas:** Deities, lords, padas, and characteristics. |
| **`/babynames`** | **Baby Names by Nakshatra:** Auspicious Tamil names curated by birth star syllables. |
| **`/nazhigai`** | **Nazhigai Converter:** Real-time conversion between clock hours and Tamil Nazhigai/Vinazhigai based on local sunrise. |
| **`/biodata`** | **Astro Biodata Maker:** Matrimonial horoscope biodata creator with photo and PDF export. |
| **`/numerology`** | **Chaldean Numerology:** Life Path, Destiny, and Name number calculations. |
| **`/prasna`** | **Prasna Arudham:** Traditional 1-108 Horary question divination. |
| **`/calculation-method`** | **Technical Disclosure:** Transparent documentation of planetary models, ayanamsa, coordinates, and house systems. |
| **`/dev/astro-validation`** | **Internal Developer Dashboard:** 50+ ephemeris benchmarks, golden cases, and boundary tests. |

---

## 2. Production Calculation Profile

All calculations across the platform are driven by an authoritative, immutable production profile (`src/lib/astro/provenance/profile.ts`):

```text
zodiac:           Sidereal (Nirayana)
ayanamsa:         Thirukanitham (Default; Tamil linear ayanamsa. Lahiri/Chitrapaksha & Vakya Karana selectable)
ephemeris:        Astronomy Engine (VSOP87 / ELP2000 analytical theories, benchmarked against NASA JPL DE440)
houseSystem:      Whole Sign (Rasi = Bhava)
nodeMode:         Mean Node (Rahu / Ketu; Ketu locked at (Rahu + 180°) % 360°)
panchangaMethod:  Thirukanitham-oriented (Atmospheric refraction -0.833° considered)
dashaSystem:      Vimshottari Dasa (120-year Nakshatra-lord balance)
timezoneSource:   IANA tzdb (validated geographic coordinates + historical offset)
```

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Run comprehensive automated test suite (25 tests)
npm test

# Type-check TypeScript
npm run lint

# Production build & static SPA route generation
npm run build
```

---

## 4. Documentation & Audits

- **`docs/CODEPACKR-ASTRO-FINAL-DEVELOPMENT-SPECIFICATION.md`** — Comprehensive architectural specification and route definitions.
- **`docs/CODEPACKR-ASTRO-GRANULAR-IMPLEMENTATION-AUDIT-AND-HOME-JATHAGAM-INSTRUCTIONS.md`** — Granular audit instructions and quality standards.
- **`docs/ASTRO_IMPLEMENTATION_AUDIT.md`** — Pre-implementation audit and mismatch resolution log.
- **`docs/ASTRO_CALCULATION_METHOD.md`** — Detailed technical description of ephemeris, ayanamsa, and time conversions.
- **`docs/ASTRO_ACCURACY_VALIDATION.md`** — Validation benchmarks and golden test datasets.
- **`docs/ASTRO_FINAL_QA_REPORT.md`** — Final QA test execution summary and verification report.
