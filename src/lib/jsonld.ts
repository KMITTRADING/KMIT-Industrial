import { TYPICAL_PROPERTIES } from '@/content/data/grades';
import { absoluteUrl } from '@/lib/env';
import { getContent } from '@/content';
import { localeHtmlLang, locales } from '@/i18n/routing';

import type { Content, FaqSet, Grade } from '@/content/schema';
import type { Locale } from '@/i18n/routing';

/**
 * JSON-LD construction.
 *
 * Three rules hold everywhere in this module:
 *
 * 1. **Nothing is written here that is not on the page.** Structured data that
 *    disagrees with the visible document is a manual-action risk, and every
 *    value below is read from the same `src/content` tree and
 *    `src/content/data/grades.ts` the page renders from. There is no second
 *    copy of a mesh size or a purity figure to drift.
 * 2. **No field is invented to satisfy a validator.** `Offer` needs a price and
 *    there is no published price, so grade pages carry no offer rather than a
 *    fabricated one. `foundingDate`, `telephone` and `sameAs` are absent for
 *    the same reason: they are open items in docs/technical-data.md §8.
 * 3. **One graph per page.** Organization, WebSite and BreadcrumbList are
 *    cross-referenced by `@id` rather than repeated inline, so a consumer
 *    resolves one entity for the company instead of reconciling six copies.
 */

/** A JSON-LD node. Loose by nature, but never `any`. */
export type JsonLdValue =
  string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue | undefined };

export type JsonLdNode = { [key: string]: JsonLdValue | undefined };

/** Stable `@id` values, so every page points at the same two entities. */
export const ORGANIZATION_ID = absoluteUrl('/#organization');
export const WEBSITE_ID = absoluteUrl('/#website');

/**
 * Drops keys whose value is undefined.
 *
 * Emitting `"telephone": null` tells a consumer the company has no telephone.
 * Omitting the key tells it nothing, which is the accurate statement while the
 * number is an open data item.
 */
function compact(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => value !== undefined),
  ) as JsonLdNode;
}

/* -------------------------------------------------------------- entities */

/**
 * The company.
 *
 * Address is city and country only: `streetAddress` and `postalCode` are open
 * items, and a partial `PostalAddress` is honest where an invented one is not.
 * `contactPoint` carries no telephone for the same reason, and exists to state
 * the two contact types and that both languages are served.
 */
export function organizationJsonLd(locale: Locale): JsonLdNode {
  const content = getContent(locale);

  return compact({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: content.meta.siteName,
    url: absoluteUrl(`/${locale}`),
    description: content.meta.defaultDescription,
    logo: compact({
      '@type': 'ImageObject',
      url: absoluteUrl('/brand/logo.svg'),
      contentUrl: absoluteUrl('/brand/logo.svg'),
    }),
    address: compact({
      '@type': 'PostalAddress',
      addressLocality: content.jsonld.addressLocality,
      addressCountry: 'SA',
    }),
    areaServed: [
      compact({ '@type': 'Country', name: content.jsonld.areaServedCountry }),
      compact({ '@type': 'Place', name: content.jsonld.areaServedRegion }),
    ],
    knowsLanguage: locales.map((candidate) => localeHtmlLang[candidate]),
    contactPoint: [
      compact({
        '@type': 'ContactPoint',
        contactType: 'sales',
        name: content.pages.contactCommercialHeading,
        availableLanguage: locales.map((candidate) => localeHtmlLang[candidate]),
        areaServed: 'SA',
      }),
      compact({
        '@type': 'ContactPoint',
        contactType: 'technical support',
        name: content.pages.contactTechnicalHeading,
        availableLanguage: locales.map((candidate) => localeHtmlLang[candidate]),
        areaServed: 'SA',
      }),
    ],
  });
}

/**
 * The site.
 *
 * No `SearchAction`: there is no site search, and advertising a search endpoint
 * that does not exist is the most common invented field in this schema.
 */
export function websiteJsonLd(locale: Locale): JsonLdNode {
  const content = getContent(locale);

  return compact({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl(`/${locale}`),
    name: content.meta.siteName,
    description: content.meta.defaultDescription,
    inLanguage: localeHtmlLang[locale],
    publisher: { '@id': ORGANIZATION_ID },
  });
}

export type Crumb = { name: string; path?: string };

/**
 * Breadcrumbs, mirroring the visible trail exactly.
 *
 * The last crumb carries no `item`: it is the current page, and pointing a
 * breadcrumb at itself is what makes a trail loop in a rich result.
 */
export function breadcrumbJsonLd(locale: Locale, crumbs: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) =>
      compact({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.path === undefined ? undefined : absoluteUrl(`/${locale}${crumb.path}`),
      }),
    ),
  };
}

/* --------------------------------------------------------------- product */

/** Unit strings per TDS parameter, keyed the way the dataset keys them. */
const PROPERTY_UNITS: Record<string, string | undefined> = {
  'caco3-purity': '%',
  whiteness: '%',
  fe2o3: '%',
  sio2: '%',
  mgo: '%',
  moisture: '%',
  ph: undefined,
  'bulk-density': 'g/cm3',
  'oil-absorption': 'g/100g',
  'mohs-hardness': undefined,
};

