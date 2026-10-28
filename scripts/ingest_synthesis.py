"""Adapter: the analyst's cross-basin synthesis (Phase2_CrossBasin_Synthesis.docx).

The synthesis is the most carefully cited, analyst-edited account of what each
basin's documents say. Every topic follows the same shape:

    ## 1.3. Topic title
    ***Literature.*** what the reviewed papers say
    **Merced.** that basin's paragraph (with document citations)
    **East Turlock.** ...
    **Comparison.** the cross-basin read
    ***Gaps.*** the gap the topic surfaces (optional)

This adapter turns that into data/processed/synthesis.json so the chapter pages
can render a topic-by-topic, basin-by-basin comparison without anyone copying
prose into page code. Text is preserved as written (whitespace only); basin
paragraphs are matched to config/basins.yml by short name, so a new basin's
paragraphs appear as soon as the synthesis includes them.

Requires `pandoc` on the PATH (used only to read the .docx).
"""

from __future__ import annotations

import re
import shutil
import subprocess

from common import BuildReport, active_basins, resolve_source

SOURCE_CANDIDATES = ["Phase2_CrossBasin_Synthesis.docx"]

CHAPTER_KEYS = {"1": "isw", "2": "mlrp", "3": "community"}

HEADING = re.compile(r"^(#{1,3})\s+(.*)$")
NUMBERED = re.compile(r"^(\d+(?:\.\d+)*)\.?\s+(.*)$")
# A paragraph that opens with a bold (or bold-italic) label: **Merced.** text
LABELLED = re.compile(r"^\*{2,3}([^*]+?)\*{2,3}\s*(.*)$", re.S)


def _unescape(text: str) -> str:
    # pandoc escapes markdown-significant punctuation (\[, \., \&, ...).
    text = re.sub(r"\\([^\w\s])", r"\1", text)
    text = text.replace("\\\n", " ")
    return re.sub(r"\s+", " ", text).strip()


def _strip_emphasis(text: str) -> str:
    return re.sub(r"\*{1,3}([^*]+)\*{1,3}", r"\1", text)


def _read_markdown(path) -> str:
    if not shutil.which("pandoc"):
        raise RuntimeError("pandoc is required to read the synthesis .docx")
    out = subprocess.run(
        ["pandoc", str(path), "-t", "gfm", "--wrap=none"],
        check=True, capture_output=True, text=True,
    )
    return out.stdout


def _match_basin(label: str, basins: list[dict]) -> dict | None:
    # Labels look like "Merced.", "East Turlock.", "Merced Model: MercedWRM."
    norm = label.lower()
    for b in sorted(basins, key=lambda b: -len(b["short_name"])):
        if norm.startswith(b["short_name"].lower()):
            return b
    return None


def ingest(report: BuildReport, basin_registry: dict) -> dict:
    path = resolve_source(SOURCE_CANDIDATES)
    report.note(f"Synthesis source: {path.name}")
    basins = active_basins(basin_registry)
    md = _read_markdown(path)

    chapters: list[dict] = []
    chapter = None
    section = None

    def flush_section():
        nonlocal section
        if section and chapter is not None and (section["basins"] or section["comparison"]):
            chapter["sections"].append(section)
        section = None

    for block in re.split(r"\n\s*\n", md):
        block = block.strip()
        if not block:
            continue
        h = HEADING.match(block)
        if h:
            level, raw = len(h.group(1)), _unescape(_strip_emphasis(h.group(2)))
            num = NUMBERED.match(raw)
            if not num:
                continue
            number, title = num.group(1), num.group(2).strip()
            if level == 1:
                flush_section()
                key = CHAPTER_KEYS.get(number)
                if not key:
                    continue
                title = re.sub(r"^[A-Z]+\s+[—-]\s+", "", title)
                chapter = {"id": key, "number": number, "title": title,
                           "scope_note": None, "sections": [], "closing_note": None}
                chapters.append(chapter)
            else:
                flush_section()
                section = {"id": number, "title": title, "literature": None,
                           "basins": {}, "comparison": None, "gaps": None}
            continue

        if chapter is None:
            continue
        m = LABELLED.match(block)
        if not m:
            # Unlabelled paragraphs: definitions at the top of a chapter, or a
            # closing caveat ("Gaps Identified") section with no basin labels.
            if section and section["title"].lower().startswith("gaps identified"):
                section["caveat"] = (section.get("caveat") or "") + _unescape(block) + " "
            continue
        label = _unescape(m.group(1)).rstrip(".").strip()
        body = _unescape(m.group(2))
        lower = label.lower()

        if lower == "scope note":
            chapter["scope_note"] = body
        elif section is None:
            continue
        elif lower == "literature":
            section["literature"] = body
        elif lower == "comparison":
            section["comparison"] = body
        elif lower == "gaps":
            section["gaps"] = body
        else:
            basin = _match_basin(label, basins)
            if basin:
                # Keep a sub-label ("Model: MercedWRM") where the synthesis
                # used one, separately from the paragraph.
                rest = label[len(basin["short_name"]):].strip(" :.")
                section["basins"][basin["id"]] = {
                    "label": rest or None,
                    "text": body,
                }
    flush_section()

    # The trailing "Gaps Identified" section in a chapter is a caveat on
    # document-set completeness, not a topic.
    for ch in chapters:
        keep = []
        for s in ch["sections"]:
            if s["title"].lower().startswith("gaps identified"):
                ch["closing_note"] = (s.get("caveat") or "").strip() or None
                continue
            keep.append(s)
        ch["sections"] = keep

    # Catch caveat-only sections that had no labelled paragraphs.
    _attach_closing_notes(md, chapters)

    n_sections = sum(len(c["sections"]) for c in chapters)
    coverage = {b["id"]: sum(1 for c in chapters for s in c["sections"] if b["id"] in s["basins"])
                for b in basins}
    report.note(f"Synthesis: {len(chapters)} chapters, {n_sections} topics; "
                f"basin paragraphs per basin: {coverage}")
    missing = [b["short_name"] for b in basins if coverage[b["id"]] == 0]
    if missing:
        report.warn(f"Active basin(s) with no synthesis paragraphs: {', '.join(missing)}")

    section_titles = {s["id"]: s["title"] for c in chapters for s in c["sections"]}
    return {"chapters": chapters, "section_titles": section_titles}


def _attach_closing_notes(md: str, chapters: list[dict]) -> None:
    """Read the body text under each chapter's 'Gaps Identified' heading."""
    for ch in chapters:
        if ch["closing_note"]:
            continue
        pat = re.compile(
            rf"^##\s+{re.escape(ch['number'])}\.\d+\.?\s+Gaps Identified\s*\n(.*?)(?=^#\s|\Z)",
            re.M | re.S,
        )
        m = pat.search(md)
        if m:
            text = _unescape(m.group(1))
            ch["closing_note"] = text or None
