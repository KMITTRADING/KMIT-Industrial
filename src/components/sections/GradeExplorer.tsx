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
  TrackedLink,
} from '@/components/primitives';
import { APPLICATION_SECTOR, SECTOR_IDS } from '@/content/schema';
import { GRADES, gradeSlug } from '@/content/data/grades';
import { Link } from '@/i18n/navigation';
import { cn, formatInteger, formatRange } from '@/lib/utils';

import type { Grade } from '@/content/schema';
import type { SectorId } from '@/content/schema';

/**
 * The products page explorer: filter, matrix, comparison.
 *
 * Entirely server-rendered. Filter and comparison state live in the query
 * string and every control is a `<Link>`, which buys three things that a
 * client-side filter does not:
 *
 * - the filtered view is a real URL a buyer can send to a colleague,
 * - a crawler sees the same rows a reader sees, so `?industry=plastics-masterbatch`
 *   is an indexable document rather than a JavaScript state,
 * - the page ships no JavaScript for its primary function.
 *
 * This is why it is a separate component from `GradeMatrix`. That one is the
 * embedded widget for the home page and the styleguide, where filtering is a
 * local convenience and rewriting the address bar would be wrong. Here the
 * filter *is* the page.
 */

export const COMPARISON_LIMIT = 3;

export type GradeExplorerProps = {
  /** From `?industry=`. Unknown values are ignored rather than rendered. */
  industry?: SectorId;
  /** From `?compare=`. Already validated against the dataset. */
  compare: string[];
};

/** Grades whose applications roll up into the given sector. */
function filterBySector(sector: SectorId | undefined): Grade[] {
  if (!sector) return [...GRADES];
  return GRADES.filter((grade) =>
    grade.applications.some((application) => APPLICATION_SECTOR[application] === sector),
  );
}

/** Query string for a link that changes one parameter and keeps the rest. */
function query(params: { industry?: SectorId; compare: string[] }) {
  const next: Record<string, string> = {};
  if (params.industry) next.industry = params.industry;
  if (params.compare.length > 0) next.compare = params.compare.join(',');
  return next;
}

