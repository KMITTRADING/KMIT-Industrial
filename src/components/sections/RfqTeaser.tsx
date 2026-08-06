import { getTranslations } from 'next-intl/server';

import { ArrowInlineEndIcon } from '@/components/primitives';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * RFQ teaser.
 *
 * The one repeated call to action on the site, and it uses the same label
 * everywhere: nav, hero, teaser, footer. Three different phrasings for the same
 * intent ("get in touch", "request a quote", "talk to us") read as three
 * different actions and dilute all of them.
 *
 * The accent panel is used here and in the header mega-menu and nowhere else,
 * so it keeps meaning "this is the thing to do next".
 *
 * The optional prefill is what makes the path worth building: a reader arriving
 * from a grade page should not be asked which grade they were reading.
 */

export type RfqTeaserProps = {
  /** Grade code to prefill, from a grade page. */
  grade?: string;
  /** Sector to prefill, from an application page. */
  application?: string;
  className?: string;
};

export async function RfqTeaser({ grade, application, className }: RfqTeaserProps) {
  const t = await getTranslations();

  const query: Record<string, string> = {};
  if (grade) query.grade = grade;
  if (application) query.application = application;

  return (
    <section
      className={cn(
        'rounded-md border border-accent-700 bg-surface-accent px-6 py-10 text-ink-inverse md:px-10',
        className,
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_auto] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-3">
          <h2 className="measure-lede text-2xl font-semibold text-ink-inverse">
            {t('sections.rfqTeaserHeading')}
          </h2>
          <p className="measure-prose text-ink-inverse-secondary">
            {t('sections.rfqTeaserBody')}
          </p>
        </div>

        <Link
          href={{ pathname: '/rfq', query }}
          className={cn(
            'group inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-sm',
            'bg-surface-page px-6 py-3 text-sm font-medium text-ink-accent',
            'transition-transform duration-[var(--duration-press)] ease-[var(--ease-standard)]',
            'hover:bg-surface-raised active:scale-[0.985]',
          )}
        >
          {t('nav.rfq')}
          <ArrowInlineEndIcon className="size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

export default RfqTeaser;
