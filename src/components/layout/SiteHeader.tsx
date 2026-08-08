'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  ArrowInlineEndIcon,
  ChevronDownIcon,
  CloseIcon,
} from '@/components/primitives/IconSet';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { cn, formatInteger, formatRange } from '@/lib/utils';

import type { Locale } from '@/i18n/routing';

/**
 * Site header.
 *
 * Sticky, and condensed once the page has scrolled past its own height. The
 * condense is driven by an IntersectionObserver watching a one-pixel sentinel
 * above the header, which fires twice in a session rather than on every scroll
 * frame. No scroll listener, no `window.scrollY` in React state.
 *
 * The Products entry opens a mega-menu that exposes the grade matrix directly:
 * code, mesh, D50 and coating, one row per grade, each row a link. A buyer who
 * knows they need 1250 mesh reaches that page in one click from anywhere on the
 * site, which is the highest-intent path there is.
 *
 * Navigation is passed in rather than hardcoded. The live site passes only
 * routes that exist; the styleguide passes the full Phase 3 set so the
 * mega-menu can be reviewed before those routes are built. Shipping a nav bar
 * of links that 404 is worse than shipping a short one.
 */

export type NavItem = {
  /** Key into the `nav` content namespace. */
  key: 'products' | 'applications' | 'facility' | 'resources' | 'contact';
  href: string;
  /** Products opens the grade mega-menu; everything else is a plain link. */
  mega?: 'grades';
};

export type SiteHeaderProps = {
  locale: Locale;
  navItems?: NavItem[];
  /** Renders the RFQ action. Off until the route exists. */
  showRfq?: boolean;
  className?: string;
};

