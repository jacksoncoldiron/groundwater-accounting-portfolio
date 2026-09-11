"""Adapter: bibliographic identifiers and tool registry from the consolidation.

`ConsolidationofFindings_DesktopAnalysis (1).docx` is the literature-side
consolidation -- the document the coded findings are compared against to build
the literature/practice connection. Three things in it are already structured
by the analyst and are extracted mechanically here:

  1. the reference list, which carries a DOI for nearly every paper;
  2. the "Tools" list, which names community-facing tools with their URLs;
  3. the per-topic "Key Gaps" bullets, which state what the reviewed literature
     does and does not demonstrate.

SCOPE LIMIT. This adapter reads hyperlinks and list items only. It does NOT
parse the document's prose into findings -- that stays analyst-authored
narrative (notes/decisions.md D-01). Nothing here creates a finding, a
comparison, or a claim.

DOI matching is deliberately strict: a DOI is attached to a paper only when the
paper's own citation contains it, or when the normalized TITLE matches a
reference exactly. Several references share an author and year with a paper in
the workbook but are a different study; a looser rule would attach the wrong
link. Papers that cannot be matched confidently simply have no DOI.
"""

from __future__ import annotations

import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from common import BuildReport, clean, normalize_key, resolve_source

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL_NS = "{http://schemas.openxmlformats.org/package/2006/relationships}"

SOURCE_CANDIDATES = [
    "ConsolidationofFindings_DesktopAnalysis (1).docx",
    "ConsolidationofFindings_DesktopAnalysis.docx",
]

DOI_RE = re.compile(r"(10\.\d{4,9}/[^\s,;)\]]+)")

# Links to internal collaboration workspaces are not public and must never be
# published on the site.
PRIVATE_HOST_MARKERS = ("sharepoint.com", "onedrive", "docs.google.com/document/d/")


def _load(path: Path):
    z = zipfile.ZipFile(path)
    rels = ET.fromstring(z.read("word/_rels/document.xml.rels"))
    urls = {
        r.get("Id"): r.get("Target")
        for r in rels
        if "hyperlink" in (r.get("Type") or "")
    }
    root = ET.fromstring(z.read("word/document.xml"))
    return root, urls


def _text(node) -> str:
    return clean("".join(t.text or "" for t in node.iter(W + "t"))) or ""


def _para_link(para, urls) -> str | None:
    for h in para.iter(W + "hyperlink"):
        target = urls.get(h.get(R + "id"))
        if target:
            return target
    return None


def _style(para) -> str:
    el = para.find(f".//{W}pStyle")
    return el.get(W + "val") if el is not None else ""


def title_key(citation: str | None) -> str:
    """Normalized title, taken as the text after the year parenthetical.

    Same rule the literature adapter uses to identify a paper across sheets.
    Strict by design -- see the module docstring.
    """
    match = re.search(r"\((?:n\.d\.|\d{4}[a-z]?)\)\.?\s*(.+)", citation or "")
    tail = match.group(1) if match else (citation or "")
    title = re.split(r"(?<=[a-z])\.\s+[A-Z]", tail)[0]
    return normalize_key(title)[:80]


def ingest(report: BuildReport) -> dict:
    try:
        path = resolve_source(SOURCE_CANDIDATES)
    except FileNotFoundError:
        report.note("Consolidation document not present; skipping reference enrichment.")
        return {"references": [], "tools": [], "literature_gaps": {}}

    report.note(f"Consolidation source: {path.name}")
    root, urls = _load(path)
    paras = list(root.iter(W + "p"))

    # ---- reference list -------------------------------------------------
    refs: list[dict] = []
    try:
        start = next(i for i, p in enumerate(paras) if _text(p) == "References")
    except StopIteration:
        start = None
        report.warn("No 'References' heading found in the consolidation document.")

    if start is not None:
        for para in paras[start + 1:]:
            text = _text(para)
            if not text:
                continue
            link = _para_link(para, urls)
            doi = None
            if link and "doi.org" in link:
                doi = link
            else:
                m = DOI_RE.search(text)
                if m:
                    doi = f"https://doi.org/{m.group(1)}"
            refs.append({"citation": text, "doi": doi, "title_key": title_key(text)})
        report.note(
            f"Reference list: {len(refs)} entries, {sum(1 for r in refs if r['doi'])} with a DOI"
        )

    # ---- tools registry --------------------------------------------------
    # The "Tools" list is the set of community-facing tools the analysis
    # checked the document sets against. Each list item carries its URL.
    tools: list[dict] = []
    in_tools = False
    for para in paras:
        text = _text(para)
        style = _style(para)
        if style.startswith("Heading"):
            in_tools = text.strip().lower() == "tools"
            continue
        if not in_tools or not text:
            continue
        link = _para_link(para, urls)
        if link and not any(m in link for m in PRIVATE_HOST_MARKERS):
            tools.append({"name": text, "url": link})
    if tools:
        report.note(f"Tool registry: {len(tools)} community-facing tools with URLs")

    # ---- per-topic literature gaps --------------------------------------
    # Bullets under a "Key Gaps" heading, keyed by the topic heading above it.
    # These are the analyst's statements of what the LITERATURE does not
    # demonstrate -- the literature axis of the Literature -> Practice matrix.
    gaps: dict[str, list[str]] = {}
    current_topic = None
    collecting = False
    for para in paras:
        text = _text(para)
        style = _style(para)
        if style.startswith("Heading"):
            if text.strip().lower() == "key gaps":
                collecting = True
            else:
                collecting = False
                if text.strip():
                    current_topic = text.strip()
            continue
        if collecting and text and current_topic:
            gaps.setdefault(current_topic, []).append(text)
    if gaps:
        report.note(
            f"Literature gaps: {sum(len(v) for v in gaps.values())} statements "
            f"across {len(gaps)} topics"
        )

    return {"references": refs, "tools": tools, "literature_gaps": gaps}


def attach_dois(literature: list[dict], references: list[dict], report: BuildReport) -> None:
    """Attach a DOI to each literature record, recording where it came from.

    Priority: the paper's own citation first (unambiguous), then a strict
    title match against the consolidation reference list. Never a fuzzy match.
    """
    by_title = {r["title_key"]: r for r in references if r["doi"] and r["title_key"]}
    from_citation = from_reference = 0

    for record in literature:
        citation = record.get("citation") or ""
        match = DOI_RE.search(citation)
        if match:
            record["doi"] = f"https://doi.org/{match.group(1).rstrip('.')}"
            record["doi_source"] = "citation"
            from_citation += 1
            continue
        ref = by_title.get(title_key(citation))
        if ref:
            record["doi"] = ref["doi"]
            record["doi_source"] = "reference_list"
            from_reference += 1
            continue
        record["doi"] = None
        record["doi_source"] = None

    unmatched = sum(1 for r in literature if not r.get("doi"))
    report.note(
        f"DOIs attached: {from_citation} from the paper's own citation, "
        f"{from_reference} matched to the consolidation reference list, "
        f"{unmatched} with no confident match (left without a link)"
    )
