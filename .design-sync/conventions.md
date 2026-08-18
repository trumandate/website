## TruMandate — conventions for composing with this bundle

This is a static Astro marketing site, not a React component library — there is
no runtime bundle here (`_ds_bundle.js` is deliberately omitted) and no
provider to wrap anything in. A page is plain HTML: `<html lang dir>`, a
`<body class="bg-ink">`, and Tailwind utility classes straight on the markup.
Compose layouts by writing HTML/Astro-shaped markup with the classes below —
there is nothing to import.

**Wrapping and setup.** Every page sits on the `ink` ground (`bg-ink` on
`<body>`) — there is no light theme. Bilinguality is driven entirely by two
attributes on `<html>`: `lang="en" dir="ltr"` or `lang="ar" dir="rtl"`.
Compiled rules key off `[dir="rtl"]` to swap line-height, zero out
letter-spacing, and — for the mono/data type role — swap the font family to
Plex Sans Arabic 600 (letterspaced mono breaks Arabic joining). Type is IBM
Plex, self-hosted: five subset `.woff2` files via `fonts/fonts.css`,
`font-display: swap`. No locale loads all five — Arabic never fetches Plex
Mono at all.

**The styling idiom.** Tailwind utility classes, generated from this repo's
own `tailwind.config.mjs` (the single source of colour/spacing/motion truth —
literally the only file allowed to contain a hex value). A compact map of real
class families, each grep-checked against `_ds_bundle.css` before this file
shipped:

| Family | Examples | Notes |
|---|---|---|
| Colour | `bg-ink`, `bg-jade`, `bg-accent`, `bg-surface`, `bg-surface-deep`, `text-paper`, `text-muted`, `text-body`, `fill-accent`, `fill-muted`, `fill-amber`, `fill-red`, `fill-highlight`, `stroke-hairline` | `fill-*`/`stroke-*` are for the SVG fragments; everything else is DOM |
| Type role | `text-display`, `text-h2`, `text-h3`, `text-lede`, `text-eyebrow`, `text-datum`, `font-sans`, `font-mono`, `font-semi`, `font-light`, `font-data` | three roles only: display/heading (semi), body/lede (light), data/eyebrow (mono, data) |
| Tracking | `tracking-eyebrow`, `tracking-datum`, `tracking-brand`, `tracking-display`, `lg:tracking-display-lg` | negative or zero everywhere except the two mono/data roles |
| Spacing/layout | `py-section`, `px-gutter`, `max-w-content`, `max-w-measure`, `rounded-control` | `Section.astro` alone sets rhythm/padding — no page carries its own |
| Shadow / glow | `shadow-raised` (tier-3 cards), `shadow-focal` (tier-4 — the AI card ONLY), `bg-grid-draft` (hero + closing CTA only), `bg-spotlight-accent` (the one glow), `bg-seam-down`/`up`, `bg-vignette-ink`, `bg-ground-board` | SVG fragments never get a shadow/filter — see `guidelines/elevation.card.html` |
| Motion | `reveal`, `duration-micro`/`ease-micro`, `motion-safe:hover:-translate-y-px` | reduced motion is real: `.reveal`'s end state ships unconditionally in CSS |
| Accessibility | `visually-hidden`, `size-rag-dot` | announced text for colour-coded status (WCAG 1.4.1) |
| **Logical only** | `ps-2`, `ps-rail`, `ms-*`, `me-2`, `text-start`, `text-end`, `border-s-marker` | **zero exceptions, grep-checked**: no `ml-`/`mr-`/`pl-`/`pr-`/`text-left`/`text-right` anywhere. Tailwind's `textAlign` core plugin is OFF in config specifically to block those two by accident. Always write the logical form. |

**Where the truth lives.** `styles.css` is the single entry point — its
`@import` closure (`tokens/*.css` → `fonts/fonts.css` → `_ds_bundle.css`) is
the ONLY CSS a design built with this bundle receives; nothing outside that
closure exists to it. `_ds_bundle.css` is the real, compiled output of this
repo's own Tailwind CLI run against `tailwind.config.mjs` and a full
`src/**/*.{astro,ts}` content scan — not a hand-picked subset. Per-component
custom CSS (scoped `<style>` blocks Astro compiles per file — SVG fragment
type sizing, RTL direction pins, the header's scroll-shadow transition) is
**not** part of that Tailwind output; it's copied verbatim into each card's own
`<style>` tag, and documented again in that component's `.prompt.md` — the
authoritative source for its props API, exact classes, and bilingual/RTL
behaviour. Read it before composing with an unfamiliar component.

**One idiomatic snippet** (adapted from the real `Section` + `Heading` + `Lede`
+ `Button` composition used across every product page):

```astro
<Section ground="deep" seam="down">
  <Eyebrow>The problem</Eyebrow>
  <Heading as="h2">Strategy is written once. Then it disappears.</Heading>
  <Lede>TruMandate holds strategy, KPIs, initiatives and benefits in one record.</Lede>
  <Button href="/en/contact">Request a walkthrough</Button>
</Section>
```

On an Arabic route the same markup gets `dir="rtl" lang="ar"` on `<html>` and
translated copy — nothing else changes; every class above already resolves
correctly in both directions.
