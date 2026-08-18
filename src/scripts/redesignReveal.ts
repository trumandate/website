// redesignReveal.ts — redesign wave A's own reveal + count-up mechanism
// (Home (redesign).dc.html's inline script, ported class-for-class). Drives
// every `.tm-rise` / `.tm-fade` / `.tm-grow` element (adds `.tm-in`, whose
// CSS transition — global.css — does the rest) and every `[data-count]`
// counter, both via one IntersectionObserver at the reference's own 0.18
// threshold.
//
// Deliberately NOT scripts/reveal.ts's GSAP `.from()` approach: these
// elements are plain CSS-transitioned classes, so there is no GSAP tween
// competing with a CSS `transition` on the same properties — the exact
// mechanism known-issues.md's P10 entry warns about never arises here by
// construction, not by a workaround.
//
// Gated through motion.ts's whenMotionSafe for the same reason as every
// other motion script: under `prefers-reduced-motion: reduce`, global.css's
// own `@media` block already renders `.tm-rise`/`.tm-fade`/`.tm-grow` at
// their finished opacity/transform unconditionally, and every `[data-count]`
// element's server-rendered text is already its final value (ProofBand.astro)
// — so skipping this setup entirely under reduce loses nothing.
import { whenMotionSafe } from "./motion";

const COUNT_DURATION = 1300; // tm-counter token, tailwind.config.mjs

function runCounter(el: HTMLElement) {
  const to = Number.parseFloat(el.dataset.to ?? "0");
  if (!Number.isFinite(to)) return;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const start = performance.now();
  const ease = (t: number) => 1 - (1 - t) ** 3;

  function tick(now: number) {
    const p = Math.min(1, (now - start) / COUNT_DURATION);
    el.textContent = `${prefix}${Math.round(ease(p) * to)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

whenMotionSafe(() => {
  const targets = document.querySelectorAll(
    ".tm-rise, .tm-fade, .tm-grow, [data-count]",
  );
  if (targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("tm-in");
        if (entry.target.hasAttribute("data-count")) {
          runCounter(entry.target as HTMLElement);
        }
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  targets.forEach((el) => io.observe(el));
});

export {};
