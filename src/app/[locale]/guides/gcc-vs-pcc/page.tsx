import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { Breadcrumbs, SectionHeader } from '@/components/primitives';
import { ComparisonTable, RfqTeaser } from '@/components/sections';
import { PageShell } from '@/components/layout';
import { getContent } from '@/content';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * GCC versus PCC.
 *
 * The honest ending is the last section. The published grade range is ground
 * calcium carbonate; precipitated calcium carbonate appears in the product
 * classification in docs/technical-data.md §1.3 with no grade table behind it.
 * Writing a comparison that quietly implies both are stocked to the same depth
 * would be the kind of claim this site does not make, so the page says which
 * one it can supply against a specification and which one needs a conversation.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'guides.gcc-vs-pcc' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/guides/gcc-vs-pcc'),
  };
}

export default async function GccVsPccGuide({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const guide = getContent(typedLocale).guides['gcc-vs-pcc'];

  return (
    <PageShell locale={typedLocale}>
      <div className="pt-8">
        <Breadcrumbs
          label={t('ui.breadcrumb')}
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.guides'), href: '/guides' },
            { label: guide.navLabel },
          ]}
        />
      </div>

      <div className="pt-8">
        <SectionHeader as="h1" size="lg" title={guide.h1} lede={guide.answerFirst} />
      </div>

      {/* -------------------------------------------------- two routes */}
      <section aria-labelledby="process-heading" className="mt-section">
        <SectionHeader id="process-heading" title={guide.processHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.processBody}</p>
      </section>

      {/* --------------------------------------------------------- the table */}
      <section aria-labelledby="table-heading" className="mt-section">
        <SectionHeader id="table-heading" title={guide.tableHeading} />
        <ComparisonTable
          className="mt-10"
          caption={guide.tableCaption}
          columnAspect={guide.columnAspect}
          columnLeft={guide.columnGcc}
          columnRight={guide.columnPcc}
          rows={guide.rows}
          scrollHint={t('sections.gradeMatrixScrollHint')}
        />
      </section>

      {/* ------------------------------------------------------------- fit */}
      <section aria-labelledby="fit-heading" className="mt-section">
        <SectionHeader id="fit-heading" title={guide.fitHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.fitBody}</p>
      </section>

      {/* ---------------------------------------------------------- supply */}
      <section aria-labelledby="supply-heading" className="mt-section">
        <div className="rounded-md border-s-2 border-accent-700 bg-surface-sunken p-8">
          <SectionHeader id="supply-heading" title={guide.supplyHeading} />
          <p className="measure-prose mt-6 text-ink-secondary">{guide.supplyBody}</p>
        </div>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
