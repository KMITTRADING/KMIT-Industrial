# Decisions

An ADR log. One entry per non-obvious choice: what was decided, why, and what it
costs. Append; do not rewrite history. If a decision is reversed, add a new
entry that supersedes the old one rather than editing it.

---

## ADR-001 — Arabic is the default locale, and every locale is prefixed

**Phase 1.** `/` issues a 307 to `/ar`. Both locales carry a prefix; neither is
served from the bare root.

An unprefixed default locale produces two URLs for the same document
(`/products` and `/ar/products`), which is the most common duplicate-content
failure on bilingual sites. Prefixing both keeps one URL per document per
language and makes the hreflang cluster trivially correct.

**Cost:** one extra redirect on the first request to the origin.

---

## ADR-002 — URL slugs stay English in both locales

**Phase 1.** `/ar/products/gcc-1250`, not `/ar/المنتجات/جي-سي-سي-1250`.

Percent-encoded Arabic URLs break in procurement email clients, in B2B CRMs, and
in the ERP systems that end up storing a supplier link. They are also unreadable
when pasted into a purchase order. The audience reads Latin grade codes daily;
`gcc-1250` is not a translation barrier for them.

**Cost:** a marginal loss of Arabic keyword presence in the URL string. Slug
keywords are a weak ranking signal, and the page title, H1 and body carry the
Arabic terms.

---

## ADR-003 — Locale detection is off

**Phase 1.** `localeDetection: false`. `Accept-Language` never changes which
document a URL returns.

A shared link must resolve to the same page for the sender and the recipient. A
crawler must see one stable document per URL. Both fail under content
negotiation.

**Cost:** a first-time Arabic-preferring visitor arriving at an `/en` link stays
in English until they use the switcher. Acceptable: the switcher is in the
header on every page and keeps them on the same document.

---

## ADR-004 — One typeface, Alexandria, for both scripts

**Phase 1.** Loaded as a variable font via `next/font/google`, subsets `arabic`
and `latin`, exposed as `--font-alexandria`.

Pairing a separate Arabic and Latin family means matching two skeletons, two
optical weights and two vertical rhythms across every component, in both
directions. Alexandria carries both scripts with one skeleton, so the two
locales look like one product rather than two sites.

**Cost:** less typographic range than a bespoke pairing. Compensated by using
weight and scale contrast rather than family contrast.

---

## ADR-005 — Original image drop preserved in `assets-source/`

**Phase 1.** The 13 original PNGs moved from `public/Images/` to
`assets-source/images/`, unmodified, with their original names.

The original filenames encode the section each image belongs to, and the
originals are the only re-encode source if the treatment changes. They are out
of `public/` so they are never served: at ~7.7 MB each they would be a
catastrophic LCP if a path leaked into markup.

**Cost:** ~100 MB in the repository. Deleting them after the client approves
the derivatives would recover all of it — flagged for that decision, not taken
unilaterally.

---

## ADR-006 — One optimised master per image; responsive widths generated at request time

**Phase 1.** `scripts/optimize-assets.mjs` writes exactly one AVIF and one WebP
master per original, at native resolution, into
`public/images/<section>/<name>.{avif,webp}`.

Phase 1's brief asked for AVIF and WebP derivatives at responsive widths. The
Next.js image optimiser already generates those widths from a single source at
build/request time, and `next/image` cannot select among hand-generated files
anyway. Pre-generating four widths × two formats × 13 images would add ~100
files and ~10 MB to the repository to duplicate work the framework performs.

The measurable part is unaffected: 100.0 MB of PNG became 2.7 MB of AVIF
masters, and the optimiser serves narrower renditions from those.

**Cost:** a runtime image optimiser must be available in the deployment target.
If the site is ever exported statically, this decision must be revisited.

---

## ADR-007 — Ten-stop accent ramp, twelve-stop neutral ramp

**Phase 1.** The brief specified a 9-step accent ramp (50→900) and a 10-step
neutral ramp. Shipped: accent `50–900` as the conventional ten stops, neutral
`0–950` as twelve.

A nine-stop ramp spanning 50→900 leaves an off-by-one gap that every consumer of
the tokens has to work around. The conventional Tailwind stop set is what every
component author already expects. The neutral ramp additionally needs a true
`0` (page background) and a `950` (inverse panel), neither of which is
expressible in ten stops without losing a mid-tone.

**Cost:** three more custom properties than specified. No practical downside.

---

