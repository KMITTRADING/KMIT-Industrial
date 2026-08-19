import type { MetadataRoute } from 'next';
import { DEFAULT_LOCALE, LOCALES, SITE_URL } from '@/lib/locales';

/**
 * Both locale documents, each declaring the other as an alternate. Next emits
 * these as xhtml:link elements (§11).
 *
 * The root is not listed: it answers with a 301 to /ar, and listing a
 * redirecting URL in a sitemap is a signal to ignore, not to follow.
 */
// A static export has no request lifecycle, so the route has to declare
// itself static explicitly or the build refuses to collect it.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ar: `${SITE_URL}/ar`,
    en: `${SITE_URL}/en`,
    'x-default': `${SITE_URL}/${DEFAULT_LOCALE}`,
  };

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
    alternates: { languages },
  }));
}
