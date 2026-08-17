# CLAUDE.md — TruMandate marketing site

Repo-level rules. These apply to every turn, in every session, without being
restated in the prompt.

## What this repo is

The public marketing site for TruMandate, a portfolio governance and strategy
execution platform sold by Intertec Systems to government entities and large
enterprises in the UAE and Saudi Arabia. Static Astro site, bilingual English and
Arabic, deployed to Cloudflare Pages at trumandate.com.

Its single job is to earn a demo request. It is not documentation, not a feature
catalogue, and not a place to explain the whole product.

## Authority order

1. Live code in this repo.
2. `trumandate-site-spec.md` — architecture, tokens, motion, budgets.
3. `trumandate-product-pages.md` — page-level content decisions and the curiosity ledger.
4. `trumandate-content-brief.md` — verbatim copy, both languages.
5. Anything said in chat.

If a spec contradicts the code, stop and say so. Do not silently pick one.

## Invariants

- **No photography anywhere.** No stock, no AI-generated, no national imagery.
  All product surfaces are hand-authored inline SVG. Raster is limited to the asset
  list in spec section 5A.
- **No full product screen appears on the site.** Fragments only, one per product
  page, cropped at the section edge. The only exception is the dimmed Command Centre
  in the home page closing CTA.
- **Fragments must be faithful to the real UI.** Anonymise the data, never the
  interface.
- **No hex value outside `tailwind.config.mjs`.** Tokens only.
- **No physical direction properties.** No `left`, `right`, `ml-`, `mr-`, `pl-`,
  `pr-`, `text-left`, `text-right`. Logical properties and logical Tailwind utilities
  only. This is grep-checked.
- **Arabic never carries less content than English.**
- **Reduced motion is a real branch.** Under `prefers-reduced-motion: reduce` no
  timeline is created; elements render in their end state. End state lives in CSS,
  GSAP animates _from_ an offset, so a JS failure degrades to a correct page.
- **Transforms and opacity only.** Never animate layout properties.
- **One pinned section and one scrubbed timeline per route, maximum.**
- **No new dependencies** beyond spec section 2 without asking.
- **No installing MCP servers or skills** on your own.

## Copy rules

Banned: leverage, seamless, robust, holistic, empower, revolutionise, insights,
AI-powered, single source of truth, game-changing, best-in-class, unlock, end to end,
complete, full suite.

Never invent a statistic, a customer count, an ROI figure, or a testimonial.
Write numbers rather than adjectives. Register is a competent practitioner explaining
something to a peer.

## Working conventions

- Deferred work goes to `TODO.md`. Nothing deferred lives only in a spec or in chat.
- Known defects go to `known-issues.md` with a reason.
- Copy for review goes to `COPY-REVIEW.md` as plain prose, never buried in diffs.
- Final session summary goes to `MORNING-REPORT.md`.
- Verify with the browser MCPs before declaring anything done. "Looks smooth" is not
  a result; report LCP, CLS, dropped frames, console errors.
- Use context7 for current GSAP, Astro, and Tailwind APIs rather than recall.

## Budgets

First-load transfer under 900 KB, JS under 200 KB gzipped, LCP under 2.0s on a 4G
mobile profile, CLS under 0.05, Lighthouse mobile performance above 90 and
accessibility 100, WCAG 2.1 AA. The site must be readable with JavaScript disabled.
