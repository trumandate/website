/**
 * The shape of one product page's copy (P6).
 *
 * Why this is a plain TS type and not a branch of `i18n/ui.ts`: that table is
 * `Record<Language, UiStrings>`, so adding a `product` branch there would
 * force an Arabic value to exist for every English string written this
 * prompt. `trumandate-product-pages.md` is explicit that Arabic for these
 * three pages is produced only after Piyush approves the English — writing
 * placeholder Arabic to satisfy a type would be exactly the wasted pass that
 * document is trying to avoid, and it would also break CLAUDE.md's "Arabic
 * never carries less content than English" invariant in the worst possible
 * way (by carrying *wrong* content instead of none).
 *
 * So each `/en/` product page declares its own copy object against this
 * type, in its own frontmatter, next to the page it belongs to and mirrored
 * verbatim in COPY-REVIEW.md. When the Arabic is approved, all three objects
 * move into `UiStrings.product` and `ProductPage.astro` reads them through
 * `useTranslations` instead — the component already takes `lang`, so nothing
 * else has to change. Logged in TODO.md.
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
}
