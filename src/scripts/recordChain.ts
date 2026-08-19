// recordChain.ts — THE SIGNATURE (Home (redesign).dc.html §5 / README §5).
// The 480vh record chain's scroll-driven 3D ellipse, ported from the
// reference's own scroll handler almost line-for-line (its math is exact
// and there is no reason to re-derive it).
//
// Deliberately a plain `scroll`/`resize` listener writing inline transforms
// directly, NOT a GSAP ScrollTrigger scrub: CLAUDE.md's "one pinned section
// and one scrubbed timeline per route, maximum" is satisfied by CSS
// `position: sticky` (RecordChain.astro) for the pin and this handler for
// the scrub — matching the pre-redesign chain.ts's own reasoning for the
// same choice (a sticky element's pinned range can never exceed its own
// containing block's natural height, so nothing is manufactured), extended
// here since the reference's own math already assumes raw scroll-fraction
// input, not a ScrollTrigger `onUpdate` progress value (the two are
// equivalent, so there is no benefit to translating one into the other).
//
// Reduced-motion contract, via motion.ts's whenMotionSafe: under
// `prefers-reduced-motion: reduce`, `setup` never runs at all, so the five
// `[data-chain-card]` elements are never switched from their served
// `position: relative` (RecordChain.astro) into the CSS-grid overlay
// `armRing` below builds — they stay in normal document flow, stacked
// vertically, every one fully legible, opacity 1. A JS failure produces the
// identical page for the identical reason (none of that switch is
// server-rendered). This is a
// stronger guarantee than the reference's own demo, which never special-
// cases the chain's scroll handler for reduced motion at all — CLAUDE.md's
// "reduced motion is a real branch" wins here per this build's own
// instruction to match the reference's *intent*, not necessarily its exact
// reduced-motion behaviour.
import { whenMotionSafe } from "./motion";

const AX = 440;
const BZ = 560;
const DWELL = 0.45;
// Scroll-down nudge (USER REQUEST, RecordChain.astro's `[data-chain-hint]`):
// once the reader has advanced this far into the pinned stage's own scroll
// progress `p` (below — the same value the ellipse's dwell-then-glide math
// already computes, not a second measurement), they've demonstrated they
// understand scrolling moves the chain. The hint is dismissed permanently at
// that point and never re-shown, including on scroll-back.
const HINT_DISMISS = 0.06;

whenMotionSafe(() => {
  const section = document.querySelector<HTMLElement>("[data-chain]");
  const track = document.querySelector<HTMLElement>("[data-chain-track]");
  if (!section || !track) return;

  const cards = Array.from(
    track.querySelectorAll<HTMLElement>("[data-chain-card]"),
  );
  if (cards.length === 0) return;

  const namesEl = document.querySelector<HTMLScriptElement>(
    "[data-chain-names]",
  );
  let chainNames: string[] = [];
  try {
    chainNames = namesEl ? (JSON.parse(namesEl.textContent ?? "[]") as string[]) : [];
  } catch {
    chainNames = [];
  }

  const countEl = document.querySelector<HTMLElement>("[data-chain-count]");
  const nameEl = document.querySelector<HTMLElement>("[data-chain-name]");
  const hintEl = document.querySelector<HTMLElement>("[data-chain-hint]");
  let hintDismissed = false;

  // One-time switch to a CSS-grid overlay, exactly like the reference's own
  // `ringInit` guard — done here (JS-driven) rather than server-rendered, so
  // a reduced-motion or JS-disabled reader never sees the cards leave normal
  // document flow (RecordChain.astro's cards are served `position: relative`
  // and `armRing` is the only thing that ever changes that, and it never
  // runs under reduced motion — see whenMotionSafe above).
  //
  // Grid, not `position: absolute` (this file's previous approach): all five
  // cards get `grid-row-start: 1; grid-column-start: 1`, i.e. the same
  // single cell, which CSS auto-sizes to the TALLEST card actually
  // rendered — track's own `min-height` (RecordChain.astro) is then only a
  // cosmetic lower bound for short viewports, never the thing that could
  // clip a card: whichever record's copy is longest, in whichever language,
  // at whatever zoom or font-scaling, the track is guaranteed at least that
  // tall because the browser measured it, not because a clamp() constant
  // guessed right. (Absolute positioning couldn't offer that: an absolutely
  // positioned child never contributes to its parent's auto height, which is
  // exactly the mismatch the short-viewport bugfix had to design around.)
  // Transforms/opacity below are unaffected either way — translate and
  // opacity apply the same regardless of how a box is positioned.
  let ringInit = false;
  function armRing() {
    if (ringInit) return;
    track!.style.display = "grid";
    cards.forEach((card) => {
      card.style.gridRowStart = "1";
      card.style.gridColumnStart = "1";
      card.style.willChange = "transform, opacity";
    });
    ringInit = true;
  }

  function onScroll() {
    const rect = section!.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight);
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const rtl = document.documentElement.dir === "rtl";

    // Dwell-then-glide easing: within each of the 4 transitions between
    // records, hold for 45% of that segment, then smoothstep-glide the
    // remaining 55% (README §5).
    const seg = p * 4;
    const i = Math.min(3, Math.floor(seg));
    const frac = seg - i;
    const t = frac < DWELL ? 0 : (frac - DWELL) / (1 - DWELL);
    const glide = t * t * (3 - 2 * t);
    const eased = (i + glide) / 4;

    armRing();

    const rot = (rtl ? 1 : -1) * eased * 288;
    cards.forEach((card, n) => {
      const a = (((n * 72 + rot) % 360) + 360) % 360 * (Math.PI / 180);
      const x = Math.sin(a) * AX;
      const z = (Math.cos(a) - 1) * BZ;
      const y = (1 - Math.cos(a)) * -46;
      const v = Math.cos(a);
      card.style.transform = `translateX(${x.toFixed(1)}px) translateY(${y.toFixed(1)}px) translateZ(${z.toFixed(1)}px)`;
      card.style.opacity = (0.08 + 0.92 * Math.max(0, (v + 0.25) / 1.25)).toFixed(3);
      card.style.zIndex = String(Math.round(100 + 100 * v));
    });

    const idx = Math.min(4, Math.round(eased * 4));
    if (countEl) countEl.textContent = `0${idx + 1} / 05`;
    if (nameEl && chainNames[idx] && nameEl.textContent !== chainNames[idx]) {
      nameEl.textContent = chainNames[idx];
    }

    const dots = track!.querySelectorAll<HTMLElement>("[data-chain-dot]");
    dots.forEach((dot, n) => dot.classList.toggle("tm-live", n === idx));

    // Scroll-down nudge: reuses `rect`/`total`/`p` computed above rather
    // than a second scroll listener. "Active" mirrors the sticky pin's own
    // range (rect.top in (-total, 0]) so the hint only ever shows while the
    // stage is actually pinned — i.e. while it is the reader's context —
    // never before the section is reached and never after the pin ends.
    // `hintDismissed` is a plain closure variable, not re-derived from `p`,
    // so once it flips true no later scroll-back can undo it.
    if (hintEl && !hintDismissed) {
      const active = rect.top <= 0 && rect.top > -total;
      hintEl.classList.toggle("is-visible", active && p < HINT_DISMISS);
      if (p >= HINT_DISMISS) {
        hintDismissed = true;
        hintEl.classList.remove("is-visible");
        hintEl.classList.add("is-dismissed");
      }
    }
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
});

export {};
