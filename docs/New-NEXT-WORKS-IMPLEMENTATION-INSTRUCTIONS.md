# CodePackr Astro — Next Works Implementation Instructions

## Purpose

Implement the remaining fixes identified in the latest repository validation.

The current Astro project is substantially implemented, but the following areas must be corrected before calling the current release production-ready:

1. Merge Tamil Calendar and Panchangam into one canonical product/page.
2. Remove duplicate/legacy sunrise and sunset calculation logic.
3. Strengthen location verification.
4. Implement real IANA timezone resolution and historical UTC offset handling.
5. Make Jathagam report mode URL-driven.
6. Migrate legacy root query URLs to canonical `/jathagam` URLs.
7. Integrate automated tests into CI.
8. Reconcile the production calculation profile with the actual default school/configuration.
9. Strengthen daily Panchangam calculation architecture so event/interval data is authoritative.
10. Preserve all existing working features and avoid unrelated redesign.

---

# 1. Mandatory Engineering Rules

- Do not rewrite the Astro project from scratch.
- Do not remove existing working astrology tools.
- Do not introduce dark mode.
- Do not duplicate calculation engines.
- UI components must not independently calculate astrology.
- Keep calculation logic centralized under `src/lib/astro`.
- Keep tool metadata centralized in `src/lib/tools/astro-tools.ts`.
- Preserve Tamil-first UX.
- Preserve bilingual labels where already implemented.
- Do not silently fall back to Chennai/Madras when location or timezone data is missing.
- Do not fabricate astronomical values.
- If an astronomical event is unavailable at a location/date, represent it as unavailable/null with a clear UI state.
- Do not claim prediction accuracy beyond what the calculation engine can substantiate.
- Separate astronomical calculation accuracy from traditional interpretation.
- Every production calculation result should remain reproducible from:
  - input data
  - calculation profile
  - location
  - timezone
  - ephemeris/astronomy engine version
  - rule/version metadata

---

# 2. P0 — Merge Tamil Calendar + Panchangam

## Objective

Make `/tamil-calendar` the single canonical Tamil Calendar + Daily Panchangam experience.

Do NOT maintain two independent products for Tamil Calendar and Panchangam.

## Required architecture

Canonical route:

`/tamil-calendar`

Display title:

`தமிழ் காலண்டர் & தினசரி பஞ்சாங்கம்`

The page must combine:

### Calendar layer
- Gregorian date
- Tamil date
- Tamil month
- Tamil year
- 60-year Samvatsara
- weekday
- Tamil solar month
- solar ingress information
- festivals/observances
- special days
- eclipse information where applicable

### Panchangam layer
- Tithi
- Tithi start/end
- Nakshatra
- Pada
- Nakshatra start/end
- Yoga
- Yoga start/end
- Karana
- Karana transitions
- sunrise
- sunset
- moonrise
- moonset
- Moon Rasi
- Sun Rasi
- Rahu Kalam
- Yamagandam
- Gulikai
- Abhijit Muhurtham where supported
- Durmuhurtham
- Varjyam
- Amritakalam where supported
- Choghadiya where profile supports it
- Gowri where profile supports it
- Moon phase
- planetary positions where applicable
- retrograde indicators
- ingress information
- eclipses

## Route behavior

### `/tamil-calendar`

Must render the combined product.

### `/panchangam`

Do NOT maintain a separate implementation.

Choose one of these approaches:

Preferred:

`/panchangam` -> redirect to `/tamil-calendar`

Alternative:

`/panchangam` -> render the same canonical component/engine without duplicating calculation logic.

The preferred approach is an actual browser URL migration/redirect.

## Tool registry

Update:

`src/lib/tools/astro-tools.ts`

Remove the separate independent Panchangam product entry.

The registry should expose the canonical Tamil Calendar product.

If `/panchangam` must remain discoverable for backward compatibility, mark it explicitly as an alias/redirect rather than a separate tool.

## Tests

Replace the current test that expects two Panchangam tools.

Remove logic equivalent to:

```ts
expect(panchangamTools.length).toBeGreaterThanOrEqual(2);
```

Add assertions that:

- `/tamil-calendar` exists.
- `/panchangam` is an alias/redirect if retained.
- no second independent Panchangam implementation exists.
- both routes ultimately use the same canonical page/calculation architecture.

---

# 3. P0 — Remove Legacy Sunrise/Sunset Calculation

