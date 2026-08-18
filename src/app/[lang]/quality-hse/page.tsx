import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { PlaceholderBlock, Section } from '@/components/primitives';
import { Reveal } from '@/components/Reveal';
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
  return buildMetadata(lang as Locale, 'quality-hse');
}

/**
 * Quality, safety and environment (§9).
 *
 * Approach and principles only. No certification or accreditation name appears
 * anywhere on this page — none was supplied, and inventing one here would be the
 * single most damaging fabrication on the site (§4.2). The gap is a designed
 * PlaceholderBlock instead.
 */
export default async function QualityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  const blocks = [
    { heading: d.quality.qualityHeading, body: d.quality.qualityBody },
    { heading: d.quality.safetyHeading, body: d.quality.safetyBody },
    { heading: d.quality.envHeading, body: d.quality.envBody },
  ];

  return (
    <>
      <JsonLd data={pageGraph(locale, 'quality-hse')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.quality.h1, route: 'quality-hse' }]}
        h1={d.quality.h1}
        lead={d.quality.lead}
      />

      {blocks.map((block) => (
        <Section key={block.heading}>
          <div className="content">
            <div className="split">
              <h2 className="t-h2 split-heading">{block.heading}</h2>
              <div className="prose">
                {block.body.map((paragraph, i) => (
                  <Reveal key={i} as="p" delay={i * 80} className="t-body-l measure">
                    {paragraph}
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section>
        <div className="content">
          {/* TODO-CONTENT: certification and accreditation names await approval. */}
          <PlaceholderBlock label={d.placeholder.label} note={d.quality.certNote} />
        </div>
      </Section>
    </>
  );
}
