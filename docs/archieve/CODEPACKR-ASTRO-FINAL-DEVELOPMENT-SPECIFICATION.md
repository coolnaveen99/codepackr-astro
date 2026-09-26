# CodePackr Astro — FINAL DEVELOPMENT MASTER SPECIFICATION

**Status:** Final development master  
**Project:** `astro.codepackr.com`  
**Repository:** `coolnaveen99/codepackr-astro`  
**Prepared:** 26 September 2026

> **Important:** This file is the execution master. The original V2 document is retained as the detailed source specification. The final lock section at the end overrides earlier undecided defaults or conflicting notes.

# CodePackr Astro --- Accuracy, Tamil Calendar & Multi-Year Prediction

## Final Granular Implementation Specification

**Project:** `astro.codepackr.com`\
**Repository:** `coolnaveen99/codepackr-astro`\
**Purpose:** Make Astro an accuracy-first, traceable Tamil astrology
platform with robust astronomical calculations, a complete Tamil 60-year
calendar, event-based Panchangam, validated Jathagam calculations, and
evidence-based traditional forecasts.

**Existing features to preserve:** Tamil-native UI, Jathagam,
Panchangam, Gochara, Daily Rasi, Chandrashtama, Nakshatra, Porutham,
Numerology, Prasna, Biodata, D1--D60 Vargas, Vimshottari Dasa, 1-page
Jathagam, 6-page Jatham, 30-page Jathatgam, print/PDF, mobile UX.

**Dark mode:** remain disabled/deferred.

------------------------------------------------------------------------

## 1. Core principle

Build the product in two distinct layers:

### A. Astronomical/calendar layer

This calculates measurable or reproducible quantities:

-   date/time conversion
-   timezone
-   Julian date
-   planetary positions
-   Sun/Moon longitude
-   sunrise/sunset
-   moonrise/moonset
-   sidereal conversion
-   Tamil solar month
-   60-year Samvatsara
-   Tithi
-   Nakshatra
-   Yoga
-   Karana
-   planetary transit times
-   retrograde/direct transitions

### B. Traditional astrology layer

This interprets the calculated data according to an explicitly selected
traditional rule set:

-   Rasi
-   Lagna
-   Bhava
-   Vargas
-   Dasa/Bhukti
-   Gochara
-   Ashtakavarga
-   Shadbala
-   Yogas
-   Porutham
-   Muhurtha
-   traditional forecasts

**Never represent traditional astrological predictions as scientifically
proven future events.**

Use wording such as:

> "பாரம்பரிய ஜோதிட விதிகளின் அடிப்படையிலான விளக்கம்."

Avoid guaranteed claims such as "this will definitely happen".

------------------------------------------------------------------------

# 2. Current-codebase rule

Do **not** rebuild the existing Astro engine.

First audit the existing implementation and refactor it into clear
modules.

Current engine already includes Astronomy Engine integration, planetary
calculations, ayanamsa functions, Lagna, Nakshatra/Pada, Vargas,
Vimshottari Dasa, Panchanga values, sunrise/sunset, Muhurtha items,
Ashtakavarga, Upagrahas and special Lagnas.

Important existing audit findings:

1.  Panchanga currently contains snapshot-style values; full Panchangam
    needs transition/event times.
2.  The engine contains a `vakyaMean()` approximation. Do not call a
    modern approximation authentic Vakya unless it is backed by the
    actual selected Vakya method/data.
3.  Vimshottari currently uses day-duration arithmetic based on
    `365.2425`; this convention must be documented and benchmarked.
4.  Multiple ayanamsa functions exist. The selected profile must be
    explicit and consistent.
5.  Varga formulas require boundary/golden tests before being treated as
    production-validated.

------------------------------------------------------------------------

# 3. Recommended module architecture

Refactor gradually:

``` text
src/lib/astro/
├── engine.ts
├── astronomy/
│   ├── ephemeris.ts
│   ├── time.ts
│   ├── coordinates.ts
│   ├── sunrise.ts
│   ├── sidereal.ts
│   └── validation.ts
├── calendar/
│   ├── tamil-calendar.ts
│   ├── samvatsara.ts
│   ├── panchangam.ts
│   ├── tithi.ts
│   ├── nakshatra.ts
│   ├── yoga.ts
│   ├── karana.ts
│   └── muhurtha.ts
├── chart/
│   ├── grahas.ts
│   ├── lagna.ts
│   ├── houses.ts
│   ├── aspects.ts
│   ├── dignity.ts
│   └── varga.ts
├── dasha/
│   ├── vimshottari.ts
│   ├── antardasha.ts
│   └── timeline.ts
├── prediction/
│   ├── rules.ts
│   ├── evidence.ts
│   ├── conflicts.ts
│   ├── domains.ts
│   ├── yearly.ts
│   ├── monthly.ts
│   └── narrative.ts
└── validation/
    ├── golden-cases.ts
    ├── fixtures.ts
    ├── boundaries.ts
    └── regression.ts
```

Adapt this to the current project rather than creating duplicate files
unnecessarily.

------------------------------------------------------------------------

# 4. Calculation provenance

Every chart/report should internally retain:

``` ts
type CalculationMetadata = {
  engineVersion: string;
  algorithmVersion: string;
  ephemerisSource: string;
  ephemerisVersion: string;
  zodiac: "sidereal" | "tropical";
  ayanamsa: string;
  ayanamsaValue: number;
  houseSystem: string;
  nodeMode: "mean" | "true";
  timezone: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  generatedAt: string;
};
```

Expose a user-friendly "கணக்கீட்டு விவரம் / Calculation details" section.

------------------------------------------------------------------------

# 5. Birth-input accuracy

Input must support:

-   date
-   hour
-   minute
-   optional seconds
-   birth place
-   latitude
-   longitude
-   timezone
-   historical timezone where relevant
-   optional elevation
-   birth-time quality

Birth-time quality:

``` text
Exact
Approximate
Rounded
Unknown
```

Store:

``` ts
type BirthTimeQuality =
  | "exact"
  | "approximate"
  | "rounded"
  | "unknown";
```

If time is approximate, show sensitivity warnings for:

-   Lagna
-   Bhava
-   D9
-   D10
-   D60
-   exact Dasa balance
-   event timing

Never show false precision.

------------------------------------------------------------------------

# 6. Location engine

Never silently assume Chennai.

Use:

``` ts
type GeoLocation = {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  timezone: string;
  utcOffsetAtInstant: number;
  source: "user" | "geocoder" | "database";
};
```

Validate:

``` text
latitude: -90..90
longitude: -180..180
```

Rules:

-   latitude is north-positive;
-   longitude is east-positive;
-   never swap latitude/longitude;
-   never silently replace a missing location with Chennai;
-   use an actual timezone identifier where possible;
-   handle historical timezone rules correctly.

------------------------------------------------------------------------

# 7. Time-scale architecture

Keep separate:

``` text
local civil time
UTC
UT1
TT
TDB
Julian Date
```

Pipeline:

``` text
User local time
→ timezone conversion
→ UTC
→ astronomical time representation
→ ephemeris
→ sidereal conversion
```

Use established astronomical libraries/standards instead of inventing
fragile time conversions.

IAU SOFA is an appropriate reference for standard astronomical
time/calendar routines.

------------------------------------------------------------------------

# 8. Ephemeris policy

Production planetary calculations must use a validated astronomical
engine.

Benchmark the current Astronomy Engine output against an authoritative
astronomical reference.

JPL DE440/DE441/Horizons are suitable astronomical benchmarks.

Store the actual production ephemeris/version.

Do not claim every displayed digit is physically meaningful over
arbitrarily long periods.

For current-century work, prefer the most appropriate high-quality
ephemeris available to the implementation.

------------------------------------------------------------------------

# 9. Ephemeris benchmark

Create tests for at least:

``` text
1900-01-01
1950-01-01
1987-01-01
2000-01-01
2020-01-01
2024-04-14
2025-04-14
2026-04-14
2030-01-01
2050-01-01
2100-01-01
```

Compare:

-   Sun
-   Moon
-   Mercury
-   Venus
-   Mars
-   Jupiter
-   Saturn
-   Uranus
-   Neptune
-   Rahu/Node

Compare degrees, not only Rasi names.

Store:

``` ts
{
  instant,
  body,
  referenceLongitude,
  calculatedLongitude,
  errorArcsec,
  pass
}
```

------------------------------------------------------------------------

# 10. Ayanamsa

Support explicit profiles:

``` text
Lahiri / Chitrapaksha
Raman
KP
Thirukanitham-oriented
Custom/reference
```

Every calculation must know which profile it is using.

Never calculate:

``` text
birth chart = Lahiri
transit = another ayanamsa
```

without explicitly telling the user.

The selected ayanamsa must be consistent for:

-   Rasi
-   Nakshatra
-   Pada
-   Dasa
-   Gochara
-   Vargas
-   Panchanga sidereal positions

------------------------------------------------------------------------

# 11. Ayanamsa validation

For each profile:

-   benchmark against a reference;
-   test historical dates;
-   test modern dates;
-   test sign boundaries;
-   test Nakshatra boundaries;
-   record differences.

Do not call an approximation "official" or "exact".

------------------------------------------------------------------------

# 12. Tamil solar calendar --- critical upgrade

Tamil months must be event-based.

Do **not** implement:

``` text
April 14 = Chithirai 1 every year
```

as the calculation engine.

Use Sun sidereal ingress into Rasis.

Mapping:

``` text
Mesha       → Chithirai
Vrishabha   → Vaikasi
Mithuna     → Aani
Karka       → Aadi
Simha       → Avani
Kanya       → Purattasi
Tula        → Aippasi
Vrischika   → Karthigai
Dhanu       → Margazhi
Makara      → Thai
Kumbha      → Maasi
Meena       → Panguni
```

Calculate the exact ingress instant.

------------------------------------------------------------------------

# 13. Tamil-month algorithm

For each target date:

1.  Calculate Sun tropical longitude.
2.  Apply selected sidereal conversion.
3.  Normalize to `0..360`.
4.  Determine Sun Rasi.
5.  Find the exact preceding ingress into that Rasi.
6.  Find the next ingress.
7.  Convert the ingress to local time.
8.  Apply the selected Tamil calendar day convention.
9.  Return Tamil month/day/year.

Do not use a static month-date table as the source of truth.

------------------------------------------------------------------------

# 14. Tamil-year object

``` ts
type TamilYearRecord = {
  tamilYearNameTa: string;
  tamilYearNameEn: string;
  cycleNumber: number;
  startInstant: string;
  endInstant: string;
  chithirai1: string;
  gregorianStartYear: number;
  gregorianEndYear: number;
};
```

------------------------------------------------------------------------

# 15. Complete 60-year Samvatsara data

Store canonical names as data, not JSX.

``` text
01 பிரபவ       Prabhava
02 விபவ        Vibhava
03 சுக்ல        Shukla
04 பிரமோதூத    Pramoduta
05 பிரஜோற்பத்தி Prajotpatti
06 ஆங்கீரச     Angirasa
07 ஸ்ரீமுக      Srimukha
08 பவ          Bhava
09 யுவ         Yuva
10 தாது        Dhata
11 ஈஸ்வர       Ishvara
12 வெகுதானிய   Bahudhanya
13 பிரமாதி     Pramathi
14 விக்ரம      Vikrama
15 விஷு        Vishu
16 சித்திரபானு Chitrabhanu
17 சுபானு      Subhanu
18 தாரண       Tharana
19 பார்த்திப    Parthiva
20 விய         Vyaya
21 சர்வஜித்    Sarvajit
22 சர்வதாரி   Sarvadhari
23 விரோதி      Virodhi
24 விக்ருதி     Vikruti
25 கர          Khara
26 நந்தன      Nandana
27 விஜய       Vijaya
28 ஜய         Jaya
29 மன்மத      Manmatha
30 துர்முகி    Durmukhi
31 ஹேவிளம்பி   Hevilambi
32 விளம்பி     Vilambi
33 விகாரி      Vikari
34 சார்வரி     Sharvari
35 பிலவ       Plava
36 சுபகிருது   Shubhakrit
37 சோபகிருது  Shobhakrit
38 குரோதி     Krodhi
39 விசுவாவசு   Vishvavasu
40 பராபவ      Parabhava
41 பிலவங்க     Plavanga
42 கீலக       Keelaka
43 சௌம்ய      Saumya
44 சாதாரண     Sadharana
45 விரோதிகிருது Virodhikrit
46 பரிதாபி     Paridhavi
47 பிரமாதீச    Pramadeesa
48 ஆனந்த      Ananda
49 ராட்சச      Rakshasa
50 நள         Nala
51 பிங்கள      Pingala
52 காலயுக்தி  Kaalayukthi
53 சித்தார்த்தி Siddharthi
54 ரௌத்ரி      Raudra
55 துர்மதி     Durmathi
56 துந்துபி     Dundubhi
57 ருதிரோத்காரி Rudhirodgari
58 ரக்தாட்சி   Raktakshi
59 குரோதன     Krodhana
60 அட்சய      Akshaya
```

Allow aliases/transliterations for search.

------------------------------------------------------------------------

# 16. 60-year formula

Use a verified anchor.

Reference:

``` text
1987–1988 = Prabhava = cycle 1
```

Then:

``` ts
cycleNumber = mod(tamilYearStartGregorianYear - 1987, 60) + 1;
```

But only after the actual Tamil-year start has been determined.

Validation examples:

``` text
2025–2026 → Vishvavasu → 39
2026–2027 → Parabhava → 40
2046–2047 → Akshaya → 60
2047–2048 → Prabhava → 1
```

A January 2026 date belongs to the Tamil year that began in the previous
Chithirai, not automatically to the 2026--27 Tamil year.

------------------------------------------------------------------------

# 17. Upgraded Route Definition & Architecture: /tamil-calendar

Final Definition:
``` text
/tamil-calendar = Complete Tamil Calendar + Daily Panchangam + Astronomical Day Details + Festivals/Observances + 60-Year Calendar
```

The Tamil calendar is not only a list of Tamil dates/months. Each day opens as a complete Panchangam / astronomical day-details view calculated dynamically for the selected location (e.g., Chennai, Madurai, Coimbatore, Tiruchirappalli, Salem, Tirunelveli, Singapore, Colombo, Kuala Lumpur, London, New York, or custom coordinates).

