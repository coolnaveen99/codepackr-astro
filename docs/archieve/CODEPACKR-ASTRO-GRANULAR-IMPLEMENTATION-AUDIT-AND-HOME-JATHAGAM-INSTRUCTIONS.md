# CodePackr Astro — Final Granular Improvement & Development Instructions

**Project:** `coolnaveen99/codepackr-astro`  
**Website:** `https://astro.codepackr.com`  
**Purpose:** Final implementation audit, calculation-accuracy correction, information architecture redesign, and customer-facing UX improvements.

> **Important:** These instructions are based on the current GitHub repository implementation reviewed on 26-Sep-2026 and the supplied screenshot of the current Astro home page. Do not assume that the previous accuracy specification is already fully implemented. The coding agent must audit the existing implementation first, preserve working features, and then make controlled changes.

---

# 1. Primary Objectives

The implementation must achieve all of the following:

1. Make the calculation foundation internally consistent and reproducible.
2. Remove contradictions between the documented production profile and the actual calculation libraries.
3. Prevent silent or fabricated astronomical fallbacks.
4. Validate birth location and timezone instead of silently assuming Chennai.
5. Make the Tamil Calendar/Panchangam genuinely event-based and location-specific.
6. Keep traditional astrology interpretation separate from astronomical calculation.
7. Make long-term forecasts progressively broader instead of generating artificial precision.
8. Preserve all existing Astro tools.
9. Redesign the home page as a **complete Astro tools landing page**.
10. Move Jathagam creation/calculation to a dedicated **`/jathagam` URL**.
11. Make the home page useful even before a user enters birth details.
12. Keep Tamil as the primary language.
13. Keep dark mode disabled/deferred.
14. Do not claim scientific proof or “100% prediction accuracy”.
15. Do not create duplicate calculation engines.

---

# 2. Existing Repository Must Be Audited Before Coding

## 2.1 Do not rebuild existing modules blindly

Before changing code, inspect:

- `src/lib/astro/engine.ts`
- `src/lib/astro/astronomy/*`
- `src/lib/astro/calendar/*`
- `src/lib/astro/chart/*`
- `src/lib/astro/dasha/*`
- `src/lib/astro/porutham/*`
- `src/lib/astro/prediction/*`
- `src/lib/astro/provenance/*`
- `src/lib/astro/rules/*`
- `src/lib/astro/validation/*`
- `src/components/*`
- `src/lib/nav.tsx`
- existing tests
- existing documentation

Create an internal audit document:

`docs/ASTRO_IMPLEMENTATION_AUDIT.md`

The audit must record:

- existing implementation
- intended specification
- mismatch
- severity
- proposed correction
- files affected
- tests required

Do not remove functionality simply because it was not mentioned in the new specification.

---

# 3. Critical Calculation-Foundation Corrections

## 3.1 Ephemeris declaration must match reality

The current production profile declares:

- Swiss Ephemeris

while the actual implementation uses:

- `astronomy-engine`

This must be resolved.

### Choose one of these architectures only after repository evaluation

### Option A — Use Swiss Ephemeris as the production calculation engine

If the project requirements justify Swiss Ephemeris:

1. Add the appropriate supported Swiss Ephemeris integration.
2. Create one adapter:
   `src/lib/astro/astronomy/ephemeris.ts`
3. Keep the rest of the Astro engine independent of the provider.
4. Expose the provider through the calculation profile.
5. Add benchmark fixtures against known reference values.
6. Do not leave misleading `ephemeris: "swiss-ephemeris"` metadata while calculations still come from Astronomy Engine.

### Option B — Continue with Astronomy Engine

If the project intentionally uses Astronomy Engine:

1. Change the production profile to the actual provider.
2. Rename metadata accordingly.
3. Update the Calculation Method page.
4. Update the calculation receipt.
5. Update documentation.
6. Do not describe it as Swiss Ephemeris.

### Required rule

**Never claim one ephemeris provider while executing another.**

---

# 4. Central Calculation Profile

Create one authoritative calculation profile.

Recommended structure:

`src/lib/astro/provenance/profile.ts`

The profile must contain at minimum:

```text
zodiac
ayanamsa
nodeMode
houseSystem
panchangaMethod
dashaSystem
ephemeris
timezoneSource
coordinateSystem
calculationVersion
ruleSetVersion
```

All calculation modules must read the profile rather than independently choosing defaults.

---

# 5. Remove Silent Chennai Defaults From Calculation APIs

The current code contains Chennai fallback values.

This is not acceptable for production calculations when the user has not supplied a validated location.

## Required behavior

A customer calculation must have:

- latitude
- longitude
- timezone
- place identity
- location validation status

If location is missing:

**Do not silently use Chennai.**

Instead:

1. Ask the user to select a birthplace.
2. Provide location search.
3. Resolve the selected place to coordinates.
4. Resolve timezone.
5. Show the resolved location before calculation.

Example UI:

```text
பிறந்த இடம்
[ சென்னை, தமிழ்நாடு, இந்தியா ]

13.08° N
80.27° E
Asia/Kolkata
UTC +05:30

✓ இடம் சரிபார்க்கப்பட்டது
```

---

# 6. Historical Timezone and DST

Timezone must not be represented only as a manually supplied fixed number.

Store:

```text
IANA timezone ID
UTC offset at birth
DST status
timezone database version
```

For historical dates:

1. Resolve the IANA timezone.
2. Resolve the offset applicable at the exact birth instant.
3. Preserve the offset used in the calculation receipt.
4. Never silently assume present-day timezone rules for historical dates.

Do not use a simplistic longitude-based timezone estimate as the final production answer.

---

# 7. Sunrise/Sunset/Moonrise/Moonset

## 7.1 No fabricated fallback

Current code creates approximate fallback values such as:

```text
06:00 sunrise
18:00 sunset
```

Remove this behavior.

If the astronomical library cannot determine an event:

