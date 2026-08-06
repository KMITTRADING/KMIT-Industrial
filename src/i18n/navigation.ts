import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware navigation primitives.
 *
 * Always import `Link` from here, never from `next/link`: this wrapper carries
 * the active locale into the href so an Arabic page never links a reader into
 * the English tree by accident.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
