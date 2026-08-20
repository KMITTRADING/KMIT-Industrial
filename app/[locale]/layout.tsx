import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import { DEFAULT_LOCALE, SITE_URL } from '@/lib/locales';
import { DIR, HTML_LANG, LOCALES, isLocale } from '@/lib/locales';
import { MotionLayer } from '@/components/motion/MotionLayer';
import '@/styles/globals.css';

/*
 * Runs before first paint, so the page never renders its revealed state and
 * then hides it. Setting the flag here rather than in the React effect is what
 * keeps the no-JS and reduced-motion paths honest: without this script nothing
 * is ever hidden, and the site is simply the static composition.
 */
const MOTION_FLAG = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}`;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Per-locale metadata (§11). Both documents are independently indexable, each
 * canonical to itself, and the alternates name both languages plus x-default.
 *
 * x-default points at Arabic because Arabic is the default: it is what `/`
 * redirects to, so an unmatched locale should land in the same place a bare
 * visit does.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  const url = `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${SITE_URL}/ar`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: FACTS.name[locale],
      title: copy.meta.title,
      description: copy.meta.description,
      url,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [{ url: `/og/${locale}.png`, width: 1200, height: 630, alt: copy.meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.meta.title,
      description: copy.meta.description,
      images: [`/og/${locale}.png`],
    },
  };
}

/**
 * Organization, with verified fields only (§11).
 *
 * Deliberately NOT LocalBusiness: that schema expects a street address, and
 * there is no published one. Emitting it with a city alone would be a false
 * precision signal to every consumer that reads it. No foundingDate, no
 * numberOfEmployees, no aggregateRating, no sameAs — none of those are facts
 * anyone has given us.
 */
function organizationSchema(locale: 'ar' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: FACTS.name[locale],
    alternateName: FACTS.name[locale === 'ar' ? 'en' : 'ar'],
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/brand/logo.svg`,
    email: FACTS.email,
    telephone: FACTS.phone.dial,
    parentOrganization: { '@type': 'Organization', name: FACTS.group[locale] },
    address: {
      '@type': 'PostalAddress',
      addressLocality: FACTS.city.en,
      addressCountry: FACTS.countryCode,
    },
    areaServed: [
      { '@type': 'Country', name: FACTS.country.en },
      { '@type': 'Place', name: 'Middle East' },
    ],
  };
}

/*
 * Both locales are prerendered to static HTML. `lang` and `dir` sit on <html>
 * itself, which is what lets every layout rule in the stylesheet stay logical:
 * one document direction, no per-component overrides.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={HTML_LANG[locale]} dir={DIR[locale]}>
      <head>
        {/* Both scripts' outlines are needed on first paint for the locale in
            question, and neither is discoverable from the HTML — the request
            only starts once the CSS has parsed. Preloading buys back that
            round trip on the LCP path. `crossOrigin` is required on font
            preloads even same-origin. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={locale === 'ar' ? '/fonts/alexandria-arabic-var.woff2' : '/fonts/alexandria-latin-var.woff2'}
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale)) }}
        />
      </head>
      <body>
        {children}
        <MotionLayer />
      </body>
    </html>
  );
}
