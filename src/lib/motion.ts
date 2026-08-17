/**
 * Shared motion helpers (§11, §6.1).
 *
 * The direction multiplier is the single most dangerous omission in a bilingual
 * GSAP build: GSAP knows nothing about `dir`, so an unmultiplied `x: 80` slides
 * the wrong way in Arabic. Everything that animates on the x axis reads `dirSign()`.
 */

export const DUR = {
  micro: 0.18,
  standard: 0.48,
  cinematic: 0.9,
} as const;

/** Exponential ease-out. No linear, ease-in-out, bounce or elastic (§11). */
export const EASE = {
  micro: 'cubic-bezier(0.22, 1, 0.36, 1)',
  standard: 'cubic-bezier(0.16, 1, 0.30, 1)',
  /** GSAP equivalents of the two curves above. */
  gsapMicro: 'power3.out',
  gsapStandard: 'expo.out',
} as const;

/** +1 in LTR, -1 in RTL. Multiply every x-axis translation by this. */
export function dirSign(): 1 | -1 {
  if (typeof document === 'undefined') return 1;
  return document.documentElement.dir === 'rtl' ? -1 : 1;
}

/** True when the visitor asked for reduced motion (§11). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Whether this device should run the heavy layers at all (§10).
 * A weak CPU, a slow or metered connection, or no WebGL at all sends the visitor
 * down the static image path. Reduced motion does the same.
 */
export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return true;
  if (prefersReducedMotion()) return true;

  const cores = navigator.hardwareConcurrency ?? 2;
  if (cores <= 4) return true;

  type NetworkInformation = { effectiveType?: string; saveData?: boolean };
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|-)(slow-)?2g$|^3g$/.test(conn.effectiveType)) return true;

  return false;
}

/** Cheap WebGL capability probe. The context is discarded immediately. */
export function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Combined gate: may this page mount a WebGL scene? */
export function canRender3D(): boolean {
  return !isLowPowerDevice() && hasWebGL();
}

/** Device pixel ratio capped at 1.75 (§10). */
export function cappedDpr(): [number, number] {
  return [1, 1.75];
}