Architecture:
``` text
/tamil-calendar
       │
       ├── Month Calendar (interactive month grid view, clicking any date selects it!)
       │
       ├── 60-Year Tamil Calendar (60-year Jovian Samvatsara cycle table)
       │
       └── Selected Day Details
              │
              ├── 📅 Basic Day Information (Gregorian date, Tamil date/month/year, Samvatsara, Weekday, Paksha, Sunrise, Sunset, Moonrise, Moonset)
              ├── ⏱️ 24-Hour Visual Day Timeline (00:00 to 23:59 with sunrise/sunset, tithi/nakshatra transitions, Rahu, Yama, Abhijit)
              ├── 🌙 Panchangam Core:
              │     ├── Tithi (name, start, end, sunrise tithi, all transitions)
              │     ├── Nakshatra & Pada (name, pada 1-4, lord, start, end, all transitions)
              │     ├── Yoga (name, start, end)
              │     ├── Karana (name, start, end)
              │     └── Rasi (Moon Rasi & ingress, Sun Rasi & ingress)
              ├── 🪔 Important Timings (Rahu Kalam, Yamagandam, Gulikai, Abhijit, Durmuhurtham, Varjyam, Amrita Kalam, Gowri Nalla Neram)
              ├── 🛕 Rule-Driven Festivals & Observances (Ekadashi, Pradosham, Amavasai, Pournami, Sankatahara Chaturthi, Sashti, Karthigai, etc. calculated from astronomical rules rather than static hardcoded date tables)
              ├── 🌞 Astronomical Information (Sun/Moon sidereal longitudes, Moon phase & illumination %, 9 Graha noon positions, retrograde, combustion)
              └── 📜 Calculation Details & Provenance Receipt

Location Specificity:
Recalculates astronomical sunrise, sunset, moonrise, moonset, tithi at sunrise, and all panchang timings per location.
```

The 60 rows and monthly dates are generated dynamically from the calendar engine.

------------------------------------------------------------------------

# 18. 60-year ranges

Support:

``` text
current
+1
+2
+3
+5
+10
+20
+30
+40
+50
+60
```

and backward equivalents.

Do not simply repeat names. Calculate actual year boundaries.

------------------------------------------------------------------------

# 19. Era separation

Keep these separate:

``` text
Gregorian year
Tamil Samvatsara
Thiruvalluvar year
Saka year
Kali year
```

Do not use them interchangeably.

If Thiruvalluvar year is shown, implement it as its own conversion rule
and test it.

------------------------------------------------------------------------

# 20. Panchangam must be event based

A professional Panchangam cannot be just a daily snapshot.

Calculate:

-   sunrise
-   sunset
-   moonrise
-   moonset
-   Tithi start/end
-   Nakshatra start/end
-   Yoga start/end
-   Karana start/end
-   Sun ingress
-   Moon phase
-   Rahu Kalam
-   Yamagandam
-   Gulikai
-   Abhijit
-   Durmuhurtham
-   Varjyam if profile supports it
-   Amritakalam if profile supports it
-   Choghadiya
-   Gowri
-   planetary ingress
-   retrograde/direct events
-   combustion if supported
-   eclipses where relevant

------------------------------------------------------------------------

# 21. Tithi

Use lunar-solar elongation:

``` text
Moon longitude - Sun longitude
```

Normalize `0..360`.

One Tithi = `12°`.

Find exact transition times at:

``` text
12°, 24°, 36° ... 348°, 360°
```

Use root finding:

``` text
bracket
→ evaluate
→ binary/safeguarded interpolation
→ stop at required precision
```

Never infer transition time from a daily label.

------------------------------------------------------------------------

# 22. Nakshatra

27 Nakshatras:

``` text
360 / 27 = 13°20′
```

Each Pada:

``` text
3°20′
```

Return:

-   Nakshatra
-   Pada
-   lord
-   exact transition
-   start
-   end
-   remaining duration

Test every boundary.

------------------------------------------------------------------------

# 23. Yoga

Use:

``` text
Sun + Moon longitude
```

Normalize.

27 Yogas:

``` text
13°20′ each
```

Calculate exact start/end times.

------------------------------------------------------------------------

# 24. Karana

Karana boundary = every `6°` of Sun-Moon elongation.

Implement:

-   first fixed Karana
-   repeating Karanas
-   final fixed Karanas

Test:

-   Amavasya
-   Purnima
-   first Tithi
-   last Tithis

------------------------------------------------------------------------

# 25. Sunrise/sunset

Use:

-   latitude
-   longitude
-   date
-   timezone
-   appropriate astronomical/refraction convention
-   elevation when supported

Never silently use 6:00 AM / 6:00 PM fallback.

If unavailable:

``` text
status = unavailable
```

not a fabricated time.

------------------------------------------------------------------------

# 26. Moonrise/moonset

Return:

-   Moonrise
-   Moonset
-   next event
-   local time
-   unavailable status for exceptional locations

------------------------------------------------------------------------

# 27. Rahu/Yamagandam/Gulikai

Use the actual local:

``` text
sunrise → sunset
```

interval.

Do not hard-code clock times.

Validate all seven weekdays.

------------------------------------------------------------------------

# 28. Muhurtha engine

Separate calculation from recommendation.

Evaluate, where supported:

-   Vara
-   Tithi
-   Nakshatra
-   Yoga
-   Karana
-   Lagna
-   Tara Bala
-   Chandra Bala
-   Rahu Kalam
-   Yamagandam
-   Gulikai
-   Abhijit
-   Durmuhurtham
-   Varjyam
-   activity-specific rules

Activities:

``` text
Marriage
Engagement
House entry
Property
Registration
Business start
Vehicle
Travel
Naming
Education
Job joining
Religious functions
```

Do not claim Muhurtha guarantees an outcome.

------------------------------------------------------------------------

# 29. Lagna

Return:

-   sign
-   exact degree
-   minute
-   second
-   Nakshatra
-   Pada
-   lord

Validate using local sidereal time and observer coordinates.

Lagna is highly time sensitive.

------------------------------------------------------------------------

# 30. House system

Explicitly state the house system.

If using Whole Sign:

``` text
houseSystem = "whole-sign"
```

Do not silently mix Whole Sign with another system.

------------------------------------------------------------------------

# 31. Planet object

Every Graha should expose:

``` ts
{
  tropicalLongitude,
  siderealLongitude,
  sign,
  degree,
  minute,
  second,
  nakshatra,
  pada,
  nakshatraLord,
  house,
  retrograde,
  combust,
  exalted,
  debilitated,
  ownSign,
  dignity
}
```

------------------------------------------------------------------------

# 32. Rahu/Ketu

Explicitly choose:

``` text
Mean Node
```

or:

``` text
True Node
```

Never mix.

Validate:

``` text
Rahu and Ketu = 180° apart
```

within tolerance.

------------------------------------------------------------------------

# 33. Retrograde

Prefer longitudinal velocity rather than an arbitrary one-sample
comparison.

Test around station dates for:

-   Mercury
-   Venus
-   Mars
-   Jupiter
-   Saturn

Avoid false retrograde flips caused by numerical noise.

------------------------------------------------------------------------

# 34. Combustion

If implemented:

-   use the selected traditional rule;
-   support planet-specific thresholds if applicable;
-   store the actual separation/orb;
-   show the rule in debug data.

------------------------------------------------------------------------

# 35. Dignity

Use a canonical rule table for:

-   exaltation
-   debilitation
-   own sign
-   moolatrikona
-   friend
-   neutral
-   enemy

Do not duplicate dignity logic in different UI components.

------------------------------------------------------------------------

# 36. Vargas

Audit every supported Varga.

Priority:

``` text
D1
D2
D3
D4
D7
D9
D10
D12
D16
D20
D24
D27
D30
D40
D45
D60
```

Every Varga needs:

-   documented formula
-   golden cases
-   boundary tests
-   selected tradition/source

------------------------------------------------------------------------

# 37. D60 warning

D60 is extremely sensitive to birth time.

If birth time is approximate:

-   show a warning;
-   reduce forecast strength;
-   do not base a strong conclusion solely on D60.

------------------------------------------------------------------------

# 38. Navamsa

D9 boundary tests:

``` text
0°
3°20′
6°40′
10°
13°20′
...
30°
```

Test just below and above every boundary.

------------------------------------------------------------------------

# 39. Vimshottari Dasa

Existing Dasa must be upgraded/validated for:

-   Maha Dasa
-   Bhukti/Antardasa
-   Pratyantardasa
-   optional Sookshma/Prana levels

At birth:

1.  Moon sidereal longitude
2.  Nakshatra
3.  Nakshatra lord
4.  fraction elapsed
5.  remaining Dasa
6.  start/end dates
7.  full sequence

Do not round intermediate calculations.

------------------------------------------------------------------------

# 40. Dasa duration convention

Current implementation uses `365.2425`-day arithmetic.

Document this.

Benchmark against a trusted reference.

If the chosen tradition uses calendar-based duration, implement that
convention consistently.

Never use one duration convention for Maha Dasa and another for Bhukti
without explicit reason.

------------------------------------------------------------------------

# 41. Dasa timeline

Create an integrated timeline showing:

``` text
Current Maha Dasa
Current Bhukti
Current Pratyantardasa
Start
End
Days remaining
Next period
```

Allow past/current/future navigation.

------------------------------------------------------------------------

# 42. Gochara

For each planet:

-   sign
-   Nakshatra
-   Pada
-   ingress
-   retrograde
-   direct
-   station
-   combustion
-   transit end

Planets:

``` text
Sun
Moon
Mercury
Venus
Mars
Jupiter
Saturn
Rahu
Ketu
```

------------------------------------------------------------------------

# 43. Transit events

Create exact events:

``` text
planet enters sign
planet enters Nakshatra
planet enters Pada
retrograde begins
retrograde ends
planet crosses natal degree
combustion begins/ends
```

Every event must have an exact timestamp.

------------------------------------------------------------------------

# 44. Chandrashtama

Calculate dynamically from:

``` text
Natal Moon sign
+
current Moon sign
```

The 8th sign from natal Moon is the Chandrashtama sign.

Show:

-   previous occurrence
-   current status
-   next occurrence
-   start
-   end

Never use a generic fixed calendar.

------------------------------------------------------------------------

# 45. Ashtakavarga

Audit and return:

-   BAV
-   SAV
-   sign-wise bindus
-   transit interpretation data

Do not collapse everything into one unexplained score.

------------------------------------------------------------------------

# 46. Shadbala

If exposed, return components separately:

``` text
Sthana Bala
Dig Bala
Kala Bala
Cheshta Bala
Naisargika Bala
Drik Bala
```

Show:

-   component
-   score
-   total
-   normalization
-   rule interpretation

------------------------------------------------------------------------

# 47. Yoga rule registry

Use one canonical rule engine:

``` ts
type YogaRule = {
  id: string;
  nameTa: string;
  nameEn: string;
  condition: (chart) => boolean;
  explanationTa: string;
  explanationEn: string;
};
```

Audit supported rules such as:

-   Raja Yoga
-   Dhana Yoga
-   Gaja Kesari
-   Neecha Bhanga
-   Vipareeta Raja Yoga
-   Dharma-Karmadhipati
-   Lakshmi Yoga
-   Budha-Aditya
-   Chandra-Mangala

A yoga must be returned with evidence.

------------------------------------------------------------------------

# 48. Duplicate-rule prevention

The same yoga must not be implemented separately in:

-   dashboard
-   report
-   PDF
-   forecast
-   chart view

Use one rule implementation.

------------------------------------------------------------------------

# 49. Prediction architecture

Do not ask an AI model to "predict the future" directly.

Use:

``` text
Astronomical calculations
→ Chart calculations
→ Dasa/transits
→ Traditional rules
→ Evidence aggregation
→ Conflict resolution
→ Domain forecast
→ Tamil/English narrative
```

The language layer only verbalizes structured evidence.

------------------------------------------------------------------------

# 50. Prediction evidence

``` ts
type PredictionEvidence = {
  domain: string;
  periodStart: string;
  periodEnd: string;
  natalFactors: string[];
  dashaFactors: string[];
  transitFactors: string[];
  vargaFactors: string[];
  ashtakavargaFactors?: string[];
  supportingRules: string[];
  conflictingRules: string[];
  supportLevel: "low" | "moderate" | "strong";
};
```

Do not call this a scientific probability.

------------------------------------------------------------------------

# 51. Contradiction engine

Example:

``` text
7th house supports relationship
+
Dasa supports commitment
-
Saturn indicates delay
```

Output:

``` text
ஆதரிக்கும் காரணிகள்:
...

தாமதம்/எதிர்ப்பு:
...

பாரம்பரிய விளக்கம்:
கால தாமதத்துடன் வாய்ப்பு காணப்படுகிறது.
```

Never let one yoga override all other factors.

------------------------------------------------------------------------

# 52. Career

Evaluate:

-   2nd
-   6th
-   10th
-   11th
-   10th lord
-   Sun
-   Saturn
-   Mercury
-   D10
-   Dasa
-   Jupiter/Saturn
-   Ashtakavarga where available

Output:

-   stability
-   responsibility
-   role changes
-   promotion themes
-   job-search periods
-   skill-development themes

Never promise an exact job date.

------------------------------------------------------------------------

# 53. Finance

Evaluate:

-   2nd
-   5th
-   8th
-   9th
-   11th
-   relevant lords
-   Jupiter
-   Venus
-   D2
-   Dasa
-   transits
-   Ashtakavarga

Output:

-   income themes
-   savings
-   expense pressure
-   asset themes
-   risk-awareness periods

Do not recommend specific stocks/crypto/investments solely from
astrology.

------------------------------------------------------------------------

# 54. Business

Evaluate:

-   2nd
-   7th
-   10th
-   11th
-   Mercury
-   Jupiter
-   Venus
-   D10
-   Dasa
-   transits

Output:

-   expansion
-   partnership
-   network
-   customer themes
-   cash-flow caution
-   venture timing themes

------------------------------------------------------------------------

# 55. Education

Evaluate:

-   2nd
-   4th
-   5th
-   9th
-   Mercury
-   Jupiter
-   D24
-   Dasa
-   relevant transits

Output:

-   learning
-   concentration
-   higher studies
-   competitive preparation
-   skill development

------------------------------------------------------------------------

# 56. Marriage/relationship

Never predict marriage from Moon sign alone.

Evaluate at minimum:

-   2nd
-   5th
-   7th
-   8th
-   12th
-   7th lord
-   Venus
-   Jupiter where relevant
-   D9
-   Dasa
-   transits
-   relevant yogas

Output:

-   relationship theme
-   commitment theme
-   support factors
-   delay factors
-   timing windows

------------------------------------------------------------------------

# 57. Children/family

Evaluate:

-   2nd
-   5th
-   9th
-   Jupiter
-   D7
-   Dasa
-   transits

Never make medical/fertility certainty claims.

------------------------------------------------------------------------

# 58. Property/vehicle

Property:

-   4th
-   4th lord
-   Mars
-   Venus
-   Moon
-   D4
-   Dasa
-   transit

Vehicle can be a separate interpretation using the selected traditional
rules.

------------------------------------------------------------------------

# 59. Travel/foreign

Evaluate:

-   3rd
-   9th
-   12th
-   Rahu
-   relevant lords
-   relevant Vargas
-   Dasa
-   transits

Separate:

``` text
short travel
long travel
foreign work
foreign residence
```

------------------------------------------------------------------------

# 60. Wellness/health wording

Astrology must not diagnose illness.

Never generate:

``` text
You have cancer.
You will have a heart attack.
You will definitely develop diabetes.
```

Use:

> "இந்த காலத்தில் உடல்நலம் மற்றும் ஓய்வில் கூடுதல் கவனம் செலுத்துவது பாரம்பரிய ஜோதிட
> விளக்கத்தில் பரிந்துரைக்கப்படுகிறது."

Include:

