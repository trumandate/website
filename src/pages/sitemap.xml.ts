// sitemap.xml.ts — P9. Static XML endpoint (output: "static", so this
// prerenders to dist/sitemap.xml at build time like every other route).
//
// Deliberately hand-written rather than an XML-sitemap integration: the
// route list is five fixed suffixes across two languages, exactly the same
// shape i18n/utils.ts's `pairedRoutes` already tracks (both are the "every
// route exists in both languages" fact, expressed for two different
// readers — humans clicking the language toggle vs. a crawler). Ten <url>
// entries, each carrying all three hreflang alternates (en, ar, x-default)
// per Google's documented bidirectional-annotation requirement — every
// localized version, including the page itself, must list every version.
//
// Referenced from public/robots.txt even though that file currently
// disallows all crawling (pre-launch noindex, BUILD_FLAGS/TODO.md) — see
// that file's own comment for why a disallowed sitemap reference isn't a
// contradiction.
import type { APIRoute } from "astro";
import type { Language } from "../i18n/types";

const SITE = "https://trumandate.com";
const LANGUAGES: Language[] = ["en", "ar"];
// Same five suffixes as i18n/utils.ts's `pairedRoutes` — every route exists
// in both languages as of P7.
const ROUTES = ["/", "/strategy", "/execution", "/benefits", "/contact"];

function urlFor(lang: Language, route: string): string {
  const suffix = route === "/" ? "/" : `${route}/`;
  return `${SITE}/${lang}${suffix}`;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export const GET: APIRoute = () => {
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
