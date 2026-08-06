import 'server-only';

import { z } from 'zod';

import { APPLICATION_IDS, PACKAGING_IDS } from '@/content/schema';
import { GRADES } from '@/content/data/grades';
import { env } from '@/lib/env';
import { locales } from '@/i18n/routing';

/**
 * RFQ submission, behind one interface with swappable drivers.
 *
 * The client has not chosen a destination for enquiries yet — inbox, CRM, or an
 * internal endpoint — so nothing in the application knows where an RFQ goes.
 * Pages and forms call `submitRfq()`. Which driver runs is an environment
 * decision (`RFQ_DRIVER`), and adding a fourth driver means adding one function
 * to the map at the bottom of this file and nothing else.
 *
 * `console` ships active. It is a real driver, not a stub: it validates, it
 * returns a reference, and it writes the payload where a developer can read it.
 */

const gradeCodes = GRADES.map((grade) => grade.code) as [string, ...string[]];

export const rfqPayloadSchema = z.object({
  /** Which locale the enquiry was submitted from — drives the reply language. */
  locale: z.enum(locales),

  company: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  email: z.email().trim(),
  /** E.164-ish. Deliberately permissive: GCC numbers are written many ways. */
  phone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^[+0-9()\-\s]+$/, 'Phone may contain digits, spaces, +, -, and parentheses only'),

  /** Prefilled from the grade page the enquiry started on. */
  grade: z.enum(gradeCodes).nullable(),
  /** Prefilled from the application page the enquiry started on. */
  application: z.enum(APPLICATION_IDS).nullable(),
  packaging: z.enum(PACKAGING_IDS).nullable(),

  /** Tonnes per order or per month — the buyer decides which, and says so in `message`. */
  quantityTonnes: z.number().positive().max(100_000).nullable(),
  destinationCity: z.string().trim().min(2).max(80),
  destinationCountry: z.string().trim().min(2).max(80),

  message: z.string().trim().max(2000).default(''),

  /** Honeypot. A real browser leaves it empty; most bots fill it. */
  website: z.string().max(0).optional(),
});

export type RfqPayload = z.infer<typeof rfqPayloadSchema>;

export type RfqResult =
  | { ok: true; reference: string; driver: RfqDriverName }
  | { ok: false; error: 'validation'; issues: string[] }
  | { ok: false; error: 'misconfigured'; message: string }
  | { ok: false; error: 'delivery'; message: string };

export type RfqDriverName = 'console' | 'resend' | 'webhook';

type RfqDriver = (payload: RfqPayload, reference: string) => Promise<RfqResult>;

/** Human-quotable reference, e.g. RFQ-8F3K2Q. Not a security token. */
function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `RFQ-${suffix}`;
}

function summarise(payload: RfqPayload): string {
  const parts = [
    payload.grade ?? 'grade not specified',
    payload.quantityTonnes ? `${payload.quantityTonnes} t` : 'quantity not specified',
    payload.application ?? 'application not specified',
    `${payload.destinationCity}, ${payload.destinationCountry}`,
  ];
  return parts.join(' · ');
}

/* ---------------------------------------------------------------- drivers */

const consoleDriver: RfqDriver = async (payload, reference) => {
  console.info(
    `[rfq:console] ${reference} — ${summarise(payload)}\n${JSON.stringify(payload, null, 2)}`,
  );
  return { ok: true, reference, driver: 'console' };
};

const resendDriver: RfqDriver = async (payload, reference) => {
  const { apiKey, to, from } = env.rfq.resend;
  if (!apiKey || !to || !from) {
    return {
      ok: false,
      error: 'misconfigured',
      message: 'RFQ_DRIVER=resend requires RESEND_API_KEY, RFQ_TO_EMAIL and RFQ_FROM_EMAIL',
    };
  }

  const lines = [
    `Reference: ${reference}`,
    `Locale: ${payload.locale}`,
    `Company: ${payload.company}`,
    `Contact: ${payload.contactName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Grade: ${payload.grade ?? '—'}`,
    `Application: ${payload.application ?? '—'}`,
    `Packaging: ${payload.packaging ?? '—'}`,
    `Quantity (t): ${payload.quantityTonnes ?? '—'}`,
    `Destination: ${payload.destinationCity}, ${payload.destinationCountry}`,
    '',
    payload.message || '(no message)',
  ];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `${reference} — ${summarise(payload)}`,
      text: lines.join('\n'),
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: 'delivery',
      message: `Resend responded ${response.status}`,
    };
  }

  return { ok: true, reference, driver: 'resend' };
};

const webhookDriver: RfqDriver = async (payload, reference) => {
  const { url, secret } = env.rfq.webhook;
  if (!url) {
    return {
      ok: false,
      error: 'misconfigured',
      message: 'RFQ_DRIVER=webhook requires RFQ_WEBHOOK_URL',
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'X-KMIT-Signature': secret } : {}),
    },
    body: JSON.stringify({ reference, submittedAt: new Date().toISOString(), ...payload }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: 'delivery',
      message: `Webhook responded ${response.status}`,
    };
  }

  return { ok: true, reference, driver: 'webhook' };
};

const DRIVERS: Record<RfqDriverName, RfqDriver> = {
  console: consoleDriver,
  resend: resendDriver,
  webhook: webhookDriver,
};

/* ------------------------------------------------------------------ entry */

/**
 * Validate and dispatch an RFQ. The only entry point — no page or form talks to
 * a driver directly.
 */
export async function submitRfq(input: unknown): Promise<RfqResult> {
  const parsed = rfqPayloadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: 'validation',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
      ),
    };
  }

  // Honeypot filled: accept silently so the bot does not learn it was caught,
  // and never deliver it.
  if (parsed.data.website) {
    return { ok: true, reference: makeReference(), driver: env.rfq.driver };
  }

  const reference = makeReference();
  const driver = DRIVERS[env.rfq.driver];

  try {
    return await driver(parsed.data, reference);
  } catch (cause) {
    return {
      ok: false,
      error: 'delivery',
      message: cause instanceof Error ? cause.message : 'Unknown delivery failure',
    };
  }
}
