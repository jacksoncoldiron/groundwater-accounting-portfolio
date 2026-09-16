/* ==========================================================================
   Breakdown by Subbasin — data-driven per-basin detail.
   --------------------------------------------------------------------------
   Renders inside every <div class="gw-breakdown" data-chapter="1. ISW">.
   One tab per active subbasin (from data/processed/basins.json, in the
   comparison basin_order); each panel opens with a compact boustrophedon
   "snake" track — that basin's coded sections at a glance, one card per
   section — then the exhaustive per-question list below it. This is the
   single place a reader sees a subbasin's chapter detail: there is no
   separate "all basins at a glance" table, which only duplicated the same
   coded cells in a different shape.

   NO SCORE IS ASSIGNED. A row (or a snake card) reports the coded finding
   type; a question that was never coded for a basin is labelled "Not coded",
   a scope statement about the analysis rather than an absence finding about
   the basin. Section headings carry stable ids so the lifecycle graphic can
   link into them.
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

// Chapter accent, matched to the semantic chapter colors in styles.css —
// set inline (rather than a CSS modifier class) so the snake stays a plain,
// chapter-agnostic component.
const ACCENT_BY_CHAPTER = {
  '1': ['var(--isw)', 'var(--isw-text)'],
  '2': ['var(--mlrp)', 'var(--mlrp-text)'],
  '3': ['var(--community)', 'var(--community-text)'],
};

const SNAKE_COLS = 4;

/** Boustrophedon placement: row 1 left→right, row 2 right→left, row 3 L→R …
 *  so the 4 / 4 / 2 grid of stage cards reads as one snaking path. Scales to
 *  any number of stages. Also tags each card with the connector direction. */
function placeSnake(step, i, total) {
  const row = Math.floor(i / SNAKE_COLS);
  const posInRow = i % SNAKE_COLS;
  const ltr = row % 2 === 0;
  const col = ltr ? posInRow + 1 : SNAKE_COLS - posInRow;
  step.style.gridColumn = String(col);
  step.style.gridRow = String(row + 1);

  const last = i === total - 1;
  const endOfRow = posInRow === SNAKE_COLS - 1;
  if (last) step.dataset.link = 'none';
  else if (endOfRow) step.dataset.link = 'down';
  else step.dataset.link = ltr ? 'right' : 'left';
}

/** One basin's track across a chapter's coded sections — a compact "at a
 *  glance" view that opens each tab panel, above the exhaustive list. A
 *  section groups several coded questions, so a single verdict would
 *  usually collapse to "mixed" and say nothing; report the breakdown by
 *  finding type instead — still purely derived, and far more legible. */
function buildSnake({ basin, chapter, sections, rows, states }) {
  const [accent, accentText] = ACCENT_BY_CHAPTER[chapter[0]] || ACCENT_BY_CHAPTER['1'];
  const snake = el('ol', {
    class: 'gw-snake',
    style: `--accent: ${accent}; --accent-text: ${accentText}`,
  });

  sections.forEach((section, i) => {
    const inSection = rows.filter((r) => r.section === section);
    const coded = inSection.map((r) => r.cells[basin.id]).filter((c) => c && c.count > 0);

    const byState = {};
    for (const c of coded) {
      for (const [type, n] of Object.entries(c.type_counts || {})) {
        byState[type] = (byState[type] || 0) + n;
      }
    }

    const step = el('li', { class: 'gw-snake__step' });
    if (!coded.length) step.style.borderTopColor = 'var(--state-uncoded)';
    else if (Object.keys(byState).length === 1 && byState.absence) step.style.borderTopStyle = 'dashed';
    placeSnake(step, i, sections.length);

    const numberPrefix = section.match(/^[\d.]+(?=\s)/);
    step.append(el('span', { class: 'gw-snake__n', text: numberPrefix ? numberPrefix[0] : String(i + 1) }));
    step.append(el('span', {
      class: 'gw-snake__label',
      text: numberPrefix ? section.slice(numberPrefix[0].length).trim() : section,
    }));

    const note = el('span', { class: 'gw-snake__note' });
    if (!coded.length) {
      note.append(cell(null, {}, states));
    } else {
      for (const state of ['positive', 'ambiguous', 'absence']) {
        if (!byState[state]) continue;
        note.append(el('span', { style: 'display:block' },
          cell({ state, count: byState[state] }, { basinId: basin.id, chapter, section }, states)
        ));
      }
    }
    step.append(note);
    snake.append(step);
  });

  return el('div', { class: 'gw-breakdown__snake' },
    el('p', { class: 'gw-sr-summary', text: `${basin.name}'s track across the coded sections of this chapter, laid out as a snaking path.` }),
    snake
  );
}

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

  panel.append(buildSnake({ basin, chapter, sections, rows, states }));

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
