import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { Breadcrumbs, SectionHeader } from '@/components/primitives';
import {
  CertificationStrip,
  LogisticsMap,
  ProcessDiagram,
  RfqTeaser,
} from '@/components/sections';
import { PageShell } from '@/components/layout';
import { localeAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

/**
 * Sustainability and facility.
 *
 * The one photography-led page on the site, and the place the plant imagery
 * earns its keep: the quarry, the processing hall, the milling line and the
 * laboratory each illustrate a stage that is otherwise a paragraph.
 *
 * Alt text and dimensions come from docs/asset-map.json. The atmospheric shots
 * are duotoned toward the accent so a set of separately-lit photographs reads
 * as one commissioned shoot; the laboratory image is not, because it is the one
 * frame where the equipment and the sample need to look like themselves.
 */

const IMAGES = {
  quarry: {
    src: '/images/extraction/open-pit-quarry.avif',
    width: 2752,
    height: 1536,
    alt: {
      ar: 'منظر جوي لمحجر مكشوف لاستخراج الحجر الجيري، بمصاطب متدرجة وشاحنات نقل ثقيلة ووحدة كسّارة في الخلفية',
      en: 'Aerial view of an open-pit limestone quarry with stepped benches, haul trucks working the floor, and a crushing plant on the rim',
    },
  },
  plant: {
    src: '/images/processing/kiln-and-plant.avif',
    width: 2752,
    height: 1536,
    alt: {
      ar: 'صالة إنتاج داخلية بصوامع وخزانات من الفولاذ المقاوم للصدأ وشبكة أنابيب نقل ومنصة تحكم',
      en: 'Interior of a processing hall with stainless silos, classifier cones, conveying pipework and a control platform',
    },
  },
  milling: {
    src: '/images/processing/grinding-mills-and-micronizers.avif',
    width: 2752,
    height: 1536,
    alt: {
      ar: 'وحدة طحن ميكروني بمطحنة نفاثة ومصنّف هوائي ومقاييس ضغط، مع تفريغ مسحوق أبيض في وعاء التجميع',
      en: 'Micronizing line: jet mill, air classifier and pressure gauges, with white powder discharging into a collection vessel',
    },
  },
  lab: {
    src: '/images/quality/lab-and-qc-testing.avif',
    width: 2752,
    height: 1536,
    alt: {
      ar: 'فنية مختبر تُحمّل عينة مسحوق في جهاز تحليل، وعلى الشاشة منحنى توزيع حجم الجسيمات',
      en: 'Laboratory technician loading a powder sample into an analyser, with a particle-size distribution curve on the screen',
    },
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('facilityTitle'),
    description: t('facilityDescription'),
    alternates: localeAlternates(locale, '/sustainability-and-facility'),
  };
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const typedLocale: Locale = locale;
  const t = await getTranslations();

  return (
    <PageShell locale={typedLocale}>
      <div className="pt-8">
        <Breadcrumbs
          label={t('ui.breadcrumb')}
          items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.facility') }]}
        />
      </div>

      <div className="pt-8">
        <SectionHeader
          as="h1"
          size="lg"
          title={t('pages.facilityH1')}
          lede={t('pages.facilityAnswerFirst')}
        />
      </div>

      <figure className="duotone-ground mt-10 overflow-hidden rounded-md border border-accent-700">
        <div className="duotone">
          <Image
            src={IMAGES.quarry.src}
            alt={IMAGES.quarry.alt[typedLocale]}
            width={IMAGES.quarry.width}
            height={IMAGES.quarry.height}
            priority
            sizes="(min-width: 1200px) 76rem, 100vw"
            className="w-full object-cover"
          />
        </div>
      </figure>

      {/* -------------------------------------------------------- process */}
      <section aria-labelledby="process-heading" className="mt-section">
        <SectionHeader
          id="process-heading"
          title={t('sections.processHeading')}
          lede={t('sections.processIntro')}
        />
        <ProcessDiagram className="mt-10" />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[IMAGES.plant, IMAGES.milling].map((image) => (
            <figure
              key={image.src}
              className="duotone-ground overflow-hidden rounded-md border border-accent-700"
            >
              <div className="duotone">
                <Image
                  src={image.src}
                  alt={image.alt[typedLocale]}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 768px) 38rem, 100vw"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ lab */}
      <section aria-labelledby="lab-heading" className="mt-section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <div>
            <SectionHeader id="lab-heading" title={t('pages.facilityLabHeading')} />
            <p className="measure-prose mt-6 text-ink-secondary">
              {t('pages.facilityLabBody')}
            </p>
          </div>

          {/* Untinted: the instrument and the sample should look like themselves. */}
          <figure className="overflow-hidden rounded-md border border-border-subtle">
            <Image
              src={IMAGES.lab.src}
              alt={IMAGES.lab.alt[typedLocale]}
              width={IMAGES.lab.width}
              height={IMAGES.lab.height}
              sizes="(min-width: 1024px) 44rem, 100vw"
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </div>
      </section>

      {/* ------------------------------------------------ HSE and environment */}
      <section aria-labelledby="hse-heading" className="mt-section">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeader id="hse-heading" title={t('pages.facilityHseHeading')} />
            <p className="measure-prose mt-6 text-ink-secondary">
              {t('pages.facilityHseBody')}
            </p>
          </div>
          <div>
            <SectionHeader
              id="environment-heading"
              title={t('pages.facilityEnvironmentHeading')}
            />
            <p className="measure-prose mt-6 text-ink-secondary">
              {t('pages.facilityEnvironmentBody')}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- certifications */}
      <section aria-labelledby="standards-heading" className="mt-section">
        <SectionHeader
          id="standards-heading"
          title={t('sections.certificationsHeading')}
          lede={t('sections.certificationsIntro')}
        />
        <CertificationStrip className="mt-10" />
      </section>

      {/* ------------------------------------------------------ logistics */}
      <section aria-labelledby="logistics-heading" className="mt-section">
        <SectionHeader
          id="logistics-heading"
          title={t('sections.logisticsHeading')}
          lede={t('sections.logisticsIntro')}
        />
        <LogisticsMap className="mt-10" />
      </section>

      <RfqTeaser className="mt-section" />
    </PageShell>
  );
}
