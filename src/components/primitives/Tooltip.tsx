'use client';

import { useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Tooltip.
 *
 * A tooltip is a supplement, never the only place information lives. On this
 * site it carries one thing: the expansion of a test-method abbreviation next
 * to a value. If a fact matters, it is on the page.
 *
 * Behaviour worth naming:
 *
 * - Opens on hover *and* on focus, so it is reachable from a keyboard.
 * - Closes on Escape and on blur.
 * - A short open delay stops it flickering as the pointer crosses a table row,
 *   and the delay is skipped when another tooltip in the same group was open
 *   moments ago. Scanning a row of abbreviations should not mean waiting each
 *   time.
 * - Never contains an interactive element. A tooltip that can be clicked is a
 *   popover, and a popover needs different semantics.
 */

let lastClosedAt = 0;
const SKIP_DELAY_WINDOW = 400;

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Tooltip({ content, children, delay = 180, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = (immediate = false) => {
    clearTimeout(timer.current);
    const skip = immediate || Date.now() - lastClosedAt < SKIP_DELAY_WINDOW;
    if (skip) {
      setOpen(true);
      return;
    }
    timer.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    clearTimeout(timer.current);
    if (open) lastClosedAt = Date.now();
    setOpen(false);
  };

  return (
    <span
      className={cn('relative inline-flex', className)}
      onPointerEnter={() => show()}
      onPointerLeave={hide}
      onFocusCapture={() => show(true)}
      onBlurCapture={hide}
      onKeyDown={(event) => {
        if (event.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>

      <span
        id={id}
        role="tooltip"
        // Kept in the DOM so the description is available to assistive tech the
        // moment it is referenced, rather than racing the render.
        hidden={!open}
        className={cn(
          'absolute start-1/2 bottom-full z-[var(--z-tooltip)] mb-2 -translate-x-1/2 rtl:translate-x-1/2',
          'w-max max-w-56 rounded-sm border border-border-default bg-surface-inverse',
          'px-2.5 py-1.5 text-2xs text-ink-inverse shadow-raised',
        )}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
