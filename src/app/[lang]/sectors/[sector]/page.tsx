import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { ArrowLink, Section } from '@/components/primitives';
import { Reveal } from '@/components/Reveal';
import { SectorScenePanel } from '@/components/scenes/SectorScenePanel';
import { dict } from '@/content';
import { isLocale, LOCALES, pathFor, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { pageGraph } from '@/lib/schema';
import {
  isSectorSlug,
  otherSectors,
  SECTOR_SLUGS,
  sectorContent,
  sectorRoute,
  type SectorSlug,
} from '@/lib/sectors';

/**
 * One template, three sectors (§9). Same structure — definition, scope, why it
 * matters, then the bar leading to the other two — with genuinely different
 * content in each.
 *
 * The header reuses the sector's own geometry from §8.3, held static and turning
 * slowly rather than scrubbed, so the home page and the sector page are visibly
 * the same object.
 */

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SECTOR_SLUGS.map((sector) => ({ lang, sector })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; sector: string }>;
}): Promise<Metadata> {
  const { lang, sector } = await params;
  if (!isLocale(lang) || !isSectorSlug(sector)) return {};
  return buildMetadata(lang as Locale, sectorRoute(sector));
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ lang: string; sector: string }>;
}) {
  const { lang, sector } = await params;
  if (!isLocale(lang) || !isSectorSlug(sector)) notFound();
  const locale = lang as Locale;
  const slug = sector as SectorSlug;
  const d = dict(locale);
  const content = sectorContent(locale, slug);

  return (
    <>
      <JsonLd data={pageGraph(locale, sectorRoute(slug))} />

      <PageHead
        locale={locale}
        trail={[
          { label: d.sectors.h1, route: 'sectors' },
          { label: content.h1, route: sectorRoute(slug) },
        ]}
        h1={content.h1}
        lead={content.lead}
        word={content.word}
      >
        <SectorScenePanel sector={slug} description={content.sceneDescription} />
      </PageHead>

      <Section>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{content.defHeading}</h2>
            <div className="prose">
              {content.defBody.map((paragraph, i) => (
                <Reveal key={i} as="p" delay={i * 80} className="t-body-l measure">
                  {paragraph}
                </Reveal>
              ))}
              {'knowledgeLink' in content && (
                <p>
                  <ArrowLink href={pathFor(locale, 'calcium-carbonate')}>
                    {content.knowledgeLink}
                  </ArrowLink>
                </p>
              )}
              {'sustainabilityLink' in content && (
                <p>
                  <ArrowLink href={pathFor(locale, 'sustainability')}>
                    {content.sustainabilityLink}
                  </ArrowLink>
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{content.scopeHeading}</h2>
            <ul className="stack-list">
              {content.scopeBody.map((item, i) => (
                <Reveal key={i} as="li" delay={i * 60} className="t-body-l">
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section dark>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{content.whyHeading}</h2>
            <p className="t-body-l measure">{content.whyBody}</p>
          </div>
        </div>
      </Section>

      {/* "KMIT also works on" — the two sibling sectors (§9). */}
      <Section>
        <div className="content">
          <h2 className="t-h3">{d.sectors.alsoHeading}</h2>
          <div className="crosslinks" style={{ marginBlockStart: 'var(--s-8)' }}>
            {otherSectors(slug).map((other) => {
              const otherContent = sectorContent(locale, other);
              return (
                <Link
                  key={other}
                  href={pathFor(locale, sectorRoute(other))}
                  className="crosslink chamfer"
                >
                  <span className="t-label" style={{ color: 'var(--ink-soft)' }}>
                    {otherContent.word}
                  </span>{' '}
                  <span className="t-h3">{otherContent.h1}</span>
                  <span className="t-body" style={{ color: 'var(--ink-soft)' }}>
                    {otherContent.lead}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
