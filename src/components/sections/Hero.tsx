import { dict } from '@/content';
import { pathFor, type Locale } from '@/lib/i18n';
import { StatelessCTA } from '../primitives';
import { HeroCrystalMount } from '../scenes/HeroCrystalMount';

/**
 * Hero (§8.1) — the site's one loud element.
 *
 * The idea: calcite is birefringent, so text behind a calcite crystal is seen
 * twice. The heading passes behind the crystal and splits. This belongs to KMIT
 * specifically because the rhombohedron and the KMIT mark share a geometry —
 * flat planes meeting at oblique angles, no curves anywhere.
 *
 * Structure, and why it is this way:
 *  - the <h1> is real DOM text, first in source order, and is the LCP element.
 *    The canvas is explicitly not allowed to be the LCP candidate (§15.1.7).
 *  - the refracted copies are `aria-hidden` duplicates of the same markup in the
 *    same box, so they register with the real heading without measurement, and
 *    the effect survives with JS disabled and with WebGL absent (§10, §15.1).
 *  - the WebGL layer, when it mounts, covers the static glass and takes over.
 *
 * Banned here and absent: statistics, floating badges, small tags under the
 * buttons, client logos, quarry video (§8.1, §2.1).
 */
export function Hero({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const lines: [string, string] = [d.home.heroLine1, d.home.heroLine2];

  return (
    <section className="hero on-dark">
      <div className="content hero-inner">
        <div className="hero-headline">
          {/*
            A1: the two lines are separate block spans, so a text extractor would
            otherwise read them as one glued word — "تعملمن", "minerals,from".
            An explicit aria-label gives assistive technology and any tool
            reading the accessibility tree the sentence with its space intact,
            and a literal space node does the same for plain text extraction.
          */}
          <h1 className="t-display-xl hero-title" aria-label={`${lines[0]} ${lines[1]}`}>
            <span className="hero-line">{lines[0]} </span>
            <span className="hero-line">{lines[1]}</span>
          </h1>

          {/*
            The two refracted rays. Identical markup and identical box to the
            <h1>, clipped to the crystal outline and offset from one another.
            Hidden from assistive technology: it is the same sentence again.
          */}
          <div className="hero-refract" aria-hidden="true" role="presentation">
            <div
              className="t-display-xl hero-title hero-refract-layer hero-refract-o crystal-clip"
              role="presentation"
            >
              <span className="hero-line">{lines[0]} </span>
              <span className="hero-line">{lines[1]}</span>
            </div>{' '}
            <div
              className="t-display-xl hero-title hero-refract-layer hero-refract-e crystal-clip"
              role="presentation"
            >
              <span className="hero-line">{lines[0]} </span>
              <span className="hero-line">{lines[1]}</span>
            </div>
          </div>

          <CrystalGlass />

          {/* Swaps the static glass for the live scene when the device allows. */}
          <HeroCrystalMount dir={dir} />
        </div>

        <p className="t-body-l hero-lead">{d.home.heroLead}</p>

        <div className="hero-ctas">
          <StatelessCTA href={pathFor(locale, 'about')} variant="primary" chamfer>
            {d.home.heroCtaPrimary}
          </StatelessCTA>{' '}
          <StatelessCTA href={pathFor(locale, 'calcium-carbonate')} variant="secondary">
            {d.home.heroCtaSecondary}
          </StatelessCTA>
        </div>
      </div>

      {/*
        Text equivalent for the scene (§15, §15.1.2). The canvas itself is
        aria-hidden; this sentence is what a screen reader and a crawler get.
      */}
      <p className="sr-only">{d.home.heroSceneDescription}</p>
    </section>
  );
}

/**
 * The crystal's glass body and edges. Rendered as flat faces with a rim light in
 * --brand-mid, matching the lighting rules the WebGL scene follows (§10): the
 * solid is white or clear, and every colour arrives from the light.
 */
function CrystalGlass() {
  const outline = '50,0 92,25 92,75 50,100 8,75 8,25';

  return (
    <svg
      className="hero-glass"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="crystal-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D55A4" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#2B3073" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="crystal-facet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Body tint, kept faint so the split heading stays legible through it. */}
      <polygon points={outline} fill="url(#crystal-body)" />

      {/* The three visible faces of a rhombohedron. */}
      <polygon points="50,0 92,25 50,50 8,25" fill="url(#crystal-facet)" />
      <polygon points="92,25 92,75 50,100 50,50" fill="#1B1F4E" fillOpacity="0.16" />
      <polygon points="8,25 50,50 50,100 8,75" fill="#FFFFFF" fillOpacity="0.04" />

      {/* Rim light and internal edges. */}
      <polygon
        points={outline}
        fill="none"
        stroke="#3D55A4"
        strokeWidth="0.7"
        strokeOpacity="0.95"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points="8,25 50,50 92,25"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points="50,50 50,100"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
