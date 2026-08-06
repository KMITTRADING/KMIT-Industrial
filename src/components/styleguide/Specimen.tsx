import { DirectionFrame } from './DirectionToggle';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Styleguide scaffolding.
 *
 * The labels here are component and state names, which are API identifiers
 * rather than page copy, so they are written in English in the source and are
 * deliberately not part of the localised content tree. Translating `hover` or
 * `variant="secondary"` would make the reference harder to use, not easier.
 */

export function SpecimenSection({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 pt-section-sm">
      <h2
        id={`${id}-heading`}
        className="border-b-2 border-border-strong pb-3 text-2xl font-semibold text-ink-primary"
      >
        {title}
      </h2>
      {note ? <p className="measure-prose mt-4 text-sm text-ink-secondary">{note}</p> : null}
      <div className="mt-8 flex flex-col gap-10">{children}</div>
    </section>
  );
}

export function Specimen({
  label,
  description,
  children,
  /** Skip the direction frame for specimens whose direction is fixed by design. */
  fixedDirection = false,
  className,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  fixedDirection?: boolean;
  className?: string;
}) {
  const body = (
    <div className={cn('flex flex-wrap items-start gap-4', className)}>{children}</div>
  );

  return (
    <article className="flex flex-col gap-3">
      <header className="flex flex-wrap items-baseline gap-3">
        <h3 className="font-mono text-sm font-semibold text-ink-primary">{label}</h3>
        {description ? <p className="text-xs text-ink-muted">{description}</p> : null}
      </header>
      <div className="rounded-md border border-border-subtle bg-surface-raised p-5">
        {fixedDirection ? body : <DirectionFrame>{body}</DirectionFrame>}
      </div>
    </article>
  );
}

export function SpecimenGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function SwatchRow({
  name,
  variable,
  className,
}: {
  name: string;
  variable: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className={cn('size-10 shrink-0 rounded-xs border border-border-subtle', className)}
      />
      <div className="min-w-0">
        <p className="font-mono text-xs text-ink-primary">{name}</p>
        <p className="truncate font-mono text-2xs text-ink-muted">{variable}</p>
      </div>
    </div>
  );
}