## Problem

There are currently multiple sunrise/sunset calculation paths.

The newer astronomy module has correct unavailable-event handling, but legacy `src/lib/astro/engine.ts` still contains its own `sunTimes()` implementation and fabricated fallback values.

Remove this duplication.

## Required action

Inspect:

`src/lib/astro/engine.ts`

Find the legacy implementation containing logic equivalent to:

```ts
const toJd = (tm: AstroTime | null, fallbackHour: number) => {
  if (!tm) return julianDay(year, month, day, fallbackHour - tz);
  return tm.ut + 2451545.0;
};
```

and logic equivalent to:

```ts
const nextSunriseJD = nextRise
  ? nextRise.ut + 2451545.0
  : sunriseJD + 1;
```

Remove this fallback behavior.

## Required architecture

All sunrise/sunset/moonrise/moonset calculations must use the centralized astronomy implementation.

Expected module:

`src/lib/astro/astronomy/sunrise.ts`

or the project's final centralized astronomy module.

No calculation module may fabricate:

- 06:00 sunrise
- 18:00 sunset
- next sunrise = current sunrise + 1 day

when the astronomical event does not exist.

## Required unavailable behavior

For polar or otherwise unavailable events:

```ts
sunrise: null
sunset: null
moonrise: null
moonset: null
```

or the project's equivalent explicit unavailable representation.

UI must display a meaningful message rather than a fake time.

## Tests

Add tests for:

- normal Chennai-like location
- high latitude location
- polar day
- polar night
- unavailable sunrise
- unavailable sunset
- no fabricated fallback values

---

# 4. P0/P1 — Strengthen Location Verification

## Current issue

Finite latitude/longitude plus a place name can currently be treated as verified.

That is not sufficient for production location validation.

## Required model

Distinguish:

### Verified location

User selected a known location from the application's location resolver.

It contains:

- place name
- latitude
- longitude
- IANA timezone
- timezone source
- validation status

### User-supplied coordinates

User manually entered coordinates.

These may be valid numerically but must not automatically be labelled as verified.

### Invalid/missing location

Do not calculate production chart data.

## Required rule

Only set:

```ts
locationVerified: true
```

after successful location resolution/selection.

Do not infer verification from:

```ts
Number.isFinite(lat) &&
Number.isFinite(lon) &&
place?.trim().length > 0
```

## UI

Birth form must clearly distinguish:

- Verified location
- Manual coordinates
- Missing/invalid location

Do not silently use Chennai as fallback.

## Receipt

Calculation receipt should contain:

- place
- latitude
- longitude
- verification status
- IANA timezone
- timezone source
- UTC offset at birth

---

# 5. P0/P1 — Implement Real IANA Timezone Resolution

## Problem

The current timezone resolver relies on bounding boxes, longitude estimates, and limited hardcoded regions.

That does not satisfy the production requirement of real IANA timezone resolution.

## Required

Use an actual IANA timezone database/resolution mechanism compatible with the project.

The final calculation must resolve:

```text
latitude
longitude
date/time
        ↓
IANA timezone
        ↓
historical UTC offset
        ↓
UTC instant
        ↓
astronomical calculation
```

## Important

Do not use:

```text
longitude / 15
```

as the authoritative timezone calculation.

Do not use today's UTC offset for historical dates.

## Required receipt fields

Example:

```text
timezone:
Asia/Kolkata

timezoneSource:
IANA tzdb

utcOffset:
+05:30

offsetAtBirth:
+05:30
```

For locations with DST/history, the offset must correspond to the actual birth date/time.

## Tests

Include:

- India
- a DST-observing location
- a historical date
- a date around a DST transition
- timezone boundary locations

---

# 6. P1 — Make Jathagam Report Mode URL-Driven

## Problem

The tool registry exposes:

```text
/jathagam?mode=one
/jathagam?mode=six
/jathagam?mode=thirty
```

but `JathagamDashboard` currently initializes report mode locally:

```ts
const [mode, setMode] = useState<ReportMode>("one");
```

Therefore a deep link can ignore the requested mode.

## Required

Parse URL query parameter:

```text
mode
```

Accepted values:

```text
one
six
thirty
```

Use the URL value as the initial state.

Invalid/missing values must default to:

```text
one
```

## Required behavior

Opening:

`/jathagam?mode=six`

must display the 6-page report.

Opening:

`/jathagam?mode=thirty`

