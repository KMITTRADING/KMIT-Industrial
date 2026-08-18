'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { ArrowForward } from '../Icons';
import { SectorStill } from '../scenes/SectorStill';
import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';
import { canRender3D, dirSign, prefersReducedMotion } from '@/lib/motion';

/**
 * The three sectors (§8.3) — pinned, two thirds scene and one third text, with
 * the geometry morphing between sector states rather than cross-fading.
 *
 * Explicitly not three matching cards with an icon, a title and a paragraph:
 * that is the template answer the brief bans (§8.3, §14).
 *
 * Two paths, and the static one has to stand on its own (§8.3):
 *  - capable device: 300vh of scroll, section pinned, morph scrubbed
 *  - mobile, weak device, no WebGL, or reduced motion: three stacked blocks,
 *    each with its own still and the same text. No pin, no morph.
 */

const SECTOR_ROUTES: RouteKey[] = [
  'sectors/industrial-minerals',
  'sectors/marble-transport',
  'sectors/solar-panels',
];

export function SectorsPinned({ locale }: { locale: Locale }) {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Decide the path once, on the client. Server-rendered output is always the
     static stack, so the crawler and a no-JS visitor get complete content. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 62rem)').matches;
    setInteractive(wide && canRender3D() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let scene: { setProgress: (p: number) => void; dispose: () => void } | null = null;
    let trigger: { kill: (revert?: boolean) => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ createSectorScene }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('@/lib/three/sectorMorph'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      scene = createSectorScene({ canvas, dirSign: dirSign() });

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        // 300vh of scroll distance for three sectors (§8.3).
        end: '+=300%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate(self) {
          // 0..2 across the three states.
          const p = self.progress * 2;
          scene?.setProgress(p);
          const next = Math.min(2, Math.round(self.progress * 2.999 - 0.25));
          setActive(next < 0 ? 0 : next);
        },
      });
      trigger = st;
    })();

    return () => {
      cancelled = true;
      trigger?.kill(true);
      scene?.dispose();
    };
  }, [interactive]);

  /* ---------------------------------------------------------- static path --- */
  if (!interactive) {
    return (
      <section className="section on-dark" aria-labelledby="sectors-heading">
        <div className="content">
          <h2 id="sectors-heading" className="t-h2">
            {d.home.sectorsHeading}
          </h2>
          <p className="t-body-l measure" style={{ marginBlockStart: 'var(--s-4)' }}>
            {d.home.sectorsLead}
          </p>

          <div className="sectors-stack" style={{ marginBlockStart: 'var(--s-16)' }}>
            {sectors.map((sector) => (
              <article key={sector.key}>
                <div className="sector-block-scene">
                  <SectorStill sector={sector.key} />
                </div>
                <p className="t-label sector-word" style={{ marginBlockStart: 'var(--s-6)' }}>
                  {sector.word}
                </p>
                <h3 className="t-h3 sector-name">{sector.name}</h3>
                <p className="t-body sector-body measure">{sector.lead}</p>
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

  /* -------------------------------------------------------- pinned path --- */
  return (
    <section ref={sectionRef} className="sectors-pin on-dark" aria-labelledby="sectors-heading">
      <div className="content">
        <h2 id="sectors-heading" className="sr-only">
          {d.home.sectorsHeading}
        </h2>

        <div className="sectors-layout">
          <div className="sectors-scene">
            <canvas ref={canvasRef} className="scene" aria-hidden="true" />
          </div>

          <div>
            {sectors.map((sector, i) => (
              <div
                key={sector.key}
                className="sector-panel"
                data-state={i === active ? 'in' : 'out'}
                aria-hidden={i === active ? undefined : true}
                style={{
                  // Panels are stacked so the column height never jumps as the
                  // text swaps. Only the active one is visible or reachable.
                  display: i === active ? 'block' : 'none',
                }}
              >
                <p className="t-label sector-word">{sector.word}</p>
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
