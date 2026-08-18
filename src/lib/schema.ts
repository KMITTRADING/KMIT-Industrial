import { dict } from '@/content';
import { HREFLANG, pathFor, urlFor, type Locale, type RouteKey } from './i18n';
import { SITE } from './site';

/**
 * JSON-LD (§15.1.4). Organization + WebSite + BreadcrumbList, and FAQPage only
 * where the questions and answers are genuinely rendered on the page.
 *
 * Deliberately absent: Product, Review, AggregateRating. There is no real data
 * behind any of them and marking them up anyway breaks Google's policy (§15.1.4).
 * Also absent: geo coordinates and a street address, neither of which was
 * supplied (§4, §15.1.4) — the address stays at city and country level.
 */

const ORG_ID = `${SITE.origin}/#organization`;
const SITE_ID = `${SITE.origin}/#website`;

export function organizationSchema(locale: Locale) {
  const isAr = locale === 'ar';
  return {
    '@type': ['Organization', 'Corporation'],
    '@id': ORG_ID,
    name: isAr ? SITE.nameAr : SITE.nameEn,
    alternateName: isAr ? SITE.nameEn : SITE.nameAr,
    url: urlFor(SITE.origin, locale, 'home'),
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.origin}${SITE.logoFull}`,
    },
    image: `${SITE.origin}${SITE.logoIcon}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: isAr ? SITE.hqCityAr : SITE.hqCityEn,
      addressCountry: 'SA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: isAr ? 'التطوير التجاري' : 'commercial development',
        telephone: SITE.phoneIntl,
        email: SITE.email,
        areaServed: 'SA',
        availableLanguage: ['ar', 'en'],
      },
    ],
    /* Three sectors, stated as the group's lines of work. */
    knowsAbout: isAr
      ? [
          'معالجة المعادن الصناعية وكربونات الكالسيوم',
          'نقل حجر الرخام',
          'ألواح الطاقة الشمسية',
        ]
      : [
          'Industrial minerals and calcium carbonate processing',
          'Marble stone transport',
          'Solar panels',
        ],
    /* TODO-CONTENT: no social accounts supplied, so `sameAs` is omitted rather
       than filled with guessed profile URLs (§4). */
  };
}

export function websiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: urlFor(SITE.origin, locale, 'home'),
    name: locale === 'ar' ? SITE.nameAr : SITE.nameEn,
    inLanguage: [HREFLANG.ar, HREFLANG.en],
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Breadcrumb trail. Home is always the first item; the route's own segments
 * follow, named from the dictionary so the trail reads in the page's language.
 */
export function breadcrumbSchema(locale: Locale, route: RouteKey) {
  const d = dict(locale);
  const items: { name: string; route: RouteKey }[] = [
    { name: d.shell.home, route: 'home' },
  ];

  if (route !== 'home') {
    // A sector detail page sits under the sectors index.
    if (route.startsWith('sectors/')) {
      items.push({ name: d.sectors.h1, route: 'sectors' });
    }
    items.push({ name: d.meta[route as keyof typeof d.meta].title, route });
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: urlFor(SITE.origin, locale, item.route),
    })),
  };
}

/**
 * FAQPage. Only ever emitted for /calcium-carbonate, where every question and
 * answer below is visibly rendered on the page (§15.1.4).
 */
export function faqSchema(locale: Locale) {
  const d = dict(locale);
  return {
    '@type': 'FAQPage',
    mainEntity: d.knowledge.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Wraps a set of nodes into one @graph document. */
export function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** The standard node set for any page, plus optional extras. */
export function pageGraph(locale: Locale, route: RouteKey, extra: object[] = []) {
  return graph([
    organizationSchema(locale),
    websiteSchema(locale),
    breadcrumbSchema(locale, route),
    ...extra,
  ]);
}

export { pathFor };
