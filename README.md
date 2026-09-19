# தமிழ் ஜாதகம்

Tamil jathagam website with **திருக்கணிதம் (Thirukanitham / Drik)** and **வாக்கியம் (Vakya Karana)** calculation.

In Tamil usage, **ராசி is the Moon sign**, not lagna. The headline of every chart shows rasi, nakshatra + pada, then lagna.

## Features

- Birth form with 5,000+ places (Predict. city list)
- Schools: Thirukanitham (default), Vakya, Lahiri / Chitrapaksha
- South-Indian rasi (D1) and navamsa (D9) charts
- Graha table, panchangam, muhurta, Vimshottari dasa, vargas, ashtakoot porutham
- Tamil / English UI

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Calculation notes

- **Thirukanitham** — geocentric ecliptic-of-date longitudes minus the Predict. Thirukanitham ayanamsa (`22°50.016′` at 1900.0, ~50.016″/year). This is the usual Tamilcube / online Tamil jathagam mode.
- **Vakya** — Kali-epoch mean motions with a simple manda equation. Temple vakya panchangams can still differ near nakshatra edges.
- **Lahiri** — same tropical positions with Lahiri / Chitrapaksha ayanamsa, for comparison.

Positions use [astronomy-engine](https://github.com/cosinekitty/astronomy) (VSOP87 / ELP-2000 class). This is not Swiss Ephemeris.

Sample chart: Thirukumaresan, Vellore, 25 Jul 2012, 13:58 IST — Moon in கன்னி / சித்திரை under Thirukanitham.

## License

MIT
