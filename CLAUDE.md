# Groundwater Accounting Portfolio Website — Claude Code Project Instructions

## 1. Project purpose

Build a public, modern, highly polished **Quarto website** that transforms a detailed California Department of Water Resources (DWR) Groundwater Accounting landscape analysis into a concise, visual, interactive portfolio project.

The website is **not** a shortened version of the original report. It is a separate public-facing research product that should demonstrate three things simultaneously:

1. substantive understanding of groundwater management, SGMA, water accounting, interconnected surface water (ISW), multi-benefit land repurposing (MLRP), and community considerations;
2. the ability to synthesize a large body of plans, rules, reports, technical studies, public comments, and academic literature into clear cross-basin findings; and
3. the ability to turn a large compilation of evidence into a digestible online research and decision-support tool.

Primary audience: **water/environmental professionals and potential employers**.

Secondary audience: groundwater practitioners, public-agency staff, researchers, and technically interested readers.

### Scalability requirement — build the framework now, expand the analysis later

The website is being built **before the full basin sample is complete**.

Current analyzed case studies:
- Merced Subbasin;
- East Turlock Subbasin;
- Salinas Valley Basin GSA / 180/400-Foot Aquifer Subbasin.

Known near-term additions:
- **Colusa Subbasin**;
- **Yolo Subbasin**.

Treat the current three as the **initial analyzed dataset**, not a fixed universe. The user wants the site skeleton, data pipeline, explorers, design system, and reusable comparison components built now while Colusa and Yolo are being analyzed.

Design all basin-dependent features to remain usable with approximately **3–12 subbasins** without a structural redesign.

Do not hard-code basin names, basin counts, filter options, comparison dimensions, map links, or basin-specific page logic when those can be generated from structured metadata and processed evidence.

The site should feel like an **editorial research publication / decision-support resource**, not a generic dashboard, startup landing page, academic paper rendered to HTML, or default Quarto template.

### Working title

**Accounting for Groundwater**  
**From Measurement to Management under SGMA**

Treat the title as editable. Do not hard-code it into graphics in a way that makes later changes difficult.

### Portfolio framing

Use language such as:

> Based on a landscape analysis conducted for the California Department of Water Resources Groundwater Accounting project.

The site should have its **own visual identity**. Do not make it look like an official DWR publication and do not use DWR branding or logos unless the user explicitly approves that later.

---

## 2. Source materials — authoritative inputs

Do not overwrite or alter the source files. Treat them as the evidentiary basis for the project.

Expected current source files:

- `Phase2_CrossBasin_Synthesis.docx` — detailed cross-basin synthesis and primary narrative source for the currently analyzed basins.
- `Phase2_Findings_OutlineClassified.xlsx` — structured findings database. The current `Findings` sheet contains 325 coded findings plus a header row and should be treated as the primary structured evidence source.
- `Literature_Review_DesktopAnalysis_Results.xlsx` — academic literature-review database organized across `Groundwater Accounting`, `Land Use Alternatives`, and `Community Considerations` sheets.
- `449 Final Presentation.pdf` — aesthetic reference deck and source of some graphics/illustrations that may later be supplied as separate authorized assets.
- additional methods slides/graphics may be added later.

Expected future additions:
- Colusa Subbasin planning/policy/program materials and coded findings;
- Yolo Subbasin planning/policy/program materials and coded findings;
- potentially a new **GSA board-meeting evidence stream**, likely using Waterone.ai-hosted meeting recordings/transcripts/metadata;
- other evidence streams if they materially improve the analysis.

Do not assume future evidence streams will use the same schema as the current workbooks.

### Findings workbook schema

Preserve the following source fields from the `Findings` sheet:

- Row ID
- Subbasin
- GSA
- Document
- Chapter
- Section
- Subsection
- Finding Type
- Finding
- Direct Quote
- Relevance to GAP
- Relevance to DWR Recommendations
- Quote Verified
- Related Finding
- Notes
- Lit Review Question/Gap Addressed

Use `Row ID` as the stable primary identifier whenever possible.

### Literature workbook

The literature workbook has different schemas by sheet. Do **not** concatenate it naively. Build explicit mappings from each sheet into a normalized literature schema, while preserving the original sheet name and source fields.

Suggested normalized fields:

- `id`
- `paper`
- `citation`
- `source_sheet`
- `primary_topic`
- `secondary_topics`
- `geography`
- `analysis_method`
- `accounting_method`
- `data_sources`
- `formal_program_or_crediting`
- `key_finding`
- `direct_quotes`
- `accounting_gap`
- `relevance`
- `notes`

Some columns do not exist on every sheet. Preserve missing values as missing; never invent them.

Deduplicate papers by normalized title/citation **only when clearly the same paper**. If the same paper appears in multiple topical sheets, preserve all topical associations. Do not hard-code a public-facing literature count; compute it from the processed data at build time.

### Basin metadata architecture

Create a canonical basin registry such as `config/basins.yml`.

