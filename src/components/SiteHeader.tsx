'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Logo } from './brand/Logo';
import { MenuBars } from './Icons';
import { LangSwitch } from './LangSwitch';
import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';
import { MAILTO_HREF, SITE, TEL_HREF } from '@/lib/site';

/**
 * Site header (§2, rebuilt).
 *
 * The previous header was a small floating chip centred near the top. Two things
 * were wrong with it. It read as a widget hovering over the page rather than as
 * the frame of the site, and — much worse — its text was white by default and
 * only turned dark once the visitor had scrolled 80px. Every inner page opens
 * with a light heading block, so on every one of them the header rendered white
 * on near-white and was, briefly but completely, unreadable.
 *
 * The rule that replaces it is simple enough that the failure cannot recur: the
 * header never chooses a colour on its own. Either it is compact, in which case
 * it wears an opaque light plate and always uses ink; or it is transparent, in
 * which case its colour comes from whatever section is measured underneath it.
 * There is no state in which white text is used without a dark ground having
 * been observed under the bar first.
 */

/** How far the visitor scrolls before the plate appears (§2). */
const COMPACT_AT = 64;

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  /* Starts light-on-light safe: 'light' ground means ink text. The dark hero
     flips it to 'dark' on the first measurement, which happens before paint. */
  const [ground, setGround] = useState<'light' | 'dark'>('light');
  const barRef = useRef<HTMLElement>(null);

  /*
   * --- compact state, and the ground underneath -------------------------
   * Both are answered by one measurement per frame, and only while scrolling.
   * The ground question is "which section is under the bar's own centre line",
   * so the switch happens exactly as the bar crosses a section boundary rather
   * than when a section merely enters view.
   */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      setCompact(window.scrollY > COMPACT_AT);

      const rect = bar.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;
      const overDark = Array.from(document.querySelectorAll<HTMLElement>('.on-dark')).some(
        (section) => {
          const r = section.getBoundingClientRect();
          return r.top <= probeY && r.bottom >= probeY;
        }
      );
      setGround(overDark ? 'dark' : 'light');
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  /* --- overlay behaviour ------------------------------------------------ */
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);

    // The overlay covers the page, so the document behind it must not scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      window.__lenis?.start();
    };
  }, [open, close]);

  const isCurrent = (route: RouteKey) => pathname === pathFor(locale, route);

  return (
    <>
      <header
        className="site-header"
        ref={barRef}
        data-compact={compact}
        data-ground={compact ? 'plate' : ground}
      >
        <div className="site-header-inner">
          <Link href={pathFor(locale, 'home')} aria-label={d.shell.logoAlt} className="header-logo">
            <Logo height={26} />
          </Link>

          <nav className="header-nav" aria-label={d.shell.menuLabel}>
            <ul className="header-links">
              {d.nav.map((item) => (
                /* The leading space is deliberate: without it the link labels
                   concatenate into "AboutSectors..." for anything reading the
                   text rather than the layout. */
                <li key={item.route}>{' '}
                  <Link
                    className="header-link"
                    href={pathFor(locale, item.route as RouteKey)}
                    aria-current={isCurrent(item.route as RouteKey) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>{' '}

          <div className="header-end">
            <LangSwitch locale={locale} className="header-link header-lang" />{' '}

            <button
              type="button"
              className="header-toggle"
              aria-expanded={open}
              aria-controls="nav-overlay"
              aria-label={open ? d.shell.closeMenu : d.shell.openMenu}
              data-open={open}
              onClick={() => setOpen((v) => !v)}
            >
              <MenuBars size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* The overlay is only in the DOM while open, so its links cannot be
          reached by keyboard while hidden. */}
      {open && (
        <div className="nav-overlay" id="nav-overlay" data-animate="true">
          <div className="nav-overlay-top">
            <Logo height={26} title={d.shell.logoAlt} />
            <button
              type="button"
              className="header-toggle"
              onClick={close}
              aria-label={d.shell.closeMenu}
              data-open="true"
            >
              <MenuBars size={22} />
            </button>
          </div>

          <ul className="nav-overlay-links">
            {d.nav.map((item, i) => (
              <li key={item.route} className="nav-overlay-link-clip">
                <span
                  className="nav-overlay-link-inner"
                  style={{ ['--i' as string]: i, display: 'block' }}
                >
                  <Link
                    className="nav-overlay-link"
                    href={pathFor(locale, item.route as RouteKey)}
                    aria-current={isCurrent(item.route as RouteKey) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </span>
              </li>
            ))}
          </ul>

          <div className="nav-overlay-foot">
            <LangSwitch locale={locale} className="t-label" />
            {/* §2: the contact details live at the foot of the mobile menu, so
                the shortest path to a human is one tap from anywhere. */}
            <p className="nav-overlay-contact">
              <a href={TEL_HREF} className="ltr-num">
                {SITE.phoneDisplay}
              </a>{' '}
              <a href={MAILTO_HREF} dir="ltr">
                {SITE.email}
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
