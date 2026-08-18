/**
 * Build a scene only when its section is close to the viewport, and only once
 * the main thread is free.
 *
 * Why (B4): the scenes used to be constructed during hydration, all of them, no
 * matter where they sat on the page. Constructing one is not cheap — bevelled
 * geometry, a PMREM environment on the first call, and a shader compile per
 * material — and doing that for the sector morph and the material journey while
 * React was still hydrating produced a single ~2.7s blocking task on a machine
 * without a GPU. That is invisible on a developer's workstation and is exactly
 * what a headless Lighthouse runner measures.
 *
 * Pins are deliberately NOT deferred. A ScrollTrigger pin changes the height of
 * the document, so creating one late would move everything below it. The pin is
 * still made at mount; only the WebGL work waits, and the scene's `setProgress`
 * is simply not called until it exists.
 *
 * ------------------------------------------------------------------------
 * Deferring is an optimisation, and an optimisation that can silently never
 * finish is a bug. Two failure modes are guarded explicitly, because a scene
 * that never builds leaves an empty field where the whole visual argument of
 * the page was supposed to be:
 *
 *   1. `requestIdleCallback` with no timeout can be starved indefinitely. Lenis
 *      and GSAP both hold a rAF loop open for as long as the visitor keeps
 *      scrolling, so on a real machine the browser may never report an idle
 *      period at all. Every call here passes a timeout, which makes the
 *      callback fire regardless.
 *
 *   2. The IntersectionObserver may never report an intersection — a zero-sized
 *      element at observe time, a transformed or pinned ancestor, an engine
 *      quirk. A deadline timer builds the scene anyway rather than waiting
 *      forever for an event that is not coming.
 *
 * The rule behind both: the scene always gets built. Deferring may only decide
 * *when*, never *whether*.
 * ------------------------------------------------------------------------
 */

/** How much room to give it: build the scene one viewport before it is needed. */
const ROOT_MARGIN = '100% 0px';

/** Longest the idle queue may hold the build back. */
const IDLE_TIMEOUT_MS = 400;

/**
 * Longest we wait for an intersection before building regardless. Generous
 * enough that a visitor who never scrolls does not pay for scenes far down the
 * page during the load window, short enough that a missed event is invisible.
 */
const INTERSECTION_DEADLINE_MS = 4000;

export type Deferred = { cancel: () => void };

export function buildWhenNear(element: HTMLElement, build: () => void): Deferred {
  let cancelled = false;
  let built = false;
  let idle = 0;
  let deadline = 0;
  let observer: IntersectionObserver | null = null;

  const schedule = (cb: () => void) => {
    if (typeof window.requestIdleCallback === 'function') {
      return window.requestIdleCallback(() => cb(), { timeout: IDLE_TIMEOUT_MS });
    }
    // Safari shipped requestIdleCallback late; the timeout is the whole point.
    return window.setTimeout(cb, 200);
  };

  const run = () => {
    if (cancelled || built) return;
    built = true;
    observer?.disconnect();
    observer = null;
    window.clearTimeout(deadline);
    idle = schedule(() => {
      if (!cancelled) build();
    }) as unknown as number;
  };

  if (typeof IntersectionObserver === 'undefined') {
    run();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) run();
      },
      { rootMargin: ROOT_MARGIN }
    );
    observer.observe(element);
    deadline = window.setTimeout(run, INTERSECTION_DEADLINE_MS);
  }

  return {
    cancel() {
      cancelled = true;
      observer?.disconnect();
      window.clearTimeout(deadline);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    },
  };
}
