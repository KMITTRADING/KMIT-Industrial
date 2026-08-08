'use client';

import { Link } from '@/i18n/navigation';
import { track } from '@/lib/analytics';

import type { AnalyticsEvent, AnalyticsParams } from '@/lib/analytics';
import type { ComponentProps, ReactNode } from 'react';

/**
 * A link that records an event when it is followed.
 *
 * It exists because the pages that need measuring are server components, and a
 * server component cannot attach an `onClick`. Wrapping the link rather than
 * making the whole section a client component keeps the surrounding page
 * server-rendered and ships a few hundred bytes instead of a table.
 *
 * The event fires on click, not on navigation completion. A reader who
 * middle-clicks or opens in a new tab still counts, and one whose connection
 * drops mid-navigation counts too. That is the right bias for an intent event:
 * it measures the decision, not the network.
 */

export type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'onClick'> & {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
  children: ReactNode;
};

export function TrackedLink({ event, params = {}, children, ...props }: TrackedLinkProps) {
  return (
    <Link {...props} onClick={() => track(event, params)}>
      {children}
    </Link>
  );
}

export default TrackedLink;
