/* ==========================================================================
   Generic tab roster — progressive enhancement.
   --------------------------------------------------------------------------
   Enhances any container marked `data-tabs`:

     <div class="gw-subtabs" data-tabs>
       <div role="tablist" aria-label="…">
         <button role="tab" aria-controls="panel-merced">Merced</button> …
       </div>
       <div id="panel-merced" role="tabpanel">…</div> …
     </div>

   Full keyboard support (arrow keys, Home/End), only the selected panel in the
   accessibility tree, and a deep link (#panel-<id>, or a fragment inside a
   panel) reveals the right tab. Multiple rosters per page are fine — each is
   scoped to its own container. With no JS every panel just stacks and stays
   readable.
   ========================================================================== */

function initRoster(root) {
  if (root.classList.contains('is-live')) return;   // already enhanced
  const tablist = root.querySelector('[role="tablist"]');
  if (!tablist) return;
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs
    .map((t) => root.querySelector('#' + CSS.escape(t.getAttribute('aria-controls'))))
    .filter(Boolean);
  if (tabs.length < 2 || panels.length !== tabs.length) return;

  root.classList.add('is-live');
  // A tabpanel needs to be focusable so keyboard users reaching it via the tab
  // are not stranded before its content.
  panels.forEach((p) => { if (!p.hasAttribute('tabindex')) p.tabIndex = 0; });

  function select(tab, { focus = false, scroll = false } = {}) {
    tabs.forEach((t, i) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      panels[i].hidden = !on;
    });
    if (focus) tab.focus();
    if (scroll) {
      const y = root.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, { focus: true }); }
    });
  });

  // Deep link: #panel-<id> targeting a tab, or any id inside a panel.
  function openFromHash() {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const node = document.getElementById(id);
    if (!node) return;
    const panel = node.closest('[role="tabpanel"]');
    if (!panel || !root.contains(panel)) return;
    const idx = panels.indexOf(panel);
    if (idx >= 0) select(tabs[idx], { scroll: true });
  }

  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
}

export function initTabs(scope = document) {
  scope.querySelectorAll('[data-tabs]').forEach(initRoster);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initTabs());
} else {
  initTabs();
}
