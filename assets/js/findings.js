/* ==========================================================================
   Findings Explorer — Policy & Planning Documents evidence stream.
   ========================================================================== */

import { createExplorer, loadData, el, highlight, escapeHtml } from './explorer.js';

const FINDING_TYPE_LABEL = {
  positive: 'Positive finding',
  // Never "does not exist". This is a statement about the reviewed documents.
  absence: 'Not found in reviewed documents',
  ambiguous: 'Ambiguous',
};

const FINDING_TYPE_MEANING = {
  positive: 'The reviewed documents describe or measure this.',
  absence: 'The analyst searched the reviewed document set and did not find this. It is not a finding that the practice does not exist.',
  ambiguous: 'The reviewed documents are unclear or internally inconsistent on this point.',
};

const VERIFICATION_LABEL = {
  verified: 'Quote verified',
  unverified: 'Quote not verified',
  not_applicable: 'No quotation to verify',
};

const RELEVANCE_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

const CHAPTER_TAG = (chapter) => {
  if (!chapter) return 'gw-tag';
  if (chapter.startsWith('1')) return 'gw-tag gw-tag--isw';
  if (chapter.startsWith('2')) return 'gw-tag gw-tag--mlrp';
  if (chapter.startsWith('3')) return 'gw-tag gw-tag--community';
  return 'gw-tag';
};

/**
 * Short lead generated from the analyst's own finding text.
 * Takes the first sentence VERBATIM — never rewritten, never summarised, so
 * the lead cannot change the meaning of the finding.
 */
