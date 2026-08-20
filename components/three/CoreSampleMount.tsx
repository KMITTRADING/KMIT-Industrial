'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * The gate. Every condition in §9 is checked here, and three.js is not
 * downloaded until all of them pass.
 *
 * The order matters: the cheap checks run first, and the WebGL probe — the
 * only one that costs anything — runs last and on a throwaway canvas.
 */
const CoreSample = dynamic(() => import('./CoreSample'), { ssr: false });

function webglAvailable(): boolean {
  try {
    const probe = document.createElement('canvas');
    const context = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!context) return false;
    // Release it immediately. Browsers cap simultaneous contexts, and holding
    // a probe open costs one of them for nothing.
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function CoreSampleMount({ heroId, strataId }: { heroId: string; strataId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Reduced motion: the reader has asked for no animation, and a rotating
    // object is animation. They get the CSS strata column instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // deviceMemory is Chromium-only; where it is absent we do not guess.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof memory === 'number' && memory <= 2) return;

    if (!webglAvailable()) return;

    /*
     * Never on the LCP path (§9). The hero's largest element is the h1, and
     * three.js must not compete with the font for the main thread before it
     * has painted. If load has already fired we are past that point anyway.
     */
    if (document.readyState === 'complete') {
      setAllowed(true);
      return;
    }
    const onLoad = () => setAllowed(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  if (!allowed) return null;
  return <CoreSample heroId={heroId} strataId={strataId} />;
}
