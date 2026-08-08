import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

/**
 * Breadcrumbs.
 *
 * The separator is a CSS pseudo-element, not a character in the markup. Two
 * consequences, both wanted: it flips automatically with the document direction,
 * and a screen reader announces "Home, Products, GCC-1250" rather than
 * "Home slash Products slash GCC dash 1250".
 *
 * The current page is the last item, is not a link, and carries
 * `aria-current="page"`.
 */

type Href = ComponentProps<typeof Link>['href'];

export type Crumb = {
  label: string;
  href?: Href;
};

export type BreadcrumbsProps = {
  items: Crumb[];
  /** Accessible name for the nav landmark. */
  label: string;
  className?: string;
};

export function Breadcrumbs({ items, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-ink-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className={cn(
                'flex items-center gap-x-1',
                // The slash is drawn before every item except the first, and it
                // is scaled rather than rotated so it reads correctly in both
                // directions.
                index > 0 &&
                  "before:me-1 before:text-border-strong before:content-['/'] rtl:before:-scale-x-100",
              )}
            >
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className="text-ink-secondary">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-xs underline-offset-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:text-ink-accent hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
