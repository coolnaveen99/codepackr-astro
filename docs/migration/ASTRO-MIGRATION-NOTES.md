# Astro Migration Blueprint Notes

This branch contains experimental modules derived from the multi-language Astro architectural blueprint.

## Files added under `src/lib/astro/experimental/`

- `sidereal-engine.ts` — Client-side astronomy-engine wrapper with multi-Ayanamsa, basic D1/D9, Vargottama, Gandanta, Combustion.
- `local-vault.ts` — `codepackr_astro_v1` localStorage vault pattern.
- `ui-strings.ts` & `jyotish-lexicon.ts` — Two-tier localization sketches.

## Current project status

The main codebase is a mature React + Vite SPA (`src/main.tsx`, `src/lib/astro/engine.ts`, etc.).  
A full migration to Astro static output is a larger effort that should be done incrementally to preserve existing functionality (Jathagam, Porutham, Panchangam, etc.).

## Recommended next steps

1. Compare `experimental/sidereal-engine.ts` with the existing `src/lib/astro/engine.ts` and extract useful accuracy improvements.
2. Prototype Astro static routes for SEO-critical pages while keeping interactive tools as client islands or continuing with Vite for the SPA.
3. Add proper hreflang + sitemap generation once multi-locale routing is decided.

Do not replace the existing Vite/React app until the Astro version reaches feature parity.

## Accuracy Comparison (2026-10-18)

Experimental linear Ayanamsa vs production polynomial models:

### Lahiri
| Date | Experimental | Production | Delta |
|------|--------------|------------|-------|
| 1900-01-01 | 22.4602° | 22.4543° | +0.0059° |
| 2000-01-01 | 23.8571° | 23.8523° | +0.0048° |
| 2026-01-01 | 24.2203° | 24.2158° | +0.0046° |

### Other systems (2026-01-01)
- KP: Experimental 24.1272° vs Production 24.0418° (Δ +0.0854°)
- Raman: Experimental 22.7272° vs Production 22.8231° (Δ −0.0959°)
- Thirukanitham: Production 24.2106° (experimental does not implement)

**Conclusion:** Keep production `src/lib/astro/astronomy/sidereal.ts` functions. They are more accurate. Experimental module is reference only.

## Next Integration Step
Expose KP and Raman (already implemented) in the existing school selector alongside Thirukanitham and Lahiri.
