import { dict } from '@/content';
import { pathFor, type Locale } from '@/lib/i18n';
import { MAP_URL, SITE } from '@/lib/site';
import { ArrowUpRight } from '../Icons';
import { ContactRows } from '../ContactRows';
import { Bezel, Section, StatelessCTA } from '../primitives';
import { JeddahMap } from '../JeddahMap';

/**
 * Presence and contact (§8.7). Split in two: a custom line map of Jeddah on one
 * side, the three contact rows and one call to action on the other.
 *
 * The map is drawn rather than embedded — no third-party tiles, no provider
 * branding, no cookies, nothing to load, and the location marker is the KMIT icon
 * itself rather than a default pin (§8.7). It shows the head office only: no
 * operating sites or quarries are implied, because none were supplied (§4, §8.7).
 */
export function PresenceContact({ locale }: { locale: Locale }) {
  const d = dict(locale);

  return (
    <Section labelledBy="contact-heading">
      <div className="content">
        <h2 id="contact-heading" className="t-h2">
          {d.contact.heading}
        </h2>
        <p
          className="t-body-l measure"
          style={{ marginBlockStart: 'var(--s-4)', color: 'var(--ink-soft)' }}
        >
          {d.contact.lead}
        </p>

        <div className="presence-grid" style={{ marginBlockStart: 'var(--s-12)' }}>
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
                  <span>{d.contact.mapOpen}</span>
                  <ArrowUpRight size={14} />
                </a>
              </figcaption>
            </figure>
          </Bezel>

          <div className="presence-contact">
            <ContactRows locale={locale} size={24} />
            <div style={{ marginBlockStart: 'var(--s-8)' }}>
              <StatelessCTA href={pathFor(locale, 'contact')} variant="primary" chamfer>
                {d.contact.cta}
              </StatelessCTA>
            </div>
            {/* City and country in prose, for local targeting (§15.1.3). */}
            <p
              className="t-body"
              style={{ marginBlockStart: 'var(--s-8)', color: 'var(--ink-soft)' }}
            >
              {locale === 'ar'
                ? `مقر ${SITE.nameAr} في ${SITE.hqCityAr}، ${SITE.countryAr}.`
                : `${SITE.nameEn} is based in ${SITE.hqCityEn}, ${SITE.countryEn}.`}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
