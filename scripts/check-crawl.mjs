/**
 * Crawl-path gate.
 *
 * Starts at the site root and follows internal links exactly as a crawler
 * would, then asserts two things the SEO brief requires and that nothing else
 * in the toolchain checks:
 *
 * 1. **Every indexable route is reachable within three clicks of `/`.** A page
 *    in the sitemap that no page links to is a page Google will crawl late,
 *    rank poorly and drop first.
 * 2. **Sitemap and reality agree.** Every URL the crawl finds is in the
 *    sitemap, and every URL the sitemap advertises is reachable and returns
 *    200. A sitemap entry pointing at a 404 is a trust signal spent for nothing.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/check-crawl.mjs http://localhost:3000
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';
const MAX_DEPTH = 3;

const findings = [];

/**
 * Normalise for comparison: drop the query, the hash and a trailing slash.
 *
 * `base` is the page the href was found on, not the origin. Resolving against
 * the origin turns every in-page anchor such as `#main` into `/`, which then
 * looks like a link to a root that is not in the sitemap.
 */
function normalise(href, base = ORIGIN) {
  if (href.startsWith('#')) return undefined;
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(ORIGIN).origin) return undefined;
    url.hash = '';
    url.search = '';
    const path = url.pathname.replace(/\/$/, '') || '/';
    return `${url.origin}${path}`;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------ read the sitemap */

const sitemapResponse = await fetch(`${ORIGIN}/sitemap.xml`);
if (!sitemapResponse.ok) {
  console.error(`check:crawl failed: /sitemap.xml returned ${sitemapResponse.status}`);
  process.exit(1);
}
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => normalise(match[1]))
    .filter(Boolean),
);

/* -------------------------------------------------------------- the crawl */

/** Where the crawl entered: `/` redirects, so start from what it redirects to. */
const rootResponse = await fetch(`${ORIGIN}/`, { redirect: 'manual' });
const rootTarget = normalise(rootResponse.headers.get('location') ?? '/');

const depths = new Map([[rootTarget, 0]]);
const queue = [rootTarget];
const visited = new Set();

while (queue.length > 0) {
  const url = queue.shift();
  if (visited.has(url)) continue;
  visited.add(url);

  const depth = depths.get(url) ?? 0;
  const response = await fetch(url);

  if (!response.ok) {
    findings.push({ rule: 'status', detail: `${url} returned ${response.status}` });
    continue;
  }
  if (depth >= MAX_DEPTH) continue;

  const root = parse(await response.text());
  for (const anchor of root.querySelectorAll('a[href]')) {
    const next = normalise(anchor.getAttribute('href'), url);
    if (!next || visited.has(next) || depths.has(next)) continue;
    depths.set(next, depth + 1);
    queue.push(next);
  }
}

/* ------------------------------------------------------------ reconcile */

for (const url of sitemapUrls) {
  if (!depths.has(url)) {
    findings.push({
      rule: 'unreachable',
      detail: `${url} is in the sitemap but not reachable within ${MAX_DEPTH} clicks of /`,
    });
  }
}

for (const [url, depth] of depths) {
  // The styleguide is deliberately excluded from the sitemap and from indexing;
  // it is not linked from any page either, so it should never appear here.
  if (url.includes('/styleguide')) {
    findings.push({
      rule: 'noindex-linked',
      detail: `${url} is linked from an indexable page`,
    });
    continue;
  }
  if (!sitemapUrls.has(url)) {
    findings.push({
      rule: 'missing-from-sitemap',
      detail: `${url} is reachable at depth ${depth} but absent from the sitemap`,
    });
  }
}

if (findings.length > 0) {
  console.error(`check:crawl found ${findings.length} problem(s):\n`);
  for (const finding of findings.slice(0, 25)) {
    console.error(`  [${finding.rule}] ${finding.detail}`);
  }
  if (findings.length > 25) console.error(`  ... and ${findings.length - 25} more`);
  process.exit(1);
}

const deepest = Math.max(...[...depths.values()]);
console.log(
  `check:crawl passed - ${sitemapUrls.size} sitemap URLs, all reachable, deepest at ${deepest} click(s) from /.`,
);
