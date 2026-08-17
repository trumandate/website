# BUILD_FLAGS.md — TruMandate site

Autonomous defaults for Claude Code. These resolve decisions without stopping.
Anything not covered here and genuinely blocking: halt and ask. Anything not
covered and not blocking: pick the option consistent with the spec, log it here
under "Decisions taken", and continue.

## Run posture

- Run to the end of each prompt. Do not gate on step-by-step confirmation.
- Halt only on genuine blockers: a missing credential, a spec contradiction that
  changes structure, or a dependency that will not install.
- Never halt to ask whether to keep going.

## Defaults

| Question        | Default                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| Package manager | npm                                                                     |
| Node            | LTS, pinned in `.nvmrc`                                                 |
| Astro output    | `static`                                                                |
| TypeScript      | strict                                                                  |
| Formatting      | Prettier, default config, no debate                                     |
| Component style | `.astro` components; no React unless a component needs state            |
| GSAP plugins    | core, ScrollTrigger, SplitText only                                     |
| Smooth scroll   | Lenis; remove it rather than patch it if it fights ScrollTrigger on iOS |
| Fonts           | self-hosted subset woff2, `font-display: swap`                          |
| Icons           | hand-authored inline SVG, no icon library                               |
| Form endpoint   | env var `PUBLIC_FORMSPREE_ENDPOINT`, placeholder value                  |
| Contact email   | placeholder `hello@trumandate.com`, logged to TODO.md                   |
| Analytics       | none until launch                                                       |
| Cookie banner   | none unless Cloudflare requires one                                     |
| Image formats   | SVG for everything except the asset list in spec section 5A             |
| Commit style    | conventional commits, one commit per prompt                             |
| Branch          | `main`, no feature branches for this build                              |

## Copy authority

- English copy for the home page and contact page comes verbatim from
  `trumandate-content-brief.md`. Do not rewrite it.
- English copy for the three product pages is written by Claude Code against the
  briefs in `trumandate-product-pages.md`, then reviewed in `COPY-REVIEW.md`.
- Arabic for the product pages is produced only after English is approved.
- Arabic is written, not machine-translated: keep the argument, not the sentence
  structure.

## Ambiguity resolution

When the spec is silent, choose in this order:

1. The option that removes something rather than adds it.
2. The option that keeps one shared component rather than creating a variant.
3. The option that shows less product rather than more.
4. The option that costs fewer kilobytes.

Log every such choice under "Decisions taken" below.

## Decisions taken

(Claude Code appends here. One line each: what was ambiguous, what was chosen, why.)

