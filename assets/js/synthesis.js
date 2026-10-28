/* ==========================================================================
   Across the subbasins — topic-by-topic comparison from the analyst synthesis.
   --------------------------------------------------------------------------
   Renders data/processed/synthesis.json into
   <div class="gw-compare" data-chapter="isw">. The reader picks a topic; the
   panel leads with the cross-basin comparison, then shows one card per
   subbasin with the synthesis paragraph (document citations de-emphasised but
   kept), plus the literature context and the topic's gap where the synthesis
   states one. Basin cards are generated from the data, so a new basin's
   paragraphs appear without a page edit.
   ========================================================================== */

import { el, escapeHtml, loadData } from './explorer.js';

const CHAPTER_PARAM = { isw: '1. ISW', mlrp: '2. MLRP', community: '3. Community Considerations' };

// Parenthetical document / author-year citations, rendered quieter than prose.
const CITE = /\((?=[^()]*(?:§|PDF|\bp\.\s|\bpp\.|Table|Appendix|Annual Report|R&amp;R|\bGSP\b|\bTM\b|\bAR\b|et al\.|Rules|Report|Plan|RFP|Application|\d{4}\)))((?:[^()]|\([^()]*\))*)\)/g;

function prose(text) {
  return escapeHtml(text).replace(CITE, (m) => `<span class="gw-cite">${m}</span>`);
}

function basinCard(basin, entry) {
  const body = el('div', { class: 'gw-bcard__text', html: prose(entry.text) });
  const card = el('article', { class: 'gw-bcard' },
    el('h4', { class: 'gw-bcard__name' }, basin.short_name,
      entry.label ? el('span', { class: 'gw-bcard__label', text: entry.label }) : null),
    body,
  );
  const more = el('button', {
    type: 'button', class: 'gw-bcard__more', 'aria-expanded': 'false', text: 'Read more',
    onclick: () => {
      const open = card.classList.toggle('is-open');
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show less' : 'Read more';
    },
  });
  card.append(more);
  // Only offer "Read more" when the clamp actually hides text. Measured when
  // the panel is attached (a detached card has no layout).
  card.checkClamp = () => {
    if (card.classList.contains('is-open')) return;
    more.hidden = body.scrollHeight <= body.clientHeight + 4;
  };
  return card;
}

function topicPanel(topic, chapter, basins, chapterKey) {
  const covered = basins.filter((b) => topic.basins[b.id]);
  const missing = basins.filter((b) => !topic.basins[b.id]);
  const section = `${topic.id} ${topic.title}`;
  const findingsUrl = `findings.html?chapter=${encodeURIComponent(CHAPTER_PARAM[chapterKey])}&section=${encodeURIComponent(section)}`;

  const panel = el('div', { class: 'gw-compare__panel', id: `topic-${topic.id}`, role: 'region', 'aria-label': topic.title, tabindex: '-1' },
    el('p', { class: 'gw-compare__num', text: topic.id }),
    el('h3', { class: 'gw-compare__title', text: topic.title }),
  );

  if (topic.comparison) {
    panel.append(el('div', { class: 'gw-compare__lead' },
      el('p', { class: 'gw-compare__kicker', text: 'Across the subbasins' }),
      el('p', { html: prose(topic.comparison) })));
  }
  if (topic.gaps) {
    panel.append(el('div', { class: 'gw-compare__gap' },
      el('p', { class: 'gw-compare__kicker', text: 'Gap' }),
      el('p', { html: prose(topic.gaps) })));
  }

  panel.append(el('div', { class: 'gw-compare__grid' }, ...covered.map((b) => basinCard(b, topic.basins[b.id]))));

  if (missing.length) {
    panel.append(el('p', { class: 'gw-compare__missing' },
      `${missing.map((b) => b.short_name).join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not covered under this topic in the synthesis`,
      chapter.scope_note ? ' — see the chapter scope note below.' : '.'));
  }

  if (topic.literature) {
    panel.append(el('details', { class: 'gw-compare__lit' },
      el('summary', { text: 'What the literature says' }),
      el('p', { html: prose(topic.literature) })));
  }

  panel.append(el('p', { class: 'gw-compare__links' },
    el('a', { class: 'gw-btn gw-btn--quiet', href: findingsUrl, text: 'Coded findings for this topic →' })));
  return panel;
}

async function init() {
  const roots = document.querySelectorAll('.gw-compare[data-chapter]');
  if (!roots.length) return;
  const [data, basinData] = await Promise.all([
    loadData('data/processed/synthesis.json', roots[0]),
    loadData('data/processed/basins.json', roots[0]),
  ]);
  if (!data || !basinData) return;

  const byId = Object.fromEntries(basinData.basins.map((b) => [b.id, b]));
  const basins = data.basin_order.map((id) => byId[id]).filter(Boolean);

  roots.forEach((root) => {
    const key = root.dataset.chapter;
    const chapter = data.chapters.find((c) => c.id === key);
    root.classList.remove('gw-loading');
    if (!chapter) { root.textContent = ''; return; }

    const topics = chapter.sections;
    const panels = new Map(topics.map((t) => [t.id, topicPanel(t, chapter, basins, key)]));
    const stage = el('div', { class: 'gw-compare__stage', 'aria-live': 'polite' });

    const buttons = topics.map((t) => el('button', {
      type: 'button', class: 'gw-compare__tab', role: 'tab', id: `tab-${t.id}`,
      'aria-selected': 'false', 'data-id': t.id,
      onclick: () => select(t.id, { focus: false }),
    }, el('span', { class: 'gw-compare__tabnum', text: t.id }), el('span', { text: t.title })));

    const picker = el('select', {
      class: 'gw-compare__select', 'aria-label': 'Choose a topic',
      onchange: (e) => select(e.target.value, { focus: false }),
    }, ...topics.map((t) => el('option', { value: t.id, text: `${t.id}  ${t.title}` })));

    function select(id, { focus = false, scroll = false } = {}) {
      if (!panels.has(id)) return;
      buttons.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === id)));
      picker.value = id;
      stage.replaceChildren(panels.get(id));
      requestAnimationFrame(() => stage.querySelectorAll('.gw-bcard').forEach((c) => c.checkClamp?.()));
      if (scroll) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (focus) panels.get(id).focus({ preventScroll: true });
    }

    root.replaceChildren(
      el('div', { class: 'gw-compare__nav' },
        picker,
        el('div', { class: 'gw-compare__tabs', role: 'tablist', 'aria-label': 'Comparison topics', 'aria-orientation': 'vertical' }, ...buttons)),
      stage,
    );
    if (chapter.scope_note || chapter.closing_note) {
      root.after(el('details', { class: 'gw-compare__scope' },
        el('summary', { text: 'Scope and document-set caveats' }),
        chapter.scope_note ? el('p', { html: prose(chapter.scope_note) }) : null,
        chapter.closing_note ? el('p', { html: prose(chapter.closing_note) }) : null));
    }

    const fromHash = () => {
      const m = decodeURIComponent(location.hash).match(/^#topic-(.+)$/);
      if (m && panels.has(m[1])) { select(m[1], { scroll: true, focus: true }); return true; }
      return false;
    };
    if (!fromHash()) select(topics[0].id);
    window.addEventListener('hashchange', fromHash);

    // Links elsewhere on the page (key gaps) jump straight to a topic.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-topic]');
      if (!a || !panels.has(a.dataset.topic)) return;
      e.preventDefault();
      history.replaceState(null, '', `#topic-${a.dataset.topic}`);
      select(a.dataset.topic, { scroll: true, focus: true });
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
