import type { Language } from "../../i18n/types";

/**
 * The shape of one product page's copy, and the bilingual table that holds all
 * three pages in both languages (P6 → P6-AR).
 *
 * Why this is a plain TS table and NOT a branch of `i18n/ui.ts`: that tree is
 * consumed through `useTranslations`, whose `KeyPath<T>` type walks every
 * property and whose `t()` returns `string`. `ProductPageCopy` carries a
 * `string[]` (the argument paragraphs) and a `number` (the confidence value
 * that drives the bar's width), neither of which `t()` can return and both of
 * which would make `KeyPath` recurse into array and number prototypes. So the
 * page-level copy keeps its own typed home here, next to the component that
 * consumes it, while the three fragments' short label strings — which really
 * are all strings — live in `i18n/ui.ts` under `fragment` and reach the SVGs
 * through `t()` exactly as `home.stageGate.*` already does.
 *
 * What matters structurally is the same thing `UiStrings` gives the chrome:
 * `Record<Language, …>` means an Arabic value cannot be missing for an English
 * one that exists. CLAUDE.md's "Arabic never carries less content than
 * English" is therefore a compile error rather than a review note.
 *
 * The English is COPY-REVIEW.md's approved text, moved here verbatim from the
 * three `/en/*.astro` frontmatters — not one word of it changed in the move.
 * The Arabic is written, not machine-translated (BUILD_FLAGS: "keep the
 * argument, not the sentence structure"): each page's argument is restructured
 * as Arabic prose of equivalent completeness, and the plain-prose version for
 * review is appended to COPY-REVIEW.md.
 */

/**
 * Spec §4's three-part AI moment: the signal (a fact with a number), the
 * evidence and confidence (as a value), then the gate plus an audit line
 * naming a person and a time. Identical shape on all three pages — the
 * pattern repeating is the point.
 */
export interface ProductAiMoment {
  /** Section eyebrow. */
  eyebrow: string;
  /** Section h2 — names this page's specific signal, not "AI" in general. */
  heading: string;
  /** Prose explaining what the model did and where the decision sits. */
  body: string;
  /** Card badge, e.g. "AI watch". */
  badge: string;
  /** Card's confidence label as displayed, e.g. "confidence 0.81". */
  confidenceLabel: string;
  /** 0–1. Drives the confidence bar's own width (motion #4). Must agree with
   * the number written into `confidenceLabel`. */
  confidence: number;
  /** Card title — the signal. */
  title: string;
  /** Card detail — evidence and suggested action. */
  detail: string;
  /** Audit line: a name and a timestamp. */
  log: string;
}

export interface ProductPageCopy {
  /** Part 1: eyebrow naming the chain link this page expands. */
  eyebrow: string;
  /** Part 1: the buyer's actual question, not a feature announcement. */
  headline: string;
  /** Part 2: three to four paragraphs. No bullets, no cards. */
  argument: string[];
  /** Part 3, line 1 of the fragment's two-line caption. */
  captionLead: string;
  /** Part 3, line 2 of the fragment's two-line caption. */
  captionSecond: string;
  /** Part 4. */
  ai: ProductAiMoment;
  /**
   * Part 5: ONE sentence naming what the demo shows that this page did not.
   * This is the only place on the page where the curiosity ledger's withheld
   * item may be named — it is promised here and nowhere else.
   */
  handoff: string;
  /** <title>. */
  documentTitle: string;
  /** <meta name="description">. */
  documentDescription: string;
}

export type ProductPageKey = "strategy" | "execution" | "benefits";

export const productCopy: Record<
  Language,
  Record<ProductPageKey, ProductPageCopy>
