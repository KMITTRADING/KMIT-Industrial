import { getTranslations } from 'next-intl/server';

import { ArrowInlineEndIcon, Badge, DocumentIcon } from '@/components/primitives';
import { DOCUMENT_IDS } from '@/content/schema';
import { Link } from '@/i18n/navigation';

import type { DocumentId } from '@/content/schema';

/**
 * Document row.
 *
 * A request row, not a download row, because no TDS, MSDS or COA file has been
 * supplied yet. A download button that produces a 404, or that quietly does
 * nothing, costs more trust than the missing file does.
 *
 * The request routes into the RFQ adapter with a document intent, so the
 * capture is real rather than decorative. When the PDFs arrive, the row keeps
 * its shape and the action becomes a download.
 *
 * Per-batch documents are marked as such: a COA belongs to a production batch,
 * not to a grade, and a reader who does not know that will ask for the wrong
 * thing.
 */

export type DocumentDownloadRowProps = {
  /** Restrict to specific documents. Defaults to all three. */
  documents?: readonly DocumentId[];
  /** Grade code, carried into the request so the enquiry arrives qualified. */
  grade?: string;
  className?: string;
};

export async function DocumentDownloadRow({
  documents = DOCUMENT_IDS,
  grade,
  className,
}: DocumentDownloadRowProps) {
  const t = await getTranslations();

  return (
    <ul className={className}>
      {documents.map((document, index) => (
        <li key={document} className={index > 0 ? 'border-t border-border-subtle' : undefined}>
          <Link
            href={{
              pathname: '/rfq',
              query: grade ? { document, grade } : { document },
            }}
            className="group flex flex-wrap items-center justify-between gap-4 py-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-raised"
          >
            <div className="flex min-w-0 items-start gap-3">
              <DocumentIcon className="mt-0.5 size-5 shrink-0 text-ink-accent" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-primary">
                  {t(`documents.${document}`)}
                  {grade ? (
                    <Badge variant="grade" size="sm">
                      {grade}
                    </Badge>
                  ) : null}
                </p>
                <p className="measure-prose mt-1 text-xs text-ink-secondary">
                  {t(`documentDescriptions.${document}`)}
                </p>
              </div>
            </div>

            <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-ink-accent">
              {t('sections.documentRequest')}
              <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default DocumentDownloadRow;