Recommended fields include:
- stable `id` / slug;
- `name`;
- `short_name`;
- `status` (`active` or `planned`);
- `include_in_analysis`;
- region;
- relevant GSA metadata;
- map/filter slug.

Seed it with:
- Merced — active;
- East Turlock — active;
- Salinas Valley / 180/400-Foot — active;
- Colusa — planned;
- Yolo — planned.

Rules:
- only active basins count toward public analytical statistics, explorer filters, and cross-basin conclusions;
- planned basins must **not** render as zero findings, failures, or “not found” results;
- adding a completed basin should require metadata + evidence rows + optional map geometry, not rewriting page logic.

### Evidence-stream architecture

Current active evidence streams:
1. **Policy & Planning Documents** — GSPs, annual reports, rules, technical studies, implementation/program documents, comment letters, and related basin materials represented in the findings workbook/report.
2. **Academic Literature** — the literature-review workbook.

Potential future evidence stream:
3. **GSA Board Meetings** — potentially sourced from Waterone.ai-hosted meeting recordings, transcripts, agendas, summaries, timestamps, or metadata.

The exact Waterone.ai workflow is not yet defined. Build the preprocessing and provenance model so a board-meeting adapter can be added later **without refactoring the public site architecture**. Do not invent a Waterone.ai API, scraper, or transcript format.

Create `config/evidence_streams.yml`, with active/planned status.

Reserve extensible provenance fields such as:
- `evidence_stream`;
- `source_type`;
- `source_title`;
- `source_date`;
- `source_url`;
- `subbasin`;
- `gsa`;
- `evidence_id`;
- `verification_status`.

For future meeting evidence, optionally support when available:
- meeting date/title;
- agenda item;
- speaker and role;
- transcript excerpt;
- start/end timestamp;
- recording/transcript/minutes URL.

The public site must not imply board meetings were reviewed until actual meeting evidence has been added and verified.

### Analyst-authored synthesis vs. automatically updating data

Automatically data-driven:
- basin/finding/document/literature counts;
- filter options;
- explorer result cards;
- basin selectors;
- source-stream labels;
- descriptive tables that directly reflect coded data.

Analyst-authored and **must be reviewed** when a basin or evidence stream is added:
- headline findings;
- cross-basin conclusions;
- implications for GAP/DWR;
- chapter takeaways;
- statements using words such as “all,” “none,” “only,” “shared,” or “across basins.”

Create `notes/narrative_review.md`. Whenever a basin becomes active or a new evidence stream is activated, flag narrative claims whose scope may have changed.

The data build should also create a small manifest with:
- build date;
- active basin IDs/count;
- planned basin IDs;
- active evidence streams;
- processed finding count;
- processed literature count.

---

## 3. Non-negotiable evidence rules

The site must preserve the analytical discipline of the source report.

### Never manufacture evidence

Do not invent:

- findings;
- comparisons;
- quantitative scores;
- causal relationships;
- maturity ratings;
- program characteristics;
- source quotations;
- citations;
- geographic data;
- links to source documents.

If a visual requires a judgment that is not encoded in the source materials, flag it for user review instead of silently assigning a value.

### Absence is not nonexistence

A recurring distinction in the source material is between:

- **not found in the reviewed documents**, and
- **does not exist**.

Preserve that distinction everywhere. Do not turn an `Absence Finding` into a categorical statement that a practice or instrument does not exist unless the source explicitly supports that conclusion.

### Document-set completeness matters

The current basin document sets are not equally complete, and future basin/source additions may widen those differences. When comparing basins, preserve caveats about whether an absence reflects a demonstrated gap, incomplete documentation, an unfinalized plan, a source stream that has not yet been reviewed, or an architecture that has not yet produced results.

### Quotations

- Preserve direct quotations exactly as supplied in the workbook/report.
- Use the `Quote Verified` field where present.
- Do not paraphrase a direct quote and present it as a quote.
- Long quotations belong inside collapsible evidence/details panels, not the main narrative.

---

## 4. Editorial strategy

The technical report is comprehensive and organized around repeated literature → basin → basin → basin → comparison → gap sections.

The website should **not** reproduce that structure linearly.

Instead, each narrative page should:

1. lead with the cross-basin insight;
2. explain it visually;
3. use concise prose to interpret it;
4. let the reader drill down into the underlying evidence through interactive links/cards;
5. connect the insight to implications for the Groundwater Accounting Platform and/or DWR where the source material supports doing so.

### Writing voice

- Clear, analytical, restrained, confident.
- Water-policy literate without being jargon-heavy.
- Explain technical terms where needed.
- Prefer short paragraphs, strong headings, and specific declarative takeaways.
- Avoid hype, marketing language, and generic AI phrases.
- Avoid overclaiming.
- Do not turn careful source caveats into punchy but inaccurate headlines.

### Core storytelling principle

The website has two complementary layers:

**Layer 1 — Tell me the story**  
A concise, visual narrative that a hiring manager can understand in 5 minutes.

**Layer 2 — Let me explore the evidence**  
Interactive access to the structured findings and literature for a technical reader who wants to inspect how the conclusions were reached.

---

## 5. Site architecture

