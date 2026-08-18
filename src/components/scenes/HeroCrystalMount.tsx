'use client';

import { useEffect, useRef } from 'react';
import { canRender3D } from '@/lib/motion';

/**
 * Mounts the WebGL crystal, or leaves the static one in place (§10).
 *
 * The gate runs before anything is imported, so a weak device, a slow
 * connection, no WebGL, or `prefers-reduced-motion` never pays for the three.js
 * bundle at all. The import is dynamic and happens after first paint, keeping
 * the scene off the critical path and out of the LCP measurement (§15.1.7).
 */
export function HeroCrystalMount({
  lines,
  dir,
}: {
  lines: [string, string];
  dir: 'rtl' | 'ltr';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canRender3D()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const box = canvas.closest<HTMLElement>('.hero-headline');
    if (!box) return;

    const lineEls = Array.from(box.querySelectorAll<HTMLElement>('.hero-title .hero-line'));
    if (lineEls.length === 0) return;

    let scene: { dispose: () => void } | null = null;
    let cancelled = false;

    // Wait for idle so the scene never competes with first paint.
    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));

    const handle = schedule(async () => {
      const { createHeroScene } = await import('@/lib/three/heroCrystal');
      if (cancelled) return;

      scene = createHeroScene({ canvas, box, lineEls, dir });

      // Hand over from the CSS crystal, which has been carrying the effect until
      // now. Doing it here rather than on mount means a failed import leaves the
      // static version on screen instead of an empty hero.
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
  }, [dir, lines]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
