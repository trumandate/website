// tools/export-copy.mjs — bilingual copy export for translation review.
//
// Emits one JSON file per route pairing every visible English string with its
// Arabic counterpart, so a native reviewer can read them side by side without
// opening the site or the codebase.
//
// Source is `dist/`, not the i18n dictionaries: the dictionaries hold strings
// that may no longer be rendered, and miss everything that comes from the
// content collection (the blog posts are Markdown, not dictionary keys). What
// ships is what gets reviewed.
//
// Pairing is by position. Both languages render the same component tree from
// the same templates, so the Nth extracted block on /en/x is the counterpart
// of the Nth on /ar/x. Where the counts differ the export says so loudly
// rather than silently sliding the two columns out of step — a count mismatch
// is itself a finding worth a reviewer's attention (CLAUDE.md: "Arabic never
// carries less content than English").
//
// No dependencies (CLAUDE.md forbids adding any), so the HTML walk below is
// hand-rolled: it only needs to find text inside a known set of block tags in
// document order, which does not require a full parser.
//
// Usage:  npm run build  &&  node tools/export-copy.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, "copy-review");

// Route stems present in both languages. Blog posts are added dynamically.
const STEMS = [
  ["", "Home"],
  ["strategy", "Strategy and KPIs"],
  ["execution", "Execution and governance"],
  ["benefits", "Benefits realisation"],
  ["contact", "Contact / demo request"],
  ["blog", "Blog index"],
];

const BLOG_POSTS = [
  ["blog/what-is-portfolio-governance", "Post: what is portfolio governance"],
  ["blog/strategy-execution-gap", "Post: the strategy execution gap"],
  [
    "blog/benefits-realisation-after-closure",
    "Post: benefits realisation after closure",
  ],
];

// Tags whose text is a reviewable unit. `option`/`legend`/`label`/`button`
// matter because the contact form's controls are copy too.
const BLOCKS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "li", "a", "button", "label", "legend", "figcaption",
  "th", "td", "blockquote", "summary", "option",
]);

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", rsquo: "’",
  lsquo: "‘", ldquo: "“", rdquo: "”", middot: "·",
  times: "×", laquo: "«", raquo: "»",
};

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

/**
 * Pull visible block-level strings out of a built page, in document order.
 * Nested blocks (a link inside a paragraph) yield the outer block's full text
 * once; the inner tag is not emitted separately, so a reviewer reads whole
 * sentences rather than fragments.
 */
