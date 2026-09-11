"""Adapter: Academic Literature evidence stream.

The three topical sheets have three genuinely different schemas. Each is
mapped EXPLICITLY onto the normalized schema -- they are never concatenated.
Columns absent from a sheet stay null so the explorer can say "not recorded
for this sheet" rather than implying the analyst found nothing.
"""

from __future__ import annotations

import re
from collections import Counter
from typing import Any

from common import (
    BuildReport,
    build_search_text,
    clean,
    clean_multiline,
    normalize_key,
    normalize_relevance,
    read_sheet,
    resolve_source,
    slugify,
)

STREAM_ID = "academic_literature"

SOURCE_CANDIDATES = ["Literature_Review_DesktopAnalysis_Results.xlsx"]

SHEETS = ["Groundwater Accounting", "Land Use Alternatives", "Community Considerations"]

# ---------------------------------------------------------------------------
# Explicit per-sheet column mappings. normalized_field -> source column.
# A field missing from a sheet is simply absent here and normalizes to None.
# ---------------------------------------------------------------------------
SHEET_MAPS: dict[str, dict[str, str]] = {
    "Groundwater Accounting": {
        "paper": "Paper",
        "citation": "Citation",
        "geography": "Geographic Scope",
        "analysis_method": "Analysis Method",
        "accounting_method": "Accounting Method(s) Covered",
        "comparative_finding": "Comparative Finding",
        "study_context": "Basin/Study Area Context",
        "key_finding": "Major Takeaway",
        "relevance": "Relevance",
    },
    "Land Use Alternatives": {
        "paper": "Paper",
        "citation": "Full Citation",
        "primary_topic": "Primary Topic",
        "secondary_topics_raw": "Secondary Topic(s)",
        "geography": "Geography",
        "accounting_method": "Accounting Method Described",
        "data_sources": "Data Sources Used",
        "formal_program_or_crediting": "Formal Crediting / Program",
        "key_finding": "Key Finding Relevant to GAP",
        "direct_quotes": "Direct Quote(s)",
        "accounting_gap": "Accounting Gap Identified",
        "relevance": "Relevance to GAP (H/M/L)",
        "notes": "Notes / Flags",
    },
    "Community Considerations": {
        "paper": "Paper",
        "citation": "Citation",
        "engagement_type_raw": "Community Engagement Type",
        "geography": "Geography",
        "analysis_method": "Summary of Analysis / Methods",
        "community_selection": "Community Selection",
        "direct_quotes": "Direct Quote(s)",
        "key_finding": "Key Finding Relevant to GAP",
        "learnings": "Learnings",
        "relevance": "Applicability to GAP",
        "notes": "Notes / Flags",
    },
}

# The Groundwater Accounting sheet is the accounting-methods cluster by
# construction -- the sheet itself is the topic. Recorded so the explorer's
# topic filter covers all three sheets without inventing a per-paper topic.
SHEET_DEFAULT_TOPIC = {
    "Groundwater Accounting": "Groundwater Accounting Methods",
}

LONG_FIELDS = {
    "key_finding", "direct_quotes", "accounting_gap", "notes", "analysis_method",
    "accounting_method", "data_sources", "formal_program_or_crediting",
    "comparative_finding", "study_context", "learnings", "community_selection",
    "citation",
}

NORMALIZED_FIELDS = [
    "paper", "citation", "primary_topic", "secondary_topics", "geography",
    "analysis_method", "accounting_method", "data_sources",
    "formal_program_or_crediting", "key_finding", "direct_quotes",
    "accounting_gap", "comparative_finding", "study_context", "learnings",
    "community_selection", "notes",
]


def _dedup_key(record: dict) -> str:
    """Explicit identity rule for the same paper appearing on two sheets.

    Requires BOTH the analyst's short reference (`Paper`) and the paper title
    to match. Citation strings are not comparable directly -- the same paper
    is written `Anderson, M., ... et al. (2018)` on one sheet and with the
    full author list on another -- so the title, taken as the text after the
    year parenthetical, is the discriminator.

    Deliberately strict: no similarity threshold, no author-only matching. A
    heuristic could silently merge two distinct papers by the same authors in
    the same year. See notes/decisions.md D-11.
    """
    short = normalize_key(record.get("paper"))
    citation = clean(record.get("citation")) or ""
    match = re.search(r"\((?:n\.d\.|\d{4}[a-z]?)\)\.?\s*(.+)", citation)
    tail = match.group(1) if match else citation
    # First sentence-ish chunk is the title; stop at the journal/publisher.
    title = re.split(r"(?<=[a-z])\.\s+[A-Z]", tail)[0]
    return f"{short}|{normalize_key(title)[:90]}"


def _split_topics(value: str | None) -> list[str]:
    """Split a free-text secondary-topic cell without inventing categories."""
    if not value:
        return []
    parts = re.split(r"[;,]| and ", value)
    return [p for p in (clean(p) for p in parts) if p]


