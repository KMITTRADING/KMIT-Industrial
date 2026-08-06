import { absoluteUrl } from '@/lib/env';
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
