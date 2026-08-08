import { getTranslations } from 'next-intl/server';

import { Accordion } from '@/components/primitives';
import { FAQ_IDS } from '@/content/schema';

import type { FaqId } from '@/content/schema';

/**
 * FAQ accordion.
 *
 * Four questions, each answered from docs/technical-data.md, each phrased the
 * way an engineer actually types it into a search box or an assistant. This is
 * the site's primary answer-engine surface: "difference between GCC and PCC" and
 * "why coat calcium carbonate with stearic acid" are real queries, and a page
 * that answers them in full, in one paragraph, with the numbers attached, is
 * what gets cited.
 *
 * Panels are independently openable, because a reader comparing the GCC and PCC
 * answer against the grade-selection answer needs both on screen.
 *
 * The markup is native `<details>`, so every answer is present for a crawler
 * whether or not the panel is open, and findable by the browser's own in-page
 * search.
 */

export async function FaqAccordion({
  questions = FAQ_IDS,
  className,
}: {
  questions?: readonly FaqId[];
  className?: string;
}) {
  const t = await getTranslations();

  return (
    <Accordion
      className={className}
      items={questions.map((id) => ({
        id,
        question: t(`faqQuestions.${id}`),
        answer: t(`faqAnswers.${id}`),
      }))}
    />
  );
}

export default FaqAccordion;
