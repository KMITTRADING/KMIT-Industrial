/**
 * Performance budget gate.
 *
 * Asserts a ceiling on what the site *ships*, not on what a shared CI runner
 * happens to score. Lighthouse's Performance number on a noisy runner swings by
 * ten points between identical runs of the same build, which makes it useless
 * as a merge gate: it would either block good work at random or be set so loose
 * it blocks nothing.
 *
 * These four are deterministic. They come from the served bytes rather than
 * from a simulated timeline, so a failure means somebody added weight, every
 * time, and a pass means they did not.
 *
 * Usage:
 *   npm run build && npx next start -p 3310 &
 *   node scripts/check-budget.mjs http://localhost:3310
 */

import process from 'node:process';
import { gzipSync } from 'node:zlib';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

/**
 * Headroom over the current measured values, so ordinary work does not trip the
 * gate and a structural regression does. Tighten these when a phase improves
 * them; that is the point.
 */
const BUDGET = {
  /** Compressed document, per route. */
  documentKb: 40,
  /** Distinct script requests on a route. */
  scriptRequests: 14,
  /** Total uncompressed script bytes referenced by the document. */
  scriptKb: 1000,
};

/**
 * Message namespaces that must never appear in a content page's payload.
 *
 * These are the heavy ones, and shipping them to the browser is the regression
 * this project has actually had. Each name is distinctive enough that finding
 * it in the served HTML of the home page means the client message scope has
 * been widened, whether deliberately or by a stray `useTranslations`.
 */
const FORBIDDEN_ON_CONTENT_PAGES = ['rfqForm', 'gradeFaqs', 'sectorFaqs', 'sectorProblems'];

const ROUTES = ['/ar', '/en', '/ar/products/gcc-1250', '/ar/applications/oil-gas-drilling'];

const findings = [];
const rows = [];

for (const route of ROUTES) {
  const response = await fetch(`${ORIGIN}${route}`);
  if (!response.ok) {
    findings.push(`${route} returned ${response.status}`);
    continue;
  }

  const html = await response.text();
  const documentKb = Math.round(gzipSync(Buffer.from(html)).length / 102.4) / 10;

  const root = parse(html);
  const scripts = root
    .querySelectorAll('script[src]')
    .map((node) => node.getAttribute('src'))
    .filter((src) => src?.startsWith('/_next/'));

  let scriptBytes = 0;
  for (const src of new Set(scripts)) {
    const asset = await fetch(`${ORIGIN}${src}`);
    scriptBytes +=
      Number(asset.headers.get('content-length') ?? 0) || (await asset.text()).length;
  }
  const scriptKb = Math.round(scriptBytes / 1024);

  rows.push({ route, documentKb, scriptRequests: new Set(scripts).size, scriptKb });

  if (documentKb > BUDGET.documentKb) {
    findings.push(
      `${route}: document ${documentKb} KB gzipped, budget ${BUDGET.documentKb} KB`,
    );
  }
  if (new Set(scripts).size > BUDGET.scriptRequests) {
    findings.push(
      `${route}: ${new Set(scripts).size} script requests, budget ${BUDGET.scriptRequests}`,
    );
  }
  if (scriptKb > BUDGET.scriptKb) {
    findings.push(`${route}: ${scriptKb} KB of script, budget ${BUDGET.scriptKb} KB`);
  }
}

/*
 * The message payload is the regression this project has actually had. Byte
 * budgets alone would not catch a namespace creeping back in, so name them.
 */
const home = await (await fetch(`${ORIGIN}/ar`)).text();
for (const namespace of FORBIDDEN_ON_CONTENT_PAGES) {
  if (home.includes(namespace)) {
    findings.push(
      `/ar serialises the "${namespace}" namespace, which no client component on a content page reads`,
    );
  }
}

for (const row of rows) {
  console.log(
    `  ${row.route.padEnd(34)} doc ${String(row.documentKb).padStart(5)} KB  ` +
      `scripts ${String(row.scriptRequests).padStart(2)} / ${String(row.scriptKb).padStart(4)} KB`,
  );
}

if (findings.length > 0) {
  console.error(`\ncheck:budget exceeded on ${findings.length} count(s):\n`);
  for (const finding of findings) console.error(`  ${finding}`);
  console.error('\nEither justify the weight and raise the budget, or take it back out.');
  process.exit(1);
}

console.log(`\ncheck:budget passed - ${ROUTES.length} routes within budget.`);
