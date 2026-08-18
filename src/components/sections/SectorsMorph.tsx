'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { ArrowForward } from '../Icons';
import { SectorStill } from '../scenes/SectorStill';
import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';
import { canRender3D, dirSign, prefersReducedMotion } from '@/lib/motion';
import { buildWhenNear, type Deferred } from '@/lib/three/defer';

/**
 * The three sectors (§8.3), rebuilt for the visual overhaul.
 *
 * Three things changed and each was a stated defect:
 *
 * 1. It is a LIGHT section now. The home page carries exactly two dark grounds —
 *    the hero and the material journey — and they are never adjacent. On a light
 *    ground the stone solids read as what they are, and the solar panel finally
 *    has something to be dark against.
 *
 * 2. It is NOT pinned. Only one pin survives on the home page (§8), and it is
 *    the journey. The morph is still a morph — nothing is created or destroyed
 *    between the three states — but it is scrubbed across the section's own
 *    scroll range instead of holding the page still to do it.
 *
 * 3. The scene is not in a box. It bleeds past the container's edge and is
 *    clipped by the section, which is what gives it scale; a shape with clear
 *    air on all four sides reads as a card on an ordinary website.
 *
 * The designed still sits underneath the shared canvas and is only hidden once
 * the host reports the scene has actually drawn, so a scene that fails to build
 * leaves a still rather than an empty field.
 */

const SECTOR_ROUTES: RouteKey[] = [
  'sectors/industrial-minerals',
  'sectors/marble-transport',
  'sectors/solar-panels',
];

export function SectorsMorph({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const sectorKeys = ['industrial-minerals', 'marble-transport', 'solar-panels'] as const;

  const sectors = sectorKeys.map((key, i) => {
    const page = d.sectorPages[key];
    return {
      key,
      route: SECTOR_ROUTES[i],
      word: page.word,
      name: page.h1,
      lead: page.lead,
      why: page.whyBody,
      scene: page.sceneDescription,
      /* Link text stands alone out of context, for SEO and for a screen reader
         reading a link list (§15.1.2). */
      linkText:
        locale === 'ar' ? `اعرف المزيد عن ${page.word}` : `More on ${page.word.toLowerCase()}`,
    };
  });

  const [interactive, setInteractive] = useState(false);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  /* Decide the path once, on the client. Server-rendered output is always the
     static stack, so the crawler and a no-JS visitor get complete content. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 64rem)').matches;
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
    /* Kept so a scene built mid-scroll opens at the right state, not at zero. */
    let progress = 0;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      deferred = buildWhenNear(holder, () => {
        void import('@/lib/three/sectorMorph').then(({ createSectorScene }) => {
          if (cancelled) return;
          scene = createSectorScene({ element: holder, dirSign: dirSign() });
          scene.setProgress(progress);
        });
      });

      /* No pin. The morph runs across the section's own travel through the
         viewport, which is roughly one screen of scrolling for three states. */
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress * 2;
          progress = p;
          scene?.setProgress(p);
          const next = Math.min(2, Math.round(self.progress * 2.999 - 0.25));
          setActive(next < 0 ? 0 : next);
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

  /* ---------------------------------------------------------- static path --- */
  if (!interactive) {
    return (
      <section className="section" aria-labelledby="sectors-heading">
        <div className="content">
          <div className="section-head">
            <h2 id="sectors-heading" className="t-h2">
              {d.home.sectorsHeading}
            </h2>
            <p className="t-body-l section-lead">{d.home.sectorsLead}</p>
          </div>

          <div className="sectors-stack">
            {sectors.map((sector) => (
              <article key={sector.key}>
                <div className="sector-block-scene scene-bleed">
                  <SectorStill sector={sector.key} />
                </div>
                <p className="t-label sector-word">{sector.word}</p>{' '}
                <h3 className="t-h3 sector-name">{sector.name}</h3>
                <p className="t-body sector-body text-column">{sector.lead}</p>
                <p className="sector-link">
                  <Link className="link-inline" href={pathFor(locale, sector.route)}>
                    <span>{sector.linkText}</span>
                    <ArrowForward size={16} />
                  </Link>
                </p>
                {/* The scene has a text equivalent whether or not it renders. */}
                <p className="sr-only">{sector.scene}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------- morphing path --- */
  return (
    <section ref={sectionRef} className="section sectors-morph" aria-labelledby="sectors-heading">
      <div className="content">
        <div className="section-head">
          <h2 id="sectors-heading" className="t-h2">
            {d.home.sectorsHeading}
          </h2>
          <p className="t-body-l section-lead">{d.home.sectorsLead}</p>
        </div>
      </div>

      {/* Full-bleed: the scene is not confined to a grid column, and the solid
          is allowed to cross the container edge. */}
      <div className="sectors-stage">
        <div className="sectors-text content">
          {sectors.map((sector, i) => (
            <div
              key={sector.key}
              className="sector-panel text-column"
              data-state={i === active ? 'in' : 'out'}
              aria-hidden={i === active ? undefined : true}
              style={{ display: i === active ? 'block' : 'none' }}
            >
              <p className="t-label sector-word">{sector.word}</p>{' '}
              <h3 className="t-h2 sector-name">{sector.name}</h3>
              <p className="t-body-l sector-body">{sector.lead}</p>
              <p className="t-body sector-body">{sector.why}</p>
              <p className="sector-link">
                <Link className="link-inline" href={pathFor(locale, sector.route)}>
                  <span>{sector.linkText}</span>
                  <ArrowForward size={16} />
                </Link>
              </p>
            </div>
          ))}

          <ul className="sector-dots" aria-label={d.home.sectorsProgressLabel}>
            {sectors.map((sector, i) => (
              <li
                key={sector.key}
                className="sector-dot"
                data-active={i === active}
                aria-current={i === active ? 'true' : undefined}
              >
                <span className="sr-only">{sector.word}</span>
              </li>
            ))}
          </ul>
        </div>

        <div ref={sceneRef} className="sectors-scene scene-bleed" aria-hidden="true">
          <div className="scene-still">
            <SectorStill sector={sectors[active].key} />
          </div>
        </div>
      </div>

      {/* Every sector's text stays in the DOM for assistive technology and for
          crawlers, not only the panel that happens to be on screen. */}
      <div className="sr-only">
        {sectors.map((sector) => (
          <div key={sector.key}>
            <h3>{sector.name}</h3>
            <p>{sector.lead}</p>
            <p>{sector.scene}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
