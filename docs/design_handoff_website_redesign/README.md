# Handoff: TruMandate Website Redesign (EN + AR)

## Overview
Full redesign of the TruMandate marketing site (trumandate.com) — five routes in English and five in Arabic RTL — replacing the current Astro pages. The narrative now leads with the product (a cropped Command Centre board), pushes AI to the front (a decision queue with named human sign-off), and replaces the pinned text chain with a scroll-driven 3D elliptical record chain. Copy is tightened and the palette gains brighter companion hues.

## About the Design Files
The `.dc.html` files in this bundle are **design references created in HTML** — prototypes showing intended look, motion and behavior, not production code. The task is to **recreate these designs inside the existing repo** (`trumandate/website`: Astro 7 static output, Tailwind 3.4 with tokens in `tailwind.config.mjs`, GSAP 3.15 + ScrollTrigger) using its established patterns: Section.astro wrappers, logical properties only (no `ml-`/`pl-`/`text-left`), tokens-only color discipline, reduced-motion end states in CSS with GSAP animating *from* offsets.

Open any `.dc.html` in a browser to see the live design. They share `_ds/…/_ds_bundle.css` (the repo's own compiled Tailwind) — keep the bundle folder next to the files when previewing.

## Fidelity
**High-fidelity.** Colors, type roles, spacing, copy and motion timing are final and should be recreated pixel-perfectly with the repo's own utilities. English AND Arabic copy are final drafts pending owner review (Arabic is written, not machine-translated; keep it flowing through review, not re-translated).

## Screens / Views

### 1. Home — `Home (redesign).dc.html` / `Home AR (redesign).dc.html`
1. **Hero (centered)**: eyebrow (mono, muted) → display H1, key phrase in a mint→cyan gradient text clip → short lede → two CTAs ("Book a demo" filled accent, ghost secondary) → the Command Centre board.
2. **The board**: `CommandCentreBoard` (AR variant fully translated), 1000px internal design width scaled to fit its container (zoom = containerWidth/1036, never >1), cropped by `max-height: clamp(340px, 44vw, 580px)` with a mask fading to transparent from 52%→99%. Caption below: "A corner of the Command Centre. The demo shows it whole." **Deliberate withholding — never show the full board.**
3. **Proof band**: 4 centered stats with count-up on view (142 / AED 218M / 6 in mint / 24 mo), hairline top+bottom (`rgba(255,255,255,0.06)`), vertical hairline separators.
4. **AI decision queue**: heading pair + three suggestion cards (execution mint #4BEFC4, strategy cyan #59D8E6, benefits gold #FFC95C): colored 2px inline-start border, eyebrow + confidence in the hue, 2px gradient confidence bar (scaleX draw on view), title, evidence, Accept/Modify/Reject buttons, mono audit line. First card gets `bg-spotlight-accent` glow behind it. Audit strip below (4 mono items).
5. **Record chain (signature)**: 480vh section, sticky 100vh stage. Centered counter "01 / 05" + active name (updates on scroll). Five record cards orbit on an ellipse: `x = sin(a)·440`, `z = (cos(a)−1)·560`, `y = (1−cos(a))·−46`, opacity `0.08 + 0.92·max(0,(cos a+0.25)/1.25)`, perspective 1500px (origin 50% 42%). Scroll progress → rotation 0–288° with dwell easing: per transition hold 45%, then smoothstep glide 55%. RTL reverses rotation sign. Active card's node dot pulses.
6. **Without the record**: three columns, rules draw in (scaleX), big mono figures in hue ("3 days" mint, "Month-end" gold, "Never" coral #FF9A90), eyebrow + 1–2 sentences.
7. **Closing CTA**: grid ground + `bg-ground-board`, heading "Bring one objective. We will trace it to the money.", CTA pair, right column of hairline rows (Deployment / Language / Operated by).

### 2. Strategy — `Strategy (redesign).dc.html` / `Strategy AR …` (hue: cyan #59D8E6)
Hero (start-aligned, eyebrow "The chain · Objective → KPI") → **KPI record fragment**: full card (ref, at-risk pill, name, baseline/target/actual figures, gradient sparkline draw, "Carries" chips linking Objective 1.2 / Initiatives / Benefit 4.2) with a second card cropped by an inline-end fade → three-point argument (The break / The join / The refusal) on surface-deep → AI moment (0.81 double-count card) → handoff: "The cascade editor. Watch it built live…".

### 3. Execution — `Execution (redesign).dc.html` / AR (hue: mint #4BEFC4)
Hero → **initiative list fragment**: stacked record cards (not a flat table): status dot, name, funding objective, slip (+0d mint / +6d gold / +34d coral), gradient progress bar; red row has coral border + tinted bg + pulsing dot; list cropped by bottom fade → argument (The ritual / The subtraction / The name) → AI moment (0.74 dependency card) → handoff: gate rejection propagation.

### 4. Benefits — `Benefits (redesign).dc.html` / AR (hue: gold #FFC95C)
Hero → **forecast vs actual chart fragment**: gold-tinted measurement window band ("24 months from closure"), dashed forecast, gradient actual line with endpoint dot, "−18% VS FORECAST / AI FLAG" callout box, Today marker, inline-end crop fade → argument (The gap / The repeat promise / The 24 months) → AI moment (0.69 leakage card) → handoff: the benefit register.

### 5. Contact — `Contact (redesign).dc.html` / AR
Hero (grid ground, "See it against your own plan.", mailto note) → form in one raised card: Name/Organisation (2-col), Work email (full), interest radio group (4 options, accent-tinted), message textarea, submit "Book a demo" + mono footnote "We reply from a named address, not a queue." Underline-style inputs (border-b hairline, focus accent). Keep repo's Formspree POST, honeypot, aria-invalid pattern, error copy from `i18n/ui.ts`. No AI, no product imagery.

## Interactions & Behavior
- **Load cascade** (heroes): opacity 0 + translateY(26px) → settled; 0.9s `cubic-bezier(0.22,0.61,0.36,1)`; stagger ~90ms per element. Board enters translateY(70px) scale(0.975), 1.25s.
- **Scroll reveals**: IntersectionObserver at threshold 0.18 adds the settled state; `.tm-rise` = 30px rise 0.85s; `.tm-grow` = scaleX 0→1, 1.2s, origin inline-start (100% 50% in RTL); staggering via 130/260ms delays.
- **Count-ups**: 1.3s, cubic ease-out, prefix/suffix preserved ("AED …M").
- **Sparkline draws**: stroke-dashoffset to 0, ~2s, delay 0.6–0.8s.
- **Live pulses**: box-shadow ring pulse 2.2–2.4s infinite on critical dots and AI chips.
- **Chain scrub**: see Home §5. One pinned section per route (home only) — matches the repo's own budget rule.
- **Button hover**: filled accent CTA inverts (transparent bg, accent text, 1px accent outline), 150ms `cubic-bezier(0.22,1,0.36,1)`. Never let global `a:hover` color apply to filled buttons.
- **Reduced motion**: every animated class ships its end state; under `prefers-reduced-motion: reduce` no animation/transition runs. Counters render final values.
- **Responsive**: grids use `repeat(auto-fit, minmax(min(100%, Npx), 1fr))`; the board scales as a screenshot (zoom) instead of reflowing; fragment crops keep their fade edges at all widths.

## State Management
Static marketing site — no app state. Per page: an IntersectionObserver (reveals + counters), a scroll handler (home chain), a ResizeObserver (board fit). Contact form keeps the repo's existing fetch/native-POST dual path and validation states.

## Design Tokens
Repo tokens (unchanged, from `tailwind.config.mjs`): ink #04241E, jade #0B4A3D, jade-lift #0F5C4B, accent #19C39B, amber #F2B441, red #E0574C, paper #F1F5F3, muted #9CB8AE, body #C6DAD3, surface #0A3B31, surface-deep #021813, hairline rgba(255,255,255,.10), hairline-soft .06, highlight .16, shade rgba(2,24,19,.55). Type roles: display/heading Plex Sans Arabic 600, body 300, data/eyebrow Plex Mono 500 (Arabic swaps to Plex Sans 600, zero tracking, sizes 0.80/0.82rem — the `[dir=rtl]` overrides already in global.css).

**New companion hues (owner-approved, add as tokens):** mint #4BEFC4, cyan #59D8E6, gold #FFC95C, coral #FF9A90 / #FF7A6E. Usage: AI/domain accents, chart strokes, figure highlights, gradient pairs (accent→mint, accent→cyan, amber→gold). Never for body text on jade (check AA first); the existing RAG discipline still holds inside data components.

Gradient text: `background: linear-gradient(92deg, #19C39B, #59D8E6); background-clip: text; color: transparent` (reverse angle 268deg in RTL).

## Assets
No photography, no new raster. Everything is DOM/SVG from tokens: the TruMandate mark (three rounded bars on a paper tile, from Header.astro), the Command Centre board (DOM + inline SVG charts), fragments and charts per page. Uploaded product screenshots were reference only — do not ship them.

## Files
- `Home (redesign).dc.html`, `Strategy (redesign).dc.html`, `Execution (redesign).dc.html`, `Benefits (redesign).dc.html`, `Contact (redesign).dc.html`
- Arabic: `Home AR (redesign).dc.html`, `Strategy AR …`, `Execution AR …`, `Benefits AR …`, `Contact AR …` (wrap in `dir="rtl" lang="ar"`; in the repo this is `<html lang="ar" dir="rtl">`)
- Shared: `CommandCentreBoard.dc.html`, `CommandCentreBoardAR.dc.html`, `SiteHeader.dc.html`, `SiteFooter.dc.html`, `SiteHeaderAR.dc.html`, `SiteFooterAR.dc.html`
- `Current Site (recreation).dc.html` — faithful copy of today's site, for before/after reference
- `github.md` — repo association + screen map

## Implementation Notes for the Repo
- CTA label is now **"Book a demo" / "احجز عرضاً توضيحياً"** site-wide (`cta.primary` in `i18n/ui.ts`).
- The old withholding rules are relaxed by the owner to "tokens binding, content rules open" — but the full board still never appears; the cropped board + fade IS the new curiosity mechanism.
- Chain scrub, reveals and count-ups map naturally to GSAP ScrollTrigger (already a dependency); keep the repo's whenMotionSafe gate and CSS end-state contract.
- Footer is the slim enterprise version: brand + "Powered by Intertec Systems · Dubai, UAE", page links, email, language toggle, "© 2026 Intertec Systems" and "TruMandate™ · trumandate.com" (™ not ® unless the mark is registered).
