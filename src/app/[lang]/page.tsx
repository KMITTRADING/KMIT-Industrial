import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { IntroStrip } from '@/components/sections/IntroStrip';
import { MaterialJourney } from '@/components/sections/MaterialJourney';
import { OperatingApproach } from '@/components/sections/OperatingApproach';
import { PresenceContact } from '@/components/sections/PresenceContact';
import { SectorsMorph } from '@/components/sections/SectorsMorph';
import { WhyMaterial } from '@/components/sections/WhyMaterial';
import { isLocale, LOCALES, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { pageGraph } from '@/lib/schema';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildMetadata(lang as Locale, 'home');
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <>
      <JsonLd data={pageGraph(locale, 'home')} />
      <Hero locale={locale} />
      <IntroStrip locale={locale} />
      <SectorsMorph locale={locale} />
      <MaterialJourney locale={locale} />
      <WhyMaterial locale={locale} />
      <OperatingApproach locale={locale} />
      <PresenceContact locale={locale} />
    </>
  );
}
