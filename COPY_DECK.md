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

Copy deck last synced: 2026-09-10 (batch-1 restructure complete — Phases 1–4:
global design system, Overview rework, new Map page, the shared 7-section chapter
template applied to ISW / Land Repurposing / Community, ISW deep edits with the
4 / 4 / 2 "snake" layout, and an accessibility + responsive QA pass). No open
copy changes on my side; the remaining work is the `[NEEDS COPY]` slots for
Jackson. Site pages covered:
`index`, `isw`, `mlrp`, `community`, `map`, `findings`, `methods`, plus
`_quarto.yml` and shared config.

> **Phase 2 note.** All three chapter pages now use the same seven sections
> (see the table at the top of section 3). Existing components were relocated,
> not deleted — the MLRP/Community comparison matrices, the equity triad, the
> threshold→household chain, and the tools list all live inside the new
> sections. `[NEEDS COPY]` marks every placeholder: most Key Findings, the
> Community "Connection to Accounting" body, and all "Further Exploration"
> question sets. ISW's three Key Findings were written from your batch-1 notes.

> **Phase 1 note.** The Overview's Research, Headline Findings (and, coming in
> Phase 2, each chapter's Key Findings) are now **pinned scroll scenes**: the
> section locks to the viewport and each scroll step reveals the next item, with
> the number holding until the next item is in view. Edit the text normally —
> the scene is built from whatever steps are present.

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
> New page, sits between Community and Explore Findings.

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
How three California subbasins measure, account for, and act on interconnected
surface water, land repurposing, and community outcomes under SGMA.

## Hero

### OV-HERO-H1 `[h1]`
Accounting for Groundwater

### OV-HERO-SUB `[h2]`
From measurement to management under SGMA
> Renders as one continuous line under the title (no forced wrap).

### OV-HERO-LEDE `[lede]`
California's groundwater sustainability agencies model stream depletion to local
streams, estimate water saved by retiring farmland, and identify the communities
their decisions affect. This analysis dives in further to investigate how these
ideas are tracked, reported, and routed into management.

## Metrics strip

> *(OV-METRICS-EYEBROW "Research behind the analysis" — removed 2026-09-10.)*
> Each metric card centres the number, with the icon sitting to the left of the
> label beneath it. Card text below is unchanged.

### OV-METRIC-1 `[card]` ‹= 325›
- **Number token:** `{{< var findings_total >}}`
- **Label:** Coded Findings
- **Detail (shown on tap/click):** Findings drawn from the reviewed policy and
  planning documents, coded across interconnected surface water, land
  repurposing, and community considerations.

### OV-METRIC-2 `[card]` ‹= 33›
- **Number token:** `{{< var documents_total >}}`
- **Label:** Policy & Planning Documents
- **Detail:** Groundwater Sustainability Plans, annual reports, rules, program
  instruments, and related materials reviewed across the subbasins.

### OV-METRIC-3 `[card]` ‹= 58›
- **Number token:** `{{< var literature_total >}}`
- **Label:** Literature Sources
- **Detail:** Academic and applied research reviewed to identify accounting
  methods, measurement approaches, and practices that transfer to a groundwater
  accounting platform.

### OV-METRIC-4 `[card]` ‹= 3›
- **Number token:** `{{< var active_basins >}}`
- **Label:** Subbasins Reviewed
- **Detail:** The California groundwater subbasins included in the current
  cross-basin analysis.

## The Research band  *(pinned scroll scene)*

### OV-RQ-EYEBROW `[eyebrow]`
The Research

### OV-RQ-H3 `[h3]`
How do local agencies account for water under land use alternatives, and how do
they involve communities?

### OV-RQ-BODY-1 `[body]` *(scene step 01)*
Under the Sustainable Groundwater Management Act, an agency must define what
unsustainable looks like, measure whether it is happening, and act when it is.
Each of those steps needs a defined method and number. These methods and numbers
do not need to be the same across basins.

### OV-RQ-BODY-2 `[body]` *(scene step 02)*
This analysis starts by combing through the literature to get a sense of what
documented approaches already exist. It gives an idea of the scientific ways in
which depletion of surface water from pumping is quantified, benefits of land
repurposing are evaluated, and community considerations are equitably
incorporated.

### OV-RQ-BODY-3 `[body]` *(scene step 03)*
Then the analysis looks toward policy and planning documents at the local level
to find out whether these approaches are being adopted into management — and if
not, what is happening instead.

### OV-RQ-BODY-4 `[body]` *(scene step 04 — new)*
Comparing and contrasting these findings between the literature and policy, as
well as across groundwater subbasins, sheds light on the current practices and
gaps that exist within groundwater accounting frameworks.

## Three domains

### OV-DOMAINS-EYEBROW `[eyebrow]`
Three domains

> Each card now carries a small line-drawn icon: ISW = a stream rising to the
> right; Land Repurposing = fields beside trees; Community = open cupped hands.
> Same icons appear beside the question on each chapter page.

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
- **Body:** Representation, procedural access, and who bears the consequences —
  three kinds of equity that move independently.
- **Link text:** Read the chapter →

## Headline findings  *(pinned scroll scene)*

### OV-HEADLINES-EYEBROW `[eyebrow]`
Headline findings

> Now a pinned scene sized to roughly match the Three-domains block. The number
> (01–05) is pinned to the left and flips only when the next finding is fully in
> view. Per-item numbers in the list below are the scene step numbers.

### OV-HEADLINE-01 `[card]`
- **Number:** 01
- **Heading:** Measurement is more sophisticated than accounting
- **Body:** All three subbasins run numerical groundwater–surface water models
  of the same generation, and all three produce a pumping-attributable depletion
  figure. In every case the compliance loop closes on a groundwater-level proxy
  instead — not on any measured or modeled depletion quantity. None attaches a
  numeric uncertainty range to an ISW figure.
- **Meta label:** Chapter 1 · Interconnected Surface Water
- **Evidence link:** [See the evidence →](findings.html?chapter=1.%20ISW&section=1.8%20Gaps%20and%20Uncertainty)

### OV-HEADLINE-02 `[card]`
- **Number:** 02
- **Heading:** Verification is the missing middle of land repurposing
- **Body:** The three programs differ less in what they fund than in when they
  count. One measures water use on repurposed parcels after implementation and
  treats the result as enforceable. One estimates savings beforehand and never
  compares the estimate to anything after. One holds its measurement outside the
  accounting system entirely. None runs a paired comparison of expected against
  measured savings on an enrolled parcel.
- **Meta label:** Chapter 2 · Land Repurposing
- **Evidence link:** [See the evidence →](findings.html?chapter=2.%20MLRP&section=2.2%20Verification%20triggers)

