import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Stat block.
 *
 * Not the hero-metric template: no oversized gradient number, no row of three
 * rounded stat cards. What this renders is closer to an instrument label, a
 * value read off a panel with its unit and its provenance underneath.
 *
 * Rules baked in:
 *
 * - The value is forced LTR and tabular. `98.5%` and `4.5-6.0 µm` are readings,
 *   and a reading must not reorder inside Arabic text.
 * - Every value can carry a `source`, which on this site is a test method. A
 *   number without its method is exactly the kind of claim the site exists to
 *   avoid making.
 * - Values are laid out as a description list, so the pairing survives being
 *   read linearly by a screen reader.
 */

export type Stat = {
  label: ReactNode;
  value: string;
  unit?: string;
  /** Test method, standard, or wherever the number comes from. */
  source?: ReactNode;
};

export type StatBlockProps = {
  stats: Stat[];
  /** `panel` puts the group on a sunken plate; `bare` sets it on the page. */
  variant?: 'bare' | 'panel';
  columns?: 2 | 3 | 4;
  className?: string;
};

export function StatBlock({ stats, variant = 'bare', columns = 3, className }: StatBlockProps) {
  const columnClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-px bg-border-subtle',
        columnClass,
        variant === 'panel' && 'border border-border-subtle',
        className,
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'flex flex-col gap-1 p-5',
            variant === 'panel' ? 'bg-surface-raised' : 'bg-surface-page',
          )}
        >
          <dt className="text-xs font-medium text-ink-muted">{stat.label}</dt>
          <dd
            dir="ltr"
            className="flex items-baseline gap-1.5 text-start text-2xl font-semibold text-ink-primary tabular-nums"
          >
            {stat.value}
            {stat.unit ? (
              <span className="text-sm font-normal text-ink-secondary">{stat.unit}</span>
            ) : null}
          </dd>
          {stat.source ? <dd className="text-2xs text-ink-muted">{stat.source}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

export default StatBlock;
