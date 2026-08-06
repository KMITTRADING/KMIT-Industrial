# KMIT Industrial — bilingual B2B portal

Arabic-first (`/ar`), English-second (`/en`) technical portal for a Saudi
supplier and processor of industrial calcium carbonate.

**Read [`CLAUDE.md`](./CLAUDE.md) before changing anything.** It is the project
constitution: stack, RTL rules, design guardrails, SEO baseline and quality
gates. It is binding, not advisory.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_SITE_URL
npm run dev                    # http://localhost:3000 → /ar
```

Node 20.9+ is required. The build fetches Alexandria from Google Fonts, so the
first build needs network access (see `docs/decisions.md` ADR-015).

---

## Scripts

| Script                            | What it does                                                       |
| --------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                     | Development server                                                 |
| `npm run build`                   | Production build                                                   |
| `npm run lint`                    | ESLint, including the physical-direction ban                       |
| `npm run typecheck`               | `tsc --noEmit`, strict                                             |
| `npm run check:i18n`              | Locale parity: key mirroring, length limits, ICU placeholder drift |
| `npm run check:direction`         | The grep gate from CLAUDE.md §9                                    |
| `npm run check`                   | All four gates in sequence                                         |
| `npm run format` / `format:check` | Prettier                                                           |
| `npm run assets:optimize`         | Re-encode `assets-source/` → `public/images/`                      |

`scripts/build-tokens.mjs` regenerates `src/styles/tokens.css` and
`docs/brand-tokens.md` from the logo. Run it if the brand files change; never
hand-edit `tokens.css`.

---

## Where things live

```
CLAUDE.md                  project constitution
.agents/
  product-marketing.md     positioning, personas, objections, vocabulary
docs/
  technical-data.md        the ONLY source of technical facts
  asset-map.json           every image: section, alt text, defects, gaps
  brand-tokens.md          palette derivation and the contrast matrix
  site-architecture.md     routes, navigation, internal linking, conversion paths
  keyword-clusters.md      bilingual intent clusters
  decisions.md             ADR log — read this before questioning a choice
  skill-map.md             which skill applies in which phase
  prompts/                 the seven build-phase briefs
assets-source/images/      original drop, untouched
public/images/             optimised AVIF + WebP masters
src/
  app/[locale]/            routes
  components/              brand/, layout/
  content/                 ar/, en/, data/, schema.ts — typed content and data
  i18n/                    routing, navigation, request config
  lib/                     env, seo, rfq-adapter, utils
  styles/                  globals.css, tokens.css (generated)
  proxy.ts                 locale routing at the edge
scripts/                   asset pipeline, token generator, CI gates
```

---

## Rules worth stating twice

1. **No number reaches a page except through `src/content/data/grades.ts`.**
   That module reads from `docs/technical-data.md`. If a value is not there,
   write `TODO(data): <field>` — never guess a purity, a capacity, or a
   certificate number.
2. **No physical-direction utilities.** `ms-*`/`me-*`, `ps-*`/`pe-*`,
   `start-*`/`end-*`, `text-start`/`text-end`. Two gates enforce it.
3. **`ar` and `en` are key-mirrored.** A key in one and not the other fails
   `check:i18n`.
4. **Import `Link` from `@/i18n/navigation`**, never from `next/link`.
5. **Tokens or nothing.** No hex value in a component.

---

## Configuration

| Variable                                           | Purpose                                                                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                             | Absolute origin, no trailing slash. Drives canonicals, hreflang, sitemap, OG and JSON-LD. Validated in `src/lib/env.ts` |
| `RFQ_DRIVER`                                       | `console` (default) · `resend` · `webhook`                                                                              |
| `RESEND_API_KEY`, `RFQ_TO_EMAIL`, `RFQ_FROM_EMAIL` | Required when `RFQ_DRIVER=resend`                                                                                       |
| `RFQ_WEBHOOK_URL`, `RFQ_WEBHOOK_SECRET`            | Required when `RFQ_DRIVER=webhook`                                                                                      |

No domain is hardcoded anywhere. Pointing the site at its real domain is an
environment change.

---

## Build status

Phase 1 (foundation) is complete: asset pipeline, brand tokens, IA, and the
bilingual scaffold with a foundation home page rendering the grade matrix and
the property table in both locales. Phases 2–7 are briefed in `docs/prompts/`.
