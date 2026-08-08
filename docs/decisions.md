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

---

## ADR-028 — Positioning derives from product-marketing.md, not from market research

**Phase 4.** The Phase 4 brief names `docs/research-input.md` as an input and
says to stop and ask for it if it is absent. It is absent, and the human
confirmed no market research exists.

Positioning therefore derives from `.agents/product-marketing.md`, which was
written in Phase 1 from `docs/technical-data.md` and `docs/keyword-clusters.md`
and already carries the personas, the objection map, the customer language list
and the brand voice. That file is the positioning source of record for this
project until research replaces it.

What this costs: the competitive framing in §5 of that file stays marked
unverified and no competitor is named on the site, the priority order of the
supply arguments is reasoned rather than measured, and the keyword clusters are
untested. All three are revisited against Search Console after 60 days, as
`docs/keyword-clusters.md` already specifies.

---

## ADR-029 — FAQ sets are per grade and per sector, keyed and rendered open

**Phase 4.** Sixty question and answer pairs per locale: eight per grade and
six or seven per sector, replacing the four site-wide questions from Phase 2.

Three decisions inside that:

- **Keyed, not positional.** Each question carries a topic slug, so
  `npm run check:i18n` diffs question ids across locales and an Arabic set that
  quietly loses a question is a build failure. An array would have been one leaf
  to the mirror check.
- **Different questions per grade.** What an engineer asks about a 45 micron
  bridging agent is not what they ask about a coated 2500 mesh masterbatch
  filler. A shared template would have produced fifty answers that say the same
  thing five times.
- **Rendered open, not in an accordion.** These are the most extractable
  passages on the site: what an answer engine lifts and what a buyer skims
  before requesting a sample. Collapsing them buys vertical space and costs the
  page its reason for existing. `FaqList` is a description list with real
  headings; `FaqAccordion` stays for the styleguide.

Where an honest answer is "the data does not say", the answer says so and names
what would settle it. Minimum order quantity, sampling policy and loading level
are all answered that way rather than omitted, because a buyer who cannot find
the question assumes it was dodged.

---

## ADR-030 — Guides live in the footer, not in the header

**Phase 4.** Three decision and comparison guides now exist: grade selection,
coated versus uncoated, and GCC versus PCC. The header stays at five items.

A reader arrives on a guide from a search or an assistant rather than by
navigating to it, and the five header slots belong to the pages a returning
buyer navigates to on purpose. Spending one on the guides would have cost either
the facility page or the document library. Every guide is linked from the pages
whose readers need it, and all three are in the footer.

`/guides/grade-selection` reads `?application=` and so renders per request. The
full fourteen-row table renders inside the same boundary and is never filtered
away, so every recommendation is reachable with no JavaScript and no query
string, which is what the brief means by a crawlable static fallback.

---

## ADR-031 — Alt text is content, not markup

**Phase 4.** The four plant photographs on the facility page had their alt text
written as literals in the page component, keyed by locale. It now lives in the
content tree under `imageAlt`.

Alt text is copy: it is read aloud, it is indexed, and it has to be written
natively in each locale rather than translated. Moving it means the i18n gate
catches a missing Arabic alt exactly as it catches a missing heading, which a
literal in a `.tsx` file never was.

---

## ADR-032 — The copy gate now fails on filler

**Phase 4.** `scripts/check-copy.mjs` gained a third rule: seventeen banned
phrases in both languages, drawn from CLAUDE.md §6 and
`.agents/product-marketing.md` §9.

The Phase 4 brief asks for a grep result proving no filler survives. A grep
proves it once; a gate proves it on every commit. Every phrase on the list is a
substitute for a figure, and this project has the figures.

---

## ADR-033 — hreflang is declared in the document, once

**Phase 5.** next-intl's middleware emits its own `Link: rel="alternate"`
response header, and it disagreed with the cluster `src/lib/seo.ts` writes into
the `<head>`: it labelled Arabic `ar` rather than `ar-SA`, and pointed
`x-default` at the unprefixed path, which is itself a redirect.

