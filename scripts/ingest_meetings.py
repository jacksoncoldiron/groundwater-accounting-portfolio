"""Adapter: GSA Board Meetings evidence stream (WaterOne export).

STATUS: active. Reads source_materials/waterone_findings.csv, a coded export
of findings drawn from GSA board-meeting recordings, transcripts, agenda
packets and minutes hosted on WaterOne (gsa.waterone.ai).

The CSV schema is the analyst's own coding format; this adapter maps it onto
the shared provenance contract below. Text fields (finding, evidence_text,
notes) are preserved exactly, whitespace only. `run_mode` distinguishes
updates to the six case-study subbasins (A) from findings in other
subbasins (B), which are NOT part of the cross-basin analysis.

The notes below describe the original stub and are kept for the contract.

This module exists so that the provenance model, the build pipeline, and the
public site can accept a meeting-evidence stream later WITHOUT refactoring the
site architecture. It deliberately implements no scraper, no API client, and
no transcript parser.

A candidate host for meeting recordings and transcripts has been mentioned
(Waterone.ai), but no export format, API, or access method has been
established. Writing an adapter against an assumed interface would produce
code that is wrong in an unknown way. The adapter below defines the record
CONTRACT only; implement `ingest()` against whatever export actually exists.

To activate this stream:
  1. Implement `ingest()` so it returns records satisfying MEETING_RECORD_CONTRACT.
  2. Set `status: active` for `gsa_board_meetings` in config/evidence_streams.yml.
  3. Run `python3 scripts/build_data.py`. The Findings Explorer will grow an
     "Evidence Stream" filter automatically (it appears once more than one
     stream carries findings-shaped evidence).
  4. Work through notes/narrative_review.md -- every claim scoped to "the
     reviewed documents" may now be stale.
"""

from __future__ import annotations

from typing import Any

# ---------------------------------------------------------------------------
# Record contract.
#
# `required` fields must be present on every record. `optional` fields are
# preserved when the source supplies them and stay None otherwise -- an
# absent timestamp must never be rendered as a zero or as a claim about the
# meeting.
# ---------------------------------------------------------------------------
MEETING_RECORD_CONTRACT: dict[str, dict[str, str]] = {
    "required": {
        "evidence_id": "Stable unique id, prefixed `M-`.",
        "evidence_stream": "Always 'gsa_board_meetings'.",
        "basin_id": "Must match an id in config/basins.yml.",
        "source_title": "Meeting title or descriptor.",
    },
    "optional": {
        "gsa": "Agency code, matching the findings workbook vocabulary.",
        "meeting_date": "ISO 8601 date of the meeting.",
        "agenda_item": "Agenda item the excerpt sits under.",
        "speaker": "Name of the speaker, when attributable.",
        "speaker_role": "Board member, staff, consultant, public commenter, ...",
        "transcript_excerpt": "Verbatim excerpt. Preserved exactly.",
        "excerpt_start_time": "Start timestamp within the recording.",
        "excerpt_end_time": "End timestamp within the recording.",
        "recording_url": "Only if supplied. Never constructed.",
        "transcript_url": "Only if supplied. Never constructed.",
        "minutes_url": "Only if supplied. Never constructed.",
        "verification_status": "verified | unverified | not_applicable.",
        "related_finding_ids": "Row IDs of coded findings this evidence bears on.",
    },
}

# Spoken deliberation is not an adopted plan or rule. Meeting evidence must
# stay visually and textually distinguishable from it in every citation,
# filter, and card on the site.
DISCLOSURE_RULE = (
    "Board-meeting evidence records what was said in a meeting, not what an "
    "agency adopted. It must never be cited as an adopted plan, rule, or "
    "commitment, and the stream must not be described as reviewed until real "
    "meeting evidence has been ingested and verified."
)


import csv
from collections import Counter

from common import SOURCE_DIR, build_search_text, clean, clean_multiline, normalize_key, slugify

STREAM_ID = "gsa_board_meetings"
SOURCE_FILE = "waterone_findings.csv"

CHAPTERS = {
    "ISW": "1. ISW",
    "MLRP": "2. MLRP",
    "Community Considerations": "3. Community Considerations",
}
FINDING_TYPES = {
    "positive finding": "positive",
    "absence finding": "absence",
    "ambiguous": "ambiguous",
}
EVIDENCE_TYPES = {
    "transcript_verbatim": "Transcript excerpt (verbatim)",
    "agenda_packet_verbatim": "Agenda packet excerpt (verbatim)",
    "minutes_verbatim": "Minutes excerpt (verbatim)",
    "ai_summary": "AI-generated summary (not verbatim)",
}
CONFIDENCE = {"H": "high", "M": "medium", "L": "low"}
RELATIONS = {
    "adds": "Adds to", "operationalizes": "Operationalizes", "corroborates": "Corroborates",
    "updates": "Updates", "contradicts": "Contradicts", "new_basin": "New subbasin",
}


