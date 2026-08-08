import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { defaultLocale, routing } from '@/i18n/routing';

import type { NextRequest } from 'next/server';

/**
 * Locale routing at the edge.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; the export shape
 * is unchanged, so next-intl's `createMiddleware` is still the right factory.
 *
 * Responsibilities: redirect the unprefixed root to the default locale, and
 * reject any locale segment that is not in the configured set. Locale detection
 * is off (see i18n/routing.ts), so this never varies a response by
 * `Accept-Language`.
 *
 * The unprefixed paths are handled here rather than left to next-intl because
 * it answers them with a 307. A temporary redirect tells a crawler to keep
 * requesting the old URL and to leave the link equity where it was, which on
 * the site root is exactly wrong: `/` is never going to serve a document, and
 * `/ar` is permanently the home page. 308 rather than 301 so the method and
 * body are preserved, which matters for the one POST target on the site.
 */

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocalePrefix) {
    const target = new URL(
      `/${defaultLocale}${pathname === '/' ? '' : pathname}${search}`,
      request.url,
    );
    return NextResponse.redirect(target, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  /**
   * Every path except Next internals, the API surface, and anything that looks
   * like a file — a dot in the last segment. Without the file exclusion the
   * proxy would try to localise `/robots.txt`, `/llms.txt`, `/sitemap.xml` and
   * `/images/packaging/jumbo-bags-storage.avif`.
   */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
