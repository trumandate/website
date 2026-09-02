# Motion audit — TruMandate marketing site

- **Commit**: `9fab49e`
- **Date**: 2026-09-02
- **Scope**: every animated surface on `/en/*` and `/ar/*` — `src/scripts/*.ts`,
  `src/styles/global.css`, every component `<style>` block, and the motion tokens in
  `tailwind.config.mjs`.
- **Method**: full source read, then live observation on `https://www.trumandate.com`
  with the Playwright MCP (computed-style extraction at 1440×900 and 375×812/375×640,
  EN and AR; drawer open/close; record-chain scrub across the full 3420px pin range;
  empty contact-form submit; `PerformanceObserver('layout-shift')`).
- **Read-only.** No product source was modified. This file is the only artefact.
- **Bar applied**: Emil Kowalski's decision sequence (frequency → purpose → tool →
  properties → easing/duration → interruption → exit → reduced motion) plus the
  transitions.dev motion-token usage rules (open/close asymmetry, hover in/out,
  stagger totals, intent delay).

---

## 0. The curve finding that shapes every recommendation

The repo already owns the correct curve. It just points most of its UI at the wrong one.

| Repo token | Value | Emil's recommendation | transitions.dev token |
| --- | --- | --- | --- |
| `ease-micro` | `cubic-bezier(0.22, 1, 0.36, 1)` | strong ease-out for UI (`0.23, 1, 0.32, 1`) — same curve family, indistinguishable | **byte-identical to `--ease-smooth-out`**, the documented default for open/close/slide/resize/position |
| `ease-standard` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | a *weak* ease-out. Correct for long content reveals; under-powered for interaction | no matching usage |
| `ease-exit` | `cubic-bezier(0.32, 0, 0.67, 0)` | this is `easeInCubic` — a **pure ease-in** (`y1 = y2 = 0`). "`ease-in` on UI is always a finding" | no matching usage; "never bounce or ease-in a close" |

So: **no new curve is needed, and no second scale is added.** The whole easing story is
"widen `ease-micro`'s remit from *hover only* to *all interaction and surface motion*,
keep `ease-standard` for ≥400ms content reveals, and stop using `ease-exit` at all."
Asymmetry between an open and a close is expressed through **duration**, not through a
different curve — which is what both skills prescribe and what avoids inventing tokens.

Existing duration tokens map onto transitions.dev usage cleanly:

| Repo token | Value | transitions.dev equivalent | Use for |
| --- | --- | --- | --- |
| `duration-micro` | 150ms | `--duration-quick` (150ms) | hover, focus, press, text/colour swap, close |
| `duration-state` | 200ms | between `quick` and `fast` | short state changes, drawer **close** |
| `duration-header` | 300ms | between `fast` and `medium` | chrome, drawer **open** |
| `duration-tm-rise` … `tm-grow` | 850–1200ms | "marketing / explanatory" | scroll reveals (out of scope — see §3) |

---

## 1. Prioritized audit

Ordered by leverage (impact ÷ effort). "Before" values are all confirmed from computed
style on the live site, not inferred from source.

