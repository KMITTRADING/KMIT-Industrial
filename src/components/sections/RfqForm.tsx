'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import {
  Alert,
  Button,
  CheckIcon,
  Field,
  FileInput,
  Select,
  TextArea,
  TextInput,
} from '@/components/primitives';
import {
  APPLICATION_IDS,
  DOCUMENT_IDS,
  PACKAGING_IDS,
  SECTOR_IDS,
  STANDARD_IDS,
} from '@/content/schema';
import { GRADES } from '@/content/data/grades';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { submitRfqAction } from '@/app/[locale]/rfq/actions';

import type { Locale } from '@/i18n/routing';
import type { RfqResult } from '@/lib/rfq-adapter';

/**
 * The quotation form.
 *
 * Structured around what the buyer knows, in the order they know it, which is
 * the only reason a ten-field form is tolerable at all:
 *
 * 1. **What you need.** Grade, tonnage, application. Every technical field
 *    accepts "not decided yet", because a buyer who has not chosen a grade is
 *    exactly the buyer worth talking to, and a required grade field turns them
 *    away.
 * 2. **Where it goes.** City, country, packaging. Asked before contact details,
 *    so nobody hands over a phone number to discover the destination is not
 *    served.
 * 3. **Contact details.** Four fields, at the end, when the buyer already knows
 *    the request is worth completing.
 *
 * Progressive disclosure is by step, not by hiding fields inside a step: a
 * buyer who wants to see everything can tab through three short screens rather
 * than hunt for a disclosure triangle. Steps are validated on continue, so an
 * error surfaces next to the field that caused it and never after a round trip.
 *
 * The server re-validates everything and owns the rate limit. This validation
 * exists to give a good error message, not to be trusted.
 */

type Step = 0 | 1 | 2;

