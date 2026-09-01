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

---

## P6-AR

**Nothing was found broken in the RTL work this prompt, and that is worth
stating plainly**, because P5's equivalent section records two genuine bugs
(the scoped-style `[dir="rtl"]` that could never match, and `text-anchor`
changing meaning under an inherited direction). Both were avoided here by
construction rather than by luck: every new `[dir="rtl"]` rule is written as
`:global([dir="rtl"]) .class`, and every mirrored geometry states its own
`direction` rather than inheriting one. The notes below are observations and
accepted trade-offs, not defects.

**Two direction-handling patterns now coexist in `components/fragments/`.**
`StageGateQueue.astro` (P5) pins `direction: ltr` in both languages and flips
each `text-anchor` by hand. `KpiCard.astro`, `InitiativeRows.astro` and
`BenefitCurve.astro` (P6-AR) pin `ltr` for LTR pages and set `rtl` on the
mirrored branch, letting `text-anchor: start`/`end` resolve logically. Both
render correctly today. The newer pattern is strictly better for any label that
mixes Arabic with digits: under a pinned-LTR paragraph the Arabic run is laid
out to the LEFT of the number, so an Arabic reader's eye lands on the number
first. `home.stageGate.dueValue` ("14 أغسطس") is exactly that kind of label, so
StageGateQueue has a real (small, cosmetic) instance of the problem the newer
pattern solves. Migration logged in TODO.md; not done in the same pass that
introduced the second pattern, so that if the newer approach turns out to
misbehave in Safari there is still one fragment on the old one to compare
against.

**The `/ar/execution` page shows Arabic-Indic and Western digits within one
scroll.** Its AI card reads "المبادرة ٠٧ والمبادرة ٢١"; its fragment reads
"الهدف 1.2". This is the home page's existing split (brief-verbatim
Arabic-Indic in page copy and AI cards, Western in product surfaces per spec
§8), applied consistently rather than a new inconsistency — but it is the kind
of thing a reviewer notices and reports as a bug, so it is recorded here with
its reasoning. See BUILD_FLAGS.md's P6-AR entry.

**Arabic word counts run 12–20% below the English on all three routes** —
`/strategy` 517 against 618, `/execution` 526 against 633, `/benefits` 549
against 628, counting every piece of prose a reader gets including the
fragments' aria-labels. Verified section by section that this is morphology and
not omission: all nineteen content slots per page (eyebrow, headline, four
argument paragraphs, two caption lines, fragment aria-label, AI eyebrow,
heading, body, confidence, card title, card detail, gate buttons, audit line,
handoff, CTA) are present in both languages, and the claims inside each were
checked one by one against the approved English.

