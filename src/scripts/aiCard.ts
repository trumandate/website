// aiCard.ts — motion #4 (spec §7 item 4): "The suggestion card enters with
// a short slide, then its confidence bar fills from 0 to its value over
// 0.6s. Once per page."
//
// Two sequential tweens in one timeline, gated by the card's own
// ScrollTrigger (fires once). The bar fill is re-expressed as `scaleX(0 →
// 1)` rather than an animated width/percentage (CLAUDE.md: transforms and
// opacity only; BUILD_FLAGS' binding decision — "bar fill as scaleX"): the
// fill element's CSS width is already its finished value (77%, set
// server-side in SuggestionCard.astro), so scaling it from 0 to 1 with
// `transform-origin` pinned to the inline-start edge grows it from nothing
// up to that same 77% width, which is exactly the "fills from 0 to its
// value" behaviour without ever touching `width`.
//
// P10 (DESIGN-ELEVATION.md §3.6): extends this same timeline on this same
// trigger — no new ScrollTrigger — with the glow layer's own arrival ahead
// of the card, and the three actions arriving last. The gate arriving last
// IS the argument: signal, then evidence, then the decision you're left
// with.
//
// Reduced-motion contract: `whenMotionSafe` never runs `setup` under
// `prefers-reduced-motion: reduce`, so the card keeps its served `.reveal`
// end state (opacity 1, translateY 0), the bar keeps its served `scaleX(1)`
// default, the glow layer keeps its served `opacity 1, scale 1` (CSS
// defaults — no transform/opacity utility is applied to it server-side), and
// all three buttons stay visible — full-confidence, fully arrived, from
// first paint. A JS failure degrades to the same page for the same reason.
import { gsap, whenMotionSafe, standardEase } from "./motion";

whenMotionSafe(() => {
  const card = document.querySelector<HTMLElement>("[data-ai-card]");
  if (!card) return;

  const bar = card.querySelector<HTMLElement>("[data-ai-bar]");
  const glow = card.parentElement?.querySelector<HTMLElement>(
    "[data-ai-glow]",
  );
  const actions = Array.from(card.querySelectorAll<HTMLElement>("button"));

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top 85%", // matches reveal.ts's ~15%-visibility convention
      once: true,
    },
  });

  if (glow) {
    tl.from(
      glow,
      {
        opacity: 0,
        scale: 0.94,
        duration: 0.9, // transitionDuration.glow token
        ease: standardEase,
      },
      0,
    );
  }

  tl.from(
    card,
    {
      y: 16, // translate.card token, tailwind.config.mjs
      opacity: 0,
      duration: 0.5, // transitionDuration.card token
      ease: standardEase,
    },
    0.05,
  );

  if (bar) {
    tl.from(
      bar,
      {
        scaleX: 0,
        duration: 0.6, // transitionDuration.bar token, spec §7's own value
        ease: standardEase,
      },
      ">-0.1", // slight overlap so the fill reads as continuing the arrival, not a second, disconnected beat
    );
  }

  if (actions.length) {
    tl.from(
      actions,
      {
        opacity: 0,
        y: 6,
        duration: 0.26,
        ease: standardEase,
        stagger: 0.05,
      },
      "-=0.2",
    );
  }
});

export {};
