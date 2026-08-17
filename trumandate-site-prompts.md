# TruMandate site — Claude Code prompt sequence

Run in order. Each prompt is a single Claude Code turn. Do not merge prompts.
Required in the repo before you start: `trumandate-site-spec.md`,
`trumandate-content-brief.md`, `trumandate-home.html` (reference only, do not copy).

Before P0, in Claude Code:

```
/plugins            → confirm frontend-design is installed
/mcp                → confirm chrome-devtools and playwright show "connected"
```

---

## P0 — Read, plan, do not build

```
Read trumandate-site-spec.md and trumandate-content-brief.md in full.
trumandate-home.html is a discarded earlier attempt: read it ONLY for the SVG
Command Centre geometry and the Arabic strings. Its layout and composition are
rejected and must not influence yours.

Use the frontend-design skill.

Do not write any code yet. Produce:
1. A file tree for the Astro project.
2. The complete Tailwind token config you will use, derived from spec section 3.
3. Your visual direction for the home page in prose: hero composition, how the
   chain sequence is staged, where the AI moment sits, how the dimmed Command
   Centre CTA closes the page. Argue for the choices.
4. A list of every place the spec is ambiguous or self-contradicting.

Write all four into PLAN.md and stop.
```

---

## P1 — Scaffold and tokens

```
Execute PLAN.md sections 1 and 2.

Scaffold the Astro project with Tailwind and GSAP (core, ScrollTrigger, SplitText),
pinned versions. Self-host IBM Plex Sans Arabic and IBM Plex Mono as subset woff2.

Build only:
- tailwind.config.mjs carrying every token
- the shared section wrapper component
- the shared reveal component with the prefers-reduced-motion fallback built in once
- the header and footer, bilingual-ready but English only for now

No page content. Verify the dev server builds clean and report the base bundle size.
```

---

## P2 — Home page, English, structure before motion

```
Build the home route in English with zero animation. Static end-state only.

Sections per spec section 6: hero, three named failure modes, the traceability
chain (five links, laid out but not yet animated), the AI moment, the dimmed
Command Centre CTA.

Author every product fragment as inline SVG from the tokens, following the
withholding rules in spec section 5. The Command Centre in the closing CTA is
dimmed to roughly 25% and must be legible as a composition but unreadable as data.

Copy comes verbatim from the content brief. Do not write new marketing copy.

Then use chrome-devtools MCP: load the page, screenshot at 1440 and 375, and show
me both before you continue.
```

---

## P3 — The chain sequence

```
Build motion item 1 from spec section 7: the chain draw. Use context7 for the
current GSAP and ScrollTrigger API rather than recall — reference /greensock/gsap.

The rail draws on scroll progress through a pinned section. Five nodes activate in
sequence, muted to accent, each caption lifting from 40% to full opacity. Use
GSAP ScrollTrigger with scrub. The pin must not swallow more scroll distance than
the section's natural height plus one viewport.

Constraints:
- Rail sits on the inline-start edge using logical properties, so RTL mirrors it.
- Full reduced-motion fallback: rail fully drawn, all nodes active, no scrub.
- 60fps: transforms and opacity only, no animated layout properties.

Verify with chrome-devtools MCP: performance trace during a scripted scroll through
the section, report dropped frames, then screenshot at three scroll positions.
```

---

## P4 — Remaining motion

```
Build motion items 2 through 6 from spec section 7. Nothing else. If you find
yourself wanting a seventh animation, add it to TODO.md instead and tell me why.

Re-verify LCP and CLS with chrome-devtools MCP against the spec section 9 budget.
Report both numbers.
```

---

## P5 — Bilingual layer

```
Add the Arabic tree now, before the other four pages exist.

Astro i18n routing for /en and /ar, language toggle in the header naming the target
language in its own script, dir and lang set on <html>, Arabic line-height and
mono-to-sans label swap per spec section 8. Arabic copy verbatim from the content brief.

Then run this check and fix every hit:
  grep -rEn '\b(ml|mr|pl|pr|left|right)-' src/
Only logical utilities are permitted.

Then screenshot the Arabic home page at 1440 and 375 with chrome-devtools MCP and
walk it yourself for LTR-layout artefacts: rules on the wrong edge, chevrons
pointing the wrong way, mono letterspacing on Arabic, numerals crowding.
```