Use a top navigation with six principal destinations:

1. **Overview**
2. **Interconnected Surface Water**
3. **Land Repurposing**
4. **Community**
5. **Explore Findings**
6. **Methods & Evidence**

Suggested files:

```text
index.qmd
isw.qmd
mlrp.qmd
community.qmd
findings.qmd
methods.qmd
```

### Overview page

Purpose: orient the reader and establish the intellectual contribution in under 60 seconds.

Include:

- a restrained hero section;
- working project title and subtitle;
- short statement of the research question;
- portfolio/DWR framing;
- dynamically generated project statistics (e.g., findings, distinct documents, literature papers, and **active analyzed subbasins**); never hard-code the basin count;
- three thematic entry points: ISW, MLRP, Community;
- 3–5 headline cross-cutting findings;
- the Study Area ArcGIS embed placeholder;
- a compact “how the analysis worked” visual;
- clear calls to explore chapters or the findings database.

Do not use a giant full-screen stock photo or generic hero gradient.

### ISW page

Frame the chapter around a question such as:

> How does information move from pumping, to hydrologic impact, to an accounting or management decision?

Core visual: **ISW accounting chain**

```text
Pumping
  → Hydrologic response
  → Measurement / model
  → Attribution
  → Sustainability threshold
  → Accounting / compliance
  → Management response
```

Build this as a responsive HTML/CSS/SVG web graphic, not a raster image.

For the initial build, show basin-specific tracks for Merced, East Turlock, and Salinas Valley. Generate the component from basin metadata/evidence so Colusa, Yolo, and later basins can be added without rewriting it. With more than roughly five active basins, prefer a basin selector, small multiples, scrollable comparison, or another scalable layout rather than squeezing every basin into one fixed row.

Candidate headline finding to verify against the source before publication:

> In the three currently analyzed case studies, measurement appears more sophisticated than accounting: sophisticated numerical groundwater–surface water model outputs often do not become the compliance/accounting quantity itself.

This is provisional, scope-limited wording. Re-review it when Colusa, Yolo, or new evidence streams are added.

Additional concepts to visualize where supported:

- pumping-attributable depletion vs. total depletion;
- basin/reach attribution vs. per-well attribution;
- model output vs. regulatory threshold;
- aquifer-depth mismatch;
- monitoring/field measurement differences;
- uncertainty communication.

Clicking a stage or basin element should be able to link to a pre-filtered findings view.

### Land Repurposing page

Frame around a question such as:

> When land is repurposed, what is actually measured, verified, credited, and monitored?

Core visual: **MLRP accounting lifecycle**

```text
Select / prioritize parcel
  → Fund intervention
  → Change land use
  → Measure water use
  → Verify delivered savings
  → Address allocation / leakage
  → Measure co-benefits
  → Monitor durability over time
```

Compare the active analyzed basins across this lifecycle. The initial version will contain three; the component must scale cleanly as Colusa, Yolo, and later basins become active.

Candidate ideas to verify and visualize from the source:

- post-implementation measurement differs sharply across basins;
- estimated savings and measured savings are not the same thing;
- allocation treatment changes whether water savings can leak or move;
- ecological/community co-benefits are frequently named or scored but rarely measured as delivered outcomes;
- grant timelines and long-term monitoring obligations do not necessarily have matching long-term funding.

Build a **comparison matrix** only with transparent, source-grounded categories. Avoid a simplistic “good/bad” score.

If a cell represents “not found in reviewed documents,” label it exactly that way rather than as failure/nonexistence.

### Community page

Use the three-part equity framework already present in the synthesis:

- **Representative equity** — who has a seat or vote?
- **Procedural equity** — who can participate, appeal, understand, and influence decisions?
- **Distributional equity** — who bears the benefits, burdens, and consequences?

Core visual 1: **three-dimension equity framework**.

Core visual 2: **threshold → household consequence chain**

```text
Groundwater threshold
  → water level / exposure
  → domestic well depth or system vulnerability
  → expected household/community consequence
  → mitigation / response
```

Candidate cross-basin insight to verify:

> Formal representation, procedural access, and distributional protection can move independently; distributional outcomes are the most consistent shared gap across the reviewed cases.

Other strong story threads may include:

- governance representation vs. actual decision authority;
- appeals, fees, standing, language access, and timelines;
- domestic-well mitigation and whether risk is translated prospectively or only after failure;
- engagement reach and the gap between engagement activity and measurement of who was reached;
- community-facing tools vs. grower/compliance-facing accounting tools.

### Explore Findings page

This is a flagship feature, not an appendix.

Build a client-side interactive explorer backed by processed JSON/CSV derived from the findings workbook.

Required controls:

- free-text search;
- Chapter;
- Subbasin;
- GSA;
- Section;
- Finding Type;
- Relevance to GAP;
- Relevance to DWR Recommendations;
- Quote Verified where useful.

Future-ready control:
- **Evidence Stream / Source Type** when more than one applicable stream is present (for example Policy & Planning Documents vs. GSA Board Meetings).

