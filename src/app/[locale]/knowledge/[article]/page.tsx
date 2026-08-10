import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { ARTICLES, findArticle } from '@/content/data/knowledge';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { GradeTable, RfqTeaser, SpecTable } from '@/components/sections';
import { FaqList } from '@/components/sections';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/layout';
import { SectionHeader } from '@/components/primitives';
import { articleJsonLd, faqPageJsonLd } from '@/lib/jsonld';
import { formatRange } from '@/lib/utils';
import { getContent } from '@/content';
import { localeAlternates, withOpenGraph } from '@/lib/seo';
import { locales, routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * One technical article.
 *
 * Four sections and a table, and the table is one the site already renders
 * elsewhere rather than a set of numbers copied into the article. An article
 * about what a D50 governs that restated the grade figures would be a second
 * copy of the specification, free to drift from the first; pointing at the same
 * component the grade pages use means it cannot.
 *
 * The grades each article bears on are declared in
 * `src/content/data/knowledge.ts` rather than linked from inside translated
 * prose, where a link rots the first time a grade code changes and rots
 * differently in each locale.
 */

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, article: article.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; article: string }>;
}): Promise<Metadata> {
  const { locale, article: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const article = findArticle(slug);
  if (!article) notFound();

  const copy = getContent(locale).knowledge[article.id];

  return withOpenGraph(
    locale as Locale,
    {
      title: copy.title,
      description: copy.description,
      alternates: localeAlternates(locale, `/knowledge/${article.id}`),
    },
    { ogType: 'article' },
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; article: string }>;
}) {
  const { locale, article: slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const article = findArticle(slug);
  if (!article) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();
  const content = getContent(typedLocale);
  const copy = content.knowledge[article.id];

  const related = GRADES.filter((grade) =>
    (article.grades as readonly string[]).includes(grade.code),
  );

  const sections = [
    { heading: copy.s1Heading, body: copy.s1Body },
    { heading: copy.s2Heading, body: copy.s2Body },
    { heading: copy.s3Heading, body: copy.s3Body },
    { heading: copy.s4Heading, body: copy.s4Body },
  ];

  return (
    <PageShell
      locale={typedLocale}
      crumbs={[{ name: t('pages.knowledgeH1'), path: '/knowledge' }, { name: copy.h1 }]}
      jsonLd={[
        articleJsonLd(typedLocale, {
          path: `/knowledge/${article.id}`,
          headline: copy.h1,
          description: copy.description,
        }),
        faqPageJsonLd(content.knowledgeFaqs[article.id]),
      ]}
    >
      <div className="pt-8">
        <SectionHeader as="h1" size="lg" title={copy.h1} lede={copy.answerFirst} />
      </div>

      {sections.map((section, index) => (
        <section
          key={section.heading}
          aria-labelledby={`section-${index}`}
          className="mt-section"
        >
          <SectionHeader id={`section-${index}`} title={section.heading} />
          <p className="measure-prose mt-6 text-ink-secondary">{section.body}</p>
        </section>
      ))}

      {/* The site's own table, not a copy of its numbers. */}
      <section aria-labelledby="table-heading" className="mt-section">
        <SectionHeader id="table-heading" title={copy.tableHeading} lede={copy.tableIntro} />
        {article.table === 'grades' ? (
          <GradeTable className="mt-10" />
        ) : (
          <SpecTable className="mt-10" />
        )}
      </section>

      <section aria-labelledby="faq-heading" className="mt-section">
        <SectionHeader id="faq-heading" title={t('pages.articleFaqHeading')} />
        <FaqList
          className="mt-4"
          idPrefix={`faq-${article.id}`}
          faqs={content.knowledgeFaqs[article.id]}
        />
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-section">
          <SectionHeader id="related-heading" title={t('pages.articleRelatedHeading')} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((grade) => (
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
                    {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
