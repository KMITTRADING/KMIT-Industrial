# Assets Gap Log — KMIT Industrial

*Phase 0 audit. Nothing in the app should reference an asset that doesn't actually exist — this file tracks what's missing and what placeholder (with correct dimensions) should stand in until the real asset arrives.*

## What exists today (`/public`)

| Asset | Path | Dimensions | Notes |
|---|---|---|---|
| Full wordmark logo | `/KMIT_Industrial_Logo.svg` | viewBox 1920×648.6 | Single flat fill `#2b3073` (deep navy-indigo). No secondary/accent color in the mark itself. |
| Icon/mark only | `/KMIT_Industrial_Icon.svg` | viewBox 655.3×648.6 | Same `#2b3073` fill. Usable as favicon base / compact nav logo. |
| Contact icon — location | `/contact-icons/location.svg` | small, inline SVG | |
| Contact icon — mail | `/contact-icons/mail.svg` | small, inline SVG | |
| Contact icon — phone | `/contact-icons/phone.svg` | small, inline SVG | |
| Contact icon — whatsapp | `/contact-icons/whatsapp.svg` | small, inline SVG | |
| Mining & Extraction | `Images/1.Mining & Extraction/1.Open-Pit-Quarry.png`, `2.Underground-Mining.png` | 2752×1536 | Large source files — need Next/Image AVIF/WebP pipeline, not raw PNG at this size. |
| Processing & Manufacturing | `2.Processing & Manufacturing/1.Kiln-&-Plant.png`, `2.Grinding-Mills-&-Micronizers.png`, `3.Powder-Texture.png` | 2752×1536 (1,2), 1200×896 (3) | |
| Quality Control & Lab | `3.Quality Control & Lab/1.Lab-&-QC-Testing.png` | 2752×1536 | Only 1 image — brief implies a full QA/lab storytelling section (section 5.1 "Mining & QA Split"). |
| Industrial Applications | `4.Industrial Applications/1.Plastics-&-Masterbatch.png`, `2.Paints-&-Coatings.png`, `3.Oil-&-Gas-Drilling.png`, `4.Paper-&-Packaging.png` | 2752×1536 | Covers 4 of the 6 sectors the brief's Grade Selector expects. |
| Packaging & Logistics | `5.Packaging & Logistics/1.Paper-Valve-Bags-on-Pallets.png`, `2.Jumbo-Bags-Storage.png`, `3.Bulk-Silo-Tanker-Truck.png` | 2752×1536 | Matches the 3 logistics formats in brief section 5.2.6 exactly. |

## Confirmed gaps (do not invent — placeholder + log until supplied)

1. **Rubber application image** — Grade Selector (brief §5.2.2) lists 6 sectors: PVC, Masterbatch, Paints, Drilling mud, Rubber, Paper. Only 4 sector images exist and "Plastics & Masterbatch" is combined into one image rather than split PVC vs Masterbatch. **Placeholder:** reuse `Powder-Texture.png` cropped/tinted as a neutral technical-texture placeholder at 2752×1536, tagged `data-placeholder="true"` and logged here — swap when a real rubber-manufacturing photo is supplied.
2. **Custom SVG icon set for sector/technical icons** (brief §0 exception clause references `/public/assets/vectors/`) — folder does not exist. Only 4 contact icons exist. Phosphor Icons (Light/Regular) will be used for all generic UI icons per the design decision table; only sector-specific or brand-specific icons need custom SVGs, and none exist yet.
3. **Favicon / app icons** (various sizes: 32×32, 180×180 apple-touch, 512×512 PWA) — not present. Will be generated from `KMIT_Industrial_Icon.svg`.
4. **OG image template assets** — no static Open Graph image exists; will be generated dynamically via `opengraph-image.tsx` using the logo + navy background, no invented photography.
5. **White/inverse logo variant** — both SVGs are single-fill `#2b3073`. On dark navy surfaces (`--surface-inverse`) the logo needs a white or light variant. **Decision:** render the existing SVG with `fill: currentColor` wrapped in a component so it can be recolored via CSS rather than requesting a new asset file — avoids inventing a file that doesn't exist while still solving the dark-surface case.
6. **Certification badge graphics** (ISO 9001 / SASO / REACH marks referenced in brief §5.1, §5.2.5, §6.2) — no logo files supplied. Do not fabricate certification marks. Use text-based high-contrast badges until real certificate/mark files are provided, and confirm with KMIT which certifications are actually held (see `.agents/product-marketing.md` open gaps).
7. **TDS/MSDS PDF documents** — brief §5.3 requires one-click TDS/MSDS download per grade with analytics tracking. No PDFs exist in the repo. Technical Center and product pages will render the TDS *table* from `lib/data/grades.ts` (real, typed data — to be sourced from KMIT, not invented figures); PDF download buttons will be disabled/hidden per grade until a real file is supplied, not linked to a placeholder PDF.
8. **Office/plant map data** — brief §5.4 requires a map of the Jeddah office and factory locations. No coordinates or addresses supplied yet.
9. **Real contact details** — phone number(s), email address, WhatsApp business number. Top bar and floating action bar in §5.1 need real numbers; none supplied. Placeholder UI will render with obviously-fake demo values removed (empty/disabled state) rather than a fabricated phone number, until real values are provided.

## Explicitly NOT a gap (source of truth confirmed)

- **Primary brand color** is `#2b3073` (deep navy-indigo), extracted directly from both logo SVGs' `fill` value. This supersedes the master brief's assumed `--navy-900 #0A192F` primitive token — see flag in the Phase 0 audit report for the resulting design-token decision.
