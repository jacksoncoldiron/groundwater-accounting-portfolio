/* ==========================================================================
   Breakdown by Subbasin — data-driven per-basin detail.
   --------------------------------------------------------------------------
   Renders inside every <div class="gw-breakdown" data-chapter="1. ISW">.
   One tab per active subbasin (from data/processed/basins.json, in the
   comparison basin_order); each panel lists that chapter's coded questions,
   grouped by section, with the coded finding type for that basin and a link
   into the filtered Findings Explorer.

   NO SCORE IS ASSIGNED. A row reports the coded finding type; a question that
   was never coded for a basin is labelled "Not coded", a scope statement
   about the analysis rather than an absence finding about the basin. Section
   headings carry stable ids so the lifecycle graphic can link into them.
   ========================================================================== */

import { el, loadData } from './explorer.js';
import { initTabs } from './tabs.js';

const STATE = {
  positive:  { cls: 'gw-state gw-state--positive',  short: 'Documented' },
  absence:   { cls: 'gw-state gw-state--absence',   short: 'Not found in documents' },
  ambiguous: { cls: 'gw-state gw-state--ambiguous', short: 'Ambiguous' },
  mixed:     { cls: 'gw-state gw-state--mixed',     short: 'Mixed' },
  not_coded: { cls: 'gw-state gw-state--not_coded', short: 'Not coded' },
};

const slug = (s) => String(s).toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');

const findingsUrl = (basinId, chapter, section) => {
  const p = new URLSearchParams();
  if (basinId) p.set('basin', basinId);
  if (chapter) p.set('chapter', chapter);
  if (section) p.set('section', section);
  return `findings.html?${p.toString()}`;
};

function cell(cellData, meta, states) {
  if (!cellData || !cellData.state) {
    return el('span', {
      class: STATE.not_coded.cls,
      title: 'This question was not coded for this subbasin — a statement about the analysis, not the basin.',
    }, STATE.not_coded.short);
  }
  const info = STATE[cellData.state] || STATE.not_coded;
  const label = cellData.count > 1 ? `${info.short} (${cellData.count})` : info.short;
  const chip = el('span', {
    class: info.cls, title: states[cellData.state]?.meaning || '',
  }, label);
  if (!cellData.count) return chip;
  return el('a', {
    href: findingsUrl(meta.basinId, meta.chapter, meta.section),
    title: `Open the ${cellData.count} coded finding${cellData.count === 1 ? '' : 's'}`,
  }, chip);
}

function buildPanel({ basin, basinIndex, idBase, chapter, sections, rows, states }) {
  const panelId = `${idBase}-panel-${basin.id}`;
  const tabId = `${idBase}-tab-${basin.id}`;
  const first = basinIndex === 0;

  const tab = el('button', {
    type: 'button', role: 'tab', id: tabId, 'aria-controls': panelId,
    'aria-selected': first ? 'true' : 'false', tabindex: first ? '0' : '-1',
  }, basin.short_name);

  const panel = el('div', {
    id: panelId, role: 'tabpanel', 'aria-labelledby': tabId,
    hidden: first ? null : 'hidden',
  });

  const model = basin.profile && basin.profile.isw_model;
  if (chapter.startsWith('1') && model && model.value) {
    panel.append(el('p', { class: 'gw-note gw-breakdown__model' },
      el('strong', {}, `${model.value}. `), model.detail || ''));
  }

  const dl = el('dl', { class: 'gw-breakdown__list' });
  for (const section of sections) {
    const secRows = rows.filter((r) => r.section === section);
    if (!secRows.length) continue;
    dl.append(el('dt', {
      class: 'gw-breakdown__stage', id: `${idBase}-stage-${slug(section)}`,
    }, section));
    for (const r of secRows) {
      dl.append(el('dd', { class: 'gw-breakdown__q' },
        el('span', { class: 'gw-breakdown__qtext' }, r.subsection),
        cell(r.cells[basin.id], { basinId: basin.id, chapter: r.chapter, section }, states)
      ));
    }
  }
  panel.append(dl);
  return { tab, panel };
}

async function init() {
  const hosts = [...document.querySelectorAll('.gw-breakdown[data-chapter]')];
  if (!hosts.length) return;

  const [comparison, basinData] = await Promise.all([
    loadData('data/processed/comparison.json', hosts[0]),
    loadData('data/processed/basins.json', hosts[0]),
  ]);
  if (!comparison || !basinData) return;

  const states = comparison.cell_states;
  const basins = comparison.basin_order
    .map((id) => basinData.basins.find((b) => b.id === id))
    .filter(Boolean);

  for (const host of hosts) {
    const chapter = host.dataset.chapter;
    const rows = comparison.rows.filter((r) => r.chapter === chapter);
    host.classList.remove('gw-loading');
    if (!rows.length) { host.replaceChildren(); continue; }

    const idBase = host.id || slug(chapter);
    const sections = [...new Set(rows.map((r) => r.section))];

    const roster = el('div', { class: 'gw-subtabs', 'data-tabs': '' });
    const tablist = el('div', { role: 'tablist', 'aria-label': `Subbasin detail — ${chapter}` });
    roster.append(tablist);

    basins.forEach((basin, basinIndex) => {
      const { tab, panel } = buildPanel({
        basin, basinIndex, idBase, chapter, sections, rows, states,
      });
      tablist.append(tab);
      roster.append(panel);
    });

    host.replaceChildren(roster);
    initTabs(host);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
