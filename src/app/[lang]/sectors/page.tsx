import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowForward } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { Section } from '@/components/primitives';
import { Reveal } from '@/components/Reveal';
import { dict } from '@/content';
import { isLocale, LOCALES, pathFor, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { pageGraph } from '@/lib/schema';
import { SECTOR_SLUGS, sectorContent, sectorRoute } from '@/lib/sectors';

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
  return buildMetadata(lang as Locale, 'sectors');
}

/**
 * Sector index (§7). Three entries at deliberately unequal weight — the minerals
 * sector is the deepest and reads first and largest — rather than three matching
 * cards, which §14 bans.
 */
export default async function SectorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'sectors')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.sectors.h1, route: 'sectors' }]}
        h1={d.sectors.h1}
        lead={d.sectors.lead}
      />

      <Section>
        <div className="content">
          <p className="t-body-l measure prose-lead">{d.sectors.body}</p>

          <ol className="sector-index" style={{ marginBlockStart: 'var(--s-16)' }}>
            {SECTOR_SLUGS.map((slug, i) => {
              const sector = sectorContent(locale, slug);
              return (
                <Reveal as="li" key={slug} delay={i * 80} className="sector-index-item">
                  <Link href={pathFor(locale, sectorRoute(slug))} className="sector-index-link">
                    <p className="t-label" style={{ color: 'var(--ink-soft)' }}>
                      {sector.word}
                    </p>
                    <h2 className={i === 0 ? 't-display-l' : 't-h2'}>{sector.h1}</h2>
                    <p className="t-body-l measure" style={{ color: 'var(--ink-soft)' }}>
                      {sector.lead}
                    </p>
                    <span className="link-inline">
                      <span>{d.sectors.readSector}</span>
                      <ArrowForward size={16} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Section>
    </>
  );
}
