import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, Badge, SectionHeader } from '@/components/primitives';
import {
  DocumentDownloadRow,
  FaqList,
  ParticleSizeChart,
  RfqTeaser,
  SpecTable,
} from '@/components/sections';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { APPLICATION_SECTOR, PACKAGING_IDS } from '@/content/schema';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { formatInteger, formatRange } from '@/lib/utils';
import { getContent } from '@/content';
import { faqPageJsonLd, productJsonLd } from '@/lib/jsonld';
import { localeAlternates } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { GradeCodeId } from '@/content/schema';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Grade page.
 *
 * The most specific document on the site and the one most likely to be the
 * landing page for a specification query, so it carries the full argument on
 * its own: what the grade is, every published number with its test method,
 * where it sits in the range, what it is used for, how it ships, what documents
 * exist, the questions a formulator actually asks, and a prefilled way to ask
 * for a quote.
 *
 * Statically generated for all five grades in both locales. There are ten
 * documents in total; generating them at request time would be a needless
 * runtime cost on the highest-value pages on the site.
 */

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    GRADES.map((grade) => ({ locale, grade: gradeSlug(grade.code) })),
  );
}

function findBySlug(slug: string) {
  return GRADES.find((grade) => gradeSlug(grade.code) === slug.toLowerCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; grade: string }>;
}): Promise<Metadata> {
  const { locale, grade: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const grade = findBySlug(slug);
  if (!grade) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });
  const d50 = formatRange(grade.d50Min, grade.d50Max);

  return {
    title: t('gradeTitleTemplate', { code: grade.code, mesh: grade.mesh }),
    description: t('gradeDescriptionTemplate', {
      code: grade.code,
      mesh: grade.mesh,
      d50,
    }),
    alternates: localeAlternates(locale, `/products/${gradeSlug(grade.code)}`),
  };
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ locale: string; grade: string }>;
}) {
  const { locale, grade: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const grade = findBySlug(slug);
  if (!grade) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  // `relatedGrades` is a literal tuple under `as const`, so widen it before
  // membership testing rather than casting each code at the call site.
  const relatedCodes = grade.relatedGrades as readonly string[];
  const related = GRADES.filter((entry) => relatedCodes.includes(entry.code));
  const sectors = [
    ...new Set(grade.applications.map((application) => APPLICATION_SECTOR[application])),
  ];

  const coatingSentence = grade.coatingLevel
    ? t('grades.coatingWithLevel', {
        agent: t(`coatingAgents.${grade.coatingLevel.agent}`),
        min: grade.coatingLevel.min.toFixed(1),
        max: grade.coatingLevel.max.toFixed(1),
      })
    : t('grades.uncoated');

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('nav.products'), path: '/products' }, { name: grade.code }]}
      jsonLd={[
        productJsonLd(typedLocale, grade, {
          description: t('pages.gradeDescriptionTemplate', {
            code: grade.code,
            mesh: grade.mesh,
            d50: formatRange(grade.d50Min, grade.d50Max),
          }),
          canonicalPath: `/products/${gradeSlug(grade.code)}`,
        }),
        faqPageJsonLd(getContent(typedLocale).gradeFaqs[grade.code as GradeCodeId]),
      ]}
    >
      <header className="pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1
            dir="ltr"
            className="text-start text-4xl font-semibold text-ink-primary tabular-nums"
          >
            {grade.code}
          </h1>
          <Badge variant="grade">
            {formatInteger(grade.mesh)} {t('units.mesh')}
          </Badge>
          <Badge variant={grade.coated ? 'certification' : 'neutral'}>{coatingSentence}</Badge>
        </div>

        <p className="measure-prose mt-6 text-lg text-ink-secondary">
          {t('pages.gradeAnswerFirstTemplate', {
            code: grade.code,
            mesh: grade.mesh,
            d50: formatRange(grade.d50Min, grade.d50Max),
            coating: grade.coatingLevel
              ? t('pages.gradeCoatingHeading') + ': ' + coatingSentence + '.'
              : t('grades.uncoated') + '.',
            applications: grade.applications
              .map((application) => t(`applications.${application}`))
              .join(', '),
          })}
        </p>
      </header>

      {/* ------------------------------------------------------ properties */}
      <section aria-labelledby="properties-heading" className="mt-section">
        <SectionHeader
          id="properties-heading"
          title={t('pages.gradePropertiesHeading')}
          lede={t('home.propertiesIntro')}
        />
        <SpecTable className="mt-10" />
      </section>

      {/* ------------------------------------------------------------ PSD */}
      <section aria-labelledby="psd-heading" className="mt-section">
        <SectionHeader id="psd-heading" title={t('pages.gradePsdHeading')} />
        <ParticleSizeChart activeGrade={grade.code} className="mt-10" />
      </section>

      {/* --------------------------------------------------- applications */}
      <section aria-labelledby="applications-heading" className="mt-section">
        <SectionHeader id="applications-heading" title={t('pages.gradeApplicationsHeading')} />

        <ul className="mt-8 flex flex-wrap gap-2">
          {grade.applications.map((application) => (
            <li key={application}>
              <Badge variant="neutral">{t(`applications.${application}`)}</Badge>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-col gap-3">
          {sectors.map((sector) => (
            <li key={sector}>
              <Link
                href={`/applications/${sector}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
              >
                {t(`sectors.${sector}`)}
                <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------- packaging and storage */}
      <section aria-labelledby="packaging-heading" className="mt-section">
        <SectionHeader
          id="packaging-heading"
          title={t('pages.gradePackagingHeading')}
          lede={t('sections.packagingIntro')}
        />

        <ul className="mt-8 flex flex-col gap-2 text-sm text-ink-secondary">
          {PACKAGING_IDS.map((packaging) => (
            <li key={packaging}>{t(`packaging.${packaging}`)}</li>
          ))}
        </ul>

        <dl className="mt-8 grid gap-6 border-t border-border-subtle pt-8 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-ink-primary">
              {t('sections.storageHeading')}
            </dt>
            <dd className="measure-prose mt-2 text-sm text-ink-secondary">
              {t('sections.storageBody')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink-primary">
              {t('grades.shelfLife', { months: grade.shelfLifeMonths })}
            </dt>
            <dd className="measure-prose mt-2 text-sm text-ink-secondary">
              {grade.coated ? t('sections.shelfLifeCoated') : t('sections.shelfLifeUncoated')}
            </dd>
          </div>
        </dl>
      </section>

      {/* ------------------------------------------------------ documents */}
      <section aria-labelledby="documents-heading" className="mt-section">
        <SectionHeader
          id="documents-heading"
          title={t('pages.gradeDocumentsHeading')}
          lede={t('sections.documentsIntro')}
        />
        <DocumentDownloadRow grade={grade.code} className="mt-8" />
      </section>

      {/*
        FAQ. Grade-specific and rendered open rather than behind an accordion:
        these answers are the most extractable passages on the page, and the
        engineer skimming before they request a sample is reading them, not
        clicking through them.
      */}
      <section aria-labelledby="faq-heading" className="mt-section">
        <SectionHeader id="faq-heading" title={t('pages.gradeFaqHeading')} />
        <FaqList
          className="mt-4"
          idPrefix={`faq-${gradeSlug(grade.code)}`}
          faqs={getContent(typedLocale).gradeFaqs[grade.code as GradeCodeId]}
        />
      </section>

      {/* -------------------------------------------------------- related */}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-section">
          <SectionHeader id="related-heading" title={t('pages.gradeRelatedHeading')} />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {related.map((entry) => (
              <li key={entry.code}>
                <Link
                  href={`/products/${gradeSlug(entry.code)}`}
                  className="group flex flex-col gap-2 rounded-md border border-border-subtle p-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
                >
                  <span className="text-2xs font-medium text-ink-muted">
                    {entry.mesh > grade.mesh
                      ? t('pages.gradeRelatedFiner')
                      : t('pages.gradeRelatedCoarser')}
                  </span>
                  <span
                    dir="ltr"
                    className="text-start text-lg font-semibold text-ink-accent tabular-nums"
                  >
                    {entry.code}
                  </span>
                  <span dir="ltr" className="text-start text-xs text-ink-muted tabular-nums">
                    {formatRange(entry.d50Min, entry.d50Max)} {t('units.micron')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <RfqTeaser className="mt-section" grade={grade.code} />
    </PageShell>
  );
}
