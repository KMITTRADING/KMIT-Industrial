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

const siteUrlSchema = z.url(
  'NEXT_PUBLIC_SITE_URL must be an absolute URL, e.g. https://kmit.example',
);

/* --------------------------------------------------------- the base URL */

/**
 * Where the base URL came from. Reported in the build log and used by the
 * production guard below.
 */
type SiteUrlSource =
  'NEXT_PUBLIC_SITE_URL' | 'NETLIFY_URL' | 'NETLIFY_DEPLOY_PRIME_URL' | 'development fallback';

/**
 * Resolve the site's own address.
 *
 * This used to be a zod `.default('http://localhost:3000')`, and that default
 * was a silent production failure waiting to happen: `NEXT_PUBLIC_SITE_URL` was
 * never set in the deploy environment, so every canonical, every hreflang, every
 * `og:url` and every JSON-LD `@id` on the live site pointed at localhost. The
 * site built, deployed and served without a single error.
 *
 * Two changes stop it recurring. The fallback chain now reads the host's own
 * variables, which Netlify injects on every build, so the correct value does not
 * depend on anybody remembering a dashboard field. And the guard below turns a
 * localhost base URL in a production build into a build failure.
 *
 * `DEPLOY_PRIME_URL` is preferred outside the production context so a deploy
 * preview canonicalises to itself rather than to the live domain. A preview that
 * advertises production canonicals is asking a crawler to index the preview's
 * content under the production URL.
 */
function resolveSiteUrl(): { value: string; source: SiteUrlSource } {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return { value: explicit, source: 'NEXT_PUBLIC_SITE_URL' };

  const context = process.env.CONTEXT;
  const deployPrime = process.env.DEPLOY_PRIME_URL?.trim();
  const primary = process.env.URL?.trim();

  if (context && context !== 'production' && deployPrime) {
    return { value: deployPrime, source: 'NETLIFY_DEPLOY_PRIME_URL' };
  }
  if (primary) return { value: primary, source: 'NETLIFY_URL' };
  if (deployPrime) return { value: deployPrime, source: 'NETLIFY_DEPLOY_PRIME_URL' };

  return { value: 'http://localhost:3000', source: 'development fallback' };
}

const resolvedSiteUrl = resolveSiteUrl();

/**
 * Trailing slashes are stripped rather than rejected. The host supplies `URL`
 * and `DEPLOY_PRIME_URL` in a form this codebase does not control, so refusing
 * a trailing slash would turn somebody else's formatting choice into a failed
 * deploy.
 */
const siteUrlValue = resolvedSiteUrl.value.replace(/\/+$/, '');

const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|\/|$)/i;

/**
 * A production build must know its own address.
 *
 * Without this the failure mode is silent and total: the whole bilingual
 * structure, canonical, hreflang and all, points at a host no crawler can
 * reach, and nothing anywhere reports a problem.
 */
if (process.env.NODE_ENV === 'production' && LOCAL_HOST.test(siteUrlValue)) {
  throw new Error(
    [
      `Refusing to build: the site URL resolved to ${siteUrlValue} (source: ${resolvedSiteUrl.source}).`,
      '',
      'A production build must know its own public address. Every canonical, hreflang,',
      'og:url, sitemap entry and JSON-LD @id is built from it, and a localhost value',
      'makes all of them unreachable while the build still succeeds.',
      '',
      'Fix by setting one of:',
      '  - NEXT_PUBLIC_SITE_URL, e.g. https://kmit.example (no trailing slash), or',
      '  - deploy on a host that provides URL / DEPLOY_PRIME_URL (Netlify does both).',
      '',
      'For a local production build, set it inline:',
      '  NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000 is still refused; use a real hostname',
      '  such as NEXT_PUBLIC_SITE_URL=https://local.invalid npm run build',
    ].join('\n'),
  );
}

const rfqDriverSchema = z.enum(['console', 'resend', 'webhook']).default('console');

/**
 * Analytics provider. `none` is the default and the current state: no
 * measurement ID has been issued, so nothing loads and nothing is sent. The
 * consent machinery ships anyway, because retrofitting consent onto a live
 * property is how a site ends up having collected data it should not have.
 */
const analyticsProviderSchema = z.enum(['none', 'ga4', 'plausible']).default('none');

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrlSchema,
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
  NEXT_PUBLIC_SITE_URL: siteUrlValue,
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

/**
 * Whether this deploy may be indexed.
 *
 * False on anything that is not the production context: deploy previews and
 * branch deploys serve the whole site on a `netlify.app` address, and an
 * indexed preview becomes a duplicate-content and migration problem the day the
 * real domain goes live. `robots.ts` and the layout's robots metadata both read
 * this, so the decision is made once. See ADR-050.
 */
const isIndexableDeploy = (() => {
  // A non-Netlify environment (local, CI) is not a public deploy either way;
  // treat it as indexable so the gates see the production shape of the output.
  const context = process.env.CONTEXT;
  if (context) return context === 'production';
  return !/\.netlify\.app$/i.test(new URL(siteUrlValue).hostname);
})();

export const env = {
  siteUrl: raw.NEXT_PUBLIC_SITE_URL,
  siteUrlSource: resolvedSiteUrl.source,
  isIndexableDeploy,
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

/*
  Print the resolved base URL once per server process.

  A deploy that silently used the wrong address is exactly what this phase is
  remediating, so the value and where it came from are now in the build log
  where somebody reading a deploy can see them.
*/
if (process.env.NODE_ENV === 'production') {
  console.log(
    `[env] site URL ${env.siteUrl} (source: ${env.siteUrlSource}, indexable: ${env.isIndexableDeploy})`,
  );
}

/** Absolute URL for a site-relative path. Never build one by concatenation. */
export function absoluteUrl(path: string): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, `${env.siteUrl}/`).toString();
}
