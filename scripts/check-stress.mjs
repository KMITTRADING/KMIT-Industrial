/**
 * The acceptance test for the defect that mattered most (§E): scrolling the page
 * hard used to kill the browser tab.
 *
 * It scrolls the full page top-to-bottom and back three times at speed, with the
 * §10 capability gate forced open so the WebGL path actually runs, and asserts:
 *
 *  - the page is still alive and responsive afterwards
 *  - no WebGL context was ever lost
 *  - exactly one WebGL context exists, and one canvas
 *  - JS heap has not grown without bound across the three passes
 *  - no console errors were produced
 *
 * Usage: node scripts/check-stress.mjs [baseUrl]
 */

import { existsSync, globSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';

function chromiumPath() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  return globSync(join(root, 'chromium-*/chrome-linux/chrome'))[0];
}

const executablePath = chromiumPath();
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Open the §10 gate so the three.js path is exercised, and record any context loss.
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
  window.__contextLost = 0;
  window.addEventListener(
    'webglcontextlost',
    () => {
      window.__contextLost += 1;
    },
    true
  );
});

const errors = [];
page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`CONSOLE ${m.text()}`);
});
let crashed = false;
page.on('crash', () => {
  crashed = true;
});

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`PASS  ${msg}`);

await page.goto(`${BASE}/ar`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3500);

const cdp = await context.newCDPSession(page);
const heapMB = async () => {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: 'performance.memory ? performance.memory.usedJSHeapSize : 0',
    returnByValue: true,
  });
  return Math.round((result.value || 0) / 1048576);
};

const height = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(`page height ${height}px`);

const samples = [];
samples.push(await heapMB());

for (let pass_ = 0; pass_ < 3; pass_++) {
  // Down fast, then up fast — the pattern that used to lose the tab.
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(16);
  }
  for (let y = height; y > 0; y -= 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(16);
  }
  // Let anything queued settle, then force a collection so the sample is fair.
  await page.waitForTimeout(500);
  await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
  samples.push(await heapMB());
  console.log(`  pass ${pass_ + 1}: heap ${samples[samples.length - 1]}MB`);
}

if (crashed) fail('the page crashed during the scroll stress');
else pass('survived three full-page scroll passes without crashing');

// Still responsive?
const alive = await page.evaluate(() => document.title.length > 0).catch(() => false);
if (!alive) fail('page is unresponsive after the stress');
else pass('page still responsive');

const lost = await page.evaluate(() => window.__contextLost ?? 0);
if (lost > 0) fail(`WebGL context was lost ${lost} time(s)`);
else pass('no WebGL context loss');

const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
if (canvases !== 1) fail(`expected exactly 1 canvas, found ${canvases}`);
else pass('exactly one canvas, so exactly one WebGL context');

// Heap: compare the last pass against the first. Some growth is normal; a leak
// shows up as steady growth pass over pass.
const first = samples[1];
const last = samples[samples.length - 1];
if (first > 0) {
  const growth = ((last - first) / first) * 100;
  if (growth > 35) {
    fail(`JS heap grew ${growth.toFixed(0)}% across passes (${first}MB -> ${last}MB)`);
  } else {
    pass(`JS heap stable across passes (${first}MB -> ${last}MB, ${growth.toFixed(0)}%)`);
  }
} else {
  console.log('NOTE  performance.memory unavailable; heap growth not measured');
}

if (errors.length) {
  fail(`${errors.length} console/page error(s): ${errors[0].slice(0, 160)}`);
} else {
  pass('no console or page errors');
}

await browser.close();

console.log('');
if (failures) {
  console.error(`${failures} stress failure(s).`);
  process.exit(1);
}
console.log('Scroll stress clean.');
