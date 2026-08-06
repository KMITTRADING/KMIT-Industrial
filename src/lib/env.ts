import { z } from 'zod';

/**
 * Environment validation.
 *
 * The domain is not known yet and must not be hardcoded anywhere in the
 * codebase. Everything that needs an absolute URL — canonicals, hreflang, the
 * sitemap, OG tags, JSON-LD `@id` values — reads `siteUrl` from here, so
 * pointing the site at its real domain is an environment change, not a code
 * change.
 */

const siteUrlSchema = z
  .url('NEXT_PUBLIC_SITE_URL must be an absolute URL, e.g. https://kmit.example')
  .refine((value) => !value.endsWith('/'), {
    message:
      'NEXT_PUBLIC_SITE_URL must not end with a slash — paths are joined onto it directly',
  });

const rfqDriverSchema = z.enum(['console', 'resend', 'webhook']).default('console');

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrlSchema.default('http://localhost:3000'),
  RFQ_DRIVER: rfqDriverSchema,
  RESEND_API_KEY: z.string().optional(),
  RFQ_TO_EMAIL: z.email().optional(),
  RFQ_FROM_EMAIL: z.email().optional(),
  RFQ_WEBHOOK_URL: z.url().optional(),
  RFQ_WEBHOOK_SECRET: z.string().optional(),
});

/**
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time only when it is
 * referenced statically, so the public value is read by its literal name rather
 * than pulled off a spread of `process.env`.
 */
const parsed = serverSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RFQ_DRIVER: process.env.RFQ_DRIVER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RFQ_TO_EMAIL: process.env.RFQ_TO_EMAIL,
  RFQ_FROM_EMAIL: process.env.RFQ_FROM_EMAIL,
  RFQ_WEBHOOK_URL: process.env.RFQ_WEBHOOK_URL,
  RFQ_WEBHOOK_SECRET: process.env.RFQ_WEBHOOK_SECRET,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

const raw = parsed.data;

export const env = {
  siteUrl: raw.NEXT_PUBLIC_SITE_URL,
  rfq: {
    driver: raw.RFQ_DRIVER,
    resend: {
      apiKey: raw.RESEND_API_KEY,
      to: raw.RFQ_TO_EMAIL,
      from: raw.RFQ_FROM_EMAIL,
    },
    webhook: {
      url: raw.RFQ_WEBHOOK_URL,
      secret: raw.RFQ_WEBHOOK_SECRET,
    },
  },
} as const;

/** Absolute URL for a site-relative path. Never build one by concatenation. */
export function absoluteUrl(path: string): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, `${env.siteUrl}/`).toString();
}
