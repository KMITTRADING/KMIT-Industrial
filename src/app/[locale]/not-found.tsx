import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

/**
 * Locale-scoped 404. Rendered inside `[locale]/layout.tsx`, so it inherits the
 * correct `lang` and `dir` and does not drop an Arabic reader into an English
 * dead end.
 */
export default async function LocaleNotFound() {
  const t = await getTranslations('notFound');

  return (
    <main id="main" className="mx-auto max-w-[76rem] px-5 py-section md:px-8">
      <h1 className="text-3xl font-semibold text-ink-primary">{t('h1')}</h1>
      <p className="mt-6 max-w-[62ch] text-ink-secondary">{t('body')}</p>
      <p className="mt-8">
        <Link
          href="/"
          className="rounded-sm bg-surface-accent px-5 py-3 text-sm font-medium text-ink-inverse transition-colors hover:bg-surface-accent-deep"
        >
          {t('backHome')}
        </Link>
      </p>
    </main>
  );
}
