# Tools Directory & Platform Features

CodePackr Astro provides a comprehensive suite of 16 astrological and calendar computation tools. Every tool is accessible via canonical URL paths and operates with responsive, bilingual interfaces.

---

## 1. Directory of Tools

| Tool Name (English / Tamil) | Canonical Route | Category | Status | Primary Function |
| :--- | :--- | :--- | :--- | :--- |
| **Horoscope Generator (ஜாதகம் கணித்தல்)** | `/jathagam` | `core` | **Available** | Generates 1-page summary, 6-page executive, or 30-page full horoscope booklet with PDF download. |
| **Tamil Calendar & Panchangam (தமிழ் காலண்டர்)** | `/tamil-calendar` | `calendar` | **Available** | Unified solar calendar, 60 Samvatsara years, continuous 5-Anga transitions, and 24h timeline. |
| **10 Poruthams Marriage Matching (திருமணப் பொருத்தம்)** | `/porutham` | `matching` | **Available** | Classical Dasakoota matching (Dina, Gana, Mahendra, Stree Deerkha, Yoni, Rasi, Rasyadhipathi, Vasiya, Rajju, Vedha) with Dosha detection. |
| **Astro Biodata Maker (ஜாதக பயோடேட்டா)** | `/biodata` | `matching` | **Available** | Matrimonial biodata designer with Rasi and Navamsa chart embedding, photo upload, and instant PDF generation. |
| **Multi-Horizon Forecast (பலன் கணிப்பு)** | `/forecast` | `prediction` | **Available** | Evidence-grounded life predictions across 16 domains evaluated across 1, 3, 5, 10, 20, and 60 years. |
| **Chandrashtama Calculator (சந்திராஷ்டமக் கணிப்பான்)** | `/chandrashtama` | `transit` | **Available** | Calculates exact transit times of the Moon through the 8th house from natal Moon with cautions. |
| **Gochara Planetary Transits (கோசார பலன்கள்)** | `/gochara` | `transit` | **Available** | Evaluates real-time transits of Saturn (Sade Sati), Jupiter (Guru Peyarchi), and Rahu-Ketu across natal Moon houses. |
| **27 Nakshatras & 108 Padas (27 நட்சத்திரங்கள்)** | `/nakshatra` | `reference` | **Available** | Complete reference for all 27 nakshatras, deities, lords, gana, yoni, vriksham, bird, and 4 pada characteristics. |
| **Tamil Baby Names by Star (குழந்தைப் பெயர்கள்)** | `/babynames` | `reference` | **Available** | Curated collection of traditional Tamil names filtered by nakshatra pada auspicious starting syllables. |
| **Nazhigai to Clock Converter (நாழிகை மாற்றி)** | `/nazhigai` | `utility` | **Available** | Bidirectional converter between civil clock time (HH:MM) and classical Tamil Nazhigai (60 Nazhigai/day = 24 min each). |
| **Daily & Weekly Rasi Palan (ராசிபலன்)** | `/rasipalan` | `prediction` | **Available** | Daily and weekly astrological outlook for all 12 signs evaluated dynamically from current planetary transits. |
| **Chaldean Numerology (எண் கணிதம்)** | `/numerology` | `utility` | **Available** | Calculates Driver (Birth Number), Conductor (Destiny Number), and Name Number vibrational harmony. |
| **Chozhi Prasna Arudham (சோழி பிரச்னம்)** | `/prasna` | `utility` | **Available** | Traditional 1–108 horary divination calculating instant Arudha Lagna and planetary disposition. |
| **Astrological Glossary (ஜோதிட சொற்களஞ்சியம்)** | `/glossary` | `reference` | **Available** | Encyclopedic dictionary of Vedic and Tamil astrological terms with etymological explanations. |
| **Calculation Methodology (கணித முறைமை)** | `/calculation-method` | `info` | **Available** | Technical disclosure of astronomical models, linear ayanamsa equations, and house systems. |
| **Internal Accuracy Validation (சரிபார்ப்புத் தளம்)** | `/dev/astro-validation` | `info` | **Available** | Developer validation dashboard running 50+ automated ephemeris benchmarks and boundary tests. |

---

## 2. Key Tool Modules & Usage Notes

### A. Jathagam Generator (`/jathagam`)
- **Query Parameters:**
  - `?mode=one`: 1-Page Summary.
  - `?mode=six`: 6-Page Executive Horoscope.
  - `?mode=thirty`: 30-Page Classical Horoscope Book.
  - `?print=auto`: Automatically opens the print preview dialog.
- **Birth Time Quality:** Supports marking birth times as `exact`, `approximate`, `rounded`, or `unknown`. When approximate, sensitivity analysis evaluates whether Lagna or Navamsa shifts within $\pm 5$ minutes.

### B. Matrimonial 10-Porutham Matching (`/porutham`)
- **Engine:** `src/lib/astro/porutham/dasakoota.ts`.
- **Vital Exclusions:** Detects **Rajju Dosha** (Siro, Kantha, Udara, Kati, Pada) and **Vedha Dosha** (inimical nakshatras) as critical disqualifications regardless of overall numerical score.
- **Scoring:** Out of 36 maximum points across all 10 classical kootas.

### C. Astro Biodata Maker (`/biodata`)
- **Features:** 4 aesthetic design templates (Traditional Gold, Sacred Crimson, Temple Ivory, Royal Navy).
- **Embedded Charts:** Rasi D1 and Navamsa D9 charts rendered as crisp vector graphics inside the biodata card.
- **Export Options:** Generates both high-res printable PDF and PNG image exports.

### D. Nazhigai to Clock Time Converter (`/nazhigai`)
- **Mathematical Anchor:** Uses astronomical local sunrise at the selected place as Nazhigai 0.00.
- **Unit Scale:** 1 Day = 60 Nazhigai; 1 Nazhigai = 60 Vinazhigai = 24 Minutes; 1 Vinazhigai = 24 Seconds.
