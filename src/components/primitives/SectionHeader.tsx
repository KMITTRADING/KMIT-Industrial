import { cn } from '@/lib/utils';

import type { ElementType, ReactNode } from 'react';

/**
 * Section header: eyebrow, title, lede.
 *
 * The eyebrow is optional and should stay that way. A micro-label above every
 * section is the most recognisable generated-page rhythm there is, so the
 * budget for this site is at most one eyebrow per three sections, and the
 * headline is expected to carry the section on its own most of the time.
 *
 * The lede sits directly under the title at a readable measure. It is never
 * floated into the opposite corner as a small paragraph: that split-header
 * pattern is decoration standing in for hierarchy.
 */

export type SectionHeaderProps = {
  title: ReactNode;
  /** Use sparingly. See the ratio above. */
  eyebrow?: ReactNode;
  lede?: ReactNode;
  /** Heading level. Pick from the page outline, never from the visual size. */
  as?: ElementType;
  /** Visual size, independent of the semantic level. */
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
};

const SIZE = {
  sm: 'text-xl font-semibold',
  md: 'text-2xl font-semibold',
  lg: 'text-3xl font-semibold',
};

export function SectionHeader({
  title,
  eyebrow,
  lede,
  as: Heading = 'h2',
  size = 'md',
  id,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4', className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className={cn(SIZE[size], 'measure-lede text-ink-primary')}>
        {title}
      </Heading>
      {lede ? <p className="measure-prose text-ink-secondary">{lede}</p> : null}
    </header>
  );
}

export default SectionHeader;