- 2026-08-17 (P0 gate, user-approved): Content brief §4 Command Centre vs spec §5 — §4 read as source for the dimmed closing CTA composition only; four numbered callouts dropped.
- 2026-08-17 (P0 gate, user-approved): Header nav — Strategy / Execution / Benefits / Contact, mirroring routes; brief's prototype-era nav labels discarded.
- 2026-08-17 (P0 gate, user-approved): Eleven-module list dropped from home page — spec §6 map and product-pages doc outrank the brief here.
- 2026-08-17 (P0 gate, user-approved): Home page ends at the dimmed Command Centre CTA; /contact owns the form; sovereignty band not on home.
- 2026-08-17 (P0, planner): Hero data panel rendered as page typography on hairline rules, not product chrome, keeping home-page product surfaces at two per spec §5.
- 2026-08-17 (P0, implied by the above): where BUILD_FLAGS' "home copy verbatim" clause conflicts with spec/product-pages, the CLAUDE.md authority order wins; BUILD_FLAGS ranks below the three docs.
- 2026-08-17: wordmark treatment evaluated from assets/TruMandate_Product_deck_2pager.pptx — two-tone "Tru" (green) + "Mandate" (heading colour of the surface). Deck hexes (#A9D18E sage, Calibri) NOT imported; expressed as accent token + text token in IBM Plex Sans 600. Mark bars: two token greens, flat fills, no gradient. Deck is reference-only.
- 2026-08-17: user supplied assets/logo.png (mark: three rounded bars, two greens, light tile). It is reference-only — the mark is re-authored as inline SVG from tokens (raster invariant); PNG never ships. Wordmark = SVG mark + "TruMandate" in type. Unblocks P9 favicon/OG.
- 2026-08-17 (P0, planner; full reasoning in PLAN.md §4): rail draw as scaleY, clip-path wipe as translated SVG mask, bar fill as scaleX (transforms-only rule); sparkline draw downgraded to fade; count-up number is AED 41M; ease cubic-bezier(.22,.61,.36,1) and vertical rhythm taken from prototype; buttons reuse the 600 display weight; RAG dots carry visually-hidden status text; dimmed composition single-hue at 25% group opacity, aria-hidden; Command Centre geometry re-authored from tokens (prototype is 900×520, LTR-only, non-token colours).

- 2026-08-17 (P1): `@astrojs/tailwind` dropped. Its peer range is `astro ^3.0.0 || ^4.0.0 || ^5.0.0`, and `npm audit` shows every Astro release through 7.0.9 carries multiple high-severity XSS advisories (GHSA-j687-52p2-xcff and others), patched only in 7.1.0+. Pinning to Astro 5.x to keep the integration would have shipped known-vulnerable code for a config-file convenience. Tailwind v3 needs no Astro-specific package — Vite (which Astro runs on) auto-loads a root `postcss.config.mjs`, so Tailwind is wired as a plain PostCSS plugin instead. This keeps the JS `tailwind.config.mjs` (with `corePlugins` disabling `space`/`float`/`clear`/`textAlign`) exactly as PLAN.md §2 specifies, while running on patched Astro 7.2.2. `npm audit` is clean (0 vulnerabilities) after this change plus `npm audit fix` for a transitive `sharp` bump.
- 2026-08-17 (P1): TypeScript pinned to 5.9.3, not the published "latest" (7.0.2). `@astrojs/check`'s peer range is `^5.0.0 || ^6.0.0`; no stable 6.x was ever published (only betas/dev builds) before 7.0 shipped, so 5.9.3 is the newest release the type-checking toolchain actually supports.
- 2026-08-17 (P1): Astro pinned to 7.2.2 (latest, patched) rather than an older LTS-feeling line, once the Tailwind-integration constraint was removed — "current APIs" per CLAUDE.md and no known vulnerabilities outstanding.
- 2026-08-17 (P1): autoprefixer left out of the PostCSS pipeline — target is evergreen browsers on Cloudflare Pages, and the utilities in use (flex/grid/logical properties) don't need vendor prefixes. One fewer dependency, per the "remove rather than add" default.
- 2026-08-17 (P3, bug fix): `src/scripts/motion.ts`'s `whenMotionSafe` registered a single `gsap.matchMedia()` condition (`reduceMotion`). GSAP's `matchMedia().add()` only invokes its callback if at least one *named* condition is currently true (`gsap-core.js` OR-s `mq.matches` across every listed key into an `active` flag and skips the callback if `active` stays falsy) — with only `reduceMotion` registered, that condition is false for the large majority of visitors, so `setup()` silently never ran for them. Found empirically at P3 wiring the chain draw: zero console errors, but the rail/nodes never left their served state. Fixed by also registering the complementary `"(prefers-reduced-motion: no-preference)"` condition, so one of the pair is true for effectively every visitor/browser and the callback reliably fires either way. This is shared infrastructure every motion script goes through (`reveal.ts` included), so the fix is in `motion.ts`, not duplicated per-script.
- 2026-08-17 (P4): Lenis — decided NOT to add it. Spec §7's motion inventory
  (items 2–6, built this prompt) contains nothing that requires smooth
  scroll: two ScrollTriggers already exist (the P3 chain scrub/pin) and every
  new motion here is either a one-shot reveal or a self-contained timeline,
  none of which needs native scroll behaviour altered. Per the ambiguity-
  resolution order, "the option that removes rather than adds" wins by
  default absent a spec requirement, and BUILD_FLAGS' own Lenis row already
  biases toward removing it if it fights ScrollTrigger on iOS — simplest to
  never introduce that risk on a page that already has a pinned/scrubbed
  section to protect. `src/scripts/lenis.ts` remains unbuilt; PLAN.md §1's
  file-tree comment ("removed, not patched, if it fights iOS") is the
  standing answer unless a later page's motion genuinely needs it.
- 2026-08-17 (P4): Motion #4's card-arrival duration (0.5s) and motion #5's
  counter duration (1.2s) added as named tokens
  (`transitionDuration.card`/`transitionDuration.counter`,
  tailwind.config.mjs) rather than bare magic numbers in the TS files —
  spec §7 doesn't give either value (only the bar's own 0.6s and the four
  other items' durations are named), so these are judgement calls, tokenised
  per the "every duration is a token" discipline the rest of the config
  already follows. Logged in TODO.md alongside the rest of P4's judgement
  calls.
- 2026-08-17 (P4): Motion #4's confidence-bar fill and motion #3's fragment
  wipe both need a transform-origin/translate-direction pinned to the
  inline-start edge, and Tailwind ships no logical `origin-start` utility
  (only physical `origin-left`/`origin-right`, which CLAUDE.md's invariant
  bans in spirit even where the literal grep wouldn't catch them). Resolved
  by writing the physical value only inside a scoped `<style>` block with an
  explicit `[dir="rtl"]` override — the same pattern global.css already uses
  for line-height/letter-spacing — rather than putting a physical utility
  class in markup.
- 2026-08-17 (P3, bug fix): `ChainMarker.astro`'s sticky column never actually stuck — its immediate `<div data-chain-marker>` wrapper shrank to its own content height (~55px) rather than stretching to the grid row's height (~800px, via CSS Grid's default `stretch`, which only reaches the *direct* grid-item ancestor). A `position: sticky` element only has room to stick within its immediate parent's box, so with zero slack there it behaved as ordinary static flow across the whole section. Fixed with `h-full` on that wrapper. Also swapped its `top-24` for the `header` spacing token (`top-header`, 104px) to match `<main>`'s own header-clearance value — `top-24` (96px) left the stuck marker's top few pixels under the fixed header. Both found by scrolling the built page (chrome-devtools MCP), not by static screenshot, which is why they survived P2.

- 2026-08-17 (LCP/CSS follow-up to P4): `astro.config.mjs`'s
  `build.inlineStylesheets` set to `'always'` (Astro default is `'auto'`,
  which only inlines stylesheets under Vite's ~4KB asset limit — this
  project's single global stylesheet is ~17KB, so it was always shipped as
  an external, render-blocking `<link>`). Re-measured LCP on a clean
  production build served from `dist/` (scratch static server, port 4323 —
  dev server on 4321 and `astro preview` untouched): Slow 4G + 4x CPU LCP
  1,925–1,934ms → 1,137ms (spec §9 budget 2.0s); Fast 4G LCP 607ms → 344ms;
  CLS 0.00 before and after. `dist/en/index.html` grew 26,141 → 43,452
  bytes (CSS now paid as inline HTML instead of a separate fetch), gzips to
  9,882 bytes — trivial against the 900KB first-load budget. Chosen over
  the alternative candidates (font-preload trimming, critical-CSS
  splitting) because it's the smallest change that removes the entire
  render-blocking penalty outright, per the ambiguity-resolution order's
  "fewer kilobytes" and "removes rather than adds" bias — no new build step,
  no new dependency, one config line. Font preloads were audited alongside
  this (3 Latin subsets on `/en/`, ~56KB combined, no Arabic subset,
  `font-display: swap` confirmed on all five `@font-face` rules) and left
  unchanged: the mono face is used above the fold (Hero's `Eyebrow`, which
  sits above the `<h1>`), so dropping its preload would trade a render-delay
  problem for a flash-of-invisible-text problem on the page's first text.
  Trade-off accepted and logged: `'always'` means every future route
  (`/ar`, product pages, `/contact`) repeats the full stylesheet inline
  rather than sharing one cached external file across the site — acceptable
  for a small marketing site prioritising first-visit LCP over same-visitor
  repeat-view cache savings; revisit if the route count grows enough to
  matter. Full before/after detail in known-issues.md's P4 section.

- 2026-08-17 (P5): Routing stays manual per-locale files (`src/pages/en/*`,
  `src/pages/ar/*`), matching the pattern already established at P1–P4,
  rather than switching to Astro's automatic i18n page generation —
  `astro.config.mjs`'s `i18n` block (already present since P1) only
  configures locale metadata (`Astro.currentLocale`, hreflang helpers), not
  routing generation, when pages are hand-authored per locale; no change
  needed there. Consistent with BUILD_FLAGS' "keep one shared component"
  bias: every home-page component now takes a `lang` prop and reads copy
  from `i18n/ui.ts` rather than the Arabic tree forking into parallel
  components.
- 2026-08-17 (P5): RTL mirroring split by whether a fragment contains
  `<text>`. `CommandCentreDim.astro` (no text) mirrors as one CSS
  `scaleX(-1)` group transform. `StageGateQueue.astro` (has text) gets a
  hand-authored second geometry: every x-coordinate mirrored (`360 - x`,
  rects additionally subtracting their own width), `text-anchor` flipped,
  and the fragment's own `direction: ltr` pinned explicitly (see
  known-issues.md — SVG `<text>` inherits `direction` from `html[dir=rtl]`,
  which otherwise flips what `text-anchor: start/end` mean and breaks the
  mirror). The wipe (`fragment.ts`) mirrors its slide direction by reading
  `document.documentElement.dir` once, rather than threading a `lang` prop
  through a script that has no other language-dependent behaviour.
- 2026-08-17 (P5): Digit handling — Western digits stay Western in Arabic
  wherever the content brief doesn't already write Arabic-Indic ones
  (spec §8's rule, applied literally); the brief's own verbatim Arabic-Indic
  digits (confidence score, AI card's day count, timestamp, panel label)
  ship as-is per "verbatim wins" (PLAN.md §4 ambiguity 15). The brief's own
  internal inconsistency (chain link 5's Western "24" vs. the AI card's
  Arabic-Indic "١٢" for the same kind of quantity) ships unedited and is
  logged in known-issues.md as a copy observation, not silently normalised
  either direction. Separately — and not a digit-*style* question — two
  Western-digit values joined by a bare separator ("68 / 75", "01 / 05")
  needed an explicit `dir="ltr"` bidi isolate to stop rendering visually
  reversed inside RTL flow; see known-issues.md.

- 2026-08-17 (P6): Product-page copy lives in each `/en/` page's own
  frontmatter as a typed `ProductPageCopy` object
  (`src/components/product/copy.ts`), NOT in `i18n/ui.ts`. That table is
  `Record<Language, UiStrings>`, so a `product` branch would force an Arabic
  value to exist for every English string written this prompt — and
  `trumandate-product-pages.md` is explicit that Arabic is produced only after
  Piyush approves the English. Writing placeholder Arabic to satisfy a type
  would waste the pass the doc is protecting and would break "Arabic never
  carries less content than English" in the worst way, by carrying *wrong*
  content rather than none. `ProductPage.astro` already takes `lang`, so the
  move into `UiStrings.product` after approval is a lift-and-shift with no
  structural change. Logged in TODO.md.
- 2026-08-17 (P6): The five-part skeleton is rendered as FOUR `<Section>`s,
  not five. Parts 1 (the question) and 2 (the argument) share one section,
  because a full section break between a page's `<h1>` and the first paragraph
  of the argument that `<h1>` introduces reads as two unrelated blocks. The
  five parts and their order are unchanged; only the wrapper count differs.
  All three pages compose the same `ProductPage.astro`, so this cannot drift
  per page.
- 2026-08-17 (P6): No spine on the product pages. PLAN.md §3 makes the rail
  the home page's signature ("the only place boldness is spent"); repeating it
  on every route spends the signature. Product pages get section reveals
  (motion #2), the fragment wipe (motion #3), the AI card (motion #4) and the
  header rule (motion #6) — no pin, no scrub, matching the prompt's "one
  pinned section and one scrubbed timeline per route MAX, and these pages
  should have NEITHER".
- 2026-08-17 (P6): Motion #5 (the count-up) is NOT used on any product page.
  Spec §7 item 5 reads as a cap ("One number per page… One only"), not a
  quota, and none of the three pages has a number that can honestly be
  animated as a running total — the home page's AED 41M qualifies because a
  benefit-to-date figure IS a running total (PLAN.md §3's own argument).
  Counting a confidence value (0.81), a divergence (18%) or a measurement
  window (24 months) up from zero would animate a static reading and imply it
  is moving as you watch, which is the small lie PLAN.md already rejected once.
  Per the ambiguity-resolution order, "remove rather than add" wins.
- 2026-08-17 (P6): `SuggestionCard.astro` generalised rather than forked. Its
  four content strings and the confidence value became optional props that
  default to the home page's `home.ai.*` values, so `<SuggestionCard
  lang={lang} />` behaves exactly as before at the home call site (unchanged)
  while the three product pages pass their own. Accept/Modify/Reject are
  deliberately NOT overridable — they are the product's own control labels and
  spec §4 says the pattern repeating is the point. The confidence bar's width
  is now derived from the numeric prop (`Math.round(confidence * 100)%`)
  instead of a hard-coded 77%, so the bar and the printed value cannot drift.
  Per BUILD_FLAGS' "keep one shared component rather than creating a variant".
- 2026-08-17 (P6): LangToggle on unpaired routes points at the target
  language's HOME page rather than a URL that would 404. Implemented in
  `i18n/utils.ts` as a `pairedRoutes` set (currently `{"/"}`) consulted by
  `altUrl`; add a route to that set the moment its second-language file lands
  and the fallback deletes itself. The alternative — hiding the toggle on
  routes with no counterpart — was rejected: spec §8 treats the toggle as
  permanent chrome, and a control that vanishes on three of five routes reads
  as a bug to a reader who just used it on the home page. Verified:
  `/en/strategy` → `/ar/`, `/en/` → `/ar/`, `/ar/` → `/en/`.
- 2026-08-17 (P6): Product fragments crop via their own authored viewBox (the
  neighbouring KPI card runs to x=620 against a 460 viewBox; the initiative
  list container runs to y=290 against a 206 viewBox; the benefit plot's card
  runs to x=508 against a 460 viewBox), matching `StageGateQueue.astro`'s
  established P2 pattern rather than introducing a CSS fade-to-ground mask on
  these three only. Spec §5 sanctions either ("clipped by the section edge or
  by a mask that fades to the page ground"), and adding the fade to the
  product fragments but not the home one would be exactly the per-page visual
  pattern this prompt forbids. Observation logged in TODO.md.

- 2026-08-17 (P6-AR): Product-page copy moved out of the three `/en/` page
  frontmatters into ONE bilingual table,
  `productCopy: Record<Language, Record<ProductPageKey, ProductPageCopy>>` in
  `src/components/product/copy.ts` — not into `UiStrings.product`, which is
  what TODO.md's P6 item had specified. `UiStrings` is consumed through
  `useTranslations`, whose `KeyPath<T>` walks every property and whose `t()`
  returns `string`; `ProductPageCopy` carries `argument: string[]` and
  `confidence: number`, so a `product` branch there would make `KeyPath`
  recurse into array and number prototypes and would put two of the type's
  fields permanently out of `t()`'s reach. The invariant that item was really
  protecting — that an English string cannot exist without an Arabic one — is
  delivered by `Record<Language, …>` either way, and is now a compile error
  rather than a review note. The three fragments' short label strings, which
  genuinely are all strings, DID go into `i18n/ui.ts` under a new `fragment`
  branch and reach the SVGs through `t()`, exactly as `home.stageGate.*` does.
  Per BUILD_FLAGS' "keep one shared component": the English pages shrank to a
  page key plus a fragment, and every English string was verified byte-identical
  through the move before the Arabic was written.
- 2026-08-17 (P6-AR): RTL direction handling on the three product fragments
  DIVERGES from `StageGateQueue.astro`'s P5 treatment, deliberately. P5 pins
  `direction: ltr` in both languages and hand-flips every `text-anchor`, which
  keeps the hand-computed coordinates honest but forces every label into an LTR
  paragraph — and in an LTR paragraph a string mixing Arabic with digits lays
  its Arabic run out to the LEFT of the number, so an Arabic reader meets the
  number first. These three fragments instead pin `direction: ltr` for LTR
  pages only and set `direction: rtl` on the mirrored branch (via
  `:global([dir="rtl"]) .fragment-class`, the scoped-style pattern P5 had to
  discover the hard way). Two things follow: `text-anchor: start`/`end` resolve
  logically, so the mirror needs no flipped anchors at all, and strings like
  "آخر 6 فترات" and "نافذة القياس · 24 شهراً" order themselves the way they are
  read. Verified in the browser: every mirrored `<text>`'s measured bbox ends
  exactly at its authored x, and no two labels collide on any row. Migrating
  StageGateQueue to match is logged in TODO.md rather than done in the same
  pass that introduced the second pattern.
- 2026-08-17 (P6-AR): The benefit curve's TIME AXIS mirrors along with the rest
  of its geometry, so under `/ar` the curve begins at the right, closure and
  "today" fall to its left, and the dashed projection is cut by the left (RTL
  inline-end) frame edge. Spec §8 only says horizontal motion mirrors, not
  charts; the alternative — pinning the plot LTR inside an RTL page — was
  rejected because a time axis running left-to-right would be the single
  loudest LTR artefact on the route, and because the fragment's crop is
  supposed to land on the inline-end edge, which is only true if the whole
  composition mirrors. The initiative list's crop is vertical and therefore
  needs no equivalent decision.
- 2026-08-17 (P6-AR): The Arabic chain-link eyebrows name the relation in words
  ("من الهدف إلى مؤشر الأداء") rather than carrying the English's "→". U+2192
  has `Bidi_Mirrored=Yes`, so an arrow authored in either direction is re-drawn
  mirrored by the shaping engine under RTL — it cannot be relied on to state
  which way the chain runs, and "fixing" it by typing the opposite arrow just
  moves the bug. Per the ambiguity order's "remove rather than add": drop the
  glyph, keep the meaning.
- 2026-08-17 (P6-AR): Arabic fragment type sets the digit-only `figure`/`value`
  roles in Plex Sans too, not just the Arabic-bearing label roles. Spec §3's
  mono→sans swap is argued from Arabic joining, which digits do not have, so
  the letter of the rule would allow mono here — but `/ar` never preloads Plex
  Mono (BaseLayout.astro's per-locale list), and keeping three digits in mono
  would make them the only reason an Arabic page fetches a fifth font file.
  Verified on the built page: `/ar/strategy` fetches four font files, none of
  them mono. Per "the option that costs fewer kilobytes".
- 2026-08-17 (P6-AR): Numerals split by ELEMENT TYPE, following the home page's
  own precedent rather than picking one rule for the whole route. Product
  fragments are Western throughout (spec §8 read literally; matches
  StageGateQueue's "بوابة المرحلة · 04" and "14 أغسطس"). Page prose and the AI
  cards use Arabic-Indic for reference numbers, confidence values and
  timestamps, because that is what the content brief's own verbatim Arabic does
  on the home page (٠٫٧٧, البوابة ٣, ٠٩:٤٢) and the AI card is the same
  component in the same role. The one measured quantity that appears in both
  worlds — the 24-month benefit window — stays Western in prose because the
  brief's own chain copy writes it "24 شهراً". Consequence, stated so it is not
  read as a defect: `/ar/execution` shows "المبادرة ٠٧" on its AI card and
  "الهدف 1.2" inside its fragment, on the same page. That is the home page's
  existing split, not a new inconsistency.
- 2026-08-17 (P6-AR): `pairedRoutes` suffixes are stored WITHOUT a trailing
  slash ("/strategy", not "/strategy/"), because `altUrl` filters empty path
  segments out before joining and therefore never produces one; "/" is the sole
  exception, being a suffix of nothing at all. Recorded because the natural
  guess is wrong and would silently send every product-page toggle back to the
  home page — the exact fallback this change exists to delete.

- 2026-08-17 (P7): The deployment-and-data-sovereignty band on `/contact`
  ships with TWO verbatim lines, not the "three-line band"
  `trumandate-product-pages.md` describes — no third line exists anywhere in
  the brief or that doc, only a shape ("three-line") with no text behind it.
  Per this build's own instruction ("if no verbatim copy exists for it, add a
  TODO rather than writing marketing copy") and the ambiguity order's "show
  less rather than more", the band uses only what's sourced (the fourth
  interest option as its frame, the Fit-section chip as its body) and the gap
  is logged in TODO.md instead of a third sentence Claude Code wrote.
- 2026-08-17 (P7): `form.noValidate` is set at RUNTIME by
  `scripts/contactForm.ts`, never in the static markup. A JS-disabled reader
  therefore keeps the browser's own `required`/`type="email"` constraint
  validation as the only enforcement layer for the plain `<form action
  method="POST">` fallback (spec §6's own line); a JS-enabled reader gets
  `noValidate` flipped on before any submit fires, so the custom
  `role="alert"` summary + `aria-describedby`/`aria-invalid` pattern fully
  replaces the browser's native bubble UI instead of racing it. Chosen over
  a static `novalidate` (which would have left JS-disabled submissions
  completely unvalidated) or leaving native validation on for JS-enabled
  readers too (which pre-empts the `submit` event on the first invalid
  field, so the custom pattern would simply never run).
- 2026-08-17 (P7): Honeypot field named `_gotcha` — Formspree's own
  documented honeypot convention, chosen specifically because it protects the
  no-JS POST path too (Formspree drops any submission with that field filled,
  server-side), not only the JS-enabled path that
  `scripts/contactForm.ts` additionally short-circuits client-side.
- 2026-08-17 (P7): "What you want to see" built as four radio buttons, not a
  `<select>` (the content brief's prototype, `docs/trumandate-home.html`,
  used a select; the brief itself just says "options"). Radios keep every
  option visible without a click, matching the site's existing "no hidden
  menus" plainness, and need no extra work to keep working with JavaScript
  disabled. Interest values are stable English keys independent of `lang`
  (`full-walkthrough`, `strategy-kpi-cascade`, `benefits-realisation`,
  `deployment-sovereignty`), a separate judgement call so a Formspree
  submission stays legible regardless of which language the visitor used.
- 2026-08-17 (P7): `tailwind.config.mjs` gained `extend.aria.invalid =
  'invalid="true"'`. Tailwind's own default `aria` variant map (busy,
  checked, disabled, expanded, hidden, pressed, readonly, required, selected)
  has no `invalid` entry, so `FormField.astro`'s `aria-invalid:border-red` —
  the field-invalid visual state, always paired with the field's own error
  text per spec §9's error-identification rule, never the only signal —
  silently compiled to nothing until this was added. Full investigation
  (including a red herring) in known-issues.md's P7 section.

- 2026-08-17 (P9 gate, user-approved): the P8 spec-vs-spec conflict (spec §7's
  literal "40%" chain-link rest opacity vs. spec §9's AA-contrast/Lighthouse-100
  requirement) is resolved in favour of accessibility. `opacity.rest`
  (tailwind.config.mjs) raised from 0.40 to **0.57** — the smallest two-decimal
  value that clears 4.5:1 for BOTH chain-link text roles against `ink`, computed
  with real alpha compositing rather than assuming linear scaling: `text-body`
  (the binding constraint, the lower-contrast of the two roles even at full
  opacity) reaches 4.51:1 at 0.57 (4.43:1 at 0.56 — one step short); `text-paper`
  clears far earlier (5.68:1 at 0.57). Verified with a fresh Lighthouse
  accessibility audit on the built `/en/` and `/ar/`: 100 on both (was 96 at
  P8). `known-issues.md`'s P8 entry and `QA-REPORT.md` §4/§6 stand as the
  historical record of the conflict and its measurements; this entry and
  `known-issues.md`'s P9 section record the resolution. TODO.md's P8 item is
  closed.
- 2026-08-17 (P9): `<meta name="theme-color">` and `public/site.webmanifest`
  both need literal colour values — there is no Tailwind-class equivalent for
  a browser-chrome tint or a static JSON manifest field. CLAUDE.md's "no hex
  value outside tailwind.config.mjs" is read as scoped to component/script
  source that COULD otherwise reach a token via a Tailwind utility (`.astro`/
  `.ts` under `src/`) — the same boundary the standing hex-outside-config grep
  has always checked (`src/` only, per every prior QA-REPORT.md section).
  `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` and
  `public/site.webmanifest` are static assets that inherently cannot reference
  a JS config, exactly like the SVG fragments' own `fill="#..."` would if they
  weren't Tailwind classes — so `BaseLayout.astro`'s theme-color reads the
  value from `tailwind.config.mjs` at build time (one spelling, imported, not
  retyped) rather than a second hex literal, and the manifest's two colour
  fields are the one place in this build a literal token value is written
  outside that file, by necessity rather than oversight.
- 2026-08-17 (P9): OG images (`public/og/og-{en,ar}.png`, 1200×630) and the
  favicon set are generated by a one-off Node script run from the scratchpad
  (never added to `package.json` — "no new dependencies"), using the
  project's own transitively-installed `sharp` purely as an SVG rasterizer.
  Every visual element is authored from the same tokens/geometry already in
  the codebase (the mark's rect geometry is copied from `Header.astro`'s
  inline SVG; the wordmark colours and weight from the same BUILD_FLAGS
  wordmark decision), with the two font files already in `public/fonts/`
  embedded as base64 `@font-face` data URIs so librsvg (bundled with sharp,
  with pango/harfbuzz/fribidi for real Arabic shaping) renders actual glyphs
  rather than a fallback font — verified visually before shipping. The
  favicon.ico is a hand-rolled ICO container (PNG-embedded, the modern format
  every current OS/browser accepts) rather than an `npx` tool, since a
  network-dependent dev tool isn't guaranteed on this machine and the ICO
  container format is a few dozen bytes of header, not worth a dependency
  either way.
- 2026-08-17 (P9): `sitemap.xml.ts` is a hand-written static endpoint
  (`export const GET`), not an integration package — the route list is five
  fixed suffixes across two languages (the same shape `i18n/utils.ts`'s
  `pairedRoutes` already tracks), small and stable enough that a generator
  dependency would cost more than it saves. Ten `<url>` entries, each
  carrying all three hreflang alternates (en/ar/x-default) per Google's
  documented bidirectional-annotation requirement.
- 2026-08-17 (P9): `Meta.astro`'s `og:locale` values: `en_US`/`ar_AE` as the
  primary pair (CLAUDE.md names UAE and KSA as the two markets; ar_AE is
  listed first among the Arabic alternates so a KSA reader's own region isn't
  presented as secondary to a UAE one), with `ar_SA` included as a second
  `og:locale:alternate` on every route so neither Gulf market reads as the
  other's afterthought.
- 2026-08-17 (P9): Titles/descriptions for `/` and `/contact` moved out of
  each page's hardcoded `BaseLayout` props into `i18n/ui.ts`'s new `meta`
  branch (same text, moved verbatim, not rewritten) — the three product pages
  already had theirs in `components/product/copy.ts`'s `documentTitle`/
  `documentDescription`, which stays there rather than being merged into
  `UiStrings` for the same reason P6-AR's decisions log already gives
  (`useTranslations`' `KeyPath`/`t()` contract is string-only; product copy's
  shape is not).
- 2026-08-17 (P9, user-approved launch decisions, superseding several P1–P8
  placeholders and open items in the same pass):
  - **`public/robots.txt`** flipped from "Disallow all, noindex for the
    build" to `Allow: /` plus a `Sitemap:` reference — this build is now
    treated as launch-ready rather than pre-launch, so README-BUILD.md §6
    step 6's "on launch day, flip robots.txt" is executed here rather than
    left for a separate day. TODO.md's P1 item is closed.
  - **Contact email** replaced with the real address,
    `trumandate@intertecsys.com` (was the BUILD_FLAGS placeholder default,
    `hello@trumandate.com`) — wired into `i18n/ui.ts` (`contact.emailNote`,
    `contact.errorBody`, both languages) and `ContactPage.astro`'s `mailto:`
    link. TODO.md's P1/P7 items are closed. The Formspree endpoint is a
    separate, still-open item — see MORNING-REPORT.md's launch checklist.
  - **The sovereignty band's two-line shape** (`SovereigntyBand.astro`,
    logged as an open gap since P7 because no verbatim third line exists in
    the brief or `trumandate-product-pages.md`) is approved as the shipped
    shape. TODO.md's P7 item is closed, not carried forward.
  - **Certification marks are deliberately omitted, not merely unsupplied.**
    Intertec Systems holds company-level certifications; the TruMandate
    product itself does not, and spec §5A's own word is "**held**" — a mark
    on `/contact` would claim something the product doesn't have. The
    placeholder `public/vendor/iso-27001.svg` this build had drafted was
    removed rather than left as a "coming soon" stand-in, since none is
    coming. `SovereigntyBand.astro`'s comment carries the full reasoning.
  - **The optional demo-runner photograph** (spec §5A, "only if Piyush
    supplies it") is skipped permanently, not deferred — no code ever
    referenced it, so nothing to remove; noted here so its absence reads as
    a decision rather than a gap.
  - **The Intertec Systems logo** had no real asset for the bulk of this
    prompt (`assets/logo.png` is the TruMandate mark reference only,
    unrelated), so `Footer.astro` kept its plain-text company credit as the
    real attribution and the placeholder `public/vendor/intertec-systems.svg`
    this build had drafted was removed for the same reason as the ISO mark
    above, rather than left as a "coming soon" stand-in. Piyush supplied the
    real file as this prompt was closing out — `assets/intertec-logo.svg`
    (200×140 viewBox) — too late in this pass to vectorize into
    `Footer.astro` and re-verify against spec §5A's "no hex outside
    tailwind.config.mjs"/no-raster invariants in the same run. Status at
    handoff: **in progress**, not missing — see TODO.md's P9 section and
    MORNING-REPORT.md's launch checklist for the one remaining step.
- 2026-08-17 (P9): `seo/JsonLd.astro` (PLAN.md §1's file tree lists an
  Organization + SoftwareApplication structured-data component) was not built
  this pass. The P9 build brief's explicit six-item list (titles/descriptions,
  OG/Twitter/canonical/hreflang, sitemap/robots, raster assets, wiring,
  vendor placeholders) supersedes PLAN.md's earlier file-tree aspiration for
  this final prompt and does not name it; per CLAUDE.md's authority order
  (live code/spec outrank a planning doc, and the current prompt outranks
  both for scope), building it unrequested would be scope creep in the last
  prompt of the run rather than a gap-fill. Logged in TODO.md as optional
  future work, not silently dropped.

## Deferred

(Claude Code appends here, mirroring `TODO.md`. Nothing deferred lives only in prose.)

- 2026-08-17 (P1): Button.astro, favicon set, OG images, vendor SVGs, Formspree
  endpoint, contact email, Lenis, sitemap.xml.ts, provisional Arabic nav
  labels, header-height offset re-check — full detail in TODO.md.
- 2026-08-17 (P9): Still open at handoff: the Formspree endpoint (real
  service still needed), the Intertec Systems logo (optional, contingent on
  Piyush supplying a file), a native-reader Arabic pass on the product/contact
  copy (COPY-REVIEW.md), `<main>`'s missing `tabindex="-1"` (P8, cheap, not
  done this pass — out of this prompt's stated scope), `seo/JsonLd.astro`
  (never built, see the decisions log above), and the WebKit-specific
  verification passes on `/contact` and the three product pages (Playwright
  MCP in every session so far has been Chromium-bound). Full detail and the
  complete launch checklist: MORNING-REPORT.md.
