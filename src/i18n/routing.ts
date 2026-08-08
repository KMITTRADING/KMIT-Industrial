import { defineRouting } from 'next-intl/routing';

/**
 * Arabic is the default locale and it is prefixed like every other locale:
 * `/ar/...` and `/en/...`, with `/` redirecting to `/ar`.
 *
 * Two deliberate choices here, both recorded in docs/decisions.md:
 *
 * 1. `localePrefix: 'always'` — an unprefixed default locale produces two URLs
 *    for the same document (`/products` and `/ar/products`), which is the most
 *    common source of duplicate-content penalties on bilingual sites.
 * 2. `localeDetection: false` — content negotiation makes the URL non
 *    deterministic. A procurement manager forwarding a link to a colleague in
 *    another country must land them on the same page they were reading, and a
 *    crawler must see one stable document per URL.
 * 3. `alternateLinks: false` — next-intl otherwise emits its own
 *    `Link: rel="alternate"` response header, and it disagrees with the cluster
 *    `src/lib/seo.ts` writes into the document: it labels Arabic `ar` rather
 *    than `ar-SA` and points `x-default` at the unprefixed path, which is
 *    itself a redirect. Two conflicting hreflang declarations for one page is
 *    worse than one, so the document is the single source. See ADR-033.
 * 4. `localeCookie: false` — with detection off the cookie changes no routing
 *    decision, and a `Set-Cookie` on every response makes the whole site
 *    uncacheable at a CDN edge for no benefit.
 */
export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
  alternateLinks: false,
  localeCookie: false,
});

/** Document direction per locale. Applied to `<html dir>` in the root layout. */
export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

/**
 * The BCP-47 tag written to `<html lang>` and to `hreflang`.
 *
 * Arabic is region-qualified (`ar-SA`) because the commercial terms, units and
 * regulatory references on this site are Saudi-specific. English is left
 * unqualified: the English pages target the whole GCC and beyond, and claiming
 * `en-SA` would narrow them for no benefit.
 */
export const localeHtmlLang: Record<Locale, string> = {
  ar: 'ar-SA',
  en: 'en',
};

/** Endonyms for the locale switcher — each language named in its own script. */
export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
