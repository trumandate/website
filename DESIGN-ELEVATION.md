# DESIGN-ELEVATION.md — P10 specification

Status: **written spec, awaiting approval. No code changed.**

Inputs: `docs/design-research/motion-study.md`, `docs/design-research/visual-study.md`,
`CLAUDE.md`, `docs/trumandate-site-spec.md` §3/§5/§5A/§6/§7/§8/§9, `BUILD_FLAGS.md`
(P10 entry), `QA-REPORT.md`, and the shipped code under `src/`.

Every prescription below names the file it touches, its end state, its choreography,
and its reduced-motion end state. Nothing here is a mood board.

---

## 1. Design thesis

### 1.1 What is actually wrong

The site is not under-decorated. It is **unlit**. `src/styles/global.css:21` sets one
flat `bg-ink` on `body` and no section overrides it for the entire 8,300px of the home
page. Nothing on any route casts, catches, or occludes light. `KpiCard.astro:103` and
`SuggestionCard.astro:79` are the same recipe — one fill, one 1px stroke — and so is
every other surface. When there is no light model, flatness does not read as restraint.
It reads as unfinished, because restraint requires something visibly held back, and a
page with zero depth has nothing to hold back.

That is the whole diagnosis. It is also why "add more animation" is the wrong fix and
"add a colour" is a worse one.

### 1.2 The register: authority and precision, not playfulness

This page is read by someone in a government strategy office who is deciding whether to
spend procurement effort on a category. Their failure mode is **being marketed at**. Every
consumer-SaaS motion tic — magnetic buttons, card tilt, cursor followers, bounce — is a
tell that a page is selling rather than explaining, and a procurement reader discounts the
claims accordingly. The motion dossier gives us the exact numeric line: Vercel reserves a
bezier `y₂ ≈ 1.05–1.1` for small controls and reads machined; Raycast (`1.56`) and Clerk
(`1.275`) read as toys. **We stay at `y₂ = 1.0` everywhere.** No overshoot at all, at any
scale. The elevation comes from damping and orchestration, not from spring.

What reads as expensive to this reader is evidence of care: consistent optical rhythm,
depth that is *ranked* rather than sprinkled, and motion with mass.

### 1.3 Three decisions that produce everything else

**(a) The page gets one light source — above, slightly behind the reader.**
Once that is decided, every treatment in §3 is a consequence rather than a choice:
the ground carries a luminance gradient (lifted where the eye enters a band, settling into
the seam); raised surfaces catch light on their **top edge** and nowhere else; depth is a
darkening of the ground *around* an object, never a black drop-shadow *under* it (on `ink`
a black shadow is invisible — the visual dossier's finding #9). One source is why it will
read as designed instead of decorated.

**(b) Depth is ranked, and the ranking is the argument.**
Four tiers, and exactly one thing per page reaches tier 4:

| Tier | What | Treatment |
|---|---|---|
| 0 | Page ground | `ink`, or `surface-deep` for the one darker band per page |
| 1 | Ground texture and seams | `grid-draft`, `ground-rise`, `seam-*` — all ≤1.2:1 against their ground |
| 2 | Raised product surfaces | fragments, the objective record: top-edge `highlight` + a deeper ground beneath |
| 3 | Real-DOM cards | `shadow-raised` |
| 4 | **The one focal surface** | `shadow-focal` + `spotlight-accent`. **Always the AI card. Never anything else.** |

Raycast's "one accent, one glow, one place" only reads as intentional because it is
consistent. Spec §4 already gives us a page-by-page repeating structural device to hang it
on — the AI moment, where the site's whole claim ("AI proposes, a person decides, the
record remembers who decided") peaks. Tying the single allowed glow to that one recurring
moment turns a vague instruction into a rule as enforceable as "one fragment per product
page". **This is adopted as a standing rule, §3.6.**

**(c) The one aesthetic risk: the ground becomes a material.**
The subject's own vernacular is the plan — objectives, baselines, gates, a versioned
record. The material of a plan is drafting paper. A 32px hairline grid at ~3.5% white
(Attio's and Clerk's measured idiom, and *far* below any text) makes every hairline rule on
the page read as aligned to something, which is precisely the precision register. It
appears at **two places only — the hero band and the closing CTA** — so it bookends the
page rather than wallpapering it. That restraint is what keeps it from being decoration.

### 1.4 The signature

Not the grid — that is atmosphere. The signature is **the closing CTA**: the dimmed
Command Centre stops being flat rectangles on flat ink and becomes *a board, lit, seen
across a dark room*. Spec §5 built the entire site's information architecture (withholding
every other full view) to make this one moment land, and the visual dossier's critique
finding #3 is blunt that it currently reads as placeholder UI. Fixing it is not polish; it
is protecting the one payoff the whole withholding strategy exists to deliver. That is
where the boldness is spent, and it is spent **statically** — the page still stops moving
before it asks for the demo (PLAN.md §3's decision, preserved).

### 1.5 Typography gets one more move, not a fourth role

Spec §3's three roles stay three. The critique's finding #4 (headings carry no internal
contrast) is answered with two additions that need no new type role:

- **Size-dependent tracking.** Every reference site runs ≈−2% at 48–64px; Palantir pushes
  to −4.25% at 80px. Tracking tightens as size grows. The `display` clamp tops out at 68px,
  so it gets a second, deeper value above the `lg` breakpoint. Latin only (§5).
