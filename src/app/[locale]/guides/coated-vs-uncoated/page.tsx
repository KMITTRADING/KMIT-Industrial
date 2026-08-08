import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader } from '@/components/primitives';
import { ComparisonTable, RfqTeaser } from '@/components/sections';
import { PageShell } from '@/components/layout';
import { getContent } from '@/content';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Coated versus uncoated.
 *
 * The verdict section is the point of the page. A supplier comparison that only
 * lists what the more expensive option adds is an advertisement; naming the
 * four applications where the coating earns nothing is what makes the rest of
 * the page worth believing, and it is also what stops a buyer specifying a
 * coated grade for a drilling fluid and blaming the material.
 *
 * The table rows come from the content tree rather than from props, because
 * they are copy: each cell is a sentence written natively in its locale, not a
 * value looked up from the dataset.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'guides.coated-vs-uncoated' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/guides/coated-vs-uncoated'),
  };
}

export default async function CoatedVsUncoatedGuide({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const guide = getContent(typedLocale).guides['coated-vs-uncoated'];

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.guides'), path: '/guides' }, { name: guide.navLabel }]}
    >
      <div className="pt-8">
        <SectionHeader as="h1" size="lg" title={guide.h1} lede={guide.answerFirst} />
      </div>

      {/* ----------------------------------------------- what and what for */}
      <section aria-labelledby="what-heading" className="mt-section">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader id="what-heading" title={guide.whatHeading} />
            <p className="measure-prose mt-6 text-ink-secondary">{guide.whatBody}</p>
          </div>
          <div>
            <SectionHeader id="effect-heading" title={guide.effectHeading} />
            <p className="measure-prose mt-6 text-ink-secondary">{guide.effectBody}</p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- the table */}
      <section aria-labelledby="table-heading" className="mt-section">
        <SectionHeader id="table-heading" title={guide.tableHeading} />
        <ComparisonTable
          className="mt-10"
          caption={guide.tableCaption}
          columnAspect={guide.columnAspect}
          columnLeft={guide.columnUncoated}
          columnRight={guide.columnCoated}
          rows={guide.rows}
          scrollHint={t('sections.gradeMatrixScrollHint')}
        />
      </section>

      {/* ---------------------------------------------------------- verdict */}
      <section aria-labelledby="verdict-heading" className="mt-section">
        <div className="rounded-md border-s-2 border-accent-700 bg-surface-sunken p-8">
          <SectionHeader id="verdict-heading" title={guide.verdictHeading} />
          <p className="measure-prose mt-6 text-ink-secondary">{guide.verdictBody}</p>
        </div>
      </section>

      {/* ------------------------------------------------------- shelf life */}
      <section aria-labelledby="shelf-heading" className="mt-section">
        <SectionHeader id="shelf-heading" title={guide.shelfLifeHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.shelfLifeBody}</p>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
