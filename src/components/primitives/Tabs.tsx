'use client';

import { useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Tabs.
 *
 * Follows the WAI-ARIA tabs pattern including the part most implementations
 * skip: arrow-key roving focus with only the active tab in the tab order, so a
 * keyboard user tabs into the tablist once and then arrows across it rather
 * than tabbing through every panel title.
 *
 * The arrow keys are direction-aware. In Arabic, ArrowLeft moves to the *next*
 * tab, because next is leftwards. Getting this backwards is the single most
 * common RTL bug in a tab implementation, and it is invisible to anyone testing
 * only the English page.
 *
 * The active tab is marked by a 3px rule on the block-end edge plus a weight
 * change, never by colour alone.
 */

export type TabItem = {
  id: string;
  label: ReactNode;
  panel: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tablist. */
  label: string;
  defaultId?: string;
  className?: string;
};

export function Tabs({ items, label, defaultId, className }: TabsProps) {
  const base = useId();
  const first = items[0];
  const [active, setActive] = useState(defaultId ?? first?.id ?? '');
  const listRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const tabId = (id: string) => `${base}-tab-${id}`;
  const panelId = (id: string) => `${base}-panel-${id}`;

  const focusTab = (index: number) => {
    const wrapped = (index + items.length) % items.length;
    const target = items[wrapped];
    if (!target) return;
    setActive(target.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(tabId(target.id))}`)
      ?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === active);
    if (index < 0) return;

    // Resolve "forward" from the document direction rather than assuming LTR.
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case forward:
        event.preventDefault();
        focusTab(index + 1);
        break;
      case backward:
        event.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-border-subtle"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              id={tabId(item.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(item.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                'shrink-0 px-4 py-3 text-sm whitespace-nowrap',
                '-mb-px border-b-[3px]',
                'transition-[color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                selected
                  ? 'border-ink-accent font-semibold text-ink-accent'
                  : 'border-transparent text-ink-secondary hover:border-border-strong hover:text-ink-primary',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={panelId(item.id)}
          role="tabpanel"
          aria-labelledby={tabId(item.id)}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-6"
        >
          {item.id === active ? item.panel : null}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
