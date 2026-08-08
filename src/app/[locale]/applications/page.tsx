import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ApplicationCard, RfqTeaser } from '@/components/sections';
import { SectionHeader } from '@/components/primitives';
import { PageShell } from '@/components/layout';
import { SECTOR_IDS } from '@/content/schema';
import { itemListJsonLd } from '@/lib/jsonld';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Applications index.
 *
 * Five sectors, each a card whose recommended grades are derived from the
 * dataset rather than written, so the index can never recommend a grade the
 * sector page does not.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('applicationsTitle'),
    description: t('applicationsDescription'),
    alternates: localeAlternates(locale, '/applications'),
  };
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.applications') }]}
      jsonLd={[
        itemListJsonLd(
          typedLocale,
          SECTOR_IDS.map((sector) => ({
            name: t(`sectors.${sector}`),
            path: `/applications/${sector}`,
          })),
        ),
      ]}
    >
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.applicationsH1')}
          lede={t('pages.applicationsAnswerFirst')}
        />
      </div>

      <div className="mt-section-sm grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTOR_IDS.map((sector) => (
          <ApplicationCard
            key={sector}
            sector={sector}
            headingAs="h2"
            href={`/applications/${sector}`}
          />
        ))}
      </div>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
