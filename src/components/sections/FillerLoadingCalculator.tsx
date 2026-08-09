'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Field } from '@/components/primitives/Field';
import { Select } from '@/components/primitives/Field';
import { TextInput } from '@/components/primitives/Field';
import { POLYMERS } from '@/content/data/polymers';
import { fillerEconomics } from '@/lib/filler-economics';

import type { ApplicationId, PolymerId } from '@/content/schema';

/**
 * The filler loading calculator.
 *
 * Client-side because it is a calculator, and entirely client-side because
 * there is nothing to send: the two costs a reader enters are commercially
 * sensitive to them, and posting them to a supplier's server to divide two
 * numbers would be an unreasonable thing to ask. `noPriceNote` says so on the
 * page, and this component is the reason that sentence is true.
 *
 * The output that matters is the second pair of rows. Filler is bought by
 * weight and parts are sold by volume, so a loading that looks like a quarter
 * off the cost per tonne can be a fifteenth off the cost per litre. Both are
 * reported; the per-litre figures are given the emphasis because they are the
 * ones a formulator has to defend when somebody in costing asks why the saving
 * did not show up.
 *
 * The grade recommendation comes from the chosen application through the
 * dataset, never from the loading. Particle size is a process decision, and a
 * calculator that recommended a finer grade because the economics were tight
 * would be giving formulation advice on commercial grounds.
 *
 * Imports reach into `primitives/Field` directly rather than through the
 * barrel: importing from the index would pull Dialog, Tabs, Tooltip and the
 * rest of the client primitives into this route's bundle. See ADR-039.
 */

export type FillerLoadingCalculatorProps = {
  /** Applications offered in the selector, with the grade each one implies. */
  options: { application: ApplicationId; gradeCode: string; gradeSlug: string }[];
  className?: string;
};

