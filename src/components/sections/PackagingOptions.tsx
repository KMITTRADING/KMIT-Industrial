import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { JumboBagIcon, TankerIcon, ValveBagIcon } from '@/components/primitives';
import { PACKAGING_IDS } from '@/content/schema';

import type { ComponentType } from 'react';
import type { IconProps } from '@/components/primitives';
import type { PackagingId } from '@/content/schema';

/**
 * Packaging options.
 *
 * Three formats, each with a photograph from the drop and a drawn icon. The
 * layout deliberately is not three identical cards in a row: the first format
 * takes the wide cell and the other two stack beside it, because 25 kg bags are
 * the format most buyers start from and an equal-thirds grid says the opposite.
 *
 * Photographs are not duotoned here. The buyer is looking at what arrives on
 * their loading dock, and the material's real appearance is the information.
 */

const ICONS: Record<PackagingId, ComponentType<IconProps>> = {
  'paper-valve-bag-25kg': ValveBagIcon,
  'jumbo-bag': JumboBagIcon,
  'bulk-tanker': TankerIcon,
};

const IMAGES: Record<PackagingId, { src: string; width: number; height: number }> = {
  'paper-valve-bag-25kg': {
    src: '/images/packaging/paper-valve-bags-on-pallets.avif',
    width: 2752,
    height: 1536,
  },
  'jumbo-bag': {
    src: '/images/packaging/jumbo-bags-storage.avif',
    width: 2752,
    height: 1536,
  },
  'bulk-tanker': {
    src: '/images/packaging/bulk-silo-tanker-truck.avif',
    width: 2752,
    height: 1536,
  },
};

const ALT: Record<PackagingId, { ar: string; en: string }> = {
  'paper-valve-bag-25kg': {
    ar: 'أكياس ورقية صمامية سعة 25 كجم من كربونات الكالسيوم، مرصوصة على منصات نقل وملفوفة بغلاف انكماشي داخل مستودع',
    en: '25 kg paper valve bags of calcium carbonate stacked on pallets and shrink-wrapped in a warehouse',
  },
  'jumbo-bag': {
    ar: 'صفوف من الأكياس الجامبو البيضاء على منصات خشبية داخل مستودع واسع، مع رافعة شوكية في الممر',
    en: 'Rows of white jumbo bags on wooden pallets in a large warehouse, with a forklift in the aisle',
  },
  'bulk-tanker': {
    ar: 'شاحنة صهريج صومعي لنقل كربونات الكالسيوم السائبة على طريق سريع صحراوي عند الغروب',
    en: 'Silo tanker truck for bulk calcium carbonate on a desert highway at sunset',
  },
};

export async function PackagingOptions({
  locale,
  className,
}: {
  locale: 'ar' | 'en';
  className?: string;
}) {
  const t = await getTranslations();
  const [primary, ...rest] = PACKAGING_IDS;

  const renderFormat = (id: PackagingId, wide: boolean) => {
    const Icon = ICONS[id];
    const image = IMAGES[id];

    return (
      <article
        key={id}
        className="flex flex-col overflow-hidden rounded-md border border-border-subtle bg-surface-page"
      >
        <Image
          src={image.src}
          alt={ALT[id][locale]}
          width={image.width}
          height={image.height}
          sizes={wide ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 28vw, 100vw'}
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="flex items-start gap-3 p-5">
          <Icon className="mt-0.5 size-5 shrink-0 text-ink-accent" />
          <p className="text-sm text-ink-secondary">{t(`packaging.${id}`)}</p>
        </div>
      </article>
    );
  };

  return (
    <div className={className}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {primary ? renderFormat(primary, true) : null}
        <div className="grid gap-5">{rest.map((id) => renderFormat(id, false))}</div>
      </div>

      <div className="mt-10 grid gap-6 border-t border-border-subtle pt-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink-primary">
            {t('sections.storageHeading')}
          </h3>
          <p className="measure-prose text-sm text-ink-secondary">
            {t('sections.storageBody')}
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
          <li>{t('sections.shelfLifeUncoated')}</li>
          <li>{t('sections.shelfLifeCoated')}</li>
        </ul>
      </div>
    </div>
  );
}

export default PackagingOptions;
