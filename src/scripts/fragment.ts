// fragment.ts — motion #3 (spec §7 item 3): "SVG fragments reveal via a
// clip-path wipe from the inline-start edge, 0.9s, so they read as being
// uncovered rather than fading in."
//
// BUILD_FLAGS' binding decision re-expresses "clip-path wipe" as a
// translated SVG mask rect (CLAUDE.md: transforms and opacity only — an
// animated `clip-path` percentage is neither). The mechanism: the mask
// contains one white rect exactly the size of the fragment's own viewBox,
// resting at `translate(0)` — fully overlapping the viewBox, so the whole
// fragment is visible by default (the unconditional CSS/SVG end state, per
// motion.ts's contract). GSAP's `gsap.from()` starts that same rect
// translated one full viewBox-width to the inline-start side (off-canvas,
// zero overlap, fragment fully masked/hidden) and animates it back to
// `translate(0)`. As the rect slides across, the region where it overlaps
// the viewBox grows from the inline-start edge outward — a progressive
// left-to-right (inline-start → inline-end) reveal produced by nothing but
// a translateX, exactly the "uncovered" read §7 asks for.
//
// Reduced-motion contract: under `prefers-reduced-motion: reduce`,
// `whenMotionSafe`'s `setup` never runs, so the wipe rect never leaves its
// served `translate(0)` position and the fragment renders fully open from
// first paint — identical to a JS failure, per CLAUDE.md.
//
// RTL (P5): the wipe now mirrors. The mask rect's resting position
// (`translate(0)`, fully overlapping the viewBox) never changes — that's
// still the served, motion-off state in both languages, per motion.ts's
// contract. Only the FROM offset GSAP animates away from flips sign: under
// `/en` (`dir="ltr"`) it starts at `x: -width` (off-canvas to the left) and
// slides right, uncovering left-to-right — the page's inline-start edge.
// Under `/ar` (`dir="rtl"`) StageGateQueue.astro's own geometry is already
// mirrored (item 1 moved to the fragment's right edge), so the wipe must
// also start from the opposite side — `x: +width` (off-canvas to the
// right) sliding left — to uncover from that same inline-start edge,
// mirrored. `document.documentElement.dir` is read once per fragment
// rather than threaded through as a prop, since every fragment on a given
// page load shares the one page-level direction.
import { gsap, whenMotionSafe, standardEase } from "./motion";

whenMotionSafe(() => {
  const wipes = document.querySelectorAll<SVGRectElement>(
    "[data-fragment-wipe]",
  );
  if (wipes.length === 0) return;

  const isRtl = document.documentElement.dir === "rtl";

  wipes.forEach((rect) => {
    const width = Number(rect.getAttribute("width") ?? rect.dataset.wipeWidth ?? "0");
    if (!width) return;

    const root = rect.closest<SVGSVGElement>("[data-fragment]") ?? rect.ownerSVGElement;
    if (!root) return;

    gsap.from(rect, {
      x: isRtl ? width : -width,
      duration: 0.9, // transitionDuration.wipe token, tailwind.config.mjs
      ease: standardEase,
      scrollTrigger: {
        trigger: root,
        start: "top 85%", // matches reveal.ts's ~15%-visibility convention
        once: true,
      },
    });
  });
});

export {};
