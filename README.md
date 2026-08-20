# KMIT Industrial Solutions

A single-page bilingual site for KMIT Industrial Solutions, Jeddah — calcium
carbonate, mining, solar energy panels. Built on the **Strata / الطبقات**
concept: the three areas share one physical structure, layers, and one visual
system carries all three.

Arabic is the default. `/` answers with a 301 to `/ar`; English is at `/en`.
Both are complete, independently indexable static documents.

```bash
npm install
npm run dev                # develop
npm run build              # static export to out/
npm run check              # typecheck + i18n + copy + contrast
```

## Checks

Each is a script rather than a convention, because every one of them is
something a future edit could quietly break.

| Command | What it enforces |
|---|---|
| `npm run check:facts` | No number, date, certification or capability claim in the built HTML that is not in §1 of the brief |
| `npm run check:i18n` | `en` and `ar` key parity, no blanks, no Arabic value still in Latin |
| `npm run check:copy` | The twelve banned words, in both locales |
| `npm run check:contrast` | Every colour pair the design permits, classified by the floor that applies |
| `npm run check:a11y` | axe-core, WCAG 2.1 AA + best practice, both locales at desktop and phone |
| `npm run check:motion` | Nothing is ever invisible under reduced motion or with JS disabled |
| `npm run check:perf` | LCP, CLS, TBT and initial JS on a throttled mid-range Android |
| `npm run shots` | Screenshots at six widths in both languages, asserting no horizontal overflow |

## Dependencies

Runtime — three, and that is the whole list:

- **next** — the framework: static export, locale routing, metadata, sitemap.
- **react**, **react-dom** — required peer of Next, not an independent choice.
- **three** — the core sample. Lazily loaded; never in the initial bundle.

Development:

- **typescript**, **@types/\*** — types.
- **tailwindcss**, **@tailwindcss/postcss**, **postcss** — styling pipeline.
- **playwright** — screenshots, a11y, motion states, performance, OG cards.
- **axe-core** — the accessibility assertions.

Deliberately **not** installed: no GSAP or ScrollTrigger (four sticky
containers and one rAF-gated listener do the same work for ~90 KB less), no
Lenis (it hijacks native scrolling and fights RTL trackpads and Android
address-bar collapse), no animation library, no icon library, no i18n runtime,
no class-merging utility.

## Placeholders

Everything below is a marked placeholder. There are four, and no invented
facts anywhere.

| Where | What | To replace |
|---|---|---|
| `lib/locales.ts` → `SITE_URL` | The production origin. Currently the Netlify default domain, which is where the site deploys today. | **Required before launch.** It is the one value that would silently point every canonical, `hreflang` and sitemap entry at the wrong host. |
| `components/layout/Logo.tsx` | No Arabic lockup was supplied, so the English lockup is used on both locales. The accessible name is still per-locale. | Drop an Arabic SVG in and branch on `locale` in this one component. |
| `content/images.ts` → `about.src` | The About section's single image slot is `null`, which renders a banded neutral panel at the exact dimensions the real file will occupy. | Set `src` to the photograph. Nothing shifts: width and height are already reserved. |
| `public/og/*.png` | The two Open Graph cards are generated from the site's own type and tokens. | Re-run `node scripts/gen-og.mjs` after any hero copy change. |

The supplied brand SVGs in `public/brand/` are the official Illustrator
exports and are used as-is. Nothing in this repository redraws, traces or
generates a KMIT mark.

## Facts

`content/facts.ts` is the only place a fact about KMIT is written, and
`check:facts` audits the built HTML against it. The site publishes no founding
year, years of experience, certifications, production capacity, purity or
particle-size figures, client names, partner names, case studies, statistics,
headcount, revenue, social accounts or street address, because none of those
were established. Copy describing calcium carbonate and panel construction is
general material science, not a product specification.

## Architecture notes

- **Content** — `content/types.ts` is the contract; `en.ts` and `ar.ts` are
  declared against it, so a missing translation is a compile error. Counts are
  tuples: exactly three areas, four principles, four scroll steps.
- **Direction** — layout CSS uses logical properties throughout. The Arabic
  typographic adjustments (tracking to zero, more leading, heavier minimum
  weight) come from three variables in `tokens.css`, so the type scale itself
  is script-agnostic and the two languages cannot drift apart.
- **Motion** — one passive scroll listener, one rAF, N subscribers reading one
  set of measurements. Reveals default to *visible* and opt into hiding only
  when an inline script has confirmed motion is wanted, so a script failure
  costs the animation and never the content.
- **3D** — fourteen authored bands (a fixed array, no seed, no PRNG) feed both
  the WebGL object and the CSS fallback, which is why the fallback is the same
  idea rather than a different picture.
