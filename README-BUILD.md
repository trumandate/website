# TruMandate site — Claude Code handoff

Everything needed to build the site. Read this file first.

---

## 1. Repo layout before you start

```
trumandate-site/
├── CLAUDE.md                        ← loaded automatically every turn
├── BUILD_FLAGS.md                   ← autonomous defaults
├── docs/
│   ├── trumandate-site-spec.md      ← architecture, tokens, motion, budgets
│   ├── trumandate-product-pages.md  ← page decisions + curiosity ledger
│   ├── trumandate-content-brief.md  ← verbatim copy, EN + AR
│   └── trumandate-site-prompts.md   ← the prompt sequence (for Piyush, not the agent)
└── (Claude Code creates everything else)
```

`CLAUDE.md` and `BUILD_FLAGS.md` sit at the repo root so they load without being
mentioned. The three docs go in `docs/`. The prompts file is your script, not an
input to the agent.

---

## 2. MCP servers required

Three, all free, all verified. Install before the first prompt.

```bash
# Browser eyes: performance traces, console errors, screenshots, Core Web Vitals.
# Published by the chromedevtools org, Apache 2.0. Needs Node 22+ and stable Chrome.
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest

# Cross-browser verification. Matters because pinned ScrollTrigger sections are
# where WebKit diverges, and this drives Chromium, Firefox and WebKit.
claude mcp add playwright --scope user npx '@playwright/mcp@latest'

# Current, version-specific library docs so GSAP and Astro APIs are not recalled
# from training data. Upstash, free at basic rate limits, no key required.
claude mcp add context7 --scope user npx -y @upstash/context7-mcp
```

Verify with `/mcp` — all three must read "connected" before you begin.

### Not installed, deliberately

| Rejected                                                               | Why                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GSAP MCP servers                                                       | No official GreenSock server exists. The four on the registries are unaffiliated hobby packages that turn sentences into GSAP code, which Claude Code already does. Adds `npx` supply-chain surface, buys nothing. Context7 covers the actual gap, which is API currency. |
| Three.js / 3D servers                                                  | No WebGL on this site. Payload and credibility cost, zero benefit to a government buyer.                                                                                                                                                                                  |
| Image and video generation (Higgsfield, Imagine, etc.)                 | The site contains no photography. All product surfaces are inline SVG.                                                                                                                                                                                                    |
| GetLayers                                                              | Paid, and template libraries fight a defined brand system.                                                                                                                                                                                                                |
| Impeccable, UI/UX Pro Max, taste-skill, scroll-experience, img2threejs | Unverified provenance. A skill injects arbitrary instructions into your agent and an MCP server runs arbitrary code with repo access. Read the repos before trusting any of them.                                                                                         |

---

## 3. Plugins and skills

```
/plugins    → install frontend-design if not already present
```

That is the only one needed. It is Anthropic's own, and it does the job the
third-party design skills claim to do.

No custom skill is required. The motion rules that a scroll-animation skill would
carry are already in spec section 7 and enforced by `CLAUDE.md`.

---

## 4. Order of operations

Run the prompts in `trumandate-site-prompts.md` in sequence, one turn each.

| Prompt | Produces                                                             | Gate                                                                                       |
| ------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| P0     | `PLAN.md` — file tree, tokens, visual direction, spec contradictions | Read the contradictions list before continuing. This is the cheapest bug-catch in the run. |
| P1     | Astro scaffold, tokens, shared components, header, footer            | Clean build, base bundle reported                                                          |
| P2     | Home page, English, no motion                                        | Review the two screenshots                                                                 |
| P3     | The chain sequence                                                   | Zero dropped frames through the pin                                                        |
| P4     | Remaining motion                                                     | LCP and CLS within budget                                                                  |
| P5     | Arabic tree, RTL, language toggle                                    | Grep for physical direction properties returns nothing                                     |
| P6     | Three product pages, English, then `COPY-REVIEW.md`                  | **You edit the copy here.** Then run the follow-up turn for Arabic.                        |
| P7     | Contact page and form                                                | Form posts, errors announced                                                               |
| P8     | Full verification pass, `QA-REPORT.md`                               | Every budget in spec section 9                                                             |
| P9     | SEO, OG images, favicons, `MORNING-REPORT.md`                        | Then you connect Cloudflare Pages                                                          |

Rough shape: P0 to P4 is a session, P5 to P7 is a session, P8 to P9 is a session.

---

## 5. What you supply

Claude Code cannot invent these. Leave them as placeholders and fill them in
before launch:

- Formspree endpoint (or another form service), set as `PUBLIC_FORMSPREE_ENDPOINT`
- Contact email address
- Intertec Systems logo as SVG
- Any certification marks (ISO 27001 and similar) as SVG
- Optionally, a photograph and real name of whoever runs demos, for the contact page
- Approved English copy for the three product pages, at P6

---

## 6. Deploy, after P9

1. Add trumandate.com as a zone on Cloudflare free. Let the scanner import DNS, then
   verify MX and SPF line by line before switching nameservers at the registrar.
   A missed mail record kills company email the moment the nameservers flip.
2. Switch nameservers. Usually live within an hour.
3. Create the Pages project from the repo. Build command `npm run build`, output
   directory `dist`.
4. Add custom domains `trumandate.com` and `www.trumandate.com`. Apex is canonical;
   301 the www with a redirect rule.
5. Put Cloudflare Access with email OTP in front of the zone while sales reviews.
6. On launch day: remove the Access policy, flip `robots.txt` off noindex, submit
   the sitemap.

---

## 7. The two rules most likely to erode

Both are in `CLAUDE.md`, but they are the ones that quietly slip during a long run,
so check them at P8:

**One fragment per product page.** Every extra one hands away a demo opener for
free. If a page shows two, delete the weaker one rather than justifying it.

**No full product screen anywhere,** including the OG image. The only exception is
the dimmed Command Centre behind the home page CTA, which must stay legible as a
composition and unreadable as data.
