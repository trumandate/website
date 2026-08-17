# TruMandate product pages — decisions and briefs

Companion to `trumandate-site-spec.md`. Where the two conflict, this file wins for
page-level content decisions; the spec wins for tokens, motion, and infrastructure.

---

## The decision

Three product pages. Each one expands exactly one link of the traceability chain
shown on the home page.

| Route        | Chain link expanded    | The one question it answers                                    |
| ------------ | ---------------------- | -------------------------------------------------------------- |
| `/strategy`  | Objective → KPI        | How does a national mandate become a number someone owns?      |
| `/execution` | Initiative → Milestone | How does delivery reality reach the office that funded it?     |
| `/benefits`  | Benefit                | How do you know the outcome happened, after the team has gone? |

Not built, deliberately: a module catalogue, a features page, a pricing page,
a comparison page, a page per module, a resources or blog section. Nineteen modules
listed on a website is a procurement document. A buyer who can enumerate the feature
set has no reason to attend a demo.

Deployment and data sovereignty is not a page. It is a three-line band that appears
once on the home page and once on `/contact`. It answers an objection; it does not
need forty seconds of scroll.

---

## The curiosity ledger

Every page has a reveal column and a withhold column. The withheld item is what the
demo opens with. Claude Code must not move an item across the line.

| Page         | Reveals                        | Withholds (demo opener)                     |
| ------------ | ------------------------------ | ------------------------------------------- |
| Home         | The chain exists, end to end   | What the Command Centre actually looks like |
| `/strategy`  | One KPI card, fully readable   | The cascade editor and how weighting works  |
| `/execution` | Three initiative rows, cropped | The gate workflow and the approval routing  |
| `/benefits`  | The forecast curve shape       | The benefit register and attribution logic  |
| `/contact`   | Nothing                        | Everything                                  |

Enforcement rules:

- One fragment per page. Not three. The earlier spec allowed three; three is too many
  once each page carries only one argument. **One.**
- No fragment may show more than one screen region. A KPI card is one region. A KPI
  card plus a sidebar is a screenshot.
- Every fragment crops at the section edge so the composition visibly continues.
- No page may contain the word "everything", "complete", "full suite", or "end to end"
  in reference to the product. The chain already implies completeness; saying it
  cheapens it.

---

## Shared page skeleton

Every product page uses this order. No page invents a new structure.

1. **The question** — an eyebrow naming the chain link, then a headline that poses
   the buyer's actual question rather than announcing a feature.
2. **The argument** — three to four paragraphs, no bullets, no cards. This is the
   page's substance and the reason a serious reader stays.
3. **The fragment** — one cropped SVG, revealed by clip-path wipe, with a two-line
   caption. Nothing else in this section.
4. **The AI moment** — signal, evidence with confidence value, then the accept /
   modify / reject gate with a named audit line. Same three-part shape on all
   three pages.
5. **The handoff** — one sentence naming what the demo shows that this page did not,
   then the CTA. This is where the withheld item is explicitly promised.

Approximately 500 to 700 words per page. Long enough to prove competence, short
enough that the CTA arrives while interest holds.

---

## `/strategy` — Set direction

Page title: Strategy and KPIs
Headline seed: _A mandate is not a plan until someone owns a number._

**Argument to land.** Most strategy offices can produce the objective tree. Almost
none can answer, on demand, which initiative moves which objective and by how much.
The break happens at the KPI: objectives are written by people who set direction,
KPIs are defined by people who report, and nobody reconciles the two. TruMandate
makes the KPI the join. It carries a baseline, a target, an owner, and a live actual,
and it is attached to both the objective above it and the initiatives below it.
A KPI without a baseline is an opinion, and the platform refuses to accept one.

**Fragment.** The KPI card: label, baseline, target, live actual, RAG dot, and a
sparkline of the last six periods. Cropped so the neighbouring card is half visible
at the frame edge.

**AI moment.** Two KPIs under different objectives are counting the same benefit.
Confidence 0.81. Evidence: identical source measure and overlapping initiative set.
Suggested action: merge, or mark one as a contributing measure. Gate with audit line.

**Handoff line.** _The demo shows the cascade being built: national framework in at
the top, weighted objectives out at the bottom, in about ten minutes._

