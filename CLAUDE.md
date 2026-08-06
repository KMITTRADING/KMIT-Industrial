# CLAUDE.md — KMIT Industrial B2B Portal

> Commit this file to the repository root. Claude Code loads it automatically every session.
> It is the single source of truth for stack, conventions, and quality bars.

---

## 1. Project identity

**KMIT** is a Saudi supplier and processor of industrial calcium carbonate (CaCO₃), headquartered in Jeddah, serving the KSA and wider GCC market.

This repository holds a **bilingual (Arabic-first / English-second) B2B industrial portal** whose job is:

1. Convince a **procurement manager** that KMIT is a reliable, certified, in-Kingdom supply partner.
2. Convince an **R&D / QC engineer** that the grades meet spec — with real TDS numbers, PSD data, and test methods on the page.
3. Capture a **qualified RFQ** with grade, tonnage, application, and destination.

The audience is technical. Never write consumer-marketing fluff. Every claim must be attached to a number, a standard, or a test method.

---

## 2. Non-negotiable constraints

| Rule | Detail |
|---|---|
| Arabic is primary | Default locale `ar`, direction RTL. English (`en`) is a full, equal-quality translation — never a machine-translated afterthought. |
| No hardcoded direction | Use CSS logical properties only: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`. **Never** `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`, `text-right` in layout code. |
| No invented data | Technical values come from `docs/technical-data.md` only. If a number is not there, write `TODO(data): <field>` and list it in the phase report. Never guess a purity %, a certificate number, or a capacity figure. |
| Images come from the repo | All imagery already exists in this repository. Filenames indicate the section they belong to. Never reference an external stock image or a placeholder service. |
| No generic AI design | See §6. Templated SaaS-landing aesthetics are a defect, not a style. |
| Type safety | `strict: true`. No `any`. No `@ts-ignore` without a one-line justification comment. |
| Full output | Never emit `// ... rest of the code`, `// implementation omitted`, or truncated files. If a file is long, write it completely. |

---

## 3. Stack

- **Next.js 14+ App Router**, TypeScript strict, React Server Components by default (`"use client"` only where interactivity truly requires it).
- **Tailwind CSS** with `tailwindcss-logical` conventions and a custom token layer (§5).
- **next-intl** for i18n routing, message catalogs, and locale-aware formatting.
- **shadcn/ui** as the component substrate — but every component must be re-skinned to the KMIT design system before use. Unmodified shadcn defaults are not acceptable output.
- **Framer Motion** for restrained, purposeful motion only.
- **next/font** loading **Alexandria** (variable, weights 300–800) for both Arabic and Latin.
- **next/image** for every raster asset. SVG via inline React components.
- No CMS in v1. Content lives in typed data modules under `src/content/`.

---

## 4. Repository structure (target)

```
/
├─ CLAUDE.md
├─ README.md
├─ docs/
│  ├─ technical-data.md        # authoritative product/TDS/PSD source
│  ├─ asset-map.json           # generated: image file -> section, alt_ar, alt_en
│  ├─ brand-tokens.md          # generated: palette extracted from logo.svg
│  ├─ keyword-clusters.md      # SEO target map
│  └─ decisions.md             # ADR log: every non-obvious choice, one line each
├─ public/
│  ├─ images/                  # optimized, renamed from the original asset drop
│  └─ documents/               # TDS / MSDS / COA PDFs when supplied
├─ src/
│  ├─ app/
│  │  └─ [locale]/
│  │     ├─ layout.tsx
│  │     ├─ page.tsx                         # home
│  │     ├─ products/page.tsx
│  │     ├─ products/[grade]/page.tsx
│  │     ├─ applications/page.tsx
│  │     ├─ applications/[sector]/page.tsx
│  │     ├─ sustainability-and-facility/page.tsx
│  │     ├─ resources/page.tsx               # TDS / MSDS / COA library
│  │     ├─ contact/page.tsx
│  │     └─ rfq/page.tsx
│  ├─ components/
│  │  ├─ primitives/          # Button, Badge, Card, Table, Field...
│  │  ├─ sections/            # Hero, GradeMatrix, SpecTable, ApplicationGrid...
│  │  └─ layout/              # Header, Footer, LocaleSwitcher, Breadcrumbs
│  ├─ content/
│  │  ├─ ar/  en/             # typed content modules, mirrored keys
│  │  └─ schema.ts            # zod schemas — build fails if ar/en drift apart
│  ├─ lib/                    # seo.ts, jsonld.ts, rfq-adapter.ts, utils.ts
│  └─ styles/
├─ messages/ ar.json en.json
└─ tests/
```

**Original image files must never be deleted.** Reorganize by copying into `public/images/` with normalized kebab-case names; keep the original drop intact in a `assets-source/` folder until the human approves removal.

---

## 5. Design tokens

Tokens are generated in Phase 2 from `logo.svg` and recorded in `docs/brand-tokens.md`. Rules that hold regardless of the extracted values:

