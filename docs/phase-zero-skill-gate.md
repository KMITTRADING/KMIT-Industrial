# Phase Zero — Skill Loading Gate

*Gate report. Read before any application code is written for the KMIT Industrial bilingual (Arabic RTL primary / English LTR secondary) site. Produced on this branch per the Phase Zero skill-loading instruction; supersedes nothing from the merged Phase 0 discovery audit (`.agents/product-marketing.md`, `docs/site-architecture.md`, `ASSETS-GAP.md`) — it sits alongside it as the design/SEO rulebook for implementation.*

## Skills read in full this session

Read directly (local `SKILL.md`) or invoked via the `Skill` tool, which loads the skill's full instructions into context:

- `full-output-enforcement`
- `high-end-visual-design`
- `impeccable`
- `design-taste-frontend`
- `ui-ux-pro-max`
- `seo-audit`
- `schema`
- `ai-seo`
- `frontend-design` (the one skill present as a local file at `/mnt/skills/public/frontend-design/SKILL.md` in this environment; distinct from the marketplace design skills above)

**Availability note:** `~/.claude/skills` and `/mnt/skills` only contain a handful of generic skills locally (`docx`, `pdf`, `pptx`, `xlsx`, `file-reading`, `product-self-knowledge`, `frontend-design`). The marketing/design/SEO skill set named in the brief (`product-marketing`, `site-architecture`, `content-strategy`, `copywriting`, `copy-editing`, `marketing-psychology`, `ckmui-styling`, `emil-design-eng`, `gpt-taste`, `imagegen-frontend-web`, `image-to-code`, `ckmdesign-system`, `ckmbrand`, `programmatic-seo`, `analytics`, `cro`, etc.) is confirmed available through this session's skill catalog and is invokable via the `Skill` tool, but is not present as a browsable local file — invoking it is the only way to read it.