---

## `/execution` — Deliver it

Page title: Execution and governance
Headline seed: _Delivery data that never reaches the funder is just paperwork._

**Argument to land.** Project tools are good at managing projects and structurally
incapable of rolling up to a mandate, because the mandate does not exist inside them.
So the roll-up becomes a monthly human exercise: someone requests status, someone
else types it into a template, and by the time it reaches the steering committee it
is both stale and negotiated. TruMandate holds initiatives against the objective that
funded them, with baseline and actual on every milestone and every stage gate decision
assigned to a named person with a date. The steering pack stops being assembled,
because it was never disassembled.

**Fragment.** Three initiative rows with RAG dots and progress bars, cropped mid-list
so the list clearly continues. One row is red.

**AI moment.** A dependency between two initiatives owned by different departments is
at risk, and neither owner has escalated. Confidence 0.74. Evidence: gate 3 slipped on
one, and the other's start condition references it. Suggested action: raise a
cross-department dependency flag before the steering meeting. Gate with audit line.

**Handoff line.** _The demo shows what happens when a gate is rejected, and how far
the change propagates before anyone re-plans._

---

## `/benefits` — Prove it

Page title: Benefits realisation
Headline seed: _The project closed. Did the benefit arrive?_

**Argument to land.** Benefits are forecast during business case approval, when
optimism is rewarded, and measured never, because the project team has disbanded by
the time the benefit is due. This is the single largest credibility gap in portfolio
governance, and it is why the same benefit gets promised by three consecutive
programmes. TruMandate keeps the benefit alive for 24 months past closure, attached
to the exact KPI it promised to move, with an owner who is still employed in that
role. Forecast and actual sit on the same axis. Divergence is visible without anyone
asking for it.

**Fragment.** The forecast curve: solid line to today, dashed projection beyond,
with the measurement window marked. No axis labels beyond the minimum.

**AI moment.** Benefit leakage: actuals have diverged from forecast by 18% in the
two quarters since closure, and no owner has been notified. Confidence 0.69.
Evidence: the underlying KPI stopped improving when the programme team was released.
Suggested action: reassign benefit ownership and revise the forecast. Gate with
audit line.

**Handoff line.** _The demo shows the benefit register: every promise made in a
business case, with its current status, in one list._

---

## Copy rules

Banned words on every page: leverage, seamless, robust, holistic, empower,
revolutionise, insights, AI-powered, single source of truth, game-changing,
best-in-class, unlock. Also banned: any claim about customer count, ROI percentage,
or time saved, unless Piyush supplies a real one.

Write numbers rather than adjectives. "24 months after closure" beats "long-term".
"Confidence 0.74" beats "highly confident". The register is a competent practitioner
explaining something to a peer, not a vendor addressing a prospect.

Arabic copy for these three pages does not yet exist. Claude Code writes the English
first, Piyush approves it, and only then is Arabic produced — translating unapproved
copy wastes the pass.

---

## Claude Code prompt — replaces P6 in `trumandate-site-prompts.md`

```
Read trumandate-product-pages.md in full, alongside trumandate-site-spec.md.

Build /strategy, /execution and /benefits in English only. Arabic comes later,
after I approve the copy.

Follow the shared page skeleton exactly. All three pages use the same five-part
structure, the same section wrapper, and the same reveal component. Do not invent
per-page visual patterns and do not add page-specific animations beyond the
fragment's clip-path wipe.

Enforce the curiosity ledger without exception:
- Exactly ONE cropped SVG fragment per page.
- Each fragment shows one screen region only, cropped at the section edge.
- The withheld item named in the ledger must not appear anywhere on that page.
- The handoff sentence promises the withheld item explicitly, then the CTA follows.

Write the argument prose yourself in the register described, 500 to 700 words per
page, using the headline seeds and the argument summaries as your brief. Obey the
banned word list. Invent no statistics.

Output the three pages' copy into COPY-REVIEW.md as plain prose, separately from the
code, so I can edit it without reading diffs.

Then verify with chrome-devtools MCP: LCP and CLS per route against the spec budget,
zero console errors, screenshots at 375 and 1440. Report the numbers.
```
