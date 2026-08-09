import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, SectionHeader } from '@/components/primitives';
import { APPLICATION_SECTOR } from '@/content/schema';
import { FillerLoadingCalculator } from '@/components/sections/FillerLoadingCalculator';
import { GRADE_RECOMMENDATIONS } from '@/content/data/guides';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { gradeSlug } from '@/content/data/grades';
import { localeAlternates } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';
import { routeMessages } from '@/i18n/client-messages';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * The filler loading calculator.
 *
 * Ungated and indexable, which is the whole point: the phase brief calls this
 * the best link-earning asset available in the niche, and an asset behind a
 * form earns no links.
 *
 * The applications offered are the plastics ones, because that is where a
 * loading decision has an economic answer, and each carries the grade its
 * specification implies through `GRADE_RECOMMENDATIONS`. The calculator never
 * derives a grade from the numbers a reader types.
 *
 * Messages are scoped to this route's own bucket rather than shipping the whole
 * catalogue, per ADR-040.
 */

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

  const t = await getTranslations({ locale, namespace: 'calculator' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/tools/filler-loading'),
  };
}

export default async function FillerLoadingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  /*
    Plastics applications only. A loading decision in a mortar or a drilling
    fluid is governed by workability and by fluid loss rather than by a cost per
    litre of finished part, so offering them here would invite the tool to
    answer a question it does not model.
  */
  const options = GRADE_RECOMMENDATIONS.filter(
    (entry) => APPLICATION_SECTOR[entry.application] === 'plastics-masterbatch',
  ).map((entry) => ({
    application: entry.application,
    gradeCode: entry.grade.code,
    gradeSlug: gradeSlug(entry.grade.code),
  }));

  return (
    <PageShell locale={typedLocale} crumbs={[{ name: t('calculator.navLabel') }]}>
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('calculator.h1')}
          lede={t('calculator.answerFirst')}
        />
      </div>

      {/* ------------------------------------------- why volume, not weight */}
      <section aria-labelledby="volume-heading" className="mt-section">
        <SectionHeader id="volume-heading" title={t('calculator.volumeHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{t('calculator.volumeBody')}</p>
      </section>

      {/* ---------------------------------------------------- the calculator */}
      <section aria-labelledby="calculator-heading" className="mt-section">
        <h2 id="calculator-heading" className="sr-only">
          {t('calculator.h1')}
        </h2>
        <NextIntlClientProvider
          locale={typedLocale}
          messages={routeMessages(typedLocale, 'components/sections/FillerLoadingCalculator')}
        >
          <FillerLoadingCalculator options={options} />
        </NextIntlClientProvider>

        <p className="measure-prose mt-8 text-sm text-ink-muted">
          {t('calculator.noPriceNote')}
        </p>
      </section>

      {/* ----------------------------------------------------- assumptions */}
      <section aria-labelledby="assumptions-heading" className="mt-section">
        <SectionHeader id="assumptions-heading" title={t('calculator.assumptionsHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">
          {t('calculator.assumptionsBody')}
        </p>

        <p className="mt-8">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
          >
            {t('pages.solutionsH1')}
            <ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />
          </Link>
        </p>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
