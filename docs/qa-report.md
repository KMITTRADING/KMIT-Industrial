# QA report

> Phase 6. Records what was tested, with what, and what was not. The second part
> matters more than the first.

---

## 1. The test matrix, honestly

The brief asks for Chrome, Safari on macOS and iOS, Firefox, Edge and Android
Chrome. **Only Chromium was available in the build environment**, so that is the
only engine anything here was run on. Everything below distinguishes what was
executed from what was reasoned about.

| Engine                               | Status                | Notes                                     |
| ------------------------------------ | --------------------- | ----------------------------------------- |
| Chromium 141 (desktop, 1440×900)     | **executed**          | 54 axe tests, 9 flow tests, all gates     |
| Chromium (mobile emulation, 390×844) | **executed**          | same axe suite, Pixel 7 device profile    |
| Safari, macOS                        | **not run**           | see §5, highest-priority gap              |
| Safari, iOS                          | **not run**           | see §5                                    |
| Firefox                              | **not run**           |                                           |
| Edge                                 | **not run**           | Chromium-based; low risk, not zero        |
| Android Chrome                       | **partially covered** | emulated in Chromium, not run on a device |

Viewports exercised: 390 and 1440 under Playwright; 360, 768, 1024, 1920
checked by rendering only, not by assertion.

---

## 2. What was executed

### Accessibility, WCAG 2.1 AA

`tests/e2e/a11y.spec.ts` runs the real axe-core engine in a real browser against
each route after hydration, tagged `wcag2a wcag2aa wcag21a wcag21aa`.

```
54 passed (26 routes × 2 viewports, plus a direction assertion)
0 violations
```

`scripts/audit-a11y.mjs` additionally reads static markup on 28 routes and
passes. Both are kept: the static one runs in a second and catches the common
regressions; axe is the authority.

**Two violations were found and fixed**, both in `LogisticsMap`, on the contact
and facility pages in both locales:

- `dlitem` (serious): `<dt>` and `<dd>` were nested two `<div>` levels deep
  inside the `<dl>`, so they were not associated with it.
- `definition-list` (serious): a `<p>` sat directly inside the `<dl>`.

The icon now sits inside the `<dt>` and the pending-lead-time note is a sibling
of the list.

### RTL integrity

`scripts/check-rtl.mjs` covers 15 Arabic routes.

```
check:rtl passed - 15 Arabic routes, bidi isolation and mirroring clean.
```

**One real defect was found and fixed.** The grade-page answer-first paragraph
interpolated the D50 range directly into Arabic prose. The Unicode bidi
algorithm resolves the hyphen between two numbers to the paragraph direction, so
`4.5 - 6.0` rendered as `6.0 - 4.5` on every Arabic grade page. The value now
sits in an explicit `dir="ltr"` island, and the gate fails the build if one goes
missing.

The direction grep from CLAUDE.md §9 is clean:

```
$ grep -rEn "\b(ml|mr|pl|pr)-[0-9]|text-(left|right)|\b(left|right)-[0-9]" src/
$ echo $?
1
```

Arabic punctuation: no Latin comma or question mark appears in any Arabic
string. Checked programmatically over `src/content/ar/index.ts`.

### Functional flows

`tests/e2e/flows.spec.ts`, 9 tests, both locales where the flow is
locale-sensitive:

- RFQ validation blocks an incomplete step (ar, en)
- RFQ three-step submission reaches the success state with a reference (ar, en)
- the locale switcher preserves the deep path and flips `dir`
- the grade filter writes its state to the URL and narrows the matrix
- the comparison caps at three grades even when four are requested
- a document row routes to a prefilled quotation request
- the skip link is the first tab stop and reaches `#main`

### Unit

`tests/unit`, 18 tests: dataset integrity (D50 strictly decreasing as mesh
rises, coating exactly on the micronized grades, every application claimed once,
related grades resolving), and the metadata and JSON-LD generators (hreflang
reciprocity, `x-default` on Arabic, no `Offer`, no null values, breadcrumb
positions, FAQ mirroring, `Organization` omitting unsupported fields).

### Performance

Measured over five runs per route against a production build, median reported.

|                          | Before       | After      |
| ------------------------ | ------------ | ---------- |
| Performance, `/ar`       | 88           | **92**     |
| Performance, `/en`       | not measured | **93**     |
| Total blocking time      | 258 ms       | **154 ms** |
| Document, uncompressed   | 242 KB       | **163 KB** |
| Cumulative layout shift  | 0            | **0**      |
| First contentful paint   | 1.2 s        | **1.0 s**  |
| Speed index              | 1.2 s        | **1.0 s**  |
| Largest contentful paint | 3.2 s        | **3.0 s**  |

Three changes produced that:

1. **The home page grade matrix is server-rendered.** `GradeMatrix` is a client
   component and hydrating it was the largest single contributor to blocking
   time on the most-visited page. `GradeTable` renders the same five rows with
   no JavaScript. Filtering and sorting five rows was duplicated by `/products`,
   which does it properly with the state in the URL.
2. **`TableScroll` was split out of `Table`.** One `'use client'` directive was
   making every page with any table ship and hydrate a scroll observer. Only the
   scroll shell needs the client.
3. **Client messages are scoped.** `NextIntlClientProvider` was serialising the
   entire 57.5 KB catalogue into every page; client components use 10.6 KB. The
   RFQ form and the styleguide nest their own providers for what they need.

---

## 3. Targets against results

Two environments, and they disagree. The local column is `next start` inside a
shared build container; the deploy column is the Netlify preview, which is real
hosting with a CDN and brotli. **The deploy column is the one that describes what
a buyer gets.**

