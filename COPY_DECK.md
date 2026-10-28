# Copy Deck — Accounting for Groundwater

This is the single editable source for **every piece of visible wording** on the
portfolio site: page titles, navigation labels, eyebrows, headings, body
paragraphs, headline findings, captions, card text, button labels, image alt
text, and diagram descriptions.

**Purpose.** Edit the wording here, then tell me "copy deck updated" and I will
push the changes back into the site source (`.qmd` files, `_quarto.yml`,
config). You never have to open the code or paste text into chat.

---

## How to use this document

- **Edit the text under each entry ID.** Keep the ID line and the `[type]` tag;
  change whatever is below it.
- **To rename a section**, edit its heading text here. If you want a section
  moved, split, merged, or deleted, write that instruction inline in **ALL
  CAPS** under the entry, e.g. `MOVE THIS BELOW OV-HEADLINES` or `DELETE THIS
  SECTION`.
- **To add** a new paragraph, finding, or card, insert it where you want it and
  label it `NEW` instead of an ID — I will assign a real ID when I integrate.
- **Do not edit the `{{< var … >}}` tokens.** They are numbers filled in
  automatically from the processed data at build time (finding counts, basin
  names, etc.). The current value is shown in the margin like `‹= 325›` for
  reference only. If a number looks wrong, that is a data-pipeline fix, not a
  copy fix — flag it in ALL CAPS.
- **Links** are shown as `[visible text](target)`. You can edit the visible
  text freely. Only change a `target` if you know the destination page/filter.
- Entries marked **‹config-routed›** are generated from `config/basins.yml` or
  `config/evidence_streams.yml`. You can still edit the wording here; I will
  route it to the right config field.

### Legend

| Tag | Meaning |
|---|---|
| `[title]` | Browser tab / SEO title (not shown on page body) |
| `[nav]` | Top navigation label |
| `[eyebrow]` | Small uppercase kicker above a section |
| `[h1]` `[h2]` `[h3]` | On-page headings |
| `[lede]` | Large intro paragraph |
| `[body]` | Standard paragraph text |
| `[caption]` | Small print under a figure / at the end of a section |
| `[card]` | Text inside a card / tile |
| `[button]` | Button or call-to-action link |
| `[alt]` | Image alt text (screen readers + SEO) |
| `[figure-desc]` | Long text description of a diagram (screen readers) |
| `[callout]` | Boxed aside |

### Last synced

Copy deck last synced: **2026-10-28** (full regeneration after the six-basin
restructure). Site pages covered: `index`, `isw`, `mlrp`, `community`, `map`,
`findings`, `methods`, plus `_quarto.yml` and the config files that hold copy.

> **What changed (2026-10-28).** Colusa, Yolo and Kaweah are now analysed
> subbasins (six in all). Every chapter page now has four parts: **Intro →
> core graphic → Key gaps → Across the six subbasins**. The old Key Findings,
> Breakdown by Subbasin, Connection to Accounting, Beyond and Further
> Exploration sections are gone, as are the Overview's Research scene and
> Headline findings. Scrolling is now ordinary page scroll (no pinned scenes).
>
> **Where copy now lives:**
> - Page copy (intros, chain steps, captions) — the `.qmd` files, mirrored in
>   sections 2–7 below.
> - **Key gaps** — `config/key_gaps.yml`, mirrored in section 3–5 as
>   `*-GAP-*` entries ‹config-routed›. They render on each chapter and, as a
>   title list, on the Overview.
> - **Across the subbasins** — rendered straight from
>   `Phase2_CrossBasin_Synthesis.docx`. Edit the synthesis itself; it is not
>   copied into this deck.
> - **MLRP co-benefits matrix** — cell text comes from
>   `MLRP_Benefits_Matrix.xlsx`. Edit the workbook; only the section's
>   framing copy is here.
> - **Map profiles** — `config/basin_profiles.yml`, mirrored in section 5b as
>   `MAP-PROFILE-*` ‹config-routed›.
>
> Retired entry IDs are listed in section 10 for this one revision cycle.

---

# 1 · Site-wide (`_quarto.yml`)

### SITE-TITLE `[title]`
Accounting for Groundwater

### SITE-TITLE-NAV `[nav]`
Accounting for Groundwater
> Shown next to the logo in the navbar. Non-breaking spaces are added
> automatically so it doesn't wrap mid-phrase.

### SITE-DESC `[body]`
> Meta description for search engines and link previews.
A cross-basin analysis of how California groundwater agencies measure, account
for, and act on interconnected surface water, multi-benefit land repurposing,
and community outcomes under SGMA.

### NAV-1 `[nav]`
Overview

### NAV-2 `[nav]`
Interconnected Surface Water

### NAV-3 `[nav]`
Land Repurposing

### NAV-4 `[nav]`
Community

### NAV-4b `[nav]`
Map

### NAV-5 `[nav]`
Explore Findings

### NAV-6 `[nav]`
Methods & Evidence

### FOOTER-LEFT `[body]`
Based on a landscape analysis conducted for the California Department of Water
Resources Groundwater Accounting project. This site is an independent portfolio
adaptation and is not a DWR publication.

### FOOTER-RIGHT `[button]`
[Methods & Evidence](methods.qmd) · [Explore Findings](findings.qmd)

---

# 2 · Overview page (`index.qmd`)

### OV-TITLE `[title]`
From Measurement to Management under SGMA

### OV-SEO-DESC `[body]`
How six California subbasins measure, account for, and act on interconnected
surface water, land repurposing, and community outcomes under SGMA.

## Hero

### OV-HERO-H1 `[h1]`
Accounting for Groundwater

### OV-HERO-SUB `[h2]`
From measurement to management under SGMA

### OV-HERO-LEDE `[lede]`
California's groundwater sustainability agencies model stream depletion to local
streams, estimate water saved by retiring farmland, and identify the communities
their decisions affect. This analysis dives in further to investigate how these
ideas are tracked, reported, and routed into management.

## Metrics strip

### OV-METRIC-1 `[card]` ‹= 687›
- **Number token:** `{{< var findings_total >}}`
- **Label:** Coded Findings
- **Detail (shown on tap/click):** Findings drawn from the reviewed policy and
  planning documents, coded across interconnected surface water, land
  repurposing, and community considerations.

### OV-METRIC-2 `[card]` ‹= 69›
- **Number token:** `{{< var documents_total >}}`
- **Label:** Policy & Planning Documents
- **Detail:** Groundwater Sustainability Plans, annual reports, rules, program
  instruments, and related materials reviewed across the subbasins.

### OV-METRIC-3 `[card]` ‹= 61›
- **Number token:** `{{< var literature_total >}}`
- **Label:** Literature Sources
- **Detail:** Academic and applied research reviewed to identify accounting
  methods, measurement approaches, and practices that transfer to a groundwater
  accounting platform.

### OV-METRIC-4 `[card]` ‹= 6›
- **Number token:** `{{< var active_basins >}}`
- **Label:** Subbasins Reviewed
- **Detail:** The California groundwater subbasins included in the current
  cross-basin analysis.

## The research question  *(was "The Research" pinned scene)*

### OV-RQ-EYEBROW `[eyebrow]`
The research question

### OV-RQ-H3 `[h3]`
How do local agencies account for water under land use alternatives, and how do
they involve communities?

### OV-RQ-BODY `[body]` ‹= six› *(new — replaces OV-RQ-BODY-1…4)*
Under the Sustainable Groundwater Management Act, an agency must define what
unsustainable looks like, measure whether it is happening, and act when it is —
each step needing a defined method and number. This analysis compares what the
published literature shows is possible with what `{{< var active_basins_word >}}`
subbasins' plans, rules and reports actually do, and traces where the two part
ways.

## Three chapters

### OV-DOMAINS-EYEBROW `[eyebrow]`
Three chapters

### OV-CHAPTER-CARD-1 `[card]`
- **Kicker:** Chapter 1
- **Title:** Interconnected Surface Water
- **Body:** How information moves from pumping, through a hydrologic model, to a
  sustainability threshold — and where that chain breaks.
- **Link text:** Read the chapter →

### OV-CHAPTER-CARD-2 `[card]`
- **Kicker:** Chapter 2
- **Title:** Land Repurposing
- **Body:** When farmland comes out of production, what is actually measured,
  verified, credited, and monitored afterwards.
- **Link text:** Read the chapter →

### OV-CHAPTER-CARD-3 `[card]`
- **Kicker:** Chapter 3
- **Title:** Community
- **Body:** Representation, procedural access, and who bears the consequences.
  How are GSAs interacting with these concepts?
- **Link text:** Read the chapter →

## Key gaps  *(new — replaces Headline findings)*

### OV-GAPS-EYEBROW `[eyebrow]`
Key gaps

### OV-GAPS-LEDE `[lede]`
The central takeaways of the analysis: where the literature, the plans, and the
accounting fall short of one another. Each opens in its chapter with the
evidence behind it.

> The three columns list every chapter's gap titles, linked to the gap. Titles
> are edited in the chapter sections (`ISW-GAP-*`, `MLRP-GAP-*`, `COM-GAP-*`).
> Currently:
> - **Chapter 1 · Interconnected Surface Water:** Groundwater levels stand in for modeled depletion; Attributing depletion to individual wells; Monitoring wells and pumping sit at different depths; ISW monitoring coverage depends on grants; Uncertainty in depletion estimates goes unreported; Thresholds anchored to drought, not ecological flow needs; Depletion on streams shared between subbasins
> - **Chapter 2 · Land Repurposing:** How is the water-savings math carried out?; Where does a repurposed parcel's allocation go?; How are benefits beyond water savings tracked?
> - **Chapter 3 · Community:** Domestic-well impacts are not reported by community; Help arrives after the well fails; Community benefit has no unit; A board seat is not decision authority; Language access is uneven; Water-quality thresholds cover few constituents; Accounting platforms are built for growers

### OV-GAPS-CAPTION `[caption]` ‹= six›
The `{{< var active_basins_word >}}` document sets are not equally complete. Across this
site, "not found in reviewed documents" means exactly that — never that a
practice does not exist.

## Study area

### OV-MAP-EYEBROW `[eyebrow]`
Study area

