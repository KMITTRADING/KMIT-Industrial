import { getTranslations } from 'next-intl/server';

import { Logo } from '@/components/brand/Logo';

import type { Locale } from '@/i18n/routing';

/**
 * Foundation footer.
 *
 * Carries only what docs/technical-data.md actually establishes: where the
 * company is, which markets it serves, which standards it works to, and the
 * provenance of every number published on the site. Address, phone, CR number
 * and certificate numbers are open TODO(data) items and are not guessed at.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={t('a11y.footerLandmark')}
      className="mt-section border-t border-border-subtle bg-surface-sunken"
    >
      <div className="mx-auto max-w-[76rem] px-5 py-14 md:px-8">
        <Logo
          variant="mark"
          locale={locale}
          decorative
          className="h-8 w-auto text-accent-800"
        />

        <dl className="mt-8 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="sr-only">{t('footer.headquarters')}</dt>
            <dd className="text-ink-secondary">{t('footer.headquarters')}</dd>
          </div>
          <div>
            <dt className="sr-only">{t('footer.marketsServed')}</dt>
            <dd className="text-ink-secondary">{t('footer.marketsServed')}</dd>
          </div>
          <div>
            <dt className="sr-only">{t('footer.compliance')}</dt>
            <dd className="font-medium text-ink-primary tabular-nums" dir="ltr">
              {t('footer.compliance')}
            </dd>
          </div>
        </dl>

        <p className="mt-8 max-w-prose border-t border-border-subtle pt-6 text-sm text-ink-muted">
          {t('footer.dataProvenance')}
        </p>

        <p className="mt-6 text-sm text-ink-muted">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
