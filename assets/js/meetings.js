/* ==========================================================================
   Meetings Explorer: GSA Board Meetings evidence stream (WaterOne).
   --------------------------------------------------------------------------
   Findings coded from GSA board and committee meetings. Meeting evidence is
   what was said in a meeting, not what an agency adopted, so these cards
   always show the meeting, the speaker's role and the excerpt type, and they
   are kept in their own tab rather than mixed into the policy findings.

   The data file is large, so it loads only when the tab is first opened.
   ========================================================================== */

import { createExplorer, loadData, el, highlight } from './explorer.js';

const FINDING_TYPE_LABEL = {
  positive: 'Positive finding',
  absence: 'Not found in reviewed meetings',
  ambiguous: 'Ambiguous',
};
const SCOPE_LABEL = {
  case_study: 'Case-study subbasins',
  other_subbasin: 'Other subbasins',
};
const CONFIDENCE_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

const chapterLabel = (v) => (v?.startsWith('1') ? 'Interconnected Surface Water'
  : v?.startsWith('2') ? 'Land Repurposing'
  : v?.startsWith('3') ? 'Community Considerations' : v);
const chapterTag = (v) => (v?.startsWith('1') ? 'gw-tag gw-tag--isw'
  : v?.startsWith('2') ? 'gw-tag gw-tag--mlrp'
  : v?.startsWith('3') ? 'gw-tag gw-tag--community' : 'gw-tag');

function leadFrom(text) {
  if (!text) return null;
  const m = text.match(/^.*?[.?!](?=\s+[A-Z(“"]|$)/s);
  const lead = (m ? m[0] : text).trim();
  return lead.length >= text.trim().length ? null : lead;
}

function block(label, value, { quote = false } = {}) {
  if (!value) return null;
  return el('div', { class: 'gw-evidence__block' },
    el('p', { class: 'gw-evidence__label', text: label }),
    quote ? el('blockquote', { class: 'gw-quote', text: value })
      : el('p', { class: 'gw-evidence__value', text: value }));
}

function renderCard(r, { terms }, labels) {
  const card = el('article', { class: 'gw-card gw-card--meeting', 'data-record-id': r.id, id: r.id });
  card.append(el('div', { class: 'gw-card__tags' },
    r.chapter ? el('span', { class: chapterTag(r.chapter), text: chapterLabel(r.chapter) }) : null,
    el('span', { class: 'gw-tag gw-tag--basin', text: r.basin_short_name || r.subbasin || 'Subbasin not recorded' }),
    r.scope === 'other_subbasin' ? el('span', { class: 'gw-tag', text: 'Outside case studies' }) : null,
    r.finding_type ? el('span', { class: `gw-state gw-state--${r.finding_type}`, text: FINDING_TYPE_LABEL[r.finding_type] }) : null,
  ));

  const lead = leadFrom(r.finding);
  if (lead) {
    card.append(el('p', { class: 'gw-card__lead', html: highlight(lead, terms) }));
    card.append(el('p', { class: 'gw-card__body', html: highlight(r.finding.slice(lead.length).trim(), terms) }));
  } else {
    card.append(el('p', { class: 'gw-card__lead', html: highlight(r.finding || '', terms) }));
  }

  const meeting = [r.meeting_body, r.meeting_date].filter(Boolean).join(', ');
  card.append(el('div', { class: 'gw-card__meta' },
    meeting ? el('span', {}, 'Meeting: ', r.source_url
      ? el('a', { href: r.source_url, target: '_blank', rel: 'noopener', text: meeting })
      : meeting) : null,
    r.section ? el('span', { text: r.section }) : null,
    r.discussion_stage ? el('span', { text: r.discussion_stage }) : null,
    r.dwr_tag ? el('span', { text: `DWR: ${r.dwr_tag}` }) : null,
    r.confidence ? el('span', { text: `Confidence: ${CONFIDENCE_LABEL[r.confidence]}` }) : null,
  ));

  const details = el('details');
  details.append(el('summary', { text: 'Evidence and meeting detail' }));
  const related = r.related_findings || [];
  details.append(el('div', { class: 'gw-evidence' },
    block('Full finding', r.finding),
    block('Quantitative detail', r.quantitative_detail),
    block(labels.evidence_types?.[r.evidence_type] || 'Meeting excerpt', r.evidence_text, { quote: true }),
    block('Agenda item', r.agenda_item),
    block('Speaker role', r.speaker_role),
    block('GSA or entity', r.gsa),
    block('Also discussed on', r.additional_meeting_dates),
    r.source_url ? el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Source' }),
      el('p', { class: 'gw-evidence__value' },
        el('a', { href: r.source_url, target: '_blank', rel: 'noopener', text: 'Meeting recap on WaterOne ↗' })))
      : block('Source', r.source_reference),
    related.length ? el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: `${labels.relations?.[r.relation] || 'Related to'} policy and planning findings` }),
      el('div', { class: 'gw-related' }, related.map((id) => el('a', { href: `findings.html#F-${id}`, text: `F-${id}` }))))
      : null,
    block('Analyst note', r.notes),
  ));
  card.append(details);
  return card;
}

