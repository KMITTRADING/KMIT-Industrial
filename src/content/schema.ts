import { z } from 'zod';

/**
 * Content and data schemas.
 *
 * Two jobs:
 *
 * 1. Type and validate the locale-neutral technical dataset, so a wrong mesh
 *    size or a missing test method fails the build.
 * 2. Type and validate the two localised content trees, and guarantee they are
 *    key-mirrored. `npm run check:i18n` parses both against `contentSchema` and
 *    diffs their key paths; a key present in one locale and absent in the other
 *    is a build failure, not a runtime fallback. Silent fallback to the other
 *    language is exactly how a bilingual B2B site ends up with English
 *    fragments in Arabic pages.
 */

const nonEmpty = z.string().trim().min(1);

/* ------------------------------------------------------------------- ids */

export const SECTOR_IDS = [
  'plastics',
  'paints-construction',
  'oil-gas',
  'rubber',
  'paper',
] as const;

export const APPLICATION_IDS = [
  'construction',
  'drilling-muds',
  'asphalt',
  'tile-adhesives',
  'basic-paints',
  'rubber',
  'pvc-pipes',
  'cables',
  'emulsion-paints',
  'pvc-fittings',
  'masterbatch',
  'pe-films',
  'high-end-masterbatch',
  'fine-coatings',
] as const;

export const PARAMETER_IDS = [
  'caco3-purity',
  'whiteness',
  'fe2o3',
  'sio2',
  'mgo',
  'moisture',
  'ph',
  'bulk-density',
  'oil-absorption',
  'mohs-hardness',
] as const;

export const PACKAGING_IDS = ['paper-valve-bag-25kg', 'jumbo-bag', 'bulk-tanker'] as const;

export const COATING_AGENT_IDS = ['stearic-acid'] as const;

export type SectorId = (typeof SECTOR_IDS)[number];
export type ApplicationId = (typeof APPLICATION_IDS)[number];
export type ParameterId = (typeof PARAMETER_IDS)[number];
export type PackagingId = (typeof PACKAGING_IDS)[number];
export type CoatingAgentId = (typeof COATING_AGENT_IDS)[number];

/**
 * Which §4 sector each §3 application rolls up into. Used to link a grade to
 * its application pages without restating the relationship in copy.
 */
export const APPLICATION_SECTOR: Record<ApplicationId, SectorId> = {
  construction: 'paints-construction',
  'drilling-muds': 'oil-gas',
  asphalt: 'paints-construction',
  'tile-adhesives': 'paints-construction',
  'basic-paints': 'paints-construction',
  rubber: 'rubber',
  'pvc-pipes': 'plastics',
  cables: 'plastics',
  'emulsion-paints': 'paints-construction',
  'pvc-fittings': 'plastics',
  masterbatch: 'plastics',
  'pe-films': 'plastics',
  'high-end-masterbatch': 'plastics',
  'fine-coatings': 'paints-construction',
};

/* -------------------------------------------------------------- data */

export const typicalPropertySchema = z.object({
  id: z.enum(PARAMETER_IDS),
  /** Rendered verbatim, including the ≥ / ≤ / en-dash range notation. */
  value: nonEmpty,
  /** Empty string for dimensionless parameters (pH, Mohs). */
  unit: z.string(),
  method: nonEmpty,
});

export const coatingLevelSchema = z.object({
  agent: z.enum(COATING_AGENT_IDS),
  min: z.number().positive(),
  max: z.number().positive(),
});

export const gradeSchema = z
  .object({
    code: z.string().regex(/^GCC-\d{3,4}$/),
    mesh: z.number().int().positive(),
    d50Min: z.number().positive(),
    d50Max: z.number().positive(),
    coated: z.boolean(),
    coatingLevel: coatingLevelSchema.nullable(),
    applications: z.array(z.enum(APPLICATION_IDS)).nonempty(),
    /** Null until per-grade packaging availability is supplied by the client. */
    packaging: z.array(z.enum(PACKAGING_IDS)).nonempty().nullable(),
    shelfLifeMonths: z.number().int().positive(),
    relatedGrades: z.array(z.string()),
  })
  .refine((grade) => grade.d50Max > grade.d50Min, {
    message: 'd50Max must be greater than d50Min',
    path: ['d50Max'],
  })
  .refine((grade) => grade.coated === (grade.coatingLevel !== null), {
    message: 'A coated grade must carry a coating level, and an uncoated grade must not',
    path: ['coatingLevel'],
  })
  .refine((grade) => grade.shelfLifeMonths === (grade.coated ? 12 : 24), {
    message:
      'Shelf life must follow docs/technical-data.md §5: 24 months uncoated, 12 months surface-coated',
    path: ['shelfLifeMonths'],
  });

