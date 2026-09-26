# Tamil Calendar & Daily Panchangam

CodePackr Astro provides a unified, location-specific **Tamil Solar Calendar & Event-Based Daily Panchangam** available at the canonical route:

- **Canonical Route:** `/tamil-calendar`
- **Canonical Alias:** `/panchangam` (redirects directly to `/tamil-calendar`)
- **Display Title:** தமிழ் காலண்டர் & தினசரி பஞ்சாங்கம் (Tamil Calendar & Daily Panchangam)

---

## 1. Unified Architecture

Unlike traditional web portals that separate monthly calendars from daily panchangam tables, CodePackr Astro unifies both into a single reactive interface backed by continuous astronomical calculation:

```text
                                  User Selection
                         [Date, City/Coordinates, Ayanamsa]
                                        ↓
                         Central Panchangam Engine
                 (src/lib/astro/calendar/panchangam.ts)
                                        ↓
         ┌──────────────────────────────┼──────────────────────────────┐
         ↓                              ↓                              ↓
1. Tamil Solar Date             2. Event Intervals             3. Rule-Based Festivals
- Month (Chithirai–Panguni)     - Tithi (start/end)            - Thai Pongal
- Day of Month                  - Nakshatra & Pada             - Tamil New Year
- Year (60 Samvatsara cycle)    - Yoga & Karana                - Sani / Soma Pradosham
- Solar Ingress (Sankranti)     - Ingresses (Sun/Moon)         - Vaikunta Ekadashi
                                - Muhurtham / Gowri            - Deepavali, Karthigai
```

---

## 2. Tamil Solar Calendar Mathematics

### A. The 12 Tamil Solar Months
The Tamil calendar is a tropical-sidereal solar calendar where month boundaries correspond to the Sun's exact ingress (Sankranti) into sidereal zodiac signs:

| Month # | Tamil Name | English Name | Sidereal Sign Entered | Approximate Gregorian Window |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **சித்திரை** | Chithirai | Mesha (Aries, 0°) | April 14 – May 14 |
| **2** | **வைகாசி** | Vaikasi | Vrishabha (Taurus, 30°) | May 15 – June 14 |
| **3** | **ஆனி** | Aani | Mithuna (Gemini, 60°) | June 15 – July 15 |
| **4** | **ஆடி** | Aadi | Kataka (Cancer, 90°) | July 16 – August 16 |
| **5** | **ஆவணி** | Aavani | Simha (Leo, 120°) | August 17 – September 16 |
| **6** | **புரட்டாசி** | Purattasi | Kanya (Virgo, 150°) | September 17 – October 16 |
| **7** | **ஐப்பசி** | Aippasi | Thula (Libra, 180°) | October 17 – November 15 |
| **8** | **கார்த்திகை** | Karthigai | Vrischika (Scorpio, 210°) | November 16 – December 15 |
| **9** | **மார்கழி** | Margazhi | Dhanus (Sagittarius, 240°) | December 16 – January 13 |
| **10** | **தை** | Thai | Makara (Capricorn, 270°) | January 14 – February 12 |
| **11** | **மாசி** | Maasi | Kumbha (Aquarius, 300°) | February 13 – March 13 |
| **12** | **பங்குனி** | Panguni | Meena (Pisces, 330°) | March 14 – April 13 |

### B. The 60-Year Jovian (Samvatsara) Cycle
Tamil years follow the traditional 60-year Jupiter-Saturn resonance cycle (*Arupathu Varushangal*):
- **Epoch Anchor:** Year **1987** is anchored to year #1 (**பிரபவ / Prabhava**).
- **Cycle Wrap:** Year #60 (**அக்ஷய / Akshaya**) wraps cleanly back to Prabhava.
- **Reference Table:** Available via interactive search tab under `/tamil-calendar`.

---

## 3. The 5 Panchangam Angas (ஐந்து அங்கங்கள்)

Daily calculations compute exact **continuous transition intervals** (`startClock` to `endClock`) rather than static noon snapshots:

