/**
 * The core sample, as data.
 *
 * One exploration core: a vertical cylinder of stacked bands, bone limestone at
 * the bottom running up through grey into brand blue, with the top band a
 * laminated solar panel. That single material break — matte rock below, low
 * roughness and raised metalness above — is the argument of the whole site
 * expressed in one object.
 *
 * The heights are authored, not generated. The brief asks for subtle natural
 * variation that is deterministic rather than random-per-load, and a fixed
 * array is the only way to get that which cannot drift: there is no seed to
 * get wrong, no PRNG whose implementation might change, and the same numbers
 * feed both renderers.
 *
 * Both the WebGL object and the CSS fallback read this file, which is what
 * makes the fallback the same idea rather than a different picture.
 */

export type Band = {
  /** Relative height. The renderer normalises the stack to a fixed total. */
  readonly height: number;
  readonly color: string;
  readonly roughness: number;
  readonly metalness: number;
};

/*
 * Fourteen bands. The variation is small and irregular — thin partings between
 * thicker beds — because that is what a real core looks like. Perfectly even
 * bands would read as a graphic, and a wildly uneven stack would read as a
 * game asset.
 */
const HEIGHTS = [
  1.35, 0.62, 1.18, 1.52, 0.74, 1.06, 1.44, 0.58, 1.28, 0.96, 1.34, 0.68, 1.12, 0.85,
] as const;

/** Bottom to top: limestone, grey, then the two brand blues. */
const RAMP = ['#efece6', '#b9becf', '#3d55a4', '#2b3073'] as const;

/** Linear interpolation across the ramp in sRGB byte space. */
function sampleRamp(t: number): string {
  const span = (RAMP.length - 1) * Math.min(1, Math.max(0, t));
  const i = Math.min(RAMP.length - 2, Math.floor(span));
  const f = span - i;
  const from = RAMP[i]!;
  const to = RAMP[i + 1]!;
  const channel = (offset: number) => {
    const a = parseInt(from.slice(1 + offset, 3 + offset), 16);
    const b = parseInt(to.slice(1 + offset, 3 + offset), 16);
    return Math.round(a + (b - a) * f);
  };
  return `#${[0, 2, 4].map((o) => channel(o).toString(16).padStart(2, '0')).join('')}`;
}

export const BANDS: readonly Band[] = HEIGHTS.map((height, i) => {
  const isCrown = i === HEIGHTS.length - 1;
  return {
    height,
    // The crown keeps the darkest blue rather than being sampled, so the panel
    // reads as one deliberate slab rather than as the end of a gradient.
    color: isCrown ? '#2b3073' : sampleRamp(i / (HEIGHTS.length - 1)),
    // Rock is matte and non-metallic. The panel is a glass laminate.
    roughness: isCrown ? 0.08 : 0.82 - (i / HEIGHTS.length) * 0.12,
    metalness: isCrown ? 0.55 : 0.02,
  };
});

/** The seam rings sit between bands, in a neutral a shade darker than the rock. */
export const SEAM_COLOR = '#8c8f9c';

export const TOTAL_HEIGHT = BANDS.reduce((sum, band) => sum + band.height, 0);
