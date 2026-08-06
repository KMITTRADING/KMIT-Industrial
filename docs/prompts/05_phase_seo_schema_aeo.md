# PHASE 5 — SEO, Structured Data & Answer-Engine Optimisation

Read `CLAUDE.md`, `docs/site-architecture.md`, `docs/keyword-clusters.md`.

## Step 0 — Skill loading

- `seo-audit` — technical + on-page audit framework; run it as an audit at the end, not just as guidance
- `schema` — JSON-LD implementation
- `ai-seo` — AEO/GEO: getting cited by ChatGPT, Perplexity, Google AI Overviews, Claude
- `site-architecture` — internal linking and crawl-path verification
- `analytics` — measurement plan and event tracking
- `marketing:seo-audit` (plugin) — second-opinion audit pass; reconcile the two audits and fix the union of findings

## 1. Internationalisation SEO (highest risk area — get this exactly right)

- `hreflang` on every page: `ar-SA`, `en`, `x-default` → the Arabic URL. Reciprocal and absolute URLs. Implement centrally in `src/lib/seo.ts` so no page can omit it.
- Self-referencing `canonical` per locale, absolute, built from `NEXT_PUBLIC_SITE_URL`.
- `<html lang dir>` correct per locale; `og:locale` and `og:locale:alternate` set.
- Locale switcher preserves the deep path and passes link equity (real `<a href>`, not JS navigation).
- No duplicate content between `/` and `/ar` — a single permanent redirect, not a rendered duplicate.
- Verify: a crawl from the root reaches every page in both locales within 3 clicks.

## 2. Metadata system

Typed metadata per route, generated centrally: unique title (≤60) and description (≤155) per locale, OG + Twitter cards with **generated OG images** (`opengraph-image.tsx` per route group, rendering grade code + key spec on the brand background — do not ship one static OG image for the whole site).

## 3. Structured data (`src/lib/jsonld.ts`)

Emit as `<script type="application/ld+json">`, validated against schema.org and Google's Rich Results requirements:

- `Organization` — name, legal name, logo, address (Jeddah), contactPoint (sales + technical, with `availableLanguage: ["ar","en"]`), `sameAs`, `foundingDate`, `industry`. Only fields the source data supports.
- `WebSite` + `SearchAction` if site search exists.
- `BreadcrumbList` — every page.
- `Product` on each grade page: `name`, `sku` (grade code), `description`, `brand`, `material`, `additionalProperty` array carrying **every TDS parameter as a `PropertyValue`** (purity, whiteness, D50, oil absorption, pH, bulk density, Mohs) with `unitText`. This is the highest-leverage schema on the site — it is what machine readers consume.
- `ItemList` on `/products` and `/applications`.
- `FAQPage` on grade and sector pages, mirroring the visible FAQ exactly.
- `HowTo` where genuinely applicable (e.g. storage and handling procedure) — do not force it.
- `Offer` only if commercial terms exist; otherwise omit rather than fake `price`.

Validate every page type and paste the validator output in your report.

## 4. Crawl infrastructure

- `sitemap.xml` — generated, with `<xhtml:link rel="alternate" hreflang>` entries per URL, accurate `lastmod`, split index if it exceeds 5k URLs (it will after Phase 7).
- `robots.txt` — allow all, point to sitemap, disallow `/styleguide` and any internal routes.
- `llms.txt` at the root: a structured plain-text summary of the company, grade catalogue with key specs, applications, certifications, and contact — written for machine consumption. Keep it factually identical to the site.
- 404 and 500 return correct status codes (Next.js can silently return 200 — verify with `curl -I`).

## 5. Answer-engine optimisation (apply `ai-seo`)

- **Extractable structure**: every answer-first block is a standalone paragraph; every spec set is a real `<table>` with `<caption>` and `<th scope>`; every list of grades is a semantic list. AI extractors reward this and ignore div-soup.
- **Entity clarity**: consistently name the entity ("KMIT") near the facts about it; keep NAP (name/address/phone) byte-identical across footer, contact page, JSON-LD, and `llms.txt`.
- **Comparison and definition coverage**: the "GCC vs PCC", "coated vs uncoated", and "which grade do I need" pages from Phase 4 are the AEO backbone. Each should answer its title question in the first 50 words.
- **Bilingual entity linking**: Arabic and English pages should each state the entity and the grade codes explicitly — do not rely on the alternate locale carrying the meaning.
- **No content behind interaction**: anything only visible after a click (tab panels, accordions) must still be in the initial HTML.

## 6. Measurement (apply `analytics`)

Produce `docs/measurement-plan.md` and implement:
- GA4 or a privacy-friendly alternative behind a consent-aware loader; no analytics before consent where PDPL/GDPR applies.
- Events: `rfq_started`, `rfq_field_completed`, `rfq_submitted`, `tds_download`, `grade_compared`, `locale_switched`, `contact_click`, `whatsapp_click` — each with grade/sector parameters.
- Search Console verification file placeholder + instructions for both locales.
- UTM convention documented for future campaigns.

## 7. Audit

Run `seo-audit` and `marketing:seo-audit` against the built site. Fix the union of findings. Then re-run and paste the clean result.

## Definition of done

Report must contain: hreflang matrix (actual rendered output for one page), Rich Results validation output per schema type, sitemap URL count per locale, `curl -I` status codes for a 404 and a redirect, Lighthouse SEO 100 on four representative pages, and the measurement plan summary.

Commit `feat(seo): i18n metadata, JSON-LD, crawl infrastructure, AEO structure, analytics`.
