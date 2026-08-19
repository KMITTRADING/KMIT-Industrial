/**
 * Asserts the three motion states the brief requires, in a real browser:
 * default, prefers-reduced-motion, and JavaScript disabled.
 *
 * The thing being checked is not "does it animate" but "is anything ever
 * invisible when it should not be" — the failure mode of scroll reveals is a
 * blank page, and it only appears in exactly the conditions nobody tests in.
 *
 *   node scripts/check-motion.mjs
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const OUT = new URL('../out/', import.meta.url).pathname;
const TYPES = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2' };

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

const failures = [];

/** Every element that carries copy must be readable — opacity above 0.99. */
async function assertNothingHidden(page, label) {
  const hidden = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('[data-reveal], [data-strata-step]')) {
      const opacity = Number(getComputedStyle(el).opacity);
      if (opacity < 0.99) out.push({ tag: el.tagName, cls: el.className.toString().slice(0, 40), opacity });
    }
    return out;
  });
  if (hidden.length) {
    failures.push(`${label}: ${hidden.length} element(s) below full opacity — e.g. ${hidden[0].tag}.${hidden[0].cls} @ ${hidden[0].opacity}`);
  }
  console.log(`${label.padEnd(34)} ${hidden.length ? `FAIL ${hidden.length} hidden` : 'ok — all content visible'}`);
}

for (const locale of ['ar', 'en']) {
  // 1. Reduced motion: nothing should ever be hidden, at any scroll position.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    const flag = await page.evaluate(() => document.documentElement.dataset.motion ?? '(unset)');
    if (flag !== '(unset)') failures.push(`${locale} reduced-motion: data-motion was set to "${flag}"`);
    await assertNothingHidden(page, `${locale} reduced-motion`);
    await ctx.close();
  }

  // 2. No JavaScript at all.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${base}/${locale}`, { waitUntil: 'load' });
    await assertNothingHidden(page, `${locale} no-JS`);
    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').length);
    if (text < 1200) failures.push(`${locale} no-JS: only ${text} characters of text rendered`);
    console.log(`${`${locale} no-JS text length`.padEnd(34)} ${text} chars`);
    await ctx.close();
  }

  // 3. Motion on: the flag is set, and scrolling to the end leaves the last
  //    signature step visible rather than stranding all four at zero.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    const flag = await page.evaluate(() => document.documentElement.dataset.motion);
    if (flag !== 'on') failures.push(`${locale} default: data-motion is "${flag}", expected "on"`);

    await page.evaluate(() => {
      const t = document.querySelector('[data-strata-track]');
      window.scrollTo(0, t.offsetTop + t.offsetHeight - window.innerHeight * 0.5);
    });
    await page.waitForTimeout(700);
    const active = await page.evaluate(() =>
      [...document.querySelectorAll('[data-strata-step]')].map((s) => s.dataset.active),
    );
    const activeCount = active.filter((a) => a === 'true').length;
    if (activeCount !== 1) failures.push(`${locale} signature scroll: ${activeCount} active steps, expected exactly 1`);
    console.log(`${`${locale} signature scroll`.padEnd(34)} ${activeCount} active step (${active.join(',')})`);
    await ctx.close();
  }
}

await browser.close();
server.close();

if (failures.length) {
  console.log(`\n${failures.length} failures:`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log('\nAll motion states pass.');
