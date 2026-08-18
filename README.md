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
npm run build          # SSG: 18 content pages (9 routes x 2 languages),
                       # plus robots.txt, the sitemap and the 404
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
| `npm run check:seo` | Audits the **built HTML** on all 18 pages: one `<h1>` per page, no skipped heading levels, per-language canonicals, reciprocal `hreflang`, JSON-LD contents, `FAQPage` only where the Q&A is really rendered, no `<canvas>` before the `<h1>`, and body copy present in source. Run after `npm run build`. |
| `npm run review` | Drives a real browser over all 9 routes at 390 / 834 / 1440 in both languages — the six mandatory states, 54 page states in total. Checks horizontal overflow, heading line counts, zero border-radius, Arabic typography, 44px touch targets, that no layout property is transitioned, that no label and value render glued together, and that the design tokens actually loaded (see below). |
| `npm run check:a11y` | Runs **axe-core** — the engine Lighthouse's accessibility category is built on — over all 18 pages at WCAG 2.1 A/AA, reporting per rule, per element and per page. |
| `npm run check:stress` | Three fast full-page scroll passes with the capability gate forced open. Asserts the tab survives, no `webglcontextlost` fires, exactly one `<canvas>` exists, the JS heap does not grow across passes, and nothing throws. |
| `npm run check:perf` | Vitals under Slow 4G and 4x CPU throttling **on both paths** — the static one and the §10 WebGL one — and fails if the worst single main-thread task on the WebGL path exceeds 1200 ms. |
| `npm run review:3d` | Renders with the capability gate forced open and captures the WebGL scenes. See below. |
| `npm run check` | typecheck + contrast + copy. |

`npm run review`, `npm run review:3d`, `npm run check:a11y`, `npm run check:stress`
and `npm run check:perf` need a running server; pass the base URL as the first
argument if it is not `http://localhost:3000`.

### Why `review:3d` and `check:stress` exist

§10 sends any machine reporting `hardwareConcurrency <= 4` down the static path.
That is correct behaviour, but it means a 4-core build machine never executes a
single line of the three.js code, so the checks that matter most for the 3D layer
have to force the gate open. Real bugs were only ever visible that way: a GLSL
precision mismatch that failed program validation, every scene canvas rendering
into a 300×150 buffer because `<canvas>` is a replaced element and `inset: 0` does
not stretch it, and the context exhaustion that `check:stress` now guards (below).

`check:perf` exists for the same reason and was added after the gate cost real
points: every vitals number taken here had been measured with the gate shut, so a
~2.8 s main-thread block on the WebGL path went unnoticed locally and only showed
up as a 20-point Lighthouse drop on a runner with more cores. It now measures both
paths and fails on a budget.

### Regenerating assets

```bash
npm run gen:brand      # derives the brand SVGs and React marks from the source exports
npm run gen:og         # 18 Open Graph cards, 1200x630, rendered through Chromium
```

Both are committed, so a deploy never depends on a browser being present.

---

## How it is put together

```
src/
  app/[lang]/          every route; [lang]/layout.tsx is the root layout and
                       emits <html lang dir>, so there is no locale-less shell
  components/          shell, primitives, sections, scenes
  content/ar.ts        Arabic copy — the shape of record
  content/en.ts        English copy, typed against it, written natively
  lib/                 i18n, metadata, schema, motion gates, site constants
  lib/three/           sceneHost (the one renderer), studio (shared look-dev),
                       and the four scenes — framework-free
  styles/              tokens.css -> type.css -> components.css
scripts/               the checks and generators above
docs/design-plan.md    the written plan and the self-critique that preceded the code
CONTENT-TODO.md        every gap the client needs to fill
```

The site is nine routes: home, about, sectors and its three sector pages, the
calcium carbonate knowledge centre, quality & HSE, and sustainability. Careers and
contact were removed; both had been live, so `/{lang}/careers` and
`/{lang}/contact` issue a permanent redirect to the homepage in their own language
rather than 404ing. Contact is now a direct `mailto:` and `tel:` from the footer
and the presence section, which removes the two form endpoints the client would
otherwise have had to supply.

### Content rules

`src/content/ar.ts` and `src/content/en.ts` hold all copy. Nothing outside
`src/lib/site.ts` states a fact about KMIT. There are no production figures, purity
or micron values, certifications, client names, or plant and quarry locations
anywhere on the site — those gaps render as designed `PlaceholderBlock` components
and are listed in `CONTENT-TODO.md`. Content about calcium carbonate is general
material science, described qualitatively.

