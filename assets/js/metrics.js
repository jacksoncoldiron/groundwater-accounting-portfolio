/* ==========================================================================
   Overview metric feature — a horizontal scroller of editorial statistics.
   --------------------------------------------------------------------------
   Each metric is a real <button>: click/tap selects it and reveals a short
   description below; Tab moves focus between them and the browser's own
   scroll-into-view keeps the focused one visible; native overflow-x
   scrolling handles touch swipe with no extra code. The prev/next arrows are
   a convenience for pointer users, hidden entirely when everything already
   fits (checked on load and on resize) and hidden past either scroll end.
   ========================================================================== */

function initMetrics(root) {
  const track = root.querySelector('.gw-metrics__track');
  const prevBtn = root.querySelector('.gw-metrics__nav--prev');
  const nextBtn = root.querySelector('.gw-metrics__nav--next');
  const detail = root.querySelector('.gw-metrics__detail');
  const metrics = [...root.querySelectorAll('.gw-metric')];
  if (!track || !metrics.length) return;

  function select(btn) {
    const already = btn.getAttribute('aria-pressed') === 'true';
    for (const m of metrics) m.setAttribute('aria-pressed', 'false');
    if (already) {
      detail.hidden = true;
      detail.replaceChildren();
      return;
    }
    btn.setAttribute('aria-pressed', 'true');
    detail.hidden = false;
    detail.replaceChildren(
      Object.assign(document.createElement('strong'), { textContent: btn.dataset.label }),
      Object.assign(document.createElement('span'), { textContent: btn.dataset.detail })
    );
  }

  metrics.forEach((btn) => btn.addEventListener('click', () => select(btn)));

  function updateNav() {
    const overflowing = track.scrollWidth > track.clientWidth + 4;
    if (!overflowing) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    prevBtn.hidden = track.scrollLeft <= 4;
    nextBtn.hidden = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }

  function scrollByStep(dir) {
    const step = (metrics[0]?.getBoundingClientRect().width || 200) * 1.2;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByStep(-1));
  nextBtn?.addEventListener('click', () => scrollByStep(1));
  track.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  // Select the first metric by default so the feature demonstrates itself
  // rather than opening on an empty detail area.
  if (metrics[0]) select(metrics[0]);
}

function init() {
  document.querySelectorAll('.gw-metrics').forEach(initMetrics);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
