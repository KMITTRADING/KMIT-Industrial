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
    defaultTitle: 'KMIT | Industrial Calcium Carbonate — Jeddah',
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
      'KMIT supplies ground calcium carbonate (GCC) and surface-coated grades from Jeddah to plastics, paint, construction and drilling-fluid plants across Saudi Arabia and the wider GCC. Grades run from 200 mesh to 2500 mesh — a median particle size (D50) of 55 microns down to 1.8 microns — at a minimum 98.5% CaCO₃ purity and 95.0–98.5% whiteness, tested to ISO 3262-1 and ISO 2470.',
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
    coatingWithLevel: '{agent} {min}–{max}%',
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
    'oil-gas': 'Drilling fluids — oil & gas',
    rubber: 'Rubber & elastomers',
    paper: 'Paper & paperboard',
  },

  packaging: {
    'paper-valve-bag-25kg': '25 kg paper valve bags, palletised and wrapped',
    'jumbo-bag': 'Jumbo bags, 1000–1250 kg, with inner liner',
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

  footer: {
    headquarters: 'Headquarters: Jeddah, Saudi Arabia',
    marketsServed: 'Markets served: Saudi Arabia and the wider GCC',
    compliance: 'ISO 9001 · ISO 14001 · ISO 45001 · SASO · REACH · RoHS',
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