function sectionOptions(byChapter) {
  const map = new Map();
  for (const [chapter, list] of Object.entries(byChapter || {})) {
    for (const s of list) {
      const o = map.get(s.value) || { value: s.value, label: s.value, parents: [] };
      o.parents.push(chapter);
      map.set(s.value, o);
    }
  }
  return [...map.values()].sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true }));
}

let started = false;

async function init(root) {
  if (started) return;
  started = true;
  const data = await loadData('data/processed/meetings.json', root);
  if (!data) return;
  const { records, facets, labels } = data;
  for (const r of records) {
    r.search_text = [r.id, r.subbasin, r.gsa, r.finding, r.quantitative_detail, r.meeting_body,
      r.agenda_item, r.speaker_role, r.evidence_text, r.notes, r.section]
      .filter(Boolean).join(' ').toLowerCase();
  }
  const opts = (list, label) => (list || []).map((o) => ({ value: o.value, label: label ? label(o.value) : o.value, count: o.count }));

  createExplorer({
    root,
    data: records,
    noun: 'meeting findings',
    pageSize: 20,
    paramPrefix: 'm_',
    searchLabel: 'Search meeting findings',
    searchPlaceholder: 'e.g. allocation, dry well, OpenET…',
    filters: [
      { param: 'scope', legend: 'Subbasin group', options: opts(facets.scope, (v) => SCOPE_LABEL[v] || v),
        match: (r, sel) => sel.has(r.scope) },
      { param: 'chapter', legend: 'Chapter', hideCounts: true, options: opts(facets.chapters, chapterLabel),
        match: (r, sel) => sel.has(r.chapter) },
      { param: 'subbasin', legend: 'Subbasin', control: 'select', allLabel: 'All subbasins',
        options: opts(facets.subbasins), match: (r, sel) => sel.has(r.subbasin) },
      { param: 'section', legend: 'Section', control: 'select', dependsOn: 'chapter',
        options: sectionOptions(facets.sections), match: (r, sel) => sel.has(r.section) },
      { param: 'type', legend: 'Finding type', options: opts(facets.finding_types, (v) => FINDING_TYPE_LABEL[v] || v),
        match: (r, sel) => sel.has(r.finding_type) },
      { param: 'stage', legend: 'Discussion stage', options: opts(facets.discussion_stages),
        match: (r, sel) => sel.has(r.discussion_stage) },
      { param: 'dwr', legend: 'DWR category', options: opts(facets.dwr_tags),
        match: (r, sel) => sel.has(r.dwr_tag) },
      { param: 'relation', legend: 'Relation to desktop findings', advanced: true,
        options: opts(facets.relations, (v) => labels.relations?.[v] || v), match: (r, sel) => sel.has(r.relation) },
      { param: 'gsa', legend: 'GSA or entity', control: 'select', allLabel: 'All GSAs and entities', advanced: true,
        options: opts(facets.gsas), match: (r, sel) => sel.has(r.gsa) },
      { param: 'evidence', legend: 'Excerpt type', advanced: true,
        options: opts(facets.evidence_types, (v) => labels.evidence_types?.[v] || v), match: (r, sel) => sel.has(r.evidence_type) },
      { param: 'confidence', legend: 'Confidence', advanced: true,
        options: ['high', 'medium', 'low'].map((v) => facets.confidence.find((o) => o.value === v)).filter(Boolean)
          .map((o) => ({ value: o.value, label: CONFIDENCE_LABEL[o.value], count: o.count })),
        match: (r, sel) => sel.has(r.confidence) },
    ],
    sorts: [
      { value: 'date', label: 'Meeting date (newest)', compare: (a, b) => (b.meeting_date || '').localeCompare(a.meeting_date || '') || a.id.localeCompare(b.id) },
      { value: 'subbasin', label: 'Subbasin', compare: (a, b) => (a.subbasin || '').localeCompare(b.subbasin || '') || (b.meeting_date || '').localeCompare(a.meeting_date || '') },
      { value: 'id', label: 'Record ID', compare: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }) },
    ],
    renderCard: (r, ctx) => renderCard(r, ctx, labels || {}),
  });
}

function boot() {
  const panel = document.getElementById('panel-meetings');
  const root = document.getElementById('meetings-explorer');
  if (!panel || !root) return;
  if (!panel.hidden) { init(root); return; }
  const obs = new MutationObserver(() => {
    if (!panel.hidden) { obs.disconnect(); init(root); }
  });
  obs.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
