import { getTranslations } from 'next-intl/server';

import {
  Badge,
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
import { GRADE_RECOMMENDATIONS, recommendationFor } from '@/content/data/guides';
import { Link } from '@/i18n/navigation';
import { cn, formatInteger, formatRange } from '@/lib/utils';
import { gradeSlug } from '@/content/data/grades';

import type { ApplicationId } from '@/content/schema';

/**
 * Application to grade selector, plus the full table it filters.
 *
 * The brief asks for an interactive selector with a crawlable static fallback.
 * These are the same thing here: every control is a `<Link>` carrying the
 * selection in the query string, and the complete fourteen-row table renders
 * underneath on every request whatever is selected. There is no state a crawler
 * cannot reach and no JavaScript involved in reaching it.
 *
 * Selecting an application does not hide the table. Narrowing to one row would
 * answer the question and remove the context that makes the answer checkable,
 * and the reader who wants to see whether the neighbouring application takes
 * the same grade is the reader worth keeping.
 */

export type GradeSelectorProps = {
  /** From `?application=`. Already validated against the dataset. */
  application?: ApplicationId;
  className?: string;
};

export async function GradeSelector({ application, className }: GradeSelectorProps) {
  const t = await getTranslations();
  const selected = recommendationFor(application);

  return (
    <div className={cn(className)}>
      <nav aria-label={t('guides.grade-selection.selectorLabel')}>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/guides/grade-selection"
              aria-current={application ? undefined : 'true'}
              scroll={false}
              className={cn(
                'flex min-h-11 items-center rounded-sm border px-4 py-2 text-sm',
                'transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                application
                  ? 'border-border-default bg-surface-page text-ink-secondary hover:border-ink-accent hover:text-ink-accent'
                  : 'border-accent-700 bg-surface-accent font-medium text-ink-inverse',
              )}
            >
              {t('guides.grade-selection.selectorAll')}
            </Link>
          </li>

          {GRADE_RECOMMENDATIONS.map((entry) => {
            const active = entry.application === application;
            return (
              <li key={entry.application}>
                <Link
                  href={{
                    pathname: '/guides/grade-selection',
                    query: { application: entry.application },
                  }}
                  aria-current={active ? 'true' : undefined}
                  scroll={false}
                  className={cn(
                    'flex min-h-11 items-center rounded-sm border px-4 py-2 text-sm',
                    'transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                    active
                      ? 'border-accent-700 bg-surface-accent font-medium text-ink-inverse'
                      : 'border-border-default bg-surface-page text-ink-secondary hover:border-ink-accent hover:text-ink-accent',
                  )}
                >
                  {t(`applications.${entry.application}`)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---------------------------------------------------------- result */}
      <section aria-labelledby="selector-result" className="mt-8">
        <h3 id="selector-result" className="text-sm font-semibold text-ink-primary">
          {t('guides.grade-selection.selectorResultHeading')}
        </h3>

        {selected ? (
          <Card variant="instrument" padding="none" className="mt-4">
            <CardPlate className="px-6 py-6">
              <p className="text-sm text-ink-secondary">
                {t(`applications.${selected.application}`)}
              </p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <Link
                  href={`/products/${gradeSlug(selected.grade.code)}`}
                  dir="ltr"
                  className="text-3xl font-semibold text-ink-accent tabular-nums underline-offset-4 hover:underline"
                >
                  {selected.grade.code}
                </Link>
                <span dir="ltr" className="text-sm text-ink-secondary tabular-nums">
                  {formatRange(selected.grade.d50Min, selected.grade.d50Max)}{' '}
                  {t('units.micron')}
                </span>
              </p>
              <p className="mt-4">
                {selected.grade.coatingLevel ? (
                  <Badge variant="grade" size="sm">
                    {t('grades.coatingWithLevel', {
                      agent: t(`coatingAgents.${selected.grade.coatingLevel.agent}`),
                      min: selected.grade.coatingLevel.min.toFixed(1),
                      max: selected.grade.coatingLevel.max.toFixed(1),
                    })}
                  </Badge>
                ) : (
                  <span className="text-sm text-ink-muted">{t('grades.uncoated')}</span>
                )}
              </p>
            </CardPlate>
          </Card>
        ) : (
          <p className="mt-4 text-sm text-ink-muted">
            {t(
              application
                ? 'guides.grade-selection.selectorEmpty'
                : 'guides.grade-selection.selectorPrompt',
            )}
          </p>
        )}
      </section>

      {/* ----------------------------------------------------- static table */}
      <section aria-labelledby="selector-table" className="mt-section-sm">
        <h3 id="selector-table" className="text-2xl font-semibold text-ink-primary">
          {t('guides.grade-selection.tableHeading')}
        </h3>

        <TableScroll
          className="mt-8"
          label={t('guides.grade-selection.tableCaption')}
          hint={t('sections.gradeMatrixScrollHint')}
        >
          <Table className="min-w-[46rem]">
            <TableCaption>{t('guides.grade-selection.tableCaption')}</TableCaption>
            <TableHead sticky>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell>
                  {t('guides.grade-selection.columnApplication')}
                </TableHeaderCell>
                <TableHeaderCell numeric>
                  {t('guides.grade-selection.columnD50')}
                </TableHeaderCell>
                <TableHeaderCell numeric>
                  {t('guides.grade-selection.columnGrade')}
                </TableHeaderCell>
                <TableHeaderCell>{t('guides.grade-selection.columnCoating')}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {GRADE_RECOMMENDATIONS.map((entry) => (
                <TableRow
                  key={entry.application}
                  className={cn(entry.application === application && 'bg-surface-sunken')}
                >
                  <TableRowHeader>{t(`applications.${entry.application}`)}</TableRowHeader>
                  <TableCell numeric>
                    {formatRange(entry.grade.d50Min, entry.grade.d50Max)} {t('units.micron')}
                  </TableCell>
                  <TableCell numeric>
                    <Link
                      href={`/products/${gradeSlug(entry.grade.code)}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {entry.grade.code}
                    </Link>
                    <span className="ms-2 text-ink-muted">
                      {formatInteger(entry.grade.mesh)} {t('units.mesh')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {entry.grade.coatingLevel ? (
                      t('grades.coatingWithLevel', {
                        agent: t(`coatingAgents.${entry.grade.coatingLevel.agent}`),
                        min: entry.grade.coatingLevel.min.toFixed(1),
                        max: entry.grade.coatingLevel.max.toFixed(1),
                      })
                    ) : (
                      <span className="text-ink-muted">{t('grades.uncoated')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </section>
    </div>
  );
}

export default GradeSelector;
