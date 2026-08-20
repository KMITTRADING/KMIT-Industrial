/**
 * Two treatments, both anchors — every action on this site navigates, opens a
 * mail client or places a call. Nothing here submits.
 *
 * `primary` is the brand fill. `quiet` is a text action with a rule that draws
 * from the leading edge on hover and focus; the draw direction is expressed
 * with a logical transform-origin, so RTL mirrors it without an override.
 *
 * Both clear 44px in the block axis (§10).
 */

const ARROW = (
  // A hairline arrow, drawn rather than imported: one more dependency for one
  // glyph is not a trade worth making. `rtl:-scale-x-100` points it at the
  // trailing edge in both directions.
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="size-4 shrink-0 rtl:-scale-x-100 transition-transform duration-200 ease-[var(--ease-micro)] group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
  >
    <path d="M1 8h13M9 3l5 5-5 5" />
  </svg>
);

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  withArrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'quiet';
  className?: string;
  withArrow?: boolean;
}) {
  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={`group inline-flex min-h-[3rem] items-center gap-3 bg-brand px-7 py-3.5 text-paper transition-colors duration-200 ease-[var(--ease-micro)] hover:bg-brand-2 ${className}`}
      >
        <span className="t-label">{children}</span>
        {withArrow ? ARROW : null}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`group relative inline-flex min-h-[2.75rem] items-center gap-2.5 text-brand ${className}`}
    >
      <span className="t-label">{children}</span>
      {withArrow ? ARROW : null}
      <span
        aria-hidden="true"
        className="absolute start-0 bottom-1 block h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
      />
    </a>
  );
}
