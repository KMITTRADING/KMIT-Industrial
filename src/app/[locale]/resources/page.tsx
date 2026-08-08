import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader, TableSkeleton } from '@/components/primitives';
import { DOCUMENT_IDS } from '@/content/schema';
import { GRADES } from '@/content/data/grades';
import { PageShell } from '@/components/layout';
import { ResourceLibrary, RfqTeaser } from '@/components/sections';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { DocumentId } from '@/content/schema';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Document library.
 *
 * Filter state is in the query string and validated here: an unknown grade or
 * document type is dropped rather than rendered, so a hand-edited URL produces
 * the unfiltered list instead of an empty page or injected text.
 *
 * The query string is read inside `<Suspense>` rather than at the top of the
 * page, so the heading, the answer-first paragraph and the page furniture are
 * sent before it is even parsed. Doing this in the page rather than in a
 * segment `loading.tsx` keeps a single `<main>` landmark in the markup: a
 * `loading.tsx` fallback carries its own, and both end up in the streamed HTML.
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** The query-dependent half of the page. Everything else renders without it. */
async function LibraryPanel({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;

  const gradeParam = first(query.grade);
  const typeParam = first(query.type);

  const grade = GRADES.some((entry) => entry.code === gradeParam) ? gradeParam : undefined;
  const type = (DOCUMENT_IDS as readonly string[]).includes(typeParam ?? '')
    ? (typeParam as DocumentId)
    : undefined;

  return (
    <>
      <ResourceLibrary
        className="mt-section-sm"
        {...(grade ? { grade } : {})}
        {...(type ? { type } : {})}
      />

      <RfqTeaser className="mt-section" {...(grade ? { grade } : {})} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('resourcesTitle'),
    description: t('resourcesDescription'),
    alternates: localeAlternates(locale, '/resources'),
  };
}

export default async function ResourcesPage({
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

  return (
    <PageShell locale={typedLocale} crumbs={[{ name: t('nav.resources') }]}>
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.resourcesH1')}
          lede={t('pages.resourcesAnswerFirst')}
        />
      </div>

      <Suspense
        fallback={
          <TableSkeleton
            className="mt-section-sm"
            rows={6}
            columns={4}
            label={t('pages.loadingLabel')}
          />
        }
      >
        <LibraryPanel searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
