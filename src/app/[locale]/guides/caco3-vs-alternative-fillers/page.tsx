import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import {
  SectionHeader,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowHeader,
  TableScroll,
} from '@/components/primitives';
import { FILLER_COMPARISON_IDS, FILLER_IDS } from '@/content/schema';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { getContent } from '@/content';
import { localeAlternates, withOpenGraph } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Calcium carbonate against talc, kaolin and barite.
 *
 * A four-column table rather than the two-column `ComparisonTable` the other
 * guides use, so it is built here from the table primitives rather than pushed
 * through a component shaped for a different comparison.
 *
 * The provenance note under the table is not a disclaimer, it is the load
 * bearing part of the page. One of the four columns is KMIT's published
 * specification and three are textbook properties of minerals KMIT does not
 * supply and has never tested. Presenting all four in one table without saying
 * so would imply a test result that was never produced, which is the precise
 * failure CLAUDE.md §2 exists to prevent.
 *
 * Each alternative gets a section arguing when it is the better answer. A
 * comparison that concludes for its author every time is an advertisement.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({
    locale,
    namespace: 'guides.caco3-vs-alternative-fillers',
  });

  return withOpenGraph(locale as Locale, {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/guides/caco3-vs-alternative-fillers'),
  });
}

export default async function FillerComparisonGuide({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const guide = getContent(typedLocale).guides['caco3-vs-alternative-fillers'];

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.guides'), path: '/guides' }, { name: guide.navLabel }]}
    >
      <div className="pt-8">
        <SectionHeader as="h1" size="lg" title={guide.h1} lede={guide.answerFirst} />
      </div>

      {/* ------------------------------------------- what a filler does */}
      <section aria-labelledby="role-heading" className="mt-section">
        <SectionHeader id="role-heading" title={guide.roleHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.roleBody}</p>
      </section>

      {/* ---------------------------------------------- the four minerals */}
      <section aria-labelledby="table-heading" className="mt-section">
        <SectionHeader id="table-heading" title={guide.tableHeading} />

        <TableScroll className="mt-10" label={guide.tableCaption}>
          <Table className="min-w-[48rem]">
            <TableCaption>{guide.tableCaption}</TableCaption>
            <TableHead>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell>{guide.columnAspect}</TableHeaderCell>
                {FILLER_IDS.map((mineral) => (
                  <TableHeaderCell key={mineral}>{guide.minerals[mineral]}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {FILLER_COMPARISON_IDS.map((row) => (
                <TableRow key={row}>
                  <TableRowHeader>{guide.rows[row].aspect}</TableRowHeader>
                  {FILLER_IDS.map((mineral) => (
                    <TableCell key={mineral}>{guide.rows[row].values[mineral]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>

        {/*
          Which column is a specification and which three are not. Directly
          under the table, because that is where it is read.
        */}
        <p className="measure-prose mt-6 text-sm text-ink-muted">{guide.provenanceNote}</p>
      </section>

      {/* -------------------------------------------------- how it resolves */}
      <section aria-labelledby="choosing-heading" className="mt-section">
        <SectionHeader id="choosing-heading" title={guide.choosingHeading} />
        <p className="measure-prose mt-6 text-ink-secondary">{guide.choosingBody}</p>
      </section>

      {/* --------------------------------- where the other three are right */}
      <section aria-labelledby="alternatives-heading" className="mt-section">
        <h2 id="alternatives-heading" className="sr-only">
          {guide.choosingHeading}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { heading: guide.talcHeading, body: guide.talcBody },
            { heading: guide.kaolinHeading, body: guide.kaolinBody },
            { heading: guide.bariteHeading, body: guide.bariteBody },
          ].map((entry) => (
            <section key={entry.heading} className="rounded-md border border-border-subtle p-6">
              <h3 className="text-base font-semibold text-ink-primary">{entry.heading}</h3>
              <p className="mt-4 text-sm text-ink-secondary">{entry.body}</p>
            </section>
          ))}
        </div>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
