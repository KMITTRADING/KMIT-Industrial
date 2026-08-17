import type Lenis from 'lenis';

declare global {
  interface Window {
    /** Set by <SmoothScroll>; read by the language switcher and pinned sections. */
    __lenis?: Lenis;
  }
}

export {};
