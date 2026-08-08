import { APPLICATION_IDS } from '../schema';
import { GRADES } from './grades';

import type { ApplicationId, Grade } from '../schema';

/**
 * The grade-selection decision matrix.
 *
 * Derived rather than written. Every application in `APPLICATION_IDS` already
 * appears on exactly one grade in `GRADES`, because that is how
 * docs/technical-data.md §3 states it: the grade table lists its target
 * industries, not the other way round. Inverting that mapping here means the
 * selection guide cannot recommend a grade the grade page does not claim, and
 * an application added to the dataset appears in the guide with no second edit.
 *
 * The D50 range and the coating status come off the grade for the same reason.
 * Nothing in this module is a number; it is all a lookup.
 */

export type GradeRecommendation = {
  application: ApplicationId;
  grade: Grade;
};

/** Every application, paired with the grade whose dataset entry claims it. */
export const GRADE_RECOMMENDATIONS: GradeRecommendation[] = APPLICATION_IDS.flatMap(
  (application) => {
    const grade = GRADES.find((entry) =>
      (entry.applications as readonly string[]).includes(application),
    );
    // An application with no grade behind it is a dataset error, not a page to
    // render empty: the zod parse in grades.ts guarantees a non-empty
    // application list per grade, and APPLICATION_SECTOR covers the same set.
    return grade ? [{ application, grade }] : [];
  },
);

/** The recommendation for one application, or undefined if none is documented. */
export function recommendationFor(
  application: ApplicationId | undefined,
): GradeRecommendation | undefined {
  if (!application) return undefined;
  return GRADE_RECOMMENDATIONS.find((entry) => entry.application === application);
}
