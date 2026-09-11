/* ==========================================================================
   Explore Findings — dataset switch.
   --------------------------------------------------------------------------
   Two independent evidence collections (findings.js, literature.js) mount
   into their own containers on this one page. This script only decides which
   is visible and keeps that choice in the URL as `db=policy|literature`, so
   `findings.html?db=literature&lit_topic=...` is a shareable, reloadable
   view. Both explorers are mounted unconditionally on page load -- the data
   is small and this keeps the switch instant with no re-fetch.
   ========================================================================== */

function init() {
  const switcher = document.querySelector('.gw-dataset-switch');
  if (!switcher) return;

  const buttons = [...switcher.querySelectorAll('button')];
  const panels = {
    policy: document.getElementById('panel-policy'),
    literature: document.getElementById('panel-literature-db'),
  };

  function select(db, { push = false } = {}) {
    for (const btn of buttons) {
      btn.setAttribute('aria-selected', String(btn.dataset.db === db));
    }
    for (const [key, panel] of Object.entries(panels)) {
      if (panel) panel.hidden = key !== db;
    }
    const params = new URLSearchParams(window.location.search);
    if (db === 'policy') params.delete('db');
    else params.set('db', db);
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history[push ? 'pushState' : 'replaceState'](null, '', url + window.location.hash);
  }

  buttons.forEach((btn) => btn.addEventListener('click', () => select(btn.dataset.db, { push: true })));

  window.addEventListener('popstate', () => {
    const db = new URLSearchParams(window.location.search).get('db') === 'literature' ? 'literature' : 'policy';
    select(db);
  });

  const initialDb = new URLSearchParams(window.location.search).get('db') === 'literature' ? 'literature' : 'policy';
  select(initialDb);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