```text
status = "unavailable"
```

and the UI must say:

```text
இந்த நாளுக்கான சூரிய உதய நேரத்தை
கணக்கிட முடியவில்லை.
```

Do not display a fabricated time.

## 7.2 Store event status

Each event should contain:

```text
instant
localTime
status
calculationMethod
```

Statuses:

- exact
- unavailable
- not-applicable

---

# 8. Tamil Solar Calendar

The Tamil calendar must be based on actual solar sidereal ingress.

## Required

For every Tamil month:

- actual Sun sidereal ingress
- ingress instant
- local date
- local time
- Tamil month
- Tamil day
- Tamil year
- location/timezone used

Do not hard-code April 14 as Tamil New Year.

April 14 may be a common calendar date, but the calculation must come from the actual solar ingress.

---

# 9. Tamil Day Boundary

The Tamil day calculation must be validated against the actual production convention.

Do not use an arbitrary:

```text
if ingress > 18:00
```

rule unless the selected Tamil calendar tradition explicitly requires it.

The implementation must document the actual rule:

- ingress before/after sunrise
- ingress before/after sunset
- local calendar-day convention
- regional/traditional profile

Add tests around ingress boundary cases.

---

# 10. 60-Year Samvatsara Cycle

Keep the canonical 60-year sequence.

Required tests:

- all 60 names
- no duplicates
- correct cycle numbering
- correct wrap
- historical anchor
- future wrap
- Tamil year starts based on the chosen solar-calendar convention

The UI should show:

```text
சம்வத்ஸரம்
பராபவ
40 / 60
```

and provide an explanation of the cycle.

---

# 11. Daily Tamil Calendar Must Be Comprehensive

The `/tamil-calendar` page must not be a simple date converter.

Each day should contain:

## Date

- Gregorian date
- Tamil date
- Tamil month
- Tamil year
- Samvatsara
- weekday

## Sun

- sunrise
- sunset
- solar sidereal longitude
- Sun Rasi
- Sun ingress if applicable

## Moon

- moonrise
- moonset
- Moon Rasi
- Moon longitude
- Moon Nakshatra
- Pada
- Moon phase
- illumination

## Panchangam

- Tithi
- Tithi start
- Tithi end
- Paksha
- Nakshatra
- Nakshatra Pada
- Nakshatra start
- Nakshatra end
- Yoga
- Yoga start
- Yoga end
- Karana
- Karana transitions

## Time periods

Where the selected regional profile supports them:

- Rahu Kalam
- Yamagandam
- Gulikai
- Abhijit Muhurtham
- Durmuhurtham
- Varjyam
- Amritakalam
- Choghadiya/Gowri where applicable

## Astronomy

- planetary positions
- retrograde status
- combustion status
- planetary ingress
- eclipses
- major Moon phases

## Timeline

Display transitions chronologically.

Example:

```text
05:58  சூரிய உதயம்
07:12  திதி மாற்றம்
09:43  நட்சத்திர மாற்றம்
12:18  யோக மாற்றம்
18:16  சூரிய அஸ்தமனம்
```

The timeline must come from actual calculated event instants.

---

# 12. Panchangam Algorithm Review

Current implementation only partially handles transitions and assumes a small number of transitions.

The production implementation must support:

- zero transitions
- one transition
- multiple transitions
- boundary at midnight
- boundary exactly near sunrise
- boundary exactly near sunset
- transition near 00:00
- transition near 24:00

Do not assume that one day can contain only two Tithis/Nakshatras/Yogas/Karanas.

Use a generic interval scanner/root finder where required.

---

# 13. Tithi

Tithi must be calculated from:

```text
Moon longitude - Sun longitude
```

with correct normalization and 12-degree boundaries.

Required:

- 30 tithis
- Shukla/Krishna classification
- exact transition times
- sunrise tithi
- all daily transitions

Test:

- normal tithi
- very short tithi
- very long tithi
- boundary near midnight
- boundary near sunrise

---

# 14. Nakshatra

Nakshatra calculation must contain:

- 27 Nakshatras
- 4 Padas each
- Moon sidereal longitude
- exact transition time
- Pada transition

Important:

The daily calendar should show both:

```text
நட்சத்திரம்
```

and:

```text
பாதம்
```

and must not assume the entire day has one Pada.

---

# 15. Yoga

Use the standard sum:

```text
Sun sidereal longitude + Moon sidereal longitude
```

normalized to 360° and divided into 27 equal segments.

Test every boundary.

---

# 16. Karana

Karana is more complex than simply treating it as a generic 6-degree interval.

Implement the traditional sequence correctly:

- 11 Karanas
- fixed Karanas
- repeating Karanas
- correct beginning/end of the lunar month

Do not derive the complete Karana name solely from an index formula without handling the fixed Karanas.

Create dedicated golden tests.

---

# 17. Planetary Positions

The engine must calculate at minimum:

- Sun
- Moon
- Mars
- Mercury
- Jupiter
- Venus
- Saturn
- Rahu
- Ketu

For each:

```text
longitude
sign
degree
minutes
seconds
nakshatra
pada
speed
retrograde
combustion
```

The calculation provider must be consistent with the production profile.

---

# 18. Retrograde Detection

Current velocity-based implementation is a good foundation, but add station detection.

Required:

```text
direct
station retrograde
retrograde
station direct
```

For each planet:

1. calculate longitudinal velocity
2. identify sign change in velocity
3. refine station instant
4. record station event
5. use it in transit timelines

Do not treat every negative velocity as a customer-facing retrograde event without station context.

---

# 19. Rahu/Ketu

Production profile uses Mean Rahu/Ketu.

Therefore:

1. explicitly calculate Mean Node
2. Ketu = Rahu + 180°
3. label this in Calculation Method
4. do not mix Mean and True Node values
5. if True Node is introduced later, make it a separate calculation profile

---

# 20. Combustion

