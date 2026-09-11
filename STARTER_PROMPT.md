# Starter Prompt for Claude Code

I want you to build the Quarto portfolio website described in `CLAUDE.md`.

Before writing substantial site code:

1. Read `CLAUDE.md` in full.
2. Inspect the source files in the project and verify the structures of the report and both Excel workbooks. Treat Merced, East Turlock, and Salinas Valley as the current analyzed dataset; Colusa and Yolo are known near-term additions whose evidence is not yet complete.
3. Do not modify the source files.
4. Create:
   - `notes/source_inventory.md`
   - `notes/build_plan.md`
   - `notes/decisions.md`
   - `notes/narrative_review.md`
   - `config/basins.yml`
   - `config/evidence_streams.yml`
5. Identify any candidate headline claims in `CLAUDE.md` that need to be checked against the detailed synthesis before they can appear publicly.
6. Then scaffold the Quarto website and implement the **core launch version** in the order specified in `CLAUDE.md`.

Important priorities:

- The site must be grounded in the source materials and must not invent findings or comparisons.
- Preserve the distinction between “not found in reviewed documents” and “does not exist.”
- Make the Findings Explorer and Literature Explorer flagship features.
- Make all basin-dependent UI/data logic extensible to roughly 3–12 basins; do not hard-code the current three names/count.
- Register Colusa and Yolo as `planned` basins but exclude them from analytical counts/findings until their evidence is ready.
- Build a modular evidence-provenance layer. Current active streams are Policy & Planning Documents and Academic Literature. Reserve an adapter/interface for a potential future GSA Board Meetings stream sourced through Waterone.ai, but do not invent a scraper/API or imply those meetings have already been analyzed.
- Use the specified warm cream / slate blue / olive / earth palette and avoid default Quarto/Bootstrap styling.
- Prefer responsive HTML/CSS/SVG graphics to static PNGs for new conceptual diagrams.
- Use placeholders `MAP_STUDY_AREA_EMBED`, `MAP_MLRP_EMBED`, and `REPORT_DOWNLOAD_URL` until I supply the final ArcGIS embeds/report link.
- Keep the site fully static and GitHub Pages compatible.
- Do not introduce React/Next/Svelte, a database, a server, or authentication.
- Keep optional animation and advanced interactions secondary to the first complete publishable version.

For this first work session, I want an end-to-end foundation rather than isolated mockups. At minimum, complete:

1. the Quarto scaffold and navigation;
2. the design system/CSS;
3. the basin/evidence-stream registries and extensible source-data preprocessing pipeline;
4. a functional Findings Explorer using the real workbook data;
5. the Overview page shell with dynamic statistics and the Study Area map placeholder;
6. the initial Methods page shell with a Literature Explorer placeholder or first working pass.

After that, show me what you built, list the files created/changed, note any substantive questions that require my judgment, and recommend the next implementation step.
