// lib/blog.ts — shared helpers for the blog section (BUILD_FLAGS.md's
// 2026-08-19 decisions-log entry: "blog section added for SEO and LLM
// discoverability"). Used by every blog route (both language index pages,
// both language post routes, both RSS endpoints, sitemap.xml.ts and
// llms.txt.ts) so "which posts are published, in what order, formatted how"
// is answered in exactly one place rather than re-derived per call site.
import { getCollection, type CollectionEntry } from "astro:content";
import type { Language } from "../i18n/types";

export type BlogPost = CollectionEntry<"blog">;

/**
 * Published posts (draft: false) for one language, newest first. Every
 * index/post/RSS/sitemap call site that needs "the posts in reading order"
 * gets it from here rather than re-filtering + re-sorting `getCollection`
 * output independently, which would risk the four call sites drifting to
 * different orders over time.
 */
export async function getPublishedPosts(lang: Language): Promise<BlogPost[]> {
  const posts = await getCollection(
    "blog",
    (entry) => entry.data.lang === lang && !entry.data.draft,
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** en-GB for English, the Arabic locale's own date form for Arabic — spec
 * brief's own "locale-formatted" instruction for the post byline. */
export function formatPostDate(date: Date, lang: Language): string {
  const locale = lang === "ar" ? "ar" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Words a reader gets through in a minute, per language. Not a design token
 * (nothing in tailwind.config.mjs renders at this value) — a reading-research
 * constant, so it lives beside the function that uses it.
 *
 * The two differ on purpose. Silent-reading rates for English prose are
 * commonly measured around 220–260 wpm; published Arabic rates sit lower,
 * around 140–180 wpm. Using one number for both would have reported the
 * Arabic translation of the same article as materially shorter than the
 * English original purely because Arabic says the same thing in fewer words
 * — the opposite of true. Measured on the built pages with these two rates,
 * the three current translation pairs report 7/7, 7/7 and 7/8 minutes — i.e.
 * a translation pair lands on the same figure or within a minute of it,
 * which is the right answer for the same article told twice.
 */
const WORDS_PER_MINUTE: Record<Language, number> = {
  en: 230,
  ar: 180,
};

/**
 * Whole minutes to read a post's body, floored at 1. Plain word count off the
 * raw Markdown (`entry.body`, which the glob loader hands over without
 * frontmatter) with the syntax characters stripped, so a heading's `##` and a
 * link's URL are not counted as words. No dependency: CLAUDE.md's "no new
 * dependencies", and a reading-time package would be ~30 lines of this.
 *
 * `\s+` splits Arabic exactly as it splits English — Arabic is space-
 * separated — so no per-script branch is needed here, only the per-language
 * rate above.
 */
export function readingTime(body: string, lang: Language): number {
  const words = body
    // Fenced code, then inline code: never prose, and a code block would
    // otherwise inflate the estimate badly. (No current post carries either;
    // this keeps the estimate honest for one that does.)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    // A link's visible label is prose, its URL is not.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Leading Markdown furniture: heading hashes, list bullets, blockquote
    // marks, emphasis. Anchored per line so a hyphen inside a word survives.
    .replace(/^[>#\s]*[-*+]?\s*/gm, " ")
    .replace(/[*_]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE[lang]));
}

/**
 * Picks between the two reading-time strings in the UI dictionary and fills
 * the count in, formatted in the reading language's own numerals (Arabic gets
 * Arabic-Indic digits, matching `formatPostDate` above, which already does).
 *
 * Two forms, not one, because Arabic agrees the counted noun with the number:
 * 3–10 takes the plural (دقائق), everything else the singular (دقيقة).
 * `Intl.PluralRules` — built in, no dependency — is what decides which,
 * rather than a hand-written `n >= 3 && n <= 10`, so the rule stays correct
 * if a third language is ever added. English maps both categories to the same
 * template, since "1 min read" and "7 min read" share a form.
 */
export function formatReadingTime(
  minutes: number,
  lang: Language,
  templates: { few: string; other: string },
): string {
  const locale = lang === "ar" ? "ar" : "en-GB";
  const category = new Intl.PluralRules(locale).select(minutes);
  const template = category === "few" ? templates.few : templates.other;
  return template.replace(
    "{minutes}",
    new Intl.NumberFormat(locale).format(minutes),
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

// The exact heading text every post's own closing FAQ section uses (verified
// by reading all three EN and all three AR posts before writing this) —
// matched literally rather than by a loose heuristic ("a heading ending in
// '?'" would also match section titles like "What is portfolio governance?"
// higher up the same post), so a post with no such section reliably parses
// to `null` instead of grabbing the wrong block.
const FAQ_HEADING: Record<Language, string> = {
  en: "Common questions",
  ar: "أسئلة شائعة",
};

// The one H2 that always follows the FAQ section in every post as authored
// — used only to find the FAQ section's own end; a post that omits it simply
// runs the FAQ section to the end of the file instead (see `endIdx` below).
const CLOSING_HEADING: Record<Language, string> = {
  en: "Where this comes from",
  ar: "من أين جاء هذا",
};

/** Strips the handful of inline Markdown constructs a FAQ answer might carry
 * (bold, italic, inline code, links) down to plain prose — FAQPage's
 * `Answer.text` is plain text, not Markdown, and re-serialising Markdown
 * syntax into JSON-LD would read as broken formatting to anything that
 * renders the rich result literally. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

/**
 * Parses the "Common questions"/"أسئلة شائعة" section straight out of a
 * post's own raw Markdown body (`entry.body` — the glob loader's default
 * `retainBody: true`, unchanged in content.config.ts) rather than the
 * rendered HTML: the source is the one representation that cannot have
 * drifted from what the author actually wrote, and it is far simpler to
 * split on `^## `/`^### ` than to walk a rendered AST.
 *
 * Returns null the moment the shape doesn't match cleanly (no such H2, or an
 * H2 with no H3 children) — per the build brief, a page whose FAQ content
 * can't be parsed with confidence emits BlogPosting only rather than risk
 * mis-attributed Q/A pairs in structured data.
 */
export function parseFaq(body: string, lang: Language): FaqItem[] | null {
  const heading = FAQ_HEADING[lang];
  const closing = CLOSING_HEADING[lang];
  const lines = body.replace(/\r\n/g, "\n").split("\n");

  const startIdx = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (startIdx === -1) return null;

  let endIdx = lines.findIndex(
    (line, i) => i > startIdx && line.trim() === `## ${closing}`,
  );
  if (endIdx === -1) endIdx = lines.length;

  const section = lines.slice(startIdx + 1, endIdx).join("\n");
  // Split on H3 boundaries; `.slice(1)` drops anything before the first ###
  // (there shouldn't be any prose directly under the FAQ H2 in the posts as
  // authored, but this keeps a stray paragraph there from becoming a
  // malformed first "question").
  const blocks = section.split(/^### /m).slice(1);

  const items: FaqItem[] = [];
  for (const block of blocks) {
    const newlineIdx = block.indexOf("\n");
    if (newlineIdx === -1) continue;
    const question = block.slice(0, newlineIdx).trim();
    const answer = toPlainText(block.slice(newlineIdx + 1));
    if (question && answer) items.push({ question, answer });
  }

  return items.length > 0 ? items : null;
}
