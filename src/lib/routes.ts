import { GRADES, gradeSlug } from '@/content/data/grades';
import { GUIDE_IDS, SECTOR_IDS } from '@/content/schema';
import { SOLUTIONS } from '@/content/data/solutions';

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

/**
 * Which sitemap a route belongs to.
 *
 * The site has 62 URLs, so splitting is not about the 50,000-URL limit. It is
 * about diagnosis: Search Console reports index coverage per submitted sitemap,
 * and with one file the only available answer to "are the nine solution pages
 * being indexed" is a number covering the whole site. With a file per section
 * the question is answerable, which is what makes the 90-day de-indexing policy
 * in docs/pseo-monitoring.md something anybody can actually act on.
 */
export const SITEMAP_SECTIONS = [
  'core',
  'products',
  'applications',
  'solutions',
  'guides',
] as const;

export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

export type SiteRoute = {
  /** Path without the locale segment. Empty string is the home page. */
  path: string;
  priority: RoutePriority;
  section: SitemapSection;
};

/**
 * Priorities express the shape of the site to a crawler with a finite budget:
 * the home page first, then the grade pages, which are the documents a
 * specification query should land on and the ones carrying `Product` markup.
 */
export const SITE_ROUTES: SiteRoute[] = [
  { path: '', priority: 1.0, section: 'core' },
  { path: '/products', priority: 0.9, section: 'products' },
  ...GRADES.map((grade) => ({
    path: `/products/${gradeSlug(grade.code)}`,
    priority: 0.9 as const,
    section: 'products' as const,
  })),
  { path: '/applications', priority: 0.8, section: 'applications' },
  ...SECTOR_IDS.map((sector) => ({
    path: `/applications/${sector}`,
    priority: 0.8 as const,
    section: 'applications' as const,
  })),
  /*
    The solution pages rank below the grade pages and above the sector index.
    They are the most specific commercial documents on the site, and a crawler
    with a finite budget should reach them before the informational layer.
  */
  { path: '/solutions', priority: 0.8, section: 'solutions' },
  ...SOLUTIONS.map((solution) => ({
    path: `/solutions/${solution.id}`,
    priority: 0.8 as const,
    section: 'solutions' as const,
  })),
  /*
    The calculator sits in the guides sitemap rather than in core. It is an
    informational asset in the same cluster as the guides, and grouping it with
    them keeps the index-coverage question in docs/pseo-monitoring.md answerable
    for the whole informational layer at once.
  */
  { path: '/tools/filler-loading', priority: 0.8, section: 'guides' },
  { path: '/guides', priority: 0.7, section: 'guides' },
  ...GUIDE_IDS.map((guide) => ({
    path: `/guides/${guide}`,
    priority: 0.8 as const,
    section: 'guides' as const,
  })),
  { path: '/sustainability-and-facility', priority: 0.7, section: 'core' },
  { path: '/resources', priority: 0.7, section: 'core' },
  { path: '/contact', priority: 0.6, section: 'core' },
  { path: '/rfq', priority: 0.9, section: 'core' },
];

/** Routes belonging to one sitemap section, in site order. */
export function routesInSection(section: SitemapSection): SiteRoute[] {
  return SITE_ROUTES.filter((route) => route.section === section);
}

/**
 * Paths that exist but must not be indexed.
 *
 * The styleguide is an internal review surface. It renders production copy in
 * both directions, so indexing it would put a second copy of most of the site's
 * strings in the index under a URL no buyer should ever land on.
 */
export const NOINDEX_PATHS = ['/styleguide'] as const;
