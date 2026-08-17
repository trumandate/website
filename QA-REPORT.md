# QA-REPORT.md — P8 full verification pass

Verified against a production build (`npm run build`) served from `dist/` on a
scratch static server, port 4323 (dev server on 4321 was never touched).
Chrome DevTools MCP (Chromium) for the primary matrix; `npx playwright`
(WebKit, driven by hand-written Node scripts, not added to `package.json`)
for the WebKit-specific checks the Chromium-bound Playwright MCP can't reach.

---

## 1. Defect fixed in this pass: header CTA wraps to two lines

Open since P1/P2, reproduced on every route through P7 (known-issues.md).

**Root cause** (found by measuring, not guessing): the CTA is a bare flex
item with the browser's default `flex-shrink: 1`. At 1440 the wrap was a
~1.5px sub-pixel shrink (plenty of layout room, but the browser's shrink
algorithm still trimmed it a hair under its own text's one-line width). At
375 it was real crowding: logo lockup + language toggle + a non-shrinking
"Request a walkthrough" needs ~432px against a 375px viewport — 56px short
in English, 36px short in Arabic (اطلب عرضاً توضيحياً is shorter in practice
despite reading longer).

**Fix, smallest change that holds in both languages at 375/768/1440:**
- `Button.astro` base classes gained `shrink-0 whitespace-nowrap` — no
  Button anywhere on the site can wrap or shrink again. (Hero's two-CTA row
  uses `flex flex-wrap`, so at narrow widths a whole button now drops to
  the next line instead of splitting mid-word — a strict improvement.)
- `Header.astro`: the "TruMandate" wordmark text is now `hidden sm:inline`
  (stock Tailwind breakpoint, no bespoke screen added). Below 640px only the
  logomark shows; the link's existing `aria-label` already carries the full
  brand name for assistive tech, so this is a display-only change, not a
  content change. Freeing ~85px of icon+gap+text at 375 comfortably covers
  the shortfall in both languages.

**Verified**, both languages, all three widths — CTA renders on one line,
`whiteSpace: nowrap` computed, and `scrollWidth === clientWidth` (no
overflow introduced):

| Width | EN button (h×w) | AR button (h×w) | EN overflow | AR overflow |
| ----- | ---------------- | ---------------- | ----------- | ----------- |
| 375   | 39.3 × 192.8      | 39.3 × 151.7      | none        | none        |
| 768   | 39.3 × 192.8      | 39.3 × 151.7      | none        | none        |
| 1440  | 39.3 × 192.8      | 39.3 × 151.7      | none        | none        |

Screenshots: `screenshots/p8/home-{en,ar}-375-header-fix.png`.

---

## 2. Results table — per route, per language

CPU throttling was not applied to the Fast 4G runs (`1x`); Slow 4G runs also
carried 4× CPU throttling. Machine was not otherwise under load during this
session, so the Slow-4G/4×CPU figures are directionally trustworthy but not
a substitute for a dedicated idle-machine re-measure (same caveat every
prior prompt in this build has carried — see known-issues.md P4/P6/P7).

| Route      | Lang | LCP (Fast 4G) | LCP (Slow 4G + 4×CPU) | CLS  | Lighthouse a11y | Console | Overflow (375/768/1440) |
| ---------- | ---- | ------------- | ---------------------- | ---- | ---------------- | ------- | ------------------------ |
| Home       | en   | 136 ms        | 385 ms                  | 0.00 | 96 †             | 0       | none / none / none       |
| Home       | ar   | 160 ms        | 398 ms                  | 0.00 | 96 †             | 0       | none / none / none       |
| Strategy   | en   | 156 ms        | 363 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Strategy   | ar   | 146 ms        | 395 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Execution  | en   | 151 ms        | 336 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Execution  | ar   | 156 ms        | 428 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Benefits   | en   | 133 ms        | 305 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Benefits   | ar   | 134 ms        | 466 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Contact    | en   | 89 ms         | 308 ms                  | 0.00 | 100              | 0       | none / none / none       |
| Contact    | ar   | 107 ms        | 298 ms                  | 0.00 | 100              | 0       | none / none / none       |

† Home's accessibility score and its cause are §5 below — a real,
documented, **not silently fixed** finding.

**Budget verdict (spec §9):** LCP < 2.0s — PASS on all 10 routes in every
condition tested; worst figure is 466 ms (`/ar/benefits`, Slow 4G + 4×CPU),
23% of budget. CLS < 0.05 — PASS everywhere, every run measured exactly
0.00. Console errors — zero on all 10 routes, all conditions. Horizontal
overflow — zero on all 10 routes at 375/768/1440 (`scrollWidth ===
clientWidth` in every check).

**Lighthouse performance category:** chrome-devtools MCP's `lighthouse_audit`
tool explicitly excludes the performance category by design ("For
performance audits, run performance_start_trace" — its own tool
description). No Lighthouse performance *score* was produced by this
toolchain; the LCP/CLS trace figures above are the performance evidence for
this pass. Lighthouse Best Practices was 100 and Agentic Browsing 100 on
every route (not part of spec §9's tracked budget, recorded for
completeness). SEO scored 63 on every route (also outside spec §9's
tracked list; not investigated this pass).

Screenshots: `screenshots/p8/{route}-{lang}-{375,768,1440}.png` (30 files,
all present).

---

## 3. WebKit findings (Playwright, driven directly — MCP is Chromium-only)

Genuine WebKit confirmed: `AppleWebKit/605.1.15 ... Version/26.5 Safari/605.1.15`.

**Chain sticky marker + scrubbed timeline** (1440×900, `[data-chain-marker]`
only renders at the `lg` breakpoint):

| Route | Engage scrollY (sticky top settles at 104px) | Release scrollY | Count/name text updated | Console errors |
| ----- | --------------------------------------------- | ---------------- | ------------------------ | --------------- |
| /en/  | 1750                                            | 2500              | yes, 01/05 → 05/05        | 0                |
| /ar/  | 1650                                            | 2300              | yes, correct Arabic names | 0                |

`position: sticky` (not a GSAP pin) engages and releases cleanly in WebKit;
the GSAP ScrollTrigger scrub runs correctly — the historical Safari risk
this check exists for did not reproduce.

**Language-toggle header geometry**, 3 route pairs (`/`, `/strategy`,
`/contact`) × 2 viewports (375×812, 1440×900): header height/position
pixel-identical between EN and AR in all 6 comparisons (delta 0). No layout
shift on language switch.

**Arabic fragment SVGs** (`KpiCard`, `InitiativeRows`, `BenefitCurve`) at
375/1440: RTL `text-anchor` resolution renders correctly — right-aligned
Arabic text, no mirrored/garbled glyphs. `InitiativeRows`' row 4 (name,
objective, "66%") intentionally extends past its own SVG box at both widths
— that is the fragment's documented crop-signals-continuation design
(`InitiativeRows.astro` lines 94–101, 145–148), not a defect. `KpiCard` and
`BenefitCurve` had zero overflowing `<text>` elements.

