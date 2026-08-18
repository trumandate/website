repo: trumandate/website
branch: main
path: src

## Last sync

date: 2026-08-18T12:40:00Z

### Updated in this project

- Recreated all five English routes faithfully from the Astro source (Current Site (recreation).dc.html).
- Full redesign of all five pages in English and Arabic: board-led hero, AI decision queue, scroll-driven 3D record chain, tightened copy, mint/cyan/gold secondary hues.
- Command Centre dashboard rebuilt as a marketing surface in both languages (CommandCentreBoard / CommandCentreBoardAR).

## Screen map

| Project screen | Repo files |
| --- | --- |
| Current Site (recreation).dc.html (all 5 routes) | src/pages/en/*.astro, src/components/** (see per-section history), tailwind.config.mjs, src/styles/global.css |
| Home (redesign).dc.html · Home AR (redesign).dc.html | src/pages/en/index.astro, src/components/home/*, chain/*, ai/SuggestionCard.astro, i18n/ui.ts |
| Strategy (redesign).dc.html · Strategy AR (redesign).dc.html | src/pages/en/strategy.astro, src/components/product/*, fragments/KpiCard.astro, product/copy.ts |
| Execution (redesign).dc.html · Execution AR (redesign).dc.html | src/pages/en/execution.astro, fragments/InitiativeRows.astro, product/copy.ts |
| Benefits (redesign).dc.html · Benefits AR (redesign).dc.html | src/pages/en/benefits.astro, fragments/BenefitCurve.astro, product/copy.ts |
| Contact (redesign).dc.html · Contact AR (redesign).dc.html | src/pages/en/contact.astro, src/components/contact/*, i18n/ui.ts |
| CommandCentreBoard.dc.html · CommandCentreBoardAR.dc.html | fragments/CommandCentreDim.astro (superseded), uploads/ product screenshots (reference only) |
| SiteHeader / SiteFooter (+AR variants) | src/components/layout/* |

## Notes for implementation (Claude Code)

- CTA label is now "Book a demo" / "احجز عرضاً توضيحياً" everywhere.
- Secondary hues beyond tokens (approved by owner): mint #4BEFC4, cyan #59D8E6, gold #FFC95C, coral #FF7A6E — used for AI/domain accents and charts only.
- Motion: load cascade on heroes, IntersectionObserver reveals (tm-* classes), count-ups, scroll-scrubbed elliptical 3D record chain on home (480vh sticky section, dwell-then-glide easing, RTL mirrors direction). Reduced-motion renders end states.
- Arabic pages use the bundle's [dir="rtl"] overrides for the eyebrow/datum roles; Western digits for KPI values and dates per spec §8.