Generate Subbasin, GSA, and evidence-stream options from processed data/metadata. Never maintain those lists manually in page code.

Optional controls if they improve usability:

- Document;
- lit-review gap/question;
- sort by Row ID / relevance / chapter.

Each result should show a concise card with:

- Subbasin / chapter tags;
- finding title or short lead generated from the existing finding **without changing its meaning**;
- source finding text;
- finding type;
- relevance badges;
- source document;
- evidence/details expansion.

Expanded evidence should expose:

- full finding;
- direct quote;
- exact source/document location as supplied;
- notes where appropriate;
- related finding link(s);
- literature-review gap addressed.

Requirements:

- filtering happens entirely client-side;
- filter state should be reflected in the URL query string where feasible so filtered views are shareable/deep-linkable;
- chapter graphics and ArcGIS pop-ups should be able to link directly into filtered views;
- do not make all 325 cards load visually at once if that harms performance; paginate or virtualize/lightly chunk if needed;
- maintain keyboard accessibility and meaningful focus states.

### Methods & Evidence page

This page should establish rigor without becoming another long report.

Recommended sections/tabs:

1. **Methods**
2. **Literature Explorer**
3. **Limitations**
4. **Credits & Project Role**
5. **Full Report**

Methods content should cover:

- research question;
- why the initial case studies were compared, the current analytical scope, and how additional basins are incorporated;
- document collection / desktop analysis;
- literature review;
- coding/classification of findings;
- cross-basin synthesis;
- how implications for GAP/DWR were identified;
- how to interpret absence findings and incomplete document sets.

Build a compact methods workflow graphic:

```text
Academic literature review
  + policy / planning document review
  + optional future evidence streams (e.g., GSA board meetings)
  → structured finding extraction
  → classification and evidence verification
  → cross-basin comparison
  → platform / policy implications
```

The user may provide methods slides/graphics later. Design this section so those assets can be inserted without restructuring the page.

#### Evidence Streams

Include a concise explanation of what evidence is actually in scope.

Current active streams:
- academic literature;
- basin policy/planning/program/technical documents.

Potential future stream:
- GSA board-meeting evidence, potentially sourced through Waterone.ai.

Do not describe the board-meeting stream publicly as analyzed until real meeting evidence is present. The page should be able to add a new evidence-stream card/section later without restructuring.

#### Literature Explorer

Build a second searchable client-side explorer from the normalized literature database.

Useful filters:

- topic;
- secondary topic;
- geography;
- accounting/method type;
- relevance;
- source sheet.

Each literature card should emphasize:

- what method or analytical approach the paper demonstrates;
- geography / scale;
- key finding;
- applicability to GAP;
- accounting gap or limitation;
- citation;
- direct quote(s) in an evidence expansion when present.

Do not make the literature explorer feel like a bibliography table.

#### Full report

Include a prominent but secondary link to the complete technical report.

Use a placeholder such as:

`REPORT_DOWNLOAD_URL`

Preferred public format: PDF for browser readability. A DOCX link can be offered as a secondary format if desired.

The Excel workbooks do **not** need public download buttons. Their content should be surfaced through the interactive explorers.

---

## 6. Cross-cutting visual: Literature → Practice matrix

Build a prominent synthesis graphic comparing methods demonstrated in the literature with what is implemented, partially implemented, or not found in the reviewed basin documents.

Potential rows, subject to source verification:

- per-well depletion attribution;
- numeric ISW uncertainty;
- post-project ET verification;
- additionality / leakage;
- ecological co-benefit quantification;
- domestic-well impact estimation;
- community-benefit measurement;
- engagement/reach measurement.

For the initial build, possible columns are:

- Literature / methods demonstrated;
- Merced;
- East Turlock;
- Salinas Valley.

Do not hard-code a permanent three-column matrix. As Colusa/Yolo are activated, use an accessible horizontally scrollable table, a basin selector, a basin-as-rows layout, or another pattern that remains readable with roughly 3–12 basins.

Do not use a maturity score or traffic-light system unless the criteria are explicitly defined and approved by the user.

Use terms such as:

- demonstrated in literature;
- implemented;
- partial / adjacent implementation;
- described but not operationalized;
- not found in reviewed documents;
- not applicable.

Each matrix cell should link to the supporting filtered findings/literature where feasible.

---

## 7. ArcGIS responsibilities and placeholders

The user will create the authoritative maps in ArcGIS Online. Claude Code should **not** recreate GIS analysis or invent spatial data.

Claude Code is responsible for:

- creating elegant embed containers;
- responsive sizing;
- captions / context around the maps;
- deep-linking from site content to map or explorer where useful;
- handling placeholder states until embeds are supplied.

### Map 1 — Study Area / Basin Context — required

Purpose: orient the reader geographically, not carry the analytical burden of the site.

Recommended layers created by the user:

Current analyzed basins:
- Merced Subbasin;
- East Turlock Subbasin;
- Salinas Valley 180/400-Foot Aquifer Subbasin.

Known near-term additions:
- Colusa Subbasin;
- Yolo Subbasin.

