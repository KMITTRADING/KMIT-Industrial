/**
 * Icon set (§5.7). One family, thin strokes, drawn on a 24-unit grid in the
 * geometric Phosphor Light idiom.
 *
 * These are hand-drawn as stroked paths rather than pulled from
 * `@phosphor-icons/react` for one reason the brief is specific about: §5.7 fixes
 * the stroke at 1.25px, and Phosphor ships its Light weight as filled outlines
 * at a fixed 1.5 optical weight that cannot be restruck. Stroked geometry also
 * scales without the fill hinting getting muddy at 20px. Same visual family,
 * exact specified weight, and no dependency for six glyphs.
 *
 * Every icon is decorative: `aria-hidden` is on by default and the adjacent text
 * is the readable content (§5.7). Directional glyphs flip with `dir`; the rest
 * never do (§6.3).
 */

type IconProps = {
  size?: number;
  className?: string;
  /** Set only when the icon is the sole content of a control. */
  title?: string;
};

function Svg({
  size = 20,
  className,
  title,
  children,
  flip = false,
}: IconProps & { children: React.ReactNode; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
      style={flip ? { transform: 'scaleX(var(--icon-flip, 1))' } : undefined}
    >
      {children}
    </svg>
  );
}

/** Location. Non-directional: never mirrored. */
export function MapPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </Svg>
  );
}

/** Mobile. Non-directional. */
export function Phone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.4 3h7.2a1.6 1.6 0 0 1 1.6 1.6v14.8A1.6 1.6 0 0 1 15.6 21H8.4a1.6 1.6 0 0 1-1.6-1.6V4.6A1.6 1.6 0 0 1 8.4 3Z" />
      <path d="M10.6 5.6h2.8" />
      <path d="M11.2 18.1h1.6" />
    </Svg>
  );
}

/** Email. Non-directional. */
export function Envelope(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6.5h18v11H3z" />
      <path d="M3.4 6.9 12 13.2l8.6-6.3" />
    </Svg>
  );
}

/**
 * Reading-direction arrow. Points along the reading direction, so it mirrors
 * with `dir` (§6.3). The flip is driven by --icon-flip, set once on <html>.
 */
export function ArrowForward(props: IconProps) {
  return (
    <Svg {...props} flip>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </Svg>
  );
}

/** Hamburger. The bars are transformed into an X by the nav, so they are ids. */
export function MenuBars({ size = 22, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
    >
      <path d="M4 8h16" className="menu-bar menu-bar-top" />
      <path d="M4 16h16" className="menu-bar menu-bar-bottom" />
    </svg>
  );
}

/** Download / outward link marker for the map tile. Non-directional. */
export function ArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </Svg>
  );
}