> "ஜோதிட விளக்கம் மருத்துவ பரிசோதனை அல்லது மருத்துவர் ஆலோசனைக்கு மாற்றாகாது."

------------------------------------------------------------------------

# 61. Legal/financial safety

For legal, financial and medical topics, state that the astrology output
is not a substitute for professional advice.

Do not use astrology to determine guilt, legal outcome, investment
certainty or medical diagnosis.

------------------------------------------------------------------------

# 62. Yearly forecast horizons

Support:

``` text
1 year
3 years
5 years
10 years
20 years
60 years
```

Detail must decrease with horizon.

### 1 year

Month-by-month.

### 3 years

Quarter/year + major transits.

### 5 years

Year-by-year major phases.

### 10 years

Major Dasa/transit phases.

### 20 years

Broad Dasa/slow-planet themes.

### 60 years

Calendar + major life-cycle information, not fake monthly predictions.

------------------------------------------------------------------------

# 63. Yearly forecast object

``` ts
type ForecastPeriod = {
  start: string;
  end: string;
  tamilYear?: string;
  tamilMonth?: string;
  mahaDasa?: string;
  bhukti?: string;
  majorTransits: string[];
  supportingFactors: string[];
  cautionFactors: string[];
  domains: Record<string, DomainForecast>;
};
```

------------------------------------------------------------------------

# 64. Domain forecast

``` ts
type DomainForecast = {
  theme: string;
  period: string;
  support: string[];
  caution: string[];
  traditionalInterpretation: string;
  evidenceIds: string[];
};
```

------------------------------------------------------------------------

# 65. Monthly forecast

For each month calculate actual:

-   Tamil month
-   Dasa
-   Bhukti
-   major transits
-   Moon-cycle events where relevant
-   supporting factors
-   conflicting factors

Do not reuse identical generic text for every month.

------------------------------------------------------------------------

# 66. Daily Rasi

Daily Rasi must be personalized from actual:

-   Moon sign
-   Moon Nakshatra
-   Panchanga
-   relevant slow transits
-   current Dasa where applicable

Allow:

``` text
previous day
today
next day
calendar
```

------------------------------------------------------------------------

# 67. All-areas forecast page

Create:

``` text
/forecast
```

Sections:

``` text
Overall
Career
Income/Finance
Business
Education
Marriage
Family
Children
Property
Vehicle
Travel
Foreign
Wellness
Spirituality
Personal development
Social reputation
```

Each section:

``` text
Current theme
Next important period
Supporting factors
Caution factors
Traditional interpretation
```

------------------------------------------------------------------------

# 68. 60-year personal timeline

Separate:

``` text
60-year CALENDAR
```

from:

``` text
60-year PERSONAL FORECAST
```

Calendar = deterministic calculation.

Forecast = traditional interpretation based on:

-   natal chart
-   Dasa
-   transits
-   selected rules

Each year should contain only:

``` text
Tamil year
Gregorian year
Samvatsara
Age
Maha Dasa
major transit
broad domain themes
```

Do not generate unsupported day-level claims for decades.

------------------------------------------------------------------------

# 69. Age calculation

Do not use only:

``` text
currentYear - birthYear
```

Calculate actual age based on date.

For Tamil-year views, also show the age at the Tamil-year boundary.

------------------------------------------------------------------------

# 70. Current-period dashboard

Show:

``` text
Today
Current Tamil date
Tamil year
Current Dasa
Current Bhukti
Moon Rasi
Moon Nakshatra
Major current transits
```

All location-aware.

------------------------------------------------------------------------

# 71. "Why this prediction?" UI

Every major forecast should have an expandable section:

``` text
ஏன் இந்த விளக்கம்?
```

Show:

-   Dasa factor
-   transit factor
-   natal factor
-   Varga factor
-   supporting yoga
-   conflicting factor

This is a major trust feature.

------------------------------------------------------------------------

# 72. No black-box score

Avoid:

``` text
Career 92/100
Marriage 83/100
Finance 77/100
```

Prefer:

``` text
Strong traditional support
Mixed factors
Caution period
Transition period
```

and show evidence.

------------------------------------------------------------------------

# 73. AI usage rules

If AI is used for Tamil/English narrative:

Input must be structured JSON.

AI must not invent:

-   planetary positions
-   Dasa dates
-   transit dates
-   Tamil calendar dates
-   yogas
-   event dates

Before showing AI output, validate every factual claim against the
calculation object.

------------------------------------------------------------------------

# 74. AI output validator

Check:

``` text
planet names exist
dates exist
Dasa periods match
Tamil month matches
Samvatsara matches
yogas exist
no guaranteed prediction language
no unsupported exact event
```

Reject/regenerate invalid text.

------------------------------------------------------------------------

# 75. Tamil language

Tamil must be first-class.

Canonical terminology:

``` text
Lagna      → லக்னம்
Rasi       → ராசி
Nakshatra  → நட்சத்திரம்
Pada       → பாதம்
Dasa       → தசை
Bhukti     → புத்தி
Gochara    → கோச்சாரம்
Bhava      → பாவம்
Graha      → கிரகம்
Panchanga  → பஞ்சாங்கம்
Tithi      → திதி
Yoga       → யோகம்
Karana     → கரணம்
Ayanamsa   → அயனாம்சம்
```

Do not use awkward machine-translated Tamil.

------------------------------------------------------------------------

# 76. Report modes

Preserve exactly:

``` text
1-page Jathagam
6-page Jatham
30-page Jathatgam
```

Keep prior constraints:

-   do not use "பாரம்பரிய ஜாதகம்" label;
-   do not use "முன்னோட்டம் (Sample)" label;
-   validate print;
-   validate PDF;
-   support long names without layout break.

------------------------------------------------------------------------

# 77. 1-page report

Include:

-   birth details
-   calculation method
-   Lagna
-   Rasi
-   Nakshatra/Pada
-   Graha positions
-   Rasi chart
-   Navamsa
-   Dasa summary

Do not overload it with every forecast.

------------------------------------------------------------------------

# 78. 6-page report

Suggested:

1.  Birth details + methodology
2.  Rasi + Grahas
3.  Bhava
4.  Navamsa/Varga summary
5.  Dasa/Gochara
6.  concise interpretation

------------------------------------------------------------------------

# 79. 30-page report

Suggested:

1.  Cover
2.  Birth details
3.  Calculation methodology
4.  Rasi
5.  Graha positions
6.  Lagna
7.  Bhava
8.  Nakshatra
9.  Navamsa 10--16. key Vargas
10. Shadbala
11. Ashtakavarga
12. dignity
13. Yogas
14. Dasa
15. Bhukti
16. current period
17. Gochara
18. career
19. finance
20. marriage/family
21. education/property/travel
22. wellness disclaimer + themes
23. summary + methodology

Adapt page count when content naturally requires it.

------------------------------------------------------------------------

# 80. PDF/print rule

Freeze the calculation snapshot before export.

PDF must retain:

-   birth data
-   location
-   timezone
-   calculation profile
-   ayanamsa
-   ephemeris version
-   engine version
-   report generation time

Do not recalculate using the browser's timezone during printing.

------------------------------------------------------------------------

# 81. Privacy

Birth information is sensitive.

Do not send raw:

-   name
-   DOB
-   birth time
-   coordinates

to analytics.

Personal report URLs should be `noindex` unless intentionally public.

If share links are implemented, prefer an opaque report identifier
instead of exposing full birth parameters.

------------------------------------------------------------------------

# 82. Analytics

Allowed:

``` text
jathagam_created
panchangam_viewed
forecast_opened
calendar_60_year_opened
pdf_exported
share_clicked
```

Do not include birth details in event payloads.

------------------------------------------------------------------------

# 83. Calculation-error reporting

Add:

``` text
கணக்கீட்டில் தவறு உள்ளதா?
Report a calculation issue
```

Categories:

``` text
Lagna
Rasi
Nakshatra
Dasa
Tamil date
Panchangam
Sunrise
PDF
Other
```

Store diagnostic version/profile information without unnecessary
personal birth data.

------------------------------------------------------------------------

# 84. Validation sources

Use multiple independent references.

### Primary astronomical/calendar references

-   India Meteorological Department / Positional Astronomy Centre ---
    Rashtriya Panchanga
-   JPL Solar System Dynamics --- DE440/DE441/Horizons
-   IAU SOFA

### Cross-check

-   independent Panchanga source such as Drik Panchang

### Traditional astrology

Document the actual traditional/classical source for each interpretation
rule.

Do not use a general website as the mathematical authority for every
calculation.

------------------------------------------------------------------------

# 85. Research findings that must guide implementation

### Finding A

Indian Panchanga documentation uses exact solar ingress into Rasis for
solar-month calculations and provides Tithi, Nakshatra, Yoga, Karana,
sunrise/sunset, transits and local Lagna information.

### Finding B

Panchanga timings are location dependent.

### Finding C

Sidereal positions depend on the chosen Ayanamsa.

### Finding D

JPL ephemerides are observationally constrained astronomical reference
data; long-term uncertainty still exists and must not be hidden by
excessive displayed precision.

### Finding E

The 60-year Samvatsara cycle is a calendar naming cycle. It must not be
mistaken for a standalone personal 60-year prediction model.

------------------------------------------------------------------------

# 86. Golden chart tests

Create at least 50 test charts covering:

-   modern births
-   historical births
-   midnight
-   sunrise
-   sunset
-   leap day
-   month boundary
-   Rasi boundary
-   Nakshatra boundary
-   Pada boundary
-   Navamsa boundary
-   D60 boundary
-   planetary retrograde station
-   eclipse date

Expected fields:

``` text
Lagna
Sun
Moon
Rasi
Nakshatra
Pada
Dasa
Navamsa
```

------------------------------------------------------------------------

# 87. Boundary testing

For every Rasi boundary:

``` text
29°59′59″
30°00′00″
30°00′01″
```

Also test:

-   all Nakshatra boundaries
-   all Pada boundaries
-   all Navamsa boundaries
-   all Tithi boundaries
-   all Yoga boundaries
-   all Karana boundaries
-   all Tamil month ingresses
-   60-year wrap boundary

------------------------------------------------------------------------

# 88. Floating-point policy

Never use exact floating-point equality for angular values.

Use:

``` ts
angularDifference(a, b) <= tolerance
```

Keep high precision internally and round only for display.

------------------------------------------------------------------------

# 89. Cache key

Astronomical cache must include:

``` text
instant
latitude
longitude
timezone
ephemeris
ayanamsa
profile
```

Date-only cache is invalid for location-specific data.

------------------------------------------------------------------------

# 90. Dynamic vs static

Static:

``` text
Rasi names
Nakshatra names
Samvatsara names
definitions
glossary
```

Dynamic:

``` text
planet positions
sunrise
sunset
moonrise
moonset
tithi
nakshatra transition
yoga
karana
Tamil month
Dasa
Gochara
predictions
```

Never hard-code dynamic values.

------------------------------------------------------------------------

# 91. Prediction cache

Cache key must include:

``` text
birth chart hash
profile
date range
ephemeris version
rule-engine version
language
```

Changing a rule version must invalidate old prediction cache.

------------------------------------------------------------------------

# 92. Rule-engine version

Add:

``` ts
ASTRO_RULE_ENGINE_VERSION = "1.x.x";
```

Increment when interpretation logic changes.

------------------------------------------------------------------------

# 93. Reproducibility

Saved reports should retain:

``` text
birth data
profile
ephemeris version
rule version
timezone
coordinates
generation timestamp
```

A future engine update must not silently change an old saved report.

------------------------------------------------------------------------

# 94. Debug mode

Development-only panel:

``` text
Input
UTC
Julian Date
Coordinates
Timezone
Ayanamsa
Tropical positions
Sidereal positions
Lagna
Nakshatra
Tithi
Yoga
Karana
Dasa boundaries
Transit boundaries
```

Add calculation JSON export for golden-test debugging.

------------------------------------------------------------------------

# 95. Current-engine priority fixes

Implement these before expanding prediction content:

### P0

1.  Timezone/location normalization.
2.  Ephemeris benchmark.
3.  Ayanamsa consistency.
4.  Tamil month event calculation.
5.  Complete 60-year Samvatsara engine.
6.  Event-based Panchangam.
7.  Lagna/Nakshatra/Dasa reference validation.

### P1

8.  Varga validation.
9.  Transit event engine.
10. Ashtakavarga audit.
11. Yoga rule registry.
12. Evidence/contradiction engine.

### P2

13. Monthly forecast.
14. 3/5/10-year forecast.
15. 20/60-year overview.
16. advanced Muhurtha.
17. explanation UI.

### P3

18. advanced visualization.
19. personalization.
20. extra exports.

Never sacrifice P0 correctness for P2/P3 presentation.

------------------------------------------------------------------------

# 96. Test locations

At minimum:

``` text
Chennai
Madurai
Coimbatore
Tiruchirappalli
Bengaluru
Delhi
Mumbai
Colombo
Singapore
Kuala Lumpur
London
New York
```

Compare:

-   sunrise
-   sunset
-   Moonrise
-   Moonset
-   Panchanga transitions
-   Rahu Kalam
-   Yamagandam
-   Gulikai
-   Tamil calendar boundaries

------------------------------------------------------------------------

# 97. 60-year test matrix

Verify:

``` text
1987 → 1 Prabhava
1988 → 2 Vibhava
...
2025 → 39 Vishvavasu
2026 → 40 Parabhava
2046 → 60 Akshaya
2047 → 1 Prabhava
```

Again: resolve actual Tamil-year start before applying the Gregorian
anchor.

------------------------------------------------------------------------

# 98. Calendar UI test

Check:

-   all 60 names present
-   no duplicates
-   no missing names
-   correct wrap
-   Tamil spelling
-   transliteration
-   Gregorian mapping
-   Chithirai 1
-   previous/next cycle

------------------------------------------------------------------------

# 99. Prediction tests

Create cases with:

``` text
strong support
strong conflict
mixed factors
no support
missing data
approximate birth time
```

Expected behavior:

``` text
strong support
mixed
caution
insufficient evidence
```

Never produce confident predictions when evidence is absent.

------------------------------------------------------------------------

# 100. Generic-horoscope prevention

Never use a generic fallback such as:

> "இந்த ஆண்டு உங்களுக்கு நல்ல முன்னேற்றம் ஏற்படும்."

unless actual calculated factors support that statement.

Every forecast must reference at least one actual computed factor.

------------------------------------------------------------------------

# 101. Long-horizon rule

The farther the prediction horizon, the broader the language.

``` text
12 months → detailed
1–3 years → moderate
3–5 years → broad
5–10 years → major phases
10–20 years → major cycles
20–60 years → broad traditional themes
```

Do not generate fake monthly predictions 30--60 years into the future.

------------------------------------------------------------------------

# 102. Forecast period

``` ts
type ForecastPeriod = {
  start: string;
  end: string;
  tamilYear?: string;
  tamilMonth?: string;
  mahaDasa?: string;
  bhukti?: string;
  majorTransits: string[];
  supportingFactors: string[];
  cautionFactors: string[];
  domains: Record<string, DomainForecast>;
};
```

------------------------------------------------------------------------

