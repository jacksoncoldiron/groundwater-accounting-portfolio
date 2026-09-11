"""Adapter: Policy & Planning Documents evidence stream.

Reads the coded findings workbook and emits normalized findings records plus
the derived facets the Findings Explorer needs.

Contract:
  * source text and direct quotes are preserved exactly (whitespace only)
  * `Row ID` is the stable public identifier
  * absence findings are typed, never nulled
  * nothing basin-specific is hard-coded -- everything routes through
    config/basins.yml
"""

from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from common import (
    BuildReport,
    active_basins,
    basin_by_workbook_value,
    build_search_text,
    clean,
    clean_multiline,
    normalize_finding_type,
    normalize_key,
    normalize_relevance,
    normalize_verification,
    read_sheet,
    resolve_source,
    slugify,
)

STREAM_ID = "policy_planning"

SOURCE_CANDIDATES = [
    "Phase2_Findings.xlsx",
    "Phase2_Findings_OutlineClassified.xlsx",
]

FINDINGS_SHEET = "Findings"
LEGEND_SHEET = "Legend"

# Legend document-registry titles that differ from the title used in the
# Findings sheet. Explicit aliases -- no fuzzy matching, so a wrong join can
# never happen silently. See notes/decisions.md D-05.
DOCUMENT_ALIASES = {
    "merced subbasin gsp (2025 resubmittal)": "Merced GSP 2025",
    "turlock subbasin gsp (2024 resubmittal)": "Turlock Subbasin GSP 2024",
}

# Legend rows whose `Link` appears misaligned with its `Document Name`: both
# point into the Salinas Valley block while the row is East Turlock. Sending a
# reader to the wrong basin's plan is worse than publishing no link, so these
# are suppressed until the analyst confirms. See notes/narrative_review.md
# Part 3, question 1.
SUSPECT_LEGEND_LINKS = {
    "Turlock GSP Appendix K — ETSGSA Groundwater Demand Reduction Plan",
    "Turlock GSP Appendix L — First Amendment to inter-GSA MOA",
}


LINK_OVERRIDES = "document_links.yml"


def _link_overrides(report: BuildReport) -> dict[str, dict]:
    """Analyst-supplied document URLs, applied on top of the Legend registry.

    This is the intended place to add or correct a source link: it is
    reviewable in git, survives a workbook rebuild, and does not require
    editing a read-only source file.
    """
    import yaml

    from common import CONFIG_DIR

    path = CONFIG_DIR / LINK_OVERRIDES
    if not path.exists():
        return {}
    with open(path) as fh:
        data = yaml.safe_load(fh) or {}
    out = {}
    for title, entry in (data.get("documents") or {}).items():
        entry = entry or {}
        out[normalize_key(title)] = {
            "url": clean(entry.get("url")),
            "suppress": bool(entry.get("suppress")),
            "source_type": clean(entry.get("source_type")),
            "title": title,
        }
    supplied = sum(1 for v in out.values() if v["url"] and not v["suppress"])
    report.note(f"Link overrides: {len(out)} entries, {supplied} supplying a URL")
    return out


