import { NOINDEX_PATHS } from '@/lib/routes';
import { absoluteUrl } from '@/lib/env';
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
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
