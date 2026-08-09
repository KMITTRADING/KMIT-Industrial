import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ARTICLES } from '@/content/data/knowledge';
import { ArrowInlineEndIcon, SectionHeader } from '@/components/primitives';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { getContent } from '@/content';
import { itemListJsonLd } from '@/lib/jsonld';
import { localeAlternates } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * The knowledge hub.
 *
 * Four articles, and the coverage note says so rather than leaving a reader to
 * wonder whether the section was abandoned. Each article explains one value
 * that already appears on the grade pages with its test method, which is the
 * constraint that keeps this from becoming a blog: an article with no published
 * number behind it would be a piece about a subject rather than an answer.
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

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('knowledgeTitle'),
    description: t('knowledgeDescription'),
    alternates: localeAlternates(locale, '/knowledge'),
  };
}

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const content = getContent(typedLocale);

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('pages.knowledgeH1') }]}
      jsonLd={[
        itemListJsonLd(
          typedLocale,
          ARTICLES.map((article) => ({
            name: content.knowledge[article.id].h1,
            path: `/knowledge/${article.id}`,
          })),
        ),
      ]}
    >
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.knowledgeH1')}
          lede={t('pages.knowledgeAnswerFirst')}
        />
      </div>

      <ul className="mt-section-sm grid gap-4 md:grid-cols-2">
        {ARTICLES.map((article) => {
          const copy = content.knowledge[article.id];
          return (
            <li key={article.id} className="flex">
              <Link
                href={`/knowledge/${article.id}`}
                className="group flex flex-1 flex-col justify-between rounded-md border border-border-subtle bg-surface-page p-6 transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-balance text-ink-primary">
                    {copy.h1}
                  </h2>
                  <p className="text-sm text-ink-secondary">{copy.cardSummary}</p>
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm font-medium text-ink-accent">
                  {t('pages.knowledgeRead')}
                  <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="measure-prose mt-section-sm text-sm text-ink-muted">
        {t('pages.knowledgeCoverage')}
      </p>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
