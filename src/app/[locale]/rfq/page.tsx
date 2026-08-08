import { NextIntlClientProvider } from 'next-intl';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader, Skeleton, SkeletonText } from '@/components/primitives';
import { DOCUMENT_IDS, SECTOR_IDS } from '@/content/schema';
import { GRADES } from '@/content/data/grades';
import { PageShell } from '@/components/layout';
import { RfqForm } from '@/components/sections/RfqForm';
import { localeAlternates } from '@/lib/seo';
import { routeMessages } from '@/i18n/client-messages';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * The quotation page.
 *
 * Prefill arrives by query string from a grade page, a sector page or a
 * document request row. Every value is validated against the dataset before it
 * reaches the form, so a crafted URL cannot put arbitrary text into a field
 * that later lands in an email.
 *
 * The page carries no navigation-competing content: an answer-first paragraph
 * explaining the shape of the form, and the form. Everything else on this route
 * would be friction in front of the only action it exists for.
 *
 * The query string is read inside `<Suspense>` rather than at the top of the
 * page, so the heading and the answer-first paragraph are sent before it is
 * even parsed. Doing this in the page rather than in a segment `loading.tsx`
 * keeps a single `<main>` landmark in the markup: a `loading.tsx` fallback
 * carries its own, and both end up in the streamed HTML.
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** The prefill-dependent half of the page: the form itself. */
async function FormPanel({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: SearchParams;
}) {
  const query = await searchParams;

  const gradeParam = first(query.grade);
  const sectorParam = first(query.application) ?? first(query.sector);
  const documentParam = first(query.document);

  const grade = GRADES.some((entry) => entry.code === gradeParam) ? gradeParam : undefined;
  const sector = (SECTOR_IDS as readonly string[]).includes(sectorParam ?? '')
    ? sectorParam
    : undefined;
  const document = (DOCUMENT_IDS as readonly string[]).includes(documentParam ?? '')
    ? documentParam
    : undefined;

  return (
    /*
      The form reads seven namespaces the base client payload does not carry.
      Nesting a provider here rather than widening the base list keeps that cost
      on the one route that needs it. See src/i18n/client-messages.ts.
    */
    <NextIntlClientProvider messages={routeMessages(locale, 'components/sections/RfqForm')}>
      <RfqForm
        className="mt-section-sm max-w-3xl"
        locale={locale}
        {...(grade ? { grade } : {})}
        {...(sector ? { sector } : {})}
        {...(document ? { document } : {})}
      />
    </NextIntlClientProvider>
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
    title: t('rfqTitle'),
    description: t('rfqDescription'),
    alternates: localeAlternates(locale, '/rfq'),
  };
}

export default async function RfqPage({
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
    <PageShell locale={typedLocale} crumbs={[{ name: t('nav.rfq') }]}>
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.rfqH1')}
          lede={t('pages.rfqAnswerFirst')}
        />
      </div>

      <Suspense
        fallback={
          <div
            role="status"
            aria-busy
            aria-label={t('pages.loadingLabel')}
            className="mt-section-sm max-w-3xl"
          >
            <Skeleton className="h-2 w-full" />
            <SkeletonText className="mt-10" lines={2} />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          </div>
        }
      >
        <FormPanel locale={typedLocale} searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
