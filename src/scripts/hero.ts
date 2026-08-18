// hero.ts — DESIGN-ELEVATION.md §3.3, the hero's orchestrated arrival. Home
// page only. Registers SplitText itself rather than adding it to
// scripts/motion.ts's shared chunk: that chunk is imported by six scripts
// across every route including /contact, and SplitText has no business on
// any of them.
//
// Line-level only, never words or characters (§3.3, §5.2, §7 rejection 5):
// character splitting breaks Arabic letter joining outright, word splitting
// fragments bidi runs. `type: "lines"` + `mask: "lines"` is the only
// configuration used here, in both languages.
//
// LCP protection: motion.ts's whenMotionSafe already defers all setup by one
// requestAnimationFrame, so the browser paints the h1 at full opacity —
// emitting the LCP entry — BEFORE SplitText ever runs. An LCP entry is not
// retracted when the element is later split/animated; the residual risk is a
// one-frame flash of the finished headline, identical in kind to every other
// reveal already on this page, and is a stated wave-1 gate with an abort
// (§6.4: drop the split, keep a whole-block <Reveal>).
//
// Reduced-motion contract: whenMotionSafe never runs `setup` under
// prefers-reduced-motion: reduce, so SplitText is never instantiated at all —
// the h1 stays a single unsplit text node at opacity 1, and the lede/CTA
// row/objective-record rows stay at their served CSS end state. Identical
// with JS disabled, since none of this markup is JS-authored.
//
// P10 defect fix: Button.astro's `transition` utility (opacity/transform
// included) fights GSAP's own per-frame inline-style writes on a STAGGERED
// (delayed-start) target — reproduced in isolation: two elements sharing a
// `stagger`, the first (no delay) resolves fine, the second's CSS transition
// re-triggers on every GSAP frame during its own wait period and never
// converges, leaving `tl.progress()` reporting 1 while the element's actual
// `style.opacity` is frozen near its starting value, indefinitely, with zero
// console errors.
//
// Fix: neutralise the transition BEFORE the stagger tween is created
// (`gsap.set(ctas, { transition: "none" })`, a separate call, not folded
// into the `.from()`'s own vars) and restore it once the tween finishes
// (`tl.call(...)`, setting `style.transition = ""` so the CSS class's own
// declaration resumes for hover/press). Putting `transition`/`clearProps`
// directly inside a `.from()` call THAT ALSO CARRIES `stagger` was tried
// and is worse, not better — reproduced in isolation too: it breaks
// rendering for EVERY target in the stagger group, not just the delayed
// one (GSAP's stagger distribution appears not to handle a non-tweened,
// non-numeric property placed alongside a staggered numeric one). The
// separate-call form above was verified against the live built page, not
// assumed from the isolated test alone. Every element this script animates
// keeps `.reveal` (or an equivalent unconditional CSS end state) as its
// served default per CLAUDE.md's "end state lives in CSS" contract — a
// no-op visually here (these buttons carry no opacity/transform of their
// own), but the fallback CLAUDE.md requires if a tween ever hangs again.
import { gsap, whenMotionSafe, standardEase } from "./motion";
import { SplitText } from "gsap/SplitText";

whenMotionSafe(() => {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return;

  const eyebrow = hero.querySelector<HTMLElement>(".text-eyebrow");
  const headline = hero.querySelector<HTMLElement>("h1");
  const lede = hero.querySelector<HTMLElement>(".text-lede");
  const ctas = Array.from(
    hero.querySelectorAll<HTMLElement>(".hero-cta-row > a"),
  );

  if (headline) {
    gsap.registerPlugin(SplitText);

    // `aria: "auto"` (the default — left unset here) sets an `aria-label`
    // on the h1 itself equal to its trimmed text content, and `aria-hidden`
    // on every split wrapper, so the accessible name survives the split in
    // both languages (verified via context7 against the installed
    // gsap@3.15.0 SplitText source, per CLAUDE.md — not from recall).
    SplitText.create(headline, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        const tl = gsap.timeline();

        if (eyebrow) {
          tl.from(
            eyebrow,
            { opacity: 0, y: 8, duration: 0.4, ease: standardEase },
            0,
          );
        }

        // transitionDuration.line (0.7s), stagger 0.07 — one step per line,
        // slightly longer than the canonical 0.06 stagger since these are
        // the page's single largest reveal targets.
        tl.from(
          self.lines,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.7,
            ease: standardEase,
            stagger: 0.07,
          },
          0.08,
        );

        if (lede) {
          // 0.12s after the LAST line finishes, not the first: "> " resolves
          // relative to the immediately preceding tween's own end.
          tl.from(
            lede,
            { opacity: 0, y: 16, duration: 0.6, ease: standardEase },
            ">+=0.12",
          );
        }

        if (ctas.length) {
          // See this file's header comment: Button.astro's own CSS
          // `transition` fights GSAP's writes on a staggered target unless
          // it's neutralised BEFORE the tween (a separate `gsap.set()`,
          // never folded into the staggered `.from()`'s own vars) and
          // restored after (`tl.call()`).
          gsap.set(ctas, { transition: "none" });

          // transitionDelay.stagger (0.06s); overlaps the lede's own tween
          // by 0.35s so the row arrives while the lede is still settling.
          tl.from(
            ctas,
            {
              opacity: 0,
              y: 12,
              duration: 0.5,
              ease: standardEase,
              stagger: 0.06,
            },
            "-=0.35",
          );

          tl.call(
            () => {
              ctas.forEach((el) => {
                el.style.transition = "";
              });
            },
            [],
            ">",
          );
        }

        return tl;
      },
    });
  }

  // ObjectiveRecord's rows: their own trigger, separate from the load
  // sequence above (§3.3's table lists it as "own trigger top 85%").
  const rows = Array.from(
    hero.querySelectorAll<HTMLElement>("[data-hero-row]"),
  );
  if (rows.length) {
    gsap.from(rows, {
      opacity: 0,
      y: 12, // translate.stagger token, tailwind.config.mjs
      duration: 0.5,
      ease: standardEase,
      stagger: 0.05,
      scrollTrigger: {
        trigger: rows[0].closest("dl") ?? rows[0],
        start: "top 85%",
        once: true,
      },
    });
  }
});

export {};
