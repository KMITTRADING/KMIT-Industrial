# KMIT Industrial — كميت الصناعية

Bilingual corporate site for KMIT Industrial, an industrial group in Jeddah working
across three sectors: industrial minerals and calcium carbonate processing, marble
stone transport, and solar panels.

Arabic is the default language and runs RTL; English is second. Every route is
prerendered to static HTML, and every page reads completely with JavaScript
disabled.

---

## Running it

```bash
npm install
npm run dev            # http://localhost:3000 -> redirects to /ar
```

```bash
npm run build          # SSG: 22 static pages (11 routes x 2 languages)
npm start              # serve the production build
```

**Node 20.9 or newer.** No environment variables are required to run. For a
production build, set the public origin so canonicals, `hreflang`, the sitemap and
the JSON-LD point at the real domain:

```bash
SITE_URL=https://kmit.co npm run build
```

---

## Checks

Every rule in the brief that can be verified mechanically is verified mechanically,
rather than asserted in a comment.

| Command | What it proves |
|---|---|
| `npm run typecheck` | No type errors. The Arabic dictionary is the shape of record and English is typed against it, so a key missing in either language fails the build. |
| `npm run check:contrast` | All 25 text/ground pairs against WCAG 2.1 AA, computed from the token hex values — including the gradient-blended grounds that dark sections actually render, not just the raw tokens. |
| `npm run check:copy` | Banned marketing vocabulary, Arabic punctuation (`،` `؛` `؟` `«»`), no em dash or kashida in Arabic, metadata length and uniqueness, and a sweep for fabricated figures. |
| `npm run check:seo` | Audits the **built HTML**: one `<h1>` per page, no skipped heading levels, per-language canonicals, reciprocal `hreflang`, JSON-LD contents, `FAQPage` only where the Q&A is really rendered, no `<canvas>` before the `<h1>`, and body copy present in source. Run after `npm run build`. |
| `npm run review` | Drives a real browser over all 11 routes at 390 / 834 / 1440 in both languages — the six mandatory states, 66 page states in total. Checks horizontal overflow, heading line counts, zero border-radius, Arabic typography, 44px touch targets, and that no layout property is transitioned. |
| `npm run review:3d` | Renders with the capability gate forced open and captures the WebGL scenes. See below. |
| `npm run check` | typecheck + contrast + copy. |

`npm run review` and `npm run review:3d` need a running server; pass the base URL as
the first argument if it is not `http://localhost:3000`.

### Why `review:3d` exists

§10 sends any machine reporting `hardwareConcurrency <= 4` down the static path.
That is correct behaviour, but it means a 4-core build machine never executes a
single line of the three.js code. Two real bugs were only visible with the gate
forced open: a GLSL precision mismatch that failed program validation, and every
scene canvas rendering into a 300×150 buffer because `<canvas>` is a replaced
element and `inset: 0` does not stretch it.

### Regenerating assets

```bash
npm run gen:brand      # derives the brand SVGs and React marks from the source exports
npm run gen:og         # 22 Open Graph cards, 1200x630, rendered through Chromium
```

Both are committed, so a deploy never depends on a browser being present.

---

## How it is put together

```
src/
  app/[lang]/          every route; [lang]/layout.tsx is the root layout and
                       emits <html lang dir>, so there is no locale-less shell
  components/          shell, primitives, sections, scenes, forms
  content/ar.ts        Arabic copy — the shape of record
  content/en.ts        English copy, typed against it, written natively
  lib/                 i18n, metadata, schema, motion gates, site constants
  lib/three/           the four WebGL scenes, framework-free
  styles/              tokens.css -> type.css -> components.css
scripts/               the checks and generators above
docs/design-plan.md    the written plan and the self-critique that preceded the code
CONTENT-TODO.md        every gap the client needs to fill
```

### Content rules

`src/content/ar.ts` and `src/content/en.ts` hold all copy. Nothing outside
`src/lib/site.ts` states a fact about KMIT. There are no production figures, purity
or micron values, certifications, client names, or plant and quarry locations
anywhere on the site — those gaps render as designed `PlaceholderBlock` components
and are listed in `CONTENT-TODO.md`. Content about calcium carbonate is general
material science, described qualitatively.

### The 3D layer, and the path without it

Four scenes, all raw three.js (no React Three Fiber — these are bespoke shaders and
the wrapper would have cost more than it saved):

