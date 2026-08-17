import type { MetadataRoute } from 'next';

import { HREFLANG, LOCALES, ROUTES, urlFor, DEFAULT_LOCALE } from '@/lib/i18n';
import { SITE } from '@/lib/site';

/**
 * Sitemap covering both languages (§15.1.6).
 *
 * Every entry carries its `alternates.languages` map, so the reciprocal hreflang
 * relationship is stated in the sitemap as well as in each page's head. The two
 * must agree, and generating both from `lib/i18n` is what guarantees they do.
 *
 * Priorities are relative, not decorative: the homepage first, then the knowledge
 * centre, which is the page most likely to be entered from search (§15.1.5).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priorityFor = (route: string) => {
    if (route === 'home') return 1;
    if (route === 'calcium-carbonate') return 0.9;
    if (route.startsWith('sectors')) return 0.8;
    if (route === 'contact' || route === 'about') return 0.7;
    return 0.6;
  };

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: urlFor(SITE.origin, locale, route),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: priorityFor(route),
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((l) => [HREFLANG[l], urlFor(SITE.origin, l, route)])
          ),
          'x-default': urlFor(SITE.origin, DEFAULT_LOCALE, route),
        },
      },
    }))
  );
}
