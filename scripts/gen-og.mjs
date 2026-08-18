/**
 * Generates the per-page Open Graph cards (§15.1.6): 1200x630, the KMIT mark and
 * the page title set in Alexandria, one card per page per language.
 *
 * Rendered through Chromium rather than a JSX-to-SVG renderer (satori / next/og).
 * That is not a stylistic preference: satori has no complex-script shaper, so it
 * draws Arabic as isolated, unjoined letterforms in visual order. Half of these
 * cards are Arabic, and a card with broken Arabic on it is worse than no card.
 * Chromium shapes and orders both scripts correctly.
 *
 * Run: npm run gen:og
 * Output: public/og/{ar,en}/{page}.png, committed to the repository so a deploy
 * never depends on a browser being present.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const OUT_ROOT = 'public/og';
const WIDTH = 1200;
const HEIGHT = 630;

/* --- the content, read straight from the dictionaries ---------------------- */

function readMeta(file) {
  const src = readFileSync(file, 'utf8');
  const block = src.slice(src.indexOf('meta: {'));
  // Keys are the route names; titles follow on the same or the next line.
  const entries = [
    ...block.matchAll(
      /'?([a-z-]+(?:\/[a-z-]+)?)'?:\s*\{\s*title:\s*\n?\s*'([^']+)'/g
    ),
  ];
  return entries.map(([, route, title]) => ({ route, title }));
}

const LANGS = [
  { lang: 'ar', dir: 'rtl', file: 'src/content/ar.ts', name: 'كميت الصناعية' },
  { lang: 'en', dir: 'ltr', file: 'src/content/en.ts', name: 'KMIT Industrial' },
];

/* --- brand assets, inlined so the page needs no network ------------------- */

const logoSvg = readFileSync('public/brand/KMIT_Industrial_Logo.svg', 'utf8');
const iconSvg = readFileSync('public/brand/KMIT_Industrial_Icon.svg', 'utf8');

function fontDataUri(path) {
  return `data:font/woff2;base64,${readFileSync(path).toString('base64')}`;
}
const FONT_AR = fontDataUri('public/fonts/alexandria-arabic-var.woff2');
const FONT_LATIN = fontDataUri('public/fonts/alexandria-latin-var.woff2');

/**
 * The card. Same design language as the site: --brand-deep ground, the 135deg
 * identity gradient, the icon oversized and cropped at 4% white as a watermark,
 * a 3px gradient rule, and the title in Alexandria at the correct weight for the
 * script (600 Arabic, 700 Latin).
 */
function card({ title, dir, lang, name }) {
  const white = dir === 'rtl' ? 600 : 700;
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Alexandria';
    font-weight: 400 700;
    src: url('${FONT_AR}') format('woff2');
    unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+FB50-FDFF, U+FE70-FEFC;
  }
  @font-face {
    font-family: 'Alexandria';
    font-weight: 400 700;
    src: url('${FONT_LATIN}') format('woff2');
    unicode-range: U+0000-00FF, U+2000-206F, U+2122;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; border-radius: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    position: relative;
    overflow: hidden;
    background: #1B1F4E;
    font-family: 'Alexandria', sans-serif;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 80px;
  }
  .grad {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #2B3073 0%, #3D55A4 100%);
    opacity: 0.34;
  }
  .mark {
    position: absolute;
    inset-block-end: -18%;
    inset-inline-end: -6%;
    width: 620px;
    opacity: 1;
  }
  .mark svg { width: 100%; height: auto; }
  .mark svg path { fill: rgba(255,255,255,0.04) !important; }
  .row { position: relative; display: flex; align-items: center; justify-content: space-between; }
  .logo svg { height: 44px; width: auto; }
  .logo svg path, .logo svg polygon, .logo svg rect { fill: #fff !important; }
  .label {
    font-size: 20px; font-weight: 500;
    color: rgba(255,255,255,0.72);
  }
  h1 {
    position: relative;
    font-size: ${dir === 'rtl' ? 62 : 66}px;
    font-weight: ${white};
    line-height: ${dir === 'rtl' ? 1.32 : 1.12};
    letter-spacing: ${dir === 'rtl' ? '0' : '-0.02em'};
    max-width: 22ch;
    text-wrap: balance;
  }
  .rule { position: relative; height: 3px; background: linear-gradient(135deg,#2B3073,#3D55A4); }
  .foot { position: relative; display: flex; gap: 28px; align-items: center; }
  .foot span { font-size: 19px; color: rgba(255,255,255,0.72); font-weight: 500; }
</style>
</head>
<body>
  <div class="grad"></div>
  <div class="mark">${iconSvg}</div>

  <div class="row">
    <div class="logo">${logoSvg}</div>
    <div class="label">${name}</div>
  </div>

  <h1>${escapeHtml(title)}</h1>

  <div>
    <div class="rule"></div>
    <div class="foot" style="margin-block-start:24px">
      <span>${dir === 'rtl' ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia'}</span>
      <span dir="ltr">kmit.co</span>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

/** Finds the Chromium the environment provides, else lets Playwright decide. */
function chromiumPath() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  const candidates = globSync(join(root, 'chromium-*/chrome-linux/chrome'));
  return candidates[0];
}

async function main() {
  const executablePath = chromiumPath();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  let count = 0;
  for (const { lang, dir, file, name } of LANGS) {
    const metas = readMeta(file);
    if (metas.length === 0) throw new Error(`No titles parsed from ${file}`);

    for (const { route, title } of metas) {
      const slug = route === 'home' ? 'home' : route.replace(/\//g, '-');
      const out = join(OUT_ROOT, lang, `${slug}.png`);
      mkdirSync(dirname(out), { recursive: true });

      await page.setContent(card({ title, dir, lang, name }), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.screenshot({ type: 'png' });
      writeFileSync(out, shot);
      count++;
      console.log(`  ${out}  ${title}`);
    }
  }

  await browser.close();
  console.log(`\nGenerated ${count} Open Graph cards at ${WIDTH}x${HEIGHT}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
