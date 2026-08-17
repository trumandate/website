# known-issues.md — TruMandate site

Known defects, each with a reason. Not prose in a spec, not buried in chat.

## P1

**PLAN.md §2's `corePlugins` mechanism doesn't fully deliver what it claims,
verified empirically.** PLAN.md says disabling `space`/`float`/`clear`/
`textAlign` "makes [ml-, pr-, text-left] fail at build time instead" of
relying only on the grep. Tested by temporarily adding
`ml-4 mr-4 pl-4 pr-4 text-left` to a component and rebuilding:

- `text-left` — correctly absent from the compiled CSS. `textAlign` is a
  single corePlugin covering all text-align values, so disabling it removes
  the whole utility group, `text-left` included.
- `ml-4`, `mr-4`, `pl-4`, `pr-4` — all four **compiled fine**. Tailwind v3's
  `margin` and `padding` corePlugins each cover every side (`m-`, `mx-`,
  `my-`, `mt-`, `mr-`, `mb-`, `ml-`, `ms-`, `me-`) as one plugin; there is no
  way to disable only the physical left/right variants while keeping `mx-`,
  `mt-`, `mb-`, etc. `space: false` (which PLAN.md's comment groups with this
  effort) actually governs the unrelated `space-x-*`/`space-y-*` sibling-
  margin utilities, not `ml-`/`mr-` at all.