Combustion rules vary between traditions.

Therefore:

- define combustion thresholds in the rule/profile layer
- identify the selected tradition
- expose the rule version
- do not present one threshold as universally correct

For each combust planet show:

```text
Combustion: Yes
Angular separation from Sun: X°
Rule: [selected rule set]
```

---

# 21. House System

The locked production default is:

```text
Whole Sign Houses
```

Therefore:

- D1 house calculation must use Whole Sign
- all house-dependent rules must use the same system
- UI must display the system
- calculation receipt must store it

Do not let individual modules silently use a different house system.

---

# 22. Vargas D1–D60

Create a single Varga engine.

Required:

- D1
- D2
- D3
- D4
- D5
- D6
- D7
- D8
- D9
- D10
- D11
- D12
- D16
- D20
- D24
- D27
- D30
- D40
- D45
- D60

If additional Vargas are displayed, document their rules.

## Boundary tests

Test values:

```text
0°
0° + epsilon
boundary - epsilon
exact boundary
boundary + epsilon
29°59'59"
```

D60 especially requires strict boundary testing.

---

# 23. Birth-Time Quality

Birth time must support:

- Exact
- Approximate
- Rounded
- Unknown

UI:

```text
பிறந்த நேரத்தின் துல்லியம்

○ துல்லியமானது
○ தோராயமானது
○ சுமார் / Rounded
○ தெரியவில்லை
```

Do not pretend an unknown birth time is exact.

---

# 24. Birth-Time Sensitivity

The current sensitivity module is useful but must become more complete.

Test:

```text
-10 min
-5 min
0
+5 min
+10 min
```

Compare:

- Lagna
- D9
- D10
- D60
- Moon longitude
- Nakshatra/Pada
- Vimshottari balance

Do not label something scientifically “stable” or “unstable”.

Use:

```text
மாற்றம் இல்லை
சிறிய மாற்றம்
குறிப்பிடத்தக்க மாற்றம்
```

and explain what changed.

---

# 25. Vimshottari Dasa

Production default:

```text
Vimshottari Dasa
```

Document:

- 120-year sequence
- Nakshatra lord
- balance at birth
- year-length convention
- Mahadasha
- Antardasha
- Pratyantardasha

Use one consistent date arithmetic method.

Do not mix:

- 365 days
- 365.2425 days
- calendar years

without documenting the convention.

Create independent benchmark cases.

---

# 26. Porutham

Keep all 10 factors separately visible:

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

For each:

```text
result
score if applicable
reason
rule reference
```

Do not hide everything behind one total score.

If different Tamil traditions calculate a factor differently, document the selected convention.

---

# 27. Yoga/Dosha Rule Registry

The existing rule registry must become the authoritative source for traditional interpretation rules.

Each rule should contain:

```text
ruleId
nameTa
nameEn
tradition
sourceReference
ruleVersion
priority
requiredFactors
evaluation
cancellationRules
explanation
```

Do not put large collections of hard-coded rules directly inside React components.

---

# 28. Prediction Engine

Prediction must be generated from structured calculated facts.

Pipeline:

```text
Birth data
   ↓
Validated location/timezone
   ↓
Astronomical calculations
   ↓
Sidereal positions
   ↓
Chart
   ↓
Dasa
   ↓
Transit
   ↓
Rule evaluation
   ↓
Evidence classification
   ↓
Traditional interpretation
   ↓
Tamil/English narration
```

The UI must never calculate astrology.

---

# 29. Prediction Evidence Levels

Use:

- Strong
- Moderate
- Mixed
- Limited
- Insufficient

Do not use invented numeric probability percentages.

Example:

```text
ஆதார நிலை: மிதமானது

காரணிகள்:
• குரு சஞ்சாரம்
• தற்போதைய தசா
• 10ஆம் பாவ தொடர்பு
```

---

# 30. Forecast Horizons

## 1 Year

Primary detailed forecast.

Use:

- monthly periods
- Dasa changes
- major transits
- important event windows
- supporting/caution factors

## 3 Years

Use:

- quarterly/yearly overview
- major Dasa transitions
- slow transits

## 5 Years

Use:

- yearly overview
- major phases

## 10 Years

Use:

- major life phases
- major Dasa/transit changes

## 20 Years

Use:

- broad lifecycle themes

## 60 Years

Use:

- broad lifecycle
- Samvatsara cycle
- Dasa/transit themes

Do not fabricate exact event dates decades into the future.

---

# 31. Important Forecast Bug to Correct

The current forecast implementation contains generic text such as:

```text
"முயற்சிகளுக்கு பலன்"
"அவசர முடிவுகளைத் தவிர்க்கவும்"
"வாழ்வியல் அனுபவம்"
```

These should not be generated merely as static strings for every user.

Every displayed prediction factor must be linked to actual calculated inputs.

Required structure:

```text
factorId
sourceCalculation
ruleId
period
domain
evidenceLevel
explanation
```

---

# 32. Main Page Redesign — IMPORTANT NEW REQUIREMENT

## Current problem

The supplied screenshot shows that the current `/` page immediately behaves like a Jathagam input page.

The main page should instead become the **CodePackr Astro tools home page**.

The Jathagam creation workflow must move to:

```text
/jathagam
```

---

# 33. New URL Architecture

Required:

```text
/                 → Astro Home / All Tools
/jathagam         → Jathagam creation and result
/tamil-calendar   → Tamil Calendar + Daily Panchangam
/panchangam       → Panchangam tool
/forecast         → Forecast tool
/porutham         → Marriage compatibility
/gochara          → Gochara
/rasipalan        → Daily Rasi
/chandrashtama    → Chandrashtama
/nakshatra        → Nakshatra
/babynames        → Baby Names
/numerology       → Numerology
/prasna           → Prasna
/nazhigai         → Nazhigai
/biodata          → Biodata
/calculation-method → Calculation Method
/disclaimer       → Disclaimer
/privacy          → Privacy
/about            → About
/dev/astro-validation → Internal validation
```

