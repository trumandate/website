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
- ~~**Formspree endpoint is a placeholder.**~~ Resolved 2026-08-18: user
  created the form (recipient `trumandate@intertecsys.com`), live endpoint
  `https://formspree.io/f/meajpeja` wired into `.env` and as the in-code
  fallback in `ContactForm.astro` (endpoint is public by design), verified
  end-to-end with a real accepted test submission. Cloudflare env var is now
  an optional staging override, not a launch requirement.
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
- ~~**The three fragments are specifications, not transcriptions.**~~
  Re-attempted at P10 wave 2, per the wave's explicit fragment-fidelity
  mandate — **still not closeable against the real product**, for a
  documented reason rather than a skipped step. The task named a Claude
  Design "TruMandate Design System" project (id
  `c14a7f00-8160-4bca-9370-fda4d8f05d0a`) holding the real platform's
  `ui_kits/trumandate-platform/` component files and instructed loading a
  "DesignSync" tool via `ToolSearch` to fetch them read-only. `ToolSearch`
  (tried against `DesignSync`, `design sync get_file`, `mcp__design`, and
  keyword variants) surfaced no such tool in this session — it is not
  available to call, regardless of the fact that this repo's own
  `.design-sync/config.json` proves a DesignSync integration exists for
  *this* project (a different, unrelated sync target — that config's own
  note is explicit: "the separate pre-existing project 'TruMandate Design
  System' ... is the PRODUCT design system — never sync this repo into it").
  With no reference imagery reachable, the only available ground truth
  remained what P6 already had: `trumandate-product-pages.md`'s curiosity
  ledger and spec §5's fidelity rule. Re-checked line by line against
  `KpiCard.astro`, `InitiativeRows.astro` and `BenefitCurve.astro` as they
  stand today — label/baseline/target/actual/RAG-dot/sparkline (KPI card),
  three RAG-dotted progress rows cropped mid-list with one row red
  (initiative rows), and the forecast-vs-actual curve with measurement
  window and today marker, no value/time axis (benefit curve) — all three
  still match their ledger entries exactly, which is what spec §5 sanctions
  when no real-UI screenshot exists ("the fragment is a specification the UI
  must be built toward"). Per §4.2's elevation recipe, each fragment's card
  `<rect>` gained a 1px `fill-highlight` top-edge sibling this wave (the
  ledger-sanctioned chrome/light-catch change, not a data change), verified
  inset within the existing crop in every case. **Verdict: spec-consistent,
  not verified against the real UI — re-attempt when the DesignSync tool (or
  direct access to project `c14a7f00-…`) is actually callable.**
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
- ~~**The fragments' side-by-side check against the real product now covers two
  languages.**~~ Re-attempted at P10 wave 2 alongside the P6 item above, same
  outcome for the same reason: the DesignSync tool named in the wave's own
  fidelity mandate did not surface via `ToolSearch` in this session (see the
  P6 item's fuller writeup), so the Arabic question this item raises — whether
  the real Arabic UI mirrors these surfaces, and whether its column order and
  labels match what's drawn here — could not be checked against real Arabic
  reference imagery either. The Arabic geometry itself was re-confirmed
  internally consistent with its own English sibling (same field set, same
  RTL mirror rules, `known-issues.md`'s P5/P6-AR entries) and gained the same
  §4.2 highlight-rect treatment, mirrored where the fragment's own geometry
  is mirrored (KpiCard's two RTL card rects; InitiativeRows' single container
  rect is symmetric and needs no mirrored variant; BenefitCurve's one
  mirrored plot-card rect). Closing this as "checked, blocked on tooling" per
  the wave's own instruction to report the fidelity verdict honestly rather
  than silently marking it done or silently dropping it — not closing it as
  "verified against the real product," which remains untrue.

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

- ~~**Intertec Systems logo — in progress, not missing.**~~ Resolved in the
  follow-up P9b pass: `src/components/layout/IntertecLogo.astro`, re-authored
  from `assets/intertec-logo.svg` (reference-only, never shipped) as a single
  `currentColor` inline SVG — both original fills (a dark gray for the
  "ntertec" letterforms/globe, a red for the accent dot) dropped in favour of
  one monochrome colour inherited from the container, per CLAUDE.md's
  partner-logo-mono direction. The reference file's clipPath + per-path
  `matrix(1 0 0 1.00609 436 94)` inside a `translate(-436 -94)` group (an
  export artefact) was collapsed: the two transforms compose to a bare
  1.00609x vertical scale (0.6%, imperceptible), dropped rather than carried
  forward — the component's paths are the reference file's raw coordinates
  against a plain `viewBox="0 0 200 140"`, no wrapper transform, no clipPath,
  anywhere. Wired into `Footer.astro` replacing the "Intertec Systems" half
  of the brand-credit line; `· Dubai`/`· دبي` stays as text. This needed
  splitting `i18n/types.ts` and `ui.ts`'s `footer.company` (was the full
  verbatim "Intertec Systems · Dubai" string) into `footer.company`
  ("Intertec Systems"/"إنترتك سيستمز", now the logo's `aria-label`) and a new
  `footer.location` ("Dubai"/"دبي", the visible text) — same words, same two
  languages, just re-homed at the "·" the content brief's own line already
  implied as a join point; nothing was rewritten. Verified: `npm run build`
  and `npm run check` both clean; zero hex in the component (grepped); zero
  physical-direction utilities; the flex-row layout auto-mirrors under
  `dir="rtl"` (no bespoke RTL handling needed, since the logo's own Latin
  glyphs are meant to stay unmirrored — confirmed on `/ar/` at 375 and 1440,
  chrome-devtools MCP: "دبي · [logo]" reads right-to-left, logo unflipped);
  zero console errors on `/en/` and `/ar/` at both widths. Sized at `1.4em`
  block-size (≈21px against the footer's `text-small`) rather than literally
  cap-height — the wordmark's fine linework (plus the globe/dot sitting above
  the letters in its own viewBox) read as an illegible smudge at true
  cap-height (~11px, tried first); `1.4em` is the smallest step up that kept
  every letterform legible in the screenshots. Screenshots:
  `screenshots/p9b-footer-{en,ar}-{375,1440}.png`.
  ~~**Left for a future pass, not silently dropped:** spec §5A lists the logo
  for "footer and contact page" — only the footer is done here; `/contact`
  still shows no Intertec Systems mark. Judgement call for that page's own
  pass, since `ContactPage.astro`/`SovereigntyBand.astro` weren't touched by
  this one.~~ Resolved at P9c: `SovereigntyBand.astro` now renders the same
  `IntertecLogo.astro` mark Footer.astro uses (`text-muted`, `1.4em`
  block-size, `footer.company` as its `aria-label` — no new i18n string
  needed), placed below the band's two existing lines. This is a genuine
  second placement, not merely the site-wide footer appearing on `/contact`
  too: spec §5A's asset list gives the logo two placements ("footer and
  contact page") as a separate line from the certification marks' "contact
  page only", so the contact-page mark had to be an in-page addition to mean
  anything beyond what every route already had. `npm run build`/`npm run
  check` both clean; zero hex, zero physical-direction utilities in the
  component; zero console errors on `/en/contact` and `/ar/contact` at 375
  and 1440 (chrome-devtools MCP); mark confirmed unmirrored under `/ar`
  (`getComputedStyle(svg).transform === "none"` at both widths, both
  languages) with the Latin "Intertec" wordmark reading correctly rather than
  flipped. Screenshots: `screenshots/p9c-contact-logo-{en,ar}-{375,1440}.png`.
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

## From P10 wave 1 (design elevation — home page)

- **A clean throttled (Slow 4G + 4x CPU) LCP re-measure on an idle machine is
  owed again**, the same carried item as P6 onward, now with a wave-1-specific
  wrinkle: measured LCP on this session's scratch static server exceeded
  DESIGN-ELEVATION.md §6.1's 900ms gate on BOTH the pre-wave-1 baseline
  (1,398ms / 1,708ms across two runs, `git stash`-isolated) and the wave-1
  build (964ms / 1,111ms across two runs) — i.e. wave 1 measured *lower* than
  the untouched baseline in this environment, not higher. The 900ms gate was
  not met, but not because of anything this wave added; see
  known-issues.md's P10 wave 1 section for the full paired measurement. The
  §6.4 abort ("drop the hero SplitText") was deliberately NOT invoked, because
  removing SplitText would not address the actual bottleneck (main-thread
  render delay present in the untouched baseline too) and would discard
  spec-approved value for no measured gain. Flagged for Piyush rather than
  silently applied or silently ignored, per CLAUDE.md's "stop and say so."
- **DESIGN-ELEVATION.md §3.7(b) is internally inconsistent about the
  highlight-rect count on `CommandCentreDim.astro`** — its own itemised list
  ("each metric card, the initiative table, the AI panel, the benefit strip")
  names six surfaces, but the same paragraph also states "Nine rects."
  Implemented as itemised (six rects: three metric cards + table + AI panel +
  benefit strip), flagged here rather than inventing three more surfaces to
  force the count to nine. Worth a spec correction, not a code change.
- **Wave 2 (product pages + contact, DESIGN-ELEVATION.md §6.2) and wave 3
  (full QA re-verification and WebKit pass, §6.3) have not started.** This
  session was scoped to wave 1 (home page + the shared chrome it touches)
  only, per the task's own instruction.
- **No WebKit-specific verification of any wave-1 change.** Same standing gap
  as every prior phase's product-page/contact prompts — wave 3 is where
  spec §10's WebKit pass (including the new `backdrop-blur` header) is
  scheduled.
- **The scroll frame-trace check (no sustained frames > 16.7ms) was verified
  once, not paired against a pre-wave-1 control.** A scripted full-page
  scroll on `/en/` at 1440 under 4x CPU throttle showed ~173ms of total
  forced-reflow time, attributed by the tool to `motion.ts`/GSAP
  ScrollTrigger internals (pre-existing architecture, not a wave-1
  addition) with an "estimated savings: none" verdict. Unlike the LCP check,
  this was not re-measured against the untouched baseline for a clean
  before/after — worth doing in wave 3's full re-verification pass if frame
  performance becomes a concern.

## From P10 wave 2 (design elevation — product pages and contact)

- **The DesignSync fragment-fidelity mandate could not be completed as
  instructed — the tool is not callable in this session.** Full writeup
  under this file's P6/P6-AR sections (now closed with that caveat rather
  than silently). Re-attempt once `ToolSearch` actually surfaces a
  `DesignSync`-named tool (or once Piyush can supply screenshots/exports of
  `ui_kits/trumandate-platform/` from Claude Design project
  `c14a7f00-8160-4bca-9370-fda4d8f05d0a` some other way) — at that point the
  check is a straightforward side-by-side against `KpiCard.astro`,
  `InitiativeRows.astro`, `BenefitCurve.astro`, `StageGateQueue.astro` and
  `CommandCentreDim.astro`, all five of which are otherwise unchanged this
  wave beyond the §4.2 highlight-rect elevation (the first three) and were
  left alone entirely (the last two — no wave-1 rework, per this wave's own
  instruction).
- **`ContactForm.astro`'s `ease-exit` adoption (§4.5) is scoped to the
  status region's show/replace fade-in, not a true asymmetric
  dismiss-then-show sequence.** DESIGN-ELEVATION.md's own prose calls
  `ease-exit` "ease-IN only... dismiss/hide," which argues for a visible
  fade-OUT of old content before new content replaces it — but the region's
  content is replaced synchronously (`replaceChildren()`) in the same tick a
  fresh `showStatus()` call runs, so there is no old-content pixel for a
  reader to see fade away regardless of timing; building a real staged
  fade-out-then-swap would mean delaying the actual content swap (and the
  assertive `role="alert"` re-announcement + focus move) behind a timer,
  which risks the exact focus/tab-order/re-announcement behaviour P7/P8
  spent two sessions verifying. Implemented instead: `motion-safe:
  transition-opacity duration-state ease-exit` on the region, with
  `scripts/contactForm.ts` resetting `style.opacity` to `0` and rAF-ing it
  to `1` on every `showStatus()` call, so first-appearance AND
  content-replacement both fade in with the new token — the safer half of
  the recipe, logged here as a scoping decision rather than silently
  claimed as the full asymmetric behaviour the spec's prose describes.
- **No WebKit pass on the four wave-2 routes.** Same standing constraint
  carried from every prior phase (P4 onward) — still Chromium-bound this
  session. None of these routes has a pin or a scrub, so the historical
  Safari risk is lower than the home page's, but the fragment wipe (an SVG
  `<mask>` moved by `transform`) and the new `ease-exit`/`motion-safe`
  CSS-only transitions are worth a real Safari pass in wave 3.
- **A clean throttled (Slow 4G + 4× CPU) LCP re-measure is still owed**,
  the standing item carried since P6. This session measured Fast 4G with no
  CPU throttle only (chrome-devtools MCP, production build, scratch server
  port 4326): every wave-2 route's LCP fell between 115–170ms, CLS 0.00 on
  all ten routes checked (the four wave-2 routes + home, both languages) —
  comfortably inside every budget, but not the heavier profile the standing
  item asks for.
- **A shared-browser interference source was identified and worked around,
  not eliminated.** This machine runs an autonomous DesignSync-adjacent
  watcher (`.design-sync/` config confirms a "TruMandate Website DS" sync
  project exists for this repo) that opens and navigates pages in the SAME
  chrome-devtools MCP browser instance concurrently with this session's own
  verification — confirmed by watching page IDs cycle through exactly the
  component names being edited this session (`Button`, `Section`, `KpiCard`,
  `FormField`, `CommandCentreDim`, …) at a URL neither this session nor its
  task opened. It silently corrupted the FIRST opacity-audit run on
  `/en/strategy` (transient near-zero readings on the AI card's Accept/
  Modify/Reject buttons that did not reproduce in an isolated browser
  context with an href-unchanged integrity check) — a false alarm, chased
  down empirically (a `git stash` pre/post comparison and direct inline-
  style inspection both cleared the component) rather than assumed. Every
  browser-driven check after that point used a dedicated
  `isolatedContext` per page plus a `location.href` sameness check woven
  into each script, and all 20 opacity-audit runs (10 routes × 2 viewports)
  came back clean. Flagging the root cause here rather than only the
  workaround: a future session's browser automation on this machine should
  expect the same interference and budget for it.
- **`resize_page` does not reliably produce the requested CSS viewport width
  on this machine** (Windows, 150% OS display scaling) — measured
  `window.innerWidth` values of 501px and 1283px after requesting 375 and
  1440 respectively. `mcp__chrome-devtools__emulate`'s explicit `viewport`
  string (e.g. `"375x812x2,mobile,touch"`, `"1440x900x1"`) produced the
  exact requested width reliably instead and was used for every measurement
  this session from the point of discovery onward. Worth carrying forward:
  a future session on this machine should reach for `emulate`, not
  `resize_page`, and re-verify with a quick `window.innerWidth` read before
  trusting a viewport-dependent measurement.

## From redesign wave A (docs/design_handoff_website_redesign — home + shared chrome)

- **A Slow 4G + 4x CPU LCP pass on `/ar/` is still owed**, for the same
  host-load-sensitivity reason earlier sections of this file already
  record for `/en/`: this session's one throttled sample (`/en/`, 1,734ms,
  inside the 2.0s budget) is a single reading on a shared, busy machine, not
  a clean baseline. Re-measure both languages on an idle machine before
  treating the throttled figure as either comfortably met or at risk.
- **`chrome-devtools` MCP has no exposed way to emulate the real
  `prefers-reduced-motion: reduce` CSS media feature** (only
  `colorScheme`/`networkConditions`/`cpuThrottlingRate`/`geolocation`/
  `viewport`/`userAgent` are in the `emulate` tool's schema). Stubbing
  `window.matchMedia` in an `initScript` (the technique earlier sessions
  used successfully) only fools JavaScript that calls `matchMedia()`
  directly (this repo's own `whenMotionSafe` gate, confirmed working) — it
  does **not** change what a real `@media (prefers-reduced-motion: reduce)`
  CSS rule evaluates to, since the CSS engine reads the actual OS/browser
  setting independently of the JS-patched function. Verified this
  empirically: with the stub applied, `.tm-live`'s `animation-name` still
  computed to `tm-pulse`, not `none`. This session's reduced-motion
  verification therefore combined the matchMedia stub (proves the JS gate
  correctly skips `recordChain.ts`/`redesignReveal.ts` setup) with a
  separately-injected stylesheet reproducing the reduce block's own
  declarations unconditionally (proves those declarations, if the real
  media query were active, would render every `.tm-load`/`.tm-rise`/
  `.tm-fade`/`.tm-grow`/chain-card element correctly) — not a substitute for
  a genuine OS-level reduced-motion pass (real Chrome DevTools "Rendering"
  panel, or a future MCP version that exposes
  `Emulation.setEmulatedMedia`), which is still owed.
- **`IntertecLogo.astro` (P9's currentColor SVG mark) is now unreferenced.**
  The redesigned footer (`SiteFooter.dc.html`) draws "Intertec Systems" as
  plain text, not a logo mark, so `Footer.astro`'s rewrite this wave dropped
  the `<IntertecLogo>` call site to match the reference exactly. The
  component file itself was deliberately NOT deleted — it is a distinct
  footer-branding feature from an earlier, explicit session, not an
  orphaned "old home component" — but it is dead code today. Piyush's call
  whether to re-integrate it (e.g. inside the wordmark) or delete it
  properly.
- **WebKit-specific verification was not attempted this wave** (no
  Playwright MCP invocation this session; the chrome-devtools MCP available
  is Chromium-only, same constraint prior sessions recorded). The record
  chain's `position: sticky` pin and its plain scroll-handler scrub (not a
  GSAP ScrollTrigger) are new mechanics this wave that haven't had a WebKit
  pass yet.

## From redesign wave B (docs/design_handoff_website_redesign — Strategy/Execution/Benefits/Contact)

- **A Slow 4G + 4x CPU LCP pass on all 8 new routes is still owed**, same
  host-load-sensitivity reason as every earlier section of this file. This
  wave's own measurements (chrome-devtools MCP, Fast 4G, no CPU throttle)
  are comfortably inside budget — `/en/strategy` 158ms, `/ar/strategy`
  188ms, `/en/contact` 163ms, CLS 0.00 throughout — but that is not a
  substitute for the throttled pass on an idle machine.
- **The residual ~12–15px height gap between `/ar/strategy` and
  `/ar/execution`'s own fragment section and the reference is a pre-existing,
  sitewide line-height cascade interaction, not something this wave
  introduced or can cleanly fix in the fragment files alone.** Full
  root-cause: the reference's own standalone preview sets `line-height:1.8`
  on a wrapping `<div>` with no competing rule beneath it, so every plain
  `<p>`/`<span>` inherits it. This repo's real `global.css` sets `body`'s
  own `line-height:1.55` via the `text-body` fontSize utility's bundled
  tuple (known-issues.md's earlier "text-body names both a colour and a
  fontSize token" entry) — a declaration set directly ON `body`, which wins
  over inheriting the `[dir=rtl]` rule's 1.8 from `<html>`, for any plain
  element that doesn't have its own explicit line-height (h1/h2/h3 already
  get one; arbitrary `<p>`/`<span>` micro-labels inside a fragment do not).
  Fixing this properly means either giving `body` a non-`fontSize`-bundled
  line-height or scoping the Arabic override with higher specificity —
  sitewide surgery well outside a "build four pages" scope, and risky
  against every already-shipped Arabic route. `/ar/benefits` (a pure-SVG
  fragment, immune to this CSS inheritance chain) matches the reference to
  the pixel on all five sections; `/ar/strategy` and `/ar/execution` are
  exact on hero/argument/AI-moment/handoff and short by 12–15px only on the
  DOM-based fragment's plain-text rows. Piyush's call whether this is worth
  a dedicated sitewide line-height pass.
- **The design handoff's own `_ds/` compiled-CSS bundle is absent from
  `docs/design_handoff_website_redesign/`** (the README says to "keep the
  bundle folder next to the files when previewing," but only the `.dc.html`
  files, `README.md`, `github.md` and `support.js` are actually present —
  confirmed by directory listing before assuming a fetch/config problem).
  Opening any reference file directly in a browser therefore renders
  completely unstyled. Worked around this session by extracting this repo's
  own compiled stylesheet from a built page's inlined `<style>` (the
  reference reuses this exact Tailwind build per its own README) and
  reassembling a working preview in the scratchpad — not committed
  anywhere in this repo — to get a genuine measured comparison rather than
  reading source only. A future session should do the same rather than
  assuming the reference can be screenshotted as-is.
- **`SuggestionCard.astro`, `scripts/aiCard.ts`, `components/contact/
  SovereigntyBand.astro` and `scripts/fragment.ts` are deleted, not left
  unreferenced.** All four were the pre-redesign mechanism for something
  this wave's reference replaces outright (the product pages' AI card, the
  fragments' SVG-wipe reveal) or drops entirely (the contact page's
  sovereignty band has no counterpart in `Contact (redesign).dc.html`,
  which is exactly two sections — hero and form card — plus the shared
  footer). Same precedent as Wave A deleting the pre-redesign chain/hero
  components outright rather than leaving them as dead code. This also
  makes `IntertecLogo.astro` (already flagged above as unreferenced since
  Wave A dropped its footer call site) doubly unreferenced — its other
  remaining caller was `SovereigntyBand.astro`, now gone.
