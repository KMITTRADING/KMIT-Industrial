'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Logo } from './brand/Logo';
import { MenuBars } from './Icons';
import { LangSwitch } from './LangSwitch';
import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';

/**
 * Floating navigation (§8.0).
 *
 * Detached from the top edge, width follows its content, no curve, a 45deg cut
 * on the outer top corner, glass — which is permitted here and on overlays only
 * (§14). It shrinks on scroll and inverts to white over indigo sections; the
 * section colour is read with IntersectionObserver rather than a scroll listener
 * (§11).
 */
export function FloatingNav({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* --- compact state ---------------------------------------------------- */
  useEffect(() => {
    // A sentinel at the top of the document: once it leaves, the bar compacts.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    Object.assign(sentinel.style, {
      position: 'absolute',
      inset: '0 0 auto 0',
      height: '120px',
      pointerEvents: 'none',
    });
    document.body.prepend(sentinel);

    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  /*
   * --- ground colour ----------------------------------------------------
   * Every dark section is marked `.on-dark`. The bar asks which one currently
   * sits under its own centre line, so the inversion happens exactly when the
   * bar crosses the boundary rather than when a section merely enters view.
   */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const darkSections = () => Array.from(document.querySelectorAll<HTMLElement>('.on-dark'));

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = bar.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;
      const hit = darkSections().some((section) => {
        const r = section.getBoundingClientRect();
        return r.top <= probeY && r.bottom >= probeY;
      });
      setOnDark(hit);
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
      <div className="nav-shell">
        <nav
          className="nav-bar chamfer"
          aria-label={d.shell.menuLabel}
          ref={barRef}
          data-compact={compact}
          data-on-dark={onDark}
        >
          <Link
            href={pathFor(locale, 'home')}
            aria-label={d.shell.logoAlt}
            className="nav-logo"
          >
            <Logo height={28} />
          </Link>

          <ul className="nav-links">
            {d.nav.map((item) => (
              <li key={item.route}>
                <Link
                  className="nav-link"
                  href={pathFor(locale, item.route as RouteKey)}
                  aria-current={isCurrent(item.route as RouteKey) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <LangSwitch locale={locale} className="nav-link t-label" />

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-overlay"
            aria-label={open ? d.shell.closeMenu : d.shell.openMenu}
            data-open={open}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuBars size={22} />
          </button>
        </nav>
      </div>

      {/* The overlay is only in the DOM while open, so its links cannot be
          reached by keyboard while hidden. */}
      {open && (
        <div className="nav-overlay" id="nav-overlay" data-animate="true">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo height={28} title={d.shell.logoAlt} />
            <button
              type="button"
              className="nav-toggle"
              onClick={close}
              aria-label={d.shell.closeMenu}
              data-open="true"
              style={{ display: 'inline-flex' }}
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

          <div className="t-label">
            <LangSwitch locale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
