/**
 * Structured-data gate.
 *
 * Google's Rich Results Test needs a publicly reachable URL, which a preview
 * build on a private host is not. This checks the same things it checks, on the
 * served HTML, so the requirements are verified on every build rather than once
 * by hand against a screenshot:
 *
 * - exactly one `application/ld+json` block per page, parsing as JSON;
 * - one `@graph`, with `Organization` and `WebSite` on every page;
 * - required properties present per type, per Google's documented requirements;
 * - `@id` references resolve to a node in the same graph;
 * - `FAQPage` questions match the questions rendered in the document, which is
 *   the mismatch Google issues manual actions for;
 * - no `Offer` without a price, and no empty or null-valued property.
 *
 * Run the official test against the deploy preview as well. This gate catches
 * the structural faults; only Google can tell you what it will actually show.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/check-schema.mjs http://localhost:3000
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

/** Route, and the node types its graph must contain beyond the two globals. */
const EXPECTED = [
  ['/ar', []],
  ['/en', []],
  ['/ar/products', ['BreadcrumbList', 'ItemList']],
  ['/en/products', ['BreadcrumbList', 'ItemList']],
  ['/ar/products/gcc-1250', ['BreadcrumbList', 'Product', 'FAQPage']],
  ['/en/products/gcc-2500', ['BreadcrumbList', 'Product', 'FAQPage']],
  ['/ar/applications', ['BreadcrumbList', 'ItemList']],
  ['/en/applications/oil-gas-drilling', ['BreadcrumbList', 'FAQPage', 'ItemList']],
  ['/ar/guides', ['BreadcrumbList', 'ItemList']],
  ['/en/guides/gcc-vs-pcc', ['BreadcrumbList']],
  ['/ar/contact', ['BreadcrumbList']],
];

/** Google's required properties, by type. */
const REQUIRED = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  Product: ['name', 'description'],
  ItemList: ['itemListElement'],
  FAQPage: ['mainEntity'],
};

const findings = [];
const report = (route, rule, detail) => findings.push({ route, rule, detail });

/** Every `@id` string referenced anywhere in the graph. */
function references(value, found = new Set()) {
  if (Array.isArray(value)) {
    for (const entry of value) references(entry, found);
  } else if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === '@id') found.add(value['@id']);
    else for (const entry of Object.values(value)) references(entry, found);
  }
  return found;
}

/** Any null or empty-string value, which is a validator warning everywhere. */
function emptyValues(value, path = '', found = []) {
  if (value === null || value === '') found.push(path);
  else if (Array.isArray(value))
    value.forEach((entry, i) => emptyValues(entry, `${path}[${i}]`, found));
  else if (typeof value === 'object') {
    for (const [key, entry] of Object.entries(value))
      emptyValues(entry, path ? `${path}.${key}` : key, found);
  }
  return found;
}

for (const [route, extraTypes] of EXPECTED) {
  const response = await fetch(`${ORIGIN}${route}`);
  if (!response.ok) {
    report(route, 'status', `returned ${response.status}`);
    continue;
  }

  const root = parse(await response.text());
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');

  if (scripts.length !== 1) {
    report(route, 'block', `${scripts.length} ld+json blocks, expected 1`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(scripts[0].textContent.replace(/\\u003c/g, '<'));
  } catch (error) {
    report(route, 'parse', String(error));
    continue;
  }

  if (!Array.isArray(data['@graph'])) {
    report(route, 'graph', 'no @graph array');
    continue;
  }

  const graph = data['@graph'];
  const types = graph.map((node) => node['@type']);

  for (const expected of ['Organization', 'WebSite', ...extraTypes]) {
    if (!types.includes(expected)) {
      report(
        route,
        'missing-type',
        `expected a ${expected} node, graph has ${types.join(', ')}`,
      );
    }
  }

  for (const node of graph) {
    const type = node['@type'];
    for (const property of REQUIRED[type] ?? []) {
      if (node[property] === undefined) {
        report(route, 'required', `${type} is missing ${property}`);
      }
    }
    if (type === 'Product' && node.offers) {
      const offers = Array.isArray(node.offers) ? node.offers : [node.offers];
      for (const offer of offers) {
        if (offer.price === undefined) report(route, 'offer', 'Offer without a price');
      }
    }
  }

  /* ---------------------------------------------------- id resolution */

  const ids = new Set(graph.map((node) => node['@id']).filter(Boolean));
  for (const reference of references(graph)) {
    if (!ids.has(reference)) {
      report(route, 'dangling-id', `${reference} is referenced but not defined in the graph`);
    }
  }

  /* ------------------------------------------------------ empty values */

  for (const path of emptyValues(graph)) {
    report(route, 'empty', `null or empty value at ${path}`);
  }

  /* ---------------------------------------------------- faq mirroring */

  const faq = graph.find((node) => node['@type'] === 'FAQPage');
  if (faq) {
    const body = root.querySelector('body');
    const text = (body?.text ?? '').replace(/\s+/g, ' ');
    for (const question of faq.mainEntity) {
      const name = question.name?.replace(/\s+/g, ' ') ?? '';
      if (!text.includes(name)) {
        report(
          route,
          'faq-mismatch',
          `question not visible on the page: "${name.slice(0, 60)}"`,
        );
      }
      const answer = question.acceptedAnswer?.text?.replace(/\s+/g, ' ') ?? '';
      if (!text.includes(answer)) {
        report(
          route,
          'faq-mismatch',
          `answer not visible on the page for "${name.slice(0, 40)}"`,
        );
      }
    }
  }
}

if (findings.length > 0) {
  console.error(`check:schema found ${findings.length} problem(s):\n`);
  for (const finding of findings.slice(0, 25)) {
    console.error(`  [${finding.rule}] ${finding.route}: ${finding.detail}`);
  }
  if (findings.length > 25) console.error(`  ... and ${findings.length - 25} more`);
  process.exit(1);
}

console.log(
  `check:schema passed - ${EXPECTED.length} routes, required properties, @id resolution and FAQ mirroring clean.`,
);
