# ArcGIS Map Handoff Checklist

## Map 1 — Study Area / Basin Context (required)

### Purpose
Orient the reader to the current and expanding case-study geography. Keep it clean and contextual rather than data-heavy.

### Recommended layers

Current analyzed basins:
- Merced Subbasin
- East Turlock Subbasin
- Salinas Valley 180/400-Foot Aquifer Subbasin

Known near-term additions:
- Colusa Subbasin
- Yolo Subbasin

You do **not** need to wait for Colusa/Yolo analysis to build the map schema. Use the same fields/symbology logic for all basins.

If Colusa/Yolo are displayed before analysis is complete, use a clearly different `planned / analysis in progress` treatment and do not give them findings links that imply completed evidence.

Also include:
- relevant GSA boundaries
- major rivers relevant to the analysis
- a restrained set of cities/towns or geographic labels

### Suggested popup fields
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

### Popup design
Show a concise, formatted popup rather than raw attributes.

Example:

**Merced Subbasin**  
San Joaquin Valley

**Groundwater accounting**  
Groundwater Accounting Platform

**ISW model**  
MercedWRM

**Land repurposing**  
GSA-led MLRP + local repurposing program

**Key feature**  
[short source-grounded characteristic]

**Explore findings →**

### Findings link
When the final GitHub Pages/custom-domain URL is known, link the popup to a filtered explorer URL such as:

`https://DOMAIN/findings.html?subbasin=Merced`

### Handoff to Claude Code
Provide either:
- the public ArcGIS embed iframe/snippet; or
- the public ArcGIS web-map URL.

Replace placeholder: `MAP_STUDY_AREA_EMBED`

---

## Map 2 — MLRP / Land-Repurposing Geography (optional)

### Build only if the data support a meaningful comparison
Potential question:

> Where is land repurposing occurring or being prioritized, and what water/community characteristics overlap those locations?

### Possible layers
- MLRP project points/polygons
- MLRP priority areas
- GSA/subbasin boundaries
- disadvantaged communities, where appropriate
- small community water systems, where appropriate
- domestic-well density or another community context layer, where defensible

### Important rule
Do not force the three basins into apparent spatial comparability if project-location data are incomplete or inconsistent. Data availability can itself be explained as a limitation.

### Handoff to Claude Code
Replace placeholder: `MAP_MLRP_EMBED`

---

## Styling guidance
- Use the website palette as inspiration, but retain enough contrast for map readability.
- Keep basemap subdued.
- Avoid excessive labels and layers.
- Use popups to tell a short story, not expose every attribute.
- Make the three subbasins immediately distinguishable.
- Test the map at the actual embedded width on desktop and mobile.


---

## Expansion behavior

When Colusa and Yolo analysis is complete:

1. add/update their basin features and GSA boundaries in the existing web map;
2. switch `analysis_status` from `planned` to `active`;
3. populate the same popup fields used for the original basins;
4. add the filtered Findings Explorer URL;
5. republish the ArcGIS web map.

The Quarto site should not need a new map component or page redesign. Future basins should follow the same pattern.
