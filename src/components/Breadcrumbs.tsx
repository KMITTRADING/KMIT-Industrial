import Link from 'next/link';

import { dict } from '@/content';
import { pathFor, type Locale, type RouteKey } from '@/lib/i18n';

/**
 * Breadcrumb trail. Matches the BreadcrumbList emitted in JSON-LD on the same
 * page (§15.1.4), so the markup and the structured data cannot disagree.
 *
 * The separator is a 45deg slash, in keeping with the geometry, and it is
 * `aria-hidden` so a screen reader reads the trail as a list of links rather
 * than as punctuation.
 */
export function Breadcrumbs({
  locale,
  trail,
}: {
  locale: Locale;
  /** Ancestors only, in order. The current page is added as plain text. */
  trail: { label: string; route: RouteKey }[];
}) {
  const d = dict(locale);
  const current = trail[trail.length - 1];
  const ancestors = trail.slice(0, -1);

  return (
    <nav aria-label={d.shell.breadcrumb} className="crumbs t-label">
      <Link href={pathFor(locale, 'home')}>{d.shell.home}</Link>
      {ancestors.map((item) => (
        <span key={item.route} style={{ display: 'inline-flex', gap: 'var(--s-2)' }}>
          <span className="crumbs-sep" aria-hidden="true">
            /
          </span>
          <Link href={pathFor(locale, item.route)}>{item.label}</Link>
        </span>
      ))}
      <span className="crumbs-sep" aria-hidden="true">
        /
      </span>
      <span aria-current="page">{current.label}</span>
    </nav>
  );
}
