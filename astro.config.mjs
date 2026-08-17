import { defineConfig } from "astro/config";

// Tailwind is wired through postcss.config.mjs rather than the deprecated
// @astrojs/tailwind integration. That package's peer range (astro ^3–^5) would
// have forced this project onto an Astro line with known high-severity XSS
// advisories (see BUILD_FLAGS.md decisions log). Tailwind v3 as a plain
// PostCSS plugin has no such constraint and needs no Astro-specific package.
//
// https://astro.build/config
export default defineConfig({
  site: "https://trumandate.com",
  output: "static",
  trailingSlash: "ignore",
  build: {
    // Default 'auto' only inlines stylesheets under Vite's ~4kb asset limit;
    // this project's single global stylesheet (~17KB) sits well above that,
    // so it was always shipped as an external, render-blocking <link> instead.
    // Under Slow 4G that request queues behind (and competes for bandwidth
    // with) the font preloads declared in BaseLayout.astro, adding ~600ms of
    // pure render-blocking delay before the hero <h1> (the LCP element, text
    // only) can paint — see known-issues.md's P4 section. 'always' inlines
    // the full stylesheet into a <style> tag in <head> instead, removing it
    // as a network request entirely. At this project's CSS size (one
    // stylesheet, no route-level code-splitting of styles) this costs HTML
    // bytes 1:1 for what the external file used to cost, well inside the
    // 900KB first-load budget (spec §9) — measured before/after in
    // known-issues.md.
    inlineStylesheets: "always",
  },
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
