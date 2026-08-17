// counter.ts — motion #5 (spec §7 item 5): "One number per page counts up
// on first view. One only."
//
// PLAN.md §3 names the number: AED 41M, the hero data panel's "Benefit to
// date" row — a running total, so counting it up states a fact rather than
// implying a live reading (which is why "68 / 75", the composite KPI, was
// rejected for this role). Counts once, on first view, via the card's own
// ScrollTrigger.
//
// Not a transform or opacity tween — CLAUDE.md's exception, granted
// explicitly for this one motion (a text-content mutation with a stable
// digit count and tabular figures doesn't trigger layout). The element
// carries `font-variant-numeric: tabular-nums` and a reserved min-width
// (ObjectiveRecord.astro) so the digit count changing from "0" to "41"
// during the count never reflows the row around it.
//
// Reduced-motion contract: `whenMotionSafe` never runs `setup` under
// `prefers-reduced-motion: reduce`, so the element keeps Astro's
// server-rendered final text ("AED 41M") untouched — a JS failure degrades
// to the same page for the same reason, since the counted-up value is never
// the only place that number exists in the markup.
import { whenMotionSafe, standardEase, gsap } from "./motion";

whenMotionSafe(() => {
  const counters = document.querySelectorAll<HTMLElement>("[data-counter]");

  counters.forEach((el) => {
    const to = Number(el.dataset.counterTo ?? "");
    if (!Number.isFinite(to)) return;

    const prefix = el.dataset.counterPrefix ?? "";
    const suffix = el.dataset.counterSuffix ?? "";
    const proxy = { value: 0 };

    gsap.to(proxy, {
      value: to,
      duration: 1.2, // transitionDuration.counter token, tailwind.config.mjs
      ease: standardEase,
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // matches reveal.ts's ~15%-visibility convention
        once: true,
      },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(proxy.value)}${suffix}`;
      },
      onComplete: () => {
        // Guards against any floating-point rounding leaving the final
        // frame one digit short of the real value.
        el.textContent = `${prefix}${to}${suffix}`;
      },
    });
  });
});

export {};