## ADR-008 — Contrast matrix covers intended pairings, not the full cross product

**Phase 1.** `scripts/build-tokens.mjs` measures each surface against only the
ink tokens permitted on it — light surfaces against the standard inks, dark
surfaces against the inverse inks.

A full cross product reports body ink on a dark accent panel as a WCAG failure.
That pairing is not a defect; it is a combination the token system does not
allow. Reporting it as a failure trains everyone to ignore the report.

Result: 25 shipping pairings, all passing AA for normal text, with the primary
CTA at 8.55:1 (AAA).

**Cost:** a new surface/ink combination must be added to the matrix definition
before it can be used. That is the intent.

---

## ADR-009 — Per-grade packaging is null, not assumed

**Phase 1.** Every grade in `src/content/data/grades.ts` carries
`packaging: null`.

`docs/technical-data.md` §5 documents three packaging formats at product-family
level and does not say which formats are offered for which grade. Assigning all
three to every grade would look like data and be a guess. Null is honest, it is
typed, and pages render the family-level list until the client supplies the
real mapping.

**Cost:** grade pages cannot answer "can I get GCC-2500 in bulk tanker?" yet.
Tracked in `docs/technical-data.md` §8.

---

## ADR-010 — Shelf life is derived from coating status, not stated per grade

**Phase 1.** A zod refinement fails the build if `shelfLifeMonths` is anything
other than 24 for an uncoated grade or 12 for a coated one, per
`docs/technical-data.md` §5.

Restating a derivable number per row is how two parts of a site end up
disagreeing. Here the rule is the source and the schema enforces it.

**Cost:** if the client later gives grade-specific shelf lives, the refinement
must be relaxed deliberately — which is the right place for that conversation.

---

## ADR-011 — String content lives in typed TS modules, not JSON catalogues

**Phase 1.** `src/content/{ar,en}/index.ts` export objects typed with
`satisfies Content`; `src/i18n/request.ts` feeds them to next-intl as messages.
There is no `messages/*.json`.

CLAUDE.md §4 sketched both `src/content/{ar,en}/` and `messages/{ar,en}.json`.
Running both means two places to add a string and two ways to forget one. TS
modules give compile-time key checking that JSON cannot, and `check:i18n` adds
the runtime checks the type system cannot express — empty strings, over-length
titles, ICU placeholder drift.

**Cost:** content editors need a code editor rather than a JSON file. Acceptable
with no CMS in v1; revisit if a CMS is introduced.

---

## ADR-012 — The physical-direction ban is enforced twice

