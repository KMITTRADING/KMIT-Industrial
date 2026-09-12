# KMIT Industrial Solutions

Complete bilingual static website: Arabic RTL and English LTR, ten pages per language. The default entry is Arabic. Calcium carbonate is the primary content pillar.

## Run

Use Node 22 or newer and pnpm. Install with `pnpm install`, build with `pnpm build`, and start the local preview with `pnpm dev` (port 4173). `pnpm check` audits the output, metadata, local links, image budgets and logo integrity. The original-logo comparison expects the supplied G: path; remove that one local-input assertion if validating on another machine.

## Architecture

- `src/content.mjs`: complete structured bilingual content and source references.
- `src/render.mjs`: shared semantic components and per-page SEO.
- `src/styles.css`: Alexandria typography, responsive layouts and RTL styling.
- `src/client.js`: accessible navigation, local analytics event hooks, journey activation.
- `src/scenes.js`: lazy Three.js material, geology and solar thermal scenes. Render only on interaction/scroll; static imagery for mobile, reduced motion, constrained connections and failed WebGL.
- `scripts/build.mjs`: crawlable HTML, split scripts, self-hosted fonts, sitemap, robots, headers and 404.
- `public/images`: eight bespoke generated assets in three responsive WebP versions each.
- `docs/image-prompts.json`: exact built-in ChatGPT image generation prompts.

## Deployment

`dist` is the complete static artifact. The canonical origin defaults to the registered Sites domain. For a custom domain, build with `SITE_URL` set to its HTTPS origin and redeploy so canonical URLs, hreflang, structured data and the sitemap all change together. Domain ownership is not inferred from the contact email.

No forms, databases, tracking identifiers, invented product specifications, projects or customer claims are included. Organization schema uses only the supplied brand and contact details. No Product or LocalBusiness schema is asserted.

Listen for the `kmit:analytics` browser CustomEvent to connect a future approved analytics implementation. Events include WhatsApp, email, phone, language switch and calcium carbonate section engagement. No event data is transmitted by the present implementation.

Future verified product grades, technical documents, capabilities and availability should be added to the structured content only after confirmation. Industry concepts are not company specifications.
