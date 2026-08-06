# Skill Map — which of the 65 skills to use, and when

All 65 are installed. Most are irrelevant to this project. Using the wrong ones is worse than using none: competing aesthetic skills produce incoherent design, and B2C growth skills produce copy that damages credibility with industrial buyers.

## Core stack (use in every relevant phase)

| Skill | Phase | Purpose |
|---|---|---|
| `full-output-enforcement` | 1–7 | Prevents truncated files and placeholder code |
| `product-marketing` | 1 | Creates `.agents/product-marketing.md`, the shared context all other skills read |
| `site-architecture` | 1, 5 | URL model, navigation, internal linking |
| `high-end-visual-design` | 2, 3 | Primary aesthetic authority |
| `design-taste-frontend` | 2 | Direction inference + anti-slop pre-flight |
| `ui-ux-pro-max` | 2 | Colour, type pairing, states, spacing, a11y |
| `ckmui-styling` | 2 | shadcn + Tailwind implementation patterns |
| `impeccable` | 2, 3, 6 | Hierarchy, cognitive load, edge and error states |
| `emil-design-eng` | 2, 6 | Motion decisions and micro-polish |
| `frontend-design` (public) | 2 | Environment styling constraints |
| `copywriting` | 4 | Page copy |
| `copy-editing` | 4 | Second-pass tightening |
| `content-strategy` | 4, 7 | Topic model |
| `seo-audit` | 1, 5 | Technical + on-page audit |
| `schema` | 5 | JSON-LD |
| `ai-seo` | 4, 5, 7 | AEO/GEO — AI citation |
| `analytics` | 5 | Measurement plan and events |
| `cro` | 3, 6 | Conversion structure, form friction |
| `programmatic-seo` | 7 | Scaled pages, thin-content discipline |
| `competitors` / `competitor-profiling` | 7 | Comparison pages |
| `lead-magnets` / `free-tools` | 7 | Gated assets and the loading calculator |
| `marketing-psychology` | 3 | **Selective use only** — trust cues for technical buyers |

## Plugin skills

| Skill | Phase | Purpose |
|---|---|---|
| `design:design-system` | 2 | Component documentation format |
| `design:accessibility-review` | 2, 6 | WCAG 2.1 AA audit |
| `design:ux-copy` | 3, 4 | Microcopy, errors, empty states |
| `design:design-critique` | 2, 3 | Optional self-review before reporting done |
| `marketing:seo-audit` | 5 | Second-opinion audit; reconcile with `seo-audit` |
| `marketing:brand-review` | 4 | Voice consistency + unsubstantiated-claim screen |

## Use with caution — one aesthetic authority only

`minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `design-taste-frontend-v1`, `ckmdesign`, `ckmdesign-system`, `ckmbrand`, `brandkit`.

These each carry a **complete and competing** design philosophy. Applying more than one produces a site that looks assembled from three different agencies. `high-end-visual-design` + `design-taste-frontend` is the chosen authority for this project. You may borrow at most **one** named structural idea from `industrial-brutalist-ui` (dense technical table treatment and label typography) — record it in `docs/decisions.md`.

## Do not use on this project

`image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image`, `video`, `ckmbanner-design`, `ckmslides` — imagery already exists in the repository; generating design references or new visuals wastes cycles and introduces assets that do not exist.

`redesign-existing-projects` — there is no existing site.

`ads`, `ad-creative`, `social`, `sms`, `emails`, `cold-email`, `popups`, `paywalls`, `pricing`, `signup`, `onboarding`, `churn-prevention`, `referrals`, `aso`, `launch`, `directory-submissions`, `community-marketing`, `co-marketing`, `revops`, `prospecting`, `sales-enablement`, `ab-testing`, `marketing-plan`, `marketing-ideas`, `customer-research` — these are demand-generation and product-growth skills for a later commercial phase, not for building the site. Two exceptions worth revisiting after launch: `sales-enablement` (a downloadable capability statement) and `directory-submissions` (industrial B2B directories and marketplaces relevant in KSA/GCC).

`design:user-research`, `design:research-synthesis`, `product-management:*` — no research corpus and no product backlog in scope.

## The rule

Before each phase, Claude Code states which skills it loaded and why. If a skill is not in the phase's list, it needs a one-line justification in `docs/decisions.md`. Skill sprawl is the main failure mode when 65 are available.
