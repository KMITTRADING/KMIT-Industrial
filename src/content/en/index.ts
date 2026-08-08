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
    facility: 'Sustainability and facility',
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
    'plastics-masterbatch': 'Plastics and masterbatch',
    'paints-coatings-construction': 'Paints, coatings and construction',
    'oil-gas-drilling': 'Drilling fluids for oil and gas',
    'rubber-elastomers': 'Rubber and elastomers',
    'paper-paperboard': 'Paper and paperboard',
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

  sectorProblems: {
    'plastics-masterbatch':
      'An unspecified cheap filler costs more than it saves: it forces re-trials, and poor dispersion shows up as screen-pack pressure and film gauge variation.',
    'paints-coatings-construction':
      'Titanium dioxide is the most expensive component in the formulation, and reducing it without losing opacity requires an extender with controlled whiteness and particle size.',
    'oil-gas-drilling':
      'Fluid loss into a permeable formation means formation damage and lost time on the rig, and a bridging agent that does not dissolve in acid leaves the problem in the well after drilling.',
    'rubber-elastomers':
      'A compound loaded with coarse filler loses tear and abrasion resistance, and particle size variation moves vulcanisation time from batch to batch.',
    'paper-paperboard':
      'Virgin cellulose fibre is the single largest cost in papermaking, and replacing part of it requires a filler that raises brightness and opacity without damaging ink receptivity.',
  },

  sectorValue: {
    'plastics-masterbatch':
      'Raises flexural modulus and impact strength, improves thermal conductivity so cooling cycles shorten, lowers formulation cost, and improves surface opacity and printability.',
    'paints-coatings-construction':
      'A cost-effective TiO₂ extender that delivers opacity, rheology and gloss or matting control, and improved scrub and abrasion resistance.',
    'oil-gas-drilling':
      'A sized bridging agent for fluid-loss control and formation-damage prevention, fully acid-soluble for post-drilling wellbore cleanup.',
    'rubber-elastomers':
      'Increases tensile, tear and abrasion resistance, and optimises vulcanisation processing time.',
    'paper-paperboard':
      'Raises brightness, opacity and smoothness, improves ink receptivity, and replaces part of the costly virgin cellulose fibre.',
  },

  sectorProcess: {
    'plastics-masterbatch':
      'The micronized grades carry a stearic acid coating at 0.8% to 1.2%, which makes the particle surface hydrophobic: better dispersion in the polymer, lower moisture pick-up, faster throughput on extrusion, and reduced machine wear.',
    'paints-coatings-construction':
      'Oil absorption runs 14 to 24 g/100g to ISO 787-5, which sets how much binder the formulation needs. pH is 8.5 to 9.5 to ISO 787-9.',
    'oil-gas-drilling':
      'Size is selected against the permeability of the target formation. A Mohs hardness of 3.0 means low wear on mud pumps compared with harder bridging materials.',
    'rubber-elastomers':
      'Moisture is held at or below 0.20% at 105 °C to ISO 787-2, which matters for avoiding porosity during vulcanisation.',
    'paper-paperboard':
      'Whiteness runs 95.0% to 98.5% to ISO 2470 and iron oxide stays at or below 0.03%, which together set the brightness ceiling achievable in the sheet.',
  },

  sectorGradeReasoning: {
    'plastics-masterbatch':
      'The finer grades belong here: the smaller the median particle size, the less it costs the mechanical properties at the same loading. The coated grades are specifically what masterbatch and PE film need.',
    'paints-coatings-construction':
      'The coarse and medium range serves construction materials and tile adhesives, while emulsion paints and fine coatings need a finer range to hold opacity and texture.',
    'oil-gas-drilling':
      'The coarse grade is the one used in drilling fluids: a bridging agent needs a particle size matched to the pore size of the formation, not the finest powder available.',
    'rubber-elastomers':
      'The medium range is the usual choice in rubber compounding, balancing tear resistance against ease of mixing.',
    // TODO(data): which grade serves paper and paperboard.
    'paper-paperboard':
      'The technical data documents this sector as a market served but does not tie a specific grade to it. A grade recommendation needs additional data from the plant.',
  },

  supplyArguments: {
    'in-kingdom': 'An in-Kingdom source',
    compliance: 'Documented compliance',
    'published-specification': 'A published specification',
    'packaging-match': 'Packaging that matches intake',
  },

  supplyArgumentDetails: {
    // TODO(data): lead time per city and per packaging format.
    'in-kingdom':
      'Supplied from Jeddah to Saudi Arabia and the wider GCC. Lead times by city are pending documentation and will not be quoted before they are confirmed.',
    compliance:
      'ISO 9001 for quality management, ISO 14001 for environmental management and ISO 45001 for occupational health and safety, alongside SASO, REACH and RoHS compliance.',
    'published-specification':
      'A minimum 98.5% purity to ISO 3262-1 and 95.0 to 98.5% whiteness to ISO 2470, with every published value stated alongside the method that produced it.',
    'packaging-match':
      '25 kg valve bags, jumbo bags from 1000 to 1250 kg, and bulk silo tankers discharging pneumatically straight into plant silos.',
  },

  pages: {
    productsTitle: 'Calcium Carbonate Grades | KMIT',
    productsDescription:
      'Five grades from 200 to 2500 mesh with median particle size, surface coating and applications, filterable and comparable.',
    productsH1: 'Grades and particle size',
    productsAnswerFirst:
      'Five ground calcium carbonate grades cover 200 mesh to 2500 mesh, a median particle size (D50) running from 55 microns down to 1.8 microns. The two finest grades are stearic-acid coated at 0.8% to 1.2%. Filter the matrix by sector or by surface coating, or compare up to three grades side by side.',
    productsFilterHeading: 'Filter the matrix',
    productsFilterIndustry: 'Sector',
    productsFilterAllIndustries: 'All sectors',
    productsComparisonHeading: 'Compare grades',
    productsComparisonIntro:
      'Select up to three grades to see their specifications side by side. The selection is held in the URL, so the link can be sent to a colleague as it is.',
    productsComparisonSelect: 'Add to comparison',
    productsComparisonLimit: 'Three grades maximum. Remove one to add another.',
    productsComparisonClear: 'Clear comparison',
    productsComparisonEmpty: 'No grades selected for comparison yet.',

    gradeTitleTemplate: '{code} | Calcium Carbonate {mesh} Mesh',
    gradeDescriptionTemplate:
      '{code}: {mesh} mesh, median particle size {d50} microns, with chemical values, test methods and applications.',
    gradeAnswerFirstTemplate:
      '{code} is a ground calcium carbonate at {mesh} mesh with a median particle size (D50) of {d50} microns. {coating} It serves {applications}. The values below are typical for the product family, each stated with the test method that produced it, and a Certificate of Analysis carrying the measured values is issued with every production batch.',
    gradePsdHeading: 'Where this grade sits in the range',
    gradePsdIntro:
      'Each bar is one grade median particle-size range, on a logarithmic scale. The grade on this page is highlighted.',
    gradePsdCaption: 'Median particle size (D50) ranges in microns, per grade',
    gradePsdAxisSize: 'Median particle size (microns)',
    gradePsdAxisGrade: 'Grade',
    gradePropertiesHeading: 'Typical properties and test methods',
    gradeApplicationsHeading: 'Typical applications',
    gradePackagingHeading: 'Packaging and storage',
    gradeDocumentsHeading: 'Technical documents',
    gradeFaqHeading: 'Technical questions about this grade',
    gradeRelatedHeading: 'Adjacent grades',
    gradeRelatedFiner: 'Finer',
    gradeRelatedCoarser: 'Coarser',
    gradeCoatingHeading: 'Surface coating',

    applicationsTitle: 'Industrial Applications | KMIT',
    applicationsDescription:
      'Five industrial sectors that use calcium carbonate, with the technical problem the filler solves and the recommended grades.',
    applicationsH1: 'Sectors served',
    applicationsAnswerFirst:
      'Calcium carbonate serves five documented industrial sectors: plastics and masterbatch, paints and coatings and construction, drilling fluids, rubber and elastomers, and paper and paperboard. Each sector has a page setting out the technical problem the filler solves, what it adds to the formulation, the process considerations, and which grades are recommended and why.',

    sectorTitleTemplate: '{sector} | Calcium Carbonate',
    sectorDescriptionTemplate:
      'Calcium carbonate in {sector}: the technical problem, what the filler adds, process considerations, and recommended grades.',
    sectorProblemHeading: 'The technical problem',
    sectorValueHeading: 'What the filler adds',
    sectorProcessHeading: 'Process considerations',
    sectorGradesHeading: 'Recommended grades',
    sectorLoadingHeading: 'Loading levels',
    // TODO(data): recommended loading level per sector.
    sectorLoadingPending:
      'The technical data does not include recommended loading levels for this sector. The right level depends on the formulation and the line, and is settled with your team when a sample is requested.',

    facilityTitle: 'Sustainability and Facility | KMIT',
    facilityDescription:
      'The route from feed to shipment, the quality control laboratory, and the health, safety and environmental posture.',
    facilityH1: 'From feed to shipment',
    facilityAnswerFirst:
      'The material passes through six stages: feed, milling, air classification, surface treatment for the micronized grades, quality control, and packaging. Each stage sets a value published on the data sheet: the mesh, the median particle size, the coating level, the test results. Quality, environmental and safety management run to ISO 9001, ISO 14001 and ISO 45001.',
    facilityLabHeading: 'Quality control laboratory',
    facilityLabBody:
      'Ten properties are measured per batch to the published ISO methods: purity to ISO 3262-1, whiteness to ISO 2470 on an Elrepho, moisture to ISO 787-2, pH to ISO 787-9, bulk density to ISO 787-11, oil absorption to ISO 787-5, and iron, silica and magnesium oxides by XRF and AAS. A Certificate of Analysis carrying the measured values is issued with every batch.',
    facilityHseHeading: 'Health and safety',
    facilityHseBody:
      'Occupational health and safety runs to ISO 45001. The product is free of restricted hazardous substances under RoHS, is REACH compliant, and a Safety Data Sheet accompanies every delivery.',
    facilityEnvironmentHeading: 'Environmental management',
    facilityEnvironmentBody:
      'Environmental aspects are managed to ISO 14001. Calcium carbonate is a chemically inert mineral with a Mohs hardness of 3.0, and in papermaking it displaces virgin cellulose fibre.',

    resourcesTitle: 'Technical Documents | KMIT',
    resourcesDescription:
      'Library of technical data sheets, safety data sheets and certificates of analysis, filterable by grade and document type.',
    resourcesH1: 'Document library',
    resourcesAnswerFirst:
      'Three controlled documents per grade: the Technical Data Sheet carrying typical values with test methods, the Safety Data Sheet covering handling, storage and transport, and the Certificate of Analysis carrying the measured values for a specific production batch. Filter by grade or by document type, and request what you need.',
    resourcesFilterGrade: 'Grade',
    resourcesFilterType: 'Document type',
    resourcesFilterAll: 'All',
    resourcesEmpty: 'No document matches this filter.',
    // TODO(data): actual TDS / MSDS / COA PDF files.
    resourcesPendingNote:
      'The PDF files have not been supplied yet. Until they are, a requested document is emailed within one working day, and the full specification is published on each grade page and needs no request at all.',

    rfqTitle: 'Request a Quote | KMIT',
    rfqDescription:
      'State the grade, the tonnage, the application and the destination, and the quote comes back with the technical data attached.',
    rfqH1: 'Request a quote',
    rfqAnswerFirst:
      'The form is in three steps: what you need, where it goes, and who to reply to. You are not asked for a phone number before you know the destination is served, and you are not asked for detail you do not have yet. Optional fields are marked as optional, and any technical field can be answered with "not decided yet".',

    contactTitle: 'Contact | KMIT',
    contactDescription:
      'Technical and commercial enquiries for industrial calcium carbonate, from Jeddah to Saudi Arabia and the GCC.',
    contactH1: 'Contact',
    contactAnswerFirst:
      'Headquarters are in Jeddah, and the markets served are Saudi Arabia and the wider GCC. Technical enquiries concern the specification, grade selection and test methods; commercial enquiries concern pricing, quantities, packaging and supply. Contact numbers are pending documentation and will not be published before they are confirmed.',
    contactTechnicalHeading: 'Technical enquiry',
    contactTechnicalBody:
      'Grade selection, interpreting the specification values, test methods, loading levels, and requesting a sample for trial.',
    contactCommercialHeading: 'Commercial enquiry',
    contactCommercialBody:
      'Pricing, minimum order quantity, packaging format, destination, and supply scheduling.',
    contactHoursHeading: 'Working hours',
    // TODO(data): working hours, phone, WhatsApp, sales and technical email, full address.
    contactHoursPending: 'Working hours are pending documentation.',

    homeSupplyHeading: 'Why an in-Kingdom source',
    homeSupplyIntro:
      'Four reasons, each attached to a documented number or standard. Where no documented source exists, that is stated too.',
    homeGradeStripHeading: 'The grades',
    homeApplicationsHeading: 'Sectors served',
    homeApplicationsIntro:
      'Five sectors, each with a page setting out the technical problem and the recommended grades.',
    homeQualityHeading: 'Quality and compliance',
    homePackagingHeading: 'Packaging and logistics',
    homeCtaTds: 'Request a data sheet',

    errorTitle: 'Something went wrong | KMIT',
    errorH1: 'Something went wrong',
    errorBody:
      'This part of the page could not be rendered. Try again, or start from the home page.',
    errorRetry: 'Try again',
    loadingLabel: 'Loading',
  },

  rfqForm: {
    sectionRequirement: 'What you need',
    sectionDelivery: 'Where it goes',
    sectionContact: 'Contact details',
    sectionRequirementHint:
      'Grade, quantity and application. Choose "not decided yet" if the grade is still open.',
    sectionDeliveryHint:
      'City, country and packaging format, so the landed cost can be worked out.',
    sectionContactHint: 'Where to send the quote and the technical data with it.',

    labelGrade: 'Grade',
    labelTonnage: 'Estimated tonnage',
    labelApplication: 'Application',
    labelPackaging: 'Packaging format',
    labelCity: 'Destination city',
    labelCountry: 'Country',
    labelCertifications: 'Certifications required',
    labelStartDate: 'Target start date',
    labelCompany: 'Company',
    labelContactName: 'Contact name',
    labelEmail: 'Email',
    labelPhone: 'Phone',
    labelNotes: 'Notes',
    labelUpload: 'Specification sheet',

    hintGrade: 'If the grade is still open, choose the application and we will recommend one.',
    hintTonnage: 'In tonnes, per month or per order. Say which in the notes.',
    hintCertifications: 'For example ISO 9001, SASO or REACH.',
    hintStartDate: 'Approximate. It helps with supply scheduling.',
    hintNotes: 'Any constraint on the formulation or the line that we should know about.',
    hintUpload: 'PDF or image. Optional.',
    hintPhone: 'Include the country code.',

    placeholderSelect: 'Select',
    notSure: 'Not decided yet',

    errorRequired: 'This field is required.',
    errorEmail: 'Enter a valid email address, for example name@company.com',
    errorPhone: 'Digits, spaces and + only.',
    errorTonnage: 'Enter a number greater than zero.',
    errorTooLong: 'This is longer than allowed.',
    errorSummary: 'Check the fields marked below, then submit again.',

    submit: 'Send the request',
    submitting: 'Sending',
    continueToDelivery: 'Next: destination',
    continueToContact: 'Next: contact details',
    back: 'Back',

    successHeading: 'Your request has arrived',
    successBody: 'Keep the reference below. It is what we quote in our reply.',
    successReference: 'Reference',
    successNext1: 'Sales review the request and confirm grade and quantity availability.',
    successNext2: 'The quote comes back with the technical data sheet for the grade attached.',
    successNext3:
      'If the grade is still open, a technical engineer follows up to recommend the right one.',
    successAgain: 'Send another request',

    failureHeading: 'The request could not be sent',
    failureBody:
      'Nothing was submitted. Try again, and if it fails a second time send the details through the contact page.',
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
