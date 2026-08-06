'use client';

import { ArrowInlineEndIcon } from './IconSet';
import { Button } from './Button';
import { cn } from '@/lib/utils';

/**
 * Pagination.
 *
 * Previous and next are labelled by meaning, not by direction, and the arrow
 * glyph is mirrored with a transform so "next" points the way the reader is
 * travelling in either script.
 *
 * The page status is a live region: a keyboard user who presses next hears the
 * new position without having to hunt for it.
 */

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: {
    navigation: string;
    previous: string;
    next: string;
    /** ICU string with {page} and {total}. */
    status: string;
  };
  className?: string;
};

function formatStatus(template: string, page: number, total: number) {
  return template.replace('{page}', String(page)).replace('{total}', String(total));
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  labels,
  className,
}: PaginationProps) {
  const status = formatStatus(labels.status, page, totalPages);

  return (
    <nav
      aria-label={labels.navigation}
      className={cn('flex items-center justify-between gap-4', className)}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        iconStart={<ArrowInlineEndIcon className="size-4 -scale-x-100 rtl:scale-x-100" />}
      >
        {labels.previous}
      </Button>

      <p aria-live="polite" className="text-xs text-ink-muted tabular-nums">
        {status}
      </p>

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        iconEnd={<ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />}
      >
        {labels.next}
      </Button>
    </nav>
  );
}

export default Pagination;
