import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a D50 range for display: `4.5 – 6.0`.
 *
 * Latin numerals in both locales, per CLAUDE.md §5 — specification tables are
 * read the same way in an Arabic plant as in an English one, and mixing
 * Eastern Arabic numerals into a spec table is the fastest way to make an
 * engineer distrust the page.
 */
export function formatRange(min: number, max: number, fractionDigits = 1): string {
  const format = (value: number) =>
    value.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  return `${format(min)} – ${format(max)}`;
}

/** Format an integer with Latin numerals and no grouping separator. */
export function formatInteger(value: number): string {
  return value.toLocaleString('en-US', { useGrouping: false });
}