### OV-MAP-LEDE `[lede]` ‹= "Merced, East Turlock, Salinas Valley, Kaweah, Colusa and Yolo"›
`{{< var basin_list >}}`: `{{< var active_basins_word >}}` subbasins across the Sacramento
Valley, San Joaquin Valley and Central Coast. Select a subbasin for its agencies
and setting.

> A compact version of the Study Area map sits here; clicking a subbasin opens
> the full map page on it.

### OV-MAP-BTN `[button]`
[Open the full map →](map.html)

## Analysis Pipeline

### OV-PIPELINE-EYEBROW `[eyebrow]`
Analysis Pipeline

### OV-PIPELINE-BAND-LABELS `[card]`
- **Band 1 label:** Information Sources
- **Band 2 label:** Information Extraction
- **Band 3 label:** Synthesis

### OV-PIPELINE-DESC `[figure-desc]`
Workflow diagram in three labelled bands. Information Sources: an academic
literature review and a review of basin policy and planning documents feed the
analysis; a third source, GSA board meetings, is registered but not yet
reviewed. Information Extraction: structured finding extraction records each
finding with its document, section, quotation, and source location, applying the
same outline of questions to every subbasin; findings are then classified and
their quotations verified. Synthesis:
the coded findings are compared across basins and turned into implications for
the groundwater accounting platform and for DWR.

### OV-PIPELINE-NODES `[card]`
- **Academic literature** — Methods demonstrated in the published literature
- **Policy & planning documents** — Plans, amendments, rules, evaluations,
  annual reports, program instruments, comments
- **GSA board meetings** — Registered as a future source. Not yet reviewed —
  contributes nothing to this site.
- **Structured finding extraction** — Each finding is recorded with its document,
  section, direct quotation, and source location. The same chapter, section and
  question outline is applied to every subbasin, so adding a subbasin means
  answering the same questions again, not redesigning the analysis.
- **Classification** — Positive, absence, or ambiguous; relevance to the
  accounting platform and to DWR recommendations
- **Quote verification** — Quotations checked against the source document
- **Cross-basin comparison** — The same question asked of each subbasin,
  compared answer by answer
- **Platform and policy implications** — What the pattern implies for a
  groundwater accounting platform and for DWR guidance

## Go deeper

### OV-GODEEPER-EYEBROW `[eyebrow]`
Go deeper

### OV-GODEEPER-BODY `[body]` ‹= 687 / 61›
Each chapter leads with its key gaps, then compares the subbasins topic by
topic. The underlying evidence — all `{{< var findings_total >}}` findings and
`{{< var literature_total >}}` papers — is searchable directly, each with its
direct quotation and source location attached.

### OV-GODEEPER-BTN-1 `[button]`
[Explore the findings database →](findings.html)

### OV-GODEEPER-BTN-2 `[button]`
[Methods and limitations →](methods.html)

---

# 3 · Interconnected Surface Water page (`isw.qmd`)

> **Chapter template (2026-10-28).** All three chapters follow the same order:
>
> | # | Section | What it holds |
> |---|---|---|
> | S1 | Chapter kicker + question | Intro prose + photo + chapter icon |
> | S2 | Core graphic | ISW: the accounting chain · MLRP: co-benefits matrix · Community: equity triad + threshold chain |
> | S3 | **Key gaps** | From `config/key_gaps.yml` |
> | S4 | **Across the six subbasins** | From the synthesis .docx |
> | S5 | Evidence call-to-action | One line + button |

### ISW-TITLE `[title]`
Interconnected Surface Water

### ISW-SEO-DESC `[body]`
How information moves from pumping, through hydrologic response and modelling,
to a sustainability threshold and a management decision — compared across six
California subbasins.

## S1 · Intro

### ISW-EYEBROW `[eyebrow]`
Chapter 1 · Interconnected Surface Water

### ISW-CHAPTER-TITLE `[h1]`
How does a pumping impact become a management decision?

### ISW-INTRO-1 `[body]`
Pumping groundwater near a stream depletes it — by drawing surface water into the
aquifer or by intercepting groundwater that would have fed the stream. The effect
is lagged and depends on aquifer properties that are usually inferred rather than
observed, which makes interconnected surface water (ISW) one of the hardest
quantities to account for under SGMA.

### ISW-INTRO-2 `[body]` ‹= six›
All `{{< var active_basins_word >}}` subbasins run a numerical groundwater–surface
water model, and none uses model output directly as its compliance measure.
Compliance runs instead on groundwater levels or streamflow at monitoring sites —
a proxy for the depletion itself.

### ISW-PHOTO-ALT `[alt]`
Aerial view of a wide, braided river channel winding through an irrigated valley
at dawn.

## S2 · The accounting chain  *(sticky figure + scrolling steps)*

### ISW-DIAGRAM-EYEBROW `[eyebrow]`
The accounting chain

### ISW-DIAGRAM-LEDE `[lede]`
Seven steps connect a pumping well to a management decision. The chain holds
through modelling — and breaks where compliance switches to a proxy.

### ISW-DIAGRAM-DESC `[figure-desc]`
A shallow cutaway of a stream and the ground beneath it. A thick band of
vegetation sits over a thicker band of brown sediment; below them is one
continuous saturated aquifer. The boundary between the brown sediment and the
blue aquifer is the water table. A broad, shallow stream sits in a low bowl on
the left, and the water table meets it, so shallow groundwater and the stream are
one connected system. A monitoring well stands beside the stream; a deeper
pumping well stands away from it. Pumping pulls the water table down into a cone
of depression and reduces the groundwater that would otherwise reach the stream;
the gap from the pre-pumping water table is the stream depletion attributable to
pumping. A model can estimate that depletion, but the compliance test runs
instead on a groundwater level at the monitoring well — a proxy — checked against
a threshold. That substitution is where the chain breaks.

### ISW-DIAGRAM-FIG-TITLE `[figure-desc]`
Cutaway of pumping, the water table, and stream depletion

### ISW-DIAGRAM-SVG-LABELS `[card]`
> Short labels drawn directly on the diagram.
- Surface water
- Water table
- Saturated aquifer
- Pumping well
- Monitoring well
- pumping-attributable depletion
- weak feedback

### ISW-RAIL-PHASE-LABELS `[card]`
- Physical response
- Accounting chain

### ISW-RAIL-01 `[card]`
- **Title:** Pumping
- **Body:** Wells pump at different depths. Models see averaged demand spread
  across grid cells, not individual wells.

### ISW-RAIL-02 `[card]`
- **Title:** Hydrologic response
- **Body:** The water table falls and less groundwater reaches the stream —
  lagged, attenuated, and mixed with every other driver of streamflow.

### ISW-RAIL-03 `[card]`
- **Title:** Measurement & model
- **Body:** Every basin runs a numerical model. Three report a
  pumping-attributable estimate; three report net stream–aquifer exchange from
  all causes and call it depletion.

### ISW-RAIL-04 `[card]`
- **Title:** Attribution
- **Body:** Runs with and without pumping isolate pumping's share — at basin,
  reach or zone scale. No basin attributes depletion to individual wells.

### ISW-RAIL-BREAK `[card]`
- **Title:** The chain breaks
- **Body:** Modelled depletion stops here. Compliance switches to a
  groundwater-level or streamflow proxy, and no basin sets a threshold on a
  depletion volume.

### ISW-RAIL-05 `[card]`
- **Title:** Sustainability threshold
- **Body:** Five basins set ISW thresholds on groundwater elevations, mostly
  anchored to a recent drought; Kaweah sets a flow criterion on one reach.

### ISW-RAIL-06 `[card]`
- **Title:** Accounting & compliance
- **Body:** The compliance test runs on that proxy. By the agencies' own account,
  it cannot separate a pumping effect from a dry year or reservoir operations.

### ISW-RAIL-07 `[card]`
- **Title:** Management response
- **Body:** Where undesirable results were declared — East Turlock and Salinas
  Valley — no management consequence followed. The loop back to pumping stays
  weak.

## Key gaps

### ISW-GAPS-EYEBROW `[eyebrow]`
Key gaps

### ISW-GAPS-LEDE `[lede]`
Where the reviewed plans, the literature, and the accounting fall short of one
another — the central takeaways of this chapter.

> Each gap shows a big number, the issue type, its DWR category tags, the body,
> and two links: **Compare across subbasins** (opens the matching topic below)
> and **See the coded evidence** (filtered Findings Explorer). A sidebar index of
> gap titles follows the reader on desktop.

### ISW-GAP-1 `[card]` ‹config-routed: key_gaps.yml › isw-levels-stand-in›
- **Title:** Groundwater levels stand in for modeled depletion
- **Issue type:** Modeling capacity
- **DWR categories:** Data needs, Best management practices
- **Body:**
  Numerical models are the gold standard for assessing streamflow depletion,
  and most of the GSAs analyzed use them to describe how much water moves
  between streams and aquifers. Compliance is measured differently: most
  basins track streamflow depletion with groundwater levels or streamflow
  alone, and Kaweah pairs groundwater levels with an analytical model. The
  plans give their reasons for using groundwater levels in place of modeled
  depletion — models not yet calibrated on specific streams, gage uncertainty,
  models too coarse to detect the expected changes, and the cost of updating
  models every year. Colusa's model memo recommends calibrating the
  groundwater-level proxy at the five-year update. The literature points to
  deriving per-well depletion factors that are then applied to reported
  pumping.

### ISW-GAP-2 `[card]` ‹config-routed: key_gaps.yml › isw-per-well›
- **Title:** Attributing depletion to individual wells
- **Issue type:** Granularity
- **DWR categories:** Data needs, Tool development opportunity
- **Body:**
  GSPs outline depletion attribution at the reach or zone scale, not for
  individual wells. Some identify the missing input as exact well locations
  and screen depths; basins either remedy it through a voluntary well registry
  or note the missing depth records. The literature has introduced methods
  that attribute depletion to specific wells, though they tend to
  underestimate depletion — and using them would require well-level inputs
  that may not currently be available.

