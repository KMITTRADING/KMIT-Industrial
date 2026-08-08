/**
 * Rendered-output gate.
 *
 * `check:copy` reads string literals in `src/content`. That catches copy, and
 * it missed an en dash for four phases because the separator was built at
 * runtime by `formatRange` rather than written in a file. Anything assembled
 * from parts — a range, a template interpolation, a joined list — is invisible
 * to a source scan and visible here.
 *
 * Three checks over the served HTML of every route:
 *
 * 1. **No em dash or en dash in visible text or in metadata.** Same rule as
 *    check:copy, applied where the reader actually meets it. Script and style
 *    contents are skipped; a dash inside minified JavaScript is not copy.
 * 2. **Exactly one canonical, and it matches the requested URL.** A canonical
 *    pointing at another document is the single most damaging metadata defect
 *    on a bilingual site.
 * 3. **A complete, reciprocal hreflang cluster.** Every page must declare both
 *    locales and `x-default`, and the URL it advertises for its own locale must
 *    be its own canonical.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/check-dom.mjs http://localhost:3000
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

const PATHS = [
  '',
  '/products',
  '/products/gcc-1250',
  '/applications',
  '/applications/plastics-masterbatch',
  '/guides',
  '/guides/grade-selection',
  '/guides/coated-vs-uncoated',
  '/guides/gcc-vs-pcc',
  '/sustainability-and-facility',
  '/resources',
  '/contact',
  '/rfq',
];

const LOCALES = ['ar', 'en'];
const EXPECTED_HREFLANG = ['ar-SA', 'en', 'x-default'];

const BANNED_DASH = /[—–]/;

const findings = [];
const report = (route, rule, detail) => findings.push({ route, rule, detail });

/** Visible text, with script and style subtrees removed. */
function visibleText(root) {
  for (const node of root.querySelectorAll('script, style')) node.remove();
  return (root.text ?? '').replace(/\s+/g, ' ');
}

for (const locale of LOCALES) {
  for (const path of PATHS) {
    const route = `/${locale}${path}`;
    const url = `${ORIGIN}${route}`;
    const response = await fetch(url);

    if (!response.ok) {
      report(route, 'status', `expected 200, got ${response.status}`);
      continue;
    }

    const html = await response.text();
    const root = parse(html);

    /* ------------------------------------------------------- canonical */

    const canonicals = root.querySelectorAll('link[rel="canonical"]');
    if (canonicals.length !== 1) {
      report(route, 'canonical', `${canonicals.length} canonical links, expected 1`);
    } else {
      const href = canonicals[0].getAttribute('href');
      if (href !== url) {
        report(route, 'canonical', `points at ${href}, expected ${url}`);
      }
    }

    /* -------------------------------------------------------- hreflang */

    const alternates = new Map();
    for (const link of root.querySelectorAll('link[rel="alternate"]')) {
      const lang = link.getAttribute('hreflang') ?? link.getAttribute('hrefLang');
      if (lang) alternates.set(lang, link.getAttribute('href'));
    }

    for (const expected of EXPECTED_HREFLANG) {
      if (!alternates.has(expected)) {
        report(route, 'hreflang', `missing hreflang="${expected}"`);
      }
    }

    const selfLang = locale === 'ar' ? 'ar-SA' : 'en';
    if (alternates.has(selfLang) && alternates.get(selfLang) !== url) {
      report(
        route,
        'hreflang',
        `self-reference for ${selfLang} is ${alternates.get(selfLang)}, expected ${url}`,
      );
    }

    /* ------------------------------------------------------------ dash */

    const head = root.querySelector('head');
    const meta = head
      ? head
          .querySelectorAll('meta[name="description"], meta[property="og:description"], title')
          .map((node) => node.getAttribute('content') ?? node.text ?? '')
          .join(' ')
      : '';

    const body = root.querySelector('body');
    const text = body ? visibleText(body) : '';

    for (const [where, value] of [
      ['metadata', meta],
      ['body', text],
    ]) {
      const match = value.match(new RegExp(`.{0,40}${BANNED_DASH.source}.{0,40}`));
      if (match) {
        report(route, 'dash', `em or en dash in ${where}: "${match[0].trim()}"`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error(`check:dom found ${findings.length} problem(s):\n`);
  const grouped = new Map();
  for (const finding of findings) {
    if (!grouped.has(finding.rule)) grouped.set(finding.rule, []);
    grouped.get(finding.rule).push(finding);
  }
  for (const [rule, entries] of grouped) {
    console.error(`  [${rule}] ${entries.length}`);
    for (const entry of entries.slice(0, 8)) {
      console.error(`      ${entry.route}: ${entry.detail}`);
    }
    if (entries.length > 8) console.error(`      ... and ${entries.length - 8} more`);
  }
  process.exit(1);
}

console.log(
  `check:dom passed - ${LOCALES.length * PATHS.length} routes, canonical, hreflang and dash checks clean.`,
);
