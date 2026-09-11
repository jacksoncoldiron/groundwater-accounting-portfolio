# Source Inventory

Verified 2026-08-31 by direct inspection. **No source file was modified.** All
files live in `source_materials/` and are read-only inputs to the pipeline.

---

## 1. `Phase2_CrossBasin_Synthesis.docx`

**Role:** primary analyst-authored narrative. The evidentiary basis for every
cross-basin claim on the site.

**Author / date (from the document):** Jackson Coldiron, 20 August 2026.
Titled *DWR Landscape Analysis: Desktop Analysis — Cross-Basin Synthesis*.

**Structure:** three chapters mirroring the findings workbook.

| Chapter | Sections |
|---|---|
| 1. ISW — Interconnected Surface Water | 1.1 Model Type and Sophistication · 1.2 Undesirable Result Threshold · 1.3 Pumping-attributable Depletion Figure · 1.4 Measurement Methods · 1.5 Per-well Attribution and the Cumulative Pumping Problem · 1.6 Aquifer Depths · 1.7 Limitations in Scope, Monitoring, Funding · 1.8 Gaps and Uncertainty |
| 2. MLRP — Multi-benefit Land Repurposing | 2.1 Financing · 2.2 Verification Triggers · 2.3 Allocation and Leakage · 2.4 Water Savings · 2.5 Data Source and ET Product Choice · 2.6 Benefits Beyond Water Savings · 2.7 Monitoring Protocol · 2.8 Post-MLRP Funding · 2.9 Dust · 2.10 Other Repurposing Programs · 2.11 Gaps Identified |
| 3. Community Considerations | 3.1 Community Equity (3.1.1 SAC · 3.1.2 Meaningful Benefits · 3.1.3 Procedural/Distributional/Representative · 3.1.4 Domestic Well Protection) · 3.2 Community Engagement · 3.3 Community Data Needs and Translation (3.3.1 Dry Well Mitigation · 3.3.2 Water Quality · 3.3.3 Domestic Wells / Consolidation · 3.3.4 Data and Decision-Support Integration) · 3.4 Gaps Identified |

**Internal paragraph convention** — every section uses labelled paragraphs:
`Literature.` → `Merced.` → `East Turlock.` → `Salinas Valley.` →
`Comparison.` → (optionally) `Gaps.`

This is the structure `CLAUDE.md` §4 says the website must *not* reproduce
linearly. The `Comparison.` and `Gaps.` paragraphs are the analyst's own
cross-basin conclusions and are the correct source for site headlines.

**Critical content — the document-set completeness caveats.** Two paragraphs
(§2.11 and §3.4) explicitly warn that the three document sets are not equally
complete and that several Salinas Valley absences are *document-availability
gaps rather than demonstrated absences*, while several East Turlock absences
reflect *architecture that has not yet produced results*. These caveats must
survive onto the public site verbatim in substance (see
`notes/decisions.md` D-07).

**Site usage:** narrative chapter pages, verified headline claims, basin
profile metadata in `config/basins.yml`. Not machine-ingested — the pipeline
does not parse the .docx.

---

## 2. `Phase2_Findings.xlsx`

> Note: `CLAUDE.md` refers to this as `Phase2_Findings_OutlineClassified.xlsx`.
> The file delivered is named `Phase2_Findings.xlsx`. The `Findings` sheet
> schema matches the brief exactly. Filename resolution is handled by a
> candidate list in `scripts/ingest_findings.py`.

**Role:** the primary structured evidence database. Machine-ingested.

### Sheet `Findings` — 325 coded findings + 1 header row (confirmed)

Columns match `CLAUDE.md` §2 exactly:
`Row ID`, `Subbasin`, `GSA`, `Document`, `Chapter`, `Section`, `Subsection`,
`Finding Type`, `Finding`, `Direct Quote`, `Relevance to GAP`,
`Relevance to DWR Recommendations`, `Quote Verified`, `Related Finding`,
`Notes`, `Lit Review Question/Gap Addressed`.

`Row ID` is an integer, populated on all 325 rows, with **no duplicates**. Used
as the stable primary identifier.

**Distributions (all 325 rows):**

- **Subbasin** — East Turlock 127 · Salinas Valley 111 · Merced 87.
  Only these three values appear. No Colusa or Yolo rows exist yet.
