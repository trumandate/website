import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog collection — bilingual, one directory per language.
 *
 * Entry ids come out of the glob loader as `en/<slug>` and `ar/<slug>`, so a
 * translation pair shares a slug but not an id. `translationKey` carries that
 * shared slug explicitly rather than being parsed back out of the id, because
 * the hreflang pairing in the layout needs it as data, and because a future
 * post whose Arabic version lands under a different filename would otherwise
 * break silently.
 *
 * `lang` is duplicated from the directory for the same reason: the frontmatter
 * is the authority, and a file in the wrong directory should fail validation
 * against its own declared language rather than be inferred into correctness.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    /** Meta description. Kept to 155 characters so it survives a SERP intact. */
    description: z.string().max(155),
    pubDate: z.coerce.date(),
    author: z.string(),
    lang: z.enum(["en", "ar"]),
    /** Shared slug across a translation pair; drives the hreflang alternates. */
    translationKey: z.string(),
    /** Three to five, lowercase kebab. */
    tags: z.array(z.string()).min(3).max(5),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
