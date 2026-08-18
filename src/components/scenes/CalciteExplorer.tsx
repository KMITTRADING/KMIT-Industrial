'use client';

import { useEffect, useRef, useState } from 'react';

import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';
import { canRender3D } from '@/lib/motion';
import { buildWhenNear } from '@/lib/three/defer';

/**
 * Interactive calcite explorer (§9).
 *
 * The hotspots are real buttons in a tabs pattern, not markers floating over a
 * canvas: that way they work by keyboard, they have accessible names, and the
 * explanation is in the DOM whether or not WebGL ever starts. Selecting one turns
 * the crystal to face that feature.
 *
 * §10: the scene does not receive page scroll, and dragging to rotate is only
 * armed after a deliberate press, so a touch visitor is never trapped inside it.
 */
export function CalciteExplorer({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const hotspots = d.knowledge.hotspots;
  const [active, setActive] = useState(0);
  const holderRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ focusFace: (i: number) => void; dispose: () => void } | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const holder = holderRef.current;
    if (!holder) return;

    let cancelled = false;

    /* B4: the explorer sits well down the knowledge page, so it is built when
       the reader is within a viewport of it and the main thread is idle — not
       during hydration. Until then the designed still is what shows. */
    const deferred = buildWhenNear(holder, () => {
      void import('@/lib/three/calciteExplorer').then(({ createCalciteExplorer }) => {
        if (cancelled) return;
        sceneRef.current = createCalciteExplorer({ element: holder });
        setLive(true);
      });
    });

    return () => {
      cancelled = true;
      deferred.cancel();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.focusFace(active);
  }, [active, live]);

  return (
    <div>
      <h2 className="t-h2">{d.knowledge.explorerHeading}</h2>
      <p className="t-body-l measure" style={{ marginBlockStart: 'var(--s-4)' }}>
        {d.knowledge.explorerLead}
      </p>

      <div className="explorer" style={{ marginBlockStart: 'var(--s-12)' }}>
        <div className="explorer-scene">
          {!live && <CalciteStill />}
          <div ref={holderRef} className="scene scene-interactive" aria-hidden="true" />
        </div>

        <div>
          <div className="explorer-tabs" role="tablist" aria-label={d.knowledge.explorerHeading}>
            {hotspots.map((hotspot, i) => (
              <button
                key={hotspot.title}
                type="button"
                role="tab"
                id={`calcite-tab-${i}`}
                aria-selected={i === active}
                aria-controls="calcite-panel"
                className="explorer-tab t-h3"
                onClick={() => setActive(i)}
              >
                <span className="explorer-tab-mark" aria-hidden="true" />
                {hotspot.title}
              </button>
            ))}
          </div>

          <div
            id="calcite-panel"
            role="tabpanel"
            aria-labelledby={`calcite-tab-${active}`}
            className="t-body-l explorer-body"
          >
            {hotspots[active].body}
          </div>
        </div>
      </div>

      {/* Every hotspot's text stays in the DOM, not only the open one. */}
      <div className="sr-only">
        <p>{d.knowledge.explorerAlt}</p>
        <dl>
          {hotspots.map((hotspot) => (
            <div key={hotspot.title}>
              <dt>{hotspot.title}</dt>
              <dd>{hotspot.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/** Static calcite, shown until the scene starts and kept if it never does. */
function CalciteStill() {
  return (
    <svg
      className="scene-static"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="calcite-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3D55A4" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <polygon points="100,18 168,52 168,132 100,182 32,132 32,52" fill="url(#calcite-a)" />
      <polygon points="100,18 168,52 100,88 32,52" fill="#FFFFFF" fillOpacity="0.16" />
      <polygon points="168,52 168,132 100,182 100,88" fill="#1B1F4E" fillOpacity="0.26" />
      <polygon points="32,52 100,88 100,182 32,132" fill="#FFFFFF" fillOpacity="0.06" />
      <polygon
        points="100,18 168,52 168,132 100,182 32,132 32,52"
        fill="none"
        stroke="#3D55A4"
        strokeWidth="1.25"
      />
      <polyline points="32,52 100,88 168,52" fill="none" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="1" />
      <polyline points="100,88 100,182" fill="none" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="1" />
    </svg>
  );
}
