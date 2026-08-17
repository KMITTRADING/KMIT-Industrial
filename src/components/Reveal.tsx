'use client';

import { useEffect, useRef, type ElementType } from 'react';

/**
 * Entry reveal wrapper (§11.1): translateY(48px) + blur(6px) + opacity 0 easing
 * to rest over 800ms, staggered 80ms inside a list.
 *
 * The rule that matters most here is §11's "content is visible by default" and
 * §15.1's "no `opacity: 0` as an initial state in CSS". So the hidden state is
 * added by this effect *after* mount. A crawler, a visitor with JS disabled, and
 * anyone whose script fails all see finished content; the animation is purely
 * additive. Reduced motion skips the hidden state entirely.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
  imageMask = false,
  ...rest
}: {
  children: React.ReactNode;
  as?: ElementType;
  /** Stagger offset in ms. 80ms per item inside one list (§11.1). */
  delay?: number;
  className?: string;
  /** Use the clip-path image wipe instead of the standard rise (§11.5). */
  imageMask?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already scrolled past on load: leave it finished rather than replaying.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.dataset.reveal = 'in';
      return;
    }

    el.dataset.reveal = 'pending';

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.reveal = 'in';
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={[imageMask ? 'img-mask' : '', className].filter(Boolean).join(' ')}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