---

# 34. Home Page Information Architecture

The new `/` page should contain the following sections.

## Section 1 — Hero

Tamil primary.

Example:

```text
கோட்பேக்ர் ஆஸ்ட்ரோ

தமிழில் ஜாதகம், பஞ்சாங்கம்,
ராசிபலன் மற்றும் ஜோதிடக் கருவிகள்

துல்லியமான கணக்கீடு
தெளிவான முறைகள்
பல இலவச கருவிகள்
```

Buttons:

```text
ஜாதகம் உருவாக்க
அனைத்து கருவிகளையும் பார்க்க
```

Do not claim:

```text
100% accurate predictions
```

---

# 35. Section 2 — Featured Jathagam

A smaller feature card:

```text
ஜாதகம்

உங்கள் பிறப்பு தேதி, நேரம் மற்றும் இடத்தை உள்ளிட்டு
முழுமையான ஜாதகத்தை உருவாக்குங்கள்.

[ஜாதகம் உருவாக்க →]
```

This card navigates to:

```text
/jathagam
```

Do not put the complete birth form on the home page.

---

# 36. Section 3 — All Tools

This is the most important new home-page requirement.

Create a complete tools directory.

Use categories.

## Category A — ஜாதகம்

Cards:

- ஜாதகம்
- 1 பக்க ஜாதகம்
- 6 பக்க ஜாதகம்
- 30 பக்க ஜாதகம்
- ஜாதக கட்டங்கள்
- நவாம்சம்
- தசாம்சம்
- வர்கங்கள்
- விம்சோத்தரி தசா

## Category B — பஞ்சாங்கம் & காலண்டர்

- தமிழ் காலண்டர்
- தினசரி பஞ்சாங்கம்
- திதி
- நட்சத்திரம்
- யோகம்
- கரணம்
- சூரிய உதயம்
- சூரிய அஸ்தமனம்
- சந்திர உதயம்
- சந்திர அஸ்தமனம்
- ராகு காலம்
- எமகண்டம்
- குளிகை
- முகூர்த்தம்
- கிரக பெயர்ச்சி

## Category C — பலன்கள்

- ராசிபலன்
- கோச்சாரம்
- சந்திராஷ்டமம்
- ஆண்டு பலன்
- 1 ஆண்டு முன்னறிவு
- 3 ஆண்டு கண்ணோட்டம்
- 5 ஆண்டு கண்ணோட்டம்
- 10 ஆண்டு வாழ்க்கை கட்டங்கள்
- 20 ஆண்டு வாழ்க்கை கண்ணோட்டம்
- 60 ஆண்டு சுழற்சி

## Category D — திருமணம்

- பொருத்தம்
- 10 பொருத்தங்கள்
- நட்சத்திர பொருத்தம்
- ராசி பொருத்தம்
- ராஜ்ஜு
- வேதை
- யோனி
- கணம்

## Category E — தனிப்பட்ட கருவிகள்

- நட்சத்திரம்
- குழந்தை பெயர்கள்
- எண் கணிதம்
- பிரச்னம்
- நாழிகை
- பயோடேட்டா

## Category F — தகவல் & வெளிப்படைத்தன்மை

- கணக்கீட்டு முறை
- ஜோதிட சொற்களஞ்சியம்
- எங்களைப் பற்றி
- தனியுரிமை
- Disclaimer

---

# 37. Tool Card Design

Every tool card should contain:

```text
Icon
Tamil title
Short description
Category
Available/Coming Soon
Open button
```

Example:

```text
┌─────────────────────────────┐
│ 🗓️                          │
│ தமிழ் காலண்டர்              │
│                             │
│ தினசரி திதி, நட்சத்திரம்,   │
│ யோகம், கரணம் மற்றும்        │
│ முக்கிய நேரங்கள்.            │
│                             │
│ [திறக்க →]                  │
└─────────────────────────────┘
```

Do not make every card visually identical if that harms usability, but maintain a consistent design system.

---

# 38. Tool Search

Add search near the tools section:

```text
கருவியை தேடுங்கள்...
```

Search by:

- Tamil name
- English name
- keyword
- category

Example:

```text
"திதி"
"tithi"
"நட்சத்திரம்"
"nakshatra"
```

---

# 39. Tool Category Filters

Provide:

```text
அனைத்தும்
ஜாதகம்
பஞ்சாங்கம்
பலன்கள்
திருமணம்
கருவிகள்
தகவல்
```

Filtering must be client-side and fast.

Do not reload the page.

---

# 40. Tool Metadata Registry

Do not hard-code tool cards in the JSX.

Create:

```text
src/lib/tools/astro-tools.ts
```

Example:

```ts
{
  id: "jathagam",
  titleTa: "ஜாதகம்",
  titleEn: "Jathagam",
  descriptionTa: "...",
  descriptionEn: "...",
  category: "jathagam",
  path: "/jathagam",
  icon: "chart",
  status: "available",
  featured: true
}
```

The home page renders from this registry.

This creates one source of truth.

---

# 41. Navigation Update

Current navigation makes Jathagam the primary page.

Change the navigation concept to:

```text
முகப்பு
கருவிகள்
ஜாதகம்
பஞ்சாங்கம்
பலன்கள்
திருமணம்
மேலும்
```

The Jathagam button should navigate to:

```text
/jathagam
```

Home should navigate to:

```text
/
```

---

# 42. Separate Jathagam Page

Move the current large birth-input experience to:

```text
/jathagam
```

The page should contain:

1. Birth details
2. Birth-time quality
3. Birth-place search
4. Location validation
5. Calculation profile
6. Jathagam generation
7. Results
8. Print
9. PDF
10. Calculation receipt

---

# 43. Jathagam URL State

Support sharable Jathagam URLs.

Example:

```text
/jathagam?d=20&m=5&y=1990&h=10&min=30&lat=13.08&lon=80.27&tz=5.5
```

But:

- validate every parameter
- never trust arbitrary timezone values
- preserve user privacy
- do not expose unnecessary personal information
- do not automatically calculate until required fields are valid

If a shareable link is generated, explain what data is encoded.

---

# 44. Home Page Must Not Automatically Calculate a Sample Jathagam

The current application has default/sample birth input behavior.

For the new home page:

- do not calculate a sample horoscope
- do not show a fake user's horoscope
- do not imply that default data belongs to the visitor

The `/jathagam` page may provide a clearly labelled sample/demo only if useful.

---

# 45. Jathagam Result Page UX

After calculation, keep the user on:

```text
/jathagam
```

with result sections or a result anchor.

Recommended structure:

```text
ஜாதக சுருக்கம்
↓
பிறப்பு விவரங்கள்
↓
ராசி / லக்னம்
↓
கிரக நிலைகள்
↓
D1
↓
D9
↓
முக்கிய வர்கங்கள்
↓
தசா
↓
கோச்சாரம்
↓
யோகங்கள்
↓
பொருத்தம்/other tools where relevant
↓
கணக்கீட்டு விவரம்
```

---

# 46. Calculation Transparency

Every Jathagam result should provide:

```text
கணக்கீட்டு முறை
```

Show:

- Zodiac
- Ayanamsa
- Node mode
- House system
- Panchanga profile
- Ephemeris provider
- Timezone
- Latitude
- Longitude
- Elevation if used
- Calculation version
- Rule version

---

# 47. “Why This Result?” Component

For important results:

```text
ஏன் இந்த முடிவு?
```

Example:

```text
லக்னம்: தனுசு

காரணம்:
• பிறந்த நேரம்: 06:20
• இடம்: Chennai
• Latitude: ...
• Longitude: ...
• Ayanamsa: Lahiri
• House system: Whole Sign
```

For traditional interpretation:

```text
இந்த விளக்கம் பயன்படுத்தும் விதி:
[Rule ID]
[Tradition]
```

---

# 48. Calculation Receipt

The calculation receipt should contain:

```text
Report ID
Report version
Calculation version
Rule version
Created timestamp
Input date/time
Location
Timezone
Ephemeris
Ayanamsa
Node mode
House system
```

If a hash is generated, the hash must represent the actual canonical calculation payload.

Do not generate a decorative hash unrelated to the report.

---

# 49. Existing Routes Must Continue Working

After moving Jathagam:

- `/` must become Home
- `/jathagam` must become Jathagam

Do not break:

- `/porutham`
- `/panchangam`
- `/rasipalan`
- `/chandrashtama`
- `/gochara`
- `/nakshatra`
- `/babynames`
- `/nazhigai`
- `/numerology`
- `/prasna`
- `/biodata`
- `/tamil-calendar`
- `/forecast`
- `/calculation-method`

Add route regression tests.

---

# 50. Update `src/lib/nav.tsx`

Change:

```text
jathagam → "/"
```

to:

```text
jathagam → "/jathagam"
```

Add:

```text
home → "/"
```

The page type should distinguish:

```text
home
jathagam
```

Do not use Jathagam as the implicit fallback for every unknown route.

Unknown route should eventually have a proper 404 or safe home fallback.

---

# 51. SEO

The new home page should have its own SEO identity.

Home:

```text
Title:
CodePackr Astro — தமிழ் ஜோதிடம், ஜாதகம், பஞ்சாங்கம் மற்றும் இலவச கருவிகள்
```

Jathagam:

```text
Title:
இலவச தமிழ் ஜாதகம் உருவாக்கி — CodePackr Astro
```

Tamil Calendar:

```text
Title:
தமிழ் காலண்டர் & தினசரி பஞ்சாங்கம் — CodePackr Astro
```

Avoid duplicate title/description across tools.

---

# 52. Home Page SEO Content

Include useful descriptive content:

```text
தமிழில் இலவச ஜோதிட மற்றும் காலண்டர் கருவிகள்.
ஜாதகம், பஞ்சாங்கம், தமிழ் காலண்டர், ராசிபலன்,
நட்சத்திரம், பொருத்தம் மற்றும் பல கணக்கீட்டு கருவிகளை
ஒரே இடத்தில் பயன்படுத்தலாம்.
```

Do not use unsupported accuracy claims.

---

# 53. Mobile Design

The screenshot shows a desktop layout.

The redesigned home page must also work on mobile.

Required:

- 1-column tool cards on small screens
- 2-column on medium screens
- 3–4 columns on large screens
- sticky/compact navigation
- large touch targets
- readable Tamil typography
- no horizontal overflow

---

# 54. Visual Design

Keep the current visual identity:

- brown/terracotta primary
- cream/white surfaces
- subtle borders
- Tamil-first typography
- rounded cards
- clear icons

Do not introduce dark mode.

Do not replace the current brand identity unnecessarily.

---

# 55. Accessibility

Every tool card must have:

- semantic link/button
- accessible label
- keyboard navigation
- visible focus state
- sufficient contrast
- no icon-only navigation without accessible text

---

# 56. Tool Availability

Every tool should have an explicit status:

```text
available
beta
coming-soon
```

Do not show a button that navigates to a broken page.

---

# 57. Internal Developer Validation Page

Keep:

```text
/dev/astro-validation
```

but do not expose it as a normal public navigation item.

It should be reachable intentionally by developers.

Validation dashboard should show:

- ephemeris tests
- Panchang tests
- calendar tests
- Dasa tests
- Varga tests
- Porutham tests
- timezone tests
- regression tests
- golden cases
- boundary tests

---

# 58. Validation Must Not Mean “Tests Passed = Astrology Is True”

Tests validate:

- mathematical implementation
- reproducibility
- reference agreement
- boundary behavior
- software correctness

They do not scientifically validate astrological predictions.

