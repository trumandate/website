// sitemap.xml.ts — P9, extended 2026-08-19 for the blog section
// (BUILD_FLAGS.md's decisions-log entry: "sitemap inclusion"). Static XML
// endpoint (output: "static", so this prerenders to dist/sitemap.xml at
// build time like every other route).
//
// Deliberately hand-written rather than an XML-sitemap integration: the
// static route list is five fixed suffixes across two languages, exactly the
// same shape i18n/utils.ts's `pairedRoutes` already tracks (both are the
// "every route exists in both languages" fact, expressed for two different
// readers — humans clicking the language toggle vs. a crawler). The blog
// index and every post add their own suffixes on top, read from the content
// collection at build time rather than hand-enumerated — a fourth blog post
// should not require touching this file. Every <url> entry, static or blog,
// carries all three hreflang alternates (en, ar, x-default) per Google's
// documented bidirectional-annotation requirement — every localized version,
// including the page itself, must list every version.
//
// Referenced from public/robots.txt even though that file currently
// disallows all crawling (pre-launch noindex, BUILD_FLAGS/TODO.md) — see
// that file's own comment for why a disallowed sitemap reference isn't a
// contradiction.
import type { APIRoute } from "astro";
import type { Language } from "../i18n/types";
import { getPublishedPosts } from "../lib/blog";

const SITE = "https://www.trumandate.com";
const LANGUAGES: Language[] = ["en", "ar"];
// Same five suffixes as i18n/utils.ts's `pairedRoutes` — every route exists
// in both languages as of P7.
const STATIC_ROUTES = ["/", "/strategy", "/execution", "/benefits", "/contact"];

function urlFor(lang: Language, route: string): string {
  const suffix = route === "/" ? "/" : `${route}/`;
  return `${SITE}/${lang}${suffix}`;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export const GET: APIRoute = async () => {
  // Every post's translationKey is the shared slug across both languages
  // (the content author's own guarantee — see src/lib/blog.ts). Reading only
  // the English collection for the slug list, rather than merging both
  // languages' own lists, keeps this file agnostic to which language a
  // future mismatch might land in; a slug missing its counterpart would 404
  // on one alternate rather than fail silently either way, which is the
  // existing content collection's problem to catch, not this file's.
  const enPosts = await getPublishedPosts("en");
  const blogRoutes = [
    "/blog",
    ...enPosts.map((post) => `/blog/${post.data.translationKey}`),
  ];
  const ROUTES = [...STATIC_ROUTES, ...blogRoutes];

  const entries = ROUTES.flatMap((route) =>
    LANGUAGES.map((lang) => {
      const loc = urlFor(lang, route);
      const alternates = [
        `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(urlFor("en", route))}" />`,
        `    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(urlFor("ar", route))}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(urlFor("en", route))}" />`,
      ].join("\n");
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${alternates}\n  </url>`;
    }),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
