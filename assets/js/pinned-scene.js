/* ==========================================================================
   Pinned scene — progressive enhancement.
   --------------------------------------------------------------------------
   A generalised version of the ISW cross-section scrollytelling scene, for
   any viewport-locked stack of steps: the Overview's Research and Headline
   Findings sections and each chapter's Key Findings section.

   Page-scroll progress through the tall .gw-pinned wrapper is mapped to a
   continuous position along the numbered .gw-pinned__track, which is
   translated so the active step always sits in the same slot — a fixed
   fraction down the clipped viewport (the scene's --pinned-anchor custom
   property, read from CSS rather than hardcoded), level with the fixed
   .gw-pinned__num. Each step's opacity follows a broad plateau curve from
   scrolly-core.js — faded,
   fade in, full opacity for a long stretch, fade out, faded — rather than a
   binary on/off switch, and the number only flips once the incoming step has
   actually entered that plateau (see scrollyPickActive). The wrapper's own
   scroll runway is sized from the step count so every scene gets the same
   generous per-step scroll distance without a page hardcoding --runway.

   With no JavaScript, or under prefers-reduced-motion, the .is-live class is
   never added and CSS renders a plain stacked list — nothing pinned or
   clipped. See the .gw-pinned:not(.is-live) rules in styles.css.
   ========================================================================== */

import { scrollyOpacity, scrollyPickActive, scrollyRunwayVh } from './scrolly-core.js';

function initScene(scene) {
  const stage = scene.querySelector('.gw-pinned__stage');
  const viewport = scene.querySelector('.gw-pinned__viewport');
  const track = scene.querySelector('.gw-pinned__track');
  const numEl = scene.querySelector('.gw-pinned__num');
  if (!stage || !viewport || !track) return;

  const steps = [...track.children].filter((el) => el.classList.contains('gw-pinned__step'));
  if (steps.length < 2) return;

  const dots = [...scene.querySelectorAll('.gw-pinned__dot')];
  scene.classList.add('is-live');

  // The CSS fallback (var(--runway, ...)) sizes the sticky stage correctly
  // the instant is-live lands, so it's safe to measure it here and replace
  // --runway with a value sized to the actual step count.
  const sizeRunway = () => {
    if (!window.innerHeight || !stage.offsetHeight) return;
    const stageVh = (stage.offsetHeight / window.innerHeight) * 100;
    scene.style.setProperty('--runway', `${scrollyRunwayVh(steps.length, stageVh)}vh`);
  };
  sizeRunway();

  // Read once (and again on resize, where breakpoints can change it) rather
  // than on every scroll frame — this doesn't change mid-scroll.
  let anchorFraction = 0.5;
  const readAnchor = () => {
    const raw = parseFloat(getComputedStyle(scene).getPropertyValue('--pinned-anchor'));
    anchorFraction = Number.isFinite(raw) ? raw : 0.5;
  };
  readAnchor();

  const centreOf = (el) => el.offsetTop + el.offsetHeight / 2;
  let lastActive = -1;
  let raf = 0;

  const update = () => {
    raf = 0;
    const runway = scene.offsetHeight - stage.offsetHeight;
    const p = runway > 0
      ? Math.min(Math.max(-scene.getBoundingClientRect().top / runway, 0), 1)
      : 0;
    const fpos = p * (steps.length - 1);

    const loI = Math.floor(fpos);
    const hiI = Math.min(loI + 1, steps.length - 1);
    const t = fpos - loI;
    const centre = centreOf(steps[loI]) + (centreOf(steps[hiI]) - centreOf(steps[loI])) * t;
    track.style.transform = `translateY(${viewport.clientHeight * anchorFraction - centre}px)`;

    steps.forEach((el, i) => {
      el.style.opacity = scrollyOpacity(Math.abs(i - fpos));
    });

    const activeI = scrollyPickActive(fpos, steps.length, lastActive);
    if (activeI !== lastActive && activeI >= 0) {
      lastActive = activeI;
      steps.forEach((el, i) => el.classList.toggle('is-active', i === activeI));
      dots.forEach((d, i) => {
        d.classList.toggle('is-on', i === activeI);
        d.setAttribute('aria-current', i === activeI ? 'true' : 'false');
      });
      if (numEl) {
        const label = steps[activeI].dataset.num || String(activeI + 1).padStart(2, '0');
        numEl.textContent = label;
      }
      scene.dataset.step = String(activeI);
    }
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  const onResize = () => { sizeRunway(); readAnchor(); onScroll(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  const scrollToStep = (i) => {
    const runway = scene.offsetHeight - stage.offsetHeight;
    const target = scene.getBoundingClientRect().top + window.scrollY
      + (runway * i) / (steps.length - 1);
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Clicking a progress dot scrolls to that step.
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToStep(i)));

  // Keyboard: if focus lands on a control inside a step that is not the active
  // one (e.g. tabbing to a "See the evidence" link in a faded step), bring that
  // step into view so focus is never on off-screen content.
  steps.forEach((step, i) => {
    step.addEventListener('focusin', () => {
      if (!step.classList.contains('is-active')) scrollToStep(i);
    });
  });

  update();
}

function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.gw-pinned[data-pinned]').forEach(initScene);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
