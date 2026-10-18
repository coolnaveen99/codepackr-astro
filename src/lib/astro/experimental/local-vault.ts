// src/lib/storage/local-vault.ts
const STORAGE_KEY = "codepackr_astro_v1";

export interface SavedChart {
  id: string;
  name: string;
  date: string;
  ayanamsa: string;
  createdAt: string;
  data: any;
}

export function loadVault(): SavedChart[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChart(chart: Omit<SavedChart, "id" | "createdAt">): SavedChart {
  const vault = loadVault();
  const entry: SavedChart = {
    ...chart,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  vault.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  return entry;
}

export function deleteChart(id: string): void {
  const vault = loadVault().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
}

export function exportVault(): string {
  return JSON.stringify(loadVault(), null, 2);
}

export function importVault(json: string): void {
  const parsed = JSON.parse(json);
  if (Array.isArray(parsed)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
}