- **One accent colour only.** The logo's dominant colour is the accent. Everything else is a neutral ramp (9 steps) plus semantic states.
- **Neutrals are not pure grey.** Tint the ramp very slightly toward the accent's hue (2–4% saturation) so the interface feels engineered rather than default.
- **Type scale**: fluid `clamp()` scale with a large step ratio (1.25 minor third at body, 1.414 at display). Arabic and English share the scale but Arabic gets `line-height` +0.12 and slightly reduced letter-spacing.
- **Spacing**: 4px base, but section rhythm uses a coarse scale (`96 / 128 / 160px` desktop) — industrial layouts need air.
- **Radius**: near-square (`2–4px`). This is a minerals and processing company, not a fintech app.
- **Elevation**: borders and background steps carry hierarchy. Maximum one soft shadow in the entire system.
- **Data typography**: numeric tables use `font-variant-numeric: tabular-nums` and Latin numerals in both locales (industry convention for specs).

---

## 6. Anti-generic design guardrails

Reject and rewrite any output containing:

- Purple/blue-violet gradient hero, glassmorphism cards, floating 3D blobs.
- Centred hero: headline + subhead + two buttons + centred stat row.
- Three identical feature cards with a lucide icon in a coloured circle.
- Emoji as UI icons. Generic stock-photo "handshake / team meeting" imagery.
- `shadow-2xl`, `rounded-3xl`, `bg-gradient-to-r from-X to-Y` as a default look.
- Vague copy: "innovative solutions", "world-class quality", "your trusted partner", "حلول مبتكرة", "شريكك الموثوق".

Aim instead for: **technical editorial**. Asymmetric grids, a visible baseline grid, dense spec tables as first-class visual elements, generous whitespace between sections, hairline rules, monospaced or tabular figures for data, photography of material and plant used large and duotone-treated toward the brand accent.

---

## 7. Content rules

- Every page begins with an **answer-first paragraph** (40–60 words) that states what the page delivers. This serves both the engineer skimming and the AI answer engines.
- Arabic copy: Modern Standard Arabic, technical register, Gulf-industry terminology. Keep the English technical term in parentheses on first mention: `كربونات الكالسيوم المطحونة (GCC)`.
- English copy: British-neutral technical English, procurement register, no exclamation marks.
- `ar` and `en` content modules are **key-mirrored**. A missing key in either locale must fail the build (zod + a `pnpm check:i18n` script).
- Numbers, units, and grade codes are identical across locales. `GCC-1250` stays `GCC-1250` in Arabic text.
- Never claim a certification, capacity, or client name that is not present in `docs/technical-data.md`.

---

## 8. SEO baseline (enforced on every page)

- Unique `<title>` ≤ 60 chars and `<meta description>` ≤ 155 chars per locale — generated from typed metadata, never duplicated.
- `hreflang`: `ar-SA`, `en`, `x-default` → `ar`. Self-referencing canonical per locale.
- JSON-LD via `src/lib/jsonld.ts`: `Organization` (+ `address`, `sameAs`), `WebSite`, `BreadcrumbList` on every page; `Product` on grade pages; `FAQPage` where FAQs exist; `ItemList` on index pages.
- `sitemap.xml` with locale alternates, `robots.txt`, and `llms.txt`.
- Semantic heading order, one `<h1>` per page. Spec tables use real `<table>` with `<caption>` and `<th scope>` — this is what gets extracted into AI answers and rich results.
- Images: descriptive bilingual `alt`, explicit dimensions, AVIF/WebP, LCP image `priority`.

---

## 9. Quality gates (must pass before any phase is reported complete)

```
npm run lint && npx tsc --noEmit && npm run build
```

Plus:
- Lighthouse (mobile) ≥ 95 Performance / 100 Accessibility / 100 Best Practices / 100 SEO on `/ar` and `/en` home and one product page.
- CLS < 0.05, LCP < 2.0s on simulated 4G.
- Zero physical-direction utility classes: `grep -rEn "\b(ml|mr|pl|pr)-[0-9]|text-(left|right)|\b(left|right)-[0-9]" src/` returns nothing.
- Zero `TODO` left undocumented — every one listed in the phase report.
- Every interactive element reachable and visible via keyboard in both RTL and LTR.

---

## 10. Working protocol

1. **Read before writing.** At the start of each phase, list the relevant skills, read their `SKILL.md`, and state in one line which ones you are applying and why.
2. **Plan, then build.** Emit a short file-by-file plan first. Wait for nothing — proceed — but the plan must appear in the transcript.
3. **Commit per phase** with a conventional message: `feat(design-system): tokens, primitives, styleguide route`.
4. **Report at the end of each phase**: what was built, what quality gates passed with actual numbers, what `TODO(data)` items are blocking, and what the next phase needs from the human.
5. **Never ask permission to continue mid-phase.** Ask only when a decision requires information that genuinely does not exist in the repo.
