# PLAN.md — TruMandate marketing site

Output of P0. Read, plan, no code. Sources read in full: `docs/trumandate-site-spec.md`,
`docs/trumandate-content-brief.md`, `docs/trumandate-product-pages.md`, `CLAUDE.md`,
`BUILD_FLAGS.md`, `README-BUILD.md`. `docs/trumandate-home.html` was read only for the
Command Centre SVG geometry and the Arabic strings; its layout and composition are
rejected and did not inform section 3.

Sections:

1. File tree
2. Tailwind token config
3. Visual direction for the home page
4. Ambiguities and contradictions

---

## 1. File tree

Astro static, npm, Node LTS pinned, strict TypeScript, `.astro` components only, GSAP
core + ScrollTrigger + SplitText, Lenis, self-hosted subset woff2, Astro i18n at
`/en` and `/ar`.

```
trumandate-site/
├── .nvmrc                              # Node LTS, pinned major.minor.patch
├── .gitignore
├── .prettierrc                         # Prettier defaults + prettier-plugin-astro
├── package.json                        # every dependency version-pinned, no ^ or ~
├── package-lock.json
├── astro.config.mjs                    # static output, i18n, tailwind integration
├── tailwind.config.mjs                 # THE ONLY FILE CONTAINING A HEX VALUE
├── tsconfig.json                       # extends astro/tsconfigs/strict
│
├── CLAUDE.md                           # exists
├── BUILD_FLAGS.md                      # exists, appended to as decisions are taken
├── README-BUILD.md                     # exists
├── PLAN.md                             # this file
├── TODO.md                             # created at P1, all deferred work
├── known-issues.md                     # created at P1, defects with reasons
├── COPY-REVIEW.md                      # created at P6, product page prose
├── QA-REPORT.md                        # created at P8
├── MORNING-REPORT.md                   # created at P9
│
├── docs/
│   ├── trumandate-site-spec.md
│   ├── trumandate-content-brief.md
│   ├── trumandate-product-pages.md
│   ├── trumandate-site-prompts.md
│   └── trumandate-home.html            # discarded prototype, kept for SVG geometry only
│
├── public/
│   ├── fonts/
│   │   ├── plex-sans-arabic-latin-300.woff2
│   │   ├── plex-sans-arabic-latin-600.woff2
│   │   ├── plex-sans-arabic-arabic-300.woff2
│   │   ├── plex-sans-arabic-arabic-600.woff2
│   │   └── plex-mono-latin-500.woff2          # /en only, never preloaded on /ar
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── apple-touch-icon.png                   # 180 × 180
│   ├── site.webmanifest
│   ├── robots.txt                             # noindex until launch day
│   ├── og/
│   │   ├── og-en.png                          # 1200 × 630
│   │   └── og-ar.png                          # 1200 × 630
│   └── vendor/
│       ├── intertec-systems.svg               # placeholder until Piyush supplies
│       └── iso-27001.svg                      # placeholder, contact page only
│
└── src/
    ├── env.d.ts                               # PUBLIC_FORMSPREE_ENDPOINT typed here
    │
    ├── styles/
    │   ├── global.css                         # @tailwind layers, @font-face, reset,
    │   │                                      # motion END STATES, reduced-motion branch
    │   └── fonts.css                          # @font-face only, unicode-range split
    │
    ├── i18n/
    │   ├── ui.ts                              # the string table, en + ar, typed keys
    │   ├── utils.ts                           # getLangFromUrl, useTranslations, altUrl
    │   └── types.ts
    │
    ├── layouts/
    │   └── BaseLayout.astro                   # html lang/dir, head, font preload per
    │                                          # locale, skip link, header, footer, slot
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.astro                   # fixed, hairline appears after 12px
    │   │   ├── Nav.astro
    │   │   ├── LangToggle.astro               # names target language in its own script
    │   │   ├── Footer.astro
    │   │   ├── SkipLink.astro
    │   │   └── Section.astro                  # THE ONLY OWNER OF max-width + rhythm
    │   │
    │   ├── type/
    │   │   ├── Eyebrow.astro                  # mono Latin / sans 600 Arabic swap
    │   │   ├── Display.astro
    │   │   ├── Heading.astro
    │   │   ├── Lede.astro
    │   │   └── Datum.astro                    # mono data label, same script swap
    │   │
    │   ├── ui/
    │   │   ├── Button.astro                   # primary + ghost, one component
    │   │   ├── Reveal.astro                   # motion #2, the ONLY reveal wrapper
    │   │   ├── RagDot.astro                   # colour + visually-hidden status word
    │   │   ├── Rule.astro                     # hairline, solid or dashed
    │   │   └── Counter.astro                  # motion #5, one instance per route
    │   │
    │   ├── home/
    │   │   ├── Hero.astro
    │   │   ├── ObjectiveRecord.astro          # hero data panel, DOM + one sparkline path
    │   │   ├── FailureModes.astro             # three named modes, no cards, no icons
    │   │   ├── Spine.astro                    # the rail, shared hero → chain → AI
    │   │   └── ClosingCta.astro               # dimmed Command Centre + CTA
    │   │
    │   ├── chain/
    │   │   ├── ChainSection.astro             # the one pinned section
    │   │   ├── ChainMarker.astro              # sticky column: active name + 01–05
    │   │   └── ChainLink.astro                # node, heading, body
    │   │
    │   ├── ai/
    │   │   └── SuggestionCard.astro           # signal / confidence / gate / audit line
    │   │
    │   ├── fragments/                         # every file here is hand-authored SVG
    │   │   ├── StageGateQueue.astro           # home, inside the chain
    │   │   ├── KpiCard.astro                  # /strategy
    │   │   ├── InitiativeRows.astro           # /execution
    │   │   ├── BenefitCurve.astro             # /benefits
    │   │   └── CommandCentreDim.astro         # home closing CTA, single-hue, dimmed
    │   │
    │   ├── product/
    │   │   ├── ArgumentBlock.astro            # the 3–4 paragraph argument
    │   │   └── Handoff.astro                  # withheld-item sentence + CTA
    │   │
    │   ├── forms/
    │   │   ├── WalkthroughForm.astro
    │   │   ├── Field.astro
    │   │   └── FormStatus.astro               # aria-live success and error
    │   │
    │   └── seo/
    │       ├── Meta.astro                     # title, description, OG, hreflang
    │       └── JsonLd.astro                   # Organization + SoftwareApplication
    │
    ├── scripts/
    │   ├── motion.ts                          # gsap.matchMedia, the reduced-motion gate
    │   ├── reveal.ts                          # motion #2
    │   ├── chain.ts                           # motion #1, pin + scrub, one per route
    │   ├── fragment.ts                        # motion #3, mask transform wipe
    │   ├── aiCard.ts                          # motion #4
    │   ├── counter.ts                         # motion #5
    │   ├── header.ts                          # motion #6
    │   ├── lenis.ts                           # removed, not patched, if it fights iOS
    │   └── form.ts                            # fetch post, inline states
    │
    └── pages/
        ├── index.astro                        # 302 to /en/
        ├── en/
        │   ├── index.astro
        │   ├── strategy.astro
        │   ├── execution.astro
        │   ├── benefits.astro
        │   └── contact.astro
        ├── ar/
        │   ├── index.astro
        │   ├── strategy.astro
        │   ├── execution.astro
        │   ├── benefits.astro
        │   └── contact.astro
        ├── 404.astro
        └── sitemap.xml.ts
```

