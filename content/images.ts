/**
 * Every image on the site is referenced through this map — never a path
 * hardcoded in a component — because all of them are placeholders to be
 * replaced with KMIT photography later. One edit here swaps an asset
 * everywhere it appears.
 *
 * Width and height are required, not optional. They are what reserves the box
 * before the file loads and keeps CLS at zero (§9), so a new entry cannot be
 * added without them.
 */
export type ImageAsset = {
  readonly src: string | null;
  readonly width: number;
  readonly height: number;
  /** Alt text is per-locale: a translated alt is a worse alt. */
  readonly alt: { readonly en: string; readonly ar: string };
};

export const IMAGES = {
  /*
   * PLACEHOLDER: the About section's single image slot. `src: null` renders the
   * reserved box as a neutral banded panel — visibly a slot, never mistaken for
   * a photograph — at exactly the dimensions the real file will occupy. Drop a
   * path in and the panel becomes the photograph with no layout shift.
   */
  about: {
    src: null,
    width: 1120,
    height: 840,
    alt: {
      en: 'KMIT Industrial Solutions, Jeddah',
      ar: 'شركة حلول كميت للصناعة، جدة',
    },
  },
} as const satisfies Record<string, ImageAsset>;
