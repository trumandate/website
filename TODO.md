# TODO.md — TruMandate site

Deferred work. Nothing here lives only in a spec, in BUILD_FLAGS.md, or in chat.

## From P1 (scaffold, tokens, shared components)

- **`src/pages/index.astro` is a scaffold verification page, not the real
  route.** PLAN.md §1 has `/` as a bare 302 to `/en/`. Replace this file with
  that redirect once `src/pages/en/index.astro` exists (P2), and delete the
  "P1 scaffold check" content.
- **`Button.astro` (shared primary/ghost button) does not exist yet.** P1's
  build list was tailwind config + Section + Reveal + header/footer only, so
  `Header.astro`'s primary CTA is an inline-styled `<a>` rather than a shared
  component. Build `Button.astro` at P2 and swap Header's CTA to use it.
- ~~**Arabic nav labels are provisional, not reviewed copy.**~~ Confirmed
  unchanged at P6-AR, once the product-page Arabic existed to check them
  against — الاستراتيجية / التنفيذ / المنافع are the short forms of the three
  page titles now written (الاستراتيجية ومؤشرات الأداء / التنفيذ والحوكمة /
  تحقيق المنافع), the same relationship the English nav has to its own page
  titles. تواصل (`/contact`) still awaits P7. See the P6-AR section below.
- ~~**Header height offset is an estimate.**~~ Resolved at P2: measured the
  fixed header at 94.625px (chrome-devtools MCP, both 375 and 1440 widths —
  it doesn't vary with viewport), added a `header` spacing token (6.5rem /
  104px, tailwind.config.mjs) and swapped `<main>`'s `pt-20` for `pt-header`.
- ~~**Favicon set not supplied.**~~ Resolved at P9: `favicon.svg` (the
  three-bar mark, reused from `Header.astro`'s own geometry), `favicon.ico`
  (16/32/48, hand-rolled PNG-embedded ICO container), `apple-touch-icon.png`
  (180×180) and `site.webmanifest` all built and wired into
  `BaseLayout.astro`'s `<head>`. The 404 is confirmed dead (chrome-devtools
  MCP, hard reload, zero console messages, `favicon.svg`/`favicon.ico` both
  200).
- ~~**OG images not supplied.**~~ Resolved at P9: `public/og/og-en.png` and
  `og-ar.png`, 1200×630, generated from the design system (wordmark + chain
  motif on jade, spec §5A) via a scratchpad script using the project's own
  `sharp`. Wired into every route's `<head>` (`components/seo/Meta.astro`)
  with absolute URLs, dimensions and alt text.
- ~~**Vendor SVGs are placeholders.**~~ Closed at P9 for the certification
  mark (deliberately omitted — see BUILD_FLAGS.md's P9 decisions log:
  Intertec Systems holds certifications at company level, the product does
  not). The Intertec Systems logo item is **in progress**, not missing:
  Piyush supplied the real file as this prompt was closing out
  (`assets/intertec-logo.svg`, 200×140), too late in this pass to vectorize
  into `Footer.astro` and re-verify in the same run — see this file's P9
  section below for the one remaining step. Both draft placeholder files
  this build had added (`public/vendor/*.svg`) were removed rather than left
  as "coming soon" stand-ins.
- ~~**Contact email is a placeholder.**~~ Resolved at P9: replaced with the
  real address, `trumandate@intertecsys.com` (BUILD_FLAGS' `hello@trumandate.com`
  default is gone from every live string), wired into `i18n/ui.ts` and
  `ContactPage.astro`'s `mailto:` link, both languages.
- **Formspree endpoint is a placeholder.** `.env`'s
  `PUBLIC_FORMSPREE_ENDPOINT` is a fake URL. Still open at handoff — the one
  item on this list that needs a real external service Claude Code cannot
  supply. Exact replacement steps: MORNING-REPORT.md's launch checklist.
- ~~**`site.webmanifest` not built.**~~ Resolved at P9, alongside the favicon
  set above.
