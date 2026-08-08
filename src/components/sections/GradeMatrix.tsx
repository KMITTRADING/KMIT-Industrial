'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Badge,
  Button,
  Card,
  CardPlate,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowHeader,
  TableScroll,
} from '@/components/primitives';
import { GRADES } from '@/content/data/grades';
import { cn, formatInteger, formatRange } from '@/lib/utils';

import type { SortDirection } from '@/components/primitives';

/**
 * The grade matrix. The site's signature element.
 *
 * It is a specification table first and an interactive component second. That
 * ordering drives every decision here:
 *
 * - The markup is a real `<table>` with a caption and scoped headers, so the
 *   data is extractable by a rich result and by an answer engine. Filtering and
 *   sorting are enhancements layered on top of a document that reads correctly
 *   without them.
 * - Every row is present in the server-rendered HTML. The filter narrows what
 *   is displayed; it does not fetch.
 * - Numbers come from `src/content/data/grades.ts` and are formatted by shared
 *   helpers, so a mesh size cannot drift between this component and a grade
 *   page.
 *
 * The instrument treatment (a tray holding a plate, concentric radii) is used
 * here and nowhere else. It is what makes the table read as a panel on a
 * machine rather than a box on a page, and it stops being special if every
 * card gets it.
 */

type SortKey = 'mesh' | 'd50';

export type GradeMatrixProps = {
  /** Adds the filter controls. Off for compact placements like the mega-menu. */
  interactive?: boolean;
  className?: string;
};

export function GradeMatrix({ interactive = true, className }: GradeMatrixProps) {
  const t = useTranslations();
  const [coating, setCoating] = useState<'all' | 'coated' | 'uncoated'>('all');
  const [sort, setSort] = useState<{ key: SortKey; direction: Exclude<SortDirection, 'none'> }>(
    {
      key: 'mesh',
      direction: 'ascending',
    },
  );

  const rows = useMemo(() => {
    const filtered = GRADES.filter((grade) => {
      if (coating === 'all') return true;
      return coating === 'coated' ? grade.coated : !grade.coated;
    });

    // D50 sorts on the low end of the range: a grade is characterised by its
    // finest guaranteed particle size, and sorting on the midpoint would put
    // two overlapping grades in an order no engineer expects.
    const value = (grade: (typeof GRADES)[number]) =>
      sort.key === 'mesh' ? grade.mesh : grade.d50Min;

    return [...filtered].sort((a, b) =>
      sort.direction === 'ascending' ? value(a) - value(b) : value(b) - value(a),
    );
  }, [coating, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'ascending' ? 'descending' : 'ascending' }
        : { key, direction: 'ascending' },
    );

  const sortLabels = {
    ascending: t('ui.sortAscending'),
    descending: t('ui.sortDescending'),
    none: t('ui.sortNone'),
  };

  const directionFor = (key: SortKey): SortDirection =>
    sort.key === key ? sort.direction : 'none';

  const filters = [
    { id: 'all' as const, label: t('sections.gradeMatrixFilterAll') },
    { id: 'coated' as const, label: t('grades.coated') },
    { id: 'uncoated' as const, label: t('grades.uncoated') },
  ];

  return (
    <div className={className}>
      {interactive ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">{t('sections.gradeMatrixFilterLabel')}</legend>
            {filters.map((filter) => {
              const active = coating === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCoating(filter.id)}
                  className={cn(
                    'min-h-11 rounded-sm border px-4 py-2 text-sm',
                    'transition-[background-color,border-color,color,transform] duration-[var(--duration-press)] ease-[var(--ease-standard)]',
                    'active:scale-[0.985]',
                    active
                      ? 'border-accent-700 bg-surface-accent font-medium text-ink-inverse'
                      : 'border-border-default bg-surface-page text-ink-secondary hover:border-ink-accent hover:text-ink-accent',
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </fieldset>

          <p aria-live="polite" className="text-xs text-ink-muted tabular-nums">
            {t('sections.gradeMatrixShowing', { count: rows.length, total: GRADES.length })}
          </p>
        </div>
      ) : null}

      <Card variant="instrument" padding="none">
        <CardPlate className="px-5 py-5">
          {rows.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-10">
              <p className="text-sm text-ink-secondary">{t('sections.gradeMatrixEmpty')}</p>
              <Button variant="secondary" size="sm" onClick={() => setCoating('all')}>
                {t('sections.gradeMatrixReset')}
              </Button>
            </div>
          ) : (
            <TableScroll label={t('grades.caption')} hint={t('sections.gradeMatrixScrollHint')}>
              <Table className="min-w-[46rem]">
                <TableCaption>{t('grades.caption')}</TableCaption>
                <TableHead sticky>
                  <TableRow className="hover:bg-transparent">
                    <TableHeaderCell>{t('grades.columnCode')}</TableHeaderCell>
                    <TableHeaderCell
                      numeric
                      sort={{
                        direction: directionFor('mesh'),
                        onToggle: () => toggleSort('mesh'),
                        labels: sortLabels,
                      }}
                    >
                      {t('grades.columnMesh')}
                    </TableHeaderCell>
                    <TableHeaderCell
                      numeric
                      sort={{
                        direction: directionFor('d50'),
                        onToggle: () => toggleSort('d50'),
                        labels: sortLabels,
                      }}
                    >
                      {t('grades.columnD50')}
                    </TableHeaderCell>
                    <TableHeaderCell>{t('grades.columnCoating')}</TableHeaderCell>
                    <TableHeaderCell>{t('grades.columnApplications')}</TableHeaderCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((grade) => (
                    <TableRow key={grade.code}>
                      <TableRowHeader numeric>{grade.code}</TableRowHeader>
                      <TableCell numeric>{formatInteger(grade.mesh)}</TableCell>
                      <TableCell numeric>
                        {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                      </TableCell>
                      <TableCell>
                        {grade.coatingLevel ? (
                          <Badge variant="grade" size="sm">
                            {t('grades.coatingWithLevel', {
                              agent: t(`coatingAgents.${grade.coatingLevel.agent}`),
                              min: grade.coatingLevel.min.toFixed(1),
                              max: grade.coatingLevel.max.toFixed(1),
                            })}
                          </Badge>
                        ) : (
                          <span className="text-ink-muted">{t('grades.uncoated')}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ul className="flex flex-col gap-1">
                          {grade.applications.map((application) => (
                            <li key={application}>{t(`applications.${application}`)}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScroll>
          )}
        </CardPlate>
      </Card>
    </div>
  );
}

export default GradeMatrix;
