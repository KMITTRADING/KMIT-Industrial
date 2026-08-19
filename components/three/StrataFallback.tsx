import { BANDS, TOTAL_HEIGHT } from './coreSampleModel';

/**
 * What everyone sees who does not get WebGL: reduced-motion readers, machines
 * with 2 GB or less, browsers without a context, and anyone whose context is
 * lost mid-session.
 *
 * It is not a placeholder for the 3D — it is the same object, drawn in CSS.
 * Same fourteen bands, same authored heights, same colour ramp, read from the
 * same module. The crown band carries a sheen gradient so it still reads as
 * laminated glass against the matte rock below it, which is the one thing the
 * object has to communicate.
 *
 * Rendered on the server and always present in the markup. The WebGL layer,
 * when it loads, sits in front of it.
 */
export function StrataFallback({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col-reverse items-center ${className}`}
      style={{ blockSize: '100%' }}
    >
      {BANDS.map((band, i) => {
        const isCrown = i === BANDS.length - 1;
        return (
          <span
            key={i}
            className="w-full"
            style={{
              blockSize: `${(band.height / TOTAL_HEIGHT) * 100}%`,
              background: isCrown
                ? `linear-gradient(100deg, ${band.color} 0%, color-mix(in srgb, ${band.color} 62%, white) 46%, ${band.color} 100%)`
                : band.color,
              // The seam between beds. A hairline, not a border, so it does not
              // add to the band's height.
              boxShadow: i === 0 ? 'none' : '0 -1px 0 0 rgb(0 0 0 / 0.16)',
            }}
          />
        );
      })}
    </div>
  );
}
