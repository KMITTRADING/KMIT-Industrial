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
 */

/** How much room to give it: build the scene one viewport before it is needed. */
const ROOT_MARGIN = '100% 0px';

export type Deferred = { cancel: () => void };

export function buildWhenNear(element: HTMLElement, build: () => void): Deferred {
  let cancelled = false;
  let idle = 0;
  let observer: IntersectionObserver | null = null;

  const schedule =
    window.requestIdleCallback ??
    ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));

  const run = () => {
    observer?.disconnect();
    observer = null;
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
  }

  return {
    cancel() {
      cancelled = true;
      observer?.disconnect();
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    },
  };
}