Two conflicting hreflang declarations for one page are worse than one, and the
brief requires the cluster to be built centrally so no page can omit it.
`alternateLinks: false` turns the header off; the document is the single source.

`localeCookie: false` came with it. Detection is off, so the cookie changed no
routing decision, and a `Set-Cookie` on every response makes the site
uncacheable at a CDN edge for nothing.

---

## ADR-034 — The unprefixed root redirects permanently

**Phase 5.** next-intl answers `/` with a 307. A temporary redirect tells a
crawler to keep requesting the old URL and to leave the link equity where it
was, which on this site root is exactly wrong: `/` is never going to serve a
document and `/ar` is permanently the home page.

`src/proxy.ts` now handles unprefixed paths itself and answers 308, delegating
everything else to next-intl. 308 rather than 301 so the method and body
survive, which matters for the one POST target on the site.

---

## ADR-035 — Open Graph cards carry Latin technical content only

**Phase 5.** `opengraph-image.tsx` renders through Satori, which needs a font
supplied as a parsed buffer. The design system's Alexandria is loaded by
`next/font` as woff2, which Satori cannot read, and fetching a TTF at build time
to render Arabic would make every build depend on a third-party font host.

It is not needed. Grade codes, mesh sizes, D50 ranges, percentages and standard
numbers are Latin in both locales under CLAUDE.md §7, so the card carries
identical and correct information for an Arabic reader and an English one.
Localised prose stays in `og:title` and `og:description`, which are text and
need no font at all.

Two cards ship: a default for the site, and one per grade carrying the code and
the four numbers that decide whether it is the right grade. A single static card
for the whole site was the thing the brief specifically ruled out.

---

## ADR-036 — No Offer, and no HowTo

**Phase 5.** Two schema types the brief lists are deliberately absent.

`Offer` requires a price and an availability. This is enquiry-led B2B supply
where price is a function of grade, volume, packaging and destination, and there
is no published price. Emitting `"price": "0"` to satisfy a rich-result
checklist would publish a false commercial term. The brief already says to omit
rather than fake it.

`HowTo` is not forced either, which the brief also permits. The storage guidance
in docs/technical-data.md §5 is two sentences of conditions, not a procedure
with ordered steps, and breaking it into `HowToStep` nodes would invent a
structure the source does not have. Google also retired HowTo rich results in
2023, so the invention would buy nothing.

---

## ADR-037 — Three new gates, because the source-only ones were not enough

**Phase 5.** `check:copy` reads string literals in `src/content`. It had passed
for four phases while every rendered D50 range shipped an en dash, because
`formatRange` built the separator at runtime and no literal contained it. The
ban was real, the gate was looking in the wrong place.

Three gates now read the served HTML instead of the source:

- **`check:dom`** — the dash ban applied to rendered text and metadata, one
  canonical per page matching its own URL, and a complete reciprocal hreflang
  cluster. 26 routes.
- **`check:crawl`** — follows links from the root as a crawler does, and asserts
  that every sitemap URL is reachable within three clicks and that nothing
  reachable is missing from the sitemap. 42 URLs.
- **`check:schema`** — required properties per type, `@id` resolution inside the
  graph, no `Offer` without a price, no null or empty values, and `FAQPage`
  questions and answers actually present in the document. 11 routes.

The rule generalises: a gate that reads source catches what was written, and a
gate that reads output catches what was built. This project needed both.

---

## ADR-038 — The home page grade matrix is a document, not a component

**Phase 6.** `GradeMatrix` is a client component, and hydrating it was the
largest single contributor to total blocking time on the most-visited page on
the site. The home page now renders `GradeTable`: the same five rows, server
rendered, no JavaScript.

