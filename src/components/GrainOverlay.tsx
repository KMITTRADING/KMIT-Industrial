/**
 * Fixed grain overlay (§8.1, §12). Never interactive, never animated.
 *
 * The texture is an inline SVG turbulence filter rather than a bitmap: it costs
 * no request, tiles without a visible seam, and stays crisp on any DPR.
 */

const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
     <filter id="g" x="0" y="0" width="100%" height="100%">
       <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="180" height="180" filter="url(#g)"/>
   </svg>`
)}`;

export function GrainOverlay() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ ['--grain-url' as string]: `url("${GRAIN}")` }}
    />
  );
}
