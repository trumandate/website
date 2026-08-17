// header.ts — motion #6 (spec §7): "Hairline border appears after 12px of
// scroll. No shrink, no hide." Plain scroll-state toggle, no GSAP: there is
// no tween here, only a class add/remove, and the CSS transition on it
// animates opacity only.
//
// Reduced motion still disables this per spec §7 ("disables all six"): the
// element's *end state* is the hairline showing, so a reduced-motion reader
// gets the border permanently rather than a scroll-linked toggle.
const header = document.querySelector<HTMLElement>("[data-header]");

if (header) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    header.classList.add("is-scrolled");
  } else {
    const SCROLL_THRESHOLD = 12;
    const updateState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
  }
}

export {};