---

## P6 — Strategy, execution, benefits pages

```
Read trumandate-product-pages.md in full, alongside trumandate-site-spec.md.

Build /strategy, /execution and /benefits in English only. Arabic comes later,
after I approve the copy.

Follow the shared page skeleton in that file exactly. All three pages use the same
five-part structure, the same section wrapper, and the same reveal component. Do not
invent per-page visual patterns and do not add page-specific animations beyond the
fragment's clip-path wipe.

Enforce the curiosity ledger without exception:
- Exactly ONE cropped SVG fragment per page.
- Each fragment shows one screen region only, cropped at the section edge.
- The withheld item named in the ledger must not appear anywhere on that page.
- The handoff sentence promises the withheld item explicitly, then the CTA follows.

Write the argument prose yourself in the register described, 500 to 700 words per
page, using the headline seeds and argument summaries as your brief. Obey the banned
word list. Invent no statistics.

Output all three pages' copy into COPY-REVIEW.md as plain prose, separately from the
code, so I can edit it without reading diffs.

Then verify with chrome-devtools MCP: LCP and CLS per route against the spec budget,
zero console errors, screenshots at 375 and 1440. Report the numbers.
```

After I approve COPY-REVIEW.md, run this follow-up as its own turn:

```
The copy in COPY-REVIEW.md is approved with my edits. Fold it into the three pages,
then produce the Arabic tree for /strategy, /execution and /benefits.

Arabic is written, not machine-translated: keep the argument, not the sentence
structure. Apply the Arabic type rules from spec section 8. Then screenshot all
three Arabic routes at 375 and 1440 and check for LTR-layout artefacts.
```

---

## P7 — Contact and form

```
Build /contact in both languages. Fields per the content brief, honeypot included.

Posts to Formspree with fetch. Inline success and error states in both languages,
no page reload, no alert(). Client-side validation with errors announced to screen
readers. Endpoint as an env var with a placeholder.

No product imagery and no AI content on this page.
```

---

## P8 — Verification pass

```
Full verification against spec sections 9 and 10. Fix as you go, then report.

chrome-devtools MCP, every route, both languages:
- performance trace, report LCP and CLS per route
- console errors, must be zero
- screenshots at 375, 768, 1440
- any horizontal overflow

Playwright MCP, WebKit specifically:
- scroll the home page chain sequence end to end, confirm the pin releases correctly
- confirm no layout shift when the language toggles

Manual checks you perform and report on:
- prefers-reduced-motion enabled: every route readable, all content visible, no motion
- keyboard only: focus visible everywhere, logical order, skip link works
- JavaScript disabled: every route still readable and navigable
- contrast of every token pair actually used, against WCAG AA

Write results to QA-REPORT.md. List every failure you could not fix and why.
```

---

## P9 — Ship readiness

```
Per-route titles and meta descriptions in both languages, Open Graph tags, hreflang
alternates, sitemap.xml, and robots.txt set to noindex for now.

Produce every raster asset listed in spec section 5A: Open Graph images at
1200 × 630 per language, favicon.svg, favicon.ico, apple-touch-icon.png at 180 × 180,
and site.webmanifest. Generate them from the design system, not from a screenshot.
The OG image must contain no readable product screen, per spec section 5.
Leave a placeholder and a TODO.md entry for the Intertec Systems logo SVG and any
certification marks, which I will supply.

Then write MORNING-REPORT.md containing: what was built, the final performance and
accessibility numbers per route, every deferred item with its reason, and every
hardcoded value I must replace before launch (Formspree endpoint, contact email,
anything else).

Do not deploy. I will connect Cloudflare Pages myself.
```

---

## Standing rules for all prompts

- Live code overrides stale docs. If the spec contradicts what you find in the
  repo, stop and tell me rather than guessing.
- Deferred work goes to TODO.md. Nothing deferred lives only in a spec or a chat.
- Do not add dependencies not named in spec section 2 without asking first.
- Do not install additional MCP servers or skills on your own.
- Halt only on genuine blockers. Otherwise run to the end of the prompt.
