import { getCopy } from '@/content';
import type { Locale } from '@/lib/locales';
import { Label } from '@/components/ui/Label';
import { StrataRule } from '@/components/ui/StrataRule';

/**
 * §5.02 — the three areas as one system. Explicitly not three cards.
 *
 * Each area is a row on a geological log: index, title, descriptor, body,
 * separated by strata rules. Rows, not boxes, are what let the three read as
 * one structure rather than three parallel offerings.
 *
 * The hover treatment is a gradient edge that grows from the leading edge, a
 * small shift of the title toward the trailing edge, and a 4% brand wash.
 * `focus-within` carries the same treatment, so a keyboard reader sees exactly
 * what a mouse reader sees.
 */
export function Areas({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section id="solutions" className="section-y relative z-10 bg-paper">
      <div className="content">
        <div data-reveal>
          <Label>{copy.areas.label}</Label>
        <h2 className="t-h2 mt-6 max-w-[20ch]">{copy.areas.heading}</h2>
        </div>

        <ol className="mt-16">
          {copy.areas.items.map((area, i) => (
            <li key={area.index} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
              {i === 0 ? <StrataRule variant="row" /> : null}

              <article className="group relative transition-colors duration-300 ease-[var(--ease-micro)] focus-within:bg-brand-wash hover:bg-brand-wash">
                {/* The gradient edge. Scales from the leading edge in both
                    directions — origin-top is the block axis, so RTL needs no
                    override here. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 start-0 w-0.5 origin-top scale-y-0 bg-[image:var(--gradient)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:scale-y-100 group-hover:scale-y-100"
                />

                <div className="grid gap-x-8 gap-y-3 px-4 py-9 md:grid-cols-12 md:py-12">
                  <p aria-hidden="true" className="t-index text-ink-soft md:col-span-1 md:pt-2">
                    {area.index}
                  </p>

                  <h3 className="t-h3 md:col-span-3 md:pt-1 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                    {area.title}
                  </h3>

                  <p className="t-label text-brand md:col-span-3 md:pt-2">{area.descriptor}</p>

                  <p className="t-body max-w-[60ch] text-ink-soft md:col-span-5">{area.body}</p>
                </div>
              </article>

              <StrataRule variant="row" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