What was given up is filtering and sorting five rows, and it was duplicated
anyway. `/products` does both properly with the state in the URL, so a filtered
view is shareable and crawlable, and the home page already links there. Two
filtering mechanisms for one five-row dataset was the redundancy; this removes
the weaker one rather than paying to hydrate it.

`GradeMatrix` still exists and is still exercised in the styleguide. The
interactive behaviour is part of the design system even where no page needs it.

---

## ADR-039 — Client components import modules, not barrels

**Phase 6.** Every client component imported from `@/components/primitives`.
A barrel re-exports every primitive including the client ones, so importing one
icon put Dialog, Tabs, Tooltip, Accordion and Pagination into the client graph
of whichever route pulled it. The header does that on every page.

The same defect was recorded in Phase 3 for `RfqForm` and the server action, and
fixed there by one comment. It came back through a different door, which is the
argument for a rule rather than a note: client components import from the module
that defines the symbol.

`TableScroll` moved out of `Table.tsx` for the same reason. One `'use client'`
directive at the top of the table system was making every page with any table
ship and hydrate a scroll observer, when only the scroll shell needs the client.

---

## ADR-040 — Client messages are scoped, in two tiers

**Phase 6.** `NextIntlClientProvider` with no `messages` prop serialises the
entire catalogue into the RSC payload of every page: 57.5 KB of Arabic on a
242 KB document, of which client components use 10.6 KB. The rest was every FAQ
answer, every guide body and every sector page's prose, shipped to a browser
that renders none of it and parsed on the main thread before the page settles.

Eight namespaces ship everywhere. The RFQ form and the styleguide nest their own
providers for the extra namespaces they read, so that cost lands on those routes
only. The document dropped from 242 KB to 163 KB.

The risk this creates is a runtime error: a client component reading a namespace
outside its scope throws where it renders, on one route, in one locale.
`scripts/check-client-messages.mjs` scans every client component for the
namespaces it reads and fails the build if one is not covered, in either
direction. It found four real cases the moment it was written.

---

## ADR-041 — The CSP carries 'unsafe-inline' for scripts, deliberately

**Phase 6.** Next.js inlines the RSC flight data and the hydration bootstrap as
inline `<script>` elements. The nonce-based alternative requires reading a
per-request header, which forces every route to render dynamically and undoes
the static generation this site is built on.

The trade taken: `script-src` allows `'unsafe-inline'` and the analytics hosts,
and nothing else. `'unsafe-eval'` is not granted, `object-src` is `'none'`,
`base-uri` and `form-action` are `'self'`, and `frame-ancestors` is `'none'`.
The residual risk is that an injected inline script would execute; the mitigation
is that there is no user-generated content on this site and every rendered value
comes from a typed content tree or a zod-validated dataset.

Withholding `'unsafe-eval'` costs a Lighthouse Best Practices point, and that is
the header working rather than failing. next-intl's formatter probes for eval
support with `try { Function('') }` and takes a non-eval path when it throws.
The fallback is correct and the end-to-end suite passes under this policy, but
Chrome logs the blocked probe in its Issues panel and Lighthouse's
`inspector-issues` audit counts any issue against the category. Granting
`'unsafe-eval'` would recover the point by removing the mitigation, which is the
wrong direction.

Revisit if a CMS is introduced in a later phase. User-generated content changes
this calculation completely.

---

## ADR-042 — The performance gate budgets bytes, not scores

**Phase 6.** Lighthouse's Performance number on a shared CI runner swings ten
points between identical runs of the same build. Repeated runs here scored 88 to 95. A merge gate on that number would either block good work at random or be set
so loose it blocks nothing.

`scripts/check-budget.mjs` asserts what the site ships instead: compressed
document size, script request count, total script weight, and the named message
namespaces that must not appear in a content page's payload. All four are
deterministic, so a failure always means somebody added weight.

The Lighthouse numbers are still measured and still reported, in
`docs/qa-report.md`. They are evidence, not a gate.
