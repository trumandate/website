// motion.ts — the reduced-motion gate every other motion script goes through.
//
// CLAUDE.md: "Reduced motion is a real branch. Under prefers-reduced-motion:
// reduce no timeline is created; elements render in their end state." This
// file is that branch, built once, so no other script re-implements it.
//
// gsap.matchMedia() is GSAP's own responsive/conditional API (not a plugin),
// so registering it here costs nothing against the "core, ScrollTrigger,
// SplitText only" plugin allowlist.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import config from "../../tailwind.config.mjs";

let registered = false;

function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Runs `setup` only when the visitor has not asked for reduced motion.
 * Under `prefers-reduced-motion: reduce`, `setup` never runs at all — no
 * ScrollTrigger, no tween, nothing to kill later. The element's CSS end
 * state (already the default, unconditionally) is the only thing a reduced-
 * motion reader — or a reader whose JS failed to load — ever sees.
 *
 * Both `reduceMotion` and `motionSafe` are registered, not just the first.
 * `gsap.matchMedia().add()` (gsap-core.js) only ever calls its callback if
 * at least one of the named conditions is *currently true* — internally it
 * sets `active` by OR-ing `mq.matches` across every listed condition, and
 * skips the callback entirely if `active` stays falsy. A single
 * `"(prefers-reduced-motion: reduce)"` condition is false for the vast
 * majority of visitors (anyone who hasn't turned reduced motion on), so
 * with only that one condition registered, `setup` silently never ran for
 * them — found empirically at P3 while wiring the chain draw, where the
 * rail and every node stayed in their untouched served state with zero
 * console errors. Registering the complementary
 * `"(prefers-reduced-motion: no-preference)"` query means one of the pair
 * is true for essentially every visitor and every browser, so the callback
 * reliably fires either way; which query matched still ends up in
 * `context.conditions.reduceMotion` exactly as before.
 */
export function whenMotionSafe(setup: () => void): gsap.MatchMedia {
  registerGsap();
  const mm = gsap.matchMedia();
  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      motionSafe: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const { reduceMotion } = context.conditions as {
        reduceMotion: boolean;
        motionSafe: boolean;
      };
      if (reduceMotion) return;
      // Deferred one frame (P4, found while re-measuring LCP after wiring
      // motions 2–5 across the whole home page): six separate per-component
      // <script type=module> files now all pass through this one gate, each
      // fetched as its own network request. Under real-world network
      // latency they don't finish executing in the same tick, so each
      // arriving `ScrollTrigger.create()` was landing outside GSAP's own
      // same-frame batching window and forcing its own full-document layout
      // pass to remeasure every registered trigger — three separate ~300–
      // 500ms forced reflows observed via chrome-devtools MCP's ForcedReflow
      // insight on a throttled trace, none of which existed back when only
      // chain.ts (P3) ran ScrollTrigger on this page. Wrapping the actual
      // measurement/creation work in one `requestAnimationFrame` lets the
      // browser paint the page — including the LCP text — BEFORE any
      // script's ScrollTrigger setup runs, regardless of how staggered the
      // six files' network fetches are; the reduced-motion decision above
      // still happens synchronously, so the "was a timeline created at all"
      // contract is unchanged, only *when* it's created shifts by one frame.
      requestAnimationFrame(setup);
    },
  );
  return mm;
}

/**
 * The one site ease (tailwind.config.mjs `transitionTimingFunction.standard`,
 * cubic-bezier(0.22, 0.61, 0.36, 1)), reimplemented as a plain easing
 * function so GSAP tweens match CSS transitions exactly without pulling in
 * the CustomEase plugin — CustomEase is outside BUILD_FLAGS' three-plugin
 * allowlist (core, ScrollTrigger, SplitText).
 *
 * Standard cubic-bezier solve via Newton-Raphson on X(t), then evaluating
 * Y(t) at the resolved t — the same approach used by the well-known
 * `bezier-easing` package, inlined here to avoid adding a dependency for
 * four numbers.
 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const c = (a1: number) => 3 * a1;

  const bezier = (t: number, a1: number, a2: number) =>
    ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
  const bezierSlope = (t: number, a1: number, a2: number) =>
    3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);

  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const slope = bezierSlope(t, x1, x2);
      if (slope === 0) break;
      t -= (bezier(t, x1, x2) - x) / slope;
    }
    return t;
  };

  return (x: number) => bezier(solveX(x), y1, y2);
}

/** The site ease, ready to pass as `ease:` in any gsap.to/from/timeline call. */
export const standardEase = cubicBezier(0.22, 0.61, 0.36, 1);

/**
 * P10 (DESIGN-ELEVATION.md §2.2): the `micro` tier — Attio's measured
 * `.22,1,.36,1`, the same shape family as `standard` with `y1` raised from
 * 0.61 to 1, so short states (≤300ms) snap out of rest and decelerate the
 * whole way. `y` never exceeds 1, so there is no overshoot — reimplemented
 * the same way as `standardEase` (a plain function, not a CSS string or the
 * CustomEase plugin) so GSAP tweens match the CSS `ease-micro` utility
 * exactly without adding a dependency outside the three-plugin allowlist.
 */
export const microEase = cubicBezier(0.22, 1, 0.36, 1);

/**
 * The motion magnitudes GSAP tweens need, read from tailwind.config.mjs rather
 * than retyped — that file states it is the one place every duration and
 * measurement lives, and a GSAP tween cannot call `theme()`. Seconds, because
 * that is GSAP's unit; px stripped, because that is GSAP's unit for `y`.
 */
// Tailwind's own `Config` type models `theme.extend` as an arbitrary
// resolver function for plugin compatibility, which is looser than this
// object literal actually is. This narrows it to exactly the tokens read
// below, rather than reaching for `any`.
interface MotionConfigTokens {
  transitionDuration: {
    reveal: string;
    card: string;
    "tm-counter": string;
  };
  translate: {
    reveal: string;
    stagger: string;
  };
  transitionDelay: {
    stagger: string;
  };
}

const motionTokens = config.theme!.extend as unknown as MotionConfigTokens;
const ms = (v: string) => Number.parseFloat(v) / 1000;
const px = (v: string) => Number.parseFloat(v);

export const durations = {
  reveal: ms(motionTokens.transitionDuration.reveal),
  card: ms(motionTokens.transitionDuration.card),
  counter: Number.parseFloat(motionTokens.transitionDuration["tm-counter"]),
};
export const offsets = {
  reveal: px(motionTokens.translate.reveal),
  stagger: px(motionTokens.translate.stagger),
};
export const staggerStep = ms(motionTokens.transitionDelay.stagger);

export { gsap, ScrollTrigger };