This does not weaken CLAUDE.md's actual invariant: the mandated enforcement
is the grep (`grep -rEn '\b(ml|mr|pl|pr|left|right)-' src/`), which this
session ran clean with zero real hits (two incidental substring matches in
comment prose: "brighter" contains "right"; one comment explicitly discusses
why `text-left`/`text-right` can't exist). `float`/`clear` disabling does
work as PLAN.md describes, same reasoning as `textAlign`. Flagging this
because PLAN.md's own justification overstates the build-time guarantee for
margin/padding specifically, and a future contributor relying on that
sentence would be wrong to assume `ml-4` won't compile.

## P2

**`font-semibold` was used throughout the P1-built shared components and
compiled to nothing.** `tailwind.config.mjs`'s `fontWeight` is replaced
wholesale (not `extend`ed) with `{ light: "300", semi: "600", data: "500" }`,
so Tailwind only ever generates `.font-light`, `.font-semi`, `.font-data` —
the default-scale name `font-semibold` was never a real utility here. Verified
by grepping the compiled `dist/_astro/*.css` from a clean P1 build: zero
matches for `font-semibold` anywhere in the stylesheet, meaning `Header.astro`'s
wordmark and CTA, `Nav.astro`'s links, `LangToggle.astro`, and `SkipLink.astro`
were all silently rendering at an unstyled weight instead of 600 — found while
building P2, which depends on this weight rendering correctly for every
heading and button on the home page. Fixed by changing all five call sites
from `font-semibold` to `font-semi`. No config change: the token name `semi`
was already correct and intentional (PLAN.md §2), only the call sites were
wrong.

## P4

**Home page LCP exceeds the 2.0s budget (spec §9) under a throttled 4G
mobile profile (Slow 4G + 4x CPU, chrome-devtools MCP), though it clears it
easily unthrottled.** Measured on the production build (port 4323):
unthrottled LCP 389ms / CLS 0.00; throttled LCP 2,403ms / CLS 0.00 (CLS is
fine in both cases). The LCP element is the hero `<h1>` — text, not an
image — so the delay is entirely "render delay" (TTFB ~10–14ms in both
cases), not a slow network fetch of the LCP resource itself.

Two contributors, one fixed at P4, one left open:

1. **Fixed.** Wiring motions 2–5 across the whole home page (this prompt)
   put six separate per-component `<script type=module>` files on the page
   at once (`reveal.ts`, `chain.ts`, `aiCard.ts`, `counter.ts`,
   `fragment.ts`, plus the shared `motion.ts`), each independently calling
   into GSAP's ScrollTrigger the moment it finished loading. Under real
   network latency they don't finish executing in the same tick, so each
   one's `ScrollTrigger.create()` landed outside GSAP's own same-frame
   batching window and forced its own full-document layout recalculation —
   chrome-devtools MCP's ForcedReflow insight showed 826ms of reflow time
   across three separate layout passes before the fix. `motion.ts`'s
   `whenMotionSafe` now runs the actual setup callback inside one
   `requestAnimationFrame`, so the browser gets a chance to paint (LCP
   included) before any script's ScrollTrigger measurement work runs,
   regardless of how staggered the six files' loads are. This alone took
   throttled LCP from 3,031ms to 2,403ms and reflow time from 826ms to
   244ms — verified by re-running the identical trace before/after.
2. **Resolved in a later prompt (LCP/CSS follow-up).** The remaining gap was
   `index.C33NeEnG.css` (17,353 bytes) being render-blocking and taking
   ~600–1000ms to become available under Slow 4G (chrome-devtools MCP's
   RenderBlocking insight: "estimated savings: LCP ~604–611ms" across two
   independent measurement sessions), competing for throttled bandwidth
   against the three preloaded font files declared in `BaseLayout.astro`.
   Re-measured from a clean production build (`npm run build`, served from
   `dist/` on a scratch static server, port 4323 — the dev server on 4321
   and `astro preview` were left untouched):
   - Slow 4G + 4x CPU: LCP 1,925–1,934ms (two runs) before the fix, 1,137ms
     after. CLS 0.00 in both.
   - Fast 4G, no CPU throttle: LCP 607ms before, 344ms after. CLS 0.00 in
     both.
   - LCP element confirmed via `LCPBreakdown` insight both times: the hero
     `<h1 class="... text-display ...">` — "Every mandate, traced to the
     outcome it promised." — text, not an image; TTFB was 5–10ms in every
     run, so 100% of LCP was render delay, not a network fetch of the LCP
     resource itself.

   Fix: `astro.config.mjs`'s `build.inlineStylesheets` set to `'always'`
   (was Astro's default `'auto'`, which only inlines stylesheets under
   Vite's ~4KB asset limit — this project's one global stylesheet sits well
   above that, so it was always shipped as an external `<link>`). This
   removes the stylesheet as a network request entirely; `RenderBlocking`
   no longer appears in the trace's insight list after the change.
   `dist/en/index.html` grew from 26,141 → 43,452 bytes (+17,311, i.e. the
   CSS is now paid for as inline HTML bytes instead of a separate fetch),
   which gzips to 9,882 bytes — trivial against the 900KB first-load
   budget (spec §9). Font preloads were also audited as part of this pass:
   `/en/` preloads exactly the 3 Latin subsets (sans-latin-300 20,284B,
   sans-latin-600 20,500B, mono-latin-500 14,888B — ~56KB combined, matches
   the PLAN.md §1 accounting), no Arabic subset is preloaded on `/en/`, and
   `font-display: swap` is set on all five `@font-face` rules in
   `fonts.css`. Nothing there needed to change; the mono preload was
   evaluated for removal but the hero's `Eyebrow` component (above the
   `<h1>`, using `font-mono`) renders in it, so dropping the preload would
   trade a render-delay problem for a FOUT/FOIT problem on the very first
   text the page paints — not a net win. No console errors in any run;
   `npm run check` and the physical-direction grep both stayed clean.

   One forward-looking trade-off, not a defect: `inlineStylesheets: 'always'`
   means every route's full stylesheet ships inline in that route's HTML,
   so as more routes are built (`/ar`, the three product pages, `/contact`)
   each one repeats the ~17KB (~10KB gzipped) stylesheet rather than sharing
   one cached external file across the site. Acceptable for a marketing
   site where hitting the LCP budget on a visitor's first page matters more
   than shaving bytes on a same-visitor second pageview; revisit (e.g. a
   critical-CSS split, or dropping back to `'auto'` once the shared
   stylesheet is small enough to clear the 4KB threshold on its own) if the
   route count grows enough that this starts to matter. Logged in
   `BUILD_FLAGS.md`'s decisions log.

   A secondary, unrelated finding surfaced while auditing font preloads:
   `LangToggle.astro` renders "العربية" (the link text for switching to
   Arabic) even on `/en/`, so the browser fetches
   `plex-sans-arabic-arabic-600.woff2` on the English page — not preloaded,
   discovered late (after the four other requests, non-render-blocking),
   so it does not affect LCP. Not a defect, just worth naming: "no locale
   loads all five font files" (BaseLayout.astro's own comment) is true of
   preloads, not of every font file the page will eventually fetch.

**No WebKit-specific verification was possible in this environment.** Spec
§10 asks for the scroll sequence to be repeated in Playwright/WebKit
specifically. The Playwright MCP available in this session is bound to a
Chromium engine (confirmed via `navigator.userAgent`) with no
browser-selection tool exposed, so a genuine WebKit pass on the pinned
`ChainMarker` sticky column and the five new ScrollTrigger-driven motions
could not be run. Reduced-motion and the forced-reflow fix were both
verified in Chromium instead.