**Phase 1.** An ESLint `no-restricted-syntax` rule catches `ml-*`, `mr-*`,
`pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `border-l/r-*`
and `rounded-l/r-*` in `className`, in template literals, and inside
`cn`/`clsx`/`cva` calls. `scripts/check-direction.mjs` runs the grep from
CLAUDE.md §9 across `src/` in CI.

ESLint gives the feedback at the moment of writing; the grep covers CSS and any
file ESLint does not lint, and it is the check the constitution actually names.
An RTL layout bug is invisible to anyone reading only the English page, so one
gate is not enough.

**Cost:** a genuinely physical direction needs an inline style with a comment.
That friction is deliberate.

---

## ADR-013 — Structural idea borrowed from `industrial-brutalist-ui`

**Phase 1.** Per `docs/skill-map.md`, at most one named structural idea may be
taken from a competing aesthetic skill. Taken: **the dense technical table as a
first-class visual element** — full-width specification tables with hairline
rules, tabular figures, and label typography carrying hierarchy instead of
cards.

It suits the audience: an engineer reads a specification table faster than any
card layout, and it is the markup that gets extracted into rich results and AI
answers. Nothing else is borrowed — no monospace-everything, no deliberate
degradation, no all-caps body text.

**Aesthetic authority remains `high-end-visual-design` + `design-taste-frontend`.**

---

## ADR-014 — No primary navigation until the routes exist

**Phase 1.** `SiteHeader` renders the brand lockup and the locale switcher only.
The nav labels are written and validated in the content tree, waiting for
Phase 3.

Shipping a nav bar of links that 404 is worse than shipping no nav bar: it
breaks the crawl on the first pass and it wastes a reviewer's time reporting
known-missing pages.

**Cost:** the foundation home page has no navigation. It is a foundation, not a
release.

---

## ADR-015 — `next/font/google` at build time rather than self-hosted files

**Phase 1.** Alexandria is fetched by `next/font/google` during the build and
self-hosted from that point on; no font files are committed.

This is the supported path, it produces correctly subset `woff2` files for both
scripts (four files at present), and it avoids committing binaries that drift
from the upstream family.

**Cost:** the build requires network access to Google Fonts. If a future build
environment is fully offline, switch to `next/font/local` with the woff2 files
committed under `src/styles/fonts/` — a contained change to one import.

---

## ADR-016 — The process diagram describes the material, not the operator

**Phase 2.** `ProcessDiagram` labels six stages the product passes through: feed,
milling, classification, surface treatment, quality control, packaging. The copy
never says who performs them.

Whether KMIT mills its own material or processes and trades sourced material is
the first open question in `.agents/product-marketing.md` §12, and it is
positioning-blocking. A diagram captioned "our process" would settle that
question by implication, which is exactly the kind of claim the constitution
forbids.

**Cost:** the section is less persuasive than an owned-plant story would be.
That story can be written the day the answer arrives, and the component does not
need to change to carry it.

---

## ADR-017 — The icon set is drawn, against the skill guidance

**Phase 2.** `design-taste-frontend` §9.E says "NO hand-rolled SVG icons. Use
Phosphor / HugeIcons / Radix / Tabler." The Phase 2 brief says the opposite:
"custom SVG icon set, do not ship a generic icon library look, draw the domain
icons: mesh screen, silo, jumbo bag, tanker, lab flask, extruder."

The brief wins, on the precedence established in
`docs/phase-zero-skill-gate.md` (explicit prompt requirements outrank the design
skills), and on the merits: no general-purpose set ships a mesh screen, an air
classifier, or a jumbo bag. Substituting a generic box for a jumbo bag on a
packaging page is worse than drawing one.

The intent behind the skill's rule is honoured. The set is internally
consistent, drawn on one grid at one stroke weight, and the utility glyphs are
restrained rather than decorative.

**Cost:** twenty-three glyphs to maintain by hand. Contained: they are one file,
built from one `Icon` wrapper.

---

## ADR-018 — Specification tables keep their hairlines

**Phase 2.** `design-taste-frontend` §9.F bans `border-t` plus `border-b` on
every row of a long list or spec table and calls a ten-row hairlined table "the
laziest layout".

CLAUDE.md §6 asks for the opposite: "dense spec tables as first-class visual
elements" with "hairline rules". The constitution outranks the skill, and the
audience settles it: a formulation engineer reads a specification table faster
than any card layout, and the table markup is what gets extracted into rich
results and AI answers.

What was taken from the skill: the tables use **one** hairline between rows and
**one** 2px rule under the header, never a border above and below each row. That
is the actual defect the rule is aimed at.

---

## ADR-019 — Light theme only, with the architecture ready for dark

**Phase 2.** `design-taste-frontend` §6.C calls dark mode mandatory for any
consumer-facing page. This site ships light only, with `color-scheme: light`.

Three reasons. The Phase 2 deliverable list does not include a dark theme, and
neither does CLAUDE.md. The photography is graded for a light ground, and the
duotone treatment would need re-deriving. And shipping an unreviewed second
theme means a second contrast matrix and a doubled styleguide, both of which
would be approved by nobody.

The architecture does not foreclose it: components reference semantic tokens
(`--color-surface-page`, `--color-ink-secondary`) rather than ramp stops, so a
dark theme is one additional block remapping those aliases plus a second run of
the contrast matrix.

**Cost:** a reader with a dark system preference gets a light page. Revisit in
Phase 6 if the client wants it.

---

## ADR-020 — Em dashes and en dashes are banned from rendered copy, mechanically

**Phase 2.** `scripts/check-copy.mjs` fails the build if an em dash, an en dash
or a double hyphen appears in a content module or in the asset map's alt text.
It also fails on more than one middle dot in a line.

Both rules come from the anti-slop skills, where the em dash is called the single
most-violated tell. The reason to enforce it with a script rather than a
convention is that the convention does not survive contact with a second author:
one em dash in one string spreads through a site by imitation.

Ranges use a plain hyphen (`4.5-6.0`, `95.0-98.5%`). A sentence that wants an em
dash gets a comma, a colon, parentheses, or two sentences.

**Scope:** rendered copy only. Source comments and documentation are written for
the team, not for a visitor, and are not scanned.

---

## ADR-021 — Navigation is a prop, superseding ADR-014

**Phase 2.** ADR-014 said the header ships without navigation until the routes
exist. That is now expressed as a prop rather than an absence: `SiteHeader`
takes `navItems`, the live site passes only routes that exist, and the styleguide
passes the full Phase 3 set so the mega-menu can be reviewed before those pages
are built.

Same guarantee as ADR-014 (the live site never links to a 404), without holding
the component back from review.

---

## ADR-022 — Double-Bezel adapted, not adopted

**Phase 2.** `high-end-visual-design` §4.A requires a nested "Double-Bezel"
enclosure on every major card, at `rounded-[2rem]` with inset highlights.
`impeccable` says nested cards are always wrong. CLAUDE.md §5 requires near-square
radii and a maximum of one soft shadow in the entire system.

Resolution: the constitution sets the geometry, and the nesting idea is used
once, where it earns its place. The `instrument` card variant is an outer tray
at radius 6 holding an inner plate at radius 3 (concentric: 6 minus 6px of tray
padding), with no inset highlight and no shadow. It is used by the grade matrix
and nothing else, which is what keeps it meaningful.

Also taken from that skill: macro whitespace, custom cubic-bezier easings, press
feedback on buttons, GPU-safe animation, and z-index discipline. Not taken: pill
buttons, 2rem radii, glassmorphism, 700ms transitions, 16px entrance travel.

---

## ADR-023 — Sector slugs are short, not descriptive sentences

**Phase 3.** The sector ids double as URL segments, so they are the shortest
phrase that still names the sector unambiguously: `plastics-masterbatch`,
`paints-coatings-construction`, `oil-gas-drilling`, `rubber-elastomers`,
`paper-paperboard`.

They are ids in `src/content/schema.ts` first and URLs second, which is what
keeps `APPLICATION_SECTOR` able to roll each application in the dataset up to a
sector without a second mapping table. Renaming one is therefore a schema change
that the i18n gate catches, not a silent URL edit.

---

## ADR-024 — Documents are gated on an RFQ, not served as files

**Phase 3.** `docs/technical-data.md` carries the numbers for every grade but no
PDF files, and `public/documents/` is empty. The resource library therefore
lists all fifteen documents (five grades by TDS, MSDS, COA) with their real
scope, and every row routes to the RFQ form prefilled with the grade and
document type rather than to a download.

This is the honest state of the data and also the right commercial behaviour for
a COA, which is batch-specific and cannot be a static file. When real PDFs
arrive, TDS and MSDS rows become direct downloads and only the COA keeps the
gate. Tracked as `TODO(data): document files`.

---

## ADR-025 — Rate limiting is per-instance and best-effort

**Phase 3.** `src/lib/rate-limit.ts` is a fixed-window counter in module memory,
five submissions per ten minutes per client key. On a single instance it stops
the obvious abuse; across several instances each holds its own window, so the
effective limit multiplies by the instance count.

`clientKeyFromHeaders` falls back to one shared bucket when no forwarding header
is present, so a missing header throttles harder rather than not at all. This is
deliberate: the failure mode of a shared limiter is a rejected legitimate
request, and the failure mode of no limiter is an open relay into the sales
inbox.

Replace with a durable store when the RFQ endpoint moves behind a real backend.

---

## ADR-026 — Streaming boundaries live in pages, not in `loading.tsx`

**Phase 3.** A `loading.tsx` applies to its whole segment subtree, and a segment
that streams is a segment that is not prerendered. One at the locale root turned
every route in the site into a per-request render; one under `products/` did the
same to the ten grade pages, which have nothing per-request about them.

Only three routes read `searchParams` and so cannot be static under any
arrangement: `/products`, `/resources`, `/rfq`. Each now awaits the query string
inside a `<Suspense>` boundary in the page itself, so the page shell is sent
before the query is parsed and the boundary cannot reach a sibling segment.

This also fixes a duplicate landmark: a `loading.tsx` fallback carries its own
`<main>`, and the streamed HTML ends up holding two.

---

## ADR-027 — A modern browserslist floor

**Phase 3.** `package.json` declares Chrome 111, Edge 111, Firefox 128,
Safari 16.4. That is Tailwind 4's own baseline, which the token layer already
depends on: `@theme`, OKLCH colour, `:has()` and CSS logical properties are all
in use and none of them can be polyfilled.

Declaring it explicitly stops Lightning CSS from emitting fallbacks for browsers
that could not render the design system anyway.
