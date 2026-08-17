# KMIT Industrial — Design Plan

Written before any code, per §16.1. The self-critique in part 6 was run against this
plan and the changes it produced are recorded there.

---

## 1. The signature element, in one sentence

**A calcite rhombohedron sits in the middle of the hero and the headline passes behind it;
where the crystal covers the words they split into two offset copies, because calcite is
birefringent and that is what the mineral KMIT processes actually does to light.**

Everything else on the site is quiet, sharp-cornered and corporate. There is exactly one
loud element and this is it.

---

## 2. Final palette (hex, locked)

| Token | Hex | Role | Share of page |
|---|---|---|---|
| `--brand` | `#2B3073` | primary indigo, logo, links-on-light | — |
| `--brand-mid` | `#3D55A4` | light end of the identity gradient, rim light | — |
| `--brand-deep` | `#1B1F4E` | dark section grounds, footer | dark sections ≈ 38% of home |
| `--brand-tint` | `#EEF0F7` | double-bezel outer wrap, hover surfaces | — |
| `--line` | `#D9DBE6` | 1px hairline borders | — |
| `--ink` | `#14173A` | body text on light | — |
| `--ink-soft` | `#4A4F73` | secondary text, 7.51:1 on `--paper` | — |
| `--paper` | `#FAF9F6` | body canvas | ≈ 55% |
| `--surface` | `#FFFFFF` | raised surfaces | — |
| `--mineral` | `#E8E5DE` | warm stone grey, texture and image grounds | — |

Gradient: `linear-gradient(135deg, #2B3073 0%, #3D55A4 100%)` — 135° only, parallel to the
logo's diagonal cut. Used on exactly three things: large dark section grounds, the 3px
footer rule, and the scroll progress bar. Never on text, never inside a small card.

Measured contrast (computed, not estimated — see `npm run check:contrast`):

| Pair | Ratio | Requirement |
|---|---|---|
| `--ink` on `--paper` | 16.44:1 | ≥ 4.5 body |
| `--ink-soft` on `--paper` | 7.51:1 | ≥ 4.5 body |
| `--brand` on `--paper` | 11.25:1 | ≥ 4.5 links |
| `--brand-mid` on `--paper` | 6.57:1 | ≥ 4.5 links |
| `#FFFFFF` on `--brand-deep` | 15.53:1 | ≥ 4.5 body |
| `rgba(255,255,255,.72)` on `--brand-deep` | 8.60:1 | ≥ 4.5 secondary |
| `#FFFFFF` on `--brand` | 11.84:1 | ≥ 4.5 body |
| `#FFFFFF` on `--brand-mid` (gradient end) | 6.92:1 | ≥ 4.5 body |

All 21 pairs in the system pass; the script prints the full table. No third accent colour
anywhere. Contrast is made with indigo, warm white and empty space.

---

## 3. Type — one family, differentiated by weight

`Alexandria` variable, self-hosted, two `unicode-range` subsets (arabic 31KB, latin 30KB).
No pairing — a second family would weaken the institutional discipline, and Alexandria
carries Arabic and Latin on the same geometric skeleton, which is the whole reason it was
chosen for the identity.

| Role | Latin weight | Arabic weight | Tracking |
|---|---|---|---|
| Display | 700 | **600** | `-0.02em` latin / `0` arabic |
| h2 / h3 | 600 | 500 | `-0.01em` / `0` |
| Body | 400 | 400 | `0` |
| Emphasis in body | 500 | 500 | `0` |
| Label | 500 | 500 | `0.06em` latin only |

Arabic headings drop one weight step because Alexandria's heavy weights are visually
denser in Arabic — 700 Arabic next to 700 Latin reads as two different levels of shout.
Arabic `line-height` runs +0.12 over Latin throughout for the dots and the madda.

---

## 4. Geometry — derived from the logo

The KMIT mark is straight lines and hard 45° cuts with zero curves. That is the system:

- `border-radius: 0` globally, enforced by a reset rule on `*`.
- Chamfer `clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)`,
  mirrored in RTL so the cut stays on the outer top edge. Ceiling of 3 per viewport.
- Every rule and divider at 0° or 45°. No arbitrary angles.
- Double-bezel on every primary card: `--brand-tint` outer wrap + 1px `--line` + 6px pad,
  `--surface` inner face with `inset 0 1px 0 rgba(255,255,255,.8)`. Reads as a machined part.

---

## 5. ASCII layouts

### 5.1 Hero (§8.1) — desktop 1440, RTL

