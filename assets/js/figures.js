/* ==========================================================================
   Data-driven chapter figures.
   --------------------------------------------------------------------------
   Both components below are generated from data/processed/comparison.json and
   data/processed/basins.json. Neither knows any basin name, and both scale to
   roughly 3-12 active basins:

     * up to BASIN_COLUMN_LIMIT active basins -> basins as columns
     * beyond that                            -> basins as rows, one block per
                                                 question, so the table never
                                                 needs a horizontal squeeze

   NO SCORE IS ASSIGNED ANYWHERE. A cell reports the coded finding type, and
   `not_coded` is rendered as a scope statement about the analysis rather than
   as an absence finding about the basin.
   ========================================================================== */

import { el, loadData } from './explorer.js';

const BASIN_COLUMN_LIMIT = 6;

const STATE_CLASS = {
  positive: 'gw-state gw-state--positive',
  absence: 'gw-state gw-state--absence',
  ambiguous: 'gw-state gw-state--ambiguous',
  mixed: 'gw-state gw-state--mixed',
  not_coded: 'gw-state gw-state--not_coded',
};

/** Short cell label. Long-form meaning goes in the title attribute + legend. */
const STATE_SHORT = {
  positive: 'Documented',
  absence: 'Not found in documents',
  ambiguous: 'Ambiguous',
  mixed: 'Mixed',
  not_coded: 'Not coded',
};

const findingsUrl = ({ basinId, chapter, section, subsection }) => {
  const p = new URLSearchParams();
  if (basinId) p.set('basin', basinId);
  if (chapter) p.set('chapter', chapter);
  if (section) p.set('section', section);
  if (subsection) p.set('q', subsection.slice(0, 60));
  return `findings.html?${p.toString()}`;
};

function cellNode(cell, meta, states) {
  const label = STATE_SHORT[cell.state] || cell.state;
  const meaning = states[cell.state]?.meaning || '';
  const chip = el('span', {
    class: STATE_CLASS[cell.state] || 'gw-state',
    // Show the tally only when it adds information — a bare "(1)" is noise.
    text: cell.count > 1 ? `${label} (${cell.count})` : label,
  });
  if (!cell.count) {
    return el('span', { title: meaning }, chip);
  }
  return el('a', {
    href: findingsUrl(meta),
    title: `${meaning} — open the ${cell.count} coded finding${cell.count === 1 ? '' : 's'}`,
  }, chip);
}

function legendNode(states) {
  return el('div', { class: 'gw-legend' },
    Object.entries(states).map(([key, info]) =>
      el('span', { class: STATE_CLASS[key], text: info.label, title: info.meaning })
    )
  );
}

/* --- comparison matrix -------------------------------------------------- */

function buildMatrix({ rows, basins, states, caption, chapter }) {
  const themeClass = chapter.startsWith('2') ? 'gw-figure--land' : chapter.startsWith('1') ? 'gw-figure--water' : '';
  const wrap = el('div', { class: themeClass || undefined });

  if (basins.length > BASIN_COLUMN_LIMIT) {
    // Basins-as-rows layout: one block per question. Stays readable however
    // many basins are active.
    for (const row of rows) {
      const block = el('section', { class: `gw-figure ${themeClass}`.trim() },
        el('h3', { class: 'gw-figure__title', text: row.subsection }),
        el('p', { class: 'gw-note', text: `${row.chapter} › ${row.section}` }),
        el('div', { class: 'gw-matrix-wrap' },
          el('table', { class: 'gw-matrix' },
            el('tbody', {}, basins.map((b) => el('tr', {},
              el('th', { scope: 'row', text: b.short_name }),
              el('td', {}, cellNode(row.cells[b.id], {
                basinId: b.id, chapter: row.chapter, section: row.section,
              }, states))
            )))
          )
        )
      );
      wrap.append(block);
    }
    wrap.append(legendNode(states));
    return wrap;
  }

  const table = el('table', { class: 'gw-matrix' });
  table.append(el('caption', { text: caption }));
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col', text: 'Question asked of each subbasin' }),
    ...basins.map((b) => el('th', { scope: 'col', text: b.short_name }))
  )));

  const tbody = el('tbody');
  let lastSection = null;
  for (const row of rows) {
    if (row.section !== lastSection) {
      lastSection = row.section;
      tbody.append(el('tr', {}, el('th', {
        colspan: basins.length + 1,
        scope: 'colgroup',
        class: 'gw-matrix__section-row',
        text: row.section,
      })));
    }
    tbody.append(el('tr', {},
      el('th', { scope: 'row', text: row.subsection }),
      ...basins.map((b) => el('td', {}, cellNode(row.cells[b.id], {
        basinId: b.id, chapter: row.chapter, section: row.section,
      }, states)))
    ));
  }
  table.append(tbody);

  wrap.append(el('div', { class: 'gw-matrix-wrap' }, table));
  wrap.append(legendNode(states));
  wrap.append(el('p', { class: 'gw-caption' },
    'Selecting a cell opens the coded findings behind it. ',
    el('a', { href: `findings.html?chapter=${encodeURIComponent(chapter)}`, text: 'Open all findings for this chapter →' })
  ));
  return wrap;
}

