import { describe, expect, it } from 'vitest';

import { GRADES, TYPICAL_PROPERTIES, findGrade, gradeSlug } from '@/content/data/grades';
import { APPLICATION_IDS, APPLICATION_SECTOR, PARAMETER_IDS } from '@/content/schema';
import { GRADE_RECOMMENDATIONS, recommendationFor } from '@/content/data/guides';
import { SOLUTIONS, solutionsBySector } from '@/content/data/solutions';
import { SOLUTION_IDS } from '@/content/schema';

/**
 * Dataset integrity.
 *
 * The zod parse in `grades.ts` runs at import time and validates shape. These
 * assert the relationships zod cannot express: that the set is complete, that
 * the derived structures cover it, and that the numbers are ordered the way
 * every page assumes when it sorts by them.
 */

describe('the grade dataset', () => {
  it('carries all ten TDS parameters, each with a test method', () => {
    expect(TYPICAL_PROPERTIES).toHaveLength(PARAMETER_IDS.length);
    for (const parameter of PARAMETER_IDS) {
      const property = TYPICAL_PROPERTIES.find((entry) => entry.id === parameter);
      expect(property, `missing parameter ${parameter}`).toBeDefined();
      expect(property?.method.length).toBeGreaterThan(0);
      expect(property?.value.length).toBeGreaterThan(0);
    }
  });

  it('has a strictly decreasing D50 as mesh increases', () => {
    // Finer mesh means smaller particles. A dataset edit that breaks this makes
    // the particle-size chart draw a ladder that goes the wrong way.
    const byMesh = [...GRADES].sort((a, b) => a.mesh - b.mesh);
    for (let index = 1; index < byMesh.length; index += 1) {
      const coarser = byMesh[index - 1]!;
      const finer = byMesh[index]!;
      expect(finer.d50Max, `${finer.code} vs ${coarser.code}`).toBeLessThan(coarser.d50Min);
    }
  });

  it('coats exactly the micronized grades, and only those', () => {
    for (const grade of GRADES) {
      expect(grade.coated).toBe(grade.coatingLevel !== null);
      if (grade.coatingLevel) {
        expect(grade.coatingLevel.min).toBe(0.8);
        expect(grade.coatingLevel.max).toBe(1.2);
        expect(grade.shelfLifeMonths).toBe(12);
      } else {
        expect(grade.shelfLifeMonths).toBe(24);
      }
    }
  });

  it('covers every application exactly once across the range', () => {
    const claimed = GRADES.flatMap((grade) => grade.applications);
    expect([...claimed].sort()).toEqual([...APPLICATION_IDS].sort());
    expect(new Set(claimed).size).toBe(claimed.length);
  });

  it('maps every application to a sector', () => {
    for (const application of APPLICATION_IDS) {
      expect(APPLICATION_SECTOR[application], application).toBeDefined();
    }
  });

  it('only references related grades that exist', () => {
    const codes = new Set(GRADES.map((grade) => grade.code));
    for (const grade of GRADES) {
      for (const related of grade.relatedGrades) {
        expect(codes.has(related), `${grade.code} -> ${related}`).toBe(true);
        expect(related).not.toBe(grade.code);
      }
    }
  });

  it('resolves a grade from its slug, case-insensitively', () => {
    for (const grade of GRADES) {
      expect(findGrade(gradeSlug(grade.code))?.code).toBe(grade.code);
      expect(findGrade(grade.code.toUpperCase())?.code).toBe(grade.code);
    }
    expect(findGrade('gcc-9999')).toBeUndefined();
  });
});

describe('the grade-selection matrix', () => {
  it('recommends a grade for every application', () => {
    expect(GRADE_RECOMMENDATIONS).toHaveLength(APPLICATION_IDS.length);
    for (const application of APPLICATION_IDS) {
      expect(recommendationFor(application), application).toBeDefined();
    }
  });

  it('never recommends a grade that does not claim the application', () => {
    for (const entry of GRADE_RECOMMENDATIONS) {
      expect(entry.grade.applications as readonly string[]).toContain(entry.application);
    }
  });
});

/**
 * The grade x sector matrix.
 *
 * docs/pseo-inventory.md publishes a count and a set of reasons, and both are
 * only as good as the predicate behind them. These assert that the predicate is
 * what the document says it is, so a dataset edit that quietly changes which
 * pages exist fails here rather than in a search console three months later.
 */
describe('the solution matrix', () => {
  it('publishes exactly the nine combinations in the inventory', () => {
    expect(SOLUTIONS).toHaveLength(9);
    expect(SOLUTIONS.map((solution) => solution.id).sort()).toEqual([...SOLUTION_IDS].sort());
  });

  it('never publishes a combination the grade specification does not claim', () => {
    for (const solution of SOLUTIONS) {
      const claimed = solution.grade.applications.filter(
        (application) => APPLICATION_SECTOR[application] === solution.sector,
      );
      expect(claimed.length, solution.id).toBeGreaterThan(0);
      expect(solution.applications).toEqual(claimed);
    }
  });

  it('leaves paper and paperboard unpublished, because no grade claims it', () => {
    expect(SOLUTIONS.some((solution) => solution.sector === 'paper-paperboard')).toBe(false);
    expect(
      GRADES.some((grade) =>
        grade.applications.some(
          (application) => APPLICATION_SECTOR[application] === 'paper-paperboard',
        ),
      ),
    ).toBe(false);
  });

  it('points every page at a neighbouring grade to argue against', () => {
    for (const solution of SOLUTIONS) {
      expect(solution.adjacentGrade, solution.id).toBeDefined();
      expect(solution.adjacentGrade?.code).not.toBe(solution.grade.code);
    }
  });

  it('groups only sectors that have pages, so no hub renders an empty heading', () => {
    for (const group of solutionsBySector()) {
      expect(group.solutions.length, group.sector).toBeGreaterThan(0);
    }
  });
});
