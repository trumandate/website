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
      // Redesign wave A: the Command Centre board's own slightly-fainter
      // chrome dividers/track backgrounds (CommandCentreBoard.dc.html),
      // between `hairline-soft` (.06) and `hairline` (.10).
      "hairline-08": "rgba(255,255,255,0.08)",
      highlight: "rgba(255,255,255,0.16)", // the top-edge light catch on a raised surface
      shade: "rgba(2,24,19,0.55)", // ambient depth layer; = surface-deep #021813 at 55%

      // ---- Redesign wave A (docs/design_handoff_website_redesign/README.md
      // §"Design Tokens") — four owner-approved companion hues. AI/domain
      // accents, chart strokes, figure highlights and gradient pairs only;
      // never body text on jade without checking AA first (README's own
      // caveat), and the existing RAG discipline (amber/red) is unchanged. ----
      mint: "#4BEFC4", // execution hue; AI/domain accent, gradient pair partner for `accent`
      cyan: "#59D8E6", // strategy hue; gradient pair partner for `accent`
      gold: "#FFC95C", // benefits hue; gradient pair partner for `amber`
      coral: "#FF9A90", // critical/off-track hue, light step
      "coral-dark": "#FF7A6E", // critical/off-track hue, dark step (strokes, dots)
      // Live-pulse ring colours (box-shadow keyframes, global.css) — rgba
      // tokens alongside hex ones, same convention as hairline/highlight/shade
      // above: the alpha value is part of the token, not assembled at the
      // call site.
      "mint-ring": "rgba(75,239,196,0.45)",
      "mint-ring-0": "rgba(75,239,196,0)",
      "coral-ring": "rgba(255,122,110,0.55)",
      "coral-ring-0": "rgba(255,122,110,0)",
      // AI decision queue's per-card focal ring (strategy/benefits cards —
      // the execution card reuses the existing `shadow-focal` token, whose
      // accent ring is already this same shape at .14 alpha).
      "cyan-ring-12": "rgba(89,216,230,0.12)",
      "gold-ring-12": "rgba(255,201,92,0.12)",
      // Command Centre board's own micro-shades (CommandCentreBoard.dc.html):
      // the KPI tile's subtle top-to-`surface` gradient, and the AI-watch
      // panel's slightly deeper ground than `surface`. Distinct enough from
      // `jade`/`surface-deep` to warrant their own names rather than reusing
      // either and drifting from the reference.
      "kpi-tile-top": "#0C4237",
      "ai-panel-deep": "#082E26",

      // ---- 2026-08-19 (user directive, BUILD_FLAGS.md decision log): the
      // authoritative Echelons brand-mark geometry, measured from the
      // product's own EchelonsLogo.tsx against the 1173×1174 master. These
      // three are deliberately NOT aliases of jade/accent/paper above — the
      // brand doc treats the mark as a fixed asset, not a themeable
      // composition, so its colours are literal brand values that happen to
      // live here (rather than as bare hex in component markup) purely for
      // this repo's own "no hex outside this file" grep hygiene. Never
      // restyle the mark to jade/accent/paper, and never reuse these three
      // for anything that isn't the mark itself. ----
      "brand-teal": "#0E7E6D", // mark's top bar only — the former accent teal, kept on purpose
      "brand-green": "#21B586", // mark's middle + bottom bars
      "brand-tile": "#F1F4F3", // mark's tile ground (distinct literal from `paper`'s #F1F5F3)
      // 2026-09-01 (user directive): "our brand green is phthalo green
      // #123524" — the brand's deep ground green, distinct from the mark's
      // bar colours above. First surface: the blog's editorial ground.
      phthalo: "#123524",
      // 2026-09-01 blog redesign: the hover/raised step above `phthalo`, so
      // a whole-panel link (the index's featured post, the end-of-post CTA)
      // can change ground on hover without borrowing `jade`, which is much
      // lighter (relative luminance 0.053 vs phthalo's 0.028) and would read
      // as a different surface rather than the same one lit. Measured
      // contrast on this ground stays comfortably AA for all three text
      // roles used on it: body #C6DAD3 9.4:1, muted #9CB8AE 6.3:1,
      // accent #19C39B 6.0:1 (computed against phthalo, the darker of the
      // pair, so the lift only improves them).
      "phthalo-lift": "#17402C",

      // ---- 2026-09-01 contact-form redesign (USER DIRECTIVE: "make it
      // modern and use good design and color, not everything needs to be too
      // dark themed"). The site's ONE light surface: the /contact request
      // card, treated as a paper document laid on the dark ground — which is
      // the brand's own records/registry story rather than a theme break for
      // its own sake. Every token below exists because the dark palette
      // above inverts badly: `paper`/`body`/`muted` are text colours tuned
      // for a dark ground and become invisible on a light one, and `accent`
      // (#19C39B) measures 2.13:1 on this card, i.e. it can be a fill or a
      // 3:1 graphical element here but never text.
      //
      // Measured contrast (WCAG 2.1 relative-luminance formula, computed —
      // not eyeballed — and re-verified in-browser against the built page):
      //   form-ink   on form-paper 14.5:1  · on form-field 15.3:1
      //   form-body  on form-paper  7.1:1  · on form-field  7.5:1
      //   form-muted on form-paper  5.7:1  · on form-field  6.0:1
      //   accent-deep on form-paper 5.0:1  · on form-field  5.3:1
      //   red-deep   on form-paper  6.2:1  · on form-alert  5.7:1
      //   form-field on accent-deep 5.3:1  (submit label)
      //   form-field on accent-deeper 8.0:1 (submit label, hover)
      //   form-line  vs form-field  3.3:1  · vs form-paper  3.1:1 (1.4.11)
      // Nothing on this card is carried by colour alone: every error pairs a
      // red dot with red-deep text, and the chosen interest option carries a
      // filled radio mark as well as a tinted ground.
      "form-paper": "#F7F9F8", // the card itself
      "form-field": "#FFFFFF", // input/textarea interiors, and text ON accent-deep
      "form-ink": "#0B2A22", // labels, entered values, headings on the card
      "form-body": "#3E5A52", // running text on the card
      "form-muted": "#52685F", // helper text, the footnote, optional markers
      "form-line": "#7C9389", // resting input/choice border — a 3:1 boundary, not a hairline
      "form-line-strong": "#5F7A6E", // hover border, disabled submit ground
      "form-rule": "#DCE6E1", // decorative rules inside the card only, never a control's boundary
      "form-tint": "#E4F6F0", // chosen-option ground, success ground
      "form-alert": "#FCECEA", // error-summary and submit-error ground
      "accent-deep": "#0A7A61", // `accent` taken down to an AA text/focus colour on light
      "accent-deeper": "#075C49", // submit hover only
      "accent-deep-ring": "rgba(10,122,97,0.16)", // the soft halo behind the focus outline
      "shade-deep": "rgba(2,24,19,0.72)", // the light card's drop shadow on the dark ground
      "red-deep": "#B3261E", // error text/dot on light — `red` (#E0574C) is 3.5:1 here, under the 4.5:1 text floor
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

      // CAUTION for anything added below: `body` is a key in BOTH this map and
      // `colors` above, so `text-body` emits a font-size rule as well as a
      // colour rule, and Tailwind orders the generated fontSize utilities
      // ALPHABETICALLY. `.text-body` therefore lands after every `.text-blog-*`
      // in the stylesheet, and an element written as
      // `class="text-blog-lede … text-body"` silently renders at 1rem. Measured
      // in the built CSS during the 2026-09-01 blog redesign, not assumed. The
      // existing `text-lede`/`text-small` call sites happen to be safe only
      // because "lede" and "small" sort AFTER "body". Anything that needs one
      // of the sizes below together with the body colour must let the colour
      // inherit (global.css applies `text-body` to the `body` element itself)
      // rather than restate it as a utility. See known-issues.md.
      //
      // ---- 2026-09-01 blog redesign (USER REPORT: "the font on blog home
      // page is really big… it looks bad in laptop"). The blog was reusing
      // `display` for the index H1 (68px at ≥1440) and `h2`/`h3` for
      // in-article headings (44px H2 against a 44px H1), so an index page
      // shouted like a marketing hero and an article had no internal
      // hierarchy left. A marketing hero and a 1,700-word article need
      // different scales: the hero's job is to arrest, the article's is to
      // be read for six minutes without fatigue, which means a shallower
      // ratio, a longer line-height and a bounded measure (see
      // `maxWidth.measure-prose` below).
      //
      // These eight are blog-only and deliberately NOT aliases of the site
      // scale above — a future change to the marketing display clamp must
      // not silently resize an article. Ratio is ~1.18 between adjacent
      // article steps (body 18 → h3 19 → h2 26 → title 44 at 1440), which
      // keeps H2 unmistakably subordinate to the title while still reading
      // as a section break.
      //
      // Arabic line-height is overridden per role in BlogPostArticle.astro
      // and by global.css's existing `[dir=rtl] h1,h2,h3` base rules, same
      // as every other size token here; letter-spacing is likewise zeroed
      // for Arabic by global.css.
      "blog-index-heading": [
        "clamp(1.6rem, 2.6vw, 2.25rem)", // 25.6 → 36px
        { lineHeight: "1.16", letterSpacing: "-0.015em" },
      ],
      "blog-featured-title": [
        "clamp(1.4rem, 2.2vw, 1.85rem)", // 22.4 → 29.6px
        { lineHeight: "1.22", letterSpacing: "-0.012em" },
      ],
      "blog-card-title": [
        "clamp(1.125rem, 1.5vw, 1.3rem)", // 18 → 20.8px
        { lineHeight: "1.30", letterSpacing: "-0.01em" },
      ],
      "blog-title": [
        "clamp(1.9rem, 3.4vw, 2.75rem)", // 30.4 → 44px
        { lineHeight: "1.12", letterSpacing: "-0.018em" },
      ],
      // The three article-body steps below were each raised one notch in the
      // 2026-09-01 wide-screen pass (second USER REPORT: "blogs' content is
      // not increasing width wise on large screens"). The article column grew
      // from 576px to 704px there, and a wider column at the same size is how
      // you get a 90-character line — so the type grew with it, which is what
      // holds characters-per-line inside the readable band. Measured after:
      // 77.4 and 76.7 characters per line at 1440 across the two longest
      // posts (max 85/86), unchanged at 1920 and 2560 because the content box
      // stops growing. Below `lg` nothing moved: the
      // clamps' floors are unchanged, so 375 renders exactly as before.
      "blog-h2": [
        "clamp(1.35rem, 1.9vw, 1.7rem)", // 21.6 → 27.2px
        { lineHeight: "1.25", letterSpacing: "-0.01em" },
      ],
      "blog-h3": [
        "clamp(1.1rem, 1.35vw, 1.28rem)", // 17.6 → 20.5px
        { lineHeight: "1.35", letterSpacing: "-0.005em" },
      ],
      // 17px at 375, ~19.5px at 1024, 20px from ~1235 up. Written as an
      // explicit `min + vw` sum rather than a bare `vw` preferred value
      // because a bare `1.1vw` never exceeds the 17px floor until ~1550px,
      // i.e. the token would silently never reach its own maximum on a
      // laptop. The 0.35vw slope is deliberately shallow: the floor must stay
      // exactly 17px at 375 (it is what the phone measure was tuned against)
      // while the ceiling has to reach ~19.5px to keep the wide column's
      // characters-per-line under 80.
      "blog-body": [
        "clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)", // 17 → 20px
        { lineHeight: "1.70", letterSpacing: "0" },
      ],
      "blog-lede": [
        "clamp(1.125rem, 1.5vw, 1.35rem)", // 18 → 21.6px
        { lineHeight: "1.60", letterSpacing: "0" },
      ],
    },

    lineHeight: {
      latin: "1.55",
      arabic: "1.80",
      // 2026-09-01 blog redesign: long-form running text only. 1.55/1.80 are
      // tuned for the marketing pages' short paragraphs; a 1,700-word
      // article wants a looser leading (the widely-cited 1.5–1.75 band for
      // body copy, taken to its upper end here because the measure is long
      // and the ground is dark, where tight leading reads as heavier).
      // Arabic goes further again for the same reason its base line-height
      // is already 1.80 — ascenders/descenders and diacritics need the room.
      prose: "1.70",
      "prose-ar": "1.90",
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
        // ---- 2026-09-01 blog redesign, article reading column. Two values,
        // one per composition, because the blog has two: a single centred
        // column below `lg`, and a rail-plus-column grid at `lg` and up (the
        // second USER REPORT: "blogs' content is not increasing width wise on
        // large screens … lot of empty space both sides in big monitor
        // screen").
        //
        // `rem`, not `ch`: `ch` resolves against the ELEMENT's font-size, and
        // `.blog-prose` itself inherits 16px while its paragraphs set their
        // own (now fluid) size — so a `ch` cap silently stopped tracking the
        // text it was supposed to measure the moment `blog-body` became
        // fluid. Both values were tuned by measuring real
        // characters-per-line at 1440 rather than picked off a ratio.
        "measure-prose": "38rem", // 608px — the centred column below `lg`
        // 704px. The grid at `lg` is 16.5rem rail + 4.25rem gap + this,
        // which sums to exactly 1036px: the inner width of the site's own
        // `max-w-content` + `px-gutter` wrapper, i.e. the header's own
        // content box. So the rail's start edge lands on the brand mark's
        // start edge and this column's end edge on the CTA's end edge, with
        // no dead rail on either side. Change any one of the three and the
        // other two must change with it.
        "measure-prose-wide": "44rem",
        // The index header's standfirst, sitting beside the H1 at ≥lg rather
        // than under it. Narrower than `measure` so the two-column header
        // keeps a real gutter instead of two columns meeting in the middle.
        "measure-standfirst": "46ch",
        // Mobile nav drawer (P11, USER REPORT fix): the panel's own inline-
        // size cap, named here rather than left as an arbitrary bracket
        // value in NavDrawer.astro per this file's own "tokens only"
        // discipline. min(), not a bare vw or rem: at ≤375 it reads as 85% of
        // the viewport (never edge-to-edge, backdrop stays visible past it);
        // above ~414px it settles at 22rem (352px) so the panel stops
        // growing once it's comfortably a one-hand reach.
        "nav-panel": "min(85vw, 22rem)",
      },

      spacing: {
        header: "4.5625rem", // 73px: clears the fixed header. Re-measured for
        // the redesign wave A home-page fidelity fix (chrome-devtools MCP,
        // getBoundingClientRect, /en/ and /ar/, 375 and 1440): the header now
        // renders at 71.3125px — smaller than the 94.625px this token was
        // originally tuned against at P2 (TODO.md's "header height offset is
        // an estimate" item), because the redesign's own type-scale tokens
        // shrank the wordmark. The old 104px (6.5rem) value stacked with
        // Hero.astro's own reference-exact `padding-top: clamp(...)` to sit
        // the hero ~33px lower than Home (redesign).dc.html at 1440×900,
        // scroll 0. 73px keeps a ~1.7px cross-browser safety margin over the
        // measured height (just enough to absorb sub-pixel/font-metric
        // drift, not a whole extra line) while landing the built hero within
        // ~2px of the reference at every measured breakpoint.
        gutter: "clamp(1.25rem, 5vw, 4.5rem)", // inline padding, Section.astro only
        section: "clamp(4.5rem, 11vh, 8.25rem)", // block rhythm, Section.astro only
        "section-tight": "clamp(3rem, 7vh, 5rem)",
        rail: "3.375rem", // 54px: content offset from the spine
        node: "0.8125rem", // 13px: chain node diameter
        "node-inset": "2.875rem", // 46px: node centre back from the content edge
        "rag-dot": "0.5625rem", // 9px: RAG status dot diameter (PLAN.md §3, hero panel)

        // ---- 2026-09-01 blog wide-screen pass ----
        // Gap between the post page's table-of-contents rail and its article
        // column at `lg` and up. Load-bearing arithmetic, not taste: 16.5rem
        // rail + 4.25rem gap + 44rem column = 1036px = the inner width of
        // `max-w-content` minus two `px-gutter`s at any viewport from ~1324px
        // up, where that wrapper stops growing. See `maxWidth.measure-prose-wide`.
        "blog-gap": "4.25rem",
        // Block-start offset for the sticky TOC, and the matching
        // `scroll-margin-block-start` on in-article headings so an anchor jump
        // does not land the heading underneath the fixed header. `header`
        // (73px) plus 24px of air.
        "sticky-top": "6.0625rem",
      },

      // 2026-09-01 blog wide-screen pass — the post page's only grid. Rail is
      // a fixed 16.5rem (264px): wide enough that a long section heading wraps
      // to two lines rather than five, narrow enough to leave the article the
      // 44rem it needs. Column two is `minmax(0, 1fr)` rather than a second
      // fixed track so it collapses gracefully between `lg` (1024px, where the
      // content box is narrower than 1036px) and ~1324px, where everything
      // reaches its final size. `minmax(0, …)`, not a bare `1fr`: a bare `1fr`
      // has an `auto` minimum, so one long unbreakable token in the prose
      // would blow the track past the container and reintroduce the horizontal
      // overflow this project greps for.
      gridTemplateColumns: {
        blog: "16.5rem minmax(0, 1fr)",
      },

      maxHeight: {
        // The sticky TOC's own scroll cap: a post with more sections than fit
        // beside the reader's viewport scrolls inside the rail rather than
        // pushing the rail past the fold where the sticky offset can never
        // bring it back.
        toc: "70vh",
      },

      borderRadius: {
        control: "2px", // buttons, inputs, badges
        card: "4px", // fragment interiors only, matches the real UI
        full: "9999px",
        // Redesign wave A: the Command Centre board's own panel/KPI-tile
        // radius (README's CommandCentreBoard.dc.html `.tm-kpi`/`.tm-panel`).
        panel: "6px",
        // ---- 2026-09-01 contact-form redesign ----
        // The light request card and its controls. Two values rather than
        // reusing `panel` (6px) because the relationship has to be concentric:
        // a 6px card holding 8px fields reads as a mistake (inner radius
        // larger than outer). `paper` is the outer corner, `field` every
        // control inside it — inputs, choice cards, the status region and the
        // submit button, so the card has exactly one control shape.
        paper: "14px",
        field: "8px",
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

        // ---- Redesign wave A — the .dc.html reference's own named motion
        // durations (README "Interactions & Behavior"), carried over as
        // tokens rather than bare numbers in global.css/component <style>
        // blocks, same discipline as every duration above. ----
        "tm-load": "900ms", // hero load cascade
        "tm-board": "1250ms", // Command Centre board's own entrance
        "tm-rise": "850ms", // .tm-rise scroll reveal
        "tm-fade": "1100ms", // .tm-fade scroll reveal (audit strip)
        "tm-grow": "1200ms", // .tm-grow scaleX draw (rules, confidence bars)
        "tm-pulse": "2400ms", // live-pulse ring, mint
        "tm-pulse-r": "2200ms", // live-pulse ring, coral (critical)
        "tm-spark": "2200ms", // sparkline stroke-dashoffset draw
        "tm-counter": "1300ms", // proof-band count-up
        // Mini-feature: the record chain's scroll-down nudge
        // (RecordChain.astro/recordChain.ts) — one drift-and-reset loop of
        // the travelling highlight. Deliberately slow and continuous: a
        // quiet wayfinding cue, not a pulse.
        "tm-hint": "2600ms",
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
        // Mobile nav drawer (P11): above the fixed header's own z-header so
        // the panel/backdrop always paint over it if the two ever overlap
        // (the panel is positioned to start below the header's rendered
        // height, not stacked on top of it, so this is a safety margin, not
        // load-bearing); below `skip` so a focused skip-link still shows
        // through if it's ever mid-transition when the drawer opens.
        "nav-drawer": "65",
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
        // Redesign wave A — the AI decision queue's strategy/benefits cards
        // (Home (redesign).dc.html §4): `shadow-raised`'s two-layer depth
        // plus a hue-tinted ring, one per card colour. The execution card
        // (mint accent, spotlighted) reuses `shadow-focal` above instead —
        // its ring is the same shape at the same .14 accent alpha already.
        "card-cyan": `inset 0 1px 0 0 ${theme("colors.highlight")}, 0 0 0 1px ${theme("colors.cyan-ring-12")}, 0 10px 24px -8px ${theme("colors.shade")}`,
        "card-gold": `inset 0 1px 0 0 ${theme("colors.highlight")}, 0 0 0 1px ${theme("colors.gold-ring-12")}, 0 10px 24px -8px ${theme("colors.shade")}`,
        // Record-chain scroll-down nudge (RecordChain.astro's travelling
        // bead, USER REQUEST "make the nudging more prominent"): a static
        // halo, not an animated one — the only things ever animated on the
        // bead are its own opacity/transform (motion doctrine's "transforms
        // and opacity only"), so this shadow never itself transitions; it
        // just rides along, fading with the element's own opacity keyframe.
        // Reuses the existing `mint-ring` live-pulse token rather than
        // inventing a new alpha, so the glow reads as the same accent
        // language as the chain's own live dot, not a new visual idiom.
        "hint-glow": `0 0 18px 4px ${theme("colors.mint-ring")}`,

        // ---- 2026-09-01 contact-form redesign ----
        // `shadow-raised` above is built for a dark surface on a dark ground,
        // where an inset white highlight is the only thing that reads as
        // raised. The light card is the opposite case: on the dark ground a
        // real cast shadow reads immediately, and an inset white highlight on
        // white is invisible. Hence a two-layer cast shadow, contact card
        // only.
        paper: `0 2px 6px -2px ${theme("colors.shade")}, 0 28px 64px -28px ${theme("colors.shade-deep")}`,
        // Inputs and choice cards at rest: a 1px inset top shade, so a field
        // reads as a well cut into the paper rather than a flat outlined box.
        field: `inset 0 1px 2px 0 rgba(11,42,34,0.06)`,
        // Focus halo, paired with (never instead of) the 2px accent-deep
        // outline — the outline is what carries the 3:1 indicator contrast,
        // the halo is only there to soften it.
        "field-focus": `0 0 0 4px ${theme("colors.accent-deep-ring")}`,
        // The chosen interest option's radio mark: one element, no nested
        // dot span. The inset ring punches a `form-field` circle out of an
        // `accent-deep` filled disc, which is a classic radio, and it
        // survives a `peer-checked:` variant (a nested dot would not — the
        // `~` sibling combinator cannot reach into a sibling's descendants).
        "radio-dot": `inset 0 0 0 3px ${theme("colors.form-field")}`,
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

        // ---- Redesign wave A — gradient text + confidence-bar pairs
        // (README "Design Tokens": "gradient pairs (accent→mint, accent→cyan,
        // amber→gold)"). Each pair ships an LTR and an RTL angle so a caller
        // just switches the class by `lang` — no scoped `[dir=rtl]` style
        // block needed (known-issues.md P5: that pattern silently fails to
        // match inside Astro's per-component style scoping unless wrapped in
        // `:global()`, so callers pick the class directly instead here). ----
        "gradient-text": `linear-gradient(92deg, ${theme("colors.accent")} 0%, ${theme("colors.cyan")} 100%)`,
        "gradient-text-rtl": `linear-gradient(268deg, ${theme("colors.accent")} 0%, ${theme("colors.cyan")} 100%)`,
        "grad-mint": `linear-gradient(90deg, ${theme("colors.accent")}, ${theme("colors.mint")})`,
        "grad-mint-rtl": `linear-gradient(270deg, ${theme("colors.accent")}, ${theme("colors.mint")})`,
        "grad-cyan": `linear-gradient(90deg, ${theme("colors.accent")}, ${theme("colors.cyan")})`,
        "grad-cyan-rtl": `linear-gradient(270deg, ${theme("colors.accent")}, ${theme("colors.cyan")})`,
        "grad-gold": `linear-gradient(90deg, ${theme("colors.amber")}, ${theme("colors.gold")})`,
        "grad-gold-rtl": `linear-gradient(270deg, ${theme("colors.amber")}, ${theme("colors.gold")})`,
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