Notes on the tree:

- **`Section.astro` is the only component that sets horizontal padding or vertical
  rhythm.** Spec §3. Every page composes sections; no page has a style attribute.
- **No React.** Nothing on this site holds state that outlives a DOM event. The form
  is a `<form>` with a fetch handler, not a component.
- **Five font files, and no locale loads all five.** `/en` preloads
  `sans-latin-300`, `sans-latin-600`, `mono-latin-500`. `/ar` preloads the two Arabic
  faces plus the two Latin faces, because "TruMandate" stays in Latin script and the
  spec keeps Western digits for KPI values. `/ar` never loads Plex Mono — spec §3
  swaps the mono role to Plex Sans 600 in Arabic, so shipping mono to an Arabic reader
  is dead weight.
- **`src/scripts/` are plain TS modules imported by page-level `<script>` tags** so
  Astro bundles and tree-shakes them per route. `/contact` pulls no GSAP at all.
- **`global.css` holds the motion end states.** GSAP only ever runs `gsap.from()`.
  If the JS bundle fails, every element is already in its final position.

---

## 2. Tailwind token config

Every hex, every duration, every ease, every measurement lives here. Derived from
spec §3, extended only where §3 is silent and the build cannot proceed without a
value. Each addition is named and justified below the config.

```js
// tailwind.config.mjs
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
      maxWidth: {
        content: "1180px", // spec §3, the one wrapper width
        measure: "56ch", // lede
        "measure-tight": "52ch",
        "measure-head": "24ch",
      },

      spacing: {
        gutter: "clamp(1.25rem, 5vw, 4.5rem)", // inline padding, Section.astro only
        section: "clamp(4.5rem, 11vh, 8.25rem)", // block rhythm, Section.astro only
        "section-tight": "clamp(3rem, 7vh, 5rem)",
        rail: "3.375rem", // 54px: content offset from the spine
        node: "0.8125rem", // 13px: chain node diameter
        "node-inset": "2.875rem", // 46px: node centre back from the content edge
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
        rest: "0.40", // chain link copy before activation
        veil: "0.72", // header ground
      },

      transitionTimingFunction: {
        // spec §7 says "custom ease" and never names it. This is the site ease.
        standard: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },

      transitionDuration: {
        state: "200ms", // hover, focus
        header: "300ms", // motion #6
        bar: "600ms", // motion #4, confidence fill
        reveal: "800ms", // motion #2
        wipe: "900ms", // motion #3
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
```

