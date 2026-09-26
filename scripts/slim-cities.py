#!/usr/bin/env python3
"""Shrink Codepackr Astro place dumps.
Input: cities-in.json + cities-world.json (GeoNames-style {n,c,tz,lat,lon,p})
Output: public/data/cities.json  (~1.5 MB vs 6 MB)
"""
import json, sys
from pathlib import Path

DIASPORA = {"LK", "SG", "MY", "AE", "QA", "KW", "BH", "OM", "SA", "NP", "BD", "PK"}

def keep_india(c):
    p = c.get("p") or 0
    name = (c.get("n") or "").lower()
    if name[:1].isdigit() and p < 20000:
        return False
    return p >= 8000

def keep_world(c):
    cc = (c.get("c") or "").upper()
    p = c.get("p") or 0
    if cc == "IN":
        return False
    if cc in DIASPORA:
        return p >= 8000
    return p >= 50000

def compact(c):
    out = {
        "n": c["n"],
        "c": c.get("c") or "",
        "tz": round(float(c.get("tz") or 0), 2),
        "lat": round(float(c["lat"]), 4),
        "lon": round(float(c["lon"]), 4),
    }
    p = int(c.get("p") or 0)
    if p:
        out["p"] = p
    return out

def main():
    src = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    india = json.loads((src / "cities-in.json").read_text())
    world = json.loads((src / "cities-world.json").read_text())
    rows = [compact(c) for c in india if keep_india(c)]
    rows += [compact(c) for c in world if keep_world(c)]
    seen = {}
    for c in rows:
        key = (c["n"].lower(), round(c["lat"], 2), round(c["lon"], 2))
        prev = seen.get(key)
        if not prev or (c.get("p") or 0) > (prev.get("p") or 0):
            seen[key] = c
    rows = sorted(seen.values(), key=lambda c: (-(c.get("p") or 0), c["n"]))
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src / "cities.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote {out}  {len(rows)} places  {out.stat().st_size/1024:.0f} KB")

if __name__ == "__main__":
    main()
