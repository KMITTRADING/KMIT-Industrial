/**
 * Derives the brand assets from the supplied Illustrator exports:
 *
 *   public/brand/logo.svg  ->  public/brand/KMIT_Industrial_Logo.svg
 *                              src/components/brand/marks.tsx (LOGO_BODY)
 *   public/brand/icon.svg  ->  public/brand/KMIT_Industrial_Icon.svg
 *                              src/components/brand/marks.tsx (ICON_BODY)
 *
 * The two source files carry a hard-coded `fill: #2b3073` in a <style> block,
 * which cannot be recoloured by CSS from outside and would leave the mark
 * invisible-adjacent on an indigo ground. This strips that block so the shapes
 * inherit `currentColor` instead (§5.6).
 *
 * Run: npm run gen:brand
 */

import { readFileSync, writeFileSync } from 'node:fs';

function inner(file) {
  const src = readFileSync(file, 'utf8');
  // Drop the XML prolog, generator comment and the <defs> colour block, keep the shapes.
  const body = src.slice(src.indexOf('</defs>') + 7, src.lastIndexOf('</svg>'));
  return body
    // Every class here points at the stripped <style> block. `class` is also not
    // a valid JSX attribute, so all of them go.
    .replace(/\s+class="[^"]*"/g, '')
    // `.st0 { fill: none }` in the icon file is an Illustrator guide line; drop it.
    .replace(/<line[^>]*\/>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n    ');
}

const logo = inner('public/brand/logo.svg');
const icon = inner('public/brand/icon.svg');

/* --- public SVG files at the paths named in §1 -----------------------------
 * These are consumed by external agents (search engines, social cards,
 * favicons) which render the file in isolation with no inherited colour, so
 * they carry the brand colour explicitly. The React components below are the
 * on-site path and use currentColor.
 */
const pub = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="#2B3073">\n  ` +
  body.replace(/\n {4}/g, '\n  ') +
  '\n</svg>\n';

writeFileSync('public/brand/KMIT_Industrial_Logo.svg', pub('0 0 1920 648.6', logo));
writeFileSync('public/brand/KMIT_Industrial_Icon.svg', pub('0 0 655.3 648.6', icon));

/* --- shared path data for the inline React components -------------------- */
const tsx = `/**
 * Brand mark geometry, generated from the supplied Illustrator exports by
 * scripts/gen-brand.mjs. Do not hand-edit: regenerate instead.
 *
 * The marks are monochrome and fill with \\\`currentColor\\\` (§5.6), so they take
 * --brand on light grounds and white on indigo with no second asset. Never
 * tinted with the gradient, never given a shadow or a border, and never
 * mirrored in RTL.
 */

export const LOGO_VIEWBOX = '0 0 1920 648.6';
export const ICON_VIEWBOX = '0 0 655.3 648.6';

export const LOGO_BODY = (
  <g fill="currentColor">
    ${logo}
  </g>
);

export const ICON_BODY = (
  <g fill="currentColor">
    ${icon}
  </g>
);
`;
writeFileSync('src/components/brand/marks.tsx', tsx);

console.log(
  `Generated brand assets — logo body ${logo.length} bytes, icon body ${icon.length} bytes.`
);
