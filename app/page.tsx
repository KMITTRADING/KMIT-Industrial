import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALES, SITE_URL } from '@/lib/locales';

/*
 * `/` is answered by a 301 to /ar, issued at the edge from netlify.toml before
 * any file is served — so in production this page is never reached.
 *
 * It is still generated, for two reasons: a local `npx serve out` has no edge
 * rules, and if the redirect is ever removed the root should degrade to a
 * usable choice rather than a 404. It is noindex so it cannot compete with the
 * two real documents for the same queries.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/${DEFAULT_LOCALE}` },
};

const NAMES: Record<string, string> = { ar: 'العربية', en: 'English' };

export default function RootPage() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '3rem 1.5rem' }}>
        <p style={{ margin: '0 0 1.5rem' }}>KMIT Industrial Solutions</p>
        <nav>
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {LOCALES.map((locale) => (
              <li key={locale}>
                <a href={`/${locale}`} lang={locale}>
                  {NAMES[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </body>
    </html>
  );
}
