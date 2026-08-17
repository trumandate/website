export const languages = ["en", "ar"] as const;

export type Language = (typeof languages)[number];

export type Direction = "ltr" | "rtl";

export const directionFor: Record<Language, Direction> = {
  en: "ltr",
  ar: "rtl",
};

/**
 * Chrome strings from P1 (header, footer, skip link, language toggle, the two
 * global CTAs) plus, from P5, the home page's own body copy (hero, the three
 * failure modes, the chain, the AI moment, the closing CTA), moved here from
 * hardcoded English JSX per TODO.md's P2 note, now that `/ar` exists to keep
 * in sync with. Product-page copy (P6+) is written against
 * trumandate-product-pages.md and reviewed in COPY-REVIEW.md before its
 * Arabic is produced — it is not part of this table yet.
 */
export interface UiStrings {
  brand: {
    name: string;
  };
  skipLink: {
    label: string;
  };
  nav: {
    strategy: string;
    execution: string;
    benefits: string;
    contact: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
  langToggle: {
    /** Label shown while reading English — names Arabic, in Arabic. */
    toArabic: string;
    /** Label shown while reading Arabic — names English, in English. */
    toEnglish: string;
  };
  footer: {
    company: string;
    site: string;
  };
  /** WCAG 1.4.1: the visually-hidden word every RAG dot carries alongside
   * its colour (PLAN.md §4 ambiguity 18). */
  ragStatus: {
    onTrack: string;
    atRisk: string;
    offTrack: string;
  };
  home: {
    hero: {
      eyebrow: string;
      headline: string;
      lede: string;
      panelLabel: string;
      row1Label: string;
      row1Value: string;
      row2Label: string;
      row2Value: string;
      row3Label: string;
      row3Value: string;
      row4Label: string;
      row4Prefix: string;
      row4Suffix: string;
      row4Value: string;
    };
    problem: {
      eyebrow: string;
      heading: string;
      planningLabel: string;
      planningBody: string;
      executionLabel: string;
      executionBody: string;
      reportingLabel: string;
      reportingBody: string;
    };
    chain: {
      eyebrow: string;
      heading: string;
      sub: string;
      objectiveName: string;
      objectiveBody: string;
      kpiName: string;
      kpiBody: string;
      initiativeName: string;
      initiativeBody: string;
      milestoneName: string;
      milestoneBody: string;
      benefitName: string;
      benefitBody: string;
    };
    /** StageGateQueue.astro — invented product-fragment content (not sourced
     * from the content brief, which never gives this fragment's copy), so
     * Arabic here is authored per BUILD_FLAGS' "written, not
     * machine-translated" rule rather than translated verbatim from a
     * source line. */
    stageGate: {
      ariaLabel: string;
      gate1Label: string;
      gate2Label: string;
      ownerLabel: string;
      ownerValue: string;
      dueLabel: string;
      dueValue: string;
    };
    ai: {
      eyebrow: string;
      heading: string;
      body: string;
      badge: string;
      confidence: string;
      title: string;
      detail: string;
      accept: string;
      modify: string;
      reject: string;
      log: string;
    };
    closingCta: {
      eyebrow: string;
      heading: string;
      sub: string;
      caption: string;
    };
  };
  /**
   * The three product-page fragments' own labels (P6-AR). Invented, anonymised
   * product data — no brief source — so the Arabic is written per BUILD_FLAGS'
   * "written, not machine-translated" rule, exactly like `home.stageGate`.
   *
   * These live here and not in `product/copy.ts` because they really are all
   * strings, so they reach the SVG through `t()` the way `home.stageGate.*`
   * already does; the page-level copy has a `string[]` and a `number` in it
   * and cannot.
   *
   * Numerals inside fragments stay Western in both languages — spec §8's rule
   * read literally, and the pattern StageGateQueue.astro already ships
   * ("بوابة المرحلة · 04", "14 أغسطس"). The Arabic-Indic digits elsewhere on
   * `/ar` are the content brief's own, in page copy and AI cards, not in
   * product surfaces.
   */
  fragment: {
    kpiCard: {
      ariaLabel: string;
      ref: string;
      name: string;
      baselineLabel: string;
      baselineValue: string;
      targetLabel: string;
      targetValue: string;
      actualLabel: string;
      actualValue: string;
      sparklineLabel: string;
      nextRef: string;
      nextName: string;
      nextBaselineLabel: string;
      nextBaselineValue: string;
    };
    initiativeRows: {
      /** Assembled from the row data below, so the label and the drawn rows
       * cannot drift; the two sentences that frame them are here. */
      ariaLabelLead: string;
      ariaLabelTail: string;
      /** WCAG 1.4.1 again: the status word the aria-label spells out beside
       * each RAG dot, so colour never carries the status alone. */
      onTrack: string;
      atRisk: string;
      offTrack: string;
      /** "per cent", spelled out in the aria-label rather than read as "%". */
      perCent: string;
      initiativeHeader: string;
      statusHeader: string;
      progressHeader: string;
      row1Name: string;
      row1Objective: string;
      row2Name: string;
      row2Objective: string;
      row3Name: string;
      row3Objective: string;
      row4Name: string;
      row4Objective: string;
    };
    benefitCurve: {
      ariaLabel: string;
      recordLabel: string;
      windowLabel: string;
      actualLegend: string;
      forecastLegend: string;
      todayLabel: string;
    };
  };
  /**
   * `/contact` (P7). Fields, options and the three verbatim lede lines are
   * content brief §7, unedited. Everything else here — the email note, the
   * honeypot's decorative label, the validation/submission-status copy and
   * the sovereignty band's frame — has no brief source, so it is written per
   * BUILD_FLAGS' "written, not machine-translated" rule, exactly like
   * `home.stageGate` and `fragment.*`.
   */
  contact: {
    eyebrow: string;
    heading: string;
    sub: string;
    /** Wires the placeholder contact email (BUILD_FLAGS default,
     * `hello@trumandate.com`) into the page per P7's own build list — not a
     * brief line, kept to one plain sentence rather than invented marketing
     * copy. */
    emailNote: string;
    nameLabel: string;
    orgLabel: string;
    emailLabel: string;
    interestLegend: string;
    interestOption1: string;
    interestOption2: string;
    interestOption3: string;
    interestOption4: string;
    messageLabel: string;
    /** Visually hidden (aria-hidden) — decorative only; a real `<label>`
     * exists because the field is real markup, but no assistive-technology
     * user ever reaches it. */
    honeypotLabel: string;
    /** Submit button's text while the fetch is in flight. */
    submittingLabel: string;
    requiredError: string;
    emailError: string;
    /** Heading of the assertive, focus-moved error summary. */
    errorSummaryHeading: string;
    successHeading: string;
    successBody: string;
    /** Generic submission failure (network error, non-2xx response) — distinct
     * from the per-field validation errors above. */
    errorHeading: string;
    errorBody: string;
    /**
     * The deployment-and-data-sovereignty band (trumandate-product-pages.md:
     * "a three-line band that appears once on the home page and once on
     * /contact"). Only two of the described three lines exist verbatim
     * anywhere in the source material — this phrase (content brief §7's own
     * fourth interest option) as the band's frame, and the Fit-section chip
     * below as its one line of substance. No third line is invented to round
     * the count out to three; see TODO.md.
     */
    sovereigntyEyebrow: string;
    /** Content brief §6's Fit-section chip, verbatim — reused here as the
     * band's one sourced line of substance. */
    sovereigntyBody: string;
  };
}

export type UiDictionary = Record<Language, UiStrings>;