### The 3D layer, and the path without it

**One WebGL context for the whole page.** `lib/three/sceneHost.ts` owns a single
`WebGLRenderer` on a single fixed canvas behind the page content; each section
registers the DOM element it wants to draw into, plus its own scene and camera, and
the host renders it inside a scissor rectangle taken from that element's
`getBoundingClientRect()`. Layout stays entirely in CSS and the GL side follows it.

This replaced a renderer per scene. Four live contexts on one page is enough for a
browser — which caps them around sixteen and then silently drops the oldest — to
tear the page down mid-scroll, which is what killed the tab. It also meant four
copies of the GL state machine and four render loops competing for the main thread.

Rendering is **on demand**: a frame is drawn only when a view reports new scroll
progress, is mid-animation, or the layout resized. A parked, static scene costs
zero frames. `lib/three/studio.ts` holds the shared look-dev — a procedural PMREM
environment (no HDRI request), bevelled solids, materials and contact shadows — so
the four scenes are lit as one object family rather than four.

| Scene | What it does |
|---|---|
| `heroCrystal.ts` | The calcite rhombohedron. The heading is redrawn into a canvas texture at exactly its layout position; the shader samples it twice at two offsets, which is what calcite does to light. Screen UVs come from clip space, not `gl_FragCoord`, because that is canvas-relative under a scissor. |
| `sectorMorph.ts` | Ten bevelled solids at deliberately unequal sizes, holding three target states. The sectors morph rather than cross-fade — nothing is created or destroyed between them, only positions, rotations, scales and materials. |
| `materialJourney.ts` | A solid bevelled block for the first two stages, resolving into 10,000 points for the last two, each point carrying its positions as vertex attributes and blended on the GPU. |
| `calciteExplorer.ts` | A solid rhombohedron on the knowledge page, turning to face whichever feature the reader selects. |

**The site is complete without any of them.** The gate in `lib/motion.ts` sends weak
devices, slow connections, absent WebGL and `prefers-reduced-motion` down a static
path, and three.js is never even imported on that path. Each scene has a designed
still, and the hero's fallback is a CSS/SVG crystal that clips two offset copies of
the real heading — so the double refraction still reads with no WebGL and no
JavaScript at all.

---

## Deviations from the brief, and why

Five, all deliberate. Everything else follows the brief as written.

| § | The brief says | What was built | Why |
|---|---|---|---|
| §5.3 / §8.1 / §17 | display-xl bottoms out at `2.75rem`; hero on two lines; never more than three lines at 390 / 834 / 1440 | The hero heading has its own size floor, and a lower ceiling in Arabic than in English | These three cannot all hold at once. Measured against the real font, the longest Arabic line needs 15.3× the font size and the longest English line 11.46× — the ~33% Arabic expansion §6.6 warns about. Against the content measure that caps Arabic well below English. English keeps the §5.3 scale untouched; only Arabic takes the lower cap. Below 768px no display size holds 26 Arabic characters on one line, so it wraps to three there, which §17 permits. The display scale itself is unchanged for every other use. |
| §10 | The fallback for a scene is a high-quality WebP exported from it | The hero fallback is vector (CSS + SVG); the sector and process stills are vector too | A raster would be a second LCP candidate competing with the heading, it would soften on a 3× display at the size these occupy, and a flat still cannot show the one idea the hero exists to show — text splitting behind a crystal. The vector fallback clips two offset copies of the *real* heading, so the effect survives with no WebGL and no JS. It also cannot 404 and costs no request. |
| §11.3 | The intro paragraph's words start at `opacity: 0.15` and scrub to 1 | The floor is `0.62` | Measured with axe-core, `--ink` at 0.15 over `--paper` is **1.36:1** — a serious WCAG failure, and the paragraph sits at that floor until the visitor scrolls. §15's AA requirement and §17's "body text ≥ 4.5:1 in every section" both outrank the exact starting value. 0.60 is the lowest opacity that clears AA (4.54:1); 0.62 is taken for margin (4.8:1). The scrub still reads clearly, it simply never becomes unreadable. |
| §11 | Motion only on `transform`, `opacity`, `clip-path`, `filter` | The §8.6 accordion transitions `grid-template-columns` | §8.6 asks in so many words for three vertical strips that expand horizontally on hover. Transforming the panels instead would distort their text. The exception is scoped to that one component and `npm run review` enforces the scope — every other layout-property transition still fails the audit. |
| §5.7 | Phosphor (Light) or Remix Icon | Six icons hand-drawn on a 24-unit grid in the Phosphor Light idiom | §5.7 also fixes the stroke at 1.25px. Phosphor ships Light as filled outlines at a fixed optical weight that cannot be restruck to 1.25px. Stroked geometry hits the specified weight exactly, scales cleanly at 20px, and costs no dependency for six glyphs. |

