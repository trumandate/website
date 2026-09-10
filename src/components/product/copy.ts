import type { Language } from "../../i18n/types";

/**
 * Product-page copy — redesign wave B (docs/design_handoff_website_redesign/
 * README.md §§2–4: Strategy/Execution/Benefits). Replaces the pre-redesign
 * shape wholesale (not extended): the new reference pages carry a different
 * skeleton — a start-aligned hero with a gradient key phrase, a bespoke DOM/
 * SVG fragment, a three-point "argument" grid (not a paragraph stack), a
 * hue-bordered AI moment card, and a two-CTA handoff — so the old
 * `ProductPageCopy` shape (a `string[]` of long paragraphs) no longer matches
 * what ships. Every string below is carried verbatim from the reference
 * `.dc.html` files (`Strategy (redesign).dc.html` / `Strategy AR …`, and the
 * Execution/Benefits siblings) — the standing directive for this wave is
 * exact reference fidelity, copy included, over the pre-existing approved
 * English/Arabic this file held before.
 *
 * Kept as a plain TS table rather than folded into `i18n/ui.ts`, same
 * precedent as this file's previous shape and `components/board/copy.ts`:
 * `argument.points` is an array and `ai.confidence` is a number, neither of
 * which `useTranslations`'s `t()` (string-only, KeyPath-typed) can return.
 */

export interface ArgumentPoint {
  /** Hue-coloured mono eyebrow, e.g. "The break" / "الانقطاع". */
  eyebrow: string;
  body: string;
}

export interface ProductArgument {
  /** Muted mono eyebrow above the section heading, e.g. "Where it breaks". */
  eyebrow: string;
  heading: string;
  /** The heading's own `max-width`, in ch — differs per page and per
   * language in the reference (Arabic runs wider), same reasoning as
   * `heroHeadlineMaxCh`. */
  headingMaxCh: number;
  /** Always three, each with its own `tm-grow` rule above it. */
  points: ArgumentPoint[];
}

export interface ProductAiMoment {
  eyebrow: string;
  heading: string;
  /** The heading's own `max-width`, in ch — same per-page/per-language
   * reasoning as `heroHeadlineMaxCh`/`headingMaxCh`. */
  headingMaxCh: number;
  body: string;
  /** Card badge, already composed with its domain suffix, e.g.
   * "AI watch · strategy" / "مراقبة ذكية · الاستراتيجية". */
  badge: string;
  /** "confidence" / "الثقة" — the word only; the value renders separately
   * (Arabic wraps the digits in `dir="ltr"` for bidi isolation, matching the
   * reference and known-issues.md's established digit-pair pattern). */
  confidenceWord: string;
  /** "0.81" — display string; must agree with `confidence` below. */
  confidenceValue: string;
  /** 0–1. Drives the confidence bar's width. */
  confidence: number;
  title: string;
  detail: string;
  /** "Decision logged" / "القرار مسجَّل" — the label only. */
  logPrefix: string;
  /** "h.alsuwaidi · 11:07" — same string both languages; Arabic wraps it in
   * `dir="ltr"`, matching the reference. */
  logName: string;
}

export interface ProductHandoff {
  /** Hue-coloured mono eyebrow, e.g. "Held back from this page" / "In the
   * demo" — wording differs per page in the reference, carried as-is. */
  eyebrow: string;
  heading: string;
  /** Strategy and Execution carry a second lede line; Benefits does not
   * (the reference's own asymmetry, reproduced rather than normalised). */
  lede?: string;
  /** The secondary ghost CTA's label, e.g. "Next: Execution" / "Back to
   * home" / "العودة إلى الرئيسية". */
  nextLabel: string;
  /** Route suffix after `/{lang}`, e.g. "/execution" or "/" for home. */
  nextHref: string;
}

export interface ProductPageCopy {
  /** Strategy → cyan, Execution → mint, Benefits → gold. */
  hue: "cyan" | "mint" | "gold";
  /** "The chain · Objective → KPI" etc. */
  chainEyebrow: string;
  /** The H1 splits around a gradient-clip span: concatenating
   * `headlineLead + headlineGradient + headlineTail` reproduces the
   * reference's sentence exactly, including trailing punctuation. */
  headlineLead: string;
  headlineGradient: string;
  headlineTail: string;
  /** The H1's own `max-width`, in ch — the reference sets this per page (and
   * wider in Arabic, since Arabic prose runs longer at the same character
   * count) rather than one shared value. */
  heroHeadlineMaxCh: number;
  lede: string;
  /** The mono caption line under the fragment. */
  fragmentCaption: string;
  argument: ProductArgument;
  ai: ProductAiMoment;
  handoff: ProductHandoff;
  documentTitle: string;
  documentDescription: string;
}

