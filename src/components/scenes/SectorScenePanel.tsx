'use client';

import { useEffect, useRef, useState } from 'react';

import { SectorStill } from './SectorStill';
import { canRender3D, dirSign } from '@/lib/motion';
import type { SectorSlug } from '@/lib/sectors';

/**
 * A sector's own geometry on its sector page (§9): the same object the home page
 * morphs through, held at that sector's state and turning slowly rather than
 * scrubbed.
 *
 * The still renders first and stays put unless the WebGL scene actually starts,
 * so there is never an empty panel.
 */

const STATE_INDEX: Record<SectorSlug, number> = {
  'industrial-minerals': 0,
  'marble-transport': 1,
  'solar-panels': 2,
};

export function SectorScenePanel({
  sector,
  description,
}: {
  sector: SectorSlug;
  description: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: { setProgress: (p: number) => void; dispose: () => void } | null = null;
    let cancelled = false;

    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));

    const handle = schedule(async () => {
      const { createSectorScene } = await import('@/lib/three/sectorMorph');
      if (cancelled) return;
      scene = createSectorScene({ canvas, dirSign: dirSign() });
      // Park the morph on this sector's own state.
      scene.setProgress(STATE_INDEX[sector]);
      setLive(true);
    });

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      }
      scene?.dispose();
    };
  }, [sector]);

  return (
    <>
      {!live && <SectorStill sector={sector} />}
      <canvas
        ref={canvasRef}
        className="scene"
        aria-hidden="true"
        style={{ opacity: live ? 1 : 0, transition: 'opacity 900ms var(--ease-out-expo)' }}
      />
      <p className="sr-only">{description}</p>
    </>
  );
}
