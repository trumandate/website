// board.ts — the Command Centre board's fit-to-container zoom
// (CommandCentreBoard.dc.html's own `fitBoard`/ResizeObserver logic, README
// §2: "zoom = containerWidth/1036, never >1"). Home page only.
//
// Layout correctness, not decorative motion, so this runs unconditionally
// (same reasoning as scripts/header.ts) rather than through motion.ts's
// whenMotionSafe gate: a reduced-motion reader still needs the board
// legible at its container's actual width, not the browser's default
// 1000px-wide layout spilling out of a narrower crop.
//
// `zoom` (not `transform: scale`) matches the reference exactly: the
// board's internal `min-width: 1000px` layout needs to shrink as a unit,
// including how its own overflow/scroll behaves, which `zoom` reproduces
// and a CSS transform does not (a scaled element keeps its pre-scale
// layout box for scroll purposes). Non-standard but supported by every
// engine this project's Lighthouse/budget passes run against (Chromium,
// Safari); Firefox has shipped it since version 126 (2024).
//
// Below `MOBILE_ZOOM_FLOOR`, "shrink to fit" stops and "crop, don't
// shrink" takes over. The reference (Home (redesign).dc.html at 375px)
// just keeps dividing by 1036 down to zoom ≈0.32, which renders the
// board's smallest type at ~2.6px.
//
// The floor is a composition judgement, not a pure legibility formula.
// Deriving it from the smallest 8px caption gives 7/8 — but at that zoom
// a 375px screen shows only the sidebar and a sliver of one tile, with
// headings cut mid-word: every glyph readable, and nothing left that
// reads as a product dashboard. The captions are texture at this size;
// what has to survive is the composition (sidebar, KPI tiles, the start
// of the chart) and the large figures inside it.
//
// 0.45 is the balance: a 375px viewport shows roughly the inline-start
// three-quarters of the board, the 26px KPI figures land near 12px, and
// the section's own caption — "A corner of the Command Centre" — stays
// literally true. Engages under a ~466px container, so every desktop and
// tablet width keeps the reference's exact shrink-to-fit behaviour.
const MOBILE_ZOOM_FLOOR = 0.45;

type ZoomStyle = CSSStyleDeclaration & { zoom: string };

function fitBoard(wrap: HTMLElement) {
  const inner = wrap.querySelector<HTMLElement>('[role="img"]');
  if (!inner) return;
  const ratio = wrap.clientWidth / 1036;
  const zoom = String(Math.min(1, Math.max(MOBILE_ZOOM_FLOOR, ratio)));
  const style = inner.style as ZoomStyle;
  if (style.zoom !== zoom) style.zoom = zoom;
}

const wrap = document.querySelector<HTMLElement>("[data-board-fit]");

if (wrap) {
  fitBoard(wrap);
  const ro = new ResizeObserver(() => fitBoard(wrap));
  ro.observe(wrap);
}

export {};
