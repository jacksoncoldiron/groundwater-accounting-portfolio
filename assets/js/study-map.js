/* ==========================================================================
   Study Area map — Leaflet, static GeoJSON, no backend.
   --------------------------------------------------------------------------
   Layers (data/geo/, fetched by scripts/fetch_geo.py from DWR and USGS):
     subbasins       analysed subbasins, coloured by MLRP block-grant status
     grant_context   other subbasins inside an analysed basin's grant region
     gsas            DWR-registered GSA boundaries (shown for the selection)
     rivers          major rivers, drawn prominently and labelled
   Basemap: Esri World Terrain Base (simple shaded relief, few labels).

   Selecting a subbasin opens its profile (data/processed/basins.json,
   from config/basins.yml + config/basin_profiles.yml) in the side panel.
   <div id="study-map" data-compact> renders the smaller Overview version,
   where a click opens the full map page on that subbasin.
   ========================================================================== */

import { el, loadData } from './explorer.js';

const COLORS = {
  grantee: '#676C57', granteeFill: '#8E9473',
  other: '#9B7251', otherFill: '#C9A98A',
  river: '#2F6F95', riverCase: '#F7F2E8',
};

const initials = (code) => code.replace(/\s*GSA$/i, '').replace(/[^A-Z0-9 ]/g, '').split(/\s+/)
  .map((w) => (w.length <= 5 && w === w.toUpperCase() ? w : w[0])).join('').slice(0, 5);

function sourceLink(item, sources) {
  if (item.source === 'synthesis') {
    return el('span', { class: 'gw-smap__src', text: `Synthesis ${item.ref || ''}`.trim() });
  }
  const label = sources[item.source]?.label || 'Source';
  const url = item.url || sources[item.source]?.url;
  return url ? el('a', { class: 'gw-smap__src', href: url, target: '_blank', rel: 'noopener', text: label })
    : el('span', { class: 'gw-smap__src', text: label });
}

function factList(title, items, sources) {
  if (!items?.length) return null;
  return el('section', { class: 'gw-smap__sec' },
    el('h4', { text: title }),
    el('ul', {}, ...items.map((it) => el('li', {}, it.text, ' ', sourceLink(it, sources)))));
}

function profilePanel(basin, area, sources, gsaNames) {
  const p = basin.map_profile || {};
  const chips = el('p', { class: 'gw-smap__chips' },
    el('span', { class: `gw-smap__chip ${p.grantee ? 'is-grantee' : 'is-other'}`, text: p.grantee ? 'MLRP block grant' : 'No MLRP block grant' }),
    p.critically_overdrafted ? el('a', { class: 'gw-smap__chip', href: sources.cod?.url, target: '_blank', rel: 'noopener', text: 'Critically overdrafted' }) : null,
  );
  const gsas = el('ul', { class: 'gw-smap__gsas' }, ...(basin.gsas || []).map((g) => {
    const logo = p.logos?.[g.code];
    return el('li', {},
      logo ? el('img', { src: `assets/logos/${logo}`, alt: '', class: 'gw-smap__logo' })
        : el('span', { class: 'gw-smap__mono', 'aria-hidden': 'true', text: initials(g.code) }),
      el('span', {}, el('strong', { text: g.name }), g.code && g.code !== g.name ? el('span', { class: 'gw-smap__code', text: g.code }) : null));
  }));

  const extraGsas = gsaNames.filter((n) => !(basin.gsas || []).some((g) => n.toLowerCase().startsWith(g.name.toLowerCase().replace(/ gsa$/i, ''))));

  return el('div', { class: 'gw-smap__profile' },
    el('p', { class: 'gw-smap__region', text: [basin.region, area ? `${Math.round(area).toLocaleString()} sq mi` : null, basin.b118_number ? `B118 ${basin.b118_number}` : null].filter(Boolean).join(' · ') }),
    el('h3', { class: 'gw-smap__name', text: basin.name }),
    chips,
    p.grantee_note ? el('p', { class: 'gw-smap__note', text: p.grantee_note }) : null,
    el('section', { class: 'gw-smap__sec' }, el('h4', { text: 'GSAs in this analysis' }), gsas,
      extraGsas.length ? el('p', { class: 'gw-smap__note', text: `Also registered with DWR here: ${extraGsas.join('; ')}.` }) : null),
    p.indicators?.length ? el('section', { class: 'gw-smap__sec' },
      el('h4', { text: 'Sustainability indicators in focus' }),
      el('ul', { class: 'gw-smap__inds' }, ...p.indicators.map((i) => el('li', {},
        el('strong', { text: i.name }), el('span', { text: i.why }), sourceLink(i, sources))))) : null,
    factList('Setting', p.setting, sources),
    factList('Climate', p.climate, sources),
    factList('Agriculture & land use', p.agriculture, sources),
    factList('Communities', p.communities, sources),
    el('p', { class: 'gw-smap__links' },
      el('a', { class: 'gw-btn', href: `findings.html?basin=${basin.id}`, text: `${basin.findings_count ?? ''} findings from ${basin.short_name} →` })),
  );
}

