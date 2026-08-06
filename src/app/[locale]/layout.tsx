import { Alexandria } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

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
    alternates: localeAlternates(locale),
    openGraph: {
      type: 'website',
      siteName: content.meta.siteName,
      locale: localeHtmlLang[locale],
      url: `${env.siteUrl}/${locale}`,
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
  const t = await getTranslations('a11y');

  return (
    <html
      lang={localeHtmlLang[typedLocale]}
      dir={localeDirection[typedLocale]}
      className={alexandria.variable}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-surface-page text-ink-primary antialiased">
        <NextIntlClientProvider>
          <a className="skip-link" href="#main">
            {t('skipToContent')}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
