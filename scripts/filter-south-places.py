#!/usr/bin/env python3
"""Keep town names only for TN / AP / KA / KL.
Other Indian states collapse to district names.
Other countries collapse to one country row.
"""
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

SOUTH_STATES = {"tamil nadu", "andhra pradesh", "karnataka", "kerala"}

COUNTRY_NAME = {
    "LK": "Sri Lanka", "SG": "Singapore", "MY": "Malaysia", "AE": "United Arab Emirates",
    "QA": "Qatar", "KW": "Kuwait", "BH": "Bahrain", "OM": "Oman", "SA": "Saudi Arabia",
    "NP": "Nepal", "BD": "Bangladesh", "PK": "Pakistan", "US": "United States",
    "GB": "United Kingdom", "AU": "Australia", "CA": "Canada", "FR": "France",
    "DE": "Germany", "IT": "Italy", "ES": "Spain", "CN": "China", "JP": "Japan",
    "KR": "South Korea", "TH": "Thailand", "ID": "Indonesia", "PH": "Philippines",
    "VN": "Vietnam", "MM": "Myanmar", "KH": "Cambodia", "MV": "Maldives", "BT": "Bhutan",
    "AF": "Afghanistan", "IR": "Iran", "IQ": "Iraq", "TR": "Turkey", "EG": "Egypt",
    "ZA": "South Africa", "NG": "Nigeria", "KE": "Kenya", "TZ": "Tanzania",
    "BR": "Brazil", "MX": "Mexico", "AR": "Argentina", "RU": "Russia", "NZ": "New Zealand",
    "HK": "Hong Kong", "TW": "Taiwan", "IL": "Israel", "NL": "Netherlands",
    "BE": "Belgium", "CH": "Switzerland", "SE": "Sweden", "IE": "Ireland",
    "PT": "Portugal", "PL": "Poland", "AT": "Austria",
}


def fold(s: str) -> str:
    return "".join(ch for ch in s.lower() if ch.isalnum() or "\u0b80" <= ch <= "\u0bff")


def in_kl(lat: float, lon: float) -> bool:
    if lat < 8.15 or lat > 12.80 or lon < 74.72 or lon > 76.78:
        return False
    if lat >= 10.85 and lon >= 76.72:
        return False
    if lat >= 11.70 and lon >= 76.15:
        return False
    return True


def in_ka(lat: float, lon: float) -> bool:
    return 11.50 <= lat <= 18.45 and 74.05 <= lon <= 77.80


def in_ap(lat: float, lon: float) -> bool:
    if 15.85 <= lat <= 19.75 and 77.25 <= lon <= 81.35:
        return False
    return 12.55 <= lat <= 19.20 and 77.90 <= lon <= 84.80


def in_tn(lat: float, lon: float) -> bool:
    return 8.05 <= lat <= 13.56 and 76.50 <= lon <= 80.45


def south_tag(lat: float, lon: float) -> str | None:
    if in_kl(lat, lon):
        return "Kl"
    if in_ka(lat, lon):
        return "Ka"
    if in_tn(lat, lon):
        return "Tn"
    if in_ap(lat, lon):
        return "Ap"
    return None


def best_district_city(district: str, by_fold: dict):
    fd = fold(district)
    if not fd:
        return None
    hits = []
    for name, rows in by_fold.items():
        if name.startswith(fd) or fd.startswith(name) or fd in name:
            hits.extend(rows)
    if not hits:
        return None
    return max(hits, key=lambda x: x.get("p") or 0)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = json.loads((root / "public/data/cities-full.json").read_text()) if (root / "public/data/cities-full.json").exists() else json.loads((root / "public/data/cities.json").read_text())
    states = json.loads(Path(__file__).with_name("states-and-districts.json").read_text())["states"]
    india = [c for c in src if (c.get("c") or "").upper() == "IN"]
    south = []
    for c in india:
        tag = south_tag(c["lat"], c["lon"])
        if not tag:
            continue
        base = c["n"].split("(")[0].strip()
        south.append({"n": f"{base} ({tag})", "c": "IN", "tz": 5.5, "lat": round(float(c["lat"]), 4), "lon": round(float(c["lon"]), 4), **({"p": int(c["p"])} if c.get("p") else {})})
    seen = set(); south_u = []
    for c in south:
        key = (fold(c["n"]), round(c["lat"], 2), round(c["lon"], 2))
        if key in seen:
            continue
        seen.add(key); south_u.append(c)
    by_fold = defaultdict(list)
    for c in india:
        by_fold[fold(c["n"].split("(")[0])].append(c)
    districts = []; dseen = set()
    for st in states:
        if st["state"].lower() in SOUTH_STATES:
            continue
        for dist in st["districts"]:
            match = best_district_city(dist, by_fold)
            if not match:
                continue
            key = (round(match["lat"], 2), round(match["lon"], 2))
            if key in dseen:
                continue
            dseen.add(key)
            districts.append({"n": f"{dist} ({st['state']})", "c": "IN", "tz": 5.5, "lat": round(float(match["lat"]), 4), "lon": round(float(match["lon"]), 4), **({"p": int(match["p"])} if match.get("p") else {})})
    best_country = {}
    for c in src:
        cc = (c.get("c") or "").upper()
        if not cc or cc == "IN":
            continue
        prev = best_country.get(cc)
        if not prev or (c.get("p") or 0) > (prev.get("p") or 0):
            best_country[cc] = c
    countries = []
    for cc, c in best_country.items():
        city = c["n"].split("(")[0].strip()
        official = COUNTRY_NAME.get(cc, city)
        label = official if official.lower() == city.lower() else f"{official} ({city})"
        countries.append({"n": label, "c": cc, "tz": round(float(c.get("tz") or 0), 2), "lat": round(float(c["lat"]), 4), "lon": round(float(c["lon"]), 4), **({"p": int(c["p"])} if c.get("p") else {})})
    rows = south_u + districts + countries
    rows.sort(key=lambda c: (-(c.get("p") or 0), c["n"]))
    out = root / "public/data/cities.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, separators=(",", ":")))
    print(f"south={len(south_u)} districts={len(districts)} countries={len(countries)}")
    print(f"wrote {out} {len(rows)} rows {out.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    main()
