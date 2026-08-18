import type { Dict } from './ar';

/**
 * English copy. Written in English rather than translated line-for-line from the
 * Arabic (§13) — the two languages say the same thing, not the same words. Typed
 * against `Dict`, so any key missing in either language fails the build.
 */

export const en: Dict = {
  /* ---------------------------------------------------------------- shell */
  shell: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuLabel: 'Main navigation',
    switchTo: 'العربية',
    switchToLabel: 'Read this site in Arabic',
    home: 'Home',
    breadcrumb: 'Breadcrumb',
    logoAlt: 'KMIT Industrial',
    sceneAlt: 'Illustrative 3D scene; it is described in the page text.',
  },

  nav: [
    { route: 'about', label: 'About' },
    { route: 'sectors', label: 'Sectors' },
    { route: 'calcium-carbonate', label: 'Calcium carbonate' },
    { route: 'quality-hse', label: 'Quality & safety' },
    { route: 'sustainability', label: 'Sustainability' },
    { route: 'careers', label: 'Careers' },
    { route: 'contact', label: 'Contact' },
  ],

  /* --------------------------------------------------- the three key words */
  words: {
    material: 'Material',
    movement: 'Movement',
    energy: 'Energy',
  },

  /* -------------------------------------------------------------- footer */
  footer: {
    lede: 'An industrial group in Jeddah. Material, movement, energy.',
    colSectors: 'Sectors',
    colGroup: 'The group',
    colContact: 'Contact',
    rights: 'KMIT Industrial. All rights reserved.',
    langHeading: 'Language',
  },

  /* ------------------------------------------------------- contact block */
  contact: {
    heading: 'Where we are, how to reach us',
    lead: 'The group is based in Jeddah. The shortest route to us is one of the three below.',
    mapCaption: 'Head office: Jeddah, Saudi Arabia.',
    mapAlt: 'Line map showing the location of the KMIT Industrial head office in Jeddah.',
    mapOpen: 'Open the location in Maps',
    rows: {
      location: 'Location',
      mobile: 'Mobile',
      email: 'Email',
    },
    cta: 'Contact the commercial development team',
  },

  /* ---------------------------------------------------------------- forms */
  form: {
    name: 'Name',
    email: 'Email address',
    phone: 'Mobile number',
    company: 'Company or organisation',
    subject: 'Subject',
    field: 'Field',
    message: 'Message',
    file: 'Profile or CV',
    fileHint: 'PDF or Word, up to five megabytes.',
    optional: 'optional',
    submitContact: 'Send the message',
    submitCareers: 'Send the application',
    required: 'Required field',
    errorName: 'Give the name you would like us to use.',
    errorEmail: 'The address needs the form name@example.com so we can reply.',
    errorMessage: 'Write at least one line about why you are getting in touch.',
    errorField: 'Pick the field closest to your experience.',
    errorSummary: 'The message was not sent. The fields below need a change.',
    noEndpointTitle: 'Sending opens your mail app',
    noEndpointBody:
      'There is no receiving address wired to this form yet, so the button opens a prepared message in your own mail app. Once a service is connected, sending happens on the page.',
    sendingVia: 'Or write to us directly at',
  },

  /* ------------------------------------------------------- placeholders */
  placeholder: {
    label: 'Content awaiting approval',
    note: 'This space is reserved for data that has not been approved yet. No unverified figure or name is put here.',
  },

  /* ================================================================ home */
  home: {
    heroLine1: 'Industrial minerals,',
    heroLine2: 'from quarry to product.',
    heroLead:
      'KMIT is an industrial group in Jeddah working on the material industry is built from, on moving it, and on the energy that runs it.',
    heroCtaPrimary: 'Learn about the group',
    heroCtaSecondary: 'Read about calcium carbonate',
    heroSceneDescription:
      'A calcite rhombohedron turns slowly in front of the page heading. Calcite is birefringent, so text sitting behind the crystal is seen as two slightly offset copies.',

    introParagraph:
      'KMIT is a multi-sector industrial group based in Jeddah. It works in industrial minerals and calcium carbonate processing, in marble stone transport, and in solar panels.',

    sectorsHeading: 'Three sectors, one thread',
    sectorsLead:
      'KMIT works on the material industry is built from, on moving it, and on the energy that runs it.',
    sectorsProgressLabel: 'Sector shown',

    journeyHeading: 'The material’s journey',
    journeyLead:
      'From a block of limestone to a fine powder. Four stages, and the material itself changes in every one of them.',
    journeyStages: [
      {
        n: '01',
        name: 'Limestone',
        body: 'The source is a sedimentary rock made mostly of calcium carbonate. Marble and calcite are two further sources of the same material in different crystalline forms.',
      },
      {
        n: '02',
        name: 'Extraction and crushing',
        body: 'Stone comes out of the quarry and is crushed down to smaller sizes that are easier to handle and to feed into the grinding stages that follow.',
      },
      {
        n: '03',
        name: 'Fine grinding',
        body: 'Rubble is ground in steps until it reaches powder. This stage is what decides how the material behaves in whatever application it goes into.',
      },
      {
        n: '04',
        name: 'The finished powder',
        body: 'The powder is classified, then packed. What leaves here goes into plastics, paints, paper and construction materials.',
      },
    ],
    journeySceneDescription:
      'A stone block fractures into rubble, the rubble becomes a cloud of fine particles, and the particles settle into a soft white powder surface that light passes through.',

    whyHeading: 'Why this material matters',
    whyLeadBody:
      'Calcium carbonate is one of the most widely used mineral materials in industry. The reason is direct: it occurs abundantly in nature, it is chemically stable, and it does more than one job inside the same product.',
    whyUsesTitle: 'Where it goes',
    whyUses: [
      'Plastics and compounds',
      'Paints and coatings',
      'Paper and packaging',
      'Rubber',
      'Construction materials',
      'Animal feed',
    ],
    whyMaterialTitle: 'From stone to powder',
    whyMaterialBody:
      'It is the same material at both ends. What changes is its fineness and the spread of its particle sizes, and that alone changes what it is good for.',
    whyImageAlt:
      'White calcium carbonate powder after grinding, showing the smoothness of the surface and its fine grain.',
    whyLink: 'Read the knowledge centre on calcium carbonate',
    whyQuietLine:
      'One material, and a great many industries leaning on it without it appearing in the product name.',

    approachHeading: 'How we operate',
    approachLead: 'Three principles govern the way work is done across all three sectors.',
    approachHint: 'Hover a principle or select it to read it.',
    approachPillars: [
      {
        title: 'Vertical integration',
        body: 'We work across more than one link in the chain, from stone to finished material, instead of depending on a single link. That makes the quality of what leaves our hands ours to answer for at every stage, not somebody else’s.',
      },
      {
        title: 'Quality discipline',
        body: 'Quality is a repeated procedure, not a state announced once. Material is followed through its stages, and any deviation is traced back to its cause in the process before the output is corrected.',
      },
      {
        title: 'Environmental commitment',
        body: 'Environmental impact is part of the cost of operating, and it is managed from the planning stage rather than after the fact. Dust, water, energy and land are reviewed with every expansion.',
      },
    ],
  },

  /* =============================================================== pages */
  about: {
    h1: 'About KMIT Industrial',
    lead: 'An industrial group based in Jeddah, working in three sectors held together by material, movement and energy.',
    body: [
      'KMIT is a Saudi industrial group working on industrial minerals and calcium carbonate, on marble stone transport, and on solar panels. The three look far apart, and are in fact three stages of the same thing: the material industry is built from, the movement that carries it, and the energy that runs it.',
      'Work in minerals starts at the stone and ends at a finished material that goes into other industries. That means a connected chain rather than a single step, and it means quality is built at every stage instead of being inspected at the last one.',
    ],
    timelineHeading: 'Milestones',
    timelineNote:
      'Founding year and principal milestones are awaiting approval. The space below is reserved for them.',
    visionHeading: 'Vision',
    visionBody:
      'For KMIT to be the source Saudi industry relies on for industrial minerals, with material of steady quality and a supply chain that can be planned around.',
    principlesHeading: 'Operating principles',
    principlesBody: [
      'Describe the work precisely. A commitment we cannot meet is not offered.',
      'Material is measured, not characterised. A decision on the plant floor traces back to a measurement, not an impression.',
      'A relationship with an industrial buyer is long by nature. It is run on that basis.',
      'Safety is a condition of operating. Work that cannot be done safely stops until it can.',
    ],
  },

  sectors: {
    h1: 'Our sectors',
    lead: 'Three sectors: material, movement and energy. Each has its own page.',
    body: 'KMIT works on the material industry is built from, on moving it, and on the energy that runs it. The three pages below take each sector on its own.',
    alsoHeading: 'KMIT also works on',
    readSector: 'Read the sector page',
  },

  sectorPages: {
    'industrial-minerals': {
      word: 'Material',
      h1: 'Industrial minerals and calcium carbonate',
      lead: 'From raw stone to a classified powder that goes into other industries.',
      defHeading: 'What this sector is',
      defBody: [
        'This is the deepest of the group’s sectors and the first in logical order: the material comes from here. Work begins at limestone, marble or calcite, which are natural sources of calcium carbonate, and ends at a classified powder ready for industrial use.',
        'Calcium carbonate is a widely used mineral material. It goes into plastics, paints, paper, rubber, construction materials and animal feed, and in each of them it does a different job depending on its fineness and the spread of its particle sizes.',
      ],
      scopeHeading: 'Scope of work',
      scopeBody: [
        'Stone extraction and handling.',
        'Crushing and primary classification.',
        'Grinding in stages down to powder.',
        'Classification, packing and delivery.',
      ],
      whyHeading: 'Why this sector matters',
      whyBody:
        'An industrial buyer is not buying stone; they are buying predictable behaviour from a material inside their own production line. That behaviour is built in the grinding and classification stages, not in the quarry alone, which is why we work the whole chain.',
      knowledgeLink: 'Read the knowledge centre on calcium carbonate',
      sceneDescription:
        'A flat-faced stone block fractures into angled shards, then collapses inward toward fine particles.',
    },
    'marble-transport': {
      word: 'Movement',
      h1: 'Marble stone transport',
      lead: 'Heavy blocks moving from quarry to plant to project.',
      defHeading: 'What this sector is',
      defBody: [
        'Moving marble is a logistics job before it is a freight job. A single block is a non-standard load: heavy, irregular in shape, and liable to crack if it is supported in the wrong place. So the load is planned before it is lifted, not after.',
        'Movement here is a link in the same chain the material starts in. Stone that sits in the quarry is worth nothing, and stone that arrives cracked is worth nothing either.',
      ],
      scopeHeading: 'Scope of work',
      scopeBody: [
        'Planning the load and its support before lifting.',
        'Lifting and handling inside the quarry and at the delivery point.',
        'Transport between quarry, plant and project site.',
        'Scheduling around the sequence of work on the client’s side.',
      ],
      whyHeading: 'Why this sector matters',
      whyBody:
        'A block of stone loses its value to one knock in the wrong place. Transport run on safety and correct support protects the material, the crew and the schedule at the same time.',
      sceneDescription:
        'Stacked rectangular marble slabs slide horizontally by uneven amounts as though being loaded, with a shadow tracking them.',
    },
    'solar-panels': {
      word: 'Energy',
      h1: 'Solar panels',
      lead: 'The energy that runs industry is part of industry itself.',
      defHeading: 'What this sector is',
      defBody: [
        'Working on solar panels reads operationally inside this group: quarries, mills and transport need energy, and where that energy comes from is a line in the cost of the material and in its environmental impact alike.',
        'Sun is a resource available in the Kingdom the year round. Turning it into operating power reduces dependence on a single source and ties industrial expansion to a source that does not run out.',
      ],
      scopeHeading: 'Scope of work',
      scopeBody: [
        'Solar panels and their supply.',
        'Connecting industrial operations to a renewable source.',
      ],
      whyHeading: 'Why this sector matters',
      whyBody:
        'Energy sits inside the cost of every tonne of material and inside its environmental impact. A group working on the material and on the energy that produces it holds the decision on both, not on one of them.',
      sustainabilityLink: 'Read the sustainability and impact page',
      sceneDescription:
        'A grid of flat panels at a uniform tilt leans in sequence toward a moving light source, with an indigo glint reflecting off them.',
    },
  },

  knowledge: {
    h1: 'Calcium carbonate',
    lead: 'A general reference on the material: what it is, where it comes from, and where it is used. No product specifications.',
    note: 'This page is general knowledge about the material, not production data or product specifications for KMIT.',
    explorerHeading: 'The calcite crystal',
    explorerLead:
      'Calcite is the crystalline form of calcium carbonate. Select the points to read what distinguishes it.',
    explorerAlt:
      'A 3D explorer of a rhombohedral calcite crystal, with selectable points explaining its structure.',
    hotspots: [
      {
        title: 'The rhombohedral form',
        body: 'Calcite crystallises as a rhombohedron whose flat faces meet at oblique angles. It breaks along defined planes rather than at random.',
      },
      {
        title: 'Double refraction',
        body: 'Light entering a calcite crystal splits into two rays travelling at different speeds. That is why text behind the crystal is seen as two offset copies, and it is the same phenomenon used in this site’s hero.',
      },
      {
        title: 'The same material',
        body: 'Calcite, marble and limestone are three appearances of calcium carbonate. What separates them is geological formation and grain structure, not the underlying composition.',
      },
    ],
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'What is calcium carbonate?',
        a: 'Calcium carbonate is a white mineral material with the chemical formula CaCO₃, and one of the most abundant materials in the earth’s crust. It is extracted from limestone, marble and calcite, then ground and classified to go into many industries as a filler or as a base material.',
      },
      {
        q: 'What are its natural sources?',
        a: 'Its three principal sources are limestone, marble and calcite. Limestone is a sedimentary rock; marble is a metamorphic rock formed from limestone under heat and pressure; calcite is the relatively pure crystalline form. The underlying composition in all three is calcium carbonate, and what differs is formation and grain structure.',
      },
      {
        q: 'What is the difference between ground and precipitated calcium carbonate?',
        a: 'Ground calcium carbonate is produced by mechanically grinding natural stone, so its particles carry an irregular shape that follows the nature of the rock. Precipitated calcium carbonate is produced by a controlled chemical reaction, so particle shape and distribution can be steered as it forms. The first suits uses that need volume and size; the second suits uses that need finer control of particle shape.',
      },
      {
        q: 'Where is calcium carbonate used?',
        a: 'It is used in plastics and compounds, in paints and coatings, in paper and packaging, in rubber, in construction materials such as cement and mortar, and in animal feed as a calcium source. In each of these it does a different job: filling, adding whiteness, or controlling consistency.',
      },
      {
        q: 'Why is it used so widely?',
        a: 'Because it combines three properties that rarely come together: it occurs abundantly in nature, it is chemically stable so it does not react with most of what it is mixed into, and it does more than one job in the same product. That makes it a material which improves properties and controls cost at the same time.',
      },
      {
        q: 'What decides whether a powder suits a given application?',
        a: 'The main factor is the fineness of the powder and the spread of its particle sizes, then its degree of whiteness and the purity of its source. The same material may suit one application and not another on those properties alone, which is why it is classified before delivery.',
      },
    ],
  },

  quality: {
    h1: 'Quality, safety and environment',
    lead: 'An operating approach in three directions, run as a repeated procedure rather than an announcement.',
    qualityHeading: 'Quality',
    qualityBody: [
      'Quality at KMIT is built into the process, not inspected at the end of it. Material is followed through its stages, and the specification of what leaves is measured before delivery rather than after.',
      'Any deviation is traced back to its cause in the process. Correcting the output alone brings the problem back in the next shipment.',
    ],
    safetyHeading: 'Safety',
    safetyBody: [
      'Work in quarries and mills and the movement of heavy loads is high-risk by nature. Safety in it is a condition of operating: what cannot be done safely stops until it can.',
      'Planning before the lift, correct support, and clear responsibility on site are the practical safety tools before anything else.',
    ],
    envHeading: 'Environment',
    envBody: [
      'Dust, water, energy and land are items reviewed with every expansion, not effects treated after they happen.',
      'Environmental impact is part of the cost of operating. Accounting for it at the planning stage is cheaper than treating it later, and more honest.',
    ],
    certNote:
      'Accreditation and certification names are awaiting formal approval, and are not stated here before that.',
  },

  sustainability: {
    h1: 'Sustainability and impact',
    lead: 'Energy, material and land in one account.',
    body: [
      'In a group working on minerals, sustainability is not a line separate from operating. A quarry changes land, grinding consumes energy, transport consumes fuel. These are facts of the work, and dealing with them starts by admitting them.',
      'KMIT’s work in solar panels reads from this angle: the energy source running an industrial process is a line in its impact. Shifting part of that source to the sun reduces the impact and reduces dependence on a single source.',
      'Calcium carbonate itself is a long-lived material inside the product it goes into, and its natural source is widespread. That does not cancel the impact of extracting it, but it does make the impact account different from materials whose sources are drawn down quickly.',
    ],
    energyLink: 'Read the solar panels page',
    dataNote:
      'Impact and consumption figures are awaiting measurement and approval. They are not published here before they are measured.',
  },

  careers: {
    h1: 'Careers',
    lead: 'The work here is industrial by nature: quarries, mills, sites, laboratories and schedules.',
    body: 'We look for people who measure before they decide, write down what they did, and treat safety as part of the work rather than an extra step.',
    emptyTitle: 'No open roles at the moment',
    emptyBody:
      'Send your profile and we will keep it. When a role that fits your experience opens, we will come back to you.',
    formHeading: 'Send your profile',
    fields: [
      'Quarrying and extraction',
      'Grinding and operations',
      'Quality control and laboratory',
      'Maintenance',
      'Logistics and transport',
      'Safety and environment',
      'Sales and commercial development',
      'Administration and support',
    ],
    fieldPlaceholder: 'Choose a field',
  },

  contactPage: {
    h1: 'Contact us',
    lead: 'Write to us, call, or send an email. All three reach the same team.',
    formHeading: 'Write to us',
    detailsHeading: 'Contact details',
    subjects: [
      'Calcium carbonate supply enquiry',
      'Marble stone transport',
      'Solar panels',
      'Partnership or supply',
      'Something else',
    ],
    subjectPlaceholder: 'Choose a subject',
  },

  /* ============================================================ metadata */
  meta: {
    home: {
      title: 'KMIT Industrial | Minerals and calcium carbonate, Jeddah',
      description:
        'An industrial group in Jeddah working in industrial minerals and calcium carbonate processing, marble stone transport, and solar panels.',
    },
    about: {
      title: 'About KMIT Industrial | A Saudi industrial group',
      description:
        'Who we are, how minerals, marble transport and solar energy come together in one group based in Jeddah, and the principles that run it.',
    },
    sectors: {
      title: 'Our sectors | Material, movement and energy',
      description:
        'Three sectors at KMIT Industrial: industrial minerals and calcium carbonate processing, marble stone transport, and solar panels.',
    },
    'sectors/industrial-minerals': {
      title: 'Industrial minerals and calcium carbonate',
      description:
        'From limestone, marble and calcite to classified calcium carbonate powder: KMIT’s scope of work in industrial minerals.',
    },
    'sectors/marble-transport': {
      title: 'Marble stone transport | Heavy non-standard loads',
      description:
        'Moving marble blocks from quarry to plant to project: load planning, support and safety in the transport sector at KMIT Industrial.',
    },
    'sectors/solar-panels': {
      title: 'Solar panels | Energy that runs industry',
      description:
        'KMIT Industrial’s work in solar panels, and connecting industrial operations to a renewable energy source in the Kingdom.',
    },
    'calcium-carbonate': {
      title: 'Calcium carbonate: what it is, sources and uses',
      description:
        'A general reference on calcium carbonate: its definition, sources in limestone, marble and calcite, ground against precipitated, and where it is used.',
    },
    'quality-hse': {
      title: 'Quality, safety and environment at KMIT Industrial',
      description:
        'KMIT’s approach to material quality, to safety in quarries, mills and transport, and to managing environmental impact from the planning stage.',
    },
    sustainability: {
      title: 'Sustainability and impact | KMIT Industrial',
      description:
        'How energy, material and land are accounted for in a group working on industrial minerals, and where solar energy sits in that account.',
    },
    careers: {
      title: 'Careers at KMIT Industrial',
      description:
        'Roles in quarrying, grinding, quality control, logistics and safety. Send your profile and we keep it until a suitable role opens.',
    },
    contact: {
      title: 'Contact KMIT Industrial | Jeddah',
      description:
        'Reach the commercial development team at KMIT Industrial in Jeddah: mobile, email and a direct contact form.',
    },
  },
};