/** Locale-independent parse: the inputs are `type="number"`, so this is a guard. */
function toNumber(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const number = (value: number, digits = 0) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const percent = (value: number) =>
  `${(value * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;

/**
 * One result row.
 *
 * Declared at module scope rather than inside the component. A component
 * defined during render is a new type on every keystroke, so React unmounts and
 * remounts the whole result list each time a cost is edited, which throws away
 * the `aria-live` region and its announcement along with it.
 *
 * Values sit in an LTR island with tabular figures: a number followed by a unit
 * resolves to the paragraph direction otherwise, which reverses it on an Arabic
 * page.
 */
function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-3 last:border-b-0">
      <dt
        className={
          strong ? 'text-sm font-medium text-ink-primary' : 'text-sm text-ink-secondary'
        }
      >
        {label}
      </dt>
      <dd
        dir="ltr"
        className={
          strong
            ? 'text-start text-lg font-semibold text-ink-accent tabular-nums'
            : 'text-start text-sm text-ink-primary tabular-nums'
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function FillerLoadingCalculator({ options, className }: FillerLoadingCalculatorProps) {
  const t = useTranslations();

  const [application, setApplication] = useState<ApplicationId | ''>(
    options[0]?.application ?? '',
  );
  const [polymer, setPolymer] = useState<PolymerId>('ldpe');
  const [density, setDensity] = useState(String(POLYMERS[0]?.density ?? 0.923));
  const [loading, setLoading] = useState('30');
  const [polymerCost, setPolymerCost] = useState('5000');
  const [fillerCost, setFillerCost] = useState('800');

  /** Changing the polymer resets the density, since the field is a prefill. */
  const onPolymerChange = (id: PolymerId) => {
    setPolymer(id);
    const match = POLYMERS.find((entry) => entry.id === id);
    if (match) setDensity(String(match.density));
  };

  const result = useMemo(
    () =>
      fillerEconomics({
        // Clamped so a typed 400% or a negative cannot produce a nonsense answer.
        loading: Math.min(Math.max(toNumber(loading) / 100, 0), 0.95),
        polymerDensity: Math.max(toNumber(density), 0.01),
        polymerCost: Math.max(toNumber(polymerCost), 0),
        fillerCost: Math.max(toNumber(fillerCost), 0),
      }),
    [loading, density, polymerCost, fillerCost],
  );

  const selected = options.find((option) => option.application === application);
  const hasSaving = result.savingPerTonne > 0;
  const lowRetention = hasSaving && result.volumeRetention < 0.5;

  return (
    <div className={className}>
      <div className="grid gap-10 lg:grid-cols-2">
        {/* -------------------------------------------------------- inputs */}
        <section aria-labelledby="calc-inputs" className="flex flex-col gap-6">
          <h3 id="calc-inputs" className="text-lg font-semibold text-ink-primary">
            {t('calculator.inputsHeading')}
          </h3>

          <Field label={t('calculator.labelApplication')} requiredLabel={t('ui.required')}>
            {({ controlId, describedBy }) => (
              <Select
                controlId={controlId}
                describedBy={describedBy}
                value={application}
                onChange={(event) => setApplication(event.target.value as ApplicationId)}
              >
                {options.map((option) => (
                  <option key={option.application} value={option.application}>
                    {t(`applications.${option.application}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label={t('calculator.labelPolymer')} requiredLabel={t('ui.required')}>
            {({ controlId, describedBy }) => (
              <Select
                controlId={controlId}
                describedBy={describedBy}
                value={polymer}
                onChange={(event) => onPolymerChange(event.target.value as PolymerId)}
              >
                {POLYMERS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {t(`polymers.${entry.id}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label={`${t('calculator.labelDensity')} (${t('calculator.unitDensity')})`}
            hint={t('calculator.hintDensity')}
            requiredLabel={t('ui.required')}
          >
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                type="number"
                inputMode="decimal"
                step="0.001"
                min="0.1"
                max="3"
                dir="ltr"
                value={density}
                onChange={(event) => setDensity(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={`${t('calculator.labelLoading')} (%)`}
            hint={t('calculator.hintLoading')}
            requiredLabel={t('ui.required')}
          >
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                type="number"
                inputMode="decimal"
                step="1"
                min="0"
                max="95"
                dir="ltr"
                value={loading}
                onChange={(event) => setLoading(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('calculator.labelPolymerCost')}
            hint={t('calculator.hintCost')}
            requiredLabel={t('ui.required')}
          >
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                type="number"
                inputMode="decimal"
                step="1"
                min="0"
                dir="ltr"
                value={polymerCost}
                onChange={(event) => setPolymerCost(event.target.value)}
              />
            )}
          </Field>

          <Field label={t('calculator.labelFillerCost')} requiredLabel={t('ui.required')}>
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                type="number"
                inputMode="decimal"
                step="1"
                min="0"
                dir="ltr"
                value={fillerCost}
                onChange={(event) => setFillerCost(event.target.value)}
              />
            )}
          </Field>
        </section>

        {/* ------------------------------------------------------- results */}
        <section aria-labelledby="calc-results" className="flex flex-col gap-6">
          <h3 id="calc-results" className="text-lg font-semibold text-ink-primary">
            {t('calculator.resultsHeading')}
          </h3>

          {/*
            `aria-live="polite"` so a screen reader hears the recalculated
            figures. The inputs are the only way to change them, so there is no
            risk of announcing something the reader did not ask for.
          */}
          <dl aria-live="polite" className="rounded-md border border-border-subtle p-6">
            <Row
              label={`${t('calculator.resultCompoundDensity')} (${t('calculator.unitDensity')})`}
              value={number(result.compoundDensity, 3)}
            />
            <Row
              label={`${t('calculator.resultCompoundCost')} (${t('calculator.unitPerTonne')})`}
              value={number(result.compoundCostPerTonne)}
            />
            <Row
              label={t('calculator.resultSavingPerTonne')}
              value={number(result.savingPerTonne)}
            />
            <Row
              label={t('calculator.resultSavingByWeight')}
              value={percent(result.savingByWeight)}
            />
          </dl>

          {/*
            The per-volume block, given its own panel and the accent treatment.
            This is the answer the tool exists to give, and burying it in the
            same list as the per-tonne figures is how every other calculator in
            this niche manages to be technically correct and still misleading.
          */}
          <dl className="rounded-md border-s-2 border-accent-700 bg-surface-sunken p-6">
            <Row
              label={`${t('calculator.resultCostPerLitreBefore')} (${t('calculator.unitPerLitre')})`}
              value={number(result.polymerCostPerLitre, 2)}
            />
            <Row
              label={`${t('calculator.resultCostPerLitreAfter')} (${t('calculator.unitPerLitre')})`}
              value={number(result.compoundCostPerLitre, 2)}
            />
            <Row
              label={t('calculator.resultSavingPerLitre')}
              value={number(result.savingPerLitre, 2)}
            />
            <Row
              label={t('calculator.resultSavingByVolume')}
              value={percent(result.savingByVolume)}
              strong
            />
            {hasSaving ? (
              <Row
                label={t('calculator.resultRetention')}
                value={percent(result.volumeRetention)}
              />
            ) : null}
          </dl>

          {!hasSaving ? (
            <p className="text-sm text-ink-secondary">{t('calculator.noSaving')}</p>
          ) : null}

          {lowRetention ? (
            <p className="text-sm text-ink-secondary">{t('calculator.retentionWarning')}</p>
          ) : null}

          {/* ------------------------------------------------------- grade */}
          <section
            aria-labelledby="calc-grade"
            className="rounded-md border border-border-subtle p-6"
          >
            <h3 id="calc-grade" className="text-sm font-medium text-ink-primary">
              {t('calculator.gradeHeading')}
            </h3>
            <p className="mt-2 text-xs text-ink-muted">{t('calculator.gradeIntro')}</p>
            {selected ? (
              <p
                dir="ltr"
                className="mt-4 text-start text-2xl font-semibold text-ink-accent tabular-nums"
              >
                {selected.gradeCode}
              </p>
            ) : (
              <p className="mt-4 text-sm text-ink-secondary">{t('calculator.gradeNone')}</p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
