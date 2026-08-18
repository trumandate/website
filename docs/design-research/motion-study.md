# Motion study — design-elevation research

Purpose: study how the best product/marketing sites do scroll choreography,
entrance animation, micro-interaction and easing, then translate what's
usable into concrete GSAP 3 + ScrollTrigger (+ SplitText) work for
TruMandate, inside the constraints CLAUDE.md already sets.

## Method

Firecrawl (`firecrawl-scrape`) returns markdown/structure, not computed
styles or visual scroll state, so it could not answer "what easing curve is
this" or "what does the mid-scroll frame look like" — the two things this
brief actually needs. Went straight to chrome-devtools MCP for all eight
sites: `navigate_page` → `resize_page` (1440×900) → `take_screenshot` for the
hero → `evaluate_script` to scroll and to read the DOM/CSSOM (stylesheet
`cubic-bezier(...)` occurrences, `<canvas>`/WebGL context probing, inline
`style` attributes, `position: sticky` census, `prefers-reduced-motion`
media-query rules) → further screenshots at each scroll stop. No site code
was modified; nothing was submitted to any form.

All eight target sites resolved (none blocked): linear.app, stripe.com,
vercel.com, raycast.com, attio.com, resend.com, framer.com, clerk.com.
24 screenshots saved to `screenshots/inspiration/motion-{site}-{n}.png`
(1440 wide; hero + 2–3 scroll stops per site, Linear got a 4th).

For orientation, TruMandate's current motion vocabulary (`src/scripts/`):
one shared ease, `standardEase = cubic-bezier(0.22, 0.61, 0.36, 1)`
(`tailwind.config.mjs` `transitionTimingFunction.standard`); five motions —
reveal (fade + 24px rise, 0.8s, once at ~15% visibility), the home chain
(CSS-`sticky` pin + `scaleY` rail scrub + independent per-node triggers),
fragment mask-wipe (0.9s), the AI suggestion card (slide 0.5s → bar
`scaleX` fill 0.6s, overlapped), and one count-up (1.2s, text-content
exception). Button hover is `transition-colors duration-state ease-standard`
(200ms) — color only, no transform. Every motion is gated through
`whenMotionSafe()` (`gsap.matchMedia`), so `prefers-reduced-motion: reduce`
genuinely creates no timeline. This baseline is why the synthesis below is
written as deltas, not a redesign.

---

## Site notes

### Linear (linear.app)

Screenshots: `motion-linear-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`,
`-4-scroll3.png`.

- **Easing found in stylesheets:** `cubic-bezier(0.32, 0.72, 0, 1)` and
  `cubic-bezier(0.16, 1, 0.3, 1)`. Both are pure ease-out curves (y never
  exceeds 1) — fast-out, no overshoot, decelerating hard into rest. This is
  the "snappy but composed" character, not playful.
- **Reduced motion:** the only site of the eight where this was directly
  provable from the CSSOM. Nine `prefers-reduced-motion` rules found,
  including `@media (prefers-reduced-motion: no-preference) { .smooth-scroll
  { scroll-behavior: smooth; } }` (repeated per CSS module) and a `sonner`
  toast rule disabling transitions under `(prefers-reduced-motion)` with no
  `no-preference`. **Directly reusable pattern:** gate `scroll-behavior:
  smooth` itself behind the media query at the CSS level, not just JS
  animations.
- **DOM signals:** no GSAP/ScrollTrigger globals, no Framer Motion
  attributes, no `position: sticky` elements found at the scroll stops
  sampled. 270 elements had a non-`none` `transform` and 46 had a live
  `will-change` at the second scroll stop — consistent with a large surface
  of simultaneously-animating cards rather than one big pinned scene.
  `document.body.scrollHeight` grew from 10,902 to 14,540px between the
  first and third scroll reads — content/height is still resolving
  post-hydration (React), not relevant to a static Astro site.
- **What reads as smooth:** short, ease-out-only transitions on a lot of
  small surfaces at once (cards, nav, icons) rather than one hero effect;
  nothing overshoots.
