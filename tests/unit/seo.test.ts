import { describe, expect, it } from 'vitest';

import { GRADES } from '@/content/data/grades';
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  productJsonLd,
} from '@/lib/jsonld';
import { getContent } from '@/content';
import { localeAlternates, noindexAlternates } from '@/lib/seo';
import { locales } from '@/i18n/routing';

/**
 * Metadata and structured-data generators.
 *
 * `check:dom` and `check:schema` verify the rendered output, which is the
 * authority. These cover the generators directly, so a break is reported
 * against the function rather than against thirty routes at once, and so the
 * cases that no page currently exercises are still covered.
 */

describe('localeAlternates', () => {
  it('declares both locales plus x-default, with x-default on Arabic', () => {
    const alternates = localeAlternates('en', '/products/gcc-1250');
    const languages = alternates.languages as Record<string, string>;

    expect(Object.keys(languages).sort()).toEqual(['ar-SA', 'en', 'x-default']);
    expect(languages['x-default']).toBe(languages['ar-SA']);
    expect(languages['x-default']).toContain('/ar/products/gcc-1250');
  });

  it('self-references the canonical for each locale', () => {
    for (const locale of locales) {
      const alternates = localeAlternates(locale, '/contact');
      const languages = alternates.languages as Record<string, string>;
      const self = locale === 'ar' ? languages['ar-SA'] : languages['en'];
      expect(alternates.canonical).toBe(self);
    }
  });

  it('treats the home page path as empty rather than a trailing slash', () => {
    expect(localeAlternates('ar', '/').canonical).toBe(localeAlternates('ar', '').canonical);
    expect(String(localeAlternates('ar', '').canonical)).toMatch(/\/ar$/);
  });

  it('advertises no alternates for a noindex page', () => {
    const alternates = noindexAlternates('en', '/styleguide');
    expect(alternates.languages).toBeUndefined();
    expect(String(alternates.canonical)).toMatch(/\/en\/styleguide$/);
  });
});

describe('productJsonLd', () => {
  it('publishes every specification value and no offer', () => {
    for (const locale of locales) {
      for (const grade of GRADES) {
        const node = productJsonLd(locale, grade, {
          description: 'x',
          canonicalPath: `/products/${grade.code.toLowerCase()}`,
        });

        expect(node['@type']).toBe('Product');
        expect(node.sku).toBe(grade.code);
        expect(node.offers, 'no price exists, so no offer may be published').toBeUndefined();

        const properties = node.additionalProperty as { propertyID: string }[];
        // Ten family-level parameters, plus mesh, D50 and shelf life, plus the
        // coating band on the two treated grades.
        expect(properties).toHaveLength(grade.coatingLevel ? 14 : 13);

        const ids = properties.map((property) => property.propertyID);
        expect(ids).toContain('caco3-purity');
        expect(ids).toContain('mesh');
        expect(ids).toContain('d50');
        expect(ids).toContain('shelf-life');
      }
    }
  });

  it('never emits a null or empty value', () => {
    const node = productJsonLd('ar', GRADES[0]!, { description: 'x', canonicalPath: '/p' });
    const seen = JSON.stringify(node);
    expect(seen).not.toContain(':null');
    expect(seen).not.toContain('""');
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers positions from one and leaves the last item unlinked', () => {
    const node = breadcrumbJsonLd('en', [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: 'GCC-1250' },
    ]);

    const items = node.itemListElement as { position: number; item?: string }[];
    expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(items[2]?.item, 'the current page must not link to itself').toBeUndefined();
    expect(items[1]?.item).toContain('/en/products');
  });
});

describe('faqPageJsonLd', () => {
  it('mirrors every visible question and answer', () => {
    for (const locale of locales) {
      const faqs = getContent(locale).gradeFaqs['GCC-1250'];
      const node = faqPageJsonLd(faqs);
      const entries = node.mainEntity as { name: string; acceptedAnswer: { text: string } }[];

      expect(entries).toHaveLength(Object.keys(faqs).length);
      for (const [, faq] of Object.entries(faqs)) {
        const match = entries.find((entry) => entry.name === faq.question);
        expect(match, faq.question).toBeDefined();
        expect(match?.acceptedAnswer.text).toBe(faq.answer);
      }
    }
  });
});

describe('organizationJsonLd', () => {
  it('omits the fields the source data does not support', () => {
    const node = organizationJsonLd('ar');
    for (const absent of ['telephone', 'sameAs', 'foundingDate', 'numberOfEmployees']) {
      expect(node[absent], `${absent} is an open data item and must be absent`).toBeUndefined();
    }
    expect(node.name).toBe('KMIT');
    expect((node.address as Record<string, string>).addressCountry).toBe('SA');
  });
});
