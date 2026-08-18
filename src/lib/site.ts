/**
 * Approved constants (§1). Nothing in this file may be invented — every value
 * here was supplied. Anything that was not supplied stays `null` and surfaces
 * as a designed PlaceholderBlock, never as filler copy (§4).
 */

export const SITE = {
  brandShort: 'KMIT',
  nameEn: 'KMIT Industrial',
  nameAr: 'كميت الصناعية',

  /* TODO-CONTENT: founding year not supplied. While null, the About timeline
     renders its placeholder state instead of a year. Do not guess. */
  founded: null as string | null,

  /* TODO-CONTENT: no tagline supplied in §1. The hero uses the approved
     headline options from §8.1 instead, which are real sentences rather than a
     slogan, so nothing is fabricated to fill this. */
  taglineAr: null as string | null,
  taglineEn: null as string | null,

  hqCityAr: 'جدة',
  hqCityEn: 'Jeddah',
  countryAr: 'المملكة العربية السعودية',
  countryEn: 'Saudi Arabia',
  addressAr: 'جدة، المملكة العربية السعودية',
  addressEn: 'Jeddah, Saudi Arabia',

  email: 'mohanad@kmit.co',
  phoneDisplay: '057 495 0950',
  phoneIntl: '+966574950950',

  /** Public origin. Override at build time with SITE_URL for previews. */
  origin: (process.env.SITE_URL ?? 'https://kmit.co').replace(/\/$/, ''),

  logoFull: '/brand/KMIT_Industrial_Logo.svg',
  logoIcon: '/brand/KMIT_Industrial_Icon.svg',
} as const;

/** Google Maps link for the HQ city only. No unverified coordinates (§15.1). */
export const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Jeddah, Saudi Arabia');

export const TEL_HREF = `tel:${SITE.phoneIntl}`;
export const MAILTO_HREF = `mailto:${SITE.email}`;
