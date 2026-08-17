import type { SectorSlug } from '@/lib/sectors';

/**
 * Still for one sector state (§8.3, §9).
 *
 * Drawn as vector rather than a raster export: it stays sharp at any density,
 * costs no request, and cannot 404. Each one shows the same geometry the scene
 * morphs through, in the same white-solid-with-indigo-light treatment.
 */
export function SectorStill({ sector }: { sector: SectorSlug }) {
  return (
    <svg
      className="scene-static"
      viewBox="0 0 320 200"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`face-${sector}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9CEE4" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id={`side-${sector}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D55A4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2B3073" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {sector === 'industrial-minerals' && (
        <g>
          {/* A flat-faced block broken into oblique shards. */}
          <polygon points="160,26 246,72 160,118 74,72" fill={`url(#face-${sector})`} />
          <polygon points="74,72 160,118 160,170 74,124" fill={`url(#side-${sector})`} />
          <polygon points="246,72 246,124 160,170 160,118" fill="#1B1F4E" fillOpacity="0.62" />
          <polygon points="160,26 202,49 160,72 118,49" fill="#FFFFFF" fillOpacity="0.35" />
          <polygon points="252,96 286,114 252,132 218,114" fill={`url(#face-${sector})`} opacity="0.75" />
          <polygon points="34,104 62,118 34,132 6,118" fill={`url(#face-${sector})`} opacity="0.55" />
          <circle cx="286" cy="150" r="2" fill="#FFFFFF" fillOpacity="0.5" />
          <circle cx="272" cy="162" r="1.5" fill="#FFFFFF" fillOpacity="0.4" />
          <circle cx="42" cy="152" r="1.6" fill="#FFFFFF" fillOpacity="0.4" />
        </g>
      )}

      {sector === 'marble-transport' && (
        <g>
          {/* Stacked slabs, offset along their length as though being loaded. */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 132 - i * 17;
            const x = 62 + i * 13;
            return (
              <g key={i}>
                <polygon
                  points={`${x},${y} ${x + 130},${y - 22} ${x + 130},${y - 8} ${x},${y + 14}`}
                  fill={`url(#face-${sector})`}
                  opacity={0.95 - i * 0.06}
                />
                <polygon
                  points={`${x},${y + 14} ${x + 130},${y - 8} ${x + 130},${y - 2} ${x},${y + 20}`}
                  fill={`url(#side-${sector})`}
                  opacity={0.9 - i * 0.06}
                />
              </g>
            );
          })}
          <polygon points="52,152 268,116 268,122 52,158" fill="#1B1F4E" fillOpacity="0.5" />
        </g>
      )}

      {sector === 'solar-panels' && (
        <g>
          {/* A tilted panel grid leaning toward the light. */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => {
              const x = 46 + col * 58 + row * 12;
              const y = 74 + row * 34;
              return (
                <g key={`${row}-${col}`}>
                  <polygon
                    points={`${x},${y} ${x + 44},${y - 12} ${x + 50},${y + 4} ${x + 6},${y + 16}`}
                    fill={`url(#face-${sector})`}
                    opacity={0.92 - row * 0.1}
                  />
                  <polygon
                    points={`${x + 6},${y + 16} ${x + 50},${y + 4} ${x + 50},${y + 8} ${x + 6},${y + 20}`}
                    fill={`url(#side-${sector})`}
                    opacity={0.85 - row * 0.1}
                  />
                </g>
              );
            })
          )}
          {/* The indigo glint the panels return to the moving light. */}
          <polygon points="60,58 96,44 102,58 66,72" fill="#8FA4DC" fillOpacity="0.55" />
        </g>
      )}
    </svg>
  );
}