```
┌──────────────────────────────────────────────────────────────────────┐
│                          ground: --brand-deep                        │
│              + 135° --grad-brand at .28 alpha + grain .03            │
│                                                                      │
│                    ┌───── floating nav, chamfered ─────┐             │
│                    │  [logo 28px]   روابط   [ع|EN]     │             │
│                    └───────────────────────────────────┘             │
│                                                                      │
│                                                                      │
│        ┌ h1 line 1 ─────────────────────────────────────────┐        │
│        │   معادن صناعية، ومجموعة تعمل  ◆◆◆◆◆                │        │
│        │                              ◆ CRYSTAL ◆           │        │
│        │   من المحجر إلى المنتج.       ◆◆◆◆◆                 │        │
│        └────────── h1 in real DOM, LCP element ──────────────┘        │
│                    ▲                    ▲                            │
│                    │                    └ canvas overlay, aria-hidden│
│                    │                      only the crystal is opaque │
│                    │                      text behind it is DOUBLED   │
│                    └ words outside the crystal are plain DOM text     │
│                                                                      │
│        سطر تعريفي واحد، عرض 62 حرفًا                                  │
│                                                                      │
│        ┌ تعرّف على المجموعة ⟋┐  ┌ كربونات الكالسيوم ┐                 │
│        └────────────────────┘  └───────────────────┘                 │
│                                                                      │
│        (no stats, no floating badges, no client logos)               │
└──────────────────────────────────────────────────────────────────────┘
```

The crystal is positioned over the *inner* half of the headline block so that the doubling
lands on real words, not on empty space. On mobile it moves above the headline and shrinks;
the doubling still reads because the shader draws its own copy of the text.

### 5.2 Sectors (§8.3) — pinned, 300vh of scroll

```
scroll 0vh ─────────── 100vh ─────────── 200vh ─────────── 300vh
           │ MATERIAL       │ MOVEMENT        │ ENERGY        │
           └─ morph ────────┴─ morph ────────┴───────────────┘

viewport while pinned (logical order: scene first, so RTL mirrors to scene-right):
┌────────────────────────────────┬───────────────────────────┐
│                                │  المادة            label  │
│      2/3 — one InstancedMesh   │                           │
│      64 slabs, three target    │  معالجة المعادن     h2    │
│      states, lerped by scroll  │  الصناعية                 │
│                                │                           │
│   state 1: cracked stone block │  سطران وصفيان             │
│   state 2: stacked slabs       │  ...........              │
│   state 3: tilted panel grid   │                           │
│                                │  اعرف المزيد ⟶            │
│   camera + lights never change │                           │
│   material is white throughout │  ● ○ ○  progress          │
└────────────────────────────────┴───────────────────────────┘

mobile / weak device / reduced-motion:
three stacked vertical blocks, each = a vector still of its state + the same text.
no pin, no morph, still convincing. (Vector rather than the WebP the brief names —
see the deviations table in the README.)
```

The morph is the point. Fragments *reassemble* into slabs; slabs *rank up* into a grid.
Same 64 instances the whole way through — nothing is added or removed, which is the visual
argument that three sectors are one company.

### 5.3 Material journey (§8.4) — pinned, 400vh, dark

