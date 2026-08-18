import { ICON_BODY, ICON_VIEWBOX, LOGO_BODY, LOGO_VIEWBOX } from './marks';

/**
 * The full lockup (§5.6). Sized by height; the width follows the 1920:648.6
 * aspect ratio. 28px in the navigation bar, 44px in the footer.
 *
 * Rules enforced here rather than left to the caller:
 *  - monochrome, filled with currentColor, so the ground decides the colour
 *  - never mirrored in RTL: `dir` is pinned to ltr on the svg element
 *  - no gradient fill, no shadow, no border
 *  - clear space of one full K stem on every side, applied as padding by the
 *    wrapper so no neighbouring text can crowd the mark
 */

const LOGO_RATIO = 1920 / 648.6;
/** The K stem is ~145 units wide in a 648.6-unit-tall mark. */
const CLEAR_SPACE = 145 / 648.6;

export function Logo({
  height = 28,
  title,
  className,
}: {
  height?: number;
  /** Accessible name. Omit when a nearby text node already names the link. */
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={{
        /* Path geometry does not mirror with `dir`, but pinning the direction
           makes that explicit and immune to an inherited `direction` (§5.6). */
        direction: 'ltr',
        height,
        width: height * LOGO_RATIO,
        // clear space kept as padding-free margin so the box stays tight
        marginInline: height * CLEAR_SPACE * 0.5,
        flex: 'none',
      }}
    >
      {LOGO_BODY}
    </svg>
  );
}

/**
 * The icon alone. Used for the favicon, the share image, and — at 60vw with a
 * 4% white fill — as the cropped watermark behind the footer and the material
 * journey. That oversizing is the only permitted enlargement of the mark (§5.6).
 */
export function BrandIcon({
  size = 24,
  title,
  className,
  style,
}: {
  size?: number | string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ratio = 655.3 / 648.6;
  return (
    <svg
      viewBox={ICON_VIEWBOX}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={{
        direction: 'ltr',
        height: size,
        width: typeof size === 'number' ? size * ratio : `calc(${size} * ${ratio})`,
        flex: 'none',
        ...style,
      }}
    >
      {ICON_BODY}
    </svg>
  );
}
