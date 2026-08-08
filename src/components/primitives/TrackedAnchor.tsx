'use client';

import { track } from '@/lib/analytics';

import type { AnalyticsEvent, AnalyticsParams } from '@/lib/analytics';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * An external anchor that records an event when it is followed.
 *
 * The sibling of `TrackedLink`, for destinations that are not site routes:
 * `tel:`, `mailto:`, `https://wa.me/...`. Those cannot go through the i18n
 * `Link`, which resolves against the locale-prefixed route table.
 */

export type TrackedAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> & {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
  children: ReactNode;
};

export function TrackedAnchor({ event, params = {}, children, ...props }: TrackedAnchorProps) {
  return (
    <a {...props} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}

export default TrackedAnchor;
