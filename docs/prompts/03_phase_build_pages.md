# PHASE 3 — Page Construction

Read `CLAUDE.md`, `docs/site-architecture.md`, `docs/design-system.md`, `docs/asset-map.json`.

## Step 0 — Skill loading

- `impeccable` — page-level hierarchy, empty/error/edge states
- `cro` — conversion structure of every page, form design, friction removal
- `high-end-visual-design` — still binding on every new composition
- `design:ux-copy` — microcopy: buttons, labels, errors, empty states (bilingual)
- `marketing-psychology` — apply selectively: technical-buyer trust cues only (specificity, third-party standards, reversal of risk via sampling). **No scarcity timers, no fake social proof.** B2B industrial buyers punish that.
- `full-output-enforcement`

## Content posture for this phase

Final copy arrives in Phase 4. Here you write **structured, realistic interim content** drawn strictly from `docs/technical-data.md`, stored in the typed `src/content/{ar,en}/` modules with the final shape. Never use lorem ipsum — it hides layout problems. Where a fact is genuinely unavailable, use the token `TODO(data): <field>` visibly in the content module, not in the rendered output.

## Pages

### `/[locale]` — Home
Structure, in order:
1. **Hero** — answer-first: who KMIT is, what grades, which market, in one sentence. One primary CTA (`Request a quote`) and one secondary (`Download TDS`). No carousel.
2. **Grade strip** — the five grade codes as a horizontal instrument-readout row (`GCC-200 … GCC-2500`), each linking to its page. This is the highest-intent element above the fold on desktop; keep it there.
3. **Why in-Kingdom supply** — lead time, SASO compliance, logistics from Jeddah, technical support. Four points, each with a concrete number or standard.
4. **Applications** — five sectors, each an image/typographic card linking to its page.
5. **Specification snapshot** — a condensed TDS table. Real `<table>`. This is deliberately unusual on a homepage and is the point.
6. **Quality & compliance** — ISO 9001 / 14001 / 45001, SASO, REACH, RoHS as a certification strip with what each actually means for the buyer.
7. **Packaging & logistics** — 25kg valve bags / jumbo bags / bulk tankers, with capacities.
8. **RFQ block** — short form: grade, tonnage, application, destination, contact. Five fields maximum.

### `/[locale]/products`
Index + the **GradeMatrix** as the centrepiece: filterable by mesh, D50, coated/uncoated, target industry. Filter state in the URL (`?industry=plastics`) so it is shareable and indexable. Include a comparison mode (select up to 3 grades → side-by-side spec table).

### `/[locale]/products/[grade]`
Static params from the grade dataset. Per page: answer-first intro, full TDS table with test methods, PSD curve (SVG chart from the data — not an image), typical applications with links, packaging options, storage and shelf life, downloads (TDS/MSDS/COA), a 4–6 item FAQ answering real formulation questions, and a grade-prefilled RFQ CTA. Include "related grades" navigation (step up/down in fineness).

### `/[locale]/applications` and `/[locale]/applications/[sector]`
Five sectors: `plastics-masterbatch`, `paints-coatings-construction`, `oil-gas-drilling`, `rubber-elastomers`, `paper-paperboard`. Each sector page: the technical problem the filler solves, recommended grades with reasoning, dosage/loading guidance where the source data supports it, process considerations (dispersion, extrusion, vulcanisation…), and a sector-prefilled RFQ.

### `/[locale]/sustainability-and-facility`
Processing flow (the `ProcessDiagram` component: quarry → crushing → milling → classification → coating → collection silos → packing), quality lab and instrumentation, HSE posture, environmental management. Photography-led — this is where the plant imagery earns its place.

### `/[locale]/resources`
Document library: TDS / MSDS / COA, filterable by grade and document type. Downloads gated by a lightweight form (name, company, email, grade of interest) — gate is **soft**: the file is still directly linkable for crawlers via a public path, so the documents remain indexable. Record the decision in `docs/decisions.md`.

### `/[locale]/rfq`
The full quotation form. Fields: grade (multi), estimated monthly tonnage, application/sector, packaging preference, delivery city/port, required certifications, target start date, contact block, free-text notes, optional spec-sheet upload. Progressive disclosure — do not show all 10 fields at once. Client-side zod validation with bilingual messages, honeypot + rate limit, success state that tells the buyer exactly what happens next and by when.

### `/[locale]/contact`
Jeddah HQ, technical enquiries vs. commercial enquiries split, working hours, map, and a short form. `LocalBusiness`/`Organization` data consistent with the JSON-LD added in Phase 5.

### System pages
`not-found`, `error`, `loading` skeletons per route group, and a `noindex` `/styleguide`.

## Cross-cutting requirements

- Every page: RSC by default; `"use client"` only for filters, forms, tabs, and the locale switcher.
- Every page exports typed `generateMetadata` with per-locale title/description and canonical + alternates.
- Every image resolved through `docs/asset-map.json`. Gap sections use the non-photographic hero variant.
- Every form field bilingual-labelled, RTL-correct, and keyboard/screen-reader complete.
- Mobile is the primary review target: procurement managers open RFQ links on phones.

## Definition of done

Quality gates from `CLAUDE.md` §9 all pass. Report: route-by-route status, which sections fell back to non-photographic treatment and why, remaining `TODO(data)`, and the actual Lighthouse numbers for `/ar` and `/en`.

Commit `feat(pages): full bilingual route tree with structured interim content`.
