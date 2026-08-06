import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { GRADES, TYPICAL_PROPERTIES } from '@/content/data/grades';
import { localeAlternates } from '@/lib/seo';
import { formatInteger, formatRange } from '@/lib/utils';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Foundation home page.
 *
 * This is not the designed home page — that is Phase 3. What it is: a real page
 * built entirely from the typed dataset and the content tree, proving the
 * pipeline end to end. Both spec tables render as semantic `<table>` elements
 * with captions and scoped headers, which is the markup that gets extracted
 * into rich results and AI answers, and it is the shape Phase 3 inherits rather
 * than replaces.
 *
 * Every number on this page comes from src/content/data/grades.ts, which comes
 * from docs/technical-data.md. There is no number in the copy.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  return (
    <>
      <SiteHeader locale={typedLocale} />

      <main id="main" className="mx-auto max-w-[76rem] px-5 py-section md:px-8">
        <h1 className="max-w-[22ch] text-4xl font-semibold text-ink-primary">{t('home.h1')}</h1>

        <p className="mt-8 max-w-[62ch] text-lg text-ink-secondary">{t('home.answerFirst')}</p>

        {/* ---------------------------------------------- grade matrix */}
        <section aria-labelledby="grades-heading" className="mt-section">
          <h2 id="grades-heading" className="text-2xl font-semibold text-ink-primary">
            {t('home.gradesHeading')}
          </h2>
          <p className="mt-4 max-w-[62ch] text-ink-secondary">{t('home.gradesIntro')}</p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <caption className="pb-4 text-start text-sm text-ink-muted">
                {t('grades.caption')}
              </caption>
              <thead>
                <tr className="border-b border-border-strong">
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('grades.columnCode')}
                  </th>
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('grades.columnMesh')}
                  </th>
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('grades.columnD50')}
                  </th>
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('grades.columnCoating')}
                  </th>
                  <th scope="col" className="py-3 font-semibold text-ink-primary">
                    {t('grades.columnApplications')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {GRADES.map((grade) => (
                  <tr key={grade.code} className="border-b border-border-subtle">
                    <th
                      scope="row"
                      dir="ltr"
                      className="py-4 pe-4 text-start font-semibold text-ink-accent"
                    >
                      {grade.code}
                    </th>
                    <td dir="ltr" className="py-4 pe-4 text-start text-ink-secondary">
                      {formatInteger(grade.mesh)}
                    </td>
                    <td dir="ltr" className="py-4 pe-4 text-start text-ink-secondary">
                      {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                    </td>
                    <td className="py-4 pe-4 text-ink-secondary">
                      {grade.coatingLevel
                        ? t('grades.coatingWithLevel', {
                            agent: t(`coatingAgents.${grade.coatingLevel.agent}`),
                            min: grade.coatingLevel.min.toFixed(1),
                            max: grade.coatingLevel.max.toFixed(1),
                          })
                        : t('grades.uncoated')}
                    </td>
                    <td className="py-4 text-ink-secondary">
                      {grade.applications
                        .map((application) => t(`applications.${application}`))
                        .join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ----------------------------------------- typical properties */}
        <section aria-labelledby="properties-heading" className="mt-section">
          <h2 id="properties-heading" className="text-2xl font-semibold text-ink-primary">
            {t('home.propertiesHeading')}
          </h2>
          <p className="mt-4 max-w-[62ch] text-ink-secondary">{t('home.propertiesIntro')}</p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="pb-4 text-start text-sm text-ink-muted">
                {t('properties.caption')}
              </caption>
              <thead>
                <tr className="border-b border-border-strong">
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('properties.columnParameter')}
                  </th>
                  <th scope="col" className="py-3 pe-4 font-semibold text-ink-primary">
                    {t('properties.columnValue')}
                  </th>
                  <th scope="col" className="py-3 font-semibold text-ink-primary">
                    {t('properties.columnMethod')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TYPICAL_PROPERTIES.map((property) => (
                  <tr key={property.id} className="border-b border-border-subtle">
                    <th
                      scope="row"
                      className="py-4 pe-4 text-start font-medium text-ink-primary"
                    >
                      {t(`parameters.${property.id}`)}
                    </th>
                    <td dir="ltr" className="py-4 pe-4 text-start text-ink-secondary">
                      {property.value}
                      {property.unit ? ` ${property.unit}` : ''}
                    </td>
                    <td dir="ltr" className="py-4 text-start text-ink-secondary">
                      {property.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[62ch] text-sm text-ink-muted">
            {t('properties.familyLevelNote')}
          </p>
        </section>
      </main>

      <SiteFooter locale={typedLocale} />
    </>
  );
}