**Justifications for the three colour tokens spec §3 does not contain.** BUILD_FLAGS
says prefer the option that removes rather than adds, so each of these had to earn a
place.

1. `body #C6DAD3`. §3 gives two text colours. `paper` on `ink` measures 15.0:1 — too
   bright for a 300-weight paragraph on a near-black ground, it glares. `muted` on
   `ink` is 7.8:1 and is the correct value for labels, but reads as de-emphasised for
   running prose. Every long paragraph on the site would otherwise have to pick a
   wrong one. `body` on `ink` measures 10.9:1.
2. `surface #0A3B31` and `surface-deep #021813`. A fragment has to sit _inside_
   something for the crop to read as a screen edge rather than a page edge. `jade` is
   the section ground and cannot also be the card fill, or cards vanish. These two are
   the fragment interior and the fragment ground, and they appear nowhere except
   inside `components/fragments/`.

**What was deliberately not added.** No accent hover token. The primary button hovers
by inverting — `bg-accent text-ink` becomes `bg-transparent text-accent border-accent` —
which costs no new hex and reads as a deliberate state change rather than a brightness
nudge. No second hairline weight; the prototype used three near-identical white alphas
and one is sufficient. No shadow scale; §3 bans drop shadows on text and the site has
no elevation model.

**Contrast pairs measured against the actual tokens** (spec §9 requires this, and two
pairs are close enough to matter):

| Pair               | Ratio  | Verdict                        |
| ------------------ | ------ | ------------------------------ |
| `paper` on `ink`   | 15.0:1 | pass                           |
| `body` on `ink`    | 10.9:1 | pass                           |
| `muted` on `ink`   | 7.8:1  | pass                           |
| `accent` on `ink`  | 7.3:1  | pass                           |
| `muted` on `jade`  | 4.8:1  | pass AA normal text, no margin |
| `accent` on `jade` | 4.6:1  | pass AA normal text, no margin |
| `ink` on `accent`  | 7.3:1  | pass (primary button)          |

The last two are the constraint. `accent` is the eyebrow colour and `jade` is the
alternate section ground, so any eyebrow on a jade section sits at 4.6:1 at 0.70rem.
It passes AA but it will not survive a token nudge, and it does not meet AAA. Flagged
in section 4.

---

## 3. Visual direction for the home page

### The one idea

**The page has a spine.** A single hairline rule sits on the inline-start edge of the
content column, begins in the hero, runs the length of the page, and is interrupted
exactly once — through the problem section, where it goes dashed and loses its nodes,
because that section is about the chain not existing. It resolves back to solid at the
traceability section, gains five nodes, fills to accent as the reader scrolls, and
terminates by arriving at the inline-start edge of the AI suggestion card and stopping
there.

That is the signature, and it is the only place boldness is spent. Everything else on
the page is disciplined type on hairline rules inside one 1180px column.

**Why the spine, and why not the alternatives.** Three other directions were on the
table and each was rejected for a reason worth recording:

- _Split hero — headline in one column, a floating data card in the other._ This is
  what the discarded prototype did and it is what every portfolio management vendor
  does. Worse, it makes the hero card the page's first product surface, which pushes
  the home page to three product surfaces against spec §5's cap of two, and it dresses
  the card in a gradient fill and a drop shadow that §3 bans outright.
- _The broken chain as the hero._ Show the five link names with the connecting rule
  missing, then explain the break. Clever, but it spends the signature before the
  signature section arrives, and the traceability sequence then has nothing left to
  reveal.
- _A conventional scroll-story: pin the section, swap five full-screen panels._ Five
  heading-plus-paragraph blocks cycling through one slot is a slideshow. It requires
  roughly five viewport heights of manufactured scroll distance, which is close enough
  to the scroll-jacking §7 bans, and with JavaScript disabled it degrades to five
  overlapping blocks.

The spine wins because it is the only option where the visual device _is_ the argument.
Traceability is continuity of a line and each record carrying the identity of the one
above it. A line that literally does not break, drawn in one pixel, states that without
a word — and it costs nothing in payload, mirrors for free under RTL because it is
positioned with `inset-inline-start`, and needs no JavaScript to exist.

Self-critique, applied honestly: the dashed segment through the problem section is the
one accessory to remove if anything has to go. If it reads as a rendering fault rather
than a deliberate break during review, cut it and let the spine simply not appear in
that section. The hero spine and the chain spine stay regardless.

### Hero

Type only. No card, no panel border, no product chrome.

