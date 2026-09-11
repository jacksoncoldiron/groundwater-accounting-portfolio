# Expansion & Evidence Streams Guide

## Current analytical scope

Current analyzed basins:
- Merced
- East Turlock
- Salinas Valley / 180/400-Foot Aquifer Subbasin

Known near-term additions:
- Colusa
- Yolo

Build the website now using the current three as development data. Do not wait for Colusa/Yolo.

## Basin-extensible architecture

Maintain a canonical `config/basins.yml`.

Only `active` basins should feed public analytical counts, filters, and conclusions. `planned` basins must never appear as zero findings, failures, or “not found in reviewed documents.”

## Adding Colusa or Yolo later

When a basin analysis is complete:

1. add its coded findings;
2. switch its basin-registry status from `planned` to `active`;
3. update basin metadata;
4. update the ArcGIS map feature/popup;
5. rebuild processed data;
6. render the site;
7. review analyst-authored cross-basin conclusions.

Explorers and statistics should update automatically. Narrative conclusions should not.

## Evidence streams

Current:
- Policy & Planning Documents
- Academic Literature

Potential future:
- GSA Board Meetings, potentially sourced through Waterone.ai

Do not fabricate a Waterone.ai API or lock the project to one transcript format. Use a modular ingestion/provenance model.

## Future board-meeting evidence

A future meeting adapter should preserve, when available:
- basin/GSA;
- meeting date/title;
- agenda item;
- speaker/role;
- transcript excerpt;
- timestamps;
- recording/transcript/minutes URL;
- verification status;
- relationship to coded findings.

Board-meeting evidence must remain distinguishable from adopted plans, rules, and technical reports.

## Narrative review gate

Maintain `notes/narrative_review.md`. Re-review public claims whenever a basin or evidence stream becomes active, especially claims using “all,” “none,” “only,” “shared,” or “across basins.”

## Public-site rule

Engineer for future sources without advertising them as completed research before they have actually been reviewed.