Customer-facing wording must preserve this distinction.

---

# 59. Golden Test Fixtures

Create:

```text
tests/fixtures/
```

Organize:

```text
tests/fixtures/astronomy/
tests/fixtures/calendar/
tests/fixtures/panchangam/
tests/fixtures/jathagam/
tests/fixtures/dasha/
tests/fixtures/varga/
tests/fixtures/porutham/
tests/fixtures/timezone/
```

Each fixture should contain:

```text
input
expected
source/reference
method/profile
tolerance
```

---

# 60. Independent Reference Testing

Do not make all expected values using the same code that is being tested.

Bad:

```text
expected = sameEngine(input)
```

Good:

```text
expected = independently verified reference value
```

Reference sources can be:

- published astronomical references
- trusted ephemeris outputs
- independent implementations
- documented Panchanga references
- manually verified benchmark cases

Record the source and date.

---

# 61. Tolerance Policy

Astronomical tests must use appropriate tolerances.

Examples:

```text
longitude: arcseconds / arcminutes depending on provider
event time: seconds/minutes depending on reference
calendar boundary: explicit tolerance
```

Do not use:

```ts
expect(value).toBe(exactFloatingPoint)
```

for floating astronomical calculations unless mathematically deterministic.

---

# 62. Cross-Reference Classification

When CodePackr differs from another source, classify:

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

Never automatically call every difference a bug.

---

# 63. Forecast Testing

Test that:

- 1-year produces 12 periods
- 3-year produces 3 periods
- 5-year produces 5 periods
- 10-year produces broad phases
- 20-year produces broad phases
- 60-year produces broad phases

Also verify that forecast content changes when:

- birth chart changes
- Dasa changes
- transit changes
- location changes where relevant

If two unrelated birth charts generate exactly the same meaningful forecast content, investigate the engine.

---

# 64. Tamil and English Language Consistency

All new tool cards must have:

```text
titleTa
titleEn
descriptionTa
descriptionEn
```

Do not leave mixed-language placeholder text.

Check:

- navigation
- buttons
- validation
- error messages
- calculation receipt
- forecast
- calendar
- tool cards

---

# 65. Error Handling

Never display raw JavaScript errors to customers.

Use:

```text
கணக்கீட்டை முடிக்க முடியவில்லை.

காரணம்:
[human-readable reason]

மீண்டும் முயற்சிக்கவும்
```

For location:

```text
பிறந்த இடத்தை சரிபார்க்கவும்.
```

For invalid date:

```text
சரியான பிறந்த தேதியை உள்ளிடவும்.
```

---

# 66. Privacy

Birth information can be sensitive.

Do not unnecessarily:

- send birth data to third-party analytics
- expose it in logs
- store it permanently
- include name in telemetry

If URL sharing is supported, document what is encoded.

---

# 67. No AI Hallucination in Astrology

If AI is later used:

AI receives only structured calculated data.

Example:

```json
{
  "lagna": "...",
  "moonSign": "...",
  "dasa": "...",
  "transits": [...],
  "rulesMatched": [...]
}
```

AI must not invent:

- planetary positions
- dates
- Dasa periods
- transits
- Yogas
- Nakshatras
- astronomical events

AI is a narration layer, not the calculation engine.

---

# 68. Architecture Target

Final architecture:

```text
                    ┌────────────────────┐
                    │     Astro Home     │
                    │        /           │
                    └─────────┬──────────┘
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
     /jathagam         /tamil-calendar       /panchangam
          │                   │                    │
          └──────────────┬────┴────────────────────┘
                         ▼
                ┌──────────────────┐
                │ Calculation API  │
                │ / Astro Engine   │
                └────────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Astronomy       Calendar         Chart
      Engine          Engine           Engine
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                 Rule / Dasa Engine
                         │
                         ▼
                 Prediction Engine
                         │
                         ▼
                 Provenance / Receipt
```

---

# 69. Single Source of Truth

There must be one authoritative source for:

- planetary positions
- Moon longitude
- Sun longitude
- Ayanamsa
- timezone
- birth location
- Dasa
- chart
- Panchanga events

Do not allow:

```text
Jathagam page → own calculation
Panchangam page → own calculation
Forecast page → own calculation
```

Instead:

```text
all pages → central calculation engine
```

---

# 70. React/UI Rule

React components must:

- display data
- collect user input
- navigate
- show validation

React components must NOT:

- calculate planetary positions
- calculate Tithi
- calculate Nakshatra
- calculate Dasa
- calculate Varga
- implement astrology rules

---

# 71. Main Page Performance

The home page should not load heavy Jathagam calculation modules unnecessarily.

Prefer:

- lightweight tool metadata
- lazy-loaded feature pages
- lazy-loaded chart libraries
- lazy-loaded validation dashboard

The home page should load quickly.

---

# 72. Home Page Recommended Layout

```text
HEADER
│
├── Hero
│
├── Featured Jathagam
│
├── Search Tools
│
├── Category Filters
│
├── All Tools
│    ├── ஜாதகம்
│    ├── பஞ்சாங்கம்
│    ├── பலன்கள்
│    ├── திருமணம்
│    └── மற்ற கருவிகள்
│
├── Why CodePackr Astro
│
├── Calculation Transparency
│
├── Popular Tools
│
└── Footer
```

---

# 73. “Why CodePackr Astro?” Section

Use factual statements only:

```text
✓ தமிழ் முதன்மை இடைமுகம்
✓ இடம் சார்ந்த கணக்கீடுகள்
✓ கணக்கீட்டு முறையை வெளிப்படையாக காட்டுதல்
✓ தினசரி பஞ்சாங்க நிகழ்வு நேரங்கள்
✓ பல ஜோதிட கருவிகள்
✓ Print / PDF ஆதரவு
```

Avoid:

```text
100% accurate
guaranteed prediction
future guaranteed
scientifically proven astrology
```

