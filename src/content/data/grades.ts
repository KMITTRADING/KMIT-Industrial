import { gradeSchema, typicalPropertySchema } from '../schema';

import type { Grade, TypicalProperty } from '../schema';

/**
 * The grade dataset. Every number here comes from docs/technical-data.md §1–§5
 * and nowhere else.
 *
 * This module is the single source of numeric truth for the site: no page, no
 * copy string and no JSON-LD builder may restate a mesh size, a D50 range, a
 * coating level or a shelf life. They read it from here.
 *
 * The zod parse at the bottom runs at import time, so a malformed edit fails
 * the build rather than shipping a wrong specification to a formulation
 * engineer.
 */

/**
 * Typical chemical and physical properties — docs/technical-data.md §2.
 *
 * The source document publishes one table for the product family rather than
 * per grade, so these are held at family level. Anything grade-specific lives
 * on the grade itself.
 */
export const TYPICAL_PROPERTIES = [
  {
    id: 'caco3-purity',
    value: '≥ 98.5',
    unit: '%',
    method: 'ISO 3262-1',
  },
  {
    id: 'whiteness',
    value: '95.0 - 98.5',
    unit: '%',
    method: 'ISO 2470 (Elrepho)',
  },
  {
    id: 'fe2o3',
    value: '≤ 0.03',
    unit: '%',
    method: 'AAS / XRF',
  },
  {
    id: 'sio2',
    value: '≤ 0.20',
    unit: '%',
    method: 'XRF',
  },
  {
    id: 'mgo',
    value: '≤ 0.40',
    unit: '%',
    method: 'XRF',
  },
  {
    id: 'moisture',
    value: '≤ 0.20',
    unit: '%',
    method: 'ISO 787-2',
  },
  {
    id: 'ph',
    value: '8.5 - 9.5',
    unit: '',
    method: 'ISO 787-9',
  },
  {
    id: 'bulk-density',
    value: '0.7 - 1.3',
    unit: 'g/cm³',
    method: 'ISO 787-11',
  },
  {
    id: 'oil-absorption',
    value: '14 - 24',
    unit: 'g/100g',
    method: 'ISO 787-5',
  },
  {
    id: 'mohs-hardness',
    value: '3.0',
    unit: '',
    method: 'Mohs scale',
  },
] as const satisfies readonly TypicalProperty[];

/**
 * Grade / PSD matrix — docs/technical-data.md §3.
 *
 * `shelfLifeMonths` is derived from §5 (24 months uncoated, 12 months coated)
 * rather than restated per grade, so the two can never disagree.
 *
 * `packaging` is null on every grade on purpose: §5 documents the three
 * packaging formats at product-family level and does not state which formats
 * are offered for which grade. Until the client supplies that, pages render the
 * family-level list. See docs/technical-data.md §8 and docs/decisions.md ADR-009.
 */
export const GRADES = [
  {
    code: 'GCC-200',
    mesh: 200,
    d50Min: 45,
    d50Max: 55,
    coated: false,
    coatingLevel: null,
    applications: ['construction', 'drilling-muds', 'asphalt'],
    packaging: null,
    shelfLifeMonths: 24,
    relatedGrades: ['GCC-400'],
  },
  {
    code: 'GCC-400',
    mesh: 400,
    d50Min: 25,
    d50Max: 35,
    coated: false,
    coatingLevel: null,
    applications: ['tile-adhesives', 'basic-paints', 'rubber'],
    packaging: null,
    shelfLifeMonths: 24,
    relatedGrades: ['GCC-200', 'GCC-800'],
  },
  {
    code: 'GCC-800',
    mesh: 800,
    d50Min: 10,
    d50Max: 15,
    coated: false,
    coatingLevel: null,
    applications: ['pvc-pipes', 'cables', 'emulsion-paints'],
    packaging: null,
    shelfLifeMonths: 24,
    relatedGrades: ['GCC-400', 'GCC-1250'],
  },
  {
    code: 'GCC-1250',
    mesh: 1250,
    d50Min: 4.5,
    d50Max: 6.0,
    coated: true,
    coatingLevel: { agent: 'stearic-acid', min: 0.8, max: 1.2 },
    applications: ['pvc-fittings', 'masterbatch', 'pe-films'],
    packaging: null,
    shelfLifeMonths: 12,
    relatedGrades: ['GCC-800', 'GCC-2500'],
  },
  {
    code: 'GCC-2500',
    mesh: 2500,
    d50Min: 1.8,
    d50Max: 2.5,
    coated: true,
    coatingLevel: { agent: 'stearic-acid', min: 0.8, max: 1.2 },
    applications: ['high-end-masterbatch', 'fine-coatings'],
    packaging: null,
    shelfLifeMonths: 12,
    relatedGrades: ['GCC-1250'],
  },
] as const satisfies readonly Grade[];

export type GradeCode = (typeof GRADES)[number]['code'];

/** URL slug for a grade page: `/[locale]/products/gcc-1250`. */
export const gradeSlug = (code: GradeCode): string => code.toLowerCase();

export function findGrade(code: string): Grade | undefined {
  return GRADES.find((grade) => grade.code.toLowerCase() === code.toLowerCase());
}

// Validate at import time: a malformed dataset must fail the build, not the buyer.
typicalPropertySchema.array().nonempty().parse(TYPICAL_PROPERTIES);
gradeSchema.array().nonempty().parse(GRADES);
