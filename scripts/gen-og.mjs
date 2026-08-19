/**
 * Two Open Graph cards, one per locale.
 *
 * Rendered in the real browser with the real fonts and the real tokens rather
 * than composed in an image library, so the card cannot drift away from the
 * site it represents. The eighteen cards this replaces described pages that no
 * longer exist.
 *
 *   node scripts/gen-og.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'public', 'og');

const CARDS = {
  ar: { dir: 'rtl', words: ['مواد.', 'معادن.', 'طاقة.'], eyebrow: 'جدة، المملكة العربية السعودية', name: 'شركة حلول كميت للصناعة' },
  en: { dir: 'ltr', words: ['Materials.', 'Minerals.', 'Energy.'], eyebrow: 'Jeddah, Saudi Arabia', name: 'KMIT Industrial Solutions' },
};

const [arabicFont, latinFont, logo] = await Promise.all([
  readFile(join(ROOT, 'public/fonts/alexandria-arabic-var.woff2')).then((b) => b.toString('base64')),
  readFile(join(ROOT, 'public/fonts/alexandria-latin-var.woff2')).then((b) => b.toString('base64')),
  readFile(join(ROOT, 'public/brand/logo.svg')).then((b) => b.toString('base64')),
]);

const page = (locale) => {
  const card = CARDS[locale];
  const [a, b, c] = card.words;
  return `<!doctype html><html dir="${card.dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:Alexandria;font-weight:200 700;src:url(data:font/woff2;base64,${arabicFont}) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFC;}
@font-face{font-family:Alexandria;font-weight:200 700;src:url(data:font/woff2;base64,${latinFont}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F;}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#fff;font-family:Alexandria,sans-serif;
 padding:76px 84px;display:flex;flex-direction:column;justify-content:space-between}
.eyebrow{font-size:19px;font-weight:500;color:#2B3073;letter-spacing:${card.dir === 'rtl' ? '0' : '.15em'};text-transform:uppercase}
.words{font-size:94px;font-weight:600;line-height:${card.dir === 'rtl' ? '1.34' : '1.06'};letter-spacing:${card.dir === 'rtl' ? '0' : '-.035em'};color:#12141C}
.g{background-image:linear-gradient(${card.dir === 'rtl' ? '260deg' : '100deg'},#2B3073 8%,#3D55A4 92%);
 -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;display:inline-block}
.rule{display:flex;flex-direction:column;gap:3px}
.rule i{display:block;height:1px;background:#E2E3E8}
.rule i:nth-child(2){height:2px;width:58%;background:#B9BECF}
.rule i:nth-child(3){width:31%}
.foot{display:flex;align-items:flex-end;justify-content:space-between;gap:32px}
img{height:34px}
.name{font-size:19px;font-weight:400;color:#565B6D}
</style></head><body>
<div><div class="eyebrow">${card.eyebrow}</div>
<div class="words" style="margin-top:34px">${a}<br>${b}<br><span class="g">${c}</span></div></div>
<div><div class="rule"><i></i><i></i><i></i></div>
<div class="foot" style="margin-top:28px"><img src="data:image/svg+xml;base64,${logo}"><div class="name">${card.name}</div></div></div>
</body></html>`;
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

for (const locale of Object.keys(CARDS)) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const tab = await context.newPage();
  await tab.setContent(page(locale), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const shot = await tab.screenshot({ type: 'png' });
  await writeFile(join(OUT, `${locale}.png`), shot);
  console.log(`public/og/${locale}.png  ${(shot.length / 1024).toFixed(0)} KB`);
  await context.close();
}
await browser.close();
