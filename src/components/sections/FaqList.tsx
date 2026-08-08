import { cn } from '@/lib/utils';

import type { FaqSet } from '@/content/schema';

/**
 * A set of questions and answers, rendered open.
 *
 * Deliberately not the `Accordion` primitive. An accordion hides every answer
 * but one behind a click, and these answers are the single most extractable
 * thing on the site: they are what an answer engine lifts, what a rich result
 * shows, and what an engineer skims before deciding whether to request a
 * sample. Collapsing them buys vertical space and costs the page its reason for
 * existing.
 *
 * The markup is a description list, which is what a question and its answer
 * actually are. Each question is also a real heading so it lands in the
 * document outline and can be linked to; the heading level is a prop because
 * this renders under an `h2` on a grade page and under an `h1` nowhere.
 */

export type FaqListProps = {
  faqs: FaqSet;
  /** Heading level for each question. Defaults to `h3`. */
  questionAs?: 'h3' | 'h4';
  /** Prefix for the per-question anchor id, so two sets on one page cannot collide. */
  idPrefix: string;
  className?: string;
};

export function FaqList({
  faqs,
  questionAs: Question = 'h3',
  idPrefix,
  className,
}: FaqListProps) {
  const entries = Object.entries(faqs);

  return (
    <dl className={cn('flex flex-col', className)}>
      {entries.map(([id, entry], index) => (
        <div
          key={id}
          className={cn(
            'grid gap-x-10 gap-y-3 py-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
            index > 0 && 'border-t border-border-subtle',
          )}
        >
          <dt>
            <Question
              id={`${idPrefix}-${id}`}
              className="text-base font-semibold text-balance text-ink-primary"
            >
              {entry.question}
            </Question>
          </dt>
          <dd className="measure-prose text-ink-secondary">{entry.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

export default FaqList;
