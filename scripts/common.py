"""Shared helpers for the evidence ingestion adapters.

Every adapter emits records that satisfy the provenance contract declared in
``config/evidence_streams.yml``. Nothing here knows about a specific basin,
stream, or workbook column -- that lives in the adapters.
"""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path
from typing import Any, Iterable

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = ROOT / "config"
SOURCE_DIR = ROOT / "source_materials"
PROCESSED_DIR = ROOT / "data" / "processed"


# --------------------------------------------------------------------------
# Text handling
#
# Rule from CLAUDE.md section 11: normalize whitespace ONLY. Source text and
# direct quotes are otherwise preserved exactly.
# --------------------------------------------------------------------------

def clean(value: Any) -> str | None:
    """Collapse whitespace; return None for anything empty.

    Missing values are always None -- never "" and never "N/A" -- so the
    front end can distinguish "not recorded" from "recorded as empty".
    """
    if value is None:
        return None
    text = str(value)
    text = text.replace(" ", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


def clean_multiline(value: Any) -> str | None:
    """Like :func:`clean` but keeps paragraph breaks.

    Used for long quote and note fields where the analyst's line structure
    carries meaning.
    """
    if value is None:
        return None
    text = str(value).replace(" ", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = "\n".join(line.strip() for line in text.split("\n"))
    return text.strip() or None


def slugify(value: Any) -> str | None:
    """URL-safe slug. Derived value only -- the original is always preserved."""
    text = clean(value)
    if text is None:
        return None
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or None


def normalize_key(value: Any) -> str:
    """Aggressive normalization used only for joining, never for display."""
    text = clean(value) or ""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", text.lower())


def build_search_text(*parts: Any) -> str:
    """Concatenate fields into one lowercase haystack for client-side search."""
    chunks = [clean(p) for p in parts]
    return " ".join(c for c in chunks if c).lower()


# --------------------------------------------------------------------------
# Controlled vocabularies
#
# The two workbooks spell relevance differently (H/M/L vs HIGH/MEDIUM/LOW).
# Both map onto one vocabulary for filtering; the original string is always
# kept on the record alongside it.
# --------------------------------------------------------------------------

RELEVANCE_MAP = {
    "h": "high", "high": "high",
    "m": "medium", "med": "medium", "medium": "medium",
    "l": "low", "low": "low",
}
RELEVANCE_LABEL = {"high": "High", "medium": "Medium", "low": "Low"}
RELEVANCE_ORDER = ["high", "medium", "low"]


def normalize_relevance(value: Any) -> str | None:
    text = clean(value)
    if text is None:
        return None
    return RELEVANCE_MAP.get(text.lower().strip(".").strip())


# Finding Type -> the exact language the site is allowed to use.
#
# "Absence Finding" means NOT FOUND IN THE REVIEWED DOCUMENTS. It never means
# the practice does not exist. See notes/decisions.md D-03.
FINDING_TYPES = {
    "positive finding": {
        "id": "positive",
        "label": "Positive Finding",
        "meaning": "The reviewed documents describe or measure this.",
    },
    "absence finding": {
        "id": "absence",
        "label": "Absence Finding",
        "meaning": (
            "Not found in the reviewed documents. This is a statement about "
            "the document set, not a statement that the practice does not "
            "exist."
        ),
    },
    "ambiguous": {
        "id": "ambiguous",
        "label": "Ambiguous",
        "meaning": "The reviewed documents are unclear or internally inconsistent.",
    },
}


def normalize_finding_type(value: Any) -> dict[str, str] | None:
    text = clean(value)
    if text is None:
        return None
    return FINDING_TYPES.get(text.lower())


# Quote Verified: three states, not two. Blank is the documented N/A state for
# Absence Findings per the workbook Legend -- it is NOT "unverified".
# See notes/decisions.md D-06.
VERIFICATION_STATES = {
    "verified": "Quote verified against the source document",
    "unverified": "Quote not yet verified against the source document",
    "not_applicable": "No quotation to verify (absence finding)",
}


def normalize_verification(value: Any, finding_type_id: str | None = None) -> str:
    text = (clean(value) or "").upper()
    if text == "Y":
        return "verified"
    if text == "N":
        return "unverified"
    if finding_type_id == "absence":
        return "not_applicable"
    return "not_applicable"


# --------------------------------------------------------------------------
# Registries
# --------------------------------------------------------------------------

def load_basins() -> dict:
    with open(CONFIG_DIR / "basins.yml") as fh:
        return yaml.safe_load(fh)


def load_evidence_streams() -> dict:
    with open(CONFIG_DIR / "evidence_streams.yml") as fh:
        return yaml.safe_load(fh)


def active_basins(registry: dict) -> list[dict]:
    """Basins that may contribute to public counts, filters, and comparisons."""
    return sorted(
        (b for b in registry["basins"] if b.get("include_in_analysis")),
        key=lambda b: b.get("order", 999),
    )


def planned_basins(registry: dict) -> list[dict]:
    return sorted(
        (b for b in registry["basins"] if not b.get("include_in_analysis")),
        key=lambda b: b.get("order", 999),
    )


def basin_by_workbook_value(registry: dict) -> dict[str, dict]:
    """Map the exact `Subbasin` string used in the workbook to its basin block."""
    return {normalize_key(b["workbook_value"]): b for b in registry["basins"]}


def active_streams(registry: dict) -> list[dict]:
    return sorted(
        (s for s in registry["streams"] if s.get("status") == "active"),
        key=lambda s: s.get("order", 999),
    )


# --------------------------------------------------------------------------
# Workbook reading
# --------------------------------------------------------------------------

def resolve_source(candidates: Iterable[str]) -> Path:
    """Return the first candidate filename that exists in source_materials/.

    CLAUDE.md names the findings workbook `Phase2_Findings_OutlineClassified`
    but the delivered file is `Phase2_Findings`. Rather than hard-code either,
    adapters pass a candidate list.
    """
    tried = []
    for name in candidates:
        path = SOURCE_DIR / name
        tried.append(str(path))
        if path.exists():
            return path
    raise FileNotFoundError(
        "No source workbook found. Tried:\n  " + "\n  ".join(tried)
    )


def read_sheet(path: Path, sheet: str) -> list[dict]:
    """Read a sheet into dicts keyed by the header row, dropping blank rows."""
    import openpyxl

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    try:
        ws = wb[sheet]
        rows = list(ws.iter_rows(values_only=True))
    finally:
        wb.close()

    if not rows:
        return []
    header = [clean(h) for h in rows[0]]
    out = []
    for row in rows[1:]:
        if not any(c not in (None, "") for c in row):
            continue
        out.append({h: v for h, v in zip(header, row) if h})
    return out


class BuildReport:
    """Collects warnings so the build surfaces data problems instead of hiding them."""

    def __init__(self) -> None:
        self.warnings: list[str] = []
        self.notes: list[str] = []

    def warn(self, message: str) -> None:
        self.warnings.append(message)
        print(f"  ! {message}")

    def note(self, message: str) -> None:
        self.notes.append(message)
        print(f"  - {message}")
