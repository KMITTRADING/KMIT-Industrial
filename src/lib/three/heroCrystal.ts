import * as THREE from 'three';
import { getSceneHost, invalidateScenes, registerView } from './sceneHost';
import { bevelledRhombohedron } from './studio';

/**
 * The calcite rhombohedron and its double refraction (§8.1).
 *
 * On B3: the brief names `MeshTransmissionMaterial` as the prime performance
 * suspect. This scene never used it — it already takes B3's preferred route, a
 * single-pass custom shader that samples a texture of the heading twice at two
 * offsets. (The transmission material was on the calcite explorer, and has been
 * removed there.) So the cost here was never multi-pass transmission; what was
 * wrong was that the crystal was far too small and too faint to read at all.
 *
 * Fixed here:
 *  - the solid is roughly three times its old size and much more present
 *  - bevelled edges plus real edge geometry, so it reads as a cut crystal
 *  - it draws into the shared canvas rather than owning a WebGL context
 *
 * The heading stays real DOM text and the LCP element. It is redrawn once into a
 * 2D canvas at exactly its layout position, and the shader refracts that.
 *
 * Screen-space sampling note: under the shared host each view is drawn through a
 * scissor rectangle, so `gl_FragCoord` is relative to the whole canvas, not to
 * the view. The screen UV is therefore derived from clip space in the vertex
 * shader, which is viewport-relative by construction and needs no resolution or
 * DPR uniforms at all.
 */

export type HeroScene = {
  dispose: () => void;
  refresh: () => void;
};

type Options = {
  /** The heading block. Defines the pixel box shared by every layer. */
  box: HTMLElement;
  /** The two heading line elements, measured for the text texture. */
  lineEls: HTMLElement[];
  dir: 'rtl' | 'ltr';
};

const VERTEX = /* glsl */ `
  varying vec3 vNormalView;
  varying vec2 vScreenUV;

  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Viewport-relative 0..1, independent of where the scissor box sits.
    vScreenUV = clip.xy / clip.w * 0.5 + 0.5;
    gl_Position = clip;
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uText;
  uniform float uSplit;    // separation of the two rays, in UV
  uniform float uRefract;  // displacement from the face normal, in UV
  uniform float uAngle;    // orientation of the split axis

  varying vec3 vNormalView;
  varying vec2 vScreenUV;

  void main() {
    vec3 N = normalize(vNormalView);

    // A fixed key direction separates the facets. Under an orthographic camera a
    // Fresnel term alone gives every front face the same value, and the solid
    // reads as a smear.
    vec3 KEY = normalize(vec3(0.42, 0.76, 0.5));
    float facet = clamp(dot(N, KEY) * 0.5 + 0.5, 0.0, 1.0);

    // Flat faces hold a constant normal, so its screen derivative spikes on the
    // edges between them: internal edges for free.
    float edge = clamp(length(fwidth(N)) * 2.2, 0.0, 1.0);
    float rim = pow(1.0 - clamp(abs(N.z), 0.0, 1.0), 3.0);

    /*
     * The text canvas shares the view's box, so screen UV IS its UV — no flip.
     *
     * This used to read 1.0 minus vScreenUV.y, which flipped the sample
     * vertically: three's CanvasTexture defaults to flipY, so the top of the
     * canvas already lands at v = 1, and inverting it again sampled the image
     * upside down. On Latin text that might have passed for distortion; on
     * Arabic it rendered the heading as unreadable mirrored glyphs, which is
     * what made the hero look broken rather than refracted.
     */
    vec2 uv = vScreenUV;
    vec2 disp = N.xy * uRefract;
    vec2 split = vec2(cos(uAngle), sin(uAngle)) * uSplit;

    float o = texture2D(uText, uv + disp).a;
    float e = texture2D(uText, uv + disp + split).a;

    vec3 bodyDeep = vec3(0.055, 0.063, 0.188);  // --night
    vec3 bodyMid  = vec3(0.239, 0.333, 0.643);  // --brand-mid
    vec3 rayO     = vec3(1.0);
    vec3 rayE     = vec3(0.561, 0.643, 0.863);

    // Facet contrast carries the solid; a wider range reads as cut faces rather
    // than as one flat translucent slab.
    vec3 col = mix(bodyDeep, bodyMid, pow(facet, 1.4));
    float a = 0.30 + facet * 0.34 + rim * 0.34;

    // The extraordinary ray is a faint echo, not a second word.
    col = mix(col, rayE, e * 0.26);
    a   = max(a, e * 0.26);
    col = mix(col, rayO, o * 0.96);
    a   = max(a, o * 0.96);

    col = mix(col, vec3(0.78, 0.84, 1.0), edge);
    a   = max(a, edge);

    gl_FragColor = vec4(col, a);
  }
`;

