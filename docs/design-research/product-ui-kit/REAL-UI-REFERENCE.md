# Real product UI — reference extract

Fetched 2026-08-18 from the TruMandate **product** design-system project in
Claude Design (`ui_kits/trumandate-platform/`, `components/data-display/`).
Read-only reference for verifying the marketing site's SVG fragments against
the real interface, per CLAUDE.md's invariant: *fragments must be faithful to
the real UI — anonymise the data, never the interface.*

This file is reference material, not site source. Nothing here ships.

---

## KPI tile (`StatCard.jsx` + `KpiRow.kit.js`)

Real structure of one KPI tile, top to bottom:

1. **Header row**: a 36×36 rounded square holding a mint-tinted icon
   (`--accent-soft` ground, `--accent` glyph), and — right-aligned on the same
   row — an optional **delta** string in semibold secondary text.
2. **Value**: 32px bold, heading letter-spacing, darkest text token.
3. **Label**: smaller semibold.
4. **Optional progress bar**: 6px tall, pill radius, subtle-border track,
   `--accent-action` fill, width = percent.
5. **Breakdown**: regular-weight small text, `--slate-400` — a
   middot-separated composition line.
6. **Optional note**: same size, `--slate-500` — usually the declared
   weighting or an absolute figure.

Card chrome: `--surface-card` ground, 1px `--border-subtle`, `--radius-card`,
`--elevation-1` shadow, 20px padding, 10px gap.

Sparkline (only on the health KPI): 120×28 viewBox, single 1.5px
`--accent-action` stroke, no fill, no axes, no dots.

Row layout: six tiles in a `repeat(6, minmax(0,1fr))` grid, 16px gap, with a
wrapped row of status pills beneath.

### Real KPI content (for structural shape only — NEVER copy verbatim)

| value | label | extras |
|---|---|---|
| 27 | Total projects | breakdown: active · draft · on hold · closed |
| 69% | Portfolio health | delta, sparkline, breakdown by RAG, weighting note |
| AED 151.6M | Portfolio budget | breakdown: N of N have a recorded budget |
| 54% | Budget utilization | progress bar, breakdown, absolute-spend note |
| 24 | Open risks | breakdown: red residual · amber · not assessed |
| 0 | Milestones past due | breakdown: N more due within 90 days |

Verdict pills carry `dimension` + `status` (ontrack / atrisk / watch) + a
`meta` line: Schedule, Budget, Risks, Issues, Delivery, Reporting.

**Key structural facts the site's KpiCard must respect**: a real KPI tile
leads with an icon square and a large value, carries a *composition*
breakdown line (not just a number), and states its weighting as a note. The
sparkline is a bare stroke — no axes, no dots — which the site already matches.

---

## Decision queue (`DecisionQueue.kit.js`)

Each escalated item is a card with:

- a **4px left border in the danger colour** (the strongest structural signal),
- title (semibold) + a `dot` danger **Badge** reading "Escalated" on the same row,
- a one-line explanation ending in the severity word, coloured danger/semibold,
- a metadata row: **reference code** and **Owner: name**, small, muted,
- a small **Review** action button with a trailing arrow icon.

**Key structural facts**: reference code and owner sit together on a muted
metadata line beneath the title; severity is carried by both a coloured left
border and a dot badge, never colour alone.

---

## Lifecycle / portfolio composition

Status vocabulary in the real product: **Draft, Active, On hold, Closed** for
lifecycle; **healthy / needs attention / critical / not assessed** for health;
**ontrack / atrisk / watch** for dimension verdicts. Real project references
follow a `XXX-nnnn` pattern (e.g. three-letter department code, four digits).

Note: the real product carries Arabic project names inline in an otherwise
English interface — mixed-direction content is native to the product, which
supports the site's bidi isolation approach.