### OV-HEADLINE-03 `[card]`
- **Number:** 03
- **Heading:** Allocation rules decide whether a saving stays saved
- **Body:** Changing the land use and changing the entitlement to pump are
  separate design decisions. Across the three programs the entitlement variously
  stays with the landowner and can move, is suspended for the paid term with no
  transfer mechanism, or ceases to exist because the land was bought outright.
  None of the three publishes reporting on the allocation status of repurposed
  parcels, so none could detect movement even where movement is permitted.
- **Meta label:** Chapter 2 · Land Repurposing
- **Evidence link:** [See the evidence →](findings.html?chapter=2.%20MLRP&section=2.3%20Allocation%20and%20Leakage)

### OV-HEADLINE-04 `[card]`
- **Number:** 04
- **Heading:** Community equity is not one variable
- **Body:** Representative, procedural, and distributional equity move
  independently. The subbasin with the strongest formal representation qualifies
  it with a supermajority voting rule; the two without a comparable seat differ
  from each other on fees, standing, and appeal timelines. Distributional
  outcomes are the gap shared by all three — and not for want of data. Every
  basin holds the well records, published thresholds, and community boundaries
  the analysis would need.
- **Meta label:** Chapter 3 · Community
- **Evidence link:** [See the evidence →](findings.html?chapter=3.%20Community%20Considerations&section=3.1.3%20Procedural%20%2F%20Distributional%20%2F%20Representative)

### OV-HEADLINE-05 `[card]`
- **Number:** 05
- **Heading:** The literature–practice gap runs both ways
- **Body:** For several outcomes — per-well depletion attribution, ecological
  co-benefit quantification, domestic-well impact estimation — methods exist in
  the literature and appear nowhere in the reviewed document sets. But not every
  gap is an unused method. For field-scale dust accounting and for a unit of
  community benefit, the literature is empty too: those would have to be built
  rather than adopted.
- **Meta label:** Cross-cutting
- **Evidence link:** [Explore the literature →](findings.html?db=literature)

### OV-HEADLINES-CAPTION `[caption]`
The three document sets are not equally complete — some Salinas Valley absences
are gaps in document availability, some East Turlock absences reflect programs
that have not yet produced results. Across this site, "not found in reviewed
documents" means exactly that, never that a practice does not exist.

## Study area

### OV-MAP-EYEBROW `[eyebrow]`
Study area

> *(OV-MAP-H3 "Where the analysis looks" — removed 2026-09-10.)*

### OV-MAP-PLACEHOLDER `[body]`
> Shown until the ArcGIS embed is added.
The Study Area map is authored in ArcGIS Online and will be embedded here. It
shows the analyzed subbasins, the relevant GSA boundaries, and the major rivers,
with popups linking into the filtered findings explorer.

### OV-MAP-CAPTION `[caption]` ‹token = "Merced, East Turlock and Salinas Valley"›
**Study area.** `{{< var basin_list >}}` — three subbasins chosen for contrast
rather than representativeness: two in the San Joaquin Valley sharing an
accounting platform, one on the Central Coast with a different hydrogeology, a
different governance structure, and a land repurposing grant held outside the
groundwater agency.
[Open the full map →](map.html)

> The basin roster cards that follow (Merced / East Turlock / Salinas Valley /
> Colusa / Yolo) are **‹config-routed›** — see section 8.

## Analysis Pipeline

> *(Renamed from "How the analysis worked" / `OV-WORKFLOW-*` → `OV-PIPELINE-*`,
> 2026-09-10. The figure is restyled as a paper-style workflow with three
> labelled bands. `OV-WORKFLOW-CAPTION` — the "same 68 structured questions"
> figcaption — removed; that point now lives inside the extraction node,
> `OV-PIPELINE-NODES`.)*

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
same `{{< var comparison_questions_total >}}`-question comparison frame to every
subbasin; findings are then classified and their quotations verified. Synthesis:
the coded findings are compared across basins and turned into implications for
the groundwater accounting platform and for DWR.

### OV-PIPELINE-NODES `[card]` ‹tokens = 68 / 27›
- **Academic literature** — Methods demonstrated in the published literature
- **Policy & planning documents** — Plans, amendments, rules, evaluations,
  annual reports, program instruments, comments
- **GSA board meetings** — Registered as a future source. Not yet reviewed —
  contributes nothing to this site.
- **Structured finding extraction** — Each finding is recorded with its document,
  section, direct quotation, and source location. The same
  `{{< var comparison_questions_total >}}`-question comparison frame is applied to
  every subbasin — `{{< var comparison_questions_all_basins >}}` questions
  answered for all three, the rest for two or more — so adding a subbasin means
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

### OV-GODEEPER-BODY `[body]` ‹tokens = 325 / 58›
The three chapter pages lead with the cross-basin insight and explain it
visually. The underlying evidence — all `{{< var findings_total >}}` findings and
`{{< var literature_total >}}` papers — is searchable directly, each with its
direct quotation and source location attached.

### OV-GODEEPER-BTN-1 `[button]`
[Explore the findings database →](findings.html)

### OV-GODEEPER-BTN-2 `[button]`
[Methods and limitations →](methods.html)

---

# 3 · Interconnected Surface Water page (`isw.qmd`)

> **Shared chapter template (2026-09-10).** All three chapter pages (ISW, Land
> Repurposing, Community) now follow the same seven sections, in this order.
> Section headings (kickers) are fixed across chapters; only the content under
> each changes.
>
> | # | Kicker | What it holds |
> |---|---|---|
> | S1 | *(chapter kicker)* + the question | Intro prose + photo + chapter icon |
> | S2 | **The Accounting Lifecycle** | The chapter's core staged graphic |
> | S3 | **Key Findings** | Pinned scene, numbered 1–5, detailed |
> | S4 | **Breakdown by Subbasin** | Per-basin tabs (data-driven) + the all-basins view |
> | S5 | **Connection to Accounting** | H3 "Implementing findings into the Groundwater Accounting Platform" |
> | S6 | **Beyond** | WaterOne.ai board-meeting scaffold — **draft, not published** |
> | S7 | **Further Exploration** | Open questions as expandable chips — placeholder |
>
> S4's per-basin tab content and S6's map pins are JS-rendered from data and
> are not in this deck. `[NEEDS COPY]` marks every empty slot.

### ISW-TITLE `[title]`
Interconnected Surface Water

### ISW-SEO-DESC `[body]`
How information moves from pumping, through hydrologic response and modelling,
to a sustainability threshold and a management decision.

## S1 · Intro

