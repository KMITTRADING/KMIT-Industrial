import { FACTS } from '@/content/facts';
import type { Locale } from '@/lib/locales';

/**
 * The supplied mark. `public/brand/logo.svg` is the official Illustrator
 * export — the KMIT wordmark with INDUSTRIAL SOLUTIONS set as outlines — and
 * `icon.svg` is the K on its own. Neither is redrawn, traced or approximated
 * anywhere in this codebase (§2).
 *
 * PLACEHOLDER: no Arabic lockup was supplied, so the English lockup is used on
 * both locales. That is the honest option — typesetting the Arabic name beside
 * the mark would be inventing a lockup nobody approved. The accessible name is
 * still per-locale, so a screen reader on /ar hears the Arabic company name
 * even though the artwork is Latin. When an Arabic SVG arrives it drops in
 * here and nowhere else.
 *
 * Clear-space is enforced by the wrapper's padding rather than by the caller,
 * so the mark cannot be crowded by a flex neighbour: the ratio is half the
 * mark's height on every side, which is the usual minimum for a wordmark.
 */

// The intrinsic ratios of the two supplied files, so height alone sizes them
// and the box is reserved before the SVG loads.
const LOCKUP = { width: 1920, height: 648.6 };
const ICON = { width: 655.3, height: 648.6 };

export function Logo({
  locale,
  variant = 'lockup',
  height = 28,
  className = '',
}: {
  locale: Locale;
  variant?: 'lockup' | 'icon';
  height?: number;
  className?: string;
}) {
  const art = variant === 'lockup' ? LOCKUP : ICON;
  const src = variant === 'lockup' ? '/brand/logo.svg' : '/brand/icon.svg';

  return (
    <span
      className={`inline-block ${className}`}
      style={{ paddingBlock: height * 0.5, paddingInline: height * 0.5 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a static brand
          SVG needs no optimiser, and `images.unoptimized` is set in any case. */}
      <img
        src={src}
        alt={FACTS.name[locale]}
        width={Math.round((art.width / art.height) * height)}
        height={height}
        style={{ height, width: 'auto' }}
      />
    </span>
  );
}
