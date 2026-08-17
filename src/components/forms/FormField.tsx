import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';

/**
 * Form field and its error (§12).
 *
 * The error is wired with `aria-describedby` and `aria-invalid`, and it is
 * announced politely rather than shown by colour alone — §14 bans the coloured
 * side border, and colour on its own is not an accessible signal. The message
 * explains what happened and how to fix it, with no apology (§9).
 */

export function FormField({
  id,
  label,
  optional = false,
  error,
  hint,
  locale,
  span = false,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  locale: Locale;
  span?: boolean;
  children: (props: {
    id: string;
    className: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
  }) => React.ReactNode;
}) {
  const d = dict(locale);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={['field', span ? 'form-span' : ''].filter(Boolean).join(' ')}>
      <label className="field-label t-label" htmlFor={id}>
        {label}
        {optional && <span className="field-optional"> ({d.form.optional})</span>}
      </label>

      {children({
        id,
        className: 'field-control',
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}

      {hint && (
        <p id={hintId} className="t-label" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error t-label">
          <span className="field-error-tick" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
