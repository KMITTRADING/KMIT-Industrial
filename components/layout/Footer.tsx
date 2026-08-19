import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import type { Locale } from '@/lib/locales';
import { Logo } from './Logo';
import { StrataRule } from '@/components/ui/StrataRule';

/**
 * The corporate close.
 *
 * No social links — none are verified, and a dead icon row is worse than no
 * icon row. No map. The Arabic company name appears in both locales, because
 * it is the registered name rather than a translation of the English one.
 *
 * The year is computed at build time. That is correct for a statically
 * exported site as long as it is rebuilt, and rebuilding is what a deploy is.
 */
export function Footer({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const year = new Date().getFullYear();

  const columns = [
    {
      label: copy.footer.navLabel,
      items: [
        { label: copy.nav.home, href: '#home' },
        { label: copy.nav.solutions, href: '#solutions' },
        { label: copy.nav.approach, href: '#approach' },
        { label: copy.nav.about, href: '#about' },
        { label: copy.nav.contact, href: '#contact' },
      ],
    },
    {
      label: copy.footer.areasLabel,
      items: copy.areas.items.map((area) => ({ label: area.title, href: '#solutions' })),
    },
  ];

  return (
    <footer className="section-y relative z-10 border-t border-line bg-paper">
      <div className="content">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo locale={locale} height={24} className="-ms-3" />
            <p className="t-body mt-4 max-w-[38ch] text-ink-soft">{copy.footer.statement}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.label} aria-label={column.label} className="lg:col-span-2">
              <h2 className="t-label text-ink-soft">{column.label}</h2>
              <ul className="mt-5 flex flex-col gap-1">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="t-small inline-flex min-h-11 items-center text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h2 className="t-label text-ink-soft">{copy.footer.contactLabel}</h2>
            <ul className="mt-5 flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${FACTS.email}`}
                  className="t-small inline-flex min-h-11 items-center text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
                >
                  {FACTS.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${FACTS.phone.dial}`}
                  dir="ltr"
                  className="t-small inline-flex min-h-11 items-center text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
                >
                  {FACTS.phone.display}
                </a>
              </li>
              <li className="t-small pt-2 text-ink-soft">
                {FACTS.city[locale]}, {FACTS.country[locale]}
              </li>
            </ul>
          </div>
        </div>

        <StrataRule variant="close" className="mt-16" />

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="t-small text-ink-soft">{copy.footer.copyright(year)}</p>
          <p className="t-small text-ink-soft" lang="ar" dir="rtl">
            {FACTS.name.ar}
          </p>
        </div>
      </div>
    </footer>
  );
}
