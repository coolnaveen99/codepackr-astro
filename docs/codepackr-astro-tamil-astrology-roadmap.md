# CodePackr Astro — Granular Tamil Astrology Tools Roadmap

## Project

- **Repository:** `coolnaveen99/codepackr-astro`
- **Production site:** `astro.codepackr.com`
- **Primary goal:** Build a reliable Tamil/South-Indian astrology toolkit with clear calculations, Tamil-first terminology, transparent methodology, reusable calculation modules, and detailed user-facing explanations.
- **Current constraint:** Vercel deployment quota may temporarily prevent frequent production deployments. Complete and validate grouped changes before deploying.

---

# 0. Non-Negotiable Engineering & Astrology Standards

## 0.1 Calculation integrity

Every calculator MUST:

1. Separate input validation, astronomy, astrology rules, scoring, interpretation, and UI.
2. Reuse the central astrology engine instead of duplicating planetary calculations.
3. Never use random values, placeholder calculations, hard-coded user-specific results, or fake precision.
4. Clearly distinguish:
   - astronomical calculation,
   - traditional astrological rule,
   - interpretation.
5. Preserve the selected calculation school consistently:
   - Thirukanitham
   - Lahiri
   - Vakya
   - any future school added to the application.
6. Never silently substitute one ayanamsa/calculation school for another.
7. Record the methodology used in generated reports.
8. Add boundary-condition tests for every angular/time calculation.

## 0.2 Tamil terminology

Use **standard Tamil astrology terminology**, not literal machine translation.

Examples:

- ராசி
- நட்சத்திரம்
- பாதம்
- லக்னம்
- பாவம்
- கிரகம்
- தசை
- புத்தி
- கோசாரம்
- அயனாம்சம்
- பஞ்சாங்கம்
- திதி
- யோகம்
- கரணம்
- ஓரை
- ராகு காலம்
- எமகண்டம்
- குளிகை
- முகூர்த்தம்
- தினம்
- கணம்
- மகேந்திரம்
- ஸ்திரீ தீர்க்கம்
- யோனி
- ராசி
- ராசியதிபதி
- வசியம்
- ரஜ்ஜு
- வேதை

Do NOT force artificial "pure Tamil" replacements where established astrology terminology is conventionally used.

## 0.3 Tamil UI requirements

For `ta`:

- No unnecessary English explanatory sentences.
- No awkward transliteration of English words where a standard Tamil astrology term exists.
- Technical abbreviations such as D1, D9, D10, SAV can remain where useful, but provide Tamil expansion.
- Avoid duplicate English/Tamil text unless it genuinely improves clarity.
- Use proper Tamil nakshatra names and Pada syllables.
- Ensure AM/PM and date/time labels have Tamil equivalents where practical.
- Keep brand names such as CodePackr unchanged.

## 0.4 User education

Every advanced result should explain:

- What was calculated.
- Which traditional rule was used.
- What the result means.
- What the result does NOT mean.
- Any limitations or alternative traditions.

Avoid presenting traditional astrological interpretations as scientifically established facts.

---

# 1. Architecture Before New Features

## 1.1 Create reusable modules

Before adding many calculators, organize reusable logic into modules such as:

```text
src/lib/astro/
├── engine.ts
├── astronomy.ts
├── ayanamsa.ts
├── panchanga.ts
├── muhurtham.ts
├── gochara.ts
├── nakshatra.ts
├── dosham.ts
├── bhava.ts
├── varga.ts
├── ashtakavarga.ts
├── porutham.ts
├── dasha.ts
├── arudha.ts
├── jaimini.ts
├── numerology.ts
├── naming.ts
├── pancha-pakshi.ts
├── validation.ts
├── interpretation.ts
├── i18n.ts
└── tables.ts
```

Do not move working code unnecessarily. Refactor incrementally.

## 1.2 Shared data contracts

Create TypeScript types for:

- `BirthInput`
- `Location`
- `PlanetPosition`
- `NakshatraPosition`
- `PanchangaResult`
- `TimeInterval`
- `TransitResult`
- `DoshaResult`
- `MuhurthamResult`
- `VargaResult`
- `AshtakavargaResult`
- `CalculationMetadata`

Each result should contain enough metadata to reproduce the calculation.

## 1.3 Calculation metadata

Every major calculator should expose:

```ts
{
  school,
  ayanamsa,
  latitude,
  longitude,
  timezone,
  inputDateTime,
  calculationVersion
}
```

## 1.4 Testing structure

Add:

```text
tests/
├── astro/
├── panchanga/
├── gochara/
├── muhurtham/
├── porutham/
├── varga/
├── dosham/
└── tamil/
```

Use fixed reference charts and dates for regression tests.

