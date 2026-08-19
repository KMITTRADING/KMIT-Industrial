import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import type { Locale } from '@/lib/locales';
import { Button } from '@/components/ui/Button';
import { StrataRule } from '@/components/ui/StrataRule';
import { StrataFallback } from '@/components/three/StrataFallback';

/**
 * §5.01 — state what KMIT is in two seconds.
 *
 * Three words at display scale, the third carrying the brand gradient. No
 * photograph, and nothing layered over one: the composition is type, white
 * space, and the core sample cropped by the viewport on the trailing side.
 *
 * The gradient fill on the third word declares a solid colour first, so a
 * browser without background-clip support renders brand blue rather than
 * transparent text. That ordering is the whole safety net — never reverse it.
 *
 * The scrim sits between the canvas and the type and is present whether or not
 * WebGL ever initialises (§10): contrast must not depend on the 3D.
 */
export function Hero({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const [first, second, third] = copy.hero.words;

  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[var(--header-h)]"
    >
      {/* The CSS core, always in the markup. The WebGL canvas — when the gate
          in CoreSampleMount lets it load — sits in front of this. Cropped top
          and bottom by the viewport so it reads as continuing beyond frame. */}
      <div
        aria-hidden="true"
        data-core-fallback
        className="pointer-events-none absolute inset-y-[-8%] end-[6%] w-[14vw] max-w-40 min-w-20 sm:end-[10%]"
      >
        <StrataFallback />
      </div>

      {/* The scrim sits between the object and the type and is present whether
          or not WebGL ever initialises: contrast must not depend on the 3D. */}
      <div
        aria-hidden="true"
        data-hero-scrim
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,var(--paper)_0%,var(--paper)_46%,color-mix(in_srgb,var(--paper)_82%,transparent)_68%,transparent_100%)] rtl:bg-[linear-gradient(to_left,var(--paper)_0%,var(--paper)_46%,color-mix(in_srgb,var(--paper)_82%,transparent)_68%,transparent_100%)]"
      />

      <div className="content relative z-20 py-16">
        <div className="flex items-center gap-5">
          <p className="t-label text-brand">{copy.hero.eyebrow}</p>
          <StrataRule variant="row" className="w-24 shrink-0" />
        </div>

        <h1 className="t-display-xl mt-8 max-w-[15ch]">
          <span className="block">{first}</span>
          <span className="block">{second}</span>
          {/* The third word is the argument: materials and minerals are the
              ground, energy is what the top band of the core sample becomes. */}
          <span className="block">
            <span className="text-gradient">{third}</span>
          </span>
        </h1>

        <p className="t-body-l mt-12 max-w-[54ch] text-ink-soft">{copy.hero.lead}</p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button
            href={`mailto:${FACTS.email}?subject=${encodeURIComponent(copy.cta.mailSubject)}`}
          >
            {copy.hero.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
