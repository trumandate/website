# TruMandate marketing site — build spec

Status: authoritative. Claude Code builds against this file, not against chat history.
Owner: Piyush, Intertec Systems. Domain: trumandate.com.

---

## 1. Purpose and audience

Pre-sales asset for government entities and large enterprises in the UAE and KSA.
The reader is a strategy office, EPMO, or transformation office director. They have
already been sold the category. They are deciding whether this vendor understands
governance well enough to be worth an hour.

The site has one job: earn the demo request. It does not need to explain the whole
product, and explaining the whole product actively hurts, because a fully explained
product has nothing left to show.

Two consequences that govern every decision below:

- **AI is the through-line, not a section.** Every page shows AI doing something
  specific to that page's subject, under human approval. There is no single "AI"
  page, no sparkle icons, no chat bubble, no "powered by AI" badge.
- **Product is shown in fragments only.** See section 5.

---

## 2. Stack

- Astro, static output. No SSR, no server runtime.
- Tailwind for styling. No component library on marketing surfaces.
- GSAP core, ScrollTrigger, SplitText. GSAP is fully free including all former
  Club plugins since v3.13, commercial use covered. Pin the version in package.json.
- Lenis for smooth scroll. Optional; drop it if it fights ScrollTrigger on iOS.
- No WebGL, no Three.js, no canvas. Every visual is inline SVG or DOM.
- Astro i18n routing for `/en` and `/ar`.
- Fonts: IBM Plex Sans Arabic for both scripts, IBM Plex Mono for Latin data labels.
  Self-hosted, subset, woff2, `font-display: swap`.
- Deploy: Cloudflare Pages, apex domain, private repo.

---

## 3. Design system

Tokens live in `tailwind.config.mjs` and nowhere else. No hex value appears in a
component file.

```
ink        #04241E   page ground
jade       #0B4A3D   raised surfaces
jade-lift  #0F5C4B   hover, borders on raised
accent     #19C39B   the single accent
amber      #F2B441   RAG only
red        #E0574C   RAG only
paper      #F1F5F3   primary text
muted      #9CB8AE   secondary text
hairline   rgba(255,255,255,.10)
```

Amber and red never appear as decoration, only as status inside data components.
That restraint is what makes the RAG dots read as information rather than styling.

Type roles, three only:

- Display and headings: IBM Plex Sans Arabic, 600, tracking -0.02em Latin, 0 Arabic.
- Body: IBM Plex Sans Arabic, 300, line-height 1.55 Latin, 1.8 Arabic.
- Data and eyebrow: IBM Plex Mono, 500, uppercase, tracking 0.16em, Latin only.
  In Arabic this role swaps to Plex Sans 600 at normal tracking, because letterspaced
  mono destroys Arabic joining.

Layout: one section wrapper component owns max width (1180px) and vertical rhythm.
No page sets its own padding. Sections separate with hairline rules, not cards.

Banned outright: gradient meshes, glassmorphism, glow blobs, drop shadows on text,
three-column icon-on-top card grids, tilted 3D screenshots, logo walls, emoji icons,
stock illustration, fabricated testimonials, fabricated customer counts.

---

## 4. AI narrative strategy

The claim being made across the site: **AI proposes, a person decides, the record
remembers who decided.** That is the differentiator against both the incumbent PPM
vendors and against the AI-first startups, and it is the claim a government buyer
actually needs to hear before they will consider the category.

Every AI moment on the site follows the same three-part pattern, and the pattern
repeating is the point:

1. **The signal** — what the model noticed, stated as a fact with a number.
2. **The evidence and confidence** — why it thinks so, and how sure, as a value.
3. **The gate** — Accept / Modify / Reject, plus an audit line naming a person
   and a timestamp.

Per-page AI moment:

- Home: slip prediction on a delivery milestone.
- Strategy: objective decomposition drafted from a national framework document,
  plus detection of two KPIs double-counting the same benefit.
- Execution: dependency risk surfaced across two initiatives owned by different
  departments, before either owner has escalated.
- Benefits: benefit leakage detected when actuals diverge from forecast after
  project closure, when nobody is watching any more.
