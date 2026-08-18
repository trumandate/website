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
      // Redesign wave A (README "Implementation Notes"): "CTA label is now
      // 'Book a demo' … site-wide" — supersedes the content brief's
      // "Request a walkthrough". `secondary` is the home hero's own ghost
      // CTA only (Home (redesign).dc.html: "Follow one record", `#record`).
      primary: "Book a demo",
      secondary: "Follow one record",
    },
    langToggle: {
      // content brief, Global: "shows the target language in its own script"
      toArabic: "العربية",
      toEnglish: "English",
    },
    footer: {
      // Redesign wave A — SiteFooter.dc.html, the slim enterprise footer.
      // `company`/`location`/`site` kept for any remaining reader; the four
      // new keys below are what Footer.astro actually renders now.
      company: "Intertec Systems",
      location: "Dubai",
      site: "trumandate.com",
      poweredByPrefix: "Powered by ",
      poweredBySuffix: " · Dubai, UAE",
      copyright: "© 2026 Intertec Systems. All rights reserved.",
      trademark: "TruMandate™ · trumandate.com",
    },
    ragStatus: {
      onTrack: "Status: on track",
      atRisk: "Status: at risk",
      offTrack: "Status: off track",
    },
    // Redesign wave A (docs/design_handoff_website_redesign/README.md —
    // Home). Copy is verbatim from `Home (redesign).dc.html` — see that
    // file and README's "Fidelity" note ("English AND Arabic copy are final
    // drafts pending owner review"). Supersedes the content-brief-derived
    // `home` table below this comment through P9; nothing outside the
    // deleted home-only component tree (Hero/FailureModes/ChainSection/
    // ClosingCta/StageGateQueue) ever read the old `problem`/`stageGate`/
    // old-shaped `hero`/`chain`/`closingCta` keys (verified by grep before
    // this change) — `ai` is untouched, still backing SuggestionCard's
    // product-page defaults.
    home: {
      hero: {
        eyebrow: "Portfolio governance · Intertec Systems",
        headlineLead: "Every mandate, traced to its ",
        headlineGradient: "measured benefit",
        headlineTail: ".",
        lede: "Strategy is a promise. Delivery is the proof. TruMandate keeps the thread between them unbroken, and its AI reads every inch of it.",
        boardCaption:
          "A corner of the Command Centre. The demo shows it whole.",
      },
      proof: {
        stat1Label: "Projects governed",
        stat2Label: "Portfolio budget",
        stat3Label: "Decisions waiting on a person",
        stat4Label: "Benefits measured after closure",
        stat4UnitAr: "شهراً",
      },
      aiQueue: {
        eyebrow: "AI in the platform",
        heading: "AI proposes. A person decides. The record keeps the name.",
        body: "Overnight, the model walked all 142 projects and came back with six things worth a person's morning. Each arrives carrying its evidence and its confidence. Nothing becomes the record until someone signs their name to it.",
        card1Badge: "AI watch · execution",
        card1Title: "Cross-department dependency at risk",
        card1Detail:
          "Gate 3 slipped on Initiative 07. Initiative 21's start condition references it. Neither owner has escalated.",
        card1Log: "Accepted · m.alfarsi · 08:15",
        card2Badge: "AI watch · strategy",
        card2Title: "Two KPIs counting one benefit",
        card2Detail:
          "Objective 2.1 and 4.3 share a source measure and an overlapping initiative set. Merge, or mark one as contributing.",
        card2Log: "Modified · h.alsuwaidi · 11:07",
        card3Badge: "AI watch · benefits",
        card3Title: "Benefit leakage after closure",
        card3Detail:
          "Benefit 4.2 is 18% below forecast two quarters after closure. The KPI stopped improving when the team was released.",
        card3Log: "Open · assigned s.alnuaimi",
        auditLine1: "Audit · 3 of 6 decisions closed today",
        auditLine2: "Gate 4 re-sequenced · a.almarzooqi · 09:42",
        auditLine3: "Forecast revised · s.alnuaimi · 16:30",
        auditLine4: "No model output entered the record unapproved",
      },
      chain: {
        eyebrow: "Traceability",
        heading:
          "One identity, carried from the mandate down to the money.",
        sub: "Keep scrolling and the chain moves. One objective travels the whole way down: from the sentence a minister signed to the saving a finance office can point at.",
        record1Name: "Objective",
        record1Kicker: "01 · Objective",
        record1Title: "Digital government maturity",
        record1Body: "Versioned, published, weighted. A named owner.",
        record1Row1Label: "Ref",
        record1Row1Value: "Objective 1.2",
        record1Row2Label: "Published plan",
        record1Row2Value: "v3",
        record2Name: "KPI",
        record2Kicker: "02 · KPI",
        record2Title: "Digital service adoption",
        record2Body: "Carries Objective 1.2. No baseline, no KPI.",
        record2Row1Label: "Baseline → target",
        record2Row1Value: "42.0 → 75.0",
        record2Row2Label: "Live actual",
        record2Row2Value: "61.4",
        record3Name: "Initiative",
        record3Kicker: "03 · Initiative",
        record3Title: "Unified service portal",
        record3Body: "Funded to move KPI 1.2.3, and it knows it.",
        record3Row1Label: "Funded",
        record3Row1Value: "AED 28M",
        record3Row2Label: "Progress",
        record3Row2Value: "74%",
        record4Name: "Milestone",
        record4Kicker: "04 · Milestone",
        record4Title: "Gate 4 · decommission",
        record4Body: "Slip is a subtraction, surfaced the day it happens.",
        record4Row1Label: "Baseline → actual",
        record4Row1Value: "14 Aug → 26 Aug",
        record4Row2Label: "Owner",
        record4Row2Value: "R. Al Hashimi",
        record5Name: "Benefit",
        record5Kicker: "05 · Benefit",
        record5Title: "Annual operating saving",
        record5Body:
          "Measured for 24 months after closure, against KPI 1.2.3, not a memory.",
        record5Row1Label: "Forecast → actual",
        record5Row1Value: "AED 50M → 41M",
        record5Row2Label: "Measured until",
        record5Row2Value: "Mar 2028",
      },
      withoutRecord: {
        eyebrow: "Without the record",
        heading: "Strategy is written once. Then it is retyped for a year.",
        col1Figure: "3 days",
        col1Label: "Planning",
        col1Body:
          "To answer which initiative moves which objective. Assembled by hand, in a spreadsheet, if it arrives at all.",
        col2Figure: "Month-end",
        col2Label: "Execution",
        col2Body:
          "Before a slip reaches the office that funded the work. By then the number has been rounded by the person who will be asked about it.",
        col3Figure: "Never",
        col3Label: "Benefits",
        col3Body:
          "The forecast is measured after closure. The team that promised it was released before the benefit was due.",
      },
      // UNCHANGED — still backs SuggestionCard.astro's product-page
      // defaults (`ProductPage.astro`, Strategy/Execution/Benefits). Not
      // part of the redesigned home page any more.
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
      closingCta: {
        eyebrow: "The next forty minutes",
        heading: "Bring one objective. We will trace it to the money.",
        body: "Forty minutes, on a portfolio shaped like yours: your departments, your period, your names on the decisions. Not a demo dataset.",
        secondaryLabel: "Write to us instead",
        row1Label: "Deployment",
        row1Body:
          "Sovereign on-premise or cloud, inside your own boundary.",
        row2Label: "Language",
        row2Body:
          "Arabic and English, both first-class, including the reports.",
        row3Label: "Operated by",
        row3Body:
          "Intertec Systems, Dubai. Governance delivery for UAE and KSA entities.",
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
      // Redesign wave A — see the English side's comment.
      primary: "احجز عرضاً توضيحياً",
      secondary: "تتبَّع سجلاً واحداً",
    },
    langToggle: {
      toArabic: "العربية",
      toEnglish: "English",
    },
    footer: {
      // Redesign wave A — see the English side's comment.
      company: "إنترتك سيستمز",
      location: "دبي",
      site: "trumandate.com",
      poweredByPrefix: "مشغَّل من ",
      poweredBySuffix: " · دبي، الإمارات",
      copyright: "© 2026 إنترتك سيستمز. جميع الحقوق محفوظة.",
      trademark: "TruMandate™ · trumandate.com",
    },
    ragStatus: {
      onTrack: "الحالة: على المسار الصحيح",
      atRisk: "الحالة: في خطر",
      offTrack: "الحالة: خارج المسار",
    },
    // Redesign wave A — copy verbatim from `Home AR (redesign).dc.html`
    // (README: "Arabic is written, not machine-translated; keep it flowing
    // through review, not re-translated"). See the English side's comment
    // for what superseded what.
    home: {
      hero: {
        eyebrow: "حَوكمة المحافظ · إنترتك سيستمز",
        headlineLead: "كل تكليف، متتبَّع حتى ",
        headlineGradient: "أثره المُقاس",
        headlineTail: ".",
        lede: "الاستراتيجية وعد، والتنفيذ برهانه. يُبقي TruMandate الخيط بينهما متصلاً بلا انقطاع، ويقرؤه الذكاء الاصطناعي بكامله.",
        boardCaption: "زاوية من مركز القيادة. العرض التوضيحي يُظهره كاملاً.",
      },
      proof: {
        stat1Label: "مشروعاً تحت الحوكمة",
        stat2Label: "ميزانية المحفظة",
        stat3Label: "قرارات بانتظار شخص",
        stat4Label: "قياس المنافع بعد الإغلاق",
        stat4UnitAr: "شهراً",
      },
      aiQueue: {
        eyebrow: "الذكاء الاصطناعي في المنصة",
        heading: "الذكاء الاصطناعي يقترح، والإنسان يقرر، والسجل يحفظ الاسم.",
        body: "خلال الليل قرأ النموذج 142 مشروعاً وعاد بستة أمور تستحق صباح إنسان. كل اقتراح يصل ومعه دليله ودرجة ثقته، ولا يدخل السجل شيء حتى يوقّع أحدهم باسمه.",
        card1Badge: "مراقبة ذكية · التنفيذ",
        card1Title: "تبعية بين إدارتين معرَّضة للخطر",
        card1Detail:
          "تأخرت البوابة 3 في المبادرة 07، وشرط بدء المبادرة 21 يشير إليها. لم يصعّد أي من المالكَين.",
        card1Log: "مقبول · m.alfarsi · 08:15",
        card2Badge: "مراقبة ذكية · الاستراتيجية",
        card2Title: "مؤشران يحتسبان منفعة واحدة",
        card2Detail:
          "الهدف 2.1 والهدف 4.3 يتشاركان مقياس المصدر ومجموعة مبادرات متداخلة. ادمج، أو علّم أحدهما مقياساً مساهماً.",
        card2Log: "معدَّل · h.alsuwaidi · 11:07",
        card3Badge: "مراقبة ذكية · المنافع",
        card3Title: "تسرّب منفعة بعد الإغلاق",
        card3Detail:
          "المنفعة 4.2 أدنى من المتوقَّع بنسبة 18% بعد ربعين من الإغلاق. توقف المؤشر عن التحسّن حين سُرّح الفريق.",
        card3Log: "مفتوح · مُسند إلى s.alnuaimi",
        auditLine1: "التدقيق · أُغلقت 3 من 6 قرارات اليوم",
        auditLine2: "أعيد ترتيب البوابة 4 · a.almarzooqi · 09:42",
        auditLine3: "رُوجعت التوقعات · s.alnuaimi · 16:30",
        auditLine4: "لم يدخل السجل أي مخرَج للنموذج دون اعتماد",
      },
      chain: {
        eyebrow: "التتبّع",
        heading: "هوية واحدة، تُحمل من التكليف حتى المال.",
        sub: "تابع التمرير وتتحرك السلسلة. هدف واحد يقطع الطريق كله: من الجملة التي وُقّعت في الأعلى إلى الوفر الذي يشير إليه المكتب المالي.",
        record1Name: "الهدف",
        record1Kicker: "01 · الهدف",
        record1Title: "نضج الحكومة الرقمية",
        record1Body: "مُصدَّر بنسخة معتمدة وموزون، وله مالك بالاسم.",
        record1Row1Label: "المرجع",
        record1Row1Value: "Objective 1.2",
        record1Row2Label: "الخطة المعتمدة",
        record1Row2Value: "v3",
        record2Name: "مؤشر الأداء",
        record2Kicker: "02 · مؤشر الأداء",
        record2Title: "تبنّي الخدمات الرقمية",
        record2Body: "يحمل الهدف 1.2. لا خط أساس، لا مؤشر.",
        record2Row1Label: "خط الأساس ← المستهدف",
        record2Row1Value: "42.0 → 75.0",
        record2Row2Label: "الفعلي الحي",
        record2Row2Value: "61.4",
        record3Name: "المبادرة",
        record3Kicker: "03 · المبادرة",
        record3Title: "بوابة الخدمات الموحّدة",
        record3Body: "مموّلة لتحريك المؤشر 1.2.3، وتعرف ذلك.",
        record3Row1Label: "التمويل",
        record3Row1Value: "AED 28M",
        record3Row2Label: "التقدّم",
        record3Row2Value: "74%",
        record4Name: "المعلم",
        record4Kicker: "04 · المعلم",
        record4Title: "البوابة 4 · إيقاف الأنظمة القديمة",
        record4Body: "التأخير عملية طرح، يظهر يوم وقوعه.",
        record4Row1Label: "الأساس ← الفعلي",
        record4Row1Value: "14 Aug → 26 Aug",
        record4Row2Label: "المالك",
        record4Row2Value: "ر. الهاشمي",
        record5Name: "المنفعة",
        record5Kicker: "05 · المنفعة",
        record5Title: "وفر تشغيلي سنوي",
        record5Body:
          "تُقاس 24 شهراً بعد الإغلاق، مقابل المؤشر 1.2.3 لا الذاكرة.",
        record5Row1Label: "المتوقَّع ← الفعلي",
        record5Row1Value: "AED 50M → 41M",
        record5Row2Label: "القياس حتى",
        record5Row2Value: "Mar 2028",
      },
      withoutRecord: {
        eyebrow: "بدون السجل",
        heading: "تُكتب الاستراتيجية مرة واحدة، ثم يُعاد نسخها طوال عام.",
        col1Figure: "3 أيام",
        col1Label: "التخطيط",
        col1Body:
          "لمعرفة أي مبادرة تحرّك أي هدف. يُجمَّع الجواب يدوياً في جدول، إن وصل أصلاً.",
        col2Figure: "نهاية الشهر",
        col2Label: "التنفيذ",
        col2Body:
          "قبل أن يصل التأخير إلى المكتب الذي موّل العمل، وبعد أن قُرّب الرقم بيد من سيُسأل عنه.",
        col3Figure: "أبداً",
        col3Label: "المنافع",
        col3Body:
          "تُقاس التوقعات بعد الإغلاق، وقد سُرّح الفريق الذي وعد بها قبل موعد ظهورها.",
      },
      // UNCHANGED — still backs SuggestionCard.astro's product-page
      // defaults. See the English side's comment.
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
      closingCta: {
        eyebrow: "الدقائق الأربعون القادمة",
        heading: "أحضر هدفاً واحداً، ونتتبّعه حتى المال.",
        body: "أربعون دقيقة على محفظة تشبه محفظتك: إداراتك، وفترتك، وأسماؤكم على القرارات. لا بيانات تجريبية.",
        secondaryLabel: "راسلنا بدلاً من ذلك",
        row1Label: "النشر",
        row1Body: "استضافة سيادية داخلية أو سحابية، داخل حدودكم.",
        row2Label: "اللغة",
        row2Body: "العربية والإنجليزية بمكانة واحدة، بما في ذلك التقارير.",
        row3Label: "التشغيل",
        row3Body: "إنترتك سيستمز، دبي. تسليم حَوكمة لجهات الإمارات والسعودية.",
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