export async function GradeExplorer({ industry, compare }: GradeExplorerProps) {
  const t = await getTranslations();

  const rows = filterBySector(industry);
  const selected = GRADES.filter((grade) => compare.includes(grade.code));
  const atLimit = selected.length >= COMPARISON_LIMIT;

  const filters: { id: SectorId | undefined; label: string }[] = [
    { id: undefined, label: t('pages.productsFilterAllIndustries') },
    ...SECTOR_IDS.map((sector) => ({ id: sector, label: t(`sectors.${sector}`) })),
  ];

  return (
    <>
      {/* --------------------------------------------------------- filter */}
      <section aria-labelledby="filter-heading" className="mt-section-sm">
        <h2 id="filter-heading" className="text-sm font-semibold text-ink-primary">
          {t('pages.productsFilterHeading')}
        </h2>

        <nav aria-label={t('pages.productsFilterIndustry')} className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = filter.id === industry;
              return (
                <li key={filter.id ?? 'all'}>
                  <Link
                    href={{
                      pathname: '/products',
                      query: query({ industry: filter.id, compare }),
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
                    {filter.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-4 text-xs text-ink-muted tabular-nums">
          {t('sections.gradeMatrixShowing', { count: rows.length, total: GRADES.length })}
        </p>
      </section>

      {/* --------------------------------------------------------- matrix */}
      <section aria-labelledby="matrix-heading" className="mt-8">
        <h2 id="matrix-heading" className="sr-only">
          {t('home.gradesHeading')}
        </h2>

        <Card variant="instrument" padding="none">
          <CardPlate className="px-5 py-5">
            {rows.length === 0 ? (
              <p className="py-10 text-sm text-ink-secondary">
                {t('sections.gradeMatrixEmpty')}
              </p>
            ) : (
              <TableScroll
                label={t('grades.caption')}
                hint={t('sections.gradeMatrixScrollHint')}
              >
                <Table className="min-w-[52rem]">
                  <TableCaption>{t('grades.caption')}</TableCaption>
                  <TableHead sticky>
                    <TableRow className="hover:bg-transparent">
                      <TableHeaderCell>{t('grades.columnCode')}</TableHeaderCell>
                      <TableHeaderCell numeric>{t('grades.columnMesh')}</TableHeaderCell>
                      <TableHeaderCell numeric>{t('grades.columnD50')}</TableHeaderCell>
                      <TableHeaderCell>{t('grades.columnCoating')}</TableHeaderCell>
                      <TableHeaderCell>{t('grades.columnApplications')}</TableHeaderCell>
                      <TableHeaderCell>
                        <span className="sr-only">{t('pages.productsComparisonHeading')}</span>
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((grade) => {
                      const inComparison = compare.includes(grade.code);
                      const nextCompare = inComparison
                        ? compare.filter((code) => code !== grade.code)
                        : [...compare, grade.code];

                      return (
                        <TableRow key={grade.code}>
                          <TableRowHeader numeric>
                            <Link
                              href={`/products/${gradeSlug(grade.code)}`}
                              className="underline-offset-4 hover:underline"
                            >
                              {grade.code}
                            </Link>
                          </TableRowHeader>
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
                          <TableCell>
                            {inComparison || !atLimit ? (
                              <TrackedLink
                                event="grade_compared"
                                params={{ grade: grade.code, count: nextCompare.length }}
                                href={{
                                  pathname: '/products',
                                  query: query({ industry, compare: nextCompare }),
                                }}
                                scroll={false}
                                className={cn(
                                  'inline-flex min-h-11 items-center rounded-sm border px-3 py-2 text-xs whitespace-nowrap',
                                  'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                                  inComparison
                                    ? 'border-accent-700 bg-surface-accent text-ink-inverse'
                                    : 'border-border-default text-ink-secondary hover:border-ink-accent hover:text-ink-accent',
                                )}
                              >
                                {inComparison
                                  ? t('pages.productsComparisonClear')
                                  : t('pages.productsComparisonSelect')}
                              </TrackedLink>
                            ) : (
                              <span className="text-xs text-ink-muted">
                                {t('pages.productsComparisonLimit')}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableScroll>
            )}
          </CardPlate>
        </Card>
      </section>

      {/* ----------------------------------------------------- comparison */}
      <section aria-labelledby="comparison-heading" className="mt-section-sm">
        <h2 id="comparison-heading" className="text-2xl font-semibold text-ink-primary">
          {t('pages.productsComparisonHeading')}
        </h2>
        <p className="measure-prose mt-4 text-ink-secondary">
          {t('pages.productsComparisonIntro')}
        </p>

        {selected.length === 0 ? (
          <p className="mt-8 text-sm text-ink-muted">{t('pages.productsComparisonEmpty')}</p>
        ) : (
          <div className="mt-8">
            <TableScroll
              label={t('pages.productsComparisonHeading')}
              hint={t('sections.gradeMatrixScrollHint')}
            >
              {/*
                Transposed against the matrix: parameters run down the start
                column and grades across, because comparison is read by
                scanning one property across candidates, not by reading one
                grade end to end.
              */}
              <Table className="min-w-[34rem]">
                <TableCaption>{t('pages.productsComparisonIntro')}</TableCaption>
                <TableHead>
                  <TableRow className="hover:bg-transparent">
                    <TableHeaderCell>
                      <span className="sr-only">{t('properties.columnParameter')}</span>
                    </TableHeaderCell>
                    {selected.map((grade) => (
                      <TableHeaderCell key={grade.code} numeric>
                        <span dir="ltr">{grade.code}</span>
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableRowHeader>{t('grades.columnMesh')}</TableRowHeader>
                    {selected.map((grade) => (
                      <TableCell key={grade.code} numeric>
                        {formatInteger(grade.mesh)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableRowHeader>{t('grades.columnD50')}</TableRowHeader>
                    {selected.map((grade) => (
                      <TableCell key={grade.code} numeric>
                        {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableRowHeader>{t('grades.columnCoating')}</TableRowHeader>
                    {selected.map((grade) => (
                      <TableCell key={grade.code}>
                        {grade.coatingLevel
                          ? t('grades.coatingWithLevel', {
                              agent: t(`coatingAgents.${grade.coatingLevel.agent}`),
                              min: grade.coatingLevel.min.toFixed(1),
                              max: grade.coatingLevel.max.toFixed(1),
                            })
                          : t('grades.uncoated')}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableRowHeader>{t('sections.shelfLifeUncoated')}</TableRowHeader>
                    {selected.map((grade) => (
                      <TableCell key={grade.code} numeric>
                        {t('grades.shelfLife', { months: grade.shelfLifeMonths })}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableRowHeader>{t('grades.columnApplications')}</TableRowHeader>
                    {selected.map((grade) => (
                      <TableCell key={grade.code}>
                        <ul className="flex flex-col gap-1">
                          {grade.applications.map((application) => (
                            <li key={application}>{t(`applications.${application}`)}</li>
                          ))}
                        </ul>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableScroll>

            <p className="mt-6">
              <Link
                href={{ pathname: '/products', query: query({ industry, compare: [] }) }}
                scroll={false}
                className="text-sm text-ink-accent underline-offset-4 hover:underline"
              >
                {t('pages.productsComparisonClear')}
              </Link>
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default GradeExplorer;
