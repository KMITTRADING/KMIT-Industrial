import type { Copy } from './types';

/**
 * English copy.
 *
 * Register per §6: short sentences, plain verbs, confident but restrained, no
 * superlatives. The test applied to every line was "could this sentence appear
 * on any industrial company's site?" — where the answer was yes, it was
 * rewritten until it could only appear on this one.
 *
 * The areas-of-work bodies describe the materials, not KMIT's facilities. That
 * distinction is deliberate: what limestone is and how a panel is built are
 * general material science, while "we crush and classify" would be a capability
 * claim, and §1 does not establish one.
 */
export const en: Copy = {
  languageName: 'English',
  switchTo: 'العربية',

  nav: {
    home: 'Home',
    solutions: 'Solutions',
    approach: 'Approach',
    about: 'About',
    contact: 'Contact',
    primaryLabel: 'Primary',
    openMenu: 'Menu',
    closeMenu: 'Close',
    skipToContent: 'Skip to content',
  },

  hero: {
    eyebrow: 'Jeddah, Saudi Arabia',
    words: ['Materials.', 'Minerals.', 'Energy.'],
    lead: 'KMIT Industrial Solutions works in calcium carbonate, mining and solar energy panels, from Jeddah into Saudi Arabia and the wider Middle East. Three areas that list as separate businesses and behave as one system.',
    cta: 'Discuss a project',
    scrollCue: 'Scroll',
  },

  areas: {
    label: 'Areas of work',
    heading: 'Three areas. One structure.',
    items: [
      {
        index: '01',
        title: 'Calcium Carbonate',
        descriptor: 'Sedimentary rock, put to industrial use',
        body: 'Limestone is laid down in layers over geological time; ground and classified, the same rock becomes filler and pigment in plastics, paint, paper and construction materials.',
      },
      {
        index: '02',
        title: 'Mining',
        descriptor: 'Reading the ground before moving it',
        body: 'Mining is the practical half of geology — knowing which layer holds what, and what it costs to reach it.',
      },
      {
        index: '03',
        title: 'Solar Energy Panels',
        descriptor: 'A laminate that turns light into current',
        body: 'Glass, cell, encapsulant, backsheet: a panel is layers bonded in sequence, and it behaves like the laminate it is.',
      },
    ],
  },

  approach: {
    label: 'Approach',
    heading: 'How we work.',
    lead: 'Four things we hold to. They are short because they are meant to be checked against, not admired.',
    items: [
      {
        index: '01',
        title: 'Industrial thinking',
        body: 'We start from the application — what the material has to do on your line — not from a product list.',
      },
      {
        index: '02',
        title: 'Practical solutions',
        body: 'A specification that cannot be met on schedule is not a solution, so we say what is possible before we agree to it.',
      },
      {
        index: '03',
        title: 'Reliability',
        body: 'A supplier is judged after the order is placed, not during the conversation that wins it.',
      },
      {
        index: '04',
        title: 'Long-term value',
        body: 'We would rather be the supplier you keep than the one you tried.',
      },
    ],
  },

  strata: {
    label: 'The through-line',
    heading: 'One core, read from the bottom up.',
    steps: [
      {
        index: '01',
        title: 'Material',
        body: 'Rock is not uniform. It is a record of what settled, in what order, under what pressure.',
      },
      {
        index: '02',
        title: 'Extraction',
        body: 'Mining reads that record and takes the layer worth taking.',
      },
      {
        index: '03',
        title: 'Application',
        body: 'Ground to a grade, the same rock leaves as filler, pigment and body in a product that carries another name.',
      },
      {
        index: '04',
        title: 'Energy',
        body: 'The panel at the top of the core is layers too — bonded rather than settled, and turned toward the sun.',
      },
    ],
  },

  region: {
    label: 'Where we work',
    heading: 'From Jeddah, outward.',
    body: 'Saudi Arabia first, then the wider Middle East. In industrial supply, distance is a line on the invoice — being near the customer is a specification of its own.',
    nodeLabel: 'Jeddah, Saudi Arabia',
  },

  about: {
    label: 'About',
    heading: 'Who you are dealing with.',
    body: [
      'KMIT Industrial Solutions is an industrial company based in Jeddah, working across calcium carbonate, mining and solar energy panels.',
      'We deal with the people who read a datasheet before they read a brochure — and we would rather answer their questions directly than talk around them.',
    ],
    groupPrefix: 'A branch of',
    audienceLabel: 'Who we work with',
    audience: [
      'Manufacturers',
      'Industrial organizations',
      'Procurement teams',
      'Technical stakeholders',
      'Energy projects',
    ],
  },

  cta: {
    label: 'Contact',
    heading: 'Tell us what the material has to do.',
    primary: 'Discuss a project',
    mailSubject: 'Project enquiry',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
  },

  footer: {
    statement: 'Calcium carbonate, mining and solar energy panels. Jeddah, Saudi Arabia.',
    navLabel: 'Site',
    areasLabel: 'Areas of work',
    contactLabel: 'Contact',
    copyright: (year) => `© ${year} KMIT Industrial Solutions. All rights reserved.`,
  },

  meta: {
    title: 'KMIT Industrial Solutions — Calcium Carbonate, Mining, Solar Energy Panels',
    description:
      'Industrial company in Jeddah, Saudi Arabia, working in calcium carbonate, mining and solar energy panels for manufacturers and industrial organizations across the Middle East.',
  },
};
