# UI audit — trumandate.com, both languages

Read-only audit run against a clean `npm run build` of the current `main`
(`9fab49e`), served from `dist/` at `http://127.0.0.1:4322`. Rendering and
measurement via the chrome-devtools MCP (Chromium), viewports 375 / 1440 / 1920,
`deviceScaleFactor` 1 (2 at 375). No product source was modified.

## Design language

- **Audited surface:** `/en/`, `/en/strategy/`, `/en/execution/`, `/en/benefits/`,
  `/en/blog/`, `/en/blog/what-is-portfolio-governance/`, `/en/contact/` and the
  seven `/ar/` twins — 14 routes, shared header/footer chrome, `Section.astro`
  wrapper, the `type/` and `ui/` primitives, the three product fragments, the
  Command Centre board and the contact form.
- **Design sources (proved current and governing):** `tailwind.config.mjs`,
  `src/styles/global.css`, `DESIGN.md` (written this session from those two plus
  the sources below), `CLAUDE.md`, `docs/trumandate-site-spec.md` §3/§7/§8/§9,
  `docs/design_handoff_website_redesign/README.md` and its `.dc.html` references,
  `BUILD_FLAGS.md` decision log, `known-issues.md`.
- **Documented decisions that constrain this audit:**
  - `BUILD_FLAGS.md` REDESIGN directive #2 (2026-08-18): exact fidelity to the
    `.dc.html` references overrides repo conventions **including token indirection
    and the no-hex rule**. Bespoke inline `font-size`, `max-width` and `padding`
    values inside redesign-wave components are therefore decisions, not drift.
  - The contact page and both blog pages were redesigned **after** the handoff
    (phthalo editorial ground; light paper request card). Where they differ from
    `Contact (redesign).dc.html`, the later work governs.
  - Command Centre board fit: `scripts/board.ts` deliberately floors `zoom` at
    0.45 and crops rather than shrinking below it — a written composition
    judgement, not a bug.
  - Chain-link rest opacity, Arabic-Indic vs Western digit split, unmirrored
    Intertec/TruMandate marks, the mint eyebrow on `/contact/`, and the
    gradient-clipped hero phrase are all recorded decisions.
- **Governing owners and consumers:** `Section.astro` (every route's inline
  padding and vertical rhythm), `type/Display|Heading|Lede|Eyebrow|Datum.astro`,
  `ui/Button.astro`, `layout/Header|Nav|NavDrawer|Footer.astro`,
  `global.css`'s `@layer utilities` motion classes (every route),
  `scripts/redesignReveal.ts` (home + three product pages).
- **Explicit exceptions:** the `brand-*` mark colours, `<meta name="theme-color">`
  and `site.webmanifest` are exempt from the tokens-only rule; the `.dc.html`
  fidelity directive above is exempt from token indirection.

---

## Findings

| # | Problem | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- |
| P1-1 | The `<noscript>` reveal fallback is emitted before the stylesheet it must override, so with JavaScript disabled 8 of 14 routes lose 1,000–2,000 characters of body copy, every proof-band statistic and every confidence bar | Mark the `<noscript><style>` declarations `!important`, matching the `Header.astro` `<noscript>` block | `src/layouts/BaseLayout.astro:157-178` — reaches every route | High |
| P2-1 | The proof band's column separators render as stray edge rules on 3 of 4 stats below `lg`, where the grid is not a single four-column row | `border-s` → `lg:border-s` | `src/components/home/ProofBand.astro:58,77,94` — `/en/` and `/ar/` | High |
| P3-1 | The blog index's two identical section labels use different heading levels, putting an 11.52px `h2` above 20.8px `h3`s | Render `blog.moreHeading` as the `<p>` its twin `blog.latestLabel` already uses, class list unchanged | `src/components/blog/BlogIndex.astro:213` — `/en/blog/` and `/ar/blog/` | Medium |

### P1

#### P1-1 · The `<noscript>` reveal fallback is inert — it is emitted before the stylesheet it must override, so scroll-reveal content stays invisible with JavaScript disabled

> **Status, 2026-09-02 18:37 — corrected by another actor, unverified by this audit.**
> After this audit was written, `src/layouts/BaseLayout.astro` was modified in the
> working tree (uncommitted) to add `!important` to the `<noscript><style>`
> declarations — the correction below. That change was **not** made by this
> read-only audit and has **not** been re-measured here. Re-run the
> scripting-disabled check against a fresh build before closing the finding.