**Total console errors/warnings across every WebKit task: 0. No
WebKit-specific defect found.**

Screenshots: `screenshots/p8/webkit/` (18 files — header-geometry pairs,
Arabic fragment crops).

---

## 4. Manual checks

**`prefers-reduced-motion: reduce`, all 10 routes.** Verified with a
`matchMedia` override injected via `initScript` before page scripts run
(confirmed active: `window.matchMedia('(prefers-reduced-motion: reduce)').matches
=== true` on every route). Result: zero elements ever reach `.opacity-rest`
on either home route (vs. 5 under normal motion) — every chain-link name/body
renders at full opacity from first paint. Every product-page fragment's wipe
mask is already at its fully-revealed width (`460`/`360`, matching the
SVG's own viewBox — nothing clipped). Zero console messages on any route.
Screenshots: `screenshots/p8/reduced-motion/*-375.png` (10 files).

**Keyboard-only navigation.** Skip link, tab order, and focus visibility
checked by reading `document.activeElement` after each `Tab` (not just
visually). `:focus-visible` shows a solid 2px accent outline on every stop
checked (skip link, logo, nav links, language toggle, CTA, submit).

- *Skip link*: activating it (`Tab`, `Enter`) moves the effective focus
  point to `#main`; the very next `Tab` lands on the first focusable element
  **inside** `<main>`, completely bypassing the header's nav/toggle/CTA —
  confirmed by checking `el.closest('main')` and the element's `top` (492px,
  well below the fixed header). `document.activeElement` itself reports
  `<body>` immediately after activation (expected: `<main>` has no
  `tabindex="-1"`), but downstream `Tab` behavior is what matters and it is
  correct in Chromium. Not tested in WebKit this pass; a `tabindex="-1"` on
  `<main>` would make this robust by spec rather than by Chromium's
  navigation-history-based fallback — worth adding cheaply, logged in
  TODO.md rather than changed here since it isn't broken today.
- *Home template*: Skip → logo → Strategy → Execution → Benefits → Contact
  (nav) → العربية/English (toggle) → Request a walkthrough (header CTA).
  Matches DOM order exactly, 8 stops.
- *Product template* (`/en/strategy`, representative of all three): same 8
  header stops, then the page's `SuggestionCard` (Accept → Modify → Reject),
  then the closing `Handoff` CTA. No traps, no skipped/duplicated stops.