| Surface | Before | After | Why |
| --- | --- | --- | --- |
| **M1 · Every `hover:` utility, site-wide** (38 in source; `tailwind.config.mjs` has no `future` block, and the live stylesheet contains **0** `(hover: hover)` media queries out of 477 rules) | `hover:` compiles to a bare `:hover`. On touch, tapping "Book a demo" fires `motion-safe:hover:-translate-y-px` and the button stays lifted 1px until the next tap elsewhere; the AI-queue buttons stay filled `bg-accent` | add `future: { hoverOnlyWhenSupported: true }` to `tailwind.config.mjs` → every `hover:` becomes `@media (hover: hover) and (pointer: fine)` | AUDIT §6 verbatim: "touch fires false hovers on tap". Every phone visitor gets stuck hover states on a page whose only job is a demo request. One line, zero risk to keyboard focus (`focus-visible` is a separate variant) |
| **M2 · Contact form status region entrance** (`ContactForm.astro:131`, `contactForm.ts:176`) | `opacity 200ms cubic-bezier(0.32, 0, 0.67, 0)` — `ease-exit`, a pure ease-in, driving an **entrance** (`opacity 0 → 1` in `showStatus`) | `motion-safe:duration-state motion-safe:ease-micro`, plus a 4px rise: `motion-safe:transition-[opacity,transform]` from `translateY(4px)` | An `ease-in` entrance is invisible for the first ~120ms of its 200ms, so the error summary a reader is actively waiting for appears late and then snaps. The token's own comment reads "ease-IN only (y2=0): **dismiss/hide**" — it is doing the exact opposite. This is also `ease-exit`'s **only** use in the codebase |
| **M3 · 19 hover targets across 9 files** (nav links, lang toggle, hamburger, footer links, blog cards/TOC/tags, AI-queue buttons, drawer links) | `transition-colors duration-state ease-standard` = **200ms** + the weak curve | `transition-colors duration-micro ease-micro` = 150ms + the strong curve | Emil's hover ceiling is 100–160ms; 200ms on a nav link hit dozens of times a session reads as lag. `Button.astro:57` already does it correctly (`duration-micro ease-micro`) and `DESIGN-ELEVATION §3.8` already declares the `micro` tier is "hover/focus/short states ≤300ms" — the majority of hover targets simply never adopted the tier the design system defined for them |
| **M4 · Nav drawer open/close** (`NavDrawer.astro:141–155`) | panel `transform 300ms ease-standard`, backdrop `opacity 300ms ease-standard` — **identical both directions** | open 300ms (`duration-header`), close 200ms (`duration-state`), `ease-micro` both ways | transitions.dev: "opening is an invitation; closing should get out of the way." A 300ms dismissal on a 319px-wide panel makes every close feel like the site is arguing. Also the panel/backdrop are surface motion, i.e. exactly what `--ease-smooth-out`/`ease-micro` is for |
| **M5 · Record-chain `will-change`** (`RecordChain.astro:214` inline; `recordChain.ts:95`) | `will-change: transform` on the track (which **never** transforms — only the cards do) plus `will-change: transform, opacity` on 5 cards, set once in `armRing()` and **never cleared** | drop it from the track entirely; on the cards, set it when the pin range is entered and reset to `auto` when it is left | 6 layers permanently promoted for the life of the page, each up to 340×430px, still held after the chain has scrolled far off screen. The track's promotion buys nothing at all — it is pure GPU memory |
| **M6 · Record-chain scroll handler** (`recordChain.ts:100–155`) | `onScroll` runs synchronously per scroll event: `getBoundingClientRect()` (layout read) then 15 inline-style writes; `card.style.zIndex` is reassigned every event even when the value is unchanged | coalesce into one `requestAnimationFrame` per frame with a `ticking` flag; guard the `zIndex` write behind a value comparison | Read-then-write inside a scroll listener forces a style/layout recalc each time the next event reads. `z-index` is a paint-order property, not a compositor one, so rewriting it 5× per event invalidates stacking. This is the site's signature interaction across 3420px of scroll — it is the one place per-frame cost is worth removing |
| **M7 · Proof-band count-up** (`redesignReveal.ts:24–39`, `ProofBand.astro:59–110`) | `el.textContent` rewritten ~78× over 1300ms on an `inline` span inside a `text-align: center` `<p>`, with `font-variant-numeric: normal` (measured). "0" → "58" → "142" grows from 1 to 3 glyphs, so the figure jitters horizontally the whole time; `AED 0M` → `AED 218M` drags the whole line | before counting, freeze the element's final width (`display: inline-block` + `min-inline-size` from the server-rendered text) and add `tabular-nums` | A number that wobbles while it counts is the single most visible motion defect on the page. Freezing width is 3 lines and removes the reflow entirely. (`tabular-nums` is a no-op in Plex Mono but load-bearing in Arabic, where `global.css:127` swaps `.font-mono` to Plex Sans) |
| **M8 · Live-status dot pulses** (`global.css:316–344`; 3 instances in the hero board + 1 toggled on the chain dot) | `@keyframes tm-pulse` / `tm-pulse-r` animate **`box-shadow`** spread `0 → 7px`, `infinite`, forever, regardless of viewport visibility | a `::after` ring animated with `transform: scale()` + `opacity` | Two problems in one: (a) `box-shadow` is a paint property animated on the main thread 60fps in perpetuity, so the page never goes idle; (b) it contradicts CLAUDE.md's "**Transforms and opacity only**" — the current code is the invariant breach, and this fix is what brings it into compliance. **Changes the pulse's look** (see the plan's feel check) |
| **M9 · Press feedback on touch** (`Button.astro:57`, `AiQueue.astro:174–188`, `AiMomentCard.astro:136–148`) | the only press response is `motion-safe:active:translate-y-0`, which merely *cancels* the hover lift — so with M1 landed there is no touch press feedback at all | add `motion-safe:active:scale-press` with a new `scale: { press: "0.98" }` token | AUDIT §3: pressable elements need `scale(0.95–0.98)` at 150–160ms. `active:` is not hover-gated, so this is the feedback that replaces the accidental sticky hover M1 removes. **Sequence M9 after M1** |
| **M10 · Header scrolled state** (`header.ts:19–24`) | unthrottled `scroll` listener calling `classList.toggle` on every event; a single 12px threshold with no hysteresis | rAF-coalesce, and split the threshold: add above 12px, remove below 8px | Scroll is a 100+/day action. The toggle itself is cheap, but a single threshold means a trackpad hovering at exactly 12px can re-fire the 300ms shadow/hairline transition repeatedly. Hysteresis costs one constant |
| **M11 · Scroll-reveal trigger point** (`redesignReveal.ts:57`) | `{ threshold: 0.18 }` with no `rootMargin`. Any `.tm-rise`/`.tm-fade`/`.tm-grow` block taller than ~5.5× the viewport can never reach 18% and would stay at `opacity: 0` forever | `{ threshold: 0, rootMargin: "0px 0px -15% 0px" }` | Same trigger line as `reveal.ts`'s ScrollTrigger `start: "top 85%"`, so the site's two reveal mechanisms finally fire at one point instead of two, and the tall-element failure mode disappears. **No element trips it today** — measured tallest is 677px on a 640px viewport (ratio 0.95) — so this is robustness, not a live bug |
| **M12 · Dead motion tokens** (`tailwind.config.mjs:461–510`) | `duration.card/bar/wipe/counter/line/glow/copy`, `transitionDelay.stagger` and all three `translate.*` tokens have **zero** references in `src/` (grepped). Meanwhile `reveal.ts:14,15,55,69,70` and `redesignReveal.ts:22` hardcode `y: 24`, `duration: 0.8`, `stagger: 0.06`, `y: 12`, `duration: 0.5`, `1300` with comments *claiming* they are those tokens | either import the numbers from the config in the GSAP scripts, or delete the orphans and move the comment to where the number actually lives | The config's opening line is "THE ONLY FILE CONTAINING A HEX VALUE… every duration, ease and measurement used anywhere in this codebase is a token defined here." Ten motion tokens now describe motions the redesign deleted, while the surviving values are bare numbers. Not a feel defect — a truth defect in the single source |
| **M13 · `.tm-grow` delay default** (`global.css:304`) | `var(--d, 100ms)` — a 100ms default delay, where every sibling class uses `var(--d, 0ms)` | `var(--d, 0ms)` | An un-declared default delay is invisible in the markup: a `.tm-grow` with no `--d` waits 100ms for no stated reason while a `.tm-rise` beside it starts immediately. transitions.dev: "if motion feels late, trim the duration, don't add delay" |

**Counts** — HIGH 3 (M1–M3) · MEDIUM 6 (M4–M9) · LOW 4 (M10–M13).

### Missed opportunities (additive, not corrective)

| # | Surface | Proposal |
| --- | --- | --- |
| **O1** | **Blog TOC has no active-section state.** 9 sticky rail links (`BlogPostArticle.astro:302–310`); `aria-current` never set, no `.active` class, verified on the live post. A reader 60% down a 9-heading article has no idea where they are | IntersectionObserver scroll-spy setting `aria-current="location"`; style it as `text-paper` + a 1px `scaleX` marker on the existing `border-s` rail, transitioning `transform 150ms ease-micro`. Also fixes an orientation gap, not only a motion gap. transitions.dev recipe: **sliding tabs** (adapted to a vertical rail) |
| **O2** | **Contact form error/success have no attention cue.** Field borders flip to `red-deep` in 150ms and the error text appears instantly; the status region only fades. Verified by submitting empty | transitions.dev **error state shake** on the status region (`translateX` ±6px/±8px = `--distance-small`/`--distance-base`, 4 segments × 80ms) and **success check** on the success heading. **Judgement call flagged**: a shake is playful, and this site's register is "a competent practitioner explaining something to a peer" — M2's rise-and-fade may be the whole correct answer. Recommend M2 first, then decide with eyes on it |
| **O3** | **Drawer links don't stagger.** The panel slides in and all 7 rows are already at full opacity | 40ms (`--duration-stagger`) per row × 7 = 280ms total, under the ~300ms ceiling. Needs a `--d`-style delay on each row and `.is-open`-gated opacity — cheap and it makes the drawer feel like it *arrived*. Lowest-value item here; skip if the budget is tight |
| **O4** | **Hero board reflows after first paint.** `board.ts` sets `zoom` from `ResizeObserver` on script execution. Measured: one layout shift of **0.00826 at 729ms** on the hero board wrapper — the only shift on the page | Not motion, and well inside the 0.05 CLS budget. Recorded so it is not re-discovered as a motion defect. No plan written |

---

## 2. Assessed and left alone

Motion that is already right, so the owner knows it was examined rather than missed.

- **`motion.ts`'s reduced-motion gate.** The `reduceMotion` / `motionSafe` condition pair
  in `whenMotionSafe` is genuinely correct, non-obvious, and its comment documents the
  empirical failure it fixes. The one-frame `requestAnimationFrame` deferral of
  ScrollTrigger creation is the right call for six separately-fetched module scripts.
  Nothing to change.
- **The reduced-motion branch as a whole.** Verified in source at four independent
  layers: `whenMotionSafe` (no timeline created), `global.css:437–466` (`@media reduce`
  end states), `BaseLayout.astro:146–178` (`<noscript>` end states — the JS-disabled path
  is genuinely covered, contrary to first appearances), and per-component
  `@media (prefers-reduced-motion: no-preference)` gates in `Nav`, `LangToggle`,
  `NavDrawer` and `Header`. Every recommendation in §1 preserves all four.
- **GSAP animates *from* an offset.** `reveal.ts` uses `gsap.from()` against a `.reveal`
  end state that ships unconditionally. This is the invariant done properly.
- **RTL mirroring.** Confirmed live on `/ar/`: `.tm-grow`'s `transform-origin` flips to
  `100% 50%` (computed `213.115px 1px`), the nav underline's origin flips, and the drawer's
  `translateX` sign flips. No physical-direction property anywhere in the motion layer.
- **`transition: all` is absent.** Zero occurrences. `Button.astro`'s bare `transition`
  utility compiles to an explicit 11-property list, not `all` — bounded and acceptable.
  (`filter`/`backdrop-filter` ride along unnecessarily but are never changed on hover.)
- **Header scroll state is not a GSAP tween.** `header.ts` and `mobileNav.ts` correctly
  refuse GSAP for a class toggle. `board.ts` correctly runs *un*gated because a fit-to-width
  zoom is layout, not decoration. All three call the right tool.
- **Chain-hint keyframes.** `tm-hint-drift` animates `transform` + `opacity` only, resets
  while fully transparent so the reset is never seen, and `hintDismissed` is a closure
  variable so scroll-back cannot resurrect it. Exactly right.
- **One pin, one scrub.** `position: sticky` for the pin plus a plain scroll handler for
  the scrub — the invariant is satisfied without manufacturing scroll height. M6 changes
  *when* that handler runs, never the count.
- **Stagger offsets.** `reveal.ts`'s 60ms default, 30ms for >8 children, and
  `ArgumentBlock`'s 80ms override for long prose all land on transitions.dev's grid
  (40/80ms) with totals under 300ms. On token; leave.
- **Blog TOC is JS-free with instant anchor jumps.** `scroll-behavior: auto` confirmed
  live. Correct under reduced motion by construction. O1 must not change this.
- **The hero load cascade and the `.tm-*` reveal durations** (900/1250/850/1100/1200ms,
  delays 0→700ms). Long by UI standards, but these are load-time marketing motion, which
  the bar explicitly permits, and they are a documented class-for-class port of the
  `.dc.html` design reference (`Hero.astro:8–12`, `global.css:241–259`). Re-timing them is
  a design decision for the owner, not an audit finding — **not reported as a defect**.
- **`.tm-load`'s `opacity: 0` start on the LCP `<h1>`.** Assessed for LCP risk: the
  animation starts at 90ms and the strong-ish curve lifts opacity off zero immediately, so
  Chromium has a paintable LCP candidate early. No change proposed.
- **The AI-queue Accept/Modify/Reject buttons are non-functional** `type="button"` elements
  with hover states. That is a content/affordance question, not motion. Noted only so M9
  does not accidentally make three dead buttons feel more clickable than they are.

---

## 3. Flagged — would violate a CLAUDE.md invariant. Do not plan.

Anything below must never be turned into a task.

1. **Do not add Motion, Framer Motion, React Spring, Lenis, CustomEase, Flip, or any
   other library or GSAP plugin.** GSAP 3.15 core + ScrollTrigger + SplitText is the whole
   allowlist. Every plan in §4 is CSS or vanilla TS. The transitions.dev recipes named in
   O1/O2 are to be **hand-written against `tailwind.config.mjs` tokens** — do not install
   the package and do not copy `_root.css` into the project; it would create a second,
   competing token scale.
2. **Do not introduce a second easing scale.** No `--ease-out`, no `--ease-drawer`, no
   `cubic-bezier(0.32, 0.72, 0, 1)`. `ease-micro` already *is* the recommended curve (§0).
   Any plan that adds a curve is wrong.
3. **Do not write a bare hex, duration, distance or scale outside `tailwind.config.mjs`.**
   M9 therefore adds a `scale.press` token rather than `scale-[0.98]`.
4. **Do not add a spring, a bounce, or any overshoot curve.** `global.css:359–366` states
   the doctrine explicitly ("never a pulse, never a bounce — the site's motion doctrine
   forbids overshoot easing"). This rules out transitions.dev's `--ease-bounce` and
   `--ease-bounce-strong`, including its "bouncy hover-out" rule — **hover-out here stays
   symmetric with hover-in**, which is a deliberate deviation from that skill's guidance.
5. **Do not animate a layout property.** No `width`, `height`, `top`, `margin`, `padding`.
   M7's `min-inline-size` is set **once, before** the count begins, and is never animated.
   O1's rail marker must be `scaleX`, never `height`.
6. **Do not add a second pinned section or a second scrubbed timeline to any route.**
   M6 must not convert the chain handler into a ScrollTrigger scrub.
7. **Do not make any element depend on JS to become visible.** Every new end state goes in
   CSS, and if it ships hidden it must also be un-hidden by both
   `@media (prefers-reduced-motion: reduce)` (`global.css:437`) and the `<noscript>` block
   (`BaseLayout.astro:158`). O3's drawer-link stagger is the one proposal here that adds a
   hidden start state — it is safe only because the drawer itself is JS-only
   (`Header.astro`'s `<noscript>` removes the trigger).
8. **Do not reduce Arabic below English.** Any per-language motion difference is a defect.
9. **Do not drive child transforms from a CSS variable on a shared parent.** The existing
   per-element `--d` pattern is fine (each element carries its own); a parent-level
   variable feeding many children is not.
10. **Do not remove a reduced-motion branch to simplify a fix.** Under `reduce`, no
    timeline may be created and the end state must already be in CSS.

---

## 4. Implementation plans

Each plan is self-contained: exact file, exact current text, exact target, exact token
names, and a verification step. Executors should assume no other context.

Recommended order: **M1 → M9 → M2 → M3 → M4 → M7 → M5 → M6 → M13 → M10 → M11 → M12 → M8**,
then O1. M1 and M9 must ship together (M1 removes accidental touch feedback that M9
replaces). M8 is last because it is the only plan that changes how something looks.
Everything else is independent.

---

### M1 — Gate every `hover:` utility behind a real hover-capable pointer

- **Severity**: HIGH · **Category**: Accessibility (AUDIT §6) · **Scope**: 1 file, 3 lines

**Problem.** `tailwind.config.mjs` has no `future` block, so Tailwind 3.4.19 compiles every
`hover:` variant to a bare `:hover` selector. Confirmed live: iterating all 477 CSSOM rules
on `/en/` returns **0** rules whose `conditionText` mentions `hover`. On a touch device the
browser synthesises a `:hover` on tap and leaves it applied until the next tap elsewhere, so
`Button.astro:57`'s `motion-safe:hover:-translate-y-px` leaves the primary CTA visibly
lifted after it is pressed, and `AiQueue.astro:174`'s `hover:bg-accent hover:text-ink`
leaves a tapped button inverted.

**Target.** In `c:\...\TruMandate_website\tailwind.config.mjs`, add a top-level `future`
key. Place it immediately before the existing `corePlugins` key (currently at line 639):

```js
  // Tailwind compiles `hover:` to a bare `:hover` by default, which a touch
  // browser synthesises on tap and then leaves stuck until the next tap
  // elsewhere — so `motion-safe:hover:-translate-y-px` (Button.astro) left the
  // primary CTA lifted after every phone press. This wraps every `hover:`
  // utility in `@media (hover: hover) and (pointer: fine)`. `focus-visible:`
  // and `active:` are separate variants and are unaffected, so keyboard focus
  // and press feedback still work everywhere.
  future: {
    hoverOnlyWhenSupported: true,
  },
  corePlugins: {
```

**Repo conventions.** `tailwind.config.mjs` is the only place a motion or measurement
value may live, and every non-obvious key carries a comment explaining why (see the
`corePlugins` block directly below). Match that comment density.

**Boundaries.** Do not touch any component. Do not hand-write `@media (hover: hover)`
anywhere — the config flag is the whole fix. Do not change `focus-visible` or `active`
variants in this plan.

**Verification.**
- `npm run build` succeeds.
- In the built CSS (`dist/_astro/*.css`), `grep -c 'hover: hover'` returns a non-zero
  count, and every `:hover` selector is inside such a block.
- Feel check: in Chrome DevTools device mode at 375px with touch emulation on, tap
  "Book a demo" in the hero, then tap elsewhere — the button must not remain 1px high.
  Tap an AI-queue "Accept" button — it must not stay filled mint.
- Keyboard: Tab to the same button; the focus ring and the colour change must still appear.
- **Done when** no `:hover` rule in the built stylesheet sits outside a `(hover: hover)`
  media query.

---

### M9 — Give pressable elements real press feedback

- **Severity**: MEDIUM · **Category**: Physicality (AUDIT §3) · **Scope**: 4 files
- **Depends on M1** — ship in the same change.

**Problem.** `Button.astro:57` ends with
`motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0`. The `active:` rule
only *cancels* the hover lift, so it produces feedback exclusively when a hover already
happened. Once M1 lands, a touch press produces no visual response at all. The AI-queue and
AI-moment buttons (`AiQueue.astro:174,180,186`; `AiMomentCard.astro:136,142,148`) have no
`active:` state whatsoever.

**Target.** Add one token, then one utility per call site.

1. `tailwind.config.mjs` — inside `theme.extend`, adjacent to the existing `translate`
   block (currently line 511):

```js
      // Press feedback (AUDIT §3: 0.95–0.98 on :active). 0.98 rather than
      // Tailwind's stock scale-95: these are wide text buttons, where 0.95
      // reads as a zoom. Paired with duration-micro/ease-micro, the same
      // 150ms tier the buttons' colour and lift already use.
      scale: {
        press: "0.98",
      },
```

2. `src/components/ui/Button.astro:57` — replace the `base` string's tail:

```
   before: motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0
   after:  motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-press
```

3. `src/components/home/AiQueue.astro` lines 174, 180, 186 and
   `src/components/product/AiMomentCard.astro` lines 136, 142, 148 — six buttons. Each
   currently reads `... transition-colors duration-state ease-standard hover:...`. In this
   plan change only the two additions (M3 handles the duration/ease swap on the same
   strings, so if M3 has already landed the prefix will read
   `transition duration-micro ease-micro`):

```
   add to each: motion-safe:active:scale-press
   and change `transition-colors` → `transition` on these six only, so `transform`
   is in the transitioned property list (`transition-colors` excludes it).
```

**Repo conventions.** `motion-safe:` is how this codebase gates a transform so it never
enters the cascade under `prefers-reduced-motion: reduce` — see `Button.astro:49–55`'s own
comment ("under reduce the transform never enters the cascade at all, so hover/press are
colour-only there, which is correct"). Keep that gate on every new transform.

**Boundaries.** Do not add `scale` to any non-pressable element. Do not use
`scale-[0.98]` — the token exists for this. Do not change `duration`/`ease` on
`Button.astro` (already correct). Do not give the six AI-queue/AI-moment buttons a
`translate` lift; they sit inside dense cards where a lift reads as a layout wobble.

**Verification.**
- `npm run build` succeeds; `grep -r 'scale-\[' src/` returns nothing.
- Feel check, pointer: press and hold "Book a demo" — it must settle to 98% within 150ms
  and return on release, with no visible bounce.
- Feel check, touch (375px, touch emulation): pressing gives a scale response even though
  M1 has removed the hover lift.
- DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce": pressing must
  change colour only, with no scale.
- **Done when** all seven pressable surfaces respond to `:active` on both pointer and touch.

---

### M2 — Stop driving the contact-form status entrance with an ease-in curve

- **Severity**: HIGH · **Category**: Easing (AUDIT §2) · **Scope**: 2 files, 2 strings

**Problem.** The status region fades **in** on `cubic-bezier(0.32, 0, 0.67, 0)` — confirmed
by computed style after submitting `/en/contact` empty:
`transition: opacity 0.2s cubic-bezier(0.32, 0, 0.67, 0)`. That is `easeInCubic`: a pure
ease-in with `y1 = y2 = 0`. `contactForm.ts:230–235` sets `opacity = "0"` then raises it to
`"1"` on the next frame, so the reader waits through the flat opening of the curve before
the error summary they are looking for becomes legible. `tailwind.config.mjs:459` documents
the token as "ease-IN only (y2=0): **dismiss/hide**" — the opposite of what it is doing
here, and this is the token's only use in the codebase.

Two places carry the same class list and `contactForm.ts:170–173` warns they must stay in
step:

```
src/components/contact/ContactForm.astro:131
  ... shadow-field focus-visible:outline-accent-deep motion-safe:transition-opacity motion-safe:duration-state motion-safe:ease-exit

src/scripts/contactForm.ts:176
  "shadow-field focus-visible:outline-accent-deep motion-safe:transition-opacity motion-safe:duration-state motion-safe:ease-exit",
```

**Target.** Identical replacement in both, adding a 4px rise so the region *arrives*
rather than only brightening (AUDIT §3: a pure-fade entrance with no transform is a
finding; `--distance-micro`/`--distance-base` scale down for small in-place surfaces, and
4px matches the existing 1px–12px translate range on this site):

```
  ... shadow-field focus-visible:outline-accent-deep motion-safe:transition-[opacity,transform] motion-safe:duration-state motion-safe:ease-micro
```

Then in `src/scripts/contactForm.ts`, replace the two-line opacity dance at lines 230–235:

```ts
// before
statusEl.style.opacity = "0";
requestAnimationFrame(() => {
  statusEl.style.opacity = "1";
});

// after
statusEl.style.opacity = "0";
statusEl.style.transform = "translateY(4px)";
requestAnimationFrame(() => {
  statusEl.style.opacity = "1";
  statusEl.style.transform = "translateY(0)";
});
```

Finally, update the stale comment at `ContactForm.astro:104–106` — it currently claims the
region "adopts `ease-exit`". Replace `ease-exit` with `ease-micro` in that prose and drop
the dismissal rationale.

**Repo conventions.** `motion-safe:` gating (`Button.astro:49–55`); every duration and
curve referenced by token name, never by value. `duration-state` (200ms) is kept — this is
a short in-place state change, and transitions.dev maps that usage to the `quick`/`fast`
band, which 200ms sits inside.

**Boundaries.** Do not add a shake in this plan (that is O2, and it is an open design
question). Do not touch the validation logic, the `role="alert"`, the focus move, the
class-list *colour* branches, or `FormField.astro`. Do not delete the `ease-exit` token —
M12 decides its fate.

**Verification.**
- `npm run build` succeeds.
- Feel check: submit `/en/contact` empty. In DevTools → Animations, slow playback to 10%:
  the summary must be legibly rising and brightening from the first frames, never flat for
  the first half. Repeat on `/ar/contact` — the rise must be vertical (unmirrored), since
  `translateY` has no logical form and needs none.
- Submit empty twice in a row: the region must re-animate, not snap.
- With `prefers-reduced-motion: reduce`, the region must appear instantly at full opacity
  with no transform, and the alert must still be announced.
- **Done when** `grep -rn 'ease-exit' src/` returns zero matches.

---

### M3 — Move all 19 hover targets onto the `micro` tier

- **Severity**: HIGH · **Category**: Easing/duration + cohesion (AUDIT §2, §7)
- **Scope**: 9 files, 19 mechanical string replacements

**Problem.** 19 interactive elements transition their colour over **200ms** on
`ease-standard`, the weak curve. Confirmed live: 27 DOM nodes on `/en/` share
`transition: color … 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)`. Emil's hover budget is
100–160ms, and `DESIGN-ELEVATION §3.8` — quoted in `Button.astro:49–55` — already declares
the `micro` tier (150ms + `cubic-bezier(0.22, 1, 0.36, 1)`) to be the one for
"hover/focus/short states ≤300ms". `Button.astro` follows that rule; the nav, the footer,
the language toggle, the hamburger, the blog cards, the blog TOC, the blog tags, the drawer
links and the six AI buttons do not.

**Target.** In each of the 19 locations replace exactly:

```
  before: transition-colors duration-state ease-standard
  after:  transition-colors duration-micro ease-micro
```

Locations (verified at commit `9fab49e`):

| File | Lines |
| --- | --- |
| `src/components/blog/BlogIndex.astro` | 148, 158, 234 |
| `src/components/blog/BlogPostArticle.astro` | 229, 306, 369, 385, 400 |
| `src/components/home/AiQueue.astro` | 174, 180, 186 |
| `src/components/layout/Footer.astro` | 104 |
| `src/components/layout/Header.astro` | 106 |
| `src/components/layout/LangToggle.astro` | 25 |
| `src/components/layout/Nav.astro` | 40 |
| `src/components/layout/NavDrawer.astro` | 76 |
| `src/components/product/AiMomentCard.astro` | 136, 142, 148 |

**Repo conventions.** `Nav.astro:76–81` and `LangToggle.astro:53–59` already animate their
hover *underline* with `duration-micro` + `ease-micro`; this change makes each link's colour
and its underline move on one clock instead of two (200ms colour against a 150ms underline
is currently visible as the line finishing before the text does).

**Boundaries.** Do not change any `duration-state` outside this list — the header chrome
(`Header.astro:162,174`), the drawer (M4's job), the chain hint (`global.css:389`) and the
form status (M2's job) are separate usages. Do not change `transition-colors` to
`transition` here (M9 does that for six buttons). Do not touch the 850–1200ms `.tm-*`
reveal durations.

**Verification.**
- `npm run build` succeeds; `grep -rn 'duration-state ease-standard' src/` returns zero.
- Live check via CSSOM: no node should report
  `color 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)`; the count of
  `0.15s cubic-bezier(0.22, 1, 0.36, 1)` nodes should rise from 6 to ~33.
- Feel check: hover a nav link and watch text and underline together — both must arrive at
  the same instant. The colour change should feel immediate, not trailing the cursor.
- **Done when** every hover-triggered colour change on the site runs at 150ms on
  `ease-micro`.

---

### M4 — Make the nav drawer close faster than it opens

- **Severity**: MEDIUM · **Category**: Interruptibility / open-close asymmetry
- **Scope**: 1 file, one `<style>` block

**Problem.** Confirmed live at 375px with the drawer open: panel
`transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)`, backdrop
`opacity 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)`. Both directions are identical, and both
use `ease-standard` where the surface-motion curve the project owns is `ease-micro`
(byte-identical to transitions.dev's `--ease-smooth-out`, whose documented usage is
"panel open + close"). A 300ms dismissal on a 319px panel is slow enough that the reader
waits on the site rather than the reverse.

**Target.** Replace the whole `@media (prefers-reduced-motion: no-preference)` block in
`src/components/layout/NavDrawer.astro` (currently lines 141–155) and add the two
`.is-open` duration overrides. CSS resolves a transition from the rule that applies in the
*destination* state, so putting the short duration on the base (closed) rule and the long
one on `.is-open` gives open 300ms / close 200ms with no JS:

```css
  /* Open/close asymmetry: opening is an invitation, closing must get out of
   * the way. The base (closed) rules below carry the CLOSE timing —
   * `duration-state`, 200ms — because a transition resolves from the rule that
   * applies in the state being entered; the `.is-open` overrides carry the
   * OPEN timing, `duration-header`, 300ms. Both directions share `ease-micro`
   * (the project's strong ease-out and the same curve every surface motion on
   * the site uses); asymmetry is expressed as duration, never as a second
   * curve, and never as an overshoot — global.css's own motion doctrine
   * forbids that. No delay in either direction: a dismissal is never delayed. */
  @media (prefers-reduced-motion: no-preference) {
    [data-nav-backdrop] {
      transition: opacity theme("transitionDuration.state")
        theme("transitionTimingFunction.micro");
    }

    [data-nav-panel] {
      transition: transform theme("transitionDuration.state")
        theme("transitionTimingFunction.micro");
    }

    [data-nav-drawer].is-open [data-nav-backdrop],
    [data-nav-drawer].is-open [data-nav-panel] {
      transition-duration: theme("transitionDuration.header");
    }
  }
```

**Repo conventions.** `theme("transitionDuration.*")` / `theme("transitionTimingFunction.*")`
inside an Astro `<style>` block is how every other component in this codebase reaches a
motion token (`Header.astro:162`, `Nav.astro:79`, `global.css:389`). Never write the
cubic-bezier or the millisecond value.

**Boundaries.** Do not touch `mobileNav.ts` — the timing is entirely CSS and must stay
that way. Do not move `[data-nav-panel]`'s base `transform: translateX(100%)` or the
`[dir="rtl"]` sign flip out of their current rules. Do not add a `transition-delay`. Do not
add a new duration token — `state` and `header` both already exist. Keep the whole thing
inside the `no-preference` media query so a reduced-motion reader still gets the end state
instantly.

**Verification.**
- `npm run build` succeeds.
- Live at 375px: open the drawer and read the panel's computed `transition-duration` — must
  be `0.3s`. Close it and read the same property mid-close — must be `0.2s`.
- Feel check: open and close five times. The close must feel noticeably crisper than the
  open, with no snap and no overshoot. Tap the trigger twice rapidly mid-open: the panel
  must reverse from where it is (CSS transitions retarget), never restart from off-screen.
- With `prefers-reduced-motion: reduce`, the drawer must jump between states with no
  animated step, and Escape/backdrop-click/link-click must all still close it.
- Check `/ar/` at 375px: the panel must slide from the inline-end edge in both directions.
- **Done when** open is 300ms, close is 200ms, both on `ease-micro`, in both languages.

---

### M7 — Freeze the counter's width before it counts

- **Severity**: MEDIUM · **Category**: Performance / physicality · **Scope**: 2 files

**Problem.** `src/scripts/redesignReveal.ts:24–39` rewrites `el.textContent` on every frame
for 1300ms. Measured on the live `/en/`: each `[data-count]` span is `display: inline`,
`font-variant-numeric: normal`, inside a `text-align: center` `<p>`. Counting to 142 walks
`"0"` → `"58"` → `"142"`, i.e. 1 → 2 → 3 glyphs, so the figure shifts horizontally on almost
every frame; `"AED 0M"` → `"AED 218M"` drags an 8-character line. Every one of those ~78
rewrites is a layout invalidation of the proof band.

**Target.** In `src/scripts/redesignReveal.ts`, inside `runCounter`, immediately after the
`Number.isFinite(to)` guard and **before** `const start = performance.now();`:

```ts
  // The element's server-rendered text is already the FINAL value
  // (ProofBand.astro), so measuring it now gives the exact width the count-up
  // will end at. Reserving it up front turns ~78 reflowing textContent writes
  // into ~78 writes inside a fixed box: the figure no longer jitters
  // horizontally as it grows from one digit to three, and the centred line
  // stops dragging. Set once, before the first frame — never animated, so
  // nothing here animates a layout property (CLAUDE.md).
  const finalWidth = el.getBoundingClientRect().width;
  if (finalWidth > 0) {
    el.style.display = "inline-block";
    el.style.minInlineSize = `${finalWidth}px`;
  }
```

Then add `tabular-nums` to **all five** counter spans in
`src/components/home/ProofBand.astro`. There are five, not four, because the fourth stat
has separate LTR and Arabic branches — the `class` attribute of each `<span data-count …>`
sits at lines **48, 67, 84, 103 and 118**:

```
  before: class="font-mono font-data text-paper"     (48, 67, 103, 118)
  after:  class="font-mono font-data tabular-nums text-paper"

  before: class="font-mono font-data text-mint"      (84)
  after:  class="font-mono font-data tabular-nums text-mint"
```

Only four render on any one page (line 103 is the Arabic branch, 118 the LTR branch of the
same stat), which is why the live DOM shows four — edit all five so both languages match.

**Repo conventions.** `redesignReveal.ts` already writes inline style through plain
`el.style` assignment; keep that. Logical property names only — `minInlineSize`, never
`minWidth`. `tabular-nums` is Tailwind's stock `font-variant-numeric` utility, so no token
is needed.

**Why `tabular-nums` matters even though Plex Mono is monospaced.** `global.css:127` swaps
`.font-mono` to Plex Sans for `[dir="rtl"]`, so the Arabic page counts in a proportional
face where digit advances genuinely differ. In LTR it is a harmless no-op.

**Boundaries.** Do not change `COUNT_DURATION`, the easing function, the `to`/`prefix`/
`suffix` data attributes, or the server-rendered final values (they are the no-JS and
reduced-motion content and must stay exact). Do not set a `max-inline-size`. Do not
animate `min-inline-size`. Do not touch the `.tm-rise` classes on the four wrapper divs.

**Verification.**
- `npm run build` succeeds; `astro check` reports no new errors.
- Feel check at 1440 and at 375: scroll the proof band into view and watch "142" and
  "AED 218M" count. Neither the figure nor its label may move horizontally at any point.
  Record the section and step through frames if unsure.
- `PerformanceObserver({type: 'layout-shift', buffered: true})` while scrolling the band
  into view must report no entry sourced from a `[data-count]` node. Total page CLS must
  stay at or below the 0.00826 measured at commit `9fab49e`, and well under the 0.05 budget.
- With JS disabled, the four figures must still read `142`, `AED 218M`, `6`, `24 mo`.
- Check `/ar/` — the Arabic band uses a separate unit span; confirm the digits are stable
  there too.
- **Done when** no counter changes width while counting, in either language.

---

### M5 — Stop holding `will-change` for the life of the page

- **Severity**: MEDIUM · **Category**: Performance (AUDIT §5) · **Scope**: 2 files

**Problem.** Two separate over-promotions:

```html
<!-- src/components/chain/RecordChain.astro:214 — current -->
<div data-chain-track class="relative mx-auto"
     style="width: min(78vw, 340px); min-height: clamp(96px, 48svh, 430px); transform-style: preserve-3d; will-change: transform;">
```

The track is never transformed — `recordChain.ts` writes `transform` only to
`[data-chain-card]` elements (line 124). This promotion buys nothing.

```ts
// src/scripts/recordChain.ts:95 — current, inside armRing()
card.style.willChange = "transform, opacity";
```

`armRing()` runs once and nothing ever clears it, so five cards up to 340×430px stay
GPU-promoted long after the chain has left the viewport. Confirmed live:
`getComputedStyle(card).willChange === "transform, opacity"` at every scroll position.

**Target.**

1. `RecordChain.astro:214` — delete `will-change: transform;` from the inline style,
   keeping `transform-style: preserve-3d` (which is load-bearing for the 3D ellipse):

```
style="width: min(78vw, 340px); min-height: clamp(96px, 48svh, 430px); transform-style: preserve-3d;"
```

2. `recordChain.ts` — remove the `willChange` line from `armRing()` and add a small
   in-range toggle. Inside the `whenMotionSafe` callback, after `armRing`'s definition:

```ts
  // will-change is a promise to the compositor, not a decoration: held
  // permanently it costs GPU memory for five cards up to 340×430px each, long
  // after the chain has scrolled away. Set it while the pinned stage is
  // actually the reader's context (the same `rect.top` range the hint already
  // uses) and release it outside.
  let promoted = false;
  function setPromoted(state: boolean) {
    if (promoted === state) return;
    promoted = state;
    cards.forEach((card) => {
      card.style.willChange = state ? "transform, opacity" : "auto";
    });
  }
```

Then inside `onScroll`, immediately after `armRing();`:

```ts
    // A viewport of margin either side so promotion is already in place by the
    // time the first card moves.
    setPromoted(rect.top <= window.innerHeight && rect.bottom >= 0);
```

**Repo conventions.** `recordChain.ts` reuses one `rect`/`total`/`p` measurement for every
derived decision (see its own comment on the hint at lines 139–146). Follow that — do not
add a second `getBoundingClientRect()` call.

**Boundaries.** Do not remove `transform-style: preserve-3d` or the `perspective: 1500px`
wrapper at line 210. Do not remove the grid overlay in `armRing` (`display: grid`,
`gridRowStart`, `gridColumnStart`) — that is load-bearing for track height and for the
reduced-motion contract. Do not add `will-change` anywhere else on the site.

**Verification.**
- `npm run build` and `astro check` pass.
- Live: with the page at scroll 0, `getComputedStyle($('[data-chain-card]')).willChange`
  must read `auto`. Scroll into the chain — it must read `transform, opacity`. Scroll past
  the section — back to `auto`. The track must read `auto` at all times.
- Feel check: scrub the full 3420px pin range slowly and then quickly. The ellipse must be
  as smooth as before; watch specifically for a flicker or a one-frame jump at the moment
  promotion turns on — the innerHeight margin exists to prevent that. If you see one,
  widen the margin rather than reinstating the permanent promotion.
- **Done when** no element on the home page holds `will-change` outside the chain's active
  scroll range.

---

### M6 — Coalesce the chain scroll handler into one frame

- **Severity**: MEDIUM · **Category**: Performance (AUDIT §5) · **Scope**: 1 file

**Problem.** `src/scripts/recordChain.ts:100–157`. `onScroll` is registered directly on the
`scroll` event and, per event, reads `section.getBoundingClientRect()` (a layout read) and
then performs 15 inline-style writes across five cards plus two `textContent` writes and a
`classList.toggle` per dot. Because the writes of one event precede the read of the next,
each event's read can force a style/layout recalc. Separately, line 127 reassigns
`card.style.zIndex` on every event even when the rounded value has not changed —
`z-index` is a paint-order property, so this invalidates stacking rather than staying on
the compositor.

**Target.** Rename the current `onScroll` body to `render`, and add a rAF gate. Replace
lines 100 and 157–159:

```ts
  // before (line 100)
  function onScroll() {

  // after
  function render() {
```

```ts
  // before (lines 157–159)
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // after
  // One render per frame, not one per scroll event. A scroll listener that
  // reads getBoundingClientRect() and then writes fifteen inline styles makes
  // the NEXT event's read force a layout recalc; coalescing through rAF means
  // the read and the writes happen once, inside the frame the browser was
  // going to paint anyway. The initial call stays synchronous so the first
  // paint of the stage is already correct (motion.ts has already deferred this
  // whole setup by one frame).
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      render();
    });
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  render();
```

And guard the `z-index` write at line 127:

```ts
      // before
      card.style.zIndex = String(Math.round(100 + 100 * v));

      // after — z-index is paint order, not a compositor property, so only
      // write it when the value actually changes.
      const zi = String(Math.round(100 + 100 * v));
      if (card.style.zIndex !== zi) card.style.zIndex = zi;
```

**Repo conventions.** `motion.ts`'s `whenMotionSafe` already defers all setup by one
`requestAnimationFrame` for exactly this class of reason — its comment (lines 46–68)
documents the forced-reflow measurements that motivated it. This plan is the same
technique one level down.

**Boundaries.** Do not convert this to a GSAP ScrollTrigger scrub — CLAUDE.md permits one
scrubbed timeline per route and the sticky-pin plus raw-scroll pairing is a documented
deliberate choice (`recordChain.ts:1–32`). Do not change the ellipse maths (`AX`, `BZ`,
`DWELL`, the smoothstep, the 288° rotation, the `rtl` sign) by even one digit. Do not
change `HINT_DISMISS` or the hint's dismissal logic. Do not remove `{ passive: true }`.

**Verification.**
- `npm run build` and `astro check` pass.
- Feel check: scrub the whole pin range with a trackpad and with a mouse wheel, in both
  languages. Card positions, opacities, the `01 / 05` counter, the record name and the live
  dot must be indistinguishable from before. There must be no perceptible lag between
  scroll input and card movement — if there is, the rAF gate is dropping events; confirm
  `ticking` is reset *before* `render()`.
- Record a performance trace while scrubbing and confirm no "Forced reflow" / layout
  thrashing warnings attributed to `recordChain.ts`.
- Reduced motion: the five cards must still render stacked in normal flow, `position:
  relative`, opacity 1 — the handler must not run at all.
- **Done when** `render()` executes at most once per animation frame and no `z-index` is
  written twice with the same value.

---

### M13 — Remove `.tm-grow`'s undeclared 100ms default delay

- **Severity**: LOW · **Category**: Cohesion · **Scope**: 1 line

**Problem.** `src/styles/global.css:300–305`:

```css
  .tm-grow {
    transform: scaleX(0);
    transform-origin: 0% 50%;
    transition: transform theme("transitionDuration.tm-grow")
      theme("transitionTimingFunction.standard") var(--d, 100ms);
  }
```

Every sibling class in the same block uses `var(--d, 0ms)` (`.tm-load` line 273,
`.tm-boardload` line 281, `.tm-rise` lines 289/291, `.tm-fade` line 297). A `.tm-grow`
element with no `--d` therefore waits 100ms for a reason stated nowhere in the markup —
confirmed live: the AI-queue confidence bars report `transition-delay: 0.1s` on the one
instance with no `--d`, against `0s` for the `.tm-rise` block containing them.

**Target.**

```css
      theme("transitionTimingFunction.standard") var(--d, 0ms);
```

**Boundaries.** Do not change the 1200ms `tm-grow` duration, the `scaleX(0)` start, the
`transform-origin`, or the `[dir="rtl"]` origin flip at line 307. Do not add `--d` to any
call site — the ones that want a delay already declare it.

**Verification.** `npm run build`; live, every `.tm-grow` without an inline `--d` must
report `transition-delay: 0s`. Feel check: the AI-queue confidence bars should now start
drawing with their card rather than a beat after it. **Done when** all five `.tm-*` classes
share the same `var(--d, 0ms)` default.

---

### M10 — rAF-gate the header scroll listener and add hysteresis

- **Severity**: LOW · **Category**: Purpose & frequency · **Scope**: 1 file

**Problem.** `src/scripts/header.ts:19–24`:

```ts
    const SCROLL_THRESHOLD = 12;
    const updateState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
```

One threshold with no dead band: a trackpad or momentum scroll resting near 12px can flip
the class repeatedly, and each flip restarts a 300ms `box-shadow` and hairline-opacity
transition (`Header.astro:162,174`) — a visible chrome flicker. The listener also runs on
every scroll event rather than once per frame.

**Target.**

```ts
    // Two thresholds, not one: a single 12px line means momentum or trackpad
    // scroll resting near it can flip the class repeatedly, and each flip
    // restarts the 300ms shadow/hairline transition (Header.astro) as a visible
    // chrome flicker. Adding above 12px and only removing below 8px gives a 4px
    // dead band. rAF-gated for the same reason motion.ts defers its setup: one
    // class decision per frame, never one per event.
    const SCROLL_ON = 12;
    const SCROLL_OFF = 8;
    let scrolled = false;
    let ticking = false;

    const updateState = () => {
      const y = window.scrollY;
      const next = scrolled ? y > SCROLL_OFF : y > SCROLL_ON;
      if (next !== scrolled) {
        scrolled = next;
        header.classList.toggle("is-scrolled", scrolled);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateState();
      });
    };

    updateState();
    window.addEventListener("scroll", onScroll, { passive: true });
```

**Boundaries.** Do not touch the `prefersReducedMotion` branch above it — under `reduce`
the header must keep `is-scrolled` permanently, which is the documented end state. Do not
change the 300ms `duration-header` transitions in `Header.astro` (they come from spec §7
motion #6). Do not introduce GSAP here.

**Verification.** `astro check` passes. Live: scroll to exactly 10px — the class must
reflect whichever side it arrived from, and jiggling around 10px must not toggle it. Feel
check: scroll down 40px and back to 0 slowly; the hairline and shadow must each cross once,
with no flicker. With `prefers-reduced-motion: reduce`, `is-scrolled` must be present at
scroll 0. **Done when** the class changes at most once per frame and never oscillates in
the 8–12px band.

---

### M11 — Unify the two reveal trigger points

- **Severity**: LOW · **Category**: Cohesion + robustness · **Scope**: 1 line

**Problem.** `src/scripts/redesignReveal.ts:57` observes with `{ threshold: 0.18 }` and no
`rootMargin`. Two consequences: (a) any `.tm-rise`/`.tm-fade`/`.tm-grow` block taller than
~5.5× the viewport can never reach 18% intersection, so it would keep `opacity: 0`
permanently; (b) it fires at a different point from `reveal.ts`'s ScrollTrigger
`start: "top 85%"` (lines 18, 90), so the site has two reveal lines.

Measured at 375×640 on `/en/`: the tallest such block is the closing CTA at 677px, giving a
maximum ratio of 0.95. **Nothing trips this today** — this is robustness plus cohesion, not
a live bug.

**Target.**

```ts
    // threshold 0 + a -15% bottom rootMargin fires when the element's top
    // crosses 85% of the viewport height — the exact line reveal.ts's
    // ScrollTrigger uses (`start: "top 85%"`), so the site's two reveal
    // mechanisms share one trigger point. It also removes a latent failure:
    // with a ratio threshold, a block taller than ~5.5x the viewport can never
    // reach 18% intersection and would stay at opacity 0 forever.
    { threshold: 0, rootMargin: "0px 0px -15% 0px" },
```

**Boundaries.** Do not change the observed selector list, the `tm-in` class name, the
`io.unobserve` call, the `runCounter` trigger, or the `whenMotionSafe` gate.

**Verification.** `astro check` passes. Live at 1440 and 375, EN and AR: every
`.tm-rise`/`.tm-fade`/`.tm-grow` element must end at `opacity: 1` after scrolling the full
page; `document.querySelectorAll('.tm-rise:not(.tm-in)').length` must be 0 at page bottom.
Feel check: reveals should now start marginally earlier — content must never appear to
"pop in" after the reader is already reading it. **Done when** both reveal mechanisms fire
at the same 85% line and no element can be left hidden.

---

### M12 — Reconcile the motion tokens with what the code actually uses

- **Severity**: LOW · **Category**: Cohesion & tokens (AUDIT §7) · **Scope**: 2–3 files

**Problem.** `tailwind.config.mjs` opens with "THE ONLY FILE CONTAINING A HEX VALUE… every
colour, duration, ease and measurement used anywhere in this codebase is a token defined
here." Grepping `src/` for each token shows that is no longer true. Zero references:

- `transitionDuration.card` (500ms), `.bar` (600ms), `.wipe` (900ms), `.counter` (1200ms),
  `.line` (700ms), `.glow` (900ms), `.copy` (400ms)
- `transitionDelay.stagger` (60ms)
- `translate.reveal` (24px), `translate.card` (16px), `translate.stagger` (12px)
- `transitionTimingFunction.exit` — zero after M2 lands

Meanwhile the surviving values are bare numbers whose comments claim otherwise:

```ts
// src/scripts/reveal.ts:13–15 — current
      opacity: 0,
      y: 24, // translate.reveal token, tailwind.config.mjs
      duration: 0.8, // transitionDuration.reveal token
```

```ts
// src/scripts/reveal.ts:53–55, 69–70, 86 — current
      : blocks.length > 8
        ? 0.03
        : 0.06; // transitionDelay.stagger, or its stated half
...
        y: 12, // translate.stagger token
        duration: 0.5,
...
          duration: 0.5,
```
(line 86 is the `<hr>` `scaleX` draw inside the same timeline — same value, no comment.)

```ts
// src/scripts/redesignReveal.ts:22 — current
const COUNT_DURATION = 1300; // tm-counter token, tailwind.config.mjs
```

These are GSAP numbers, so they cannot use `theme()` — but the config can still be the
source. Two acceptable resolutions; pick one and be consistent:

**Target (preferred).** Make the scripts read the config. Add to `src/scripts/motion.ts`,
beside `standardEase`:

```ts
import config from "../../tailwind.config.mjs";

/**
 * The motion magnitudes GSAP tweens need, read from tailwind.config.mjs rather
 * than retyped — that file states it is the one place every duration and
 * measurement lives, and a GSAP tween cannot call `theme()`. Seconds, because
 * that is GSAP's unit; px stripped, because that is GSAP's unit for `y`.
 */
const motion = config.theme.extend;
const ms = (v: string) => Number.parseFloat(v) / 1000;
const px = (v: string) => Number.parseFloat(v);

export const durations = {
  reveal: ms(motion.transitionDuration.reveal),
  card: ms(motion.transitionDuration.card),
  counter: Number.parseFloat(motion.transitionDuration["tm-counter"]),
};
export const offsets = {
  reveal: px(motion.translate.reveal),
  stagger: px(motion.translate.stagger),
};
export const staggerStep = ms(motion.transitionDelay.stagger);
```

Then in `reveal.ts` replace `y: 24` → `y: offsets.reveal`, `duration: 0.8` →
`duration: durations.reveal`, `y: 12` → `y: offsets.stagger`, `duration: 0.5` →
`duration: durations.card`, and the `0.06` default → `staggerStep`; in
`redesignReveal.ts` replace `1300` → `durations.counter`.

**Target (fallback, if importing the config into client code inflates the bundle).** Delete
the genuinely dead tokens — `card`, `bar`, `wipe`, `counter`, `line`, `glow`, `copy`,
`exit` — and move each surviving comment to the line where the number actually lives, so no
comment claims a token that is not being read. Note in `TODO.md` that the config's
"every measurement" claim now carries the stated exception.

**Boundaries.** Do not change a single motion *value* in this plan — it is tokenization
only. Do not delete `transitionDuration.tm-*` (all in active use in `global.css`) or
`transitionDuration.micro`/`state`/`header`/`reveal`/`tm-*`. Do not remove
`transitionTimingFunction.standard` or `micro`. Verify JS bundle size before and after if
you take the preferred route.

**Verification.** `npm run build`; compare the gzipped JS total against the 200 KB budget
before and after (`ls -l dist/_astro/*.js`). Live: every animation must be visually
identical — same 24px reveal offset, same 800ms, same 60ms stagger, same 1300ms count.
`grep -rn 'token, tailwind.config.mjs' src/scripts/` must not appear next to a hardcoded
literal. **Done when** no comment in `src/` claims a token that the code does not read.

---

### M8 — Replace the box-shadow pulse with a transform/opacity ring

- **Severity**: MEDIUM · **Category**: Performance + invariant compliance
- **Scope**: 1 file (`global.css`), plus 1 layer move
- **Ship last** — this is the only plan that changes how something looks.

**Problem.** `src/styles/global.css:316–344`:

```css
  @keyframes tm-pulse {
    0%, 100% { box-shadow: 0 0 0 0 theme("colors.mint-ring"); }
    50%      { box-shadow: 0 0 0 7px theme("colors.mint-ring-0"); }
  }
  .tm-live {
    animation: tm-pulse theme("transitionDuration.tm-pulse") ease-in-out infinite;
  }
```

(plus `tm-pulse-r` / `.tm-live-r` at 6px and 2200ms). Four instances run on `/en/` and
`/ar/`: three in the hero Command Centre board (`CommandCentreBoard.astro:134,329,375`),
one toggled onto the active chain dot (`recordChain.ts:137`), and one more on product pages
(`InitiativeRows.astro:144`).

Two distinct problems:

1. **Performance.** `box-shadow` is a paint property. Chromium animates it on the main
   thread, so four elements keep the compositor and the main thread awake at 60fps for as
   long as the tab is open, regardless of whether they are on screen. The page never goes
   idle.
2. **Invariant.** CLAUDE.md: "**Transforms and opacity only.** Never animate layout
   properties." The current code animates neither a transform nor an opacity. It is the
   breach; this plan is the remedy. Flagging it explicitly so the change is understood as
   compliance work, not a redesign.

Note also that interpolating spread `0 → 7px` *against* alpha `0.45 → 0` makes the ring
invisible at both 0% and 50% and visible only around 25% and 75% — the current pulse reads
as a double heartbeat per cycle, which is an artefact of two channels moving in opposite
directions rather than a designed rhythm.

**Target.**

1. Add a `@layer components` block to `global.css` (place it immediately before the
   existing redesign `@layer utilities` block, currently opening at line 260):

```css
/* `.tm-live`/`.tm-live-r` need a containing block for the ring pseudo-element
 * below. Declared in `components`, NOT `utilities`: RecordChain.astro's chain
 * dot carries Tailwind's own `absolute` utility, and a `position` in the
 * utilities layer here would win on source order and break that dot's
 * placement. `absolute` establishes a containing block just as well as
 * `relative`, so leaving it to the utilities layer is correct in both cases. */
@layer components {
  .tm-live,
  .tm-live-r {
    position: relative;
  }
}
```

2. Replace both keyframe blocks and both classes (lines 316–344) with:

```css
  /* One expanding, fading ring per cycle, on a pseudo-element, animating
   * `transform` and `opacity` only — CLAUDE.md's "transforms and opacity only".
   * This replaces an animated `box-shadow` spread, which is a paint property
   * that Chromium runs on the main thread and which therefore kept four
   * elements repainting at 60fps for the life of the page whether or not they
   * were on screen. Scale ceilings reproduce the old ring's outer diameter:
   * the mint dot renders at 5–6px with a 7px spread, i.e. ~3.3x; the coral dot
   * at 5px with a 6px spread, i.e. ~3.4x. Peak alpha is the ring token's own
   * (0.45 mint, 0.55 coral), reached early and decayed away, so there is one
   * clean pulse per cycle rather than the two the old spread-vs-alpha
   * interpolation produced. No overshoot, no bounce. */
  @keyframes tm-ping {
    0% {
      transform: scale(1);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: scale(3.3);
      opacity: 0;
    }
  }

  .tm-live::after,
  .tm-live-r::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    pointer-events: none;
    animation: tm-ping theme("transitionDuration.tm-pulse")
      theme("transitionTimingFunction.standard") infinite;
  }

  .tm-live::after {
    background-color: theme("colors.mint-ring");
  }

  .tm-live-r::after {
    background-color: theme("colors.coral-ring");
    animation-duration: theme("transitionDuration.tm-pulse-r");
  }
```

3. Update the two reduced-motion end states. In `global.css`'s
   `@media (prefers-reduced-motion: reduce)` block (line 449) replace:

```css
    .tm-live,
    .tm-live-r {
      animation: none;
    }
```

with:

```css
    .tm-live::after,
    .tm-live-r::after {
      animation: none;
      opacity: 0;
    }
```

4. Apply the identical change in `src/layouts/BaseLayout.astro`'s `<noscript>` block
   (lines 169–171):

```css
        .tm-live::after,
        .tm-live-r::after {
          animation: none;
          opacity: 0;
        }
```

**Repo conventions.** Every colour and duration through `theme()`; no literal rgba, no
literal ms. `ease-in-out` in the old rule was a bare CSS keyword — the replacement uses
`transitionTimingFunction.standard`, keeping the "no value outside the config" rule intact
without adding a curve.

**Boundaries.** Do not add a new colour token — `mint-ring` (0.45α) and `coral-ring`
(0.55α) already exist and are correct. Do not touch `boxShadow.hint-glow`
(`tailwind.config.mjs:564`), which is a *static* halo on the chain-hint bead and animates
nothing. Do not add `will-change` to these dots. Do not change any `.tm-live` call-site
markup — the layer placement in step 1 is what avoids that. Do not change the `.tm-spark`
stroke-dashoffset animation (it runs once, `forwards`, and is a deliberate SVG draw).

**Verification.**
- `npm run build` succeeds. `grep -n 'box-shadow' src/styles/global.css` must no longer
  match inside a `@keyframes`.
- Live: on `/en/`, `getComputedStyle($('.tm-live'), '::after').animationName` must be
  `tm-ping`; `getComputedStyle($('.tm-live')).position` must be `relative`.
- **Critical regression check**: on `/en/` the chain dot at
  `RecordChain.astro:226` carries `absolute top-0`. Scroll into the chain and confirm the
  active dot still sits at the card's inline-start top corner and does **not** jump into
  the text flow. If it does, the `position` rule landed in the wrong layer.
- **Feel check (owner's eye required)**: compare the hero board's status dots against the
  current production page side by side. The new ring is a single expanding pulse; the old
  one read as a double beat. Confirm the owner accepts the new rhythm before merging. If a
  double beat is wanted, keep this plan's mechanism and add a second `tm-ping` iteration
  inside one cycle rather than reverting to `box-shadow`.
- With `prefers-reduced-motion: reduce`, and again with JS disabled, no ring may be visible
  and no animation may be running.
- Leave the page idle for 30s on the hero with the Performance panel recording: main-thread
  activity attributable to these dots must be gone.
- **Done when** no `box-shadow` is animated anywhere in the codebase and the dots still
  read as live.

---

### O1 — Blog TOC active-section state (candidate)

- **Severity**: opportunity · **Scope**: 1 component + 1 small script
- Not a defect. Written to a lower level of detail than M1–M13 by design: the visual
  treatment is a design decision, not an audit conclusion.

**Gap.** `BlogPostArticle.astro:302–310` renders a sticky rail of 9 anchors on `lg`. Verified
live on `/en/blog/what-is-portfolio-governance/`: no `aria-current`, no active class, no
scroll-spy. The rail tells a reader where they can go and never where they are.

**Sketch.**
- A small `blogToc.ts`, gated through `whenMotionSafe`? — **no.** Orientation is
  information, not decoration, so the *state* must apply under reduced motion; only the
  150ms `scaleX` on the marker is motion. Follow `header.ts`'s pattern instead: run
  unconditionally, and put the transition behind
  `@media (prefers-reduced-motion: no-preference)` in the component's `<style>` block.
- IntersectionObserver over the `h2`/`h3` targets with
  `rootMargin: "-20% 0px -70% 0px"`; set `aria-current="location"` on the matching anchor
  and remove it from the others.
- Style: `[aria-current] { color: theme("colors.paper") }` plus a `::before` 1px bar on the
  existing `border-s` rail, `transform: scaleX(0)` → `scaleX(1)`, `transform-origin: 0% 50%`
  with a `[dir="rtl"]` flip to `100% 50%` — copy `Nav.astro:56–88` exactly, including its
  `no-preference` gate.
- Timing: `duration-micro` + `ease-micro`. transitions.dev's sliding-tabs recipe is
  symmetric (250ms both ways) — but this is a colour-plus-marker state change, not a
  sliding indicator, so the 150ms `micro` tier is the right tier and no asymmetry applies.

**Boundaries.** Must not introduce `scroll-behavior: smooth` — the component's own comment
(lines 286–290) documents instant anchor jumps as deliberate and correct under reduced
motion. Must not animate `height` or `top`. Must degrade to today's behaviour with JS off.
Arabic must get the identical treatment.

---

## 5. What could not be observed

Stated plainly rather than guessed:

1. **`prefers-reduced-motion: reduce` was not exercised in the browser.** The Playwright MCP
   exposes no media-feature emulation, and `chrome-devtools` (which has `emulate`) was
   assigned to another agent for this session. Every reduced-motion claim in this document
   is from reading the four gating layers in source, not from seeing the page render. The
   branch looks correct and is unusually well documented, but **someone should re-run each
   plan's reduced-motion verification step with DevTools → Rendering before merging.**
2. **JS-disabled rendering was not exercised either**, for the same reason. The
   `<noscript>` fallback at `BaseLayout.astro:146–178` is present and covers the right five
   classes; that it *works* is inferred, not measured.
3. **Frame-rate figures are not reportable.** The headless renderer throttles when the page
   is not foregrounded — an early 41-step scrub of the chain returned 10 rAF ticks across
   ~1.7s and froze a mid-flight opacity transition at an identical value three samples
   running. Style and geometry readings taken between navigations are reliable and are what
   this audit is built on; per-frame timing is not. M6's cost is argued from the code's
   read-then-write shape, not from a measured drop. **Re-measure M5, M6 and M8 on a real
   device, or on `chrome-devtools` with a 4× CPU throttle, before and after.**
4. **Real pointer and touch behaviour** — momentum scroll, trackpad rubber-banding at the
   header's 12px threshold, and synthesised `:hover` persistence on a physical phone — was
   reasoned about from the CSS and the listener code. M1 and M10 should be confirmed on
   hardware.
5. **Lighthouse was not run.** No performance or accessibility score is claimed here. CLS
   was measured directly (`0.00826`, single entry, hero board wrapper at 729ms) and console
   was clean (0 errors, 0 warnings across `/en/`, `/ar/`, `/en/contact`,
   `/en/blog/what-is-portfolio-governance/`).
6. **Successful contact-form submission** was not tested — that would post live data to
   Formspree. The success-state motion is identical to the error-state motion (`showStatus`
   shares one code path), so M2 covers it; O2's "success check" idea is unverified against
   the real success render.
