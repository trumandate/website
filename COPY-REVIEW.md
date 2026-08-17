# COPY-REVIEW.md — the three product pages, English and Arabic

Written at P6 against the briefs in `docs/trumandate-product-pages.md`. This is
the copy exactly as it renders on `/en/strategy`, `/en/execution` and
`/en/benefits`, in reading order, as plain prose. Nothing here is code and
nothing here needs a diff to change — edit this file, and the same edits go
into the three page files.

**The English below is approved with no edits.** The Arabic was written after
that approval and is in the second half of this file, under "Part two — the
Arabic", laid out the same way and in the same reading order so it can be
reviewed the same way. Both languages now live in one table
(`src/components/product/copy.ts`), so a change to either side is a change to
one file.

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

## Notes for the reviewer — English

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

---
---

# Part two — the Arabic

Written after the English above was approved with no edits, per
`trumandate-product-pages.md` ("translating unapproved copy wastes the pass")
and BUILD_FLAGS' rule that **Arabic is written, not machine-translated: keep the
argument, not the sentence structure.** None of these paragraphs is a
sentence-for-sentence mirror of its English counterpart. Each carries the same
argument, the same claims and the same numbers, restructured as Arabic prose.

This is the copy exactly as it renders on `/ar/strategy`, `/ar/execution` and
`/ar/benefits`, in reading order. Edit here, and the same edits go into
`src/components/product/copy.ts`'s `ar` branch — both languages sit in that one
table now, so the two can no longer drift apart file by file.

Two things to know while you read:

- **The curiosity ledger holds identically in Arabic.** تدرّج (cascade) and
  موزونة / بأوزانها (weighted / their weights) appear on `/ar/strategy` only
  inside the handoff sentence. تُرفض بوابة (a gate is rejected) appears on
  `/ar/execution` only inside the handoff sentence — the رفض on the AI card is
  the product's own Reject control, exactly as "Reject" is on the English page.
  سجل المنافع (the benefit register) appears on `/ar/benefits` only inside the
  handoff sentence. Grep-verified over the rendered pages, both languages.
- **Numerals follow the home page's precedent per element type**, per spec §8.
  Page prose and the AI cards use the content brief's Arabic-Indic pattern for
  reference numbers, confidence values and timestamps — the home page already
  ships درجة الثقة ٠٫٧٧, البوابة ٣ and ٠٩:٤٢. Measured quantities the brief
  itself writes with Western digits stay Western: the 24-month window is
  24 شهراً here because that is exactly how the home page's chain writes it.
  Product fragments are Western throughout, matching the stage-gate fragment.
  "TruMandate" stays Latin everywhere.

---

## `/ar/strategy` — الاستراتيجية ومؤشرات الأداء

**How the argument was restructured.** The English opens on what strategy
offices *can* do and turns on a question they cannot answer; the Arabic keeps
that turn but puts the unanswerable question in the reader's own mouth as a
direct question — اسأل المكتب نفسه أي مبادرة تُحرّك أي هدف، وبأي قدر — which is
how the point lands in Arabic without the English sentence's trailing qualifier
stack, and the closing paragraph ends on the bare opinion/baseline contrast
rather than reproducing the English's longer subordinate chain.

### 1. The question

Eyebrow: **من الهدف إلى مؤشر الأداء**

Headline: **التكليف لا يصير خطة حتى يملك أحدهم رقماً.**

### 2. The argument

معظم مكاتب الاستراتيجية قادرة على إنتاج شجرة الأهداف. تُبنى في دورة التخطيط،
ويعتمدها مسؤولون على مستوى يكفي لجعلها نافذة، وهي في الغالب عمل جيد. لكن اسأل
المكتب نفسه أي مبادرة تُحرّك أي هدف، وبأي قدر، فيصلك الجواب بعد ثلاثة أيام في
جدول جمعه أحدهم بيده، إن وصل أصلاً. الشجرة لم تكن يوماً الجزء الصعب؛ الصعب هو
مقابلتها بما يُنفَّذ فعلاً.

الانقطاع يقع عند مؤشر الأداء، وهو خلل تنظيمي قبل أن يكون خللاً تقنياً. الأهداف
يكتبها من يضعون التوجّه، أما المؤشرات فيعرّفها من سيرفعون التقارير بعد أشهر وفق
قالب جاء من جهة أخرى. المجموعتان تعملان على تقويمين مختلفين، وتستخدمان ألفاظاً
مختلفة للمقياس نفسه، ولا يرد في وصف وظيفة أحد أن يوفّق بينهما. فتبتعد شجرة
الأهداف عن إطار القياس بهدوء، ولا يكتشف أي من الطرفين ذلك إلا حين يُطرح سؤال
يحتاج إليهما معاً.

