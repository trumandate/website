// chain.ts — motion #1 (spec §7 item 1), the chain draw. Home page only, one
// per route.
//
// CLAUDE.md's "one pinned section and one scrubbed timeline per route,
// maximum" is satisfied by this file alone: the pin is ChainMarker.astro's
// own `position: sticky` (built at P2, plain CSS, no ScrollTrigger `pin`
// involved), and the scrub is the rail's `scaleY` fill wired below. Using
// CSS `sticky` rather than `ScrollTrigger.create({ pin: true })` is a
// deliberate choice, not an oversight: a sticky element's pinned range can
// never exceed its own containing block's natural height (there is no
// manufactured scroll distance to tune), which is exactly PLAN.md §3's
// "nothing is manufactured" and this prompt's "must not swallow more scroll
// distance than the section's natural height plus one viewport" bound — and
// it keeps working identically if this script never loads.
//
// Reduced-motion contract (motion.ts's `whenMotionSafe`): under
// `prefers-reduced-motion: reduce`, `setup` below never runs at all. Every
// element stays exactly as ChainSection/ChainLink/ChainMarker server-render
// it — rail untransformed (== `scaleY(1)`, fully drawn), every dot
// accent-filled with its ring, every caption at opacity 1, the marker
// showing "01 / 05" / "Objective". A JS failure degrades to the identical
// page for the identical reason: none of that markup is JS-authored, so
// nothing has to "fail open" — it was already open.
import { gsap, ScrollTrigger, whenMotionSafe } from "./motion";

whenMotionSafe(() => {
  const track = document.querySelector<HTMLElement>("[data-chain-track]");
  if (!track) return;

  const rail = track.querySelector<HTMLElement>("[data-chain-rail]");
  const nodes = Array.from(
    track.querySelectorAll<HTMLElement>("[data-chain-node]"),
  );
  if (nodes.length === 0) return;

  const total = nodes.length;
  const marker = document.querySelector<HTMLElement>("[data-chain-marker]");
  const markerCount = marker?.querySelector<HTMLElement>("[data-chain-count]");
  const markerName = marker?.querySelector<HTMLElement>("[data-chain-name]");

  // ---- the one scrubbed timeline: the rail's fill. `scaleY` from a
  // `transform-origin: top` (Spine.astro), never height or
  // `stroke-dashoffset` (CLAUDE.md: transforms and opacity only — a scaled
  // 1px rule composites on the GPU and never triggers layout). Bound to the
  // track's own natural top/bottom, so the scroll distance is exactly the
  // section's natural height — nothing manufactured. `onUpdate` piggybacks
  // on the same scroll range to keep the sticky marker's count/name in sync
  // with how much of the rail has drawn, which is the "track the active
  // link as the scrub progresses" behaviour this prompt asks for. ----
  if (rail) {
    gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 85%", // matches reveal.ts's ~15%-visibility convention
          end: "bottom 15%",
          scrub: true,
          onUpdate: (self) => {
            if (!markerCount && !markerName) return;
            const index = Math.min(
              total - 1,
              Math.floor(self.progress * total),
            );
            const active = nodes[index];
            const name = active?.dataset.chainName ?? "";
            const count = `${String(index + 1).padStart(2, "0")} / ${String(
              total,
            ).padStart(2, "0")}`;
            if (markerCount && markerCount.textContent !== count) {
              markerCount.textContent = count;
            }
            if (markerName && markerName.textContent !== name) {
              markerName.textContent = name;
            }
          },
        },
      },
    );
  }

  // ---- node activation: independent one-shot triggers, not part of the
  // scrub (PLAN.md §3 is explicit these are separate: "cheap, independent,
  // and it means a slow scrub never leaves text half-legible"). The rest
  // state (muted dot, 40%-opacity caption) is applied imperatively, in JS
  // only, right here — the served HTML/CSS default is the ACTIVE state, so
  // reduced motion and a JS failure both show the finished chain, and only
  // once motion is confirmed safe does a node ever dim before its trigger
  // fires. ----
  const ACTIVE_DOT = ["bg-accent", "ring-2", "ring-accent"];
  const REST_DOT = ["bg-jade", "ring-1", "ring-muted"];

  nodes.forEach((node) => {
    const dot = node.querySelector<HTMLElement>("[data-chain-dot]");
    const copy = node.querySelector<HTMLElement>("[data-chain-copy]");

    dot?.classList.remove(...ACTIVE_DOT);
    dot?.classList.add(...REST_DOT);
    copy?.classList.add(
      "opacity-rest",
      "transition-opacity",
      "duration-state",
      "ease-standard",
    );

    ScrollTrigger.create({
      trigger: node,
      start: "top 78%", // spec/PLAN.md §3: "firing at 78% of viewport height"
      once: true,
      onEnter: () => {
        dot?.classList.remove(...REST_DOT);
        dot?.classList.add(...ACTIVE_DOT);
        copy?.classList.remove("opacity-rest");
      },
    });
  });
});

export {};