The ArcGIS schema/symbology should make Colusa and Yolo easy to add later. Do not require them to display as analyzed basins before their evidence is ready. If shown during development, label/style them clearly as planned or analysis in progress.

Also include:
- relevant GSA boundaries;
- major rivers relevant to the analysis;
- a restrained set of cities/towns or geographic labels.

Optional popup fields:

- `name`
- `slug`
- `gsa`
- `region`
- `accounting_platform`
- `isw_model`
- `mlrp_structure`
- `key_characteristic`
- `analysis_status` (`active` / `planned`)
- `findings_url`

Example popup structure:

```text
Merced Subbasin
San Joaquin Valley

Groundwater accounting
Groundwater Accounting Platform

ISW model
MercedWRM

Land repurposing
GSA-led MLRP + local repurposing program

Key feature
[short source-grounded characteristic]

Explore findings →
```

The final `findings_url` should use the deployed site URL plus query parameters, e.g.:

`https://DOMAIN/findings.html?subbasin=Merced`

Use placeholder in site source until deployment URL is known:

`MAP_STUDY_AREA_EMBED`

Claude should accept either:

- a public ArcGIS embed iframe/snippet; or
- a public ArcGIS map URL that can be embedded safely.

### Map 2 — MLRP / land-repurposing geography — optional but desirable if data quality supports it

Purpose: answer a real analytical question such as:

> Where is land repurposing occurring or being prioritized, and what water/community characteristics overlap those locations?

Possible user-created layers:

- MLRP projects/project areas where reliable data exist;
- priority areas;
- relevant community/context layers such as DACs, small water systems, or domestic-well density when defensible;
- GSA/subbasin boundaries.

Use placeholder:

`MAP_MLRP_EMBED`

If the active basins have highly inconsistent project-location data, do not hide that. The availability/incomparability of spatial project data can itself be described as a limitation.

### No required ISW map

Do not create an ISW map simply because there is an ISW chapter. The strongest ISW story is conceptual/accounting-oriented. Use a process diagram unless a map adds analytical value.

---

## 8. Illustration and graphic asset policy

The visual reference deck is:

**Accessible & Engaging Communication of Groundwater Publication** by Sara Soroka & Travis Rennacker.

The website may reuse selected graphics from that project with permission.

### Illustration credit

Illustrator: **Sara Soroka**.

Preferred credit pattern for reused graphics:

> Illustration by Sara Soroka. Originally created for *Well, Well, Well: An Introduction to Groundwater Recovery* by Sara Soroka and Travis Rennacker. Used with permission.

If materially modified, use:

> Adapted from an illustration by Sara Soroka, originally created for *Well, Well, Well: An Introduction to Groundwater Recovery*. Used with permission.

Include immediate figure-level credit where appropriate and a consolidated Credits & Acknowledgments section on the Methods page.

### Asset handling

Preferred input order:

1. SVG originals;
2. high-resolution PNG/WebP;
3. other raster formats only if necessary.

Suggested asset directory:

```text
assets/
  illustrations/
  photos/
  maps/
  icons/
```

Do not attempt to imitate Sara Soroka’s illustrations pixel-for-pixel for new content. New site-native diagrams should harmonize with the source deck through palette, line weight, simplified forms, editorial composition, and geological/water motifs while remaining clearly original web graphics.

Do not recolor or materially edit authorized illustrations unless the user confirms that is permitted.

---

## 9. Design system

### Visual goal

Modern, sleek, warm, editorial, environmental, and highly legible.

The visual language should evoke:

- groundwater / geology / land;
- natural-history editorial design;
- public-interest research;
- calm technical confidence;
- thoughtful use of negative space.

Avoid:

- default Bootstrap/Quarto appearance;
- bright corporate blues;
- neon dashboard colors;
- heavy gradients;
- glassmorphism;
- excessive shadows;
- generic AI illustrations;
- rows of identical rounded cards everywhere;
- crowded dashboards;
- overly playful “eco” branding.

### Core palette

Use these as the starting design tokens. They are web approximations extracted/translated from the reference presentation and can be adjusted slightly to meet accessibility/contrast requirements while preserving the overall character.

```css
:root {
  --bg: #F2EDE1;             /* warm cream */
  --surface: #F7F2E8;        /* lighter cream */
  --surface-2: #E6E0D0;      /* soft beige */
  --sand: #D6CCB9;           /* muted sand */

  --ink: #554E3D;            /* dark brown-charcoal */
  --ink-strong: #403C32;     /* darker body/heading option */
  --ink-muted: #77746A;

  --isw: #73808C;            /* slate groundwater blue */
  --isw-light: #C9D1D6;

  --mlrp: #676C57;           /* olive / land */
  --mlrp-light: #D7D8CC;

  --community: #9B7251;      /* earth brown */
  --community-light: #E2D2C3;

  --sage: #8A8A72;
  --dark-panel: #554E3D;
  --border: #CAC6B9;
}
```

### Semantic chapter colors

- ISW → slate groundwater blue.
- MLRP → olive/land green.
- Community → earth brown/tan family.

