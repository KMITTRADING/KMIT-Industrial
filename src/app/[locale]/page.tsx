import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, SectionHeader } from '@/components/primitives';
import {
  ApplicationCard,
  CertificationStrip,
  GradeMatrix,
  Hero,
  PackagingOptions,
  RfqTeaser,
  SpecTable,
} from '@/components/sections';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { SECTOR_IDS, SUPPLY_ARGUMENT_IDS } from '@/content/schema';
import { formatInteger } from '@/lib/utils';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Home.
 *
 * The order is the brief's, and it is unusual on purpose: a specification table
 * on a homepage is not a convention, and putting one there is the single
 * clearest signal this site can send to the engineer who is deciding whether
 * this supplier publishes numbers or adjectives.
 *
 * The grade strip sits directly under the hero, above the fold on desktop,
 * because it is the highest-intent element on the page: a buyer who knows they
 * need 1250 mesh should not have to scroll to find it.
 *
 * Eyebrow budget: eight sections, so at most two eyebrows. One is used, on the
 * hero. The section headings carry the rest on their own.
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

  const finest = GRADES.reduce((a, b) => (a.d50Min < b.d50Min ? a : b));
  const coarsest = GRADES.reduce((a, b) => (a.d50Max > b.d50Max ? a : b));

  return (
    <PageShell locale={typedLocale} bleed>
      {/* --------------------------------------------------------- 1. hero */}
      <Hero
        eyebrow={t('meta.tagline')}
        title={t('home.h1')}
        lede={t('home.answerFirst')}
        actions={
          <>
            {/*
              One primary action and one secondary, both links rather than
              buttons because they navigate. The labels are the site-wide ones:
              "Request a quote" appears in the nav, here, in the teaser and in
              the footer, and it is the same three words every time.
            */}
            <Link
              href="/rfq"
              className="inline-flex min-h-11 items-center rounded-sm bg-surface-accent px-6 py-3 text-sm font-medium text-ink-inverse transition-[background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-standard)] hover:bg-surface-accent-deep active:scale-[0.985]"
            >
              {t('nav.rfq')}
            </Link>
            <Link
              href="/resources"
              className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-6 py-3 text-sm font-medium text-ink-primary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent hover:text-ink-accent"
            >
              {t('pages.homeCtaTds')}
            </Link>
          </>
        }
        readings={[
          { label: t('parameters.caco3-purity'), value: '98.5%' },
          {
            label: t('grades.columnMesh'),
            value: `${formatInteger(coarsest.mesh)}-${formatInteger(finest.mesh)}`,
          },
          { label: t('grades.columnD50'), value: `${finest.d50Min}-${coarsest.d50Max} µm` },
        ]}
      />

      <div className="mx-auto max-w-[76rem] px-5 pb-section md:px-8">
        {/* -------------------------------------------------- 2. grade strip */}
        <section aria-labelledby="grade-strip-heading" className="pt-10">
          <h2 id="grade-strip-heading" className="text-sm font-semibold text-ink-primary">
            {t('pages.homeGradeStripHeading')}
          </h2>

          {/*
            An instrument readout, not a card row: five equal cells divided by
            hairlines, each a link, each carrying the two numbers that identify
            the grade. It scrolls horizontally on a phone rather than stacking,
            so the ladder from coarse to fine stays legible as a ladder.
          */}
          <ul className="mt-4 flex snap-x snap-mandatory gap-px overflow-x-auto bg-border-subtle">
            {GRADES.map((grade) => (
              <li key={grade.code} className="min-w-40 flex-1 snap-start bg-surface-page">
                <Link
                  href={`/products/${gradeSlug(grade.code)}`}
                  className="group flex h-full flex-col gap-1 p-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-raised"
                >
                  <span
                    dir="ltr"
                    className="text-start text-base font-semibold text-ink-accent tabular-nums"
                  >
                    {grade.code}
                  </span>
                  <span dir="ltr" className="text-start text-xs text-ink-muted tabular-nums">
                    {grade.d50Min}-{grade.d50Max} {t('units.micron')}
                  </span>
                  <span className="mt-auto pt-3 text-2xs text-ink-secondary">
                    {grade.coated ? t('grades.coated') : t('grades.uncoated')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------- 3. why in-Kingdom */}
        <section aria-labelledby="supply-heading" className="mt-section">
          <SectionHeader
            id="supply-heading"
            title={t('pages.homeSupplyHeading')}
            lede={t('pages.homeSupplyIntro')}
          />

          <dl className="mt-10 grid gap-px bg-border-subtle sm:grid-cols-2">
            {SUPPLY_ARGUMENT_IDS.map((argument) => (
              <div key={argument} className="flex flex-col gap-2 bg-surface-page p-6">
                <dt className="text-base font-semibold text-ink-primary">
                  {t(`supplyArguments.${argument}`)}
                </dt>
                <dd className="measure-prose text-sm text-ink-secondary">
                  {t(`supplyArgumentDetails.${argument}`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------- 4. applications */}
        <section aria-labelledby="applications-heading" className="mt-section">
          <SectionHeader
            id="applications-heading"
            title={t('pages.homeApplicationsHeading')}
            lede={t('pages.homeApplicationsIntro')}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SECTOR_IDS.map((sector) => (
              <ApplicationCard key={sector} sector={sector} href={`/applications/${sector}`} />
            ))}
          </div>
        </section>

        {/* ------------------------------------- 5. specification snapshot */}
        <section aria-labelledby="spec-heading" className="mt-section">
          <SectionHeader
            id="spec-heading"
            title={t('home.propertiesHeading')}
            lede={t('home.propertiesIntro')}
          />
          <SpecTable className="mt-10" />
        </section>

        {/* -------------------------------------------- 6. grade matrix */}
        <section aria-labelledby="matrix-heading" className="mt-section">
          <SectionHeader
            id="matrix-heading"
            title={t('home.gradesHeading')}
            lede={t('home.gradesIntro')}
          />
          <GradeMatrix className="mt-10" />
          <p className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
            >
              {t('home.ctaProducts')}
              <ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />
            </Link>
          </p>
        </section>

        {/* --------------------------------------- 7. quality & compliance */}
        <section aria-labelledby="quality-heading" className="mt-section">
          <SectionHeader
            id="quality-heading"
            title={t('pages.homeQualityHeading')}
            lede={t('sections.certificationsIntro')}
          />
          <CertificationStrip className="mt-10" />
        </section>

        {/* -------------------------------------- 8. packaging & logistics */}
        <section aria-labelledby="packaging-heading" className="mt-section">
          <SectionHeader
            id="packaging-heading"
            title={t('pages.homePackagingHeading')}
            lede={t('sections.packagingIntro')}
          />
          <PackagingOptions locale={typedLocale} className="mt-10" />
        </section>

        {/* ------------------------------------------------------- 9. RFQ */}
        <RfqTeaser className="mt-section" />
      </div>
    </PageShell>
  );
}
