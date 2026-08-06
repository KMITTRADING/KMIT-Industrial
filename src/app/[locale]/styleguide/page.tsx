import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { noindexAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Internal design-system reference.
 *
 * A stub in Phase 1 by design — the token layer it will document is generated
 * but the components are not built until Phase 2. What matters now is that the
 * route exists, renders in both directions, and is unambiguously excluded from
 * search: an indexed styleguide competes with real pages and leaks unfinished
 * work into results.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'styleguide' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    alternates: noindexAlternates(locale, '/styleguide'),
  };
}

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations('styleguide');

  return (
    <>
      <SiteHeader locale={typedLocale} />

      <main id="main" className="mx-auto max-w-[76rem] px-5 py-section md:px-8">
        <h1 className="text-3xl font-semibold text-ink-primary">{t('h1')}</h1>
        <p className="mt-6 max-w-[62ch] text-ink-secondary">{t('intro')}</p>
      </main>

      <SiteFooter locale={typedLocale} />
    </>
  );
}
