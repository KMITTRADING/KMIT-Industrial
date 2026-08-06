import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

/**
 * Locale routing at the edge.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; the export shape
 * is unchanged, so next-intl's `createMiddleware` is still the right factory.
 *
 * Responsibilities: redirect `/` to `/ar`, and reject any locale segment that is
 * not in the configured set. Locale detection is off (see i18n/routing.ts), so
 * this never varies a response by `Accept-Language`.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Every path except Next internals, the API surface, and anything that looks
   * like a file — a dot in the last segment. Without the file exclusion the
   * proxy would try to localise `/robots.txt` and
   * `/images/packaging/jumbo-bags-storage.avif`.
   */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
