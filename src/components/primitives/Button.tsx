import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button.
 *
 * Near-square, not a pill: this is a materials supplier, and the geometry is set
 * once for the whole system (radius 3px, CLAUDE.md §5).
 *
 * Press feedback is the one piece of motion every button gets. 120ms is below
 * the threshold where a transition reads as an animation, so the button feels
 * like it responds rather than like it plays.
 *
 * Icons are passed as elements, not names, so a caller can pass a domain icon
 * or nothing at all without the component owning an icon registry.
 */

const button = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-sm font-medium',
    'transition-[background-color,border-color,color,transform] duration-[var(--duration-press)] ease-[var(--ease-standard)]',
    'active:scale-[0.985]',
    'disabled:pointer-events-none disabled:opacity-45',
    // Every button is a touch target before it is a visual element.
    'min-h-11 touch-manipulation',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-surface-accent text-ink-inverse',
          'hover:bg-surface-accent-deep',
          'border border-transparent',
        ],
        secondary: [
          'bg-surface-page text-ink-primary',
          'border border-border-strong',
          'hover:border-ink-accent hover:text-ink-accent',
        ],
        ghost: [
          'bg-transparent text-ink-secondary',
          'border border-transparent',
          'hover:bg-surface-sunken hover:text-ink-primary',
        ],
        link: [
          'bg-transparent text-ink-accent underline decoration-1 underline-offset-4',
          'border border-transparent',
          'hover:decoration-2',
          // A link-button is text: it should not carry a button's touch target
          // padding or it will float oddly inside a paragraph.
          'min-h-0 px-0 py-0',
        ],
        danger: [
          'bg-danger text-ink-inverse',
          'border border-transparent',
          'hover:brightness-90',
        ],
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // The link variant ignores size padding by design.
      { variant: 'link', size: 'sm', class: 'px-0 py-0' },
      { variant: 'link', size: 'md', class: 'px-0 py-0' },
      { variant: 'link', size: 'lg', class: 'px-0 py-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    /** Icon rendered at the start edge: right in Arabic, left in English. */
    iconStart?: ReactNode;
    /** Icon rendered at the end edge. */
    iconEnd?: ReactNode;
    /**
     * Shows the busy state and blocks interaction. The label stays in place so
     * the button does not change width, which would shift the layout around it.
     */
    loading?: boolean;
    /** Accessible status announced while loading. */
    loadingLabel?: string;
  };

export function Button({
  variant,
  size,
  block,
  iconStart,
  iconEnd,
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(button({ variant, size, block }), className)}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
        />
      ) : (
        iconStart
      )}
      <span className={cn(loading && 'opacity-70')}>{children}</span>
      {!loading && iconEnd}
      {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
    </button>
  );
}

export default Button;
