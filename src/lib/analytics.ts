/**
 * The measurement contract.
 *
 * Event names and their parameters are declared here, once, and the components
 * that fire them import from here. An analytics implementation that lets any
 * component invent an event name produces a property whose reports are a list
 * of near-duplicate strings within a quarter.
 *
 * Nothing in this module loads a vendor script or sends a request. It defines
 * the vocabulary and a queue; `AnalyticsProvider` decides whether anything is
 * ever dispatched, and that decision is gated on consent. See
 * docs/measurement-plan.md.
 */

export const ANALYTICS_EVENTS = [
  'rfq_started',
  'rfq_field_completed',
  'rfq_submitted',
  'tds_download',
  'grade_compared',
  'locale_switched',
  'contact_click',
  'whatsapp_click',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/**
 * Parameters carried by an event.
 *
 * Deliberately narrow: a grade code, a sector, a document type, a locale, a
 * field name, a step number. No free-form strings, no personal data. The RFQ
 * form carries a company name and an email address and neither of them belongs
 * in an analytics payload.
 */
export type AnalyticsParams = {
  /** Grade code, for example `GCC-1250`. */
  grade?: string;
  /** Sector id, for example `plastics-masterbatch`. */
  sector?: string;
  /** Document type: `tds`, `msds` or `coa`. */
  document?: string;
  /** BCP-47 locale, for `locale_switched`. */
  locale?: string;
  /** Field name, for `rfq_field_completed`. Never the field's value. */
  field?: string;
  /** Step index, for the multi-step RFQ form. */
  step?: number;
  /** Count, for `grade_compared`. */
  count?: number;
};

export type QueuedEvent = {
  name: AnalyticsEvent;
  params: AnalyticsParams;
  /** Milliseconds since navigation start, so ordering survives a delayed load. */
  at: number;
};

declare global {
  interface Window {
    /** Events recorded before consent, replayed if and only if consent is given. */
    __kmitAnalyticsQueue?: QueuedEvent[];
    /** Set by the provider once a vendor script is loaded and permitted. */
    __kmitAnalyticsSend?: (event: QueuedEvent) => void;
  }
}

/**
 * Record an event.
 *
 * Before consent this appends to an in-memory queue and sends nothing. That is
 * the important property: the call sites do not know or care whether consent
 * has been given, so no component can leak a hit by forgetting to check.
 */
export function track(name: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;

  const event: QueuedEvent = { name, params, at: Math.round(performance.now()) };

  if (window.__kmitAnalyticsSend) {
    window.__kmitAnalyticsSend(event);
    return;
  }

  window.__kmitAnalyticsQueue = [...(window.__kmitAnalyticsQueue ?? []), event].slice(-50);
}

/* --------------------------------------------------------------- consent */

export const CONSENT_STORAGE_KEY = 'kmit.analytics-consent';

export type ConsentState = 'granted' | 'denied' | 'unknown';

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
  } catch {
    // Storage can throw in a locked-down browser context. An unreadable
    // preference is an absent one, which means no measurement.
    return 'unknown';
  }
}

export function writeConsent(state: Exclude<ConsentState, 'unknown'>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch {
    // Nothing to do. The session stays unmeasured, which is the safe failure.
  }
}