/* --- ISW basin tracks --------------------------------------------------- */

/**
 * A per-basin track through the ISW chain. Stages are the coded SECTIONS of
 * the ISW chapter, in the analyst's own order -- so the component is generated
 * from the coding frame rather than from a hand-written list of stages.
 */
const SNAKE_COLS = 4;

/** Boustrophedon placement: row 1 left→right, row 2 right→left, row 3 L→R … so
 *  the 4 / 4 / 2 grid of stage cards reads as one snaking path. Scales to any
 *  number of stages. Also tags each card with the connector direction to draw. */
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

function buildTracks({ rows, basins, states }) {
  const iswRows = rows.filter((r) => r.chapter && r.chapter.startsWith('1'));
  // Analyst order (order of first appearance), not alphabetical — the snake
  // depends on 1.1…1.8 then Data Sources, Formal Mechanisms.
  const sections = [...new Set(iswRows.map((r) => r.section))];

  const wrap = el('div');
  for (const basin of basins) {
    const track = el('section', { class: 'gw-figure gw-figure--water' });
    track.append(el('h3', { class: 'gw-figure__title', text: basin.name }));

    const profile = basin.profile || {};
    if (profile.isw_model?.value) {
      track.append(el('p', { class: 'gw-note', style: 'margin-bottom:1rem' },
        el('strong', { text: 'Model: ' }), profile.isw_model.value,
        profile.isw_model.detail ? ` — ${profile.isw_model.detail}` : ''));
    }

    const snake = el('ol', { class: 'gw-snake', style: '--accent: var(--isw)' });
    sections.forEach((section, i) => {
      const inSection = iswRows.filter((r) => r.section === section);
      const cells = inSection.map((r) => r.cells[basin.id]).filter(Boolean);
      const coded = cells.filter((c) => c.count > 0);

      // A section groups several coded questions, so a single verdict would
      // usually collapse to "mixed" and say nothing. Report the breakdown by
      // finding type instead -- still purely derived, and far more legible.
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
        note.append(cellNode({ state: 'not_coded', count: 0 }, {}, states));
      } else {
        for (const state of ['positive', 'ambiguous', 'absence']) {
          if (!byState[state]) continue;
          note.append(el('span', { style: 'display:block' },
            cellNode({ state, count: byState[state] }, {
              basinId: basin.id, chapter: '1. ISW', section,
            }, states)
          ));
        }
      }
      step.append(note);
      snake.append(step);
    });

    track.append(el('div', { class: 'gw-figure__body' },
      el('p', { class: 'gw-sr-summary', text: `Track for ${basin.name} across the coded ISW sections, laid out as a snaking 4-4-2 path.` }),
      snake
    ));
    wrap.append(track);
  }
  wrap.append(legendNode(states));
  return wrap;
}

/* --- boot --------------------------------------------------------------- */

async function init() {
  const targets = ['isw-tracks', 'mlrp-matrix', 'community-matrix']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!targets.length) return;

  const host = targets[0];
  const [comparison, basinData] = await Promise.all([
    loadData('data/processed/comparison.json', host),
    loadData('data/processed/basins.json', host),
  ]);
  if (!comparison || !basinData) return;

  const basins = comparison.basin_order
    .map((id) => basinData.basins.find((b) => b.id === id))
    .filter(Boolean);
  const states = comparison.cell_states;

  const tracksRoot = document.getElementById('isw-tracks');
  if (tracksRoot) {
    tracksRoot.classList.remove('gw-loading');
    tracksRoot.replaceChildren(buildTracks({ rows: comparison.rows, basins, states }));
  }

  const forChapter = (prefix) => comparison.rows
    // Only questions actually put to more than one basin belong in a
    // cross-basin comparison.
    .filter((r) => r.chapter?.startsWith(prefix) && r.basins_covered >= 2);

  const mlrpRoot = document.getElementById('mlrp-matrix');
  if (mlrpRoot) {
    mlrpRoot.classList.remove('gw-loading');
    mlrpRoot.replaceChildren(buildMatrix({
      rows: forChapter('2'), basins, states, chapter: '2. MLRP',
      caption: 'Land repurposing questions answered for two or more subbasins. Each cell reports the coded finding type — no score is assigned.',
    }));
  }

  const communityRoot = document.getElementById('community-matrix');
  if (communityRoot) {
    communityRoot.classList.remove('gw-loading');
    communityRoot.replaceChildren(buildMatrix({
      rows: forChapter('3'), basins, states, chapter: '3. Community Considerations',
      caption: 'Community questions answered for two or more subbasins. Each cell reports the coded finding type — no score is assigned.',
    }));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