---

# PHASE 1 — Core Tamil Astro Utilities

## Phase 1 Objective

Add five highly reusable tools:

1. சந்திராஷ்டமம்
2. கோசார கணிப்பான்
3. நட்சத்திரம் + பாதம்
4. குழந்தைப் பெயர் தேர்வு
5. நாழிகை மாற்றி

---

## 1A. Chandrashtama Calculator

### User input

- Birth Rasi OR birth Nakshatra
- Optional date range
- Location
- Calculation school

### Calculation

1. Determine Janma Rasi.
2. Determine Janma Nakshatra.
3. Determine current/future Moon sidereal longitude.
4. Determine transit Moon Rasi.
5. Calculate the traditional Chandrashtama condition.
6. Generate exact start/end timestamps based on Moon's actual sign transition.
7. Do NOT approximate the entire day as Chandrashtama when the Moon changes sign during the day.

### Output

Show:

- சந்திராஷ்டமம் தொடக்கம்
- சந்திராஷ்டமம் முடிவு
- சந்திரன் இருக்கும் ராசி
- பிறந்த ராசி
- நட்சத்திரம்
- பாதம்
- தேதி
- நேரம்
- இடம்
- calculation school

### Important

Do not make universal claims such as "nothing should be done." Explain that Chandrashtama is a traditional astrological timing consideration and practices vary.

### Tests

- Moon sign boundary
- Midnight crossing
- DST/timezone if applicable
- Different Janma Rasis
- 30°→0° wrap-around

---

# 1B. Gochara Calculator

## Objective

Calculate planetary transits against a birth chart.

### Inputs

- Birth date
- Birth time
- Birth place
- Current date OR selected date range
- Calculation school

### Planets

- Sun
- Moon
- Mars
- Mercury
- Jupiter
- Venus
- Saturn
- Rahu
- Ketu

### Output

For each planet:

```text
கிரகம்
தற்போதைய ராசி
ராசியில் பாகை
பிறந்த ராசியிலிருந்து பாவம்
பிறந்த நட்சத்திரத்திலிருந்து நிலை
வக்ரம்/நேர்கதி
நுழைந்த தேதி
வெளியேறும் தேதி
```

### Special calculations

Implement:

- ஏழரைச் சனி
- அஷ்டமச் சனி
- கண்டகச் சனி
- குரு கோசாரம்
- ராகு/கேது கோசாரம்
- சந்திராஷ்டமம்

### Timeline

Create a visual timeline:

```text
01 Jan ─── 15 Jan ─── 30 Jan ─── 15 Feb
       Saturn
       Jupiter
       Rahu
```

### Tests

- Retrograde station
- Sign ingress
- Rahu/Ketu always 180° apart
- Sign wrap-around
- Leap year
- timezone

---

# 1C. Nakshatra + Pada Calculator

## Input

Either:

- date/time/place, OR
- longitude

### Output

- ராசி
- நட்சத்திரம்
- பாதம்
- நட்சத்திர அதிபதி
- தெய்வம்
- கணம்
- யோனி
- நாடி
- நட்சத்திரத்தின் 4 பாத எழுத்துகள்
- தொடர்புடைய பெயரிடும் எழுத்து

### Tamil validation

Audit all 27:

1. அசுவினி
2. பரணி
3. கார்த்திகை
4. ரோகிணி
5. மிருகசீரிடம்
6. திருவாதிரை
7. புனர்பூசம்
8. பூசம்
9. ஆயில்யம்
10. மகம்
11. பூரம்
12. உத்திரம்
13. ஹஸ்தம்
14. சித்திரை
15. சுவாதி
16. விசாகம்
17. அனுஷம்
18. கேட்டை
19. மூலம்
20. பூராடம்
21. உத்திராடம்
22. திருவோணம்
23. அவிட்டம்
24. சதயம்
25. பூரட்டாதி
26. உத்திரட்டாதி
27. ரேவதி

Verify every Pada syllable independently.

---

# 1D. Baby Name Finder

## Objective

Generate/search names based on Nakshatra + Pada.

### Input

- Child gender: optional
- Nakshatra
- Pada
- Tamil/English preference
- Optional starting letter
- Optional meaning category

### Data model

Create a structured name dataset:

```ts
{
  nameTa,
  transliteration,
  gender,
  meaningTa,
  meaningEn,
  startingSyllable,
  nakshatra,
  pada,
  source
}
```

### Important

Do not fabricate meanings.

Where the application has no verified meaning/source, label the meaning as unavailable rather than inventing one.

### UI

Filters:

- ஆண் குழந்தை
- பெண் குழந்தை
- இருபாலருக்கும்
- தமிழ் பெயர்
- பாரம்பரிய பெயர்
- நவீன பெயர்