# 103. Forecast domain

``` ts
type DomainForecast = {
  theme: string;
  period: string;
  support: string[];
  caution: string[];
  traditionalInterpretation: string;
  evidenceIds: string[];
};
```

------------------------------------------------------------------------

# 104. Forecast API

``` ts
getForecast({
  birthChart,
  startDate,
  endDate,
  location,
  profile,
  language
})
```

Return:

``` text
overview
periods
domains
majorEvents
evidence
methodology
```

------------------------------------------------------------------------

# 105. All-area forecast

Create:

``` text
/forecast
```

with:

``` text
Overall
Career
Finance
Business
Education
Marriage
Family
Children
Property
Vehicle
Travel
Foreign
Wellness
Spirituality
Personal development
Social themes
```

Every domain needs:

``` text
current theme
next important period
supporting factors
caution factors
```

------------------------------------------------------------------------

# 106. Timeline UI

Use an event timeline:

``` text
2026 ───── 2027 ───── 2028 ───── 2029
  │           │           │
Dasa         Jupiter     Saturn
change       transit     transit
```

Clicking an event shows:

``` text
What changed?
Why it matters traditionally?
Which rules apply?
```

------------------------------------------------------------------------

# 107. Period labels

Prefer:

``` text
Supportive period
Mixed period
Caution period
Transition period
```

instead of:

``` text
Good year
Bad year
Lucky year
Unlucky year
```

------------------------------------------------------------------------

# 108. Multi-factor timing

A strong timing window should normally contain multiple supporting
signals:

``` text
Dasa support
+
transit support
+
relevant house activation
+
relevant Varga support
```

If only one factor exists, downgrade the support level.

------------------------------------------------------------------------

# 109. Evidence trace

Every prediction internally stores:

``` ts
{
  sourceType: "natal" | "dasa" | "transit" | "varga" | "panchanga",
  sourceId: string,
  explanation: string
}
```

This enables debugging and "Why this prediction?" UI.

------------------------------------------------------------------------

# 110. 60-year forecast UI

The user can choose:

``` text
60-year overview
```

Each year shows:

``` text
Tamil year
Gregorian year
Samvatsara
Age
Maha Dasa
major transit
broad themes
```

Expand for:

``` text
Why this year matters
Supporting rules
Caution factors
```

------------------------------------------------------------------------

# 111. No black-box prediction score

Do not show unexplained scores like:

``` text
Career 92/100
Marriage 83/100
Finance 77/100
```

Show evidence counts/qualitative support instead.

------------------------------------------------------------------------

# 112. Calculation-status model

``` ts
type CalculationStatus =
  | "exact"
  | "reference_validated"
  | "approximate"
  | "unavailable";
```

Never label an approximation as exact.

------------------------------------------------------------------------

# 113. Validation levels

Use:

``` text
LEVEL 0 — Not implemented
LEVEL 1 — Implemented
LEVEL 2 — Unit tested
LEVEL 3 — Reference validated
LEVEL 4 — Boundary validated
LEVEL 5 — Production monitored
```

Never call Level 1 "accurate".

------------------------------------------------------------------------

# 114. Accuracy validation document

Create:

``` text
docs/ASTRO_ACCURACY_VALIDATION.md
```

For every calculation record:

``` text
Calculation
Formula/method
Reference
Test date
Location
Expected
Actual
Tolerance
Pass/Fail
Known limitation
```

------------------------------------------------------------------------

# 115. Accuracy roadmap document

Create:

``` text
docs/ASTRO_ACCURACY_ROADMAP.md
```

Track:

``` text
Current implementation
Known gap
Target implementation
Reference
Test
Status
```

------------------------------------------------------------------------

# 116. Release gates

## Gate A --- Astronomy

-   timezone pass
-   coordinates pass
-   ephemeris benchmark pass
-   ayanamsa pass

## Gate B --- Calendar

-   60-year sequence pass
-   Tamil month boundaries pass
-   Gregorian conversion pass
-   Panchanga transitions pass

## Gate C --- Jathagam

-   Lagna pass
-   Grahas pass
-   Nakshatra pass
-   Navamsa pass
-   Dasa pass
-   Varga pass

## Gate D --- Prediction

-   deterministic rules
-   evidence trace
-   conflict handling
-   no invented facts
-   long-horizon degradation

## Gate E --- UX

-   mobile
-   desktop
-   Tamil
-   print
-   PDF
-   accessibility

------------------------------------------------------------------------

# 117. Implementation order

Do not begin by writing 60-year prediction prose.

Implement:

``` text
Phase 1  Time/location
Phase 2  Ephemeris validation
Phase 3  Ayanamsa profiles
Phase 4  Tamil solar calendar
Phase 5  60-year Samvatsara
Phase 6  Event Panchangam
Phase 7  Jathagam validation
Phase 8  Varga validation
Phase 9  Dasa validation
Phase 10 Transit events
Phase 11 Rule engine
Phase 12 Domain predictions
Phase 13 1/3/5/10/20/60-year forecasts
Phase 14 Reports/PDF
Phase 15 Validation dashboard
Phase 16 Production monitoring
```

------------------------------------------------------------------------

# 118. First coding task

Before changing prediction text:

Create:

``` text
docs/ASTRO_ACCURACY_ROADMAP.md
docs/ASTRO_ACCURACY_VALIDATION.md
```

Then create one golden chart.

Validate:

``` text
Lagna
Sun
Moon
Rasi
Nakshatra
Pada
Dasa
Navamsa
```

------------------------------------------------------------------------

# 119. Second coding task

Build the Tamil calendar independently from the prediction engine.

It must work without a Jathagam.

------------------------------------------------------------------------

# 120. Third coding task

Build the complete 60-year calendar.

Do not call this a 60-year "prediction".

------------------------------------------------------------------------

# 121. Fourth coding task

Upgrade Panchangam to event intervals.

The daily page should show start/end times, not only the currently
active element.

------------------------------------------------------------------------

# 122. Fifth coding task

Benchmark against:

``` text
IMD Rashtriya Panchanga
JPL/Horizons where applicable
independent Panchanga reference
```

Investigate every material disagreement.

Possible causes:

``` text
location
timezone
ayanamsa
ephemeris
definition
sunrise convention
calendar tradition
```

Do not automatically assume the first source is correct.

------------------------------------------------------------------------

# 123. Sixth coding task

Only after calculation validation:

Implement:

``` text
yearlyForecast()
monthlyForecast()
domainForecast()
```

All consume structured calculated evidence.

------------------------------------------------------------------------

# 124. Seventh coding task

Create `/calculation-method`.

Explain:

-   astronomical engine
-   ephemeris
-   sidereal zodiac
-   ayanamsa
-   timezone
-   location
-   Panchanga method
-   Dasa method
-   house system
-   Varga method
-   limitations

Use simple Tamil plus expandable technical details.

------------------------------------------------------------------------

# 125. Eighth coding task

Create `/transits`.

Include:

-   planet
-   date/time
-   Rasi
-   Nakshatra
-   Pada
-   retrograde/direct
-   station
-   combustion where supported

------------------------------------------------------------------------

# 126. Ninth coding task

Create `/forecast`.

Use:

-   evidence
-   timeline
-   domain sections
-   yearly/monthly periods
-   "Why this prediction?"

------------------------------------------------------------------------

# 127. Tenth coding task

Upgrade reports and PDF only after the calculation engine passes
validation.

------------------------------------------------------------------------

# 128. Mobile-specific requirements

Preserve the current premium mobile foundation.

Astro mobile must handle:

-   Tamil long text
-   long user names
-   birth forms
-   mobile keyboard
-   chart containers
-   Panchanga event tables
-   forecast timelines
-   report sections
-   PDF controls
-   no page-level horizontal scrolling

Charts may scroll inside controlled containers when necessary.

------------------------------------------------------------------------

# 129. Accessibility

Use:

-   semantic headings
-   labels
-   focus states
-   accessible tables
-   screen-reader descriptions for charts
-   keyboard support
-   reduced-motion support
-   adequate contrast

Do not make chart meaning purely visual.

------------------------------------------------------------------------

# 130. Performance

Do not calculate 60 years of detailed forecast on initial load.

Lazy-load:

-   60-year calendar
-   deep Vargas
-   detailed forecast
-   long transit timeline
-   full report

Cache deterministic calculations safely.

------------------------------------------------------------------------

# 131. Final regression checklist

### Calendar

-   [ ] 60 names
-   [ ] cycle wrap
-   [ ] Gregorian mapping
-   [ ] Tamil month boundaries
-   [ ] Tamil/Gregorian conversion
-   [ ] historical dates
-   [ ] 60-year navigation

### Panchangam

-   [ ] sunrise
-   [ ] sunset
-   [ ] moonrise
-   [ ] moonset
-   [ ] Tithi
-   [ ] Nakshatra
-   [ ] Yoga
-   [ ] Karana
-   [ ] Rahu Kalam
-   [ ] Yamagandam
-   [ ] Gulikai
-   [ ] Abhijit
-   [ ] Choghadiya
-   [ ] Gowri
-   [ ] transit events

### Jathagam

-   [ ] Lagna
-   [ ] Rasi
-   [ ] Grahas
-   [ ] Nakshatra
-   [ ] Pada
-   [ ] D9
-   [ ] D10
-   [ ] D60
-   [ ] Bhava
-   [ ] aspects
-   [ ] dignity
-   [ ] retrograde
-   [ ] combustion
-   [ ] Dasa
-   [ ] Bhukti
-   [ ] Ashtakavarga
-   [ ] Shadbala
-   [ ] Yogas

### Forecast

-   [ ] career
-   [ ] finance
-   [ ] business
-   [ ] education
-   [ ] marriage
-   [ ] family
-   [ ] children
-   [ ] property
-   [ ] vehicle
-   [ ] travel
-   [ ] foreign
-   [ ] wellness
-   [ ] spirituality
-   [ ] 1-year
-   [ ] 3-year
-   [ ] 5-year
-   [ ] 10-year
-   [ ] 20-year
-   [ ] 60-year

### Reports

-   [ ] 1-page
-   [ ] 6-page
-   [ ] 30-page
-   [ ] print
-   [ ] PDF
-   [ ] Tamil
-   [ ] English
-   [ ] long names
-   [ ] mobile

------------------------------------------------------------------------

# 132. Final definition of done

Do not mark this project complete until:

-   [ ] Astronomy calculations are benchmarked.
-   [ ] Timezone conversion is validated.
-   [ ] Location calculations are validated.
-   [ ] Ayanamsa is explicit and consistent.
-   [ ] Tamil month is event-based.
-   [ ] 60-year Samvatsara is complete.
-   [ ] 60-year calendar is dynamically generated.
-   [ ] Panchangam is transition/event based.
-   [ ] Dasa is reference validated.
-   [ ] Vargas are boundary tested.
-   [ ] Gochara has event timing.
-   [ ] Yoga rules are centralized.
-   [ ] Prediction evidence is traceable.
-   [ ] Contradictory factors are handled.
-   [ ] Long-term predictions become broader.
-   [ ] No deterministic/fear-based claims are generated.
-   [ ] Tamil output is reviewed.
-   [ ] PDF uses the same calculation snapshot.
-   [ ] Birth data is excluded from analytics.
-   [ ] Existing reports remain functional.
-   [ ] Mobile UX remains functional.
-   [ ] `ASTRO_ACCURACY_VALIDATION.md` is complete.

------------------------------------------------------------------------

# 133. Exact coding-agent instruction

> Act as a senior astronomical-calculation and traditional-astrology
> software engineer. Inspect the existing `codepackr-astro` repository
> before changing anything. Preserve working features and avoid
> duplicate engines.
>
> First audit the current calculation engine. Identify approximate,
> snapshot-based, hard-coded, duplicated, inconsistent, or unvalidated
> calculations.
>
> Prioritize time/location correctness, ephemeris validation, ayanamsa
> consistency, Tamil solar-month boundaries, complete 60-year Samvatsara
> calculation, event-based Panchangam, Lagna/Nakshatra/Dasa validation,
> Varga boundary testing, and exact transit events.
>
> Do not expand prediction prose until the calculation layer passes
> validation.
>
> Build predictions from deterministic structured traditional astrology
> rules. Do not allow AI or templates to invent planetary positions,
> Dasa dates, Tamil dates, yogas, transits, or event dates.
>
> Every major prediction must have machine-readable evidence and
> conflicting factors.
>
> Support 1, 3, 5, 10, 20 and 60-year horizons. Long horizons must
> become broader; do not fabricate exact long-term events.
>
> Clearly separate astronomical calculation from traditional
> astrological interpretation. Do not claim astrology is scientifically
> proven.
>
> Run unit, golden, boundary, calendar, Panchanga, Dasa, Varga, build,
> print and PDF tests after relevant changes.
>
> Do not mark the feature complete because the application builds.
> Produce `docs/ASTRO_ACCURACY_VALIDATION.md` with evidence, references,
> tolerances, failures and deferred items.

------------------------------------------------------------------------

# 134. Research references

### India Meteorological Department / Positional Astronomy Centre

Use Rashtriya Panchanga documentation as a primary reference for Indian
calendar/Panchanga methodology. It describes Tithi, Nakshatra, Yoga,
Karana, sunrise/sunset, sidereal longitudes, Ayanamsa, transits and
solar-month calculation.

### JPL Solar System Dynamics

Use DE440/DE441 and Horizons as astronomical reference/benchmark sources
for planetary positions and long-term ephemeris behavior.

### IAU SOFA

Use IAU Standards of Fundamental Astronomy routines where applicable for
time scales, calendar conversion, astrometry and Earth-rotation related
calculations.

### Independent Panchanga reference

Use an independent Panchanga source such as Drik Panchang for
cross-checking Tamil month/Panchanga outputs. Differences must be
investigated rather than blindly copied.

### Traditional astrology references

For each Yoga, Dasa interpretation, Varga rule, Muhurtha rule and
Porutham rule, document the actual traditional source used by the
project.

------------------------------------------------------------------------

# 135. Important distinction

Astronomical positions are calculable physical/astronomical quantities.

Traditional astrological interpretations are a cultural/traditional
interpretive system.

Therefore the product should explicitly communicate:

> "கிரக நிலைகள் மற்றும் காலக் கணக்கீடுகள் வானியல் கணக்கீடுகளை அடிப்படையாகக் கொண்டவை.
> ஜோதிட விளக்கங்கள் பாரம்பரிய ஜோதிட விதிமுறைகளின் அடிப்படையில் வழங்கப்படுகின்றன."

This improves transparency and prevents the system from presenting an
interpretation as an astronomical fact.

------------------------------------------------------------------------

# 136. Final product principle

The goal is **not simply more predictions**.

The goal is:

**more accurate calculations + complete traditional factors + exact
timing + transparent evidence + consistent Tamil calendar + fewer
unsupported claims.**

A user asking:

> "Why did Astro give me this prediction?"

should be able to see:

``` text
Calculated planetary positions
Selected calculation method
Ayanamsa
Dasa/Bhukti
Transit period
Relevant natal factors
Varga support
Supporting rules
Conflicting rules
Forecast period
Traditional interpretation
```

