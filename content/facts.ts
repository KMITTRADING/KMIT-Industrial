/**
 * Everything the site asserts about KMIT, in one place.
 *
 * The brief's §1 lists the only true facts, and its absolute rule is that
 * nothing else may be generated: no founding year, no years of experience, no
 * certifications, no capacities, no client names, no statistics. Keeping the
 * facts in a single module is what makes that rule checkable rather than a
 * matter of trust — scripts/check-facts.mjs audits the built HTML against this
 * file, so a number that appears in a component and not here fails the build.
 *
 * Do not add a field to this object unless it came from the client.
 */
export const FACTS = {
  name: { en: 'KMIT Industrial Solutions', ar: 'شركة حلول كميت للصناعة' },

  /** The parent company. A branch of, not a partner of. */
  group: {
    en: 'Kmit Al-Mutamayiza Trading',
    ar: 'شركة كميت المتميزة التجارية',
  },

  city: { en: 'Jeddah', ar: 'جدة' },
  country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  countryCode: 'SA',
  region: { en: 'the Middle East', ar: 'الشرق الأوسط' },

  email: 'mohanad@kmit.co',

  /** Display form and dial form of the same number. */
  phone: { display: '+966 57 495 0950', dial: '+966574950950' },

  /**
   * Jeddah, for the Region section's technical readout. A city coordinate is a
   * published geographic fact, not a claim about KMIT — there is no street
   * address here, which is also why §11 rules out LocalBusiness schema.
   */
  coordinates: { lat: '21.4858° N', lon: '39.1925° E' },
} as const;