- **Chapter** — 3. Community Considerations 115 · 2. MLRP 108 · 1. ISW 102.
- **Finding Type** — Positive Finding 200 · Absence Finding 103 · Ambiguous 22.
- **GSA** — SUBBASIN 163 · ETSGSA 69 · MSGSA 40 · SVBGSA 28 · MIUGSA 9 ·
  NON-GSA 9 · COMMENTER 5 · WTSGSA 1 · MCWD GSA 1.
  Note `SUBBASIN`, `NON-GSA`, and `COMMENTER` are **scope markers, not
  agencies**; they are labelled as such via `gsa_labels` in `config/basins.yml`.
- **Relevance to GAP** — H 179 · M 131 · L 15.
- **Relevance to DWR Recommendations** — H 260 · M 64 · L 1.
- **Quote Verified** — Y 221 · N 15 · blank 89. Per the Legend, blank is the
  documented `N/A` state for Absence Findings, *not* an unverified quote.
- **Document** — 33 distinct titles.
- **Section** — 34 distinct values. **Subsection** — 68 distinct values.
- `Direct Quote` populated on **all 325** rows. `Notes` on 318.
  `Lit Review Question/Gap Addressed` on 141. `Related Finding` on 238.

**`Subsection` is the cross-basin comparison key.** The Legend describes it as
"the actual grouping key for comparison across basins," and the data bear this
out: it holds the analytical *question* the finding answers. **46 of 68
subsections are answered by two or more basins; 27 are answered by all three.**
This is the source-grounded backbone of every comparison matrix on the site —
no scoring or judgment needs to be invented (see `notes/decisions.md` D-04).

### Sheet `Legend` — column dictionary + document registry

Two independent blocks:

1. **Column dictionary** (cols B–C) defining each `Findings` field. Two entries
   describe columns — `Human Review Needed`, `Review Reason` — that are **not
   present** in the delivered `Findings` sheet. Handled as optional.
2. **Document registry** (cols F–I): `Subbasin` · `Type of Document` ·
   `Document Name` · `Link`. 29 documents with a document-type taxonomy and,
   for 12 of them, a public URL.

This registry is ingested and joined to findings to supply `source_type` and
`source_url` — the only legitimate source of document URLs on the site.
**Two entries carry links that appear misaligned; see `notes/decisions.md`
D-05 and the open question flagged in `notes/narrative_review.md`.**

Document names differ slightly between the two sheets (e.g. Legend
"Merced Subbasin GSP (2025 resubmittal)" vs. Findings "Merced GSP 2025"), so
the join is normalized + alias-mapped and every unmatched title is reported by
the build.

---

## 3. `Literature_Review_DesktopAnalysis_Results.xlsx`

**Role:** the academic-literature evidence stream. Machine-ingested.

**Three topical sheets with three genuinely different schemas** — they must not
be concatenated naively.

| Sheet | Rows | Distinct columns |
|---|---|---|
| `Groundwater Accounting` | 7 | Paper · Citation · Geographic Scope · Analysis Method · Accounting Method(s) Covered · Comparative Finding · Basin/Study Area Context · Major Takeaway · Relevance |
| `Land Use Alternatives` | 35 | Paper · Full Citation · Primary Topic · Secondary Topic(s) · Geography · Accounting Method Described · Data Sources Used · Formal Crediting / Program · Key Finding Relevant to GAP · Direct Quote(s) · Accounting Gap Identified · Relevance to GAP (H/M/L) · Notes / Flags |
| `Community Considerations` | 17 | Paper · Citation · Community Engagement Type · Geography · Summary of Analysis / Methods · Community Selection · Direct Quote(s) · Key Finding Relevant to GAP · Learnings · Applicability to GAP · Notes / Flags |

**59 rows total.** `Anderson et al. (2018)` appears on both
`Groundwater Accounting` and `Land Use Alternatives` — a genuine cross-sheet
duplicate. It is merged into one record that retains **both** topical
associations, per `CLAUDE.md` §2. Public count is computed at build time; do
not hard-code it.

Structural notes carried into the normalized schema:

- `Groundwater Accounting` has **no** direct-quote, topic, or accounting-gap
  column. Those normalize to null, not to empty strings, and the explorer
  renders them as "not recorded for this sheet" rather than as an absence.
- `Land Use Alternatives` has an 8-cluster `Primary Topic` taxonomy
  (1. Recharge · 2. Cover Cropping · 3. Demand Management · 4. MLRP · 5. ISW ·
  6. Floodplain Connection & Flood Control · 7. Ecological Co-benefits ·
  8. DAC Co-benefits) plus free-text `Secondary Topic(s)`.
