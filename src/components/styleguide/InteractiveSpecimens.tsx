'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Accordion } from '@/components/primitives/Accordion';
import { Alert } from '@/components/primitives/Alert';
import { Button } from '@/components/primitives/Button';
import { Dialog } from '@/components/primitives/Dialog';
import { Field, FileInput, Select, TextArea, TextInput } from '@/components/primitives/Field';
import { Pagination } from '@/components/primitives/Pagination';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowHeader,
} from '@/components/primitives/Table';
import { TableScroll } from '@/components/primitives/TableScroll';
import { Tabs } from '@/components/primitives/Tabs';
import { Tooltip } from '@/components/primitives/Tooltip';
import { Specimen } from './Specimen';
import { TYPICAL_PROPERTIES } from '@/content/data/grades';

import type { SortDirection } from '@/components/primitives';

/**
 * Every primitive that needs state to be reviewable.
 *
 * The point of the styleguide is that a reviewer can see a control in its
 * failure states, not only in its happy state, so the form specimen ships a
 * populated error, a disabled control and a read-only control side by side.
 */

export function InteractiveSpecimens() {
  const t = useTranslations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  const [alertVisible, setAlertVisible] = useState(true);

  const sorted = [...TYPICAL_PROPERTIES]
    .slice(0, 4)
    .sort((a, b) =>
      sortDirection === 'descending' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
    );

  return (
    <>
      <Specimen label="Tabs" description="roving focus, direction-aware arrow keys">
        <Tabs
          className="w-full"
          label={t('sections.gradeMatrixFilterLabel')}
          items={[
            {
              id: 'properties',
              label: t('properties.columnParameter'),
              panel: (
                <p className="measure-prose text-sm text-ink-secondary">
                  {t('properties.familyLevelNote')}
                </p>
              ),
            },
            {
              id: 'packaging',
              label: t('sections.packagingHeading'),
              panel: (
                <p className="measure-prose text-sm text-ink-secondary">
                  {t('sections.packagingIntro')}
                </p>
              ),
            },
            {
              id: 'storage',
              label: t('sections.storageHeading'),
              panel: (
                <p className="measure-prose text-sm text-ink-secondary">
                  {t('sections.storageBody')}
                </p>
              ),
            },
          ]}
        />
      </Specimen>

      <Specimen label="Accordion" description="native details, multiple panels open at once">
        <Accordion
          className="w-full"
          items={[
            {
              id: 'a',
              question: t('faqQuestions.gcc-vs-pcc'),
              answer: t('faqAnswers.gcc-vs-pcc'),
            },
            {
              id: 'b',
              question: t('faqQuestions.why-coated'),
              answer: t('faqAnswers.why-coated'),
            },
          ]}
        />
      </Specimen>

      <Specimen
        label="Table"
        description="sortable header, sticky, scroll region, tabular figures"
      >
        <TableScroll
          className="w-full"
          label={t('properties.caption')}
          hint={t('sections.gradeMatrixScrollHint')}
        >
          <Table className="min-w-[30rem]">
            <TableCaption>{t('properties.caption')}</TableCaption>
            <TableHead sticky>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell
                  sort={{
                    direction: sortDirection,
                    onToggle: () =>
                      setSortDirection((current) =>
                        current === 'ascending' ? 'descending' : 'ascending',
                      ),
                    labels: {
                      ascending: t('ui.sortAscending'),
                      descending: t('ui.sortDescending'),
                      none: t('ui.sortNone'),
                    },
                  }}
                >
                  {t('properties.columnParameter')}
                </TableHeaderCell>
                <TableHeaderCell numeric>{t('properties.columnValue')}</TableHeaderCell>
                <TableHeaderCell>{t('properties.columnMethod')}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((property) => (
                <TableRow key={property.id}>
                  <TableRowHeader>{t(`parameters.${property.id}`)}</TableRowHeader>
                  <TableCell numeric>
                    {property.value}
                    {property.unit ? ` ${property.unit}` : ''}
                  </TableCell>
                  <TableCell numeric className="text-ink-muted">
                    {property.method}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </Specimen>

      <Specimen label="Field" description="label above, persistent hint, error below, states">
        <div className="grid w-full gap-6 md:grid-cols-2">
          <Field
            label={t('grades.columnCode')}
            hint={t('home.gradesIntro')}
            required
            requiredLabel={t('ui.required')}
          >
            {({ controlId, describedBy }) => (
              <Select controlId={controlId} describedBy={describedBy} defaultValue="GCC-1250">
                <option value="GCC-800">GCC-800</option>
                <option value="GCC-1250">GCC-1250</option>
                <option value="GCC-2500">GCC-2500</option>
              </Select>
            )}
          </Field>

          <Field
            label={t('sections.logisticsMarketsLabel')}
            error={t('sections.certificatePending')}
            requiredLabel={t('ui.required')}
            optionalLabel={t('ui.optional')}
          >
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                invalid
                defaultValue="Jeddah"
              />
            )}
          </Field>

          <Field
            label={t('sections.documentsHeading')}
            requiredLabel={t('ui.required')}
            optionalLabel={t('ui.optional')}
          >
            {({ controlId, describedBy }) => (
              <FileInput
                controlId={controlId}
                describedBy={describedBy}
                chooseLabel={t('ui.chooseFile')}
              />
            )}
          </Field>

          <Field
            label={t('sections.contactHeading')}
            hint={t('sections.contactPending')}
            requiredLabel={t('ui.required')}
          >
            {({ controlId, describedBy }) => (
              <TextArea controlId={controlId} describedBy={describedBy} rows={3} />
            )}
          </Field>

          <Field label="disabled" requiredLabel={t('ui.required')}>
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                disabled
                value="GCC-200"
                readOnly
              />
            )}
          </Field>

          <Field label="read-only" requiredLabel={t('ui.required')}>
            {({ controlId, describedBy }) => (
              <TextInput
                controlId={controlId}
                describedBy={describedBy}
                readOnly
                value="98.5%"
              />
            )}
          </Field>
        </div>
      </Specimen>

      <Specimen label="Alert" description="four tones, each with an icon and a visible word">
        <div className="flex w-full flex-col gap-3">
          <Alert tone="info" toneLabel={t('ui.infoLabel')}>
            {t('properties.familyLevelNote')}
          </Alert>
          <Alert tone="success" toneLabel={t('ui.successLabel')}>
            {t('sections.shelfLifeUncoated')}
          </Alert>
          <Alert tone="warning" toneLabel={t('ui.warningLabel')}>
            {t('sections.logisticsLeadTimePending')}
          </Alert>
          {alertVisible ? (
            <Alert
              tone="danger"
              toneLabel={t('ui.dangerLabel')}
              onDismiss={() => setAlertVisible(false)}
              dismissLabel={t('ui.dismiss')}
            >
              {t('sections.gradeMatrixEmpty')}
            </Alert>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setAlertVisible(true)}>
              {t('ui.expand')}
            </Button>
          )}
        </div>
      </Specimen>

      <Specimen label="Tooltip" description="opens on hover and focus, escapes on Escape">
        <p className="text-sm text-ink-secondary">
          {t('parameters.whiteness')}{' '}
          <Tooltip content="ISO 2470 (Elrepho)">
            <button
              type="button"
              className="rounded-xs border-b border-dashed border-border-strong text-ink-accent"
            >
              R457
            </button>
          </Tooltip>
        </p>
      </Specimen>

      <Specimen label="Pagination" description="direction-aware arrows, live page status">
        <Pagination
          className="w-full"
          page={page}
          totalPages={5}
          onPageChange={setPage}
          labels={{
            navigation: t('ui.pagination'),
            previous: t('ui.previousPage'),
            next: t('ui.nextPage'),
            status: t('ui.pageStatus', { page, total: 5 }),
          }}
        />
      </Specimen>

      <Specimen label="Dialog" description="native dialog, focus trap, backdrop dismiss">
        <Button onClick={() => setDialogOpen(true)}>{t('sections.documentRequest')}</Button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={t('documents.tds')}
          description={t('documentDescriptions.tds')}
          closeLabel={t('ui.close')}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                {t('ui.close')}
              </Button>
              <Button onClick={() => setDialogOpen(false)}>{t('nav.rfq')}</Button>
            </>
          }
        >
          {t('sections.documentsIntro')}
        </Dialog>
      </Specimen>
    </>
  );
}

export default InteractiveSpecimens;
