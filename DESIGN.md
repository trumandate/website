---
version: alpha
name: TruMandate
description: Bilingual (English/Arabic RTL) static marketing site for a portfolio governance and strategy execution platform. Dark jade ground, one accent, hand-authored SVG product fragments, zero photography.
colors:
  primary: "{colors.accent}"
  ink: "#04241E"
  jade: "#0B4A3D"
  jade-lift: "#0F5C4B"
  surface: "#0A3B31"
  surface-deep: "#021813"
  phthalo: "#123524"
  phthalo-lift: "#17402C"
  accent: "#19C39B"
  amber: "#F2B441"
  red: "#E0574C"
  paper: "#F1F5F3"
  body: "#C6DAD3"
  muted: "#9CB8AE"
  mint: "#4BEFC4"
  cyan: "#59D8E6"
  gold: "#FFC95C"
  coral: "#FF9A90"
  coral-dark: "#FF7A6E"
  hairline: "rgba(255,255,255,0.10)"
  hairline-08: "rgba(255,255,255,0.08)"
  hairline-soft: "rgba(255,255,255,0.06)"
  highlight: "rgba(255,255,255,0.16)"
  shade: "rgba(2,24,19,0.55)"
  shade-deep: "rgba(2,24,19,0.72)"
  brand-teal: "#0E7E6D"
  brand-green: "#21B586"
  brand-tile: "#F1F4F3"
  form-paper: "#F7F9F8"
  form-field: "#FFFFFF"
  form-ink: "#0B2A22"
  form-body: "#3E5A52"
  form-muted: "#52685F"
  form-line: "#7C9389"
  form-line-strong: "#5F7A6E"
  form-rule: "#DCE6E1"
  form-tint: "#E4F6F0"
  form-alert: "#FCECEA"
  accent-deep: "#0A7A61"
  accent-deeper: "#075C49"
  accent-deep-ring: "rgba(10,122,97,0.16)"
  red-deep: "#B3261E"
typography:
  display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 4.25rem
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: -0.028em
  h2:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 2.75rem
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: -0.015em
  h3:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.65rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  lede:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.2rem
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0em
  body:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0em
  small:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 0.94rem
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0em
  eyebrow:
    fontFamily: IBM Plex Mono
    fontSize: 0.7rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.16em
  datum:
    fontFamily: IBM Plex Mono
    fontSize: 0.72rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.1em
  eyebrow-ar:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 0.8rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0em
  datum-ar:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 0.82rem
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: 0em
  blog-index-heading:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: -0.015em
  blog-featured-title:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.85rem
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: -0.012em
  blog-card-title:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.3rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  blog-title:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 2.75rem
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.018em
  blog-h2:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.7rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  blog-h3:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.28rem
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.005em
  blog-lede:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.35rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0em
  blog-body:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 1.25rem
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: 0em
rounded:
  control: 2px
  card: 4px
  panel: 6px
  field: 8px
  paper: 14px
  full: 9999px
spacing:
  header: 4.5625rem
  rail: 3.375rem
  node-inset: 2.875rem
  node: 0.8125rem
  rag-dot: 0.5625rem
  blog-gap: 4.25rem
  sticky-top: 6.0625rem
components:
  section:
    width: 1180px
    padding: clamp(4.5rem, 11vh, 8.25rem) clamp(1.25rem, 5vw, 4.5rem)
  section-tight:
    width: 1180px
    padding: clamp(3rem, 7vh, 5rem) clamp(1.25rem, 5vw, 4.5rem)
  measure:
    width: 56ch
  measure-tight:
    width: 52ch
  measure-head:
    width: 24ch
  measure-standfirst:
    width: 46ch
  blog-column:
    width: 38rem
  blog-column-wide:
    width: 44rem
  blog-rail:
    width: 16.5rem
  nav-panel:
    width: min(85vw, 22rem)
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    typography: "{typography.small}"
    padding: 0.5rem 1rem
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    typography: "{typography.small}"
    padding: 0.5rem 1rem
  request-card:
    backgroundColor: "{colors.form-paper}"
    textColor: "{colors.form-ink}"
    rounded: "{rounded.paper}"
  request-field:
    backgroundColor: "{colors.form-field}"
    textColor: "{colors.form-ink}"
    rounded: "{rounded.field}"
---

# DESIGN.md — TruMandate

## Overview

TruMandate's marketing site exists to earn a demo request from government and
large-enterprise buyers in the UAE and Saudi Arabia. It is not documentation and
not a feature catalogue.

