import { getContent } from '@/content';

import type { Content } from '@/content/schema';
import type { Locale } from '@/i18n/routing';

/**
 * What reaches the browser, and where.
 *
 * `NextIntlClientProvider` with no `messages` prop serialises the entire
 * catalogue into the RSC payload of every page. That was 57.5 KB of Arabic on a
 * 242 KB document, of which the client components on a typical page use
 * 10.6 KB: the other 47 KB was every FAQ answer, every guide body and every
 * sector page's prose, shipped to a browser that renders none of it and parsed
 * on the main thread before the page can settle.
 *
 * Two tiers, because the alternative was one list big enough for the heaviest
 * route:
 *
 * - `BASE_NAMESPACES` ships on every page. Header, locale switcher, consent
 *   prompt, error boundary, and the shared interface strings.
 * - `ROUTE_NAMESPACES` is added by the two routes whose client components need
 *   more: the RFQ form, and the styleguide's interactive specimens. Each nests
 *   its own provider, so the cost lands only there.
 *
 * Server components read the full tree through `getTranslations` and are not
 * constrained by any of this.
 *
 * `scripts/check-client-messages.mjs` scans every client component for the
 * namespaces it actually reads and fails the build if one is not covered.
 * Without that gate these lists are a runtime error waiting for the first
 * person who adds `useTranslations('sectors')` to a client component.
 */

export const BASE_NAMESPACES = [
  /** SkipLink, LocaleSwitcher, SiteHeader. */
  'a11y',
  /** SiteHeader. */
  'nav',
  /** Every interactive primitive: labels, sort states, pagination. */
  'ui',
  /** The header mega-menu renders the grade matrix. */
  'grades',
  'units',
  /** The mega-menu heading. */
  'home',
  /** The consent prompt. */
  'consent',
  /** error.tsx, which is a client component by definition. */
  'pages',
] as const satisfies readonly (keyof Content)[];

/**
 * Extra namespaces per route bucket, keyed by the path prefix of the client
 * components that need them. The gate reads these keys to decide which
 * extension applies to which file.
 */
export const ROUTE_NAMESPACES = {
  /** src/components/sections/RfqForm.tsx, rendered only by /rfq. */
  'components/sections/RfqForm': [
    'rfqForm',
    'applications',
    'packaging',
    'standards',
    'sectors',
    'documents',
    'coatingAgents',
  ],
  /**
   * src/components/sections/GradeMatrix.tsx. Since Phase 6 the home page uses
   * the server-rendered `GradeTable`, so the interactive matrix is reached only
   * from the styleguide and its cost lands only there.
   */
  'components/sections/GradeMatrix': ['sections', 'applications', 'coatingAgents'],
  /** src/components/styleguide/*, rendered only by /styleguide. */
  'components/styleguide': [
    'styleguide',
    'sections',
    'properties',
    'parameters',
    'faqQuestions',
    'faqAnswers',
    'documents',
    'documentDescriptions',
    'applications',
    'coatingAgents',
    'packaging',
    'standards',
    'standardScopes',
  ],
} as const satisfies Record<string, readonly (keyof Content)[]>;

export type RouteBucket = keyof typeof ROUTE_NAMESPACES;

type Namespace = keyof Content;

function pick(locale: Locale, namespaces: readonly Namespace[]) {
  const content = getContent(locale);
  return Object.fromEntries(namespaces.map((namespace) => [namespace, content[namespace]]));
}

/** The subset serialised into every page's client payload. */
export function baseMessages(locale: Locale) {
  return pick(locale, BASE_NAMESPACES);
}

/**
 * Base plus one route bucket, for a route that nests its own provider.
 *
 * Includes the base namespaces because a nested `NextIntlClientProvider`
 * replaces rather than merges, and the component tree inside it still contains
 * the primitives that read `ui`.
 */
export function routeMessages(locale: Locale, bucket: RouteBucket) {
  return pick(locale, [...BASE_NAMESPACES, ...ROUTE_NAMESPACES[bucket]]);
}
