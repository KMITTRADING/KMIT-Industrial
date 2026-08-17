import { BrandIcon } from './brand/Logo';
import { Breadcrumbs } from './Breadcrumbs';
import type { Locale, RouteKey } from '@/lib/i18n';

/**
 * Inner page header. One H1 per page, matching the page's subject (§15.1.2).
 *
 * `word` carries the Material / Movement / Energy vocabulary on sector pages,
 * which is the site's recurring naming system and the deliberate replacement for
 * a repeated tracked section badge (§3.1, §14).
 */
export function PageHead({
  locale,
  trail,
  h1,
  lead,
  word,
  children,
  watermark = false,
}: {
  locale: Locale;
  trail: { label: string; route: RouteKey }[];
  h1: string;
  lead?: string;
  word?: string;
  /** Optional scene column, e.g. the sector's own geometry. */
  children?: React.ReactNode;
  watermark?: boolean;
}) {
  const head = (
    <>
      <Breadcrumbs locale={locale} trail={trail} />
      {word && <p className="t-label page-head-word">{word}</p>}
      <h1 className="t-display-l" style={{ marginBlockStart: word ? 'var(--s-2)' : 0 }}>
        {h1}
      </h1>
      {lead && <p className="t-body-l page-head-lead measure">{lead}</p>}
    </>
  );

  return (
    <section className="page-head on-dark">
      {watermark && <BrandIcon size="60vw" className="watermark" />}
      <div className="content">
        {children ? (
          <div className="page-head-grid">
            <div>{head}</div>
            <div className="page-head-scene">{children}</div>
          </div>
        ) : (
          head
        )}
      </div>
    </section>
  );
}
