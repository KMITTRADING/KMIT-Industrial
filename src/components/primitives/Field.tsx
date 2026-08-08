'use client';

import { useId } from 'react';

import { ChevronDownIcon, DangerIcon } from './IconSet';
import { cn } from '@/lib/utils';

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

/**
 * Form field.
 *
 * One wrapper owns the label, the hint, the error and the wiring between them,
 * so no control can ship without them. The rules it enforces:
 *
 * - Label above the control, always visible. A placeholder is never a label:
 *   it disappears exactly when the user needs it, and it fails at 4.5:1 in
 *   almost every design that uses it that way.
 * - Hint text is persistent, not a tooltip. A buyer filling in a tonnage should
 *   not have to hover to learn the unit.
 * - Error text sits below the control, is announced with `role="alert"`, and is
 *   referenced by `aria-describedby` rather than merely coloured red. Colour
 *   alone never carries state.
 * - Required is marked in words for screen readers and with an asterisk
 *   visually, not by colour or by absence of the word "optional".
 * - Controls are at least 44px tall so they are usable on a phone in a
 *   warehouse.
 *
 * Icon placement is logical: a select's chevron sits at the inline end, which
 * is the left edge in Arabic and the right edge in English, with no
 * direction-specific class anywhere.
 */

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel: string;
  optionalLabel?: string;
  className?: string;
  children: (ids: { controlId: string; describedBy: string | undefined }) => ReactNode;
};

export function Field({
  label,
  hint,
  error,
  required = false,
  requiredLabel,
  optionalLabel,
  className,
  children,
}: FieldShellProps) {
  const controlId = useId();
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={controlId}
        className="flex items-baseline gap-2 text-sm font-medium text-ink-primary"
      >
        {label}
        {required ? (
          <>
            <span aria-hidden className="text-danger">
              *
            </span>
            <span className="sr-only">{requiredLabel}</span>
          </>
        ) : optionalLabel ? (
          <span className="text-2xs font-normal text-ink-muted">{optionalLabel}</span>
        ) : null}
      </label>

      {children({ controlId, describedBy: describedBy || undefined })}

      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs text-danger">
          <DangerIcon className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlBase = [
  'w-full min-h-11 rounded-sm bg-surface-page',
  'border border-border-default',
  'px-3 py-2.5 text-sm text-ink-primary',
  'transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
  'hover:border-border-strong',
  'focus:border-ink-accent focus:outline-none',
  // Placeholder must clear 4.5:1 like any other text on the page.
  'placeholder:text-ink-muted',
  'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
  'read-only:bg-surface-sunken read-only:text-ink-secondary',
];

const invalid = 'border-danger hover:border-danger focus:border-danger';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  controlId: string;
  describedBy?: string;
  invalid?: boolean;
};

export function TextInput({
  controlId,
  describedBy,
  invalid: isInvalid = false,
  className,
  ...props
}: TextInputProps) {
  return (
    <input
      id={controlId}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      className={cn(controlBase, isInvalid && invalid, className)}
      {...props}
    />
  );
}

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  controlId: string;
  describedBy?: string;
  invalid?: boolean;
};

export function TextArea({
  controlId,
  describedBy,
  invalid: isInvalid = false,
  className,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      id={controlId}
      rows={rows}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      className={cn(controlBase, 'resize-y', isInvalid && invalid, className)}
      {...props}
    />
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  controlId: string;
  describedBy?: string;
  invalid?: boolean;
};

export function Select({
  controlId,
  describedBy,
  invalid: isInvalid = false,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        id={controlId}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className={cn(controlBase, 'appearance-none pe-10', isInvalid && invalid, className)}
        {...props}
      >
        {children}
      </select>
      {/* `end-3` resolves to the left edge in Arabic and the right edge in
          English, so the chevron never needs a direction-specific rule. */}
      <ChevronDownIcon className="pointer-events-none absolute inset-y-0 end-3 my-auto size-4 text-ink-muted" />
    </div>
  );
}

export type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  controlId: string;
  describedBy?: string;
  invalid?: boolean;
  chooseLabel: string;
};

export function FileInput({
  controlId,
  describedBy,
  invalid: isInvalid = false,
  chooseLabel,
  className,
  ...props
}: FileInputProps) {
  return (
    <input
      id={controlId}
      type="file"
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      title={chooseLabel}
      className={cn(
        controlBase,
        'py-2 file:me-3 file:rounded-xs file:border file:border-border-default',
        'file:bg-surface-sunken file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink-primary',
        'hover:file:border-ink-accent hover:file:text-ink-accent',
        isInvalid && invalid,
        className,
      )}
      {...props}
    />
  );
}

export default Field;
