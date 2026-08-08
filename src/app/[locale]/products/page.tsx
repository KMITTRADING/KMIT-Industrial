import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader, TableSkeleton } from '@/components/primitives';
import {
  COMPARISON_LIMIT,
  GradeExplorer,
  ParticleSizeChart,
  RfqTeaser,
} from '@/components/sections';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { PageShell } from '@/components/layout';
import { SECTOR_IDS } from '@/content/schema';
import { itemListJsonLd } from '@/lib/jsonld';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { SectorId } from '@/content/schema';

/**
 * Products index.
 *
 * Filter and comparison state live in the query string, and both are validated
 * here rather than trusted: an unknown `?industry=` is dropped rather than
 * rendered, and `?compare=` is intersected with the real grade list and capped,
 * so a hand-edited URL cannot inject text into the page or blow up the layout
 * with twenty columns.
 *
 * The filtered views are canonicalised back to the bare `/products`. They are
 * useful to a reader and shareable, but they are the same five grades in a
 * different order, and letting each combination compete as its own document is
 * how a five-product catalogue turns into forty thin pages.
 *
 * `searchParams` is awaited inside `<Suspense>` rather than at the top of the
 * page, so the shell — breadcrumbs, heading, answer-first paragraph, the PSD
 * chart, header and footer — is sent before the query string is even read.
 * That skeleton lives here rather than in a segment `loading.tsx` because a
 * `loading.tsx` in this folder would also wrap `products/[grade]`, and those
 * ten grade pages have nothing per-request about them: they should prerender.
 */

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function parseIndustry(value: string | string[] | undefined): SectorId | undefined {
  const candidate = first(value);
  return candidate && (SECTOR_IDS as readonly string[]).includes(candidate)
    ? (candidate as SectorId)
    : undefined;
}

function parseCompare(value: string | string[] | undefined): string[] {
  const candidate = first(value);
  if (!candidate) return [];
  const codes = GRADES.map((grade) => grade.code) as readonly string[];
  return candidate
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry, index, all) => codes.includes(entry) && all.indexOf(entry) === index)
    .slice(0, COMPARISON_LIMIT);
}

/** The query-dependent half of the page. Everything else renders without it. */
async function ExplorerPanel({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const industry = parseIndustry(query.industry);
  const compare = parseCompare(query.compare);

  return (
    <>
      <GradeExplorer industry={industry} compare={compare} />
      <RfqTeaser className="mt-section" {...(industry ? { application: industry } : {})} />
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
    title: t('productsTitle'),
    description: t('productsDescription'),
    alternates: localeAlternates(locale, '/products'),
  };
}

export default async function ProductsPage({
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
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.products') }]}
      jsonLd={[
        itemListJsonLd(
          typedLocale,
          GRADES.map((grade) => ({
            name: grade.code,
            path: `/products/${gradeSlug(grade.code)}`,
          })),
        ),
      ]}
    >
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.productsH1')}
          lede={t('pages.productsAnswerFirst')}
        />
      </div>

      <section aria-labelledby="psd-heading" className="mt-section">
        <SectionHeader
          id="psd-heading"
          title={t('pages.gradePsdHeading')}
          lede={t('pages.gradePsdCaption')}
        />
        <ParticleSizeChart className="mt-10" />
      </section>

      <Suspense
        fallback={
          <TableSkeleton
            className="mt-section"
            rows={5}
            columns={5}
            label={t('pages.loadingLabel')}
          />
        }
      >
        <ExplorerPanel searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
