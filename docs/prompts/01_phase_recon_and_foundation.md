# PHASE 1 — Asset Recon, Brand Extraction & Bilingual Foundation

You are building the KMIT Industrial B2B portal. Read `CLAUDE.md` in the repository root first — it is binding.

## Step 0 — Skill loading (do this before anything else)

65 skills are installed in this environment. Locate them (`ls ~/.claude/skills`) and **read the `SKILL.md`** of the following before you write a single line of code:

- `product-marketing` — you will produce `.agents/product-marketing.md` in this phase
- `site-architecture` — for the URL and navigation model
- `full-output-enforcement` — applies to every phase; no truncation, no placeholders
- `seo-audit` — read now so foundation decisions do not create SEO debt

State in one line which skills you loaded. Do not summarise them back to me at length.

## Step 1 — Asset inventory

The repository currently contains **only images and a `logo.svg`**. Every image filename indicates the section it belongs to.

1. Recursively list every asset with size, dimensions, format, and aspect ratio.
2. Infer from each filename the **section** it serves (hero, products, applications/plastics, applications/paints, applications/oil-gas, applications/rubber, applications/paper, facility, packaging, logistics, quality-lab, certifications, team, contact, texture/background, logo/brand). Use fuzzy matching; where a filename is ambiguous, open the image and classify it visually.
3. Flag: images below 1600px wide that are earmarked for hero/banner use; images with wrong aspect ratio for their slot; near-duplicates.
4. Write **`docs/asset-map.json`**:

```json
{
  "assets": [
    {
      "source": "assets-source/hero-plant-01.jpg",
      "target": "public/images/hero/plant-overview.avif",
      "section": "home.hero",
      "role": "primary",
      "width": 3200, "height": 1800,
      "alt_ar": "…", "alt_en": "…",
      "notes": "LCP candidate; needs duotone treatment"
    }
  ],
  "gaps": [
    { "section": "applications.oil-gas", "reason": "no matching asset found", "suggested_treatment": "use texture background + data card composition instead of photo" }
  ]
}
```

The `gaps` array is important: **design around missing images, never invent them.** Where a section has no photograph, design a non-photographic treatment (spec table hero, typographic panel, technical diagram built in SVG).

5. Copy and normalize assets into `public/images/<section>/kebab-case-name.<ext>`, generating AVIF + WebP derivatives at responsive widths. **Keep `assets-source/` untouched.**

## Step 2 — Brand extraction from `logo.svg`

1. Parse `logo.svg`. Extract every `fill`, `stroke`, `stop-color`. Rank by covered area.
2. The dominant non-neutral colour is the **accent**. Convert to OKLCH and build:
   - A 9-step accent ramp (50→900) with perceptually even lightness steps.
   - A 10-step neutral ramp tinted 2–4% toward the accent hue.
   - Semantic tokens: success / warning / danger / info, harmonised to the same chroma budget.
3. Verify contrast: every text/background pairing you intend to ship must hit **WCAG AA (4.5:1)**; primary CTA text must hit AAA where achievable. Adjust ramp steps, not the accent hue.
4. Also produce a clean React component `src/components/brand/Logo.tsx` (`currentColor`-driven, with `variant="full" | "mark"` and locale-aware wordmark handling if the SVG contains text).
5. Write **`docs/brand-tokens.md`**: the extracted hexes, the OKLCH values, the reasoning, and the contrast matrix.

## Step 3 — Product context document

Apply the `product-marketing` skill to produce `.agents/product-marketing.md` covering: company, ICP (procurement manager vs. formulation/QC engineer — treat as two distinct personas with different page paths), value proposition, differentiators for an in-Kingdom supplier vs. imported material, objection map, and the vocabulary bank (bilingual glossary of grade codes, test methods, and industry terms).

Source of truth: `docs/technical-data.md` (copy it in from the reference folder if not present). **No invented facts.**

## Step 4 — Information architecture

Apply `site-architecture`. Produce `docs/site-architecture.md` containing:

- Full route table with bilingual URL slugs. Decision to enforce: **keep slugs in English for both locales** (`/ar/products/gcc-1250`) — Arabic-script URLs break in procurement email clients and B2B CRMs. Record this in `docs/decisions.md`.
- Navigation model: primary nav max 5 items; a mega-menu for Products that exposes the grade matrix directly (this is the highest-intent path).
- Internal linking map: which page links to which, and with what anchor text, in both locales.
- Breadcrumb structure.
- The conversion paths: `[grade page] → RFQ prefilled with grade`, `[application page] → RFQ prefilled with sector`, `[resources] → TDS download → email capture`.

## Step 5 — Scaffold

Initialise the Next.js project **in the repository root** (do not create a nested folder):

- Next.js 14+ App Router, TypeScript strict, ESLint + Prettier, Tailwind.
- `next-intl` with `[locale]` segment routing, `ar` default, middleware redirecting `/` → `/ar`, locale detection off (deterministic URLs are better for SEO here).
- `next/font/google` loading **Alexandria** as a variable font with `display: "swap"`, subsets `["arabic","latin"]`, exposed as `--font-alexandria`. Set `html[lang][dir]` correctly per locale in `[locale]/layout.tsx`.
- `src/content/schema.ts` with zod schemas and a `check:i18n` npm script that fails when `ar` and `en` content modules have differing key sets.
- `src/lib/env.ts` validating `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) — no hardcoded domain anywhere.
- `src/lib/rfq-adapter.ts`: a single `submitRfq(payload)` server action behind an interface, with three swappable drivers (`console` for dev, `resend`, `webhook`), selected by `RFQ_DRIVER` env var. Ship `console` active.
- A `/[locale]/styleguide` route stub (built out in Phase 2, `noindex`).
- ESLint rule banning physical-direction Tailwind utilities (custom `no-restricted-syntax` or a `tailwindcss/no-arbitrary-value`-style check plus the grep gate in CLAUDE.md §9).
- GitHub Actions workflow: install → lint → typecheck → build on push to `main`.

## Deliverable / definition of done

Commit `chore(foundation): asset map, brand tokens, IA, bilingual Next.js scaffold`.

Report back, in this order:
1. Skills applied (one line).
2. Asset inventory summary: counts per section, and the **gap list** — sections with no usable imagery.
3. Extracted palette with hexes and the contrast matrix result.
4. The route table.
5. Quality gate output: actual `lint`, `tsc`, `build` results.
6. `TODO(data)` items blocking later phases (expect: real certificate numbers, plant capacity, contact details, client logos).

Do not start Phase 2.