must display the 30-page report.

Opening:

`/jathagam?mode=one`

must display the 1-page report.

## Print URL

Update print URLs so they use the canonical route:

```text
/jathagam?print=auto&mode=...
```

Do not generate:

```text
/?print=auto&mode=...
```

unless there is a deliberate compatibility reason.

## Tests

Add tests for:

- mode=one
- mode=six
- mode=thirty
- invalid mode
- missing mode
- print mode preservation

---

# 7. P1 — Migrate Legacy Root Query URLs

## Problem

Current URL resolution can internally interpret legacy root queries such as:

```text
/?d=...
/?print=auto
```

as Jathagam.

However, this does not necessarily change the browser URL.

## Required

Implement actual URL migration using:

```ts
history.replaceState(...)
```

or the project's routing mechanism.

Example:

```text
/?
d=...
```

should become the canonical:

```text
/jathagam?...
```

without causing an unnecessary full reload.

## Requirements

- preserve query parameters
- preserve mode
- preserve print state
- preserve birth-data parameters where applicable
- avoid redirect loops
- do not break existing bookmarks

## Tests

Test:

- old root URL
- root print URL
- root URL with mode
- root URL with birth details
- already-canonical `/jathagam` URL

---

# 8. P0 — Add Tests to CI

## Current issue

Tests exist locally, but CI currently validates lint/build without running the test suite.

## Required workflow change

In the GitHub Actions workflow add:

```yaml
- name: Run Tests
  run: npm test
```

Recommended order:

```yaml
- name: Install dependencies
  run: npm ci

- name: Run Tests
  run: npm test

- name: Run Lint
  run: npm run lint

- name: Build
  run: npm run build
```

If the project uses another existing installation command, preserve the existing package-manager strategy.

## CI must fail when

- tests fail
- lint fails
- TypeScript fails
- build fails

Do not configure CI to ignore test failures.

---

# 9. P0 — Reconcile Production Calculation Profile

## Important

The documented production profile and actual code defaults must match.

The locked production profile currently specifies:

- Sidereal zodiac
- Lahiri / Chitrapaksha Ayanamsa
- Mean Rahu/Ketu
- Whole Sign houses
- Thirukanitham-oriented Tamil Panchanga/calendar
- Vimshottari Dasa
- Astronomy Engine
- IANA timezone database

Inspect all defaults, especially:

- `src/lib/astro/samples.ts`
- `DEFAULT_INPUT`
- Birth form defaults
- engine defaults
- calculation profile
- chart generation defaults
- Panchangam defaults

Current code contains defaults/examples using:

```ts
school: "thirukanitham"
```

and some examples use:

```ts
school: "lahiri"
```

Do not silently assume these are equivalent.

## Required

Define one explicit production calculation profile.

Example conceptual structure:

```ts
PRODUCTION_PROFILE = {
  zodiac: "sidereal",
  ayanamsa: "lahiri",
  node: "mean",
  houseSystem: "whole-sign",
  panchangaSchool: "thirukanitham",
  dasha: "vimshottari",
  astronomyEngine: "...",
  timezoneSource: "IANA"
}
```

Use the correct project enum/types.

The important requirement is that:

- astrology profile
- Panchanga profile
- UI defaults
- documentation
- receipts
- tests

all agree.

Do not confuse `school` used for Panchanga calculations with `ayanamsa` used for the sidereal chart.

---

# 10. P1 — Strengthen Daily Panchangam Architecture

## Current concern

`computeDailyPanchang()` currently calculates a local-noon snapshot for some Panchanga values and uses sunrise/sunset for muhurta.

The production specification requires event/interval-based Panchangam data.

## Required architecture

For each requested date/location:

1. Resolve exact local date.
2. Resolve IANA timezone.
3. Determine UTC interval covering local calendar day.
4. Calculate astronomical state across the day.
5. Detect transitions for:
   - Tithi
   - Nakshatra
   - Pada
   - Yoga
   - Karana
   - Rasi ingress
6. Store start/end times for each interval.
7. Calculate sunrise/sunset/moonrise/moonset separately.
8. Calculate Rahu Kalam/Yamagandam/Gulikai based on the correct sunrise/sunset day boundaries.
9. Calculate optional regional muhurta systems only when the selected profile supports them.
10. Expose a timeline sorted chronologically.

## Important

Do not use a noon snapshot as the authoritative daily Panchangam representation.

