'use client';

import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/primitives';
import { readConsent, writeConsent } from '@/lib/analytics';

import type { ConsentState, QueuedEvent } from '@/lib/analytics';

/**
 * Consent gate and analytics loader.
 *
 * Nothing measures anyone until they say yes. Concretely:
 *
 * - No vendor script element is rendered while consent is `unknown` or
 *   `denied`, so there is no request, no cookie and no identifier.
 * - `track()` queues events in memory from the first paint. If consent is
 *   granted the queue is replayed; if it is denied the queue is discarded and
 *   the page never learns the difference. Call sites never branch on consent,
 *   which is what stops one component leaking a hit.
 * - The prompt is not a dark pattern. Accept and decline are the same size,
 *   the same shape and the same distance from the reader's hand, and declining
 *   is remembered as firmly as accepting.
 *
 * With `NEXT_PUBLIC_ANALYTICS_PROVIDER` unset, which is the current state, the
 * component renders nothing at all: there is no measurement ID, so asking for
 * consent to collect nothing would be theatre. See docs/measurement-plan.md.
 */

export type AnalyticsConsentProps = {
  provider: 'none' | 'ga4' | 'plausible';
  measurementId?: string | undefined;
};

export function AnalyticsConsent({ provider, measurementId }: AnalyticsConsentProps) {
  const t = useTranslations('consent');
  const [stored, setStored] = useState<ConsentState | undefined>(undefined);

  /**
   * The stored preference is read during render on the client rather than in an
   * effect. `localStorage` is unavailable on the server, so the first client
   * render adopts it and no second render is needed; reading it in an effect
   * would set state during commit, which is the pattern React now warns about.
   */
  const [readOnce, setReadOnce] = useState(false);
  if (typeof window !== 'undefined' && !readOnce) {
    setReadOnce(true);
    setStored(readConsent());
  }

  const hydrated = stored !== undefined;
  const state: ConsentState = stored ?? 'unknown';

  const active = provider !== 'none' && Boolean(measurementId);

  /** Wire the send function and flush anything recorded before consent. */
  useEffect(() => {
    if (!active || state !== 'granted') return;

    const send = (event: QueuedEvent) => {
      const layer = (window.dataLayer ??= []);
      layer.push({ event: event.name, ...event.params });
    };

    window.__kmitAnalyticsSend = send;
    const queued = window.__kmitAnalyticsQueue ?? [];
    window.__kmitAnalyticsQueue = [];
    for (const event of queued) send(event);

    return () => {
      delete window.__kmitAnalyticsSend;
    };
  }, [active, state]);

  const decide = useCallback((next: 'granted' | 'denied') => {
    writeConsent(next);
    setStored(next);
    if (next === 'denied') {
      window.__kmitAnalyticsQueue = [];
      delete window.__kmitAnalyticsSend;
    }
  }, []);

  if (!active) return null;

  return (
    <>
      {state === 'granted' && provider === 'ga4' && measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {state === 'granted' && provider === 'plausible' && measurementId ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={measurementId}
          strategy="afterInteractive"
        />
      ) : null}

      {/*
        Rendered only after hydration has read the stored preference. Showing the
        prompt during the server pass would flash it at a reader who decided
        months ago.
      */}
      {hydrated && state === 'unknown' ? (
        <div
          role="dialog"
          aria-labelledby="consent-heading"
          aria-describedby="consent-body"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-surface-page p-5 shadow-[0_-1px_0_0_var(--color-border-subtle)] md:p-6"
        >
          <div className="mx-auto flex max-w-[76rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p id="consent-heading" className="text-sm font-semibold text-ink-primary">
                {t('heading')}
              </p>
              <p id="consent-body" className="measure-prose mt-1 text-sm text-ink-secondary">
                {t('body')}
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <Button variant="secondary" onClick={() => decide('denied')}>
                {t('decline')}
              </Button>
              <Button variant="primary" onClick={() => decide('granted')}>
                {t('accept')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default AnalyticsConsent;
