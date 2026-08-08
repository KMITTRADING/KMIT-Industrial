import type { FooterLink } from '@/components/layout';
import type { NavItem } from '@/components/layout';

/**
 * The site's own route table, in one place.
 *
 * Header and footer both read from here, so a route can never appear in one and
 * not the other, and adding a page is one edit rather than three.
 *
 * Five primary items, which is the cap in CLAUDE.md. The RFQ is an action
 * rather than a nav item and is rendered separately; the styleguide is internal
 * and is deliberately absent from both.
 *
 * The guides sit in the footer rather than in the header, and that is a
 * deliberate trade. They are the informational surface: a reader arrives on one
 * from a search or an assistant rather than by navigating to it, and spending
 * one of five header slots on them would have cost either the facility page or
 * the document library, both of which a returning buyer navigates to on
 * purpose. Every guide is still linked from the pages it belongs to.
 */

export const SITE_NAV: NavItem[] = [
  { key: 'products', href: '/products', mega: 'grades' },
  { key: 'applications', href: '/applications' },
  { key: 'facility', href: '/sustainability-and-facility' },
  { key: 'resources', href: '/resources' },
  { key: 'contact', href: '/contact' },
];

export const FOOTER_LINKS: FooterLink[] = [
  { key: 'products', href: '/products' },
  { key: 'applications', href: '/applications' },
  { key: 'guides', href: '/guides' },
  { key: 'facility', href: '/sustainability-and-facility' },
  { key: 'resources', href: '/resources' },
  { key: 'contact', href: '/contact' },
  { key: 'rfq', href: '/rfq' },
];
