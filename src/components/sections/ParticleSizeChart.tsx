import { getTranslations } from 'next-intl/server';

import { GRADES } from '@/content/data/grades';
import { cn, formatRange } from '@/lib/utils';

/**
 * Particle-size chart.
 *
 * One measure (median particle size) across five categories (the grades), each
 * an interval rather than a point, on a logarithmic axis. Generated from
 * `src/content/data/grades.ts`, so it can never disagree with the matrix beside
 * it, and it is an SVG rather than an image.
 *
 * Design decisions, in the order the method calls for:
 *
 * - **Form.** The job is comparing magnitude across a small set of named things
 *   where each thing is a range. That is a horizontal range bar, not a curve:
 *   the source data gives a D50 interval per grade, not a distribution, and
 *   drawing a smooth curve through interval endpoints would assert a
 *   distribution shape that was never measured.
 * - **Scale.** Logarithmic. The range spans 1.8 to 55 microns, a factor of 30;
 *   on a linear axis the four fine grades collapse into the first sixth of the
 *   width and the chart stops answering the question it exists to answer.
 * - **Colour.** One series, so colour carries selection rather than identity:
 *   the grade being viewed is accent-700, the rest neutral-500. Both clear the
 *   3:1 non-text contrast floor against the page (8.55:1 and 3.48:1), and they
 *   separate in greyscale as well as in hue. Selection is additionally carried
 *   by a bold row label, so it never rests on colour alone.
 * - **No legend, no tooltip.** A legend box for a single series is noise, and
 *   every value is already printed as text beside its bar, so a tooltip would
 *   repeat what is on screen. The grade matrix on the same page is the table
 *   view.
 *
 * RTL: the SVG carries geometry only, no text, so it can be mirrored wholesale
 * with `rtl:-scale-x-100`. Every label is HTML in a logical grid beside it and
 * mirrors on its own. That is why the labels are not inside the SVG.
 */

/** Axis domain in microns. Chosen to frame the data with a little air. */
const DOMAIN_MIN = 1.5;
const DOMAIN_MAX = 70;
const TICKS = [2, 5, 10, 20, 50];

const LOG_MIN = Math.log10(DOMAIN_MIN);
const LOG_SPAN = Math.log10(DOMAIN_MAX) - LOG_MIN;

/** Position of a value along the track, 0 to 100. */
const position = (microns: number) => ((Math.log10(microns) - LOG_MIN) / LOG_SPAN) * 100;

export type ParticleSizeChartProps = {
  /** Grade code to highlight. Omit on the index, where no grade is in focus. */
  activeGrade?: string;
  className?: string;
};

export async function ParticleSizeChart({ activeGrade, className }: ParticleSizeChartProps) {
  const t = await getTranslations();

  // Finest first: the chart reads as a ladder from the most micronized grade
  // down to the coarsest, which is the order an engineer selects in.
  const rows = [...GRADES].sort((a, b) => a.d50Min - b.d50Min);

  return (
    <figure className={cn('m-0', className)}>
      <figcaption className="measure-prose mb-6 text-sm text-ink-secondary">
        {t('pages.gradePsdIntro')}
      </figcaption>

      <div className="flex flex-col gap-2">
        {rows.map((grade) => {
          const active = grade.code === activeGrade;
          const start = position(grade.d50Min);
          const width = position(grade.d50Max) - start;

          return (
            <div
              key={grade.code}
              className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[6rem_minmax(0,1fr)_9rem]"
            >
              <p
                dir="ltr"
                className={cn(
                  'text-start text-sm tabular-nums',
                  active ? 'font-semibold text-ink-accent' : 'text-ink-secondary',
                )}
              >
                {grade.code}
              </p>

              {/* Geometry only. No text inside, so the whole thing can mirror. */}
              <svg
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden
                className="h-3 w-full rtl:-scale-x-100"
              >
                {TICKS.map((tick) => (
                  <line
                    key={tick}
                    x1={position(tick)}
                    x2={position(tick)}
                    y1="0"
                    y2="12"
                    stroke="var(--color-border-subtle)"
                    strokeWidth="0.25"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <rect
                  x={start}
                  y="2"
                  width={Math.max(width, 1.2)}
                  height="8"
                  rx="1"
                  fill={active ? 'var(--color-accent-700)' : 'var(--color-neutral-500)'}
                />
              </svg>

              <p
                dir="ltr"
                className={cn(
                  'text-start text-xs tabular-nums',
                  active ? 'font-medium text-ink-primary' : 'text-ink-muted',
                )}
              >
                {formatRange(grade.d50Min, grade.d50Max)} {t('units.micron')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Axis. HTML rather than SVG text, so it mirrors with the document. */}
      <div className="mt-3 grid gap-x-4 sm:grid-cols-[6rem_minmax(0,1fr)_9rem]">
        <span aria-hidden className="hidden sm:block" />
        <div className="relative h-5 border-t border-border-default">
          {TICKS.map((tick) => (
            <span
              key={tick}
              dir="ltr"
              style={{ insetInlineStart: `${position(tick)}%` }}
              className="absolute top-1 -translate-x-1/2 text-2xs text-ink-muted tabular-nums rtl:translate-x-1/2"
            >
              {tick}
            </span>
          ))}
        </div>
        <span aria-hidden className="hidden sm:block" />
      </div>

      <p className="mt-4 text-2xs text-ink-muted">{t('pages.gradePsdAxisSize')}</p>
    </figure>
  );
}

export default ParticleSizeChart;
