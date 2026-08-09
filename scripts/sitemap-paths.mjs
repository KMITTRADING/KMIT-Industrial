/**
 * Read every page path out of the sitemap, following a sitemap index.
 *
 * `/sitemap.xml` is an index over one file per section rather than a flat list
 * of pages, so a gate that reads `<loc>` from it directly gets five sitemap
 * URLs and no pages at all. That failure is quiet in the worst way: the gate
 * still passes, having checked nothing.
 *
 * Shared by `check:dom` and `check:crawl` so the two cannot disagree about what
 * the sitemap contains, and so a future change to the sitemap shape is one edit
 * rather than a hunt through the scripts directory.
 */

/** Path only, so a configured canonical origin need not match the served one. */
export function pathOf(href) {
  try {
    return new URL(href).pathname.replace(/\/$/, '') || '/';
  } catch {
    return undefined;
  }
}

const LOC = /<loc>([^<]+)<\/loc>/g;

/**
 * Every page URL the sitemap advertises, as absolute URLs on `origin`.
 *
 * Handles both shapes: a `<sitemapindex>` is followed one level, a plain
 * `<urlset>` is read directly. One level is deliberate, since nesting an index
 * inside an index is not permitted by the sitemap protocol, and following it
 * anyway would turn a malformed sitemap into an unbounded fetch loop.
 */
export async function sitemapUrls(origin, label = 'gate') {
  const response = await fetch(`${origin}/sitemap.xml`);
  if (!response.ok) {
    console.error(`${label} failed: /sitemap.xml returned ${response.status}`);
    process.exit(1);
  }

  const xml = await response.text();
  const locs = [...xml.matchAll(LOC)].map((match) => match[1]);

  if (!xml.includes('<sitemapindex')) return locs;

  const urls = [];

  for (const sitemap of locs) {
    const path = pathOf(sitemap);
    if (!path) continue;

    const section = await fetch(`${origin}${path}`);
    if (!section.ok) {
      console.error(`${label} failed: ${path} returned ${section.status}`);
      process.exit(1);
    }

    const sectionXml = await section.text();
    if (sectionXml.includes('<sitemapindex')) {
      console.error(`${label} failed: ${path} is a nested index, which is not permitted.`);
      process.exit(1);
    }

    urls.push(...[...sectionXml.matchAll(LOC)].map((match) => match[1]));
  }

  if (urls.length === 0) {
    console.error(`${label} failed: the sitemap index listed no page URLs.`);
    process.exit(1);
  }

  return urls;
}