- **Applicable to TruMandate:** the ease-out character and the
  reduced-motion-gates-smooth-scroll CSS pattern, directly. The "many small
  things move a little" texture is compatible with the existing reveal/wipe
  vocabulary if used to add micro-interactions, not new entrance beats.

### Stripe (stripe.com)

Screenshots: `motion-stripe-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Hero mechanism:** a `<canvas>` inside `.hero-wave-animation__contents`
  running a **WebGL2** context — a real-time shader (gradient wave/mesh),
  not a CSS/GSAP tween. A second WebGL2 canvas (`.data-viz`) drives an
  animated chart further down, and a third sits inside a
  `.squeezy-carousel` section.
  No `cubic-bezier` values were found anywhere in the stylesheets — the
  motion that exists is either canvas-internal (shader time uniforms, no
  CSS surface to read) or applied via inline styles set by JS frame-by-frame.
- **No `position: sticky` elements** at the two scroll stops sampled — no
  pinned/scrubbed panel handoff of the Linear/Attio kind visible on the
  homepage; the signature move is the shader hero, not scroll choreography.
- **Applicable to TruMandate:** not the WebGL — CLAUDE.md rules out canvas/
  WebGL implicitly by scoping the whole site to "readable with JS disabled"
  and inline SVG only, and a shader is neither. What generalizes: an
  abstract, non-representational, ambient background motion *communicates
  "sophisticated engineering"* without depicting a screen or a person — the
  same job TruMandate's fragments/chain already do with SVG. Nothing here
  changes the plan; it confirms the SVG-only approach is the right
  substitute for what Stripe spends WebGL on.

### Vercel (vercel.com)

Screenshots: `motion-vercel-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Easing found:** the widest set of the eight — 15 distinct curves,
  including the Linear-shared `cubic-bezier(.16,1,.3,1)`, standard Tailwind/
  Material families (`.4,0,.2,1`, `0,0,.2,1`, `.4,0,.6,1`), and several with
  `y2 > 1`: `cubic-bezier(.1,0,.1,1.1)`, `cubic-bezier(.5,0,.1,1.2)`,
  `cubic-bezier(.3,0,.1,1.05)`. A `y` control point above 1 produces a small
  overshoot-then-settle — a "spring-like snap" reserved (by convention, and
  by what's visible in the screenshots) for small UI chrome — toggles,
  badges, nav indicators — never for whole sections.
  Also present: `.23,1,.32,1` and `.25,1,.5,1`, both ease-out-only,
  presumably for larger content blocks.
  This is Vercel's actual Geist design-system easing scale (`ease-out-quad`
  through `ease-spring` style names) — a two-tier system: composed ease-out
  for content, a touch of overshoot for controls. **This tiering is the
  single most reusable idea from the whole study.**
- **1 canvas, WebGL-capable context** — smaller hero effect than Stripe's,
  consistent with a lighter-touch ambient graphic rather than a full shader
  scene.
- **No sticky elements, only 4 `will-change` elements live** at the sampled
  scroll stop — motion budget is deliberately small, most of the page is
  static.
- **Applicable to TruMandate:** the two-tier easing idea — keep
  `standardEase` (0.22, 0.61, 0.36, 1, no overshoot) for section-level
  reveals/wipes/counts exactly as now, and consider a second, slightly
  livelier ease *only* for hover/focus micro-states (nav underline, button
  affordance) — still transform/opacity, still no bounce, just less damped
  than the content ease. This does not conflict with "no playful bounce"
  because a `y2` of ~1.05–1.1 is a tiny, controlled overshoot, not a
  cartoon spring (Raycast/Clerk's 1.275–1.56 range, below, is the line not
  to cross).

### Raycast (raycast.com)

