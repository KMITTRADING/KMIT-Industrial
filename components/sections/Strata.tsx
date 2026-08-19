import { getCopy } from '@/content';
import type { Locale } from '@/lib/locales';
import { Label } from '@/components/ui/Label';

/**
 * §5.04 — the signature scroll, and the defining experience of the site.
 *
 * Progressive enhancement, deliberately inverted from the usual pattern: the
 * default rendering is the plain one. Without JavaScript, and under
 * prefers-reduced-motion, the four steps are an ordinary numbered sequence
 * that reads top to bottom and says everything the animated version says.
 *
 * Step 4 sets data-motion="on" from the scroll driver, and only then does CSS
 * switch the stage to sticky and stack the steps. Building it this way round
 * means the readable version is the one that cannot break — a hydration
 * failure degrades to prose rather than to four invisible paragraphs.
 *
 * All four steps stay in the DOM and in the accessibility tree at every point
 * (§10). Inactive steps are opacity-0 only: never display:none, never
 * visibility:hidden, never aria-hidden.
 */
export function Strata({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section
      id="strata"
      data-strata
      className="section-y"
      style={{ '--steps': copy.strata.steps.length } as React.CSSProperties}
    >
      <div className="content">
        <div className="max-w-[46ch]">
          <Label>{copy.strata.label}</Label>
          <h2 className="t-h2 mt-6">{copy.strata.heading}</h2>
        </div>
      </div>

      {/* The travel container. Its height is what the scroll progress is
          measured against once motion is on; with motion off it collapses to
          the height of its content. */}
      <div data-strata-track className="content mt-16">
        <div data-strata-stage className="grid gap-12 lg:grid-cols-12">
          <ol data-strata-steps className="lg:col-span-5">
            {copy.strata.steps.map((step) => (
              <li
                key={step.index}
                data-strata-step
                className="border-t border-line py-8 first:border-t-0 first:pt-0"
              >
                <p aria-hidden="true" className="t-index text-brand">
                  {step.index}
                </p>
                <h3 className="t-h3 mt-3">{step.title}</h3>
                <p className="t-body mt-3 max-w-[46ch] text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>

          {/* The core sample sits here in step 5. Until then the column simply
              does not exist on small screens and holds its share of the grid on
              large ones, so adding the canvas later shifts nothing. */}
          <div data-strata-figure aria-hidden="true" className="hidden lg:col-span-7 lg:block" />
        </div>
      </div>
    </section>
  );
}
