import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';

import { FloatingNav } from '@/components/FloatingNav';
import { Footer } from '@/components/Footer';
import { GrainOverlay } from '@/components/GrainOverlay';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SmoothScroll } from '@/components/SmoothScroll';
import { dict } from '@/content';
import { dirOf, isLocale, LOCALES, type Locale } from '@/lib/i18n';
import { SITE } from '@/lib/site';

/**
 * This is the root layout: every route on the site lives under /[lang], so the
 * `<html>` element is emitted here where the locale is known. `lang` and `dir`
 * are set as real attributes rather than being simulated in CSS (§6.1).
 */

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#1B1F4E',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  icons: {
    icon: [{ url: '/brand/KMIT_Industrial_Icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/brand/KMIT_Industrial_Icon.svg' }],
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dir = dirOf(locale);
  const d = dict(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      /* --icon-flip mirrors directional icons only; the logo and the 3D scenes
         read it and deliberately ignore it (§6.3). */
      style={{ ['--icon-flip' as string]: dir === 'rtl' ? -1 : 1 }}
      suppressHydrationWarning
    >
      <head>
        {/* Only the running script's font is preloaded. Preloading both would
            spend the budget on outlines this page will never draw (§15). */}
        <link
          rel="preload"
          href={
            locale === 'ar'
              ? '/fonts/alexandria-arabic-var.woff2'
              : '/fonts/alexandria-latin-var.woff2'
          }
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {d.shell.skipToContent}
        </a>

        <SmoothScroll />
        <ScrollProgress />
        <GrainOverlay />

        <FloatingNav locale={locale} />

        <main id="main">{children}</main>

        <Footer locale={locale} />
      </body>
    </html>
  );
}
