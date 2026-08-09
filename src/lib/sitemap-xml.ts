import { absoluteUrl } from '@/lib/env';
import { defaultLocale, localeHtmlLang, locales } from '@/i18n/routing';

import type { SiteRoute, SitemapSection } from '@/lib/routes';

/**
 * Sitemap XML, written by hand rather than through Next's `MetadataRoute`.
 *
 * The generated form produces one file. This site now ships a sitemap index
 * over a file per section, which the metadata convention cannot express, and
 * the `xhtml:link` alternate cluster on every URL matters too much to lose in
 * the change: on a bilingual site it is what makes the pair discoverable
 * together when only one of them is crawled.
 *
 * `lastmod` is the build time on every entry, and that is a deliberate limit
 * rather than an oversight. There is no CMS and no per-document revision
 * history, so the only per-route date available would be invented. Build time
 * is the one thing that is actually true, and a sitemap that overstates
 * freshness trains a crawler to ignore the field.
 */

const escape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Absolute URL of one section's sitemap. */
export const sectionSitemapUrl = (section: SitemapSection): string =>
  absoluteUrl(`/sitemap/${section}.xml`);

/** The index: one entry per section file. */
export function sitemapIndexXml(
  sections: readonly SitemapSection[],
  lastModified: Date,
): string {
  const stamp = lastModified.toISOString();

  const entries = sections
    .map(
      (section) =>
        `  <sitemap>\n` +
        `    <loc>${escape(sectionSitemapUrl(section))}</loc>\n` +
        `    <lastmod>${stamp}</lastmod>\n` +
        `  </sitemap>`,
    )
    .join('\n');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${entries}\n` +
    '</sitemapindex>\n'
  );
}

/**
 * One section file. Every URL carries the full alternate cluster, including a
 * self-reference, which is what Google asks for and what makes the hreflang
 * pair reciprocal from the sitemap's side as well as from the document's.
 */
export function sitemapXml(routes: readonly SiteRoute[], lastModified: Date): string {
  const stamp = lastModified.toISOString();

  const urls = locales.flatMap((locale) =>
    routes.map((route) => {
      const alternates = [
        ...locales.map(
          (candidate) =>
            `      <xhtml:link rel="alternate" hreflang="${localeHtmlLang[candidate]}" ` +
            `href="${escape(absoluteUrl(`/${candidate}${route.path}`))}" />`,
        ),
        `      <xhtml:link rel="alternate" hreflang="x-default" ` +
          `href="${escape(absoluteUrl(`/${defaultLocale}${route.path}`))}" />`,
      ].join('\n');

      return (
        `  <url>\n` +
        `    <loc>${escape(absoluteUrl(`/${locale}${route.path}`))}</loc>\n` +
        `${alternates}\n` +
        `    <lastmod>${stamp}</lastmod>\n` +
        `    <priority>${route.priority.toFixed(1)}</priority>\n` +
        `  </url>`
      );
    }),
  );

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    `${urls.join('\n')}\n` +
    '</urlset>\n'
  );
}

export const XML_HEADERS = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, max-age=0, must-revalidate',
} as const;
