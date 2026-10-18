# CodePackr Astro

Multi-language, privacy-first Vedic astrology tools built with Astro + client-side `astronomy-engine`.

## Current Status (Phase 1 foundation)

- Astro static site with native i18n (Tamil root + en/hi/te/ml/kn)
- 100% browser-side calculations
- Multi-Ayanamsa support (Lahiri, KP, Raman, True Chitrapaksha, etc.)
- Sidereal chart engine (`src/lib/ephemeris/sidereal-engine.ts`)
- Jathagam calculator page
- Panchangam page (sunrise/sunset)
- South Indian chart SVG skeleton
- Local vault (`codepackr_astro_v1`)
- GitHub Actions deploy workflow

## Planned (from blueprint)

- Full accurate Navamsa + all Shodashvarga
- Proper Rahu/Ketu (mean/true)
- Reactive South / North / East Indian charts
- Full Gowri Panchangam / Choghadiya
- Dual marriage compatibility
- Ctrl+K command palette
- Complete lexicon dictionaries
- SEO content per language

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy via GitHub Pages (see `.github/workflows/deploy.yml`).

See the original architectural blueprint for the full roadmap.
