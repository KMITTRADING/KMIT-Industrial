import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Card.
 *
 * Used sparingly, and never as the default way to group things. Grouping is
 * normally done with a hairline rule, a background step, or plain space. A card
 * appears when a block is genuinely a separate object the reader can act on.
 *
 * Elevation comes from a border and a background step, not a shadow. The system
 * has exactly one shadow and it belongs to overlays.
 *
 * The `instrument` variant is the one place the system uses a two-layer
 * enclosure: an outer tray at radius 6 holding an inner plate at radius 3, with
 * concentric curves. It exists for the grade matrix, which should read like a
 * panel on a machine rather than a box on a page. It is not a general card
 * style, and nothing nests inside it.
 */

const card = cva(['rounded-md'], {
  variants: {
    variant: {
      plain: 'border border-border-subtle bg-surface-page',
      raised: 'border border-border-subtle bg-surface-raised',
      sunken: 'border border-border-subtle bg-surface-sunken',
      accent: 'border border-accent-700 bg-surface-accent text-ink-inverse',
      instrument: 'rounded-lg border border-border-default bg-surface-sunken p-1.5',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: [
        'transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'hover:border-border-strong',
        'focus-within:border-ink-accent',
      ],
      false: '',
    },
  },
  compoundVariants: [
    // The instrument tray owns its own padding: the inner plate provides the rest.
    { variant: 'instrument', padding: 'sm', class: 'p-1.5' },
    { variant: 'instrument', padding: 'md', class: 'p-1.5' },
    { variant: 'instrument', padding: 'lg', class: 'p-1.5' },
  ],
  defaultVariants: {
    variant: 'plain',
    padding: 'md',
    interactive: false,
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof card>;

export function Card({
  variant,
  padding,
  interactive,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(card({ variant, padding, interactive }), className)} {...props}>
      {children}
    </div>
  );
}

/**
 * The inner plate of an `instrument` card. Radius is the tray's 6px minus the
 * 6px of tray padding, which is 3px: concentric, not merely smaller.
 */
export function CardPlate({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-sm border border-border-subtle bg-surface-page', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  meta,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title: ReactNode; meta?: ReactNode }) {
  return (
    <div
      className={cn('flex flex-wrap items-baseline justify-between gap-3', className)}
      {...props}
    >
      <div className="text-lg font-semibold text-ink-primary">{title}</div>
      {meta ? <div className="text-sm text-ink-muted">{meta}</div> : null}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('measure-prose text-sm text-ink-secondary', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
