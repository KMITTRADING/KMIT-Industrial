'use client';

import { useEffect, useRef } from 'react';
import { canRender3D } from '@/lib/motion';

/**
 * Mounts the WebGL crystal, or leaves the static one in place (§10).
 *
 * There is no canvas element here any more: every scene draws into the one
 * shared canvas the scene host owns (§B1). This component only registers the
 * heading block as a view and hands over from the CSS crystal once the scene has
 * actually started, so a failed import leaves the static version on screen
 * rather than an empty hero.
 *
 * The gate runs before anything is imported, so a weak device, a slow
 * connection, no WebGL, or `prefers-reduced-motion` never pays for three.js.
 */
export function HeroCrystalMount({ dir }: { dir: 'rtl' | 'ltr' }) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /*
     * Desktop only. At phone widths the heading already runs to three lines and
     * the crystal's two refracted copies sit on top of them, which reads as
     * clutter rather than as an effect — the same reason §6 drops the pinned
     * sections below 1024. The CSS fallback covers the small screens.
     */
    if (!window.matchMedia('(min-width: 64rem)').matches) return;
    if (!canRender3D()) return;

    const box = markerRef.current?.closest<HTMLElement>('.hero-headline');
    if (!box) return;

    const lineEls = Array.from(box.querySelectorAll<HTMLElement>('.hero-title .hero-line'));
    if (lineEls.length === 0) return;

    let scene: { dispose: () => void } | null = null;
    let cancelled = false;

    /* Wait for idle so the scene never competes with first paint (§15.1.7).
       The timeout is not optional: Lenis and GSAP hold a rAF loop open while the
       visitor scrolls, so without one the browser can report no idle period at
       all and the hero crystal simply never appears. */
    const schedule = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => cb(), { timeout: 400 })
        : window.setTimeout(cb, 200);

    const handle = schedule(async () => {
      const { createHeroScene } = await import('@/lib/three/heroCrystal');
      if (cancelled) return;
      scene = createHeroScene({ box, lineEls, dir });
      box.dataset.webgl = 'on';
    });

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      }
      scene?.dispose();
      delete box.dataset.webgl;
    };
  }, [dir]);

  return <span ref={markerRef} hidden aria-hidden="true" />;
}
