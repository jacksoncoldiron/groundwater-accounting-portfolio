/* ==========================================================================
   Scroll steps — natural-scroll "sticky companion" scenes.
   --------------------------------------------------------------------------
   Replaces the old pinned/translated-track scenes. Content now scrolls at
   normal page speed; this module only watches which step is nearest the
   reading line and marks it active, so a sticky companion (a figure, or an
   index of key gaps) can follow along.

     <div data-scroll-steps>
       <aside> ... <a data-step-link="gap-1"> ... </aside>   (optional index)
       <article data-step="gap-1"> ... </article>
     </div>

   The container gets data-active="<step id>"; each step and each matching
   [data-step-link] gets .is-active. Nothing is hidden or clipped, so with no
   JavaScript the page is simply a readable stack.
   ========================================================================== */

export function initScrollSteps(scope, { onChange } = {}) {
  const steps = [...scope.querySelectorAll('[data-step]')];
  if (!steps.length) return;
  const links = [...scope.querySelectorAll('[data-step-link]')];
  scope.classList.add('is-live');

  let active = null;
  const setActive = (id) => {
    if (!id || id === active) return;
    active = id;
    scope.dataset.active = id;
    steps.forEach((s) => s.classList.toggle('is-active', s.dataset.step === id));
    links.forEach((l) => {
      const on = l.dataset.stepLink === id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current');
    });
    if (onChange) onChange(id);
  };

  // The reading line sits ~40% down the viewport: a step activates once its
  // top crosses it, and stays active until the next one does.
  const pick = () => {
    const line = window.innerHeight * 0.42;
    let current = steps[0];
    for (const s of steps) {
      if (s.getBoundingClientRect().top <= line) current = s;
      else break;
    }
    setActive(current.dataset.step);
  };

  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  pick();

  // Index links scroll to their step (with the sticky navbar offset handled
  // by scroll-margin-top in CSS).
  links.forEach((l) => l.addEventListener('click', (e) => {
    const target = steps.find((s) => s.dataset.step === l.dataset.stepLink);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${target.id || ''}`);
  }));
}

function autoInit() {
  document.querySelectorAll('[data-scroll-steps]:not([data-scroll-steps-manual])').forEach((el) => {
    initScrollSteps(el, {
      onChange: (id) => {
        // Figure scenes: mirror the active step onto any [data-follow] figure.
        el.querySelectorAll('[data-follow]').forEach((f) => { f.dataset.active = id; });
        const step = el.querySelector(`[data-step="${CSS.escape(id)}"]`);
        if (step?.dataset.phase) el.dataset.phase = step.dataset.phase;
      },
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
else autoInit();
