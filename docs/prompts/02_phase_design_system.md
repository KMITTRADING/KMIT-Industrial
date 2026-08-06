# PHASE 2 — Design System & Component Library

Read `CLAUDE.md`, `docs/brand-tokens.md`, and `docs/asset-map.json` before starting.

## Step 0 — Skill loading

Read the `SKILL.md` of these, in this order, and apply them as a stack:

| Skill | Role in this phase |
|---|---|
| `high-end-visual-design` | Primary aesthetic authority. Its constraints on spacing, shadows, cards, and animation override defaults. |
| `design-taste-frontend` | Direction inference and the anti-slop pre-flight check. Run its checklist before you report done. |
| `ui-ux-pro-max` | Colour system, font pairing, interaction states, spacing scale, accessibility guidance. |
| `ckmui-styling` | shadcn/Tailwind implementation patterns and theming. |
| `impeccable` | Visual hierarchy, cognitive load, micro-interactions, empty/error states. |
| `emil-design-eng` | Motion decisions and the invisible polish details. Consult specifically for transitions and focus states. |
| `frontend-design` (public) | Environment-specific styling constraints. |
| `design:design-system` (plugin) | Component documentation format: variants, states, a11y notes. |
| `design:accessibility-review` (plugin) | WCAG 2.1 AA verification at the end of this phase. |

**Do not** apply `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, or `stitch-design-taste` wholesale — they carry competing aesthetics. You may borrow **one** structural idea from `industrial-brutalist-ui` (its treatment of dense data tables and technical labelling) and note it in `docs/decisions.md`.

## Art direction brief

The site must read as **technical editorial** — closer to a materials-science journal or a precision-instrument manufacturer than to a SaaS landing page.

- **Grid**: 12-column with an asymmetric content rhythm. Some sections break the container to full-bleed; specification content sits in a narrower measure (65–75ch Latin, 55–65 characters Arabic).
- **Typography as the main visual device.** Alexandria at 300 for large display text, 600–700 for labels and data headers. Display sizes should be genuinely large (clamp up to ~5rem desktop) — restraint elsewhere earns it.
- **Micro-labels**: uppercase Latin / letter-spaced Arabic eyebrow labels above section titles, with a hairline rule. This single motif carries a lot of the industrial character.
- **Data as decoration**: mesh sizes, D50 ranges, purity percentages are the visual texture. A grade card should look like an instrument readout, not a pricing card.
- **Imagery treatment**: duotone toward the accent for atmospheric/plant shots; untreated colour only where material appearance matters (whiteness of the powder — that is a product claim, do not tint it).
- **Motion**: entrance transitions ≤ 300ms, easing `cubic-bezier(0.16,1,0.3,1)`, translate ≤ 12px, `prefers-reduced-motion` fully honoured. Motion is limited to: section reveal, number count-up on stat blocks, table row hover, and the locale switch. Nothing parallax, nothing scroll-jacking.

## Deliverables

### 1. Token layer
`src/styles/tokens.css` (CSS custom properties) + Tailwind theme extension consuming them. Include: colour ramps, fluid type scale, spacing scale, radii, border widths, motion durations/easings, z-index scale, and a **locale-aware typography block** (Arabic line-height and tracking adjustments applied via `[dir="rtl"]`).

### 2. Primitives (`src/components/primitives/`)
Each with full variant/size/state coverage, RTL-correct, keyboard-accessible, and typed props:

`Button` (primary / secondary / ghost / link, with loading + icon-start/end), `Badge` (grade / certification / status), `Card`, `Table` (sortable, sticky header, tabular figures, horizontally scrollable on mobile with a visible affordance), `Field` (input / select / textarea / file, with label, hint, error, RTL-correct icon placement), `Tabs`, `Accordion`, `Dialog`, `Tooltip`, `Breadcrumbs`, `Pagination`, `Alert`, `Skeleton`, `SectionHeader` (eyebrow + title + lede), `StatBlock`, `IconSet` (custom SVG icon set — do not ship a generic icon library look; draw the domain icons: mesh screen, silo, jumbo bag, tanker, lab flask, extruder).

### 3. Domain sections (`src/components/sections/`)
`Hero` (with a variant that works **without** a photograph, for the gap sections), `GradeMatrix` (the PSD table as an interactive, filterable component — this is the site's signature element), `SpecTable`, `ApplicationCard`, `CertificationStrip`, `PackagingOptions`, `LogisticsMap`, `ProcessDiagram` (SVG, animated on scroll, honouring RTL flow direction), `RfqTeaser`, `DocumentDownloadRow`, `FaqAccordion`, `ContactBlock`.

### 4. Layout
`Header` (sticky, condensed on scroll, mega-menu for Products, locale switcher that preserves the current path), `Footer` (technical sitemap, certifications, contact, legal), `LocaleSwitcher`, `SkipLink`.

### 5. `/[locale]/styleguide`
A `noindex` route rendering every token, every primitive in every state, and every section component with representative data — **in both directions**. Include a direction toggle so the human can inspect RTL and LTR side by side. This page is how the design gets approved; make it genuinely complete.

### 6. Documentation
`docs/design-system.md` in the format prescribed by `design:design-system`: per component — purpose, variants, states, props, a11y notes, do/don't.

## Pre-flight check before reporting done

Run the anti-slop checklist from `design-taste-frontend` **and** verify against `CLAUDE.md` §6. Then run `design:accessibility-review` over the styleguide and fix everything it raises.

Explicitly confirm in your report:
- No physical-direction utilities (paste the grep output).
- Contrast results for every text/surface pair.
- Focus-visible styling present and visible on every interactive element in both directions.
- `prefers-reduced-motion` verified.

Commit `feat(design-system): tokens, primitives, domain sections, styleguide`.

Do not start Phase 3.
