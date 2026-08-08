import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, Breadcrumbs, SectionHeader } from '@/components/primitives';
import { GUIDE_IDS } from '@/content/schema';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Guides index.
 *
 * Three cards and nothing else. The index of a three-item set does not need a
 * filter, a search box or a hero: it needs to name each guide and say what it
 * settles, so the reader picks one and leaves.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('guidesTitle'),
    description: t('guidesDescription'),
    alternates: localeAlternates(locale, '/guides'),
  };
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  return (
    <PageShell locale={typedLocale}>
      <div className="pt-8">
        <Breadcrumbs
          label={t('ui.breadcrumb')}
          items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.guides') }]}
        />
      </div>

      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.guidesH1')}
          lede={t('pages.guidesAnswerFirst')}
        />
      </div>

      <ul className="mt-section-sm grid gap-4 md:grid-cols-3">
        {GUIDE_IDS.map((guide) => (
          <li key={guide} className="flex">
            <Link
              href={`/guides/${guide}`}
              className="group flex flex-1 flex-col justify-between rounded-md border border-border-subtle bg-surface-page p-6 transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-balance text-ink-primary">
                  {t(`guides.${guide}.navLabel`)}
                </h2>
                <p className="text-sm text-ink-secondary">{t(`guides.${guide}.cardSummary`)}</p>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-ink-accent">
                {t('pages.guidesReadGuide')}
                <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