Use these colors consistently for:

- chapter labels;
- small data tags;
- diagram emphasis;
- section navigation;
- selected filters;
- figure accents.

Do **not** tint entire pages heavily by chapter. Keep the site grounded in the cream background and use chapter color as controlled semantic accent.

### Typography

Use a readable modern body face and a more editorial display face for major headings.

Recommended starting pairing:

- Display/headings: **Fraunces** or another restrained editorial serif/display face.
- Body/UI: **Source Sans 3**, **Inter**, or a comparable highly legible sans serif.

The exact fonts can be changed. Do not use a highly condensed decorative font for body text.

Typography should feel inspired by the reference presentation without reproducing its poster typography literally.

### Layout language

- generous margins and whitespace;
- readable line lengths (~65–80 characters for prose);
- full-width visual breaks where useful;
- restrained dark callout panels with cream text;
- thin rules and subtle borders;
- minimal shadows;
- square or modestly rounded corners rather than pill-shaped everything;
- editorial captions;
- strong oversized chapter headings;
- layered land/geology/water motifs used sparingly.

### Charts and diagrams

- muted palette only;
- direct labels preferred to legends when feasible;
- minimal gridlines;
- no 3D effects;
- no default Plotly colors;
- no decorative chart junk;
- always explain what the reader should notice;
- prefer responsive SVG/HTML graphics to PNGs for new diagrams.

---

## 10. Web-native graphics Claude should build

Prefer HTML/CSS/SVG and lightweight JavaScript/Observable over static raster graphics.

Required/priority graphics:

1. Overview study workflow.
2. ISW accounting chain.
3. Basin-scalable ISW track comparison (initially three active basins).
4. MLRP accounting lifecycle.
5. MLRP cross-basin comparison matrix.
6. Community representative/procedural/distributional equity framework.
7. Groundwater threshold → household consequence chain.
8. Literature → Practice matrix.
9. Project statistics / evidence summary.

Optional graphics:

- water-accounting conceptual architecture;
- decision tree for accounting approaches;
- method/data-source relationship diagram;
- small multiples showing how active basins differ at a particular stage; they must scale beyond the initial three.

### Interaction philosophy

Interaction should reveal evidence or clarify structure, not exist for spectacle.

Good interactions:

- hover/focus explanations;
- click to expand evidence;
- click a comparison element to open a filtered findings view;
- sticky figure with narrative progression if it materially improves understanding;
- shareable filter states;
- subtle state transitions.

Avoid:

- animations that delay reading;
- large D3 builds with little analytical payoff;
- scroll hijacking;
- excessive parallax;
- interactions that do not work on touch/mobile.

---

## 11. Data processing architecture

The website must remain static.

No:

- server database;
- Shiny server;
- authentication;
- custom API;
- external backend.

Recommended pipeline:

```text
source Excel / Word files
        ↓
Python preprocessing scripts
        ↓
clean JSON / CSV in data/processed
        ↓
Quarto pages + client-side JS explorers
        ↓
static GitHub Pages site
```

Use modular ingestion/adapters even if one orchestration script calls them:

```text
scripts/
  build_data.py
  ingest_findings.py
  ingest_literature.py
  ingest_meetings.py
```

`ingest_meetings.py` may initially be a documented stub/interface. Do not fabricate a Waterone.ai integration.

Configuration:

```text
config/
  basins.yml
  evidence_streams.yml
```

### Findings processing

For current workbook-derived findings, derive `evidence_stream = policy_planning` in the processed layer without altering the source workbook.

- preserve Row ID;
- normalize whitespace only;
- preserve source text and direct quotes exactly;
- create URL-safe slugs/derived filter values without mutating original text;
- create a `search_text` field from appropriate original fields;
- keep original and display-normalized values separately if needed;
- serialize missing values as null/empty consistently;
- derive counts at build time rather than hard-coding them.

### Literature processing

Assign `evidence_stream = academic_literature` in the processed layer.

- map each sheet explicitly to common fields;
- preserve source sheet;
- deduplicate only clear duplicates;
- preserve all topic associations;
- create stable IDs;
- preserve citations/direct quotations.

### Future board-meeting processing

Do not implement a brittle scraper before the Waterone.ai workflow is known. Define a normalized adapter contract so meeting evidence can preserve, when available:
- basin/GSA;
- meeting date/title;
- agenda item;
- speaker/role;
- transcript excerpt;
- start/end timestamps;
- recording/transcript/minutes URL;
- verification status;
- links to related coded findings.

Meeting evidence must remain distinguishable from adopted plans/rules in filters and citations.

### Search implementation

Use a lightweight client-side search approach. Fuse.js, FlexSearch, MiniSearch, or a small custom index are acceptable if needed. Do not add a backend search service.

---

## 12. Citation and evidence behavior

### Narrative pages

Keep citations light enough to preserve readability but rigorous enough that substantive claims are traceable.

Preferred display:

- short source references in footnotes/endnotes or compact inline superscripts;
- cite source document/section where relevant;
- academic claims should cite the literature entry/citation.