### ISW-GAP-3 `[card]` ‹config-routed: key_gaps.yml › isw-depths›
- **Title:** Monitoring wells and pumping sit at different depths
- **Issue type:** Missing data
- **DWR categories:** Data needs
- **Body:**
  Four basins monitor ISW mainly with shallow-aquifer wells, while in some
  basins most pumping is deeper. Pumping below an aquitard may affect streams
  more slowly and weakly but can still deplete them over time, and identifying
  that connection takes long-term monitoring at each layer. Whether a well
  reflects stream conditions depends on its groundwater level relative to the
  stream and its distance from it. Basins manage the uncertainty by keeping
  the ISW network to shallow wells, limiting ISW consideration to reaches
  outside a mapped aquitard, or treating the shallow and intermediate zones as
  connected.

### ISW-GAP-4 `[card]` ‹config-routed: key_gaps.yml › isw-coverage›
- **Title:** ISW monitoring coverage depends on grants
- **Issue type:** Insufficient data
- **DWR categories:** Data needs
- **Body:**
  ISW networks can be built from existing wells that meet depth and distance
  criteria, or from wells judged representative of depletion and surrounding
  groundwater levels. Turlock chooses monitoring wells by proximity and
  availability for data collection; Kaweah details efforts to add streamflow
  data and shallow, stream-adjacent monitoring. Some networks rely on very few
  sites — as few as one usable well — some key reaches have few gages, and new
  wells and gages depend on DWR's Technical Support Services, DWR Round 1
  Implementation grants, or additional funds not yet secured.

### ISW-GAP-5 `[card]` ‹config-routed: key_gaps.yml › isw-uncertainty›
- **Title:** Uncertainty in depletion estimates goes unreported
- **Issue type:** Communication
- **DWR categories:** Best management practices
- **Body:**
  The literature treats calculating and communicating uncertainty in depletion
  estimates as crucial, especially when a model is used beyond the conditions
  it was built for. Kaweah reports depletion as a likelihood range and
  publishes model calibration statistics. The other subbasins describe
  uncertainty qualitatively in their GSPs.

### ISW-GAP-6 `[card]` ‹config-routed: key_gaps.yml › isw-baselines›
- **Title:** Thresholds anchored to drought, not ecological flow needs
- **Issue type:** Management
- **DWR categories:** Best management practices
- **Body:**
  SGMA leaves the definition of "significant and unreasonable" depletion to
  each GSA. Where thresholds are set, most are tied to conditions during a
  recent drought. Yolo instead anchors its thresholds to a 1971–2018 record
  that includes periods of disconnection, with the stated goal of maintaining
  conditions experienced in the past and avoiding habitat degradation from the
  current baseline. The California Environmental Flows Framework (CEFF) sets
  flow criteria from ecological needs across five seasonal flow components,
  and has been paired with groundwater sustainability efforts in at least one
  case.

### ISW-GAP-7 `[card]` ‹config-routed: key_gaps.yml › isw-shared-streams›
- **Title:** Depletion on streams shared between subbasins
- **Issue type:** Management
- **DWR categories:** Best management practices, Tool development opportunity
- **Body:**
  Streams often run through more than one subbasin. The Merced River runs
  along the Merced–Turlock boundary, and each subbasin sets different criteria
  for it. Colusa's streams also form or cross GSA and subbasin boundaries.
  Turlock documents the difficulty of separating its pumping effects from its
  neighbors' on shared rivers, and plans to improve its model and reassess its
  ISW criteria and depletion estimates.

## Across the six subbasins

### ISW-COMPARE-EYEBROW `[eyebrow]` ‹= six›
Across the `{{< var active_basins_word >}}` subbasins

### ISW-COMPARE-LEDE `[lede]`
Topic by topic, how each subbasin's documents handle interconnected surface
water — with the cross-basin read first and the citations kept.

> The topics, comparison paragraphs, basin paragraphs, literature notes and
> gaps are rendered from `Phase2_CrossBasin_Synthesis.docx` (Chapter 1). Edit
> the synthesis, then rebuild — they are intentionally not copied here.
> Fixed interface labels: "Across the subbasins", "Gap", "What the literature
> says", "Read more" / "Show less", "Coded findings for this topic →",
> "Scope and document-set caveats".

## Evidence call-to-action

### ISW-CTA-BODY `[body]`
Every claim on this page traces to coded findings with direct quotes and
document locations.

### ISW-CTA-BTN `[button]` ‹= 211›
Explore the `{{< var isw_findings >}}` ISW findings →

---

# 4 · Land Repurposing page (`mlrp.qmd`)

### MLRP-TITLE `[title]`
Land Repurposing

### MLRP-SEO-DESC `[body]`
When farmland is repurposed, what is actually measured, verified, credited, and
monitored — compared across six California subbasins.

## S1 · Intro

### MLRP-EYEBROW `[eyebrow]`
Chapter 2 · Multi-benefit Land Repurposing

### MLRP-CHAPTER-TITLE `[h1]`
When land is repurposed, what is actually measured?

### MLRP-INTRO-1 `[body]`
Multi-benefit land repurposing (MLRP) treats farmland facing reduced water
availability under SGMA as an opportunity to deliver habitat, community and
economic benefits alongside water savings, rather than leaving it to fallow
unplanned. Each of those benefits implies a measurement. This chapter asks which
measurements are made, when, and whether they feed the accounting system.

### MLRP-INTRO-2 `[body]` ‹= six›
Four of the `{{< var active_basins_word >}}` subbasins are covered by a Department of
Conservation MLRP block grant of $8.89–10 million. They differ most in when they
count water — after implementation, before it, or not as a separate figure at
all — and none measures a delivered outcome for the co-benefits it names. Colusa
and Yolo hold no MLRP grant; their repurposing-type activity runs through other
programs and partners.

> Your previous draft of this paragraph (about guidance still being in
> development in Regional Monitoring Plans and Multi-benefit Agricultural Land
> Repurposing Plans) was replaced with the synthesis-based version above. If you
> want parts of it back, edit here.

### MLRP-PHOTO-ALT `[alt]`
Aerial view of a river corridor dividing tilled farmland from green irrigated
fields.

## S2 · Beyond water savings  *(co-benefits matrix — new, replaces the lifecycle chain)*

### MLRP-MATRIX-EYEBROW `[eyebrow]`
Beyond water savings

### MLRP-MATRIX-LEDE `[lede]`
How far does quantification reach for each benefit a repurposing program claims?
The literature quantifies most of them. In the grantee subbasins, most stop at
naming or scoring a benefit before the project is built.

> The matrix itself (benefit names, measurement states, and every cell's
> data / process / metric / caveats) is rendered from
> `MLRP_Benefits_Matrix.xlsx` — edit the workbook. For reference:
> - **States:** Not found · Named · Screened / scored · Practice monitored · Outcome quantified
> - **Columns:** Literature, East Turlock, Kaweah, Merced, Salinas Valley
> - **Rows (each with its own icon):**
>   - Ecological & Physical Benefits: Habitat & Ecosystem Function
>   - Ecological & Physical Benefits: Water Quality
>   - Ecological & Physical Benefits: Air Quality & Dust
>   - Ecological & Physical Benefits: Flood Resilience
>   - Human & Community Benefits: Community Health & Equity
>   - Human & Community Benefits: Drinking-Water Security
>   - Human & Community Benefits: Agricultural & Economic Resilience
>   - Human & Community Benefits: Recreation / Public Access

### MLRP-MATRIX-HINT `[body]`
Select any cell to see how that benefit is quantified, the caveats, and the
evidence behind the rating.

### MLRP-MATRIX-CAPTION `[caption]`
Measurement states are the analyst's ordinal scale — how far quantification
reaches — not a score of program quality. "Not found" means not found in the
reviewed documents, not that the practice does not exist. Colusa and Yolo hold no
MLRP grant and are not rated; their programs are compared under topic 2.10 below.

## Key gaps

### MLRP-GAPS-EYEBROW `[eyebrow]`
Key gaps

### MLRP-GAPS-LEDE `[lede]`
Where repurposing programs, the literature, and the accounting fall short of one
another — the central takeaways of this chapter.

> Each gap shows a big number, the issue type, its DWR category tags, the body,
> and two links: **Compare across subbasins** (opens the matching topic below)
> and **See the coded evidence** (filtered Findings Explorer). A sidebar index of
> gap titles follows the reader on desktop.

### MLRP-GAP-1 `[card]` ‹config-routed: key_gaps.yml › mlrp-savings-math›
- **Title:** How is the water-savings math carried out?
- **Issue type:** Water savings calculation
- **DWR categories:** Data needs, Best management practices, Tool development opportunity
- **Body:**
  Basins handle water savings from land repurposing differently. Merced
  monitors repurposing agreements quarterly and reports approximate
  consumptive-use reductions — but found that some fallowed and transitioning
  land kept transpiring from residual soil moisture and vegetation, so OpenET-
  based reductions came in lower than expected. Turlock designates repurposed
  land as Project Areas that are excluded from consumptive-use and ET tracking
  altogether. Kaweah publishes no savings estimate for its MLRP projects, and
  handles fallowed fields differently in each GSA: MKGSA replaces a fallowed
  field's measured ET with 80% of precipitation, so net consumptive use is
  zero and the field's full allocation can be used elsewhere or banked; GKGSA
  does not debit verified fallowed land; EKGSA credits back excess ET. Salinas
  Valley estimates fallowing savings in advance, from average crop and cover-
  crop water use, for planning scenarios.

### MLRP-GAP-2 `[card]` ‹config-routed: key_gaps.yml › mlrp-allocations›
- **Title:** Where does a repurposed parcel's allocation go?
- **Issue type:** Transferred allocations
- **DWR categories:** Best management practices, Tool development opportunity
- **Body:**
  When a parcel enrolls in land repurposing, what happens to its pumping
  allocation? GSAs answer according to their basin's circumstances. Turlock
  temporarily rescinds the allocation while a landowner is enrolled in MLRP.
  Merced lets landowners choose, at application, whether to forfeit their
  groundwater allocation and any credits — and under its GSP, allocations that
  are not forfeited can be transferred, combined across parcels, and carried
  over to future years.
