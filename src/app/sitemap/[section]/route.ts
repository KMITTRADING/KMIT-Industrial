import { notFound } from 'next/navigation';

import { SITEMAP_SECTIONS, routesInSection } from '@/lib/routes';
import { XML_HEADERS, sitemapXml } from '@/lib/sitemap-xml';

import type { SitemapSection } from '@/lib/routes';

/**
 * /sitemap/[section].xml
 *
 * One file per page family. The `.xml` is part of the dynamic segment rather
 * than a route folder, because the section list is derived from
 * `SITEMAP_SECTIONS` and a folder per section would be a second place to
 * remember when one is added.
 *
 * Statically generated for the known sections and 404 for anything else, so a
 * crawler guessing at `/sitemap/blog.xml` gets an honest answer rather than an
 * empty `urlset` that looks like a section with no pages in it.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return SITEMAP_SECTIONS.map((section) => ({ section: `${section}.xml` }));
}

const isSection = (value: string): value is SitemapSection =>
  (SITEMAP_SECTIONS as readonly string[]).includes(value);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
): Promise<Response> {
  const { section: segment } = await params;
  const section = segment.replace(/\.xml$/, '');

  if (!isSection(section)) notFound();

  return new Response(sitemapXml(routesInSection(section), new Date()), {
    headers: XML_HEADERS,
  });
}
