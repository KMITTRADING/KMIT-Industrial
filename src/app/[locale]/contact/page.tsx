import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader } from '@/components/primitives';
import { ContactBlock, LogisticsMap, RfqTeaser } from '@/components/sections';
import { PageShell } from '@/components/layout';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Contact.
 *
 * Split by intent rather than by department name: an engineer choosing a grade
 * and a buyer negotiating tonnage want different people, and labelling the
 * split by what the reader is trying to do routes them faster than an org chart
 * would.
 *
 * The channel list ships in its pending state. Phone, WhatsApp, email and the
 * street address are all open TODO(data) items, and a placeholder number that
 * rings nowhere costs more trust than an honest gap.
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
    title: t('contactTitle'),
    description: t('contactDescription'),
    alternates: localeAlternates(locale, '/contact'),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  return (
    <PageShell locale={typedLocale} crumbs={[{ name: t('nav.contact') }]}>
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.contactH1')}
          lede={t('pages.contactAnswerFirst')}
        />
      </div>

      <section aria-labelledby="split-heading" className="mt-section-sm">
        <h2 id="split-heading" className="sr-only">
          {t('pages.contactH1')}
        </h2>

        <div className="grid gap-px bg-border-subtle md:grid-cols-2">
          <div className="flex flex-col gap-3 bg-surface-page p-6">
            <h3 className="text-lg font-semibold text-ink-primary">
              {t('pages.contactTechnicalHeading')}
            </h3>
            <p className="measure-prose text-sm text-ink-secondary">
              {t('pages.contactTechnicalBody')}
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-surface-page p-6">
            <h3 className="text-lg font-semibold text-ink-primary">
              {t('pages.contactCommercialHeading')}
            </h3>
            <p className="measure-prose text-sm text-ink-secondary">
              {t('pages.contactCommercialBody')}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="channels-heading" className="mt-section">
        <SectionHeader id="channels-heading" title={t('sections.contactHeading')} />
        <ContactBlock className="mt-10" />

        <div className="mt-10 border-t border-border-subtle pt-8">
          <h3 className="text-sm font-semibold text-ink-primary">
            {t('pages.contactHoursHeading')}
          </h3>
          <p className="mt-2 text-sm text-ink-muted">{t('pages.contactHoursPending')}</p>
        </div>
      </section>

      <section aria-labelledby="location-heading" className="mt-section">
        <SectionHeader
          id="location-heading"
          title={t('sections.logisticsHeading')}
          lede={t('sections.logisticsIntro')}
        />
        <LogisticsMap className="mt-10" />
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
