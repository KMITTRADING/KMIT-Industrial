import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SiteForm } from '@/components/forms/SiteForm';
import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { Bezel, Section } from '@/components/primitives';
import { dict } from '@/content';
import { isLocale, LOCALES, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { pageGraph } from '@/lib/schema';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildMetadata(lang as Locale, 'careers');
}

/**
 * Careers (§9).
 *
 * The empty state is designed rather than apologetic: there are no open roles
 * because none were supplied, so the page says exactly that and offers the useful
 * next step. No invented vacancy, no invented headcount (§4.1).
 */
export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'careers')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.careers.h1, route: 'careers' }]}
        h1={d.careers.h1}
        lead={d.careers.lead}
      />

      <Section>
        <div className="content">
          <p className="t-body-l measure prose-lead">{d.careers.body}</p>

          {/*
            TODO-CONTENT: no vacancy list supplied. This is the real empty state,
            not a placeholder for one.
          */}
          <div style={{ marginBlockStart: 'var(--s-12)', maxInlineSize: '46rem' }}>
            <Bezel chamfer>
              <div style={{ padding: 'var(--s-8)' }}>
                <h2 className="t-h3">{d.careers.emptyTitle}</h2>
                <p className="t-body" style={{ marginBlockStart: 'var(--s-3)', color: 'var(--ink-soft)' }}>
                  {d.careers.emptyBody}
                </p>
              </div>
            </Bezel>
          </div>
        </div>
      </Section>

      <Section>
        <div className="content">
          <h2 className="t-h2">{d.careers.formHeading}</h2>
          <div style={{ marginBlockStart: 'var(--s-8)', maxInlineSize: '46rem' }}>
            <SiteForm locale={locale} variant="careers" />
          </div>
        </div>
      </Section>
    </>
  );
}
