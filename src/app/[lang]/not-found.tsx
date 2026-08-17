import Link from 'next/link';
import { dict } from '@/content';
import { DEFAULT_LOCALE, pathFor } from '@/lib/i18n';

/**
 * In-locale 404. Rendered inside the [lang] layout, so it keeps the navigation,
 * the footer and the reading direction of the section the visitor was in.
 */
export default function NotFound() {
  const locale = DEFAULT_LOCALE;
  const d = dict(locale);

  return (
    <section className="section">
      <div className="content">
        <h1 className="t-display-l">
          {locale === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
        </h1>
        <p className="t-body-l measure" style={{ marginBlockStart: 'var(--s-6)', color: 'var(--ink-soft)' }}>
          {locale === 'ar'
            ? 'الرابط الذي وصلت منه لا يشير إلى صفحة على هذا الموقع. ابدأ من الصفحة الرئيسية.'
            : 'The link you followed does not point at a page on this site. Start from the homepage.'}
        </p>
        <p style={{ marginBlockStart: 'var(--s-8)' }}>
          <Link className="btn btn-primary" href={pathFor(locale, 'home')}>
            {d.shell.home}
          </Link>
        </p>
      </div>
    </section>
  );
}
