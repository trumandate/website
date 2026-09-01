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
    /** Added for the blog section (BUILD_FLAGS.md's 2026-08-19 decisions-log
     * entry: "blog section added for SEO and LLM discoverability"). Placed
     * between `benefits` and `contact` in every call site's own `links`
     * array (Nav.astro/NavDrawer.astro/Footer.astro each keep an independent
     * copy of that array — see their own file headers for why) so the blog
     * reads as one more content route ahead of the terminal contact link. */
    blog: string;
    contact: string;
    /** Mobile nav drawer trigger's accessible name while closed (P11, USER
     * REPORT fix: Strategy/Execution/Benefits vanish below `lg` because
     * Nav.astro's own container is desktop-only — the hamburger + drawer in
     * Header.astro/MobileNavDrawer.ts answers that). No reference source
     * (docs/design_handoff_website_redesign's SiteHeader(AR).dc.html has no
     * mobile breakpoint at all — checked, see NavDrawer.astro's own
     * comment), so written directly per BUILD_FLAGS' "written, not
     * machine-translated" rule, same as fragment/contact's invented strings. */
    openMenu: string;
    /** Same button's accessible name once the drawer is open — the name
     * changes with state (WAI-ARIA disclosure pattern), not a static label. */
    closeMenu: string;
  };
  cta: {
    /** Site-wide primary CTA label. Redesign wave A (docs/design_handoff_
     * website_redesign/README.md "Implementation Notes"): "Book a demo" /
     * "احجز عرضاً توضيحياً" everywhere — header, every hero, every closing
     * CTA, the contact form's own submit button (ContactForm.astro reuses
     * this key rather than a bespoke submit label). */
    primary: string;
    /** The home hero's ghost CTA only ("Follow one record" / "تتبَّع سجلاً
     * واحداً", scrolling to `#record`) — no other call site uses this key. */
    secondary: string;
  };
  langToggle: {
    /** Label shown while reading English — names Arabic, in Arabic. */
    toArabic: string;
    /** Label shown while reading Arabic — names English, in English. */
    toEnglish: string;
  };
  footer: {
    /** The company name, plain text in the redesigned slim-enterprise footer
     * (SiteFooter.dc.html) — P9's IntertecLogo.astro SVG swap is left in the
     * codebase, unreferenced, rather than deleted (it is not an orphaned
     * "old home component," it's a distinct footer-branding feature from an
     * earlier session); the reference's own footer draws plain text here, so
     * wave A matches it exactly rather than reintroducing a mark the
     * reference never shows. */
    company: string;
    /** "Dubai" — no longer used standalone (see `poweredBySuffix`, which
     * carries the redesign's own "· Dubai, UAE" clause); kept for backward
     * compatibility with nothing else in this table that still reads it. */
    location: string;
    site: string;
    /** "Powered by " / "مشغَّل من " — precedes `company` in the brand-credit
     * line (SiteFooter.dc.html). */
    poweredByPrefix: string;
    /** " · Dubai, UAE" / " · دبي، الإمارات" — follows `company`. */
    poweredBySuffix: string;
    /** Bottom hairline row, left half. */
    copyright: string;
    /** Bottom hairline row, right half — Latin in both languages
     * (SiteFooterAR.dc.html keeps "TruMandate™ · trumandate.com" un-mirrored,
     * `dir="ltr"` pinned). */
    trademark: string;
  };
  /** WCAG 1.4.1: the visually-hidden word every RAG dot carries alongside
   * its colour (PLAN.md §4 ambiguity 18). */
  ragStatus: {
    onTrack: string;
    atRisk: string;
    offTrack: string;
  };
  /**
   * Redesign wave A (docs/design_handoff_website_redesign/README.md — "Home"
   * screen, `Home (redesign).dc.html` / `Home AR (redesign).dc.html`). This
   * replaces the pre-redesign `home` shape wholesale: `hero`/`chain`/
   * `closingCta` reuse the old key names with new content and a new shape
   * (nothing outside the deleted home-only component tree ever read the old
   * ones — verified by grep before this change); `problem` and `stageGate`
   * are dropped outright (their one reader, FailureModes.astro/
   * StageGateQueue.astro, is deleted in the same change). `ai` is UNCHANGED —
   * SuggestionCard.astro's default props (`t("home.ai.badge")` etc.) still
   * back every product page's own AI moment (ProductPage.astro), so this
   * table keeps it exactly as authored. `aiQueue` is new and unrelated: the
   * redesigned home page's three-card decision queue, a different component
   * entirely (components/home/AiQueue.astro, not SuggestionCard).
   */
  home: {
    hero: {
      eyebrow: string;
      /** The H1 splits around a gradient-clip span (mint→cyan): concatenating
       * `headlineLead + headlineGradient + headlineTail` reproduces the
       * reference's sentence, including the closing full stop living in
       * `headlineTail`. */
      headlineLead: string;
      headlineGradient: string;
      headlineTail: string;
      lede: string;
      boardCaption: string;
    };
    proof: {
      stat1Label: string;
      stat2Label: string;
      stat3Label: string;
      stat4Label: string;
      /** Arabic renders "24" (counted) and "شهراً" as two separate spans
       * (Home AR (redesign).dc.html) rather than one counted-plus-suffix
       * span like the English "24 mo" — a genuine structural asymmetry in
       * the reference, reproduced as-is rather than normalised. */
      stat4UnitAr: string;
    };
    aiQueue: {
      eyebrow: string;
      heading: string;
      body: string;
      card1Badge: string;
      card1Title: string;
      card1Detail: string;
      card1Log: string;
      card2Badge: string;
      card2Title: string;
      card2Detail: string;
      card2Log: string;
      card3Badge: string;
      card3Title: string;
      card3Detail: string;
      card3Log: string;
      /** The single mint mono line under the cards' hairline rule (user
       * review fix, post-redesign, revised per the user's own mockup): a
       * four-item strip previously lived here and read as disconnected
       * fragments no matter how the columns were tightened, so it was cut
       * to this one sentence — "has ever" carries the emphasis the old
       * final item's plain present tense didn't. */
      auditLine: string;
    };
    chain: {
      eyebrow: string;
      heading: string;
      sub: string;
      /** The five record cards, in order — reused both for the card content
       * and (via `name`) the sticky counter's live name swap
       * (scripts/recordChain.ts). */
      record1Name: string;
      record1Kicker: string;
      record1Title: string;
      record1Body: string;
      record1Row1Label: string;
      record1Row1Value: string;
      record1Row2Label: string;
      record1Row2Value: string;
      record2Name: string;
      record2Kicker: string;
      record2Title: string;
      record2Body: string;
      record2Row1Label: string;
      record2Row1Value: string;
      record2Row2Label: string;
      record2Row2Value: string;
      record3Name: string;
      record3Kicker: string;
      record3Title: string;
      record3Body: string;
      record3Row1Label: string;
      record3Row1Value: string;
      record3Row2Label: string;
      record3Row2Value: string;
      record4Name: string;
      record4Kicker: string;
      record4Title: string;
      record4Body: string;
      record4Row1Label: string;
      record4Row1Value: string;
      record4Row2Label: string;
      record4Row2Value: string;
      record5Name: string;
      record5Kicker: string;
      record5Title: string;
      record5Body: string;
      record5Row1Label: string;
      record5Row1Value: string;
      record5Row2Label: string;
      record5Row2Value: string;
    };
    withoutRecord: {
      eyebrow: string;
      heading: string;
      col1Figure: string;
      col1Label: string;
      col1Body: string;
      col2Figure: string;
      col2Label: string;
      col2Body: string;
      col3Figure: string;
      col3Label: string;
      col3Body: string;
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
      body: string;
      /** The closing CTA's own ghost link ("Write to us instead" — a mailto,
       * distinct from `cta.secondary`'s "Follow one record"). */
      secondaryLabel: string;
      /** Mono eyebrow above the Deployment/Language/Operated-by column (user
       * review fix, post-redesign): announces the three rows as a spec list
       * rather than three unframed fragments next to the CTA. */
      essentialsEyebrow: string;
      row1Label: string;
      row1Body: string;
      row2Label: string;
      row2Body: string;
      row3Label: string;
      row3Body: string;
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
    /** Wires the contact email into the page per P7's own build list — not
     * a brief line, kept to one plain sentence rather than invented
     * marketing copy. Was the BUILD_FLAGS placeholder
     * (`hello@trumandate.com`) through P7; the real address
     * (`trumandate@intertecsys.com`) replaced it at P9 (user decision,
     * BUILD_FLAGS.md). */
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
    /** Mono footnote under the submit button (Contact (redesign).dc.html —
     * redesign wave B, carried verbatim): "We reply from a named address,
     * not a queue." / "نرد من عنوان باسم صاحبه، لا من قائمة انتظار." */
    footnote: string;
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
  /**
   * P9 — SEO metadata for the two routes that don't already carry their own
   * `<title>`/description (the three product pages keep theirs in
   * `components/product/copy.ts`'s `documentTitle`/`documentDescription`,
   * next to the rest of that page's copy — see that file's own doc comment
   * for why product copy isn't in this table). `home` and `contact` move
   * here from what was, through P7, a literal string written inline in each
   * `src/pages/{en,ar}/{index,contact}.astro` frontmatter — same text,
   * single source now. `ogImageAlt` is shared across every route in a given
   * language, since all ten routes point at the same one-per-language OG
   * image (spec §5A).
   */
  meta: {
    home: {
      title: string;
      description: string;
    };
    contact: {
      title: string;
      description: string;
    };
    /** og:image / twitter:image alt text — describes the actual image
     * (wordmark + chain motif on jade), not a restatement of the page title. */
    ogImageAlt: string;
  };
  /**
   * The blog section's own chrome — index page hero copy and the strings
   * BlogPostArticle.astro/BlogIndex.astro need (byline joiner, prev/next,
   * back-to-index). No brief source (trumandate-content-brief.md predates
   * the blog; trumandate-site-spec.md §1 in fact lists "no blog" as original
   * scope, superseded by BUILD_FLAGS.md's 2026-08-19 decisions-log entry),
   * so every string here is invented and written directly, not translated —
   * same discipline as `contact`/`fragment` above.
   */
  blog: {
    eyebrow: string;
    heading: string;
    sub: string;
    metaTitle: string;
    metaDescription: string;
    /** aria-label introducing a post's tag list — the tags themselves render
     * as plain kebab-case labels (no tag pages), this just names the group
     * for assistive tech, same purpose as `ragStatus`'s visually-hidden
     * status words. */
    tagsLabel: string;
    previousLabel: string;
    nextLabel: string;
    /** "All posts" — the back-to-index link on every post page. */
    indexLabel: string;
  };
}

export type UiDictionary = Record<Language, UiStrings>;
