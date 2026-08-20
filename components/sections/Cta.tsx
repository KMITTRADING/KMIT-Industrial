import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import type { Locale } from '@/lib/locales';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { StrataRule } from '@/components/ui/StrataRule';

/**
 * §5.07 — convert. A statement, one primary action, and the two direct
 * channels as secondary text.
 *
 * The mailto carries a subject line, so the first message already has a
 * header and lands somewhere sensible rather than as "(no subject)".
 */
export function Cta({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const mailto = `mailto:${FACTS.email}?subject=${encodeURIComponent(copy.cta.mailSubject)}`;

  return (
    <section id="contact" className="section-y relative z-10 bg-paper">
      <div className="content" data-reveal>
        <StrataRule variant="close" className="mb-16" />

        <Label>{copy.cta.label}</Label>
        <h2 className="t-display-l mt-6 max-w-[20ch]">{copy.cta.heading}</h2>

        <div className="mt-12">
          <Button href={mailto}>{copy.cta.primary}</Button>
        </div>

        <dl className="mt-14 grid gap-8 sm:grid-cols-2 sm:max-w-2xl">
          <div>
            <dt className="t-label text-ink-soft">{copy.cta.emailLabel}</dt>
            <dd className="mt-3">
              <a
                href={`mailto:${FACTS.email}`}
                className="t-body-l inline-flex min-h-11 items-center text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
              >
                {FACTS.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="t-label text-ink-soft">{copy.cta.phoneLabel}</dt>
            <dd className="mt-3">
              <a
                href={`tel:${FACTS.phone.dial}`}
                dir="ltr"
                className="t-body-l inline-flex min-h-11 items-center text-ink transition-colors duration-200 ease-[var(--ease-micro)] hover:text-brand"
              >
                {FACTS.phone.display}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
