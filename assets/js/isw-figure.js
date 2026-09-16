/* ==========================================================================
   ISW scrollytelling scene — progressive enhancement.
   --------------------------------------------------------------------------
   The cross-section is pinned. Page-scroll progress through the tall
   .isw-scrolly wrapper is mapped to a continuous position along the numbered
   track, which is translated so the active entry always sits in the same
   slot (the vertical centre of the clipped rail). Each entry's opacity
   follows the same broad plateau curve as the other pinned scenes (see
   scrolly-core.js) — faded, fade in, full opacity for a long stretch, fade
   out, faded — and the figure highlight / phase state only switches once the
   incoming step has actually entered that plateau, so the cross-section
   never jumps to a step that's still visibly off from the rail's anchor
   line. CHAIN BREAKS rides in the track between steps 04 and 05 and passes
   through the slot on the way past, fading the same way.

   With no JavaScript the .is-live class is never added and CSS renders a
   plain stacked list — nothing pinned, clipped, or hidden.
   ========================================================================== */

import { scrollyOpacity, scrollyPickActive, scrollyRunwayVh } from './scrolly-core.js';

function init() {
  const scrolly = document.querySelector('.isw-scrolly');
  if (!scrolly) return;
  const stage = scrolly.querySelector('.isw-stage');
  const figwrap = scrolly.querySelector('.isw-figwrap');
  const rail = scrolly.querySelector('.isw-rail');
  const track = scrolly.querySelector('.isw-rail__track');
  if (!stage || !figwrap || !rail || !track) return;

  const items = [...track.children];
  const steps = items.filter((el) => el.dataset.stage && el.dataset.stage !== '_break');
  if (steps.length < 2) return;

  scrolly.classList.add('is-live');

  // Same two-pass sizing as the other pinned scenes: the CSS fallback sizes
  // the sticky stage the instant is-live lands, so measure it once and then
  // size the scroll runway from the actual step count.
  const sizeRunway = () => {
    if (!window.innerHeight || !stage.offsetHeight) return;
    const stageVh = (stage.offsetHeight / window.innerHeight) * 100;
    scrolly.style.setProperty('--runway', `${scrollyRunwayVh(steps.length, stageVh)}vh`);
  };
  sizeRunway();

  const physical = new Set(['pumping', 'response']);
  const centreOf = (el) => el.offsetTop + el.offsetHeight / 2;

  // Average pixel spacing between consecutive steps, used to convert a
  // track item's pixel distance from the anchor into the same "step units"
  // the opacity curve and active-step threshold are defined in. CHAIN BREAKS
  // adds extra height between steps 04 and 05, so this is an approximation
  // over the whole track rather than a per-gap measurement — close enough
  // for a fade curve.
  const unitPx = () => {
    const span = centreOf(steps[steps.length - 1]) - centreOf(steps[0]);
    return span / Math.max(steps.length - 1, 1) || 1;
  };

  let lastActive = -1;
  let raf = 0;
  const update = () => {
    raf = 0;
    const runway = scrolly.offsetHeight - stage.offsetHeight;
    const p = runway > 0 ? Math.min(Math.max(-scrolly.getBoundingClientRect().top / runway, 0), 1) : 0;
    const fpos = p * (steps.length - 1);

    const loI = Math.floor(fpos);
    const hiI = Math.min(loI + 1, steps.length - 1);
    const t = fpos - loI;
    const centre = centreOf(steps[loI]) + (centreOf(steps[hiI]) - centreOf(steps[loI])) * t;
    track.style.transform = `translateY(${rail.clientHeight / 2 - centre}px)`;

    const px = unitPx();
    for (const el of items) {
      el.style.opacity = scrollyOpacity(Math.abs(centreOf(el) - centre) / px);
    }

    const activeI = scrollyPickActive(fpos, steps.length, lastActive);
    if (activeI !== lastActive && activeI >= 0) {
      lastActive = activeI;
      const active = steps[activeI];
      items.forEach((el) => el.classList.toggle('is-active', el === active));

      const stg = active.dataset.stage;
      figwrap.dataset.active = stg;
      const isPhysical = physical.has(stg);
      rail.classList.toggle('is-physical', isPhysical);
      rail.classList.toggle('is-accounting', !isPhysical);
    }
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  const onResize = () => { sizeRunway(); onScroll(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