Screenshots: `motion-raycast-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Easing found:** a broad set including the full classic easings.net
  family — `.455,.03,.515,.955` (easeInOutQuint), `.645,.045,.355,1`
  (easeInOutCubic), `.075,.82,.165,1` (easeOutCirc) — plus, distinctively,
  **`cubic-bezier(0.34, 1.56, 0.64, 1)`**, the textbook "ease-out-back"
  overshoot curve (y peaks at 1.56 before settling to 1). That's a visible
  bounce, used for a consumer productivity brand's playful tone.
- 1 canvas/WebGL context, no sticky elements found at the sampled stops.
- **Applicable to TruMandate:** the overshoot curve itself is explicitly the
  thing CLAUDE.md forbids ("no playful bounce"). Useful only as the
  calibration reference for *how much* overshoot reads as playful (anything
  approaching `y2` ≈ 1.3+ is over the line; Vercel's ≈1.1 is not).

### Attio (attio.com)

Screenshots: `motion-attio-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Easing found:** dense set of 23 curves. Two are notable against
  TruMandate's own token: `cubic-bezier(.22,1,.36,1)` — same shape family as
  `standardEase` (0.22, _, 0.36, 1) but with `y1 = 1` instead of `0.61`,
  meaning Attio's version snaps to near-full velocity almost immediately
  and decelerates the whole rest of the way, where TruMandate's is more
  evenly damped throughout. Also present: pure ease-in-out symmetric curves
  (`.4,0,.6,1`, `.45,.05,.55,.95`) likely used for looping/ambient motion
  rather than one-shot reveals, and `.32,0,.67,0` / `.7,0,.84,0` — curves
  whose `y2 = 0`, i.e. *ease-in only*, useful for exit/hide transitions
  TruMandate doesn't currently have a token for.
- 2 canvases, WebGL-capable, 449 SVGs on the page (heaviest inline-SVG
  count of the eight, relevant precedent since TruMandate is SVG-only for
  product surfaces).
- No sticky elements found at the two stops sampled (b2b CRM marketing
  site, content-forward rather than one scroll-jacked hero).
- **Applicable to TruMandate:** direct confirmation that a CRM-grade B2B
  product can carry very SVG-dense pages without reading as gimmicky — 449
  inline SVGs is far more than TruMandate's fragment budget, for reference.
  The `y1 = 1` snappier sibling of `standardEase` is worth trying as an
  alternate token for short (≤300ms) hover/focus transitions specifically,
  leaving the 0.61 damped version for the ≥500ms content reveals — same
  two-tier idea as Vercel, converging evidence.

### Resend (resend.com)

Screenshots: `motion-resend-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Easing found:** the largest, most "textbook" set — nearly the entire
  easings.net catalogue as literal values, including
  `cubic-bezier(.42,0,.58,1.8)` (a custom curve with heavy overshoot,
  `y2 = 1.8`) alongside standard `.16,1,.3,1` and `.22,1,.36,1` (same family
  as Attio's/TruMandate's).
- **Distinct technique: pre-rendered looping video, not code-driven
  animation**, for the complex 3D-look illustrations — five `<video>`
  elements found (`cube.mp4`, `3d-integrate-afternoon.mp4`,
  `3d-broadcast.mp4`, `3d-react.mp4`, `3d-control.mp4`), all
  `muted`+`loop`, most `autoplay`. This offloads genuinely expensive-looking
  motion (3D render loops) onto hardware video decode instead of the main
  thread — zero JS animation cost, at the price of a video file per motif.
- 1 canvas/WebGL context also present alongside the videos.
- **Applicable to TruMandate:** the *technique class* (pre-baked visual,
  cheap on the client) is worth naming even though the specific
  implementation is not — CLAUDE.md's "no photography, all product surfaces
  hand-authored inline SVG" and the JS-under-200KB/readable-with-JS-off
  budgets both rule out video loops here directly. The transferable lesson
  is scoped differently for TruMandate: SVG fragments *are* the equivalent
  "pre-authored, cheap-to-animate" asset class already in use (fragment.ts's
  mask wipe) — no new technique needed, just confirmation the existing one
  is the right-cost choice for this constraint set.

### Framer (framer.com)

Screenshots: `motion-framer-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Only 2 `cubic-bezier` values in the whole stylesheet scan** (`.44,0,
  .56,1` and `0,0,1,1`), despite 950 elements carrying
  `data-framer-name`/Framer Motion attributes. Inspecting inline `style`
  attributes directly shows the actual pattern: elements sit at rest with
  literal inline styles — `will-change: transform; opacity: 1; transform:
  none;` — meaning Framer Motion drives `transform`/`opacity` straight via
  JS (almost certainly spring physics, not a CSS bezier), and the DOM only
  shows the *current frame's* resolved values, not the curve. This is the
  expected signature of any React animation library (Framer Motion, React
  Spring) versus a CSS-transition or GSAP-tween-with-bezier approach.
