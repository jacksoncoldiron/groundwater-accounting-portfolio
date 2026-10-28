/* ==========================================================================
   Key gaps — the marquee takeaways of each chapter.
   --------------------------------------------------------------------------
   Renders config/key_gaps.yml (via data/processed/key_gaps.json) into
   <div class="gw-gaps" data-chapter="isw">. Desktop: a sticky numbered index
   beside the gap articles, highlighting the one being read. Phones: the index
   collapses and the articles read as a plain stack. Each gap links to the
   cross-basin comparison topic it draws on and to its filtered evidence.
   ========================================================================== */

import { el, loadData } from './explorer.js';
import { initScrollSteps } from './scroll-steps.js';

const pad = (n) => String(n).padStart(2, '0');

function gapArticle(gap, i, categories) {
  const id = `gap-${gap.id}`;
  const art = el('article', { class: 'gw-gap', id, 'data-step': gap.id, 'aria-labelledby': `${id}-t` });

  art.append(
    el('div', { class: 'gw-gap__head' },
      el('span', { class: 'gw-gap__n', 'aria-hidden': 'true', text: pad(i + 1) }),
      el('div', {},
        el('p', { class: 'gw-gap__issue', text: gap.issue }),
        el('h3', { class: 'gw-gap__t', id: `${id}-t` }, el('span', { class: 'gw-visually-hidden', text: `Gap ${i + 1}: ` }), gap.title),
      ),
    ),
    el('ul', { class: 'gw-gap__cats', 'aria-label': 'DWR finding categories' },
      ...(gap.categories || []).map((c) => el('li', { class: `gw-gap__cat gw-gap__cat--${c}`, text: categories[c] || c }))),
    el('p', { class: 'gw-gap__body', text: gap.body }),
  );

  if (gap.parts?.length) {
    art.append(el('div', { class: 'gw-gap__parts' },
      ...gap.parts.map((p) => el('section', { class: 'gw-gap__part' },
        el('h4', { text: p.title }),
        el('p', { text: p.body }),
        p.topic ? el('a', { class: 'gw-gap__minor', href: `#topic-${p.topic}`, 'data-topic': p.topic, text: 'Compare across subbasins →' }) : null,
      ))));
  }

  if (gap.questions?.length) {
    art.append(el('div', { class: 'gw-gap__questions' },
      el('p', { class: 'gw-gap__qlabel', text: 'Open questions' }),
      el('ul', {}, ...gap.questions.map((q) => el('li', { text: q }))),
    ));
  }

  art.append(el('p', { class: 'gw-gap__links' },
    gap.topic ? el('a', { href: `#topic-${gap.topic}`, 'data-topic': gap.topic, text: 'Compare across subbasins' }) : null,
    gap.findings ? el('a', { href: `findings.html?${gap.findings}`, text: 'See the coded evidence' }) : null,
  ));
  return art;
}

const CHAPTERS = [
  { key: 'isw', n: 1, title: 'Interconnected Surface Water', page: 'isw.html' },
  { key: 'mlrp', n: 2, title: 'Land Repurposing', page: 'mlrp.html' },
  { key: 'community', n: 3, title: 'Community', page: 'community.html' },
];

// Overview: every chapter's gaps as one compact, linked index.
function renderSummary(root, data) {
  root.classList.remove('gw-loading');
  root.replaceChildren(...CHAPTERS.filter((c) => data.chapters[c.key]?.length).map((c) =>
    el('section', { class: `gw-gsum gw-gsum--${c.key}` },
      el('p', { class: 'gw-gsum__ch', text: `Chapter ${c.n}` }),
      el('h3', { class: 'gw-gsum__t' }, el('a', { href: c.page, text: c.title })),
      el('ol', { class: 'gw-gsum__list' }, ...data.chapters[c.key].map((g, i) => el('li', {},
        el('a', { href: `${c.page}#gap-${g.id}` },
          el('span', { class: 'gw-gsum__n', text: pad(i + 1) }),
          el('span', { text: g.title }))))),
    )));
}

async function init() {
  const summary = document.querySelector('.gw-gaps-summary');
  const roots = document.querySelectorAll('.gw-gaps[data-chapter]');
  if (!roots.length && !summary) return;
  const data = await loadData('data/processed/key_gaps.json', summary || roots[0]);
  if (!data) return;
  if (summary) renderSummary(summary, data);

  roots.forEach((root) => {
    const gaps = data.chapters[root.dataset.chapter] || [];
    root.classList.remove('gw-loading');

    const index = el('nav', { class: 'gw-gaps__index', 'aria-label': 'Key gaps in this chapter' },
      el('p', { class: 'gw-gaps__count', text: `${gaps.length} key gaps` }),
      el('ol', {}, ...gaps.map((g, i) => el('li', {},
        el('a', { href: `#gap-${g.id}`, 'data-step-link': g.id },
          el('span', { class: 'gw-gaps__in', text: pad(i + 1) }),
          el('span', { text: g.title }),
        ))),
      ),
    );
    const list = el('div', { class: 'gw-gaps__list' }, ...gaps.map((g, i) => gapArticle(g, i, data.categories || {})));
    root.replaceChildren(index, list);
    initScrollSteps(root);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
