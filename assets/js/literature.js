/* ==========================================================================
   Literature Explorer — Academic Literature evidence stream.
   --------------------------------------------------------------------------
   Deliberately NOT a bibliography table. Each card leads with the METHOD the
   paper demonstrates, because that is what makes the literature usable for an
   accounting platform.

   The three source sheets have different schemas. A field a sheet simply does
   not have is labelled "not recorded on this sheet" — never rendered as an
   absence, because the analyst was never asked to fill it.
   ========================================================================== */

import { createExplorer, loadData, el, highlight } from './explorer.js';

const RELEVANCE_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

const SHEET_TAG = {
  'Groundwater Accounting': 'gw-tag gw-tag--isw',
  'Land Use Alternatives': 'gw-tag gw-tag--mlrp',
  'Community Considerations': 'gw-tag gw-tag--community',
};

/** Field label + which normalized key holds it, for the evidence expansion.
    Method fields lead -- they're what makes a paper usable to an accounting
    platform -- but stay inside the expansion, not the compact card. */
const EVIDENCE_FIELDS = [
  ['analysis_method', 'How the study was done'],
  ['accounting_method', 'Accounting or M&V method described'],
  ['data_sources', 'Data sources used'],
  ['formal_program_or_crediting', 'Formal crediting or program'],
  ['comparative_finding', 'Comparative finding'],
  ['study_context', 'Study-area context'],
  ['community_selection', 'Who participated and how they were recruited'],
  ['learnings', 'Documented failure points and recommendations'],
  ['accounting_gap', 'Accounting gap identified'],
  ['direct_quotes', 'Direct quotation'],
  ['notes', 'Analyst notes and flags'],
];


function block(label, value, available, { quote = false } = {}) {
  if (value) {
    return el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: label }),
      quote
        ? el('blockquote', { class: 'gw-quote', text: value })
        : el('p', { class: 'gw-evidence__value', text: value })
    );
  }
  if (available) {
    // The sheet HAS this column and the analyst left it empty.
    return el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: label }),
      el('p', { class: 'gw-evidence__na', text: 'Not recorded for this paper.' })
    );
  }
  // The sheet has no such column — say so, rather than implying an absence.
  return null;
}

function renderCard(record, { terms }) {
  const card = el('article', {
    class: 'gw-card',
    'data-record-id': record.id,
    id: record.id,
  });
  const sheet = record.source_sheets[0];
  card.style.setProperty('--accent',
    sheet === 'Groundwater Accounting' ? 'var(--isw)'
    : sheet === 'Land Use Alternatives' ? 'var(--mlrp)'
    : 'var(--community)');

  // Paper, then citation -- both visible before any expansion, so a reader
  // can identify the source without opening the record.
  card.append(el('p', { class: 'gw-card__lead', html: highlight(record.paper, terms) }));
  if (record.citation) {
    card.append(el('p', { class: 'gw-card__cite', html: highlight(truncate(record.citation, 200), terms) }));
  }

  // Research area · geography · relevance, as one tag row.
  card.append(el('div', { class: 'gw-card__tags' },
    el('span', { class: 'gw-tag gw-tag--id', text: record.id }),
    ...record.source_sheets.map((s) => el('span', { class: SHEET_TAG[s] || 'gw-tag', text: s })),
    record.geography ? el('span', { class: 'gw-tag', text: truncate(record.geography, 60) }) : null,
    record.relevance
      ? el('span', { class: 'gw-tag', text: `Relevance: ${RELEVANCE_LABEL[record.relevance]}` })
      : null
  ));

  if (record.key_finding) {
    card.append(el('p', { class: 'gw-card__body', html: highlight(truncate(record.key_finding, 340), terms) }));
  }

  const method = record.accounting_method || record.analysis_method;

  const details = el('details');
  details.append(el('summary', { text: 'Method, quotation and full record' }));
  const body = el('div', { class: 'gw-evidence' });

  const available = new Set(record.fields_available || []);

  // Method leads the expansion -- it's what makes a paper usable to an
  // accounting platform. Citation, geography and key finding are already
  // visible on the compact card and aren't repeated here.
  if (method) {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Method' }),
      el('p', { class: 'gw-evidence__value', text: method })
    ));
  }
  const topics = [record.primary_topic, ...(record.secondary_topics || [])].filter(Boolean);
  if (topics.length) {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Topic' }),
      el('p', { class: 'gw-evidence__value', text: topics.join(' · ') })
    ));
  }
  if (record.doi) {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Persistent link' }),
      el('p', { class: 'gw-evidence__value' },
        el('a', { href: record.doi, rel: 'noopener', text: record.doi }),
        el('span', { class: 'gw-source-ref', style: 'display:block' },
          record.doi_source === 'citation'
            ? 'DOI recorded in the paper\u2019s citation.'
            : 'DOI matched to the consolidated reference list by exact title.')
      )
    ));
  } else {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Persistent link' }),
      el('p', { class: 'gw-evidence__na',
        text: 'No DOI could be matched to this entry with confidence, so none is published.' })
    ));
  }
  for (const [key, label] of EVIDENCE_FIELDS) {
    if (key === 'analysis_method' || key === 'accounting_method') continue; // shown above as "Method"
    body.append(block(label, record[key], available.has(key), { quote: key === 'direct_quotes' }));
  }

  if (record.source_sheets.length > 1) {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Reviewed on more than one topic sheet' }),
      el('p', { class: 'gw-evidence__value',
        text: `This paper was reviewed under ${record.source_sheets.join(' and ')}. Both topical associations are preserved.` })
    ));
  }

  const missingCols = EVIDENCE_FIELDS
    .filter(([k]) => k !== 'analysis_method' && k !== 'accounting_method' && !available.has(k))
    .map(([, l]) => l);
  if (missingCols.length) {
    body.append(el('p', { class: 'gw-evidence__na',
      text: `Not part of the review schema for this sheet: ${missingCols.join('; ')}.` }));
  }

  details.append(body);
  card.append(details);
  return card;
}