**Curiosity-ledger grep, both languages.** `/ar/strategy`: تدرّج ×1, موزونة ×1,
بأوزانها ×1 — all three inside the handoff sentence, nowhere else; وزن, ترجيح,
مرجّح, محرر all ×0. `/ar/execution`: تُرفض بوابة ×1, in the handoff; the second
رفض on the page is the SuggestionCard's own Reject control, which the English
route also carries twice for the same reason; سير العمل, مسار الاعتماد,
الموافقة, تصعيد all ×0 (the two توجيه hits are اللجنة التوجيهية, "the steering
committee"). `/ar/benefits`: سجل المنافع ×1, in the handoff; the one إسناد hit
is "إعادة إسناد ملكية المنفعة" on the AI card, which is the approved English's
own "reassign benefit ownership" — ownership, not attribution logic; منطق and
توزيع المنفعة ×0. The English control run gives the matching shape: cascade ×1
and weight ×1 on `/en/strategy`, register ×1 on `/en/benefits`, Reject ×2 on
`/en/execution`.

**LCP and CLS, clean Fast 4G profile, no CPU throttle, production build served
from `dist/` on port 4323** (the dev server on 4321 untouched), 375×812 mobile
viewport. Arabic: `/ar/strategy` LCP 355 ms, `/ar/execution` 346 ms,
`/ar/benefits` 340 ms. English siblings measured in the same session as
controls: `/en/strategy` 334 ms, `/en/execution` 332 ms, `/en/benefits`
336 ms. CLS 0.000 on all six. The Arabic routes run 4–21 ms slower, which is
the extra font subset — `/ar` preloads four woff2 files against `/en`'s three
— and every figure is an order of magnitude inside spec §9's 2.0 s budget.
TTFB was 5–7 ms; 100% of LCP was render delay, and the LCP element on all six
routes is the page's own `<h1>`, which is text and not a network fetch. The
heavily-throttled (Slow 4G + 4× CPU) re-measure carried from P6 is still owed
on an idle machine; these numbers are not a substitute for it, they are a
same-session comparison between siblings, which is what the Arabic work
actually needed.

**Zero console errors on all three Arabic routes.** The one message seen all
session was a 404 for `/favicon.svg` on the first navigation of the browser
session — the pre-existing missing-favicon item from P1's TODO, cached by the
browser for the rest of the session, which is why it appears once rather than
per route. No failed resource requests of any other kind on any Arabic route.

**Reduced motion verified on `/ar/benefits`**, by stubbing `matchMedia` before
any script ran so `whenMotionSafe`'s reduce branch was the live one: all four
`[data-reveal]` elements at `opacity: 1` and `transform: none`, the AI card
resolved, the confidence bar at its full 69% CSS width with no residual scale,
and the fragment's wipe mask at `translate(0)` with the fragment fully
uncovered. That is the served end state, which is also what a JS failure
produces — the contract CLAUDE.md asks for.

**Physical-direction grep is clean.** The only three hits across `src/` are
prose inside comments explaining why physical utilities are NOT used
(`SuggestionCard.astro` ×2, `global.css` ×1), all pre-existing.

**`/ar` still never fetches Plex Mono.** Confirmed on the built
`/ar/strategy`: four font requests, all Plex Sans Arabic subsets. The three new
fragments' Arabic branches set even their digit-only figure roles in Plex Sans
for this reason — see BUILD_FLAGS.md's P6-AR entry.

**The header CTA still wraps to two lines on the Arabic routes too.** Same
pre-existing `Header.astro` issue recorded in the P6 section above; "اطلب
عرضاً توضيحياً" wraps at 375 exactly as "Request a walkthrough" does. Visible in
all three 375 screenshots. Still a `Header.astro` fix, still out of scope for a
copy-and-pages prompt.

---

## P7

**`aria-invalid:border-red` silently compiled to nothing until
`tailwind.config.mjs` gained an `aria` theme extension — found by grepping the
compiled CSS for the literal selector, with one red herring on the way.**
Tailwind's own default `theme.aria` map (in `tailwindcss/stubs/config.full.js`)
only defines `busy`/`checked`/`disabled`/`expanded`/`hidden`/`pressed`/
`readonly`/`required`/`selected` — no `invalid`. `FormField.astro`'s
`aria-invalid:border-red` (the field-invalid visual cue, always paired with the
field's own error text — never the only signal, per spec §9) therefore matched
no configured `aria` variant value, and Tailwind's JIT scanner left the class
name sitting inert in the compiled HTML's `class=""` attribute with zero
matching CSS rule — no build error, no warning, just a class that did nothing.
Confirmed via `node -e 'resolveConfig(...)'` that `theme('aria')` really was
missing `invalid` before the fix.

The red herring: the first fix attempt added `extend.aria.invalid =
'invalid="true"'` to `tailwind.config.mjs`, rebuilt, and grepped the compiled
CSS for `[aria-invalid="true"]` (with the quotes the config value literally
contains) — found nothing, which read as "the extension didn't work." It had
worked; the grep pattern was wrong. Tailwind's `ariaVariants` corePlugin builds
the attribute selector via `normalizeAttributeSelectors`, which drops the
quotes from a value like `invalid="true"` before emitting the selector, so the
real compiled rule is `[aria-invalid=true]` — unquoted. A second, deliberately
quote-free test (`aria-[invalid=true]:border-red`, Tailwind's arbitrary-value
variant syntax, which bypasses the theme config entirely) compiled
immediately and definitively separated "the theme extension isn't taking
effect" from "my grep pattern can't find what's actually there." The final
fix keeps the named `aria-invalid:` variant (cleaner, and now proven to work)
with the theme extension in `tailwind.config.mjs`; the bracket-syntax test
class was reverted before this was done. Recorded because a future
contributor adding any other `aria-*` variant not in Tailwind's default list
will hit the same silent-no-op and should extend `theme.aria`, then verify
against the UNQUOTED attribute-selector form in the compiled CSS, not the
quoted config value.

**Everything else on `/contact` verified clean.** `npm run build` and
`npm run check` both clean (0 errors/warnings/hints) on every rebuild this
session. Physical-direction grep (`grep -rEn '\b(ml|mr|pl|pr|left|right)-'
src/`) restricted to the new files: zero real hits, only the pre-existing
comment-prose matches already recorded in earlier sections. Zero console
messages on `/en/contact` and `/ar/contact` across every interaction tested:
initial load, empty-submit (error summary), invalid-email submit, and a
stubbed-fetch success submit (the real Formspree placeholder endpoint was
never actually posted to — `window.fetch` was replaced with a stub returning
`{ok:true}` before triggering the success path, exactly so this verification
wouldn't need a live endpoint to pass).

**LCP and CLS, Fast 4G, no CPU throttle, production build served from `dist/`
on port 4323** (dev server on 4321 untouched), 375×812 mobile viewport:
`/en/contact` LCP 323–344 ms across two runs, `/ar/contact` LCP 351 ms, CLS
0.00 on both in every run. TTFB 5 ms in both; 100% of LCP was render delay,
and the LCP element on both routes is the page's own `<h1>` — text, not a
network fetch. The heavier Slow-4G-plus-4x-CPU profile carried as an open item
since P6 (host-load contamination, see that section) is still owed on an idle
machine; not attempted again here for the same reason it wasn't trustworthy
last time.

**Keyboard walk verified programmatically (`document.activeElement` read
after each `Tab`/`Space`), not just visually.** Focus order on a fresh
`/en/contact` load: Name → Organisation → Work email → the radio group (one
tab stop, `Space`/arrow keys move within it per native behaviour) → message →
submit — matches DOM order exactly, with no invisible honeypot stop in
between (`tabindex="-1"` holds). After an empty submit, focus lands on the
error-summary region itself (`role="alert"`, confirmed `focused` in the
accessibility snapshot) before any further tabbing, and its four jump links
lead correctly into the four real fields in order. `:focus-visible`'s global
2px accent outline (`global.css`) was confirmed present via
`getComputedStyle` on both a jump link and a text input — this page introduces
no new focusable element that bypasses it.

**The required-radio-group's native constraint-validity state leaked into the
accessibility tree before any script ran, and was fixed with an explicit
static `aria-invalid="false"`.** A first accessibility-tree snapshot of a
freshly loaded, untouched `/en/contact` showed all four "what you want to
see" radios as `invalid="true"` — before any interaction, before
`scripts/contactForm.ts` had done anything. Chrome's accessibility mapping
exposes a required-and-currently-invalid form control's native
`validity.valueMissing` state as `aria-invalid` whenever no explicit
`aria-invalid` attribute overrides it; the three text `FormField.astro`
inputs didn't show this because they already carry a static
`aria-invalid="false"` (suppressing the same premature-before-any-attempt
signal), but the radios, authored directly in `ContactForm.astro`, didn't yet
have the equivalent override. Fixed by adding a static `aria-invalid="false"`
to each radio (cosmetic — `scripts/contactForm.ts` only ever toggles the
wrapping fieldset's `aria-invalid`, not each radio's, since the group is one
"field" for this pattern) and to the fieldset itself. Confirmed resolved in a
second snapshot of the same fresh load. Not a script bug; a gap between two
authoring patterns for what is, underneath, the same requirement.

**The header CTA still wraps to two lines on `/contact` too, in both
languages.** Same pre-existing `Header.astro` issue recorded in the P6 and
P6-AR sections above, reproduced without `Header.astro` having been touched
this prompt; visible in all four P7 rest-state screenshots
(`p7-contact-{en,ar}-{375,1440}.png`). Still out of scope for a
form-and-copy prompt.

---

## P8

**The header CTA's two-line wrap (open since P1/P2, reproduced every prompt
through P7) was root-caused and fixed.** It was never purely a crowding
problem: at 1440 — plenty of layout room — the anchor still wrapped, by
about 1.5px, because a bare flex item defaults to `flex-shrink: 1` and the
browser's shrink algorithm trimmed it a hair under its own text's one-line
width. At 375 the same default shrink met genuine crowding: logo lockup +
language toggle + a non-shrinking "Request a walkthrough" needs ~432px
against a 375px viewport, 56px short in English (36px short in Arabic,
which reads longer but measures narrower once actually laid out). Fixed
with `shrink-0 whitespace-nowrap` added to `Button.astro`'s base classes
(every Button on the site, not a one-off override) and the header wordmark
text set to `hidden sm:inline` (stock Tailwind breakpoint; `aria-label`
still carries "TruMandate" for assistive tech regardless of what's visually
shown). Verified one line, `scrollWidth === clientWidth`, at 375/768/1440 in
both languages — see QA-REPORT.md §1 for the full numbers.

**`StageGateQueue.astro`'s amber dot had no accessible status word — the
one RAG-colour gap on the site (WCAG 1.4.1).** Every other RAG dot on the
site states its status in text somewhere: `RagDot.astro` (used in
`ObjectiveRecord.astro`) pairs every dot with a `visually-hidden` word;
`KpiCard.astro`'s dot is covered by its own `aria-label` ("Status: at
risk."); `InitiativeRows.astro`'s three dots each get their status word
built into that row's slice of the `aria-label` sentence. `StageGateQueue`'s
dot — styled identically, same amber token — had none of that; its
`aria-label` described the gate's facts (owner, due date, queue depth) but
never the status colour was carrying. Fixed by appending the same shared
`ragStatus.atRisk` string `RagDot.astro` already uses (`i18n/ui.ts`, both
languages) to this fragment's `aria-label` computation — no invented copy.
Verified in the built HTML: EN `"...Status: at risk"`, AR `"...الحالة: في
خطر"`.

**A real, unfixed spec-vs-spec conflict found via Lighthouse, not visual
inspection: the home page chain's rest-state opacity fails AA contrast, and
the failing value is a number spec §7 states explicitly.** Lighthouse
accessibility scored 96 (not 100) on both `/en/` and `/ar/`, 100 on every
other route. The cause: `ChainLink.astro`'s copy dims to `opacity-rest`
(0.40, `tailwind.config.mjs`) before its own scroll trigger fires — by
design (`chain.ts`'s own comment: "the rest state... is applied
imperatively... only once motion is confirmed safe does a node ever dim").
On a fresh page load, every node below the one nearest the fold sits at
that dimmed opacity simultaneously (found 10 Lighthouse violations: 5 nodes
× {name, body}), and `text-paper`/`text-body` at 0.40 opacity over `ink`
measures 3.49:1 / 2.92:1 by hand recomputation — both below the 4.5:1
AA-normal floor (19.2px/16px text, neither qualifies as "large"). Spec §7
names the value directly: *"each node's caption lifts from 40% to full
opacity."* Spec §9 separately requires WCAG AA and Lighthouse accessibility
100. These two requirements are mutually exclusive at this exact pairing
and this exact opacity. Per CLAUDE.md's "if a spec contradicts the code,
stop and say so. Do not silently pick one," this was **not** fixed by
quietly nudging the opacity token — it's logged in TODO.md and
QA-REPORT.md §4/§6 as a decision Piyush needs to make (raise
`opacity.rest` to ≈0.49–0.50, amend spec §7's number, or accept the
transient pre-scroll state as a stated exception). Confined entirely to the
home route, both languages — `grep -rn opacity-rest src` shows the class
used nowhere else.

**Full contrast audit, both the DOM-pair extraction and PLAN.md §4's two
flagged close pairs, recomputed independently this session.** 19 real
`color`/`background-color` pairs extracted programmatically from the built
`/en/` page (walked every text-carrying element, deduped) all pass AA, most
with wide margins. PLAN.md §4's two flagged pairs recomputed by hand against
the WCAG relative-luminance formula: `accent` on `jade` measures 4.52:1
(PLAN.md said 4.6:1), `muted` on `jade` measures 4.79:1 (PLAN.md said 4.8:1)
— both confirmed passing AA-normal with zero margin, matching PLAN.md's own
"will not survive a token nudge" conclusion almost exactly (the small
deltas are rounding, not a discrepancy). SVG-fragment text (KpiCard,
InitiativeRows, BenefitCurve, StageGateQueue) paints via `fill`, which
`getComputedStyle().color` cannot see, so those were checked directly
against their token values instead — all pass, 5.5:1–16.7:1.

**WebKit verification actually ran this session** — every prior prompt
(P4/P6/P6-AR/P7) recorded "no WebKit-specific verification was possible in
this environment" because the Playwright MCP available was Chromium-bound
with no engine-selection tool. This session drove real WebKit
(`AppleWebKit/605.1.15 ... Version/26.5`) directly via `npx playwright`
(installed to the npx cache only — never added to `package.json`), scripts
written to the scratchpad, never the repo. Findings: the chain's
`position: sticky` marker engages/releases correctly on both `/en/` and
`/ar/` at 1440×900 (scrollY 1750→2500 EN, 1650→2300 AR), the GSAP
ScrollTrigger scrub updates the count/name text correctly, language-toggle
header geometry is pixel-identical EN vs AR at both 375 and 1440 across
three route pairs, and all three Arabic fragment SVGs render RTL
`text-anchor` correctly with no glyph mirroring or unintended clipping
(`InitiativeRows`' row 4 extends past its own SVG box by design — that's
the documented crop-signals-continuation behaviour, not a defect). Zero
console errors across every WebKit check. No WebKit-specific defect found
— the historical Safari pinned-section risk this check exists for did not
reproduce.

**Everything else verified clean.** `npm run build` (11 pages) and
`npm run check` (62 files) both clean. Physical-direction and
hex-outside-config greps: zero real hits, same pre-existing comment-prose
matches as every prior section. Banned-marketing-word grep against the
built English HTML (all 5 EN routes): zero hits. `/ar` preloads exactly 4
font files (Arabic 300/600, Latin 300/600), never `plex-mono`, on every
Arabic route. Curiosity-ledger fragment count: exactly one `data-fragment`
SVG per product page (6/6 across both languages), exactly two fragment
surfaces on home (`StageGateQueue` + `CommandCentreDim`, both languages).
Zero console messages across all 10 routes in every condition tested (Fast
4G, Slow 4G + 4× CPU, reduced motion, JS disabled). Zero horizontal overflow
at 375/768/1440 on all 10 routes. LCP well inside spec §9's 2.0s budget
everywhere — worst figure 466ms (`/ar/benefits`, Slow 4G + 4× CPU, 23% of
budget); CLS 0.00 on every route, every run. Full numbers, the WebKit
detail, and every manual-check result: `QA-REPORT.md`.

---

## P9

**The P8 chain-link rest-state contrast finding (accessibility 96 on `/en/`
and `/ar/`) is resolved, not merely re-measured.** `opacity.rest`
(tailwind.config.mjs) raised from 0.40 to 0.57 (user-approved gate,
BUILD_FLAGS.md's decisions log has the full computation). Re-ran Lighthouse
on the built `/en/` and `/ar/`: **accessibility 100 on both.** Confirmed
programmatically, not just by the score: `getComputedStyle` on a live
`.opacity-rest` node reads `opacity: 0.57` on the built page. The P8 section
above is left unedited as the historical record of the conflict; this entry
is the resolution.

**Lighthouse SEO jumped from 63 (every route, P8) to 100, unprompted by any
score-chasing — it is a side effect of building what spec §5A/CLAUDE.md's
P9 scope actually asked for.** P8 flagged SEO as "outside spec §9's tracked
budget, not investigated." This pass added canonical URLs, hreflang
alternates, meta descriptions sourced from `i18n/ui.ts` and `product/copy.ts`
rather than left absent, and the OG image set with real dimensions/alt —
exactly the gaps a 63 score reflects. Verified via `lighthouse_audit`
(chrome-devtools MCP, mobile) on both `/en/` and `/ar/`: accessibility,
best-practices, SEO and agentic-browsing all 100 on both.

**Favicon 404 confirmed dead.** Every prior prompt's session recorded the
same single `/favicon.svg` 404 (cached by the browser for the rest of that
session, so it only ever appeared once). This pass: a hard reload
(`ignoreCache: true`) on `/en/` re-requests `favicon.svg` fresh — 200, zero
console messages. `favicon.ico` also checked directly — 200. `apple-touch-
icon.png` and `site.webmanifest` both load 200 as part of the same `<head>`.

**`<head>` grew (P9 adds canonical/hreflang/OG/Twitter/favicon/manifest tags
to every route); LCP did not move meaningfully.** `dist/en/index.html` grew
43,452 → 48,160 bytes (10,859 bytes gzipped, +~977 vs. P4's 9,882) — all of
it text-based `<meta>`/`<link>` tags, no new blocking request. A quick
unthrottled trace (chrome-devtools MCP, `/en/`, production build on port
4323) measured LCP 140ms, CLS 0.00, 100% render delay, LCP element still the
hero `<h1>` — consistent with every prior session's figures and nowhere
near spec §9's 2.0s budget. Not a substitute for a fresh throttled
(Slow 4G + 4× CPU) pass on an idle machine, which remains owed from P6
onward (host-load contamination, that section) — this is a sanity check
that the larger head didn't regress anything, not a full re-verification.

**Standing greps re-run clean on the final build.** Physical-direction grep:
zero real hits (same pre-existing comment-prose matches as every prior
section, plus new ones in the three product fragments' own RTL-reasoning
comments — inspected individually, all prose, zero live utility classes).
Hex-outside-config grep (`src/` only — see BUILD_FLAGS.md's P9 decisions log
for why `site.webmanifest`'s and `BaseLayout.astro`'s theme-color are outside
that boundary by necessity, not oversight): zero hits. Banned-marketing-word
grep against the built English HTML surfaced one false positive worth
recording — `\bcomplete\b` (unanchored) matches inside `autocomplete="..."`
attributes on `/en/contact`; the same grep with proper word boundaries
(`\bcomplete\b`, which does NOT match inside `autocomplete` since there's no
boundary between "auto" and "complete") returns zero real hits, matching
every prior session. A future contributor re-running this grep should use
word boundaries, not a bare substring match, for exactly this reason.
`mailto:` link confirmed rewired to `trumandate@intertecsys.com` on both
`/en/contact` and `/ar/contact` in the built HTML; zero remaining live
references to the old `hello@trumandate.com` placeholder (two references
that do remain are inside source comments describing the change itself, not
served copy).

**`npm run build`** (11 pages, including the new `/sitemap.xml` endpoint)
**and `npm run check`** (64 files, up from 62 — `Meta.astro` and the
`tailwind.config.mjs` import in `BaseLayout.astro`) **both clean.**

---

## P10 wave 1

**A genuine ship-blocking defect, found by orchestrator verification, not by
this session's own testing: the hero's two CTA buttons ("Request a
walkthrough", "See the chain") stayed at cumulative opacity 0 indefinitely on
`/en/` and `/ar/` — GSAP's `.from()` on Button.astro's own CSS `transition`
utility, combined with `stagger`, silently freezes a staggered target's
render short of its end value, with zero console errors.** Reproduced,
root-caused and fixed in the same session it was reported.

Root cause, isolated empirically (not guessed): `Button.astro`'s base
classes gained a bare `transition` utility this wave (§3.8, covering
`opacity`/`transform` among other properties), and `scripts/hero.ts`'s CTA
row entrance directly `.from()`-tweens the two Button-rendered anchors'
`opacity`/`y` with a `stagger`. A CSS `transition` on the same properties a
GSAP tween is driving via inline styles causes the browser's transition
engine to re-trigger on every GSAP-written frame, chasing a constantly
moving target; for a STAGGERED (delayed-start) element specifically, this
leaves the tween's `progress()`/`totalTime()` bookkeeping reporting full
completion while the actual `element.style.opacity` is frozen near its
starting value, forever — confirmed with a live, isolated reproduction
(cloned the real button elements with their real classes, ran the identical
stagger tween: index 0, no delay, completes; index 1, staggered, freezes at
~0.06 opacity even after 6+ real seconds, `tl.progress() === 1` throughout).
`aiCard.ts`'s own staggered Accept/Modify/Reject buttons were unaffected
because those elements use `transition-colors` (colour properties only),
never `transition` — confirming the mechanism precisely, not coincidentally.

First fix attempt — folding `transition: "none"` + `clearProps: "transition"`
directly into the SAME staggered `.from()` call — made it worse, not
better: reproduced in isolation too, it broke rendering for EVERY target in
the stagger group, not just the delayed one (GSAP's stagger distribution
does not appear to handle a non-tweened, non-numeric property placed
alongside a staggered numeric one). The working fix, verified against the
live built page at 0.5s/2.5s/5s past load (the orchestrator's own repro
window): neutralise the transition with a SEPARATE, non-staggered
`gsap.set(ctas, { transition: "none" })` immediately before the `.from()`
tween is created, then restore it via `tl.call()` once the tween completes
(`el.style.transition = ""`, letting the CSS class's declaration resume for
hover/press). Both buttons now hold `opacity: 1` from well before 0.5s
through past 5s, transition correctly restored to `0.15s` afterward.

The invariant this also violated: CLAUDE.md's "end state lives in CSS, GSAP
animates from an offset" was true here only by omission (Button.astro sets
no opacity/transform of its own, so the CSS-served default already happened
to be fully visible) — but nothing in markup SAID so, unlike every other
staggered element on the site (`ObjectiveRecord`'s rows, `FailureModes`'
group children), which carry an explicit `class="reveal"`. Both
`Hero.astro`'s Button instances now carry `class="reveal"` too, for the same
reason: not a visual change (redundant with the already-correct default),
but an explicit, grep-able statement of the contract, and cheap insurance
if a future tween ever hangs again.

Re-audit after the fix, per the orchestrator's own method (every
text-bearing leaf element inside `<main>`, cumulative computed opacity
across all ancestors, after a full scripted scroll-through and back to top):
zero offenders at ≥0.85 threshold on `/en/` and `/ar/`, 1440 and 375 (59
elements checked each run; `ChainMarker.astro`'s sticky counter/name column
correctly excluded — it is `hidden lg:block` and `aria-hidden="true"` by
design, pre-existing and untouched by this wave, not a hung animation). The
four full-page screenshots were retaken after a real scripted scroll-through
and back to top, per instruction, superseding the earlier (defect-era)
captures at the same file paths.

**DESIGN-ELEVATION.md §6.1's 900ms LCP gate (Slow 4G + 4x CPU) was missed —
but a paired before/after measurement shows this session's test rig, not
wave 1's changes, is why, and the §6.4 abort was deliberately not applied.**
The spec's own stated baseline ("today 385/398ms") did not reproduce on this
machine's scratch static server (Python's `http.server`, port 4323) under
chrome-devtools MCP's Slow 4G + 4x CPU emulation. Measured via `git stash`
(isolating the exact pre-wave-1 code, same server, same emulation, same
route):

| Build | Run 1 | Run 2 |
| --- | --- | --- |
| Pre-wave-1 baseline (`git stash`) | 1,398ms | 1,708ms |
| Wave 1 (this session) | 1,111ms | 964ms |
| Wave 1, `/ar/` | 1,159ms | — |

Both LCP breakdowns showed TTFB in single-digit milliseconds and 99%+ "render
delay" — the LCP element (`<h1>`) is text, not a network fetch, in every run.
The wave-1 build measured *lower* than the untouched baseline in both paired
runs, which rules out the hero SplitText (or any other wave-1 addition) as
the cause of the 900ms miss — motion.ts's `whenMotionSafe` defers all setup
by one `requestAnimationFrame`, so SplitText cannot run before the LCP entry
is recorded, by construction, exactly as DESIGN-ELEVATION.md §3.3 argues.
Applying §6.4's abort ("drop the hero SplitText to a whole-block `<Reveal>`")
would not have closed the gap to 900ms — the bottleneck is elsewhere (likely
this machine's Python dev server plus 4x main-thread throttling stacking on
an already CSS-heavy inlined stylesheet, a characteristic of the test rig
rather than the served page) — so it was not applied. CLS stayed 0.00 (`/en/`)
and 0.02 (`/ar/`, at the pass condition's own boundary) throughout, both
languages, both builds. Flagged per CLAUDE.md's "if a spec contradicts the
code, stop and say so" — here it is the spec's *assumed baseline* that does
not match this environment's measured reality, not a wave-1 regression.
Re-measure on an idle machine, or against the actual Cloudflare Pages
preview rather than a local static server, before treating the 900ms gate as
either met or missed for real.

**Lighthouse accessibility stayed 100 on both `/en/` and `/ar/` after all 22
new tokens landed.** Verified via `lighthouse_audit` (chrome-devtools MCP,
mobile): accessibility, best-practices, SEO and agentic-browsing all 100,
both languages — no regression from the P9 gate.

**The chain's rest-state contrast improvement predicted in DESIGN-ELEVATION.md
§2.6 was verified empirically, not just recomputed on paper.** Moving the
chain onto `surface-deep` (§3.9) was predicted to raise `text-body` at
`opacity-rest` (0.57) from 4.51:1 (on `ink`) to 4.77:1, and `text-paper` from
5.68:1 to 6.01:1. Measured directly on the built page (walked the actual
`getComputedStyle` color/opacity of a still-dimmed `[data-chain-copy]` node,
alpha-composited against the actual rendered `surface-deep` background,
WCAG relative-luminance formula): **4.785:1** and **6.008:1** — both within
0.02 of the predicted figures, confirming the site's tightest accessibility
decision (`opacity.rest`) genuinely gained headroom from the ground change
rather than merely appearing to on the strength of the spec's own arithmetic.

**The Arabic tracking defect (§5.1) is fixed and verified computationally, not
just visually.** `getComputedStyle().letterSpacing` on `/ar/`: `h1`, `h2`,
`h3`, the header wordmark and the first `Nav.astro` link all report
`"normal"` — which is Chrome's own computed-style serialisation of an
explicit `letter-spacing: 0` (confirmed by checking `<html dir="rtl">`
itself, whose PRE-EXISTING, unmodified `[dir="rtl"] { letter-spacing: 0 }`
rule reports the identical `"normal"`, ruling out a false pass). On `/en/`
at 1440 (above `lg`): `h1` measured `-1.904px` on a `68px` font-size —
exactly `-0.028em` (`tracking-display-lg`); `h2`/`h3` measured exactly
`-0.015em` (`tracking-heading`, unchanged, no `lg` deepening — correct, only
Display gets one); the wordmark and nav link both measured exactly `-0.01em`
(`tracking-brand`, unaffected, Latin-only as required). At 375 (below `lg`),
`h1` measured exactly `-0.02em` (`tracking-display`, the un-deepened value),
confirming the breakpoint boundary itself works. `.tracking-brand` was added
to global.css's zero-override selector list beyond DESIGN-ELEVATION.md
§5.1's own literal code sample (which names only `h1`/`h2`/`h3`/
`.font-display`) — the spec's own prose says the wordmark is part of the
defect ("Arabic h1/h2/h3 and the wordmark"), and `Nav.astro`'s Arabic labels
carry the identical utility, so the selector list was completed rather than
left half-fixed; both are named in this file's implementation.

**Reduced motion verified by stubbing `matchMedia` before any script ran**
(same technique P6-AR's known-issues entry used), both `/en/` and `/ar/`:
the hero `h1` has no split wrapper and no injected `aria-label` (SplitText
never instantiated), the chain rail's transform is `none` (scaleY(1)
equivalent, gradient fully painted), the AI card's glow layer and card both
sit at `opacity: 1`/`transform: none`, the confidence bar's transform is
`none` (scaleX(1)), every chain dot carries its served *active* classes
(`chain.ts`'s setup never ran, so the muted rest-state classes were never
applied), every chain caption's class list is empty (the `opacity-rest`/
`translate-y-1.5` classes are added only by that same setup), `FailureModes`'
group children and the hero's objective-record rows all read `opacity: 1`,
and the `<Rule>` elements read `transform: none` (scaleX(1) equivalent).
Zero console messages in either language. JS-disabled equivalence was cross-
checked against the raw served HTML (`dist/{en,ar}/index.html`) directly,
confirming every new element (`data-ai-glow`, `data-chain-rail`,
`data-reveal-group`, `shadow-focal`, the ground/seam/texture classes, the
`fill-highlight` rects, the two-tone lede's two `<span>`s) is present
unconditionally in the served markup rather than injected by JS.

**Horizontal-overflow check needed a second measurement to avoid a false
alarm.** A naive `document.documentElement.clientWidth` (360 at a 375-wide
viewport) vs `scrollWidth` (375) comparison looked like an 15px overflow at
first glance — but this is a desktop-Chrome artefact (a classic, space-
reserving vertical scrollbar subtracted from `clientWidth`, which does not
occur on a real mobile device's overlay scrollbar), not real content
overflow: `document.documentElement.scrollWidth` (375) matches
`window.innerWidth` (375) exactly, and an element-by-element bounding-rect
sweep found only two expected classes of "offender" — `StageGateQueue`'s
deliberately-cropped second queue card (pre-existing, by design, clipped by
the fragment's own `viewBox`) and the AI card's new `spotlight-accent` glow
layer, whose `-inset-12` intentionally bleeds past the card's edges but is
`position: absolute` inside a `position: relative` wrapper that does not
enlarge the document's own scrollable area (confirmed:
`document.documentElement.scrollWidth === window.innerWidth` exactly at
375/768/1440, both languages). No real overflow at any checked breakpoint.

## P10 wave 2

**A shared-browser interference source produced a false-positive "hung
tween" reading identical in shape to the wave-1 defect, and was chased down
empirically rather than assumed to be a repeat of the same bug.** The first
full-scroll opacity audit on `/en/strategy` (this wave's own methodology,
carried from wave 1) showed the AI moment's Accept/Modify/Reject buttons at
opacity 0–0.35 after a scripted scroll-to-bottom-and-back — the same visual
signature as the wave-1 CSS-transition-fights-GSAP-stagger bug. It is NOT a
repeat: those three buttons carry `transition-colors` (Tailwind's
`color`/`background-color`/`border-color`/`text-decoration-color`/`fill`/
`stroke` set, confirmed via `getComputedStyle().transitionProperty` — no
`opacity`, no `transform`), which is exactly the property list wave 1's own
finding said was immune. Isolated in a dedicated browser context
(`isolatedContext`, chrome-devtools MCP) with a `location.href`-unchanged
integrity check woven into the test script, the same scroll sequence
produced zero offenders, repeatably, across every route/language/viewport
combination checked afterward. Root cause: this machine runs an autonomous
DesignSync-adjacent watcher for this repo (`.design-sync/config.json`
confirms a "TruMandate Website DS" sync project exists here) that opens and
navigates pages in the SAME chrome-devtools MCP browser instance
concurrently with this session — confirmed directly by watching page IDs
cycle through exactly the component names being edited this session
(`Button`, `Section`, `KpiCard`, `FormField`, `CommandCentreDim`, …) at
URLs neither this session nor its task ever requested, including one
instance where a page THIS session had just created (by ID) was silently
re-navigated to an unrelated component-preview URL between two tool calls.
A long-running, multi-second `evaluate_script` (the scroll-and-settle
pattern) run on a shared, non-isolated page is exactly the shape of
operation vulnerable to this: if the watcher navigates the same tab away
and back mid-script, in-flight `await sleep()` continuations resume against
a different `document`/`window than the one the tween was created against,
producing exactly the "some elements mid-flight, values that don't fit a
clean before/after" pattern seen here. Every measurement after this
diagnosis used a dedicated `isolatedContext` per page and confirmed
`location.href` sameness inside the same script that reads the audit
result — 20/20 opacity-audit runs (5 routes × 2 languages × 2 viewports)
came back clean under that protocol. Not treated as "wave 2 has no
defects" on faith — the isolation and the integrity check are exactly what
would have caught a genuine regression, and did not.

**`resize_page` does not reliably produce the requested CSS viewport width
on this machine (Windows, 150% OS display scaling); `emulate`'s explicit
viewport string does.** Requesting 375×812 via `resize_page` measured
`window.innerWidth` at 501px in one context and 391–403px in another
(inconsistent, both wrong); requesting 1440×900 the same way measured
1283px. Switching to `mcp__chrome-devtools__emulate` with an explicit
`"<width>x<height>x<dpr>[,mobile,touch]"` viewport string produced the
exact requested width every time, verified directly via
`window.innerWidth` before trusting any further measurement. One residual,
already-precedented artefact even with `emulate`: at 375-emulated width,
`window.innerWidth`/`scrollWidth` sometimes read ~16px wider than
`document.documentElement.clientWidth` (which reads exactly 375) — the
same desktop-Chrome reserved-scrollbar discrepancy this file's P10-wave-1
section already documented in the opposite direction, not a new defect and
not something wave 2 introduced (reproduced on the untouched home page,
which this wave did not modify).

**The full wave-1 opacity-audit methodology, re-run on all four wave-2
routes plus home (regression), both languages, 1440 and 375 — 20 runs, zero
offenders in every one.** Every text-bearing leaf inside `<main>`
(`aria-hidden` excluded), cumulative computed opacity across every
ancestor, measured after a scripted full scroll-through and back to top:
`/en/strategy` 34 elements, `/en/execution` 36, `/en/benefits` 26,
`/en/contact` 17 — identical counts on the Arabic siblings — and `/en/`
59 / `/ar/` 59 (matching wave 1's own recorded baseline exactly, confirming
no regression from wave 2's shared-component changes to `Rule.astro`,
`Lede.astro`, `scripts/reveal.ts`).

**LCP/CLS, Fast 4G, no CPU throttle, production build served from `dist/`
on the scratch static server (port 4326 — the user's dev server on 4321
untouched), 1440×900, chrome-devtools MCP:**

| Route | LCP | CLS |
| --- | --- | --- |
| `/en/strategy` | 144 ms | 0.00 |
| `/en/execution` | 138 ms | 0.00 |
| `/en/benefits` | 134 ms | 0.00 |
| `/en/contact` | 115 ms | 0.00 |
| `/ar/strategy` | 163 ms | 0.00 |
| `/ar/execution` | 160 ms | 0.00 |
| `/ar/benefits` | 158 ms | 0.00 |
| `/ar/contact` | 121 ms | 0.00 |
| `/en/` (regression) | 154 ms | 0.00 |
| `/ar/` (regression) | 170 ms | 0.00 |

Every route's LCP element is text (the page's own `<h1>`, per every prior
session's finding), TTFB 2–3ms in every run, comfortably inside spec §9's
2.0s budget and DESIGN-ELEVATION.md §6.2's carried-forward figures. Not a
substitute for the still-owed Slow 4G + 4× CPU pass on an idle machine
(carried since P6).

**Lighthouse accessibility 100 on both sampled routes.** `/en/strategy`:
accessibility/best-practices/SEO/agentic-browsing all 100, 51/51 audits
passed. `/ar/contact`: same four categories all 100, 54/54 audits passed.

**Reduced motion verified on `/en/execution`** by stubbing `matchMedia`
before any script ran (the established technique, corrected this session —
the first stub attempt threw `Cannot set property matches of
#<MediaQueryList> which has only a getter` from trying to `Object.assign`
onto a real `MediaQueryList`; fixed by returning a plain object literal
implementing the same interface instead of cloning the real one): all 12
`<main> p` elements at `opacity: 1`, the argument rule at `opacity: 1` /
`transform: none`, the fragment's wipe mask at `transform: none` (fully
open), the AI card, its confidence bar and all three Accept/Modify/Reject
buttons at `opacity: 1` / `transform: none`, and the Handoff button at
`opacity: 1` — every wave-2 addition already in its served end state, JS
failure and reduced motion producing the identical page. The two-tone
argument paragraph was confirmed correct in the same pass: first paragraph
19.2px / `rgb(241,245,243)` (`text-lede`/`text-paper`), second 16px /
`rgb(198,218,211)` (`text-body`/`text-body`), rule colour
`rgba(255,255,255,0.06)` (`hairline-soft`) — all three exactly the tokens
§4.3 specifies.

**Keyboard tab order on `/en/contact` re-verified unchanged after touching
`ContactForm.astro` and `FormField.astro`.** Walked the DOM/tabindex order
programmatically: 8 header stops, then the mailto link, then the three
text fields, then the four interest radios (native one-stop-group
behaviour unaffected), then the message field, then submit — identical
shape to the P7/P8 finding. The honeypot input (`tabindex="-1"`) does not
appear in the walk, confirming it is still excluded.

**Standing greps re-run clean, with two nuances worth recording rather than
just the raw counts.** `grep -c data-fragment` naively returns "2" per
product-page route because the substring also matches
`data-fragment-wipe`; the exact-attribute count (`data-fragment(=|>|\s)`)
is 1 per product page and 1 on home (both languages), matching the
curiosity ledger exactly. `grep spotlight` on the built contact pages also
returns a nonzero count at first glance — but that hit is the
`.bg-spotlight-accent` CSS utility RULE ITSELF, present in every route's
inlined stylesheet because `astro.config.mjs`'s `inlineStylesheets:
'always'` (P4) ships one shared bundle into every page regardless of
whether that page uses every class in it. Neither `data-ai-glow` nor any
`class="…spotlight…"` usage appears anywhere in the built
`/en/contact`/`/ar/contact` markup — confirmed by grepping for the class
usage specifically, not the bare substring — so "no glow on /contact"
holds. Physical-direction and hex-outside-config greps: zero real hits,
same pre-existing comment-prose matches as every prior section. Built
`/en/{strategy,execution,benefits}` HTML, tag/class structure diffed with
per-route attribute values (href/lang/aria-label/id) normalised: identical
across all three except each page's own one fragment's internal SVG
markup — confirming the one-skeleton invariant holds with zero structural
divergence beyond the fragment slot itself.

---

## Redesign wave A (docs/design_handoff_website_redesign — home + shared chrome)

**`text-center` silently compiled to nothing across every new redesign
component, the same failure mode this file's own P1 section already
recorded for the whole `textAlign` corePlugin.** `tailwind.config.mjs`
disables `corePlugins.textAlign` outright so `text-left`/`text-right` can't
exist (CLAUDE.md's physical-direction ban); `global.css` re-provides
`.text-start`/`.text-end` but, until this fix, not `.text-center` — and
disabling the corePlugin removes the WHOLE group, not just the two physical
values. Found by the orchestrator's own measured-alignment pass
(`getComputedStyle().textAlign` reading `"start"` on an element carrying
`class="... text-center"`), not by visual inspection alone — visually the
centered hero happened to look plausible at some viewport widths, which is
exactly why a measured check matters more than an eyeballed one. Affected
every `text-center` call site added this wave: the hero's text block and
board caption, all four proof-band stats, and the record chain's sticky
counter/name. Fixed by adding `.text-center { text-align: center; }` to
global.css's existing logical-utilities layer, alongside `.text-start`/
`.text-end` — centering has no physical-direction reading, so this is not a
loophole in the ban, just the third value the disabled corePlugin also took
down. Verified after the fix: `getComputedStyle().textAlign` reads
`"center"`, and a `getBoundingClientRect()` diff against the reference
`.dc.html` at a true 1440px viewport shows the hero `h1`/lede at
pixel-identical left/width to the reference (see below).

**Two paragraphs used the wrong `max-width` token, several pixels narrower
or wider than the reference's own explicit ch value.** The hero lede
(`Home (redesign).dc.html`: `max-width: 54ch`) and the closing CTA's body
(`max-width: 50ch`) were both written against this repo's existing
`max-w-measure` token (56ch, authored for the pre-redesign site, not this
handoff) instead of the reference's own value. Found via the same measured
`getBoundingClientRect()` comparison (lede width 645.1px built vs. 622.1px
reference — a real, human-visible ~23px difference, not rounding noise).
Fixed by writing the exact ch values directly (`max-width: 54ch` inline for
the hero lede, `max-w-[50ch]` for the closing CTA body) rather than forcing
either onto an existing token that doesn't match — post-fix, both measure
identical to the reference to 0.1px.

**The hero's and closing CTA's four CTA buttons rendered ~16px narrower
than the reference because `Button.astro`'s own default padding (`px-4
py-2`) silently overrode the reference's explicit
`min-height: 46px; padding-inline: 24px`.** Only these four call sites need
the bigger padding — the header CTA, the contact form's submit button and
Handoff.astro's CTA all correctly keep `Button.astro`'s default, matching
their own reference pages. Fixed by adding an optional `style` passthrough
prop to `Button.astro` (inline styles reliably beat a same-specificity
utility class, which is not guaranteed to win by source order under
Tailwind's own internal rule ordering) and applying the override at the
four Hero.astro/ClosingCta.astro Button instances only. Verified: built
button widths now match the reference to 0.1px in both languages (e.g. EN
"Book a demo" 138.1px, "Follow one record" 172.1px; AR hero primary
163.2px — all exact).

**`CommandCentreBoard`'s internal "Performance Command Centre" title was an
`<h3>` sitting before any `<h2>` existed on the page, failing Lighthouse's
`heading-order` audit (accessibility 98, not 100).** The board lives inside
the hero, above the proof band and AI queue sections that carry the page's
first `<h2>`s, so the document outline read H1 → H3 with no H2 between —
invalid. The board is a decorative, withheld product-screenshot fragment
(README: "never show the full board"), not real page structure, so its
internal chrome has no business injecting a heading into the document
outline at all — consistent with how the other product fragments
(KpiCard.astro, InitiativeRows.astro) never use real heading elements for
their own internal titles either. Fixed by changing that one element from
`<h3>` to `<p>` with identical visual styling. Re-ran Lighthouse after:
accessibility/best-practices/SEO/agentic-browsing all 100 on both `/en/`
and `/ar/`.

**With JavaScript disabled and no reduced-motion preference set, every
`.tm-load`/`.tm-boardload`/`.tm-rise`/`.tm-fade`/`.tm-grow` element on the
redesigned home page would have stayed at its hidden starting opacity
forever — a real gap in "the site must be readable with JavaScript
disabled" (CLAUDE.md), found by reasoning through the mechanism rather than
by a failed visual check.** Unlike the pre-redesign site's `.reveal` class
(whose unconditional default WAS the finished, visible state, with GSAP
animating FROM an offset on top of it), these classes ship hidden by
default; only `.tm-in` — added by `scripts/redesignReveal.ts`'s
IntersectionObserver, or the site's own JS ScrollTrigger-equivalent for the
chain — or the real `prefers-reduced-motion: reduce` media query ever
reveals them. A JS-disabled visitor with no reduced-motion preference would
trigger neither. Confirmed via `curl` against the built HTML that no
`<noscript>` fallback existed before this fix. Fixed with a
`<noscript><style>...</style></noscript>` block in `BaseLayout.astro`'s
`<head>`, reproducing the exact same end-state declarations the real
reduced-motion media query already applies — verified present, intact and
unhoisted in the built HTML (Astro's scoped-style compiler does not touch a
plain `<style>` tag sitting inside a `<noscript>` written directly in a
layout's markup).

**Measured-alignment pass (getBoundingClientRect diff, reference `.dc.html`
vs. built page, true 1440px viewport via `mcp__chrome-devtools__emulate`'s
explicit viewport string — `resize_page` under-reports width on this
machine, see TODO.md).** After the three fixes above: hero H1 (left 365.5,
width 693.6), lede (left 401.3/389.8→401.3, width 622.1), both hero CTAs,
all three AI-queue card titles (left 218.3/569.0/919.7, gap 62.7px both
sides), all four proof-band columns (left 194.3/454.0/713.0/972.0), all
three without-record columns (left 194.3/554.1/913.8, width 316.5 each),
the chain track's centre (712.3, matching the reference's own — both share
the same ~7.7px leftward shift from true viewport-centre, a vertical-
scrollbar-reservation artefact present on any tall page in this browser,
not a markup difference), the Command Centre board's wrapper/outer column
(left 144.3/72.3, width 1136/1280), and the footer's wordmark/copyright/
trademark widths (all exact against `SiteFooter.dc.html` in isolation) all
measure identical to the reference to within 0.1px. Spot-checked in Arabic
too (hero H1/lede, both hero CTAs, chain-track centre) with the same
result — the shared components carry the fix to both languages by
construction.

**Reduced motion, verified two ways** (this MCP has no direct
`prefers-reduced-motion` emulation — see TODO.md): the `window.matchMedia`
stub confirms `whenMotionSafe`'s JS gate correctly sees `reduce: true` and
never runs `recordChain.ts`/`redesignReveal.ts`'s setup — all five
`[data-chain-card]` elements stay `position: relative` (never switched to
the absolute-positioned orbit), rendering in normal document flow, stacked,
every one fully legible; a separately-injected stylesheet reproducing the
CSS reduce-block's own declarations confirms all 27 `.tm-load`/
`.tm-boardload`/`.tm-rise`/`.tm-fade`/`.tm-grow` elements on the page reach
opacity ≥0.99 with no residual transform. Screenshots:
`screenshots/redesign-home-en-reduced-motion-{hero,chain}.png`.

**Opacity audit (every text-bearing leaf inside `<main>`, cumulative
computed opacity across all ancestors, after a scripted full scroll-through
and a 2-second settle back at the top — long enough for the 1.3s count-up
and every `tm-*` transition to actually finish, unlike a naive 300ms
check which caught a proof-band counter still mid-animation, "22 mo"
instead of the finished "24 mo," a timing artefact, not a stuck reveal).**
127 leaves checked on `/en/`, zero below the 0.85 threshold, EXCLUDING the
five record-chain cards' own content by design: those carry a genuine,
reference-matching depth-fade (opacity 0.08–1, per the ellipse's own
`0.08 + 0.92·max(0,(cos a+0.25)/1.25)` formula) as the scroll-driven 3D
carousel's whole visual point — CommandCentreBoard.dc.html's own reference
dims non-active cards identically, this is not a stalled or broken
transition. Confirmed separately that exactly one card sits at opacity 1
(the active one) at any given scroll position, so a reader always has one
fully legible card in view.

**Lighthouse accessibility/best-practices/SEO/agentic-browsing: 100/100/
100/100 on both `/en/` and `/ar/`** after the heading-order fix above.

**LCP/CLS, `chrome-devtools` MCP, production build served from `dist/` on
a scratch static server (port 4329 — the user's dev server on 4321
untouched):** Fast 4G, no CPU throttle — `/en/` LCP 510ms / CLS 0.01,
`/ar/` LCP 550ms / CLS 0.00, both comfortably inside the 2.0s/0.05 budget,
TTFB 6–7ms in both (render-delay dominated; the LCP element is the hero
`<h1>`, text, not a network fetch, matching every prior session's finding
for this site). One Slow 4G + 4x CPU sample on `/en/`: LCP 1,734ms / CLS
0.01 — inside budget, but per this file's own P6/P10 sections' established
finding, a single throttled reading on this shared, often-busy machine is
directional, not a clean baseline; re-measure owed (TODO.md).

**Mobile 375, both languages: no real horizontal overflow**, confirmed by
attempting `window.scrollTo(1000, 0)` and reading back `scrollX` (stayed
0) rather than only comparing `clientWidth`/`scrollWidth` — the latter
pair differs by ~20px on this machine regardless of content (the same
reserved-scrollbar artefact P10 wave 1's section already documented in the
opposite direction). The Command Centre board fits via its own `zoom`
fit-to-container script; the record chain's cards narrow to
`min(78vw, 340px)` and stay fully legible.

---

## Redesign wave B (docs/design_handoff_website_redesign — Strategy/Execution/Benefits/Contact)

**A first-pass typography mistake in all three new fragments — `KpiCard.astro`,
`InitiativeRows.astro`, `BenefitCurve.astro` — was caught only by measured
section-height comparison against the reference, not by eyeballing, and
produced two different symptoms in the two languages.** The reference's
dense fragment cards (KPI ref/at-risk/baseline-target-actual labels,
initiative-row objective/slip/percentage, the benefit chart's header line)
use bespoke literal pixel font-sizes (9/10/11px) in English, composed with
the site's existing `tracking-eyebrow`/`tracking-datum` letter-spacing-only
utilities — NOT the semantically-similar-sounding `text-eyebrow`/`text-datum`
roles (11.2px/11.52px, each bundling a bigger size in with the same
letter-spacing). First pass reached for the semantic role by habit. Found
via `getBoundingClientRect` diffing against a working reference preview
(see TODO.md's `_ds/` bundle note): `/en/strategy`'s fragment section
measured 421px against the reference's 378px — the KPI card's "Carries"
chip row had wrapped to two lines instead of one, because every chip's text
was rendering ~28% larger than intended. Fixed EN-side by replacing every
`text-eyebrow`/`text-datum` instance in these three files with the literal
inline `font-size` the reference itself uses, paired with
`tracking-eyebrow`/`tracking-datum` only where the reference's own markup
keeps it.

**The EN fix alone made `/ar/strategy`'s same fragment measure 15–29px
*short* against ITS reference — the opposite direction — because the
Arabic reference does the opposite thing.** `Strategy AR (redesign).dc.html`
and its two siblings reach for the real `text-datum` role (no inline
font-size at all) on these exact same labels, letting the sitewide
`[dir=rtl] .text-datum → text-datum-ar` override (global.css) size Arabic
~10% larger than the Latin figure — the same adjustment the pre-redesign
`KpiCard.astro` made by hand with separate `.label`/`.label-ar` classes.
Fixed by branching every one of these micro-label class/style pairs on
`isAr`: EN keeps the literal-px pattern, AR reaches for `text-datum`/
`tracking-datum` with no inline size. Re-verified after the fix:
`/en/strategy` and `/en/execution`'s fragment sections now match the
reference to the exact pixel (378px and 345px respectively); `/ar/benefits`
(pure SVG, immune to this whole class of bug) matches on all five sections;
`/ar/strategy` and `/ar/execution` closed from a 29px/12px gap to a
residual 15px/12px, traced to an unrelated, pre-existing sitewide
line-height cascade interaction (TODO.md's own new entry has the full
root-cause) rather than this typography bug recurring.

**Measured section-height comparison, all 8 routes, 1440×900, against a
reconstructed working reference preview:** hero/argument/AI-moment/handoff
match the reference to the pixel (±1–2px, the same header-height
sub-pixel margin `tailwind.config.mjs`'s own `header` token comment
documents) on every one of the 8 routes. The fragment section matches
exactly on 6 of 8 (`/en/strategy`, `/en/execution`, `/en/benefits`,
`/ar/benefits`, plus both `/contact` routes' form-card section, which
differs from the reference by exactly the reserved per-field validation-
error height CLAUDE.md's own "no CLS when errors appear" rule requires —
27px on `/en/contact`, expected and not a defect) and within 12–15px on the
remaining two (`/ar/strategy`, `/ar/execution`, both explained above).

**Lighthouse (chrome-devtools MCP, mobile): accessibility, best-practices,
SEO and agentic-browsing all 100/100/100/100** on every route sampled
(`/en/strategy`, `/ar/strategy`, `/en/execution`, `/ar/benefits`,
`/en/contact`). Zero console messages (errors or warnings) on all 8 built
routes. Zero horizontal overflow at 375 on all 8 (`scrollWidth` 360 against
`window.innerWidth` 375 throughout — the ~15px gap is the same reserved-
scrollbar artefact prior sections already document, not real overflow).
Opacity audit (every text-bearing leaf inside `<main>`, cumulative computed
opacity across all ancestors, after a scripted full scroll-through with
real per-step waits and a settle period — not an instant jump, which was
tried first and produced a false "hung reveal" reading purely from taking
the screenshot before the 850ms `.tm-rise` transition had finished):
`/en/strategy` 49 leaves, `/en/contact` 12 leaves, zero offenders on both.

**Contact form plumbing confirmed unchanged**: `action` still resolves to
the Formspree endpoint (env-var overridable, same fallback), `method=POST`,
the honeypot still carries `tabindex="-1"` + visually-hidden, `form.noValidate`
still flips to `true` once `scripts/contactForm.ts` runs (proving the script
took over from native constraint validation), and the new mono footnote
("We reply from a named address, not a queue.") renders verbatim in both
languages. Not submitted (no real POST sent), per this wave's own
instruction.

**A shared-browser-instance hazard confirmed empirically, distinct from the
`resize_page` under-reporting TODO.md already carries forward**: this
session's `chrome-devtools` MCP target was, for at least part of the
session, genuinely shared with a concurrent process (another agent's own
verification pass, visible as extra tabs on ports 4329–4331/4334 with an
`isolatedContext=auditcheck` tag neither this session nor its prompt
created). `select_page`'s own response confirmed a DIFFERENT page as
"[selected]" immediately after this session explicitly selected page 9,
and a subsequent `resize_page` call visibly resized the WRONG tab (a
390px-ish mobile-like width where 1440 was requested) — the OS-level
browser window is shared across every tab regardless of which one a given
tool call names, so two sessions issuing viewport changes for their own
different pages fight over one shared window. Switched to the Playwright
MCP (a separate, unshared browser process) for all measured comparison
work as soon as this was identified; `chrome-devtools`'s own `emulate`
(CDP per-target viewport override, not an OS window resize) proved
immune to the same interference and was used for the Lighthouse/
performance-trace/screenshot work that specifically needed that MCP.
A future session sharing this machine should expect the same and reach
for `emulate` or a separate browser process rather than `resize_page`.

## Board mobile fix (Command Centre board, home hero — mobile legibility/overflow)

**The user-reported "numbers overflow" was the board's `zoom` formula
shrinking to illegibility, not a page-level overflow the board itself was
causing.** `scripts/board.ts`'s `zoom = containerWidth / 1036` (capped at 1,
no floor) reached ~0.323 at 375px — the board's own smallest authored type
(`CommandCentreBoard.astro`'s `.kpi.budgetTarget` caption, 8px) rendered at
~2.6px, and every other label scaled proportionally. The reference itself
(`CommandCentreBoard.dc.html` / `Home (redesign).dc.html` at 375, served
locally over `python -m http.server`) does exactly the same thing —
zoom ≈0.3234, same formula, same illegible result — so this was not a
regression to fix but a design gap the reference doesn't solve either.
Fixed with a floor: `MOBILE_ZOOM_FLOOR = 7/8`, derived from that same 8px
minimum (7/8 keeps it at 7 effective px; every other board type, ≥8.5px,
clears 7.4px+). Below a ~906px container (`0.875 × 1036`, close to the
`lg` breakpoint) the board now stops shrinking and its existing frame —
`.cc-board`'s `overflow: hidden`, unchanged — crops more of the board
horizontally instead, anchored to the inline-start corner (sidebar + first
KPI tile(s) + start of the chart) via the board's own existing `dir`
mechanism, with no extra positioning code: a block child wider than its
parent already renders from the parent's start edge under `overflow:
hidden`, and mirrors under `dir=rtl` for free. Screenshotted at 375/414,
both languages (`screenshots/boardfix-after-{en,ar}-{375,414}.png`) —
reads as an intentional cropped corner, not a shrunken smudge; verified
unchanged at 1440 against the existing `redesign-compare2-board-built.png`
comparison (`zoom: 1`, identical layout).

**`text-size-adjust: none` had to go on as an inline `style` attribute, not
in the component's scoped `<style>` block, because the build's CSS
minifier silently drops the `-webkit-` prefixed declaration.** Authoring
`-webkit-text-size-adjust: none; text-size-adjust: none;` together inside
`.cc-board {}` survives Astro's own dev-time render but the production
`dist/en/index.html` keeps only `text-size-adjust:none` after build — the
`-webkit-` form is gone, and Chromium's actual font-boosting behaviour
only reads the `-webkit-` form, so the authored rule would have looked
correct in source while doing nothing once built (would have shipped
silently broken if not checked against the actual `dist/` output, not just
the dev server). Moved both declarations to an inline `style` attribute on
the board's root div (`CommandCentreBoard.astro`), which the minifier
doesn't touch; confirmed present in the built HTML after rebuild. Separately:
Chrome's `getComputedStyle` reports `text-size-adjust`/`-webkit-text-size-
adjust` as `100%` regardless of an element's actual specified value once
that value is the `none` keyword specifically (confirmed on a throwaway
test element: `37%` round-trips correctly through `getComputedStyle`,
`none` always reports back `100%` even though `element.style.getPropertyValue`
confirms `none` really is the specified value) — a Chromium CSSOM
reporting quirk for this specific legacy property, not a sign the fix
didn't take. Recorded here so a future session doesn't re-diagnose it as
a live bug from `getComputedStyle` alone.

**Re-investigating the P10-wave-1 "no real overflow" finding above (line
~838) surfaced one real gap in it: it was checked in the positive scroll
direction only, which is correct for LTR but misses a genuine, small,
RTL-only overflow.** Using this session's own corrected methodology
(`window.scrollTo(-9999, 0)` then reading `scrollX` back, in a dedicated
`isolatedContext` page to rule out the shared-browser-watcher hazard both
P10 sections above document) at 320/375/414px on `/ar/`: `scrollX` actually
reaches ≈-19.3px (320: -19.33, 375: -19.33, 414: -18), i.e. genuinely
reachable, not the layout-viewport-expansion artefact the same check
correctly clears for `/en/` (`scrollX` stays exactly 0 there at every
width tried, 320–768). Bisected to the same root cause the wave-1 entry
already named — `AiQueue.astro`'s `spotlight-accent` glow
(`pointer-events-none absolute -inset-10`) on the first (mint) card — just
mirrored to bleed physically start-ward (right, under `dir=rtl`) instead
of end-ward. Confirmed via `display:none` toggling in the isolated context
that this is 100% attributable to `AiQueue.astro`; the Command Centre
board contributes zero at every breakpoint checked, in both languages, with
or without its own `zoom` set (i.e. identically with JS never having run).
Not fixed here — `AiQueue.astro` is a different component, outside this
session's board-only brief — carried to TODO.md instead. Resolves to 0 at
768px and 1440px in both languages (2-column card grid gives the first
card enough margin).

## Blog redesign (2026-09-01) — two platform traps found by measurement

**1. `text-body` silently overrides any `text-blog-*` font size.** `body` is a
key in BOTH `theme.fontSize` and `theme.colors` in `tailwind.config.mjs`, so
Tailwind's `text-body` utility emits a `font-size` rule (1rem/1.55) as well as
the colour rule it is almost always written for. Tailwind orders the generated
fontSize utilities ALPHABETICALLY, so `.text-body` lands after every
`.text-blog-*` in the stylesheet, and an element written as
`class="text-blog-lede font-light text-body"` renders at 16px, not at the
token. Found on the post page's standfirst (`getComputedStyle` reported 16px
where 20px was expected) and confirmed by reading the byte offsets of the
compiled rules in `dist/en/blog/what-is-portfolio-governance/index.html`:
`.text-blog-lede` at 26006, `.text-body`'s font-size rule at 26190.

The site's existing `text-lede`/`text-small` call sites are safe only by
accident of the alphabet — "lede" and "small" sort after "body", so their
rules land later and win. Nothing in the config expresses that dependency.

Fixed at the one affected call site by dropping the colour utility and letting
the colour inherit (global.css applies `text-body` to the `body` element
itself, so every descendant already has it). Not fixed generally: renaming the
`body` fontSize key would touch the whole site, and relying on alphabetical
utility ordering is an implementation detail either way. Anything that needs a
`blog-*` size together with the body colour must inherit the colour.

**2. An unmatched `<` or `>` inside a frontmatter `//` comment breaks Astro's
props inference for the whole component.** `BlogPostArticle.astro` failed
`astro check` with `ts(2739): Type 'Record<string, any>' is missing the
following properties from type 'Props'` on its `Astro.props` destructuring line
— an error pointing at code that had not changed. Bisected one comment line at
a time to:

```
//      `.blog-prose > :first-child` has its block-start margin zeroed.
```

Reproduced from a clean file with `// a > b`, `` // `a > b` `` and `// x < y`
(all fail); `// \`<slot />\` carries it` and `// 5 > 3 but 2 < 4` both pass, so
it is an unbalanced angle bracket, not the character itself — the compiler
appears to start reading a tag and never generates the typed props for the
component. The build still succeeds; only `astro check` reports it, and the
message names the wrong cause. Avoid a stray `<`/`>` in frontmatter comments;
write "a child combinator" rather than the operator.

## The header row overflows its own grid column at `lg` and up

**Found:** 2026-09-01, while measuring /contact against the shared grid after
the owner's report that "the nav bar and content in screen are not aligned".
**Where:** `src/components/layout/Header.astro`, the
`mx-auto flex max-w-content ... gap-gutter px-gutter` row. Site-wide, every
route — not a /contact defect.

Measured at 1440 and again at 1920 (`getBoundingClientRect`, built page):

| | 1440 | 1920 |
|---|---|---|
| grid content edges (`max-w-content` minus `px-gutter`) | 194.3 → 1230.3 | 434.3 → 1470.3 |
| header brand start edge | 194.3 ✓ | 434.3 ✓ |
| header CTA end edge | 1264.7 ✗ | 1504.7 ✗ |

The row's three flex children (brand 188.2 + nav 554.3 + language/CTA group
183.9 = 926.4) plus its two `gap-gutter` gaps (2 × 72 = 144) total 1070.4px
against the 1036px the padded row actually offers, so `justify-between`
resolves the 34.4px deficit by pushing the end group past the content edge.
The overshoot is the same 34.4px at both widths because `max-w-content` and
`px-gutter` have both topped out by 1440 — it is a fixed shortfall, not a
proportional one.

Consequence: any page content that is correctly flush to the grid's end edge
(the /contact form card, and every blog route's column) sits 34.4px short of
where the header's CTA appears to end, which reads as a misalignment even
though the page content is the side that is right.

The fix belongs in the header, not in page content: give the row back the
~35px it is short (a smaller gap step between the three groups, or letting the
nav group shrink). Do NOT "fix" it by widening page content past
`max-w-content` — that would move every route off the shared grid to chase a
header bug.

**RESOLVED, 2026-09-01, same day**, in `Header.astro` by the session that owns
that file. Re-measured on the built page at 1440 after the fix landed: grid
content edges 194.3 → 1230.3, header brand start **194.3**, header CTA end
**1230.3**, /contact intro start **194.3**, /contact form card end
**1230.3** — all four agree, overhang 0. Kept here as the record of what the
symptom was and why page content was not the thing to change.

**3. `mx-auto` silently defeats CSS grid stretch.** Added during the same
day's wide-screen pass. A grid item only stretches to fill its track when its
inline size is `auto` AND neither inline margin is `auto` — and `mx-auto`,
which the blog's blocks carry so they centre in the single-column layout below
`lg`, sets both margins to `auto`. On the grid at `lg` those blocks therefore
shrank to their own content and centred inside the track instead of filling
it: measured 540px for the post's topics footer and 543px for its CTA panel
against a 704px column, while the article body happened to look correct only
because a paragraph's max-content width exceeds the cap anyway — i.e. the bug
was invisible on the one block anyone would have eyeballed. Fixed by adding
`lg:w-full` alongside the `max-w-*` cap, which gives a definite inline size so
the auto margins resolve to 0. Worth knowing before adding a fifth block to
that grid.
