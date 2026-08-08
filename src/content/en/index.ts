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
    guides: 'Technical guides',
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
    columnShelfLife: 'Shelf life',
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

  imageAlt: {
    quarry:
      'Aerial view of an open-pit limestone quarry with stepped benches, haul trucks working the floor, and a crushing plant on the rim',
    plant:
      'Interior of a processing hall with stainless silos, classifier cones, conveying pipework and a control platform',
    milling:
      'Micronizing line: jet mill, air classifier and pressure gauges, with white powder discharging into a collection vessel',
    lab: 'Laboratory technician loading a powder sample into an analyser, with a particle-size distribution curve on the screen',
  },

  gradeFaqs: {
    'GCC-200': {
      'bridging-size': {
        question:
          'Why use a coarse 200 mesh grade as a bridging agent rather than a finer one?',
        answer:
          'A bridging agent works by sealing the pore throats of a permeable formation, so its particle size has to match the pore size. GCC-200 has a median particle size of 45 to 55 microns, which is the range that bridges rather than invades. A micronized powder passes straight through the pore network and deepens the damage instead of stopping it.',
      },
      'acid-solubility': {
        question: 'Is GCC-200 acid soluble for post-drilling wellbore cleanup?',
        answer:
          'Yes. Calcium carbonate is fully acid soluble, which is the reason it is specified as a bridging agent in the first place: the filter cake it builds during drilling is dissolved with an acid wash once the well is completed, and the formation permeability is restored. A bridging material that is not acid soluble leaves the damage in the well.',
      },
      'pump-wear': {
        question: 'What does GCC-200 do to mud pump and bit wear?',
        answer:
          'Calcium carbonate has a Mohs hardness of 3.0. Compared with harder bridging materials it is less abrasive on mud pump fluid ends, bit nozzles and the rest of the circulating system, which is a direct saving in maintenance hours on a rig running continuously.',
      },
      'construction-moisture': {
        question: 'What is the moisture specification, and why does it matter in dry mixes?',
        answer:
          'Moisture is held at or below 0.20% measured at 105 °C to ISO 787-2. In a cement-based dry mix, filler moisture starts hydration in the bag: it shortens shelf life, causes lumping, and moves the water demand of the finished mix. Storage in a cool, dry, ventilated warehouse holds the delivered figure.',
      },
      coating: {
        question: 'Is GCC-200 available surface coated?',
        answer:
          'No. Stearic acid surface treatment is applied to the micronized grades, GCC-1250 and GCC-2500, at 0.8% to 1.2%. Coating buys dispersion in a polymer melt and resistance to moisture pick-up, and neither is what a 45 to 55 micron bridging agent or construction filler is bought for. Coating GCC-200 would add cost without changing behaviour.',
      },
      'shelf-life': {
        question: 'What is the shelf life of GCC-200, and how should it be stored?',
        answer:
          'Twenty four months, which is the figure for all uncoated grades. Store on pallets in a cool, dry, ventilated warehouse, away from direct sunlight and ambient humidity. The limiting factor is moisture pick-up rather than chemical change: calcium carbonate is inert, and the specification that drifts first is the 0.20% moisture figure.',
      },
      packaging: {
        question: 'Which packaging formats are available for GCC-200?',
        answer:
          'Three formats are supplied across the range: 25 kg paper valve bags, palletised and shrink-wrapped; jumbo bags of 1000 to 1250 kg with a woven inner liner and four lifting loops; and bulk silo tankers discharging pneumatically into plant silos. Availability per grade is confirmed on the quotation.',
      },
      moq: {
        question: 'What is the minimum order quantity?',
        answer:
          'The minimum order quantity is not published. It depends on the grade, the packaging format and the destination, and quoting a figure that later turns out to be wrong wastes more of your time than not quoting one. State your tonnage on the quotation request and it comes back with the applicable minimum for that combination.',
      },
    },

    'GCC-400': {
      'tile-adhesive-role': {
        question: 'What does GCC-400 do in a tile adhesive?',
        answer:
          'It is the bulk of the dry mix. At 25 to 35 microns it fills the space between the cement particles, which controls the rheology of the wet mortar, the open time, and the slip resistance of a tile placed on a vertical surface. The alternative is more cement, which costs more and shrinks more.',
      },
      'rubber-properties': {
        question: 'What does GCC-400 change in a rubber compound?',
        answer:
          'It raises tensile strength, tear resistance and abrasion resistance, and it shortens vulcanisation processing time. The gain depends on the particle size being consistent: filler that varies between batches moves the cure time, which is why the median particle size is published as a controlled 25 to 35 micron range rather than a single nominal figure.',
      },
      'oil-absorption': {
        question: 'What is the oil absorption, and what does it mean for binder demand?',
        answer:
          'Oil absorption runs 14 to 24 g per 100 g measured to ISO 787-5. In a paint or an adhesive that figure sets how much binder the formulation needs to wet the filler: a higher value means more binder for the same loading, and binder is usually the most expensive part of the formulation after the pigment.',
      },
      ph: {
        question: 'What is the pH, and does it matter in a cementitious system?',
        answer:
          'pH is 8.5 to 9.5 measured to ISO 787-9. That is mildly alkaline and compatible with cement, which cures at a pH above 12. It is the reason calcium carbonate is used in cementitious mixes where an acidic filler would interfere with hydration, and it is also why the material acts as an acid buffer in a formulation.',
      },
      'vs-800': {
        question: 'When should I move from GCC-400 to GCC-800?',
        answer:
          'When the finish or the wall thickness needs it. GCC-400 sits at 25 to 35 microns and GCC-800 at 10 to 15 microns. In thin section, or on a surface that will be seen, the coarser grade shows as texture. PVC pipe, cable compound and emulsion paint are the usual point at which the step is made.',
      },
      whiteness: {
        question: 'What whiteness can I expect, and how is it measured?',
        answer:
          'Whiteness runs 95.0% to 98.5% measured as R457 on an Elrepho to ISO 2470. Iron oxide is held at or below 0.03% and that is what sets the ceiling: iron is the impurity that greys a filler, and a supplier who publishes a whiteness figure without an Fe₂O₃ figure has told you half of what you need.',
      },
      'moisture-porosity': {
        question: 'Does filler moisture cause porosity during vulcanisation?',
        answer:
          'It can. Water in the compound flashes to steam at cure temperature and leaves voids in the article. Moisture is held at or below 0.20% at 105 °C to ISO 787-2, which is the figure to check on the Certificate of Analysis if you are seeing porosity, alongside how the material has been stored on your site.',
      },
      coating: {
        question: 'Is a coated version of GCC-400 available?',
        answer:
          'No. Surface treatment is applied to GCC-1250 and GCC-2500 only. At 25 to 35 microns the particle surface area is low enough that dispersion is not the constraint it becomes in the micronized range, and a stearic acid coat would add cost without a matching change on the line.',
      },
    },

    'GCC-800': {
      'pvc-pipe-role': {
        question: 'What does GCC-800 do in a PVC pipe formulation?',
        answer:
          'It raises the flexural modulus, so the pipe holds its shape, and it improves thermal conductivity so heat leaves the extrudate faster and the cooling section runs shorter. At 10 to 15 microns it does that without the surface roughness a coarser grade would leave on the pipe bore.',
      },
      'cable-compound': {
        question: 'Why is an uncoated grade used in cable compounds?',
        answer:
          'Cable compounds are typically filled at a level where the uncoated surface disperses acceptably in the mixing cycle available, and the coating premium is not returned. The step to a coated grade is made when the loading rises or the line speed increases to the point where dispersion, not cost, is the limit.',
      },
      'emulsion-paint': {
        question: 'How much titanium dioxide can GCC-800 displace in an emulsion paint?',
        answer:
          'The displacement level is a formulation decision that depends on the opacity target, the sheen and the binder system, and the technical data does not publish a figure. What the data does give you is the input: 95.0% to 98.5% whiteness to ISO 2470, oil absorption of 14 to 24 g per 100 g, and Fe₂O₃ at or below 0.03%. Settle the level on a trial.',
      },
      dispersion: {
        question: 'Does GCC-800 disperse adequately without a surface coating?',
        answer:
          'In the applications it is specified for, yes. Uncoated calcium carbonate disperses in a water-borne paint without difficulty, and in PVC and cable compounds the mixing energy available is usually sufficient at 10 to 15 microns. Dispersion becomes the binding constraint in the micronized range, which is why coating starts at GCC-1250.',
      },
      'vs-1250': {
        question: 'When is the step up to the coated GCC-1250 worth it?',
        answer:
          'When you are extruding thin section, running a filled masterbatch, or fighting screen pack pressure. GCC-1250 is 4.5 to 6.0 microns and carries a stearic acid coat at 0.8% to 1.2%, which changes dispersion behaviour in a polymer melt. For pipe, cable and emulsion paint at normal loadings, GCC-800 is the grade the application asks for.',
      },
      'silica-wear': {
        question: 'Will GCC-800 wear the screw and die?',
        answer:
          'Calcium carbonate has a Mohs hardness of 3.0 and is not itself an abrasive concern in an extruder. The wear risk in any mineral filler is the hard silica fraction, and SiO₂ is held at or below 0.20% measured by XRF. That figure is the one to compare when a supplier quotes only purity.',
      },
      'shelf-life': {
        question: 'What is the shelf life, and does it differ from the coated grades?',
        answer:
          'Twenty four months, against twelve months for the surface-coated grades. Uncoated material has no organic layer to degrade, so the constraint is storage: keep it on pallets in a cool, dry, ventilated warehouse, away from direct sunlight and ambient humidity, and the 0.20% moisture figure holds.',
      },
      loading: {
        question: 'What loading level should I run?',
        answer:
          'The technical data does not publish recommended loading levels, and a figure quoted without knowing your polymer, your line and your specification would be a guess. Loading is settled on a trial with a sample. State the application on the quotation request and the technical team works through it with your formulator.',
      },
    },

    'GCC-1250': {
      'coating-level': {
        question: 'What does a stearic acid coating at 0.8% to 1.2% actually mean?',
        answer:
          'Stearic acid is chemisorbed onto the particle surface, turning it from hydrophilic to hydrophobic. The 0.8% to 1.2% figure is the mass of stearic acid relative to the calcium carbonate. It is quoted as a controlled range rather than a single number because coating is a process with tolerance, and a supplier who states one figure is stating a target, not a result.',
      },
      'why-range-matters': {
        question: 'Why does coating consistency matter more than coating level?',
        answer:
          'Because your line is qualified against a behaviour, not a number. Under-coated material disperses poorly and shows as screen pack pressure and gels; over-coated material bleeds free stearic acid, which plates out on tooling and can affect printability and weld strength. A controlled band is what keeps the two failure modes off the line.',
      },
      'moisture-pickup': {
        question: 'How does the coating change moisture pick-up in storage?',
        answer:
          'The hydrophobic surface resists water, so coated material picks up less atmospheric moisture than uncoated material stored the same way. That matters in PVC and PE processing, where water in the melt shows as voids and surface defects. Delivered moisture is at or below 0.20% at 105 °C to ISO 787-2.',
      },
      'screen-pack': {
        question: 'Will GCC-1250 raise screen pack pressure on my extruder?',
        answer:
          'Poorly dispersed filler does, and that is what the surface treatment addresses: coated particles wet out into the polymer melt rather than holding together as agglomerates that the screen then catches. If pressure rises after a filler change, the two things to check are the coating consistency of the delivered batch and the dispersive energy of your mixing section.',
      },
      'pe-film': {
        question: 'Is GCC-1250 suitable for blown PE film, and what limits the gauge?',
        answer:
          'It is specified for PE films. Gauge is limited by the largest particle in the distribution rather than the median: a 4.5 to 6.0 micron D50 is comfortable in thin film, but film quality tracks the top end of the distribution and the consistency of the coat. Both are the reason the Certificate of Analysis matters on every batch.',
      },
      'shelf-life-coated': {
        question: 'Why is the shelf life 12 months rather than 24?',
        answer:
          'The mineral does not change, but the stearic acid layer is organic and does degrade over time, and that layer is what you bought. Twelve months is the figure for all surface-coated grades against twenty four months uncoated. Storage conditions are the same: cool, dry, ventilated, on pallets, out of direct sunlight.',
      },
      substitution: {
        question: 'Can GCC-1250 substitute for an imported coated grade I already run?',
        answer:
          'On paper, if the incumbent sits at a comparable median particle size and coating level. In practice a filler change is a re-qualification, which costs lab time and line time. The way to reduce that cost is to compare the full specification with test methods first, then run a sample, rather than switching on a price.',
      },
      'vs-2500': {
        question: 'When should I specify GCC-2500 instead?',
        answer:
          'When the application is high-end masterbatch or a fine coating where 4.5 to 6.0 microns is still too coarse. GCC-2500 sits at 1.8 to 2.5 microns with the same 0.8% to 1.2% stearic acid coat. Finer material costs more to mill and needs more dispersive energy, so specify it where the finish demands it rather than by default.',
      },
    },

    'GCC-2500': {
      'what-it-buys': {
        question: 'What does a 1.8 to 2.5 micron median particle size buy me?',
        answer:
          'Surface finish and mechanical performance at high loading. The finer the filler, the less it costs the mechanical properties of the compound at the same loading level, and the smoother the surface it leaves. GCC-2500 is the finest grade in the range and is specified for high-end masterbatch and fine coatings.',
      },
      'high-loading': {
        question: 'Can GCC-2500 be run at high loading in a filler masterbatch?',
        answer:
          'High loading is what the grade exists for: a fine, surface-treated filler is what allows a masterbatch to carry a high mineral fraction without losing impact strength or dispersion quality. The achievable level depends on your carrier resin and compounding line, and is settled on a trial rather than quoted from a table.',
      },
      'dispersion-energy': {
        question: 'Does a finer grade need more dispersion energy?',
        answer:
          'Yes. Surface area rises as particle size falls, so there is more interface to wet out and more tendency to agglomerate. That is precisely why the two finest grades carry a stearic acid coat at 0.8% to 1.2%. If you move from GCC-1250 to GCC-2500 and keep the mixing profile unchanged, dispersion is the first thing to check.',
      },
      'cost-premium': {
        question: 'When is GCC-2500 worth the premium over GCC-1250?',
        answer:
          'When the surface finish or the loading level requires it. Milling to 2500 mesh costs more energy per tonne than milling to 1250, and that shows in the price. If your application is standard filler masterbatch, PVC fittings or PE film, GCC-1250 at 4.5 to 6.0 microns is the grade specified for it and the finer grade is money spent on a property you are not using.',
      },
      'bulk-density': {
        question: 'What is the bulk density, and does it affect feeding and conveying?',
        answer:
          'Bulk density runs 0.7 to 1.3 g/cm³ measured to ISO 787-11, stated across the product family. Fine powders sit toward the lower end, which affects volumetric feeder settings, silo sizing and pneumatic conveying velocity. Check the figure on the Certificate of Analysis before commissioning a feeder against a nominal value.',
      },
      'fine-coatings': {
        question: 'What does GCC-2500 do in a fine coating?',
        answer:
          'It extends the titanium dioxide, controls rheology, and sets gloss or matting depending on the loading. Whiteness of 95.0% to 98.5% to ISO 2470 and iron oxide at or below 0.03% are what allow a coating to keep its colour, and oil absorption of 14 to 24 g per 100 g to ISO 787-5 is what sets binder demand.',
      },
      'shelf-life-coated': {
        question: 'What is the shelf life of GCC-2500?',
        answer:
          'Twelve months, the figure for all surface-coated grades, against twenty four months for uncoated. The stearic acid layer is the part that ages. Store on pallets in a cool, dry, ventilated warehouse, away from direct sunlight and ambient humidity, and order against your consumption rather than building a long buffer.',
      },
      'pcc-alternative': {
        question: 'When is precipitated calcium carbonate the right answer instead?',
        answer:
          'When the application needs controlled crystal morphology or a sub-micron particle size, which is what the precipitation route gives and milling cannot. GCC-2500 is the finest ground grade at 1.8 to 2.5 microns. Below that, or where a specific crystal habit is specified, PCC is the correct product rather than a finer grind.',
      },
    },
  },

  sectorFaqs: {
    'plastics-masterbatch': {
      'which-grade': {
        question: 'Which grade should a plastics or masterbatch plant specify?',
        answer:
          'GCC-800 at 10 to 15 microns for PVC pipe and cable compound, GCC-1250 at 4.5 to 6.0 microns for PVC fittings, filler masterbatch and PE film, and GCC-2500 at 1.8 to 2.5 microns for high-end masterbatch. The two finest grades carry a stearic acid coat at 0.8% to 1.2%, which is what makes them dispersible in a polymer melt.',
      },
      'coated-required': {
        question: 'Do I need a coated grade for plastics?',
        answer:
          'For melt processing, usually yes above a certain fineness and loading. The stearic acid layer makes the particle hydrophobic, which improves dispersion in the polymer, lowers moisture pick-up, raises throughput on extrusion and reduces machine wear. Below that, at pipe and cable loadings, GCC-800 uncoated is what the application is specified with.',
      },
      'impact-strength': {
        question: 'Does calcium carbonate reduce impact strength?',
        answer:
          'Well dispersed fine calcium carbonate raises flexural modulus and impact strength rather than lowering it. What lowers impact strength is a poorly dispersed or coarse filler, where agglomerates act as crack initiation sites. That is a dispersion problem and a particle size problem, and both are specification questions before they are formulation questions.',
      },
      'cooling-cycle': {
        question: 'How does filler loading affect cycle time?',
        answer:
          'Calcium carbonate conducts heat better than the polymer it replaces, so a filled compound loses heat faster. On injection moulding that shortens the cooling phase, and on extrusion it lets the cooling section run shorter or faster. It is one of the few filler effects that shows up directly as output per hour rather than as cost per kilogram.',
      },
      dispersion: {
        question: 'What causes dispersion problems after a filler change?',
        answer:
          'Three things, in order of frequency: coating level outside the qualified band, a mixing profile carried over unchanged from a coarser grade, and moisture picked up in storage. Coating is controlled at 0.8% to 1.2% and moisture at or below 0.20% to ISO 787-2. Check the Certificate of Analysis for the delivered batch before changing the line.',
      },
      printability: {
        question: 'Does filler affect surface opacity and printability?',
        answer:
          'It improves both. Calcium carbonate raises surface opacity, which matters in film and in thin-wall mouldings, and it gives the surface enough tooth to accept ink. Over-coated material is the exception: free stearic acid at the surface can interfere with ink adhesion, which is one more reason the coating band is controlled.',
      },
      loading: {
        question: 'What loading level is recommended?',
        answer:
          'The technical data does not publish recommended loading levels per sector, and a number given without knowing your resin, your line and your specification would be invention rather than advice. It is settled on a trial. Request a sample with the application stated, and the technical team works the level through with your formulator.',
      },
    },

    'paints-coatings-construction': {
      'tio2-replacement': {
        question: 'How much titanium dioxide can calcium carbonate replace?',
        answer:
          'Enough to matter, and the exact level is a formulation decision rather than a published constant. Titanium dioxide is among the most expensive components in a paint formulation, and an extender with controlled whiteness and particle size lets you carry part of the opacity load. The inputs are published: 95.0% to 98.5% whiteness to ISO 2470 and Fe₂O₃ at or below 0.03%.',
      },
      opacity: {
        question: 'Does an extender cost me opacity?',
        answer:
          'Beyond a certain replacement level, yes, which is why extension is a trial rather than a substitution. Below it, calcium carbonate contributes to opacity by spacing the titanium dioxide particles so more of each one is optically effective. Whiteness and iron content are what determine how far that goes.',
      },
      'oil-absorption': {
        question: 'How does oil absorption affect the formulation?',
        answer:
          'Oil absorption is 14 to 24 g per 100 g measured to ISO 787-5, and it sets binder demand: the higher the figure, the more binder is needed to wet the filler at a given loading. Since binder is usually the most expensive component after the pigment, this is the number that decides whether an extender saves money in practice.',
      },
      'scrub-resistance': {
        question: 'What does calcium carbonate do to scrub and abrasion resistance?',
        answer:
          'It improves both, which is why it is specified in washable emulsion paints rather than only as a cost reduction. The mineral is harder than the dried binder film and carries part of the mechanical load at the surface. Mohs hardness is 3.0, hard enough to resist abrasion and soft enough not to abrade the substrate or the applicator.',
      },
      'which-grade': {
        question: 'Which grade suits paints, coatings and construction materials?',
        answer:
          'GCC-200 and GCC-400 for construction materials, tile adhesives, asphalt and basic paints, where 25 to 55 microns is the working range. GCC-800 at 10 to 15 microns for emulsion paints, and GCC-2500 at 1.8 to 2.5 microns for fine coatings where the finish will be seen and the gloss level is specified.',
      },
      ph: {
        question: 'Is the pH compatible with cementitious systems?',
        answer:
          'Yes. pH is 8.5 to 9.5 measured to ISO 787-9, mildly alkaline and compatible with cement hydration, which runs above pH 12. In a wall putty, tile adhesive or joint filler the material is chemically inert in the matrix, and it acts as an acid buffer where the formulation needs one.',
      },
    },

    'oil-gas-drilling': {
      'bridging-size': {
        question: 'How is the bridging particle size selected?',
        answer:
          'Against the pore throat size of the target formation, not against the finest powder available. GCC-200 has a median particle size of 45 to 55 microns, which bridges rather than invades. Too fine and the material passes into the formation and deepens the damage; too coarse and it never seats in the pore throat at all.',
      },
      'acid-solubility': {
        question: 'Is the bridging agent fully acid soluble?',
        answer:
          'Yes. Calcium carbonate dissolves completely in acid, so the filter cake built during drilling is removed with an acid wash at completion and the formation permeability is restored. This is the property that distinguishes it from barite and other insoluble weighting and bridging materials, which stay in the well.',
      },
      'wbm-obm': {
        question: 'Does it work in both water-based and oil-based mud?',
        answer:
          'The technical data documents use in water-based muds and in synthetic or oil-based muds. Calcium carbonate is chemically inert in both systems. What changes between them is the wetting behaviour and the additive package around it, which is a mud engineering question rather than a material specification question.',
      },
      'formation-damage': {
        question: 'How does bridging prevent formation damage?',
        answer:
          'Fluid loss into a permeable formation carries solids and filtrate into the pore network, and that is the damage. A correctly sized bridging agent seals the pore throats at the wellbore face and builds a thin, low-permeability filter cake, so the loss stops at the wall rather than continuing into the reservoir.',
      },
      'pump-wear': {
        question: 'What does it do to circulating system wear?',
        answer:
          'Calcium carbonate has a Mohs hardness of 3.0, which is low. Against harder bridging and weighting materials that is a measurable reduction in wear on mud pump fluid ends, bit nozzles, shaker screens and the rest of the circulating system, on a rig where that equipment runs continuously.',
      },
      'which-grade': {
        question: 'Which grade is used in drilling fluids?',
        answer:
          'GCC-200, at 200 mesh and a median particle size of 45 to 55 microns, uncoated. It is the coarse end of the range and that is deliberate: bridging is the one application where the finest grade is the wrong answer. Purity is at least 98.5% to ISO 3262-1, which is what makes the acid wash complete.',
      },
    },

    'rubber-elastomers': {
      'tensile-tear': {
        question: 'What does calcium carbonate change in a rubber compound?',
        answer:
          'It increases tensile strength, tear resistance and abrasion resistance, and it optimises vulcanisation processing time. It is specified in tyres, conveyor belts, technical hoses, footwear soles and rubber flooring, where it works both as a reinforcing filler and as a way of carrying volume at a lower cost than polymer.',
      },
      'vulcanisation-time': {
        question: 'How does filler affect cure time?',
        answer:
          'Consistent filler holds cure time steady; inconsistent filler moves it batch to batch, which is the failure that costs a compounder the most. This is why median particle size is published as a controlled range and why a Certificate of Analysis is issued per batch rather than a single specification sheet for the product.',
      },
      'moisture-porosity': {
        question: 'Can filler moisture cause porosity in the vulcanised article?',
        answer:
          'Yes. Water in the compound flashes to steam at cure temperature and leaves voids. Moisture is held at or below 0.20% measured at 105 °C to ISO 787-2. If porosity appears after a filler change, check the delivered moisture figure on the Certificate of Analysis and how the material has been stored on your site.',
      },
      'which-grade': {
        question: 'Which grade suits rubber compounding?',
        answer:
          'GCC-400, at 400 mesh and a median particle size of 25 to 35 microns, uncoated. The medium range balances tear resistance against ease of mixing: finer filler reinforces more but demands more mixing energy and raises compound viscosity, and coarser filler mixes easily but costs tear and abrasion performance.',
      },
      'coated-needed': {
        question: 'Is a surface-coated grade needed in rubber?',
        answer:
          'Not in the grade specified for it. Surface treatment is applied to GCC-1250 and GCC-2500, and it exists to solve dispersion and moisture behaviour in polymer melt processing. At 25 to 35 microns in a rubber mixing cycle the uncoated surface disperses in the energy available, and the coating premium is not returned.',
      },
      loading: {
        question: 'What loading level should a compound carry?',
        answer:
          'The technical data does not publish loading levels for rubber, and the right level depends on the elastomer, the cure system and the property target you are holding. It is settled on a trial with a sample rather than read off a table. State the compound on the quotation request and the technical team works it through.',
      },
    },

    'paper-paperboard': {
      'wet-end-vs-coating': {
        question: 'Is calcium carbonate used at the wet end or as a coating pigment?',
        answer:
          'Both. As a wet-end filler it is retained in the sheet and replaces part of the fibre; as a surface coating pigment it sits on the sheet and sets the printing surface. The technical data documents both uses for graphic paper and packaging board, and the requirements differ: retention matters for one, particle size distribution for the other.',
      },
      brightness: {
        question: 'What brightness can the filler support?',
        answer:
          'Whiteness is 95.0% to 98.5% measured as R457 on an Elrepho to ISO 2470, and iron oxide is held at or below 0.03% measured by AAS or XRF. Iron is what greys a mineral filler, so the two figures have to be read together: whiteness alone, quoted without an iron figure, does not tell you where the sheet will land.',
      },
      'fibre-replacement': {
        question: 'How much virgin fibre can it replace?',
        answer:
          'The level is a papermaking decision, set by the strength specification of the sheet and the retention system on the machine, and the technical data does not publish a figure. What it does establish is why the substitution is made: virgin cellulose fibre is a costly input and calcium carbonate carries part of the volume at a fraction of it.',
      },
      'ink-receptivity': {
        question: 'Does the filler affect ink receptivity?',
        answer:
          'It improves it. Calcium carbonate raises the smoothness and opacity of the sheet and gives the surface a structure that accepts ink, which is why it is used as a coating pigment as well as a filler. The gain in brightness and opacity is what allows a lighter sheet to hold the same print quality.',
      },
      'which-grade': {
        question: 'Which grade is recommended for paper and paperboard?',
        answer:
          'The technical data documents paper and paperboard as a sector served but does not tie a specific grade to it, and a recommendation invented here would be a guess. A grade recommendation needs the machine, the sheet specification and the retention system. State them on the quotation request.',
      },
      'ph-alkaline': {
        question: 'Is calcium carbonate compatible with an alkaline papermaking system?',
        answer:
          'It requires one. Calcium carbonate has a pH of 8.5 to 9.5 to ISO 787-9 and dissolves under acidic conditions, so it is used in neutral and alkaline papermaking rather than in an acid rosin-alum system. The alkaline sheet is also the more durable one, which is why most of the industry moved to it.',
      },
    },
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
      'Virgin cellulose fibre is a costly input in papermaking, and replacing part of it requires a filler that raises brightness and opacity without damaging ink receptivity.',
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
      '{code} is a ground calcium carbonate at {mesh} mesh with a median particle size (D50) of <ltr>{d50}</ltr> microns. {coating} It serves {applications}. The values below are typical for the product family, each stated with the test method that produced it, and a Certificate of Analysis carrying the measured values is issued with every production batch.',
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

    guidesTitle: 'Technical Guides | KMIT',
    guidesDescription:
      'How to choose a calcium carbonate grade, when surface coating is worth the premium, and the difference between GCC and PCC.',
    guidesH1: 'Technical guides',
    guidesAnswerFirst:
      'Three questions decide most calcium carbonate specifications: which grade the application needs, whether surface coating earns its premium, and whether the ground or the precipitated product is the right one. Each guide answers one of them with the published figures and the test methods behind them, and says plainly where the answer depends on a trial rather than on a table.',
    guidesReadGuide: 'Read the guide',

    errorTitle: 'Something went wrong | KMIT',
    errorH1: 'Something went wrong',
    errorBody:
      'This part of the page could not be rendered. Try again, or start from the home page.',
    errorRetry: 'Try again',
    loadingLabel: 'Loading',
  },

  guides: {
    'grade-selection': {
      title: 'How to Choose a Calcium Carbonate Grade',
      description:
        'Work from application to median particle size to grade, with the D50 range and coating status for each of the five grades.',
      h1: 'Which calcium carbonate grade do I need?',
      answerFirst:
        'Start from the application, not from the mesh number. The application sets the median particle size (D50) it can tolerate, the D50 selects the grade, and the grade determines whether surface coating comes with it. Construction and drilling take 25 to 55 microns; PVC pipe and emulsion paint take 10 to 15; masterbatch and fine coatings take 1.8 to 6.0 microns and arrive stearic-acid coated.',
      navLabel: 'Choosing a grade',
      cardSummary:
        'A decision path from application to median particle size to grade, with the full table underneath.',
      pathHeading: 'The decision path',
      pathIntro:
        'Three steps, in this order. Reversing them is the usual cause of a wrong specification: a mesh number chosen first has to be justified afterwards, and it rarely can be.',
      step1Heading: '1. Start from the application',
      step1Body:
        'What the material has to do decides everything downstream. A bridging agent in a drilling fluid and a filler in a blown film are the same mineral doing unrelated jobs, and the grade that is right for one is wrong for the other. Write down the process, the section thickness or the pore size you are working against, and the property you are protecting.',
      step2Heading: '2. Read across to the median particle size',
      step2Body:
        'Each application has a working range in microns. Coarse construction and drilling work runs 25 to 55 microns. PVC pipe, cable compound and emulsion paint run 10 to 15. Filler masterbatch, PVC fittings and PE film run 4.5 to 6.0. High-end masterbatch and fine coatings run 1.8 to 2.5. Below 1.8 microns, or where a specific crystal shape is specified, the answer is precipitated calcium carbonate rather than a finer grind.',
      step3Heading: '3. Let the grade decide the coating',
      step3Body:
        'Surface treatment is not a separate choice on this range. The two finest grades, GCC-1250 and GCC-2500, carry a stearic acid coat at 0.8% to 1.2%, and the three coarser grades do not. That reflects where coating changes behaviour: dispersion in a polymer melt and resistance to moisture pick-up, both of which bind in the micronized range and neither of which binds at 45 microns.',
      selectorHeading: 'Select by application',
      selectorIntro:
        'Choose an application to see the grade specified for it. The selection is held in the URL, so the result can be sent to a colleague as a link.',
      selectorLabel: 'Application',
      selectorAll: 'All applications',
      selectorResultHeading: 'Recommended grade',
      selectorPrompt: 'Choose an application above, or read the full table below.',
      selectorEmpty: 'No grade in the range is documented for this application.',
      tableHeading: 'The full table',
      tableCaption:
        'Application, working median particle size range, recommended grade and surface coating',
      columnApplication: 'Application',
      columnD50: 'Working D50',
      columnGrade: 'Grade',
      columnCoating: 'Surface coating',
      closingHeading: 'Where the table stops',
      closingBody:
        'The table gets you to a grade. It does not get you to a loading level, and no published table can: loading depends on your resin or binder, your line, and the property you are holding. That is settled on a trial with a sample. Request one with the application stated and the specification comes back with it.',
    },

    'coated-vs-uncoated': {
      title: 'Coated vs Uncoated Calcium Carbonate',
      description:
        'What stearic acid surface treatment changes on the line, which grades carry it, and when it is not worth the premium.',
      h1: 'Coated or uncoated calcium carbonate?',
      answerFirst:
        'Surface treatment with stearic acid at 0.8% to 1.2% makes the particle hydrophobic. On the line that means better dispersion in a polymer melt, lower moisture pick-up, higher throughput on extrusion and reduced machine wear. It also halves shelf life, from 24 months to 12. Coating is specified on the two micronized grades, GCC-1250 and GCC-2500, and is not offered on the coarser three.',
      navLabel: 'Coated vs uncoated',
      cardSummary:
        'What the stearic acid layer changes, what it costs, and the applications where it earns nothing.',
      whatHeading: 'What the coating is',
      whatBody:
        'Stearic acid is chemisorbed onto the surface of the calcium carbonate particle, turning a hydrophilic mineral surface into a hydrophobic organic one. The level is controlled at 0.8% to 1.2% by mass of the mineral. It is quoted as a band rather than a single figure because coating is a process with tolerance, and a supplier who publishes one number is publishing a target rather than a result.',
      effectHeading: 'What changes on the line',
      effectBody:
        'A hydrophobic particle wets out into a polymer melt instead of holding together as an agglomerate. That shows up as lower screen pack pressure, fewer gels in film, higher achievable loading at the same impact strength, and less abrasive work for the screw and die. It also shows up in the warehouse: coated material picks up less atmospheric moisture than uncoated material stored the same way.',
      tableHeading: 'Side by side',
      tableCaption:
        'Uncoated and stearic-acid coated calcium carbonate compared, aspect by aspect',
      columnAspect: 'Aspect',
      columnUncoated: 'Uncoated',
      columnCoated: 'Coated',
      rows: {
        surface: {
          aspect: 'Particle surface',
          left: 'Hydrophilic mineral surface',
          right: 'Hydrophobic, stearic acid at 0.8% to 1.2%',
        },
        dispersion: {
          aspect: 'Dispersion in a polymer melt',
          left: 'Adequate at coarse and medium particle size',
          right: 'The reason the treatment exists, in the micronized range',
        },
        moisture: {
          aspect: 'Moisture pick-up in storage',
          left: 'Higher; delivered at or below 0.20% to ISO 787-2',
          right: 'Lower; the surface resists water',
        },
        throughput: {
          aspect: 'Extrusion throughput and machine wear',
          left: 'Unchanged',
          right: 'Faster throughput, reduced wear',
        },
        'shelf-life': {
          aspect: 'Shelf life',
          left: '24 months',
          right: '12 months; the organic layer is what ages',
        },
        grades: {
          aspect: 'Grades in this range',
          left: 'GCC-200, GCC-400, GCC-800',
          right: 'GCC-1250, GCC-2500',
        },
        'when-not-worth-it': {
          aspect: 'Where it earns nothing',
          left: 'Drilling fluids, construction, tile adhesive, rubber, water-borne paint',
          right: 'Melt processing at fine particle size and high loading',
        },
      },
      verdictHeading: 'When coating is not worth the premium',
      verdictBody:
        'In a water-borne emulsion paint, a cementitious dry mix, a rubber compound, or a drilling fluid. In each of those the surface is dispersed in water or worked by high mechanical energy, the particle size is coarse enough that agglomeration is not the constraint, and a hydrophobic surface is either irrelevant or actively unhelpful. Paying for a coat in those applications buys a shorter shelf life and nothing else.',
      shelfLifeHeading: 'The shelf life trade',
      shelfLifeBody:
        'Twelve months coated against twenty four uncoated. The mineral is inert either way; it is the stearic acid layer that ages, and that layer is the thing you bought. Order coated grades against your consumption rather than building a long buffer, and store on pallets in a cool, dry, ventilated warehouse away from direct sunlight and ambient humidity.',
    },

    'gcc-vs-pcc': {
      title: 'GCC vs PCC Calcium Carbonate',
      description:
        'Ground and precipitated calcium carbonate compared: production route, crystal morphology, particle size floor and application fit.',
      h1: 'GCC or PCC: which calcium carbonate?',
      answerFirst:
        'Ground calcium carbonate (GCC) is milled from high-purity limestone and marble, giving chemical stability, high whiteness and a particle size floor set by what milling can reach. Precipitated calcium carbonate (PCC) is synthesised by recarbonation of slaked lime, which allows crystal morphology and particle size to be controlled into the sub-micron range. The ground product covers the industrial filler range; the precipitated one answers applications that specify a crystal habit.',
      navLabel: 'GCC vs PCC',
      cardSummary:
        'Two production routes, two particle size floors, and the point at which milling stops being the answer.',
      processHeading: 'Two different production routes',
      processBody:
        'GCC is a mechanical product. High-purity limestone and marble are milled, then air classified to set the median particle size, and the finest grades are surface treated. Nothing about the mineral changes; the process selects size. PCC is a chemical product: quicklime is slaked and then recarbonated with carbon dioxide, and the crystals are grown under controlled conditions. The process builds the particle rather than selecting it.',
      tableHeading: 'Side by side',
      tableCaption: 'Ground and precipitated calcium carbonate compared, aspect by aspect',
      columnAspect: 'Aspect',
      columnGcc: 'GCC (ground)',
      columnPcc: 'PCC (precipitated)',
      rows: {
        production: {
          aspect: 'Production route',
          left: 'Mechanical milling and air classification of limestone and marble',
          right: 'Chemical precipitation by recarbonation of slaked lime',
        },
        morphology: {
          aspect: 'Crystal morphology',
          left: 'Irregular, set by fracture during milling',
          right: 'Controlled: the shape is a process parameter',
        },
        'particle-size': {
          aspect: 'Particle size',
          left: '45 to 55 microns down to 1.8 to 2.5 microns across five grades',
          right: 'Controlled into the sub-micron and nano range',
        },
        whiteness: {
          aspect: 'Whiteness and purity',
          left: '95.0% to 98.5% R457 to ISO 2470, at least 98.5% CaCO₃ to ISO 3262-1',
          right: 'Ultra-high purity achievable by controlling the synthesis',
        },
        'typical-use': {
          aspect: 'Where each one belongs',
          left: 'Plastics, paints and coatings, construction, drilling fluids, rubber, paper',
          right: 'Applications specifying a crystal habit or a sub-micron size',
        },
      },
      fitHeading: 'Which one your application needs',
      fitBody:
        'If the specification is a median particle size and a purity figure, GCC answers it, and the five grades cover 200 to 2500 mesh. If the specification names a crystal shape, or calls for a particle size below what milling reaches, PCC is the correct product and a finer grind is not a substitute for it. The distinction is not quality: they are different materials that happen to share a formula.',
      supplyHeading: 'What KMIT supplies',
      supplyBody:
        'The published grade range is ground calcium carbonate, five grades from 200 to 2500 mesh, with the two finest surface treated. Precipitated calcium carbonate is part of the product classification in the technical data but carries no published grade table. If your specification calls for PCC, state the morphology and particle size on the quotation request rather than assuming a ground grade will substitute.',
    },
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

  consent: {
    heading: 'Measurement',
    body: 'We would like to record which pages and grades get read, so the technical documentation can be improved. No personal data, and nothing is recorded unless you agree.',
    accept: 'Agree',
    decline: 'Decline',
  },

  jsonld: {
    addressLocality: 'Jeddah',
    areaServedCountry: 'Saudi Arabia',
    areaServedRegion: 'Gulf Cooperation Council',
    material: 'Calcium carbonate (CaCO3)',
    productCategory: 'Industrial mineral fillers and extenders',
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
