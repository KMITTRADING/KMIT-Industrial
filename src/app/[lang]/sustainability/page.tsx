import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { ArrowLink, PlaceholderBlock, Section } from '@/components/primitives';
import { Reveal } from '@/components/Reveal';
import { dict } from '@/content';
import { isLocale, LOCALES, pathFor, type Locale } from '@/lib/i18n';
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
  return buildMetadata(lang as Locale, 'sustainability');
}

/**
 * Sustainability and impact (§9).
 *
 * Written to acknowledge the trade-offs rather than to claim credit: a quarry
 * changes land, grinding uses energy, transport burns fuel. No impact figure is
 * stated, because none has been measured and supplied (§4.1).
 *
 * §14 bans a "sustainability green" accent, so this page is in the same two
 * indigos as everything else.
 */
export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'sustainability')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.sustainability.h1, route: 'sustainability' }]}
        h1={d.sustainability.h1}
        lead={d.sustainability.lead}
        watermark
      />

      <Section>
        <div className="content">
          <div className="prose">
            {d.sustainability.body.map((paragraph, i) => (
              <Reveal key={i} as="p" delay={i * 80} className="t-body-l measure">
                {paragraph}
              </Reveal>
            ))}
            <p>
              <ArrowLink href={pathFor(locale, 'sectors/solar-panels')}>
                {d.sustainability.energyLink}
              </ArrowLink>
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="content">
          {/* TODO-CONTENT: impact and consumption figures await measurement. */}
          <PlaceholderBlock label={d.placeholder.label} note={d.sustainability.dataNote} />
        </div>
      </Section>
    </>
  );
}
