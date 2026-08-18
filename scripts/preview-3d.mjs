/**
 * Renders the site with the §10 capability gate forced open, and captures the
 * WebGL scenes.
 *
 * Why this exists: §10 sends any machine reporting `hardwareConcurrency <= 4`
 * down the static path. That is the correct behaviour, but it also means a
 * 4-core build machine or CI runner never executes a single line of the three.js
 * code — so shader errors, canvas sizing bugs and disposal leaks stay invisible
 * until a visitor on a real GPU finds them. Both of those bugs were caught here.
 *
 * Usage: node scripts/preview-3d.mjs [baseUrl] [outDir]
 *   default: http://localhost:3000  docs/review/3d
 */

import { existsSync, globSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? 'docs/review/3d';

function chromiumPath() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  return globSync(join(root, 'chromium-*/chrome-linux/chrome'))[0];
}

const executablePath = chromiumPath();
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  // SwiftShader stands in for a GPU on a headless runner.
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

mkdirSync(OUT, { recursive: true });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Open the capability gate: claim eight cores.
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
});

const errors = [];
page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`CONSOLE ${m.text()}`);
});

await page.goto(`${BASE}/ar`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// The scenes mount on an idle callback, deliberately off the critical path.
await page.waitForTimeout(4000);

const webglOn = await page.evaluate(
  () => document.querySelector('.hero-headline')?.getAttribute('data-webgl') ?? 'off'
);
const canvasSizes = await page.evaluate(() =>
  [...document.querySelectorAll('canvas')].map((c) => {
    const r = c.getBoundingClientRect();
    return `${c.className || 'canvas'} ${Math.round(r.width)}x${Math.round(r.height)}`;
  })
);

console.log(`hero WebGL: ${webglOn}`);
console.log(`canvases:   ${canvasSizes.join(' | ')}`);

await page.screenshot({ path: join(OUT, 'hero.png') });

const total = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(`page height: ${total}px (pinned sections expand it)`);

let i = 0;
for (let y = 700; y < total - 900; y += 700) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, `scroll-${String(i).padStart(2, '0')}.png`) });
  i += 1;
  if (i > 14) break;
}

await browser.close();

// A canvas stuck at the intrinsic 300x150 means it is not being sized by CSS.
const unsized = canvasSizes.filter((s) => s.endsWith('300x150'));
if (unsized.length) {
  console.error(`\nFAIL  canvas left at its intrinsic size: ${unsized.join(', ')}`);
  process.exit(1);
}
if (errors.length) {
  console.error(`\n${errors.length} console/page error(s):`);
  for (const e of errors.slice(0, 10)) console.error(`  ${e.slice(0, 300)}`);
  process.exit(1);
}
console.log(`\nWebGL path clean. ${i + 1} captures in ${OUT}.`);
