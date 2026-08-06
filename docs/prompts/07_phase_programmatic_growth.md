# PHASE 7 — Programmatic SEO & Content Engine (post-launch, optional)

Only run this after Phases 1–6 are complete and the core site is indexed. Read `CLAUDE.md` and `docs/keyword-clusters.md`.

## Step 0 — Skill loading

- `programmatic-seo` — template + data architecture, thin-content avoidance
- `content-strategy` — topic clusters and the publishing model
- `competitors` / `competitor-profiling` — comparison and alternative pages
- `schema`, `ai-seo` — structured data and AEO for the new page types
- `lead-magnets` — the gated technical assets
- `copywriting`, `copy-editing`

## The thin-content rule (read this before generating anything)

A programmatic page ships **only if it contains information that exists nowhere else on the site**. Grade × sector pages must carry: the specific loading range for that grade in that process, the specific technical effect, the specific processing caveat, and a genuinely different FAQ set. If you cannot write 250+ words of non-substitutable technical content for a combination, **do not generate that page**. A 25-page matrix where 9 are excellent beats 25 that are templated.

Produce `docs/pseo-inventory.md` listing every candidate combination with a `ship / hold / reject` decision and the reason, **before** generating.

## 1. Grade × Application matrix

`/[locale]/solutions/[grade]-for-[sector]` — e.g. `gcc-1250-for-pvc-pipes`.

Candidate set: 5 grades × 5 sectors = 25, filtered by the rule above. Each shipped page: the formulation problem, why this specific D50 fits, loading guidance, processing notes, the spec extract, a comparison against the adjacent grade, sector-specific FAQ, and an RFQ prefilled with both parameters.

## 2. City / logistics pages

`/[locale]/supply/[city]` for Riyadh, Jeddah, Dammam, Jubail, Yanbu, Khobar — and GCC destinations where KMIT genuinely ships. Each carries **real** differentiating content: industrial cluster served, typical transit time from Jeddah, packaging suited to that route, port/customs notes. If lead-time data does not exist, `TODO(data)` and hold the page. Never ship a city page whose only variable is the city name — that is the classic programmatic penalty case.

## 3. Comparison pages

Apply `competitors` for: local supply vs. imported material (economics, lead time, currency, QC recourse), GCC vs. PCC, coated vs. uncoated, CaCO₃ vs. talc/kaolin/barite as filler. Honest, technically grounded, no competitor disparagement — Saudi and international buyers verify claims.

## 4. Technical knowledge hub

`/[locale]/knowledge` — the editorial layer. First 12 articles should target the informational cluster in `docs/keyword-clusters.md`: dispersion troubleshooting, whiteness measurement and what R457 means, oil absorption and its formulation impact, PSD reading guide, acid solubility in drilling applications, filler loading economics, moisture control in coated grades, SASO/REACH compliance for imported vs. local material.

Each article: answer-first, data tables, internal links to the relevant grade pages, `Article` + `FAQPage` schema, bilingual.

## 5. Gated technical assets (apply `lead-magnets`)

- Grade selection guide (PDF, bilingual)
- Filler loading calculator — an interactive tool: input polymer, target filler load, current cost → output recommended grade and indicative cost delta. Ungated, indexable, and the best link-earning asset available in this niche.
- Sample request flow, separate from RFQ and lower-friction.

## 6. Scale hygiene

- Split sitemaps by section; keep `lastmod` honest.
- Internal linking: every programmatic page must be reachable from a curated hub, not only the sitemap.
- Monitor index coverage; de-index any page that fails to earn impressions after 90 days rather than letting it dilute the site.

## Definition of done

`docs/pseo-inventory.md` with decisions, the shipped pages, updated sitemaps, and a report on how many candidates were rejected and why. A high rejection count is a sign of good judgement here, not failure.