def _document_registry(path, report: BuildReport) -> dict[str, dict]:
    """Parse the document registry embedded in the Legend sheet.

    The Legend holds two unrelated blocks side by side; only the right-hand
    one (Subbasin / Type of Document / Document Name / Link) is a registry.
    """
    import openpyxl

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    try:
        rows = list(wb[LEGEND_SHEET].iter_rows(values_only=True))
    finally:
        wb.close()

    header_idx = None
    cols: dict[str, int] = {}
    for i, row in enumerate(rows):
        cells = {clean(c): j for j, c in enumerate(row) if clean(c)}
        if "Document Name" in cells and "Type of Document" in cells:
            header_idx = i
            cols = cells
            break

    if header_idx is None:
        report.warn("Legend sheet has no document registry; source links unavailable.")
        return {}

    registry: dict[str, dict] = {}
    suppressed = 0
    for row in rows[header_idx + 1:]:
        title = clean(row[cols["Document Name"]]) if cols.get("Document Name") is not None else None
        if not title:
            continue
        link = clean(row[cols["Link"]]) if cols.get("Link") is not None else None
        if title in SUSPECT_LEGEND_LINKS and link:
            link = None
            suppressed += 1
        record = {
            "source_title": title,
            "source_type": clean(row[cols["Type of Document"]]),
            "source_url": link if (link or "").startswith("http") else None,
            "registry_subbasin": clean(row[cols["Subbasin"]]) if cols.get("Subbasin") is not None else None,
        }
        registry[normalize_key(title)] = record
        alias = DOCUMENT_ALIASES.get(title.lower())
        if alias:
            registry[normalize_key(alias)] = record

    report.note(f"Document registry: {len(set(id(v) for v in registry.values()))} documents, "
                f"{sum(1 for v in registry.values() if v['source_url'])} with links")
    if suppressed:
        report.warn(
            f"{suppressed} Legend link(s) suppressed as misaligned "
            f"(see notes/decisions.md D-05): {', '.join(sorted(SUSPECT_LEGEND_LINKS))}"
        )
    return registry


def ingest(report: BuildReport, basin_registry: dict) -> dict[str, Any]:
    path = resolve_source(SOURCE_CANDIDATES)
    report.note(f"Findings source: {path.name}")

    registry = _document_registry(path, report)
    overrides = _link_overrides(report)
    by_workbook = basin_by_workbook_value(basin_registry)
    allowed = {b["id"] for b in active_basins(basin_registry)}

    raw = read_sheet(path, FINDINGS_SHEET)
    report.note(f"Findings sheet: {len(raw)} non-empty rows")

    records: list[dict] = []
    unmatched_docs: set[str] = set()
    unknown_basins: Counter = Counter()
    excluded_planned: Counter = Counter()

    for row in raw:
        row_id = clean(row.get("Row ID"))
        if not row_id:
            report.warn("Row with no Row ID skipped")
            continue

        basin_value = clean(row.get("Subbasin"))
        basin = by_workbook.get(normalize_key(basin_value))
        if basin is None:
            unknown_basins[basin_value] += 1
            continue
        if basin["id"] not in allowed:
            # A basin still marked `planned` must not contribute evidence.
            excluded_planned[basin["id"]] += 1
            continue

        ftype = normalize_finding_type(row.get("Finding Type"))
        ftype_id = ftype["id"] if ftype else None

        document = clean(row.get("Document"))
        doc_key = normalize_key(document) if document else None
        doc_meta = dict(registry.get(doc_key, {})) if doc_key else {}
        if document and not doc_meta:
            unmatched_docs.add(document)

        # config/document_links.yml wins over the Legend registry.
        override = overrides.get(doc_key) if doc_key else None
        if override:
            if override["suppress"]:
                doc_meta["source_url"] = None
            elif override["url"]:
                doc_meta["source_url"] = override["url"]
            if override["source_type"]:
                doc_meta["source_type"] = override["source_type"]

        # `Related Finding` may hold one id or several; ints and strings both appear.
        related_raw = clean(row.get("Related Finding"))
        related = []
        if related_raw:
            for token in related_raw.replace(";", ",").replace("/", ",").split(","):
                token = token.strip()
                if token.isdigit():
                    related.append(token)

        finding = clean_multiline(row.get("Finding"))
        quote = clean_multiline(row.get("Direct Quote"))
        notes = clean_multiline(row.get("Notes"))
        section = clean(row.get("Section"))
        subsection = clean(row.get("Subsection"))
        chapter = clean(row.get("Chapter"))
        lit_gap = clean_multiline(row.get("Lit Review Question/Gap Addressed"))

        records.append({
            "id": f"F-{row_id}",
            "row_id": row_id,
            "evidence_stream": STREAM_ID,

            # basin / agency
            "basin_id": basin["id"],
            "basin_name": basin["name"],
            "basin_short_name": basin["short_name"],
            "subbasin": basin_value,          # original workbook string
            "gsa": clean(row.get("GSA")),

            # location in the coding frame
            "chapter": chapter,
            "chapter_slug": slugify(chapter),
            "section": section,
            "section_slug": slugify(section),
            "subsection": subsection,          # the cross-basin comparison key
            "subsection_slug": slugify(subsection),

            # the evidence itself -- preserved
            "finding_type": ftype_id,
            "finding_type_label": ftype["label"] if ftype else None,
            "finding": finding,
            "direct_quote": quote,
            "notes": notes,
            "lit_review_gap": lit_gap,
            "related_findings": related,

            # analyst ratings
            "relevance_gap": normalize_relevance(row.get("Relevance to GAP")),
            "relevance_gap_raw": clean(row.get("Relevance to GAP")),
            "relevance_dwr": normalize_relevance(row.get("Relevance to DWR Recommendations")),
            "relevance_dwr_raw": clean(row.get("Relevance to DWR Recommendations")),
            "verification_status": normalize_verification(row.get("Quote Verified"), ftype_id),

            # provenance
            "source_title": document,
            "source_type": doc_meta.get("source_type"),
            "source_url": doc_meta.get("source_url"),

            "search_text": build_search_text(
                finding, quote, notes, document, chapter, section, subsection,
                basin["name"], clean(row.get("GSA")), lit_gap, f"F-{row_id}",
            ),
        })

    for value, count in unknown_basins.items():
        report.warn(
            f"{count} row(s) have Subbasin={value!r}, which matches no "
            f"`workbook_value` in config/basins.yml. Excluded."
        )
    for basin_id, count in excluded_planned.items():
        report.warn(
            f"{count} finding row(s) exist for basin {basin_id!r}, which is "
            f"still marked `planned`. Excluded from all counts. Flip its "
            f"status in config/basins.yml to publish them."
        )
    if unmatched_docs:
        report.note(
            f"{len(unmatched_docs)} document title(s) not in the Legend registry "
            f"(no source_type/url): {', '.join(sorted(unmatched_docs)[:3])}"
            + ("..." if len(unmatched_docs) > 3 else "")
        )

    records.sort(key=lambda r: int(r["row_id"]))
    return {"records": records, "facets": _facets(records, basin_registry)}