That is the target quality bar for CodePackr Astro.

# PRE-DEVELOPMENT SECOND-PASS AUDIT & FINAL V2 REQUIREMENTS

## Purpose

This is the mandatory second-pass review before development. The
objective is to identify calculation assumptions, mature product
patterns, validation practices, and customer-trust features that must be
resolved before production.

A review of Drik Panchang, Prokerala, and AstroSage shows mature
astrology products separating birth details, chart calculation,
Panchanga/calendar, Dasha, transits, Vargas, Ashtakavarga, Shadbala,
reports and specialized analyses. Drik exposes selectable Ayanamsha and
mean/true Rahu-Ketu options plus detailed Graha/Bhava data; Prokerala
exposes Rasi/Navamsa, Shodashvarga, Vimshottari, Yoga, Ashtakavarga,
Shadbala, Bhava and favourable-period modules; AstroSage exposes
Ayanamsa, DST correction, chart style, Dasha, Shodashvarga,
Ashtakavarga, ShadBala/BhavBala and multiple prediction systems.
citeturn1search4turn2search0turn1search0turn1search10

These are feature/method observations, not evidence that astrology
predictions are scientifically validated.

------------------------------------------------------------------------

# 1. CUSTOMER ACCURACY PRINCIPLE

Do not promise "100% accurate predictions".

Separate:

### Calculation accuracy

Examples:

-   Sun longitude
-   Moon longitude
-   Lagna
-   Tithi
-   Nakshatra
-   sunrise
-   Tamil solar month
-   Dasa dates
-   transit times

These can be independently benchmarked.

### Traditional interpretation

Examples:

-   career interpretation
-   marriage interpretation
-   wealth interpretation
-   yoga interpretation
-   transit effects

These depend on the selected traditional rule set.

Customer wording:

> "கணக்கீடுகள் தேர்ந்தெடுக்கப்பட்ட வானியல்/காலக் கணக்கீட்டு முறைகளுடன் சரிபார்க்கப்பட்டவை.
> ஜோதிட விளக்கங்கள் தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய விதிமுறைகளின் அடிப்படையில்
> வழங்கப்படுகின்றன."

Never say:

> "100% future prediction guaranteed."

------------------------------------------------------------------------

# 2. COMPETITIVE PATTERN: DRik PANCHANG

Observed patterns:

-   location-specific Panchang
-   local-time display
-   Tamil calendar
-   solar/lunar calendar switching
-   Tamil Samvatsara names
-   selectable Ayanamsha
-   mean/true Rahu-Ketu
-   Rashi chart
-   Graha details
-   Bhava details
-   Nakshatra
-   Yoga
-   Panchangam
-   Vimshottari Dasha
-   Ashtakavarga
-   Shadbala
-   Bhavabala
-   multiple Varga charts

Drik Panchang explicitly notes location/timezone importance and displays
local-time calculations; it also describes Panchanga day boundaries
around sunrise. citeturn0search11turn1search9

### CodePackr lesson

Treat:

``` text
location
+
time
+
calculation profile
```

as first-class inputs.

Do not imitate its UI or copy content.

------------------------------------------------------------------------

# 3. COMPETITIVE PATTERN: PROKERALA

Observed patterns:

-   Tamil Jathagam
-   Tamil Panchangam
-   Tamil calendar
-   Rasi chart
-   Navamsa
-   marriage Porutham
-   personalized reports
-   yearly reports
-   transit reports
-   Sade Sati
-   Dasha
-   Shodashvarga
-   Ashtakavarga
-   Shadbala
-   favourable periods
-   Tamil/English reports
-   PDF reports

Prokerala's Tamil Jathagam connects Jathagam, Porutham, Tamil calendar,
Tamil Panchangam and specialized reports. citeturn0search1

Its API catalogue separates Rasi/Navamsa, planet positions, Yogas,
Shodashvarga, Vimshottari, Ashtakavarga, Sarvashtakavarga, Shadbala,
Bhava and favourable periods into distinct modules. citeturn2search0

### CodePackr lesson

Build Astro as a **calculation platform**, not one giant horoscope page.

------------------------------------------------------------------------

# 4. COMPETITIVE PATTERN: ASTROSAGE

Observed patterns:

-   birth date
-   birth time
-   birthplace
-   longitude
-   latitude
-   timezone
-   DST correction
-   Ayanamsa
-   chart style
-   KP Horary number
-   Dasha
-   Sade Sati
-   transit
-   Shodashvarga
-   Lal Kitab
-   Mangal Dosha
-   ShadBala
-   BhavBala
-   Ashtakavarga
-   multiple Dasha systems
-   PDF

AstroSage exposes advanced settings including DST correction, Ayanamsa,
chart style and coordinates. citeturn1search0

### CodePackr lesson

Advanced settings should exist but remain behind:

``` text
Advanced calculation settings
```

so ordinary users are not overwhelmed.

------------------------------------------------------------------------

# 5. MISSING: EXPLICIT CALCULATION PROFILE

Every Jathagam must have:

``` ts
type CalculationProfile = {
  zodiac: "sidereal";
  ayanamsa: "lahiri" | "raman" | "kp" | "custom";
  nodeMode: "mean" | "true";
  houseSystem: "whole-sign" | "equal" | "sripati" | "placidus" | "other";
  ephemeris: string;
  panchangaMethod: "thirukanitham" | "vakya" | "astronomical";
  sunriseMethod: string;
  dasaMethod: string;
};
```

Save the profile with every report.

------------------------------------------------------------------------

# 6. MISSING: TRADITION SELECTION

Never silently mix:

``` text
Thirukanitham
Vakya
Lahiri
Raman
KP
```

Recommended default profile:

``` text
Sidereal
Lahiri/Chitrapaksha
Mean Node
Whole Sign
Thirukanitham-oriented Tamil solar calendar
```

The exact default must be validated before production.

If Vakya is supported, implement a genuine documented Vakya method/data
source. Do not call a generic approximation "Vakya".

------------------------------------------------------------------------

# 7. MISSING: CALCULATION PROFILE COMPARISON

Advanced users should be able to compare:

``` text
Lahiri
vs
Raman
vs
KP
```

Show:

-   Lagna difference
-   Moon difference
-   Nakshatra difference
-   Dasa-start difference
-   boundary changes

Explain that different traditions can produce different results.

Do not claim one tradition is universally correct.

------------------------------------------------------------------------

# 8. MISSING: BIRTH-TIME SENSITIVITY ENGINE

For approximate birth time, test:

``` text
-10 minutes
-5 minutes
exact
+5 minutes
+10 minutes
```

Compare:

-   Lagna
-   Bhava
-   D9
-   D10
-   D60
-   Dasa balance
-   key yogas

Return:

``` text
Stable
Moderately sensitive
Highly sensitive
```

Example:

> "லக்னம் மாறாததால் இந்த நேர வரம்பில் லக்ன அடிப்படை நிலையானதாக உள்ளது."

or:

> "இந்த பிறப்பு நேர வரம்பில் நவாம்சம் மாறக்கூடும். துல்லியமான நேரம் தேவை."

Never pretend exactness when the input is approximate.

------------------------------------------------------------------------

# 9. MISSING: BIRTH-TIME RECTIFICATION

If added later, make it an explicit feature:

``` text
Birth Time Rectification
```

Inputs:

-   marriage
-   education
-   first job
-   job change
-   children
-   relocation
-   property
-   major financial events
-   other dated life events

Output:

``` text
candidate time range
supporting events
conflicting events
confidence
```

Never silently change the user's original birth time.

------------------------------------------------------------------------

# 10. MISSING: HISTORICAL TIMEZONE ENGINE

Use a historical timezone database.

Resolve:

``` text
location
+
date
+
local time
→ timezone
→ historical UTC offset
→ DST status
```

Store:

``` ts
{
  timezone: "Asia/Kolkata",
  utcOffsetMinutes: 330,
  dstApplied: false
}
```

Do not use today's offset for historical births.

------------------------------------------------------------------------

# 11. MISSING: LOCATION CONFIDENCE

Location lookup must return:

``` text
place
state/district
country
latitude
longitude
timezone
source
```

If names are ambiguous, require user selection.

Never silently choose a same-named place.

------------------------------------------------------------------------

# 12. MISSING: ELEVATION

Support:

``` text
elevationMeters
```

where supported by the astronomical method.

If unavailable, explicitly record:

``` text
elevationAssumption = 0
```

------------------------------------------------------------------------

# 13. MISSING: PANCHANGA DAY DEFINITION

Clearly distinguish:

``` text
civil date: midnight-to-midnight
Panchanga day: sunrise-to-sunrise where the selected tradition uses it
```

Drik Panchang explicitly notes sunrise-based Panchanga day handling.
citeturn1search9

The UI should show both where needed.

------------------------------------------------------------------------

# 14. MISSING: EVENT INTERVAL MODEL

Never store only:

``` ts
tithi: "Panchami"
```

Store:

``` ts
{
  name: "Panchami",
  startsAt: "...",
  endsAt: "...",
  source: "calculated"
}
```

Apply this to:

-   Tithi
-   Nakshatra
-   Yoga
-   Karana
-   Rasi
-   Tamil month
-   planetary transit
-   retrograde/direct
-   combustion

------------------------------------------------------------------------

# 15. MISSING: MULTI-EVENT DAY

A single date can contain:

``` text
Tithi A → Tithi B
Nakshatra A → Nakshatra B
Yoga A → Yoga B
Karana A → Karana B → Karana C
```

Display every transition.

Prokerala's Panchang presentation includes transition times for these
elements. citeturn0search11

------------------------------------------------------------------------

# 16. MISSING: FESTIVAL RULE ENGINE

Do not hard-code festival dates.

Create:

``` ts
type FestivalRule = {
  id: string;
  nameTa: string;
  nameEn: string;
  calculate: (context) => FestivalOccurrence[];
};
```

Use:

``` text
tithi
sunrise
sunset
nakshatra where relevant
solar ingress
location
regional convention
```

for festivals such as:

``` text
Puthandu
Ekadashi
Amavasya
Purnima
Pradosham
Shasti
Chaturthi
Sankranti
```

------------------------------------------------------------------------

# 17. MISSING: TAMIL SOLAR MONTH EVENT CALCULATION

Never implement:

``` text
Chithirai = always April 14
```

Use the exact selected solar ingress methodology.

Store:

``` text
month
ingressInstant
localDate
localTime
rasi
calculationProfile
```

------------------------------------------------------------------------

# 18. MISSING: 60-YEAR VALIDATION

Validate the complete 60-name sequence against independent references.

The current reference review confirms the complete sequence including
Vishvavasu (39), Paraabhava (40) and Akshaya (60). citeturn2search1

Tests:

``` ts
expect(names.length).toBe(60);
expect(new Set(names).size).toBe(60);
```

Wrap:

``` text
59 → 60 → 1
60 → 1 → 2
```

------------------------------------------------------------------------

# 19. MISSING: TAMIL CALENDAR LOCATION TESTING

Test:

``` text
Chennai
Madurai
Coimbatore
Tiruchirappalli
Kanyakumari
Singapore
Colombo
London
```

Compare:

-   solar ingress
-   local calendar date
-   local time
-   Tamil month boundary

------------------------------------------------------------------------

# 20. MISSING: CALENDAR RECONCILIATION

If CodePackr differs from a reference:

``` text
CodePackr
Reference A
Reference B
Difference
Possible reason
```

Classify:

``` text
MATCH
ROUNDING
METHOD DIFFERENCE
PROFILE DIFFERENCE
LOCATION DIFFERENCE
TIMEZONE DIFFERENCE
EPHEMERIS DIFFERENCE
TRADITION DIFFERENCE
BUG
UNKNOWN
```

Do not automatically call every difference a bug.

------------------------------------------------------------------------

# 21. MISSING: PRECISION POLICY

Internally retain high precision.

Normal UI:

``` text
Moon: 26°18′17″
```

Advanced technical mode:

``` text
siderealLongitude: ...
tropicalLongitude: ...
ayanamsa: ...
```

Do not display fake precision.

------------------------------------------------------------------------

# 22. MISSING: ANGULAR NORMALIZATION

Implement:

``` ts
normalize360(angle)
angularDistance(a, b)
```

Tests:

``` text
-1° → 359°
360° → 0°
361° → 1°
359° ↔ 1° → 2°
```

This is required for:

-   aspects
-   conjunctions
-   combustion
-   transits
-   retrograde
-   nodes

------------------------------------------------------------------------

# 23. MISSING: ASPECT ENGINE

Separate calculation from UI.

``` ts
getAspects(chart, profile)
```

Return:

``` text
source
target
aspect
orb
applying/separating
rule
```

Keep traditional Vedic aspects separate from optional Western aspects.

------------------------------------------------------------------------

# 24. MISSING: COMBUSTION ENGINE

For each planet:

``` text
Sun separation
threshold
tradition
start
end
```

Do not use an undocumented universal threshold.

------------------------------------------------------------------------

# 25. MISSING: RETROGRADE STATION ENGINE

Calculate:

``` text
stationRetrograde
stationDirect
```

using actual longitudinal velocity.

Test around station dates for:

``` text
Mercury
Venus
Mars
Jupiter
Saturn
```

------------------------------------------------------------------------

# 26. MISSING: ECLIPSE AND MOON-PHASE ENGINE

Support:

``` text
Solar eclipse
Lunar eclipse
New Moon
First Quarter
Full Moon
Last Quarter
```

Where local visibility is shown, calculate actual local circumstances.

Use Moon phases as a cross-check against Amavasya/Purnima/Tithi.

------------------------------------------------------------------------

# 27. MISSING: REGIONAL PANCHANGA PROFILES

Future-ready profiles:

``` text
Tamil Nadu
Sri Lanka Tamil
Singapore Tamil
Kerala
Karnataka
Andhra/Telangana
North India
```

Do not silently assume one regional convention is universal.

------------------------------------------------------------------------

# 28. MISSING: CHART STYLE

Presentation options:

``` text
South Indian
North Indian
East Indian
```

must not change the underlying chart data.

Prokerala and AstroSage both expose chart-style choices.
citeturn0search16turn1search0

------------------------------------------------------------------------

# 29. MISSING: CHART DATA VS INTERPRETATION

Strict architecture:

``` ts
const chart = calculateChart(input, profile);
const interpretation = interpretChart(chart, ruleSet);
```

Never let UI components calculate planetary positions.

------------------------------------------------------------------------

# 30. MISSING: RULESET VERSIONING

Every prediction/report must contain:

``` text
ruleSetVersion
```

Example:

``` text
TamilTraditional-1.0
VedicGeneral-1.0
KP-1.0
```

Old reports must remain reproducible.

------------------------------------------------------------------------

# 31. MISSING: TRADITIONAL RULE REGISTRY

Every rule:

``` ts
{
  ruleId,
  name,
  tradition,
  sourceReference,
  conditions,
  interpretation,
  limitations
}
```

No rule should be added solely because it appears on an astrology blog.

------------------------------------------------------------------------

# 32. MISSING: RULE PRIORITY

Define:

``` text
primary
secondary
supporting
contextual
```

