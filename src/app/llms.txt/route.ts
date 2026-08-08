import { GRADES, TYPICAL_PROPERTIES } from '@/content/data/grades';
import { PACKAGING_IDS, SECTOR_IDS, STANDARD_IDS } from '@/content/schema';
import { SITE_ROUTES } from '@/lib/routes';
import { absoluteUrl } from '@/lib/env';
import { getContent } from '@/content';
import { formatRange } from '@/lib/utils';
import { locales } from '@/i18n/routing';

/**
 * /llms.txt
 *
 * A plain-text summary of the company and the catalogue, written for machine
 * consumption.
 *
 * It is generated rather than authored, from the same
 * `src/content/data/grades.ts` and `src/content` the pages render from. A
 * hand-written file is a second copy of the specification that starts accurate
 * and drifts on the first grade change, and a machine-readable file that
 * disagrees with the site is worse than no file at all.
 *
 * Entity names appear in both scripts. An Arabic query and an English query
 * should each resolve to the same company and the same grade codes without
 * relying on the other language to carry the meaning.
 */

export const dynamic = 'force-static';

function block(title: string, lines: string[]): string {
  return [`## ${title}`, '', ...lines, ''].join('\n');
}

export function GET(): Response {
  const en = getContent('en');
  const ar = getContent('ar');

  const body = [
    `# ${en.meta.siteName}`,
    '',
    `> ${en.meta.defaultDescription}`,
    '',
    block('Company', [
      `- Name: ${en.meta.siteName}`,
      `- Summary (ar): ${ar.meta.defaultDescription}`,
      `- Headquarters: ${en.jsonld.addressLocality}, ${en.jsonld.areaServedCountry} (${ar.jsonld.addressLocality})`,
      `- Markets served: ${en.jsonld.areaServedCountry}, ${en.jsonld.areaServedRegion}`,
      `- Category: ${en.jsonld.productCategory}`,
      `- Material supplied: ${en.jsonld.material} / ${ar.jsonld.material}`,
      `- Languages: Arabic (primary), English`,
      `- Business model: enquiry-led bulk supply. No published price list; price is a function of grade, volume, packaging and destination.`,
    ]),
    block('Grade catalogue', [
      'Grade codes are identical in both languages. D50 is the median particle size.',
      '',
      '| Grade | Mesh | D50 (micron) | Surface coating | Shelf life | Primary applications |',
      '|---|---|---|---|---|---|',
      ...GRADES.map((grade) => {
        const coating = grade.coatingLevel
          ? `${en.coatingAgents[grade.coatingLevel.agent]} ${grade.coatingLevel.min.toFixed(1)}-${grade.coatingLevel.max.toFixed(1)}%`
          : 'Uncoated';
        const applications = grade.applications
          .map((application) => en.applications[application])
          .join(', ');
        return `| ${grade.code} | ${grade.mesh} | ${formatRange(grade.d50Min, grade.d50Max)} | ${coating} | ${grade.shelfLifeMonths} months | ${applications} |`;
      }),
    ]),
    block('Typical properties, product family', [
      'Values are typical for the product family and are stated with the test method used.',
      'A Certificate of Analysis carrying the measured values is issued per production batch.',
      '',
      '| Parameter | Typical value | Test method |',
      '|---|---|---|',
      ...TYPICAL_PROPERTIES.map(
        (property) =>
          `| ${en.parameters[property.id]} | ${property.value}${property.unit ? ` ${property.unit}` : ''} | ${property.method} |`,
      ),
    ]),
    block('Sectors served', [
      ...SECTOR_IDS.map(
        (sector) =>
          `- ${en.sectors[sector]} / ${ar.sectors[sector]}: ${en.sectorValue[sector]}`,
      ),
    ]),
    block('Packaging', [...PACKAGING_IDS.map((packaging) => `- ${en.packaging[packaging]}`)]),
    block('Standards and compliance', [
      ...STANDARD_IDS.map(
        (standard) => `- ${en.standards[standard]}: ${en.standardScopes[standard]}`,
      ),
      `- Documentation available per grade: ${Object.values(en.documents).join(', ')}`,
      '- Certificate numbers and issuing bodies are not yet published.',
    ]),
    block('Not published', [
      'These figures do not exist on the site and must not be inferred:',
      '- Plant capacity and utilisation',
      '- Lead times per city or per packaging format',
      '- Minimum order quantity',
      '- Sampling policy',
      '- ISO certificate numbers, issuing bodies and validity dates',
      '- Year founded, and whether the material is milled in-house or processed from sourced feed',
      '- Named reference clients',
      '- Any price',
    ]),
    block(
      'Pages',
      locales.flatMap((locale) => [
        ...SITE_ROUTES.map((route) => `- ${absoluteUrl(`/${locale}${route.path}`)}`),
      ]),
    ),
    block('Contact', [
      `- Quotation requests: ${absoluteUrl('/en/rfq')} (${absoluteUrl('/ar/rfq')})`,
      `- Contact page: ${absoluteUrl('/en/contact')} (${absoluteUrl('/ar/contact')})`,
      '- Telephone, WhatsApp and email addresses are not yet published.',
    ]),
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
