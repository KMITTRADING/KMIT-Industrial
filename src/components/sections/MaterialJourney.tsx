'use client';

import { useEffect, useRef, useState } from 'react';

import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';
import { canRender3D, prefersReducedMotion } from '@/lib/motion';
import { buildWhenNear, type Deferred } from '@/lib/three/defer';

/**
 * The material's journey (§8.4). Pinned dark chapter, four stages, the point
 * cloud transforming in step with the scroll.
 *
 * This is the one place on the site where sequence numbering is allowed, because
 * 01 to 04 is a real process order rather than decoration (§8.4, §14).
 *
 * Static path: the same four stages as a two-column list with the still. Nothing
 * is lost but the scrubbing.
 */
export function MaterialJourney({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const stages = d.home.journeyStages;

  const [interactive, setInteractive] = useState(false);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 62rem)').matches;
    setInteractive(wide && canRender3D() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const section = sectionRef.current;
    const holder = sceneRef.current;
    if (!section || !holder) return;

    let scene: { setProgress: (p: number) => void; dispose: () => void } | null = null;
    let trigger: { kill: (revert?: boolean) => void } | null = null;
    let deferred: Deferred | null = null;
    let cancelled = false;
    /* Kept so a scene built mid-scroll opens at the right stage, not at zero. */
    let progress = 0;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // B5: a resize on mobile is usually just the URL bar collapsing, and
      // recomputing every pin for it causes a visible jump mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true });

      /* B4: the pin is created now, because it sets the document height; the
         WebGL scene waits until the section is within a viewport and the main
         thread is idle. Until then setProgress simply has nothing to call. */
      deferred = buildWhenNear(holder, () => {
        void import('@/lib/three/materialJourney').then(({ createJourneyScene }) => {
          if (cancelled) return;
          scene = createJourneyScene({ element: holder });
          scene.setProgress(progress);
        });
      });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=400%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          progress = self.progress * 3;
          scene?.setProgress(progress);
          const next = Math.min(3, Math.floor(self.progress * 3.999));
          setActive(next);
        },
      });
    })();

    return () => {
      cancelled = true;
      deferred?.cancel();
      trigger?.kill(true);
      scene?.dispose();
    };
  }, [interactive]);

  /* --------------------------------------------------------- static path --- */
  if (!interactive) {
    return (
      <section className="section on-dark" aria-labelledby="journey-heading">
        <div className="content">
          <h2 id="journey-heading" className="t-h2">
            {d.home.journeyHeading}
          </h2>
          <p className="t-body-l measure" style={{ marginBlockStart: 'var(--s-4)' }}>
            {d.home.journeyLead}
          </p>

          <ol className="journey-stack" style={{ marginBlockStart: 'var(--s-16)' }}>
            {stages.map((stage) => (
              <li key={stage.n}>
                <p className="t-label journey-stage-n ltr-num">{stage.n}</p>{' '}
                <h3 className="t-h3" style={{ marginBlockStart: 'var(--s-2)' }}>
                  {stage.name}
                </h3>
                <p className="t-body journey-stage-body">{stage.body}</p>
              </li>
            ))}
          </ol>

          <p className="sr-only">{d.home.journeySceneDescription}</p>
        </div>
      </section>
    );
  }

  /* --------------------------------------------------------- pinned path --- */
  return (
    <section ref={sectionRef} className="journey-pin on-dark" aria-labelledby="journey-heading">
      <div className="content">
        <h2 id="journey-heading" className="sr-only">
          {d.home.journeyHeading}
        </h2>

        <div className="journey-layout">
          <div>
            {stages.map((stage, i) => (
              <div
                key={stage.n}
                className="journey-stage"
                data-state={i === active ? 'in' : 'out'}
                style={{ display: i === active ? 'block' : 'none' }}
              >
                <p className="t-label journey-stage-n ltr-num">{stage.n}</p>{' '}
                <h3 className="t-h2" style={{ marginBlockStart: 'var(--s-2)' }}>
                  {stage.name}
                </h3>
                <p className="t-body-l journey-stage-body">{stage.body}</p>
              </div>
            ))}

            <ul className="sector-dots" aria-hidden="true">
              {stages.map((stage, i) => (
                <li key={stage.n} className="sector-dot" data-active={i === active} />
              ))}
            </ul>
          </div>

          <div className="journey-scene">
            <div ref={sceneRef} className="scene" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* The full sequence stays in the DOM regardless of which stage shows. */}
      <div className="sr-only">
        <p>{d.home.journeyLead}</p>
        <ol>
          {stages.map((stage) => (
            <li key={stage.n}>
              <h3>{stage.name}</h3>
              <p>{stage.body}</p>
            </li>
          ))}
        </ol>
        <p>{d.home.journeySceneDescription}</p>
      </div>
    </section>
  );
}
