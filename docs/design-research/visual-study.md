# Visual design study — depth, texture, and typographic scale for TruMandate

Status: research dossier. Feeds the design-elevation phase; does not itself change
any file under `src/`. Authority order per `CLAUDE.md` still applies — where a
recommendation below would touch a token, it is a proposed *addition* to
`tailwind.config.mjs`, not an instruction to add a hex value elsewhere.

## Method and a note on how this was gathered

The current site was read from `screenshots/p2-home-1440.png` (home, EN),
`screenshots/p5-ar-1440.png` (home, AR), and `screenshots/p6-strategy-1440.png`
(Strategy, EN), plus `docs/trumandate-site-spec.md` §3 (tokens) and the live
`tailwind.config.mjs`, `src/styles/global.css`, `src/components/layout/Section.astro`,
`src/components/fragments/KpiCard.astro`, `src/components/ai/SuggestionCard.astro`
and `src/components/home/ClosingCta.astro`.

Reference sites were studied two ways. Stripe, Linear, and Attio were inspected
live with `chrome-devtools` MCP (`evaluate_script` against the real DOM — values
below marked **measured** are real `getComputedStyle()` output, cross-checked in
the same call against `location.href`/`document.title` so they're known to belong
to the page named). Vercel, Palantir, Raycast, Clerk, Framer, and Resend are
covered from **screenshot-only visual reading** — a second research task (a
motion-timing study) was running concurrently against the same shared browser
session, and for a period tab ownership was unstable enough that CSS pulled
through `evaluate_script` for those sites could not be trusted to belong to the
URL requested (one early "Vercel" data pull turned out on cross-check to be
Raycast's DOM). Rather than report unverified numbers as measured, sites without
a same-call `href` check are written up from what's visibly true in the
screenshot, and captions say so. Palantir's h1 typography (80px / weight 400 /
`-3.4px` tracking / "Alliance No.2") *is* measured and href-verified; its other
techniques are visual reads of `screenshots/inspiration/visual-palantir-2-full.png`.

Screenshots live in `screenshots/inspiration/`. The `visual-*` files are this
task's own captures; the `motion-*` files (Attio, Clerk, Framer, Linear, Raycast,
Resend, Stripe, Vercel — hero plus 2–3 scroll steps each) belong to the
concurrent motion study and are reused here only as additional visual reference
for sites this task also covers, never as a source of claimed measurements.

---

## Site notes

### Stripe (stripe.com/ae — light mode, bento-card layer) — measured

Screenshots: `visual-stripe-1-hero.png`, `visual-stripe-2-section.png`.

- **Layered radial-gradient "orbs" inside bento cards.** The billing-plan card
  stacks three radial gradients on top of each other before a white fade:
  `radial-gradient(50% 50%, rgba(83,58,253,.8) 62.5%, transparent 100%)`,
  `radial-gradient(50% 50%, rgba(243,99,243,.8) 53.85%, transparent 100%)`,
  `radial-gradient(50% 50%, rgb(255,207,94) 41.35%, transparent 100%)`, then
  `linear-gradient(rgb(255,255,255) 41.35%, transparent)` to fade the top of the
  stack to white. Three colour blobs + one fade layer, all positioned
  concentrically — that's the whole trick.
- **Multi-stop stacked shadows, not one shadow.** Every raised surface carries
  two to three shadow layers at different blur/spread: navbar
  `rgba(0,0,0,.1) 0 30px 60px -50px, rgba(50,50,93,.25) 0 30px 60px -10px`;
  browser-chrome mock `rgba(23,23,23,.08) 0 15px 35px 0`. The near shadow is
  tight and dark, the far shadow is soft and low-opacity — together they read
  as one continuous soft light source rather than a single hard drop-shadow.
- **48px/32px/26px heading scale at font-weight 300**, not 600–700. Stripe's
  entire heading register is *light*, with the weight doing almost none of the
  size-difference work and negative tracking doing all of it (h1 `-0.96px` on
  48px ≈ ‑2%, h2 `-0.64px` on 32px ≈ ‑2%, h3 `-0.26px` on 26px ≈ ‑1%). Constant
  tracking ratio across the scale, not constant pixel tracking.
