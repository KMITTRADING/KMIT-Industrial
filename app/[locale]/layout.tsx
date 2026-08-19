import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { DIR, HTML_LANG, LOCALES, isLocale } from '@/lib/locales';
import { MotionLayer } from '@/components/motion/MotionLayer';
import '@/styles/globals.css';

/*
 * Runs before first paint, so the page never renders its revealed state and
 * then hides it. Setting the flag here rather than in the React effect is what
 * keeps the no-JS and reduced-motion paths honest: without this script nothing
 * is ever hidden, and the site is simply the static composition.
 */
const MOTION_FLAG = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}`;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/*
 * Both locales are prerendered to static HTML. `lang` and `dir` sit on <html>
 * itself, which is what lets every layout rule in the stylesheet stay logical:
 * one document direction, no per-component overrides.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={HTML_LANG[locale]} dir={DIR[locale]}>
      <head>
        {/* Both scripts' outlines are needed on first paint for the locale in
            question, and neither is discoverable from the HTML — the request
            only starts once the CSS has parsed. Preloading buys back that
            round trip on the LCP path. `crossOrigin` is required on font
            preloads even same-origin. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={locale === 'ar' ? '/fonts/alexandria-arabic-var.woff2' : '/fonts/alexandria-latin-var.woff2'}
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body>
        {children}
        <MotionLayer />
      </body>
    </html>
  );
}
