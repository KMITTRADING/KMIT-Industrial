import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactRows } from '@/components/ContactRows';
import { SiteForm } from '@/components/forms/SiteForm';
import { JeddahMap } from '@/components/JeddahMap';
import { JsonLd } from '@/components/JsonLd';
import { PageHead } from '@/components/PageHead';
import { Bezel, Section } from '@/components/primitives';
import { dict } from '@/content';
import { isLocale, LOCALES, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { pageGraph } from '@/lib/schema';
import { MAP_URL, SITE } from '@/lib/site';

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
  return buildMetadata(lang as Locale, 'contact');
}

/**
 * Contact (§9). Form, details and the drawn map.
 *
 * Jeddah and Saudi Arabia appear in the page prose because this is the page that
 * should rank for them locally (§15.1.3) — as sentences, not as a keyword list.
 */
export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = dict(locale);

  return (
    <>
      <JsonLd data={pageGraph(locale, 'contact')} />

      <PageHead
        locale={locale}
        trail={[{ label: d.contactPage.h1, route: 'contact' }]}
        h1={d.contactPage.h1}
        lead={d.contactPage.lead}
      />

      <Section>
        <div className="content">
          <div className="presence-grid">
            <div>
              <h2 className="t-h2">{d.contactPage.formHeading}</h2>
              <div style={{ marginBlockStart: 'var(--s-8)' }}>
                <SiteForm locale={locale} variant="contact" />
              </div>
            </div>

            <div>
              <h2 className="t-h2">{d.contactPage.detailsHeading}</h2>
              <div style={{ marginBlockStart: 'var(--s-8)' }}>
                <ContactRows locale={locale} size={24} />
              </div>

              <p className="t-body" style={{ marginBlockStart: 'var(--s-8)', color: 'var(--ink-soft)' }}>
                {locale === 'ar'
                  ? `مقر ${SITE.nameAr} في ${SITE.hqCityAr}، ${SITE.countryAr}.`
                  : `${SITE.nameEn} is based in ${SITE.hqCityEn}, ${SITE.countryEn}.`}
              </p>

              <div style={{ marginBlockStart: 'var(--s-8)' }}>
                <Bezel>
                  <figure className="presence-map">
                    <JeddahMap label={d.contact.mapAlt} />
                    <figcaption className="presence-map-caption">
                      <span className="t-label">{d.contact.mapCaption}</span>
                      <a
                        className="link-inline t-label"
                        href={MAP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {d.contact.mapOpen}
                      </a>
                    </figcaption>
                  </figure>
                </Bezel>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
