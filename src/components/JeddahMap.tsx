import { ICON_BODY, ICON_VIEWBOX } from './brand/marks';

/**
 * Jeddah, drawn (§8.7).
 *
 * A monochrome line map in --brand on --paper. Drawn rather than embedded from a
 * tile provider, which buys four things the brief asks for: no provider branding
 * on the page, no third-party request or cookie, a line weight that matches the
 * icon set, and a marker that is the KMIT icon rather than a default pin.
 *
 * Geographically this is a schematic, not a survey: the Red Sea coast on the west,
 * the corniche, the ring roads and the city grid. It marks the head office city
 * and nothing else — no operating sites or quarries are implied, because none were
 * supplied (§4).
 */
export function JeddahMap({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={label}
      className="jeddah-map"
      /* The map is a diagram, not a directional icon: it never mirrors (§6.3). */
      style={{ direction: 'ltr' }}
    >
      {/* Water on the western side, held as a flat tint. */}
      <path
        d="M0 0 L84 0 C74 42 96 78 78 116 C62 150 88 190 70 226 C56 256 74 282 62 300 L0 300 Z"
        fill="var(--brand)"
        fillOpacity="0.07"
      />
      {/* Coastline. */}
      <path
        d="M84 0 C74 42 96 78 78 116 C62 150 88 190 70 226 C56 256 74 282 62 300"
        fill="none"
        stroke="var(--brand)"
        strokeOpacity="0.5"
        strokeWidth="1.25"
      />

      {/* Corniche, running parallel to the coast. */}
      <path
        d="M104 0 C95 44 116 80 98 118 C82 152 108 192 90 228 C78 256 94 280 84 300"
        fill="none"
        stroke="var(--brand)"
        strokeOpacity="0.34"
        strokeWidth="1.25"
      />

      {/* Two ring roads. */}
      <path
        d="M108 34 C186 18 288 44 330 104 C368 158 344 232 268 268"
        fill="none"
        stroke="var(--brand)"
        strokeOpacity="0.28"
        strokeWidth="1.25"
      />
      <path
        d="M112 90 C168 78 236 96 262 138 C286 178 268 222 214 240"
        fill="none"
        stroke="var(--brand)"
        strokeOpacity="0.22"
        strokeWidth="1.25"
      />

      {/* Arterial roads, all at 0deg or on the diagonal family (§5.4.1). */}
      <g stroke="var(--brand)" strokeOpacity="0.16" strokeWidth="1.25" fill="none">
        <path d="M100 62 H352" />
        <path d="M96 130 H336" />
        <path d="M92 196 H310" />
        <path d="M150 12 V286" />
        <path d="M216 24 V276" />
        <path d="M282 44 V258" />
        <path d="M120 36 L300 216" />
        <path d="M300 84 L156 228" />
      </g>

      {/* City blocks, sparse, as texture rather than detail. */}
      <g fill="var(--brand)" fillOpacity="0.09">
        <rect x="158" y="70" width="50" height="52" />
        <rect x="224" y="70" width="50" height="52" />
        <rect x="158" y="138" width="50" height="50" />
        <rect x="224" y="138" width="50" height="50" />
        <rect x="290" y="138" width="38" height="50" />
        <rect x="158" y="204" width="50" height="40" />
      </g>

      {/* The office marker: the KMIT icon, not a pin. */}
      <g transform="translate(196 126)">
        <line x1="0" y1="-34" x2="0" y2="34" stroke="var(--brand)" strokeWidth="1.25" strokeOpacity="0.5" />
        <line x1="-34" y1="0" x2="34" y2="0" stroke="var(--brand)" strokeWidth="1.25" strokeOpacity="0.5" />
        <rect x="-13" y="-13" width="26" height="26" fill="var(--paper)" />
        {/* Nested <svg> rather than <foreignObject>: it needs no HTML context,
            and it inherits currentColor from this group. */}
        <svg
          x={-10}
          y={-10}
          width={20}
          height={20}
          viewBox={ICON_VIEWBOX}
          style={{ color: 'var(--brand)' }}
          overflow="visible"
        >
          {ICON_BODY}
        </svg>
      </g>
    </svg>
  );
}
