import { dict } from '@/content';
import type { Locale, RouteKey } from './i18n';

/** The three sectors, in the order §1 fixes them. There is no fourth. */
export const SECTOR_SLUGS = [
  'industrial-minerals',
  'marble-transport',
  'solar-panels',
] as const;

export type SectorSlug = (typeof SECTOR_SLUGS)[number];

export function isSectorSlug(value: string): value is SectorSlug {
  return (SECTOR_SLUGS as readonly string[]).includes(value);
}

export function sectorRoute(slug: SectorSlug): RouteKey {
  return `sectors/${slug}` as RouteKey;
}

/** The other two sectors, for the "KMIT also works on" bar (§9). */
export function otherSectors(slug: SectorSlug): SectorSlug[] {
  return SECTOR_SLUGS.filter((s) => s !== slug);
}

export function sectorContent(locale: Locale, slug: SectorSlug) {
  return dict(locale).sectorPages[slug];
}
