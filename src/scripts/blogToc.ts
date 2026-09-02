// blogToc.ts — marks which section the reader is in, in the post page's
// sticky "On this page" rail (USER REPORT 2026-09-02: "the section is
// sticking to the page but not highlighting whichever section is being
// watched as we scroll").
//
// Progressive enhancement, strictly. The rail ships as plain in-page
// anchors that work with scripting off (BlogPostArticle.astro's own
// comment); this file only ADDS `aria-current="location"` to whichever
// link matches the section under the reading line. If it never runs, the
// rail is exactly what it was — no element depends on it to be visible,
// legible or clickable.
//
// `aria-current="location"` rather than a class: it is the attribute ARIA
// defines for "the current item within a set of related elements", so the
// state reaches assistive tech instead of being purely visual, and the
// stylesheet can hang the marker off real state rather than a duplicate
// class (same economy Header.astro uses reading `aria-expanded`).
//
// Why a rAF-throttled scroll listener rather than IntersectionObserver:
// an observer reports *when a boundary is crossed*, but the question here
// is "which heading is the last one above the reading line", which still
// needs a measurement pass at the moment of the answer — and an observer
// fires nothing at all while the reader sits inside one long section,
// including at the page-bottom case the last heading depends on. One
// passive listener over ~9 elements, coalesced into a frame, is both
// simpler and correct. scripts/recordChain.ts already set this precedent.

const DESKTOP = "(min-width: 1024px)"; // `lg` — below it the rail is display:none

export function initBlogToc(): void {
  const nav = document.querySelector<HTMLElement>("[data-blog-toc]");
  if (!nav) return;

  const links = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>("a[href^='#']"),
  );
  if (links.length === 0) return;

  // Pair each link with its heading once. A link whose target is missing is
  // dropped rather than guarded on every frame.
  const pairs = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const heading = id ? document.getElementById(id) : null;
      return heading ? { link, heading } : null;
    })
    .filter((pair): pair is { link: HTMLAnchorElement; heading: HTMLElement } =>
      pair !== null,
    );
  if (pairs.length === 0) return;

  // The line a heading has to cross to count as "being read". Taken from the
  // heading's own `scroll-margin-block-start` — the value BlogPostArticle.astro
  // already uses to land an anchor jump clear of the fixed header — so the
  // highlight and the jump agree by construction instead of by two hardcoded
  // numbers that can drift apart. Falls back to the header token's 97px.
  const readingLine = (): number => {
    const declared = parseFloat(
      getComputedStyle(pairs[0].heading).scrollMarginBlockStart,
    );
    return Number.isFinite(declared) && declared > 0 ? declared + 1 : 98;
  };

  const desktop = window.matchMedia(DESKTOP);
  let current: HTMLAnchorElement | null = null;
  let frame = 0;

  const apply = (next: HTMLAnchorElement | null): void => {
    if (next === current) return;
    current?.removeAttribute("aria-current");
    next?.setAttribute("aria-current", "location");
    current = next;
  };

  const measure = (): void => {
    frame = 0;

    // Below `lg` the rail is not rendered; leave no stale state behind.
    if (!desktop.matches) {
      apply(null);
      return;
    }

    const line = readingLine();
    const doc = document.documentElement;

    // At the end of the document the last section can be shorter than the
    // remaining viewport, so its heading never reaches the line. Whoever is
    // at the bottom is reading the last section.
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
      apply(pairs[pairs.length - 1].link);
      return;
    }

    // The active heading is the LAST one at or above the line. Before the
    // first heading — while the reader is still in the standfirst — nothing
    // is marked, which is the honest answer rather than pre-selecting a
    // section nobody has reached.
    let active: HTMLAnchorElement | null = null;
    for (const { link, heading } of pairs) {
      if (heading.getBoundingClientRect().top <= line) active = link;
      else break;
    }
    apply(active);
  };

  const schedule = (): void => {
    if (frame) return;
    frame = requestAnimationFrame(measure);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  desktop.addEventListener("change", schedule);
  measure();
}

initBlogToc();
