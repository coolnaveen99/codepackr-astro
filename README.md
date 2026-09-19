# Codepackr Astro

Tamil jathagam in the [Codepackr](https://www.codepackr.com) family.

**திருக்கணிதம் (Thirukanitham / Drik)** and **வாக்கியம் (Vakya Karana)** calculation. In Tamil usage, **ராசி is the Moon sign**, not lagna.

## Features

- Birth form with 5,000+ places
- Schools: Thirukanitham (default), Vakya, Lahiri / Chitrapaksha
- South-Indian rasi (D1) and navamsa (D9) charts
- Graha table, panchangam, muhurta, Vimshottari dasa, vargas, ashtakoot porutham
- Tamil / English UI

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Calculation notes

- **Thirukanitham** — geocentric ecliptic-of-date longitudes minus the Predict. Thirukanitham ayanamsa (`22°50.016′` at 1900.0, ~50.016″/year).
- **Vakya** — Kali-epoch mean motions with a simple manda equation. Temple vakya panchangams can still differ near nakshatra edges.
- **Lahiri** — same tropical positions with Lahiri / Chitrapaksha ayanamsa, for comparison.

Positions use [astronomy-engine](https://github.com/cosinekitty/astronomy).

## License

MIT
