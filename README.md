# Accounting for Groundwater

*From measurement to management under SGMA*

A static [Quarto](https://quarto.org) website presenting a cross-basin
landscape analysis of how California groundwater sustainability agencies
measure, account for, and act on interconnected surface water, multi-benefit
land repurposing, and community outcomes.

Based on a landscape analysis conducted for the California Department of Water
Resources Groundwater Accounting project. This site is an independent portfolio
adaptation and is **not** a DWR publication.

---

## Build

```bash
python3 scripts/build_data.py
quarto render
```

`build_data.py` reads the workbooks in `source_materials/` (read-only) plus the
registries in `config/`, and writes:

- `data/processed/*.json` — the data the client-side explorers load
- `_variables.yml` — inline numbers used in prose as `{{< var findings_total >}}`
- `_partials/*.html` — generated page blocks (stat strip, basin roster, stream cards)

**Nothing on the site hard-codes a count, a basin name, or a filter option.**
Re-running the build is what updates them.

To preview with live reload:

```bash
quarto preview
```

### Requirements

- Python 3.9+ with `openpyxl` and `PyYAML`
- Quarto 1.4+

```bash
python3 -m pip install openpyxl pyyaml
```

Verified against Quarto 1.10.18.

---

## Repository layout

```text
.
├── _quarto.yml              site config and navigation
├── index.qmd                Overview
├── isw.qmd                  Chapter 1 — Interconnected Surface Water
├── mlrp.qmd                 Chapter 2 — Land Repurposing
├── community.qmd            Chapter 3 — Community
├── findings.qmd             Findings Explorer
├── methods.qmd              Methods, evidence streams, Literature Explorer
├── assets/
│   ├── css/theme.scss       Bootstrap variable overrides
│   ├── css/styles.css       the design system
│   ├── js/explorer.js       shared explorer engine (filters, URL state, cards)
│   ├── js/findings.js       Findings Explorer
│   ├── js/literature.js     Literature Explorer
│   ├── js/figures.js        data-driven chapter figures
│   ├── icons/               site mark and favicon
│   └── illustrations/       (empty — awaiting authorized assets)
├── config/
│   ├── basins.yml           canonical basin registry
│   ├── evidence_streams.yml evidence-stream registry
│   └── document_links.yml   analyst-supplied source-document URLs
├── data/processed/          generated — safe to delete and rebuild
├── scripts/
│   ├── build_data.py        orchestrator
│   ├── common.py            shared normalization + registry loading
│   ├── ingest_findings.py   Policy & Planning Documents adapter
│   ├── ingest_literature.py Academic Literature adapter
│   ├── ingest_meetings.py   GSA Board Meetings adapter (documented stub)
│   ├── ingest_references.py DOIs, tool registry, literature gaps
│   └── render_partials.py   generates _variables.yml and _partials/
├── source_materials/        READ-ONLY source workbooks and report
├── notes/                   project documentation (not rendered as site pages)
└── downloads/               place the public report PDF here
```

---

## Evidence rules this codebase enforces

These are not stylistic preferences; the pipeline and the UI both enforce them.

1. **Absence is not nonexistence.** A finding coded `Absence Finding` renders
   everywhere as *"not found in reviewed documents"*. It is never shown as a
   zero, a failing score, or a claim that a practice does not exist.

2. **"Not coded" is not an absence.** If a comparison question was never coded
   for a basin, the cell says so. Collapsing that into an absence would invent
   evidence.

3. **No scores.** Comparison cells report the analyst's coded finding type.
   There is no maturity rating, traffic light, or ranking anywhere.

4. **Planned basins contribute nothing.** `include_in_analysis: false` gates
   every count, filter, and comparison column. The build fails if evidence
   appears for a basin still marked planned.

5. **Planned evidence streams are never described as reviewed.** The build
   refuses to run if a stream is marked active while its adapter is a stub.

6. **URLs are never invented.** A document link comes from the workbook's
   Legend registry or from `config/document_links.yml`, never from inference.
   A literature DOI comes from the paper's own citation or from an exact title
   match against the consolidated reference list — never from an author-and-year
   guess, which would attach the wrong paper (see `notes/decisions.md` D-15).

7. **Quotations are preserved exactly.** Ingestion normalizes whitespace and
   nothing else.

---

## Adding a basin

1. Add the coded findings rows, using the `workbook_value` from
   `config/basins.yml` as the `Subbasin` value.
2. In `config/basins.yml`, set `status: active` and
   `include_in_analysis: true`, and fill in the `profile` block — every
   descriptive field needs a `source_ref`.
3. `python3 scripts/build_data.py && quarto render`. Counts, filters,
   comparison columns, and explorer facets update themselves.
4. Update the ArcGIS feature's `analysis_status` and `findings_url`.
5. **Work through `notes/narrative_review.md`.** Every claim whose trigger is
   "new basin" is now potentially stale. Analyst-authored conclusions are not
   regenerated by the build, by design.

Basin-dependent UI scales to roughly 3–12 basins without a redesign: comparison
matrices switch from basins-as-columns to basins-as-rows past
`BASIN_COLUMN_LIMIT` in `assets/js/figures.js`.

## Adding an evidence stream

Implement an adapter returning records that satisfy the contract in
`config/evidence_streams.yml`, set the stream `status: active`, and rebuild.
The Findings Explorer grows an **Evidence stream** filter automatically once
more than one stream carries findings-shaped evidence — no page edit needed.

`scripts/ingest_meetings.py` defines the record contract for a future GSA
board-meeting stream. It is deliberately unimplemented: no source format has
been established, and writing a scraper against an assumed interface would
produce code that is wrong in an unknown way.

---

## Adding source-document links

Edit `config/document_links.yml` and rebuild. The file lists every document
that has at least one coded finding, annotated with its basin, type, and
finding count:

```yaml
documents:
  # East Turlock · Rules and Regulations · 22 findings
  "ETSGSA Rules and Regulations Phase 2":
    url: "https://example.org/etsgsa-rules-phase-2.pdf"
```

- `url: null` publishes no link for that document.
- `suppress: true` blocks a Legend link you know to be wrong, without editing
  the workbook.
- An entry here overrides the workbook's Legend registry.

## Placeholders awaiting content

| Placeholder | Location | What replaces it |
|---|---|---|
| `MAP_STUDY_AREA_EMBED` | `index.qmd` | Public ArcGIS embed for the study-area map |
| `MAP_MLRP_EMBED` | `mlrp.qmd` | Optional land-repurposing map |
| `REPORT_DOWNLOAD_URL` | `methods.qmd` | Public link to the full technical report |

Authorized illustrations go in `assets/illustrations/` with figure-level
credits; the credit block on the Methods page is already scaffolded.

---

## Deployment

Targets GitHub Pages. `_site/` is fully static — no server, database, or
authentication. All paths are relative, so the site works under a project
subdirectory (`https://user.github.io/repo/`) as well as at a domain root.

A workflow is provided at `.github/workflows/publish.yml`. In the repository
settings, set **Pages → Source** to **GitHub Actions**.