**Contract.** Four binding statements, and a repository record that this is already
fixed:

- `CLAUDE.md` → Budgets: *"The site must be readable with JavaScript disabled."*
- `CLAUDE.md` → Invariants: *"Reduced motion is a real branch… End state lives in
  CSS, GSAP animates *from* an offset, so a JS failure degrades to a correct page."*
- Handoff `README.md` → Interactions: *"Reduced motion: every animated class ships
  its end state."*
- `src/layouts/BaseLayout.astro:145-156` states the requirement and the intended
  remedy in its own comment: *"Neither fires when JavaScript is disabled outright
  and the visitor has no reduced-motion preference, which would leave every one of
  those elements at its hidden starting opacity forever — CLAUDE.md's 'the site
  must be readable with JavaScript disabled' failing silently. **This is the fix**."*
- `known-issues.md:1069-1089` records the defect as **"Fixed with a
  `<noscript><style>…</style></noscript>` block in `BaseLayout.astro`."**

The fallback ships, and it does not work.

**Runtime path.** `global.css:284` `.tm-rise { opacity: 0; transform: translateY(30px) }`,
`:294` `.tm-fade { opacity: 0 }`, `:300` `.tm-grow { transform: scaleX(0) }`. The end
state lives only in `.tm-in` (`global.css:311`), added exclusively by
`src/scripts/redesignReveal.ts:50`. The `@media (prefers-reduced-motion: reduce)`
block at `global.css:437` covers only readers who set that preference. The
`<noscript><style>` at `BaseLayout.astro:157-178` is supposed to cover everyone
else, and it fails for two compounding reasons:

1. **Tailwind 3.4 emits no native `@layer`.** `@layer utilities` in `global.css` is
   Tailwind's own directive, compiled away — the built stylesheet contains zero
   `@layer` at-rules (counted in `dist/en/index.html`). The
   unlayered-beats-layered rule that would have let an unlayered `<noscript>` style
   win therefore does not exist. Both rules are plain, single-class, specificity
   `(0,1,0)`.
2. **The fallback is emitted first.** `build.inlineStylesheets: 'always'`
   (`astro.config.mjs`, a logged LCP decision) inlines the whole stylesheet into
   `<head>` **after** everything the layout authored. In the built page the
   `<noscript>` is head child **37** and the inlined `<style>` is head child **38**.
   On an equal-specificity tie the later rule wins, so `.tm-rise{opacity:0}` beats
   `.tm-rise{opacity:1}`. An author cannot place anything after Astro's injection
   point, so re-ordering is not available.

**Measurement — cascade.** On the live page, injecting the fallback's *exact*
declarations at head position 0 (its real relative position, before the stylesheet)
leaves a `.tm-rise` element at `opacity: 0`; moving the identical rule to the end
of `<head>` flips it to `opacity: 1`. Source-order, not the rule text, is what
defeats it.

**Measurement — impact.** Each page loaded into a same-origin iframe with
`sandbox="allow-same-origin"` (scripting disabled, so `<noscript>` engages; styles
and fonts intact), 1440×900:

| Route | `.tm-in` added | Elements stuck hidden | Body text never painted |
| --- | --- | --- | --- |
| `/en/` | 0 | 21 | 1,995 chars |
| `/en/strategy/` | 0 | 11 | 1,386 chars |
| `/en/execution/` | 0 | 13 | 1,476 chars |
| `/en/benefits/` | 0 | 11 | 1,364 chars |
| `/ar/` | 0 | 21 | 1,640 chars |
| `/ar/strategy/` | 0 | 11 | 1,072 chars |
| `/ar/execution/` | 0 | 13 | 1,135 chars |
| `/ar/benefits/` | 0 | 11 | 1,111 chars |
| `/en/blog/`, `/en/blog/what-is-…/`, `/en/contact/` + `/ar/` twins | 0 | 0 | 0 |

