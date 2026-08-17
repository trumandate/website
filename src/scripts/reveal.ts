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
});

export {};