- **Open questions:**
  - Do enrolled parcels relinquish or retire their transitional water — and
  what about the sustainable-yield allocation?
  - Are landowners free to use those allocations elsewhere or transfer them to
  other properties?
  - If pumping rights are retired for the benefit of the basin, are landowners
  compensated for them explicitly, or does the incentive payment cover the
  value of relinquished credits?

### MLRP-GAP-3 `[card]` ‹config-routed: key_gaps.yml › mlrp-beyond-water›
- **Title:** How are benefits beyond water savings tracked?
- **Issue type:** Non-water benefits
- **DWR categories:** Data needs, Best management practices
- **Body:**
  The literature offers ways to measure groundwater benefits beyond water:
  ecosystem services of groundwater-dependent ecosystems, groundwater targets
  that support ecosystems, well-failure impacts of different management
  regimes, and the water-quality and economic effects of retiring and
  repurposing land in buffers around disadvantaged communities. These methods
  may not fit neatly into GSA accounting systems. In practice, Merced scores
  regional ecological benefits and proximity to disadvantaged communities at
  application; Turlock prices MLRP practices differently according to their
  anticipated benefits; and Salinas presented a literature-based method (Rohde
  et al.) for identifying and monitoring GDEs, paired with CRAM field
  assessment — while recognizing that these methods cannot causally link
  groundwater management to GDE benefit.
- **Sub-gap — Dust:**
  GSA documents and the literature both recognize dust as a problem of land
  retirement, and repurposing as a way to mitigate it. Across basins, dust is
  named but not measured, treated as a landowner liability, named as an
  unmeasured co-benefit, or not mentioned at all. The literature is light here
  too: recent work quantifies fallowed-land dust risk regionally but stops
  short of a per-parcel method tied to repurposing.
- **Sub-gap — Community benefit measurement:**
  The literature supplies methods ranging from overlays that attribute
  recharge benefits to specific communities to groundwater-level conversions
  that count domestic-well failures prevented. In practice, Merced screens by
  a fixed proximity buffer with no scoring behind it; Turlock developed a
  quantified buffer standard for schools that never reached its application,
  implementation standards or monitoring plan; Salinas uses a qualitative
  siting consideration around water quality and drinking-water-well access.
- **Sub-gap — Monitoring vs. measurement:**
  The literature's own MLRP tools are prospective — they describe projected
  outcomes rather than verifying delivered ones. Of the documents analyzed,
  Turlock's is the one real monitoring architecture, and it confirms only that
  a project was built and persists, not how much benefit it produced.

## Across the six subbasins

### MLRP-COMPARE-EYEBROW `[eyebrow]` ‹= six›
Across the `{{< var active_basins_word >}}` subbasins

### MLRP-COMPARE-LEDE `[lede]`
Topic by topic, how each subbasin finances, verifies, credits and monitors land
repurposing — with the cross-basin read first and the citations kept.

> The topics, comparison paragraphs, basin paragraphs, literature notes and
> gaps are rendered from `Phase2_CrossBasin_Synthesis.docx` (Chapter 2). Edit
> the synthesis, then rebuild — they are intentionally not copied here.
> Fixed interface labels: "Across the subbasins", "Gap", "What the literature
> says", "Read more" / "Show less", "Coded findings for this topic →",
> "Scope and document-set caveats".

## Evidence call-to-action

### MLRP-CTA-BODY `[body]`
Every claim on this page traces to coded findings with direct quotes and
document locations.

### MLRP-CTA-BTN `[button]` ‹= 233›
Explore the `{{< var mlrp_findings >}}` land repurposing findings →

---

# 5 · Community page (`community.qmd`)

### COM-TITLE `[title]`
Community

### COM-SEO-DESC `[body]`
Representative, procedural and distributional equity in groundwater governance,
and how a threshold becomes a household consequence — compared across six
California subbasins.

## S1 · Intro

### COM-EYEBROW `[eyebrow]`
Chapter 3 · Community Considerations

### COM-CHAPTER-TITLE `[h1]`
Who is represented, who can participate, and who bears the consequences?

### COM-INTRO-1 `[body]`
These are three different questions, and a groundwater agency can answer them
independently of one another. Treating community equity as a single variable
hides exactly the differences that matter for how an accounting platform should
be designed.

### COM-INTRO-2 `[body]` ‹= six›
Across the `{{< var active_basins_word >}}` subbasins, representative and procedural
equity vary independently. Distributional equity — which residents bear
dewatering risk — is the least reported, and not for want of data: every basin
holds the well-completion records, published thresholds and community boundaries
the analysis would need.

### COM-PHOTO-ALT `[alt]`
A farmworker in a wide-brimmed hat bent over inspecting rows of a green field
crop.

## S2 · Three kinds of equity + the threshold chain

### COM-TRIAD-EYEBROW `[eyebrow]` *(new)*
Three kinds of equity

### COM-TRIAD-LEDE `[lede]` *(new)*
Representation, procedure and distribution reinforce each other but do not
substitute for one another — and the reviewed plans address them very unevenly.

### COM-TRIAD-DESC `[figure-desc]`
Three dimensions of equity. Representative equity asks who holds a seat and a
vote. Procedural equity asks who can participate, appeal, understand and
influence a decision. Distributional equity asks who bears the benefits, burdens
and consequences. Across the reviewed subbasins the first two vary independently
and the third is the least reported.

### COM-TRIAD-REPRESENTATIVE `[card]`
- **Title:** Representative
- **Question:** Who has a seat, and a vote?
- **Body:** Designated seats take three forms: a community category, agencies
  that serve communities, and private pumpers. In Salinas Valley a
  disadvantaged-community seat sits beside a supermajority rule that lets
  agricultural directors block fees and pumping limits.

### COM-TRIAD-PROCEDURAL `[card]`
- **Title:** Procedural
- **Question:** Who can participate, appeal, and understand?
- **Body:** Standing, fees, appeal windows, stated reasons and language access
  differ even between GSAs sharing one plan. Every technique the literature
  recommends appears somewhere; no reviewed document describes compensating
  participants.

### COM-TRIAD-DISTRIBUTIONAL `[card]`
- **Title:** Distributional
- **Question:** Who bears the benefits and the burdens?
- **Body:** Which households sit above a threshold that would dry their well. The
  literature calls this the most computable of the three; no basin reports it by
  community.

### COM-HOUSEHOLD-H3 `[h3]` *(was COM-HOUSEHOLD-H2)*
From a threshold to a household

### COM-HOUSEHOLD-DESC `[figure-desc]`
A five-stage chain from a groundwater threshold to a household consequence: the
adopted threshold, the water level it permits, the depth of a domestic well, the
expected household consequence, and the mitigation response. Exposure counts
exist in three basins but none is reported by community, and most mitigation acts
only after a household has lost water.

### COM-HOUSEHOLD-01 `[card]`
- **Label:** Groundwater threshold
- **Note:** An adopted elevation below which an undesirable result is declared.

### COM-HOUSEHOLD-02 `[card]`
- **Label:** Water level permitted
- **Note:** The decline the threshold allows before anything is triggered.

### COM-HOUSEHOLD-03 `[card]`
- **Label:** Well depth & vulnerability
- **Note:** Every basin's domestic-well data traces to state well-completion
  records — often missing screen depth.

### COM-HOUSEHOLD-04 `[card]` *(dashed — the gap)*
- **Label:** Expected household consequence
- **Note:** Exposure counts exist in Colusa, Kaweah and (from advocates) East
  Turlock. None is reported by community.

### COM-HOUSEHOLD-05 `[card]`
- **Label:** Mitigation response
- **Note:** Most programs act after a household has lost water; Kaweah plans
  advance notice to well owners.

### COM-HOUSEHOLD-CAPTION `[caption]`
Stage 4 is arithmetic over data every basin already holds. Skipping it keeps
mitigation reactive rather than prospective.

## Key gaps

### COM-GAPS-EYEBROW `[eyebrow]`
Key gaps

### COM-GAPS-LEDE `[lede]`
Where community protections, the literature, and the accounting fall short of
one another — the central takeaways of this chapter.

> Each gap shows a big number, the issue type, its DWR category tags, the body,
> and two links: **Compare across subbasins** (opens the matching topic below)
> and **See the coded evidence** (filtered Findings Explorer). A sidebar index of
> gap titles follows the reader on desktop.

### COM-GAP-1 `[card]` ‹config-routed: key_gaps.yml › comm-domestic-wells›
- **Title:** Domestic-well impacts are not reported by community
- **Issue type:** Management and missing data
- **DWR categories:** Data needs, Best management practices
- **Body:**
  The literature finds that domestic wells inside disadvantaged communities
  are less likely than wells elsewhere to be protected by local minimum
  thresholds, and that thousands of domestic and public supply wells could
  still go dry even if current sustainability criteria are met. Some basins
  estimate domestic-well exposure — Colusa counts wells above candidate
  thresholds — but in Colusa about half of the underlying well records lack
  screen depth, and many locations are approximate.

### COM-GAP-2 `[card]` ‹config-routed: key_gaps.yml › comm-advance-notice›
- **Title:** Help arrives after the well fails
- **Issue type:** Procedural · platform opportunity
- **DWR categories:** Tool development opportunity
- **Body:**
  Most dry-well programs reviewed provide support after a household loses
  water. MKGSA plans to notify well owners as conditions approach levels that
  could affect their wells. Those notices depend on a voluntary well registry;
  the GSAs expect some owners to hesitate over privacy and property values,
  and plan to build trust through communication with local communities.
  Eligibility for support also depends on linking a well problem to
  groundwater management.

### COM-GAP-3 `[card]` ‹config-routed: key_gaps.yml › comm-benefit-unit›
- **Title:** Community benefit has no unit
- **Issue type:** Best practice
- **DWR categories:** Best management practices
- **Body:**
  Turlock's GSP records community benefit within MLRP management actions as an
  overlap with benefits to sustainability indicators, while also naming
  recreation and public health. Yolo uses yes-or-no flags in its proposed
  management actions table to identify projects that benefit disadvantaged
  communities. The documents define no unit for these fields, so benefits are
  not yet tracked or compared across projects, and it is not yet clear whether
  a link between community benefit and groundwater accounting is feasible.