A noon snapshot may be retained for performance/internal summary only if the complete transition data remains authoritative.

---

# 11. P1 — Build Full-Day Panchangam Timeline

The combined Tamil Calendar page should expose a chronological timeline.

Example:

```text
06:12  Sunrise
07:04  Tithi changes
08:31  Nakshatra changes
09:15  Rahu Kalam begins
10:42  Yoga changes
11:50  Karana changes
13:22  Nakshatra Pada changes
18:21  Sunset
19:05  Moonrise
```

The exact values must come from the calculation engine.

Do not hard-code sample values.

The timeline should support:

- event type
- start time
- end time where applicable
- local timezone
- source/rule identifier
- calculation version

---

# 12. P1 — Calculation Receipt

Every Jathagam and Panchangam calculation should be reproducible.

Add/verify a calculation receipt containing:

```text
Calculation ID
Timestamp
Input date/time
Location
Latitude
Longitude
Location verification
IANA timezone
UTC offset at calculation instant
Zodiac
Ayanamsa
Node model
House system
Panchanga school
Dasa system
Astronomy engine
Ephemeris/data version where applicable
Rule-set version
Application version
```

Where practical, generate a deterministic input/configuration hash.

Do not expose sensitive information unnecessarily.

---

# 13. P1 — Test Boundary Conditions

Add automated tests for:

## Birth chart

- Ascendant boundary
- sign boundary
- nakshatra boundary
- pada boundary
- house boundary
- retrograde station
- combustion boundary
- node boundary

## Time

- midnight
- noon
- sunrise
- sunset
- DST transition
- historical timezone offset

## Panchangam

- Tithi transition near midnight
- Nakshatra transition
- Yoga transition
- Karana transition
- solar ingress
- lunar ingress
- unavailable sunrise
- unavailable sunset
- moonrise unavailable

## Location

- India
- northern hemisphere
- southern hemisphere
- high latitude
- timezone boundary

---

# 14. P1 — Route and Product Tests

Update `tests/route-and-foundation.test.ts`.

Required assertions:

### Canonical routes

```text
/
/jathagam
/tamil-calendar
/forecast
/calculation-method
/dev/astro-validation
```

### Jathagam modes

```text
/jathagam?mode=one
/jathagam?mode=six
/jathagam?mode=thirty
```

### Calendar/Panchangam

```text
/tamil-calendar
/panchangam -> canonical alias/redirect
```

### Legacy migration

```text
/?...
```

must migrate to the canonical Jathagam route where applicable.

---

# 15. P1 — Forecast Foundation Review

Do not rewrite the forecast engine yet.

Verify that forecast generation receives structured calculated inputs from the central engine.

Minimum requirements:

- active Dasa lord comes from calculated Dasa data
- Yoga information comes from the calculated chart
- transit data comes from calculated planetary positions
- forecast period dates come from actual Dasa/transit periods
- generic template text cannot override calculated facts

Keep generic interpretive language only where it is explicitly labelled as traditional interpretation.

Do not introduce numerical certainty/probability scores.

---

# 16. P2 — Documentation Synchronization

Update:

- README
- calculation-method documentation
- tool registry documentation
- development validation documentation
- route documentation

Documentation must agree with actual code.

Do not document:

- Swiss Ephemeris if the implementation uses Astronomy Engine
- IANA timezone support if the implementation is still only a heuristic
- Lahiri as default if code uses another default
- combined Tamil Calendar/Panchangam if two independent implementations remain

Documentation claims must only be made after implementation and tests confirm them.

---

# 17. P2 — Developer Validation Page

Use:

`/dev/astro-validation`

to expose internal checks for:

- profile
- timezone
- location
- sunrise/sunset
- Moon events
- Panchanga transitions
- chart boundaries
- Dasa
- Vargas
- forecast input consistency

This page is for development/QA and must not become a customer-facing marketing page.

---

# 18. Required Implementation Order

Follow this exact order.

### Phase A — P0 correctness

1. Merge Calendar/Panchangam architecture.
2. Remove legacy sunrise/sunset fallback.
3. Implement/complete IANA timezone resolution.
4. Strengthen location verification.
5. Reconcile calculation profile/defaults.
6. Add tests to CI.

Do not proceed to final production sign-off until Phase A passes.

### Phase B — P1 routing/data correctness

