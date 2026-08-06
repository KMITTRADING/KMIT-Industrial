import { getTranslations } from 'next-intl/server';

import { ArrowInlineEndIcon, Badge } from '@/components/primitives';
import { GRADES } from '@/content/data/grades';
import { APPLICATION_SECTOR } from '@/content/schema';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { SectorId } from '@/content/schema';

/**
 * Application card.
 *
 * One sector, the grades that serve it, and a route into the sector page.
 *
 * The grade list is derived, not written: `APPLICATION_SECTOR` maps each
 * application in the dataset onto its sector, so a grade added to the dataset
 * appears here automatically and the two can never disagree. That derivation is
 * also what makes the internal linking map in docs/site-architecture.md hold up
 * across two locales without hand maintenance.
 *
 * A sector with no grade behind it renders with an empty state rather than an
 * empty card. Rubber and paper are documented sectors that no grade currently
 * lists as a primary application, and pretending otherwise would be inventing
 * a recommendation.
 */

export type ApplicationCardProps = {
  sector: SectorId;
  href?: string;
  className?: string;
};

export async function ApplicationCard({ sector, href, className }: ApplicationCardProps) {
  const t = await getTranslations();

  const grades = GRADES.filter((grade) =>
    grade.applications.some((application) => APPLICATION_SECTOR[application] === sector),
  );

  const body = (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-ink-primary">{t(`sectors.${sector}`)}</h3>
        <p className="text-sm text-ink-secondary">
          {grades
            .flatMap((grade) =>
              grade.applications.filter(
                (application) => APPLICATION_SECTOR[application] === sector,
              ),
            )
            .filter((application, index, all) => all.indexOf(application) === index)
            .map((application) => t(`applications.${application}`))
            .join(', ')}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-2xs font-medium text-ink-muted">
          {t('sections.applicationGradesLabel')}
        </p>
        {grades.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {grades.map((grade) => (
              <li key={grade.code}>
                <Badge variant="grade" size="sm">
                  {grade.code}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">{t('sections.certificatePending')}</p>
        )}
      </div>
    </>
  );

  const shell = cn(
    'flex flex-col justify-between rounded-md border border-border-subtle bg-surface-page p-6',
    'transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
    className,
  );

  if (!href) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <Link href={href} className={cn(shell, 'group hover:border-ink-accent')}>
      {body}
      <p className="mt-6 flex items-center gap-2 text-sm font-medium text-ink-accent">
        {t('sections.applicationViewSector')}
        <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
      </p>
    </Link>
  );
}

export default ApplicationCard;