Recommended initial hierarchy:

``` text
Dasa = primary timing
major transit = primary timing
natal chart = foundation
Varga = domain support
Yoga = supporting
generic Moon-sign text = contextual
```

A generic horoscope must never override natal-chart evidence.

------------------------------------------------------------------------

# 33. MISSING: EVIDENCE STRENGTH, NOT PREDICTION PERCENTAGE

Do not show:

``` text
Career 87%
Marriage 92%
```

Use:

``` text
Strong evidence
Moderate evidence
Mixed evidence
Limited evidence
Insufficient evidence
```

This describes the rule-engine evidence rather than pretending to be a
statistical probability.

------------------------------------------------------------------------

# 34. MISSING: MINIMUM PREDICTION EVIDENCE

Every substantive forecast statement requires at least one actual
calculated factor.

Stronger statements should require multiple independent factors:

``` text
Dasa
+
Transit
+
Natal house activation
```

------------------------------------------------------------------------

# 35. MISSING: CONFLICT ENGINE

Example:

``` text
Jupiter supports expansion
Saturn indicates delay
Dasa is mixed
```

Output:

> "வளர்ச்சிக்கான ஆதரவு காணப்பட்டாலும், தாமதம் அல்லது கூடுதல் பொறுப்பு போன்ற காரணிகள்
> இணைந்து காணப்படுகின்றன."

Never output a certainty when the evidence conflicts.

------------------------------------------------------------------------

# 36. MISSING: FORECAST EVENT WINDOWS

Never generate:

``` text
You will get a job on 18 June 2028.
```

Use a period:

``` text
June–September 2028:
Career-related activity may become more prominent under the selected traditional rules.
```

Only report exact event dates for astronomical/calendar events that are
actually calculated.

------------------------------------------------------------------------

# 37. MISSING: FORECAST REFRESH AND VERSION

Display:

``` text
Generated:
2026-09-26

Calculation engine:
...

Rule engine:
...

Profile:
...
```

Old reports should not silently change after engine updates.

------------------------------------------------------------------------

# 38. MISSING: PORUTHAM DETAIL

Mature services expose individual Porutham factors rather than only a
total score. Prokerala's Tamil report lists Dina, Gana, Mahendra, Stree
Deergha, Yoni, Vedha, Rajju, Rasi, Rasiyathipathi and Vasya
individually. citeturn0search93turn0search0

CodePackr should show each:

``` text
Dina
Gana
Mahendra
Stree Deergha
Yoni
Rasi
Rasiyathipathi
Vasya
Rajju
Vedha
```

with:

``` text
status
rule
calculation
explanation
```

Do not show only:

``` text
7.5 / 10
```

------------------------------------------------------------------------

# 39. MISSING: DOSHA TRANSPARENCY

Every Dosha:

``` text
Detected
Not detected
Conditional
Method dependent
```

Show the actual conditions and any traditional cancellation factors.

Avoid fear-based language.

------------------------------------------------------------------------

# 40. MISSING: NAKSHATRA-ONLY VS FULL MATCHING

Clearly separate:

``` text
Nakshatra Porutham
Rasi Porutham
Full Jathaga Porutham
```

A star-only match must never be presented as equivalent to full-chart
analysis.

------------------------------------------------------------------------

# 41. MISSING: SADESATI ENGINE

Calculate:

``` text
Saturn 12th from natal Moon
Saturn over natal Moon
Saturn 2nd from natal Moon
```

Return:

``` text
start
middle
end
current phase
remaining
```

Use exact Saturn transit dates.

Sade Sati is exposed as a separate analysis by mature services such as
AstroSage and Prokerala. citeturn1search2turn1search11

------------------------------------------------------------------------

# 42. MISSING: SPECIAL TRANSIT REPORTS

Provide:

``` text
Jupiter Transit
Saturn Transit
Rahu-Ketu Transit
```

with:

-   previous position
-   current position
-   next position
-   ingress
-   retrograde
-   exact dates
-   natal relationship
-   Dasa interaction

Do not interpret transit sign alone.

------------------------------------------------------------------------

# 43. MISSING: VARSHAPHAL SEPARATION

If annual prediction is added, decide explicitly whether it uses:

``` text
Vimshottari + Gochara
```

or:

``` text
Varshaphal/Tajika
```

Do not mix them silently.

AstroSage exposes Varshphal/Year Analysis as a distinct system.
citeturn1search8

------------------------------------------------------------------------

# 44. MISSING: KP SEPARATION

If KP is added later, it must be its own system:

``` text
KP Ayanamsa
Cusps
Sub Lords
Significators
KP timing
```

Do not mix KP logic into the standard Parashari engine.

------------------------------------------------------------------------

# 45. MISSING: LAL KITAB SEPARATION

If Lal Kitab is added later, it must be a separate tradition/rule set.

Do not combine its remedies or interpretations with Parashari logic.

AstroSage exposes Lal Kitab separately. citeturn1search2turn1search8

------------------------------------------------------------------------

# 46. MISSING: REMEDY ENGINE

If remedies are offered:

``` text
traditional source
reason
applicable factor
traditional explanation
limitations
```

Never promise that a remedy guarantees an outcome.

Do not turn remedies into automatic commercial product promotion.

------------------------------------------------------------------------

# 47. MISSING: GEMSTONE ENGINE

If gemstones are added:

``` text
traditional recommendation
rule
reason
caution
```

Separate traditional interpretation from commercial selling.

------------------------------------------------------------------------

# 48. MISSING: FORECAST GRANULARITY

Use:

### 1 year

``` text
month
Dasa
major transit
domain
evidence
```

### 3 years

``` text
quarter/year
Dasa
major transit
domain
```

### 5 years

``` text
year
major Dasa
major transit
domain
```

### 10 years

``` text
major phases
```

### 20 years

``` text
life-cycle themes
```

### 60 years

``` text
Tamil year
Samvatsara
age
Dasa
major transit
broad themes
```

Do not fabricate monthly predictions decades ahead.

------------------------------------------------------------------------

# 49. MISSING: PAST-EVENT VALIDATION

Create a future optional feature:

``` text
Test my chart against past events
```

The user enters known dated events.

The system evaluates whether selected traditional rules would have
highlighted those periods.

This is for rule-engine evaluation, not scientific proof.

------------------------------------------------------------------------

# 50. MISSING: REFERENCE DATASET

Create synthetic/reference fixtures covering:

-   Rasi boundaries
-   Nakshatra boundaries
-   Pada boundaries
-   Navamsa boundaries
-   D60 boundaries
-   Dasa transitions
-   transit stations
-   Tamil month ingress
-   60-year cycle wrap
-   historical dates
-   leap dates
-   midnight
-   sunrise
-   sunset

Never use customer birth data as public fixtures.

------------------------------------------------------------------------

# 51. MISSING: CROSS-SITE COMPARISON PROTOCOL

Compare CodePackr against:

``` text
Drik Panchang
Prokerala
AstroSage
```

only after matching:

``` text
date
time
location
timezone
ayanamsa
node mode
house system
calendar tradition
```

Then classify every difference:

``` text
MATCH
ROUNDING
METHOD DIFFERENCE
PROFILE DIFFERENCE
LOCATION DIFFERENCE
TIMEZONE DIFFERENCE
EPHEMERIS DIFFERENCE
TRADITION DIFFERENCE
BUG
UNKNOWN
```

Do not scrape competitors and treat them as ground truth.

------------------------------------------------------------------------

# 52. MISSING: CALCULATION VALIDATION DASHBOARD

Create development-only:

``` text
/dev/astro-validation
```

Show:

``` text
test
input
profile
expected
actual
difference
tolerance
reference
status
```

Filters:

``` text
Lagna
Sun
Moon
Tamil Calendar
Tithi
Nakshatra
Dasa
Transit
Varga
```

------------------------------------------------------------------------

# 53. MISSING: REFERENCE FIXTURES

Create:

``` text
tests/fixtures/
  panchang/
  charts/
  tamil-calendar/
  dasha/
  transits/
  boundaries/
```

Example:

``` json
{
  "name": "Tamil solar ingress boundary",
  "date": "...",
  "location": "...",
  "profile": "...",
  "expected": {}
}
```

------------------------------------------------------------------------

# 54. MISSING: USER-FACING CALCULATION CARD

Every Jathagam should show:

``` text
கணக்கீட்டு முறை

பிறந்த இடம்:
...

நேர மண்டலம்:
...

அயனாம்சம்:
Lahiri / Chitrapaksha

ராசி முறை:
Sidereal

ராகு/கேது:
Mean Node

பாவ முறை:
Whole Sign

பஞ்சாங்க முறை:
...

Ephemeris:
...

Calculation version:
...
```

Include:

``` text
View technical details
```

------------------------------------------------------------------------

# 55. MISSING: "WHY THIS RESULT?" UI

Every important forecast should expose:

``` text
ஏன் இந்த விளக்கம்?
```

Show:

``` text
Natal factor
Dasa factor
Transit factor
Varga factor
Yoga/rule
Conflicting factor
Period
```

This is one of the most important customer-trust features.

------------------------------------------------------------------------

# 56. MISSING: CALCULATION RECEIPT

After generating Jathagam:

``` text
✓ Birth date verified
✓ Birth time verified
✓ Location verified
✓ Timezone resolved
✓ Ephemeris loaded
✓ Ayanamsa selected
✓ Chart generated
✓ Dasa generated
✓ Varga generated
✓ Report generated
```

This should mean calculation completed, not that future events are
guaranteed.

------------------------------------------------------------------------

# 57. MISSING: BOUNDARY WARNING

If a result is close to a boundary:

``` text
29°59′59″
```

show:

``` text
Boundary-sensitive
```

Especially for:

-   Rasi
-   Nakshatra
-   Pada
-   Varga
-   Bhava

------------------------------------------------------------------------

# 58. MISSING: "WHAT CAN CHANGE?" PANEL

Example:

``` text
Stable:
Moon sign

Moderately sensitive:
Lagna

Highly sensitive:
D60
```

This is valuable when the birth time is uncertain.

------------------------------------------------------------------------

# 59. MISSING: ERROR STATES

Use specific errors:

``` text
Birth time missing
Location ambiguous
Timezone unavailable
Historical timezone uncertain
Ephemeris unavailable
Calculation profile unavailable
Insufficient prediction evidence
```

Do not show only:

``` text
Something went wrong.
```

------------------------------------------------------------------------

# 60. MISSING: REPORT HASH

Generate:

``` text
reportCalculationHash
```

from:

``` text
birth data
location
timezone
profile
ephemeris version
rule version
```

Support can use this internally to reproduce the report.

------------------------------------------------------------------------

# 61. MISSING: PRIVACY

Birth information must not enter advertising analytics.

Rules:

-   no DOB/time/location in analytics payloads;
-   no birth data in ordinary error logs;
-   redact support logs;
-   avoid full birth data in URLs;
-   use opaque report IDs;
-   provide history/report deletion;
-   encrypt stored reports if server storage is introduced.

------------------------------------------------------------------------

# 62. MISSING: REPORT SHARING

Prefer:

``` text
/report/<opaque-id>
```

not:

``` text
/report?dob=...
```

Use permission controls for shared reports.

------------------------------------------------------------------------

# 63. MISSING: AI SAFETY ARCHITECTURE

If AI is used:

``` text
CALCULATED STRUCTURED DATA
        ↓
RULE ENGINE
        ↓
EVIDENCE OBJECT
        ↓
AI NARRATIVE
        ↓
FACT VALIDATOR
        ↓
USER
```

Never:

``` text
AI → invent planetary positions → user
```

Validate:

-   planet names
-   degrees
-   dates
-   Dasa periods
-   Tamil dates
-   transits
-   Yogas
-   profile
-   unsupported certainty claims

------------------------------------------------------------------------

# 64. FINAL CUSTOMER-ACCURACY ARCHITECTURE

``` text
USER INPUT
    ↓
LOCATION VALIDATION
    ↓
HISTORICAL TIMEZONE
    ↓
UTC / ASTRONOMICAL TIME
    ↓
EPHEMERIS
    ↓
TROPICAL POSITIONS
    ↓
AYANAMSA
    ↓
SIDEREAL POSITIONS
    ↓
LAGNA / HOUSES
    ↓
NAKSHATRA / PADA
    ↓
VARGAS
    ↓
PANCHANGA
    ↓
DASA
    ↓
TRANSITS
    ↓
ASHTAKAVARGA / SHADBALA / YOGAS
    ↓
TRADITIONAL RULE ENGINE
    ↓
EVIDENCE ENGINE
    ↓
CONFLICT ENGINE
    ↓
DOMAIN FORECAST
    ↓
LANGUAGE GENERATION
    ↓
FACTUAL VALIDATOR
    ↓
CUSTOMER REPORT
```

------------------------------------------------------------------------

# 65. DEVELOPMENT GATES

## Gate 0 --- Architecture

-   [ ] calculation modules separated
-   [ ] calculation profile
-   [ ] versioning
-   [ ] rule registry
-   [ ] source registry

## Gate 1 --- Input

-   [ ] date
-   [ ] time
-   [ ] seconds
-   [ ] location
-   [ ] latitude
-   [ ] longitude
-   [ ] timezone
-   [ ] historical timezone
-   [ ] DST
-   [ ] elevation
-   [ ] birth-time quality

## Gate 2 --- Astronomy

-   [ ] ephemeris benchmark
-   [ ] angular normalization
-   [ ] circular difference
-   [ ] planetary longitude
-   [ ] retrograde
-   [ ] station
-   [ ] eclipse
-   [ ] Moon phases

## Gate 3 --- Panchanga

-   [ ] sunrise
-   [ ] sunset
-   [ ] moonrise
-   [ ] moonset
-   [ ] Tithi transitions
-   [ ] Nakshatra transitions
-   [ ] Yoga transitions
-   [ ] Karana transitions
-   [ ] Rahu Kalam
-   [ ] Yamagandam
-   [ ] Gulikai
-   [ ] Muhurtha
-   [ ] Tamil month

## Gate 4 --- Tamil Calendar

-   [ ] 60 names
-   [ ] anchor validation
-   [ ] cycle wrap
-   [ ] Chithirai
-   [ ] all 12 months
-   [ ] Gregorian conversion
-   [ ] location/timezone validation
-   [ ] 60-year navigation

## Gate 5 --- Jathagam

-   [ ] D1
-   [ ] Lagna
-   [ ] Rasi
-   [ ] Grahas
-   [ ] Nakshatra
-   [ ] Pada
-   [ ] D9
-   [ ] D10
-   [ ] D60
-   [ ] supported Vargas
-   [ ] houses
-   [ ] aspects
-   [ ] dignity
-   [ ] combustion
-   [ ] retrograde
-   [ ] nodes

## Gate 6 --- Dasa

-   [ ] Vimshottari
-   [ ] Antardasa
-   [ ] Pratyantardasa
-   [ ] balance at birth
-   [ ] boundary validation
-   [ ] reference comparison

## Gate 7 --- Advanced astrology