export type ProductPageKey = "strategy" | "execution" | "benefits";

export const productCopy: Record<
  Language,
  Record<ProductPageKey, ProductPageCopy>
> = {
  en: {
    strategy: {
      hue: "cyan",
      chainEyebrow: "The chain · Objective → KPI",
      headlineLead: "A mandate is not a plan until someone ",
      headlineGradient: "owns a number",
      headlineTail: ".",
      heroHeadlineMaxCh: 22,
      lede: "Every office can draw the objective tree. TruMandate makes the KPI the join: a baseline, a target, a named owner and a live actual, wired to the objective above it and the initiatives below it.",
      fragmentCaption:
        "One KPI record as the platform stores it. The status dot is computed from movement, never typed in.",
      argument: {
        eyebrow: "Where it breaks",
        heading: "The tree was never the hard part.",
        headingMaxCh: 28,
        points: [
          {
            eyebrow: "The break",
            body: "Objectives are written by the people who set direction. KPIs are defined months later by the people who report. Nobody's job is to reconcile the two, so they drift apart quietly.",
          },
          {
            eyebrow: "The join",
            body: "In TruMandate the KPI is the join, not a downstream artefact. Rescope an initiative and the consequence shows at the KPI it feeds, because the link is part of the record.",
          },
          {
            eyebrow: "The refusal",
            body: "The platform will not accept a KPI without a baseline. A measure with no starting point is an opinion, and an opinion does not survive a minister asking what changed.",
          },
        ],
      },
      ai: {
        eyebrow: "AI in the platform",
        heading: "Two KPIs, one benefit, counted twice.",
        headingMaxCh: 24,
        body: "The model compares measure definitions and initiative links, not names, so it catches duplication that a tidy naming convention hides. It states what it found, how sure it is, and what it would do. A person chooses, and the choice is stored with their name.",
        badge: "AI watch · strategy",
        confidenceWord: "confidence",
        confidenceValue: "0.81",
        confidence: 0.81,
        title: "Two KPIs counting the same benefit",
        detail:
          "Objective 2.1 and Objective 4.3. Evidence: identical source measure and an overlapping initiative set. Suggested action: merge, or mark one as a contributing measure.",
        logPrefix: "Decision logged",
        logName: "h.alsuwaidi · 11:07",
      },
      handoff: {
        eyebrow: "Held back from this page",
        heading:
          "The cascade editor. Watch it built live, in about ten minutes.",
        lede: "A national framework document in at the top, weighted objectives out at the bottom.",
        nextLabel: "Next: Execution",
        nextHref: "/execution",
      },
      documentTitle: "Strategy and KPIs — TruMandate",
      documentDescription:
        "How a mandate becomes a number someone owns: objectives joined to KPIs that carry a baseline, a target, an owner and a live actual.",
    },

    execution: {
      hue: "mint",
      chainEyebrow: "The chain · Initiative → Milestone",
      headlineLead: "Delivery data that never reaches the funder is just ",
      headlineGradient: "paperwork",
      headlineTail: ".",
      heroHeadlineMaxCh: 22,
      lede: "Project tools cannot roll up to a mandate they have never heard of. TruMandate holds every initiative against the objective that funded it, so slip is a subtraction, visible the day it happens.",
      fragmentCaption:
        "The list continues past the crop. The red row raised itself; nobody filed an exception report.",
      argument: {
        eyebrow: "Where it breaks",
        heading:
          "The monthly pack is stale and negotiated. Committees fund on it anyway.",
        headingMaxCh: 28,
        points: [
          {
            eyebrow: "The ritual",
            body: "Someone requests status. Someone retypes it into a template. Each number is rounded toward the answer its author would rather give, because the writer is also the one who will be asked about it.",
          },
          {
            eyebrow: "The subtraction",
            body: "Every milestone carries a baseline date and an actual date, so slip is arithmetic, not judgement. The steering pack stops being assembled because it was never disassembled.",
          },
          {
            eyebrow: "The name",
            body: "Every stage gate decision is recorded against a person and a date, and it stays on the record after that person moves on. A wrong number leads back to someone who can be asked.",
          },
        ],
      },
      ai: {
        eyebrow: "AI in the platform",
        heading: "A risk neither owner had raised.",
        headingMaxCh: 24,
        body: "Two records no person had a reason to compare: a date that moved on one initiative, and a start condition on another that points at it. Different departments, no shared meeting. The model put it in front of someone with a week still on the clock.",
        badge: "AI watch · execution",
        confidenceWord: "confidence",
        confidenceValue: "0.74",
        confidence: 0.74,
        title: "Cross-department dependency at risk",
        detail:
          "Initiative 07 and Initiative 21, different departments. Evidence: gate 3 slipped on one, and the other's start condition references it. Suggested action: raise a dependency flag before the steering meeting.",
        logPrefix: "Decision logged",
        logName: "m.alfarsi · 08:15",
      },
      handoff: {
        eyebrow: "Held back from this page",
        heading: "What happens when a gate is rejected.",
        lede: "How far the change propagates through dates, dependencies and owners before anyone sits down to re-plan.",
        nextLabel: "Next: Benefits",
        nextHref: "/benefits",
      },
      documentTitle: "Execution and governance — TruMandate",
      documentDescription:
        "How delivery reality reaches the office that funded it: initiatives held against the objective that paid for them, with baseline and actual on every milestone.",
    },

    benefits: {
      hue: "gold",
      chainEyebrow: "The chain · Benefit",
      headlineLead: "The project closed. Did the ",
      headlineGradient: "benefit arrive",
      headlineTail: "?",
      heroHeadlineMaxCh: 20,
      lede: "Benefits are forecast when optimism is rewarded and measured after the team is gone. TruMandate keeps each benefit alive for 24 months past closure, attached to the exact KPI it promised to move.",
      fragmentCaption:
        "Forecast and actual on the same axis, in the units the business case used. Divergence shows itself.",
      argument: {
        eyebrow: "Where it breaks",
        heading: "The largest credibility gap in portfolio governance.",
        headingMaxCh: 30,
        points: [
          {
            eyebrow: "The gap",
            body: "Forecast at approval, measured never. Everyone involved knows the gap is there. It is simply nobody's job to close it once the project has closed.",
          },
          {
            eyebrow: "The repeat promise",
            body: "The same saving gets promised by three consecutive programmes, because the earlier promise stopped being tracked the day its project shut down. Nobody is lying. Nobody is checking.",
          },
          {
            eyebrow: "The 24 months",
            body: "TruMandate keeps the benefit alive past closure, owned by someone still in the role, measured against the KPI it promised to move. The quiet period is exactly when it watches.",
          },
        ],
      },
      ai: {
        eyebrow: "AI in the platform",
        heading: "Leakage, found in the quarter nobody was watching.",
        headingMaxCh: 26,
        body: "The model watches the measure, not the project, so it keeps watching after the project stops existing. When actuals pull away from forecast it says by how much, over what period, and what it thinks caused it. Then a person decides, on the record.",
        badge: "AI watch · benefits",
        confidenceWord: "confidence",
        confidenceValue: "0.69",
        confidence: 0.69,
        title: "Benefit leakage detected after closure",
        detail:
          "Benefit 4.2. Evidence: actuals diverged from forecast by 18% in the two quarters since closure, and the KPI stopped improving when the team was released. Suggested action: reassign ownership and revise the forecast.",
        logPrefix: "Decision logged",
        logName: "s.alnuaimi · 16:30",
      },
      handoff: {
        eyebrow: "In the demo",
        heading:
          "The benefit register: every promise, its status, its owner. One list.",
        nextLabel: "Back to home",
        nextHref: "/",
      },
      documentTitle: "Benefits realisation — TruMandate",
      documentDescription:
        "How you know the outcome happened after the team has gone: benefits kept alive for 24 months past closure, against the exact KPI they promised to move.",
    },
  },

  // ---------------------------------------------------------------------------
  // Arabic — carried verbatim from `Strategy AR (redesign).dc.html` and its
  // Execution/Benefits siblings, written prose (not machine-translated),
  // exactly as the reference ships it.
  // ---------------------------------------------------------------------------
  ar: {
    strategy: {
      hue: "cyan",
      chainEyebrow: "السلسلة · من الهدف إلى مؤشر الأداء",
      headlineLead: "التكليف وحده ليس خطة؛ فلا بد من شخص يتحمل مسؤولية تحقيق ",
      headlineGradient: "نتائج محددة",
      headlineTail: ".",
      heroHeadlineMaxCh: 24,
      lede: "يمكن لكل جهة بناء شجرة أهداف واضحة، بينما يربط ترو مانديت (TruMandate) مؤشرات الأداء بالأهداف والمبادرات، من خلال تحديد خط الأساس والهدف والمسؤول عن تحقيقه والقيمة الفعلية بشكل مستمر، بما يضمن ارتباط كل مؤشر بالهدف الذي يدعمه والمبادرات التي تسهم في تحقيقه.",
      fragmentCaption:
        "يمثل هذا السجل مؤشر أداء رئيسيًا (KPI) واحدًا محفوظًا في المنصة، مع احتساب حالته تلقائيًا بناءً على حركة الأداء وتطوره، دون أي إدخال يدوي.",
      argument: {
        eyebrow: "أين يحدث الخلل",
        heading: "لم تكن شجرة الأهداف هي التحدي الحقيقي.",
        headingMaxCh: 30,
        points: [
          {
            eyebrow: "الفجوة",
            body: "تبدأ المشكلة عندما تُحدَّد الأهداف في مرحلة، ثم تُبنى مؤشرات الأداء الرئيسية بعد أشهر وبشكل منفصل عنها. ومع غياب من يربط بين الأهداف والمؤشرات، تتباعد تدريجيًا، حتى تفقد المؤشرات ارتباطها بالأهداف التي يفترض أن تقيس التقدم نحوها.",
          },
          {
            eyebrow: "حلقة الوصل",
            body: "في ترو مانديت (TruMandate)، لا يأتي مؤشر الأداء الرئيسي (KPI) كعنصر منفصل في نهاية العملية، بل يشكل حلقة الوصل بين الأهداف والمبادرات. فعند تغيير نطاق أي مبادرة، يظهر أثر التغيير مباشرةً على مؤشر الأداء المرتبط بها، لأن العلاقة بينهما مدمجة ضمن سجل المؤشر نفسه.",
          },
          {
            eyebrow: "الرفض",
            body: "لا تسمح المنصة بإضافة أي مؤشر أداء رئيسي (KPI) من دون تحديد خط أساس واضح. فبدون نقطة بداية، لا يمكن قياس التغيير بصورة موثوقة، ولن يكون من السهل الإجابة عن السؤال الأهم: ما الذي تغيّر؟",
          },
        ],
      },
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "مؤشرا أداء، ونتيجة واحدة، تُحتسب مرتين.",
        headingMaxCh: 26,
        body: "يقارن النموذج تعريفات مؤشرات الأداء وروابط المبادرات، وليس أسماءها فقط، مما يتيح له اكتشاف التكرار الذي قد تخفيه حتى أنظمة التسمية المنظمة. ويوضح النموذج ما اكتشفه، ومدى ثقته في النتيجة، والإجراء الذي يقترحه. ثم يتخذ المسؤول القرار، ويُحفظ هذا القرار في المنصة باسمه.",
        badge: "مراقبة ذكية · الاستراتيجية",
        confidenceWord: "الثقة",
        confidenceValue: "0.81",
        confidence: 0.81,
        title: "مؤشرا أداء يقيسان الفائدة نفسها",
        detail:
          "الهدف 2.1 والهدف 4.3 الدليل: يعتمد المؤشران على مصدر القياس نفسه، مع وجود مبادرات متداخلة بينهما. الإجراء المقترح: دمج المؤشرين، أو تحديد أحدهما كمؤشر مساهم.",
        logPrefix: "القرار مسجَّل",
        logName: "h.alsuwaidi · 11:07",
      },
      handoff: {
        eyebrow: "في هذه الصفحة",
        heading: "محرّر تسلسل الأهداف — شاهد كيف يُبنى مباشرةً أمامك في نحو عشر دقائق.",
        lede: "من وثيقة استراتيجية شاملة إلى أهداف موزونة على مستوى التنفيذ.",
        nextLabel: "التالي: التنفيذ",
        nextHref: "/execution",
      },
      documentTitle: "الاستراتيجية ومؤشرات الأداء — TruMandate",
      documentDescription:
        "كيف يصير التكليف رقماً يملكه شخص: أهداف موصولة بمؤشرات تحمل خط أساس وقيمة مستهدفة ومالكاً وقيمة فعلية حيّة.",
    },

    execution: {
      hue: "mint",
      chainEyebrow: "السلسلة · المبادرة ← نقطة الإنجاز",
      headlineLead: "بيانات التنفيذ التي لا تصل إلى الجهة المموِّلة ليست سوى ",
      headlineGradient: "أوراق",
      headlineTail: ".",
      heroHeadlineMaxCh: 24,
      lede: "لا يمكن لأدوات إدارة المشاريع ربط نتائجها بتكليف لا تعرفه. ويربط ترو مانديت (TruMandate) كل مبادرة بالهدف الذي موّلها، بحيث يُحتسب أي تأخير كتراجع مباشر في تحقيق الهدف، ويظهر أثره في يوم حدوثه.",
      fragmentCaption:
        "تتجاوز القائمة الجزء الظاهر، بينما برز الصف الأحمر تلقائيًا دون أن يقدّم أحد تقريرًا عن الاستثناء.",
      argument: {
        eyebrow: "أين يحدث الخلل",
        heading:
          "تعتمد اللجان في قرارات التمويل على تقرير شهري قديم يخضع للتفاوض والتعديل.",
        headingMaxCh: 32,
        points: [
          {
            eyebrow: "الطقس المتكرر",
            body: "يطلب أحدهم تحديثًا عن الحالة، ثم يعيد شخص آخر إدخالها يدويًا في نموذج موحّد. ويُقرَّب كل رقم نحو النتيجة التي يفضّل كاتبه عرضها، لأن الشخص الذي يكتب الرقم هو نفسه من سيُطلب منه تفسيره لاحقًا.",
          },
          {
            eyebrow: "عملية الطرح",
            body: "كل معلم يحمل تاريخ خط أساس وتاريخًا فعليًا، فيصبح التأخير نتيجة حسابية لا مسألة اجتهاد. وتتوقف الحاجة إلى إعداد تقرير اللجنة يدويًا، لأن البيانات التي يستند إليها مترابطة أصلًا.",
          },
          {
            eyebrow: "التوثيق",
            body: "يُسجَّل كل قرار عند كل مرحلة من مراحل الاعتماد باسم المسؤول عنه وتاريخه، ويظل محفوظًا في السجل حتى بعد مغادرة ذلك الشخص لمنصبه. وعند ظهور رقم غير صحيح، يمكن الرجوع إلى المسؤول عنه ومساءلته.",
          },
        ],
      },
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "مخاطرة لم يرفعها أيٌّ من المسؤولين عنها",
        headingMaxCh: 26,
        body: "سجلّان لم يكن لدى أي شخص سبب لمقارنتهما: تاريخ تغيّر في إحدى المبادرات، وشرط بدء في مبادرة أخرى يشير إليها. قسمان مختلفان، ولا اجتماع يجمع بينهما. اكتشف النموذج الرابط بينهما ولفت انتباه أحد المسؤولين إليه، بينما لا يزال أمامه أسبوع لاتخاذ الإجراء اللازم.",
        badge: "مراقبة ذكية · التنفيذ",
        confidenceWord: "الثقة",
        confidenceValue: "0.74",
        confidence: 0.74,
        title: "الاعتمادية المشتركة بين الإدارات معرضة للخطر",
        detail:
          "المبادرة 07 والمبادرة 21، وتتبعان إدارتين مختلفتين. الدليل: تأخرت البوابة 3 في إحداهما، وشرط بدء الأخرى يشير إليها. الإجراء المقترح: تسجيل التبعية قبل اجتماع اللجنة.",
        logPrefix: "القرار مسجَّل",
        logName: "m.alfarsi · 08:15",
      },
      handoff: {
        eyebrow: "في هذه الصفحة",
        heading: "ماذا يحدث عند رفض البوابة؟",
        lede: "إلى أي مدى يمتد أثر التغيير عبر التواريخ والتبعيات والمسؤولين عنه، قبل أن يبدأ أحد بإعادة التخطيط.",
        nextLabel: "التالي: المنافع",
        nextHref: "/benefits",
      },
      documentTitle: "التنفيذ والحوكمة — TruMandate",
      documentDescription:
        "كيف يصل واقع التنفيذ إلى المكتب الذي مَوّله: مبادرات محفوظة مقابل الهدف الذي دفع ثمنها، وخط أساس وقيمة فعلية على كل معلم.",
    },

    benefits: {
      hue: "gold",
      chainEyebrow: "السلسلة · المنفعة",
      headlineLead: "انتهى المشروع. فهل ",
      headlineGradient: "تحققت الفائدة",
      headlineTail: "؟",
      heroHeadlineMaxCh: 22,
      lede: "تُقدَّر الفوائد المستقبلية عندما يُكافأ التفاؤل، ثم تُقاس بعد مغادرة الفريق. ويحافظ ترو مانديت (TruMandate) على متابعة كل فائدة لمدة 24 شهرًا بعد إغلاق المشروع، مع ربطها مباشرةً بمؤشر الأداء الرئيسي (KPI) المحدد الذي وعد المشروع بتحسينه.",
      fragmentCaption:
        "التوقعات والنتائج الفعلية على المحور نفسه، وبالوحدات المستخدمة في دراسة الجدوى. ويظهر أي انحراف بوضوح.",
      argument: {
        eyebrow: "أين يحدث الخلل",
        heading: "أكبر فجوة في المصداقية في حوكمة المحافظ.",
        headingMaxCh: 32,
        points: [
          {
            eyebrow: "الفجوة",
            body: "تُتوقَّع عند الاعتماد، ولا تُقاس أبدًا. الجميع يعرف بوجود هذه الفجوة، لكنها ببساطة ليست مسؤولية أحد بعد إغلاق المشروع.",
          },
          {
            eyebrow: "الوعد المتكرر",
            body: "تُوعَد بالوفورات نفسها ثلاثة برامج متتالية، لأن الوعد السابق توقفت متابعته في اليوم الذي أُغلق فيه المشروع. لا أحد يكذب، ولا أحد يتحقق.",
          },
          {
            eyebrow: "الأشهر الأربعة والعشرون",
            body: "يواصل ترو مانديت (TruMandate) متابعة الفائدة لمدة 24 شهرًا بعد إغلاق المشروع، مع بقاء المسؤول عنها في منصبه، وقياسها مقابل مؤشر الأداء الرئيسي (KPI) الذي كان المشروع يستهدف تحسينه. وخلال هذه الفترة، التي غالبًا ما تتراجع فيها المتابعة، يواصل ترو مانديت رصد تحقق الفائدة.",
          },
        ],
      },
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "تسرّب لم يُكتشف إلا في الربع الذي لم يكن أحد يراقبه.",
        headingMaxCh: 28,
        body: "يراقب النموذج المقياس، لا المشروع، ولذلك تستمر المتابعة حتى بعد إغلاق المشروع. وعندما تبتعد النتائج الفعلية عن التوقعات، يوضح مقدار الانحراف، والفترة التي حدث خلالها، والسبب المرجّح له. ثم يتخذ المسؤول القرار، ويُوثَّق في السجل.",
        badge: "مراقبة ذكية · المنافع",
        confidenceWord: "الثقة",
        confidenceValue: "0.69",
        confidence: 0.69,
        title: "تسرّب في الفائدة بعد إغلاق المشروع",
        detail:
          "الفائدة 4.2. الدليل: انحرفت النتائج الفعلية عن التوقعات بنسبة 18% خلال الربعين التاليين لإغلاق المشروع، وتوقف مؤشر الأداء الرئيسي (KPI) عن التحسن بعد مغادرة الفريق. الإجراء المقترح: إعادة تعيين المسؤولية عن الفائدة وتحديث التوقعات.",
        logPrefix: "القرار مسجَّل",
        logName: "s.alnuaimi · 16:30",
      },
      handoff: {
        eyebrow: "في العرض التوضيحي",
        heading: "سجل الفوائد: كل وعد، وحالته، والمسؤول عنه. قائمة واحدة.",
        nextLabel: "العودة إلى الرئيسية",
        nextHref: "/",
      },
      documentTitle: "تحقيق المنافع — TruMandate",
      documentDescription:
        "كيف تعرف أن الأثر وقع بعد رحيل الفريق: منافع تبقى حيّة 24 شهراً بعد الإغلاق، مقابل المؤشر ذاته الذي وُعدت بتحريكه.",
    },
  },
};