export function createHeroScene({ box, lineEls, dir }: Options): HeroScene {
  const host = getSceneHost();
  /* Deliberately does NOT warm the studio environment. Generating the PMREM is
     the single most expensive one-off in the whole 3D layer — on a machine
     without a GPU it is a ~2.5s block — and the hero is the one scene that
     never samples it: the crystal is a custom ShaderMaterial. Warming it here
     put that cost above the fold, in the critical window, on behalf of scenes
     that sit far below it. Each of those now builds near its own viewport at
     idle and pays for the environment then (B4). */

  const scene = new THREE.Scene();
  // Orthographic in the view's own pixel space, y running down, so scene
  // coordinates and layout coordinates are the same numbers.
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

  const textCanvas = document.createElement('canvas');
  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.minFilter = THREE.LinearFilter;
  textTexture.magFilter = THREE.LinearFilter;
  textTexture.wrapS = THREE.ClampToEdgeWrapping;
  textTexture.wrapT = THREE.ClampToEdgeWrapping;

  const uniforms = {
    uText: { value: textTexture },
    uSplit: { value: 0.01 },
    uRefract: { value: 0.02 },
    uAngle: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  // C1: bevelled, so the edges catch light.
  const geometry = bevelledRhombohedron(0.34, 0.03);
  const crystal = new THREE.Mesh(geometry, material);

  // A shader can draw the boundary between two faces but never the silhouette,
  // where there is no neighbouring face to differ from. Real line geometry does.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 24),
    new THREE.LineBasicMaterial({
      color: 0xaebde8,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  );

  const group = new THREE.Group();
  group.add(crystal);
  group.add(edges);
  scene.add(group);

  /* ---------------------------------------------------------------- text --- */

  let boxWidth = 1;
  let boxHeight = 1;

  function drawText() {
    const boxRect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(boxRect.width * dpr));
    const h = Math.max(1, Math.round(boxRect.height * dpr));

    if (textCanvas.width !== w || textCanvas.height !== h) {
      textCanvas.width = w;
      textCanvas.height = h;
    }

    const ctx = textCanvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.direction = dir;
    ctx.textAlign = dir === 'rtl' ? 'right' : 'left';

    // The browser shapes the text, so Arabic joins and orders correctly. That is
    // the whole reason this is a 2D canvas and not a generated glyph atlas.
    for (const line of lineEls) {
      const rect = line.getBoundingClientRect();
      const style = getComputedStyle(line);
      const size = parseFloat(style.fontSize);
      ctx.font = `${style.fontWeight || '600'} ${size}px ${style.fontFamily}`;
      ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;

      const text = line.textContent ?? '';
      const metrics = ctx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || size * 0.75;
      const descent = metrics.actualBoundingBoxDescent || size * 0.2;
      const centre = rect.top - boxRect.top + rect.height / 2;
      const baseline = centre + (ascent - descent) / 2;
      const x = dir === 'rtl' ? rect.right - boxRect.left : rect.left - boxRect.left;
      ctx.fillText(text, x, baseline);
    }

    textTexture.needsUpdate = true;
  }

  /* -------------------------------------------------------------- layout --- */

  function layout(width: number, height: number) {
    boxWidth = Math.max(1, width);
    boxHeight = Math.max(1, height);

    camera.left = 0;
    camera.right = boxWidth;
    camera.top = 0;
    camera.bottom = -boxHeight;
    camera.updateProjectionMatrix();

    // Placement comes from the same custom properties the CSS fallback uses, so
    // both paths put the crystal in the same spot.
    const cs = getComputedStyle(box);
    const cx = resolveLength(cs.getPropertyValue('--cx'), boxWidth);
    const cy = resolveLength(cs.getPropertyValue('--cy'), boxHeight);
    const r = resolveLength(cs.getPropertyValue('--r'), Math.min(boxWidth, boxHeight));

    group.position.set(cx, -cy, 0);
    // The unit solid spans -0.5..0.5, so the scale factor is the diameter.
    group.scale.setScalar(r * 2);

    // Displacements are in UV, so they scale with the view rather than with px.
    /*
     * Calcite's double refraction is a small offset, not a second copy of the
     * word. These used to be large enough (~25px of split on a wide hero) that
     * the ghost read as its own legible line of text overlapping the real one,
     * which looks like a rendering fault rather than like light through a
     * crystal. Held down to a few pixels the two rays stay visibly one word.
     */
    uniforms.uRefract.value = (r * 0.06) / boxWidth;
    uniforms.uSplit.value = Math.max(3, r * 0.028) / boxWidth;

    drawText();
  }

  /* ---------------------------------------------------------------- loop --- */

  // A full revolution takes 40 seconds (§8.1).
  const SPEED = (Math.PI * 2) / 40;

  const unregister = registerView({
    element: box,
    scene,
    camera,
    resize: layout,
    update(dt) {
      group.rotation.y += SPEED * dt;
      // The optic axis is fixed in the solid, not on the screen.
      uniforms.uAngle.value = group.rotation.y * 0.5;
      // Always animating while on screen — this is the one deliberate
      // autorotation on the site (§8.1), and the host stops it the moment the
      // hero leaves the viewport.
      return true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      textTexture.dispose();
    },
  });

  // Until Alexandria has loaded, the metrics are the fallback font's and the
  // texture would not match the DOM.
  document.fonts?.ready.then(() => {
    const rect = box.getBoundingClientRect();
    layout(rect.width, rect.height);
    invalidateScenes();
  });

  return {
    refresh() {
      const rect = box.getBoundingClientRect();
      layout(rect.width, rect.height);
      invalidateScenes();
    },
    dispose: unregister,
  };
}

/** Resolves a CSS length or percentage against a reference size, in px. */
function resolveLength(raw: string, reference: number): number {
  const value = raw.trim();
  if (!value) return reference / 2;
  if (value.endsWith('%')) return (parseFloat(value) / 100) * reference;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : reference / 2;
}
