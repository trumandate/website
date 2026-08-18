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
type ZoomStyle = CSSStyleDeclaration & { zoom: string };

function fitBoard(wrap: HTMLElement) {
  const inner = wrap.querySelector<HTMLElement>('[role="img"]');
  if (!inner) return;
  const zoom = String(Math.min(1, wrap.clientWidth / 1036));
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