---

# 1E. Nazhigai Converter

## Input

- Hours/minutes
- Nazhigai
- Vinadi

### Standard conversions

Implement and document:

- 1 நாள் = 60 நாழிகை
- 1 நாழிகை = 60 விநாடி/விநாழிகை according to the selected traditional convention

Do not mix modern seconds with traditional vinadi terminology without explicitly defining the conversion.

### Features

- Time → நாழிகை
- நாழிகை → modern time
- Sunrise-relative time
- Sunset-relative time
- Birth time → traditional time representation

### Tests

Use exact round-trip conversions.

---

# PHASE 2 — Timing, Muhurtham & Advanced Panchangam

## Phase 2 Objective

Build a proper event timing engine.

---

# 2A. Advanced Panchangam

Current implementation uses a noon snapshot. Upgrade it.

### Calculate actual transitions for:

- Tithi
- Nakshatra
- Yoga
- Karana
- Rasi
- Moon sign
- Sunrise
- Sunset

### For each item

Return:

```text
current
start
end
next
```

### Example

```text
திதி: சதுர்த்தி
தொடக்கம்: 06:42
முடிவு: 05:18
```

### Important

Panchangam must be evaluated at the requested local time, not simply at noon.

---

# 2B. Muhurtham Finder

## Events

- திருமணம்
- கிரகப்பிரவேசம்
- பெயர் சூட்டுதல்
- அன்னபிராசனம்
- உபநயனம்
- வாகனம் வாங்குதல்
- தொழில் தொடக்கம்
- பத்திர பதிவு
- பயணம்
- கல்வி தொடக்கம்

### Input

- Event
- Date range
- Location
- Optional birth charts
- Calculation school

### Filters

- Tithi
- Nakshatra
- Weekday
- Yoga
- Karana
- Rahu Kalam
- Yamagandam
- Gulika
- Hora
- Lagna
- Chandrashtama
- Tarabala
- Chandrabala

### Result

Do NOT simply give one "best" time without exposing the rules.

Show:

```text
முகூர்த்த நேரம்
10:24 – 11:18

ஆதாரம்:
✓ திதி
✓ நட்சத்திரம்
✓ சந்திர பலம்
✓ தாரா பலம்
✓ சுப லக்னம்

தவிர்க்கப்பட்டது:
✗ ராகு காலம்
✗ எமகண்டம்
```

---

# 2C. Hora / Orai

Upgrade existing Hora calculation.

### Validate

- Weekday lord
- Planetary sequence
- Sunrise → next sunrise
- Variable day/night duration

### Tamil UI

Use:

**ஓரை**

rather than inconsistent translations.

---

# PHASE 3 — Chart Analysis

---

# 3A. Bhava Calculator

### Calculate

- Bhava start
- Bhava midpoint
- Bhava end
- Planet occupancy
- Bhava lord
- Bhava aspects
- Bhava strength

### Support

- Whole-sign interpretation
- Future Placidus-like systems only if explicitly supported and clearly named

Do not mix house systems.

---

# 3B. Shodasha Varga

Create a dedicated Varga Explorer.

### Minimum Vargas

- D1 ராசி
- D2 ஹோரா
- D3 திரேக்காணம்
- D4 சதுர்த்தாம்சம்
- D7 சப்தாம்சம்
- D9 நவாம்சம்
- D10 தசாம்சம்
- D12 துவாதசாம்சம்
- D16 ஷோடசாம்சம்
- D20 விம்சாம்சம்
- D24 சதுர்விம்சாம்சம்
- D27 சப்தவிம்சாம்சம்
- D30 திரிம்சாம்சம்
- D40
- D45
- D60 ஷஷ்டியாம்சம்

### Requirement

Do not display D40/D45 until their formulas are implemented and tested.

### Each Varga page

Show:

- planet
- D-chart sign
- lord
- house
- dignity
- interpretation

---

# 3C. Ashtakavarga Explorer

## Calculate

- Bhinnashtakavarga for Sun through Saturn
- Sarvashtakavarga
- Sign totals
- House totals
- Transit interpretation

## Advanced

Add:

- Trikona Shodhana
- Ekadhipatya Shodhana

Only label these as implemented after formulas are independently validated.

---

# PHASE 4 — Dosham & Traditional Checks

---

# 4A. Dosham Engine

Create a modular rule engine.

Potential rules:

- செவ்வாய் தோஷம்
- நாக தோஷம்
- காலசர்ப்ப தோஷம்
- பித்ரு தோஷம்
- கிரகண தோஷம்
- கேமத்ருமம்
- சகட யோகம்
- தரித்ர யோகம்
- other documented combinations