> = {
  en: {
    strategy: {
      eyebrow: "Objective → KPI",
      headline: "A mandate is not a plan until someone owns a number.",
      argument: [
        "Most strategy offices can produce the objective tree. It gets built during the planning cycle, it is signed off by people senior enough to make it stick, and it is usually good work. Ask the same office which initiative moves which objective, and by how much, and the answer arrives three days later as a spreadsheet somebody assembled by hand — if it arrives at all. The tree was never the hard part. Holding it against what is actually being delivered is.",
        "The break happens at the KPI, and it is an organisational problem before it is a technical one. Objectives are written by the people who set direction. KPIs are defined by the people who have to report, months later, against a template that came from somewhere else. The two groups work to different calendars, use different words for the same measure, and nobody's job description includes reconciling them. So the objective tree and the measurement framework drift apart quietly, and neither side finds out until someone asks a question that needs both at once.",
        "TruMandate makes the KPI the join rather than a downstream artefact. A KPI record carries a baseline, a target, a named owner and a live actual, and it is attached upward to the objective it serves and downward to the initiatives funded to move it. Rescope an initiative and the KPI it feeds is already the place the consequence shows, because the link is part of the record rather than a note in a document somebody has to remember to update. Which initiative moves a given number becomes a lookup instead of an investigation.",
        "The baseline is the part that is usually missing, and the platform will not accept a KPI without one. A measure with a target and no starting point can tell you where the number sits but not whether it moved, which is how a portfolio ends up reporting green against something nobody has improved. Requiring the baseline at definition time is a small piece of friction that irritates people in the first week and pays for itself the first time a minister asks what has changed since the plan was published. An opinion cannot survive that question. A baseline can.",
      ],
      captionLead:
        "One KPI record as the platform stores it: baseline, target, live actual, and the last six periods.",
      captionSecond:
        "The status dot is derived from the movement between them. Nobody types it in.",
      ai: {
        eyebrow: "AI in the platform",
        heading: "Two KPIs, one benefit, counted twice.",
        body: "The model compares measure definitions and initiative links rather than KPI names, so it finds duplication that a tidy naming convention hides — two objectives, two reporting lines, one underlying benefit counted twice. It states what it found, how sure it is, and what it would do about it. Nothing reaches the record until a person chooses, and the choice is stored with their name and the time they made it. The suggestion is evidence for a decision, not the decision.",
        badge: "AI watch",
        confidenceLabel: "confidence 0.81",
        confidence: 0.81,
        title: "Two KPIs counting the same benefit",
        detail:
          "Objective 2.1 and Objective 4.3. Evidence: identical source measure and an overlapping initiative set. Suggested action: merge, or mark one as a contributing measure.",
        log: "Decision logged · h.alsuwaidi · 11:07",
      },
      handoff:
        "The demo starts where this page stops: the cascade being built in front of you, a national framework document in at the top and weighted objectives out at the bottom, in about ten minutes.",
      documentTitle: "Strategy and KPIs — TruMandate",
      documentDescription:
        "How a mandate becomes a number someone owns: objectives joined to KPIs that carry a baseline, a target, an owner and a live actual.",
    },

    execution: {
      eyebrow: "Initiative → Milestone",
      headline:
        "Delivery data that never reaches the funder is just paperwork.",
      argument: [
        "Project tools are good at managing projects. They are also structurally incapable of rolling up to a mandate, because the mandate does not exist inside them. A schedule knows its own tasks, its own dependencies and its own critical path. It does not know which objective bought it, what that objective promised in return, or which other initiative is competing for the same three people. None of that is a defect in the tool. It is a question the tool was never asked.",
        "So the roll-up becomes a monthly human exercise. Someone requests status from every delivery lead. Someone else retypes the replies into a template. On the way through, each number is rounded gently toward the answer its author would rather give, because the person typing it is also the person who will be asked about it. By the time the pack reaches the steering committee it is both stale and negotiated, and the committee makes funding decisions on it anyway, because it is the only version that exists.",
        "TruMandate holds initiatives against the objective that funded them. Every milestone carries a baseline date and an actual date, so slip is a subtraction rather than a judgement call, and it shows up on the day it happens instead of at the end of the reporting month. Every stage gate decision is recorded against a named person with a date, and it stays attached to the record after that person has moved on. Because the roll-up is a query rather than a collection exercise, the steering pack stops being assembled — it was never disassembled in the first place.",
        "What changes in practice is the meeting. A committee that trusts the numbers spends its hour on the initiatives in trouble instead of spending it confirming that the rest are broadly fine. And when a number is wrong, it is wrong in a way that leads back to a record, a date and a person who can be asked about it, which is a different class of problem from a number nobody can source. Governance is mostly the ability to ask that second question and get an answer the same day.",
      ],
      captionLead:
        "Three initiatives as the portfolio view lists them, each against the objective that funded it.",
      captionSecond:
        "Progress is read from milestone baselines and actuals, so the red row needed no separate exception report.",
      ai: {
        eyebrow: "AI in the platform",
        heading: "A dependency at risk that neither owner has raised.",
        body: "This one comes out of two records no person had a reason to compare: a date that moved on one initiative, and a start condition on another that points at it. Different departments, different reporting lines, no shared meeting in anyone's calendar. The model reads the link and puts the risk in front of someone while there is still a week to act on it, with its evidence attached. A person decides whether it is real, and that decision becomes part of the record rather than a remark in a meeting.",
        badge: "AI watch",
        confidenceLabel: "confidence 0.74",
        confidence: 0.74,
        title: "Cross-department dependency at risk",
        detail:
          "Initiative 07 and Initiative 21, different departments. Evidence: gate 3 slipped on one, and the other's start condition references it. Suggested action: raise a cross-department dependency flag before the steering meeting.",
        log: "Decision logged · m.alfarsi · 08:15",
      },
      handoff:
        "The demo picks up from here: what happens when a gate is rejected, and how far the change propagates through dates, dependencies and owners before anyone sits down to re-plan.",
      documentTitle: "Execution and governance — TruMandate",
      documentDescription:
        "How delivery reality reaches the office that funded it: initiatives held against the objective that paid for them, with baseline and actual on every milestone.",
    },

    benefits: {
      eyebrow: "Benefit",
      headline: "The project closed. Did the benefit arrive?",
      argument: [
        "Benefits are forecast during business case approval, which is the one moment in a programme's life when optimism is rewarded. They are measured never, because the team that promised them has been released by the time the benefit is due to appear. Between those two facts sits the largest credibility gap in portfolio governance, and everyone involved knows it is there. It is simply nobody's job to close it once the project has closed.",
        "It is also why the same saving gets promised by three consecutive programmes. Nobody is lying. Each business case is written against a real problem by people who were not in the room for the last one, and none of them can see that an earlier programme already claimed the same money, because that earlier promise stopped being tracked on the day its project shut down. The promise outlives the tracking by years, and the gap is where a portfolio quietly loses its credibility with the people funding it.",
        "TruMandate keeps the benefit alive for 24 months past closure. It stays attached to the exact KPI it promised to move, and it has an owner who still holds that role rather than a project manager who has moved to another programme. Forecast and actual sit on the same axis, on the same record, in the units the business case used. Divergence shows up without anyone requesting a report, which is the point, because the period when nobody is asking is precisely the period the benefit was supposed to arrive in.",
        "This is the least comfortable part of the platform to demonstrate and the part that decides whether the rest of it is worth anything. A governance system that can only report on work in flight is a schedule with a dashboard attached. The real test is whether it can still answer a question about a programme that finished two years ago, whose sponsor has retired and whose delivery team has been reassigned twice. If the answer to that is a shrug, the objective tree at the top was decoration.",
      ],
      captionLead:
        "One benefit, actual against forecast, on the axis its business case set.",
      captionSecond:
        "Solid to today, projected beyond it, and measured for 24 months from the day the project closed.",
      ai: {
        eyebrow: "AI in the platform",
        heading: "Leakage, found in the quarter nobody was watching.",
        body: "The model watches the measure the benefit was attached to rather than the project that promised it, so it keeps watching after the project stops existing. When actuals pull away from forecast it says by how much, over what period, and what it thinks caused the divergence. Then it does what it does everywhere else here: it hands the decision to a person, names them in the record, and leaves the forecast alone until they act. A number this uncomfortable is worth being certain about.",
        badge: "AI watch",
        confidenceLabel: "confidence 0.69",
        confidence: 0.69,
        title: "Benefit leakage detected after closure",
        detail:
          "Benefit 4.2. Evidence: actuals have diverged from forecast by 18% in the two quarters since closure, and the underlying KPI stopped improving when the programme team was released. No owner has been notified. Suggested action: reassign benefit ownership and revise the forecast.",
        log: "Decision logged · s.alnuaimi · 16:30",
      },
      handoff:
        "The demo opens the benefit register: every promise made in a business case, with its current status and the person who now owns it, in one list.",
      documentTitle: "Benefits realisation — TruMandate",
      documentDescription:
        "How you know the outcome happened after the team has gone: benefits kept alive for 24 months past closure, against the exact KPI they promised to move.",
    },
  },

  // ---------------------------------------------------------------------------
  // Arabic. Written against the approved English argument, not translated from
  // its sentences (BUILD_FLAGS). Numerals follow spec §8 as the home page
  // already applies it: page prose and the AI card use the content brief's
  // Arabic-Indic pattern for reference numbers, confidence values and
  // timestamps (home `ai.confidence` ٠٫٧٧, `ai.detail` البوابة ٣, `ai.log`
  // ٠٩:٤٢); measured quantities that the brief itself writes Western stay
  // Western (home `chain.benefitBody` "24 شهراً" — the same 24-month window
  // this page's third paragraph and caption carry). Product fragment labels
  // are Western throughout, matching StageGateQueue.astro.
  //
  // The chain-link eyebrows drop the "→" and name the relation in words
  // ("من الهدف إلى مؤشر الأداء"). U+2192 has Bidi_Mirrored=Yes, so an arrow
  // authored in either direction is re-mirrored by the shaping engine under
  // RTL and stops being a reliable statement about which way the chain runs;
  // the preposition pair says it unambiguously and reads as Arabic rather
  // than as a translated diagram label.
  // ---------------------------------------------------------------------------
  ar: {
    strategy: {
      eyebrow: "من الهدف إلى مؤشر الأداء",
      headline: "التكليف لا يصير خطة حتى يملك أحدهم رقماً.",
      argument: [
        "معظم مكاتب الاستراتيجية قادرة على إنتاج شجرة الأهداف. تُبنى في دورة التخطيط، ويعتمدها مسؤولون على مستوى يكفي لجعلها نافذة، وهي في الغالب عمل جيد. لكن اسأل المكتب نفسه أي مبادرة تُحرّك أي هدف، وبأي قدر، فيصلك الجواب بعد ثلاثة أيام في جدول جمعه أحدهم بيده، إن وصل أصلاً. الشجرة لم تكن يوماً الجزء الصعب؛ الصعب هو مقابلتها بما يُنفَّذ فعلاً.",
        "الانقطاع يقع عند مؤشر الأداء، وهو خلل تنظيمي قبل أن يكون خللاً تقنياً. الأهداف يكتبها من يضعون التوجّه، أما المؤشرات فيعرّفها من سيرفعون التقارير بعد أشهر وفق قالب جاء من جهة أخرى. المجموعتان تعملان على تقويمين مختلفين، وتستخدمان ألفاظاً مختلفة للمقياس نفسه، ولا يرد في وصف وظيفة أحد أن يوفّق بينهما. فتبتعد شجرة الأهداف عن إطار القياس بهدوء، ولا يكتشف أي من الطرفين ذلك إلا حين يُطرح سؤال يحتاج إليهما معاً.",
        "يجعل TruMandate مؤشر الأداء نقطة الوصل ذاتها، لا مخرَجاً لاحقاً. سجل المؤشر يحمل خط أساس وقيمة مستهدفة ومالكاً بالاسم وقيمة فعلية حيّة، وهو مرتبط إلى أعلى بالهدف الذي يخدمه، وإلى أسفل بالمبادرات المموَّلة لتحريكه. غيّر نطاق مبادرة، فيظهر الأثر عند المؤشر الذي تغذّيه في اللحظة نفسها، لأن الرابط جزء من السجل لا ملاحظة في مستند يتذكّر أحدهم تحديثه. وهكذا يتحوّل سؤال «أي مبادرة تُحرّك هذا الرقم» من تحقيق إلى استعلام.",
        "خط الأساس هو الجزء الغائب عادة، والمنصة لا تقبل مؤشراً بلا خط أساس. مقياس له قيمة مستهدفة بلا نقطة انطلاق يخبرك أين يقف الرقم، لا ما إذا كان قد تحرّك، وهكذا تنتهي محفظة إلى الإبلاغ باللون الأخضر عن شيء لم يحسّنه أحد. اشتراط خط الأساس عند التعريف احتكاك صغير يزعج الناس في الأسبوع الأول، ويسدّ ثمنه أول مرة يسأل فيها وزير عمّا تغيّر منذ نشر الخطة. الرأي لا ينجو من هذا السؤال. خط الأساس ينجو.",
      ],
      captionLead:
        "سجل مؤشر واحد كما تحفظه المنصة: خط الأساس، والقيمة المستهدفة، والقيمة الفعلية الحيّة، وآخر ست فترات.",
      captionSecond: "نقطة الحالة مشتقّة من الحركة بينها. لا أحد يكتبها بيده.",
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "مؤشران، ومنفعة واحدة، محسوبة مرتين.",
        body: "يقارن النموذج تعريفات المقاييس وروابط المبادرات بدل أسماء المؤشرات، فيكشف ازدواجاً يخفيه اصطلاح تسمية مرتَّب: هدفان، وخطّا رفع تقارير، ومنفعة واحدة تُحتسب مرتين. يذكر ما وجده، ودرجة يقينه، وما يقترح فعله. ولا شيء يصل إلى السجل قبل أن يختار شخص، ويُحفظ الاختيار باسمه وبوقت اتخاذه. الاقتراح دليل يُبنى عليه القرار، لا القرار نفسه.",
        badge: "مراقبة ذكية",
        confidenceLabel: "درجة الثقة ٠٫٨١",
        confidence: 0.81,
        title: "مؤشران يحتسبان المنفعة نفسها",
        detail:
          "الهدف ٢٫١ والهدف ٤٫٣. الدليل: مقياس مصدري متطابق ومجموعة مبادرات متداخلة. الإجراء المقترح: الدمج، أو تعليم أحدهما مقياساً مساهماً.",
        log: "القرار مسجَّل · h.alsuwaidi · ١١:٠٧",
      },
      handoff:
        "يبدأ العرض التوضيحي من حيث تتوقف هذه الصفحة: تدرّج الأهداف يُبنى أمامك، وثيقة إطار وطني تدخل من أعلاه وأهداف موزونة بأوزانها تخرج من أسفله، في نحو عشر دقائق.",
      documentTitle: "الاستراتيجية ومؤشرات الأداء — TruMandate",
      documentDescription:
        "كيف يصير التكليف رقماً يملكه شخص: أهداف موصولة بمؤشرات تحمل خط أساس وقيمة مستهدفة ومالكاً وقيمة فعلية حيّة.",
    },

    execution: {
      eyebrow: "من المبادرة إلى المعلم",
      headline: "بيانات التنفيذ التي لا تصل إلى مَن مَوّل العمل مجرد أوراق.",
      argument: [
        "أدوات إدارة المشاريع جيدة في إدارة المشاريع، وهي في الوقت نفسه عاجزة بنيوياً عن الصعود إلى مستوى التكليف، لأن التكليف غير موجود بداخلها. الجدول الزمني يعرف مهامه وتبعياته ومساره الحرج، ولا يعرف أي هدف اشتراه، ولا ما وعد به ذلك الهدف في المقابل، ولا أي مبادرة أخرى تزاحمه على الأشخاص الثلاثة أنفسهم. لا شيء من ذلك عيب في الأداة؛ إنه سؤال لم يُطرح عليها قط.",
        "فيتحوّل التجميع إلى تمرين بشري شهري. أحدهم يطلب الحالة من كل مسؤول تنفيذ، وآخر يعيد كتابة الردود في قالب. وفي الطريق يُقرَّب كل رقم برفق نحو الجواب الذي يفضّله كاتبه، لأن من يكتبه هو نفسه من سيُسأل عنه. وحين يصل التقرير إلى اللجنة التوجيهية يكون قديماً ومتفاوَضاً عليه في آن واحد، وتبني اللجنة قرارات التمويل عليه رغم ذلك، لأنه النسخة الوحيدة الموجودة.",
        "يحفظ TruMandate المبادرات مقابل الهدف الذي مَوّلها. كل معلم يحمل تاريخ خط أساس وتاريخاً فعلياً، فيصير التأخير عملية طرح لا حكماً شخصياً، ويظهر يوم وقوعه لا في نهاية شهر التقارير. وكل قرار عند بوابة مرحلة مسجَّل باسم شخص وبتاريخ، ويبقى ملتصقاً بالسجل بعد انتقال ذلك الشخص إلى موقع آخر. ولأن التجميع استعلام لا عملية جمع، يتوقف تقرير اللجنة عن كونه شيئاً يُركَّب — فهو لم يُفكَّك أصلاً.",
        "وما يتغيّر عملياً هو الاجتماع نفسه. لجنة تثق بالأرقام تنفق ساعتها على المبادرات المتعثّرة، بدل أن تنفقها في التأكد من أن البقية بخير على العموم. وحين يكون رقم خاطئاً، يكون خطؤه من نوع يقود إلى سجل وتاريخ وشخص يمكن سؤاله، وهذا صنف مختلف تماماً عن رقم لا يعرف أحد مصدره. الحوكمة في جوهرها هي القدرة على طرح ذلك السؤال الثاني والحصول على جواب في اليوم نفسه.",
      ],
      captionLead:
        "ثلاث مبادرات كما تسردها شاشة المحفظة، كل واحدة مقابل الهدف الذي مَوّلها.",
      captionSecond:
        "التقدّم مقروء من خطوط الأساس والقيم الفعلية للمعالم، فلم يحتج الصف الأحمر إلى تقرير استثناء منفصل.",
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "تبعية معرَّضة للخطر لم يرفعها أي من المالكَين.",
        body: "هذا الاقتراح خرج من سجلَّين لم يكن لأحد سبب لمقارنتهما: تاريخ تحرّك في مبادرة، وشرط بدء في مبادرة أخرى يشير إليه. إدارتان مختلفتان، وخطّا رفع تقارير مختلفان، ولا اجتماع مشترك في تقويم أحد. يقرأ النموذج الرابط ويضع الخطر أمام شخص بينما يبقى أسبوع للتصرّف، ومعه دليله. ويقرر ذلك الشخص إن كان الخطر حقيقياً، فيصير قراره جزءاً من السجل بدل أن يكون ملاحظة عابرة في اجتماع.",
        badge: "مراقبة ذكية",
        confidenceLabel: "درجة الثقة ٠٫٧٤",
        confidence: 0.74,
        title: "تبعية بين إدارتين معرَّضة للخطر",
        detail:
          "المبادرة ٠٧ والمبادرة ٢١، في إدارتين مختلفتين. الدليل: تأخّرت البوابة ٣ في إحداهما، وشرط بدء الأخرى يشير إليها. الإجراء المقترح: رفع علامة تبعية بين الإدارتين قبل اجتماع اللجنة التوجيهية.",
        log: "القرار مسجَّل · m.alfarsi · ٠٨:١٥",
      },
      handoff:
        "من هنا يكمل العرض التوضيحي: ماذا يحدث حين تُرفض بوابة، وإلى أي مدى ينتشر التغيير عبر التواريخ والتبعيات والمالكين قبل أن يجلس أحد لإعادة التخطيط.",
      documentTitle: "التنفيذ والحوكمة — TruMandate",
      documentDescription:
        "كيف يصل واقع التنفيذ إلى المكتب الذي مَوّله: مبادرات محفوظة مقابل الهدف الذي دفع ثمنها، وخط أساس وقيمة فعلية على كل معلم.",
    },

    benefits: {
      eyebrow: "المنفعة",
      headline: "أُغلق المشروع. فهل وصلت المنفعة؟",
      argument: [
        "تُتوقَّع المنافع أثناء اعتماد دراسة الجدوى، وهي اللحظة الوحيدة في عمر البرنامج التي يُكافأ فيها التفاؤل. ولا تُقاس أبداً، لأن الفريق الذي وعد بها يكون قد سُرِّح قبل موعد ظهورها. بين هاتين الحقيقتين تقع أكبر فجوة مصداقية في حوكمة المحافظ، ويعرف كل معنيٍّ بها أنها هناك. لكنها ببساطة ليست مسؤولية أحد بعد أن يُغلق المشروع.",
        "ولهذا السبب نفسه تَعِد ثلاثة برامج متعاقبة بالوفر ذاته. لا أحد يكذب هنا. كل دراسة جدوى تُكتب في مواجهة مشكلة حقيقية، بأيدي أشخاص لم يكونوا في الغرفة في المرة السابقة، ولا يستطيع أي منهم أن يرى أن برنامجاً أسبق طالب بالمال نفسه، لأن ذلك الوعد الأسبق توقف تتبّعه يوم أُغلق مشروعه. الوعد يعمّر سنوات بعد أن يتوقف تتبّعه، وفي هذه الفجوة تفقد المحفظة مصداقيتها بهدوء أمام من يموّلونها.",
        "يُبقي TruMandate المنفعة حيّة 24 شهراً بعد الإغلاق. تبقى مرتبطة بالمؤشر ذاته الذي وُعدت بتحريكه، ولها مالك ما زال يشغل ذلك الدور، لا مدير مشروع انتقل إلى برنامج آخر. القيمة المتوقَّعة والقيمة الفعلية على المحور نفسه، وفي السجل نفسه، وبالوحدات التي استخدمتها دراسة الجدوى. ويظهر التباعد بينهما دون أن يطلب أحد تقريراً، وهذا هو المقصود: الفترة التي لا يسأل فيها أحد هي بالضبط الفترة التي كان يُفترض أن تصل فيها المنفعة.",
        "هذا أقل أجزاء المنصة راحة في العرض، وهو الجزء الذي يقرّر إن كان ما تبقّى منها يساوي شيئاً. نظام حوكمة لا يحسن الإخبار إلا عن عمل جارٍ هو جدول زمني عُلِّقت عليه لوحة مؤشرات. الاختبار الحقيقي أن يظل قادراً على الإجابة عن سؤال يخص برنامجاً انتهى قبل عامين، تقاعد راعيه وأُعيد توزيع فريق تنفيذه مرتين. فإن كان الجواب هزّة كتف، فشجرة الأهداف في الأعلى كانت زينة.",
      ],
      captionLead:
        "منفعة واحدة، الفعلي مقابل المتوقَّع، على المحور الذي حدّدته دراسة جدواها.",
      captionSecond:
        "خط متصل حتى اليوم، وامتداد متوقَّع بعده، وقياس يمتد 24 شهراً من يوم إغلاق المشروع.",
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "تسرّب منفعة، ظهر في الربع الذي لم يراقبه أحد.",
        body: "يراقب النموذج المقياس الذي رُبطت به المنفعة، لا المشروع الذي وعد بها، فيستمر في المراقبة بعد أن يتوقف المشروع عن الوجود. وحين تبتعد القيم الفعلية عن المتوقَّعة يذكر مقدار الابتعاد، وعلى أي مدة، وما يرجّح أنه سببه. ثم يفعل ما يفعله في كل موضع آخر هنا: يسلّم القرار إلى شخص، ويثبّت اسمه في السجل، ويترك التوقّع كما هو حتى يتصرّف. رقم بهذا القدر من الإزعاج يستحق أن يكون المرء واثقاً منه.",
        badge: "مراقبة ذكية",
        confidenceLabel: "درجة الثقة ٠٫٦٩",
        confidence: 0.69,
        title: "تسرّب منفعة بعد الإغلاق",
        detail:
          "المنفعة ٤٫٢. الدليل: ابتعدت القيم الفعلية عن المتوقَّعة بنسبة ١٨٪ خلال الربعين التاليين للإغلاق، وتوقّف المؤشر الأساسي عن التحسّن حين سُرِّح فريق البرنامج. ولم يُبلَّغ أي مالك. الإجراء المقترح: إعادة إسناد ملكية المنفعة ومراجعة القيمة المتوقَّعة.",
        log: "القرار مسجَّل · s.alnuaimi · ١٦:٣٠",
      },
      handoff:
        "يفتح العرض التوضيحي سجل المنافع: كل وعد قُطع في دراسة جدوى، وحالته اليوم، ومن يملكه الآن، في قائمة واحدة.",
      documentTitle: "تحقيق المنافع — TruMandate",
      documentDescription:
        "كيف تعرف أن الأثر وقع بعد رحيل الفريق: منافع تبقى حيّة 24 شهراً بعد الإغلاق، مقابل المؤشر ذاته الذي وُعدت بتحريكه.",
    },
  },
};
