import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /*
   * Both locales are prerendered to static HTML at build time. Every word of
   * copy exists in view-source before a script runs, which is what makes the
   * no-JS requirement in §12 pass rather than degrade.
   *
   * The previous build here rejected `output: 'export'`, on the grounds that a
   * static export cannot issue a real redirect for `/` — only a meta-refresh
   * stub, which is a weaker canonical signal. That was true of a generic host.
   * It is not true of this one: Netlify evaluates the redirect rules in
   * netlify.toml at the edge, before a file is served, so `/` gets a genuine
   * 301 to /ar and the site still ships with no server runtime at all.
   */
  output: 'export',

  // Art is authored at final dimensions with explicit width/height on every
  // <img> (see content/images.ts), so the runtime optimiser is dead weight —
  // and it does not run under `output: 'export'` in any case.
  images: { unoptimized: true },

  // Directory-style URLs, so /ar resolves to /ar/index.html without the host
  // needing a rewrite rule for extensionless paths.
  trailingSlash: false,

  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
