import { APPLICATION_SECTOR, SECTOR_IDS, SOLUTION_IDS } from '../schema';
import { GRADES, gradeSlug } from './grades';

import type { ApplicationId, SectorId, SolutionId } from '../schema';

/**
 * One entry of `GRADES`, with its literal types intact.
 *
 * `GRADES` is declared `as const`, so its elements are deeply readonly literals
 * rather than the wider `Grade` that zod infers. Carrying that narrower type
 * through here rather than widening to `Grade` keeps `grade.code` a literal at
 * every call site, which is what lets a solution id be checked against
 * `SolutionId` instead of being an unchecked template string.
 */
type GradeEntry = (typeof GRADES)[number];

/**
 * The grade x sector matrix, derived.
 *
 * A combination earns a page if and only if the grade's own `applications`
 * list contains at least one application that `APPLICATION_SECTOR` maps to that
 * sector. Twenty-five candidates, nine survivors. docs/pseo-inventory.md
 * records the decision for every one of the sixteen that did not.
 *
 * Deriving it rather than listing it is the substantive choice here, and it is
 * the no-invented-data rule applied to page generation. docs/technical-data.md
 * §3 states which industries each grade targets. A page headed "GCC-1250 for
 * drilling fluids" would be this repository deciding that, not KMIT. So the
 * matrix cannot express anything the specification does not already claim, an
 * application added to the dataset brings its page with it, and nobody can add
 * a page by holding an opinion.
 *
 * `SOLUTION_IDS` in the schema is the static mirror of this, needed because zod
 * builds a required content key per page from a literal tuple. The assertion at
 * the bottom of this file is what keeps the two honest.
 */

export type Solution = {
  id: SolutionId;
  grade: GradeEntry;
  sector: SectorId;
  /** The applications that put this grade in this sector. Never empty. */
  applications: ApplicationId[];
  /**
   * The grade the `versus` block argues against: the neighbouring size step
   * that a reader is most likely to be weighing this one against.
   *
   * Preference order is deliberate. A related grade that also serves this
   * sector is the real alternative, because it is the substitution somebody
   * might actually make. Failing that, any related grade still gives the reader
   * the next step up or down the size range.
   */
  adjacentGrade: GradeEntry | undefined;
};

const solutionId = (code: string, sector: SectorId): string =>
  `${gradeSlug(code)}-for-${sector}`;

/** Sectors this grade serves, in `SECTOR_IDS` order so output is stable. */
function sectorsFor(grade: { readonly applications: readonly ApplicationId[] }): SectorId[] {
  return SECTOR_IDS.filter((sector) =>
    grade.applications.some((application) => APPLICATION_SECTOR[application] === sector),
  );
}

const derived = GRADES.flatMap((grade) =>
  sectorsFor(grade).map((sector) => ({
    id: solutionId(grade.code, sector) as SolutionId,
    grade: grade as GradeEntry,
    sector,
    applications: grade.applications.filter(
      (application) => APPLICATION_SECTOR[application] === sector,
    ) as ApplicationId[],
    adjacentGrade: undefined as GradeEntry | undefined,
  })),
);

/**
 * Resolve `adjacentGrade` in a second pass, because it needs the full derived
 * list to know which related grades also serve the sector.
 */
export const SOLUTIONS: Solution[] = derived.map((solution) => {
  const related = solution.grade.relatedGrades
    .map((code: string) => GRADES.find((grade) => grade.code === code))
    .filter((grade): grade is GradeEntry => grade !== undefined);

  const sharingSector = related.find((grade) => sectorsFor(grade).includes(solution.sector));

  return { ...solution, adjacentGrade: sharingSector ?? related[0] };
});

export function findSolution(id: string): Solution | undefined {
  return SOLUTIONS.find((solution) => solution.id === id);
}

/** Solutions grouped by sector, for the hub. Sectors with none are omitted. */
export function solutionsBySector(): { sector: SectorId; solutions: Solution[] }[] {
  return SECTOR_IDS.map((sector) => ({
    sector,
    solutions: SOLUTIONS.filter((solution) => solution.sector === sector),
  })).filter((group) => group.solutions.length > 0);
}

/**
 * The derived set and the declared set must be the same set.
 *
 * This runs at import time, so editing a grade's applications without updating
 * `SOLUTION_IDS` and the content tree fails the build instead of shipping a
 * page with no copy behind it, or a copy block addressing a page that no longer
 * exists. It is the only thing standing between the two representations.
 */
const derivedIds = SOLUTIONS.map((solution) => solution.id).sort();
const declaredIds = [...SOLUTION_IDS].sort();

if (derivedIds.join('|') !== declaredIds.join('|')) {
  const missing = derivedIds.filter((id) => !declaredIds.includes(id as SolutionId));
  const extra = declaredIds.filter((id) => !derivedIds.includes(id));
  throw new Error(
    'SOLUTION_IDS has drifted from the grade dataset. ' +
      `Derived but not declared: ${missing.join(', ') || 'none'}. ` +
      `Declared but not derived: ${extra.join(', ') || 'none'}. ` +
      'Reconcile src/content/schema.ts, the solutions content block in both ' +
      'locales, and docs/pseo-inventory.md before continuing.',
  );
}
