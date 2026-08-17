import type { Metadata } from 'next';
import { dict } from '@/content';
import { alternatesFor, HREFLANG, pathFor, urlFor, type Locale, type RouteKey } from './i18n';
import { SITE } from './site';

/**
 * Per-page, per-language metadata (§15.1).
 *
 *  - title and description come from the dictionaries, written natively in each
 *    language and length-checked by scripts/check-copy.mjs
 *  - titles are absolute: no template, so no page can pick up the brand suffix
 *    twice
 *  - canonical points at this language's own URL. The two languages are never
 *    collapsed onto one canonical.
 *  - hreflang is reciprocal across ar-SA and en, with x-default on Arabic
 *  - the OG image is the page's own generated card
 */
export function buildMetadata(locale: Locale, route: RouteKey): Metadata {
  const d = dict(locale);
  const m = d.meta[route as keyof typeof d.meta];
  const canonical = urlFor(SITE.origin, locale, route);
  const ogPath = `/og/${locale}/${route === 'home' ? 'home' : route.replace(/\//g, '-')}.png`;

  return {
    metadataBase: new URL(SITE.origin),
    title: m.title,
    description: m.description,
    alternates: {
      canonical,
      languages: alternatesFor(SITE.origin, route),
    },
    openGraph: {
      type: 'website',
      siteName: locale === 'ar' ? SITE.nameAr : SITE.nameEn,
      locale: locale === 'ar' ? 'ar_SA' : 'en',
      url: canonical,
      title: m.title,
      description: m.description,
      images: [{ url: ogPath, width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [ogPath],
    },
    robots: { index: true, follow: true },
  };
}

/** Absolute URL for a locale + route, for JSON-LD and breadcrumbs. */
export function absolute(locale: Locale, route: RouteKey) {
  return urlFor(SITE.origin, locale, route);
}

export { HREFLANG, pathFor };