What disappears on `/en/`: the whole proof band (`142`, `AED 218M`, `6`,
`24 mo` and their labels), the AI-decision-queue heading pair and audit strip,
and every "Without the record" column. On the three product pages: the entire
`ArgumentBlock` (the three-point argument that carries the page's case) and every
`tm-grow` confidence bar, which stays at `scaleX(0)` — zero width. In the same run
`document.querySelector('noscript style')` returns an element, confirming the
`<noscript>` block *was* parsed as live markup and simply lost the cascade.
Screenshot: `design-plans/evidence-p1-nojs-en-home-proof-band.png` — `/en/`,
scripting disabled, scrolled to the proof band, rendering as empty ground below the
fixed header.

The block's other declarations are inert for the same reason: `.tm-live` /
`.tm-live-r` keep pulsing and `.tm-spark` keeps drawing with scripting disabled,
which the same `<noscript>` block was written to stop.

**Counter-exemplars.** `.reveal` (`global.css:189`) and `[data-reveal-group] > *`
(`global.css:204`) ship `opacity: 1; transform: translateY(0)` unconditionally and
let GSAP animate *from* an offset — the documented contract, correctly implemented.
The record chain degrades correctly too: with scripting disabled its five cards
measure `opacity: 1`, `transform: none`. And the repository's **other**
`<noscript><style>` block — `[data-nav-trigger] { display: none !important }` in
`src/components/layout/Header.astro` — works: it is the same idiom, and it marks
its one declaration `!important`.

**Correction (one change).** Mark the declarations in the `<noscript><style>`
block at `BaseLayout.astro:157-178` `!important`, matching the repository's only
other `<noscript><style>` block (`Header.astro`), which already writes its override
that way. `!important` is chosen over relocating the block because it is
order-independent: the block has to beat a stylesheet whose injection point Astro
owns and whose position is a consequence of the logged
`build.inlineStylesheets: 'always'` decision, so any fix that depends on document
order can silently regress if that decision is revisited. No new dependency, no new
token, no component markup changes, no effect on the scripted path.

**Residual risk to note for the executor.** `<noscript>` covers *scripting
disabled*. It does **not** cover scripting enabled but the module failing to run —
a blocked bundle, a CSP rejection, a parse error. The `CLAUDE.md` invariant is
phrased more broadly (*"a JS failure degrades to a correct page"*), and only
inverting the served state in `global.css` — start offsets behind a root marker
class that `redesignReveal.ts` sets before it queries any target, the shape
`.reveal` already uses — would satisfy that broader reading. That is a larger
change and a separate decision; the `<noscript>` repair restores what the
repository already decided it wanted.

---

### P2

#### P2-1 · The proof band's column separators become stray edge rules on every viewport below `lg`

**Contract.** Handoff `README.md` §3 (Home): *"Proof band: 4 centered stats with
count-up on view … hairline top+bottom (`rgba(255,255,255,0.06)`), **vertical
hairline separators**."* A separator separates two adjacent columns; when the grid
has fewer than four columns there are fewer separators to draw. `DESIGN.md`
→ Elevation & Depth: `hairline-soft` *"is chrome and decoration only."*

**Runtime path.** `src/components/home/ProofBand.astro:40` sets
`grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr))`;
lines `:58`, `:77`, `:94` each carry `border-s border-hairline-soft` — a fixed
`0,1,1,1` border pattern that is only correct when all four stats sit on one row.
Reaches both languages (`border-s` is logical, so under `[dir=rtl]` the stray rule
mirrors to the right edge).

**Measurement** (resolved `grid-template-columns` and per-child
`border-inline-start-width`, `/en/`):

| Viewport | Columns | Rows | Border pattern | Stray rules |
| --- | --- | --- | --- | --- |
| 375 | 1 | 4 | `0111` | 3 |
| 480 | 1 | 4 | `0111` | 3 |
| 640 | 2 | 2 | `0111` | 1 (stat 3 starts row 2) |
| 768 | 3 | 2 | `0111` | 1 (stat 4 starts row 2) |
| 900 | 3 | 2 | `0111` | 1 |
| 1024–1920 | 4 | 1 | `0111` | 0 — correct |

At 375 the result is a 1px vertical rule running down the inline-start edge of
stats 2–4 and absent from stat 1, so four equal statistics read as one plus a
three-item bracketed group. Screenshot:
`design-plans/evidence-p2-proofband-375-stray-rules.png`.

**Correction (one change).** Scope the separator to the width at which the grid is
guaranteed to be a single four-column row: replace `border-s` with `lg:border-s` on
`ProofBand.astro:58`, `:77` and `:94`. `lg` is exactly where the measurement above
shows four columns first appear, and it is a default Tailwind breakpoint — the
config states *"Tailwind defaults only. No bespoke breakpoints anywhere."* The
band's own `border-y border-hairline-soft` frame (`ProofBand.astro:38`) is
unaffected and continues to bound the stack at narrow widths.

---

### P3

#### P3-1 · The blog index gives its two identical section labels different heading levels, putting an 11.5px `h2` above 20.8px `h3`s

**Contract.** Direct contradiction in user-facing presentation inside one
component: `blog.latestLabel` and `blog.moreHeading` are the same kind of thing
(a mono uppercase label introducing a group of posts) and carry a byte-identical
class list, but one is a `<p>` and the other an `<h2>`. Supporting rule —
`docs/trumandate-site-spec.md` §3: *"Type roles, three only: Display and
headings…; Body…; Data and eyebrow"* — the data/eyebrow role is being asked to
carry a heading.

**Runtime path.**
- `src/components/blog/BlogIndex.astro:141` —
  `<p class="font-mono text-datum font-data uppercase tracking-datum text-muted">{t("blog.latestLabel")}</p>`
- `src/components/blog/BlogIndex.astro:213` —
  `<h2 class="font-mono text-datum font-data uppercase tracking-datum text-muted">{t("blog.moreHeading")}</h2>`

**Measurement** (1440, `/en/blog/` and `/ar/blog/`): the featured post title is an
`<h2>` at **29.6px**; "More posts" is an `<h2>` at **11.52px**; the two post-card
titles beneath it are `<h3>`s at **20.8px**. The document's `h2` level therefore
denotes both the largest and the smallest text on the page, and a heading renders
at 55 % of the size of the headings it outranks. Detected on `/en/blog/` and
`/ar/blog/` by an automated heading-size monotonicity check; no other route has an
inversion.

**Correction (one change).** Render `blog.moreHeading` with the same element as
its exemplar twelve lines of markup earlier in the same file — change
`BlogIndex.astro:213` from `<h2>` to `<p>`, class list unchanged, matching
`BlogIndex.astro:141`. Nothing else moves: the post cards keep their `<h3>`s and
the featured `<h2>` remains the page's only second-level heading.

---

## Conflict — RESOLVED 2026-09-02 (owner decision, implemented)

`CLAUDE.md` invariant: *"No full product screen appears on the site. Fragments
only, one per product page, **cropped at the section edge**."*

The three product-page fragments are capped at `max-width: 880px`
(`src/components/fragments/KpiCard.astro:116`, and the equivalent in
`InitiativeRows.astro` / `BenefitCurve.astro`), a value taken verbatim from
`Strategy (redesign).dc.html:54`. At 1440 the fragment's inline-end fade lands at
x = 1082 inside a content column that ends at 1238; at 1920 it lands at 1314
inside a column that ends at 1470, with a further 450px of empty ground beyond
that. The crop therefore falls mid-canvas, not at a section edge, and the effect
weakens as the viewport grows.

Two governing sources disagreed: the `CLAUDE.md` invariant, and `BUILD_FLAGS.md`
REDESIGN directive #2 (*"exact fidelity to the `.dc.html` references overrides all
repo conventions"*). Per `CLAUDE.md` — *"If a spec contradicts the code, stop and
say so. Do not silently pick one."* — it was surfaced rather than corrected.

**Resolution (owner, 2026-09-02):** *"don't rely on claude design references to the
core, audit may be right. it's okay to diverge."* The invariant wins; the reference
loses. Implemented the same day — the `max-width: 880px` cap is gone from all three
fragments, which now fill the section's own content box (`max-w-content` 1180px
minus two `px-gutter`s = 1036px from ~1324px up), so the crop lands on exactly the
x the header's CTA ends on. Re-measured with the chrome-devtools MCP, all six
routes at 1440 / 1920 / 375:

