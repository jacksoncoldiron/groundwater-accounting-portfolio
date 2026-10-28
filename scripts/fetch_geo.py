#!/usr/bin/env python3
"""Fetch the public boundary and river layers for the Study Area map.

    python3 scripts/fetch_geo.py

Writes data/geo/{subbasins,gsas,rivers}.geojson. Run it again only when a
basin is added (it reads `b118_number` from config/basins.yml) — the output is
committed so a normal site build needs no network access.

Sources (all public, no authentication):
  * Subbasins — DWR Bulletin 118 groundwater basins (i08_B118_CA_GroundwaterBasins)
  * GSAs      — DWR SGMA Portal GSA boundaries (i03_Groundwater_Sustainability_Agencies)
  * Rivers    — USGS National Hydrography Dataset, small-scale flowlines (NHDPlus)

Geometry is generalised on the server (maxAllowableOffset) to keep the files
small; it is for orientation, not analysis.
"""

from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import ROOT, active_basins, load_basins  # noqa: E402

OUT = ROOT / "data" / "geo"

B118 = "https://gis.water.ca.gov/arcgis/rest/services/Geoscientific/i08_B118_CA_GroundwaterBasins/FeatureServer/0/query"
GSA = "https://gis.water.ca.gov/arcgis/rest/services/Boundaries/i03_Groundwater_Sustainability_Agencies/FeatureServer/0/query"
NHD = "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/4/query"

# Rivers named in the synthesis, plus the main stems that frame the basins.
RIVERS = [
    "Sacramento River", "San Joaquin River", "Merced River", "Tuolumne River",
    "Stanislaus River", "Kaweah River", "Saint Johns River", "Salinas River",
    "Cache Creek", "Putah Creek", "Stony Creek", "Colusa Basin Drainage Canal",
    "Feather River", "Kings River", "Chowchilla River", "Tule River",
]


def query(url: str, params: dict) -> dict:
    qs = urllib.parse.urlencode({**params, "outSR": 4326, "geometryPrecision": 4, "f": "geojson"})
    with urllib.request.urlopen(f"{url}?{qs}", timeout=180) as res:
        data = json.load(res)
    if "error" in data:
        raise RuntimeError(f"{url}: {data['error']}")
    return data


def bbox(features):
    xs, ys = [], []
    def walk(c):
        if isinstance(c[0], (int, float)):
            xs.append(c[0]); ys.append(c[1])
        else:
            for p in c:
                walk(p)
    for f in features:
        walk(f["geometry"]["coordinates"])
    return min(xs), min(ys), max(xs), max(ys)


def main() -> int:
    basins = [b for b in active_basins(load_basins()) if b.get("b118_number")]
    by_number = {b["b118_number"]: b for b in basins}
    numbers = ",".join(f"'{n}'" for n in by_number)
    OUT.mkdir(parents=True, exist_ok=True)

    sub = query(B118, {
        "where": f"Basin_Subbasin_Number IN ({numbers})",
        "outFields": "Basin_Subbasin_Number,Basin_Subbasin_Name,Area_Acres,Area_SqMiles",
        "maxAllowableOffset": 0.0015,
    })
    for f in sub["features"]:
        p = f["properties"]
        b = by_number[p["Basin_Subbasin_Number"]]
        f["properties"] = {
            "basin_id": b["id"], "b118_number": p["Basin_Subbasin_Number"],
            "b118_name": p["Basin_Subbasin_Name"], "area_acres": p["Area_Acres"],
            "area_sq_mi": p["Area_SqMiles"],
        }
    (OUT / "subbasins.geojson").write_text(json.dumps(sub, separators=(",", ":")))

    # Subbasins outside the analysis that share an MLRP grant region with an
    # analysed one (config/basins.yml `grant_region_extra`), drawn as context.
    extra = {n: b["id"] for b in basins for n in (b.get("grant_region_extra") or [])}
    if extra:
        ext = query(B118, {
            "where": "Basin_Subbasin_Number IN (" + ",".join(f"'{n}'" for n in extra) + ")",
            "outFields": "Basin_Subbasin_Number,Basin_Subbasin_Name",
            "maxAllowableOffset": 0.0015,
        })
        for f in ext["features"]:
            p = f["properties"]
            f["properties"] = {"b118_number": p["Basin_Subbasin_Number"],
                               "b118_name": p["Basin_Subbasin_Name"],
                               "grant_of": extra[p["Basin_Subbasin_Number"]]}
        (OUT / "grant_context.geojson").write_text(json.dumps(ext, separators=(",", ":")))

    gsa = query(GSA, {
        "where": f"Basin_Subbasin_Number IN ({numbers})",
        "outFields": "GSA_ID,GSA_Name,Basin_Subbasin_Number",
        "maxAllowableOffset": 0.002,
    })
    for f in gsa["features"]:
        p = f["properties"]
        f["properties"] = {"gsa_id": p["GSA_ID"], "name": p["GSA_Name"],
                           "basin_id": by_number[p["Basin_Subbasin_Number"]]["id"]}
    (OUT / "gsas.geojson").write_text(json.dumps(gsa, separators=(",", ":")))

    x0, y0, x1, y1 = bbox(sub["features"])
    pad = 0.35
    names = ",".join("'" + n.replace("'", "''") + "'" for n in RIVERS)
    riv = query(NHD, {
        "where": f"GNIS_NAME IN ({names})",
        "geometry": f"{x0 - pad},{y0 - pad},{x1 + pad},{y1 + pad}",
        "geometryType": "esriGeometryEnvelope", "inSR": 4326,
        "spatialRel": "esriSpatialRelIntersects",
        "outFields": "GNIS_NAME", "maxAllowableOffset": 0.001,
    })
    merged = defaultdict(list)
    for f in riv["features"]:
        g = f["geometry"]
        parts = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        merged[f["properties"]["GNIS_NAME"]].extend(parts)
    rivers = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {"name": n},
         "geometry": {"type": "MultiLineString", "coordinates": parts}}
        for n, parts in sorted(merged.items())
    ]}
    (OUT / "rivers.geojson").write_text(json.dumps(rivers, separators=(",", ":")))

    for name in ("subbasins", "grant_context", "gsas", "rivers"):
        print(f"  > data/geo/{name}.geojson  ({(OUT / f'{name}.geojson').stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
