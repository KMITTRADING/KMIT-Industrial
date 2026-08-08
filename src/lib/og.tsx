import { ImageResponse } from 'next/og';

import type { ReactElement } from 'react';

/**
 * Open Graph image rendering.
 *
 * The card is technical rather than decorative: a hairline rule, the wordmark,
 * a headline, and a row of specification pairs. It is the same argument the
 * pages make, at share size.
 *
 * **Latin content only, deliberately.** `ImageResponse` renders through Satori,
 * which needs a font supplied as a parsed buffer, and the design system's
 * Alexandria is loaded by `next/font` as woff2, which Satori cannot read.
 * Fetching a TTF at build time to render Arabic would make every build depend
 * on a third-party font host. It is not needed here: grade codes, mesh sizes,
 * D50 ranges, percentages and standard numbers are Latin in both locales by the
 * rule in CLAUDE.md §7, so the card carries identical, correct information for
 * an Arabic reader and an English one. Localised prose stays in `og:title` and
 * `og:description`, which are text and need no font at all. See ADR-035.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

const INK = '#0f1117';
const INK_SECONDARY = '#4a4c56';
const ACCENT = '#3b3eaa';
const SURFACE = '#f8f9fb';
const RULE = '#d8dae3';

export type SpecPair = {
  label: string;
  value: string;
};

export type OgCardOptions = {
  /** Large Latin string: a grade code, or the wordmark on the default card. */
  headline: string;
  /** One Latin line under the headline. */
  subline: string;
  /** Up to four specification pairs along the bottom. */
  specs?: SpecPair[];
};

function card({ headline, subline, specs = [] }: OgCardOptions): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: SURFACE,
        padding: '72px 80px',
        // The one graphic element: an accent bar down the leading edge, the
        // same device the section headers use.
        borderLeft: `16px solid ${ACCENT}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            color: ACCENT,
            fontWeight: 600,
          }}
        >
          KMIT
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 44,
            fontSize: 96,
            fontWeight: 700,
            color: INK,
            letterSpacing: -2,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 34,
            color: INK_SECONDARY,
          }}
        >
          {subline}
        </div>
      </div>

      {specs.length > 0 ? (
        <div
          style={{
            display: 'flex',
            gap: 56,
            borderTop: `2px solid ${RULE}`,
            paddingTop: 32,
          }}
        >
          {specs.map((spec) => (
            <div key={spec.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 20, color: INK_SECONDARY }}>
                {spec.label}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 8,
                  fontSize: 40,
                  fontWeight: 600,
                  color: INK,
                }}
              >
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', borderTop: `2px solid ${RULE}` }} />
      )}
    </div>
  );
}

export function ogImage(options: OgCardOptions): ImageResponse {
  return new ImageResponse(card(options), OG_SIZE);
}
