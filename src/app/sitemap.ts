import { SITE_ROUTES } from '@/lib/routes';
import { absoluteUrl } from '@/lib/env';
import { defaultLocale, localeHtmlLang, locales } from '@/i18n/routing';

import type { MetadataRoute } from 'next';

/**
 * The sitemap.
 *
 * One entry per locale per route, each carrying the full `xhtml:link` alternate
 * cluster, which Next emits from the `alternates.languages` field. That is the
 * form Google asks for on a bilingual site: every URL in the file declares its
 * counterparts, so the pair is discovered together even when only one of them
 * is crawled.
 *
 * `lastModified` is the build time rather than a per-page date. The site has no
 * CMS and no per-document revision history, so a fabricated per-route date
 * would be less accurate than the one thing that is true: this is when the
 * document was last generated.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = (path: string): Record<string, string> => {
    const entries: Record<string, string> = {};
    for (const locale of locales) {
      entries[localeHtmlLang[locale]] = absoluteUrl(`/${locale}${path}`);
    }
    entries['x-default'] = absoluteUrl(`/${defaultLocale}${path}`);
    return entries;
  };

  return locales.flatMap((locale) =>
    SITE_ROUTES.map((route) => ({
      url: absoluteUrl(`/${locale}${route.path}`),
      lastModified,
      priority: route.priority,
      alternates: { languages: languages(route.path) },
    })),
  );
}
