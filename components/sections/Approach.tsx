import { getCopy } from '@/content';
import type { Locale } from '@/lib/locales';
import { Label } from '@/components/ui/Label';

/**
 * §5.03 — how KMIT works, without inventing a process.
 *
 * Four principles, one sentence each. No boxes: each column opens with a
 * hairline and an index, the way items are numbered on a drawing sheet. The
 * hairlines draw in on scroll in step 4; here they are simply present.
 */
export function Approach({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section id="approach" className="section-y bg-surface">
      <div className="content">
        <div className="max-w-[52ch]" data-reveal>
          <Label>{copy.approach.label}</Label>
          <h2 className="t-h2 mt-6">{copy.approach.heading}</h2>
          <p className="t-body-l mt-6 text-ink-soft">{copy.approach.lead}</p>
        </div>

        <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {copy.approach.items.map((principle, i) => (
            <li key={principle.index} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
              <span aria-hidden="true" className="block h-px w-full bg-line-strong" />
              <p aria-hidden="true" className="t-index mt-5 text-ink-soft">
                {principle.index}
              </p>
              <h3 className="t-h3 mt-4">{principle.title}</h3>
              <p className="t-body mt-4 text-ink-soft">{principle.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
