import { GRADES, gradeSlug } from '@/content/data/grades';
import { GUIDE_IDS, SECTOR_IDS } from '@/content/schema';

/**
 * Every indexable path on the site, locale-neutral.
 *
 * One list, read by the sitemap, by `llms.txt`, and by the crawl-depth check in
 * `scripts/check-crawl.mjs`. Adding a route in one of those three and
 * forgetting the other two is exactly how a page ends up live, linked, and
 * absent from the sitemap.
 *
 * `changeFrequency` is deliberately absent. Google has said for years that it
 * ignores the hint, and a value invented per route is one more thing that can
 * disagree with reality.
 */

export type RoutePriority = 1.0 | 0.9 | 0.8 | 0.7 | 0.6;

export type SiteRoute = {
  /** Path without the locale segment. Empty string is the home page. */
  path: string;
  priority: RoutePriority;
};

/**
 * Priorities express the shape of the site to a crawler with a finite budget:
 * the home page first, then the grade pages, which are the documents a
 * specification query should land on and the ones carrying `Product` markup.
 */
export const SITE_ROUTES: SiteRoute[] = [
  { path: '', priority: 1.0 },
  { path: '/products', priority: 0.9 },
  ...GRADES.map((grade) => ({
    path: `/products/${gradeSlug(grade.code)}`,
    priority: 0.9 as const,
  })),
  { path: '/applications', priority: 0.8 },
  ...SECTOR_IDS.map((sector) => ({
    path: `/applications/${sector}`,
    priority: 0.8 as const,
  })),
  { path: '/guides', priority: 0.7 },
  ...GUIDE_IDS.map((guide) => ({ path: `/guides/${guide}`, priority: 0.8 as const })),
  { path: '/sustainability-and-facility', priority: 0.7 },
  { path: '/resources', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/rfq', priority: 0.9 },
];

/**
 * Paths that exist but must not be indexed.
 *
 * The styleguide is an internal review surface. It renders production copy in
 * both directions, so indexing it would put a second copy of most of the site's
 * strings in the index under a URL no buyer should ever land on.
 */
export const NOINDEX_PATHS = ['/styleguide'] as const;
