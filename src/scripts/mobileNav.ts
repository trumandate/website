// mobileNav.ts — P11 (USER REPORT fix): drives Header.astro's hamburger
// trigger and NavDrawer.astro's panel/backdrop. Deliberately plain
// vanilla JS, no GSAP — same call header.ts already makes for chrome-level
// state toggles ("there is no tween here, only a class add/remove"); the
// motion itself is a CSS transition on NavDrawer.astro's own
// `.is-open` class, gated there under `prefers-reduced-motion`.
//
// Accessibility contract (CLAUDE.md, non-negotiable per the build brief):
//   - the trigger's `aria-expanded` and accessible name track open/closed
//     state exactly (label strings arrive as data attributes, see
//     Header.astro's own comment, so this file never hardcodes copy);
//   - focus moves into the panel on open and is trapped there (Tab/Shift+Tab
//     cycle among the panel's own focusable elements only) until it closes;
//   - focus returns to the trigger on close;
//   - Escape and a backdrop click both close it; so does choosing a link;
//   - background content (the header's brand link, `#main`, the site
//     footer — the drawer panel is deliberately left OUT of this list) gets
//     `inert` for the duration, which removes it from both the keyboard tab
//     order and the accessibility tree in one attribute, and body scroll is
//     locked via the `nav-open` class (global.css).
//
// No-JS readers never reach this file at all — Header.astro's own
// `<noscript>` block removes the trigger outright in that case, and
// Footer.astro's four links (unconditional, verified by reading that file)
// are the real no-JS path to Strategy/Execution/Benefits/Contact.
const trigger = document.querySelector<HTMLButtonElement>("[data-nav-trigger]");
const root = document.querySelector<HTMLElement>("[data-nav-drawer]");
const panel = document.querySelector<HTMLElement>("[data-nav-panel]");
const backdrop = document.querySelector<HTMLElement>("[data-nav-backdrop]");
const brand = document.querySelector<HTMLElement>("[data-header-brand]");
const main = document.getElementById("main");
const footer = document.querySelector<HTMLElement>("[data-site-footer]");

if (trigger && root && panel && backdrop) {
  const labelOpen = trigger.dataset.labelOpen ?? "";
  const labelClose = trigger.dataset.labelClose ?? "";
  const backgroundEls = [brand, main, footer].filter(
    (el): el is HTMLElement => el !== null,
  );

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let isOpen = false;

  function focusablesInPanel(): HTMLElement[] {
    return Array.from(panel!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  }

  function setBackgroundInert(state: boolean) {
    backgroundEls.forEach((el) => {
      if (state) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusables = focusablesInPanel();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onViewportChange(query: MediaQueryList | MediaQueryListEvent) {
    if (query.matches && isOpen) close();
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    panel!.removeAttribute("inert");
    root!.classList.add("is-open");
    trigger!.setAttribute("aria-expanded", "true");
    trigger!.setAttribute("aria-label", labelClose);
    setBackgroundInert(true);
    document.documentElement.classList.add("nav-open");
    document.addEventListener("keydown", onKeydown);

    const [first] = focusablesInPanel();
    (first ?? panel!).focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    root!.classList.remove("is-open");
    trigger!.setAttribute("aria-expanded", "false");
    trigger!.setAttribute("aria-label", labelOpen);
    setBackgroundInert(false);
    document.documentElement.classList.remove("nav-open");
    document.removeEventListener("keydown", onKeydown);
    panel!.setAttribute("inert", "");

    // The brief's own wording: "returns to the trigger on close" — not
    // "returns to whatever had focus before," so there is no `lastFocused`
    // to fall back to. This also sidesteps a real gap a return-to-invoker
    // pattern would have here: `HTMLElement.click()` (used below for the
    // trigger's own click handler, and by any script-driven open) is not
    // spec-guaranteed to move focus the way a genuine pointer click does,
    // so capturing `document.activeElement` at open() time is not reliably
    // the trigger even when the trigger is in fact what opened it.
    trigger!.focus();
  }

  trigger.addEventListener("click", () => {
    if (isOpen) close();
    else open();
  });

  backdrop.addEventListener("click", () => close());

  panel.querySelectorAll<HTMLElement>("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => close());
  });

  // Defensive only: a drawer left open while resizing/rotating across the
  // `lg` breakpoint (1024px, Tailwind's stock default — this codebase adds
  // none of its own, tailwind.config.mjs's `screens: {}` comment) would
  // otherwise strand `#main`/the footer `inert` under a layout where the
  // trigger and panel are both `lg:hidden` and unreachable.
  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  desktopQuery.addEventListener("change", onViewportChange);
}

export {};
