"""Adapter STUB: GSA Board Meetings evidence stream.

STATUS: planned. Not implemented. No meeting material has been reviewed.

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


class MeetingStreamNotConfigured(RuntimeError):
    """Raised when the stream is activated before an adapter exists."""


def ingest(report=None, basin_registry=None) -> dict[str, Any]:
    raise MeetingStreamNotConfigured(
        "The GSA Board Meetings evidence stream is registered as `planned` and "
        "has no implementation. No meeting source format has been established, "
        "so no ingestion logic has been written. See the module docstring for "
        "the record contract and the activation steps."
    )


def is_implemented() -> bool:
    """The orchestrator asks this before attempting to activate the stream."""
    return False
