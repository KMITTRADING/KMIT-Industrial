# PHASE 4 — Bilingual Content Production

Read `CLAUDE.md`, `.agents/product-marketing.md`, `docs/technical-data.md`, `docs/keyword-clusters.md`.

## Step 0 — Skill loading

- `copywriting` — page copy, headlines, value propositions, CTAs
- `copy-editing` — the second pass over everything produced
- `content-strategy` — topic model and the internal linking narrative
- `design:ux-copy` — microcopy, errors, empty states, form labels
- `marketing:brand-review` — final consistency and unsubstantiated-claim screen
- `ai-seo` — answer-first structuring while writing, not bolted on after
- `full-output-enforcement`

## Inputs

1. `docs/technical-data.md` — the authoritative technical source. **Every number comes from here.**
2. `docs/research-input.md` — the human's market research (paste it in; if the file is absent, stop and ask for it).
3. `docs/keyword-clusters.md` — target terms per page, per locale.

## The writing standard

You are writing for two readers who visit the same page:

- **The procurement manager** wants: can you supply, at what consistency, in what packaging, how fast to my plant, and with what documentation? Answer in the first 60 words.
- **The formulation / QC engineer** wants: D50, purity, whiteness, oil absorption, coating level, test method, and behaviour in their specific process. Answer in the tables and the sector pages.

Rules:
- **Specificity replaces adjectives.** Not "high purity" but "≥ 98.5% CaCO₃ (ISO 3262-1)". Not "fast delivery" but the actual stated lead time — and if that number is not in the source, write `TODO(data)` rather than inventing one.
- **Answer-first blocks.** Every page and every major section opens with a self-contained 40–60 word answer. These are the passages AI answer engines extract; they must make sense with zero surrounding context.
- **No claim without a source.** Certifications, capacities, client names, years in business — source file or `TODO(data)`.
- **Bilingual parity, not translation.** Write Arabic natively for the Arabic reader (Gulf industrial register, MSA, technical terms with the English in parentheses on first mention), then write English natively. Do not translate word-for-word — the two versions carry identical facts and identical structure, but idiomatic in each language.
- **Grade codes, units, and numerals stay Latin in both locales.**

## Deliverables

### 1. Complete content modules
Fill `src/content/ar/` and `src/content/en/` for every page from Phase 3. All keys mirrored — `npm run check:i18n` must pass.

Per page, produce: `title`, `metaDescription`, `h1`, `answerFirst`, all section headings and body copy, table captions, CTA labels, image alt text, and FAQ pairs.

### 2. FAQ sets (high value — do this properly)
Write **6–10 real questions per grade page and per sector page**, in both locales. Source them from what an engineer would actually ask: substitution ratios, dispersion behaviour, effect on impact strength, acid solubility in drilling fluids, moisture sensitivity of coated grades, shelf-life handling, minimum order quantity, sampling procedure. These feed `FAQPage` schema in Phase 5 and are the single strongest AI-citation asset on the site.

### 3. Comparison and decision content
- "Which grade do I need?" — a decision path from application → required D50 → recommended grade, rendered as an interactive selector plus a static table fallback (crawlable).
- "Coated vs. uncoated" — an honest technical comparison, including when coating is *not* worth the premium.
- "GCC vs. PCC" — process, morphology, cost, and application fit.

These pages win informational search and get quoted by AI assistants; they also do real sales work.

### 4. Microcopy pass
Every button, form label, validation message, empty state, loading state, success state, and 404 — in both locales, applying `design:ux-copy`.

### 5. Editorial pass
Run `copy-editing` over everything: tighten, remove hedging, kill every phrase on the `CLAUDE.md` §6 banned list. Then run `marketing:brand-review` and fix each flagged item.

## Definition of done

- `npm run check:i18n` passes; zero key drift.
- No banned filler phrases remain (paste your grep results for: "innovative", "world-class", "trusted partner", "cutting-edge", "حلول مبتكرة", "شريكك الموثوق", "الأفضل في المجال").
- Every `TODO(data)` listed explicitly in the report with the exact field needed.
- Reading-level and register spot-check: paste one Arabic and one English answer-first block in your report.

Commit `feat(content): complete bilingual copy, FAQs, and decision content`.