The eyebrow ("Portfolio governance · Intertec Systems") sits in mono at 0.16em on the
spine's first node — an unlit node, hairline-outlined, not accent. The headline
("Every mandate, traced to the outcome it promised.") is set at `display`, 600,
-0.02em, capped at roughly 20ch so it breaks to three lines on desktop and reads as a
statement rather than a banner. The lede follows at 300 on `measure`. Then the two CTAs
from the content brief, primary and ghost.

The hero data panel from content brief §1 — the objective record, four rows plus the
sparkline — sits **below** the CTAs, attached to the spine as its second node, at the
full width of the text column rather than parked in a right-hand gutter. It is built
from DOM and hairline rules: label row in mono at `muted`, four rows separated by
`border-block-start` hairlines, values in mono at `paper`, RAG dots as 9px circles
carrying a visually-hidden status word. The sparkline is one inline SVG `path`, 11
points, accent stroke, no fill, no axis.

**Why demote it rather than delete it.** BUILD_FLAGS makes home-page English copy
verbatim from the content brief, so the panel's content is not mine to remove. But
rendering it as _page typography on rules_ rather than as _a crop of a screen_ is what
keeps the home page at two product surfaces instead of three. §3 already asks for
hairline rules rather than cards; this is the spec applied, not bent. It also puts the
first real number on the page — AED 41M — inside the reader's main reading column
instead of off to one side where a scanning reader misses it.

