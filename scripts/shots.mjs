/**
 * Screenshots the built site across the widths and locales §12 asks for.
 *
 * Serves out/ over http rather than file:// — file:// breaks absolute asset
 * paths and gives a false picture of the fonts.
 *
 *   node scripts/shots.mjs [--widths 1440,430] [--mode reduced|nojs]
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const OUT = new URL('../out/', import.meta.url).pathname;
const SHOTS = process.env.SHOT_DIR ?? '/tmp/shots';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const WIDTHS = arg('widths', '2560,1440,1024,768,430,360').split(',').map(Number);
const LOCALES = arg('locales', 'ar,en').split(',');
const MODE = arg('mode', 'default');

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

const server = createServer(async (req, res) => {
  const url = (req.url ?? '/').split('?')[0];
  for (const candidate of [url, `${url}.html`, join(url, 'index.html')]) {
    try {
      const body = await readFile(join(OUT, candidate));
      res.writeHead(200, { 'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream' });
      return res.end(body);
    } catch {}
  }
  res.writeHead(404).end('not found');
});

await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

/*
 * The image ships Chromium at a fixed build under PLAYWRIGHT_BROWSERS_PATH,
 * which will not always match the build the installed playwright package
 * expects. Pointing at the binary that exists is correct here; re-downloading
 * a second copy to satisfy a version string is not.
 */
const executablePath =
  process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath });
await mkdir(SHOTS, { recursive: true });

for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      // Phones are portrait. A landscape viewport at 430px shows a 267px
      // strip and hides every problem worth finding.
      viewport: { width, height: width <= 500 ? Math.round(width * 2.05) : Math.round(width * 0.62) },
      deviceScaleFactor: 1,
      javaScriptEnabled: MODE !== 'nojs',
      reducedMotion: MODE === 'reduced' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));

    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // The single most common RTL regression is a wide child pushing the
    // document sideways, so it is asserted on every shot rather than eyeballed.
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    const bleeds = overflow.scrollW > overflow.clientW + 1;

    const name = `${locale}-${width}${MODE === 'default' ? '' : `-${MODE}`}`;
    await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: false });
    console.log(
      `${name.padEnd(22)} ${bleeds ? `OVERFLOW ${overflow.scrollW}>${overflow.clientW}` : 'ok'}` +
        (problems.length ? `  ${problems.length} js problems: ${problems[0]}` : ''),
    );
    await context.close();
  }
}

await browser.close();
server.close();