### 1. திதி (Tithi)
- **Definition:** Longitudinal separation between Sun and Moon in steps of 12°:
  $$\text{Tithi Number} = \left\lfloor \frac{(\lambda_{\text{Moon}} - \lambda_{\text{Sun}}) \pmod{360^\circ}}{12^\circ} \right\rfloor$$
- **Pakshas:** शुक्ल पक्ष (வளர்பிறை / Shukla Paksha, 0–14) and कृष्ण पक्ष (தேய்பிறை / Krishna Paksha, 15–29).
- **Udaya Tithi (உதய திதி):** The tithi prevailing at exact astronomical sunrise determines the civil observance for the day.

### 2. நட்சத்திரம் & பாதம் (Nakshatra & Pada)
- **Definition:** Moon's sidereal longitude divided into 27 asterisms of 13° 20′ each.
- **Padas:** Each nakshatra consists of 4 quarters (பாதங்கள்) of 3° 20′ each, totaling 108 padas in the zodiac.
- **Lordship:** Associated with the 9 classical planetary rulers (Ketu through Mercury).

### 3. யோகம் (Nitya Yoga)
- **Definition:** Angular sum of Sun and Moon sidereal longitudes divided into 27 segments of 13° 20′:
  $$\text{Yoga Number} = \left\lfloor \frac{(\lambda_{\text{Sun}} + \lambda_{\text{Moon}}) \pmod{360^\circ}}{13^\circ 20'} \right\rfloor$$
- **Range:** Vishkambha (1) through Vaidhriti (27).

### 4. கரணம் (Karana)
- **Definition:** Half a Tithi (6° separation between Moon and Sun).
- **Classes:** 7 movable (Chara: Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti/Bhadra) and 4 fixed (Sthira: Shakuni, Chatushpada, Naga, Kimstughna).

### 5. வாரம் (Vara)
- Solar day evaluated from astronomical sunrise to the following astronomical sunrise.

---

## 4. Auspicious & Inauspicious Timings (முகூர்த்த காலங்கள்)

All periods are evaluated dynamically based on the exact diurnal span ($\text{sunset} - \text{sunrise}$):

| Period | Nature | Duration | Formula / Rule |
| :--- | :--- | :--- | :--- |
| **இராகு காலம் (Rahu Kalam)** | Inauspicious | $1/8\text{th}$ of daytime | Traditional weekday offset table |
| **எமகண்டம் (Yamagandam)** | Inauspicious | $1/8\text{th}$ of daytime | Traditional weekday offset table |
| **குளிகை (Gulikai Kalam)** | Auspicious | $1/8\text{th}$ of daytime | Traditional weekday offset table |
| **அபிஜித் (Abhijit Muhurtham)** | Highly Auspicious | $1/15\text{th}$ of daytime | Centered at exact local solar midday |
| **துர்முகூர்த்தம் (Durmuhurtham)** | Inauspicious | $1/15\text{th}$ of day | Weekday specific dual windows |
| **வர்ஜ்யம் (Varjyam)** | Inauspicious | Variable (4 Ghadikas) | Nakshatra-dependent poisonous span |
| **அமிர்தகாலம் (Amritakalam)** | Auspicious | Variable (4 Ghadikas) | Auspicious window post-Varjyam |
| **கௌரி பஞ்சாங்கம் (Gowri)** | Auspicious / Mixed | $1/8\text{th}$ of day/night | Uthi, Amirtham, Rogam, Laabam, Dhanam, Sugam, Soram, Visham |

---

## 5. Visual 24-Hour Day Timeline

The `/tamil-calendar` interface features an interactive 24-hour horizontal chronological timeline spanning from 00:00 to 23:59:
- **Sunrise & Sunset:** Proportional markers showing daylight vs. night spans.
- **Moonrise & Moonset:** Dynamic markers with illumination percentage and lunar phase.
- **Auspicious Spans:** Abhijit Muhurtham and Gowri auspicious spans highlighted in emerald.
- **Cautionary Spans:** Rahu Kalam and Yamagandam highlighted in rose and amber.
- **Transitions:** Exact timestamp markers for Tithi transitions, Nakshatra pada changes, and Moon sign ingresses.
