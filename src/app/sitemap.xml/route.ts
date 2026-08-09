import { SITEMAP_SECTIONS } from '@/lib/routes';
import { XML_HEADERS, sitemapIndexXml } from '@/lib/sitemap-xml';

/**
 * /sitemap.xml
 *
 * A sitemap index rather than a list of pages. The pages live in one file per
 * section under `/sitemap/`, which is what makes per-section index coverage
 * visible in Search Console; see `SITEMAP_SECTIONS` for why that matters.
 *
 * The address is unchanged, so anything already pointing at `/sitemap.xml`
 * (robots.txt, a submitted property, a crawler's memory) keeps working and
 * follows one extra hop.
 */

export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(sitemapIndexXml(SITEMAP_SECTIONS, new Date()), {
    headers: XML_HEADERS,
  });
}
