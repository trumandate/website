// /llms.txt — build-time endpoint following the llms.txt convention (BUILD_
// FLAGS.md's 2026-08-19 decisions-log entry: "blog section added for SEO and
// LLM discoverability (GEO)"). Hand-rolled plain Markdown, same "no new
// packages" precedent as sitemap.xml.ts/rss.xml.ts — there is no official
// Astro integration for this, and the shape is five short sections, not
// worth a dependency.
//
// Every description below is an EXISTING meta/copy string (documentDescription
// in components/product/copy.ts, i18n/ui.ts's meta/contact/blog strings, or a
// post's own frontmatter description) — nothing here states a new fact about
// the product, per CLAUDE.md's "never invent a statistic... write numbers
// rather than adjectives" applied to this file too.
import type { APIRoute } from "astro";
import { productCopy } from "../components/product/copy";
import { ui } from "../i18n/ui";
import { getPublishedPosts } from "../lib/blog";
import type { Language } from "../i18n/types";

const SITE = "https://www.trumandate.com";

function pageUrl(lang: Language, suffix: string): string {
  const path = suffix === "/" ? "/" : `${suffix}/`;
  return `${SITE}/${lang}${path}`;
}

// The five product/site pages' own titles, brand-suffix stripped — same
// " — TruMandate" convention every documentTitle/meta title in this codebase
// already uses (see seo/JsonLd.astro's own `stripBrandSuffix`).
function stripBrandSuffix(title: string): string {
  const suffix = " — TruMandate";
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

// The home page's own <title> carries the brand NAME first ("TruMandate —
// <headline>"), the opposite convention from every other page's own
// "<title> — TruMandate" — so `stripBrandSuffix` can't clean it up the same
// way. Rather than parse a prefix instead of a suffix, the home entry gets
// the plain structural label every site's own nav conventionally uses for
// its landing page, matching this codebase's own header/footer brand link
// (`aria-label={t("brand.name")}` on the wordmark, `href={/${lang}/}`) —
// not a new marketing claim, just what the link is.
const HOME_LABEL: Record<Language, string> = { en: "Home", ar: "الرئيسية" };

function sitePages(lang: Language) {
  const copy = productCopy[lang];
  const t = ui[lang];
  return [
    {
      title: HOME_LABEL[lang],
      url: pageUrl(lang, "/"),
      description: t.meta.home.description,
    },
    {
      title: stripBrandSuffix(copy.strategy.documentTitle),
      url: pageUrl(lang, "/strategy"),
      description: copy.strategy.documentDescription,
    },
    {
      title: stripBrandSuffix(copy.execution.documentTitle),
      url: pageUrl(lang, "/execution"),
      description: copy.execution.documentDescription,
    },
    {
      title: stripBrandSuffix(copy.benefits.documentTitle),
      url: pageUrl(lang, "/benefits"),
      description: copy.benefits.documentDescription,
    },
    {
      title: stripBrandSuffix(t.meta.contact.title),
      url: pageUrl(lang, "/contact"),
      description: t.contact.sub,
    },
  ];
}

function renderList(items: { title: string; url: string; description: string }[]): string {
  return items
    .map((item) => `- [${item.title}](${item.url}): ${item.description}`)
    .join("\n");
}

export const GET: APIRoute = async () => {
  const enPages = sitePages("en");
  const arPages = sitePages("ar");
  const enPosts = await getPublishedPosts("en");
  const arPosts = await getPublishedPosts("ar");

  const enPostItems = enPosts.map((post) => ({
    title: post.data.title,
    url: `${SITE}/en/blog/${post.data.translationKey}/`,
    description: post.data.description,
  }));
  const arPostItems = arPosts.map((post) => ({
    title: post.data.title,
    url: `${SITE}/ar/blog/${post.data.translationKey}/`,
    description: post.data.description,
  }));

  const body = `# ${ui.en.brand.name}

${ui.en.meta.home.description}

## English site

${renderList(enPages)}

## Blog (English)

${renderList(enPostItems)}

## Arabic site (الموقع بالعربية)

${renderList(arPages)}

## Blog (Arabic — المدونة)

${renderList(arPostItems)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
