import Link from 'next/link';
import { ArrowForward } from './Icons';

/* ==========================================================================
   Bezel — the double-frame card (§5.4.1).
   Outer wrap in --brand-tint with a hairline and 6px of pad, inner face in
   --surface with a top inset highlight. Every primary card on the site uses it.
   ========================================================================== */
export function Bezel({
  children,
  dark = false,
  chamfer = false,
  className,
  ...rest
}: {
  children: React.ReactNode;
  dark?: boolean;
  /** Apply the 45deg cut. Ceiling of three per viewport, so opt in per instance. */
  chamfer?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[dark ? 'bezel-dark' : 'bezel', chamfer ? 'chamfer' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div className="bezel-face">{children}</div>
    </div>
  );
}

/* ==========================================================================
   StatelessCTA (§12) — a sharp rectangle with a nested icon square.
   Never a capsule (§14). Text is always verb + object (§13).
   ========================================================================== */
export function StatelessCTA({
  href,
  children,
  variant = 'primary',
  chamfer = false,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  chamfer?: boolean;
  external?: boolean;
  className?: string;
}) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-secondary',
    chamfer ? 'chamfer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      <span>{children}</span>
      <span className="btn-icon" aria-hidden="true">
        <ArrowForward size={14} />
      </span>
    </>
  );

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {body}
    </Link>
  );
}

/** Inline text link with a directional arrow. Text must stand alone (§15.1.2). */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={['link-inline', className].filter(Boolean).join(' ')} href={href}>
      <span>{children}</span>
      <ArrowForward size={16} />
    </Link>
  );
}

/* ==========================================================================
   PlaceholderBlock (§4.4) — a designed reservation for data that has not been
   approved. It must never read as a broken component, and it must never be
   filled with a plausible-looking invented value.
   ========================================================================== */
export function PlaceholderBlock({
  label,
  note,
  children,
  className,
}: {
  label: string;
  note: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={['placeholder', className].filter(Boolean).join(' ')}>
      <p className="placeholder-label t-label">
        <span className="placeholder-tick" aria-hidden="true" />
        {label}
      </p>
      {children}
      <p className="t-body measure" style={{ marginBlockStart: 'var(--s-3)' }}>
        {note}
      </p>
    </div>
  );
}

/** Section wrapper. Vertical rhythm comes from the token, never ad hoc. */
export function Section({
  children,
  dark = false,
  id,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  dark?: boolean;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={['section', dark ? 'on-dark' : '', className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  );
}
