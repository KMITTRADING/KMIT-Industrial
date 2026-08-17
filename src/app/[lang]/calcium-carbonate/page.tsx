import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CalciteExplorer } from '@/components/scenes/CalciteExplorer';
import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { Section } from '@/components/primitives';
import { Reveal } from '@/components/Reveal';
import { dict } from '@/content';
import { isLocale, LOCALES, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { faqSchema, pageGraph } from '@/lib/schema';

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
  return buildMetadata(lang as Locale, 'calcium-carbonate');
}

/**
 * The knowledge centre (§9, §15.1.5) — the strongest organic asset on the site,
 * because it answers questions people actually search for.
 *
 * Written to that shape: every heading is a question, and every answer states the
 * answer in its first two sentences before expanding, which is what featured
 * snippets and answer engines lift. FAQPage JSON-LD is emitted here and only here,
 * because these questions and answers are genuinely rendered on the page (§15.1.4).
 *
 * All of it is general science, described qualitatively. Zero product
 * specifications and zero figures attributed to KMIT (§4.5, §4.6).
 */
export default async function KnowledgePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'calcium-carbonate', [faqSchema(locale)])} />

      <PageHead
        locale={locale}
        trail={[{ label: d.knowledge.h1, route: 'calcium-carbonate' }]}
        h1={d.knowledge.h1}
        lead={d.knowledge.lead}
        watermark
      />

      {/* Interactive calcite explorer. The one bold element on this page — the
          rest reads as a reference document, which is also what makes it rank. */}
      <Section dark>
        <div className="content">
          <CalciteExplorer locale={locale} />
        </div>
      </Section>

      <Section>
        <div className="content">
          <h2 className="t-h2">{d.knowledge.faqHeading}</h2>

          <div className="faq" style={{ marginBlockStart: 'var(--s-12)' }}>
            {d.knowledge.faq.map((item, i) => (
              <Reveal key={item.q} className="faq-item" delay={Math.min(i, 3) * 60}>
                {/* A real heading, not a disclosure widget: the answer must be in
                    the page for a crawler and for anyone without JS (§15.1). */}
                <h3 className="t-h3">{item.q}</h3>
                <p className="t-body-l faq-answer">{item.a}</p>
              </Reveal>
            ))}
          </div>

          <p
            className="t-label"
            style={{ marginBlockStart: 'var(--s-12)', color: 'var(--ink-soft)' }}
          >
            {d.knowledge.note}
          </p>
        </div>
      </Section>
    </>
  );
}
