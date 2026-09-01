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
