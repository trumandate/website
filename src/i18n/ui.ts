import type { UiDictionary } from "./types";

/**
 * Chrome string table — header, footer, skip link, language toggle, the two
 * global CTAs — plus the home page's body copy (P5) and the three product
 * fragments' labels (P6-AR).
 *
 * The Arabic nav labels were provisional through P1–P5 and were confirmed
 * unchanged at P6-AR, once the three Arabic page titles they abbreviate
 * existed to check them against: الاستراتيجية / التنفيذ / المنافع stand to
 * الاستراتيجية ومؤشرات الأداء / التنفيذ والحوكمة / تحقيق المنافع exactly as
 * Strategy / Execution / Benefits stand to their own English page titles.
 * تواصل (`/contact`) is still provisional and gets its confirmation at P7,
 * when that page's Arabic is written. See TODO.md.
 */
export const ui: UiDictionary = {
  en: {
    brand: {
      name: "TruMandate",
    },
    skipLink: {
      label: "Skip to content",
    },
    nav: {
      strategy: "Strategy",
      execution: "Execution",
      benefits: "Benefits",
      contact: "Contact",
    },
    cta: {
      // content brief, Global — verbatim
      primary: "Request a walkthrough",
      secondary: "See the chain",
    },
    langToggle: {
      // content brief, Global: "shows the target language in its own script"
      toArabic: "العربية",
      toEnglish: "English",
    },
    footer: {
      // content brief, Global — verbatim
      company: "Intertec Systems · Dubai",
      site: "trumandate.com",
    },
    ragStatus: {
      onTrack: "Status: on track",
      atRisk: "Status: at risk",
      offTrack: "Status: off track",
    },
    home: {
      // content brief §1 — verbatim
      hero: {
        eyebrow: "Portfolio governance · Intertec Systems",
        headline: "Every mandate, traced to the outcome it promised.",
        lede: "TruMandate holds strategy, KPIs, initiatives and benefits in one record, so the office that sets direction can see what that direction produced.",
        panelLabel: "Objective 1.2 · Digital government maturity",
        row1Label: "Published plan",
        row1Value: "v3",
        row2Label: "Composite KPI",
        row2Value: "68 / 75",
        row3Label: "Initiatives linked",
        row3Value: "14",
        row4Label: "Benefit to date",
        row4Prefix: "AED ",
        row4Suffix: "M",
        row4Value: "AED 41M",
      },
      // content brief §2 — verbatim
      problem: {
        eyebrow: "The problem",
        heading: "Strategy is written once. Then it disappears.",
        planningLabel: "Planning",
        planningBody:
          "Objectives sit in documents. Nobody can say which initiative serves which objective, or who owns the number.",
        executionLabel: "Execution",
        executionBody:
          "Delivery data stays in project tools and never rolls up to the mandate that funded the work.",
        reportingLabel: "Reporting",
        reportingBody:
          "The quarterly pack is assembled by hand, and it is already out of date on the day it is read.",
      },
      // content brief §3 — verbatim
      chain: {
        eyebrow: "How it holds together",
        heading: "One chain, from objective to benefit, with no missing link.",
        sub: "Scroll through the chain. Each link is a record in the platform, and each one carries the identity of the link above it.",
        objectiveName: "Objective",
        objectiveBody:
          "Versioned and published, with a named owner and an assigned weight in the plan.",
        kpiName: "KPI",
        kpiBody:
          "A composite measure with baseline, target and live actual, so movement is a fact rather than a claim.",
        initiativeName: "Initiative",
        initiativeBody:
          "Funded, resourced and gated, and linked to the objective it exists to move.",
        milestoneName: "Milestone",
        milestoneBody:
          "Baseline against actual, with a slip surfaced before the date passes, not after.",
        benefitName: "Benefit",
        benefitBody:
          "Measured for 24 months after closure, against the exact KPI it promised to move.",
      },
      // Invented fragment content (spec §5's "one stage gate queue item",
      // no source text in the content brief) — English as authored at P3/P4.
      stageGate: {
        ariaLabel:
          "Stage gate queue. Gate 4, owner R. Al Hashimi, due 14 August, one item queued behind it.",
        gate1Label: "Stage gate · 04",
        gate2Label: "Stage gate · 05",
        ownerLabel: "Owner",
        ownerValue: "R. Al Hashimi",
        dueLabel: "Due",
        dueValue: "14 Aug",
      },
      // content brief §5 — verbatim
      ai: {
        eyebrow: "AI in the platform",
        heading: "AI proposes. A person decides.",
        body: "Every model output arrives as a suggestion carrying its confidence and its evidence, with three actions. Nothing reaches the record until someone accepts it, and the acceptance is stored with a name and a timestamp.",
        badge: "AI watch",
        confidence: "confidence 0.77",
        title: "Milestone slip predicted: 12 days",
        detail:
          "Legacy decommission wave 2. Driver: two dependencies unresolved at gate 3. Suggested action: re-sequence gate 4.",
        accept: "Accept",
        modify: "Modify",
        reject: "Reject",
        log: "Decision logged · a.almarzooqi · 09:42",
      },
      // content brief §4 — eyebrow/heading/sub verbatim; the four callouts
      // are dropped (BUILD_FLAGS decisions log) and the caption is spec §5's
      // own line, not brief text.
      closingCta: {
        eyebrow: "The Command Centre",
        heading: "One screen the office runs the week on.",
        sub: "Portfolio health rolled up from initiative level, KPI movement against target, and the decisions waiting on a person by name.",
        caption: "The whole board, in forty minutes.",
      },
    },
    // Product-page fragment labels — English exactly as authored at P6 inside
    // KpiCard/InitiativeRows/BenefitCurve, lifted into this table unchanged
    // when the Arabic landed.
    fragment: {
      kpiCard: {
        ariaLabel:
          "KPI record. Digital service adoption, KPI 1.2.3. Baseline 42.0, target 75.0, live actual 61.4. Status: at risk. A sparkline of the last six periods rises across the card. A second KPI record is cropped at the frame edge.",
        ref: "KPI · 1.2.3",
        name: "Digital service adoption",
        baselineLabel: "Baseline",
        baselineValue: "42.0",
        targetLabel: "Target",
        targetValue: "75.0",
        actualLabel: "Actual",
        actualValue: "61.4",
        sparklineLabel: "Last 6 periods",
        nextRef: "KPI · 1.2.4",
        nextName: "Case processing time",
        nextBaselineLabel: "Baseline",
        nextBaselineValue: "38.0",
      },
      initiativeRows: {
        ariaLabelLead: "Portfolio initiative list, cropped.",
        ariaLabelTail:
          "A fourth row is cut off at the frame edge and the list continues past it.",
        onTrack: "on track",
        atRisk: "at risk",
        offTrack: "off track",
        perCent: "per cent",
        initiativeHeader: "Initiative",
        statusHeader: "Status",
        progressHeader: "Progress",
        row1Name: "Unified service portal",
        row1Objective: "Objective 1.2",
        row2Name: "Records digitisation",
        row2Objective: "Objective 1.2",
        row3Name: "Legacy decommission",
        row3Objective: "Objective 3.1",
        row4Name: "Shared identity rollout",
        row4Objective: "Objective 2.4",
      },
      benefitCurve: {
        ariaLabel:
          "Benefit curve, cropped. Benefit 4.2, annual operating saving. The actual is plotted as a solid line up to today; the forecast continues past it as a dashed projection. The measurement window is marked and runs 24 months from closure. The two lines coincide until closure, after which the forecast keeps rising and the actual flattens. The plot is cut off at the frame edge.",
        recordLabel: "Benefit 4.2 · Annual operating saving",
        windowLabel: "Measurement window · 24 months",
        actualLegend: "Actual",
        forecastLegend: "Forecast",
        todayLabel: "Today",
      },
    },
    // content brief §7 — verbatim (eyebrow, heading, sub, all four field
    // labels and the four interest options). Everything else here is
    // invented (no brief source) and written directly in English, not
    // translated — see i18n/types.ts's `contact` doc comment.
    contact: {
      eyebrow: "Next step",
      heading: "See it against your own plan.",
      sub: "Send this and we will run a walkthrough on a portfolio shaped like yours, not a demo dataset.",
      emailNote: "Prefer email? Write to trumandate@intertecsys.com.",
      nameLabel: "Name",
      orgLabel: "Organisation",
      emailLabel: "Work email",
      interestLegend: "What you want to see",
      interestOption1: "Full platform walkthrough",
      interestOption2: "Strategy and KPI cascade",
      interestOption3: "Benefits realisation",
      interestOption4: "Deployment and data sovereignty",
      messageLabel: "Anything we should know",
      honeypotLabel: "Leave this field blank",
      submittingLabel: "Sending…",
      requiredError: "This field is required.",
      emailError: "Enter a valid work email address.",
      errorSummaryHeading: "Check the following before sending:",
      successHeading: "Request sent.",
      successBody:
        "We will be in touch to schedule the walkthrough on your own portfolio.",
      errorHeading: "Something went wrong.",
      errorBody:
        "The request was not sent. Try again, or write to trumandate@intertecsys.com directly.",
      sovereigntyEyebrow: "Deployment and data sovereignty",
      sovereigntyBody: "Sovereign on-premise or cloud",
    },
    meta: {
      // Moved verbatim from src/pages/en/index.astro's BaseLayout props
      // (P2) — same title/description, one home now.
      home: {
        title: "TruMandate — Every mandate, traced to the outcome it promised.",
        description:
          "TruMandate holds strategy, KPIs, initiatives and benefits in one record, so the office that sets direction can see what that direction produced.",
      },
      // Moved verbatim from src/pages/en/contact.astro's BaseLayout props (P7).
      contact: {
        title: "Request a walkthrough — TruMandate",
        description:
          "See TruMandate against your own portfolio, not a demo dataset. Send a few details and we will schedule a walkthrough.",
      },
      ogImageAlt:
        "TruMandate wordmark and the traceability chain motif on a jade ground.",
    },
  },
  ar: {
    brand: {
      // spec §8: the product name stays Latin script in both languages
      name: "TruMandate",
    },
    skipLink: {
      label: "تخطَّ إلى المحتوى",
    },
    nav: {
      // provisional — see file header note; not yet reviewed at P6
      strategy: "الاستراتيجية",
      execution: "التنفيذ",
      benefits: "المنافع",
      contact: "تواصل",
    },
    cta: {
      // content brief, Global — verbatim
      primary: "اطلب عرضاً توضيحياً",
      secondary: "اطّلع على السلسلة",
    },
    langToggle: {
      toArabic: "العربية",
      toEnglish: "English",
    },
    footer: {
      // content brief, Global — verbatim
      company: "إنترتك سيستمز · دبي",
      site: "trumandate.com",
    },
    ragStatus: {
      onTrack: "الحالة: على المسار الصحيح",
      atRisk: "الحالة: في خطر",
      offTrack: "الحالة: خارج المسار",
    },
    home: {
      // content brief §1 — verbatim. Numerals: the panel label keeps the
      // brief's own Arabic-Indic digits ("١.٢"); the row values are not
      // separately localised in the brief and stay Western per spec §8's
      // "Western digits in both languages for KPI values and dates".
      hero: {
        eyebrow: "حَوكمة المحافظ · إنترتك سيستمز",
        headline: "كل تكليف، متتبَّع حتى الأثر الذي وُعد به.",
        lede: "يحتفظ TruMandate بالاستراتيجية ومؤشرات الأداء والمبادرات والمنافع في سجل واحد، ليرى المكتب الذي يضع التوجّه ما أنتجه هذا التوجّه.",
        panelLabel: "الهدف ١.٢ · نضج الحكومة الرقمية",
        row1Label: "الخطة المعتمدة",
        row1Value: "v3",
        row2Label: "المؤشر المركّب",
        row2Value: "68 / 75",
        row3Label: "المبادرات المرتبطة",
        row3Value: "14",
        row4Label: "المنفعة المحققة",
        row4Prefix: "AED ",
        row4Suffix: "M",
        row4Value: "AED 41M",
      },
      // content brief §2 — verbatim
      problem: {
        eyebrow: "المشكلة",
        heading: "الاستراتيجية تُكتب مرة واحدة، ثم تختفي.",
        planningLabel: "التخطيط",
        planningBody:
          "الأهداف تبقى في مستندات، ولا أحد يستطيع تحديد أي مبادرة تخدم أي هدف، ولا من يملك الرقم.",
        executionLabel: "التنفيذ",
        executionBody:
          "بيانات التنفيذ تبقى في أدوات المشاريع ولا تصعد إلى التكليف الذي مَوّل العمل.",
        reportingLabel: "التقارير",
        reportingBody:
          "التقرير الربعي يُجمَّع يدوياً، ويصبح قديماً في اليوم الذي يُقرأ فيه.",
      },
      // content brief §3 — verbatim. Benefit's "24 شهراً" is Western digits
      // exactly as the brief writes it, sitting beside the AI card's
      // Arabic-Indic "١٢ يوماً" for a like quantity — a real inconsistency
      // in the source copy, shipped as-written and logged in
      // known-issues.md rather than silently corrected (PLAN.md §4
      // ambiguity 15).
      chain: {
        eyebrow: "كيف يترابط",
        heading: "سلسلة واحدة من الهدف إلى المنفعة، دون حلقة مفقودة.",
        sub: "تابع السلسلة بالتمرير. كل حلقة سجل في المنصة، وتحمل هوية الحلقة التي تسبقها.",
        objectiveName: "الهدف",
        objectiveBody:
          "مُصدَّر بنسخة معتمدة، له مالك محدَّد ووزن مُسند داخل الخطة.",
        kpiName: "مؤشر الأداء",
        kpiBody:
          "مقياس مركّب بخط أساس وهدف وقيمة فعلية حيّة، لتكون الحركة واقعاً لا ادعاءً.",
        initiativeName: "المبادرة",
        initiativeBody:
          "مموّلة ومزوّدة بالموارد ومحكومة ببوابات، ومرتبطة بالهدف الذي وُجدت لتحريكه.",
        milestoneName: "المعلم",
        milestoneBody:
          "خط الأساس مقابل الفعلي، مع إظهار التأخير قبل انقضاء التاريخ لا بعده.",
        benefitName: "المنفعة",
        benefitBody:
          "تُقاس 24 شهراً بعد الإغلاق، مقابل المؤشر ذاته الذي وُعدت بتحسينه.",
      },
      // Invented fragment content — written per BUILD_FLAGS ("Arabic is
      // written, not machine-translated: keep the argument, not the
      // sentence structure"), not translated from a brief source line.
      // "R. Al Hashimi" is localised to an Arabic-script name rather than
      // kept Latin, unlike the AI card's "a.almarzooqi" — that one is a
      // system username/handle (brief keeps it Latin verbatim), this one is
      // a display name in a UI list. The due date keeps Western digits with
      // the Arabic month name, per spec §8's date rule.
      stageGate: {
        ariaLabel:
          "قائمة انتظار بوابات المراحل. البوابة 04، المالك ر. الهاشمي، الاستحقاق 14 أغسطس، وعنصر واحد ينتظر الدور بعدها.",
        gate1Label: "بوابة المرحلة · 04",
        gate2Label: "بوابة المرحلة · 05",
        ownerLabel: "المالك",
        ownerValue: "ر. الهاشمي",
        dueLabel: "الاستحقاق",
        dueValue: "14 أغسطس",
      },
      // content brief §5 — verbatim, including its own Arabic-Indic digits
      // (٠٫٧٧ confidence, ١٢ يوماً, ٠٩:٤٢ timestamp) and the Latin
      // "a.almarzooqi" username.
      ai: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "الذكاء الاصطناعي يقترح، والإنسان يقرر.",
        body: "كل مخرَج للنموذج يصل كاقتراح يحمل درجة ثقته وأدلته، مع ثلاثة إجراءات. لا شيء يصل إلى السجل حتى يقبله شخص، ويُحفظ القبول باسمه ووقته.",
        badge: "مراقبة ذكية",
        confidence: "درجة الثقة ٠٫٧٧",
        title: "تأخير متوقَّع في المعلم: ١٢ يوماً",
        detail:
          "الموجة الثانية لإيقاف الأنظمة القديمة. السبب: تبعيتان غير محلولتين عند البوابة ٣. الإجراء المقترح: إعادة ترتيب البوابة ٤.",
        accept: "قبول",
        modify: "تعديل",
        reject: "رفض",
        log: "القرار مسجَّل · a.almarzooqi · ٠٩:٤٢",
      },
      // content brief §4 — eyebrow/heading/sub verbatim. The caption has no
      // brief source (it's spec §5's own English line); written per
      // BUILD_FLAGS rather than translated.
      closingCta: {
        eyebrow: "مركز القيادة",
        heading: "شاشة واحدة يُدار عليها الأسبوع.",
        sub: "صحة المحفظة مجمَّعة من مستوى المبادرات، وحركة المؤشرات مقابل الهدف، والقرارات التي تنتظر شخصاً بالاسم.",
        caption: "اللوحة كاملة، خلال أربعين دقيقة.",
      },
    },
    // Product-page fragment labels — invented, anonymised product data with no
    // brief source, so written per BUILD_FLAGS rather than translated. Digits
    // stay Western throughout, matching `home.stageGate` and spec §8's KPI/date
    // rule; the KPI references keep the product's own dotted form (1.2.3) since
    // they are identifiers in a UI, not quantities in prose.
    //
    // The mono→sans type swap these labels need is NOT applied through
    // global.css's `[dir="rtl"] .font-mono` override, because fragment type is
    // sized in SVG user-space units rather than rem (see KpiCard.astro); each
    // fragment carries its own `*-ar` class instead, same as StageGateQueue.
    fragment: {
      kpiCard: {
        ariaLabel:
          "سجل مؤشر أداء. تبنّي الخدمات الرقمية، المؤشر 1.2.3. خط الأساس 42.0، والقيمة المستهدفة 75.0، والقيمة الفعلية الحيّة 61.4. الحالة: في خطر. ويصعد عبر البطاقة خط بياني مصغَّر لآخر ست فترات. وسجل مؤشر ثانٍ مقصوص عند حافة الإطار.",
        ref: "مؤشر · 1.2.3",
        name: "تبنّي الخدمات الرقمية",
        baselineLabel: "خط الأساس",
        baselineValue: "42.0",
        targetLabel: "المستهدف",
        targetValue: "75.0",
        actualLabel: "الفعلي",
        actualValue: "61.4",
        sparklineLabel: "آخر 6 فترات",
        nextRef: "مؤشر · 1.2.4",
        nextName: "زمن معالجة المعاملة",
        nextBaselineLabel: "خط الأساس",
        nextBaselineValue: "38.0",
      },
      initiativeRows: {
        ariaLabelLead: "قائمة مبادرات المحفظة، مقصوصة.",
        ariaLabelTail: "وصف رابع مقطوع عند حافة الإطار، والقائمة تستمر بعده.",
        onTrack: "على المسار الصحيح",
        atRisk: "في خطر",
        offTrack: "خارج المسار",
        perCent: "بالمئة",
        initiativeHeader: "المبادرة",
        statusHeader: "الحالة",
        progressHeader: "التقدّم",
        row1Name: "بوابة الخدمات الموحّدة",
        row1Objective: "الهدف 1.2",
        row2Name: "رقمنة السجلات",
        row2Objective: "الهدف 1.2",
        row3Name: "إيقاف الأنظمة القديمة",
        row3Objective: "الهدف 3.1",
        row4Name: "إطلاق الهوية المشتركة",
        row4Objective: "الهدف 2.4",
      },
      benefitCurve: {
        ariaLabel:
          "منحنى منفعة، مقصوص. المنفعة 4.2، وفر تشغيلي سنوي. القيمة الفعلية مرسومة بخط متصل حتى اليوم، والقيمة المتوقَّعة تمتد بعده بخط متقطّع. نافذة القياس محدَّدة وتمتد 24 شهراً من الإغلاق. الخطان متطابقان حتى الإغلاق، ثم يواصل المتوقَّع الصعود بينما يستوي الفعلي. والرسم مقطوع عند حافة الإطار.",
        recordLabel: "المنفعة 4.2 · وفر تشغيلي سنوي",
        windowLabel: "نافذة القياس · 24 شهراً",
        actualLegend: "الفعلي",
        forecastLegend: "المتوقَّع",
        todayLabel: "اليوم",
      },
    },
    // content brief §7 — verbatim. Invented strings written directly in
    // Arabic (BUILD_FLAGS: "written, not machine-translated"), matching the
    // English list one-for-one — see i18n/types.ts's `contact` doc comment.
    contact: {
      eyebrow: "الخطوة التالية",
      heading: "شاهدها على خطتك أنت.",
      sub: "أرسل النموذج وسنقدّم عرضاً على محفظة تشبه محفظتك، لا على بيانات تجريبية.",
      emailNote: "تفضّل البريد الإلكتروني؟ راسلنا على trumandate@intertecsys.com.",
      nameLabel: "الاسم",
      orgLabel: "الجهة",
      emailLabel: "البريد المؤسسي",
      interestLegend: "ما ترغب في رؤيته",
      interestOption1: "عرض كامل للمنصة",
      interestOption2: "تدرّج الاستراتيجية والمؤشرات",
      interestOption3: "تحقيق المنافع",
      interestOption4: "النشر وسيادة البيانات",
      messageLabel: "أي معلومة تودّ إضافتها",
      honeypotLabel: "اترك هذا الحقل فارغاً",
      submittingLabel: "جارٍ الإرسال…",
      requiredError: "هذا الحقل مطلوب.",
      emailError: "أدخل عنوان بريد إلكتروني مؤسسي صالحاً.",
      errorSummaryHeading: "تحقق مما يلي قبل الإرسال:",
      successHeading: "تم إرسال الطلب.",
      successBody: "سنتواصل معك لتحديد موعد العرض على محفظتك الخاصة.",
      errorHeading: "حدث خطأ ما.",
      errorBody:
        "لم يُرسَل الطلب. حاول مرة أخرى، أو راسلنا مباشرة على trumandate@intertecsys.com.",
      sovereigntyEyebrow: "النشر وسيادة البيانات",
      sovereigntyBody: "استضافة سيادية داخلية أو سحابية",
    },
    meta: {
      // Moved verbatim from src/pages/ar/index.astro's BaseLayout props (P5).
      home: {
        title: "TruMandate — كل تكليف، متتبَّع حتى الأثر الذي وُعد به.",
        description:
          "يحتفظ TruMandate بالاستراتيجية ومؤشرات الأداء والمبادرات والمنافع في سجل واحد، ليرى المكتب الذي يضع التوجّه ما أنتجه هذا التوجّه.",
      },
      // Moved verbatim from src/pages/ar/contact.astro's BaseLayout props (P7).
      contact: {
        title: "اطلب عرضاً توضيحياً — TruMandate",
        description:
          "شاهد TruMandate على محفظتك أنت، لا على بيانات تجريبية. أرسل بضعة تفاصيل وسنحدد موعداً للعرض.",
      },
      ogImageAlt:
        "شعار TruMandate وخط سلسلة التتبّع على خلفية خضراء داكنة.",
    },
  },
};
