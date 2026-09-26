# Forecast Engine & Astrological Rule Evaluation

CodePackr Astro features an evidence-grounded **Multi-Horizon Forecast Engine** accessible at `/forecast`.

The engine evaluates traditional astrological influences across 16 life domains over flexible temporal horizons ranging from 1 year to 60 years.

---

## 1. Architectural Separation

A core engineering principle of CodePackr Astro is the strict separation of astronomical calculation from interpretative prediction:

```text
               ┌─────────────────────────────────────────┐
               │          User Birth Input               │
               │   (Date, Time, Location, Timezone)      │
               └────────────────────┬────────────────────┘
                                    ↓
               ┌─────────────────────────────────────────┐
               │    Central Astro Calculation Engine     │
               │  (VSOP87, ELP2000, Thirukanitham Ayan)   │
               └────────────────────┬────────────────────┘
                                    ↓
               ┌─────────────────────────────────────────┐
               │       Structured Chart Evidence         │
               │ • Planetary Longitudes & Vargas (D1..D60)│
               │ • Whole Sign House Lords & Occupants     │
               │ • Vimshottari Maha Dasa & Bhukti Spans  │
               │ • Real-time Gochara Transits            │
               │ • Ashtakavarga Bindu Quantities         │
               └────────────────────┬────────────────────┘
                                    ↓
               ┌─────────────────────────────────────────┐
               │   Classical Jyotish Rule Evaluator      │
               │  (Parashari Rules & Tamil Traditions)   │
               └────────────────────┬────────────────────┘
                                    ↓
               ┌─────────────────────────────────────────┐
               │   Evidence-Structured Multi-Year Report │
               │ • 16 Life Domains                       │
               │ • Supporting Astronomical Factors       │
               │ • Qualitative Support Level             │
               │ • Traditional Narrative Interpretation  │
               └─────────────────────────────────────────┘
```

**Zero AI Astronomy:** No Large Language Model (LLM) or external AI service is ever permitted to compute celestial positions, dates, house cusps, or Dasa periods. Predictions are grounded exclusively in structured astronomical data.

---

## 2. Multi-Horizon Breakdown

The level of temporal detail scales naturally with the duration of the chosen horizon:

| Horizon | Granularity | Scope & Astronomical Focus |
| :--- | :--- | :--- |
| **1 Year (`1yr`)** | Monthly (12 Periods) | Fast lunar transits, Sun ingress (Sankrantis), Antardasa (Bhukti) transitions, and short-term planetary dignity. |
| **3 Years (`3yr`)** | Yearly / Seasonal | Jupiter transits (Guru Peyarchi), Rahu-Ketu nodal shifts, and major Bhukti shifts. |
| **5 Years (`5yr`)** | Yearly (5 Periods) | Saturn transit phases (Sade Sati / Ashtama Sani), Jupiter aspects, and major Dasa lord shifts. |
| **10 Years (`10yr`)** | Major Phases | Long-term Maha Dasa transitions (e.g. Venus 20y to Sun 6y) and foundational lifecycle alignments. |
| **20 Years (`20yr`)** | Lifecycle Themes | Decadal evolution, career culmination, family expansions, and spiritual orientations. |
| **60 Years (`60yr`)** | Jovian Cycle | Broad 60-year Tamil Samvatsara cycles and complete Vimshottari 120-year half-cycle themes. |

---

## 3. The 16 Evaluated Life Domains

Every horizon period evaluates 16 classical life domains (*பாவ பலன்கள்*):

1. **Career & Profession (தொழில் / உத்தியோகம்):** 10th House, 10th Lord, Saturn transit, Sun strength.
2. **Wealth & Finance (தனம் & சேமிப்பு):** 2nd & 11th Houses, Jupiter transit, Dhana Yogas.
3. **Health & Vitality (உடல் நலம் / ஆரோக்கியம்):** 1st & 6th Houses, Lagna Lord dignity, Mars/Sun conditions.
4. **Marriage & Relationship (திருமணம் & களத்திரம்):** 7th House, Venus placement, 7th Lord dignity.
5. **Higher Education (உயர்கல்வி & அறிவு):** 4th & 5th Houses, Mercury, Jupiter aspects.
6. **Family & Domestic Life (குடும்பம் & சுகம்):** 2nd & 4th Houses, Moon condition.
7. **Children & Progeny (புத்திர பாக்கியம்):** 5th House, Jupiter (Putrakaraka), 5th Lord dignity.
8. **Real Estate & Property (நிலம் & வாகனங்கள்):** 4th House, Mars (Bhumikaraka), Venus (Vahanakaraka).
9. **Spiritual Growth (ஆன்மீகம் & தர்மம்):** 9th & 12th Houses, Jupiter, Ketu condition.
10. **Foreign Travel & Relocation (வெளிநாட்டுப் பயணம்):** 9th & 12th Houses, Rahu transit, movable sign influences.
11. **Litigation & Competitions (வழக்குகள் & வெற்றி):** 6th House, Mars strength, Shatru Bala.
12. **Longevity & Sudden Events (ஆயுள் & எதிர்பாராதவை):** 8th House, Saturn (Ayushkaraka), 8th Lord condition.
13. **Father & Lineage (தந்தை & பித்ரு வழி):** 9th House, Sun (Pitrukaraka), 9th Lord dignity.
14. **Mother & Maternal Comforts (தாய் & மாத்ரு வழி):** 4th House, Moon (Matrukaraka), 4th Lord dignity.
15. **Friendship & Social Influence (நண்பர்கள் & செல்வாக்கு):** 11th House, Mercury condition.
16. **Mental Peace & Sleep (மன நிம்மதி & தூக்கம்):** 12th House, Moon strength, benefic aspects.

---

## 4. Evidence Support Levels

To avoid misleading certainty, predictions are never assigned numeric probability percentages (e.g., "87% chance"). Instead, the engine assigns qualitative support levels based on the balance of supporting and mitigating astrological rules:

- **Strong (வலுவான சுப பலன்):** Multiple benefics aspecting the house; exalted or own-sign house lord; favorable Dasa-Bhukti lord; supporting Ashtakavarga bindus (>28).
- **Moderate (மிதமான சுப பலன்):** Beneficial Dasa with neutral transits, or favorable transits with mild natal affliction.
- **Mixed (கலவையான பலன்):** Equal distribution of auspicious aspects and challenging placements.
- **Caution (கவனமும் விழிப்புணர்வும் தேவை):** Challenging transits (Ashtama Sani, Kandaka Sani); 6th/8th/12th lord periods; combustion or debilitation of significators.
- **Insufficient Evidence (குறிப்பிடத்தக்க தாக்கம் இல்லை):** Planetary factors are neutral or conflicting; no dominant classical rule triggered.
