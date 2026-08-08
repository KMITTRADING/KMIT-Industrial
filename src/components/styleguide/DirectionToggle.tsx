'use client';

import { createContext, useContext, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Direction harness for the styleguide.
 *
 * Every specimen renders inside a subtree whose `dir` this controls, so a
 * reviewer can flip the whole page between RTL and LTR, or put the two side by
 * side, without switching locale and without reloading.
 *
 * This is the only place in the codebase that sets `dir` on anything other than
 * the document root. It exists because RTL bugs are invisible to anyone
 * reviewing only the English page, and the cheapest way to catch them is to
 * make both directions visible at once.
 *
 * Because the token layer keys its typographic adjustments off `[dir]` rather
 * than `[lang]`, a flipped subtree picks up Arabic leading and tracking
 * automatically.
 */

type Mode = 'rtl' | 'ltr' | 'both';

const DirectionContext = createContext<Mode>('rtl');

export function useDirectionMode() {
  return useContext(DirectionContext);
}

export function DirectionProvider({
  initial = 'rtl',
  children,
}: {
  initial?: Mode;
  children: ReactNode;
}) {
  const t = useTranslations();
  const [mode, setMode] = useState<Mode>(initial);

  const options: { id: Mode; label: string }[] = [
    { id: 'rtl', label: 'RTL' },
    { id: 'ltr', label: 'LTR' },
    { id: 'both', label: 'RTL + LTR' },
  ];

  return (
    <DirectionContext.Provider value={mode}>
      <div className="sticky top-16 z-[var(--z-dropdown)] mb-10 flex flex-wrap items-center gap-3 border-y border-border-subtle bg-surface-page/95 py-3 backdrop-blur-sm">
        <span className="text-2xs font-semibold text-ink-muted">Direction</span>
        <div role="group" aria-label={t('a11y.localeSwitcher')} className="flex gap-1">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={mode === option.id}
              onClick={() => setMode(option.id)}
              className={cn(
                'min-h-11 rounded-sm border px-3 py-1.5 text-xs',
                'transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                mode === option.id
                  ? 'border-accent-700 bg-surface-accent font-medium text-ink-inverse'
                  : 'border-border-default bg-surface-page text-ink-secondary hover:border-ink-accent hover:text-ink-accent',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </DirectionContext.Provider>
  );
}

/**
 * Wraps one specimen. In `both` mode it renders the specimen twice, in two
 * columns, each with its own direction, so a spacing bug shows up as an
 * asymmetry between the panes rather than as something a reviewer has to
 * remember from the previous page load.
 */
export function DirectionFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mode = useDirectionMode();

  if (mode !== 'both') {
    return (
      <div dir={mode} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-px bg-border-subtle lg:grid-cols-2', className)}>
      <div dir="rtl" className="bg-surface-page p-5">
        <p className="mb-4 text-2xs font-semibold text-ink-muted">RTL</p>
        {children}
      </div>
      <div dir="ltr" className="bg-surface-page p-5">
        <p className="mb-4 text-2xs font-semibold text-ink-muted">LTR</p>
        {children}
      </div>
    </div>
  );
}

export default DirectionProvider;