The design language is a records system, not a brochure: a dark jade ground, one
accent, and product surfaces that read as real instrumentation rather than
illustration. Restraint is the mechanism — status colour means status, one glow
exists per page, one section pins per route — so that when the interface does
raise its voice the reader believes it. Every product surface is hand-authored
inline SVG or DOM built from tokens; the product is never shown whole, only in
fragments cropped at a section edge, because the withheld remainder is what the
demo is for.

English and Arabic are one design, not a translation layer. Both trees are built
together and the Arabic tree never carries less content than the English one.

## Colors

The ground is a family of jade darks, not a neutral grey: `ink` is the page,
`surface-deep` the one darker band a page may use, `jade` and `surface` are
raised, `jade-lift` is hover and the border on a raised surface. `phthalo` is the
brand's deep ground green and is the blog's editorial ground; `phthalo-lift` is
its hover step, so a whole-panel link changes ground without borrowing `jade`,
which reads as a different surface rather than the same one lit.

Text on the dark ground has three roles and only three: `paper` for headings and
primary text, `body` for running paragraphs, `muted` for secondary text and mono
data labels.

`accent` is the single accent — one accent per view. `amber` and `red` are
status, never decoration; they appear only inside data components, and that
restraint is what makes a RAG dot read as information rather than styling.

`mint`, `cyan`, `gold` and `coral` are domain hues: mint is execution, cyan is
strategy, gold is benefits, coral is critical/off-track. They are for AI and
domain accents, chart strokes, figure highlights and gradient pairs. Do not set
body text in them on a jade ground without measuring contrast first. They do not
displace the RAG discipline inside data components.

The `brand-*` trio is the TruMandate mark's own geometry. The mark is a fixed
asset, not a themeable composition: never restyle it to `accent`/`jade`/`paper`,
and never use those three values for anything that is not the mark.

The `form-*` family plus `accent-deep`/`accent-deeper`/`red-deep` is the site's
one light surface — the contact request card, treated as a paper document laid on
the dark ground. It exists because the dark palette inverts badly: the dark text
roles are tuned for a dark ground and vanish on a light one, and `accent` does
not reach a text contrast ratio on paper, so it may be a fill or a graphical
element there but never text. Use `accent-deep` for text, focus and links on this
surface. Nothing on that card is carried by colour alone: every error pairs a
coloured dot with error text, and the chosen option carries a filled mark as well
as a tinted ground.

Contrast is checked against actual token pairs, not assumed. WCAG 2.1 AA is the
floor for text; interface boundaries and focus indicators must clear the
non-text ratio.

## Typography

Two faces. IBM Plex Sans Arabic carries display, headings and body; IBM Plex Mono
carries the data and eyebrow role. There are three type roles on the marketing
pages and no more: display/heading, body, and data/eyebrow.

The data/eyebrow role is uppercase and letterspaced in Latin. In Arabic it swaps
face to Plex Sans at semibold and drops tracking to zero, because letterspaced
mono destroys Arabic joining — that swap is a base rule keyed off `[dir=rtl]`,
not something a component branches on. Arabic also takes its own line-heights
throughout and zeroes the negative display/heading tracking; a component that
sets tracking directly on an element must not defeat that.

Every marketing type token is fluid. The `fontSize` recorded above is the token's
ceiling, reached only on wide viewports; each role clamps down to its own floor on
small ones. The clamp is the token — never restate a size at a call site.

The blog carries a second, deliberately separate scale. A marketing hero's job is
to arrest; a long article's job is to be read for several minutes without
fatigue, which needs a shallower ratio between adjacent steps, a looser leading
and a bounded measure. The `blog-*` tokens are not aliases of the marketing scale
and must not be made into aliases: changing the marketing display clamp must not
resize an article.

Set long-form measure by the column width tokens, not by eye, and re-check
characters per line whenever the article column or its body size moves — the two
are tuned against each other.

## Layout

One component owns horizontal padding and vertical rhythm for every page. No page
sets its own padding, and no page carries a style attribute of its own. Sections
separate with hairline rules, not cards.

Breakpoints are the framework defaults. There are no bespoke breakpoints anywhere
in the codebase; do not add one.

The blog post page's rail-plus-column grid is load-bearing arithmetic, not taste:
rail width plus gap plus article column sum exactly to the inner width of the
site's own content wrapper, so the rail's start edge lands on the header's brand
mark and the column's end edge on the header's call to action. Change any one of
the three and the other two must change with it.

Physical direction properties are forbidden. Logical properties and logical
utilities only — the framework's physical-direction utilities are switched off at
build time so `ml-`, `pr-`, `text-left` cannot be written by accident, and
`text-start`/`text-end`/`text-center` are re-provided by hand. Symmetric values
(centred auto margins, equal inline padding) are direction-safe and are not a
loophole. Where a logical utility does not exist, the physical value goes inside a
scoped style block with an explicit `[dir=rtl]` override, never into markup.