- *Contact template*: same 8 header stops, then the `mailto:` line, then
  Name → Organisation → Work email → the four-radio "what you want to see"
  group as **one** tab stop (native radio-group behavior) → Message →
  Submit. No honeypot stop appears (its `tabindex="-1"` holds). Matches
  known-issues.md's P7 finding exactly — confirms this pass's Button/Header
  changes did not disturb it.

**JavaScript disabled, all 10 routes.** Verified with a real
`javaScriptEnabled: false` WebKit context (Playwright, driven directly —
chrome-devtools MCP has no script-disable toggle). Every route: HTTP 200,
substantial visible text (514–3708 characters), a real `<h1>`, all 4 nav
links present with real `href`s, zero page errors. Both fragment wipe masks
render at their fully-revealed width with no JS (`360` home, `460` product
pages — same "already-finished" degradation as reduced motion, per
CLAUDE.md's "a JS failure degrades to a correct page" invariant). The
contact form carries a real `action="https://formspree.io/f/placeholder"
method="POST"` on both `/en/contact` and `/ar/contact`, so the native
browser POST path works with no script at all. Screenshots (3
representative, as asked): `screenshots/p8/no-js/home-en-375-nojs.png`,
`strategy-ar-375-nojs.png`, `contact-en-375-nojs.png`.

**Contrast — every real token pair extracted from the built pages.**
Extracted programmatically (walked every element with direct text, resolved
each one's computed `color` and nearest ancestor's non-transparent
`background-color`, deduped) on `/en/` at 1440px, then checked each unique
pair against WCAG AA (4.5:1 normal text / 3:1 large text ≥18.66px-bold or
≥24px). All 19 real pairs found — wordmark, nav, hero, eyebrow, datum
labels, the AI card block, footer, `RagDot`'s visually-hidden status text —
**pass**, several with wide margins (7.3–15:1). SVG-fragment text
(`fill-*` classes) isn't reachable through `getComputedStyle().color` (SVG
paints from `fill`, not `color`), so those were checked directly against
their token values instead — `muted`/`paper`/`accent` on `surface`/
`surface-deep` all pass at 5.5:1–16.7:1.

PLAN.md §4's two flagged close pairs, recomputed independently (WCAG
relative-luminance formula, not eyeballed):

