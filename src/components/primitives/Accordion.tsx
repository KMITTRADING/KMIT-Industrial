'use client';

import { useId, useState } from 'react';

import { ChevronDownIcon } from './IconSet';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Accordion.
 *
 * Built on native `<details>`/`<summary>` rather than divs with ARIA, so it
 * works before hydration, it is findable by the browser's in-page search, and
 * the open state survives printing. React state is used only to drive the
 * chevron and the optional single-open behaviour.
 *
 * The chevron rotates rather than swapping glyphs, at 160ms: fast enough to
 * read as a response to the click, slow enough to show which way the panel
 * went.
 *
 * `interpolate-size: allow-keywords` would let the height animate; it is
 * deliberately not used, because a height transition on a text block causes a
 * reflow on every frame and the payoff is a flourish nobody asked for.
 */

export type AccordionItem = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /**
   * When true, opening one panel closes the others. Off by default: on an FAQ a
   * reader comparing two answers should be able to keep both open.
   */
  single?: boolean;
  defaultOpenId?: string;
  className?: string;
};

export function Accordion({ items, single = false, defaultOpenId, className }: AccordionProps) {
  const base = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string, willOpen: boolean) => {
    setOpen((current) => {
      if (!willOpen) return current.filter((entry) => entry !== id);
      return single ? [id] : [...current, id];
    });
  };

  return (
    <div
      className={cn('divide-y divide-border-subtle border-y border-border-subtle', className)}
    >
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <details
            key={item.id}
            name={single ? base : undefined}
            open={isOpen}
            onToggle={(event) => toggle(item.id, event.currentTarget.open)}
            className="group"
          >
            <summary
              className={cn(
                'flex cursor-pointer list-none items-start justify-between gap-4 py-5',
                'text-start text-base font-medium text-ink-primary',
                'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                'hover:text-ink-accent',
                '[&::-webkit-details-marker]:hidden',
              )}
            >
              {item.question}
              <ChevronDownIcon
                className={cn(
                  'mt-1 size-4 shrink-0 text-ink-muted',
                  'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                  isOpen && '-rotate-180',
                )}
              />
            </summary>
            <div className="measure-prose pb-6 text-sm text-ink-secondary">{item.answer}</div>
          </details>
        );
      })}
    </div>
  );
}

export default Accordion;
