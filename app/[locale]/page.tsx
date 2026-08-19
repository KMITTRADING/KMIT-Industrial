import { notFound } from 'next/navigation';
import { getCopy } from '@/content';
import { isLocale } from '@/lib/locales';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Areas } from '@/components/sections/Areas';
import { Approach } from '@/components/sections/Approach';
import { Strata } from '@/components/sections/Strata';
import { Region } from '@/components/sections/Region';
import { About } from '@/components/sections/About';
import { Cta } from '@/components/sections/Cta';

/**
 * The whole site. One page, seven sections, in the order the brief sets out.
 *
 * Every section is a server component: none of this ships as JavaScript. The
 * only client code on the page arrives in step 4 (the scroll driver) and step
 * 5 (the core sample), both as small islands.
 */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);

  return (
    <>
      <a href="#main" className="skip-link t-label">
        {copy.nav.skipToContent}
      </a>

      <Header locale={locale} />

      <main id="main">
        <Hero locale={locale} />
        <Areas locale={locale} />
        <Approach locale={locale} />
        <Strata locale={locale} />
        <Region locale={locale} />
        <About locale={locale} />
        <Cta locale={locale} />
      </main>

      <Footer locale={locale} />
    </>
  );
}