### ISW-EYEBROW `[eyebrow]`
Chapter 1 · Interconnected Surface Water

### ISW-CHAPTER-TITLE `[h1]`
How does a pumping impact become a management decision?

### ISW-INTRO-1 `[body]`
Interconnected surface water is one of the biggest challenges for accounting
under SGMA. Pumping groundwater affects depletion of a stream, either by drawing
water from the surface water directly or intercepting the water that would feed
into the stream. The effects are usually lagged and highly dependent on the
material and properties of the aquifer system, which are usually inferred rather
than observed.

### ISW-INTRO-2 `[body]`
Tracking this phenomenon and turning it into compliance takes a chain of steps —
the most important link being where measurement stops and accounting begins.

### ISW-INTRO-3 `[body]` ‹token = "three"›
All `{{< var active_basins_word >}}` subbasins run numerical groundwater–surface
water models, and all three produce a depletion figure attributable to pumping.
However, in each case the compliance loop is connected to a groundwater-level
proxy and not the depletion figure.

### ISW-PHOTO-ALT `[alt]`
Aerial view of a wide, braided river channel winding through an irrigated valley
at dawn.

### ISW-PHOTO-LABEL `[caption]`
Interconnected Surface Water

## S2 · The Accounting Lifecycle

### ISW-DIAGRAM-EYEBROW `[eyebrow]`
The Accounting Lifecycle

### ISW-DIAGRAM-LEDE `[lede]`
Scroll to see how the accounting chain operates for interconnected surface water
— and where that chain breaks down.

### ISW-DIAGRAM-DESC `[figure-desc]`
A shallow cutaway of a stream and the ground beneath it. A thick band of
vegetation sits over a thicker band of brown sediment; below them is one
continuous saturated aquifer. The boundary between the brown sediment and the
blue aquifer is the water table. A broad, shallow stream sits in a low bowl on
the left, and the water table meets it, so shallow groundwater and the stream
are one connected system. A wide monitoring well stands beside the stream; a
wider, deeper pumping well stands away from it. Pumping pulls the water table
down into a cone of depression around the pumping well and reduces the
groundwater that would otherwise reach the stream; the gap from the pre-pumping
water table is the stream depletion attributable to pumping. A numerical model
produces that depletion volume, but the compliance test is run instead on
measured groundwater elevation at the monitoring well — a proxy — checked
against a threshold. That substitution, from modelled depletion to
groundwater-level proxy, is where the chain breaks. Steps one and two are the
physical response; the rest are the accounting chain.

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
- **Number:** 01
- **Title:** Pumping
- **Body:** Wells pump at different depths, and models see averaged demand
  rather than individual wells.

### ISW-RAIL-02 `[card]`
- **Number:** 02
- **Title:** Hydrologic response
- **Body:** The water table falls and less groundwater reaches the stream,
  lagged and attenuated.

### ISW-RAIL-03 `[card]`
- **Number:** 03
- **Title:** Measurement & model
- **Body:** A numerical groundwater–surface-water model estimates the stream
  depletion.

### ISW-RAIL-04 `[card]`
- **Number:** 04
- **Title:** Attribution
- **Body:** Model runs with and without pumping isolate its share — at basin or
  reach scale, never per well.

### ISW-RAIL-BREAK `[card]`
- **Label:** Chain breaks
- **Body:** Measurement and modelling stop here, and compliance switches to a
  groundwater-level proxy.

### ISW-RAIL-05 `[card]`
- **Number:** 05
- **Title:** Sustainability threshold
- **Body:** The threshold tracks groundwater elevation at wells — a proxy, not
  the modelled volume.

### ISW-RAIL-06 `[card]`
- **Number:** 06
- **Title:** Accounting & compliance
- **Body:** The compliance test runs on that proxy, checked against the
  threshold.

### ISW-RAIL-07 `[card]`
- **Number:** 07
- **Title:** Management response
- **Body:** A declared result brought no management consequence, and the loop
  back to pumping stays weak.

## S3 · Key Findings  *(pinned scroll scene)*

### ISW-KF-EYEBROW `[eyebrow]`
Key Findings

### ISW-KF-H2 `[h2]`
The biggest gaps this chapter surfaces

### ISW-KF-1 `[card]` *(step 01)*
- **Heading:** Per-well attribution stays out of reach
- **Body:** Research has revealed remedies for the per-well attribution problem,
  but the basins remain at basin- or reach-scale attribution. So far there is no
  documentation of agencies applying, testing, or citing these methods.

### ISW-KF-2 `[card]` *(step 02)*
- **Heading:** Depth-specific interconnection is only partly measured
- **Body:** To handle different depletion rates from wells at different depths,
  the literature recommends using multiple methods together, especially nested
  wells at different depths. The basins have yet to fully close the gap between
  where interconnection is measured and where pumping happens. East Turlock comes
  closest, using nested wells to describe conditions at varying depths.

### ISW-KF-3 `[card]` *(step 03)*
- **Heading:** Modeled output and uncertainty do not reach the decision
- **Body:** The literature flags the importance of both turning modeled output
  into management decisions and communicating uncertainty. The basins run a
  compliance loop that relies on groundwater-level proxies, and they do not yet
  adequately communicate numerical uncertainty for their ISW figures.

### ISW-KF-4 `[card]` *(step 04)* `[NEEDS COPY]`
- **Heading:** [NEEDS COPY — key finding 4]
- **Body:** Placeholder. Add a fourth cross-basin gap from the synthesis.

### ISW-KF-5 `[card]` *(step 05)* `[NEEDS COPY]`
- **Heading:** [NEEDS COPY — key finding 5]
- **Body:** Placeholder. Add a fifth cross-basin gap from the synthesis.

## S4 · Breakdown by Subbasin

> Replaces the old "Basin tracks" section (`ISW-TRACKS-*`). The per-subbasin tab
> content (question-by-question Documented / Ambiguous / Not-found) is rendered
> by `assets/js/breakdown.js` from the coded data and is not editable here.

### ISW-BREAKDOWN-EYEBROW `[eyebrow]`
Breakdown by Subbasin

### ISW-BREAKDOWN-H2 `[h2]`
Where each subbasin's documents are clear, ambiguous, or silent

### ISW-BREAKDOWN-BODY `[body]`
Every entry is a question the analysis put to that subbasin's document set,
reporting what the documents actually said — as a coded finding type, never as a
score. Selecting an entry opens the evidence behind it.

### ISW-BREAKDOWN-CAPTION `[caption]`
A stage marked **not found in reviewed documents** means the analyst searched
that basin's document set and did not find it — not that the practice does not
exist. Document sets are not equally complete.

