import { getTranslations } from 'next-intl/server';

/**
 * Skip link.
 *
 * The first focusable element on every page. Off-screen until focused, then it
 * slides in at the start edge, which is the right in Arabic and the left in
 * English, from one `inset-inline-start` rule.
 *
 * It targets `#main`, which every page layout must provide on its `<main>`.
 */
export async function SkipLink({ targetId = 'main' }: { targetId?: string }) {
  const t = await getTranslations('a11y');

  return (
    <a className="skip-link" href={`#${targetId}`}>
      {t('skipToContent')}
    </a>
  );
}

export default SkipLink;
