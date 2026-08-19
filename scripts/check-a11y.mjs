/**
 * axe-core against both built documents, at a desktop and a phone width.
 *
 * Run against the real built HTML in a real browser, because the failures that
 * matter here — contrast against a gradient, a control below 44px, an anchor
 * with no accessible name — only exist once the CSS has applied.
 *
 *   node scripts/check-a11y.mjs
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const axeSource = await readFile(axePath, 'utf8');

const OUT = new URL('../out/', import.meta.url).pathname;
const TYPES = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png' };

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

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

let violations = 0;

for (const locale of ['ar', 'en']) {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ content: axeSource });

    const results = await page.evaluate(async () =>
      // wcag2a/aa plus best-practice: the brief's bar is AA, and the
      // best-practice rules catch landmark and heading-order mistakes that AA
      // does not but a screen reader user feels immediately.
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      }),
    );

    const found = results.violations;
    violations += found.length;
    console.log(`${`${locale} ${label}`.padEnd(14)} ${found.length ? `${found.length} violations` : 'clean'}`);
    for (const v of found) {
      console.log(`   [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 2)) console.log(`      ${node.target.join(' ')}`);
    }
    await context.close();
  }
}

await browser.close();
server.close();
console.log(`\n${violations} total violations.`);
process.exit(violations ? 1 : 0);