def _facets(records: list[dict], basin_registry: dict) -> dict:
    """Derive every explorer filter option from the data. Nothing hand-listed."""

    def counted(key):
        return Counter(r[key] for r in records if r.get(key))

    # Chapters keep their numeric prefix ordering ("1. ISW", "2. MLRP", ...).
    chapters = [
        {"value": v, "slug": slugify(v), "count": c}
        for v, c in sorted(counted("chapter").items())
    ]

    sections_by_chapter = defaultdict(Counter)
    for r in records:
        if r.get("chapter") and r.get("section"):
            sections_by_chapter[r["chapter"]][r["section"]] += 1

    gsa_labels = basin_registry.get("gsa_labels", {})
    gsas = []
    for value, count in sorted(counted("gsa").items()):
        meta = gsa_labels.get(value, {})
        gsas.append({
            "value": value,
            "label": meta.get("label", value),
            "kind": meta.get("kind", "gsa"),
            "description": meta.get("description"),
            "count": count,
        })

    basins = []
    for b in active_basins(basin_registry):
        count = sum(1 for r in records if r["basin_id"] == b["id"])
        basins.append({
            "value": b["id"],
            "label": b["short_name"],
            "full_name": b["name"],
            "count": count,
        })

    return {
        "chapters": chapters,
        "sections": {
            ch: [{"value": v, "count": c} for v, c in sorted(counts.items())]
            for ch, counts in sections_by_chapter.items()
        },
        "basins": basins,
        "gsas": gsas,
        "finding_types": [
            {"value": v, "count": c} for v, c in sorted(counted("finding_type").items())
        ],
        "relevance_gap": [
            {"value": v, "count": c} for v, c in counted("relevance_gap").items()
        ],
        "relevance_dwr": [
            {"value": v, "count": c} for v, c in counted("relevance_dwr").items()
        ],
        "verification": [
            {"value": v, "count": c} for v, c in counted("verification_status").items()
        ],
        "documents": [
            {"value": v, "count": c} for v, c in sorted(counted("source_title").items())
        ],
    }
