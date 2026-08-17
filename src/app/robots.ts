import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

/**
 * robots.txt (§15.1.6). Deliberately plain: everything on this site is meant to
 * be indexed, so there is nothing to disallow and no reason to invent rules.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