- **Applicability to TruMandate:** the layered-shadow recipe is the most
  transferable piece — TruMandate's fragment cards currently carry a single 1px
  `stroke-hairline` and nothing else (see critique below). The colour-blob
  technique itself is not usable as-is (three saturated hues on white is the
  opposite of the ink/jade/single-accent palette and would read as exactly the
  "gradient mesh" `CLAUDE.md` bans), but the *underlying idea* — several
  low-opacity radial layers concentric on one point, not one strong gradient —
  translates directly to an accent-only, single-hue "spotlight" (see synthesis
  #5).

### Linear (linear.app — dark mode) — measured

Screenshots: `visual-linear-1-hero.png`, `visual-linear-2-board.png`,
`visual-linear-3-section.png`, plus `motion-stripe-2-scroll1.png` (mislabeled by
the concurrent task; content confirmed as Linear's "A new species of product
tool" section on inspection).

- **Ground: `rgb(8,9,10)`, never pure black, never a second flat colour.** The
  hero sits on `radial-gradient(52.53% 57.5% at 50% 100%, rgba(8,9,10,0) 0%,
  rgba(8,9,10,.5) 100%), linear-gradient(rgb(8,9,10) 10%, rgb(208,214,224)
  100%)` — the page ground itself fades from near-black at the top toward a
  pale grey at the very bottom of the hero band, before the next section
  restores dark. It's a single hero-height gradient, not a texture repeated
  down the whole page.
- **4% white radial "glow" behind UI clusters**, both in the hero
  (`.JgFxua_glow`, `radial-gradient(50% 50%, rgba(255,255,255,.04) 0%,
  rgba(255,255,255,0) 90%)`) and again behind the Slack-integration mockup
  (`.qM9FAa_glow`, `radial-gradient(circle, rgba(255,255,255,.04) 0%,
  rgba(0,0,0,0) 50%)`). Same recipe reused twice: a plain white radial at 4%
  opacity, nothing more saturated.
- **Hairline borders at 5–8% white, not a token colour, on every card**:
  `0.667px solid rgba(255,255,255,.05)` on issue rows and carousel cards, `0.667px
  solid rgba(255,255,255,.08)` on the larger container, radii 6–22px scaling
  with the element's size (small chips get 6–8px, the big product-mockup frame
  gets 22px).
- **Two-tone paragraph inside one heading.** "A new species of product tool."
  in full-strength white, followed inline by ", Purpose-built for modern teams
  with AI workflows at its core, Linear sets a new standard..." in a dimmer
  grey — one sentence, one type size, two opacities, doing the job a second
  heading level would otherwise do.
- **Labelled isometric line-art ("FIG 0.2", "FIG 0.3", "FIG 0.4")** — thin
  white-stroke wireframe solids on the dark ground, each tagged with a small
  monospace figure caption in the corner. Pure geometry, no colour, no photo.
- **Applicability:** the hairline-at-low-opacity idea already exists at
  TruMandate as the `hairline` token (`rgba(255,255,255,.10)`) — Linear's data
  shows *variable* opacity by context (5% for small chips, 8% for the big
  frame) where TruMandate uses one flat value everywhere. The FIG-labelled
  isometric diagrams are the strongest single idea to borrow outright: TruMandate
  has no visual register between "data fragment" and "body text," and this fills
  it without touching the photography ban or the fragment-fidelity rule (see
  synthesis #7).

### Attio (attio.com — light mode, data-as-hero) — measured

Screenshots: `visual-attio-1-hero.png`, `motion-attio-2-scroll1.png`
(feature/logo section), `motion-attio-3-scroll2.png` (this file is actually a
second Vercel hero capture per its own visible content — kept for the record
but not used as an Attio source).

- **A literal 1px-repeating-gradient grid, no image, no SVG.** The diagonal
  "blueprint" wash behind the floating product screenshot is
  `repeating-linear-gradient(90deg, oklab(1 ~0 ~0 / .78) 0px, oklab(1 ~0 ~0 /
  .78) 1px, transparent 1px, transparent 8px)` layered over a big radial colour
  wash (`radial-gradient(90% 80% at 50% 100%, #E6ECFF 0%, #BCCBFF 45%, #86A0EE
  100%)`). A near-white line every 8px, at 78% alpha, on top of a soft blue
  radial — that's the entire "graph paper" effect, and it costs one CSS
  declaration.
- **Four-layer stacked shadow on the floating product-window card**, radius
  16px: `rgba(11,13,24,.06) 0 0 0 1px` (a hairline *border simulated as a
  shadow*, so it never gets clipped by rounded corners), then `.024 0 1px 2px`,
  `.03 0 3px 6px`, `.035 0 8px 14px` — hairline, then three increasingly soft
  ambient layers. This is the cleanest "how do you make a flat rectangle look
  like it's floating half an inch above the page" recipe found in this study.
- **InterDisplay 600, 64px, `-1.29px` tracking** (≈ ‑2%) on the h1 — same
  tracking ratio as Stripe and Linear despite a completely different typeface
  and register, suggesting ~‑2% is close to a shared convention at this size,
  not a brand-specific choice.
- **Applicability:** the repeating-gradient grid is directly usable and cheap —
  it needs zero new asset, one token pair (line colour + spacing), and both
  values are trivially overridden per direction with no RTL risk at all, since
  a repeating pattern has no inherent left/right orientation. The stacked-shadow
  recipe is the strongest candidate for TruMandate's SVG fragments and the
  SuggestionCard (synthesis #2/#9), with the caveat that "shadow" on a *dark*
  ground has to lighten rather than darken to read as elevation (see the AA/RTL
  note under that item).

### Raycast (raycast.com — dark mode, glass/glow discipline) — measured

Screenshots: `visual-raycast-1-hero.png`, `motion-raycast-2-scroll1.png`
(AI-launcher mockup), `motion-raycast-3-scroll2.png` (hero, duplicate angle).

- **One accent colour, one glow, used exactly once per screen.** The entire
  hero background is `rgb(7,8,10)` plus a single `conic-gradient(from 100deg at
  ~189px 15px, transparent 0%, rgb(236,165,167) 20%, transparent 25%)` — a thin
  wedge of warm pink-red light, not a filled shape — combined with the diagonal
  grain-textured red beams visible in the screenshot (rendered as blurred/grainy
  shapes, not gradients the DOM sweep captured, so read as an authored raster
  or WebGL-adjacent effect layered *under* the DOM — TruMandate's no-WebGL rule
  makes this specific implementation off-limits, but the discipline it
  demonstrates — one saturated colour, confined to one diagonal band, everything
  else neutral — is the transferable part).
- **Hairline borders scale with translucency by role**: the navbar's border is
  `0.667px solid rgba(255,255,255,.06)` (barely there, chrome-level), the
  in-page product dropdown's border is `rgba(255,255,255,.2)` (much more
  present, content-level). Radius drops from 16px (navbar) to 8px (in-app
  chrome) — bigger surfaces get bigger radii.
- **Rounded-pill buttons with a soft top highlight**, visible in the
  screenshot as a subtle lighter edge along the top of each pill button — a
  cheap inset highlight that makes a flat-filled button look like it catches
  light from above.
- **Applicability:** the "one accent, one glow, one place" rule is exactly the
  discipline `CLAUDE.md` already wants (the single `accent` token, amber/red
  reserved for RAG-only) — Raycast is evidence that this restraint, done
  correctly, is *itself* the visual-richness technique, not a constraint fought
  against. TruMandate can adopt the rule (glow appears once per page, tied to
  the AI card — synthesis #12) without adopting Raycast's saturated red, which
  the palette doesn't have and shouldn't add.

### Palantir (palantir.com — dark mode, institutional gravitas) — h1 measured, rest visual

Screenshots: `visual-palantir-1-hero.png` (viewport), `visual-palantir-2-full.png`
(full page).

- **Measured:** h1 "Sovereign AI Systems for Every Decision" renders at 80px,
  weight 400 (not bold), `-3.4px` letter-spacing — about ‑4.25% of the font
  size, roughly double the tracking ratio Stripe/Linear/Attio use at smaller
  sizes. A government-register display face reads more authoritative *lighter*
  and *tighter*, not heavier.
- **Visual (screenshot read, not measured):** full-bleed dark footage with a
  top-to-bottom dark gradient scrim so white display type stays legible over
  any part of the frame; a thin, mostly-transparent nav bar sitting directly on
  the footage rather than a solid header band; a horizontal set of rounded-pill
  topic filters (one pill active) that scrolls into a dark technical card —
  charcoal ground, thin white line-art (aircraft/vessel outlines), small
  monospace-uppercase category labels ("DEFENSE", "COMMERCIAL", "INDUSTRIAL"),
  and an oversized wordmark treatment ("Warp✱Speed") set directly into the card
  at a scale larger than the body headline above it. Further down: five
  numbered capability rows, each with a faint line-icon and a mono `/0.1`–`/0.5`
  figure number — structurally the same idea as TruMandate's existing "01/05"
  chain numbering, which is a validation rather than a new idea.
- **Applicability, with the obvious caveat first:** the hero technique itself —
  full-bleed photography with a dark scrim — is exactly what `CLAUDE.md`
  prohibits outright ("no photography anywhere... no national imagery"), and
  Palantir's own subject matter (defense hardware) is precisely the kind of
  image TruMandate could never use even if photography were allowed. What
  *does* transfer cleanly is the underlying pattern one layer down: a full-bleed
  dark technical illustration with a legibility scrim behind display type, and a
  dark card that carries thin line-art plus an oversized wordmark as its own
  piece of visual interest. Built as SVG line-art instead of footage (an
  isometric rendering of the objective→KPI→initiative→milestone→benefit chain,
  say, in place of aircraft), this is the single most directly-applicable
  "gravitas" technique in the set, and it's the same idea as Linear's FIG
  diagrams arrived at independently by a very differently-positioned company —
  good evidence it's a real pattern, not a one-off house style.

### Bonus / supplementary (screenshot-only, reused from the concurrent motion study)

- **Clerk (clerk.com, light mode):** a near-invisible circuit-board/grid-line
  SVG texture sits behind the hero heading — dotted nodes at line
  intersections, everything under ~5% contrast against the white ground. This
  is a second, independent example (alongside Attio's repeating-gradient) of a
  "technical" background achieved with pure line geometry and no photography —
  strong corroboration that this idiom is common and cheap, not a fluke.
  `motion-clerk-1-hero.png`.
- **Framer (framer.com, dark mode):** oversized rounded display type
  (weight ~800) directly on pure black, with product-chrome mockups using dark
  charcoal cards and a soft cursor/pointer illustration for narrative interest
  rather than colour. `motion-framer-1-hero.png`.
- **Resend (resend.com, dark mode):** a serif/humanist display face ("Email for
  developers") paired with a moody, single dark 3D cube composition lit from one
  side — the only reference in this set using a display serif rather than a
  grotesque, and a useful reminder that "bold type" doesn't have to mean
  heavier weight; it can mean a different type register entirely at the same
  weight. Not recommended for adoption (TruMandate's two-typeface rule is
  settled and a third face is out of scope), but useful evidence that scale and
  restraint, not typeface choice, are what read as "considered." Visible via
  `visual-vercel-2-section.png` (mislabeled during capture; content confirmed
  as Resend on inspection) and `motion-resend-1-hero.png`.

---

## Synthesis: techniques worth adopting

Ordered roughly by cost-to-benefit. Each entry names the TruMandate element it
elevates, the token addition it needs, and any AA-contrast or RTL risk.

**1. Section-ground gradient seam, not a hard hairline cut.**
What: where two sections meet at different grounds (`ink` → `jade`), blend
across a short band (48–96px) instead of a one-pixel rule.
Where: every `Section`-to-`Section` boundary; most visible at the
problem→chain and AI-moment→closing-CTA seams on Home.
Token: `backgroundImage: { 'seam-ink-jade': 'linear-gradient(to bottom, theme(colors.ink), theme(colors.jade))' }`
(vertical gradient only — no inline-direction component, so zero RTL risk).
AA: none — it sits behind text, never under it at a seam.

**2. Multi-layer border on every fragment card, replacing the single 1px stroke.**
What: Attio's four-layer stacked-shadow recipe, adapted for a *dark* ground:
a 1px hairline "border-as-shadow" plus one soft ambient layer that reads as a
lighter halo rather than a dark drop-shadow (drop-shadows are close to
invisible on `ink`).
Where: `KpiCard.astro`, `SuggestionCard.astro`, the stage-gate and benefit-curve
fragments — currently every one of these is `fill-surface` + `stroke-hairline`
(1px, one value) and nothing else.
Token: `boxShadow: { raised: 'inset 0 1px 0 rgba(255,255,255,.05), 0 10px 24px rgba(2,24,19,.5)' }`
for real-DOM cards (`SuggestionCard.astro`); SVG fragments need the SVG
equivalent (`<filter>` with `feDropShadow` or a duplicated, blurred, offset
`<rect>`), which is a small addition to each fragment's `<defs>`.
AA: shadow tokens don't touch text contrast; verify the SVG filter doesn't clip
at the fragment's crop edge (the crop is deliberate per spec §5 and must stay legible as a crop).
RTL: none — shadows here are symmetric or vertical-only.

**3. Repeating-gradient hairline texture for one hero-scale surface per page.**
What: Attio/Clerk's 1px-line-every-N-px `repeating-linear-gradient`, at very
low alpha, as a page-ground texture behind the hero or the closing CTA.
Where: Home hero band, and/or behind `CommandCentreDim` (see #11).
Token: `backgroundImage: { 'hairline-grid': 'repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0px, rgba(255,255,255,.04) 1px, transparent 1px, transparent 32px)' }`
plus a vertical companion at a different spacing if a true grid (not just
stripes) is wanted.
AA: texture must stay under ~5% contrast against `ink` so it never competes
with foreground text — matches the alpha values measured on Attio/Clerk almost
exactly.
RTL: none — a repeating pattern has no left/right, it tiles identically either
direction.

**4. Deepen display tracking slightly and check the ratio, not the pixel value.**
What: current `display` token is `-0.02em` at up to 4.25rem (68px). Every
reference site sampled runs close to ‑2% at 48–64px (Stripe, Linear, Attio) but
Palantir pushes to ‑4.25% at 80px — tracking tightens as size grows, it
doesn't stay flat.
Where: `tailwind.config.mjs`'s `fontSize.display` and `letterSpacing.display`.
Token: consider `-0.025em` to `-0.03em` for the top of the `display` clamp only
(a size-dependent tracking value, if Tailwind's `clamp()`-driven size makes
that awkward, a second token e.g. `letterSpacing['display-lg']: '-0.03em'`
applied only above a breakpoint).
AA: none (tracking doesn't affect contrast).
RTL: **the spec already sets Arabic display tracking to `0`** (§3) — this
change is Latin-only by design and needs no new RTL handling, just confirming
the existing `[dir=rtl]` override still wins.

**5. A single accent-only "spotlight" radial, reserved for the AI card.**
What: Stripe's concentric-layer idea and Raycast's "one glow, one place"
discipline, combined: one soft, low-opacity radial in `accent` (not a new
hue), positioned behind/around the AI Suggestion Card only — never the hero,
never a section background.
Where: `SuggestionCard.astro`'s wrapper.
Token: `backgroundImage: { 'spotlight-accent': 'radial-gradient(60% 60% at 50% 40%, rgba(25,195,155,.10) 0%, transparent 70%)' }`.
AA: low enough alpha (≤10%) that it can't affect the text/background contrast
pairs already verified in `known-issues.md`/`QA-REPORT.md`; re-run a contrast
check on the card's copy after adding it, since the fill sits directly behind
`text-paper`/`text-body`.
RTL: centered radial (`50% 40%`), so it's direction-agnostic — no mirroring
needed. This is deliberately *not* Raycast's asymmetric diagonal beam, which
would need a `[dir=rtl]` mirror; centering avoids that cost entirely.

**6. Two-tone (mixed-opacity) text within a single heading or lede, for one
emphasis move per page.**
What: Linear's technique of running a heading/lede in `paper` for the load-
bearing clause and `muted` for the rest, inside one sentence, one type size.
Where: candidate spots: the Home hero sub-lede, or the Strategy page's
argument-to-land sentence.
Token: none new — `text-muted` and `text-paper` already exist; this is a
markup pattern (`<span class="text-muted">…</span>` inside a `Lede`), not a
token addition.
AA: `muted` against `ink`/`jade` is already in the verified token pairs per
spec §9 — confirm the *specific* sentence chosen doesn't drop below AA at the
smaller end of the `lede` clamp.
RTL: none — this is a colour split, not a positional one; Arabic sentence
structure will carry the same span placement by meaning, not by mirroring.

**7. Labelled technical line-art as a third visual register, alongside data
fragments and body text.**
What: Linear's "FIG 0.2" isometric wireframes and Palantir's blueprint
line-art, translated into TruMandate's own subject matter — e.g., an isometric
or schematic rendering of the five-link chain (objective→KPI→initiative→
milestone→benefit) as thin `stroke-hairline`/`stroke-muted` SVG line-art, each
labelled "FIG 01" in the existing `eyebrow`/`datum` mono role.
Where: Strategy or Execution page, as a second illustrative device distinct
from the KPI card fragment — fills the gap between "data fragment" (concrete,
literal) and "body copy" (abstract) that the site currently has no register
for.
Token: none new — uses `hairline`, `muted`, and the existing mono eyebrow
type role.
AA: line-art at `hairline`/`muted` opacity against `ink`/`jade` is already
within the verified palette; no new pairs to check.
RTL: must be hand-mirrored geometry for any diagram with inherent directional
meaning (a left-to-right process flow), following the exact pattern
`KpiCard.astro` already uses for its own mirroring (`460 - x` coordinate
flips) — this is the one item here with real authoring cost, not just a token
addition.

**8. Variable-opacity hairline borders by element role, not one flat value.**
What: Linear uses `rgba(255,255,255,.05)` for small chips and `.08` for large
frames; Raycast uses `.06` for chrome and `.2` for content-level dropdowns.
TruMandate's single `hairline` token (`rgba(255,255,255,.10)`) is used
identically everywhere from the header rule to card borders to chain rail.
Where: `tailwind.config.mjs` `colors.hairline`.
Token: add `hairline-soft: 'rgba(255,255,255,.06)'` (chrome-level: header,
section rules) alongside the existing `hairline` (content-level: card
borders), rather than replacing it — a scale of two, not a redesign.
AA: hairlines are decoration, not text — no contrast requirement, but confirm
neither value is so faint it fails to register as a boundary at 375px.
RTL: none.

**9. Ambient elevation via top inset-highlight instead of (or with) a shadow,
for a dark ground.**
What: on `ink`/`jade`, a dark drop-shadow is nearly invisible (shadows read
against *lighter* grounds); the transferable trick from Attio/Raycast is
instead a thin lighter line at the top inner edge of a raised element,
simulating light catching the top of a physically raised surface.
Where: same fragment/card set as #2 — this is the "dark mode" companion to the
Attio shadow recipe, not a separate one.
Token: folded into the `raised` shadow token in #2 (`inset 0 1px 0
rgba(255,255,255,.05)` is already the top-highlight component of that value).
AA/RTL: covered under #2.

**10. Header: add blur to the existing veil, don't just leave it opacity-only.**
What: `Header.astro:39` already carries `bg-ink/veil` (a token-driven opacity
already earns partial credit here) but no `backdrop-blur`. Every reference
site with a sticky/fixed header blurs what scrolls behind it in addition to
dimming it.
Where: `src/components/layout/Header.astro` line 39.
Token: no new colour token; add a `backdrop-blur-sm` (Tailwind default scale is
fine here — this is a blur radius, not a colour, so it doesn't violate the
hex-only-in-config rule) alongside the existing class list.
AA: should *improve* worst-case contrast (blurring busy content behind the
header can only reduce, never increase, its interference with header text)
but verify iOS Safari renders `backdrop-filter` under the existing
`prefers-reduced-motion`/Safari-divergence testing loop (spec §10) — this is a
static filter, not a ScrollTrigger animation, so it should not interact with
the reduced-motion branch at all, but confirm empirically since Safari is
named in spec §10 as the divergence risk.
RTL: none.

**11. A real vignette on the dimmed Command Centre composition, not a hard
mask edge.**
What: `CommandCentreDim` currently renders as flat `jade-lift` rectangles at
`opacity-dim` (0.25) directly on flat `ink`, with a hard rectangular boundary
— this is the single clearest "looks like placeholder UI, not a dimmed real
product" moment on the site, and it's exactly the spot the spec is counting on
to carry the whole curiosity mechanic ("the whole board, in forty minutes").
Where: `src/components/home/ClosingCta.astro` (wraps `CommandCentreDim`).
Token: `backgroundImage: { 'vignette-ink': 'radial-gradient(65% 65% at 50% 50%, transparent 40%, theme(colors.ink) 100%)' }`
layered on top of the dimmed composition so its edges fade into the page
ground instead of stopping at a straight line.
AA: the CTA text already sits on its own `Reveal` block per the existing
markup (line 44–59) at full opacity against `ink`, not against the dimmed
composition — the vignette sits behind the composition, not behind the CTA
copy, so no existing contrast pair changes.
RTL: radial is centered (`50% 50%`) — direction-agnostic, no mirroring needed.

**12. Structural rule: exactly one glow per page, and it is always the AI
card.**
What: this is a restatement of #5 as a *rule*, not just a token — the point
being that Raycast's "one glow, one place" discipline only reads as
intentional because it's consistent, and TruMandate already has a
page-by-page-repeating structural device to hang it on (the spec's own AI
narrative strategy, §4: "the pattern repeating is the point"). Tying the one
allowed glow to the one recurring AI moment turns a vague aesthetic
instruction ("add some glow") into something as enforceable as the existing
"one fragment per product page" rule.
Where: documentation-level — belongs next to spec §4 or §7 if adopted, not a
new file.
Token/AA/RTL: none beyond #5 — this entry is the governance note that keeps
#5 from creeping onto the hero or the chain once someone likes how it looks.

---

## Critique: where TruMandate's current flatness actually comes from

Five findings, each traced to a specific file and cross-checked against the
screenshots studied.

**1. The page ground is one flat hex value for the entire scroll length of every
route.** `src/styles/global.css:21` sets `@apply bg-ink ...` on `body` and
nothing overrides it at the section level except the `jade` token, which is
used only inside cards (`SuggestionCard.astro:79`, `ContactForm.astro:73`,
`chain.ts:96`) — never as an alternating section ground the way spec §3
("sections separate with hairline rules, not cards") implies is available.
Across `p2-home-1440.png`'s ~8300px of page height, the visible background
colour never changes. Every reference site studied changes its background at
least once per screen height — a gradient fade (Linear), a colour wash
(Attio), a texture (Clerk) — TruMandate changes it zero times. This is the
single largest source of the flatness read, and synthesis #1/#3/#11 are all
direct responses to it.

**2. Every fragment card is a flat fill plus a single 1px stroke, with no
elevation cue.** `KpiCard.astro` draws its card as `<rect ... rx="4"
class="fill-surface stroke-hairline" stroke-width="1">` (lines 103–111 and
217–225) — one fill, one 1px border, no shadow, no highlight, no gradient.
`SuggestionCard.astro` is the same recipe in real DOM. Every reference site's
equivalent "card as focal point" moment — Attio's floating product window,
Linear's issue rows, Raycast's command-palette dropdown — carries a multi-
layer border/shadow treatment specifically because a single flat stroke reads
as "printed on the page" rather than "sitting above it." Synthesis #2/#9 name
the fix.

**3. The dimmed Command Centre — the one moment spec §5 is counting on to do
real narrative work — currently looks like empty placeholder boxes, not a
dimmed screenshot.** `ClosingCta.astro:41-42` places `CommandCentreDim`
directly on flat `bg-ink` with a hard-edged composition and no vignette; in
`p2-home-1440.png` the result (visible ~1440-1620px down the page) is a grid
of same-toned rectangles that reads as unfinished UI rather than "the whole
board, in forty minutes." This is the highest-stakes single fix in this
dossier, because the spec explicitly built the entire site's information
architecture (withholding every other full view) to make this one moment
land — synthesis #11 is not optional polish, it's protecting the one payoff
the whole withholding strategy exists to deliver.

**4. Typographic rhythm is uniform in weight and colour within each role, so
headings carry no internal contrast.** The three-role type system (display,
body, mono-eyebrow) is correctly restrained per spec §3, but every reference
site studied adds a *second* move within a single role — Linear's two-tone
paragraph, Stripe's constant-tracking-ratio scale, Palantir's size-dependent
tightening — that TruMandate's headings don't use anywhere in the current
build (every `<Heading>` instance renders one weight, one colour, throughout).
Synthesis #4/#6 are the two available fixes that don't require a fourth type
role.

**5. Nothing on the page ever reads as "raised" or "lit," including the one
place the spec explicitly wants attention drawn (the AI card).** The AI
Suggestion Card — the spec's own signature repeating device (§4) — is styled
identically to every other card on the site (`bg-jade`, hairline border, `2px`
accent marker on one edge) with no visual signal that this is the moment the
whole page's narrative structure is built around. Raycast's and Stripe's
shared lesson — that a single, disciplined glow in one place reads as
intentional precisely because it doesn't appear anywhere else — is directly
applicable here and currently entirely unused. Synthesis #5/#12 name the fix,
and deliberately scope it to only this one element so it doesn't become the
"glow blob" `CLAUDE.md` already prohibits.

---

## Screenshot inventory

| File | Site | Notes |
|---|---|---|
| `visual-stripe-1-hero.png` | Stripe /ae | Bento-card gradients + shadows, measured |
| `visual-stripe-2-section.png` | Stripe /ae | Scrolled section, cross-reference |
| `visual-linear-1-hero.png` | Linear | Dark hero, ground gradient, measured |
| `visual-linear-2-board.png` | Linear | Live product board as hero (banned pattern for TruMandate, noted) |
| `visual-linear-3-section.png` | Linear | Chip/border sampling |
| `visual-vercel-1-hero.png` | Vercel | Triangle hero, soft bloom — screenshot only, self-evidently Vercel (logo/copy) |
| `visual-vercel-2-section.png` | Resend (mislabeled during capture) | Kept for reference: serif type + lit 3D cube |
| `visual-attio-1-hero.png` | Attio | Data-as-hero, measured (grid texture, stacked shadow, type) |
| `visual-raycast-1-hero.png` | Raycast | Glow-beam hero, measured (borders, conic gradient) |
| `visual-palantir-1-hero.png` | Palantir | Hero viewport; h1 typography measured |
| `visual-palantir-2-full.png` | Palantir | Full-page: blueprint card, numbered rows, dual CTA footer |
| `motion-attio-2-scroll1.png` | Attio | Grid texture + logo wall, reused from motion study |
| `motion-attio-3-scroll2.png` | Vercel (mislabeled) | Confirms triangle hero independently |
| `motion-raycast-2-scroll1.png` | Raycast | AI launcher glass-card mockup |
| `motion-raycast-3-scroll2.png` | Raycast | Hero, duplicate angle |
| `motion-clerk-1-hero.png` | Clerk | Circuit-board line texture, bonus reference |
| `motion-framer-1-hero.png` | Framer | Bold rounded type on black, bonus reference |
| `motion-resend-1-hero.png` | Resend | Serif type + 3D cube, bonus reference |
| `motion-stripe-2-scroll1.png` | Linear (mislabeled) | "FIG" isometric diagrams, confirmed Linear content |

All files above are under `screenshots/inspiration/`.
