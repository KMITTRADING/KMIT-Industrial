'use client';

import { CheckIcon, CloseIcon, DangerIcon, InfoIcon, WarningIcon } from './IconSet';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Alert.
 *
 * An inline message attached to the content it concerns. Not a toast: nothing on
 * this site is transient enough to justify one.
 *
 * Three rules it enforces:
 *
 * - Colour is never the only signal. Every tone pairs a distinct icon and a
 *   visible word, so the message survives greyscale printing and colour
 *   blindness.
 * - The severity of the ARIA role matches the severity of the message. `danger`
 *   is `role="alert"` and interrupts; the rest are polite status regions that do
 *   not.
 * - The start-edge border is a hairline like every other border in the system.
 *   A thick coloured stripe down one side is a decoration pretending to be
 *   information.
 */

const TONE = {
  info: {
    Icon: InfoIcon,
    className: 'border-info-border bg-info-surface text-info',
    role: 'status' as const,
  },
  success: {
    Icon: CheckIcon,
    className: 'border-success-border bg-success-surface text-success',
    role: 'status' as const,
  },
  warning: {
    Icon: WarningIcon,
    className: 'border-warning-border bg-warning-surface text-warning',
    role: 'status' as const,
  },
  danger: {
    Icon: DangerIcon,
    className: 'border-danger-border bg-danger-surface text-danger',
    role: 'alert' as const,
  },
};

export type AlertTone = keyof typeof TONE;

export type AlertProps = {
  tone?: AlertTone;
  /** The visible severity word. Never omit: it is what makes the tone readable. */
  toneLabel: string;
  title?: ReactNode;
  children: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

export function Alert({
  tone = 'info',
  toneLabel,
  title,
  children,
  onDismiss,
  dismissLabel,
  className,
}: AlertProps) {
  const { Icon, className: toneClass, role } = TONE[tone];

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={cn('flex gap-3 rounded-sm border p-4 text-sm', toneClass, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          <span className="sr-only">{toneLabel}: </span>
          {title ?? toneLabel}
        </p>
        <div className="measure-prose mt-1 text-ink-secondary">{children}</div>
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-me-1 -mt-1 rounded-xs p-1.5 text-ink-muted transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-primary"
        >
          <CloseIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export default Alert;