function extract(html) {
  // Everything a reader never sees.
  let body = html.slice(html.indexOf("<body"));
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const out = [];
  const tagRe = /<(\/?)([a-z][a-z0-9]*)\b([^>]*)>/gi;
  let match;
  let openTag = null; // the block currently being collected
  let depth = 0; // nesting depth inside it
  let buf = "";
  let cursor = 0;
  let ariaHidden = false;

  while ((match = tagRe.exec(body)) !== null) {
    const [full, closing, rawName, attrs] = match;
    const name = rawName.toLowerCase();

    if (openTag) {
      buf += body.slice(cursor, match.index);
      if (name === openTag) depth += closing ? -1 : 1;
      if (closing && name === openTag && depth === 0) {
        const text = decode(buf).replace(/\s+/g, " ").trim();
        if (text && !ariaHidden) out.push({ tag: openTag, text });
        openTag = null;
        buf = "";
        ariaHidden = false;
      }
    } else if (!closing && BLOCKS.has(name)) {
      // Self-closing or void forms never wrap text.
      if (!full.endsWith("/>")) {
        openTag = name;
        depth = 1;
        buf = "";
        ariaHidden = /aria-hidden=["']true["']/i.test(attrs);
      }
    }
    cursor = tagRe.lastIndex;
  }
  return out;
}

function readPage(lang, stem) {
  const rel = stem ? join(lang, stem, "index.html") : join(lang, "index.html");
  const file = join(DIST, rel);
  if (!existsSync(file)) return null;
  return extract(readFileSync(file, "utf8"));
}

if (!existsSync(DIST)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const routes = [...STEMS, ...BLOG_POSTS];
const index = [];
let totalRows = 0;
let totalMismatch = 0;

for (const [stem, title] of routes) {
  const en = readPage("en", stem);
  const ar = readPage("ar", stem);
  if (!en || !ar) {
    console.warn(`skipped ${stem || "home"} — missing build output`);
    continue;
  }

  // Align the two block sequences instead of zipping them by index: one
  // extra or missing block early in a page would otherwise slide every
  // later row out of step and report a whole page as mismatched. Classic
  // LCS over the tag sequence — the pages are a few hundred blocks, so the
  // quadratic table is free — then walk the backtrace emitting matched
  // pairs, plus EN-only / AR-only rows where one side genuinely has a block
  // the other does not. Those rows are the real signal: an EN-only row is
  // Arabic carrying less content, which CLAUDE.md forbids.
  const lcs = Array.from({ length: en.length + 1 }, () =>
    new Uint16Array(ar.length + 1),
  );
  for (let i = en.length - 1; i >= 0; i--) {
    for (let j = ar.length - 1; j >= 0; j--) {
      lcs[i][j] =
        en[i].tag === ar[j].tag
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows = [];
  let onlyEn = 0;
  let onlyAr = 0;
  let i = 0;
  let j = 0;
  while (i < en.length && j < ar.length) {
    if (en[i].tag === ar[j].tag) {
      rows.push({ element: en[i].tag, en: en[i].text, ar: ar[j].text });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      rows.push({ element: en[i].tag, en: en[i].text, ar: null, missingArabic: true });
      onlyEn++;
      i++;
    } else {
      rows.push({ element: ar[j].tag, en: null, ar: ar[j].text, extraArabic: true });
      onlyAr++;
      j++;
    }
  }
  for (; i < en.length; i++) {
    rows.push({ element: en[i].tag, en: en[i].text, ar: null, missingArabic: true });
    onlyEn++;
  }
  for (; j < ar.length; j++) {
    rows.push({ element: ar[j].tag, en: null, ar: ar[j].text, extraArabic: true });
    onlyAr++;
  }

  // Number the rows and give the reviewer their two empty fields.
  rows.forEach((r, n) => {
    r.n = n + 1;
    r.verdict = "";
    r.comment = "";
  });
  const mismatched = onlyEn + onlyAr;

  const slug = stem ? stem.replace(/\//g, "-") : "home";
  const payload = {
    route: { en: `/en/${stem}${stem ? "/" : ""}`, ar: `/ar/${stem}${stem ? "/" : ""}` },
    title,
    generated: new Date().toISOString().slice(0, 10),
    counts: {
      en: en.length,
      ar: ar.length,
      pairs: rows.length - mismatched,
      englishWithoutArabic: onlyEn,
      arabicWithoutEnglish: onlyAr,
    },
    howToUse:
      "Read `en` and `ar` for each row. Put 'ok' or 'change' in `verdict` and " +
      "the corrected Arabic (or the issue) in `comment`. A row flagged " +
      "`missingArabic` has English with no Arabic counterpart; " +
      "`extraArabic` is the reverse. Both are worth a look before the wording " +
      "itself — the site's rule is that Arabic never carries less than English.",
    rows,
  };

  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(payload, null, 2), "utf8");
  index.push({
    file: `${slug}.json`,
    title,
    route: payload.route,
    strings: rows.length,
    englishWithoutArabic: onlyEn,
    arabicWithoutEnglish: onlyAr,
  });
  totalRows += rows.length;
  totalMismatch += mismatched;
}

writeFileSync(
  join(OUT, "index.json"),
  JSON.stringify(
    {
      site: "https://www.trumandate.com",
      generated: new Date().toISOString().slice(0, 10),
      purpose:
        "Bilingual copy export for native-reader review of the Arabic against the English.",
      totals: {
        pages: index.length,
        strings: totalRows,
        unpairedBlocks: totalMismatch,
      },
      pages: index,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(
  `wrote ${index.length} page files + index.json to copy-review/ ` +
    `(${totalRows} rows, ${totalMismatch} unpaired blocks)`,
);
