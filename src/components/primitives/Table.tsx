import { SortIcon } from './IconSet';
import { cn } from '@/lib/utils';

import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

/**
 * Table.
 *
 * A real `<table>` with a `<caption>` and scoped headers, because on this site
 * the specification table is the content: it is what a formulation engineer
 * reads, what a rich result extracts, and what an answer engine cites. A grid of
 * divs would look the same and mean nothing.
 *
 * Structure decisions:
 *
 * - One hairline between rows, via `divide-y` on the body, and a single 2px
 *   rule under the header. Not a border above and below every row: that reads
 *   as a spreadsheet export.
 * - Sticky header, so the parameter names stay visible while a long property
 *   table scrolls.
 * - Horizontal scrolling is announced rather than left to be discovered, by
 *   `TableScroll`, which is the one part of this system that runs on the
 *   client. Everything in this file is markup and stays on the server.
 * - Figures are tabular everywhere, and numeric cells are forced LTR: `4.5-6.0`
 *   is a measurement, not a phrase, and must not reorder inside Arabic text.
 */

/* ------------------------------------------------------------------ table */

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn('w-full border-collapse text-sm', className)} {...props}>
      {children}
    </table>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn('measure-prose pb-4 text-start text-sm text-ink-muted', className)}
      {...props}
    >
      {children}
    </caption>
  );
}

export function TableHead({
  sticky = false,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }) {
  return (
    <thead
      className={cn(
        'border-b-2 border-border-strong',
        sticky && 'sticky top-0 z-[var(--z-base)] bg-surface-page',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-border-subtle', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'hover:bg-surface-raised',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export type SortDirection = 'ascending' | 'descending' | 'none';

export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /** Column headers are the default; pass `row` for a row header. */
  scope?: 'col' | 'row';
  /** Present makes the header a sort control. */
  sort?: {
    direction: SortDirection;
    onToggle: () => void;
    labels: { ascending: string; descending: string; none: string };
  };
  numeric?: boolean;
};

export function TableHeaderCell({
  scope = 'col',
  sort,
  numeric = false,
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  const base = cn(
    'py-3 pe-4 text-start align-bottom font-semibold text-ink-primary',
    numeric && 'tabular-nums',
    className,
  );

  if (!sort) {
    return (
      <th scope={scope} className={base} {...props}>
        {children}
      </th>
    );
  }

  return (
    <th scope={scope} aria-sort={sort.direction} className={cn(base, 'p-0')} {...props}>
      <button
        type="button"
        onClick={sort.onToggle}
        className={cn(
          'flex w-full items-center gap-1.5 py-3 pe-4 text-start font-semibold',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          'hover:text-ink-accent',
        )}
      >
        {children}
        <SortIcon
          className={cn(
            'size-3.5 shrink-0 transition-opacity duration-[var(--duration-fast)]',
            sort.direction === 'none' ? 'opacity-35' : 'text-ink-accent opacity-100',
          )}
        />
        <span className="sr-only">{sort.labels[sort.direction]}</span>
      </button>
    </th>
  );
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /** Forces LTR and tabular figures. Use for every measurement and identifier. */
  numeric?: boolean;
};

export function TableCell({ numeric = false, className, children, ...props }: TableCellProps) {
  return (
    <td
      dir={numeric ? 'ltr' : undefined}
      className={cn(
        'py-4 pe-4 align-top text-ink-secondary',
        numeric && 'text-start tabular-nums',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

/** A row header: the grade code, the parameter name. Always the start column. */
export function TableRowHeader({
  numeric = false,
  className,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="row"
      dir={numeric ? 'ltr' : undefined}
      className={cn(
        'py-4 pe-4 text-start align-top font-semibold text-ink-primary',
        numeric && 'text-ink-accent tabular-nums',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export type TableProps = { children: ReactNode };

export default Table;
