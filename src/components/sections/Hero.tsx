import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { ElementType, ReactNode } from 'react';

/**
 * Hero.
 *
 * Two variants, because eight sections of this site have no photograph and
 * designing around that is the brief, not a compromise:
 *
 * - `photographic` sets a duotone plate image against the accent ground with
 *   the copy beside it. Used where the drop actually has a usable frame.
 * - `typographic` carries the section on type and a data strip instead. This is
 *   the variant for rubber, for certifications, for anything in the gap list.
 *
 * Discipline the component enforces:
 *
 * - Never centred. A centred headline over a centred subhead over two centred
 *   buttons is the single most templated arrangement on the web.
 * - Maximum four text elements: eyebrow (optional), headline, lede, actions.
 *   No trust strip, no tagline under the buttons, no feature bullets. Those are
 *   sections, and they go below.
 * - The lede is capped by measure rather than by word count, so the same limit
 *   works for Arabic and English.
 * - The image is `priority` and carries explicit dimensions, because it is the
 *   LCP element and CLS is a launch gate.
 */

export type HeroProps = {
  variant?: 'photographic' | 'typographic';
  eyebrow?: ReactNode;
  title: ReactNode;
  /**
   * The heading level. `h1` on a real page, because a hero heading is the page
   * heading. The styleguide passes `h2`, since a reference page that renders
   * three heroes must not ship three `h1` elements.
   */
  titleAs?: ElementType;
  lede?: ReactNode;
  actions?: ReactNode;
  /** Compact key readings shown under the copy. Three at most. */
  readings?: { label: ReactNode; value: string }[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
};

export function Hero({
  variant = 'typographic',
  eyebrow,
  title,
  titleAs: Title = 'h1',
  lede,
  actions,
  readings,
  image,
  className,
}: HeroProps) {
  const photographic = variant === 'photographic' && image;

  return (
    <section
      className={cn(
        'border-b border-border-subtle',
        photographic ? 'bg-surface-accent-deep text-ink-inverse' : 'bg-surface-page',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-[76rem] gap-10 px-5 pt-16 pb-section-sm md:px-8 lg:gap-16',
          photographic ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center' : '',
        )}
      >
        <div className="flex flex-col gap-6">
          {eyebrow ? (
            <p className={cn('eyebrow', photographic && 'text-ink-inverse-secondary')}>
              {eyebrow}
            </p>
          ) : null}

          <Title
            className={cn(
              'measure-lede text-4xl font-semibold',
              photographic ? 'text-ink-inverse' : 'text-ink-primary',
            )}
          >
            {title}
          </Title>

          {lede ? (
            <p
              className={cn(
                'measure-prose text-lg',
                photographic ? 'text-ink-inverse-secondary' : 'text-ink-secondary',
              )}
            >
              {lede}
            </p>
          ) : null}

          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>
          ) : null}

          {readings && readings.length > 0 ? (
            <dl
              className={cn(
                'mt-4 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6',
                photographic ? 'border-accent-700' : 'border-border-subtle',
              )}
            >
              {readings.slice(0, 3).map((reading, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <dt
                    className={cn(
                      'text-2xs font-medium',
                      photographic ? 'text-ink-inverse-secondary' : 'text-ink-muted',
                    )}
                  >
                    {reading.label}
                  </dt>
                  <dd
                    dir="ltr"
                    className={cn(
                      'text-start text-xl font-semibold tabular-nums',
                      photographic ? 'text-ink-inverse' : 'text-ink-primary',
                    )}
                  >
                    {reading.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {photographic ? (
          <div className="duotone-ground relative overflow-hidden rounded-md border border-accent-700">
            <div className="duotone">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Hero;
