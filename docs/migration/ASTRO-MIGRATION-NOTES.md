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
