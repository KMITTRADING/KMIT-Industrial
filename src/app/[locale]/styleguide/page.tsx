import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import {
  ArrowInlineEndIcon,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardPlate,
  ICON_SET,
  SectionHeader,
  SkeletonText,
  StatBlock,
  TableSkeleton,
} from '@/components/primitives';
import {
  ApplicationCard,
  CertificationStrip,
  ContactBlock,
  DocumentDownloadRow,
  FaqAccordion,
  GradeMatrix,
  Hero,
  LogisticsMap,
  PackagingOptions,
  ProcessDiagram,
  RfqTeaser,
  SpecTable,
} from '@/components/sections';
import { DirectionFrame, DirectionProvider } from '@/components/styleguide/DirectionToggle';
import { InteractiveSpecimens } from '@/components/styleguide/InteractiveSpecimens';
import { NextIntlClientProvider } from 'next-intl';
import { routeMessages } from '@/i18n/client-messages';
import { SiteFooter, SiteHeader } from '@/components/layout';
import { Specimen, SpecimenSection, SwatchRow } from '@/components/styleguide/Specimen';
import { SECTOR_IDS } from '@/content/schema';
import { cn } from '@/lib/utils';
import { noindexAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { NavItem } from '@/components/layout';

/**
 * The design system reference.
 *
 * This is the page the design gets approved from, so it is deliberately
 * exhaustive: every token, every primitive in every state, every domain section
 * with the same content the real pages will use, and a direction toggle so RTL
 * and LTR can be compared side by side rather than remembered between reloads.
 *
 * Excluded from search, unambiguously. An indexed styleguide competes with real
 * pages for the same terms and leaks unfinished work into results.
 *
 * The specimen labels are API identifiers, not page copy, and are written in
 * English in both locales on purpose. Everything the components themselves
 * render comes from the localised content tree, so a reviewer reading the
 * Arabic styleguide is reviewing the Arabic product.
 */

/*
 * Class names are written out in full rather than composed at runtime. Tailwind
 * scans source text, so `bg-accent-${stop}` produces no CSS at all: the utility
 * has to appear literally somewhere for it to be generated.
 */
const ACCENT_SWATCHES = [
  { stop: 50, className: 'bg-accent-50' },
  { stop: 100, className: 'bg-accent-100' },
  { stop: 200, className: 'bg-accent-200' },
  { stop: 300, className: 'bg-accent-300' },
  { stop: 400, className: 'bg-accent-400' },
  { stop: 500, className: 'bg-accent-500' },
  { stop: 600, className: 'bg-accent-600' },
  { stop: 700, className: 'bg-accent-700' },
  { stop: 800, className: 'bg-accent-800' },
  { stop: 900, className: 'bg-accent-900' },
] as const;

const NEUTRAL_SWATCHES = [
  { stop: 0, className: 'bg-neutral-0' },
  { stop: 50, className: 'bg-neutral-50' },
  { stop: 100, className: 'bg-neutral-100' },
  { stop: 200, className: 'bg-neutral-200' },
  { stop: 300, className: 'bg-neutral-300' },
  { stop: 400, className: 'bg-neutral-400' },
  { stop: 500, className: 'bg-neutral-500' },
  { stop: 600, className: 'bg-neutral-600' },
  { stop: 700, className: 'bg-neutral-700' },
  { stop: 800, className: 'bg-neutral-800' },
  { stop: 900, className: 'bg-neutral-900' },
  { stop: 950, className: 'bg-neutral-950' },
] as const;

const TEXT_STEPS = [
  { step: '2xs', className: 'text-2xs' },
  { step: 'xs', className: 'text-xs' },
  { step: 'sm', className: 'text-sm' },
  { step: 'base', className: 'text-base' },
  { step: 'lg', className: 'text-lg' },
  { step: 'xl', className: 'text-xl' },
  { step: '2xl', className: 'text-2xl' },
  { step: '3xl', className: 'text-3xl' },
  { step: '4xl', className: 'text-4xl' },
  { step: '5xl', className: 'text-5xl' },
] as const;

const RADIUS_SPECIMENS = [
  { name: 'xs', className: 'rounded-xs' },
  { name: 'sm', className: 'rounded-sm' },
  { name: 'md', className: 'rounded-md' },
  { name: 'lg', className: 'rounded-lg' },
] as const;

/** The Phase 3 route set, so the header mega-menu can be reviewed before it exists. */
const DEMO_NAV: NavItem[] = [
  { key: 'products', href: '/products', mega: 'grades' },
  { key: 'applications', href: '/applications' },
  { key: 'facility', href: '/sustainability-and-facility' },
  { key: 'resources', href: '/resources' },
  { key: 'contact', href: '/contact' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'styleguide' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    alternates: noindexAlternates(locale, '/styleguide'),
  };
}

export default async function StyleguidePage({
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
    <>
      <SiteHeader locale={typedLocale} />

      <main id="main" className="mx-auto max-w-[76rem] px-5 pb-section md:px-8">
        <div className="pt-section-sm">
          <SectionHeader
            as="h1"
            size="lg"
            eyebrow="noindex"
            title={t('styleguide.h1')}
            lede={t('styleguide.intro')}
          />
        </div>

        <DirectionProvider initial={typedLocale === 'ar' ? 'rtl' : 'ltr'}>
          {/* --------------------------------------------------- tokens */}
          <SpecimenSection
            id="colour"
            title="Colour"
            note="One accent family, one neutral ramp tinted toward it, four semantic states. Every shipping pairing is measured in docs/brand-tokens.md."
          >
            <Specimen label="accent ramp" fixedDirection>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {ACCENT_SWATCHES.map((swatch) => (
                  <SwatchRow
                    key={swatch.stop}
                    name={`accent-${swatch.stop}`}
                    variable={`--color-accent-${swatch.stop}`}
                    className={swatch.className}
                  />
                ))}
              </div>
            </Specimen>

            <Specimen label="neutral ramp" fixedDirection>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {NEUTRAL_SWATCHES.map((swatch) => (
                  <SwatchRow
                    key={swatch.stop}
                    name={`neutral-${swatch.stop}`}
                    variable={`--color-neutral-${swatch.stop}`}
                    className={swatch.className}
                  />
                ))}
              </div>
            </Specimen>

            <Specimen label="semantic states" fixedDirection>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SwatchRow name="success" variable="--color-success" className="bg-success" />
                <SwatchRow name="warning" variable="--color-warning" className="bg-warning" />
                <SwatchRow name="danger" variable="--color-danger" className="bg-danger" />
                <SwatchRow name="info" variable="--color-info" className="bg-info" />
              </div>
            </Specimen>

            <Specimen label="surfaces and inks" fixedDirection>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SwatchRow
                  name="surface-page"
                  variable="--color-surface-page"
                  className="bg-surface-page"
                />
                <SwatchRow
                  name="surface-raised"
                  variable="--color-surface-raised"
                  className="bg-surface-raised"
                />
                <SwatchRow
                  name="surface-sunken"
                  variable="--color-surface-sunken"
                  className="bg-surface-sunken"
                />
                <SwatchRow
                  name="surface-accent"
                  variable="--color-surface-accent"
                  className="bg-surface-accent"
                />
                <SwatchRow
                  name="ink-primary"
                  variable="--color-ink-primary"
                  className="bg-ink-primary"
                />
                <SwatchRow
                  name="ink-secondary"
                  variable="--color-ink-secondary"
                  className="bg-ink-secondary"
                />
                <SwatchRow
                  name="ink-muted"
                  variable="--color-ink-muted"
                  className="bg-ink-muted"
                />
                <SwatchRow
                  name="ink-accent"
                  variable="--color-ink-accent"
                  className="bg-ink-accent"
                />
              </div>
            </Specimen>
          </SpecimenSection>

          <SpecimenSection
            id="typography"
            title="Typography"
            note="Alexandria carries both scripts. The scale is fluid; Arabic gets more leading and less negative tracking, applied from the direction rather than the language so a flipped subtree inherits it."
          >
            <Specimen label="scale">
              <div className="flex w-full flex-col gap-4">
                {TEXT_STEPS.map((entry) => (
                  <div key={entry.step} className="flex flex-wrap items-baseline gap-4">
                    <span className="w-16 shrink-0 font-mono text-2xs text-ink-muted">
                      {entry.step}
                    </span>
                    <span className={cn(entry.className, 'text-ink-primary')}>
                      {t('meta.siteName')} {t('meta.tagline')}
                    </span>
                  </div>
                ))}
              </div>
            </Specimen>

            <Specimen
              label="prose measure"
              description="capped by ch, so both scripts land at a comparable optical length"
            >
              <p className="measure-prose text-ink-secondary">{t('home.answerFirst')}</p>
            </Specimen>

            <Specimen label="eyebrow" description="rationed to one per three sections">
              <p className="eyebrow">{t('sections.processHeading')}</p>
            </Specimen>
          </SpecimenSection>

          <SpecimenSection
            id="geometry"
            title="Geometry and motion"
            note="Near-square radii, hairline rules carrying hierarchy, one shadow reserved for overlays, and durations that stay under 300ms."
          >
            <Specimen label="radius" fixedDirection>
              {RADIUS_SPECIMENS.map((radius) => (
                <div key={radius.name} className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      'size-16 border border-border-strong bg-surface-sunken',
                      radius.className,
                    )}
                  />
                  <span className="font-mono text-2xs text-ink-muted">{radius.name}</span>
                </div>
              ))}
            </Specimen>

            <Specimen label="elevation" fixedDirection>
              <div className="rounded-md border border-border-subtle bg-surface-page p-5 text-sm">
                border only
              </div>
              <div className="rounded-md border border-border-subtle bg-surface-sunken p-5 text-sm">
                background step
              </div>
              <div className="rounded-md border border-border-default bg-surface-page p-5 text-sm shadow-raised">
                shadow-raised, overlays only
              </div>
            </Specimen>

            <Specimen label="motion tokens" fixedDirection>
              <dl className="grid w-full gap-2 font-mono text-2xs sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['--duration-press', '120ms'],
                  ['--duration-fast', '160ms'],
                  ['--duration-base', '200ms'],
                  ['--duration-slow', '260ms'],
                  ['--duration-reveal', '300ms'],
                  ['--duration-exit', '140ms'],
                  ['--ease-out-expo', 'cubic-bezier(0.16, 1, 0.3, 1)'],
                  ['--translate-reveal', '12px'],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className="flex justify-between gap-3 border-b border-border-subtle py-2"
                  >
                    <dt className="text-ink-primary">{name}</dt>
                    <dd className="text-ink-muted">{value}</dd>
                  </div>
                ))}
              </dl>
            </Specimen>

            <Specimen label="z-index ladder" fixedDirection>
              <ol className="w-full font-mono text-2xs text-ink-secondary">
                {[
                  'base 0',
                  'sticky 100',
                  'dropdown 200',
                  'overlay 300',
                  'dialog 400',
                  'toast 500',
                  'tooltip 600',
                  'skip-link 700',
                ].map((layer) => (
                  <li key={layer} className="border-b border-border-subtle py-2">
                    {layer}
                  </li>
                ))}
              </ol>
            </Specimen>
          </SpecimenSection>

          {/* ----------------------------------------------- primitives */}
          <SpecimenSection
            id="primitives"
            title="Primitives"
            note="Every variant, size and state. Interactive specimens are live: press them, tab through them, flip the direction and press them again."
          >
            <Specimen label="Button / variants">
              <Button variant="primary">{t('nav.rfq')}</Button>
              <Button variant="secondary">{t('home.ctaProducts')}</Button>
              <Button variant="ghost">{t('ui.close')}</Button>
              <Button variant="link">{t('sections.applicationViewSector')}</Button>
              <Button variant="danger">{t('ui.dismiss')}</Button>
            </Specimen>

            <Specimen label="Button / sizes and states">
              <Button size="sm">sm</Button>
              <Button size="md">md</Button>
              <Button size="lg">lg</Button>
              <Button disabled>disabled</Button>
              <Button loading loadingLabel={t('ui.loading')}>
                {t('ui.loading')}
              </Button>
              <Button iconEnd={<ArrowInlineEndIcon className="size-4 rtl:-scale-x-100" />}>
                {t('sections.documentRequest')}
              </Button>
            </Specimen>

            <Specimen label="Badge">
              <Badge variant="grade">GCC-1250</Badge>
              <Badge variant="certification">ISO 9001</Badge>
              <Badge variant="neutral">{t('grades.uncoated')}</Badge>
              <Badge variant="info">{t('ui.infoLabel')}</Badge>
              <Badge variant="success">{t('ui.successLabel')}</Badge>
              <Badge variant="warning">{t('ui.warningLabel')}</Badge>
              <Badge variant="danger">{t('ui.dangerLabel')}</Badge>
            </Specimen>

            <Specimen label="Card">
              <div className="grid w-full gap-4 lg:grid-cols-3">
                <Card variant="plain">
                  <CardHeader title={t('documents.tds')} meta="PDF" />
                  <CardBody className="mt-3">{t('documentDescriptions.tds')}</CardBody>
                  <CardFooter className="mt-5">
                    <Button size="sm" variant="secondary">
                      {t('sections.documentRequest')}
                    </Button>
                  </CardFooter>
                </Card>
                <Card variant="raised">
                  <CardHeader title={t('sections.storageHeading')} />
                  <CardBody className="mt-3">{t('sections.storageBody')}</CardBody>
                </Card>
                <Card variant="instrument" padding="none">
                  <CardPlate className="p-5">
                    <p className="text-sm text-ink-secondary">
                      instrument tray plus plate, concentric radii. Used once, by the grade
                      matrix.
                    </p>
                  </CardPlate>
                </Card>
              </div>
            </Specimen>

            <Specimen label="SectionHeader">
              <SectionHeader
                title={t('sections.certificationsHeading')}
                lede={t('sections.certificationsIntro')}
              />
            </Specimen>

            <Specimen label="StatBlock">
              <StatBlock
                className="w-full"
                variant="panel"
                stats={[
                  {
                    label: t('parameters.caco3-purity'),
                    value: '98.5',
                    unit: '%',
                    source: 'ISO 3262-1',
                  },
                  {
                    label: t('parameters.whiteness'),
                    value: '95.0-98.5',
                    unit: '%',
                    source: 'ISO 2470',
                  },
                  {
                    label: t('grades.columnD50'),
                    value: '1.8-2.5',
                    unit: 'µm',
                    source: 'GCC-2500',
                  },
                ]}
              />
            </Specimen>

            <Specimen label="Breadcrumbs">
              <Breadcrumbs
                label={t('ui.breadcrumb')}
                items={[
                  { label: t('nav.home'), href: '/' },
                  { label: t('nav.products'), href: '/products' },
                  { label: 'GCC-1250' },
                ]}
              />
            </Specimen>

            <Specimen
              label="Skeleton"
              description="shaped like what is arriving, not a spinner"
            >
              <div className="flex w-full flex-col gap-6">
                <SkeletonText lines={3} />
                <TableSkeleton rows={3} columns={4} label={t('ui.loading')} />
              </div>
            </Specimen>

            <Specimen
              label="IconSet"
              description="drawn for this domain: no library ships a jumbo bag"
            >
              <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-8">
                {Object.entries(ICON_SET).map(([name, IconComponent]) => (
                  <div key={name} className="flex flex-col items-center gap-2 text-center">
                    <IconComponent className="size-6 text-ink-accent" />
                    <span className="font-mono text-2xs text-ink-muted">{name}</span>
                  </div>
                ))}
              </div>
            </Specimen>

            {/*
              The specimens and the interactive grade matrix read namespaces the
              base client payload does not carry. This is an internal, noindex
              route, so it is the right place to pay for them and the wrong place
              to widen the list every page ships.
            */}
            <NextIntlClientProvider
              messages={routeMessages(typedLocale, 'components/styleguide')}
            >
              <InteractiveSpecimens />
            </NextIntlClientProvider>
          </SpecimenSection>

          {/* -------------------------------------------------- sections */}
          <SpecimenSection
            id="sections"
            title="Domain sections"
            note="Rendered with the same content the real pages use. Nothing here is sample text."
          >
            <Specimen
              label="Hero / typographic"
              description="the variant for the eight sections with no photograph"
            >
              <DirectionFrame className="w-full">
                <Hero
                  titleAs="h3"
                  eyebrow={t('meta.tagline')}
                  title={t('home.h1')}
                  lede={t('home.answerFirst')}
                  actions={
                    <>
                      <Button>{t('nav.rfq')}</Button>
                      <Button variant="secondary">{t('home.ctaProducts')}</Button>
                    </>
                  }
                  readings={[
                    { label: t('parameters.caco3-purity'), value: '98.5%' },
                    { label: t('grades.columnMesh'), value: '200-2500' },
                    { label: t('grades.columnD50'), value: '1.8-55 µm' },
                  ]}
                />
              </DirectionFrame>
            </Specimen>

            <Specimen
              label="Hero / photographic"
              description="duotone plate on the accent ground"
            >
              <DirectionFrame className="w-full">
                <Hero
                  variant="photographic"
                  titleAs="h3"
                  title={t('sections.processHeading')}
                  lede={t('sections.processIntro')}
                  actions={<Button variant="secondary">{t('home.ctaProducts')}</Button>}
                  image={{
                    src: '/images/extraction/open-pit-quarry.avif',
                    alt:
                      typedLocale === 'ar'
                        ? 'منظر جوي لمحجر مكشوف لاستخراج الحجر الجيري، بمصاطب متدرجة وشاحنات نقل ثقيلة ووحدة كسّارة في الخلفية'
                        : 'Aerial view of an open-pit limestone quarry with stepped benches, haul trucks working the floor, and a crushing plant on the rim',
                    width: 2752,
                    height: 1536,
                  }}
                />
              </DirectionFrame>
            </Specimen>

            <Specimen
              label="GradeMatrix"
              description="the signature element: filter, sort, sticky header"
            >
              <div className="w-full">
                <NextIntlClientProvider
                  messages={routeMessages(typedLocale, 'components/sections/GradeMatrix')}
                >
                  <GradeMatrix />
                </NextIntlClientProvider>
              </div>
            </Specimen>

            <Specimen label="SpecTable">
              <div className="w-full">
                <SpecTable />
              </div>
            </Specimen>

            <Specimen
              label="ApplicationCard"
              description="grade list derived from the dataset, not written"
            >
              <div className="grid w-full gap-4 lg:grid-cols-3">
                {SECTOR_IDS.map((sector) => (
                  <ApplicationCard
                    key={sector}
                    sector={sector}
                    href={`/applications/${sector}`}
                  />
                ))}
              </div>
            </Specimen>

            <Specimen
              label="CertificationStrip"
              description="a table, because no certificate numbers exist yet"
            >
              <div className="w-full">
                <CertificationStrip />
              </div>
            </Specimen>

            <Specimen label="PackagingOptions">
              <div className="w-full">
                <PackagingOptions locale={typedLocale} />
              </div>
            </Specimen>

            <Specimen
              label="ProcessDiagram"
              description="flows with the reading direction, no mirrored asset"
            >
              <div className="w-full">
                <ProcessDiagram />
              </div>
            </Specimen>

            <Specimen label="LogisticsMap" description="drawn schematic, no third-party tiles">
              <div className="w-full">
                <LogisticsMap />
              </div>
            </Specimen>

            <Specimen
              label="DocumentDownloadRow"
              description="request rows, because the PDFs do not exist yet"
            >
              <div className="w-full">
                <DocumentDownloadRow grade="GCC-1250" />
              </div>
            </Specimen>

            <Specimen label="FaqAccordion" description="the primary answer-engine surface">
              <div className="w-full">
                <FaqAccordion />
              </div>
            </Specimen>

            <Specimen
              label="ContactBlock"
              description="shipping in its empty state, on purpose"
            >
              <div className="w-full">
                <ContactBlock />
              </div>
            </Specimen>

            <Specimen label="RfqTeaser">
              <div className="w-full">
                <RfqTeaser grade="GCC-1250" />
              </div>
            </Specimen>
          </SpecimenSection>

          {/* ---------------------------------------------------- layout */}
          <SpecimenSection
            id="layout"
            title="Layout"
            note="The header is rendered here with the full Phase 3 route set so the mega-menu can be reviewed before those routes exist. The live site passes only routes that are built."
          >
            <Specimen label="SiteHeader / full navigation" fixedDirection>
              <div className="w-full overflow-hidden rounded-md border border-border-subtle">
                <SiteHeader locale={typedLocale} navItems={DEMO_NAV} showRfq />
              </div>
            </Specimen>

            <Specimen label="SiteFooter / full sitemap" fixedDirection>
              <div className="w-full overflow-hidden rounded-md border border-border-subtle">
                <SiteFooter
                  locale={typedLocale}
                  showGrades
                  navLinks={[
                    { key: 'products', href: '/products' },
                    { key: 'applications', href: '/applications' },
                    { key: 'facility', href: '/sustainability-and-facility' },
                    { key: 'resources', href: '/resources' },
                    { key: 'contact', href: '/contact' },
                    { key: 'rfq', href: '/rfq' },
                  ]}
                />
              </div>
            </Specimen>
          </SpecimenSection>
        </DirectionProvider>
      </main>

      <SiteFooter locale={typedLocale} />
    </>
  );
}
