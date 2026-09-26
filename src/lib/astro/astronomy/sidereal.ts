// Codepackr Astro — Sidereal Zodiac & Ayanamsa Profiles

/**
 * High-accuracy Lahiri (Chitrapaksha) Ayanamsa.
 * Standard Indian Astronomical Ephemeris polynomial model.
 * Epoch J2000.0 (JD 2451545.0) = 23°51′08.3″ (23.852294°).
 * Precession rate ≈ 50.29″/century.
 */
export function ayanamsaLahiri(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return (
    23.852294 +
    T * (1.3979426 - T * (0.0000930862 + T * 0.000000018))
  );
}

/**
 * Thirukanitham (Tamil Drik) linear ayanamsa.
 * Epoch 1900.0 (JD 2415020.0) = 22°27.6′ (22.460°) with classical rate 50.016″/year.
 * Distinct from Lahiri/Chitrapaksha — preserved for Tamil panchangam alignment.
 */
export function ayanamsaThirukanitham(jd: number): number {
  const years = (jd - 2415020.0) / 365.2421988;
  return 22.460 + (50.016 / 3600) * years;
}

/** Raman Ayanamsa (B.V. Raman school). Base 22.460148° at J2000. */
export function ayanamsaRaman(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 22.460148 + T * 1.396042;
}

/** KP (Krishnamurti) Ayanamsa – Newcomb precession basis. */
export function ayanamsaKP(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.67890 + T * 1.395833;
}

export type AyanamsaType = "lahiri" | "raman" | "kp" | "thirukanitham" | "custom";

/**
 * Returns the exact Ayanamsa in degrees for a given Julian Day and profile.
 */
export function getAyanamsa(jd: number, type: AyanamsaType = "lahiri"): number {
  switch (type) {
    case "raman":
      return ayanamsaRaman(jd);
    case "kp":
      return ayanamsaKP(jd);
    case "thirukanitham":
      return ayanamsaThirukanitham(jd);
    case "lahiri":
    default:
      return ayanamsaLahiri(jd);
  }
}
