# KMIT Industrial Solutions — Phase 1 Plan

Status: **awaiting approval.** No implementation code has been written.
Scope of this document: technical architecture, file tree, dependency list,
section-by-section wireframe logic, and the 3D approach — per brief §0.

**Decisions taken (2026-08-19).** Three questions were put and answered:

1. **Arabic is the default language.** `/` 301s to `/ar`; `x-default` → `/ar`.
2. **The supplied English lockup is used on both locales.** No Arabic lockup is
   invented or typeset.
3. **The three stale asset sets are deleted** — `public/og/**`, `public/llms.txt`,
   `public/contact-icons/**`.

They are folded into D3, D4 and D6 below. Nothing else in this plan has been
approved yet.

---

## 0. What is actually in the repository right now

The working tree contains `public/` and nothing else. The previous multi-page
site (`/sectors`, `/calcium-carbonate`, `/quality-hse`, `/sustainability`) was
removed in commit `0304d9f`. This is a clean build.

Assets that survive and are usable:

| Path | What it is | Verdict |
|---|---|---|
| `public/brand/logo.svg` | Official Illustrator export. KMIT wordmark + `INDUSTRIAL SOLUTIONS` as outlines. `viewBox 0 0 1920 648.6`, fill `#2b3073`. | **Use.** This is the supplied logo. |
| `public/brand/icon.svg` | Official Illustrator export of the K mark. `viewBox 0 0 655.3 648.6`. | **Use.** |
| `public/brand/KMIT_Industrial_*.svg` | Script-cleaned re-exports of the two above (identical path data). | Delete — redundant duplicates. |
| `public/fonts/alexandria-{latin,arabic}-var.woff2` | Self-hosted Alexandria variable subsets, **weight axis 400–700 only**. | Replace with 200–700 subsets (see D2). |
| `public/og/**` (4 MB, 18 PNGs) | Open Graph cards for the **deleted** page structure. | Delete — the pages no longer exist. |
| `public/llms.txt` | Describes the old site, and publishes "marble stone transport" as an area of work, which is **not in brief §1**. | Delete and rewrite. |
| `public/contact-icons/**` | mail, phone, location, **whatsapp**. | Delete. A WhatsApp icon asserts a channel that is not a verified fact in §1, and the brief's register argues for typographic contact rows over an icon set. |

> Brief §2 says the logos are "not in the repo yet". They are. Both are genuine
> Illustrator exports carrying the brand hex, not traced or generated. The
> `<Logo />` component will render the supplied files. Nothing will be drawn.
> **One gap: there is no Arabic lockup.** See open question Q2.

---

## 1. Stack decision

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16, App Router, TypeScript**, `output: 'export'` | Two real prerendered locale routes, per-locale `generateMetadata`, static HTML that any host serves. Matches the brief's default expectation. |
| Styling | **Tailwind CSS v4**, tokens declared in `styles/tokens.css` via `@theme` | See D1. Same guarantee the brief wants — no arbitrary hex in components — with no JS config file. |
| 3D | **three.js r185**, in `dynamic(..., { ssr: false })` | Only real option for the core sample at this fidelity. Loaded after `window.load`. |
| Motion | **Native `position: sticky` + one rAF-gated scroll module + IntersectionObserver** | See §5. |
| Scroll library | **None** | GSAP + ScrollTrigger is ~90 KB gz for behaviour that four sticky containers give for free. Lenis hijacks native scrolling, fights RTL trackpads and Android address-bar collapse, and would push us past the JS budget in §9. Neither earns its weight. |
| Animation library | **None** | Reveals are CSS transitions toggled by an `IntersectionObserver` class flip. `prefers-reduced-motion` then disables them with one media query rather than a runtime branch. |

### Runtime dependencies — three, each justified in one line

- `next` — the framework: static export, locale routing, metadata, image dimensions.
- `react`, `react-dom` — required peer of Next; not an independent choice.
- `three` — the core sample geometry, materials and renderer.

### Dev dependencies

- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three` — types.
- `tailwindcss`, `@tailwindcss/postcss`, `postcss` — the styling pipeline.
- `playwright` — Phase 3 screenshots at 6 widths × 2 locales × 3 rendering modes. Chromium is already on the machine; no browser download.
- `axe-core` — accessibility assertions in the review script.
- `lighthouse` — the §9 mobile performance run. Dev-only; never bundled.

Nothing else. No icon library, no font loader package, no utility-class merger,
no state manager, no i18n runtime — routes and typed content objects do that job.

---

## 2. File tree

```
app/
  layout.tsx                    root <html> shell is per-locale, so this only
                                  carries the <head> defaults
  page.tsx                      "/" → locale redirect stub (D3)
  robots.ts
  sitemap.ts                    with xhtml:link alternates
  [locale]/
    layout.tsx                  <html lang dir>, fonts, metadata, JSON-LD
    page.tsx                    composes the seven sections in order
