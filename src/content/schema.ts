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

/**
 * Sector ids double as URL slugs, so they are written out in the form the
 * Phase 3 brief specifies rather than abbreviated. `rubber-elastomers` also
 * disambiguates the sector from the `rubber` application id.
 */
export const SECTOR_IDS = [
  'plastics-masterbatch',
  'paints-coatings-construction',
  'oil-gas-drilling',
  'rubber-elastomers',
  'paper-paperboard',
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

/** Standards and schemes named in docs/technical-data.md §6. */
export const STANDARD_IDS = [
  'iso-9001',
  'iso-14001',
  'iso-45001',
  'saso',
  'reach',
  'rohs',
] as const;

/** Controlled documents named in docs/technical-data.md §6. */
export const DOCUMENT_IDS = ['tds', 'msds', 'coa'] as const;

/**
 * Stages the material passes through, from quarried feed to despatch.
 *
 * Written as stages of the product, not as a claim about which of them KMIT
 * performs in-house: whether KMIT mills its own material or processes sourced
 * material is an open question (docs/technical-data.md §8). See ADR-016.
 */
export const PROCESS_STEP_IDS = [
  'feed',
  'milling',
  'classification',
  'surface-treatment',
  'quality-control',
  'packaging',
] as const;

export const FAQ_IDS = [
  'gcc-vs-pcc',
  'why-coated',
  'choose-grade',
  'storage-shelf-life',
] as const;

/** Grade codes, as ids. Mirrors `GRADES` in src/content/data/grades.ts. */
export const GRADE_CODES = ['GCC-200', 'GCC-400', 'GCC-800', 'GCC-1250', 'GCC-2500'] as const;

/**
 * The three decision and comparison guides.
 *
 * These are the informational surface: `docs/keyword-clusters.md` cluster 4 is
 * what an engineer types into an assistant rather than into a search box, and
 * these three pages are where those questions get answered. Slugs are written
 * as the comparison itself, because that is the query.
 */
export const GUIDE_IDS = ['grade-selection', 'coated-vs-uncoated', 'gcc-vs-pcc'] as const;

/**
 * Images that carry alt text from the content tree rather than from the page.
 *
 * Alt text is copy: it is read aloud, it is indexed, and it has to be written
 * natively in each locale rather than translated. Keeping it here means the
 * i18n gate catches a missing Arabic alt the same way it catches a missing
 * heading, which a literal in a `.tsx` file never was.
 */
export const IMAGE_IDS = ['quarry', 'plant', 'milling', 'lab'] as const;

export const CONTACT_CHANNEL_IDS = ['phone', 'whatsapp', 'email', 'location'] as const;

/**
 * The four reasons an in-Kingdom source beats an import, on the home page.
 *
 * Each one is attached to a documented fact. `lead-time` is deliberately in the
 * set even though no lead-time data exists: the argument is incomplete without
 * it, and stating that it is pending is more useful to a buyer than quietly
 * omitting the strongest reason to buy locally.
 */
export const SUPPLY_ARGUMENT_IDS = [
  'in-kingdom',
  'compliance',
  'published-specification',
  'packaging-match',
] as const;

export type SupplyArgumentId = (typeof SUPPLY_ARGUMENT_IDS)[number];

export type SectorId = (typeof SECTOR_IDS)[number];
export type ApplicationId = (typeof APPLICATION_IDS)[number];
export type ParameterId = (typeof PARAMETER_IDS)[number];
export type PackagingId = (typeof PACKAGING_IDS)[number];
export type CoatingAgentId = (typeof COATING_AGENT_IDS)[number];
export type StandardId = (typeof STANDARD_IDS)[number];
export type DocumentId = (typeof DOCUMENT_IDS)[number];
export type ProcessStepId = (typeof PROCESS_STEP_IDS)[number];
export type FaqId = (typeof FAQ_IDS)[number];
export type ContactChannelId = (typeof CONTACT_CHANNEL_IDS)[number];
export type GradeCodeId = (typeof GRADE_CODES)[number];
export type GuideId = (typeof GUIDE_IDS)[number];
export type ImageId = (typeof IMAGE_IDS)[number];

/**
 * Which §4 sector each §3 application rolls up into. Used to link a grade to
 * its application pages without restating the relationship in copy.
 */
export const APPLICATION_SECTOR: Record<ApplicationId, SectorId> = {
  construction: 'paints-coatings-construction',
  'drilling-muds': 'oil-gas-drilling',
  asphalt: 'paints-coatings-construction',
  'tile-adhesives': 'paints-coatings-construction',
  'basic-paints': 'paints-coatings-construction',
  rubber: 'rubber-elastomers',
  'pvc-pipes': 'plastics-masterbatch',
  cables: 'plastics-masterbatch',
  'emulsion-paints': 'paints-coatings-construction',
  'pvc-fittings': 'plastics-masterbatch',
  masterbatch: 'plastics-masterbatch',
  'pe-films': 'plastics-masterbatch',
  'high-end-masterbatch': 'plastics-masterbatch',
  'fine-coatings': 'paints-coatings-construction',
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

/** ≤ 60 characters, per CLAUDE.md §8. Enforced, not merely documented. */
const titleString = z.string().trim().min(1).max(60);
/** ≤ 155 characters, per CLAUDE.md §8. */
const descriptionString = z.string().trim().min(1).max(155);
/**
 * The answer-first paragraph every page opens with: 40-60 words, stating what
 * the page delivers. Bounded here in characters, because a word count that
 * works for English does not transfer to Arabic.
 */
const answerFirstString = z.string().trim().min(180).max(560);

/** Builds `{ [id]: string }` with one required, non-empty entry per id. */
function labelMap<const T extends readonly string[]>(ids: T) {
  return z.object(
    Object.fromEntries(ids.map((id) => [id, nonEmpty])) as {
      [K in T[number]]: typeof nonEmpty;
    },
  );
}

/** Builds `{ [id]: <schema> }` with one required entry per id. */
function mapOf<const T extends readonly string[], S extends z.ZodTypeAny>(ids: T, schema: S) {
  return z.object(Object.fromEntries(ids.map((id) => [id, schema])) as { [K in T[number]]: S });
}

/**
 * One question and its answer.
 *
 * The answer is bounded at the top because an FAQ answer that runs past a
 * screen stops being an answer, and because these are the passages an answer
 * engine lifts whole: a 40 to 90 word block survives extraction, a page of
 * prose does not.
 */
const faqEntrySchema = z.object({
  question: z.string().trim().min(10).max(160),
  answer: z.string().trim().min(80).max(700),
});

/**
 * A set of questions for one grade or one sector.
 *
 * Keyed by a topic slug rather than positional, so `npm run check:i18n` diffs
 * question ids across locales: an Arabic set that quietly loses a question the
 * English set still answers is a build failure. Six is the floor because fewer
 * than that is a gesture at an FAQ rather than one; ten is the ceiling because
 * past it the page is a knowledge base and should be split.
 */
const faqSetSchema = z
  .record(z.string(), faqEntrySchema)
  .refine((set) => Object.keys(set).length >= 6 && Object.keys(set).length <= 10, {
    message: 'An FAQ set carries between 6 and 10 questions',
  });

export type FaqEntry = z.infer<typeof faqEntrySchema>;
export type FaqSet = z.infer<typeof faqSetSchema>;

/** Rows of the coated versus uncoated comparison table. */
export const COATING_COMPARISON_IDS = [
  'surface',
  'dispersion',
  'moisture',
  'throughput',
  'shelf-life',
  'grades',
  'when-not-worth-it',
] as const;

/** Rows of the GCC versus PCC comparison table. */
export const GCC_PCC_COMPARISON_IDS = [
  'production',
  'morphology',
  'particle-size',
  'whiteness',
  'typical-use',
] as const;

export type CoatingComparisonId = (typeof COATING_COMPARISON_IDS)[number];
export type GccPccComparisonId = (typeof GCC_PCC_COMPARISON_IDS)[number];

/** One row of a two-column comparison: the aspect, then each side of it. */
const comparisonRowSchema = z.object({
  aspect: nonEmpty,
  left: nonEmpty,
  right: nonEmpty,
});

export type ComparisonRow = z.infer<typeof comparisonRowSchema>;

/** Fields every guide carries, whatever its body looks like. */
const guideChromeSchema = {
  title: titleString,
  description: descriptionString,
  h1: nonEmpty,
  answerFirst: answerFirstString,
  /** Short label for navigation and for the card on the guides index. */
  navLabel: nonEmpty,
  /** One sentence on the index card, stating what the guide settles. */
  cardSummary: nonEmpty,
};

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
    /** The sustainability-and-facility route. */
    facility: nonEmpty,
    /** The three decision and comparison guides. */
    guides: nonEmpty,
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
    columnShelfLife: nonEmpty,
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

  standards: labelMap(STANDARD_IDS),
  standardScopes: labelMap(STANDARD_IDS),
  documents: labelMap(DOCUMENT_IDS),
  documentDescriptions: labelMap(DOCUMENT_IDS),
  processSteps: labelMap(PROCESS_STEP_IDS),
  processStepDetails: labelMap(PROCESS_STEP_IDS),
  faqQuestions: labelMap(FAQ_IDS),
  faqAnswers: labelMap(FAQ_IDS),
  contactChannels: labelMap(CONTACT_CHANNEL_IDS),
  imageAlt: labelMap(IMAGE_IDS),

  /**
   * Questions an engineer asks about one specific grade, before requesting a
   * sample. Six to ten per grade, and deliberately not the same six: what you
   * ask about a 200 mesh bridging agent is not what you ask about a coated
   * 2500 mesh masterbatch filler.
   */
  gradeFaqs: mapOf(GRADE_CODES, faqSetSchema),

  /** The same, for a sector: process behaviour rather than specification. */
  sectorFaqs: mapOf(SECTOR_IDS, faqSetSchema),

  /**
   * Section-level copy for the domain components. Each block is what a real
   * page passes in; the styleguide renders the same strings so the review is of
   * production copy, not of sample text.
   */
  sections: z.object({
    certificationsHeading: nonEmpty,
    certificationsIntro: nonEmpty,
    certificationsColumnStandard: nonEmpty,
    certificationsColumnScope: nonEmpty,
    certificationsColumnCertificate: nonEmpty,
    certificatePending: nonEmpty,

    packagingHeading: nonEmpty,
    packagingIntro: nonEmpty,
    storageHeading: nonEmpty,
    storageBody: nonEmpty,
    shelfLifeUncoated: nonEmpty,
    shelfLifeCoated: nonEmpty,

    processHeading: nonEmpty,
    processIntro: nonEmpty,

    logisticsHeading: nonEmpty,
    logisticsIntro: nonEmpty,
    logisticsHqLabel: nonEmpty,
    logisticsMarketsLabel: nonEmpty,
    logisticsLeadTimePending: nonEmpty,

    documentsHeading: nonEmpty,
    documentsIntro: nonEmpty,
    documentRequest: nonEmpty,
    documentOnRequest: nonEmpty,

    faqHeading: nonEmpty,
    faqIntro: nonEmpty,

    contactHeading: nonEmpty,
    contactIntro: nonEmpty,
    contactPending: nonEmpty,

    rfqTeaserHeading: nonEmpty,
    rfqTeaserBody: nonEmpty,

    applicationGradesLabel: nonEmpty,
    applicationViewSector: nonEmpty,

    gradeMatrixFilterLabel: nonEmpty,
    gradeMatrixFilterAll: nonEmpty,
    gradeMatrixShowing: nonEmpty,
    gradeMatrixEmpty: nonEmpty,
    gradeMatrixReset: nonEmpty,
    gradeMatrixScrollHint: nonEmpty,
  }),

  /**
   * Interface chrome used by the primitives. Separate from `sections` because
   * these strings belong to the component library rather than to any page.
   */
  ui: z.object({
    close: nonEmpty,
    dismiss: nonEmpty,
    loading: nonEmpty,
    expand: nonEmpty,
    collapse: nonEmpty,
    openMenu: nonEmpty,
    closeMenu: nonEmpty,
    sortAscending: nonEmpty,
    sortDescending: nonEmpty,
    sortNone: nonEmpty,
    previousPage: nonEmpty,
    nextPage: nonEmpty,
    pagination: nonEmpty,
    pageStatus: nonEmpty,
    breadcrumb: nonEmpty,
    required: nonEmpty,
    optional: nonEmpty,
    chooseFile: nonEmpty,
    noFileChosen: nonEmpty,
    infoLabel: nonEmpty,
    successLabel: nonEmpty,
    warningLabel: nonEmpty,
    dangerLabel: nonEmpty,
  }),

  /* ------------------------------------------------------------ sectors */

  /** The technical problem the filler solves in this sector. */
  sectorProblems: labelMap(SECTOR_IDS),
  /** What it does once it is in the formulation. */
  sectorValue: labelMap(SECTOR_IDS),
  /** Process considerations: dispersion, extrusion, vulcanisation, and so on. */
  sectorProcess: labelMap(SECTOR_IDS),
  /** Why the recommended grades are the recommended ones. */
  sectorGradeReasoning: labelMap(SECTOR_IDS),

  supplyArguments: labelMap(SUPPLY_ARGUMENT_IDS),
  supplyArgumentDetails: labelMap(SUPPLY_ARGUMENT_IDS),

  /* -------------------------------------------------------------- pages */

  pages: z.object({
    productsTitle: titleString,
    productsDescription: descriptionString,
    productsH1: nonEmpty,
    productsAnswerFirst: answerFirstString,
    productsFilterHeading: nonEmpty,
    productsFilterIndustry: nonEmpty,
    productsFilterAllIndustries: nonEmpty,
    productsComparisonHeading: nonEmpty,
    productsComparisonIntro: nonEmpty,
    productsComparisonSelect: nonEmpty,
    productsComparisonLimit: nonEmpty,
    productsComparisonClear: nonEmpty,
    productsComparisonEmpty: nonEmpty,

    gradeTitleTemplate: nonEmpty,
    gradeDescriptionTemplate: nonEmpty,
    gradeAnswerFirstTemplate: nonEmpty,
    gradePsdHeading: nonEmpty,
    gradePsdIntro: nonEmpty,
    gradePsdCaption: nonEmpty,
    gradePsdAxisSize: nonEmpty,
    gradePsdAxisGrade: nonEmpty,
    gradePropertiesHeading: nonEmpty,
    gradeApplicationsHeading: nonEmpty,
    gradePackagingHeading: nonEmpty,
    gradeDocumentsHeading: nonEmpty,
    gradeFaqHeading: nonEmpty,
    gradeRelatedHeading: nonEmpty,
    gradeRelatedFiner: nonEmpty,
    gradeRelatedCoarser: nonEmpty,
    gradeCoatingHeading: nonEmpty,

    applicationsTitle: titleString,
    applicationsDescription: descriptionString,
    applicationsH1: nonEmpty,
    applicationsAnswerFirst: answerFirstString,

    sectorTitleTemplate: nonEmpty,
    sectorDescriptionTemplate: nonEmpty,
    sectorProblemHeading: nonEmpty,
    sectorValueHeading: nonEmpty,
    sectorProcessHeading: nonEmpty,
    sectorGradesHeading: nonEmpty,
    sectorLoadingHeading: nonEmpty,
    sectorLoadingPending: nonEmpty,

    facilityTitle: titleString,
    facilityDescription: descriptionString,
    facilityH1: nonEmpty,
    facilityAnswerFirst: answerFirstString,
    facilityLabHeading: nonEmpty,
    facilityLabBody: nonEmpty,
    facilityHseHeading: nonEmpty,
    facilityHseBody: nonEmpty,
    facilityEnvironmentHeading: nonEmpty,
    facilityEnvironmentBody: nonEmpty,

    resourcesTitle: titleString,
    resourcesDescription: descriptionString,
    resourcesH1: nonEmpty,
    resourcesAnswerFirst: answerFirstString,
    resourcesFilterGrade: nonEmpty,
    resourcesFilterType: nonEmpty,
    resourcesFilterAll: nonEmpty,
    resourcesEmpty: nonEmpty,
    resourcesPendingNote: nonEmpty,

    rfqTitle: titleString,
    rfqDescription: descriptionString,
    rfqH1: nonEmpty,
    rfqAnswerFirst: answerFirstString,

    contactTitle: titleString,
    contactDescription: descriptionString,
    contactH1: nonEmpty,
    contactAnswerFirst: answerFirstString,
    contactTechnicalHeading: nonEmpty,
    contactTechnicalBody: nonEmpty,
    contactCommercialHeading: nonEmpty,
    contactCommercialBody: nonEmpty,
    contactHoursHeading: nonEmpty,
    contactHoursPending: nonEmpty,

    homeSupplyHeading: nonEmpty,
    homeSupplyIntro: nonEmpty,
    homeGradeStripHeading: nonEmpty,
    homeApplicationsHeading: nonEmpty,
    homeApplicationsIntro: nonEmpty,
    homeQualityHeading: nonEmpty,
    homePackagingHeading: nonEmpty,
    homeCtaTds: nonEmpty,

    guidesTitle: titleString,
    guidesDescription: descriptionString,
    guidesH1: nonEmpty,
    guidesAnswerFirst: answerFirstString,
    guidesReadGuide: nonEmpty,

    errorTitle: titleString,
    errorH1: nonEmpty,
    errorBody: nonEmpty,
    errorRetry: nonEmpty,
    loadingLabel: nonEmpty,
  }),

  /* --------------------------------------------------------------- guides */

  /**
   * The three decision and comparison guides.
   *
   * Each one is shaped to its own argument rather than poured into a shared
   * template: choosing a grade is a decision path, and the two comparisons are
   * tables with an honest verdict underneath. A single generic guide schema
   * would have forced all three into the same shape and made each of them
   * slightly wrong.
   */
  guides: z.object({
    'grade-selection': z.object({
      ...guideChromeSchema,
      pathHeading: nonEmpty,
      pathIntro: nonEmpty,
      step1Heading: nonEmpty,
      step1Body: nonEmpty,
      step2Heading: nonEmpty,
      step2Body: nonEmpty,
      step3Heading: nonEmpty,
      step3Body: nonEmpty,
      selectorHeading: nonEmpty,
      selectorIntro: nonEmpty,
      selectorLabel: nonEmpty,
      selectorAll: nonEmpty,
      selectorResultHeading: nonEmpty,
      /** Shown before an application has been chosen. */
      selectorPrompt: nonEmpty,
      /** Shown if a chosen application has no grade behind it in the dataset. */
      selectorEmpty: nonEmpty,
      tableHeading: nonEmpty,
      tableCaption: nonEmpty,
      columnApplication: nonEmpty,
      columnD50: nonEmpty,
      columnGrade: nonEmpty,
      columnCoating: nonEmpty,
      closingHeading: nonEmpty,
      closingBody: nonEmpty,
    }),

    'coated-vs-uncoated': z.object({
      ...guideChromeSchema,
      whatHeading: nonEmpty,
      whatBody: nonEmpty,
      effectHeading: nonEmpty,
      effectBody: nonEmpty,
      tableHeading: nonEmpty,
      tableCaption: nonEmpty,
      columnAspect: nonEmpty,
      columnUncoated: nonEmpty,
      columnCoated: nonEmpty,
      rows: mapOf(COATING_COMPARISON_IDS, comparisonRowSchema),
      verdictHeading: nonEmpty,
      verdictBody: nonEmpty,
      shelfLifeHeading: nonEmpty,
      shelfLifeBody: nonEmpty,
    }),

    'gcc-vs-pcc': z.object({
      ...guideChromeSchema,
      processHeading: nonEmpty,
      processBody: nonEmpty,
      tableHeading: nonEmpty,
      tableCaption: nonEmpty,
      columnAspect: nonEmpty,
      columnGcc: nonEmpty,
      columnPcc: nonEmpty,
      rows: mapOf(GCC_PCC_COMPARISON_IDS, comparisonRowSchema),
      fitHeading: nonEmpty,
      fitBody: nonEmpty,
      supplyHeading: nonEmpty,
      supplyBody: nonEmpty,
    }),
  }),

  /* ---------------------------------------------------------- rfq form */

  rfqForm: z.object({
    sectionRequirement: nonEmpty,
    sectionDelivery: nonEmpty,
    sectionContact: nonEmpty,
    sectionRequirementHint: nonEmpty,
    sectionDeliveryHint: nonEmpty,
    sectionContactHint: nonEmpty,

    labelGrade: nonEmpty,
    labelTonnage: nonEmpty,
    labelApplication: nonEmpty,
    labelPackaging: nonEmpty,
    labelCity: nonEmpty,
    labelCountry: nonEmpty,
    labelCertifications: nonEmpty,
    labelStartDate: nonEmpty,
    labelCompany: nonEmpty,
    labelContactName: nonEmpty,
    labelEmail: nonEmpty,
    labelPhone: nonEmpty,
    labelNotes: nonEmpty,
    labelUpload: nonEmpty,

    hintGrade: nonEmpty,
    hintTonnage: nonEmpty,
    hintCertifications: nonEmpty,
    hintStartDate: nonEmpty,
    hintNotes: nonEmpty,
    hintUpload: nonEmpty,
    hintPhone: nonEmpty,

    placeholderSelect: nonEmpty,
    notSure: nonEmpty,

    errorRequired: nonEmpty,
    errorEmail: nonEmpty,
    errorPhone: nonEmpty,
    errorTonnage: nonEmpty,
    errorTooLong: nonEmpty,
    errorSummary: nonEmpty,

    submit: nonEmpty,
    submitting: nonEmpty,
    continueToDelivery: nonEmpty,
    continueToContact: nonEmpty,
    back: nonEmpty,

    successHeading: nonEmpty,
    successBody: nonEmpty,
    successReference: nonEmpty,
    successNext1: nonEmpty,
    successNext2: nonEmpty,
    successNext3: nonEmpty,
    successAgain: nonEmpty,

    failureHeading: nonEmpty,
    failureBody: nonEmpty,
  }),

  footer: z.object({
    headquarters: nonEmpty,
    marketsServed: nonEmpty,
    dataProvenance: nonEmpty,
    rights: nonEmpty,
    complianceHeading: nonEmpty,
    navHeading: nonEmpty,
    productsHeading: nonEmpty,
  }),

  /**
   * Strings that exist only inside structured data.
   *
   * They are in the content tree rather than in `src/lib/jsonld.ts` because
   * they are localised prose that a machine reader will surface to a human,
   * and because the i18n gate should catch a missing Arabic value here exactly
   * as it does for a heading.
   */
  /** The analytics consent prompt. Shown only when a provider is configured. */
  consent: z.object({
    heading: nonEmpty,
    body: nonEmpty,
    accept: nonEmpty,
    decline: nonEmpty,
  }),

  jsonld: z.object({
    /** City, for the Organization postal address. */
    addressLocality: nonEmpty,
    areaServedCountry: nonEmpty,
    areaServedRegion: nonEmpty,
    /** `Product.material`. */
    material: nonEmpty,
    /** `Product.category`. */
    productCategory: nonEmpty,
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
