#!/usr/bin/env python3
"""Build the processed data layer for the Groundwater Accounting site.

    python3 scripts/build_data.py

Reads the registries in config/ and the workbooks in source_materials/,
runs one adapter per ACTIVE evidence stream, and writes JSON to
data/processed/. Source files are opened read-only and never modified.

Invariants enforced here (the build fails loudly rather than publishing
something misleading):
  * a basin marked `planned` contributes zero evidence
  * a stream marked `planned` is never ingested and never counted
  * every public count is derived, never hard-coded
"""

from __future__ import annotations

import json
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ingest_findings
import ingest_literature
import ingest_meetings
import ingest_references
import render_partials
from common import (
    PROCESSED_DIR,
    BuildReport,
    active_basins,
    active_streams,
    load_basins,
    load_evidence_streams,
    planned_basins,
)

SCHEMA_VERSION = 1


def write_json(name: str, payload) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    path = PROCESSED_DIR / name
    with open(path, "w") as fh:
        json.dump(payload, fh, indent=None, separators=(",", ":"), ensure_ascii=False)
    size = path.stat().st_size
    print(f"  > {path.relative_to(PROCESSED_DIR.parent.parent)}  ({size / 1024:.1f} KB)")
    return path


def build_comparison_frame(findings: list[dict], basin_registry: dict) -> dict:
    """Cross-basin comparison scaffold, derived entirely from coded data.

    A row is a `Subsection` -- which the workbook Legend defines as "the actual
    grouping key for comparison across basins" and which holds the analytical
    question asked of each basin. A cell is that basin's coded finding(s).

    NO SCORE IS ASSIGNED. Cell state comes only from `Finding Type`, plus one
    extra state the data itself provides:

        not_coded -- the analyst did not code this question for this basin.

    That is deliberately NOT an absence finding: "the question was not asked
    of this basin" and "this basin's documents do not answer it" are different
    facts, and collapsing them would manufacture evidence.
    See notes/decisions.md D-04.
    """
    basins = active_basins(basin_registry)
    basin_ids = [b["id"] for b in basins]

    grouped: dict[tuple, dict[str, list[dict]]] = defaultdict(lambda: defaultdict(list))
    meta: dict[tuple, dict] = {}

    for f in findings:
        if not f.get("subsection") or not f.get("section"):
            continue
        key = (f["chapter"], f["section"], f["subsection"])
        grouped[key][f["basin_id"]].append(f)
        meta.setdefault(key, {
            "chapter": f["chapter"],
            "section": f["section"],
            "subsection": f["subsection"],
            "subsection_slug": f["subsection_slug"],
        })

    rows = []
    for key, by_basin in grouped.items():
        cells = {}
        for basin_id in basin_ids:
            items = by_basin.get(basin_id, [])
            if not items:
                cells[basin_id] = {
                    "state": "not_coded", "count": 0,
                    "type_counts": {}, "finding_ids": [],
                }
                continue
            types = {i["finding_type"] for i in items}
            # A basin whose only coded answer is an absence is reported as
            # "not found in reviewed documents". Mixed evidence is reported as
            # mixed rather than resolved by the pipeline.
            if types == {"absence"}:
                state = "absence"
            elif types == {"positive"}:
                state = "positive"
            elif types == {"ambiguous"}:
                state = "ambiguous"
            else:
                state = "mixed"
            cells[basin_id] = {
                "state": state,
                "count": len(items),
                # True per-type counts, kept alongside the collapsed state so a
                # consumer that aggregates several cells (the chapter tracks
                # group a whole section) can report the real breakdown instead
                # of collapsing everything to "mixed".
                "type_counts": dict(Counter(i["finding_type"] for i in items)),
                "finding_ids": [i["id"] for i in items],
            }
        row = dict(meta[key])
        row["cells"] = cells
        row["basins_covered"] = sum(1 for c in cells.values() if c["state"] != "not_coded")
        rows.append(row)

    rows.sort(key=lambda r: (r["chapter"], r["section"], r["subsection"]))

    return {
        "basin_order": basin_ids,
        "cell_states": {
            "positive": {
                "label": "Documented practice",
                "meaning": "The reviewed documents describe or measure this.",
            },
            "absence": {
                "label": "Not found in reviewed documents",
                "meaning": (
                    "The analyst searched the reviewed document set and did not "
                    "find this. It is not a finding that the practice does not exist."
                ),
            },
            "ambiguous": {
                "label": "Ambiguous",
                "meaning": "The reviewed documents are unclear or internally inconsistent.",
            },
            "mixed": {
                "label": "Mixed evidence",
                "meaning": "More than one kind of finding was coded for this question.",
            },
            "not_coded": {
                "label": "Question not coded for this basin",
                "meaning": (
                    "This question was not coded for this basin. This is a scope "
                    "statement about the analysis, NOT an absence finding about "
                    "the basin's documents."
                ),
            },
        },
        "rows": rows,
    }