/**
 * Every published specification for one grade, as `PropertyValue` nodes.
 *
 * This is the part of the schema that machine readers actually consume, so it
 * carries the full table rather than a summary: the ten family-level TDS
 * parameters from docs/technical-data.md §2, plus the four values that are
 * specific to this grade.
 *
 * Family-level values are published as strings ("≥ 98.5", "95.0 - 98.5")
 * because that is how the source states them and how the page renders them.
 * The grade-specific ranges are numeric, so they use `minValue` and `maxValue`
 * where a consumer can compare them.
 */
function gradeProperties(grade: Grade, content: Content): JsonLdNode[] {
  const family = TYPICAL_PROPERTIES.map((property) =>
    compact({
      '@type': 'PropertyValue',
      propertyID: property.id,
      name: content.parameters[property.id],
      value: property.value,
      unitText: PROPERTY_UNITS[property.id],
      measurementTechnique: property.method,
    }),
  );

  const specific: JsonLdNode[] = [
    compact({
      '@type': 'PropertyValue',
      propertyID: 'mesh',
      name: content.grades.columnMesh,
      value: grade.mesh,
      unitText: content.units.mesh,
    }),
    compact({
      '@type': 'PropertyValue',
      propertyID: 'd50',
      name: content.grades.columnD50,
      minValue: grade.d50Min,
      maxValue: grade.d50Max,
      unitText: content.units.micron,
      unitCode: '4H',
    }),
    compact({
      '@type': 'PropertyValue',
      propertyID: 'shelf-life',
      name: content.grades.columnShelfLife,
      value: grade.shelfLifeMonths,
      unitText: content.units.months,
    }),
  ];

  if (grade.coatingLevel) {
    specific.push(
      compact({
        '@type': 'PropertyValue',
        propertyID: 'surface-coating',
        name: content.grades.columnCoating,
        minValue: grade.coatingLevel.min,
        maxValue: grade.coatingLevel.max,
        unitText: '%',
        description: content.coatingAgents[grade.coatingLevel.agent],
      }),
    );
  }

  return [...family, ...specific];
}

/**
 * One grade.
 *
 * No `offers`. `Offer` requires a price and an availability, and this is an
 * enquiry-led B2B supply where price is a function of grade, volume, packaging
 * and destination. Emitting `"price": "0"` to satisfy a rich-result checklist
 * would publish a false commercial term.
 */
export function productJsonLd(
  locale: Locale,
  grade: Grade,
  options: { description: string; canonicalPath: string },
): JsonLdNode {
  const content = getContent(locale);

  const applications = grade.applications.map(
    (application) => content.applications[application],
  );

  return compact({
    '@type': 'Product',
    '@id': absoluteUrl(`/${locale}${options.canonicalPath}#product`),
    name: grade.code,
    sku: grade.code,
    mpn: grade.code,
    description: options.description,
    url: absoluteUrl(`/${locale}${options.canonicalPath}`),
    inLanguage: localeHtmlLang[locale],
    brand: { '@id': ORGANIZATION_ID },
    manufacturer: { '@id': ORGANIZATION_ID },
    material: content.jsonld.material,
    category: content.jsonld.productCategory,
    keywords: applications.join(', '),
    additionalProperty: gradeProperties(grade, content),
  });
}

/* ------------------------------------------------------------- item list */

/**
 * An ordered list of pages, for an index route.
 *
 * `ItemList` with `url` per element rather than nested full objects: the
 * linked pages carry their own markup, and inlining a summary of each one here
 * creates a second description that can disagree with the first.
 */
export function itemListJsonLd(
  locale: Locale,
  items: { name: string; path: string }[],
): JsonLdNode {
  return {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(`/${locale}${item.path}`),
    })),
  };
}

/* ----------------------------------------------------------------- faq */

/**
 * The visible FAQ, mirrored.
 *
 * Built from the same `FaqSet` the page renders, so the two cannot diverge.
 * Google requires the answer to be visible on the page, which is one more
 * reason `FaqList` renders open rather than behind an accordion.
 */
export function faqPageJsonLd(faqs: FaqSet): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: Object.values(faqs).map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };
}

/* --------------------------------------------------------------- render */

/**
 * Wraps nodes in a single `@graph` and returns the script props.
 *
 * One script per page. Multiple `application/ld+json` blocks are legal, but a
 * single graph is what lets `@id` references resolve without the consumer
 * having to merge documents first.
 */
export function jsonLdScript(nodes: (JsonLdNode | undefined)[]): {
  type: 'application/ld+json';
  dangerouslySetInnerHTML: { __html: string };
} {
  const graph = nodes.filter((node): node is JsonLdNode => node !== undefined);

  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      // `<` is the only character that can break out of a script element in
      // HTML parsing; escaping it is what makes embedding JSON here safe.
      __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
        /</g,
        '\\u003c',
      ),
    },
  };
}