---

## Measured performance

Against Slow 4G with 4x CPU throttling. Arabic is the heavier language — it runs
~33% longer — so it is the number that counts.

**Two paths, measured separately.** This matters more than it sounds: a machine
reporting four cores or fewer never runs the 3D layer at all (§10), and the build
container here reports four. Numbers taken without forcing the §10 gate therefore
describe the static path only and say nothing about the WebGL one — which is the
path a headless Lighthouse runner, with more cores, actually measures.

### Static path (gate shut)

Four runs against a fresh production build, so these are ranges rather than one
lucky number:

| Metric | `/ar` | `/en` | Target |
|---|---|---|---|
| LCP | **788–828 ms** | 796–844 ms | < 2.5 s (§15) |
| LCP element | `span.hero-line` — the heading, not the canvas | same | §15.1.7 |
| CLS | **0.0214** | 0 | < 0.05 (§15) |
| Total long-task time | 547–614 ms | 400–532 ms | — |

Before the remediation the same measurement on `/ar` read LCP 856 ms, CLS 0.0016
and 764 ms of long tasks. LCP and long-task time both improved. CLS rose to 0.0214
— still under half the budget, and stable across every run — because sections are
now sized to their content instead of every one being a viewport tall, so the
reveal transitions settle against real heights rather than fixed ones.

### WebGL path (gate forced open)

The three.js chunk is **not referenced in the home page HTML** at all: it is fetched
only when the §10 capability gate opens, at idle, after paint. With the gate forced
open on `/ar`, three runs:

| Metric | This build | Before remediation |
|---|---|---|
| Total long-task time | 1306–1411 ms | 1337–1392 ms |
| Worst single task | **282–301 ms** | 437–470 ms |

Two things keep it there, and both were found by measuring rather than by reasoning:

- **Scenes build near their own viewport, at idle** (`lib/three/defer.ts`), not
  during hydration. The pin is still created at mount, because a ScrollTrigger pin
  sets the document height and making one late would move everything below it; only
  the WebGL work waits.
- **The environment probe is skipped on a software rasteriser.** Generating the
  PMREM is by far the most expensive thing the 3D layer does at start-up. On a GPU
  it is a few milliseconds; on SwiftShader it was measured here as a single ~2.8 s
  block — most of the page's total blocking time, and exactly what a headless
  Lighthouse run sees. Every scene also carries a key and a rim light, so where the
  probe cannot be afforded the scenes light with those plus a hemisphere fill, and
  the three materials roughen and lift to suit lights instead of reflections. On
  real hardware nothing changes and the full studio is used.

### The tab crash

The reported failure — the tab dying during fast scrolling with `Frame removed` —
was context exhaustion, not a memory leak. `npm run check:stress` is the regression
test: three fast full-page scroll passes with the gate forced open now report one
canvas (down from four), no `webglcontextlost`, a JS heap flat at 8 MB across all
three passes, and no console or page errors.

### Lighthouse

Netlify's Lighthouse scored the first deploy preview at **Performance 69,
Accessibility 98, Best Practices 92, SEO 100**. Deferring the scroll libraries moved
Performance into the **76–80** band. The remediation initially dropped it to **56**,
because the runner has enough cores to open the §10 gate and no GPU to render it
with; the two changes above brought the WebGL path's blocking time back under the
pre-remediation figure. The band is otherwise run-to-run variance on a shared
CI runner, not a difference between commits. Accessibility is **100**, after
axe-core named the one real defect (the §11.3 row above). LCP and CLS both clear
their targets by a wide margin, so the Performance number is dominated by Total
Blocking Time: React hydrating a page with several interactive sections under
synthetic 4x CPU throttling. The remaining structural win is to split the static
markup of `SectorsPinned` and `MaterialJourney` back into server components,
mounting only the interactive shell on the client — the pattern `HeroCrystalMount`
already uses. That is a worthwhile follow-up, not a blocker.

---

## Deploying

The build output is a standard Next.js production build; any Node host or Vercel
serves it. `next/image` optimisation is off and no image passes through `sharp` —
art is authored at final dimensions with explicit `width`/`height`.

Before the first deploy, confirm the production domain (`SITE_URL`). Changing it
after indexing requires a 301 for every path.
