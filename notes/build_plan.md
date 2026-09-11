# Build Plan

Follows the implementation order in `CLAUDE.md` §19.

## Session 1 — end-to-end foundation ✅ complete

| # | Step | Status |
|---|---|---|
| 0 | Source inspection + notes + registries | ✅ |
| 1 | Quarto scaffold, navbar, six pages | ✅ |
| 2 | Design system: tokens, typography, components | ✅ |
| 3 | Modular pipeline (`build_data.py` + 3 adapters) | ✅ |
| 4 | Findings Explorer, end-to-end on real data | ✅ |
| 5 | Overview page: dynamic stats, study-area map placeholder, workflow diagram | ✅ |
| 6 | Methods page + working Literature Explorer | ✅ |
| 7 | Chapter page shells + core diagrams (ISW chain, MLRP lifecycle, equity framework) | ✅ |

## Session 1b — consolidation document + link mechanism ✅ complete

| # | Step | Status |
|---|---|---|
| 8 | `scripts/ingest_references.py`: DOIs, tool registry, per-topic literature gaps | ✅ |
| 9 | `config/document_links.yml` override, pre-populated for all 33 documents | ✅ |
| 10 | DOI links + provenance + "Persistent link" filter in the Literature Explorer | ✅ |
| 11 | Tool registry rendered on the Community page | ✅ |

## Session 2 — narrative depth

1. Write the ISW / MLRP / Community chapter prose against the synthesis
   `Comparison.` and `Gaps.` paragraphs. Every claim traced to
   `notes/narrative_review.md` Part 2.
2. Build the Literature → Practice matrix. Both axes now have a source:
   - **literature axis** — the 34 `Key Gaps` statements in
     `data/processed/reference_context.json`, plus the `accounting_gap` field
     on each literature record;
   - **practice axis** — the coded findings per subsection.
   It must carry the **"gap on both sides"** state required by
   narrative-review C-5.
3. ISW model-type figure from the consolidation's appendix table
   (steady-state vs. transient vs. superposition: what each solves, timing
   information, computational cost, whether it can distinguish depletion
   source, key limitation). Already structured; needs a responsive layout.
4. Threshold → household consequence chain (Community).
5. Wire every diagram element to a deep-linked filtered findings view.

## Session 3 — assets, QA, deploy

1. Drop in `MAP_STUDY_AREA_EMBED` when the ArcGIS map is published.
2. Add authorized illustrations + credits.
3. Replace `REPORT_DOWNLOAD_URL`.
4. Accessibility pass: keyboard, contrast, focus, screen-reader summaries for
   every diagram; mobile pass at 375px.
5. GitHub Pages workflow.

## Deferred (optional enhancements, per `CLAUDE.md` §15)

MLRP map · scroll-triggered graphics · D3 transitions · cross-filtering between
figures and explorers · custom domain.

## Extension checklist — activating Colusa or Yolo

1. Add coded findings rows using the `workbook_value` in `config/basins.yml`.
2. Flip `status` to `active` and `include_in_analysis` to `true`.
3. Populate the basin `profile` block, each field with a `source_ref`.
4. Run `python3 scripts/build_data.py` — counts, filters, comparison columns,
   and explorer facets update automatically. The build fails loudly if evidence
   exists for a basin still marked `planned`.
5. Update the ArcGIS feature's `analysis_status` and `findings_url`.
6. **Work through `notes/narrative_review.md` Part 2.** Every row whose trigger
   is "new basin" is now potentially stale. Do not let the pipeline rewrite
   these — they are analyst judgments.