**Deferred to point of use (confirmed available, not bulk-loaded now):** `product-marketing`, `site-architecture` — already materialized as this repo's own `.agents/product-marketing.md` and `docs/site-architecture.md` from the merged Phase 0 audit, so re-invoking the generic skill now would add nothing beyond what's already captured. `content-strategy`, `copywriting`, `copy-editing`, `marketing-psychology` — apply at the copywriting phase (Phase 0's own gap log flags real copy as blocked on KMIT-supplied customer language). `ckmui-styling`, `emil-design-eng`, `gpt-taste`, `imagegen-frontend-web`, `image-to-code`, `ckmdesign-system`, `ckmbrand` — design/image-generation skills that operate on a concrete component or image brief; there is no application code or image brief yet to apply them to (repo currently ships only brand assets — see `ASSETS-GAP.md`). `programmatic-seo`, `analytics`, `cro` — apply once page templates and conversion flows (RFQ form) exist to instrument or template. Each will be invoked explicitly when its matching task starts, per standard skill-usage practice, rather than pre-loaded speculatively.

**Not found / no such skill in this environment:** none of the requested names were missing from the catalog — all resolved to either a local file or an invokable marketplace skill.

## 3 binding design rules

1. **Absolute-ban list is a hard gate, checked mechanically before shipping any surface.** Zero em-dashes anywhere visible (headlines, eyebrows, body, captions, alt text — hyphen only); no cream/sand/beige-plus-brass/oxblood "premium industrial" default palette; no gradient text; no side-stripe borders as accents; no generic 3-equal feature-card rows; no numbered `01/02/03` section markers unless the content is a genuine sequence; no div-based fake product screenshots; Inter/Roboto/Arial/Open Sans/Helvetica excluded as default fonts. Eyebrow labels are capped at 1 per 3 sections, not one per section.
2. **Contrast and theme locks apply across both languages, not just both color modes.** WCAG AA minimum (4.5:1 body, 3:1 large text) verified in light and dark, and separately in Arabic RTL and English LTR layouts, since mirrored spacing/alignment can silently break a contrast or hierarchy decision that passed in one direction. One accent color, one corner-radius system, one light/dark theme locked per page — no mid-page inversion.
3. **Cards get elevation only when hierarchy demands it; when used, follow the Double-Bezel (outer shell + inner core) construction, not a flat single-layer card.** Max 3 font families total (display + body + optional mono), with an Arabic-appropriate display/body pairing sourced deliberately (not a Latin font applying fake Arabic glyphs), and hero copy fitting both scripts without overflow at every breakpoint.

## 3 technical SEO rules (apply in `app/` from the first file)

1. **Every route × locale pair ships its own Metadata API export** (title, description, canonical) plus hreflang alternates for `ar-SA`, `en`, and `x-default` — self-referencing, reciprocal, and pointing at the exact canonical URL (a mismatch silently drops the whole hreflang cluster).
2. **All JSON-LD is server-rendered via `@graph`, never client-injected** (Organization, LocalBusiness, BreadcrumbList sitewide; Product per grade page; FAQPage where content supports it) — validated with the Rich Results Test, since `web_fetch`/`curl` strip `<script>` tags and can't see JS-injected structured data.
3. **Sitemap and robots are generated programmatically, not hand-maintained:** `sitemap.xml` includes `xhtml:link` alternates for every locale (including self) with absolute URLs; `robots.txt` allows the AI/search crawlers that matter for citation (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot) and blocks only pure-training bots if any; strict H1→H2→H3 hierarchy per page with headings and copy built from real KSA/GCC market search terms (كربونات كالسيوم, GCC, PCC, mesh) rather than literal English-to-Arabic translation.

## Conflicts found and how they were resolved

Per the stated precedence (`full-output-enforcement` > explicit prompt requirements > `high-end-visual-design` > `impeccable` > `design-taste-frontend` > `ui-ux-pro-max` > other design skills):

- **Nested cards.** `high-end-visual-design` mandates a "Double-Bezel" nested-card architecture as the default treatment for major containers. `impeccable`'s absolute-ban list says "nested cards are always wrong." Resolution: `high-end-visual-design` outranks `impeccable`, so Double-Bezel construction is permitted — but only applied where `impeccable`'s own qualifier is satisfied ("cards ONLY when elevation communicates real hierarchy"), since that qualifier isn't actually contradicted, just the blanket "always wrong" clause is overridden.
- **Eyebrow frequency.** `high-end-visual-design` prescribes an eyebrow tag above every major H1/H2. `impeccable` and `design-taste-frontend` both flag an eyebrow-per-section as the single most-violated AI tell and cap it at roughly 1 per 3 sections. Resolution: `high-end-visual-design` wins in principle, but since it never states a frequency (it says "precede major headings," not "every heading"), the lower-precedence cap is applied as the concrete number — eyebrows used deliberately, not reflexively, staying at or under 1-per-3.
- **SEO skill boundaries.** No real conflict: per the standing constraint, `schema` and `seo-audit` govern technical structure (metadata, hreflang, sitemap, JSON-LD wiring) and `ai-seo` governs how content is phrased for AI-answer-engine citation. `ai-seo` itself explicitly defers to Google's "no special AI markup" stance for Google AI Overviews, so the technical layer (`schema`/`seo-audit`) is never asked to do something `ai-seo` contradicts.

## Anti-patterns these skills forbid (avoided from the first commit)

Em-dashes anywhere; cream/beige/brass/oxblood "artisan industrial" default palette; AI-purple gradients and glow; gradient-clipped text; side-stripe borders as card accents; generic 3-equal icon-card feature rows; numbered `01/02/03` eyebrows/section markers without a genuine sequence; div-based fake screenshots or fake dashboards; hand-rolled decorative SVG icons (use an allowed icon library — Phosphor/Tabler/Radix/HugeIcons — consistent with the contact-icon set already in `/public`); banned default fonts (Inter, Roboto, Arial, Open Sans, Helvetica); fake-precise invented statistics (the product-marketing gap log already flags which numbers are real vs. `[GAP]`); generic "Jane Doe"/"Acme"-style placeholder names or logos; `window.addEventListener('scroll')`-driven animation; version/beta labels in the hero (this is not a launch-status site); scroll-cue affordances ("↓ scroll"); locale/weather/time strips (not applicable to a KSA-based B2B manufacturer site); client-injected JSON-LD that Rich Results Test / crawlers can't see reliably.