---

# 74. Popular Tools

The home page may show a smaller:

```text
பிரபலமான கருவிகள்
```

section.

Recommended cards:

- ஜாதகம்
- தமிழ் காலண்டர்
- தினசரி பஞ்சாங்கம்
- பொருத்தம்
- ராசிபலன்
- நட்சத்திரம்

This section is separate from the complete tools directory.

---

# 75. “All Tools” Must Be Complete

The home page must not list only the currently visible top-navigation tools.

Every implemented Astro feature must be discoverable from the All Tools directory.

The coding agent must inspect the repository and build the registry from the actual implemented routes/features.

Do not manually invent missing tools.

---

# 76. Route Regression Tests

Add tests for:

```text
/
 /jathagam
 /tamil-calendar
 /panchangam
 /forecast
 /porutham
 /gochara
 /rasipalan
 /chandrashtama
 /nakshatra
 /babynames
 /numerology
 /prasna
 /nazhigai
 /biodata
 /calculation-method
```

Verify:

- route resolves
- page renders
- no console error
- expected SEO metadata exists
- navigation works

---

# 77. Jathagam Migration Tests

Test:

### Before

```text
/
```

must no longer show the full Jathagam birth form.

### After

```text
/jathagam
```

must show the full birth form.

### Navigation

Click:

```text
ஜாதகம்
```

→ `/jathagam`

Click:

```text
முகப்பு
```

→ `/`

---

# 78. Backward Compatibility

If old shared links use:

```text
/?d=20&m=5&y=1990...
```

do not silently lose them.

Implement a migration strategy:

```text
legacy root query
      ↓
validate parameters
      ↓
redirect to /jathagam?... 
```

Use a safe redirect.

Do not expose invalid personal data in logs.

---

# 79. Print/PDF

Moving Jathagam to `/jathagam` must not break:

- print
- PDF
- 1-page report
- 6-page report
- 30-page report

Verify:

```text
/jathagam?print=auto...
```

and all existing print routes.

---

# 80. Screenshot-Specific UX Improvements

Based on the supplied screenshot:

### Current issue 1

The birth form occupies the main page immediately.

### Change

Move it to `/jathagam`.

### Current issue 2

Users cannot immediately see how many tools are available.

### Change

Home page must show the complete tool ecosystem.

### Current issue 3

The “1 / 6 / 30 page Jathagam” selection dominates the first screen.

### Change

Keep this selection on `/jathagam`, where the user has already chosen to create a horoscope.

### Current issue 4

The home page is currently a task form rather than a product/tool discovery page.

### Change

Make `/` an Astro tool directory + landing page.

---

# 81. Recommended Jathagam Page Structure

At `/jathagam`:

```text
Breadcrumb
Home > ஜாதகம்

Page title
ஜாதகம் உருவாக்கவும்

Step 1 — பிறப்பு விவரங்கள்
Step 2 — பிறந்த இடம்
Step 3 — நேர துல்லியம்
Step 4 — Report type

[ஜாதகம் உருவாக்க]

↓

Calculation status

↓

Results
```

---

# 82. Progressive Disclosure

Do not overwhelm new users.

Default view:

```text
பெயர்
பாலினம்
பிறந்த தேதி
பிறந்த நேரம்
பிறந்த இடம்
```

Advanced:

```text
நேர துல்லியம்
Elevation
Calculation profile
Advanced options
```

Advanced options should be expandable.

---

# 83. Location Search UX

The location field should support:

```text
Chennai
Madras
சென்னை
Bengaluru
Bangalore
```

After selection:

```text
Place
Latitude
Longitude
Timezone
```

The user should confirm the resolved location before calculation.

---

# 84. Do Not Confuse City Name With Coordinates

Never calculate using:

```text
placeName only
```

A selected location must resolve to coordinates.

---

# 85. Validation Gates

Development must proceed through gates.

## Gate 0

Repository audit.

## Gate 1

Calculation-provider/profile consistency.

## Gate 2

Timezone/location correctness.

## Gate 3

Astronomical events.

## Gate 4

Tamil calendar/Panchanga.

## Gate 5

Chart/Varga/Dasa.

## Gate 6

Rules/Porutham.

## Gate 7

Prediction.

## Gate 8

Home/Jathagam routing redesign.

## Gate 9

Regression/accessibility/SEO.

## Gate 10

Production release.

Do not skip failed gates.

---

# 86. Required Documentation Updates

Update:

```text
README.md
docs/ASTRO_ACCURACY_VALIDATION.md
docs/ASTRO_IMPLEMENTATION_AUDIT.md
docs/ASTRO_CALCULATION_METHOD.md
```

Create if missing.

Document:

- calculation provider
- selected conventions
- limitations
- benchmark results
- known differences
- route architecture

---

# 87. Required Final QA Report

Create:

```text
docs/ASTRO_FINAL_QA_REPORT.md
```

Include:

```text
Repository commit
Calculation version
Rule version
Test count
Passed
Failed
Skipped
Known limitations
Reference datasets
Route tests
Mobile tests
Print tests
PDF tests
SEO tests
Accessibility tests
```

---

# 88. Coding Agent Operating Rules

The coding agent must follow this exact sequence:

```text
1. Inspect existing repository.
2. Produce audit.
3. Identify duplicate engines.
4. Fix calculation/profile contradictions.
5. Fix location/timezone behavior.
6. Fix astronomical fallback behavior.
7. Validate Panchangam.
8. Validate chart/Varga/Dasa.
9. Validate rules.
10. Validate prediction.
11. Redesign / home page.
12. Move Jathagam to /jathagam.
13. Build All Tools registry.
14. Update navigation.
15. Add regression tests.
16. Run full test suite.
17. Run build.
18. Review generated UI.
19. Update documentation.
20. Produce final QA report.
```

---

# 89. Do Not Do These Things

Do not:

