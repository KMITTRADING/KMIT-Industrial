/**
 * Two locales, both real prerendered routes (§8). Arabic is the default: `/`
 * carries a 301 to /ar from netlify.toml, and x-default points there too.
 */

export const LOCALES = ['ar', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ar';

export const DIR: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };

/** The `lang` attribute and the hreflang codes. */
export const HTML_LANG: Record<Locale, string> = { ar: 'ar', en: 'en' };

/*
 * PLACEHOLDER: the production origin is not a verified fact. This is the
 * Netlify project's default domain, which is where the site currently deploys,
 * so canonicals, hreflang and the sitemap are self-consistent today. It has to
 * be replaced with the real origin before launch — it is the one value that
 * would silently point every canonical at the wrong host.
 */
export const SITE_URL = 'https://kmit-industrial.netlify.app';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The other locale — the language switch only ever has one destination. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}