components/
  layout/
    Header.tsx                  anchors, scrollspy, mobile panel
    Footer.tsx
    LanguageSwitch.tsx          preserves the current anchor
    Logo.tsx                    renders the supplied SVGs, sizing + clear-space
  sections/
    Hero.tsx  Areas.tsx  Approach.tsx  Strata.tsx  Region.tsx  About.tsx  Cta.tsx
  three/
    CoreSampleMount.tsx         client island: capability gate + dynamic import
    CoreSample.tsx              scene, geometry, materials, loop
    coreSampleModel.ts          the 14 authored band definitions (pure data)
    StrataFallback.tsx          CSS strata column for the no-WebGL path
    useScrollProgress.ts        subscribe to the single scroll driver
  ui/
    StrataRule.tsx  Button.tsx  Label.tsx  Reveal.tsx  CoordinateReadout.tsx
lib/
  scrollDriver.ts               one passive listener, one rAF, N subscribers
  locales.ts                    'en' | 'ar', dir map, alternates
content/
  types.ts                      the Copy interface — the contract
  en.ts  ar.ts                  `satisfies Copy` → missing key is a build error
  images.ts                     every image referenced through this map
  facts.ts                      the §1 facts, single source, imported everywhere
styles/
  tokens.css  type.css  globals.css
scripts/
  check-facts.mjs  check-copy.mjs  check-i18n.mjs  check-contrast.mjs
  check-a11y.mjs   shots.mjs      check-perf.mjs   gen-fonts.mjs  gen-og.mjs
netlify.toml                    node version, build command, publish = out
docs/
  design-plan.md                this file
```

No component over ~150 lines. Every section is its own file.

---

## 3. Content and bilingual architecture

`content/types.ts` declares one exhaustive `Copy` interface — every string on the
site, nested by section, with literal-typed tuples where a count matters
(`areas: [Area, Area, Area]`, `principles: [P, P, P, P]`, `steps: [S, S, S, S]`).
`en.ts` and `ar.ts` are each `const en: Copy = { … } satisfies Copy`. A missing
translation is a **type error**, not a runtime fallback. `scripts/check-i18n.mjs`
additionally walks both objects and diffs the flattened key paths, so §12's
"programmatically diff the content keys" produces a report even when the compiler
is already green.

`content/facts.ts` holds the §1 table — name, Arabic name, email, phone, city,
country, group affiliation, coordinates. Every component reads from it. Nothing
factual is typed inline in a component, which is what makes the §12 fact audit
mechanical rather than a reading exercise.

**Routing.** `app/[locale]/page.tsx` with
`generateStaticParams() => [{locale:'en'},{locale:'ar'}]`. Both are real
prerendered HTML documents, independently indexable, with `lang` and `dir` set on
`<html>` in the locale layout. **Arabic is the default**: `/` 301s to `/ar`, and
`hreflang="x-default"` points at `/ar` alongside the explicit `ar` and `en`
alternates. Arabic is therefore the primary composition, not a mirrored
afterthought — RTL is the case I design first and check first at every width. The language switch is an `<a href>` to the
mirrored URL — a real navigation, not a client toggle — and it appends the
current section anchor read from the scrollspy, so `/en#approach` lands on
`/ar#approach`.

**Direction.** All layout CSS uses logical properties: `padding-inline`,
`margin-block`, `inset-inline-start`, `border-inline-start`, `text-align: start`.
`left` / `right` appear nowhere in layout. Things that must actively mirror, each
tested in both locales:

- the 3D object's offset side (hero: trailing side in both, which is *left* in AR),
- the hero and Region gradient scrims,
- the underline draw direction on nav items and links,
- the arrow glyph in buttons (a rotated hairline, so RTL flips by transform),
- the signature-scroll step index rail,
- the scroll cue's label alignment.

**Arabic type.** `letter-spacing: 0` (positive or negative tracking breaks the
joins), line-height +0.12 over the Latin value at every step of the scale, and
the minimum weight steps up from 200 to 300 for body / 400 for anything small.
Western numerals in UI labels, per §6.

---

## 4. Section-by-section wireframe logic