```
┌─────────────────────────────────────────────────────────────┐
│ ground --brand-deep + giant KMIT icon watermark rgba(…,.04) │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │   01 ▸ الحجر الجيري        rough block, hard      │     │
│   │                             side light            │     │
│   │   02 ▸ الاستخلاص والتكسير   block shatters        │     │
│   │                             into rubble           │     │
│   │   03 ▸ الطحن الدقيق         rubble → 36k particle │     │
│   │                             cloud, GPU instanced  │     │
│   │   04 ▸ المسحوق النهائي      particles settle into │     │
│   │                             a soft white wave,    │     │
│   │                             light passes through  │     │
│   └───────────────────────────────────────────────────┘     │
│                                                             │
│   stage text swaps: fade + 24px vertical shift              │
│   numbering 01–04 allowed HERE ONLY — it is a real sequence │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Self-critique (§16.2)

> Would I have produced this same plan for any other industrial company?

Four honest yes answers, and what changed:

**6.1 The pinned three-panel sector scroller — yes, generic.**
A pinned section with a rotating visual and a text column is the default move for any
multi-division company. What makes it not generic is not the pin, it is that the geometry
*morphs* with a fixed instance count instead of cross-fading between three scenes. I
removed cross-fade from the spec entirely and constrained all three states to the same 64
instances, so the transition itself carries the "one company" argument. If the morph
cannot be made convincing, the section gets rebuilt as something else rather than shipped
as a fade.

**6.2 "Dark hero with a floating 3D object" — yes, generic.**
Rotating an abstract blob or a crystal in a dark hero is the single most predictable AI
output. The fix is that the crystal is not decoration placed *near* the text — it is
optically *coupled* to the text. Take the headline away and the object has nothing to do;
take the object away and the headline is still complete. That coupling is what no
generator reaches for, and it is specific to calcite, which is specific to KMIT. I also
rejected my first instinct — floating mineral particles in the hero background — as
exactly the banned cliché in §2.1.

**6.3 The Bento grid in §8.5 — was generic, changed.**
My first pass had four equal cells with an icon, a heading and a paragraph each, which is
the forbidden pattern in §14 wearing a Bento costume. Rebuilt as five cells of deliberately
unequal weight: one large processed image cell, two text cells of *different* sizes, one
pure-CSS material cell, one quiet cell that is mostly empty space. No icons in the grid at
all, because the icon-title-paragraph reflex is what makes those grids interchangeable.

**6.4 Section eyebrow labels — cut to zero.**
I had planned a small tracked label above each section. §14 allows one per page; I removed
all of them. The Material / Movement / Energy vocabulary does that job instead, and it
means something, which a tracked `OUR PROCESS` does not.

**6.5 What I deliberately did *not* add.**
A fourth bold element was tempting in the knowledge centre — an animated crystal-lattice
background behind the FAQ. Cut. §2.1 is right that extra boldness outside the three chosen
moves dilutes them. The knowledge centre gets one interactive calcite explorer and
otherwise reads as a reference document, which is also what makes it rank.

---

## 7. Build order (§16)

1. This document. ✔
2. Self-critique above. ✔
3. Tokens, grid, type, bilingual `dir` plumbing.
4. Every section and page static — no motion, no 3D. Site must be complete here.
5. Motion layer.
6. 3D layer + mandatory fallback path.
7. Review at 390 / 834 / 1440 in both languages — six mandatory states.
8. Run §17 acceptance list, fix every failure.

---

## 8. What the build changed, and what the review caught

Recorded after the fact, because a plan that is never checked against the result is
decoration.

### 8.1 Held as planned

The three sources of distinction in §2.1 all survived contact with the code:
birefringence in the hero, a morph rather than a cross-fade between sectors, and the
logo's zero-curve geometry. The Bento was rebuilt to unequal weights with no icons
(§6.3 above), and section eyebrow badges stayed at zero.

### 8.2 Changed under measurement

**The hero heading size.** §5.3's display scale, §8.1's two-line composition and
§17's three-line cap cannot all hold in Arabic. Measured rather than guessed: the
longest Arabic line needs 15.3x the font size against English's 11.46x. English
keeps the §5.3 scale; Arabic takes a lower ceiling. Recorded in the README's
deviations table.

**The hero's WebGL crystal, twice.** First pass rendered at half the intended size
because the mesh was scaled by the half-extent rather than by the diameter, and the
body sat at its floor alpha because an orthographic camera gives every front face
the same Fresnel term. It was visibly worse than its own CSS fallback. Fixed with
facet shading against a fixed key direction, a derivative-based internal edge, and
real `EdgesGeometry` for the silhouette — a shader can draw the boundary between two
faces but never the outer edge, where there is no neighbouring face to differ from.

### 8.3 Bugs the harnesses caught that review by eye would not have

- **Every non-hero scene rendered into a 300x150 buffer.** `<canvas>` is a replaced
  element, so `position: absolute; inset: 0` positions it without sizing it. Only
  the hero looked right, because that scene sets `canvas.style.width` itself.
- **A GLSL precision mismatch** in the process shader: `uProgress` was `highp` in the
  vertex stage and `mediump` in the fragment stage, which fails program validation.
- **A stale `next start` process** served new HTML while 404ing the newly-hashed
  stylesheet, so one whole review pass ran against browser defaults and reported
  nonsense. `scripts/review.mjs` now asserts the design tokens are present before it
  audits anything.
- **The nav's shrink-on-scroll animated `padding`**, a layout property §11 forbids.
  Now a `transform: scale()`, which also takes the mark down with it.

Both of the first two are only reachable with the §10 capability gate forced open,
which is why `scripts/preview-3d.mjs` exists and is part of the check suite.