## P5

**The content brief's Arabic is internally inconsistent about digit style
for the same kind of quantity, and it ships as-written (spec §8's numeral
rule says Arabic-Indic digits only where the brief already uses them, and
"verbatim" wins over silently normalising the brief).** Chain link 5
(Benefit) reads "تُقاس 24 شهراً" — Western digits — while the AI suggestion
card's title reads "تأخير متوقَّع في المعلم: ١٢ يوماً" — Arabic-Indic digits
— for the same kind of value (a duration in months/days). Both are on the
home page, one section apart. Not corrected, per PLAN.md §4 ambiguity 15
and BUILD_FLAGS' "Arabic for the product pages is produced only after
English is approved" posture extended here to "the brief's own copy isn't
Claude Code's to edit" — flagging it for Piyush rather than silently
picking a side.

**Astro's scoped-style processor hashes every compound selector segment in
a rule, including ancestor selectors that reference elements outside the
component — which silently broke two `[dir="rtl"] .foo` overrides written
at P4, and would have broken every one written the same way at P5.**
`SuggestionCard.astro`'s confidence-bar `transform-origin` flip (written at
P4) and `CommandCentreDim.astro`'s whole-group mirror (written at P5)
were both authored as plain `[dir="rtl"] .some-class { ... }` — the pattern
already used successfully in `global.css` for line-height/letter-spacing.
The difference: `global.css` is a plain imported stylesheet, never scoped;
these two rules live in component-level `<style>` blocks, which Astro
processes by appending a `[data-astro-cid-xxxxx]` attribute selector to
*every* compound selector in the rule — producing
`[data-astro-cid-xxxxx][dir="rtl"] .foo[data-astro-cid-xxxxx]` instead of
`[dir="rtl"] .foo[data-astro-cid-xxxxx]`. Since `dir="rtl"` lives on
`<html>`, an element neither component ever renders (and which therefore
never carries that scope-hash attribute), the compiled selector could never
match, in either language, ever. Confirmed by inspecting the compiled CSS
in `dist/ar/index.html` directly (`grep`), not by assuming from source —
the bug produces zero console errors and zero build warnings; the only
symptom is the wrong-but-plausible-looking rendered output (confidence bar
growing from the wrong edge, Command Centre composition not mirroring).
`SuggestionCard.astro`'s copy of this bug had existed since P4 and was
undetected because `/ar` didn't exist yet to exercise the `[dir="rtl"]`
branch at all. Fixed in both files with `:global()` around the ancestor
half of the selector (`:global([dir="rtl"]) .foo`), which tells Astro's
scoping processor to leave that segment unhashed. Any future
component-scoped style that needs to key off an ancestor attribute/class
that isn't rendered by the same component needs the same `:global()`
treatment — `global.css` remains the simpler default for anything that
doesn't need per-component scoping at all.

**`StageGateQueue.astro`'s SVG `<text>` elements inherit `direction` from
the document root, which changes what `text-anchor: start`/`end` mean and
broke every hand-mirrored coordinate on first attempt.** `direction` is an
ordinary inherited CSS property and does cascade through `<svg>` into
`<text>` in evergreen engines. The fragment's Arabic geometry was
hand-computed on the assumption that `text-anchor: start` means
"left-aligned, grows right" and `end` means "right-aligned, grows left" —
true only under `direction: ltr`. Under the inherited `direction: rtl`
(from `html[dir="rtl"]`), those meanings swap, which clipped most of each
Arabic label against the viewBox edge (visually: `ر. الهاشمي` truncated to
`شمي`, `الاستحقاق` to `تحقاق`, `بوابة المرحلة · 04` to a couple of
characters) — found by screenshotting the built fragment, not by reading
the source. Fixed by pinning `.stage-gate-queue { direction: ltr; }` in the
fragment's own scoped style, which locks `start`/`end` to the physical
meaning the coordinates were authored against regardless of the page's own
`dir`. This does not affect the Arabic glyphs themselves — the Unicode
bidi algorithm still shapes and orders them right-to-left based on their
own strong-RTL character properties, independent of the paragraph
`direction`.

