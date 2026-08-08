import { getTranslations } from 'next-intl/server';

import { Breadcrumbs } from '@/components/primitives';
import { FOOTER_LINKS, SITE_NAV } from '@/lib/navigation';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import {
  breadcrumbJsonLd,
  jsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/jsonld';
import { cn } from '@/lib/utils';

import type { Crumb } from '@/lib/jsonld';
import type { JsonLdNode } from '@/lib/jsonld';
import type { Locale } from '@/i18n/routing';
import type { ReactNode } from 'react';

/**
 * The shell every page renders inside.
 *
 * Header, breadcrumbs, main landmark, structured data, footer. It exists so the
 * navigation configuration is applied identically on every route: a page that
 * forgot to pass `navItems` would silently ship a header with no navigation,
 * and that is exactly the kind of defect nobody notices until a reader does.
 *
 * Breadcrumbs are a prop rather than markup a page writes, and the visible
 * trail and the `BreadcrumbList` node are built from that one array. Google
 * requires structured data to match the page; deriving both from a single
 * source makes that structural rather than a thing to remember.
 *
 * `#main` is the skip link's target, so every page must render its content
 * through here rather than laying out its own `<main>`.
 */

export type PageShellProps = {
  locale: Locale;
  children: ReactNode;
  /**
   * The breadcrumb trail, excluding the home crumb, which is prepended here so
   * no page can omit it. The last entry is the current page and takes no path.
   */
  crumbs?: Crumb[];
  /** Page-specific JSON-LD: Product, ItemList, FAQPage. */
  jsonLd?: (JsonLdNode | undefined)[];
  /** Set for pages that manage their own horizontal rhythm, such as a full-bleed hero. */
  bleed?: boolean;
  className?: string;
};

export async function PageShell({
  locale,
  children,
  crumbs,
  jsonLd = [],
  bleed = false,
  className,
}: PageShellProps) {
  const t = await getTranslations();

  const trail: Crumb[] = crumbs ? [{ name: t('nav.home'), path: '/' }, ...crumbs] : [];

  return (
    <>
      <script
        {...jsonLdScript([
          organizationJsonLd(locale),
          websiteJsonLd(locale),
          trail.length > 1 ? breadcrumbJsonLd(locale, trail) : undefined,
          ...jsonLd,
        ])}
      />

      <SiteHeader locale={locale} navItems={SITE_NAV} showRfq />

      <main
        id="main"
        className={cn(bleed ? '' : 'mx-auto max-w-[76rem] px-5 pb-section md:px-8', className)}
      >
        {trail.length > 1 ? (
          <div className="pt-8">
            <Breadcrumbs
              label={t('ui.breadcrumb')}
              items={trail.map((crumb) => ({
                label: crumb.name,
                ...(crumb.path === undefined ? {} : { href: crumb.path }),
              }))}
            />
          </div>
        ) : null}

        {children}
      </main>

      <SiteFooter locale={locale} navLinks={FOOTER_LINKS} showGrades />
    </>
  );
}

export default PageShell;
