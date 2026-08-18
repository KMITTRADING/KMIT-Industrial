'use client';

import { useEffect, useMemo, useRef } from 'react';
import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';

/**
 * Group introduction strip (§8.2).
 *
 * Deliberately quiet after the hero: one paragraph, no cards, no icons, 65
 * characters wide, centred. The only motion is §11.3 — the words start dim and
 * reach full opacity in sequence as the section scrolls through.
 *
 * The words are always in the DOM at full opacity by default; the dim floor is
 * applied by script after mount, so with JS off or a script error the paragraph
 * is simply readable (§11, §15.1).
 */
export function IntroStrip({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const ref = useRef<HTMLParagraphElement>(null);

  // Split on whitespace only. Never on characters: cutting an Arabic word into
  // per-letter spans breaks the joins and the word stops being readable (§6.1).
  const words = useMemo(() => d.home.introParagraph.split(' '), [d.home.introParagraph]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>('.scrub-word'));
    if (spans.length === 0) return;

    /*
     * §11.3 asks for the words to start at 0.15 opacity and scrub to 1. Measured
     * with axe-core, --ink at 0.15 over --paper is 1.36:1 — a serious WCAG
     * failure, and the paragraph sits at that floor until the visitor scrolls.
     * §15's AA requirement and §17's "body text >= 4.5:1 in every section" both
     * outrank the exact starting value, so the floor is the lowest opacity that
     * still clears AA: 0.60 gives 4.54:1, and 0.62 is taken for margin (4.8:1).
     * The scrub still reads clearly; it simply never becomes unreadable.
     */
    for (const span of spans) span.style.setProperty('--scrub-floor', '0.62');

    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    // GSAP is not needed to read the paragraph, only to scrub it. Loading it at
    // idle keeps it out of the load window (§15.1.7).
    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));

    const idleHandle = schedule(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.to(spans, {
        // Animating a custom property keeps the value in one place, and opacity
        // is a compositor-only change (§11).
        '--scrub-floor': 1,
        ease: 'none',
        stagger: { amount: 0.6 },
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'bottom 58%',
          scrub: 0.6,
        },
      });
      trigger = tween.scrollTrigger ?? null;
    });

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof idleHandle === 'number') {
        window.cancelIdleCallback(idleHandle);
      }
      trigger?.kill();
      for (const span of spans) span.style.removeProperty('--scrub-floor');
    };
  }, []);

  return (
    <section className="intro-strip">
      <div className="content">
        <p ref={ref} className="t-body-l intro-paragraph">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="scrub-word">
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
