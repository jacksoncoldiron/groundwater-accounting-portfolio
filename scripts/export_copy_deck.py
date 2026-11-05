#!/usr/bin/env python3
"""Export every piece of visible site copy to an editable Word copy deck.

    quarto render                      # the deck reads the built pages
    python3 scripts/export_copy_deck.py

Writes COPY_DECK.docx at the repo root. Requires python-docx, beautifulsoup4
and pyyaml (`pip install python-docx beautifulsoup4 pyyaml`).

What it covers
  * Site-wide text from _quarto.yml (site name, navigation, footer).
  * Every page's visible copy, read from the rendered _site/*.html in page
    order: headings, eyebrows, paragraphs, list items, captions, buttons,
    card text, diagram labels, image alt text and screen-reader summaries.
  * Copy the browser fills in from config at runtime: key findings
    (config/key_gaps.yml) and map profiles (config/basin_profiles.yml).
  * Interface labels rendered by the explorers' JavaScript.

What it leaves out, on purpose
  * Findings, quotations, the cross-basin comparison and the MLRP matrix cell
    text. Those come from the source workbooks and synthesis report and are
    edited there, not here.

Numbers and basin names filled automatically from the data (_variables.yml)
are highlighted in the deck so they are not edited by hand.
"""

from __future__ import annotations

import datetime as dt
import re
import sys
from pathlib import Path

import yaml
from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from docx import Document
from docx.enum.text import WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Inches

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
OUT = ROOT / "COPY_DECK.docx"

PAGES = [
    ("index", "Overview", "OV"),
    ("isw", "Interconnected Surface Water", "ISW"),
    ("mlrp", "Land Repurposing", "MLRP"),
    ("community", "Community", "COM"),
    ("map", "Map", "MAP"),
    ("findings", "Explore Findings", "FIND"),
    ("methods", "Methods & Evidence", "METH"),
]

# Elements whose whole text is one copy entry.
TEXT_BLOCKS = {
    "h1": "Heading 1", "h2": "Heading 2", "h3": "Heading 3", "h4": "Heading 4",
    "h5": "Heading 5", "p": "Paragraph", "li": "List item", "figcaption": "Caption",
    "blockquote": "Quote", "summary": "Expandable label", "legend": "Label",
    "label": "Label", "button": "Button", "dt": "Term", "dd": "Definition",
    "th": "Table header", "td": "Table cell", "caption": "Table caption",
}
INLINE = {"span", "strong", "em", "b", "i", "a", "code", "small", "abbr", "mark", "sup", "sub"}
SKIP = {"script", "style", "noscript", "template", "select", "input", "textarea", "iframe", "title"}
SKIP_CLASSES = {"gw-loading", "skip-link", "leaflet-container"}

# Auto-filled values (from _variables.yml) worth flagging. Single digits and
# common words are skipped so ordinary copy is not mis-highlighted.
AUTO_KEYS = [
    "findings_total", "documents_total", "literature_total", "quotes_verified",
    "absence_findings", "positive_findings", "ambiguous_findings", "isw_findings",
    "mlrp_findings", "community_findings", "basin_list", "active_basins_word",
    "active_basins_word_cap", "literature_with_doi", "tools_checked_word",
]


def kind_of(tag: Tag) -> str:
    cls = set(tag.get("class") or [])
    if "gw-eyebrow" in cls:
        return "Eyebrow"
    if cls & {"gw-hero__lede", "gw-section-lede", "gw-lede"}:
        return "Lede"
    if "gw-caption" in cls or "chapter-photo__credit" in cls:
        return "Caption"
    if cls & {"gw-sr-summary", "gw-visually-hidden"}:
        return "Screen-reader text"
    if "gw-btn" in cls:
        return "Button"
    if "gw-rq" in cls:
        return "Research question"
    if "gw-hero__sub" in cls:
        return "Subtitle"
    if "gw-metric" in cls:
        return "Statistic card"
    if tag.name == "a":
        return "Link"
    return TEXT_BLOCKS.get(tag.name, "Text")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\xa0", " ")).strip()


def skipped(tag: Tag) -> bool:
    if tag.name in SKIP:
        return True
    if tag.get("id") in {"title-block-header", "quarto-margin-sidebar", "quarto-sidebar"}:
        return True
    cls = set(tag.get("class") or [])
    return bool(cls & SKIP_CLASSES) or tag.get("aria-hidden") == "true" and tag.name != "svg"


