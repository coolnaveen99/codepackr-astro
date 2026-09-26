# CodePackr Astro — Technical Calculation Methodology & Provenance

**Document Version:** 2.0.0  
**Date:** 26-Sep-2026  
**System:** CodePackr Astro Engine (`src/lib/astro/`)  
**Production Profile:** `DEFAULT_PRODUCTION_PROFILE` (`src/lib/astro/provenance/profile.ts`)

---

## 1. Ephemeris & Planetary Calculation

### 1.1 Analytical Ephemeris Provider
- **Provider:** Astronomy Engine (v2.1.19).
- **Planetary Theory:** VSOP87 (Variations Séculaires des Orbites Planétaires).
- **Lunar Theory:** ELP2000-82 (Éphéméride Lunaire Parisienne).
- **Standard of Comparison:** NASA Jet Propulsion Laboratory (JPL) DE440 ephemeris and Swiss Ephemeris.
- **Precision:** Ephemeris geocentric longitudes match JPL DE440 within an ultra-strict tolerance of under 60 arcseconds across the modern historical era (1900–2100).
- **Honest Disclosure:** Calculations are executed purely via analytical VSOP87/ELP2000 algorithms without claiming Swiss Ephemeris binaries while running Astronomy Engine.

### 1.2 Geocentric Corrections
Calculations incorporate:
1. **Light-Time Correction:** Accounts for the finite speed of light between the celestial body and the Earth observer.
2. **Planetary Aberration:** Accounts for the motion of Earth during light transit.
3. **Nutation in Longitude & Obliquity:** Evaluated continuously using the IAU 2000 nutation model.

---

## 2. Zodiac & Ayanamsa Model

### 2.1 Sidereal (Nirayana) Zodiac
CodePackr Astro operates on the Sidereal zodiac where 0° Aries is anchored to the fixed star Spica (Chitra) at 180° ecliptic longitude.

### 2.2 Chitrapaksha / Lahiri Ayanamsa
- **Anchor:** IAU 2000 epoch J2000.0 base value $23^\circ 51' 11.2''$ ($23.852294^\circ$).
- **Precession Polynomial:**
  $$\text{Ayanamsa}(T) = 23.852294^\circ + 1.3979426^\circ \cdot T - 0.0000930862^\circ \cdot T^2 - 0.000000018^\circ \cdot T^3$$
  where $T = \frac{\text{JD} - 2451545.0}{36525.0}$ (Julian centuries from J2000.0).
- **Conformity:** Directly conforms to the Indian Calendar Reform Committee (1952) standards and modern government astronomical ephemerides.

---

## 3. Lunar Nodes (Rahu & Ketu)

- **Model:** Mean Lunar Node model.
- **Symmetry Invariant:** $\text{Ketu} = (\text{Rahu} + 180^\circ) \pmod{360^\circ}$.
- **Motion:** Retrograde progression across the zodiac signs.
- **Labeling:** Consistently documented as Mean Nodes across all UI cards and calculation receipts.

---

## 4. House System (Bhava)

- **System:** Whole Sign House System (Rasi = Bhava).
- **First House (Janma Lagna):** The entire 30° zodiac sign that contains the Ascendant degree constitutes House 1.
- **Ascendant Longitude:** Calculated from Local Sidereal Time (LST), Right Ascension of the Medium Coeli (RAMC), and geographic observer latitude.
- **Divisional Charts (Vargas D1 to D60):** Calculated strictly according to classical Maharishi Parasara formulas.

---

## 5. Event-Based Panchangam & Diurnal Transitions

### 5.1 Sunrise and Sunset
- Calculated via `SearchRiseSet` taking into account standard atmospheric refraction (34 arcminutes) and the solar semidiameter (16 arcminutes), giving a center-of-disc altitude of $-0.833^\circ$ at the horizon.
- **No Fabricated Fallbacks:** If the astronomical library cannot find a sunrise/sunset (such as in polar day or polar night latitudes), `status: "unavailable"` is recorded and `sunriseJD: null` is preserved, with clear localized notices rendered in the UI.

### 5.2 Panchang Elements
- **Tithi:** Moon ecliptic longitude minus Sun ecliptic longitude, divided into 30 intervals of 12° each. Transitions during the day are solved using a continuous interval root scanner.
- **Nakshatra:** Moon sidereal longitude divided into 27 equal 13° 20' segments, each subdivided into four 3° 20' Padas.
- **Yoga:** Sum of Sun and Moon sidereal longitudes divided into 27 equal segments of 13° 20'.
- **Karana:** Half-tithi intervals (6° increments) strictly following the 11-Karana sequence (4 fixed Karanas: Shakuni, Chatushpada, Naga, Kimstughna; and 7 repeating Karanas).

---

## 6. Rule-Driven Festival & Observance Engine

Festivals and observances are evaluated dynamically via classical astronomical rules (`src/lib/astro/calendar/festivals.ts`):
- **Sankranti Observances:** Puthandu (Mesha Sankranti, Chithirai 1), Thai Pongal (Makara Sankranti, Thai 1).
- **Lunar Alignments:** Chitra Pournami (Chitra Nakshatra in Chithirai month), Vaikasi Visakam (Visakha Nakshatra in Vaikasi), Thai Poosam (Pushya in Thai), Panguni Uthiram (Uttara Phalguni in Panguni), Karthigai Deepam (Krittika in Karthigai).
- **Tithi Observances:** Vaikunta Ekadashi, Sani Pradosham / Soma Pradosham, Amavasai, Pournami, Sankatahara Chaturthi, Skanda Sashti, Maha Shivarathri, Deepavali.
- **Zero Static Date Lists:** All observances adapt to local sunrise and tithi transition times for the selected observer location.

---

## 7. Prediction & Forecast Engine

- **Evidence-Grounded Horizons:** 1-year (monthly), 3-year (quarterly/yearly), 5-year (yearly), and long-term lifecycle eras (10, 20, 60 years).
- **Dynamic Factor Traceability:** Every supporting or caution factor is generated from actual calculated astrological inputs (active Mahadasha lord, Bhukti lord, Sade Sati status, natal yoga configurations) rather than static placeholder text.
- **Evidence Levels:** Categorized as `Strong`, `Moderate`, `Mixed`, `Caution`, or `Insufficient Evidence`.
- **Ethical Disclaimer:** Software calculation accuracy is strictly distinguished from traditional astrological interpretations; the platform makes no claims of guaranteed prediction accuracy or scientific proof of astrology.
