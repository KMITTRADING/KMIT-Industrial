/**
 * Audits the *built* HTML, not the source, against §15.1. Run after `npm run build`.
 *
 * What it verifies, page by page and language by language:
 *  - every page exists as prerendered static HTML (no client-rendered route)
 *  - exactly one <h1>, and no heading level is skipped
 *  - canonical is the page's own per-language URL, never shared between languages
 *  - hreflang is reciprocal: ar-SA, en and x-default all present and pointing correctly
 *  - title and description are present, unique across the site, within length
 *  - JSON-LD carries Organization, WebSite and BreadcrumbList, and carries no
 *    Product, Review or AggregateRating
 *  - FAQPage appears only on the knowledge page, and every question it declares is
 *    actually rendered in the page body
 *  - the visible copy is in the HTML source: a sample of body text per page
 *  - no <canvas> appears before the <h1> in source order, so the LCP candidate is text
 *
 * Run: npm run check:seo
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APP = '.next/server/app';

if (!existsSync(APP)) {
  console.error('No build output found. Run `npm run build` first.');
  process.exit(1);
}

const ROUTES = [
  '',
  'about',
  'sectors',
  'sectors/industrial-minerals',
  'sectors/marble-transport',
  'sectors/solar-panels',
  'calcium-carbonate',
  'quality-hse',
  'sustainability',
];
const LOCALES = ['ar', 'en'];

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`PASS  ${msg}`);

function htmlPathFor(locale, route) {
  const rel = route ? `${locale}/${route}.html` : `${locale}.html`;
  const p = join(APP, rel);
  return existsSync(p) ? p : null;
}

const titles = new Map();
const descriptions = new Map();

/**
 * Reads an attribute out of a serialised tag, case-insensitively. React writes
 * some attributes in camelCase (`hrefLang`), and HTML attribute names are
 * case-insensitive, so matching must be too.
 */
