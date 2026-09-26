# Jathagam Report Design Standards

CodePackr Astro provides three distinct, URL-driven horoscope presentation modes under the canonical `/jathagam` route:

1. **1-Page Summary** (`/jathagam?mode=one`)
2. **6-Page Executive Horoscope** (`/jathagam?mode=six`)
3. **30-Page Classical Horoscope Book** (`/jathagam?mode=thirty`)

---

## 1. URL Mode Architecture

Report modes are driven strictly by the browser URL query parameter:

- `mode=one`: Renders the high-level birth chart card with Rasi D1, Navamsa D9, panchangam attributes, and current Dasa balance.
- `mode=six`: Renders a structured 6-page executive dossier suitable for printing or quick astrological consultation.
- `mode=thirty`: Renders the complete, 30-page classical Tamil horoscope book (*முழு ஜாதக நூல்*).
- Fallback: Invalid or omitted mode values default safely to `mode=one`.
- Print Automation: Opening `/jathagam?print=auto&mode=thirty` triggers the automated print layout without UI controls.

---

## 2. The 30-Page Classical Horoscope Book Structure

The 30-page booklet is formatted strictly according to traditional Tamil Nadu horoscope book publishing standards:

| Page # | Section Title (Tamil / English) | Content & Astronomical Elements |
| :---: | :--- | :--- |
| **1** | **முகப்பு அட்டை (Front Cover)** | Ornamental classical Tamil frame, Native's Name, Birth Date/Time, Place, Samvatsara, and Platform provenance. |
| **2** | **பிறப்பு விபரம் & பஞ்சாங்கம் (Birth Particulars)** | Gregorian & Tamil dates, Julian Day, LMT/IST, Sunrise/Sunset, Tithi, Nakshatra, Yoga, Karana, and Balance of Dasa. |
| **3** | **பொருளடக்கம் (Table of Contents)** | Structured 30-page index categorized into Charts, Strengths, Bhavas, Timing, Yogas, and Remedies. |
| **4** | **ராசிக் கட்டம் — D1 (Rasi Chart)** | Full-page vector South Indian Rasi chart with exact degrees, retrograde indicators, and combust markers. |
| **5** | **நவாம்சக் கட்டம் — D9 (Navamsa Chart)** | Full-page vector South Indian Navamsa chart with D9 planetary placements and Vargottama highlights. |
| **6** | **முக்கிய வர்க்கக் கட்டங்கள் (Key Vargas)** | D2 (Hora), D3 (Drekkana), D4 (Chaturthamsa), and D7 (Saptamsa) divisional charts. |
| **7** | **உயர் வர்க்கக் கட்டங்கள் (Higher Vargas)** | D10 (Dasamsa), D12 (Dwadasamsa), D16 (Shodasamsa), and D20 (Vimsamsa) charts. |
| **8** | **சூட்சும வர்க்கக் கட்டங்கள் (Subtle Vargas)** | D24 (Siddhamsa), D27 (Saptavimsamsa), D30 (Trimsamsa), and D60 (Shashtiamsa) charts. |
| **9** | **கிரக நிலைகள் அட்டவணை (Planetary Table)** | 9 Grahas + Lagna + Gulika: Sidereal degree, DMS, Nakshatra, Pada, Pada Lord, Dignity, and Retrograde status. |
| **10** | **பாவ ஆரம்பங்கள் (Bhava Cusps)** | 12 Bhavas table: Cusp longitude, Bhava Madhya, sign lord, star lord, and sub-lord. |
| **11** | **அஷ்டவர்க்கம் (Ashtakavarga)** | Sarvashtakavarga (SAV) matrix with 12 signs, individual planet BAV scores, and Rekhas/Bindus. |
| **12** | **ஷட்பல விவரங்கள் (Shadbala Strength)** | 6-fold planetary strengths: Sthana, Dig, Kala, Chesta, Naisargika, and Drik Bala with Virupa totals. |
| **13** | **பாவ பலம் (Bhava Bala)** | Quantitative strength evaluation of the 12 houses based on lords, occupants, and aspects. |
| **14** | **1-ஆம் பாவம்: லக்னம் (1st House — Tanu Bhava)** | Physical constitution, vitality, character, mental disposition, and Lagna lord analysis. |
| **15** | **2-ஆம் பாவம்: தனம் & வாக்கு (2nd House — Dhana Bhava)** | Family lineage, speech, wealth accumulation, eyesight, and 2nd lord strength. |
| **16** | **3-ஆம் பாவம்: தைரியம் & இளைய சகோதரம் (3rd House)** | Courage, initiative, communication, short journeys, and sibling relationships. |
| **17** | **4-ஆம் பாவம்: மாத்ரு & சுகம் (4th House — Sukha Bhava)** | Mother, landed properties, vehicles, education, and domestic happiness. |
| **18** | **5-ஆம் பாவம்: புத்திர & பூர்வ புண்ணியம் (5th House)** | Children, intellect, speculative gains, creative talents, and past-life karma. |
| **19** | **6-ஆம் பாவம்: ரோகம் & சத்ரு (6th House — Roga Bhava)** | Health, debts, competitive strength, enemies, and litigation mitigation. |
| **20** | **7-ஆம் பாவம்: களத்திரம் & கூட்டாண்மை (7th House)** | Marriage, spouse characteristics, partnership stability, and public relations. |
| **21** | **8-ஆம் பாவம்: ஆயுள் & மாங்கல்யம் (8th House)** | Longevity, sudden events, occult knowledge, unearned wealth, and obstacles. |
| **22** | **9-ஆம் பாவம்: பாக்யம் & தர்மம் (9th House — Bhagya Bhava)** | Father, fortune, higher learning, pilgrimage, spiritual inclinations, and preceptors. |
| **23** | **10-ஆம் பாவம்: தொழில் & கீர்த்தி (10th House — Karma Bhava)** | Career, profession, social status, leadership authority, and public reputation. |
| **24** | **11-ஆம் பாவம்: லாபம் & மூத்த சகோதரம் (11th House)** | Financial gains, elder siblings, fulfillment of desires, and influential networks. |
| **25** | **12-ஆம் பாவம்: விரயம் & மோட்சம் (12th House)** | Expenditure, foreign travel, spiritual liberation (Moksha), sleep, and charity. |
| **26** | **விம்சோத்தரி தசா-புக்தி கால அட்டவணை (Dasa Timing)** | Complete 120-year chronological sequence of Maha Dasas and Antardasas (Bhuktis). |
| **27** | **ஜாதக யோகங்கள் (Auspicious Yogas)** | Evaluation of 54 classical Yogas (Raja Yoga, Gaja Kesari, Dhana Yoga, Pancha Mahapurusha, etc.). |
| **28** | **தோஷ ஆய்வுகள் (Dosha Evaluations)** | Chevvai (Kuja) Dosha, Rahu-Ketu (Sarpa) Dosha, Kalathra Dosha, and cancellation factors. |
| **29** | **கோச்சாரம் & பரிகாரங்கள் (Gochara & Remedies)** | Saturn (Sade Sati / Ashtama Sani), Jupiter, Rahu-Ketu transits, sthotra pariharams, and temple suggestions. |
| **30** | **கணக்கீட்டுச் சான்றிதழ் (Provenance Receipt)** | Cryptographic SHA-256 calculation receipt, ephemeris version, ayanamsa disclosure, and legal disclaimer. |

---

## 3. South Indian Chart Rendering Rules

- **Square Layout:** 4×4 grid where the 4 central cells are merged into a clean label area.
- **Fixed Signs:** Signs never rotate; Aries (மேஷம்) is fixed at cell row 1, col 2; Pisces (மீனம்) at row 1, col 1.
- **Sign Order (Clockwise):** Meena → Mesha → Vrishabha → Mithuna → Kataka → Simha → Kanya → Thula → Vrischika → Dhanus → Makara → Kumbha.
- **Typography:** Glyphs are bilingual (`Su / சூரியன்`, `Mo / சந்திரன்`); retrogrades marked with `(R) / வக்ரம்`; Lagna marked with bold diagonal Ascendant indicator.

---

## 4. Client-Side High-Resolution PDF Export

- **Engine:** `html2canvas-pro` paired with `jspdf`.
- **Resolution:** Rendered at 2.0× scale factor for sharp 300 DPI vector-like typography upon physical printing.
- **Page Isolation:** Strict CSS `@media print` rules isolate report content and eliminate browser headers, footers, and interactive navigation chrome.
- **Privacy:** Entire PDF document is constructed and downloaded in browser RAM without network transmission.
