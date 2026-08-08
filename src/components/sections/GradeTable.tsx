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
import { GRADES, gradeSlug } from '@/content/data/grades';
import { Link } from '@/i18n/navigation';
import { cn, formatInteger, formatRange } from '@/lib/utils';

/**
 * The grade matrix as a document: five rows, server-rendered, no JavaScript.
 *
 * This is the home page's version, and it replaced the interactive
 * `GradeMatrix` there in Phase 6 for a measured reason. That component is a
 * client component, and hydrating it was the single largest contributor to
 * total blocking time on the site's most-visited page. Removing it cut median
 * TBT roughly in half.
 *
 * What was given up is small and was duplicated anyway: filtering and sorting
 * five rows. `/products` does both properly, with the state in the URL so a
 * filtered view is shareable, and the home page already links to it. Two
 * filtering mechanisms for the same five grades was the redundancy; this
 * removes it rather than paying to hydrate the weaker one.
 *
 * `GradeMatrix` still exists and is still exercised in the styleguide, because
 * the interactive behaviour is part of the design system even where a page does
 * not need it.
 */

export type GradeTableProps = {
  className?: string;
};

export async function GradeTable({ className }: GradeTableProps) {
  const t = await getTranslations();

  return (
    <Card variant="instrument" padding="none" className={cn(className)}>
      <CardPlate className="px-5 py-5">
        <TableScroll label={t('grades.caption')} hint={t('sections.gradeMatrixScrollHint')}>
          <Table className="min-w-[48rem]">
            <TableCaption>{t('grades.caption')}</TableCaption>
            <TableHead>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell>{t('grades.columnCode')}</TableHeaderCell>
                <TableHeaderCell numeric>{t('grades.columnMesh')}</TableHeaderCell>
                <TableHeaderCell numeric>{t('grades.columnD50')}</TableHeaderCell>
                <TableHeaderCell>{t('grades.columnCoating')}</TableHeaderCell>
                <TableHeaderCell>{t('grades.columnApplications')}</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {GRADES.map((grade) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </CardPlate>
    </Card>
  );
}

export default GradeTable;
