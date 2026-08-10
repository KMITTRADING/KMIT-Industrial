import { vi } from 'vitest';
import { describe, expect, it } from 'vitest';

/**
 * The production guard on the site URL.
 *
 * Phase 8 remediated a deploy where every canonical, hreflang, og:url and
 * JSON-LD @id pointed at localhost because `NEXT_PUBLIC_SITE_URL` was unset and
 * the schema carried a localhost default. The build succeeded and nothing
 * reported a problem, which is the whole reason this test exists: the guard is
 * the only thing standing between a misconfigured environment and a silently
 * unindexable site.
 *
 * `src/lib/env.ts` throws at module scope, so each case re-imports it with a
 * fresh module registry and its own environment.
 */

async function loadEnv(overrides: Record<string, string | undefined>) {
  const previous = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    vi.resetModules();
    return await import('@/lib/env');
  } finally {
    process.env = previous;
  }
}

describe('the site URL guard', () => {
  it('refuses a production build that resolved to localhost', async () => {
    await expect(
      loadEnv({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: undefined,
        URL: undefined,
        DEPLOY_PRIME_URL: undefined,
        CONTEXT: undefined,
      }),
    ).rejects.toThrow(/Refusing to build/);
  });

  it('accepts an explicit site URL', async () => {
    const { env } = await loadEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://kmit.example',
      URL: undefined,
      DEPLOY_PRIME_URL: undefined,
      CONTEXT: undefined,
    });
    expect(env.siteUrl).toBe('https://kmit.example');
    expect(env.siteUrlSource).toBe('NEXT_PUBLIC_SITE_URL');
  });

  it("falls back to the host's own URL in the production context", async () => {
    const { env } = await loadEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: undefined,
      CONTEXT: 'production',
      URL: 'https://kmit.example',
      DEPLOY_PRIME_URL: undefined,
    });
    expect(env.siteUrl).toBe('https://kmit.example');
    expect(env.isIndexableDeploy).toBe(true);
  });

  it('canonicalises a deploy preview to itself, and closes it to crawlers', async () => {
    const { env } = await loadEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: undefined,
      CONTEXT: 'deploy-preview',
      URL: 'https://kmit-industrial.netlify.app',
      DEPLOY_PRIME_URL: 'https://deploy-preview-12--kmit-industrial.netlify.app',
    });
    expect(env.siteUrl).toBe('https://deploy-preview-12--kmit-industrial.netlify.app');
    expect(env.isIndexableDeploy).toBe(false);
  });

  it('strips a trailing slash rather than failing the deploy', async () => {
    const { env } = await loadEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: undefined,
      CONTEXT: 'production',
      URL: 'https://kmit.example/',
      DEPLOY_PRIME_URL: undefined,
    });
    expect(env.siteUrl).toBe('https://kmit.example');
  });
});
