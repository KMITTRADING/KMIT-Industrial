# Validation

Production build completed on 12 September 2026.

- Twenty localized HTML pages; one H1 each; distinct titles and descriptions.
- Canonical links, reciprocal English/Arabic hreflang and Arabic x-default on every page.
- Organization, WebSite, WebPage and BreadcrumbList JSON-LD parse successfully.
- 824 local asset/link references resolve; 92 image elements have descriptive alt text and intrinsic dimensions.
- All WhatsApp links target the supplied number and include localized contextual text. Phone and email links use the supplied contact details.
- Official SVG matches the provided file byte-for-byte.
- Eight images, each with desktop, intermediate and mobile WebP variants: 24 assets total, approximately 2.52 MB combined; each below 500 KB.
- Browser checks at 1440px desktop and 390px mobile: no horizontal overflow on inspected English and Arabic pages; Alexandria loaded; Arabic direction and layout checked visually.
- English and Arabic disclosure menus open; Escape closes the menu; language switch retains the equivalent page; calcium carbonate technical accordion opens correctly.
- Mobile mining page loads the generated image and zero WebGL canvases. Desktop WebGL initializes without console errors on the inspected material page.
- Reduced-motion, constrained-connection, context-loss and low-performance fallback branches reviewed in source. Reduced-motion was not emulated in the browser tool.
- No forms, invented specifications, customer logos, case studies, or company facilities were added.

Performance is optimized through static HTML, self-hosted font subsets, priority hero loading, lazy secondary images, code-split Three.js/GSAP and on-demand rendering. Real-user Core Web Vitals require traffic and have not been measured; no Lighthouse score or field-performance claim is made.

The Sites build/package helper became unavailable in the installed plugin directory during execution. The project’s own build script produces the complete static output. Deployment packaging includes only dist and the hosting manifest.