Do not expose huge raw citation strings in the main paragraph if a cleaner footnote/detail treatment works.

### Findings Explorer

This is where the full evidence trail should live:

- source document;
- section/page/PDF location as supplied;
- direct quote;
- quote verification status where present;
- notes;
- related finding IDs;
- relevant literature-review question/gap.

### External links

Do not invent URLs to original GSPs, reports, or literature.

If source URLs are added later, support them through explicit data fields such as `source_url`, `doi`, or `public_document_url`.

---

## 13. Technical architecture

Use **Quarto website** as the publication framework.

Preferred stack:

- Quarto;
- HTML/CSS;
- vanilla JavaScript where practical;
- Observable JS for reactive data graphics when it clearly helps;
- SVG for custom conceptual diagrams;
- Python for preprocessing Excel data;
- ArcGIS Online embeds for authoritative spatial content.

Avoid introducing React/Next/Svelte or a full SPA unless the user later approves a specific feature that genuinely requires it.

Suggested repository structure:

```text
.
├── CLAUDE.md
├── _quarto.yml
├── index.qmd
├── isw.qmd
├── mlrp.qmd
├── community.qmd
├── findings.qmd
├── methods.qmd
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── explorer.js
│   │   └── figures.js
│   ├── illustrations/
│   ├── photos/
│   └── maps/
├── config/
│   ├── basins.yml
│   └── evidence_streams.yml
├── data/
│   ├── source/
│   └── processed/
├── scripts/
│   ├── build_data.py
│   ├── ingest_findings.py
│   ├── ingest_literature.py
│   └── ingest_meetings.py
├── downloads/
├── notes/
│   ├── source_inventory.md
│   ├── build_plan.md
│   ├── decisions.md
│   └── narrative_review.md
└── README.md
```

### Quarto navigation

Use a clean horizontal top navbar on desktop and accessible collapsed navigation on mobile.

Enable Quarto site search if useful for narrative pages, but do not confuse Quarto site search with the custom evidence explorer search.

---

## 14. Hosting and deployment

Target: **GitHub Pages**.

Requirements:

- static output;
- repository should be publishable publicly;
- relative paths should work under a GitHub Pages project subdirectory;
- no secrets/tokens required for normal site viewing;
- public ArcGIS embeds should not require authentication;
- architecture should remain compatible with moving to a custom domain later.

Create a simple documented build process in `README.md`.

Recommended commands should be minimal, e.g.:

```bash
python scripts/build_data.py
quarto preview
quarto render
```

If a GitHub Actions workflow is added, keep it simple and documented.

---

## 15. Core launch version vs. optional enhancements

### Core launch version — build this first

This is the **first complete, publishable version** of the site. It should include:

- all six primary pages;
- custom design system;
- responsive navigation;
- Overview page with dynamic project statistics;
- Study Area map placeholder/embed container;
- three **thematic** narrative chapter pages (ISW, MLRP, Community), with basin comparisons generated in a scalable way;
- Findings Explorer;
- Literature Explorer;
- core required web-native graphics;
- Methods/limitations/credits;
- full-report download placeholder;
- figure-level illustration credits;
- accessibility basics;
- GitHub Pages-ready output.

### Optional enhancements — only after the core launch version works well

- MLRP ArcGIS map;
- scroll-triggered chapter graphics;
- sophisticated D3 transitions;
- animated literature → practice matrix;
- richer cross-filtering across figures and database;
- extra maps;
- additional photographs/illustrations;
- custom domain;
- advanced performance optimizations if actually needed.

Do not spend large amounts of time on optional animation before the core research experience is complete.

---

## 16. Accessibility and responsive requirements

The finished site must work on desktop, tablet, and mobile.

At minimum:

- semantic heading hierarchy;
- keyboard-accessible filters and expandable evidence;
- visible focus states;
- alt text for informative images;
- empty alt text for purely decorative images;
- figure credits readable by screen readers;
- accessible color contrast;
- do not rely on color alone to encode basin/status differences;
- charts/diagrams should have short text summaries;
- map embeds should have descriptive titles/captions;
- touch targets should be usable on mobile.

When the reference palette does not meet contrast guidelines for a specific text/background combination, adjust the shade slightly rather than abandoning the palette.

---

## 17. Project-role / portfolio language

The site should contain a concise section explaining the author’s role. Draft only from verified user-provided/project material, but structure it to cover areas such as:

- desktop review of GSPs, annual reports, rules, technical studies, program documents, and comments;
- academic literature review;
- structured coding/classification of findings;
- cross-basin comparison and synthesis;
- identification of implications for Groundwater Accounting / DWR;
- design and development of the public interactive portfolio adaptation.

Do not imply sole authorship of work that the source materials do not support.

---

## 18. Quality bar

The site should make a water/environmental employer think:

> This person reviewed a large body of technical material, understood the water-management substance, found meaningful cross-basin differences, and turned the evidence into something a decision-maker can actually use.

The desired reaction is **not** primarily:

- “This person knows Quarto.”
- “This person can make an ArcGIS map.”
- “This person built a flashy dashboard.”

