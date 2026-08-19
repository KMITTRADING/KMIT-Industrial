/**
 * One scroll listener for the whole site.
 *
 * The brief asks for native sticky plus a single rAF-gated scroll listener in
 * preference to a scroll library, and this is that listener. Subscribers get
 * called at most once per frame with the current scroll position; nothing else
 * in the app is allowed to attach a scroll handler.
 *
 * Why one and not several: N listeners each doing their own getBoundingClientRect
 * is N forced layouts per frame. Here the measurements happen once, inside a
 * single rAF, and every subscriber reads the same numbers.
 */

export type ScrollState = {
  readonly scrollY: number;
  readonly viewportHeight: number;
};

type Subscriber = (state: ScrollState) => void;

const subscribers = new Set<Subscriber>();
let frame = 0;
let started = false;

function measure(): ScrollState {
  return { scrollY: window.scrollY, viewportHeight: window.innerHeight };
}

function tick() {
  frame = 0;
  const state = measure();
  for (const subscriber of subscribers) subscriber(state);
}

/** Coalesces bursts of scroll events into one callback per frame. */
function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(tick);
}

/**
 * Subscribe to scroll. Returns an unsubscribe function.
 *
 * The listeners are attached on the first subscription and torn down when the
 * last one leaves, so a page with the motion layer disabled never installs
 * them at all.
 */
export function onScroll(subscriber: Subscriber): () => void {
  subscribers.add(subscriber);

  if (!started) {
    started = true;
    // Passive: this never calls preventDefault, and saying so lets the browser
    // scroll without waiting to find out.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }

  // Fire once immediately so a subscriber is correct before the first scroll
  // rather than only after one.
  subscriber(measure());

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0 && started) {
      started = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/** 0 before `from`, 1 after `to`, linear between. Guards a zero-length range. */
export function progress(value: number, from: number, to: number): number {
  if (to <= from) return 0;
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}