- **Lenis not added.** PLAN.md §1 lists `src/scripts/lenis.ts`, but smooth
  scroll is motion-prompt work (P3/P4), not shared-component scaffolding.
  Evaluate then, per BUILD_FLAGS: "remove it rather than patch it if it
  fights ScrollTrigger on iOS."
- ~~**`sitemap.xml.ts` not built.**~~ Resolved at P9: hand-written static
  endpoint, ten `<url>` entries (five routes × two languages), each carrying
  all three hreflang alternates. Confirmed in the built `dist/sitemap.xml`.
- ~~**`robots.txt` currently disallows all crawling**~~ (noindex-for-build-
  duration). Resolved at P9 (user decision): flipped to `Allow: /` plus a
  `Sitemap:` reference — this build is treated as launch-ready now, so
  README-BUILD.md §6 step 6 is executed in this same pass rather than left
  for a separate launch day.

## Carried from PLAN.md §4 (ambiguities flagged at P0, not yet re-confirmed)

See PLAN.md §4 for the full list and reasoning; items 1–6 (structural) were
already gated and resolved with Piyush before P1 — see BUILD_FLAGS.md's
decisions log. Items 7–22 (motion re-expression, numeral rule contradiction,
RAG colour-only status, fragment `aria-label` vs `role="img"`) remain open
and will be addressed as the pages that touch them get built (P2 onward).

## From P2 (home page, English, zero animation)