- `Community Considerations` encodes topic as a compound
  `Community Engagement Type` string of the form
  `X (primary); Y (secondary)`. This is parsed into primary/secondary while
  preserving the original string.
- Relevance is spelled `HIGH`/`MEDIUM`/`LOW` here but `H`/`M`/`L` in the
  findings workbook. Normalized to a shared vocabulary; originals preserved.

**Sheet `Metadata`** — a per-sheet field dictionary. Not ingested as evidence;
used to write accurate field help text in the Literature Explorer.

---

## 4. `449 Final Presentation.pdf`

**Role:** aesthetic reference only. **Not ingested. No graphics extracted.**

Per `CLAUDE.md` §8, illustrations by Sara Soroka may be reused *with
permission* and with the specified credit. No illustration has been supplied
as a separate authorized asset yet, so `assets/illustrations/` is empty and
every diagram on the site is an original web-native SVG/HTML graphic. Credit
scaffolding exists on the Methods page and will be populated when assets
arrive.

---

## 5. `ConsolidationofFindings_DesktopAnalysis (1).docx`

**Role, confirmed by the analyst:** the literature-side consolidation. This is
the document the coded findings are compared *against* to build the
literature ↔ policy-and-planning connection. It is therefore the literature
axis of the Literature → Practice matrix, and a narrative source.

Titled *Consolidation of Findings — Literature Review | Desktop Analysis*,
prepared by Jackson Coldiron.

**Structure:** Groundwater Accounting Overview (policy/regulation, existing
frameworks) · Land Use Alternatives (MLRP, ecological co-benefits, DAC
co-benefits) · ISW · Community Considerations (equity, engagement, data needs,
tools, key questions) · Archived Chapters (recharge, cover cropping, demand
management, floodplain connection) · Appendix · References.

Nearly every topical section ends in a **`Key Gaps`** heading with bulleted
statements of what the reviewed *literature* does and does not demonstrate.
These are the analyst's own conclusions and are the correct source for the
literature side of any literature-vs-practice comparison.

### What is ingested (mechanically, by `scripts/ingest_references.py`)

Three already-structured elements. **Prose is not parsed into findings** — that
remains analyst-authored narrative (`notes/decisions.md` D-01).

1. **The reference list — 46 entries, every one carrying a DOI.** This is the
   only source of persistent links for the literature. Matching to the 58
   literature records is strict: a DOI is attached only when the paper's own
   citation contains it (27 papers) or when the normalized *title* matches a
   reference exactly (23 more). **50 of 58** papers get a DOI; the remaining 8
   are left without one. See `notes/decisions.md` D-15 — several references
   share an author and year with a workbook paper but are a different study.

2. **The Tools list — 9 community-facing tools with public URLs.** These are
   the tools the analysis checked each subbasin's document set against, which
   is what makes the synthesis statement about named tools checkable. Rendered
   on the Community page.

3. **`Key Gaps` bullets — 34 statements across 9 topics.** Written to
   `data/processed/reference_context.json` for the Literature → Practice
   matrix. Not yet displayed.

### Not ingested

The "Important Links" section points at EDF SharePoint documents. These are
internal and are filtered out by an explicit private-host check in the adapter;
they must never appear on the public site.

The Appendix holds a comparison table of **steady-state vs. transient vs.
superposition** models (what each solves, timing information, computational
cost, whether it can distinguish depletion source, key limitation). This is a
ready-made ISW figure and is flagged in `notes/build_plan.md` for the next
session.

---

## What the site does *not* have a source for

Recorded here so nothing gets quietly invented later:

- **Basin geometry / spatial data.** None. The Study Area map is an ArcGIS
  embed the user supplies; `MAP_STUDY_AREA_EMBED` is the placeholder.
- **MLRP project locations.** None. `MAP_MLRP_EMBED` remains a placeholder,
  and the synthesis itself notes project-location data are inconsistent.
- **DWR Bulletin 118 basin numbers.** Not present in any source file, so they
  are deliberately omitted from `config/basins.yml` rather than supplied from
  memory.
- **A public URL for the full technical report.** `REPORT_DOWNLOAD_URL`.
- **Colusa and Yolo evidence.** Registered as `planned`. Zero rows.
- **Any GSA board-meeting evidence.** Zero. The stream is an interface only.
