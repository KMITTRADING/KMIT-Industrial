'use client';

import { useEffect } from 'react';
import { createMetricsCache, documentTop, onScroll, progress } from '@/lib/scrollDriver';

/**
 * Every piece of scroll-driven behaviour on the site, in one island.
 *
 * It renders nothing. It finds its targets by data attribute and writes CSS
 * custom properties and data attributes back onto them; the visual result is
 * expressed in CSS. That keeps this file about *when* things happen and the
 * stylesheet about *what* they look like.
 *
 * One island rather than five is a deliberate cost decision: five hydrated
 * components would each carry their own React boundary for behaviour that
 * amounts to a few dozen lines of DOM work.
 *
 * Nothing here runs under prefers-reduced-motion. The inline script in the
 * layout sets data-motion="on" before first paint, and this bails without it,
 * so a reduced-motion reader gets the static composition with no listeners
 * attached at all.
 */
export function MotionLayer() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== 'on') return;

    const cleanups: Array<() => void> = [];

    /* ---------------------------------------------------------------
       Reveals. CSS holds the transition; this only flips the attribute.
       `once` semantics: an element that has been seen stays revealed, so
       scrolling back up does not replay the page.
       --------------------------------------------------------------- */
    const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (revealTargets.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = 'shown';
            observer.unobserve(entry.target);
          }
        },
        // Fire a little before the element reaches the fold, so the motion
        // reads as the page arriving rather than as a delayed reaction.
        { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
      );
      for (const target of revealTargets) observer.observe(target);
      cleanups.push(() => observer.disconnect());
    }

    /* ---------------------------------------------------------------
       Scrollspy. Marks the nav anchor whose section is currently in the
       upper band of the viewport.
       --------------------------------------------------------------- */
    const anchors = new Map<string, HTMLAnchorElement>();
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-nav-anchor]')) {
      const id = anchor.dataset.navAnchor;
      if (id) anchors.set(id.replace('#', ''), anchor);
    }

    let currentSection = '';
    const setCurrent = (id: string) => {
      if (id === currentSection) return;
      currentSection = id;
      for (const [key, anchor] of anchors) {
        if (key === id) anchor.setAttribute('aria-current', 'true');
        else anchor.removeAttribute('aria-current');
      }
      // The language switch carries the reader's place across the locale
      // boundary, so /en#approach lands on /ar#approach (§8).
      for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-language-switch]')) {
        // noUncheckedIndexedAccess: split always yields at least one element,
        // but the type system cannot know that, and the fallback is free.
        const base = link.href.split('#')[0] ?? link.href;
        link.href = id ? `${base}#${id}` : base;
      }
    };

    const spySections = [...anchors.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    /* ---------------------------------------------------------------
       The single scroll subscription. Everything below is measured once
       per frame from the same numbers.
       --------------------------------------------------------------- */
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    const track = document.querySelector<HTMLElement>('[data-strata-track]');
    const strata = document.querySelector<HTMLElement>('[data-strata]');
    const steps = document.querySelectorAll<HTMLElement>('[data-strata-step]');
    const ticks = document.querySelectorAll<HTMLElement>('[data-strata-tick]');
    const arc = document.querySelector<SVGPathElement>('[data-region-arc]');
    const region = arc?.closest('section') ?? null;

    /* Document-absolute positions, recomputed only when the viewport changes.
       These were offsetTop until adding `position: relative` to the sections
       silently reparented the measurement and broke every threshold. */
    const metrics = createMetricsCache(() => ({
      sections: spySections.map((section) => ({ id: section.id, top: documentTop(section) })),
      trackTop: track ? documentTop(track) : 0,
      trackHeight: track?.offsetHeight ?? 0,
      regionTop: region ? documentTop(region) : 0,
      regionHeight: region?.offsetHeight ?? 0,
    }));

    cleanups.push(
      onScroll(({ scrollY, viewportHeight }) => {
        const m = metrics(viewportHeight);
        // Header gains its backdrop once the hero has started to leave.
        if (header) header.dataset.scrolled = scrollY > 48 ? 'true' : 'false';

        // Scrollspy: the last section whose top has passed the upper third.
        if (m.sections.length) {
          const line = scrollY + viewportHeight * 0.33;
          let active = '';
          for (const section of m.sections) {
            if (section.top <= line) active = section.id;
          }
          setCurrent(active);
        }

        // Signature scroll. One progress value drives the step crossfade here
        // and the band separation in the 3D layer (step 5), which is why it is
        // published on the section rather than kept local.
        if (track && strata && steps.length) {
          const start = m.trackTop - viewportHeight * 0.1;
          const end = m.trackTop + m.trackHeight - viewportHeight;
          const p = progress(scrollY, start, end);
          strata.style.setProperty('--strata-progress', p.toFixed(4));

          // Which step is active. Clamped so the last step holds to the end
          // rather than falling off it.
          const index = Math.min(steps.length - 1, Math.floor(p * steps.length));
          steps.forEach((step, i) => {
            step.dataset.active = i === index ? 'true' : 'false';
          });
          ticks.forEach((tick, i) => {
            tick.dataset.active = i <= index ? 'true' : 'false';
          });
        }

        // The Region arc draws itself as the section arrives.
        if (arc && region) {
          const p = progress(
            scrollY,
            m.regionTop - viewportHeight * 0.85,
            m.regionTop + m.regionHeight * 0.35 - viewportHeight * 0.5,
          );
          arc.style.strokeDashoffset = String(1 - p);
        }
      }),
    );

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
