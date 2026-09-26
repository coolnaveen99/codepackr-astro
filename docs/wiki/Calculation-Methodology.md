# Calculation Methodology & Astronomical Transparency

CodePackr Astro is built upon a deterministic astronomical calculation pipeline that bridges modern computational astrophysics with classical Vedic and Tamil astrology.

Every public calculation discloses its mathematical provenance, ephemeris model, ayanamsa value, coordinate resolution, and ruleset version.

---

## 1. Authoritative Production Calculation Profile

All calculations across the platform are anchored to an immutable, centralized profile definition (`src/lib/astro/provenance/profile.ts`):

```ts
export const DEFAULT_PRODUCTION_PROFILE: ProductionCalculationProfile = {
  zodiac: "sidereal",
  ayanamsa: "thirukanitham",
  nodeMode: "mean",
  houseSystem: "whole-sign",
  panchangaMethod: "thirukanitham-oriented",
  dashaSystem: "vimshottari",
  ephemeris: "astronomy-engine",
  timezoneSource: "iana-tzdb",
};
```

---

## 2. Astronomical Ephemeris Engine

- **Ephemeris Library:** Don Cross's `astronomy-engine` (v2.1+).
- **Planetary Theory:** VSOP87 analytical planetary theories (Sun, Mercury, Venus, Mars, Jupiter, Saturn).
- **Lunar Theory:** High-precision ELP2000 analytical lunar theory.
- **Reference Standard:** Benchmarked continuously against NASA JPL DE440 ephemeris data.
- **Precision Threshold:** Ephemeris coordinates evaluate within **< 60 arcseconds (< 0.016°)** of Swiss Ephemeris / JPL DE440 across all standard historical and contemporary epochs (1900–2100 CE).
- **Corrections Included:** Light-time correction, planetary aberration, and nutation in longitude (IAU 2000).

---

## 3. Sidereal (Nirayana) Zodiac & Ayanamsas

CodePackr Astro operates exclusively in the **Nirayana (Sidereal)** zodiac, which measures planetary longitudes against the fixed stellar backdrop rather than the moving vernal equinox point (Sayana).

### A. Tamil Thirukanitham Ayanamsa (Production Default)
- **Status:** Platform Default.
- **Formula:** Evaluated linearly from the classical epoch anchor of **22° 27′ 36″ (22.46°)** at January 1, 1900, progressing at the classical annual rate of **50.016 arcseconds per tropical year**:
  $$\text{Aya}_{\text{Thirukanitham}}(JD) = 22.46 + \left(\frac{JD - 2415020.5}{365.2422}\right) \times \left(\frac{50.016}{3600}\right)$$
- **Cultural Alignment:** Matches modern Tamil Nadu Thirukanitham panchangams (Srirangam, Vasan, Maruthuvakkudi, Manonmani).

### B. Chitrapaksha / Lahiri Ayanamsa (Selectable Option)
- **Status:** Explicit Selectable Option.
- **Epoch Anchor:** **23° 51′ 11.2″** at standard epoch J2000.0 (JD 2451545.0).
- **Precession Model:** Evaluated using the official IAU 2000 precession polynomial.
- **Standards Alignment:** Conforms to the Government of India Calendar Reform Committee (1952) and the Indian National Ephemeris standard (Positional Astronomy Centre).

### C. Vakya Karana (Selectable Option)
- **Status:** Selectable Comparison Option.
- **Model:** Preserves classical Tamil mean motions with periodic manda correction equations for temple ritual comparison and historical chart matching.

---

## 4. House System (Bhava)

- **System:** **Whole Sign (ராசியே பாவம் / Rasi = Bhava)**.
- **Rationale:** The Whole Sign house system is the foundational methodology articulated in the *Brihat Parashara Hora Shastra* and universally practiced across Tamil Nadu astrology.
- **Rule:** The entire 30° zodiac sign containing the Ascendant (Lagna) constitutes the 1st House. The subsequent sign constitutes the 2nd House, regardless of the exact numerical degree of the Lagna cusp. Equal House and Sripati cusps are supported in divisional analysis.

---

## 5. Lunar Nodes: Rahu and Ketu

- **Node Model:** **Mean Lunar Node**.
- **Symmetry Invariant:** Ketu is mathematically locked exactly 180.0000° opposite to Rahu:
  $$\lambda_{\text{Ketu}} = (\lambda_{\text{Rahu}} + 180^\circ) \pmod{360^\circ}$$
- **Motion:** Uniform retrograde motion along the ecliptic plane, matching classical Parashari axioms.

---

## 6. Solar & Lunar Events (Sunrise, Sunset, Moonrise, Moonset)

- **Authoritative Module:** `src/lib/astro/astronomy/sunrise.ts`.
- **Topocentric Observation:** Accounts for geographic observer latitude, longitude, and elevation.
- **Atmospheric Refraction:** Standard atmospheric refraction of **34 arcminutes (0.5667°)**.
- **Solar Semi-Diameter:** Standard solar semi-diameter of **16 arcminutes (0.2667°)**; horizon event triggers when solar center is at **-50 arcminutes (-0.8333°)** altitude.
- **Polar Handling:** In arctic/antarctic regions during polar night or midnight sun, when the Sun does not cross the horizon, `sunriseJD`, `sunsetJD`, and `nextSunriseJD` return `null` with `status: "unavailable"`. Fabricated 06:00 or 18:00 placeholders are strictly forbidden.

---

## 7. Geographic Resolution & Historical Timezone Offsets

### A. Coordinate Validation
- Latitude must satisfy $-90 \le \text{lat} \le +90$.
- Longitude must satisfy $-180 \le \text{lon} \le +180$.
- Non-finite numbers (`NaN`, `Infinity`) or missing inputs trigger explicit validation errors. Silent fallbacks to Chennai are strictly rejected.

### B. Geographic Timezone Lookup (`tz-lookup`)
```text
(lat, lon) → tzLookup(lat, lon) → Authoritative IANA Zone ID (e.g. "Asia/Kolkata")
```
Coordinates falling in open international ocean waters fallback to `Etc/GMT±N` and are transparently flagged as `longitude-estimate` on the receipt.

### C. Historical Civil UTC Offset
- Timezone offsets at historical birth instants are computed using `Intl.DateTimeFormat` with long offset extraction (`timeZoneName: "longOffset"`).
- Two-pass convergence accurately captures Daylight Saving Time (DST) changes, wartime double summer time, and historical zone redefinitions (verified across US EDT/EST, UK BST/GMT, and Indian Standard Time).

---

## 8. Cryptographic Calculation Receipt

Every chart generation produces a deterministic provenance receipt (`src/lib/astro/provenance/receipt.ts`):

- **Calculation ID:** 16-character hexadecimal hash derived from input particulars and ruleset versions.
- **Provenance Hash:** SHA-256 signature binding birth date, civil time, latitude, longitude, IANA zone, ayanamsa, engine version, and ruleset version.
- **Location Status:** Discloses whether coordinates were `verified` (selected from geocoded database) or `user-supplied` (manually entered).
