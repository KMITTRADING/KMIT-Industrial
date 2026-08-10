import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ArrowInlineEndIcon, Badge, SectionHeader } from '@/components/primitives';
import { FaqList, RfqTeaser, SpecTable } from '@/components/sections';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { SOLUTIONS, findSolution } from '@/content/data/solutions';
import { faqPageJsonLd } from '@/lib/jsonld';
import { formatInteger, formatRange } from '@/lib/utils';
import { getContent } from '@/content';
import { gradeSlug } from '@/content/data/grades';
import { localeAlternates, withOpenGraph } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * One grade in one sector.
 *
 * The page sits between the grade page, which knows the specification and
 * nothing about the process, and the sector page, which knows the process and
 * treats every grade as a candidate. Neither can answer "should I run this
 * grade in this process", and that question is what a formulation engineer
 * actually arrives with.
 *
 * Nine of these exist and sixteen do not. `src/content/data/solutions.ts`
 * derives which, and docs/pseo-inventory.md records the reason for each
 * rejection. There is no route for a combination the grade specification does
 * not already claim, so this template cannot be used to invent a recommendation.
 *
 * The five body sections are written per combination rather than assembled from
 * a template with the grade code substituted in. If they were templated, the
 * page would be the thin content the inventory exists to prevent, and shipping
 * it would be worse than shipping nothing.
 */

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SOLUTIONS.map((solution) => ({ locale, solution: solution.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; solution: string }>;
}): Promise<Metadata> {
  const { locale, solution: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const solution = findSolution(slug);
  if (!solution) notFound();

  const copy = getContent(locale).solutions[solution.id];

  return withOpenGraph(locale as Locale, {
    title: copy.title,
    description: copy.description,
    alternates: localeAlternates(locale, `/solutions/${solution.id}`),
  });
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; solution: string }>;
}) {
  const { locale, solution: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const solution = findSolution(slug);
  if (!solution) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const content = getContent(typedLocale);
  const copy = content.solutions[solution.id];

  const { grade, adjacentGrade } = solution;

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[
        { name: t('pages.solutionsH1'), path: '/solutions' },
        { name: `${grade.code} / ${t(`sectors.${solution.sector}`)}` },
      ]}
      jsonLd={[faqPageJsonLd(content.solutionFaqs[solution.id])]}
    >
      <header className="pt-8">
        <h1 className="measure-lede text-4xl font-semibold text-ink-primary">{copy.h1}</h1>
        <p className="measure-prose mt-6 text-lg text-ink-secondary">{copy.answerFirst}</p>

        {/*
          The specification line, as a reader would read it aloud. Held in an
          LTR island because a hyphen between two numerals resolves to the
          paragraph direction, which reverses the range on an Arabic page.
        */}
        <p dir="ltr" className="mt-8 text-start text-sm text-ink-muted tabular-nums">
          {grade.code} · {formatInteger(grade.mesh)} {t('units.mesh')} ·{' '}
          {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')} ·{' '}
          {grade.coated ? t('grades.coated') : t('grades.uncoated')}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {solution.applications.map((application) => (
            <li key={application}>
              <Badge variant="neutral">{t(`applications.${application}`)}</Badge>
            </li>
          ))}
        </ul>
      </header>

      {/* ------------------------------------------------------- the problem */}
      <section aria-labelledby="problem-heading" className="mt-section">
        <SectionHeader id="problem-heading" title={t('pages.solutionProblemHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{copy.problem}</p>
      </section>

      {/* ---------------------------------------------------------- the size */}
      <section aria-labelledby="sizing-heading" className="mt-section">
        <SectionHeader id="sizing-heading" title={t('pages.solutionSizingHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{copy.sizing}</p>
      </section>

      {/*
        Loading. The technical data carries no loading levels, so this section
        describes what governs the ceiling rather than where it sits. A
        plausible-looking phr figure would cost a formulator a trial batch,
        which is a far more expensive mistake than an honest gap.
      */}
      <section aria-labelledby="loading-heading" className="mt-section">
        <SectionHeader id="loading-heading" title={t('pages.solutionLoadingHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{copy.loading}</p>
      </section>

      {/* ------------------------------------------------------ on the line */}
      <section aria-labelledby="processing-heading" className="mt-section">
        <SectionHeader id="processing-heading" title={t('pages.solutionProcessingHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{copy.processing}</p>
      </section>

      {/* ---------------------------------------------------- specification */}
      <section aria-labelledby="spec-heading" className="mt-section">
        <SectionHeader
          id="spec-heading"
          title={t('pages.solutionSpecHeading')}
          lede={t('pages.solutionSpecIntro')}
        />
        <SpecTable className="mt-10" />
      </section>

      {/* --------------------------------------------- against the neighbour */}
      <section aria-labelledby="versus-heading" className="mt-section">
        <SectionHeader id="versus-heading" title={t('pages.solutionVersusHeading')} />
        <p className="measure-prose mt-6 text-ink-secondary">{copy.versus}</p>

        {adjacentGrade ? (
          <p className="mt-8">
            <Link
              href={`/products/${gradeSlug(adjacentGrade.code)}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
            >
              <span dir="ltr">{adjacentGrade.code}</span>
              <ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />
            </Link>
          </p>
        ) : null}
      </section>

      {/*
        FAQ. The narrowest questions on the site: each one needs both halves,
        the grade and the process, to have an answer at all.
      */}
      <section aria-labelledby="faq-heading" className="mt-section">
        <SectionHeader
          id="faq-heading"
          title={t('pages.solutionFaqHeading')}
          lede={t('sections.faqIntro')}
        />
        <FaqList
          className="mt-4"
          idPrefix={`faq-${solution.id}`}
          faqs={content.solutionFaqs[solution.id]}
        />
      </section>

      {/* --------------------------------------------------- wider context */}
      <section aria-labelledby="context-heading" className="mt-section">
        <SectionHeader id="context-heading" title={t('pages.solutionContextHeading')} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          <li>
            <Link
              href={`/products/${gradeSlug(grade.code)}`}
              className="group flex h-full flex-col gap-2 rounded-md border border-border-subtle p-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
            >
              <span className="text-sm font-medium text-ink-accent">
                {t('pages.solutionContextGrade')}
              </span>
              <span dir="ltr" className="text-start text-xs text-ink-muted tabular-nums">
                {grade.code}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/applications/${solution.sector}`}
              className="group flex h-full flex-col gap-2 rounded-md border border-border-subtle p-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-ink-accent"
            >
              <span className="text-sm font-medium text-ink-accent">
                {t('pages.solutionContextSector')}
              </span>
              <span className="text-xs text-ink-muted">{t(`sectors.${solution.sector}`)}</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* Both parameters prefilled: the reader has already told us both. */}
      <RfqTeaser className="mt-section" grade={grade.code} application={solution.sector} />
    </PageShell>
  );
}