- Contact: none. Do not put AI in the form.

Copy discipline: never write "AI-powered", "leverage AI", "intelligent insights",
"revolutionise", or "seamlessly". Write what the model did, with the number it
produced. The restraint is the credibility.

---

## 5. Product snapshot strategy — deliberate withholding

Rule: **no full product screen appears anywhere on the site.** Not on the home page,
not on a feature page, not in the footer, not as an OG image.

What appears instead are fragments, authored as inline SVG from the design tokens
so they are pixel-crisp at any viewport and cost almost nothing in payload:

- One KPI card showing baseline, target, and actual.
- Three initiative rows with RAG dots and progress bars, cropped mid-list so the
  list visibly continues past the frame edge.
- One AI suggestion card with its confidence value and its three buttons.
- One benefit curve where the projected segment is dashed and the measurement
  window is marked.
- One stage gate queue item assigned to a named owner.

Cropping rules:

- Every fragment is clipped by the section edge or by a mask that fades to the
  page ground, so the eye reads "this continues" rather than "this is all of it".
- **One fragment per product page. Not two.** The home page carries at most two:
  one inside the chain sequence and the dimmed Command Centre in the closing CTA.
- Each fragment shows one screen region only. A KPI card is one region. A KPI card
  plus a sidebar is a screenshot wearing a crop.
- Fragments are never framed in a browser chrome mock, never tilted, never
  given a device bezel.

Fidelity rule, non-negotiable: **fragments must be faithful to what the demo will
actually show.** Same layout, same labels, same terminology, same information
density. Anonymise the data, never the interface. A prospect who sees a calmer,
cleaner product on the website than in the demo has learned something about this
vendor's honesty that no slide recovers. Where the real Echelons UI exists,
author the SVG against a screenshot of it and then discard the screenshot. Where
it does not yet exist, the fragment is a specification the UI must be built toward,
not licence for marketing to invent a nicer product.

Exactly one place shows more, and it is the closing CTA on the home page: a wide
Command Centre composition at low contrast, dimmed to roughly 25% against the
ground, with the CTA sitting on top of it. Legible as a shape, unreadable as data.
The line beside it: "The whole board, in forty minutes." That is the curiosity
mechanism, and it only works because nothing before it gave the layout away.

---

## 5A. Imagery and assets

The site contains no photography. Not stock, not AI-generated, not national imagery
such as skylines or flags, which carry brand and legal risk in this market. Every
product surface is hand-authored inline SVG, for four reasons that all point the
same way: SVG text swaps with the language toggle and mirrors under RTL where a
screenshot stays frozen in English, a dense dashboard screenshot costs 200 to 400 KB
and is illegible at 375px where the same fragment is under 10 KB and stays crisp,
callouts can address individual nodes because they exist as elements, and colours
inherit from tokens so fragments cannot drift from brand.

Raster assets are limited to this list, and all of them are required before launch:

- Open Graph image, 1200 × 630 PNG, one per language. Generated from the design
  system: wordmark and chain motif on jade. Contains no readable product screen,
  per section 5. Without it every WhatsApp and LinkedIn share renders as a grey box,
  which in this market matters more than search.
- Favicon set: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180 × 180),
  and `site.webmanifest`.
- Intertec Systems logo, SVG, footer and contact page.
- Any held certification marks (ISO 27001 and similar), SVG, contact page only.
  For a sovereignty-sensitive buyer these outperform any visual treatment.

Optional, and only if Piyush supplies it: one real photograph of the person who
runs demos, small, on the contact page with their real name and role. It converts
because it turns "submit a form to a company" into "book time with a named human".
A poor photograph is worse than none.

Where a section feels empty during the build, the fix is a wider type scale or more
vertical room. It is never an image.

## 6. Page map

Five routes, each in both languages.

**`/` Home**
Hero, the problem in three named failure modes, the traceability chain from
objective to benefit, one AI moment, the dimmed Command Centre CTA.
The chain is the signature scroll sequence — see section 7.

