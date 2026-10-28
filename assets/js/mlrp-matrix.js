/* ==========================================================================
   MLRP co-benefits matrix — "Beyond water savings".
   --------------------------------------------------------------------------
   Renders data/processed/mlrp_matrix.json (the analyst's MLRP_Benefits_Matrix
   workbook) into <div id="mlrp-matrix">. Rows are the co-benefits a repurposing
   program claims, each with its own icon; columns are the literature and the
   grantee subbasins. Each cell shows the analyst's measurement state twice —
   as a five-step ladder glyph and as a text label — so state never rests on
   colour alone. Selecting a cell opens how that benefit is quantified there
   (data → process → metric), the caveats, and the cited findings.

   The five states are the analyst's own ordinal scale, not a score of the
   program: they describe how far quantification reaches, from "not found in
   the reviewed documents" to "outcome quantified".
   ========================================================================== */

import { el, loadData } from './explorer.js';

// 24×24 stroke icons, one per benefit (keyed by the benefit slug).
const ICONS = {
  'habitat-ecosystem-function': '<path d="M5 19c0-7 5-12 14-13-1 9-6 14-13 14"/><path d="M5 19c3-4 6-7 10-9"/>',
  'water-quality': '<path d="M12 3.5c3.2 4 5.5 7.3 5.5 10.2A5.5 5.5 0 0 1 6.5 13.7C6.5 10.8 8.8 7.5 12 3.5z"/><path d="m9.3 13.6 1.9 1.9 3.6-3.7"/>',
  'air-quality-dust': '<path d="M3 8h10.5a2.5 2.5 0 1 0-2.4-3.1"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.4 3.1"/><path d="M3 17h7"/><circle cx="19" cy="7" r=".6"/><circle cx="21" cy="11" r=".6"/><circle cx="15" cy="20" r=".6"/>',
  'flood-resilience': '<path d="M3 15c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/><path d="M3 19.5c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0"/><path d="M7 11V7l5-3.5L17 7v4"/>',
  'community-health-equity': '<circle cx="8" cy="7" r="2.4"/><circle cx="16.5" cy="7" r="2.4"/><path d="M3.5 19v-2a4.5 4.5 0 0 1 9 0v2"/><path d="M12 19v-2a4.5 4.5 0 0 1 9 0v2"/>',
  'drinking-water-security': '<path d="M6 4h7a3 3 0 0 1 3 3v2"/><path d="M4 4h2v4H4z"/><path d="M14 9h4v3h-4z"/><path d="M16 15.5c1.4 1.7 2.3 3 2.3 4.1a2.3 2.3 0 0 1-4.6 0c0-1.1.9-2.4 2.3-4.1z"/>',
  'agricultural-economic-resilience': '<path d="M12 21V9"/><path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 13c3 0 5-2 5-5-3 0-5 2-5 5z"/><path d="M12 9c-2 0-3.5-1.6-3.5-4 2 0 3.5 1.6 3.5 4z"/><path d="M12 9c2 0 3.5-1.6 3.5-4-2 0-3.5 1.6-3.5 4z"/>',
  'recreation-public-access': '<path d="M12 3 6.5 11h3L5 17h14l-4.5-6h3z"/><path d="M12 17v4"/>',
};