| Viewport | content-box / header-CTA inline-end x | fragment before | fragment after |
| --- | --- | --- | --- |
| 1440 EN | 1230.3 | 1074.3 | 1230.3 |
| 1920 EN | 1470.3 | 1314.3 | 1470.3 |
| 1440 AR | 194.3 (mirrored) | 350.3 | 194.3 |
| 1920 AR | 434.3 (mirrored) | 590.3 | 434.3 |
| 375 both | 340.0 EN / 20.0 AR | already flush | unchanged |

`scrollWidth === clientWidth` at every width in both languages, so the zero
horizontal overflow this page verified is preserved. `KpiCard.astro` needed two
supporting changes to keep its neighbouring card genuinely cut by a wider frame
(`width: calc(100% + 120px)` on the row, `flex: 1 0 560px` on the primary card);
the other two needed only the cap removed. Full reasoning, measurements and the
"do not restore the 880px cap" warning are in `BUILD_FLAGS.md`'s decisions log
under 2026-09-02, and in each fragment's own file header.

The `62ch` handoff-block half of the "dead space at 1920" observation below is
**not** covered by this change and remains open.

---

## Candidates not promoted

Each of these was measured and rejected against the evidence gate. Recorded so the
same ground is not re-litigated.

| Candidate | Why it was rejected |
| --- | --- |
| Record-chain cards measure 1.16:1–3.94:1 contrast on `/en/` | The redesign's own opacity formula (`README` §5: `0.08 + 0.92·max(0,(cos a+0.25)/1.25)`) governs; the faded cards are receding depth, and the active card is at full opacity. The older `opacity.rest: 0.57` AA gate applied to the superseded pinned text chain. Two contracts, one superseded — ambiguous, so rejected. |
| Command Centre board is horizontally cropped mid-word at 375 | `scripts/board.ts:38` documents `MOBILE_ZOOM_FLOOR = 0.45` and the reasoning for cropping rather than shrinking below it. Deliberate. |
| Contact hero H1 uses a bespoke inline `clamp(2.25rem, 3.4vw, 3.1rem)` rather than `text-display` | `ContactPage.astro:125-130` documents the two-column measure that requires it; `.dc.html` fidelity directive permits inline values. |
| `/en/contact/` eyebrow uses `text-mint` (the execution domain hue) on a page with no domain | `Contact (redesign).dc.html:36` sets `color: #4BEFC4` on that exact element. Reference-faithful. |
| Fragment/board/hero carry ~40 inline `font-size` values in px | Covered by REDESIGN directive #2; the fragments must be faithful to the real product UI at its own scale. |
| No current-page indicator or `aria-current` in the primary nav | `SiteHeader.dc.html` has none either, and no source requires one. No contract. |
| Footer and nav links measure 23px tall at 375 (under a 24×24 target) | Target size is WCAG 2.2 SC 2.5.8; the repo commits to WCAG **2.1** AA (`CLAUDE.md` Budgets). No binding contract. |
| No `font-variant-numeric: tabular-nums` anywhere, while Arabic swaps the datum role from Plex Mono to proportional Plex Sans | Real, and it does cost digit alignment in Arabic KPI columns — but no source requires tabular figures, and spec §3 mandates the face swap. Guideline, not contract. Worth raising with the owner separately. |
| Bare `z-index: 5` (`RecordChain.astro:190`) and `z-[1]` (`Hero.astro`) sit outside the named `zIndex` scale | Both are within-composition stacking well below the chrome scale (`header: 50` … `skip: 70`); correcting them would require inventing token names. Rejected on the "no inventing product intent" rule. |
| `text-body` is both a colour and a font-size utility, so `text-blog-* … text-body` on one element silently renders at 1rem | Documented at length in `tailwind.config.mjs` and `known-issues.md`. Grepped: **no live call site** pairs them. `text-lede`/`text-small` + `text-body` pairs are safe by alphabetical ordering. Latent risk only. |
| Blog index standfirst uses the site `text-lede` while the post header uses `blog-lede` | The blog scale is documented as "blog-only", not "blog-exclusive". No rule forbids the site scale in the index masthead. |
| Handoff sections leave large dead space on the inline-end side at 1920 (`max-width: 62ch` handoff block, `880px` fragments) | Same conflict as the fragment crop above; surfaced there rather than duplicated. **Update 2026-09-02:** the fragment half is resolved (see the conflict entry — the 880px cap is gone and the fragments now reach the content edge). The `62ch` handoff block is untouched and still open. |