Horizontal motion and horizontal composition mirror under RTL; vertical motion
does not. Numerals are Western digits in both languages for KPI values and dates,
because government reporting uses them; Arabic-Indic digits appear only where the
content brief already uses them. The product name stays "TruMandate" in Latin
script in both languages, and the language toggle names the target language in its
own script.

Stacking order is a fixed scale: skip link above the nav drawer, nav drawer above
the scroll progress indicator, progress above the fixed header. Do not introduce a
z-index outside it.

## Elevation & Depth

On the dark ground a black drop shadow is invisible, so a raised surface is
declared by an inset top-edge highlight plus two soft ambient layers — the
highlight is what actually reads as raised. There are four tiers and they are
cumulative: flat, hairline-bounded, raised, and one focal tier reserved for the AI
card. One glow per page. SVG fragments never take a box-shadow or a filter.

The light request card is the inverse case and takes a real two-layer cast
shadow, because on the dark ground a cast shadow reads immediately and an inset
white highlight on white does not. Its inputs take a shallow inset shade so a
field reads as a well cut into the paper rather than an outlined box. Its focus
treatment is an outline plus a soft halo — the outline is what carries the
indicator contrast; the halo only softens it.

Section seams are a blend band, never a one-pixel cut, and the direction of the
seam encodes the argument. The drafting-grid ground texture is the home hero and
the closing call to action only; repeating it elsewhere spends the one aesthetic
risk the design allows itself.

`hairline` is a content-level boundary. `hairline-soft` is chrome and decoration
only and must never be a control's only boundary.

## Shapes

Corner radius is small and functional, and it encodes what a thing is: controls
and badges take the tightest radius, product-fragment interiors take the radius
the real product UI uses, board panels and KPI tiles take the next step. The light
request card and its controls are the one concentric pair — the card's outer
corner is larger than the corner of every control inside it, and the card has
exactly one control shape.

## Components

The section wrapper is the only component that sets inline padding or vertical
rhythm. Full-bleed content drops the inline max-width and padding but keeps the
rhythm; a section may opt out of the rhythm entirely only when it supplies its own.

Buttons come in two variants and no more: a filled accent primary and an outlined
ghost. The filled primary inverts on hover to transparent ground with accent text
and an accent outline. A global link hover colour must never reach a filled
button.

The contact request card is the only light surface on the site and the only place
the `form-*` tokens are valid.

## Motion

Motion is an inventory, not a style. Anything not on the inventory does not get
built: the pinned record chain, the section reveal, the fragment mask wipe, the AI
card arrival with its confidence bar, one counter, and the header's scrolled
state. At most one pinned section and one scrubbed timeline per route.

Reduced motion is a real branch, not a stub. Under `prefers-reduced-motion:
reduce` no timeline is created and every element renders in its end state. The end
state lives in CSS and the animation library animates *from* an offset, so a
JavaScript failure degrades to a correct page rather than an invisible one. This
is tested, not assumed.

Transforms and opacity only. Never animate a layout property. Easing has two
tiers: a standard curve for entrances and scrubbed motion, and a micro curve for
hover, focus and other short state changes whose output never overshoots — the
design has no bounce. A third, ease-in-only curve exists for dismissal. Every
duration, delay, offset and easing curve is a named token; a bare numeric duration
in a script or a style block is a defect.

Staggered groups use one stagger step or a stated multiple of it, and groups
longer than eight children halve it.

## Do's and Don'ts

**Do**

- Keep every colour, duration, ease and measurement in the token file. It is the
  only file containing a hex value.
- Anonymise the data in a product fragment; never anonymise the interface. A
  fragment that is not faithful to the real product is worse than no fragment.
- Write numbers rather than adjectives, in the register of a competent
  practitioner explaining something to a peer.

**Don't**

- No photography anywhere: no stock, no generated imagery, no national imagery.
- Never show a full product screen. Fragments only, one per product page, cropped
  at the section edge.
- No gradient meshes, glassmorphism, glow blobs, drop shadows on text,
  three-column icon-on-top card grids, tilted 3D screenshots, logo walls, emoji
  icons, or stock illustration.
- No parallax on images, cursor followers, magnetic buttons, marquees,
  autoplaying carousels, scroll-jacking that overrides native scroll distance, or
  text that re-animates on every scroll pass.
- Never invent a statistic, a customer count, a return-on-investment figure, or a
  testimonial.
- Never use `amber` or `red` as decoration.
