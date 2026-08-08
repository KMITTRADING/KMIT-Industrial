'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/primitives';

/**
 * Route-segment error boundary.
 *
 * Client component by necessity: an error boundary has to be one. It is
 * deliberately plain and deliberately does not render the header or footer,
 * because whatever failed may be exactly what those depend on, and a boundary
 * that throws while rendering is worse than no boundary.
 *
 * The error object is not shown to the reader. It goes to the console for a
 * developer and nowhere else: a stack trace on a supplier's website tells a
 * buyer nothing and tells an attacker something.
 */
export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('pages');

  return (
    <main id="main" className="mx-auto max-w-[76rem] px-5 py-section md:px-8">
      <h1 className="text-3xl font-semibold text-ink-primary">{t('errorH1')}</h1>
      <p className="measure-prose mt-6 text-ink-secondary">{t('errorBody')}</p>
      <Button className="mt-8" onClick={reset}>
        {t('errorRetry')}
      </Button>
    </main>
  );
}
