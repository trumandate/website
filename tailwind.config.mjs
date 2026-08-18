// tailwind.config.mjs
//
// THE ONLY FILE CONTAINING A HEX VALUE. Every colour, duration, ease and
// measurement used anywhere in this codebase is a token defined here.
// Derived from docs/trumandate-site-spec.md §3, extended only where §3 is
// silent and the build could not proceed without a value — each such
// addition is justified in PLAN.md §2.
//
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,ts}"],
  theme: {
    // ---- replaced wholesale, not extended: the default palette is deleted ----
    colors: {
      transparent: "transparent",
      currentColor: "currentColor",

      ink: "#04241E", // page ground
      jade: "#0B4A3D", // raised surfaces, alternate section ground
      "jade-lift": "#0F5C4B", // hover, borders on raised, dimmed-composition fills
      accent: "#19C39B", // the single accent
      amber: "#F2B441", // RAG only
      red: "#E0574C", // RAG only
      paper: "#F1F5F3", // primary text, headings
      muted: "#9CB8AE", // secondary text, mono data labels
      body: "#C6DAD3", // running paragraph text (see justification 1)
      surface: "#0A3B31", // fragment card interior (justification 2)
      "surface-deep": "#021813", // fragment ground behind cards (justification 2)
      hairline: "rgba(255,255,255,0.10)", // content-level borders, header rule
      // ---- P10 (DESIGN-ELEVATION.md §2.1) ----
      "hairline-soft": "rgba(255,255,255,0.06)", // chrome/decoration only: section rules, seam edges — never a control's only boundary
      highlight: "rgba(255,255,255,0.16)", // the top-edge light catch on a raised surface
      shade: "rgba(2,24,19,0.55)", // ambient depth layer; = surface-deep #021813 at 55%
    },

    fontFamily: {
      sans: [
        '"IBM Plex Sans Arabic"',
        "system-ui",
        "Segoe UI",
        "Tahoma",
        "sans-serif",
      ],
      mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
    },

    fontWeight: {
      light: "300", // body role
      semi: "600", // display, headings, buttons, Arabic eyebrow
      data: "500", // Plex Mono only
    },

    fontSize: {
      // [size, { lineHeight, letterSpacing }] — Latin values.
      // Arabic line-height and tracking are overridden by [dir=rtl] rules in global.css.
      display: [
        "clamp(2.25rem, 5.2vw, 4.25rem)",
        { lineHeight: "1.06", letterSpacing: "-0.02em" },
      ],
      h2: [
        "clamp(1.65rem, 3.4vw, 2.75rem)",
        { lineHeight: "1.14", letterSpacing: "-0.015em" },
      ],
      h3: [
        "clamp(1.20rem, 2.2vw, 1.65rem)",
        { lineHeight: "1.20", letterSpacing: "-0.01em" },
      ],
      lede: [
        "clamp(1.02rem, 1.4vw, 1.20rem)",
        { lineHeight: "1.55", letterSpacing: "0" },
      ],
      body: ["1rem", { lineHeight: "1.55", letterSpacing: "0" }],
      small: ["0.94rem", { lineHeight: "1.55", letterSpacing: "0" }],
      eyebrow: ["0.70rem", { lineHeight: "1.20", letterSpacing: "0.16em" }],
      datum: ["0.72rem", { lineHeight: "1.30", letterSpacing: "0.10em" }],
      // Arabic counterparts for the two mono roles, which swap face and drop tracking
      "eyebrow-ar": ["0.80rem", { lineHeight: "1.50", letterSpacing: "0" }],
      "datum-ar": ["0.82rem", { lineHeight: "1.60", letterSpacing: "0" }],
    },

    lineHeight: {
      latin: "1.55",
      arabic: "1.80",
      tight: "1.06",
      heading: "1.14",
      "heading-ar": "1.40",
      "display-ar": "1.32",
    },

    letterSpacing: {
      display: "-0.02em",
      "display-lg": "-0.028em", // P10 (§2.4): Latin only, above `lg` where the display clamp tops out at 68px — see global.css's [dir=rtl] zero-override
      heading: "-0.015em",
      brand: "-0.01em",
      none: "0",
      eyebrow: "0.16em",
      datum: "0.10em",
    },

    extend: {
      // Tailwind's own default `aria` variant map (theme, not extend, so it's
      // inherited from the preset since this file never redefines the key
      // wholesale) covers busy/checked/disabled/expanded/hidden/pressed/
      // readonly/required/selected — not `invalid`. P7's contact-form fields
      // need `aria-invalid:border-red` to reflect validation state visually
      // (scripts/contactForm.ts toggles the attribute; the colour is always
      // paired with the field's own error text, never the only signal — spec
      // §9's WCAG contrast/error-identification rule), so the one missing
      // variant is added here rather than hand-writing an attribute-selector
      // in a component `<style>` block.
      aria: {
        invalid: 'invalid="true"',
      },

      maxWidth: {
        content: "1180px", // spec §3, the one wrapper width
        measure: "56ch", // lede
        "measure-tight": "52ch",
        "measure-head": "24ch",
      },

      spacing: {
        header: "6.5rem", // 104px: clears the fixed header (measured 94.625px
        // via chrome-devtools MCP at P2, both 375 and 1440 — see TODO.md's
        // "header height offset is an estimate" item), with ~9px to spare
        // against minor cross-browser font-metric differences.
        gutter: "clamp(1.25rem, 5vw, 4.5rem)", // inline padding, Section.astro only
        section: "clamp(4.5rem, 11vh, 8.25rem)", // block rhythm, Section.astro only
        "section-tight": "clamp(3rem, 7vh, 5rem)",
        rail: "3.375rem", // 54px: content offset from the spine
        node: "0.8125rem", // 13px: chain node diameter
        "node-inset": "2.875rem", // 46px: node centre back from the content edge
        "rag-dot": "0.5625rem", // 9px: RAG status dot diameter (PLAN.md §3, hero panel)
      },

      borderRadius: {
        control: "2px", // buttons, inputs, badges
        card: "4px", // fragment interiors only, matches the real UI
        full: "9999px",
      },

      borderWidth: {
        hair: "1px",
        marker: "2px", // the accent edge rule on the AI card
      },

      opacity: {
        dim: "0.25", // spec §5, the closing-CTA composition
        // P9 gate (user-approved 2026-08-17, resolving the P8 spec-vs-spec
        // conflict logged in known-issues.md/QA-REPORT.md): raised from
        // 0.40 (spec §7's literal "40%") to the smallest two-decimal value
        // that clears WCAG AA (4.5:1) for BOTH chain-link text roles against
        // `ink`, computed with real alpha compositing (contrast does not
        // scale linearly with opacity) — text-body is the binding
        // constraint at 4.43:1 at 0.56 and 4.51:1 at 0.57; text-paper clears
        // well before that (5.68:1 at 0.57). Verified with a fresh Lighthouse
        // accessibility audit on /en/ and /ar/ post-change: 100 on both
        // (was 96). See QA-REPORT.md §4/§6 for the 0.40 measurements this
        // supersedes, and BUILD_FLAGS.md's decisions log for the full
        // before/after.
        rest: "0.57", // chain link copy before activation
        veil: "0.72", // header ground
      },

      transitionTimingFunction: {
        // spec §7 says "custom ease" and never names it. This is the site ease.
        standard: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        // ---- P10 (DESIGN-ELEVATION.md §2.2) — the two-tier system ----
        micro: "cubic-bezier(0.22, 1, 0.36, 1)", // hover/focus/short states ≤300ms. y never exceeds 1: no overshoot, no playful bounce.
        exit: "cubic-bezier(0.32, 0, 0.67, 0)", // ease-IN only (y2=0): dismiss/hide
      },

      transitionDuration: {
        state: "200ms", // hover, focus
        header: "300ms", // motion #6
        card: "500ms", // motion #4, the card's own entrance slide (§7: "a short slide" — no value named, chosen shorter than motion #2's 0.8s reveal since this is the smaller 16px offset)
        bar: "600ms", // motion #4, confidence fill
        reveal: "800ms", // motion #2
        wipe: "900ms", // motion #3
        counter: "1200ms", // motion #5 — §7 names no duration for the count-up; chosen long enough to read as counting, short enough not to stall the reader
        // ---- P10 (DESIGN-ELEVATION.md §2.3) ----
        micro: "150ms", // hover transform + colour, paired with ease-micro
        line: "700ms", // one SplitText line, hero only
        glow: "900ms", // the AI spotlight's fade-and-settle
        // Not one of DESIGN-ELEVATION.md §2.3's named four (that list is
        // micro/line/glow + the stagger delay below): §3.5(c) asks for the
        // chain caption's arrival to run "0.40s", a value with no token
        // anywhere in this document. Rather than write a bare arbitrary
        // duration in scripts/chain.ts (this file is "the ONLY file
        // containing a hex value" and, by the same discipline, the one place
        // every other magnitude lives too), it's named here instead — see
        // chain.ts's own comment and the wave-1 report for the discrepancy.
        copy: "400ms",
      },

      transitionDelay: {
        // P10 (DESIGN-ELEVATION.md §2.3): the one stagger step. Every
        // staggered group on the site uses this, or a stated multiple —
        // groups longer than 8 children halve it to 0.03 in the driving
        // script (the dossier's own limit).
        stagger: "60ms",
      },

      translate: {
        reveal: "24px", // motion #2 offset, spec §7
        card: "16px", // motion #4 slide
        stagger: "12px", // P10 (§2.4): per-child offset in a staggered group; deliberately < reveal's 24px
      },

      zIndex: {
        header: "50",
        progress: "60",
        skip: "70",
      },

      screens: {
        // Tailwind defaults only. No bespoke breakpoints anywhere in the codebase.
      },

      // ---- P10 (DESIGN-ELEVATION.md §2.5) — elevation ----
      // Function form so `theme()` resolves and `highlight`/`shade` each have
      // exactly one spelling. Real-DOM surfaces only: on `ink` a black
      // drop-shadow is invisible, so the inset top highlight is what actually
      // reads as raised (visual dossier #9). SVG fragments never get a
      // box-shadow or filter — see KpiCard.astro and friends, §4.2.
      boxShadow: ({ theme }) => ({
        raised: `inset 0 1px 0 0 ${theme("colors.highlight")}, 0 2px 4px -1px ${theme("colors.shade")}, 0 10px 24px -8px ${theme("colors.shade")}`,
        // Tier 4, the AI card only (one glow per page, DESIGN-ELEVATION §3.6).
        // The distinction is the accent ring, not a brighter white.
        focal: `inset 0 1px 0 0 ${theme("colors.highlight")}, 0 0 0 1px rgba(25,195,155,0.14), 0 2px 4px -1px ${theme("colors.shade")}, 0 14px 32px -10px ${theme("colors.shade")}`,
        // Header, scrolled state only — separates chrome from content by
        // light, not just a line.
        chrome: `0 10px 28px -18px ${theme("colors.shade")}`,
      }),

      // ---- P10 (DESIGN-ELEVATION.md §2.6) — background layers ----
      // Function form so `theme("colors.ink")` / `.surface-deep` each have
      // one spelling. Every value here is an existing token at a stated
      // alpha (named in each comment); no new hue is introduced.
      backgroundImage: ({ theme }) => ({
        // Ground material — hero band and closing CTA ONLY (§1.3(c)).
        "grid-draft":
          "repeating-linear-gradient(to right,  rgba(255,255,255,0.035) 0 1px, transparent 1px 32px)," +
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0 1px, transparent 1px 32px)",
        // Ground luminance — lifts where the eye enters a band, settles by 78%.
        // rgba(15,92,75,…) is `jade-lift`.
        "ground-rise":
          "linear-gradient(to bottom, rgba(15,92,75,0.18) 0%, rgba(15,92,75,0.05) 42%, transparent 78%)",
        // The board's own light, closing CTA only. Ground hue, never accent.
        "ground-board":
          "radial-gradient(70% 55% at 50% 40%, rgba(15,92,75,0.28) 0%, transparent 70%)",
        // Section seams — a 128px blend band, never a 1px cut.
        "seam-down": `linear-gradient(to bottom, ${theme("colors.ink")} 0%, ${theme("colors.surface-deep")} 100%)`,
        "seam-up": `linear-gradient(to bottom, ${theme("colors.surface-deep")} 0%, ${theme("colors.ink")} 100%)`,
        // THE ONE GLOW. AI card only, on a wrapper BEHIND the opaque card
        // (§3.6). rgba(25,195,155,…) is `accent`.
        "spotlight-accent":
          "radial-gradient(58% 58% at 50% 38%, rgba(25,195,155,0.13) 0%, rgba(25,195,155,0.05) 38%, transparent 72%)",
        // Four-edge vignette for the dimmed composition — replaces the hard
        // inline crop. rgba(4,36,30,…) is `ink`.
        "vignette-ink": `radial-gradient(72% 62% at 50% 46%, transparent 30%, rgba(4,36,30,0.55) 68%, ${theme("colors.ink")} 100%)`,
      }),

      // ---- P10 (DESIGN-ELEVATION.md §2.7) ----
      backdropBlur: {
        veil: "10px", // pairs with the existing opacity.veil (0.72)
      },
    },
  },
  corePlugins: {
    // physical-direction utilities are switched off so `ml-`, `pr-`, `text-left`
    // cannot be written by accident. CLAUDE.md greps for them; this makes them
    // fail at build time instead.
    space: false,
    float: false,
    clear: false,
    textAlign: false, // re-provided as .text-start / .text-end in global.css
  },
  plugins: [],
};
