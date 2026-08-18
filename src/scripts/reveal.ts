// reveal.ts — motion #2 (spec §7): "Opacity 0 to 1 with 24px upward
// translate, 0.8s, custom ease, triggered once at 15% visibility."
//
// Every [data-reveal] element on the page is driven from here — Reveal.astro
// is "the ONLY reveal wrapper" (PLAN.md §1), and this is its one script.
import { gsap, standardEase, whenMotionSafe } from "./motion";

whenMotionSafe(() => {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

  elements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24, // translate.reveal token, tailwind.config.mjs
      duration: 0.8, // transitionDuration.reveal token
      ease: standardEase,
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // fires at roughly 15% visibility
        once: true,
      },
    });
  });

  // P10 (DESIGN-ELEVATION.md §3.4, §6.1) — the staggered-group variant.
  // `data-reveal-group` sections stagger their DIRECT CHILDREN (the CSS end
  // state for which is global.css's `[data-reveal-group] > *`, the ".reveal
  // group class" that keeps a JS failure or reduced motion rendering every
  // child already in place) rather than the group root itself, which is why
  // this is a second handler rather than a `[data-reveal]` variant. Any
  // `<hr>` inside a child (Rule.astro) draws alongside it in the same
  // timeline, at the same stagger step — FailureModes.astro's own argument
  // ("the chain doesn't exist yet") stated as three rules drawing and
  // stopping.
  const groups = document.querySelectorAll<HTMLElement>("[data-reveal-group]");

  groups.forEach((group) => {
    const blocks = Array.from(group.children) as HTMLElement[];
    if (blocks.length === 0) return;

    // The dossier's own ceiling: beyond ~8 children a 60ms step reads
    // laggy, so longer groups halve it.
    const stagger = blocks.length > 8 ? 0.03 : 0.06; // transitionDelay.stagger, or its stated half

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        once: true,
      },
    });

    tl.from(
      blocks,
      {
        opacity: 0,
        y: 12, // translate.stagger token
        duration: 0.5,
        ease: standardEase,
        stagger,
      },
      0,
    );

    const rules = blocks
      .map((block) => block.querySelector<HTMLElement>("hr"))
      .filter((rule): rule is HTMLElement => Boolean(rule));

    if (rules.length) {
      tl.from(
        rules,
        {
          scaleX: 0,
          duration: 0.5,
          ease: standardEase,
          stagger,
        },
        0,
      );
    }
  });
});

export {};