Technology should support the analytical story rather than become the story.

---

## 19. Claude Code working behavior

### Before substantial coding

1. Read this `CLAUDE.md` completely.
2. Inventory the source files and confirm their schemas/content.
3. Create `notes/source_inventory.md` summarizing what each file contributes.
4. Create `notes/build_plan.md` with a concrete sequence of work.
5. Create `notes/decisions.md` and record substantive design/data decisions as they are made.
6. Create `notes/narrative_review.md`.
7. Create/seed `config/basins.yml` and `config/evidence_streams.yml`.
8. Identify any evidence claims in this brief that need source verification before public display.

### Implementation order

Prefer this sequence:

1. scaffold Quarto site + navbar;
2. implement design tokens / CSS and typography;
3. build extensible basin/evidence-stream registries and the modular data preprocessing pipeline;
4. build Findings Explorer end-to-end using active basin/evidence metadata rather than hard-coded case names;
5. build Overview page and dynamic stats;
6. build chapter narrative shells and core diagrams;
7. build Literature Explorer and Methods page, including an evidence-stream section that can later accommodate board-meeting evidence;
8. add ArcGIS placeholders/embeds;
9. add authorized illustrations and credits when assets are supplied;
10. accessibility/mobile QA;
11. GitHub Pages deployment setup;
12. optional enhancements only after launch scope is solid.

### Ask vs. proceed

Proceed independently on normal web implementation choices that are reversible.

Pause and flag for user review when:

- a substantive water-policy interpretation is ambiguous;
- a visual comparison requires assigning a score/category not directly supported by the source;
- source documents conflict materially;
- a claim would need information not present in the source materials;
- an illustration would require substantive scientific interpretation not provided by the user/source;
- a reused asset has unclear permission/credit status;
- activating a new basin or evidence stream would make an existing headline claim potentially stale.

For missing maps or later assets, use clearly labeled placeholders rather than blocking the entire build.

When Colusa or Yolo are added, or when board-meeting evidence becomes active:
1. rebuild processed data and dynamic counts;
2. confirm filters/comparison components update automatically;
3. update `notes/narrative_review.md`;
4. flag every narrative statement whose basin/source scope may have changed;
5. do **not** silently rewrite substantive conclusions without analyst review.

---

## 20. Acceptance criteria

The core launch version is ready when all of the following are true:

- the site builds cleanly with `quarto render`;
- all six primary pages exist and are navigable;
- the site has a custom, coherent visual identity based on the specified palette;
- it does not resemble default Quarto/Bootstrap styling;
- the Findings Explorer correctly represents all rows from the source findings sheet;
- the Literature Explorer correctly represents the normalized literature source data;
- counts displayed on the site are computed from processed source data;
- filters/search work on desktop and mobile;
- direct quotes and source locations are preserved;
- absence findings are not overstated;
- the three thematic narrative chapters lead with cross-basin insights rather than duplicating the report structure;
- basin names/counts/filter options are data-driven; activating Colusa or Yolo does not require rewriting core page logic;
- planned basins never render as false zeros, failures, or absence findings;
- the evidence provenance model can accept a future board-meeting stream without changing the public site architecture;
- core diagrams are responsive and readable;
- map placeholders can be replaced by public ArcGIS embeds without redesign;
- reused illustrations include Sara Soroka credit and the broader project credit where appropriate;
- the full technical report has a clear download/link placeholder;
- no Excel download is required;
- keyboard navigation, contrast, alt text, and responsive behavior have been checked;
- the repository includes clear build/deployment instructions.

---

## 21. Content ideas that should remain candidates until verified

The following are high-value storytelling ideas derived from the **current three-basin synthesis** and should be checked directly against source material before becoming final headlines. Re-review them when Colusa, Yolo, or a new evidence stream becomes active:

1. **Measurement is more sophisticated than accounting.** Sophisticated hydrologic model outputs often do not become the actual compliance/accounting quantity.
2. **Verification is the missing middle of land repurposing.** Programs differ substantially in whether savings are estimated before implementation, measured afterward, or excluded from the normal accounting instrument.
3. **Allocation rules determine whether a “water saving” stays saved.** Land-use change and the entitlement/accounting treatment of water are separate design questions.
4. **Community equity is not one variable.** Representation, procedural access, and distributional outcomes can diverge.
5. **The literature–practice gap is itself a finding.** Methods exist in the literature for several outcomes that are not yet operationalized in the reviewed accounting/program structures.

These are hypotheses/headline framings for the web narrative, not permission to simplify away qualifications in the report.

---

## 22. Final design reminder

Use the reference presentation for **feeling**, not for literal replication:

- cream instead of bright white;
- slate groundwater blues;
- muted olives and sage;
- earth/sediment browns;
- dark charcoal-brown text and callouts;
- scientific/editorial illustrations;
- generous negative space;
- maps and diagrams integrated into storytelling;
- modern web typography and interaction layered onto that natural visual language.

The final website should feel related to the presentation, but more modern, cleaner, more interactive, and distinctly the user’s own portfolio identity.
