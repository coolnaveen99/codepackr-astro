import type { City } from "./engine";
import { foldPlace, searchCities } from "./place-search";

const SHARD_CACHE = new Map<string, City[]>();

async function loadPrefixShard(prefix: string): Promise<City[]> {
  const key = prefix.slice(0, 2);
  if (key.length < 2) return [];
  const hit = SHARD_CACHE.get(key);
  if (hit) return hit;
  try {
    const r = await fetch(`/data/idx/${key}.json`);
    const list = r.ok ? await r.json() : [];
    const cities = Array.isArray(list) ? (list as City[]) : [];
    SHARD_CACHE.set(key, cities);
    return cities;
  } catch {
    SHARD_CACHE.set(key, []);
    return [];
  }
}

function mergeHits(primary: City[], extra: City[], limit: number): City[] {
  const seen = new Set<string>();
  const out: City[] = [];
  for (const city of [...primary, ...extra]) {
    const id = `${city.n}:${city.lat}:${city.lon}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(city);
    if (out.length >= limit) break;
  }
  return out;
}

/** O(shard) search. At 1M places a 2-letter shard is ~1-3k rows. */
export async function searchPlacesFast(query: string, local: City[], limit = 16): Promise<City[]> {
  const q = query.trim();
  const localHits = searchCities(local, q, limit);
  if (q.length < 2) return localHits;
  const prefix = foldPlace(q).slice(0, 2);
  if (prefix.length < 2) return localHits;
  const shard = await loadPrefixShard(prefix);
  if (!shard.length) return localHits;
  return mergeHits(searchCities(shard, q, limit), localHits, limit);
}

export function prefetchPopularShards() {
  for (const key of ["ch", "be", "ma", "ko", "mu", "ti", "hy", "pu", "de", "sa"]) {
    void loadPrefixShard(key);
  }
}
