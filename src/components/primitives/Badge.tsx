import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Badge.
 *
 * Three jobs, and they look different on purpose:
 *
 * - `grade` carries a grade code. Latin, tabular, forced LTR, because
 *   `GCC-1250` is an identifier and must not reorder inside Arabic text.
 * - `certification` carries a standard name. Same LTR treatment, quieter.
 * - `status` carries semantic state, and always pairs the colour with a word.
 *   Colour alone never conveys state.
 *
 * No decorative status dots. A dot before every badge is a generated-page
 * signature; here a dot appears only when the badge reports a live condition.
 */

const badge = cva(
  ['inline-flex items-center gap-1.5 rounded-xs', 'leading-none font-medium', 'border'],
  {
    variants: {
      variant: {
        grade: 'border-accent-200 bg-accent-50 text-ink-accent tabular-nums',
        certification: 'border-border-default bg-surface-raised text-ink-secondary',
        neutral: 'border-border-subtle bg-surface-sunken text-ink-secondary',
        info: 'border-info-border bg-info-surface text-info',
        success: 'border-success-border bg-success-surface text-success',
        warning: 'border-warning-border bg-warning-surface text-warning',
        danger: 'border-danger-border bg-danger-surface text-danger',
      },
      size: {
        sm: 'px-1.5 py-1 text-2xs',
        md: 'px-2.5 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge> & {
    /** Leading icon. Use only where the icon adds information the word does not. */
    icon?: ReactNode;
    /**
     * Forces LTR and tabular figures. On by default for `grade` and
     * `certification`, because both carry Latin identifiers.
     */
    identifier?: boolean;
  };

export function Badge({
  variant = 'neutral',
  size,
  icon,
  identifier,
  className,
  children,
  ...props
}: BadgeProps) {
  const isIdentifier = identifier ?? (variant === 'grade' || variant === 'certification');

  return (
    <span
      dir={isIdentifier ? 'ltr' : undefined}
      className={cn(badge({ variant, size }), isIdentifier && 'tabular-nums', className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}

export default Badge;
