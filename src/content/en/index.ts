import type { Content } from '../schema';

/**
 * English content — a full, equal-quality locale, not a translation layer over
 * the Arabic.
 *
 * Register: British-neutral technical English, procurement-facing. No
 * exclamation marks, no superlatives, no claim that is not attached to a
 * number, a standard, or a test method.
 *
 * Every factual claim traces to docs/technical-data.md, and carries the same
 * facts as the Arabic tree — the two locales differ in language only.
 */
export const en = {
  meta: {
    siteName: 'KMIT',
    tagline: 'Industrial Solutions',
    defaultTitle: 'KMIT | Industrial Calcium Carbonate - Jeddah',
    defaultDescription:
      'Saudi supplier of ground and surface-coated calcium carbonate, 200 to 2500 mesh, at ≥ 98.5% purity with published technical data for every grade.',
    localeName: 'English',
    otherLocaleName: 'العربية',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    primaryNavigation: 'Primary navigation',
    localeSwitcher: 'Language',
    switchToOtherLocale: 'Switch to Arabic',
    mainContent: 'Main content',
    footerLandmark: 'Site footer',
  },

  nav: {
    home: 'Home',
    products: 'Products',
    applications: 'Applications',
    quality: 'Quality & compliance',
    resources: 'Technical documents',
    contact: 'Contact',
    rfq: 'Request a quote',
  },

  home: {
    title: 'Calcium Carbonate Supplier in Saudi Arabia | KMIT',
    description:
      'Calcium carbonate grades from 200 to 2500 mesh, ground and surface-coated, with D50, purity, whiteness and test method published per grade.',
    h1: 'Industrial calcium carbonate, specified in full, from Jeddah',
    answerFirst:
      'KMIT supplies ground calcium carbonate (GCC) and surface-coated grades from Jeddah to plastics, paint, construction and drilling-fluid plants across Saudi Arabia and the wider GCC. Grades run from 200 mesh to 2500 mesh - a median particle size (D50) of 55 microns down to 1.8 microns - at a minimum 98.5% CaCO₃ purity and 95.0-98.5% whiteness, tested to ISO 3262-1 and ISO 2470.',
    gradesHeading: 'Grade and particle-size matrix',
    gradesIntro:
      'Select by mesh or by median particle size (D50). The micronized grades are stearic-acid coated to improve dispersion in polymers and reduce moisture pick-up.',
    propertiesHeading: 'Typical chemical and physical properties',
    propertiesIntro:
      'The values below are typical for the product family, and each is stated with the test method used to determine it.',
    ctaRfq: 'Request a quote',
    ctaProducts: 'Browse the grades',
  },

  grades: {
    caption:
      'Calcium carbonate grade matrix: mesh, median particle size, surface coating and primary applications',
    columnCode: 'Grade',
    columnMesh: 'Mesh',
    columnD50: 'D50',
    columnCoating: 'Surface coating',
    columnApplications: 'Primary applications',
    coated: 'Coated',
    uncoated: 'Uncoated',
    coatingWithLevel: '{agent} {min}-{max}%',
    shelfLife: 'Shelf life {months} months',
  },

  properties: {
    caption: 'Typical chemical and physical properties of calcium carbonate, with test methods',
    columnParameter: 'Parameter',
    columnValue: 'Typical value',
    columnMethod: 'Test method',
    familyLevelNote:
      'These values are stated at product-family level. A Certificate of Analysis with the actual values is issued for every production batch.',
  },

  parameters: {
    'caco3-purity': 'CaCO₃ purity',
    whiteness: 'Whiteness (R457)',
    fe2o3: 'Iron oxide Fe₂O₃',
    sio2: 'Silica SiO₂',
    mgo: 'Magnesium oxide MgO',
    moisture: 'Moisture at 105 °C',
    ph: 'pH',
    'bulk-density': 'Bulk density',
    'oil-absorption': 'Oil absorption (DOP)',
    'mohs-hardness': 'Mohs hardness',
  },

  applications: {
    construction: 'Construction materials',
    'drilling-muds': 'Drilling muds',
    asphalt: 'Asphalt',
    'tile-adhesives': 'Tile adhesives',
    'basic-paints': 'Basic paints',
    rubber: 'Rubber',
    'pvc-pipes': 'PVC pipes',
    cables: 'Cable compounds',
    'emulsion-paints': 'Emulsion paints',
    'pvc-fittings': 'PVC fittings',
    masterbatch: 'Filler masterbatch',
    'pe-films': 'PE films',
    'high-end-masterbatch': 'High-end masterbatch',
    'fine-coatings': 'Fine coatings',
  },

  sectors: {
    plastics: 'Plastics & masterbatch',
    'paints-construction': 'Paints, coatings & construction',
    'oil-gas': 'Drilling fluids - oil & gas',
    rubber: 'Rubber & elastomers',
    paper: 'Paper & paperboard',
  },

  packaging: {
    'paper-valve-bag-25kg': '25 kg paper valve bags, palletised and wrapped',
    'jumbo-bag': 'Jumbo bags, 1000-1250 kg, with inner liner',
    'bulk-tanker': 'Bulk silo tankers, pneumatic discharge',
  },

  coatingAgents: {
    'stearic-acid': 'Stearic acid',
  },

  units: {
    micron: 'µm',
    mesh: 'mesh',
    months: 'months',
    percent: '%',
  },

  standards: {
    'iso-9001': 'ISO 9001',
    'iso-14001': 'ISO 14001',
    'iso-45001': 'ISO 45001',
    saso: 'SASO',
    reach: 'REACH',
    rohs: 'RoHS',
  },

  standardScopes: {
    'iso-9001': 'Quality management',
    'iso-14001': 'Environmental management',
    'iso-45001': 'Occupational health and safety',
    saso: 'Saudi Standards, Metrology and Quality Organization compliance',
    reach: 'REACH compliant',
    rohs: 'Free of restricted hazardous substances',
  },

  documents: {
    tds: 'Technical Data Sheet (TDS)',
    msds: 'Safety Data Sheet (MSDS/SDS)',
    coa: 'Certificate of Analysis (COA)',
  },

  documentDescriptions: {
    tds: 'Typical chemical and physical properties for the grade, with the test method for each value.',
    msds: 'Handling, storage, transport and emergency response data.',
    coa: 'Measured values for a specific production batch, issued with the shipment.',
  },

  processSteps: {
    feed: 'Feed',
    milling: 'Milling',
    classification: 'Classification',
    'surface-treatment': 'Surface treatment',
    'quality-control': 'Quality control',
    packaging: 'Packaging',
  },

  processStepDetails: {
    feed: 'High-purity limestone and marble.',
    milling: 'Precision mechanical milling sets the coarse and medium range, 200 to 500 mesh.',
    classification:
      'Air classification controls median particle size down to 2500 mesh, a D50 of 1.8 microns.',
    'surface-treatment': 'Stearic acid at 0.8% to 1.2% on the micronized grades.',
    'quality-control':
      'Purity, whiteness, moisture and oil absorption tested to the published ISO methods.',
    packaging: '25 kg valve bags, jumbo bags, or bulk tankers.',
  },

  faqQuestions: {
    'gcc-vs-pcc': 'What is the difference between GCC and PCC?',
    'why-coated': 'Why is calcium carbonate coated with stearic acid?',
    'choose-grade': 'How do I choose the right grade for my application?',
    'storage-shelf-life': 'How should the material be stored, and what is its shelf life?',
  },

  faqAnswers: {
    'gcc-vs-pcc':
      'Ground calcium carbonate (GCC) is produced by precision mechanical milling of high-purity limestone and marble, giving chemical stability, high whiteness and low impurity levels. Precipitated calcium carbonate (PCC) is synthesised chemically by recarbonation of slaked lime, which allows precise control of crystal morphology and particle size in the sub-micron range.',
    'why-coated':
      'Stearic acid treatment makes the particle surface hydrophobic. On the line that means better dispersion in polymers, lower moisture pick-up, faster throughput on extrusion, and reduced machine wear. The coating level is controlled between 0.8% and 1.2%.',
    'choose-grade':
      'Start from the application, then read across to the particle size it needs. The coarse grades at 200 to 400 mesh serve construction, drilling muds and tile adhesives; 800 mesh serves PVC pipe, cable compound and emulsion paints; the coated 1250 and 2500 mesh grades serve filler masterbatch, PE film and fine coatings.',
    'storage-shelf-life':
      'Store in a cool, dry, ventilated warehouse, on pallets, away from direct sunlight and ambient humidity. Shelf life is 24 months for uncoated grades and 12 months for surface-coated grades.',
  },

  contactChannels: {
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    location: 'Location',
  },

  sections: {
    certificationsHeading: 'Standards and compliance',
    certificationsIntro:
      'Quality, environmental and safety operations are run to certified ISO standards, with Saudi and European regulatory compliance alongside them.',
    certificationsColumnStandard: 'Standard',
    certificationsColumnScope: 'Scope',
    certificationsColumnCertificate: 'Certificate number',
    certificatePending: 'On file, pending publication',

    packagingHeading: 'Packaging and storage',
    packagingIntro:
      'Three formats, covering manual intake, forklift handling and direct pneumatic discharge.',
    storageHeading: 'Storage conditions',
    storageBody:
      'Cool, dry, ventilated warehouse, on pallets, away from direct sunlight and ambient humidity.',
    shelfLifeUncoated: '24 months, uncoated grades',
    shelfLifeCoated: '12 months, surface-coated grades',

    processHeading: 'From feed to shipment',
    processIntro:
      'Six stages the material passes through. Each one sets a value published on the data sheet: the mesh, the D50, the coating level, the test results.',

    logisticsHeading: 'Coverage and supply',
    logisticsIntro: 'From Jeddah to Saudi Arabia and the wider GCC.',
    logisticsHqLabel: 'Headquarters',
    logisticsMarketsLabel: 'Markets',
    logisticsLeadTimePending: 'Lead times by city are pending documentation.',

    documentsHeading: 'Technical documents',
    documentsIntro:
      'Three controlled documents per grade. A Certificate of Analysis carrying the measured values is issued for every production batch.',
    documentRequest: 'Request the document',
    documentOnRequest: 'Sent on request',

    faqHeading: 'Technical questions',
    faqIntro:
      'Direct answers to what formulation engineers and buyers ask before requesting a sample.',

    contactHeading: 'Contact',
    contactIntro: 'For technical enquiries and quotations.',
    contactPending: 'Contact details are pending documentation.',

    rfqTeaserHeading: 'Request a quote against a specification',
    rfqTeaserBody:
      'State the grade, the tonnage, the application and the destination. The quote comes back with the technical data for that grade attached.',

    applicationGradesLabel: 'Recommended grades',
    applicationViewSector: 'Sector detail',

    gradeMatrixFilterLabel: 'Filter by surface coating',
    gradeMatrixFilterAll: 'All',
    gradeMatrixShowing: 'Showing {count} of {total} grades',
    gradeMatrixEmpty: 'No grade matches this filter.',
    gradeMatrixReset: 'Clear filter',
    gradeMatrixScrollHint: 'Scroll sideways for the remaining columns',
  },

  ui: {
    close: 'Close',
    dismiss: 'Dismiss',
    loading: 'Loading',
    expand: 'Expand',
    collapse: 'Collapse',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    sortNone: 'Not sorted',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pagination: 'Pagination',
    pageStatus: 'Page {page} of {total}',
    breadcrumb: 'Breadcrumb',
    required: 'Required',
    optional: 'Optional',
    chooseFile: 'Choose a file',
    noFileChosen: 'No file chosen',
    infoLabel: 'Information',
    successLabel: 'Success',
    warningLabel: 'Warning',
    dangerLabel: 'Error',
  },

  footer: {
    headquarters: 'Headquarters: Jeddah, Saudi Arabia',
    marketsServed: 'Markets served: Saudi Arabia and the wider GCC',
    complianceHeading: 'Standards',
    navHeading: 'Site',
    productsHeading: 'Grades',
    dataProvenance:
      'Published technical values are typical values, stated with their test methods. A Certificate of Analysis accompanies every production batch.',
    rights: '© {year} KMIT. All rights reserved.',
  },

  styleguide: {
    title: 'Design system reference | KMIT',
    description: 'Internal page presenting the design tokens and base components. Not indexed.',
    h1: 'Design system reference',
    intro:
      'An internal, non-indexed page. It is built out in Phase 2 to present the tokens and components in both directions.',
  },

  notFound: {
    title: 'Page not found | KMIT',
    h1: 'Page not found',
    body: 'The address you requested is not available. Check the URL, or start again from the home page.',
    backHome: 'Back to the home page',
  },
} satisfies Content;

export default en;