- create a second Astro engine
- silently use Chennai
- silently assume UTC+5:30
- fabricate sunrise/sunset
- claim Swiss Ephemeris if not actually used
- hard-code April 14 as a universal Tamil New Year date
- hard-code generic prediction text as if user-specific
- expose internal validation tools in the primary navigation
- remove existing working features
- remove print/PDF
- reintroduce dark mode
- claim scientific proof of astrology
- claim guaranteed prediction accuracy
- calculate astrology inside React components

---

# 90. Final Acceptance Criteria

The work is complete only when all are true:

## Architecture

- [ ] One central Astro calculation engine
- [ ] One authoritative production profile
- [ ] No contradictory ephemeris metadata
- [ ] No duplicate calculation engines

## Location

- [ ] Birthplace required/validated
- [ ] Coordinates resolved
- [ ] IANA timezone resolved
- [ ] Historical timezone handled
- [ ] No silent Chennai fallback

## Astronomy

- [ ] Planetary positions validated
- [ ] Retrograde validated
- [ ] Combustion rule documented
- [ ] Sunrise/sunset validated
- [ ] Moonrise/moonset validated
- [ ] No fabricated event fallback

## Calendar

- [ ] Tamil solar ingress validated
- [ ] Tamil day boundary validated
- [ ] 60-year cycle validated
- [ ] Daily Tithi complete
- [ ] Daily Nakshatra + Pada complete
- [ ] Daily Yoga complete
- [ ] Daily Karana complete
- [ ] Daily astronomical timeline complete

## Jathagam

- [ ] `/jathagam` exists
- [ ] `/` no longer acts as full Jathagam form
- [ ] D1 validated
- [ ] D9 validated
- [ ] D60 validated
- [ ] all required Vargas validated
- [ ] Vimshottari validated
- [ ] sensitivity validated
- [ ] print validated
- [ ] PDF validated

## Tools

- [ ] Home page lists all implemented tools
- [ ] Tool registry exists
- [ ] Categories work
- [ ] Search works
- [ ] Tool links work
- [ ] Available/coming-soon status is accurate

## Forecast

- [ ] 1-year monthly
- [ ] 3-year yearly/quarterly
- [ ] 5-year yearly
- [ ] 10-year broad phases
- [ ] 20-year broad lifecycle
- [ ] 60-year broad lifecycle
- [ ] user-specific calculated factors
- [ ] evidence level
- [ ] no fabricated exact long-range predictions

## Transparency

- [ ] Calculation Method page
- [ ] Calculation Receipt
- [ ] Why This Result
- [ ] calculation version
- [ ] rule version
- [ ] profile visible

## Quality

- [ ] Unit tests
- [ ] Golden tests
- [ ] Boundary tests
- [ ] Route tests
- [ ] Regression tests
- [ ] Build passes
- [ ] Mobile verified
- [ ] Accessibility verified
- [ ] SEO verified

---

# 91. Final Product Architecture

The final customer experience should be:

```text
astro.codepackr.com
│
├── Home
│   ├── Hero
│   ├── Featured Jathagam
│   ├── Search
│   ├── Categories
│   ├── All Tools
│   ├── Popular Tools
│   └── Transparency
│
├── /jathagam
│   ├── Birth Details
│   ├── Location
│   ├── Birth-Time Quality
│   ├── Report Selection
│   ├── Calculation
│   ├── D1
│   ├── Vargas
│   ├── Dasa
│   ├── Rules
│   ├── Forecast
│   └── Calculation Receipt
│
├── /tamil-calendar
│   └── Complete daily event-based calendar
│
├── /panchangam
│   └── Panchangam
│
├── /forecast
│   └── Multi-horizon forecast
│
├── /porutham
│   └── 10-factor compatibility
│
└── Other Astro Tools
```

---

# 92. Final Instruction to the Coding Agent

> **Do not start by redesigning the UI.**
>
> First audit the existing implementation against this specification and the existing repository.
>
> Correct the calculation foundation and metadata contradictions first.
>
> Then correct location/timezone/event handling.
>
> Then validate the calendar, Panchangam, Jathagam, Vargas, Dasa, Porutham and prediction layers.
>
> Only after the calculation foundation is consistent should the agent move Jathagam from `/` to `/jathagam` and redesign `/` as the complete Astro Tools home page.
>
> Preserve all existing working features, print/PDF functionality, Tamil-first UX, and current visual identity.
>
> Do not create duplicate engines.
>
> Do not claim accuracy that has not been independently validated.
>
> At the end, run the full test suite and build, generate `docs/ASTRO_FINAL_QA_REPORT.md`, and clearly list every remaining limitation instead of hiding it.

---

# 93. Priority Order

If implementation must be split into releases:

### P0 — Must Fix Before Production Accuracy Claims

1. Ephemeris/profile mismatch
2. Location fallback
3. Timezone handling
4. Sunrise/sunset fake fallback
5. Panchangam event correctness
6. Tamil calendar boundary correctness
7. Dasa validation
8. Varga boundary validation

### P1 — Core Product

9. `/jathagam`
10. `/` Astro Tools Home
11. Tool registry
12. Navigation
13. Calculation transparency
14. Calculation receipt
15. Regression tests

### P2 — Advanced Astrology

16. Rule registry expansion
17. Transit/station events
18. Yoga/Dosha explanations
19. Forecast evidence engine
20. Long-horizon forecast refinement

### P3 — Quality and Growth

21. Accessibility
22. SEO
23. Mobile optimization
24. Performance
25. More golden datasets
26. Additional regional Panchanga profiles

---

# 94. Final Principle

The goal is not to make the website *look* like an accurate astrology platform.

The goal is to make the software:

```text
consistent
+
reproducible
+
location-aware
+
time-aware
+
transparent
+
testable
+
maintainable
```

and then present the resulting traditional astrology calculations clearly to customers.

**Calculation accuracy and traditional interpretation must always remain separate concepts.**
