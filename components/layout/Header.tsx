import { getCopy } from '@/content';
import type { Locale } from '@/lib/locales';
import { Logo } from './Logo';
import { LanguageSwitch } from './LanguageSwitch';

/**
 * Fixed header: mark, five anchors, language.
 *
 * The mobile menu is a <details>, not a React state machine. That is a
 * deliberate trade: it costs one element of styling awkwardness and buys a
 * menu that opens, closes and takes keyboard focus with no JavaScript at all,
 * which is what the no-JS requirement in §12 actually asks for. A useState
 * panel would leave a dead button on a page that had not hydrated yet.
 *
 * The scrolled state and the scrollspy underline arrive in step 4; nothing
 * here moves yet.
 */
export function Header({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  const links = [
    { href: '#home', label: copy.nav.home },
    { href: '#solutions', label: copy.nav.solutions },
    { href: '#approach', label: copy.nav.approach },
    { href: '#about', label: copy.nav.about },
    { href: '#contact', label: copy.nav.contact },
  ];

  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-[var(--ease-micro)]"
    >
      <div className="shell flex items-center justify-between gap-4">
        <a href="#home" className="-m-2 p-2" aria-label={copy.nav.home}>
          <Logo locale={locale} height={26} />
        </a>

        {/* Desktop navigation. Hidden rather than removed below 1024px so the
            same markup serves both, and the anchors stay in the document. */}
        <nav aria-label={copy.footer.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-nav-anchor={link.href}
                  className="t-label relative inline-flex min-h-11 items-center px-3 text-ink-soft transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center">
          <span aria-hidden="true" className="hidden h-4 w-px bg-line lg:block" />
          <LanguageSwitch locale={locale} />

          {/* Mobile menu. `group` lets the open state restyle the summary. */}
          <details className="group lg:hidden">
            <summary
              className="t-label flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-ink [&::-webkit-details-marker]:hidden"
              aria-label={copy.nav.openMenu}
            >
              <span className="group-open:hidden">{copy.nav.openMenu}</span>
              <span className="hidden group-open:inline">{copy.nav.closeMenu}</span>
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className="h-px w-full bg-ink" />
                <span className="h-px w-full bg-ink group-open:opacity-0" />
                <span className="h-px w-full bg-ink" />
              </span>
            </summary>

            <div className="fixed inset-x-0 top-[var(--header-h,4.5rem)] bottom-0 z-40 overflow-y-auto bg-paper px-[var(--gutter)] pb-16 pt-8">
              <nav aria-label={copy.footer.navLabel}>
                <ul>
                  {links.map((link, i) => (
                    <li key={link.href} className="border-t border-line first:border-t-0">
                      <a
                        href={link.href}
                        className="flex min-h-14 items-baseline gap-5 py-4 text-ink"
                      >
                        <span aria-hidden="true" className="t-index text-ink-soft">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="t-h3">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
