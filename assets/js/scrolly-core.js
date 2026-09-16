/* ==========================================================================
   Scrolly core — shared math for every "fixed anchor, scrolling copy" scene
   (assets/js/pinned-scene.js, assets/js/isw-figure.js).
   --------------------------------------------------------------------------
   Both scenes pin a slot (a number, or a cross-section figure) and translate
   a track of steps past it as the reader scrolls. This module is the one
   place that defines:

     - how much scroll distance (in vh) each step-to-step transition gets,
       so a scene with more steps grows its own scroll runway automatically
       instead of a page hardcoding a --runway value;
     - the opacity curve a step follows as it passes the fixed slot: faded,
       fade in, a broad full-opacity plateau, fade out, faded — rather than
       a binary is-active/is-near switch;
     - which step counts as "active" (drives the number label, progress
       dots, aria state): whichever step is currently inside its own
       plateau. Between plateaus (the crossfade) the previous step holds,
       so the label only flips once the incoming step is genuinely in view
       and near-opaque next to the anchor, not at the halfway point between
       two steps while both are still faded.
   ========================================================================== */

// Scroll distance, in vh, dedicated to one step-to-step transition (fade out
// of step i, fade in of step i+1). Generous on purpose: this is what makes
// the active state last a long time without adding blank space to the
// visible layout — the extra length lives in the (invisible) scroll runway.
export const SCROLLY_STEP_VH = 220;

// Of that one-unit transition, the fraction spent at full opacity ("directly
// beside the anchor"), and the fraction spent fading in/out on each side.
// PLATEAU + 2 * FADE must equal 1.
const PLATEAU = 0.5;   // ~50% of the step, i.e. roughly the 45-55% target
const FADE = 0.25;     // ~25% each side, i.e. roughly the 20-25% target
const FLOOR_OPACITY = 0.12;

/**
 * Opacity for a step given its distance from the current scroll position,
 * in "step units" (1 unit = the spacing to the next step). 0 = exactly at
 * the anchor. Symmetric: fade in and fade out are the same shape.
 */
export function scrollyOpacity(absDistance) {
  const half = PLATEAU / 2;
  if (absDistance <= half) return 1;
  const fadeEnd = half + FADE;
  if (absDistance >= fadeEnd) return FLOOR_OPACITY;
  const t = (absDistance - half) / FADE;
  return 1 - t * (1 - FLOOR_OPACITY);
}

/**
 * Which step index is "active" right now. A step becomes active only once
 * scroll position (fpos, in step units) enters its own plateau; it then
 * holds that title through the crossfade until the next step enters ITS
 * plateau. This is what keeps the number from flipping while the matching
 * heading is still visibly below/above the anchor line.
 */
export function scrollyPickActive(fpos, count, lastActive) {
  const half = PLATEAU / 2;
  const rounded = Math.round(fpos);
  if (rounded >= 0 && rounded < count && Math.abs(fpos - rounded) <= half) {
    return rounded;
  }
  return lastActive;
}

/**
 * Outer wrapper height (vh) for a scene with `stepCount` steps, given the
 * visible sticky panel's own height in vh. Each of the (stepCount - 1)
 * transitions between steps gets SCROLLY_STEP_VH of dedicated scroll.
 */
export function scrollyRunwayVh(stepCount, stageVh) {
  return stageVh + Math.max(stepCount - 1, 1) * SCROLLY_STEP_VH;
}
