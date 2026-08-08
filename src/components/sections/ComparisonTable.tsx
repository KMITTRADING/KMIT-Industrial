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
import { cn } from '@/lib/utils';

import type { ComparisonRow } from '@/content/schema';

/**
 * A two-column comparison: the aspect down the start column, the two candidates
 * across.
 *
 * Both comparison guides use this shape, which is why it is a component rather
 * than markup written twice. It is a real `<table>` with a caption and scoped
 * headers, because a comparison table is the single most cited content format
 * in AI answers and the thing that gets cited is the table, not a prose
 * paragraph restating it.
 *
 * `left` and `right` rather than named sides: the component does not know
 * whether it is comparing coated against uncoated or ground against
 * precipitated, and naming the columns in the data would have meant two
 * near-identical components.
 */

export type ComparisonTableProps = {
  caption: string;
  columnAspect: string;
  columnLeft: string;
  columnRight: string;
  rows: Record<string, ComparisonRow>;
  scrollHint: string;
  className?: string;
};

export function ComparisonTable({
  caption,
  columnAspect,
  columnLeft,
  columnRight,
  rows,
  scrollHint,
  className,
}: ComparisonTableProps) {
  return (
    <div className={cn(className)}>
      <TableScroll label={caption} hint={scrollHint}>
        <Table className="min-w-[44rem]">
          <TableCaption>{caption}</TableCaption>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell>{columnAspect}</TableHeaderCell>
              <TableHeaderCell>{columnLeft}</TableHeaderCell>
              <TableHeaderCell>{columnRight}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rows).map(([id, row]) => (
              <TableRow key={id}>
                <TableRowHeader>{row.aspect}</TableRowHeader>
                <TableCell>{row.left}</TableCell>
                <TableCell>{row.right}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScroll>
    </div>
  );
}

export default ComparisonTable;