### Architecture

```ts
type DoshaRule = {
  id: string;
  nameTa: string;
  nameEn: string;
  evaluate(chart): DoshaResult;
  cancellationRules?: CancellationRule[];
  references: string[];
}
```

### Important

Every Dosha needs:

1. Definition
2. Calculation rule
3. Exceptions/cancellation
4. Strength/degree where applicable
5. Interpretation
6. Tradition/source
7. Disclaimer

Do not label a chart as having a serious dosha based on a simplistic single condition when traditional rules require multiple conditions.

---

# 4B. Yoga Engine

Consolidate existing yoga detection.

Separate:

- Rajayoga
- Dhana Yoga
- Dharma-Karmadhipati
- Gajakesari
- Budha-Aditya
- Neecha Bhanga
- Vipareeta Raja Yoga
- Parivartana
- Lakshmi Yoga
- other documented yogas

### Requirement

Each yoga must have:

```ts
{
  detected,
  strength,
  conditionsMet,
  conditionsMissing,
  explanationTa,
  explanationEn,
  source
}
```

Never report a yoga simply because two planets share a sign if the documented rule requires house lordship/aspect/exchange.

---

# PHASE 5 — Marriage & Compatibility

---

# 5A. Advanced 10 Porutham

Upgrade the current simplified implementation.

### Required

- தினம்
- கணம்
- மகேந்திரம்
- ஸ்திரீ தீர்க்கம்
- யோனி
- ராசி
- ராசியதிபதி
- வசியம்
- ரஜ்ஜு
- வேதை

### Each result

```text
பொருத்தம்
நிலை
காரணம்
கணக்கீடு
மதிப்பீட்டு முறை
```

Do not reduce traditional systems to an arbitrary score unless the scoring convention is explicitly documented.

---

# 5B. Ashtakoota

Current 36-point implementation must be regression-tested.

Validate:

- வர்ணம்
- வசியம்
- தாரா
- யோனி
- கிரக மைத்திரி
- கணம்
- பகூடம்
- நாடி

### Test cases

Create known combinations covering:

- 0
- partial scores
- full scores
- Nadi same
- Bhakoot conflict
- Yoni enemy
- different Gana
- Vashya boundary at 15°

---

# 5C. Marriage Report

Generate a detailed report:

```text
மணமகன்
மணமகள்

10 பொருத்தங்கள்
அஷ்டகூடம்
நட்சத்திரம்
ராசி
தோஷங்கள்
சந்திர பலம்
தாரா பலம்
முக்கிய குறிப்புகள்
```

Avoid a simplistic "MATCH / NO MATCH" conclusion. Explain the individual factors.

---

# PHASE 6 — Gochara & Dasha Intelligence

---

# 6A. Advanced Gochara

Track:

- sign ingress
- retrograde
- direct
- combustion
- conjunction
- aspect
- transit over natal Moon
- transit over natal Lagna
- transit over natal planets

### Timeline

Provide date/time transitions.

---

# 6B. Vimshottari Dasha

Validate:

- Nakshatra balance
- Mahadasha
- Antardasha
- Pratyantardasha

### Output

```text
மகாதசை
அந்தர்தசை
பிரத்யந்தர்தசை
தொடக்கம்
முடிவு
மீதம்
```

### Tests

Use fixed birth charts with known published dasha dates.

Do not claim accuracy until benchmarked.

---

# PHASE 7 — Jaimini & Arudha

---

# 7A. Jaimini Tools

Implement:

- Chara Karaka
- Atmakaraka
- Amatyakaraka
- Bhratrukaraka
- Matrukaraka
- Putrakaraka
- Gnatikaraka
- Darakaraka
- Karakamsha

### Rules

Document tie handling when degrees are equal/near-equal.

---

# 7B. Arudha

Implement:

- Arudha Lagna (AL)
- A2
- A3
- A4
- A5
- A6
- A7
- A8
- A9
- A10
- A11
- A12

### Special rules

Implement exceptions for Arudha placement carefully.

Create unit tests for:

- 1st house
- 4th house
- 7th house
- 10th house
- exception cases

---

# PHASE 8 — Prasna / Horary

## Input

- Question
- Exact question date/time
- Location

## Calculate

- Ascendant
- Moon
- relevant houses
- planetary positions
- Prasna-specific indicators

## UI

```text
கேள்வி:
"இந்த வேலை கிடைக்குமா?"

கேள்வி நேரம்:
...

கேள்வி லக்னம்:
...

கேள்வி சார்ந்த பாவங்கள்:
...
```

Interpretation must clearly identify the traditional rule used.

Do not present horary interpretation as factual certainty.

---

# PHASE 9 — Pancha Pakshi