### ISW-BREAKDOWN-ALLBASINS `[h3]`
All three subbasins at a glance
> Each subbasin's 10 ISW stages (1.1–1.8, Data Sources, Formal Mechanisms) are
> laid out as a 4 / 4 / 2 boustrophedon "snake" — reads left→right, then
> right→left, then left→right. Card labels come from the coding frame, not this
> deck.

## S5 · Connection to Accounting

### ISW-CONNECTION-EYEBROW `[eyebrow]`
Connection to Accounting

### ISW-CONNECTION-H3 `[h3]`
Implementing findings into the Groundwater Accounting Platform

### ISW-CONNECTION-BODY-1 `[body]`
A platform that reports a modelled depletion volume is reporting a number no
basin currently uses to decide anything. A platform that reports the
groundwater-level proxy is reporting the operative quantity — but one that, by
the agencies' own account, cannot separate depletion caused by pumping from
depletion caused by a dry year or by upstream reservoir operations.

### ISW-CONNECTION-BODY-2 `[body]`
The literature has built tools for the missing step: methods that rank
individual wells by their effect on streamflow, and methods that attribute
depletion to specific wells. None appears in the reviewed document sets.

### ISW-CONNECTION-CONTRAST `[card]`
> Placeholder two-card treatment — richer presentation ideas noted in an HTML
> comment in `isw.qmd`.
- **Card A (what a platform reports now):** The groundwater-level proxy — the
  operative compliance quantity in every reviewed basin.
- **Card B (what it cannot yet separate):** Pumping-caused depletion from
  drought- or reservoir-caused depletion — and the per-well contribution the
  literature can already estimate.

### ISW-CONNECTION-BTN `[button]`
[Evidence on per-well attribution →](findings.html?chapter=1.%20ISW&section=1.5%20Per-well%20Attribution%20and%20the%20Cumulative%20Pumping%20Problem)

## S6 · Beyond  *(draft — not published)*

### ISW-BEYOND-EYEBROW `[eyebrow]`
Beyond

### ISW-BEYOND-BANNER `[callout]`
**Draft — not yet published.** No GSA board-meeting evidence has been reviewed.
This section is scaffolding for a future WaterOne.ai evidence stream; nothing
here implies any meeting has been analyzed.

### ISW-BEYOND-BODY `[body]`
Explore how other subbasins are thinking about these topics, from information
gathered from GSA board meetings via the WaterOne.ai platform.

### ISW-BEYOND-EMPTY `[body]`
> Shown on the locator until verified pins exist (JS-rendered).
No board-meeting evidence has been reviewed yet. When it is, verified points
will appear on this map, each linking to the meeting it came from.

## S7 · Further Exploration  *(placeholder)*

### ISW-FURTHER-EYEBROW `[eyebrow]`
Further Exploration

### ISW-FURTHER-LEAD `[body]`
Open questions this chapter raises and does not answer. Select one to see why it
matters.

### ISW-FURTHER-QUESTIONS `[card]` `[NEEDS COPY]`
> Edit these in `data/interactive/further-isw.json` (or tell me). Each has a
> `q` (the chip) and a `note` (the expansion).
1. Would a per-well streamflow-depletion ranking change any basin's management
   priorities? *(note: placeholder)*
2. What would it take for a modeled depletion volume to become the compliance
   quantity itself? *(note: placeholder)*
3. How should numeric ISW uncertainty be communicated to a board making a
   threshold decision? *(note: placeholder)*

### ISW-FURTHER-OUTRO `[body]`
The coded evidence is already searchable in the
[Findings Explorer](findings.qmd?chapter=1.%20ISW).

---

# 4 · Land Repurposing page (`mlrp.qmd`)

> Follows the **shared chapter template** (see the table in section 3). MLRP
> copy below is unchanged from the first build except where marked; Jackson will
> revise it.

## S1 · Intro

### MLRP-TITLE `[title]`
Land Repurposing

### MLRP-SEO-DESC `[body]`
When farmland is repurposed, what is actually measured, verified, credited, and
monitored — compared across the analyzed subbasins.

### MLRP-EYEBROW `[eyebrow]`
Chapter 2 · Multi-benefit Land Repurposing

### MLRP-CHAPTER-TITLE `[h1]`
When land is repurposed, what is actually measured?

### MLRP-INTRO-1 `[body]`
Multi-benefit land repurposing is meant to do several things at once: use less
water, and deliver habitat, community, and economic benefits alongside. Each of
those claims implies a measurement. The question this chapter asks is which of
them are actually made, when, and whether the answer enters the accounting
system at all.

### MLRP-INTRO-2 `[body]` ‹token = "three"›
The `{{< var active_basins_word >}}` programs differ less in what they fund than
in when they count: one measures repurposed parcels after implementation and
treats the result as enforceable, one estimates savings beforehand and never
checks back, one keeps its measurement outside the subbasin's accounting
entirely.

### MLRP-PHOTO-ALT `[alt]`
Aerial view of a river corridor dividing tilled farmland from green irrigated
fields.

### MLRP-PHOTO-LABEL `[caption]`
Multi-benefit Land Repurposing

## S2 · The Accounting Lifecycle

### MLRP-LIFECYCLE-EYEBROW `[eyebrow]`
The Accounting Lifecycle

### MLRP-LIFECYCLE-DESC `[figure-desc]`
An eight-stage lifecycle: select or prioritise a parcel, fund the intervention,
change the land use, measure water use, verify delivered savings, address
allocation and leakage, measure co-benefits, and monitor durability over time.
Across the reviewed programs the first three stages are well specified and the
later stages thin out sharply.

### MLRP-LIFECYCLE-01 `[card]`
- **Number:** 01
- **Label:** Select parcel
- **Note:** Scoring rubrics and siting criteria, with thresholds not always
  published.

### MLRP-LIFECYCLE-02 `[card]`
- **Number:** 02
- **Label:** Fund intervention
- **Note:** All three run on Department of Conservation money. Who holds the
  grant differs.

### MLRP-LIFECYCLE-03 `[card]`
- **Number:** 03
- **Label:** Change land use
- **Note:** Incentive agreement, per-acre payment, or outright purchase.

### MLRP-LIFECYCLE-04 `[card]`
- **Number:** 04
- **Label:** Measure water use
- **Note:** Evapotranspiration in some form in all three — but at different
  times.

### MLRP-LIFECYCLE-05 `[card]`
- **Number:** 05
- **Label:** Verify savings
- **Note:** The missing middle. Estimated before, measured after, or not
  measured at all.

