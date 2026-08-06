import { getTranslations } from 'next-intl/server';

import { Logo } from '@/components/brand/Logo';
import { Link } from '@/i18n/navigation';

import { LocaleSwitcher } from './LocaleSwitcher';

import type { Locale } from '@/i18n/routing';

/**
 * Foundation header: brand lockup plus the locale switcher.
 *
 * The primary navigation is intentionally absent until the pages it points at
 * exist — Phase 3. Shipping a nav bar of links that 404 is worse than shipping
 * no nav bar, and the labels are already written and validated in the content
 * tree, waiting for their routes.
 */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <header className="border-b border-border-subtle bg-surface-page">
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-6 px-5 py-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xs text-accent-800 transition-opacity hover:opacity-80"
          aria-label={t('nav.home')}
        >
          <Logo variant="full" locale={locale} className="h-9 w-auto md:h-10" />
        </Link>

        <LocaleSwitcher current={locale} />
      </div>
    </header>
  );
}

export default SiteHeader;
