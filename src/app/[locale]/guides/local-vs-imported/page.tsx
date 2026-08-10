import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader } from '@/components/primitives';
import { ComparisonTable, RfqTeaser } from '@/components/sections';
import { PageShell } from '@/components/layout';
import { getContent } from '@/content';
import { localeAlternates, withOpenGraph } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * In-Kingdom supply against an import.
 *
 * The only guide on the site whose subject is commercial rather than technical,
 * and for that reason the one most at risk of becoming a sales page wearing a
 * guide's clothes. Three things keep it honest.
 *
 * It compares two supply structures rather than two suppliers, so there is
 * nobody to disparage. It gives importing its own section, arguing the cases
 * where it is genuinely the right decision, because a buyer who imports today
 * will stop reading a page that tells them they were wrong to. And it ends by
 * stating what the comparison cannot settle: the decisive number is lead time,
 * docs/technical-data.md §8 does not have one, and no figure is offered in its
 * place.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'guides.local-vs-imported' });

  return withOpenGraph(locale as Locale, {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/guides/local-vs-imported'),
  });
}

export default async function LocalVsImportedGuide({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const guide = getContent(typedLocale).guides['local-vs-imported'];

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.guides'), path: '/guides' }, { name: guide.navLabel }]}
    >
      <div className="pt-8">
        <SectionHeader as="h1" size="lg" title={guide.h1} lede={guide.answerFirst} />
      </div>

      {/* ------------------------------------------------- two structures */}
      <section aria-labelledby="shape-heading" className="mt-section">
        <SectionHeader id="shape-heading" title={guide.shapeHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.shapeBody}</p>
      </section>

      {/* ------------------------------------------------------- the table */}
      <section aria-labelledby="table-heading" className="mt-section">
        <SectionHeader id="table-heading" title={guide.tableHeading} />
        <ComparisonTable
          className="mt-10"
          caption={guide.tableCaption}
          columnAspect={guide.columnAspect}
          columnLeft={guide.columnImported}
          columnRight={guide.columnLocal}
          rows={guide.rows}
          scrollHint={t('sections.gradeMatrixScrollHint')}
        />
      </section>

      {/*
        Importing first, and argued properly. A comparison that only makes one
        case is an advertisement, and the reader can tell.
      */}
      <section aria-labelledby="imported-heading" className="mt-section">
        <SectionHeader id="imported-heading" title={guide.importedFitHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.importedFitBody}</p>
      </section>

      <section aria-labelledby="local-heading" className="mt-section">
        <SectionHeader id="local-heading" title={guide.localFitHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.localFitBody}</p>
      </section>

      {/* --------------------------------------------- the honest ending */}
      <section aria-labelledby="limit-heading" className="mt-section">
        <div className="rounded-md border-s-2 border-accent-700 bg-surface-sunken p-8">
          <SectionHeader id="limit-heading" title={guide.limitHeading} />
          <p className="measure-prose mt-6 text-ink-secondary">{guide.limitBody}</p>
        </div>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
