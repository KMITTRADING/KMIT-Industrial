import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { APPLICATION_IDS } from '@/content/schema';
import { SectionHeader, TableSkeleton } from '@/components/primitives';
import { GradeSelector, ParticleSizeChart, RfqTeaser } from '@/components/sections';
import { PageShell } from '@/components/layout';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { ApplicationId } from '@/content/schema';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Which grade do I need?
 *
 * The decision path is the page: application, then median particle size, then
 * grade, with the coating following from the grade rather than being chosen.
 * The selector and the full table sit underneath it, so a reader who already
 * knows their application can skip the argument and a reader who does not can
 * follow it.
 *
 * `?application=` is read inside `<Suspense>`, so the argument, the chart and
 * the closing section are sent before the query string is parsed. The full
 * fourteen-row table renders inside that boundary too and is never filtered
 * away, which is what keeps every recommendation reachable without JavaScript.
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function parseApplication(value: string | string[] | undefined): ApplicationId | undefined {
  const candidate = first(value);
  return candidate && (APPLICATION_IDS as readonly string[]).includes(candidate)
    ? (candidate as ApplicationId)
    : undefined;
}

/** The query-dependent half of the page. */
async function SelectorPanel({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const application = parseApplication(query.application);

  return <GradeSelector {...(application ? { application } : {})} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'guides.grade-selection' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/guides/grade-selection'),
  };
}

export default async function GradeSelectionGuide({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  const steps = [1, 2, 3] as const;

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[
        { name: t('nav.guides'), path: '/guides' },
        { name: t('guides.grade-selection.navLabel') },
      ]}
    >
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('guides.grade-selection.h1')}
          lede={t('guides.grade-selection.answerFirst')}
        />
      </div>

      {/* --------------------------------------------------- decision path */}
      <section aria-labelledby="path-heading" className="mt-section">
        <SectionHeader
          id="path-heading"
          title={t('guides.grade-selection.pathHeading')}
          lede={t('guides.grade-selection.pathIntro')}
        />

        <ol className="mt-10 grid gap-x-10 gap-y-10 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step} className="border-t-2 border-accent-700 pt-6">
              <h3 className="text-lg font-semibold text-balance text-ink-primary">
                {t(`guides.grade-selection.step${step}Heading`)}
              </h3>
              <p className="mt-4 text-ink-secondary">
                {t(`guides.grade-selection.step${step}Body`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------ selector and table */}
      <section aria-labelledby="selector-heading" className="mt-section">
        <SectionHeader
          id="selector-heading"
          title={t('guides.grade-selection.selectorHeading')}
          lede={t('guides.grade-selection.selectorIntro')}
        />

        <Suspense
          fallback={
            <TableSkeleton
              className="mt-10"
              rows={6}
              columns={4}
              label={t('pages.loadingLabel')}
            />
          }
        >
          <SelectorPanel searchParams={searchParams} />
        </Suspense>
      </section>

      {/* -------------------------------------------------------- the range */}
      <section aria-labelledby="psd-heading" className="mt-section">
        <SectionHeader
          id="psd-heading"
          title={t('pages.gradePsdHeading')}
          lede={t('pages.gradePsdCaption')}
        />
        <ParticleSizeChart className="mt-10" />
      </section>

      {/* ----------------------------------------------------------- closing */}
      <section aria-labelledby="closing-heading" className="mt-section">
        <SectionHeader
          id="closing-heading"
          title={t('guides.grade-selection.closingHeading')}
        />
        <p className="measure-prose mt-6 text-ink-secondary">
          {t('guides.grade-selection.closingBody')}
        </p>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
