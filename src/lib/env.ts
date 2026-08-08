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

/**
 * Analytics provider. `none` is the default and the current state: no
 * measurement ID has been issued, so nothing loads and nothing is sent. The
 * consent machinery ships anyway, because retrofitting consent onto a live
 * property is how a site ends up having collected data it should not have.
 */
const analyticsProviderSchema = z.enum(['none', 'ga4', 'plausible']).default('none');

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrlSchema.default('http://localhost:3000'),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: analyticsProviderSchema,
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
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
  NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
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
  analytics: {
    provider: raw.NEXT_PUBLIC_ANALYTICS_PROVIDER,
    id: raw.NEXT_PUBLIC_ANALYTICS_ID,
  },
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
