import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import { IMAGES } from '@/content/images';
import type { Locale } from '@/lib/locales';
import { Label } from '@/components/ui/Label';

/**
 * §5.06 — who KMIT is, concisely. Short by design: there is nothing here that
 * needs a number to be true.
 *
 * The audience list is the one place the site names its readers, and it names
 * them exactly as the brief does. No client names, because none are verified.
 */
export function About({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section id="about" className="section-y relative z-10 bg-paper">
      <div className="content grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <Label>{copy.about.label}</Label>
          <h2 className="t-h2 mt-6">{copy.about.heading}</h2>

          {copy.about.body.map((paragraph) => (
            <p key={paragraph} className="t-body-l mt-6 max-w-[52ch] text-ink-soft">
              {paragraph}
            </p>
          ))}

          <p className="t-body mt-8 text-ink">
            {copy.about.groupPrefix}{' '}
            <span className="text-brand">{FACTS.group[locale]}</span>
          </p>

          <div className="mt-12">
            <h3 className="t-label text-ink-soft">{copy.about.audienceLabel}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {copy.about.audience.map((item) => (
                <li
                  key={item}
                  className="t-small border border-line px-4 py-2 text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-6" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          <AboutImage locale={locale} />
        </div>
      </div>
    </section>
  );
}

/**
 * The single image slot. Until KMIT photography is supplied, `src` is null and
 * this renders a banded neutral panel at exactly the dimensions the real file
 * will occupy — visibly a slot, never mistakable for a photograph, and with
 * the box already reserved so dropping the real file in shifts nothing.
 *
 * The bands are the core sample's colour ramp seen edge-on, which is why the
 * placeholder still belongs to the design rather than sitting outside it.
 */
function AboutImage({ locale }: { locale: Locale }) {
  const image = IMAGES.about;
  const ratio = `${image.width} / ${image.height}`;

  if (image.src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={image.src}
        alt={image.alt[locale]}
        width={image.width}
        height={image.height}
        className="w-full"
        style={{ aspectRatio: ratio }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={image.alt[locale]}
      className="flex w-full flex-col justify-end gap-px bg-mineral"
      style={{ aspectRatio: ratio }}
    >
      {[
        { c: 'var(--brand)', h: '14%' },
        { c: 'var(--brand-2)', h: '11%' },
        { c: 'var(--line-strong)', h: '17%' },
        { c: 'var(--mineral)', h: '21%' },
      ].map((band) => (
        <span key={band.c} style={{ background: band.c, blockSize: band.h }} />
      ))}
    </div>
  );
}
