/**
 * Bilingual plumbing (§6). Arabic is the default language and RTL; English is
 * second. Slugs stay English in both languages, which indexes and shares better.
 */

export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ar';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** BCP-47 tags used for `hreflang` and `inLanguage`. Arabic is targeted at SA. */
export const HREFLANG: Record<Locale, string> = {
  ar: 'ar-SA',
  en: 'en',
};

/** Every route on the site. `slug` is the path under /ar and /en alike. */
export const ROUTES = [
  'home',
  'about',
  'sectors',
  'sectors/industrial-minerals',
  'sectors/marble-transport',
  'sectors/solar-panels',
  'calcium-carbonate',
  'quality-hse',
  'sustainability',
  'careers',
  'contact',
] as const;

export type RouteKey = (typeof ROUTES)[number];

/** Path for a route in a locale, always with a leading slash and no trailing one. */
export function pathFor(locale: Locale, route: RouteKey): string {
  return route === 'home' ? `/${locale}` : `/${locale}/${route}`;
}

/** Absolute URL, for canonicals, alternates, sitemap and JSON-LD. */
export function urlFor(origin: string, locale: Locale, route: RouteKey): string {
  return `${origin}${pathFor(locale, route)}`;
}

/**
 * Reciprocal alternates for one route: every language points at its counterpart
 * and at itself, plus x-default on Arabic as the default language (§15.1).
 */
export function alternatesFor(origin: string, route: RouteKey) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[HREFLANG[locale]] = urlFor(origin, locale, route);
  }
  languages['x-default'] = urlFor(origin, DEFAULT_LOCALE, route);
  return languages;
}

/** The counterpart path of a route in the other language, for the switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

/**
 * Turns a live pathname into the same page in the target language. Used by the
 * language switcher, which must keep the current page rather than going home (§6.5).
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return `/${target}`;
  if (isLocale(parts[0])) {
    parts[0] = target;
    return '/' + parts.join('/');
  }
  return `/${target}` + clean;
}