| Scene | What it does |
|---|---|
| `heroCrystal.ts` | The calcite rhombohedron. The heading is redrawn into a canvas texture at exactly its layout position; the shader samples it twice at two offsets, which is what calcite does to light. |
| `sectorMorph.ts` | One `InstancedMesh` of 64 slabs holding three target states. The sectors morph rather than cross-fade — nothing is created or destroyed between them. |
| `materialJourney.ts` | 36,000 points, each carrying four positions as vertex attributes, blended on the GPU across the four process stages. |
| `calciteExplorer.ts` | A solid rhombohedron on the knowledge page, turning to face whichever feature the reader selects. |

**The site is complete without any of them.** The gate in `lib/motion.ts` sends weak
devices, slow connections, absent WebGL and `prefers-reduced-motion` down a static
path, and three.js is never even imported on that path. Each scene has a designed
still, and the hero's fallback is a CSS/SVG crystal that clips two offset copies of
the real heading — so the double refraction still reads with no WebGL and no
JavaScript at all.

---

## Deviations from the brief, and why

Four, all deliberate. Everything else follows the brief as written.

| § | The brief says | What was built | Why |
|---|---|---|---|
| §5.3 / §8.1 / §17 | display-xl bottoms out at `2.75rem`; hero on two lines; never more than three lines at 390 / 834 / 1440 | The hero heading has its own size floor, and a lower ceiling in Arabic than in English | These three cannot all hold at once. Measured against the real font, the longest Arabic line needs 15.3× the font size and the longest English line 11.46× — the ~33% Arabic expansion §6.6 warns about. Against the 1084px content measure that caps Arabic at 70px and English at 94px. English keeps the §5.3 scale untouched; only Arabic takes the lower cap. Below 768px no display size holds 26 Arabic characters on one line, so it wraps to three there, which §17 permits. The display scale itself is unchanged for every other use. |
| §10 | The fallback for a scene is a high-quality WebP exported from it | The hero fallback is vector (CSS + SVG); the sector and process stills are vector too | A raster would be a second LCP candidate competing with the heading, it would soften on a 3× display at the size these occupy, and a flat still cannot show the one idea the hero exists to show — text splitting behind a crystal. The vector fallback clips two offset copies of the *real* heading, so the effect survives with no WebGL and no JS. It also cannot 404 and costs no request. |
| §11 | Motion only on `transform`, `opacity`, `clip-path`, `filter` | The §8.6 accordion transitions `grid-template-columns` | §8.6 asks in so many words for three vertical strips that expand horizontally on hover. Transforming the panels instead would distort their text. The exception is scoped to that one component and `npm run review` enforces the scope — every other layout-property transition still fails the audit. |
| §5.7 | Phosphor (Light) or Remix Icon | Six icons hand-drawn on a 24-unit grid in the Phosphor Light idiom | §5.7 also fixes the stroke at 1.25px. Phosphor ships Light as filled outlines at a fixed optical weight that cannot be restruck to 1.25px. Stroked geometry hits the specified weight exactly, scales cleanly at 20px, and costs no dependency for six glyphs. |

---

## Measured performance

Against Slow 4G with 4x CPU throttling, on `/ar` (the heavier language — Arabic runs
~33% longer):

| Metric | Measured | §15 target |
|---|---|---|
| LCP | **856 ms** | < 2.5 s |
| LCP element | `span.hero-line` — the heading, not the canvas | §15.1.7 |
| CLS | **0.0016** | < 0.05 |
| Total long-task time | 764 ms | — |

The three.js chunk is 131 KB gzipped and is **not referenced in the home page HTML**
at all: it is fetched only when the §10 capability gate opens, at idle, after paint.

Netlify's Lighthouse scores the deploy preview at **Performance 69, Accessibility 98,
Best Practices 92, SEO 100**. LCP and CLS both clear their targets by a wide margin,
so the Performance number is dominated by Total Blocking Time — React hydrating a
page with several interactive sections under synthetic 4x CPU throttling. Loading
Lenis, GSAP and ScrollTrigger at idle rather than during hydration took ~40 ms off
it. The remaining structural win is to split the static markup of `SectorsPinned`
and `MaterialJourney` back into server components, mounting only the interactive
shell on the client — the pattern `HeroCrystalMount` already uses. That is a
worthwhile follow-up, not a blocker.

---

## Deploying

The build output is a standard Next.js production build; any Node host or Vercel
serves it. `next/image` optimisation is off and no image passes through `sharp` —
art is authored at final dimensions with explicit `width`/`height`.

Before the first deploy, confirm the production domain (`SITE_URL`). Changing it
after indexing requires a 301 for every path.
