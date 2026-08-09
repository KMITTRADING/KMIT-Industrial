import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SectionHeader } from '@/components/primitives';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { SOLUTIONS, solutionsBySector } from '@/content/data/solutions';
import { formatInteger, formatRange } from '@/lib/utils';
import { getContent } from '@/content';
import { itemListJsonLd } from '@/lib/jsonld';
import { localeAlternates } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * The solutions hub.
 *
 * Its job is structural before it is editorial. A programmatic page reachable
 * only from the sitemap is an orphan, and an orphan is treated as one by
 * crawlers and by readers alike, so every one of the nine spokes is linked from
 * here, grouped by sector, one click from the header.
 *
 * The coverage section is the part that would normally be left out. It states
 * that nine pages exist out of twenty-five possible and says why the other
 * sixteen do not, which is unusual to publish and is the honest thing to put in
 * front of an engineer who can count the grades and the sectors themselves.
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
    title: t('solutionsTitle'),
    description: t('solutionsDescription'),
    alternates: localeAlternates(locale, '/solutions'),
  };
}

export default async function SolutionsPage({
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

  const groups = solutionsBySector();

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('pages.solutionsH1') }]}
      jsonLd={[
        itemListJsonLd(
          typedLocale,
          SOLUTIONS.map((solution) => ({
            name: content.solutions[solution.id].h1,
            path: `/solutions/${solution.id}`,
          })),
        ),
      ]}
    >
      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.solutionsH1')}
          lede={t('pages.solutionsAnswerFirst')}
        />
      </div>

      {groups.map((group, index) => (
        <section
          key={group.sector}
          aria-labelledby={`group-${group.sector}`}
          className="mt-section"
        >
          <SectionHeader
            id={`group-${group.sector}`}
            title={t(`sectors.${group.sector}`)}
            eyebrow={index === 0 ? t('pages.solutionsGroupLabel') : undefined}
          />

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {group.solutions.map((solution) => {
              const copy = content.solutions[solution.id];
              return (
                <li key={solution.id}>
                  <Link
                    href={`/solutions/${solution.id}`}
                    className="group flex h-full flex-col gap-3 rounded-md border border-border-subtle p-6 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
                  >
                    <span
                      dir="ltr"
                      className="text-start text-lg font-semibold text-ink-accent tabular-nums"
                    >
                      {solution.grade.code}
                    </span>
                    <span dir="ltr" className="text-start text-xs text-ink-muted tabular-nums">
                      {formatInteger(solution.grade.mesh)} {t('units.mesh')} ·{' '}
                      {formatRange(solution.grade.d50Min, solution.grade.d50Max)}{' '}
                      {t('units.micron')}
                    </span>
                    <span className="text-sm text-ink-secondary">{copy.cardSummary}</span>
                    <span className="mt-auto pt-3 text-xs font-medium text-ink-accent">
                      {t('pages.solutionsReadMore')}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {/*
        Published coverage, stated rather than implied. An engineer looking at
        five grades and five sectors will notice that sixteen combinations are
        absent; saying why is more credible than letting them assume the pages
        were simply never written.
      */}
      <section aria-labelledby="coverage-heading" className="mt-section">
        <div className="rounded-md border-s-2 border-accent-700 bg-surface-sunken p-8">
          <SectionHeader id="coverage-heading" title={t('pages.solutionsCoverageHeading')} />
          <p className="measure-prose mt-6 text-ink-secondary">
            {t('pages.solutionsCoverageBody')}
          </p>
        </div>
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