export function SiteHeader({
  locale,
  navItems = [],
  showRfq = false,
  className,
}: SiteHeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Any navigation closes both menus: a panel left open across a route change is
  // the most common bug in a mega-menu. Adjusted during render rather than in an
  // effect, so the closed state is what the browser paints instead of a frame
  // with the panel still open followed by a cascading re-render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMega(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!openMega && !mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenMega(null);
      setMobileOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      setOpenMega(null);
      setMobileOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openMega, mobileOpen]);

  const megaId = 'header-mega-grades';

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />

      <header
        ref={headerRef}
        data-condensed={condensed || undefined}
        className={cn(
          'sticky top-0 z-[var(--z-sticky)]',
          'border-b border-border-subtle bg-surface-page',
          'transition-[padding,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-standard)]',
          condensed ? 'py-1 shadow-raised' : 'py-3',
          className,
        )}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenMega(null);
        }}
      >
        <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-6 px-5 md:px-8">
          <Link
            href="/"
            aria-label={t('nav.home')}
            className="flex shrink-0 items-center rounded-xs text-accent-800 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-80"
          >
            <Logo
              variant="full"
              locale={locale}
              className={cn(
                'w-auto transition-[height] duration-[var(--duration-base)] ease-[var(--ease-standard)]',
                condensed ? 'h-7' : 'h-9 md:h-10',
              )}
            />
          </Link>

          {navItems.length > 0 ? (
            <nav
              aria-label={t('a11y.primaryNavigation')}
              className="hidden items-center gap-1 lg:flex"
            >
              {navItems.map((item) =>
                item.mega === 'grades' ? (
                  <button
                    key={item.key}
                    type="button"
                    aria-expanded={openMega === item.key}
                    aria-controls={megaId}
                    onClick={() =>
                      setOpenMega((current) => (current === item.key ? null : item.key))
                    }
                    className={cn(
                      'flex min-h-11 items-center gap-1.5 rounded-sm px-3 py-2 text-sm',
                      'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                      openMega === item.key
                        ? 'bg-surface-sunken text-ink-accent'
                        : 'text-ink-secondary hover:text-ink-primary',
                    )}
                  >
                    {t(`nav.${item.key}`)}
                    <ChevronDownIcon
                      className={cn(
                        'size-3.5 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                        openMega === item.key && '-rotate-180',
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex min-h-11 items-center rounded-sm px-3 py-2 text-sm text-ink-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-primary"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ),
              )}
            </nav>
          ) : null}

          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher current={locale} />

            {showRfq ? (
              <Link
                href="/rfq"
                className="hidden min-h-11 items-center rounded-sm bg-surface-accent px-4 py-2 text-sm font-medium text-ink-inverse transition-[background-color,transform] duration-[var(--duration-press)] ease-[var(--ease-standard)] hover:bg-surface-accent-deep active:scale-[0.985] sm:flex"
              >
                {t('nav.rfq')}
              </Link>
            ) : null}

            {navItems.length > 0 ? (
              // The name is on the button, not on the glyph inside it. The
              // closed state draws three bars in an aria-hidden wrapper, and a
              // label nested inside that wrapper would be hidden along with it.
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="header-mobile-nav"
                aria-label={mobileOpen ? t('ui.closeMenu') : t('ui.openMenu')}
                onClick={() => setMobileOpen((open) => !open)}
                className="flex size-11 items-center justify-center rounded-sm text-ink-secondary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-primary lg:hidden"
              >
                {mobileOpen ? (
                  <CloseIcon className="size-5" />
                ) : (
                  <span aria-hidden className="flex w-5 flex-col gap-1">
                    <span className="h-px w-full bg-current" />
                    <span className="h-px w-full bg-current" />
                    <span className="h-px w-full bg-current" />
                  </span>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* ------------------------------------------------- mega-menu */}
        {openMega === 'products' ? (
          <div
            id={megaId}
            className="absolute inset-x-0 top-full hidden border-b border-border-subtle bg-surface-page shadow-raised lg:block"
          >
            <div className="mx-auto max-w-[76rem] px-5 py-8 md:px-8">
              <table className="w-full text-sm">
                <caption className="pb-4 text-start text-xs text-ink-muted">
                  {t('home.gradesIntro')}
                </caption>
                <thead>
                  <tr className="border-b border-border-strong text-2xs text-ink-muted">
                    <th scope="col" className="pe-4 pb-2 text-start font-medium">
                      {t('grades.columnCode')}
                    </th>
                    <th scope="col" className="pe-4 pb-2 text-start font-medium">
                      {t('grades.columnMesh')}
                    </th>
                    <th scope="col" className="pe-4 pb-2 text-start font-medium">
                      {t('grades.columnD50')}
                    </th>
                    <th scope="col" className="pb-2 text-start font-medium">
                      {t('grades.columnCoating')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {GRADES.map((grade) => (
                    <tr key={grade.code} className="group">
                      <th scope="row" className="py-0 text-start font-semibold">
                        <Link
                          href={`/products/${gradeSlug(grade.code)}`}
                          dir="ltr"
                          className="block py-3 pe-4 text-start text-ink-accent"
                        >
                          {grade.code}
                        </Link>
                      </th>
                      <td
                        dir="ltr"
                        className="py-3 pe-4 text-start text-ink-secondary tabular-nums"
                      >
                        {formatInteger(grade.mesh)}
                      </td>
                      <td
                        dir="ltr"
                        className="py-3 pe-4 text-start text-ink-secondary tabular-nums"
                      >
                        {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                      </td>
                      <td className="py-3 text-ink-secondary">
                        {grade.coated ? t('grades.coated') : t('grades.uncoated')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-accent"
              >
                {t('nav.products')}
                <ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------- mobile panel */}
        {mobileOpen ? (
          <div
            id="header-mobile-nav"
            className="border-t border-border-subtle bg-surface-page lg:hidden"
          >
            <nav
              aria-label={t('a11y.primaryNavigation')}
              className="mx-auto max-w-[76rem] px-5 py-4 md:px-8"
            >
              <ul className="divide-y divide-border-subtle">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="flex min-h-11 items-center py-3 text-sm text-ink-primary"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
                {showRfq ? (
                  <li>
                    <Link
                      href="/rfq"
                      className="flex min-h-11 items-center py-3 text-sm font-semibold text-ink-accent"
                    >
                      {t('nav.rfq')}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}

export default SiteHeader;
