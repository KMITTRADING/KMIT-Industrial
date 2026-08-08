'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import type { HTMLAttributes } from 'react';

/**
 * The horizontal scroll shell for a wide table.
 *
 * Split out of `Table.tsx` in Phase 6 and it is the only part of the table
 * system that needs the client. Everything else is markup, and while it all
 * lived behind one `'use client'` directive, every page carrying any table
 * shipped and hydrated the whole module: the spec table, the comparison table,
 * the document library and the grade selector all paid for a scroll observer
 * they mostly do not use.
 *
 * What genuinely needs the client here: whether the content overflows is a
 * measured fact, not a static one, and the region must only become a keyboard
 * stop when it actually scrolls.
 */

/* ----------------------------------------------------------- scroll shell */

export type TableScrollProps = HTMLAttributes<HTMLDivElement> & {
  /** Accessible name for the scroll region. */
  label: string;
  /** Shown while the table overflows and has not been panned to the end. */
  hint?: string;
};

export function TableScroll({ label, hint, className, children, ...props }: TableScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const overflows = node.scrollWidth - node.clientWidth > 2;
      setOverflowing(overflows);
      // scrollLeft is negative in RTL in every current engine, so compare on
      // magnitude rather than assuming a direction.
      const travelled = Math.abs(node.scrollLeft);
      setAtEnd(!overflows || travelled >= node.scrollWidth - node.clientWidth - 2);
    };

    measure();
    node.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={ref}
        // A scrollable region must be reachable by keyboard. tabIndex only when
        // it actually scrolls, so a fitting table does not add a stop.
        tabIndex={overflowing ? 0 : -1}
        role={overflowing ? 'region' : undefined}
        aria-label={overflowing ? label : undefined}
        className="overflow-x-auto overscroll-x-contain"
      >
        {children}
      </div>

      {hint && overflowing && !atEnd ? (
        <p aria-hidden className="mt-2 text-2xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