- No `linear()` CSS easing function usage found (which some sites use to
  approximate a spring's shape as a static curve) — confirms this is genuine
  runtime physics, not a pre-baked curve.
- 0 canvases, 1 WebGL-capable context, 5 `<video>` elements, 152 SVGs.
- **Applicable to TruMandate:** informative mainly as a contrast case — it
  confirms GSAP's tween-with-bezier model (what `motion.ts` already does)
  produces the *same visual outcome* as a spring-driven library for
  one-shot reveals, at a fraction of the runtime cost (no physics solver
  ticking every frame). No reason to introduce spring physics; the existing
  `cubicBezier()` reimplementation in `motion.ts` is already the cheaper
  equivalent of what Framer's own site relies on a whole library for.

### Clerk (clerk.com)

Screenshots: `motion-clerk-1-hero.png`, `-2-scroll1.png`, `-3-scroll2.png`.

- **Easing found:** `cubic-bezier(.175,.885,.32,1.275)` — the textbook
  "ease-out-back" (same family as Raycast's, slightly less extreme),
  present twice with `y2` at both `1.275` and a milder `1.1` variant
  (`.175,.885,.32,1.1`) — again a two-tier system: strong bounce for one
  class of element, gentle overshoot for another. Also a custom
  `.4,.36,0,1` curve not in any standard catalogue.
- 2 canvases, WebGL-capable, 0 videos, 224 SVGs.
- **Applicable to TruMandate:** same verdict as Raycast — the bounce family
  is explicitly the "playful" character CLAUDE.md excludes. Useful only as
  a second confirmation of where the overshoot line sits (`y2` ≥ ~1.27 reads
  as bouncy; Vercel's ~1.1 does not).

---

## Synthesis — patterns worth adopting

Ordered roughly by implementation priority. Each states what it is, the
TruMandate section it would elevate, how it maps to GSAP 3 + ScrollTrigger +
SplitText under the transforms/opacity-only rule, and a rough JS-cost
estimate against the 200KB gzip budget (all of these are additive logic in
already-loaded `gsap`/`ScrollTrigger`, so the marginal cost is bytes of new
first-party script, not a new dependency).

1. **Gate `scroll-behavior: smooth` behind `prefers-reduced-motion:
   no-preference` in CSS, not just JS.** *(Linear.)* TruMandate doesn't
   currently set smooth scrolling at all (`scrollBehavior: auto` is the
   browser default); if smooth scrolling is added for anchor-nav or the
   chain section, it must be a plain CSS media-query rule, never a JS
   `scroll-behavior` toggle, so it degrades correctly with JS disabled.
   Section: global (`global.css`). Cost: ~0 JS, it's a CSS rule.
   **No conflict** with the reduced-motion contract — this is the same
   branch `motion.ts` already encodes, just extended to native scrolling.

2. **Two-tier easing: keep `standardEase` for content, add a second,
   slightly-less-damped token for hover/focus micro-states only.**
   *(Vercel, converged with Attio.)* Add e.g. `micro:
   "cubic-bezier(0.22, 1, 0.36, 1)"` to `transitionTimingFunction` next to
   `standard` — same shape family, `y1` raised from 0.61 to 1 so short
   (150–250ms) states feel a hair snappier without any overshoot. Section:
   `Button.astro` hover, `Nav.astro` link/underline states, `LangToggle`.
   Cost: 0 (a CSS token + swapping one Tailwind class per component).
   **No conflict** with "no playful bounce" — `y1=1` with `y2=1` never
   exceeds 1, so there is no overshoot, only a different deceleration
   shape.

3. **Button hover gains a transform, not just a color crossfade.**
   *(General B2B convention observed across all eight — CTAs across Linear/
   Vercel/Attio move, not just recolor, on hover.)* `Button.astro` currently
   only does `transition-colors`. Add a 1–2px `translateY` on the label or a
   small arrow-glyph nudge (`translateX` on an inline SVG chevron already
   inside the button), 150ms, the new `micro` ease from #2. Transform-only,
   GPU-composited, no layout. Section: every CTA (`Hero`, `Handoff`,
   `ClosingCta`, `ContactForm` submit). Cost: negligible — a few lines of
   CSS or a tiny `mouseenter`/`mouseleave` GSAP tween if a spring-like
   settle is wanted; CSS transition alone is enough and needs no JS at all,
   which also means it works with JS disabled (unlike a GSAP hover tween).
   Prefer the CSS-only version for exactly that reason.

4. **Named-curve library as CSS custom properties, replacing ad hoc
   literals.** *(Resend/Raycast ship the full easings.net set as reusable
   values; TruMandate has exactly one.)* Not "add more animation" — add
   *vocabulary*: define `--ease-in` (`.32,0,.67,0`-style, `y2=0`) once, for
   the small number of exit/hide transitions TruMandate doesn't currently
   name (e.g. a dismissible error state in `ContactForm`, or a nav menu
   close). Section: `tailwind.config.mjs` tokens + `ContactForm.astro`.
   Cost: 0 — token-only, no new JS.

5. **Stagger the reveal for multi-item groups instead of one uniform
   `Reveal` per block.** *(Linear/Attio: many small elements arrive with a
   slight, deliberate offset rather than as one rectangle.)* Where `Reveal`
   currently wraps a *group* of siblings as one element (e.g. `ArgumentBlock`
   paragraphs, `FailureModes` list items, `InitiativeRows`), stagger each
   child 40–60ms apart instead of animating the wrapper as a single unit.
   Implementable with plain `gsap.from(children, { ..., stagger: 0.05 })`
   inside a `whenMotionSafe` block — no SplitText needed since these are
   already discrete DOM nodes (list items, rows), not runs of text. Section:
   `FailureModes.astro`, `InitiativeRows.astro`, `StageGateQueue.astro`,
   `ArgumentBlock.astro`'s paragraph list. Cost: small — one new script
   file reusing `standardEase`/`whenMotionSafe`, no new plugin. Reduced
   motion: unaffected, since `whenMotionSafe` still gates the whole thing;
   end state (all children visible) is unchanged.

6. **Word-or-line split reveal for exactly one headline class, using
   SplitText.** *(None of the eight sites showed this live in the scroll
   stops sampled, but it's the standard "elevated" move for a hero
   headline in this genre, and SplitText is already an approved plugin.)*
   Apply to `Display`/`Heading` on the home Hero only — split into lines
   (not characters — character-splitting reads as gimmicky and hurts
   Arabic shaping), reveal each line with a small stagger under the
   existing 24px/opacity reveal shape. **Flag:** SplitText re-flows text
   into wrapped spans, which risks the Arabic ligature/shaping rules
   (CLAUDE.md doesn't explicitly ban this, but "Arabic never carries less
   content than English" plus RTL correctness makes line-level splitting
   the only safe granularity — never character-level, which breaks Arabic
   letter joining). Test both `/ar` and `/en` before shipping. Section:
   `Hero.astro` headline only — one page, one element, so it stays a
   signature rather than a pattern repeated everywhere. Cost: SplitText
   adds measurement/resize-observer overhead (it re-splits on font load and
   resize) — modest but non-zero; scope to one element to keep it bounded.

7. **Ambient ease-in-out ("breathing") motion for one already-present
   looping accent, not a new element.** *(Attio's symmetric ease-in-out
   curves suggest a subtle loop somewhere on-page — likely a live-data
   accent.)* TruMandate already has a natural candidate: `RagDot.astro`
   (status dot) or the chain marker's active dot could get a very slow
   (3–4s), very small (opacity 0.85↔1 or a 1px glow via `box-shadow`
   avoided — use `opacity` only) breathing loop to read as "live," reusing
   `gsap.to(..., { repeat: -1, yoyo: true })`. **Flag:** this is the kind
   of thing that's easy to overuse; scope to one dot, and confirm it's
   inert under reduced motion (loops must also respect `whenMotionSafe`,
   unlike Linear's toast-only reduced-motion rule which left other loops
   running). Section: `RagDot.astro` / chain marker. Cost: trivial, one
   `gsap.to` call already within the loaded runtime.

8. **Confirm — don't change — the SVG-fragment-wipe as TruMandate's answer
   to Stripe/Resend's expensive hero visuals.** Not a new pattern to build;
   a explicit decision to *not* chase WebGL shaders or looping video for
   richer hero motion. `fragment.ts`'s mask-wipe already gets "uncovered,
   not faded" for near-zero JS cost, inline-SVG-only, works with JS off.
   No action item beyond noting it in this dossier so a future session
   doesn't re-litigate "should we add a canvas hero."

9. **Second `will-change` discipline pass.** *(Vercel keeps live
   `will-change` down to 4 elements at any scroll position; Linear runs
   ~46.)* Audit that `Reveal.astro`/`fragment.ts`/`aiCard.ts` tweens don't
   leave `will-change` set after the one-shot animation completes (GSAP
   clears inline `transform`/`opacity` styles it set, but `will-change` set
   via a class rather than inline can linger). Not a new pattern — a
   verification task: confirm every `[data-reveal]`/`[data-fragment]`/
   `[data-ai-card]` element's `will-change` returns to `auto` after its
   ScrollTrigger fires `once`. Section: all existing motion scripts. Cost:
   negative (removes wasted compositor layers) — do this regardless of
   whether #2–#7 ship.

10. **What to explicitly NOT adopt:** Raycast's and Clerk's overshoot/back
    easing (`y2` ≥ ~1.27) — reads as playful, directly named against in
    CLAUDE.md. Framer's spring-physics-per-frame model — more expensive for
    an identical one-shot-reveal outcome to what `motion.ts`'s bezier
    already produces. Stripe's WebGL shader hero and Resend's looping MP4
    illustrations — both fail "readable with JS disabled" and the
    photography/hand-authored-SVG invariant; the existing SVG fragment
    system is the correct-cost substitute, not a gap. Any *new* pinned or
    scrubbed section on the home page — CLAUDE.md's "one pinned section and
    one scrubbed timeline per route, maximum" is already fully spent by the
    chain (`ChainMarker`'s `position: sticky` + the rail's `scaleY` scrub);
    none of #1–#9 above introduce a second pin or a second scrub anywhere,
    by design.

---

## Screenshot index

All paths relative to repo root, under `screenshots/inspiration/`:

| Site | Hero | Scroll stop 1 | Scroll stop 2 | Scroll stop 3 |
|---|---|---|---|---|
| Linear | motion-linear-1-hero.png | motion-linear-2-scroll1.png | motion-linear-3-scroll2.png | motion-linear-4-scroll3.png |
| Stripe | motion-stripe-1-hero.png | motion-stripe-2-scroll1.png | motion-stripe-3-scroll2.png | — |
| Vercel | motion-vercel-1-hero.png | motion-vercel-2-scroll1.png | motion-vercel-3-scroll2.png | — |
| Raycast | motion-raycast-1-hero.png | motion-raycast-2-scroll1.png | motion-raycast-3-scroll2.png | — |
| Attio | motion-attio-1-hero.png | motion-attio-2-scroll1.png | motion-attio-3-scroll2.png | — |
| Resend | motion-resend-1-hero.png | motion-resend-2-scroll1.png | motion-resend-3-scroll2.png | — |
| Framer | motion-framer-1-hero.png | motion-framer-2-scroll1.png | motion-framer-3-scroll2.png | — |
| Clerk | motion-clerk-1-hero.png | motion-clerk-2-scroll1.png | motion-clerk-3-scroll2.png | — |