const svgIcon = (slug) => el('span', {
  class: 'gw-mx__icon', 'aria-hidden': 'true',
  html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[slug] || '<circle cx="12" cy="12" r="7"/>'}</svg>`,
});

// Ladder glyph: one segment per measurement state above "not found".
function ladder(rank, steps) {
  const g = el('span', { class: 'gw-mx__ladder', 'aria-hidden': 'true' });
  for (let i = 1; i < steps; i++) g.append(el('span', { class: i <= rank ? 'is-on' : '' }));
  return g;
}

function detail(benefit, col, cell, levels) {
  const level = levels.find((l) => l.id === cell.state);
  const d = cell.detail || {};
  const stateSentence = (cell.state_text || '').replace(/^[^.]*\.\s*/, '');
  const ids = cell.finding_ids || [];
  return el('div', { class: 'gw-mx__detail' },
    el('div', { class: 'gw-mx__dhead' },
      svgIcon(benefit.id),
      el('div', {},
        el('p', { class: 'gw-mx__dkicker', text: `${benefit.name} · ${col.label}` }),
        el('p', { class: 'gw-mx__dstate' }, ladder(level?.rank ?? 0, levels.length), level?.label || '—'),
      ),
    ),
    stateSentence ? el('p', { class: 'gw-mx__dlead', text: stateSentence }) : null,
    el('dl', { class: 'gw-mx__dpm' },
      ...[['Data', cell.data], ['Process', cell.process], ['Metric', cell.metric]]
        .filter(([, v]) => v)
        .flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })]),
    ),
    d.process ? el('details', { class: 'gw-mx__more' },
      el('summary', { text: 'How it is quantified, in detail' }),
      d.data ? el('p', {}, el('strong', { text: 'Data used. ' }), d.data) : null,
      el('p', {}, el('strong', { text: 'Process. ' }), d.process),
      d.metric ? el('p', {}, el('strong', { text: 'Output. ' }), d.metric) : null,
      d.decision ? el('p', {}, el('strong', { text: 'Decision informed. ' }), d.decision) : null,
    ) : null,
    d.gaps ? el('div', { class: 'gw-mx__dgaps' }, el('p', { class: 'gw-mx__dkicker', text: 'Gaps, caveats & open questions' }), el('p', { text: d.gaps })) : null,
    ids.length ? el('p', { class: 'gw-mx__dlinks' },
      el('a', { class: 'gw-btn gw-btn--quiet', href: `findings.html?ids=${ids.join(',')}`, text: `Open the ${ids.length} cited finding${ids.length > 1 ? 's' : ''} →` })) : null,
    !ids.length && cell.sources ? el('p', { class: 'gw-mx__dsrc', text: cell.sources }) : null,
  );
}

async function init() {
  const root = document.getElementById('mlrp-matrix');
  if (!root) return;
  const data = await loadData('data/processed/mlrp_matrix.json', root);
  if (!data) return;
  root.classList.remove('gw-loading');

  const { levels, columns, benefits } = data;
  const rankOf = Object.fromEntries(levels.map((l) => [l.id, l.rank]));

  const legend = el('div', { class: 'gw-mx__legend', role: 'list', 'aria-label': 'Measurement states, from least to most quantified' },
    ...levels.map((l) => el('span', { class: `gw-mx__key gw-mx--r${l.rank}`, role: 'listitem' }, ladder(l.rank, levels.length), l.label)));

  const panel = el('div', { class: 'gw-mx__panel', 'aria-live': 'polite' },
    el('p', { class: 'gw-mx__hint', text: 'Select any cell to see how that benefit is quantified, the caveats, and the evidence behind the rating.' }));

  const table = el('table', { class: 'gw-mx__table' });
  table.append(el('caption', { class: 'gw-visually-hidden', text: 'How each MLRP co-benefit is quantified in the literature and in each grantee subbasin' }));
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col', class: 'gw-mx__corner', text: 'Benefit' }),
    ...columns.map((c) => el('th', { scope: 'col', class: c.kind === 'literature' ? 'gw-mx__col--lit' : '' }, c.label)),
  )));

  const tbody = el('tbody');
  let lastGroup = null;
  let selected = null;
  let booting = true;
  for (const b of benefits) {
    if (b.group !== lastGroup) {
      lastGroup = b.group;
      tbody.append(el('tr', { class: 'gw-mx__group' }, el('th', { colspan: String(columns.length + 1), scope: 'colgroup', text: b.group })));
    }
    const row = el('tr', {}, el('th', { scope: 'row', class: 'gw-mx__benefit' }, el('span', { class: 'gw-mx__bwrap' }, svgIcon(b.id), el('span', { text: b.name }))));
    for (const c of columns) {
      const cell = b.cells[c.id];
      if (!cell) { row.append(el('td', { class: 'gw-mx__cell is-empty', text: '—' })); continue; }
      const rank = rankOf[cell.state] ?? 0;
      const level = levels.find((l) => l.id === cell.state);
      const btn = el('button', {
        type: 'button', class: `gw-mx__btn gw-mx--r${rank}`,
        'aria-label': `${b.name}, ${c.label}: ${level?.label || 'unrated'}. Show details.`,
        'aria-pressed': 'false',
        onclick: () => {
          if (selected) selected.setAttribute('aria-pressed', 'false');
          selected = btn;
          btn.setAttribute('aria-pressed', 'true');
          panel.replaceChildren(detail(b, c, cell, levels));
          if (!booting && window.innerWidth < 900) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      }, ladder(rank, levels.length), el('span', { class: 'gw-mx__state', text: level?.label || '—' }));
      row.append(el('td', { class: `gw-mx__cell${c.kind === 'literature' ? ' gw-mx__col--lit' : ''}` }, btn));
    }
    tbody.append(row);
  }
  table.append(tbody);

  root.replaceChildren(
    legend,
    el('div', { class: 'gw-mx__layout' },
      el('div', { class: 'gw-mx__scroll', tabindex: '0', role: 'region', 'aria-label': 'Co-benefits matrix (scrolls sideways on small screens)' }, table),
      panel,
    ),
  );

  // Open on the first basin cell of the first row so the panel is never empty.
  const first = root.querySelector('tbody tr:not(.gw-mx__group) td:not(.gw-mx__col--lit) .gw-mx__btn');
  first?.click();
  booting = false;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
