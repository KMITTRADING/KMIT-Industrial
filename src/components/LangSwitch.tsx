'use client';

import { usePathname, useRouter } from 'next/navigation';
import { otherLocale, swapLocaleInPath, type Locale } from '@/lib/i18n';
import { dict } from '@/content';

/**
 * Language switcher (§6.5).
 *
 * Three things it must do, all of which are easy to get wrong:
 *  1. keep the current page rather than sending the visitor to the homepage
 *  2. keep the approximate scroll position across the swap
 *  3. leave the pinned scroll triggers measurable afterwards — direction flips,
 *     so every x-axis and pin measurement is stale until refreshed (§6.1)
 *
 * It renders as a real link so it works with JS disabled and shows a URL on
 * hover; the click handler only adds the scroll-position preservation.
 */
export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const target = otherLocale(locale);
  const href = swapLocaleInPath(pathname ?? `/${locale}`, target);
  const d = dict(locale);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, download) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    // Ratio rather than pixels: the Arabic text runs longer, so the same page is
    // a different height in each language and a raw offset would land wrong.
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    try {
      sessionStorage.setItem('kmit:scroll-ratio', String(ratio));
    } catch {
      /* Private mode can refuse storage; losing the position is acceptable. */
    }

    router.push(href);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={className}
      lang={target}
      aria-label={d.shell.switchToLabel}
      /* The label is the other language's own name, written in that language,
         so it needs its own dir to sit correctly inside this one. */
      dir={target === 'ar' ? 'rtl' : 'ltr'}
    >
      {d.shell.switchTo}
    </a>
  );
}
