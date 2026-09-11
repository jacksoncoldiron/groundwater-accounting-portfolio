/* ==========================================================================
   "Further Exploration" — open questions as expandable chips.
   --------------------------------------------------------------------------
   Reads data/interactive/further-<key>.json for a chapter's container:

     <div class="gw-further" data-further="isw"></div>

   Schema:
     { "status": "placeholder" | "final",
       "questions": [ { "q": "…", "note": "…" } ] }

   Each question is a chip; activating it expands a short note. Placeholder
   questions ship marked as such and are clearly labelled in the UI. This is a
   deliberately simple first pass — see the HTML comment in each chapter page
   for richer presentation ideas (word cloud, constellation, "pick a thread").
   ========================================================================== */

import { el, loadData } from './explorer.js';

function render(host, data) {
  host.classList.remove('gw-loading');
  const questions = Array.isArray(data && data.questions) ? data.questions : [];
  if (!questions.length) { host.replaceChildren(); return; }

  const placeholder = (data.status || 'placeholder') !== 'final';
  const chips = el('div', { class: 'gw-further__chips' });
  const panels = el('div');

  questions.forEach((item, i) => {
    const panelId = `${host.id || 'further'}-q${i}`;
    const chip = el('button', {
      type: 'button', class: 'gw-further__chip',
      'aria-expanded': 'false', 'aria-controls': panelId,
    }, item.q);
    const panel = el('div', {
      id: panelId, class: 'gw-further__panel', hidden: 'hidden',
    }, item.note || '');
    chip.addEventListener('click', () => {
      const open = chip.getAttribute('aria-expanded') === 'true';
      chip.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.hidden = open;
    });
    chips.append(chip);
    panels.append(panel);
  });

  const parts = [chips, panels];
  if (placeholder) {
    parts.unshift(el('p', { class: 'gw-note' },
      'Placeholder questions — the final set of open questions for this chapter is still being written.'));
  }
  host.replaceChildren(...parts);
}

async function init() {
  const hosts = [...document.querySelectorAll('.gw-further[data-further]')];
  for (const host of hosts) {
    const data = await loadData(`data/interactive/further-${host.dataset.further}.json`, host);
    if (data) render(host, data);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