-   [ ] Ashtakavarga
-   [ ] Shadbala
-   [ ] Bhavabala
-   [ ] Yogas
-   [ ] Doshas
-   [ ] Sade Sati
-   [ ] Jupiter transit
-   [ ] Saturn transit
-   [ ] Rahu/Ketu transit

## Gate 8 --- Prediction

-   [ ] evidence
-   [ ] conflicts
-   [ ] support levels
-   [ ] domain rules
-   [ ] 1-year
-   [ ] 3-year
-   [ ] 5-year
-   [ ] 10-year
-   [ ] 20-year
-   [ ] 60-year
-   [ ] no invented events
-   [ ] no certainty claims

## Gate 9 --- Customer transparency

-   [ ] Calculation Method
-   [ ] Why this result?
-   [ ] Calculation receipt
-   [ ] profile display
-   [ ] version display
-   [ ] correction workflow
-   [ ] sensitivity warning

## Gate 10 --- Production

-   [ ] unit tests
-   [ ] golden tests
-   [ ] boundary tests
-   [ ] cross-site comparison
-   [ ] real-device tests
-   [ ] PDF tests
-   [ ] privacy tests
-   [ ] performance tests
-   [ ] error-state tests

------------------------------------------------------------------------

# 66. FINAL DECISIONS REQUIRED BEFORE CODING

The coding agent must not invent these decisions:

1.  Default Ayanamsa
2.  Mean or True Rahu/Ketu
3.  Default house system
4.  Default Tamil Panchanga method
5.  Whether Vakya is supported
6.  Production ephemeris
7.  Astronomical reference benchmark
8.  Historical timezone source
9.  Location/geocoder source
10. Birth-time precision policy
11. Production Varga list
12. Production Dasa convention
13. Source for each Yoga rule
14. Source for each Dosha rule
15. Default prediction system
16. Whether Varshaphal is separate
17. Whether KP is separate
18. Whether Lal Kitab is separate
19. Regional Panchanga profiles
20. PDF calculation snapshot
21. Report versioning
22. Customer correction workflow

If a decision is unknown:

``` text
DECISION REQUIRED
```

Do not silently guess.

------------------------------------------------------------------------

# 67. FINAL PRODUCT STANDARD

The goal is not:

> "Add more astrology pages."

The goal is:

> **When two users enter the same birth data, location, time and
> calculation profile, CodePackr must reproduce the same calculation
> every time, and the customer must be able to understand how the result
> was produced.**

The quality model is:

``` text
EXPLICIT METHOD
+
REPRODUCIBLE CALCULATION
+
REFERENCE VALIDATION
+
BOUNDARY TESTING
+
TRADITION-SPECIFIC RULES
+
EVIDENCE TRACE
+
CUSTOMER TRANSPARENCY
```

That is the development standard.


---

# FINAL DEVELOPMENT LOCK — CODEPACKR ASTRO

**Status:** FINAL MASTER DEVELOPMENT SPECIFICATION  
**Project:** `astro.codepackr.com`  
**Repository:** `coolnaveen99/codepackr-astro`  
**Supersedes:** `CODEPACKR-ASTRO-ACCURACY-CALENDAR-PREDICTION-FINAL-V2-PRE-DEVELOPMENT.md` as the execution document  
**Purpose:** This section is the final authority for implementation decisions. If an earlier section contains a `DECISION REQUIRED`, `TBD`, or conflicting default, the decisions below take precedence.

## FINAL DECISION 1 — Product accuracy policy

CodePackr Astro will optimize for:

1. reproducible astronomical/calendar calculations;
2. explicit traditional astrology methodology;
3. deterministic rule execution;
4. traceable evidence;
5. transparent uncertainty;
6. consistent Tamil calendar results;
7. regression-tested outputs.

It will **not** claim that astrological predictions are scientifically proven or guaranteed.

Customer-facing Tamil wording:

> கணக்கீடுகள் தேர்ந்தெடுக்கப்பட்ட வானியல் மற்றும் காலக் கணக்கீட்டு முறைகளுடன் சரிபார்க்கப்பட்டவை. ஜோதிட விளக்கங்கள் தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய ஜோதிட விதிமுறைகளின் அடிப்படையில் வழங்கப்படுகின்றன.

---

# FINAL DECISION 2 — Production calculation profile

The initial production profile is:

```ts
type ProductionCalculationProfile = {
  zodiac: "sidereal";
  ayanamsa: "lahiri";
  nodeMode: "mean";
  houseSystem: "whole-sign";
  panchangaMethod: "thirukanitham-oriented";
  dashaSystem: "vimshottari";
  ephemeris: "swiss-ephemeris";
  timezoneSource: "iana-tzdb";
};
```

### Important

This is the **default production profile**, not a claim that every astrological tradition uses the same method.

Advanced users may compare supported profiles.

The calculation profile must be stored with every generated report.

---

# FINAL DECISION 3 — Ayanamsa

Default:

**Lahiri / Chitrapaksha**

Supported architecture:

- Lahiri
- Raman
- KP
- future/custom profiles only when independently implemented and validated

Rules:

- one selected Ayanamsa must be used consistently for a calculation;
- Rasi, Nakshatra, Pada, Dasa, Gochara and Vargas must not silently use different Ayanamsas;
- every result stores the Ayanamsa identifier and numerical value;
- comparison mode may show how results change under another Ayanamsa.

Do not label an approximation as an exact traditional implementation.

---

# FINAL DECISION 4 — Rahu/Ketu

Default:

**Mean Node**

Support:

**True Node**

The selected mode must be visible in advanced calculation details.

Validation:

```text
Rahu longitude + 180° = Ketu longitude
```

within configured numerical tolerance.

Never mix Mean Node and True Node in one report.

---

# FINAL DECISION 5 — House system

Default:

**Whole Sign**

The house system is part of the calculation profile.

Future support may include:

- Equal
- Sripati
- Placidus
- other explicitly documented systems

No house system may be silently changed between chart, transit and interpretation modules.

---

# FINAL DECISION 6 — Tamil Panchanga method

Initial production profile:

**Thirukanitham-oriented Tamil calendar/Panchanga calculation.**

Important:

- this does not mean every traditional Tamil Panchanga follows identical rules;
- regional conventions must remain configurable;
- Vakya must not be simulated using a generic approximation.

### Vakya

Vakya support is **deferred until a genuine, documented Vakya computational method/data source is selected and validated**.

Until then:

```text
Do not label the current engine "Vakya".
```

---

# FINAL DECISION 7 — Ephemeris

Production astronomy:

**Swiss Ephemeris**

The implementation must record:

- engine/version;
- ephemeris data/version;
- calculation flags;
- coordinate system;
- sidereal mode;
- generated timestamp.

### Benchmark

Use authoritative astronomical references such as:

- JPL Horizons;
- appropriate JPL DE ephemeris datasets;
- IAU SOFA routines where applicable.

Benchmarking is validation; the benchmark source is not automatically the production runtime.

### Licensing

Before public/commercial deployment, verify and document the applicable Swiss Ephemeris licensing obligations for the selected integration.

---

# FINAL DECISION 8 — Time and timezone

Use:

**IANA Time Zone Database**

Every birth calculation must resolve:

```text
local civil time
→ historical timezone rule
→ UTC
→ astronomical time representation
→ ephemeris
```

Never use the current UTC offset for a historical birth when the historical offset differs.

Historical DST must be respected where applicable.

---

# FINAL DECISION 9 — Location

The location service must return:

```ts
type VerifiedLocation = {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  timezone: string;
  utcOffsetAtInstant: number;
  source: string;
  confidence: "high" | "medium" | "low";
};
```

Rules:

- no silent Chennai fallback;
- same-name places require disambiguation;
- latitude/longitude must be validated;
- timezone must be validated;
- location provenance must be stored;
- user-selected coordinates override ambiguous search results.

The geocoder/provider must be isolated behind an adapter so it can be changed without changing the astronomy engine.

---

# FINAL DECISION 10 — Birth-time precision

Support:

```text
Exact
Approximate
Rounded
Unknown
```

If the time is approximate or rounded, perform sensitivity analysis.

At minimum test:

```text
T - 5 minutes
T
T + 5 minutes

T - 10 minutes
T
T + 10 minutes
```

Evaluate:

- Lagna;
- Bhava;
- D9;
- D10;
- D60;
- Dasa balance;
- boundary-sensitive events.

Return:

```text
Stable
Moderately sensitive
Highly sensitive
```

Never manufacture precision that the input does not support.

---

# FINAL DECISION 11 — Birth-time rectification

Birth-time rectification is **not part of the initial production release**.

If implemented later:

- original birth time remains immutable;
- rectified time is stored separately;
- user explicitly starts rectification;
- known dated life events are required;
- the system shows the evidence and method;
- the original input is never silently replaced.

---

# FINAL DECISION 12 — Tamil solar calendar

Tamil months are calculated from **solar sidereal ingress**, not a static Gregorian-date table.

Required:

- exact ingress instant;
- local date/time;
- Rasi;
- Tamil month;
- Tamil day;
- calculation profile;
- timezone;
- source/engine version.

Example:

```text
Sun enters Mesha
→ Chithirai begins
```

The engine must not assume:

```text
Chithirai 1 = April 14
```

for every year.

---

# FINAL DECISION 13 — 60-year Tamil cycle

The 60 Samvatsara names are canonical application data.

The engine must:

- contain exactly 60 names;
- contain no duplicates;
- preserve order;
- calculate cycle wrap;
- support previous and future cycles;
- validate the anchor;
- derive the Tamil-year association from the actual Tamil-year boundary.

Required regression tests include:

```text
39 → Vishvavasu
40 → Parabhava
60 → Akshaya
60 → 1
1 → 2
```

The calendar must not determine the Samvatsara merely from the Gregorian January year.

---

# FINAL DECISION 14 — Panchangam

Panchangam is an **event/interval engine**, not a daily label engine.

Every transition uses:

```ts
type AstroInterval = {
  name: string;
  startsAt: string;
  endsAt: string;
  source: "calculated";
  profileId: string;
};
```

This applies to:

- Tithi;
- Nakshatra;
- Yoga;
- Karana;
- Rasi;
- Tamil month;
- planetary ingress;
- retrograde/direct;
- combustion where implemented.

A single civil day may contain multiple transitions.

The UI must show all relevant transitions.

---

# FINAL DECISION 15 — Sunrise/sunset

Sunrise and sunset are calculated from:

- date;
- coordinates;
- timezone;
- astronomical model;
- configured refraction convention;
- elevation where supported.

No fake fallback times.

If the event cannot be calculated:

```text
status = unavailable
```

The UI must explain why.

Panchanga day and civil calendar day must remain distinct.

---

# FINAL DECISION 16 — Astronomy calculation precision

Internal calculations use high precision.

Display:

```text
Normal:
degree + minute + second

Advanced:
decimal degrees
```

Do not display meaningless digits.

All angular values must use normalized `0..360` representation internally.

Required utility:

```ts
normalize360(value)
angularDistance(a, b)
```

Boundary tests:

```text
-1   → 359
360  → 0
361  → 1
359/1 → distance 2°
```

---

# FINAL DECISION 17 — Chart calculation

The chart engine is deterministic.

Architecture:

```text
Input
→ Location
→ Historical timezone
→ UTC/astronomical time
→ Ephemeris
→ Sidereal conversion
→ Lagna
→ Houses
→ Grahas
→ Nakshatra/Pada
→ Vargas
→ Dasa
→ Structured Chart
```

The UI never calculates astrology.

Use:

```ts
const chart = calculateChart(input, profile);
const interpretation = interpretChart(chart, ruleSet);
```

---

# FINAL DECISION 18 — Vargas

Keep the existing D1–D60 feature set, but do not declare it production-validated until:

- every Varga formula has unit tests;
- sign-boundary cases are tested;
- degree `0°`;
- exact sign boundary;
- degree near `30°`;
- divisional boundary;
- cross-reference golden cases

all pass.

D60 is treated as especially birth-time sensitive.

---

# FINAL DECISION 19 — Vimshottari Dasa

Initial system:

**Vimshottari Dasa**

The exact year/day convention used by the engine must be documented and benchmarked against the selected reference implementation.

Do not hide the convention.

Store:

```ts
{
  mahaDasa,
  antaraDasa,
  start,
  end,
  remainingAtBirth,
  calculationConvention,
  profileId
}
```

Dasa dates are calculation outputs and must never be generated by AI.

---

# FINAL DECISION 20 — Transits

Transit calculations are event-based.

For each major planet:

- previous ingress;
- current sign;
- next ingress;
- retrograde start;
- retrograde end;
- station points;
- exact event time;
- natal relationship;
- selected profile.

Special reports:

```text
Jupiter
Saturn
Rahu/Ketu
```

Sade Sati:

```text
Saturn 12th from natal Moon
Saturn over natal Moon
Saturn 2nd from natal Moon
```

Show start/current/end/remaining where applicable.

---

# FINAL DECISION 21 — Aspect engine

Aspects must be system-specific.

Do not mix:

```text
Vedic aspects
Western aspects
```

without explicitly selecting the system.

Each aspect must store:

```ts
{
  sourcePlanet,
  targetPlanet,
  aspectType,
  exactAngle,
  orb,
  applyingOrSeparating,
  ruleId,
  tradition
}
```

---

# FINAL DECISION 22 — Combustion and retrograde

### Retrograde

Use actual longitudinal velocity/station detection.

### Combustion

Do not use one undocumented universal threshold.

Store:

```text
planet
Sun separation
threshold
tradition
ruleId
start
end
```

The interpretation engine consumes the selected rule; the astronomy engine only provides the calculated quantities.

---

# FINAL DECISION 23 — Yogas and Doshas

Create a centralized registry.

```ts
type AstrologyRule = {
  ruleId: string;
  name: string;
  tradition: string;
  sourceReference: string;
  priority: "primary" | "secondary" | "supporting" | "contextual";
  conditions: unknown;
  interpretation: unknown;
  limitations: string[];
};
```

No Yoga or Dosha enters production merely because it appears on an astrology blog.

Each rule must have:

- source;
- conditions;
- exclusions;
- cancellation/exception rules where applicable;
- test cases;
- version.

Dosha output:

```text
Detected
Not detected
Conditional
Method dependent
```

Avoid fear-based wording.

---

# FINAL DECISION 24 — Porutham

Tamil marriage matching must show individual factors.

Minimum:

1. Dina
2. Gana
3. Mahendra
4. Stree Deergha
5. Yoni
6. Rasi
7. Rasiyathipathi
8. Vasya
9. Rajju
10. Vedha

Do not reduce the complete explanation to a single score.

Clearly distinguish:

```text
Nakshatra-only matching
Rasi matching
Full traditional Jathaga matching
```

---

# FINAL DECISION 25 — Prediction engine

Prediction is **rule-driven**, not template-driven.

Architecture:

```text
Calculated Chart
      ↓
Dasa
      ↓
Transit
      ↓
Natal Factors
      ↓
Varga Support
      ↓
Yoga/Dosha Rules
      ↓
Evidence Engine
      ↓
Conflict Engine
      ↓
Traditional Interpretation
      ↓
AI Language Layer
      ↓
Factual Validator
```

