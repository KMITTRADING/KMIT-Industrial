import { absoluteUrl } from '@/lib/env';
import { getContent } from '@/content';
import { localeHtmlLang, locales, defaultLocale } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Canonical and hreflang construction.
 *
 * Next merges page metadata over layout metadata *by top-level key*, so a page
 * that sets `alternates.canonical` silently discards the `alternates.languages`
 * the layout provided. Every page therefore builds its alternates through this
 * helper rather than hand-writing a canonical — which is how the hreflang
 * cluster stays complete on every route instead of only on the home page.
 *
 * `path` is the route without the locale segment: '' for the home page,
 * '/products/gcc-1250' for a grade page.
 */
export function localeAlternates(
  locale: Locale,
  path = '',
): NonNullable<Metadata['alternates']> {
  const normalised = path === '/' ? '' : path;

  const languages: Record<string, string> = {};
  for (const candidate of locales) {
    languages[localeHtmlLang[candidate]] = absoluteUrl(`/${candidate}${normalised}`);
  }
  // x-default points at Arabic: this is a Saudi supplier and Arabic is the
  // primary locale, so an unmatched reader should land there rather than on the
  // secondary translation.
  languages['x-default'] = absoluteUrl(`/${defaultLocale}${normalised}`);

  return {
    canonical: absoluteUrl(`/${locale}${normalised}`),
    languages,
  };
}

/**
 * Derive per-page Open Graph and Twitter metadata from what the page already
 * declares.
 *
 * This exists because of a specific and invisible failure. Next merges page
 * metadata over layout metadata **by top-level key**, so a page that set only
 * `title`, `description` and `alternates` inherited the layout's entire
 * `openGraph` block untouched. Every subpage on the site was advertising the
 * home page's `og:title`, `og:description` and `og:url` to every share preview
 * and every crawler that reads Open Graph in preference to the document, and
 * nothing in the page's own source hinted at it.
 *
 * Wrapping the page's own return value is the fix that holds: `og:title` is the
 * page's title and `og:url` is the page's canonical by construction, taken from
 * the same object, so the two cannot drift apart or be forgotten separately.
 */
export function withOpenGraph(
  locale: Locale,
  meta: Metadata,
  options: {
    /**
     * `article` on knowledge articles, `website` elsewhere.
     *
     * `product` is deliberately absent. Next's `openGraph.type` union does not
     * include it, and routing it through `other` emits
     * `<meta name="og:type">`, which Open Graph ignores because the
     * specification requires `property`. Grade pages therefore render the tag
     * themselves; see `OpenGraphType` in src/components/layout.
     */
    ogType?: 'website' | 'article' | 'product';
    /** Localised alt for the share image. English alt on an Arabic page is a defect. */
    imageAlt?: string;
  } = {},
): Metadata {
  const { ogType = 'website', imageAlt } = options;

  const title = typeof meta.title === 'string' ? meta.title : undefined;
  const description = meta.description ?? undefined;
  const canonical = meta.alternates?.canonical;
  const url = typeof canonical === 'string' ? canonical : undefined;

  return {
    ...meta,
    openGraph: {
      siteName: getContent(locale).meta.siteName,
      // Open Graph wants underscored BCP-47, and it wants it on both sides:
      // mixing `en` with `ar_SA` across the pair, as this site did, tells a
      // consumer the two documents are in differently-specified languages.
      locale: localeHtmlLang[locale].replace('-', '_'),
      alternateLocale: locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => localeHtmlLang[candidate].replace('-', '_')),
      ...(url ? { url } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageAlt && url
        ? { images: [{ url: `${url}/opengraph-image`, alt: imageAlt }] }
        : {}),
      ...(ogType === 'article' ? { type: 'article' as const } : {}),
      ...(ogType === 'website' ? { type: 'website' as const } : {}),
      ...(ogType === 'product' ? {} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
  };
}

/**
 * Alternates for a page that is excluded from search. Self-referencing
 * canonical only: advertising hreflang for a noindex page invites crawlers to
 * discover the other locale's copy of it.
 */
export function noindexAlternates(
  locale: Locale,
  path = '',
): NonNullable<Metadata['alternates']> {
  return { canonical: absoluteUrl(`/${locale}${path === '/' ? '' : path}`) };
}
