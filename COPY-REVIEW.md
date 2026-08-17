# COPY-REVIEW.md — the three product pages, English

Written at P6 against the briefs in `docs/trumandate-product-pages.md`. This is
the copy exactly as it renders on `/en/strategy`, `/en/execution` and
`/en/benefits`, in reading order, as plain prose. Nothing here is code and
nothing here needs a diff to change — edit this file, and the same edits go
into the three page files.

**Arabic does not exist for these three pages yet, on purpose.** It is written
only after this file is approved (`trumandate-product-pages.md`: "translating
unapproved copy wastes the pass").

Each page follows the same five parts: the question, the argument, the
fragment and its caption, the AI moment, the handoff. Word counts below cover
all the prose a reader sees between the header and the footer, with the
fragment's own labels excluded.

Two things worth knowing while you read:

- **The handoff sentence is the only place its page's withheld item is
  allowed to appear.** `/strategy` may name the cascade and weighting only
  there; `/execution` may name a gate decision only there; `/benefits` may
  name the register only there. If you move one of those phrases up into the
  argument, the demo loses its opener.
- **Every number is either from the brief or is anonymised sample data inside
  the product fragment.** No statistic about a customer, an ROI or a time
  saving appears anywhere, and none should be added.

---

## `/strategy` — Strategy and KPIs

Expands the chain link **Objective → KPI**. Answers: how does a national
mandate become a number someone owns?
Reveals one KPI card. Withholds the cascade editor and how weighting works.
**587 words.**

### 1. The question

Eyebrow: **Objective → KPI**

Headline: **A mandate is not a plan until someone owns a number.**

### 2. The argument

Most strategy offices can produce the objective tree. It gets built during the
planning cycle, it is signed off by people senior enough to make it stick, and
it is usually good work. Ask the same office which initiative moves which
objective, and by how much, and the answer arrives three days later as a
spreadsheet somebody assembled by hand — if it arrives at all. The tree was
never the hard part. Holding it against what is actually being delivered is.

The break happens at the KPI, and it is an organisational problem before it is
a technical one. Objectives are written by the people who set direction. KPIs
are defined by the people who have to report, months later, against a template
that came from somewhere else. The two groups work to different calendars, use
different words for the same measure, and nobody's job description includes
reconciling them. So the objective tree and the measurement framework drift
apart quietly, and neither side finds out until someone asks a question that
needs both at once.

TruMandate makes the KPI the join rather than a downstream artefact. A KPI
record carries a baseline, a target, a named owner and a live actual, and it is
attached upward to the objective it serves and downward to the initiatives
funded to move it. Rescope an initiative and the KPI it feeds is already the
place the consequence shows, because the link is part of the record rather than
a note in a document somebody has to remember to update. Which initiative moves
a given number becomes a lookup instead of an investigation.

The baseline is the part that is usually missing, and the platform will not
accept a KPI without one. A measure with a target and no starting point can
tell you where the number sits but not whether it moved, which is how a
portfolio ends up reporting green against something nobody has improved.
Requiring the baseline at definition time is a small piece of friction that
irritates people in the first week and pays for itself the first time a
minister asks what has changed since the plan was published. An opinion cannot
survive that question. A baseline can.

### 3. The fragment

One KPI record, cropped so the next card is half visible at the frame edge. It
shows the KPI's reference and name, a status dot, baseline 42.0, target 75.0,
live actual 61.4, and a sparkline of the last six periods.

Caption, line 1: One KPI record as the platform stores it: baseline, target,
live actual, and the last six periods.

Caption, line 2: The status dot is derived from the movement between them.
Nobody types it in.

### 4. The AI moment

Eyebrow: **AI in the platform**

Heading: **Two KPIs, one benefit, counted twice.**

The model compares measure definitions and initiative links rather than KPI
names, so it finds duplication that a tidy naming convention hides — two
objectives, two reporting lines, one underlying benefit counted twice. It
states what it found, how sure it is, and what it would do about it. Nothing
reaches the record until a person chooses, and the choice is stored with their
name and the time they made it. The suggestion is evidence for a decision, not
the decision.

The card itself reads:

> AI watch — confidence 0.81
>
> **Two KPIs counting the same benefit**
>
> Objective 2.1 and Objective 4.3. Evidence: identical source measure and an
> overlapping initiative set. Suggested action: merge, or mark one as a
> contributing measure.
>
> [ Accept ] [ Modify ] [ Reject ]
>
> Decision logged · h.alsuwaidi · 11:07

### 5. The handoff

The demo starts where this page stops: the cascade being built in front of you,
a national framework document in at the top and weighted objectives out at the
bottom, in about ten minutes.

Then the button: **Request a walkthrough**.

---

## `/execution` — Execution and governance

Expands the chain link **Initiative → Milestone**. Answers: how does delivery
reality reach the office that funded it?
Reveals three initiative rows, cropped. Withholds the gate workflow and the
approval routing.
**592 words.**

### 1. The question

Eyebrow: **Initiative → Milestone**

Headline: **Delivery data that never reaches the funder is just paperwork.**

### 2. The argument

Project tools are good at managing projects. They are also structurally
incapable of rolling up to a mandate, because the mandate does not exist inside
them. A schedule knows its own tasks, its own dependencies and its own critical
path. It does not know which objective bought it, what that objective promised
in return, or which other initiative is competing for the same three people.
None of that is a defect in the tool. It is a question the tool was never
asked.

So the roll-up becomes a monthly human exercise. Someone requests status from
every delivery lead. Someone else retypes the replies into a template. On the
way through, each number is rounded gently toward the answer its author would
rather give, because the person typing it is also the person who will be asked
about it. By the time the pack reaches the steering committee it is both stale
and negotiated, and the committee makes funding decisions on it anyway, because
it is the only version that exists.

TruMandate holds initiatives against the objective that funded them. Every
milestone carries a baseline date and an actual date, so slip is a subtraction
rather than a judgement call, and it shows up on the day it happens instead of
at the end of the reporting month. Every stage gate decision is recorded
against a named person with a date, and it stays attached to the record after
that person has moved on. Because the roll-up is a query rather than a
collection exercise, the steering pack stops being assembled — it was never
disassembled in the first place.

What changes in practice is the meeting. A committee that trusts the numbers
spends its hour on the initiatives in trouble instead of spending it confirming
that the rest are broadly fine. And when a number is wrong, it is wrong in a
way that leads back to a record, a date and a person who can be asked about it,
which is a different class of problem from a number nobody can source.
Governance is mostly the ability to ask that second question and get an answer
the same day.

### 3. The fragment

Three initiative rows from the portfolio list, each with the objective that
funded it, a status dot and a progress bar. One row is red. A fourth row is cut
through by the frame edge so the list visibly continues.

Caption, line 1: Three initiatives as the portfolio view lists them, each
against the objective that funded it.

Caption, line 2: Progress is read from milestone baselines and actuals, so the
red row needed no separate exception report.

### 4. The AI moment

Eyebrow: **AI in the platform**

Heading: **A dependency at risk that neither owner has raised.**

This one comes out of two records no person had a reason to compare: a date
that moved on one initiative, and a start condition on another that points at
it. Different departments, different reporting lines, no shared meeting in
anyone's calendar. The model reads the link and puts the risk in front of
someone while there is still a week to act on it, with its evidence attached. A
person decides whether it is real, and that decision becomes part of the record
rather than a remark in a meeting.

The card itself reads:

> AI watch — confidence 0.74
>
> **Cross-department dependency at risk**
>
> Initiative 07 and Initiative 21, different departments. Evidence: gate 3
> slipped on one, and the other's start condition references it. Suggested
> action: raise a cross-department dependency flag before the steering meeting.
>
> [ Accept ] [ Modify ] [ Reject ]
>
> Decision logged · m.alfarsi · 08:15

### 5. The handoff

The demo picks up from here: what happens when a gate is rejected, and how far
the change propagates through dates, dependencies and owners before anyone sits
down to re-plan.

Then the button: **Request a walkthrough**.

---

## `/benefits` — Benefits realisation

Expands the chain link **Benefit**. Answers: how do you know the outcome
happened, after the team has gone?
Reveals the forecast curve shape. Withholds the benefit register and the
attribution logic.
**569 words.**

### 1. The question

Eyebrow: **Benefit**

Headline: **The project closed. Did the benefit arrive?**

### 2. The argument

Benefits are forecast during business case approval, which is the one moment in
a programme's life when optimism is rewarded. They are measured never, because
the team that promised them has been released by the time the benefit is due to
appear. Between those two facts sits the largest credibility gap in portfolio
governance, and everyone involved knows it is there. It is simply nobody's job
to close it once the project has closed.

It is also why the same saving gets promised by three consecutive programmes.
Nobody is lying. Each business case is written against a real problem by people
who were not in the room for the last one, and none of them can see that an
earlier programme already claimed the same money, because that earlier promise
stopped being tracked on the day its project shut down. The promise outlives
the tracking by years, and the gap is where a portfolio quietly loses its
credibility with the people funding it.

TruMandate keeps the benefit alive for 24 months past closure. It stays
attached to the exact KPI it promised to move, and it has an owner who still
holds that role rather than a project manager who has moved to another
programme. Forecast and actual sit on the same axis, on the same record, in the
units the business case used. Divergence shows up without anyone requesting a
report, which is the point, because the period when nobody is asking is
precisely the period the benefit was supposed to arrive in.

This is the least comfortable part of the platform to demonstrate and the part
that decides whether the rest of it is worth anything. A governance system that
can only report on work in flight is a schedule with a dashboard attached. The
real test is whether it can still answer a question about a programme that
finished two years ago, whose sponsor has retired and whose delivery team has
been reassigned twice. If the answer to that is a shrug, the objective tree at
the top was decoration.

### 3. The fragment

One benefit's curve. The actual runs solid to today; the forecast continues
past it as a dashed projection. The measurement window is marked and runs 24
months from closure. The two lines coincide until closure and separate after
it. The plot is cut by the frame edge.

Caption, line 1: One benefit, actual against forecast, on the axis its business
case set.

Caption, line 2: Solid to today, projected beyond it, and measured for 24
months from the day the project closed.

### 4. The AI moment

Eyebrow: **AI in the platform**

Heading: **Leakage, found in the quarter nobody was watching.**

The model watches the measure the benefit was attached to rather than the
project that promised it, so it keeps watching after the project stops
existing. When actuals pull away from forecast it says by how much, over what
period, and what it thinks caused the divergence. Then it does what it does
everywhere else here: it hands the decision to a person, names them in the
record, and leaves the forecast alone until they act. A number this
uncomfortable is worth being certain about.

The card itself reads:

> AI watch — confidence 0.69
>
> **Benefit leakage detected after closure**
>
> Benefit 4.2. Evidence: actuals have diverged from forecast by 18% in the two
> quarters since closure, and the underlying KPI stopped improving when the
> programme team was released. No owner has been notified. Suggested action:
> reassign benefit ownership and revise the forecast.
>
> [ Accept ] [ Modify ] [ Reject ]
>
> Decision logged · s.alnuaimi · 16:30

### 5. The handoff

The demo opens the benefit register: every promise made in a business case,
with its current status and the person who now owns it, in one list.

Then the button: **Request a walkthrough**.

---

## Notes for the reviewer

- **Names and usernames in the audit lines** (`h.alsuwaidi`, `m.alfarsi`,
  `s.alnuaimi`) follow the pattern the content brief already set on the home
  page (`a.almarzooqi`). Swap them if any resembles a real person at a real
  account.
- **The fragment data is invented and anonymised**, per spec §5's fidelity
  rule — the interface must match the real product, the data must not be a
  real customer's. If any of these fragments does not match what the demo
  actually shows (the KPI card's fields, the initiative list's columns, the
  benefit curve's axis), say so: the spec is explicit that a calmer, cleaner
  product on the website than in the demo is worse than no fragment.
- **"Minister" in `/strategy`'s fourth paragraph** assumes a government reader.
  If these pages are being shown to large enterprises as often as to
  government entities, that word can become "the board" or "a sponsor".
- **Nothing on these pages claims a customer, a percentage saved, or a
  timescale achieved.** The only percentages are inside product fragments and
  inside the AI cards, where they describe the sample record on screen.