---

## Verified fine

Checked and found conformant. Listed so the owner can see the coverage.

**Layout and structure**
- Zero horizontal overflow on all 14 routes at 375, 1440 and 1920
  (`scrollWidth === clientWidth` in every one of the 42 combinations).
- Exactly one `<h1>` per route; no heading-level skips on any route.
- Content column resolves to 1180px with a 72px gutter at 1440 → inner 1036px,
  content edge at x = 194.3 (classic scrollbar) / 202 (overlay). Header wrapper
  shares the identical box.
- Blog post grid arithmetic holds exactly: `264px + 68px gap + 704px = 1036px`,
  i.e. the TOC rail starts on the brand mark's edge and the article column ends on
  the CTA's edge. Verified in both languages; the rail mirrors correctly under RTL
  (rail at x = 966, prose at x = 194).
- Sticky TOC engages at `inset-block-start: 97px` (= `spacing.sticky-top`) with a
  630px (70vh) scroll cap.
- Measured ~80 characters per line in the article column at 1440 — inside the
  intended band.
- Contact intro column pins correctly at `lg` via `self-start`.
- Section rhythm resolves consistently: `py-section` = 99.1px at 900 tall,
  118.8px at 1080.

**Typography**
- Latin display renders at 68px / lh 1.06 / tracking −0.028em at 1440
  (`tracking-display-lg`); h2 44px / 1.14 / −0.015em; h3 26.4px / 1.20 / −0.01em;
  lede 19.2px / 1.55; eyebrow 11.2px / 0.16em; datum 11.52px / 0.10em — every one
  matching its token.
