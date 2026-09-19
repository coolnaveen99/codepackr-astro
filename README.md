# Codepackr Astro

Tamil jathagam in the [Codepackr](https://www.codepackr.com) family.

**திருக்கணிதம் (Thirukanitham / Drik)** and **வாக்கியம் (Vakya Karana)** calculation. In Tamil usage, **ராசி is the Moon sign**, not lagna.

Live: [github.com/coolnaveen99/codepackr-astro](https://github.com/coolnaveen99/codepackr-astro)

## Features

- Birth form with day / month / year and 12-hour time dropdowns, 5,000+ places
- Schools: Thirukanitham (default), Vakya, Lahiri / Chitrapaksha
- South-Indian rasi (D1), navamsa (D9), drekkana, dasamsa, dwadasamsa
- Graha table, panchangam, muhurta, Vimshottari dasa, ashtakavarga
- Yogas, doshas, Chevvai, Kaal Sarpa, Sade Sati, gochara
- Tamil dasakoota porutham — 10 poruthams graded உத்தமம் / மத்தியமம் / அதமம் (not North-Indian 36 gunas)
- Marriage biodata maker (Tamil + English) with one photo, print, and PDF
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

Porutham follows Tamil Dasakoota (Dina, Gana, Mahendra, Stree Deergha, Yoni, Rasi, Rasi Adhipathi, Vasya, Rajju, Vedha). Rajju, Vedha, and 6–8 rasi are flagged even when the match count is high.

## License

MIT