def extract(node: Tag, out: list, section: list):
    """Walk the page in order, appending (section, kind, text) entries."""
    for child in node.children:
        if isinstance(child, Comment):
            continue
        if isinstance(child, NavigableString):
            t = clean(str(child))
            if t and node.name not in INLINE and len(t) > 1:
                out.append((section[0], "Text", t))
            continue
        if not isinstance(child, Tag) or skipped(child):
            continue
        name = child.name
        cls = set(child.get("class") or [])

        # Section boundaries: eyebrows, page h2s, Methods tab panels, hero.
        if "gw-tabpanel" in cls:
            tab = child.get("aria-labelledby")
            doc_root = child.find_parent("html") or node
            label = doc_root.find(id=tab) if tab else None
            section[0] = clean(label.get_text()) if label else child.get("id", "Panel")
        elif "gw-hero" in cls:
            section[0] = "Hero"

        if name == "img":
            if child.get("alt"):
                out.append((section[0], "Image alt text", clean(child["alt"])))
            continue
        if name == "svg":
            labels = [clean(t.get_text()) for t in child.find_all("text") if clean(t.get_text())]
            if labels:
                out.append((section[0], "Diagram labels", " · ".join(labels)))
            continue
        if child.get("data-detail"):
            out.append((section[0], "Card detail",
                        f"{child.get('data-label', '')}: {clean(child['data-detail'])}"))
        if name in TEXT_BLOCKS or "gw-btn" in cls:
            text = clean(child.get_text(" "))
            if not text:
                continue
            kind = kind_of(child)
            if kind == "Eyebrow" or (name == "h2" and section[0] != "Hero"):
                section[0] = text.title() if text.isupper() else text
            if name == "h1" and "gw-visually-hidden" in cls:
                kind = "Screen-reader text"
            out.append((section[0], kind, text))
            continue
        if name in INLINE and node.name not in INLINE and not child.find(list(TEXT_BLOCKS)):
            text = clean(child.get_text(" "))
            if text:
                out.append((section[0], "Card text" if name != "a" else "Link", text))
            continue
        extract(child, out, section)


def page_entries(slug: str):
    soup = BeautifulSoup((SITE / f"{slug}.html").read_text(), "html.parser")
    root = soup.find(id="quarto-content")
    out, section = [], ["Page opening"]
    # The Overview hero sits outside <main>; both live in #quarto-content.
    extract(root, out, section)
    # Collapse exact repeats within a section (e.g. responsive duplicates).
    seen, uniq = set(), []
    for e in out:
        if e in seen:
            continue
        seen.add(e)
        uniq.append(e)
    return soup, uniq


# --------------------------------------------------------------------------- docx helpers

INK = RGBColor(0x3A, 0x36, 0x28)
MUTED = RGBColor(0x77, 0x74, 0x6A)
SLATE = RGBColor(0x55, 0x64, 0x72)


def set_styles(doc: Document):
    st = doc.styles
    st["Normal"].font.name = "Calibri"
    st["Normal"].font.size = Pt(11)
    st["Normal"].font.color.rgb = INK
    st["Normal"].paragraph_format.space_after = Pt(4)
    for name, size, color, before, after in [
        ("Title", 26, INK, 0, 6), ("Heading 1", 20, INK, 18, 6),
        ("Heading 2", 14, SLATE, 14, 4), ("Heading 3", 11.5, INK, 10, 2),
    ]:
        s = st[name]
        s.font.name = "Georgia"
        s.font.size = Pt(size)
        s.font.color.rgb = color
        s.font.bold = name != "Title"
        s.paragraph_format.space_before = Pt(before)
        s.paragraph_format.space_after = Pt(after)
        s.paragraph_format.keep_with_next = True
        rpr = s.element.get_or_add_rPr()
        fonts = rpr.find(qn("w:rFonts"))
        if fonts is None:
            fonts = OxmlElement("w:rFonts")
            rpr.append(fonts)
        for a in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
            fonts.set(qn(a), "Georgia")


def add_toc(doc: Document):
    p = doc.add_paragraph()
    run = p.add_run()
    for kind, text in (("begin", None), (None, 'TOC \\o "1-2" \\h \\z \\u'), ("separate", None)):
        if kind:
            el = OxmlElement("w:fldChar")
            el.set(qn("w:fldCharType"), kind)
            run._r.append(el)
        else:
            instr = OxmlElement("w:instrText")
            instr.set(qn("xml:space"), "preserve")
            instr.text = text
            run._r.append(instr)
    hint = p.add_run("Right-click here and choose Update Field to build the table of contents. "
                     "You can also open View › Navigation Pane to jump between pages and sections.")
    hint.italic = True
    hint.font.color.rgb = MUTED
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    p.add_run()._r.append(end)