- **Arabic zeroes negative tracking everywhere it should**: h1, h2, h3, the
  wordmark (`.tracking-brand`) and nav links all compute `letter-spacing: normal`
  under `[dir=rtl]`, despite direct tracking utilities on the elements. Line
  heights swap correctly too — h1 1.32 (`display-ar`), h2/h3 1.40 (`heading-ar`),
  article prose 1.90 (`prose-ar`).
- Arabic swaps the mono role to Plex Sans 600 at 12.8px / 13.12px
  (`eyebrow-ar` / `datum-ar`) site-wide, with no per-component branching.
- Blog scale is genuinely separate from the marketing scale and correct in both
  languages (blog-title 44px, blog-h2 27.2px, blog-h3 19.44px, blog-body 20px/1.70).
- `text-wrap: balance` / `pretty` is applied on all 13 display and long-heading
  call sites.

**Colour and contrast**
- Every text node on all 14 routes clears WCAG 2.1 AA against its computed
  effective background, at real alpha compositing, once the documented
  reduced-motion end state is applied. The only sub-floor results are the record
  chain's deliberately receding cards (see candidates).
- The light request card's tokens land where the config claims: `form-ink`
  14.5:1, `form-body` 7.1:1, `form-muted` 5.7:1, `accent-deep` 5.0:1.
- Focus indicators are correctly overridden on the light surface: inputs,
  textarea, radio tiles, submit and the error-summary each set
  `outline-accent-deep` (or `outline-form-ink` on the accent-filled submit)
  instead of inheriting the site-wide `accent` ring, which is only 2.13:1 there.
- RAG discipline holds: `amber`/`red` appear only inside data components.

**Motion and chrome**
- Header scrolled state works: `.is-scrolled` toggles past 12px, the hairline is
  drawn by `[data-header]::after` at opacity 1 (not a `border-bottom`), and
  `shadow-chrome` is applied.
- Record chain degrades correctly without JavaScript — all five cards
  `opacity: 1`, `transform: none`.
- `.tm-load` / `.tm-boardload` are CSS animations and settle correctly with
  scripts blocked.
- Reduced-motion end states are present for every `tm-*` class and for
  `[data-chain-hint]`, and they win the cascade (they sit inside the same
  stylesheet, after the rules they override).
- The other `<noscript><style>` block — `[data-nav-trigger] { display: none
  !important }` in `Header.astro` — does work, and is the exemplar P1-1's
  correction follows.
- Zero console errors or warnings on the audited routes.

**Bilingual / RTL**
- Header CTA, language toggle, nav order, hero CTA pair, board sidebar, KPI tile
  order and fragment anchoring all mirror correctly at every audited width.
- Mobile drawer mirrors correctly (panel on the inline-start edge, close control
  on the inline-end edge), sizes to `min(85vw, 22rem)` and clears the header.
- Western digits used for KPI values in both languages, per spec §8.
- The `.tm-grow` bars flip `transform-origin` to `100% 50%` under `[dir=rtl]`;
  gradient pairs ship LTR/RTL angle variants and are selected at the call site.

---

## Improve first

**P1-1.** It is the only finding where the interface silently fails to deliver its
content: eight of the fourteen audited routes lose between 1,000 and 2,000
characters of body copy, every proof-band statistic and every confidence bar to a
reader with JavaScript disabled. It breaks a stated budget (*"readable with
JavaScript disabled"*), a stated invariant, and — most importantly — the repository
believes it is already fixed. `known-issues.md` records the defect as closed and
`BaseLayout.astro` ships the remedy, so nothing in the project's own records will
surface this again. The failure is four `!important` keywords deep, in one file,
with the working pattern sitting in a sibling `<noscript>` block in that same file.