- ~~**Chain motion (motion #1: pin + scrub + per-node one-shot triggers) is
  not wired.**~~ Resolved at P3: `scripts/chain.ts` wires the rail's
  `scaleY` scrub (transform-origin block-start, no manufactured scroll
  distance), each link's one-shot activation trigger at "top 78%", and
  `ChainMarker.astro`'s counter/name updating live off the same scrub
  progress. Two pre-existing defects surfaced by actually scrolling the
  built page (chrome-devtools MCP) rather than by static screenshot, both
  fixed at P3 — see `BUILD_FLAGS.md`'s decisions log: (1) `motion.ts`'s
  `whenMotionSafe` never ran `setup` for any visitor who had *not* asked for
  reduced motion, a `gsap.matchMedia()` gotcha that affects every motion
  script built on it, not just the chain; (2) `ChainMarker.astro`'s sticky
  column had no room to stick (its immediate wrapper didn't stretch to the
  grid row's height), so the "pin" never engaged at all pre-P3.
- ~~**AI card arrival + confidence bar fill (motion #4) not wired.**~~
  Resolved at P4: `scripts/aiCard.ts` runs a two-tween timeline off the
  card's own once-only ScrollTrigger — a 16px/0.5s translateY+opacity
  entrance, then the confidence-bar fill as `scaleX(0 → 1)` over 0.6s
  (spec §7's own value) against the bar's already-77%-wide CSS box, per
  CLAUDE.md's transforms-only rule. `SuggestionCard.astro` reuses
  `Reveal.astro`'s `.reveal` CSS end-state class (not the `Reveal`
  component/`data-reveal` hook itself, which would double-animate it) and
  adds a scoped `[dir="rtl"]` override for the bar's transform-origin,
  since Tailwind's `origin-*` utilities are physical-only.
- ~~**Sparkline draw and the AED 41M counter (motion #5) not wired.**~~
  Resolved at P4: the sparkline's "drawn on scroll" brief language is
  downgraded to a fade (PLAN.md §4 ambiguity 7) — implemented as one more
  `<Reveal>` instance around the SVG, reusing motion #2 rather than adding
  a seventh animation. The counter (`scripts/counter.ts`) tweens a proxy
  object 0 → 41 on first view and writes `AED {n}M` into the element's own
  text each frame; `tabular-nums` plus a reserved `min-inline-size`
  (`ObjectiveRecord.astro`) keep the "0" → "41" digit-count change from
  reflowing the row.
- **The AI section's spine-to-card connector is a simplified
  approximation.** PLAN.md §3 describes the rail arriving at the suggestion
  card's inline-start edge and stopping there. What's built: a vertical
  rail spanning the two-column grid row's full (CSS-grid-stretched) height
  plus a short horizontal tick at its foot — a reasonable gesture toward the
  card rather than a precisely computed edge-to-edge weld. Revisit if a
  design review wants exact pixel alignment.
- ~~**Home-page body copy (hero, failure modes, chain, AI moment, closing
  CTA) is not yet in `i18n/ui.ts`'s typed bilingual dictionary.**~~ Resolved
  at P5: moved into `UiStrings.home` (`i18n/types.ts`/`ui.ts`), both
  languages, and every home/chain/AI/fragment component now takes a `lang`
  prop and reads its copy through `useTranslations` instead of hardcoding
  English JSX. `src/pages/en/index.astro` was updated to pass `lang="en"`
  through the same components rather than forking a parallel tree, per
  PLAN.md §1's "keep one shared component" bias.
- ~~**`StageGateQueue.astro` and `CommandCentreDim.astro` are LTR-only.**~~
  Resolved at P5. `CommandCentreDim.astro` (no `<text>`) mirrors as a whole
  group via `:global([dir="rtl"]) .command-centre-dim svg { transform:
  scaleX(-1); }`. `StageGateQueue.astro` (has `<text>`) got a hand-authored
  mirrored geometry: every x-coordinate is `360 - x` (rects additionally
  subtract their own width), text-anchor flips from `start` to `end`, and
  the fragment's own `direction: ltr` is pinned explicitly (see
  known-issues.md — without it, the inherited `dir="rtl"` from `<html>`
  flips what `text-anchor: start/end` even mean, breaking every
  hand-computed coordinate).
- **`ClosingCta.astro`'s CTA-overlay vertical position (`top-[66%]`) is an
  eyeballed value**, not computed from `CommandCentreDim`'s empty-band
  coordinates (viewBox y 402–480 of 640). Contrast holds regardless because
  the composition is dimmed to 25% (verified via screenshot at P2), but a
  design pass could tighten the alignment.

## From P4 (motion items 2–6)

- ~~**`StageGateQueue.astro`'s motion #3 wipe travels a fixed LTR direction**~~
  Resolved at P5: `scripts/fragment.ts` reads `document.documentElement.dir`
  once and animates `x: isRtl ? width : -width` instead of the fixed
  `-width`, so the mask slides in from the opposite side under `/ar`,
  uncovering from the fragment's (now-mirrored) inline-start edge outward,
  matching StageGateQueue.astro's own mirrored geometry above.
- **Motion #4's card-slide duration (0.5s) and motion #5's counter
  duration (1.2s) are judgement calls, not spec values.** Spec §7 item 4
  names only the confidence-bar's 0.6s; item 5 names no duration at all.
  Tokenised in `tailwind.config.mjs` (`transitionDuration.card`,
  `transitionDuration.counter`) with the reasoning inline, same treatment
  as the P0 ease/rhythm judgement calls already logged in BUILD_FLAGS.md.
- **Considered and rejected: a per-column stagger on the three failure-mode
  reveals.** Multiple `<Reveal>` instances side by side in one `lg:grid-
  cols-3` row cross the "top 85%" trigger at essentially the same scroll
  position anyway, so a manual stagger would only have been visible on
  narrow viewports where the columns stack — and spec §7's inventory has no
  "staggered reveal" entry distinct from the plain section reveal. Built as
  one `<Reveal>` around the whole section instead (matches Hero's and
  ChainSection's pattern); flagged here rather than silently added as a
  seventh animation.
- ~~**LCP is still ~400ms over spec §9's 2.0s budget under Slow 4G + 4x
  CPU**~~ Resolved in a later prompt: `astro.config.mjs`'s
  `build.inlineStylesheets` set to `'always'` removes the global stylesheet
  as a render-blocking network request (it was previously external and
  render-blocking under Astro's default `'auto'` threshold, since the
  project's one stylesheet sits above Vite's ~4KB auto-inline limit).
  Measured on a clean production build served from `dist/` (port 4323):
  Slow 4G + 4x CPU LCP 1,925–1,934ms → 1,137ms; Fast 4G LCP 607ms → 344ms;
  CLS 0.00 throughout. Font preloads were also audited (3 Latin subsets on
  `/en/`, no Arabic subset, `font-display: swap` confirmed) and left
  unchanged — full detail and the one forward-looking trade-off (every
  route now ships its own inline copy of the stylesheet rather than
  sharing one cached external file) in known-issues.md's P4 section and
  BUILD_FLAGS.md's decisions log.
- **No WebKit-specific verification of the P4 motions.** The Playwright MCP
  available this session runs Chromium only; spec §10's WebKit pass
  (pinned-section divergence) is still owed. Carried from known-issues.md.

## From P5 (Arabic home page, RTL)

- ~~**Arabic nav labels are still provisional**~~ (carried from P1). Not
  re-confirmed at P5 — the home page doesn't touch the nav strings themselves,
  only the routes they point to — and confirmed at P6-AR instead, when the
  three Arabic page titles they abbreviate were written.
- **`StageGateQueue.astro`'s invented copy** (owner name, gate numbers, due
  date — none of it sourced from the content brief) **now has an Arabic
  version written per BUILD_FLAGS' "written, not machine-translated" rule,
  not reviewed copy in the P6 sense.** Same caveat as the provisional nav
  labels: fine to ship, worth a copy pass alongside the product pages.
- **No WebKit-specific verification of the P5 RTL work.** Same constraint
  as the P4 item above (Playwright MCP this session is Chromium-only).
  Spec §10's WebKit pass still owes both the pinned-section and the RTL
  mirror a real Safari check — Safari has historically had more bidi/logical-
  property bugs than Chromium, so this is a real gap, not a formality.
- **The Command Centre's dimmed composition is dimmed enough that its
  mirror is hard to eyeball-verify by casual inspection.** Confirmed
  correct programmatically (`getComputedStyle(svg).transform ===
  "matrix(-1, 0, 0, 1, 0, 0)"` under `/ar`) and visually at full brightness
  during development, but a future contributor changing this file should
  re-check the computed transform directly rather than trusting a glance at
  the 25%-opacity result.

## From P6 (the three product pages, English only)

- ~~**Arabic for `/strategy`, `/execution` and `/benefits` does not exist and
  must not be written until Piyush approves `COPY-REVIEW.md`.**~~ Resolved at
  P6-AR, after the English was approved with no edits. Both languages now sit
  in one `Record<Language, Record<ProductPageKey, ProductPageCopy>>` table in
  `src/components/product/copy.ts` — NOT in `UiStrings.product` as this item
  originally specified, because `ProductPageCopy` carries a `string[]` and a
  `number` and `useTranslations`' `KeyPath`/`t()` contract is string-only; the
  three fragments' short label strings, which really are all strings, did go
  into `i18n/ui.ts` under a new `fragment` branch and reach the SVGs through
  `t()` exactly as `home.stageGate.*` does. Reasoning logged in
  BUILD_FLAGS.md. `/ar/{strategy,execution,benefits}.astro` created, passing
  `lang="ar"` to the same `ProductPage.astro`; the three routes added to
  `pairedRoutes`, so LangToggle now pairs both ways on all three (verified).
- ~~**The three new fragments are LTR-only.**~~ Resolved at P6-AR. Each of
  `KpiCard.astro`, `InitiativeRows.astro` and `BenefitCurve.astro` now carries
  a hand-mirrored second geometry (every x becomes `460 - x`, rects
  additionally subtracting their own width; the initiative bar's fill is
  re-anchored so it grows from the track's inline-start edge; the benefit
  curve's time axis mirrors with everything else so it runs right to left).
  One deliberate divergence from `StageGateQueue.astro`'s P5 treatment: rather
  than pinning `direction: ltr` in both languages and flipping every
  `text-anchor` by hand, the mirrored branch sets `direction: rtl` (via
  `:global([dir="rtl"]) .fragment-class`), so `text-anchor: start` resolves to
  the inline-start edge by itself AND mixed strings such as "آخر 6 فترات" get
  their natural Arabic bidi order instead of being laid out in an LTR
  paragraph. See the new item below about aligning StageGateQueue with this.
- **The three fragments are specifications, not transcriptions.** Spec §5's
  fidelity rule says that where the real Echelons UI exists the SVG is
  authored against a screenshot of it, and where it does not, "the fragment is
  a specification the UI must be built toward, not licence for marketing to
  invent a nicer product". No screenshot of the real KPI card, portfolio list
  or benefit curve was available this session, so all three were authored from
  the field lists in `trumandate-product-pages.md` and spec §5. Each needs a
  side-by-side check against the actual product before launch — flagged for
  the reviewer in COPY-REVIEW.md too.
- **Fragment type is small at 375px.** The three fragments are `w-full
  max-w-[560px]` over a 460-unit viewBox, so at a 375 viewport their 10–11px
  user-space labels render at roughly 7–8px. That is the same band
  `StageGateQueue.astro` already sits in (its 9px labels at ~0.95 scale), and
  the trade is deliberate: a wider native viewBox would render closer to 1:1
  on desktop but would shrink these labels further on the viewport most
  readers use. Revisit only if a design review finds them genuinely
  unreadable on a real handset — the fix would be a mobile-simplified
  fragment variant, which costs a second geometry per fragment.
- **The product fragments crop at their own frame edge, not the section
  edge.** `trumandate-product-pages.md` asks that "every fragment crops at the
  section edge so the composition visibly continues". As built, the crop is
  authored into each viewBox and the SVG is capped at 560px, so on a 1440
  viewport the cut lands inside the 1180px column rather than at its edge.
  This matches `StageGateQueue.astro`'s accepted P2 pattern and reads as
  "continues" regardless; a design pass wanting the literal section-edge crop
  would need either a full-bleed fragment section or a CSS
  fade-to-page-ground mask applied consistently to all four fragments,
  including the home one.
- **No WebKit pass on the three new routes.** Same constraint carried from
  P4/P5: the Playwright MCP in this session is Chromium-bound. These pages
  have no pin and no scrub, so the historical Safari divergence risk is much
  lower than the home page's, but the fragment wipe (an SVG `<mask>` moved by
  `transform`) is worth a real Safari check.
- **`Handoff.astro` renders only the primary CTA.** PLAN.md §4 item 17 flags
  that the secondary CTA ("See the chain") has no target off the home page —
  there is no chain section on a product page to anchor to. Decide at the QA
  pass whether these routes should carry a secondary CTA at all (e.g. back to
  the home chain) or stay single-CTA.
- **A clean throttled LCP re-measure is owed on an idle machine.** The
  Slow 4G + 4x CPU numbers taken this session are contaminated by ~92% host
  CPU load from unrelated processes — the untouched home page measured
  3,391 ms against the 1,137 ms recorded for it in known-issues.md, so the
  absolute figures are not comparable to the P4 baseline. Full detail and the
  same-session control numbers in known-issues.md's P6 section.
- ~~**The header's "Request a walkthrough" CTA wraps to two lines** at both 375
  and 1440 (measured 63px tall against a 23.3px line-height). Pre-existing in
  `Header.astro` and reproduced on the untouched home page, so not introduced
  by P6, but it is visible in all six P6 screenshots and wants a
  `whitespace-nowrap` or a shorter header label. Logged in known-issues.md.~~
  Resolved at P8: `Button.astro` gained `shrink-0 whitespace-nowrap` (every
  Button site-wide, not just this one) and `Header.astro`'s wordmark text
  is now `hidden sm:inline` (icon-only below 640px, `aria-label` unchanged).
  Verified one line, no overflow, at 375/768/1440 in both languages. Full
  root-cause writeup in QA-REPORT.md §1.

## From P6-AR (the three product pages in Arabic)

- **The Arabic product-page copy wants a native-reader pass, the way the
  English got one.** It is in `COPY-REVIEW.md` under "Part two — the Arabic",
  as plain prose in reading order, with a short note per page saying how the
  argument was restructured and a list of the vocabulary choices worth a second
  opinion (نقطة الوصل, تدرّج الأهداف, تحقيق المنافع, تسرّب المنفعة, المستهدف).
  Nothing about it blocks a build; it is a copy review, not a defect.
- **`StageGateQueue.astro` still uses P5's direction handling, the three
  product fragments use P6-AR's.** P5 pins `direction: ltr` in both languages
  and hand-flips every `text-anchor`; P6-AR's three fragments set
  `direction: rtl` on the mirrored branch and let `text-anchor: start`/`end`
  resolve logically. Both are correct on screen today. The newer one is better
  for any label mixing Arabic with digits — under a pinned-LTR paragraph the
  Arabic run is laid out to the left of the number, so an Arabic reader meets
  the number first — and `home.stageGate.dueValue` ("14 أغسطس") is exactly such
  a label. Worth migrating StageGateQueue to the same treatment so the codebase
  has one answer rather than two, but it is a visual-nicety fix on an
  already-shipping fragment, not a defect: deliberately not done in the same
  pass that introduced the second pattern.
- ~~**Arabic nav labels are provisional, not reviewed copy.**~~ Confirmed at
  P6-AR (carried from P1 and P5). الاستراتيجية / التنفيذ / المنافع read as the
  short forms of the three page titles now written and reviewed
  (الاستراتيجية ومؤشرات الأداء / التنفيذ والحوكمة / تحقيق المنافع), exactly as
  the English nav's Strategy / Execution / Benefits are short forms of
  "Strategy and KPIs" / "Execution and governance" / "Benefits realisation".
  Left unchanged, now deliberately rather than provisionally. تواصل
  (`/contact`) is untouched by this prompt and gets its confirmation at P7,
  when the contact page's Arabic is written.
- **The Arabic fragments' figures use Plex Sans, not Plex Mono, even for
  digit-only values** (`42.0`, `74%`). Spec §3's mono→sans swap is written
  about Arabic joining, which digits do not have — but `/ar` never preloads
  Plex Mono (BaseLayout.astro), so keeping the figure role mono would make
  three digits per fragment the only reason an Arabic page fetches a fifth font
  file. Verified on the built pages: `/ar/strategy` fetches four font files and
  no mono. Revisit only if a design review wants tabular digits in Arabic badly
  enough to pay for the request.
- **No WebKit pass on the three Arabic routes.** Same constraint carried from
  P4/P5/P6: the browser MCP in this session is Chromium-bound. This is the
  gap that matters most of the ones outstanding — Safari has historically had
  more bidi and logical-property bugs than Chromium, and these three routes
  now depend on `direction: rtl` resolving `text-anchor` inside SVG `<text>`,
  which is precisely the kind of thing that diverges. The English siblings are
  unaffected either way.
- **The fragments' side-by-side check against the real product now covers two
  languages.** Carried from P6: no screenshot of the real KPI card, portfolio
  list or benefit curve was available, so all three are specifications rather
  than transcriptions (spec §5). The Arabic adds a second question to that
  review — whether the real Arabic UI mirrors these surfaces at all, and
  whether its own column order and labels match what is drawn here.

## From P7 (`/contact`, both languages)

- ~~**Formspree endpoint is a placeholder.**~~ Still a placeholder value
  (`.env`'s `PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/placeholder`) —
  carried from P1, now actually wired into `ContactForm.astro`'s `action`
  attribute and `scripts/contactForm.ts`'s `fetch` call (both read the same
  env var, so there is exactly one place to change before launch). Replace it
  with the real endpoint before launch; nothing else in the form needs to
  change when that happens.
- ~~**Contact email is a placeholder, not wired into any page yet.**~~
  Resolved at P7: `hello@trumandate.com` (BUILD_FLAGS default) now appears as
  a real `mailto:` link under the lede on `/contact`, both languages
  (`contact.emailNote`, `ContactPage.astro`). Still the placeholder address —
  replace it at launch alongside the Formspree endpoint above.
- ~~**The deployment-and-data-sovereignty band ships with two verbatim lines,
  not the three `trumandate-product-pages.md` describes**~~ Closed at P9
  (user-approved 2026-08-17): the two-line shape ships as final, not pending
  a third line. Spec §5A's own candidate third element — a certification
  mark — is also closed, deliberately omitted rather than added: Intertec
  Systems holds certifications at company level, the product does not, and
  spec §5A's own word for this asset is "held". See BUILD_FLAGS.md's P9
  decisions log and `SovereigntyBand.astro`'s own comment.
- **"What you want to see" is built as four radio buttons, not the select
  element the brief's own prototype (`docs/trumandate-home.html`) used.** The
  content brief just says "options" without naming a control type. Radios
  keep every option visibly readable without a click (matching the site's
  "no hidden menus" plainness elsewhere — `ObjectiveRecord.astro`'s hairline
  rows, not a dropdown) and degrade identically with JavaScript disabled.
  Judgement call, not a defect; a design review could reasonably prefer the
  select.
- **Interest option values are stable English keys**
  (`full-walkthrough`/`strategy-kpi-cascade`/`benefits-realisation`/
  `deployment-sovereignty`), independent of `lang`, so a Formspree submission
  is legible regardless of which language the visitor filled the form in.
  Judgement call, logged here and in BUILD_FLAGS.md.
- **The honeypot field is named `_gotcha`**, Formspree's own documented
  honeypot convention — chosen specifically because it means the no-JS POST
  path is ALSO protected (Formspree discards any submission with that field
  filled, server-side, with no script involved), not just the JS-enabled
  path, which `scripts/contactForm.ts` additionally short-circuits
  client-side as a belt-and-braces measure.
- **All contact-page validation, submission-status and honeypot copy is
  invented** (no line of it is in the content brief): the two error messages,
  the error-summary heading, the success/failure banner text, the honeypot's
  visually-hidden label, and the "prefer email" line wiring in the placeholder
  address. Written directly in each language per BUILD_FLAGS' "written, not
  machine-translated" rule, the same treatment `home.stageGate` and
  `fragment.*` already got. Full list in `i18n/types.ts`'s `contact` doc
  comment.
- **`tailwind.config.mjs` gained one theme extension**: `extend.aria.invalid
  = 'invalid="true"'`. Tailwind's own default `aria` variant map (busy,
  checked, disabled, expanded, hidden, pressed, readonly, required, selected)
  doesn't include `invalid`, so `aria-invalid:border-red` — the field-invalid
  visual state `FormField.astro` needs, always paired with the field's own
  error text, never the only signal — silently failed to compile until this
  was added (found by grepping the compiled CSS for the literal selector, not
  by trusting the class name looked right — see known-issues.md's P7 section
  for the full story, including a red herring in that investigation).
- **The header's two-line "Request a walkthrough" CTA (carried from P1/P2,
  still open per P6/P6-AR) reproduces on `/contact` too, in both languages.**
  Not introduced here — `Header.astro` was not touched this prompt — but
  visible in all four P7 rest-state screenshots. Still a `Header.astro` fix,
  still out of scope for this prompt.
- **No WebKit-specific verification of `/contact`.** Same constraint carried
  from P4–P6-AR: the browser MCP available this session is Chromium-bound.
  This page has no pin, no scrub and no fragment wipe (spec §6: "Form only"),
  so the historical Safari pinned-section risk doesn't apply here, but the
  custom validation JS (event handling, `FormData`, `fetch`) is still worth a
  real Safari pass before launch.
- **A clean throttled (Slow 4G + 4× CPU) LCP re-measure on an idle machine is
  still owed**, same carried item as P6/P6-AR — this session's Fast 4G,
  no-CPU-throttle numbers (`/en/contact` 323–344 ms, `/ar/contact` 351 ms,
  CLS 0.00 on both) are a same-session comparison against the other routes
  measured the same way this session, not a substitute for the heavier
  profile.

## From P8 (full verification pass)

- ~~**Home page chain-link rest-state contrast is a genuine spec-vs-spec
  conflict, not fixed this pass.**~~ Resolved at P9 (user-approved gate,
  2026-08-17): `opacity.rest` (tailwind.config.mjs) raised from spec §7's
  literal 0.40 to 0.57 — the smallest two-decimal value clearing 4.5:1 for
  BOTH `text-paper` and `text-body` over `ink`, computed with real alpha
  compositing (`text-body` is the binding constraint: 4.51:1 at 0.57 vs.
  4.43:1 at 0.56). Lighthouse accessibility re-verified 100 on both `/en/`
  and `/ar/` (was 96). Full before/after in BUILD_FLAGS.md's P9 decisions
  log and known-issues.md's P9 section; the original conflict and its
  measurements remain on record in QA-REPORT.md §4/§6 and this file's P8
  section unchanged, as the history of why the value moved.
- **`<main id="main">` has no `tabindex="-1"`.** The skip link still works
  correctly in Chromium (confirmed by reading `document.activeElement`
  after `Tab`+`Enter`+`Tab`: focus lands on the first element inside
  `<main>`, fully bypassing the header), but that relies on Chromium's
  navigation-focus fallback rather than a spec-guaranteed target. Adding
  `tabindex="-1"` to `<main>` in `BaseLayout.astro` would make the same
  behaviour hold by contract rather than by browser-specific fallback, and
  costs nothing (WCAG technique G1). Not verified in WebKit this pass. Still
  open at P9 — not in this prompt's stated build list, left rather than
  gold-plated in.

## From P9 (SEO, OG images, favicons, contrast fix, launch decisions)

- **Intertec Systems logo — in progress, not missing.** Piyush supplied the
  real file as this prompt was closing out: `assets/intertec-logo.svg`
  (200×140 viewBox, 9.1 KB). One step remains, deliberately not done in this
  same pass so it gets its own build-and-verify cycle rather than a rushed
  last-minute edit: wire it into `Footer.astro`'s brand-credit line (matching
  the same "author from the reference file as tokens/inline SVG, the source
  file itself never ships" treatment `assets/logo.png` got for the
  TruMandate mark — spec §5A's no-photography/no-raster-outside-the-asset-
  list invariant applies here too), then re-run the standing greps
  (physical-direction, hex-outside-config) and a contrast check on whatever
  ground it sits against. No placeholder graphic ships in the meantime
  (BUILD_FLAGS.md's P9 decisions log) — the footer's existing plain-text
  company credit remains the real attribution until the swap lands.
- **`seo/JsonLd.astro` was never built.** PLAN.md §1's file tree plans an
  Organization + SoftwareApplication structured-data component; this
  prompt's explicit build list didn't include it, so it stayed out of scope
  rather than being added unrequested in the final prompt. Optional future
  work — full reasoning in BUILD_FLAGS.md's P9 decisions log.
- **A native-reader Arabic pass is still owed** on the home page, the three
  product pages and `/contact` — carried from P5/P6-AR/P7, unaffected by
  this prompt (P9 touched no page copy). Full vocabulary-review notes:
  COPY-REVIEW.md.
- **WebKit-specific verification of `/contact` and the three product pages
  is still owed** — carried from P4–P7; every session's Playwright MCP so
  far has been Chromium-bound. The home page's pinned/scrubbed section and
  its RTL mirror were both verified in real WebKit at P8 with no defect
  found; the remaining four routes (both languages) have no pin/scrub, so
  the historical Safari risk is lower, but unverified.
- **A clean throttled (Slow 4G + 4× CPU) LCP re-measure on an idle machine
  is still owed**, carried from P6 onward (see that section's host-load
  contamination note). P9 only added `<head>` bytes (meta/OG/hreflang tags,
  all text, no new blocking requests) and re-ran a quick unthrottled sanity
  check on `/en/` — LCP 140ms, CLS 0.00, confirming no regression from the
  larger `<head>` — not a substitute for the heavier profile.
- **The Formspree endpoint remains the one placeholder Claude Code cannot
  close.** Exact replacement steps are in MORNING-REPORT.md's launch
  checklist rather than repeated here.
