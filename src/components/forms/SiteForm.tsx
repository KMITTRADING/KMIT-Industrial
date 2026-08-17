'use client';

import { useRef, useState } from 'react';

import { FormField } from './FormField';
import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';
import { MAILTO_HREF, SITE } from '@/lib/site';

/**
 * The contact and careers forms (§9).
 *
 * There is no submission endpoint in §1, so nothing is invented: rather than
 * posting to a URL that does not exist and failing silently, the form validates
 * in the browser and then composes a message in the visitor's own mail client,
 * addressed to the approved mailbox. The notice above the button says so plainly.
 * When an endpoint is supplied, `onSubmit` is the only thing that changes.
 *
 * Validation runs on submit, not on every keystroke — being corrected mid-word is
 * hostile. Errors are summarised at the top for screen readers and repeated at
 * each field.
 */

type Variant = 'contact' | 'careers';

type Values = {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  field: string;
  message: string;
};

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  field: '',
  message: '',
};

export function SiteForm({ locale, variant }: { locale: Locale; variant: Variant }) {
  const d = dict(locale);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const set = (key: keyof Values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  function validate(): Partial<Record<keyof Values, string>> {
    const next: Partial<Record<keyof Values, string>> = {};
    if (values.name.trim().length < 2) next.name = d.form.errorName;
    // Deliberately permissive: the only thing worth rejecting is an address that
    // cannot be delivered to at all.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = d.form.errorEmail;
    if (variant === 'contact' && values.message.trim().length < 4) {
      next.message = d.form.errorMessage;
    }
    if (variant === 'careers' && !values.field) next.field = d.form.errorField;
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    setSubmitted(true);

    if (Object.keys(found).length > 0) {
      // Move attention to the summary so the failure is announced, then let the
      // visitor tab straight into the first bad field.
      summaryRef.current?.focus();
      return;
    }

    const lines =
      variant === 'contact'
        ? [
            `${d.form.name}: ${values.name}`,
            `${d.form.email}: ${values.email}`,
            values.phone && `${d.form.phone}: ${values.phone}`,
            values.company && `${d.form.company}: ${values.company}`,
            values.subject && `${d.form.subject}: ${values.subject}`,
            '',
            values.message,
          ]
        : [
            `${d.form.name}: ${values.name}`,
            `${d.form.email}: ${values.email}`,
            values.phone && `${d.form.phone}: ${values.phone}`,
            `${d.form.field}: ${values.field}`,
            '',
            values.message,
          ];

    const subject =
      variant === 'contact'
        ? values.subject || d.contactPage.h1
        : `${d.careers.h1}: ${values.field}`;

    const href = `${MAILTO_HREF}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.filter(Boolean).join('\n')
    )}`;
    window.location.href = href;
  }

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Announced when validation fails. Focusable so attention can be moved
          to it without stealing focus on first render. */}
      <p
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className="field-error t-label"
        style={{
          marginBlockEnd: hasErrors ? 'var(--s-6)' : 0,
          display: hasErrors ? 'flex' : 'none',
        }}
      >
        {hasErrors && <span className="field-error-tick" aria-hidden="true" />}
        {hasErrors ? d.form.errorSummary : ''}
      </p>

      <div className="form-grid">
        <FormField id="f-name" label={d.form.name} error={errors.name} locale={locale}>
          {(props) => (
            <input {...props} type="text" name="name" autoComplete="name" value={values.name} onChange={set('name')} required />
          )}
        </FormField>

        <FormField id="f-email" label={d.form.email} error={errors.email} locale={locale}>
          {(props) => (
            <input
              {...props}
              type="email"
              name="email"
              autoComplete="email"
              /* An e-mail address is Latin script in both languages, so the
                 control keeps LTR order even on an Arabic page (§6.1). */
              dir="ltr"
              value={values.email}
              onChange={set('email')}
              required
            />
          )}
        </FormField>

        <FormField id="f-phone" label={d.form.phone} optional locale={locale}>
          {(props) => (
            <input
              {...props}
              type="tel"
              name="phone"
              autoComplete="tel"
              dir="ltr"
              value={values.phone}
              onChange={set('phone')}
            />
          )}
        </FormField>

        {variant === 'contact' ? (
          <>
            <FormField id="f-company" label={d.form.company} optional locale={locale}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  name="company"
                  autoComplete="organization"
                  value={values.company}
                  onChange={set('company')}
                />
              )}
            </FormField>

            <FormField id="f-subject" label={d.form.subject} optional locale={locale} span>
              {(props) => (
                <select {...props} name="subject" value={values.subject} onChange={set('subject')}>
                  <option value="">{d.contactPage.subjectPlaceholder}</option>
                  {d.contactPage.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              )}
            </FormField>
          </>
        ) : (
          <FormField id="f-field" label={d.form.field} error={errors.field} locale={locale}>
            {(props) => (
              <select {...props} name="field" value={values.field} onChange={set('field')} required>
                <option value="">{d.careers.fieldPlaceholder}</option>
                {d.careers.fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        )}

        <FormField
          id="f-message"
          label={d.form.message}
          optional={variant === 'careers'}
          error={errors.message}
          locale={locale}
          span
        >
          {(props) => (
            <textarea {...props} name="message" rows={6} value={values.message} onChange={set('message')} />
          )}
        </FormField>

        {variant === 'careers' && (
          <div className="form-span">
            {/*
              TODO-CONTENT: file upload needs a storage endpoint, which was not
              supplied. Rather than render a control that silently drops the file,
              the form asks for the attachment on the mail that opens.
            */}
            <p className="t-label" style={{ color: 'var(--ink-soft)' }}>
              {d.form.file} — {d.form.fileHint}
            </p>
          </div>
        )}
      </div>

      <div className="form-notice" style={{ marginBlockStart: 'var(--s-8)' }}>
        <p className="t-label" style={{ fontWeight: 500 }}>
          {d.form.noEndpointTitle}
        </p>
        <p className="t-body" style={{ marginBlockStart: 'var(--s-2)', color: 'var(--ink-soft)' }}>
          {d.form.noEndpointBody}
        </p>
        <p className="t-body" style={{ marginBlockStart: 'var(--s-3)' }}>
          {d.form.sendingVia}{' '}
          <a className="prose-link" href={MAILTO_HREF} dir="ltr">
            {SITE.email}
          </a>
        </p>
      </div>

      <button type="submit" className="btn btn-primary chamfer" style={{ marginBlockStart: 'var(--s-8)' }}>
        <span>{variant === 'contact' ? d.form.submitContact : d.form.submitCareers}</span>
        <span className="btn-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(var(--icon-flip, 1))' }}>
            <path d="M4 12h16" />
            <path d="M14 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </form>
  );
}
