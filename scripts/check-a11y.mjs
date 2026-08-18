/**
 * Runs axe-core over every page in both languages (§15: WCAG 2.1 AA).
 *
 * axe-core is the engine Lighthouse's accessibility category is built on, so a
 * clean run here is the same evidence Lighthouse reports — but per rule, per
 * element and per page, rather than as one number with nothing actionable in it.
 *
 * Usage: node scripts/check-a11y.mjs [baseUrl]   (default http://localhost:3000)
 */

import { existsSync, globSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.argv[2] ?? 'http://localhost:3000';

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

function chromiumPath() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  return globSync(join(root, 'chromium-*/chrome-linux/chrome'))[0];
}

const executablePath = chromiumPath();
const browser = await chromium.launch(executablePath ? { executablePath } : {});

let violations = 0;
let checked = 0;
const seen = new Map();

for (const locale of LOCALES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of ROUTES) {
    const label = `${locale}/${route || '(home)'}`;
    await page.goto(`${BASE}/${locale}${route ? `/${route}` : ''}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await page.addScriptTag({ content: AXE_SOURCE });
    const result = await page.evaluate(async () =>
      // WCAG 2.1 A and AA only — the level the brief sets (§15).
      // @ts-expect-error injected at runtime
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      })
    );
    checked += 1;

    for (const v of result.violations) {
      violations += 1;
      const key = `${v.id}`;
      if (!seen.has(key)) seen.set(key, { impact: v.impact, help: v.help, where: [] });
      seen.get(key).where.push(`${label}: ${v.nodes[0]?.target?.join(' ') ?? '?'}`);
      console.error(
        `FAIL  ${label}  [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`
      );
      for (const node of v.nodes.slice(0, 3)) {
        console.error(`        ${node.target.join(' ')}`);
        console.error(`        ${node.failureSummary?.split('\n').slice(0, 2).join(' ') ?? ''}`);
      }
    }
  }

  await context.close();
}

await browser.close();

console.log('');
if (violations === 0) {
  console.log(`PASS  ${checked} pages, zero WCAG 2.1 A/AA violations (axe-core).`);
} else {
  console.error(`${violations} violation instance(s) across ${seen.size} rule(s):`);
  for (const [id, info] of seen) {
    console.error(`  ${id} [${info.impact}] — ${info.where.length} page(s)`);
  }
  process.exit(1);
}