| Pair                | PLAN.md's figure | Recomputed | Verdict                        |
| ------------------- | ---------------- | ---------- | ------------------------------- |
| `accent` on `jade`  | 4.6:1             | 4.52:1     | PASS AA-normal, no margin (the AI card's "Accept" button text sits at exactly this pair, 15px) |
| `muted` on `jade`   | 4.8:1             | 4.79:1     | PASS AA-normal, no margin        |

Both confirmed passing, both confirmed to have zero headroom — consistent
with PLAN.md's own conclusion that neither survives any future token nudge.

**The one real contrast failure found — not silently fixed, per CLAUDE.md's
"if a spec contradicts the code, stop and say so."** Lighthouse's
rendering-aware contrast check (which, unlike the DOM-pair extraction above,
accounts for element `opacity`) flagged 10 violations on the home page, both
languages: every chain-link name (`h3`, `text-paper` at `opacity-rest`) and
body line (`p`, `text-body` at `opacity-rest`) that hasn't yet scrolled past
its own activation trigger. Recomputed by hand: `text-paper` (#F1F5F3) at
the token's own 0.40 opacity over `ink` (#04241E) sits at **3.49:1** for the
name and **2.92:1** for the body copy — both below the 4.5:1 AA-normal
floor (these are 19.2px/16px, neither qualifies as "large text"). Reaching
4.5:1 would need roughly 0.49–0.50 opacity, not 0.40.

This isn't a bug to patch — spec §7 states the exact number: *"each node's
caption lifts from **40%** to full opacity"* (motion #1, the signature
motion). Spec §9 separately requires WCAG AA contrast and Lighthouse
accessibility 100. At this specific pairing (`text-paper`/`text-body` on
`ink`, at these font sizes) the two requirements are mutually exclusive at
the token's current value — bumping `opacity.rest` to clear AA would change
a value spec §7 states as a number, and CLAUDE.md is explicit that this
build does not silently pick one side of a spec conflict. **Left unfixed,
flagged here** for a design decision: raise `opacity.rest` (breaks the
literal "40%" in spec §7, but the smallest fix — 0.49 clears both text
roles), restate spec §7's number, or accept the transient pre-activation
state as an intentional, brief AA exception (every node clears to full
contrast within moments of scrolling into view, and a reduced-motion or
JS-failure reader never sees the dimmed state at all — only a sighted,
motion-safe reader scrolling past an as-yet-unreached node sees it, and only
until they reach it). Confined entirely to the home route in both
languages; every other route scored Lighthouse accessibility 100 and none
of them use `opacity-rest` at all (`grep -rn opacity-rest src` — the class
appears only in `ChainLink.astro`/`chain.ts`, home page only).

**RAG-dot hidden status text (WCAG 1.4.1), every fragment/panel using RAG
colours.** Checked all four: `ObjectiveRecord`'s `RagDot.astro` instances
already carry a `visually-hidden` status word per dot (unchanged, verified
present in built HTML: `class="visually-hidden">Status: on track` /
`...at risk`). `KpiCard.astro`'s single amber dot is already covered — its
own `aria-label` states "Status: at risk." verbatim. `InitiativeRows.astro`'s
three dots (on-track/at-risk/off-track) are already covered — the status
word is built into each row's slice of the `aria-label` sentence, both
languages. `BenefitCurve.astro` and `CommandCentreDim.astro` use no RAG
colour at all (single-hue by construction, verified from source), so
nothing applies.

**`StageGateQueue.astro`'s dot was the one gap, fixed in this pass.** Its
amber dot (styled identically to the RAG dots elsewhere) had no
status word anywhere in its DOM or `aria-label` — colour alone carried it,
which is exactly the WCAG 1.4.1 failure `RagDot.astro` exists to prevent
everywhere else on the site. Fixed by appending the same shared
`ragStatus.atRisk` string `RagDot.astro` already uses (i18n/ui.ts, both
languages) to this fragment's `aria-label` — no invented copy, same word the
rest of the site already uses for "amber." Verified in the built HTML, both
languages:
- EN: `"...one item queued behind it. Status: at risk"`
- AR: `"...وعنصر واحد ينتظر الدور بعدها. الحالة: في خطر"`

---

## 5. Standing greps and static invariants (re-run after both fixes, on the final build)

- **Physical-direction grep** (`ml-`/`mr-`/`pl-`/`pr-`/`text-left`/
  `text-right`): zero real hits in `src/`. The one match (`global.css:87`)
  is inside the comment explaining why those utilities don't exist —
  identical to every prior prompt's finding.
- **Hex-outside-config grep**: zero hits anywhere in `src/`. Every colour is
  still a `tailwind.config.mjs` token.
- **Banned marketing words**, grepped against the *built* English HTML (all
  5 EN routes, rendered prose, not source): zero hits for leverage,
  seamless, robust, holistic, empower, revolutionise, insights, AI-powered,
  single source of truth, game-changing, best-in-class, unlock, end to end,
  complete, full suite.
- **`/ar` loads no mono font, any route**: confirmed via each Arabic page's
  `<link rel="preload">` list — 4 preloads (Arabic 300/600, Latin 300/600),
  never `plex-mono`. `grep -rn opacity-rest` etc. confirms no Arabic
  fragment references `font-mono`/`fill-mono` anywhere (all swap to Plex
  Sans per BUILD_FLAGS' documented rule). Not re-verified via a live network
  trace this pass (static preload-list check only) — same method prior
  prompts used.
- **Curiosity-ledger fragment count**: exactly one `data-fragment` SVG per
  product page (`grep -c data-fragment dist/{en,ar}/{strategy,execution,benefits}/index.html`
  → 1 each, 6/6). Home page carries exactly two fragment surfaces:
  `StageGateQueue` (one `data-fragment` SVG, inside `ChainSection`) and
  `CommandCentreDim` (one `<div class="command-centre-dim">`, inside
  `ClosingCta`, `aria-hidden`, no `data-fragment` attribute since it isn't
  wipe-animated) — both confirmed to appear exactly once per home route,
  both languages.
- **`npm run build`**: clean, 11 pages generated, no errors.
- **`npm run check`**: clean — 62 files, 0 errors, 0 warnings, 0 hints.

---

## 6. Failures found that were NOT fixed, with reasons

1. **Home page chain-link rest-state contrast (§4 above).** `text-paper`/
   `text-body` at the spec-mandated 0.40 `opacity-rest` measures 3.49:1 /
   2.92:1 against `ink`, below the 4.5:1 AA-normal floor, on both `/en/` and
   `/ar/` (Lighthouse accessibility 96, not 100). Not fixed because the
   0.40 value is an explicit number in spec §7 ("40% to full opacity"), and
   CLAUDE.md requires stopping and surfacing a spec-vs-spec conflict (§7 vs
   §9) rather than unilaterally picking a side. Needs a design decision:
   raise the opacity token (≈0.49 clears both text roles), amend spec §7's
   number, or accept the transient pre-scroll state as a stated exception.

No other failure was found across the full budget/accessibility/behavioural
matrix run this pass.
