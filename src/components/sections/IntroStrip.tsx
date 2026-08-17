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

    for (const span of spans) span.style.setProperty('--scrub-floor', '0.15');

    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    (async () => {
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
    })();

    return () => {
      cancelled = true;
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
