import { getTranslations } from 'next-intl/server';

import { GRADES, gradeSlug } from '@/content/data/grades';
import { Logo } from '@/components/brand/Logo';
import { Link } from '@/i18n/navigation';
import { STANDARD_IDS } from '@/content/schema';

import type { Locale } from '@/i18n/routing';

/**
 * Site footer.
 *
 * A technical sitemap rather than a marketing sign-off. Four columns: the
 * brand and where the company is, the site's own routes, the grade list, and
 * the standards.
 *
 * The standards are a list, not a dot-separated string. Six items joined by
 * middle dots is a metadata strip pretending to be a list, it wraps badly at
 * every breakpoint, and a screen reader reads it as one run-on line.
 *
 * The provenance line is the last thing on the page on purpose. Every number
 * this site publishes is a typical value with a named test method, and the
 * footer is where that is stated once for the whole site.
 *
 * Route links are passed in, so the footer never advertises a page that does
 * not exist yet.
 */

export type FooterLink = {
  key: 'products' | 'applications' | 'facility' | 'resources' | 'contact' | 'rfq';
  href: string;
};

export async function SiteFooter({
  locale,
  navLinks = [],
  showGrades = false,
}: {
  locale: Locale;
  navLinks?: FooterLink[];
  /** Grade links only make sense once the grade routes exist. */
  showGrades?: boolean;
}) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={t('a11y.footerLandmark')}
      className="mt-section border-t border-border-subtle bg-surface-sunken"
    >
      <div className="mx-auto max-w-[76rem] px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo
              variant="mark"
              locale={locale}
              decorative
              className="h-8 w-auto text-accent-800"
            />
            <p className="text-sm text-ink-secondary">{t('footer.headquarters')}</p>
            <p className="text-sm text-ink-secondary">{t('footer.marketsServed')}</p>
          </div>

          {navLinks.length > 0 ? (
            <nav aria-labelledby="footer-nav-heading" className="flex flex-col gap-4">
              <h2 id="footer-nav-heading" className="text-2xs font-semibold text-ink-muted">
                {t('footer.navHeading')}
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-ink-secondary underline-offset-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-accent hover:underline"
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {showGrades ? (
            <nav aria-labelledby="footer-grades-heading" className="flex flex-col gap-4">
              <h2 id="footer-grades-heading" className="text-2xs font-semibold text-ink-muted">
                {t('footer.productsHeading')}
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                {GRADES.map((grade) => (
                  <li key={grade.code}>
                    <Link
                      href={`/products/${gradeSlug(grade.code)}`}
                      dir="ltr"
                      className="block text-start text-ink-secondary tabular-nums underline-offset-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-accent hover:underline"
                    >
                      {grade.code}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="flex flex-col gap-4">
            <h2 className="text-2xs font-semibold text-ink-muted">
              {t('footer.complianceHeading')}
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {STANDARD_IDS.map((standard) => (
                <li key={standard} className="flex flex-col">
                  <span dir="ltr" className="text-start font-medium text-ink-primary">
                    {t(`standards.${standard}`)}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {t(`standardScopes.${standard}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="measure-prose mt-12 border-t border-border-subtle pt-8 text-sm text-ink-muted">
          {t('footer.dataProvenance')}
        </p>

        <p className="mt-6 text-sm text-ink-muted">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