type FormState = {
  grade: string;
  quantityTonnes: string;
  application: string;
  sector: string;
  packaging: string;
  destinationCity: string;
  destinationCountry: string;
  certifications: string[];
  documents: string[];
  startDate: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const EMPTY: FormState = {
  grade: '',
  quantityTonnes: '',
  application: '',
  sector: '',
  packaging: '',
  destinationCity: '',
  destinationCountry: '',
  certifications: [],
  documents: [],
  startDate: '',
  company: '',
  contactName: '',
  email: '',
  phone: '',
  message: '',
  website: '',
};

export type RfqFormProps = {
  locale: Locale;
  /** Prefill from a grade page. */
  grade?: string;
  /** Prefill from a sector page. */
  sector?: string;
  /** Prefill from a document request row. */
  document?: string;
  className?: string;
};

export function RfqForm({ locale, grade, sector, document, className }: RfqFormProps) {
  const t = useTranslations();

  const [state, setState] = useState<FormState>({
    ...EMPTY,
    grade: grade && GRADES.some((entry) => entry.code === grade) ? grade : '',
    sector: sector && (SECTOR_IDS as readonly string[]).includes(sector) ? sector : '',
    documents:
      document && (DOCUMENT_IDS as readonly string[]).includes(document) ? [document] : [],
  });
  const [step, setStep] = useState<Step>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<RfqResult | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  /**
   * Built inside the component so every message comes from the content tree.
   * A schema defined at module scope cannot see the locale, which is how
   * bilingual forms end up with English validation errors on the Arabic page.
   */
  const schemas = useMemo(() => {
    const required = t('rfqForm.errorRequired');
    const text = (max: number) =>
      z.string().trim().min(1, required).max(max, t('rfqForm.errorTooLong'));

    return {
      requirement: z.object({
        quantityTonnes: z
          .string()
          .trim()
          .refine((value) => value === '' || (Number(value) > 0 && Number(value) <= 100_000), {
            message: t('rfqForm.errorTonnage'),
          }),
      }),
      delivery: z.object({
        destinationCity: text(80),
        destinationCountry: text(80),
      }),
      contact: z.object({
        company: text(120),
        contactName: text(120),
        email: z
          .string()
          .trim()
          .min(1, required)
          .pipe(z.email(t('rfqForm.errorEmail'))),
        phone: z
          .string()
          .trim()
          .min(1, required)
          .regex(/^[+0-9()\-\s]{7,24}$/, t('rfqForm.errorPhone')),
      }),
    };
  }, [t]);

  /**
   * `rfq_started` fires once, on the first edit rather than on page view. A
   * form that counts a start for everybody who scrolled past it cannot measure
   * abandonment, which is the only thing the funnel is for.
   */
  const started = useRef(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (!started.current) {
      started.current = true;
      track('rfq_started', { ...(grade ? { grade } : {}), ...(sector ? { sector } : {}) });
    }
    setState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  /** The field name only. A field's value can be a company name or an email. */
  const fieldCompleted = (field: keyof FormState) => {
    if (state[field]) track('rfq_field_completed', { field, step });
  };

  const toggle = (key: 'certifications' | 'documents', value: string) =>
    setState((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((entry) => entry !== value)
        : [...current[key], value],
    }));

  const validate = (which: keyof typeof schemas): boolean => {
    const parsed = schemas[which].safeParse(state);
    if (parsed.success) {
      return true;
    }
    const next: Partial<Record<keyof FormState, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FormState | undefined;
      if (field && !next[field]) next[field] = issue.message;
    }
    setErrors(next);
    // Move focus to the summary so a screen reader hears the failure rather
    // than silently staying on a button that appeared to do nothing.
    queueMicrotask(() => summaryRef.current?.focus());
    return false;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate('contact')) return;

    setPending(true);
    track('rfq_submitted', {
      ...(state.grade ? { grade: state.grade } : {}),
      ...(state.sector ? { sector: state.sector } : {}),
    });
    const response = await submitRfqAction({
      locale,
      company: state.company,
      contactName: state.contactName,
      email: state.email,
      phone: state.phone,
      grade: state.grade || null,
      application: state.application || null,
      sector: state.sector || null,
      packaging: state.packaging || null,
      documents: state.documents,
      certifications: state.certifications,
      startDate: state.startDate || null,
      quantityTonnes: state.quantityTonnes ? Number(state.quantityTonnes) : null,
      destinationCity: state.destinationCity,
      destinationCountry: state.destinationCountry,
      message: state.message,
      website: state.website,
    });
    setPending(false);
    setResult(response);
  };

  /* --------------------------------------------------------- success */

  if (result?.ok) {
    return (
      <div
        className={cn(
          'rounded-md border border-success-border bg-success-surface p-6',
          className,
        )}
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold text-success">
          <CheckIcon className="size-5" />
          {t('rfqForm.successHeading')}
        </h2>
        <p className="measure-prose mt-3 text-sm text-ink-secondary">
          {t('rfqForm.successBody')}
        </p>

        <p className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="text-2xs font-medium text-ink-muted">
            {t('rfqForm.successReference')}
          </span>
          <span dir="ltr" className="text-start font-semibold text-ink-primary tabular-nums">
            {result.reference}
          </span>
        </p>

        <ol className="measure-prose mt-6 flex flex-col gap-3 border-t border-success-border pt-6 text-sm text-ink-secondary">
          <li>{t('rfqForm.successNext1')}</li>
          <li>{t('rfqForm.successNext2')}</li>
          <li>{t('rfqForm.successNext3')}</li>
        </ol>

        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setState(EMPTY);
            setStep(0);
            setResult(null);
          }}
        >
          {t('rfqForm.successAgain')}
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------------ form */

  const steps = [
    { title: t('rfqForm.sectionRequirement'), hint: t('rfqForm.sectionRequirementHint') },
    { title: t('rfqForm.sectionDelivery'), hint: t('rfqForm.sectionDeliveryHint') },
    { title: t('rfqForm.sectionContact'), hint: t('rfqForm.sectionContactHint') },
  ];

  return (
    <form onSubmit={onSubmit} noValidate className={cn('flex flex-col gap-8', className)}>
      {/* Step indicator. Ordered list, so it is a sequence to a screen reader
          rather than a row of decorative pills. */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border-subtle pb-4">
        {steps.map((entry, index) => (
          <li
            key={entry.title}
            aria-current={index === step ? 'step' : undefined}
            className={cn(
              'text-sm',
              index === step ? 'font-semibold text-ink-accent' : 'text-ink-muted',
            )}
          >
            {entry.title}
          </li>
        ))}
      </ol>

      <div>
        <h2 className="text-xl font-semibold text-ink-primary">{steps[step]?.title}</h2>
        <p className="measure-prose mt-2 text-sm text-ink-secondary">{steps[step]?.hint}</p>
      </div>

      {/* Error summary. Focusable and announced, per WCAG 3.3.1. */}
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive">
        {Object.values(errors).some(Boolean) ? (
          <Alert tone="danger" toneLabel={t('ui.dangerLabel')}>
            {t('rfqForm.errorSummary')}
          </Alert>
        ) : null}
      </div>

      {result && !result.ok ? (
        <Alert
          tone="danger"
          toneLabel={t('ui.dangerLabel')}
          title={t('rfqForm.failureHeading')}
        >
          {t('rfqForm.failureBody')}
        </Alert>
      ) : null}

      {/* ------------------------------------------- step 1: requirement */}
      <fieldset className={cn('grid gap-6 md:grid-cols-2', step !== 0 && 'hidden')}>
        <legend className="sr-only">{t('rfqForm.sectionRequirement')}</legend>

        <Field
          label={t('rfqForm.labelGrade')}
          hint={t('rfqForm.hintGrade')}
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <Select
              controlId={controlId}
              describedBy={describedBy}
              value={state.grade}
              onChange={(event) => set('grade', event.target.value)}
            >
              <option value="">{t('rfqForm.notSure')}</option>
              {GRADES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.code}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field
          label={t('rfqForm.labelTonnage')}
          hint={t('rfqForm.hintTonnage')}
          error={errors.quantityTonnes}
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.quantityTonnes)}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              dir="ltr"
              value={state.quantityTonnes}
              onChange={(event) => set('quantityTonnes', event.target.value)}
              onBlur={() => fieldCompleted('quantityTonnes')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelApplication')}
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <Select
              controlId={controlId}
              describedBy={describedBy}
              value={state.application}
              onChange={(event) => set('application', event.target.value)}
            >
              <option value="">{t('rfqForm.notSure')}</option>
              {APPLICATION_IDS.map((application) => (
                <option key={application} value={application}>
                  {t(`applications.${application}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field
          label={t('rfqForm.labelPackaging')}
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <Select
              controlId={controlId}
              describedBy={describedBy}
              value={state.packaging}
              onChange={(event) => set('packaging', event.target.value)}
            >
              <option value="">{t('rfqForm.notSure')}</option>
              {PACKAGING_IDS.map((packaging) => (
                <option key={packaging} value={packaging}>
                  {t(`packaging.${packaging}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </fieldset>

      {/* ---------------------------------------------- step 2: delivery */}
      <fieldset className={cn('grid gap-6 md:grid-cols-2', step !== 1 && 'hidden')}>
        <legend className="sr-only">{t('rfqForm.sectionDelivery')}</legend>

        <Field
          label={t('rfqForm.labelCity')}
          error={errors.destinationCity}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.destinationCity)}
              autoComplete="address-level2"
              value={state.destinationCity}
              onChange={(event) => set('destinationCity', event.target.value)}
              onBlur={() => fieldCompleted('destinationCity')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelCountry')}
          error={errors.destinationCountry}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.destinationCountry)}
              autoComplete="country-name"
              value={state.destinationCountry}
              onChange={(event) => set('destinationCountry', event.target.value)}
              onBlur={() => fieldCompleted('destinationCountry')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelStartDate')}
          hint={t('rfqForm.hintStartDate')}
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              type="date"
              dir="ltr"
              value={state.startDate}
              onChange={(event) => set('startDate', event.target.value)}
            />
          )}
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-ink-primary">
            {t('rfqForm.labelCertifications')}
          </legend>
          <p className="text-xs text-ink-muted">{t('rfqForm.hintCertifications')}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {STANDARD_IDS.map((standard) => {
              const checked = state.certifications.includes(standard);
              return (
                <label
                  key={standard}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-xs',
                    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                    checked
                      ? 'border-accent-700 bg-surface-accent text-ink-inverse'
                      : 'border-border-default text-ink-secondary hover:border-ink-accent',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle('certifications', standard)}
                    className="size-4 accent-[var(--color-accent-700)]"
                  />
                  <span dir="ltr">{t(`standards.${standard}`)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </fieldset>

      {/* ----------------------------------------------- step 3: contact */}
      <fieldset className={cn('grid gap-6 md:grid-cols-2', step !== 2 && 'hidden')}>
        <legend className="sr-only">{t('rfqForm.sectionContact')}</legend>

        <Field
          label={t('rfqForm.labelCompany')}
          error={errors.company}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.company)}
              autoComplete="organization"
              value={state.company}
              onChange={(event) => set('company', event.target.value)}
              onBlur={() => fieldCompleted('company')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelContactName')}
          error={errors.contactName}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.contactName)}
              autoComplete="name"
              value={state.contactName}
              onChange={(event) => set('contactName', event.target.value)}
              onBlur={() => fieldCompleted('contactName')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelEmail')}
          error={errors.email}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.email)}
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              value={state.email}
              onChange={(event) => set('email', event.target.value)}
              onBlur={() => fieldCompleted('email')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelPhone')}
          hint={t('rfqForm.hintPhone')}
          error={errors.phone}
          required
          requiredLabel={t('ui.required')}
        >
          {({ controlId, describedBy }) => (
            <TextInput
              controlId={controlId}
              describedBy={describedBy}
              invalid={Boolean(errors.phone)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              value={state.phone}
              onChange={(event) => set('phone', event.target.value)}
              onBlur={() => fieldCompleted('phone')}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelNotes')}
          hint={t('rfqForm.hintNotes')}
          className="md:col-span-2"
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <TextArea
              controlId={controlId}
              describedBy={describedBy}
              rows={4}
              maxLength={2000}
              value={state.message}
              onChange={(event) => set('message', event.target.value)}
            />
          )}
        </Field>

        <Field
          label={t('rfqForm.labelUpload')}
          hint={t('rfqForm.hintUpload')}
          className="md:col-span-2"
          requiredLabel={t('ui.required')}
          optionalLabel={t('ui.optional')}
        >
          {({ controlId, describedBy }) => (
            <FileInput
              controlId={controlId}
              describedBy={describedBy}
              chooseLabel={t('ui.chooseFile')}
              accept="application/pdf,image/*"
            />
          )}
        </Field>
      </fieldset>

      {/*
        Honeypot. Off-screen rather than display:none, because some bots skip
        hidden inputs but fill everything they can reach. Never announced, never
        in the tab order, and labelled so a screen reader that does reach it is
        told to leave it alone.
      */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="rfq-website">Leave this field empty</label>
        <input
          id="rfq-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(event) => set('website', event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
        {step > 0 ? (
          <Button
            variant="secondary"
            onClick={() => setStep((current) => (current - 1) as Step)}
          >
            {t('rfqForm.back')}
          </Button>
        ) : null}

        {step === 0 ? (
          <Button
            onClick={() => {
              if (validate('requirement')) setStep(1);
            }}
          >
            {t('rfqForm.continueToDelivery')}
          </Button>
        ) : null}

        {step === 1 ? (
          <Button
            onClick={() => {
              if (validate('delivery')) setStep(2);
            }}
          >
            {t('rfqForm.continueToContact')}
          </Button>
        ) : null}

        {step === 2 ? (
          <Button type="submit" loading={pending} loadingLabel={t('rfqForm.submitting')}>
            {pending ? t('rfqForm.submitting') : t('rfqForm.submit')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export default RfqForm;
