import { FOOTER_LINKS, SITE_NAV } from '@/lib/navigation';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { cn } from '@/lib/utils';

import type { Locale } from '@/i18n/routing';
import type { ReactNode } from 'react';

/**
 * The shell every page renders inside.
 *
 * Header, main landmark, footer. It exists so the navigation configuration is
 * applied identically on every route: a page that forgot to pass `navItems`
 * would silently ship a header with no navigation, and that is exactly the kind
 * of defect nobody notices until a reader does.
 *
 * `#main` is the skip link's target, so every page must render its content
 * through here rather than laying out its own `<main>`.
 */

export type PageShellProps = {
  locale: Locale;
  children: ReactNode;
  /** Set for pages that manage their own horizontal rhythm, such as a full-bleed hero. */
  bleed?: boolean;
  className?: string;
};

export function PageShell({ locale, children, bleed = false, className }: PageShellProps) {
  return (
    <>
      <SiteHeader locale={locale} navItems={SITE_NAV} showRfq />

      <main
        id="main"
        className={cn(bleed ? '' : 'mx-auto max-w-[76rem] px-5 pb-section md:px-8', className)}
      >
        {children}
      </main>

      <SiteFooter locale={locale} navLinks={FOOTER_LINKS} showGrades />
    </>
  );
}

export default PageShell;
