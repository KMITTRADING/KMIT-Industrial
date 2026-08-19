import { getCopy } from '@/content';
import { FACTS } from '@/content/facts';
import type { Locale } from '@/lib/locales';
import { Label } from '@/components/ui/Label';

/**
 * §5.05 — Saudi Arabia, then the wider Middle East. The only dark section.
 *
 * No map, embedded or otherwise. A map would either be decorative — in which
 * case it is 200 KB of decoration — or it would imply coverage the facts do
 * not establish. What is drawn instead is a technical diagram: concentric
 * rings, radial ticks, one arc, and the Jeddah node, with the coordinates set
 * as a typographic readout.
 *
 * The rings are decoration and stay recessive; the arc and the node carry the
 * meaning and use the token that clears 3:1 against both ends of the gradient.
 * The arc is drawn on scroll in step 4 via stroke-dashoffset; it is rendered
 * complete here, which is also exactly what reduced motion will get.
 *
 * No country is named. Naming them would imply a presence in each.
 */
export function Region({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section
      id="region"
      className="on-dark section-y relative overflow-hidden bg-[image:var(--gradient)] text-on-dark"
    >
      <div className="content relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <Label tone="on-dark">{copy.region.label}</Label>
          <h2 className="t-h2 mt-6">{copy.region.heading}</h2>
          <p className="t-body-l mt-6 max-w-[46ch] text-on-dark-soft">{copy.region.body}</p>

          <p className="mt-10">
            <span className="sr-only">{copy.region.nodeLabel}: </span>
            <span className="t-coordinate block text-on-dark-soft">{FACTS.coordinates.lat}</span>
            <span className="t-coordinate block text-on-dark-soft">{FACTS.coordinates.lon}</span>
          </p>
        </div>

        <div className="lg:col-span-7">
          <RegionDiagram />
        </div>
      </div>
    </section>
  );
}

/**
 * Drawn at a 1000x1000 viewBox and scaled by its container, so it never drives
 * layout height and cannot shift anything as it loads.
 */
function RegionDiagram() {
  const cx = 500;
  const cy = 500;
  const rings = [120, 220, 320, 420];

  return (
    <svg
      viewBox="0 0 1000 1000"
      role="presentation"
      /* The rings and ticks are symmetric, but the arc is directional: it
         travels outward from the node in the reading direction. Mirroring the
         whole drawing in RTL is the cheapest correct way to mirror the one
         element that needs it. */
      className="mx-auto w-full max-w-[36rem] rtl:-scale-x-100"
      fill="none"
    >
      {rings.map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          stroke="var(--on-dark-line-soft)"
          strokeWidth="1"
          opacity="0.55"
        />
      ))}

      {/* Radial ticks at 15° intervals, longer on the cardinals — the way a
          bearing plate is graduated. */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const cardinal = i % 6 === 0;
        const inner = 430;
        const outer = cardinal ? 462 : 446;
        return (
          <line
            key={i}
            x1={cx + Math.cos(angle) * inner}
            y1={cy + Math.sin(angle) * inner}
            x2={cx + Math.cos(angle) * outer}
            y2={cy + Math.sin(angle) * outer}
            stroke="var(--on-dark-line-soft)"
            strokeWidth={cardinal ? 1.5 : 1}
            opacity={cardinal ? 0.9 : 0.5}
          />
        );
      })}

      {/* The one meaningful stroke: outward from the node, through the region.
          pathLength normalises it to 1 so step 4 can animate the dash offset
          without knowing the geometry. */}
      <path
        data-region-arc
        d={`M ${cx} ${cy} A 380 380 0 0 1 ${cx + 380 * Math.cos((-55 * Math.PI) / 180)} ${
          cy + 380 * Math.sin((-55 * Math.PI) / 180)
        }`}
        stroke="var(--on-dark-line)"
        strokeWidth="2"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />

      {/* The node. A filled square with a hairline cross through it: a survey
          mark, not a map pin. */}
      <g stroke="var(--on-dark-line)" strokeWidth="1.5">
        <line x1={cx - 26} y1={cy} x2={cx + 26} y2={cy} />
        <line x1={cx} y1={cy - 26} x2={cx} y2={cy + 26} />
      </g>
      <rect x={cx - 5} y={cy - 5} width="10" height="10" fill="var(--on-dark)" />
    </svg>
  );
}