function midpointOf(parts, bounds) {
  let best = null; let bestLen = 0;
  for (const part of parts) {
    const inside = part.filter(([x, y]) => bounds.contains([y, x]));
    if (inside.length > bestLen) { bestLen = inside.length; best = inside; }
  }
  if (!best || best.length < 6) return null;
  const [x, y] = best[Math.floor(best.length / 2)];
  return [y, x];
}

async function init() {
  const root = document.getElementById('study-map');
  if (!root || !window.L) return;
  const compact = root.hasAttribute('data-compact');
  const [basinData, sub, ctx, gsas, rivers] = await Promise.all([
    loadData('data/processed/basins.json', root),
    loadData('data/geo/subbasins.geojson', root),
    loadData('data/geo/grant_context.geojson', root),
    loadData('data/geo/gsas.geojson', root),
    loadData('data/geo/rivers.geojson', root),
  ]);
  if (!basinData || !sub) return;
  const L = window.L;
  const basins = Object.fromEntries(basinData.basins.filter((b) => b.include_in_analysis).map((b) => [b.id, b]));
  const sources = basinData.profile_sources || {};

  const mapEl = el('div', { class: 'gw-smap__map', role: 'region', 'aria-label': 'Map of the analysed subbasins' });
  const panel = el('div', { class: 'gw-smap__panel', role: 'region', 'aria-label': 'Subbasin details', 'aria-live': 'polite' });
  root.replaceChildren(...(compact ? [mapEl] : [mapEl, panel]));

  const map = L.map(mapEl, { scrollWheelZoom: false, zoomSnap: 0.25, attributionControl: true });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 13, attribution: 'Terrain: Esri, USGS, NOAA · Boundaries: DWR · Rivers: USGS NHD',
  }).addTo(map);
  map.createPane('rivers'); map.getPane('rivers').style.zIndex = 430;
  map.createPane('labels'); map.getPane('labels').style.zIndex = 640;

  const styleFor = (id, on = false) => {
    const g = basins[id]?.map_profile?.grantee;
    return {
      color: g ? COLORS.grantee : COLORS.other, weight: on ? 3.5 : 2,
      fillColor: g ? COLORS.granteeFill : COLORS.otherFill, fillOpacity: on ? 0.5 : 0.32,
    };
  };

  if (ctx?.features?.length) {
    L.geoJSON(ctx, {
      style: { color: COLORS.grantee, weight: 1.2, dashArray: '4 4', fillColor: COLORS.granteeFill, fillOpacity: 0.12 },
      onEachFeature: (f, layer) => layer.bindTooltip(`${f.properties.b118_name.replace(/^SALINAS VALLEY - /, '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} — in the same MLRP grant region, not analysed`, { sticky: true }),
    }).addTo(map);
  }

  const gsaLayer = L.geoJSON(null, {
    style: { color: '#3A3628', weight: 1, dashArray: '2 4', fill: false },
    onEachFeature: (f, layer) => layer.bindTooltip(f.properties.name, { sticky: true }),
  }).addTo(map);

  const areaOf = {};
  const layersById = {};
  const subLayer = L.geoJSON(sub, {
    style: (f) => styleFor(f.properties.basin_id),
    onEachFeature: (f, layer) => {
      const id = f.properties.basin_id;
      areaOf[id] = f.properties.area_sq_mi;
      layersById[id] = layer;
      layer.bindTooltip(basins[id]?.short_name || id, { direction: 'top', className: 'gw-smap__tip' });
      layer.on('click', () => (compact ? (location.href = `map.html#${id}`) : select(id, { zoom: true })));
      layer.on('mouseover', () => layer.setStyle({ weight: 3.5 }));
      layer.on('mouseout', () => layer.setStyle(styleFor(id, id === current)));
    },
  }).addTo(map);

  if (rivers) {
    L.geoJSON(rivers, { pane: 'rivers', style: { color: COLORS.riverCase, weight: 5.5, opacity: 0.85 }, interactive: false }).addTo(map);
    L.geoJSON(rivers, {
      pane: 'rivers', style: { color: COLORS.river, weight: 2.6, opacity: 0.95 },
      onEachFeature: (f, layer) => layer.bindTooltip(f.properties.name, { sticky: true }),
    }).addTo(map);
  }

  const home = subLayer.getBounds().pad(compact ? 0.06 : 0.08);
  map.fitBounds(home);
  // The grid cell gets its final width after Leaflet initialises; keep the
  // map sized to its container.
  let fitted = false;
  new ResizeObserver(() => {
    map.invalidateSize();
    if (!fitted && !current) { map.fitBounds(home); fitted = true; }
  }).observe(mapEl);

  if (rivers && !compact) {
    const viewBounds = home;
    for (const f of rivers.features) {
      const at = midpointOf(f.geometry.coordinates, viewBounds);
      if (at) L.marker(at, { pane: 'labels', interactive: false, icon: L.divIcon({ className: 'gw-smap__rlabel', html: f.properties.name.replace('Colusa Basin Drainage Canal', 'Colusa Basin Drain'), iconSize: null }) }).addTo(map);
    }
  }

  // Legend
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = () => el('div', { class: 'gw-smap__legend' },
    el('span', {}, el('i', { class: 'is-grantee' }), 'MLRP block grant'),
    el('span', {}, el('i', { class: 'is-other' }), 'No MLRP block grant'),
    ctx?.features?.length ? el('span', {}, el('i', { class: 'is-ctx' }), 'Same grant region, not analysed') : null,
    el('span', {}, el('i', { class: 'is-river' }), 'River'),
  );
  legend.addTo(map);

  let current = null;
  const intro = () => el('div', { class: 'gw-smap__intro' },
    el('h3', { class: 'gw-smap__name', text: 'Select a subbasin' }),
    el('p', { text: 'Choose a subbasin on the map or below to see its agencies, setting, and the sustainability indicators most prominent in the record.' }),
    el('ul', { class: 'gw-smap__pick' }, ...Object.values(basins).sort((a, b) => a.order - b.order).map((b) => el('li', {},
      el('button', { type: 'button', onclick: () => select(b.id, { zoom: true }) },
        el('i', { class: b.map_profile?.grantee ? 'is-grantee' : 'is-other', 'aria-hidden': 'true' }),
        el('span', { text: b.short_name }), el('span', { class: 'gw-smap__code', text: b.region })))),
    ));

  function select(id, { zoom = false } = {}) {
    if (!basins[id]) return;
    if (current && layersById[current]) layersById[current].setStyle(styleFor(current));
    current = id;
    layersById[id]?.setStyle(styleFor(id, true));
    layersById[id]?.bringToFront();
    gsaLayer.clearLayers();
    const mine = (gsas?.features || []).filter((f) => f.properties.basin_id === id);
    gsaLayer.addData({ type: 'FeatureCollection', features: mine });
    if (zoom && layersById[id]) map.flyToBounds(layersById[id].getBounds().pad(0.15), { duration: 0.6 });
    const back = el('button', { type: 'button', class: 'gw-smap__back', text: '← All subbasins', onclick: reset });
    panel.replaceChildren(back, profilePanel(basins[id], areaOf[id], sources, mine.map((f) => f.properties.name)));
    panel.scrollTop = 0;
    history.replaceState(null, '', `#${id}`);
  }
  function reset() {
    if (current && layersById[current]) layersById[current].setStyle(styleFor(current));
    current = null;
    gsaLayer.clearLayers();
    map.flyToBounds(home, { duration: 0.6 });
    panel.replaceChildren(intro());
    history.replaceState(null, '', location.pathname);
  }

  if (!compact) {
    const fromHash = location.hash.slice(1);
    if (basins[fromHash]) select(fromHash, { zoom: true }); else panel.replaceChildren(intro());
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
