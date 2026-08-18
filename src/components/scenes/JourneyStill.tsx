/**
 * Still for one stage of the material journey (§8.4, §10).
 *
 * Vector for the same reasons as the sector stills: sharp at any density, no
 * request, cannot 404. It also has a job the sector stills do not — it is what
 * shows if the WebGL scene fails to build for any reason, so it has to read as
 * a deliberate illustration of the stage rather than as a placeholder.
 *
 * The four stages are the four the scene morphs through: the quarried block,
 * the same block broken, the ground cloud, and the settled powder bed.
 */
export function JourneyStill({ stage }: { stage: number }) {
  const s = Math.max(0, Math.min(3, stage));

  return (
    <svg
      className="scene-static"
      viewBox="0 0 320 200"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="journey-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9CEE4" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="journey-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D55A4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2B3073" stopOpacity="0.66" />
        </linearGradient>
      </defs>

      {/* 01 — the quarried block, whole. */}
      {s === 0 && (
        <g>
          <polygon points="160,34 244,78 160,122 76,78" fill="url(#journey-face)" />
          <polygon points="76,78 160,122 160,172 76,128" fill="url(#journey-side)" />
          <polygon points="244,78 244,128 160,172 160,122" fill="#0E1030" fillOpacity="0.6" />
        </g>
      )}

      {/* 02 — the same block, broken along its own planes. */}
      {s === 1 && (
        <g>
          <polygon points="150,40 214,74 150,108 86,74" fill="url(#journey-face)" />
          <polygon points="86,74 150,108 150,150 86,116" fill="url(#journey-side)" />
          <polygon points="214,74 214,116 150,150 150,108" fill="#0E1030" fillOpacity="0.6" />
          <polygon points="226,96 268,118 226,140 184,118" fill="url(#journey-face)" opacity="0.85" />
          <polygon points="184,118 226,140 226,164 184,142" fill="url(#journey-side)" opacity="0.8" />
          <polygon points="58,110 92,128 58,146 24,128" fill="url(#journey-face)" opacity="0.7" />
        </g>
      )}

      {/* 03 — ground: the mass has become a cloud of particles. */}
      {s === 2 && (
        <g fill="#FFFFFF">
          {Array.from({ length: 74 }, (_, i) => {
            const a = (i * 137.508 * Math.PI) / 180;
            const r = 12 + (i / 74) * 74;
            const cx = 160 + Math.cos(a) * r * 1.25;
            const cy = 100 + Math.sin(a) * r * 0.62;
            return (
              <circle
                key={i}
                cx={Number(cx.toFixed(1))}
                cy={Number(cy.toFixed(1))}
                r={Number((2.4 - (i / 74) * 1.5).toFixed(2))}
                fillOpacity={Number((0.85 - (i / 74) * 0.55).toFixed(2))}
              />
            );
          })}
        </g>
      )}

      {/* 04 — classified: the powder settles into an even bed. */}
      {s === 3 && (
        <g fill="#FFFFFF">
          {Array.from({ length: 96 }, (_, i) => {
            const col = i % 16;
            const row = Math.floor(i / 16);
            const cx = 44 + col * 15.5 + (row % 2) * 7.5;
            const cy = 116 + row * 11;
            return (
              <circle
                key={i}
                cx={Number(cx.toFixed(1))}
                cy={Number(cy.toFixed(1))}
                r="2"
                fillOpacity={Number((0.9 - row * 0.1).toFixed(2))}
              />
            );
          })}
          <ellipse cx="160" cy="112" rx="120" ry="8" fill="#3D55A4" fillOpacity="0.35" />
        </g>
      )}
    </svg>
  );
}
