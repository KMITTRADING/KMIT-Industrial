import { getCopy } from '@/content';
import { otherLocale, type Locale } from '@/lib/locales';

/**
 * A real link to the mirrored URL, not a client-side toggle — the two locales
 * are separate documents and switching between them is a navigation (§8).
 *
 * The label is the name of the destination language, written in that language,
 * which is the only version a reader who needs it can definitely read. `lang`
 * on the anchor tells a screen reader to change voice for that one word.
 *
 * The current section anchor is carried across in step 4, where the scrollspy
 * that knows the current section lives.
 */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const target = otherLocale(locale);
  const copy = getCopy(locale);

  return (
    <a
      href={`/${target}`}
      hrefLang={target}
      lang={target}
      data-language-switch
      className="t-label inline-flex min-h-11 items-center px-3 text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
    >
      {copy.switchTo}
    </a>
  );
}