### MLRP-LIFECYCLE-06 `[card]`
- **Number:** 06
- **Label:** Allocation & leakage
- **Note:** Whether the entitlement to pump moves, is suspended, or ceases to
  exist.

### MLRP-LIFECYCLE-07 `[card]`
- **Number:** 07
- **Label:** Measure co-benefits
- **Note:** Named and sometimes scored or priced in every program. Measured as
  delivered outcomes in none.

### MLRP-LIFECYCLE-08 `[card]`
- **Number:** 08
- **Label:** Monitor durability
- **Note:** Grant funding ends in 2027; monitoring obligations run longer.

### MLRP-LIFECYCLE-CAPTION `[caption]` ‹token = 108›
Stages 5 through 7 are where a repurposing program becomes an accounting
instrument rather than a grant — exactly where the three programs are thinnest
and most different from one another.
[See all `{{< var mlrp_findings >}}` land repurposing findings →](findings.html?chapter=2.%20MLRP)

## S3 · Key Findings  *(pinned scroll scene)* `[NEEDS COPY]`

### MLRP-KF-EYEBROW `[eyebrow]`
Key Findings

### MLRP-KF-H2 `[h2]`
What the cross-basin comparison surfaces

### MLRP-KF-1…5 `[card]` `[NEEDS COPY]`
Five numbered findings, each a heading + a detailed paragraph drawing on the
synthesis and the literature. All five are placeholders right now. Candidate
threads from the first build: verification is the missing middle; estimated ≠
measured savings; allocation rules decide whether a saving stays saved;
co-benefits are named but not measured as delivered outcomes; grant timelines
outrun monitoring funding.

## S4 · Breakdown by Subbasin

> Old `MLRP-COMPARISON-*` folds in here. Per-basin tab content is JS-rendered
> from the coded data; the cross-basin matrix sits beneath the tabs as the
> "all basins" view.

### MLRP-BREAKDOWN-EYEBROW `[eyebrow]`
Breakdown by Subbasin

### MLRP-BREAKDOWN-H2 `[h2]`
Where each subbasin's documents are clear, ambiguous, or silent

### MLRP-BREAKDOWN-BODY `[body]`
Every entry is a question the analysis put to that subbasin's document set,
reporting what the documents actually said — as a coded finding type, never as a
score. Selecting an entry opens the evidence behind it.

### MLRP-BREAKDOWN-CAPTION `[caption]`
The document sets are not equally complete. Several Salinas Valley absences are
gaps in document availability; several East Turlock absences reflect programs
that have not yet produced results. Cells in the same row are not equally
weighted evidence.

### MLRP-BREAKDOWN-ALLBASINS `[h3]`
All three subbasins at a glance

## S5 · Connection to Accounting

### MLRP-CONNECTION-EYEBROW `[eyebrow]`
Connection to Accounting

### MLRP-CONNECTION-H3 `[h3]`
Implementing findings into the Groundwater Accounting Platform

### MLRP-CONNECTION-BODY-1 `[body]`
Changing the land use and changing the entitlement to pump are separate
decisions, and a program can do the first without the second. Across the three
programs the entitlement variously stays with the landowner and can move, is
suspended for the paid term with no transfer mechanism in existence, or ceases
to exist because the land was bought outright.

### MLRP-CONNECTION-BODY-2 `[body]`
None of the three publishes reporting on the allocation status of repurposed
parcels — so none could detect movement even where movement is permitted.

### MLRP-CONNECTION-CONTRAST `[card]`
- **Card A (what a platform could credit now):** An estimated or measured
  evapotranspiration reduction on a repurposed parcel, where the program
  produces one.
- **Card B (what it cannot yet see):** Whether the entitlement moved, whether a
  co-benefit was delivered, and whether the saving held after the grant closed.

### MLRP-CONNECTION-BTN `[button]`
[Evidence on allocation and leakage →](findings.html?chapter=2.%20MLRP&section=2.3%20Allocation%20and%20Leakage)

## S6 · Beyond  *(draft — not published)*

### MLRP-BEYOND-EYEBROW `[eyebrow]`
Beyond

### MLRP-BEYOND-BANNER `[callout]`
**Draft — not yet published.** No GSA board-meeting evidence has been reviewed.
This section is scaffolding for a future WaterOne.ai evidence stream; nothing
here implies any meeting has been analyzed.

### MLRP-BEYOND-BODY `[body]`
Explore how other subbasins are thinking about these topics, from information
gathered from GSA board meetings via the WaterOne.ai platform.

## S7 · Further Exploration  *(placeholder)*

### MLRP-FURTHER-EYEBROW `[eyebrow]`
Further Exploration

### MLRP-FURTHER-LEAD `[body]`
Open questions this chapter raises and does not answer. Select one to see why it
matters.

### MLRP-FURTHER-QUESTIONS `[card]` `[NEEDS COPY]`
> Edit in `data/interactive/further-mlrp.json`.
1. What does a paired expected-vs-measured savings comparison look like on a real
   enrolled parcel? *(placeholder)*
2. Which allocation rule best keeps a water saving from leaking back into
   pumping? *(placeholder)*
3. Who funds long-term monitoring after the Department of Conservation grant
   closes? *(placeholder)*

## Geography *(kept as a trailing subsection)*

### MLRP-MAP-EYEBROW `[eyebrow]`
Geography

### MLRP-MAP-PLACEHOLDER `[body]`
An optional land repurposing map is reserved for this container.

### MLRP-MAP-CAPTION `[caption]`
**A limitation, not an omission.** Project-location data are documented
inconsistently across the three subbasins. Forcing them onto one map would imply
a spatial comparability the source documents do not support, so this map will
only be published if the data can carry it.

### MLRP-STUB-CAPTION `[caption]`
The remaining narrative sections — financing, ET product choice, co-benefit
quantification, dust, post-grant funding — are still being written. The coded
evidence is already searchable in the [Findings Explorer](findings.qmd?chapter=2.%20MLRP).

---

# 5 · Community page (`community.qmd`)

### COM-TITLE `[title]`
Community

### COM-SEO-DESC `[body]`
Representative, procedural and distributional equity in groundwater governance,
and how a threshold becomes a household consequence.

> Follows the **shared chapter template** (see the table in section 3). The
> equity triad and the community-facing tools list moved into S4 (Breakdown by
> Subbasin); the threshold→household chain is now S2 (The Accounting Lifecycle).

## S1 · Intro

### COM-EYEBROW `[eyebrow]`
Chapter 3 · Community Considerations

### COM-CHAPTER-TITLE `[h1]`
Who is represented, who can participate, and who bears the consequences?

