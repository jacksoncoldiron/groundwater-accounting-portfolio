/* ==========================================================================
   Shared explorer engine.
   --------------------------------------------------------------------------
   One small vanilla-JS engine drives both the Findings Explorer and the
   Literature Explorer. No framework, no CDN, no backend: the pages load a
   static JSON file and filter it in the browser.

   Design rules this file enforces:
     * every filter option is DERIVED from the data, never hand-listed
     * filter state is mirrored into the URL query string so any view is
       shareable and deep-linkable from a diagram or an ArcGIS popup
     * results are rendered in chunks rather than all at once
     * absence findings are labelled "not found in reviewed documents" and
       are never rendered as a zero, a failure, or a missing value
   ========================================================================== */

/* --- small helpers ------------------------------------------------------ */

export const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
};

export const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Highlight query terms in already-escaped text. */
export const highlight = (text, terms) => {
  let out = escapeHtml(text);
  if (!terms.length) return out;
  const pattern = terms
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');
  if (!pattern) return out;
  return out.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
};

const tokenize = (q) => q.toLowerCase().split(/[\s,]+/).filter(Boolean);

/* --- URL state ---------------------------------------------------------- */

/**
 * Two-way binding between the filter state and the query string.
 * Multi-select values are comma-joined so URLs stay readable:
 *   findings.html?basin=merced&chapter=1.%20ISW&type=absence
 */
class UrlState {
  /**
   * @param schema  { paramName: 'set' | 'text' } -- unprefixed keys, also used
   *                as the keys of the returned/consumed state object.
   * @param prefix  Optional string prepended to every query-string key, so a
   *                second explorer instance on the same page (e.g. the
   *                literature database sharing a URL with the findings one)
   *                doesn't collide with the first's `q`/`sort`/etc.
   */
  constructor(schema, prefix = '') {
    this.schema = schema;
    this.prefix = prefix;
  }

  read() {
    const params = new URLSearchParams(window.location.search);
    const state = {};
    for (const [key, kind] of Object.entries(this.schema)) {
      const raw = params.get(this.prefix + key);
      if (kind === 'set') {
        state[key] = new Set(
          raw ? raw.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean) : []
        );
      } else {
        state[key] = raw ? decodeURIComponent(raw) : '';
      }
    }
    return state;
  }

  write(state, { replace = true } = {}) {
    // Preserve any params this instance doesn't own (the other explorer's
    // prefixed keys, or a shared `db=` toggle) rather than clobbering them.
    const params = new URLSearchParams(window.location.search);
    for (const [key, kind] of Object.entries(this.schema)) {
      const pkey = this.prefix + key;
      const value = state[key];
      params.delete(pkey);
      if (kind === 'set') {
        if (value && value.size) params.set(pkey, [...value].join(','));
      } else if (value) {
        params.set(pkey, value);
      }
    }
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method](null, '', url + window.location.hash);
  }
}

/* --- filter controls ---------------------------------------------------- */

function checkboxGroup({ legend, name, options, state, onChange, labelKey = 'label' }) {
  const fieldset = el('fieldset', { class: 'gw-fieldset' });
  fieldset.append(el('legend', { text: legend }));
  const selected = state[name];

  for (const opt of options) {
    const id = `${name}-${String(opt.value).replace(/\W+/g, '-')}`;
    const input = el('input', {
      type: 'checkbox',
      id,
      value: opt.value,
      checked: selected.has(String(opt.value)) || null,
      onchange: (e) => {
        if (e.target.checked) selected.add(String(opt.value));
        else selected.delete(String(opt.value));
        onChange();
      },
    });
    const label = el('label', { class: 'gw-check', for: id },
      input,
      el('span', { text: opt[labelKey] ?? opt.value }),
      el('span', { class: 'gw-check__count', text: String(opt.count ?? '') })
    );
    label.dataset.optionValue = opt.value;
    fieldset.append(label);
  }
  return fieldset;
}

/* --- the engine --------------------------------------------------------- */

/**
 * @param {object} config
 *   root            container element
 *   data            array of records
 *   searchField     record key holding the pre-built lowercase haystack
 *   filters         [{ key, param, legend, options, match(record, selected) }]
 *   renderCard      (record, ctx) => Node
 *   sorts           [{ value, label, compare }]
 *   pageSize        results rendered per chunk
 *   noun            plural noun for the count line ("findings")
 */
