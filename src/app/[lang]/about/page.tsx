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
import { SITE } from '@/lib/site';

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
  return buildMetadata(lang as Locale, 'about');
}

/**
 * About the group (§9).
 *
 * The timeline has scroll-triggered markers but no invented years: `SITE.founded`
 * is null, so the milestones render as a designed PlaceholderBlock instead (§4.4).
 * Vision and principles are set as editorial text at a large size rather than as
 * a grid of cards, which is what §9 asks for and what §14 bans the alternative of.
 */
export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'about')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.about.h1, route: 'about' }]}
        h1={d.about.h1}
        lead={d.about.lead}
      />

      <Section>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{d.about.visionHeading}</h2>
            <div className="prose">
              {d.about.body.map((paragraph, i) => (
                <Reveal key={i} as="p" delay={i * 80} className="t-body-l measure">
                  {paragraph}
                </Reveal>
              ))}
              <Reveal as="p" className="t-body-l measure t-em" delay={160}>
                {d.about.visionBody}
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{d.about.timelineHeading}</h2>
            <div>
              {/*
                TODO-CONTENT: founding year and the milestone dates are not in §1.
                No year is guessed and no placeholder date is displayed as if real.
              */}
              {SITE.founded === null ? (
                <PlaceholderBlock label={d.placeholder.label} note={d.about.timelineNote} />
              ) : (
                <ol className="timeline">
                  <li className="timeline-item">
                    <p className="t-label ltr-num">{SITE.founded}</p>
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="content">
          <div className="split">
            <h2 className="t-h2 split-heading">{d.about.principlesHeading}</h2>
            <ul className="stack-list">
              {d.about.principlesBody.map((principle, i) => (
                <Reveal key={i} as="li" delay={i * 80} className="t-body-l measure">
                  {principle}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
