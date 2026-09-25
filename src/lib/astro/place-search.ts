// Codepackr Astro - Place search helpers + extra Indian towns
import type { City } from "./engine";

/** Towns missing from the bundled atlas (esp. Chittoor / Rayalaseema / TN). */
export const EXTRA_INDIA_TOWNS: City[] = [
  { n: "Palamaner (Ap)", tz: 5.5, lat: 13.1991, lon: 78.7469 },
  { n: "Palamaneru (Ap)", tz: 5.5, lat: 13.1991, lon: 78.7469 },
  { n: "Bangarupalem (Ap)", tz: 5.5, lat: 13.1966, lon: 78.9006 },
  { n: "Gudipala (Ap)", tz: 5.5, lat: 13.1286, lon: 79.1331 },
  { n: "Srikalahasti (Ap)", tz: 5.5, lat: 13.7498, lon: 79.6984 },
  { n: "Puttur (Ap)", tz: 5.5, lat: 13.4419, lon: 79.5531 },
  { n: "Nagari (Ap)", tz: 5.5, lat: 13.3214, lon: 79.5856 },
  { n: "Madanapalle (Ap)", tz: 5.5, lat: 13.5503, lon: 78.5029 },
  { n: "Pakala (Ap)", tz: 5.5, lat: 13.4493, lon: 79.1167 },
  { n: "Sodam (Ap)", tz: 5.5, lat: 13.4833, lon: 78.9500 },
  { n: "Kalikiri (Ap)", tz: 5.5, lat: 13.6333, lon: 78.8000 },
  { n: "Vayalpad (Ap)", tz: 5.5, lat: 13.6500, lon: 78.6333 },
  { n: "Thamballapalle (Ap)", tz: 5.5, lat: 13.8167, lon: 78.6500 },
  { n: "Chandragiri (Ap)", tz: 5.5, lat: 13.5833, lon: 79.3167 },
  { n: "Gangavaram (Chittoor)", tz: 5.5, lat: 13.2167, lon: 79.0667 },
  { n: "Irala (Ap)", tz: 5.5, lat: 13.3667, lon: 79.0500 },
  { n: "Puthalapattu (Ap)", tz: 5.5, lat: 13.3833, lon: 79.0833 },
  { n: "Yadamari (Ap)", tz: 5.5, lat: 13.0833, lon: 79.1167 },
  { n: "Penumuru (Ap)", tz: 5.5, lat: 13.3667, lon: 79.1833 },
  { n: "Karvetinagar (Ap)", tz: 5.5, lat: 13.4167, lon: 79.4500 },
  { n: "Satyavedu (Ap)", tz: 5.5, lat: 13.4333, lon: 79.9500 },
  { n: "Pitchatur (Ap)", tz: 5.5, lat: 13.2667, lon: 79.7500 },
  { n: "Vepagunta (Ap)", tz: 5.5, lat: 13.2167, lon: 79.0833 },
  { n: "Greamspet (Chittoor)", tz: 5.5, lat: 13.2170, lon: 79.1000 },
  { n: "Kuppam (Ap)", tz: 5.5, lat: 12.7493, lon: 78.3419 },
  { n: "Sholinghur (Tn)", tz: 5.5, lat: 13.1167, lon: 79.4167 },
  { n: "Ambur (Tn)", tz: 5.5, lat: 12.7904, lon: 78.7166 },
  { n: "Gudiyattam (Tn)", tz: 5.5, lat: 12.9459, lon: 78.8646 },
  { n: "Ranipet (Tn)", tz: 5.5, lat: 12.9279, lon: 79.3300 },
  { n: "Arcot (Tn)", tz: 5.5, lat: 12.9054, lon: 79.3196 },
  { n: "Wallajah (Tn)", tz: 5.5, lat: 12.9250, lon: 79.3667 },
  { n: "Tiruttani (Tn)", tz: 5.5, lat: 13.1750, lon: 79.6110 },
  { n: "Pallipattu (Tn)", tz: 5.5, lat: 13.3333, lon: 79.4500 },
  { n: "Uthukottai (Tn)", tz: 5.5, lat: 13.3333, lon: 79.9000 },
];

const ALIASES: Record<string, string[]> = {
  palamaner: ["palamaneer", "palamaneru", "palamaneri", "palamanair"],
  chittoor: ["chitoor", "chittor", "chittore", "chittoore"],
  madanapalle: ["madanapalli", "madanapally", "madanapalle"],
  punganur: ["punganure", "punganuru"],
  srikalahasti: ["srikalahasthi", "kalahasti"],
  tirupati: ["thirupathi", "tirupathi", "thirupati"],
  chennai: ["madras"],
  bengaluru: ["bangalore"],
  mumbai: ["bombay"],
  thiruvananthapuram: ["trivandrum"],
  kochi: ["cochin"],
  puducherry: ["pondicherry", "pondy"],
  vijayawada: ["bezwada"],
};

export function foldPlace(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0b80-\u0bff]+/g, "");
}

/** Collapse repeated letters so palamaneer ≈ palamaner and chittoor ≈ chitoor. */
export function squashLetters(s: string): string {
  return foldPlace(s).replace(/(.)\1+/g, "$1");
}

function aliasHits(foldedQuery: string, squashedQuery: string, nameFolded: string): boolean {
  for (const [canon, list] of Object.entries(ALIASES)) {
    const names = [canon, ...list];
    const queryMatchesAlias = names.some(
      (a) => foldedQuery.includes(foldPlace(a)) || squashedQuery.includes(squashLetters(a)),
    );
    const cityIsCanon = names.some(
      (a) => nameFolded.includes(foldPlace(a)) || squashLetters(nameFolded).includes(squashLetters(a)),
    );
    if (queryMatchesAlias && cityIsCanon) return true;
  }
  return false;
}

export function mergeCityLists(base: City[], extra: City[] = EXTRA_INDIA_TOWNS): City[] {
  const seen = new Set<string>();
  const out: City[] = [];
  for (const city of [...extra, ...base]) {
    const key = `${squashLetters(city.n)}:${city.lat.toFixed(2)}:${city.lon.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(city);
  }
  return out;
}

export function searchCities(cities: City[], query: string, limit = 16): City[] {
  const q = query.trim();
  if (q.length < 1) return cities.slice(0, 8);
  const folded = foldPlace(q);
  const squashed = squashLetters(q);
  if (!folded) return cities.slice(0, 8);

  const scored: { city: City; score: number }[] = [];
  for (const city of cities) {
    const name = foldPlace(city.n);
    const nameSq = squashLetters(city.n);
    let score = 0;
    if (name === folded || nameSq === squashed) score = 100;
    else if (name.startsWith(folded) || nameSq.startsWith(squashed)) score = 80;
    else if (name.includes(folded) || nameSq.includes(squashed)) score = 60;
    else if (aliasHits(folded, squashed, name)) score = 70;
    if (score > 0) scored.push({ city, score });
  }
  scored.sort((a, b) => b.score - a.score || a.city.n.localeCompare(b.city.n));
  return scored.slice(0, limit).map((s) => s.city);
}