def entry_label(doc, eid: str, kind: str, source: str | None = None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(f"{eid}  ·  {kind}" + (f"  ·  {source}" if source else ""))
    r.font.size = Pt(8.5)
    r.font.color.rgb = MUTED
    r.font.bold = True


def copy_para(doc, text: str, auto: list[str]):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.15)
    if not auto:
        p.add_run(text)
        return
    pattern = "|".join(re.escape(a) for a in sorted(auto, key=len, reverse=True))
    pos = 0
    for m in re.finditer(rf"(?<![\w-])({pattern})(?![\w-])", text):
        if m.start() > pos:
            p.add_run(text[pos:m.start()])
        r = p.add_run(m.group(0))
        r.font.highlight_color = WD_COLOR_INDEX.YELLOW
        pos = m.end()
    if pos < len(text):
        p.add_run(text[pos:])


def note(doc, text: str):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.italic = True
    r.font.size = Pt(9.5)
    r.font.color.rgb = MUTED


# --------------------------------------------------------------------------- main

def main() -> int:
    if not (SITE / "index.html").exists():
        print("Run `quarto render` first: the deck reads the built pages in _site/.")
        return 1
    variables = yaml.safe_load((ROOT / "_variables.yml").read_text())
    auto = sorted({str(variables[k]) for k in AUTO_KEYS if variables.get(k) and len(str(variables[k])) > 1})
    quarto = yaml.safe_load((ROOT / "_quarto.yml").read_text())
    gaps = yaml.safe_load((ROOT / "config/key_gaps.yml").read_text())
    profiles = yaml.safe_load((ROOT / "config/basin_profiles.yml").read_text())
    basins = {b["id"]: b for b in yaml.safe_load((ROOT / "config/basins.yml").read_text())["basins"]}

    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Inches(8.5), Inches(11)
    for side in ("left_margin", "right_margin"):
        setattr(sec, side, Inches(1))
    set_styles(doc)

    doc.add_paragraph("Copy Deck: Accounting for Groundwater", style="Title")
    note(doc, f"Generated {dt.date.today().isoformat()} from the built site by scripts/export_copy_deck.py.")

    doc.add_heading("How to use this document", 1)
    for line in [
        "Each page of the site is a Heading 1. Each section of a page is a Heading 2. Use the Navigation Pane (View › Navigation Pane) to jump around.",
        "Every piece of copy has a small grey label above it with an ID and a type, such as “OV-004 · Lede”. Keep the label. Edit the text below it.",
        "Yellow-highlighted numbers and names are filled in automatically from the data. Leave them as they are. If one looks wrong, flag it with a comment.",
        "To move, delete, split or add something, write the instruction in ALL CAPS under the entry, or add a Word comment. Label new copy NEW.",
        "Tracked changes (Review › Track Changes) are the easiest way to show what you edited.",
        "Findings, direct quotations, the cross-basin comparison and the MLRP matrix cells are not in this deck. They come from the source workbooks and synthesis report, so edit them there.",
    ]:
        doc.add_paragraph(line, style="List Bullet")

    doc.add_heading("Contents", 1)
    add_toc(doc)

    # ---- Site-wide
    doc.add_page_break()
    doc.add_heading("Site-wide", 1)
    doc.add_heading("Site name and navigation", 2)
    site = quarto["website"]
    n = 0
    def emit(prefix, kind, text, source=None):
        nonlocal n
        n += 1
        entry_label(doc, f"{prefix}-{n:03d}", kind, source)
        copy_para(doc, text, auto)
    emit("SITE", "Site name", clean(site["navbar"]["title"].replace("&nbsp;", " ")), "_quarto.yml")
    emit("SITE", "Site description", clean(site["description"]), "_quarto.yml")
    for item in site["navbar"]["left"]:
        emit("SITE", "Navigation link", item["text"], "_quarto.yml")
    doc.add_heading("Footer", 2)
    emit("SITE", "Footer text", clean(site["page-footer"]["left"]), "_quarto.yml")

    # ---- Pages
    for slug, title, prefix in PAGES:
        soup, entries = page_entries(slug)
        doc.add_page_break()
        doc.add_heading(f"{title} page", 1)
        note(doc, f"Source file: {slug}.qmd")
        n = 0
        emit(prefix, "Browser tab title", clean(soup.title.get_text()) if soup.title else "")
        desc = soup.find("meta", attrs={"name": "description"})
        if desc and desc.get("content"):
            emit(prefix, "Search description", clean(desc["content"]))
        chapter = slug if slug in ("isw", "mlrp", "community") else None

        def emit_gaps():
            doc.add_heading("Key findings (filled in from config)", 3)
            note(doc, "Source file: config/key_gaps.yml. The titles also appear as a list on the Overview.")
            for g in gaps["chapters"].get(chapter, []):
                emit(prefix, "Key finding title", clean(g["title"]), f"key_gaps.yml · {g['id']}")
                emit(prefix, "Key finding body", clean(g["body"]), f"key_gaps.yml · {g['id']}")

        current, gaps_done = None, False
        for section, kind, text in entries:
            if section != current:
                if chapter and current == "Key findings" and not gaps_done:
                    emit_gaps(); gaps_done = True
                doc.add_heading(section, 2)
                current = section
            emit(prefix, kind, text)
        if chapter and not gaps_done:
            emit_gaps()

    # ---- Map profiles
    doc.add_page_break()
    doc.add_heading("Map subbasin profiles", 1)
    note(doc, "Source file: config/basin_profiles.yml. Shown in the side panel when a subbasin is selected on the map.")
    n = 0
    labels = {"grantee_note": "Grant note", "setting": "Setting", "climate": "Climate",
              "agriculture": "Agriculture & land use", "communities": "Communities"}
    for bid, prof in (profiles.get("basins") or {}).items():
        doc.add_heading(basins.get(bid, {}).get("name", bid), 2)
        if prof.get("grantee_note"):
            emit("PROF", "Grant note", clean(prof["grantee_note"]), bid)
        for ind in prof.get("indicators") or []:
            emit("PROF", "Indicator", f"{ind['name']}: {clean(ind['why'])}", bid)
        for key in ("setting", "climate", "agriculture", "communities"):
            for item in prof.get(key) or []:
                emit("PROF", labels[key], clean(item["text"]), bid)

    # ---- Interface labels rendered by JavaScript
    doc.add_page_break()
    doc.add_heading("Interface labels", 1)
    note(doc, "These labels are written in the site's JavaScript files. Edit them here and they will be routed to the right file.")
    n = 0
    ui = [
        ("Findings explorer", "assets/js/findings.js", [
            "Filter", "Reset", "Search findings", "e.g. depletion, appeal, OpenET, F-165…",
            "Chapter", "Subbasin", "Finding type", "Section", "All sections", "More filters",
            "GSA or scope", "Source document", "Quote verification", "Relevance to GAP",
            "Relevance to DWR recommendations", "Interconnected Surface Water", "Land Repurposing",
            "Community Considerations", "Positive finding", "Not found in reviewed documents",
            "Ambiguous", "Quote verified", "Quote not verified", "No quotation to verify",
            "Evidence and source detail", "Full finding", "Direct quote and source location",
            "Coding location", "Analyst note", "Literature-review question or gap addressed",
            "Related findings", "No matches",
        ]),
        ("Meeting findings explorer (WaterOne)", "assets/js/meetings.js", [
            "Search meeting findings", "e.g. allocation, dry well, OpenET…", "Subbasin group",
            "Case-study subbasins", "Other subbasins", "Outside case studies", "Discussion stage",
            "DWR category", "Relation to desktop findings", "GSA or entity", "Excerpt type",
            "Confidence", "Not found in reviewed meetings", "Evidence and meeting detail",
            "Quantitative detail", "Agenda item", "Speaker role", "Also discussed on",
            "Meeting recap on WaterOne ↗", "Meeting date (newest)",
            "No records match this combination of filters. Try removing a filter or broadening the search.",
        ]),
        ("MLRP co-benefits matrix", "assets/js/mlrp-matrix.js", [
            "Select any cell to see how that benefit is quantified and the evidence behind the rating.",
            "How it is quantified, in detail",
        ]),
        ("Map", "assets/js/study-map.js", [
            "Select a subbasin",
            "Choose a subbasin on the map or below to see its agencies, setting, and the sustainability indicators most prominent in the record.",
            "MLRP block grant", "No MLRP block grant", "Same grant region, not analysed",
            "River", "Tributary", "GSAs in this analysis", "Sustainability indicators in focus",
            "← All subbasins",
        ]),
    ]
    for group, src, items in ui:
        doc.add_heading(group, 2)
        for t in items:
            emit("UI", "Label", t, src)

    doc.save(OUT)
    print(f"  > {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