export type TypicalProperty = z.infer<typeof typicalPropertySchema>;
export type Grade = z.infer<typeof gradeSchema>;

/* ---------------------------------------------------------------- content */

/** Builds `{ [id]: string }` with one required, non-empty entry per id. */
function labelMap<const T extends readonly string[]>(ids: T) {
  return z.object(
    Object.fromEntries(ids.map((id) => [id, nonEmpty])) as {
      [K in T[number]]: typeof nonEmpty;
    },
  );
}

/** ≤ 60 characters, per CLAUDE.md §8. Enforced, not merely documented. */
const titleString = z.string().trim().min(1).max(60);
/** ≤ 155 characters, per CLAUDE.md §8. */
const descriptionString = z.string().trim().min(1).max(155);
/**
 * The answer-first paragraph every page opens with: 40–60 words, stating what
 * the page delivers. Bounded here in characters, because a word count that
 * works for English does not transfer to Arabic.
 */
const answerFirstString = z.string().trim().min(180).max(560);

export const contentSchema = z.object({
  meta: z.object({
    siteName: nonEmpty,
    tagline: nonEmpty,
    defaultTitle: titleString,
    defaultDescription: descriptionString,
    /** Name of this locale, written in this locale. */
    localeName: nonEmpty,
    /** Name of the other locale, written in the other locale. */
    otherLocaleName: nonEmpty,
  }),

  a11y: z.object({
    skipToContent: nonEmpty,
    primaryNavigation: nonEmpty,
    localeSwitcher: nonEmpty,
    switchToOtherLocale: nonEmpty,
    mainContent: nonEmpty,
    footerLandmark: nonEmpty,
  }),

  nav: z.object({
    home: nonEmpty,
    products: nonEmpty,
    applications: nonEmpty,
    quality: nonEmpty,
    resources: nonEmpty,
    contact: nonEmpty,
    rfq: nonEmpty,
  }),

  home: z.object({
    title: titleString,
    description: descriptionString,
    h1: nonEmpty,
    answerFirst: answerFirstString,
    gradesHeading: nonEmpty,
    gradesIntro: nonEmpty,
    propertiesHeading: nonEmpty,
    propertiesIntro: nonEmpty,
    ctaRfq: nonEmpty,
    ctaProducts: nonEmpty,
  }),

  grades: z.object({
    caption: nonEmpty,
    columnCode: nonEmpty,
    columnMesh: nonEmpty,
    columnD50: nonEmpty,
    columnCoating: nonEmpty,
    columnApplications: nonEmpty,
    coated: nonEmpty,
    uncoated: nonEmpty,
    coatingWithLevel: nonEmpty,
    shelfLife: nonEmpty,
  }),

  properties: z.object({
    caption: nonEmpty,
    columnParameter: nonEmpty,
    columnValue: nonEmpty,
    columnMethod: nonEmpty,
    familyLevelNote: nonEmpty,
  }),

  parameters: labelMap(PARAMETER_IDS),
  applications: labelMap(APPLICATION_IDS),
  sectors: labelMap(SECTOR_IDS),
  packaging: labelMap(PACKAGING_IDS),
  coatingAgents: labelMap(COATING_AGENT_IDS),

  units: z.object({
    micron: nonEmpty,
    mesh: nonEmpty,
    months: nonEmpty,
    percent: nonEmpty,
  }),

  footer: z.object({
    headquarters: nonEmpty,
    marketsServed: nonEmpty,
    compliance: nonEmpty,
    dataProvenance: nonEmpty,
    rights: nonEmpty,
  }),

  styleguide: z.object({
    title: titleString,
    description: descriptionString,
    h1: nonEmpty,
    intro: nonEmpty,
  }),

  notFound: z.object({
    title: titleString,
    h1: nonEmpty,
    body: nonEmpty,
    backHome: nonEmpty,
  }),
});

export type Content = z.infer<typeof contentSchema>;

/* ------------------------------------------------------------ key mirror */

/** Every leaf key path in an object, dot-joined and sorted. */
export function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
    .sort();
}
