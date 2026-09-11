/* ==========================================================================
   "Beyond" — WaterOne / GSA board-meeting locator.  SCAFFOLD, NOT PUBLISHED.
   --------------------------------------------------------------------------
   Reads data/interactive/beyond-<key>.json for a chapter's container:

     <div class="gw-locator" data-beyond="isw"></div>

   Schema:
     { "status": "placeholder" | "published",
       "pins": [ { "id", "x", "y", "title", "text", "meeting", "url" } ] }
     x, y are percentages (0-100) of the map box.

   Until real, verified board-meeting evidence is added, every data file ships
   with an empty `pins` array and the section renders an explicit "not yet
   published" state — the site must never imply meetings were reviewed
   (CLAUDE.md §2.4, §7). No pin content is invented here.
   ========================================================================== */

import { el, loadData } from './explorer.js';

/* A rough, stylised California outline — decorative context only. */
const CA_PATH =
  'M20 6 L44 10 L52 30 L74 60 L88 96 L96 128 L120 150 L150 182 ' +
  'L150 214 L120 214 L92 208 L64 214 L44 206 L40 168 L30 128 ' +
  'L22 92 L14 56 L14 26 Z';

function mapSvg(pins, onPick) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'gw-locator__map');
  svg.setAttribute('viewBox', '0 0 170 224');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label',
    'Locator map of California with points marking GSA board-meeting evidence.');

  const outline = document.createElementNS(svg.namespaceURI, 'path');
  outline.setAttribute('d', CA_PATH);
  outline.setAttribute('fill', 'var(--surface)');
  outline.setAttribute('stroke', 'var(--isw)');
  outline.setAttribute('stroke-width', '1.4');
  svg.append(outline);

  pins.forEach((pin) => {
    const g = document.createElementNS(svg.namespaceURI, 'g');
    g.setAttribute('class', 'gw-locator__pin');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', pin.title || 'Board-meeting note');
    const cx = (pin.x / 100) * 170;
    const cy = (pin.y / 100) * 224;
    const dot = document.createElementNS(svg.namespaceURI, 'circle');
    dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('r', '5');
    dot.setAttribute('fill', 'var(--community)');
    dot.setAttribute('stroke', 'var(--surface)');
    dot.setAttribute('stroke-width', '1.5');
    g.append(dot);
    const act = () => onPick(pin, { x: cx / 170, y: cy / 224 });
    g.addEventListener('click', act);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
    });
    svg.append(g);
  });
  return svg;
}

function render(host, data) {
  host.classList.remove('gw-loading');
  const pins = Array.isArray(data && data.pins) ? data.pins : [];

  if (!pins.length) {
    host.replaceChildren(el('p', { class: 'gw-locator__empty' },
      'No board-meeting evidence has been reviewed yet. When it is, verified ' +
      'points will appear on this map, each linking to the meeting it came from.'));
    return;
  }

  const pop = el('div', {
    class: 'gw-locator__pop', hidden: 'hidden',
    role: 'dialog', 'aria-label': 'Board-meeting note', tabindex: '-1',
  });
  const place = (pin, frac) => {
    pop.replaceChildren(
      el('h4', {}, pin.title || 'Board-meeting note'),
      el('p', {}, pin.text || ''),
      pin.meeting ? el('p', { class: 'gw-note' }, pin.meeting) : null,
      pin.url ? el('p', {}, el('a', { href: pin.url, rel: 'noopener' }, 'Open the source →')) : null,
    );
    pop.setAttribute('aria-label', pin.title || 'Board-meeting note');
    pop.hidden = false;
    pop.style.left = `${Math.min(frac.x * 100, 60)}%`;
    pop.style.top = `${Math.min(frac.y * 100, 70)}%`;
    pop.focus();
  };

  const wrap = el('div', {}, mapSvg(pins, place), pop);
  host.replaceChildren(wrap);
  host.addEventListener('click', (e) => {
    if (!e.target.closest('.gw-locator__pin') && !e.target.closest('.gw-locator__pop')) pop.hidden = true;
  });
}

async function init() {
  const hosts = [...document.querySelectorAll('.gw-locator[data-beyond]')];
  for (const host of hosts) {
    const data = await loadData(`data/interactive/beyond-${host.dataset.beyond}.json`, host);
    if (data) render(host, data);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
