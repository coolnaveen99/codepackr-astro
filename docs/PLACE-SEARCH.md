# Place search

No 676 prefix shards.

## Flow
1. India or Outside India
2. If India → pick state → search that state file only
3. If outside → country names only (city lists later on request)

## Files
- TN towns: `/data/places-tn.json`
- KA / KL / AP towns: `/data/places-ka-kl-ap.json` (filtered by tag)
- Other states: `/data/places-districts.json` (district names)
- Outside India: `/data/places-countries.json`

To add one state later: drop `/data/in/{state}.json` and point `INDIA_STATES[].file` at it.

UI: `src/components/place-search-field.tsx`
Catalog: `src/lib/astro/place-india.ts`
