# Codepackr Astro — Full Free Prediction Roadmap & Implementation Guide

> **Goal**: Make every capability that competing Tamil astrology sites lock behind payment **100% free**, while remaining authentic to Tamil Jothidam (Thirukanitham / Vakya), privacy-first (client-side only), and consistent with the Codepackr family.

**Live site**: https://astro.codepackr.com  
**Repo**: https://github.com/coolnaveen99/codepackr-astro  
**Related**: [codepackr](https://github.com/coolnaveen99/codepackr) · [codepackr-finance](https://github.com/coolnaveen99/codepackr-finance)

---

## 1. Role & Identity

You are extending **Codepackr Astro** — a 100% client-side Tamil Jathagam, Dasakoota Porutham, Panchangam, and Marriage Biodata suite.

- All planetary calculations, phalan text, dasa timelines, remedies, and PDF generation **must execute in the browser**.
- Zero birth data, charts, or personal details may ever leave the device.
- Follow the same privacy, design-system, and branching conventions used in the parent Codepackr repositories (`docs/TEAM_GUIDE.md`, `AGENTS.md` patterns).

---

## 2. Current State Snapshot (as of 2026-09)

### Already implemented (strong foundation)

| Area | Status | Location |
|------|--------|----------|
| Birth form (name, gender, DOB, time, place, 5000+ cities) | ✅ | `src/components/birth-form.tsx`, `birth-fields.tsx` |
| Calculation schools: Thirukanitham (default), Vakya, Lahiri | ✅ | `src/lib/astro/engine.ts` |
| South-Indian Rasi (D1), Navamsa (D9), Drekkana, Dasamsa, Dwadasamsa | ✅ | `engine.ts`, `chart-views.tsx`, `south-chart.tsx` |
| Graha table, dignity, combustion, vargottama, aspects | ✅ | `analysis.ts` |
| Panchangam (tithi, nakshatra, yoga, karana, weekday) | ✅ | `panchangam-view.tsx` |
| Vimshottari Dasa + Bhukti | ✅ | `engine.ts`, ChartViews “dasa” tab |
| Ashtakavarga (SAV) | ✅ | `analysis.ts` |
| Yogas / Doshas (Chevvai, Kaal Sarpa, Sade Sati, basic set) | ✅ | `analysis.ts`, `YogaPane` |
| Gochara | ✅ | `GocharaPane` |
| Tamil Dasakoota Porutham (10 poruthams, உத்தமம்/மத்தியமம்/அதமம், Rajju/Vedha) | ✅ | `porutham-view.tsx`, `analysis.ts` |
| Marriage Biodata (Tamil + English, photo, print/PDF) | ✅ | `biodata-maker.tsx`, `biodata-sheet.tsx` |
| House & planet base readings | ✅ | `src/lib/astro/phalan.ts` |
| Print / PDF helpers | ✅ | `print-helper.ts`, `print-horoscope-sheet.tsx`, `jspdf` + `html2canvas` |
| Tamil / English i18n | ✅ | `src/lib/astro/i18n.ts`, `lang.tsx` |
| Privacy (no server, no storage of charts) | ✅ | Entire architecture |

### Gaps vs. typical “premium / full prediction” Tamil sites

These are the items competitors charge for. We will deliver them free.

1. **Deep structured Phalan** — themed life-area predictions (Marriage & Children, Career, Health, Wealth, Education, Longevity, Foreign travel, Spirituality) tied to house lords, current Dasa/Bhukti, and aspects.
2. **Rich Remedies (பரிகாரம்)** — day-specific vrata, mantra, temple, dana, colour, and traditional suggestions per dosha / yoga / weak planet, with strong disclaimers.
3. **Longer narrative Dasa timeline** — 20–40 year horizon or next 3–5 Mahadasas with short phalan text and current-period highlight.
4. **Expanded Yogas** — Gaja Kesari, Raja Yogas, Vipareeta Raja, Adhi, Pushkara, Dharma-Karmadhipati, etc., with presence + short interpretation.
5. **Basic planetary strength** (optional) — relative strength / simple Shadbala-style scores to explain why a planet is strong or weak.
6. **Focused Transit / Gochara forecasts** — next 12–24 months for Saturn, Jupiter, Rahu/Ketu relative to natal Rasi / Lagna.
7. **Daily / Weekly / Monthly Rasi Palan** — high-engagement free page (no birth data required).
8. **Premium-feeling free PDF report** — multi-section “Full Jathagam Report” (charts + phalan + dasa + remedies + summary).
9. **Supporting tools** — Numerology, improved Muhurta finder, optional simple Prasna, educational glossary tooltips.
10. **Tone & education** — classical, balanced language; short explanations of terms so beginners trust the free depth.

---

## 3. Architecture Rules (Non-Negotiable)

1. **100% client-side**  
   - All new logic lives under `src/lib/astro/` as pure functions.  
   - No fetch of birth data, no analytics that include chart payloads, no remote storage.

2. **Module layout (extend, do not rewrite)**

   ```
   src/lib/astro/
     engine.ts          # positions, dasa, vargas (existing)
     analysis.ts        # yogas, doshas, gochara, porutham (existing)
     phalan.ts          # EXPAND — house / planet / dasa / life-area readings
     predictions.ts     # NEW — themed life predictions + transit narratives
     remedies.ts        # NEW — structured பரிகாரம் data + lookup
     strength.ts        # NEW (optional) — basic relative strength
     rasi-palan.ts      # NEW — daily / weekly text generators
     report.ts          # NEW — assemble full printable report sections
     constants.ts
     tables.ts
     i18n.ts
     samples.ts
   ```

3. **UI components**

   ```
   src/components/
     analysis-panes.tsx     # extend existing panes / tabs
     full-report.tsx        # NEW multi-section free report view
     daily-rasi.tsx         # NEW
     remedies-panel.tsx     # NEW
     ...
   ```

4. **Bilingual**  
   - Every user-facing string must exist in Tamil (primary) and English.  
   - Prefer existing `t(lang, key)` / `i18n` patterns; extend keys rather than hard-coding.

5. **Design system**  
   - Match Codepackr visual language: surface cards, accent colour, rounded-xl / rounded-2xl, high-contrast text.  
   - Print / PDF styles already exist — reuse and extend.

6. **Build & docs**  
   - `docs/**` is documentation only. Vite + `tsc` only process `src/` and `index.html`.  
   - Adding files under `docs/` does **not** affect the production build.  
   - See `.gitignore` comments and Section 8 below.

---

## 4. Granular Implementation Plan

### Phase 1 — High-impact “full free prediction” (do first)

#### 4.1 Expand `phalan.ts` + create `predictions.ts`

**Objective**: Turn the current short house/planet notes into rich, contextual, classical phalan.

**Tasks**

1. In `phalan.ts` (or split into `predictions.ts`):
   - Keep existing `houseReading`, `planetReading`, `dasaReading`, `chevvaiText`, `sadeSatiText`.
   - Add structured life-area functions, e.g.:
     - `marriagePhalan(analysis, lang)`
     - `careerPhalan(analysis, lang)`
     - `healthPhalan(analysis, lang)`
     - `wealthPhalan(analysis, lang)`
     - `educationPhalan(analysis, lang)`
     - `longevityPhalan(analysis, lang)`
     - `foreignTravelPhalan(analysis, lang)`
     - `spiritualityPhalan(analysis, lang)`
   - Each function must consider:
     - Relevant house(s) and their lords
     - Occupants and aspects
     - Current Mahadasa / Bhukti
     - Key yogas / doshas already detected in `Analysis`
   - Output: `{ title, paragraphs: string[], notes?: string[] }` (or equivalent bilingual structure).

2. Tone rules:
   - Classical Tamil Jothidam language.
   - Balanced (mention both strength and need for effort).
   - No fear-mongering.
   - Always remind that free will and remedies matter.

3. Data style:
   - Prefer data-driven tables (similar to existing `HOUSE_BASE_TA` / `HOUSE_BASE_EN`) over giant switch statements.
   - Keep texts short enough for mobile but long enough to feel “complete”.

#### 4.2 Create `remedies.ts`

**Objective**: Structured, look-up-friendly remedies.

**Tasks**

1. Define a type, e.g.:
   ```ts
   type Remedy = {
     id: string;
     triggers: string[];          // "chevvai", "sadesati", "kaalsarpa", planet id, etc.
     titleTa: string;
     titleEn: string;
     bodyTa: string;
     bodyEn: string;
     days?: string[];             // e.g. ["tuesday"]
     disclaimer?: boolean;
   };
   ```

2. Populate classical remedies for:
   - Chevvai (Manglik)
   - Sade Sati / Ashtama / Kantaka
   - Kaal Sarpa
   - Combust planets
   - Dusthana lords
   - Weak / enemy-placed planets
   - Common general remedies (Saturday lamp, Guru worship, etc.)

3. Export `getRemediesFor(analysis: Analysis, lang: Lang): RemedyView[]`.

4. UI: new `RemediesPanel` or new tab inside ChartViews that lists applicable remedies with clear “for guidance only” disclaimer.

#### 4.3 Longer narrative Dasa timeline

**Tasks**

1. In ChartViews “dasa” tab (or dedicated pane):
   - Show current Mahadasa + Bhukti prominently.
   - List next N Mahadasas (configurable, default ~30–40 years or next 4–5 lords) with start/end dates and 1–3 sentence phalan from `dasaReading` / new narrative helpers.
2. Highlight the running period.
3. Make the list printable.

#### 4.4 Full free multi-section report

**Tasks**

1. Create `src/components/full-report.tsx` (or expand print path).
2. Sections (order suggestion):
   - Header (name, birth data, calculation school, ayanamsa)
   - Rasi + Navamsa charts
   - Key summary (Rasi, Nakshatra, Lagna, current Dasa, Chevvai / Sade Sati status)
   - Graha table
   - House-by-house phalan
   - Life-area predictions
   - Dasa timeline
   - Yogas & Doshas
   - Remedies
   - Footer disclaimer + Codepackr branding
3. Wire “முழு ஜாதக அறிக்கை / Full Report” button that opens print dialog or generates PDF via existing `jspdf` + `html2canvas` path.
4. Ensure print CSS hides navigation and shows only report content.

### Phase 2 — Engagement & depth

#### 4.5 Daily / Weekly / Monthly Rasi Palan

1. New page / nav item: “ராசி பலன்”.
2. No birth data required.
3. Logic in `rasi-palan.ts`:
   - Current Moon transit + simple classical rules per Rasi.
   - Optional: combine with today’s panchangam (nalla neram, rahu kalam, etc.).
4. Bilingual short paragraphs for each of the 12 Rasis.
5. High SEO / share value — keep light and fast.

#### 4.6 Expanded Yogas

1. Extend the yoga detection list in `analysis.ts`.
2. Add short interpretation strings (Tamil + English) for each.
3. Surface in YogaPane with “present / absent” and brief meaning.

#### 4.7 Basic planetary strength (optional)

1. `strength.ts` — relative dignity + house placement + aspect count → simple score or label (strong / medium / needs support).
2. Show in Graha table or planet reading.

#### 4.8 Transit forecast pane

1. Extend GocharaPane or new “Transits” tab.
2. Focus on Saturn, Jupiter, Rahu, Ketu for next 12–24 months relative to natal Moon / Lagna.
3. Short monthly or quarterly narrative.

### Phase 3 — Supporting tools & polish

- Numerology (name / birth number) — pure client-side.
- Improved Muhurta finder (already partial in panchangam).
- Optional simple Prasna (question chart for “now”).
- Glossary / tooltips for terms (Thirukanitham, Rajju, Vedha, Vargottama, etc.).
- More sample charts for testing.
- SEO: expand meta descriptions, Open Graph, structured data; keep `public/sitemap.xml` accurate.

---

## 5. Content & Authenticity Guidelines

- Prefer classical Tamil Jothidam phrasing and concepts.
- Rasi = Moon sign (already correct in the codebase — never change this).
- Dasakoota stays Tamil 10-porutham system (not North-Indian 36 gunas).
- When adding remedies, keep them traditional and non-medical.
- Always include a clear disclaimer:  
  “இது வழிகாட்டுதல் மட்டுமே. முக்கியமான முடிவுகளுக்கு அனுபவமுள்ள ஜோதிடரை அணுகவும். / This is for guidance only. Consult an experienced jothidar for important decisions.”
- Avoid absolute statements (“you will definitely…”). Prefer “tends to”, “supports”, “needs effort”.

---

## 6. Testing Checklist (before any PR)

- [ ] `npm run lint` (tsc) passes.
- [ ] `npm run build` succeeds.
- [ ] Chart generation works for Thirukanitham, Vakya, and Lahiri.
- [ ] Porutham grades and Rajju/Vedha flags remain correct.
- [ ] New phalan / remedies / report render in both Tamil and English.
- [ ] Print / PDF output is readable and does not leak navigation chrome.
- [ ] No network requests containing birth data (DevTools Network tab).
- [ ] Mobile layout remains usable.
- [ ] Cross-check 2–3 known charts against a trusted Tamil panchangam / software for major points (Rasi, Nakshatra, Lagna, current Dasa).

---

## 7. Branching & PR Process (Codepackr family)

Follow the same model as `codepackr` / `codepackr-finance` (`docs/TEAM_GUIDE.md` pattern):

```
feature/*  →  dev (if used)  →  main
```

Or, if the repo currently uses only `main`:

1. Create branch from latest `main`:  
   `git checkout -b feature/full-free-phalan`
2. Implement one coherent slice (e.g. Phase 1.1 + 1.2).
3. Commit with conventional messages:  
   `feat(astro): expand life-area phalan and remedies`  
   `docs: add FULL_FREE_PREDICTION_ROADMAP`
4. Open PR → `main`.
5. After merge, Vercel deploys production.

Never force-push `main`. Prefer small, reviewable PRs over one giant change.

---

## 8. Docs folder & Build behaviour

- All planning, agent, and architecture documents live under `docs/`.
- **Vite and TypeScript only compile `src/` + `index.html`**.  
  Files under `docs/` are **never** part of the production bundle.
- `.gitignore` is updated with a clear comment so future contributors do not accidentally treat `docs/` as build input.
- Commit the `docs/` files — they are the source of truth for future agents and contributors (same philosophy as Codepackr’s `docs/` + wiki sync).

---

## 9. Suggested First PR Scope (recommended starting point)

1. Expand `src/lib/astro/phalan.ts` with life-area prediction helpers.
2. Add `src/lib/astro/remedies.ts` + basic data for Chevvai, Sade Sati, Kaal Sarpa.
3. Wire a new “Phalan” / “Remedies” richness into existing ChartViews tabs (or new sub-tabs).
4. Add a “Full Report” entry point that reuses print/PDF path.
5. Update this roadmap checkbox status if desired.
6. Keep all new user-facing text bilingual.

After that lands, continue with Phase 2 (Rasi Palan + expanded Yogas).

---

## 10. Reference Competitors (for feature parity only)

Use for inspiration of **what users expect**, not for copying text or proprietary algorithms:

- Tamilcube Astrology (free Jathagam, Kili Josiyam, panchangam)
- Tamilsonline (Dasakoota emphasis, free basic + paid deep reports)
- TheAstroKing / Clickastro / AstroSage (paid multi-page reports, remedies, long dasa)

Our differentiator: **same or better depth, completely free, zero data collection, dual Thirukanitham + Vakya transparency**.

---

## 11. Changelog of this document

| Date       | Change                                      |
|------------|---------------------------------------------|
| 2026-09-22 | Initial detailed roadmap created            |

---

*This document is the canonical implementation guide for turning Codepackr Astro into the most complete free Tamil Jathagam experience. Update it as features ship.*
