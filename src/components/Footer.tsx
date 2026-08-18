import Link from 'next/link';

import { BrandIcon, Logo } from './brand/Logo';
import { ContactRows } from './ContactRows';
import { LangSwitch } from './LangSwitch';
import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';
import { SITE } from '@/lib/site';

/**
 * Footer (§8.8). Indigo ground, the icon at 60vw and 4% white cropped by the
 * edge as a watermark, three columns, then the 3px gradient rule, the rights
 * line and the language switcher.
 *
 * The contact rows repeat here at 20px in white rather than at the section's
 * 24px, so the two blocks do not read as the same component twice (§8.7).
 */

const SECTOR_ROUTES: RouteKey[] = [
  'sectors/industrial-minerals',
  'sectors/marble-transport',
  'sectors/solar-panels',
];

const GROUP_ROUTES: RouteKey[] = [
  'about',
  'calcium-carbonate',
  'quality-hse',
  'sustainability',
  'careers',
];

export function Footer({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const year = new Date().getFullYear();

  const label = (route: RouteKey) =>
    route.startsWith('sectors/')
      ? d.sectorPages[route.replace('sectors/', '') as keyof typeof d.sectorPages].h1
      : (d.nav.find((n) => n.route === route)?.label ?? d.meta[route as keyof typeof d.meta].title);

  return (
    <footer className="on-dark" style={{ paddingBlockStart: 'var(--s-24)' }}>
      <BrandIcon size="60vw" className="watermark" />

      <div className="shell">
        <div className="footer-grid">
          <div>
            <Logo height={44} title={d.shell.logoAlt} />
            <p
              className="t-body measure-tight"
              style={{ marginBlockStart: 'var(--s-6)', color: 'var(--on-dark-soft)' }}
            >
              {d.footer.lede}
            </p>
          </div>

          <nav aria-label={d.footer.colSectors}>
            <h2 className="t-label" style={{ color: 'var(--on-dark-soft)' }}>
              {d.footer.colSectors}
            </h2>
            <ul className="footer-links">
              {SECTOR_ROUTES.map((route) => (
                <li key={route}>
                  <Link href={pathFor(locale, route)} className="footer-link">
                    {label(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={d.footer.colGroup}>
            <h2 className="t-label" style={{ color: 'var(--on-dark-soft)' }}>
              {d.footer.colGroup}
            </h2>
            <ul className="footer-links">
              {GROUP_ROUTES.map((route) => (
                <li key={route}>
                  <Link href={pathFor(locale, route)} className="footer-link">
                    {label(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-label" style={{ color: 'var(--on-dark-soft)' }}>
              {d.footer.colContact}
            </h2>
            <div style={{ marginBlockStart: 'var(--s-2)' }}>
              <ContactRows locale={locale} size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* The 3px identity gradient, full bleed: one of its three permitted uses. */}
      <hr className="rule-grad" style={{ marginBlockStart: 'var(--s-16)' }} />

      <div className="shell footer-base">
        <p className="t-label" style={{ color: 'var(--on-dark-soft)' }}>
          <span className="ltr-num">©</span> <span className="ltr-num">{year}</span>{' '}
          {d.footer.rights}
        </p>
        <p className="t-label">
          <span className="sr-only">{d.footer.langHeading}</span>
          <LangSwitch locale={locale} className="footer-link" />
        </p>
      </div>

      {/* City and country named in the footer for local targeting, as prose
          rather than a keyword string (§15.1.3). */}
      <p className="sr-only">
        {locale === 'ar'
          ? `${SITE.nameAr} — ${SITE.addressAr}`
          : `${SITE.nameEn} — ${SITE.addressEn}`}
      </p>
    </footer>
  );
}
