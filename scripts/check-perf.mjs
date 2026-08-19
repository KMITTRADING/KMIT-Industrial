/**
 * The §9 budgets, measured rather than asserted.
 *
 * Throttled to approximate the brief's target: a mid-range Android over 4G.
 * 4x CPU slowdown and ~1.6 Mbps down with 150ms RTT is the profile Lighthouse
 * calls "Slow 4G"; using the same numbers keeps this comparable to the
 * Lighthouse run Netlify does on every deploy.
 *
 *   node scripts/check-perf.mjs
 */
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const OUT = new URL('../out/', import.meta.url).pathname;
const TYPES = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.xml':'application/xml','.txt':'text/plain' };

const server = createServer(async (req, res) => {
  const url = (req.url ?? '/').split('?')[0];
  for (const c of [url, `${url}.html`, join(url, 'index.html')]) {
    try {
      const body = await readFile(join(OUT, c));
      res.writeHead(200, { 'content-type': TYPES[extname(c)] ?? 'application/octet-stream' });
      return res.end(body);
    } catch {}
  }
  res.writeHead(404).end('not found');
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

/* ---- Static budget: what the initial document actually references --------
   Measured from the HTML rather than by summing the chunks directory, because
   the lazily-loaded three.js chunk is on disk but is not initial JS. */
async function initialJs(locale) {
  const html = await readFile(join(OUT, `${locale}.html`), 'utf8');
  const refs = [...new Set(html.match(/\/_next\/static\/[^"']+\.js/g) ?? [])];
  let total = 0;
  for (const ref of refs) {
    try { total += gzipSync(await readFile(join(OUT, ref))).length; } catch {}
  }
  return { bytes: total, files: refs.length };
}

/**
 * The three.js chunk specifically — identified by content, not by size, so the
 * number reported is the thing §9 excludes rather than "every large file".
 */
async function threeChunk(locale) {
  const html = await readFile(join(OUT, `${locale}.html`), 'utf8');
  const initial = new Set(html.match(/\/_next\/static\/[^"']+\.js/g) ?? []);
  const dir = join(OUT, '_next/static/chunks');
  let total = 0;
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.js')) continue;
    if (initial.has(`/_next/static/chunks/${f}`)) continue;
    const p = join(dir, f);
    if ((await stat(p)).size < 50_000) continue;
    const source = await readFile(p, 'utf8');
    // three.js ships its version string; nothing else in this app does.
    if (!/REVISION\s*=\s*['"]\d+/.test(source) && !source.includes('WebGLRenderer')) continue;
    total += gzipSync(Buffer.from(source)).length;
  }
  return total;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

const rows = [];

for (const locale of ['ar', 'en']) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
  });
  const page = await context.newPage();

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`${base}/${locale}`, { waitUntil: 'load' });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) lcp = Math.max(lcp, e.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });

        // Long tasks after first paint are what TBT is made of.
        let blocking = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) blocking += Math.max(0, e.duration - 50);
        }).observe({ type: 'longtask', buffered: true });

        // Let the deferred 3D land, so its cost is counted rather than dodged.
        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          resolve({ lcp, cls, blocking, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0, domContentLoaded: nav?.domContentLoadedEventEnd ?? 0 });
        }, 6000);
      }),
  );

  const js = await initialJs(locale);
  rows.push({ locale, ...vitals, js: js.bytes, jsFiles: js.files });
  await context.close();
}

const lazy = await threeChunk('ar');
await browser.close();
server.close();

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
const ms = (n) => `${(n / 1000).toFixed(2)} s`;

console.log('Mid-range Android profile: 4x CPU throttle, 1.6 Mbps / 150 ms RTT, 390x844 @2x\n');
console.log('locale  LCP      CLS     TBT      initial JS (gz)   budget');
console.log('-'.repeat(70));
for (const r of rows) {
  console.log(
    `${r.locale.padEnd(7)} ${ms(r.lcp).padEnd(8)} ${r.cls.toFixed(3).padEnd(7)} ${`${Math.round(r.blocking)} ms`.padEnd(8)} ${kb(r.js).padEnd(17)} ` +
      `LCP<2.00s ${r.lcp < 2000 ? 'pass' : 'FAIL'}  CLS<0.05 ${r.cls < 0.05 ? 'pass' : 'FAIL'}  JS<100KB ${r.js < 102400 ? 'pass' : 'FAIL'}`,
  );
}
console.log(`\nLazy three.js chunk (excluded from the JS budget by §9): ${kb(lazy)}`);
