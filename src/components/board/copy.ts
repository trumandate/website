// board/copy.ts — CommandCentreBoard's own bilingual copy, verbatim from
// docs/design_handoff_website_redesign/CommandCentreBoard.dc.html and
// CommandCentreBoardAR.dc.html. Kept local to this component rather than
// folded into i18n/ui.ts, same precedent as src/components/product/copy.ts:
// this is a large, single-component-scoped data blob (workspace chrome,
// four KPI tiles, a chart, an AI-watch panel), not chrome or page-narrative
// copy the rest of the site reads through `t()`.
//
// The board is invented anonymised product data (spec's own "anonymise the
// data, never the interface" rule) — figures match across both languages
// exactly (86%, 71%, 48, AED 1.32B, 142 projects, 78/15/7%), only the labels
// translate. Digits stay Western in both languages, matching the repo's
// established fragment convention (KpiCard.astro, InitiativeRows.astro).
import type { Language } from "../../i18n/types";

export interface BoardCopy {
  ariaLabel: string;
  workspaceLabel: string;
  breadcrumbSep: string;
  pageTitle: string;
  aiRunBadge: string;
  langChipLabel: string;
  nav: {
    home: string;
    commandCentre: string;
    aiDecisions: string;
    deliverGroup: string;
    projectExecution: string;
    stageGates: string;
    proveGroup: string;
    benefitsRegister: string;
  };
  breadcrumb: string;
  deptFilter: string;
  periodFilter: string;
  kpi: {
    healthLabel: string;
    budgetLabel: string;
    budgetSuffix: string;
    budgetTarget: string;
    risksLabel: string;
    benefitsLabel: string;
  };
  chart: {
    title: string;
    actualLegend: string;
    targetLegend: string;
    flagLabel: string;
    janLabel: string;
    julLabel: string;
    decLabel: string;
    donutPrefix: string;
    onTrack: string;
    atRisk: string;
    offTrack: string;
  };
  aiPanel: {
    title: string;
    waitingChip: string;
    confidenceLabel: string;
    item1Dept: string;
    item1Title: string;
    item1Detail: string;
    item2Dept: string;
    item2Title: string;
    escalationDept: string;
    escalationChip: string;
    escalationTitle: string;
    accept: string;
    modify: string;
    reject: string;
    footerLine: string;
  };
}

const en: BoardCopy = {
  ariaLabel:
    "Performance Command Centre. Compact KPIs: portfolio health 86 per cent, budget utilisation 71 per cent, 48 active risks, AED 1.32B benefits realised. A performance-over-time chart carries an AI flag on the July dip; an AI watch panel holds six suggestions waiting on a named person, cropped at the frame edge.",
  workspaceLabel: "Workspace",
  breadcrumbSep: "/",
  pageTitle: "Performance Command Centre",
  aiRunBadge: "AI RUN · 06:00",
  langChipLabel: "العربية",
  nav: {
    home: "Home",
    commandCentre: "Command Centre",
    aiDecisions: "AI Decisions",
    deliverGroup: "Deliver",
    projectExecution: "Project Execution",
    stageGates: "Stage Gates",
    proveGroup: "Prove",
    benefitsRegister: "Benefits Register",
  },
  breadcrumb: "Projects › Command Centre",
  deptFilter: "All departments",
  periodFilter: "Jan – Dec 2026",
  kpi: {
    healthLabel: "Portfolio health",
    budgetLabel: "Budget utilisation",
    budgetSuffix: "used",
    budgetTarget: "TARGET 68%",
    risksLabel: "Active risks",
    benefitsLabel: "Benefits realised",
  },
  chart: {
    title: "Performance over time",
    actualLegend: "Actual",
    targetLegend: "Target",
    flagLabel: "AI FLAG · SLIP CAUGHT IN JUN",
    janLabel: "JAN",
    julLabel: "JUL",
    decLabel: "DEC",
    donutPrefix: "142 projects · ",
    onTrack: "78% on track",
    atRisk: "15% at risk",
    offTrack: "7% off track",
  },
  aiPanel: {
    title: "AI watch",
    waitingChip: "6 waiting on a person",
    confidenceLabel: "confidence",
    item1Dept: "Execution · Initiative 07",
    item1Title: "Milestone slip predicted: 12 days",
    item1Detail:
      "Two dependencies unresolved at gate 3. Suggests re-sequencing gate 4.",
    item2Dept: "Strategy · KPI 2.1 / 4.3",
    item2Title: "Two KPIs counting one benefit",
    escalationDept: "Escalation · Core ERP",
    escalationChip: "Critical",
    escalationTitle: "Delayed 34 days · overrun 18%",
    accept: "Accept",
    modify: "Modify",
    reject: "Reject",
    footerLine: "3 closed today · every decision logged with a name",
  },
};