export function createExplorer(config) {
  const {
    root, data, searchField = 'search_text', filters, renderCard,
    sorts = [], pageSize = 25, noun = 'results', onRendered,
    paramPrefix = '',
  } = config;

  const schema = { q: 'text' };
  for (const f of filters) schema[f.param] = 'set';
  if (sorts.length) schema.sort = 'text';
  const urlState = new UrlState(schema, paramPrefix);

  let state = urlState.read();
  if (sorts.length && !state.sort) state.sort = sorts[0].value;
  let visible = pageSize;

  /* ---- DOM scaffold ---- */
  const searchInput = el('input', {
    type: 'search',
    class: 'gw-search',
    placeholder: config.searchPlaceholder || 'Search…',
    'aria-label': config.searchLabel || 'Search',
    value: state.q,
  });

  // A <div role="complementary"> rather than a bare <aside>: Quarto's theme
  // treats every un-classed <aside> as a margin note and places it in a named
  // column of its own page grid, which would pull the panel out of this
  // layout. The role keeps the semantics for assistive technology.
  const filtersPanel = el('div', {
    class: 'gw-filters', role: 'complementary', 'aria-label': 'Filters',
  });
  const resultsPanel = el('div', { class: 'gw-results' });
  const countLine = el('p', { class: 'gw-results__count', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const chipsRow = el('div', { class: 'gw-active-filters' });
  const list = el('div', { class: 'gw-results__list' });
  const moreRow = el('div', { class: 'gw-more' });

  let sortSelect = null;
  if (sorts.length) {
    sortSelect = el('select', {
      class: 'gw-select', 'aria-label': 'Sort results',
      onchange: (e) => { state.sort = e.target.value; visible = pageSize; commit(); },
    }, sorts.map((s) => el('option', { value: s.value, text: s.label, selected: s.value === state.sort || null })));
  }

  const bar = el('div', { class: 'gw-results__bar' },
    countLine,
    sortSelect ? el('label', { class: 'gw-note' }, 'Sort ', sortSelect) : null
  );

  resultsPanel.append(bar, chipsRow, list, moreRow);
  root.replaceChildren(el('div', { class: 'gw-explorer' }, filtersPanel, resultsPanel));

  /* ---- filtering ---- */

  function apply() {
    const terms = tokenize(state.q);
    return data.filter((record) => {
      for (const f of filters) {
        const selected = state[f.param];
        if (selected.size && !f.match(record, selected)) return false;
      }
      if (terms.length) {
        const hay = record[searchField] || '';
        for (const t of terms) if (!hay.includes(t)) return false;
      }
      return true;
    });
  }

  function activeChips() {
    const chips = [];
    if (state.q) {
      chips.push({ label: `“${state.q}”`, clear: () => { state.q = ''; searchInput.value = ''; } });
    }
    for (const f of filters) {
      for (const value of state[f.param]) {
        const opt = f.options.find((o) => String(o.value) === String(value));
        chips.push({
          label: `${f.legend}: ${opt ? (opt.label ?? opt.value) : value}`,
          clear: () => state[f.param].delete(value),
        });
      }
    }
    return chips;
  }

  /* ---- rendering ---- */

  function commit({ pushUrl = false } = {}) {
    urlState.write(state, { replace: !pushUrl });
    render();
  }

  function render() {
    const terms = tokenize(state.q);
    let results = apply();
    const sort = sorts.find((s) => s.value === state.sort);
    if (sort) results = [...results].sort(sort.compare);

    countLine.replaceChildren(
      el('strong', { text: results.length.toLocaleString() }),
      document.createTextNode(
        ` ${results.length === 1 ? noun.replace(/s$/, '') : noun}` +
        (results.length === data.length ? '' : ` of ${data.length.toLocaleString()}`)
      )
    );

    const chips = activeChips();
    // Node.replaceChildren() stringifies any non-Node argument -- passing a
    // literal `null` here rendered the text "null" whenever 0 or 1 filters
    // were active (i.e. almost always). Build a real array and drop falsy
    // entries instead of relying on replaceChildren to skip them.
    const chipNodes = chips.map((c) => el('span', { class: 'gw-chip' },
      c.label,
      el('button', {
        type: 'button',
        'aria-label': `Remove filter ${c.label}`,
        text: '×',
        onclick: () => { c.clear(); visible = pageSize; commit(); renderFilters(); },
      })
    ));
    if (chips.length > 1) {
      chipNodes.push(el('button', {
        type: 'button', class: 'gw-btn gw-btn--ghost', text: 'Clear all',
        onclick: () => { resetAll(); },
      }));
    }
    chipsRow.replaceChildren(...chipNodes);

    if (!results.length) {
      list.replaceChildren(el('div', { class: 'gw-empty' },
        el('strong', { text: 'No matches' }),
        el('p', { text: 'No records match this combination of filters. Try removing a filter or broadening the search.' }),
        el('button', { type: 'button', class: 'gw-btn', text: 'Reset all filters', onclick: () => resetAll() })
      ));
      moreRow.replaceChildren();
      return;
    }

    const shown = results.slice(0, visible);
    list.replaceChildren(...shown.map((r) => renderCard(r, { terms })));

    moreRow.replaceChildren(
      results.length > visible
        ? el('button', {
            type: 'button', class: 'gw-btn',
            text: `Show ${Math.min(pageSize, results.length - visible)} more (${results.length - visible} remaining)`,
            onclick: (e) => {
              visible += pageSize;
              render();
              // keep keyboard focus somewhere sensible after the list grows
              const next = list.children[visible - pageSize];
              if (next) next.setAttribute('tabindex', '-1'), next.focus();
            },
          })
        : el('p', { class: 'gw-note', text: `Showing all ${results.length.toLocaleString()} ${noun}.` })
    );

    if (onRendered) onRendered(results, shown);
  }

  function resetAll() {
    state.q = '';
    searchInput.value = '';
    for (const f of filters) state[f.param].clear();
    visible = pageSize;
    commit();
    renderFilters();
  }

  function renderFilters() {
    const onChange = () => { visible = pageSize; commit(); };
    const primary = filters.filter((f) => !f.advanced);
    const advanced = filters.filter((f) => f.advanced);

    const panelChildren = [
      el('div', { class: 'gw-filters__head' },
        el('h2', { text: 'Filter' }),
        el('button', { type: 'button', class: 'gw-btn gw-btn--ghost', text: 'Reset', onclick: () => resetAll() })
      ),
      el('fieldset', { class: 'gw-fieldset' },
        el('legend', { text: config.searchLabel || 'Search' }),
        searchInput
      ),
      ...primary.map((f) => checkboxGroup({ legend: f.legend, name: f.param, options: f.options, state, onChange })),
    ];
    // Less commonly needed filters stay out of the way until asked for, so
    // the panel doesn't eat the viewport before a single result is visible.
    if (advanced.length) {
      panelChildren.push(el('details', { class: 'gw-filters__more' },
        el('summary', { text: 'More filters' }),
        ...advanced.map((f) => checkboxGroup({ legend: f.legend, name: f.param, options: f.options, state, onChange }))
      ));
    }
    filtersPanel.replaceChildren(...panelChildren);
  }

  let debounce;
  searchInput.addEventListener('input', (e) => {
    state.q = e.target.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => { visible = pageSize; commit(); }, 180);
  });

  window.addEventListener('popstate', () => {
    state = urlState.read();
    if (sorts.length && !state.sort) state.sort = sorts[0].value;
    searchInput.value = state.q;
    visible = pageSize;
    renderFilters();
    render();
  });

  renderFilters();
  render();

  return {
    /** Scroll to and highlight a record by id — used for related-finding links. */
    focusRecord(id) {
      const node = root.querySelector(`[data-record-id="${CSS.escape(id)}"]`);
      if (!node) return false;
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.classList.add('gw-card--target');
      const open = node.querySelector('details');
      if (open) open.open = true;
      setTimeout(() => node.classList.remove('gw-card--target'), 2600);
      return true;
    },
    showAll() { visible = data.length; render(); },
    get state() { return state; },
  };
}

/** Load a processed JSON file, with a visible failure state rather than a silent one. */
export async function loadData(path, root) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    root.replaceChildren(el('div', { class: 'gw-empty' },
      el('strong', { text: 'Could not load the evidence data' }),
      el('p', { text: `Failed to fetch ${path}. If you are viewing this page from the local filesystem, serve it over HTTP instead — run "quarto preview", or "python3 -m http.server" from the _site directory.` })
    ));
    console.error(err);
    return null;
  }
}