def main() -> int:
    print("\nBuilding processed data\n" + "=" * 60)
    report = BuildReport()

    basin_registry = load_basins()
    stream_registry = load_evidence_streams()

    actives = active_basins(basin_registry)
    planned = planned_basins(basin_registry)
    streams_on = active_streams(stream_registry)

    print(f"\nRegistries")
    report.note(f"Active basins ({len(actives)}): {', '.join(b['short_name'] for b in actives)}")
    report.note(f"Planned basins ({len(planned)}): {', '.join(b['short_name'] for b in planned) or 'none'}")
    report.note(f"Active evidence streams: {', '.join(s['name'] for s in streams_on)}")

    # --- planned-stream guard --------------------------------------------
    for stream in stream_registry["streams"]:
        if stream["status"] == "active" and stream["id"] == "gsa_board_meetings":
            if not ingest_meetings.is_implemented():
                report.warn(
                    "gsa_board_meetings is marked ACTIVE but its adapter is still "
                    "a stub. Refusing to build -- the site would imply meetings "
                    "were reviewed. Implement scripts/ingest_meetings.py first."
                )
                return 1

    # --- findings ---------------------------------------------------------
    print("\nPolicy & Planning Documents")
    findings_out = ingest_findings.ingest(report, basin_registry)
    findings = findings_out["records"]

    # --- literature -------------------------------------------------------
    print("\nAcademic Literature")
    literature_out = ingest_literature.ingest(report)
    literature = literature_out["records"]

    # --- bibliographic identifiers + tool registry ------------------------
    print("\nConsolidation (references, tools, literature gaps)")
    consolidated = ingest_references.ingest(report)
    ingest_references.attach_dois(literature, consolidated["references"], report)

    # --- invariant: planned basins contribute nothing ---------------------
    planned_ids = {b["id"] for b in planned}
    leaked = [f["id"] for f in findings if f["basin_id"] in planned_ids]
    if leaked:
        report.warn(f"INVARIANT VIOLATION: planned basins have findings: {leaked[:5]}")
        return 1

    # --- derived statistics ----------------------------------------------
    print("\nDerived statistics")
    by_basin = Counter(f["basin_id"] for f in findings)
    by_chapter = Counter(f["chapter"] for f in findings)
    by_type = Counter(f["finding_type"] for f in findings)

    stats = {
        "findings_total": len(findings),
        "documents_total": len({f["source_title"] for f in findings if f["source_title"]}),
        "documents_with_links": len(
            {f["source_title"] for f in findings if f.get("source_url")}
        ),
        "literature_total": len(literature),
        "literature_with_doi": sum(1 for r in literature if r.get("doi")),
        "tools_checked": len(consolidated["tools"]),
        "active_basins": len(actives),
        "planned_basins": len(planned),
        "active_streams": len(streams_on),
        "gsas_total": len({
            f["gsa"] for f in findings
            if f["gsa"] and basin_registry.get("gsa_labels", {}).get(f["gsa"], {}).get("kind") not in ("scope", "other")
        }),
        "sections_total": len({f["section"] for f in findings if f["section"]}),
        "comparison_questions_total": len({f["subsection"] for f in findings if f["subsection"]}),
        "quotes_verified": sum(1 for f in findings if f["verification_status"] == "verified"),
        "absence_findings": by_type.get("absence", 0),
        "findings_by_basin": dict(by_basin),
        "findings_by_chapter": dict(by_chapter),
        "findings_by_type": dict(by_type),
    }

    comparison = build_comparison_frame(findings, basin_registry)
    stats["comparison_questions_all_basins"] = sum(
        1 for r in comparison["rows"] if r["basins_covered"] == len(actives)
    )
    stats["comparison_questions_multi_basin"] = sum(
        1 for r in comparison["rows"] if r["basins_covered"] >= 2
    )

    for k, v in stats.items():
        if not isinstance(v, dict):
            report.note(f"{k}: {v}")

    # --- public registry projections --------------------------------------
    basins_public = []
    for b in basin_registry["basins"]:
        basins_public.append({
            "id": b["id"],
            "slug": b["slug"],
            "name": b["name"],
            "short_name": b["short_name"],
            "status": b["status"],
            "include_in_analysis": bool(b.get("include_in_analysis")),
            "region": b.get("region"),
            "order": b.get("order", 999),
            "scope_note": b.get("scope_note"),
            "gsas": b.get("gsas") or [],
            "profile": b.get("profile") or {},
            "findings_count": by_basin.get(b["id"], 0) if b.get("include_in_analysis") else None,
            # A planned basin gets NO findings link -- a link would imply
            # evidence exists.
            "findings_url": (
                f"findings.html?basin={b['id']}" if b.get("include_in_analysis") else None
            ),
        })

    streams_public = [{
        "id": s["id"],
        "name": s["name"],
        "short_name": s.get("short_name", s["name"]),
        "status": s["status"],
        "order": s.get("order", 999),
        "description": s["description"],
        "citation_note": s.get("citation_note"),
        "public_disclosure": s.get("public_disclosure"),
        "record_count": (
            len(findings) if s["id"] == "policy_planning"
            else len(literature) if s["id"] == "academic_literature"
            else 0
        ) if s["status"] == "active" else None,
    } for s in sorted(stream_registry["streams"], key=lambda s: s.get("order", 999))]

    manifest = {
        "schema_version": SCHEMA_VERSION,
        "build_date": date.today().isoformat(),
        "active_basin_ids": [b["id"] for b in actives],
        "active_basin_count": len(actives),
        "planned_basin_ids": [b["id"] for b in planned],
        "active_evidence_streams": [s["id"] for s in streams_on],
        "planned_evidence_streams": [
            s["id"] for s in stream_registry["streams"] if s["status"] != "active"
        ],
        "findings_count": len(findings),
        "literature_count": len(literature),
        "warnings": report.warnings,
        "source_files": [
            "source_materials/Phase2_Findings.xlsx",
            "source_materials/Literature_Review_DesktopAnalysis_Results.xlsx",
        ],
    }

    print("\nWriting")
    write_json("findings.json", {
        "schema_version": SCHEMA_VERSION,
        "records": findings,
        "facets": findings_out["facets"],
    })
    write_json("literature.json", {
        "schema_version": SCHEMA_VERSION,
        "records": literature,
        "facets": literature_out["facets"],
    })
    write_json("comparison.json", comparison)
    write_json("reference_context.json", {
        "tools": consolidated["tools"],
        "literature_gaps": consolidated["literature_gaps"],
    })
    write_json("basins.json", {"basins": basins_public,
                               "gsa_labels": basin_registry.get("gsa_labels", {})})
    write_json("evidence_streams.json", {"streams": streams_public})
    write_json("stats.json", stats)
    write_json("manifest.json", manifest)

    print("\nRendering Quarto partials")
    render_partials.render_all(stats, manifest, basins_public, streams_public,
                               consolidated["tools"])

    print("\n" + "=" * 60)
    if report.warnings:
        print(f"Build complete with {len(report.warnings)} warning(s):")
        for w in report.warnings:
            print(f"  ! {w}")
    else:
        print("Build complete. No warnings.")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