### COM-GAP-4 `[card]` ‹config-routed: key_gaps.yml › comm-representation›
- **Title:** A board seat is not decision authority
- **Issue type:** Management · best practice
- **DWR categories:** Best management practices
- **Body:**
  The literature finds that formal board representation predicts equity-
  related plan content better than outreach does. Plans describe who holds
  board seats and which committees advise the boards, and Yolo specifically
  describes the seats tied to disadvantaged communities. The plans say less
  about how seats and voting rules shape accounting decisions such as fees and
  pumping limits. In Salinas Valley, those two decisions require a
  supermajority that includes three of four agricultural representatives.

### COM-GAP-5 `[card]` ‹config-routed: key_gaps.yml › comm-language›
- **Title:** Language access is uneven
- **Issue type:** Best practice · tool opportunity
- **DWR categories:** Best management practices, Tool development opportunity
- **Body:**
  Turlock introduced Spanish-language access for video-based SGMA
  communication, fact sheets, and flyers promoting the Water Leadership
  Institute in partnership with EDF, and offered translation on request for
  Technical Advisory Committee meetings. MKGSA's mitigation plan includes a
  stakeholder outreach plan with at least one workshop in an underrepresented
  community, in English and Spanish.

### COM-GAP-6 `[card]` ‹config-routed: key_gaps.yml › comm-water-quality›
- **Title:** Water-quality thresholds cover few constituents
- **Issue type:** Best practice and missing data
- **DWR categories:** Data needs, Best management practices
- **Body:**
  Basins differ in which constituents carry water-quality thresholds. Merced
  focuses solely on salinity, Colusa on electrical conductivity, and Turlock
  on total dissolved solids. Salinas Valley reports constituents that exceed a
  regulatory standard, relying on the State's Title 22 drinking-water
  standards. Constituents requested by commenters, such as PFAS, were not
  adopted for lack of historical data and drinking-water standards. In East
  Turlock, expanded domestic-well testing runs through the State Water Board's
  SAFER program.

### COM-GAP-7 `[card]` ‹config-routed: key_gaps.yml › comm-facing-info›
- **Title:** Accounting platforms are built for growers
- **Issue type:** Communication
- **DWR categories:** Best management practices, Tool development opportunity
- **Body:**
  Research on decision-driven data systems finds that different users need
  data in different formats, and stresses engaging decision stakeholders who
  may not have deep technical expertise; other work shows community knowledge
  can fill data gaps and build capacity for local policy decisions. The
  accounting platforms reviewed are built for landowners and growers.
  Community-facing products appear separately, such as Kaweah's seasonal
  groundwater-quality report and Salinas Valley's story map. Many community-
  facing resources exist — the Drinking Water Tool, CalEnviroScreen — but the
  plans do not yet point residents to them. In Salinas, the Castroville
  Community Services District is quoted asking for more outreach and
  education, specifically about seawater intrusion.

## Across the six subbasins

### COM-COMPARE-EYEBROW `[eyebrow]` ‹= six›
Across the `{{< var active_basins_word >}}` subbasins

### COM-COMPARE-LEDE `[lede]`
Topic by topic, how each subbasin handles representation, engagement, domestic
wells, water quality and community-facing data — with the cross-basin read first
and the citations kept.

> The topics, comparison paragraphs, basin paragraphs, literature notes and
> gaps are rendered from `Phase2_CrossBasin_Synthesis.docx` (Chapter 3). Edit
> the synthesis, then rebuild — they are intentionally not copied here.
> Fixed interface labels: "Across the subbasins", "Gap", "What the literature
> says", "Read more" / "Show less", "Coded findings for this topic →",
> "Scope and document-set caveats".

## Evidence call-to-action

### COM-CTA-BODY `[body]`
Every claim on this page traces to coded findings with direct quotes and
document locations.

### COM-CTA-BTN `[button]` ‹= 243›
Explore the `{{< var community_findings >}}` community findings →

---

# 5b · Map page (`map.qmd`)  *(rebuilt 2026-10-28 — interactive Leaflet map)*

