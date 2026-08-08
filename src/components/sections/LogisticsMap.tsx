import { getTranslations } from 'next-intl/server';

import { LocationIcon } from '@/components/primitives';

/**
 * Logistics map.
 *
 * A drawn schematic of the Arabian peninsula with Jeddah marked, not an
 * embedded tile map. Three reasons: there is no map asset in the drop, an
 * embedded map costs a third-party request and a cookie banner, and the
 * information here is coverage rather than an address anyone will navigate to.
 *
 * The geometry is deliberately generalised. It shows which body of coastline
 * the company sits on and which markets it reaches, and it does not pretend to
 * cartographic accuracy it does not have.
 *
 * The lead-time line is honest about what is missing. No city times have been
 * supplied, so the component says so rather than showing a plausible-looking
 * figure.
 */

export async function LogisticsMap({ className }: { className?: string }) {
  const t = await getTranslations();

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-sunken">
          <svg
            viewBox="0 0 400 300"
            role="img"
            aria-label={t('sections.logisticsIntro')}
            className="h-auto w-full"
          >
            {/* Generalised peninsula outline. Not to scale, and not claiming to be. */}
            <path
              d="M96 44 L150 30 L214 40 L268 74 L300 128 L308 186 L272 232 L214 262 L166 254 L128 214 L104 156 L88 104 Z"
              fill="var(--color-accent-50)"
              stroke="var(--color-accent-300)"
              strokeWidth="1.5"
            />

            {/* Coastline hint on the western edge, where Jeddah sits. */}
            <path
              d="M96 44 L88 104 L104 156 L128 214"
              fill="none"
              stroke="var(--color-accent-500)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Reach rings from the origin point. */}
            <circle
              cx="112"
              cy="140"
              r="46"
              fill="none"
              stroke="var(--color-accent-300)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <circle
              cx="112"
              cy="140"
              r="94"
              fill="none"
              stroke="var(--color-accent-300)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <circle
              cx="112"
              cy="140"
              r="150"
              fill="none"
              stroke="var(--color-accent-200)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />

            <circle cx="112" cy="140" r="6" fill="var(--color-accent-700)" />
            <circle
              cx="112"
              cy="140"
              r="12"
              fill="none"
              stroke="var(--color-accent-700)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <dl className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <LocationIcon className="mt-0.5 size-5 shrink-0 text-ink-accent" />
            <div>
              <dt className="text-2xs font-medium text-ink-muted">
                {t('sections.logisticsHqLabel')}
              </dt>
              <dd className="text-sm text-ink-primary">{t('footer.headquarters')}</dd>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <dt className="text-2xs font-medium text-ink-muted">
              {t('sections.logisticsMarketsLabel')}
            </dt>
            <dd className="text-sm text-ink-primary">{t('footer.marketsServed')}</dd>
          </div>

          <p className="border-t border-border-subtle pt-6 text-sm text-ink-muted">
            {t('sections.logisticsLeadTimePending')}
          </p>
        </dl>
      </div>
    </div>
  );
}

export default LogisticsMap;