يجعل TruMandate مؤشر الأداء نقطة الوصل ذاتها، لا مخرَجاً لاحقاً. سجل المؤشر يحمل
خط أساس وقيمة مستهدفة ومالكاً بالاسم وقيمة فعلية حيّة، وهو مرتبط إلى أعلى بالهدف
الذي يخدمه، وإلى أسفل بالمبادرات المموَّلة لتحريكه. غيّر نطاق مبادرة، فيظهر الأثر
عند المؤشر الذي تغذّيه في اللحظة نفسها، لأن الرابط جزء من السجل لا ملاحظة في
مستند يتذكّر أحدهم تحديثه. وهكذا يتحوّل سؤال «أي مبادرة تُحرّك هذا الرقم» من
تحقيق إلى استعلام.

خط الأساس هو الجزء الغائب عادة، والمنصة لا تقبل مؤشراً بلا خط أساس. مقياس له
قيمة مستهدفة بلا نقطة انطلاق يخبرك أين يقف الرقم، لا ما إذا كان قد تحرّك، وهكذا
تنتهي محفظة إلى الإبلاغ باللون الأخضر عن شيء لم يحسّنه أحد. اشتراط خط الأساس عند
التعريف احتكاك صغير يزعج الناس في الأسبوع الأول، ويسدّ ثمنه أول مرة يسأل فيها
وزير عمّا تغيّر منذ نشر الخطة. الرأي لا ينجو من هذا السؤال. خط الأساس ينجو.

### 3. The fragment

One KPI record, mirrored so the readable card sits at the fragment's
inline-start (right) edge and the neighbouring card is cropped at the
inline-end (left) edge. Its labels, Western digits throughout: مؤشر · 1.2.3 /
تبنّي الخدمات الرقمية / خط الأساس 42.0 / المستهدف 75.0 / الفعلي 61.4 /
آخر 6 فترات. The cropped neighbour: مؤشر · 1.2.4 / زمن معالجة المعاملة /
خط الأساس 38.0.

Caption, line 1: سجل مؤشر واحد كما تحفظه المنصة: خط الأساس، والقيمة المستهدفة،
والقيمة الفعلية الحيّة، وآخر ست فترات.

Caption, line 2: نقطة الحالة مشتقّة من الحركة بينها. لا أحد يكتبها بيده.

### 4. The AI moment

Eyebrow: **الذكاء الاصطناعي في المنصة**

Heading: **مؤشران، ومنفعة واحدة، محسوبة مرتين.**

يقارن النموذج تعريفات المقاييس وروابط المبادرات بدل أسماء المؤشرات، فيكشف
ازدواجاً يخفيه اصطلاح تسمية مرتَّب: هدفان، وخطّا رفع تقارير، ومنفعة واحدة
تُحتسب مرتين. يذكر ما وجده، ودرجة يقينه، وما يقترح فعله. ولا شيء يصل إلى السجل
قبل أن يختار شخص، ويُحفظ الاختيار باسمه وبوقت اتخاذه. الاقتراح دليل يُبنى عليه
القرار، لا القرار نفسه.

The card itself reads:

> مراقبة ذكية — درجة الثقة ٠٫٨١
>
> **مؤشران يحتسبان المنفعة نفسها**
>
> الهدف ٢٫١ والهدف ٤٫٣. الدليل: مقياس مصدري متطابق ومجموعة مبادرات متداخلة.
> الإجراء المقترح: الدمج، أو تعليم أحدهما مقياساً مساهماً.
>
> [ قبول ] [ تعديل ] [ رفض ]
>
> القرار مسجَّل · h.alsuwaidi · ١١:٠٧

### 5. The handoff

يبدأ العرض التوضيحي من حيث تتوقف هذه الصفحة: تدرّج الأهداف يُبنى أمامك، وثيقة
إطار وطني تدخل من أعلاه وأهداف موزونة بأوزانها تخرج من أسفله، في نحو عشر دقائق.

Then the button: **اطلب عرضاً توضيحياً**.

---

## `/ar/execution` — التنفيذ والحوكمة

**How the argument was restructured.** The English builds by accumulation —
tool, then roll-up, then platform, then meeting. The Arabic keeps that four-beat
order but front-loads each paragraph's verdict and lets the detail follow it,
which is the natural shape of this argument in Arabic; the third paragraph's
three platform claims (baseline and actual on every milestone, a named person on
every gate decision, roll-up as a query) run as parallel clauses rather than as
the English's three separate sentences.