### COM-INTRO-1 `[body]`
These are three different questions, and a groundwater agency can answer them
independently of one another. Treating community equity as a single variable —
something an agency either has or lacks — hides exactly the differences that
matter for how an accounting platform should be designed.

### COM-INTRO-2 `[body]` ‹token = "three"›
Representative and procedural equity move independently across the
`{{< var active_basins_word >}}` subbasins reviewed here. Distributional equity —
which residents bear dewatering risk — is the gap shared by all three, and not
for want of data: every basin holds the well-completion records, published
thresholds, and community boundaries the analysis would need.

### COM-INTRO-CAPTION `[caption]`
One basin's supermajority voting rule qualifies its otherwise strongest formal
representation — but no reviewed document records a failed vote, so this is
architecture that permits an outcome, not evidence that the outcome occurred.

### COM-PHOTO-ALT `[alt]`
A farmworker in a wide-brimmed hat bent over inspecting rows of a green field
crop.

### COM-PHOTO-LABEL `[caption]`
Community Considerations

> **Section order for Community:** S2 is the threshold→household chain
> (`COM-HOUSEHOLD-*`, further down). The equity triad below and the tools list
> further down both live in **S4 · Breakdown by Subbasin**. They appear here in
> the deck in reading order.

### COM-TRIAD-H2 `[h2]`  *(S4 — leads the Breakdown section)*
The three dimensions, and how each subbasin does on them

### COM-TRIAD-INTRO `[body]`
Representative, procedural, and distributional equity are three different
questions. An agency can answer them independently, so the comparison keeps them
apart rather than collapsing them into a single verdict.

### COM-TRIAD-DESC `[figure-desc]`
Three independent dimensions of equity. Representative equity asks who holds a
seat and a vote. Procedural equity asks who can participate, appeal, understand
and influence a decision. Distributional equity asks who bears the benefits,
burdens and consequences. Across the reviewed subbasins the first two vary
independently and the third is a shared gap.

### COM-TRIAD-REPRESENTATIVE `[card]`
- **Heading:** Representative
- **Question:** Who has a seat, and a vote?
- **Body:** Formal representation can be granted on paper and qualified in
  practice — by a voting rule, by the durability of the instrument that created
  the seat, or by whether the body advises or decides.

### COM-TRIAD-PROCEDURAL `[card]`
- **Heading:** Procedural
- **Question:** Who can participate, appeal, and understand?
- **Body:** Standing, fees, appeal windows, whether a board must state its
  reasons, and language access. The literature treats several of these as cheap
  and specific fixes.

### COM-TRIAD-DISTRIBUTIONAL `[card]`
- **Heading:** Distributional
- **Question:** Who bears the benefits and the burdens?
- **Body:** Which households sit above a threshold that would dry their well.
  The literature calls this the most computable of the three — and it is the one
  least often computed.

### COM-TRIAD-CAPTION `[caption]`
These are not stages of a maturity ladder. An agency can score well on one and
poorly on another, and across the reviewed subbasins they do.

## S2 · The Accounting Lifecycle — the chain

### COM-HOUSEHOLD-EYEBROW `[eyebrow]`
The Accounting Lifecycle

### COM-HOUSEHOLD-H2 `[h2]`
What a number on a page does to a well

### COM-HOUSEHOLD-BODY `[body]`
A minimum threshold is a groundwater elevation. A domestic well is a pipe of a
known depth at a known location. Connecting the two is arithmetic — and it is
the step the reviewed document sets do not take.

### COM-HOUSEHOLD-DESC `[figure-desc]`
A five-stage chain from a groundwater threshold to a household consequence: the
adopted threshold, the water level or exposure it permits, the depth of a
domestic well or the vulnerability of a small water system, the expected
household consequence, and the mitigation response. Across the reviewed
subbasins the chain is broken between the third and fourth stages: mitigation
instruments engage only after a household has already lost water.

### COM-HOUSEHOLD-01 `[card]`
- **Number:** 01
- **Label:** Groundwater threshold
- **Note:** An adopted elevation below which an undesirable result is declared.

### COM-HOUSEHOLD-02 `[card]`
- **Number:** 02
- **Label:** Water level permitted
- **Note:** The decline the threshold allows before anything is triggered.

### COM-HOUSEHOLD-03 `[card]`
- **Number:** 03
- **Label:** Well depth & vulnerability
- **Note:** Well-completion records exist in every basin.

### COM-HOUSEHOLD-04 `[card]`
- **Number:** 04
- **Label:** Expected household consequence
- **Note:** Not found in the reviewed documents. No basin publishes which
  residents its thresholds would leave exposed.

### COM-HOUSEHOLD-05 `[card]`
- **Number:** 05
- **Label:** Mitigation response
- **Note:** All three instruments engage only after a household has lost water.

### COM-HOUSEHOLD-CAPTION `[caption]`
Stage 4 is arithmetic over data every basin already holds. Skipping it turns
mitigation from a prospective protection into a reactive one.
[Evidence on dry-well mitigation →](findings.html?chapter=3.%20Community%20Considerations&section=3.3.1%20Dry%20Well%20Mitigation)

## S3 · Key Findings  *(pinned scroll scene)* `[NEEDS COPY]`

### COM-KF-EYEBROW `[eyebrow]`
Key Findings

### COM-KF-H2 `[h2]`
What the cross-basin comparison surfaces

### COM-KF-1…5 `[card]` `[NEEDS COPY]`
Five numbered findings, each a heading + a detailed paragraph. All placeholders.
Candidate threads from the first build: the three equities move independently;
distributional outcomes are the shared gap; the distributional question is the
most computable and least computed; mitigation is reactive not prospective;
engagement activity is measured but reach is not.

## S4 · Breakdown by Subbasin

> Holds, in order: the equity triad (`COM-TRIAD-*`, shown earlier in this deck),
> the per-basin tabs (JS-rendered), the cross-basin matrix, and the
> community-facing tools list.

### COM-BREAKDOWN-EYEBROW `[eyebrow]`
Breakdown by Subbasin

### COM-BREAKDOWN-CAPTION `[caption]`
A stage marked **not found in reviewed documents** means the analyst searched
that basin's document set and did not find it — not that the practice does not
exist. Document sets are not equally complete.

### COM-BREAKDOWN-ALLBASINS `[h3]`
All three subbasins at a glance

### COM-TOOLS-H3 `[h3]`
Community-facing tools

### COM-TOOLS-BODY-1 `[body]` ‹token = "nine"›
The analysis checked each subbasin's documents for
`{{< var tools_checked_word >}}` named community-facing tools — the products a
resident, rather than a grower or a compliance officer, would actually use.

