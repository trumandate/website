// /ar/blog/rss.xml — the Arabic RSS feed. Mirrors
// src/pages/en/blog/rss.xml.ts exactly (same hand-rolled precedent); see
// that file for the endpoint's own comment.
import type { APIRoute } from "astro";
import { getPublishedPosts } from "../../../lib/blog";
import { ui } from "../../../i18n/ui";

const SITE = "https://www.trumandate.com";
const lang = "ar" as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts(lang);
  const channelLink = `${SITE}/${lang}/blog/`;

  const items = posts
    .map((post) => {
      const link = `${SITE}/${lang}/blog/${post.data.translationKey}/`;
      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description>${escapeXml(post.data.description)}</description>
    <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
  </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(ui[lang].blog.metaTitle)}</title>
  <link>${channelLink}</link>
  <description>${escapeXml(ui[lang].blog.metaDescription)}</description>
  <language>${lang}</language>
${items}
</channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
