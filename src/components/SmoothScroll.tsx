'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Smooth scroll (§11) and the GSAP/ScrollTrigger bridge.
 *
 * Lenis drives the scroll position and ScrollTrigger is told to read from it, so
 * pinned sections stay in step with the eased scroll instead of jittering behind
 * it. Reduced motion skips Lenis entirely and leaves native scrolling alone.
 *
 * On a language change the document direction flips and every pinned trigger's
 * measurements are stale, so Lenis is resized and ScrollTrigger refreshed (§6.1).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    let lenis: import('lenis').default | null = null;
    let rafId = 0;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.1,
        // Exponential ease-out, matching the CSS curves. Never linear (§11).
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        // Touch keeps the platform's own scrolling: hijacking it on mobile costs
        // more than it buys.
        syncTouch: false,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const tick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Expose for the language switcher and pinned sections to refresh against.
      window.__lenis = lenis;

      const onResize = () => {
        lenis?.resize();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);

      rafId = 1;
      return () => {
        window.removeEventListener('resize', onResize);
        gsap.ticker.remove(tick);
      };
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  /*
   * A route change re-lays out the page, and a language change also flips `dir`,
   * which invalidates every pin and every x-axis measurement. Both need a resize
   * and a ScrollTrigger.refresh() or the next pinned section locks at the
   * previous page's offsets (§6.1).
   *
   * This is also where the scroll position saved by the language switcher is
   * restored, as a ratio: the same page is a different height in each language,
   * so a raw pixel offset would land in the wrong section.
   */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      window.__lenis?.resize();
      ScrollTrigger.refresh();

      let ratio: number | null = null;
      try {
        const saved = sessionStorage.getItem('kmit:scroll-ratio');
        if (saved !== null) {
          ratio = Number(saved);
          sessionStorage.removeItem('kmit:scroll-ratio');
        }
      } catch {
        /* Storage can be unavailable; the position is simply not restored. */
      }

      if (ratio === null || !Number.isFinite(ratio) || ratio <= 0) return;

      // Wait for layout in the new direction before measuring the new height.
      requestAnimationFrame(() => {
        if (cancelled) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const target = Math.round(Math.min(1, Math.max(0, ratio!)) * max);
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(target, { immediate: true });
        else window.scrollTo({ top: target, behavior: 'auto' });
        ScrollTrigger.refresh();
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
