import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, Badge, Breadcrumbs, SectionHeader } from '@/components/primitives';
import { APPLICATION_SECTOR, SECTOR_IDS } from '@/content/schema';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { RfqTeaser } from '@/components/sections';
import { formatInteger, formatRange } from '@/lib/utils';
import { localeAlternates } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { SectorId } from '@/content/schema';

/**
 * Sector page.
 *
 * Four sections in the order a formulation engineer thinks in: the problem,
 * what the filler adds, what to watch on the line, and which grades to specify.
 * The recommended grades are derived from `APPLICATION_SECTOR`, so the list can
 * never drift from the matrix.
 *
 * Loading levels are the one thing this page cannot answer. The technical data
 * does not include them, so the section says so rather than quoting a plausible
 * range: a wrong loading figure costs a customer a trial batch, and that is a
 * far more expensive mistake than an honest gap.
 */

export function generateStaticParams() {
  return locales.flatMap((locale) => SECTOR_IDS.map((sector) => ({ locale, sector })));
}

const isSector = (value: string): value is SectorId =>
  (SECTOR_IDS as readonly string[]).includes(value);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}): Promise<Metadata> {
  const { locale, sector } = await params;
  if (!hasLocale(routing.locales, locale) || !isSector(sector)) notFound();

  const t = await getTranslations({ locale });
  const name = t(`sectors.${sector}`);

  return {
    title: t('pages.sectorTitleTemplate', { sector: name }),
    description: t('pages.sectorDescriptionTemplate', { sector: name }),
    alternates: localeAlternates(locale, `/applications/${sector}`),
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}) {
  const { locale, sector } = await params;
  if (!hasLocale(routing.locales, locale) || !isSector(sector)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  const grades = GRADES.filter((grade) =>
    grade.applications.some((application) => APPLICATION_SECTOR[application] === sector),
  );

  const applications = grades
    .flatMap((grade) =>
      grade.applications.filter((application) => APPLICATION_SECTOR[application] === sector),
    )
    .filter((application, index, all) => all.indexOf(application) === index);

  return (
    <PageShell locale={typedLocale}>
      <div className="pt-8">
        <Breadcrumbs
          label={t('ui.breadcrumb')}
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.applications'), href: '/applications' },
            { label: t(`sectors.${sector}`) },
          ]}
        />
      </div>

      <header className="pt-8">
        <h1 className="measure-lede text-4xl font-semibold text-ink-primary">
          {t(`sectors.${sector}`)}
        </h1>
        <p className="measure-prose mt-6 text-lg text-ink-secondary">
          {t(`sectorProblems.${sector}`)}
        </p>

        {applications.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {applications.map((application) => (
              <li key={application}>
                <Badge variant="neutral">{t(`applications.${application}`)}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {/* --------------------------------------------------- what it adds */}
      <section aria-labelledby="value-heading" className="mt-section">
        <SectionHeader id="value-heading" title={t('pages.sectorValueHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{t(`sectorValue.${sector}`)}</p>
      </section>

      {/* ------------------------------------------------------- process */}
      <section aria-labelledby="process-heading" className="mt-section">
        <SectionHeader id="process-heading" title={t('pages.sectorProcessHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{t(`sectorProcess.${sector}`)}</p>
      </section>

      {/* -------------------------------------------------------- grades */}
      <section aria-labelledby="grades-heading" className="mt-section">
        <SectionHeader
          id="grades-heading"
          title={t('pages.sectorGradesHeading')}
          lede={t(`sectorGradeReasoning.${sector}`)}
        />

        {grades.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grades.map((grade) => (
              <li key={grade.code}>
                <Link
                  href={`/products/${gradeSlug(grade.code)}`}
                  className="group flex h-full flex-col gap-2 rounded-md border border-border-subtle p-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
                >
                  <span
                    dir="ltr"
                    className="text-start text-lg font-semibold text-ink-accent tabular-nums"
                  >
                    {grade.code}
                  </span>
                  <span dir="ltr" className="text-start text-xs text-ink-muted tabular-nums">
                    {formatInteger(grade.mesh)} {t('units.mesh')} ·{' '}
                    {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                  </span>
                  <span className="mt-auto pt-3 text-xs text-ink-secondary">
                    {grade.coated ? t('grades.coated') : t('grades.uncoated')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-ink-muted">{t('sections.certificatePending')}</p>
        )}

        <p className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
          >
            {t('home.ctaProducts')}
            <ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------- loading */}
      <section aria-labelledby="loading-heading" className="mt-section">
        <SectionHeader id="loading-heading" title={t('pages.sectorLoadingHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">
          {t('pages.sectorLoadingPending')}
        </p>
      </section>

      <RfqTeaser className="mt-section" application={sector} />
    </PageShell>
  );
}