function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return m ? m[1] : null;
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const label = `${locale}/${route || '(home)'}`;
    const file = htmlPathFor(locale, route);
    if (!file) {
      fail(`${label}: no prerendered HTML found — route is not static`);
      continue;
    }
    const html = readFileSync(file, 'utf8');

    /* ---------------------------------------------------------- headings --- */
    const h1s = [...html.matchAll(/<h1[\s>]/g)];
    if (h1s.length !== 1) fail(`${label}: found ${h1s.length} <h1>, expected exactly 1`);

    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    let previous = 0;
    let skipped = null;
    for (const level of levels) {
      if (previous && level > previous + 1) skipped = `h${previous} -> h${level}`;
      previous = level;
    }
    if (skipped) fail(`${label}: heading level skipped (${skipped})`);

    /* ------------------------------------------------------------- title --- */
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? decode(titleMatch[1]) : null;
    if (!title) fail(`${label}: no <title>`);
    else {
      if (title.length > 60) fail(`${label}: title ${title.length} chars > 60`);
      if (titles.has(title)) fail(`${label}: title duplicated with ${titles.get(title)}`);
      titles.set(title, label);
    }

    const descTag = html.match(/<meta name="description"[^>]*>/i);
    const description = descTag ? decode(attr(descTag[0], 'content') ?? '') : null;
    if (!description) fail(`${label}: no meta description`);
    else {
      if (description.length > 155) fail(`${label}: description ${description.length} chars > 155`);
      if (descriptions.has(description)) {
        fail(`${label}: description duplicated with ${descriptions.get(description)}`);
      }
      descriptions.set(description, label);
    }

    /* --------------------------------------------------------- canonical --- */
    const canonTag = html.match(/<link rel="canonical"[^>]*>/i);
    const canonical = canonTag ? attr(canonTag[0], 'href') : null;
    const expectedPath = route ? `/${locale}/${route}` : `/${locale}`;
    if (!canonical) fail(`${label}: no canonical`);
    else if (!canonical.endsWith(expectedPath)) {
      fail(`${label}: canonical is ${canonical}, expected to end with ${expectedPath}`);
    }

    /* ---------------------------------------------------------- hreflang --- */
    const alternates = [...html.matchAll(/<link rel="alternate"[^>]*>/gi)].map((m) => ({
      lang: attr(m[0], 'hreflang'),
      href: attr(m[0], 'href'),
    }));
    const byLang = Object.fromEntries(
      alternates.filter((a) => a.lang).map((a) => [a.lang, a.href])
    );
    for (const required of ['ar-SA', 'en', 'x-default']) {
      if (!byLang[required]) fail(`${label}: missing hreflang="${required}"`);
    }
    if (byLang['ar-SA'] && !byLang['ar-SA'].endsWith(route ? `/ar/${route}` : '/ar')) {
      fail(`${label}: ar-SA alternate points at ${byLang['ar-SA']}`);
    }
    if (byLang['en'] && !byLang['en'].endsWith(route ? `/en/${route}` : '/en')) {
      fail(`${label}: en alternate points at ${byLang['en']}`);
    }
    if (byLang['x-default'] && byLang['x-default'] !== byLang['ar-SA']) {
      fail(`${label}: x-default should equal the ar-SA URL (Arabic is the default)`);
    }

    /* ----------------------------------------------------------- JSON-LD --- */
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
      (m) => m[1]
    );
    if (blocks.length === 0) fail(`${label}: no JSON-LD`);
    const joined = blocks.join('');
    for (const type of ['Organization', 'WebSite', 'BreadcrumbList']) {
      if (!joined.includes(`"${type}"`)) fail(`${label}: JSON-LD missing ${type}`);
    }
    for (const banned of ['AggregateRating', 'Review', '"Product"']) {
      if (joined.includes(banned)) fail(`${label}: JSON-LD contains banned type ${banned}`);
    }
    for (const block of blocks) {
      try {
        JSON.parse(block.replace(/\\u003c/g, '<'));
      } catch {
        fail(`${label}: JSON-LD is not valid JSON`);
      }
    }

    /* ------------------------------------------- FAQPage only where real --- */
    const hasFaqSchema = joined.includes('"FAQPage"');
    if (route === 'calcium-carbonate') {
      if (!hasFaqSchema) fail(`${label}: knowledge page should emit FAQPage`);
      else {
        // Every declared question must be rendered in the body (§15.1.4).
        const parsed = blocks
          .map((b) => {
            try {
              return JSON.parse(b.replace(/\\u003c/g, '<'));
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        const faq = parsed
          .flatMap((doc) => doc['@graph'] ?? [doc])
          .find((node) => node['@type'] === 'FAQPage');
        const questions = faq?.mainEntity?.map((q) => q.name) ?? [];
        if (questions.length === 0) fail(`${label}: FAQPage has no questions`);
        const body = html.replace(/<[^>]+>/g, ' ');
        for (const q of questions) {
          if (!body.includes(q)) {
            fail(`${label}: FAQPage question not rendered on the page: "${q.slice(0, 40)}…"`);
          }
        }
      }
    } else if (hasFaqSchema) {
      fail(`${label}: FAQPage emitted on a page without visible Q&A`);
    }

    /* --------------------------------------- LCP candidate must be text --- */
    const h1Index = html.search(/<h1[\s>]/);
    const canvasIndex = html.search(/<canvas[\s>]/);
    if (canvasIndex !== -1 && h1Index !== -1 && canvasIndex < h1Index) {
      fail(`${label}: a <canvas> precedes the <h1> in source order`);
    }

    /* ------------------------------------------- body copy is in source --- */
    const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
    const arabicRun = /[؀-ۿ]{3,}/.test(text);
    const latinRun = /[A-Za-z]{4,}\s+[A-Za-z]{4,}/.test(text);
    if (locale === 'ar' && !arabicRun) fail(`${label}: no Arabic body copy in the HTML source`);
    if (locale === 'en' && !latinRun) fail(`${label}: no English body copy in the HTML source`);

    /* ------------------------------------------------- lang and dir set --- */
    const htmlTag = html.match(/<html[^>]*>/)?.[0] ?? '';
    if (!htmlTag.includes(`lang="${locale}"`)) fail(`${label}: <html lang> is not ${locale}`);
    const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
    if (!htmlTag.includes(`dir="${expectedDir}"`)) fail(`${label}: <html dir> is not ${expectedDir}`);
  }
}

/* ------------------------------------------------ sitemap and robots ------ */
{
  const staticDir = join(APP, '..', '..', 'static');
  void staticDir;
  const sitemapCandidates = ['sitemap.xml.body', 'sitemap.xml.html', 'sitemap/route.js'];
  const found = readdirSync(APP).filter((f) => f.startsWith('sitemap'));
  if (found.length === 0 && !sitemapCandidates.some((c) => existsSync(join(APP, c)))) {
    fail('no sitemap output in the build');
  } else {
    pass(`sitemap present in build output (${found.join(', ') || 'route handler'})`);
  }
  const robots = readdirSync(APP).filter((f) => f.startsWith('robots'));
  if (robots.length === 0) fail('no robots output in the build');
  else pass(`robots present in build output (${robots.join(', ')})`);
}

/* ------------------------------------------------------------- llms.txt --- */
if (!existsSync('public/llms.txt')) fail('public/llms.txt missing (§15.1.6)');
else pass('llms.txt present');

/* ------------------------------------------------------------ OG images --- */
{
  let missing = 0;
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const slug = route === '' ? 'home' : route.replace(/\//g, '-');
      if (!existsSync(join('public/og', locale, `${slug}.png`))) {
        fail(`og card missing: public/og/${locale}/${slug}.png`);
        missing++;
      }
    }
  }
  if (missing === 0) pass(`all ${LOCALES.length * ROUTES.length} Open Graph cards present`);
}

console.log('');
if (failures === 0) {
  pass(`${LOCALES.length * ROUTES.length} pages audited, no SEO failures.`);
} else {
  console.error(`${failures} SEO failure(s).`);
  process.exit(1);
}