### COM-TOOLS-BODY-2 `[body]`
Three of them — CalEnviroScreen, the Drinking Water Tool, and the Aquifer Risk
Map — appear in none of the reviewed document sets. The dry well portal is the
only state tool any basin points residents toward.

> The list of tool links itself is **‹config-routed›** — see section 8.

### COM-TOOLS-CAPTION `[caption]`
Tools named in the literature consolidation and searched for across the reviewed
policy and planning documents. A tool's absence from a document set is a finding
about those documents, not about the tool.
[See the evidence on decision-support integration →](findings.qmd?chapter=3.%20Community%20Considerations&section=3.3.4%20Data%20%E2%86%92%20Decision-Support%20Integration)

## S5 · Connection to Accounting `[NEEDS COPY]`

### COM-CONNECTION-EYEBROW `[eyebrow]`
Connection to Accounting

### COM-CONNECTION-H3 `[h3]`
Implementing findings into the Groundwater Accounting Platform

### COM-CONNECTION-BODY `[body]` `[NEEDS COPY]`
Placeholder. The community-facing implications for a groundwater accounting
platform are still being written from the synthesis — the throughline is that
the distributional question is the most computable of the three and the least
often computed, over data every basin already holds.

### COM-CONNECTION-CONTRAST `[card]`
- **Card A (what a platform shows now):** Grower- and compliance-facing
  accounting: allocations, pumping, and threshold status.
- **Card B (what a resident cannot see):** Whether a published threshold would
  leave their well exposed, computed prospectively rather than confirmed after a
  failure.

### COM-CONNECTION-BTN `[button]`
[Evidence on dry-well mitigation →](findings.html?chapter=3.%20Community%20Considerations&section=3.3.1%20Dry%20Well%20Mitigation)

## S6 · Beyond  *(draft — not published)*

### COM-BEYOND-EYEBROW `[eyebrow]`
Beyond

### COM-BEYOND-BANNER `[callout]`
**Draft — not yet published.** No GSA board-meeting evidence has been reviewed.
This section is scaffolding for a future WaterOne.ai evidence stream; nothing
here implies any meeting has been analyzed.

### COM-BEYOND-BODY `[body]`
Explore how other subbasins are thinking about these topics, from information
gathered from GSA board meetings via the WaterOne.ai platform.

## S7 · Further Exploration  *(placeholder)*

### COM-FURTHER-EYEBROW `[eyebrow]`
Further Exploration

### COM-FURTHER-LEAD `[body]`
Open questions this chapter raises and does not answer. Select one to see why it
matters.

### COM-FURTHER-QUESTIONS `[card]` `[NEEDS COPY]`
> Edit in `data/interactive/further-community.json`.
1. What is the smallest defensible unit of delivered community benefit?
   *(placeholder)*
2. Which residents would each basin's minimum thresholds leave exposed, and does
   prospective mapping change mitigation design? *(placeholder)*
3. Does formal representation translate into decision authority, or stop at
   advice? *(placeholder)*

### COM-FURTHER-OUTRO `[body]`
The coded evidence is already searchable in the
[Findings Explorer](findings.qmd?chapter=3.%20Community%20Considerations).

---

# 5b · Map page (`map.qmd`)  *(new 2026-09-10)*

Standalone page, nav label **Map**, between Community and Explore Findings. Shows
the same Study Area map placeholder as the Overview, at full width, with the
subbasin roster beneath.

### MAP-TITLE `[title]`
Study Area Map

### MAP-SEO-DESC `[body]`
An interactive map of the analyzed subbasins, the relevant GSA boundaries, and
the major rivers, authored in ArcGIS Online.

### MAP-H1 `[h1]`
Study Area Map

### MAP-INTRO `[body]`
The analysis compares three California groundwater subbasins chosen for contrast
rather than representativeness. This map orients the reader geographically; the
analytical work lives in the chapter pages and the
[Findings Explorer](findings.qmd).

### MAP-PLACEHOLDER `[body]`
> Shown until the ArcGIS embed is added.
The Study Area map is authored in ArcGIS Online and will be embedded here. It
shows the analyzed subbasins, the relevant GSA boundaries, and the major rivers,
with popups linking into the filtered findings explorer.

### MAP-CAPTION `[caption]` ‹token = "Merced, East Turlock and Salinas Valley"›
**Study area.** `{{< var basin_list >}}` — three subbasins chosen for contrast
rather than representativeness: two in the San Joaquin Valley sharing an
accounting platform, one on the Central Coast with a different hydrogeology, a
different governance structure, and a land repurposing grant held outside the
groundwater agency. Colusa and Yolo are registered as near-term additions and
are not yet analyzed.

### MAP-ROSTER-EYEBROW `[eyebrow]`
The subbasins

> The roster cards themselves are **‹config-routed›** — see section 8.

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

### MTH-INTRO `[body]` ‹tokens = 33 / 3 / 58 / 325›
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

### MTH-METHODS-WHY-BODY-1 `[body]` ‹token = "Merced, East Turlock and Salinas Valley"›
`{{< var basin_list >}}` were selected for contrast rather than
representativeness. Two sit in the San Joaquin Valley and share an accounting
platform; the third sits on the Central Coast with different hydrogeology, a
different governance structure, and a land repurposing grant held outside the
groundwater agency. The differences are what make the comparison informative.

### MTH-METHODS-WHY-BODY-2 `[body]` ‹token = "Colusa and Yolo"›
`{{< var planned_basin_list >}}` are registered as near-term additions. No
evidence from either has been reviewed, and neither contributes to any count,
comparison, or conclusion on this site.

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

### MTH-METHODS-LIT-BODY `[body]` ‹token = 58›
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

### MTH-METHODS-CODING-BODY-2 `[body]` ‹token = 221›
Quotations were checked against the source document where a quotation exists;
`{{< var quotes_verified >}}` are marked verified.

### MTH-METHODS-XBASIN-H3 `[h3]`
Cross-basin comparison

### MTH-METHODS-XBASIN-BODY-1 `[body]` ‹tokens = 68 / 27 / 46›
The comparison is structural rather than interpretive. The same
`{{< var comparison_questions_total >}}` questions were put to each subbasin's
document set; `{{< var comparison_questions_all_basins >}}` of them were answered
for all three, and `{{< var comparison_questions_multi_basin >}}` for two or
more. A comparison row is one of those questions, and a cell is what that basin's
documents actually said.

### MTH-METHODS-XBASIN-BODY-2 `[body]`
**No maturity score, traffic light, or ranking is assigned anywhere on this
site.** A cell reports the coded finding type and nothing more.

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