const ar: BoardCopy = {
  ariaLabel:
    "مركز قيادة الأداء: صحة المحفظة 86 بالمئة، واستخدام الميزانية 71 بالمئة، و48 خطراً نشطاً، ومنافع محققة 1.32 مليار درهم. رسم للأداء عبر الزمن يحمل علامة ذكاء اصطناعي، ولوحة مراقبة ذكية فيها ستة اقتراحات بانتظار شخص، مقصوصة عند حافة الإطار.",
  workspaceLabel: "مساحة العمل",
  breadcrumbSep: "/",
  pageTitle: "مركز قيادة الأداء",
  aiRunBadge: "تشغيل الذكاء · 06:00",
  langChipLabel: "English",
  nav: {
    home: "الرئيسية",
    commandCentre: "مركز القيادة",
    aiDecisions: "قرارات الذكاء",
    deliverGroup: "التنفيذ",
    projectExecution: "تنفيذ المشاريع",
    stageGates: "بوابات المراحل",
    proveGroup: "الإثبات",
    benefitsRegister: "سجل المنافع",
  },
  breadcrumb: "المشاريع › مركز القيادة",
  deptFilter: "كل الإدارات",
  periodFilter: "يناير – ديسمبر 2026",
  kpi: {
    healthLabel: "صحة المحفظة",
    budgetLabel: "استخدام الميزانية",
    budgetSuffix: "من AED 218M",
    budgetTarget: "المستهدف 68%",
    risksLabel: "المخاطر النشطة",
    benefitsLabel: "المنافع المحققة",
  },
  chart: {
    title: "الأداء عبر الزمن",
    actualLegend: "الفعلي",
    targetLegend: "المستهدف",
    flagLabel: "علامة ذكاء · رُصد التأخير في يونيو",
    janLabel: "يناير",
    julLabel: "يوليو",
    decLabel: "ديسمبر",
    donutPrefix: "142 مشروعاً · ",
    onTrack: "78% على المسار",
    atRisk: "15% في خطر",
    offTrack: "7% خارج المسار",
  },
  aiPanel: {
    title: "مراقبة ذكية",
    waitingChip: "6 بانتظار شخص",
    confidenceLabel: "الثقة",
    item1Dept: "التنفيذ · المبادرة 07",
    item1Title: "تأخير متوقَّع في المعلم: 12 يوماً",
    item1Detail: "تبعيتان غير محلولتين عند البوابة 3. يقترح إعادة ترتيب البوابة 4.",
    item2Dept: "الاستراتيجية · المؤشران 2.1 / 4.3",
    item2Title: "مؤشران يحتسبان منفعة واحدة",
    escalationDept: "",
    escalationChip: "",
    escalationTitle: "",
    accept: "قبول",
    modify: "تعديل",
    reject: "رفض",
    footerLine: "أُغلقت 3 اليوم · كل قرار مسجَّل باسم صاحبه",
  },
};

export function boardCopy(lang: Language): BoardCopy {
  return lang === "ar" ? ar : en;
}
