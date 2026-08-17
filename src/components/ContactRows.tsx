import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';
import { MAILTO_HREF, MAP_URL, SITE, TEL_HREF } from '@/lib/site';
import { Envelope, MapPin, Phone } from './Icons';

/**
 * The three mandatory contact rows (§8.7): location, mobile, email.
 *
 * Each row is a real link with a ≥44px target, focusable by keyboard, and the
 * text is the readable content — the icon is decorative and `aria-hidden` (§5.7).
 * The phone number is always Latin digits in LTR order even inside Arabic prose,
 * or the groups reorder on screen (§6.1, §8.7).
 *
 * 24px icons in the contact section, 20px and white in the footer (§8.7).
 */
export function ContactRows({
  locale,
  size = 24,
}: {
  locale: Locale;
  size?: 20 | 24;
}) {
  const d = dict(locale);
  const address = locale === 'ar' ? SITE.addressAr : SITE.addressEn;

  return (
    <ul className="contact-rows">
      <li>
        <a
          className="contact-row"
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={size} className="contact-row-icon" />
          <span className="contact-row-label t-label">{d.contact.rows.location}</span>
          <span className="contact-row-value t-body">{address}</span>
        </a>
      </li>

      <li>
        <a className="contact-row" href={TEL_HREF}>
          <Phone size={size} className="contact-row-icon" />
          <span className="contact-row-label t-label">{d.contact.rows.mobile}</span>
          <span className="contact-row-value t-body ltr-num">{SITE.phoneDisplay}</span>
        </a>
      </li>

      <li>
        <a className="contact-row" href={MAILTO_HREF}>
          <Envelope size={size} className="contact-row-icon" />
          <span className="contact-row-label t-label">{d.contact.rows.email}</span>
          <span className="contact-row-value t-body" dir="ltr">
            {SITE.email}
          </span>
        </a>
      </li>
    </ul>
  );
}