def _parse_engagement_type(value: str | None) -> tuple[str | None, list[str]]:
    """Parse `X (primary); Y and Z (secondary)` from the Community sheet.

    If the compound form is not present the whole string becomes the primary
    topic -- we never drop information we cannot parse.
    """
    if not value:
        return None, []
    primary = None
    secondary: list[str] = []
    for chunk in value.split(";"):
        chunk = clean(chunk)
        if not chunk:
            continue
        role = None
        if re.search(r"\(primary", chunk, re.I):
            role = "primary"
        elif re.search(r"\(secondary", chunk, re.I):
            role = "secondary"
        label = clean(re.sub(r"\((primary|secondary)[^)]*\)", "", chunk, flags=re.I))
        if not label:
            continue
        if role == "primary" and primary is None:
            primary = label
        elif role == "secondary":
            secondary.extend(_split_topics(label))
        elif primary is None:
            primary = label
        else:
            secondary.extend(_split_topics(label))
    return primary, secondary


def ingest(report: BuildReport) -> dict[str, Any]:
    path = resolve_source(SOURCE_CANDIDATES)
    report.note(f"Literature source: {path.name}")

    records: list[dict] = []
    by_citation: dict[str, dict] = {}
    merged = 0

    for sheet in SHEETS:
        mapping = SHEET_MAPS[sheet]
        rows = read_sheet(path, sheet)
        report.note(f"Literature sheet {sheet!r}: {len(rows)} rows")

        for row in rows:
            record: dict[str, Any] = {f: None for f in NORMALIZED_FIELDS}
            for field, column in mapping.items():
                if field in ("relevance", "secondary_topics_raw", "engagement_type_raw"):
                    continue
                fn = clean_multiline if field in LONG_FIELDS else clean
                record[field] = fn(row.get(column))

            if not record["paper"]:
                continue

            # topics -- each sheet encodes them differently
            if sheet == "Land Use Alternatives":
                record["secondary_topics"] = _split_topics(clean(row.get("Secondary Topic(s)")))
            elif sheet == "Community Considerations":
                primary, secondary = _parse_engagement_type(clean(row.get("Community Engagement Type")))
                record["primary_topic"] = primary
                record["secondary_topics"] = secondary
                record["engagement_type_raw"] = clean(row.get("Community Engagement Type"))
            else:
                record["secondary_topics"] = []
            if not record["primary_topic"]:
                record["primary_topic"] = SHEET_DEFAULT_TOPIC.get(sheet)

            relevance_raw = clean(row.get(mapping["relevance"])) if mapping.get("relevance") else None
            record.update({
                "evidence_stream": STREAM_ID,
                "source_sheets": [sheet],
                "relevance": normalize_relevance(relevance_raw),
                "relevance_raw": relevance_raw,
                # Which normalized fields this sheet's schema can populate at
                # all. Lets the UI distinguish "the analyst recorded nothing"
                # from "this sheet has no such column".
                "fields_available": sorted(
                    f for f in mapping
                    if f not in ("relevance", "secondary_topics_raw", "engagement_type_raw")
                ) + (["secondary_topics"] if sheet != "Groundwater Accounting" else []),
            })

            key = _dedup_key(record)
            existing = by_citation.get(key)
            if existing is not None:
                # Same paper on two topical sheets. Merge, preserving BOTH
                # topical associations and both sheet names. Explicit
                # citation-equality only -- never fuzzy. See decisions D-11.
                merged += 1
                existing["source_sheets"].append(sheet)
                for field in NORMALIZED_FIELDS:
                    if not existing.get(field) and record.get(field):
                        existing[field] = record[field]
                for topic in ([record["primary_topic"]] if record["primary_topic"] else []) + record["secondary_topics"]:
                    if topic and topic != existing["primary_topic"] and topic not in existing["secondary_topics"]:
                        existing["secondary_topics"].append(topic)
                existing["fields_available"] = sorted(
                    set(existing["fields_available"]) | set(record["fields_available"])
                )
                report.note(f"Merged cross-sheet duplicate: {record['paper']} ({sheet})")
                continue

            by_citation[key] = record
            records.append(record)

    for i, record in enumerate(sorted(records, key=lambda r: normalize_key(r["paper"])), start=1):
        record["id"] = f"L-{i:03d}"
        record["slug"] = slugify(record["paper"])
        record["search_text"] = build_search_text(
            record["paper"], record["citation"], record["primary_topic"],
            " ".join(record["secondary_topics"]), record["geography"],
            record["analysis_method"], record["accounting_method"],
            record["key_finding"], record["accounting_gap"],
            record["direct_quotes"], record["notes"], record["learnings"],
            record["comparative_finding"], record["id"],
        )

    records.sort(key=lambda r: r["id"])
    if merged:
        report.note(f"{merged} cross-sheet duplicate(s) merged; {len(records)} unique papers")

    return {"records": records, "facets": _facets(records)}


def _facets(records: list[dict]) -> dict:
    primary = Counter(r["primary_topic"] for r in records if r.get("primary_topic"))
    secondary = Counter(t for r in records for t in r.get("secondary_topics", []))
    sheets = Counter(s for r in records for s in r["source_sheets"])
    geography = Counter()
    for r in records:
        if r.get("geography"):
            geography[r["geography"]] += 1

    return {
        "primary_topics": [{"value": v, "count": c} for v, c in sorted(primary.items())],
        "secondary_topics": [{"value": v, "count": c} for v, c in sorted(secondary.items())],
        "source_sheets": [{"value": v, "count": c} for v, c in sorted(sheets.items())],
        "relevance": [
            {"value": v, "count": c}
            for v, c in Counter(r["relevance"] for r in records if r.get("relevance")).items()
        ],
        "geographies": [{"value": v, "count": c} for v, c in sorted(geography.items())],
    }