7. Fix Jathagam URL mode.
8. Fix canonical print URL.
9. Implement legacy URL migration.
10. Strengthen daily Panchangam event/interval calculation.
11. Add full-day timeline.
12. Add calculation receipt.
13. Expand boundary/timezone/location tests.

### Phase C — P2 quality/documentation

14. Review forecast foundation.
15. Synchronize documentation.
16. Improve `/dev/astro-validation`.
17. Remove dead/duplicate code.
18. Run final lint/test/build validation.

---

# 19. Final Acceptance Criteria

The implementation is ready for the next release only when ALL of the following are true:

## Architecture

- [ ] One canonical Tamil Calendar + Panchangam product.
- [ ] No duplicate Panchangam UI implementation.
- [ ] No duplicate sunrise/sunset engine.
- [ ] Central calculation engine remains authoritative.
- [ ] UI does not perform independent astrology calculations.

## Location/Time

- [ ] Location verification is explicit.
- [ ] No silent Chennai fallback.
- [ ] IANA timezone is resolved correctly.
- [ ] Historical UTC offset is correct.
- [ ] DST cases are tested.

## Jathagam

- [ ] `/jathagam?mode=one` works.
- [ ] `/jathagam?mode=six` works.
- [ ] `/jathagam?mode=thirty` works.
- [ ] Print URL is canonical.
- [ ] Legacy root URLs migrate correctly.

## Panchangam

- [ ] Tithi transitions are calculated.
- [ ] Nakshatra transitions are calculated.
- [ ] Yoga transitions are calculated.
- [ ] Karana transitions are calculated.
- [ ] Sunrise/sunset are astronomical events.
- [ ] Moonrise/moonset are astronomical events.
- [ ] Unavailable events are represented honestly.
- [ ] Full-day timeline is available.
- [ ] Location-specific calculation works.

## Calculation profile

- [ ] Zodiac profile is explicit.
- [ ] Lahiri/Ayanamsa configuration is explicit and consistent.
- [ ] Mean node model is explicit.
- [ ] Whole Sign house system is explicit.
- [ ] Panchanga school is explicit.
- [ ] Vimshottari Dasa is explicit.
- [ ] Astronomy engine is explicit.
- [ ] Timezone source is explicit.

## Testing

- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] CI runs tests.
- [ ] Boundary tests pass.
- [ ] Timezone tests pass.
- [ ] Panchangam transition tests pass.

## Deployment

- [ ] GitHub CI passes.
- [ ] Vercel deployment succeeds.
- [ ] Production route smoke tests pass.
- [ ] No console/runtime errors on the changed routes.
- [ ] No broken existing Astro tools.

---

# 20. Git Commit Strategy

Use small, logically isolated commits.

Recommended:

```text
fix(astro): unify tamil calendar and panchangam routes
fix(astro): remove legacy sunrise fallback calculations
fix(astro): strengthen location verification
fix(astro): resolve historical iana timezone offsets
fix(jathagam): support report mode query parameters
fix(routing): migrate legacy root astrology URLs
test(astro): add panchangam and timezone boundary coverage
ci: run astro test suite
fix(astro): reconcile production calculation profile
refactor(astro): centralize daily panchangam event calculations
docs(astro): synchronize calculation profile documentation
```

Do not combine unrelated changes into one large commit.

---

# 21. Final Validation Command

Before opening the PR, run the project's normal validation commands.

At minimum:

```bash
npm test
npm run lint
npm run build
```

If the project has additional validation commands, run them as well.

Record:

- test result
- lint result
- build result
- affected routes
- changed calculation modules
- changed tests
- deployment result

---

# 22. PR Description Requirements

The PR must include:

## Summary

What was changed.

## Calculation changes

What calculation paths changed.

## Route changes

What routes changed and what redirects/aliases were added.

## Compatibility

How existing bookmarks/URLs are handled.

## Tests

Exact test commands and results.

## Risk

Any remaining known limitations.

## Production verification

Confirm:

- CI status
- build status
- deployment status
- route smoke-test status

---

# Important Final Rule

Do not mark the Astro implementation as "final" merely because TypeScript, lint, and build pass.

Production sign-off requires:

1. Correct calculation architecture.
2. Correct location/timezone handling.
3. Correct event-based Panchangam data.
4. Correct canonical routing.
5. Automated test execution in CI.
6. Documentation matching implementation.
7. No fabricated astronomical fallback values.
8. Existing functionality preserved.