**`/strategy` Strategy and KPIs**
Objective cascade from national framework to entity objective to KPI to initiative.
Fragment: the KPI card. AI moment: drafted decomposition plus double-counting
detection. Argument to land: a KPI without a baseline is an opinion.

**`/execution` Execution and governance**
Milestone baseline against actual, stage gate queue with named owners.
Fragment: three initiative rows, cropped. AI moment: cross-department dependency
risk. Argument to land: delivery data must roll up to the mandate that funded it.

**`/benefits` Benefits realisation**
Forecast against actual, the 24-month post-closure measurement window.
Fragment: the benefit curve. AI moment: benefit leakage after closure.
Argument to land: a benefit nobody measures after go-live did not happen.

**`/contact` Request a walkthrough**
Form only, no product imagery, no AI. Fields per the content brief. Posts to
Formspree with fetch, inline success and error states in both languages.

---

## 7. Motion inventory

Complete list. Anything not here does not get built.

1. **Chain draw** (home, signature). A hairline rail draws downward pinned to
   scroll progress; five nodes activate in sequence from muted to accent as they
   pass the trigger point; each node's caption lifts from 40% to full opacity.
   This is the one place with a pinned section. Budget the ambition here.
2. **Section reveal.** Opacity 0 to 1 with 24px upward translate, 0.8s, custom
   ease, triggered once at 15% visibility. One shared component.
3. **Fragment mask wipe.** SVG fragments reveal via a clip-path wipe from the
   inline-start edge, 0.9s, so they read as being uncovered rather than fading in.
4. **AI card arrival.** The suggestion card enters with a short slide, then its
   confidence bar fills from 0 to its value over 0.6s. Once per page.
5. **Counter.** One number per page counts up on first view. One only.
6. **Header state.** Hairline border appears after 12px of scroll. No shrink, no hide.

Banned: parallax on images, cursor followers, magnetic buttons, marquees,
autoplaying carousels, scroll-jacking that overrides native scroll distance,
text that animates on every scroll pass rather than once.

Reduced motion: `prefers-reduced-motion: reduce` disables all six and renders every
element in its end state. This is tested, not assumed.

---

## 8. Bilingual and RTL rules

- Arabic is not a translation layer bolted on. Both trees are built together and
  the Arabic tree never carries less content than the English one.
- Every layout uses logical properties and Tailwind logical utilities. No `left`,
  `right`, `ml-`, `mr-`, `pl-`, `pr-` anywhere in the codebase. This is grep-checkable
  and gets grepped in the QA prompt.
- The chain rail sits on the inline-start edge and therefore mirrors automatically.
- Horizontal motion mirrors under RTL. Vertical motion does not.
- Numerals: Western digits in both languages for KPI values and dates, because
  government reporting uses them. Arabic-Indic digits only where the content brief
  already uses them.
- The product name stays "TruMandate" in Latin script in both languages.
- The language toggle names the target language in its own script.

---

## 9. Performance and accessibility budget

- Total first-load transfer under 900 KB, JavaScript under 200 KB gzipped.
- LCP under 2.0s on a simulated 4G mobile profile. CLS under 0.05.
- Lighthouse mobile performance above 90, accessibility 100.
- WCAG 2.1 AA: contrast checked against the actual token pairs, visible focus on
  every interactive element, logical tab order, skip link, form errors announced.
- Every SVG fragment has a `role="img"` and a real `aria-label` in both languages.
- The site must be readable and navigable with JavaScript disabled.

---

## 10. Verification loop

Claude Code verifies its own work with the browser MCPs rather than declaring
success. After each page is built:

- Chrome DevTools MCP: load the page, take a performance trace, report LCP and CLS,
  list console errors, screenshot at 375, 768 and 1440 in both languages.
- Playwright MCP: repeat the scroll sequence in WebKit specifically, since pinned
  ScrollTrigger sections are where Safari diverges.
- Any regression against section 9 is fixed before moving to the next page.

---

## 11. Out of scope

No blog, no pricing page, no customer logos, no case studies, no chatbot,
no cookie banner beyond what Cloudflare requires, no analytics until launch,
no CMS. Deferred items go to `TODO.md`, never into this spec as prose.
