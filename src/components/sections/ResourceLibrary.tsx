import { getTranslations } from 'next-intl/server';

import { ArrowInlineEndIcon, Badge, DocumentIcon, TrackedLink } from '@/components/primitives';
import { DOCUMENT_IDS } from '@/content/schema';
import { GRADES } from '@/content/data/grades';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { DocumentId } from '@/content/schema';

/**
 * Document library.
 *
 * Fifteen entries: three controlled documents for each of five grades.
 * Filterable by grade and by document type, with both filters held in the query
 * string and rendered as links, so `?type=tds` is a real indexable document and
 * a crawler sees the same rows a reader does.
 *
 * **On the gate.** The brief asks for a soft gate: a form in front of the
 * download, with the file still directly linkable so the documents stay
 * indexable. What is shipped is softer still, and the reason is a fact rather
 * than a preference: no TDS, MSDS or COA file has been supplied yet. There is
 * nothing to gate and nothing to leak.
 *
 * So each row routes into the RFQ adapter with the document and grade carried
 * as intent, which is a real capture rather than a decorative one, and the note
 * beneath says plainly that the specification itself is published on the grade
 * page and needs no request at all. Gating numbers a visitor can already read
 * two clicks away is theatre, and a technical buyer reads it as such.
 *
 * When the PDFs arrive the row keeps its shape: the action becomes a download
 * from a public path, and the form moves to a modal in front of it. Recorded as
 * ADR-024.
 */

export type ResourceLibraryProps = {
  /** From `?grade=`. Already validated against the dataset. */
  grade?: string;
  /** From `?type=`. Already validated. */
  type?: DocumentId;
  className?: string;
};

export async function ResourceLibrary({ grade, type, className }: ResourceLibraryProps) {
  const t = await getTranslations();

  const gradeRows = grade ? GRADES.filter((entry) => entry.code === grade) : GRADES;
  const documentTypes = type ? [type] : DOCUMENT_IDS;

  const rows = gradeRows.flatMap((entry) =>
    documentTypes.map((documentType) => ({ grade: entry.code, documentType })),
  );

  const query = (next: { grade?: string; type?: DocumentId }) => {
    const params: Record<string, string> = {};
    if (next.grade) params.grade = next.grade;
    if (next.type) params.type = next.type;
    return params;
  };

  const filterLink = (
    label: string,
    href: Record<string, string>,
    active: boolean,
    key: string,
  ) => (
    <li key={key}>
      <Link
        href={{ pathname: '/resources', query: href }}
        aria-current={active ? 'true' : undefined}
        scroll={false}
        className={cn(
          'flex min-h-11 items-center rounded-sm border px-4 py-2 text-sm',
          'transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          active
            ? 'border-accent-700 bg-surface-accent font-medium text-ink-inverse'
            : 'border-border-default bg-surface-page text-ink-secondary hover:border-ink-accent hover:text-ink-accent',
        )}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <nav aria-label={t('pages.resourcesFilterGrade')}>
          <h2 className="text-sm font-semibold text-ink-primary">
            {t('pages.resourcesFilterGrade')}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {filterLink(t('pages.resourcesFilterAll'), query({ type }), !grade, 'all-grades')}
            {GRADES.map((entry) =>
              filterLink(
                entry.code,
                query({ grade: entry.code, type }),
                grade === entry.code,
                entry.code,
              ),
            )}
          </ul>
        </nav>

        <nav aria-label={t('pages.resourcesFilterType')}>
          <h2 className="text-sm font-semibold text-ink-primary">
            {t('pages.resourcesFilterType')}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {filterLink(t('pages.resourcesFilterAll'), query({ grade }), !type, 'all-types')}
            {DOCUMENT_IDS.map((documentType) =>
              filterLink(
                t(`documents.${documentType}`),
                query({ grade, type: documentType }),
                type === documentType,
                documentType,
              ),
            )}
          </ul>
        </nav>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted">{t('pages.resourcesEmpty')}</p>
      ) : (
        <ul className="mt-10 border-t border-border-subtle">
          {rows.map((row) => (
            <li
              key={`${row.grade}-${row.documentType}`}
              className="border-b border-border-subtle"
            >
              <TrackedLink
                event="tds_download"
                params={{ grade: row.grade, document: row.documentType }}
                href={{
                  pathname: '/rfq',
                  query: { document: row.documentType, grade: row.grade },
                }}
                className="group flex flex-wrap items-center justify-between gap-4 py-5 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-surface-raised"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <DocumentIcon className="mt-0.5 size-5 shrink-0 text-ink-accent" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-primary">
                      {t(`documents.${row.documentType}`)}
                      <Badge variant="grade" size="sm">
                        {row.grade}
                      </Badge>
                    </p>
                    <p className="measure-prose mt-1 text-xs text-ink-secondary">
                      {t(`documentDescriptions.${row.documentType}`)}
                    </p>
                  </div>
                </div>

                <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-ink-accent">
                  {t('sections.documentRequest')}
                  <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      )}

      <p className="measure-prose mt-8 text-sm text-ink-muted">
        {t('pages.resourcesPendingNote')}
      </p>
    </div>
  );
}

export default ResourceLibrary;
