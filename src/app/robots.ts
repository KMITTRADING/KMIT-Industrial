import { NOINDEX_PATHS, SITEMAP_SECTIONS } from '@/lib/routes';
import { absoluteUrl } from '@/lib/env';
import { sectionSitemapUrl } from '@/lib/sitemap-xml';
import { locales } from '@/i18n/routing';

import type { MetadataRoute } from 'next';

/**
 * robots.txt.
 *
 * Allow everything except the internal styleguide, and point at the sitemap.
 *
 * AI crawlers are deliberately not blocked. GPTBot, PerplexityBot, ClaudeBot
 * and Google-Extended are how this site gets cited in an answer, and the FAQ
 * sets and comparison guides written in Phase 4 exist for exactly that. Blocking
 * them would keep the content out of the answers a formulation engineer is
 * actually reading.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = locales.flatMap((locale) =>
    NOINDEX_PATHS.map((path) => `/${locale}${path}`),
  );

  return {
    rules: [{ userAgent: '*', allow: '/', disallow }],
    /*
      The index first, then each section file.

      Listing the sections as well as the index is belt and braces: the index
      is sufficient for a crawler, and naming the files here means a submission
      to Search Console or Bing can be made per section without anybody having
      to know the URL pattern. See `SITEMAP_SECTIONS`.
    */
    sitemap: [
      absoluteUrl('/sitemap.xml'),
      ...SITEMAP_SECTIONS.map((section) => sectionSitemapUrl(section)),
    ],
    host: absoluteUrl('/'),
  };
}
