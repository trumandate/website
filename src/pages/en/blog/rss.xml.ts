// /en/blog/rss.xml — hand-rolled RSS 2.0 endpoint (same precedent as
// src/pages/sitemap.xml.ts: a hand-written XML APIRoute rather than a
// package, per CLAUDE.md's "no new dependencies" and this build's own "no
// new packages" instruction for the blog section). Static (`output:
// "static"`), so this prerenders to dist/en/blog/rss.xml at build time like
// every other route.
import type { APIRoute } from "astro";
import { getPublishedPosts } from "../../../lib/blog";
import { ui } from "../../../i18n/ui";

const SITE = "https://www.trumandate.com";
const lang = "en" as const;

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