Every substantive prediction must contain machine-readable evidence.

Minimum evidence:

```text
at least one calculated factor
```

Stronger interpretation should use multiple independent factors where available.

---

# FINAL DECISION 26 — Prediction confidence language

Do not use:

```text
Career: 87%
Marriage: 93%
Success: 100%
```

Use:

```text
Strong
Moderate
Mixed
Limited
Insufficient evidence
```

These are **evidence-strength descriptions**, not probabilities of future events.

If factors conflict:

```text
Positive factor
+
Restraining factor
=
Mixed interpretation
```

Never force a positive or negative conclusion when the rule evidence conflicts.

---

# FINAL DECISION 27 — Forecast horizons

Supported:

```text
1 year
3 years
5 years
10 years
20 years
60 years
```

Granularity:

| Horizon | Output |
|---|---|
| 1 year | monthly |
| 3 years | quarterly/yearly |
| 5 years | yearly |
| 10 years | major phases |
| 20 years | lifecycle themes |
| 60 years | broad Tamil-year/Dasa/transit themes |

Do not fabricate exact events decades in advance.

Exact dates are reserved for calculated astronomical/calendar events.

Traditional future interpretations use windows/phases rather than false exactness.

---

# FINAL DECISION 28 — Varshaphal, KP and Lal Kitab

These systems are **separate modules**.

### Initial release

Use:

```text
Parashari-style Vedic calculation/rule profile
+
Vimshottari
+
Gochara
```

### Later

Varshaphal/Tajika may be added as a separate system.

KP may be added as a separate system with:

- KP Ayanamsa;
- cusps;
- sub-lords;
- significators;
- KP timing rules.

Lal Kitab may be added as a separate rule system.

Never mix their rules into the default Parashari engine.

---

# FINAL DECISION 29 — Remedies and gemstones

Not required for the first accuracy release.

If added later:

- identify traditional source;
- identify rule;
- explain rationale;
- state limitations;
- never guarantee outcomes;
- do not create commercial recommendations merely to sell products/services.

---

# FINAL DECISION 30 — Eclipse and Moon-phase engine

Support:

- New Moon;
- First Quarter;
- Full Moon;
- Last Quarter;
- solar eclipses;
- lunar eclipses;
- local visibility where data permits.

Cross-check:

```text
Amavasya
Purnima
Tithi
Moon phase
```

The eclipse calculation and traditional interpretation remain separate.

---

# FINAL DECISION 31 — Regional Panchanga profiles

Architecture must support:

```text
Tamil Nadu
Sri Lankan Tamil
Singapore Tamil
Kerala
Karnataka
Andhra/Telangana
North India future profile
```

Do not assume the Tamil Nadu convention is universal.

The selected regional profile must be visible in advanced calculation details.

---

# FINAL DECISION 32 — Chart presentation

Support presentation styles without changing calculation data:

```text
South Indian
North Indian
East Indian
```

Underlying structured chart data must remain identical.

---

# FINAL DECISION 33 — Evidence and “Why this result?”

Every major prediction/report section must expose:

```text
Natal factor
Dasa factor
Transit factor
Varga factor
Yoga/rule
Conflicting factor
Forecast period
Traditional interpretation
```

Customer-facing expandable section:

> **இந்த முடிவு ஏன்? / Why this result?**

This is a core trust feature, not optional decoration.

---

# FINAL DECISION 34 — Calculation receipt

Each report stores a calculation receipt:

```text
Input verified
Location verified
Historical timezone resolved
Ephemeris selected
Ayanamsa selected
Chart calculated
Dasa calculated
Vargas calculated
Transit calculated
Rule-set applied
Report generated
```

This confirms that the calculation pipeline completed.

It does **not** mean a future event is guaranteed.

---

# FINAL DECISION 35 — Report versioning

Every report must store:

```ts
{
  calculationVersion,
  engineVersion,
  ephemerisVersion,
  profileId,
  ruleSetVersion,
  generatedAt,
  reportCalculationHash
}
```

Old reports must not silently change when the engine is upgraded.

If a calculation algorithm changes, create a new version.

---

# FINAL DECISION 36 — Calculation hash

Create a deterministic hash from:

```text
birth date/time
location
timezone
elevation
calculation profile
ephemeris version
algorithm version
rule-set version
```

Example:

```ts
reportCalculationHash
```

The hash helps detect whether two reports were generated from the same calculation inputs and versions.

---

# FINAL DECISION 37 — AI safety architecture

AI receives only structured calculated data and evidence.

```text
CALCULATION
→ STRUCTURED DATA
→ RULE ENGINE
→ EVIDENCE
→ AI NARRATIVE
→ FACTUAL VALIDATOR
→ CUSTOMER
```

The AI must not invent:

- planetary positions;
- Dasa dates;
- Tithi;
- Nakshatra;
- Tamil dates;
- Yoga;
- Dosha;
- transit dates;
- astronomical events.

The factual validator must reject unsupported claims.

---

# FINAL DECISION 38 — Privacy

Never put birth information into:

- analytics events;
- error logs;
- URLs;
- public report IDs;
- search-engine-indexable content.

Use:

```text
opaque report ID
```

for shared reports.

Provide deletion capability for stored personal birth data.

---

# FINAL DECISION 39 — Validation dashboard

Create:

```text
/dev/astro-validation
```

Columns:

```text
Test
Input
Profile
Expected
Actual
Difference
Tolerance
Reference
Status
```

Filters:

- astronomy;
- timezone;
- Panchanga;
- Tamil calendar;
- Lagna;
- Nakshatra;
- Varga;
- Dasa;
- transit;
- Porutham;
- prediction evidence.

Production users must not need access to this dashboard.

---

# FINAL DECISION 40 — Reference fixtures

Create:

```text
tests/fixtures/
├── astronomy/
├── timezone/
├── sunrise/
├── panchanga/
├── tamil-calendar/
├── samvatsara/
├── charts/
├── varga/
├── dasha/
├── transits/
├── porutham/
└── boundaries/
```

Fixtures must use:

- synthetic data;
- public reference dates;
- documented reference charts;
- non-sensitive examples.

Never use customer birth data as public test fixtures.

---

# FINAL DECISION 41 — Cross-reference testing

Compare CodePackr with external references only after matching:

```text
date
time
location
historical timezone
Ayanamsa
node mode
house system
Panchanga convention
regional profile
```

Every difference is classified:

```text
MATCH
ROUNDING
METHOD DIFFERENCE
PROFILE DIFFERENCE
LOCATION DIFFERENCE
TIMEZONE DIFFERENCE
EPHEMERIS DIFFERENCE
TRADITION DIFFERENCE
BUG
UNKNOWN
```

Do not automatically treat another site's result as ground truth.

---

# FINAL DECISION 42 — Production quality gates

No phase is complete merely because the website builds.

## Gate 0 — Architecture

- [ ] Existing engine audited
- [ ] Duplicate calculations identified
- [ ] Calculation profile implemented
- [ ] Versioning implemented

## Gate 1 — Input

- [ ] Date/time validation
- [ ] Location validation
- [ ] Historical timezone
- [ ] DST
- [ ] Elevation
- [ ] Birth-time quality

## Gate 2 — Astronomy

- [ ] Ephemeris validated
- [ ] Sun/Moon validated
- [ ] Planet positions validated
- [ ] Node mode validated
- [ ] Sidereal conversion validated
- [ ] Angular utilities tested

## Gate 3 — Panchanga

- [ ] Tithi transitions
- [ ] Nakshatra transitions
- [ ] Yoga transitions
- [ ] Karana transitions
- [ ] Sunrise/sunset
- [ ] Moonrise/moonset
- [ ] Rahu Kalam
- [ ] Yamagandam
- [ ] Gulikai
- [ ] boundary tests

## Gate 4 — Tamil calendar

- [ ] Solar ingress
- [ ] Tamil months
- [ ] Chithirai 1
- [ ] 60-year cycle
- [ ] Gregorian/Tamil conversion
- [ ] regional profiles

## Gate 5 — Jathagam

- [ ] Rasi
- [ ] Lagna
- [ ] Bhava
- [ ] Nakshatra
- [ ] Pada
- [ ] D1
- [ ] D9
- [ ] D10
- [ ] D60
- [ ] remaining Vargas

## Gate 6 — Dasa

- [ ] Vimshottari
- [ ] Maha Dasa
- [ ] Antardasa
- [ ] balance at birth
- [ ] reference validation

## Gate 7 — Advanced astrology

- [ ] Gochara
- [ ] Sade Sati
- [ ] Ashtakavarga
- [ ] Shadbala
- [ ] Yogas
- [ ] Doshas
- [ ] Porutham
- [ ] aspect engine
- [ ] retrograde
- [ ] combustion

## Gate 8 — Prediction

- [ ] rule registry
- [ ] evidence engine
- [ ] conflict engine
- [ ] domain forecasts
- [ ] time windows
- [ ] long-horizon rules
- [ ] no unsupported certainty

## Gate 9 — Customer transparency

- [ ] calculation details
- [ ] why-this-result
- [ ] sensitivity warning
- [ ] boundary warning
- [ ] calculation receipt
- [ ] report version
- [ ] Tamil language review

## Gate 10 — Production

- [ ] regression suite
- [ ] PDF snapshot validation
- [ ] print validation
- [ ] mobile validation
- [ ] privacy validation
- [ ] performance validation
- [ ] accessibility validation
- [ ] error-state validation
- [ ] report hash validation

---

# FINAL DECISION 43 — Existing Astro features

Do not remove working features.

Preserve:

```text
Jathagam
Panchangam
Gochara
Daily Rasi
Chandrashtama
Nakshatra
Porutham
Numerology
Prasna
Biodata
D1–D60
Vimshottari Dasa
1-page Jathagam
6-page Jatham
30-page Jathatgam
Print
PDF
Mobile UX
```

Refactor their calculation dependencies to use the centralized engine.

Do not maintain multiple independent implementations of the same astronomical calculation.

---

# FINAL DECISION 44 — Dark mode

Dark mode remains:

```text
DISABLED / DEFERRED
```

Do not reintroduce it during Astro accuracy work.

---

# FINAL DECISION 45 — Development sequence

The coding agent must implement in this order:

```text
1. Audit existing code
2. Freeze calculation profile
3. Build/validate astronomy foundation
4. Fix time/location
5. Build event-based Panchanga
6. Build Tamil calendar
7. Validate 60-year cycle
8. Validate Jathagam
9. Validate Vargas
10. Validate Vimshottari
11. Validate Gochara
12. Build advanced astrology rules
13. Build Porutham
14. Build evidence engine
15. Build prediction engine
16. Build report/versioning system
17. Add AI narrative layer
18. Run complete regression suite
19. Validate PDF/print/mobile
20. Production release
```

**Do not reverse this order by writing prediction content first.**

---

# FINAL CODING-AGENT COMMAND

Use the following instruction as the implementation prompt:

> Act as the senior astronomical-calculation, calendar, traditional-astrology and TypeScript engineering lead for CodePackr Astro.
>
> Repository: `coolnaveen99/codepackr-astro`
>
> Read this entire document before modifying the repository.
>
> First audit the existing implementation. Preserve working features and avoid creating duplicate calculation engines.
>
> The production default calculation profile is:
>
> - Sidereal zodiac
> - Lahiri/Chitrapaksha Ayanamsa
> - Mean Rahu/Ketu
> - Whole Sign houses
> - Thirukanitham-oriented Tamil Panchanga/calendar
> - Vimshottari Dasa
> - Swiss Ephemeris production astronomy
> - IANA historical timezone data
>
> Do not silently change these decisions.
>
> Before prediction development, validate the astronomy, time, location, Panchanga, Tamil solar calendar, Samvatsara, Jathagam, Vargas, Dasa and transit layers.
>
> Treat calculation accuracy and traditional interpretation as separate layers.
>
> Do not claim that astrology is scientifically proven or that future events are guaranteed.
>
> Every calculation must be reproducible from the same input and calculation profile.
>
> Every report must contain calculation provenance, engine version, ephemeris version, calculation profile, rule-set version and calculation hash.
>
> Implement event-based calculations rather than static daily labels.
>
> Never use fixed Gregorian dates for Tamil solar-month boundaries.
>
> Never label an approximation as authentic Vakya.
>
> Never silently mix Ayanamsa, node mode, house system or astrological traditions.
>
> Predictions must be generated from structured rules and machine-readable evidence.
>
> AI may explain calculated results but must never calculate or invent astronomical/astrological facts.
>
> Add automated tests for boundary cases, historical timezones, leap/calendar cases, planetary positions, Panchanga transitions, Tamil solar ingress, 60-year cycle, Lagna, Nakshatra/Pada, Vargas, Dasa and transit events.
>
> Build `/dev/astro-validation` for reference comparison and regression testing.
>
> Do not mark a feature complete because the application builds.
>
> A feature is complete only when its calculation logic, tests, reference comparison, error states, provenance, customer explanation and regression tests pass.
>
> Do not change unrelated website functionality.
>
> Preserve Tamil-native UX, mobile UX, print/PDF and existing working features.
>
> Keep dark mode disabled/deferred.
>
> At the end of every development phase, update:
>
> `docs/ASTRO_ACCURACY_VALIDATION.md`
>
> with:
>
> - implementation status;
> - tests;
> - reference cases;
> - tolerances;
> - known differences;
> - failures;
> - unresolved decisions;
> - deferred features.
>
> Never hide a calculation discrepancy. Classify it and document it.

---

# FINAL PRE-DEVELOPMENT CHECKLIST

Before the first major coding change, confirm:

```text
[ ] This document is the active master specification
[ ] Production profile is locked
[ ] Existing code has been audited
[ ] Duplicate engines are identified
[ ] Ephemeris licensing is reviewed
[ ] Timezone source is selected
[ ] Location provider is selected
[ ] Reference astronomy benchmark is selected
[ ] Golden test framework exists
[ ] Tamil calendar fixtures exist
[ ] Panchanga boundary fixtures exist
[ ] Jathagam fixtures exist
[ ] Dasa fixtures exist
[ ] Varga fixtures exist
[ ] Report versioning design exists
[ ] Privacy design exists
[ ] AI is isolated from calculation
[ ] Prediction rules are versioned
[ ] Customer calculation transparency is designed
```

If any required item is unresolved, stop before production implementation and record it explicitly rather than guessing.

---

# FINAL SUCCESS CRITERIA

CodePackr Astro is considered ready for customer-facing release only when:

```text
Same input
+
Same location
+
Same historical timezone
+
Same calculation profile
+
Same ephemeris/version
+
Same rule-set version
=
Same calculated result
```

and the customer can understand:

```text
What was calculated?
Which method was used?
Which astronomical data was used?
Which traditional rules were applied?
What evidence supports the interpretation?
What factors conflict?
How sensitive is the result to birth time?
Which version produced the report?
```

## Final product goal

**Do not optimize for the largest number of horoscope sentences.**

Optimize for:

> **accurate calculations + complete traditional factors + exact event timing + transparent methodology + traceable evidence + consistent Tamil calendar + reproducible results + responsible interpretation.**

This is the final quality standard for CodePackr Astro.