**A Western-digit pair joined by a bare separator (`"68 / 75"`, and the
chain marker's `"01 / 05"`) renders visually reversed inside RTL flow —
a Unicode bidi artefact, not a markup bug.** The DOM's text order was
always correct (verified via `textContent`); what a sighted reader sees
without an explicit bidi isolate is `"75 / 68"`, because two runs of "weak"
European-number characters separated by a neutral "/" have no strong-
direction anchor between them, so the bidi algorithm is free to reorder
them relative to the surrounding RTL paragraph. Fixed by adding
`dir="ltr"` to the specific `Datum` instances (`ObjectiveRecord.astro`)
and the chain marker's count paragraph (`ChainMarker.astro`) — `dir` on an
element with no other conflicting styling also sets `unicode-bidi:
isolate` per the HTML rendering spec's UA stylesheet, which is exactly the
isolation these composite Western-digit values need. Values anchored by a
strong-direction character on at least one side (`"AED 41M"`, `"v3"`) were
never at risk and needed no change, but got the same treatment anyway
since Datum's whole purpose (spec §3) is exactly this class of
machine-precision value.

## P6

**The Slow 4G + 4x CPU LCP figures measured this session are contaminated by
host CPU load and must not be compared to the P4 baseline above.** The host
sat at 92–93% CPU throughout (`Win32_Processor.LoadPercentage`), driven by
unrelated processes — VS Code, Docker Desktop and `com.docker.backend`,
OneDrive syncing this very repo directory, Teams. A 4x CPU throttle multiplies
whatever contention already exists, so the throttled render-delay figures
inflate and drift run to run. The proof is the control: `/en/`, which was NOT
touched by this prompt, measured 2,846 / 3,391 / 3,785 ms across three runs in
this session against the 1,137 ms recorded for the same build in the P4
section above. The page did not change; the machine did.

What was measured, all on the production build served from `dist/` on the
scratch static server (port 4323 — the user's dev server on 4321 was left
untouched), with the server gzipping text responses so it behaves like
Cloudflare Pages:

| Route            | Slow 4G + 4x CPU | Fast 4G, no CPU throttle | CLS  |
| ---------------- | ---------------- | ------------------------ | ---- |
| `/en/` (control) | 3,391 ms         | 564 ms                   | 0.00 |
| `/en/strategy`   | 3,625 ms         | 525 ms                   | 0.00 |
| `/en/execution`  | 3,597 ms         | 425 ms                   | 0.00 |
| `/en/benefits`   | 1,454 ms         | 405 ms                   | 0.00 |

Two things this table does establish, contamination notwithstanding:

1. **No new route is slower than the untouched control.** Under the clean
   Fast 4G profile all three product pages beat `/en/` (405–525 ms vs 564 ms),
   which is what the structure predicts — they have no pinned section, no
   scrubbed timeline and no counter, so they load three motion scripts where
   the home page loads six.
2. **`/en/benefits` returned 1,454 ms on the same throttled profile** that
   gave its structurally identical sibling `/en/execution` 3,597 ms, during a
   momentary dip in host load. Identical page structure, identical asset set,
   2.5x difference — that spread is the contention, not the pages.

CLS is 0.00 on every route in every run, comfortably inside spec §9's 0.05,
and CLS is not sensitive to CPU contention the way render delay is, so that
figure stands on its own. TTFB was 7–45 ms throughout; 100% of LCP was render
delay in every run, and the LCP element on all three product pages is the
page's `<h1>` — text, not an image, and not a network fetch.

No render-blocking request appears in any trace (the P4
`inlineStylesheets: 'always'` fix holds on the new routes). Zero console
messages of any type on all three routes. Re-measure on an idle machine
before treating spec §9's 2.0 s LCP budget as either met or missed on these
routes — carried in TODO.md.

**The header's "Request a walkthrough" CTA wraps to two lines, and has since
P1/P2.** Measured on `/en/strategy` and confirmed on the untouched `/en/`
home page: the anchor renders 63px tall against a 23.312px computed
line-height, i.e. two lines, at both 375 and 1440. Not introduced by P6 —
`Header.astro` was not modified this prompt — but it is visible in all six P6
screenshots, so it is recorded here rather than left to be rediscovered. The
fix is a `whitespace-nowrap` on the header's CTA or a shorter header-only
label; both are `Header.astro` changes and out of scope for a copy-and-pages
prompt. Logged in TODO.md.

**`text-body` names both a colour token and a fontSize token
(tailwind.config.mjs).** Verified this does NOT collide destructively: Tailwind
emits two separate `.text-body` rules in the compiled CSS (one setting
font-size/line-height/letter-spacing, one setting `color`), and since they
target different CSS properties on the same selector, both apply — `class="text-body"`
correctly gets 1rem/1.55/0em AND `#C6DAD3` simultaneously. Recorded here only
because it looked like a real defect before the compiled output was checked;
no action needed, and no future contributor should "fix" the apparent name
collision.