The map shows the six subbasins (olive = inside an MLRP block-grant region,
brown = no grant; dashed = other subbasins in Salinas Valley's grant region),
GSA boundaries for the selected subbasin, labelled major rivers, and a simple
terrain basemap. Selecting a subbasin opens its profile in the side panel.

### MAP-TITLE `[title]`
Study Area Map

### MAP-SEO-DESC `[body]`
The six analysed California groundwater subbasins, their GSAs, major rivers, and
MLRP block-grant regions.

### MAP-H1 `[h1]`
Study area

### MAP-LEDE `[lede]` ‹= "Merced, East Turlock, Salinas Valley, Kaweah, Colusa and Yolo"›
`{{< var basin_list >}}` — `{{< var active_basins_word >}}` subbasins chosen for contrast
across the Sacramento Valley, San Joaquin Valley and Central Coast. Olive marks
subbasins inside a Department of Conservation MLRP block-grant region. Select a
subbasin for its agencies, setting and the sustainability indicators most
prominent in the record.

### MAP-CAPTION `[caption]`
Boundaries: DWR Bulletin 118 subbasins and SGMA Portal GSA boundaries. Rivers:
USGS National Hydrography Dataset. Geometry is generalised for display. Profile
facts cite the cross-basin synthesis or the public source linked beside them;
"indicators in focus" summarise the reviewed record and are not an official DWR
designation.

### MAP-LEGEND `[card]`
- MLRP block grant
- No MLRP block grant
- Same grant region, not analysed
- River

### MAP-PANEL-INTRO `[body]`
- **Heading:** Select a subbasin
- **Body:** Choose a subbasin on the map or below to see its agencies, setting,
  and the sustainability indicators most prominent in the record.

### MAP-PANEL-LABELS `[card]`
- ← All subbasins
- GSAs in this analysis
- Also registered with DWR here: …
- Sustainability indicators in focus
- Setting · Climate · Agriculture & land use · Communities
- `‹n›` findings from `‹subbasin›` →

## Subbasin profiles ‹config-routed›

> **Every fact needs a source.** Add the source (URL or document) next to any
> fact you add; facts without one are not published. Empty fields are hidden on
> the map until filled.

### MAP-PROFILE-MERCED `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Merced Subbasin · San Joaquin Valley
- **Chips:** MLRP block grant · Critically overdrafted
- **GSAs in this analysis:** Merced Subbasin GSA (MSGSA); Merced Irrigation-Urban GSA (MIUGSA); Turner Island Water District GSA-1 (TIWD GSA-1)
- **Sustainability indicators in focus:**
  - **Chronic lowering of groundwater levels** — ISW criteria are carried over
  from the groundwater-level indicator; a pumping-allocation rule adjusts
  automatically on level triggers. *[Synthesis §1.2, §1.8]*
  - **Land subsidence** — The July 2026 Rules tie allocation and well approval
  to pumping above the Corcoran Clay in subsiding zones. *[Synthesis §1.6]*
- **Climate:** *(empty — NEEDS A SOURCED FACT; add one here with its source and I'll route it)*
- **Agriculture & land use:** *(empty — NEEDS A SOURCED FACT; add one here with its source and I'll route it)*
- **Communities:**
  - Disadvantaged-community noticing is delegated to Self-Help Enterprises and
  Leadership Counsel; MIUGSA holds a standing disadvantaged-community advisory
  seat. *[Synthesis §3.1.1, §3.2]*

### MAP-PROFILE-EAST-TURLOCK `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Turlock Subbasin · San Joaquin Valley
- **Chips:** MLRP block grant
- **GSAs in this analysis:** East Turlock Subbasin GSA (ETSGSA); West Turlock Subbasin GSA (WTSGSA)
- **Sustainability indicators in focus:**
  - **Interconnected surface water** — An undesirable result was declared on
  two of three rivers in WY 2025. *[Synthesis §1.8]*
  - **Chronic lowering of groundwater levels** — 2027 interim milestones were
  set below minimum thresholds because long-term declines were expected to
  continue. *[Synthesis §1.8]*
- **Setting:**
  - West Turlock GSA covers about 60% of the subbasin and East Turlock GSA
  about 40%; the two wrote one GSP. *[Turlock Subbasin groundwater fact
  sheet]*
- **Climate:** *(empty — NEEDS A SOURCED FACT; add one here with its source and I'll route it)*
- **Agriculture & land use:**
  - Cover cropping is the largest demand-reduction activity in East Turlock by
  acreage — roughly 25,000 acres in WY 2025. *[Synthesis §2.10]*
- **Communities:**
  - Advocates' analysis of the GSP's own thresholds found 5.4% of evaluable
  domestic wells impacted. *[Synthesis §3.1.4]*

### MAP-PROFILE-SALINAS-VALLEY `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Salinas Valley — 180/400-Foot Aquifer Subbasin · Central Coast
- **Chips:** MLRP block grant · Critically overdrafted
- **Grant note:** Grant held by the Greater Monterey County IRWM Group, covering the 180/400, Eastside and Langley subbasins.
- **GSAs in this analysis:** Salinas Valley Basin GSA (SVBGSA); Marina Coast Water District GSA (MCWD GSA); County of Monterey GSA (County of Monterey GSA)
- **Sustainability indicators in focus:**
  - **Seawater intrusion** — One of Castroville's four supply wells went
  offline in 2021 on chloride from seawater intrusion. *[Synthesis §3.3.2]*
  - **Interconnected surface water** — An undesirable result was declared for
  WY 2022 and attributed to reservoir operations. *[Synthesis §1.8]*
  - **Degraded water quality** — Amendment 1 tabulates about twenty
  constituents against drinking-water and Basin Plan standards. *[Synthesis
  §3.3.2]*
- **Climate:** *(empty — NEEDS A SOURCED FACT; add one here with its source and I'll route it)*
- **Agriculture & land use:**
  - Essentially all pumping is from the 180-Foot principal aquifer, below the
  Salinas Valley Aquitard. *[Synthesis §1.6]*
- **Communities:**
  - Castroville Community Services District appoints the board's
  disadvantaged-community director, and has asked for more outreach on
  seawater intrusion's effects on health, water bills and home values.
  *[Synthesis §3.1.1, §3.1.2]*

### MAP-PROFILE-KAWEAH `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Kaweah Subbasin · San Joaquin Valley
- **Chips:** MLRP block grant · Critically overdrafted
- **GSAs in this analysis:** East Kaweah GSA (EKGSA); Greater Kaweah GSA (GKGSA); Mid-Kaweah GSA (MKGSA)
- **Sustainability indicators in focus:**
  - **Land subsidence** — Subsidence is attributed mainly to the Lower
  Aquifer, below the Corcoran Clay, which sits outside the ISW analysis.
  *[Synthesis §1.6]*
  - **Chronic lowering of groundwater levels** — The State Water Board's 2025
  staff assessment ties overdraft to falling levels, subsidence and wells
  going dry. *[State Water Board, Kaweah staff assessment (Oct 2025)]*
- **Climate:**
  - Rainfall differs by about seven inches a year between the western edge
  near Hanford and the eastern edge near Woodlake. *[Maven's Notebook, Greater
  Kaweah GSA meeting notes (Dec 2023)]*
- **Agriculture & land use:**
  - Irrigated agriculture accounted for more than 94% of groundwater use in
  2020. *[State Water Board, Kaweah staff assessment (Oct 2025)]*
- **Communities:**
  - Projects and mitigation are sited at named disadvantaged communities
  including Seville, Okieville and Cameron Creek Colony. *[Synthesis §3.1.1,
  §3.1.2]*

### MAP-PROFILE-COLUSA `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Colusa Subbasin · Sacramento Valley
- **Chips:** No MLRP block grant
- **GSAs in this analysis:** Colusa Groundwater Authority (CGA); Glenn Groundwater Authority (GGA)
- **Sustainability indicators in focus:**
  - **Land subsidence** — DWR surveys found the greatest land-surface declines
  in the Sacramento Valley near Arbuckle. *[California Natural Resources
  Agency (Jan 2019)]*
  - **Interconnected surface water** — Twelve near-stream wells carry ISW
  thresholds on the Sacramento River, Stony Creek and the Colusa Basin Drain.
  *[Synthesis §1.2, §1.4]*
- **Climate:**
  - Annual precipitation ranges from about 17 to 27 inches, higher to the
  west. *[DWR Bulletin 118, Colusa Subbasin description (2006)]*
- **Agriculture & land use:**
  - The Nature Conservancy's winter flooding of farmland for shorebird habitat
  adds an estimated 5.2 thousand acre-feet a year of net recharge. *[Synthesis
  §2.10]*
- **Communities:**
  - Revised thresholds cut the projected number of impacted domestic wells
  from 589 to 99. *[Synthesis §3.1.4]*

### MAP-PROFILE-YOLO `[card]` ‹config-routed: basin_profiles.yml›
- **Name:** Yolo Subbasin · Sacramento Valley
- **Chips:** No MLRP block grant
- **GSAs in this analysis:** Yolo Subbasin Groundwater Agency (YSGA)
- **Sustainability indicators in focus:**
  - **Degraded water quality** — Total dissolved solids carries a minimum
  threshold, added in response to public comment. *[Synthesis §3.3.2]*
  - **Interconnected surface water** — Seventeen near-stream wells in five ISW
  Management Zones, with thresholds anchored to a 1971–2018 record.
  *[Synthesis §1.2]*
- **Climate:**
  - WY 2023 brought about 30 inches of precipitation, 148% of the historical
  average. *[YSGA Annual Report (2024)]*
- **Agriculture & land use:**
  - About 31,000 acres of managed wetlands are being added to the subbasin
  model; repurposing-type projects are led mostly by community groups, a
  Tribe, districts and the County. *[Synthesis §2.10]*
- **Communities:**
  - Agencies serving three designated disadvantaged communities hold voting
  seats, and the Yocha Dehe Wintun Nation is a voting member; some Dunnigan
  households rely on domestic wells. *[Synthesis §3.1.1]*

---

# 6 · Explore Findings page (`findings.qmd`)

### FIND-TITLE `[title]`
Explore Findings

### FIND-SEO-DESC `[body]`
Search the coded policy and planning findings and the academic literature review
behind the analysis.

### FIND-H1 `[h1]`
Explore Findings

### FIND-TAB-1 `[button]`
Policy & Planning Findings

### FIND-TAB-2 `[button]`
Literature Review

## "About these findings" (policy panel)

### FIND-ABOUT-SUMMARY `[button]`
About these findings

### FIND-ABOUT-POLICY `[body]`
- **Positive finding** — the reviewed documents describe or measure this.
- **Not found in reviewed documents** — the analyst searched and did not find
  this. Not a finding that the practice doesn't exist.
- **Ambiguous** — the reviewed documents are unclear or internally
  inconsistent.
- Findings are numbered by row ID in the coding workbook (`F-165` and so on).
  Source links are published only where the workbook supplies a URL. Quote
  verification has three states: verified, unverified, and not applicable (the
  documented state for an absence finding).

### FIND-EXPLORER-LOADING `[body]`
Loading the findings database…

### FIND-NOSCRIPT-POLICY `[body]`
- **The findings explorer needs JavaScript**
- Filtering and search run entirely in your browser.

## "About this literature" (literature panel)

### FIND-ABOUT-SUMMARY-LIT `[button]`
About this literature

### FIND-ABOUT-LIT `[body]`
- Papers indexed by the method each demonstrates, drawn from three review areas
  with different schemas — a field a sheet never collected reads as such, not as
  an absence.
- One paper reviewed under two areas appears once, with both associations
  preserved.

### FIND-LIT-LOADING `[body]`
Loading the literature database…

### FIND-NOSCRIPT-LIT `[body]`
- **The literature explorer needs JavaScript**
- Filtering and search run entirely in your browser.

> The explorer's filter labels, result-card fields, and badge text are rendered
> by JavaScript (`assets/js/findings.js`, `literature.js`). They are not in this
> deck yet — tell me if you want them added and I'll pull that copy in.

---

# 7 · Methods & Evidence page (`methods.qmd`)

### MTH-TITLE `[title]`
Methods & Evidence

### MTH-SEO-DESC `[body]`
How the analysis was done, what evidence is in scope, what it cannot support,
and the searchable literature database behind it.

### MTH-H1 `[h1]`
Methods & Evidence

### MTH-INTRO `[body]` ‹= 69 / 6 / 61 / 687›
> Rendered as an H2 lede on the page.
**How this was done, and what it can and cannot support** — A desktop analysis
of `{{< var documents_total >}}` planning and policy documents across
`{{< var active_basins >}}` subbasins, read alongside
`{{< var literature_total >}}` academic papers, and coded into
`{{< var findings_total >}}` structured findings.

### MTH-TAB-1 `[button]`
Methods

### MTH-TAB-2 `[button]`
Evidence streams

### MTH-TAB-3 `[button]`
Limitations

### MTH-TAB-4 `[button]`
Credits & role

### MTH-TAB-5 `[button]`
Full report

## Tab: Methods

### MTH-METHODS-RQ-H3 `[h3]`
The research question

### MTH-METHODS-RQ-BODY `[body]`
Under SGMA an agency must define what unsustainable looks like, measure whether
it is happening, and act when it is. This analysis asks a narrower question of
each step: **which number actually becomes the quantity a decision is made on**,
and what happens to the more sophisticated numbers that do not.

### MTH-METHODS-WHY-H3 `[h3]`
Why these subbasins

### MTH-METHODS-WHY-BODY-1 `[body]` ‹= "Merced, East Turlock, Salinas Valley, Kaweah, Colusa and Yolo"›
`{{< var basin_list >}}` were selected for contrast rather than representativeness.
They span the Sacramento Valley, the San Joaquin Valley and the Central Coast, and
differ in plan structure — one joint GSP (Merced, Turlock, Colusa), three GSPs
under a coordination agreement (Kaweah), one GSP adopted by partner agencies
(Salinas Valley), and a single GSA (Yolo). Four are covered by a Department of
Conservation MLRP block grant; Colusa and Yolo are not. The differences are what
make the comparison informative.

### MTH-METHODS-DOCS-H3 `[h3]`
Document collection and desktop review

### MTH-METHODS-DOCS-BODY `[body]`
For each subbasin the review assembled the adopted Groundwater Sustainability
Plan and any amendments, the most recent periodic evaluation and annual report,
GSA rules and regulations, land repurposing program instruments, technical
memoranda and ISW studies, relevant GSP appendices, agency correspondence, and
public comment letters.

### MTH-METHODS-LIT-H3 `[h3]`
Literature review

### MTH-METHODS-LIT-BODY `[body]` ‹= 61›
`{{< var literature_total >}}` papers were reviewed across three topical areas —
groundwater accounting methods, land-use alternatives, and community
considerations. Each was assessed not for its conclusions but for the **method
it demonstrates**: what it measured, at what scale, using what data, and whether
an operational crediting or accounting program was involved.

### MTH-METHODS-CODING-H3 `[h3]`
Coding and classification

### MTH-METHODS-CODING-BODY-1 `[body]`
Each finding was recorded with its subbasin, agency, document, chapter, section,
and the specific question it answers, together with a verbatim quotation and the
section or page it came from. Findings were classified as **positive**,
**absence**, or **ambiguous**, and rated for relevance to a groundwater
accounting platform and to DWR recommendations.

### MTH-METHODS-CODING-BODY-2 `[body]` ‹= 519› *(rewritten 2026-10-28 — please confirm)*
Extraction was AI-assisted: a language model was given the question outline and
the documents, with instructions to answer each question with a direct quotation
and citation. The analyst then checked quotations against the source documents
for every subbasin — `{{< var quotes_verified >}}` are marked verified — and wrote the
synthesis and key gaps from the coded findings. A verified quotation is accurate
to its source; whether it fully answers the question it is attached to was
reviewed but is not guaranteed for every row.

### MTH-METHODS-XBASIN-H3 `[h3]`
Cross-basin comparison

### MTH-METHODS-XBASIN-BODY-1 `[body]`
The same outline of chapters, sections and questions was put to each subbasin's
document set. The cross-basin synthesis then works topic by topic: what the
literature says, what each subbasin's documents say (with document and page
citations), a comparison across subbasins, and the gap the topic surfaces. The
chapter pages present that synthesis directly; the key gaps distil it.

### MTH-METHODS-XBASIN-BODY-2 `[body]`
**No maturity score, traffic light, or ranking is assigned anywhere on this
site.** The one ordinal scale — the land repurposing matrix's measurement states
— describes how far quantification reaches for a benefit, as rated by the
analyst, not how good a program is.

### MTH-METHODS-ABSENCE-H3 `[h3]`
How to read an absence

### MTH-METHODS-ABSENCE-BODY `[body]`
The single most important distinction in this analysis is between *not found in
the reviewed documents* and *does not exist*. An absence finding records the
first. It can arise for at least four different reasons, and the site keeps them
apart:

- the practice is genuinely absent from a document set that is otherwise
  complete;
- the relevant document was not available to review;
- the program exists but has not yet produced results;
- the question was never coded for that basin at all — which is a statement
  about the analysis, not about the basin.

## Tab: Evidence streams

### MTH-STREAMS-H3 `[h3]`
What evidence is actually in scope

### MTH-STREAMS-BODY `[body]` ‹token = 2›
The analysis draws on `{{< var active_streams >}}` active evidence streams. A
third is registered in the site's data model so it can be added later, but
nothing from it has been reviewed.

> The three evidence-stream cards (Policy & Planning Documents / Academic
> Literature / GSA Board Meetings) are **‹config-routed›** — see section 8.

### MTH-STREAMS-WHY-H4 `[h3]`
Why a stream is registered before it is reviewed

### MTH-STREAMS-WHY-BODY `[body]`
The evidence model, the explorer filters, and the citation format are built to
accept a new stream without redesign. Registering a planned stream makes that
capability explicit and auditable — but the site's rule is that a planned stream
contributes **zero** records, appears in no count, and is described only as
planned. Board-meeting evidence, if it is ever added, would also have to remain
distinguishable from adopted plans and rules in every citation: what was said in
a meeting is not what an agency adopted.

## Tab: Limitations

### MTH-LIM-H3 `[h3]`
What this analysis cannot support

### MTH-LIM-1-H4 `[h3]`
The document sets are not equally complete

### MTH-LIM-1-BODY `[body]`
This is the limitation that matters most, because it is the one most easily
misread as a finding. Some absences recorded for one subbasin are gaps in
document *availability* — an MLRP plan, a siting-tool specification, and a
demand-management framework were not available to review. Some absences recorded
for another reflect *architecture that has not yet produced results*: no
projects implemented, a monitoring plan still in draft, a program plan not yet
final.

An absence tested against a rule that is in force is a much stronger finding
than an absence recorded against a program that has not started. The site
preserves that difference; a reader comparing cells across a row should too.

### MTH-LIM-2-H4 `[h3]`
Comparisons rest on different numbers of basins

### MTH-LIM-2-BODY `[body]`
Not every topic applies to every subbasin. Colusa and Yolo hold no MLRP grant, so
most land repurposing topics compare four basins. Several community comparisons
rest on fewer, because the equivalent instruments — a rulebook, a
comment-response matrix, a periodic evaluation — were not available for every
basin. Where a basin is not covered, the site says so rather than treating it as
an absence.

### MTH-LIM-3-H4 `[h3]`
This is a desktop analysis

### MTH-LIM-3-BODY `[body]`
Findings describe what the reviewed documents say. No interviews were conducted,
no agency staff were asked to confirm or correct an interpretation, and no
independent measurement was made. A practice that exists but is not documented
in the reviewed material would appear here as an absence.

### MTH-LIM-4-H4 `[h3]`
The evidence is a point in time

### MTH-LIM-4-BODY `[body]`
Documents were reviewed as they stood in mid-2026. Plans are amended, annual
reports are published, monitoring networks change, and grant programs end —
several of the findings here turn on facts that are explicitly dated.

### MTH-LIM-5-H4 `[h3]`
Spatial data is not part of this analysis

### MTH-LIM-5-BODY `[body]`
No geographic analysis was performed. The map uses public DWR and USGS layers for
orientation only. Land repurposing project locations in particular are
documented inconsistently across the subbasins, which is itself recorded as a
limitation rather than smoothed over.

## Tab: Credits & role

### MTH-CREDITS-ROLE-H3 `[h3]`
Project role

### MTH-CREDITS-ROLE-BODY-1 `[body]`
This site is an independent portfolio adaptation of a landscape analysis
conducted for the California Department of Water Resources Groundwater
Accounting project. The underlying cross-basin synthesis and the coded findings
database are the author's own work within that project.

### MTH-CREDITS-ROLE-BODY-2 `[body]` ‹= 6 / 61 / 687›
The work covered:

- desktop review of Groundwater Sustainability Plans, amendments, periodic
  evaluations, annual reports, GSA rules, land repurposing program instruments,
  technical studies, and public comment letters across
  `{{< var active_basins >}}` subbasins;
- a review of `{{< var literature_total >}}` academic papers across groundwater
  accounting methods, land-use alternatives, and community considerations;
- structured coding and classification of `{{< var findings_total >}}` findings,
  including verbatim quotation capture and verification against source
  documents;
- cross-basin comparison and synthesis;
- identification of implications for a groundwater accounting platform and for
  DWR recommendations;
- design and development of this public interactive adaptation.

### MTH-CREDITS-ATTRIBUTION `[callout]`
- **Label:** Attribution
- **Body:** This is a portfolio project. It is not a DWR publication, does not
  carry DWR branding, and its interpretations are the author's own. Where the
  analysis was conducted as part of a wider project team, the site does not
  claim sole authorship of that project's work.

### MTH-CREDITS-ILLUS-H3 `[h3]`
Illustration credits

### MTH-CREDITS-ILLUS-BODY `[body]`
New diagrams on this site are original responsive web graphics built for this
adaptation.

### MTH-CREDITS-ILLUS-CALLOUT `[callout]`
- **Label:** Reserved for authorized illustrations
- **Body:** Selected graphics from *Well, Well, Well: An Introduction to
  Groundwater Recovery* by Sara Soroka and Travis Rennacker may be reused here
  with permission. **No such illustration is currently in use on this site.**
  When assets are supplied, each will carry a figure-level credit and be listed
  here in the form:
  > Illustration by Sara Soroka. Originally created for *Well, Well, Well: An
  > Introduction to Groundwater Recovery* by Sara Soroka and Travis Rennacker.
  > Used with permission.

### MTH-CREDITS-SOURCES-H3 `[h3]`
Sources and tools

### MTH-CREDITS-SOURCES-BODY `[body]`
The analysis rests on publicly available planning and policy documents published
by the groundwater sustainability agencies named throughout, and on published
academic literature. This site is a static Quarto website; all filtering and
search run in the browser over data processed from the coding workbooks at build
time.

## Tab: Full report

### MTH-REPORT-H3 `[h3]`
The full technical report

### MTH-REPORT-BODY-1 `[body]`
This site is a condensed, visual adaptation. The complete cross-basin synthesis
carries the full argument, every citation, and the per-section literature review
that the chapter pages summarize.

### MTH-REPORT-CALLOUT `[callout]`
- **Label:** Download link pending
- **Body:** The complete technical report will be linked here as a PDF for
  browser readability. (`REPORT_DOWNLOAD_URL` is replaced with the real file
  link at publish time.)

### MTH-REPORT-BODY-2 `[body]`
The coding workbooks behind both databases are not offered as downloads. Their
content is surfaced in full through [Explore Findings](findings.qmd), where every
record keeps its quotation and source location.

---

# 8 · Shared components (‹config-routed›)

Copy in this section is generated from `config/basins.yml`,
`config/evidence_streams.yml`, and `scripts/render_partials.py`. Edit the
wording here; I will route each change to the correct field. **Descriptive
basin facts must stay traceable to the synthesis** — flag any factual change in
ALL CAPS so I can check it against the source.

## Stats strip (`_partials/stats.html`)

### CFG-STAT-1 `[card]` ‹number = 687›
- **Label:** Coded findings
- **Hint:** Across three thematic chapters

### CFG-STAT-2 `[card]` ‹number = 69›
- **Label:** Source documents
- **Hint:** Plans, rules, evaluations, reports and comments

### CFG-STAT-3 `[card]` ‹number = 61›
- **Label:** Papers reviewed
- **Hint:** Assessed for the method each demonstrates

### CFG-STAT-4 `[card]` ‹number = 6›
- **Label:** Subbasins analyzed
- **Hint:** Each with its own document set

## Basin roster (`config/basins.yml`)

> The roster cards are no longer shown on a page (the map profiles replaced
> them), but these fields still feed the findings explorer labels and the
> map panel's name/region/GSA list. **Descriptive facts must stay traceable
> to the synthesis** — flag factual edits in ALL CAPS.

### CFG-BASIN-MERCED `[card]`
- **Name:** Merced Subbasin  ·  **Short name:** Merced  ·  **Region:** San Joaquin Valley
- **GSAs:** Merced Subbasin GSA (MSGSA); Merced Irrigation-Urban GSA (MIUGSA); Turner Island Water District GSA-1 (TIWD GSA-1)
- **ISW model:** MercedWRM — Quasi-3D numerical model on the IWFM 2015
  platform, calibrated against ET, groundwater levels, and streamflow.
- **Groundwater accounting:** Groundwater Accounting Platform — ET data
  source is OpenET.
- **Land repurposing:** MSGSA holds the Department of Conservation block
  grant directly — $8.89M DOC MLRP block grant awarded 16 June 2023 and held
  by MSGSA, alongside a locally funded Proposition 218 Phase 1 Land
  Repurposing Program.
- **Key characteristic:** The one basin that currently produces a measured
  water figure tied to a specific repurposing agreement, using its compliance
  instrument.

### CFG-BASIN-EAST-TURLOCK `[card]`
- **Name:** Turlock Subbasin  ·  **Short name:** East Turlock  ·  **Region:** San Joaquin Valley
- **GSAs:** East Turlock Subbasin GSA (ETSGSA); West Turlock Subbasin GSA (WTSGSA)
- **ISW model:** C2VSimTM — Quasi-3D finite element model on the IWFM 2015
  platform — the same model class as Merced — calibrated October 1991 to
  September 2015.
- **Groundwater accounting:** Groundwater Accounting Platform — ET data
  source is LandIQ, with CalETa for the historical baseline.
- **Land repurposing:** ETSGSA runs the program under a subbasin-wide award
  — ETSGSA applied on behalf of both GSAs; DOC awarded the Subbasin $8.89M.
  Grant closes 31 March 2027.
- **Key characteristic:** Sets an ISW-specific undesirable result for each
  river; declared on two of three rivers in WY 2025 with no management
  consequence.
- **Scope note:** Findings are coded to the East Turlock GSA within the
  Turlock Subbasin. Where a document covers the whole Turlock Subbasin, the
  finding is coded at SUBBASIN level.

### CFG-BASIN-SALINAS-VALLEY `[card]`
- **Name:** Salinas Valley — 180/400-Foot Aquifer Subbasin  ·  **Short name:** Salinas Valley  ·  **Region:** Central Coast
- **GSAs:** Salinas Valley Basin GSA (SVBGSA); Marina Coast Water District GSA (MCWD GSA); County of Monterey GSA (County of Monterey GSA)
- **ISW model:** SVIHM — USGS-owned numerical model built on MODFLOW-OWHM
  v2. Produces a paired-simulation depletion estimate and mapped ISW
  locations, but the compliance criterion runs on shallow-well elevation
  readings rather than model output.
- **Groundwater accounting:** No accounting platform identified in the
  reviewed documents — Recorded as an absence in the reviewed document set,
  not as a statement that none exists.
- **Land repurposing:** MLRP grant held outside the GSA — The Greater
  Monterey County IRWM Group holds a $10M DOC grant covering the 180/400,
  Eastside and Langley subbasins; SVBGSA is a partner. The money buys land
  rather than paying for practices.
- **Key characteristic:** Has commissioned direct field measurement of
  stream-aquifer exchange, and pairs a disadvantaged-community board seat with
  a supermajority rule for fees and pumping limits.

### CFG-BASIN-KAWEAH `[card]`
- **Name:** Kaweah Subbasin  ·  **Short name:** Kaweah  ·  **Region:** San Joaquin Valley
- **GSAs:** East Kaweah GSA (EKGSA); Greater Kaweah GSA (GKGSA); Mid-Kaweah GSA (MKGSA)
- **ISW model:** Kaweah Subbasin Groundwater Flow Model + Hunt analytical
  function — MODFLOW-OWHM v2 calibrated to groundwater elevations only; the
  GSAs state it is not yet calibrated for ISW depletion, so depletion is
  estimated with an analytical stream-depletion function.
- **Groundwater accounting:** Water Dashboard (parcel-level satellite ET
  ledger) — Land IQ ET tracked per parcel per month, with a trading module.
- **Land repurposing:** Subbasin-level award implemented by the three GSAs —
  $10M in MLRP funding according to a Self-Help Enterprises comment reproduced
  in the GSPs; three recharge-basin projects listed in the WY 2025 Annual
  Report.
- **Key characteristic:** The one basin that attaches a likelihood range to
  its depletion estimate, and the one with a water-trading market in
  operation.
- **Scope note:** Three GSAs each filed a separate GSP under one
  Coordination Agreement and a shared ISW technical memorandum. Mid-Kaweah
  reports no interconnected surface water.

### CFG-BASIN-COLUSA `[card]`
- **Name:** Colusa Subbasin  ·  **Short name:** Colusa  ·  **Region:** Sacramento Valley
- **GSAs:** Colusa Groundwater Authority (CGA); Glenn Groundwater Authority (GGA)
- **ISW model:** C2VSimFG-Colusa — Numerical model adapted from DWR's
  C2VSimFG on a monthly timestep; its authors describe it as not yet well
  calibrated and label its ISW conclusions provisional.
- **Groundwater accounting:** Accounting system in procurement — The GSAs
  selected a consultant team in late 2025 to build a subbasin water accounting
  system.
- **Land repurposing:** No MLRP block grant — The main repurposing-type
  activity is The Nature Conservancy's winter flooding of farmland for
  shorebird habitat and recharge.
- **Key characteristic:** Counts domestic wells above candidate thresholds;
  the revised thresholds cut projected impacts from 589 wells to 99.

### CFG-BASIN-YOLO `[card]`
- **Name:** Yolo Subbasin  ·  **Short name:** Yolo  ·  **Region:** Sacramento Valley
- **GSAs:** Yolo Subbasin Groundwater Agency (YSGA)
- **ISW model:** Linked WEAP–MODFLOW — Built from an earlier Yolo County
  IWFM; monthly timestep for WY 1971–2018, calibrated on Putah and Cache
  creeks and the Yolo Bypass.
- **Groundwater accounting:** No allocation or fee system — The documents
  contain no mechanism that distributes pumping limits or costs between
  groups.
- **Land repurposing:** No MLRP block grant — Repurposing-type projects sit
  in the GSP project list, mostly led by community groups, a Tribe, districts
  or the County.
- **Key characteristic:** Anchors ISW thresholds to a 1971–2018 record
  rather than a recent drought, across five ISW Management Zones.

## Evidence-stream cards (`_partials/evidence_streams.html`)

### CFG-STREAM-POLICY `[card]` ‹records = 687›
- **Status pill:** Active
- **Name:** Policy & Planning Documents
- **Description:** Groundwater Sustainability Plans, plan amendments, periodic
  evaluations, annual reports, GSA rules and regulations, land-repurposing
  program instruments, technical memoranda and ISW studies, GSP appendices,
  agency correspondence, and public comment letters.
- **Citation note:** Findings from this stream cite the specific document and
  the section or PDF page recorded by the analyst.

### CFG-STREAM-LITERATURE `[card]` ‹records = 61›
- **Status pill:** Active
- **Name:** Academic Literature
- **Description:** Peer-reviewed and grey-literature studies reviewed across
  three topical areas — groundwater accounting methods, land-use alternatives,
  and community considerations — and assessed for the accounting method each
  demonstrates.
- **Citation note:** Entries carry the full bibliographic citation recorded by
  the analyst.

### CFG-STREAM-MEETINGS `[card]`
- **Status pill:** Not yet reviewed
- **Name:** GSA Board Meetings
- **Description:** A potential future stream of GSA board-meeting evidence. The
  intake workflow is not yet defined and no meeting material has been reviewed.
- **Public disclosure:** Describe only as a planned extension of the evidence
  model. Do not imply any meeting has been reviewed, coded, or verified.

---

# 9 · Maintenance notes (for Claude)

When the site structure changes in a way that adds, removes, moves, or renames
visible text, regenerate this deck:

1. Re-scan `index.qmd`, `isw.qmd`, `mlrp.qmd`, `community.qmd`, `map.qmd`,
   `findings.qmd`, `methods.qmd`, `_quarto.yml`, `config/key_gaps.yml`,
   `config/basin_profiles.yml`, `config/basins.yml`, and `_partials/*.html`.
2. Keep existing entry IDs stable wherever the copy slot still exists, so the
   user's in-flight edits still map cleanly.
3. Add new IDs for new slots; list removed slots in section 10 for one revision
   cycle rather than silently deleting them.
4. Update the "Last synced" date and the page list.
5. Copy still outside the deck, by design: the cross-basin comparison text
   (synthesis .docx), MLRP matrix cells (benefits workbook), explorer filter
   labels and result-card fields (`findings.js`, `literature.js`), and the
   small fixed interface labels in `key-gaps.js`, `synthesis.js`,
   `mlrp-matrix.js` and `study-map.js`.

---

# 10 · Retired entries (removed 2026-10-28)

Kept for one revision cycle so any in-flight edits can be re-homed. Tell me if
something here should come back.

| Entry IDs | Why |
|---|---|
| `OV-RQ-BODY-1…4` | Research pinned scene → one paragraph, `OV-RQ-BODY` |
| `OV-HEADLINES-EYEBROW`, `OV-HEADLINE-01…05`, `OV-HEADLINES-CAPTION` | Replaced by the Overview key-gaps index (`OV-GAPS-*`) |
| `OV-MAP-PLACEHOLDER`, `OV-MAP-CAPTION` | ArcGIS placeholder → compact Leaflet map (`OV-MAP-LEDE`) |
| `ISW-INTRO-3`, `ISW-PHOTO-LABEL` | Intro rewritten for six basins; photo label removed |
| `ISW-KF-*`, `MLRP-KF-*` (incl. `MLRP-KF-REFERENCES`), `COM-KF-*` | Key Findings → Key gaps (`*-GAP-*`) |
| `*-BREAKDOWN-*` | Breakdown by Subbasin → Across the six subbasins (synthesis) |
| `*-CONNECTION-*` | Connection to Accounting placeholder cards removed |
| `*-BEYOND-*`, `*-FURTHER-*` | Draft/placeholder sections removed |
| `MLRP-LIFECYCLE-*`, `MLRP-PHOTO-LABEL` | Lifecycle chain → co-benefits matrix (`MLRP-MATRIX-*`) |
| `MLRP-MAP-*`, `MLRP-STUB-CAPTION` | Geography placeholder removed; the map page covers it |
| `COM-INTRO-CAPTION`, `COM-PHOTO-LABEL`, `COM-TRIAD-H2`, `COM-TRIAD-INTRO`, `COM-TRIAD-CAPTION`, `COM-HOUSEHOLD-EYEBROW`, `COM-HOUSEHOLD-H2`, `COM-HOUSEHOLD-BODY` | Community S2 consolidated under one kicker (`COM-TRIAD-EYEBROW`/`-LEDE`, `COM-HOUSEHOLD-H3`) |
| `COM-TOOLS-*`, `CFG-TOOLS` | Community-tools list removed (its per-tool coverage was checked against three basins only) |
| `MAP-INTRO`, `MAP-PLACEHOLDER`, `MAP-ROSTER-EYEBROW` | Map page rebuilt (`MAP-LEDE`, `MAP-PANEL-*`, `MAP-PROFILE-*`) |
| `MTH-METHODS-WHY-BODY-2`, `CFG-BASIN-PLANNED` | No planned basins remain |