**Counter (motion #5, one per route): AED 41M.** Not the KPI. Counting "68 / 75" would
animate a current reading and quietly imply the number is moving as you watch, which
is a small lie about a governance product. A benefit-to-date figure is a running total
by definition, so counting it up is honest. It counts on first view, once.

Hero height is content-driven, not `100svh`. A forced full-viewport hero pushes the
problem section entirely below the fold on a laptop, and the argument this page makes
needs the reader to reach the second section.

### The problem — three named failure modes

Three columns on `lg`, stacked below. Each is a hairline top rule, a mono label
(Planning / Execution / Reporting), then the paragraph at `body`. No cards, no icons,
no numbers.

The content brief is explicit that these are categories and not a sequence, so
numbering them would encode something untrue. The mono label at 0.16em does the
identifying work a glyph would have done, and does it better, because it names the
thing. Spec §3 bans three-column icon-on-top card grids; this is that grid with the
card and the icon removed, which is the layout §3 is actually asking for.

The spine runs behind this section as a dashed hairline with no nodes.

### The traceability chain — the one pinned section, the one scrubbed timeline

Two columns on `lg`.

**Inline-start column, pinned.** A narrow sticky column, roughly 4 columns wide,
containing the spine, a mono counter reading `01 / 05` through `05 / 05`, and the
active link's name in `h3`. It pins at the top of the section, unpins at the bottom.
It is `aria-hidden`, because every word in it also appears in the scrolling column.

**Inline-end column, scrolls normally.** The five link blocks — Objective, KPI,
Initiative, Milestone, Benefit — each with its node on the spine, its heading, and its
paragraph. Nodes are 13px circles centred 46px back from the content edge, `jade` fill
with a `muted` hairline at rest, `accent` fill with an accent ring when active.

**The one scrubbed timeline** is the spine's fill, tied to the section's scroll
progress via ScrollTrigger `scrub`. It is a child element scaled with
`transform: scaleY()` from `transform-origin: top`, not a height or a
`stroke-dashoffset` animation — CLAUDE.md permits transforms and opacity only, and a
scaled 1px rule composites on the GPU and never triggers layout.

Node activation and copy lift are **not** part of the scrub. Each link block gets its
own one-shot ScrollTrigger firing at 78% of viewport height: the node's fill and ring
transition, and the block's heading and paragraph go from `opacity: 0.40` to 1. Cheap,
independent, and it means a slow scrub never leaves text half-legible.

**Scroll distance is the natural height of the five blocks.** Nothing is manufactured.
The pin holds a column that is shorter than the content beside it, which is what a pin
is for.

**Below `lg` the pin is dropped entirely.** No sticky column, no mono counter — the
spine and the node activation remain, and the link blocks run as an ordinary list. A
pinned viewport on a 375px screen with a paragraph in it is a bad experience and the
route's pin budget is a maximum, not a quota.

**The fragment inside the chain: the stage gate queue item, attached to Milestone.**
Spec §5 says the home page carries one fragment inside the chain sequence but never
says which. Working through the fragment list against the curiosity ledger settles it:
the KPI card is `/strategy`'s single reveal, the three initiative rows are
`/execution`'s, the benefit curve is `/benefits`', and the AI suggestion card is
already the home page's AI moment. The stage gate queue item assigned to a named owner
is the only one not already spoken for, and it belongs to Milestone, whose copy is
about a slip surfaced before the date passes. Attaching it anywhere else would hand a
product page's opener away on the home page for free.

It is authored as inline SVG at `surface` on `surface-deep`, one screen region only —
a queue item, an owner name, a due date, a gate number — and it is clipped by the
section's inline-end edge so the next item in the queue is visibly half-present. No
browser chrome, no tilt, no bezel.

Its reveal is motion #3, the mask wipe. Implemented as an SVG `<mask>` whose white
rectangle is moved with `transform: translateX`, not as an animated `clip-path`
percentage, so the rule about transforms and opacity holds. The end state in CSS is
mask fully open; GSAP animates from the closed position.

### The AI moment

Its own section directly after the chain, two columns: prose in the inline-start
column, the suggestion card in the inline-end column.

**The staging is the argument.** The spine does not stop at Benefit. It continues out
of the chain section, crosses into the AI section, arrives at the inline-start edge of
the suggestion card — and stops there, at the card's border, without entering it. The
whole claim of spec §4 is that AI proposes and never writes to the record. A line that
carries the record's continuity right up to the card and then declines to cross into it
says that structurally, before the reader has read "AI proposes. A person decides."
That is the one moment on the page where the visual device carries a legal-flavoured
argument a government buyer actually needs, and it costs one absolutely-positioned
hairline.

**Card composition.** Ground `jade`, hairline border on three edges, a 2px `accent`
rule on the inline-start edge only. The accent is a marker, not a frame — a fully
teal-outlined box reads as a promotional callout, an inline-start accent rule reads as
a system annotation, which is what it is. Head row: the `AI watch` badge in mono at
the inline-start, `confidence 0.77` in mono at the inline-end, both on one baseline,
so the two machine-written values bracket the card and the human-written title sits
below them. Title at `h3` 600. Detail at `body` 300. Three buttons: Accept as accent
outline, Modify and Reject as hairline outline — matching the real UI, where Accept is
outlined rather than filled. A filled Accept would imply a default action the product
does not have, and the fidelity rule in §5 is not negotiable. Log line last, in mono at
`muted`.

**Motion #4.** The card enters on a 16px `translateY`, then a confidence bar fills.
The bar is a 1px hairline track under the head row with an `accent` segment scaled by
`transform: scaleX(0 → 0.77)`, `transform-origin` at the inline-start so it mirrors
under RTL without a second rule. Once per page. (Fidelity caveat raised in section 4:
the real panel shows confidence as text, not a bar.)

Buttons are real `<button>` elements with visible focus rings and no click handlers.
They are inert on purpose. Wiring them would be a fake product demo, which is exactly
what the curiosity ledger is trying to prevent.

### The closing CTA — the dimmed Command Centre

The last section and the only element on the site that breaks the 1180px column. It is
full-bleed.

**Why full-bleed.** Every other section is disciplined into one column with hairline
separators. The one moment the page is allowed to imply scale is the one moment it
should physically exceed the column. It also solves the crop for free: a composition
wider than the viewport is clipped by the viewport, which is exactly the "clipped by
the section edge" §5 asks for, with no mask needed at the horizontal edges.

**Treatment, and a correction to the literal reading of §5.** §5 says "dimmed to
roughly 25% against the ground". Applying 25% opacity to the prototype's composition
does not produce the intended result: the near-black card fills disappear into `ink`
while the accent, amber and red dots survive as bright specks, so the reader still gets
the RAG status of five named initiatives — which is data, from the one composition that
is supposed to be unreadable as data.

The composition is therefore authored **single-hue**: every fill and stroke resolves to
`jade-lift` or `hairline`, with no `accent`, no `amber`, no `red` anywhere in it. Then
`opacity: dim` (0.25) is applied to the whole group. This is what actually delivers
§5's "legible as a shape, unreadable as data", and it protects §3's rule that amber and
red are status and never decoration — a dimmed red dot is still telling you something.
A linear mask fades the composition's block edges into `ink`, which §5 explicitly
sanctions ("a mask that fades to the page ground").

**Geometry.** Rebuilt from the prototype's proportions, not its pixels: 44px top bar,
176px sidebar with the four phase groups, three metric cards across the top, an
initiative table and an AI panel side by side, a benefit strip across the bottom. The
overall frame widens from the prototype's 900 × 520 to a wider aspect so it reads as
"a wide board" at full bleed. A deliberate empty horizontal band is authored into the
composition where the table and the benefit strip currently meet, and the CTA sits in
that band. Designing the hole rather than fighting the background is the only way to
get AA contrast on text over a composition without adding a scrim, and a scrim would be
a card by another name.

**Contents of the CTA block.** The `The Command Centre` eyebrow, the heading `One
screen the office runs the week on.`, the sub from content brief §4, the primary CTA,
and §5's line `The whole board, in forty minutes.` set in mono at `muted` directly
beneath the composition as its caption.

**No motion in this section.** §7's inventory has six items and none of them is
"background composition animates". The last thing the page does before asking for the
demo request should be to stop moving. The section reveal (motion #2) applies to the
CTA text block and nothing else.

**Accessibility.** The composition is `aria-hidden`, not `role="img"`. §9's rule that
every fragment carries a real `aria-label` collides here with the curiosity ledger: an
`aria-label` that honestly described this composition would read the whole Command
Centre layout aloud to a screen reader user, handing away the one thing the home page
withholds. It is decorative by intent — it is dimmed specifically so it cannot be read
— so hiding it is both correct and the only consistent answer. The four fragments that
carry real information all keep `role="img"` and a full bilingual label. Raised in
section 4.

### What runs through the whole page

- **Section reveal (motion #2)** on every section: opacity 0 → 1 with a 24px upward
  translate, 800ms on the site ease, fired once at 15% visibility. One shared
  `Reveal.astro`. Vertical, so it does not mirror under RTL.
- **Header (motion #6)**: hairline border after 12px. No shrink, no hide, no blur
  change.
- **Reduced motion is a branch, not a suppression.** `gsap.matchMedia()` guards every
  timeline. Under `prefers-reduced-motion: reduce` no ScrollTrigger and no timeline is
  created at all: the spine renders filled, all five nodes accent, all copy at full
  opacity, the fragment mask open, the confidence bar at 0.77, the counter at its final
  value. All of those are the CSS default; GSAP only ever runs `gsap.from()`. A page
  with broken JavaScript and a page with reduced motion look identical, and both are
  correct.
- **No progress bar across the top of the viewport.** The prototype had one. It is not
  in §7's inventory, and the spine already tells the reader where they are.

---

## 4. Ambiguities and contradictions

Twenty-two items. The first six are structural — they change what gets built, not how
it looks — and per BUILD_FLAGS they are the ones worth a decision before P1 rather than
after.

### Structural

**1. The content brief's Command Centre section is the thing the spec forbids.**
Content brief §4 specifies a Command Centre on the home page in full: top bar, sidebar
with four phase groups, three metric cards, a five-row initiative table, an AI panel,
a benefit strip, and four numbered callouts staggered in on scroll. Spec §5 says "no
full product screen appears anywhere on the site. Not on the home page", and
`trumandate-product-pages.md` curiosity ledger says the home page withholds "what the
Command Centre actually looks like". These cannot both be built. My plan resolves it by
treating content brief §4 as the _source for the dimmed closing composition only_ — its
heading, sub and eyebrow become the closing CTA's copy, its layout becomes the
single-hue dimmed composition — and dropping the four callouts entirely. Confirm that
is the intended reading, because the alternative reading is that §4 is a full section
the spec forgot to reconcile.

**2. The home page carries three product surfaces, not two.** Spec §5: "The home page
carries at most two: one inside the chain sequence and the dimmed Command Centre in the
closing CTA." But content brief §1 mandates a hero data panel — an objective record,
four labelled rows, RAG dots, a sparkline. Under §5's own definition ("a KPI card is
one region") that is a screen region, which makes three. I resolve it by rendering the
hero panel as page typography on hairline rules rather than as product chrome, so it
does not read as a crop, but the count is genuinely contested and the resolution is a
judgement call.

**3. The header nav does not map onto the routes.** Content brief "Global" gives four
nav items: Traceability, Platform, AI, Contact. Spec §6 gives five routes: `/`,
`/strategy`, `/execution`, `/benefits`, `/contact`. Nothing named "Platform" or "AI"
exists as a route, and none of the three product pages appears in the nav. Worse, spec
§1 states "There is no single 'AI' page", while the nav has an item called AI. The
brief's nav is inherited from the one-page prototype, where all four were anchors. This
needs a decision: either the nav becomes Strategy / Execution / Benefits / Contact and
the brief's nav labels are discarded, or the nav stays and the product pages are
unreachable from the header.

**4. The module list is the feature catalogue the strategy documents ban.** Content
brief §6 lists eleven modules in four groups, verbatim, for the home page.
`trumandate-product-pages.md` says "Nineteen modules listed on a website is a
procurement document. A buyer who can enumerate the feature set has no reason to attend
a demo", and CLAUDE.md says the site "is not a feature catalogue". Meanwhile BUILD_FLAGS
says home-page English copy comes verbatim from the content brief and "Do not rewrite
it". Three documents, two of which forbid the section and one of which mandates it
untouched. Spec §6's page map for `/` does not list a modules section at all.

**5. Spec §6's home page map omits three sections the other documents require.** §6
lists: hero, three failure modes, the chain, one AI moment, the dimmed Command Centre
CTA. Missing: the Fit-and-modules section (content brief §6), the contact form section
(content brief §7), and the deployment-and-data-sovereignty band that
`trumandate-product-pages.md` says "appears once on the home page and once on
`/contact`". Whether the home page ends at the CTA or carries a form is unresolved —
§6 gives `/contact` its own route, and the prototype had the form inline on the home
page.

**6. Where does BUILD_FLAGS sit in the authority order?** CLAUDE.md ranks four
authorities: code, spec, product-pages, content-brief. BUILD_FLAGS is not in the list,
yet its "Copy authority" clause is what makes items 1, 4 and 5 unresolvable — it
promotes the content brief to untouchable for home-page copy, which inverts the
authority order exactly where the conflicts are.

### Motion and the transforms-only rule

**7. Three of the six mandated motions are not transforms or opacity.** CLAUDE.md:
"Transforms and opacity only. Never animate layout properties." Against that:
§7 item 1 is a rail that "draws downward" (a height or `stroke-dashoffset` animation as
normally written); §7 item 3 is a "clip-path wipe"; §7 item 4 is a confidence bar that
"fills"; and content brief §1 specifies a sparkline "drawn on scroll". None of those is
a transform as literally described. My plan re-expresses all four as transforms — rail
as `scaleY`, wipe as a translated SVG mask rectangle, bar as `scaleX` — but the
sparkline draw has no transform equivalent and I propose dropping it to a fade, which
changes what the content brief asked for.

**8. The counter animates neither transform nor opacity.** §7 item 5 mandates one
count-up per page. A count-up mutates text content. It does not trigger layout if the
digit count is stable and the number is tabular-figure, but it is not covered by
"transforms and opacity only" on any reading. Assume it is an intended exception.

**9. §7 item 5 does not say which number.** "One number per page counts up on first
view." The home page has at least four candidates (AED 41M, 68 / 75, 14, 72%). I chose
AED 41M and argued it in section 3, but the choice is mine, not the spec's.

**10. §7's inventory does not contain the callout stagger the content brief mandates.**
§7 says "Complete list. Anything not here does not get built." Content brief §4 requires
"Four callouts, numbered 1 to 4, staggered in on scroll". Moot if item 1 above resolves
against the callouts, live if it does not.

**11. The site ease is never named.** §7 gives durations (0.8s, 0.9s, 0.6s) and says
"custom ease" without a curve. I have taken the prototype's
`cubic-bezier(.22,.61,.36,1)` as the site ease and tokenised it. Nothing authoritative
backs that value.

**12. Vertical rhythm and gutter values are never given.** §3 says one wrapper "owns
max width (1180px) and vertical rhythm" and gives the width but not the rhythm. I have
taken `clamp(4.5rem, 11vh, 8.25rem)` and `clamp(1.25rem, 5vw, 4.5rem)` from the
prototype. Same situation: plausible, not authoritative. §3 also never specifies border
radii, and the fragments need one to be faithful to the real UI.

**13. "One pinned section per route" versus a pinned section on a 375px screen.** The
cap is a maximum and the spec is silent on mobile. I drop the pin below `lg` entirely.
Worth confirming, because §7 says "Budget the ambition here" and dropping the pin on
the viewport most readers will use is a real reduction in ambition.

### Type, fonts and language

**14. Three type roles leave nothing for buttons, form labels and UI text.** §3 names
exactly three roles: 600 display, 300 body, mono 500 data. A button set at 300 is
weak and a fourth weight file costs roughly 18 KB per script subset. I have put buttons
at 600, reusing the display weight for zero extra payload, per BUILD_FLAGS' "fewer
kilobytes" tiebreak. This is a decision the spec did not authorise.

**15. The numeral rule contradicts the Arabic copy it points at.** §8: "Western digits
in both languages for KPI values and dates … Arabic-Indic digits only where the content
brief already uses them." The content brief's Arabic uses Arabic-Indic digits in
precisely the places the first clause reserves for Western: `الهدف ١.٢`,
`درجة الثقة ٠٫٧٧`, `تأخير متوقَّع في المعلم: ١٢ يوماً`, `٠٩:٤٢`. The exception cancels
the rule. The Arabic copy is also internally inconsistent — chain link 5 reads
`تُقاس 24 شهراً` in Western digits while the AI card reads `١٢ يوماً` in Arabic-Indic
for the same kind of quantity.

**16. `/ar` still needs the Latin faces.** §2 says self-hosted subset woff2 and §8 keeps
"TruMandate" in Latin script and Western digits for KPI values. So the Arabic tree
loads four font files (Arabic 300/600 plus Latin 300/600), not two, and the Latin
subset must include digits and the product name. §3's mono role is Latin-only and swaps
to Plex Sans 600 in Arabic, which means `/ar` should not load Plex Mono at all. None of
this is stated; it is inferred.

**17. The secondary CTA has no target off the home page.** "See the chain" anchors to
the chain section on `/`. On `/strategy`, `/execution` and `/benefits` there is no chain
section. Unspecified whether the secondary CTA appears on those routes at all.

### Accessibility

**18. RAG status is conveyed by colour alone.** WCAG 1.4.1 and spec §9's "accessibility
100" target are both in play. A 4px green, amber or red dot carries the entire status.
§3 is emphatic that amber and red appear only as status, which makes them load-bearing
information rather than decoration, which makes 1.4.1 apply. Nothing in the spec says
how status reaches a reader who cannot distinguish them. My plan adds a visually-hidden
status word to every DOM dot and puts the status into the fragment `aria-label`s, but
this is a gap the spec should close rather than a gap I should close silently.

**19. `role="img"` on fragments collides with the curiosity ledger, and with §5A's own
justification.** §9 requires every SVG fragment to have `role="img"` and a real
`aria-label`. `role="img"` makes the SVG one opaque node, so its internal `<text>`
disappears from the accessibility tree and the label has to carry the whole content —
which for the dimmed Command Centre would read the withheld composition aloud. §5A
separately justifies SVG partly because "SVG text swaps with the language toggle",
which `role="img"` makes moot for assistive technology. I have made the dimmed
composition `aria-hidden` and kept `role="img"` on the four informational fragments.

**20. `accent` on `jade` measures 4.6:1 and `muted` on `jade` measures 4.8:1.** Both
pass AA for normal text with no margin. §9 asks for "contrast checked against the actual
token pairs" but does not say which pairs are legal, and the eyebrow role is
`accent` at 0.70rem, which is the tightest combination on the site. Any future
adjustment to `jade` or `accent` breaks it.

**21. The dimmed composition has no scrim rule.** §5 requires the CTA to sit on top of
a composition at "roughly 25%", with no guidance on how the text underneath stays
readable. "Roughly 25%" is also not a token and is ambiguous between an opacity on the
SVG group and a colour-mix toward `ink`; the two give different results because the
composition's own fills are already near-black. I have taken it as group opacity, made
the composition single-hue so no RAG colour survives the dimming, and authored an empty
band into the geometry for the CTA to sit in.

### What `docs/trumandate-home.html` leaves unresolved about the Command Centre

**22.** The prototype gives usable proportions and nothing else. Its geometry is
900 × 520: a 44px top bar, a 176px sidebar, three metric cards at y=68 h=96 with widths
210 / 210 / 228 and 16px gaps, an initiative table at x=200 y=184 w=436 h=230, an AI
panel at x=652 y=184 w=228 h=230, and a benefit strip at x=200 y=434 w=680 h=62. What
it does not settle:

- **No RTL variant exists.** The sidebar is hard-coded at x=0 and every `<text>` has an
  absolute x. The prototype's language toggle swaps DOM text and never touches the SVG,
  so the Arabic Command Centre is entirely unspecified. Mirroring is not a transform on
  the group — text would render backwards — so every x needs a mirrored value or the
  composition needs authoring twice.
- **Arabic text will overflow.** Arabic strings run 15–30% longer than their English
  equivalents and the AI panel is 228px wide with the sidebar at 176px. `Legacy
decommission · 12 days` at font-size 9 already fills its panel; the Arabic equivalent
  does not fit. No solution is given, and SVG text does not wrap.
- **§5's fragment spec and the content brief disagree on the initiative table.** §5
  describes "three initiative rows … cropped mid-list"; the content brief and the
  prototype both give five named rows. Which count belongs in the dimmed composition is
  unstated.
- **The width is wrong for the closing CTA.** §5 calls for a "wide" composition and the
  layout column is 1180px, but the prototype is 900px at a 1.73:1 aspect. A full-bleed
  treatment needs a wider native aspect, so the geometry has to be re-proportioned
  rather than scaled.
- **The numbered callout circles are baked into the SVG** at fixed coordinates
  (cx 392/618/862/866), so they cannot be staggered independently, cannot mirror, and
  cannot be removed without editing the composition.
- **Eleven of its colours are not tokens**: `#021813`, `#0A3B31`, `#093A2F`, `#083A30`,
  `#22DDB0`, `#8FE9D4`, `#CFE0DA`, `#C6DAD3`, `#B9D2CA`, plus the eight-digit alphas
  `#ffffff14`, `#06302733`, `#19C39B44`, `#ffffff1a`, `#ffffff22`, `#ffffff30`. Section
  2 above absorbs three of these as tokens and eliminates the rest; the point is that
  the prototype cannot be copied under CLAUDE.md's no-hex rule.
- **No TruMandate wordmark asset exists.** §5A's required raster list includes an OG
  image built from "wordmark and chain motif on jade" and a favicon set, but never
  specifies the wordmark itself. The prototype renders it as live text with the second
  half in accent. Whether that is the wordmark, or whether a real logo is coming, is
  open — and it blocks the favicon and both OG images at P9.