### 1. The question

Eyebrow: **من المبادرة إلى المعلم**

Headline: **بيانات التنفيذ التي لا تصل إلى مَن مَوّل العمل مجرد أوراق.**

### 2. The argument

أدوات إدارة المشاريع جيدة في إدارة المشاريع، وهي في الوقت نفسه عاجزة بنيوياً عن
الصعود إلى مستوى التكليف، لأن التكليف غير موجود بداخلها. الجدول الزمني يعرف
مهامه وتبعياته ومساره الحرج، ولا يعرف أي هدف اشتراه، ولا ما وعد به ذلك الهدف في
المقابل، ولا أي مبادرة أخرى تزاحمه على الأشخاص الثلاثة أنفسهم. لا شيء من ذلك عيب
في الأداة؛ إنه سؤال لم يُطرح عليها قط.

فيتحوّل التجميع إلى تمرين بشري شهري. أحدهم يطلب الحالة من كل مسؤول تنفيذ، وآخر
يعيد كتابة الردود في قالب. وفي الطريق يُقرَّب كل رقم برفق نحو الجواب الذي
يفضّله كاتبه، لأن من يكتبه هو نفسه من سيُسأل عنه. وحين يصل التقرير إلى اللجنة
التوجيهية يكون قديماً ومتفاوَضاً عليه في آن واحد، وتبني اللجنة قرارات التمويل
عليه رغم ذلك، لأنه النسخة الوحيدة الموجودة.

يحفظ TruMandate المبادرات مقابل الهدف الذي مَوّلها. كل معلم يحمل تاريخ خط أساس
وتاريخاً فعلياً، فيصير التأخير عملية طرح لا حكماً شخصياً، ويظهر يوم وقوعه لا في
نهاية شهر التقارير. وكل قرار عند بوابة مرحلة مسجَّل باسم شخص وبتاريخ، ويبقى
ملتصقاً بالسجل بعد انتقال ذلك الشخص إلى موقع آخر. ولأن التجميع استعلام لا عملية
جمع، يتوقف تقرير اللجنة عن كونه شيئاً يُركَّب — فهو لم يُفكَّك أصلاً.

وما يتغيّر عملياً هو الاجتماع نفسه. لجنة تثق بالأرقام تنفق ساعتها على المبادرات
المتعثّرة، بدل أن تنفقها في التأكد من أن البقية بخير على العموم. وحين يكون رقم
خاطئاً، يكون خطؤه من نوع يقود إلى سجل وتاريخ وشخص يمكن سؤاله، وهذا صنف مختلف
تماماً عن رقم لا يعرف أحد مصدره. الحوكمة في جوهرها هي القدرة على طرح ذلك السؤال
الثاني والحصول على جواب في اليوم نفسه.

### 3. The fragment

Three initiative rows, mirrored so the columns run المبادرة / الحالة / التقدّم
from the inline-start (right) edge, with each progress bar filling from that
same edge. The three readable rows: بوابة الخدمات الموحّدة — الهدف 1.2 — 74% /
رقمنة السجلات — الهدف 1.2 — 41% / إيقاف الأنظمة القديمة — الهدف 3.1 — 18%. The
fourth row, cut by the frame edge: إطلاق الهوية المشتركة — الهدف 2.4 — 66%.

Caption, line 1: ثلاث مبادرات كما تسردها شاشة المحفظة، كل واحدة مقابل الهدف
الذي مَوّلها.

Caption, line 2: التقدّم مقروء من خطوط الأساس والقيم الفعلية للمعالم، فلم يحتج
الصف الأحمر إلى تقرير استثناء منفصل.

### 4. The AI moment

Eyebrow: **الذكاء الاصطناعي في المنصة**

Heading: **تبعية معرَّضة للخطر لم يرفعها أي من المالكَين.**

هذا الاقتراح خرج من سجلَّين لم يكن لأحد سبب لمقارنتهما: تاريخ تحرّك في مبادرة،
وشرط بدء في مبادرة أخرى يشير إليه. إدارتان مختلفتان، وخطّا رفع تقارير مختلفان،
ولا اجتماع مشترك في تقويم أحد. يقرأ النموذج الرابط ويضع الخطر أمام شخص بينما
يبقى أسبوع للتصرّف، ومعه دليله. ويقرر ذلك الشخص إن كان الخطر حقيقياً، فيصير
قراره جزءاً من السجل بدل أن يكون ملاحظة عابرة في اجتماع.

The card itself reads:

> مراقبة ذكية — درجة الثقة ٠٫٧٤
>
> **تبعية بين إدارتين معرَّضة للخطر**
>
> المبادرة ٠٧ والمبادرة ٢١، في إدارتين مختلفتين. الدليل: تأخّرت البوابة ٣ في
> إحداهما، وشرط بدء الأخرى يشير إليها. الإجراء المقترح: رفع علامة تبعية بين
> الإدارتين قبل اجتماع اللجنة التوجيهية.
>
> [ قبول ] [ تعديل ] [ رفض ]
>
> القرار مسجَّل · m.alfarsi · ٠٨:١٥

### 5. The handoff

من هنا يكمل العرض التوضيحي: ماذا يحدث حين تُرفض بوابة، وإلى أي مدى ينتشر التغيير
عبر التواريخ والتبعيات والمالكين قبل أن يجلس أحد لإعادة التخطيط.

Then the button: **اطلب عرضاً توضيحياً**.

---

## `/ar/benefits` — تحقيق المنافع

**How the argument was restructured.** The English states the credibility gap
and then explains it; the Arabic states it and then narrates it. The second
paragraph reads as a short account of how three programmes come to promise the
same saving, rather than as the English's explanatory clause chain, and the
fourth paragraph's test — can it still answer a question about a programme that
closed two years ago — is posed as a condition with its consequence, which is
where the "decoration" line falls naturally in Arabic.

### 1. The question

Eyebrow: **المنفعة**

Headline: **أُغلق المشروع. فهل وصلت المنفعة؟**

### 2. The argument

تُتوقَّع المنافع أثناء اعتماد دراسة الجدوى، وهي اللحظة الوحيدة في عمر البرنامج
التي يُكافأ فيها التفاؤل. ولا تُقاس أبداً، لأن الفريق الذي وعد بها يكون قد
سُرِّح قبل موعد ظهورها. بين هاتين الحقيقتين تقع أكبر فجوة مصداقية في حوكمة
المحافظ، ويعرف كل معنيٍّ بها أنها هناك. لكنها ببساطة ليست مسؤولية أحد بعد أن
يُغلق المشروع.

ولهذا السبب نفسه تَعِد ثلاثة برامج متعاقبة بالوفر ذاته. لا أحد يكذب هنا. كل
دراسة جدوى تُكتب في مواجهة مشكلة حقيقية، بأيدي أشخاص لم يكونوا في الغرفة في
المرة السابقة، ولا يستطيع أي منهم أن يرى أن برنامجاً أسبق طالب بالمال نفسه، لأن
ذلك الوعد الأسبق توقف تتبّعه يوم أُغلق مشروعه. الوعد يعمّر سنوات بعد أن يتوقف
تتبّعه، وفي هذه الفجوة تفقد المحفظة مصداقيتها بهدوء أمام من يموّلونها.

يُبقي TruMandate المنفعة حيّة 24 شهراً بعد الإغلاق. تبقى مرتبطة بالمؤشر ذاته
الذي وُعدت بتحريكه، ولها مالك ما زال يشغل ذلك الدور، لا مدير مشروع انتقل إلى
برنامج آخر. القيمة المتوقَّعة والقيمة الفعلية على المحور نفسه، وفي السجل نفسه،
وبالوحدات التي استخدمتها دراسة الجدوى. ويظهر التباعد بينهما دون أن يطلب أحد
تقريراً، وهذا هو المقصود: الفترة التي لا يسأل فيها أحد هي بالضبط الفترة التي كان
يُفترض أن تصل فيها المنفعة.

هذا أقل أجزاء المنصة راحة في العرض، وهو الجزء الذي يقرّر إن كان ما تبقّى منها
يساوي شيئاً. نظام حوكمة لا يحسن الإخبار إلا عن عمل جارٍ هو جدول زمني عُلِّقت
عليه لوحة مؤشرات. الاختبار الحقيقي أن يظل قادراً على الإجابة عن سؤال يخص
برنامجاً انتهى قبل عامين، تقاعد راعيه وأُعيد توزيع فريق تنفيذه مرتين. فإن كان
الجواب هزّة كتف، فشجرة الأهداف في الأعلى كانت زينة.

### 3. The fragment

One benefit's curve, mirrored — which means the time axis runs right to left,
so the curve begins at the inline-start (right) edge and the projection is cut
at the inline-end (left) edge. Its four labels: المنفعة 4.2 · وفر تشغيلي سنوي /
نافذة القياس · 24 شهراً / اليوم / and the two-item legend الفعلي and المتوقَّع.

Caption, line 1: منفعة واحدة، الفعلي مقابل المتوقَّع، على المحور الذي حدّدته
دراسة جدواها.

