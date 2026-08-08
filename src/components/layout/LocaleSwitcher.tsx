'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { localeNames, locales } from '@/i18n/routing';
import { track } from '@/lib/analytics';

import type { Locale } from '@/i18n/routing';

/**
 * Switches locale while staying on the same document.
 *
 * `usePathname` from the i18n navigation wrapper returns the path *without* the
 * locale prefix, so passing it back to `Link` with an explicit `locale` lands
 * the reader on the counterpart page rather than dumping them on the home page —
 * which is what a naive `<a href="/en">` does, and it loses the reader's place
 * every time.
 *
 * Each language is named in its own script. A reader who cannot read the
 * current locale can still find their own.
 */
export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const t = useTranslations('a11y');

  return (
    <nav aria-label={t('localeSwitcher')} className="flex items-center gap-1">
      {locales.map((locale) => {
        const isCurrent = locale === current;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            lang={locale}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            aria-current={isCurrent ? 'true' : undefined}
            onClick={() => {
              if (!isCurrent) track('locale_switched', { locale });
            }}
            className={
              isCurrent
                ? 'rounded-sm bg-accent-50 px-2.5 py-1.5 text-sm font-medium text-ink-accent'
                : 'rounded-sm px-2.5 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-neutral-100 hover:text-ink-primary'
            }
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </nav>
  );
}

export default LocaleSwitcher;