def is_implemented() -> bool:
    return (SOURCE_DIR / SOURCE_FILE).exists()


def _ids(value):
    text = clean(value)
    if not text or text.lower() == "none":
        return []
    return [t.strip() for t in text.replace(",", ";").split(";") if t.strip()]


def _facet(records, key, label=None):
    c = Counter(r[key] for r in records if r.get(key))
    return [{"value": v, "label": (label(v) if label else v), "count": n}
            for v, n in sorted(c.items(), key=lambda kv: str(kv[0]))]


def ingest(report=None, basin_registry=None, section_titles=None) -> dict[str, Any]:
    path = SOURCE_DIR / SOURCE_FILE
    with open(path, encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))
    by_label = {normalize_key(b["short_name"]): b for b in (basin_registry or {}).get("basins", [])}
    section_titles = section_titles or {}

    records = []
    for row in rows:
        label = clean(row.get("case_study_label"))
        basin = by_label.get(normalize_key(label)) if label else None
        case_study = (row.get("run_mode") or "").startswith("A") and basin is not None
        sec_id = clean(row.get("outline_section"))
        section = f"{sec_id} {section_titles[sec_id]}" if sec_id in section_titles else sec_id
        ref = clean(row.get("source_reference"))
        ftype = FINDING_TYPES.get((clean(row.get("finding_type")) or "").lower())
        rec = {
            "id": clean(row["record_id"]),
            "evidence_stream": STREAM_ID,
            "source_type": "GSA board meeting",
            "scope": "case_study" if case_study else "other_subbasin",
            "basin_id": basin["id"] if case_study else None,
            "basin_short_name": basin["short_name"] if case_study else None,
            "subbasin": clean(row.get("dwr_subbasin_name")),
            "b118_number": clean(row.get("dwr_basin_number")),
            "gsa": clean(row.get("gsa_entity")),
            "chapter": CHAPTERS.get(clean(row.get("chapter")), clean(row.get("chapter"))),
            "section": section,
            "question_id": clean(row.get("question_id")),
            "relation": clean(row.get("relation_to_prior_finding")),
            "related_findings": _ids(row.get("related_finding_ids")) if case_study else [],
            "finding_type": ftype,
            "dwr_tag": clean(row.get("dwr_tag")),
            "finding": clean_multiline(row.get("finding")),
            "quantitative_detail": clean_multiline(row.get("quantitative_detail")),
            "discussion_stage": clean(row.get("discussion_stage")),
            "speaker_role": clean(row.get("speaker_role")),
            "meeting_body": clean(row.get("meeting_body")),
            "meeting_date": clean(row.get("meeting_date")),
            "agenda_item": clean(row.get("agenda_item")),
            "evidence_text": clean_multiline(row.get("evidence_text")),
            "evidence_type": clean(row.get("evidence_text_type")),
            "source_url": ref if ref and ref.startswith("http") else None,
            "source_reference": ref if ref and not ref.startswith("http") else None,
            "additional_meeting_dates": clean(row.get("additional_meeting_dates")),
            "confidence": CONFIDENCE.get((clean(row.get("confidence")) or "").upper()),
            "notes": clean_multiline(row.get("notes")),
        }
        # No search_text here: the file is large, so the browser builds the
        # search haystack from these same fields (assets/js/meetings.js).
        records.append(rec)

    unknown = [r["id"] for r in records if not r["finding_type"]]
    if report and unknown:
        report.warn(f"Meeting findings with an unrecognised finding type: {unknown[:5]}")

    sections = {}
    for r in records:
        if r["section"]:
            sections.setdefault(r["chapter"], Counter())[r["section"]] += 1
    facets = {
        "scope": _facet(records, "scope"),
        "chapters": _facet(records, "chapter"),
        "subbasins": _facet(records, "subbasin"),
        "sections": {ch: [{"value": v, "count": n} for v, n in c.items()] for ch, c in sections.items()},
        "finding_types": _facet(records, "finding_type"),
        "discussion_stages": _facet(records, "discussion_stage"),
        "dwr_tags": _facet(records, "dwr_tag"),
        "relations": _facet([r for r in records if r["scope"] == "case_study"], "relation"),
        "gsas": _facet(records, "gsa"),
        "evidence_types": _facet(records, "evidence_type"),
        "confidence": _facet(records, "confidence"),
    }
    if report:
        report.note(f"Meeting findings: {len(records)} "
                    f"({sum(r['scope'] == 'case_study' for r in records)} in case-study subbasins, "
                    f"{len({r['subbasin'] for r in records})} subbasins)")
    return {"records": records, "facets": facets,
            "labels": {"evidence_types": EVIDENCE_TYPES, "relations": RELATIONS}}