Caption, line 2: خط متصل حتى اليوم، وامتداد متوقَّع بعده، وقياس يمتد 24 شهراً
من يوم إغلاق المشروع.

### 4. The AI moment

Eyebrow: **الذكاء الاصطناعي في المنصة**

Heading: **تسرّب منفعة، ظهر في الربع الذي لم يراقبه أحد.**

يراقب النموذج المقياس الذي رُبطت به المنفعة، لا المشروع الذي وعد بها، فيستمر في
المراقبة بعد أن يتوقف المشروع عن الوجود. وحين تبتعد القيم الفعلية عن المتوقَّعة
يذكر مقدار الابتعاد، وعلى أي مدة، وما يرجّح أنه سببه. ثم يفعل ما يفعله في كل
موضع آخر هنا: يسلّم القرار إلى شخص، ويثبّت اسمه في السجل، ويترك التوقّع كما هو
حتى يتصرّف. رقم بهذا القدر من الإزعاج يستحق أن يكون المرء واثقاً منه.

The card itself reads:

> مراقبة ذكية — درجة الثقة ٠٫٦٩
>
> **تسرّب منفعة بعد الإغلاق**
>
> المنفعة ٤٫٢. الدليل: ابتعدت القيم الفعلية عن المتوقَّعة بنسبة ١٨٪ خلال
> الربعين التاليين للإغلاق، وتوقّف المؤشر الأساسي عن التحسّن حين سُرِّح فريق
> البرنامج. ولم يُبلَّغ أي مالك. الإجراء المقترح: إعادة إسناد ملكية المنفعة
> ومراجعة القيمة المتوقَّعة.
>
> [ قبول ] [ تعديل ] [ رفض ]
>
> القرار مسجَّل · s.alnuaimi · ١٦:٣٠

### 5. The handoff

يفتح العرض التوضيحي سجل المنافع: كل وعد قُطع في دراسة جدوى، وحالته اليوم، ومن
يملكه الآن، في قائمة واحدة.

Then the button: **اطلب عرضاً توضيحياً**.

---

## Notes for the reviewer — Arabic

- **Vocabulary choices worth a second opinion, in the order they matter.**
  نقطة الوصل for "the join". تدرّج الأهداف for "the cascade" — the more literal
  شجرة الاشتقاق collides with شجرة الأهداف, which the same page already uses
  for the objective tree. تحقيق المنافع for "benefits realisation" (page
  title). تسرّب المنفعة for "benefit leakage". المستهدف rather than الهدف for a
  KPI's target, because الهدف is already the objective and the two sit in the
  same sentence more than once. If your government readers use a different
  house term for any of these, each is a one-line change in `copy.ts`.
- **وزير ("a minister") in `/ar/strategy`'s fourth paragraph** carries the same
  assumption its English counterpart does, and can become مجلس الإدارة or
  الجهة الراعية if these pages go to large enterprises as often as to
  government entities. Same note as the English.
- **The chain-link eyebrows use words, not an arrow** — من الهدف إلى مؤشر
  الأداء rather than a mirrored `→`. The arrow characters are in Unicode's
  mirroring set, so a `→` typed into the source is re-drawn as `←` by the
  shaping engine under RTL and stops being a reliable statement about which way
  the chain runs. The preposition pair says it once and cannot be flipped.
- **The fragments' display names are invented and anonymised**, the same as the
  English ones, and the same side-by-side check against the real product is
  owed (TODO.md). The audit-line usernames (`h.alsuwaidi`, `m.alfarsi`,
  `s.alnuaimi`) stay Latin in Arabic because they are system handles — the
  content brief keeps `a.almarzooqi` Latin on the Arabic home page for exactly
  that reason. A display name in a UI list is localised instead, which is what
  the stage-gate fragment does with ر. الهاشمي.
- **Nothing in the Arabic claims a customer, a percentage saved or a timescale
  achieved**, and no banned word from the English list has been let in through
  an Arabic calque — no سلس, no تمكين, no رؤى, no مصدر واحد للحقيقة, no
  شامل/متكامل, no مدعوم بالذكاء الاصطناعي. Grep-checked over the rendered
  pages.
- **Word counts run 12–20% below the English** on every page — `/strategy` 517
  against 618, `/execution` 526 against 633, `/benefits` 549 against 628,
  counting all prose including the fragments' aria-labels. That is Arabic
  morphology, not lost content: all nineteen content slots per page are present
  in both languages and the claims were checked one by one. Arabic carrying
  fewer words is fine. Arabic carrying less is not, and it does not.
