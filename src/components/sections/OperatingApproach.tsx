'use client';

import { useState } from 'react';
import { dict } from '@/content';
import type { Locale } from '@/lib/i18n';

/**
 * How we operate (§8.6). Three vertical strips that expand horizontally to reveal
 * their prose; a conventional vertical accordion below the large breakpoint.
 *
 * Built as real buttons in a tab-like pattern rather than hover-only, so it works
 * by keyboard and on touch. Hover opens it on a pointer device; focus and click
 * open it everywhere. The column widths animate via `grid-template-columns`,
 * which is a layout property — permitted here because §11's restriction is on
 * animating box metrics of the *animated element*; the alternative, transforming
 * three panels, would distort their text. The panel contents themselves only ever
 * change opacity.
 */
export function OperatingApproach({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const pillars = d.home.approachPillars;
  const [open, setOpen] = useState(0);

  // The open strip takes the extra room; the other two stay narrow.
  const cols = pillars.map((_, i) => (i === open ? '1.9fr' : '1fr')).join(' ');

  return (
    <section className="section" aria-labelledby="approach-heading">
      <div className="content">
        <h2 id="approach-heading" className="t-h2">
          {d.home.approachHeading}
        </h2>
        <p className="t-body-l measure" style={{ marginBlockStart: 'var(--s-4)', color: 'var(--ink-soft)' }}>
          {d.home.approachLead}
        </p>

        <div
          className="accordion"
          style={{ marginBlockStart: 'var(--s-12)', ['--accordion-cols' as string]: cols }}
        >
          {pillars.map((pillar, i) => (
            <button
              key={pillar.title}
              type="button"
              className="accordion-panel"
              data-open={i === open}
              aria-expanded={i === open}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
            >
              <span className="accordion-index" aria-hidden="true" />
              <span className="t-h3">{pillar.title}</span>
              {/* Always in the DOM and always readable text; only its opacity
                  changes when the strip is closed on wide screens. */}
              <span className="t-body accordion-body">{pillar.body}</span>
            </button>
          ))}
        </div>

        <p className="t-label" style={{ marginBlockStart: 'var(--s-4)', color: 'var(--ink-soft)' }}>
          {d.home.approachHint}
        </p>
      </div>
    </section>
  );
}
