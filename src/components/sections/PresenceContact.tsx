import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';
import { MAILTO_HREF, MAP_URL, SITE, TEL_HREF } from '@/lib/site';
import { Envelope, MapPin, Phone } from '../Icons';
import { Section } from '../primitives';

/**
 * Presence and contact (§8.7, rebuilt for V4).
 *
 * The drawn map is gone. It was a line illustration of grey rectangles with a K
 * in it, and at the foot of the page it read as a placeholder somebody forgot to
 * replace rather than as a map — which is the worst thing a graphic can do. It
 * is not replaced with a real map either: an embedded provider would bring
 * tiles, branding and cookies for a single office address that is already
 * written out in full, and a link to it costs nothing.
 *
 * What is left is the information itself, given room: three equal columns on a
 * light ground, separated by hairlines rather than boxed into cards, with the
 * two direct actions centred beneath. There is no contact form anywhere on the
 * site, so the shortest path to a human is the visitor's own mail app or
 * dialler.
 */

const COLUMNS = [
  { key: 'location', Icon: MapPin, href: MAP_URL, external: true },
  { key: 'mobile', Icon: Phone, href: TEL_HREF, external: false },
  { key: 'email', Icon: Envelope, href: MAILTO_HREF, external: false },
] as const;

export function PresenceContact({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const address = locale === 'ar' ? SITE.addressAr : SITE.addressEn;

  const valueFor = (key: (typeof COLUMNS)[number]['key']) => {
    if (key === 'location') return { text: address, ltr: false };
    if (key === 'mobile') return { text: SITE.phoneDisplay, ltr: true };
    return { text: SITE.email, ltr: true };
  };

  return (
    <Section labelledBy="contact-heading">
      {/* §5.2: short centred heading, one line under it, then the content. */}
      <div className="content">
        <div className="section-head">
          <h2 id="contact-heading" className="t-h2">
            {d.contact.heading}
          </h2>
          <p className="t-body-l section-lead">{d.contact.lead}</p>
        </div>

        <ul className="contact-columns">
          {COLUMNS.map(({ key, Icon, href, external }) => {
            const value = valueFor(key);
            return (
              /* The leading space keeps the three values from concatenating for
                 anything reading the text rather than the layout. */
              <li key={key} className="contact-column">{' '}
                <a
                  className="contact-column-link"
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon size={24} className="contact-column-icon" />
                  <span className="t-label contact-column-label">{d.contact.rows[key]}</span>{' '}
                  <span
                    className="t-body-l contact-column-value"
                    {...(value.ltr ? { dir: 'ltr' as const } : {})}
                  >
                    {value.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="contact-actions">
          <a className="btn btn-primary chamfer" href={MAILTO_HREF}>
            <span>{d.contact.ctaEmail}</span>
          </a>{' '}
          <a className="btn btn-secondary" href={TEL_HREF}>
            <span className="ltr-num">{SITE.phoneDisplay}</span>{' '}
            <span className="sr-only">{d.contact.ctaPhone}</span>
          </a>
        </div>

        {/* City and country in prose, for local targeting (§15.1.3). */}
        <p className="t-body contact-city">
          {locale === 'ar'
            ? `مقر ${SITE.nameAr} في ${SITE.hqCityAr}، ${SITE.countryAr}.`
            : `${SITE.nameEn} is based in ${SITE.hqCityEn}, ${SITE.countryEn}.`}
        </p>
      </div>
    </Section>
  );
}
