import { getTranslations } from 'next-intl/server';

import {
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
import { TYPICAL_PROPERTIES } from '@/content/data/grades';

/**
 * Specification table.
 *
 * The typical chemical and physical properties, each stated with the test
 * method that produced it. The method column is not decoration: it is the
 * difference between a specification and a claim, and it is the reason this
 * page is worth citing.
 *
 * Server-rendered with no interactivity. Ten rows do not need sorting, and a
 * sort control on a table nobody sorts is a control in the way.
 */

export async function SpecTable({ className }: { className?: string }) {
  const t = await getTranslations();

  return (
    <div className={className}>
      <TableScroll label={t('properties.caption')}>
        <Table className="min-w-[34rem]">
          <TableCaption>{t('properties.caption')}</TableCaption>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell>{t('properties.columnParameter')}</TableHeaderCell>
              <TableHeaderCell numeric>{t('properties.columnValue')}</TableHeaderCell>
              <TableHeaderCell>{t('properties.columnMethod')}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TYPICAL_PROPERTIES.map((property) => (
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

      <p className="measure-prose mt-6 text-sm text-ink-muted">
        {t('properties.familyLevelNote')}
      </p>
    </div>
  );
}

export default SpecTable;
