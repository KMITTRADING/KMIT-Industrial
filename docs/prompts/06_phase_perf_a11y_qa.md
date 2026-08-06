# PHASE 6 — Performance, Accessibility, RTL Integrity & QA

Read `CLAUDE.md` §9.

## Step 0 — Skill loading

- `design:accessibility-review` — WCAG 2.1 AA audit
- `impeccable` — edge cases, error states, responsive behaviour
- `emil-design-eng` — motion and interaction polish
- `cro` — final friction pass on the RFQ and download flows
- `full-output-enforcement`

## 1. Performance

Targets (mobile, simulated 4G, throttled CPU): **LCP < 2.0s, CLS < 0.05, INP < 200ms, TBT < 150ms, Lighthouse Performance ≥ 95.**

Work through:
- Font: Alexandria subset to the used ranges, `preload` the primary weight, `size-adjust` fallback metrics to eliminate layout shift on swap. Verify Arabic glyph coverage after subsetting — **check that no Arabic character renders as tofu**.
- Images: correct `sizes` on every responsive image, AVIF first, `priority` only on the LCP image per route, explicit dimensions everywhere, lazy below the fold.
- JS: audit the client bundle per route. Any route shipping >120KB gzipped of first-party JS needs justification. Move filters to URL state + server rendering where possible. Dynamic-import the RFQ form, the comparison mode, and the map.
- Third parties: none loaded before interaction except consent-gated analytics.
- Caching: correct `revalidate` per route; static where possible; `Cache-Control` on assets.

Paste before/after numbers.

## 2. Accessibility (WCAG 2.1 AA)

Run `design:accessibility-review` plus automated axe checks on every route in **both locales and both directions**. Verify manually:
- Full keyboard traversal, logical focus order in RTL (this is where most bilingual sites fail), visible focus indicators.
- Screen reader pass on the RFQ form, the GradeMatrix filters, and the mega-menu — announce state changes (filter results count, form errors) via live regions.
- Colour contrast across every state, including hover and disabled.
- Table semantics: `<caption>`, `<th scope>`, and a described scroll region on mobile.
- `prefers-reduced-motion` disables all non-essential motion.
- Zoom to 200% and 400% without content loss.

## 3. RTL integrity audit

This deserves its own pass. Check every route in Arabic for:
- Mirrored icons that should mirror (arrows, chevrons, progress) and icons that should **not** (logos, clock, media controls, chemical structures).
- Numbers, grade codes, units, and email addresses rendering LTR inside RTL paragraphs — use `dir="ltr"` spans or `unicode-bidi: isolate`. Check specifically: `≥ 98.5%`, `4.5 - 6.0 µm`, `GCC-1250`, phone numbers.
- Table column order, sort indicators, and horizontal scroll direction.
- Form field alignment, placeholder alignment, error icon placement.
- Padding/margin symmetry — run the grep gate from `CLAUDE.md` §9 and paste the output.
- Shadow and gradient direction, if any survive.
- Punctuation: Arabic comma `،` and question mark `؟` used correctly in Arabic content.

## 4. Cross-environment QA

Test matrix: Chrome, Safari (macOS + iOS — Safari RTL and font rendering differ), Firefox, Edge, Android Chrome. Viewports: 360, 390, 768, 1024, 1440, 1920. Document findings in `docs/qa-report.md` with screenshots where a defect exists.

## 5. Automated tests

- Playwright: RFQ submission happy path + validation errors, in both locales; locale switch preserves path; grade filter updates URL and results; document download flow.
- Vitest: content schema validation, `hreflang`/metadata generators, JSON-LD builders (snapshot), the grade dataset integrity (every grade has every required TDS field).
- CI: run lint, typecheck, unit, build, and Playwright on push. Add a Lighthouse CI budget check that fails the build on regression.

## 6. Pre-launch checklist (`docs/launch-checklist.md`)

Environment variables documented; `NEXT_PUBLIC_SITE_URL` set; RFQ driver switched from `console` to the real one and tested end-to-end; email deliverability (SPF/DKIM) noted for the human; consent banner behaviour; Search Console + Bing verification steps for both locales; sitemap submitted; 301 map if an old site exists; security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) via `next.config` headers; error monitoring hook.

## Definition of done

Report with actual measured numbers for every target above, the RTL audit findings and fixes, the QA matrix result, and the remaining known issues ranked by severity.

Commit `fix(quality): performance budget, WCAG AA, RTL integrity, test suite`.
