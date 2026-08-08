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
  { key: 'facility', href: '/sustainability-and-facility' },
  { key: 'resources', href: '/resources' },
  { key: 'contact', href: '/contact' },
  { key: 'rfq', href: '/rfq' },
];
