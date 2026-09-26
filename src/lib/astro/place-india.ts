import type { City } from "./engine";
import { searchCities } from "./place-search";

export type RegionMode = "IN" | "OUT";

export type IndiaState = {
  code: string;
  name: string;
  nameTa: string;
  towns: boolean;
  file: string;
  tag?: string;
};

export const INDIA_STATES: IndiaState[] = [
  { code: "tn", name: "Tamil Nadu", nameTa: "தமிழ்நாடு", towns: true, file: "/data/places-tn.json", tag: "(Tn)" },
  { code: "ap", name: "Andhra Pradesh", nameTa: "ஆந்திரப் பிரதேசம்", towns: true, file: "/data/places-ka-kl-ap.json", tag: "(Ap)" },
  { code: "ka", name: "Karnataka", nameTa: "கர்நாடகா", towns: true, file: "/data/places-ka-kl-ap.json", tag: "(Ka)" },
  { code: "kl", name: "Kerala", nameTa: "கேரளா", towns: true, file: "/data/places-ka-kl-ap.json", tag: "(Kl)" },
  { code: "tg", name: "Telangana", nameTa: "தெலுங்கானா", towns: false, file: "/data/places-districts.json" },
  { code: "mh", name: "Maharashtra", nameTa: "மகாராஷ்டிரா", towns: false, file: "/data/places-districts.json" },
  { code: "gj", name: "Gujarat", nameTa: "குஜராத்", towns: false, file: "/data/places-districts.json" },
  { code: "rj", name: "Rajasthan", nameTa: "ராஜஸ்தான்", towns: false, file: "/data/places-districts.json" },
  { code: "up", name: "Uttar Pradesh", nameTa: "உத்தரப் பிரதேசம்", towns: false, file: "/data/places-districts.json" },
  { code: "mp", name: "Madhya Pradesh", nameTa: "மத்தியப் பிரதேசம்", towns: false, file: "/data/places-districts.json" },
  { code: "wb", name: "West Bengal", nameTa: "மேற்கு வங்காளம்", towns: false, file: "/data/places-districts.json" },
  { code: "br", name: "Bihar", nameTa: "பீகார்", towns: false, file: "/data/places-districts.json" },
  { code: "od", name: "Odisha", nameTa: "ஒடிசா", towns: false, file: "/data/places-districts.json" },
  { code: "pb", name: "Punjab", nameTa: "பஞ்சாப்", towns: false, file: "/data/places-districts.json" },
  { code: "hr", name: "Haryana", nameTa: "ஹரியானா", towns: false, file: "/data/places-districts.json" },
  { code: "jh", name: "Jharkhand", nameTa: "ஜார்க்கண்ட்", towns: false, file: "/data/places-districts.json" },
  { code: "ct", name: "Chhattisgarh", nameTa: "சத்தீஸ்கர்", towns: false, file: "/data/places-districts.json" },
  { code: "as", name: "Assam", nameTa: "அசாம்", towns: false, file: "/data/places-districts.json" },
  { code: "uk", name: "Uttarakhand", nameTa: "உத்தராகண்ட்", towns: false, file: "/data/places-districts.json" },
  { code: "hp", name: "Himachal Pradesh", nameTa: "இமாசலப் பிரதேசம்", towns: false, file: "/data/places-districts.json" },
  { code: "jk", name: "Jammu and Kashmir", nameTa: "ஜம்மு காஷ்மீர்", towns: false, file: "/data/places-districts.json" },
  { code: "dl", name: "Delhi", nameTa: "டெல்லி", towns: false, file: "/data/places-districts.json" },
  { code: "ga", name: "Goa", nameTa: "கோவா", towns: false, file: "/data/places-districts.json" },
  { code: "py", name: "Puducherry", nameTa: "புதுச்சேரி", towns: false, file: "/data/places-districts.json" },
];

const FILE_CACHE = new Map<string, City[]>();

async function loadFile(url: string): Promise<City[]> {
  const hit = FILE_CACHE.get(url);
  if (hit) return hit;
  try {
    const r = await fetch(url);
    const list = r.ok ? await r.json() : [];
    const cities = Array.isArray(list) ? (list as City[]) : [];
    FILE_CACHE.set(url, cities);
    return cities;
  } catch {
    FILE_CACHE.set(url, []);
    return [];
  }
}

function matchesState(city: City, state: IndiaState): boolean {
  if (state.tag) return city.n.includes(state.tag);
  return city.n.toLowerCase().includes(state.name.toLowerCase());
}

export async function loadIndiaStatePlaces(state: IndiaState): Promise<City[]> {
  const rows = await loadFile(state.file);
  if (state.tag || state.file.includes("districts")) return rows.filter((c) => matchesState(c, state));
  return rows;
}

export async function loadCountryPlaces(): Promise<City[]> {
  return loadFile("/data/places-countries.json");
}

export function searchInList(list: City[], query: string, limit = 16): City[] {
  return searchCities(list, query, limit);
}
