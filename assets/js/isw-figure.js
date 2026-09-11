/* ==========================================================================
   ISW scrollytelling scene — progressive enhancement.
   --------------------------------------------------------------------------
   The cross-section is pinned. Page-scroll progress through the tall
   .isw-scrolly wrapper is mapped to a continuous position along the numbered
   track, which is translated so the active entry always sits in the same
   slot (the vertical centre of the clipped rail). The nearest entry is
   marked .is-active (full opacity + drives the figure highlight); its
   neighbours get .is-near (faint). CHAIN BREAKS rides in the track between
   steps 04 and 05 and passes through the slot on the way past.

   With no JavaScript the .is-live class is never added and CSS renders a
   plain stacked list — nothing pinned, clipped, or hidden.
   ========================================================================== */

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

  const physical = new Set(['pumping', 'response']);
  const centreOf = (el) => el.offsetTop + el.offsetHeight / 2;

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

    const activeI = Math.round(fpos);
    const active = steps[activeI];
    const nearBand = rail.clientHeight * 0.4;
    for (const el of items) {
      const isActive = el === active;
      el.classList.toggle('is-active', isActive);
      el.classList.toggle('is-near', !isActive && Math.abs(centreOf(el) - centre) < nearBand);
    }

    const stg = active.dataset.stage;
    if (figwrap.dataset.active !== stg) figwrap.dataset.active = stg;
    const isPhysical = physical.has(stg);
    rail.classList.toggle('is-physical', isPhysical);
    rail.classList.toggle('is-accounting', !isPhysical);
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