- **Two-tone within one sentence** (Linear's move): the load-bearing clause in `paper`, the
  rest in `body`, one type size, one sentence. Once per page, no new token.

---

## 2. Token additions

All 22 land in `tailwind.config.mjs`. Every colour is derived from the existing palette —
no new hue is introduced anywhere. Alpha literals are written as `rgba()` (not hex) with a
comment naming the token they derive from, exactly as `hairline` already is.

### 2.1 Colours (3)

```js
colors: {
  // ...existing, unchanged...
  hairline: "rgba(255,255,255,0.10)",        // UNCHANGED — content-level borders, header rule
  "hairline-soft": "rgba(255,255,255,0.06)", // chrome/decoration only: section rules, seam edges
  highlight: "rgba(255,255,255,0.16)",       // the top-edge light catch on a raised surface
  shade: "rgba(2,24,19,0.55)",               // ambient depth layer; = surface-deep #021813 at 55%
}
```

**Why a hairline *scale* rather than a replacement.** Linear runs 5% on chips and 8% on
large frames; Raycast runs 6% on chrome and 20% on content-level surfaces. TruMandate uses
one flat 10% from the header rule to the chain rail. We add either side of it rather than
moving it — and specifically **the header keeps `hairline`**, because that rule carries a
state signal (motion #6, "you have scrolled"), not decoration.

**Why `highlight` is 0.16 and not Linear's 0.05.** Linear's grounds are near-black
(`rgb(8,9,10)`), where 5% white reads strongly. `surface` (#0A3B31) and `jade` (#0B4A3D)
are mid-luminance greens, so the same alpha vanishes. Measured: 0.07 white on `surface`
gives a 1.22:1 line — below threshold on a dim phone. 0.16 gives **1.71:1**, a clear step
above the 0.10 border it sits inside, which is what makes "light from above" legible.
Wave 1 must confirm at 375px on a dimmed display; acceptable range 0.12–0.20.

**AA:** all three are decoration and never carry text.
`hairline-soft` on `ink` measures **1.18:1** and `hairline` measures **1.35:1** — both
below WCAG 1.4.11's 3:1 floor, which is correct and unchanged from today, because neither
is a UI component boundary "required to understand content". `hairline-soft` is therefore
restricted to purely decorative seams and must never become the only boundary of an
interactive control.

### 2.2 Easing (2) — the two-tier system

```js
transitionTimingFunction: {
  standard: "cubic-bezier(0.22, 0.61, 0.36, 1)", // UNCHANGED — all content motion ≥400ms
  micro:    "cubic-bezier(0.22, 1, 0.36, 1)",    // hover/focus/short states ≤300ms
  exit:     "cubic-bezier(0.32, 0, 0.67, 0)",    // ease-IN only (y₂=0): dismiss/hide
}
```

`micro` is Attio's measured `.22,1,.36,1` — the same shape family as `standard` with `y₁`
raised from 0.61 to 1, so short states snap out of rest and decelerate the whole way. **`y`
never exceeds 1, so there is no overshoot** and no conflict with "no playful bounce". This
is the single most reusable idea in the motion dossier (Vercel and Attio converged on it
independently).

`exit` is Attio's `.32,0,.67,0`. TruMandate has exactly one exit transition today (the
contact form's dismissible error summary) and no token for it.

**AA:** not colour-adjacent.

### 2.3 Durations and delay (4)

```js
transitionDuration: {
  micro: "150ms",  // hover transform + colour, paired with ease-micro
  state: "200ms",  // UNCHANGED
  header: "300ms", // UNCHANGED
  card: "500ms", bar: "600ms", reveal: "800ms", wipe: "900ms", counter: "1200ms", // UNCHANGED
  line: "700ms",   // one SplitText line, hero only
  glow: "900ms",   // the AI spotlight's fade-and-settle
},
transitionDelay: {
  stagger: "60ms", // ONE step. Every staggered group on the site uses this, or a stated multiple.
}
```

`stagger` is the canonical spelling of the value; GSAP scripts write `0.06` with a comment
naming the token, exactly as `reveal.ts` already writes `0.8 // transitionDuration.reveal`.
Multi-item groups longer than 8 children halve it to 0.03 (the dossier's own limit — beyond
~8 children a 60ms step reads laggy).

### 2.4 Typography (2)

```js
letterSpacing: {
  display: "-0.02em",       // UNCHANGED — the small end of the clamp
  "display-lg": "-0.028em", // Latin only, applied above `lg` via lg:tracking-display-lg
  // ...existing...
},
translate: {
  reveal: "24px", card: "16px", // UNCHANGED
  stagger: "12px",              // per-child offset in a staggered group; deliberately < reveal's 24px
}
```

**AA:** neither affects contrast.
**RTL:** `display-lg` is Latin-only by construction — see §5.1, which also fixes a live
defect this change would otherwise make worse.

### 2.5 Elevation (3)

Declared with Tailwind's function form — `boxShadow: ({ theme }) => ({ ... })` — so
`theme()` resolves and `highlight` / `shade` each have exactly one spelling:

```js
boxShadow: ({ theme }) => ({
  // Real-DOM surfaces only. On `ink` a black drop-shadow is invisible; the inset
  // top highlight is what actually reads as raised (visual dossier #9).
  raised:
    "inset 0 1px 0 0 theme(colors.highlight), 0 2px 4px -1px theme(colors.shade), 0 10px 24px -8px theme(colors.shade)",
  // Tier 4. The distinction is the ACCENT ring, not a brighter white — the focal
  // surface is marked in the one accent hue, consistent with the one-glow rule.
  focal:
    "inset 0 1px 0 0 theme(colors.highlight), 0 0 0 1px rgba(25,195,155,0.14), 0 2px 4px -1px theme(colors.shade), 0 14px 32px -10px theme(colors.shade)",
  // Header, scrolled state only — separates chrome from content by light, not just a line.
  chrome: `0 10px 28px -18px ${theme("colors.shade")}`,
})
```

(The three values above are written with `theme("colors.highlight")` /
`theme("colors.shade")` template interpolation throughout; they are spelled inline here
only for readability.)

`rgba(25,195,155,0.14)` is `accent` #19C39B at 14%.

**AA:** shadows sit outside or behind text and only darken the ground *around* a card,
which can only raise that card's separation from what is behind it. No verified token pair
changes. **The two zero-headroom pairs QA-REPORT §4 flagged — `accent` on `jade` (4.52:1)
and `muted` on `jade` (4.79:1) — are inside the AI card, on an opaque `bg-jade` fill, and
are not touched by any shadow or glow layer.** That is a hard constraint on §3.6.

**SVG fragments do not get a box-shadow and do not get an SVG filter.** See §4.2.

### 2.6 Background layers (7)

Defined with Tailwind's function form so `ink` has one spelling:
`backgroundImage: ({ theme }) => ({ ... })`.

```js
// Ground material — hero band and closing CTA ONLY.
"grid-draft":
  "repeating-linear-gradient(to right,  rgba(255,255,255,0.035) 0 1px, transparent 1px 32px)," +
  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0 1px, transparent 1px 32px)",

// Ground luminance — lifts where the eye enters a band, settles by 78%.
"ground-rise":
  "linear-gradient(to bottom, rgba(15,92,75,0.18) 0%, rgba(15,92,75,0.05) 42%, transparent 78%)",

// The board's own light, closing CTA only. Ground hue, never accent.
"ground-board":
  "radial-gradient(70% 55% at 50% 40%, rgba(15,92,75,0.28) 0%, transparent 70%)",

// Section seams — a 128px blend band, never a 1px cut.
"seam-down": `linear-gradient(to bottom, ${theme("colors.ink")} 0%, ${theme("colors.surface-deep")} 100%)`,
"seam-up":   `linear-gradient(to bottom, ${theme("colors.surface-deep")} 0%, ${theme("colors.ink")} 100%)`,

// THE ONE GLOW. AI card only, on a wrapper BEHIND the opaque card.
"spotlight-accent":
  "radial-gradient(58% 58% at 50% 38%, rgba(25,195,155,0.13) 0%, rgba(25,195,155,0.05) 38%, transparent 72%)",

// Four-edge vignette for the dimmed composition — replaces the hard inline crop.
"vignette-ink":
  `radial-gradient(72% 62% at 50% 46%, transparent 30%, rgba(4,36,30,0.55) 68%, ${theme("colors.ink")} 100%)`,
```

`rgba(15,92,75,…)` is `jade-lift`; `rgba(4,36,30,…)` is `ink`; `rgba(25,195,155,…)` is
`accent`. Every value is a token at a stated alpha.

**AA, measured (WCAG relative-luminance, computed not eyeballed):**

| Layer | Ground it produces | `paper` | `body` | `muted` | `accent` | Verdict |
|---|---|---|---|---|---|---|
| none (today, `ink`) | #04241E | 15.00:1 | 11.29:1 | 7.76:1 | 7.29:1 | baseline |
| `grid-draft` line | (13,44,38) | — | — | — | — | line-vs-ground **1.10:1**, under the ~5% ceiling Attio/Clerk measure at |
| `ground-rise` at full strength | (6,46,38) | 13.38:1 | 10.07:1 | 6.92:1 | 6.50:1 | **all PASS AA-normal**, worst case 6.50:1 |
| `spotlight-accent` at centre | (7,57,46) | 11.61:1 | **8.75:1** | 6.01:1 | 5.65:1 | **all PASS**, so even a full-overlap bleed onto the adjacent prose column is safe |
| `surface-deep` band (§3.9) | #021813 | 16.72:1 | 12.59:1 | 8.65:1 | 8.13:1 | **improves every pair** |

Two consequences worth stating because they are load-bearing:

1. The hero wash costs ~11% of contrast headroom on every hero text pair and all four still
   clear AA-normal with ≥6.50:1. That is the price, and it is affordable.
2. Moving the chain onto `surface-deep` (§3.9) **gives `opacity.rest` real headroom for the
   first time.** Chain-link body copy at 0.57 measures **4.51:1 on `ink`** (QA-REPORT §4's
   razor-thin figure, the reason `opacity.rest` was raised at the P9 gate) and **4.77:1 on
   `surface-deep`**. `text-paper` goes 5.68:1 → 6.01:1. The ground change is not a risk to
   the site's tightest accessibility decision; it is the first thing to relieve it.

**`vignette-ink` and AA:** the vignette darkens the ground *under* the closing CTA's
`paper`/`body` text toward pure `ink`, which raises contrast toward the already-verified
`paper`-on-`ink` pair. It can only improve. Verified empirically in wave 1 regardless.

### 2.7 Blur (1)

```js
backdropBlur: { veil: "10px" }, // pairs with the existing opacity.veil (0.72)
```

**AA:** blurring busy content behind a translucent header can only reduce, never increase,
its interference with header text. Spec §10 names Safari as the divergence risk;
`backdrop-filter` is a static filter with no reduced-motion interaction, but it must be
confirmed in the WebKit pass (wave 3) and it carries a per-frame compositing cost — see
§6.4's abort condition.

**Token count: 22.** No new dependency. No hex outside `tailwind.config.mjs`.

---

## 3. Home page prescriptions

Format per item: **End state** (what a JS-disabled or reduced-motion reader sees, which is
also what CSS unconditionally renders) → **Choreography** (what GSAP animates *from*) →
**Reduced motion** (restated explicitly, because CLAUDE.md requires it to be a real branch).

Standing rules for the whole phase:
- Every CSS-driven motion added here is gated with Tailwind's stock **`motion-safe:`**
  variant. That is the CSS half of the reduced-motion branch, it needs no custom media
  query, and it is greppable.
- Every GSAP timeline goes through `whenMotionSafe()` (`src/scripts/motion.ts`). Unchanged.
- Transforms and opacity only. Static `background-image` / `box-shadow` / `mask-image` are
  paint, not motion, and are never animated.
- **No second pin and no second scrub anywhere.** The chain's CSS `sticky` + rail `scaleY`
  remain the home page's entire allowance.

### 3.1 Ground, texture and seams (global mechanism)

**Files:** `tailwind.config.mjs`, `src/components/layout/Section.astro`, new
`src/components/layout/GroundTexture.astro`, `src/pages/{en,ar}/index.astro`.

`Section.astro` is already the only component that owns rhythm, so it is the right home for
ground. It gains three optional props and stays one shared component:

```ts
ground?: "ink" | "deep";        // default "ink" — body ground shows through, no class emitted
seam?: "none" | "down" | "up";  // a 128px blend band at the section's block-start
texture?: boolean;              // the drafting grid. Home hero + closing CTA only.
```

When any of the three is set, the section renders an `aria-hidden pointer-events-none
absolute inset-0` backdrop stack and its content wrapper becomes `relative z-10`, with the
backdrop at `z-0`. **Not `-z-10`:** a negative z-index inside a positioned parent still
paints inside that parent's stacking context and reliably produces a hard-to-debug
occlusion bug against the fixed header (`z-header: 50`). This is spelled out because it is
the classic failure of this pattern.

`GroundTexture.astro` renders the grid with a block-axis `mask-image` fade so the texture
dissolves rather than hard-cutting at the band edge. It is one component with two call
sites (hero, closing CTA), per BUILD_FLAGS' "keep one shared component".

**End state:** static paint, present unconditionally, identical with JS off.
**Choreography:** none. Nothing here ever animates.
**Reduced motion:** identical — there is no timeline to suppress.

### 3.2 Header

**File:** `src/components/layout/Header.astro` (line 39 and the scoped `<style>`).

**End state.** `bg-ink/veil` gains `backdrop-blur-veil`. The `::after` hairline is
unchanged at `theme("colors.hairline")`. `[data-header].is-scrolled` additionally gets
`box-shadow: theme("boxShadow.chrome")`, transitioned on the same `duration-header`
`ease-standard` pair the opacity already uses — so the header separates from the content by
light *and* a line, not a line alone.

**Choreography.** Unchanged. `header.ts` still toggles one class at 12px of scroll; the
transition is CSS.

**Reduced motion.** Unchanged and already correct: `header.ts` forces `is-scrolled` on
permanently, so the end state (rule + shadow visible) is what a reduced-motion reader gets.
The blur is static and unaffected.

### 3.3 Hero — the orchestrated arrival

**Files:** `src/components/home/Hero.astro`, `src/components/home/ObjectiveRecord.astro`,
new `src/scripts/hero.ts`, `src/i18n/ui.ts`.

**End state.**
- The hero `<Section>` carries `texture` + `ground="ink"` with `ground-rise` on the
  backdrop stack: drafting grid at 32px, jade-lift wash lifting the top of the page and
  settling by 78% of the band. The existing hairline `Spine` now reads as *aligned to the
  grid*, which is the entire point of the grid.
- `Display.astro` gains `lg:tracking-display-lg` (−0.028em above 1024px, where the clamp
  puts the headline at 53–68px). Latin only — see §5.1.
- The lede becomes two-tone: `home.hero.lede` splits into `home.hero.ledeLead` (the
  load-bearing clause, `text-paper`) and `home.hero.ledeRest` (`text-body`), joined by a
  space inside one `<Lede>`. **This is a markup/wiring change, not a copy change** — the
  same restructuring precedent BUILD_FLAGS' P9b entry set for `footer.company`, and it
  carries the same obligation: every English and Arabic string verified byte-identical
  through the move before the change lands. The Arabic split is made **at the equivalent
  clause by meaning**, not at the same word index.
- `ObjectiveRecord`'s rows keep their existing markup; the row `<div>`s become the stagger
  targets.
- Buttons: see §3.8.

**Choreography.** The hero is above the fold, so this is a load sequence, not a scroll
trigger. One new timeline in `hero.ts`, which registers SplitText itself rather than adding
it to the shared `motion.ts` chunk (that chunk is imported by six scripts across every
route including `/contact`, and SplitText has no business on any of them).

| t (s) | Element | From | Duration | Ease |
|---|---|---|---|---|
| 0.00 | Eyebrow | `opacity 0, y 8` | 0.40 | `standard` |
| 0.08 | Headline **lines** | `yPercent 100, opacity 0` inside a mask | 0.70 (`line`) | `standard`, **stagger 0.07** |
| +0.12 after last line | Lede | `opacity 0, y 16` | 0.60 | `standard` |
| −0.35 overlap | CTA row | `opacity 0, y 12` | 0.50 | `standard`, stagger 0.06 |
| own trigger `top 85%` | ObjectiveRecord rows | `opacity 0, y 12` (`translate.stagger`) | 0.50 | `standard`, stagger 0.05 |

SplitText config: **`type: "lines"`, `mask: "lines"`, `autoSplit: true`.** `mask` produces
the overflow wrapper (so the reveal is a pure `translateY` behind a static clip — a
transform, not an animated `clip-path`), and `autoSplit` handles the re-split on font load
and resize that would otherwise need hand-written boilerplate. Both options are present in
the installed `gsap@3.15.0` (`node_modules/gsap/dist/SplitText.min.js` — verified: `mask`,
`autoSplit`, `aria-hidden` all present; SplitText has shipped free with the core package
since 3.13, so **this adds no dependency**, ~7.7 KB minified / ~3 KB gzipped against the
JS budget's large headroom). Per CLAUDE.md, confirm the exact 3.15 `SplitText.create()` /
`onSplit` signature via **context7** at implementation time rather than from recall.

**Line-level only, never words or characters.** Character splitting destroys Arabic letter
joining outright; word splitting fragments bidi runs for no gain. This is non-negotiable
and is restated in §5.

**LCP protection.** The h1 is the LCP element and today measures 136 ms / 385 ms throttled.
`motion.ts` already defers all setup by one `requestAnimationFrame`, so the browser paints
the headline at full opacity — emitting the LCP entry — *before* SplitText runs. An LCP
entry is not retracted when the element is later animated. The residual risk is a visible
one-frame flash of the finished headline on a slow device; every existing reveal on the
page has the identical characteristic and none has been reported. **Both are wave-1 gates
with stated aborts (§6.4).**

**Reduced motion.** `whenMotionSafe` never runs `setup`, so SplitText never runs at all:
the h1 stays a single unsplit text node at `opacity 1`, the lede/CTAs/rows stay at their
served CSS end state, the grid and wash are static paint. Identical with JS disabled.

### 3.4 Failure modes — the stagger, and a rule that draws

**File:** `src/components/home/FailureModes.astro`, `src/components/ui/Rule.astro`,
`src/scripts/reveal.ts`.

**End state.** Unchanged markup and copy. The single `<Reveal>` wrapping the whole section
splits into two: the intro (eyebrow + h2) keeps the standard reveal; the three mode blocks
become a staggered group via a new `data-reveal-group` hook that `reveal.ts` handles
alongside `data-reveal`. Each `<Rule>` gets a `transform-origin` pinned to the inline-start
edge, using the `:global([dir="rtl"])` scoped-style pattern already established in
`SuggestionCard.astro`.

**Choreography.** One trigger at `top 85%`, once:
- the three blocks: `opacity 0, y 12` → end, 0.50s, `standard`, **stagger 0.06**
- each block's `<Rule>`: `scaleX 0` → 1, 0.50s, `standard`, same stagger step

The rules drawing is not ornament: this section's own argument is *the chain does not exist
yet* (which is why its spine is dashed and node-less), so three short rules drawing
independently and stopping is the section stating its own subject.

**Reduced motion.** No timeline. Three blocks visible, three rules at `scaleX(1)` — which
is the served CSS, untouched.

### 3.5 Chain — refined, not rebuilt

**Files:** `src/scripts/chain.ts`, `src/components/chain/ChainLink.astro`,
`src/components/home/Spine.astro`, `src/components/chain/ChainMarker.astro`.

**The pin and the scrub are unchanged.** `ChainMarker`'s CSS `sticky` stays; the rail's
`scaleY` scrub stays; `chain.ts`'s per-node independent one-shot triggers stay. Four
refinements, none of which adds a trigger, a pin, or a scrub.

**(a) The rail carries its own light — zero new animation.**
`Spine.astro`'s `filled` variant changes from a flat `bg-accent` to a vertical gradient:
`accent` at 35% for the first 82%, ramping to full `accent` at 100%. Because the element is
scaled with `scaleY` from `origin-top`, its painted content scales with it — so the bright
stop is *always* at the rail's currently-drawn end. The drawn portion reads as recorded and
settled; the head reads as live. This costs one `background-image` token and no JS at all.
It is the highest ratio of read-improvement to cost in the whole document.

**(b) The dot's activation stops jumping, and seats.**
`chain.ts:95-96` currently swaps `["bg-accent","ring-2","ring-accent"]` for
`["bg-jade","ring-1","ring-muted"]` under a `transition-colors` — but `ring-1`↔`ring-2` is
a *width* change, which `transition-colors` does not animate, so the dot visibly snaps.
Fix: hold the ring width at 2 in both states and swap colour only, so the declared
transition is honest. Then add a one-shot seat on activation: `scale 1 → 1.15 → 1`, 0.32s,
`standard`. Transform only, no layout.

**(c) The caption arrives instead of brightening.**
`[data-chain-copy]` currently goes `opacity-rest` → 1 over `duration-state` (200 ms).
Add a 6 px block-axis translate and lengthen to 0.40 s with `standard`, applied
imperatively in JS exactly as the opacity already is — so the served state stays the end
state. `opacity.rest` stays **0.57**; the P9-gate value is not touched (and §3.9's ground
change gives it headroom for the first time — §2.6).

**(d) The marker's text stops glitching.**
`chain.ts`'s `onUpdate` mutates `textContent` with no transition, which reads as a glitch —
the only text on the site that mutates. On change: set opacity 0.35, tween to 1 over
0.20 s with `micro`.

**Reduced motion.** No timeline is created, so: rail at `scaleY(1)` with its gradient fully
painted (bright head at the bottom of the fully-drawn rail — correct), every dot accent
with an accent ring at `scale(1)`, every caption at full opacity and zero translate, the
marker showing its served `01 / 05 · Objective`. Exactly today's behaviour, verified in
QA-REPORT §4.

### 3.6 The AI moment — the one glow

**Files:** `src/components/ai/SuggestionCard.astro`, `src/scripts/aiCard.ts`,
`src/pages/{en,ar}/index.astro`.

**Standing rule, adopted:** *exactly one glow per page, and it is always the AI card.* It
never appears on the hero, a section ground, the chain, or a fragment. If a future page has
no AI moment (`/contact`, per spec §4), it has no glow.

**End state.**
- A new `relative` wrapper around `SuggestionCard`. Inside it, first child, an
  `aria-hidden pointer-events-none absolute -inset-12 z-0` layer carrying
  `bg-spotlight-accent`. The card itself becomes `relative z-10`.
- **The glow layer is strictly behind an opaque card and never inside it.** This is the
  binding AA constraint: the card's own `accent`-on-`jade` (4.52:1) and `muted`-on-`jade`
  (4.79:1) pairs have *zero* headroom per QA-REPORT §4 and would fail if any tint reached
  them. `bg-jade` is fully opaque, so it does not.
- The card gains `shadow-focal`, keeping its existing `border-s-marker border-s-accent`
  marker edge and its three hairline edges. The tier-4 distinction is the accent ring
  inside `shadow-focal`, not a brighter white border — the focal surface is marked in the
  one accent hue.
- Worst-case bleed: even if the glow's falloff fully overlaps the adjacent prose column
  (48 px inset against a 20–72 px `gap-gutter`), `text-body` on the tinted ground measures
  **8.75:1** (§2.6). Safe by measurement, not by hope.

**Choreography.** Extends `aiCard.ts`'s existing timeline on its existing trigger — no new
ScrollTrigger. The order is spec §4's own three-part pattern, animated:

| Position | Element | From | Duration | Ease |
|---|---|---|---|---|
| 0.00 | glow layer | `opacity 0, scale 0.94` | 0.90 (`glow`) | `standard` |
| 0.05 | card | `y 16, opacity 0` | 0.50 (`card`) | `standard` — *existing* |
| `>-0.1` | confidence bar | `scaleX 0` | 0.60 (`bar`) | `standard` — *existing* |
| `-=0.2` | Accept/Modify/Reject | `opacity 0, y 6` | 0.26 | `standard`, stagger 0.05 |

The gate arriving last **is** the argument: signal, then evidence, then the decision you
are left with. That sequencing is why this is a choreography and not three fades.

**Reduced motion.** No timeline: glow at `opacity 1, scale 1` (CSS default), card at its
served `.reveal` end state, bar at its served `scaleX(1)` and full CSS width, three buttons
visible. Identical with JS disabled.

### 3.7 Closing CTA — the highest-stakes item

**Files:** `src/components/home/ClosingCta.astro`,
`src/components/fragments/CommandCentreDim.astro`.

Critique finding #3, verbatim: this is *"the single clearest 'looks like placeholder UI,
not a dimmed real product' moment on the site"*, and it is the moment the entire withholding
strategy exists to deliver. Four changes, **all static**.

**(a) The board gets a body.** Today the composition's rects float directly on `ink`, with
no board beneath them — which is the largest single reason it reads as placeholder. Add one
`fill-jade` rect across the full 1600×640 viewBox, behind everything, inside the existing
`opacity-dim` group. At 25% over `ink` it composites to ≈(6,46,38) — a surface that is
*legible as a shape and carries no data*, which is exactly spec §5's requirement. Verified:
`paper` on that ground is **13.4:1**, `body` is **10.1:1**; the CTA copy is unaffected.

**(b) The board catches light.** Each metric card, the initiative table, the AI panel and
the benefit strip gets a 1 px `fill-highlight` rect inset along its top edge. **No new
geometry that reads as information** — no rows, no labels, no values. Nine rects.

**(c) A real four-edge vignette.** The existing block-axis `mask-image` on
`.command-centre-dim` stays (it works). Above the SVG, add an `aria-hidden
pointer-events-none absolute inset-0` layer carrying `bg-vignette-ink` — transparent to
30%, `ink` at 100%. The composition now dissolves into the page ground on all four edges
instead of stopping at a straight line. Behind the SVG, `bg-ground-board` gives the board
its room light.

**On "banned: glow blobs" (spec §3).** `ground-board` is a ground-hue luminance wash at
≤28% of `jade-lift`, behind an `aria-hidden` decorative composition, at the one place the
site is permitted to imply scale. It is not an accent orb and it is not decoration for its
own sake — it is the mechanism that converts nine grey rectangles into a dimmed screen. The
alpha ceiling of 0.28 is a hard limit and is a wave-1 verification item.

**(d) RTL is free.** The board ground and the highlight rects live *inside* the SVG, so
they mirror with the existing `:global([dir="rtl"]) .command-centre-dim svg { scaleX(-1) }`.
The vignette and the room light live on the **wrapper**, outside the flip, exactly as the
existing block-axis mask already does.

**Choreography: none, deliberately.** PLAN.md §3's decision that the page stops moving
before it asks for the demo is preserved unchanged. The existing `<Reveal>` on the CTA text
block is the only motion in this section and stays as it is. `ClosingCta.astro` still ships
no script tag.

**Reduced motion.** Everything above is static paint; identical in every branch.

### 3.8 Buttons, nav and controls

**Files:** `src/components/ui/Button.astro`, `src/components/layout/Nav.astro`,
`src/components/layout/LangToggle.astro`.

**End state.** `Button.astro`'s `transition-colors duration-state ease-standard` becomes
`transition duration-micro ease-micro` (Tailwind's default `transition` property set
already covers colour, border, outline, box-shadow and transform). Hover adds
`motion-safe:hover:-translate-y-px`, with `motion-safe:active:translate-y-0` so pressing
seats it. The existing colour inversion is unchanged.

`-translate-y-px` is a **block-axis** transform. CLAUDE.md's physical-direction ban is an
inline-axis rule (`ml-`, `pr-`, `text-left`), and spec §8 is explicit that vertical motion
does not mirror — the same argument `Spine.astro` already makes for `origin-top`.

Nav links and `LangToggle` gain a 1 px `::after` underline at `scaleX(0)` → `scaleX(1)` on
hover and focus-visible, 150 ms, `micro`, with `transform-origin` at the inline-start edge
and a `:global([dir="rtl"])` mirror (§5.3).

**This is CSS-only and therefore works with JavaScript disabled** — which is the reason to
prefer it over a GSAP hover tween, per the motion dossier's own recommendation.

**Reduced motion.** The `motion-safe:` variant compiles to
`@media (prefers-reduced-motion: no-preference)`, so under `reduce` the transform simply
does not exist in the cascade. Colour states still change (a colour state is information,
not motion). The underline's `scaleX` is likewise `motion-safe:`-gated, and its rest state
under `reduce` is `scaleX(1)` on hover with no transition — visible, instant, correct.

### 3.9 Section seams and the one ground change

The critique's finding #1 is that the background never changes across 8,300 px, where every
reference site changes it at least once per screen height. The answer is **one ground
change per page, and its direction encodes the argument** — not a decorative stripe at
every boundary.

Home:

| Section | `ground` | `seam` | `texture` |
|---|---|---|---|
| Hero | `ink` (+ `ground-rise`) | — | ✅ |
| Failure modes | `deep` | `down` | — |
| Chain | `deep` | — | — |
| AI moment | `ink` | `up` | — |
| Closing CTA (bleed) | `ink` (+ `ground-board`) | — | ✅ |

The page lifts where the reader enters, **darkens as the failure is described and the chain
is traced through it**, and returns to `ink` and light for the AI moment and the lit board.
Two seams, both 128 px `linear-gradient` bands, both purely vertical. The grid bookends the
whole thing.

Every text pair on the darkened band improves (§2.6), including the site's tightest
accessibility decision, `opacity.rest`.

---

## 4. Product pages and contact

**The three product pages must stay one skeleton.** Every treatment below lands in
`ProductPage.astro`, `ArgumentBlock.astro`, `Handoff.astro` or the shared fragment recipe —
never in an individual page file. `/strategy`, `/execution` and `/benefits` continue to
supply nothing but a copy object and one fragment.

### 4.1 Ground, applied to the four-part skeleton

| Skeleton part | `ground` | `seam` |
|---|---|---|
| 1+2. Question + argument | `ink` (+ `ground-rise`) | — |
| 3. The fragment | `deep` | `down` |
| 4. The AI moment | `ink` | `up` |
| 5. The handoff | `ink` | — |

No `texture` on these routes: the drafting grid is the home page's bookend device, and
repeating it everywhere spends it. The fragment sitting on the deeper band is the single
biggest visual upgrade to these pages — `surface` (#0A3B31) against `ink` is a 1.33:1 step
and against `surface-deep` it is **1.48:1**, so the card genuinely separates from its
ground for the first time.

Contact: form section on `ink`; the sovereignty band on a `seam-up` band. **No glow** —
spec §4 puts no AI on `/contact`, and the one-glow rule is tied to the AI moment, so the
absence is the rule working, not a gap.

### 4.2 Fragment card elevation — highlight only, no filter, no box-shadow

Applies identically to `KpiCard.astro`, `InitiativeRows.astro`, `BenefitCurve.astro` and
`StageGateQueue.astro`, in both their LTR and hand-mirrored RTL geometries.

For each card `<rect>`, add **one** sibling immediately after it:

```html
<rect x={cardX + 1} y={cardY + 1} width={cardW - 2} height="1" class="fill-highlight" />
```

That is the entire recipe. Existing `fill-surface stroke-hairline` is untouched.

**Why not an SVG `<filter>`/`feDropShadow`, and why not a CSS `box-shadow`:**
1. The visual dossier's own finding #9 says a dark drop-shadow is *nearly invisible* on
   `ink` — on a dark ground the top-edge light catch is what actually carries elevation. The
   shadow would be paying full cost for the half of the recipe that does not read.
2. Every fragment crops via its authored `viewBox` (BUILD_FLAGS P6: the KPI card runs to
   x=620 against a 460 viewBox). A filter region is clipped by the SVG viewport, so a
   filtered shadow would be cut at the deliberate crop edge — a class of bug this recipe
   simply does not have.
3. A `box-shadow` on the wrapping DOM element would shadow the *fragment's box*, not the
   card inside it, which is the wrong object.

`shadow-raised` is therefore reserved for **real-DOM** surfaces only: `SuggestionCard` (as
`shadow-focal`) and the contact form's status region.

### 4.3 Argument prose — three moves, one skeleton

`ArgumentBlock.astro` today renders 3–4 identical `<p>` inside the section's single
`<Reveal>`, at `max-w-measure` with the entire inline-end half of a 1440 viewport empty
(visible in `screenshots/p6-strategy-1440.png`). That void is not a hole to fill; it is a
rhythm change that nothing acknowledges.

**(a) Acknowledge the column change.** A full-width `hairline-soft` rule spanning the
content column between the `<h1>` and the first paragraph. One element. It makes the narrow
prose read as a deliberate column under a wide header rather than as text that failed to
fill its space.

**(b) The first paragraph takes the `lede` step in `text-paper`;** paragraphs 2–n stay at
`body`/`text-body`. This is critique finding #4's fix applied where the site has the most
text, using an existing size step and existing colour tokens — a second move *within* one
type role, exactly as Linear and Stripe do, with no fourth role invented.

**(c) Stagger.** The eyebrow + h1 keep the standard reveal; the paragraphs become a
`data-reveal-group` staggered at **0.08 s** per child (longer than the 0.06 default because
these are long blocks and the reader dwells), `opacity 0, y 12`, 0.50 s, `standard`, one
trigger at `top 85%`, once.

**Reduced motion:** all paragraphs visible at full opacity, rule present, first paragraph
at its larger size. Nothing is hidden by default in any branch.

### 4.4 The handoff moment

`Handoff.astro` today is a `Lede` and a button floating in an otherwise empty section — the
page's closing ask, carrying no emphasis whatsoever.

**End state.** It adopts the shape `SovereigntyBand.astro` already uses on `/contact`:
`border-t border-hairline pt-8`. The sentence moves from `text-body` to **`text-paper`** —
it is the one sentence on the page that names the withheld item, and it should be the
brightest thing in its section. The CTA follows. No card, no box: cards are for product
surfaces, and reusing a shape that already exists on the site is consistency rather than
invention. It also makes `/contact` and the three product pages rhyme, which they currently
do not.

**Choreography.** Existing `<Reveal>` stays; sentence → button stagger at 0.06.
**Reduced motion.** Both visible, rule present.

### 4.5 Contact

- `ContactForm.astro`'s status region (`role="alert"`, `bg-jade`, hairline + accent marker
  edge) gains `shadow-raised` — it is a real-DOM card and it is the one surface on the page
  that appears in direct response to the reader's own action.
- Its dismissal/replacement transition adopts **`ease-exit`** (the first real use of that
  token — the site has had an exit transition and no name for it since P7).
- `FormField.astro` inputs: `transition` + `duration-micro` + `ease-micro` on their border
  and outline states. The `aria-invalid:border-red` state and the `:focus-visible` accent
  outline are unchanged — both are information, not motion, and neither is gated.
- `SovereigntyBand.astro`: its `border-t border-hairline` becomes a `highlight` top edge, so
  the band reads as a raised credential rather than a stray paragraph. The Intertec mark and
  its `aria-label` are untouched.
- Submit button inherits §3.8.

### 4.6 The curiosity ledger — explicitly preserved

Stated as a hard implementation rule, and re-verified in wave 3:

- **No new product surface anywhere.** The home page stays at exactly two
  (`StageGateQueue`, `CommandCentreDim`); each product page stays at exactly one.
- The AI card is not a fragment and does not become one. Its glow adds light, not data.
- `CommandCentreDim` gains a ground rect and nine 1 px highlight rects. **It gains no rows,
  no labels, no values, and no `<text>` — nothing that reads as information.** It stays
  `aria-hidden`, single-hue, at `opacity-dim`.
- The vignette and the board light *reduce* what is legible at the composition's edges.
  They move the ledger in the right direction, never the wrong one.
- Every fragment's crop stays exactly where it is; the highlight rect is inset *within* the
  card and cannot extend a crop.
- Grep in wave 3: `grep -c data-fragment` per built route — 1 per product page, 1 on home,
  both languages, unchanged from QA-REPORT §5.

---

## 5. RTL and Arabic

Arabic carries no less than English. Exactly one item in this phase is Latin-only, and it
is a typographic correction rather than content.

### 5.1 A live defect this phase must fix first

Spec §3 requires display tracking of **−0.02em Latin, 0 Arabic**. `global.css:38-41` sets
`letter-spacing: 0` on `[dir="rtl"]` — but that is on `<html>`, and it only reaches
descendants by **inheritance**. `Display.astro`, `Heading.astro` and `Header.astro` each
apply a direct `tracking-display` / `tracking-heading` / `tracking-brand` utility on the
element itself, which overrides inheritance outright. **Arabic h1/h2/h3 and the wordmark
are currently rendering with Latin negative tracking, contrary to spec §3.**

(The two mono roles are unaffected: `[dir="rtl"] .text-eyebrow` / `.text-datum` are
attribute+class selectors at specificity 0,2,0, which beat the 0,1,0 `tracking-*` utility.
Only the heading roles have no such counterpart.)

Add to `global.css`, in the same `@layer base` block:

```css
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] .font-display {
  letter-spacing: theme("letterSpacing.none");
}
```

This must land **in the same change as** `lg:tracking-display-lg`, because deepening Latin
tracking without it would make the existing Arabic defect worse.

### 5.2 Per-technique RTL table

| Technique | RTL treatment |
|---|---|
| `grid-draft` | **None.** A repeating pattern has no inherent inline direction; it tiles identically either way. |
| `ground-rise`, `seam-down`, `seam-up` | **None.** Block-axis gradients with no inline component. |
| `ground-board`, `spotlight-accent`, `vignette-ink` | **None by construction.** All three are centred radials (`at 50% …`). This is deliberately *not* Raycast's asymmetric diagonal beam, which would need a hand-authored mirror; centring avoids that cost entirely. |
| `shadow-raised` / `focal` / `chrome` | **None.** Every offset is block-axis or symmetric; no `dx` anywhere. |
| SplitText hero headline | **Lines only — never words, never characters.** Character splitting breaks Arabic letter joining; word splitting fragments bidi runs. `autoSplit` re-splits after font load, which matters more in Arabic than Latin because shaping changes where lines break. Verify the split wrappers inherit `dir` from `<html>` and that SplitText's own `aria-hidden` + container `aria-label` leave the accessible name intact in both languages. |
| `lg:tracking-display-lg` | **Latin only**, enforced by §5.1's override. |
| Two-tone lede split | Colour split, no positional component — but the Arabic split is made **at the equivalent clause by meaning**, never at the same word index. Both strings verified byte-identical through the restructuring. |
| Button `-translate-y-px` | **Does not mirror.** Block-axis; spec §8: "Horizontal motion mirrors under RTL. Vertical motion does not." |
| Nav / LangToggle underline `scaleX` | **Mirrors.** `transform-origin` flipped via `:global([dir="rtl"]) .selector { transform-origin: 100% 50% }`, the pattern `SuggestionCard.astro` established at P5 — never a physical `origin-*` utility. |
| `FailureModes` rule `scaleX` draw | **Mirrors.** Same origin-flip pattern. |
| Chain rail gradient | **None.** Block-axis. |
| Chain dot `scale` seat | **None.** Uniform scale. |
| Fragment `fill-highlight` rects | **Mirror with the fragment's own geometry.** Each fragment already authors a hand-mirrored RTL branch (`460 − x` / `360 − x` coordinate flips); the highlight rect's `x` is computed from those same mirrored coordinates, not from the LTR ones. |
| `CommandCentreDim` board ground + highlights | **Free.** Both live inside the SVG, so the existing `:global([dir="rtl"]) … svg { scaleX(-1) }` carries them. The vignette and room light stay on the **wrapper**, outside the flip — same placement rule the existing block-axis mask already follows. |
| `backdrop-blur-veil` | **None.** |
| Staggers | Stagger runs in DOM order, which is reading order in both languages. **No `from: "end"` anywhere** — a stagger that reverses under RTL would be inventing a direction the content does not have. |

### 5.3 Arabic verification obligations (wave 3)

Both languages, at 375 / 768 / 1440: the hero split renders correct Arabic shaping with no
broken joins and no orphaned line; every mirrored fragment's highlight rect lands on its
card's top edge; the nav underline grows from the inline-start (right) edge; heading
letter-spacing computes to `normal`/`0` on `/ar` and `-0.028em` on `/en` above `lg`.

---

## 6. Implementation waves

### 6.1 Wave 1 — home

**Files.** `tailwind.config.mjs`; `src/styles/global.css` (§5.1 fix + `.reveal` group
class); `src/components/layout/Section.astro` (ground/seam/texture props); **new**
`src/components/layout/GroundTexture.astro`; `Header.astro`; `Button.astro`; `Nav.astro`;
`LangToggle.astro`; `Hero.astro`; `ObjectiveRecord.astro`; **new** `src/scripts/hero.ts`;
`FailureModes.astro`; `Rule.astro`; `Spine.astro`; `src/scripts/reveal.ts` (group stagger);
`src/scripts/chain.ts`; `ChainLink.astro`; `ChainMarker.astro`; `SuggestionCard.astro`;
`src/scripts/aiCard.ts`; `ClosingCta.astro`; `CommandCentreDim.astro`;
`StageGateQueue.astro`; `src/i18n/ui.ts` (lede split); `src/pages/{en,ar}/index.astro`;
`src/components/type/Display.astro`.

**Verification, on a production build served from `dist/`** (the QA-REPORT method — never
the dev server):

| Check | Pass condition |
|---|---|
| `npm run build` / `npm run check` | clean, 11 pages, 0 errors / 0 warnings |
| LCP, `/en/` + `/ar/`, Slow 4G + 4×CPU | **< 900 ms** (today 385 / 398 ms; budget 2,000 ms) |
| CLS, both | **≤ 0.02** (today 0.00) |
| Lighthouse accessibility, both | **100** (today 100 after the P9 gate) |
| Console, both | **0** messages |
| Scroll frame trace, full home scroll | no sustained frames > 16.7 ms; no long task > 50 ms |
| Reduced motion, both, 375 + 1440 | h1 unsplit; all chain captions at full opacity; all rules `scaleX(1)`; glow at opacity 1; screenshots captured |
| JS disabled, both | h1 present and legible; all prose visible; fragment masks fully open |
| Hero flash | no visible flash of the finished headline at 4× CPU throttle |
| Horizontal overflow, 375 / 768 / 1440, both | `scrollWidth === clientWidth` |
| Contrast re-extraction, `/en/` + `/ar/` | every real token pair re-walked; every new-ground pair recorded against §2.6's predicted figures |
| Grep: hex outside config | 0 hits in `src/` |
| Grep: physical-direction utilities | 0 real hits in `src/` |
| Grep: `motion-safe:` | present on **every** CSS transform added this wave |
| Grep: `data-fragment` in built home HTML | 1, both languages (unchanged) |
| `ground-board` alpha | ≤ 0.28 as shipped |
| `highlight` legibility at 375 | top-edge line visible on a dimmed display; adjust within 0.12–0.20 if not |

### 6.2 Wave 2 — product pages and contact

**Files.** `ProductPage.astro`; `ArgumentBlock.astro`; `Handoff.astro`; `KpiCard.astro`;
`InitiativeRows.astro`; `BenefitCurve.astro`; `ContactPage.astro`; `ContactForm.astro`;
`FormField.astro`; `SovereigntyBand.astro`.

**Verification.** The wave-1 matrix across the remaining 8 routes, plus:

| Check | Pass condition |
|---|---|
| One skeleton | built HTML structure of `/en/{strategy,execution,benefits}` diffs to **copy only** — zero structural divergence |
| `grep -c data-fragment` | exactly 1 per product page, 6/6 across both languages |
| Fragment crops | every crop lands where QA-REPORT §3 recorded it; no highlight rect extends a crop |
| Handoff | `text-paper`, top rule present, both languages, all three pages |
| Contact | keyboard tab order unchanged from QA-REPORT §4 (8 header stops, then mailto, then fields, radio group as one stop, submit); no honeypot stop |
| No glow on `/contact` | `grep spotlight` returns 0 hits in the contact tree |

### 6.3 Wave 3 — full QA re-verification

Re-run the complete QA-REPORT.md matrix and **replace** its numbers, not append to them:

- 10 routes × LCP (Fast 4G and Slow 4G + 4×CPU) × CLS × Lighthouse a11y × console × overflow.
- WebKit pass (Playwright driven directly — the MCP is Chromium-bound): chain sticky engage
  and release, language-toggle header geometry parity, mirrored fragment text, **and the new
  `backdrop-filter` on the header**, which spec §10 names as the Safari divergence risk.
- Reduced-motion pass, all 10 routes, both languages.
- JS-disabled pass, all 10 routes.
- Full contrast re-extraction plus a new table of every §2.6 pair as measured, against the
  predicted values in this document. Any divergence > 0.2:1 is investigated, not rounded.
- Banned-marketing-word grep against the built English HTML (nothing in this phase adds
  prose, so this should be a no-op — run it anyway).
- Update `QA-REPORT.md`, `known-issues.md`, `BUILD_FLAGS.md`'s decisions log and `TODO.md`.

### 6.4 Abort conditions

Stated up front so implementation cannot rationalise past them:

| Trigger | Action |
|---|---|
| Home LCP (Slow 4G + 4×CPU) > 900 ms | **Drop the hero SplitText** to a whole-block `<Reveal>`. Keep everything else. |
| Visible flash of the finished headline at 4× CPU | Same — drop the hero split. |
| Any route CLS > 0.02 | Remove the offending group's `y` offset; keep the opacity. |
| Lighthouse accessibility < 100 on any route | Revert the token that caused it and log the conflict rather than picking a side (CLAUDE.md). |
| Sustained > 16.7 ms frames during home scroll | Drop `backdrop-blur-veil` first, then the glow layer. Both are single-line reverts. |
| `hairline-soft` invisible at 375 on a dim display | Do not raise it — remove the seam that depends on it. It is decoration. |
| Any new AA pair below 4.5:1 | Lower the layer's alpha until it clears, or drop the layer. Never lower text contrast to keep a background. |

---

## 7. Explicit rejections

Recorded so the next reviewer does not re-litigate them.

1. **Overshoot / "back" easing (Raycast `y₂ = 1.56`, Clerk `1.275`).** Reads as playful;
   named against in CLAUDE.md. We do not even take Vercel's ~1.1 — `micro` tops out at
   exactly `y = 1.0`.
2. **A WebGL / canvas hero (Stripe) or looping MP4 illustrations (Resend).** Both fail
   "readable with JavaScript disabled" and the hand-authored-inline-SVG invariant. The SVG
   fragment system is the correct-cost substitute, not a gap — motion dossier #8's finding,
   affirmed.
3. **Spring physics (the Framer Motion model).** Produces an identical visual outcome to a
   bezier for one-shot reveals at the cost of a solver ticking every frame.
   `motion.ts`'s inlined `cubicBezier()` already is the cheaper equivalent.
4. **A second pin or a second scrub anywhere.** The home page's allowance is fully spent by
   the chain (`ChainMarker`'s CSS `sticky` + the rail's `scaleY`). Product pages get
   neither — BUILD_FLAGS P6's argument stands: the rail is the home page's signature and
   repeating it spends the signature. **This specifically rejects a sticky gutter label
   beside the product-page argument prose**, which was the tempting fix for the empty
   inline-end half of `/strategy`. §4.3(a) solves it with a static rule instead.
5. **Character- or word-level SplitText.** Breaks Arabic letter joining and bidi runs.
   Lines only, and only on one element on one page.
6. **The "breathing" RAG dot (motion dossier #7).** A status dot that pulses implies live
   data on a marketing page. This is the same small lie BUILD_FLAGS P6 rejected when it
   declined to count up a static confidence value — rejected on this build's own precedent,
   not on taste.
7. **Stripe's three-hue concentric radial orbs.** Three saturated hues is precisely the
   "gradient mesh" spec §3 bans, and the opposite of a one-accent palette. Only the
   *underlying* idea — several low-opacity layers concentric on one point — is taken, in
   one hue, in one place (§3.6).
8. **Palantir's full-bleed footage with a legibility scrim.** Photography, banned outright
   by spec §5A, and its subject matter (defence hardware) is exactly what this market's
   brand and legal risk profile rules out even if photography were allowed.
9. **Linear's "FIG 0.2" isometric line-art as a new third visual register (visual dossier
   #7).** The best idea in the dossier that is still declined. A new isometric diagram of
   the chain would be an additional product surface on a site whose entire information
   architecture is built on withholding, and the dossier itself flags it as the one item
   with real authoring cost — a directional process flow needs a hand-mirrored RTL geometry.
   Revisit only if a later phase adds a page that needs a new register.
10. **Replacing the `hairline` token with a variable-by-context value.** Added as a *scale*
    beside it instead. The header specifically keeps `hairline`, because that rule carries a
    scroll-state signal rather than decoration.
11. **Numbered markers (01 / 02 / 03) on the product-page skeleton.** The five parts are an
    authoring device, not a sequence the reader needs. Numbering them would be decoration
    dressed as structure. The home chain's `01 / 05` stays, because there the order genuinely
    carries information — it is the traceability claim.
12. **Alternating the ground at every section boundary.** One ground change per page, and
    its direction encodes the argument (§3.9). A stripe pattern would be the same flatness
    with more steps.
13. **`scroll-behavior: smooth`, even in Linear's correctly-gated CSS form (motion dossier
    #1).** TruMandate has exactly one in-page anchor — the hero's "See the chain" → `#chain`
    — and smooth-scrolling it would run the chain's entire scrub in roughly 600 ms, which
    looks broken. `scroll-behavior: auto` stays. If a future phase adds anchors that are not
    scroll-linked, adopt the CSS-gated form then, never a JS toggle.
14. **The ui-ux-pro-max "Government / Public Service" palette** (`#0F172A` primary, `#0369A1`
    accent on `#F8FAFC`). Queried and rejected: the site's palette is settled, dark and
    jade-based, and importing a light navy government palette would discard the brand for a
    stock signifier of the sector. Every colour in this document is derived from the existing
    ten tokens.
15. **`text-shadow` or `drop-shadow` on text for legibility over the composition.** Banned by
    spec §3. The vignette (§3.7c) is the legibility mechanism, and it works by darkening the
    ground rather than outlining the glyphs.