function leadFrom(finding) {
  if (!finding) return null;
  const match = finding.match(/^.*?[.?!](?=\s+[A-Z(“"]|$)/s);
  const lead = (match ? match[0] : finding).trim();
  if (lead.length >= finding.trim().length) return null; // no separate lead needed
  return lead;
}

function evidenceBlock(label, value, { quote = false } = {}) {
  if (!value) return null;
  return el('div', { class: 'gw-evidence__block' },
    el('p', { class: 'gw-evidence__label', text: label }),
    quote
      ? el('blockquote', { class: 'gw-quote', text: value })
      : el('p', { class: 'gw-evidence__value', text: value })
  );
}

function renderCard(record, { terms }, basinsById) {
  const card = el('article', {
    class: 'gw-card',
    'data-record-id': record.id,
    'data-chapter': record.chapter || '',
    id: record.id,
  });

  const typeLabel = FINDING_TYPE_LABEL[record.finding_type] || record.finding_type;

  card.append(el('div', { class: 'gw-card__tags' },
    el('span', { class: 'gw-tag gw-tag--id', text: record.id }),
    record.chapter ? el('span', { class: CHAPTER_TAG(record.chapter), text: record.chapter.replace(/^\d+\.\s*/, '') }) : null,
    el('span', { class: 'gw-tag gw-tag--basin', text: record.basin_short_name }),
    el('span', {
      class: `gw-state gw-state--${record.finding_type}`,
      text: typeLabel,
      title: FINDING_TYPE_MEANING[record.finding_type] || '',
    })
  ));

  const lead = leadFrom(record.finding);
  if (lead) {
    card.append(el('p', { class: 'gw-card__lead', html: highlight(lead, terms) }));
    card.append(el('p', { class: 'gw-card__body', html: highlight(record.finding.slice(lead.length).trim(), terms) }));
  } else {
    card.append(el('p', { class: 'gw-card__lead', html: highlight(record.finding || '', terms) }));
  }

  const meta = el('div', { class: 'gw-card__meta' });
  if (record.source_title) {
    meta.append(record.source_url
      ? el('span', {}, 'Source: ', el('a', { href: record.source_url, text: record.source_title, rel: 'noopener' }))
      : el('span', { text: `Source: ${record.source_title}` }));
  }
  if (record.section) meta.append(el('span', { text: record.section }));
  if (record.gsa) meta.append(el('span', { text: record.gsa }));
  if (record.relevance_gap) meta.append(el('span', { text: `GAP relevance: ${RELEVANCE_LABEL[record.relevance_gap]}` }));
  if (record.relevance_dwr) meta.append(el('span', { text: `DWR relevance: ${RELEVANCE_LABEL[record.relevance_dwr]}` }));
  meta.append(el('span', {
    class: `gw-verif gw-verif--${record.verification_status}`,
    text: VERIFICATION_LABEL[record.verification_status],
  }));
  card.append(meta);

  /* --- evidence expansion --- */
  const details = el('details');
  details.append(el('summary', { text: 'Evidence and source detail' }));
  const body = el('div', { class: 'gw-evidence' });

  body.append(evidenceBlock('Full finding', record.finding));
  body.append(evidenceBlock('Direct quote and source location', record.direct_quote, { quote: true }));

  if (record.finding_type === 'absence' && !record.direct_quote) {
    body.append(el('p', { class: 'gw-evidence__na', text: 'No quotation — this is an absence finding.' }));
  }

  body.append(evidenceBlock('Coding location',
    [record.chapter, record.section, record.subsection].filter(Boolean).join(' › ')));
  body.append(evidenceBlock('Analyst note', record.notes));
  body.append(evidenceBlock('Literature-review question or gap addressed', record.lit_review_gap));

  body.append(el('div', { class: 'gw-evidence__block' },
    el('p', { class: 'gw-evidence__label', text: 'Finding type' }),
    el('p', { class: 'gw-evidence__value', text: `${typeLabel} — ${FINDING_TYPE_MEANING[record.finding_type] || ''}` })
  ));

  if (record.related_findings?.length) {
    body.append(el('div', { class: 'gw-evidence__block' },
      el('p', { class: 'gw-evidence__label', text: 'Related findings' }),
      el('div', { class: 'gw-related' }, record.related_findings.map((rid) =>
        el('a', {
          href: `#F-${rid}`,
          text: `F-${rid}`,
          onclick: (e) => {
            e.preventDefault();
            if (!window.__findingsExplorer?.focusRecord(`F-${rid}`)) {
              // The related finding is filtered out of the current view.
              window.location.search = `?q=F-${rid}`;
            }
          },
        })
      ))
    ));
  }

  details.append(body);
  card.append(details);
  return card;
}

/* ------------------------------------------------------------------------ */

async function init() {
  const root = document.getElementById('findings-explorer');
  if (!root) return;

  const [data, basinData, streamData] = await Promise.all([
    loadData('data/processed/findings.json', root),
    loadData('data/processed/basins.json', root),
    loadData('data/processed/evidence_streams.json', root),
  ]);
  if (!data) return;

  const records = data.records;
  const facets = data.facets;
  const basinsById = Object.fromEntries((basinData?.basins || []).map((b) => [b.id, b]));

  // Every option below is derived from the processed data. Adding a basin or
  // a document adds an option automatically. The six filters someone reaches
  // for first stay in view; Section and the two relevance ratings sit behind
  // "More filters" so the panel doesn't out-scroll the results.
  const filters = [
    {
      param: 'chapter', legend: 'Chapter',
      options: facets.chapters.map((c) => ({ value: c.value, label: c.value, count: c.count })),
      match: (r, sel) => sel.has(r.chapter),
    },
    {
      param: 'basin', legend: 'Subbasin',
      options: facets.basins.map((b) => ({ value: b.value, label: b.label, count: b.count })),
      match: (r, sel) => sel.has(r.basin_id),
    },
    {
      param: 'type', legend: 'Finding type',
      options: facets.finding_types.map((t) => ({
        value: t.value, label: FINDING_TYPE_LABEL[t.value] || t.value, count: t.count,
      })),
      match: (r, sel) => sel.has(r.finding_type),
    },
    {
      param: 'gsa', legend: 'GSA or scope',
      options: facets.gsas.map((g) => ({ value: g.value, label: g.label, count: g.count })),
      match: (r, sel) => sel.has(r.gsa),
    },
    {
      param: 'document', legend: 'Source document',
      options: facets.documents.map((d) => ({ value: d.value, label: d.value, count: d.count })),
      match: (r, sel) => sel.has(r.source_title),
    },
    {
      param: 'verified', legend: 'Quote verification',
      options: facets.verification.map((v) => ({
        value: v.value, label: VERIFICATION_LABEL[v.value] || v.value, count: v.count,
      })),
      match: (r, sel) => sel.has(r.verification_status),
    },
    {
      param: 'section', legend: 'Section', advanced: true,
      options: Object.values(facets.sections).flat()
        .map((s) => ({ value: s.value, label: s.value, count: s.count }))
        .sort((a, b) => a.value.localeCompare(b.value)),
      match: (r, sel) => sel.has(r.section),
    },
    {
      param: 'gap', legend: 'Relevance to GAP', advanced: true,
      options: ['high', 'medium', 'low']
        .map((v) => facets.relevance_gap.find((o) => o.value === v))
        .filter(Boolean)
        .map((o) => ({ value: o.value, label: RELEVANCE_LABEL[o.value], count: o.count })),
      match: (r, sel) => sel.has(r.relevance_gap),
    },
    {
      param: 'dwr', legend: 'Relevance to DWR recommendations', advanced: true,
      options: ['high', 'medium', 'low']
        .map((v) => facets.relevance_dwr.find((o) => o.value === v))
        .filter(Boolean)
        .map((o) => ({ value: o.value, label: RELEVANCE_LABEL[o.value], count: o.count })),
      match: (r, sel) => sel.has(r.relevance_dwr),
    },
  ];

  // The Evidence Stream control appears only when more than one stream
  // actually carries findings-shaped evidence — so it materialises on its own
  // if a board-meeting stream is ever activated, with no page edit.
  const findingStreams = [...new Set(records.map((r) => r.evidence_stream))];
  if (findingStreams.length > 1) {
    const streamsById = Object.fromEntries((streamData?.streams || []).map((s) => [s.id, s]));
    filters.unshift({
      param: 'stream', legend: 'Evidence stream',
      options: findingStreams.map((id) => ({
        value: id,
        label: streamsById[id]?.name || id,
        count: records.filter((r) => r.evidence_stream === id).length,
      })),
      match: (r, sel) => sel.has(r.evidence_stream),
    });
  }

  const explorer = createExplorer({
    root,
    data: records,
    filters,
    noun: 'findings',
    pageSize: 25,
    searchLabel: 'Search findings',
    searchPlaceholder: 'e.g. depletion, appeal, OpenET, F-165…',
    sorts: [
      { value: 'id', label: 'Row ID', compare: (a, b) => Number(a.row_id) - Number(b.row_id) },
      {
        value: 'gap', label: 'Relevance to GAP',
        compare: (a, b) => rank(a.relevance_gap) - rank(b.relevance_gap) || Number(a.row_id) - Number(b.row_id),
      },
      {
        value: 'dwr', label: 'Relevance to DWR',
        compare: (a, b) => rank(a.relevance_dwr) - rank(b.relevance_dwr) || Number(a.row_id) - Number(b.row_id),
      },
      {
        value: 'chapter', label: 'Chapter and section',
        compare: (a, b) => (a.chapter || '').localeCompare(b.chapter || '')
          || (a.section || '').localeCompare(b.section || '')
          || Number(a.row_id) - Number(b.row_id),
      },
    ],
    renderCard: (r, ctx) => renderCard(r, ctx, basinsById),
  });

  window.__findingsExplorer = explorer;

  // Deep link to a specific finding: findings.html#F-165
  if (window.location.hash.startsWith('#F-')) {
    const id = window.location.hash.slice(1);
    setTimeout(() => {
      if (!explorer.focusRecord(id)) {
        explorer.showAll();
        setTimeout(() => explorer.focusRecord(id), 60);
      }
    }, 120);
  }
}

const rank = (v) => ({ high: 0, medium: 1, low: 2 }[v] ?? 3);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