### MTH-LIM-2-BODY `[body]` ‹tokens = 27 / 68›
Not every question was coded for every subbasin.
`{{< var comparison_questions_all_basins >}}` of
`{{< var comparison_questions_total >}}` questions were answered for all three;
several comparisons rest on two. Where a question was not coded for a basin the
site says exactly that, and does not treat it as an absence.

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
No geographic analysis was performed. Maps on this site are contextual and
authored separately in ArcGIS Online. Land repurposing project locations in
particular are documented inconsistently across the three subbasins, which is
itself recorded as a limitation rather than smoothed over.

## Tab: Credits & role

### MTH-CREDITS-ROLE-H3 `[h3]`
Project role

### MTH-CREDITS-ROLE-BODY-1 `[body]`
This site is an independent portfolio adaptation of a landscape analysis
conducted for the California Department of Water Resources Groundwater
Accounting project. The underlying cross-basin synthesis and the coded findings
database are the author's own work within that project.

### MTH-CREDITS-ROLE-BODY-2 `[body]` ‹tokens = 3 / 58 / 325›
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

### CFG-STAT-1 `[card]` ‹number = 325›
- **Label:** Coded findings
- **Hint:** Across three thematic chapters

### CFG-STAT-2 `[card]` ‹number = 33›
- **Label:** Source documents
- **Hint:** Plans, rules, evaluations, reports and comments

### CFG-STAT-3 `[card]` ‹number = 58›
- **Label:** Papers reviewed
- **Hint:** Assessed for the method each demonstrates

### CFG-STAT-4 `[card]` ‹number = 3›
- **Label:** Subbasins analyzed
- **Hint:** Each with its own document set

## Basin roster (`_partials/basins.html`)

### CFG-BASIN-MERCED `[card]`
- **Name:** Merced Subbasin
- **Region:** San Joaquin Valley
- **ISW model:** MercedWRM — Quasi-3D numerical model on the IWFM 2015 platform,
  calibrated against ET, groundwater levels, and streamflow.
- **Groundwater accounting:** Groundwater Accounting Platform — ET data source
  is OpenET.
- **Land repurposing:** MSGSA holds the Department of Conservation block grant
  directly — $8.89M DOC MLRP block grant awarded 16 June 2023 and held by MSGSA,
  alongside a locally funded Proposition 218 Phase 1 Land Repurposing Program.
- **Link text:** `‹87›` findings from this subbasin →

### CFG-BASIN-EAST-TURLOCK `[card]`
- **Name:** East Turlock Subbasin
- **Region:** San Joaquin Valley
- **ISW model:** C2VSimTM — Quasi-3D finite element model on the IWFM 2015
  platform — the same model class as Merced — calibrated October 1991 to
  September 2015.
- **Groundwater accounting:** Groundwater Accounting Platform — ET data source
  is LandIQ, with CalETa for the historical baseline.
- **Land repurposing:** ETSGSA runs the program under a subbasin-wide award —
  ETSGSA applied on behalf of both GSAs; DOC awarded the Subbasin $8.89M. Grant
  closes 31 March 2027.
- **Scope note:** Findings are coded to the East Turlock GSA within the Turlock
  Subbasin. Where a document covers the whole Turlock Subbasin, the finding is
  coded at SUBBASIN level.
- **Link text:** `‹127›` findings from this subbasin →

### CFG-BASIN-SALINAS `[card]`
- **Name:** Salinas Valley — 180/400-Foot Aquifer Subbasin
- **Region:** Central Coast
- **ISW model:** SVIHM — USGS-owned numerical model built on MODFLOW-OWHM v2.
  Produces a paired-simulation depletion estimate and mapped ISW locations, but
  the compliance criterion runs on shallow-well elevation readings rather than
  model output.
- **Groundwater accounting:** No accounting platform identified in the reviewed
  documents — Recorded as an absence in the reviewed document set, not as a
  statement that none exists.
- **Land repurposing:** MLRP grant held outside the GSA — SVBGSA is one of five
  partners on another organization's grant — identified in the synthesis as a
  finding in its own right.
- **Link text:** `‹111›` findings from this subbasin →

### CFG-BASIN-PLANNED `[card]`
> Shown for every planned basin (currently Colusa, Yolo). One shared sentence.
- **Status pill:** Analysis in progress
- **Body:** Registered as a near-term addition. No evidence from this subbasin
  has been reviewed, so it contributes nothing to the counts, comparisons, or
  conclusions on this site.
- **Colusa region:** Sacramento Valley
- **Yolo region:** Sacramento Valley

## Evidence-stream cards (`_partials/evidence_streams.html`)

### CFG-STREAM-POLICY `[card]` ‹records = 325›
- **Status pill:** Active
- **Name:** Policy & Planning Documents
- **Description:** Groundwater Sustainability Plans, plan amendments, periodic
  evaluations, annual reports, GSA rules and regulations, land-repurposing
  program instruments, technical memoranda and ISW studies, GSP appendices,
  agency correspondence, and public comment letters.
- **Citation note:** Findings from this stream cite the specific document and
  the section or PDF page recorded by the analyst.

### CFG-STREAM-LITERATURE `[card]` ‹records = 58›
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

## Community-facing tools list (`_partials/tools.html`)

### CFG-TOOLS `[card]`
> Link text for each community-facing tool. URLs edited separately.
- StoryMap on Well Infrastructure in CA
- DWR Dry Well Support System
- DWR Dry Well Dataset
- CA Water Board SAFER Dashboard
- Kaweah MLRP Interactive Mapping
- SGMA Data Viewer
- Drinking Water Tool – Your Water Data
- Drinking Water Tool – CA Water Data
- CalEnviroScreen

---

# 9 · Maintenance notes (for Claude)

When the site structure changes in a way that adds, removes, moves, or renames
visible text, regenerate this deck:

1. Re-scan `index.qmd`, `isw.qmd`, `mlrp.qmd`, `community.qmd`, `map.qmd`,
   `findings.qmd`, `methods.qmd`, `_quarto.yml`, and `_partials/*.html`.
2. Keep existing entry IDs stable wherever the copy slot still exists, so the
   user's in-flight edits still map cleanly.
3. Add new IDs for new slots; mark removed slots as `*(removed <date>)*` rather
   than silently deleting, for one revision cycle.
4. Update the "Last synced" date and the page list.
5. Note any new JS-rendered copy that is still outside the deck: explorer filter
   labels (`findings.js`, `literature.js`), matrix/breakdown cell labels
   (`figures.js`, `breakdown.js`), and the WaterOne locator popovers
   (`beyond-map.js`). Chapter "Further Exploration" question text lives in
   `data/interactive/further-*.json`.