The grid is 12 columns, `max-width` 1440 shell / 1180 content, gutter
`clamp(1.25rem, 4vw, 5rem)`. The *strata rule* — 3–4 hairlines of varying length
and weight at `--line` — is the only divider. There are no cards, no boxes, no
border radius anywhere (the radius scale is zeroed in the theme so a stray
`rounded-lg` cannot reintroduce a curve).

### Header
- **Purpose.** Identity, five anchors, language.
- **Content.** `<Logo />` at inline-start (28 px tall, clear-space = half the mark's height). Nav: Home · Solutions · Approach · About · Contact. `AR | EN` at inline-end behind a hairline.
- **Motion.** Transparent over the hero; after 48 px of scroll it gains a white backdrop and a bottom hairline (opacity transition only). Scrollspy via `IntersectionObserver` marks the active anchor with a 1 px gradient underline that draws from the leading edge.
- **Responsive.** ≤768 px the nav collapses to a text button that opens a full-bleed white panel: nav items as a strata list with `01`–`05` indices at display scale. 44 px minimum targets, focus trapped, `Esc` closes, `aria-expanded` on the trigger.

### 01 — Hero
- **Purpose.** State what KMIT is in two seconds.
- **Content.** Eyebrow: `Jeddah, Saudi Arabia` beside a strata rule. `<h1>` is three words stacked at display scale — `Materials.` / `Minerals.` / `Energy.` — the third filled with the brand gradient (`background-clip: text`, with a solid `#2B3073` fallback declared first so an unsupported browser still gets readable type). Below: the positioning line, one paragraph, two sentences at most. One primary link (`Discuss a project`) and a scroll cue.
- **Layout.** Type occupies the leading 7 columns; the core sample occupies the trailing 5 and is cropped by the viewport top and bottom so it reads as continuing beyond frame. Not a photo with text on it — there is no photo.
- **Motion.** On load, the three words rise 16 px and fade in sequence (60 ms apart, 500 ms, `ease-out-expo`). The core sample rotates slowly and continuously. Nothing else moves.
- **Responsive.** ≤900 px the object moves behind the type at 55 % opacity under a stronger scrim, and the words drop to `clamp(2.75rem, 13vw, 4rem)`. ≤430 px the object is a narrow band down the trailing edge, not a backdrop — mobile is a different composition, not a squeezed desktop.

### 02 — Areas of work
- **Purpose.** Present three areas as one system.
- **Content.** An `<ol>` of three rows, each `[index] [title] [one-line descriptor] [one-sentence body]`, separated by strata rules. Calcium Carbonate · Mining · Solar Energy Panels.
- **Layout.** Within a row: index 1 col, title 3, descriptor 3, body 5. Generous row height (`padding-block: clamp(2rem, 4vw, 3.5rem)`).
- **Motion.** Hover or keyboard focus draws a 2 px gradient edge up the row's inline-start edge, shifts the title 8 px toward the trailing side, and lifts a 2 % brand tint behind the row. Transform and opacity only.
- **Responsive.** ≤768 px the row stacks: `index · title` on one line, descriptor, then body — the hairlines survive, so it still reads as a geological log rather than three stacked cards.

### 03 — Approach
- **Purpose.** How KMIT works, without inventing a process.
- **Content.** Four principles, one sentence each: Industrial thinking · Practical solutions · Reliability · Long-term value. A short section lead above.
- **Layout.** Four columns, each opening with a hairline and a small index. No boxes.
- **Motion.** The four hairlines draw from the leading edge, staggered 80 ms, as the section enters. Text fades up.
- **Responsive.** 4 → 2 → 1 columns at 1024 and 640.

### 04 — Signature scroll ("Strata")
- **Purpose.** The defining experience: the argument that one structure carries all three areas.
- **Structure.** A container of `400svh` wrapping a `position: sticky; top: 0; height: 100svh` stage. Progress = the container's travel through the viewport, `0 → 1`, from the single scroll driver.
- **Content.** Four steps: Material → Extraction → Application → Energy. Index, title, one to two sentences.
- **Layout.** Text on the leading side (5 cols), the core sample on the trailing side (7 cols), a 4-tick index rail between them.
- **Motion.** Steps crossfade with a 12 px translate; the active tick fills with gradient. On the trailing side the core sample's bands pull apart, the camera drifts up the core, and the object moves toward centre.
- **Accessibility.** All four steps are in the DOM and in the accessibility tree at all times — inactive ones are `opacity: 0` only. Never `display:none`, never `visibility:hidden`, never `aria-hidden`. With `prefers-reduced-motion` or without JS, the stage un-sticks via a media query and the four steps render as an ordinary vertical sequence with their strata rules. The story is complete with every animation off.
- **Responsive.** ≤900 px the object sits behind the text under a scrim and the separation is reduced; the stage stays sticky but the container drops to `340svh` so the section is not a scroll tax on a phone.

### 05 — Region
- **Purpose.** Saudi Arabia → Middle East.
- **Content.** Heading, one paragraph, and a coordinate readout for Jeddah — `21.4858° N` / `39.1925° E` — set small, weight 300, letter-spaced. No country list: naming countries would imply a presence that §1 does not establish.
- **Graphic.** Inline SVG, no map. Concentric rings centred on the Jeddah node, radial tick marks at the rings, and one arc drawn on scroll via `stroke-dasharray` / `stroke-dashoffset`, reaching full length at 60 % section progress. The node is a small filled square with a hairline cross.
- **Colour.** Full-bleed brand gradient (`135deg, #2B3073 → #3D55A4`). The only dark section on the site. White type on it.
- **Motion.** Arc draw + ring fade-in. Under reduced motion, the arc renders complete on first paint.
- **Responsive.** The graphic scales with `viewBox` and never drives layout height; below 768 px it sits under the copy rather than beside it.

### 06 — About
- **Purpose.** Who KMIT is, concisely.
- **Content.** Two short paragraphs. The group affiliation line, in both scripts: *A branch of Kmit Al-Mutamayiza Trading* / *أحد أفرع شركة كميت المتميزة التجارية*. An audience list as pills: manufacturers, industrial organizations, procurement teams, technical stakeholders, energy projects. One image slot.
- **Image slot.** Declared in `content/images.ts` with explicit width, height and per-locale alt text, so CLS is zero before the file exists. Until KMIT photography is supplied it renders a clearly marked neutral placeholder — banded greys, obviously a slot, never a stock photograph. Listed in the README placeholder table.
- **Motion.** Standard reveal only.
- **Responsive.** Image and copy swap from side-by-side to stacked at 900 px; pills wrap.

### 07 — Contact CTA
- **Purpose.** Convert.
- **Content.** A large statement at display scale. Primary button `Discuss a project` → `mailto:mohanad@kmit.co` with a prefilled subject. Secondary: the phone as `tel:+966574950950` and the email as text. A strata rule above.
- **Responsive.** Button is full-width below 640 px, 48 px tall.

### Footer
Logo, one-line statement, nav column, areas-of-work column, contact block,
strata rule, copyright with the current year, and the Arabic company name.
**No social links** — none are verified. **No map.**

### Sections deliberately absent
No statistics band, no certifications strip, no client logos, no testimonials,
no team, no timeline, no case studies. Each would need facts that §1 does not
contain, and §1 says the correct outcome is fewer sections.

---

## 5. Motion architecture

`lib/scrollDriver.ts` — one module, one `scroll` listener registered
`{ passive: true }`, one `resize` listener, one rAF. Subscribers register a
callback and are invoked at most once per frame with `{ scrollY, viewportHeight }`.
Nothing else in the app attaches a scroll listener. The driver never starts if
`matchMedia('(prefers-reduced-motion: reduce)')` matches.

Everything that can be CSS is CSS:

- **Reveals** — `IntersectionObserver` adds `data-revealed`; the transition lives in CSS. Reduced motion neutralises it in one media query.
- **Sticky stages** — `position: sticky`. No pinning maths, no layout thrash, no scroll hijack.
- **Hover, focus, header state** — pure CSS or a single class flip.

Only two things read continuous scroll progress: the signature-scroll stage and
the Region arc. Both go through the driver, both write to CSS custom properties
on their own root element (`--p`), and the visual result is expressed in CSS.

---

## 6. The 3D approach

**One object, one canvas, two sections.** The canvas is a single
`position: fixed; inset: 0; pointer-events: none` layer behind the content, so a
second WebGL context is never created and the object can genuinely travel between
the hero and the signature section. Its opacity is driven by which of the two
sections is on screen; at opacity 0 the render loop is stopped, not just hidden.

**The core sample.**

- 14 stacked cylinder segments — **authored, not random**. `coreSampleModel.ts` exports a fixed array of 14 `{ height, colour, roughness, metalness }` records. Deterministic across loads and across machines by construction; there is no seeded PRNG to get wrong.
- One shared `CylinderGeometry`, instanced per band with a per-band Y scale and position, so the whole object is 14 draw calls plus 13 seam rings, not 27 geometries.
- Colour ramp bottom → top: bone limestone `#EFECE6` → grey `#B9BECF` → `#3D55A4` → `#2B3073`, interpolated in linear space across the band indices.
- **The crown band is the solar panel**: `roughness 0.08`, `metalness 0.55`, so it reads as a laminated glass slab against the matte rock below it. That single material break is the argument of the site expressed in one object.
- Thin seam rings between bands — flat torus rings in a darker neutral, 0.6 % of the core height.
- Lighting: `HemisphereLight` + directional key + directional fill + rim. `shadowMap` disabled, no bloom, no particles, no post-processing, no environment map. `ACESFilmic` tone mapping at exposure 1.0, `SRGBColorSpace` output — clean studio, not a game asset.

**Hero behaviour.** Object offset to the trailing side (mirrored in RTL by
negating its X), cropped top and bottom by the viewport, slow continuous rotation
at ~0.06 rad/s about Y. Nothing else.

**Signature behaviour.** Scroll progress `0 → 1` maps to: band separation
(each band translates along Y by `(index − centre) × gap × p`), a camera rise up
the core, and the object's X easing to centre. All three are one lerp each, run
in the render loop from a single progress value the driver already computes.

**Capability gate — the object never loads unless all of these hold:**

- `window.load` has fired (the 3D is never on the LCP path),
- `prefers-reduced-motion` does not match,
- `navigator.deviceMemory > 2` where the property exists,
- a WebGL2 (or WebGL) context is actually obtainable.

`webglcontextlost` is handled: preventDefault, stop the loop, swap to the
fallback, and attempt one restore on `webglcontextrestored`.

**Fallback — `StrataFallback.tsx`.** Not an empty space. A static CSS strata
column carrying the same idea: stacked bands with the same authored heights and
the same colour ramp read from `coreSampleModel.ts`, seam hairlines between them,
the crown band given a subtle linear-gradient sheen to read as glass. One data
source, two renderers. This is what everyone on reduced motion, low memory or no
WebGL sees, and the page is complete with it.

**Budget.** `devicePixelRatio` capped at 1.75 desktop / 1.5 mobile, the loop
paused on `IntersectionObserver` miss and on `visibilitychange`, and the whole
three.js chunk behind `dynamic(..., { ssr: false })` so it is not in the initial
bundle at all.

---

## 7. Performance plan against §9

| Budget | Approach | Risk |
|---|---|---|
| LCP < 2.0 s | LCP element is the hero `<h1>` — text, no image, no 3D. Fonts self-hosted, preloaded, `display: swap`. 3D deferred past `window.load`. | Low |
| Initial JS < 100 KB gz (excl. three) | The page is server-rendered static HTML. Client islands are only: header scrollspy + mobile panel, the scroll driver, the reveal observer, the 3D mount. Everything else is a server component. | **Medium — see D5.** |
| CLS < 0.05 | Every image slot carries explicit width/height in `images.ts`; the canvas is fixed-position and outside flow; fonts are self-hosted with matched fallback metrics. | Low |
| DPR cap, loop pause, context loss | As §6. | Low |
| Font | Two woff2 subsets, one per script, split by `unicode-range` — an Arabic page never downloads Latin outlines. | Low |

---

## 8. SEO plan against §11

Per-locale `title`, `description`, `canonical`, Open Graph and Twitter card from
`generateMetadata`. `hreflang` `en`, `ar`, and `x-default`. `sitemap.xml` with
`xhtml:link` alternates and `robots.txt` from Next's file conventions.

**Organization JSON-LD, verified fields only:** `name`, `alternateName`, `url`,
`logo`, `email`, `telephone`, `address` limited to `addressLocality: "Jeddah"`
and `addressCountry: "SA"`, and `areaServed`. **No `LocalBusiness`** — there is
no published street address, and emitting one would be a false signal. No
`foundingDate`, no `numberOfEmployees`, no `aggregateRating`.

Two OG images, one per locale, generated from the real type and the real brand —
replacing the 18 stale cards for pages that no longer exist.

---

## 9. Deviations from the brief — each needs your nod or your objection

**D1 — Tailwind v4 with `@theme` in `styles/tokens.css`, not `tailwind.config.ts`.**
Tailwind v4 moved configuration into CSS; a `tailwind.config.ts` is a legacy
compatibility path. The guarantee you asked for is unchanged: brand tokens are
declared once, exposed as utilities, and the radius scale is zeroed so components
cannot reach outside the system. Say the word and I will pin v3 instead.

**D2 — Self-host Alexandria instead of Google Fonts + preconnect.**
Self-hosting removes a third-party connection and a render-blocking stylesheet
request from the critical path, and it satisfies "subset to the weights actually
used" more precisely than the CDN can. The two files already in `public/fonts`
only carry weights **400–700**; §6 wants the range down to 200. I will regenerate
both subsets across **200–700** from the upstream variable font. Verified
reachable and correct at plan time.

**D3 — `/` issues a real 301 to `/ar`, from a static export. Resolved.**
The previous `next.config.ts` rejected `output: 'export'` on the grounds that a
static export cannot issue a real redirect for `/`, only a meta-refresh stub —
a weaker canonical signal. That reasoning was sound for a generic static host but
does not apply here: Netlify evaluates `netlify.toml` redirect rules at the edge,
before any file is served. So `[[redirects]] from = "/" to = "/ar" status = 301
force = true` gives a genuine HTTP 301 **and** keeps the whole site a static
export with no server runtime. Both objections answered at once. `/en` and `/ar`
remain the real, independently indexable documents.

**D4 — The logos are in the repo and I will use them. Resolved.**
`public/brand/logo.svg` and `icon.svg` are genuine Illustrator exports carrying
`#2b3073`. Nothing will be redrawn, traced or generated. No Arabic lockup exists,
and the decision is to **use the supplied English lockup on both locales** — zero
invention, which outranks script symmetry here. `<Logo />` therefore renders the
same file for `en` and `ar`; only its clear-space and the flow position mirror.
Its `alt` / `aria-label` is still per-locale, so a screen reader on `/ar` hears
the Arabic company name even though the artwork is Latin. If an Arabic lockup is
supplied later it drops into one place in the component.

**D5 — The < 100 KB initial JS budget is the one I cannot promise in advance.**
Next 16 + React 19 carry a framework baseline before a line of my code ships.
The mitigations are real (server components everywhere, four small islands, no
route prefetch, `optimizePackageImports`), and I will report the measured number
rather than a comfortable one. If it lands over budget I will tell you the figure
and what removing the gap would cost.

**D6 — Removing stale assets. Resolved: all three sets go.**
`public/og/**` (18 cards, 4 MB), `public/llms.txt`, and `public/contact-icons/**`
are deleted in the first Phase 2 commit. Two OG cards and a rewritten `llms.txt`
are regenerated in step 6 of the build order; contact rows are typographic, so
the icon set is not replaced.

**D7 — Netlify is the host.** The PR raised a `netlify/kmit-industrial/deploy-preview`
status, so the deploy target is Netlify. That confirms `output: 'export'` is the
right call and adds one file to the tree: a `netlify.toml` pinning the Node
version, `command = "npm run build"` and `publish = "out"`. Until Phase 2 lands a
`package.json`, deploy previews on this branch have nothing to build — the red or
empty preview on the plan commit is expected, not a regression.

---

## 10. Facts discipline

`content/facts.ts` is the only place a fact is written. `scripts/check-facts.mjs`
parses the built HTML for both locales and flags every numeric token, then diffs
against an explicit allowlist: the phone number, the Jeddah coordinates, the
copyright year, and the section indices `01`–`05`. Anything else fails the build.
`scripts/check-copy.mjs` fails on the §6 banned-word list in both locales. Every
unavoidable placeholder is marked `<!-- PLACEHOLDER: … -->` in source and listed
in a README table.

---

## 11. Build order for Phase 2

1. Tokens, type scale, layout shell, `StrataRule`.
2. Content layer, `facts.ts`, types, both locales, routing and `dir`.
3. Sections, static, no motion — the whole site readable and correct first.
4. Motion: scroll driver, reveals, sticky stages.
5. 3D: model data, fallback first, then the canvas.
6. SEO, metadata, sitemap, JSON-LD, OG.
7. Polish, then the §12 checklist as Phase 3 with a results table.

Commits in small logical units, with a short note after each section on what is
done and what is still stubbed.

---

## 12. Deploy preview status on this branch

The Netlify checks (`Deploy Preview`, `Pages changed`, `Header rules`,
`Redirect rules`) are **red on both plan commits, and would be red on `main`
too**: the reset left no `package.json`, so there is nothing for Netlify to
build. This is not a regression introduced by the plan, and there is no fix that
belongs in a docs-only commit. The checks go green when Phase 2 lands
`package.json`, `next.config.ts` and `netlify.toml` in step 1 of the build order.
