import { cn } from '@/lib/utils';

import type { HTMLAttributes } from 'react';

/**
 * Skeleton.
 *
 * Shaped like the content it stands in for, never a spinner. A spinner says
 * "something is happening"; a skeleton says "a table with five rows is
 * arriving", which is the difference between waiting and knowing.
 *
 * The shimmer is a background-position animation on a gradient, so it runs on
 * the compositor and stops entirely under reduced motion, where the block
 * simply sits still at its base tone.
 *
 * The whole loading region is announced once, by the container, not per block:
 * `TableSkeleton` announces "Loading" and its thirty child bars stay silent.
 */

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'rounded-xs bg-surface-sunken',
        'bg-[linear-gradient(90deg,var(--color-neutral-100)_0%,var(--color-neutral-200)_40%,var(--color-neutral-100)_80%)]',
        'bg-[length:200%_100%] motion-safe:animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]',
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn('h-4', index === lines - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  label,
  className,
}: {
  rows?: number;
  columns?: number;
  label: string;
  className?: string;
}) {
  return (
    <div role="status" aria-busy aria-label={label} className={cn('w-full', className)}>
      <div className="flex gap-4 border-b-2 border-border-strong pb-3">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 border-b border-border-subtle py-4">
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton
              key={columnIndex}
              className={cn('h-4 flex-1', columnIndex === 0 && 'max-w-24')}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Skeleton;