const truncate = (s, n) => (s && s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

async function init() {
  const root = document.getElementById('literature-explorer');
  if (!root) return;

  const data = await loadData('data/processed/literature.json', root);
  if (!data) return;

  const { records, facets } = data;

  createExplorer({
    root,
    data: records,
    noun: 'papers',
    pageSize: 15,
    paramPrefix: 'lit_',
    searchLabel: 'Search literature',
    searchPlaceholder: 'Search papers, methods, findings…',
    filters: [
      // Primary filters -- the three questions a reader asks first.
      {
        param: 'area', legend: 'Research area',
        options: facets.source_sheets.map((s) => ({ value: s.value, label: s.value, count: s.count })),
        match: (r, sel) => r.source_sheets.some((s) => sel.has(s)),
      },
      {
        param: 'relevance', legend: 'Relevance',
        options: ['high', 'medium', 'low']
          .map((v) => facets.relevance.find((o) => o.value === v))
          .filter(Boolean)
          .map((o) => ({ value: o.value, label: RELEVANCE_LABEL[o.value], count: o.count })),
        match: (r, sel) => sel.has(r.relevance),
      },
      {
        // Geography is a free-text description in the source (58 distinct
        // strings for 58 papers) -- not usable as a checkbox facet without
        // inventing a taxonomy the analyst didn't code. It stays visible on
        // every card and fully searchable instead. See notes/decisions.md.
        param: 'topic', legend: 'Primary topic',
        options: facets.primary_topics.map((t) => ({ value: t.value, label: t.value, count: t.count })),
        match: (r, sel) => sel.has(r.primary_topic),
      },
      // Secondary filters, tucked behind "More filters".
      {
        param: 'secondary', legend: 'Secondary topic', advanced: true,
        options: facets.secondary_topics.map((t) => ({ value: t.value, label: t.value, count: t.count })),
        match: (r, sel) => (r.secondary_topics || []).some((t) => sel.has(t)),
      },
      {
        param: 'link', legend: 'Persistent link', advanced: true,
        options: [
          { value: 'doi', label: 'Has a DOI', count: records.filter((r) => r.doi).length },
          { value: 'none', label: 'No DOI matched', count: records.filter((r) => !r.doi).length },
        ],
        match: (r, sel) => sel.has(r.doi ? 'doi' : 'none'),
      },
    ],
    sorts: [
      { value: 'paper', label: 'Author', compare: (a, b) => a.paper.localeCompare(b.paper) },
      {
        value: 'relevance', label: 'Relevance',
        compare: (a, b) => rank(a.relevance) - rank(b.relevance) || a.paper.localeCompare(b.paper),
      },
      {
        value: 'area', label: 'Research area',
        compare: (a, b) => (a.source_sheets[0] || '').localeCompare(b.source_sheets[0] || '')
          || a.paper.localeCompare(b.paper),
      },
    ],
    renderCard,
  });
}

const rank = (v) => ({ high: 0, medium: 1, low: 2 }[v] ?? 3);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
