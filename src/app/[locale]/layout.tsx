import { Alexandria } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { AnalyticsConsent, SkipLink } from '@/components/layout';
import { baseMessages } from '@/i18n/client-messages';
import { getContent } from '@/content';
import { env } from '@/lib/env';
import { localeAlternates } from '@/lib/seo';
import { localeDirection, localeHtmlLang, locales, routing } from '@/i18n/routing';
import '@/styles/globals.css';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * One typeface for both scripts. Alexandria carries Arabic and Latin with the
 * same skeleton and the same optical weight, which holds the two locales
 * together visually far better than pairing two families would.
 */
const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-alexandria',
  // Variable axis, so the whole 300–800 range costs one file per subset.
  weight: 'variable',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const content = getContent(locale);

  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: content.meta.defaultTitle,
      template: `%s | ${content.meta.siteName}`,
    },
    description: content.meta.defaultDescription,
    applicationName: content.meta.siteName,
    // Declaring the icon stops the browser probing /favicon.ico, which is a
    // 404 in the console on every page load if nothing claims the slot.
    icons: { icon: [{ url: '/brand/icon.svg', type: 'image/svg+xml' }] },
    alternates: localeAlternates(locale),
    openGraph: {
      type: 'website',
      siteName: content.meta.siteName,
      // Open Graph wants underscored BCP-47, not the hyphenated form used by
      // `hreflang` and `<html lang>`. The alternate list is every other locale,
      // which is what tells a share preview that a counterpart document exists.
      locale: localeHtmlLang[locale].replace('-', '_'),
      alternateLocale: locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => localeHtmlLang[candidate].replace('-', '_')),
      url: `${env.siteUrl}/${locale}`,
      title: content.meta.defaultTitle,
      description: content.meta.defaultDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.defaultTitle,
      description: content.meta.defaultDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts every page under this layout into static rendering.
  setRequestLocale(locale);

  const typedLocale: Locale = locale;

  return (
    <html
      lang={localeHtmlLang[typedLocale]}
      dir={localeDirection[typedLocale]}
      className={alexandria.variable}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-surface-page text-ink-primary antialiased">
        <NextIntlClientProvider messages={baseMessages(typedLocale)}>
          {/* One skip link for the whole app, rendered before anything else so
              it is the first focusable element on every page. Pages must not add
              their own. */}
          <SkipLink />
          {children}
          <AnalyticsConsent
            provider={env.analytics.provider}
            measurementId={env.analytics.id}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