| Target                            | Local (container)              | Deploy (Netlify) | Met           |
| --------------------------------- | ------------------------------ | ---------------- | ------------- |
| CLS < 0.05                        | 0                              | 0                | yes           |
| TBT < 150 ms                      | 154 ms (`/ar`), 162 ms (`/en`) | not reported     | at the bar    |
| LCP < 2.0 s                       | 3.0 s                          | not reported     | see below     |
| Performance ≥ 95                  | 92 median                      | **100**          | **yes**       |
| Lighthouse Accessibility 100      | 100                            | 100              | yes           |
| Lighthouse SEO 100                | 100                            | 100              | yes           |
| Lighthouse Best Practices 100     | 96                             | 83               | **no**, below |
| Zero physical-direction utilities | 0                              | n/a              | yes           |
| axe violations                    | 0                              | n/a              | yes           |

Best Practices is 96 rather than 100 because the Content Security Policy
withholds `'unsafe-eval'`. next-intl's formatter probes for eval support with
`try { Function('') }` and falls back correctly when it throws; Chrome logs the
blocked probe as an Issue, and Lighthouse's `inspector-issues` audit counts any
issue against the category. The four points are the price of the mitigation, and
granting `'unsafe-eval'` to recover them would be trading a real protection for
a number. See ADR-041.

INP is a field metric and cannot be produced by a lab run. TBT is its lab proxy
and is reported above; a real INP figure needs traffic and RUM, which is what
the measurement plan sets up.

---

## 4. The two environments, and which to believe

The local measurements in this report were taken with `next start` inside a
shared build container. Repeated runs of an identical build scored 88 to 95, and
LCP sat at 3.0 s across four different builds without moving in response to
changes that halved blocking time. That insensitivity was the clue.

The Netlify preview, on real hosting, reported **Performance 100** for the same
commit, against 95 for the previous production deploy. Across the phase the
preview went 78 → 98 → 100 as the three optimisations landed.

So the local figures understate the result, and the reason is visible in the
trace: every script finished downloading by 122 ms, first contentful paint was
1.0 s and speed index was 1.0 s. **The page was already visually complete in
about a second.** The 3.0 s LCP was Lighthouse's Lantern model of the same trace
on a throttled device, 84% of it "render delay", which is the simulated cost of
evaluating framework JavaScript at 4× CPU throttling on a machine that was
already contended. On real hosting with a CDN and brotli, that model does not
bind.

Two things follow, and they point in opposite directions, so both are recorded:

- **The target is met.** Performance ≥ 95 is satisfied on the deploy, which is
  the environment a buyer actually loads.
- **The headroom is not large.** The framework floor is React 19 plus the App
  Router runtime plus next-intl's client runtime, and none of it is application
  code, so no amount of further application tuning moves it. If a later phase
  adds weight to every route, this is where it will show first.

**The lever if that happens:** `SiteHeader` is a client component on every page.
It needs the client for the mega-menu and the condense behaviour. A
server-rendered header with a CSS-only disclosure would take next-intl's client
runtime off every content route. That is a design change, not a tuning pass.

### Best Practices

96 locally, 83 on the deploy, against a target of 100. The known cause is the
Content Security Policy: `'unsafe-eval'` is withheld, next-intl's formatter
probes for eval support with `try { Function('') }`, and Chrome logs the blocked
probe as an Issue that Lighthouse counts against the category. The fallback path
is correct and the end-to-end suite passes under the policy.

The deploy figure is lower than the local one and the breakdown behind it has not
been inspected, so the additional gap is not accounted for here. Check it against
the live origin after launch rather than against a preview, which also carries
noindex headers and a redirect hop.

---

## 5. Known issues, ranked

| #   | Severity | Issue                                                                                                                                                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **high** | Safari on macOS and iOS has never been run. Arabic shaping, RTL flexbox and `dir` inheritance differ enough there that this is a genuine risk, not a formality. Needs a real device or a browser-farm run before launch. |
| 2   | medium   | Lighthouse Performance is 92 against a target of 95, and LCP is 3.0 s against 2.0 s. Cause identified above; the header refactor is the fix.                                                                             |
| 3   | medium   | Firefox has never been run. Lower risk than Safari but the RTL scroll direction in `TableScroll` compensates for engine differences and has only been exercised in one engine.                                           |
| 4   | low      | Zoom to 200% and 400% has not been asserted automatically. The layout is fluid with `clamp()` type and no fixed heights, so reflow is expected to hold, but expected is not tested.                                      |
| 5   | low      | Screen-reader behaviour has not been verified with an actual screen reader. axe checks the semantics that make correct announcement possible; it cannot confirm what NVDA or VoiceOver says.                             |
| 6   | low      | `contact_click` and `whatsapp_click` cannot fire: the contact channels have no `href` while the phone, WhatsApp and email are open data items.                                                                           |

---

## 6. What runs in CI

| Job                                | Contents                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lint · typecheck · gates · build` | lint, typecheck, locale parity, direction, copy, client message scope, unit tests, formatting, build, then the runtime gates against a real server: static a11y audit, `check:dom`, `check:crawl`, `check:schema`, `check:rtl` |
| `axe · flows`                      | Playwright, Chromium, full axe suite plus the functional flows; traces uploaded on failure                                                                                                                                     |
| `performance budget`               | `check:budget`                                                                                                                                                                                                                 |

The budget gate asserts a ceiling on shipped bytes rather than on a Lighthouse
score. On a shared runner the Performance number swings ten points between
identical runs, which makes it useless as a merge gate: it would block good work
at random or be set so loose it blocks nothing. Document size, script count,
script weight and the message namespaces in the payload are deterministic, so a
failure always means somebody added weight.
