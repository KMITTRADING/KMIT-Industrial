'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll progress rule — one of the three permitted uses of the gradient (§5.1).
 *
 * Fills from the reading edge: right in Arabic, left in English (§6.1), via
 * `--progress-origin`, since `transform-origin` takes no logical keyword.
 *
 * §11 forbids listening to `scroll` for *detection* — that is what
 * IntersectionObserver is for. A progress bar needs a continuous value rather
 * than a threshold, so a passive listener is the right tool, and the work per
 * frame is one rAF-coalesced transform write on a composited element.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress-fill" />
    </div>
  );
}
