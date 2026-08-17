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
      hairline: "rgba(255,255,255,0.10)",
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
      },

      transitionDuration: {
        state: "200ms", // hover, focus
        header: "300ms", // motion #6
        card: "500ms", // motion #4, the card's own entrance slide (§7: "a short slide" — no value named, chosen shorter than motion #2's 0.8s reveal since this is the smaller 16px offset)
        bar: "600ms", // motion #4, confidence fill
        reveal: "800ms", // motion #2
        wipe: "900ms", // motion #3
        counter: "1200ms", // motion #5 — §7 names no duration for the count-up; chosen long enough to read as counting, short enough not to stall the reader
      },

      translate: {
        reveal: "24px", // motion #2 offset, spec §7
        card: "16px", // motion #4 slide
      },

      zIndex: {
        header: "50",
        progress: "60",
        skip: "70",
      },

      screens: {
        // Tailwind defaults only. No bespoke breakpoints anywhere in the codebase.
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
